import React from 'react';
import {
  Settings,
  Globe,
  Bell,
  Sun,
  Moon,
  ShieldCheck,
  Building2,
  DollarSign,
  Check
} from 'lucide-react';
import { RestaurantSettings, User } from '../types';
import { ShieldAlert } from 'lucide-react';

interface SettingsModuleProps {
  settings: RestaurantSettings;
  setSettings: React.Dispatch<React.SetStateAction<RestaurantSettings>>;
  isAmharic: boolean;
  currentUser?: User | null;
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({
  settings,
  setSettings,
  isAmharic,
  currentUser
}) => {
  const isManager = currentUser?.role === 'Manager';

  const toggleLanguage = (lang: 'en' | 'am') => {
    setSettings((prev) => ({ ...prev, language: lang }));
  };

  const toggleTheme = (theme: 'dark' | 'light' | 'slate') => {
    setSettings((prev) => ({ ...prev, theme }));
  };

  const toggleNotification = (key: keyof RestaurantSettings['notifications']) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">
          {isAmharic ? 'የሲስተም ቅንብሮች' : 'System Settings'}
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          {isAmharic
            ? 'የቋንቋ፣ የግብር፣ የጭብጥ እና የማሳወቂያዎች ቅንብሮችን ያስካክሉ'
            : 'Configure tax rates, language, theme appearance, notifications, and security.'}
        </p>
      </div>

      {!isManager && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-center gap-3 text-amber-800 text-xs shadow-2xs">
          <ShieldAlert className="h-5 w-5 text-amber-600 flex-shrink-0" />
          <div>
            <span className="font-bold block">
              {isAmharic ? 'የእይታ ሁነታ (ምንም የማሻሻል መብት የለም)' : `Read-Only View (${currentUser?.role || 'User'})`}
            </span>
            <p className="text-amber-700/90 mt-0.5">
              {isAmharic
                ? 'የሲስተም ግብር፣ የቋንቋ እና የደህንነት ቅንብሮችን መቀየር የሚችሉት ስራ አስኪያጆች (Managers) ብቻ ናቸው።'
                : 'System preferences, tax rates, and security configurations can only be altered by a Restaurant Manager.'}
            </p>
          </div>
        </div>
      )}

      {/* Profile & Location */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-slate-700" />
          <h3 className="font-bold text-slate-800 text-sm">Restaurant Profile</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-600 font-medium mb-1">Restaurant Name</label>
            <input
              type="text"
              value={settings.restaurantName}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, restaurantName: e.target.value }))
              }
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Location / Address</label>
            <input
              type="text"
              value={settings.location}
              onChange={(e) => setSettings((prev) => ({ ...prev, location: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Language & Region */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-slate-700" />
          <h3 className="font-bold text-slate-800 text-sm">Language & Region</h3>
        </div>

        <div className="flex gap-3 text-xs">
          <button
            onClick={() => toggleLanguage('en')}
            className={`flex-1 p-3 rounded-lg border text-center font-bold transition-all ${
              settings.language === 'en'
                ? 'border-slate-900 bg-slate-900 text-white shadow-2xs'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 font-medium'
            }`}
          >
            English (US / Default)
          </button>
          <button
            onClick={() => toggleLanguage('am')}
            className={`flex-1 p-3 rounded-lg border text-center font-bold transition-all ${
              settings.language === 'am'
                ? 'border-slate-900 bg-slate-900 text-white shadow-2xs'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 font-medium'
            }`}
          >
            አማርኛ (Amharic)
          </button>
        </div>
      </div>

      {/* Tax & Checkout Rates */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-emerald-600" />
          <h3 className="font-bold text-slate-800 text-sm">Checkout & Tax Rates</h3>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-600 font-medium mb-1">VAT Rate (%)</label>
            <input
              type="number"
              value={settings.vatRate}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, vatRate: Number(e.target.value) }))
              }
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-800 font-mono font-bold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Service Charge Rate (%)</label>
            <input
              type="number"
              value={settings.serviceChargeRate}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, serviceChargeRate: Number(e.target.value) }))
              }
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-800 font-mono font-bold focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Theme Appearance */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <Moon className="h-4 w-4 text-slate-700" />
          <h3 className="font-bold text-slate-800 text-sm">Appearance</h3>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs">
          {[
            { id: 'light', label: 'Clean Minimalist ☀️' },
            { id: 'slate', label: 'SaaS Slate 💻' },
            { id: 'dark', label: 'Dark Obsidian 🌙' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => toggleTheme(t.id as any)}
              className={`p-3 rounded-lg border font-semibold transition-all ${
                settings.theme === t.id
                  ? 'border-slate-900 bg-slate-900 text-white shadow-2xs'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-slate-700" />
          <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div>
              <p className="font-bold text-slate-800">Push Alerts for Low Stock</p>
              <p className="text-[11px] text-slate-500 font-medium">Receive alerts when ingredients drop below threshold</p>
            </div>
            <button
              onClick={() => toggleNotification('push')}
              className={`px-3 py-1 rounded-md text-xs font-semibold ${
                settings.notifications.push
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {settings.notifications.push ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>
      </div>

      {/* Logged in devices */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-1.5 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <h3 className="font-bold text-slate-800 text-sm">Security & Connected Devices</h3>
        </div>
        <p className="text-xs text-slate-500 font-medium">
          ServePoint Cloud Run Terminal • IP 196.188.12.94 (Addis Ababa, Ethiopia) • Active Session
        </p>
      </div>
    </div>
  );
};
