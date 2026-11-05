import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Phone,
  MessageSquare,
  Building2,
  ShoppingBag,
  AlertTriangle,
  Mail,
  CheckCircle2,
  Clock,
  Filter
} from 'lucide-react';
import { api } from '../../services/api';

export default function AdminCRM() {
  const [leads, setLeads] = useState([]);
  const [sourceFilter, setSourceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [loading, setLoading] = useState(true);

  const loadLeads = () => {
    setLoading(true);
    api.admin.getCRMLeads(sourceFilter, statusFilter, searchTerm)
      .then(data => {
        setLeads(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadLeads();
  }, [sourceFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadLeads();
  };

  const handleUpdate = async () => {
    if (!selectedLead) return;
    try {
      await api.admin.updateCRMLead(selectedLead.source_type, selectedLead.raw_id, {
        status: editStatus,
        notes: editNotes
      });
      setSelectedLead(null);
      loadLeads();
    } catch (err) {
      alert('Update failed: ' + err.message);
    }
  };

  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === 'New' || l.status === 'Abandoned').length;
  const wonLeads = leads.filter(l => l.status === 'Won' || l.status === 'Recovered').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users size={22} className="text-cyan-700" />
            <h1 className="text-2xl font-extrabold text-navy">Centralized CRM & Lead Pipeline</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Unified pipeline managing Retail Quotes, Wholesale Fleet Leads, Abandoned Carts, and Direct Inquiries in one place
          </p>
        </div>

        {/* Source Filter Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: '', label: 'All Sources' },
            { id: 'retail', label: 'Retail Quotes' },
            { id: 'bulk', label: 'Wholesale / Fleet' },
            { id: 'abandoned_cart', label: 'Abandoned Carts' },
            { id: 'contact', label: 'Contact Messages' }
          ].map(src => (
            <button
              key={src.id}
              onClick={() => setSourceFilter(src.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                sourceFilter === src.id
                  ? 'bg-navy text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {src.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">Total Pipeline Leads</span>
          <span className="text-xl font-extrabold text-navy">{totalLeads}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">Action Required (New)</span>
          <span className="text-xl font-extrabold text-amber-600">{newLeads}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">Converted Customers</span>
          <span className="text-xl font-extrabold text-emerald-700">{wonLeads}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">WhatsApp Ready</span>
          <span className="text-xl font-extrabold text-cyan-800">100% Leads</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-md">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by customer name, phone, ref #, city..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 bg-white"
          />
        </form>
      </div>

      {/* Unified Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px] tracking-wider">
                <th className="p-4">Lead Source</th>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Phone / City</th>
                <th className="p-4">Requirement / Sizing</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Quick Follow-up</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400 text-xs">
                    {loading ? 'Loading CRM pipeline...' : 'No leads found.'}
                  </td>
                </tr>
              ) : (
                leads.map(lead => {
                  const cleanPhone = (lead.phone || '').replace(/[^0-9]/g, '');
                  const waText = encodeURIComponent(
                    `Namaste ${lead.name} ji, regarding your Tyre Puncture Vaccine requirement (${lead.reference}) from Ujjala Electricals Bikaner. How can we assist you with delivery today?`
                  );

                  return (
                    <tr key={lead.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-block ${
                          lead.source_type === 'bulk' ? 'bg-indigo-100 text-indigo-800' :
                          lead.source_type === 'retail' ? 'bg-cyan-100 text-cyan-800' :
                          lead.source_type === 'abandoned_cart' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {lead.source}
                        </span>
                        <span className="block text-[10px] text-slate-400 font-mono mt-0.5">{lead.reference}</span>
                      </td>
                      <td className="p-4 font-bold text-navy">
                        {lead.name}
                        {lead.email && <span className="block text-[10px] text-slate-400 font-normal">{lead.email}</span>}
                      </td>
                      <td className="p-4">
                        <a href={`tel:${lead.phone}`} className="font-semibold text-slate-800 hover:text-cyan-700 block">
                          {lead.phone}
                        </a>
                        <span className="text-[11px] text-slate-500 block">{lead.city}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-navy block">{lead.product}</span>
                        <span className="text-[11px] text-slate-500 block">{lead.quantity}</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          lead.status === 'Won' || lead.status === 'Recovered' ? 'bg-emerald-100 text-emerald-800' :
                          lead.status === 'Called' || lead.status === 'Contacted' ? 'bg-cyan-100 text-cyan-800' :
                          lead.status === 'Quoted' ? 'bg-indigo-100 text-indigo-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-slate-500">
                        {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : '—'}
                      </td>
                      <td className="p-4 text-right space-x-1.5">
                        {cleanPhone && (
                          <a
                            href={`https://wa.me/91${cleanPhone}?text=${waText}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-xs font-bold transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <MessageSquare size={13} />
                            <span>WhatsApp</span>
                          </a>
                        )}
                        <button
                          onClick={() => {
                            setSelectedLead(lead);
                            setEditStatus(lead.status);
                            setEditNotes(lead.notes || '');
                          }}
                          className="px-2.5 py-1 bg-navy hover:bg-cyan-700 text-white rounded-md text-xs font-bold transition-colors"
                        >
                          Update
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

      {/* Edit Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-navy">Update Lead Pipeline</h3>
                <span className="text-xs text-slate-400 font-mono">{selectedLead.reference} ({selectedLead.source})</span>
              </div>
              <button onClick={() => setSelectedLead(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
              <div><strong>Lead Name:</strong> {selectedLead.name}</div>
              <div><strong>Phone:</strong> {selectedLead.phone}</div>
              <div><strong>Requirement:</strong> {selectedLead.product} ({selectedLead.quantity})</div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Pipeline Status</label>
                <select
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                >
                  <option value="New">New Lead</option>
                  <option value="Contacted">Contacted / Discussion</option>
                  <option value="Quoted">Quoted / Rate Shared</option>
                  <option value="Negotiation">In Negotiation</option>
                  <option value="Won">Won / Order Placed</option>
                  <option value="Recovered">Recovered (Abandoned Cart)</option>
                  <option value="Closed">Closed / Lost</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Follow-up & Activity Notes</label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  placeholder="e.g. Followed up on WhatsApp regarding delivery time..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setSelectedLead(null)} className="px-4 py-2 border rounded-lg text-xs font-semibold">
                Cancel
              </button>
              <button onClick={handleUpdate} className="px-5 py-2 bg-navy hover:bg-cyan-700 text-white rounded-lg text-xs font-bold">
                Save Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

