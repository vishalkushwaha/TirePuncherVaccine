import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Truck, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useShopConfig } from '../../context/ShopConfigContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

export default function CartDrawer() {
  const { cartItems, cartCount, cartSubtotal, isCartDrawerOpen, setIsCartDrawerOpen, updateQuantity, removeFromCart } = useCart();
  const { freeShippingThreshold } = useShopConfig();
  const { isHindi } = useLanguage();
  const { getTheme } = useTheme();
  const navigate = useNavigate();

  if (!isCartDrawerOpen) return null;

  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-cyan-700" />
              <h2 className="text-base font-extrabold text-navy">
                {isHindi ? 'आपकी शॉपिंग कार्ट' : 'Your Shopping Cart'}
              </h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800">
                {cartCount}
              </span>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Banner */}
          <div className="px-5 py-3 bg-cyan-50/80 border-b border-cyan-100 text-xs">
            <div className="flex items-center justify-between font-semibold text-cyan-900 mb-1">
              <span className="flex items-center gap-1.5">
                <Truck size={14} className="text-cyan-700" />
                {remainingForFreeShipping === 0
                  ? (isHindi ? 'बधाई! आपको निःशुल्क डिलीवरी प्राप्त हुई है' : 'You have unlocked Free Shipping!')
                  : (isHindi ? `निःशुल्क डिलीवरी के लिए ₹${Math.round(remainingForFreeShipping)} का और सामान जोड़ें` : `Add ₹${Math.round(remainingForFreeShipping)} more for Free Shipping`)}
              </span>
              <span>{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full h-1.5 bg-cyan-200/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-600 transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 mx-auto bg-slate-100 text-slate-400 rounded-full flex items-center justify-center">
                  <ShoppingBag size={32} />
                </div>
                <h3 className="text-sm font-bold text-navy">
                  {isHindi ? 'आपकी कार्ट खाली है' : 'Your cart is empty'}
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  {isHindi ? 'अपने वाहन के लिए उपयुक्त टायर पंक्चर वैक्सीन चुनें और कार्ट में जोड़ें।' : 'Browse our premium sealant range and protect your tyres today.'}
                </p>
                <Link
                  to="/products"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-cyan-700 hover:underline pt-2"
                >
                  <span>{isHindi ? 'उत्पाद कैटलॉग देखें →' : 'Browse Products →'}</span>
                </Link>
              </div>
            ) : (
              cartItems.map(item => {
                const theme = getTheme(item.code);
                return (
                  <div key={item.code} className="flex gap-3 p-3 rounded-xl border border-slate-200 bg-white shadow-xs">
                    <img
                      src={item.image_url}
                      alt={item.name_en}
                      className="w-16 h-20 object-contain rounded-lg p-1 shrink-0"
                      style={{ backgroundColor: theme.bgLight }}
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-extrabold text-navy truncate">
                            {isHindi ? item.name_hi : item.name_en}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.code)}
                            className="text-slate-400 hover:text-red-600 p-0.5 transition-colors shrink-0"
                            title="Remove item"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <span className="text-[10px] text-slate-500 block">
                          {item.pack_size} · {item.tyre_type}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg p-0.5">
                          <button
                            onClick={() => updateQuantity(item.code, -1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-navy">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.code, 1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="text-xs font-black text-navy text-cyan-800">
                          ₹{(item.mrp * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Checkout Actions */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>{isHindi ? 'उप-कुल (Subtotal):' : 'Subtotal:'}</span>
                <span className="text-sm font-extrabold text-navy">
                  ₹{cartSubtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <ShieldCheck size={12} className="text-emerald-600 shrink-0" />
                <span>{isHindi ? 'कर शामिल · बीकानेर केंद्रीय गोदाम से 24h में डिस्पैच' : 'Taxes included · Dispatched within 24h from Bikaner warehouse'}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/cart"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full py-2.5 px-3 border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-700 text-center transition-colors"
                >
                  {isHindi ? 'कार्ट देखें' : 'View Full Cart'}
                </Link>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigate('/checkout');
                  }}
                  className="w-full py-2.5 px-3 bg-navy hover:bg-cyan-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md"
                >
                  <span>{isHindi ? 'चेकआउट' : 'Checkout'}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

