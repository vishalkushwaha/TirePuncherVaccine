import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Truck, CheckCircle2, Clock, MapPin, Package, Phone, AlertCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const { isHindi } = useLanguage();
  const [query, setQuery] = useState(searchParams.get('order') || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrder = (num) => {
    if (!num.trim()) return;
    setLoading(true);
    setError('');
    api.getOrderByNumber(num.trim())
      .then(data => {
        setOrder(data);
        setLoading(false);
      })
      .catch(err => {
        setOrder(null);
        setError(err.message || 'No order found with that tracking reference number');
        setLoading(false);
      });
  };

  useEffect(() => {
    const param = searchParams.get('order');
    if (param) {
      setQuery(param);
      fetchOrder(param);
    }
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchOrder(query);
  };

  const getStepActive = (status, stepName) => {
    const steps = ['New', 'Processing', 'Dispatched', 'Delivered'];
    const statusMap = {
      'New': 0,
      'Processing': 1,
      'Dispatched': 2,
      'Delivered': 3,
      'Cancelled': -1
    };
    const currentIdx = statusMap[status] ?? 0;
    const stepIdx = steps.indexOf(stepName);
    return stepIdx <= currentIdx;
  };

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Title */}
      <div className="text-center space-y-3">
        <span className="text-xs uppercase font-bold tracking-wider text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-100">
          {isHindi ? 'लाइव डिलीवरी ट्रैकर' : 'Live Delivery Tracking'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy">
          {isHindi ? 'अपना ऑर्डर ट्रैक करें' : 'Track Your Shipment'}
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm max-w-lg mx-auto">
          {isHindi
            ? 'अपनी ऑर्डर संख्या (उदा. TPV-261105-8492) दर्ज करें और बीकानेर केंद्रीय गोदाम से लाइव डिस्पैच स्थिति देखें।'
            : 'Enter your official order tracking reference code to check real-time dispatch progress from our Bikaner hub.'}
        </p>
      </div>

      {/* Search Input Box */}
      <div className="max-w-xl mx-auto">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value.toUpperCase())}
              placeholder="e.g. TPV-261105-8492"
              className="w-full pl-10 pr-4 py-3 text-sm border border-slate-300 rounded-xl uppercase font-mono focus:ring-2 focus:ring-cyan-600 focus:outline-hidden bg-white shadow-xs"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-6 py-3 bg-navy hover:bg-cyan-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-colors disabled:opacity-50"
          >
            {loading ? '...' : (isHindi ? 'ट्रैक करें' : 'Track')}
          </button>
        </form>
      </div>

      {error && (
        <div className="max-w-xl mx-auto p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Order Status Display */}
      {order && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8 animate-in fade-in">
          {/* Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Order Reference</span>
              <span className="text-xl sm:text-2xl font-black text-navy font-mono text-cyan-800">{order.order_number}</span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Recipient: {order.customer_name} ({order.city}, {order.state})
              </span>
            </div>

            <div className="text-left sm:text-right">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase inline-block ${
                order.order_status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                order.order_status === 'Dispatched' ? 'bg-cyan-100 text-cyan-800' :
                order.order_status === 'Processing' ? 'bg-indigo-100 text-indigo-800' :
                'bg-slate-100 text-slate-700'
              }`}>
                Current Status: {order.order_status}
              </span>
              {order.tracking_number && (
                <div className="text-xs text-slate-600 mt-1">
                  Courier: <strong>{order.shipping_partner || 'Road Freight'}</strong> #{order.tracking_number}
                </div>
              )}
            </div>
          </div>

          {/* Timeline Progress */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isHindi ? 'डिलीवरी प्रगति टाइमलाइन' : 'Shipment Progress Timeline'}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Order Confirmed', step: 'New', desc: 'Received & verified' },
                { label: 'Processing & Packed', step: 'Processing', desc: 'Rani Bazar, Bikaner' },
                { label: 'Dispatched', step: 'Dispatched', desc: order.shipping_partner || 'In Transit' },
                { label: 'Delivered', step: 'Delivered', desc: 'Safely arrived' }
              ].map(st => {
                const active = getStepActive(order.order_status, st.step);
                return (
                  <div key={st.step} className={`p-4 rounded-xl border text-center transition-all ${
                    active ? 'border-cyan-500 bg-cyan-50/50 shadow-xs' : 'border-slate-200 bg-slate-50 opacity-60'
                  }`}>
                    <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold text-xs mb-2 ${
                      active ? 'bg-cyan-700 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {active ? '✓' : '•'}
                    </div>
                    <span className="text-xs font-bold text-navy block">{st.label}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{st.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery & Items Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100 text-xs">
            <div className="space-y-2">
              <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
                Items in This Shipment:
              </span>
              <div className="space-y-1.5">
                {order.items?.map(it => (
                  <div key={it.id} className="flex justify-between text-slate-700">
                    <span>{it.quantity}× {it.product_name}</span>
                    <span className="font-bold">₹{it.total_price}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
                Destination Address:
              </span>
              <p className="text-slate-700 leading-relaxed">
                {order.shipping_address}, {order.city}, {order.state} - {order.pin_code}
              </p>
              <span className="text-slate-500 block pt-1">
                Payment: <strong>{order.payment_method}</strong> ({order.payment_status})
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Support Box */}
      <div className="max-w-xl mx-auto p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Phone size={16} className="text-cyan-700" />
          <span>{isHindi ? 'डिलीवरी सहायता के लिए संपर्क करें:' : 'Need dispatch delivery assistance?'}</span>
        </div>
        <a href="tel:+917413059364" className="font-bold text-navy hover:underline">
          +91 74130 59364
        </a>
      </div>
    </div>
  );
}

