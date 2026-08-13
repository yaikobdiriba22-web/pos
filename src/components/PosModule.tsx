import React, { useState } from 'react';
import {
  ShoppingCart,
  Search,
  Plus,
  Minus,
  Trash2,
  Send,
  Printer,
  Sparkles,
  Utensils,
  Clock,
  CheckCircle2,
  DollarSign,
  UserCheck
} from 'lucide-react';
import { MenuItem, Order, OrderItem, Table, ModuleType, MenuCategory } from '../types';

interface PosModuleProps {
  menuItems: MenuItem[];
  tables: Table[];
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  isAmharic: boolean;
  setCurrentModule: (mod: ModuleType) => void;
  selectedTableForOrder?: number;
  setSelectedTableForOrder: (tableId?: number) => void;
}

export const PosModule: React.FC<PosModuleProps> = ({
  menuItems,
  tables,
  orders,
  setOrders,
  isAmharic,
  setCurrentModule,
  selectedTableForOrder,
  setSelectedTableForOrder
}) => {
  const [posMode, setPosMode] = useState<'create' | 'kds'>('create');
  const [orderType, setOrderType] = useState<'Dine-in' | 'Takeaway'>('Dine-in');
  const [selectedTableId, setSelectedTableId] = useState<number>(selectedTableForOrder || 2);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentCart, setCurrentCart] = useState<OrderItem[]>([]);
  const [orderNotes, setOrderNotes] = useState<string>('');
  const [discountETB, setDiscountETB] = useState<number>(0);
  const [serverName, setServerName] = useState<string>('Yonas');

  const categories = [
    'All',
    'Ethiopian Specialties',
    'Starters & Salads',
    'Mains & Grill',
    'Pizzas & Pastas',
    'Beverages & Tej',
    'Desserts'
  ];

  const addToCart = (item: MenuItem) => {
    if (item.stockStatus === '86 Out of Stock') return;

    setCurrentCart((prev) => {
      const existing = prev.find((i) => i.menuItemId === item.id);
      if (existing) {
        return prev.map((i) =>
          i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: `oi-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          menuItemId: item.id,
          name: item.name,
          priceETB: item.priceETB,
          quantity: 1
        }
      ];
    });
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCurrentCart((prev) =>
      prev
        .map((i) => {
          if (i.id === cartItemId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as OrderItem[]
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCurrentCart((prev) => prev.filter((i) => i.id !== cartItemId));
  };

  // Pricing math
  const subtotalETB = currentCart.reduce((sum, item) => sum + item.priceETB * item.quantity, 0);
  const vatETB = Math.round(subtotalETB * 0.15 * 10) / 10;
  const serviceChargeETB = Math.round(subtotalETB * 0.1 * 10) / 10;
  const grandTotalETB = Math.max(0, subtotalETB + vatETB + serviceChargeETB - discountETB);

  const handleSendToKitchen = () => {
    if (currentCart.length === 0) return;

    const tableName =
      orderType === 'Dine-in'
        ? tables.find((t) => t.id === selectedTableId)?.name || `Table ${selectedTableId}`
        : 'Takeaway Customer';

    const newOrder: Order = {
      id: `ORD-${Math.floor(100 + Math.random() * 900)}`,
      type: orderType,
      tableId: orderType === 'Dine-in' ? selectedTableId : undefined,
      tableName,
      items: currentCart,
      status: 'Kitchen Preparing',
      subtotalETB,
      vatETB,
      serviceChargeETB,
      discountETB,
      grandTotalETB,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      serverName,
      notes: orderNotes
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCurrentCart([]);
    setOrderNotes('');
    setDiscountETB(0);
    alert(
      isAmharic
        ? `ትዕዛዝ ${newOrder.id} ወደ ወጥ ቤት ተልኳል!`
        : `Order ${newOrder.id} dispatched to Kitchen KDS!`
    );
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  const filteredMenuItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nameAmharic.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Controls & Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            {isAmharic ? 'የPOS ትዕዛዝ መመዝገቢያ' : 'Point-of-Sale (POS Matrix)'}
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {isAmharic
              ? 'ትዕዛዝ መክፈት፣ ማሻሻል፣ ወደ ወጥ ቤት መላክ እና KDS መከታተያ'
              : 'Touch-matrix order entry, kitchen KDS tickets, and fast table service.'}
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 border border-slate-200">
          <button
            onClick={() => setPosMode('create')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              posMode === 'create'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isAmharic ? '+ አዲስ ትዕዛዝ' : 'New Order Entry'}
          </button>
          <button
            onClick={() => setPosMode('kds')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              posMode === 'kds'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isAmharic ? 'የወጥ ቤት KDS' : 'Kitchen KDS Matrix'} ({orders.length})
          </button>
        </div>
      </div>

      {posMode === 'create' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Item Selector Matrix (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Order Configuration Bar */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Order Type */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setOrderType('Dine-in')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                      orderType === 'Dine-in'
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Dine-in Table
                  </button>
                  <button
                    onClick={() => setOrderType('Takeaway')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                      orderType === 'Takeaway'
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Takeaway
                  </button>
                </div>

                {/* Table Picker */}
                {orderType === 'Dine-in' && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-semibold">Table:</span>
                    <select
                      value={selectedTableId}
                      onChange={(e) => setSelectedTableId(Number(e.target.value))}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 font-bold focus:outline-none"
                    >
                      {tables.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.status})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Search & Categories */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Quick search dish..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-slate-900 text-white font-bold shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Items Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredMenuItems.map((item) => {
                const is86 = item.stockStatus === '86 Out of Stock';
                return (
                  <button
                    key={item.id}
                    disabled={is86}
                    onClick={() => addToCart(item)}
                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all group ${
                      is86
                        ? 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 shadow-2xs'
                    }`}
                  >
                    <div>
                      <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider block mb-1">
                        {item.category}
                      </span>
                      <h4 className="text-xs font-bold text-slate-800 group-hover:text-slate-900 transition-colors line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5 font-medium">
                        {item.nameAmharic}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-bold text-slate-800">
                        {item.priceETB} <span className="text-[10px] text-slate-500">ETB</span>
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          is86
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-slate-100 text-slate-700 group-hover:bg-slate-900 group-hover:text-white'
                        }`}
                      >
                        {is86 ? '86' : '+ Add'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Active Order Cart Ticket (5 cols) */}
          <div className="lg:col-span-5">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4 sticky top-20">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-slate-700" />
                  <h3 className="font-bold text-slate-800 text-sm">
                    {orderType === 'Dine-in'
                      ? `Table ${selectedTableId} Ticket`
                      : 'Takeaway Order Ticket'}
                  </h3>
                </div>
                <span className="text-xs text-slate-600 font-mono font-bold bg-slate-100 px-2 py-0.5 rounded">
                  {currentCart.length} Items
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {currentCart.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs font-medium">
                    Cart is empty. Click items on the left matrix to build order.
                  </div>
                ) : (
                  currentCart.map((cartItem) => (
                    <div
                      key={cartItem.id}
                      className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50/60 p-2.5 text-xs"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 truncate">{cartItem.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          {cartItem.priceETB} ETB x {cartItem.quantity} ={' '}
                          {(cartItem.priceETB * cartItem.quantity).toLocaleString()} ETB
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(cartItem.id, -1)}
                          className="h-6 w-6 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="font-bold text-slate-800 text-xs w-4 text-center">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(cartItem.id, 1)}
                          className="h-6 w-6 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => removeFromCart(cartItem.id)}
                          className="h-6 w-6 rounded bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-100 ml-1"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Discount & Notes */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Special Kitchen Notes / Modifiers
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Extra Ayib, Medium Rare, Mitmita on side..."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-800 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <span className="text-slate-600 font-medium">Discount (ETB):</span>
                  <input
                    type="number"
                    min={0}
                    value={discountETB}
                    onChange={(e) => setDiscountETB(Number(e.target.value))}
                    className="w-24 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-right text-slate-800 font-bold"
                  />
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 space-y-1.5 text-xs text-slate-700 font-mono">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{subtotalETB.toLocaleString()} ETB</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>VAT (15%):</span>
                  <span>{vatETB.toLocaleString()} ETB</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Service Charge (10%):</span>
                  <span>{serviceChargeETB.toLocaleString()} ETB</span>
                </div>
                {discountETB > 0 && (
                  <div className="flex justify-between text-emerald-600 text-[11px]">
                    <span>Discount:</span>
                    <span>-{discountETB.toLocaleString()} ETB</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-800 font-sans">
                  <span>Grand Total:</span>
                  <span>{grandTotalETB.toLocaleString()} ETB</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                disabled={currentCart.length === 0}
                onClick={handleSendToKitchen}
                className={`w-full py-2.5 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-2xs ${
                  currentCart.length === 0
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                <Send className="h-4 w-4" />
                <span>{isAmharic ? 'ወደ ወጥ ቤት ላክ (KDS)' : 'Send Order to Kitchen KDS'}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* KDS Matrix View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800 text-sm sm:text-base">
                    {ord.tableName}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {ord.id}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 mb-3 pb-2 border-b border-slate-100">
                  <span>Server: {ord.serverName}</span>
                  <span>{ord.timestamp}</span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-700">
                  {ord.items.map((it) => (
                    <div key={it.id} className="flex justify-between items-center">
                      <span className="font-semibold">{it.quantity}x {it.name}</span>
                      <span className="text-slate-800 font-mono">
                        {(it.priceETB * it.quantity).toLocaleString()} ETB
                      </span>
                    </div>
                  ))}
                </div>

                {ord.notes && (
                  <p className="mt-3 text-xs bg-amber-50 border border-amber-200 p-2 rounded-lg text-amber-800 font-medium">
                    Note: {ord.notes}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-slate-800 font-mono">
                  {ord.grandTotalETB.toLocaleString()} ETB
                </span>

                <div className="flex items-center gap-2">
                  {ord.status === 'Kitchen Preparing' && (
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'Ready')}
                      className="px-3 py-1 rounded bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700"
                    >
                      Mark Ready
                    </button>
                  )}
                  {ord.status === 'Ready' && (
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'Served')}
                      className="px-3 py-1 rounded bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800"
                    >
                      Mark Served
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedTableForOrder(ord.tableId);
                      setCurrentModule('bills');
                    }}
                    className="px-3 py-1 rounded border border-slate-200 bg-slate-50 text-slate-700 font-semibold text-xs hover:bg-slate-100"
                  >
                    Bill
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
