import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Shield, Clock, Lock, AlertTriangle, Search, Play, Square, X, CheckCircle2 } from 'lucide-react';
import * as api from '@/lib/api';
import { Badge, Button } from '@/components/ui';

export default function Impersonation() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showStartModal, setShowStartModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [reason, setReason] = useState('');
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [requireElevation, setRequireElevation] = useState(false);

  useEffect(() => {
    api.impersonationApi.getAll().then((r: any) => setSessions(r.data || []));
    api.membersApi.getAll().then((r: any) => setMembers((r.data || []).slice(0, 100)));
  }, []);

  const filteredMembers = members.filter(m =>
    m.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    m.lastName?.toLowerCase().includes(search.toLowerCase()) ||
    m.email?.toLowerCase().includes(search.toLowerCase()) ||
    m.id?.includes(search)
  );

  const activeSessions = sessions.filter(s => s.isActive);
  const startImpersonation = async () => {
    if (!selectedMember || !reason) return;
    const result: any = await api.impersonationApi.start('admin-current', selectedMember.id, reason);
    if (result.success) {
      setSessions([result.data, ...sessions]);
      setShowStartModal(false);
      setSelectedMember(null);
      setReason('');
    }
  };

  const endSession = async (id: string) => {
    const result: any = await api.impersonationApi.end(id);
    if (result.success) {
      setSessions(sessions.map(s => s.id === id ? { ...s, isActive: false, endedAt: new Date().toISOString() } : s));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Impersonation Center</h1>
          <p className="text-slate-400 mt-1">Secure, audited customer view access for support and investigations</p>
        </div>
        <Button onClick={() => setShowStartModal(true)} variant="primary">
          <Play className="w-4 h-4 mr-2" />
          Start Impersonation
        </Button>
      </div>

      {/* Warning banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-amber-200">Restricted Action — Full Audit Trail</h3>
          <p className="text-sm text-amber-100/70 mt-1">
            Every impersonation session is permanently logged. Only Super Admin and Compliance roles can initiate sessions.
            Sessions auto-terminate after 30 minutes of inactivity.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Sessions', value: activeSessions.length, color: 'emerald', icon: Play },
          { label: 'Total Today', value: sessions.filter(s => new Date(s.startedAt).toDateString() === new Date().toDateString()).length, color: 'blue', icon: Eye },
          { label: 'Avg Duration', value: '12m', color: 'purple', icon: Clock },
          { label: 'Read-Only Mode', value: '78%', color: 'amber', icon: Lock },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-${stat.color}-500/10`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Active sessions */}
      {activeSessions.length > 0 && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Active Sessions
          </h2>
          <div className="space-y-3">
            {activeSessions.map((s) => (
              <div key={s.id} className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300 font-semibold">
                    {s.adminName.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-white font-medium">{s.adminName} <span className="text-slate-500">→</span> {s.memberName}</div>
                    <div className="text-xs text-slate-400 mt-0.5">Reason: {s.reason} · {s.isReadOnly ? 'Read-only' : 'Elevated access'} · started {new Date(s.startedAt).toLocaleTimeString()}</div>
                  </div>
                </div>
                <Button onClick={() => endSession(s.id)} variant="danger" size="sm">
                  <Square className="w-4 h-4 mr-1" />
                  End Session
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All sessions */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Session History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-slate-400 border-b border-slate-700">
                <th className="py-3 px-2">Admin</th>
                <th className="py-3 px-2">Member</th>
                <th className="py-3 px-2">Reason</th>
                <th className="py-3 px-2">Mode</th>
                <th className="py-3 px-2">Started</th>
                <th className="py-3 px-2">Ended</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">IP</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                  <td className="py-3 px-2 text-white">{s.adminName}</td>
                  <td className="py-3 px-2 text-slate-300">{s.memberName}</td>
                  <td className="py-3 px-2 text-slate-300 text-sm max-w-xs truncate">{s.reason}</td>
                  <td className="py-3 px-2">
                    <Badge variant={s.isReadOnly ? 'info' : 'warning'}>
                      {s.isReadOnly ? 'Read-only' : 'Elevated'}
                    </Badge>
                  </td>
                  <td className="py-3 px-2 text-slate-400 text-sm">{new Date(s.startedAt).toLocaleString()}</td>
                  <td className="py-3 px-2 text-slate-400 text-sm">{s.endedAt ? new Date(s.endedAt).toLocaleString() : '—'}</td>
                  <td className="py-3 px-2">
                    <Badge variant={s.isActive ? 'success' : 'default'}>{s.isActive ? 'Active' : 'Ended'}</Badge>
                  </td>
                  <td className="py-3 px-2 text-slate-500 text-xs font-mono">{s.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Start impersonation modal */}
      {showStartModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowStartModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-400" />
                Start Impersonation Session
              </h2>
              <button onClick={() => setShowStartModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Search Member</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Name, email, or member ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              {search && (
                <div className="max-h-60 overflow-y-auto border border-slate-700 rounded-lg">
                  {filteredMembers.slice(0, 10).map(m => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMember(m)}
                      className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-slate-700/50 ${
                        selectedMember?.id === m.id ? 'bg-amber-500/10 border-l-2 border-amber-500' : ''
                      }`}
                    >
                      <div>
                        <div className="text-white text-sm">{m.firstName} {m.lastName}</div>
                        <div className="text-xs text-slate-400">{m.email} · {m.id}</div>
                      </div>
                      {selectedMember?.id === m.id && <CheckCircle2 className="w-5 h-5 text-amber-400" />}
                    </button>
                  ))}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Reason for Impersonation</label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Describe the business reason for this impersonation..."
                  className="w-full px-3 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={isReadOnly} onChange={(e) => setIsReadOnly(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-600 text-amber-500 focus:ring-amber-500" />
                  <span className="text-slate-300 text-sm">Read-only mode (recommended)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={requireElevation} onChange={(e) => setRequireElevation(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-600 text-amber-500 focus:ring-amber-500" />
                  <span className="text-slate-300 text-sm">Require secondary approval for elevated actions</span>
                </label>
              </div>
            </div>
            <div className="p-6 border-t border-slate-700 flex justify-end gap-2">
              <Button onClick={() => setShowStartModal(false)} variant="ghost">Cancel</Button>
              <Button onClick={startImpersonation} variant="primary" disabled={!selectedMember || !reason}>
                <Play className="w-4 h-4 mr-2" />
                Start Session
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}