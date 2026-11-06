import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserCheck, Plus, Trash2, X, ShieldAlert, KeyRound, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AdminUsers() {
  const { isOwner, user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initialForm = {
    username: '',
    email: '',
    password: '',
    full_name: '',
    role: 'staff'
  };

  const [form, setForm] = useState(initialForm);

  // Owner "set new password" dialog for another account
  const [pwTarget, setPwTarget] = useState(null);
  const [pwForm, setPwForm] = useState({ next: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [pwSaving, setPwSaving] = useState(false);
  const [notice, setNotice] = useState('');

  const loadUsers = () => {
    api.admin.getUsers()
      .then(data => setUsers(data || []))
      .catch(() => {});
  };

  useEffect(() => {
    if (isOwner) {
      loadUsers();
    }
  }, [isOwner]);

  if (!isOwner) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-center gap-3">
        <ShieldAlert size={24} />
        <div>
          <h2 className="font-bold text-sm">Access Denied</h2>
          <p className="text-xs">Only the business Owner has permission to manage administrative staff accounts.</p>
        </div>
      </div>
    );
  }

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.admin.createUser(form);
      setIsModalOpen(false);
      setForm(initialForm);
      loadUsers();
    } catch (err) {
      alert('Failed to create user: ' + err.message);
    }
  };

  const openPasswordDialog = (u) => {
    setPwTarget(u);
    setPwForm({ next: '', confirm: '' });
    setPwError('');
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();
    if (pwForm.next.length < 8) {
      setPwError('New password must be at least 8 characters.');
      return;
    }
    if (pwForm.next !== pwForm.confirm) {
      setPwError('New password and confirmation do not match.');
      return;
    }
    setPwSaving(true);
    try {
      const res = await api.admin.setUserPassword(pwTarget.id, pwForm.next);
      setNotice(`${res.message}. Share the new password with them securely.`);
      setPwTarget(null);
    } catch (err) {
      setPwError(err.message);
    } finally {
      setPwSaving(false);
    }
  };

  const handleDelete = async (id, uname) => {
    if (id === currentUser.id) {
      alert('You cannot delete your own active owner account.');
      return;
    }
    if (confirm(`Remove staff user account "${uname}"?`)) {
      try {
        await api.admin.deleteUser(id);
        loadUsers();
      } catch (err) {
        alert('Delete failed: ' + err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">Staff & Account Management</h1>
          <p className="text-xs text-slate-500">
            Create operator accounts, reset their passwords, or{' '}
            <Link to="/admin/account" className="font-semibold text-cyan-700 hover:underline">change your own password</Link>
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-navy hover:bg-cyan-700 text-white font-bold px-4 py-2.5 rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add Staff Account</span>
        </button>
      </div>

      {notice && (
        <div role="status" className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 size={16} className="shrink-0" />
          <span className="flex-1">{notice}</span>
          <button onClick={() => setNotice('')} aria-label="Dismiss" className="p-1 hover:text-emerald-950"><X size={14} /></button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px] tracking-wider">
                <th className="p-4">Username</th>
                <th className="p-4">Full Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 font-bold text-navy">{u.username}</td>
                  <td className="p-4 text-slate-800">{u.full_name || '—'}</td>
                  <td className="p-4 text-slate-600">{u.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      u.role === 'owner' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      Active
                    </span>
                  </td>
                  <td className="p-4 text-right whitespace-nowrap">
                    {u.id === currentUser.id ? (
                      <Link
                        to="/admin/account"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-700 hover:underline"
                      >
                        <KeyRound size={14} />
                        <span>My password</span>
                      </Link>
                    ) : (
                      <>
                        <button
                          onClick={() => openPasswordDialog(u)}
                          className="p-1.5 text-slate-500 hover:text-cyan-700"
                          title={`Set new password for ${u.username}`}
                          aria-label={`Set new password for ${u.username}`}
                        >
                          <KeyRound size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(u.id, u.username)}
                          className="p-1.5 text-slate-500 hover:text-red-600"
                          title={`Delete ${u.username}`}
                          aria-label={`Delete ${u.username}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pwTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="pw-dialog-title">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 id="pw-dialog-title" className="text-base font-bold text-navy flex items-center gap-2">
                <KeyRound size={18} className="text-cyan-700" />
                Set New Password
              </h2>
              <button onClick={() => setPwTarget(null)} aria-label="Close"><X size={18} /></button>
            </div>
            <p className="text-xs text-slate-600">
              Account: <strong className="text-navy">{pwTarget.username}</strong>
              {pwTarget.full_name && <> ({pwTarget.full_name})</>}. Their old password stops working immediately.
            </p>

            {pwError && (
              <div role="alert" className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs font-semibold">
                {pwError}
              </div>
            )}

            <form onSubmit={handleSetPassword} className="space-y-3">
              <div>
                <label htmlFor="staff-new-password" className="block text-xs font-bold uppercase text-slate-700 mb-1">New Password *</label>
                <input
                  id="staff-new-password"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={pwForm.next}
                  onChange={e => { setPwForm({ ...pwForm, next: e.target.value }); setPwError(''); }}
                  className="w-full px-3 py-2 text-sm border rounded-lg"
                />
                <p className="text-[11px] text-slate-500 mt-1">At least 8 characters.</p>
              </div>
              <div>
                <label htmlFor="staff-confirm-password" className="block text-xs font-bold uppercase text-slate-700 mb-1">Confirm New Password *</label>
                <input
                  id="staff-confirm-password"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={pwForm.confirm}
                  onChange={e => { setPwForm({ ...pwForm, confirm: e.target.value }); setPwError(''); }}
                  className="w-full px-3 py-2 text-sm border rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setPwTarget(null)} className="px-4 py-2 border rounded-lg text-xs font-semibold">
                  Cancel
                </button>
                <button type="submit" disabled={pwSaving} className="px-5 py-2 bg-navy text-white rounded-lg text-xs font-bold disabled:opacity-60">
                  {pwSaving ? 'Saving…' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-bold text-navy">Create Staff Account</h2>
              <button onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Username *</label>
                <input
                  type="text"
                  required
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  placeholder="e.g. staff1"
                  className="w-full px-3 py-2 text-xs border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={e => setForm({ ...form, full_name: e.target.value })}
                  placeholder="e.g. Operations Assistant"
                  className="w-full px-3 py-2 text-xs border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="staff@ujjalaelectricals.com"
                  className="w-full px-3 py-2 text-xs border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Initial Password *</label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 text-xs border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Role</label>
                <select
                  value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value })}
                  className="w-full px-3 py-2 text-xs border rounded-lg bg-white"
                >
                  <option value="staff">Staff (Content & Quotes Editor)</option>
                  <option value="owner">Co-Owner (Full Permissions)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg text-xs font-semibold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-navy text-white rounded-lg text-xs font-bold">
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

