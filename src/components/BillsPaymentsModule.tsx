import React, { useState } from 'react';
import {
  Receipt,
  CreditCard,
  Phone,
  DollarSign,
  Printer,
  CheckCircle2,
  Sparkles,
  Search,
  Download,
  Building2,
  QrCode
} from 'lucide-react';
import { Order, PaymentReceipt, PaymentMethod, ModuleType } from '../types';

interface BillsPaymentsProps {
  orders: Order[];
  receipts: PaymentReceipt[];
  setReceipts: React.Dispatch<React.SetStateAction<PaymentReceipt[]>>;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  isAmharic: boolean;
  selectedTableForOrder?: number;
}

export const BillsPaymentsModule: React.FC<BillsPaymentsProps> = ({
  orders,
  receipts,
  setReceipts,
  setOrders,
  isAmharic,
  selectedTableForOrder
}) => {
  const activeUnpaidOrders = orders.filter((o) => o.status !== 'Paid');
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    activeUnpaidOrders.find((o) => o.tableId === selectedTableForOrder)?.id ||
      activeUnpaidOrders[0]?.id ||
      ''
  );

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Telebirr');
  const [paymentReference, setPaymentReference] = useState<string>('TLB-98102931');
  const [customerName, setCustomerName] = useState<string>('');
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);
  const [activeReceipt, setActiveReceipt] = useState<PaymentReceipt | null>(null);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  const handleProcessPayment = () => {
    if (!selectedOrder) return;

    const newReceipt: PaymentReceipt = {
      id: `RCP-${Math.floor(100 + Math.random() * 900)}`,
      orderId: selectedOrder.id,
      tableName: selectedOrder.tableName || 'Dine-in Table',
      items: selectedOrder.items,
      subtotalETB: selectedOrder.subtotalETB,
      vatETB: selectedOrder.vatETB,
      serviceChargeETB: selectedOrder.serviceChargeETB,
      discountETB: selectedOrder.discountETB,
      grandTotalETB: selectedOrder.grandTotalETB,
      paymentMethod,
      paymentReference: paymentMethod !== 'Cash' ? paymentReference : undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      cashierName: 'Abebe Bikila',
      customerName: customerName || 'Valued Guest'
    };

    setReceipts((prev) => [newReceipt, ...prev]);
    setOrders((prev) => prev.map((o) => (o.id === selectedOrder.id ? { ...o, status: 'Paid' } : o)));
    setActiveReceipt(newReceipt);
    setShowReceiptModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">
          {isAmharic ? 'የሂሳብ እና የክፍያ ማቀናበሪያ' : 'Bills & Payment Processing'}
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          {isAmharic
            ? 'በካርድ፣ በካሽ፣ በቴሌብር (Telebirr)፣ በሲቢኢ ብር (CBE Birr) ወይም በጫፓ (Chapa) ክፍያዎችን ይቀበሉ'
            : 'Accept Cash, Credit Card, Telebirr, CBE Birr & Chapa. Print official Ethiopian tax receipts.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Pending Table Bills Picker (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            {isAmharic ? 'ያልተከፈሉ ሂሳቦች' : 'Unpaid Active Table Orders'} ({activeUnpaidOrders.length})
          </h3>

          <div className="space-y-3">
            {activeUnpaidOrders.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-400 text-xs font-medium">
                All table bills are fully settled!
              </div>
            ) : (
              activeUnpaidOrders.map((ord) => {
                const isSelected = ord.id === selectedOrderId;
                return (
                  <div
                    key={ord.id}
                    onClick={() => setSelectedOrderId(ord.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-slate-900 bg-slate-50/90 shadow-2xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-800 text-sm">
                        {ord.tableName}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-800">
                        {ord.grandTotalETB.toLocaleString()} ETB
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-1 font-medium">
                      {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </p>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{ord.id} • {ord.serverName}</span>
                      <span className="text-amber-700 font-semibold">{ord.status}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Payment Settlement Terminal (7 cols) */}
        <div className="lg:col-span-7">
          {selectedOrder ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-800 text-base">
                    Settle Bill for {selectedOrder.tableName}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Ticket ID: {selectedOrder.id}</p>
                </div>
                <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
                  {selectedOrder.grandTotalETB.toLocaleString()} ETB
                </span>
              </div>

              {/* Itemized list */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedOrder.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center text-xs py-1 border-b border-slate-100"
                  >
                    <span className="text-slate-700 font-medium">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-mono text-slate-800">
                      {(item.priceETB * item.quantity).toLocaleString()} ETB
                    </span>
                  </div>
                ))}
              </div>

              {/* Tax & Discount Summary */}
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 space-y-1.5 text-xs text-slate-700 font-mono">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{selectedOrder.subtotalETB.toLocaleString()} ETB</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>VAT (15%):</span>
                  <span>{selectedOrder.vatETB.toLocaleString()} ETB</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Service Charge (10%):</span>
                  <span>{selectedOrder.serviceChargeETB.toLocaleString()} ETB</span>
                </div>
                {selectedOrder.discountETB > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount:</span>
                    <span>-{selectedOrder.discountETB.toLocaleString()} ETB</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-slate-200 text-sm sm:text-base font-bold text-slate-800 font-sans">
                  <span>Grand Total Due:</span>
                  <span>{selectedOrder.grandTotalETB.toLocaleString()} ETB</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">
                  Select Payment Method
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'Telebirr', label: 'Telebirr 📱', desc: 'Ethio Telecom' },
                    { id: 'CBE Birr', label: 'CBE Birr 🏦', desc: 'Commercial Bank' },
                    { id: 'Card', label: 'Credit/Debit Card 💳', desc: 'Visa / Mastercard' },
                    { id: 'Cash', label: 'Cash 💵', desc: 'Ethiopian Birr' },
                    { id: 'Chapa', label: 'Chapa ⚡', desc: 'Online Payment' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        paymentMethod === m.id
                          ? 'border-slate-900 bg-slate-900 text-white font-bold shadow-2xs'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <p className="text-xs font-bold">{m.label}</p>
                      <p className={`text-[10px] ${paymentMethod === m.id ? 'text-slate-300' : 'text-slate-500'}`}>{m.desc}</p>
                    </button>
                  ))}
                </div>

                {paymentMethod !== 'Cash' && (
                  <div>
                    <label className="block text-xs text-slate-600 font-medium mb-1">
                      Transaction / Reference Code
                    </label>
                    <input
                      type="text"
                      value={paymentReference}
                      onChange={(e) => setPaymentReference(e.target.value)}
                      placeholder="e.g. TLB-98102931"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 font-mono focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs text-slate-600 font-medium mb-1">
                    Customer Name (Optional for Tax Receipt)
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Guest Name..."
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              {/* Complete Action */}
              <button
                onClick={handleProcessPayment}
                className="w-full py-3 rounded-lg bg-emerald-600 text-white font-semibold text-xs sm:text-sm hover:bg-emerald-700 shadow-2xs flex items-center justify-center gap-2 transition-colors"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>
                  {isAmharic ? 'ክፍያ አጠናቅቅ እና ሪሲት ቁረጥ' : 'Complete Settlement & Print Tax Receipt'}
                </span>
              </button>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-400 text-sm font-medium">
              Select an active table bill from the left list to settle.
            </div>
          )}
        </div>
      </div>

      {/* Payment Receipts History */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
        <h3 className="font-bold text-slate-800 text-base">
          {isAmharic ? 'የቅርብ ጊዜ የተቆረጡ ሪሲቶች' : 'Recent Settled Receipts Log'} ({receipts.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {receipts.map((rcp) => (
            <div
              key={rcp.id}
              onClick={() => {
                setActiveReceipt(rcp);
                setShowReceiptModal(true);
              }}
              className="p-4 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 text-xs">{rcp.id}</span>
                  <span className="text-[10px] text-slate-700 bg-slate-200 px-1.5 py-0.5 rounded font-medium">
                    {rcp.paymentMethod}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  {rcp.tableName} • {rcp.customerName || 'Guest'}
                </p>
                <p className="text-[10px] text-slate-400">{rcp.timestamp}</p>
              </div>

              <div className="text-right">
                <span className="text-xs sm:text-sm font-bold text-emerald-700 font-mono block">
                  {rcp.grandTotalETB.toLocaleString()} ETB
                </span>
                <span className="text-[10px] text-slate-500 underline font-medium">View Tax Receipt</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Styled Official Printable Tax Receipt Modal */}
      {showReceiptModal && activeReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 text-slate-900 shadow-xl relative font-mono text-xs">
            {/* White Thermal Paper Look Container */}
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 text-slate-900 space-y-4">
              {/* Header */}
              <div className="text-center space-y-1">
                <h2 className="text-lg font-extrabold tracking-tight font-sans text-slate-900 uppercase">
                  BELLA VISTA
                </h2>
                <p className="text-[10px] text-slate-600 font-sans font-semibold">
                  FINE DINING & CULINARY ART
                </p>
                <p className="text-[9px] text-slate-500">
                  Bole Road, Near Friendship Mall, Addis Ababa
                </p>
                <p className="text-[9px] text-slate-500">TIN: 0048291029 • VAT Reg: 882910</p>
              </div>

              <div className="border-t border-b border-dashed border-slate-300 py-2 space-y-1 text-[10px] text-slate-700">
                <div className="flex justify-between">
                  <span>Receipt #:</span>
                  <span className="font-bold">{activeReceipt.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Table:</span>
                  <span>{activeReceipt.tableName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cashier:</span>
                  <span>{activeReceipt.cashierName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span>{activeReceipt.timestamp}</span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-1 text-[11px] text-slate-800">
                {activeReceipt.items.map((it) => (
                  <div key={it.id} className="flex justify-between">
                    <span>{it.quantity}x {it.name}</span>
                    <span>{(it.priceETB * it.quantity).toLocaleString()} ETB</span>
                  </div>
                ))}
              </div>

              {/* Tax totals */}
              <div className="border-t border-dashed border-slate-300 pt-2 space-y-1 text-[10px]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{activeReceipt.subtotalETB.toLocaleString()} ETB</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (15%):</span>
                  <span>{activeReceipt.vatETB.toLocaleString()} ETB</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Charge (10%):</span>
                  <span>{activeReceipt.serviceChargeETB.toLocaleString()} ETB</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-slate-900 pt-1 border-t border-slate-300 font-sans">
                  <span>TOTAL PAID:</span>
                  <span>{activeReceipt.grandTotalETB.toLocaleString()} ETB</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-semibold pt-1">
                  <span>Paid Via:</span>
                  <span>{activeReceipt.paymentMethod}</span>
                </div>
                {activeReceipt.paymentReference && (
                  <div className="flex justify-between text-[9px] text-slate-500">
                    <span>Ref Code:</span>
                    <span>{activeReceipt.paymentReference}</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="text-center pt-2 border-t border-dashed border-slate-300 text-[10px] text-slate-600">
                <p className="font-bold">አመሰግናለሁ! Thank You for Dining with Us!</p>
                <p className="text-[8px] text-slate-400 mt-1">ServePoint POS Engine v2.5</p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setShowReceiptModal(false)}
                className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 shadow-2xs"
              >
                <Printer className="h-4 w-4" />
                <span>Print Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
