import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Phone, ArrowRight, Home, Building2, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ThankYou() {
  const [searchParams] = useSearchParams();
  const { isHindi } = useLanguage();

  const refNumber = searchParams.get('ref') || 'TPV-CONFIRMED';
  const type = searchParams.get('type') || 'inquiry';
  const isBulk = type === 'bulk';

  return (
    <div className="py-20 max-w-2xl mx-auto px-4 sm:px-6 text-center space-y-6">
      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
        <CheckCircle2 size={48} />
      </div>

      <div className="space-y-2">
        <span className="text-xs uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
          {isBulk
            ? (isHindi ? 'थोक कोटेशन अनुरोध प्राप्त' : 'Wholesale Quotation Request Received')
            : (isHindi ? 'अनुरोध सफलतापूर्वक दर्ज' : 'Submission Received Successfully')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy">
          {isBulk
            ? (isHindi
                ? 'आपका थोक कोटेशन अनुरोध सफलतापूर्वक दर्ज हो गया है'
                : 'Your wholesale quotation request has been submitted successfully.')
            : (isHindi
                ? 'धन्यवाद! आपका अनुरोध प्राप्त हो गया है'
                : 'Thank You! Your Request is Registered')}
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed max-w-lg mx-auto">
          {isBulk
            ? (isHindi
                ? 'हमारी टीम आपके चयनित उत्पादों और मात्रा की समीक्षा कर रही है और शीघ्र ही आपके लिए विशेष अनुकूलित थोक कोटेशन के साथ संपर्क करेगी।'
                : 'Our sales management team is reviewing your product selection and will contact you shortly with a customized quotation.')
            : (isHindi
                ? 'उजाला इलेक्ट्रिकल्स (बीकानेर) की टीम आपके अनुरोध की समीक्षा कर रही है और 24 घंटे के भीतर आपसे संपर्क करेगी।'
                : 'Our sales and dispatch management at Ujjala Electricals Bikaner is reviewing your request and will contact you within 24 business hours.')}
        </p>
        {isBulk && (
          <p className="text-xs text-slate-500 max-w-md mx-auto pt-1 font-medium">
            {isHindi
              ? 'कृपया ध्यान दें: आधिकारिक थोक दरें, वॉल्यूम लाभ व डिस्पैच समय-सीमा आपके अनुरोध की समीक्षा के बाद सीधे साझा की जाएंगी।'
              : 'Please note: Final wholesale rates, volume benefits, and dispatch timelines will be shared directly by our team.'}
          </p>
        )}
      </div>

      {/* Reference Card */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 max-w-md mx-auto space-y-2">
        <span className="text-xs text-slate-500 uppercase tracking-wider block font-semibold">
          {isHindi ? 'आपका संदर्भ संख्या (Reference No.):' : 'Your Reference Tracking Number:'}
        </span>
        <span className="text-2xl font-black text-navy font-mono tracking-wider block text-cyan-800">
          {refNumber}
        </span>
        <span className="text-[11px] text-slate-400 block">
          {isHindi ? 'कृपया भविष्य के संदर्भ के लिए इसे सुरक्षित रखें।' : 'Keep this reference code for future order updates.'}
        </span>
      </div>

      {/* Direct Contact Callout */}
      <div className="p-4 bg-ice rounded-xl border border-slate-200 text-xs text-slate-700 max-w-md mx-auto flex items-center justify-center gap-3">
        <Phone size={16} className="text-cyan-600 shrink-0" />
        <span>
          {isHindi ? 'त्वरित सहायता के लिए कॉल करें:' : 'Immediate inquiry assistance:'}{' '}
          <a href="tel:+917413059364" className="font-bold text-navy hover:underline">
            +91 74130 59364
          </a>
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-navy hover:bg-cyan-700 text-white font-bold px-6 py-3 rounded-lg text-xs sm:text-sm shadow-md transition-colors"
        >
          <Home size={16} />
          <span>{isHindi ? 'मुख्य पृष्ठ पर लौटें' : 'Return to Home'}</span>
        </Link>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-white border border-slate-300 hover:border-cyan-600 text-slate-800 font-semibold px-6 py-3 rounded-lg text-xs sm:text-sm transition-colors"
        >
          <span>{isHindi ? 'अन्य उत्पाद देखें' : 'Browse Products'}</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
