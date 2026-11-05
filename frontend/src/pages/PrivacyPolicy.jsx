import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function PrivacyPolicy() {
  const { isHindi } = useLanguage();

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">Legal Compliance</span>
        <h1 className="text-3xl font-extrabold text-navy mt-1">
          {isHindi ? 'गोपनीयता नीति (Privacy Policy)' : 'Privacy Policy'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {isHindi ? 'अंतिम संशोधन: नवंबर 2026 · उजाला इलेक्ट्रिकल्स, बीकानेर' : 'Last Updated: November 2026 · Ujjala Electricals, Bikaner'}
        </p>
      </div>

      <div className="prose max-w-none text-slate-700 text-sm leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-navy">1. Information Collection</h2>
          <p>
            When you visit tyrepuncturevaccine.com or submit inquiry forms (Retail Quote, Bulk Order Quote, Distributorship Application, or Contact Message), we collect basic business and personal information including your full name, phone number, email address, city, district, and message content.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-navy">2. Use of Collected Data</h2>
          <p>
            All submitted details are used solely by Ujjala Electricals for processing your product quotation, answering technical inquiries, evaluating territory distributor applications, and coordinating shipment dispatch. We do not sell, rent, or trade your personal or business contacts to any third-party marketing companies.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-navy">3. Security and Storage</h2>
          <p>
            Your information is stored in secure database environments with restricted administrative access granted solely to authorized management personnel of Ujjala Electricals.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-navy">4. Contact & Inquiries</h2>
          <p>
            For any queries regarding your privacy or to request removal of your quotation records, please email us directly at <strong>ujjalaelectricalsbkn@gmail.com</strong> or call <strong>+91 74130 59364</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}

