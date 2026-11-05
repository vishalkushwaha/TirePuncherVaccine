import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Truck, Car, Bike, CheckCircle2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { getContrastTextColor } from '../utils/productThemes';

export default function DosageGuide() {
  const { t, isHindi } = useLanguage();
  const { getTheme } = useTheme();

  const vehicleOptions = [
    {
      id: 'bike',
      nameEn: 'Scooter, Motorcycle & Sports Bike',
      nameHi: 'स्कूटर, बाइक और स्पोर्ट्स बाइक',
      perTyre: '400 ml',
      perTyreMl: 400,
      tyreCount: 2,
      totalMl: 800,
      sizeGuide: 'Standard 10" to 19"',
      recommendedProd: 'gulf',
      prodName: 'Tyre Puncture Vaccine Gulf',
      bottles: 1
    },
    {
      id: 'car',
      nameEn: 'Hatchback & Sedan (5 Seater)',
      nameHi: 'हैचबैक और सेडान कारें (5 सीटर)',
      perTyre: '400 ml',
      perTyreMl: 400,
      tyreCount: 4,
      totalMl: 1600,
      sizeGuide: 'R12, R13, R14, R15, R16, R17',
      recommendedProd: 'gulf',
      prodName: 'Tyre Puncture Vaccine Gulf / Rock',
      bottles: 2
    },
    {
      id: 'suv-med',
      nameEn: 'SUV 7-Seater (R15 to R17)',
      nameHi: 'एसयूवी 7-सीटर (R15 से R17)',
      perTyre: '500 ml',
      perTyreMl: 500,
      tyreCount: 4,
      totalMl: 2000,
      sizeGuide: 'R15, R16, R17',
      recommendedProd: 'rock',
      prodName: 'Tyre Puncture Vaccine Rock',
      bottles: 2
    },
    {
      id: 'suv-large',
      nameEn: 'SUV 7-Seater (R18 to R20)',
      nameHi: 'बड़ी एसयूवी (R18 से R20)',
      perTyre: '600 ml',
      perTyreMl: 600,
      tyreCount: 4,
      totalMl: 2400,
      sizeGuide: 'R18, R19, R20',
      recommendedProd: 'rock',
      prodName: 'Tyre Puncture Vaccine Rock',
      bottles: 3
    },
    {
      id: 'auto',
      nameEn: '3-Wheeler (Auto, Ape, etc.)',
      nameHi: '3-व्हीलर (ऑटो, आपे आदि)',
      perTyre: '500 ml',
      perTyreMl: 500,
      tyreCount: 3,
      totalMl: 1500,
      sizeGuide: 'Standard 3-Wheeler Tyres',
      recommendedProd: 'rock',
      prodName: 'Tyre Puncture Vaccine Rock',
      bottles: 2
    },
    {
      id: 'tempo',
      nameEn: 'Commercial Light Tempo & Pickup',
      nameHi: 'वाणिज्यिक टेम्पो और पिकअप',
      perTyre: '600 ml',
      perTyreMl: 600,
      tyreCount: 4,
      totalMl: 2400,
      sizeGuide: 'Standard Commercial Light',
      recommendedProd: 'rock',
      prodName: 'Tyre Puncture Vaccine Rock',
      bottles: 3
    },
    {
      id: 'truck-17',
      nameEn: 'Heavy Bus & Truck (R17.5)',
      nameHi: 'भारी बस और ट्रक (R17.5)',
      perTyre: '2.4 Litres (2,400 ml)',
      perTyreMl: 2400,
      tyreCount: 4,
      totalMl: 9600,
      sizeGuide: 'R17.5 Heavy Tyres',
      recommendedProd: 'thor',
      prodName: 'Tyre Puncture Vaccine Thor',
      bottles: 10
    },
    {
      id: 'truck-20',
      nameEn: 'Heavy Bus & Truck (R20)',
      nameHi: 'भारी बस और ट्रक (R20)',
      perTyre: '2.6 Litres (2,600 ml)',
      perTyreMl: 2600,
      tyreCount: 4,
      totalMl: 10400,
      sizeGuide: 'R20 Heavy Tyres',
      recommendedProd: 'thor',
      prodName: 'Tyre Puncture Vaccine Thor',
      bottles: 11
    },
    {
      id: 'truck-22',
      nameEn: 'Multi-Axle Bus & Truck (R22.5)',
      nameHi: 'मल्टी-एक्सल बस व भारी ट्रक (R22.5)',
      perTyre: '2.8 Litres (2,800 ml)',
      perTyreMl: 2800,
      tyreCount: 4,
      totalMl: 11200,
      sizeGuide: 'R22.5 Heavy Tyres',
      recommendedProd: 'thor',
      prodName: 'Tyre Puncture Vaccine Thor',
      bottles: 12
    }
  ];

  const [selectedId, setSelectedId] = useState('car');
  const [tyreQty, setTyreQty] = useState(4);

  const activeOption = vehicleOptions.find(v => v.id === selectedId) || vehicleOptions[1];
  const calculatedTotalMl = activeOption.perTyreMl * tyreQty;
  const calculatedBottles = Math.ceil(calculatedTotalMl / 1000);

  return (
    <div className="space-y-16 py-12 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full">
          {t('dosage.title')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy">
          {isHindi ? 'वाहन अनुसार सही सीलेंट मात्रा गाइड' : 'Interactive Dosage Calculator & Guide'}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          {t('dosage.subtitle')}
        </p>
      </div>

      {/* Interactive Calculator Section */}
      <div className="bg-navy text-white rounded-3xl p-6 sm:p-10 border border-cyan-500/40 shadow-2xl">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700">
            <Calculator size={28} className="text-cyan-400" />
            <h2 className="text-xl sm:text-2xl font-bold">
              {isHindi ? 'इंटरैक्टिव डोसेज कैलकुलेटर' : 'Live Dosage & Bottle Calculator'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Input Controls */}
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-cyan-300 mb-2">
                  1. {t('dosage.selectVehicle')}
                </label>
                <select
                  value={selectedId}
                  onChange={(e) => {
                    const opt = vehicleOptions.find(v => v.id === e.target.value);
                    setSelectedId(e.target.value);
                    if (opt) setTyreQty(opt.tyreCount);
                  }}
                  className="w-full bg-navy-light text-white border border-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-cyan-400"
                >
                  {vehicleOptions.map(opt => (
                    <option key={opt.id} value={opt.id}>
                      {isHindi ? opt.nameHi : opt.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-cyan-300 mb-2">
                  2. {isHindi ? 'पहियों की संख्या (Number of Tyres)' : 'Number of Tyres to Treat'}
                </label>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  {[2, 3, 4, 6, 8, 10, 12].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setTyreQty(n)}
                      aria-pressed={tyreQty === n}
                      className={`min-w-11 px-3.5 py-2 rounded-lg font-bold text-sm transition-all ${tyreQty === n
                          ? 'bg-cyan-500 text-navy font-black shadow-md'
                          : 'bg-navy-light text-slate-300 hover:bg-slate-700'
                        }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-navy-light/60 rounded-xl border border-slate-700 text-xs text-slate-300 space-y-1 break-words">
                <span className="block font-semibold text-white">
                  {isHindi ? 'टायर साइज गाइड:' : 'Tyre Size Reference:'} {activeOption.sizeGuide}
                </span>
                <span>
                  {isHindi ? 'अनुशंसित मात्रा प्रति टायर:' : 'Dosage per wheel:'} <strong className="text-cyan-300">{activeOption.perTyre}</strong>
                </span>
              </div>
            </div>

            {/* Result Box */}
            <div className="bg-gradient-to-br from-[#071A2E] to-[#14365C] p-6 rounded-2xl border border-cyan-400/40 shadow-inner space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                {isHindi ? 'गणना परिणाम' : 'Calculated Requirement'}
              </span>

              <div className="space-y-4">
                <div className="flex flex-wrap justify-between items-baseline gap-x-4 gap-y-1 border-b border-slate-700 pb-3">
                  <span className="text-xs text-slate-300">{isHindi ? 'कुल सीलेंट मात्रा:' : 'Total Sealant Volume:'}</span>
                  <span className="text-xl sm:text-2xl font-black text-cyan-300">
                    {calculatedTotalMl >= 1000 ? `${(calculatedTotalMl / 1000).toFixed(1)} L (${calculatedTotalMl} ml)` : `${calculatedTotalMl} ml`}
                  </span>
                </div>

                <div className="flex flex-wrap justify-between items-baseline gap-x-4 gap-y-1 border-b border-slate-700 pb-3">
                  <span className="text-xs text-slate-300">{isHindi ? 'आवश्यक 1L बोतलें:' : '1 Litre Bottles Needed:'}</span>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                    {calculatedBottles} {isHindi ? 'बोतल' : 'Bottle(s)'}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-400 block mb-1">
                    {isHindi ? 'अनुशंसित फॉर्मूला:' : 'Recommended Formulation:'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: getTheme(activeOption.recommendedProd).primary }}
                    />
                    <span className="text-base font-bold text-white block">
                      {activeOption.prodName}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                to={`/quote?product=${activeOption.recommendedProd}&quantity=${calculatedBottles}&vehicle=${encodeURIComponent(activeOption.nameEn)}`}
                className="w-full font-black text-sm py-3.5 rounded-xl text-center block shadow-lg transition-all active:scale-98"
                style={{
                  backgroundColor: getTheme(activeOption.recommendedProd).btnPrimary,
                  color: getContrastTextColor(getTheme(activeOption.recommendedProd).btnPrimary)
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = getTheme(activeOption.recommendedProd).btnHover;
                  e.currentTarget.style.color = getContrastTextColor(getTheme(activeOption.recommendedProd).btnHover);
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = getTheme(activeOption.recommendedProd).btnPrimary;
                  e.currentTarget.style.color = getContrastTextColor(getTheme(activeOption.recommendedProd).btnPrimary);
                }}
              >
                {isHindi ? 'इस मात्रा के लिए कोटेशन मांगें' : 'Request Quote for this Vehicle'}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Official Poster Table */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-navy">
            {isHindi ? 'आधिकारिक इंस्टॉलेशन डोसेज चार्ट' : 'Standard Factory Dosage Chart'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isHindi
              ? 'उजाला इलेक्ट्रिकल्स द्वारा अनुमोदित तकनीकी दिशा-निर्देश'
              : 'As reproduced from official Ujjala Electricals installation collateral'}
          </p>
        </div>

        <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-md">
          <table className="w-full text-left border-collapse min-w-[700px] text-xs sm:text-sm">
            <thead>
              <tr className="bg-navy text-white">
                <th className="p-4">{isHindi ? 'वाहन का प्रकार' : 'Vehicle Category'}</th>
                <th className="p-4">{isHindi ? 'प्रति टायर मात्रा' : 'Per Tyre Volume'}</th>
                <th className="p-4">{isHindi ? 'टायर साइज' : 'Tyre Size'}</th>
                <th className="p-4">{isHindi ? 'कुल मात्रा' : 'Total Quantity'}</th>
                <th className="p-4">{isHindi ? 'मार्गदर्शन' : 'Recommendation'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {vehicleOptions.map((row, idx) => (
                <tr key={row.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="p-4 font-bold text-navy">
                    {isHindi ? row.nameHi : row.nameEn}
                  </td>
                  <td className="p-4 font-semibold text-cyan-800">{row.perTyre}</td>
                  <td className="p-4 text-slate-600">{row.sizeGuide}</td>
                  <td className="p-4 font-bold text-slate-900">{row.totalMl} ml</td>
                  <td className="p-4 text-slate-700">
                    <span className="font-semibold text-navy">{row.prodName}</span>
                    <span className="block text-[11px] text-slate-500">~ {row.bottles} bottle(s)</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

