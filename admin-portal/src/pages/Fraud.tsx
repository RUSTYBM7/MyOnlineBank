import { useState, useEffect } from 'react';
import { AlertTriangle, Shield, CheckCircle, XCircle, Clock, Eye, Search, Download, RefreshCw, Loader2 } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import { Button, Badge } from '@/components/ui';

export default function Fraud() {
  const { fraudAlerts, investigateFraud, resolveFraud, markFraudFalsePositive, fetchFraud, isLoading } = useAdminStore();

  useEffect(() => {
    fetchFraud();
  }, [fetchFraud]);

  const [search, setSearch] = useState('');

  const stats = {
    open: fraudAlerts.filter(f => f.status === 'open').length,
    investigating: fraudAlerts.filter(f => f.status === 'investigating').length,
    resolved: fraudAlerts.filter(f => f.status === 'resolved').length,
    totalAmount: fraudAlerts.filter(f => f.status !== 'false_positive').reduce((sum, f) => sum + f.amount, 0),
  };

  const filtered = fraudAlerts.filter(f =>
    f.memberName.toLowerCase().includes(search.toLowerCase()) || f.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Fraud Center</h1><p className="text-slate-400 text-sm mt-1">Monitor and investigate suspicious activities</p></div>
        <Button variant="secondary" icon={<Download className="w-4 h-4" />}>Export Report</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Open Alerts', value: stats.open, color: 'red' },
          { label: 'Under Investigation', value: stats.investigating, color: 'amber' },
          { label: 'Resolved', value: stats.resolved, color: 'emerald' },
          { label: 'Total Amount', value: `$${stats.totalAmount.toLocaleString()}`, color: 'blue' },
        ].map((s, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-500 text-sm">{s.label}</p><p className="text-2xl font-bold text-white mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search alerts..." className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50" />
      </div>

      <div className="space-y-4">
        {filtered.map(alert => (
          <div key={alert.id} className={`bg-slate-900 border rounded-xl p-6 ${alert.severity === 'critical' ? 'border-red-500/50' : alert.severity === 'high' ? 'border-amber-500/50' : 'border-slate-800'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${alert.severity === 'critical' ? 'bg-red-500/20' : alert.severity === 'high' ? 'bg-amber-500/20' : 'bg-blue-500/20'}`}>
                  <AlertTriangle className={`w-6 h-6 ${alert.severity === 'critical' ? 'text-red-400' : alert.severity === 'high' ? 'text-amber-400' : 'text-blue-400'}`} />
                </div>
                <div>
                  <p className="text-white font-medium">{alert.memberName}</p>
                  <p className="text-slate-500 text-sm">{alert.type.replace('_', ' ')} - {alert.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={alert.severity === 'critical' || alert.severity === 'high' ? 'danger' : alert.severity === 'medium' ? 'warning' : 'info'}>{alert.severity}</Badge>
                <Badge variant={alert.status === 'resolved' ? 'success' : alert.status === 'investigating' ? 'warning' : 'default'}>{alert.status.replace('_', ' ')}</Badge>
                <p className="text-amber-400 font-bold">${alert.amount.toLocaleString()}</p>
              </div>
            </div>
            <p className="text-slate-400 mb-4">{alert.description}</p>
            <div className="flex gap-2">
              {alert.status === 'open' && <Button variant="warning" size="sm" onClick={() => investigateFraud(alert.id)} icon={<Eye className="w-4 h-4" />}>Investigate</Button>}
              {alert.status === 'investigating' && <Button variant="success" size="sm" onClick={() => resolveFraud(alert.id)} icon={<CheckCircle className="w-4 h-4" />}>Mark Resolved</Button>}
              <Button variant="secondary" size="sm" onClick={() => markFraudFalsePositive(alert.id)} icon={<XCircle className="w-4 h-4" />}>False Positive</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
