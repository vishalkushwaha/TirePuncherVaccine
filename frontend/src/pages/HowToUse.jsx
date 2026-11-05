import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function HowToUse() {
  const { t, isHindi } = useLanguage();

  const steps = [
    {
      num: 1,
      enTitle: "Keep nozzle at 4 o'clock or 8 o'clock position",
      hiTitle: "नोजल की स्थिति 4 बजे या 8 बजे की स्थिति पर रखें।",
      descEn: "Position the tyre so the valve nozzle is located between the lower quadrants (4 or 8 o'clock), ensuring the sealant injects smoothly toward the bottom.",
      descHi: "टायर को इस प्रकार घुमाएं कि वॉल्व नोजल नीचे की तरफ 4 या 8 बजे की दिशा में हो ताकि सीलेंट आसानी से अंदर जा सके।"
    },
    {
      num: 2,
      enTitle: "Remove valve pin and deflate the tyre",
      hiTitle: "नोजल से वाल्व पिन निकालें और टायर से हवा निकालें।",
      descEn: "Use a valve core remover tool to unscrew the valve pin and let all pressurized air exhaust completely from the tyre.",
      descHi: "वाल्व की चाबी से पिन को बाहर निकालें और टायर के अंदर की पूरी हवा बाहर निकाल दें।"
    },
    {
      num: 3,
      enTitle: "Shake the sealant bottle for 8 to 10 seconds",
      hiTitle: "टायर वैक्सीन सीलेंट बोतल को 8 से 10 सेकंड के लिए ठीक से हिलाएं।",
      descEn: "Vigorously agitate the bottle so the natural rubber, microfiber particles, and carrier fluid blend into a completely uniform suspension.",
      descHi: "बोतल को अच्छी तरह हिलाएं ताकि रबर, माइक्रोफाइबर और विशेष तेल आपस में समान रूप से मिल जाएं।"
    },
    {
      num: 4,
      enTitle: "Dip injector, pull sealant, and inject through nozzle",
      hiTitle: "इंजेक्टर को बोतल में डुबोएं, सीलेंट खींचें और नोजल से अंदर धकेलें।",
      descEn: "Fill the syringe injector with the calculated dosage, attach the flexible tube securely onto the valve stem, and depress the plunger smoothly. Repeat for remaining wheels.",
      descHi: "सिरिंज से सीलेंट खींचें, वॉल्व पर नली लगाकर सीलेंट को टायर के अंदर डालें। बाकी पहियों के लिए भी यही प्रक्रिया दोहराएं।"
    },
    {
      num: 5,
      enTitle: "Refix the valve pin and inflate to normal pressure",
      hiTitle: "नोजल में वाल्व पिन को फिर से लगाएं और टायर के अंदर हवा भरें।",
      descEn: "Tightly screw the valve pin back into the stem and inflate the tyre to the vehicle manufacturer's recommended PSI.",
      descHi: "वाल्व पिन को वापस कसकर लगाएं और अपनी गाड़ी के नियम अनुसार सही दबाव की हवा भरें।"
    },
    {
      num: 6,
      enTitle: "Drive the vehicle for 2 to 3 km immediately",
      hiTitle: "गाड़ी को कम से कम 2 से 3 किलोमीटर तक चलाएं।",
      descEn: "Driving immediately allows rotational centrifugal force to distribute the sealant uniformly over the inner crown, forming an impenetrable 4mm puncture barrier.",
      descHi: "गाड़ी को तुरंत 2-3 किमी चलाएं ताकि घूमने की गति से सीलेंट पूरे टायर के अंदर एक मजबूत परत बना ले।"
    }
  ];

  return (
    <div className="space-y-12 py-12 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full">
          {t('howToUse.title')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy">
          {isHindi ? '6 सरल चरणों में आसान इंस्टॉलेशन' : 'Simple 6-Step Installation Procedure'}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          {t('howToUse.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: 6 Steps Vertical Timeline */}
        <div className="lg:col-span-7 space-y-6">
          {steps.map((st) => (
            <div
              key={st.num}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex items-start gap-4 hover:border-cyan-400 transition-colors"
            >
              <div className="w-12 h-12 bg-navy text-white rounded-xl flex items-center justify-center font-black text-xl shrink-0 shadow-sm">
                {st.num}
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-navy">
                  {st.enTitle}
                </h3>
                <p className="text-sm font-semibold text-cyan-700 font-hindi">
                  {st.hiTitle}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {isHindi ? st.descHi : st.descEn}
                </p>
              </div>
            </div>
          ))}

          {/* Quick Note Box */}
          <div className="p-5 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
            <AlertTriangle size={18} className="text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">
                {isHindi ? 'महत्वपूर्ण निर्देश:' : 'Crucial Instruction:'}
              </strong>
              <span>
                {isHindi
                  ? 'सीलेंट डालने के तुरंत बाद 2 से 3 किमी गाड़ी चलाना अनिवार्य है ताकि सीलेंट पूरे टायर में फैलकर संतुलित परत बना सके।'
                  : 'Driving at least 2 to 3 km immediately after filling is mandatory to allow centrifugal action to create a smooth, balanced seal across the entire inner tread.'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Official How-To-Use Poster Image */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-lg sticky top-24">
            <h3 className="text-sm font-bold text-navy mb-3 text-center">
              {isHindi ? 'आधिकारिक उपयोग पोस्टर' : 'Official Application Chart'}
            </h3>
            <img
              src="/assets/how-to-use-6steps.png"
              alt="Official How to Use 6 Steps Poster"
              className="w-full h-auto rounded-xl object-contain shadow-xs bg-white"
            />
            <div className="mt-4 pt-4 border-t border-slate-200 text-center">
              <Link
                to="/dosage-guide"
                className="inline-flex items-center gap-2 bg-navy hover:bg-cyan-700 text-white font-bold px-6 py-2.5 rounded-lg text-xs transition-colors shadow-xs"
              >
                <span>{isHindi ? 'अपनी गाड़ी का डोसेज देखें' : 'Calculate Vehicle Dosage'}</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

