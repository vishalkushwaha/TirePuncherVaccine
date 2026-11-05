import React, { useState, useEffect } from 'react';
import { Users, Search, Phone, MapPin } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminDistributors() {
  const [apps, setApps] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const loadApps = () => {
    api.admin.getDistributorApps(statusFilter)
      .then(data => setApps(data || []))
      .catch(() => {});
  };

  useEffect(() => {
    loadApps();
  }, [statusFilter]);

  const handleUpdate = async (id) => {
    try {
      await api.admin.updateDistributorApp(id, {
        status: editStatus,
        notes: editNotes
      });
      setSelectedApp(null);
      loadApps();
    } catch (err) {
      alert('Update failed: ' + err.message);
    }
  };

  const filtered = apps.filter(a =>
    a.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">Distributor Applications</h1>
          <p className="text-xs text-slate-500">Review partnership requests across Rajasthan districts and tehsils</p>
        </div>

        <div className="flex items-center gap-2">
          {['', 'New', 'Contacted', 'Approved', 'Rejected'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-navy text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {st || 'All Applications'}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-md">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search by applicant name, phone, district, or city..."
          className="w-full px-4 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 bg-white"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px] tracking-wider">
                <th className="p-4">Ref #</th>
                <th className="p-4">Applicant</th>
                <th className="p-4">Phone / City</th>
                <th className="p-4">Requested District / Tehsil</th>
                <th className="p-4">Current Business</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(a => (
                <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 font-mono font-bold text-cyan-800">{a.application_number}</td>
                  <td className="p-4 font-bold text-navy">{a.full_name}</td>
                  <td className="p-4">
                    <a href={`tel:${a.phone}`} className="font-semibold text-slate-800 hover:text-cyan-700 block">
                      {a.phone}
                    </a>
                    <span className="text-[11px] text-slate-500 block">{a.city}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-navy block">{a.district}</span>
                    <span className="text-[11px] text-slate-500 block">{a.tehsil || a.city}</span>
                  </td>
                  <td className="p-4 text-slate-600 text-xs">{a.current_business || '—'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      a.status === 'New' ? 'bg-amber-100 text-amber-800' :
                      a.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedApp(a);
                        setEditStatus(a.status);
                        setEditNotes(a.notes || '');
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

      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-navy">Distributor Application</h3>
                <span className="text-xs text-slate-400 font-mono">{selectedApp.application_number}</span>
              </div>
              <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
              <div><strong>Applicant:</strong> {selectedApp.full_name} ({selectedApp.phone})</div>
              <div><strong>Territory:</strong> {selectedApp.city}, District: {selectedApp.district} (Tehsil: {selectedApp.tehsil || 'N/A'})</div>
              <div><strong>Investment:</strong> {selectedApp.investment_capacity}</div>
              <div><strong>Current Line:</strong> {selectedApp.current_business || 'N/A'}</div>
              {selectedApp.message && <div className="italic pt-1 text-slate-600">"{selectedApp.message}"</div>}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Status</label>
                <select
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted / Interviewed</option>
                  <option value="Approved">Approved / Territory Assigned</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Notes</label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  placeholder="e.g. Approved for Bikaner district, initial stock dispatched..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setSelectedApp(null)} className="px-4 py-2 border rounded-lg text-xs font-semibold">
                Cancel
              </button>
              <button onClick={() => handleUpdate(selectedApp.id)} className="px-5 py-2 bg-navy hover:bg-cyan-700 text-white rounded-lg text-xs font-bold">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

