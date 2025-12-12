import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Search, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Filter,
  Menu,
  X,
  BarChart as BarChartIcon,
  PlusCircle,
  MinusCircle,
  Save,
  XCircle,
  Plus,
  Cloud,
  Wifi,
  Lock,
  Pencil,   // NUEVO
  Trash2    // NUEVO
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// --- FIREBASE IMPORTS ---
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getDatabase, 
  ref, 
  onValue, 
  set, 
  update,
  remove // NUEVO IMPORT
} from 'firebase/database';

// --- DATOS INICIALES (Mantengo tu lista original resumida para que el código quepa) ---
// (Si borras la base de datos de Firebase, esto la rellenará automáticamente)
const INITIAL_DATA = [
  { codigo: "TR0134", categoria: "TRANSMISIÓN", material: "Bandas viejas", descripcion: "Bandas viejas", unidad: "UNIDADES", stock: 86 },
  { codigo: "PE0008", categoria: "PERNOS", material: 'Perno 1/4 x 3"', descripcion: 'Perno 1/4 x 3"', unidad: "UNIDADES", stock: 34 }
  // ... El resto de tus datos se cargarán de Firebase si ya existen ...
];

// --- FIREBASE SETUP ---
const firebaseConfig = {
  apiKey: "AIzaSyC9Uu-ZhekT6xffjt-nTLi7vX6pqUJmpKY",
  authDomain: "control-isc.firebaseapp.com",
  databaseURL: "https://control-isc-default-rtdb.firebaseio.com",
  projectId: "control-isc",
  storageBucket: "control-isc.firebasestorage.app",
  messagingSenderId: "496031563894",
  appId: "1:496031563894:web:da5768fee46f04b60b5f57",
  measurementId: "G-FJQK2GDTJ9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const appId = "inventario_compartido";
const DB_PATH = `artifacts/${appId}/public/data/inventory`;

// --- COMPONENTES UI ---
const Card = ({ title, value, icon: Icon, trend, color = "blue" }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg bg-${color}-50 text-${color}-600`}>
        <Icon size={24} />
      </div>
    </div>
    {trend && (
      <div className={`mt-4 text-xs font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'} flex items-center`}>
        {trend === 'up' ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
        {trend === 'up' ? 'Estable' : 'Requiere atención'}
      </div>
    )}
  </div>
);

const Badge = ({ children, type }) => {
  const styles = {
    success: "bg-emerald-100 text-emerald-700 border-emerald-200",
    warning: "bg-amber-100 text-amber-700 border-amber-200",
    danger: "bg-rose-100 text-rose-700 border-rose-200",
    neutral: "bg-slate-100 text-slate-600 border-slate-200"
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[type] || styles.neutral}`}>
      {children}
    </span>
  );
};

// --- MODAL PARA MOVIMIENTOS DE STOCK (Entrada/Salida) ---
const MovementModal = ({ isOpen, onClose, item, onSave }) => {
  const [amount, setAmount] = useState(1);
  const [type, setType] = useState('entry'); 

  if (!isOpen || !item) return null;

  const handleSubmit = () => {
    const finalAmount = parseInt(amount, 10);
    if (isNaN(finalAmount) || finalAmount <= 0) return;
    onSave(item.codigo, finalAmount, type, item.stock);
    setAmount(1); 
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-700">Registrar Movimiento</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <XCircle size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <p className="text-sm text-slate-500 mb-1">Material:</p>
            <p className="font-semibold text-lg text-slate-800">{item.material}</p>
            <p className="text-xs text-slate-400 font-mono">Stock Actual: {item.stock}</p>
          </div>

          <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
            <button 
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${type === 'entry' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => setType('entry')}
            >
              <PlusCircle size={16} /> Entrada
            </button>
            <button 
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${type === 'exit' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => setType('exit')}
            >
              <MinusCircle size={16} /> Salida
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Cantidad</label>
            <input 
              type="number" 
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg font-bold text-center"
              autoFocus
            />
          </div>
          
          {type === 'exit' && (item.stock - amount < 0) && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5" />
              <span>Advertencia: El stock quedará en negativo ({item.stock - amount}).</span>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors">Cancelar</button>
          <button 
            onClick={handleSubmit} 
            className={`flex-1 px-4 py-2 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${type === 'entry' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
          >
            <Save size={18} /> Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MODAL UNIFICADO (CREAR Y EDITAR PRODUCTO) ---
const ProductFormModal = ({ isOpen, onClose, onSave, categories, productToEdit }) => {
  const [formData, setFormData] = useState({
    codigo: '',
    material: '',
    categoria: '',
    unidad: 'UNIDADES',
    stock: 0
  });

  // Efecto para cargar datos si estamos editando
  useEffect(() => {
    if (isOpen) {
      if (productToEdit) {
        // MODO EDICIÓN: Cargar datos existentes
        setFormData({
          codigo: productToEdit.codigo,
          material: productToEdit.material,
          categoria: productToEdit.categoria || 'GENERAL',
          unidad: productToEdit.unidad || 'UNIDADES',
          stock: productToEdit.stock
        });
      } else {
        // MODO CREACIÓN: Limpiar formulario
        setFormData({
          codigo: '',
          material: '',
          categoria: categories[0] || 'GENERAL',
          unidad: 'UNIDADES',
          stock: 0
        });
      }
    }
  }, [isOpen, productToEdit, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.codigo || !formData.material) return;
    onSave(formData, !!productToEdit); // Enviamos flag de si es edición
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-700 flex items-center gap-2">
            {productToEdit ? <Pencil size={20} className="text-blue-500"/> : <Package size={20} className="text-green-500" />} 
            {productToEdit ? 'Editar Producto' : 'Nuevo Producto'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <XCircle size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Código *</label>
              <input 
                required
                type="text" 
                // Bloquear edición del código si ya existe el producto
                disabled={!!productToEdit}
                placeholder="Ej. PE0999"
                className={`w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${productToEdit ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`}
                value={formData.codigo}
                onChange={(e) => setFormData({...formData, codigo: e.target.value})}
              />
              {productToEdit && <span className="text-xs text-slate-400">El código no se puede cambiar.</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
              <input 
                list="category-options"
                type="text" 
                placeholder="Selecciona o escribe..."
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={formData.categoria}
                onChange={(e) => setFormData({...formData, categoria: e.target.value})}
              />
              <datalist id="category-options">
                {categories.map(cat => <option key={cat} value={cat} />)}
              </datalist>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Material *</label>
            <input 
              required
              type="text" 
              placeholder="Ej. Perno Hexagonal 3/4"
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={formData.material}
              onChange={(e) => setFormData({...formData, material: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Unidad</label>
              <select 
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                value={formData.unidad}
                onChange={(e) => setFormData({...formData, unidad: e.target.value})}
              >
                <option value="UNIDADES">UNIDADES</option>
                <option value="JUEGOS">JUEGOS</option>
                <option value="GALONES">GALONES</option>
                <option value="LIBRAS">LIBRAS</option>
                <option value="METROS">METROS</option>
                <option value="CAJAS">CAJAS</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Stock Actual</label>
              <input 
                type="number" 
                min="0"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
             <button type="button" onClick={onClose} className="flex-1 px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">
              Cancelar
            </button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-2">
              <Save size={18} /> {productToEdit ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function InventoryDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  
  const [inventoryData, setInventoryData] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // ESTADO DE MODALES
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  
  const [selectedItem, setSelectedItem] = useState(null); // Para movimientos de stock
  const [editingItem, setEditingItem] = useState(null);   // Para edición completa (Opción C)

  // --- 1. AUTENTICACIÓN ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (error) {
        console.error("Auth failed:", error);
        if (error.code === 'auth/configuration-not-found' || error.message.includes('configuration-not-found')) {
          setAuthError('AUTH_CONFIG_MISSING');
        }
      }
    };
    initAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) setAuthError(null);
      if (!currentUser && !authError) setLoading(false);
    });
    return () => unsubscribe();
  }, [authError]);

  // --- 2. SINCRONIZACIÓN DE DATOS ---
  useEffect(() => {
    if (!user) return;
    const inventoryRef = ref(db, DB_PATH);
    const unsubscribe = onValue(inventoryRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        // Seeding inicial si está vacío
        const updates = {};
        INITIAL_DATA.forEach(item => { updates[item.codigo] = item; });
        update(inventoryRef, updates);
      } else {
        const list = Object.values(data);
        setInventoryData(list);
        setLoading(false);
      }
    }, (error) => {
      console.error("Error fetching data:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  // --- HANDLERS (LOGICA DE NEGOCIO) ---

  // Abrir modal de Stock Rápido
  const handleOpenStockModal = (item) => {
    setSelectedItem(item);
    setIsStockModalOpen(true);
  };

  // Abrir modal para CREAR
  const handleOpenCreateModal = () => {
    setEditingItem(null); // Limpiamos edición
    setIsFormModalOpen(true);
  };

  // Abrir modal para EDITAR (Opción C)
  const handleOpenEditModal = (item) => {
    setEditingItem(item); // Cargamos el item a editar
    setIsFormModalOpen(true);
  };

  // Guardar Movimiento de Stock
  const handleUpdateStock = async (codigo, cantidad, tipo, stockActual) => {
    if (!user) return;
    const adjustment = tipo === 'entry' ? cantidad : -cantidad;
    try {
      await update(ref(db, `${DB_PATH}/${codigo}`), { stock: stockActual + adjustment });
    } catch (e) {
      alert("Error al actualizar stock.");
    }
  };

  // Guardar Producto (Crear o Editar)
  const handleSaveProduct = async (formData, isEditMode) => {
    if (!user) return;
    const itemWithDesc = { ...formData, descripcion: formData.material };
    
    try {
      const itemRef = ref(db, `${DB_PATH}/${formData.codigo}`);
      if (isEditMode) {
        // Si es edición, usamos update para no sobreescribir campos extra si los hubiera
        await update(itemRef, itemWithDesc);
      } else {
        // Si es nuevo, usamos set
        await set(itemRef, itemWithDesc);
        setActiveTab('inventory');
        setSearchTerm(formData.codigo);
      }
    } catch (e) {
      console.error(e);
      alert("Error al guardar el producto.");
    }
  };

  // Eliminar Producto (Opción B)
  const handleDeleteProduct = async (codigo) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este producto permanentemente?")) return;
    
    try {
      await remove(ref(db, `${DB_PATH}/${codigo}`));
      // No necesitamos actualizar el estado local, Firebase avisa y React se repinta solo.
    } catch (e) {
      console.error(e);
      alert("Error al eliminar el producto.");
    }
  };

  // --- CALCULOS KPI ---
  const categoryData = useMemo(() => {
    const counts = {};
    inventoryData.forEach(item => {
      let cat = item.categoria || 'SIN CATEGORÍA';
      if (cat.includes('CHUMAZERAS')) cat = 'CHUMAZERAS';
      counts[cat] = (counts[cat] || 0) + item.stock;
    });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 7);
  }, [inventoryData]);

  const lowStockItems = useMemo(() => {
    return inventoryData.filter(item => item.stock <= 5).sort((a, b) => a.stock - b.stock);
  }, [inventoryData]);

  const filteredData = useMemo(() => {
    return inventoryData.filter(item => {
      const matchesSearch = 
        item.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.codigo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Todas' || item.categoria === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, inventoryData]);

  const categories = ['Todas', ...new Set(inventoryData.map(item => item.categoria).filter(Boolean))];
  const rawCategories = [...new Set(inventoryData.map(item => item.categoria).filter(Boolean))].sort();
  const totalItems = inventoryData.length;
  const totalStock = inventoryData.reduce((acc, item) => acc + item.stock, 0);
  const outOfStock = inventoryData.filter(item => item.stock <= 0).length;

  if (authError === 'AUTH_CONFIG_MISSING') return ( <div className="p-10 text-center">Configura el Auth Anónimo en Firebase Console</div> );
  if (loading) return ( <div className="h-screen flex items-center justify-center bg-emerald-900 text-white">Cargando...</div> );

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-emerald-900 text-white transition-all duration-300 flex flex-col fixed h-full z-20 md:relative shadow-xl`}>
        <div className="p-6 flex flex-col justify-center h-20">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white leading-tight">CONTROL <span className="text-emerald-400">ISC</span></h1>
                <p className="text-xs text-emerald-200 mt-[-2px]">Matagalpa</p>
              </div>
            )}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded hover:bg-emerald-800 text-emerald-100 self-center">
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-emerald-700 text-white shadow-lg' : 'text-emerald-100 hover:bg-emerald-800'}`}>
            <LayoutDashboard size={20} />
            {sidebarOpen && <span>Dashboard General</span>}
          </button>
          <button onClick={() => setActiveTab('inventory')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'inventory' ? 'bg-emerald-700 text-white shadow-lg' : 'text-emerald-100 hover:bg-emerald-800'}`}>
            <Package size={20} />
            {sidebarOpen && <span>Tabla de Materiales</span>}
          </button>
        </nav>
        <div className="p-4 border-t border-emerald-800">
          {sidebarOpen && (
            <div className="text-xs text-emerald-300 flex items-center gap-2">
              <Cloud size={14} />
              <div><p>Estado: En línea</p></div>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{activeTab === 'dashboard' ? 'Visión General' : 'Gestión de Materiales'}</h2>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
               <Wifi size={14} className="text-emerald-500" />
               <span>Base de datos en tiempo real</span>
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card title="Total Productos" value={totalItems} icon={Package} color="blue" trend="up" />
              <Card title="Stock Total" value={totalStock} icon={BarChartIcon} color="emerald" trend="up" />
              <Card title="Agotados" value={outOfStock} icon={AlertTriangle} color="red" trend="down" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Stock por Categoría</h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData} layout="vertical" margin={{ left: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={100} tick={{fill: '#64748b', fontSize: 12}} />
                      <Tooltip cursor={{fill: '#f1f5f9'}} />
                      <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                  <AlertTriangle className="text-amber-500 mr-2" size={20}/> Stock Bajo
                </h3>
                <div className="overflow-y-auto h-80 pr-2 space-y-3">
                  {lowStockItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100">
                      <div className="truncate pr-2">
                        <p className="font-medium text-slate-700 text-sm truncate">{item.material}</p>
                        <p className="text-xs text-slate-400">{item.codigo}</p>
                      </div>
                      <div className="flex items-center gap-2">
                         <Badge type={item.stock <= 0 ? "danger" : "warning"}>{item.stock} un.</Badge>
                         <button onClick={() => handleOpenStockModal(item)} className="p-1 hover:bg-slate-200 rounded text-slate-500">
                           <PlusCircle size={16}/>
                         </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-[calc(100vh-200px)] animate-in fade-in duration-500">
            <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto flex-1">
                 <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Buscar..." 
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Filter size={18} className="text-slate-400" />
                  <select 
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={handleOpenCreateModal} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
                <Plus size={20} /> <span className="hidden sm:inline">Nuevo Material</span>
              </button>
            </div>

            <div className="overflow-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 sticky top-0 z-10">
                  <tr>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase border-b">Código</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase border-b">Material</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase border-b hidden md:table-cell">Categoría</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase border-b text-right">Stock</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase border-b text-center">Estado</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase border-b text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredData.length > 0 ? filteredData.map((item, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/50 transition-colors group">
                      <td className="p-4 text-sm font-medium text-slate-600 font-mono">{item.codigo}</td>
                      <td className="p-4">
                        <p className="text-sm font-semibold text-slate-800">{item.material}</p>
                        <p className="text-xs text-slate-400 md:hidden">{item.categoria}</p>
                      </td>
                      <td className="p-4 text-sm text-slate-600 hidden md:table-cell">
                        <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-xs font-medium text-slate-600">{item.categoria}</span>
                      </td>
                      <td className={`p-4 text-lg font-bold text-right ${item.stock < 0 ? 'text-red-600' : 'text-slate-800'}`}>{item.stock}</td>
                      <td className="p-4 text-center">
                        {item.stock <= 0 ? <Badge type="danger">Agotado</Badge> : item.stock <= 5 ? <Badge type="warning">Bajo</Badge> : <Badge type="success">En Stock</Badge>}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                           {/* BOTÓN AJUSTAR STOCK */}
                          <button onClick={() => handleOpenStockModal(item)} className="text-blue-600 hover:text-blue-800 p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors" title="Ajustar Stock Rápido">
                            <PlusCircle size={18} />
                          </button>
                          
                          {/* NUEVO: BOTÓN EDITAR */}
                          <button onClick={() => handleOpenEditModal(item)} className="text-amber-600 hover:text-amber-800 p-2 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors" title="Editar Detalles">
                            <Pencil size={18} />
                          </button>

                          {/* NUEVO: BOTÓN ELIMINAR */}
                          <button onClick={() => handleDeleteProduct(item.codigo)} className="text-red-600 hover:text-red-800 p-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors" title="Eliminar Producto">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="6" className="p-8 text-center text-slate-400">No hay resultados.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-slate-100 text-xs text-slate-400 flex justify-between">
              <span>Mostrando {filteredData.length} registros</span>
            </div>
          </div>
        )}
      </main>

      {/* Modales */}
      <MovementModal 
        isOpen={isStockModalOpen} 
        onClose={() => setIsStockModalOpen(false)} 
        item={selectedItem}
        onSave={handleUpdateStock}
      />
      
      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveProduct}
        categories={rawCategories}
        productToEdit={editingItem} // Pasamos el item si estamos editando
      />

    </div>
  );
}
