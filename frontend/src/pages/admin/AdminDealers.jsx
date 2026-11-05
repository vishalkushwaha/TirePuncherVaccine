import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Edit, Trash2, X } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminDealers() {
  const [dealers, setDealers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialForm = {
    dealer_name: '',
    contact_person: '',
    phone: '+91 74130 59364',
    email: '',
    address: '',
    city: 'Bikaner',
    district: 'Bikaner',
    state: 'Rajasthan',
    pin_code: '334001',
    is_active: true,
    sort_order: 1
  };

  const [form, setForm] = useState(initialForm);

  const loadDealers = () => {
    api.admin.getAllDealers()
      .then(data => setDealers(data || []))
      .catch(() => {});
  };

  useEffect(() => {
    loadDealers();
  }, []);

  const openNew = () => {
    setEditingId(null);
    setForm(initialForm);
    setIsModalOpen(true);
  };

  const openEdit = (d) => {
    setEditingId(d.id);
    setForm({ ...d });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.admin.updateDealer(editingId, form);
      } else {
        await api.admin.createDealer(form);
      }
      setIsModalOpen(false);
      loadDealers();
    } catch (err) {
      alert('Save failed: ' + err.message);
    }
  };

  const handleDelete = async (id, name) => {
    if (confirm(`Remove dealer "${name}"?`)) {
      try {
        await api.admin.deleteDealer(id);
        loadDealers();
      } catch (err) {
        alert('Delete failed: ' + err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">Where to Buy Dealers</h1>
          <p className="text-xs text-slate-500">Manage appointed distribution hubs and regional retail outlets</p>
        </div>

        <button
          onClick={openNew}
          className="bg-navy hover:bg-cyan-700 text-white font-bold px-4 py-2.5 rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add Authorized Dealer</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px] tracking-wider">
                <th className="p-4">Dealer / Outlet</th>
                <th className="p-4">Contact</th>
                <th className="p-4">City / District</th>
                <th className="p-4">Address</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dealers.map(d => (
                <tr key={d.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 font-bold text-navy">{d.dealer_name}</td>
                  <td className="p-4">
                    <span className="block text-slate-800 font-semibold">{d.phone}</span>
                    <span className="block text-[11px] text-slate-500">{d.contact_person}</span>
                  </td>
                  <td className="p-4 font-semibold text-cyan-800">{d.city}, {d.district}</td>
                  <td className="p-4 text-slate-600 max-w-xs truncate">{d.address}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      d.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {d.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => openEdit(d)} className="p-1.5 hover:text-cyan-700">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(d.id, d.dealer_name)} className="p-1.5 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-bold text-navy">{editingId ? 'Edit Dealer' : 'Add Dealer'}</h2>
              <button onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Dealer / Firm Name *</label>
                <input
                  type="text"
                  required
                  value={form.dealer_name}
                  onChange={e => setForm({ ...form, dealer_name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={form.contact_person}
                    onChange={e => setForm({ ...form, contact_person: e.target.value })}
                    className="w-full px-3 py-2 text-xs border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                    className="w-full px-3 py-2 text-xs border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">District</label>
                  <input
                    type="text"
                    value={form.district}
                    onChange={e => setForm({ ...form, district: e.target.value })}
                    className="w-full px-3 py-2 text-xs border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Full Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg text-xs font-semibold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-navy text-white rounded-lg text-xs font-bold">
                  Save Dealer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

