import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Flame,
  AlertCircle,
  CheckCircle,
  Clock,
  Sparkles,
  Tag,
  DollarSign
} from 'lucide-react';
import { MenuItem, MenuCategory, StockStatus } from '../types';

interface MenuModuleProps {
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  isAmharic: boolean;
}

export const MenuModule: React.FC<MenuModuleProps> = ({
  menuItems,
  setMenuItems,
  isAmharic
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formNameAmharic, setFormNameAmharic] = useState('');
  const [formCategory, setFormCategory] = useState<MenuCategory>('Ethiopian Specialties');
  const [formPrice, setFormPrice] = useState<number>(450);
  const [formDescription, setFormDescription] = useState('');
  const [formStockCount, setFormStockCount] = useState<number>(20);
  const [formPrepTime, setFormPrepTime] = useState<number>(15);
  const [formIsSpecial, setFormIsSpecial] = useState<boolean>(false);

  const categories: string[] = [
    'All',
    'Ethiopian Specialties',
    'Starters & Salads',
    'Mains & Grill',
    'Pizzas & Pastas',
    'Beverages & Tej',
    'Desserts'
  ];

  // 86 Toggle (Mark Item Out of Stock)
  const toggle86Status = (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStatus: StockStatus =
            item.stockStatus === '86 Out of Stock' ? 'In Stock' : '86 Out of Stock';
          return {
            ...item,
            stockStatus: newStatus,
            stockCount: newStatus === '86 Out of Stock' ? 0 : 20
          };
        }
        return item;
      })
    );
  };

  const toggleDailySpecial = (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isDailySpecial: !item.isDailySpecial } : item))
    );
  };

  const handleDeleteItem = (id: string) => {
    if (confirm(isAmharic ? 'እርግጠኛ ነዎት ይህን ምግብ መሰረዝ ይፈልጋሉ?' : 'Are you sure you want to delete this menu item?')) {
      setMenuItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormName('');
    setFormNameAmharic('');
    setFormCategory('Ethiopian Specialties');
    setFormPrice(450);
    setFormDescription('');
    setFormStockCount(25);
    setFormPrepTime(15);
    setFormIsSpecial(false);
    setShowAddModal(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormNameAmharic(item.nameAmharic);
    setFormCategory(item.category);
    setFormPrice(item.priceETB);
    setFormDescription(item.description);
    setFormStockCount(item.stockCount);
    setFormPrepTime(item.preparationTimeMinutes);
    setFormIsSpecial(item.isDailySpecial || false);
    setShowAddModal(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || formPrice <= 0) return;

    if (editingItem) {
      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                name: formName,
                nameAmharic: formNameAmharic || formName,
                category: formCategory,
                priceETB: formPrice,
                description: formDescription,
                stockCount: formStockCount,
                stockStatus: formStockCount <= 0 ? '86 Out of Stock' : formStockCount < 10 ? 'Low Stock' : 'In Stock',
                preparationTimeMinutes: formPrepTime,
                isDailySpecial: formIsSpecial
              }
            : item
        )
      );
    } else {
      const newItem: MenuItem = {
        id: `m-${Date.now()}`,
        name: formName,
        nameAmharic: formNameAmharic || formName,
        category: formCategory,
        priceETB: formPrice,
        description: formDescription,
        stockStatus: formStockCount <= 0 ? '86 Out of Stock' : 'In Stock',
        stockCount: formStockCount,
        preparationTimeMinutes: formPrepTime,
        isDailySpecial: formIsSpecial,
        tags: ['New']
      };
      setMenuItems((prev) => [newItem, ...prev]);
    }
    setShowAddModal(false);
  };

  // Filtered Menu Items
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nameAmharic.includes(searchQuery) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-stone-100">
              {isAmharic ? 'የምግብ እና የመጠጥ ዝርዝር' : 'Bella Vista Culinary Menu'}
            </h1>
            <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-400 border border-amber-500/20">
              {menuItems.length} Total Items
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            {isAmharic
              ? 'ምግቦችን ማስተካከል፣ አዲስ መጨመር ወይም በ86 (86 Out of Stock) ምልክት ማድረግ ይቻላል'
              : 'Manage dishes, prices in ETB, daily specials, and instantly 86 out-of-stock items.'}
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-stone-950 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>{isAmharic ? '+ አዲስ ምግብ ጨምር' : '+ Add New Dish'}</span>
        </button>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Horizontal Category Scroller */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-stone-900 border border-stone-800 text-stone-300 hover:border-amber-500/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
          <input
            type="text"
            placeholder={isAmharic ? 'ምግብ ወይም መጠጥ ፈልግ...' : 'Search dish name...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-stone-800 bg-stone-900 pl-9 pr-3 py-2 text-xs text-stone-100 placeholder-stone-500 focus:border-amber-500/50 focus:outline-none"
          />
        </div>
      </div>

      {/* Menu Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.length === 0 ? (
          <div className="col-span-full py-12 text-center text-stone-500 text-sm">
            No dishes found matching search parameters.
          </div>
        ) : (
          filteredItems.map((item) => {
            const is86 = item.stockStatus === '86 Out of Stock';
            return (
              <div
                key={item.id}
                className={`group rounded-2xl border p-5 transition-all relative flex flex-col justify-between ${
                  is86
                    ? 'border-rose-900/50 bg-stone-950/80 opacity-75'
                    : item.isDailySpecial
                    ? 'border-amber-500/40 bg-gradient-to-b from-amber-950/30 to-stone-900/90 shadow-lg'
                    : 'border-stone-800 bg-stone-900/90 hover:border-stone-700'
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {item.category}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {item.isDailySpecial && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                          <Sparkles className="h-3 w-3" />
                          Special
                        </span>
                      )}

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          is86
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : item.stockStatus === 'Low Stock'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        {is86 ? '86 Out of Stock' : `${item.stockCount} in stock`}
                      </span>
                    </div>
                  </div>

                  {/* Title & Amharic Subtitle */}
                  <div className="mb-2">
                    <h3 className="text-base font-extrabold text-stone-100 group-hover:text-amber-400 transition-colors">
                      {item.name}
                    </h3>
                    {item.nameAmharic && (
                      <p className="text-xs font-semibold text-amber-300/80 mt-0.5">
                        {item.nameAmharic}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-stone-400 line-clamp-2 mb-3">
                    {item.description}
                  </p>

                  {/* Prep time & Tags */}
                  <div className="flex items-center gap-3 text-[11px] text-stone-400 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-amber-400" />
                      {item.preparationTimeMinutes} min
                    </span>
                    {item.tags && item.tags.length > 0 && (
                      <span className="truncate text-stone-400">
                        • {item.tags.join(', ')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Price & Action Buttons */}
                <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-extrabold text-stone-100">
                      {item.priceETB.toLocaleString()}{' '}
                      <span className="text-xs font-bold text-amber-400">ETB</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* 86 Out of Stock Quick Action Button */}
                    <button
                      onClick={() => toggle86Status(item.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                        is86
                          ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/30'
                      }`}
                      title="86 item (toggle out of stock)"
                    >
                      {is86 ? 'Un-86' : '86 Item'}
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => openEditModal(item)}
                      className="rounded-lg border border-stone-800 bg-stone-800 p-1.5 text-stone-300 hover:text-amber-400 hover:border-amber-500/40 transition-colors"
                      title="Edit dish"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="rounded-lg border border-stone-800 bg-stone-800 p-1.5 text-stone-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
                      title="Delete dish"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-amber-500/30 bg-stone-900 p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-stone-100 mb-4">
              {editingItem
                ? isAmharic
                  ? 'ምግብ ማስተካከያ'
                  : 'Edit Dish Details'
                : isAmharic
                ? 'አዲስ ምግብ መመዝገቢያ'
                : 'Add New Culinary Dish'}
            </h2>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-300 font-medium mb-1">Dish Name (English)</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Special Kitfo Feast"
                  className="w-full rounded-xl border border-stone-800 bg-stone-950 p-2.5 text-stone-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Dish Name (Amharic - አማርኛ)</label>
                <input
                  type="text"
                  value={formNameAmharic}
                  onChange={(e) => setFormNameAmharic(e.target.value)}
                  placeholder="ምሳሌ: ልዩ ክትፎ"
                  className="w-full rounded-xl border border-stone-800 bg-stone-950 p-2.5 text-stone-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as MenuCategory)}
                    className="w-full rounded-xl border border-stone-800 bg-stone-950 p-2.5 text-stone-100 focus:border-amber-500 focus:outline-none"
                  >
                    {categories.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 font-medium mb-1">Price (ETB)</label>
                  <input
                    type="number"
                    required
                    min={10}
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-stone-800 bg-stone-950 p-2.5 text-stone-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Ingredients and culinary style..."
                  className="w-full rounded-xl border border-stone-800 bg-stone-950 p-2.5 text-stone-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Stock Count</label>
                  <input
                    type="number"
                    min={0}
                    value={formStockCount}
                    onChange={(e) => setFormStockCount(Number(e.target.value))}
                    className="w-full rounded-xl border border-stone-800 bg-stone-950 p-2.5 text-stone-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-medium mb-1">Prep Time (min)</label>
                  <input
                    type="number"
                    min={1}
                    value={formPrepTime}
                    onChange={(e) => setFormPrepTime(Number(e.target.value))}
                    className="w-full rounded-xl border border-stone-800 bg-stone-950 p-2.5 text-stone-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isSpecial"
                  checked={formIsSpecial}
                  onChange={(e) => setFormIsSpecial(e.target.checked)}
                  className="h-4 w-4 rounded border-stone-800 bg-stone-950 text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="isSpecial" className="text-stone-300 font-medium cursor-pointer">
                  Mark as Daily Special
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-stone-800 bg-stone-800 px-4 py-2 font-semibold text-stone-300 hover:bg-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-500 px-5 py-2 font-bold text-stone-950 hover:bg-amber-400"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
