import React from 'react';
import { 
  Settings, 
  Wrench, 
  Clock, 
  HardHat, 
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

const MaintenancePage = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full">
        {/* Card Principal */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-emerald-900/10 border border-slate-100 overflow-hidden text-center p-8 md:p-12 relative">
          
          {/* Decoración de fondo */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-50 rounded-full opacity-50"></div>
          
          {/* Icono Principal Animado */}
          <div className="relative mb-8 flex justify-center">
            <div className="bg-emerald-100 p-6 rounded-2xl text-emerald-600 animate-pulse">
              <HardHat size={48} strokeWidth={1.5} />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-amber-100 p-2 rounded-lg text-amber-600 border-2 border-white">
              <Settings size={20} className="animate-spin-slow" />
            </div>
          </div>

          {/* Texto de Estado */}
          <h1 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">
            MANTENIMIENTO <span className="text-emerald-500">ISC</span>
          </h1>
          
          <p className="text-slate-500 text-lg mb-8 leading-relaxed">
            Estamos actualizando el sistema de inventario para ofrecerte una mejor experiencia. 
            <span className="block font-medium mt-2 text-slate-700">Volveremos pronto.</span>
          </p>

          {/* Info de estado */}
          <div className="flex flex-col gap-3 mb-8">
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 text-left">
              <Clock className="text-blue-500" size={20} />
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tiempo estimado</p>
                <p className="text-sm font-semibold text-slate-700">15 - 30 minutos</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100 text-left">
              <AlertTriangle className="text-amber-600" size={20} />
              <div>
                <p className="text-xs font-bold text-amber-500 uppercase tracking-wider">Estado actual</p>
                <p className="text-sm font-semibold text-amber-700">Actualización de Base de Datos</p>
              </div>
            </div>
          </div>

          {/* Footer del Card */}
          <div className="pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-400 font-medium flex items-center justify-center gap-2 italic">
              Industria San Carlos • Matagalpa
            </p>
          </div>
        </div>

        {/* Mensaje inferior externo */}
        <p className="mt-8 text-center text-slate-400 text-sm">
          Si necesitas asistencia urgente, contacta al administrador.
        </p>
      </div>

      {/* Estilos adicionales para la animación de rotación suave */}
      <style jsx>{`
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default MaintenancePage;
