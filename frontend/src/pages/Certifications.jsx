import React, { useState, useEffect } from 'react';
import { Award, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';

export default function Certifications() {
  const { t, isHindi } = useLanguage();
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCertificates()
      .then(data => {
        setCerts(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-12 py-12 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full">
          {t('nav.certifications')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy">
          {isHindi ? 'गुणवत्ता प्रमाणन एवं परीक्षण' : 'Quality Testing & Certifications'}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          {isHindi
            ? 'उजाला इलेक्ट्रिकल्स द्वारा निर्मित Tyre Puncture Vaccine सुरक्षा व गुणवत्ता मानकों पर खरा उतरा है।'
            : 'Verified laboratory testing parameters and safety certifications for rim and rubber compatibility.'}
        </p>
      </div>

      {/* Trust Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <ShieldCheck size={28} className="text-cyan-600" />
          <h3 className="font-bold text-navy text-base">{isHindi ? 'जंग-रहित परीक्षण (Anti-Corrosion)' : 'Anti-Corrosion Rim Certified'}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {isHindi ? 'स्टील व एल्युमिनियम अलॉय पहियों पर लंबे समय तक परीक्षण में कोई क्षरण या जंग नहीं पाई गई।' : 'Tested thoroughly on steel and alloy rims with zero oxidation, corrosion, or pitting over prolonged exposure.'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <Award size={28} className="text-cyan-600" />
          <h3 className="font-bold text-navy text-base">{isHindi ? 'नॉन-टॉक्सिक व पर्यावरण सुरक्षित' : 'Eco-Safe Non-Toxic Formula'}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {isHindi ? 'फॉर्मूलेशन गैर-ज्वलनशील (Non-flammable) और पर्यावरण अनुकूल प्राकृतिक घटकों से निर्मित है।' : '100% non-hazardous, non-flammable, and eco-friendly composition compliant with safety regulations.'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <CheckCircle2 size={28} className="text-emerald-600" />
          <h3 className="font-bold text-navy text-base">{isHindi ? 'तापमान स्थिरता (-30°C to +60°C)' : 'Extreme Thermal Endurance'}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {isHindi ? 'राजस्थान की 50°C की भीषण गर्मी से लेकर बर्फीले इलाकों तक सीलेंट अपनी तरलता और प्रभाव बनाए रखता है।' : 'Remains fluid and fully reactive from -30°C alpine winters to +60°C intense Rajasthan highway temperatures.'}
          </p>
        </div>
      </div>

      {/* Certificates Feed */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-navy">
          {isHindi ? 'आधिकारिक दस्तावेज व प्रमाण' : 'Official Laboratory Reports & Quality Papers'}
        </h2>
        {certs.length === 0 ? (
          <div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl text-center text-xs text-slate-500">
            {isHindi
              ? 'आधिकारिक परीक्षण रिपोर्ट व प्रमाणपत्र इस अनुभाग में शीघ्र प्रकाशित किए जाएंगे। जानकारी हेतु +91 74130 59364 पर संपर्क करें।'
              : 'Laboratory certificates and compliance sheets are periodically uploaded here by management. For immediate verification contact +91 74130 59364.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certs.map(c => (
              <div key={c.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-start gap-4">
                <FileText size={24} className="text-cyan-600 shrink-0 mt-1" />
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-navy">{isHindi ? c.title_hi : c.title_en}</h4>
                  <p className="text-xs text-slate-500">{c.issuing_body} ({c.issue_year})</p>
                  <p className="text-xs text-slate-600">{isHindi ? c.description_hi : c.description_en}</p>
                  {c.document_url && (
                    <a href={c.document_url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-cyan-700 hover:underline pt-1 inline-block">
                      View Certificate Document →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

