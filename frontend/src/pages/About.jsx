import React from 'react';
import { ShieldCheck, Award, Factory, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

export default function About() {
  const { isHindi } = useLanguage();

  return (
    <div className="space-y-16 py-12">
      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-navy text-white rounded-3xl p-8 sm:p-14 border border-cyan-500/30 relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-900/60 px-3 py-1 rounded-full border border-cyan-500/40">
              {isHindi ? 'उजाला इलेक्ट्रिकल्स · स्थापना 2017' : 'Ujjala Electricals · Established 2017'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              {isHindi ? 'टायर सुरक्षा में अग्रणी — बीकानेर से पूरे भारत तक' : 'Pioneering Preventive Tyre Solutions'}
            </h1>
            <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
              {isHindi
                ? 'उजाला इलेक्ट्रिकल्स 2017 से बीकानेर (राजस्थान) में स्थापित है। हमारा प्रमुख ब्रांड Tyre Puncture Vaccine भारतीय सड़कों की कठोर परिस्थितियों में सुरक्षित और पंचर-मुक्त यात्रा प्रदान करने के लिए प्रतिबद्ध है।'
                : 'Trading since 2017 from Rani Bazar Industrial Area, Bikaner (Rajasthan), Ujjala Electricals has formulated Tyre Puncture Vaccine to eliminate highway breakdowns, extend tyre life, and deliver absolute reliability.'}
            </p>
          </div>
        </div>
      </section>

      {/* Story & Factory Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">
              {isHindi ? 'हमारा इतिहास व दृष्टिकोण' : 'Our Legacy & Vision'}
            </span>
            <h2 className="text-3xl font-bold text-navy">
              {isHindi ? 'भारतीय सड़कों की हर चुनौती का वैज्ञानिक समाधान' : 'Engineered for India\'s Demanding Road Conditions'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {isHindi
                ? 'भारतीय सड़कों पर कटीली कीलें, अत्यधिक गर्मी (50°C से अधिक) और ग्रामीण उबड़-खाबड़ रास्ते आम बात हैं। साधारण सीलेंट या तो सूख जाते हैं या रिम में जंग लगा देते हैं। Tyre Puncture Vaccine को विशेष पॉलीमर, नेचुरल रबर और माइक्रोफाइबर से तैयार किया गया है जो बिना सूखे और बिना रिम को नुकसान पहुंचाए लगातार काम करता है।'
                : 'Extreme ambient heat, uneven highway expansion joints, and road debris cause frequent commercial tyre downtime. Tyre Puncture Vaccine integrates high-density microfiber compounds and corrosion inhibitors that remain liquid, chemically stable, and active from -30°C to +60°C.'}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <Clock className="text-cyan-600 mb-2" size={24} />
                <h4 className="font-bold text-navy text-sm">2017</h4>
                <p className="text-xs text-slate-500 mt-1">{isHindi ? 'बाज़ार में निरंतर कार्यरत' : 'In the market since 2017'}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <MapPin className="text-cyan-600 mb-2" size={24} />
                <h4 className="font-bold text-navy text-sm">Bikaner, RJ</h4>
                <p className="text-xs text-slate-500 mt-1">{isHindi ? 'मुख्यालय एवं निर्माण' : 'HQ & Distribution Depot'}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex justify-center">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xl max-w-md">
              <img
                src="/assets/distributor-poster-2.jpeg"
                alt="Tyre Puncture Vaccine Field Demonstrations"
                className="w-full h-auto rounded-xl object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Four Pillars */}
      <section className="bg-ice py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-navy">
              {isHindi ? 'हमारे 4 मूल सिद्धांत' : 'Our Core Commitments'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <ShieldCheck size={28} className="text-cyan-600" />
              <h3 className="font-bold text-navy text-base">{isHindi ? '100% सुरक्षा' : '100% Protection'}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isHindi ? 'ट्रेड एरिया में 4 मिमी तक के पंचर को घुसते ही तुरंत और हमेशा के लिए सील करता है।' : 'Instantly seals punctures up to 4mm in diameter the millisecond a nail penetrates.'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <Award size={28} className="text-cyan-600" />
              <h3 className="font-bold text-navy text-base">{isHindi ? 'गारंटीड वारंटी' : 'Guaranteed Warranty'}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isHindi ? 'गल्फ पर 9 महीने और रॉक व थॉर पर पूरे 12 महीने की निर्माण व परफॉरमेंस वारंटी।' : 'Full 9-month warranty for Gulf and 12-month performance warranty for Rock and Thor.'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <Factory size={28} className="text-cyan-600" />
              <h3 className="font-bold text-navy text-base">{isHindi ? 'रिम व रबर सुरक्षा' : 'Rim & Rubber Safe'}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isHindi ? 'पूरी तरह जंग-रहित फॉर्मूला जो अलॉय और स्टील रिम को सुरक्षित रखता है।' : 'Anti-corrosive formulation tested safe for expensive alloy and steel rims.'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <CheckCircle2 size={28} className="text-emerald-600" />
              <h3 className="font-bold text-navy text-base">{isHindi ? 'ईंधन व लाइफ बचत' : 'Fuel & Casing Savings'}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isHindi ? 'टायर का तापमान कम रखकर टायर की लाइफ 20% और माइलेज 5% तक बढ़ाता है।' : 'Cooler running temperatures extend tyre casing life by 20% and fuel economy up to 5%.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Office & CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-navy text-white rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold">{isHindi ? 'व्यापार या डीलरशिप के लिए संपर्क करें' : 'Connect with Ujjala Electricals'}</h3>
            <p className="text-sm text-slate-300 mt-1">Ground Floor, Near S.B.B.J., Rani Bazar, Industrial Area, Bikaner, Rajasthan 334001</p>
          </div>
          <div className="flex gap-4">
            <Link to="/contact" className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-6 py-3 rounded-lg text-sm transition-colors">
              {isHindi ? 'संपर्क पृष्ठ' : 'Contact Us'}
            </Link>
            <Link to="/distributorship" className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-semibold px-6 py-3 rounded-lg text-sm transition-colors">
              {isHindi ? 'डिस्ट्रीब्यूटर बनें' : 'Distributorship'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

