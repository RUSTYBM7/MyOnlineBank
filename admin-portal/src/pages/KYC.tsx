import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, FileCheck, CheckCircle, XCircle, Clock, Eye, AlertTriangle, Download, Shield, RefreshCw, Loader2 } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import { Button, Badge } from '@/components/ui';

export default function KYC() {
  const { kycApplications, approveKYC, rejectKYC, requestKYCDocs, fetchKYC, isLoading } = useAdminStore();

  useEffect(() => {
    fetchKYC();
  }, [fetchKYC]);

  const [search, setSearch] = useState('');

  const stats = {
    pending: kycApplications.filter(k => k.status === 'pending').length,
    under_review: kycApplications.filter(k => k.status === 'under_review').length,
    approved: kycApplications.filter(k => k.status === 'approved').length,
    needs_docs: kycApplications.filter(k => k.status === 'needs_docs').length,
  };

  const filtered = kycApplications.filter(k =>
    k.memberName.toLowerCase().includes(search.toLowerCase()) || k.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">KYC Review Center</h1><p className="text-slate-400 text-sm mt-1">Review and verify member identity documents</p></div>
        <Button variant="secondary" icon={<Download className="w-4 h-4" />}>Export Report</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Pending Review', value: stats.pending, color: 'amber' },
          { label: 'Under Review', value: stats.under_review, color: 'blue' },
          { label: 'Approved', value: stats.approved, color: 'emerald' },
          { label: 'Need Documents', value: stats.needs_docs, color: 'red' },
        ].map((s, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-500 text-sm">{s.label}</p><p className="text-2xl font-bold text-white mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search applications..." className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50" />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="divide-y divide-slate-800">
          {filtered.map(kyc => (
            <div key={kyc.id} className="p-6 hover:bg-slate-800/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <span className="text-white font-bold">{kyc.memberName.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{kyc.memberName}</p>
                    <p className="text-slate-500 text-sm">{kyc.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-slate-400 text-sm">Application Type</p>
                    <p className="text-white capitalize">{kyc.type.replace('_', ' ')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-sm">Risk Score</p>
                    <p className={`font-medium ${kyc.riskScore > 50 ? 'text-red-400' : kyc.riskScore > 30 ? 'text-amber-400' : 'text-emerald-400'}`}>{kyc.riskScore}</p>
                  </div>
                  <Badge variant={kyc.status === 'approved' ? 'success' : kyc.status === 'pending' ? 'warning' : 'danger'}>{kyc.status.replace('_', ' ')}</Badge>
                  <div className="flex gap-2">
                    {kyc.status === 'pending' && (
                      <>
                        <Button variant="success" size="sm" onClick={() => approveKYC(kyc.id)} icon={<CheckCircle className="w-4 h-4" />}>Approve</Button>
                        <Button variant="danger" size="sm" onClick={() => rejectKYC(kyc.id)} icon={<XCircle className="w-4 h-4" />}>Reject</Button>
                        <Button variant="secondary" size="sm" onClick={() => requestKYCDocs(kyc.id)} icon={<AlertTriangle className="w-4 h-4" />}>Request Docs</Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                {kyc.documents.map((doc, i) => (
                  <span key={i} className={`px-3 py-1 rounded-full text-xs font-medium ${doc.status === 'verified' ? 'bg-emerald-500/20 text-emerald-400' : doc.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {doc.type}: {doc.status}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
