import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Share2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';

export default function EventDetail() {
  const { id } = useParams();
  const { isHindi } = useLanguage();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getEvent(id)
      .then(data => {
        setEvent(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="py-24 text-center text-sm text-slate-500">Loading announcement...</div>;
  }

  if (!event) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-navy">Event Not Found</h2>
        <Link to="/events" className="text-cyan-600 font-semibold hover:underline">
          Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-12 max-w-4xl mx-auto px-4 sm:px-6">
      <Link to="/events" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-cyan-700">
        <ArrowLeft size={14} />
        <span>{isHindi ? 'सभी इवेंट्स पर वापस जाएं' : 'Back to Events & News'}</span>
      </Link>

      <div className="space-y-4">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="bg-cyan-100 text-cyan-800 font-bold px-3 py-1 rounded-full">{event.category}</span>
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{event.event_date}</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy leading-tight">
          {isHindi ? event.title_hi : event.title_en}
        </h1>
      </div>

      {event.image_url && (
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md">
          <img
            src={event.image_url}
            alt={event.title_en}
            className="w-full max-h-[450px] object-cover"
          />
        </div>
      )}

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs prose max-w-none text-slate-700 leading-relaxed text-sm sm:text-base space-y-4">
        <p className="font-semibold text-cyan-900 border-l-4 border-cyan-500 pl-4 py-1">
          {isHindi ? event.excerpt_hi : event.excerpt_en}
        </p>
        <div className="whitespace-pre-line pt-2">
          {isHindi ? event.content_hi || event.content_en : event.content_en}
        </div>
      </div>
    </div>
  );
}

