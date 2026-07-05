import { useState, useEffect } from 'react';
import { Search, BarChart3, Download, Filter, Calendar, User, FileText, Shield, RefreshCw, Loader2 } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import type { AuditLog } from '@/store/adminStore';
import { Button, Badge, Table } from '@/components/ui';

export default function Audit() {
  const { auditLogs, fetchAuditLogs, isLoading } = useAdminStore();

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const [search, setSearch] = useState('');

  const filtered = auditLogs.filter(log =>
    log.adminName.toLowerCase().includes(search.toLowerCase()) || log.action.toLowerCase().includes(search.toLowerCase()) || log.module.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { key: 'date', header: 'Timestamp', render: (l: AuditLog) => <span className="text-slate-400 text-sm">{l.date}</span> },
    { key: 'admin', header: 'Admin', render: (l: AuditLog) => (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center"><User className="w-4 h-4 text-slate-400" /></div>
        <span className="text-white">{l.adminName}</span>
      </div>
    )},
    { key: 'action', header: 'Action', render: (l: AuditLog) => <span className="text-white">{l.action}</span> },
    { key: 'module', header: 'Module', render: (l: AuditLog) => <Badge variant="info">{l.module}</Badge> },
    { key: 'details', header: 'Details', render: (l: AuditLog) => <span className="text-slate-400 text-sm">{l.details}</span> },
    { key: 'ip', header: 'IP Address', render: (l: AuditLog) => <span className="text-slate-500 font-mono text-sm">{l.ip}</span> },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Audit Logs</h1><p className="text-slate-400 text-sm mt-1">Track all administrative actions and system events</p></div>
        <Button variant="secondary" icon={<Download className="w-4 h-4" />}>Export Logs</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Events', value: auditLogs.length },
          { label: 'Today', value: 3 },
          { label: 'This Week', value: 12 },
          { label: 'Critical Actions', value: 2 },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-500 text-sm">{stat.label}</p><p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search audit logs..." className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50" />
        </div>
        <select className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-300">
          <option>All Modules</option><option>Authentication</option><option>Members</option><option>Accounts</option><option>Transactions</option><option>Settings</option>
        </select>
        <Button variant="secondary" icon={<Calendar className="w-4 h-4" />}>Date Range</Button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <Table columns={columns} data={filtered} keyExtractor={l => l.id} emptyMessage="No audit logs found" />
      </div>
    </div>
  );
}
