import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Plus, Edit, Trash2, CheckCircle2, X, Upload, Palette } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';

export default function AdminProducts() {
  const { getTheme } = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialForm = {
    code: '',
    name_en: '',
    name_hi: '',
    mrp: 999,
    warranty_months: 12,
    pack_size: '1 Litre',
    tyre_type: 'Tubeless',
    is_heavy_vehicle: false,
    vehicle_summary_en: '',
    vehicle_summary_hi: '',
    description_en: '',
    description_hi: '',
    features_en: '4mm Instant Seal\nSafe for Alloy & Steel Rims\nPerformance Warranty',
    features_hi: '4 मिमी तक पंचर तुरंत सील\nरिम जंग-रहित सुरक्षा\nआधिकारिक निर्माण वारंटी',
    image_url: '/assets/logo.png',
    is_active: true,
    is_featured: true,
    sort_order: 1
  };

  const [form, setForm] = useState(initialForm);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadProducts = () => {
    setLoading(true);
    api.admin.getAllProducts()
      .then(data => {
        setProducts(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openNewModal = () => {
    setEditingId(null);
    setForm(initialForm);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingId(p.id);
    setForm({
      code: p.code,
      name_en: p.name_en,
      name_hi: p.name_hi,
      mrp: p.mrp,
      warranty_months: p.warranty_months,
      pack_size: p.pack_size || '1 Litre',
      tyre_type: p.tyre_type || 'Tubeless',
      is_heavy_vehicle: !!p.is_heavy_vehicle,
      vehicle_summary_en: p.vehicle_summary_en || '',
      vehicle_summary_hi: p.vehicle_summary_hi || '',
      description_en: p.description_en || '',
      description_hi: p.description_hi || '',
      features_en: p.features_en || '',
      features_hi: p.features_hi || '',
      image_url: p.image_url || '/assets/logo.png',
      is_active: !!p.is_active,
      is_featured: !!p.is_featured,
      sort_order: p.sort_order || 0
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await api.admin.uploadFile(file);
      setForm(prev => ({ ...prev, image_url: res.url }));
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (editingId) {
        await api.admin.updateProduct(editingId, form);
      } else {
        await api.admin.createProduct(form);
      }
      setIsModalOpen(false);
      loadProducts();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save product');
    }
  };

  const handleDelete = async (id, name) => {
    if (confirm(`Are you sure you want to remove product "${name}"?`)) {
      try {
        await api.admin.deleteProduct(id);
        loadProducts();
      } catch (err) {
        alert('Delete failed: ' + err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">Products Management</h1>
          <p className="text-xs text-slate-500">Manage catalogue items, official MRP, warranties, and bottle posters</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            to="/admin/themes"
            className="border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold px-3 py-2.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors"
          >
            <Palette size={15} className="text-cyan-700" />
            <span>Theme Studio</span>
          </Link>
          <button
            onClick={openNewModal}
            className="bg-navy hover:bg-cyan-700 text-white font-bold px-4 py-2.5 rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus size={16} />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px] tracking-wider">
                <th className="p-4">Product</th>
                <th className="p-4">Code</th>
                <th className="p-4">MRP (₹)</th>
                <th className="p-4">Warranty</th>
                <th className="p-4">Tyre Setup</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={p.image_url || '/assets/logo.png'}
                      alt={p.name_en}
                      className="h-10 w-10 object-contain rounded-md bg-slate-100 p-1 shrink-0"
                    />
                    <div>
                      <span className="font-bold text-navy block">{p.name_en}</span>
                      <span className="text-[11px] text-slate-500 block">{p.name_hi}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: getTheme(p.code).primary }}
                        title={`Theme: ${getTheme(p.code).primary}`}
                      />
                      <span className="font-mono font-bold uppercase" style={{ color: getTheme(p.code).primary }}>
                        {p.code}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 font-black text-navy">₹{p.mrp}</td>
                  <td className="p-4">
                    <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[11px]">
                      {p.warranty_months} Months
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">
                    <span>{p.tyre_type}</span>
                    {p.is_heavy_vehicle && (
                      <span className="block text-[10px] text-indigo-700 font-bold">Heavy Vehicle</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}>
                      {p.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="p-1.5 text-slate-600 hover:text-cyan-700 hover:bg-slate-100 rounded-md transition-colors"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.name_en)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-navy">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Product Code *</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingId}
                    value={form.code}
                    onChange={e => setForm({ ...form, code: e.target.value.toLowerCase() })}
                    placeholder="e.g. gulf, rock, thor"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 disabled:bg-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">MRP (₹) *</label>
                  <input
                    type="number"
                    required
                    step="1"
                    value={form.mrp}
                    onChange={e => setForm({ ...form, mrp: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={form.name_en}
                    onChange={e => setForm({ ...form, name_en: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Name (Hindi) *</label>
                  <input
                    type="text"
                    required
                    value={form.name_hi}
                    onChange={e => setForm({ ...form, name_hi: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Warranty (Months) *</label>
                  <input
                    type="number"
                    required
                    value={form.warranty_months}
                    onChange={e => setForm({ ...form, warranty_months: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Pack Size</label>
                  <input
                    type="text"
                    value={form.pack_size}
                    onChange={e => setForm({ ...form, pack_size: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Tyre Compatibility</label>
                  <select
                    value={form.tyre_type}
                    onChange={e => setForm({ ...form, tyre_type: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 bg-white"
                  >
                    <option value="Tubeless">Tubeless</option>
                    <option value="Tube & Tubeless">Tube & Tubeless</option>
                    <option value="All Tyres">All Tyres</option>
                  </select>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_heavy_vehicle}
                      onChange={e => setForm({ ...form, is_heavy_vehicle: e.target.checked })}
                      className="rounded text-cyan-600"
                    />
                    <span>Heavy Vehicle Recommendation</span>
                  </label>
                </div>
              </div>

              {/* Poster Upload */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Product Bottle Poster</label>
                <div className="flex items-center gap-4">
                  <img src={form.image_url} alt="Preview" className="h-16 w-16 object-contain bg-slate-100 rounded-md border p-1" />
                  <div className="space-y-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                    />
                    <span className="block text-[10px] text-slate-400">Current path: {form.image_url}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Vehicle Summary (English)</label>
                <input
                  type="text"
                  value={form.vehicle_summary_en}
                  onChange={e => setForm({ ...form, vehicle_summary_en: e.target.value })}
                  placeholder="e.g. Two wheelers, hatchbacks, sedans"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Vehicle Summary (Hindi)</label>
                <input
                  type="text"
                  value={form.vehicle_summary_hi}
                  onChange={e => setForm({ ...form, vehicle_summary_hi: e.target.value })}
                  placeholder="उदा. दोपहिया, हैचबैक, सेडान और ट्यूबलेस टायर"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Full Description (English)</label>
                <textarea
                  rows={2}
                  value={form.description_en}
                  onChange={e => setForm({ ...form, description_en: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Full Description (Hindi)</label>
                <textarea
                  rows={2}
                  value={form.description_hi}
                  onChange={e => setForm({ ...form, description_hi: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2 bg-navy hover:bg-cyan-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

