import { useEffect } from 'react';
import { Building2, Plus, MapPin, Users, DollarSign, Download, Edit, Eye, RefreshCw } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import { Button, Badge } from '@/components/ui';

export default function Branches() {
  const { branches, fetchBranches, isLoading } = useAdminStore();

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Branches</h1><p className="text-slate-400 text-sm mt-1">Manage branch locations and operations</p></div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />}>Add Branch</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map(branch => (
          <div key={branch.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-emerald-400" />
              </div>
              <Badge variant={branch.status === 'active' ? 'success' : 'default'}>{branch.status}</Badge>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">{branch.name}</h3>
            <p className="text-slate-500 text-sm mb-4 flex items-center gap-1"><MapPin className="w-4 h-4" />{branch.address}</p>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-white font-bold">{branch.staffCount}</p>
                <p className="text-slate-500 text-xs">Staff</p>
              </div>
              <div className="text-center">
                <p className="text-white font-bold">{branch.memberCount.toLocaleString()}</p>
                <p className="text-slate-500 text-xs">Members</p>
              </div>
              <div className="text-center">
                <p className="text-emerald-400 font-bold">${(branch.totalDeposits / 1000000).toFixed(1)}M</p>
                <p className="text-slate-500 text-xs">Deposits</p>
              </div>
            </div>
            <div className="border-t border-slate-800 pt-4">
              <p className="text-slate-400 text-sm"><span className="text-slate-500">Manager:</span> <span className="text-white">{branch.manager}</span></p>
              <p className="text-slate-400 text-sm"><span className="text-slate-500">Code:</span> <span className="text-white font-mono">{branch.code}</span></p>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="secondary" size="sm" className="flex-1" icon={<Eye className="w-4 h-4" />}>View</Button>
              <Button variant="secondary" size="sm" className="flex-1" icon={<Edit className="w-4 h-4" />}>Edit</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
