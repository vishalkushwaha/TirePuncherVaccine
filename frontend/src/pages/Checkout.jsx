import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  CheckCircle2,
  Lock,
  ArrowRight,
  AlertCircle,
  ShoppingBag,
  MapPin,
  Phone,
  Mail,
  User
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useShopConfig } from '../context/ShopConfigContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';

export default function Checkout() {
  const { cartItems, cartCount, cartSubtotal, clearCart, cartSessionId, customerContact, saveContactForRecovery } = useCart();
  const { freeShippingThreshold, defaultShippingFee, enableCod, enableOnlinePayment, isEcommerceEnabled } = useShopConfig();
  const { isHindi } = useLanguage();
  const { getTheme } = useTheme();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customer_name: customerContact?.name || '',
    customer_phone: customerContact?.phone || '',
    customer_email: customerContact?.email || '',
    address_line: '',
    city: '',
    district: '',
    state: 'Rajasthan',
    pin_code: '',
    payment_method: enableCod ? 'COD' : 'ONLINE',
    notes: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Mode A Guard: If e-commerce is disabled, redirect to quote
  if (!isEcommerceEnabled) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center space-y-5">
        <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-amber-600 border border-amber-200">
          <ShieldCheck size={28} />
        </div>
        <h1 className="text-2xl font-bold text-navy">
          {isHindi ? 'कोटेशन आधारित प्रणाली सक्रिय है' : 'Quotation Mode Active'}
        </h1>
        <p className="text-slate-600 text-sm max-w-md mx-auto">
          {isHindi
            ? 'ऑनलाइन चेकआउट वर्तमान में अक्षम है। कृपया अपनी आवश्यकतानुसार कोटेशन प्राप्त करें।'
            : 'Online checkout is currently disabled. Please submit a quotation request.'}
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            to="/quote?type=retail"
            className="bg-navy hover:bg-cyan-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
          >
            {isHindi ? 'खुदरा कोटेशन' : 'Retail Quote'}
          </Link>
          <Link
            to="/quote?type=bulk"
            className="border border-slate-300 text-slate-700 hover:bg-slate-100 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
          >
            {isHindi ? 'थोक कोटेशन' : 'Wholesale Quote'}
          </Link>
        </div>
      </div>
    );
  }

  const isFreeShipping = cartSubtotal >= freeShippingThreshold;
  const shippingFee = isFreeShipping ? 0 : defaultShippingFee;
  const totalAmount = cartSubtotal + shippingFee;

  // Real-time telemetry to catch drop-offs at checkout
  const handleContactBlur = () => {
    if (form.customer_phone || form.customer_name) {
      saveContactForRecovery({
        name: form.customer_name,
        phone: form.customer_phone,
        email: form.customer_email
      });
      api.recordAbandonedCart({
        cart_session_id: cartSessionId,
        customer_name: form.customer_name || null,
        phone: form.customer_phone || null,
        email: form.customer_email || null,
        items_json: JSON.stringify(cartItems),
        cart_value: cartSubtotal,
        step_reached: 'Address'
      });
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (cartItems.length === 0) {
      setErrorMsg(isHindi ? 'आपकी कार्ट खाली है।' : 'Your cart is empty.');
      return;
    }

    if (!form.customer_name || !form.customer_phone || !form.address_line || !form.city || !form.pin_code) {
      setErrorMsg(isHindi ? 'कृपया सभी आवश्यक पता और संपर्क विवरण भरें।' : 'Please fill all required contact and shipping fields.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customer_name: form.customer_name,
        customer_phone: form.customer_phone,
        customer_email: form.customer_email || null,
        shipping_address: form.address_line,
        city: form.city,
        state: form.state || 'Rajasthan',
        pin_code: form.pin_code,
        subtotal: cartSubtotal,
        discount_amount: 0.0,
        shipping_fee: shippingFee,
        total_amount: totalAmount,
        payment_method: form.payment_method,
        notes: form.notes || null,
        items: cartItems.map(item => ({
          product_id: item.product_id || null,
          product_code: item.code,
          product_name: item.name_en,
          quantity: item.quantity,
          unit_price: item.mrp,
          total_price: item.mrp * item.quantity
        }))
      };

      const res = await api.createOrder(payload);

      // Record cart as successfully converted
      api.recordAbandonedCart({
        cart_session_id: cartSessionId,
        customer_name: form.customer_name,
        phone: form.customer_phone,
        email: form.customer_email || null,
        items_json: JSON.stringify(cartItems),
        cart_value: cartSubtotal,
        step_reached: 'Payment',
        status: 'Recovered'
      });

      clearCart();
      navigate(`/order-confirmed/${res.order_number}`);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto px-4">
        <h2 className="text-xl font-bold text-navy">
          {isHindi ? 'चेकआउट के लिए कोई उत्पाद नहीं है' : 'No Items to Checkout'}
        </h2>
        <Link to="/products" className="text-xs font-bold text-cyan-700 hover:underline block">
          {isHindi ? 'उत्पाद कैटलॉग देखें →' : 'Browse Products Catalog →'}
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Title Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-700 uppercase tracking-wider">
          <Lock size={14} />
          <span>{isHindi ? '256-बिट सुरक्षित एन्क्रिप्टेड चेकआउट' : '256-Bit SSL Secure Checkout'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy mt-1">
          {isHindi ? 'सुरक्षित चेकआउट व डिलीवरी विवरण' : 'Delivery Address & Secure Checkout'}
        </h1>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-xl flex items-center gap-2">
          <AlertCircle size={18} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Customer Contact, Address & Payment */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section 1: Customer Contact */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold text-navy uppercase tracking-wider flex items-center gap-2">
              <User size={16} className="text-cyan-700" />
              <span>{isHindi ? '1. संपर्क विवरण' : '1. Contact Information'}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  {isHindi ? 'पूरा नाम *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={form.customer_name}
                  onChange={e => setForm({ ...form, customer_name: e.target.value })}
                  onBlur={handleContactBlur}
                  placeholder={isHindi ? "उदा. रमेश चौधरी" : "e.g. Rahul Sharma"}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  {isHindi ? 'मोबाइल नंबर *' : 'Mobile Phone (10-Digits) *'}
                </label>
                <input
                  type="tel"
                  required
                  value={form.customer_phone}
                  onChange={e => setForm({ ...form, customer_phone: e.target.value })}
                  onBlur={handleContactBlur}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  {isHindi ? 'ईमेल पता (ऑर्डर पुष्टिकरण के लिए)' : 'Email Address (for Tax Invoice & Tracking)'}
                </label>
                <input
                  type="email"
                  value={form.customer_email}
                  onChange={e => setForm({ ...form, customer_email: e.target.value })}
                  onBlur={handleContactBlur}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Address */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold text-navy uppercase tracking-wider flex items-center gap-2">
              <MapPin size={16} className="text-cyan-700" />
              <span>{isHindi ? '2. डिलीवरी का पता' : '2. Shipping Address'}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  {isHindi ? 'मकान नं., गली, लैंडमार्क *' : 'House / Flat / Street / Landmark *'}
                </label>
                <input
                  type="text"
                  required
                  value={form.address_line}
                  onChange={e => setForm({ ...form, address_line: e.target.value })}
                  placeholder={isHindi ? "उदा. प्लॉट नं 12, रानी बाज़ार" : "e.g. House #14, Near Railway Station"}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  {isHindi ? 'शहर / कस्बा *' : 'City / Town *'}
                </label>
                <input
                  type="text"
                  required
                  value={form.city}
                  onChange={e => setForm({ ...form, city: e.target.value })}
                  placeholder="Bikaner"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  {isHindi ? 'पिन कोड *' : 'Postal PIN Code *'}
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={form.pin_code}
                  onChange={e => setForm({ ...form, pin_code: e.target.value })}
                  placeholder="334001"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  {isHindi ? 'जिला' : 'District'}
                </label>
                <input
                  type="text"
                  value={form.district}
                  onChange={e => setForm({ ...form, district: e.target.value })}
                  placeholder="Bikaner"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  {isHindi ? 'राज्य *' : 'State *'}
                </label>
                <input
                  type="text"
                  required
                  value={form.state}
                  onChange={e => setForm({ ...form, state: e.target.value })}
                  placeholder="Rajasthan"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method Selection */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold text-navy uppercase tracking-wider flex items-center gap-2">
              <CreditCard size={16} className="text-cyan-700" />
              <span>{isHindi ? '3. भुगतान विधि चुनें' : '3. Payment Method'}</span>
            </h2>

            <div className="space-y-3">
              {enableCod && (
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    form.payment_method === 'COD'
                      ? 'border-cyan-600 bg-cyan-50/40 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="COD"
                    checked={form.payment_method === 'COD'}
                    onChange={() => setForm({ ...form, payment_method: 'COD' })}
                    className="mt-1 text-cyan-600 focus:ring-cyan-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-bold text-navy flex items-center gap-1.5">
                        <Banknote size={16} className="text-emerald-600" />
                        {isHindi ? 'कैश ऑन डिलीवरी (COD)' : 'Cash on Delivery (COD)'}
                      </span>
                      <span className="text-[10px] uppercase font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        {isHindi ? 'सुविधाजनक' : 'Popular'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {isHindi ? 'पार्सल प्राप्त करते समय नकद या यूपीआई द्वारा भुगतान करें।' : 'Pay in cash or scanner upon parcel arrival at your doorstep.'}
                    </p>
                  </div>
                </label>
              )}

              {enableOnlinePayment && (
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    form.payment_method === 'ONLINE'
                      ? 'border-cyan-600 bg-cyan-50/40 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="ONLINE"
                    checked={form.payment_method === 'ONLINE'}
                    onChange={() => setForm({ ...form, payment_method: 'ONLINE' })}
                    className="mt-1 text-cyan-600 focus:ring-cyan-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-bold text-navy flex items-center gap-1.5">
                        <CreditCard size={16} className="text-cyan-700" />
                        {isHindi ? 'ऑनलाइन भुगतान (UPI / कार्ड / नेटबैंकिंग)' : 'Instant Online Payment (UPI, Cards, NetBanking)'}
                      </span>
                      <span className="text-[10px] uppercase font-extrabold bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-full">
                        {isHindi ? 'त्वरित पुष्टि' : 'Instant'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {isHindi ? 'Google Pay, PhonePe, Paytm, क्रेडिट/डेबिट कार्ड द्वारा सुरक्षित ऑनलाइन भुगतान।' : 'Encrypted direct checkout powered by gateway sandbox with instantaneous order confirmation.'}
                    </p>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Delivery Instructions */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              {isHindi ? 'डिलीवरी निर्देश या अतिरिक्त नोट (वैकल्पिक)' : 'Delivery Notes or Specific Dispatch Instructions (Optional)'}
            </label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              placeholder={isHindi ? "उदा. शाम 5 बजे के बाद कॉल करें..." : "e.g. Leave package with security if unavailable..."}
              className="w-full px-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Right Sidebar: Order Summary & Place Order Action */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-sm font-extrabold text-navy border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>{isHindi ? 'ऑर्डर की समीक्षा' : 'Order Review'}</span>
              <span className="text-xs text-slate-500 font-normal">
                {cartCount} {isHindi ? 'बोतल' : 'Bottles'}
              </span>
            </h3>

            {/* Line items mini preview */}
            <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
              {cartItems.map(item => {
                const theme = getTheme(item.code);
                return (
                  <div key={item.code} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: theme.primary }}
                      />
                      <div>
                        <span className="font-bold text-navy block truncate max-w-[180px]">
                          {isHindi ? item.name_hi : item.name_en}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Qty: {item.quantity} × ₹{item.mrp}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-navy">
                      ₹{(item.mrp * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Financial Summary */}
            <div className="border-t border-slate-200 pt-3 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>{isHindi ? 'उप-कुल (Subtotal):' : 'Cart Subtotal:'}</span>
                <span className="font-semibold text-slate-800">₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>{isHindi ? 'शिपिंग शुल्क:' : 'Shipping Fee:'}</span>
                <span className="font-semibold text-slate-800">
                  {shippingFee === 0
                    ? <span className="text-emerald-700 font-bold uppercase">{isHindi ? 'निःशुल्क (FREE)' : 'FREE'}</span>
                    : `₹${shippingFee}`}
                </span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between items-baseline">
                <span className="text-sm font-extrabold text-navy">{isHindi ? 'कुल राशि:' : 'Total Payable:'}</span>
                <span className="text-2xl font-black text-cyan-800">
                  ₹{Math.round(totalAmount).toLocaleString('en-IN')}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block pt-1">
                {isHindi ? 'सभी कर व जीएसटी टैक्स इनवॉइस शामिल' : 'Inclusive of all taxes & factory GST invoice'}
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-navy hover:bg-cyan-700 text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Truck size={18} />
              <span>
                {submitting
                  ? (isHindi ? 'ऑर्डर दर्ज हो रहा है...' : 'Processing Order...')
                  : (isHindi ? `₹${Math.round(totalAmount)} का ऑर्डर दर्ज करें` : `Confirm Order (₹${Math.round(totalAmount)})`)}
              </span>
            </button>

            <div className="text-[11px] text-slate-500 space-y-1.5 pt-1">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                <span>{isHindi ? 'बीकानेर फैक्ट्री से सीधा डिस्पैच' : 'Direct shipment from central Bikaner warehouse'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck size={14} className="text-cyan-700 shrink-0" />
                <span>{isHindi ? '24 घंटे में डिस्पैच और लाइव ट्रैकिंग कोड' : 'Dispatch within 24 business hours with SMS/WhatsApp tracking'}</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

