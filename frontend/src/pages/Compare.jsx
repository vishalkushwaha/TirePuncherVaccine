import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, ShieldCheck, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { getContrastTextColor } from '../utils/productThemes';
import { api } from '../services/api';

export default function Compare() {
  const { t, isHindi } = useLanguage();
  const { getTheme } = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCompareProducts()
      .then(data => {
        setProducts(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-12 py-12 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full">
          {t('products.compareTitle')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy">
          {isHindi ? 'गल्फ, रॉक और थॉर — संपूर्ण तुलना' : 'Gulf, Rock & Thor Side-by-Side'}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          {t('products.compareSub')}
        </p>
      </div>

      {/* Comparison Table */}
      <p className="md:hidden text-center text-xs font-semibold text-slate-500 -mb-2">
        {isHindi ? '← सभी प्रोडक्ट देखने के लिए स्वाइप करें →' : '← Swipe to compare all products →'}
      </p>
      <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-md">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr>
              <th className="p-4 sm:p-5 text-sm font-bold w-1/4 bg-navy text-white">
                {isHindi ? 'मापदंड / विवरण' : 'Specification'}
              </th>
              {products.map(p => {
                const theme = getTheme(p.code);
                return (
                  <th
                    key={p.id}
                    className="p-4 sm:p-5 text-center text-sm font-bold border-l border-white/20 transition-colors"
                    style={{
                      backgroundColor: theme.primary,
                      color: getContrastTextColor(theme.primary)
                    }}
                  >
                    <div className="text-base sm:text-lg">{isHindi ? p.name_hi : p.name_en}</div>
                    <span
                      className="inline-block mt-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: theme.secondary,
                        color: getContrastTextColor(theme.secondary)
                      }}
                    >
                      Code: {p.code.toUpperCase()}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
            {/* Visual Thumbnail */}
            <tr>
              <td className="p-4 font-semibold text-slate-700 bg-slate-50">{isHindi ? 'उत्पाद चित्र' : 'Bottle Pack'}</td>
              {products.map(p => {
                const theme = getTheme(p.code);
                return (
                  <td
                    key={p.id}
                    className="p-4 text-center border-l border-slate-100"
                    style={{ backgroundColor: theme.bgLight }}
                  >
                    <img
                      src={p.image_url || '/assets/logo.png'}
                      alt={p.name_en}
                      className="h-28 w-auto object-contain mx-auto rounded-lg drop-shadow-sm"
                    />
                  </td>
                );
              })}
            </tr>

            {/* MRP */}
            <tr>
              <td className="p-4 font-bold text-navy">{isHindi ? 'अधिकतम खुदरा मूल्य (MRP)' : 'Maximum Retail Price (MRP)'}</td>
              {products.map(p => {
                const theme = getTheme(p.code);
                return (
                  <td key={p.id} className="p-4 text-center border-l border-slate-100">
                    <span className="font-black text-2xl" style={{ color: theme.primary }}>
                      ₹{p.mrp}
                    </span>
                    <span className="block text-[11px] font-normal text-slate-500">/ {p.pack_size}</span>
                  </td>
                );
              })}
            </tr>

            {/* Warranty */}
            <tr className="bg-slate-50">
              <td className="p-4 font-semibold text-slate-700">{isHindi ? 'निर्माता वारंटी' : 'Manufacturer Warranty'}</td>
              {products.map(p => {
                const theme = getTheme(p.code);
                return (
                  <td key={p.id} className="p-4 text-center border-l border-slate-100">
                    <span
                      className="inline-block font-bold text-xs px-3 py-1 rounded-full shadow-xs"
                      style={{
                        backgroundColor: theme.secondary,
                        color: getContrastTextColor(theme.secondary)
                      }}
                    >
                      {p.warranty_months} {isHindi ? 'महीने वारंटी' : 'Months'}
                    </span>
                  </td>
                );
              })}
            </tr>

            {/* Tyre Compatibility */}
            <tr>
              <td className="p-4 font-semibold text-slate-700">{isHindi ? 'टायर का प्रकार' : 'Tyre Setup'}</td>
              {products.map(p => (
                <td key={p.id} className="p-4 text-center font-medium text-slate-800 border-l border-slate-100">
                  {p.tyre_type}
                </td>
              ))}
            </tr>

            {/* Vehicle Applicability */}
            <tr className="bg-slate-50">
              <td className="p-4 font-semibold text-slate-700">{isHindi ? 'वाहन अनुशंसा' : 'Recommended Vehicles'}</td>
              {products.map(p => (
                <td key={p.id} className="p-4 text-center text-xs text-slate-600 border-l border-slate-100">
                  {isHindi ? p.vehicle_summary_hi : p.vehicle_summary_en}
                </td>
              ))}
            </tr>

            {/* Heavy Commercial Flag */}
            <tr>
              <td className="p-4 font-semibold text-slate-700">{isHindi ? 'भारी वाहन ग्रेड' : 'Heavy Vehicle Grade'}</td>
              {products.map(p => (
                <td key={p.id} className="p-4 text-center border-l border-slate-100">
                  {p.is_heavy_vehicle ? (
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-xs">
                      {isHindi ? 'हाँ (विशेष अनुशंसा)' : 'Yes (Heavy Grade)'}
                    </span>
                  ) : (
                    <span className="text-slate-400 text-xs">
                      {isHindi ? 'मध्यम व सामान्य' : 'Standard Commercial'}
                    </span>
                  )}
                </td>
              ))}
            </tr>

            {/* Puncture Sealing Capability */}
            <tr className="bg-slate-50">
              <td className="p-4 font-semibold text-slate-700">{isHindi ? 'पंचर सीलिंग क्षमता' : 'Seal Capacity'}</td>
              {products.map(p => (
                <td key={p.id} className="p-4 text-center font-medium text-slate-800 border-l border-slate-100">
                  {isHindi ? '4 मिमी तक (ट्रेड एरिया)' : 'Up to 4mm Tread Punctures'}
                </td>
              ))}
            </tr>

            {/* Operating Temp */}
            <tr>
              <td className="p-4 font-semibold text-slate-700">{isHindi ? 'कार्यशील तापमान' : 'Thermal Stability'}</td>
              {products.map(p => (
                <td key={p.id} className="p-4 text-center font-medium text-slate-800 border-l border-slate-100">
                  -30°C to +60°C
                </td>
              ))}
            </tr>

            {/* Actions */}
            <tr className="bg-slate-50">
              <td className="p-4 font-bold text-navy">{isHindi ? 'कोटेशन अनुरोध' : 'Get Quote'}</td>
              {products.map(p => {
                const theme = getTheme(p.code);
                return (
                  <td key={p.id} className="p-4 text-center space-y-2 border-l border-slate-100">
                    <Link
                      to={`/quote?product=${p.code}&type=retail`}
                      className="block w-full py-2.5 px-3 text-xs font-bold rounded-lg transition-all shadow-xs"
                      style={{
                        backgroundColor: theme.btnPrimary,
                        color: getContrastTextColor(theme.btnPrimary)
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = theme.btnHover;
                        e.currentTarget.style.color = getContrastTextColor(theme.btnHover);
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = theme.btnPrimary;
                        e.currentTarget.style.color = getContrastTextColor(theme.btnPrimary);
                      }}
                    >
                      {t('common.retailQuote')}
                    </Link>
                    <Link
                      to={`/quote?product=${p.code}&type=bulk`}
                      className="block w-full py-2 px-3 bg-white border text-xs font-semibold rounded-lg transition-colors"
                      style={{
                        borderColor: theme.border,
                        color: theme.primary,
                        backgroundColor: theme.bgBadge
                      }}
                    >
                      {t('common.bulkQuote')}
                    </Link>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
