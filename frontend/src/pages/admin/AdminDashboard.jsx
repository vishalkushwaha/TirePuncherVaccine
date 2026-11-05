import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag, Building2, Users, Package, ArrowUpRight,
  TrendingUp, Clock, AlertCircle, Phone, CheckCircle2
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ retail: { total: 0, new: 0 }, bulk: { total: 0, new: 0 } });
  const [recentRetail, setRecentRetail] = useState([]);
  const [recentBulk, setRecentBulk] = useState([]);
  const [productsCount, setProductsCount] = useState(3);
  const [distributorStats, setDistributorStats] = useState({ total: 0, new: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.admin.getStats().catch(() => ({ retail: { total: 0, new: 0 }, bulk: { total: 0, new: 0 } })),
      api.admin.getRetailQuotes().catch(() => []),
      api.admin.getBulkQuotes().catch(() => []),
      api.getProducts().catch(() => []),
      api.admin.getDistributorApps().catch(() => [])
    ]).then(([st, retList, bulkList, prods, distApps]) => {
      const apps = Array.isArray(distApps) ? distApps : [];
      setDistributorStats({ total: apps.length, new: apps.filter(a => a.status === 'New').length });
      setStats(st);
      setRecentRetail(retList.slice(0, 5) || []);
      setRecentBulk(bulkList.slice(0, 5) || []);
      setProductsCount(prods.length || 3);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-cyan-700">
            Overview Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy mt-1">
            Welcome back, {user?.full_name || user?.username}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ujjala Electricals · Tyre Puncture Vaccine Operations Portal (PostgreSQL)
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/admin/quotes/retail"
            className="bg-navy hover:bg-cyan-700 text-white font-bold px-4 py-2.5 rounded-lg text-xs shadow-xs transition-colors"
          >
            Review Retail Inquiries
          </Link>
          <Link
            to="/admin/quotes/bulk"
            className="bg-cyan-700 hover:bg-cyan-800 text-white font-bold px-4 py-2.5 rounded-lg text-xs shadow-xs transition-colors"
          >
            Review Bulk Inquiries
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Retail Quotes</span>
            <div className="p-2 bg-cyan-50 text-cyan-700 rounded-lg">
              <ShoppingBag size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-navy">{stats.retail.total}</span>
            {stats.retail.new > 0 && (
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                {stats.retail.new} New
              </span>
            )}
          </div>
          <Link to="/admin/quotes/retail" className="text-xs font-semibold text-cyan-700 hover:underline flex items-center gap-1 pt-2">
            <span>Open retail inbox</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Bulk Cartons</span>
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
              <Building2 size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-navy">{stats.bulk.total}</span>
            {stats.bulk.new > 0 && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                {stats.bulk.new} New
              </span>
            )}
          </div>
          <Link to="/admin/quotes/bulk" className="text-xs font-semibold text-cyan-700 hover:underline flex items-center gap-1 pt-2">
            <span>Open bulk orders</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Distributor Apps</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <Users size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-navy">{distributorStats.total}</span>
            {distributorStats.new > 0 && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                {distributorStats.new} New
              </span>
            )}
          </div>
          <Link to="/admin/distributors" className="text-xs font-semibold text-cyan-700 hover:underline flex items-center gap-1 pt-2">
            <span>Review territory applications</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Catalog Products</span>
            <div className="p-2 bg-purple-50 text-purple-700 rounded-lg">
              <Package size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-navy">{productsCount}</span>
            <span className="text-xs text-slate-500">Live products</span>
          </div>
          <Link to="/admin/products" className="text-xs font-semibold text-cyan-700 hover:underline flex items-center gap-1 pt-2">
            <span>Manage prices & formulas</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>

      {/* Recent Activity Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Retail Quotes */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-navy text-base">Recent Retail Quotes</h3>
            <Link to="/admin/quotes/retail" className="text-xs font-bold text-cyan-700 hover:underline">
              View All →
            </Link>
          </div>

          {recentRetail.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No retail quotes submitted yet.</p>
          ) : (
            <div className="divide-y divide-slate-100 text-xs">
              {recentRetail.map(q => (
                <div key={q.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="font-bold text-slate-800">{q.full_name}</span>
                    <span className="text-slate-500 block">{q.city} · {q.product_name} ({q.quantity} btl)</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      q.status === 'New' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {q.status}
                    </span>
                    <span className="block text-[10px] text-slate-400 font-mono mt-0.5">{q.quote_number}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Bulk Quotes */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-navy text-base">Recent Bulk / Fleet Quotes</h3>
            <Link to="/admin/quotes/bulk" className="text-xs font-bold text-cyan-700 hover:underline">
              View All →
            </Link>
          </div>

          {recentBulk.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No bulk quotes submitted yet.</p>
          ) : (
            <div className="divide-y divide-slate-100 text-xs">
              {recentBulk.map(q => (
                <div key={q.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="font-bold text-slate-800">{q.business_name}</span>
                    <span className="text-slate-500 block">{q.city} · {q.estimated_quantity}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      q.status === 'New' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {q.status}
                    </span>
                    <span className="block text-[10px] text-slate-400 font-mono mt-0.5">{q.quote_number}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

