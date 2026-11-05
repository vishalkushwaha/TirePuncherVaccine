import React from 'react';
import { Truck, Clock, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function DeliveryPolicy() {
  const { isHindi } = useLanguage();

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">Dispatch & Shipping</span>
        <h1 className="text-3xl font-extrabold text-navy mt-1">
          {isHindi ? 'डिलीवरी एवं डिस्पैच नीति' : 'Delivery & Dispatch Policy'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {isHindi ? 'उजाला इलेक्ट्रिकल्स, रानी बाज़ार, बीकानेर' : 'Ujjala Electricals · Central Bikaner Depot'}
        </p>
      </div>

      <div className="prose max-w-none text-slate-700 text-sm leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-navy">1. Order Processing Timeline</h2>
          <p>
            Upon confirmation of a retail or bulk quotation, orders are packaged securely at our central Bikaner depot. Retail orders are dispatched within 24 to 48 hours. Bulk carton orders are dispatched within 2 to 3 business days via verified transport logistics partners.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-navy">2. Shipping Coverage & Courier Partners</h2>
          <p>
            We ship to all districts across Rajasthan and pan-India destinations using reputable surface courier networks and freight transport carriers. Liquid bottles are packaged with tamper-proof induction foil seals to ensure zero transit leakage.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-navy">3. Tracking & Delivery Inspection</h2>
          <p>
            Consignment airway bill (LR/AWB) tracking numbers are sent to your mobile phone/email upon dispatch. Customers are advised to inspect carton seals upon delivery. In the rare event of transit damage, notify our helpline at +91 74130 59364 within 24 hours of receipt.
          </p>
        </section>
      </div>
    </div>
  );
}

