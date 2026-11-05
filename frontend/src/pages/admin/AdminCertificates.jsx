import React, { useState, useEffect } from 'react';
import { Award, Plus, Trash2, X, FileText } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminCertificates() {
  const [certs, setCerts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initialForm = {
    title_en: '',
    title_hi: '',
    issuing_body: 'Government Approved Test House',
    issue_year: '2026',
    document_url: '/assets/why-choose-us.png',
    description_en: '',
    description_hi: '',
    is_published: true,
    sort_order: 1
  };

  const [form, setForm] = useState(initialForm);

  const loadCerts = () => {
    api.admin.getAllCertificates()
      .then(data => setCerts(data || []))
      .catch(() => {});
  };

  useEffect(() => {
    loadCerts();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.admin.createCertificate(form);
      setIsModalOpen(false);
      setForm(initialForm);
      loadCerts();
    } catch (err) {
      alert('Save failed: ' + err.message);
    }
  };

  const handleDelete = async (id, title) => {
    if (confirm(`Delete certificate "${title}"?`)) {
      try {
        await api.admin.deleteCertificate(id);
        loadCerts();
      } catch (err) {
        alert('Delete failed: ' + err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">Certifications & Lab Reports</h1>
          <p className="text-xs text-slate-500">Manage quality assurance documents, lab certificates, and test sheets</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-navy hover:bg-cyan-700 text-white font-bold px-4 py-2.5 rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add Certificate Document</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px] tracking-wider">
                <th className="p-4">Certificate Title</th>
                <th className="p-4">Issuing Body</th>
                <th className="p-4">Year</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {certs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-xs text-slate-400">
                    No certificates uploaded yet. Documents will be published here.
                  </td>
                </tr>
              ) : (
                certs.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-bold text-navy flex items-center gap-2">
                      <FileText size={16} className="text-cyan-700" />
                      <span>{c.title_en}</span>
                    </td>
                    <td className="p-4 text-slate-600">{c.issuing_body}</td>
                    <td className="p-4 font-mono">{c.issue_year}</td>
                    <td className="p-4">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        Published
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDelete(c.id, c.title_en)} className="p-1.5 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-bold text-navy">Add Certificate Entry</h2>
              <button onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Title (English) *</label>
                <input
                  type="text"
                  required
                  value={form.title_en}
                  onChange={e => setForm({ ...form, title_en: e.target.value })}
                  placeholder="e.g. Anti-Corrosion Rim Safety Report"
                  className="w-full px-3 py-2 text-xs border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Title (Hindi) *</label>
                <input
                  type="text"
                  required
                  value={form.title_hi}
                  onChange={e => setForm({ ...form, title_hi: e.target.value })}
                  placeholder="उदा. जंग-रहित रिम सुरक्षा परीक्षण रिपोर्ट"
                  className="w-full px-3 py-2 text-xs border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Issuing Body</label>
                  <input
                    type="text"
                    value={form.issuing_body}
                    onChange={e => setForm({ ...form, issuing_body: e.target.value })}
                    className="w-full px-3 py-2 text-xs border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Year</label>
                  <input
                    type="text"
                    value={form.issue_year}
                    onChange={e => setForm({ ...form, issue_year: e.target.value })}
                    className="w-full px-3 py-2 text-xs border rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg text-xs font-semibold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-navy text-white rounded-lg text-xs font-bold">
                  Save Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

