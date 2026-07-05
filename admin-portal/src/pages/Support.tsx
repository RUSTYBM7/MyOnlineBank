import { Headphones, Plus, Search, Ticket, Clock, CheckCircle, AlertCircle, MessageSquare, Send } from 'lucide-react';
import { Button, Badge } from '@/components/ui';

export default function Support() {
  const tickets = [
    { id: 'TKT001', subject: 'Cannot access account', member: 'Sarah Chen', priority: 'high', status: 'open', created: '2024-01-15' },
    { id: 'TKT002', subject: 'Card not working abroad', member: 'James Wilson', priority: 'medium', status: 'in_progress', created: '2024-01-14' },
    { id: 'TKT003', subject: 'Loan application inquiry', member: 'Emily Johnson', priority: 'low', status: 'resolved', created: '2024-01-13' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Support Center</h1><p className="text-slate-400 text-sm mt-1">Manage member support tickets</p></div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />}>New Ticket</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Open Tickets', value: 5, color: 'red' },
          { label: 'In Progress', value: 3, color: 'amber' },
          { label: 'Resolved Today', value: 8, color: 'emerald' },
          { label: 'Avg Response Time', value: '2.4h', color: 'blue' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-500 text-sm">{stat.label}</p><p className={`text-2xl font-bold mt-1 ${stat.color === 'red' ? 'text-red-400' : stat.color === 'amber' ? 'text-amber-400' : stat.color === 'emerald' ? 'text-emerald-400' : 'text-blue-400'}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <input type="text" placeholder="Search tickets..." className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50" />
      </div>

      <div className="space-y-3">
        {tickets.map((ticket, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{ticket.member.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div>
                  <p className="text-white font-medium">{ticket.subject}</p>
                  <p className="text-slate-500 text-sm">{ticket.member} - {ticket.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={ticket.priority === 'high' ? 'danger' : ticket.priority === 'medium' ? 'warning' : 'info'}>{ticket.priority}</Badge>
                <Badge variant={ticket.status === 'open' ? 'danger' : ticket.status === 'in_progress' ? 'warning' : 'success'}>{ticket.status.replace('_', ' ')}</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Clock className="w-4 h-4" /> Created: {ticket.created}
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" icon={<MessageSquare className="w-4 h-4" />}>Reply</Button>
                <Button variant="ghost" size="sm" icon={<CheckCircle className="w-4 h-4" />}>Resolve</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
