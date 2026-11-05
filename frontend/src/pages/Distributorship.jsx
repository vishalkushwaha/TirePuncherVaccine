import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Award, TrendingUp, Users, CheckCircle2, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';

export default function Distributorship() {
  const { t, isHindi } = useLanguage();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    email: '',
    city: '',
    district: '',
    tehsil: '',
    state: 'Rajasthan',
    current_business: '',
    investment_capacity: '₹50,000 - ₹1,00,000',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!form.full_name || !form.phone || !form.city || !form.district) {
      setErrorMsg(isHindi ? 'कृपया नाम, मोबाइल, शहर और जिला अवश्य भरें।' : 'Please fill all required territory and contact fields.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.submitDistributorApp(form);
      navigate(`/thank-you?ref=${res.application_number}&type=distributor`);
    } catch (err) {
      setErrorMsg(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 py-12 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#071A2E] via-[#0B2744] to-[#14365C] text-white rounded-3xl p-8 sm:p-14 border border-cyan-400/30">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-900/60 px-3 py-1 rounded-full border border-cyan-500/40">
            {isHindi ? 'स्वरोजगार का सुनहरा अवसर' : 'Commercial Partnership & Distributorship'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {isHindi ? 'राजस्थान के सभी जिलों व तहसीलों में वितरक बनें' : 'Join Our Pan-Rajasthan Distribution Network'}
          </h1>
          <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
            {isHindi
              ? 'उजाला इलेक्ट्रिकल्स (बीकानेर) आपके जिले और तहसील में Tyre Puncture Vaccine के अधिकृत वितरण हेतु उद्यमियों, वर्कशॉप संचालकों और ऑटोमोबाइल व्यापारियों का स्वागत करता है।'
              : 'Ujjala Electricals (Bikaner) invites energetic entrepreneurs, workshop owners, and tyre distributors across all Rajasthan districts and tehsils.'}
          </p>
        </div>
      </section>

      {/* Why Partner Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <TrendingUp size={28} className="text-cyan-600" />
          <h3 className="font-bold text-navy text-lg">{isHindi ? 'उच्च मांग एवं निरंतर ग्रोथ' : 'Ever-Growing Market Demand'}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {isHindi ? 'हर साल लाखों नए दोपहिया व कमर्शियल वाहन सड़कों पर आते हैं। पंचर सुरक्षा हर गाड़ी वाले की पहली जरूरत है।' : 'With millions of active vehicles and freight fleets on national and state highways, preventive puncture care is a recurring high-margin business.'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <Award size={28} className="text-cyan-600" />
          <h3 className="font-bold text-navy text-lg">{isHindi ? 'मार्केटिंग व तकनीकी सपोर्ट' : 'Full Promotional Collateral'}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {isHindi ? 'उजाला इलेक्ट्रिकल्स द्वारा ब्रोशर, स्टैंडीज, बैनर, डेमो किट और वेबसाइट पर अधिकृत डीलर के रूप में नाम दिया जाता है।' : 'We provide official posters, application syringe kits, technical product certifications, and direct website lead forwarding.'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <MapPin size={28} className="text-cyan-600" />
          <h3 className="font-bold text-navy text-lg">{isHindi ? 'क्षेत्रीय प्राथमिकता' : 'Territory Protection'}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {isHindi ? 'स्वीकृत तहसील या जिले में आपके साथ मिलकर नेटवर्क मजबूत किया जाता है ताकि आपका व्यापार सुरक्षित रहे।' : 'Assigned territories enjoy dedicated lead dispatch and distributor supply security from our central Bikaner depot.'}
          </p>
        </div>
      </section>

      {/* Application Form */}
      <section className="bg-slate-50 p-6 sm:p-12 rounded-3xl border border-slate-200 shadow-md">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy">
              {t('distributor.formTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {isHindi
                ? 'नीचे दिए गए विवरण भरें। हमारी पार्टनरशिप टीम 24 से 48 घंटे में आपसे संपर्क करेगी।'
                : 'Please complete the application. Our Bikaner management evaluates each territory application individually.'}
            </p>
          </div>

          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-xl">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  {isHindi ? 'आवेदक का पूरा नाम *' : 'Applicant Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={form.full_name}
                  onChange={e => setForm({ ...form, full_name: e.target.value })}
                  placeholder={isHindi ? "उदा. सुरेंद्र सिंह" : "e.g. Surendra Singh"}
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  {isHindi ? 'मोबाइल नंबर (कॉल व व्हाट्सएप) *' : 'Mobile Phone (Call & WhatsApp) *'}
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 74130 59364"
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  {isHindi ? 'ईमेल पता' : 'Email Address'}
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="name@gmail.com"
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
                  value={form.city}
                  onChange={e => setForm({ ...form, city: e.target.value })}
                  placeholder={isHindi ? "उदा. बीकानेर" : "e.g. Bikaner, Nagaur"}
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  {isHindi ? 'वांछित जिला *' : 'Target District *'}
                </label>
                <input
                  type="text"
                  required
                  value={form.district}
                  onChange={e => setForm({ ...form, district: e.target.value })}
                  placeholder={isHindi ? "उदा. बीकानेर, जोधपुर, जयपुर" : "e.g. Bikaner, Jodhpur, Jaipur"}
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  {isHindi ? 'तहसील / क्षेत्र' : 'Tehsil / Local Block'}
                </label>
                <input
                  type="text"
                  value={form.tehsil}
                  onChange={e => setForm({ ...form, tehsil: e.target.value })}
                  placeholder={isHindi ? "उदा. नोखा, लूणकरणसर" : "e.g. Nokha, Lunkaransar"}
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  {isHindi ? 'वर्तमान व्यवसाय / कार्य' : 'Current Business or Occupation'}
                </label>
                <input
                  type="text"
                  value={form.current_business}
                  onChange={e => setForm({ ...form, current_business: e.target.value })}
                  placeholder={isHindi ? "उदा. ऑटो पार्ट्स, वर्कशॉप, फ्लीट सप्लायर" : "e.g. Tyre shop, auto parts, workshop, transport"}
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  {isHindi ? 'प्रारंभिक निवेश क्षमता' : 'Initial Investment Budget'}
                </label>
                <select
                  value={form.investment_capacity}
                  onChange={e => setForm({ ...form, investment_capacity: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-hidden bg-white"
                >
                  <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000 (Starting Tehsil Stock)</option>
                  <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000 (Standard District Partner)</option>
                  <option value="₹1,00,000 - ₹2,50,000">₹1,00,000 - ₹2,50,000 (Regional Hub)</option>
                  <option value="₹2,50,000+">₹2,50,000+ (Super Stockist)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                {isHindi ? 'व्यापारिक अनुभव या अतिरिक्त संदेश' : 'Business Experience or Territory Plan'}
              </label>
              <textarea
                rows={3}
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                placeholder={isHindi ? "अपने अनुभव और वितरण योजना के बारे में संक्षेप में लिखें..." : "Describe your existing network, workshop connections..."}
                className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-navy hover:bg-cyan-700 text-white font-bold py-3.5 rounded-lg text-sm shadow-md transition-all disabled:opacity-50"
            >
              {submitting ? t('common.submitting') : (isHindi ? 'आवेदन जमा करें' : 'Submit Application')}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

