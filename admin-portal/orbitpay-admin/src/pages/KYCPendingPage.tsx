import { useState } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, Clock, FileText, Upload, User, Calendar, MapPin, Briefcase, Phone } from 'lucide-react';

const mockKYCApplications = [
  { id: 'KYC001', name: 'Robert Martinez', email: 'robert.m@email.com', phone: '+1 (555) 111-2222', type: 'New Account', submitted: '2 hours ago', documents: ['ID Card', 'Proof of Address', 'Selfie'] },
  { id: 'KYC002', name: 'Jennifer Lee', email: 'jennifer.l@email.com', phone: '+1 (555) 222-3333', type: 'Document Update', submitted: '3 hours ago', documents: ['Passport', 'Utility Bill'] },
  { id: 'KYC003', name: 'William Taylor', email: 'william.t@email.com', phone: '+1 (555) 333-4444', type: 'New Account', submitted: '5 hours ago', documents: ['Driver License', 'Bank Statement'] },
  { id: 'KYC004', name: 'Lisa Anderson', email: 'lisa.a@email.com', phone: '+1 (555) 444-5555', type: 'Upgrade Account', submitted: '8 hours ago', documents: ['ID Card', 'Income Proof', 'Selfie'] },
  { id: 'KYC005', name: 'Christopher Davis', email: 'chris.d@email.com', phone: '+1 (555) 555-6666', type: 'New Account', submitted: '1 day ago', documents: ['Passport', 'Proof of Address'] },
];

const KYCPendingPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKYC, setSelectedKYC] = useState<typeof mockKYCApplications[0] | null>(null);
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredKYC = mockKYCApplications.filter(kyc => {
    const matchesSearch = kyc.name.toLowerCase().includes(searchTerm.toLowerCase()) || kyc.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || kyc.type.toLowerCase().includes(typeFilter.toLowerCase());
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">KYC Verification</h1>
          <p className="text-slate-400 mt-1">Review and approve identity verification applications</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <Clock className="w-5 h-5" />
            {mockKYCApplications.length} Pending
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Pending Review', value: '12', color: 'amber' },
          { label: 'Approved Today', value: '28', color: 'emerald' },
          { label: 'Rejected Today', value: '5', color: 'red' },
          { label: 'Avg. Review Time', value: '2.5h', color: 'teal' }
        ].map((stat) => (
          <div key={stat.label} className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
            <p className="text-slate-400 text-sm">{stat.label}</p>
            <p className={`text-2xl font-bold text-${stat.color}-400 mt-1`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* KYC List */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-700/50">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Types</option>
                <option value="new">New Account</option>
                <option value="update">Document Update</option>
                <option value="upgrade">Upgrade Account</option>
              </select>
            </div>
          </div>

          <div className="divide-y divide-slate-700/50 max-h-[600px] overflow-y-auto">
            {filteredKYC.map((kyc) => (
              <div
                key={kyc.id}
                onClick={() => setSelectedKYC(kyc)}
                className={`p-4 cursor-pointer hover:bg-slate-800/30 transition-colors ${
                  selectedKYC?.id === kyc.id ? 'bg-emerald-500/10 border-l-2 border-emerald-500' : ''
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {kyc.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{kyc.name}</p>
                    <p className="text-xs text-slate-400">{kyc.email}</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-amber-500/10 text-amber-400 rounded-full">
                    {kyc.type}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>ID: {kyc.id}</span>
                  <span>{kyc.submitted}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KYC Details */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
          {selectedKYC ? (
            <>
              <div className="p-6 border-b border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Application Details</h3>
                  <span className="px-3 py-1 text-sm font-medium bg-amber-500/10 text-amber-400 rounded-full">
                    Pending Review
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">
                      {selectedKYC.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">{selectedKYC.name}</p>
                    <p className="text-slate-400">{selectedKYC.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Phone className="w-4 h-4 text-slate-500" />
                    <span className="text-sm">{selectedKYC.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span className="text-sm">{selectedKYC.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span className="text-sm">Submitted {selectedKYC.submitted}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span className="text-sm">ID: {selectedKYC.id}</span>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="p-6 border-b border-slate-700/50">
                <h4 className="text-sm font-medium text-white mb-4">Submitted Documents</h4>
                <div className="grid grid-cols-2 gap-3">
                  {selectedKYC.documents.map((doc, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-xl">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-emerald-400" />
                      </div>
                      <span className="text-sm text-white">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="p-6">
                <p className="text-sm text-slate-400 mb-4">Review the documents above and take action:</p>
                <div className="flex gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-all">
                    <CheckCircle className="w-5 h-5" />
                    Approve
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 font-medium rounded-xl transition-all">
                    <XCircle className="w-5 h-5" />
                    Reject
                  </button>
                </div>
                <button className="w-full mt-3 py-3 text-center text-slate-400 hover:text-white text-sm">
                  Request Additional Documents
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                <User className="w-10 h-10 text-slate-600" />
              </div>
              <p className="text-slate-400">Select an application to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KYCPendingPage;
