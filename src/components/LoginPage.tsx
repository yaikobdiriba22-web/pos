import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Lock,
  Mail,
  KeyRound,
  ShieldCheck,
  Globe,
  Sparkles,
  UserCheck,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { User } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
  isAmharic: boolean;
  onToggleLanguage: () => void;
}

export const demoUsers: User[] = [
  {
    id: 'usr-1',
    name: 'Abebe Kebede',
    email: 'manager@bellavista.et',
    role: 'Manager',
    avatar: 'A',
    pin: '1234'
  },
  {
    id: 'usr-2',
    name: 'Dawit Tadesse',
    email: 'chef@bellavista.et',
    role: 'Head Chef',
    avatar: 'D',
    pin: '2222'
  },
  {
    id: 'usr-3',
    name: 'Bethlehem Worku',
    email: 'cashier@bellavista.et',
    role: 'Cashier',
    avatar: 'B',
    pin: '3333'
  },
  {
    id: 'usr-4',
    name: 'Almaz Girma',
    email: 'waiter@bellavista.et',
    role: 'Waiter',
    avatar: 'A',
    pin: '4444'
  }
];

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  isAmharic,
  onToggleLanguage
}) => {
  const [email, setEmail] = useState('manager@bellavista.et');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [activeTab, setActiveTab] = useState<'credentials' | 'pin'>('credentials');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const foundUser = demoUsers.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (foundUser) {
      onLogin(foundUser);
    } else {
      // Allow custom user login
      const customUser: User = {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0] || 'Restaurant Staff',
        email: email,
        role: 'Manager',
        avatar: (email[0] || 'U').toUpperCase()
      };
      onLogin(customUser);
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!pinCode) {
      setErrorMessage(isAmharic ? 'እባክዎ ፒን ኮድ ያስገቡ' : 'Please enter a PIN code');
      return;
    }

    const matchedUser = demoUsers.find((u) => u.pin === pinCode);
    if (matchedUser) {
      onLogin(matchedUser);
    } else {
      setErrorMessage(
        isAmharic
          ? 'ያልተስተካከለ ፒን ኮድ። እባክዎ 1234፣ 2222፣ 3333 ወይም 4444 ይሞክሩ'
          : 'Invalid PIN code. Try demo PINs: 1234, 2222, 3333, or 4444'
      );
    }
  };

  const handleQuickDemoSelect = (user: User) => {
    setEmail(user.email);
    setPassword('••••••••');
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center px-4 py-8 relative antialiased text-slate-800">
      {/* Top Header Controls */}
      <div className="absolute top-6 right-6 flex items-center gap-3">
        <button
          onClick={onToggleLanguage}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <Globe className="h-3.5 w-3.5 text-slate-500" />
          <span>{isAmharic ? 'አማርኛ' : 'English'}</span>
        </button>
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-md mb-1">
            <UtensilsCrossed className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {isAmharic ? 'ቤላ ቪስታ ሲስተም' : 'Bella Vista ServePoint'}
            </h1>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-0.5">
              {isAmharic
                ? 'ምግብ ቤት እና POS ማቀናበሪያ'
                : 'Fine Dining POS & Operations Engine'}
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          {/* Auth Method Switcher */}
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200/80">
            <button
              type="button"
              onClick={() => setActiveTab('credentials')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'credentials'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isAmharic ? 'በኢሜል እና ፓስወርድ' : 'Email & Password'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pin')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'pin'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isAmharic ? 'ፈጣን POS ፒን (PIN)' : 'Fast POS PIN'}
            </button>
          </div>

          {errorMessage && (
            <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 font-medium">
              {errorMessage}
            </div>
          )}

          {activeTab === 'credentials' ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">
                  {isAmharic ? 'የስራ ኢሜል' : 'Work Email Address'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="manager@bellavista.et"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-slate-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">
                  {isAmharic ? 'የይለፍ ቃል (Password)' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-10 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-slate-400 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-slate-300 text-slate-900 focus:ring-0"
                  />
                  <span>{isAmharic ? 'አስታውሰኝ' : 'Remember session'}</span>
                </label>
                <span className="text-slate-500 hover:underline cursor-pointer font-medium">
                  {isAmharic ? 'ይለፍ ቃል ተረሳ?' : 'Forgot password?'}
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-slate-900 text-white font-semibold text-xs sm:text-sm hover:bg-slate-800 transition-colors shadow-2xs flex items-center justify-center gap-2"
              >
                <span>{isAmharic ? 'ወደ ሲስተም ግባ' : 'Sign In to ServePoint'}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handlePinSubmit} className="space-y-4 text-xs text-center">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {isAmharic ? '4-ዲጂት የሰራተኛ ፒን ያስገቡ' : 'Enter 4-Digit Waiter / POS PIN'}
                </label>
                <p className="text-[11px] text-slate-500 mb-3">
                  {isAmharic
                    ? 'ለፈጣን ኦርደር እና ክፍያ መቀበያ'
                    : 'Quick shift login for waiters, cashiers & kitchen team'}
                </p>

                <div className="relative max-w-xs mx-auto">
                  <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    maxLength={4}
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="1234"
                    className="w-full text-center tracking-widest text-lg font-mono font-bold rounded-lg border border-slate-200 bg-slate-50 py-2.5 text-slate-800 focus:outline-none focus:border-slate-400 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-emerald-600 text-white font-semibold text-xs sm:text-sm hover:bg-emerald-700 transition-colors shadow-2xs flex items-center justify-center gap-2"
              >
                <span>{isAmharic ? 'በፒን ግባ' : 'Authenticate with PIN'}</span>
                <ShieldCheck className="h-4 w-4" />
              </button>
            </form>
          )}

          {/* Quick Demo Account Selector */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-amber-500" />
                {isAmharic ? 'በአንድ ጠቅታ ይሞክሩ (Demo Accounts)' : 'Quick One-Click Demo Login'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {demoUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleQuickDemoSelect(user)}
                  className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-all text-left group flex items-center gap-2.5"
                >
                  <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {user.avatar}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-800 truncate group-hover:text-slate-900">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate font-medium">
                      {user.role} • PIN {user.pin}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-400 font-medium">
          <p>Bella Vista Fine Dining • Bole Road, Addis Ababa</p>
          <p className="text-[10px] text-slate-400 mt-0.5">ServePoint SaaS Cloud Run v2.5</p>
        </div>
      </div>
    </div>
  );
};
