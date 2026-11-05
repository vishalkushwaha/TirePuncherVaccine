import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, Tag, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useShopConfig } from '../context/ShopConfigContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';

export default function Cart() {
  const { cartItems, cartCount, cartSubtotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const { freeShippingThreshold, defaultShippingFee, enableCoupons, isEcommerceEnabled } = useShopConfig();
  const { isHindi } = useLanguage();
  const { getTheme } = useTheme();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // If e-commerce is disabled (e.g. Mode A: Quotation Only), show quotation redirection
  if (!isEcommerceEnabled) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center space-y-5">
        <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-amber-600 border border-amber-200">
          <ShoppingBag size={28} />
        </div>
        <h1 className="text-2xl font-bold text-navy">
          {isHindi ? 'कोटेशन आधारित प्रणाली सक्रिय है' : 'Quotation Mode Active'}
        </h1>
        <p className="text-slate-600 text-sm max-w-md mx-auto">
          {isHindi
            ? 'वर्तमान में ऑनलाइन सीधा कार्ट चेकआउट अक्षम है। कृपया अपनी आवश्यकतानुसार खुदरा या थोक कोटेशन अनुरोध भेजें।'
            : 'Online direct checkout is currently disabled. Please submit a retail or wholesale quotation request.'}
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            to="/quote?type=retail"
            className="bg-navy hover:bg-cyan-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
          >
            {isHindi ? 'खुदरा कोटेशन प्राप्त करें' : 'Get Retail Quote'}
          </Link>
          <Link
            to="/quote?type=bulk"
            className="border border-slate-300 text-slate-700 hover:bg-slate-100 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
          >
            {isHindi ? 'थोक कोटेशन (10+ बोतलें)' : 'Wholesale Quote (10+ Bottles)'}
          </Link>
        </div>
      </div>
    );
  }

  const isFreeShipping = cartSubtotal >= freeShippingThreshold;
  const shippingFee = cartItems.length === 0 ? 0 : (isFreeShipping ? 0 : defaultShippingFee);
  const discountAmount = appliedCoupon ? appliedCoupon.discount_amount : 0;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponError('');
    setValidatingCoupon(true);
    try {
      const res = await api.validateCoupon(couponCode.trim(), cartSubtotal);
      if (res.valid) {
        setAppliedCoupon(res);
        setCouponError('');
      } else {
        setAppliedCoupon(null);
        setCouponError(res.message || 'Invalid coupon code');
      }
    } catch (err) {
      setCouponError('Failed to validate coupon');
    } finally {
      setValidatingCoupon(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="py-20 max-w-2xl mx-auto px-4 sm:px-6 text-center space-y-5">
        <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag size={40} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy">
          {isHindi ? 'आपकी कार्ट वर्तमान में खाली है' : 'Your Shopping Cart is Empty'}
        </h1>
        <p className="text-slate-600 text-sm max-w-md mx-auto">
          {isHindi
            ? 'अपने व्यक्तिगत वाहन या व्यावसायिक फ्लीट के लिए टायर पंक्चर वैक्सीन की बोतलें चुनें और सुरक्षित यात्रा का अनुभव करें।'
            : 'Protect your tyres with India’s trusted puncture prevention sealant. Explore our range and add products to your cart.'}
        </p>
        <div className="pt-2">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-navy hover:bg-cyan-700 text-white font-bold px-6 py-3 rounded-lg text-sm shadow-md transition-colors"
          >
            <span>{isHindi ? 'उत्पाद देखें' : 'Browse Products'}</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs uppercase font-bold text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full">
            {isHindi ? 'सुरक्षित खरीदारी' : 'Secure Checkout Cart'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy mt-1">
            {isHindi ? 'शॉपिंग कार्ट' : 'Shopping Cart'} ({cartCount} {isHindi ? 'बोतल' : 'Bottles'})
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-slate-500 hover:text-red-600 flex items-center gap-1.5 self-start sm:self-auto transition-colors"
        >
          <RotateCcw size={14} />
          <span>{isHindi ? 'कार्ट खाली करें' : 'Clear Entire Cart'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Line Items Table */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Shipping Alert Banner */}
          <div className="p-4 rounded-xl border bg-cyan-50/70 border-cyan-200 text-xs">
            <div className="flex items-center justify-between font-bold text-cyan-950 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck size={16} className="text-cyan-700" />
                {isFreeShipping
                  ? (isHindi ? 'बधाई! आपने पूरे भारत में निःशुल्क डिलीवरी अनलॉक कर ली है' : 'Congratulations! You unlocked FREE Delivery across India')
                  : (isHindi ? `पूरे भारत में निःशुल्क डिलीवरी के लिए ₹${Math.round(remainingForFreeShipping)} का और सामान जोड़ें` : `Add ₹${Math.round(remainingForFreeShipping)} more to qualify for FREE Shipping`)}
              </span>
              <span>{Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100))}%</span>
            </div>
            <div className="w-full h-2 bg-cyan-200/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-600 transition-all duration-300"
                style={{ width: `${Math.min(100, (cartSubtotal / freeShippingThreshold) * 100)}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
            {cartItems.map(item => {
              const theme = getTheme(item.code);
              return (
                <div key={item.code} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image_url}
                      alt={item.name_en}
                      className="w-16 h-20 object-contain rounded-xl p-1 shrink-0"
                      style={{ backgroundColor: theme.bgLight }}
                    />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ backgroundColor: theme.primary, color: '#fff' }}>
                        {item.code.toUpperCase()}
                      </span>
                      <h3 className="text-sm font-extrabold text-navy mt-1">
                        {isHindi ? item.name_hi : item.name_en}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {item.pack_size} · {item.tyre_type}
                      </p>
                      <span className="text-xs font-semibold text-slate-700 block sm:hidden mt-1">
                        ₹{item.mrp} × {item.quantity} = ₹{(item.mrp * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0">
                    {/* Stepper */}
                    <div className="flex items-center gap-2 border border-slate-300 rounded-lg p-1 bg-white">
                      <button
                        onClick={() => updateQuantity(item.code, -1)}
                        className="w-7 h-7 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-navy">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.code, 1)}
                        className="w-7 h-7 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-navy text-cyan-800 block">
                        ₹{(item.mrp * item.quantity).toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        ₹{item.mrp} / 1L
                      </span>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.code)}
                      className="text-slate-400 hover:text-red-600 p-1.5 transition-colors"
                      title="Remove product"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
            <Link to="/products" className="font-semibold text-cyan-700 hover:underline">
              ← {isHindi ? 'और उत्पाद जोड़ें' : 'Add more products'}
            </Link>
            <span>{isHindi ? 'बीकानेर केंद्रीय गोदाम से 24h में सुरक्षित डिस्पैच' : 'Dispatched within 24 business hours from Bikaner'}</span>
          </div>
        </div>

        {/* Right Column: Order Summary & Checkout Card */}
        <div className="lg:col-span-4 space-y-4">
          {/* Promo Coupon Box */}
          {enableCoupons && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-navy">
                <Tag size={16} className="text-cyan-700" />
                <span>{isHindi ? 'प्रोमो कूपन कोड' : 'Have a Promo Coupon Code?'}</span>
              </div>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. WELCOME10"
                  className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg uppercase font-mono focus:ring-2 focus:ring-cyan-600 focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={validatingCoupon || !couponCode.trim()}
                  className="px-4 py-2 bg-navy hover:bg-cyan-700 text-white rounded-lg text-xs font-bold disabled:opacity-50 transition-colors"
                >
                  {validatingCoupon ? '...' : (isHindi ? 'लागू करें' : 'Apply')}
                </button>
              </form>

              {appliedCoupon && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center justify-between">
                  <span>{appliedCoupon.message}</span>
                  <button
                    onClick={() => { setAppliedCoupon(null); setCouponCode(''); }}
                    className="font-bold text-emerald-900 hover:text-red-600 ml-2"
                  >
                    ✕
                  </button>
                </div>
              )}
              {couponError && (
                <span className="text-[11px] text-red-600 block">{couponError}</span>
              )}
            </div>
          )}

          {/* Price Breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-navy border-b border-slate-100 pb-3">
              {isHindi ? 'ऑर्डर सारांश' : 'Order Summary'}
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>{isHindi ? 'उप-कुल (Subtotal):' : 'Cart Subtotal:'}</span>
                <span className="font-semibold text-slate-800">₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>{isHindi ? 'कूपन छूट:' : 'Coupon Discount:'} ({appliedCoupon.code})</span>
                  <span>- ₹{appliedCoupon.discount_amount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>{isHindi ? 'डिलीवरी शुल्क:' : 'Standard Shipping:'}</span>
                <span className="font-semibold text-slate-800">
                  {shippingFee === 0
                    ? <span className="text-emerald-700 font-bold uppercase">{isHindi ? 'निःशुल्क (FREE)' : 'FREE'}</span>
                    : `₹${shippingFee}`}
                </span>
              </div>

              <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline text-navy">
                <span className="text-sm font-extrabold">{isHindi ? 'कुल देय राशि:' : 'Estimated Total:'}</span>
                <span className="text-2xl font-black text-cyan-800">
                  ₹{Math.round(finalTotal).toLocaleString('en-IN')}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block pt-1">
                {isHindi ? 'जीएसटी कर व पैकिंग शुल्क शामिल' : 'Includes GST tax and factory safety packaging'}
              </span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 bg-navy hover:bg-cyan-700 text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>{isHindi ? 'सुरक्षित चेकआउट पर जाएं' : 'Proceed to Checkout'}</span>
              <ArrowRight size={16} />
            </button>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center gap-2 text-[11px] text-slate-600">
              <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
              <span>{isHindi ? '100% सुरक्षित भुगतान · प्रामाणिक उत्पाद गारंटी' : '100% Secure Checkout · Direct Factory Guarantee'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

