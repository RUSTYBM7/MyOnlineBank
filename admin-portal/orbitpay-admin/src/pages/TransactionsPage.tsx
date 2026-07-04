import { useState } from 'react';
import { Search, Filter, Download, Eye, CheckCircle, XCircle, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const mockTransactions = [
  { id: 'TXN001234', user: 'Michael Chen', email: 'michael.chen@email.com', type: 'Transfer', amount: '-$5,250.00', fee: '$2.50', status: 'Completed', date: '2024-01-15 14:32', method: 'Internal' },
  { id: 'TXN001233', user: 'Sarah Johnson', email: 'sarah.j@email.com', type: 'Payment', amount: '-$892.50', fee: '$0.00', status: 'Completed', date: '2024-01-15 13:45', method: 'Card' },
  { id: 'TXN001232', user: 'David Williams', email: 'david.w@email.com', type: 'Deposit', amount: '+$15,000.00', fee: '$0.00', status: 'Completed', date: '2024-01-15 12:20', method: 'Wire' },
  { id: 'TXN001231', user: 'Emily Brown', email: 'emily.b@email.com', type: 'Withdrawal', amount: '-$2,100.00', fee: '$1.00', status: 'Pending', date: '2024-01-15 11:55', method: 'ATM' },
  { id: 'TXN001230', user: 'James Wilson', email: 'james.w@email.com', type: 'Transfer', amount: '-$8,750.00', fee: '$4.25', status: 'Completed', date: '2024-01-15 10:30', method: 'Internal' },
  { id: 'TXN001229', user: 'Jennifer Lee', email: 'jennifer.l@email.com', type: 'Payment', amount: '-$450.00', fee: '$0.00', status: 'Failed', date: '2024-01-15 09:15', method: 'Card' },
  { id: 'TXN001228', user: 'Robert Martinez', email: 'robert.m@email.com', type: 'Deposit', amount: '+$3,200.00', fee: '$0.00', status: 'Completed', date: '2024-01-14 18:00', method: 'ACH' },
];

const TransactionsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTransactions = mockTransactions.filter(txn => {
    const matchesSearch = txn.user.toLowerCase().includes(searchTerm.toLowerCase()) || txn.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || txn.type.toLowerCase() === typeFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || txn.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Transactions</h1>
          <p className="text-slate-400 mt-1">View and manage all financial transactions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-all">
          <Download className="w-5 h-5" />
          Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Volume', value: '$2.5M', color: 'emerald' },
          { label: 'Transactions', value: '12,847', color: 'teal' },
          { label: 'Pending', value: '127', color: 'amber' },
          { label: 'Failed', value: '23', color: 'red' }
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
              placeholder="Search by user or transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Types</option>
              <option value="transfer">Transfer</option>
              <option value="payment">Payment</option>
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Transaction</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Fee</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Method</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-white">{txn.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-white">{txn.user}</p>
                      <p className="text-xs text-slate-400">{txn.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {txn.type === 'Deposit' || txn.type === 'Transfer' && txn.amount.startsWith('+') ? (
                        <ArrowDownRight className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-red-400" />
                      )}
                      <span className="text-sm text-slate-300">{txn.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${
                      txn.amount.startsWith('+') ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {txn.amount}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-400">{txn.fee}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-300">{txn.method}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full flex w-fit ${
                      txn.status === 'Completed'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : txn.status === 'Pending'
                        ? 'bg-amber-500/10 text-amber-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}>
                      {txn.status === 'Completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {txn.status === 'Pending' && <Clock className="w-3 h-3 mr-1" />}
                      {txn.status === 'Failed' && <XCircle className="w-3 h-3 mr-1" />}
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-400">{txn.date}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-700/50 flex items-center justify-between">
          <p className="text-sm text-slate-400">
            Showing <span className="text-white">1-10</span> of <span className="text-white">12,847</span> transactions
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

export default TransactionsPage;
