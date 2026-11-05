import React, { useState, useEffect } from 'react';
import { Star, MessageSquareQuote } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';

export default function Testimonials() {
  const { t, isHindi } = useLanguage();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTestimonials()
      .then(data => {
        setReviews(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-12 py-12 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full">
          {t('nav.testimonials')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy">
          {isHindi ? 'संतुष्ट ग्राहकों के वास्तविक अनुभव' : 'Verified Driver & Fleet Experiences'}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          {isHindi
            ? 'राजस्थान व देश भर के वाहन स्वामियों द्वारा साझा किए गए वास्तविक अनुभव।'
            : 'Authentic reviews from passenger car drivers, bike owners, and commercial freight fleets.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map(rev => (
          <div key={rev.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(rev.rating || 5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                "{isHindi ? rev.review_hi || rev.review_en : rev.review_en}"
              </p>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <h4 className="text-sm font-bold text-navy">{rev.customer_name}</h4>
              <p className="text-xs text-slate-500">{rev.customer_city} · {rev.vehicle_model}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

