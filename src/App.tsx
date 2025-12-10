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
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  PlusCircle,
  MinusCircle,
  Save,
  XCircle,
  Plus,
  Cloud,
  Wifi,
  Lock
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

// --- FIREBASE IMPORTS (REALTIME DATABASE) ---
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
  update
} from 'firebase/database';

// --- DATOS INICIALES (Para carga automática si la BD está vacía) ---
const INITIAL_DATA = [
  { codigo: "TR0134", categoria: "TRANSMISIÓN", material: "Bandas viejas", descripcion: "Bandas viejas", unidad: "UNIDADES", stock: 86 },
  { codigo: "TR0133", categoria: "TRANSMISIÓN", material: "Banda 61", descripcion: "Banda 61", unidad: "UNIDADES", stock: 2 },
  { codigo: "TR0132", categoria: "TRANSMISIÓN", material: "Banda 58", descripcion: "Banda 58", unidad: "UNIDADES", stock: 1 },
  { codigo: "TR0131", categoria: "TRANSMISIÓN", material: "Banda 58", descripcion: "Banda 58", unidad: "UNIDADES", stock: 1 },
  { codigo: "TR0130", categoria: "TRANSMISIÓN", material: "Banda 57", descripcion: "Banda 57", unidad: "UNIDADES", stock: 1 },
  { codigo: "TR0129", categoria: "TRANSMISIÓN", material: "Banda 56", descripcion: "Banda 56", unidad: "UNIDADES", stock: 1 },
  { codigo: "PE0128", categoria: "PERNOS", material: 'Perno 1/4 x 4"', descripcion: 'Perno 1/4 x 4"', unidad: "UNIDADES", stock: 25 },
  { codigo: "PE0127", categoria: "PERNOS", material: 'Perno 1/4 x 4 1/2"', descripcion: 'Perno 1/4 x 4 1/2"', unidad: "UNIDADES", stock: 31 },
  { codigo: "TR0126", categoria: "TRANSMISIÓN", material: "Sprokets 428-56", descripcion: "Sprokets 428-56", unidad: "UNIDADES", stock: 2 },
  { codigo: "AD0125", categoria: "ADHESIVOS", material: "Silicon", descripcion: "Silicon", unidad: "UNIDADES", stock: 3 },
  { codigo: "TR0124", categoria: "TRANSMISIÓN", material: "Sprokets 428-50", descripcion: "Sprokets 428-50", unidad: "UNIDADES", stock: 2 },
  { codigo: "TR0123", categoria: "TRANSMISIÓN", material: "Sprokets 428-45", descripcion: "Sprokets 428-45", unidad: "UNIDADES", stock: 6 },
  { codigo: "TR0122", categoria: "TRANSMISIÓN", material: "Sprokets 428-38", descripcion: "Sprokets 428-38", unidad: "UNIDADES", stock: 7 },
  { codigo: "TR0121", categoria: "TRANSMISIÓN", material: "Sprokets 428-17", descripcion: "Sprokets 428-17", unidad: "UNIDADES", stock: 1 },
  { codigo: "CH0120", categoria: "CHUMAZERAS FLANCH", material: "Chumacera Flanch 1/2", descripcion: "Chumacera Flanch 1/2", unidad: "UNIDADES", stock: 0 },
  { codigo: "HE0119", categoria: "HERRAMIENTAS", material: "Cintas métricas", descripcion: "Cintas métricas", unidad: "UNIDADES", stock: 3 },
  { codigo: "HE0118", categoria: "HERRAMIENTAS", material: "Mazos de hule", descripcion: "Mazos de hule", unidad: "UNIDADES", stock: 3 },
  { codigo: "HE0117", categoria: "HERRAMIENTAS", material: "Juegos de llaves Hexagonales", descripcion: "Juegos de llaves Hexagonales", unidad: "JUEGOS", stock: 3 },
  { codigo: "HE0116", categoria: "HERRAMIENTAS", material: "Cepillo de alambre", descripcion: "Cepillo de alambre", unidad: "UNIDADES", stock: 5 },
  { codigo: "HE0115", categoria: "HERRAMIENTAS", material: "Juegos de numeros", descripcion: "Juegos de numeros", unidad: "JUEGOS", stock: 2 },
  { codigo: "HE0114", categoria: "HERRAMIENTAS", material: "Escuadra Falsa", descripcion: "Escuadra Falsa", unidad: "UNIDADES", stock: 1 },
  { codigo: "HE0113", categoria: "HERRAMIENTAS", material: "Fijador de rosca", descripcion: "Fijador de rosca", unidad: "UNIDADES", stock: 1 },
  { codigo: "HE0112", categoria: "HERRAMIENTAS", material: "Candado de 25mm", descripcion: "Candado de 25mm", unidad: "UNIDADES", stock: 4 },
  { codigo: "HE0111", categoria: "HERRAMIENTAS", material: "Porta electrodo", descripcion: "Porta electrodo", unidad: "UNIDADES", stock: 2 },
  { codigo: "HE0110", categoria: "HERRAMIENTAS", material: "Inyector de grasa", descripcion: "Inyector de grasa", unidad: "UNIDADES", stock: 1 },
  { codigo: "EP0109", categoria: "EPP", material: "Guantes de cuero", descripcion: "Guantes de cuero", unidad: "UNIDADES", stock: 2 },
  { codigo: "EP0108", categoria: "EPP", material: "Gafas de protección", descripcion: "Gafas de protección", unidad: "UNIDADES", stock: 4 },
  { codigo: "FU0107", categoria: "FUNDICIÓN", material: "Barras de estaño", descripcion: "Barras de estaño", unidad: "UNIDADES", stock: 10 },
  { codigo: "CU0106", categoria: "CUCHILLAS", material: "Cuchillas PN-PLUS2000", descripcion: "Cuchillas PN-PLUS2000", unidad: "UNIDADES", stock: 14 },
  { codigo: "AD0105", categoria: "ADHESIVOS", material: "Epoxi-mil", descripcion: "Epoximil", unidad: "UNIDADES", stock: 7 },
  { codigo: "TR0104", categoria: "TRANSMISIÓN", material: "Banda 80", descripcion: "Banda 80", unidad: "UNIDADES", stock: 2 },
  { codigo: "TR0103", categoria: "TRANSMISIÓN", material: "Banda 79", descripcion: "Banda 79", unidad: "UNIDADES", stock: 2 },
  { codigo: "TR0102", categoria: "TRANSMISIÓN", material: "Banda 78", descripcion: "Banda 78", unidad: "UNIDADES", stock: 1 },
  { codigo: "TR0101", categoria: "TRANSMISIÓN", material: "Banda 71", descripcion: "Banda 71", unidad: "UNIDADES", stock: 1 },
  { codigo: "TR0100", categoria: "TRANSMISIÓN", material: "Banda 60", descripcion: "Banda 60", unidad: "UNIDADES", stock: 2 },
  { codigo: "TR0099", categoria: "TRANSMISIÓN", material: "Banda 59", descripcion: "Banda 59", unidad: "UNIDADES", stock: 4 },
  { codigo: "TR0098", categoria: "TRANSMISIÓN", material: "Banda 54", descripcion: "Banda 54", unidad: "UNIDADES", stock: 2 },
  { codigo: "TR0097", categoria: "TRANSMISIÓN", material: "Banda 53", descripcion: "Banda 53", unidad: "UNIDADES", stock: 2 },
  { codigo: "TR0096", categoria: "TRANSMISIÓN", material: "Banda 51", descripcion: "Banda 51", unidad: "UNIDADES", stock: 1 },
  { codigo: "TR0095", categoria: "TRANSMISIÓN", material: "Banda 48", descripcion: "Banda 48", unidad: "UNIDADES", stock: 2 },
  { codigo: "IM0094", categoria: "IMPERMEABILIZANTES", material: "Brea", descripcion: "Brea", unidad: "UNIDADES", stock: 5 },
  { codigo: "LI0093", categoria: "LIJAS", material: "Lija #60", descripcion: "Lija #60", unidad: "UNIDADES", stock: 6 },
  { codigo: "TR0092", categoria: "TRANSMISIÓN", material: "Cadena Paso 428", descripcion: "Cadena Paso 428", unidad: "UNIDADES", stock: 10 },
  { codigo: "BA0091", categoria: "BALINERAS", material: "Balinera 6205", descripcion: "Balinera 6205", unidad: "UNIDADES", stock: 2 },
  { codigo: "BA0090", categoria: "BALINERAS", material: "Balinera 5130", descripcion: "Balinera 5130", unidad: "UNIDADES", stock: 1 },
  { codigo: "PI0089", categoria: "PINTURAS", material: "Fast Dry Verde", descripcion: "Fast Dry Verde", unidad: "GALONES", stock: 2 },
  { codigo: "PI0088", categoria: "PINTURAS", material: "Fast Dry Aluminio", descripcion: "Fast Dry Aluminio", unidad: "GALONES", stock: 1 },
  { codigo: "PI0087", categoria: "PINTURAS", material: "Fast Dry Amarillo", descripcion: "Fast Dry Amarillo", unidad: "GALONES", stock: 0 },
  { codigo: "PI0086", categoria: "PINTURAS", material: "Fast Dry Naranja", descripcion: "Fast Dry Naranja", unidad: "GALONES", stock: 1 },
  { codigo: "PI0085", categoria: "PINTURAS", material: "Fast Dry Verde", descripcion: "Fast Dry Verde", unidad: "GALONES", stock: 0 },
  { codigo: "ME0084", categoria: "METALES", material: 'Tubo Redondo ø 2" x 1/8', descripcion: 'Tubo Redondo ø 2" x 1/8', unidad: "UNIDADES", stock: 0 },
  { codigo: "ME0083", categoria: "METALES", material: 'Tubo Cuadrado □ 2" x 1/8', descripcion: 'Tubo Cuadrado □ 2" x 1/8', unidad: "UNIDADES", stock: 0 },
  { codigo: "ME0082", categoria: "METALES", material: 'Platina 1" x 3/16', descripcion: 'Platina 1" x 3/16', unidad: "UNIDADES", stock: 0 },
  { codigo: "ME0081", categoria: "METALES", material: 'Platina 2" x 3/16', descripcion: 'Platina 2" x 3/16', unidad: "UNIDADES", stock: 0 },
  { codigo: "ME0080", categoria: "METALES", material: 'Platina 1-1/2" x 3/16', descripcion: 'Platina 1-1/2" x 3/16', unidad: "UNIDADES", stock: 0 },
  { codigo: "ME0079", categoria: "METALES", material: 'Angular 2" x 1/8', descripcion: 'Angular 2" x 1/8', unidad: "UNIDADES", stock: 0 },
  { codigo: "ME0078", categoria: "METALES", material: 'Angular 1-1/2" x 1/8', descripcion: 'Angular 1-1/2" x 1/8', unidad: "UNIDADES", stock: 0 },
  { codigo: "ME0077", categoria: "METALES", material: 'Angular 1" x 1/8', descripcion: 'Angular 1" x 1/8', unidad: "UNIDADES", stock: 0 },
  { codigo: "ME0076", categoria: "METALES", material: "Lámina 3/16 x 4 x 10", descripcion: "Lámina 3/16 x 4 x 10", unidad: "UNIDADES", stock: 0 },
  { codigo: "ME0075", categoria: "METALES", material: "Lámina 1/8 x 4 x 10", descripcion: "Lámina 1/8 x 4 x 10", unidad: "UNIDADES", stock: 0 },
  { codigo: "ME0074", categoria: "METALES", material: "Lámina 3/32 x 4 x 10", descripcion: "Lámina 3/32 x 4 x 10", unidad: "UNIDADES", stock: 0 },
  { codigo: "ME0073", categoria: "METALES", material: "Lámina 1/16 x 4 x 10", descripcion: "Lámina 1/16 x 4 x 10", unidad: "UNIDADES", stock: 0 },
  { codigo: "SO0072", categoria: "SOLDADURA", material: "Electrodo Aporte 3/32", descripcion: "Electrodo Aporte 3/32", unidad: "UNIDADES", stock: 0 },
  { codigo: "SO0071", categoria: "SOLDADURA", material: "Electrodo Aporte 1/16", descripcion: "Electrodo Aporte 1/16", unidad: "UNIDADES", stock: 0 },
  { codigo: "SO0070", categoria: "SOLDADURA", material: "Aluminio 1/8", descripcion: "Aluminio 1/8", unidad: "UNIDADES", stock: 0 },
  { codigo: "SO0069", categoria: "SOLDADURA", material: "Acero Inox 3/32", descripcion: "Acero Inox 3/32", unidad: "UNIDADES", stock: 0 },
  { codigo: "SO0068", categoria: "SOLDADURA", material: "Hierro Colado 1/8", descripcion: "Hierro Colado 1/8", unidad: "UNIDADES", stock: 0 },
  { codigo: "SO0067", categoria: "SOLDADURA", material: "Soldadura 6013 - 3/32", descripcion: "Soldadura 6013 - 3/32", unidad: "LIBRAS", stock: 0 },
  { codigo: "SO0066", categoria: "SOLDADURA", material: "Soldadura 6013 - 1/8", descripcion: "Soldadura 6013 - 1/8", unidad: "LIBRAS", stock: 0 },
  { codigo: "LI0065", categoria: "LIJAS", material: "Lija #120", descripcion: "Lija #120", unidad: "UNIDADES", stock: 0 },
  { codigo: "LI0064", categoria: "LIJAS", material: "Lija #100", descripcion: "Lija #100", unidad: "UNIDADES", stock: 0 },
  { codigo: "LI0063", categoria: "LIJAS", material: "Lija #80", descripcion: "Lija #80", unidad: "UNIDADES", stock: -9 },
  { codigo: "LI0062", categoria: "LIJAS", material: "Lija #40", descripcion: "Lija #40", unidad: "UNIDADES", stock: 0 },
  { codigo: "DI0061", categoria: "DISCOS", material: 'Disco Corte 9"', descripcion: 'Disco Corte 9"', unidad: "UNIDADES", stock: 0 },
  { codigo: "DI0060", categoria: "DISCOS", material: 'Disco de Cartón 4-1/2"', descripcion: 'Disco de Cartón 4-1/2"', unidad: "UNIDADES", stock: 0 },
  { codigo: "DI0059", categoria: "DISCOS", material: 'Disco Desbaste 4-1/2"', descripcion: 'Disco Desbaste 4-1/2"', unidad: "UNIDADES", stock: 0 },
  { codigo: "DI0058", categoria: "DISCOS", material: 'Disco Corte 4-1/2"', descripcion: 'Disco Corte 4-1/2"', unidad: "UNIDADES", stock: 0 },
  { codigo: "CH0057", categoria: "CHUMAZERAS PIE", material: 'Chumacera Pie 2"', descripcion: 'Chumacera Pie 2"', unidad: "UNIDADES", stock: 3 },
  { codigo: "CH0056", categoria: "CHUMAZERAS PIE", material: 'Chumacera Pie 1-1/2"', descripcion: 'Chumacera Pie 1-1/2"', unidad: "UNIDADES", stock: 4 },
  { codigo: "CH0055", categoria: "CHUMAZERAS PIE", material: 'Chumacera Pie 1-1/4"', descripcion: 'Chumacera Pie 1-1/4"', unidad: "UNIDADES", stock: 8 },
  { codigo: "CH0054", categoria: "CHUMAZERAS PIE", material: 'Chumacera Pie 1"', descripcion: 'Chumacera Pie 1"', unidad: "UNIDADES", stock: 4 },
  { codigo: "CH0053", categoria: "CHUMAZERAS FLANCH", material: 'Chumacera Flanch 2"', descripcion: 'Chumacera Flanch 2"', unidad: "UNIDADES", stock: 6 },
  { codigo: "CH0052", categoria: "CHUMAZERAS FLANCH", material: 'Chumacera Flanch 1-1/2"', descripcion: 'Chumacera Flanch 1-1/2"', unidad: "UNIDADES", stock: 9 },
  { codigo: "CH0051", categoria: "CHUMAZERAS FLANCH", material: 'Chumacera Flanch 1-1/4"', descripcion: 'Chumacera Flanch 1-1/4"', unidad: "UNIDADES", stock: 6 },
  { codigo: "CH0050", categoria: "CHUMAZERAS FLANCH", material: 'Chumacera Flanch 1"', descripcion: 'Chumacera Flanch 1"', unidad: "UNIDADES", stock: 3 },
  { codigo: "TU0049", categoria: "TUERCAS", material: 'Tuerca 1/2"', descripcion: 'Tuerca 1/2"', unidad: "UNIDADES", stock: 0 },
  { codigo: "TU0048", categoria: "TUERCAS", material: 'Tuerca 3/8"', descripcion: 'Tuerca 3/8"', unidad: "UNIDADES", stock: -6 },
  { codigo: "TU0047", categoria: "TUERCAS", material: 'Tuerca 5/16"', descripcion: 'Tuerca 5/16"', unidad: "UNIDADES", stock: 1037 },
  { codigo: "TU0046", categoria: "TUERCAS", material: 'Tuerca 1/4"', descripcion: 'Tuerca 1/4"', unidad: "UNIDADES", stock: 0 },
  { codigo: "AR0045", categoria: "ARANDELAS DE PRESIÓN", material: 'Presión 1/2"', descripcion: 'Presión 1/2"', unidad: "UNIDADES", stock: 0 },
  { codigo: "AR0044", categoria: "ARANDELAS DE PRESIÓN", material: 'Presión 3/8"', descripcion: 'Presión 3/8"', unidad: "UNIDADES", stock: 0 },
  { codigo: "AR0043", categoria: "ARANDELAS DE PRESIÓN", material: 'Presión 5/16"', descripcion: 'Presión 5/16"', unidad: "UNIDADES", stock: 0 },
  { codigo: "AR0042", categoria: "ARANDELAS DE PRESIÓN", material: 'Presión 1/4"', descripcion: 'Presión 1/4"', unidad: "UNIDADES", stock: 0 },
  { codigo: "AR0041", categoria: "ARANDELAS LISAS", material: 'Lisa 1/2"', descripcion: 'Lisa 1/2"', unidad: "UNIDADES", stock: -6 },
  { codigo: "AR0040", categoria: "ARANDELAS LISAS", material: 'Lisa 3/8"', descripcion: 'Lisa 3/8"', unidad: "UNIDADES", stock: 0 },
  { codigo: "AR0039", categoria: "ARANDELAS LISAS", material: 'Lisa 5/16"', descripcion: 'Lisa 5/16"', unidad: "UNIDADES", stock: 0 },
  { codigo: "AR0038", categoria: "ARANDELAS LISAS", material: 'Lisa 1/4"', descripcion: 'Lisa 1/4"', unidad: "UNIDADES", stock: 0 },
  { codigo: "PE0037", categoria: "PERNOS", material: '3/8 x 4"', descripcion: '3/8 x 4"', unidad: "UNIDADES", stock: 0 },
  { codigo: "PE0036", categoria: "PERNOS", material: '3/8 x 3 1/4"', descripcion: '3/8 x 3 1/4"', unidad: "UNIDADES", stock: 0 },
  { codigo: "PE0035", categoria: "PERNOS", material: '3/8 x 3"', descripcion: '3/8 x 3"', unidad: "UNIDADES", stock: 0 },
  { codigo: "PE0034", categoria: "PERNOS", material: '3/8 x 2 1/2"', descripcion: '3/8 x 2 1/2"', unidad: "UNIDADES", stock: 67 },
  { codigo: "PE0033", categoria: "PERNOS", material: '3/8 x 2 1/4"', descripcion: '3/8 x 2 1/4"', unidad: "UNIDADES", stock: 0 },
  { codigo: "PE0032", categoria: "PERNOS", material: '3/8 x 2"', descripcion: '3/8 x 2"', unidad: "UNIDADES", stock: 4 },
  { codigo: "PE0031", categoria: "PERNOS", material: '3/8 x 1 1/2"', descripcion: '3/8 x 1 1/2"', unidad: "UNIDADES", stock: -17 },
  { codigo: "PE0030", categoria: "PERNOS", material: '3/8 x 1 1/4"', descripcion: '3/8 x 1 1/4"', unidad: "UNIDADES", stock: 0 },
  { codigo: "PE0029", categoria: "PERNOS", material: '3/8 x 1"', descripcion: '3/8 x 1"', unidad: "UNIDADES", stock: 0 },
  { codigo: "PE0028", categoria: "PERNOS", material: '3/8 x 3/4"', descripcion: '3/8 x 3/4"', unidad: "UNIDADES", stock: 0 },
  { codigo: "PE0027", categoria: "PERNOS", material: '3/8 x 1/2"', descripcion: '3/8 x 1/2"', unidad: "UNIDADES", stock: -8 },
  { codigo: "PE0026", categoria: "PERNOS", material: '3/8 x 1/4"', descripcion: '3/8 x 1/4"', unidad: "UNIDADES", stock: 0 },
  { codigo: "PE0025", categoria: "PERNOS", material: '3/8 x 1/8"', descripcion: '3/8 x 1/8"', unidad: "UNIDADES", stock: 0 },
  { codigo: "PE0024", categoria: "PERNOS", material: '1/2 x 4"', descripcion: '1/2 x 4"', unidad: "UNIDADES", stock: 0 },
  { codigo: "PE0023", categoria: "PERNOS", material: '1/2 x 3"', descripcion: '1/2 x 3"', unidad: "UNIDADES", stock: 0 },
  { codigo: "PE0022", categoria: "PERNOS", material: '1/2 x 1 1/2"', descripcion: '1/2 x 1 1/2"', unidad: "UNIDADES", stock: 0 },
  { codigo: "PE0021", categoria: "PERNOS", material: '1/2 x 1 1/4"', descripcion: '1/2 x 1 1/4"', unidad: "UNIDADES", stock: 0 },
  { codigo: "PE0020", categoria: "PERNOS", material: '1/2 x 1"', descripcion: '1/2 x 1"', unidad: "UNIDADES", stock: 0 },
  { codigo: "PE0019", categoria: "PERNOS", material: '1/2 x 3/4"', descripcion: '1/2 x 3/4"', unidad: "UNIDADES", stock: 0 },
  { codigo: "PE0018", categoria: "PERNOS", material: '1/2 x 1/2"', descripcion: '1/2 x 1/2"', unidad: "UNIDADES", stock: 0 },
  { codigo: "PE0017", categoria: "PERNOS", material: '5/16 x 3"', descripcion: '5/16 x 3"', unidad: "UNIDADES", stock: 0 },
  { codigo: "PE0016", categoria: "PERNOS", material: '5/16 x 2 1/2"', descripcion: '5/16 x 2 1/2"', unidad: "UNIDADES", stock: 0 },
  { codigo: "PE0015", categoria: "PERNOS", material: '5/16 x 2"', descripcion: '5/16 x 2"', unidad: "UNIDADES", stock: 0 },
  { codigo: "PE0014", categoria: "PERNOS", material: '5/16 x 1 1/2"', descripcion: '5/16 x 1 1/2"', unidad: "UNIDADES", stock: 0 },
  { codigo: "PE0013", categoria: "PERNOS", material: '5/16 x 1 1/4"', descripcion: '5/16 x 1 1/4"', unidad: "UNIDADES", stock: 0 },
  { codigo: "PE0012", categoria: "PERNOS", material: '5/16 x 1"', descripcion: '5/16 x 1"', unidad: "UNIDADES", stock: 0 },
  { codigo: "PE0011", categoria: "PERNOS", material: '5/16 x 3/4"', descripcion: '5/16 x 3/4"', unidad: "UNIDADES", stock: 0 },
  { codigo: "PE0010", categoria: "PERNOS", material: 'Perno 5/16 x 1/2"', descripcion: 'Perno 5/16 x 1/2"', unidad: "UNIDADES", stock: 0 },
  { codigo: "PE0009", categoria: "PERNOS", material: 'Perno 5/16 x 1/4"', descripcion: 'Perno 5/16 x 1/4"', unidad: "UNIDADES", stock: 0 },
  { codigo: "PE0008", categoria: "PERNOS", material: 'Perno 1/4 x 3"', descripcion: 'Perno 1/4 x 3"', unidad: "UNIDADES", stock: 34 },
  { codigo: "PE0007", categoria: "PERNOS", material: 'Perno 1/4 x 2 1/2"', descripcion: 'Perno 1/4 x 2 1/2"', unidad: "UNIDADES", stock: 0 },
  { codigo: "PE0006", categoria: "PERNOS", material: 'Perno 1/4 x 2"', descripcion: 'Perno 1/4 x 2"', unidad: "UNIDADES", stock: 0 },
  { codigo: "PE0005", categoria: "PERNOS", material: 'Perno 1/4 x 1 1/4"', descripcion: 'Perno 1/4 x 1 1/4"', unidad: "UNIDADES", stock: 0 },
  { codigo: "PE0004", categoria: "PERNOS", material: 'Perno 1/4 x 1 1/2"', descripcion: 'Perno 1/4 x 1 1/2"', unidad: "UNIDADES", stock: 0 },
  { codigo: "PE0003", categoria: "PERNOS", material: 'Perno 1/4 x 1"', descripcion: 'Perno 1/4 x 1"', unidad: "UNIDADES", stock: 0 },
  { codigo: "PE0002", categoria: "PERNOS", material: 'Perno 1/4 x 3/4"', descripcion: 'Perno 1/4 x 3/4"', unidad: "UNIDADES", stock: 0 },
  { codigo: "PE0001", categoria: "PERNOS", material: 'Perno 1/4 x 1/2"', descripcion: 'Perno 1/4 x 1/2"', unidad: "UNIDADES", stock: 0 },
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1'];

// --- FIREBASE SETUP (CREDENCIALES REALES DEL USUARIO) ---
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

// ID FIJO PARA COMPARTIR DATOS ENTRE TODAS LAS COMPUTADORAS
const appId = "inventario_compartido";

// Use PUBLIC data path
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
        {trend === 'up' ? '+2.5% vs mes anterior' : 'Requiere atención'}
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

// --- MODAL PARA MOVIMIENTOS ---
const MovementModal = ({ isOpen, onClose, item, onSave }) => {
  const [amount, setAmount] = useState(1);
  const [type, setType] = useState('entry'); // 'entry' or 'exit'

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
            <p className="text-sm text-slate-500 mb-1">Material seleccionado:</p>
            <p className="font-semibold text-lg text-slate-800">{item.material}</p>
            <p className="text-xs text-slate-400 font-mono">{item.codigo} • Stock Actual: {item.stock}</p>
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
              <span>Advertencia: Esta salida dejará el stock en negativo ({item.stock - amount}).</span>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors">
            Cancelar
          </button>
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

// --- MODAL PARA NUEVOS PRODUCTOS ---
const NewItemModal = ({ isOpen, onClose, onSave, categories }) => {
  const [formData, setFormData] = useState({
    codigo: '',
    material: '',
    categoria: '',
    unidad: 'UNIDADES',
    stock: 0
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        codigo: '',
        material: '',
        categoria: categories[0] || 'GENERAL',
        unidad: 'UNIDADES',
        stock: 0
      });
    }
  }, [isOpen, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.codigo || !formData.material) return;
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-700 flex items-center gap-2">
            <Package size={20} className="text-blue-500" /> Nuevo Producto
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
                placeholder="Ej. PE0999"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={formData.codigo}
                onChange={(e) => setFormData({...formData, codigo: e.target.value})}
              />
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Stock Inicial</label>
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
              <Save size={18} /> Guardar Producto
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
  
  // ESTADO DE DATOS (Mutable - Cloud Sync)
  const [inventoryData, setInventoryData] = useState([]); // Empty initial state, will fetch from cloud
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null); // Nuevo estado para capturar el error de config

  // ESTADO DE MODALES
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // --- 1. AUTENTICACIÓN ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (error) {
        console.error("Auth failed:", error);
        // Si falla con 'configuration-not-found', capturamos el error para mostrar ayuda
        if (error.code === 'auth/configuration-not-found' || error.message.includes('configuration-not-found')) {
          setAuthError('AUTH_CONFIG_MISSING');
        }
      }
    };
    initAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setAuthError(null); // Limpiar error si se conecta
      }
      if (!currentUser && !authError) setLoading(false);
    });
    return () => unsubscribe();
  }, [authError]);

  // --- 2. SINCRONIZACIÓN DE DATOS (REALTIME DATABASE) ---
  useEffect(() => {
    if (!user) return;

    // Escuchar la referencia "inventory" en tiempo real
    const inventoryRef = ref(db, DB_PATH);
    const unsubscribe = onValue(inventoryRef, (snapshot) => {
      const data = snapshot.val();
      
      if (!data) {
        // --- SEEDING AUTOMÁTICO ---
        // Si no hay datos, subimos los iniciales automáticamente
        console.log("Database empty. Seeding initial data...");
        const updates = {};
        INITIAL_DATA.forEach(item => {
           updates[item.codigo] = item;
        });
        update(inventoryRef, updates);
        console.log("Seeding complete!");
      } else {
        // Transformar objeto { id: {...} } a array [{...}, {...}]
        const list = Object.values(data);
        setInventoryData(list);
        setLoading(false);
      }
    }, (error) => {
      console.error("Error fetching data:", error);
      setLoading(false);
    });

    // onValue returns the unsubscribe function directly
    return () => unsubscribe();
  }, [user]);

  // --- 3. LÓGICA DE ACTUALIZACIÓN (CLOUD - REALTIME DB) ---
  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleUpdateStock = async (codigo, cantidad, tipo, stockActual) => {
    if (!user) return;
    
    const adjustment = tipo === 'entry' ? cantidad : -cantidad;
    const nuevoStock = stockActual + adjustment;

    // Actualizar directamente en Realtime Database
    try {
      const itemRef = ref(db, `${DB_PATH}/${codigo}`);
      await update(itemRef, { stock: nuevoStock });
    } catch (e) {
      console.error("Error updating stock:", e);
      alert("Error al actualizar. Verifique su conexión.");
    }
  };

  const handleAddItem = async (newItem) => {
    if (!user) return;

    const itemWithDesc = { ...newItem, descripcion: newItem.material };
    
    try {
      // Guardar nuevo nodo en Realtime Database
      const itemRef = ref(db, `${DB_PATH}/${newItem.codigo}`);
      await set(itemRef, itemWithDesc);
      
      setActiveTab('inventory');
      setSearchTerm(newItem.codigo);
    } catch (e) {
      console.error("Error adding item:", e);
      alert("Error al guardar el producto.");
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

  // --- RENDERIZADO CONDICIONAL DE ERRORES ---
  if (authError === 'AUTH_CONFIG_MISSING') {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
          <div className="bg-amber-500 p-6 flex items-center justify-center">
            <Lock className="text-white w-16 h-16" />
          </div>
          <div className="p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">¡Falta un paso en Firebase!</h2>
            <p className="text-slate-600 mb-6 text-center">
              Para que la aplicación funcione, debes habilitar el <strong>"Inicio de sesión anónimo"</strong> en tu consola de Firebase. Es gratis y seguro.
            </p>
            
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 mb-6">
              <h3 className="font-semibold text-slate-700 mb-2">Instrucciones:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
                <li>Ve a <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">console.firebase.google.com</a></li>
                <li>Entra a tu proyecto <strong>control-isc</strong>.</li>
                <li>En el menú izquierdo, clic en <strong>Compilación &gt; Authentication</strong>.</li>
                <li>Clic en <strong>Comenzar (Get Started)</strong>.</li>
                <li>Ve a la pestaña <strong>Sign-in method</strong>.</li>
                <li>Busca <strong>Anónimo (Anonymous)</strong> en la lista.</li>
                <li>Actívalo (Habilitar) y da clic en <strong>Guardar</strong>.</li>
              </ol>
            </div>
            
            <button 
              onClick={() => window.location.reload()} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              ¡Listo! Recargar página
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
     return (
       <div className="h-screen flex items-center justify-center bg-emerald-900 text-white flex-col gap-4">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
         <p className="animate-pulse">Conectando a la base de datos...</p>
       </div>
     );
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* SIDEBAR VERDE */}
      <aside 
        className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-emerald-900 text-white transition-all duration-300 flex flex-col fixed h-full z-20 md:relative shadow-xl`}
      >
        <div className="p-6 flex flex-col justify-center h-20">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white leading-tight">CONTROL <span className="text-emerald-400">ISC</span></h1>
                <p className="text-xs text-emerald-200 font-normal tracking-wide mt-[-2px]">Matagalpa</p>
              </div>
            )}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded hover:bg-emerald-800 text-emerald-100 self-center">
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-900/50' : 'text-emerald-100 hover:bg-emerald-800 hover:text-white'}`}
          >
            <LayoutDashboard size={20} />
            {sidebarOpen && <span>Dashboard General</span>}
          </button>
          
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'inventory' ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-900/50' : 'text-emerald-100 hover:bg-emerald-800 hover:text-white'}`}
          >
            <Package size={20} />
            {sidebarOpen && <span>Tabla de Materiales</span>}
          </button>
        </nav>

        <div className="p-4 border-t border-emerald-800">
          {sidebarOpen && (
            <div className="text-xs text-emerald-300 flex items-center gap-2">
              <Cloud size={14} />
              <div>
                <p>Estado: En línea</p>
                <p className="opacity-70">Sincronización activa</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {activeTab === 'dashboard' ? 'Visión General' : 'Gestión de Materiales'}
            </h2>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
               <Wifi size={14} className="text-emerald-500" />
               <span>Conectado a la base de datos central</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-white p-2 rounded-full shadow-sm border border-slate-200">
               <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">JD</div>
            </div>
          </div>
        </header>

        {/* CONTENIDO DEL DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            
            {/* KPI CARDS (Sin Valor Estimado) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card title="Total Productos" value={totalItems} icon={Package} color="blue" trend="up" />
              <Card title="Stock Total (Unidades)" value={totalStock} icon={BarChartIcon} color="emerald" trend="up" />
              <Card title="Sin Stock (Crítico)" value={outOfStock} icon={AlertTriangle} color="red" trend="down" />
            </div>

            {/* GRÁFICOS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Gráfico Principal */}
              <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Stock por Categoría (Top 7)</h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData} layout="vertical" margin={{ left: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={100} tick={{fill: '#64748b', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        cursor={{fill: '#f1f5f9'}}
                      />
                      <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Lista de Alertas */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                  <AlertTriangle className="text-amber-500 mr-2" size={20}/>
                  Stock Bajo / Crítico
                </h3>
                <div className="overflow-y-auto h-80 pr-2 space-y-3">
                  {lowStockItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
                      <div className="truncate pr-2">
                        <p className="font-medium text-slate-700 text-sm truncate">{item.material}</p>
                        <p className="text-xs text-slate-400">{item.codigo}</p>
                      </div>
                      <div className="flex items-center gap-2">
                         <Badge type={item.stock <= 0 ? "danger" : "warning"}>
                          {item.stock} un.
                        </Badge>
                        <button 
                          onClick={() => handleOpenModal(item)}
                          className="p-1 hover:bg-slate-200 rounded text-slate-500"
                          title="Ajustar rápido"
                        >
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

        {/* CONTENIDO DE LA TABLA */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-[calc(100vh-200px)] animate-in fade-in duration-500">
            
            {/* Toolbar de Filtros */}
            <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
              
              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto flex-1">
                 <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Buscar por código, material..." 
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

              {/* Botón de Nuevo Material */}
              <button 
                onClick={() => setIsNewItemModalOpen(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm whitespace-nowrap"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Nuevo Material</span>
              </button>
            </div>

            {/* Tabla con Sticky Header */}
            <div className="overflow-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 sticky top-0 z-10">
                  <tr>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b">Código</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b">Material</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b hidden md:table-cell">Categoría</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b text-right">Stock Actual</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b text-center">Estado</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b text-center">Acciones</th>
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
                        <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-xs font-medium text-slate-600">
                          {item.categoria}
                        </span>
                      </td>
                      <td className={`p-4 text-lg font-bold text-right ${item.stock < 0 ? 'text-red-600' : 'text-slate-800'}`}>
                        {item.stock}
                      </td>
                      <td className="p-4 text-center">
                        {item.stock <= 0 ? (
                          <Badge type="danger">{item.stock < 0 ? 'Déficit' : 'Agotado'}</Badge>
                        ) : item.stock <= 5 ? (
                          <Badge type="warning">Bajo</Badge>
                        ) : (
                          <Badge type="success">En Stock</Badge>
                        )}
                      </td>
                      <td className="p-4 text-center">
                         <button 
                           onClick={() => handleOpenModal(item)}
                           className="text-blue-600 hover:text-blue-800 font-medium text-sm px-3 py-1 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                         >
                           Ajustar Stock
                         </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-slate-400">
                        No se encontraron materiales con esa búsqueda.
                      </td>
                    </tr>
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
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        item={selectedItem}
        onSave={handleUpdateStock}
      />
      
      <NewItemModal
        isOpen={isNewItemModalOpen}
        onClose={() => setIsNewItemModalOpen(false)}
        onSave={handleAddItem}
        categories={rawCategories}
      />

    </div>
  );
}