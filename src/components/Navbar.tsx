import React, { useState, useEffect } from 'react';
import {
  UtensilsCrossed,
  Bell,
  Sparkles,
  Search,
  Globe,
  Sun,
  Moon,
  Clock,
  ShieldCheck,
  Flame,
  LogOut
} from 'lucide-react';
import { ModuleType, RestaurantSettings, User } from '../types';

interface NavbarProps {
  currentModule: ModuleType;
  setCurrentModule: (mod: ModuleType) => void;
  settings: RestaurantSettings;
  setSettings: React.Dispatch<React.SetStateAction<RestaurantSettings>>;
  onOpenCommandAssistant: () => void;
  lowStockCount: number;
  pendingOrdersCount: number;
  currentUser?: User | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentModule,
  setCurrentModule,
  settings,
  setSettings,
  onOpenCommandAssistant,
  lowStockCount,
  pendingOrdersCount,
  currentUser,
  onLogout
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleLanguage = () => {
    setSettings((prev) => ({
      ...prev,
      language: prev.language === 'en' ? 'am' : 'en'
    }));
  };

  const isAmharic = settings.language === 'am';

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-6 shrink-0 shadow-xs transition-colors">
      {/* Brand & Restaurant Title */}
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
              Bella Vista
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              ServePoint
            </span>
          </div>
          <p className="text-xs text-slate-500 uppercase tracking-widest font-medium hidden sm:block">
            {isAmharic
              ? 'አዲስ አበባ፣ ኢትዮጵያ • የእራት አገልግሎት'
              : 'Addis Ababa, Ethiopia • Dinner Service'}
          </p>
        </div>
      </div>

      {/* Quick Search & AI Command Trigger */}
      <div className="flex flex-1 max-w-md mx-4 items-center">
        <button
          onClick={onOpenCommandAssistant}
          className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-500 hover:border-slate-300 hover:bg-slate-100 transition-all shadow-2xs group"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-600 group-hover:rotate-12 transition-transform" />
            <span className="text-slate-600">
              {isAmharic
                ? 'ትዕዛዝ ወይም ጥያቄ እዚህ ይጻፉ... (Help/እርዳታ)'
                : 'Type command or request AI... (e.g. table 5, bill, help)'}
            </span>
          </div>
          <kbd className="hidden md:inline-flex items-center rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] text-slate-500 font-mono shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Tools & Indicators */}
      <div className="flex items-center gap-3">
        {/* Logged-in User Badge */}
        <div className="flex items-center gap-2 sm:gap-3 pr-2 border-r border-slate-200">
          <div className="hidden sm:block text-right">
            <div className="text-xs font-semibold text-slate-800">
              {currentUser?.name || 'Manager Abebe'}
            </div>
            <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 rounded-full uppercase tracking-wider border border-emerald-200 inline-block">
              {currentUser?.role || 'Manager'}
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-xs">
            {currentUser?.avatar ? (
              <span className="text-base">{currentUser.avatar}</span>
            ) : (
              (currentUser?.name || 'A').charAt(0)
            )}
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Logout from ServePoint"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Live Clock */}
        <div className="hidden lg:flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-mono text-slate-700">
          <Clock className="h-3.5 w-3.5 text-slate-500" />
          <span>{currentTime || '19:42:00'}</span>
        </div>

        {/* Notifications & Low Stock Alerts */}
        <button
          onClick={() => setCurrentModule('inventory')}
          className="relative rounded-md border border-slate-200 bg-slate-50 p-2 text-slate-600 hover:border-slate-300 hover:bg-slate-100 transition-colors"
          title="Low stock alerts"
        >
          <Flame className="h-4 w-4 text-orange-500" />
          {lowStockCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
              {lowStockCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setCurrentModule('pos')}
          className="relative rounded-md border border-slate-200 bg-slate-50 p-2 text-slate-600 hover:border-slate-300 hover:bg-slate-100 transition-colors"
          title="Pending kitchen orders"
        >
          <Bell className="h-4 w-4 text-emerald-600" />
          {pendingOrdersCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow-xs">
              {pendingOrdersCount}
            </span>
          )}
        </button>

        {/* Language Switcher */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          title="Switch Language"
        >
          <Globe className="h-3.5 w-3.5 text-slate-500" />
          <span>{isAmharic ? 'አማርኛ' : 'English'}</span>
        </button>
      </div>
    </header>
  );
};
