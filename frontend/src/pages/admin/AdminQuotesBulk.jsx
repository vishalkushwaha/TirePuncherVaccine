import React, { useState, useEffect } from 'react';
import {
  Building2,
  Search,
  Phone,
  Mail,
  Package,
  CheckCircle2,
  Calendar,
  MapPin,
  ExternalLink,
  MessageSquare,
  DollarSign
} from 'lucide-react';
import { api } from '../../services/api';

export default function AdminQuotesBulk() {
  const [quotes, setQuotes] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState('');

  const loadQuotes = () => {
    api.admin.getBulkQuotes(statusFilter)
      .then(data => setQuotes(data || []))
      .catch(() => {});
  };

  useEffect(() => {
    loadQuotes();
  }, [statusFilter]);

  const handleUpdate = async (id) => {
    try {
      await api.admin.updateBulkQuote(id, {
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
    (q.business_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (q.contact_person || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (q.phone || '').includes(searchTerm) ||
    (q.quote_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (q.city || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Compute key stats
  const totalBottlesCount = quotes.reduce((acc, q) => acc + (q.total_bottles || 0), 0);
  const totalValue = quotes.reduce((acc, q) => acc + (q.estimated_total || 0), 0);
  const newQuotesCount = quotes.filter(q => q.status === 'New').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">Wholesale & Fleet Quotations</h1>
          <p className="text-xs text-slate-500">
            Multi-product commercial orders, workshop cartons, and fleet supply requests
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {['', 'New', 'Called', 'Quoted', 'Won', 'Closed'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-navy text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {st || 'All Orders'}
              {st === 'New' && newQuotesCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 bg-emerald-500 text-white text-[10px] rounded-full">
                  {newQuotesCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">Total Inquiries</span>
          <span className="text-xl font-extrabold text-navy">{quotes.length}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">Total Volume</span>
          <span className="text-xl font-extrabold text-cyan-800">
            {totalBottlesCount > 0 ? `${totalBottlesCount} Bottles` : '—'}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">Estimated Pipeline</span>
          <span className="text-xl font-extrabold text-emerald-700">
            {totalValue > 0 ? `₹${Math.round(totalValue).toLocaleString('en-IN')}` : '—'}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">Action Needed</span>
          <span className="text-xl font-extrabold text-amber-600">{newQuotesCount} New</span>
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
            placeholder="Search by business name, contact, phone, city, or ref #..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 bg-white"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px] tracking-wider">
                <th className="p-4">Ref #</th>
                <th className="p-4">Business / Contact</th>
                <th className="p-4">Phone / City</th>
                <th className="p-4">Mixed Order Sizing</th>
                <th className="p-4">Estimated Total</th>
                <th className="p-4">GST #</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400 text-xs">
                    No wholesale quotation requests found.
                  </td>
                </tr>
              ) : (
                filtered.map(q => {
                  let items = [];
                  try {
                    if (q.items_json) items = JSON.parse(q.items_json);
                  } catch (e) {}

                  return (
                    <tr key={q.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 font-mono font-bold text-cyan-800">
                        {q.quote_number}
                        <span className="block text-[10px] text-slate-400 font-normal">
                          {q.created_at ? new Date(q.created_at).toLocaleDateString() : ''}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-navy block">{q.business_name}</span>
                        <span className="text-[11px] text-slate-500 block">Contact: {q.contact_person}</span>
                      </td>
                      <td className="p-4">
                        <a href={`tel:${q.phone}`} className="font-semibold text-slate-800 hover:text-cyan-700 block">
                          {q.phone}
                        </a>
                        <span className="text-[11px] text-slate-500 block">{q.city}, {q.state}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-navy block">
                          {q.total_bottles ? `${q.total_bottles} Bottles (MOQ ${q.total_bottles >= 10 ? 'OK' : 'Low'})` : q.estimated_quantity}
                        </span>
                        {items.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {items.map(it => (
                              <span key={it.code} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold uppercase">
                                {it.code}: {it.qty}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="p-4 font-bold text-cyan-900">
                        {q.estimated_total ? `₹${Math.round(q.estimated_total).toLocaleString('en-IN')}` : '—'}
                      </td>
                      <td className="p-4 font-mono text-[11px] text-slate-600 uppercase">
                        {q.gst_number || '—'}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          q.status === 'New' ? 'bg-emerald-100 text-emerald-800' :
                          q.status === 'Won' ? 'bg-cyan-100 text-cyan-800' :
                          q.status === 'Quoted' ? 'bg-indigo-100 text-indigo-800' :
                          q.status === 'Called' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-700'
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
                          className="px-3 py-1.5 bg-navy hover:bg-cyan-700 text-white rounded-md text-xs font-bold transition-colors"
                        >
                          Review & Quote
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

      {/* Review & Manage Modal */}
      {selectedQuote && (() => {
        let parsedItems = [];
        try {
          if (selectedQuote.items_json) parsedItems = JSON.parse(selectedQuote.items_json);
        } catch (e) {}

        const cleanPhone = (selectedQuote.phone || '').replace(/[^0-9]/g, '');

        return (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-extrabold tracking-wider bg-cyan-100 text-cyan-800 px-2.5 py-0.5 rounded-full">
                      Wholesale Order
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{selectedQuote.quote_number}</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-navy mt-1">
                    {selectedQuote.business_name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedQuote(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Direct Quick Communication Bar */}
              <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <a
                  href={`tel:${selectedQuote.phone}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                >
                  <Phone size={14} />
                  <span>Call {selectedQuote.phone}</span>
                </a>
                {cleanPhone && (
                  <a
                    href={`https://wa.me/91${cleanPhone}?text=Hello%20${encodeURIComponent(selectedQuote.contact_person || '')}%2C%20regarding%20your%20Tyre%20Puncture%20Vaccine%20quotation%20${selectedQuote.quote_number}...`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-bold transition-colors"
                  >
                    <MessageSquare size={14} />
                    <span>WhatsApp</span>
                  </a>
                )}
                {selectedQuote.email && (
                  <a
                    href={`mailto:${selectedQuote.email}?subject=Quotation%20${selectedQuote.quote_number}%20-%20Tyre%20Puncture%20Vaccine`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition-colors"
                  >
                    <Mail size={14} />
                    <span>Email</span>
                  </a>
                )}
              </div>

              {/* Customer Contact & Sizing Details */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-ice p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 uppercase tracking-wider block text-[10px] font-bold">Contact Person</span>
                  <span className="font-bold text-navy">{selectedQuote.contact_person}</span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase tracking-wider block text-[10px] font-bold">Location</span>
                  <span className="font-semibold text-slate-800">{selectedQuote.city}, {selectedQuote.state}</span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase tracking-wider block text-[10px] font-bold">GST Number</span>
                  <span className="font-mono text-slate-700 uppercase">{selectedQuote.gst_number || 'Not Provided'}</span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase tracking-wider block text-[10px] font-bold">Combined Sizing</span>
                  <span className="font-bold text-cyan-800">
                    {selectedQuote.total_bottles ? `${selectedQuote.total_bottles} Bottles Total` : selectedQuote.estimated_quantity}
                  </span>
                </div>
              </div>

              {/* Mixed Products Breakdown */}
              {parsedItems.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold text-navy uppercase tracking-wider flex items-center gap-2">
                    <Package size={14} className="text-cyan-700" />
                    <span>Selected Mixed Products & Calculated Pricing</span>
                  </h4>

                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                          <th className="p-2.5">Product</th>
                          <th className="p-2.5 text-center">Qty</th>
                          <th className="p-2.5 text-right">MRP</th>
                          <th className="p-2.5 text-right">Wholesale Rate</th>
                          <th className="p-2.5 text-right">Line Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {parsedItems.map(it => (
                          <tr key={it.code}>
                            <td className="p-2.5 font-bold text-navy">
                              {it.name_en || it.code.toUpperCase()}
                              <span className="text-[10px] font-mono text-slate-400 block uppercase">Code: {it.code}</span>
                            </td>
                            <td className="p-2.5 text-center font-bold text-slate-800">{it.qty}</td>
                            <td className="p-2.5 text-right text-slate-400 line-through">₹{it.mrp}</td>
                            <td className="p-2.5 text-right font-semibold text-cyan-800">₹{it.wholesaleRate}</td>
                            <td className="p-2.5 text-right font-extrabold text-navy">₹{it.lineTotal?.toLocaleString('en-IN')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col gap-1 text-xs">
                      {selectedQuote.estimated_subtotal && (
                        <div className="flex justify-between text-slate-500">
                          <span>Subtotal MRP:</span>
                          <span className="line-through">₹{Math.round(selectedQuote.estimated_subtotal).toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      {selectedQuote.estimated_discount && (
                        <div className="flex justify-between text-emerald-700 font-semibold">
                          <span>Wholesale Volume Discount:</span>
                          <span>- ₹{Math.round(selectedQuote.estimated_discount).toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm font-extrabold text-navy border-t pt-1">
                        <span>Net Quoted Value:</span>
                        <span className="text-cyan-800">
                          ₹{Math.round(selectedQuote.estimated_total || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                  <strong>Requested Quantity:</strong> {selectedQuote.estimated_quantity}
                </div>
              )}

              {/* Customer Notes */}
              {selectedQuote.message && (
                <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-amber-900 block">Customer Requirements / Fleet Details:</span>
                  <p className="italic text-slate-700">"{selectedQuote.message}"</p>
                </div>
              )}

              {/* Status & Internal Notes Controls */}
              <div className="space-y-4 pt-2 border-t">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Pipeline Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-cyan-600"
                  >
                    <option value="New">New (Unprocessed)</option>
                    <option value="Called">Called / In Discussion</option>
                    <option value="Quoted">Quoted / Rate Shared with Buyer</option>
                    <option value="Won">Won / Order Placed & Confirmed</option>
                    <option value="Closed">Closed (Lost / Ineligible)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Internal Sales & Dispatch Notes
                  </label>
                  <textarea
                    rows={3}
                    value={editNotes}
                    onChange={e => setEditNotes(e.target.value)}
                    placeholder="e.g. Quoted ₹749/bottle for 4 Gulf, ₹899 for 3 Rock, ₹1,124 for 3 Thor. Dispatch scheduled via Transport Nagar Bikaner..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedQuote(null)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdate(selectedQuote.id)}
                  className="px-5 py-2 bg-navy hover:bg-cyan-700 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
