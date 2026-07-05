import { useState, useEffect } from 'react';
import { Search, Plus, Users, Download, Mail, Eye, Edit, MoreVertical, RefreshCw, Loader2 } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import type { Employee } from '@/store/adminStore';
import { Button, Badge, Table } from '@/components/ui';

export default function Employees() {
  const { employees, fetchEmployees, isLoading } = useAdminStore();

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const [search, setSearch] = useState('');

  const filtered = employees.filter(e =>
    e.firstName.toLowerCase().includes(search.toLowerCase()) || e.lastName.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { key: 'name', header: 'Employee', render: (e: Employee) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
          <span className="text-white font-medium text-sm">{e.firstName[0]}{e.lastName[0]}</span>
        </div>
        <div><p className="text-white font-medium">{e.firstName} {e.lastName}</p><p className="text-slate-500 text-xs">{e.email}</p></div>
      </div>
    )},
    { key: 'role', header: 'Role', render: (e: Employee) => <span className="text-slate-300">{e.role}</span> },
    { key: 'department', header: 'Department', render: (e: Employee) => <span className="text-slate-400">{e.department}</span> },
    { key: 'branch', header: 'Branch', render: (e: Employee) => <span className="text-slate-400">{e.branch}</span> },
    { key: 'status', header: 'Status', render: (e: Employee) => <Badge variant={e.status === 'active' ? 'success' : e.status === 'on_leave' ? 'warning' : 'default'}>{e.status.replace('_', ' ')}</Badge> },
    { key: 'lastActive', header: 'Last Active', render: (e: Employee) => <span className="text-slate-400 text-sm">{e.lastActive}</span> },
    { key: 'actions', header: 'Actions', render: (e: Employee) => (
      <div className="flex items-center gap-2">
        <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><Eye className="w-4 h-4" /></button>
        <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><Edit className="w-4 h-4" /></button>
      </div>
    )}
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Employees</h1><p className="text-slate-400 text-sm mt-1">Manage staff accounts and permissions</p></div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" icon={<Download className="w-4 h-4" />}>Export</Button>
          <Button variant="primary" icon={<Plus className="w-4 h-4" />}>Add Employee</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Employees', value: employees.length },
          { label: 'Active', value: employees.filter(e => e.status === 'active').length },
          { label: 'On Leave', value: employees.filter(e => e.status === 'on_leave').length },
          { label: 'Departments', value: [...new Set(employees.map(e => e.department))].length },
        ].map((s, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-500 text-sm">{s.label}</p><p className="text-2xl font-bold text-white mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employees..." className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50" />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <Table columns={columns} data={filtered} keyExtractor={e => e.id} emptyMessage="No employees found" />
      </div>
    </div>
  );
}
