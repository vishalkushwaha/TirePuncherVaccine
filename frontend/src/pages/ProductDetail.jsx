import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, ArrowRight, Truck, Car, Bike, Award, HelpCircle, ShoppingCart, Zap, Plus, Minus } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useShopConfig } from '../context/ShopConfigContext';
import { useCart } from '../context/CartContext';
import { getContrastTextColor } from '../utils/productThemes';
import { api } from '../services/api';

export default function ProductDetail() {
  const { id } = useParams();
  const { t, isHindi } = useLanguage();
  const { getTheme } = useTheme();
  const { allowAddToCart, allowBuyNow, isQuotationEnabled, isEcommerceEnabled } = useShopConfig();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buyQty, setBuyQty] = useState(1);

  useEffect(() => {
    api.getProduct(id)
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-cyan-600 border-t-transparent"></div>
        <p className="mt-2 text-xs text-slate-500">Loading product specifications...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-navy">Product Not Found</h2>
        <Link to="/products" className="text-cyan-600 font-semibold hover:underline">
          Return to Products Catalog
        </Link>
      </div>
    );
  }

  const theme = getTheme(product.code);
  const featuresList = (isHindi ? product.features_hi : product.features_en)?.split('\n') || [];

  return (
    <div className="space-y-12 py-12 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-cyan-700">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-cyan-700">Products</Link>
        <span>/</span>
        <span className="font-semibold text-slate-800" style={{ color: theme.primary }}>
          {product.name_en}
        </span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Product Artwork / Poster with Product Tint */}
        <div
          className="lg:col-span-6 rounded-2xl p-6 border flex flex-col items-center justify-center transition-all shadow-xs"
          style={{
            backgroundColor: theme.bgLight,
            borderColor: theme.border
          }}
        >
          <img
            src={product.image_url || '/assets/logo.png'}
            alt={product.name_en}
            className="max-h-[500px] w-auto object-contain rounded-xl shadow-md hover:scale-102 transition-transform duration-300"
          />
          <span className="text-[11px] text-slate-500 mt-4 font-medium">
            {isHindi ? 'आधिकारिक निर्माता पैकिंग · 1 लीटर बोतल' : 'Official Ujjala Electricals Factory Pack · 1 Litre Bottle'}
          </span>
        </div>

        {/* Right: Pricing, Specs & Quote Funnel */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="text-xs font-bold px-3 py-1 rounded-full uppercase"
                style={{
                  backgroundColor: theme.primary,
                  color: getContrastTextColor(theme.primary)
                }}
              >
                Code: {product.code.toUpperCase()}
              </span>
              <span
                className="text-xs font-bold px-3 py-1 rounded-full"
                style={{
                  backgroundColor: theme.secondary,
                  color: getContrastTextColor(theme.secondary)
                }}
              >
                {product.warranty_months} {isHindi ? 'महीने वारंटी' : 'Months Warranty'}
              </span>
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full border"
                style={{
                  backgroundColor: theme.bgBadge,
                  color: theme.primary,
                  borderColor: theme.border
                }}
              >
                {product.tyre_type}
              </span>
            </div>

            <h1
              className="text-3xl sm:text-4xl font-extrabold"
              style={{ color: theme.textContrast }}
            >
              {isHindi ? product.name_hi : product.name_en}
            </h1>

            <p className="text-sm font-semibold" style={{ color: theme.secondary }}>
              {isHindi ? product.vehicle_summary_hi : product.vehicle_summary_en}
            </p>
          </div>

          {/* Pricing Box */}
          <div
            className="p-5 rounded-xl border space-y-1 transition-all"
            style={{
              backgroundColor: theme.bgLight,
              borderColor: theme.border
            }}
          >
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
              {t('common.mrp')} ({isHindi ? 'अधिकतम खुदरा मूल्य' : 'Maximum Retail Price'})
            </span>
            <div className="flex items-baseline gap-3">
              <span
                className="text-4xl font-black"
                style={{ color: theme.primary }}
              >
                ₹{product.mrp}
              </span>
              <span className="text-xs text-slate-500">
                / {product.pack_size} ({t('common.inclusiveTaxes')})
              </span>
            </div>
            <p className="text-xs text-slate-600 pt-1">
              {isHindi
                ? 'खुदरा ग्राहकों के लिए बोतल दर बोतल और थोक/फ्लीट ग्राहकों के लिए कार्टन दर पर उपलब्ध।'
                : 'Available for direct single bottle retail and discounted bulk carton fleet supplies.'}
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3
              className="text-sm font-bold uppercase tracking-wider"
              style={{ color: theme.primary }}
            >
              {isHindi ? 'उत्पाद विवरण' : 'Description'}
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {isHindi ? product.description_hi : product.description_en}
            </p>
          </div>

          {/* Key Features Bullet Points */}
          <div
            className="space-y-3 border-t pt-4"
            style={{ borderColor: theme.border }}
          >
            <h3
              className="text-sm font-bold uppercase tracking-wider"
              style={{ color: theme.primary }}
            >
              {isHindi ? 'मुख्य विशेषताएं' : 'Key Specifications'}
            </h3>
            <div className="space-y-2">
              {featuresList.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2
                    size={16}
                    className="shrink-0 mt-0.5"
                    style={{ color: theme.accent }}
                  />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic E-Commerce & Quotation Actions */}
          {isEcommerceEnabled ? (
            <div className="space-y-4 pt-4 border-t" style={{ borderColor: theme.border }}>
              {/* Quantity Selector & Stock Indicator */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase text-slate-700">
                    {isHindi ? 'मात्रा:' : 'Quantity:'}
                  </span>
                  <div className="flex items-center border border-slate-300 rounded-lg p-0.5 bg-white">
                    <button
                      type="button"
                      onClick={() => setBuyQty(q => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-navy">
                      {buyQty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setBuyQty(q => q + 1)}
                      className="w-8 h-8 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 size={14} />
                    {isHindi ? 'स्टॉक में उपलब्ध' : 'In Stock (Bikaner Hub)'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Total: ₹{(product.mrp * buyQty).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Add to Cart & Buy Now */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {allowAddToCart && (
                  <button
                    type="button"
                    onClick={() => addToCart(product, buyQty, true)}
                    className="py-3 px-4 font-bold rounded-lg text-sm shadow-md transition-all flex items-center justify-center gap-2"
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
                    <ShoppingCart size={16} />
                    <span>{isHindi ? 'कार्ट में जोड़ें' : 'Add to Cart'}</span>
                  </button>
                )}

                {allowBuyNow && (
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(product, buyQty, false);
                      navigate('/checkout');
                    }}
                    className="py-3 px-4 font-bold rounded-lg text-sm shadow-md transition-all flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: theme.secondary,
                      color: getContrastTextColor(theme.secondary)
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = theme.primary;
                      e.currentTarget.style.color = getContrastTextColor(theme.primary);
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = theme.secondary;
                      e.currentTarget.style.color = getContrastTextColor(theme.secondary);
                    }}
                  >
                    <Zap size={16} />
                    <span>{isHindi ? 'अभी खरीदें (Buy Now)' : 'Buy Now'}</span>
                  </button>
                )}
              </div>

              {/* Hybrid Mode Bulk Link */}
              {isQuotationEnabled && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                  <span className="text-slate-600">
                    {isHindi ? 'वर्कशॉप, फ्लीट या थोक (10+ बोतलें) चाहिए?' : 'Fleet, workshop or wholesale (10+ bottles)?'}
                  </span>
                  <Link
                    to={`/quote?product=${product.code}&type=bulk`}
                    className="font-bold hover:underline"
                    style={{ color: theme.primary }}
                  >
                    {isHindi ? 'थोक कोटेशन लें →' : 'Request Bulk Quote →'}
                  </Link>
                </div>
              )}
            </div>
          ) : (
            /* Mode A: Quotation Action Buttons */
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t"
              style={{ borderColor: theme.border }}
            >
              <Link
                to={`/quote?product=${product.code}&type=retail`}
                className="text-center py-3 px-4 font-bold rounded-lg text-sm shadow-md transition-all"
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
                {t('common.retailQuote')} (1-4 {isHindi ? 'बोतल' : 'Bottles'})
              </Link>
              <Link
                to={`/quote?product=${product.code}&type=bulk`}
                className="text-center py-3 px-4 font-bold rounded-lg text-sm shadow-md transition-all"
                style={{
                  backgroundColor: theme.secondary,
                  color: getContrastTextColor(theme.secondary)
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = theme.primary;
                  e.currentTarget.style.color = getContrastTextColor(theme.primary);
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = theme.secondary;
                  e.currentTarget.style.color = getContrastTextColor(theme.secondary);
                }}
              >
                {t('common.bulkQuote')} ({isHindi ? 'थोक व कार्टन' : 'Bulk Cartons'})
              </Link>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
            <span>{isHindi ? 'निर्माता: उजाला इलेक्ट्रिकल्स, बीकानेर' : 'Manufacturer: Ujjala Electricals, Bikaner'}</span>
            <Link
              to="/dosage-guide"
              className="font-semibold hover:underline"
              style={{ color: theme.secondary }}
            >
              {isHindi ? 'डोसेज गाइड देखें →' : 'View Dosage Guide →'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
