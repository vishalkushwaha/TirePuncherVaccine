import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ChevronRight, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useShopConfig } from '../../context/ShopConfigContext';

export default function Footer() {
  const { isHindi } = useLanguage();
  const { isEcommerceEnabled, isQuotationEnabled } = useShopConfig();

  return (
    <footer className="bg-navy text-slate-300 pt-16 pb-8 border-t border-navy-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-10 md:gap-10 pb-12 border-b border-slate-700/60">
          {/* Brand & Firm Overview */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <img
                src="/assets/logo.png"
                alt="Tyre Puncture Vaccine Logo"
                className="h-20 w-auto object-contain drop-shadow-md"
              />
            </Link>
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              {isHindi
                ? 'टायर पंचर वैक्सीन का निर्माण व वितरण उजाला इलेक्ट्रिकल्स (बीकानेर, राजस्थान, स्थापना 2017) द्वारा किया जाता है। 4 मिमी तक के पंचर को तुरंत सील करने वाला अत्याधुनिक फॉर्मूला।'
                : 'Tyre Puncture Vaccine is manufactured by Ujjala Electricals, established 2017 in Bikaner, Rajasthan. Advanced preventive tyre sealant engineered for two-wheelers, passenger cars, and heavy commercial vehicles.'}
            </p>
            <div className="space-y-2 text-xs text-slate-300 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  Ground Floor, Near S.B.B.J., Rani Bazar, Industrial Area, Bikaner, Rajasthan 334001
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={15} className="text-cyan-400 shrink-0" />
                <a href="tel:+917413059364" className="hover:text-cyan-300 font-medium">
                  +91 74130 59364
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={15} className="text-cyan-400 shrink-0" />
                <a href="mailto:ujjalaelectricalsbkn@gmail.com" className="hover:text-cyan-300">
                  ujjalaelectricalsbkn@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Column 1: Products */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wide uppercase mb-4 border-l-2 border-cyan-500 pl-2">
              {isHindi ? 'प्रोडक्ट्स' : 'Products'}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/products/gulf" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-cyan-500" />
                  <span>Gulf (₹999 / 9 mo)</span>
                </Link>
              </li>
              <li>
                <Link to="/products/rock" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-cyan-500" />
                  <span>Rock (₹1,199 / 12 mo)</span>
                </Link>
              </li>
              <li>
                <Link to="/products/thor" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-cyan-500" />
                  <span>Thor (₹1,499 / 12 mo)</span>
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 font-medium text-cyan-300">
                  <ChevronRight size={12} className="text-cyan-500" />
                  <span>{isHindi ? 'सभी की तुलना करें' : 'Compare Products'}</span>
                </Link>
              </li>
              <li>
                <Link to="/how-to-use" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-cyan-500" />
                  <span>{isHindi ? '6-स्टेप उपयोग विधि' : '6-Step Application'}</span>
                </Link>
              </li>
              <li>
                <Link to="/dosage-guide" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-cyan-500" />
                  <span>{isHindi ? 'डोसेज गाइड कैलकुलेटर' : 'Dosage Guide Calculator'}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Partnership & Media */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wide uppercase mb-4 border-l-2 border-cyan-500 pl-2">
              {isHindi ? 'साझेदारी व मीडिया' : 'Partnership & Media'}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/about" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-cyan-500" />
                  <span>{isHindi ? 'हमारे बारे में' : 'About Us'}</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-cyan-500" />
                  <span>{isHindi ? 'संपर्क करें' : 'Contact Us'}</span>
                </Link>
              </li>
              <li>
                <Link to="/distributorship" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-cyan-500" />
                  <span>{isHindi ? 'डिस्ट्रीब्यूटरशिप अवसर' : 'Distributorship Portal'}</span>
                </Link>
              </li>
              <li>
                <Link to="/where-to-buy" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-cyan-500" />
                  <span>{isHindi ? 'डीलर नेटवर्क' : 'Where to Buy'}</span>
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-cyan-500" />
                  <span>{isHindi ? 'इवेंट्स एवं समाचार' : 'Events & News'}</span>
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-cyan-500" />
                  <span>{isHindi ? 'फोटो गैलरी व पोस्टर्स' : 'Photo Gallery & Posters'}</span>
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-cyan-500" />
                  <span>{isHindi ? 'ब्लॉग व गाइड्स' : 'Technical Blog'}</span>
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-cyan-500" />
                  <span>{isHindi ? 'अक्सर पूछे जाने वाले सवाल' : 'Customer FAQs'}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Policies */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wide uppercase mb-4 border-l-2 border-cyan-500 pl-2">
              {isHindi ? 'नीतियां व नियम' : 'Policies & Trust'}
            </h4>
            <ul className="space-y-2.5 text-xs">
              {isQuotationEnabled && (
                <li>
                  <Link to="/quote" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                    <ChevronRight size={12} className="text-cyan-500" />
                    <span>{isHindi ? 'कोटेशन प्राप्त करें' : 'Get a Quote'}</span>
                  </Link>
                </li>
              )}
              {isEcommerceEnabled && (
                <li>
                  <Link to="/track-order" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                    <ChevronRight size={12} className="text-cyan-500" />
                    <span>{isHindi ? 'ऑर्डर ट्रैक करें' : 'Track Your Order'}</span>
                  </Link>
                </li>
              )}
              <li>
                <Link to="/pricing-warranty" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-emerald-400" />
                  <span>{isHindi ? 'कीमत एवं वारंटी नीति' : 'Pricing & Warranty Policy'}</span>
                </Link>
              </li>
              <li>
                <Link to="/delivery-policy" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-cyan-500" />
                  <span>{isHindi ? 'डिलीवरी एवं डिस्पैच' : 'Delivery & Dispatch Policy'}</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-cyan-500" />
                  <span>{isHindi ? 'गोपनीयता नीति' : 'Privacy Policy'}</span>
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-cyan-500" />
                  <span>{isHindi ? 'नियम व शर्तें' : 'Terms & Conditions'}</span>
                </Link>
              </li>
              <li>
                <Link to="/certifications" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-cyan-500" />
                  <span>{isHindi ? 'प्रमाणपत्र' : 'Lab Certifications'}</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="text-center sm:text-left">
            © {new Date().getFullYear()} <strong className="text-white">Ujjala Electricals</strong>. {isHindi ? 'सर्वाधिकार सुरक्षित।' : 'All Rights Reserved.'}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-slate-400 font-mono">
            <span>tyrepuncturevaccine.com</span>
            <span>·</span>
            <span>Bikaner, Rajasthan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

