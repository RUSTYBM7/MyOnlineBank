import { Calculator, DollarSign, TrendingUp, TrendingDown, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui';

export default function Financial() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Financial Management</h1><p className="text-slate-400 text-sm mt-1">Revenue, expenses, and financial reports</p></div>
        <Button variant="secondary" icon={<Download className="w-4 h-4" />}>Export</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: '$2.4M', change: '+12.5%', icon: DollarSign, color: 'emerald' },
          { label: 'Total Expenses', value: '$890K', change: '+3.2%', icon: TrendingDown, color: 'red' },
          { label: 'Net Profit', value: '$1.5M', change: '+18.7%', icon: TrendingUp, color: 'emerald' },
          { label: 'Operating Margin', value: '62.5%', change: '+2.1%', icon: Calculator, color: 'blue' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/20 flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
              </div>
              <p className="text-slate-500 text-sm">{stat.label}</p>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-emerald-400 text-sm mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Revenue Breakdown</h3>
          <div className="space-y-4">
            {[
              { name: 'Interest Income', value: '$1.2M', percent: 50 },
              { name: 'Transaction Fees', value: '$480K', percent: 20 },
              { name: 'Loan Origination', value: '$360K', percent: 15 },
              { name: 'Card Services', value: '$240K', percent: 10 },
              { name: 'Other Income', value: '$120K', percent: 5 },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300">{item.name}</span>
                  <span className="text-white font-medium">${item.value}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Expense Breakdown</h3>
          <div className="space-y-4">
            {[
              { name: 'Staff Salaries', value: '$420K', percent: 47 },
              { name: 'Operations', value: '$180K', percent: 20 },
              { name: 'Technology', value: '$120K', percent: 14 },
              { name: 'Marketing', value: '$90K', percent: 10 },
              { name: 'Compliance', value: '$80K', percent: 9 },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300">{item.name}</span>
                  <span className="text-white font-medium">${item.value}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
