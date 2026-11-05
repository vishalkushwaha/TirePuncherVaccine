import React, { useState, useEffect } from 'react';
import { HelpCircle, Plus, Edit, Trash2, X } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminFAQ() {
  const [faqs, setFaqs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialForm = {
    category: 'General',
    question_en: '',
    question_hi: '',
    answer_en: '',
    answer_hi: '',
    sort_order: 1,
    is_published: true
  };

  const [form, setForm] = useState(initialForm);

  const loadFaqs = () => {
    api.admin.getAllFaqs()
      .then(data => setFaqs(data || []))
      .catch(() => {});
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const openNew = () => {
    setEditingId(null);
    setForm(initialForm);
    setIsModalOpen(true);
  };

  const openEdit = (f) => {
    setEditingId(f.id);
    setForm({ ...f });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.admin.updateFaq(editingId, form);
      } else {
        await api.admin.createFaq(form);
      }
      setIsModalOpen(false);
      loadFaqs();
    } catch (err) {
      alert('Save failed: ' + err.message);
    }
  };

  const handleDelete = async (id, question) => {
    if (confirm(`Delete FAQ "${question}"?`)) {
      try {
        await api.admin.deleteFaq(id);
        loadFaqs();
      } catch (err) {
        alert('Delete failed: ' + err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">FAQ Management</h1>
          <p className="text-xs text-slate-500">Edit bilingual questions and answers across General, Usage, and Warranty</p>
        </div>

        <button
          onClick={openNew}
          className="bg-navy hover:bg-cyan-700 text-white font-bold px-4 py-2.5 rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add FAQ</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px] tracking-wider">
                <th className="p-4">Category</th>
                <th className="p-4">Question (EN / HI)</th>
                <th className="p-4">Answer Preview</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {faqs.map(f => (
                <tr key={f.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 font-bold text-cyan-800">{f.category}</td>
                  <td className="p-4">
                    <span className="font-bold text-navy block">{f.question_en}</span>
                    <span className="text-[11px] text-slate-500 block">{f.question_hi}</span>
                  </td>
                  <td className="p-4 text-slate-600 max-w-sm truncate">{f.answer_en}</td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => openEdit(f)} className="p-1.5 hover:text-cyan-700">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(f.id, f.question_en)} className="p-1.5 hover:text-red-600">
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
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-bold text-navy">{editingId ? 'Edit FAQ' : 'Add FAQ'}</h2>
              <button onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 text-xs border rounded-lg bg-white"
                >
                  <option value="General">General</option>
                  <option value="Usage">Usage & Installation</option>
                  <option value="Warranty">Warranty</option>
                  <option value="Dosage">Dosage</option>
                  <option value="Distributorship">Distributorship</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Question (English) *</label>
                <input
                  type="text"
                  required
                  value={form.question_en}
                  onChange={e => setForm({ ...form, question_en: e.target.value })}
                  className="w-full px-3 py-2 text-xs border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Question (Hindi) *</label>
                <input
                  type="text"
                  required
                  value={form.question_hi}
                  onChange={e => setForm({ ...form, question_hi: e.target.value })}
                  className="w-full px-3 py-2 text-xs border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Answer (English) *</label>
                <textarea
                  rows={3}
                  required
                  value={form.answer_en}
                  onChange={e => setForm({ ...form, answer_en: e.target.value })}
                  className="w-full px-3 py-2 text-xs border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Answer (Hindi) *</label>
                <textarea
                  rows={3}
                  required
                  value={form.answer_hi}
                  onChange={e => setForm({ ...form, answer_hi: e.target.value })}
                  className="w-full px-3 py-2 text-xs border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg text-xs font-semibold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-navy text-white rounded-lg text-xs font-bold">
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

