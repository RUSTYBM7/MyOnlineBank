import { useState } from 'react';
import { Search, Filter, DollarSign, Plus, Eye, CheckCircle, XCircle, Clock, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';

const mockLoans = [
  { id: 'LOAN001', user: 'Michael Chen', email: 'michael.chen@email.com', type: 'Personal Loan', amount: '$50,000', interest: '8.5%', term: '36 months', status: 'active', monthly: '$1,580', remaining: '$32,450', paid: '$17,550' },
  { id: 'LOAN002', user: 'Sarah Johnson', email: 'sarah.j@email.com', type: 'Auto Loan', amount: '$25,000', interest: '5.9%', term: '60 months', status: 'active', monthly: '$480', remaining: '$18,240', paid: '$6,760' },
  { id: 'LOAN003', user: 'Emily Brown', email: 'emily.b@email.com', type: 'Home Mortgage', amount: '$350,000', interest: '4.2%', term: '360 months', status: 'active', monthly: '$1,710', remaining: '$320,000', paid: '$30,000' },
  { id: 'LOAN004', user: 'David Williams', email: 'david.w@email.com', type: 'Business Loan', amount: '$100,000', interest: '7.2%', term: '48 months', status: 'pending', monthly: '$2,400', remaining: '$100,000', paid: '$0' },
  { id: 'LOAN005', user: 'James Wilson', email: 'james.w@email.com', type: 'Student Loan', amount: '$30,000', interest: '4.0%', term: '120 months', status: 'overdue', monthly: '$303', remaining: '$24,500', paid: '$5,500' },
];

const LoansPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredLoans = mockLoans.filter(loan => {
    const matchesSearch = loan.user.toLowerCase().includes(searchTerm.toLowerCase()) || loan.id.toLowerCase().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;
    const matchesType = typeFilter === 'all' || loan.type.toLowerCase().includes(typeFilter.toLowerCase());
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Loans Management</h1>
          <p className="text-slate-400 mt-1">Manage and track all loan applications and active loans</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-all">
          <Plus className="w-5 h-5" />
          New Loan
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Loan Portfolio', value: '$12.5M', color: 'emerald' },
          { label: 'Active Loans', value: '1,847', color: 'teal' },
          { label: 'Pending Approval', value: '45', color: 'amber' },
          { label: 'Overdue Payments', value: '23', color: 'red' }
        ].map((stat) => (
          <div key={stat.label} className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
            <p className="text-slate-400 text-sm">{stat.label}</p>
            <p className={`text-2xl font-bold text-${stat.color}-400 mt-1`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by user or loan ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="paid">Paid Off</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Types</option>
              <option value="personal">Personal</option>
              <option value="auto">Auto</option>
              <option value="home">Home</option>
              <option value="business">Business</option>
              <option value="student">Student</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loans Table */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Loan ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Borrower</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Interest</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Monthly</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Remaining</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredLoans.map((loan) => (
                <tr key={loan.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-white">{loan.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-white">{loan.user}</p>
                      <p className="text-xs text-slate-400">{loan.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-300">{loan.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-white">{loan.amount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-emerald-400">{loan.interest}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-white">{loan.monthly}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-24">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">{loan.remaining}</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${(parseFloat(loan.paid.replace(/[$,]/g, '')) / parseFloat(loan.amount.replace(/[$,]/g, ''))) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full flex w-fit ${
                      loan.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : loan.status === 'pending'
                        ? 'bg-amber-500/10 text-amber-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}>
                      {loan.status === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {loan.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                      {loan.status === 'overdue' && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      {loan.status === 'pending' && (
                        <>
                          <button className="p-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg transition-colors">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-700/50 flex items-center justify-between">
          <p className="text-sm text-slate-400">
            Showing <span className="text-white">1-5</span> of <span className="text-white">1,847</span> loans
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-sm text-slate-400 hover:text-white disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 text-sm bg-emerald-500/20 text-emerald-400 rounded">1</button>
            <button className="px-3 py-1 text-sm text-slate-400 hover:text-white">2</button>
            <button className="px-3 py-1 text-sm text-emerald-400 hover:text-white">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoansPage;
