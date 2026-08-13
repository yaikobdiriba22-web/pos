import React from 'react';
import {
  LayoutDashboard,
  Utensils,
  Grid2X2,
  ShoppingCart,
  Receipt,
  Package,
  CalendarCheck,
  Users,
  MessageSquare,
  Settings,
  ShieldAlert,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { ModuleType, User } from '../types';

interface SidebarProps {
  currentModule: ModuleType;
  setCurrentModule: (mod: ModuleType) => void;
  isAmharic: boolean;
  lowStockCount: number;
  activeOrdersCount: number;
  reservationsCount: number;
  currentUser?: User | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentModule,
  setCurrentModule,
  isAmharic,
  lowStockCount,
  activeOrdersCount,
  reservationsCount,
  currentUser
}) => {
  const userRole = currentUser?.role || 'Manager';

  // Role permissions matrix
  const isManager = userRole === 'Manager';
  const isChef = userRole === 'Head Chef';
  const isWaiter = userRole === 'Waiter';
  const isCashier = userRole === 'Cashier';

  const navItems: {
    id: ModuleType;
    labelEn: string;
    labelAm: string;
    icon: React.ElementType;
    badge?: number;
    badgeColor?: string;
    restrictedFor?: ('Head Chef' | 'Waiter' | 'Cashier')[];
    primaryFor?: ('Manager' | 'Head Chef' | 'Waiter' | 'Cashier')[];
  }[] = [
    {
      id: 'dashboard',
      labelEn: 'Dashboard',
      labelAm: 'ዳሽቦርድ',
      icon: LayoutDashboard,
      primaryFor: ['Manager', 'Head Chef', 'Waiter', 'Cashier']
    },
    {
      id: 'menu',
      labelEn: 'Menu & Dishes',
      labelAm: 'የምግብ ዝርዝር',
      icon: Utensils,
      primaryFor: ['Manager', 'Head Chef']
    },
    {
      id: 'floor',
      labelEn: 'Floor & Tables',
      labelAm: 'ወለልና ጠረጴዛዎች',
      icon: Grid2X2,
      primaryFor: ['Manager', 'Waiter', 'Cashier']
    },
    {
      id: 'pos',
      labelEn: 'Orders / POS',
      labelAm: 'ትዕዛዞች / POS',
      icon: ShoppingCart,
      badge: activeOrdersCount,
      badgeColor: 'bg-emerald-500',
      primaryFor: ['Manager', 'Waiter', 'Cashier', 'Head Chef']
    },
    {
      id: 'bills',
      labelEn: 'Bills & Payments',
      labelAm: 'ሂሳብ እና ክፍያ',
      icon: Receipt,
      primaryFor: ['Manager', 'Cashier'],
      restrictedFor: ['Head Chef']
    },
    {
      id: 'inventory',
      labelEn: 'Inventory',
      labelAm: 'የዕቃዎች ክምችት',
      icon: Package,
      badge: lowStockCount,
      badgeColor: 'bg-rose-500',
      primaryFor: ['Manager', 'Head Chef'],
      restrictedFor: ['Waiter']
    },
    {
      id: 'reservations',
      labelEn: 'Reservations',
      labelAm: 'የቦታ ማስያዝ',
      icon: CalendarCheck,
      badge: reservationsCount,
      badgeColor: 'bg-amber-500',
      primaryFor: ['Manager', 'Waiter']
    },
    {
      id: 'staff',
      labelEn: 'Staff & Shift',
      labelAm: 'ሰራተኞች',
      icon: Users,
      primaryFor: ['Manager'],
      restrictedFor: ['Head Chef', 'Waiter', 'Cashier']
    },
    {
      id: 'messages',
      labelEn: 'Internal Chat',
      labelAm: 'የቡድን መልእክት',
      icon: MessageSquare,
      primaryFor: ['Manager', 'Head Chef', 'Waiter', 'Cashier']
    },
    {
      id: 'settings',
      labelEn: 'Settings',
      labelAm: 'ቅንብሮች',
      icon: Settings,
      primaryFor: ['Manager'],
      restrictedFor: ['Head Chef', 'Waiter', 'Cashier']
    }
  ];

  return (
    <aside className="w-16 sm:w-60 flex-shrink-0 bg-[#0F172A] border-r border-slate-800 text-slate-400 flex flex-col justify-between py-4 select-none">
      <div className="space-y-1.5 px-3">
        {/* Sidebar Brand Header */}
        <div className="px-3 py-2 flex items-center gap-2.5 mb-2 border-b border-slate-800/80 pb-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
            S
          </div>
          <div className="hidden sm:block">
            <span className="text-white font-semibold tracking-tight text-base block leading-tight">
              ServePoint
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
              Bella Vista POS
            </span>
          </div>
        </div>

        {/* Current Active Role Badge */}
        {currentUser && (
          <div className="hidden sm:block mx-1 mb-3 p-2.5 rounded-lg bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-slate-400 font-medium">{isAmharic ? 'የስራ ድርሻ' : 'Role'}</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  isManager
                    ? 'bg-purple-900/60 text-purple-300 border border-purple-700/50'
                    : isChef
                    ? 'bg-orange-900/60 text-orange-300 border border-orange-700/50'
                    : isCashier
                    ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
                    : 'bg-blue-900/60 text-blue-300 border border-blue-700/50'
                }`}
              >
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
          </div>
        )}

        <div className="px-3 py-1 text-[10px] font-bold tracking-wider text-slate-500 uppercase hidden sm:block">
          {isAmharic ? 'የቤላ ቪስታ ማጁሎች' : 'CORE MODULES'}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentModule === item.id;
          const isRestricted = item.restrictedFor?.includes(userRole as any);

          return (
            <button
              key={item.id}
              onClick={() => setCurrentModule(item.id)}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md font-medium text-xs sm:text-sm transition-all group ${
                isActive
                  ? 'bg-slate-800 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
              } ${isRestricted ? 'opacity-65' : ''}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`h-4 w-4 sm:h-4 sm:w-4 flex-shrink-0 transition-transform group-hover:scale-105 ${
                    isActive ? 'text-emerald-400' : 'text-slate-400'
                  }`}
                />
                <span className="hidden sm:inline truncate">
                  {isAmharic ? item.labelAm : item.labelEn}
                </span>
              </div>

              <div className="flex items-center gap-1">
                {isRestricted && (
                  <span
                    className="hidden sm:inline-flex px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-900 text-slate-400 border border-slate-700"
                    title={`Read-only / Restricted for ${userRole}`}
                  >
                    Lock
                  </span>
                )}
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`hidden sm:inline-flex px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white ${
                      item.badgeColor || 'bg-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer System Status Banner */}
      <div className="p-3 border-t border-slate-800 text-xs">
        <div className="hidden sm:block bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400">System Status</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500">
            <span>Role: {userRole}</span>
            <span>{isAmharic ? 'አማርኛ' : 'EN'}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
