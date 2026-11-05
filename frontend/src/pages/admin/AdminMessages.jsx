import React, { useState, useEffect } from 'react';
import { MessageSquare, Phone, Mail, CheckCircle } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMessages = () => {
    api.admin.getContactMessages()
      .then(data => {
        setMessages(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const toggleRead = async (msg) => {
    try {
      await api.admin.updateContactMessage(msg.id, { is_read: !msg.is_read });
      loadMessages();
    } catch (err) {
      alert('Update failed: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-navy">Contact Messages Inbox</h1>
        <p className="text-xs text-slate-500">Inquiries submitted via public Contact Us form</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px] tracking-wider">
                <th className="p-4">Sender</th>
                <th className="p-4">Phone / Email</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Message</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {messages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-slate-400">
                    No contact messages in inbox yet.
                  </td>
                </tr>
              ) : (
                messages.map(m => (
                  <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-bold text-navy">{m.name}</td>
                    <td className="p-4 text-xs">
                      <a href={`tel:${m.phone}`} className="font-semibold text-slate-800 hover:text-cyan-700 block">{m.phone}</a>
                      {m.email && <span className="text-slate-400 block">{m.email}</span>}
                    </td>
                    <td className="p-4 font-semibold text-slate-800">{m.subject || 'General Inquiry'}</td>
                    <td className="p-4 max-w-sm text-slate-600 truncate">{m.message}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        m.is_read ? 'bg-slate-100 text-slate-600' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {m.is_read ? 'Read' : 'Unread'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => toggleRead(m)}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs font-semibold"
                      >
                        {m.is_read ? 'Mark Unread' : 'Mark Read'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

