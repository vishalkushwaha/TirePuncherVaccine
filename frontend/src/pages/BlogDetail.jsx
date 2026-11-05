import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, User, ArrowLeft, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';

export default function BlogDetail() {
  const { id } = useParams();
  const { isHindi } = useLanguage();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBlogPost(id)
      .then(data => {
        setPost(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="py-24 text-center text-sm text-slate-500">Loading article...</div>;
  }

  if (!post) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-navy">Article Not Found</h2>
        <Link to="/blog" className="text-cyan-600 font-semibold hover:underline">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-12 max-w-4xl mx-auto px-4 sm:px-6">
      <Link to="/blog" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-cyan-700">
        <ArrowLeft size={14} />
        <span>{isHindi ? 'सभी ब्लॉग्स पर वापस जाएं' : 'Back to Blog Articles'}</span>
      </Link>

      <div className="space-y-4">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1 text-cyan-800 font-semibold">
            <Clock size={14} />
            <span>{post.reading_time}</span>
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <User size={14} />
            <span>{post.author}</span>
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy leading-tight">
          {isHindi ? post.title_hi : post.title_en}
        </h1>
      </div>

      {post.cover_image && (
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md">
          <img
            src={post.cover_image}
            alt={post.title_en}
            className="w-full max-h-[450px] object-cover"
          />
        </div>
      )}

      <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-xs prose max-w-none text-slate-700 leading-relaxed text-sm sm:text-base space-y-4">
        <p className="font-semibold text-cyan-900 border-l-4 border-cyan-500 pl-4 py-1 text-base">
          {isHindi ? post.summary_hi : post.summary_en}
        </p>
        <div className="whitespace-pre-line pt-2">
          {isHindi ? post.content_hi || post.content_en : post.content_en}
        </div>
      </div>
    </div>
  );
}

