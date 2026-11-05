import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, X, ZoomIn } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';

export default function Gallery() {
  const { t, isHindi } = useLanguage();
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState('all');
  const [activePhoto, setActivePhoto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getGallery()
      .then(data => {
        setAlbums(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const allPhotos = albums.flatMap(a => (a.photos || []).map(p => ({ ...p, albumName: isHindi ? a.name_hi : a.name_en, albumSlug: a.slug })));

  const displayedPhotos = selectedAlbum === 'all'
    ? allPhotos
    : allPhotos.filter(p => p.albumSlug === selectedAlbum);

  return (
    <div className="space-y-12 py-12 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full">
          {t('nav.gallery')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy">
          {isHindi ? 'फोटो गैलरी एवं आधिकारिक पोस्टर्स' : 'Visual Gallery & Print Collateral'}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          {isHindi
            ? 'हमारे उत्पाद, इंस्टॉलेशन प्रक्रिया, कैंप और प्रचार सामग्री की तस्वीरें।'
            : 'Browse product packaging, laboratory demonstrations, field trials, and print posters.'}
        </p>
      </div>

      {/* Album Filters */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => setSelectedAlbum('all')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            selectedAlbum === 'all'
              ? 'bg-navy text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          {isHindi ? 'सभी तस्वीरें (All)' : 'All Photos'}
        </button>
        {albums.map(a => (
          <button
            key={a.id}
            onClick={() => setSelectedAlbum(a.slug)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              selectedAlbum === a.slug
                ? 'bg-navy text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {isHindi ? a.name_hi : a.name_en}
          </button>
        ))}
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedPhotos.map(photo => (
          <div
            key={photo.id}
            onClick={() => setActivePhoto(photo)}
            className="group cursor-pointer bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all"
          >
            <div className="relative aspect-4/3 bg-slate-50 flex items-center justify-center overflow-hidden">
              <img
                src={photo.image_url}
                alt={photo.caption_en || 'Gallery photo'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <ZoomIn size={28} />
              </div>
            </div>
            <div className="p-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 block">
                {photo.albumName}
              </span>
              <p className="text-xs font-semibold text-navy truncate mt-0.5">
                {isHindi ? photo.caption_hi || photo.caption_en : photo.caption_en}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-10 bg-black/60 hover:bg-black text-white p-2 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <div className="bg-slate-950 flex items-center justify-center max-h-[75vh]">
              <img
                src={activePhoto.image_url}
                alt={activePhoto.caption_en}
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>
            <div className="p-4 bg-white">
              <span className="text-xs font-bold text-cyan-700">{activePhoto.albumName}</span>
              <h3 className="text-sm font-bold text-navy mt-0.5">
                {isHindi ? activePhoto.caption_hi || activePhoto.caption_en : activePhoto.caption_en}
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

