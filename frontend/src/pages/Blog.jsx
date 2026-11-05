import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, ChevronRight, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';

export default function Blog() {
  const { t, isHindi } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBlogPosts()
      .then(data => {
        setPosts(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-12 py-12 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full">
          {t('nav.blog')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy">
          {isHindi ? 'तकनीकी ब्लॉग एवं टायर सुरक्षा गाइड' : 'Technical Insights & Maintenance Guides'}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          {isHindi
            ? 'टायर की लाइफ बढ़ाने, फ्लीट खर्च घटाने और पंचर से बचाव के वैज्ञानिक तरीके।'
            : 'Engineering articles, maintenance advice, and fleet cost-saving analyses.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map(p => (
          <div key={p.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              {p.cover_image && (
                <div className="aspect-16/9 bg-slate-100 overflow-hidden">
                  <img
                    src={p.cover_image}
                    alt={p.title_en}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-medium text-cyan-700">
                    <Clock size={13} />
                    <span>{p.reading_time}</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <User size={13} />
                    <span>{p.author}</span>
                  </span>
                </div>

                <h3 className="text-xl font-bold text-navy leading-snug">
                  {isHindi ? p.title_hi : p.title_en}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {isHindi ? p.summary_hi : p.summary_en}
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 pt-2">
              <Link
                to={`/blog/${p.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-700 hover:text-cyan-800"
              >
                <span>{t('common.readMore')}</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

