import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Phone, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminQuotesRetail() {
  const [quotes, setQuotes] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState('');

  const loadQuotes = () => {
    setLoading(true);
    api.admin.getRetailQuotes(statusFilter)
      .then(data => {
        setQuotes(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadQuotes();
  }, [statusFilter]);

  const handleUpdate = async (id) => {
    try {
      await api.admin.updateRetailQuote(id, {
        status: editStatus,
        notes: editNotes
      });
      setSelectedQuote(null);
      loadQuotes();
    } catch (err) {
      alert('Update failed: ' + err.message);
    }
  };

  const filtered = quotes.filter(q =>
    q.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.phone.includes(searchTerm) ||
    q.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.quote_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">Retail Quotes Inbox</h1>
          <p className="text-xs text-slate-500">Track and manage retail bottle inquiries from vehicle owners</p>
        </div>

        <div className="flex items-center gap-2">
          {['', 'New', 'Called', 'Quoted', 'Won', 'Closed'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-navy text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {st || 'All Quotes'}
            </button>
          ))}
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
            placeholder="Search by customer name, phone, city, or quote #..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-hidden bg-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px] tracking-wider">
                <th className="p-4">Ref #</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Phone / City</th>
                <th className="p-4">Product / Qty</th>
                <th className="p-4">Vehicle</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(q => (
                <tr key={q.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 font-mono font-bold text-cyan-800">{q.quote_number}</td>
                  <td className="p-4 font-bold text-navy">{q.full_name}</td>
                  <td className="p-4">
                    <a href={`tel:${q.phone}`} className="font-semibold text-slate-800 hover:text-cyan-700 block">
                      {q.phone}
                    </a>
                    <span className="text-[11px] text-slate-500 block">{q.city}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-navy">{q.product_name}</span>
                    <span className="text-slate-500 block text-xs">{q.quantity} Bottle(s)</span>
                  </td>
                  <td className="p-4 text-slate-600 text-xs">{q.vehicle_type || '—'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      q.status === 'New' ? 'bg-amber-100 text-amber-800' :
                      q.status === 'Won' ? 'bg-emerald-100 text-emerald-800' :
                      q.status === 'Quoted' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {q.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedQuote(q);
                        setEditStatus(q.status);
                        setEditNotes(q.notes || '');
                      }}
                      className="px-3 py-1 bg-slate-100 hover:bg-cyan-700 hover:text-white rounded-md text-xs font-bold transition-colors"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manage Status Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-navy">Update Retail Quote</h3>
                <span className="text-xs text-slate-400 font-mono">{selectedQuote.quote_number}</span>
              </div>
              <button onClick={() => setSelectedQuote(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
              <div><strong>Customer:</strong> {selectedQuote.full_name} ({selectedQuote.phone})</div>
              <div><strong>Location:</strong> {selectedQuote.city}</div>
              <div><strong>Requirement:</strong> {selectedQuote.quantity}x {selectedQuote.product_name}</div>
              {selectedQuote.message && (
                <div className="pt-1 text-slate-600 italic">"{selectedQuote.message}"</div>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Status Pipeline</label>
                <select
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                >
                  <option value="New">New</option>
                  <option value="Called">Called / Contacted</option>
                  <option value="Quoted">Quoted / Price Sent</option>
                  <option value="Won">Won / Dispatched</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Internal Notes</label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  placeholder="e.g. Spoke to customer, dispatched via local courier..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedQuote(null)}
                className="px-4 py-2 border rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdate(selectedQuote.id)}
                className="px-5 py-2 bg-navy hover:bg-cyan-700 text-white rounded-lg text-xs font-bold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

