import React, { useState } from 'react';
import {
  CalendarCheck,
  Plus,
  Users,
  Clock,
  Phone,
  CheckCircle2,
  XCircle,
  Search,
  Sparkles
} from 'lucide-react';
import { Reservation, Table, ModuleType } from '../types';

interface ReservationsProps {
  reservations: Reservation[];
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
  tables: Table[];
  setTables: React.Dispatch<React.SetStateAction<Table[]>>;
  isAmharic: boolean;
  setCurrentModule: (mod: ModuleType) => void;
}

export const ReservationsModule: React.FC<ReservationsProps> = ({
  reservations,
  setReservations,
  tables,
  setTables,
  isAmharic,
  setCurrentModule
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('+251 9');
  const [date, setDate] = useState('2026-07-29');
  const [time, setTime] = useState('20:00');
  const [guestsCount, setGuestsCount] = useState<number>(4);
  const [tableId, setTableId] = useState<number>(6);
  const [notes, setNotes] = useState('');

  const handleAddReservation = (e: React.FormEvent) => {
    e.preventDefault();
    const newRes: Reservation = {
      id: `res-${Date.now()}`,
      guestName,
      phone,
      date,
      time,
      guestsCount,
      tableId,
      notes,
      status: 'Confirmed'
    };

    setReservations((prev) => [newRes, ...prev]);

    // Update table status to Reserved
    setTables((prev) =>
      prev.map((t) =>
        t.id === tableId
          ? { ...t, status: 'Reserved', notes: `Reserved for ${time} (${guestName})` }
          : t
      )
    );

    setShowAddModal(false);
    alert(
      isAmharic
        ? `ቦታ ማስያዝ ለ${guestName} ተረጋግጧል! ጠረጴዛ ${tableId} ተይዟል።`
        : `Reservation confirmed for ${guestName}! Table ${tableId} assigned.`
    );
  };

  const updateReservationStatus = (id: string, status: Reservation['status']) => {
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const handleSeatGuestNow = (res: Reservation) => {
    if (res.tableId) {
      setTables((prev) =>
        prev.map((t) =>
          t.id === res.tableId
            ? {
                ...t,
                status: 'Occupied',
                guestsCount: res.guestsCount,
                timeSeated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            : t
        )
      );
      updateReservationStatus(res.id, 'Arrived');
      setCurrentModule('floor');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            {isAmharic ? 'የጠረጴዛ ቦታ ማስያዝ' : 'Table Reservations'}
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {isAmharic
              ? 'ቦታ ማስያዝ፣ ማስተካከል ወይም እንግዶችን በጠረጴዛዎች ላይ ማቀመጥ'
              : 'Manage table bookings, guest arrivals, and diplomat VIP reservations.'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 shadow-2xs"
        >
          <Plus className="h-4 w-4" />
          <span>{isAmharic ? '+ አዲስ ቦታ ያስይዙ' : '+ New Reservation'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reservations.map((res) => (
          <div
            key={res.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 text-sm sm:text-base">{res.guestName}</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  res.status === 'Confirmed'
                    ? 'bg-amber-100 text-amber-800'
                    : res.status === 'Arrived'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {res.status}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 font-medium">
              <p className="flex items-center gap-2 text-slate-600">
                <Phone className="h-3.5 w-3.5 text-slate-400" /> {res.phone}
              </p>
              <p className="flex items-center gap-2 text-slate-600">
                <Clock className="h-3.5 w-3.5 text-slate-400" /> {res.date} @ {res.time}
              </p>
              <p className="flex items-center gap-2 text-slate-600">
                <Users className="h-3.5 w-3.5 text-slate-400" /> {res.guestsCount} Guests • Assigned Table {res.tableId || 6}
              </p>
            </div>

            {res.notes && (
              <p className="text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-600 font-medium">
                Note: {res.notes}
              </p>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              {res.status === 'Confirmed' ? (
                <button
                  onClick={() => handleSeatGuestNow(res)}
                  className="w-full py-2 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors shadow-2xs"
                >
                  Seat Guests at Table {res.tableId || 6}
                </button>
              ) : (
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" /> Guest Seated
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-slate-800">Create Table Booking</h2>

            <form onSubmit={handleAddReservation} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Guest Full Name</label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. H.E. Ambassador Samuel"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:outline-none"
                />
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Time</label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Party Size (Guests)</label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Assign Table</label>
                  <select
                    value={tableId}
                    onChange={(e) => setTableId(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:outline-none"
                  >
                    {tables.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} (Cap: {t.capacity})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Special Notes / Preferences</label>
                <input
                  type="text"
                  placeholder="e.g. Window view, Birthday, Quiet table..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:outline-none"
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
                  Confirm Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
