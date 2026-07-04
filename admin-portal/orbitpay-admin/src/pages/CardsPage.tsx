import { useState } from 'react';
import { Search, Filter, CreditCard, Plus, Eye, Ban, RotateCcw, Lock, Unlock, MoreVertical } from 'lucide-react';

const mockCards = [
  { id: 'CARD001', user: 'Michael Chen', email: 'michael.chen@email.com', type: 'Premium Credit', last4: '4532', expiry: '12/26', status: 'active', limit: '$50,000', balance: '$12,450', cvv: '***' },
  { id: 'CARD002', user: 'Sarah Johnson', email: 'sarah.j@email.com', type: 'Standard Debit', last4: '8901', expiry: '08/25', status: 'active', limit: '$5,000', balance: '$2,340', cvv: '***' },
  { id: 'CARD003', user: 'Emily Brown', email: 'emily.b@email.com', type: 'Premium Credit', last4: '2345', expiry: '03/27', status: 'blocked', limit: '$75,000', balance: '$28,900', cvv: '***' },
  { id: 'CARD004', user: 'David Williams', email: 'david.w@email.com', type: 'Business Debit', last4: '6789', expiry: '11/26', status: 'active', limit: '$25,000', balance: '$8,750', cvv: '***' },
  { id: 'CARD005', user: 'James Wilson', email: 'james.w@email.com', type: 'Standard Credit', last4: '1234', expiry: '06/25', status: 'expired', limit: '$10,000', balance: '$0', cvv: '***' },
];

const CardsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredCards = mockCards.filter(card => {
    const matchesSearch = card.user.toLowerCase().includes(searchTerm.toLowerCase()) || card.last4.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || card.status === statusFilter;
    const matchesType = typeFilter === 'all' || card.type.toLowerCase().includes(typeFilter.toLowerCase());
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Cards Management</h1>
          <p className="text-slate-400 mt-1">Manage credit and debit cards</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-all">
          <Plus className="w-5 h-5" />
          Issue New Card
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Cards', value: '34,291', color: 'emerald' },
          { label: 'Active', value: '31,456', color: 'teal' },
          { label: 'Blocked', value: '1,234', color: 'amber' },
          { label: 'Expired', value: '1,601', color: 'red' }
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
              placeholder="Search by user or card last 4 digits..."
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
              <option value="blocked">Blocked</option>
              <option value="expired">Expired</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Types</option>
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.map((card) => (
          <div key={card.id} className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all">
            {/* Card Visual */}
            <div className={`p-6 ${
              card.status === 'blocked' ? 'bg-slate-800' :
              card.type.includes('Premium') ? 'bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800' :
              card.type.includes('Business') ? 'bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800' :
              'bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800'
            }`}>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white font-semibold">OrbitPay</span>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  card.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' :
                  card.status === 'blocked' ? 'bg-red-500/20 text-red-300' :
                  'bg-slate-500/20 text-slate-300'
                }`}>
                  {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
                </span>
              </div>
              <p className="text-white text-2xl font-mono tracking-wider mb-4">
                •••• •••• •••• {card.last4}
              </p>
              <div className="flex justify-between text-sm text-white/80">
                <div>
                  <p className="text-xs opacity-70">EXPIRES</p>
                  <p className="font-medium">{card.expiry}</p>
                </div>
                <div>
                  <p className="text-xs opacity-70">CVV</p>
                  <p className="font-medium">{card.cvv}</p>
                </div>
              </div>
            </div>

            {/* Card Details */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white font-medium">{card.user}</p>
                  <p className="text-sm text-slate-400">{card.email}</p>
                </div>
                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-slate-400">Card Type</p>
                  <p className="text-sm text-white">{card.type}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Card ID</p>
                  <p className="text-sm text-white font-mono">{card.id}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Credit Limit</p>
                  <p className="text-sm text-white">{card.limit}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Current Balance</p>
                  <p className="text-sm text-emerald-400">${card.balance}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                  <Eye className="w-4 h-4" />
                  View
                </button>
                {card.status === 'active' ? (
                  <button className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg transition-colors">
                    <Ban className="w-4 h-4" />
                    Block
                  </button>
                ) : card.status === 'blocked' ? (
                  <button className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg transition-colors">
                    <Unlock className="w-4 h-4" />
                    Unblock
                  </button>
                ) : (
                  <button className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                    <RotateCcw className="w-4 h-4" />
                    Replace
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardsPage;
