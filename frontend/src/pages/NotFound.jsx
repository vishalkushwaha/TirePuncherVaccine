import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function NotFound() {
  const { isHindi } = useLanguage();

  return (
    <div className="py-24 text-center max-w-xl mx-auto px-4 space-y-6">
      <div className="w-16 h-16 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mx-auto">
        <AlertCircle size={36} className="text-cyan-700" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Error 404</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy">
          {isHindi ? 'यह पृष्ठ उपलब्ध नहीं है' : 'Page Not Found'}
        </h1>
        <p className="text-sm text-slate-600">
          {isHindi
            ? 'जो पृष्ठ आप खोज रहे हैं वह स्थानांतरित कर दिया गया है या मौजूद नहीं है।'
            : 'The page you requested could not be found or may have moved.'}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          to="/"
          className="bg-navy hover:bg-cyan-700 text-white font-bold px-6 py-2.5 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Home size={14} />
          <span>{isHindi ? 'होम पेज पर जाएं' : 'Return to Home'}</span>
        </Link>
        <Link
          to="/products"
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-6 py-2.5 rounded-lg text-xs transition-colors"
        >
          {isHindi ? 'उत्पाद देखें' : 'Browse Products'}
        </Link>
      </div>
    </div>
  );
}

