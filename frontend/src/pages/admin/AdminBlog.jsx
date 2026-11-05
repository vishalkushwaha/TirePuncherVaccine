import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit, Trash2, X } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialForm = {
    title_en: '',
    title_hi: '',
    slug: '',
    summary_en: '',
    summary_hi: '',
    content_en: '',
    content_hi: '',
    author: 'Tyre Puncture Vaccine Team',
    reading_time: '4 min read',
    cover_image: '/assets/why-choose-us.png',
    is_published: true
  };

  const [form, setForm] = useState(initialForm);

  const loadPosts = () => {
    api.admin.getAllBlogPosts()
      .then(data => setPosts(data || []))
      .catch(() => {});
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const openNew = () => {
    setEditingId(null);
    setForm(initialForm);
    setIsModalOpen(true);
  };

  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({ ...p });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.admin.updateBlogPost(editingId, form);
      } else {
        await api.admin.createBlogPost(form);
      }
      setIsModalOpen(false);
      loadPosts();
    } catch (err) {
      alert('Save failed: ' + err.message);
    }
  };

  const handleDelete = async (id, title) => {
    if (confirm(`Delete post "${title}"?`)) {
      try {
        await api.admin.deleteBlogPost(id);
        loadPosts();
      } catch (err) {
        alert('Delete failed: ' + err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">Blog & Technical Articles</h1>
          <p className="text-xs text-slate-500">Publish guides, maintenance tips, and commercial fleet case studies</p>
        </div>

        <button
          onClick={openNew}
          className="bg-navy hover:bg-cyan-700 text-white font-bold px-4 py-2.5 rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Write Article</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px] tracking-wider">
                <th className="p-4">Title</th>
                <th className="p-4">Author</th>
                <th className="p-4">Read Time</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {posts.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-navy block">{p.title_en}</span>
                    <span className="text-[11px] text-slate-500 block">{p.title_hi}</span>
                  </td>
                  <td className="p-4 text-slate-700">{p.author}</td>
                  <td className="p-4 text-slate-500">{p.reading_time}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.is_published ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {p.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => openEdit(p)} className="p-1.5 hover:text-cyan-700">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(p.id, p.title_en)} className="p-1.5 hover:text-red-600">
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
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-bold text-navy">{editingId ? 'Edit Article' : 'New Blog Article'}</h2>
              <button onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={form.title_en}
                    onChange={e => setForm({
                      ...form,
                      title_en: e.target.value,
                      slug: form.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                    })}
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
                    className="w-full px-3 py-2 text-xs border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Slug URL *</label>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={e => setForm({ ...form, slug: e.target.value })}
                    className="w-full px-3 py-2 text-xs border rounded-lg font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Reading Time</label>
                  <input
                    type="text"
                    value={form.reading_time}
                    onChange={e => setForm({ ...form, reading_time: e.target.value })}
                    placeholder="e.g. 4 min read"
                    className="w-full px-3 py-2 text-xs border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Summary (English)</label>
                <textarea
                  rows={2}
                  value={form.summary_en}
                  onChange={e => setForm({ ...form, summary_en: e.target.value })}
                  className="w-full px-3 py-2 text-xs border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Summary (Hindi)</label>
                <textarea
                  rows={2}
                  value={form.summary_hi}
                  onChange={e => setForm({ ...form, summary_hi: e.target.value })}
                  className="w-full px-3 py-2 text-xs border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Full Article (English)</label>
                <textarea
                  rows={5}
                  value={form.content_en}
                  onChange={e => setForm({ ...form, content_en: e.target.value })}
                  className="w-full px-3 py-2 text-xs border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Full Article (Hindi)</label>
                <textarea
                  rows={5}
                  value={form.content_hi}
                  onChange={e => setForm({ ...form, content_hi: e.target.value })}
                  className="w-full px-3 py-2 text-xs border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg text-xs font-semibold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-navy text-white rounded-lg text-xs font-bold">
                  Save Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

