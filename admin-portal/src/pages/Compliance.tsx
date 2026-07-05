import { Shield, FileCheck, AlertTriangle, CheckCircle, Clock, Download, Eye } from 'lucide-react';
import { Button, Badge } from '@/components/ui';

export default function Compliance() {
  const requirements = [
    { name: 'BSA/AML Program', status: 'compliant', lastReview: '2024-01-10', nextReview: '2024-04-10' },
    { name: 'KYC Procedures', status: 'compliant', lastReview: '2024-01-05', nextReview: '2024-07-05' },
    { name: 'SAR Filing', status: 'compliant', lastReview: '2024-01-01', nextReview: '2024-02-01' },
    { name: 'OFAC Screening', status: 'compliant', lastReview: '2024-01-12', nextReview: '2024-02-12' },
    { name: 'CFPB Compliance', status: 'review_required', lastReview: '2023-10-15', nextReview: 'Overdue' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Compliance Center</h1><p className="text-slate-400 text-sm mt-1">Regulatory compliance and audit preparation</p></div>
        <Button variant="secondary" icon={<Download className="w-4 h-4" />}>Export Report</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Compliance Score', value: '94%', color: 'emerald' },
          { label: 'Active Requirements', value: 5, color: 'blue' },
          { label: 'Pending Reviews', value: 1, color: 'amber' },
          { label: 'Past Due', value: 0, color: 'red' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-500 text-sm">{stat.label}</p><p className={`text-2xl font-bold mt-1 ${stat.color === 'emerald' ? 'text-emerald-400' : stat.color === 'red' ? 'text-red-400' : stat.color === 'amber' ? 'text-amber-400' : 'text-blue-400'}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800"><h3 className="text-lg font-semibold text-white">Compliance Requirements</h3></div>
        <div className="divide-y divide-slate-800">
          {requirements.map((req, i) => (
            <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-800/30">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${req.status === 'compliant' ? 'bg-emerald-500/20' : 'bg-amber-500/20'}`}>
                  {req.status === 'compliant' ? <CheckCircle className="w-6 h-6 text-emerald-400" /> : <AlertTriangle className="w-6 h-6 text-amber-400" />}
                </div>
                <div>
                  <p className="text-white font-medium">{req.name}</p>
                  <div className="flex gap-4 mt-1">
                    <span className="text-slate-500 text-sm">Last: {req.lastReview}</span>
                    <span className="text-slate-500 text-sm">Next: {req.nextReview}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={req.status === 'compliant' ? 'success' : 'warning'}>{req.status.replace('_', ' ')}</Badge>
                <Button variant="secondary" size="sm" icon={<Eye className="w-4 h-4" />}>Review</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
