import React, { useState } from 'react';
import {
  Grid2X2,
  Users,
  Clock,
  Sparkles,
  ShoppingBag,
  Receipt,
  CheckCircle2,
  AlertCircle,
  X,
  UserPlus,
  RefreshCw,
  Plus
} from 'lucide-react';
import { Table, TableStatus, Order, ModuleType } from '../types';

interface FloorPlanModuleProps {
  tables: Table[];
  setTables: React.Dispatch<React.SetStateAction<Table[]>>;
  orders: Order[];
  isAmharic: boolean;
  setCurrentModule: (mod: ModuleType) => void;
  setSelectedTableForOrder: (tableId: number) => void;
}

export const FloorPlanModule: React.FC<FloorPlanModuleProps> = ({
  tables,
  setTables,
  orders,
  isAmharic,
  setCurrentModule,
  setSelectedTableForOrder
}) => {
  const [selectedSection, setSelectedSection] = useState<string>('All');
  const [activeTable, setActiveTable] = useState<Table | null>(null);

  // Form states for table management
  const [guestCountInput, setGuestCountInput] = useState<number>(2);
  const [serverInput, setServerInput] = useState<string>('Yonas');

  const sections = ['All', 'Main Hall', 'Terrace', 'VIP Lounge', 'Bar Area'];

  const filteredTables = tables.filter(
    (t) => selectedSection === 'All' || t.section === selectedSection
  );

  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case 'Free':
        return 'bg-emerald-50/60 border-emerald-200 text-slate-800 hover:border-emerald-300';
      case 'Occupied':
        return 'bg-amber-50/80 border-amber-300 text-slate-800 hover:border-amber-400 shadow-2xs';
      case 'Reserved':
        return 'bg-indigo-50/70 border-indigo-200 text-slate-800 hover:border-indigo-300';
      case 'Dirty':
        return 'bg-rose-50/80 border-rose-200 text-slate-800 hover:border-rose-300';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-800';
    }
  };

  const handleUpdateStatus = (tableId: number, newStatus: TableStatus) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id === tableId) {
          if (newStatus === 'Free') {
            return { ...t, status: 'Free', guestsCount: undefined, orderId: undefined, timeSeated: undefined };
          }
          if (newStatus === 'Occupied') {
            const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return {
              ...t,
              status: 'Occupied',
              guestsCount: guestCountInput || t.capacity,
              serverName: serverInput,
              timeSeated: nowTime
            };
          }
          return { ...t, status: newStatus };
        }
        return t;
      })
    );
    if (activeTable && activeTable.id === tableId) {
      setActiveTable((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const openOrderForTable = (tableId: number) => {
    setSelectedTableForOrder(tableId);
    setCurrentModule('pos');
  };

  const openBillForTable = (tableId: number) => {
    setSelectedTableForOrder(tableId);
    setCurrentModule('bills');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            {isAmharic ? 'የቤላ ቪስታ ወለል እና ጠረጴዛዎች (Floor Plan)' : 'Floor Plan & Table Matrix'}
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {isAmharic
              ? '20 ጠረጴዛዎች | ነጻ (Free)፣ የተያዙ (Occupied)፣ የተያዘ ቦታ (Reserved) እና የቆሸሹ (Dirty)።'
              : 'Real-time status of 20 dining tables across Main Hall, Terrace, VIP Lounge, and Bar.'}
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Free (
            {tables.filter((t) => t.status === 'Free').length})
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800">
            <span className="h-2 w-2 rounded-full bg-amber-500" /> Occupied (
            {tables.filter((t) => t.status === 'Occupied').length})
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700">
            <span className="h-2 w-2 rounded-full bg-indigo-500" /> Reserved (
            {tables.filter((t) => t.status === 'Reserved').length})
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-700">
            <span className="h-2 w-2 rounded-full bg-rose-500" /> Dirty (
            {tables.filter((t) => t.status === 'Dirty').length})
          </span>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {sections.map((sec) => (
          <button
            key={sec}
            onClick={() => setSelectedSection(sec)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedSection === sec
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {sec}
          </button>
        ))}
      </div>

      {/* Tables Grid Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredTables.map((table) => {
          return (
            <div
              key={table.id}
              onClick={() => setActiveTable(table)}
              className={`rounded-xl border p-4 cursor-pointer transition-all flex flex-col justify-between h-40 ${getStatusColor(
                table.status
              )}`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-800 text-sm">{table.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/80 border border-slate-200 text-slate-600 shadow-2xs">
                    Cap: {table.capacity}
                  </span>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                  {table.section}
                </span>

                {table.status === 'Occupied' && (
                  <div className="mt-2 space-y-0.5 text-xs text-slate-700">
                    <p className="font-bold text-amber-900 flex items-center gap-1">
                      <Users className="h-3 w-3 text-amber-700" /> {table.guestsCount || 2} guests
                    </p>
                    <p className="text-[10px] text-slate-600">
                      Server: {table.serverName || 'Yonas'}
                    </p>
                  </div>
                )}

                {table.status === 'Reserved' && (
                  <p className="mt-2 text-[11px] font-semibold text-indigo-700">
                    {table.notes || 'Reserved for Tonight'}
                  </p>
                )}

                {table.status === 'Dirty' && (
                  <p className="mt-2 text-[11px] font-bold text-rose-700">
                    ⚠️ Needs Cleaning
                  </p>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  {table.status}
                </span>
                {table.status === 'Occupied' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openOrderForTable(table.id);
                    }}
                    className="rounded bg-slate-900 px-2 py-1 text-[10px] font-bold text-white hover:bg-slate-800 shadow-2xs"
                  >
                    POS
                  </button>
                )}
                {table.status === 'Free' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdateStatus(table.id, 'Occupied');
                    }}
                    className="rounded bg-emerald-600 text-white px-2 py-1 text-[10px] font-bold hover:bg-emerald-700 shadow-2xs"
                  >
                    Seat
                  </button>
                )}
                {table.status === 'Dirty' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdateStatus(table.id, 'Free');
                    }}
                    className="rounded bg-rose-600 text-white px-2 py-1 text-[10px] font-bold hover:bg-rose-700 shadow-2xs"
                  >
                    Clean
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Table Management Detail Modal / Drawer */}
      {activeTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl relative">
            <button
              onClick={() => setActiveTable(null)}
              className="absolute right-4 top-4 rounded-lg bg-slate-100 p-1.5 text-slate-500 hover:text-slate-800"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-lg bg-slate-100 p-3 text-slate-700 border border-slate-200">
                <Grid2X2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">{activeTable.name}</h2>
                <p className="text-xs text-slate-500 font-medium">
                  {activeTable.section} • Capacity: {activeTable.capacity} guests
                </p>
              </div>
            </div>

            {/* Current Status Badge */}
            <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-semibold">Current Status:</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    activeTable.status === 'Free'
                      ? 'bg-emerald-100 text-emerald-800'
                      : activeTable.status === 'Occupied'
                      ? 'bg-amber-100 text-amber-800'
                      : activeTable.status === 'Reserved'
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {activeTable.status}
                </span>
              </div>

              {activeTable.status === 'Occupied' && (
                <div className="mt-3 text-xs space-y-1 text-slate-700">
                  <p>Guests: <strong>{activeTable.guestsCount || 2}</strong></p>
                  <p>Assigned Waiter: <strong>{activeTable.serverName || 'Yonas'}</strong></p>
                  <p>Seated At: <strong>{activeTable.timeSeated || '19:15'}</strong></p>
                </div>
              )}
            </div>

            {/* Actions for Table */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Table Actions
              </h3>

              {activeTable.status === 'Free' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Guests Count</label>
                      <input
                        type="number"
                        min={1}
                        max={activeTable.capacity + 2}
                        value={guestCountInput}
                        onChange={(e) => setGuestCountInput(Number(e.target.value))}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-800 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Assign Server</label>
                      <select
                        value={serverInput}
                        onChange={(e) => setServerInput(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-800 font-medium"
                      >
                        <option value="Yonas">Yonas (Head Waiter)</option>
                        <option value="Meron">Meron (Waiter)</option>
                        <option value="Abebe">Abebe (Manager)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={() => handleUpdateStatus(activeTable.id, 'Occupied')}
                    className="w-full rounded-lg bg-slate-900 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-2xs"
                  >
                    Seat Guests Now
                  </button>
                </div>
              )}

              {activeTable.status === 'Occupied' && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      openOrderForTable(activeTable.id);
                      setActiveTable(null);
                    }}
                    className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 py-2.5 text-xs font-semibold text-white hover:bg-slate-800"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Manage Order</span>
                  </button>

                  <button
                    onClick={() => {
                      openBillForTable(activeTable.id);
                      setActiveTable(null);
                    }}
                    className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-100 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-200"
                  >
                    <Receipt className="h-4 w-4" />
                    <span>Generate Bill</span>
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => handleUpdateStatus(activeTable.id, 'Dirty')}
                  className="rounded-lg border border-slate-200 bg-slate-50 py-2 text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-700"
                >
                  Mark Dirty
                </button>
                <button
                  onClick={() => handleUpdateStatus(activeTable.id, 'Free')}
                  className="rounded-lg border border-slate-200 bg-slate-50 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  Mark Free & Clean
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
