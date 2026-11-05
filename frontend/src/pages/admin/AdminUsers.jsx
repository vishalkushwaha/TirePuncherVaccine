import React, { useState, useEffect } from 'react';
import { UserCheck, Plus, Trash2, X, ShieldAlert } from 'lucide-react';
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
          <p className="text-xs text-slate-500">Create operator accounts with editing permissions</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-navy hover:bg-cyan-700 text-white font-bold px-4 py-2.5 rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add Staff Account</span>
        </button>
      </div>

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
                  <td className="p-4 text-right">
                    {u.id !== currentUser.id && (
                      <button onClick={() => handleDelete(u.id, u.username)} className="p-1.5 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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

