import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, Printer, Truck, ArrowRight, Home, Phone, MapPin, Calendar, FileText } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';

export default function OrderConfirmed() {
  const { orderNumber } = useParams();
  const { isHindi } = useLanguage();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (orderNumber) {
      api.getOrderByNumber(orderNumber)
        .then(data => {
          setOrder(data);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message || 'Order details not found');
          setLoading(false);
        });
    }
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-cyan-600 border-t-transparent"></div>
        <p className="mt-2 text-xs text-slate-500">Loading order receipt...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4 px-4">
        <h1 className="text-2xl font-extrabold text-navy">Order Not Found</h1>
        <p className="text-sm text-slate-500">
          {error || 'Order could not be located.'} Please check your order number or track it below.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/track-order"
            className="w-full sm:w-auto bg-navy hover:bg-cyan-700 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors"
          >
            Track an Order
          </Link>
          <Link
            to="/"
            className="w-full sm:w-auto border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-bold px-5 py-2.5 rounded-lg transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Header Badge */}
      <div className="text-center space-y-3">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 size={44} />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          {isHindi ? 'ऑर्डर सफलतापूर्वक दर्ज हुआ' : 'Order Placed & Confirmed'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy">
          {isHindi ? 'धन्यवाद! आपका ऑर्डर प्राप्त हो गया है' : 'Thank You! Your Order is Received'}
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm max-w-lg mx-auto">
          {isHindi
            ? 'उजाला इलेक्ट्रिकल्स (बीकानेर) आपके ऑर्डर की तैयारी कर रहा है। ट्रैकिंग विवरण आपके दिए गए मोबाइल पर भेजा जाएगा।'
            : 'Your order has been forwarded to our central Bikaner dispatch warehouse. Tracking updates will be shared via SMS/WhatsApp.'}
        </p>
      </div>

      {/* Order Tracking Reference Card */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-2">
        <span className="text-xs text-slate-500 uppercase tracking-wider block font-semibold">
          {isHindi ? 'ऑर्डर ट्रैकिंग संख्या (Order Reference Number):' : 'Official Order Tracking Number:'}
        </span>
        <span className="text-2xl sm:text-3xl font-black text-navy font-mono text-cyan-800 tracking-wider block">
          {order.order_number}
        </span>
        <span className="text-[11px] text-slate-400 block">
          {isHindi ? 'कृपया भविष्य में किसी भी पूछताछ के लिए यह नंबर सुरक्षित रखें।' : 'Keep this order number for live tracking & customer support.'}
        </span>
      </div>

      {/* Invoice Details Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-extrabold text-navy text-base flex items-center gap-2">
              <FileText size={18} className="text-cyan-700" />
              <span>{isHindi ? 'टैक्स इनवॉइस व ऑर्डर सारांश' : 'Tax Invoice & Order Receipt'}</span>
            </h3>
            <span className="text-[11px] text-slate-400">
              {new Date(order.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
            </span>
          </div>

          <button
            onClick={() => window.print()}
            className="self-start sm:self-auto px-3.5 py-1.5 border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Printer size={14} />
            <span>{isHindi ? 'इनवॉइस प्रिंट करें' : 'Print Invoice'}</span>
          </button>
        </div>

        {/* Customer & Shipping Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div>
            <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">
              {isHindi ? 'डिलीवरी का पता:' : 'Shipping Address:'}
            </span>
            <span className="font-extrabold text-navy block mt-0.5">{order.customer_name}</span>
            <span className="text-slate-600 block">{order.shipping_address}</span>
            <span className="text-slate-600 block">{order.city}, {order.state} - {order.pin_code}</span>
            <span className="text-slate-700 font-semibold block mt-1">Phone: {order.customer_phone}</span>
          </div>

          <div>
            <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">
              {isHindi ? 'भुगतान विवरण:' : 'Payment & Status:'}
            </span>
            <span className="font-bold text-navy block mt-0.5">
              Method: {order.payment_method === 'COD' ? 'Cash on Delivery (COD)' : 'Online Payment'}
            </span>
            <span className="text-slate-600 block">Payment Status: {order.payment_status}</span>
            <span className="text-slate-600 block">Fulfillment: {order.order_status}</span>
            <span className="text-slate-600 block mt-1">Dispatch Hub: Rani Bazar, Bikaner</span>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-2.5">Item</th>
                <th className="py-2.5 text-center">Qty</th>
                <th className="py-2.5 text-right">Unit Price</th>
                <th className="py-2.5 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items?.map(it => (
                <tr key={it.id}>
                  <td className="py-3 font-bold text-navy">
                    {it.product_name}
                    <span className="block text-[10px] text-slate-400 uppercase font-mono">Code: {it.product_code}</span>
                  </td>
                  <td className="py-3 text-center font-bold text-slate-800">{it.quantity}</td>
                  <td className="py-3 text-right text-slate-600">₹{it.unit_price}</td>
                  <td className="py-3 text-right font-extrabold text-navy">₹{it.total_price?.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs text-slate-600">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="font-semibold text-slate-800">₹{order.subtotal?.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span className="font-semibold text-slate-800">
              {order.shipping_fee === 0 ? 'FREE' : `₹${order.shipping_fee}`}
            </span>
          </div>
          <div className="flex justify-between text-base font-extrabold text-navy border-t pt-2">
            <span>Total Paid / Payable:</span>
            <span className="text-cyan-800 font-black">₹{Math.round(order.total_amount).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Help & Actions */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <Link
          to={`/track-order?order=${order.order_number}`}
          className="inline-flex items-center gap-2 bg-navy hover:bg-cyan-700 text-white font-bold px-6 py-3 rounded-lg text-xs sm:text-sm shadow-md transition-colors"
        >
          <Truck size={16} />
          <span>{isHindi ? 'लाइव ऑर्डर ट्रैक करें' : 'Track This Order'}</span>
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-white border border-slate-300 hover:border-cyan-600 text-slate-800 font-semibold px-6 py-3 rounded-lg text-xs sm:text-sm transition-colors"
        >
          <Home size={16} />
          <span>{isHindi ? 'होम पेज पर लौटें' : 'Return to Home'}</span>
        </Link>
      </div>
    </div>
  );
}

