import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight, Newspaper } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';

export default function Events() {
  const { t, isHindi } = useLanguage();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getEvents()
      .then(data => {
        setEvents(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-12 py-12 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full">
          {t('nav.events')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy">
          {isHindi ? 'नवीनतम गतिविधियां व समाचार' : 'Product Announcements & Demo Camps'}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          {isHindi
            ? 'उजाला इलेक्ट्रिकल्स द्वारा आयोजित कैंप, प्रदर्शन और विस्तार की ताज़ा खबरें।'
            : 'Stay updated with field trials, network expansions, and commercial dealer meets across India.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map(ev => (
          <div key={ev.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              {ev.image_url && (
                <div className="aspect-16/9 bg-slate-100 overflow-hidden">
                  <img
                    src={ev.image_url}
                    alt={ev.title_en}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="bg-cyan-50 text-cyan-700 font-bold px-2.5 py-0.5 rounded">
                    {ev.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Calendar size={13} className="text-slate-400" />
                    <span>{ev.event_date}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-navy leading-snug">
                  {isHindi ? ev.title_hi : ev.title_en}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {isHindi ? ev.excerpt_hi : ev.excerpt_en}
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 pt-2">
              <Link
                to={`/events/${ev.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-700 hover:text-cyan-800"
              >
                <span>{isHindi ? 'विस्तार से पढ़ें' : 'Read Full Story'}</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

