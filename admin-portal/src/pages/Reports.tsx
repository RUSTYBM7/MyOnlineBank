import { FileText, Download, BarChart3, PieChart, LineChart, Table, Calendar } from 'lucide-react';
import { Button, Badge } from '@/components/ui';

export default function Reports() {
  const reports = [
    { name: 'Monthly Member Report', type: 'Members', lastGenerated: '2024-01-01', format: 'PDF' },
    { name: 'Transaction Summary', type: 'Transactions', lastGenerated: '2024-01-15', format: 'Excel' },
    { name: 'Loan Portfolio Analysis', type: 'Loans', lastGenerated: '2024-01-10', format: 'PDF' },
    { name: 'KYC Compliance Report', type: 'Compliance', lastGenerated: '2024-01-05', format: 'PDF' },
    { name: 'Fraud Detection Summary', type: 'Security', lastGenerated: '2024-01-12', format: 'Excel' },
    { name: 'Branch Performance', type: 'Operations', lastGenerated: '2024-01-08', format: 'PDF' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Reports & Analytics</h1><p className="text-slate-400 text-sm mt-1">Generate and export business reports</p></div>
        <Button variant="primary" icon={<FileText className="w-4 h-4" />}>Generate Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Reports', value: 24, icon: FileText, color: 'blue' },
          { label: 'Generated This Month', value: 8, icon: Calendar, color: 'emerald' },
          { label: 'Scheduled Reports', value: 5, icon: LineChart, color: 'amber' },
          { label: 'Exports', value: 156, icon: Download, color: 'purple' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/20 flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
              </div>
              <p className="text-slate-500 text-sm">{stat.label}</p>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Available Reports</h3>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">All</Button>
            <Button variant="ghost" size="sm">Members</Button>
            <Button variant="ghost" size="sm">Transactions</Button>
            <Button variant="ghost" size="sm">Financial</Button>
          </div>
        </div>
        <div className="divide-y divide-slate-800">
          {reports.map((report, i) => (
            <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-800/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
                  {report.type === 'Members' ? <BarChart3 className="w-6 h-6 text-slate-400" /> :
                   report.type === 'Transactions' ? <Table className="w-6 h-6 text-slate-400" /> :
                   <PieChart className="w-6 h-6 text-slate-400" />}
                </div>
                <div>
                  <p className="text-white font-medium">{report.name}</p>
                  <p className="text-slate-500 text-sm">{report.type} - Last generated: {report.lastGenerated}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="default">{report.format}</Badge>
                <Button variant="secondary" size="sm" icon={<Download className="w-4 h-4" />}>Download</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
