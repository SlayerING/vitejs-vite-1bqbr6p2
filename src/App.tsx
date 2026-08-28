import React, { useState, useEffect, useMemo } from 'react';
import { 
  Coffee, 
  Leaf, 
  MapPin, 
  QrCode, 
  LayoutDashboard, 
  Users, 
  Package, 
  DollarSign, 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  Sun, 
  Moon, 
  Save, 
  XCircle, 
  CheckCircle, 
  AlertTriangle, 
  ChevronRight,
  Droplet,
  Truck,
  Award,
  BookOpen,
  Sparkles,
  Globe,
  ShoppingCart,
  Send,
  Building2,
  Calculator,
  Compass,
  Check,
  TrendingUp,
  Inbox,
  User,
  LogIn,
  LogOut,
  UserPlus,
  Edit3,
  ShieldCheck,
  GraduationCap,
  Calendar,
  CheckSquare,
  X,
  BadgePercent,
  CircleDollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  LineChart as LineChartIcon
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

const KG_PER_QUINTAL = 46;
const KG_PER_EXPORT_BAG = 69;
const NY_BENCHMARK_PRICE_USD_KG = 4.20; // Precio de referencia genérico bolsa NY (~$1.90/lb)
const LBS_PER_QUINTAL = 100; // 1 quintal = 100 lbs = 46 kg aprox

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
  if (altitude >= 1500) return { label: 'SHG+ (Estrictamente Altura Plus)', color: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800' };
  if (altitude >= 1350) return { label: 'SHG (Estrictamente Altura)', color: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800' };
  if (altitude >= 1200) return { label: 'HG (Altura)', color: 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/40 dark:text-teal-300 dark:border-teal-800' };
  return { label: 'Estándar', color: 'bg-stone-100 text-stone-800 border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700' };
};

const TRANSLATIONS = {
  es: {
    appName: "NicaTrade",
    appSubtitle: "Comercio Directo & Precio Real de Origen • Nicaragua 2026",
    roleProducer: "Portal Caficultor",
    roleBuyer: "Portal Comprador",
    buyerType: "Comprador / Tostaduría Internacional",
    producerType: "Productor / Dueño de Finca",
    navProducerDashboard: "Panel Financiero & Rendimiento",
    navBatches: "Gestión de Lotes & Precios",
    navNYExchange: "Bolsa de Nueva York (ICE Coffee 'C')",
    navCostCalculator: "Calculadora de Costos & Margen Neto",
    navProducerOrders: "Ofertas & Solicitudes Comerciales",
    navFarmers: "Directorio de Fincas",
    navMyProfile: "Mi Perfil de Finca & Costos",
    navInstitutional: "Ecosistema de Exportación (CONATRADEC / CETREX)",
    navTraining: "Capacitaciones & Certificaciones de Calidad",
    navMarketplace: "Mercado de Microlotes Verdes",
    navCuppingLab: "Laboratorio de Cata SCA",
    navExportCalc: "Cotizador FOB & Logística",
    navTraceability: "Pasaporte Digital de Autenticidad",
    navBuyerOrders: "Mis Muestras & Reservas",
    navTerroirs: "Terruños de Nicaragua",
    navBuyerProfile: "Mi Perfil de Tostaduría",
    totalVolume: "Volumen Total en Cosecha",
    netProfit: "Ganancia Neta Directa a Finca",
    valuePremium: "Sobreprecio Real vs Bolsa NY",
    avgScore: "Calidad Promedio SCA",
    processVolume: "Volumen por Proceso (Kg / qq)",
    profitabilityDist: "Utilidad Neta por Variedad / Lote",
    searchLotPlaceholder: "Buscar por lote, variedad, productor, región...",
    registerLot: "Registrar Nuevo Lote",
    lotCol: "Lote",
    originCol: "Productor & Finca",
    varietyCol: "Variedad / Proceso",
    volumeCol: "Stock Disponible",
    scoreCol: "SCA",
    priceCol: "Precio Real / Kg",
    statusCol: "Estado",
    actionsCol: "Acciones",
    requestSample: "Pedir Muestra Comercial (500g)",
    reserveLot: "Comprar / Reservar Lote",
    altitudeLabel: "Altitud",
    fairTradeBadge: "Venta Directa sin Intermediarios",
    tastingNotes: "Perfil en Taza",
    economicYield: "Rendimiento Financiero",
    satelliteMap: "Geolocalización Satelital Google Maps",
    chainOfCustody: "Cadena de Custodia & Trillado Verificado",
    calcTotal: "Total Comercial Estimado",
    sendRequest: "Enviar Oferta Directa al Productor",
    cancel: "Cancelar",
    save: "Guardar",
    producerDirectory: "Directorio de Productores & Fincas Nicas",
    producerDirectorySub: "Trato directo con los caficultores sin intermediarios opacos.",
    marketplaceTitle: "Mercado de Cafés de Especialidad de Nicaragua",
    currencyNotice: "Precios convertidos en tiempo real a",
    orderSentToast: "¡Propuesta comercial enviada directamente a la finca!",
    lotSavedToast: "Lote registrado con su estructura de precio y costo",
    lotDeletedToast: "Lote eliminado de la plataforma",
    farmerSavedToast: "Perfil y parámetros de rentabilidad actualizados",
    trainingRequestedToast: "¡Solicitud de capacitación enviada con éxito!",
    authLoginSuccess: "¡Sesión iniciada con éxito!",
    authRegisterSuccess: "¡Cuenta creada exitosamente!"
  },
  en: {
    appName: "NicaTrade",
    appSubtitle: "Direct Trade & Real Farmgate Pricing • Nicaragua 2026",
    roleProducer: "Grower Portal",
    roleBuyer: "Buyer Portal",
    buyerType: "Coffee Buyer / International Roaster",
    producerType: "Coffee Producer / Estate Owner",
    navProducerDashboard: "Financial Yield Dashboard",
    navBatches: "Batch & Pricing Management",
    navNYExchange: "NY Stock Exchange (ICE Coffee 'C')",
    navCostCalculator: "Cost & Net Margin Calculator",
    navProducerOrders: "Direct Trade Inquiries & Bookings",
    navFarmers: "Growers Directory",
    navMyProfile: "Farm Profile & Economics",
    navInstitutional: "Export Ecosystem (CONATRADEC / CETREX)",
    navTraining: "Quality Training & Certification Programs",
    navMarketplace: "Specialty Green Coffee Market",
    navCuppingLab: "SCA Digital Cupping Lab",
    navExportCalc: "FOB & Export Logistics Calc",
    navTraceability: "Digital Authenticity Passport",
    navBuyerOrders: "My Samples & Bookings",
    navTerroirs: "Nicaragua Terroirs",
    navBuyerProfile: "My Roastery Profile",
    totalVolume: "Total Harvest Volume",
    netProfit: "Net Direct Farm Profit",
    valuePremium: "Premium vs NY Commodity Base",
    avgScore: "Avg SCA Cupping Score",
    processVolume: "Volume by Process (Kg / qq)",
    profitabilityDist: "Net Profit by Variety / Lot",
    searchLotPlaceholder: "Search batch, variety, farmer, terroir...",
    registerLot: "Register New Batch",
    lotCol: "Batch ID",
    originCol: "Farmer & Farm",
    varietyCol: "Variety / Process",
    volumeCol: "Available Stock",
    scoreCol: "SCA Score",
    priceCol: "Real Price / Kg",
    statusCol: "Status",
    actionsCol: "Actions",
    requestSample: "Request Sample (500g)",
    reserveLot: "Book Full Lot",
    altitudeLabel: "Elevation",
    fairTradeBadge: "Direct Farmgate Trade",
    tastingNotes: "Cupping Descriptors",
    economicYield: "Economic Yield",
    satelliteMap: "Google Maps Satellite Positioning",
    chainOfCustody: "Chain of Custody & Verified Dry Mill",
    calcTotal: "Estimated Commercial Total",
    sendRequest: "Send Offer to Grower",
    cancel: "Cancel",
    save: "Save",
    producerDirectory: "Nicaraguan Coffee Producers Directory",
    producerDirectorySub: "Direct business with growers without intermediaries.",
    marketplaceTitle: "Nicaragua Specialty Green Coffee Marketplace",
    currencyNotice: "Prices converted in real-time to",
    orderSentToast: "Direct inquiry submitted successfully!",
    lotSavedToast: "Batch saved with cost & pricing structure",
    lotDeletedToast: "Batch removed from platform",
    farmerSavedToast: "Farm profile & financial parameters updated",
    trainingRequestedToast: "Training request submitted successfully!",
    authLoginSuccess: "Welcome back!",
    authRegisterSuccess: "Account registered successfully!"
  }
};

const STATE_TRAINING_PROGRAMS = [
  {
    id: "prog-conatradec-1",
    entity: "CONATRADEC",
    entityFullName: "Comisión Nacional para la Transformación y Desarrollo de la Caficultura",
    title: "Perfilado Sensorial SCA & Estrategias de Comercialización Taza de la Excelencia",
    category: "Calidad & Catación",
    duration: "40 Horas (Práctica en Laboratorio)",
    modality: "Presencial (Centro Tecnológico Sébaco / Matagalpa)",
    cost: "100% Gratuito (Subvencionado)",
    description: "Calibración de atributos organolépticos, detección de defectos físicos y sensoriales, perfiles de tueste y preparación para subastas internacionales de cafés especiales para maximizar precio por libra.",
    badge: "Oficial CONATRADEC",
    icon: Award
  },
  {
    id: "prog-cetrex-export",
    entity: "MIFIC / CETREX / CONATRADEC",
    entityFullName: "Ventanilla Única de Comercio Exterior & MIFIC",
    title: "Gestión de Exportación Directa (FOB Puerto Corinto) & Fijación de Precios Reales",
    category: "Comercio Exterior & Logística",
    duration: "25 Horas (Asesoría Comercial y Legal)",
    modality: "Virtual / Sesiones de Acompañamiento",
    cost: "100% Gratuito",
    description: "Trámites aduanales CETREX, emisión digital de certificados de origen OIC, negociación de contratos de compraventa internacional y liquidación directa sin intermediarios locales.",
    badge: "Comercio Exterior",
    icon: Truck
  },
  {
    id: "prog-mefcca-proc",
    entity: "MEFCCA / Economía Creativa",
    entityFullName: "Ministerio de Economía Familiar & Agroindustria",
    title: "Beneficiado Especial de Alto Valor: Procesos Honey, Anaeróbicos y Naturales",
    category: "Agroindustria & Procesamiento",
    duration: "25 Horas (Talleres Prácticos)",
    modality: "Presencial en Beneficio Húmedo Modelo",
    cost: "100% Gratuito",
    description: "Fermentaciones controladas con medición de grados Brix y pH para obtener perfiles exóticos de taza que alcanzan primas de hasta $15-$25/kg en mercados de especialidad.",
    badge: "Agroindustria",
    icon: Droplet
  }
];

const INITIAL_TRAINING_REQUESTS = [
  {
    id: "tr-001",
    farmerId: "u-prod-1",
    farmerName: "María Elena González",
    farmName: "Finca La Esperanza",
    programId: "prog-conatradec-1",
    programTitle: "Perfilado Sensorial SCA & Estrategias de Comercialización Taza de la Excelencia",
    entity: "CONATRADEC",
    department: "Jinotega",
    municipality: "San Rafael del Norte",
    participantsCount: 2,
    preferredModality: "Presencial (Centro Tecnológico Sébaco)",
    requestDate: "2026-08-15",
    assignedTechnician: "Ing. Carlos Mendoza (CONATRADEC Q-Grader)",
    status: "Capacitación Aprobada & Programada",
    scheduledDate: "2026-09-10",
    notes: "Meta: Calibrar microlotes Honey para fijar precio objetivo de US$12.50/Kg en venta directa."
  }
];

const NICA_TERROIRS = [
  {
    id: "terroir-ns",
    name: "Cordillera Dipilto - Jalapa",
    department: "Nueva Segovia",
    altitudeRange: "1,350 - 1,750 msnm",
    cupProfile: "Acidez cítrica vibrante, notas florales de jazmín, miel de abeja y cuerpo sedoso.",
    varieties: "Maracaturra, Caturra, Java Nica, Geisha",
    harvestMonths: "Diciembre - Marzo",
    cupOfExcellenceRecord: "Récord Taza de Excelencia 2026 (US$140/lb / US$14,000/qq)",
    image: "https://images.unsplash.com/photo-1524350876685-274059332603?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "terroir-jin",
    name: "Macizo de Peñas Blancas & Las Brumas",
    department: "Jinotega",
    altitudeRange: "1,200 - 1,600 msnm",
    cupProfile: "Notas a chocolate dulce, caramelo tostado, frutas rojas maduras y acidez málica.",
    varieties: "Caturra, Bourbon, Pacamara, Catuaí",
    harvestMonths: "Noviembre - Marzo",
    cupOfExcellenceRecord: "Mayor volumen de café SHG de alta especialidad en Nicaragua",
    image: "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "terroir-mat",
    name: "Serranías de San Ramón & El Tuma",
    department: "Matagalpa",
    altitudeRange: "1,100 - 1,500 msnm",
    cupProfile: "Cuerpo cremoso, fragancia avellanada, toques de panela y frutos secos.",
    varieties: "Pacamara, Catuaí, Maragogype",
    harvestMonths: "Noviembre - Febrero",
    cupOfExcellenceRecord: "Cuna de beneficiado seco y selección de microlotes de exportación",
    image: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&q=80&w=800"
  }
];

const DEMO_USERS = [
  {
    id: "u-prod-1",
    role: "producer",
    name: "María Elena González",
    email: "maria@fincaesperanza.ni",
    phone: "+505 8892-4100",
    farmName: "Finca La Esperanza",
    department: "Jinotega",
    municipality: "San Rafael del Norte",
    community: "Los Cedros",
    altitude: 1450,
    manzanasCultivadas: 14.5,
    estimatedHarvestQuintales: 260,
    costOfProductionPerQqUSD: 135.00,
    targetPricePerKgUSD: 9.80,
    varieties: "Maracaturra Gigante, Caturra, Java Nica",
    certifications: "Orgánico Biolatina, SHG Especialidad",
    organolepticNotes: "Acidez cítrica brillante de naranja dulce, fragancia a flor de café y miel de caña, cuerpo sedoso y prolongado.",
    netProfitEstimatedUSD: 48500,
    lat: 13.2125,
    lng: -86.1108,
    published: true,
    avatar: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80",
    farmImage: "https://images.unsplash.com/photo-1524350876685-274059332603?auto=format&fit=crop&w=1200"
  },
  {
    id: "u-prod-2",
    role: "producer",
    name: "Don José Tomás Pérez",
    email: "tomas@elsuspiro.ni",
    phone: "+505 8431-9022",
    farmName: "Finca El Suspiro",
    department: "Matagalpa",
    municipality: "San Ramón",
    community: "La Reina",
    altitude: 1250,
    manzanasCultivadas: 9.0,
    estimatedHarvestQuintales: 160,
    costOfProductionPerQqUSD: 128.00,
    targetPricePerKgUSD: 8.90,
    varieties: "Pacamara Supremo, Catuaí Rojo",
    certifications: "Rainforest Alliance, HG Especialidad",
    organolepticNotes: "Cuerpo cremoso y achocolatado, notas intensas a ciruela pasa, panela y acidez suave balanceada.",
    netProfitEstimatedUSD: 28400,
    lat: 12.9256,
    lng: -85.9189,
    published: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    farmImage: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=1200"
  },
  {
    id: "u-prod-3",
    role: "producer",
    name: "Roberto Castellón",
    email: "roberto@altosdelpino.ni",
    phone: "+505 8670-1122",
    farmName: "Finca Altos del Pino",
    department: "Nueva Segovia",
    municipality: "Dipilto",
    community: "Dipilto Viejo",
    altitude: 1620,
    manzanasCultivadas: 22.0,
    estimatedHarvestQuintales: 410,
    costOfProductionPerQqUSD: 145.00,
    targetPricePerKgUSD: 16.50,
    varieties: "Maracaturra, Java Nica, Geisha Nica",
    certifications: "Taza de la Excelencia 2026, Cero Deforestación EUDR",
    organolepticNotes: "Fragancia a jazmín y miel de abeja, notas a durazno blanco, bergamota y acidez cristalina sobresaliente.",
    netProfitEstimatedUSD: 122000,
    lat: 13.7250,
    lng: -86.5050,
    published: true,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    farmImage: "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?auto=format&fit=crop&w=1200"
  },
  {
    id: "u-buyer-1",
    role: "buyer",
    name: "Klaus Hoffmann",
    email: "klaus@hamburgroast.de",
    phone: "+49 40 1234 5678",
    companyName: "Nordic & Elbe Specialty Roasters",
    country: "Alemania",
    city: "Hamburgo",
    preferredCurrency: "EUR",
    annualVolumeBags: 60,
    targetSCARange: "86 - 89+ SCA",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "u-buyer-2",
    role: "buyer",
    name: "Sarah Jenkins",
    email: "sarah@pacificoastcoffee.com",
    phone: "+1 206 555 0199",
    companyName: "Pacific Coast Coffee Import",
    country: "EE.UU.",
    city: "Seattle",
    preferredCurrency: "USD",
    annualVolumeBags: 120,
    targetSCARange: "87 - 91+ SCA",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
  }
];

const INITIAL_BATCHES = [
  {
    id: "b1",
    code: "NIC-JIN-26-01",
    farmerId: "u-prod-1",
    variety: "Maracaturra Gigante",
    process: "Honey Amarillo",
    score: 88.5,
    weight: 920,
    priceUSD: 9.80,
    productionCostPerKgUSD: 2.93,
    status: "En Beneficio Seco (Sébaco)",
    harvestDate: "2026-02-15",
    moisturePercent: 11.2,
    screenSize: "18-19 Supremo",
    buyer: "Disponible",
    isCupOfExcellence: true,
    batchImage: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&q=80&w=800",
    tastingNotes: ["Miel de abeja", "Jazmín", "Naranja dulce", "Cacao fino"]
  },
  {
    id: "b2",
    code: "NIC-MAT-26-02",
    farmerId: "u-prod-2",
    variety: "Pacamara Supremo",
    process: "Natural Lento en Camas",
    score: 87.25,
    weight: 690,
    priceUSD: 8.90,
    productionCostPerKgUSD: 2.78,
    status: "En Finca (Secado en Camas)",
    harvestDate: "2026-03-02",
    moisturePercent: 11.4,
    screenSize: "19+ Jumbo",
    buyer: "Disponible",
    isCupOfExcellence: false,
    batchImage: "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?auto=format&fit=crop&q=80&w=800",
    tastingNotes: ["Ciruela madura", "Chocolate amargo", "Caramelo", "Panela"]
  },
  {
    id: "b3",
    code: "NIC-NS-26-COE",
    farmerId: "u-prod-3",
    variety: "Java Nica & Geisha",
    process: "Anaeróbico 72h",
    score: 90.75,
    weight: 460,
    priceUSD: 16.50,
    productionCostPerKgUSD: 3.15,
    status: "En Aduana / Puerto Corinto",
    harvestDate: "2026-01-28",
    moisturePercent: 10.8,
    screenSize: "18+ Selección",
    buyer: "Reserva Especial",
    isCupOfExcellence: true,
    batchImage: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800",
    tastingNotes: ["Flor de saúco", "Bergamota", "Durazno blanco", "Té negro"]
  }
];

const INITIAL_INQUIRIES = [
  {
    id: "req-101",
    batchCode: "NIC-JIN-26-01",
    batchVariety: "Maracaturra Gigante (Honey)",
    farmerId: "u-prod-1",
    farmerName: "María Elena González",
    buyerId: "u-buyer-1",
    buyerName: "Klaus Hoffmann",
    roasteryName: "Nordic & Elbe Specialty Roasters",
    country: "Alemania",
    email: "klaus@hamburgroast.de",
    inquiryType: "sample",
    kgAmount: 0.5,
    totalUSD: 35.00,
    currency: "EUR",
    date: "2026-08-20",
    status: "Muestra Aprobada & Despachada (DHL)"
  },
  {
    id: "req-102",
    batchCode: "NIC-NS-26-COE",
    batchVariety: "Java Nica & Geisha (Anaeróbico)",
    farmerId: "u-prod-3",
    farmerName: "Roberto Castellón",
    buyerId: "u-buyer-2",
    buyerName: "Sarah Jenkins",
    roasteryName: "Pacific Coast Coffee Import",
    country: "EE.UU.",
    email: "sarah@pacificoastcoffee.com",
    inquiryType: "reserve",
    kgAmount: 460,
    totalUSD: 7590.00,
    currency: "USD",
    date: "2026-08-25",
    status: "Pre-Contrato FOB Corinto Generado"
  }
];

const ToastContainer = ({ toasts, removeToast }) => (
  <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
    {toasts.map((toast) => (
      <div 
        key={toast.id} 
        className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-md animate-in slide-in-from-right-10 fade-in duration-300 ${
          toast.type === 'success' 
            ? 'bg-emerald-950/90 border-emerald-600 text-white shadow-emerald-950/40' 
            : 'bg-rose-950/90 border-rose-600 text-white shadow-rose-950/40'
        }`}
      >
        {toast.type === 'success' ? <CheckCircle size={18} className="text-emerald-400" /> : <AlertTriangle size={18} className="text-rose-400" />}
        <p className="text-xs font-bold leading-tight">{toast.message}</p>
        <button onClick={() => removeToast(toast.id)} className="opacity-60 hover:opacity-100 ml-2">
          <X size={14} />
        </button>
      </div>
    ))}
  </div>
);

const MetricCard = ({ title, value, subtitle, badgeText, icon: Icon, isDark }) => (
  <div className={`p-5 rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-md ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-emerald-100/60'}`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-stone-400">{title}</p>
        <h4 className="text-2xl font-black text-stone-900 dark:text-white font-mono mt-1">{value}</h4>
        {subtitle && <p className="text-[11px] text-stone-500 mt-1">{subtitle}</p>}
        {badgeText && (
          <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
            {badgeText}
          </span>
        )}
      </div>
      <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-900/20">
        <Icon size={22} />
      </div>
    </div>
  </div>
);

const ModalWrapper = ({ children, isDark, onClose, title, maxWidth = 'max-w-lg' }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
    <div className={`rounded-3xl shadow-2xl w-full ${maxWidth} overflow-hidden border my-8 animate-in fade-in zoom-in-95 duration-200 ${isDark ? 'bg-stone-900 border-stone-800 text-white' : 'bg-white border-stone-200 text-stone-800'}`}>
      <div className={`p-4 px-6 border-b flex justify-between items-center ${isDark ? 'border-stone-800 bg-stone-950' : 'border-stone-100 bg-stone-50/80'}`}>
        <h3 className="font-extrabold text-sm md:text-base flex items-center gap-2 text-stone-900 dark:text-white">{title}</h3>
        <button onClick={onClose} className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors">
          <XCircle size={20} />
        </button>
      </div>
      {children}
    </div>
  </div>
);

const NYCoffeeExchangeView = ({ isDark, currency }) => {
  const [timeframe, setTimeframe] = useState('6M');
  const [activeContractIndex, setActiveContractIndex] = useState(0);
  const [customDiffCents, setCustomDiffCents] = useState(30); // Diferencial Nicaragua SHG (+30¢/lb)
  const [simulatedScore, setSimulatedScore] = useState(88.5);

  const activeContract = ICE_FUTURES_CONTRACTS[activeContractIndex];
  const chartData = HISTORICAL_MARKET_TRENDS[timeframe] || HISTORICAL_MARKET_TRENDS['6M'];

  // Conversiones de la Bolsa de NY
  // 1 lb = 0.45359237 kg -> 1 kg = 2.20462 lbs
  const nyPricePerLbUSD = activeContract.priceCentsLb / 100;
  const nyPricePerQuintalUSD = nyPricePerLbUSD * 100; // 100 lbs oro
  const nyPricePerKgUSD = nyPricePerLbUSD * 2.20462;

  // Precio de café físico con Diferencial Comercial Tradicional
  const fobCommercialPerLbUSD = (activeContract.priceCentsLb + customDiffCents) / 100;
  const fobCommercialPerKgUSD = fobCommercialPerLbUSD * 2.20462;

  // Precio Directo NicaTrade Estimado según puntaje SCA
  const specialtyPricePerKgUSD = simulatedScore >= 90 ? 16.50 : simulatedScore >= 88 ? 9.80 : 8.50;
  const specialtyPricePerQuintalUSD = specialtyPricePerKgUSD * KG_PER_QUINTAL;
  const specialtyPricePerLbUSD = specialtyPricePerKgUSD / 2.20462;

  const extraValuePercentage = (((specialtyPricePerKgUSD - nyPricePerKgUSD) / nyPricePerKgUSD) * 100).toFixed(1);
  const dollarGainPerQuintal = (specialtyPricePerQuintalUSD - nyPricePerQuintalUSD);

  const marketDrivers = [
    { title: "Inventarios Certificados ICE", value: "820,410 Sacos", trend: "Bajos (-4.2%)", impact: "Presión alcista en cotizaciones mundiales" },
    { title: "Diferencial de Origen Nicaragua SHG", value: "+28.00 a +35.00 ¢/lb", trend: "Firme", impact: "Reconocimiento de calidad en taza de altura" },
    { title: "Tipo de Cambio Oficial BCN", value: "36.75 C$ / USD", trend: "Estable", impact: "Liquidación cambiaria sin devaluación abrupta" },
    { title: "Demanda de Microlotes SCA (87+)", value: "+22% Anual", trend: "En Crecimiento", impact: "Tostadores buscan relación directa con fincas" }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-6xl mx-auto">
      {/* Banner de Cabecera */}
      <div className={`p-6 rounded-3xl border shadow-sm relative overflow-hidden ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-gradient-to-br from-emerald-950 via-stone-900 to-teal-950 text-white border-emerald-950'}`}>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white flex items-center gap-1">
                <Activity size={12} className="animate-pulse" /> Cotización en Vivo • ICE Futures U.S. (Nueva York)
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-emerald-200 border border-white/20">
                Contrato "C" Arábica (KC)
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white">
              Bolsa de Valores de Nueva York & Monitor de Precios Reales
            </h3>
            <p className="text-xs md:text-sm text-emerald-100/80 leading-relaxed">
              Monitorea el contrato mundial de referencia <strong>ICE Coffee "C"</strong> y comprueba cómo el modelo de <strong>Comercio Directo de NicaTrade</strong> rompe con la trampa del precio genérico de bolsa para defender el valor real de tu café.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center shrink-0 min-w-[240px]">
            <p className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider">Contrato Activo NY: {activeContract.contract}</p>
            <div className="flex items-center justify-center gap-2 my-1">
              <span className="text-3xl font-black font-mono text-white">{activeContract.priceCentsLb.toFixed(2)}</span>
              <span className="text-sm font-bold text-emerald-300">¢/lb</span>
            </div>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
              <ArrowUpRight size={14} /> {activeContract.change > 0 ? `+${activeContract.change}` : activeContract.change} ¢/lb ({activeContract.changePct})
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Cotización por Unidades: lb, Quintal, Kg */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 rounded-2xl border shadow-sm ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'}`}>
          <p className="text-[10px] uppercase font-bold text-stone-400">Precio Bolsa NY por Libra</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-2xl font-black text-stone-900 dark:text-white font-mono">{activeContract.priceCentsLb.toFixed(2)} ¢</p>
            <span className="text-xs text-stone-500 font-mono">(${nyPricePerLbUSD.toFixed(2)} USD)</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Base Contrato "C" (Sin prima)</p>
        </div>

        <div className={`p-4 rounded-2xl border shadow-sm ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'}`}>
          <p className="text-[10px] uppercase font-bold text-stone-400">Precio Bolsa por Quintal Oro (100 lbs)</p>
          <p className="text-2xl font-black text-stone-900 dark:text-white font-mono mt-1">
            {formatPrice(nyPricePerQuintalUSD, currency)}
          </p>
          <p className="text-[11px] text-stone-500 mt-1">Valor de referencia internacional</p>
        </div>

        <div className={`p-4 rounded-2xl border shadow-sm ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'}`}>
          <p className="text-[10px] uppercase font-bold text-stone-400">Precio Bolsa por Kilogramo</p>
          <p className="text-2xl font-black text-stone-900 dark:text-white font-mono mt-1">
            {formatPrice(nyPricePerKgUSD, currency)} / Kg
          </p>
          <p className="text-[11px] text-stone-500 mt-1">Equivalente a 2.204 lbs</p>
        </div>

        <div className={`p-4 rounded-2xl border shadow-sm ${isDark ? 'bg-emerald-950/20 border-emerald-900/40' : 'bg-emerald-50 border-emerald-200'}`}>
          <p className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300">Precio Especialidad Direct Trade</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
            {formatPrice(specialtyPricePerKgUSD, currency)} / Kg
          </p>
          <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white">
            +{extraValuePercentage}% sobre Bolsa NY
          </span>
        </div>
      </div>

      {/* Selector de Contratos a Futuro */}
      <div className={`p-6 rounded-3xl border shadow-sm ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-stone-200 dark:border-stone-800">
          <div>
            <h4 className="text-base font-black text-stone-900 dark:text-white flex items-center gap-2">
              <LineChartIcon size={18} className="text-emerald-600" /> Curva de Contratos a Futuro ICE Coffee "C"
            </h4>
            <p className="text-xs text-stone-500">Haz clic en un contrato para calibrar los simuladores de precio y rentabilidad.</p>
          </div>
          <span className="text-[10px] font-bold uppercase px-3 py-1 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-xl">
            Horario ICE: 04:15 - 13:30 EST
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {ICE_FUTURES_CONTRACTS.map((contract, idx) => (
            <button
              key={contract.contract}
              type="button"
              onClick={() => setActiveContractIndex(idx)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${activeContractIndex === idx ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-[1.02]' : isDark ? 'bg-stone-800/60 border-stone-700 hover:border-emerald-600 text-stone-200' : 'bg-stone-50 border-stone-200 hover:border-emerald-600 text-stone-800'}`}
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold">{contract.contract}</span>
                <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${activeContractIndex === idx ? 'bg-white/20 text-white' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'}`}>
                  {contract.status}
                </span>
              </div>
              <p className={`text-xl font-black font-mono mt-1 ${activeContractIndex === idx ? 'text-white' : 'text-stone-900 dark:text-white'}`}>
                {contract.priceCentsLb.toFixed(2)} <span className="text-xs">¢/lb</span>
              </p>
              <div className="flex justify-between text-[11px] mt-1 opacity-90">
                <span>Rango: {contract.low} - {contract.high}</span>
                <span className={contract.change >= 0 ? (activeContractIndex === idx ? 'text-emerald-200' : 'text-emerald-600') : 'text-rose-400'}>
                  {contract.changePct}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Gráfico Histórico Comparativo */}
      <div className={`p-6 rounded-3xl border shadow-sm ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h4 className="text-base font-black text-stone-900 dark:text-white flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-600" /> Bolsa de NY Commodity ($/lb) vs. Precio Real Directo ($/kg)
            </h4>
            <p className="text-xs text-stone-500">Comportamiento histórico del mercado de futuros frente a la estabilidad del café de especialidad nicaragüense.</p>
          </div>

          <div className={`p-1 rounded-xl flex border self-start sm:self-auto ${isDark ? 'bg-stone-950 border-stone-800' : 'bg-stone-100 border-stone-200'}`}>
            {['1M', '6M', '1Y'].map(tf => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${timeframe === tf ? 'bg-emerald-600 text-white shadow-sm' : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'}`}
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
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorNY" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#333' : '#e5e7eb'} />
              <XAxis dataKey="date" tick={{ fill: isDark ? '#a8a29e' : '#6b7280', fontSize: 12 }} />
              <YAxis tick={{ fill: isDark ? '#a8a29e' : '#6b7280', fontSize: 12 }} domain={[0, 12]} />
              <Tooltip 
                formatter={(value, name) => [
                  `$${Number(value).toFixed(2)} USD`,
                  name === 'nicaTradePrice' ? 'NicaTrade Directo ($/Kg)' : 'Bolsa NY Contrato C ($/lb)'
                ]}
              />
              <Legend verticalAlign="top" height={36} />
              <Area type="monotone" dataKey="nicaTradePrice" name="NicaTrade Directo ($/Kg)" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorNicaTrade)" />
              <Area type="monotone" dataKey="nyCommodityPrice" name="Bolsa NY Contrato C ($/lb)" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorNY)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Simulador Interactivo de Diferencial de Calidad vs. Comercio Directo */}
      <div className={`p-6 rounded-3xl border shadow-sm ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'}`}>
        <h4 className="text-base font-black text-stone-900 dark:text-white flex items-center gap-2 mb-2">
          <Calculator size={18} className="text-emerald-600" /> Simulador de Liquidación Real: Bolsa NY + Diferencial vs. NicaTrade
        </h4>
        <p className="text-xs text-stone-500 mb-6">
          Compara lo que recibirías vendiendo como café comercial tradicional (Bolsa NY + Diferencial de exportador) frente a vender tu microlote directo en NicaTrade.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase text-stone-500 block mb-1">Diferencial Tradicional Nicaragua SHG (¢/lb)</label>
              <input
                type="number"
                value={customDiffCents}
                onChange={e => setCustomDiffCents(Number(e.target.value))}
                className={`w-full p-2.5 rounded-xl border text-sm font-bold ${isDark ? 'bg-stone-800 border-stone-700 text-white' : 'bg-stone-50 border-stone-200 text-stone-900'}`}
              />
              <span className="text-[10px] text-stone-400 block mt-1">Diferencial habitual en Puerto Corinto (+25¢ a +35¢)</span>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-stone-500 block mb-1">Calidad SCA de tu Microlote</label>
              <select
                value={simulatedScore}
                onChange={e => setSimulatedScore(Number(e.target.value))}
                className={`w-full p-2.5 rounded-xl border text-sm font-bold ${isDark ? 'bg-stone-800 border-stone-700 text-white' : 'bg-stone-50 border-stone-200 text-stone-900'}`}
              >
                <option value={86.5}>86.0 - 87.5 SCA (Especialidad Estándar ~ $8.50/Kg)</option>
                <option value={88.5}>88.0 - 89.5 SCA (Microlote Honey/Natural ~ $9.80/Kg)</option>
                <option value={90.5}>90.0+ SCA (Lote Presidencial / Taza de Excelencia ~ $16.50/Kg)</option>
              </select>
            </div>
          </div>

          <div className={`p-5 rounded-2xl border text-center flex flex-col justify-between ${isDark ? 'bg-stone-800/40 border-stone-800' : 'bg-stone-50 border-stone-200'}`}>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Venta Tradicional por Intermediario</span>
            <div className="my-3">
              <p className="text-xs text-stone-400 font-mono">Bolsa NY ({activeContract.priceCentsLb}¢) + Diff ({customDiffCents}¢)</p>
              <p className="text-2xl font-black font-mono text-stone-900 dark:text-white mt-1">
                {formatPrice(fobCommercialPerKgUSD, currency)} <span className="text-xs">/ Kg</span>
              </p>
              <p className="text-xs text-stone-500 mt-1">({formatPrice(fobCommercialPerLbUSD * 100, currency)} por quintal)</p>
            </div>
            <p className="text-[11px] text-rose-500 font-bold">Intermediario retiene el 30%-40% del valor final</p>
          </div>

          <div className={`p-5 rounded-2xl border text-center flex flex-col justify-between ${isDark ? 'bg-emerald-950/30 border-emerald-800/60' : 'bg-emerald-50 border-emerald-200'}`}>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">Venta Directa NicaTrade</span>
            <div className="my-3">
              <p className="text-xs text-emerald-600 font-mono">Calidad {simulatedScore} SCA Direct Trade</p>
              <p className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                {formatPrice(specialtyPricePerKgUSD, currency)} <span className="text-xs">/ Kg</span>
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">({formatPrice(specialtyPricePerQuintalUSD, currency)} por quintal)</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-black self-center">
              +{formatPrice(dollarGainPerQuintal, currency)} Ganancia Extra / qq
            </span>
          </div>
        </div>
      </div>

      {/* Factores Clave del Mercado Global */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {marketDrivers.map((driver, idx) => (
          <div key={idx} className={`p-4 rounded-2xl border ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'}`}>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              {driver.trend}
            </span>
            <h5 className="font-extrabold text-sm text-stone-900 dark:text-white mt-2">{driver.title}</h5>
            <p className="text-lg font-black font-mono text-emerald-600 mt-0.5">{driver.value}</p>
            <p className="text-xs text-stone-500 mt-1">{driver.impact}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const StateTrainingView = ({ currentUser, trainingRequests, onRequestTraining, isDark }) => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [filterCategory, setFilterCategory] = useState('Todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [requestForm, setRequestForm] = useState({
    participantsCount: 2,
    preferredModality: 'Presencial',
    specificGoal: 'Calibrar la cata SCA de nuestros microlotes para defender precios de especialidad por encima de los US$10/Kg.'
  });

  const categories = ['Todas', 'Calidad & Catación', 'Comercio Exterior & Logística', 'Agroindustria & Procesamiento'];

  const filteredPrograms = STATE_TRAINING_PROGRAMS.filter(prog => {
    return filterCategory === 'Todas' || prog.category === filterCategory;
  });

  const userRequests = trainingRequests.filter(req => req.farmerId === currentUser.id);

  const handleOpenRequest = (prog) => {
    setSelectedProgram(prog);
    setRequestForm({
      participantsCount: 2,
      preferredModality: 'Presencial en Centro Tecnológico',
      specificGoal: `Capacitarnos con ${prog.entity} para certificar la calidad de ${currentUser.farmName || 'la finca'} y negociar precios reales directamente con compradores internacionales.`
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!selectedProgram) return;

    const newRequest = {
      id: `tr-${Date.now()}`,
      farmerId: currentUser.id,
      farmerName: currentUser.name,
      farmName: currentUser.farmName || 'Mi Finca',
      programId: selectedProgram.id,
      programTitle: selectedProgram.title,
      entity: selectedProgram.entity,
      department: currentUser.department || 'Jinotega',
      municipality: currentUser.municipality || 'San Rafael del Norte',
      participantsCount: Number(requestForm.participantsCount) || 1,
      preferredModality: requestForm.preferredModality,
      requestDate: new Date().toISOString().split('T')[0],
      assignedTechnician: `Especialista de Calidad ${selectedProgram.entity}`,
      status: "Solicitud Recibida / En Revisión Técnica",
      scheduledDate: "Pendiente de Confirmación de Fecha",
      notes: requestForm.specificGoal
    };

    onRequestTraining(newRequest);
    setIsModalOpen(false);
  };

  const inputClass = `w-full p-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${isDark ? 'bg-stone-800 border-stone-700 text-white' : 'bg-stone-50 border-stone-200 text-stone-900'}`;
  const labelClass = `block text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-stone-400' : 'text-stone-600'}`;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-6xl mx-auto">
      <div className={`p-6 rounded-3xl border shadow-sm relative overflow-hidden ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-gradient-to-br from-emerald-950 via-teal-900 to-stone-900 text-white border-emerald-950'}`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500 text-white flex items-center gap-1">
                <GraduationCap size={12} /> Asistencia Técnica para Rentabilidad Cafetalera
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-emerald-200 backdrop-blur-md">
                CONATRADEC • MIFIC • CETREX
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white">
              Capacitación & Certificación de Calidad Comercial
            </h3>
            <p className="text-xs md:text-sm text-emerald-100/90 leading-relaxed">
              Accede a programas técnicos especializados para elevar el puntaje de cata de tus microlotes, obtener certificados de exportación y negociar contratos de venta directa al <strong>precio real de mercado</strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center shrink-0 space-y-1">
            <Award size={28} className="mx-auto text-emerald-300" />
            <p className="text-xs uppercase font-bold text-emerald-200">Finca Productora</p>
            <p className="text-base font-black text-white">{currentUser.farmName || 'Mi Finca'}</p>
            <p className="text-[10px] text-emerald-300/80">{currentUser.department || 'Nicaragua'}</p>
          </div>
        </div>
      </div>

      {userRequests.length > 0 && (
        <div className={`p-6 rounded-3xl border ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-emerald-100/80 shadow-sm'}`}>
          <h4 className="text-base font-black text-stone-900 dark:text-white flex items-center gap-2 mb-4">
            <CheckSquare size={18} className="text-emerald-600" /> Mis Solicitudes de Capacitación ({userRequests.length})
          </h4>
          <div className="space-y-3">
            {userRequests.map((req) => (
              <div key={req.id} className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${isDark ? 'bg-stone-800/40 border-stone-800' : 'bg-stone-50 border-stone-200'}`}>
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    {req.entity}
                  </span>
                  <h5 className="font-extrabold text-sm text-stone-900 dark:text-white mt-1">{req.programTitle}</h5>
                  <p className="text-xs text-stone-500 mt-0.5">Técnico: {req.assignedTechnician} • Modalidad: {req.preferredModality}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300">
                    {req.status}
                  </span>
                  <p className="text-xs font-mono font-bold text-stone-400 mt-1">{req.scheduledDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredPrograms.map((prog) => (
          <div key={prog.id} className={`p-6 rounded-3xl border flex flex-col justify-between ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'}`}>
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                  <prog.icon size={22} />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  {prog.badge}
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-600 block">{prog.entityFullName}</span>
              <h4 className="text-base font-black text-stone-900 dark:text-white mt-1">{prog.title}</h4>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">{prog.description}</p>
              
              <div className={`mt-4 p-3 rounded-xl border text-xs space-y-1 ${isDark ? 'bg-stone-800/40 border-stone-800' : 'bg-stone-50 border-stone-100'}`}>
                <div className="flex justify-between"><span className="text-stone-400">Duración:</span><span className="font-bold">{prog.duration}</span></div>
                <div className="flex justify-between"><span className="text-stone-400">Costo:</span><span className="font-bold text-emerald-600">{prog.cost}</span></div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-800 flex justify-end">
              <button
                type="button"
                onClick={() => handleOpenRequest(prog)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5"
              >
                <Send size={14} /> Solicitar Asistencia
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && selectedProgram && (
        <ModalWrapper
          isDark={isDark}
          onClose={() => setIsModalOpen(false)}
          title={`Solicitud Técnica • ${selectedProgram.entity}`}
        >
          <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
            <div>
              <label className={labelClass}>Objetivo Comercial / Meta de Rentabilidad de la Finca</label>
              <textarea
                required
                rows={3}
                value={requestForm.specificGoal}
                onChange={e => setRequestForm({ ...requestForm, specificGoal: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 rounded-xl text-xs font-semibold border">
                Cancelar
              </button>
              <button type="submit" className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">
                <Send size={15} /> Confirmar Solicitud
              </button>
            </div>
          </form>
        </ModalWrapper>
      )}
    </div>
  );
};

const InstitutionalEcosystemView = ({ isDark }) => {
  const actors = [
    {
      name: "CONATRADEC",
      badge: "Rector Cafetalero",
      role: "Comisión Nacional para la Transformación y Desarrollo de la Caficultura",
      icon: Award,
      impact: "Organización de la Taza de la Excelencia Nicaragua 2026 (Récord US$140/lb).",
      actions: ["Certificación oficial de calidad de exportación", "Promoción directa ante compradores de 19 países"]
    },
    {
      name: "CETREX & Ventanilla Única",
      badge: "Comercio Exterior",
      role: "Centro de Trámites de las Exportaciones",
      icon: Truck,
      impact: "Agilidad en emisión de certificados de origen OIC y despacho aduanal sin trabas burocráticas.",
      actions: ["Certificado de origen digital", "Inspección y precintado directo hacia Puerto Corinto"]
    },
    {
      name: "Beneficios Secos (Sébaco/Matagalpa)",
      badge: "Agroindustria",
      role: "Trillado, Selección Óptica y Ensacado GrainPro",
      icon: Droplet,
      impact: "Preservación estricta de la segregación de microlotes y control de humedad (10.5%-11.5%).",
      actions: ["Trillado por lote individual", "Clasificación por malla (18+) y empaque hermético"]
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto">
      <div className={`p-6 rounded-3xl border ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-emerald-100/70 shadow-sm'}`}>
        <h3 className="text-xl font-black text-stone-900 dark:text-white flex items-center gap-2">
          <Truck className="text-emerald-600" size={22} /> Ecosistema de Exportación Directa & Valor Agregado
        </h3>
        <p className="text-xs text-stone-500 mt-1">
          Articulación logística y comercial para que el 100% del valor pactado en el contrato llegue directamente a la cuenta del caficultor.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {actors.map((actor, idx) => (
          <div key={idx} className={`p-6 rounded-3xl border flex flex-col justify-between ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'}`}>
            <div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 rounded-2xl w-fit mb-3">
                <actor.icon size={22} />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                {actor.badge}
              </span>
              <h4 className="text-base font-black text-stone-900 dark:text-white mt-2">{actor.name}</h4>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-2">{actor.impact}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 space-y-1">
              {actor.actions.map((act, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-stone-500">
                  <Check size={12} className="text-emerald-600 shrink-0" />
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AuthModal = ({ isOpen, onClose, isDark, onLoginSuccess, portalRole = 'producer' }) => {
  const [authMode, setAuthMode] = useState('login');
  const [producerStep, setProducerStep] = useState(1);
  const [loginEmail, setLoginEmail] = useState('');
  
  const [prodForm, setProdForm] = useState({
    name: '',
    email: '',
    phone: '',
    farmName: '',
    department: 'Jinotega',
    municipality: 'San Rafael del Norte',
    altitude: 1420,
    manzanasCultivadas: 12.0,
    estimatedHarvestQuintales: 220,
    costOfProductionPerQqUSD: 130.00,
    targetPricePerKgUSD: 9.50,
    varieties: 'Maracaturra, Caturra, Java Nica',
    certifications: 'Orgánico Biolatina, SHG Especialidad',
    organolepticNotes: 'Acidez cítrica brillante, fragancia a jazmín y miel de abeja, notas a chocolate fino y cuerpo prolongado.',
    lat: 13.2125,
    lng: -86.1108
  });

  const [buyerForm, setBuyerForm] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    country: 'Alemania',
    city: 'Hamburgo',
    preferredCurrency: 'EUR',
    annualVolumeBags: 50,
    targetSCARange: '86 - 89+ SCA'
  });

  if (!isOpen) return null;

  const handleQuickDemoLogin = (user) => {
    onLoginSuccess(user);
    onClose();
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const existing = DEMO_USERS.find(u => u.email.toLowerCase() === loginEmail.toLowerCase() && u.role === portalRole);
    if (existing) {
      onLoginSuccess(existing);
    } else {
      const newUser = {
        id: `u-${Date.now()}`,
        role: portalRole,
        email: loginEmail,
        name: loginEmail.split('@')[0],
        farmName: portalRole === 'producer' ? 'Finca Santa Lucía' : undefined,
        companyName: portalRole === 'buyer' ? 'Direct Roastery' : undefined,
        department: 'Jinotega',
        altitude: 1350,
        costOfProductionPerQqUSD: 130.00,
        targetPricePerKgUSD: 9.00,
        netProfitEstimatedUSD: 35000,
        lat: 13.0918,
        lng: -85.9995,
        published: true,
        avatar: portalRole === 'producer' 
          ? "https://images.unsplash.com/photo-1595858600863-7182ecf7b494?auto=format&fit=crop&w=300&q=80" 
          : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
      };
      onLoginSuccess(newUser);
    }
    onClose();
  };

  const handlePublishProducerProfile = () => {
    const totalKg = (Number(prodForm.estimatedHarvestQuintales) || 100) * KG_PER_QUINTAL;
    const grossIncome = totalKg * (Number(prodForm.targetPricePerKgUSD) || 9.00);
    const totalCost = (Number(prodForm.estimatedHarvestQuintales) || 100) * (Number(prodForm.costOfProductionPerQqUSD) || 130.00);
    const calculatedProfit = Math.max(0, grossIncome - totalCost);

    const newProducer = {
      id: `u-prod-${Date.now()}`,
      role: 'producer',
      ...prodForm,
      lat: Number(prodForm.lat) || 13.0918,
      lng: Number(prodForm.lng) || -85.9995,
      manzanasCultivadas: Number(prodForm.manzanasCultivadas) || 1,
      altitude: Number(prodForm.altitude) || 1200,
      estimatedHarvestQuintales: Number(prodForm.estimatedHarvestQuintales) || 180,
      costOfProductionPerQqUSD: Number(prodForm.costOfProductionPerQqUSD) || 130,
      targetPricePerKgUSD: Number(prodForm.targetPricePerKgUSD) || 9.50,
      netProfitEstimatedUSD: calculatedProfit,
      published: true,
      avatar: "https://images.unsplash.com/photo-1595858600863-7182ecf7b494?auto=format&fit=crop&w=300&q=80",
      farmImage: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=1000"
    };
    onLoginSuccess(newProducer, true);
    onClose();
  };

  const handleRegisterBuyer = (e) => {
    e.preventDefault();
    const newBuyer = {
      id: `u-buyer-${Date.now()}`,
      role: 'buyer',
      ...buyerForm,
      annualVolumeBags: Number(buyerForm.annualVolumeBags) || 10,
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80"
    };
    onLoginSuccess(newBuyer, true);
    onClose();
  };

  const inputClass = `w-full p-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${isDark ? 'bg-stone-800 border-stone-700 text-white' : 'bg-stone-50 border-stone-200 text-stone-900'}`;
  const labelClass = `block text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-stone-400' : 'text-stone-600'}`;
  const altClass = getAltitudeClassification(Number(prodForm.altitude) || 1200);

  const modalTitle = portalRole === 'producer'
    ? (authMode === 'login' ? 'Acceso al Portal Caficultor' : 'Registro de Finca & Publicación de Lotes')
    : (authMode === 'login' ? 'Acceso al Portal de Compradores' : 'Registrarme como Comprador');

  const filteredDemoUsers = DEMO_USERS.filter(u => u.role === portalRole);

  return (
    <ModalWrapper 
      isDark={isDark} 
      onClose={onClose} 
      title={modalTitle} 
      maxWidth={authMode === 'register' && portalRole === 'producer' ? 'max-w-3xl' : 'max-w-lg'}
    >
      <div className="p-6 space-y-5 max-h-[84vh] overflow-y-auto">
        <div className={`p-1 rounded-xl flex border ${isDark ? 'bg-stone-950 border-stone-800' : 'bg-stone-100 border-stone-200'}`}>
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${authMode === 'login' ? 'bg-emerald-600 text-white shadow-sm' : 'text-stone-500'}`}
          >
            <LogIn size={14} /> Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('register')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${authMode === 'register' ? 'bg-emerald-600 text-white shadow-sm' : 'text-stone-500'}`}
          >
            <UserPlus size={14} /> {portalRole === 'producer' ? 'Registrar Mi Finca' : 'Registrarme'}
          </button>
        </div>

        {authMode === 'login' && (
          <div className="space-y-4">
            <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-emerald-950/20 border-emerald-900/40' : 'bg-emerald-50/70 border-emerald-200'}`}>
              <p className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles size={14} /> Cuentas Demo Rápidas:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredDemoUsers.map(user => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleQuickDemoLogin(user)}
                    className={`p-2 rounded-lg text-left text-xs border transition-all flex items-center gap-2 hover:scale-[1.02] ${isDark ? 'bg-stone-900 border-stone-800 hover:border-emerald-600 text-stone-200' : 'bg-white border-stone-200 hover:border-emerald-600 text-stone-800'}`}
                  >
                    <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                    <div className="overflow-hidden">
                      <p className="font-bold truncate text-[11px]">{user.name}</p>
                      <p className="text-[10px] text-stone-500 truncate">
                        {user.role === 'producer' ? `🌱 ${user.farmName}` : `☕ ${user.companyName}`}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className={labelClass}>Correo Electrónico</label>
                <input
                  required
                  type="email"
                  placeholder={portalRole === 'producer' ? "ejemplo@fincaesperanza.ni" : "compras@roastery.com"}
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <LogIn size={16} /> Entrar al Panel
              </button>
            </form>
          </div>
        )}

        {authMode === 'register' && portalRole === 'producer' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {[
                { step: 1, label: '1. Datos & Costos', icon: Leaf },
                { step: 2, label: '2. Ubicación GPS', icon: MapPin },
                { step: 3, label: '3. Consolidación', icon: Check }
              ].map((s) => (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => setProducerStep(s.step)}
                  className={`p-2.5 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${producerStep === s.step ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-stone-100 dark:bg-stone-800 text-stone-500'}`}
                >
                  <s.icon size={13} /> {s.label}
                </button>
              ))}
            </div>

            {producerStep === 1 && (
              <div className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Nombre de la Finca *</label>
                    <input
                      required
                      type="text"
                      placeholder="Ej. Finca La Esperanza"
                      value={prodForm.farmName}
                      onChange={e => setProdForm({ ...prodForm, farmName: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Nombre del Productor(a) *</label>
                    <input
                      required
                      type="text"
                      placeholder="Ej. María Elena González"
                      value={prodForm.name}
                      onChange={e => setProdForm({ ...prodForm, name: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Altura (msnm) *</label>
                    <input
                      required
                      type="number"
                      min="600"
                      max="2200"
                      value={prodForm.altitude}
                      onChange={e => setProdForm({ ...prodForm, altitude: Number(e.target.value) })}
                      className={inputClass}
                    />
                    <span className="text-[10px] text-emerald-600 font-bold block mt-1">{altClass.label}</span>
                  </div>
                  <div>
                    <label className={labelClass}>Variedades Sembradas *</label>
                    <input
                      required
                      type="text"
                      placeholder="Ej. Maracaturra, Java Nica, Pacamara"
                      value={prodForm.varieties}
                      onChange={e => setProdForm({ ...prodForm, varieties: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className={labelClass}>Cosecha Est. (qq Oro)</label>
                    <input
                      required
                      type="number"
                      min="1"
                      value={prodForm.estimatedHarvestQuintales}
                      onChange={e => setProdForm({ ...prodForm, estimatedHarvestQuintales: Number(e.target.value) })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Costo Producción ($/qq)</label>
                    <input
                      required
                      type="number"
                      min="1"
                      value={prodForm.costOfProductionPerQqUSD}
                      onChange={e => setProdForm({ ...prodForm, costOfProductionPerQqUSD: Number(e.target.value) })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Precio Objetivo ($/Kg)</label>
                    <input
                      required
                      type="number"
                      step="0.2"
                      value={prodForm.targetPricePerKgUSD}
                      onChange={e => setProdForm({ ...prodForm, targetPricePerKgUSD: Number(e.target.value) })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Perfil Sensorial Organoléptico (Notas en Taza) *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Describa aroma, acidez, notas frutales o achocolatadas..."
                    value={prodForm.organolepticNotes}
                    onChange={e => setProdForm({ ...prodForm, organolepticNotes: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setProducerStep(2)}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  Continuar a Ubicación GPS <ChevronRight size={16} />
                </button>
              </div>
            )}

            {producerStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Latitud (°N)</label>
                    <input
                      required
                      type="number"
                      step="0.0001"
                      value={prodForm.lat}
                      onChange={e => setProdForm({ ...prodForm, lat: Number(e.target.value) })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Longitud (°O)</label>
                    <input
                      required
                      type="number"
                      step="0.0001"
                      value={prodForm.lng}
                      onChange={e => setProdForm({ ...prodForm, lng: Number(e.target.value) })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setProducerStep(1)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-semibold border"
                  >
                    Volver
                  </button>
                  <button
                    type="button"
                    onClick={() => setProducerStep(3)}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                  >
                    Ir a Consolidación
                  </button>
                </div>
              </div>
            )}

            {producerStep === 3 && (
              <div className="space-y-4">
                <div className={`p-4 rounded-2xl border space-y-2 text-xs ${isDark ? 'bg-stone-800/40 border-stone-800' : 'bg-stone-50 border-stone-200'}`}>
                  <h4 className="font-bold text-sm text-stone-900 dark:text-white">{prodForm.farmName}</h4>
                  <p><strong>Productor:</strong> {prodForm.name}</p>
                  <p><strong>Altura:</strong> {prodForm.altitude} msnm ({altClass.label})</p>
                  <p><strong>Cosecha Estimada:</strong> {prodForm.estimatedHarvestQuintales} qq Oro ({(prodForm.estimatedHarvestQuintales * KG_PER_QUINTAL).toLocaleString()} Kg)</p>
                  <p><strong>Precio Objetivo:</strong> ${prodForm.targetPricePerKgUSD} / Kg</p>
                  <p><strong>Ganancia Proyectada:</strong> ${Math.max(0, (prodForm.estimatedHarvestQuintales * KG_PER_QUINTAL * prodForm.targetPricePerKgUSD) - (prodForm.estimatedHarvestQuintales * prodForm.costOfProductionPerQqUSD)).toLocaleString()} USD</p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setProducerStep(2)}
                    className="flex-1 py-3 rounded-xl text-xs font-semibold border"
                  >
                    Ajustar
                  </button>
                  <button
                    type="button"
                    onClick={handlePublishProducerProfile}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <Check size={16} /> Publicar Ficha Comercial
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {authMode === 'register' && portalRole === 'buyer' && (
          <form onSubmit={handleRegisterBuyer} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Nombre de Contacto *</label>
                <input
                  required
                  type="text"
                  placeholder="Ej. Alex Smith"
                  value={buyerForm.name}
                  onChange={e => setBuyerForm({ ...buyerForm, name: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Empresa / Tostaduría *</label>
                <input
                  required
                  type="text"
                  placeholder="Ej. Nordic Specialty Roasters"
                  value={buyerForm.companyName}
                  onChange={e => setBuyerForm({ ...buyerForm, companyName: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>País de Destino *</label>
                <input
                  required
                  type="text"
                  placeholder="Ej. Alemania"
                  value={buyerForm.country}
                  onChange={e => setBuyerForm({ ...buyerForm, country: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Moneda Preferida</label>
                <select
                  value={buyerForm.preferredCurrency}
                  onChange={e => setBuyerForm({ ...buyerForm, preferredCurrency: e.target.value })}
                  className={inputClass}
                >
                  <option value="EUR">EUR (€ Euro)</option>
                  <option value="USD">USD ($ Dólar)</option>
                  <option value="GBP">GBP (£ Libra)</option>
                  <option value="NIO">NIO (C$ Córdoba)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <Save size={16} /> Registrarme como Comprador
            </button>
          </form>
        )}
      </div>
    </ModalWrapper>
  );
};

const MyFarmProfileView = ({ currentUser, onUpdateProfile, isDark, currency }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...currentUser });

  useEffect(() => {
    setFormData({ ...currentUser });
  }, [currentUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateProfile({ ...formData, published: true });
    setIsEditing(false);
  };

  const inputClass = `w-full p-2.5 border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 ${isDark ? 'bg-stone-800 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`;
  const labelClass = `block text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-stone-400' : 'text-stone-600'}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto">
      <div className={`rounded-3xl border overflow-hidden shadow-sm ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'}`}>
        <div className="h-44 relative bg-stone-900">
          <img
            src={currentUser.farmImage || "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=1200"}
            alt="Finca"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent flex items-end justify-between p-6">
            <div className="flex items-center gap-4">
              <img
                src={currentUser.avatar || "https://images.unsplash.com/photo-1595858600863-7182ecf7b494?auto=format&fit=crop&w=300&q=80"}
                alt={currentUser.name}
                className="w-16 h-16 rounded-2xl border-4 border-white dark:border-stone-900 shadow-xl object-cover bg-stone-200"
              />
              <div className="text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-600 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                  <ShieldCheck size={12} /> Finca Verificada en Origen
                </span>
                <h2 className="text-2xl font-black mt-1">{currentUser.farmName || 'Mi Finca'}</h2>
                <p className="text-xs opacity-90 flex items-center gap-1">
                  <MapPin size={12} className="text-emerald-400" /> {currentUser.municipality || 'San Rafael del Norte'}, {currentUser.department || 'Jinotega'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-white/90 hover:bg-white text-stone-900 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Edit3 size={14} /> {isEditing ? 'Cancelar' : 'Editar Ficha'}
            </button>
          </div>
        </div>

        <div className={`grid grid-cols-2 sm:grid-cols-4 divide-x border-b ${isDark ? 'border-stone-800 divide-stone-800 bg-stone-950/50' : 'border-stone-100 divide-stone-100 bg-emerald-50/30'}`}>
          <div className="p-4 text-center">
            <p className="text-[10px] uppercase font-bold text-stone-400">Altura</p>
            <p className="text-lg font-black text-stone-800 dark:text-stone-200 font-mono mt-0.5">{currentUser.altitude || 1350} msnm</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-[10px] uppercase font-bold text-stone-400">Cosecha Estimada</p>
            <p className="text-lg font-black text-emerald-600 font-mono mt-0.5">{currentUser.estimatedHarvestQuintales || 200} qq</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-[10px] uppercase font-bold text-stone-400">Costo Base / qq</p>
            <p className="text-lg font-black text-stone-800 dark:text-stone-200 font-mono mt-0.5">{formatPrice(currentUser.costOfProductionPerQqUSD || 130, currency)}</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-[10px] uppercase font-bold text-stone-400">Precio Objetivo / Kg</p>
            <p className="text-lg font-black text-emerald-600 font-mono mt-0.5">{formatPrice(currentUser.targetPricePerKgUSD || 9.50, currency)}</p>
          </div>
        </div>

        <div className="p-6">
          {!isEditing ? (
            <div className="space-y-4">
              <div className={`p-4 rounded-2xl border space-y-2 text-xs ${isDark ? 'bg-stone-800/40 border-stone-800' : 'bg-stone-50 border-stone-200'}`}>
                <p><strong>Variedades Sembradas:</strong> {currentUser.varieties}</p>
                <p><strong>Certificaciones:</strong> {currentUser.certifications}</p>
                <p><strong>Notas Organolépticas:</strong> "{currentUser.organolepticNotes}"</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Nombre de la Finca</label>
                  <input
                    type="text"
                    required
                    value={formData.farmName || ''}
                    onChange={e => setFormData({ ...formData, farmName: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Nombre del Productor</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold border"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                >
                  Guardar Parámetros
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const MyBuyerProfileView = ({ currentUser, onUpdateProfile, isDark, currency }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...currentUser });

  useEffect(() => {
    setFormData({ ...currentUser });
  }, [currentUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  const inputClass = `w-full p-2.5 border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 ${isDark ? 'bg-stone-800 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`;
  const labelClass = `block text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-stone-400' : 'text-stone-600'}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      <div className={`p-6 rounded-3xl border shadow-sm ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl border-2 border-emerald-500 object-cover shadow-md"
            />
            <div>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300">
                Tostador / Importador Directo
              </span>
              <h3 className="text-xl font-black text-stone-900 dark:text-white mt-1">{currentUser.companyName || 'Mi Tostaduría'}</h3>
              <p className="text-xs text-stone-500">{currentUser.name} • {currentUser.city ? `${currentUser.city}, ` : ''}{currentUser.country || 'Internacional'}</p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-emerald-50 dark:bg-stone-800 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold border transition-all"
          >
            {isEditing ? 'Cancelar' : 'Editar'}
          </button>
        </div>

        <div className="pt-6">
          {!isEditing ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-stone-800/40 border-stone-800' : 'bg-stone-50 border-stone-200'}`}>
                <p className="text-[10px] font-bold text-stone-400 uppercase">Demanda Anual</p>
                <p className="text-2xl font-black text-stone-900 dark:text-white font-mono mt-1">{currentUser.annualVolumeBags || 50} Sacos</p>
              </div>
              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-stone-800/40 border-stone-800' : 'bg-stone-50 border-stone-200'}`}>
                <p className="text-[10px] font-bold text-stone-400 uppercase">Calidad Objetivo</p>
                <p className="text-2xl font-black text-emerald-600 font-mono mt-1">{currentUser.targetSCARange || '86 - 90+ SCA'}</p>
              </div>
              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-stone-800/40 border-stone-800' : 'bg-stone-50 border-stone-200'}`}>
                <p className="text-[10px] font-bold text-stone-400 uppercase">Moneda</p>
                <p className="text-2xl font-black text-stone-900 dark:text-white font-mono mt-1">{currentUser.preferredCurrency || currency}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Nombre de la Empresa</label>
                  <input
                    type="text"
                    value={formData.companyName || ''}
                    onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Contacto</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-2.5 rounded-xl text-xs font-semibold border">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold">
                  Guardar Perfil
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const ProducerCostCalculator = ({ isDark, currency, currentUser }) => {
  const [canPickersRateNIO, setCanPickersRateNIO] = useState(55);
  const [cansPerQuintal, setCansPerQuintal] = useState(24);
  const [wetMillingCostUSD, setWetMillingCostUSD] = useState(14);
  const [dryMillTransportUSD, setDryMillTransportUSD] = useState(16);
  const [targetSalePriceUSDPerKg, setTargetSalePriceUSDPerKg] = useState(9.80);
  const [lotSizeQuintales, setLotSizeQuintales] = useState(20);

  const nioToUsd = 1 / (CURRENCY_RATES.NIO.rate || 36.75);
  const pickingCostPerQqUSD = (canPickersRateNIO * cansPerQuintal) * nioToUsd;
  const totalCostPerQqUSD = pickingCostPerQqUSD + wetMillingCostUSD + dryMillTransportUSD + 10;
  const totalCostPerKgUSD = totalCostPerQqUSD / KG_PER_QUINTAL;

  const totalLotKg = lotSizeQuintales * KG_PER_QUINTAL;
  const grossIncomeUSD = totalLotKg * targetSalePriceUSDPerKg;
  const totalProductionCostUSD = totalLotKg * totalCostPerKgUSD;
  const netMarginUSD = grossIncomeUSD - totalProductionCostUSD;
  const marginPercentage = grossIncomeUSD > 0 ? ((netMarginUSD / grossIncomeUSD) * 100).toFixed(1) : 0;
  const commodityComparisonGainUSD = (targetSalePriceUSDPerKg - NY_BENCHMARK_PRICE_USD_KG) * totalLotKg;

  return (
    <div className={`p-6 rounded-2xl border space-y-6 ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-emerald-100/70'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4 border-stone-200 dark:border-stone-800">
        <div>
          <h3 className="text-lg font-black text-stone-900 dark:text-white flex items-center gap-2">
            <Calculator className="text-emerald-600" size={20} /> Calculadora de Costos Reales & Margen Neto de Ganancia
          </h3>
          <p className="text-xs text-stone-500">
            Calcula el costo real de tu quintal y defiende tu utilidad neta en venta directa ({currentUser?.farmName || 'Finca'}).
          </p>
        </div>
        <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-bold rounded-xl self-start sm:self-auto">
          1 Quintal Oro = 46 Kg
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-stone-800/60 border-stone-700' : 'bg-emerald-50/40 border-emerald-100'}`}>
          <label className="text-xs font-bold uppercase text-stone-500 block mb-1">Pago por Lata de Corte (C$)</label>
          <input 
            type="number" 
            value={canPickersRateNIO} 
            onChange={(e) => setCanPickersRateNIO(Number(e.target.value))}
            className={`w-full p-2.5 rounded-lg border text-sm font-bold ${isDark ? 'bg-stone-900 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`}
          />
        </div>

        <div className={`p-4 rounded-xl border ${isDark ? 'bg-stone-800/60 border-stone-700' : 'bg-emerald-50/40 border-emerald-100'}`}>
          <label className="text-xs font-bold uppercase text-stone-500 block mb-1">Latas por Quintal Oro</label>
          <input 
            type="number" 
            value={cansPerQuintal} 
            onChange={(e) => setCansPerQuintal(Number(e.target.value))}
            className={`w-full p-2.5 rounded-lg border text-sm font-bold ${isDark ? 'bg-stone-900 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`}
          />
        </div>

        <div className={`p-4 rounded-xl border ${isDark ? 'bg-stone-800/60 border-stone-700' : 'bg-emerald-50/40 border-emerald-100'}`}>
          <label className="text-xs font-bold uppercase text-stone-500 block mb-1">Precio Venta Objetivo ($/Kg)</label>
          <input 
            type="number" 
            step="0.25"
            value={targetSalePriceUSDPerKg} 
            onChange={(e) => setTargetSalePriceUSDPerKg(Number(e.target.value))}
            className={`w-full p-2.5 rounded-lg border text-sm font-bold text-emerald-600 ${isDark ? 'bg-stone-900 border-stone-700' : 'bg-white border-stone-300'}`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        <div className={`p-4 rounded-xl border text-center ${isDark ? 'bg-stone-800/40 border-stone-800' : 'bg-stone-50 border-stone-200'}`}>
          <p className="text-[11px] font-bold text-stone-400 uppercase">Costo Real por Quintal</p>
          <p className="text-xl font-black font-mono mt-1 text-stone-800 dark:text-stone-200">
            {formatPrice(totalCostPerQqUSD, currency)}
          </p>
          <span className="text-[10px] text-stone-400 font-mono">({formatPrice(totalCostPerKgUSD, currency)}/Kg)</span>
        </div>

        <div className={`p-4 rounded-xl border text-center ${isDark ? 'bg-stone-800/40 border-stone-800' : 'bg-stone-50 border-stone-200'}`}>
          <p className="text-[11px] font-bold text-stone-400 uppercase">Ingreso Bruto de Venta</p>
          <p className="text-xl font-black font-mono mt-1 text-emerald-600">
            {formatPrice(grossIncomeUSD, currency)}
          </p>
          <span className="text-[10px] text-stone-400 font-mono">{lotSizeQuintales} qq ({totalLotKg} Kg)</span>
        </div>

        <div className={`p-4 rounded-xl border text-center ${isDark ? 'bg-emerald-950/30 border-emerald-800/60' : 'bg-emerald-50 border-emerald-200'}`}>
          <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">Ganancia Neta para la Finca</p>
          <p className="text-xl font-black font-mono mt-1 text-emerald-700 dark:text-emerald-300">
            {formatPrice(netMarginUSD, currency)}
          </p>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bold inline-block mt-1">
            +{marginPercentage}% Utilidad Neta
          </span>
        </div>

        <div className={`p-4 rounded-xl border text-center ${isDark ? 'bg-teal-950/30 border-teal-800/60' : 'bg-teal-50 border-teal-200'}`}>
          <p className="text-[11px] font-bold text-teal-700 dark:text-teal-400 uppercase">Ganancia Extra vs Bolsa NY</p>
          <p className="text-xl font-black font-mono mt-1 text-teal-700 dark:text-teal-300">
            +{formatPrice(commodityComparisonGainUSD, currency)}
          </p>
          <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold block mt-1">
            Capturado en origen
          </span>
        </div>
      </div>
    </div>
  );
};

const DigitalCuppingLab = ({ batches, isDark }) => {
  const [selectedBatchId, setSelectedBatchId] = useState(batches[0]?.id || '');
  const [fragrance, setFragrance] = useState(8.75);
  const [flavor, setFlavor] = useState(9.0);
  const [aftertaste, setAftertaste] = useState(8.75);
  const [acidity, setAcidity] = useState(9.0);
  const [body, setBody] = useState(8.75);
  const [balance, setBalance] = useState(9.0);
  const [sweetness, setSweetness] = useState(10);
  const [overall, setOverall] = useState(9.0);

  const selectedBatch = batches.find(b => b.id === selectedBatchId) || batches[0];
  const totalCalculatedSCA = (fragrance + flavor + aftertaste + acidity + body + balance + sweetness + 10 + 10 + overall).toFixed(2);

  return (
    <div className={`p-6 rounded-2xl border space-y-6 ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-emerald-100/70'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-stone-200 dark:border-stone-800">
        <div>
          <h3 className="text-lg font-black text-stone-900 dark:text-white flex items-center gap-2">
            <Award className="text-emerald-600" size={20} /> Laboratorio de Catación Sensorial Digital SCA
          </h3>
          <p className="text-xs text-stone-500">Evalúa atributos organolépticos para justificar el precio premium de tu microlote.</p>
        </div>

        <select 
          value={selectedBatchId} 
          onChange={(e) => setSelectedBatchId(e.target.value)}
          className={`text-xs font-bold py-2 px-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${isDark ? 'bg-stone-800 border-stone-700 text-white' : 'bg-emerald-50 border-emerald-200 text-stone-900'}`}
        >
          {batches.map(b => (
            <option key={b.id} value={b.id}>{b.code} - {b.variety} ({b.process})</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Fragancia / Aroma', val: fragrance, set: setFragrance },
            { label: 'Sabor (Flavor)', val: flavor, set: setFlavor },
            { label: 'Sabor Residual', val: aftertaste, set: setAftertaste },
            { label: 'Acidez', val: acidity, set: setAcidity },
            { label: 'Cuerpo / Sedosidad', val: body, set: setBody },
            { label: 'Balance General', val: balance, set: setBalance },
            { label: 'Dulzor', val: sweetness, set: setSweetness },
            { label: 'Puntaje Global', val: overall, set: setOverall }
          ].map((attr, idx) => (
            <div key={idx} className={`p-3.5 rounded-xl border ${isDark ? 'bg-stone-800/40 border-stone-800' : 'bg-stone-50 border-stone-200'}`}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300">{attr.label}</span>
                <span className="text-xs font-mono font-bold text-emerald-600">{attr.val.toFixed(2)}</span>
              </div>
              <input 
                type="range" 
                min={6} 
                max={10} 
                step={0.25}
                value={attr.val} 
                onChange={(e) => attr.set(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer" 
              />
            </div>
          ))}
        </div>

        <div className={`p-6 rounded-2xl border flex flex-col justify-between text-center ${isDark ? 'bg-emerald-950/20 border-emerald-900/40' : 'bg-emerald-50/80 border-emerald-200'}`}>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">Puntaje Final SCA ({selectedBatch?.code})</span>
          <span className="text-5xl font-black font-mono text-emerald-600 dark:text-emerald-400 my-4">
            {totalCalculatedSCA}
          </span>
          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">Calificación de Alta Especialidad (Direct Trade)</p>
        </div>
      </div>
    </div>
  );
};

const BuyerFreightCalculator = ({ isDark, currency }) => {
  const [destinationRegion, setDestinationRegion] = useState('Europe');
  const [bagsCount, setBagsCount] = useState(10);
  const [baseFOBPerKgUSD] = useState(9.80);

  const totalKg = bagsCount * KG_PER_EXPORT_BAG;
  const greenCoffeeTotalUSD = totalKg * baseFOBPerKgUSD;
  const freightRates = { Europe: 0.65, NorthAmerica: 0.45, Asia: 0.85 };
  const estimatedFreightUSD = totalKg * (freightRates[destinationRegion] || 0.65);
  const exportDocumentationUSD = 180;
  const totalLandedUSD = greenCoffeeTotalUSD + estimatedFreightUSD + exportDocumentationUSD;

  return (
    <div className={`p-6 rounded-2xl border space-y-6 ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-emerald-100/70'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-stone-200 dark:border-stone-800">
        <div>
          <h3 className="text-lg font-black text-stone-900 dark:text-white flex items-center gap-2">
            <Truck className="text-emerald-600" size={20} /> Cotizador de Flete & Landed Cost (FOB Puerto Corinto)
          </h3>
          <p className="text-xs text-stone-500">Calcula costos de exportación, trámites aduanales CETREX y flete hasta destino.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-stone-800/60 border-stone-700' : 'bg-stone-50 border-stone-200'}`}>
          <label className="text-xs font-bold uppercase text-stone-500 block mb-1">Destino</label>
          <select 
            value={destinationRegion} 
            onChange={(e) => setDestinationRegion(e.target.value)}
            className={`w-full p-2.5 rounded-lg border text-sm font-bold ${isDark ? 'bg-stone-900 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`}
          >
            <option value="Europe">🇪🇺 Europa (Hamburgo / Rotterdam)</option>
            <option value="NorthAmerica">🇺🇸 Norteamérica (Miami / Seattle)</option>
            <option value="Asia">🇯🇵 Asia (Yokohama / Tokio)</option>
          </select>
        </div>

        <div className={`p-4 rounded-xl border ${isDark ? 'bg-stone-800/60 border-stone-700' : 'bg-stone-50 border-stone-200'}`}>
          <label className="text-xs font-bold uppercase text-stone-500 block mb-1">Sacos de 69kg</label>
          <input 
            type="number" 
            min="1" 
            value={bagsCount} 
            onChange={(e) => setBagsCount(Number(e.target.value))}
            className={`w-full p-2.5 rounded-lg border text-sm font-bold ${isDark ? 'bg-stone-900 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-stone-800/40 border-stone-800' : 'bg-stone-50 border-stone-200'}`}>
          <p className="text-[11px] font-bold text-stone-400 uppercase">Café Oro FOB Corinto</p>
          <p className="text-xl font-black font-mono mt-1 text-stone-900 dark:text-white">{formatPrice(greenCoffeeTotalUSD, currency)}</p>
        </div>
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-stone-800/40 border-stone-800' : 'bg-stone-50 border-stone-200'}`}>
          <p className="text-[11px] font-bold text-stone-400 uppercase">Flete & CETREX</p>
          <p className="text-xl font-black font-mono mt-1 text-stone-900 dark:text-white">{formatPrice(estimatedFreightUSD + exportDocumentationUSD, currency)}</p>
        </div>
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-emerald-950/30 border-emerald-800/60' : 'bg-emerald-50 border-emerald-200'}`}>
          <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">Landed Cost Total</p>
          <p className="text-xl font-black font-mono mt-1 text-emerald-700 dark:text-emerald-300">{formatPrice(totalLandedUSD, currency)}</p>
        </div>
      </div>
    </div>
  );
};

const BuyerInquiryModal = ({ isOpen, onClose, batch, farmer, currentUser, currency, isDark, onSubmit }) => {
  const [inquiryType, setInquiryType] = useState('sample');
  const [kgAmount, setKgAmount] = useState(69);
  const [buyerName, setBuyerName] = useState(currentUser?.name || '');
  const [roasteryName, setRoasteryName] = useState(currentUser?.companyName || '');
  const [country, setCountry] = useState(currentUser?.country || 'Alemania');
  const [email, setEmail] = useState(currentUser?.email || '');

  useEffect(() => {
    if (currentUser) {
      setBuyerName(currentUser.name || '');
      setRoasteryName(currentUser.companyName || '');
      setCountry(currentUser.country || 'Alemania');
      setEmail(currentUser.email || '');
    }
  }, [currentUser, isOpen]);

  if (!isOpen || !batch) return null;

  const unitPriceUSD = batch.priceUSD || 9.50;
  const totalCalculatedUSD = inquiryType === 'sample' ? 35 : (kgAmount * unitPriceUSD);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      id: `req-${Date.now()}`,
      batchCode: batch.code,
      batchVariety: batch.variety,
      farmerId: batch.farmerId,
      farmerName: farmer?.name || 'Productor Nica',
      buyerId: currentUser?.id || 'guest',
      buyerName,
      roasteryName,
      country,
      email,
      inquiryType,
      kgAmount: inquiryType === 'sample' ? 0.5 : kgAmount,
      totalUSD: totalCalculatedUSD,
      currency,
      date: new Date().toISOString().split('T')[0],
      status: "Oferta Recibida por la Finca"
    });
    onClose();
  };

  const inputClass = `w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm ${isDark ? 'bg-stone-800 border-stone-700 text-white' : 'bg-stone-50 border-stone-200 text-stone-900'}`;
  const labelClass = `block text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-stone-400' : 'text-stone-600'}`;

  return (
    <ModalWrapper isDark={isDark} onClose={onClose} title={`Oferta Comercial • ${batch.code}`}>
      <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          <button 
            type="button" 
            onClick={() => setInquiryType('sample')} 
            className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${inquiryType === 'sample' ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-600'}`}
          >
            Pedir Muestra (500g)
          </button>
          <button 
            type="button" 
            onClick={() => setInquiryType('reserve')} 
            className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${inquiryType === 'reserve' ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-600'}`}
          >
            Reservar Lote Completo
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Comprador</label>
            <input required type="text" className={inputClass} value={buyerName} onChange={e => setBuyerName(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Empresa / Tostaduría</label>
            <input required type="text" className={inputClass} value={roasteryName} onChange={e => setRoasteryName(e.target.value)} />
          </div>
        </div>

        <div className="flex justify-between items-center p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Total Transacción Directa:</span>
          <span className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400">{formatPrice(totalCalculatedUSD, currency)}</span>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-xs font-semibold border">Cancelar</button>
          <button type="submit" className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">
            <Send size={15}/> Enviar Oferta a Finca
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

const BatchFormModal = ({ isOpen, onClose, onSave, batchToEdit, producers, currentUser, isDark }) => {
  const [formData, setFormData] = useState({ 
    code: '', 
    farmerId: '', 
    variety: 'Maracaturra Gigante', 
    process: 'Honey Amarillo', 
    score: 87.5, 
    weight: 460, 
    priceUSD: 9.50,
    productionCostPerKgUSD: 2.80,
    status: 'En Finca (Secado en Camas)', 
    harvestDate: new Date().toISOString().split('T')[0],
    tastingNotes: []
  });
  const [tastingInput, setTastingInput] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (batchToEdit) {
        setFormData({ ...batchToEdit });
        setTastingInput(batchToEdit.tastingNotes ? batchToEdit.tastingNotes.join(', ') : '');
      } else {
        const defaultFarmerId = currentUser?.role === 'producer' ? currentUser.id : (producers[0]?.id || '');
        setFormData({ 
          code: `NIC-JIN-26-${Math.floor(10 + Math.random()*90)}`, 
          farmerId: defaultFarmerId, 
          variety: 'Maracaturra Gigante', 
          process: 'Honey Amarillo', 
          score: 87.5, 
          weight: 460, 
          priceUSD: 9.50,
          productionCostPerKgUSD: 2.80,
          status: 'En Finca (Secado en Camas)', 
          harvestDate: new Date().toISOString().split('T')[0],
          tastingNotes: ['Miel de abeja', 'Jazmín', 'Cítrico dulce']
        });
        setTastingInput('Miel de abeja, Jazmín, Cítrico dulce');
      }
    }
  }, [isOpen, batchToEdit, producers, currentUser]);

  if (!isOpen) return null;

  const handleSubmit = (e) => { 
    e.preventDefault(); 
    const notes = tastingInput.split(',').map(s => s.trim()).filter(Boolean);
    onSave({ ...formData, tastingNotes: notes }); 
    onClose(); 
  };

  const inputClass = `w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm ${isDark ? 'bg-stone-800 border-stone-700 text-white' : 'bg-stone-50 border-stone-200 text-stone-800'}`;
  const labelClass = `block text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-stone-400' : 'text-stone-600'}`;

  return (
    <ModalWrapper isDark={isDark} onClose={onClose} title={batchToEdit ? 'Editar Lote Comercial' : 'Registrar Nuevo Lote de Venta Directa'}>
      <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Código de Lote</label>
            <input required type="text" className={inputClass} value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} />
          </div>
          <div>
            <label className={labelClass}>Fecha de Corte</label>
            <input required type="date" className={inputClass} value={formData.harvestDate} onChange={e => setFormData({...formData, harvestDate: e.target.value})} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Variedad</label>
            <input required type="text" className={inputClass} value={formData.variety} onChange={e => setFormData({...formData, variety: e.target.value})} />
          </div>
          <div>
            <label className={labelClass}>Proceso</label>
            <select className={inputClass} value={formData.process} onChange={e => setFormData({...formData, process: e.target.value})}>
              <option value="Lavado Tradicional">Lavado Tradicional</option>
              <option value="Honey Amarillo">Honey Amarillo</option>
              <option value="Natural Lento en Camas">Natural Lento en Camas</option>
              <option value="Anaeróbico 72h">Anaeróbico 72h</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>Peso (Kg)</label>
            <input required type="number" min="1" className={inputClass} value={formData.weight} onChange={e => setFormData({...formData, weight: Number(e.target.value)})} />
          </div>
          <div>
            <label className={labelClass}>Puntaje SCA</label>
            <input required type="number" step="0.25" min="70" max="100" className={inputClass} value={formData.score} onChange={e => setFormData({...formData, score: Number(e.target.value)})} />
          </div>
          <div>
            <label className={labelClass}>Precio Real ($/Kg)</label>
            <input required type="number" step="0.1" min="1" className={inputClass} value={formData.priceUSD} onChange={e => setFormData({...formData, priceUSD: Number(e.target.value)})} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Notas Sensoriales en Taza</label>
          <input type="text" className={inputClass} value={tastingInput} onChange={e => setTastingInput(e.target.value)} />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border text-xs font-semibold">Cancelar</button>
          <button type="submit" className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5"><Save size={15}/> Guardar Lote</button>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default function CoffeeTraceabilityApp() {
  const [isDark, setIsDark] = useState(false);
  const [language, setLanguage] = useState('es');
  const [currency, setCurrency] = useState('USD');
  
  const [allUsers, setAllUsers] = useState(DEMO_USERS);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authPortalRole, setAuthPortalRole] = useState('producer');
  const [activeTab, setActiveTab] = useState('marketplace');
  const [toasts, setToasts] = useState([]);
  
  const [batches, setBatches] = useState(INITIAL_BATCHES);
  const [inquiries, setInquiries] = useState(INITIAL_INQUIRIES);
  const [trainingRequests, setTrainingRequests] = useState(INITIAL_TRAINING_REQUESTS);
  
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [selectedBatchForInquiry, setSelectedBatchForInquiry] = useState(null);
  const [editingBatch, setEditingBatch] = useState(null);
  const [selectedTraceabilityBatch, setSelectedTraceabilityBatch] = useState(INITIAL_BATCHES[0]);

  const [batchSearch, setBatchSearch] = useState('');
  const [marketplaceSearch, setMarketplaceSearch] = useState('');

  const t = TRANSLATIONS[language] || TRANSLATIONS.es;

  const producers = useMemo(() => {
    return allUsers.filter(u => u.role === 'producer');
  }, [allUsers]);

  const handleRoleSwitch = (newRole) => {
    setAuthPortalRole(newRole);
    if (!currentUser) {
      if (newRole === 'producer') {
        setActiveTab('institutional');
      } else {
        setActiveTab('marketplace');
      }
      return;
    }
    const match = allUsers.find(u => u.role === newRole);
    if (match) {
      setCurrentUser(match);
      if (newRole === 'producer') {
        setActiveTab('dashboard');
      } else {
        setActiveTab('marketplace');
      }
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('marketplace');
    addToast(language === 'es' ? "Sesión cerrada correctamente" : "Logged out successfully", 'success');
  };

  const openAuthForRole = (role) => {
    setAuthPortalRole(role);
    setIsAuthModalOpen(true);
  };

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleLoginSuccess = (user, isNew = false) => {
    if (isNew) {
      setAllUsers(prev => [user, ...prev]);
    }
    setCurrentUser(user);
    setAuthPortalRole(user.role);
    if (user.preferredCurrency) {
      setCurrency(user.preferredCurrency);
    }
    if (user.role === 'producer') {
      setActiveTab('dashboard');
    } else {
      setActiveTab('marketplace');
    }
    addToast(isNew ? t.authRegisterSuccess : t.authLoginSuccess);
  };

  const handleUpdateProfile = (updatedData) => {
    setCurrentUser(updatedData);
    setAllUsers(allUsers.map(u => u.id === updatedData.id ? updatedData : u));
    addToast(t.farmerSavedToast);
  };

  const handleSaveBatch = (batchData) => {
    if (editingBatch) {
      setBatches(batches.map(b => b.id === batchData.id ? batchData : b));
      if (selectedTraceabilityBatch?.id === batchData.id) setSelectedTraceabilityBatch(batchData);
      addToast(t.lotSavedToast);
    } else {
      const newBatch = { ...batchData, id: `b${Date.now()}` };
      setBatches([newBatch, ...batches]);
      addToast(t.lotSavedToast);
    }
  };

  const handleDeleteBatch = (id) => {
    setBatches(batches.filter(b => b.id !== id));
    if (selectedTraceabilityBatch?.id === id) {
      const remaining = batches.filter(b => b.id !== id);
      setSelectedTraceabilityBatch(remaining[0] || null);
    }
    addToast(t.lotDeletedToast);
  };

  const handleCreateInquiry = (inquiryData) => {
    setInquiries([inquiryData, ...inquiries]);
    addToast(t.orderSentToast);
  };

  const handleRequestTraining = (newRequest) => {
    setTrainingRequests([newRequest, ...trainingRequests]);
    addToast(t.trainingRequestedToast || "¡Solicitud técnica enviada!");
  };

  const openInquiryForBatch = (batch) => {
    if (!currentUser) {
      addToast(language === 'es' ? "Inicia sesión como comprador para solicitar muestras" : "Please sign in as a buyer to request samples", 'info');
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

  const totalKg = batches.reduce((acc, b) => acc + (Number(b.weight) || 0), 0);
  const totalQuintales = (totalKg / KG_PER_QUINTAL).toFixed(1);
  
  const totalGrossIncomeUSD = batches.reduce((acc, b) => acc + ((Number(b.weight) || 0) * (Number(b.priceUSD) || 9.50)), 0);
  const totalProductionCostsUSD = batches.reduce((acc, b) => acc + ((Number(b.weight) || 0) * (Number(b.productionCostPerKgUSD) || 2.80)), 0);
  const totalNetProfitUSD = totalGrossIncomeUSD - totalProductionCostsUSD;

  const totalCommodityBaseUSD = totalKg * NY_BENCHMARK_PRICE_USD_KG;
  const totalRealValuePremiumUSD = Math.max(0, totalGrossIncomeUSD - totalCommodityBaseUSD);

  const avgScore = batches.length 
    ? (batches.reduce((acc, b) => acc + (Number(b.score) || 0), 0) / batches.length).toFixed(2) 
    : '0.00';

  const processData = useMemo(() => {
    const counts = batches.reduce((acc, b) => {
      acc[b.process] = (acc[b.process] || 0) + (Number(b.weight) || 0);
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [batches]);

  const profitByVarietyData = useMemo(() => {
    const counts = batches.reduce((acc, b) => {
      const gross = (Number(b.weight) || 0) * (Number(b.priceUSD) || 9.50);
      const cost = (Number(b.weight) || 0) * (Number(b.productionCostPerKgUSD) || 2.80);
      const profitUSD = Math.max(0, gross - cost);
      const converted = formatNumberCurrency(profitUSD, currency);
      acc[b.variety] = (acc[b.variety] || 0) + converted;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value: Math.round(value) }));
  }, [batches, currency]);

  const filteredBatches = useMemo(() => {
    return batches.filter(b => {
      const farmer = producers.find(f => f.id === b.farmerId);
      const query = batchSearch.toLowerCase();
      return b.code.toLowerCase().includes(query) ||
        b.variety.toLowerCase().includes(query) ||
        (farmer?.name || '').toLowerCase().includes(query) ||
        (farmer?.farmName || '').toLowerCase().includes(query);
    });
  }, [batches, producers, batchSearch]);

  const marketplaceBatches = useMemo(() => {
    return batches.filter(b => {
      const farmer = producers.find(f => f.id === b.farmerId);
      const query = marketplaceSearch.toLowerCase();
      return b.code.toLowerCase().includes(query) ||
        b.variety.toLowerCase().includes(query) ||
        (farmer?.name || '').toLowerCase().includes(query) ||
        (farmer?.farmName || '').toLowerCase().includes(query) ||
        b.process.toLowerCase().includes(query);
    });
  }, [batches, producers, marketplaceSearch]);

  const COLORS = ['#059669', '#10b981', '#15803d', '#16a34a', '#0d9488', '#84cc16'];

  const navItems = useMemo(() => {
    if (!currentUser) {
      return [
        { id: 'marketplace', icon: ShoppingCart, label: language === 'es' ? 'Mercado de Cafés' : 'Specialty Market' },
        { id: 'nyExchange', icon: TrendingUp, label: t.navNYExchange },
        { id: 'terroirs', icon: Compass, label: t.navTerroirs },
        { id: 'institutional', icon: Truck, label: t.navInstitutional },
        { id: 'traceability', icon: QrCode, label: t.navTraceability },
        { id: 'farmers', icon: Users, label: t.navFarmers }
      ];
    }
    if (currentUser.role === 'buyer') {
      return [
        { id: 'marketplace', icon: ShoppingCart, label: t.navMarketplace },
        { id: 'nyExchange', icon: TrendingUp, label: t.navNYExchange },
        { id: 'cuppingLab', icon: Award, label: t.navCuppingLab },
        { id: 'exportCalc', icon: Truck, label: t.navExportCalc },
        { id: 'traceability', icon: QrCode, label: t.navTraceability },
        { id: 'terroirs', icon: Compass, label: t.navTerroirs },
        { id: 'institutional', icon: Truck, label: t.navInstitutional },
        { id: 'buyerOrders', icon: Inbox, label: t.navBuyerOrders },
        { id: 'myProfile', icon: User, label: t.navBuyerProfile }
      ];
    } else {
      return [
        { id: 'dashboard', icon: LayoutDashboard, label: t.navProducerDashboard },
        { id: 'nyExchange', icon: TrendingUp, label: t.navNYExchange },
        { id: 'batches', icon: Package, label: t.navBatches },
        { id: 'myProfile', icon: Leaf, label: t.navMyProfile },
        { id: 'costCalc', icon: Calculator, label: t.navCostCalculator },
        { id: 'training', icon: GraduationCap, label: t.navTraining },
        { id: 'institutional', icon: Truck, label: t.navInstitutional },
        { id: 'producerOrders', icon: Inbox, label: t.navProducerOrders },
        { id: 'farmers', icon: Users, label: t.navFarmers },
        { id: 'traceability', icon: QrCode, label: t.navTraceability }
      ];
    }
  }, [currentUser, language, t]);

  return (
    <div className={`flex h-screen font-sans transition-colors duration-300 ${isDark ? 'bg-stone-950 text-stone-100' : 'bg-stone-100/70 text-stone-800'}`}>
      {/* SIDEBAR */}
      <aside className={`w-20 md:w-64 transition-all duration-300 flex flex-col fixed h-full z-20 border-r shadow-sm ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-emerald-100/70'}`}>
        <div className="p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-800 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-950/20">
              <Coffee size={22} />
            </div>
            <div className="hidden md:block">
              <h1 className={`text-base font-black tracking-tight leading-none ${isDark ? 'text-white' : 'text-stone-900'}`}>
                Nica<span className="text-emerald-600">Trade</span>
              </h1>
              <p className="text-[10px] font-bold tracking-wider uppercase text-emerald-600">{t.appSubtitle}</p>
            </div>
          </div>
        </div>

        <div className="px-3 pt-4">
          <div className={`p-1 rounded-xl flex border ${isDark ? 'bg-stone-950 border-stone-800' : 'bg-stone-100 border-stone-200'}`}>
            <button
              onClick={() => handleRoleSwitch('buyer')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${(!currentUser && authPortalRole === 'buyer') || (currentUser?.role === 'buyer') ? 'bg-emerald-600 text-white shadow-sm' : 'text-stone-500'}`}
            >
              <ShoppingCart size={13} />
              <span className="hidden md:inline">{t.roleBuyer}</span>
            </button>
            <button
              onClick={() => handleRoleSwitch('producer')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${(!currentUser && authPortalRole === 'producer') || (currentUser?.role === 'producer') ? 'bg-emerald-600 text-white shadow-sm' : 'text-stone-500'}`}
            >
              <Building2 size={13} />
              <span className="hidden md:inline">{t.roleProducer}</span>
            </button>
          </div>
        </div>
        
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)} 
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${activeTab === item.id ? 'bg-emerald-600 text-white font-semibold shadow-md' : 'text-stone-600 hover:bg-emerald-50 dark:text-stone-400 dark:hover:bg-stone-800'}`}
            >
              <item.icon size={19} className="shrink-0" />
              <span className="hidden md:inline">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className={`p-4 border-t space-y-2 ${isDark ? 'border-stone-800' : 'border-stone-200'}`}>
          {currentUser ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors"
            >
              <LogOut size={15} />
              <span className="hidden md:inline">{language === 'es' ? 'Cerrar Sesión' : 'Log Out'}</span>
            </button>
          ) : (
            <button
              onClick={() => openAuthForRole(authPortalRole)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <LogIn size={15} />
              <span className="hidden md:inline">{language === 'es' ? 'Iniciar Sesión' : 'Sign In'}</span>
            </button>
          )}

          <div className="hidden md:flex items-center justify-between text-xs text-stone-500 pt-1">
            <span className="font-semibold">{language === 'es' ? 'Tema visual' : 'Theme'}</span>
            <button onClick={() => setIsDark(!isDark)} className="p-1.5 rounded-lg text-emerald-600">
              {isDark ? <Sun size={16}/> : <Moon size={16}/>}
            </button>
          </div>
        </div>
      </aside>

      {}
      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 ml-20 md:ml-64 transition-all duration-300">
        {/* VIEW HEADER TITLE */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${!currentUser ? 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300' : currentUser.role === 'buyer' ? 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'}`}>
                {!currentUser ? (language === 'es' ? 'Modo Explorador (Sin Sesión)' : 'Explorer Mode (Guest)') : currentUser.role === 'buyer' ? t.buyerType : t.producerType}
              </span>
              <span className="text-xs text-stone-400 font-medium">• Nicaragua Specialty Direct Trade</span>
            </div>
            <h2 className={`text-2xl md:text-3xl font-black tracking-tight mt-1 ${isDark ? 'text-white' : 'text-stone-900'}`}>
              {activeTab === 'marketplace' ? t.marketplaceTitle :
               activeTab === 'nyExchange' ? t.navNYExchange :
               activeTab === 'dashboard' ? t.navProducerDashboard : 
               activeTab === 'batches' ? t.navBatches : 
               activeTab === 'training' ? t.navTraining :
               activeTab === 'myProfile' ? (currentUser?.role === 'producer' ? t.navMyProfile : t.navBuyerProfile) :
               activeTab === 'costCalc' ? t.navCostCalculator :
               activeTab === 'cuppingLab' ? t.navCuppingLab :
               activeTab === 'exportCalc' ? t.navExportCalc :
               activeTab === 'terroirs' ? t.navTerroirs :
               activeTab === 'institutional' ? t.navInstitutional :
               activeTab === 'farmers' ? t.producerDirectory : 
               activeTab === 'buyerOrders' || activeTab === 'producerOrders' ? 'Gestión de Ofertas y Contratos' : t.navTraceability}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {currentUser ? (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border shadow-sm ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-emerald-200/80'}`}>
                <img 
                  src={currentUser.avatar || "https://images.unsplash.com/photo-1595858600863-7182ecf7b494?auto=format&fit=crop&w=300&q=80"} 
                  alt={currentUser.name} 
                  className="w-7 h-7 rounded-xl object-cover border border-emerald-500 shrink-0" 
                />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-stone-900 dark:text-white leading-tight truncate max-w-[120px]">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-emerald-600 font-semibold truncate max-w-[120px]">
                    {currentUser.role === 'producer' ? currentUser.farmName : currentUser.companyName}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors ml-1"
                  title={language === 'es' ? "Cerrar Sesión" : "Log Out"}
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthForRole(authPortalRole)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                >
                  <LogIn size={14} /> {language === 'es' ? 'Iniciar Sesión' : 'Sign In'}
                </button>
                <button
                  onClick={() => openAuthForRole(authPortalRole)}
                  className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                >
                  <UserPlus size={14} /> {authPortalRole === 'producer' ? (language === 'es' ? 'Registrar Mi Finca' : 'Register Farm') : (language === 'es' ? 'Registrarme' : 'Sign Up')}
                </button>
              </div>
            )}

            <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border shadow-sm ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'}`}>
              <Globe size={15} className="text-emerald-600" />
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className={`text-xs font-bold bg-transparent focus:outline-none cursor-pointer ${isDark ? 'text-white' : 'text-stone-800'}`}
              >
                <option value="es" className={isDark ? 'bg-stone-900 text-white' : 'bg-white text-stone-900'}>🇪🇸 ES</option>
                <option value="en" className={isDark ? 'bg-stone-900 text-white' : 'bg-white text-stone-900'}>🇺🇸 EN</option>
              </select>
            </div>

            <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border shadow-sm ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'}`}>
              <DollarSign size={15} className="text-emerald-600" />
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
                className={`text-xs font-bold bg-transparent focus:outline-none cursor-pointer ${isDark ? 'text-white' : 'text-stone-800'}`}
              >
                <option value="USD" className={isDark ? 'bg-stone-900 text-white' : 'bg-white text-stone-900'}>USD ($)</option>
                <option value="EUR" className={isDark ? 'bg-stone-900 text-white' : 'bg-white text-stone-900'}>EUR (€)</option>
                <option value="NIO" className={isDark ? 'bg-stone-900 text-white' : 'bg-white text-stone-900'}>NIO (C$)</option>
              </select>
            </div>
          </div>
        </header>

        {/* 1. MARKETPLACE */}
        {activeTab === 'marketplace' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {!currentUser && (
              <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${isDark ? 'bg-emerald-950/30 border-emerald-800' : 'bg-emerald-50 border-emerald-200'}`}>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-600 text-white rounded-xl shrink-0">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-stone-900 dark:text-white uppercase tracking-wider">
                      {language === 'es' ? 'Venta Directa de Cafés de Especialidad de Nicaragua' : 'Direct Specialty Coffee Trade from Nicaragua'}
                    </h4>
                    <p className="text-xs text-stone-600 dark:text-stone-400">
                      {language === 'es' ? 'Compra directamente a productores al precio real de origen sin intermediarios.' : 'Buy directly from producers at genuine farmgate prices.'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openAuthForRole('buyer')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all"
                  >
                    {language === 'es' ? 'Iniciar Sesión' : 'Sign In'}
                  </button>
                  <button
                    onClick={() => openAuthForRole('buyer')}
                    className="px-3 py-1.5 bg-white dark:bg-stone-800 hover:bg-stone-100 text-stone-800 dark:text-stone-200 text-xs font-bold rounded-xl border border-stone-300 dark:border-stone-700 transition-all"
                  >
                    {language === 'es' ? 'Registrarme' : 'Sign Up'}
                  </button>
                </div>
              </div>
            )}

            <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-emerald-100/70'}`}>
              <div className="relative flex-1 w-full max-w-md">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input 
                  type="text" 
                  placeholder={t.searchLotPlaceholder} 
                  value={marketplaceSearch}
                  onChange={(e) => setMarketplaceSearch(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${isDark ? 'bg-stone-800 border-stone-700 text-white' : 'bg-stone-50 border-stone-200 text-stone-900'}`}
                />
              </div>
              {!currentUser && (
                <button
                  onClick={() => openAuthForRole('buyer')}
                  className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all text-xs"
                >
                  <UserPlus size={14} /> {language === 'es' ? 'Registrarme como Comprador' : 'Register as Buyer'}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketplaceBatches.map(batch => {
                const farmer = producers.find(f => f.id === batch.farmerId);
                const altClass = getAltitudeClassification(farmer?.altitude || 1350);

                return (
                  <div key={batch.id} className={`rounded-2xl shadow-sm border overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'}`}>
                    <div className="h-36 bg-stone-900 relative overflow-hidden">
                      <img 
                        src={batch.batchImage || farmer?.farmImage || "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800"} 
                        alt={batch.variety} 
                        onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800"; }}
                        className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent flex items-end justify-between p-4">
                        <span className="text-white font-mono text-xs font-bold drop-shadow-md">{batch.code}</span>
                        <span className="bg-white/95 text-stone-950 text-xs font-black px-2.5 py-0.5 rounded-lg shadow">
                          {batch.score} SCA
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-extrabold text-base text-stone-900 dark:text-white leading-tight">
                            {batch.variety}
                          </h4>
                          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/60">
                            {batch.process}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 flex items-center gap-1 font-medium">
                          <Leaf size={12} className="text-emerald-600" /> {farmer?.farmName || 'Finca'} • {farmer?.name || 'Productor'}
                        </p>
                        
                        <div className="flex items-center gap-2 mt-2 text-xs">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${altClass.color}`}>
                            {farmer?.altitude || 1350} msnm
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {batch.tastingNotes?.map((note, i) => (
                            <span key={i} className="px-2 py-0.5 text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 rounded-md">
                              {note}
                            </span>
                          ))}
                        </div>

                        <div className={`mt-4 p-3 rounded-xl border flex items-center justify-between ${isDark ? 'bg-stone-800/50 border-stone-800' : 'bg-emerald-50/40 border-emerald-100'}`}>
                          <div>
                            <p className="text-[10px] uppercase font-bold text-stone-400">{t.priceCol}</p>
                            <p className="text-lg font-black text-emerald-600 font-mono">
                              {formatPrice(batch.priceUSD || 9.50, currency)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] uppercase font-bold text-stone-400">{t.volumeCol}</p>
                            <p className="text-sm font-bold text-stone-800 dark:text-stone-200">{batch.weight} Kg ({(batch.weight/KG_PER_QUINTAL).toFixed(1)} qq)</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center gap-2">
                        <button 
                          onClick={() => viewTraceability(batch)} 
                          className={`p-2.5 rounded-xl border transition-colors ${isDark ? 'border-stone-700 text-stone-300' : 'border-stone-200 text-stone-600'}`}
                          title={t.navTraceability}
                        >
                          <QrCode size={16} />
                        </button>
                        <button 
                          onClick={() => openInquiryForBatch(batch)} 
                          className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                        >
                          <Send size={14} /> {t.requestSample}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 1.1 NY STOCK EXCHANGE MONITOR */}
        {activeTab === 'nyExchange' && (
          <NYCoffeeExchangeView isDark={isDark} currency={currency} />
        )}

        {/* 2. PRODUCER FINANCIAL DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <MetricCard isDark={isDark} title={t.totalVolume} value={`${totalKg.toLocaleString()} Kg`} subtitle={`${totalQuintales} Quintales Oro`} icon={Package} />
              <MetricCard isDark={isDark} title={t.netProfit} value={formatPrice(totalNetProfitUSD, currency)} subtitle="Ganancia retenida en finca" badgeText="Utilidad Directa" icon={CircleDollarSign} />
              <MetricCard isDark={isDark} title={t.valuePremium} value={`+${formatPrice(totalRealValuePremiumUSD, currency)}`} subtitle="Por encima del precio NY" icon={TrendingUp} />
              <MetricCard isDark={isDark} title={t.avgScore} value={avgScore} subtitle="Puntaje Promedio SCA" icon={Award} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`p-6 rounded-2xl border ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-emerald-100/60'}`}>
                <h3 className="text-base font-bold mb-4 flex items-center gap-2 text-stone-900 dark:text-white">
                  <Droplet className="text-emerald-500" size={18}/> {t.processVolume}
                </h3>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={processData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#333' : '#e2e8f0'} />
                      <XAxis dataKey="name" tick={{fill: isDark ? '#a8a29e' : '#57534e', fontSize: 12}} />
                      <YAxis tick={{fill: isDark ? '#a8a29e' : '#57534e', fontSize: 12}} />
                      <Tooltip />
                      <Bar dataKey="value" name="Kg" fill="#059669" radius={[6, 6, 0, 0]}>
                        {processData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className={`p-6 rounded-2xl border ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-emerald-100/60'}`}>
                <h3 className="text-base font-bold mb-4 flex items-center gap-2 text-stone-900 dark:text-white">
                  <BadgePercent className="text-emerald-600" size={18}/> {t.profitabilityDist} ({currency})
                </h3>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={profitByVarietyData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value">
                        {profitByVarietyData.map((_, index) => <Cell key={`cell-profit-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. BATCH MANAGEMENT */}
        {activeTab === 'batches' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-emerald-100/60'}`}>
              <div className="relative flex-1 max-w-sm">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input 
                  type="text" 
                  placeholder={t.searchLotPlaceholder} 
                  value={batchSearch}
                  onChange={(e) => setBatchSearch(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 text-sm rounded-xl border ${isDark ? 'bg-stone-800 border-stone-700 text-white' : 'bg-stone-50 border-stone-200 text-stone-900'}`}
                />
              </div>
              <button 
                onClick={() => { setEditingBatch(null); setIsBatchModalOpen(true); }} 
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all"
              >
                <Plus size={18} /> {t.registerLot}
              </button>
            </div>

            <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'}`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className={`text-xs font-bold uppercase ${isDark ? 'bg-stone-950 text-stone-400' : 'bg-emerald-50/60 text-emerald-900'}`}>
                    <tr>
                      <th className="p-4">{t.lotCol}</th>
                      <th className="p-4">{t.varietyCol}</th>
                      <th className="p-4 text-right">{t.volumeCol}</th>
                      <th className="p-4 text-right">{t.priceCol}</th>
                      <th className="p-4 text-center">{t.scoreCol}</th>
                      <th className="p-4 text-center">{t.actionsCol}</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y text-sm ${isDark ? 'divide-stone-800 text-stone-300' : 'divide-stone-100 text-stone-700'}`}>
                    {filteredBatches.map(batch => (
                      <tr key={batch.id} className="hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20">
                        <td className="p-4 font-mono font-bold text-emerald-600">{batch.code}</td>
                        <td className="p-4">
                          <p className="font-semibold">{batch.variety}</p>
                          <p className="text-xs text-stone-400">{batch.process}</p>
                        </td>
                        <td className="p-4 text-right font-semibold">{batch.weight} kg</td>
                        <td className="p-4 text-right font-mono font-bold text-emerald-600">{formatPrice(batch.priceUSD, currency)}</td>
                        <td className="p-4 text-center">
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">{batch.score}</span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-1">
                            <button onClick={() => viewTraceability(batch)} className="p-1.5 text-emerald-600" title="Ver Autenticidad"><QrCode size={18}/></button>
                            <button onClick={() => { setEditingBatch(batch); setIsBatchModalOpen(true); }} className="p-1.5 text-stone-400 hover:text-emerald-600"><Pencil size={18}/></button>
                            <button onClick={() => handleDeleteBatch(batch.id)} className="p-1.5 text-stone-400 hover:text-rose-600"><Trash2 size={18}/></button>
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

        {/* 4. COST CALCULATOR */}
        {activeTab === 'costCalc' && (
          <ProducerCostCalculator isDark={isDark} currency={currency} currentUser={currentUser} />
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

        {/* 6. MY PROFILE */}
        {activeTab === 'myProfile' && (
          currentUser?.role === 'producer' ? (
            <MyFarmProfileView currentUser={currentUser} onUpdateProfile={handleUpdateProfile} isDark={isDark} currency={currency} />
          ) : (
            <MyBuyerProfileView currentUser={currentUser} onUpdateProfile={handleUpdateProfile} isDark={isDark} currency={currency} />
          )
        )}

        {/* 7. CUPPING LAB */}
        {activeTab === 'cuppingLab' && (
          <DigitalCuppingLab batches={batches} isDark={isDark} />
        )}

        {/* 8. FOB EXPORT CALC */}
        {activeTab === 'exportCalc' && (
          <BuyerFreightCalculator isDark={isDark} currency={currency} />
        )}

        {/* 9. TERROIRS */}
        {activeTab === 'terroirs' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
            {NICA_TERROIRS.map((terroir) => (
              <div key={terroir.id} className={`rounded-2xl border overflow-hidden shadow-sm ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'}`}>
                <div className="h-44 relative bg-stone-950">
                  <img 
                    src={terroir.image} 
                    alt={terroir.name} 
                    onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1524350876685-274059332603?auto=format&fit=crop&q=80&w=800"; }}
                    className="w-full h-full object-cover opacity-75 hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent flex flex-col justify-end p-4 text-white">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">{terroir.department}</span>
                    <h4 className="text-lg font-black leading-tight">{terroir.name}</h4>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <p className="text-xs font-semibold text-emerald-600">{terroir.altitudeRange} • Cosecha: {terroir.harvestMonths}</p>
                  <p className="text-xs italic text-stone-600 dark:text-stone-300">"{terroir.cupProfile}"</p>
                  <p className="text-xs font-bold text-stone-800 dark:text-stone-200">{terroir.cupOfExcellenceRecord}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 10. INSTITUTIONAL ECOSYSTEM */}
        {activeTab === 'institutional' && (
          <InstitutionalEcosystemView isDark={isDark} />
        )}

        {/* 11. INQUIRIES & ORDERS */}
        {(activeTab === 'buyerOrders' || activeTab === 'producerOrders') && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className={`p-5 rounded-2xl border ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-emerald-100/70'}`}>
              <h3 className="font-bold text-lg text-stone-900 dark:text-white mb-4">Negociaciones Comerciales & Pre-Contratos</h3>
              <div className="space-y-3">
                {inquiries.map((req) => (
                  <div key={req.id} className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${isDark ? 'bg-stone-800/40 border-stone-800' : 'bg-stone-50 border-stone-200'}`}>
                    <div>
                      <p className="font-bold text-sm">{req.batchCode} — {req.batchVariety}</p>
                      <p className="text-xs text-stone-500">{req.roasteryName} ({req.buyerName}) • {req.country}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300">{req.status}</span>
                      <p className="font-mono font-bold text-emerald-600 mt-1">{formatPrice(req.totalUSD, currency)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 12. FARMERS DIRECTORY */}
        {activeTab === 'farmers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
            {producers.map(farmer => (
              <div key={farmer.id} className={`rounded-2xl border overflow-hidden p-6 ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <img src={farmer.avatar} alt={farmer.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <h4 className="font-bold text-stone-900 dark:text-white">{farmer.name}</h4>
                    <p className="text-xs text-emerald-600 font-semibold">{farmer.farmName}</p>
                  </div>
                </div>
                <p className="text-xs text-stone-500 mb-2">{farmer.department} • {farmer.altitude} msnm ({farmer.manzanasCultivadas} Mz)</p>
                <div className={`p-3 rounded-xl border text-xs space-y-1 ${isDark ? 'bg-stone-800/40 border-stone-800' : 'bg-stone-50 border-stone-100'}`}>
                  <div className="flex justify-between"><span className="text-stone-400">Variedades:</span><span className="font-bold">{farmer.varieties}</span></div>
                  <div className="flex justify-between"><span className="text-stone-400">Precio Objetivo:</span><span className="font-bold text-emerald-600">${farmer.targetPricePerKgUSD}/Kg</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 13. TRACEABILITY VIEW */}
        {activeTab === 'traceability' && selectedTraceabilityBatch && (() => {
          const batch = selectedTraceabilityBatch;
          const farmer = producers.find(f => f.id === batch.farmerId) || producers[0];
          return (
            <div className={`max-w-3xl mx-auto rounded-3xl border overflow-hidden p-6 md:p-8 space-y-6 ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-emerald-100/70 shadow-xl'}`}>
              <div className="border-b pb-4">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">Certificado de Autenticidad: {batch.code}</span>
                <h2 className="text-2xl font-black mt-2">{batch.variety} ({batch.process}) — {batch.score} SCA</h2>
                <p className="text-xs text-stone-500">{farmer.farmName} • {farmer.department}, Nicaragua</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-stone-400">Productor / Dueño:</span>
                  <span className="font-bold">{farmer.name}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-stone-400">Altitud & Malla:</span>
                  <span className="font-bold">{farmer.altitude} msnm • {batch.screenSize || '18+'}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-stone-400">Coordenadas GPS de Finca:</span>
                  <span className="font-mono text-emerald-600">{farmer.lat}, {farmer.lng}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Modalidad Comercial:</span>
                  <span className="font-bold text-emerald-600">Venta Directa 100% Retenida en Finca</span>
                </div>
              </div>

              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-stone-800/40 border-stone-800' : 'bg-stone-50 border-stone-200'}`}>
                <p className="text-xs font-medium text-stone-700 dark:text-stone-300 leading-relaxed">
                  Lote segregado y procesado de forma artesanal. La transacción directa garantiza que el precio pagado por el comprador se liquida íntegramente al caficultor.
                </p>
              </div>
            </div>
          );
        })()}

      </main>

      {/* MODALS */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        isDark={isDark}
        onLoginSuccess={handleLoginSuccess}
        portalRole={authPortalRole}
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
