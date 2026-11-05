import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Trash2, Upload, X } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminGallery() {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);

  const [photoForm, setPhotoForm] = useState({
    album_id: 1,
    caption_en: '',
    caption_hi: '',
    image_url: '/assets/logo.png',
    sort_order: 1
  });

  const [albumForm, setAlbumForm] = useState({
    name_en: '',
    name_hi: '',
    slug: '',
    description_en: ''
  });

  const [uploading, setUploading] = useState(false);

  const loadGallery = () => {
    api.getGallery()
      .then(data => {
        setAlbums(data || []);
        if (data && data.length > 0 && !selectedAlbumId) {
          setSelectedAlbumId(data[0].id);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await api.admin.uploadFile(file);
      setPhotoForm(prev => ({ ...prev, image_url: res.url }));
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAddPhoto = async (e) => {
    e.preventDefault();
    try {
      await api.admin.addGalleryPhoto({
        ...photoForm,
        album_id: selectedAlbumId
      });
      setIsPhotoModalOpen(false);
      setPhotoForm({
        album_id: selectedAlbumId,
        caption_en: '',
        caption_hi: '',
        image_url: '/assets/logo.png',
        sort_order: 1
      });
      loadGallery();
    } catch (err) {
      alert('Failed to add photo: ' + err.message);
    }
  };

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    try {
      await api.admin.createGalleryAlbum({
        ...albumForm,
        slug: albumForm.slug || albumForm.name_en.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      });
      setIsAlbumModalOpen(false);
      loadGallery();
    } catch (err) {
      alert('Failed to create album: ' + err.message);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (confirm('Delete this photo from gallery?')) {
      try {
        await api.admin.deleteGalleryPhoto(photoId);
        loadGallery();
      } catch (err) {
        alert('Delete failed: ' + err.message);
      }
    }
  };

  const activeAlbum = albums.find(a => a.id === selectedAlbumId) || albums[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">Gallery & Posters Manager</h1>
          <p className="text-xs text-slate-500">Organize albums, upload high-res marketing posters, and product photographs</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsAlbumModalOpen(true)}
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold px-3 py-2 rounded-lg text-xs"
          >
            + New Album
          </button>
          <button
            onClick={() => setIsPhotoModalOpen(true)}
            className="bg-navy hover:bg-cyan-700 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-xs"
          >
            <Plus size={16} />
            <span>Upload Photo</span>
          </button>
        </div>
      </div>

      {/* Album Tabs */}
      <div className="flex flex-wrap gap-2 border-b pb-3">
        {albums.map(a => (
          <button
            key={a.id}
            onClick={() => setSelectedAlbumId(a.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedAlbumId === a.id
                ? 'bg-navy text-white shadow-xs'
                : 'bg-white border text-slate-700 hover:bg-slate-50'
            }`}
          >
            {a.name_en} ({a.photos?.length || 0})
          </button>
        ))}
      </div>

      {/* Active Photos Grid */}
      {activeAlbum && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {(activeAlbum.photos || []).map(p => (
            <div key={p.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs group relative">
              <div className="aspect-4/3 bg-slate-100 flex items-center justify-center p-2">
                <img src={p.image_url} alt={p.caption_en} className="h-full w-full object-contain" />
              </div>
              <div className="p-3 text-xs">
                <p className="font-semibold text-slate-800 truncate">{p.caption_en || 'No caption'}</p>
                <p className="text-[11px] text-slate-400 truncate">{p.caption_hi}</p>
              </div>
              <button
                onClick={() => handleDeletePhoto(p.id)}
                className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                title="Delete Photo"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Photo Modal */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-bold text-navy">Upload Photo to {activeAlbum?.name_en}</h2>
              <button onClick={() => setIsPhotoModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleAddPhoto} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Select File</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-cyan-50 file:text-cyan-700"
                />
                {photoForm.image_url && (
                  <span className="text-[11px] text-slate-400 block mt-1">Image: {photoForm.image_url}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Caption (English)</label>
                <input
                  type="text"
                  required
                  value={photoForm.caption_en}
                  onChange={e => setPhotoForm({ ...photoForm, caption_en: e.target.value })}
                  placeholder="e.g. Gulf Tubeless Application"
                  className="w-full px-3 py-2 text-xs border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Caption (Hindi)</label>
                <input
                  type="text"
                  value={photoForm.caption_hi}
                  onChange={e => setPhotoForm({ ...photoForm, caption_hi: e.target.value })}
                  placeholder="उदा. गल्फ ट्यूबलेस सीलेंट"
                  className="w-full px-3 py-2 text-xs border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setIsPhotoModalOpen(false)} className="px-4 py-2 border rounded-lg text-xs font-semibold">
                  Cancel
                </button>
                <button type="submit" disabled={uploading} className="px-5 py-2 bg-navy text-white rounded-lg text-xs font-bold">
                  {uploading ? 'Uploading...' : 'Save Photo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Album Modal */}
      {isAlbumModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-bold text-navy">Create New Album</h2>
              <button onClick={() => setIsAlbumModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateAlbum} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Album Name (English) *</label>
                <input
                  type="text"
                  required
                  value={albumForm.name_en}
                  onChange={e => setAlbumForm({ ...albumForm, name_en: e.target.value })}
                  className="w-full px-3 py-2 text-xs border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Album Name (Hindi) *</label>
                <input
                  type="text"
                  required
                  value={albumForm.name_hi}
                  onChange={e => setAlbumForm({ ...albumForm, name_hi: e.target.value })}
                  className="w-full px-3 py-2 text-xs border rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setIsAlbumModalOpen(false)} className="px-4 py-2 border rounded-lg text-xs font-semibold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-navy text-white rounded-lg text-xs font-bold">
                  Create Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

