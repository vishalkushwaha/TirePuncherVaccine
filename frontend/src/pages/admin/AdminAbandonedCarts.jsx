import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Phone,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight
} from 'lucide-react';
import { api } from '../../services/api';

export default function AdminAbandonedCarts() {
  const [carts, setCarts] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCart, setSelectedCart] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [loading, setLoading] = useState(true);

  const loadCarts = () => {
    setLoading(true);
    api.admin.getAbandonedCarts(statusFilter)
      .then(data => {
        setCarts(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadCarts();
  }, [statusFilter]);

  const handleUpdate = async () => {
    if (!selectedCart) return;
    try {
      await api.admin.updateAbandonedCart(selectedCart.id, {
        status: editStatus,
        recovery_notes: editNotes
      });
      setSelectedCart(null);
      loadCarts();
    } catch (err) {
      alert('Update failed: ' + err.message);
    }
  };

  const filtered = carts.filter(c =>
    (c.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.phone || '').includes(searchTerm) ||
    (c.cart_session_id || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAbandonedValue = carts.reduce((acc, c) => acc + (c.cart_value || 0), 0);
  const recoveredCount = carts.filter(c => c.status === 'Recovered').length;
  const pendingCount = carts.filter(c => c.status === 'Abandoned').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle size={22} className="text-amber-600" />
            <h1 className="text-2xl font-extrabold text-navy">Abandoned Cart & Lead Recovery</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track uncompleted shopping carts, view drop-off stages, and recover potential sales via 1-click WhatsApp follow-ups
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {['', 'Abandoned', 'Contacted', 'Recovered'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-navy text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {st || 'All Sessions'}
              {st === 'Abandoned' && pendingCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 bg-amber-500 text-white text-[10px] rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">Total Abandoned</span>
          <span className="text-xl font-extrabold text-navy">{carts.length}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">Potential Cart Value</span>
          <span className="text-xl font-extrabold text-amber-600">₹{Math.round(totalAbandonedValue).toLocaleString('en-IN')}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">Awaiting Recovery</span>
          <span className="text-xl font-extrabold text-red-600">{pendingCount} Needs Follow-up</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">Recovered Orders</span>
          <span className="text-xl font-extrabold text-emerald-700">{recoveredCount} Converted</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="max-w-md">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by customer name, phone, session ID..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 bg-white"
          />
        </div>
      </div>

      {/* Abandoned Carts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px] tracking-wider">
                <th className="p-4">Customer Contact</th>
                <th className="p-4">Items in Cart</th>
                <th className="p-4">Cart Value</th>
                <th className="p-4">Drop-off Stage</th>
                <th className="p-4">Time Left</th>
                <th className="p-4">Recovery Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400 text-xs">
                    {loading ? 'Loading cart sessions...' : 'No abandoned cart sessions found.'}
                  </td>
                </tr>
              ) : (
                filtered.map(cart => {
                  let items = [];
                  try {
                    items = JSON.parse(cart.items_json || '[]');
                  } catch (e) {}

                  const cleanPhone = (cart.phone || '').replace(/[^0-9]/g, '');
                  const waText = encodeURIComponent(
                    `Namaste ${cart.customer_name || 'Customer'} ji, we noticed you selected Tyre Puncture Vaccine sealant for your vehicle at our official website. Would you like assistance with delivery from our Bikaner facility?`
                  );

                  return (
                    <tr key={cart.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4">
                        <span className="font-bold text-navy block">
                          {cart.customer_name || 'Anonymous Visitor'}
                        </span>
                        {cart.phone ? (
                          <a href={`tel:${cart.phone}`} className="text-cyan-700 font-semibold block text-xs hover:underline">
                            {cart.phone}
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-400 block">Phone not provided yet</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-slate-800 block">
                          {items.reduce((a, b) => a + (b.quantity || 1), 0)} Bottles
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {items.map((it, idx) => (
                            <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold uppercase">
                              {it.code}: {it.quantity}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 font-black text-navy text-cyan-800">
                        ₹{Math.round(cart.cart_value).toLocaleString('en-IN')}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase">
                          {cart.step_reached}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500 text-xs">
                        {cart.updated_at ? new Date(cart.updated_at).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }) : '—'}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          cart.status === 'Recovered' ? 'bg-emerald-100 text-emerald-800' :
                          cart.status === 'Contacted' ? 'bg-cyan-100 text-cyan-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {cart.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1.5">
                        {cleanPhone && (
                          <a
                            href={`https://wa.me/91${cleanPhone}?text=${waText}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-xs font-bold transition-colors"
                            title="Send 1-Click WhatsApp Reminder"
                          >
                            <MessageSquare size={13} />
                            <span>WhatsApp</span>
                          </a>
                        )}
                        <button
                          onClick={() => {
                            setSelectedCart(cart);
                            setEditStatus(cart.status);
                            setEditNotes(cart.recovery_notes || '');
                          }}
                          className="px-2.5 py-1 bg-navy hover:bg-cyan-700 text-white rounded-md text-xs font-bold transition-colors"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manage Modal */}
      {selectedCart && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-navy">Update Recovery Status</h3>
                <span className="text-xs text-slate-400 font-mono">{selectedCart.cart_session_id}</span>
              </div>
              <button onClick={() => setSelectedCart(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
              <div><strong>Customer:</strong> {selectedCart.customer_name || 'Anonymous'} ({selectedCart.phone || 'No phone'})</div>
              <div><strong>Cart Value:</strong> ₹{Math.round(selectedCart.cart_value).toLocaleString('en-IN')}</div>
              <div><strong>Drop-off Step:</strong> {selectedCart.step_reached}</div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Recovery Pipeline Status</label>
                <select
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Abandoned">Abandoned (Pending Follow-up)</option>
                  <option value="Contacted">Contacted (WhatsApp / Call sent)</option>
                  <option value="Recovered">Recovered (Customer Purchased)</option>
                  <option value="Ignored">Ignored / Ineligible</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Follow-up Notes</label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  placeholder="e.g. Sent WhatsApp reminder offering free shipping from Bikaner..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setSelectedCart(null)} className="px-4 py-2 border rounded-lg text-xs font-semibold">
                Cancel
              </button>
              <button onClick={handleUpdate} className="px-5 py-2 bg-navy hover:bg-cyan-700 text-white rounded-lg text-xs font-bold">
                Save Recovery Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

