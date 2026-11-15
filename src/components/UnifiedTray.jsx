import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, CheckCircle2, Receipt, CreditCard, Sparkles } from 'lucide-react';

export default function UnifiedTray({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onClearCart }) {
  const [diningMode, setDiningMode] = useState('dine-in'); // 'dine-in' | 'takeaway'
  const [paymentMethod, setPaymentMethod] = useState('bkash'); // 'bkash' | 'nagad' | 'card' | 'counter'
  const [orderConfirmed, setOrderConfirmed] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  // Group items by stall
  const groupedByStall = cartItems.reduce((acc, item) => {
    acc[item.stallName] = acc[item.stallName] || [];
    acc[item.stallName].push(item);
    return acc;
  }, {});

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const vat = Math.round(subtotal * 0.05); // 5% VAT
  const total = subtotal + vat;

  const handleSimulateOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const orderTicket = {
        orderId: 'CT-G2-' + Math.floor(100000 + Math.random() * 900000),
        placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        itemsCount: cartItems.reduce((sum, i) => sum + i.quantity, 0),
        stallsCount: Object.keys(groupedByStall).length,
        diningMode: diningMode === 'dine-in' ? 'Dine-In (600+ Seating)' : 'Takeaway Boxed',
        paymentMethod: paymentMethod.toUpperCase(),
        totalAmount: total,
        estimatedReadyMinutes: 14,
      };
      setOrderConfirmed(orderTicket);
      onClearCart();
    }, 1200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-culinary-card border-l border-slate-700/80 shadow-2xl h-full flex flex-col justify-between overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-culinary-dark/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-culinary-gold" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Unified Food Tray</h2>
              <p className="text-xs text-slate-400">
                {cartItems.length === 0 ? 'Tray is empty' : `${cartItems.length} dish types selected`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close tray"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Section */}
        {orderConfirmed ? (
          /* Order Confirmation View */
          <div className="p-6 flex-1 overflow-y-auto flex flex-col items-center justify-center text-center space-y-5 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Order Received • Token Generated
              </span>
              <h3 className="text-2xl font-serif font-bold text-white mt-1">
                Enjoy Your Feast!
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xs">
                Your order has been routed to the respective kitchen counters at Radhuni Table Gulshan 2.
              </p>
            </div>

            {/* Simulated Receipt Card */}
            <div className="w-full p-4 rounded-2xl bg-[#0a0d10] border border-slate-800 text-left space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-400 border-b border-slate-800 pb-2">
                <span>Token ID</span>
                <span className="font-mono font-bold text-culinary-gold">{orderConfirmed.orderId}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Time Placed</span>
                <span className="text-slate-200">{orderConfirmed.placedAt}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Dining Style</span>
                <span className="text-slate-200">{orderConfirmed.diningMode}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Payment</span>
                <span className="text-slate-200">{orderConfirmed.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Prep Time</span>
                <span className="text-amber-400 font-semibold">~{orderConfirmed.estimatedReadyMinutes} mins</span>
              </div>
              <div className="flex justify-between text-slate-200 font-bold border-t border-slate-800 pt-2 text-sm">
                <span>Total Paid</span>
                <span className="text-culinary-gold">৳{orderConfirmed.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Present your Token ID at the stall pickup displays when ready.
            </p>

            <button
              onClick={() => {
                setOrderConfirmed(null);
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-culinary-dark font-bold text-xs"
            >
              Done & Return to Explorer
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          /* Empty View */
          <div className="p-8 flex-1 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-500">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Your Tray is Empty</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Explore Darbar, Madchef X, Pizza Guy, or Hakka Dhaka and add your favorite dishes to build a multi-stall meal.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-culinary-gold font-bold text-xs hover:bg-amber-500/25 transition-colors"
            >
              Browse Stalls Now
            </button>
          </div>
        ) : (
          /* Items List */
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Dining Mode Toggle */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setDiningMode('dine-in')}
                className={`py-2 rounded-lg transition-all ${
                  diningMode === 'dine-in'
                    ? 'bg-amber-500 text-culinary-dark shadow font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Dine-In (Food Hall)
              </button>
              <button
                onClick={() => setDiningMode('takeaway')}
                className={`py-2 rounded-lg transition-all ${
                  diningMode === 'takeaway'
                    ? 'bg-amber-500 text-culinary-dark shadow font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Takeaway Box
              </button>
            </div>

            {/* Stalls Grouping */}
            {Object.entries(groupedByStall).map(([stallName, items]) => (
              <div key={stallName} className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    {stallName}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-[#0e1216] border border-slate-800 flex items-center justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">
                          {item.name}
                        </h4>
                        <span className="text-xs text-culinary-gold font-extrabold">
                          ৳{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1.5 bg-black/50 rounded-lg p-1 border border-slate-800">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-white w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Payment Method Selector */}
            <div className="pt-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Simulated Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
                <button
                  onClick={() => setPaymentMethod('bkash')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    paymentMethod === 'bkash'
                      ? 'border-pink-500 bg-pink-500/10 text-pink-400'
                      : 'border-slate-800 bg-[#0d1115] text-slate-400'
                  }`}
                >
                  <span className="font-bold">bKash</span>
                  <span className="text-[10px]">Mobile Pay</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('nagad')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    paymentMethod === 'nagad'
                      ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                      : 'border-slate-800 bg-[#0d1115] text-slate-400'
                  }`}
                >
                  <span className="font-bold">Nagad</span>
                  <span className="text-[10px]">Instant</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-culinary-gold bg-amber-500/10 text-culinary-gold'
                      : 'border-slate-800 bg-[#0d1115] text-slate-400'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span className="text-[10px]">Visa / MC</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Drawer Bottom Summary & Checkout */}
        {!orderConfirmed && cartItems.length > 0 && (
          <div className="p-6 border-t border-slate-800 bg-culinary-dark space-y-4">
            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal ({cartItems.reduce((sum, i) => sum + i.quantity, 0)} items)</span>
                <span className="text-slate-200">৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Govt VAT (5%)</span>
                <span className="text-slate-200">৳{vat.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-slate-800">
                <span>Grand Total</span>
                <span className="text-culinary-gold">৳{total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleSimulateOrder}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-culinary-dark shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-culinary-dark border-t-transparent rounded-full animate-spin" />
                  <span>Routing to Kitchen Counters...</span>
                </>
              ) : (
                <>
                  <span>Simulate Order & Token (৳{total.toLocaleString()})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
