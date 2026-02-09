import React, { useState } from 'react';
import { 
  User, 
  Wrench,
  Lock,
  Copyright,
  Mail,
  MessageSquare,
  Copy,
  CheckCircle2,
  Cpu
} from 'lucide-react';

/**
 * MaintenancePage - Versión Estilizada y Simplificada
 * Desarrollado por Jeffry Reyes
 */
const App = () => {
  const [copied, setCopied] = useState(false);
  
  // Configuración de contacto
  const phoneNumber = "50586022169";
  const email = "jr3332297@gmail.com";

  /**
   * Método de copiado compatible con iFrames (Fallback de document.execCommand)
   */
  const copyToClipboard = () => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = email;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Error al copiar al portapapeles:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 font-sans text-slate-200 overflow-hidden relative">
      
      {/* Efectos de fondo animados sutiles */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-xl w-full z-10 flex flex-col gap-8">
        {/* Card Principal */}
        <div className="bg-slate-800/40 rounded-[2.5rem] shadow-2xl border border-slate-700/50 backdrop-blur-2xl overflow-hidden p-8 md:p-12 relative text-center">
          
          {/* Badge de Estado del Sistema */}
          <div className="absolute top-6 right-8 flex items-center gap-2 bg-slate-900/60 px-3 py-1.5 rounded-full border border-slate-700 border-opacity-50">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-mono">Core Online</span>
          </div>

          {/* Icono de Mantenimiento */}
          <div className="relative mb-8 flex justify-center">
            <div className="bg-blue-500/10 p-6 rounded-3xl text-blue-400 ring-1 ring-blue-500/30 shadow-lg shadow-blue-500/5">
              <Wrench size={52} strokeWidth={1.5} className="animate-[spin_4s_linear_infinite]" />
            </div>
          </div>

          {/* Título y Descripción */}
          <h1 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tighter uppercase italic">
            Mantenimiento <span className="text-blue-500 font-normal">Técnico</span>
          </h1>
          
          <p className="text-slate-400 text-lg mb-8 leading-relaxed max-w-sm mx-auto">
            El acceso a la interfaz de usuario se encuentra <span className="text-blue-400 font-bold underline underline-offset-4 tracking-wide">suspendido</span> mientras se completan las actualizaciones.
          </p>

          {/* Bloque Central de Autoría (Simplificado) */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-col gap-6 p-7 bg-slate-900/60 rounded-[2rem] border border-slate-700/50 text-left relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                <Cpu size={120} />
              </div>

              {/* Header: Autor */}
              <div className="flex items-center gap-4 relative">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-500/20">
                  <User size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.25em] mb-0.5 font-mono">Autor y Desarrollador</p>
                  <p className="text-2xl font-bold text-white tracking-tight">Jeffry Reyes</p>
                </div>
              </div>

              {/* Botones de Contacto */}
              <div className="pt-5 border-t border-slate-800 flex flex-col gap-3">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Canales de Atención</p>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => window.open(`https://wa.me/${phoneNumber}`, '_blank')}
                    className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all px-4 py-3 rounded-xl text-xs font-black border border-emerald-500/20 text-emerald-400 uppercase tracking-wider"
                  >
                    <MessageSquare size={16} />
                    WhatsApp
                  </button>
                  <button 
                    onClick={copyToClipboard}
                    className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 transition-all px-4 py-3 rounded-xl text-xs font-black border border-slate-700 text-slate-300 uppercase tracking-wider"
                  >
                    {copied ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
                    {copied ? 'Copiado' : 'Copiar Correo'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Card */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-slate-500">
              <Copyright size={14} />
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase">
                Jeffry Reyes • 2026 • Nicaragua
              </p>
            </div>
            <div className="bg-slate-900/40 px-3 py-1 rounded-md border border-slate-800">
              <p className="text-[9px] font-mono text-slate-700 uppercase tracking-tighter">Build ID: 77-2442-REV</p>
            </div>
          </div>
        </div>

        {/* Aviso Legal Minimalista (Sutil y al final) */}
        <div className="flex flex-col items-center gap-1 opacity-30 hover:opacity-60 transition-opacity pb-8">
          <div className="flex items-center gap-2 text-slate-500">
            <Lock size={10} />
            <p className="text-[8px] font-medium uppercase tracking-[0.4em]">
              Aviso de Privacidad y Derechos
            </p>
          </div>
          <p className="text-center text-slate-600 text-[8px] font-medium uppercase tracking-[0.2em] max-w-xs leading-relaxed">
            Queda prohibida la reproducción total o parcial de este entorno digital sin autorización expresa del propietario legal de la obra.
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
