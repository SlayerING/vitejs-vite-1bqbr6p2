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
  Eye, 
  User, 
  Monitor, 
  Laptop, 
  Smartphone, 
  CheckCircle, 
  Info, 
  AlertCircle, 
  ListFilter, 
  Building2,
  ShoppingCart, 
  Printer,       
  FilePlus,
  FileClock,
  Activity,
  QrCode,
  Settings 
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
  remove, 
  push, 
  onDisconnect 
} from 'firebase/database';

// --- DATOS INICIALES ---
const INITIAL_DATA = [
  { codigo: "TR0134", categoria: "TRANSMISIÓN", material: "Bandas viejas", descripcion: "Bandas viejas", unidad: "UNIDADES", stock: 86, costo: 0, aplicaIVA: true },
  { codigo: "PE0128", categoria: "PERNOS", material: 'Perno 1/4 x 4"', descripcion: 'Perno 1/4 x 4"', unidad: "UNIDADES", stock: 25, costo: 0.50, aplicaIVA: true },
];

// Listas por defecto (strings)
const DEFAULT_CATEGORIES_LIST = [
  "TRANSMISIÓN", "PERNOS", "ADHESIVOS", "CHUMAZERAS FLANCH", "HERRAMIENTAS", 
  "EPP", "FUNDICIÓN", "CUCHILLAS", "IMPERMEABILIZANTES", "LIJAS", 
  "BALINERAS", "PINTURAS", "METALES", "SOLDADURA", "DISCOS", 
  "CHUMAZERAS PIE", "TUERCAS", "ARANDELAS DE PRESIÓN", "ARANDELAS LISAS", "GENERAL"
];

const DEFAULT_UNITS_LIST = [
  "UNIDADES", "JUEGOS", "GALONES", "LIBRAS", "METROS", "CAJAS", "LITROS", "PARES", "ROLLOS", "BOLSAS", "PIEZAS"
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
const PRESENCE_PATH = `artifacts/${appId}/public/data/presence`;
const REQUISITIONS_PATH = `artifacts/${appId}/public/data/requisitions`;
const CATEGORIES_PATH = `artifacts/${appId}/public/data/settings/categories`;
const UNITS_PATH = `artifacts/${appId}/public/data/settings/units`;

const COST_CENTERS = [
  "Mantenimiento General",
  "Infraestructura",
  "Administración",
  "Producción",
  "Ventas / Salida Cliente",
  "Merma / Daño",
  "Uso Interno"
];

const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "Tablet";
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated/.test(ua)) return "Móvil";
  return "PC";
};

// --- COMPONENTES UI ---

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div 
          key={toast.id} 
          className={`
            pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border animate-in slide-in-from-right-10 fade-in duration-300
            ${toast.type === 'success' ? 'bg-white border-emerald-200 text-emerald-800' : ''}
            ${toast.type === 'error' ? 'bg-white border-red-200 text-red-800' : ''}
            ${toast.type === 'info' ? 'bg-white border-blue-200 text-blue-800' : ''}
            ${toast.type === 'warning' ? 'bg-white border-amber-200 text-amber-800' : ''}
          `}
        >
          {toast.type === 'success' && <CheckCircle size={20} className="text-emerald-500" />}
          {toast.type === 'error' && <XCircle size={20} className="text-red-500" />}
          {toast.type === 'info' && <Info size={20} className="text-blue-500" />}
          {toast.type === 'warning' && <AlertTriangle size={20} className="text-amber-500" />}
          <div className="flex-1"><p className="text-sm font-medium">{toast.message}</p></div>
          <button onClick={() => removeToast(toast.id)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
        </div>
      ))}
    </div>
  );
};

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

const AdminLoginModal = ({ isOpen, onClose, onLogin, addToast }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  if (!isOpen) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) { onLogin(); addToast("Modo Administrador activado", "success"); onClose(); setPin(""); setError(false); } 
    else { setError(true); addToast("PIN incorrecto", "error"); }
  };
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-6 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4"><Lock size={32} className="text-blue-600" /></div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Acceso Administrador</h3>
          <p className="text-sm text-slate-500 mb-6">Ingresa el PIN para modificar datos.</p>
          <form onSubmit={handleSubmit}>
            <input type="password" className={`w-full text-center text-2xl tracking-widest p-3 border rounded-lg focus:outline-none focus:ring-2 ${error ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-500'}`} placeholder="••••" maxLength={4} autoFocus value={pin} onChange={(e) => setPin(e.target.value)} />
            {error && <p className="text-red-500 text-xs mt-2">PIN incorrecto</p>}
            <div className="flex gap-3 mt-6"><button type="button" onClick={onClose} className="flex-1 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancelar</button><button type="submit" className="flex-1 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium">Entrar</button></div>
          </form>
        </div>
      </div>
    </div>
  );
};

const ProfileSetupModal = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [device, setDevice] = useState("");
  const [type, setType] = useState(getDeviceType());
  useEffect(() => { if (isOpen) { setDevice(`${getDeviceType()} Principal`); } }, [isOpen]);
  if (!isOpen) return null;
  const handleSubmit = (e) => { e.preventDefault(); if (name && device) { onSave({ name, device, type }); onClose(); } };
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-emerald-900/90 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
        <div className="p-8 text-center">
          <div className="mx-auto w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6"><User size={40} className="text-emerald-600" /></div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">¡Bienvenido al Sistema!</h2>
          <p className="text-slate-500 mb-8">Para que todos sepan quién está conectado, por favor identifícate.</p>
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Tu Nombre</label><input type="text" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="Ej. Juan Pérez" autoFocus required value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Dispositivo</label><input type="text" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="Ej. Samsung J9, Laptop Bodega..." required value={device} onChange={(e) => setDevice(e.target.value)} /><p className="text-xs text-slate-400 mt-1">Así aparecerás en la lista de conectados.</p></div>
            <button type="submit" className="w-full py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors mt-4">Comenzar a trabajar</button>
          </form>
        </div>
      </div>
    </div>
  );
};

const ConnectedUsersModal = ({ isOpen, onClose, users, currentUserId }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[50] flex items-start justify-end p-4 pt-20 pointer-events-none">
      <div className="bg-white rounded-xl shadow-2xl w-72 overflow-hidden pointer-events-auto border border-slate-200 animate-in slide-in-from-right-10 fade-in">
        <div className="p-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center"><h3 className="font-bold text-slate-700 text-sm flex items-center gap-2"><Users size={16} className="text-blue-500"/> Dispositivos Conectados</h3><button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={16}/></button></div>
        <div className="max-h-60 overflow-y-auto p-2 space-y-1">{users.map((u, idx) => { const isMe = u.user === currentUserId; return (<div key={idx} className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${isMe ? 'bg-blue-50 border border-blue-100' : 'hover:bg-slate-50'}`}><div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isMe ? 'bg-blue-200 text-blue-700' : 'bg-slate-200 text-slate-600'}`}>{u.type === 'Móvil' ? <Smartphone size={14}/> : <Monitor size={14}/>}</div><div className="flex-1 min-w-0"><p className="text-sm font-bold text-slate-800 truncate">{u.name || 'Usuario'}{isMe && <span className="ml-1 text-xs font-normal text-blue-600">(Tú)</span>}</p><p className="text-xs text-slate-500 truncate">{u.deviceName || 'Dispositivo'}</p></div><div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]"></div></div>); })}</div>
      </div>
    </div>
  );
};

const MovementModal = ({ isOpen, onClose, item, onSave }) => {
  const [amount, setAmount] = useState(1);
  const [type, setType] = useState('entry'); 
  const [destination, setDestination] = useState(""); 
  useEffect(() => { if (isOpen) setDestination(type === 'exit' ? COST_CENTERS[0] : "Proveedor / Compra"); }, [isOpen, type]);
  if (!isOpen || !item) return null;
  const handleSubmit = () => { const finalAmount = parseInt(amount, 10); if (isNaN(finalAmount) || finalAmount <= 0) return; onSave(item.codigo, finalAmount, type, item.stock, item.material, destination); setAmount(1); onClose(); };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50"><h3 className="font-bold text-slate-700">Registrar Movimiento</h3><button onClick={onClose} className="text-slate-400 hover:text-slate-600"><XCircle size={24} /></button></div>
        <div className="p-6 space-y-4">
          <div><p className="text-sm text-slate-500 mb-1">Material:</p><p className="font-semibold text-lg text-slate-800">{item.material}</p><p className="text-xs text-slate-400 font-mono">Stock Actual: {item.stock}</p></div>
          <div className="flex gap-2 p-1 bg-slate-100 rounded-lg"><button className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${type === 'entry' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`} onClick={() => setType('entry')}><PlusCircle size={16} /> Entrada</button><button className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${type === 'exit' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`} onClick={() => setType('exit')}><MinusCircle size={16} /> Salida</button></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Cantidad</label><input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg font-bold text-center" autoFocus /></div>
          {type === 'exit' && (item.stock - amount < 0) && (<div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-start gap-2"><AlertTriangle size={16} className="mt-0.5" /> <span>Advertencia: El stock quedará en negativo ({item.stock - amount}).</span></div>)}
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3"><button onClick={onClose} className="flex-1 px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors">Cancelar</button><button onClick={handleSubmit} className={`flex-1 px-4 py-2 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${type === 'entry' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}><Save size={18} /> Confirmar</button></div>
      </div>
    </div>
  );
};

const ProductFormModal = ({ isOpen, onClose, onSave, categories, units, productToEdit }) => {
  const [formData, setFormData] = useState({ codigo: '', material: '', categoria: '', unidad: '', stock: 0, costo: 0, aplicaIVA: true });
  useEffect(() => {
    if (isOpen) {
      // Usar categorías/unidades pasadas como props
      const defaultCat = (categories && categories.length > 0) ? categories[0] : 'GENERAL';
      const defaultUnit = (units && units.length > 0) ? units[0] : 'UNIDADES';
      
      if (productToEdit) {
        setFormData({
          codigo: productToEdit.codigo || '',
          material: productToEdit.material || '',
          categoria: productToEdit.categoria || defaultCat,
          unidad: productToEdit.unidad || defaultUnit,
          stock: productToEdit.stock !== undefined ? productToEdit.stock : 0,
          costo: productToEdit.costo !== undefined ? productToEdit.costo : 0,
          aplicaIVA: productToEdit.aplicaIVA !== undefined ? productToEdit.aplicaIVA : true
        });
      } else {
        setFormData({ 
          codigo: '', 
          material: '', 
          categoria: defaultCat, 
          unidad: defaultUnit, 
          stock: 0, 
          costo: 0, 
          aplicaIVA: true 
        });
      }
    }
  }, [isOpen, productToEdit, categories, units]);

  if (!isOpen) return null;
  const handleSubmit = (e) => { e.preventDefault(); if (!formData.codigo || !formData.material) return; onSave(formData, !!productToEdit); onClose(); };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50"><h3 className="font-bold text-slate-700 flex items-center gap-2">{productToEdit ? <Pencil size={20} className="text-blue-500"/> : <Package size={20} className="text-green-500" />} {productToEdit ? 'Editar Producto' : 'Nuevo Producto'}</h3><button onClick={onClose} className="text-slate-400 hover:text-slate-600"><XCircle size={24} /></button></div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Código *</label><input required type="text" disabled={!!productToEdit} placeholder="Ej. PE0999" className={`w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${productToEdit ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`} value={formData.codigo} onChange={(e) => setFormData({...formData, codigo: e.target.value})} /></div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
              <select className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" value={formData.categoria} onChange={(e) => setFormData({...formData, categoria: e.target.value})}>
                {categories.map((cat, idx) => <option key={`${cat}-${idx}`} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Material *</label><input required type="text" placeholder="Ej. Perno Hexagonal 3/4" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" value={formData.material} onChange={(e) => setFormData({...formData, material: e.target.value})} /></div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Unidad</label>
              <select className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" value={formData.unidad} onChange={(e) => setFormData({...formData, unidad: e.target.value})}>
                {units.map((u, idx) => <option key={`${u}-${idx}`} value={u}>{u}</option>)}
              </select>
            </div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Stock</label><input type="number" min="0" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" value={formData.stock} onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})} /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Costo Unit.</label><div className="relative"><span className="absolute left-3 top-2 text-slate-400">C$</span><input type="number" min="0" step="0.01" className="w-full p-2 pl-8 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" value={formData.costo} onChange={(e) => setFormData({...formData, costo: parseFloat(e.target.value) || 0})} /></div></div>
          </div>
          <div className="flex items-center gap-2 pt-2"><input type="checkbox" id="ivaCheck" checked={formData.aplicaIVA} onChange={(e) => setFormData({...formData, aplicaIVA: e.target.checked})} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300" /><label htmlFor="ivaCheck" className="text-sm font-medium text-slate-700 flex items-center gap-1">Aplica IVA (15%)</label></div>
          <div className="pt-4 flex gap-3"><button type="button" onClick={onClose} className="flex-1 px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">Cancelar</button><button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-2"><Save size={18} /> {productToEdit ? 'Actualizar' : 'Guardar'}</button></div>
        </form>
      </div>
    </div>
  );
};

// --- MODAL KARDEX (HISTORIAL INDIVIDUAL) ---
const ProductHistoryModal = ({ isOpen, onClose, product, history }) => {
  if (!isOpen || !product) return null;
  const productHistory = history.filter(h => h.codigo === product.codigo);
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div><h3 className="font-bold text-slate-800 flex items-center gap-2"><FileClock size={20} className="text-purple-600"/> Kardex / Historial</h3><p className="text-sm text-slate-500">{product.material} ({product.codigo})</p></div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
        </div>
        <div className="overflow-y-auto p-4 flex-1">
          {productHistory.length === 0 ? (<div className="text-center py-10 text-slate-400 italic">No hay movimientos registrados para este producto.</div>) : (
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-50 text-slate-600 sticky top-0">
                <tr><th className="p-3 border-b">Fecha</th><th className="p-3 border-b text-center">Tipo</th><th className="p-3 border-b text-right">Cant.</th><th className="p-3 border-b text-right">Saldo</th><th className="p-3 border-b">Detalle / Usuario</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {productHistory.map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 font-mono text-xs">{log.fecha}</td>
                    <td className="p-3 text-center"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${log.tipo === 'Entrada' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{log.tipo}</span></td>
                    <td className="p-3 text-right font-bold">{log.cantidad}</td>
                    <td className="p-3 text-right text-slate-500">{log.stockNuevo}</td>
                    <td className="p-3 text-xs"><div className="font-medium text-slate-700">{log.usuario || 'Admin'}</div><div className="text-slate-400">{log.destino || '-'}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE DE CONFIGURACIÓN DINÁMICA ---
const SettingsView = ({ categories, units, onAddCategory, onDeleteCategory, onAddUnit, onDeleteUnit }) => {
  const [newCat, setNewCat] = useState("");
  const [newUnit, setNewUnit] = useState("");

  const handleAddCat = (e) => { e.preventDefault(); if(newCat) { onAddCategory(newCat); setNewCat(""); } };
  const handleAddUnit = (e) => { e.preventDefault(); if(newUnit) { onAddUnit(newUnit); setNewUnit(""); } };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-slate-100"><h3 className="font-bold text-slate-800 flex items-center gap-2"><Settings size={20} className="text-gray-600"/> Configuración del Sistema</h3></div>
      <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col h-full">
           <h4 className="font-bold text-slate-700 mb-3">Categorías de Productos</h4>
           <form onSubmit={handleAddCat} className="flex gap-2 mb-4">
             <input className="flex-1 p-2 border rounded-lg text-sm" placeholder="Nueva Categoría..." value={newCat} onChange={e => setNewCat(e.target.value.toUpperCase())} />
             <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg"><Plus size={18}/></button>
           </form>
           <div className="flex-1 overflow-y-auto border rounded-lg bg-slate-50 p-2 space-y-1 max-h-96">
             {categories.map((cat, idx) => (
               <div key={`${cat}-${idx}`} className="flex justify-between items-center p-2 bg-white rounded border border-slate-100">
                 <span className="text-sm font-medium">{cat}</span>
                 <button onClick={() => onDeleteCategory(cat)} className="text-red-400 hover:text-red-600"><Trash2 size={14}/></button>
               </div>
             ))}
           </div>
        </div>
        <div className="flex flex-col h-full">
           <h4 className="font-bold text-slate-700 mb-3">Unidades de Medida</h4>
           <form onSubmit={handleAddUnit} className="flex gap-2 mb-4">
             <input className="flex-1 p-2 border rounded-lg text-sm" placeholder="Nueva Unidad..." value={newUnit} onChange={e => setNewUnit(e.target.value.toUpperCase())} />
             <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg"><Plus size={18}/></button>
           </form>
           <div className="flex-1 overflow-y-auto border rounded-lg bg-slate-50 p-2 space-y-1 max-h-96">
             {units.map((unit, idx) => (
               <div key={`${unit}-${idx}`} className="flex justify-between items-center p-2 bg-white rounded border border-slate-100">
                 <span className="text-sm font-medium">{unit}</span>
                 <button onClick={() => onDeleteUnit(unit)} className="text-red-400 hover:text-red-600"><Trash2 size={14}/></button>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE DE PROVEEDORES ---
const SuppliersView = ({ isAdmin, suppliersData, inventoryData, addToast }) => {
  const [activeTab, setActiveTab] = useState('list');
  const [newSupplier, setNewSupplier] = useState({ nombre: '', contacto: '', telefono: '' });
  const [selectedProduct, setSelectedProduct] = useState('');
  const [comparisonData, setComparisonData] = useState([]);
  const handleAddSupplier = async (e) => { e.preventDefault(); if(!newSupplier.nombre) return; try { await push(ref(db, SUPPLIERS_PATH), newSupplier); setNewSupplier({ nombre: '', contacto: '', telefono: '' }); addToast("Proveedor agregado con éxito", "success"); } catch (e) { addToast("Error al guardar proveedor", "error"); } };
  const handleDeleteSupplier = async (id) => { if(window.confirm("¿Borrar proveedor?")) { try { await remove(ref(db, `${SUPPLIERS_PATH}/${id}`)); addToast("Proveedor eliminado", "success"); } catch (e) { addToast("Error al eliminar", "error"); } } };
  const addComparisonRow = () => setComparisonData([...comparisonData, { supplierId: '', price: 0 }]);
  const updateComparisonRow = (idx, field, value) => { const newData = [...comparisonData]; newData[idx][field] = value; setComparisonData(newData); };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex gap-4"><button onClick={() => setActiveTab('list')} className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'list' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>Directorio</button><button onClick={() => setActiveTab('compare')} className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'compare' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>Comparador</button></div>
      <div className="p-6 overflow-y-auto flex-1">
        {activeTab === 'list' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {isAdmin && (<div><h3 className="text-lg font-bold text-slate-800 mb-4">Agregar Nuevo Proveedor</h3><form onSubmit={handleAddSupplier} className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-200"><input placeholder="Nombre Empresa" className="w-full p-2 border rounded" value={newSupplier.nombre} onChange={e => setNewSupplier({...newSupplier, nombre: e.target.value})} required /><input placeholder="Nombre Contacto" className="w-full p-2 border rounded" value={newSupplier.contacto} onChange={e => setNewSupplier({...newSupplier, contacto: e.target.value})} /><input placeholder="Teléfono / Email" className="w-full p-2 border rounded" value={newSupplier.telefono} onChange={e => setNewSupplier({...newSupplier, telefono: e.target.value})} /><button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Guardar Proveedor</button></form></div>)}
            <div className={!isAdmin ? "lg:col-span-2" : ""}>
              <h3 className="text-lg font-bold text-slate-800 mb-4">Lista de Proveedores</h3>
              <div className="space-y-3">{suppliersData.length === 0 && <p className="text-slate-400 italic">No hay proveedores registrados.</p>}{suppliersData.map(sup => (<div key={sup.id} className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-lg shadow-sm"><div><p className="font-bold text-slate-800">{sup.nombre}</p><p className="text-xs text-slate-500">{sup.contacto} • {sup.telefono}</p></div>{isAdmin && <button onClick={() => handleDeleteSupplier(sup.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={16}/></button>}</div>))}</div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto"><h3 className="text-lg font-bold text-slate-800 mb-4 text-center">Comparador de Precios</h3><div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-6"><label className="block text-sm font-medium text-slate-700 mb-2">Selecciona un Material para cotizar:</label><select className="w-full p-3 border border-slate-300 rounded-lg mb-4" value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}><option value="">-- Selecciona Material --</option>{inventoryData.map(item => <option key={item.codigo} value={item.material}>{item.material} ({item.codigo})</option>)}</select>
          {selectedProduct && (<div className="space-y-4"><div className="flex justify-between items-center"><h4 className="font-semibold text-slate-700">Cotizaciones</h4>{isAdmin && <button onClick={addComparisonRow} className="text-sm text-blue-600 font-medium flex items-center gap-1"><PlusCircle size={16}/> Agregar Cotización</button>}</div>{comparisonData.map((row, idx) => (<div key={idx} className="flex gap-4 items-center"><select className="flex-1 p-2 border rounded" value={row.supplierId} onChange={e => updateComparisonRow(idx, 'supplierId', e.target.value)} disabled={!isAdmin}><option value="">Selecciona Proveedor...</option>{suppliersData.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}</select><div className="relative w-32"><span className="absolute left-2 top-2 text-slate-400">C$</span><input type="number" className="w-full p-2 pl-8 border rounded" placeholder="0.00" value={row.price} onChange={e => updateComparisonRow(idx, 'price', parseFloat(e.target.value))} disabled={!isAdmin} /></div></div>))}
          {comparisonData.length > 1 && (<div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center"><p className="text-green-800 font-bold text-lg">Mejor opción: {(() => { const valid = comparisonData.filter(d => d.price > 0 && d.supplierId); if(valid.length === 0) return "--"; const best = valid.reduce((min, curr) => curr.price < min.price ? curr : min, valid[0]); const sup = suppliersData.find(s => s.id === best.supplierId); return `${sup?.nombre || 'Desconocido'} a C$${best.price}`; })()}</p></div>)}</div>)}</div></div>
        )}
      </div>
    </div>
  );
};

// --- NUEVA VISTA: REQUISICIONES (PEDIDOS) ---
const RequisitionsView = ({ inventoryData, addToast, isAdmin }) => {
  const [requisitions, setRequisitions] = useState([]);
  const [searchItem, setSearchItem] = useState('');

  useEffect(() => {
    const reqRef = ref(db, REQUISITIONS_PATH);
    const unsubscribe = onValue(reqRef, (snapshot) => {
      const data = snapshot.val();
      setRequisitions(data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : []);
    });
    return () => unsubscribe();
  }, []);

  const handleAddToRequisition = (item) => {
    const existing = requisitions.find(r => r.codigo === item.codigo);
    if (existing) { addToast("El producto ya está en la lista", "info"); return; }
    // No guardamos cantidad
    const newItem = { codigo: item.codigo, material: item.material, costo: item.costo || 0, aplicaIVA: item.aplicaIVA || false }; 
    push(ref(db, REQUISITIONS_PATH), newItem).then(() => addToast("Agregado", "success")).catch(() => addToast("Error", "error"));
  };

  const handleRemoveRequisition = (id) => { remove(ref(db, `${REQUISITIONS_PATH}/${id}`)); };

  const handleAutoFill = () => {
    const lowStockItems = inventoryData.filter(i => i.stock <= 5);
    if (lowStockItems.length === 0) { addToast("No hay stock bajo", "info"); return; }
    let count = 0;
    lowStockItems.forEach(item => {
      const existing = requisitions.find(r => r.codigo === item.codigo);
      if (!existing) {
        push(ref(db, REQUISITIONS_PATH), { codigo: item.codigo, material: item.material, costo: item.costo || 0, aplicaIVA: item.aplicaIVA || false });
        count++;
      }
    });
    addToast(`Agregados ${count} items`, "success");
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    // Calculo total (aunque sin cantidades es solo una lista de precios)
    const html = `
      <html>
      <head>
        <title>Orden de Compra - Control ISC</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #047857; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          th { background-color: #f3f4f6; }
          .footer { margin-top: 40px; font-weight: bold; text-align: right; }
          @media print { button { display: none; } }
        </style>
      </head>
      <body>
        <h1>Listado de Requisición de Materiales</h1>
        <p><strong>Fecha:</strong> ${new Date().toLocaleDateString()}</p>
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Material</th>
              <th>Stock Actual</th> 
              <th style="text-align: right">Costo Unit.</th>
              <th style="text-align: right">Costo Unit. (+IVA)</th>
            </tr>
          </thead>
          <tbody>
            ${requisitions.map(item => {
              // Buscar stock actual
              const currentStock = inventoryData.find(i => i.codigo === item.codigo)?.stock || 0;
              return `
              <tr>
                <td>${item.codigo}</td>
                <td>${item.material}</td>
                <td style="text-align: center">${currentStock}</td>
                <td style="text-align: right">C$${item.costo.toFixed(2)}</td>
                <td style="text-align: right">C$${(item.costo * (item.aplicaIVA ? 1.15 : 1)).toFixed(2)}</td>
              </tr>
            `}).join('')}
          </tbody>
        </table>
        <div class="footer"><p>Firma Autorizada: __________________________</p></div>
        <script>window.print();</script>
      </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const filteredInventory = inventoryData.filter(i => i.material.toLowerCase().includes(searchItem.toLowerCase()) || i.codigo.toLowerCase().includes(searchItem.toLowerCase()));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden">
       <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <div className="flex gap-4 items-center"><h3 className="font-bold text-slate-800 text-lg flex items-center gap-2"><ShoppingCart className="text-emerald-600"/> Requisiciones</h3><span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">{requisitions.length} Items</span></div>
          <div className="flex gap-2">{isAdmin && <button onClick={handleAutoFill} className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-100 text-sm font-medium"><FilePlus size={16}/> Cargar Stock Bajo</button>}<button onClick={handlePrint} className="flex items-center gap-2 bg-slate-800 text-white px-3 py-1.5 rounded-lg hover:bg-slate-700 text-sm font-medium"><Printer size={16}/> Imprimir Lista</button></div>
       </div>
       <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          <div className="w-full lg:w-1/3 border-r border-slate-100 flex flex-col bg-slate-50/50">
             <div className="p-4 border-b border-slate-200"><div className="relative"><Search className="absolute left-3 top-2.5 text-slate-400" size={16}/><input type="text" placeholder="Buscar producto..." className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" value={searchItem} onChange={(e) => setSearchItem(e.target.value)}/></div></div>
             <div className="flex-1 overflow-y-auto p-2">{filteredInventory.map(item => (<div key={item.codigo} className="flex justify-between items-center p-3 hover:bg-white hover:shadow-sm rounded-lg border border-transparent hover:border-slate-200 transition-all cursor-pointer group" onClick={() => isAdmin && handleAddToRequisition(item)}><div className="min-w-0"><p className="font-medium text-sm text-slate-700 truncate">{item.material}</p><p className="text-xs text-slate-500">Stock: <span className={item.stock <= 5 ? "text-red-500 font-bold" : ""}>{item.stock}</span></p></div>{isAdmin && <button className="text-emerald-600 opacity-0 group-hover:opacity-100 bg-emerald-50 p-1.5 rounded-md hover:bg-emerald-100"><Plus size={16}/></button>}</div>))}</div>
          </div>
          <div className="flex-1 flex flex-col bg-white">
             <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left text-sm">
                   <thead className="bg-slate-50 sticky top-0 z-10 text-slate-500">
                      <tr><th className="p-3">Código</th><th className="p-3">Material</th><th className="p-3 text-center">Stock Actual</th><th className="p-3 text-right">Costo Unit.</th><th className="p-3 text-right">Costo + IVA</th><th className="p-3 text-center">Acción</th></tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {requisitions.map(req => {
                         const stockActual = inventoryData.find(i => i.codigo === req.codigo)?.stock || 0;
                         return (
                         <tr key={req.id} className="hover:bg-slate-50">
                            <td className="p-3 font-mono text-xs">{req.codigo}</td>
                            <td className="p-3 font-medium text-slate-700">{req.material}</td>
                            <td className="p-3 text-center font-bold text-slate-600">{stockActual}</td>
                            <td className="p-3 text-right text-slate-600">C${(req.costo).toFixed(2)}</td>
                            <td className="p-3 text-right font-bold text-emerald-600">C${(req.costo * (req.aplicaIVA ? 1.15 : 1)).toFixed(2)}{req.aplicaIVA && <span className="text-[10px] ml-1 text-slate-400">(15%)</span>}</td>
                            <td className="p-3 text-center">{isAdmin && <button onClick={() => handleRemoveRequisition(req.id)} className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50"><Trash2 size={16}/></button>}</td>
                         </tr>
                      )})}
                      {requisitions.length === 0 && (<tr><td colSpan="6" className="p-10 text-center text-slate-400 italic">La lista de requisición está vacía.</td></tr>)}
                   </tbody>
                </table>
             </div>
          </div>
       </div>
    </div>
  );
};

export default function InventoryDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [statusFilter, setStatusFilter] = useState('all'); 
  const [logoUrl, setLogoUrl] = useState("https://cdn-icons-png.flaticon.com/512/2897/2897785.png");
  const [onlineUsersList, setOnlineUsersList] = useState([]); 
  const [toasts, setToasts] = useState([]); 

  const [isAdmin, setIsAdmin] = useState(false);
  const [inventoryData, setInventoryData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [suppliersData, setSuppliersData] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [myDeviceName, setMyDeviceName] = useState("");
  const [userProfile, setUserProfile] = useState(null); 
  
  // ESTADOS DE CONFIGURACIÓN DINÁMICA
  const [categoriesList, setCategoriesList] = useState([]);
  const [unitsList, setUnitsList] = useState([]);

  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isConnectedUsersModalOpen, setIsConnectedUsersModalOpen] = useState(false); 
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); 
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false); 
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [historyItem, setHistoryItem] = useState(null); 
  const fileInputRef = useRef(null);

  // --- HELPER TOASTS ---
  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000); 
  };
  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  // --- 1. AUTENTICACIÓN Y PERFIL ---
  useEffect(() => {
    const savedProfile = localStorage.getItem('isc_user_profile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    } else {
      setIsProfileModalOpen(true); 
    }

    const initAuth = async () => {
      try { await signInAnonymously(auth); } catch (error) { if (error.code === 'auth/configuration-not-found' || error.message.includes('configuration-not-found')) setAuthError('AUTH_CONFIG_MISSING'); }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => { setUser(currentUser); if (currentUser) setAuthError(null); if (!currentUser && !authError) setLoading(false); });
    return () => unsubscribe();
  }, [authError]);

  const handleSaveProfile = (profile) => {
    localStorage.setItem('isc_user_profile', JSON.stringify(profile));
    setUserProfile(profile);
  };

  // --- 2. DATA SYNC Y PRESENCIA ---
  useEffect(() => {
    if (!user || !userProfile) return; 
    
    // a) Inventario
    const inventoryRef = ref(db, DB_PATH);
    const unsubscribeInv = onValue(inventoryRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) { const updates = {}; INITIAL_DATA.forEach(item => { updates[item.codigo] = item; }); update(inventoryRef, updates); } 
      else { setInventoryData(Object.values(data)); setLoading(false); }
    });
    
    // b) Historial
    const historyRef = ref(db, HISTORY_PATH);
    const unsubscribeHist = onValue(historyRef, (snapshot) => { const data = snapshot.val(); setHistoryData(data ? Object.values(data).sort((a, b) => b.timestamp - a.timestamp) : []); });
    
    // c) Proveedores
    const suppliersRef = ref(db, SUPPLIERS_PATH);
    const unsubscribeSup = onValue(suppliersRef, (snapshot) => { const data = snapshot.val(); setSuppliersData(data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : []); });
    
    // d) Logo
    const logoRef = ref(db, `${SETTINGS_PATH}/logo`);
    const unsubscribeLogo = onValue(logoRef, (snapshot) => { if (snapshot.exists()) setLogoUrl(snapshot.val()); });

    // e) CONFIGURACIÓN (Categorías y Unidades)
    const catRef = ref(db, CATEGORIES_PATH);
    const unsubscribeCat = onValue(catRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) { set(ref(db, CATEGORIES_PATH), DEFAULT_CATEGORIES_LIST); } 
      else { 
        // Normalizar datos (soportar strings y objetos)
        const list = Object.entries(data).map(([k, v]) => ({
            id: k,
            name: (typeof v === 'object' && v.name) ? v.name : v
        }));
        setCategoriesList(list); 
      }
    });

    const unitsRef = ref(db, UNITS_PATH);
    const unsubscribeUnits = onValue(unitsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) { set(ref(db, UNITS_PATH), DEFAULT_UNITS_LIST); }
      else { 
        // Normalizar datos
        const list = Object.entries(data).map(([k, v]) => ({
            id: k,
            name: (typeof v === 'object' && v.name) ? v.name : v
        }));
        setUnitsList(list); 
      }
    });

    // f) PRESENCIA
    const connectedRef = ref(db, ".info/connected");
    const presenceRef = ref(db, PRESENCE_PATH);
    
    const unsubscribeConnected = onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        const myPresenceRef = push(presenceRef);
        import('firebase/database').then(({ onDisconnect }) => {
           onDisconnect(myPresenceRef).remove();
           set(myPresenceRef, { 
             user: user.uid, 
             name: userProfile.name, 
             deviceName: userProfile.device, 
             type: userProfile.type,
             connectedAt: Date.now() 
           });
        });
      }
    });
    const unsubscribePresenceCount = onValue(presenceRef, (snap) => { if (snap.exists()) setOnlineUsersList(Object.values(snap.val())); else setOnlineUsersList([]); });

    return () => { 
      unsubscribeInv(); unsubscribeHist(); unsubscribeSup(); unsubscribeLogo(); 
      unsubscribeCat(); unsubscribeUnits();
      unsubscribeConnected(); unsubscribePresenceCount(); 
    };
  }, [user, userProfile]);

  const handleChangeDeviceName = () => { setIsProfileModalOpen(true); };

  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) { addToast("No hay datos", "warning"); return; }
    const headers = Object.keys(data[0]);
    const csvContent = [ headers.join(','), ...data.map(row => headers.map(header => `"${(row[header] || '').toString().replace(/"/g, '""')}"`).join(',')) ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `${filename}_${new Date().toISOString().slice(0,10)}.csv`; link.click();
    addToast("Exportación iniciada", "success");
  };

  const handleLogoClick = () => { if(isAdmin) fileInputRef.current?.click(); };
  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 500 * 1024) return addToast("Máx 500KB", "error");
      const reader = new FileReader();
      reader.onloadend = () => { set(ref(db, `${SETTINGS_PATH}/logo`), reader.result).then(() => addToast("Logo actualizado", "success")); };
      reader.readAsDataURL(file);
    }
  };

  // --- HANDLERS PARA CONFIGURACIÓN DINÁMICA ---
  const handleAddCategory = (cat) => {
    push(ref(db, CATEGORIES_PATH), { name: cat });
  };
  const handleDeleteCategory = (catName) => {
    // Buscar el ID basado en el nombre (ya que tenemos la lista con IDs)
    const item = categoriesList.find(c => c.name === catName);
    if (item && item.id) {
       remove(ref(db, `${CATEGORIES_PATH}/${item.id}`))
         .then(() => addToast("Categoría eliminada", "success"))
         .catch(() => addToast("Error al eliminar", "error"));
    } else {
       addToast("No se pudo eliminar (elemento predeterminado o error)", "warning");
    }
  };
  const handleAddUnit = (unit) => {
     push(ref(db, UNITS_PATH), { name: unit });
  };
  const handleDeleteUnit = (unitName) => {
    const item = unitsList.find(u => u.name === unitName);
    if (item && item.id) {
       remove(ref(db, `${UNITS_PATH}/${item.id}`))
         .then(() => addToast("Unidad eliminada", "success"))
         .catch(() => addToast("Error al eliminar", "error"));
    } else {
       addToast("No se pudo eliminar", "warning");
    }
  };

  const handleUpdateStock = async (codigo, cantidad, tipo, stockActual, nombreMaterial, destino) => {
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
        usuario: userProfile ? userProfile.name : 'Admin', 
        destino: destino || 'No especificado'
      });
      addToast("Stock actualizado", "success");
    } catch (e) { addToast("Error al actualizar", "error"); }
  };

  const handleSaveProduct = async (formData, isEditMode) => {
    if (!user || !isAdmin) return;
    try {
      const itemRef = ref(db, `${DB_PATH}/${formData.codigo}`);
      const itemWithDesc = { ...formData, descripcion: formData.material };
      if (isEditMode) await update(itemRef, itemWithDesc); else { await set(itemRef, itemWithDesc); setActiveTab('inventory'); setSearchTerm(formData.codigo); }
      addToast(isEditMode ? "Producto actualizado" : "Producto creado", "success");
    } catch (e) { addToast("Error al guardar", "error"); }
  };
  const handleDeleteProduct = async (codigo) => { if (!isAdmin) return; if (window.confirm("¿Borrar?")) { try { await remove(ref(db, `${DB_PATH}/${codigo}`)); addToast("Eliminado", "success"); } catch (e) { addToast("Error", "error"); } } };

  // --- HELPERS PARA MODALES ---
  const handleOpenStockModal = (item) => { setSelectedItem(item); setIsStockModalOpen(true); };
  const handleOpenCreateModal = () => { setEditingItem(null); setIsFormModalOpen(true); };
  const handleOpenEditModal = (item) => { setEditingItem(item); setIsFormModalOpen(true); };
  const handleOpenProductHistory = (item) => { setHistoryItem(item); setIsHistoryModalOpen(true); };

  // --- LÓGICA DE CATEGORÍAS PARA FILTROS ---
  const configCategories = categoriesList.map(c => c.name); 
  const inventoryCategories = [...new Set(inventoryData.map(item => item.categoria).filter(Boolean))];
  const availableCategories = ['Todas', ...new Set([...configCategories, ...inventoryCategories])].sort();

  const filteredData = useMemo(() => {
    return inventoryData.filter(item => {
      const matchSearch = item.material.toLowerCase().includes(searchTerm.toLowerCase()) || item.codigo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = selectedCategory === 'Todas' || item.categoria === selectedCategory;
      let matchStatus = true;
      if (statusFilter === 'low') matchStatus = item.stock <= 5 && item.stock > 0;
      if (statusFilter === 'out') matchStatus = item.stock <= 0;
      return matchSearch && matchCat && matchStatus;
    });
  }, [searchTerm, selectedCategory, inventoryData, statusFilter]);

  const categories = ['Todas', ...new Set(inventoryData.map(item => item.categoria).filter(Boolean))];
  const rawCategories = [...new Set(inventoryData.map(item => item.categoria).filter(Boolean))].sort();
  // TOTAL SIN IVA
  const totalValue = inventoryData.reduce((acc, item) => acc + (item.stock * parseFloat(item.costo || 0)), 0);

  const rotationData = useMemo(() => {
    const rotation = {};
    historyData.forEach(h => {
      if (h.tipo === 'Salida') {
        const key = h.material || 'Desconocido';
        rotation[key] = (rotation[key] || 0) + Number(h.cantidad);
      }
    });
    return Object.entries(rotation)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [historyData]);

  if (authError === 'AUTH_CONFIG_MISSING') return <div className="p-10 text-center text-red-600 font-bold">Falta configurar Auth Anónimo en Firebase</div>;
  if (loading) return <div className="h-screen flex items-center justify-center bg-emerald-900 text-white">Cargando...</div>;

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
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
          {[{id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard'}, {id: 'inventory', icon: Package, label: 'Inventario'}, {id: 'requisitions', icon: ShoppingCart, label: 'Requisiciones'}, {id: 'suppliers', icon: Truck, label: 'Proveedores'}, {id: 'history', icon: History, label: 'Historial'}, {id: 'settings', icon: Settings, label: 'Configuración', adminOnly: true}].map(item => (
            (!item.adminOnly || isAdmin) && (
              <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === item.id ? 'bg-emerald-700 text-white shadow-lg' : 'text-emerald-100 hover:bg-emerald-800'}`}>
                <item.icon size={20} />{sidebarOpen && <span>{item.label}</span>}
              </button>
            )
          ))}
        </nav>
        <div className="p-4 border-t border-emerald-800 space-y-3">
          {sidebarOpen && (
            <div className="flex items-center justify-between text-emerald-300 text-xs">
              <div className="flex items-center gap-2 group cursor-pointer" onClick={handleChangeDeviceName} title="Clic para cambiar identidad">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <div className="flex flex-col"><span className="font-bold text-white truncate max-w-[100px]">{userProfile ? userProfile.name : 'Usuario'}</span><span>En línea</span></div><Pencil size={10} className="opacity-0 group-hover:opacity-100"/>
              </div>
            </div>
          )}
          {sidebarOpen ? (
            <div className="flex items-center justify-between bg-emerald-950/30 p-2 rounded-lg">
              <div className="flex items-center gap-2 text-xs text-emerald-200">{isAdmin ? <Shield size={14} className="text-emerald-400"/> : <Eye size={14}/>}<span>{isAdmin ? 'Admin' : 'Lectura'}</span></div>
              <button onClick={() => isAdmin ? setIsAdmin(false) : setIsLoginModalOpen(true)} className="text-emerald-400 hover:text-white transition-colors">{isAdmin ? <Unlock size={16}/> : <Lock size={16}/>}</button>
            </div>
          ) : (
            <button onClick={() => isAdmin ? setIsAdmin(false) : setIsLoginModalOpen(true)} className="w-full flex justify-center text-emerald-300 hover:text-white">{isAdmin ? <Unlock size={20}/> : <Lock size={20}/>}</button>
          )}
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{activeTab === 'dashboard' ? 'Visión General' : activeTab === 'inventory' ? 'Inventario' : activeTab === 'requisitions' ? 'Requisiciones y Pedidos' : activeTab === 'suppliers' ? 'Proveedores' : activeTab === 'settings' ? 'Configuración' : 'Historial'}</h2>
            <div className="flex items-center gap-2 text-slate-500 text-sm"><Wifi size={14} className="text-emerald-500" /><span>En línea • {isAdmin ? 'Edición Habilitada' : 'Solo Lectura'}</span></div>
          </div>
          <button onClick={() => setIsConnectedUsersModalOpen(true)} className="flex items-center gap-4 text-sm font-medium text-slate-500 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors">
             <div className="flex items-center gap-2"><Users size={18} className="text-blue-500" /><span className="text-blue-700 font-bold">{onlineUsersList.length}</span><span className="text-slate-600">Conectados</span></div>
             <div className="hidden md:flex items-center gap-2 border-l pl-4 border-slate-200 text-xs"><Laptop size={14} className="text-slate-400"/><span className="font-bold text-slate-700">{userProfile ? userProfile.device : 'Dispositivo'}</span><span className="text-emerald-600 font-semibold bg-emerald-50 px-1.5 rounded">(Tú)</span></div>
          </button>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card title="Total Productos" value={inventoryData.length} icon={Package} color="blue" />
              <Card title="Stock Total" value={inventoryData.reduce((acc, item) => acc + item.stock, 0)} icon={BarChartIcon} color="emerald" />
              <Card title="Valor (Sin IVA)" value={`C$${totalValue.toLocaleString('en-US', {minimumFractionDigits: 2})}`} icon={DollarSign} color="indigo" />
              <Card title="Agotados" value={inventoryData.filter(i => i.stock <= 0).length} icon={AlertTriangle} color="red" trend="down" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-80 flex flex-col">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Stock por Categoría</h3>
                  <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={Object.entries(inventoryData.reduce((acc, i) => { const c = i.categoria.includes('CHUMAZERAS')?'CHUMAZERAS':i.categoria; acc[c] = (acc[c]||0)+i.stock; return acc; }, {})).map(([name, value]) => ({name, value})).sort((a,b)=>b.value-a.value).slice(0,7)} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 11}} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-80 flex flex-col">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Activity size={20} className="text-purple-600"/> Análisis de Rotación (Top 5 Salidas)</h3>
                  <div className="flex-1 w-full min-h-0">
                     {rotationData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={rotationData} layout="vertical" margin={{ left: 40 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" width={150} tick={{fontSize: 11}} />
                          <Tooltip cursor={{fill: '#f1f5f9'}} />
                          <Bar dataKey="value" fill="#8B5CF6" radius={[0, 4, 4, 0]} barSize={20} name="Unidades" />
                        </BarChart>
                      </ResponsiveContainer>
                     ) : (
                       <div className="h-full flex items-center justify-center text-slate-400 italic">No hay datos de salidas aún.</div>
                     )}
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-auto overflow-y-auto">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Stock Bajo</h3>
                {inventoryData.filter(i => i.stock <= 5).sort((a,b)=>a.stock-b.stock).map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 hover:bg-slate-50 border-b last:border-0">
                    <div className="truncate pr-2"><p className="text-sm font-medium">{item.material}</p><p className="text-xs text-slate-400">{item.codigo}</p></div>
                    <Badge type={item.stock <= 0 ? "danger" : "warning"}>{item.stock}</Badge>
                  </div>
                ))}
                {inventoryData.filter(i => i.stock <= 5).length === 0 && <p className="text-slate-400 text-sm italic text-center py-10">Todo en orden.</p>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-[calc(100vh-200px)] animate-in fade-in duration-500">
            <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto flex-1">
                 <div className="relative w-full md:w-96"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} /><input type="text" placeholder="Buscar..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
                <div className="flex items-center gap-2 w-full md:w-auto"><Filter size={18} className="text-slate-400" /><select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>{availableCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => exportToCSV(filteredData, 'inventario')} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-lg font-medium shadow-sm"><Download size={20} /> <span className="hidden sm:inline">Exportar</span></button>
                {isAdmin && <button onClick={handleOpenCreateModal} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm"><Plus size={20} /> <span className="hidden sm:inline">Nuevo</span></button>}
              </div>
            </div>
            
            <div className="px-4 py-2 bg-slate-50/50 border-b border-slate-100 flex gap-2">
               <button onClick={() => setStatusFilter('all')} className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-2 transition-colors ${statusFilter === 'all' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}><ListFilter size={14}/> Todos ({inventoryData.length})</button>
               <button onClick={() => setStatusFilter('low')} className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-2 transition-colors ${statusFilter === 'low' ? 'bg-amber-100 text-amber-800 border-amber-200 ring-1 ring-amber-300' : 'bg-white text-slate-600 border-slate-200 hover:bg-amber-50 hover:text-amber-700'}`}><AlertTriangle size={14} className={statusFilter === 'low' ? 'text-amber-600' : 'text-slate-400'}/> Stock Bajo ({inventoryData.filter(i => i.stock <= 5 && i.stock > 0).length})</button>
               <button onClick={() => setStatusFilter('out')} className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-2 transition-colors ${statusFilter === 'out' ? 'bg-red-100 text-red-800 border-red-200 ring-1 ring-red-300' : 'bg-white text-slate-600 border-slate-200 hover:bg-red-50 hover:text-red-700'}`}><AlertCircle size={14} className={statusFilter === 'out' ? 'text-red-600' : 'text-slate-400'}/> Agotados ({inventoryData.filter(i => i.stock <= 0).length})</button>
            </div>

            <div className="overflow-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 sticky top-0 z-10">
                  <tr>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase border-b">Código</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase border-b">Material</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase border-b hidden md:table-cell">Categoría</th>
                    {/* COLUMNA UBICACION ELIMINADA */}
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
                      {/* CELDA UBICACION ELIMINADA */}
                      <td className="p-4 text-sm text-right text-slate-500">C${(item.costo || 0).toFixed(2)}</td>
                      <td className="p-4 text-sm text-right font-bold text-emerald-600">C${((item.costo||0)*(item.aplicaIVA?1.15:1)).toFixed(2)}</td>
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
                  {filteredData.length === 0 && (<tr><td colSpan="8" className="p-8 text-center text-slate-400 italic">No hay productos que coincidan con el filtro.</td></tr>)}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'requisitions' && <RequisitionsView isAdmin={isAdmin} inventoryData={inventoryData} addToast={addToast} />}

        {activeTab === 'suppliers' && <SuppliersView isAdmin={isAdmin} suppliersData={suppliersData} inventoryData={inventoryData} addToast={addToast} />}

        {activeTab === 'history' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-[calc(100vh-200px)] animate-in fade-in duration-500">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-700 flex items-center gap-2"><History size={20} className="text-emerald-600"/> Historial</h3>
              <button onClick={() => exportToCSV(historyData, 'historial')} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-lg font-medium shadow-sm"><Download size={20} /> Exportar</button>
            </div>
            <div className="overflow-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 sticky top-0 z-10">
                  <tr><th className="p-4 border-b">Fecha</th><th className="p-4 border-b">Material</th><th className="p-4 border-b text-center">Tipo</th><th className="p-4 border-b text-right">Cant.</th><th className="p-4 border-b">Destino / Razón</th><th className="p-4 border-b text-right">Usuario</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {historyData.map((log, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-4 text-xs font-mono text-slate-500">{log.fecha}</td>
                      <td className="p-4"><p className="text-sm font-medium">{log.material}</p><p className="text-xs text-slate-400">{log.codigo}</p></td>
                      <td className="p-4 text-center"><span className={`px-2 py-1 rounded text-xs font-bold ${log.tipo==='Entrada'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{log.tipo}</span></td>
                      <td className="p-4 text-sm font-bold text-right">{log.cantidad}</td>
                      <td className="p-4 text-sm text-slate-600"><div className="flex items-center gap-1"><Building2 size={12} className="text-slate-400"/> {log.destino || '-'}</div></td>
                      <td className="p-4 text-xs text-right text-slate-400 italic">{log.usuario || 'Admin'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* NUEVA VISTA: SETTINGS (SOLO ADMIN) */}
        {activeTab === 'settings' && isAdmin && (
          <SettingsView 
            categories={categoriesList.map(c => c.name)} 
            units={unitsList.map(u => u.name)}
            onAddCategory={(name) => push(ref(db, CATEGORIES_PATH), { name })}
            onDeleteCategory={(name) => {
              const item = categoriesList.find(c => c.name === name);
              if (item) remove(ref(db, `${CATEGORIES_PATH}/${item.id}`));
            }}
            onAddUnit={(name) => push(ref(db, UNITS_PATH), { name })}
            onDeleteUnit={(name) => {
              const item = unitsList.find(u => u.name === name);
              if (item) remove(ref(db, `${UNITS_PATH}/${item.id}`));
            }}
          />
        )}
      </main>

      {/* TOASTS & MODALES */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <AdminLoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLogin={() => setIsAdmin(true)} addToast={addToast} />
      <ProfileSetupModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} onSave={handleSaveProfile} />
      <ConnectedUsersModal isOpen={isConnectedUsersModalOpen} onClose={() => setIsConnectedUsersModalOpen(false)} users={onlineUsersList} currentUserId={user?.uid} />
      <MovementModal isOpen={isStockModalOpen} onClose={() => setIsStockModalOpen(false)} item={selectedItem} onSave={handleUpdateStock} />
      {/* Pasar categorías y unidades DINÁMICAS al formulario */}
      <ProductFormModal 
        isOpen={isFormModalOpen} 
        onClose={() => setIsFormModalOpen(false)} 
        onSave={handleSaveProduct} 
        categories={categoriesList.map(c => c.name)} 
        units={unitsList.map(u => u.name)}
        productToEdit={editingItem} 
      />
      <ProductHistoryModal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)} product={historyItem} history={historyData} />
    </div>
  );
}
