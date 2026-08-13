import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  DollarSign,
  Users,
  Utensils,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle2,
  ChevronRight,
  Flame,
  ShoppingBag,
  Sparkles,
  ArrowUpRight,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { Order, Table, InventoryItem, StaffMember, ModuleType, User } from '../types';

interface DashboardProps {
  orders: Order[];
  tables: Table[];
  inventory: InventoryItem[];
  staff: StaffMember[];
  isAmharic: boolean;
  setCurrentModule: (mod: ModuleType) => void;
  onQuickUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  currentUser?: User | null;
}

export const DashboardModule: React.FC<DashboardProps> = ({
  orders,
  tables,
  inventory,
  staff,
  isAmharic,
  setCurrentModule,
  onQuickUpdateOrderStatus,
  currentUser
}) => {
  const userRole = currentUser?.role || 'Manager';
  const userName = currentUser?.name || 'Abebe';
  // Calculations
  const occupiedTables = tables.filter((t) => t.status === 'Occupied').length;
  const pendingOrders = orders.filter(
    (o) => o.status === 'Pending' || o.status === 'Kitchen Preparing'
  );
  const lowStockItems = inventory.filter((i) => i.status === 'Low Stock' || i.status === 'Critical');

  const totalRevenueETB = 48250 + orders.reduce((sum, o) => sum + o.grandTotalETB, 0);

  // Hourly Revenue Trends Data for Dinner Service
  const hourlyRevenueData = [
    { time: '12:00', revenue: 4200, target: 4000, ordersCount: 8 },
    { time: '13:00', revenue: 5600, target: 5000, ordersCount: 12 },
    { time: '14:00', revenue: 6800, target: 6000, ordersCount: 15 },
    { time: '15:00', revenue: 4100, target: 4500, ordersCount: 9 },
    { time: '16:00', revenue: 3500, target: 4000, ordersCount: 7 },
    { time: '17:00', revenue: 7800, target: 7000, ordersCount: 16 },
    { time: '18:00', revenue: 11200, target: 9500, ordersCount: 24 },
    { time: '19:00', revenue: 14800, target: 12000, ordersCount: 31 },
    { time: '20:00', revenue: 18250, target: 15000, ordersCount: 38 },
    { time: '21:00 (Est)', revenue: 12000, target: 11000, ordersCount: 25 },
    { time: '22:00 (Est)', revenue: 6500, target: 6000, ordersCount: 14 }
  ];

  // Top Dishes
  const topDishes = [
    { name: 'Special Kitfo', sales: 48, color: '#f59e0b' },
    { name: 'Doro Wat Feast', sales: 36, color: '#ef4444' },
    { name: 'Shekla Tibs', sales: 42, color: '#10b981' },
    { name: 'Honey Tej (750ml)', sales: 55, color: '#fbbf24' },
    { name: 'Quattro Formaggi', sales: 28, color: '#8b5cf6' }
  ];

  // CSV Export Handler
  const handleExportCSV = () => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];

    let csvContent = `BELLA VISTA SERVEPOINT - DAILY REVENUE & STATISTICS REPORT\n`;
    csvContent += `Report Date,${now.toLocaleDateString()} ${now.toLocaleTimeString()}\n`;
    csvContent += `Total Revenue Today (ETB),${totalRevenueETB}\n`;
    csvContent += `Total Active Orders Count,${orders.length}\n`;
    csvContent += `Occupied Tables,${occupiedTables} / 20\n`;
    csvContent += `Pending Kitchen Tickets,${pendingOrders.length}\n`;
    csvContent += `Low Stock Alerts,${lowStockItems.length}\n\n`;

    csvContent += `ORDER BREAKDOWN\n`;
    csvContent += `Order ID,Table Name,Server Name,Order Type,Status,Subtotal (ETB),VAT (ETB),Service Charge (ETB),Grand Total (ETB),Items List\n`;

    orders.forEach((ord) => {
      const itemsList = ord.items
        .map((i) => `${i.quantity}x ${i.name}`)
        .join('; ')
        .replace(/"/g, '""');

      csvContent += `"${ord.id}","${ord.tableName || `Table ${ord.tableId}`}","${ord.serverName}","${ord.type}","${ord.status}",${ord.subtotalETB},${ord.vatETB},${ord.serviceChargeETB},${ord.grandTotalETB},"${itemsList}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `BellaVista_Daily_Revenue_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              {isAmharic ? 'የቤላ ቪስታ የቀጥታ ዳሽቦርድ' : 'Bella Vista ServePoint Dashboard'}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
              {userRole}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            {isAmharic
              ? `እንኳን ደህና መጡ ${userName}! (${userRole}) - የእራት አገልግሎት በከፍተኛ ሁኔታ ላይ ነው`
              : `Welcome back, ${userName}! (${userRole}) • Dinner Service Active`}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 uppercase tracking-wider font-medium">
            {isAmharic
              ? 'ቦሌ መንገድ አዲስ አበባ | 20 ጠረጴዛዎች | የቴሌብር እና በኢትዮጵያ ብር ክፍያዎች'
              : 'Bole Road, Addis Ababa • 20 Tables Online • Telebirr & CBE Birr Ready'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
            title="Export daily revenue and order statistics as CSV"
          >
            <Download className="h-4 w-4 text-emerald-600" />
            <span>{isAmharic ? 'CSV ሪፖርት አውርድ' : 'Export CSV'}</span>
          </button>

          <button
            onClick={() => setCurrentModule('pos')}
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-slate-800 transition-colors shadow-2xs"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>{isAmharic ? '+ አዲስ ትዕዛዝ ክፈት' : '+ New Order (POS)'}</span>
          </button>

          <button
            onClick={() => setCurrentModule('floor')}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-100 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <Utensils className="h-4 w-4 text-slate-500" />
            <span>{isAmharic ? 'ወለል ተመልከት' : 'Floor Plan'}</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs relative group hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isAmharic ? 'የዛሬው ጠቅላላ ገቢ (ብር)' : "Daily Revenue"}
            </span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600 border border-emerald-200">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-800">
              {totalRevenueETB.toLocaleString()} <span className="text-xs text-slate-500 font-medium">ETB</span>
            </span>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600">
              <ArrowUpRight className="h-3.5 w-3.5" /> +18.4%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {isAmharic ? 'ትላንት ከነበረው +7,400 ETB በልጧል' : '↑ 12% vs yesterday'}
          </p>
        </div>

        {/* Occupied Tables */}
        <div
          onClick={() => setCurrentModule('floor')}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs cursor-pointer hover:border-slate-300 transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isAmharic ? 'የተያዙ ጠረጴዛዎች' : 'Active Tables'}
            </span>
            <div className="rounded-lg bg-slate-100 p-2 text-slate-700 border border-slate-200">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-800">
              {occupiedTables} <span className="text-xs font-normal text-slate-400">/ 20</span>
            </span>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
              {Math.round((occupiedTables / 20) * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-emerald-500 h-full" style={{ width: `${(occupiedTables / 20) * 100}%` }} />
          </div>
        </div>

        {/* Kitchen Tickets */}
        <div
          onClick={() => setCurrentModule('pos')}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs cursor-pointer hover:border-slate-300 transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isAmharic ? 'በወጥ ቤት ዝግጅት ላይ' : 'Pending Orders'}
            </span>
            <div className="rounded-lg bg-orange-50 p-2 text-orange-600 border border-orange-200">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-800">
              {pendingOrders.length}
            </span>
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
              Avg 14m
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {isAmharic ? 'የቅርብ ጊዜ: ጠረጴዛ 5 እና ጠረጴዛ 3' : 'Avg wait: 14 mins'}
          </p>
        </div>

        {/* Low Stock Alert */}
        <div
          onClick={() => setCurrentModule('inventory')}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs cursor-pointer hover:border-rose-300 transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isAmharic ? 'ዝቅተኛ የዕቃዎች ክምችት' : 'Low Stock Alerts'}
            </span>
            <div className="rounded-lg bg-rose-50 p-2 text-rose-600 border border-rose-200">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-rose-600">
              {lowStockItems.length}
            </span>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              Alert
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {isAmharic ? 'የጤፍ ዱቄት እና የበሬ ሥጋ አልቋል' : 'Coffee, Teff, Butter'}
          </p>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Revenue Trends Recharts Line Chart */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                {isAmharic ? 'የሰዓታት የገቢ ፍሰት መስመር ገበታ (Hourly Revenue Line Chart)' : 'Hourly Revenue Trends (Dinner Service)'}
              </h3>
              <p className="text-xs text-slate-500">
                {isAmharic ? 'የዛሬው የእራት ሰዓት ገቢ እና የዒላማ ማነፃፀሪያ' : 'Real-time ETB hourly revenue vs. benchmark target throughout service'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-600" /> Peak 20:00
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyRevenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '0.5rem',
                    color: '#1e293b',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  formatter={(value: any, name: any) => [
                    `${Number(value).toLocaleString()} ETB`,
                    name === 'revenue' ? 'Today Revenue' : 'Target Benchmark'
                  ]}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  height={30}
                  wrapperStyle={{ fontSize: '11px', fontWeight: 600 }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Today Revenue (ETB)"
                  stroke="#059669"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#059669' }}
                  activeDot={{ r: 7, stroke: '#047857', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  name="Target Benchmark"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3, fill: '#94a3b8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling Dishes Bar Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                {isAmharic ? 'በጣም ተወዳጅ ምግቦች' : 'Top Selling Items'}
              </h3>
              <p className="text-xs text-slate-500">
                {isAmharic ? 'የዛሬው ተፈላጊ ምግቦች ብዛት' : 'Orders count today'}
              </p>
            </div>
            <Flame className="h-5 w-5 text-orange-500" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topDishes} layout="vertical" margin={{ top: 0, right: 10, left: 20, bottom: 0 }}>
                <XAxis type="number" stroke="#64748b" fontSize={11} hide />
                <YAxis dataKey="name" type="category" stroke="#334155" fontSize={11} tickLine={false} axisLine={false} width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '0.5rem'
                  }}
                />
                <Bar dataKey="sales" radius={[0, 4, 4, 0]}>
                  {topDishes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Live Active Kitchen Tickets & Waiter Shift Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Kitchen Tickets with Motion Fade-In Animation */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-800">
                {isAmharic ? 'የወጥ ቤት ንቁ ትዕዛዞች (KDS Live)' : 'Kitchen Queue'}
              </h3>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700 border border-slate-200">
                {orders.length} Active
              </span>
            </div>
            <button
              onClick={() => setCurrentModule('pos')}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1"
            >
              {isAmharic ? 'ሁሉንም POS ትዕዛዞች ተመልከት' : 'Open Full POS Matrix'} <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {orders.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No pending kitchen tickets. All tables served!
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {orders.map((ord) => (
                  <motion.div
                    key={ord.id}
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -12, scale: 0.95 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-slate-300 transition-colors border-l-4 border-l-orange-400"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-xs sm:text-sm">
                          {ord.tableName || `Table ${ord.tableId}`}
                        </span>
                        <span className="text-xs text-slate-500">• {ord.serverName}</span>
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 font-mono">
                          {ord.id}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1">
                        {ord.items.map((i) => `• ${i.quantity}x ${i.name}`).join(' ')}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-800 font-mono">
                        {ord.grandTotalETB.toLocaleString()} ETB
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ord.status === 'Kitchen Preparing'
                            ? 'bg-orange-100 text-orange-700'
                            : ord.status === 'Ready'
                            ? 'bg-emerald-100 text-emerald-700'
                            : ord.status === 'Served'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {ord.status}
                      </span>

                      {ord.status === 'Kitchen Preparing' && (
                        <button
                          onClick={() => onQuickUpdateOrderStatus(ord.id, 'Ready')}
                          className="rounded bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors shadow-2xs"
                        >
                          {isAmharic ? 'ዝግጁ አድርግ' : 'Mark Ready'}
                        </button>
                      )}
                      {ord.status === 'Ready' && (
                        <button
                          onClick={() => onQuickUpdateOrderStatus(ord.id, 'Served')}
                          className="rounded bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-2xs"
                        >
                          {isAmharic ? 'ቀራረብ' : 'Mark Served'}
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Staff Shift Highlights */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">
              {isAmharic ? 'የእራት ፈረቃ ሰራተኞች' : 'On-Duty Staff'}
            </h3>
            <button
              onClick={() => setCurrentModule('staff')}
              className="text-xs text-slate-600 font-semibold hover:text-slate-900"
            >
              {isAmharic ? 'አስተዳድር' : 'Manage'}
            </button>
          </div>

          <div className="space-y-3">
            {staff.slice(0, 5).map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-2.5"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">{s.name}</span>
                    <span className="text-[10px] text-slate-600 font-medium bg-slate-200/80 px-1.5 py-0.5 rounded">
                      {s.role}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Tips: {s.totalTipsETB} ETB
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      s.isClockedIn ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
                    }`}
                  />
                  <span className="text-xs text-slate-600 font-medium">
                    {s.isClockedIn ? 'Clocked In' : 'Off'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
