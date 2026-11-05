import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ShoppingCart, Eye, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useShopConfig } from '../context/ShopConfigContext';
import { useCart } from '../context/CartContext';
import { getContrastTextColor } from '../utils/productThemes';
import { api } from '../services/api';

export default function Products() {
  const { t, isHindi } = useLanguage();
  const { getTheme, themes } = useTheme();
  const { isEcommerceEnabled, allowAddToCart, isQuotationEnabled } = useShopConfig();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProducts()
      .then(data => {
        setProducts(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = products.filter(p => {
    if (filter === 'tubeless') return p.tyre_type.toLowerCase().includes('tubeless') && !p.is_heavy_vehicle;
    if (filter === 'heavy') return p.is_heavy_vehicle;
    if (filter === 'all-rounder') return p.tyre_type.toLowerCase().includes('tube &') || p.code === 'rock';
    return true;
  });

  return (
    <div className="space-y-12 py-12">
      {/* Page Title Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full">
            {t('products.title')}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-navy">
            {isHindi ? 'विश्वसनीय टायर सीलेंट श्रृंखला' : 'Commercial & Passenger Vehicle Sealants'}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            {t('products.subtitle')}
          </p>
        </div>

        {/* Filter Buttons with Brand Swatches */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              filter === 'all'
                ? 'bg-navy text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {isHindi ? 'सभी प्रोडक्ट्स (All)' : 'All Products'}
          </button>
          <button
            onClick={() => setFilter('tubeless')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              filter === 'tubeless'
                ? 'bg-[#6C024A] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themes.gulf?.primary || '#6C024A' }} />
            <span>{isHindi ? 'गल्फ (ट्यूबलेस)' : 'Tubeless Commuters (Gulf)'}</span>
          </button>
          <button
            onClick={() => setFilter('all-rounder')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              filter === 'all-rounder'
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themes.rock?.secondary || '#D97706' }} />
            <span>{isHindi ? 'रॉक (ट्यूब व ट्यूबलेस)' : 'All-Rounder (Rock)'}</span>
          </button>
          <button
            onClick={() => setFilter('heavy')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              filter === 'heavy'
                ? 'bg-[#0B2744] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themes.thor?.secondary || '#0284C7' }} />
            <span>{isHindi ? 'थॉर (भारी वाहन/बस/ट्रक)' : 'Heavy Vehicles (Thor)'}</span>
          </button>
        </div>
      </section>

      {/* Product Grid with Color Themes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filtered.map(prod => {
            const theme = getTheme(prod.code);
            return (
              <div
                key={prod.id}
                className="flex flex-col bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl overflow-hidden"
                style={{ borderColor: theme.border }}
              >
                {/* Header Banner */}
                <div
                  className="py-2.5 px-4 text-xs font-bold flex items-center justify-between"
                  style={{
                    backgroundColor: theme.primary,
                    color: getContrastTextColor(theme.primary)
                  }}
                >
                  <span>{prod.is_heavy_vehicle ? (isHindi ? 'भारी वाहन अनुशंसा' : 'Heavy Commercial Recommendation') : prod.tyre_type}</span>
                  <span
                    className="px-2 py-0.5 rounded text-[11px] font-bold"
                    style={{
                      backgroundColor: theme.secondary,
                      color: getContrastTextColor(theme.secondary)
                    }}
                  >
                    {prod.warranty_months} {isHindi ? 'महीने वारंटी' : 'Mo Warranty'}
                  </span>
                </div>

                {/* Poster Image with Light Tint */}
                <div
                  className="relative aspect-4/3 p-4 flex items-center justify-center overflow-hidden group"
                  style={{ backgroundColor: theme.bgLight }}
                >
                  <img
                    src={prod.image_url || '/assets/logo.png'}
                    alt={prod.name_en}
                    className="h-full w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
                  />
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3
                      className="text-xl font-bold"
                      style={{ color: theme.textContrast }}
                    >
                      {isHindi ? prod.name_hi : prod.name_en}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {isHindi ? prod.vehicle_summary_hi : prod.vehicle_summary_en}
                    </p>

                    <div className="mt-4 flex items-baseline gap-2">
                      <span
                        className="text-3xl font-black"
                        style={{ color: theme.primary }}
                      >
                        ₹{prod.mrp}
                      </span>
                      <span className="text-xs text-slate-500">
                        / {prod.pack_size} ({t('common.inclusiveTaxes')})
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed">
                      {isHindi ? prod.description_hi : prod.description_en}
                    </p>
                  </div>

                  {/* Feature Checklist */}
                  <div
                    className="space-y-1.5 text-xs text-slate-700 border-t pt-3"
                    style={{ borderColor: theme.border }}
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} style={{ color: theme.accent }} className="shrink-0" />
                      <span>{isHindi ? '4 मिमी तक पंचर स्वतः सील' : '4mm Punctures Sealed Instantly'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} style={{ color: theme.accent }} className="shrink-0" />
                      <span>{isHindi ? 'रिम जंग-रहित सुरक्षा' : 'Anti-Corrosive Rim Protection'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} style={{ color: theme.accent }} className="shrink-0" />
                      <span>{isHindi ? `${prod.warranty_months} महीने आधिकारिक वारंटी` : `${prod.warranty_months} Months Performance Warranty`}</span>
                    </div>
                  </div>

                  {/* Actions according to Business Mode */}
                  <div className="space-y-2 pt-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        to={`/products/${prod.code}`}
                        className="text-center py-2.5 px-3 rounded-lg border text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                        style={{
                          borderColor: theme.border,
                          color: theme.primary,
                          backgroundColor: theme.bgBadge
                        }}
                      >
                        <Eye size={14} />
                        <span>{t('common.viewDetails')}</span>
                      </Link>

                      {isEcommerceEnabled && allowAddToCart ? (
                        <button
                          type="button"
                          onClick={() => addToCart(prod, 1)}
                          className="py-2.5 px-3 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
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
                          <ShoppingCart size={14} />
                          <span>{isHindi ? 'कार्ट में जोड़ें' : 'Add to Cart'}</span>
                        </button>
                      ) : (
                        <Link
                          to={`/quote?product=${prod.code}&type=retail`}
                          className="text-center py-2.5 px-3 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
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
                          <span>{t('common.retailQuote')}</span>
                        </Link>
                      )}
                    </div>

                    {/* Wholesale link if quotation enabled */}
                    {isQuotationEnabled && (
                      <Link
                        to={`/quote?type=bulk&product=${prod.code}`}
                        className="w-full block text-center py-1.5 text-[11px] font-semibold text-slate-500 hover:text-navy transition-colors"
                      >
                        {isHindi ? 'थोक/फ्लीट कोटेशन प्राप्त करें (10+ बोतल) →' : 'Wholesale / Fleet Quotation (10+ Bottles) →'}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Compare Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-navy">
              {isHindi ? 'गल्फ, रॉक और थॉर की विस्तृत तुलना देखना चाहते हैं?' : 'Need to compare Gulf, Rock, and Thor side-by-side?'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {isHindi ? 'वारंटी, वाहन अनुशंसा और रासायनिक विशेषताओं की विस्तृत तालिका देखें।' : 'Check detailed specifications, warranty coverage, and vehicle recommendations.'}
            </p>
          </div>
          <Link
            to="/compare"
            className="bg-navy hover:bg-cyan-700 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shrink-0 transition-colors shadow-xs"
          >
            {isHindi ? 'तुलना तालिका खोलें →' : 'Open Comparison Matrix →'}
          </Link>
        </div>
      </section>
    </div>
  );
}
