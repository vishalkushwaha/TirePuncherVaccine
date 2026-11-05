import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, MessageCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    phone: '+91 74130 59364',
    email: 'ujjalaelectricalsbkn@gmail.com',
    address: 'Ground Floor, Near S.B.B.J., Rani Bazar, Industrial Area, Bikaner, Rajasthan 334001',
    whatsapp_enabled: 'false',
    whatsapp_number: '+917413059364',
    facebook_url: '',
    instagram_url: ''
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getSettings().then(data => {
      if (data) {
        setSettings(prev => ({
          ...prev,
          ...data,
          whatsapp_enabled: String(data.whatsapp_enabled)
        }));
      }
    });
  }, []);

  const handleToggleWhatsApp = () => {
    setSettings(prev => ({
      ...prev,
      whatsapp_enabled: prev.whatsapp_enabled === 'true' ? 'false' : 'true'
    }));
  };

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
        <h1 className="text-2xl font-extrabold text-navy">Site Settings & Controls</h1>
        <p className="text-xs text-slate-500">Contact coordinates, company address, and WhatsApp floating button clearance</p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 size={16} />
          <span>Settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* WhatsApp Switch Block (Per Blueprint TPV-ARCH-2026-001 Section 14) */}
        <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <MessageCircle size={24} />
              </div>
              <div>
                <h3 className="font-bold text-navy text-base">WhatsApp Floating Button</h3>
                <p className="text-xs text-slate-500">Enable or disable the bottom-right WhatsApp chat button on the public site</p>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              type="button"
              onClick={handleToggleWhatsApp}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                settings.whatsapp_enabled === 'true' ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  settings.whatsapp_enabled === 'true' ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
            <AlertTriangle size={16} className="text-amber-700 shrink-0 mt-0.5" />
            <span>
              <strong>Blueprint Rule:</strong> The button is built into the layout. Per blueprint Section 14, keep this toggle switched <strong>OFF</strong> until official written owner clearance is granted.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              WhatsApp Business Mobile Number
            </label>
            <input
              type="text"
              value={settings.whatsapp_number || '+917413059364'}
              onChange={e => setSettings({ ...settings, whatsapp_number: e.target.value })}
              className="w-full px-3 py-2 text-xs border rounded-lg font-mono"
            />
          </div>
        </div>

        {/* Company Coordinates */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-navy text-base border-b pb-3">Company Contact Coordinates</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Central Phone Number</label>
              <input
                type="text"
                value={settings.phone || ''}
                onChange={e => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3 py-2 text-xs border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Central Inquiry Email</label>
              <input
                type="email"
                value={settings.email || ''}
                onChange={e => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3 py-2 text-xs border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Registered Depot Address (Bikaner)</label>
            <textarea
              rows={2}
              value={settings.address || ''}
              onChange={e => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-3 py-2 text-xs border rounded-lg"
            />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-navy text-base border-b pb-3">Social Media Profiles</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Facebook Page URL</label>
              <input
                type="url"
                value={settings.facebook_url || ''}
                onChange={e => setSettings({ ...settings, facebook_url: e.target.value })}
                placeholder="https://facebook.com/..."
                className="w-full px-3 py-2 text-xs border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Instagram Profile URL</label>
              <input
                type="url"
                value={settings.instagram_url || ''}
                onChange={e => setSettings({ ...settings, instagram_url: e.target.value })}
                placeholder="https://instagram.com/..."
                className="w-full px-3 py-2 text-xs border rounded-lg"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-navy hover:bg-cyan-700 text-white font-bold px-6 py-2.5 rounded-lg text-xs flex items-center gap-2 shadow-xs transition-colors"
        >
          <Save size={14} />
          <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </form>
    </div>
  );
}

