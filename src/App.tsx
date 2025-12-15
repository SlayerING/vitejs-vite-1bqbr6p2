import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  PlusCircle,
  MinusCircle,
  Save,
  XCircle,
  Plus,
  Cloud,
  Wifi,
  Lock,
  Unlock, 
  Pencil,
  Trash2,
  History,
  DollarSign,
  Upload,
  Percent,
  Truck,    
  Users,    
  CheckCircle2,
  Download,
  Shield, 
  Eye     
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
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
  remove,
  push,
  onDisconnect // IMPORTANTE: Para detectar desconexiones
} from 'firebase/database';

// --- DATOS INICIALES ---
const INITIAL_DATA = [
  { codigo: "TR0134", categoria: "TRANSMISIÓN", material: "Bandas viejas", descripcion: "Bandas viejas", unidad: "UNIDADES", stock: 86, costo: 0, aplicaIVA: true },
  { codigo: "PE0128", categoria: "PERNOS", material: 'Perno 1/4 x 4"', descripcion: 'Perno 1/4 x 4"', unidad: "UNIDADES", stock: 25, costo: 0.50, aplicaIVA: true },
];

// --- CONFIGURACIÓN DE SEGURIDAD ---
const ADMIN_PIN = "2442"; 

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
const HISTORY_PATH = `artifacts/${appId}/public/data/history`;
const SETTINGS_PATH = `artifacts/${appId}/public/data/settings`;
const SUPPLIERS_PATH = `artifacts/${appId}/public/data/suppliers`; 
const PRESENCE_PATH = `artifacts/${appId}/public/data/presence`; // Nueva ruta para usuarios conectados

// --- COMPONENTES UI ---
const Card = ({ title, value, icon: Icon, trend, color = "blue", subtitle }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-lg bg-${color}-50 text-${color}-600`}>
        <Icon size={24} />
      </div>
    </div>
    {trend && (
      <div className={`mt-4 text-xs font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'} flex items-center`}>
        {trend === 'up' ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
        {trend === 'up' ? 'Positivo' : 'Atención'}
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

// --- LOGIN MODAL ---
const AdminLoginModal = ({ isOpen, onClose, onLogin }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      onLogin();
      onClose();
      setPin("");
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-6 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Lock size={32} className="text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Acceso Administrador</h3>
          <p className="text-sm text-slate-500 mb-6">Ingresa el PIN para modificar datos.</p>
          
          <form onSubmit={handleSubmit}>
            <input 
              type="password" 
              className={`w-full text-center text-2xl tracking-widest p-3 border rounded-lg focus:outline-none focus:ring-2 ${error ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-500'}`}
              placeholder="••••"
              maxLength={4}
              autoFocus
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
            {error && <p className="text-red-500 text-xs mt-2">PIN incorrecto</p>}
            
            <div className="flex gap-3 mt-6">
              <button type="button" onClick={onClose} className="flex-1 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancelar</button>
              <button type="submit" className="flex-1 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium">Entrar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- MODALES DE ACCION ---
const MovementModal = ({ isOpen, onClose, item, onSave }) => {
  const [amount, setAmount] = useState(1);
  const [type, setType] = useState('entry'); 

  if (!isOpen || !item) return null;

  const handleSubmit = () => {
    const finalAmount = parseInt(amount, 10);
    if (isNaN(finalAmount) || finalAmount <= 0) return;
    onSave(item.codigo, finalAmount, type, item.stock, item.material);
    setAmount(1); 
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-700">Registrar Movimiento</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><XCircle size={24} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <p className="text-sm text-slate-500 mb-1">Material:</p>
            <p className="font-semibold text-lg text-slate-800">{item.material}</p>
            <p className="text-xs text-slate-400 font-mono">Stock Actual: {item.stock}</p>
          </div>
          <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
            <button className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${type === 'entry' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`} onClick={() => setType('entry')}><PlusCircle size={16} /> Entrada</button>
            <button className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${type === 'exit' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`} onClick={() => setType('exit')}><MinusCircle size={16} /> Salida</button>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Cantidad</label>
            <input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg font-bold text-center" autoFocus />
          </div>
          {type === 'exit' && (item.stock - amount < 0) && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5" /> <span>Advertencia: El stock quedará en negativo ({item.stock - amount}).</span>
            </div>
          )}
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors">Cancelar</button>
          <button onClick={handleSubmit} className={`flex-1 px-4 py-2 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${type === 'entry' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}><Save size={18} /> Confirmar</button>
        </div>
      </div>
    </div>
  );
};

const ProductFormModal = ({ isOpen, onClose, onSave, categories, productToEdit }) => {
  const [formData, setFormData] = useState({ codigo: '', material: '', categoria: '', unidad: 'UNIDADES', stock: 0, costo: 0, aplicaIVA: true });

  useEffect(() => {
    if (isOpen) {
      if (productToEdit) {
        setFormData({ ...productToEdit, aplicaIVA: productToEdit.aplicaIVA !== undefined ? productToEdit.aplicaIVA : true });
      } else {
        setFormData({ codigo: '', material: '', categoria: categories[0] || 'GENERAL', unidad: 'UNIDADES', stock: 0, costo: 0, aplicaIVA: true });
      }
    }
  }, [isOpen, productToEdit, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.codigo || !formData.material) return;
    onSave(formData, !!productToEdit); 
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-700 flex items-center gap-2">
            {productToEdit ? <Pencil size={20} className="text-blue-500"/> : <Package size={20} className="text-green-500" />} {productToEdit ? 'Editar Producto' : 'Nuevo Producto'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><XCircle size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Código *</label>
              <input required type="text" disabled={!!productToEdit} placeholder="Ej. PE0999" className={`w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${productToEdit ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`} value={formData.codigo} onChange={(e) => setFormData({...formData, codigo: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
              <input list="category-options" type="text" placeholder="Selecciona..." className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" value={formData.categoria} onChange={(e) => setFormData({...formData, categoria: e.target.value})} />
              <datalist id="category-options">{categories.map(cat => <option key={cat} value={cat} />)}</datalist>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Material *</label>
            <input required type="text" placeholder="Ej. Perno Hexagonal 3/4" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" value={formData.material} onChange={(e) => setFormData({...formData, material: e.target.value})} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Unidad</label>
              <select className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" value={formData.unidad} onChange={(e) => setFormData({...formData, unidad: e.target.value})}>
                <option value="UNIDADES">UNIDADES</option><option value="JUEGOS">JUEGOS</option><option value="GALONES">GALONES</option><option value="LIBRAS">LIBRAS</option><option value="METROS">METROS</option><option value="CAJAS">CAJAS</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Stock</label>
              <input type="number" min="0" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" value={formData.stock} onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Costo Unit.</label>
              <div className="relative"><span className="absolute left-3 top-2 text-slate-400">$</span><input type="number" min="0" step="0.01" className="w-full p-2 pl-6 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" value={formData.costo} onChange={(e) => setFormData({...formData, costo: parseFloat(e.target.value) || 0})} /></div>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="ivaCheck" checked={formData.aplicaIVA} onChange={(e) => setFormData({...formData, aplicaIVA: e.target.checked})} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300" />
            <label htmlFor="ivaCheck" className="text-sm font-medium text-slate-700 flex items-center gap-1">Aplica IVA (15%)</label>
          </div>
          <div className="pt-4 flex gap-3">
             <button type="button" onClick={onClose} className="flex-1 px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">Cancelar</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-2"><Save size={18} /> {productToEdit ? 'Actualizar' : 'Guardar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- COMPONENTE DE PROVEEDORES ---
const SuppliersView = ({ isAdmin, suppliersData, inventoryData }) => {
  const [activeTab, setActiveTab] = useState('list');
  const [newSupplier, setNewSupplier] = useState({ nombre: '', contacto: '', telefono: '' });
  const [selectedProduct, setSelectedProduct] = useState('');
  const [comparisonData, setComparisonData] = useState([]);

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    if(!newSupplier.nombre) return;
    try {
      await push(ref(db, SUPPLIERS_PATH), newSupplier);
      setNewSupplier({ nombre: '', contacto: '', telefono: '' });
      alert("Proveedor agregado");
    } catch (e) { alert("Error al guardar"); }
  };

  const handleDeleteSupplier = async (id) => {
    if(window.confirm("¿Borrar proveedor?")) await remove(ref(db, `${SUPPLIERS_PATH}/${id}`));
  };

  const addComparisonRow = () => setComparisonData([...comparisonData, { supplierId: '', price: 0 }]);
  const updateComparisonRow = (idx, field, value) => {
    const newData = [...comparisonData];
    newData[idx][field] = value;
    setComparisonData(newData);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex gap-4">
        <button onClick={() => setActiveTab('list')} className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'list' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>Directorio</button>
        <button onClick={() => setActiveTab('compare')} className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'compare' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>Comparador</button>
      </div>

      <div className="p-6 overflow-y-auto flex-1">
        {activeTab === 'list' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {isAdmin && (
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4">Agregar Nuevo Proveedor</h3>
                <form onSubmit={handleAddSupplier} className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <input placeholder="Nombre Empresa" className="w-full p-2 border rounded" value={newSupplier.nombre} onChange={e => setNewSupplier({...newSupplier, nombre: e.target.value})} required />
                  <input placeholder="Nombre Contacto" className="w-full p-2 border rounded" value={newSupplier.contacto} onChange={e => setNewSupplier({...newSupplier, contacto: e.target.value})} />
                  <input placeholder="Teléfono / Email" className="w-full p-2 border rounded" value={newSupplier.telefono} onChange={e => setNewSupplier({...newSupplier, telefono: e.target.value})} />
                  <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Guardar Proveedor</button>
                </form>
              </div>
            )}
            <div className={!isAdmin ? "lg:col-span-2" : ""}>
              <h3 className="text-lg font-bold text-slate-800 mb-4">Lista de Proveedores</h3>
              <div className="space-y-3">
                {suppliersData.length === 0 && <p className="text-slate-400 italic">No hay proveedores registrados.</p>}
                {suppliersData.map(sup => (
                  <div key={sup.id} className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                    <div>
                      <p className="font-bold text-slate-800">{sup.nombre}</p>
                      <p className="text-xs text-slate-500">{sup.contacto} • {sup.telefono}</p>
                    </div>
                    {isAdmin && <button onClick={() => handleDeleteSupplier(sup.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={16}/></button>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">Comparador de Precios</h3>
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Selecciona un Material para cotizar:</label>
              <select className="w-full p-3 border border-slate-300 rounded-lg mb-4" value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}>
                <option value="">-- Selecciona Material --</option>
                {inventoryData.map(item => <option key={item.codigo} value={item.material}>{item.material} ({item.codigo})</option>)}
              </select>
              
              {selectedProduct && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-slate-700">Cotizaciones</h4>
                    {isAdmin && <button onClick={addComparisonRow} className="text-sm text-blue-600 font-medium flex items-center gap-1"><PlusCircle size={16}/> Agregar Cotización</button>}
                  </div>
                  {comparisonData.map((row, idx) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <select className="flex-1 p-2 border rounded" value={row.supplierId} onChange={e => updateComparisonRow(idx, 'supplierId', e.target.value)} disabled={!isAdmin}>
                        <option value="">Selecciona Proveedor...</option>
                        {suppliersData.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                      </select>
                      <div className="relative w-32">
                        <span className="absolute left-2 top-2 text-slate-400">$</span>
                        <input type="number" className="w-full p-2 pl-6 border rounded" placeholder="0.00" value={row.price} onChange={e => updateComparisonRow(idx, 'price', parseFloat(e.target.value))} disabled={!isAdmin} />
                      </div>
                    </div>
                  ))}
                  {comparisonData.length > 1 && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                      <p className="text-green-800 font-bold text-lg">
                        Mejor opción: {(() => {
                          const valid = comparisonData.filter(d => d.price > 0 && d.supplierId);
                          if(valid.length === 0) return "--";
                          const best = valid.reduce((min, curr) => curr.price < min.price ? curr : min, valid[0]);
                          const sup = suppliersData.find(s => s.id === best.supplierId);
                          return `${sup?.nombre || 'Desconocido'} a $${best.price}`;
                        })()}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InventoryDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [logoUrl, setLogoUrl] = useState("https://cdn-icons-png.flaticon.com/512/2897/2897785.png");
  const [onlineUsers, setOnlineUsers] = useState(1); // Nuevo estado para usuarios conectados
  
  // ESTADOS PRINCIPALES
  const [isAdmin, setIsAdmin] = useState(false); // ESTADO DE PERMISOS
  const [inventoryData, setInventoryData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [suppliersData, setSuppliersData] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // MODALES
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const fileInputRef = useRef(null);

  // --- 1. AUTENTICACIÓN FIREBASE ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (error) {
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

  // --- 2. DATA SYNC Y PRESENCIA ---
  useEffect(() => {
    if (!user) return;
    
    // a) Inventario
    const inventoryRef = ref(db, DB_PATH);
    const unsubscribeInv = onValue(inventoryRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        const updates = {};
        INITIAL_DATA.forEach(item => { updates[item.codigo] = item; });
        update(inventoryRef, updates);
      } else {
        setInventoryData(Object.values(data));
        setLoading(false);
      }
    });

    // b) Historial
    const historyRef = ref(db, HISTORY_PATH);
    const unsubscribeHist = onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      setHistoryData(data ? Object.values(data).sort((a, b) => b.timestamp - a.timestamp) : []);
    });

    // c) Proveedores
    const suppliersRef = ref(db, SUPPLIERS_PATH);
    const unsubscribeSup = onValue(suppliersRef, (snapshot) => {
      const data = snapshot.val();
      setSuppliersData(data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : []);
    });

    // d) Logo
    const settingsRef = ref(db, `${SETTINGS_PATH}/logo`);
    const unsubscribeLogo = onValue(settingsRef, (snapshot) => {
      if (snapshot.exists()) setLogoUrl(snapshot.val());
    });

    // e) PRESENCIA EN TIEMPO REAL
    // Referencia especial de Firebase que detecta conexión
    const connectedRef = ref(db, ".info/connected");
    const presenceRef = ref(db, `artifacts/${appId}/public/data/presence`);
    
    const unsubscribeConnected = onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        // Al conectar, registrar este usuario
        const myPresenceRef = push(presenceRef); // Crea un ID único para esta sesión
        // Cuando se desconecte (cierre pestaña/internet), eliminar este registro
        import('firebase/database').then(({ onDisconnect }) => {
           onDisconnect(myPresenceRef).remove();
           set(myPresenceRef, {
             user: user.uid,
             connectedAt: Date.now()
           });
        });
      }
    });

    // Escuchar cuántos registros de presencia hay
    const unsubscribePresenceCount = onValue(presenceRef, (snap) => {
      if (snap.exists()) {
        setOnlineUsers(Object.keys(snap.val()).length);
      } else {
        setOnlineUsers(1);
      }
    });

    return () => {
      unsubscribeInv();
      unsubscribeHist();
      unsubscribeSup();
      unsubscribeLogo();
      unsubscribeConnected();
      unsubscribePresenceCount();
    };
  }, [user]);

  // --- CSV EXPORT ---
  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) { alert("No hay datos."); return; }
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${(row[header] || '').toString().replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
  };

  // --- HANDLERS (MODALES) ---
  const handleOpenStockModal = (item) => {
    setSelectedItem(item);
    setIsStockModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setIsFormModalOpen(true);
  };

  // --- HANDLERS (PROTEGIDOS POR isAdmin) ---
  const handleLogoClick = () => { if(isAdmin) fileInputRef.current?.click(); };
  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 500 * 1024) return alert("Imagen > 500KB");
      const reader = new FileReader();
      reader.onloadend = () => set(ref(db, `${SETTINGS_PATH}/logo`), reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateStock = async (codigo, cantidad, tipo, stockActual, nombreMaterial) => {
    if (!user || !isAdmin) return;
    const adjustment = tipo === 'entry' ? cantidad : -cantidad;
    try {
      await update(ref(db, `${DB_PATH}/${codigo}`), { stock: stockActual + adjustment });
      await push(ref(db, HISTORY_PATH), {
        timestamp: Date.now(),
        fecha: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
        codigo, material: nombreMaterial,
        tipo: tipo === 'entry' ? 'Entrada' : 'Salida',
        cantidad, stockAnterior: stockActual, stockNuevo: stockActual + adjustment,
        usuario: 'Admin'
      });
    } catch (e) { alert("Error al actualizar."); }
  };

  const handleSaveProduct = async (formData, isEditMode) => {
    if (!user || !isAdmin) return;
    try {
      const itemRef = ref(db, `${DB_PATH}/${formData.codigo}`);
      const itemWithDesc = { ...formData, descripcion: formData.material };
      if (isEditMode) await update(itemRef, itemWithDesc);
      else { await set(itemRef, itemWithDesc); setActiveTab('inventory'); setSearchTerm(formData.codigo); }
    } catch (e) { alert("Error al guardar."); }
  };

  const handleDeleteProduct = async (codigo) => {
    if (!isAdmin) return;
    if (window.confirm("¿Borrar permanentemente?")) await remove(ref(db, `${DB_PATH}/${codigo}`));
  };

  // --- CALCULOS KPI ---
  const filteredData = useMemo(() => {
    return inventoryData.filter(item => {
      const matchSearch = item.material.toLowerCase().includes(searchTerm.toLowerCase()) || item.codigo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = selectedCategory === 'Todas' || item.categoria === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [searchTerm, selectedCategory, inventoryData]);

  const categories = ['Todas', ...new Set(inventoryData.map(item => item.categoria).filter(Boolean))];
  const rawCategories = [...new Set(inventoryData.map(item => item.categoria).filter(Boolean))].sort();
  const totalValue = inventoryData.reduce((acc, item) => acc + (item.stock * parseFloat(item.costo || 0) * (item.aplicaIVA ? 1.15 : 1)), 0);

  // --- RENDER ---
  if (authError === 'AUTH_CONFIG_MISSING') return <div className="p-10 text-center text-red-600 font-bold">Falta configurar Auth Anónimo en Firebase</div>;
  if (loading) return <div className="h-screen flex items-center justify-center bg-emerald-900 text-white">Cargando...</div>;

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-emerald-900 text-white transition-all duration-300 flex flex-col fixed h-full z-20 md:relative shadow-xl`}>
        <div className="p-6 flex flex-col justify-center h-20">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center gap-3">
                <div className={`relative group ${isAdmin ? 'cursor-pointer' : ''}`} onClick={handleLogoClick} title={isAdmin ? "Cambiar logo" : ""}>
                  <img src={logoUrl} alt="Logo" className="w-10 h-10 object-contain bg-white rounded-lg p-1" />
                  {isAdmin && <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 rounded-lg"><Upload size={16} className="text-white"/></div>}
                  <input type="file" ref={fileInputRef} onChange={handleLogoChange} className="hidden" accept="image/*" />
                </div>
                <div><h1 className="text-xl font-bold tracking-tight text-white leading-tight">CONTROL <span className="text-emerald-400">ISC</span></h1><p className="text-xs text-emerald-200 mt-[-2px]">Matagalpa</p></div>
              </div>
            )}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded hover:bg-emerald-800 text-emerald-100 self-center">{sidebarOpen ? <X size={20} /> : <Menu size={20} />}</button>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {[{id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard'}, {id: 'inventory', icon: Package, label: 'Inventario'}, {id: 'suppliers', icon: Truck, label: 'Proveedores'}, {id: 'history', icon: History, label: 'Historial'}].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === item.id ? 'bg-emerald-700 text-white shadow-lg' : 'text-emerald-100 hover:bg-emerald-800'}`}>
              <item.icon size={20} />{sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* ADMIN LOCK */}
        <div className="p-4 border-t border-emerald-800">
          {sidebarOpen ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-emerald-300">
                {isAdmin ? <Shield size={14} className="text-emerald-400"/> : <Eye size={14}/>}
                <span>{isAdmin ? 'Modo Admin' : 'Modo Lectura'}</span>
              </div>
              <button 
                onClick={() => isAdmin ? setIsAdmin(false) : setIsLoginModalOpen(true)}
                className={`p-2 rounded-lg transition-colors ${isAdmin ? 'bg-emerald-800 text-emerald-200 hover:bg-emerald-700' : 'bg-emerald-950 text-emerald-400 hover:bg-black/20'}`}
                title={isAdmin ? "Cerrar sesión admin" : "Ingresar como admin"}
              >
                {isAdmin ? <Unlock size={16}/> : <Lock size={16}/>}
              </button>
            </div>
          ) : (
            <button onClick={() => isAdmin ? setIsAdmin(false) : setIsLoginModalOpen(true)} className="w-full flex justify-center text-emerald-300 hover:text-white">
              {isAdmin ? <Unlock size={20}/> : <Lock size={20}/>}
            </button>
          )}
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {activeTab === 'dashboard' ? 'Visión General' : activeTab === 'inventory' ? 'Inventario' : activeTab === 'suppliers' ? 'Proveedores' : 'Historial'}
            </h2>
            <div className="flex items-center gap-4 text-sm font-medium text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
               <div className="flex items-center gap-2">
                 <Wifi size={16} className="text-emerald-500" />
                 <span>En línea</span>
               </div>
               <div className="h-4 w-px bg-slate-300"></div>
               <div className="flex items-center gap-2" title="Usuarios conectados en tiempo real">
                 <Users size={16} className="text-blue-500" />
                 <span className="text-blue-700">{onlineUsers} Conectados</span>
               </div>
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card title="Total Productos" value={inventoryData.length} icon={Package} color="blue" />
              <Card title="Stock Total" value={inventoryData.reduce((acc, item) => acc + item.stock, 0)} icon={BarChartIcon} color="emerald" />
              <Card title="Valor (c/IVA)" value={`$${totalValue.toLocaleString('en-US', {minimumFractionDigits: 2})}`} icon={DollarSign} color="indigo" />
              <Card title="Agotados" value={inventoryData.filter(i => i.stock <= 0).length} icon={AlertTriangle} color="red" trend="down" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-80">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Top Categorías</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={Object.entries(inventoryData.reduce((acc, i) => { const c = i.categoria.includes('CHUMAZERAS')?'CHUMAZERAS':i.categoria; acc[c] = (acc[c]||0)+i.stock; return acc; }, {})).map(([name, value]) => ({name, value})).sort((a,b)=>b.value-a.value).slice(0,7)} layout="vertical" margin={{ left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-80 overflow-y-auto">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Stock Bajo</h3>
                {inventoryData.filter(i => i.stock <= 5).sort((a,b)=>a.stock-b.stock).map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 hover:bg-slate-50 border-b last:border-0">
                    <div className="truncate pr-2"><p className="text-sm font-medium">{item.material}</p><p className="text-xs text-slate-400">{item.codigo}</p></div>
                    <Badge type={item.stock <= 0 ? "danger" : "warning"}>{item.stock}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-[calc(100vh-200px)] animate-in fade-in duration-500">
            <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto flex-1">
                 <div className="relative w-full md:w-96"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} /><input type="text" placeholder="Buscar..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
                <div className="flex items-center gap-2 w-full md:w-auto"><Filter size={18} className="text-slate-400" /><select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>{categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => exportToCSV(filteredData, 'inventario')} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-lg font-medium shadow-sm"><Download size={20} /> <span className="hidden sm:inline">Exportar</span></button>
                {isAdmin && <button onClick={handleOpenCreateModal} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm"><Plus size={20} /> <span className="hidden sm:inline">Nuevo</span></button>}
              </div>
            </div>
            <div className="overflow-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 sticky top-0 z-10">
                  <tr>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase border-b">Código</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase border-b">Material</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase border-b hidden md:table-cell">Categoría</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase border-b text-right">Precio Unit.</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase border-b text-right text-emerald-600">Costo + IVA</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase border-b text-right">Stock</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase border-b text-center">Estado</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase border-b text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredData.map((item, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/50 group">
                      <td className="p-4 text-sm font-mono text-slate-600">{item.codigo}</td>
                      <td className="p-4"><p className="text-sm font-semibold">{item.material}</p></td>
                      <td className="p-4 text-sm hidden md:table-cell"><span className="px-2 py-1 rounded bg-slate-100 text-xs font-medium">{item.categoria}</span></td>
                      <td className="p-4 text-sm text-right text-slate-500">${(item.costo || 0).toFixed(2)}</td>
                      <td className="p-4 text-sm text-right font-bold text-emerald-600">${((item.costo||0)*(item.aplicaIVA?1.15:1)).toFixed(2)}</td>
                      <td className={`p-4 text-lg font-bold text-right ${item.stock<0?'text-red-600':'text-slate-800'}`}>{item.stock}</td>
                      <td className="p-4 text-center">
                        {item.stock <= 0 ? <Badge type="danger">Agotado</Badge> : item.stock <= 5 ? <Badge type="warning">Bajo</Badge> : <Badge type="success">En Stock</Badge>}
                      </td>
                      <td className="p-4 text-center">
                        {isAdmin ? (
                          <div className="flex justify-center gap-2">
                            <button onClick={() => handleOpenStockModal(item)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><PlusCircle size={18}/></button>
                            <button onClick={() => handleOpenEditModal(item)} className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100"><Pencil size={18}/></button>
                            <button onClick={() => handleDeleteProduct(item.codigo)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><Trash2 size={18}/></button>
                          </div>
                        ) : <span className="text-xs text-slate-400 italic">Solo Lectura</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'suppliers' && <SuppliersView isAdmin={isAdmin} suppliersData={suppliersData} inventoryData={inventoryData} />}

        {activeTab === 'history' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-[calc(100vh-200px)] animate-in fade-in duration-500">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-700 flex items-center gap-2"><History size={20} className="text-emerald-600"/> Historial</h3>
              <button onClick={() => exportToCSV(historyData, 'historial')} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-lg font-medium shadow-sm"><Download size={20} /> Exportar</button>
            </div>
            <div className="overflow-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 sticky top-0 z-10">
                  <tr><th className="p-4 border-b">Fecha</th><th className="p-4 border-b">Material</th><th className="p-4 border-b text-center">Tipo</th><th className="p-4 border-b text-right">Cant.</th><th className="p-4 border-b text-right">Saldo</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {historyData.map((log, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-4 text-xs font-mono text-slate-500">{log.fecha}</td>
                      <td className="p-4"><p className="text-sm font-medium">{log.material}</p><p className="text-xs text-slate-400">{log.codigo}</p></td>
                      <td className="p-4 text-center"><span className={`px-2 py-1 rounded text-xs font-bold ${log.tipo==='Entrada'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{log.tipo}</span></td>
                      <td className="p-4 text-sm font-bold text-right">{log.cantidad}</td>
                      <td className="p-4 text-sm text-right text-slate-500">{log.stockNuevo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* MODALES */}
      <AdminLoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLogin={() => setIsAdmin(true)} />
      <MovementModal isOpen={isStockModalOpen} onClose={() => setIsStockModalOpen(false)} item={selectedItem} onSave={handleUpdateStock} />
      <ProductFormModal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} onSave={handleSaveProduct} categories={rawCategories} productToEdit={editingItem} />
    </div>
  );
}
