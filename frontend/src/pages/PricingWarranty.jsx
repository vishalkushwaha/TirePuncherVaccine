import React from 'react';
import { ShieldCheck, Award, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function PricingWarranty() {
  const { isHindi } = useLanguage();

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">Official Policy</span>
        <h1 className="text-3xl font-extrabold text-navy mt-1">
          {isHindi ? 'मूल्य निर्धारण एवं वारंटी नीति' : 'Pricing & Warranty Policy'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {isHindi ? 'उजाला इलेक्ट्रिकल्स द्वारा सत्यापित मानक' : 'Authorized Standards by Ujjala Electricals, Bikaner'}
        </p>
      </div>

      <div className="prose max-w-none text-slate-700 text-sm leading-relaxed space-y-6">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-navy">1. Product Pricing (MRP)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-slate-200 text-xs">
              <thead className="bg-navy text-white">
                <tr>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Official MRP</th>
                  <th className="p-3">Warranty</th>
                  <th className="p-3">Pack Volume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-3 font-bold">Tyre Puncture Vaccine Gulf</td>
                  <td className="p-3 font-black text-navy">₹999</td>
                  <td className="p-3">9 Months</td>
                  <td className="p-3">1 Litre</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="p-3 font-bold">Tyre Puncture Vaccine Rock</td>
                  <td className="p-3 font-black text-navy">₹1,199</td>
                  <td className="p-3">12 Months</td>
                  <td className="p-3">1 Litre</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Tyre Puncture Vaccine Thor (Heavy)</td>
                  <td className="p-3 font-black text-navy">₹1,499</td>
                  <td className="p-3">12 Months</td>
                  <td className="p-3">1 Litre</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500">
            * All MRP figures are inclusive of GST. Commercial wholesale rates for cartons and fleet contracts are quoted individually upon inquiry.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-navy">2. Warranty Scope & Coverage</h2>
          <p>
            The performance warranty covers punctures up to 4mm occurring within the crown tread contact area of properly inflated tyres where the recommended sealant volume has been installed in accordance with our Dosage Guidelines.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li><strong>Gulf:</strong> 9 Months performance warranty from date of installation.</li>
            <li><strong>Rock:</strong> 12 Months performance warranty from date of installation.</li>
            <li><strong>Thor:</strong> 12 Months heavy commercial performance warranty from date of installation.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-navy">3. Exclusions from Warranty</h2>
          <p className="text-xs text-slate-600">
            The warranty does not cover sidewall cuts, bead tears, blowouts resulting from severe impact with sharp curbs, or punctures exceeding 4mm in diameter. Tyres operating with severe under-inflation or bald worn-out casings are excluded from warranty claims.
          </p>
        </section>
      </div>
    </div>
  );
}

