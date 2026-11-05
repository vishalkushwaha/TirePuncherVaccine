import React, { useState, useEffect } from 'react';
import { Star, Plus, Trash2, CheckCircle2, X } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminTestimonials() {
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initialForm = {
    customer_name: '',
    customer_city: '',
    vehicle_model: '',
    review_en: '',
    review_hi: '',
    rating: 5,
    is_approved: true,
    is_featured: true
  };

  const [form, setForm] = useState(initialForm);

  const loadReviews = () => {
    api.admin.getAllTestimonials()
      .then(data => setReviews(data || []))
      .catch(() => {});
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleToggleApproved = async (rev) => {
    try {
      await api.admin.updateTestimonial(rev.id, { is_approved: !rev.is_approved });
      loadReviews();
    } catch (err) {
      alert('Update failed: ' + err.message);
    }
  };

  const handleToggleFeatured = async (rev) => {
    try {
      await api.admin.updateTestimonial(rev.id, { is_featured: !rev.is_featured });
      loadReviews();
    } catch (err) {
      alert('Update failed: ' + err.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.admin.createTestimonial(form);
      setIsModalOpen(false);
      setForm(initialForm);
      loadReviews();
    } catch (err) {
      alert('Save failed: ' + err.message);
    }
  };

  const handleDelete = async (id, name) => {
    if (confirm(`Delete review from "${name}"?`)) {
      try {
        await api.admin.deleteTestimonial(id);
        loadReviews();
      } catch (err) {
        alert('Delete failed: ' + err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">Customer Testimonials</h1>
          <p className="text-xs text-slate-500">Only verified customer reviews appear on the live home page</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-navy hover:bg-cyan-700 text-white font-bold px-4 py-2.5 rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add Verified Review</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px] tracking-wider">
                <th className="p-4">Customer</th>
                <th className="p-4">Location / Vehicle</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Review Text</th>
                <th className="p-4">Home Feature</th>
                <th className="p-4">Approved</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reviews.map(r => (
                <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 font-bold text-navy">{r.customer_name}</td>
                  <td className="p-4 text-slate-600">{r.customer_city} · {r.vehicle_model}</td>
                  <td className="p-4 font-bold text-amber-500">{r.rating} ★</td>
                  <td className="p-4 max-w-sm truncate text-slate-700">{r.review_en}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleFeatured(r)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.is_featured ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {r.is_featured ? 'Featured' : 'Standard'}
                    </button>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleApproved(r)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.is_approved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {r.is_approved ? 'Approved' : 'Hidden'}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(r.id, r.customer_name)} className="p-1.5 hover:text-red-600">
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
              <h2 className="text-base font-bold text-navy">Add Verified Review</h2>
              <button onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={form.customer_name}
                    onChange={e => setForm({ ...form, customer_name: e.target.value })}
                    className="w-full px-3 py-2 text-xs border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">City / Region *</label>
                  <input
                    type="text"
                    required
                    value={form.customer_city}
                    onChange={e => setForm({ ...form, customer_city: e.target.value })}
                    className="w-full px-3 py-2 text-xs border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Vehicle Model</label>
                  <input
                    type="text"
                    value={form.vehicle_model}
                    onChange={e => setForm({ ...form, vehicle_model: e.target.value })}
                    placeholder="e.g. Scorpio Classic"
                    className="w-full px-3 py-2 text-xs border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Rating</label>
                  <select
                    value={form.rating}
                    onChange={e => setForm({ ...form, rating: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 text-xs border rounded-lg bg-white"
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★☆</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Review (English) *</label>
                <textarea
                  rows={3}
                  required
                  value={form.review_en}
                  onChange={e => setForm({ ...form, review_en: e.target.value })}
                  className="w-full px-3 py-2 text-xs border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Review (Hindi)</label>
                <textarea
                  rows={2}
                  value={form.review_hi}
                  onChange={e => setForm({ ...form, review_hi: e.target.value })}
                  className="w-full px-3 py-2 text-xs border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg text-xs font-semibold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-navy text-white rounded-lg text-xs font-bold">
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

