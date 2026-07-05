import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Shield, Check, X, Search, FileText, Lock, User } from 'lucide-react';
import * as api from '@/lib/api';

const verificationTypes = [
  { id: 'verified', label: 'Identity Verified', description: 'KYC approved by compliance team' },
  { id: 'premium', label: 'Premium Tier', description: 'High-balance customer with premium features' },
  { id: 'business_verified', label: 'Business Verified', description: 'Business account, EIN validated' },
  { id: 'corporate_verified', label: 'Corporate Verified', description: 'Corporate entity, full documentation' },
  { id: 'aml_cleared', label: 'AML Cleared', description: 'Anti-Money Laundering check passed' },
  { id: 'pep_cleared', label: 'PEP Cleared', description: 'Politically Exposed Person check passed' },
  { id: 'sanctions_cleared', label: 'Sanctions Cleared', description: 'OFAC/UN sanctions screening passed' },
  { id: 'tax_verified', label: 'Tax Verified', description: 'Tax ID validated with IRS/HMRC' },
  { id: 'income_verified', label: 'Income Verified', description: 'Income source documentation verified' },
  { id: 'phone_verified', label: 'Phone Verified', description: 'Phone number confirmed via SMS OTP' },
  { id: 'email_verified', label: 'Email Verified', description: 'Email address confirmed via link' },
  { id: 'address_verified', label: 'Address Verified', description: 'Address confirmed via utility bill' },
];

export default function Verification() {
  const [members, setMembers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    api.membersApi.getAll().then((r: any) => {
      const m = (r.data || []).slice(0, 100);
      setMembers(m);
      setSelected(m[0]);
    });
  }, []);

  const filtered = members.filter((m) =>
    m.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    m.lastName?.toLowerCase().includes(search.toLowerCase()) ||
    m.id?.includes(search)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Account Verification Center</h1>
        <p className="text-slate-400 mt-1">Toggle verification status across 12 dimensions per member</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Member list */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl">
          <div className="p-4 border-b border-slate-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search members..."
                className="w-full pl-10 pr-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500" />
            </div>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {filtered.map((m) => (
              <button key={m.id} onClick={() => setSelected(m)}
                className={`w-full text-left p-3 border-b border-slate-700/50 hover:bg-slate-700/30 flex items-center gap-3 ${selected?.id === m.id ? 'bg-slate-700/40 border-l-2 border-l-emerald-500' : ''}`}>
                <img src={m.avatar} alt="" className="w-9 h-9 rounded-full bg-slate-700" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white truncate">{m.firstName} {m.lastName}</div>
                  <div className="text-xs text-slate-400">{m.id}</div>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  {m.kycStatus === 'verified' && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                  {m.kycStatus === 'pending' && <ShieldAlert className="w-4 h-4 text-amber-400" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Verification toggles */}
        <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
          {selected ? (
            <>
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-700">
                <img src={selected.avatar} alt="" className="w-12 h-12 rounded-full bg-slate-700" />
                <div>
                  <h2 className="text-xl font-bold text-white">{selected.firstName} {selected.lastName}</h2>
                  <p className="text-sm text-slate-400">{selected.email} · {selected.id}</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-xs text-slate-400">Risk Score</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selected.riskScore < 30 ? 'bg-emerald-500/20 text-emerald-300' :
                    selected.riskScore < 70 ? 'bg-amber-500/20 text-amber-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>{selected.riskScore}/100</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {verificationTypes.map((v) => {
                  // Simulate verification status from member data
                  const verified = Math.random() > 0.3;
                  return (
                    <div key={v.id} className={`flex items-start gap-3 p-3 rounded-xl border ${
                      verified ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-slate-700/30 border-slate-700'
                    }`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        verified ? 'bg-emerald-500/20' : 'bg-slate-700'
                      }`}>
                        {verified ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-slate-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-white">{v.label}</p>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked={verified} className="sr-only peer" />
                            <div className="w-9 h-5 bg-slate-700 rounded-full peer peer-checked:bg-emerald-500 transition-colors"></div>
                            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
                          </label>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{v.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="h-96 flex items-center justify-center text-slate-500">
              Select a member
            </div>
          )}
        </div>
      </div>
    </div>
  );
}