import React from 'react';
import { Phone, Mail, MapPin, Globe, Shield } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';

export default function TopBar() {
  const { language, setLanguage, isHindi } = useLanguage();

  return (
    <div className="bg-navy text-slate-200 text-xs py-2 px-4 border-b border-navy-light/40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Contact details */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <a
            href="tel:+917413059364"
            className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors font-medium"
          >
            <Phone size={13} className="text-cyan-400" />
            <span>+91 74130 59364</span>
          </a>

          <a
            href="mailto:ujjalaelectricalsbkn@gmail.com"
            className="hidden sm:flex items-center gap-1.5 hover:text-cyan-300 transition-colors"
          >
            <Mail size={13} className="text-cyan-400" />
            <span>ujjalaelectricalsbkn@gmail.com</span>
          </a>

          <div className="hidden md:flex items-center gap-1.5 text-slate-300">
            <MapPin size={13} className="text-cyan-400" />
            <span>{isHindi ? 'रानी बाज़ार, बीकानेर (स्थापना 2017)' : 'Rani Bazar, Bikaner (Est. 2017)'}</span>
          </div>
        </div>

        {/* Language switch & Admin */}
        <div className="flex items-center gap-4 ml-auto">
          <div className="flex items-center bg-navy-light/80 rounded-md p-0.5 border border-slate-700">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-0.5 rounded text-xs font-medium transition-all ${
                language === 'en'
                  ? 'bg-cyan-600 text-white shadow-xs font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-0.5 rounded text-xs font-medium transition-all ${
                language === 'hi'
                  ? 'bg-cyan-600 text-white shadow-xs font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              हिंदी
            </button>
          </div>

          <Link
            to="/admin/login"
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
            title="Owner & Staff CMS"
          >
            <Shield size={12} className="text-slate-400" />
            <span className="hidden sm:inline">CMS</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

