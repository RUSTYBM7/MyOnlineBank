import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Mail, Calendar, Filter, Search, FileSpreadsheet, FileType, Stamp, Check } from 'lucide-react';
import * as api from '@/lib/api';

const formats = [
  { id: 'PDF', label: 'PDF', icon: FileType, desc: 'Standard PDF document' },
  { id: 'PDF Watermarked', label: 'PDF + Watermark', icon: Stamp, desc: 'PDF with OrbitPay watermark for legal use' },
  { id: 'CSV', label: 'CSV', icon: FileSpreadsheet, desc: 'Comma-separated for spreadsheets' },
  { id: 'Excel', label: 'Excel', icon: FileSpreadsheet, desc: 'Microsoft Excel format' },
];

const periods = [
  { id: 'monthly-current', label: 'Current Month', range: '2025-01-01 to 2025-01-31' },
  { id: 'monthly-prev', label: 'Previous Month', range: '2024-12-01 to 2024-12-31' },
  { id: 'quarterly-q4', label: 'Q4 2024', range: '2024-10-01 to 2024-12-31' },
  { id: 'quarterly-q3', label: 'Q3 2024', range: '2024-07-01 to 2024-09-30' },
  { id: 'yearly-2024', label: 'Year 2024', range: '2024-01-01 to 2024-12-31' },
  { id: 'custom', label: 'Custom Range', range: 'Pick dates' },
];

export default function Statements() {
  const [statements, setStatements] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [showGenerate, setShowGenerate] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ accountId: '', period: 'monthly-current', format: 'PDF Watermarked' as 'PDF' | 'CSV' | 'Excel' | 'PDF Watermarked', emailTo: '' });

  useEffect(() => {
    api.statementsApi.getAll().then((r: any) => setStatements(r.data || []));
    api.accountsApi.getAll().then((r: any) => setAccounts((r.data || []).slice(0, 50)));
  }, []);

  const generate = async () => {
    if (!form.accountId) return;
    const result: any = await api.statementsApi.generate(form.accountId, { period: form.period }, form.format);
    if (result.success) {
      setStatements([result.data, ...statements]);
      setShowGenerate(false);
    }
  };

  const emailStatement = async (id: string, email: string) => {
    await api.statementsApi.email(id, email);
    alert(`Statement ${id} emailed to ${email}`);
  };

  const filtered = statements.filter((s) =>
    s.memberName?.toLowerCase().includes(search.toLowerCase()) ||
    s.accountNumber?.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Statement Generator</h1>
          <p className="text-slate-400 mt-1">Generate PDF, CSV, Excel statements with custom date ranges and watermarks</p>
        </div>
        <button onClick={() => setShowGenerate(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Generate Statement
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Statements Generated', value: statements.length, color: 'blue' },
          { label: 'Sent This Month', value: statements.filter((s) => new Date(s.generatedAt).getMonth() === new Date().getMonth()).length, color: 'emerald' },
          { label: 'PDF Watermarked', value: statements.filter((s) => s.format === 'PDF Watermarked').length, color: 'purple' },
          { label: 'Total Volume', value: '14.2K', color: 'amber' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-5">
            <p className="text-slate-400 text-sm">{s.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by account number or member name..."
            className="w-full pl-10 pr-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500" />
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-900/30 text-slate-400 text-sm">
            <tr>
              <th className="text-left py-3 px-4">Statement ID</th>
              <th className="text-left py-3 px-4">Account</th>
              <th className="text-left py-3 px-4">Member</th>
              <th className="text-left py-3 px-4">Period</th>
              <th className="text-left py-3 px-4">Format</th>
              <th className="text-right py-3 px-4">Transactions</th>
              <th className="text-right py-3 px-4">Closing</th>
              <th className="text-left py-3 px-4">Generated</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-t border-slate-700/50 hover:bg-slate-700/20">
                <td className="py-3 px-4 text-white font-mono text-sm">{s.id}</td>
                <td className="py-3 px-4 text-slate-300 text-sm font-mono">****{s.accountNumber?.slice(-4)}</td>
                <td className="py-3 px-4 text-slate-300 text-sm">{s.memberName}</td>
                <td className="py-3 px-4 text-slate-300 text-sm">{s.period}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 text-xs rounded-full bg-slate-700 text-slate-300">{s.format}</span>
                </td>
                <td className="py-3 px-4 text-right text-slate-300 text-sm">{s.transactionCount}</td>
                <td className="py-3 px-4 text-right text-white text-sm">${s.closingBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                <td className="py-3 px-4 text-slate-400 text-sm">{new Date(s.generatedAt).toLocaleString()}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-500/20 text-emerald-300">{s.status}</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex gap-1 justify-end">
                    <button className="p-1.5 text-slate-400 hover:text-white"><Download className="w-4 h-4" /></button>
                    <button onClick={() => emailStatement(s.id, 'user@orbitpay.demo')} className="p-1.5 text-slate-400 hover:text-white"><Mail className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showGenerate && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowGenerate(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 border border-slate-700 rounded-2xl max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">Generate Statement</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Account</label>
                <select value={form.accountId} onChange={(e) => setForm({ ...form, accountId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white">
                  <option value="">Select account...</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>****{a.accountNumber?.slice(-4)} — {a.memberName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Period</label>
                <div className="grid grid-cols-2 gap-2">
                  {periods.map((p) => (
                    <label key={p.id} className={`flex items-start gap-2 p-2.5 border rounded-lg cursor-pointer ${
                      form.period === p.id ? 'bg-blue-500/10 border-blue-500/50' : 'bg-slate-900/30 border-slate-700'
                    }`}>
                      <input type="radio" name="period" checked={form.period === p.id} onChange={() => setForm({ ...form, period: p.id })}
                        className="mt-1" />
                      <div>
                        <p className="text-sm text-white">{p.label}</p>
                        <p className="text-xs text-slate-400">{p.range}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Format</label>
                <div className="grid grid-cols-2 gap-2">
                  {formats.map((f) => (
                    <label key={f.id} className={`flex items-center gap-2 p-2.5 border rounded-lg cursor-pointer ${
                      form.format === f.id ? 'bg-blue-500/10 border-blue-500/50' : 'bg-slate-900/30 border-slate-700'
                    }`}>
                      <input type="radio" name="format" checked={form.format === f.id} onChange={() => setForm({ ...form, format: f.id as any })}
                        className="rounded" />
                      <f.icon className="w-4 h-4 text-blue-400" />
                      <div>
                        <p className="text-sm text-white">{f.label}</p>
                        <p className="text-xs text-slate-400">{f.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email to (optional)</label>
                <input value={form.emailTo} onChange={(e) => setForm({ ...form, emailTo: e.target.value })}
                  placeholder="user@example.com"
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500" />
              </div>
            </div>
            <div className="p-6 border-t border-slate-700 flex justify-end gap-2">
              <button onClick={() => setShowGenerate(false)} className="px-4 py-2 text-slate-300 hover:bg-slate-700 rounded-lg">Cancel</button>
              <button onClick={generate} disabled={!form.accountId}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50">
                Generate
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}