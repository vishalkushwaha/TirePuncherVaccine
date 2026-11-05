import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../i18n/en.json';
import hi from '../i18n/hi.json';

const translations = { en, hi };
const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('tpv_lang') || 'en';
  });

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem('tpv_lang', lang);
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (path, fallback = '') => {
    const keys = path.split('.');
    let current = translations[language];
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to English if missing in Hindi
        let enCurrent = translations['en'];
        for (const enKey of keys) {
          if (enCurrent && enCurrent[enKey] !== undefined) {
            enCurrent = enCurrent[enKey];
          } else {
            return fallback || path;
          }
        }
        return enCurrent;
      }
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isHindi: language === 'hi' }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

