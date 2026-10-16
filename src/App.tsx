import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Scale,
  Wheat,
  DollarSign,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
  Layers,
  BarChart3,
  RefreshCw,
  Plus,
  Trash2,
  Download,
  BookOpen,
  PieChart as PieIcon,
  ChevronRight,
  Beef,
  Egg,
  Fish,
  Share2,
  Printer,
  ShieldCheck,
  Percent,
  Sliders,
  Sparkle
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

// Insumos típicos disponibles en fincas y agroservicios de Nicaragua
const NICARAGUAN_INGREDIENTS = [
  // Energéticos
  { id: 'ing-1', name: 'Maíz Amarillo Molido', category: 'Energético', pc: 8.5, costPerKgNIO: 16.50, description: 'Excelente fuente de energía digestible para aves, cerdos y rumiantes.' },
  { id: 'ing-2', name: 'Sorgo Granífero (Millón)', category: 'Energético', pc: 9.0, costPerKgNIO: 14.00, description: 'Grano resistente a la sequía muy cultivado en el pacífico y centro.' },
  { id: 'ing-3', name: 'Semolina de Arroz / Pulidura', category: 'Energético', pc: 12.0, costPerKgNIO: 13.50, description: 'Rico en aceites y energía, subproducto de molinos arroceros.' },
  { id: 'ing-4', name: 'Melaza de Caña de Azúcar', category: 'Energético', pc: 3.5, costPerKgNIO: 8.00, description: 'Melaza de ingenio nicaragüense, aporta palatabilidad y energía rápida.' },
  { id: 'ing-5', name: 'Pulpa de Café Ensilada / Seca', category: 'Energético', pc: 10.2, costPerKgNIO: 5.50, description: 'Subproducto abundante en Jinotega y Matagalpa, excelente para rumiantes.' },
  { id: 'ing-6', name: 'Yuca Seca en Harina (Raíz)', category: 'Energético', pc: 2.8, costPerKgNIO: 9.00, description: 'Alta concentración de almidones digestibles para cerdos y ganado.' },

  // Proteicos
  { id: 'ing-7', name: 'Harina de Soya (48% PC)', category: 'Proteico', pc: 47.5, costPerKgNIO: 32.00, description: 'Proteína estándar de altísimo valor biológico y perfil de aminoácidos.' },
  { id: 'ing-8', name: 'Harina de Maní (Torta de Extracción)', category: 'Proteico', pc: 45.0, costPerKgNIO: 26.50, description: 'Subproducto común en León y Chinandega, muy apetecido por el ganado.' },
  { id: 'ing-9', name: 'Pollinaza Seca y Sanitizada', category: 'Proteico', pc: 24.0, costPerKgNIO: 6.00, description: 'Rica en nitrógeno no proteico (NNP) y minerales para bovinos.' },
  { id: 'ing-10', name: 'Harina de Hojas de Marango (Moringa)', category: 'Proteico', pc: 27.0, costPerKgNIO: 18.00, description: 'Superalimento forrajero nativo de alto contenido proteico y vitaminas.' },
  { id: 'ing-11', name: 'Harina de Pescado Artesanal', category: 'Proteico', pc: 58.0, costPerKgNIO: 38.00, description: 'Harina de origen marítimo nicaragüense para cerdos en destete y tilapias.' },
  { id: 'ing-12', name: 'Harina de Ajonjolí (Torta)', category: 'Proteico', pc: 41.0, costPerKgNIO: 22.00, description: 'Proteína vegetal de gran densidad energética de las llanuras de occidente.' }
];

// Requerimientos nutricionales estándar según especie y etapa productiva
const ANIMAL_REQUIREMENTS = [
  { id: 'req-1', animal: 'Ganado Bovino', stage: 'Vaca Lechera (15-20 Litros/día)', targetPC: 16.0, icon: Beef, note: 'Requiere balance entre fibra efectiva y proteína digestible en rumen.' },
  { id: 'req-2', animal: 'Ganado Bovino', stage: 'Terneros al Destete / Crecimiento', targetPC: 18.0, icon: Beef, note: 'Desarrollo muscular y esquelético temprano.' },
  { id: 'req-3', animal: 'Ganado Bovino', stage: 'Engorde en Corral (Finalización)', targetPC: 13.5, icon: Beef, note: 'Alta densidad energética y proteína moderada para deposición grasa.' },
  { id: 'req-4', animal: 'Cerdos (Porcinos)', stage: 'Lechones Iniciadores (10 - 25 kg)', targetPC: 20.0, icon: Beef, note: 'Proteína de máxima digestibilidad y fuentes lácteas o soya.' },
  { id: 'req-5', animal: 'Cerdos (Porcinos)', stage: 'Crecimiento y Engorde (50 - 100 kg)', targetPC: 15.0, icon: Beef, note: 'Maximizar ganancia diaria de peso sin exceso de grasa dorsal.' },
  { id: 'req-6', animal: 'Aves de Corral', stage: 'Pollos de Engorde (Inicio 0-21 días)', targetPC: 22.0, icon: Egg, note: 'Vital para desarrollo de órganos y plumaje temprano.' },
  { id: 'req-7', animal: 'Aves de Corral', stage: 'Gallinas Ponedoras (Fase de Postura)', targetPC: 17.0, icon: Egg, note: 'Debe complementarse con calcio y fósforo para calidad de cáscara.' },
  { id: 'req-8', animal: 'Peces (Piscicultura)', stage: 'Tilapia en Engorde', targetPC: 28.0, icon: Fish, note: 'Exige harina de pescado y soya para conversión alimenticia eficiente.' }
];

const AgroNicaLogo = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 drop-shadow-sm">
    <rect width="100" height="100" rx="24" fill="#047857" stroke="#065F46" strokeWidth="2" />
    {/* Cuadrado central en degradado verde esmeralda */}
    <rect x="22" y="22" width="56" height="56" rx="14" fill="url(#gradPearson)" stroke="#34D399" strokeWidth="2.5" />
    {/* Líneas cruzadas en X del Cuadrado de Pearson */}
    <line x1="28" y1="28" x2="72" y2="72" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeDasharray="3 3" />
    <line x1="72" y1="28" x2="28" y2="72" stroke="#A7F3D0" strokeWidth="3" strokeLinecap="round" strokeDasharray="3 3" />
    {/* Círculo central con el valor objetivo */}
    <circle cx="50" cy="50" r="14" fill="#FFFFFF" stroke="#059669" strokeWidth="2" />
    <text x="50" y="55" fill="#047857" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="monospace">%</text>
    <defs>
      <linearGradient id="gradPearson" x1="22" y1="22" x2="78" y2="78" gradientUnits="userSpaceOnUse">
        <stop stopColor="#059669" />
        <stop offset="1" stopColor="#047857" />
      </linearGradient>
    </defs>
  </svg>
);

export default function PearsonSquareApp() {
  // Estado de cálculo
  const [targetNutrientName, setTargetNutrientName] = useState('Proteína Cruda (PC)');
  const [targetPercentage, setTargetPercentage] = useState(16.0);
  const [batchWeightKg, setBatchWeightKg] = useState(100); // Tamaño del bulto o mezcla en kg o quintales
  const [weightUnit, setWeightUnit] = useState('Kg'); // 'Kg' o 'Quintales (qq - 100 lb / 46kg)'

  // Ingrediente A (usualmente energético o de menor porcentaje)
  const [ingA, setIngA] = useState(NICARAGUAN_INGREDIENTS[0]); // Maíz
  const [customPctA, setCustomPctA] = useState(8.5);
  const [customCostA, setCustomCostA] = useState(16.50);

  // Ingrediente B (usualmente proteico o de mayor porcentaje)
  const [ingB, setIngB] = useState(NICARAGUAN_INGREDIENTS[6]); // Harina de Soya
  const [customPctB, setCustomPctB] = useState(47.5);
  const [customCostB, setCustomCostB] = useState(32.00);

  // Pestañas principales
  const [activeTab, setActiveTab] = useState('calculator'); // 'calculator', 'library', 'guides', 'costAnalysis'
  const [showFormulaDetails, setShowFormulaDetails] = useState(true);

  // Notificación tipo toast
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSelectAnimalPreset = (preset) => {
    setTargetPercentage(preset.targetPC);
    showToast(`Meta fijada: ${preset.targetPC}% PC para ${preset.stage}`);
  };

  const handleSelectIngredientA = (item) => {
    setIngA(item);
    setCustomPctA(item.pc);
    setCustomCostA(item.costPerKgNIO);
  };

  const handleSelectIngredientB = (item) => {
    setIngB(item);
    setCustomPctB(item.pc);
    setCustomCostB(item.costPerKgNIO);
  };

  const calculationResult = useMemo(() => {
    const pTarget = Number(targetPercentage);
    const pA = Number(customPctA);
    const pB = Number(customPctB);
    const totalWeight = Number(batchWeightKg);

    // Validación elemental del cuadrado de Pearson:
    // El porcentaje deseado DEBE estar estrictamente comprendido entre el valor de ambos ingredientes
    const minVal = Math.min(pA, pB);
    const maxVal = Math.max(pA, pB);

    if (pTarget <= minVal || pTarget >= maxVal) {
      return {
        isValid: false,
        error: `El objetivo (${pTarget}%) debe encontrarse estrictamente entre el ingrediente con menor porcentaje (${minVal}%) y el de mayor porcentaje (${maxVal}%). Cambie uno de los insumos o ajuste la meta.`
      };
    }

    // Cálculo del cuadrado de Pearson:
    // Partes de A = | Porcentaje de B - Objetivo |
    // Partes de B = | Porcentaje de A - Objetivo |
    const partsA = Math.abs(pB - pTarget);
    const partsB = Math.abs(pA - pTarget);
    const totalParts = partsA + partsB;

    // Porcentaje en la mezcla
    const pctAInMix = (partsA / totalParts) * 100;
    const pctBInMix = (partsB / totalParts) * 100;

    // Kilos o Libras requeridas
    const weightA = (pctAInMix / 100) * totalWeight;
    const weightB = (pctBInMix / 100) * totalWeight;

    // Costo total estimado en Córdobas (C$)
    const costA = weightA * Number(customCostA);
    const costB = weightB * Number(customCostB);
    const totalBatchCost = costA + costB;
    const costPerKg = totalWeight > 0 ? totalBatchCost / totalWeight : 0;
    const costPerQuintal = costPerKg * 46; // 1 quintal = 46 kg aprox / 100 lbs

    return {
      isValid: true,
      partsA,
      partsB,
      totalParts,
      pctAInMix,
      pctBInMix,
      weightA,
      weightB,
      costA,
      costB,
      totalBatchCost,
      costPerKg,
      costPerQuintal,
      actualPCResult: ((pctAInMix * pA) + (pctBInMix * pB)) / 100
    };
  }, [targetPercentage, customPctA, customPctB, batchWeightKg, customCostA, customCostB]);

  const pieData = calculationResult.isValid ? [
    { name: ingA.name, value: Number(calculationResult.pctAInMix.toFixed(1)), color: '#10B981' },
    { name: ingB.name, value: Number(calculationResult.pctBInMix.toFixed(1)), color: '#047857' }
  ] : [];

  const barData = calculationResult.isValid ? [
    {
      name: ingA.name,
      Kilos: Number(calculationResult.weightA.toFixed(1)),
      CostoNIO: Number(calculationResult.costA.toFixed(2))
    },
    {
      name: ingB.name,
      Kilos: Number(calculationResult.weightB.toFixed(1)),
      CostoNIO: Number(calculationResult.costB.toFixed(2))
    }
  ] : [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col selection:bg-emerald-600 selection:text-white">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-white border border-emerald-500 text-emerald-950 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Sparkle size={18} className="text-emerald-600" />
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}

      {/* HEADER PRINCIPAL */}
      <header className="border-b border-emerald-100 bg-white/95 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <AgroNicaLogo size={40} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                AgroNica <span className="text-emerald-600">Pearson</span>
              </h1>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                Herramienta del Productor
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Balanceador de Raciones y Alimentos Concentrados con el Cuadrado de Pearson
            </p>
          </div>
        </div>

        {/* Botones de navegación en barra superior */}
        <nav className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'calculator'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calculator size={14} />
            <span className="hidden sm:inline">Calculadora</span>
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'library'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wheat size={14} />
            <span className="hidden sm:inline">Insumos Nicas</span>
          </button>

          <button
            onClick={() => setActiveTab('guides')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'guides'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen size={14} />
            <span className="hidden sm:inline">Guía Práctica</span>
          </button>
        </nav>
      </header>

      {/* CONTENEDOR PRINCIPAL */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* BANNER EDUCATIVO / ACCESIBILIDAD AL PRODUCTOR */}
        <section className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 border border-emerald-600/40 p-5 sm:p-6 rounded-3xl shadow-lg text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-md inline-block font-mono">
              ¿Cómo funciona el Cuadrado de Pearson?
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Formula raciones caseras de alta calidad al menor costo en tu finca
            </h2>
            <p className="text-xs sm:text-sm text-emerald-50 leading-relaxed">
              El Cuadrado de Pearson te permite mezclar dos insumos (uno bajo en proteína como maíz o pulpa de café y otro alto como soya o harina de maní) para obtener con exactitud el porcentaje nutricional que tus animales necesitan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                handleSelectAnimalPreset(ANIMAL_REQUIREMENTS[0]);
                handleSelectIngredientA(NICARAGUAN_INGREDIENTS[0]); // Maíz
                handleSelectIngredientB(NICARAGUAN_INGREDIENTS[6]); // Soya
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/15 hover:bg-white/25 border border-white/30 text-white transition-all flex items-center gap-1.5 backdrop-blur-xs"
            >
              <RefreshCw size={13} /> Ejemplo: Vaca Lechera 16%
            </button>
            <button
              onClick={() => {
                handleSelectAnimalPreset(ANIMAL_REQUIREMENTS[5]); // Pollo engorde 22%
                handleSelectIngredientA(NICARAGUAN_INGREDIENTS[1]); // Sorgo
                handleSelectIngredientB(NICARAGUAN_INGREDIENTS[6]); // Soya
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-emerald-900 hover:bg-emerald-50 shadow-sm transition-all flex items-center gap-1.5"
            >
              <RefreshCw size={13} /> Ejemplo: Pollos 22%
            </button>
          </div>
        </section>

        {/* PESTAÑA 1: CALCULADORA PRINCIPAL */}
        {activeTab === 'calculator' && (
          <div className="space-y-6">
            {/* 1. SELECCIÓN DE META POR ESPECIE (ACCESIBLE PARA PRODUCTORES) */}
            <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-3xl space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Sliders size={16} className="text-emerald-600" /> Paso 1: Elige tu tipo de animal o define tu meta (%)
                </h3>
                <span className="text-xs font-mono text-emerald-800 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Meta actual: {targetPercentage}% {targetNutrientName}
                </span>
              </div>

              {/* Botones rápidos de animales comunes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                {ANIMAL_REQUIREMENTS.map((req) => {
                  const isSelected = targetPercentage === req.targetPC;
                  const Icon = req.icon;
                  return (
                    <button
                      key={req.id}
                      onClick={() => handleSelectAnimalPreset(req)}
                      className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-emerald-600 border-emerald-700 text-white shadow-md shadow-emerald-600/25'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Icon size={16} className={isSelected ? 'text-white' : 'text-slate-400'} />
                        <span className="text-xs font-black font-mono">{req.targetPC}%</span>
                      </div>
                      <p className="text-[11px] font-bold leading-tight truncate">{req.animal}</p>
                      <p className={`text-[9px] truncate ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>{req.stage}</p>
                    </button>
                  );
                })}
              </div>

              {/* Ajuste manual si el productor tiene otro requerimiento */}
              <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Nutriente a Balancear
                  </label>
                  <input
                    type="text"
                    value={targetNutrientName}
                    onChange={(e) => setTargetNutrientName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Porcentaje Meta Deseado (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="60"
                      value={targetPercentage}
                      onChange={(e) => setTargetPercentage(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono font-bold text-emerald-700 focus:outline-none focus:border-emerald-500 focus:bg-white"
                    />
                    <Percent size={14} className="absolute right-3 top-2.5 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Cantidad Total a Preparar
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      value={batchWeightKg}
                      onChange={(e) => setBatchWeightKg(Number(e.target.value))}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono font-bold text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white"
                    />
                    <select
                      value={weightUnit}
                      onChange={(e) => setWeightUnit(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-emerald-800 focus:outline-none focus:bg-white"
                    >
                      <option value="Kg">Kilogramos (Kg)</option>
                      <option value="qq">Quintales (qq - 100 lb)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. SELECCIÓN DE LOS 2 INGREDIENTES */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* INSUMO A */}
              <div className="bg-white border border-slate-200 hover:border-emerald-300 p-5 rounded-3xl space-y-3 relative overflow-hidden shadow-xs transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-500 text-emerald-700 flex items-center justify-center font-black text-xs">
                      A
                    </span>
                    <h3 className="font-extrabold text-sm text-slate-900">Ingrediente Base 1 (Bajo en PC)</h3>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {ingA.category}
                  </span>
                </div>

                {/* Selector rápido de catálogo nica */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                    Seleccionar de insumos típicos:
                  </label>
                  <select
                    value={ingA.id}
                    onChange={(e) => {
                      const found = NICARAGUAN_INGREDIENTS.find(i => i.id === e.target.value);
                      if (found) handleSelectIngredientA(found);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  >
                    {NICARAGUAN_INGREDIENTS.map(i => (
                      <option key={`a-${i.id}`} value={i.id}>
                        {i.name} — {i.pc}% PC (C${i.costPerKgNIO}/kg)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                      % Nutriente (PC)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={customPctA}
                      onChange={(e) => setCustomPctA(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-emerald-700 focus:outline-none focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                      Costo por Kg (C$ Córdobas)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={customCostA}
                      onChange={(e) => setCustomCostA(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-700 focus:outline-none focus:bg-white"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  💡 {ingA.description}
                </p>
              </div>

              {/* INSUMO B */}
              <div className="bg-white border border-slate-200 hover:border-emerald-400 p-5 rounded-3xl space-y-3 relative overflow-hidden shadow-xs transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 border border-emerald-600 text-emerald-800 flex items-center justify-center font-black text-xs">
                      B
                    </span>
                    <h3 className="font-extrabold text-sm text-slate-900">Ingrediente Concentrado 2 (Alto en PC)</h3>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {ingB.category}
                  </span>
                </div>

                {/* Selector rápido de catálogo nica */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                    Seleccionar de insumos típicos:
                  </label>
                  <select
                    value={ingB.id}
                    onChange={(e) => {
                      const found = NICARAGUAN_INGREDIENTS.find(i => i.id === e.target.value);
                      if (found) handleSelectIngredientB(found);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  >
                    {NICARAGUAN_INGREDIENTS.map(i => (
                      <option key={`b-${i.id}`} value={i.id}>
                        {i.name} — {i.pc}% PC (C${i.costPerKgNIO}/kg)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                      % Nutriente (PC)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={customPctB}
                      onChange={(e) => setCustomPctB(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-emerald-800 focus:outline-none focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                      Costo por Kg (C$ Córdobas)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={customCostB}
                      onChange={(e) => setCustomCostB(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-700 focus:outline-none focus:bg-white"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  💡 {ingB.description}
                </p>
              </div>
            </div>

            {/* 3. VISUALIZACIÓN DINÁMICA DEL CUADRADO DE PEARSON (DIAGRAMA INTERACTIVO) */}
            <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <Scale size={18} className="text-emerald-600" /> Esquema Visual del Cuadrado de Pearson
                  </h3>
                  <p className="text-xs text-slate-500">Resta diagonal cruzada con valor absoluto</p>
                </div>

                <button
                  onClick={() => setShowFormulaDetails(!showFormulaDetails)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-auto"
                >
                  <Info size={14} /> {showFormulaDetails ? 'Ocultar explicación matemática' : 'Ver explicación matemática'}
                </button>
              </div>

              {!calculationResult.isValid ? (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-3">
                  <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-black text-sm text-amber-950">Combinación No Válida para el Cuadrado</p>
                    <p>{calculationResult.error}</p>
                    <p className="text-[11px] text-amber-800">
                      Ejemplo: Si tu meta es 16%, necesitas un insumo menor a 16% (como maíz 8.5%) y otro insumo mayor a 16% (como soya 47.5%).
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* DIAGRAMA DEL CUADRADO EN FORMATO RESPONSIVO */}
                  <div className="relative bg-slate-50/80 p-6 rounded-2xl border border-slate-200 max-w-2xl mx-auto shadow-inner">
                    <div className="grid grid-cols-3 gap-4 items-center text-center">
                      {/* Vértice Superior Izquierdo: Insumo A */}
                      <div className="p-3.5 rounded-xl bg-white border border-emerald-200 text-left shadow-xs">
                        <span className="text-[10px] uppercase font-bold text-emerald-700">Insumo A</span>
                        <p className="font-extrabold text-xs text-slate-800 truncate">{ingA.name}</p>
                        <p className="text-base font-black font-mono text-emerald-600 mt-1">{customPctA}%</p>
                      </div>

                      {/* Espacio Vértice Central */}
                      <div className="text-emerald-800/70 text-xs font-bold">Resta Cruzada ↘</div>

                      {/* Vértice Superior Derecho: Partes de A */}
                      <div className="p-3.5 rounded-xl bg-white border border-emerald-200 text-right shadow-xs">
                        <span className="text-[10px] uppercase font-bold text-emerald-700">Partes de A</span>
                        <p className="text-xs text-slate-400 font-mono">| {customPctB}% - {targetPercentage}% |</p>
                        <p className="text-base font-black font-mono text-emerald-700 mt-1">
                          {calculationResult.partsA.toFixed(1)} partes
                        </p>
                      </div>

                      {/* Fila Central con el Porcentaje Meta en el Centro del Cuadrado */}
                      <div className="text-emerald-800/70 text-xs font-bold">Resta Cruzada ↗</div>

                      <div className="p-4 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 border border-emerald-500">
                        <span className="text-[10px] font-black uppercase tracking-wider block text-emerald-100">
                          META EN EL CENTRO
                        </span>
                        <p className="text-2xl font-black font-mono">{targetPercentage}%</p>
                        <span className="text-[10px] font-bold text-emerald-100">{targetNutrientName}</span>
                      </div>

                      <div className="text-emerald-800/70 text-xs font-bold">Suma de Partes ➔</div>

                      {/* Vértice Inferior Izquierdo: Insumo B */}
                      <div className="p-3.5 rounded-xl bg-white border border-emerald-300 text-left shadow-xs">
                        <span className="text-[10px] uppercase font-bold text-emerald-800">Insumo B</span>
                        <p className="font-extrabold text-xs text-slate-800 truncate">{ingB.name}</p>
                        <p className="text-base font-black font-mono text-emerald-800 mt-1">{customPctB}%</p>
                      </div>

                      {/* Espacio Vértice Central Inferior */}
                      <div className="text-emerald-800/70 text-xs font-bold">Diagonal ↗</div>

                      {/* Vértice Inferior Derecho: Partes de B */}
                      <div className="p-3.5 rounded-xl bg-white border border-emerald-300 text-right shadow-xs">
                        <span className="text-[10px] uppercase font-bold text-emerald-800">Partes de B</span>
                        <p className="text-xs text-slate-400 font-mono">| {customPctA}% - {targetPercentage}% |</p>
                        <p className="text-base font-black font-mono text-emerald-800 mt-1">
                          {calculationResult.partsB.toFixed(1)} partes
                        </p>
                      </div>
                    </div>

                    {/* Resumen de partes totales */}
                    <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium">Total de partes calculadas:</span>
                      <span className="font-black font-mono text-emerald-700 text-sm">
                        {calculationResult.partsA.toFixed(1)} + {calculationResult.partsB.toFixed(1)} = {calculationResult.totalParts.toFixed(1)} partes
                      </span>
                    </div>
                  </div>

                  {/* FÓRMULA EXPLICADA PASO A PASO */}
                  {showFormulaDetails && (
                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-2">
                      <p className="font-bold text-emerald-900 flex items-center gap-1.5">
                        <Sparkles size={14} className="text-emerald-600" /> Procedimiento Matemático Detallado:
                      </p>
                      <ul className="list-disc pl-5 space-y-1 text-slate-700">
                        <li>
                          <strong>Paso 1:</strong> Restamos el porcentaje de la meta ({targetPercentage}%) al insumo B ({customPctB}%): |{customPctB} - {targetPercentage}| = <strong>{calculationResult.partsA.toFixed(1)} partes de {ingA.name}</strong>.
                        </li>
                        <li>
                          <strong>Paso 2:</strong> Restamos el porcentaje de la meta ({targetPercentage}%) al insumo A ({customPctA}%): |{customPctA} - {targetPercentage}| = <strong>{calculationResult.partsB.toFixed(1)} partes de {ingB.name}</strong>.
                        </li>
                        <li>
                          <strong>Paso 3:</strong> Sumamos las partes: {calculationResult.partsA.toFixed(1)} + {calculationResult.partsB.toFixed(1)} = <strong>{calculationResult.totalParts.toFixed(1)} partes totales</strong>.
                        </li>
                        <li>
                          <strong>Paso 4:</strong> Calculamos el % de inclusión: ({calculationResult.partsA.toFixed(1)} / {calculationResult.totalParts.toFixed(1)}) × 100 = <strong>{calculationResult.pctAInMix.toFixed(1)}% de {ingA.name}</strong>.
                        </li>
                      </ul>
                    </div>
                  )}

                  {/* 4. RECETA FINAL PARA EL PRODUCTOR (LISTA PARA PESAR EN FINCA) */}
                  <div className="bg-white border border-emerald-200 p-5 rounded-3xl space-y-4 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          Receta Final de Mezcla
                        </span>
                        <h4 className="text-lg font-black text-slate-900 mt-1">
                          Preparación de {batchWeightKg} {weightUnit} de Alimento al {targetPercentage}% {targetNutrientName}
                        </h4>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-xs text-slate-500 block">Costo Total Estimado:</span>
                        <span className="text-xl font-black font-mono text-emerald-700">
                          C$ {calculationResult.totalBatchCost.toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Tarjeta de Insumo A para mezclar */}
                      <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-800 uppercase">1. Insumo Base</span>
                          <span className="text-sm font-black text-emerald-700 font-mono">
                            {calculationResult.pctAInMix.toFixed(1)}% de la mezcla
                          </span>
                        </div>
                        <h5 className="font-black text-base text-slate-900">{ingA.name}</h5>
                        <div className="flex items-baseline justify-between pt-2 border-t border-emerald-100">
                          <span className="text-xs text-slate-600">Pesar con báscula:</span>
                          <span className="text-2xl font-black font-mono text-slate-900">
                            {calculationResult.weightA.toFixed(1)} <span className="text-xs font-bold text-emerald-700">{weightUnit}</span>
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 flex justify-between">
                          <span>Costo parcial:</span>
                          <span className="font-mono font-bold text-slate-800">C$ {calculationResult.costA.toFixed(2)}</span>
                        </p>
                      </div>

                      {/* Tarjeta de Insumo B para mezclar */}
                      <div className="p-4 rounded-2xl bg-teal-50/40 border border-teal-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-teal-800 uppercase">2. Concentrado</span>
                          <span className="text-sm font-black text-teal-700 font-mono">
                            {calculationResult.pctBInMix.toFixed(1)}% de la mezcla
                          </span>
                        </div>
                        <h5 className="font-black text-base text-slate-900">{ingB.name}</h5>
                        <div className="flex items-baseline justify-between pt-2 border-t border-teal-100">
                          <span className="text-xs text-slate-600">Pesar con báscula:</span>
                          <span className="text-2xl font-black font-mono text-slate-900">
                            {calculationResult.weightB.toFixed(1)} <span className="text-xs font-bold text-teal-700">{weightUnit}</span>
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 flex justify-between">
                          <span>Costo parcial:</span>
                          <span className="font-mono font-bold text-slate-800">C$ {calculationResult.costB.toFixed(2)}</span>
                        </p>
                      </div>
                    </div>

                    {/* Resumen Económico por Quintal y Kilogramo */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Costo por Kg</span>
                        <p className="text-base font-black font-mono text-slate-900 mt-0.5">
                          C$ {calculationResult.costPerKg.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Costo por Quintal (46 kg)</span>
                        <p className="text-base font-black font-mono text-emerald-700 mt-0.5">
                          C$ {calculationResult.costPerQuintal.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Proteína Verificada</span>
                        <p className="text-base font-black font-mono text-emerald-600 mt-0.5">
                          {calculationResult.actualPCResult.toFixed(2)}%
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Ahorro Estimado</span>
                        <p className="text-base font-black font-mono text-teal-700 mt-0.5">
                          ~ 25% a 35% vs Saco Comercial
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* GRÁFICOS DE PROPORCIÓN Y COSTOS */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                      <h4 className="text-xs font-bold uppercase text-slate-600 mb-3 flex items-center gap-2">
                        <PieIcon size={14} className="text-emerald-600" /> Proporción de Inclusión (%)
                      </h4>
                      <div className="h-56 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={45}
                              outerRadius={75}
                              dataKey="value"
                              label={({ name, value }) => `${value}%`}
                            >
                              {pieData.map((entry, index) => (
                                <Cell key={`pie-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#10B981', borderRadius: '12px', color: '#0f172a' }} />
                            <Legend verticalAlign="bottom" height={36} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                      <h4 className="text-xs font-bold uppercase text-slate-600 mb-3 flex items-center gap-2">
                        <BarChart3 size={14} className="text-teal-700" /> Kilos y Costo en Córdobas (C$)
                      </h4>
                      <div className="h-56 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={barData}>
                            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                            <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#059669', borderRadius: '12px', color: '#0f172a' }} />
                            <Legend verticalAlign="bottom" height={36} />
                            <Bar dataKey="Kilos" name="Peso Requerido" fill="#10B981" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="CostoNIO" name="Costo C$" fill="#047857" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PESTAÑA 2: CATÁLOGO DE INSUMOS NICARAGÜENSES */}
        {activeTab === 'library' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div>
                <h3 className="text-lg font-black text-slate-900">Catálogo de Insumos Agropecuarios de Nicaragua</h3>
                <p className="text-xs text-slate-500">
                  Valores típicos de Proteína Cruda (PC) y costos referenciales en mercados locales y agroservicios
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 self-start sm:self-auto">
                12 Insumos Disponibles
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {NICARAGUAN_INGREDIENTS.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 p-5 rounded-3xl flex flex-col justify-between hover:border-emerald-500 hover:shadow-md transition-all group shadow-xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                        {item.name}
                      </h4>
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                          item.category === 'Proteico'
                            ? 'bg-teal-50 text-teal-800 border-teal-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {item.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Proteína (PC)</span>
                        <span className="text-base font-black font-mono text-emerald-700">{item.pc}%</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Costo Aprox.</span>
                        <span className="text-sm font-black font-mono text-slate-800">C$ {item.costPerKgNIO.toFixed(2)} / kg</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
                    <button
                      onClick={() => {
                        handleSelectIngredientA(item);
                        setActiveTab('calculator');
                        showToast(`${item.name} seleccionado como Insumo A`);
                      }}
                      className="flex-1 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors"
                    >
                      Usar como Insumo A
                    </button>
                    <button
                      onClick={() => {
                        handleSelectIngredientB(item);
                        setActiveTab('calculator');
                        showToast(`${item.name} seleccionado como Insumo B`);
                      }}
                      className="flex-1 py-1.5 rounded-xl text-xs font-bold bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 transition-colors"
                    >
                      Usar como Insumo B
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PESTAÑA 3: GUÍA PRÁCTICA DEL PRODUCTOR */}
        {activeTab === 'guides' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-xs">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <BookOpen size={20} className="text-emerald-600" /> Manual Práctico de Formulación en Finca
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                El Cuadrado de Pearson es un método matemático clásico y confiable utilizado por agrónomos y zootecnistas cuando se requiere mezclar dos alimentos con concentraciones conocidas de un nutriente para obtener una concentración específica final.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs">
                    1
                  </span>
                  <h4 className="font-extrabold text-sm text-slate-900">Regla de Oro de Concentraciones</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Un ingrediente debe ser estrictamente <strong>más bajo</strong> que la meta deseada y el otro debe ser <strong>más alto</strong>. Si intentas obtener 16% mezclando maíz (8.5%) y sorgo (9%), la matemática es imposible porque ninguno aporta la proteína faltante.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-black text-xs">
                    2
                  </span>
                  <h4 className="font-extrabold text-sm text-slate-900">El Procedimiento en Diagonal</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Las restas siempre se hacen en diagonal cruzada sin tomar en cuenta el signo positivo o negativo (valor absoluto). El resultado que queda en la fila superior corresponde a las partes del insumo superior.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs">
                    3
                  </span>
                  <h4 className="font-extrabold text-sm text-slate-900">Pesaje y Mezclado Físico</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Al mezclar en el patio o galera de la finca, agrega primero el insumo de mayor volumen (el cereal base) formando un cono y luego esparce uniformemente el concentrado proteico para asegurar una distribución homogénea.
                  </p>
                </div>
              </div>

              {/* TABLA DE RECOMENDACIONES POR ESPECIE */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <h4 className="font-extrabold text-sm text-slate-900 mb-3">
                  Tabla Rápida de Requerimientos de Proteína Cruda (PC) en Nicaragua
                </h4>
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 text-slate-600 font-bold uppercase border-b border-slate-200">
                      <tr>
                        <th className="p-3">Especie Animal</th>
                        <th className="p-3">Etapa o Propósito</th>
                        <th className="p-3 text-center">% PC Recomendada</th>
                        <th className="p-3">Insumos Locales Sugeridos</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      <tr>
                        <td className="p-3 font-bold text-slate-900">Vaca Lechera</td>
                        <td className="p-3">Producción de leche (15+ Lts)</td>
                        <td className="p-3 text-center font-black text-emerald-700 font-mono">16.0% - 18.0%</td>
                        <td className="p-3">Semolina de arroz, pulpa de café + Harina de soya/maní</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-slate-900">Terneros</td>
                        <td className="p-3">Destete y crecimiento</td>
                        <td className="p-3 text-center font-black text-emerald-700 font-mono">18.0% - 20.0%</td>
                        <td className="p-3">Maíz molido fino + Harina de soya + minerales</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-slate-900">Cerdos</td>
                        <td className="p-3">Crecimiento / Engorde</td>
                        <td className="p-3 text-center font-black text-teal-700 font-mono">14.0% - 16.0%</td>
                        <td className="p-3">Sorgo, yuca seca + Harina de ajonjolí o soya</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-slate-900">Pollos de Engorde</td>
                        <td className="p-3">Inicio (0 a 3 semanas)</td>
                        <td className="p-3 text-center font-black text-teal-700 font-mono">21.0% - 23.0%</td>
                        <td className="p-3">Maíz amarillo + Harina de soya + harina de pescado</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-slate-900">Gallinas Ponedoras</td>
                        <td className="p-3">Etapa de Postura activa</td>
                        <td className="p-3 text-center font-black text-emerald-700 font-mono">16.5% - 17.5%</td>
                        <td className="p-3">Maíz o sorgo + Harina de soya + conchuela/calcio</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-slate-900">Tilapias</td>
                        <td className="p-3">Engorde en estanques</td>
                        <td className="p-3 text-center font-black text-emerald-700 font-mono">28.0% - 32.0%</td>
                        <td className="p-3">Harina de pescado + Harina de soya + semolina</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER ACCESIBLE */}
      <footer className="border-t border-slate-200 bg-white px-4 py-4 text-center text-xs text-slate-500">
        <p className="font-medium text-slate-700">
          AgroNica Pearson • Plataforma de Balanceo Nutricional Accesible para Productores de Nicaragua
        </p>
        <p className="text-[10px] text-slate-500 mt-1">
          Desarrollado para optimizar costos de alimentación animal y valorizar subproductos como pulpa de café y forrajes locales.
        </p>
      </footer>
    </div>
  );
}
