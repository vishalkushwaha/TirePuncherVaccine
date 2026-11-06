import React, { useState } from 'react';
import { KeyRound, CheckCircle2, AlertTriangle, Eye, EyeOff, UserCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const MIN_LENGTH = 8;

function PasswordField({ id, label, value, onChange, show, autoComplete, hint }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-bold uppercase text-slate-700 mb-1">
        {label}
      </label>
      <input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        autoComplete={autoComplete}
        required
        className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-hidden bg-white"
      />
      {hint && <p className="text-[11px] text-slate-500 mt-1">{hint}</p>}
    </div>
  );
}

export default function AdminAccount() {
  const { user } = useAuth();
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const set = key => value => {
    setForm(f => ({ ...f, [key]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.next.length < MIN_LENGTH) {
      setError(`New password must be at least ${MIN_LENGTH} characters.`);
      return;
    }
    if (form.next !== form.confirm) {
      setError('New password and confirmation do not match.');
      return;
    }
    if (form.next === form.current) {
      setError('New password must be different from the current password.');
      return;
    }

    setSaving(true);
    try {
      await api.admin.changePassword(form.current, form.next);
      setForm({ current: '', next: '', confirm: '' });
      setSuccess('Password changed successfully. Use your new password next time you sign in.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold text-navy">My Account</h1>
        <p className="text-xs text-slate-500">Your sign-in details and password</p>
      </div>

      {/* Profile summary */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
        <div className="p-3 bg-cyan-50 text-cyan-700 rounded-xl shrink-0">
          <UserCircle2 size={28} />
        </div>
        <div className="min-w-0 text-sm">
          <span className="block font-bold text-navy truncate">{user?.full_name || user?.username}</span>
          <span className="block text-xs text-slate-500 truncate">
            Username: <strong className="text-slate-700">{user?.username}</strong>
            {user?.email && <> · {user.email}</>}
          </span>
          <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
            {user?.role}
          </span>
        </div>
      </div>

      {/* Change password */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5"
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <KeyRound size={18} className="text-cyan-700" />
            <h2 className="font-bold text-navy">Change Password</h2>
          </div>
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-cyan-700"
            aria-pressed={show}
          >
            {show ? <EyeOff size={14} /> : <Eye size={14} />}
            <span>{show ? 'Hide' : 'Show'} passwords</span>
          </button>
        </div>

        {error && (
          <div role="alert" className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-center gap-2 text-xs font-semibold">
            <AlertTriangle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div role="status" className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2 text-xs font-semibold">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <PasswordField
          id="current-password"
          label="Current Password *"
          value={form.current}
          onChange={set('current')}
          show={show}
          autoComplete="current-password"
        />
        <PasswordField
          id="new-password"
          label="New Password *"
          value={form.next}
          onChange={set('next')}
          show={show}
          autoComplete="new-password"
          hint={`At least ${MIN_LENGTH} characters. Mix letters, numbers and symbols for a stronger password.`}
        />
        <PasswordField
          id="confirm-password"
          label="Confirm New Password *"
          value={form.confirm}
          onChange={set('confirm')}
          show={show}
          autoComplete="new-password"
        />

        <button
          type="submit"
          disabled={saving}
          className="w-full sm:w-auto bg-navy hover:bg-cyan-700 disabled:opacity-60 text-white text-sm font-bold px-6 py-2.5 rounded-lg transition-colors"
        >
          {saving ? 'Updating…' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}
