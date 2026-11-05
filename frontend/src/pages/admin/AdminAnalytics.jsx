import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Package,
  Layers
} from 'lucide-react';
import { api } from '../../services/api';

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.admin.getFunnelAnalytics()
      .then(data => {
        setAnalytics(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !analytics) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-cyan-600 border-t-transparent"></div>
        <p className="mt-2 text-xs text-slate-500">Loading live funnel & sales analytics...</p>
      </div>
    );
  }

  const { kpis, funnel_stages, products } = analytics;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <BarChart3 size={22} className="text-cyan-700" />
          <h1 className="text-2xl font-extrabold text-navy">Customer Journey & Sales Funnel Analytics</h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Real-time metrics tracking website visitors, product interactions, cart additions, drop-offs, and order conversions
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase text-slate-400">Total Store Revenue</span>
          <span className="text-2xl font-black text-emerald-700 block">
            ₹{Math.round(kpis.total_revenue).toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-400 block">From completed e-commerce orders</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase text-slate-400">Average Order Value (AOV)</span>
          <span className="text-2xl font-black text-cyan-800 block">
            ₹{Math.round(kpis.average_order_value).toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-400 block">Per checkout transaction</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase text-slate-400">Cart Abandonment Rate</span>
          <span className="text-2xl font-black text-amber-600 block">
            {kpis.cart_abandonment_rate}%
          </span>
          <span className="text-[10px] text-slate-400 block">Visitors who left before checkout</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase text-slate-400">Funnel Conversion Rate</span>
          <span className="text-2xl font-black text-navy block">
            {kpis.conversion_rate}%
          </span>
          <span className="text-[10px] text-slate-400 block">Visitor to completed purchase</span>
        </div>
      </div>

      {/* Visual Conversion Funnel */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-navy flex items-center gap-2">
            <TrendingUp size={18} className="text-cyan-700" />
            <span>Customer Journey Conversion Funnel</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Step-by-step conversion progression through the online purchasing journey
          </p>
        </div>

        <div className="space-y-4">
          {funnel_stages.map((stage, idx) => (
            <div key={stage.stage} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-navy flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-600 font-mono">
                    {idx + 1}
                  </span>
                  <span>{stage.stage}</span>
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-slate-800 font-extrabold">{stage.count.toLocaleString()}</span>
                  <span className="text-[11px] font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-100 w-14 text-center">
                    {stage.percentage}%
                  </span>
                </div>
              </div>

              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-600 to-indigo-700 transition-all duration-500 rounded-full"
                  style={{ width: `${Math.max(4, stage.percentage)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product-Specific Sales & Inventory Health */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div>
          <h2 className="text-base font-extrabold text-navy flex items-center gap-2">
            <Package size={18} className="text-cyan-700" />
            <span>Product Sales & Inventory Performance</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Breakdown of units sold, revenue, SKU identifiers, and current warehouse stock levels at Bikaner
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px] tracking-wider">
                <th className="p-4">Product Edition</th>
                <th className="p-4">SKU</th>
                <th className="p-4 text-center">Retail MRP</th>
                <th className="p-4 text-center">Units Sold</th>
                <th className="p-4 text-right">Revenue Generated</th>
                <th className="p-4 text-right">Available Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map(p => (
                <tr key={p.code} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 font-bold text-navy">
                    {p.name}
                    <span className="block text-[10px] text-slate-400 font-mono uppercase">Code: {p.code}</span>
                  </td>
                  <td className="p-4 font-mono text-xs text-slate-600 font-semibold">{p.sku}</td>
                  <td className="p-4 text-center font-semibold text-slate-800">₹{p.mrp}</td>
                  <td className="p-4 text-center font-extrabold text-navy">{p.units_sold}</td>
                  <td className="p-4 text-right font-black text-cyan-800">₹{p.revenue.toLocaleString('en-IN')}</td>
                  <td className="p-4 text-right">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold inline-block ${
                      p.stock_quantity < 30 ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {p.stock_quantity} in stock
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

