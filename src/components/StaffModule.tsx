import React, { useState } from 'react';
import {
  Users,
  Clock,
  DollarSign,
  Plus,
  Star,
  CheckCircle,
  XCircle,
  Phone,
  Sparkles
} from 'lucide-react';
import { StaffMember, User } from '../types';
import { ShieldAlert } from 'lucide-react';

interface StaffModuleProps {
  staff: StaffMember[];
  setStaff: React.Dispatch<React.SetStateAction<StaffMember[]>>;
  isAmharic: boolean;
  currentUser?: User | null;
}

export const StaffModule: React.FC<StaffModuleProps> = ({
  staff,
  setStaff,
  isAmharic,
  currentUser
}) => {
  const isManager = currentUser?.role === 'Manager';
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<StaffMember['role']>('Waiter');
  const [shift, setShift] = useState<StaffMember['shift']>('Evening');
  const [phone, setPhone] = useState('+251 9');

  const toggleClockIn = (id: string) => {
    setStaff((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const isClockedIn = !s.isClockedIn;
          return {
            ...s,
            isClockedIn,
            clockInTime: isClockedIn
              ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : undefined
          };
        }
        return s;
      })
    );
  };

  const handleAddTip = (id: string, tipETB: number) => {
    setStaff((prev) =>
      prev.map((s) => (s.id === id ? { ...s, totalTipsETB: s.totalTipsETB + tipETB } : s))
    );
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const newStaff: StaffMember = {
      id: `stf-${Date.now()}`,
      name,
      role,
      shift,
      isClockedIn: true,
      clockInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      totalTipsETB: 0,
      rating: 5.0,
      phone
    };
    setStaff((prev) => [...prev, newStaff]);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            {isAmharic ? 'የሰራተኞች እና የፈረቃ አስተዳደር' : 'Staff Roster & Shift Tracking'}
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {isAmharic
              ? 'የሰራተኞች የመግቢያ ሰዓት (Clock In/Out)፣ የፈረቃ ክትትል እና የጉርሻ (Tips) መዝገብ'
              : 'Track clock-ins, shift roles, waiter performance ratings, and ETB tip logs.'}
          </p>
        </div>

        {isManager ? (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 shadow-2xs"
          >
            <Plus className="h-4 w-4" />
            <span>{isAmharic ? '+ አዲስ ሰራተኛ ጨምር' : '+ Add Staff Member'}</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 text-xs font-semibold">
            <ShieldAlert className="h-4 w-4 text-slate-500" />
            <span>{isAmharic ? 'አዲስ ሰራተኛ የመጨመር መብት የለዎትም' : 'Adding Staff Restricted to Managers'}</span>
          </div>
        )}
      </div>

      {!isManager && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-3.5 flex items-center gap-3 text-blue-800 text-xs">
          <ShieldAlert className="h-4 w-4 text-blue-600 flex-shrink-0" />
          <span>
            {isAmharic
              ? `እርስዎ እንደ ${currentUser?.role || 'ሰራተኛ'} ገብተዋል። የሰራተኞችን ዝርዝር ማየት እና Clock In ማድረግ ይችላሉ።`
              : `Logged in as ${currentUser?.role || 'Staff'}. You can view shift rosters and clock in/out.`}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map((s) => (
          <div
            key={s.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-base">{s.name}</h3>
                <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 mt-1 inline-block">
                  {s.role}
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{s.rating.toFixed(1)}</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 font-medium">
              <p className="flex items-center gap-2 text-slate-600">
                <Clock className="h-3.5 w-3.5 text-slate-400" /> Shift: <strong>{s.shift}</strong>
              </p>
              <p className="flex items-center gap-2 text-slate-600">
                <Phone className="h-3.5 w-3.5 text-slate-400" /> {s.phone}
              </p>
              <p className="flex items-center gap-2 text-slate-600">
                <DollarSign className="h-3.5 w-3.5 text-emerald-600" /> Tips Logged:{' '}
                <strong className="text-emerald-700 font-mono">{s.totalTipsETB} ETB</strong>
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    s.isClockedIn ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
                  }`}
                />
                <span className="text-xs text-slate-600 font-semibold">
                  {s.isClockedIn ? `In @ ${s.clockInTime || '16:00'}` : 'Clocked Out'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAddTip(s.id, 100)}
                  className="px-2.5 py-1 rounded bg-slate-100 text-slate-800 text-[10px] font-semibold hover:bg-slate-200 border border-slate-200"
                >
                  +100 ETB Tip
                </button>
                <button
                  onClick={() => toggleClockIn(s.id)}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                    s.isClockedIn
                      ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {s.isClockedIn ? 'Clock Out' : 'Clock In'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-slate-800">Add Staff Member</h2>

            <form onSubmit={handleAddStaff} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:outline-none"
                  >
                    <option value="Manager">Manager</option>
                    <option value="Head Chef">Head Chef</option>
                    <option value="Sous Chef">Sous Chef</option>
                    <option value="Head Waiter">Head Waiter</option>
                    <option value="Waiter">Waiter</option>
                    <option value="Barista">Barista</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Shift</label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:outline-none"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Evening">Evening</option>
                    <option value="Full Day">Full Day</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-800 font-mono focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg bg-slate-100 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-5 py-2 font-semibold text-white hover:bg-slate-800 shadow-2xs"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
