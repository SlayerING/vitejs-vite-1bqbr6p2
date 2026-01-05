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
  Settings,
  Moon, 
  Sun,
  ChevronRight,
  FileText,
  Code // Agregado: Icono faltante importado
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
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
  "ACCESORIOS",
  "ADHESIVOS", 
  "ARANDELAS DE PRESIÓN", 
  "ARANDELAS LISAS", 
  "BALINERAS", 
  "BOMBAS",
  "CAMISAS",
  "CHUMAZERAS FLANCH", 
  "CHUMAZERAS PIE", 
  "CUCHILLAS", 
  "DISCOS", 
  "ELÉCTRICO",
  "EQUIPOS DE PROTECCIÓN PERSONAL",
  "EXPANSIÓN",
  "FUNDICIÓN", 
  "GENERAL",
  "HERRAMIENTAS", 
  "HULE",
  "IMPERMEABILIZANTES", 
  "LIJAS", 
  "LLAVES",
  "LUBRICANTES",
  "METALES", 
  "MOTORES",
  "PERNOS", 
  "PIEZAS",
  "PINTURAS", 
  "POLEAS",
  "PRISIONEROS",
  "SOLDADURA", 
  "TORNO",
  "TRANSMISIÓN", 
  "TUERCAS", 
  "VARIOS",
  "VIDRIOS"
];

const DEFAULT_UNITS_LIST = [
  "UNIDADES", "JUEGOS", "GALONES", "LIBRAS", "METROS", "CAJAS", "LITROS", "PARES", "ROLLOS", "BOLSAS", "PIEZAS"
];

const COST_CENTERS = [
  "Mantenimiento General",
  "Infraestructura",
  "Administración",
  "Producción",
  "Ventas / Salida Cliente",
  "Merma / Daño",
  "Uso Interno"
];

const ADMIN_PIN = "2442"; 

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
const QUOTATIONS_PATH = `artifacts/${appId}/public/data/quotations`;
const CATEGORIES_PATH = `artifacts/${appId}/public/data/settings/categories`;
const UNITS_PATH = `artifacts/${appId}/public/data/settings/units`;

// --- HELPERS ---
const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "Tablet";
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated/.test(ua)) return "Móvil";
  return "PC";
};

const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 70%, 85%)`; 
};

const stringToDarkColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 60%, 25%)`; 
};

// --- COMPONENTES UI ---

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div 
          key={toast.id} 
          className={`
            pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-md animate-in slide-in-from-right-10 fade-in duration-300
            ${toast.type === 'success' ? 'bg-emerald-50/90 border-emerald-200 text-emerald-800 dark:bg-emerald-900/80 dark:border-emerald-700 dark:text-emerald-100' : ''}
            ${toast.type === 'error' ? 'bg-red-50/90 border-red-200 text-red-800 dark:bg-red-900/80 dark:border-red-700 dark:text-red-100' : ''}
            ${toast.type === 'info' ? 'bg-blue-50/90 border-blue-200 text-blue-800 dark:bg-blue-900/80 dark:border-blue-700 dark:text-blue-100' : ''}
            ${toast.type === 'warning' ? 'bg-amber-50/90 border-amber-200 text-amber-800 dark:bg-amber-900/80 dark:border-amber-700 dark:text-amber-100' : ''}
          `}
        >
          {toast.type === 'success' && <CheckCircle size={20} />}
          {toast.type === 'error' && <XCircle size={20} />}
          {toast.type === 'info' && <Info size={20} />}
          {toast.type === 'warning' && <AlertTriangle size={20} />}
          <div className="flex-1"><p className="text-sm font-medium">{toast.message}</p></div>
          <button onClick={() => removeToast(toast.id)} className="opacity-60 hover:opacity-100"><X size={16} /></button>
        </div>
      ))}
    </div>
  );
};

const Card = ({ title, value, icon: Icon, color = "blue", subtitle, isDarkMode }) => {
  const gradients = {
    blue: "from-blue-500 to-blue-600",
    emerald: "from-emerald-500 to-emerald-600",
    indigo: "from-indigo-500 to-violet-600",
    red: "from-rose-500 to-red-600"
  };
  
  const bgGradient = gradients[color] || gradients.blue;

  return (
    <div className={`relative overflow-hidden p-6 rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${isDarkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-white/80 border-slate-100'} backdrop-blur-sm`}>
      <div className="flex justify-between items-start z-10 relative">
        <div>
          <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{title}</p>
          <h3 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{value}</h3>
          {subtitle && <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${bgGradient} text-white shadow-lg`}>
          <Icon size={24} />
        </div>
      </div>
      <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-10 bg-gradient-to-br ${bgGradient}`}></div>
    </div>
  );
};

const Badge = ({ children, type }) => {
  const styles = {
    success: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
    warning: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
    danger: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800",
    neutral: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[type] || styles.neutral}`}>
      {children}
    </span>
  );
};

const StockBar = ({ stock, min = 0, max = 100 }) => {
  return (
    <span className={`text-sm font-bold ${stock <= 5 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-400'}`}>{stock}</span>
  );
};

// --- LOGIN MODAL ---
const AdminLoginModal = ({ isOpen, onClose, onLogin, addToast, isDarkMode }) => {
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
      <div className={`rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
        <div className="p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100/20 rounded-full flex items-center justify-center mb-4"><Lock size={32} className="text-blue-500" /></div>
          <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Acceso Administrador</h3>
          <p className={`text-sm mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Ingresa el PIN para modificar datos.</p>
          <form onSubmit={handleSubmit}>
            <input type="password" className={`w-full text-center text-2xl tracking-widest p-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white focus:ring-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-blue-500'} ${error ? 'border-red-500 ring-1 ring-red-500' : ''}`} placeholder="••••" maxLength={4} autoFocus value={pin} onChange={(e) => setPin(e.target.value)} />
            {error && <p className="text-red-500 text-xs mt-2">PIN incorrecto</p>}
            <div className="flex gap-3 mt-6"><button type="button" onClick={onClose} className={`flex-1 py-2.5 rounded-lg transition-colors ${isDarkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-100'}`}>Cancelar</button><button type="submit" className="flex-1 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium shadow-lg shadow-blue-900/20">Entrar</button></div>
          </form>
        </div>
      </div>
    </div>
  );
};

const ProfileSetupModal = ({ isOpen, onClose, onSave, isDarkMode }) => {
  const [name, setName] = useState("");
  const [device, setDevice] = useState("");
  const [type, setType] = useState(getDeviceType());
  useEffect(() => { if (isOpen) { setDevice(`${getDeviceType()} Principal`); } }, [isOpen]);
  if (!isOpen) return null;
  const handleSubmit = (e) => { e.preventDefault(); if (name && device) { onSave({ name, device, type }); onClose(); } };
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className={`rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
        <div className="p-8 text-center">
          <div className="mx-auto w-20 h-20 bg-emerald-100/20 rounded-full flex items-center justify-center mb-6"><User size={40} className="text-emerald-500" /></div>
          <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>¡Bienvenido al Sistema!</h2>
          <p className={`mb-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Para que todos sepan quién está conectado, por favor identifícate.</p>
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div><label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Tu Nombre</label><input type="text" className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'}`} placeholder="Ej. Juan Pérez" autoFocus required value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div><label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Nombre del Dispositivo</label><input type="text" className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'}`} placeholder="Ej. Samsung J9, Laptop Bodega..." required value={device} onChange={(e) => setDevice(e.target.value)} /><p className="text-xs text-slate-400 mt-1">Así aparecerás en la lista de conectados.</p></div>
            <button type="submit" className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/20 mt-4">Comenzar a trabajar</button>
          </form>
        </div>
      </div>
    </div>
  );
};

const ConnectedUsersModal = ({ isOpen, onClose, users, currentUserId, isDarkMode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[50] flex items-start justify-end p-4 pt-20 pointer-events-none">
      <div className={`rounded-xl shadow-2xl w-72 overflow-hidden pointer-events-auto border animate-in slide-in-from-right-10 fade-in ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className={`p-3 border-b flex justify-between items-center ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}><h3 className={`font-bold text-sm flex items-center gap-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}><Users size={16} className="text-blue-500"/> Dispositivos Conectados</h3><button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={16}/></button></div>
        <div className="max-h-60 overflow-y-auto p-2 space-y-1">{users.map((u, idx) => { const isMe = u.user === currentUserId; return (<div key={idx} className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${isMe ? (isDarkMode ? 'bg-blue-900/30 border border-blue-800' : 'bg-blue-50 border border-blue-100') : (isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-50')}`}><div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isMe ? 'bg-blue-500 text-white' : (isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600')}`}>{u.type === 'Móvil' ? <Smartphone size={14}/> : <Monitor size={14}/>}</div><div className="flex-1 min-w-0"><p className={`text-sm font-bold truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{u.name || 'Usuario'}{isMe && <span className="ml-1 text-xs font-normal text-blue-500">(Tú)</span>}</p><p className="text-xs text-slate-500 truncate">{u.deviceName || 'Dispositivo'}</p></div><div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></div></div>); })}</div>
      </div>
    </div>
  );
};

// --- MODALES DE ACCION GENERICOS ---
const ModalWrapper = ({ children, isDarkMode, onClose, title }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className={`rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'}`}>
        <div className={`p-4 border-b flex justify-between items-center ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-100 bg-white'}`}>
          <h3 className="font-bold flex items-center gap-2">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><XCircle size={24} /></button>
        </div>
        {children}
      </div>
  </div>
);

const MovementModal = ({ isOpen, onClose, item, onSave, isDarkMode }) => {
  const [amount, setAmount] = useState(1);
  const [type, setType] = useState('entry'); 
  const [destination, setDestination] = useState(""); 
  useEffect(() => { if (isOpen) setDestination(type === 'exit' ? COST_CENTERS[0] : "Proveedor / Compra"); }, [isOpen, type]);
  if (!isOpen || !item) return null;
  const handleSubmit = () => { const finalAmount = parseInt(amount, 10); if (isNaN(finalAmount) || finalAmount <= 0) return; onSave(item.codigo, finalAmount, type, item.stock, item.material, destination); setAmount(1); onClose(); };
  
  const inputClass = `w-full p-3 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-600 text-white focus:ring-blue-500' : 'bg-white border-slate-300 text-slate-800 focus:ring-blue-500'}`;

  return (
    <ModalWrapper isDarkMode={isDarkMode} onClose={onClose} title="Registrar Movimiento">
        <div className="p-6 space-y-5">
          <div><p className={`text-sm mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Material:</p><p className="font-bold text-lg">{item.material}</p><p className="text-xs text-slate-400 font-mono">Stock Actual: {item.stock}</p></div>
          <div className={`flex gap-2 p-1 rounded-xl ${isDarkMode ? 'bg-slate-900' : 'bg-slate-100'}`}>
            <button className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${type === 'entry' ? 'bg-white text-green-600 shadow-md transform scale-[1.02]' : 'text-slate-500 hover:text-slate-700'} ${isDarkMode && type === 'entry' ? '!bg-slate-700 !text-green-400' : ''}`} onClick={() => setType('entry')}><PlusCircle size={16} className="inline mr-2"/> Entrada</button>
            <button className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${type === 'exit' ? 'bg-white text-red-600 shadow-md transform scale-[1.02]' : 'text-slate-500 hover:text-slate-700'} ${isDarkMode && type === 'exit' ? '!bg-slate-700 !text-red-400' : ''}`} onClick={() => setType('exit')}><MinusCircle size={16} className="inline mr-2"/> Salida</button>
          </div>
          <div><label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Cantidad</label><input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputClass} autoFocus /></div>
          {type === 'exit' && (item.stock - amount < 0) && (<div className="p-3 bg-red-500/10 text-red-500 text-sm rounded-lg flex items-start gap-2 border border-red-500/20"><AlertTriangle size={16} className="mt-0.5" /> <span>Advertencia: Stock negativo ({item.stock - amount}).</span></div>)}
        </div>
        <div className={`p-4 border-t flex gap-3 ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-100 bg-slate-50'}`}><button onClick={onClose} className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors ${isDarkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-200'}`}>Cancelar</button><button onClick={handleSubmit} className={`flex-1 px-4 py-2.5 text-white font-medium rounded-lg shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 ${type === 'entry' ? 'bg-green-600 hover:bg-green-700 shadow-green-900/20' : 'bg-red-600 hover:bg-red-700 shadow-red-900/20'}`}><Save size={18} /> Confirmar</button></div>
    </ModalWrapper>
  );
};

const ProductFormModal = ({ isOpen, onClose, onSave, categories, units, productToEdit, isDarkMode }) => {
  const [formData, setFormData] = useState({ codigo: '', material: '', categoria: '', unidad: '', stock: 0, costo: 0, aplicaIVA: true });
  useEffect(() => {
    if (isOpen) {
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
        setFormData({ codigo: '', material: '', categoria: defaultCat, unidad: defaultUnit, stock: 0, costo: 0, aplicaIVA: true });
      }
    }
  }, [isOpen, productToEdit, categories, units]);

  if (!isOpen) return null;
  const handleSubmit = (e) => { e.preventDefault(); if (!formData.codigo || !formData.material) return; onSave(formData, !!productToEdit); onClose(); };
  const inputClass = `w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-600 text-white focus:ring-blue-500' : 'bg-white border-slate-300 text-slate-800 focus:ring-blue-500'}`;
  const labelClass = `block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`;

  return (
    <ModalWrapper isDarkMode={isDarkMode} onClose={onClose} title={productToEdit ? 'Editar Producto' : 'Nuevo Producto'}>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelClass}>Código *</label><input required type="text" disabled={!!productToEdit} placeholder="Ej. PE0999" className={`${inputClass} ${productToEdit ? 'opacity-50 cursor-not-allowed' : ''}`} value={formData.codigo} onChange={(e) => setFormData({...formData, codigo: e.target.value})} /></div>
            <div><label className={labelClass}>Categoría</label><select className={inputClass} value={formData.categoria} onChange={(e) => setFormData({...formData, categoria: e.target.value})}>{categories.map((cat, idx) => <option key={`${cat}-${idx}`} value={cat}>{cat}</option>)}</select></div>
          </div>
          <div><label className={labelClass}>Nombre del Material *</label><input required type="text" placeholder="Ej. Perno Hexagonal 3/4" className={inputClass} value={formData.material} onChange={(e) => setFormData({...formData, material: e.target.value})} /></div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className={labelClass}>Unidad</label><select className={inputClass} value={formData.unidad} onChange={(e) => setFormData({...formData, unidad: e.target.value})}>{units.map((u, idx) => <option key={`${u}-${idx}`} value={u}>{u}</option>)}</select></div>
            <div><label className={labelClass}>Stock</label><input type="number" min="0" className={inputClass} value={formData.stock} onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})} /></div>
            <div><label className={labelClass}>Costo Unit.</label><div className="relative"><span className="absolute left-3 top-2.5 text-slate-400">C$</span><input type="number" min="0" step="0.01" className={`${inputClass} pl-9`} value={formData.costo} onChange={(e) => setFormData({...formData, costo: parseFloat(e.target.value) || 0})} /></div></div>
          </div>
          <div className="flex items-center gap-2 pt-2"><input type="checkbox" id="ivaCheck" checked={formData.aplicaIVA} onChange={(e) => setFormData({...formData, aplicaIVA: e.target.checked})} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300" /><label htmlFor="ivaCheck" className={labelClass}>Aplica IVA (15%)</label></div>
          <div className="pt-4 flex gap-3"><button type="button" onClick={onClose} className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors ${isDarkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-200'}`}>Cancelar</button><button type="submit" className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"><Save size={18} /> {productToEdit ? 'Actualizar' : 'Guardar'}</button></div>
        </form>
    </ModalWrapper>
  );
};

const ProductHistoryModal = ({ isOpen, onClose, product, history, isDarkMode }) => {
  if (!isOpen || !product) return null;
  const productHistory = history.filter(h => h.codigo === product.codigo);
  return (
    <ModalWrapper isDarkMode={isDarkMode} onClose={onClose} title="Kardex / Historial">
        <div className="p-4 border-b flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50"><div className="flex items-center gap-2"><div className={`p-2 rounded-lg ${isDarkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-50 text-purple-600'}`}><FileClock size={20}/></div><div><p className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{product.material}</p><p className="text-xs text-slate-500">{product.codigo}</p></div></div></div>
        <div className="overflow-y-auto p-0 max-h-[50vh]">
          {productHistory.length === 0 ? (<div className="text-center py-10 text-slate-400 italic">No hay movimientos registrados.</div>) : (
            <table className={`w-full text-left text-sm border-collapse ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              <thead className={`sticky top-0 z-10 ${isDarkMode ? 'bg-slate-900 text-slate-400' : 'bg-slate-50 text-slate-500'}`}><tr><th className="p-3 border-b border-slate-200 dark:border-slate-700">Fecha</th><th className="p-3 border-b border-slate-200 dark:border-slate-700 text-center">Tipo</th><th className="p-3 border-b border-slate-200 dark:border-slate-700 text-right">Cant.</th><th className="p-3 border-b border-slate-200 dark:border-slate-700 text-right">Saldo</th><th className="p-3 border-b border-slate-200 dark:border-slate-700">Usuario</th></tr></thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {productHistory.map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="p-3 font-mono text-xs opacity-70">{log.fecha.split(',')[0]}</td>
                    <td className="p-3 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${log.tipo === 'Entrada' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400'}`}>{log.tipo}</span></td>
                    <td className="p-3 text-right font-bold">{log.cantidad}</td>
                    <td className="p-3 text-right opacity-70">{log.stockNuevo}</td>
                    <td className="p-3 text-xs truncate max-w-[100px]">{log.usuario || 'Admin'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
    </ModalWrapper>
  );
};

// --- COMPONENTE DE PROVEEDORES ---
const SuppliersView = ({ isAdmin, suppliersData, inventoryData, addToast, isDarkMode }) => {
  const [activeTab, setActiveTab] = useState('list');
  const [newSupplier, setNewSupplier] = useState({ nombre: '', contacto: '', telefono: '' });
  const [selectedProduct, setSelectedProduct] = useState('');
  const [comparisonData, setComparisonData] = useState([]);
  const handleAddSupplier = async (e) => { e.preventDefault(); if(!newSupplier.nombre) return; try { await push(ref(db, SUPPLIERS_PATH), newSupplier); setNewSupplier({ nombre: '', contacto: '', telefono: '' }); addToast("Proveedor agregado con éxito", "success"); } catch (e) { addToast("Error al guardar proveedor", "error"); } };
  const handleDeleteSupplier = async (id) => { if(window.confirm("¿Borrar proveedor?")) { try { await remove(ref(db, `${SUPPLIERS_PATH}/${id}`)); addToast("Proveedor eliminado", "success"); } catch (e) { addToast("Error al eliminar", "error"); } } };
  const addComparisonRow = () => setComparisonData([...comparisonData, { supplierId: '', price: 0 }]);
  const updateComparisonRow = (idx, field, value) => { const newData = [...comparisonData]; newData[idx][field] = value; setComparisonData(newData); };
  
  const inputClass = `w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white focus:ring-blue-500' : 'bg-white border-slate-300 text-slate-800 focus:ring-blue-500'}`;

  return (
    <div className={`rounded-xl shadow-sm border flex flex-col h-full overflow-hidden ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-100'}`}>
      <div className={`p-4 border-b flex gap-4 ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}><button onClick={() => setActiveTab('list')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'list' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : (isDarkMode ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-50')}`}>Directorio</button><button onClick={() => setActiveTab('compare')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'compare' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : (isDarkMode ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-50')}`}>Comparador</button></div>
      <div className="p-6 overflow-y-auto flex-1">
        {activeTab === 'list' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {isAdmin && (<div><h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Agregar Nuevo Proveedor</h3><form onSubmit={handleAddSupplier} className={`space-y-4 p-5 rounded-xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}><input placeholder="Nombre Empresa" className={inputClass} value={newSupplier.nombre} onChange={e => setNewSupplier({...newSupplier, nombre: e.target.value})} required /><input placeholder="Nombre Contacto" className={inputClass} value={newSupplier.contacto} onChange={e => setNewSupplier({...newSupplier, contacto: e.target.value})} /><input placeholder="Teléfono / Email" className={inputClass} value={newSupplier.telefono} onChange={e => setNewSupplier({...newSupplier, telefono: e.target.value})} /><button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-[1.02] font-medium shadow-lg shadow-blue-900/20">Guardar Proveedor</button></form></div>)}
            <div className={!isAdmin ? "lg:col-span-2" : ""}>
              <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Lista de Proveedores</h3>
              <div className="space-y-3">{suppliersData.length === 0 && <p className="text-slate-400 italic">No hay proveedores registrados.</p>}{suppliersData.map(sup => (<div key={sup.id} className={`flex justify-between items-center p-4 border rounded-xl shadow-sm transition-all hover:scale-[1.01] ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}><div><p className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{sup.nombre}</p><p className="text-xs text-slate-500">{sup.contacto} • {sup.telefono}</p></div>{isAdmin && <button onClick={() => handleDeleteSupplier(sup.id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors"><Trash2 size={18}/></button>}</div>))}</div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto"><h3 className={`text-lg font-bold mb-4 text-center ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Comparador de Precios</h3><div className={`p-6 rounded-xl border mb-6 ${isDarkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-100'}`}><label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-blue-300' : 'text-slate-700'}`}>Selecciona un Material para cotizar:</label><select className={inputClass} value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}><option value="">-- Selecciona Material --</option>{inventoryData.map(item => <option key={item.codigo} value={item.material}>{item.material} ({item.codigo})</option>)}</select>
          {selectedProduct && (<div className="space-y-4 mt-6"><div className="flex justify-between items-center"><h4 className={`font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Cotizaciones</h4>{isAdmin && <button onClick={addComparisonRow} className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:text-blue-400"><PlusCircle size={16}/> Agregar Cotización</button>}</div>{comparisonData.map((row, idx) => (<div key={idx} className="flex gap-4 items-center"><select className={inputClass} value={row.supplierId} onChange={e => updateComparisonRow(idx, 'supplierId', e.target.value)} disabled={!isAdmin}><option value="">Selecciona Proveedor...</option>{suppliersData.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}</select><div className="relative w-32"><span className="absolute left-3 top-3 text-slate-400">C$</span><input type="number" className={`${inputClass} pl-9`} placeholder="0.00" value={row.price} onChange={e => updateComparisonRow(idx, 'price', parseFloat(e.target.value))} disabled={!isAdmin} /></div></div>))}
          {comparisonData.length > 1 && (<div className={`mt-6 p-4 border rounded-xl text-center ${isDarkMode ? 'bg-emerald-900/30 border-emerald-800' : 'bg-emerald-50 border-emerald-200'}`}><p className={`font-bold text-lg ${isDarkMode ? 'text-emerald-400' : 'text-emerald-800'}`}>Mejor opción: {(() => { const valid = comparisonData.filter(d => d.price > 0 && d.supplierId); if(valid.length === 0) return "--"; const best = valid.reduce((min, curr) => curr.price < min.price ? curr : min, valid[0]); const sup = suppliersData.find(s => s.id === best.supplierId); return `${sup?.nombre || 'Desconocido'} a C$${best.price}`; })()}</p></div>)}</div>)}</div></div>
        )}
      </div>
    </div>
  );
};

// --- NUEVA VISTA: COTIZACIONES (SIN PRECIOS) ---
const QuotationsView = ({ inventoryData, addToast, isAdmin, isDarkMode, logoUrl }) => {
  const [items, setItems] = useState([]);
  const [searchItem, setSearchItem] = useState('');

  const handleAddItem = (item) => {
    if (items.find(i => i.codigo === item.codigo)) { addToast("Ya está en la lista", "info"); return; }
    setItems([...items, { ...item, cantidad: 1 }]);
    addToast("Agregado a cotización", "success");
  };

  const handleRemoveItem = (codigo) => { setItems(items.filter(i => i.codigo !== codigo)); };
  const handleUpdateQty = (codigo, qty) => { setItems(items.map(i => i.codigo === codigo ? { ...i, cantidad: parseInt(qty) || 0 } : i)); };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    const html = `
      <html>
      <head>
        <title>Solicitud de Cotización</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; border-bottom: 2px solid #047857; padding-bottom: 20px; }
          .logo { max-height: 80px; }
          h1 { color: #047857; margin: 0; font-size: 24px; }
          .meta { margin-bottom: 30px; line-height: 1.6; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f3f4f6; text-align: center; }
          .empty-col { width: 150px; }
          .footer { margin-top: 60px; text-align: center; font-size: 12px; color: #666; }
          @media print { button { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1>Solicitud de Cotización</h1>
            <p><strong>Fecha:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <img src="${logoUrl}" class="logo" alt="Logo" />
        </div>
        
        <div class="meta">
          <p><strong>Estimados proveedores,</strong></p>
          <p>Por medio de la presente solicitamos amablemente nos coticen los siguientes materiales, indicando precios unitarios, tiempo de entrega y condiciones de pago.</p>
        </div>

        <table>
          <thead>
            <tr>
              <th width="15%">Código</th>
              <th width="40%">Descripción / Material</th>
              <th width="10%">Cantidad</th>
              <th class="empty-col">Precio Unitario</th>
              <th class="empty-col">Tiempo Entrega</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr>
                <td style="text-align: center">${item.codigo}</td>
                <td>${item.material}</td>
                <td style="text-align: center"><strong>${item.cantidad}</strong> ${item.unidad}</td>
                <td></td>
                <td></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="footer">
           <p>Favor enviar cotización formal a la brevedad posible.</p>
           <p><strong>CONTROL ISC MATAGALPA</strong></p>
        </div>
        
        <script>window.print();</script>
      </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const filteredInventory = inventoryData.filter(i => i.material.toLowerCase().includes(searchItem.toLowerCase()) || i.codigo.toLowerCase().includes(searchItem.toLowerCase()));

  return (
    <div className={`rounded-xl shadow-sm border flex flex-col h-full overflow-hidden ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-100'}`}>
       <div className={`p-4 border-b flex justify-between items-center ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
          <div className="flex gap-4 items-center"><h3 className={`font-bold text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}><FileText className="text-blue-500"/> Solicitud de Cotización</h3><span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{items.length} Items</span></div>
          <div className="flex gap-2"><button onClick={handlePrint} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-800 text-white hover:bg-slate-700'}`}><Printer size={16}/> Imprimir Solicitud</button></div>
       </div>
       <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          <div className={`w-full lg:w-1/3 border-r flex flex-col ${isDarkMode ? 'border-slate-700 bg-slate-800/30' : 'border-slate-100 bg-slate-50/50'}`}>
             <div className={`p-4 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}><div className="relative"><Search className="absolute left-3 top-2.5 text-slate-400" size={16}/><input type="text" placeholder="Buscar para cotizar..." className={`w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300'}`} value={searchItem} onChange={(e) => setSearchItem(e.target.value)}/></div></div>
             <div className="flex-1 overflow-y-auto p-2">{filteredInventory.map(item => (<div key={item.codigo} className={`flex justify-between items-center p-3 hover:shadow-sm rounded-lg border border-transparent transition-all cursor-pointer group ${isDarkMode ? 'hover:bg-slate-800 hover:border-slate-700' : 'hover:bg-white hover:border-slate-200'}`} onClick={() => handleAddItem(item)}><div className="min-w-0"><p className={`font-medium text-sm truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{item.material}</p><p className="text-xs text-slate-500">{item.codigo}</p></div><button className="text-blue-500 opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-blue-500/10"><Plus size={16}/></button></div>))}</div>
          </div>
          <div className="flex-1 flex flex-col">
             <div className="flex-1 overflow-y-auto">
                {items.length === 0 ? (
                  <div className={`h-full flex flex-col items-center justify-center ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}><FileText size={48} className="mb-4 opacity-50"/><p>Selecciona productos a la izquierda para crear una solicitud.</p></div>
                ) : (
                  <table className={`w-full text-left text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                     <thead className={`sticky top-0 z-10 ${isDarkMode ? 'bg-slate-900 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                        <tr><th className="p-3">Código</th><th className="p-3">Material</th><th className="p-3 text-center">Cantidad Solicitada</th><th className="p-3 text-center">Acción</th></tr>
                     </thead>
                     <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-slate-100'}`}>
                        {items.map(item => (
                           <tr key={item.codigo} className={`transition-colors ${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}>
                              <td className="p-3 font-mono text-xs opacity-70">{item.codigo}</td>
                              <td className={`p-3 font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{item.material}</td>
                              <td className="p-3 text-center">
                                <input 
                                  type="number" 
                                  min="1" 
                                  className={`w-20 text-center p-1 border rounded ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                                  value={item.cantidad}
                                  onChange={(e) => handleUpdateQty(item.codigo, e.target.value)}
                                />
                              </td>
                              <td className="p-3 text-center"><button onClick={() => handleRemoveItem(item.codigo)} className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-500/10"><Trash2 size={16}/></button></td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
                )}
             </div>
          </div>
       </div>
    </div>
  );
};

// --- REQUISICIONES (INTERNO) ---
const RequisitionsView = ({ inventoryData, addToast, isAdmin, isDarkMode }) => {
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
    <div className={`rounded-xl shadow-sm border flex flex-col h-full overflow-hidden ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-100'}`}>
       <div className={`p-4 border-b flex justify-between items-center ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
          <div className="flex gap-4 items-center"><h3 className={`font-bold text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}><ShoppingCart className="text-emerald-600"/> Requisiciones</h3><span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">{requisitions.length} Items</span></div>
          <div className="flex gap-2">{isAdmin && <button onClick={handleAutoFill} className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-100 text-sm font-medium"><FilePlus size={16}/> Cargar Stock Bajo</button>}<button onClick={handlePrint} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-800 text-white hover:bg-slate-700'}`}><Printer size={16}/> Imprimir Lista</button></div>
       </div>
       <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          <div className={`w-full lg:w-1/3 border-r flex flex-col ${isDarkMode ? 'border-slate-700 bg-slate-800/30' : 'border-slate-100 bg-slate-50/50'}`}>
             <div className={`p-4 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}><div className="relative"><Search className="absolute left-3 top-2.5 text-slate-400" size={16}/><input type="text" placeholder="Buscar producto..." className={`w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300'}`} value={searchItem} onChange={(e) => setSearchItem(e.target.value)}/></div></div>
             <div className="flex-1 overflow-y-auto p-2">{filteredInventory.map(item => (<div key={item.codigo} className={`flex justify-between items-center p-3 hover:shadow-sm rounded-lg border border-transparent transition-all cursor-pointer group ${isDarkMode ? 'hover:bg-slate-800 hover:border-slate-700' : 'hover:bg-white hover:border-slate-200'}`} onClick={() => isAdmin && handleAddToRequisition(item)}><div className="min-w-0"><p className={`font-medium text-sm truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{item.material}</p><p className="text-xs text-slate-500">Stock: <span className={item.stock <= 5 ? "text-red-500 font-bold" : ""}>{item.stock}</span></p></div>{isAdmin && <button className="text-emerald-500 opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-emerald-500/10"><Plus size={16}/></button>}</div>))}</div>
          </div>
          <div className="flex-1 flex flex-col">
             <div className="flex-1 overflow-y-auto">
                <table className={`w-full text-left text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                   <thead className={`sticky top-0 z-10 ${isDarkMode ? 'bg-slate-900 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                      <tr><th className="p-3">Código</th><th className="p-3">Material</th><th className="p-3 text-center">Stock Actual</th><th className="p-3 text-right">Costo Unit.</th><th className="p-3 text-right">Costo + IVA</th><th className="p-3 text-center">Acción</th></tr>
                   </thead>
                   <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-slate-100'}`}>
                      {requisitions.map(req => {
                         const stockActual = inventoryData.find(i => i.codigo === req.codigo)?.stock || 0;
                         return (
                         <tr key={req.id} className={`transition-colors ${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}>
                            <td className="p-3 font-mono text-xs opacity-70">{req.codigo}</td>
                            <td className={`p-3 font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{req.material}</td>
                            <td className="p-3 text-center font-bold opacity-80">{stockActual}</td>
                            <td className="p-3 text-right opacity-70">C${(req.costo).toFixed(2)}</td>
                            <td className="p-3 text-right font-bold text-emerald-600">C${(req.costo * (req.aplicaIVA ? 1.15 : 1)).toFixed(2)}{req.aplicaIVA && <span className="text-[10px] ml-1 text-slate-400">(15%)</span>}</td>
                            <td className="p-3 text-center">{isAdmin && <button onClick={() => handleRemoveRequisition(req.id)} className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-500/10"><Trash2 size={16}/></button>}</td>
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

// --- SETTINGS VIEW (CONFIGURACIÓN) ---
const SettingsView = ({ categories, units, onAddCategory, onDeleteCategory, onAddUnit, onDeleteUnit, isDarkMode }) => {
  const [newCat, setNewCat] = useState("");
  const [newUnit, setNewUnit] = useState("");
  const handleAddCat = (e) => { e.preventDefault(); if(newCat) { onAddCategory(newCat); setNewCat(""); } };
  const handleAddUnit = (e) => { e.preventDefault(); if(newUnit) { onAddUnit(newUnit); setNewUnit(""); } };
  const inputClass = `flex-1 p-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white focus:ring-blue-500' : 'bg-white border-slate-300 text-slate-800 focus:ring-blue-500'}`;
  
  return (
    <div className={`rounded-xl shadow-sm border flex flex-col h-full overflow-hidden ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-100'}`}>
      <div className={`p-4 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}><h3 className={`font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}><Settings size={20} className="text-gray-500"/> Configuración del Sistema</h3></div>
      <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col h-full">
           <h4 className={`font-bold mb-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Categorías de Productos</h4>
           <form onSubmit={handleAddCat} className="flex gap-2 mb-4"><input className={inputClass} placeholder="Nueva Categoría..." value={newCat} onChange={e => setNewCat(e.target.value.toUpperCase())} /><button type="submit" className="bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700 transition-colors"><Plus size={18}/></button></form>
           <div className={`flex-1 overflow-y-auto border rounded-xl p-2 space-y-1 max-h-96 ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
             {categories.map((cat, idx) => (<div key={`${cat}-${idx}`} className={`flex justify-between items-center p-2 rounded border transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-100 text-slate-700'}`}><span className="text-sm font-medium">{cat}</span><button onClick={() => onDeleteCategory(cat)} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={14}/></button></div>))}
           </div>
        </div>
        <div className="flex flex-col h-full">
           <h4 className={`font-bold mb-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Unidades de Medida</h4>
           <form onSubmit={handleAddUnit} className="flex gap-2 mb-4"><input className={inputClass} placeholder="Nueva Unidad..." value={newUnit} onChange={e => setNewUnit(e.target.value.toUpperCase())} /><button type="submit" className="bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700 transition-colors"><Plus size={18}/></button></form>
           <div className={`flex-1 overflow-y-auto border rounded-xl p-2 space-y-1 max-h-96 ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
             {units.map((unit, idx) => (<div key={`${unit}-${idx}`} className={`flex justify-between items-center p-2 rounded border transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-100 text-slate-700'}`}><span className="text-sm font-medium">{unit}</span><button onClick={() => onDeleteUnit(unit)} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={14}/></button></div>))}
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
  
  // TEMA OSCURO
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('isc_theme') === 'dark');

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
  
  // --- TOGGLE THEME ---
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('isc_theme', newTheme ? 'dark' : 'light');
  };

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
        const list = Object.entries(data).map(([k, v]) => ({ id: k, name: (typeof v === 'object' && v.name) ? v.name : v }));
        setCategoriesList(list); 
      }
    });

    const unitsRef = ref(db, UNITS_PATH);
    const unsubscribeUnits = onValue(unitsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) { set(ref(db, UNITS_PATH), DEFAULT_UNITS_LIST); }
      else { 
        const list = Object.entries(data).map(([k, v]) => ({ id: k, name: (typeof v === 'object' && v.name) ? v.name : v }));
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
    const item = categoriesList.find(c => c.name === catName);
    if (item && item.id) {
       remove(ref(db, `${CATEGORIES_PATH}/${item.id}`))
         .then(() => addToast("Categoría eliminada", "success"))
         .catch(() => addToast("Error al eliminar", "error"));
    } else {
       addToast("No se pudo eliminar", "warning");
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
  const availableCategories = ['Todas', ...new Set([...configCategories, ...inventoryCategories])].sort(); // ORDEN ALFABÉTICO

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
  const totalValue = inventoryData.reduce((acc, item) => acc + (item.stock * parseFloat(item.costo || 0) * (item.aplicaIVA ? 1.15 : 1)), 0);

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
    <div className={`flex h-screen font-sans transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#f8fafc] text-slate-800'}`}>
      <aside className={`w-20 md:w-64 transition-all duration-300 flex flex-col fixed h-full z-20 shadow-2xl backdrop-blur-xl border-r ${isDarkMode ? 'bg-slate-900/95 border-slate-800' : 'bg-white/80 border-white/50'}`}>
        <div className="p-6 flex flex-col justify-center h-20">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center gap-3">
                <div className={`relative group ${isAdmin ? 'cursor-pointer' : ''}`} onClick={handleLogoClick} title={isAdmin ? "Cambiar logo" : ""}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                    {/* Contenedor de imagen centrado */}
                    <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
                  </div>
                  {isAdmin && <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 rounded-xl transition-opacity"><Upload size={16} className="text-white"/></div>}
                  <input type="file" ref={fileInputRef} onChange={handleLogoChange} className="hidden" accept="image/*" />
                </div>
                <div>
                  {/* AQUÍ ESTÁ EL CAMBIO PARA EL COLOR DEL TEXTO "CONTROL" */}
                  <h1 className={`text-xl font-bold tracking-tight leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    CONTROL <span className="text-emerald-500">ISC</span>
                  </h1>
                  <p className={`text-[10px] font-medium tracking-wider uppercase mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Matagalpa</p>
                </div>
              </div>
            )}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`p-1.5 rounded-lg transition-colors md:hidden ${isDarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-400 hover:bg-slate-100'}`}>{sidebarOpen ? <X size={20} /> : <Menu size={20} />}</button>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1">
          {[{id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard'}, {id: 'inventory', icon: Package, label: 'Inventario'}, {id: 'requisitions', icon: ShoppingCart, label: 'Requisiciones'}, {id: 'quotations', icon: FileText, label: 'Cotizaciones'}, {id: 'suppliers', icon: Truck, label: 'Proveedores'}, {id: 'history', icon: History, label: 'Historial'}, {id: 'settings', icon: Settings, label: 'Configuración', adminOnly: true}].map(item => (
            (!item.adminOnly || isAdmin) && (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${activeTab === item.id ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20' : (isDarkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-500 hover:bg-white hover:shadow-sm hover:text-emerald-600')}`}
              >
                <item.icon size={20} className={`${activeTab === item.id ? 'animate-pulse' : ''}`}/>
                <span className={`font-medium ${!sidebarOpen && 'hidden md:inline'}`}>{item.label}</span>
                {activeTab === item.id && <div className="absolute right-0 top-0 h-full w-1 bg-white/20"></div>}
              </button>
            )
          ))}
        </nav>

        <div className={`p-4 border-t space-y-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
           <button 
             onClick={toggleTheme} 
             className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-colors ${isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
           >
             {isDarkMode ? <><Sun size={14}/> Modo Claro</> : <><Moon size={14}/> Modo Oscuro</>}
           </button>

          {sidebarOpen && (
            <div className={`flex items-center justify-between text-xs px-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              <div className="flex items-center gap-2 group cursor-pointer" onClick={handleChangeDeviceName} title="Clic para cambiar identidad">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                <div className="flex flex-col">
                  <span className={`font-bold truncate max-w-[100px] ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{userProfile ? userProfile.name : 'Usuario'}</span>
                  <span>En línea</span>
                </div>
                <Pencil size={10} className="opacity-0 group-hover:opacity-100 transition-opacity"/>
              </div>
            </div>
          )}
          
          <div className={`flex items-center justify-between p-2 rounded-xl border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-2 text-xs">
                <div className={`p-1.5 rounded-lg ${isAdmin ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'}`}>
                  {isAdmin ? <Shield size={14}/> : <Eye size={14}/>}
                </div>
                <span className={`font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{isAdmin ? 'Admin' : 'Visor'}</span>
              </div>
              <button 
                onClick={() => isAdmin ? setIsAdmin(false) : setIsLoginModalOpen(true)}
                className={`p-1.5 rounded-lg transition-all ${isDarkMode ? 'hover:bg-slate-700 text-slate-400 hover:text-white' : 'hover:bg-white hover:shadow-sm text-slate-400 hover:text-emerald-600'}`}
                title={isAdmin ? "Cerrar sesión" : "Ingresar como admin"}
              >
                {isAdmin ? <Unlock size={14}/> : <Lock size={14}/>}
              </button>
            </div>
             <div className={`text-[10px] text-center mt-2 flex items-center justify-center gap-1 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
               <Code size={10} /> Desarrollado por Jeffry Reyes
             </div>
        </div>
      </aside>

      <main className={`flex-1 overflow-y-auto p-4 md:p-8 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'ml-20'}`}>
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{activeTab === 'dashboard' ? 'Visión General' : activeTab === 'inventory' ? 'Inventario' : activeTab === 'requisitions' ? 'Requisiciones y Pedidos' : activeTab === 'quotations' ? 'Solicitud Cotización' : activeTab === 'suppliers' ? 'Proveedores' : activeTab === 'settings' ? 'Configuración' : 'Historial'}</h2>
            <div className="flex items-center gap-2 text-sm mt-1 font-medium"><Wifi size={14} className="text-emerald-500" /><span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Conexión estable • {isAdmin ? 'Edición Habilitada' : 'Solo Lectura'}</span></div>
          </div>
          <button onClick={() => setIsConnectedUsersModalOpen(true)} className={`group flex items-center gap-4 text-sm font-medium px-4 py-2 rounded-full border shadow-sm transition-all hover:scale-105 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-200'}`}>
             <div className="flex items-center gap-2"><Users size={18} className="text-blue-500 group-hover:animate-bounce" /><span className="text-blue-600 font-bold">{onlineUsersList.length}</span><span>Conectados</span></div>
             <div className={`hidden md:flex items-center gap-2 border-l pl-4 text-xs ${isDarkMode ? 'border-slate-600' : 'border-slate-200'}`}>
               {userProfile && userProfile.type === 'Móvil' ? <Smartphone size={14} className="text-slate-400"/> : <Laptop size={14} className="text-slate-400"/>}
               <span className="font-bold">{myDeviceName}</span>
               <span className="text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold">(Tú)</span>
             </div>
          </button>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card isDarkMode={isDarkMode} title="Total Productos" value={inventoryData.length} icon={Package} color="blue" />
              <Card isDarkMode={isDarkMode} title="Stock Total" value={inventoryData.reduce((acc, item) => acc + item.stock, 0)} icon={BarChartIcon} color="emerald" />
              <Card isDarkMode={isDarkMode} title="Valor (Sin IVA)" value={`C$${totalValue.toLocaleString('en-US', {minimumFractionDigits: 2})}`} icon={DollarSign} color="indigo" />
              <Card isDarkMode={isDarkMode} title="Agotados" value={inventoryData.filter(i => i.stock <= 0).length} icon={AlertTriangle} color="red" trend="down" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className={`p-6 rounded-2xl shadow-sm border h-80 flex flex-col transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                  <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Stock por Categoría</h3>
                  <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={Object.entries(inventoryData.reduce((acc, i) => { const c = i.categoria.includes('CHUMAZERAS')?'CHUMAZERAS':i.categoria; acc[c] = (acc[c]||0)+i.stock; return acc; }, {})).map(([name, value]) => ({name, value})).sort((a,b)=>b.value-a.value).slice(0,7)} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 11, fill: isDarkMode ? '#94a3b8' : '#64748b'}} />
                        <Tooltip contentStyle={{backgroundColor: isDarkMode ? '#1e293b' : '#fff', borderColor: isDarkMode ? '#334155' : '#e2e8f0', color: isDarkMode ? '#fff' : '#000'}} cursor={{fill: isDarkMode ? '#334155' : '#f1f5f9'}} />
                        <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={20}>
                          {
                            Object.entries(inventoryData.reduce((acc, i) => { const c = i.categoria.includes('CHUMAZERAS')?'CHUMAZERAS':i.categoria; acc[c] = (acc[c]||0)+i.stock; return acc; }, {})).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={`hsl(${210 + (index * 20)}, 80%, ${isDarkMode ? '60%' : '50%'})`} />
                            ))
                          }
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className={`p-6 rounded-2xl shadow-sm border h-80 flex flex-col transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                  <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}><Activity size={20} className="text-purple-500"/> Análisis de Rotación (Top 5 Salidas)</h3>
                  <div className="flex-1 w-full min-h-0">
                     {rotationData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={rotationData} layout="vertical" margin={{ left: 40 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" width={150} tick={{fontSize: 11, fill: isDarkMode ? '#94a3b8' : '#64748b'}} />
                          <Tooltip contentStyle={{backgroundColor: isDarkMode ? '#1e293b' : '#fff', borderColor: isDarkMode ? '#334155' : '#e2e8f0', color: isDarkMode ? '#fff' : '#000'}} cursor={{fill: isDarkMode ? '#334155' : '#f1f5f9'}} />
                          <Bar dataKey="value" fill="#8B5CF6" radius={[0, 4, 4, 0]} barSize={20} name="Unidades" />
                        </BarChart>
                      </ResponsiveContainer>
                     ) : (
                       <div className={`h-full flex items-center justify-center italic ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`}>No hay datos de salidas aún.</div>
                     )}
                  </div>
                </div>
              </div>
              <div className={`p-6 rounded-2xl shadow-sm border h-auto overflow-y-auto transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Stock Bajo</h3>
                <div className="space-y-2">
                  {inventoryData.filter(i => i.stock <= 5).sort((a,b)=>a.stock-b.stock).map((item, idx) => (
                    <div key={idx} className={`flex justify-between items-center p-3 rounded-lg border transition-colors ${isDarkMode ? 'bg-slate-900/50 border-slate-700 hover:bg-slate-700' : 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-sm'}`}>
                      <div className="truncate pr-2"><p className={`text-sm font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{item.material}</p><p className="text-xs text-slate-400">{item.codigo}</p></div>
                      <Badge type={item.stock <= 0 ? "danger" : "warning"}>{item.stock}</Badge>
                    </div>
                  ))}
                  {inventoryData.filter(i => i.stock <= 5).length === 0 && <p className="text-slate-400 text-sm italic text-center py-10">Todo en orden.</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className={`rounded-2xl shadow-sm border flex flex-col h-[calc(100vh-200px)] animate-in fade-in duration-500 overflow-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <div className={`p-4 border-b flex flex-col md:flex-row gap-4 items-center justify-between ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto flex-1">
                 <div className="relative w-full md:w-96"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} /><input type="text" placeholder="Buscar..." className={`w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-600 text-white' : 'bg-slate-50 border-slate-200'}`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
                <div className="flex items-center gap-2 w-full md:w-auto"><Filter size={18} className="text-slate-400" /><select className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full md:w-auto transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-600 text-white' : 'bg-slate-50 border-slate-200'}`} value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>{availableCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => exportToCSV(filteredData, 'inventario')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium shadow-sm transition-colors ${isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}><Download size={20} /> <span className="hidden sm:inline">Exportar</span></button>
                {isAdmin && <button onClick={handleOpenCreateModal} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-all transform hover:scale-105"><Plus size={20} /> <span className="hidden sm:inline">Nuevo</span></button>}
              </div>
            </div>
            
            <div className={`px-4 py-2 border-b flex gap-2 overflow-x-auto ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50/50 border-slate-100'}`}>
               <button onClick={() => setStatusFilter('all')} className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-2 transition-colors ${statusFilter === 'all' ? (isDarkMode ? 'bg-slate-200 text-slate-900 border-slate-200' : 'bg-slate-800 text-white border-slate-800') : (isDarkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-white text-slate-600 border-slate-200')}`}><ListFilter size={14}/> Todos ({inventoryData.length})</button>
               <button onClick={() => setStatusFilter('low')} className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-2 transition-colors ${statusFilter === 'low' ? (isDarkMode ? 'bg-amber-900/50 text-amber-400 border-amber-700' : 'bg-amber-100 text-amber-800 border-amber-200 ring-1 ring-amber-300') : (isDarkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-white text-slate-600 border-slate-200')}`}><AlertTriangle size={14} className={statusFilter === 'low' ? 'text-amber-500' : 'text-slate-400'}/> Stock Bajo ({inventoryData.filter(i => i.stock <= 5 && i.stock > 0).length})</button>
               <button onClick={() => setStatusFilter('out')} className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-2 transition-colors ${statusFilter === 'out' ? (isDarkMode ? 'bg-red-900/50 text-red-400 border-red-700' : 'bg-red-100 text-red-800 border-red-200 ring-1 ring-red-300') : (isDarkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-white text-slate-600 border-slate-200')}`}><AlertCircle size={14} className={statusFilter === 'out' ? 'text-red-500' : 'text-slate-400'}/> Agotados ({inventoryData.filter(i => i.stock <= 0).length})</button>
            </div>

            <div className="overflow-auto flex-1">
              <table className={`w-full text-left border-collapse ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                <thead className={`sticky top-0 z-10 ${isDarkMode ? 'bg-slate-900 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                  <tr>
                    <th className="p-4 text-xs font-bold uppercase border-b border-slate-200 dark:border-slate-700">Código</th>
                    <th className="p-4 text-xs font-bold uppercase border-b border-slate-200 dark:border-slate-700">Material</th>
                    <th className="p-4 text-xs font-bold uppercase border-b border-slate-200 dark:border-slate-700 hidden md:table-cell">Categoría</th>
                    {/* COLUMNA UBICACION ELIMINADA */}
                    <th className="p-4 text-xs font-bold uppercase border-b border-slate-200 dark:border-slate-700 text-right">Precio Unit.</th>
                    <th className="p-4 text-xs font-bold uppercase border-b border-slate-200 dark:border-slate-700 text-right text-emerald-600">Costo + IVA</th>
                    <th className="p-4 text-xs font-bold uppercase border-b border-slate-200 dark:border-slate-700 text-right w-32">Stock</th>
                    <th className="p-4 text-xs font-bold uppercase border-b border-slate-200 dark:border-slate-700 text-center">Estado</th>
                    <th className="p-4 text-xs font-bold uppercase border-b border-slate-200 dark:border-slate-700 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-slate-100'}`}>
                  {filteredData.map((item, idx) => (
                    <tr key={idx} className={`group transition-colors ${isDarkMode ? 'hover:bg-slate-700/30' : 'hover:bg-blue-50/30'}`}>
                      <td className="p-4 text-sm font-mono opacity-70">{item.codigo}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-500'}`}>
                             {item.material.charAt(0)}
                          </div>
                          <p className="text-sm font-semibold">{item.material}</p>
                        </div>
                      </td>
                      <td className="p-4 text-sm hidden md:table-cell"><span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: isDarkMode ? stringToDarkColor(item.categoria) : stringToColor(item.categoria), color: isDarkMode ? '#ddd' : '#333' }}>{item.categoria}</span></td>
                      {/* CELDA UBICACION ELIMINADA */}
                      <td className="p-4 text-sm text-right opacity-70">C${(item.costo || 0).toFixed(2)}</td>
                      <td className="p-4 text-sm text-right font-bold text-emerald-600">C${((item.costo||0)*(item.aplicaIVA?1.15:1)).toFixed(2)}</td>
                      <td className="p-4 text-right">
                         <span className={`text-sm font-bold ${item.stock <= 5 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-400'}`}>{item.stock}</span>
                      </td>
                      <td className="p-4 text-center">
                        {item.stock <= 0 ? <Badge type="danger">Agotado</Badge> : item.stock <= 5 ? <Badge type="warning">Bajo</Badge> : <Badge type="success">En Stock</Badge>}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => handleOpenProductHistory(item)} className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-600 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`} title="Ver Historial"><History size={18}/></button>
                           {isAdmin && (
                            <>
                              <button onClick={() => handleOpenStockModal(item)} className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-blue-900/30 text-blue-400' : 'hover:bg-blue-50 text-blue-600'}`}><PlusCircle size={18}/></button>
                              <button onClick={() => handleOpenEditModal(item)} className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-amber-900/30 text-amber-400' : 'hover:bg-amber-50 text-amber-600'}`}><Pencil size={18}/></button>
                              <button onClick={() => handleDeleteProduct(item.codigo)} className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-50 text-red-600'}`}><Trash2 size={18}/></button>
                            </>
                           )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredData.length === 0 && (<tr><td colSpan="8" className="p-10 text-center italic opacity-50">No hay productos que coincidan con el filtro.</td></tr>)}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'requisitions' && <RequisitionsView isAdmin={isAdmin} inventoryData={inventoryData} addToast={addToast} isDarkMode={isDarkMode} />}

        {activeTab === 'quotations' && <QuotationsView isAdmin={isAdmin} inventoryData={inventoryData} addToast={addToast} isDarkMode={isDarkMode} logoUrl={logoUrl} />}

        {activeTab === 'suppliers' && <SuppliersView isAdmin={isAdmin} suppliersData={suppliersData} inventoryData={inventoryData} addToast={addToast} isDarkMode={isDarkMode} />}

        {activeTab === 'history' && (
          <div className={`rounded-xl shadow-sm border flex flex-col h-[calc(100vh-200px)] animate-in fade-in duration-500 overflow-hidden ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-100'}`}>
            <div className={`p-4 border-b flex justify-between items-center ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
              <h3 className={`font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}><History size={20} className="text-emerald-500"/> Historial General</h3>
              <button onClick={() => exportToCSV(historyData, 'historial')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium shadow-sm transition-colors ${isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}><Download size={20} /> Exportar</button>
            </div>
            <div className="overflow-auto flex-1">
              <table className={`w-full text-left border-collapse ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                <thead className={`sticky top-0 z-10 ${isDarkMode ? 'bg-slate-900 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                  <tr><th className="p-4 border-b border-slate-200 dark:border-slate-700">Fecha</th><th className="p-4 border-b border-slate-200 dark:border-slate-700">Material</th><th className="p-4 border-b border-slate-200 dark:border-slate-700 text-center">Tipo</th><th className="p-4 border-b border-slate-200 dark:border-slate-700 text-right">Cant.</th><th className="p-4 border-b border-slate-200 dark:border-slate-700">Destino / Razón</th><th className="p-4 border-b border-slate-200 dark:border-slate-700 text-right">Usuario</th></tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-slate-100'}`}>
                  {historyData.map((log, idx) => (
                    <tr key={idx} className={`transition-colors ${isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'}`}>
                      <td className="p-4 text-xs font-mono opacity-70">{log.fecha}</td>
                      <td className="p-4"><p className="text-sm font-medium">{log.material}</p><p className="text-xs opacity-60">{log.codigo}</p></td>
                      <td className="p-4 text-center"><span className={`px-2 py-1 rounded text-xs font-bold ${log.tipo==='Entrada' ? (isDarkMode ? 'bg-emerald-900/40 text-emerald-400' : 'bg-emerald-100 text-emerald-700') : (isDarkMode ? 'bg-rose-900/40 text-rose-400' : 'bg-rose-100 text-rose-700')}`}>{log.tipo}</span></td>
                      <td className="p-4 text-sm font-bold text-right">{log.cantidad}</td>
                      <td className="p-4 text-sm opacity-80"><div className="flex items-center gap-1"><Building2 size={12} className="opacity-50"/> {log.destino || '-'}</div></td>
                      <td className="p-4 text-xs text-right italic opacity-60">{log.usuario || 'Admin'}</td>
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
            isDarkMode={isDarkMode}
          />
        )}
      </main>

      {/* TOASTS & MODALES */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <AdminLoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLogin={() => setIsAdmin(true)} addToast={addToast} isDarkMode={isDarkMode} />
      <ProfileSetupModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} onSave={handleSaveProfile} isDarkMode={isDarkMode} />
      <ConnectedUsersModal isOpen={isConnectedUsersModalOpen} onClose={() => setIsConnectedUsersModalOpen(false)} users={onlineUsersList} currentUserId={user?.uid} isDarkMode={isDarkMode} />
      <MovementModal isOpen={isStockModalOpen} onClose={() => setIsStockModalOpen(false)} item={selectedItem} onSave={handleUpdateStock} isDarkMode={isDarkMode} />
      {/* Pasar categorías y unidades DINÁMICAS al formulario */}
      <ProductFormModal 
        isOpen={isFormModalOpen} 
        onClose={() => setIsFormModalOpen(false)} 
        onSave={handleSaveProduct} 
        categories={availableCategories.filter(c => c !== 'Todas')} // Pasamos la lista COMBINADA (sin "Todas")
        units={unitsList.map(u => u.name)}
        productToEdit={editingItem} 
        isDarkMode={isDarkMode}
      />
      <ProductHistoryModal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)} product={historyItem} history={historyData} isDarkMode={isDarkMode} />
    </div>
  );
}
