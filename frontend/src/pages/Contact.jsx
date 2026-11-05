import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';

export default function Contact() {
  const { t, isHindi } = useLanguage();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!form.name || !form.phone || !form.message) {
      setErrorMsg(isHindi ? 'कृपया नाम, फोन और संदेश अवश्य भरें।' : 'Please fill name, phone, and message.');
      return;
    }
    setSubmitting(true);
    try {
      await api.submitContact(form);
      setSuccess(true);
      setForm({ name: '', phone: '', email: '', subject: '', message: '' });
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 py-12 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full">
          {t('nav.contact')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy">
          {isHindi ? 'उजाला इलेक्ट्रिकल्स से संपर्क करें' : 'Get in Touch with Our Team'}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          {isHindi
            ? 'बीकानेर कार्यालय से सीधे बात करें या अपनी पूछताछ भेजें।'
            : 'Reach our central Bikaner distribution headquarters for inquiries, retail packs, and commercial fleets.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Info Card */}
        <div className="lg:col-span-5 bg-navy text-white rounded-3xl p-8 space-y-6 shadow-xl border border-cyan-500/30">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-cyan-400">
              {isHindi ? 'मुख्यालय एवं डिपो' : 'Headquarters & Depot'}
            </span>
            <h3 className="text-2xl font-bold mt-1">Ujjala Electricals</h3>
            <p className="text-xs text-slate-300 mt-1">Trading Tyre Puncture Vaccine since 2017</p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-200">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white mb-0.5">{isHindi ? 'कार्यालय का पता:' : 'Office Address:'}</strong>
                <span>Ground Floor, Near S.B.B.J., Rani Bazar, Industrial Area, Bikaner, Rajasthan 334001</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone size={18} className="text-cyan-400 shrink-0" />
              <div>
                <strong className="block text-white mb-0.5">{isHindi ? 'फ़ोन नंबर:' : 'Direct Phone:'}</strong>
                <a href="tel:+917413059364" className="hover:text-cyan-300 font-bold text-base text-cyan-300">
                  +91 74130 59364
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail size={18} className="text-cyan-400 shrink-0" />
              <div>
                <strong className="block text-white mb-0.5">{isHindi ? 'ईमेल:' : 'Official Email:'}</strong>
                <a href="mailto:ujjalaelectricalsbkn@gmail.com" className="hover:text-cyan-300 text-slate-300">
                  ujjalaelectricalsbkn@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock size={18} className="text-cyan-400 shrink-0" />
              <div>
                <strong className="block text-white mb-0.5">{isHindi ? 'कार्य समय:' : 'Working Hours:'}</strong>
                <span>Monday – Saturday: 9:00 AM – 7:30 PM</span>
              </div>
            </div>
          </div>

          {/* Direct WhatsApp Callout */}
          <div className="p-4 bg-navy-light rounded-xl border border-slate-700 text-xs text-slate-300">
            <p className="leading-relaxed">
              {isHindi
                ? 'कोटेशन या डीलरशिप से संबंधित त्वरित जानकारी के लिए हमारे फोन नंबर पर कॉल कर सकते हैं।'
                : 'For immediate order confirmation or dealership queries, feel free to call our central number directly.'}
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <h2 className="text-xl font-bold text-navy">
            {isHindi ? 'संदेश भेजें' : 'Send an Inquiry Message'}
          </h2>

          {success && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2 text-xs sm:text-sm font-semibold">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              <span>
                {isHindi
                  ? 'धन्यवाद! आपका संदेश सफलतापूर्वक भेजा गया है। हम शीघ्र ही संपर्क करेंगे।'
                  : 'Thank you! Your message has been sent successfully. We will follow up shortly.'}
              </span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-xl">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  {isHindi ? 'आपका नाम *' : 'Your Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder={isHindi ? "उदा. विकास गहलोत" : "e.g. Vikas Gehlot"}
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  {isHindi ? 'मोबाइल नंबर *' : 'Phone Number *'}
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  {isHindi ? 'ईमेल पता' : 'Email Address'}
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  {isHindi ? 'विषय' : 'Subject'}
                </label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  placeholder={isHindi ? "कोटेशन / पूछताछ" : "Inquiry / Quote / Dealer"}
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                {isHindi ? 'संदेश *' : 'Your Message *'}
              </label>
              <textarea
                rows={4}
                required
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                placeholder={isHindi ? "अपनी आवश्यकता या प्रश्न यहाँ लिखें..." : "Type your requirement or question here..."}
                className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-navy hover:bg-cyan-700 text-white font-bold px-8 py-3 rounded-lg text-sm shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Send size={16} />
              <span>{submitting ? t('common.submitting') : (isHindi ? 'संदेश भेजें' : 'Send Message')}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Embedded Map */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-navy text-center">
          {isHindi ? 'कार्यालय का नक्शा (बीकानेर)' : 'Location Map · Bikaner, Rajasthan'}
        </h3>
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md aspect-4/3 sm:aspect-video lg:aspect-21/9 w-full">
          <iframe
            title="Ujjala Electricals Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3523.541484732152!2d73.3228966752661!3d27.977322976030996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x393fe6f827e4db53%3A0xb3bfebaa9eeec968!2sRani%20Bazar%2C%20Industrial%20Area%2C%20Bikaner%2C%20Rajasthan%20334001!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <div className="text-center">
          <a
            href="https://www.google.com/maps/search/?api=1&query=Rani+Bazar+Industrial+Area+Bikaner+Rajasthan+334001"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-700 hover:underline"
          >
            {isHindi ? 'Google Maps में खोलें' : 'Open in Google Maps'} →
          </a>
        </div>
      </section>
    </div>
  );
}

