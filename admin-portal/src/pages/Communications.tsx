import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Search, Paperclip, Image, FileText, Video, Mic, Users, Megaphone, Clock, CheckCheck } from 'lucide-react';
import * as api from '@/lib/api-live';

export default function Communications() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [broadcast, setBroadcast] = useState({ audience: 'all', message: '', channels: ['email'] as string[] });

  useEffect(() => {
    api.communicationsApi.getConversations().then((r: any) => {
      const convs = r.data || [];
      setConversations(convs);
      setSelected(convs[0] || null);
    });
  }, []);

  const filtered = conversations.filter((c) =>
    c.memberName?.toLowerCase().includes(search.toLowerCase())
  );

  const sendMessage = async () => {
    if (!selected || !message.trim()) return;
    await api.communicationsApi.sendMessage(selected.id, message);
    setMessage('');
  };

  const sendBroadcast = async () => {
    if (!broadcast.message || broadcast.channels.length === 0) return;
    await api.communicationsApi.sendBroadcast(broadcast.audience, broadcast.message, broadcast.channels);
    setBroadcastOpen(false);
    setBroadcast({ audience: 'all', message: '', channels: ['email'] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Communications Center</h1>
          <p className="text-slate-400 mt-1">Secure messaging, broadcasts, and member outreach</p>
        </div>
        <button onClick={() => setBroadcastOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg flex items-center gap-2">
          <Megaphone className="w-4 h-4" />
          New Broadcast
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-16rem)]">
        {/* Conversations list */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl flex flex-col">
          <div className="p-4 border-b border-slate-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-10 pr-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map((c) => (
              <button key={c.id} onClick={() => setSelected(c)}
                className={`w-full text-left p-3 border-b border-slate-700/50 hover:bg-slate-700/30 ${selected?.id === c.id ? 'bg-slate-700/40 border-l-2 border-l-blue-500' : ''}`}>
                <div className="flex items-center gap-3">
                  <img src={c.avatar} alt={c.memberName} className="w-10 h-10 rounded-full bg-slate-700" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white truncate">{c.memberName}</span>
                      {c.unread > 0 && <span className="px-1.5 py-0.5 text-xs rounded-full bg-blue-500 text-white">{c.unread}</span>}
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{c.lastMessage}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl flex flex-col">
          {selected ? (
            <>
              <div className="p-4 border-b border-slate-700 flex items-center gap-3">
                <img src={selected.avatar} alt="" className="w-10 h-10 rounded-full bg-slate-700" />
                <div>
                  <h3 className="text-white font-semibold">{selected.memberName}</h3>
                  <p className="text-xs text-slate-400">Member ID: {selected.memberId}</p>
                </div>
              </div>
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                <div className="flex justify-center">
                  <span className="text-xs text-slate-500 bg-slate-700/30 px-3 py-1 rounded-full">
                    Encrypted end-to-end · All messages audited
                  </span>
                </div>
                {/* Sample messages */}
                <div className="flex gap-2 max-w-md">
                  <div className="bg-slate-700/50 text-slate-100 px-3 py-2 rounded-2xl rounded-tl-sm text-sm">
                    {selected.lastMessage}
                  </div>
                </div>
                <div className="flex gap-2 max-w-md ml-auto justify-end">
                  <div className="bg-blue-500/20 text-white px-3 py-2 rounded-2xl rounded-tr-sm text-sm">
                    <div className="flex items-center gap-1 text-xs text-blue-300 mb-1"><CheckCheck className="w-3 h-3" /> Admin</div>
                    Hi {selected.memberName?.split(' ')[0]}! I'm reaching out from the OrbitPay support team regarding your account. How can I help you today?
                  </div>
                </div>
              </div>
              <div className="p-3 border-t border-slate-700">
                <div className="flex items-center gap-1 mb-2 text-xs text-slate-500">
                  <button className="p-1.5 hover:bg-slate-700/50 rounded"><Paperclip className="w-4 h-4" /></button>
                  <button className="p-1.5 hover:bg-slate-700/50 rounded"><Image className="w-4 h-4" /></button>
                  <button className="p-1.5 hover:bg-slate-700/50 rounded"><FileText className="w-4 h-4" /></button>
                  <button className="p-1.5 hover:bg-slate-700/50 rounded"><Video className="w-4 h-4" /></button>
                  <button className="p-1.5 hover:bg-slate-700/50 rounded"><Mic className="w-4 h-4" /></button>
                </div>
                <div className="flex gap-2">
                  <input value={message} onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500" />
                  <button onClick={sendMessage} disabled={!message.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500">
              Select a conversation
            </div>
          )}
        </div>
      </div>

      {/* Broadcast modal */}
      {broadcastOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setBroadcastOpen(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 border border-slate-700 rounded-2xl max-w-xl w-full"
            onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">Send Broadcast</h2>
              <p className="text-sm text-slate-400 mt-1">Reach a large audience with a single message</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Audience</label>
                <select value={broadcast.audience} onChange={(e) => setBroadcast({ ...broadcast, audience: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white">
                  <option value="all">All Members</option>
                  <option value="premium">Premium Tier</option>
                  <option value="new">New Members (30d)</option>
                  <option value="inactive">Inactive 90d+</option>
                  <option value="crypto">Crypto Holders</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Channels</label>
                <div className="flex flex-wrap gap-2">
                  {['email', 'sms', 'push', 'in_app'].map((ch) => (
                    <label key={ch} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/50 border border-slate-700 rounded-lg cursor-pointer">
                      <input type="checkbox" checked={broadcast.channels.includes(ch)}
                        onChange={(e) => {
                          const set = new Set(broadcast.channels);
                          if (e.target.checked) set.add(ch); else set.delete(ch);
                          setBroadcast({ ...broadcast, channels: Array.from(set) });
                        }}
                        className="rounded border-slate-600" />
                      <span className="text-sm text-slate-300 capitalize">{ch.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                <textarea value={broadcast.message} onChange={(e) => setBroadcast({ ...broadcast, message: e.target.value })}
                  rows={5} placeholder="Write your broadcast message..."
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 resize-none" />
              </div>
            </div>
            <div className="p-6 border-t border-slate-700 flex justify-end gap-2">
              <button onClick={() => setBroadcastOpen(false)} className="px-4 py-2 text-slate-300 hover:bg-slate-700 rounded-lg">Cancel</button>
              <button onClick={sendBroadcast} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Send Broadcast
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}