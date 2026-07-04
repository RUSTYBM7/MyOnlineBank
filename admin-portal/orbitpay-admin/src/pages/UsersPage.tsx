import { useState } from 'react';
import { Search, Filter, MoreVertical, UserPlus, Mail, Phone, MapPin, Calendar, Shield, Eye, Ban, Trash2 } from 'lucide-react';

const mockUsers = [
  {
    id: 'USR001',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
    memberSince: '2023-06-15',
    status: 'active',
    accountType: 'Premium',
    balance: '$45,892.50',
    kycStatus: 'verified'
  },
  {
    id: 'USR002',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1 (555) 234-5678',
    location: 'Los Angeles, USA',
    memberSince: '2023-08-22',
    status: 'active',
    accountType: 'Standard',
    balance: '$12,450.00',
    kycStatus: 'verified'
  },
  {
    id: 'USR003',
    name: 'David Williams',
    email: 'david.w@email.com',
    phone: '+1 (555) 345-6789',
    location: 'Chicago, USA',
    memberSince: '2023-11-10',
    status: 'pending',
    accountType: 'Standard',
    balance: '$0.00',
    kycStatus: 'pending'
  },
  {
    id: 'USR004',
    name: 'Emily Brown',
    email: 'emily.b@email.com',
    phone: '+1 (555) 456-7890',
    location: 'Houston, USA',
    memberSince: '2022-03-05',
    status: 'active',
    accountType: 'Premium',
    balance: '$78,234.00',
    kycStatus: 'verified'
  },
  {
    id: 'USR005',
    name: 'James Wilson',
    email: 'james.w@email.com',
    phone: '+1 (555) 567-8901',
    location: 'Phoenix, USA',
    memberSince: '2023-01-18',
    status: 'suspended',
    accountType: 'Standard',
    balance: '$3,200.00',
    kycStatus: 'rejected'
  }
];

const UsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Users</h1>
          <p className="text-slate-400 mt-1">Manage and view all registered members</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-all">
          <UserPlus className="w-5 h-5" />
          Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: '52,847', color: 'emerald' },
          { label: 'Active', value: '48,291', color: 'teal' },
          { label: 'Pending', value: '2,156', color: 'amber' },
          { label: 'Suspended', value: '2,400', color: 'red' }
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
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Status Filter */}
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
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Account Type</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Balance</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">KYC Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Member Since</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                        <span className="text-sm font-bold text-white">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-300">{user.accountType}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-white">{user.balance}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.kycStatus === 'verified'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : user.kycStatus === 'pending'
                        ? 'bg-amber-500/10 text-amber-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}>
                      {user.kycStatus.charAt(0).toUpperCase() + user.kycStatus.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : user.status === 'pending'
                        ? 'bg-amber-500/10 text-amber-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-400">{user.memberSince}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors">
                        <Ban className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
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
            Showing <span className="text-white">1-10</span> of <span className="text-white">52,847</span> users
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-sm text-slate-400 hover:text-white disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-1 text-sm bg-emerald-500/20 text-emerald-400 rounded">1</button>
            <button className="px-3 py-1 text-sm text-slate-400 hover:text-white">2</button>
            <button className="px-3 py-1 text-sm text-slate-400 hover:text-white">3</button>
            <span className="px-2 text-slate-500">...</span>
            <button className="px-3 py-1 text-sm text-slate-400 hover:text-white">528</button>
            <button className="px-3 py-1 text-sm text-emerald-400 hover:text-white">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
