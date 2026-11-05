import React, { useState, useEffect } from 'react';
import { HelpCircle, ChevronDown, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';

export default function FAQ() {
  const { t, isHindi } = useLanguage();
  const [faqs, setFaqs] = useState([]);
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [openIds, setOpenIds] = useState([1]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getFaqs()
      .then(data => {
        setFaqs(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggleAccordion = (id) => {
    setOpenIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const filtered = faqs.filter(f => {
    const matchesCat = category === 'all' || f.category.toLowerCase() === category.toLowerCase();
    const matchesSearch =
      f.question_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.question_hi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.answer_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.answer_hi.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-12 py-12 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Title */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full">
          {t('nav.faq')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy">
          {isHindi ? 'अक्सर पूछे जाने वाले महत्वपूर्ण सवाल' : 'Frequently Asked Questions'}
        </h1>
        <p className="text-slate-600 text-sm max-w-xl mx-auto">
          {isHindi
            ? 'उत्पाद उपयोग, वारंटी, डोसेज और डिस्ट्रीब्यूटरशिप से संबंधित सभी प्रश्नों के स्पष्ट उत्तर।'
            : 'Find clear, technical answers regarding chemical formulation, fitment, warranties, and orders.'}
        </p>

        {/* Search */}
        <div className="mt-4 max-w-md mx-auto relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" aria-hidden="true" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={isHindi ? "प्रश्न या शब्द खोजें..." : "Search questions or keywords..."}
            aria-label={isHindi ? "प्रश्न खोजें" : "Search FAQs"}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-600 focus:outline-hidden bg-white shadow-xs"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {['all', 'General', 'Usage', 'Warranty', 'Dosage', 'Distributorship'].map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
              category.toLowerCase() === cat.toLowerCase()
                ? 'bg-navy text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {cat === 'all' ? (isHindi ? 'सभी सवाल' : 'All') : cat}
          </button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filtered.map(faq => {
          const isOpen = openIds.includes(faq.id);
          return (
            <div
              key={faq.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => toggleAccordion(faq.id)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
              >
                <span className="font-bold text-navy text-sm sm:text-base">
                  {isHindi ? faq.question_hi : faq.question_en}
                </span>
                <ChevronDown
                  size={18}
                  className={`text-slate-500 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-cyan-600' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 border-t border-slate-100 leading-relaxed font-sans">
                  {isHindi ? faq.answer_hi : faq.answer_en}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

