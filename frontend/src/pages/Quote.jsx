import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Building2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
  RotateCcw,
  Truck,
  Sparkles,
  PackageCheck,
  Check,
  FileText
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { getContrastTextColor } from '../utils/productThemes';
import { api } from '../services/api';

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    code: 'gulf',
    name_en: 'Tyre Puncture Vaccine Gulf',
    name_hi: 'टायर पंक्चर वैक्सीन गल्फ',
    tagline_en: 'For City & Highway Tubeless Vehicles',
    tagline_hi: 'शहर व हाईवे ट्यूबलेस वाहनों के लिए',
    mrp: 999,
    tyre_type: 'Tubeless Tyres Only',
    warranty_months: 9,
    image_url: '/assets/gulf-poster.jpeg'
  },
  {
    id: 2,
    code: 'rock',
    name_en: 'Tyre Puncture Vaccine Rock',
    name_hi: 'टायर पंक्चर वैक्सीन रॉक',
    tagline_en: 'All-Terrain Protection for Tube & Tubeless Tyres',
    tagline_hi: 'ट्यूब व ट्यूबलेस दोनों टायरों के लिए ऑल-राउंडर सुरक्षा',
    mrp: 1199,
    tyre_type: 'Tube & Tubeless Tyres',
    warranty_months: 12,
    image_url: '/assets/rock-poster.jpeg'
  },
  {
    id: 3,
    code: 'thor',
    name_en: 'Tyre Puncture Vaccine Thor',
    name_hi: 'टायर पंक्चर वैक्सीन थॉर',
    tagline_en: 'Heavy Commercial, Bus, Truck & Mining Grade',
    tagline_hi: 'भारी वाणिज्यिक, बस, ट्रक और खनन ग्रेड सीलेंट',
    mrp: 1499,
    tyre_type: 'Commercial Bus & Heavy Trucks',
    warranty_months: 12,
    image_url: '/assets/thor-poster.jpeg'
  }
];

export default function Quote() {
  const { t, isHindi } = useLanguage();
  const { getTheme } = useTheme();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const paramProduct = searchParams.get('product');
  const paramQty = parseInt(searchParams.get('quantity') || '1', 10);
  const initialVehicle = searchParams.get('vehicle') || '';
  const initialType = (searchParams.get('type') === 'bulk' || paramQty >= 10) ? 'bulk' : 'retail';

  const [activeTab, setActiveTab] = useState(initialType);
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Keep activeTab in sync with URL searchParams if URL changes
  useEffect(() => {
    const tab = searchParams.get('type');
    const qty = parseInt(searchParams.get('quantity') || '0', 10);
    if (tab === 'bulk' || qty >= 10) setActiveTab('bulk');
    else if (tab === 'retail') setActiveTab('retail');
  }, [searchParams]);

  // Retail Form State (Retains existing design & layout)
  const [retailForm, setRetailForm] = useState({
    full_name: '',
    phone: '',
    city: '',
    product_code: paramProduct || 'rock',
    quantity: paramQty,
    vehicle_type: initialVehicle,
    message: ''
  });

  // Bulk Multi-Product Quantities
  // If specific product in param, default to that product, otherwise default to 4 Gulf, 3 Rock, 3 Thor (10 total MOQ)
  const [bulkQuantities, setBulkQuantities] = useState(() => {
    if (paramProduct === 'gulf') return { gulf: Math.max(10, paramQty), rock: 0, thor: 0 };
    if (paramProduct === 'rock') return { gulf: 0, rock: Math.max(10, paramQty), thor: 0 };
    if (paramProduct === 'thor') return { gulf: 0, rock: 0, thor: Math.max(10, paramQty) };
    return { gulf: 4, rock: 3, thor: 3 };
  });

  // Bulk Customer Form State
  const [bulkForm, setBulkForm] = useState({
    business_name: '',
    contact_person: '',
    phone: '',
    email: '',
    city: '',
    district: '',
    state: 'Rajasthan',
    gst_number: '',
    message: ''
  });

  useEffect(() => {
    api.getProducts().then(prods => {
      if (prods && prods.length > 0) setProducts(prods);
    }).catch(() => {});
  }, []);

  // Update quantity for a specific product code
  const updateQty = (code, delta) => {
    setBulkQuantities(prev => {
      const current = prev[code] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [code]: next };
    });
  };

  const setQtyDirect = (code, val) => {
    const num = Math.max(0, parseInt(val, 10) || 0);
    setBulkQuantities(prev => ({ ...prev, [code]: num }));
  };

  const resetAllQuantities = () => {
    setBulkQuantities({ gulf: 0, rock: 0, thor: 0 });
  };

  const setPreset10Mixed = () => {
    setBulkQuantities({ gulf: 4, rock: 3, thor: 3 });
  };

  const setPresetFullCartonEach = () => {
    setBulkQuantities({ gulf: 12, rock: 12, thor: 12 });
  };

  // Calculations for Bulk Orders
  const totalBottles = (bulkQuantities.gulf || 0) + (bulkQuantities.rock || 0) + (bulkQuantities.thor || 0);
  const isMoqSatisfied = totalBottles >= 10;
  const remainingForMoq = Math.max(0, 10 - totalBottles);

  // Generate Itemized Selection for backend/admin quotation processing
  const orderItems = products.map(prod => {
    const qty = bulkQuantities[prod.code] || 0;
    const mrp = prod.mrp || 999;
    const discountRate = totalBottles >= 60 ? 0.35 : totalBottles >= 25 ? 0.30 : 0.25;
    const wholesaleRate = Math.round(mrp * (1 - discountRate));
    const lineTotal = qty * wholesaleRate;
    const lineMrpTotal = qty * mrp;
    return {
      product_id: prod.id,
      code: prod.code,
      name_en: prod.name_en,
      name_hi: prod.name_hi,
      mrp,
      wholesaleRate,
      qty,
      lineTotal,
      lineMrpTotal,
      savings: lineMrpTotal - lineTotal,
      tyre_type: prod.tyre_type,
      warranty_months: prod.warranty_months,
      image_url: prod.image_url
    };
  });

  const selectedItems = orderItems.filter(item => item.qty > 0);
  const subtotalMrp = orderItems.reduce((acc, item) => acc + item.lineMrpTotal, 0);
  const estimatedTotal = orderItems.reduce((acc, item) => acc + item.lineTotal, 0);
  const totalSavings = subtotalMrp - estimatedTotal;

  // Selected products summary string
  const summaryDetails = selectedItems
    .map(i => `${i.code.toUpperCase()}: ${i.qty}`)
    .join(', ');
  const estimatedQuantityFormatted = `${totalBottles} Bottles (${summaryDetails || 'None'})`;

  // Submit Retail Handler
  const handleRetailSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!retailForm.full_name || !retailForm.phone || !retailForm.city) {
      setErrorMsg(isHindi ? 'कृपया नाम, मोबाइल नंबर और शहर अवश्य भरें।' : 'Please provide your name, phone number, and city.');
      return;
    }
    setSubmitting(true);
    try {
      const selectedP = products.find(p => p.code === retailForm.product_code);
      const res = await api.submitRetailQuote({
        ...retailForm,
        product_name: selectedP ? selectedP.name_en : retailForm.product_code.toUpperCase()
      });
      navigate(`/thank-you?ref=${res.quote_number}&type=retail`);
    } catch (err) {
      setErrorMsg(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Bulk Handler (Sends to admin without showing pricing to customer)
  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (totalBottles < 10) {
      setErrorMsg(
        isHindi
          ? `थोक कोटेशन के लिए न्यूनतम 10 बोतलों का संयुक्त चयन अनिवार्य है। कृपया ${remainingForMoq} और बोतल(एं) जोड़ें।`
          : `Minimum Wholesale Order Quantity is 10 bottles combined across products. Please add ${remainingForMoq} more bottle(s).`
      );
      return;
    }

    if (!bulkForm.business_name || !bulkForm.contact_person || !bulkForm.phone || !bulkForm.city) {
      setErrorMsg(isHindi ? 'कृपया फर्म का नाम, संपर्क व्यक्ति, मोबाइल और शहर अवश्य भरें।' : 'Please fill all required business and contact fields.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        business_name: bulkForm.business_name,
        contact_person: bulkForm.contact_person,
        phone: bulkForm.phone,
        email: bulkForm.email || null,
        city: bulkForm.city,
        district: bulkForm.district || null,
        state: bulkForm.state || 'Rajasthan',
        product_code: selectedItems.map(i => i.code).join(','),
        estimated_quantity: estimatedQuantityFormatted,
        items_json: JSON.stringify(selectedItems),
        total_bottles: totalBottles,
        estimated_subtotal: subtotalMrp,
        estimated_discount: totalSavings,
        estimated_total: estimatedTotal,
        gst_number: bulkForm.gst_number || null,
        message: bulkForm.message || null
      };

      const res = await api.submitBulkQuote(payload);
      navigate(`/thank-you?ref=${res.quote_number}&type=bulk`);
    } catch (err) {
      setErrorMsg(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-10 py-10 max-w-6xl mx-auto px-4 sm:px-6">
      {/* Page Title Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-3.5 py-1 rounded-full border border-cyan-100">
          {isHindi ? 'कोटेशन अनुरोध प्रणाली' : 'Official Pricing & Quotation System'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy">
          {isHindi ? 'कोटेशन प्राप्त करें — खुदरा या थोक' : 'Request Quotation · Retail & Wholesale'}
        </h1>
        <p className="text-slate-600 text-sm max-w-2xl mx-auto">
          {isHindi
            ? 'अपनी आवश्यकतानुसार खुदरा या बहु-उत्पाद थोक कोटेशन प्राप्त करें। हमारी बीकानेर केंद्रीय टीम शीघ्र ही आपूर्ति व विशेष दरों के साथ संपर्क करेगी।'
            : 'Select individual retail bottles or configure a custom mixed-product wholesale shipment. Our Bikaner headquarters provides prompt dispatched delivery.'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('retail')}
          className={`flex-1 py-4 text-center font-bold text-sm sm:text-base border-b-2 flex items-center justify-center gap-2 transition-all ${
            activeTab === 'retail'
              ? 'border-cyan-600 text-navy bg-cyan-50/50'
              : 'border-transparent text-slate-500 hover:text-navy hover:bg-slate-50'
          }`}
        >
          <ShoppingBag size={18} className={activeTab === 'retail' ? 'text-cyan-600' : ''} />
          <span>{t('common.retailQuote')} (1-4 {isHindi ? 'बोतल' : 'Bottles'})</span>
        </button>

        <button
          onClick={() => setActiveTab('bulk')}
          className={`flex-1 py-4 text-center font-bold text-sm sm:text-base border-b-2 flex items-center justify-center gap-2 transition-all ${
            activeTab === 'bulk'
              ? 'border-cyan-600 text-navy bg-cyan-50/50'
              : 'border-transparent text-slate-500 hover:text-navy hover:bg-slate-50'
          }`}
        >
          <Building2 size={18} className={activeTab === 'bulk' ? 'text-cyan-600' : ''} />
          <span>{isHindi ? 'थोक व फ्लीट मिक्स ऑर्डर (10+ बोतल)' : 'Wholesale & Fleet Mixed Order (10+ Bottles)'}</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-xl flex items-center gap-2">
          <AlertCircle size={18} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* RETAIL TAB (Maintains original layout, design & pricing functionality) */}
      {activeTab === 'retail' && (
        <form onSubmit={handleRetailSubmit} className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-md space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-navy">
              {isHindi ? 'व्यक्तिगत / खुदरा ग्राहक कोटेशन' : 'Retail Customer Inquiry'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isHindi ? 'अपने व्यक्तिगत वाहन के लिए 1 से 4 बोतलें मंगवाएं' : 'For personal car, bike, SUV, tractor or tempo owners'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                {isHindi ? 'आपका पूरा नाम *' : 'Full Name *'}
              </label>
              <input
                type="text"
                required
                value={retailForm.full_name}
                onChange={e => setRetailForm({ ...retailForm, full_name: e.target.value })}
                placeholder={isHindi ? "उदा. रमेश चौधरी" : "e.g. Rahul Sharma"}
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                {isHindi ? 'मोबाइल नंबर *' : 'Mobile Phone *'}
              </label>
              <input
                type="tel"
                required
                value={retailForm.phone}
                onChange={e => setRetailForm({ ...retailForm, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                {isHindi ? 'शहर / कस्बा *' : 'City / Town *'}
              </label>
              <input
                type="text"
                required
                value={retailForm.city}
                onChange={e => setRetailForm({ ...retailForm, city: e.target.value })}
                placeholder={isHindi ? "उदा. बीकानेर, जयपुर" : "e.g. Bikaner, Jaipur"}
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                {isHindi ? 'वाहन का प्रकार / मॉडल' : 'Vehicle Make & Model'}
              </label>
              <input
                type="text"
                value={retailForm.vehicle_type}
                onChange={e => setRetailForm({ ...retailForm, vehicle_type: e.target.value })}
                placeholder={isHindi ? "उदा. स्कॉर्पियो, स्विफ्ट, पल्सर" : "e.g. Scorpio, Swift, Pulsar"}
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                {isHindi ? 'चयनित प्रोडक्ट' : 'Product Selection'}
              </label>
              <select
                value={retailForm.product_code}
                onChange={e => setRetailForm({ ...retailForm, product_code: e.target.value })}
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-hidden bg-white"
              >
                {products.map(p => (
                  <option key={p.code} value={p.code}>
                    {isHindi ? p.name_hi : p.name_en} — ₹{p.mrp} ({p.warranty_months} mo warranty)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                {isHindi ? 'बोतलों की संख्या' : 'Quantity (1L Bottles)'}
              </label>
              <select
                value={retailForm.quantity}
                onChange={e => setRetailForm({ ...retailForm, quantity: parseInt(e.target.value, 10) })}
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-hidden bg-white"
              >
                {[1, 2, 3, 4, 5, 6, 8, 10].map(q => (
                  <option key={q} value={q}>{q} {isHindi ? 'बोतल' : 'Bottle(s)'}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              {isHindi ? 'अतिरिक्त संदेश (वैकल्पिक)' : 'Additional Message or Specific Tyre Size (Optional)'}
            </label>
            <textarea
              rows={3}
              value={retailForm.message}
              onChange={e => setRetailForm({ ...retailForm, message: e.target.value })}
              placeholder={isHindi ? "कोई विशिष्ट आवश्यकता या प्रश्न लिखें..." : "Mention tyre size or specific questions..."}
              className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto font-bold px-8 py-3.5 rounded-lg text-sm shadow-md transition-all disabled:opacity-50"
            style={{
              backgroundColor: getTheme(retailForm.product_code).btnPrimary,
              color: getContrastTextColor(getTheme(retailForm.product_code).btnPrimary)
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = getTheme(retailForm.product_code).btnHover;
              e.currentTarget.style.color = getContrastTextColor(getTheme(retailForm.product_code).btnHover);
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = getTheme(retailForm.product_code).btnPrimary;
              e.currentTarget.style.color = getContrastTextColor(getTheme(retailForm.product_code).btnPrimary);
            }}
          >
            {submitting ? t('common.submitting') : t('common.submit')}
          </button>
        </form>
      )}

      {/* WHOLESALE TAB (Prices & discounts removed from customer view) */}
      {activeTab === 'bulk' && (
        <div className="space-y-10">
          {/* Section 1: Instructions & MOQ Banner */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <PackageCheck className="text-cyan-700" size={22} />
                  <h2 className="text-xl sm:text-2xl font-extrabold text-navy">
                    {isHindi ? 'थोक बहु-उत्पाद ऑर्डर चयन' : 'Multi-Product Wholesale Ordering'}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {isHindi
                    ? 'सभी तीनों उत्पादों (गल्फ, रॉक, थॉर) का अपनी इच्छानुसार मिश्रण बनाएं। कुल मिलाकर न्यूनतम 10 बोतलें आवश्यक हैं।'
                    : 'Mix and match any combination of Gulf, Rock, and Thor. Minimum Order Quantity (MOQ) is 10 bottles combined across all three products.'}
                </p>
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase text-slate-400">
                  {isHindi ? 'त्वरित चयन:' : 'Quick Presets:'}
                </span>
                <button
                  type="button"
                  onClick={setPreset10Mixed}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg border border-cyan-300 bg-cyan-50 text-cyan-800 hover:bg-cyan-100 transition-colors"
                >
                  {isHindi ? '10 बोतल मिक्स (4+3+3)' : '10 Mixed (4+3+3)'}
                </button>
                <button
                  type="button"
                  onClick={setPresetFullCartonEach}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-800 hover:bg-indigo-100 transition-colors"
                >
                  {isHindi ? '3 कार्टन (36 बोतल)' : '3 Cartons (36 Bottles)'}
                </button>
                <button
                  type="button"
                  onClick={resetAllQuantities}
                  className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors flex items-center gap-1"
                  title="Reset all"
                >
                  <RotateCcw size={12} />
                  <span>{isHindi ? 'रीसेट' : 'Reset'}</span>
                </button>
              </div>
            </div>

            {/* Combined MOQ Status Banner (No discount badges or percentages) */}
            <div className={`p-4 rounded-xl border transition-all ${
              isMoqSatisfied
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-3">
                  {isMoqSatisfied ? (
                    <CheckCircle2 size={24} className="text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
                  ) : (
                    <AlertCircle size={24} className="text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
                  )}
                  <div>
                    <div className="font-extrabold text-sm sm:text-base flex items-center gap-2">
                      <span>
                        {isHindi
                          ? `कुल चयनित मात्रा: ${totalBottles} बोतलें (न्यूनतम 10 बोतलें)`
                          : `Combined Selection: ${totalBottles} / 10 Bottles Minimum MOQ`}
                      </span>
                      {isMoqSatisfied && (
                        <span className="text-[11px] uppercase font-bold bg-emerald-600 text-white px-2.5 py-0.5 rounded-full">
                          {isHindi ? 'न्यूनतम मात्रा संतुष्ट' : 'MOQ Qualified'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs mt-0.5">
                      {isMoqSatisfied
                        ? (isHindi
                            ? 'थोक कोटेशन के लिए न्यूनतम 10 बोतलों की आवश्यकता पूरी हो गई है। आप नीचे अपना विवरण भरकर कोटेशन अनुरोध भेज सकते हैं।'
                            : 'Wholesale minimum order requirement satisfied. Submit your details below to receive customized wholesale pricing.')
                        : (isHindi
                            ? `थोक कोटेशन अनुरोध के लिए कम से कम 10 बोतलें (संयुक्त) चुनना अनिवार्य है। कृपया किसी भी उत्पाद में से ${remainingForMoq} और बोतल(एं) जोड़ें।`
                            : `Wholesale quotation requires at least 10 bottles combined across any products. Please add ${remainingForMoq} more bottle(s).`)}
                    </p>
                  </div>
                </div>

                {/* Progress Meter */}
                <div className="w-full sm:w-48 shrink-0 space-y-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span>{isHindi ? 'प्रगति' : 'MOQ Progress'}</span>
                    <span>{Math.min(100, Math.round((totalBottles / 10) * 100))}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isMoqSatisfied ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, (totalBottles / 10) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Display All Three Products with Theming (No Prices or Discounts) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map(prod => {
              const theme = getTheme(prod.code);
              const qty = bulkQuantities[prod.code] || 0;

              return (
                <div
                  key={prod.code}
                  className="bg-white rounded-2xl border-2 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                  style={{
                    borderColor: qty > 0 ? theme.primary : '#E2E8F0'
                  }}
                >
                  {/* Product Header Banner */}
                  <div
                    className="py-3 px-4 text-xs font-bold flex items-center justify-between"
                    style={{
                      backgroundColor: theme.primary,
                      color: getContrastTextColor(theme.primary)
                    }}
                  >
                    <span className="uppercase tracking-wider">{prod.code} Edition</span>
                    <span
                      className="px-2 py-0.5 rounded text-[11px] font-bold"
                      style={{
                        backgroundColor: theme.secondary,
                        color: getContrastTextColor(theme.secondary)
                      }}
                    >
                      {prod.warranty_months} {isHindi ? 'माह वारंटी' : 'Mo Warranty'}
                    </span>
                  </div>

                  {/* Poster Image */}
                  <div
                    className="relative aspect-4/3 p-4 flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: theme.bgLight }}
                  >
                    <img
                      src={prod.image_url || '/assets/logo.png'}
                      alt={prod.name_en}
                      className="h-full w-auto object-contain transition-transform duration-300 hover:scale-105 drop-shadow-sm"
                    />
                    {qty > 0 && (
                      <div
                        className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-extrabold shadow-md flex items-center gap-1"
                        style={{
                          backgroundColor: theme.primary,
                          color: getContrastTextColor(theme.primary)
                        }}
                      >
                        <Check size={12} />
                        <span>{qty} {isHindi ? 'चयनित' : 'selected'}</span>
                      </div>
                    )}
                  </div>

                  {/* Content Details (Product info & tyre type, without retail MRP / wholesale rate) */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-extrabold text-base text-navy">
                        {isHindi ? prod.name_hi : prod.name_en}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {isHindi ? prod.tagline_hi : prod.tagline_en}
                      </p>
                      <div className="text-[11px] font-semibold text-slate-700 mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.primary }} />
                        <span>{prod.tyre_type}</span>
                      </div>
                    </div>

                    {/* Quantity Stepper Controls */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 uppercase">
                          {isHindi ? 'मात्रा (1L बोतलें):' : 'Quantity (1L Bottles):'}
                        </span>
                        {qty > 0 && (
                          <span className="text-xs font-extrabold text-cyan-800">
                            {qty} {isHindi ? 'बोतल' : 'Bottle(s)'}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQty(prod.code, -1)}
                          disabled={qty <= 0}
                          className="w-10 h-10 rounded-lg border border-slate-300 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={qty}
                          onChange={e => setQtyDirect(prod.code, e.target.value)}
                          className="flex-1 h-10 text-center font-bold text-navy text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-hidden"
                        />
                        <button
                          type="button"
                          onClick={() => updateQty(prod.code, 1)}
                          className="w-10 h-10 rounded-lg border border-slate-300 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Quick Add Chips */}
                      <div className="flex items-center gap-1.5 pt-1">
                        {[2, 5, 10].map(addN => (
                          <button
                            key={addN}
                            type="button"
                            onClick={() => updateQty(prod.code, addN)}
                            className="flex-1 py-1 text-[11px] font-bold rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                          >
                            +{addN}
                          </button>
                        ))}
                        {qty > 0 && (
                          <button
                            type="button"
                            onClick={() => setQtyDirect(prod.code, 0)}
                            className="px-2 py-1 text-[11px] font-bold rounded-md text-red-600 hover:bg-red-50 transition-colors"
                            title="Clear"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section 3: Selected Products & Order Summary (Without Price or Discount Displays) */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md space-y-6">
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-extrabold text-navy flex items-center gap-2">
                  <FileText size={20} className="text-cyan-600" />
                  <span>{isHindi ? 'चयनित उत्पाद व ऑर्डर सारांश' : 'Selected Products & Order Summary'}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isHindi
                    ? 'कोटेशन अनुरोध भेजने से पहले अपनी चयनित उत्पाद सूची व मात्रा की समीक्षा करें'
                    : 'Review your configured products and bottle quantities before submitting for quotation'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">{isHindi ? 'संयुक्त कुल मात्रा:' : 'Total Selection:'}</span>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-cyan-50 border border-cyan-200 text-cyan-900">
                  {totalBottles} {isHindi ? 'बोतलें' : 'Bottles'}
                </span>
              </div>
            </div>

            {/* Selected Items Table (Only Product, Specification & Quantity - NO PRICES) */}
            {selectedItems.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                {isHindi ? 'कृपया ऊपर दिए गए उत्पादों में से मात्रा चुनें।' : 'No products selected yet. Use the quantity selectors above to configure your order.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                      <th className="py-2.5">{isHindi ? 'उत्पाद' : 'Product'}</th>
                      <th className="py-2.5">{isHindi ? 'टायर का प्रकार / विशिष्टता' : 'Specification / Vehicle Application'}</th>
                      <th className="py-2.5 text-right">{isHindi ? 'मात्रा (1L बोतलें)' : 'Quantity (1L Bottles)'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedItems.map(item => (
                      <tr key={item.code} className="hover:bg-slate-50/60">
                        <td className="py-3 font-bold text-navy flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: getTheme(item.code).primary }}
                          />
                          <span>{isHindi ? item.name_hi : item.name_en}</span>
                          <span className="text-[10px] font-mono text-slate-400 uppercase">({item.code})</span>
                        </td>
                        <td className="py-3 text-slate-600 font-medium">
                          {item.tyre_type}
                        </td>
                        <td className="py-3 text-right font-extrabold text-navy">
                          {item.qty} {isHindi ? 'बोतल' : 'Bottle(s)'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Wholesale Quotation Process Notice Box */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  {isHindi ? 'कुल थोक ऑर्डर मात्रा:' : 'Combined Wholesale Order Volume:'}
                </span>
                <span className="text-lg font-black text-navy text-cyan-800">
                  {totalBottles} {isHindi ? 'बोतलें' : 'Bottles Total'}
                  {isMoqSatisfied && (
                    <span className="ml-2 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {isHindi ? 'MOQ संतुष्ट' : 'MOQ Qualified'}
                    </span>
                  )}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pt-1">
                {isHindi
                  ? 'विशेष थोक कोटेशन सूचना: आधिकारिक थोक दरें, विशेष वॉल्यूम छूट और बीकानेर केंद्रीय गोदाम से परिवहन भाड़ा हमारे बिक्री विभाग द्वारा आपके ऑर्डर की समीक्षा के बाद सीधे कोटेशन में प्रदान किए जाएंगे।'
                  : 'Notice: Final wholesale pricing, applicable volume benefits, and dispatched freight from Bikaner central warehouse will be officially calculated and shared by our sales team upon reviewing your inquiry.'}
              </p>
            </div>
          </div>

          {/* Section 4: Customer Contact & Dispatch Information */}
          <form onSubmit={handleBulkSubmit} className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-md space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold text-navy">
                {isHindi ? 'व्यावसायिक व संपर्क विवरण' : 'Commercial & Contact Information'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isHindi
                  ? 'आधिकारिक कोटेशन व डिस्पैच दस्तावेज़ तैयार करने के लिए कृपया फर्म का विवरण भरें'
                  : 'Please provide your registered business and contact details for quotation preparation'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  {isHindi ? 'फर्म / व्यापार का नाम *' : 'Business / Firm Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={bulkForm.business_name}
                  onChange={e => setBulkForm({ ...bulkForm, business_name: e.target.value })}
                  placeholder={isHindi ? "उदा. मारवाड़ लॉजिस्टिक्स प्राइवेट लिमिटेड" : "e.g. Marwar Logistics & Freight"}
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  {isHindi ? 'संपर्क व्यक्ति का नाम *' : 'Contact Person *'}
                </label>
                <input
                  type="text"
                  required
                  value={bulkForm.contact_person}
                  onChange={e => setBulkForm({ ...bulkForm, contact_person: e.target.value })}
                  placeholder={isHindi ? "उदा. मुकेश शर्मा (प्रबंधक)" : "e.g. Mukesh Sharma"}
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  {isHindi ? 'मोबाइल नंबर *' : 'Mobile Phone *'}
                </label>
                <input
                  type="tel"
                  required
                  value={bulkForm.phone}
                  onChange={e => setBulkForm({ ...bulkForm, phone: e.target.value })}
                  placeholder="+91 74130 59364"
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  {isHindi ? 'ईमेल पता' : 'Business Email'}
                </label>
                <input
                  type="email"
                  value={bulkForm.email}
                  onChange={e => setBulkForm({ ...bulkForm, email: e.target.value })}
                  placeholder="contact@business.com"
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  {isHindi ? 'शहर / स्थान *' : 'City / Town *'}
                </label>
                <input
                  type="text"
                  required
                  value={bulkForm.city}
                  onChange={e => setBulkForm({ ...bulkForm, city: e.target.value })}
                  placeholder="Bikaner"
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  {isHindi ? 'जिला व राज्य' : 'District & State'}
                </label>
                <input
                  type="text"
                  value={bulkForm.state}
                  onChange={e => setBulkForm({ ...bulkForm, state: e.target.value })}
                  placeholder="Rajasthan"
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  {isHindi ? 'जीएसटी नंबर (यदि लागू हो)' : 'GSTIN Number (Optional for Tax Invoice)'}
                </label>
                <input
                  type="text"
                  value={bulkForm.gst_number}
                  onChange={e => setBulkForm({ ...bulkForm, gst_number: e.target.value })}
                  placeholder="08AAAAA0000A1Z5"
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-hidden uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                {isHindi ? 'विशेष आवश्यकताएं, फ्लीट विवरण या डिलीवरी निर्देश' : 'Special Order Requirements, Fleet Details & Destination Instructions'}
              </label>
              <textarea
                rows={3}
                value={bulkForm.message}
                onChange={e => setBulkForm({ ...bulkForm, message: e.target.value })}
                placeholder={isHindi ? "गाड़ियों की संख्या, रूट, डिलीवरी समय-सीमा या विशेष निर्देश..." : "Specify fleet vehicle count, specific tyre sizes, delivery schedule or freight requirements..."}
                className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-hidden"
              />
            </div>

            {/* Submission Area */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                {isMoqSatisfied ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 size={16} />
                    {isHindi
                      ? `संयुक्त न्यूनतम मात्रा संतुष्ट (${totalBottles} बोतलें)`
                      : `Combined minimum quantity met (${totalBottles} bottles)`}
                  </span>
                ) : (
                  <span className="text-amber-700 font-semibold flex items-center gap-1.5">
                    <AlertCircle size={16} />
                    {isHindi
                      ? `कृपया कोटेशन प्राप्त करने से पहले कम से कम ${remainingForMoq} और बोतल(एं) जोड़ें`
                      : `Please add at least ${remainingForMoq} more bottle(s) to get quote`}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting || !isMoqSatisfied}
                className="w-full sm:w-auto font-bold px-8 py-3.5 rounded-lg text-sm shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-navy hover:bg-cyan-700 text-white flex items-center justify-center gap-2"
              >
                <Truck size={18} />
                <span>
                  {submitting
                    ? (isHindi ? 'सबमिट हो रहा है...' : 'Submitting Request...')
                    : (isHindi ? 'कोटेशन प्राप्त करें (Get Quote)' : 'Get Wholesale Quote')}
                </span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
