import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Search, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';

export default function WhereToBuy() {
  const { t, isHindi } = useLanguage();
  const [dealers, setDealers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDealers()
      .then(data => {
        setDealers(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredDealers = dealers.filter(d =>
    d.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.district && d.district.toLowerCase().includes(searchTerm.toLowerCase())) ||
    d.dealer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 py-12 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full">
          {t('nav.whereToBuy')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy">
          {isHindi ? 'अधिकृत डीलर एवं वितरण केंद्र' : 'Authorized Dealers & Distribution Hubs'}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          {isHindi
            ? 'अपने नजदीकी अधिकृत डीलर से वास्तविक Tyre Puncture Vaccine प्राप्त करें।'
            : 'Locate genuine Tyre Puncture Vaccine bottles and fitment services across Rajasthan.'}
        </p>

        {/* Search Input */}
        <div className="max-w-md mx-auto pt-4">
          <div className="relative">
            <Search size={18} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder={isHindi ? "शहर या जिले के नाम से खोजें..." : "Search by city or district..."}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-600 focus:outline-hidden bg-white shadow-xs"
            />
          </div>
        </div>
      </div>

      {/* Dealers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDealers.map(d => (
          <div key={d.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-cyan-400 transition-colors">
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-navy">{d.dealer_name}</h3>
                <span className="text-xs font-semibold text-cyan-700">{d.city}, {d.state}</span>
              </div>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded">
                {isHindi ? 'अधिकृत डीलर' : 'Authorized'}
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              {d.address && (
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="text-cyan-600 shrink-0 mt-0.5" />
                  <span>{d.address} {d.pin_code && `- ${d.pin_code}`}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-cyan-600 shrink-0" />
                <a href={`tel:${d.phone}`} className="font-semibold text-slate-800 hover:text-cyan-700">
                  {d.phone}
                </a>
              </div>
              {d.contact_person && (
                <div className="text-[11px] text-slate-500 pt-1">
                  Contact: {d.contact_person}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Fallback Notice if no dealers in city */}
      <div className="bg-ice p-8 rounded-2xl border border-slate-200 text-center space-y-4 max-w-2xl mx-auto">
        <h3 className="text-lg font-bold text-navy">
          {isHindi ? 'क्या आपके क्षेत्र में अभी कोई डीलर नहीं है?' : 'No local dealer in your town yet?'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600">
          {isHindi
            ? 'चिंता न करें! आप सीधे हमारी बीकानेर मुख्य शाखा से ऑनलाइन कोटेशन द्वारा कोरियर से माल मंगवा सकते हैं, या अपने क्षेत्र के अधिकृत वितरक बन सकते हैं।'
            : 'You can order directly from our Bikaner main hub with safe door-to-door courier delivery, or apply to become the first authorized dealer in your territory.'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/quote"
            className="bg-navy hover:bg-cyan-700 text-white font-bold px-5 py-2.5 rounded-lg text-xs transition-colors"
          >
            {t('common.requestQuote')}
          </Link>
          <Link
            to="/distributorship"
            className="bg-white border border-slate-300 hover:border-cyan-600 text-navy font-bold px-5 py-2.5 rounded-lg text-xs transition-colors"
          >
            {t('common.becomeDistributor')}
          </Link>
        </div>
      </div>
    </div>
  );
}

