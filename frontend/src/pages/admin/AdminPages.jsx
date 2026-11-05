import React, { useState, useEffect } from 'react';
import { Flag, Save, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminPages() {
  const [settings, setSettings] = useState({
    hero_tagline_en: '',
    hero_tagline_hi: '',
    brand_name: '',
    firm_name: '',
    domain: ''
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getSettings().then(data => {
      setSettings(prev => ({ ...prev, ...data }));
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await api.admin.updateSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Save failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold text-navy">Page Banners & Headlines</h1>
        <p className="text-xs text-slate-500">Edit public home hero text, Hindi taglines, and marketing banners</p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 size={16} />
          <span>Page banners and headlines updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
            Hero Primary Tagline (English)
          </label>
          <input
            type="text"
            value={settings.hero_tagline_en || ''}
            onChange={e => setSettings({ ...settings, hero_tagline_en: e.target.value })}
            className="w-full px-3 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-cyan-600"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
            Hero Primary Tagline (Hindi)
          </label>
          <input
            type="text"
            value={settings.hero_tagline_hi || ''}
            onChange={e => setSettings({ ...settings, hero_tagline_hi: e.target.value })}
            className="w-full px-3 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-cyan-600 font-hindi"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Brand Name</label>
            <input
              type="text"
              value={settings.brand_name || ''}
              onChange={e => setSettings({ ...settings, brand_name: e.target.value })}
              className="w-full px-3 py-2 text-xs border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Registered Firm</label>
            <input
              type="text"
              value={settings.firm_name || ''}
              onChange={e => setSettings({ ...settings, firm_name: e.target.value })}
              className="w-full px-3 py-2 text-xs border rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Primary Domain</label>
          <input
            type="text"
            value={settings.domain || ''}
            onChange={e => setSettings({ ...settings, domain: e.target.value })}
            className="w-full px-3 py-2 text-xs border rounded-lg font-mono"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-navy hover:bg-cyan-700 text-white font-bold px-6 py-2.5 rounded-lg text-xs flex items-center gap-2 shadow-xs transition-colors"
        >
          <Save size={14} />
          <span>{saving ? 'Saving...' : 'Save Banner Changes'}</span>
        </button>
      </form>
    </div>
  );
}

