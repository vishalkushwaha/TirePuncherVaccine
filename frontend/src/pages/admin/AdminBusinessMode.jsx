import React, { useState, useEffect } from 'react';
import {
  Sliders,
  ShoppingBag,
  Building2,
  Layers,
  CheckCircle2,
  Save,
  RotateCcw,
  ShieldAlert,
  CreditCard,
  Truck,
  Sparkles,
  Lock,
  Tag,
  Phone
} from 'lucide-react';
import { api } from '../../services/api';
import { useShopConfig } from '../../context/ShopConfigContext';

export default function AdminBusinessMode() {
  const { refreshConfig } = useShopConfig();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [form, setForm] = useState({
    business_mode: 'quotation', // 'quotation', 'ecommerce', 'hybrid'
    ecommerce_enabled: 'false',
    allow_add_to_cart: 'false',
    allow_buy_now: 'false',
    allow_guest_checkout: 'false',
    allow_customer_registration: 'false',
    enable_cod: 'false',
    enable_online_payment: 'false',
    enable_coupons: 'false',
    enable_abandoned_cart_tracking: 'true',
    enable_order_tracking: 'true',
    enable_returns_refunds: 'false',
    free_shipping_threshold: '1999',
    default_shipping_fee: '99',
    support_phone: '+91 74130 59364'
  });

  const loadSettings = () => {
    setLoading(true);
    api.getSettings().then(data => {
      if (data) {
        setForm(prev => ({ ...prev, ...data }));
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleModeChange = (mode) => {
    setForm(prev => {
      if (mode === 'quotation') {
        return {
          ...prev,
          business_mode: 'quotation',
          ecommerce_enabled: 'false',
          allow_add_to_cart: 'false',
          allow_buy_now: 'false'
        };
      } else if (mode === 'ecommerce') {
        return {
          ...prev,
          business_mode: 'ecommerce',
          ecommerce_enabled: 'true',
          allow_add_to_cart: 'true',
          allow_buy_now: 'true'
        };
      } else { // hybrid
        return {
          ...prev,
          business_mode: 'hybrid',
          ecommerce_enabled: 'true',
          allow_add_to_cart: 'true',
          allow_buy_now: 'true'
        };
      }
    });
  };

  const handleToggle = (key) => {
    setForm(prev => ({
      ...prev,
      [key]: prev[key] === 'true' ? 'false' : 'true'
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      await api.admin.updateSettings(form);
      refreshConfig();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert('Failed to save settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-cyan-600 border-t-transparent"></div>
        <p className="mt-2 text-xs text-slate-500">Loading business configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders size={22} className="text-cyan-700" />
            <h1 className="text-2xl font-extrabold text-navy">Business Mode & Sales Configuration</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Control customer journeys, enable/disable e-commerce features, and configure sales modes dynamically without code changes
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <CheckCircle2 size={14} />
              Saved & Live!
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 bg-navy hover:bg-cyan-700 text-white rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={15} />
            <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: MASTER BUSINESS MODE SELECTOR */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div>
          <h2 className="text-base font-extrabold text-navy flex items-center gap-2">
            <Sparkles size={18} className="text-cyan-700" />
            <span>Primary Business Operation Mode</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select how customers interact with your products. Changes take effect across the entire website instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Mode A: Quotation Only */}
          <div
            onClick={() => handleModeChange('quotation')}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
              form.business_mode === 'quotation'
                ? 'border-cyan-600 bg-cyan-50/40 shadow-md ring-2 ring-cyan-600/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                  <Building2 size={20} />
                </span>
                {form.business_mode === 'quotation' && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-600 text-white shadow-xs">
                    Initial Default · Active
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-extrabold text-navy text-sm">Mode A: Quotation System</h3>
                <span className="text-[11px] font-bold text-slate-400 block mt-0.5">Offline Inquiry Desk</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Customers submit Retail and Wholesale quotation requests. Admin handles orders manually via phone or dispatch quote. No direct checkout.
              </p>
            </div>
            <ul className="text-[11px] text-slate-500 space-y-1 pt-4 border-t border-slate-200/60 mt-4">
              <li>✓ Retail quotation requests</li>
              <li>✓ Wholesale 10-bottle MOQ form</li>
              <li>✕ Direct Add to Cart disabled</li>
            </ul>
          </div>

          {/* Mode B: Full E-Commerce */}
          <div
            onClick={() => handleModeChange('ecommerce')}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
              form.business_mode === 'ecommerce'
                ? 'border-cyan-600 bg-cyan-50/40 shadow-md ring-2 ring-cyan-600/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                  <ShoppingBag size={20} />
                </span>
                {form.business_mode === 'ecommerce' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-cyan-600 text-white">
                    Active Mode
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-extrabold text-navy text-sm">Mode B: Full E-Commerce</h3>
                <span className="text-[11px] font-bold text-slate-400 block mt-0.5">Complete Digital Store</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Complete online shopping journey: Add to Cart, Buy Now, Cart Drawer, Checkout, COD and Online Payments, Automated Invoicing and Tracking.
              </p>
            </div>
            <ul className="text-[11px] text-slate-500 space-y-1 pt-4 border-t border-slate-200/60 mt-4">
              <li>✓ Add to Cart & Buy Now</li>
              <li>✓ Cash on Delivery & Online UPI</li>
              <li>✓ Cart Recovery & Invoicing</li>
            </ul>
          </div>

          {/* Mode C: Hybrid System */}
          <div
            onClick={() => handleModeChange('hybrid')}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
              form.business_mode === 'hybrid'
                ? 'border-cyan-600 bg-cyan-50/40 shadow-md ring-2 ring-cyan-600/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                  <Layers size={20} />
                </span>
                {form.business_mode === 'hybrid' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-cyan-600 text-white">
                    Recommended Active
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-extrabold text-navy text-sm">Mode C: Hybrid System</h3>
                <span className="text-[11px] font-bold text-cyan-700 block mt-0.5">Best of Both Worlds</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Retail vehicle owners can purchase bottles directly online, while commercial fleets and stockists continue using the multi-product quotation engine.
              </p>
            </div>
            <ul className="text-[11px] text-slate-500 space-y-1 pt-4 border-t border-slate-200/60 mt-4">
              <li>✓ Retail Direct Purchase</li>
              <li>✓ Wholesale Fleet Quotations</li>
              <li>✓ Unified CRM for all leads</li>
            </ul>
          </div>
        </div>
      </div>

      {/* SECTION 2: GRANULAR FEATURE TOGGLES */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-navy">Granular Feature Toggles & Capabilities</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Enable or disable specific e-commerce modules independently without touching code.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              key: 'ecommerce_enabled',
              label: 'Master E-Commerce Engine',
              desc: 'Enables or disables cart, checkout, and online order placement system-wide'
            },
            {
              key: 'allow_add_to_cart',
              label: 'Slide-over Cart & Add to Cart',
              desc: 'Shows Add to Cart buttons on product pages and enables the cart drawer'
            },
            {
              key: 'allow_buy_now',
              label: '1-Click "Buy Now" Checkout',
              desc: 'Direct checkout button bypassing the cart for faster purchase completion'
            },
            {
              key: 'allow_guest_checkout',
              label: 'Guest Checkout (No Registration Required)',
              desc: 'Allows visitors to place orders without creating a password'
            },
            {
              key: 'enable_cod',
              label: 'Cash on Delivery (COD) Payment',
              desc: 'Enables doorstep cash/scanner payment option at checkout'
            },
            {
              key: 'enable_online_payment',
              label: 'Instant Online Payment Gateway',
              desc: 'Accepts UPI, NetBanking, and credit/debit cards via secure sandbox'
            },
            {
              key: 'enable_coupons',
              label: 'Promo Coupons & Discount Codes',
              desc: 'Enables coupon validation field in cart and checkout (e.g. WELCOME10)'
            },
            {
              key: 'enable_abandoned_cart_tracking',
              label: 'Abandoned Cart & Lead Recovery',
              desc: 'Tracks uncompleted checkout sessions for 1-click WhatsApp follow-ups'
            },
            {
              key: 'enable_order_tracking',
              label: 'Public Live Courier Order Tracking',
              desc: 'Allows customers to view timeline status via order reference number'
            },
            {
              key: 'enable_returns_refunds',
              label: 'Returns & Replacement Workflow',
              desc: 'Enables customer return requests and inventory restock handlers'
            }
          ].map(toggle => (
            <div
              key={toggle.key}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-3"
            >
              <div>
                <span className="text-xs font-bold text-navy block">{toggle.label}</span>
                <span className="text-[11px] text-slate-500 block mt-0.5 leading-relaxed">{toggle.desc}</span>
              </div>
              <button
                type="button"
                onClick={() => handleToggle(toggle.key)}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 mt-1 ${
                  form[toggle.key] === 'true' ? 'bg-cyan-700' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 left-1 ${
                    form[toggle.key] === 'true' ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: SHIPPING & INVENTORY RULES */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-navy">Shipping Charges & Logistics Configuration</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure delivery rules and customer service contacts for order processing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              Free Shipping Threshold (₹)
            </label>
            <input
              type="number"
              value={form.free_shipping_threshold}
              onChange={e => setForm({ ...form, free_shipping_threshold: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 bg-white"
            />
            <span className="text-[10px] text-slate-400 block mt-1">Orders above this qualify for FREE delivery</span>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              Standard Shipping Fee (₹)
            </label>
            <input
              type="number"
              value={form.default_shipping_fee}
              onChange={e => setForm({ ...form, default_shipping_fee: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 bg-white"
            />
            <span className="text-[10px] text-slate-400 block mt-1">Applied when cart is below free threshold</span>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              Helpline Phone Number
            </label>
            <input
              type="text"
              value={form.support_phone}
              onChange={e => setForm({ ...form, support_phone: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 bg-white"
            />
            <span className="text-[10px] text-slate-400 block mt-1">Shown on receipts and WhatsApp reminders</span>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-navy hover:bg-cyan-700 text-white rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={15} />
            <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

