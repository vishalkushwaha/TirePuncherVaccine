import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_PRODUCT_THEMES } from '../utils/productThemes';
import { api } from '../services/api';

const ThemeContext = createContext();

const LOCAL_STORAGE_KEY = 'tpv_product_themes';

export function ThemeProvider({ children }) {
  const [themes, setThemes] = useState(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        return {
          gulf: { ...DEFAULT_PRODUCT_THEMES.gulf, ...parsed.gulf },
          rock: { ...DEFAULT_PRODUCT_THEMES.rock, ...parsed.rock },
          thor: { ...DEFAULT_PRODUCT_THEMES.thor, ...parsed.thor }
        };
      }
    } catch (e) {
      console.warn('Failed to parse cached themes, using defaults', e);
    }
    return DEFAULT_PRODUCT_THEMES;
  });

  const [loading, setLoading] = useState(true);

  // Sync with backend PostgreSQL settings on load
  useEffect(() => {
    api.getSettings()
      .then(settings => {
        if (!settings) return;
        const newThemes = { ...DEFAULT_PRODUCT_THEMES };
        let hasCustom = false;

        ['gulf', 'rock', 'thor'].forEach(code => {
          const raw = settings[`product_theme_${code}`];
          if (raw) {
            try {
              const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
              newThemes[code] = { ...DEFAULT_PRODUCT_THEMES[code], ...parsed };
              hasCustom = true;
            } catch (err) {
              console.error(`Failed to parse theme for ${code}:`, err);
            }
          }
        });

        if (hasCustom) {
          setThemes(newThemes);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newThemes));
        }
      })
      .catch(err => {
        console.warn('Could not fetch server settings, using cached or default themes', err);
      })
      .finally(() => setLoading(false));
  }, []);

  // Helper to retrieve theme by product code (case-insensitive)
  const getTheme = (code) => {
    if (!code) return DEFAULT_PRODUCT_THEMES.rock;
    const key = code.toLowerCase().trim();
    return themes[key] || DEFAULT_PRODUCT_THEMES[key] || DEFAULT_PRODUCT_THEMES.rock;
  };

  // Update a single product's theme and persist to PostgreSQL database
  const updateProductTheme = async (code, updatedTokens) => {
    const key = code.toLowerCase().trim();
    const updatedTheme = { ...(themes[key] || DEFAULT_PRODUCT_THEMES[key]), ...updatedTokens };
    
    const newThemes = {
      ...themes,
      [key]: updatedTheme
    };

    setThemes(newThemes);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newThemes));

    // Persist to PostgreSQL backend via api.admin.updateSettings
    try {
      await api.admin.updateSettings({
        [`product_theme_${key}`]: JSON.stringify(updatedTheme)
      });
      return { success: true };
    } catch (err) {
      console.error(`Failed to persist theme for ${key} to server:`, err);
      throw err;
    }
  };

  // Reset a product theme back to factory default
  const resetProductTheme = async (code) => {
    const key = code.toLowerCase().trim();
    const defaultTheme = DEFAULT_PRODUCT_THEMES[key];
    if (!defaultTheme) return;

    const newThemes = {
      ...themes,
      [key]: defaultTheme
    };

    setThemes(newThemes);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newThemes));

    try {
      await api.admin.updateSettings({
        [`product_theme_${key}`]: JSON.stringify(defaultTheme)
      });
      return { success: true };
    } catch (err) {
      console.error(`Failed to reset theme for ${key} on server:`, err);
      throw err;
    }
  };

  return (
    <ThemeContext.Provider value={{
      themes,
      getTheme,
      updateProductTheme,
      resetProductTheme,
      loading
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

