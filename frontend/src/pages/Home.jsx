import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, ArrowRight, Truck, Car, Bike, CheckCircle2,
  Droplets, Thermometer, Gauge, ChevronRight, Award, Zap, Phone, HelpCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { getContrastTextColor } from '../utils/productThemes';
import { api } from '../services/api';

export default function Home() {
  const { t, isHindi } = useLanguage();
  const { getTheme } = useTheme();
  const [products, setProducts] = useState([]);
  const [events, setEvents] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getProducts().catch(() => []),
      api.getEvents(3).catch(() => []),
      api.getBlogPosts(3).catch(() => []),
      api.getTestimonials(true).catch(() => []),
      api.getFaqs().catch(() => [])
    ]).then(([prods, evts, bposts, tests, faqList]) => {
      setProducts(prods || []);
      setEvents(evts || []);
      setBlogs(bposts || []);
      setTestimonials(tests || []);
      setFaqs(faqList.slice(0, 4) || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* H3: Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#071A2E] via-[#0B2744] to-[#14365C] text-white pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(#0E7490_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-25 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-[#0E7490]/25 border border-cyan-400/50 text-cyan-200 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-sm shadow-sm">
                <ShieldCheck size={14} className="text-cyan-300" />
                <span>UJJALA ELECTRICALS · BIKANER · EST. 2017</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                TYRE PUNCTURE <span className="text-cyan-400 drop-shadow-sm">VACCINE</span>
              </h1>

              <div className="bg-cyan-500/15 border-l-4 border-cyan-400 pl-4 py-2.5 rounded-r-lg shadow-xs">
                <p className="text-2xl sm:text-3xl font-bold text-cyan-200 font-hindi drop-shadow-xs">
                  {isHindi ? 'अब पंचर की छुट्टी - बेफिक्र और सुरक्षित सफर' : 'अब पंचर की छुट्टी · No More Puncture Hassle'}
                </p>
              </div>

              <p className="text-base sm:text-lg text-slate-100 leading-relaxed max-w-2xl font-normal drop-shadow-xs">
                {isHindi
                  ? 'ट्यूब व ट्यूबलेस टायरों के लिए संपूर्ण प्रिवेंटिव सीलेंट। 4 मिमी तक के पंचर तुरंत सील, टायर की लाइफ में 20% तक सुधार और ईंधन की बचत।'
                  : 'Advanced preventive tyre sealant engineered for two-wheelers, cars, SUVs, and heavy commercial vehicles. Instantly seals tread punctures up to 4mm, prolongs tyre life, and ensures worry-free travel.'}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/products"
                  className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-7 py-3.5 rounded-lg shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center gap-2 text-sm sm:text-base"
                >
                  <span>{isHindi ? 'हमारे प्रोडक्ट्स देखें' : 'View Products'}</span>
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/distributorship"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-semibold px-6 py-3.5 rounded-lg transition-colors text-sm sm:text-base flex items-center gap-2"
                >
                  <span>{isHindi ? 'डिस्ट्रीब्यूटर बनें' : 'Become a Distributor'}</span>
                </Link>

                <Link
                  to="/quote"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-3.5 rounded-lg shadow-md transition-colors text-sm sm:text-base"
                >
                  <span>{isHindi ? 'कोटेशन मांगें' : 'Get a Quote'}</span>
                </Link>
              </div>

              {/* Verified Trust Chips */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-cyan-800/60 max-w-lg mx-auto lg:mx-0">
                <div>
                  <span className="block text-xl sm:text-2xl font-black text-cyan-300 drop-shadow-xs">4 mm</span>
                  <span className="text-xs text-slate-200 font-medium">{isHindi ? 'तक पंचर सील' : 'Instant Seal'}</span>
                </div>
                <div>
                  <span className="block text-xl sm:text-2xl font-black text-white drop-shadow-xs">-30° to +60°</span>
                  <span className="text-xs text-slate-200 font-medium">{isHindi ? 'तापमान सुरक्षा' : 'Operating Range'}</span>
                </div>
                <div>
                  <span className="block text-xl sm:text-2xl font-black text-emerald-300 drop-shadow-xs">+20%</span>
                  <span className="text-xs text-slate-200 font-medium">{isHindi ? 'टायर की उम्र' : 'Tyre Life Boost'}</span>
                </div>
              </div>
            </div>

            {/* Right Visual Image */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative max-w-sm sm:max-w-md w-full bg-[#071A2E]/80 p-4 rounded-2xl border border-cyan-400/40 shadow-2xl backdrop-blur-sm">
                <img
                  src="/assets/rock-poster.jpeg"
                  alt="Tyre Puncture Vaccine Bottle & Poster"
                  className="w-full h-auto rounded-xl object-contain shadow-md"
                />
                <div className="absolute -bottom-4 -left-4 bg-navy border border-cyan-400/50 p-3 rounded-lg shadow-xl hidden sm:flex items-center gap-3">
                  <div className="bg-cyan-500/20 p-2 rounded-full text-cyan-400">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400">{isHindi ? 'आधिकारिक फॉर्मूलेशन' : 'Official Guarantee'}</span>
                    <span className="block text-sm font-bold text-white">9 & 12 {isHindi ? 'महीने वारंटी' : 'Mo Warranty'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* H4: The Three Opening Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full">
            {isHindi ? 'मूल रेंज' : 'Core Product Lineup'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy">
            {isHindi ? 'गल्फ, रॉक और थॉर — आपकी गाड़ी के अनुसार' : 'Gulf, Rock, and Thor — Tailored Protection'}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            {isHindi
              ? 'प्रत्येक उत्पाद आधिकारिक एमआरपी और निर्माता वारंटी के साथ उपलब्ध है।'
              : 'Every bottle is sealed with guaranteed MRP and factory warranty backed by Ujjala Electricals.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((prod) => {
            const theme = getTheme(prod.code);
            return (
              <div
                key={prod.id}
                className="flex flex-col bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl overflow-hidden"
                style={{ borderColor: theme.border }}
              >
                {/* Product Badge / Header banner */}
                <div
                  className="py-2.5 px-4 text-xs font-bold flex items-center justify-between"
                  style={{
                    backgroundColor: theme.primary,
                    color: getContrastTextColor(theme.primary)
                  }}
                >
                  <span>{prod.is_heavy_vehicle ? (isHindi ? 'भारी वाहनों हेतु विशेष' : 'Recommended for Heavy Vehicles') : prod.tyre_type}</span>
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

                {/* Bottle poster image */}
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

                {/* Details & Pricing */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3
                      className="text-xl font-bold"
                      style={{ color: theme.textContrast }}
                    >
                      {isHindi ? prod.name_hi : prod.name_en}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
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
                  </div>

                  {/* Features checklist */}
                  <div
                    className="space-y-1.5 text-xs text-slate-700 border-t pt-3"
                    style={{ borderColor: theme.border }}
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} style={{ color: theme.accent }} className="shrink-0" />
                      <span>{isHindi ? '4 मिमी तक के पंचर तुरंत सील' : 'Seals tread punctures up to 4mm'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} style={{ color: theme.accent }} className="shrink-0" />
                      <span>{isHindi ? 'रिम और अलॉय व्हील सुरक्षित' : 'Safe for metal & alloy wheels'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} style={{ color: theme.accent }} className="shrink-0" />
                      <span>{isHindi ? `${prod.warranty_months} महीने निर्माण वारंटी` : `${prod.warranty_months} Months Performance Warranty`}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Link
                      to={`/products/${prod.code}`}
                      className="text-center py-2.5 px-3 rounded-lg border text-xs font-bold transition-colors"
                      style={{
                        borderColor: theme.border,
                        color: theme.primary,
                        backgroundColor: theme.bgBadge
                      }}
                    >
                      {t('common.viewDetails')}
                    </Link>
                    <Link
                      to={`/quote?product=${prod.code}&type=retail`}
                      className="text-center py-2.5 px-3 rounded-lg text-xs font-bold transition-all shadow-xs"
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
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/compare"
            className="inline-flex items-center gap-2 text-sm font-bold text-cyan-700 hover:text-cyan-800 hover:underline"
          >
            <span>{isHindi ? 'गल्फ, रॉक और थॉर की पूरी तुलना देखें' : 'View full side-by-side comparison table'}</span>
            <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      {/* H5 & H6: Why Tyre Vaccine & Why Premium (Artwork Panels) */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          {/* H5: English 4 points */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">
                {t('whyUs.title')}
              </span>
              <h2 className="text-3xl font-extrabold text-navy mt-1">
                {t('whyUs.subtitle')}
              </h2>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                {isHindi
                  ? 'उजाला इलेक्ट्रिकल्स द्वारा निर्मित टायर पंचर वैक्सीन वैज्ञानिक रूप से तैयार किया गया ऐसा फॉर्मूला है जो गाड़ी के चलते ही सक्रिय हो जाता है।'
                  : 'Engineered by Ujjala Electricals to provide an uninterrupted driving experience with maximum fuel economy and zero rim deterioration.'}
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3 p-3 bg-white rounded-xl shadow-xs border border-slate-200">
                  <ShieldCheck size={20} className="text-cyan-600 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-700 font-medium">{t('whyUs.point1')}</span>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white rounded-xl shadow-xs border border-slate-200">
                  <ShieldCheck size={20} className="text-cyan-600 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-700 font-medium">{t('whyUs.point2')}</span>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white rounded-xl shadow-xs border border-slate-200">
                  <ShieldCheck size={20} className="text-cyan-600 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-700 font-medium">{t('whyUs.point3')}</span>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white rounded-xl shadow-xs border border-slate-200">
                  <ShieldCheck size={20} className="text-cyan-600 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-700 font-medium">{t('whyUs.point4')}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 flex justify-center">
              <img
                src="/assets/why-choose-us.png"
                alt="Why Tyre Vaccine Features Poster"
                className="rounded-2xl shadow-lg border border-slate-200 max-h-96 w-auto object-contain bg-white"
              />
            </div>
          </div>

          {/* H6: Hindi 6 Cards Matrix (from poster WhatsApp Image 8.22.40 PM) */}
          <div className="pt-8 border-t border-slate-200">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h3 className="text-2xl font-bold text-navy font-hindi">
                हम प्रीमियम क्यों हैं? संपूर्ण प्री-पंचर टायर सीलेंट
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {isHindi ? 'विशेषताएं जो हमें देश भर में भरोसेमंद बनाती हैं' : 'Key proven advantages certified across Indian road testing'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-cyan-400 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-cyan-50 p-2 rounded-lg text-cyan-700">
                    <ShieldCheck size={20} />
                  </div>
                  <h4 className="font-bold text-navy text-sm font-hindi">1. खास फायदे (जंग रहित)</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-hindi">
                  जंग नहीं लगने देता, टायर को नुकसान नहीं पहुंचाता और टायर की उम्र को बढ़ाता है।
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-cyan-400 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-cyan-50 p-2 rounded-lg text-cyan-700">
                    <Car size={20} />
                  </div>
                  <h4 className="font-bold text-navy text-sm font-hindi">2. सभी वाहनों के लिए उपयुक्त</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-hindi">
                  बाइक, कार, ऑटो, पिकअप, बस और ट्रक — सभी ट्यूब व ट्यूबलेस टायरों में फिट बैठता है।
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-cyan-400 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-cyan-50 p-2 rounded-lg text-cyan-700">
                    <Zap size={20} />
                  </div>
                  <h4 className="font-bold text-navy text-sm font-hindi">3. टायर की उम्र 20% तक बढ़ाए</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-hindi">
                  टायर के आंतरिक तापमान को नियंत्रित रखकर और घिसाव कम करके उसकी उम्र 20% तक बढ़ाता है।
                </p>
              </div>

              {/* Card 4 */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-cyan-400 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-cyan-50 p-2 rounded-lg text-cyan-700">
                    <Gauge size={20} />
                  </div>
                  <h4 className="font-bold text-navy text-sm font-hindi">4. ईंधन की बचत (माइलेज सुधार)</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-hindi">
                  नियमित टायर दबाव बनाए रखने में मदद करता है। ईंधन की बचत 5% तक हो सकती है।
                </p>
              </div>

              {/* Card 5 */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-cyan-400 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-cyan-50 p-2 rounded-lg text-cyan-700">
                    <Thermometer size={20} />
                  </div>
                  <h4 className="font-bold text-navy text-sm font-hindi">5. गर्मी व तापमान से सुरक्षा</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-hindi">
                  यह -30°C से +60°C तापमान में निरंतर असरदार रहता है और रबर व रिम को ठंडा रखता है।
                </p>
              </div>

              {/* Card 6 */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-cyan-400 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-cyan-50 p-2 rounded-lg text-cyan-700">
                    <Droplets size={20} />
                  </div>
                  <h4 className="font-bold text-navy text-sm font-hindi">6. 4 मिमी पंचर तुरंत सील</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-hindi">
                  कील या नुकीली वस्तु के घुसते ही 4 मिमी तक के पंचर को स्वतः और हमेशा के लिए सील करता है।
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* H7: Vehicles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">
            {isHindi ? 'सभी वाहनों के लिए' : 'All Vehicle Categories'}
          </span>
          <h2 className="text-3xl font-bold text-navy mt-1">
            {isHindi ? 'हर पहिए के लिए सही सुरक्षा' : 'Engineered for Every Wheel'}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
          <div className="p-4 bg-white rounded-xl border border-slate-200 hover:border-cyan-500 transition-colors">
            <Bike size={32} className="mx-auto text-cyan-600 mb-2" />
            <h4 className="font-bold text-sm text-navy">{isHindi ? 'बाइक व स्कूटर' : 'Two Wheelers'}</h4>
            <span className="text-xs text-slate-500">400 ml / tyre</span>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 hover:border-cyan-500 transition-colors">
            <Car size={32} className="mx-auto text-cyan-600 mb-2" />
            <h4 className="font-bold text-sm text-navy">{isHindi ? 'हैचबैक व सेडान' : 'Cars & Sedans'}</h4>
            <span className="text-xs text-slate-500">400 ml / tyre</span>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 hover:border-cyan-500 transition-colors">
            <Car size={32} className="mx-auto text-cyan-600 mb-2" />
            <h4 className="font-bold text-sm text-navy">{isHindi ? 'एसयूवी (SUV)' : 'SUVs & 7-Seater'}</h4>
            <span className="text-xs text-slate-500">500-600 ml / tyre</span>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 hover:border-cyan-500 transition-colors">
            <Car size={32} className="mx-auto text-cyan-600 mb-2" />
            <h4 className="font-bold text-sm text-navy">{isHindi ? 'ऑटो व 3-व्हीलर' : '3-Wheelers'}</h4>
            <span className="text-xs text-slate-500">500 ml / tyre</span>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 hover:border-cyan-500 transition-colors">
            <Truck size={32} className="mx-auto text-cyan-600 mb-2" />
            <h4 className="font-bold text-sm text-navy">{isHindi ? 'टेम्पो व पिकअप' : 'Tempos'}</h4>
            <span className="text-xs text-slate-500">600 ml / tyre</span>
          </div>
          <div className="p-4 bg-navy text-white rounded-xl border border-cyan-500 shadow-md">
            <Truck size={32} className="mx-auto text-cyan-400 mb-2" />
            <h4 className="font-bold text-sm">{isHindi ? 'बस और ट्रक (थॉर)' : 'Bus & Trucks (Thor)'}</h4>
            <span className="text-xs text-cyan-200">2.4L - 2.8L / tyre</span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/dosage-guide"
            className="text-xs sm:text-sm font-bold text-cyan-700 hover:text-cyan-800 underline flex items-center justify-center gap-1"
          >
            <span>{isHindi ? 'पूरा डोसेज चार्ट और कैलकुलेटर खोलें' : 'Open full Dosage Chart & Interactive Calculator'}</span>
            <ChevronRight size={14} />
          </Link>
        </div>
      </section>

      {/* H8: Three Steps Teaser */}
      <section className="bg-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              {isHindi ? 'सरल प्रक्रिया' : 'Easy Installation'}
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-1">
              {isHindi ? 'मात्र 3 सरल चरणों में पंचर मुक्त' : 'Puncture-Free in 3 Quick Steps'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-navy-light/80 p-6 rounded-2xl border border-slate-700 text-center space-y-3">
              <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto text-white shadow-md">
                1
              </div>
              <h3 className="text-lg font-bold text-white">{isHindi ? 'बोतल प्राप्त करें' : 'Get the Bottle'}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isHindi ? 'अपनी गाड़ी के अनुसार गल्फ, रॉक या थॉर चुनें और सिरिंज तैयार करें।' : 'Select Gulf, Rock, or Thor based on vehicle type and tyre dimensions.'}
              </p>
            </div>

            <div className="bg-navy-light/80 p-6 rounded-2xl border border-slate-700 text-center space-y-3">
              <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto text-white shadow-md">
                2
              </div>
              <h3 className="text-lg font-bold text-white">{isHindi ? 'वॉल्व से इंजेक्ट करें' : 'Inject via Valve'}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isHindi ? 'टायर से हवा निकालकर सिरिंज से सीलेंट अंदर डालें और फिर सामान्य हवा भरें।' : 'Deflate tyre, inject sealant using provided syringe, and reinflate to pressure.'}
              </p>
            </div>

            <div className="bg-navy-light/80 p-6 rounded-2xl border border-slate-700 text-center space-y-3">
              <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto text-white shadow-md">
                3
              </div>
              <h3 className="text-lg font-bold text-white">{isHindi ? 'चलाएं और सुरक्षित रहें' : 'Drive & Stay Safe'}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isHindi ? '2-3 किमी गाड़ी चलाएं ताकि सीलेंट अंदर एक समान सुरक्षा परत बना ले।' : 'Drive 2-3 km so centrifugal action creates a permanent protective inner barrier.'}
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              to="/how-to-use"
              className="inline-flex items-center gap-2 bg-white text-navy font-bold px-6 py-3 rounded-lg hover:bg-cyan-50 transition-colors text-sm"
            >
              <span>{isHindi ? 'विस्तृत 6-स्टेप गाइड देखें' : 'View Detailed 6-Step Installation Guide'}</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* H10: Distributorship Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-[#0E7490] via-[#0B2744] to-[#071A2E] text-white rounded-3xl p-8 sm:p-12 border border-cyan-400/40 shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold px-3 py-1 rounded-full uppercase">
                {isHindi ? 'स्वरोजगार एवं व्यापार का सुनहरा अवसर' : 'Business Partnership Opportunity'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
                {isHindi ? 'राजस्थान व देश भर में हमारे डिस्ट्रीब्यूटर बनें' : 'Become a District or Tehsil Partner'}
              </h2>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
                {isHindi
                  ? 'उजाला इलेक्ट्रिकल्स (बीकानेर) के साथ जुड़कर अपने क्षेत्र में टायर पंचर वैक्सीन के अधिकृत वितरक बनें। पूरी तकनीकी ट्रेनिंग और मार्केटिंग सामग्री उपलब्ध।'
                  : 'Join Ujjala Electricals to establish a profitable distributorship for Gulf, Rock, and Thor. We provide complete technical support, point-of-sale promotional kits, and lead sharing.'}
              </p>
              <div className="pt-2">
                <Link
                  to="/distributorship"
                  className="inline-flex items-center gap-2 bg-white text-navy hover:bg-cyan-100 font-bold px-6 py-3 rounded-lg shadow-md transition-all text-sm"
                >
                  <span>{isHindi ? 'डिस्ट्रीब्यूटर आवेदन फॉर्म भरें' : 'Apply for Distributorship'}</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <img
                src="/assets/distributor-poster-1.jpeg"
                alt="Rajasthan Distributorship Opportunity"
                className="max-h-72 w-auto object-contain rounded-xl shadow-lg border border-cyan-500/40"
              />
            </div>
          </div>
        </div>
      </section>

      {/* H12: Latest News / Events strip */}
      {events.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">
                {isHindi ? 'ताज़ा गतिविधियां' : 'Latest Announcements'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-navy">
                {isHindi ? 'इवेंट्स और समाचार' : 'Events & News'}
              </h2>
            </div>
            <Link to="/events" className="text-xs sm:text-sm font-bold text-cyan-700 hover:underline flex items-center gap-1">
              <span>{t('common.viewAll')}</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((ev) => (
              <div key={ev.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="bg-cyan-50 text-cyan-700 font-semibold px-2 py-0.5 rounded">{ev.category}</span>
                    <span>{ev.event_date}</span>
                  </div>
                  <h3 className="text-base font-bold text-navy">
                    {isHindi ? ev.title_hi : ev.title_en}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                    {isHindi ? ev.excerpt_hi : ev.excerpt_en}
                  </p>
                </div>
                <Link to={`/events/${ev.slug}`} className="text-xs font-bold text-cyan-700 hover:text-cyan-800 flex items-center gap-1 pt-2">
                  <span>{isHindi ? 'पूरा पढ़ें' : 'Read details'}</span>
                  <ChevronRight size={12} />
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* H14: Technical Blog Strip */}
      {blogs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">
                {isHindi ? 'तकनीकी जानकारी' : 'Knowledge Base'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-navy">
                {isHindi ? 'ब्लॉग व गाइड्स' : 'Technical Blog & Insights'}
              </h2>
            </div>
            <Link to="/blog" className="text-xs sm:text-sm font-bold text-cyan-700 hover:underline flex items-center gap-1">
              <span>{t('common.viewAll')}</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogs.map((b) => (
              <div key={b.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[11px] text-cyan-700 font-semibold">{b.reading_time}</span>
                  <h3 className="text-base font-bold text-navy mt-1">
                    {isHindi ? b.title_hi : b.title_en}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                    {isHindi ? b.summary_hi : b.summary_en}
                  </p>
                </div>
                <Link to={`/blog/${b.slug}`} className="text-xs font-bold text-cyan-700 hover:text-cyan-800 flex items-center gap-1 pt-2">
                  <span>{t('common.readMore')}</span>
                  <ChevronRight size={12} />
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* H11: Verified Testimonials */}
      {testimonials.length > 0 && (
        <section className="bg-ice py-16 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">
                {isHindi ? 'संतुष्ट ग्राहक' : 'Verified Reviews'}
              </span>
              <h2 className="text-3xl font-bold text-navy mt-1">
                {isHindi ? 'ग्राहकों का अनुभव' : 'Customer Experiences Across Rajasthan'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((tItem) => (
                <div key={tItem.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                  <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                    "{isHindi ? tItem.review_hi || tItem.review_en : tItem.review_en}"
                  </p>
                  <div className="border-t border-slate-100 pt-3">
                    <span className="block text-sm font-bold text-navy">{tItem.customer_name}</span>
                    <span className="block text-xs text-slate-500">{tItem.customer_city} · {tItem.vehicle_model}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* H15: FAQ Preview */}
      {faqs.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">
              {t('nav.faq')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy mt-1">
              {isHindi ? 'सामान्य प्रश्न व उत्तर' : 'Frequently Asked Questions'}
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <h3 className="text-sm font-bold text-navy flex items-start gap-2">
                  <HelpCircle size={16} className="text-cyan-600 shrink-0 mt-0.5" />
                  <span>{isHindi ? faq.question_hi : faq.question_en}</span>
                </h3>
                <p className="text-xs text-slate-600 mt-2 pl-6 leading-relaxed">
                  {isHindi ? faq.answer_hi : faq.answer_en}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <Link to="/faq" className="text-xs font-bold text-cyan-700 hover:underline">
              {isHindi ? 'सभी प्रश्न व उत्तर देखें →' : 'View all FAQs →'}
            </Link>
          </div>
        </section>
      )}

      {/* H16: Contact Band */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
        <div className="bg-slate-100 rounded-2xl p-6 sm:p-10 border border-slate-300 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-navy">
              {isHindi ? 'कोई सवाल या बल्क ऑर्डर की पूछताछ?' : 'Questions or Ready for a Quote?'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              {isHindi
                ? 'हमारे बीकानेर कार्यालय से सीधे संपर्क करें: +91 74130 59364'
                : 'Direct assistance from Ujjala Electricals Bikaner office: +91 74130 59364'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:+917413059364"
              className="bg-white hover:bg-slate-50 text-navy border border-slate-300 px-5 py-3 rounded-lg font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors shadow-xs"
            >
              <Phone size={16} className="text-cyan-600" />
              <span>+91 74130 59364</span>
            </a>
            <Link
              to="/quote"
              className="bg-navy hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-bold text-xs sm:text-sm transition-colors shadow-md"
            >
              {t('common.requestQuote')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

