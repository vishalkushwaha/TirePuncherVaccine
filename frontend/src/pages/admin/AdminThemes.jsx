import React, { useState, useEffect } from 'react';
import { Palette, CheckCircle2, RotateCcw, Save, X, Eye, Sparkles, ShieldCheck, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { DEFAULT_PRODUCT_THEMES, getContrastTextColor, isValidHex } from '../../utils/productThemes';

export default function AdminThemes() {
  const { themes, updateProductTheme, resetProductTheme, getTheme } = useTheme();

  const [activeTab, setActiveTab] = useState('gulf'); // 'gulf', 'rock', 'thor'
  const [formData, setFormData] = useState({ ...DEFAULT_PRODUCT_THEMES.gulf });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync form data whenever active tab or themes change
  useEffect(() => {
    const currentTheme = getTheme(activeTab);
    setFormData({ ...currentTheme });
    setErrorMsg('');
    setSavedSuccess(false);
  }, [activeTab, themes]);

  const handleColorChange = (token, val) => {
    let cleanVal = val;
    if (!cleanVal.startsWith('#')) {
      cleanVal = '#' + cleanVal;
    }
    setFormData(prev => ({ ...prev, [token]: cleanVal }));
  };

  const handleSave = async (e) => {
    e?.preventDefault();
    setSaving(true);
    setErrorMsg('');
    setSavedSuccess(false);

    // Validate all hex values
    for (const [key, val] of Object.entries(formData)) {
      if (['primary', 'secondary', 'accent', 'bgLight', 'bgBadge', 'textContrast', 'border', 'btnPrimary', 'btnHover'].includes(key)) {
        if (!isValidHex(val)) {
          setErrorMsg(`Invalid HEX code for ${key}: "${val}". Must be in format #RRGGBB`);
          setSaving(false);
          return;
        }
      }
    }

    try {
      await updateProductTheme(activeTab, formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      setErrorMsg('Failed to save theme: ' + (err.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm(`Reset ${activeTab.toUpperCase()} back to factory default colors?`)) return;
    setSaving(true);
    try {
      await resetProductTheme(activeTab);
      setFormData({ ...DEFAULT_PRODUCT_THEMES[activeTab] });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      setErrorMsg('Reset failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...getTheme(activeTab) });
    setErrorMsg('');
  };

  const colorFields = [
    { key: 'primary', label: 'Primary Brand Color', desc: 'Main product identity, cards, and header banners' },
    { key: 'secondary', label: 'Secondary / Accent Tone', desc: 'Category badges, icons, and prominent highlights' },
    { key: 'accent', label: 'Tertiary / Checkmark Color', desc: 'Feature checkmarks, bullet icons, and borders' },
    { key: 'bgLight', label: 'Light Background Tint', desc: 'Subtle container and section background color' },
    { key: 'bgBadge', label: 'Pill / Badge Background', desc: 'Background color for small specification tags' },
    { key: 'textContrast', label: 'Text Contrast Color', desc: 'High-readability dark text for headings and labels' },
    { key: 'border', label: 'Border Color', desc: 'Borders on cards, tables, inputs, and containers' },
    { key: 'btnPrimary', label: 'Primary Button Background', desc: 'Action buttons ("Get Quote", "View Specs")' },
    { key: 'btnHover', label: 'Button Hover Background', desc: 'Interactive hover state on action buttons' }
  ];

  // Mock product attributes for live preview
  const productPreviewMeta = {
    gulf: {
      name: 'Tyre Puncture Vaccine Gulf',
      mrp: '999',
      warranty: '9 Months Warranty',
      vehicles: 'Two-wheelers, hatchbacks, compact sedans',
      image: '/assets/gulf-poster.jpeg',
      tyreType: 'Tubeless Tyres'
    },
    rock: {
      name: 'Tyre Puncture Vaccine Rock',
      mrp: '1,199',
      warranty: '12 Months Warranty',
      vehicles: 'SUVs, luxury sedans, pickups, tempos',
      image: '/assets/rock-poster.jpeg',
      tyreType: 'Tube & Tubeless'
    },
    thor: {
      name: 'Tyre Puncture Vaccine Thor',
      mrp: '1,499',
      warranty: '12 Months Warranty (Heavy)',
      vehicles: 'Heavy commercial vehicles, trucks, buses',
      image: '/assets/thor-poster.jpeg',
      tyreType: 'Heavy Commercial'
    }
  }[activeTab];

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-cyan-50 text-cyan-700 rounded-lg">
              <Palette size={22} />
            </div>
            <h1 className="text-2xl font-extrabold text-navy">Theme Customization Studio</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Independently customize primary, accent, background, border, and button colors for each product.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 [&>button]:whitespace-nowrap">
          <button
            type="button"
            onClick={handleReset}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
          >
            <RotateCcw size={14} />
            <span>Reset Defaults</span>
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
          >
            <X size={14} />
            <span>Cancel</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-navy hover:bg-cyan-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Save size={14} />
            <span>{saving ? 'Saving...' : 'Save Theme'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 size={16} />
          <span>Theme colors for {activeTab.toUpperCase()} updated and saved to PostgreSQL successfully!</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center gap-2 text-xs font-semibold">
          <X size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Product Selector Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto">
        {[
          { code: 'gulf', label: 'Gulf', detail: '₹999 / 9 Mo', color: themes.gulf?.primary || '#6C024A' },
          { code: 'rock', label: 'Rock', detail: '₹1,199 / 12 Mo', color: themes.rock?.primary || '#0F172A' },
          { code: 'thor', label: 'Thor', detail: '₹1,499 / 12 Mo', color: themes.thor?.primary || '#0B2744' }
        ].map(tab => (
          <button
            key={tab.code}
            onClick={() => setActiveTab(tab.code)}
            className={`px-3 sm:px-5 py-3 text-xs font-bold rounded-t-xl flex items-center gap-2.5 whitespace-nowrap shrink-0 transition-all border-b-2 ${
              activeTab === tab.code
                ? 'bg-white border-navy text-navy shadow-xs'
                : 'bg-slate-100 text-slate-500 border-transparent hover:bg-slate-200'
            }`}
          >
            <span
              className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
              style={{ backgroundColor: tab.color }}
            />
            <span>{tab.label}<span className="hidden sm:inline font-medium opacity-80"> ({tab.detail})</span></span>
          </button>
        ))}
      </div>

      {/* Main Studio Grid: Controls on Left, Live Preview Simulator on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-extrabold text-navy uppercase tracking-wider">
                {activeTab.toUpperCase()} Palette Settings
              </h2>
              <p className="text-[11px] text-slate-400">
                Click color swatches or type standard 6-digit HEX codes
              </p>
            </div>
            <span
              className="text-[10px] uppercase font-black px-2.5 py-1 rounded-full text-white"
              style={{ backgroundColor: formData.primary }}
            >
              Active
            </span>
          </div>

          <div className="space-y-4">
            {colorFields.map(field => {
              const val = formData[field.key] || '#000000';
              const valid = isValidHex(val);

              return (
                <div
                  key={field.key}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50"
                >
                  <div className="space-y-0.5 max-w-xs">
                    <label className="text-xs font-bold text-slate-700 block">
                      {field.label}
                    </label>
                    <span className="text-[11px] text-slate-400 block leading-tight">
                      {field.desc}
                    </span>
                  </div>

                  {/* Dual Controls: Swatch + Text Input */}
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <div className="relative">
                      <input
                        type="color"
                        value={valid ? val : '#000000'}
                        onChange={e => handleColorChange(field.key, e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white shadow-2xs"
                      />
                    </div>
                    <input
                      type="text"
                      maxLength={7}
                      value={val}
                      onChange={e => handleColorChange(field.key, e.target.value)}
                      className={`w-24 px-2.5 py-2 text-xs font-mono font-bold rounded-lg border text-center uppercase ${
                        valid
                          ? 'border-slate-300 focus:ring-2 focus:ring-cyan-600 bg-white'
                          : 'border-rose-400 bg-rose-50 text-rose-700'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Preview Simulator Column */}
        <div className="lg:col-span-5 sticky top-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-navy uppercase tracking-wider">
              <Eye size={16} className="text-cyan-700" />
              <span>Live Component Preview</span>
            </div>
            <span className="text-[11px] text-slate-400">Updates in Real-Time</span>
          </div>

          {/* Simulated Product Card */}
          <div
            className="rounded-2xl border transition-all duration-300 shadow-md overflow-hidden"
            style={{
              backgroundColor: '#FFFFFF',
              borderColor: formData.border
            }}
          >
            {/* Header Banner */}
            <div
              className="py-2.5 px-4 text-xs font-bold flex items-center justify-between"
              style={{
                backgroundColor: formData.primary,
                color: getContrastTextColor(formData.primary)
              }}
            >
              <span>{productPreviewMeta.tyreType}</span>
              <span
                className="px-2 py-0.5 rounded text-[11px] font-bold"
                style={{
                  backgroundColor: formData.secondary,
                  color: getContrastTextColor(formData.secondary)
                }}
              >
                {productPreviewMeta.warranty}
              </span>
            </div>

            {/* Poster Artwork with Light Tint */}
            <div
              className="aspect-4/3 p-4 flex items-center justify-center overflow-hidden"
              style={{ backgroundColor: formData.bgLight }}
            >
              <img
                src={productPreviewMeta.image}
                alt={productPreviewMeta.name}
                className="h-full w-auto object-contain drop-shadow-md"
              />
            </div>

            {/* Details & Specs */}
            <div className="p-5 space-y-4">
              <div>
                <span
                  className="inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full mb-1"
                  style={{
                    backgroundColor: formData.bgBadge,
                    color: formData.primary
                  }}
                >
                  Code: {activeTab.toUpperCase()}
                </span>
                <h3
                  className="text-lg font-bold"
                  style={{ color: formData.textContrast }}
                >
                  {productPreviewMeta.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {productPreviewMeta.vehicles}
                </p>

                <div className="mt-3 flex items-baseline gap-2">
                  <span
                    className="text-2xl font-black"
                    style={{ color: formData.primary }}
                  >
                    ₹{productPreviewMeta.mrp}
                  </span>
                  <span className="text-xs text-slate-400">/ 1 Litre Bottle</span>
                </div>
              </div>

              {/* Feature Checklist */}
              <div
                className="space-y-1.5 text-xs border-t pt-3"
                style={{ borderColor: formData.border }}
              >
                <div className="flex items-center gap-2">
                  <Check size={14} style={{ color: formData.accent }} className="shrink-0" />
                  <span style={{ color: formData.textContrast }}>Instant 4mm Tread Puncture Sealing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} style={{ color: formData.accent }} className="shrink-0" />
                  <span style={{ color: formData.textContrast }}>Anti-Corrosive Metal & Alloy Rim Protection</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} style={{ color: formData.accent }} className="shrink-0" />
                  <span style={{ color: formData.textContrast }}>Active from -30°C to +60°C Extreme Climates</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  className="w-full py-2.5 px-3 rounded-lg text-xs font-bold transition-all shadow-xs"
                  style={{
                    backgroundColor: formData.btnPrimary,
                    color: getContrastTextColor(formData.btnPrimary)
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = formData.btnHover;
                    e.currentTarget.style.color = getContrastTextColor(formData.btnHover);
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = formData.btnPrimary;
                    e.currentTarget.style.color = getContrastTextColor(formData.btnPrimary);
                  }}
                >
                  Request Quote
                </button>

                <button
                  type="button"
                  className="w-full py-2.5 px-3 rounded-lg text-xs font-bold border transition-colors"
                  style={{
                    borderColor: formData.border,
                    color: formData.primary,
                    backgroundColor: formData.bgBadge
                  }}
                >
                  View Specs
                </button>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-500 text-center">
            Changes saved here automatically apply to Product Details, Homepage Cards, Comparison Matrix, and Quote funnels.
          </div>
        </div>
      </div>
    </div>
  );
}

