import React, { useState, useEffect, useMemo } from 'react';
import { 
  Coffee, 
  Leaf, 
  MapPin, 
  HeartHandshake, 
  QrCode, 
  LayoutDashboard, 
  Users, 
  Package, 
  TrendingUp, 
  DollarSign, 
  Search, 
  Filter, 
  Menu, 
  X, 
  Plus, 
  Pencil, 
  Trash2, 
  Sun, 
  Moon, 
  Save, 
  XCircle, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  ChevronRight,
  Droplet,
  ThermometerSun,
  Truck,
  Award,
  BookOpen,
  Home,
  Globe,
  ShoppingCart,
  Building2,
  Calendar,
  Send,
  Sparkles,
  Inbox,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Compass,
  ArrowUpRight,
  Check,
  GraduationCap,
  Briefcase,
  Layers,
  FileCheck,
  CheckSquare,
  HelpCircle,
  Calculator,
  LineChart as LineChartIcon,
  BadgePercent,
  CircleDollarSign,
  Activity,
  Navigation,
  CheckCircle2,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  PieChart,
  Pie,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  Legend
} from 'recharts';

// Official Brand Logo: 1:1 Vector Replica matching the brand emblem
const NicaTradeLogo = ({ size = 36, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 200 200" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 drop-shadow-md ${className}`}
  >
    {/* Outer Circular Ring with opening for the ascending arrow */}
    <path 
      d="M 148 48 A 78 78 0 1 0 162 138" 
      stroke="#181938" 
      strokeWidth="11" 
      strokeLinecap="round" 
      className="dark:stroke-slate-200 stroke-[#181938]"
    />

    {/* Left Violet Globe / Coffee Bean Lobe */}
    <path 
      d="M 94 46 C 66 46 54 66 54 98 C 54 128 66 150 94 150 C 96 130 96 68 94 46 Z" 
      fill="#9D6CE5" 
    />
    {/* Left Continents - Silhouette Americas */}
    <path 
      d="M 64 68 Q 76 58 84 62 Q 90 80 76 92 Q 62 96 70 118 Q 84 124 86 136 Q 70 136 60 114 Q 56 88 64 68 Z" 
      fill="#FFFFFF" 
    />

    {/* Right Violet Globe / Coffee Bean Lobe */}
    <path 
      d="M 106 46 C 134 46 146 66 146 98 C 146 128 134 150 106 150 C 104 130 104 68 106 46 Z" 
      fill="#8E55E0" 
    />
    {/* Right Continents - Silhouette Eurasia & Africa */}
    <path 
      d="M 110 58 Q 130 58 134 74 Q 122 86 114 82 Q 126 96 138 104 Q 134 126 118 136 Q 110 124 112 104 Q 106 80 110 58 Z" 
      fill="#FFFFFF" 
    />

    {/* Dynamic Ascending Export Arrow (Sweeping across the bean from bottom left to top right) */}
    <path 
      d="M 94 150 C 74 150 70 130 76 118 C 84 104 112 96 146 80 L 172 68" 
      stroke="#181938" 
      strokeWidth="11" 
      strokeLinecap="round" 
      className="dark:stroke-cyan-400 stroke-[#181938]"
    />
    {/* Arrowhead */}
    <polygon 
      points="178,44 174,80 148,62" 
      fill="#181938" 
      className="dark:fill-cyan-400 fill-[#181938]"
    />
  </svg>
);

// Global touch & mobile safety styles
const MOBILE_SAFE_STYLES = `
  * {
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
  input, textarea, select {
    font-size: 16px !important; /* Prevents auto-zoom on iOS Safari */
  }
`;

const KG_PER_QUINTAL = 46;
const KG_PER_EXPORT_BAG = 69;
const NY_BENCHMARK_PRICE_USD_KG = 4.20;
const LBS_PER_QUINTAL = 100;

const ICE_FUTURES_CONTRACTS = [
  { contract: "KC Sep 2026", priceCentsLb: 248.65, change: +3.40, changePct: "+1.39%", high: 251.20, low: 244.10, volume: 18450, status: "Activo / Principal" },
  { contract: "KC Dic 2026", priceCentsLb: 244.30, change: +2.85, changePct: "+1.18%", high: 246.50, low: 240.80, volume: 12100, status: "Activo" },
  { contract: "KC Mar 2027", priceCentsLb: 241.15, change: +1.90, changePct: "+0.79%", high: 243.00, low: 238.50, volume: 6840, status: "Activo" },
  { contract: "KC May 2027", priceCentsLb: 238.90, change: -0.45, changePct: "-0.19%", high: 240.10, low: 237.20, volume: 3290, status: "Activo" }
];

const HISTORICAL_MARKET_TRENDS = {
  "1M": [
    { date: "01 Ago", nyCommodityPrice: 2.30, nicaTradePrice: 9.50 },
    { date: "08 Ago", nyCommodityPrice: 2.36, nicaTradePrice: 9.60 },
    { date: "15 Ago", nyCommodityPrice: 2.41, nicaTradePrice: 9.75 },
    { date: "22 Ago", nyCommodityPrice: 2.45, nicaTradePrice: 9.80 },
    { date: "28 Ago", nyCommodityPrice: 2.49, nicaTradePrice: 9.80 }
  ],
  "6M": [
    { date: "Mar 2026", nyCommodityPrice: 2.10, nicaTradePrice: 9.20 },
    { date: "Abr 2026", nyCommodityPrice: 2.22, nicaTradePrice: 9.35 },
    { date: "May 2026", nyCommodityPrice: 2.18, nicaTradePrice: 9.40 },
    { date: "Jun 2026", nyCommodityPrice: 2.35, nicaTradePrice: 9.60 },
    { date: "Jul 2026", nyCommodityPrice: 2.42, nicaTradePrice: 9.70 },
    { date: "Ago 2026", nyCommodityPrice: 2.49, nicaTradePrice: 9.80 }
  ],
  "1Y": [
    { date: "Sep 2025", nyCommodityPrice: 1.85, nicaTradePrice: 8.80 },
    { date: "Nov 2025", nyCommodityPrice: 1.95, nicaTradePrice: 8.90 },
    { date: "Ene 2026", nyCommodityPrice: 2.05, nicaTradePrice: 9.10 },
    { date: "Mar 2026", nyCommodityPrice: 2.10, nicaTradePrice: 9.20 },
    { date: "May 2026", nyCommodityPrice: 2.18, nicaTradePrice: 9.40 },
    { date: "Ago 2026", nyCommodityPrice: 2.49, nicaTradePrice: 9.80 }
  ]
};

const CURRENCY_RATES = {
  USD: { symbol: '$', rate: 1, label: 'USD ($ Dólar)' },
  EUR: { symbol: '€', rate: 0.92, label: 'EUR (€ Euro)' },
  NIO: { symbol: 'C$', rate: 36.75, label: 'NIO (C$ Córdoba)' },
  GBP: { symbol: '£', rate: 0.78, label: 'GBP (£ Libra)' }
};

const formatPrice = (amountUSD, currency = 'USD') => {
  const conf = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
  const converted = (amountUSD || 0) * conf.rate;
  return `${conf.symbol}${converted.toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatNumberCurrency = (amountUSD, currency = 'USD') => {
  const conf = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
  return Number(((amountUSD || 0) * conf.rate).toFixed(2));
};

const getAltitudeClassification = (altitude) => {
  if (altitude >= 1500) return { label: 'SHG+ (Estrictamente Altura Plus)', color: 'bg-purple-950/80 text-purple-300 border-purple-500/60' };
  if (altitude >= 1350) return { label: 'SHG (Estrictamente Altura)', color: 'bg-indigo-950/80 text-indigo-300 border-indigo-500/60' };
  if (altitude >= 1200) return { label: 'HG (Altura)', color: 'bg-blue-950/80 text-blue-300 border-blue-500/60' };
  return { label: 'Estándar', color: 'bg-slate-900/80 text-slate-300 border-slate-700' };
};

const INITIAL_PRODUCERS = [
  {
    id: "prod-1",
    name: "María Elena González",
    email: "maria.gonzalez@fincaesperanza.ni",
    farmName: "Finca La Esperanza",
    department: "Jinotega",
    municipality: "San Rafael del Norte",
    altitude: 1450,
    manzanasCultivadas: 14.5,
    estimatedHarvestQuintales: 260,
    costOfProductionPerQqUSD: 125.00,
    targetPricePerKgUSD: 9.80,
    netProfitEstimatedUSD: 42300,
    varieties: "Maracaturra",
    certifications: "Orgánico Biolatina, SHG Especialidad",
    organolepticNotes: "Fragancia a jazmín silvestre, acidez málica brillante a manzana verde, miel de caña y notas a chocolate amargo.",
    lat: 13.2125,
    lng: -86.1108,
    published: true,
    avatar: "https://images.unsplash.com/photo-1595858600863-7182ecf7b494?auto=format&fit=crop&w=400&q=80",
    farmImage: "https://images.unsplash.com/photo-1524350876685-274059332603?auto=format&fit=crop&w=1000"
  },
  {
    id: "prod-2",
    name: "José Tomás Pérez",
    email: "tomas.perez@fincaspiro.ni",
    farmName: "Finca El Suspiro",
    department: "Matagalpa",
    municipality: "San Ramón",
    altitude: 1280,
    manzanasCultivadas: 9.0,
    estimatedHarvestQuintales: 160,
    costOfProductionPerQqUSD: 118.00,
    targetPricePerKgUSD: 8.90,
    netProfitEstimatedUSD: 24500,
    varieties: "Pacamara Supremo",
    certifications: "Rainforest Alliance, HG Altura",
    organolepticNotes: "",
    lat: 12.9234,
    lng: -85.8392,
    published: true,
    avatar: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80",
    farmImage: "https://images.unsplash.com/photo-1518832553480-cd0e625ed3e6?auto=format&fit=crop&w=1000"
  },
  {
    id: "prod-3",
    name: "Don Hernán Talavera",
    email: "hernan@flordepino.ni",
    farmName: "Finca Los Pinos",
    department: "Nueva Segovia",
    municipality: "Dipilto",
    altitude: 1620,
    manzanasCultivadas: 22.0,
    estimatedHarvestQuintales: 380,
    costOfProductionPerQqUSD: 140.00,
    targetPricePerKgUSD: 12.50,
    netProfitEstimatedUSD: 78000,
    varieties: "Maracaturra, Geisha Nica, Bourbon Rosado",
    certifications: "Taza de la Excelencia Finalista, SHG+",
    organolepticNotes: "Complejidad exótica floral, notas a bergamota, papaya deshidratada, panela y final prolongado y sedoso.",
    lat: 13.7183,
    lng: -86.5342,
    published: true,
    avatar: "https://images.unsplash.com/photo-1610632380989-680fe40816c6?auto=format&fit=crop&w=400&q=80",
    farmImage: "https://images.unsplash.com/photo-1524350876685-274059332603?auto=format&fit=crop&w=1000"
  },
  {
    id: "prod-4",
    name: "Doña Rosa Emilia Blandón",
    email: "rosa.blandon@lasbrumas.ni",
    farmName: "Finca Las Brumas de Pantasma",
    department: "Jinotega",
    municipality: "Santa María de Pantasma",
    altitude: 1480,
    manzanasCultivadas: 12.0,
    estimatedHarvestQuintales: 210,
    costOfProductionPerQqUSD: 122.00,
    targetPricePerKgUSD: 9.60,
    netProfitEstimatedUSD: 33800,
    varieties: "Caturra Rojo",
    certifications: "Orgánico Certificado, Amigable con las Aves",
    organolepticNotes: "",
    lat: 13.3486,
    lng: -85.9421,
    published: true,
    avatar: "https://images.unsplash.com/photo-1518832553480-cd0e625ed3e6?auto=format&fit=crop&w=400&q=80",
    farmImage: "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?auto=format&fit=crop&w=1000"
  },
  {
    id: "prod-5",
    name: "Ing. Carlos Alberto Mayorga",
    email: "carlos.mayorga@lacumbre.ni",
    farmName: "Finca La Cumbre de Jalapa",
    department: "Nueva Segovia",
    municipality: "Jalapa",
    altitude: 1680,
    manzanasCultivadas: 18.0,
    estimatedHarvestQuintales: 320,
    costOfProductionPerQqUSD: 138.00,
    targetPricePerKgUSD: 13.20,
    netProfitEstimatedUSD: 69500,
    varieties: "Geisha de Altura",
    certifications: "Taza de la Excelencia 2026, SHG+ Estricta Altura",
    organolepticNotes: "Perfil aromático a flor de azahar y lirios, té de limón, acidez fosfórica limpia y final dulce persistente.",
    lat: 13.9211,
    lng: -86.1264,
    published: true,
    avatar: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80",
    farmImage: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000"
  },
  {
    id: "prod-6",
    name: "Brenda Xiomara Sobalvarro",
    email: "brenda@elbosquematagalpa.ni",
    farmName: "Finca Agroecológica El Bosque",
    department: "Matagalpa",
    municipality: "El Tuma - La Dalia",
    altitude: 1320,
    manzanasCultivadas: 11.5,
    estimatedHarvestQuintales: 195,
    costOfProductionPerQqUSD: 119.00,
    targetPricePerKgUSD: 9.40,
    netProfitEstimatedUSD: 31200,
    varieties: "Maracaturra, Catimor 128",
    certifications: "Certificación Cero Deforestación EUDR, Manos de Mujer",
    organolepticNotes: "Notas a cacao fermentado, ciruela pasa, miel silvestre y cuerpo cremoso y achocolatado.",
    lat: 13.0825,
    lng: -85.7533,
    published: true,
    avatar: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80",
    farmImage: "https://images.unsplash.com/photo-1524350876685-274059332603?auto=format&fit=crop&w=1000"
  },
  {
    id: "prod-8",
    name: "Xiomara Castillo Morales",
    email: "xiomara@montefloresteli.ni",
    farmName: "Finca Monte Flor de Miraflor",
    department: "Estelí",
    municipality: "Estelí (Reserva Miraflor)",
    altitude: 1420,
    manzanasCultivadas: 8.5,
    estimatedHarvestQuintales: 145,
    costOfProductionPerQqUSD: 126.00,
    targetPricePerKgUSD: 10.20,
    netProfitEstimatedUSD: 25800,
    varieties: "Pacamara Especial, Caturra",
    certifications: "Reserva de Biósfera Miraflor, Orgánico",
    organolepticNotes: "Fragancia de orquídeas de neblina, notas cítricas a mandarina criolla, miel de abejas y final dulce y sedoso.",
    lat: 13.2500,
    lng: -86.2833,
    published: true,
    avatar: "https://images.unsplash.com/photo-1610632380989-680fe40816c6?auto=format&fit=crop&w=400&q=80",
    farmImage: "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?auto=format&fit=crop&w=1000"
  }
];

const INITIAL_BATCHES = [
  {
    id: "b1",
    code: "NT-26-001",
    farmerId: "prod-1",
    variety: "Maracaturra",
    process: "Honey Amarillo",
    score: 88.5,
    weight: 2300,
    priceUSD: 9.80,
    status: "Disponible en Beneficio Seco",
    harvestDate: "2026-02-15",
    tastingNotes: ["Jazmín", "Miel de Caña", "Acidez Cítrica"],
    batchImage: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "b2",
    code: "NT-26-002",
    farmerId: "prod-1",
    variety: "Java Nica",
    process: "Lavado Tradicional",
    score: 87.0,
    weight: 1840,
    priceUSD: 9.20,
    status: "En Finca (Secado Solar)",
    harvestDate: "2026-03-02",
    tastingNotes: ["Chocolate Amargo", "Manzana Verde", "Cuerpo Sedoso"],
    batchImage: "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "b3",
    code: "NT-26-003",
    farmerId: "prod-2",
    variety: "Pacamara Supremo",
    process: "Natural Anaeróbico",
    score: 89.25,
    weight: 1380,
    priceUSD: 11.50,
    status: "Disponible en Beneficio Seco",
    harvestDate: "2026-03-20",
    tastingNotes: ["Frutos Rojos", "Licor de Café", "Caramelo"],
    batchImage: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "b4",
    code: "NT-26-004",
    farmerId: "prod-3",
    variety: "Maracaturra Presidencial",
    process: "Maceración Carbónica",
    score: 91.5,
    weight: 920,
    priceUSD: 16.50,
    status: "Reservado / Muestra Aprobada",
    harvestDate: "2026-01-28",
    tastingNotes: ["Bergamota", "Papaya", "Panela Fina"],
    batchImage: "https://images.unsplash.com/photo-1524350876685-274059332603?auto=format&fit=crop&w=800"
  },
  {
    id: "b5",
    code: "NT-26-005",
    farmerId: "prod-5",
    variety: "Geisha de Altura",
    process: "Natural Fermentado",
    score: 92.0,
    weight: 690,
    priceUSD: 18.00,
    status: "Disponible en Beneficio Seco",
    harvestDate: "2026-02-10",
    tastingNotes: ["Flor de Azahar", "Té de Jazmín", "Limón Meyer"],
    batchImage: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "b6",
    code: "NT-26-006",
    farmerId: "prod-4",
    variety: "Caturra Rojo Especial",
    process: "Honey Rojo",
    score: 88.0,
    weight: 1610,
    priceUSD: 9.60,
    status: "Disponible en Beneficio Seco",
    harvestDate: "2026-02-24",
    tastingNotes: ["Frutos del Bosque", "Caña de Azúcar", "Cacao"],
    batchImage: "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "b7",
    code: "NT-26-007",
    farmerId: "prod-6",
    variety: "Maracaturra Honey",
    process: "Honey Amarillo",
    score: 88.75,
    weight: 1150,
    priceUSD: 10.40,
    status: "En Finca (Secado Solar)",
    harvestDate: "2026-03-05",
    tastingNotes: ["Ciruela Pasa", "Cacao Criollo", "Miel Silvestre"],
    batchImage: "https://images.unsplash.com/photo-1518832553480-cd0e625ed3e6?auto=format&fit=crop&w=800"
  },
  {
    id: "b8",
    code: "NT-26-008",
    farmerId: "prod-8",
    variety: "Pacamara de Neblina",
    process: "Lavado Prolongado",
    score: 89.0,
    weight: 920,
    priceUSD: 11.20,
    status: "Disponible en Beneficio Seco",
    harvestDate: "2026-02-18",
    tastingNotes: ["Mandarina Criolla", "Orquídea", "Miel Pura"],
    batchImage: "https://images.unsplash.com/photo-1524350876685-274059332603?auto=format&fit=crop&w=800"
  }
];

const NICA_COFFEE_REGIONS = [
  {
    id: "dipilto",
    name: "Cordillera Dipilto - Jalapa",
    department: "Nueva Segovia",
    altitudeRange: "1,350 - 1,750 msnm",
    harvestMonths: "Diciembre - Marzo",
    cupProfile: "Acidez cítrica brillante, jazmín, miel de abeja y notas florales intensas.",
    cupOfExcellenceRecord: "Récord Taza de la Excelencia 2026: US$ 140.00 / lb",
    image: "https://images.unsplash.com/photo-1524350876685-274059332603?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "penas-blancas",
    name: "Macizo de Peñas Blancas / Pantasma",
    department: "Jinotega",
    altitudeRange: "1,200 - 1,600 msnm",
    harvestMonths: "Noviembre - Marzo",
    cupProfile: "Cuerpo cremoso, cacao puro, ciruela pasa, caña de azúcar y balance prolongado.",
    cupOfExcellenceRecord: "Mayor volumen de cafés SHG de estricta altura de Nicaragua",
    image: "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "san-ramon",
    name: "Serranías de San Ramón & La Dalia",
    department: "Matagalpa",
    altitudeRange: "1,150 - 1,500 msnm",
    harvestMonths: "Noviembre - Febrero",
    cupProfile: "Dulzura caramelizada, avellanas tostadas, manzana roja y cuerpo sedoso.",
    cupOfExcellenceRecord: "Cuna de la agroindustria y de beneficios secos ecológicos",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800"
  }
];

const STATE_TRAINING_PROGRAMS = [
  {
    id: "conatradec-sca",
    entity: "CONATRADEC",
    title: "Calibración de Catación SCA & Preparación Taza de la Excelencia 2026",
    duration: "40 Horas (Presencial / Laboratorio Matagalpa)",
    cost: "Gratuito (Subvencionado por Fondo Cafetalero)",
    badge: "Oficial CONATRADEC",
    icon: Award,
    description: "Entrenamiento para estandarizar la cata de microlotes, detección de defectos y perfilación sensorial para defender precios de especialidad por encima de los US$10/Kg."
  },
  {
    id: "cetrex-export",
    entity: "CETREX & MIFIC",
    title: "Trámites Aduanales, Certificados de Origen OIC y Despacho FOB Puerto Corinto",
    duration: "24 Horas (Híbrido)",
    cost: "Gratuito",
    badge: "Comercio Exterior",
    icon: Truck,
    description: "Capacitación práctica para emisión ágil de certificados de origen OIC, precintado de contenedores y liquidación de divisas para exportación directa."
  },
  {
    id: "mefcca-beneficio",
    entity: "MEFCCA & Economía Creativa",
    title: "Procesamiento Especial de Microlotes: Honey, Naturales y Anaeróbicos",
    duration: "30 Horas (Práctico en Finca Escuela)",
    cost: "Gratuito",
    badge: "Agroindustria",
    icon: Droplet,
    description: "Metodologías de control de grados Brix, curvas de secado solar en camas africanas y empaque GrainPro para conservar la frescura del grano."
  }
];

const DEMO_USERS = [
  {
    id: "prod-1",
    role: "producer",
    name: "María Elena González",
    email: "maria.gonzalez@fincaesperanza.ni",
    farmName: "Finca La Esperanza",
    department: "Jinotega",
    municipality: "San Rafael del Norte",
    altitude: 1450,
    costOfProductionPerQqUSD: 125.00,
    targetPricePerKgUSD: 9.80,
    netProfitEstimatedUSD: 42300,
    lat: 13.2125,
    lng: -86.1108,
    avatar: "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "buyer-1",
    role: "buyer",
    name: "Lukas Weber",
    email: "lukas@nordicroasters.de",
    companyName: "Nordic Specialty Roasters",
    country: "Alemania",
    city: "Berlín",
    preferredCurrency: "EUR",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
  }
];

const ToastContainer = ({ toasts, removeToast }) => (
  <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
    {toasts.map((toast) => (
      <div 
        key={toast.id} 
        className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-xl animate-in slide-in-from-right-10 fade-in duration-300 ${
          toast.type === 'success' 
            ? 'bg-slate-900/90 border-indigo-500/60 text-white shadow-indigo-950/60' 
            : 'bg-rose-950/90 border-rose-600 text-white shadow-rose-950/40'
        }`}
      >
        {toast.type === 'success' ? <CheckCircle size={18} className="text-cyan-400" /> : <AlertTriangle size={18} className="text-rose-400" />}
        <p className="text-xs font-bold leading-tight">{toast.message}</p>
        <button onClick={() => removeToast(toast.id)} className="opacity-60 hover:opacity-100 ml-2 text-slate-400 hover:text-white">
          <X size={14} />
        </button>
      </div>
    ))}
  </div>
);

const MetricCard = ({ title, value, subtitle, badgeText, icon: Icon, isDark }) => (
  <div className={`p-5 rounded-2xl border shadow-lg transition-all duration-300 hover:shadow-indigo-500/10 hover:border-indigo-500/50 ${isDark ? 'bg-slate-900/90 border-indigo-950/80' : 'bg-white border-indigo-100 shadow-slate-200/60'}`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</p>
        <h4 className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1 tracking-tight">{value}</h4>
        {subtitle && <p className="text-[11px] text-indigo-400/90 font-medium mt-1">{subtitle}</p>}
        {badgeText && (
          <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-950 text-indigo-300 border border-indigo-700/50">
            {badgeText}
          </span>
        )}
      </div>
      <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30">
        <Icon size={22} />
      </div>
    </div>
  </div>
);

const ModalWrapper = ({ children, isDark, onClose, title, maxWidth = 'max-w-lg' }) => (
  <div 
    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md sm:p-4 overflow-y-auto"
    onClick={onClose}
    onTouchEnd={(e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    }}
  >
    <div 
      className={`rounded-t-3xl sm:rounded-3xl shadow-2xl w-full ${maxWidth} max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden border my-0 sm:my-8 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 ${isDark ? 'bg-slate-900 border-indigo-900/60 text-white shadow-indigo-950/50' : 'bg-white border-indigo-100 text-slate-800'}`}
      onClick={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <div className={`p-4 px-6 border-b flex justify-between items-center shrink-0 ${isDark ? 'border-indigo-950 bg-slate-950/80' : 'border-indigo-50 bg-indigo-50/40'}`}>
        <h3 className="font-extrabold text-sm md:text-base flex items-center gap-2 text-slate-900 dark:text-white truncate pr-2">{title}</h3>
        <button 
          type="button"
          onClick={(e) => { e.stopPropagation(); onClose(); }} 
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0 touch-manipulation"
        >
          <XCircle size={22} />
        </button>
      </div>
      <div className="overflow-y-auto flex-1 overscroll-contain">
        {children}
      </div>
    </div>
  </div>
);

const ProducerRegistrationModal = ({ isOpen, onClose, onRegisterProducer, isDark }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    farmName: '',
    department: 'Jinotega',
    municipality: 'San Rafael del Norte',
    altitude: 1400,
    manzanasCultivadas: 10,
    estimatedHarvestQuintales: 180,
    costOfProductionPerQqUSD: 120.00,
    targetPricePerKgUSD: 9.50,
    varieties: 'Maracaturra, Caturra Estrella, Java Nica',
    certifications: 'Orgánico Biolatina, SHG Especialidad',
    organolepticNotes: 'Aroma a jazmín silvestre, notas a chocolate amargo, acidez cítrica brillante y dulce miel de caña.',
    lat: 13.2125,
    lng: -86.1108
  });

  if (!isOpen) return null;

  const altClass = getAltitudeClassification(formData.altitude);
  const totalKg = formData.estimatedHarvestQuintales * KG_PER_QUINTAL;
  const grossIncomeUSD = totalKg * formData.targetPricePerKgUSD;
  const totalCostUSD = formData.estimatedHarvestQuintales * formData.costOfProductionPerQqUSD;
  const netProfitUSD = Math.max(0, grossIncomeUSD - totalCostUSD);

  const GPS_REGIONAL_PRESETS = [
    { key: "dipilto", label: "Dipilto, Nva. Segovia", department: "Nueva Segovia", municipality: "Dipilto", altitude: 1550, lat: 13.7183, lng: -86.5342 },
    { key: "jalapa", label: "Jalapa, Nva. Segovia", department: "Nueva Segovia", municipality: "Jalapa", altitude: 1650, lat: 13.9211, lng: -86.1264 },
    { key: "san-rafael", label: "San Rafael, Jinotega", department: "Jinotega", municipality: "San Rafael del Norte", altitude: 1420, lat: 13.2125, lng: -86.1108 },
    { key: "pantasma", label: "Pantasma, Jinotega", department: "Jinotega", municipality: "Santa María de Pantasma", altitude: 1480, lat: 13.3486, lng: -85.9421 },
    { key: "penas-blancas", label: "Peñas Blancas, Jinotega", department: "Jinotega", municipality: "El Cuá", altitude: 1520, lat: 13.2842, lng: -85.6725 },
    { key: "san-ramon", label: "San Ramón, Matagalpa", department: "Matagalpa", municipality: "San Ramón", altitude: 1280, lat: 12.9234, lng: -85.8392 },
    { key: "la-dalia", label: "La Dalia, Matagalpa", department: "Matagalpa", municipality: "El Tuma - La Dalia", altitude: 1320, lat: 13.0825, lng: -85.7533 },
    { key: "rio-coco", label: "Río Coco, Madriz", department: "Madriz", municipality: "San Juan de Río Coco", altitude: 1380, lat: 13.5412, lng: -86.1667 },
    { key: "miraflor", label: "Miraflor, Estelí", department: "Estelí", municipality: "Estelí (Miraflor)", altitude: 1420, lat: 13.2500, lng: -86.2833 },
    { key: "boaco", label: "Santa Lucía, Boaco", department: "Boaco", municipality: "Santa Lucía", altitude: 1220, lat: 12.5317, lng: -85.7108 }
  ];

  const handleApplyPreset = (preset) => {
    setFormData(prev => ({
      ...prev,
      department: preset.department,
      municipality: preset.municipality,
      altitude: preset.altitude,
      lat: preset.lat,
      lng: preset.lng
    }));
  };

  const handleGetBrowserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData(prev => ({
            ...prev,
            lat: Number(pos.coords.latitude.toFixed(4)),
            lng: Number(pos.coords.longitude.toFixed(4))
          }));
        },
        () => {
          handleApplyPreset(GPS_REGIONAL_PRESETS[2]);
        }
      );
    }
  };

  const handleSubmitFinal = (e) => {
    e.preventDefault();
    const newProducer = {
      id: `prod-${Date.now()}`,
      role: 'producer',
      name: formData.name || 'Productor Nicaragüense',
      email: formData.email || 'finca@nicatrade.ni',
      farmName: formData.farmName || 'Finca de Café',
      department: formData.department,
      municipality: formData.municipality,
      altitude: Number(formData.altitude),
      manzanasCultivadas: Number(formData.manzanasCultivadas),
      estimatedHarvestQuintales: Number(formData.estimatedHarvestQuintales),
      costOfProductionPerQqUSD: Number(formData.costOfProductionPerQqUSD),
      targetPricePerKgUSD: Number(formData.targetPricePerKgUSD),
      netProfitEstimatedUSD: netProfitUSD,
      varieties: formData.varieties,
      certifications: formData.certifications,
      organolepticNotes: formData.organolepticNotes,
      lat: Number(formData.lat),
      lng: Number(formData.lng),
      published: true,
      avatar: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80",
      farmImage: "https://images.unsplash.com/photo-1524350876685-274059332603?auto=format&fit=crop&w=1000"
    };

    onRegisterProducer(newProducer);
    onClose();
  };

  return (
    <ModalWrapper isDark={isDark} onClose={onClose} title="Registro & Certificación Agronómica de Finca" maxWidth="max-w-2xl">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-indigo-950 pb-4">
          <div className="flex items-center gap-2">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${step === 1 ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'bg-slate-800 text-slate-400'}`}>1</span>
            <span className={`text-xs font-bold ${step === 1 ? 'text-white' : 'text-slate-400'}`}>Ficha Agronómica</span>
          </div>
          <div className="w-8 h-0.5 bg-indigo-950"></div>
          <div className="flex items-center gap-2">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${step === 2 ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'bg-slate-800 text-slate-400'}`}>2</span>
            <span className={`text-xs font-bold ${step === 2 ? 'text-white' : 'text-slate-400'}`}>Geolocalización GPS</span>
          </div>
          <div className="w-8 h-0.5 bg-indigo-950"></div>
          <div className="flex items-center gap-2">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${step === 3 ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'bg-slate-800 text-slate-400'}`}>3</span>
            <span className={`text-xs font-bold ${step === 3 ? 'text-white' : 'text-slate-400'}`}>Consolidación</span>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Nombre Completo del Productor</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. Don Hernán Talavera"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border text-sm ${isDark ? 'bg-slate-950 border-indigo-950 text-white' : 'bg-indigo-50/40 border-indigo-200 text-slate-900'}`}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Correo Electrónico</label>
                <input 
                  type="email" 
                  required
                  placeholder="productor@nicatrade.ni"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border text-sm ${isDark ? 'bg-slate-950 border-indigo-950 text-white' : 'bg-indigo-50/40 border-indigo-200 text-slate-900'}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Nombre de la Finca / Parcela</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. Finca El Ciprés"
                  value={formData.farmName}
                  onChange={e => setFormData({ ...formData, farmName: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border text-sm ${isDark ? 'bg-slate-950 border-indigo-950 text-white' : 'bg-indigo-50/40 border-indigo-200 text-slate-900'}`}
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold uppercase text-slate-400">Altura de Cultivo (msnm)</label>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${altClass.color}`}>{altClass.label}</span>
                </div>
                <input 
                  type="number" 
                  required
                  min="600"
                  max="2200"
                  value={formData.altitude}
                  onChange={e => setFormData({ ...formData, altitude: Number(e.target.value) })}
                  className={`w-full p-2.5 rounded-xl border text-sm ${isDark ? 'bg-slate-950 border-indigo-950 text-white' : 'bg-indigo-50/40 border-indigo-200 text-slate-900'}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Variedad(es) de Café Sembradas</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. Maracaturra, Java Nica, Pacamara"
                  value={formData.varieties}
                  onChange={e => setFormData({ ...formData, varieties: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border text-sm ${isDark ? 'bg-slate-950 border-indigo-950 text-white' : 'bg-indigo-50/40 border-indigo-200 text-slate-900'}`}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Certificaciones / Distinciones</label>
                <input 
                  type="text" 
                  placeholder="Ej. Orgánico Biolatina, Taza Excelencia"
                  value={formData.certifications}
                  onChange={e => setFormData({ ...formData, certifications: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border text-sm ${isDark ? 'bg-slate-950 border-indigo-950 text-white' : 'bg-indigo-50/40 border-indigo-200 text-slate-900'}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Manzanas (Mz)</label>
                <input 
                  type="number" 
                  required
                  min="0.5"
                  step="0.5"
                  value={formData.manzanasCultivadas}
                  onChange={e => setFormData({ ...formData, manzanasCultivadas: Number(e.target.value) })}
                  className={`w-full p-2.5 rounded-xl border text-sm ${isDark ? 'bg-slate-950 border-indigo-950 text-white' : 'bg-indigo-50/40 border-indigo-200 text-slate-900'}`}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Cosecha (qq Oro)</label>
                <input 
                  type="number" 
                  required
                  min="1"
                  value={formData.estimatedHarvestQuintales}
                  onChange={e => setFormData({ ...formData, estimatedHarvestQuintales: Number(e.target.value) })}
                  className={`w-full p-2.5 rounded-xl border text-sm ${isDark ? 'bg-slate-950 border-indigo-950 text-white' : 'bg-indigo-50/40 border-indigo-200 text-slate-900'}`}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Precio Meta ($/Kg)</label>
                <input 
                  type="number" 
                  required
                  step="0.1"
                  min="4"
                  value={formData.targetPricePerKgUSD}
                  onChange={e => setFormData({ ...formData, targetPricePerKgUSD: Number(e.target.value) })}
                  className={`w-full p-2.5 rounded-xl border text-sm ${isDark ? 'bg-slate-950 border-indigo-950 text-white' : 'bg-indigo-50/40 border-indigo-200 text-slate-900'}`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Notas Sensoriales & Perfil Organoléptico de Taza</label>
              <textarea 
                rows={2}
                required
                value={formData.organolepticNotes}
                onChange={e => setFormData({ ...formData, organolepticNotes: e.target.value })}
                placeholder="Fragancia floral, acidez brillante, cuerpo sedoso..."
                className={`w-full p-2.5 rounded-xl border text-sm ${isDark ? 'bg-slate-950 border-indigo-950 text-white' : 'bg-indigo-50/40 border-indigo-200 text-slate-900'}`}
              />
            </div>

            <button 
              type="button" 
              onClick={() => setStep(2)}
              className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5"
            >
              Continuar a Geolocalización Google Maps <ChevronRight size={16} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-bold uppercase text-cyan-400 flex items-center gap-1">
                <MapPin size={14} /> Posicionamiento Satelital de la Parcela
              </p>
              <button 
                type="button" 
                onClick={handleGetBrowserLocation}
                className="px-2.5 py-1 bg-indigo-950 text-indigo-300 rounded-lg text-xs font-bold border border-indigo-700/60 hover:bg-indigo-900 flex items-center gap-1"
              >
                <Navigation size={12} /> Auto-detectar GPS
              </button>
            </div>

            <p className="text-[11px] text-slate-400 font-medium">Seleccionar microclima / municipio cafetalero:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto pr-1">
              {GPS_REGIONAL_PRESETS.map(preset => (
                <button
                  key={preset.key}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className={`p-2 rounded-xl border text-left text-[11px] font-bold transition-all truncate ${formData.lat === preset.lat && formData.lng === preset.lng ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-md' : isDark ? 'bg-slate-950 border-indigo-950 text-slate-300 hover:border-indigo-700' : 'bg-indigo-50 border-indigo-200 text-slate-700'}`}
                >
                  <p className="truncate">{preset.label}</p>
                  <p className="text-[9px] font-normal text-cyan-300/80">{preset.altitude} msnm</p>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Latitud GPS</label>
                <input 
                  type="number" 
                  step="0.0001"
                  required
                  value={formData.lat}
                  onChange={e => setFormData({ ...formData, lat: Number(e.target.value) })}
                  className={`w-full p-2.5 rounded-xl border text-sm font-mono ${isDark ? 'bg-slate-950 border-indigo-950 text-cyan-300' : 'bg-indigo-50/40 border-indigo-200 text-slate-900'}`}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Longitud GPS</label>
                <input 
                  type="number" 
                  step="0.0001"
                  required
                  value={formData.lng}
                  onChange={e => setFormData({ ...formData, lng: Number(e.target.value) })}
                  className={`w-full p-2.5 rounded-xl border text-sm font-mono ${isDark ? 'bg-slate-950 border-indigo-950 text-cyan-300' : 'bg-indigo-50/40 border-indigo-200 text-slate-900'}`}
                />
              </div>
            </div>

            <div className={`p-1.5 rounded-2xl border ${isDark ? 'bg-slate-950 border-indigo-950' : 'bg-indigo-50 border-indigo-200'}`}>
              <iframe
                title="Google Maps Satelital"
                width="100%"
                height="180"
                className="rounded-xl"
                frameBorder="0"
                scrolling="no"
                src={`https://maps.google.com/maps?q=${formData.lat},${formData.lng}&t=k&z=15&ie=UTF8&iwloc=&output=embed`}
              />
              <div className="p-2 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-mono">Coords: {formData.lat}, {formData.lng} ({formData.municipality}, {formData.department})</span>
                <a 
                  href={`https://maps.google.com/?q=${formData.lat},${formData.lng}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-cyan-400 font-bold hover:underline flex items-center gap-1"
                >
                  Abrir en Google Maps <ExternalLink size={12} />
                </a>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold border border-indigo-950 text-slate-400 hover:text-white"
              >
                Volver
              </button>
              <button 
                type="button" 
                onClick={() => setStep(3)}
                className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5"
              >
                Consolidar y Auditar <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className={`p-4 rounded-2xl border space-y-3 ${isDark ? 'bg-slate-950 border-indigo-950' : 'bg-indigo-50 border-indigo-200'}`}>
              <div className="flex items-center justify-between border-b border-indigo-950 pb-2">
                <div>
                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white">{formData.farmName || 'Finca Sin Nombre'}</h4>
                  <p className="text-xs text-indigo-400">{formData.name} • {formData.municipality}, {formData.department}, Nicaragua</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${altClass.color}`}>{formData.altitude} msnm</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Variedades</p>
                  <p className="font-bold text-slate-200">{formData.varieties}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Cosecha Total</p>
                  <p className="font-bold text-cyan-400">{formData.estimatedHarvestQuintales} qq ({totalKg} Kg)</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Precio Meta</p>
                  <p className="font-bold text-cyan-400">${formData.targetPricePerKgUSD} / Kg</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Ganancia Neta</p>
                  <p className="font-bold text-purple-400 font-mono">${netProfitUSD.toLocaleString()} USD</p>
                </div>
              </div>

              <div className="pt-2 border-t border-indigo-950 text-xs">
                <p className="text-[10px] uppercase font-bold text-slate-400">Perfil Sensorial:</p>
                <p className="italic text-slate-300">"{formData.organolepticNotes}"</p>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-bold pt-1">
                <ShieldCheck size={16} /> Verificado para publicación directa en NicaTrade
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={() => setStep(2)}
                className="flex-1 py-3 rounded-xl text-xs font-semibold border border-indigo-950 text-slate-400 hover:text-white"
              >
                Modificar Datos
              </button>
              <button 
                type="button" 
                onClick={handleSubmitFinal}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 size={16} /> Publicar Perfil Oficial
              </button>
            </div>
          </div>
        )}
      </div>
    </ModalWrapper>
  );
};

const BuyerRegistrationModal = ({ isOpen, onClose, onRegisterBuyer, isDark }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    companyName: '',
    country: 'Alemania',
    city: 'Berlín',
    annualBagCapacity: 250,
    preferredScaRange: '87-90 SCA',
    preferredCurrency: 'EUR'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newBuyer = {
      id: `buyer-${Date.now()}`,
      role: 'buyer',
      name: formData.name || 'Comprador Internacional',
      email: formData.email || 'comprador@tostaduria.com',
      companyName: formData.companyName || 'Specialty Coffee Roastery',
      country: formData.country,
      city: formData.city,
      annualBagCapacity: Number(formData.annualBagCapacity),
      preferredScaRange: formData.preferredScaRange,
      preferredCurrency: formData.preferredCurrency,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
    };

    onRegisterBuyer(newBuyer);
    onClose();
  };

  return (
    <ModalWrapper isDark={isDark} onClose={onClose} title="Registrarme • Comprador & Tostador">
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Nombre Completo</label>
            <input 
              type="text" 
              required
              placeholder="Ej. Lukas Weber"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className={`w-full p-2.5 rounded-xl border text-sm ${isDark ? 'bg-slate-950 border-indigo-950 text-white' : 'bg-indigo-50/40 border-indigo-200 text-slate-900'}`}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Correo Corporativo</label>
            <input 
              type="email" 
              required
              placeholder="lukas@nordicroasters.de"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className={`w-full p-2.5 rounded-xl border text-sm ${isDark ? 'bg-slate-950 border-indigo-950 text-white' : 'bg-indigo-50/40 border-indigo-200 text-slate-900'}`}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Tostaduría / Empresa Importadora</label>
          <input 
            type="text" 
            required
            placeholder="Ej. Nordic Specialty Coffee Roasters"
            value={formData.companyName}
            onChange={e => setFormData({ ...formData, companyName: e.target.value })}
            className={`w-full p-2.5 rounded-xl border text-sm ${isDark ? 'bg-slate-950 border-indigo-950 text-white' : 'bg-indigo-50/40 border-indigo-200 text-slate-900'}`}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">País de Destino</label>
            <input 
              type="text" 
              required
              placeholder="Ej. Alemania, EE.UU., Japón"
              value={formData.country}
              onChange={e => setFormData({ ...formData, country: e.target.value })}
              className={`w-full p-2.5 rounded-xl border text-sm ${isDark ? 'bg-slate-950 border-indigo-950 text-white' : 'bg-indigo-50/40 border-indigo-200 text-slate-900'}`}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Ciudad</label>
            <input 
              type="text" 
              required
              placeholder="Ej. Berlín"
              value={formData.city}
              onChange={e => setFormData({ ...formData, city: e.target.value })}
              className={`w-full p-2.5 rounded-xl border text-sm ${isDark ? 'bg-slate-950 border-indigo-950 text-white' : 'bg-indigo-50/40 border-indigo-200 text-slate-900'}`}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Capacidad Anual (Sacos 69kg)</label>
            <input 
              type="number" 
              required
              min="10"
              value={formData.annualBagCapacity}
              onChange={e => setFormData({ ...formData, annualBagCapacity: Number(e.target.value) })}
              className={`w-full p-2.5 rounded-xl border text-sm ${isDark ? 'bg-slate-950 border-indigo-950 text-white' : 'bg-indigo-50/40 border-indigo-200 text-slate-900'}`}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Moneda Preferida</label>
            <select
              value={formData.preferredCurrency}
              onChange={e => setFormData({ ...formData, preferredCurrency: e.target.value })}
              className={`w-full p-2.5 rounded-xl border text-sm ${isDark ? 'bg-slate-950 border-indigo-950 text-white' : 'bg-indigo-50/40 border-indigo-200 text-slate-900'}`}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="NIO">NIO (C$)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-xs font-semibold border border-indigo-950 text-slate-400 hover:text-white">Cancelar</button>
          <button type="submit" className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30">Registrarme</button>
        </div>
      </form>
    </ModalWrapper>
  );
};

const AuthModal = ({ isOpen, onClose, isDark, onLoginSuccess, portalRole = 'producer', onOpenProducerRegister, onOpenBuyerRegister }) => {
  const [loginEmail, setLoginEmail] = useState('');

  if (!isOpen) return null;

  const handleDemo = (user) => {
    onLoginSuccess(user);
    onClose();
  };

  const handleForm = (e) => {
    e.preventDefault();
    const found = DEMO_USERS.find(u => u.email.toLowerCase() === loginEmail.toLowerCase());
    if (found) {
      onLoginSuccess(found);
    } else {
      const newUser = {
        id: `u-${Date.now()}`,
        role: portalRole,
        email: loginEmail,
        name: loginEmail.split('@')[0],
        farmName: portalRole === 'producer' ? 'Finca La Esperanza' : undefined,
        companyName: portalRole === 'buyer' ? 'Nordic Roasters' : undefined,
        department: 'Jinotega',
        altitude: 1400,
        avatar: "https://images.unsplash.com/photo-1595858600863-7182ecf7b494?auto=format&fit=crop&w=300&q=80"
      };
      onLoginSuccess(newUser);
    }
    onClose();
  };

  return (
    <ModalWrapper isDark={isDark} onClose={onClose} title={portalRole === 'producer' ? 'Portal Caficultor • Iniciar Sesión' : 'Portal Comprador • Iniciar Sesión'}>
      <div className="p-6 space-y-4">
        <p className="text-xs font-bold text-cyan-300 uppercase">Cuentas Rápidas Demo:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {DEMO_USERS.filter(u => u.role === portalRole).map(u => (
            <button
              key={u.id}
              type="button"
              onClick={() => handleDemo(u)}
              className={`p-2.5 rounded-xl border text-left text-xs flex items-center gap-2 transition-all hover:border-indigo-500 ${isDark ? 'bg-slate-950 border-indigo-950 text-white' : 'bg-indigo-50 border-indigo-100 text-slate-800'}`}
            >
              <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
              <div className="truncate">
                <p className="font-bold truncate">{u.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{u.role === 'producer' ? u.farmName : u.companyName}</p>
              </div>
            </button>
          ))}
        </div>

        <form onSubmit={handleForm} className="space-y-3 pt-2">
          <label className="block text-xs font-bold uppercase text-slate-400">Correo Electrónico</label>
          <input
            required
            type="email"
            value={loginEmail}
            onChange={e => setLoginEmail(e.target.value)}
            placeholder="usuario@nicatrade.ni"
            className={`w-full p-2.5 rounded-xl border text-sm ${isDark ? 'bg-slate-950 border-indigo-950 text-white' : 'bg-indigo-50 border-indigo-200 text-slate-900'}`}
          />
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30"
          >
            Entrar a la Plataforma
          </button>
        </form>

        <div className="pt-3 border-t border-indigo-950 text-center">
          <p className="text-xs text-slate-400 mb-2">¿Aún no tienes una cuenta registrada?</p>
          {portalRole === 'producer' ? (
            <button
              type="button"
              onClick={() => { onClose(); onOpenProducerRegister(); }}
              className="w-full py-2.5 bg-indigo-950/80 hover:bg-indigo-900 text-cyan-300 rounded-xl text-xs font-bold border border-cyan-500/30 flex items-center justify-center gap-1.5"
            >
              <Building2 size={14} /> Registrar Mi Finca
            </button>
          ) : (
            <button
              type="button"
              onClick={() => { onClose(); onOpenBuyerRegister(); }}
              className="w-full py-2.5 bg-indigo-950/80 hover:bg-indigo-900 text-cyan-300 rounded-xl text-xs font-bold border border-cyan-500/30 flex items-center justify-center gap-1.5"
            >
              <UserPlus size={14} /> Registrarme
            </button>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
};

const NYCoffeeExchangeView = ({ isDark, currency }) => {
  const [timeframe, setTimeframe] = useState('6M');
  const [activeContractIndex, setActiveContractIndex] = useState(0);

  const activeContract = ICE_FUTURES_CONTRACTS[activeContractIndex];
  const chartData = HISTORICAL_MARKET_TRENDS[timeframe] || HISTORICAL_MARKET_TRENDS['6M'];

  const nyPricePerLbUSD = activeContract.priceCentsLb / 100;
  const nyPricePerQuintalUSD = nyPricePerLbUSD * 100;
  const nyPricePerKgUSD = nyPricePerLbUSD * 2.20462;
  const specialtyPricePerKgUSD = 9.80;
  const extraValuePercentage = (((specialtyPricePerKgUSD - nyPricePerKgUSD) / nyPricePerKgUSD) * 100).toFixed(1);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-6xl mx-auto">
      <div className={`p-6 rounded-3xl border shadow-xl relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border-indigo-800/50' : 'bg-gradient-to-br from-blue-900 via-indigo-950 to-purple-950 text-white border-indigo-900'}`}>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 text-white flex items-center gap-1 shadow-sm">
                <Activity size={12} className="animate-pulse" /> Cotización en Vivo • ICE Futures U.S. (Nueva York)
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-cyan-200 border border-white/20">
                Contrato "C" Arábica (KC)
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white">
              Bolsa de Valores de Nueva York & Monitor de Precios Reales
            </h3>
            <p className="text-xs md:text-sm text-indigo-100/90 leading-relaxed">
              Monitorea el contrato mundial de referencia <strong>ICE Coffee "C"</strong> y comprueba cómo el modelo de <strong>Comercio Directo de NicaTrade</strong> defiende el valor real de tu café.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-indigo-500/30 text-center shrink-0 min-w-[240px] shadow-lg">
            <p className="text-[10px] uppercase font-bold text-cyan-300 tracking-wider">Contrato Activo NY: {activeContract.contract}</p>
            <div className="flex items-center justify-center gap-2 my-1">
              <span className="text-3xl font-black font-mono text-white">{activeContract.priceCentsLb.toFixed(2)}</span>
              <span className="text-sm font-bold text-cyan-300">¢/lb</span>
            </div>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-cyan-300 bg-indigo-950/80 px-2.5 py-0.5 rounded-full border border-cyan-500/40">
              <ArrowUpRight size={14} /> {activeContract.change > 0 ? `+${activeContract.change}` : activeContract.change} ¢/lb ({activeContract.changePct})
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 rounded-2xl border shadow-sm ${isDark ? 'bg-slate-900/90 border-indigo-950' : 'bg-white border-indigo-100'}`}>
          <p className="text-[10px] uppercase font-bold text-slate-400">Precio Bolsa NY por Libra</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">{activeContract.priceCentsLb.toFixed(2)} ¢</p>
            <span className="text-xs text-indigo-400 font-mono">(${nyPricePerLbUSD.toFixed(2)} USD)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Base Contrato "C" (Sin prima)</p>
        </div>

        <div className={`p-4 rounded-2xl border shadow-sm ${isDark ? 'bg-slate-900/90 border-indigo-950' : 'bg-white border-indigo-100'}`}>
          <p className="text-[10px] uppercase font-bold text-slate-400">Precio Bolsa por Quintal Oro</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
            {formatPrice(nyPricePerQuintalUSD, currency)}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">100 lbs de café oro</p>
        </div>

        <div className={`p-4 rounded-2xl border shadow-sm ${isDark ? 'bg-slate-900/90 border-indigo-950' : 'bg-white border-indigo-100'}`}>
          <p className="text-[10px] uppercase font-bold text-slate-400">Precio Bolsa por Kilogramo</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
            {formatPrice(nyPricePerKgUSD, currency)} / Kg
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Equivalente a 2.204 lbs</p>
        </div>

        <div className={`p-4 rounded-2xl border shadow-md ${isDark ? 'bg-indigo-950/40 border-indigo-600/40' : 'bg-indigo-50 border-indigo-200'}`}>
          <p className="text-[10px] uppercase font-bold text-indigo-600 dark:text-cyan-300">Precio Especialidad Direct Trade</p>
          <p className="text-2xl font-black text-indigo-600 dark:text-cyan-400 font-mono mt-1">
            {formatPrice(specialtyPricePerKgUSD, currency)} / Kg
          </p>
          <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm">
            +{extraValuePercentage}% sobre Bolsa NY
          </span>
        </div>
      </div>

      <div className={`p-6 rounded-3xl border shadow-sm ${isDark ? 'bg-slate-900/90 border-indigo-950' : 'bg-white border-indigo-100'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h4 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp size={18} className="text-indigo-400" /> Bolsa de NY Commodity ($/lb) vs. Precio Real Directo ($/kg)
            </h4>
            <p className="text-xs text-slate-500">Comportamiento histórico del mercado frente al café de especialidad nicaragüense.</p>
          </div>

          <div className={`p-1 rounded-xl flex border self-start sm:self-auto ${isDark ? 'bg-slate-950 border-indigo-950' : 'bg-indigo-50/80 border-indigo-100'}`}>
            {['1M', '6M', '1Y'].map(tf => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${timeframe === tf ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorNicaTrade" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorNY" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1e1b4b' : '#e0e7ff'} />
              <XAxis dataKey="date" tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }} />
              <YAxis tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }} domain={[0, 12]} />
              <Tooltip 
                contentStyle={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', borderColor: '#4f46e5', borderRadius: '12px' }}
                formatter={(value, name) => [
                  `$${Number(value).toFixed(2)} USD`,
                  name === 'nicaTradePrice' ? 'NicaTrade Directo ($/Kg)' : 'Bolsa NY Contrato C ($/lb)'
                ]}
              />
              <Legend verticalAlign="top" height={36} />
              <Area type="monotone" dataKey="nicaTradePrice" name="NicaTrade Directo ($/Kg)" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorNicaTrade)" />
              <Area type="monotone" dataKey="nyCommodityPrice" name="Bolsa NY Contrato C ($/lb)" stroke="#06b6d4" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorNY)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StateTrainingView = ({ currentUser, trainingRequests, onRequestTraining, isDark }) => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goalText, setGoalText] = useState('Calibrar la cata SCA de nuestros microlotes.');

  const handleOpen = (prog) => {
    setSelectedProgram(prog);
    setGoalText(`Capacitarnos con ${prog.entity} para certificar la calidad de ${currentUser?.farmName || 'la finca'}.`);
    setIsModalOpen(true);
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    if (!selectedProgram) return;
    const newReq = {
      id: `tr-${Date.now()}`,
      farmerId: currentUser?.id || 'prod',
      farmerName: currentUser?.name || 'Productor',
      programTitle: selectedProgram.title,
      entity: selectedProgram.entity,
      status: "Solicitud Recibida / En Revisión Técnica",
      scheduledDate: "Pendiente de Confirmación"
    };
    onRequestTraining(newReq);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-6xl mx-auto">
      <div className={`p-6 rounded-3xl border shadow-xl ${isDark ? 'bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border-indigo-800/50' : 'bg-gradient-to-br from-blue-900 via-indigo-950 to-purple-950 text-white border-indigo-900'}`}>
        <h3 className="text-2xl font-black text-white">Capacitaciones & Certificaciones Estatales</h3>
        <p className="text-xs sm:text-sm text-indigo-100/90 mt-1">Accede a programas de CONATRADEC, CETREX, MEFCCA y MIFIC para certificar tu café.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {STATE_TRAINING_PROGRAMS.map((prog) => (
          <div key={prog.id} className={`p-6 rounded-3xl border flex flex-col justify-between ${isDark ? 'bg-slate-900/90 border-indigo-950' : 'bg-white border-indigo-100'}`}>
            <div>
              <span className="text-xs font-bold text-cyan-400 block">{prog.entity}</span>
              <h4 className="text-base font-black text-slate-900 dark:text-white mt-1">{prog.title}</h4>
              <p className="text-xs text-slate-400 mt-2">{prog.description}</p>
            </div>
            <button
              type="button"
              onClick={() => handleOpen(prog)}
              className="mt-4 w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5"
            >
              <Send size={14} /> Solicitar Asistencia
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && selectedProgram && (
        <ModalWrapper isDark={isDark} onClose={() => setIsModalOpen(false)} title={`Solicitud • ${selectedProgram.entity}`}>
          <form onSubmit={handleConfirm} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Objetivo Técnico</label>
              <textarea
                required
                rows={3}
                value={goalText}
                onChange={e => setGoalText(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-sm ${isDark ? 'bg-slate-950 border-indigo-950 text-white' : 'bg-indigo-50/40 border-indigo-200 text-slate-900'}`}
              />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 rounded-xl text-xs font-semibold border border-indigo-950">Cancelar</button>
              <button type="submit" className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold">Enviar</button>
            </div>
          </form>
        </ModalWrapper>
      )}
    </div>
  );
};

const BatchFormModal = ({ isOpen, onClose, onSave, batchToEdit, producers, currentUser, isDark }) => {
  const [formData, setFormData] = useState({
    code: '',
    farmerId: '',
    variety: 'Maracaturra',
    process: 'Honey',
    score: 88.0,
    weight: 1000,
    priceUSD: 9.50,
    status: 'Disponible en Beneficio Seco'
  });

  useEffect(() => {
    if (isOpen) {
      if (batchToEdit) {
        setFormData({ ...batchToEdit });
      } else {
        setFormData({
          code: `NT-26-${Math.floor(Math.random()*900 + 100)}`,
          farmerId: currentUser?.id || producers[0]?.id || 'prod-1',
          variety: 'Maracaturra',
          process: 'Honey',
          score: 88.0,
          weight: 1000,
          priceUSD: 9.50,
          status: 'Disponible en Beneficio Seco'
        });
      }
    }
  }, [isOpen, batchToEdit, producers, currentUser]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <ModalWrapper isDark={isDark} onClose={onClose} title={batchToEdit ? 'Editar Lote' : 'Registrar Nuevo Lote'}>
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Código</label>
            <input
              required
              type="text"
              value={formData.code}
              onChange={e => setFormData({ ...formData, code: e.target.value })}
              className={`w-full p-2.5 rounded-xl border text-sm ${isDark ? 'bg-slate-950 border-indigo-950 text-white' : 'bg-indigo-50 border-indigo-200 text-slate-900'}`}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Variedad</label>
            <input
              required
              type="text"
              value={formData.variety}
              onChange={e => setFormData({ ...formData, variety: e.target.value })}
              className={`w-full p-2.5 rounded-xl border text-sm ${isDark ? 'bg-slate-950 border-indigo-950 text-white' : 'bg-indigo-50 border-indigo-200 text-slate-900'}`}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Peso (Kg)</label>
            <input
              required
              type="number"
              value={formData.weight}
              onChange={e => setFormData({ ...formData, weight: Number(e.target.value) })}
              className={`w-full p-2.5 rounded-xl border text-sm ${isDark ? 'bg-slate-950 border-indigo-950 text-white' : 'bg-indigo-50 border-indigo-200 text-slate-900'}`}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">SCA</label>
            <input
              required
              type="number"
              step="0.25"
              value={formData.score}
              onChange={e => setFormData({ ...formData, score: Number(e.target.value) })}
              className={`w-full p-2.5 rounded-xl border text-sm ${isDark ? 'bg-slate-950 border-indigo-950 text-white' : 'bg-indigo-50 border-indigo-200 text-slate-900'}`}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Precio ($/Kg)</label>
            <input
              required
              type="number"
              step="0.1"
              value={formData.priceUSD}
              onChange={e => setFormData({ ...formData, priceUSD: Number(e.target.value) })}
              className={`w-full p-2.5 rounded-xl border text-sm ${isDark ? 'bg-slate-950 border-indigo-950 text-white' : 'bg-indigo-50 border-indigo-200 text-slate-900'}`}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-xs font-semibold border border-indigo-950">Cancelar</button>
          <button type="submit" className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold">Guardar Lote</button>
        </div>
      </form>
    </ModalWrapper>
  );
};

const BuyerInquiryModal = ({ isOpen, onClose, batch, farmer, currentUser, currency, isDark, onSubmit }) => {
  const [requestedKg, setRequestedKg] = useState(69);

  if (!isOpen || !batch) return null;

  const totalUSD = (batch.priceUSD || 9.50) * requestedKg;

  const handleSend = (e) => {
    e.preventDefault();
    onSubmit({
      id: `inq-${Date.now()}`,
      batchId: batch.id,
      batchCode: batch.code,
      batchVariety: batch.variety,
      farmerId: batch.farmerId,
      buyerName: currentUser?.name || 'Comprador Internacional',
      roasteryName: currentUser?.companyName || 'Nordic Roasters',
      country: currentUser?.country || 'Alemania',
      quantityKg: requestedKg,
      totalUSD: totalUSD,
      status: 'Cotización Enviada / En Negociación'
    });
    onClose();
  };

  return (
    <ModalWrapper isDark={isDark} onClose={onClose} title={`Solicitar Muestra / Lote • ${batch.code}`}>
      <form onSubmit={handleSend} className="p-6 space-y-4">
        <div className={`p-4 rounded-2xl border text-xs space-y-1 ${isDark ? 'bg-slate-950 border-indigo-950' : 'bg-indigo-50 border-indigo-100'}`}>
          <p className="font-bold text-sm text-slate-900 dark:text-white">{batch.variety} ({batch.process})</p>
          <p className="text-slate-400">{farmer?.farmName} • {farmer?.department}</p>
          <p className="font-mono text-cyan-400 font-bold">{formatPrice(batch.priceUSD, currency)} / Kg</p>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Volumen Deseado (Kg)</label>
          <input
            required
            type="number"
            min="1"
            value={requestedKg}
            onChange={e => setRequestedKg(Number(e.target.value))}
            className={`w-full p-2.5 rounded-xl border text-sm ${isDark ? 'bg-slate-950 border-indigo-950 text-white' : 'bg-indigo-50 border-indigo-200 text-slate-900'}`}
          />
        </div>

        <div className="flex justify-between items-center text-sm font-bold">
          <span>Total Estimado:</span>
          <span className="font-mono text-cyan-400">{formatPrice(totalUSD, currency)}</span>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-xs font-semibold border border-indigo-950">Cancelar</button>
          <button type="submit" className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold">Confirmar Solicitud</button>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default function CoffeeTraceabilityApp() {
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState('marketplace');
  const [currency, setCurrency] = useState('USD');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [currentUser, setCurrentUser] = useState(null);
  const [authPortalRole, setAuthPortalRole] = useState('buyer');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProducerRegisterOpen, setIsProducerRegisterOpen] = useState(false);
  const [isBuyerRegisterOpen, setIsBuyerRegisterOpen] = useState(false);

  const [producers, setProducers] = useState(INITIAL_PRODUCERS);
  const [batches, setBatches] = useState(INITIAL_BATCHES);
  const [inquiries, setInquiries] = useState([]);
  const [trainingRequests, setTrainingRequests] = useState([]);
  const [toasts, setToasts] = useState([]);

  const [marketplaceSearch, setMarketplaceSearch] = useState('');
  const [batchSearch, setBatchSearch] = useState('');
  const [selectedBatchForInquiry, setSelectedBatchForInquiry] = useState(null);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [selectedTraceabilityBatch, setSelectedTraceabilityBatch] = useState(INITIAL_BATCHES[0]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  const handleRoleSwitch = (role) => {
    setAuthPortalRole(role);
    if (!currentUser) {
      if (role === 'buyer') setActiveTab('marketplace');
      else setActiveTab('farmers');
    }
  };

  const openAuthForRole = (role) => {
    setAuthPortalRole(role);
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    addToast(`Bienvenido(a), ${user.name}`);
    if (user.role === 'producer') {
      setActiveTab('dashboard');
    } else {
      setActiveTab('marketplace');
    }
  };

  const handleRegisterProducer = (newProd) => {
    setProducers(prev => [newProd, ...prev]);
    setCurrentUser(newProd);
    setActiveTab('dashboard');
    addToast(`¡Finca "${newProd.farmName}" publicada y verificada exitosamente!`);
  };

  const handleRegisterBuyer = (newBuyer) => {
    setCurrentUser(newBuyer);
    setActiveTab('marketplace');
    addToast(`¡Registro completado! Bienvenido ${newBuyer.name} (${newBuyer.companyName})`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('marketplace');
    addToast("Sesión cerrada correctamente");
  };

  const handleSaveBatch = (batchData) => {
    if (editingBatch) {
      setBatches(batches.map(b => b.id === batchData.id ? batchData : b));
      addToast("Lote actualizado con éxito");
    } else {
      setBatches([...batches, { ...batchData, id: `b-${Date.now()}` }]);
      addToast("Nuevo lote registrado");
    }
  };

  const handleDeleteBatch = (id) => {
    setBatches(batches.filter(b => b.id !== id));
    addToast("Lote eliminado");
  };

  const handleCreateInquiry = (inq) => {
    setInquiries([...inquiries, inq]);
    addToast("Solicitud de muestra enviada al caficultor");
  };

  const handleRequestTraining = (req) => {
    setTrainingRequests([...trainingRequests, req]);
    addToast("Solicitud de capacitación enviada con éxito");
  };

  const openInquiryForBatch = (batch) => {
    if (!currentUser) {
      openAuthForRole('buyer');
      return;
    }
    setSelectedBatchForInquiry(batch);
    setIsInquiryModalOpen(true);
  };

  const viewTraceability = (batch) => {
    setSelectedTraceabilityBatch(batch);
    setActiveTab('traceability');
  };

  const filteredBatches = useMemo(() => {
    return batches.filter(b => 
      b.code.toLowerCase().includes(batchSearch.toLowerCase()) ||
      b.variety.toLowerCase().includes(batchSearch.toLowerCase())
    );
  }, [batches, batchSearch]);

  const marketplaceBatches = useMemo(() => {
    return batches.filter(b => 
      b.variety.toLowerCase().includes(marketplaceSearch.toLowerCase()) ||
      b.process.toLowerCase().includes(marketplaceSearch.toLowerCase())
    );
  }, [batches, marketplaceSearch]);

  const totalKg = batches.reduce((acc, b) => acc + b.weight, 0);
  const totalQuintales = (totalKg / KG_PER_QUINTAL).toFixed(1);
  const totalNetProfitUSD = batches.reduce((acc, b) => acc + (b.weight * ((b.priceUSD || 9.50) - 2.80)), 0);
  const totalRealValuePremiumUSD = batches.reduce((acc, b) => acc + (b.weight * ((b.priceUSD || 9.50) - NY_BENCHMARK_PRICE_USD_KG)), 0);
  const avgScore = (batches.reduce((acc, b) => acc + b.score, 0) / (batches.length || 1)).toFixed(1);

  const processData = useMemo(() => {
    const counts = batches.reduce((acc, b) => {
      acc[b.process] = (acc[b.process] || 0) + b.weight;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [batches]);

  const profitByVarietyData = useMemo(() => {
    const counts = batches.reduce((acc, b) => {
      const profit = b.weight * ((b.priceUSD || 9.50) - 2.80);
      acc[b.variety] = (acc[b.variety] || 0) + profit;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ 
      name, 
      value: formatNumberCurrency(value, currency) 
    }));
  }, [batches, currency]);

  const COLORS = ['#38bdf8', '#6366f1', '#8b5cf6', '#a855f7', '#06b6d4', '#ec4899', '#f43f5e', '#10b981'];

  const navItems = useMemo(() => {
    if (!currentUser) {
      return [
        { id: 'marketplace', icon: ShoppingCart, label: 'Mercado de Cafés' },
        { id: 'nyExchange', icon: TrendingUp, label: 'Bolsa de NY (ICE)' },
        { id: 'regions', icon: Compass, label: 'Regiones Cafetaleras' },
        { id: 'traceability', icon: QrCode, label: 'Pasaporte de Trazabilidad' },
        { id: 'farmers', icon: Users, label: 'Directorio Cafetalero' }
      ];
    }
    if (currentUser.role === 'buyer') {
      return [
        { id: 'marketplace', icon: ShoppingCart, label: 'Mercado de Especialidad' },
        { id: 'nyExchange', icon: TrendingUp, label: 'Bolsa de NY (ICE)' },
        { id: 'traceability', icon: QrCode, label: 'Pasaporte de Trazabilidad' },
        { id: 'regions', icon: Compass, label: 'Regiones Cafetaleras' },
        { id: 'buyerOrders', icon: Inbox, label: 'Mis Solicitudes' }
      ];
    } else {
      return [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Panel de Rendimiento' },
        { id: 'nyExchange', icon: TrendingUp, label: 'Bolsa de NY (ICE)' },
        { id: 'batches', icon: Package, label: 'Mis Lotes Trazables' },
        { id: 'training', icon: GraduationCap, label: 'Capacitaciones Estatales' },
        { id: 'farmers', icon: Users, label: 'Directorio Cafetalero' },
        { id: 'traceability', icon: QrCode, label: 'Pasaporte de Trazabilidad' }
      ];
    }
  }, [currentUser]);

  return (
    <div className={`flex flex-col md:flex-row h-screen font-sans transition-colors duration-300 overflow-hidden ${isDark ? 'bg-[#0B0F19] text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* MOBILE TOP BAR */}
      <div className={`md:hidden flex items-center justify-between p-3.5 border-b z-30 shrink-0 ${isDark ? 'bg-slate-900/90 border-indigo-950 backdrop-blur-md' : 'bg-white border-indigo-100'}`}>
        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-200 border border-indigo-900/60"
            aria-label="Abrir menú"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-950 border border-indigo-900/60 flex items-center justify-center p-0.5 shadow-md shadow-indigo-600/20">
              <NicaTradeLogo size={28} />
            </div>
            <h1 className="text-base font-black tracking-tight leading-none text-slate-900 dark:text-white">
              Nica<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Trade</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentUser ? (
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-1.5 p-1 bg-slate-800 rounded-xl border border-indigo-900/50"
            >
              <img src={currentUser.avatar} alt={currentUser.name} className="w-7 h-7 rounded-lg object-cover" />
            </button>
          ) : (
            <button
              onClick={() => openAuthForRole(authPortalRole)}
              className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30"
            >
              <LogIn size={14} className="inline mr-1" /> Acceso
            </button>
          )}
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-md z-50 animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className={`w-72 max-w-[80vw] h-full flex flex-col p-4 shadow-2xl animate-in slide-in-from-left duration-300 ${isDark ? 'bg-slate-900 border-r border-indigo-950 text-white' : 'bg-white'}`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-indigo-950">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-950 border border-indigo-900/60 flex items-center justify-center p-0.5 shadow-md shadow-indigo-600/20">
                  <NicaTradeLogo size={32} />
                </div>
                <div>
                  <h2 className="text-base font-black leading-tight">Nica<span className="text-cyan-400">Trade</span></h2>
                  <p className="text-[9px] font-bold text-indigo-400 tracking-wider uppercase">Nicaragua Direct Coffee</p>
                </div>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="py-3">
              <div className={`p-1 rounded-xl flex border ${isDark ? 'bg-slate-950 border-indigo-950' : 'bg-indigo-50 border-indigo-200'}`}>
                <button
                  onClick={() => { handleRoleSwitch('buyer'); setMobileMenuOpen(false); }}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${(!currentUser && authPortalRole === 'buyer') || (currentUser?.role === 'buyer') ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'text-slate-400'}`}
                >
                  <ShoppingCart size={13} />
                  <span>Comprador</span>
                </button>
                <button
                  onClick={() => { handleRoleSwitch('producer'); setMobileMenuOpen(false); }}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${(!currentUser && authPortalRole === 'producer') || (currentUser?.role === 'producer') ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'text-slate-400'}`}
                >
                  <Building2 size={13} />
                  <span>Caficultor</span>
                </button>
              </div>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto py-2">
              {navItems.map(item => (
                <button 
                  key={item.id} 
                  onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }} 
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium ${activeTab === item.id ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                >
                  <item.icon size={18} className="shrink-0" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="pt-3 border-t border-indigo-950 space-y-2">
              {!currentUser && authPortalRole === 'producer' && (
                <button
                  onClick={() => { setMobileMenuOpen(false); setIsProducerRegisterOpen(true); }}
                  className="w-full py-2 px-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5"
                >
                  <Building2 size={14} /> Registrar Mi Finca en NicaTrade
                </button>
              )}

              {!currentUser && authPortalRole === 'buyer' && (
                <button
                  onClick={() => { setMobileMenuOpen(false); setIsBuyerRegisterOpen(true); }}
                  className="w-full py-2 px-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5"
                >
                  <UserPlus size={14} /> Registrarme en NicaTrade
                </button>
              )}

              {currentUser ? (
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-rose-400 bg-rose-950/40 border border-rose-900/60"
                >
                  <LogOut size={15} /> Cerrar Sesión
                </button>
              ) : (
                <button
                  onClick={() => { openAuthForRole(authPortalRole); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-white bg-indigo-950 border border-indigo-800"
                >
                  <LogIn size={15} /> Iniciar Sesión NicaTrade
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className={`hidden md:flex w-64 transition-all duration-300 flex-col fixed h-full z-20 border-r shadow-2xl ${isDark ? 'bg-slate-900/95 border-indigo-950 backdrop-blur-xl' : 'bg-white border-indigo-100'}`}>
        <div className="p-5 border-b border-indigo-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-slate-950/80 border border-indigo-800/60 flex items-center justify-center p-1 shadow-lg shadow-indigo-600/25">
              <NicaTradeLogo size={36} />
            </div>
            <div>
              <h1 className={`text-base font-black tracking-tight leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Nica<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Trade</span>
              </h1>
              <p className="text-[10px] font-bold tracking-wider uppercase text-cyan-400">Nicaragua Direct Trade</p>
            </div>
          </div>
        </div>

        <div className="px-3 pt-4">
          <div className={`p-1 rounded-xl flex border ${isDark ? 'bg-slate-950 border-indigo-950' : 'bg-indigo-50 border-indigo-200'}`}>
            <button
              onClick={() => handleRoleSwitch('buyer')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${(!currentUser && authPortalRole === 'buyer') || (currentUser?.role === 'buyer') ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'text-slate-400'}`}
            >
              <ShoppingCart size={13} />
              <span>Comprador</span>
            </button>
            <button
              onClick={() => handleRoleSwitch('producer')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${(!currentUser && authPortalRole === 'producer') || (currentUser?.role === 'producer') ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'text-slate-400'}`}
            >
              <Building2 size={13} />
              <span>Caficultor</span>
            </button>
          </div>
        </div>
        
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)} 
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${activeTab === item.id ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <item.icon size={19} className="shrink-0" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className={`p-4 border-t space-y-2 ${isDark ? 'border-indigo-950' : 'border-indigo-100'}`}>
          {!currentUser && authPortalRole === 'producer' && (
            <button
              onClick={() => setIsProducerRegisterOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-md shadow-indigo-600/30 hover:opacity-95"
            >
              <Building2 size={15} />
              <span>Registrar Mi Finca en NicaTrade</span>
            </button>
          )}

          {!currentUser && authPortalRole === 'buyer' && (
            <button
              onClick={() => setIsBuyerRegisterOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-md shadow-indigo-600/30 hover:opacity-95"
            >
              <UserPlus size={15} />
              <span>Registrarme en NicaTrade</span>
            </button>
          )}

          {currentUser ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-rose-400 bg-rose-950/40 border border-rose-900/60 hover:bg-rose-900/60 transition-colors"
            >
              <LogOut size={15} />
              <span>Cerrar Sesión</span>
            </button>
          ) : (
            <button
              onClick={() => openAuthForRole(authPortalRole)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-slate-300 bg-indigo-950 border border-indigo-800/80 hover:text-white transition-all"
            >
              <LogIn size={15} />
              <span>Iniciar Sesión NicaTrade</span>
            </button>
          )}

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span className="font-semibold">Tema visual</span>
            <button onClick={() => setIsDark(!isDark)} className="p-1.5 rounded-lg text-cyan-400 hover:bg-slate-800">
              {isDark ? <Sun size={16}/> : <Moon size={16}/>}
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 md:p-8 ml-0 md:ml-64 pb-24 md:pb-8 transition-all duration-300">
        
        {/* VIEW HEADER */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 md:mb-8 gap-3 sm:gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${!currentUser ? 'bg-slate-900 text-slate-300 border-indigo-950' : currentUser.role === 'buyer' ? 'bg-cyan-950/70 text-cyan-300 border-cyan-800' : 'bg-indigo-950/70 text-indigo-300 border-indigo-800'}`}>
                {!currentUser ? 'Modo Explorador NicaTrade' : currentUser.role === 'buyer' ? 'Comprador Internacional • NicaTrade' : 'Caficultor Certificado • NicaTrade'}
              </span>
              <span className="text-[11px] text-cyan-400 font-semibold">• NicaTrade Direct Trade Nicaragua</span>
            </div>
            <h2 className={`text-xl sm:text-2xl md:text-3xl font-black tracking-tight mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {activeTab === 'marketplace' ? 'Plataforma de trazabilidad NicaTrade' :
               activeTab === 'nyExchange' ? 'Bolsa de Valores de Nueva York (ICE Coffee C) • Monitor NicaTrade' :
               activeTab === 'dashboard' ? 'Panel de Rentabilidad & Cosecha • NicaTrade' : 
               activeTab === 'batches' ? 'Gestión de Lotes Trazables NicaTrade' : 
               activeTab === 'training' ? 'Capacitaciones & Certificaciones Estatales' :
               activeTab === 'regions' ? 'Regiones Cafetaleras de Nicaragua' :
               activeTab === 'farmers' ? 'Directorio de Productores de Nicaragua • NicaTrade' : 
               activeTab === 'buyerOrders' ? 'Mis Solicitudes y Cotizaciones' : 'Pasaporte Digital de Trazabilidad NicaTrade'}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!currentUser && authPortalRole === 'producer' && (
              <button
                onClick={() => setIsProducerRegisterOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/30"
              >
                <Building2 size={14} /> Registrar Mi Finca en NicaTrade
              </button>
            )}

            {!currentUser && authPortalRole === 'buyer' && (
              <button
                onClick={() => setIsBuyerRegisterOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/30"
              >
                <UserPlus size={14} /> Registrarme en NicaTrade
              </button>
            )}

            {currentUser ? (
              <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl border shadow-md ${isDark ? 'bg-slate-900 border-indigo-950' : 'bg-white border-indigo-200'}`}>
                <img 
                  src={currentUser.avatar || "https://images.unsplash.com/photo-1595858600863-7182ecf7b494?auto=format&fit=crop&w=300&q=80"} 
                  alt={currentUser.name} 
                  className="w-7 h-7 rounded-xl object-cover border border-cyan-400 shrink-0" 
                />
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[120px]">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-cyan-400 font-semibold truncate max-w-[120px]">
                    {currentUser.role === 'producer' ? currentUser.farmName : currentUser.companyName}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1 rounded-lg text-rose-400 hover:bg-rose-950/50 transition-colors ml-1"
                  title="Cerrar Sesión"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => openAuthForRole(authPortalRole)}
                  className="px-3 py-1.5 bg-indigo-950 border border-indigo-800 text-cyan-300 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                >
                  <LogIn size={14} /> Iniciar Sesión
                </button>
              </div>
            )}

            <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border shadow-sm ${isDark ? 'bg-slate-900 border-indigo-950' : 'bg-white border-indigo-100'}`}>
              <DollarSign size={14} className="text-cyan-400" />
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
                className={`text-xs font-bold bg-transparent focus:outline-none cursor-pointer ${isDark ? 'text-white' : 'text-slate-800'}`}
              >
                <option value="USD" className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>USD ($)</option>
                <option value="EUR" className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>EUR (€)</option>
                <option value="NIO" className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>NIO (C$)</option>
                <option value="GBP" className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>GBP (£)</option>
              </select>
            </div>
          </div>
        </header>

        {/* 1. MARKETPLACE */}
        {activeTab === 'marketplace' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className={`p-3.5 sm:p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${isDark ? 'bg-slate-900/90 border-indigo-950' : 'bg-white border-indigo-100'}`}>
              <div className="relative flex-1 w-full max-w-md">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Buscar por variedad (Maracaturra, Java...), proceso..." 
                  value={marketplaceSearch}
                  onChange={(e) => setMarketplaceSearch(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? 'bg-slate-950 border-indigo-950 text-white' : 'bg-indigo-50/40 border-indigo-200 text-slate-900'}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {marketplaceBatches.map(batch => {
                const farmer = producers.find(f => f.id === batch.farmerId);
                const altClass = getAltitudeClassification(farmer?.altitude || 1350);

                return (
                  <div key={batch.id} className={`rounded-2xl shadow-lg border overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-indigo-500/20 hover:border-indigo-500/60 ${isDark ? 'bg-slate-900/90 border-indigo-950' : 'bg-white border-indigo-100'}`}>
                    <div className="h-36 sm:h-40 bg-slate-950 relative overflow-hidden">
                      <img 
                        src={batch.batchImage || farmer?.farmImage || "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800"} 
                        alt={batch.variety} 
                        className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex items-end justify-between p-3.5 sm:p-4">
                        <span className="text-white font-mono text-xs font-bold drop-shadow-md">{batch.code}</span>
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-black px-2.5 py-0.5 rounded-lg shadow-md">
                          {batch.score} SCA
                        </span>
                      </div>
                    </div>

                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">
                            {batch.variety}
                          </h4>
                          <span className="text-[11px] font-bold text-cyan-300 bg-indigo-950 px-2 py-0.5 rounded-md border border-indigo-800 shrink-0">
                            {batch.process}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 flex items-center gap-1 font-medium truncate">
                          <Leaf size={12} className="text-indigo-400 shrink-0" /> {farmer?.farmName || 'Finca'} • {farmer?.name || 'Productor'}
                        </p>
                        
                        <div className="flex items-center gap-2 mt-2 text-xs">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${altClass.color}`}>
                            {farmer?.altitude || 1350} msnm
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {batch.tastingNotes?.map((note, i) => (
                            <span key={i} className="px-2 py-0.5 text-[11px] font-medium bg-slate-950 text-indigo-300 border border-indigo-900/80 rounded-md">
                              {note}
                            </span>
                          ))}
                        </div>

                        <div className={`mt-4 p-3 rounded-xl border flex items-center justify-between ${isDark ? 'bg-slate-950/60 border-indigo-950' : 'bg-indigo-50/40 border-indigo-100'}`}>
                          <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400">Precio Directo</p>
                            <p className="text-base sm:text-lg font-black text-cyan-400 font-mono">
                              {formatPrice(batch.priceUSD || 9.50, currency)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] uppercase font-bold text-slate-400">Volumen</p>
                            <p className="text-xs sm:text-sm font-bold text-slate-200">{batch.weight} Kg ({(batch.weight/KG_PER_QUINTAL).toFixed(1)} qq)</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-indigo-950 flex items-center gap-2">
                        <button 
                          onClick={() => viewTraceability(batch)} 
                          className={`p-2.5 rounded-xl border transition-colors ${isDark ? 'border-indigo-950 text-slate-300 hover:border-indigo-500' : 'border-indigo-100 text-slate-600'}`}
                          title="Ver Pasaporte de Trazabilidad"
                          aria-label="Ver Trazabilidad"
                        >
                          <QrCode size={18} className="text-cyan-400" />
                        </button>
                        <button 
                          onClick={() => openInquiryForBatch(batch)} 
                          className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/30"
                        >
                          <Send size={14} /> Solicitar Muestra
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. NY EXCHANGE */}
        {activeTab === 'nyExchange' && (
          <NYCoffeeExchangeView isDark={isDark} currency={currency} />
        )}

        {/* 3. PRODUCER DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
              <MetricCard isDark={isDark} title="Volumen Total de Cosecha" value={`${totalKg.toLocaleString()} Kg`} subtitle={`${totalQuintales} Quintales Oro`} icon={Package} />
              <MetricCard isDark={isDark} title="Ganancia Neta en Finca" value={formatPrice(totalNetProfitUSD, currency)} subtitle="Sin intermediarios abusivos" badgeText="Utilidad Directa" icon={CircleDollarSign} />
              <MetricCard isDark={isDark} title="Sobreprecio capturado vs NY" value={`+${formatPrice(totalRealValuePremiumUSD, currency)}`} subtitle="Por encima de bolsa" icon={TrendingUp} />
              <MetricCard isDark={isDark} title="Calidad Promedio SCA" value={avgScore} subtitle="Puntaje de Taza" icon={Award} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className={`p-4 sm:p-6 rounded-2xl border ${isDark ? 'bg-slate-900/90 border-indigo-950' : 'bg-white border-indigo-100'}`}>
                <h3 className="text-sm sm:text-base font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                  <Droplet className="text-cyan-400" size={18}/> Volumen por Proceso (Kg)
                </h3>
                <div className="h-64 sm:h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={processData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1e1b4b' : '#e0e7ff'} />
                      <XAxis dataKey="name" tick={{fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11}} />
                      <YAxis tick={{fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11}} />
                      <Tooltip contentStyle={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', borderColor: '#4f46e5', borderRadius: '12px' }} />
                      <Bar dataKey="value" name="Kg" fill="#6366f1" radius={[6, 6, 0, 0]}>
                        {processData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className={`p-4 sm:p-6 rounded-2xl border ${isDark ? 'bg-slate-900/90 border-indigo-950' : 'bg-white border-indigo-100'}`}>
                <h3 className="text-sm sm:text-base font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                  <BadgePercent className="text-indigo-400" size={18}/> Ganancia Estimada por Variedad ({currency})
                </h3>
                <div className="h-64 sm:h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={profitByVarietyData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                        {profitByVarietyData.map((_, index) => <Cell key={`cell-profit-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', borderColor: '#4f46e5', borderRadius: '12px' }} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. BATCHES */}
        {activeTab === 'batches' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className={`p-3.5 sm:p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${isDark ? 'bg-slate-900/90 border-indigo-950' : 'bg-white border-indigo-100'}`}>
              <div className="relative flex-1 w-full max-w-sm">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Buscar lote..." 
                  value={batchSearch}
                  onChange={(e) => setBatchSearch(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 text-sm rounded-xl border ${isDark ? 'bg-slate-950 border-indigo-950 text-white' : 'bg-indigo-50/40 border-indigo-200 text-slate-900'}`}
                />
              </div>
              <button 
                onClick={() => { setEditingBatch(null); setIsBatchModalOpen(true); }} 
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-600/30"
              >
                <Plus size={18} /> Registrar Lote
              </button>
            </div>

            <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-900/90 border-indigo-950' : 'bg-white border-indigo-100'}`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className={`text-xs font-bold uppercase ${isDark ? 'bg-slate-950 text-slate-400 border-b border-indigo-950' : 'bg-indigo-50/60 text-indigo-950'}`}>
                    <tr>
                      <th className="p-4">Código</th>
                      <th className="p-4">Variedad / Proceso</th>
                      <th className="p-4 text-right">Volumen</th>
                      <th className="p-4 text-right">Precio Directo</th>
                      <th className="p-4 text-center">SCA</th>
                      <th className="p-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y text-sm ${isDark ? 'divide-indigo-950 text-slate-300' : 'divide-indigo-50 text-slate-700'}`}>
                    {filteredBatches.map(batch => (
                      <tr key={batch.id} className="hover:bg-indigo-950/40">
                        <td className="p-4 font-mono font-bold text-cyan-400">{batch.code}</td>
                        <td className="p-4">
                          <p className="font-semibold">{batch.variety}</p>
                          <p className="text-xs text-slate-400">{batch.process}</p>
                        </td>
                        <td className="p-4 text-right font-semibold">{batch.weight} kg</td>
                        <td className="p-4 text-right font-mono font-bold text-cyan-400">{formatPrice(batch.priceUSD, currency)}</td>
                        <td className="p-4 text-center">
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">{batch.score}</span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-1">
                            <button onClick={() => viewTraceability(batch)} className="p-1.5 text-cyan-400" title="Ver Pasaporte"><QrCode size={18}/></button>
                            <button onClick={() => { setEditingBatch(batch); setIsBatchModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-indigo-400"><Pencil size={18}/></button>
                            <button onClick={() => handleDeleteBatch(batch.id)} className="p-1.5 text-slate-400 hover:text-rose-400"><Trash2 size={18}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 5. TRAINING */}
        {activeTab === 'training' && (
          <StateTrainingView 
            currentUser={currentUser} 
            trainingRequests={trainingRequests} 
            onRequestTraining={handleRequestTraining} 
            isDark={isDark} 
          />
        )}

        {/* 6. REGIONES CAFETALERAS */}
        {activeTab === 'regions' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 animate-in fade-in duration-300">
            {NICA_COFFEE_REGIONS.map((region) => (
              <div key={region.id} className={`rounded-2xl border overflow-hidden shadow-lg ${isDark ? 'bg-slate-900/90 border-indigo-950' : 'bg-white border-indigo-100'}`}>
                <div className="h-40 sm:h-44 relative bg-slate-950">
                  <img 
                    src={region.image} 
                    alt={region.name} 
                    className="w-full h-full object-cover opacity-75 hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-4 text-white">
                    <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">{region.department}</span>
                    <h4 className="text-base sm:text-lg font-black leading-tight">{region.name}</h4>
                  </div>
                </div>
                <div className="p-4 sm:p-5 space-y-2.5">
                  <p className="text-xs font-semibold text-indigo-400">{region.altitudeRange} • Cosecha: {region.harvestMonths}</p>
                  <p className="text-xs italic text-slate-300">"{region.cupProfile}"</p>
                  <p className="text-xs font-bold text-slate-200">{region.cupOfExcellenceRecord}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 7. FARMERS DIRECTORY (FULL 8 PRODUCERS) */}
        {activeTab === 'farmers' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <style>{MOBILE_SAFE_STYLES}</style>
            <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${isDark ? 'bg-slate-900/90 border-indigo-950' : 'bg-white border-indigo-100'}`}>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Directorio Nacional de Productores ({producers.length} Fincas Registradas)</h3>
                <p className="text-xs text-slate-400">Directo en origen desde Jinotega, Matagalpa, Nueva Segovia, Madriz y Estelí.</p>
              </div>
              {!currentUser && authPortalRole === 'producer' && (
                <button
                  type="button"
                  onClick={() => setIsProducerRegisterOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 touch-manipulation"
                >
                  <Building2 size={14} /> Registrar Mi Finca
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {producers.map(farmer => {
                const altClass = getAltitudeClassification(farmer.altitude);
                return (
                  <div key={farmer.id} className={`rounded-2xl border overflow-hidden p-4 sm:p-5 shadow-lg flex flex-col justify-between transition-all duration-300 hover:border-indigo-500/60 ${isDark ? 'bg-slate-900/90 border-indigo-950' : 'bg-white border-indigo-100'}`}>
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <img 
                          src={farmer.avatar} 
                          alt={farmer.name} 
                          className="w-12 h-12 rounded-xl object-cover border-2 border-indigo-500/50 bg-slate-800 shrink-0" 
                          onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(farmer.name)}&background=4f46e5&color=fff`; }}
                        />
                        <div className="truncate">
                          <h4 className="font-extrabold text-slate-900 dark:text-white text-sm truncate">{farmer.name}</h4>
                          <p className="text-xs text-indigo-400 font-bold truncate">{farmer.farmName}</p>
                          <span className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded border mt-0.5 ${altClass.color}`}>{farmer.altitude} msnm</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 mb-2">{farmer.municipality}, {farmer.department} • {farmer.manzanasCultivadas} Mz</p>
                      
                      <div className={`p-3 rounded-xl border text-xs space-y-1.5 ${isDark ? 'bg-slate-950/60 border-indigo-950' : 'bg-indigo-50/40 border-indigo-100'}`}>
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">Variedades:</span>
                          <span className="font-bold text-slate-200 text-xs block truncate">{farmer.varieties}</span>
                        </div>
                        {farmer.farmingType && (
                          <div className="pt-1 border-t border-indigo-950/60 flex items-center gap-1">
                            <Leaf size={11} className="text-cyan-400 shrink-0" />
                            <span className="text-[10px] text-cyan-300 font-semibold truncate">{farmer.farmingType}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center pt-1 border-t border-indigo-950/60">
                          <span className="text-slate-400 text-[10px] uppercase font-bold">Precio Meta:</span>
                          <span className="font-black text-cyan-400 font-mono text-sm">${farmer.targetPricePerKgUSD} / Kg</span>
                        </div>
                      </div>

                      {farmer.organolepticNotes && (
                        <p className="text-[11px] italic text-slate-400 mt-2 line-clamp-2">
                          "{farmer.organolepticNotes}"
                        </p>
                      )}
                    </div>

                    <div className="mt-3 pt-3 border-t border-indigo-950/80 flex items-center justify-between text-xs">
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const targetBatch = batches.find(b => b.farmerId === farmer.id) || batches[0];
                          viewTraceability(targetBatch);
                        }}
                        className="text-cyan-400 font-bold hover:underline flex items-center gap-1 text-[11px] touch-manipulation"
                      >
                        <MapPin size={12} /> Ver Ficha Satelital
                      </button>
                      <span className="text-[10px] text-purple-300 font-bold font-mono">
                        ~{farmer.estimatedHarvestQuintales} qq Oro
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 8. TRACEABILITY */}
        {activeTab === 'traceability' && selectedTraceabilityBatch && (() => {
          const batch = selectedTraceabilityBatch;
          const farmer = producers.find(f => f.id === batch.farmerId) || producers[0];
          return (
            <div className={`max-w-3xl mx-auto rounded-3xl border overflow-hidden p-5 sm:p-8 space-y-6 shadow-2xl ${isDark ? 'bg-slate-900/90 border-indigo-950' : 'bg-white border-indigo-100'}`}>
              <div className="border-b border-indigo-950 pb-4">
                <span className="px-3 py-1 bg-indigo-950 text-indigo-300 text-[11px] font-bold rounded-full border border-indigo-800">Certificado de Autenticidad: {batch.code}</span>
                <h2 className="text-xl sm:text-2xl font-black mt-2">{batch.variety} ({batch.process}) — {batch.score} SCA</h2>
                <p className="text-xs text-slate-400">{farmer.farmName} • {farmer.department}, Nicaragua</p>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between border-b border-indigo-950/60 pb-2">
                  <span className="text-slate-400">Productor / Dueño:</span>
                  <span className="font-bold">{farmer.name}</span>
                </div>
                <div className="flex justify-between border-b border-indigo-950/60 pb-2">
                  <span className="text-slate-400">Altitud:</span>
                  <span className="font-bold">{farmer.altitude} msnm</span>
                </div>
                <div className="flex justify-between border-b border-indigo-950/60 pb-2">
                  <span className="text-slate-400">Coordenadas GPS de Finca:</span>
                  <span className="font-mono text-cyan-400">{farmer.lat}, {farmer.lng}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Modalidad Comercial:</span>
                  <span className="font-bold text-cyan-400">Venta Directa en Origen</span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* 9. ORDERS */}
        {activeTab === 'buyerOrders' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className={`p-4 sm:p-5 rounded-2xl border ${isDark ? 'bg-slate-900/90 border-indigo-950' : 'bg-white border-indigo-100'}`}>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white mb-4">Mis Negociaciones Comerciales</h3>
              <div className="space-y-3">
                {inquiries.map((req) => (
                  <div key={req.id} className={`p-3.5 sm:p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isDark ? 'bg-slate-950/60 border-indigo-950' : 'bg-indigo-50/40 border-indigo-100'}`}>
                    <div>
                      <p className="font-bold text-sm">{req.batchCode} — {req.batchVariety}</p>
                      <p className="text-xs text-slate-400">{req.roasteryName} ({req.buyerName}) • {req.country}</p>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start">
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">{req.status}</span>
                      <p className="font-mono font-bold text-cyan-400 mt-1">{formatPrice(req.totalUSD, currency)}</p>
                    </div>
                  </div>
                ))}
                {inquiries.length === 0 && (
                  <p className="text-xs text-slate-400">No tienes solicitudes activas en este momento.</p>
                )}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t py-1.5 px-3 flex justify-around items-center backdrop-blur-xl ${isDark ? 'bg-slate-900/95 border-indigo-950 text-slate-400' : 'bg-white/95 border-indigo-100 text-slate-600'}`}>
        <button 
          type="button"
          onClick={(e) => { e.preventDefault(); setActiveTab('marketplace'); }}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all touch-manipulation ${activeTab === 'marketplace' ? 'text-cyan-400 font-bold' : ''}`}
        >
          <ShoppingCart size={18} />
          <span className="text-[10px]">Mercado</span>
        </button>

        <button 
          type="button"
          onClick={(e) => { e.preventDefault(); setActiveTab('nyExchange'); }}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all touch-manipulation ${activeTab === 'nyExchange' ? 'text-cyan-400 font-bold' : ''}`}
        >
          <TrendingUp size={18} />
          <span className="text-[10px]">Bolsa NY</span>
        </button>

        <button 
          type="button"
          onClick={(e) => { e.preventDefault(); setActiveTab('farmers'); }}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all touch-manipulation ${activeTab === 'farmers' ? 'text-cyan-400 font-bold' : ''}`}
        >
          <Users size={18} />
          <span className="text-[10px]">Directorio</span>
        </button>

        <button 
          type="button"
          onClick={(e) => { e.preventDefault(); currentUser ? setActiveTab('dashboard') : openAuthForRole(authPortalRole); }}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all touch-manipulation ${activeTab === 'dashboard' ? 'text-cyan-400 font-bold' : ''}`}
        >
          <User size={18} />
          <span className="text-[10px]">{currentUser ? 'Panel' : 'Entrar'}</span>
        </button>
      </div>

      {/* MODALS */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        isDark={isDark}
        onLoginSuccess={handleLoginSuccess}
        portalRole={authPortalRole}
        onOpenProducerRegister={() => setIsProducerRegisterOpen(true)}
        onOpenBuyerRegister={() => setIsBuyerRegisterOpen(true)}
      />

      <ProducerRegistrationModal
        isOpen={isProducerRegisterOpen}
        onClose={() => setIsProducerRegisterOpen(false)}
        onRegisterProducer={handleRegisterProducer}
        isDark={isDark}
      />

      <BuyerRegistrationModal
        isOpen={isBuyerRegisterOpen}
        onClose={() => setIsBuyerRegisterOpen(false)}
        onRegisterBuyer={handleRegisterBuyer}
        isDark={isDark}
      />

      <BatchFormModal 
        isOpen={isBatchModalOpen} 
        onClose={() => setIsBatchModalOpen(false)} 
        onSave={handleSaveBatch} 
        batchToEdit={editingBatch} 
        producers={producers}
        currentUser={currentUser}
        isDark={isDark} 
      />

      <BuyerInquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        batch={selectedBatchForInquiry}
        farmer={producers.find(f => f.id === selectedBatchForInquiry?.farmerId)}
        currentUser={currentUser}
        currency={currency}
        isDark={isDark}
        onSubmit={handleCreateInquiry}
      />
    </div>
  );
}
