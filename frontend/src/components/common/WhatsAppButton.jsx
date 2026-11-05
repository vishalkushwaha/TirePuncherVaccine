import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

export default function WhatsAppButton() {
  const [enabled, setEnabled] = useState(false);
  const [phone, setPhone] = useState('917413059364');
  const { isHindi } = useLanguage();

  useEffect(() => {
    api.getSettings()
      .then(settings => {
        if (settings && (settings.whatsapp_enabled === 'true' || settings.whatsapp_enabled === true)) {
          setEnabled(true);
        } else {
          setEnabled(false);
        }
        if (settings && settings.whatsapp_number) {
          const clean = settings.whatsapp_number.replace(/\D/g, '');
          setPhone(clean || '917413059364');
        }
      })
      .catch(() => {
        setEnabled(false);
      });
  }, []);

  if (!enabled) return null;

  const message = isHindi
    ? 'नमस्ते, मुझे टायर पंचर वैक्सीन के बारे में और जानकारी व कोटेशन चाहिए।'
    : 'Hello, I would like more information and a quote regarding Tyre Puncture Vaccine.';

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <aside aria-label="Quick contact" className="fixed bottom-6 right-6 z-50 animate-bounce">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-medium text-sm group"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={22} className="fill-white" />
        <span className="hidden sm:inline font-semibold">WhatsApp</span>
      </a>
    </aside>
  );
}

