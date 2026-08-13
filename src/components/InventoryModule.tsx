import React, { useState } from 'react';
import {
  Package,
  AlertTriangle,
  RefreshCw,
  Plus,
  CheckCircle,
  Truck,
  DollarSign,
  Calendar,
  Flame,
  Search
} from 'lucide-react';
import { InventoryItem } from '../types';

interface InventoryModuleProps {
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  isAmharic: boolean;
}

export const InventoryModule: React.FC<InventoryModuleProps> = ({
  inventory,
  setInventory,
  isAmharic
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [nameAmharic, setNameAmharic] = useState('');
  const [quantity, setQuantity] = useState<number>(10);
  const [unit, setUnit] = useState<'kg' | 'L' | 'pcs' | 'bottles' | 'packs'>('kg');
  const [minThreshold, setMinThreshold] = useState<number>(15);
  const [costPerUnit, setCostPerUnit] = useState<number>(300);
  const [supplier, setSupplier] = useState('');

  const handleRestock = (id: string, amount: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + amount;
          const status = newQty >= item.minThreshold ? 'Healthy' : 'Low Stock';
          return {
            ...item,
            quantity: newQty,
            status,
            lastRestocked: new Date().toISOString().split('T')[0]
          };
        }
        return item;
      })
    );
  };

  const handleAutoReorderAllLowStock = () => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.status === 'Low Stock' || item.status === 'Critical') {
          return {
            ...item,
            quantity: item.minThreshold + 20,
            status: 'Healthy',
            lastRestocked: new Date().toISOString().split('T')[0]
          };
        }
        return item;
      })
    );
    alert(
      isAmharic
        ? 'የአቅራቢዎች ትዕዛዝ ተልኳል! ሁሉም ዝቅተኛ እቃዎች ተሞልተዋል።'
        : 'Auto-reorder request generated for all suppliers! Low stock replenished.'
    );
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      name,
      nameAmharic: nameAmharic || name,
      quantity,
      unit,
      minThreshold,
      costPerUnitETB: costPerUnit,
      status: quantity >= minThreshold ? 'Healthy' : 'Low Stock',
      supplier: supplier || 'Addis Local Suppliers',
      lastRestocked: new Date().toISOString().split('T')[0]
    };
    setInventory((prev) => [newItem, ...prev]);
    setShowAddModal(false);
  };

  const filteredInventory = inventory.filter(
    (i) =>
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.nameAmharic.includes(searchQuery) ||
      i.supplier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            {isAmharic ? 'የእቃዎች እና የጥሬ ዕቃዎች ክምችት' : 'Ingredient Inventory'}
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {isAmharic
              ? 'የጤፍ ዱቄት፣ የበሬ ሥጋ፣ ቅቤ፣ በርበሬ እና ቡና ክምችት ክትትል'
              : 'Auto-deduction tracking for Teff Flour, Prime Beef, Niter Kibbeh, Berbere & Coffee.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAutoReorderAllLowStock}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-100 px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-200 shadow-2xs"
          >
            <RefreshCw className="h-4 w-4" />
            <span>{isAmharic ? 'ዝቅተኛ እቃዎችን በራስ-ሰር እዘዝ' : 'Auto-Reorder Low Stock Items'}</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 shadow-2xs"
          >
            <Plus className="h-4 w-4" />
            <span>{isAmharic ? '+ አዲስ እቃ መዝግብ' : '+ Add Ingredient'}</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search ingredient or supplier..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none shadow-2xs"
        />
      </div>

      {/* Inventory Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">Ingredient Name</th>
                <th className="p-4">Current Stock</th>
                <th className="p-4">Threshold</th>
                <th className="p-4">Cost / Unit</th>
                <th className="p-4">Status</th>
                <th className="p-4">Supplier</th>
                <th className="p-4">Restocked</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredInventory.map((item) => {
                const isLow = item.status === 'Low Stock' || item.status === 'Critical';
                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-slate-800">{item.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{item.nameAmharic}</p>
                    </td>
                    <td className="p-4 font-bold text-sm font-mono text-slate-800">
                      {item.quantity} <span className="text-xs text-slate-500 font-normal">{item.unit}</span>
                    </td>
                    <td className="p-4 font-mono text-slate-500">
                      {item.minThreshold} {item.unit}
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-800">
                      {item.costPerUnitETB} ETB
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isLow
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isLow ? <AlertTriangle className="h-3 w-3 text-rose-600" /> : <CheckCircle className="h-3 w-3 text-emerald-600" />}
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 font-medium">{item.supplier}</td>
                    <td className="p-4 font-mono text-slate-500">{item.lastRestocked}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleRestock(item.id, 20)}
                        className="rounded bg-slate-100 border border-slate-200 text-slate-800 px-3 py-1 text-xs font-semibold hover:bg-slate-200 transition-colors"
                      >
                        + Restock +20
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-slate-800">Add Inventory Ingredient</h2>
            <form onSubmit={handleAddItem} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Name (English)</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Name (Amharic)</label>
                <input
                  type="text"
                  value={nameAmharic}
                  onChange={(e) => setNameAmharic(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Unit</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:outline-none"
                  >
                    <option value="kg">kg</option>
                    <option value="L">Liters</option>
                    <option value="pcs">pcs</option>
                    <option value="bottles">bottles</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Min Threshold</label>
                  <input
                    type="number"
                    min={1}
                    value={minThreshold}
                    onChange={(e) => setMinThreshold(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Cost / Unit (ETB)</label>
                  <input
                    type="number"
                    min={1}
                    value={costPerUnit}
                    onChange={(e) => setCostPerUnit(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Supplier Name</label>
                <input
                  type="text"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
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
                  Save Ingredient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
