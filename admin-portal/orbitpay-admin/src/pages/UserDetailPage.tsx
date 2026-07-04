import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Shield, CreditCard, Receipt, FileText, AlertTriangle, Ban, CheckCircle } from 'lucide-react';

const mockUserDetail = {
  id: 'USR001',
  name: 'Michael Chen',
  email: 'michael.chen@email.com',
  phone: '+1 (555) 123-4567',
  location: 'New York, NY 10001, USA',
  memberSince: '2023-06-15',
  lastActive: '2 hours ago',
  status: 'active',
  accountType: 'Premium',
  balance: '$45,892.50',
  kycStatus: 'verified',
  occupation: 'Software Engineer',
  employer: 'Tech Innovations Inc.',
  annualIncome: '$125,000',
  riskLevel: 'Low'
};

const userTransactions = [
  { id: 'TXN001', type: 'Transfer', amount: '-$2,500.00', date: '2024-01-15', status: 'Completed' },
  { id: 'TXN002', type: 'Deposit', amount: '+$5,000.00', date: '2024-01-14', status: 'Completed' },
  { id: 'TXN003', type: 'Payment', amount: '-$892.50', date: '2024-01-13', status: 'Completed' },
  { id: 'TXN004', type: 'Withdrawal', amount: '-$1,200.00', date: '2024-01-12', status: 'Completed' },
];

const UserDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/users')}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white">User Details</h1>
          <p className="text-slate-400">ID: {id}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-all">
            <CheckCircle className="w-5 h-5" />
            Approve
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 font-medium rounded-xl transition-all">
            <Ban className="w-5 h-5" />
            Suspend
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - User Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-white">
                  {mockUserDetail.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white">{mockUserDetail.name}</h2>
              <p className="text-slate-400">{mockUserDetail.email}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  mockUserDetail.status === 'active'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-red-500/10 text-red-400'
                }`}>
                  {mockUserDetail.status.charAt(0).toUpperCase() + mockUserDetail.status.slice(1)}
                </span>
                <span className="px-3 py-1 text-sm font-medium bg-emerald-500/10 text-emerald-400 rounded-full">
                  {mockUserDetail.accountType}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-300">
                <Mail className="w-5 h-5 text-slate-500" />
                <span>{mockUserDetail.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Phone className="w-5 h-5 text-slate-500" />
                <span>{mockUserDetail.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <MapPin className="w-5 h-5 text-slate-500" />
                <span>{mockUserDetail.location}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Calendar className="w-5 h-5 text-slate-500" />
                <span>Member since {mockUserDetail.memberSince}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Shield className="w-5 h-5 text-slate-500" />
                <span>KYC: {mockUserDetail.kycStatus}</span>
              </div>
            </div>
          </div>

          {/* Balance Card */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Account Balance</h3>
            <p className="text-4xl font-bold text-emerald-400">{mockUserDetail.balance}</p>
            <p className="text-slate-400 text-sm mt-1">Available Balance</p>
          </div>

          {/* Risk Assessment */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Risk Assessment</h3>
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400">Risk Level</span>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                mockUserDetail.riskLevel === 'Low'
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : mockUserDetail.riskLevel === 'Medium'
                  ? 'bg-amber-500/10 text-amber-400'
                  : 'bg-red-500/10 text-red-400'
              }`}>
                {mockUserDetail.riskLevel}
              </span>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Account Age</span>
                  <span className="text-white">6 months</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Transaction Volume</span>
                  <span className="text-white">Normal</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">KYC Compliance</span>
                  <span className="text-white">Verified</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-400">Occupation</p>
                <p className="text-white font-medium">{mockUserDetail.occupation}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Employer</p>
                <p className="text-white font-medium">{mockUserDetail.employer}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Annual Income</p>
                <p className="text-white font-medium">{mockUserDetail.annualIncome}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Last Active</p>
                <p className="text-white font-medium">{mockUserDetail.lastActive}</p>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
              <button className="text-sm text-emerald-400 hover:text-emerald-300">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {userTransactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-400">{txn.id}</td>
                      <td className="px-6 py-4 text-sm text-white">{txn.type}</td>
                      <td className={`px-6 py-4 text-sm font-medium ${
                        txn.amount.startsWith('+') ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {txn.amount}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">{txn.date}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-400 rounded-full">
                          {txn.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Activity Log</h3>
            <div className="space-y-4">
              {[
                { action: 'Login', details: 'Web browser - Chrome on Windows', time: '2 hours ago' },
                { action: 'Transfer', details: 'Sent $2,500 to John Smith', time: '1 day ago' },
                { action: 'Profile Update', details: 'Updated phone number', time: '3 days ago' },
                { action: 'KYC Verification', details: 'Identity documents verified', time: '1 week ago' },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-4 pb-4 border-b border-slate-700/30 last:border-0">
                  <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500"></div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{activity.action}</p>
                    <p className="text-sm text-slate-400">{activity.details}</p>
                  </div>
                  <span className="text-xs text-slate-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
