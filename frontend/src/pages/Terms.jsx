import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Terms() {
  const { isHindi } = useLanguage();

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">Terms of Use</span>
        <h1 className="text-3xl font-extrabold text-navy mt-1">
          {isHindi ? 'नियम व शर्तें (Terms & Conditions)' : 'Terms & Conditions of Website Use'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {isHindi ? 'उजाला इलेक्ट्रिकल्स, बीकानेर' : 'Ujjala Electricals · tyrepuncturevaccine.com'}
        </p>
      </div>

      <div className="prose max-w-none text-slate-700 text-sm leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-navy">1. Acceptance of Terms</h2>
          <p>
            By accessing tyrepuncturevaccine.com, you agree to comply with and be bound by these terms and conditions. The website provides information on Tyre Puncture Vaccine products manufactured and distributed by Ujjala Electricals, Bikaner, Rajasthan (established 2017).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-navy">2. Product Information & Pricing</h2>
          <p>
            Maximum Retail Prices (MRP) shown on this website (Gulf ₹999, Rock ₹1,199, Thor ₹1,499) are authoritative. All quote requests submitted on this website represent inquiries for quotation; formal sales contracts and tax invoices are issued upon agreed confirmation.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-navy">3. Intellectual Property</h2>
          <p>
            The Tyre Puncture Vaccine brand, logo artwork, bottle designs, promotional graphics, and textual guides are the proprietary intellectual property of Ujjala Electricals. Reproduction without prior written authorization is prohibited.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-navy">4. Jurisdiction</h2>
          <p>
            Any disputes arising from the use of this website or commercial business transactions shall be subject to the exclusive jurisdiction of the competent courts in Bikaner, Rajasthan, India.
          </p>
        </section>
      </div>
    </div>
  );
}

