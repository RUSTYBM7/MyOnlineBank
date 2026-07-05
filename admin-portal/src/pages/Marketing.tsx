import { Megaphone, Mail, MessageSquare, Bell, Plus, BarChart3, Send, Users } from 'lucide-react';
import { Button, Badge } from '@/components/ui';

export default function Marketing() {
  const campaigns = [
    { name: 'New Year Savings Campaign', type: 'Email', status: 'active', sent: 15420, opens: 8920, clicks: 2340, conversion: 15.2 },
    { name: 'Premium Upgrade Offer', type: 'SMS', status: 'scheduled', sent: 0, opens: 0, clicks: 0, conversion: 0 },
    { name: 'Holiday Promotion', type: 'Push', status: 'completed', sent: 28450, opens: 15670, clicks: 4560, conversion: 12.8 },
    { name: 'Loan Rate Special', type: 'Email', status: 'draft', sent: 0, opens: 0, clicks: 0, conversion: 0 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Marketing Center</h1><p className="text-slate-400 text-sm mt-1">Campaigns, notifications, and audience management</p></div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />}>Create Campaign</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Campaigns', value: 2, icon: Send, color: 'emerald' },
          { label: 'Total Reach', value: '43.8K', icon: Users, color: 'blue' },
          { label: 'Avg Open Rate', value: '58%', icon: Mail, color: 'purple' },
          { label: 'Avg CTR', value: '12.4%', icon: BarChart3, color: 'amber' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/20 flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
              </div>
              <p className="text-slate-500 text-sm">{stat.label}</p>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Campaigns</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm">All</button>
            <button className="px-3 py-1.5 text-slate-400 hover:bg-slate-800 rounded-lg text-sm">Active</button>
            <button className="px-3 py-1.5 text-slate-400 hover:bg-slate-800 rounded-lg text-sm">Scheduled</button>
          </div>
        </div>
        <div className="divide-y divide-slate-800">
          {campaigns.map((campaign, i) => (
            <div key={i} className="p-6 hover:bg-slate-800/30 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                    {campaign.type === 'Email' ? <Mail className="w-5 h-5 text-slate-400" /> :
                     campaign.type === 'SMS' ? <MessageSquare className="w-5 h-5 text-slate-400" /> :
                     <Bell className="w-5 h-5 text-slate-400" />}
                  </div>
                  <div>
                    <p className="text-white font-medium">{campaign.name}</p>
                    <p className="text-slate-500 text-sm">{campaign.type} Campaign</p>
                  </div>
                </div>
                <Badge variant={campaign.status === 'active' ? 'success' : campaign.status === 'scheduled' ? 'warning' : campaign.status === 'completed' ? 'default' : 'info'}>{campaign.status}</Badge>
              </div>
              {campaign.status !== 'draft' && campaign.status !== 'scheduled' && (
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center"><p className="text-white font-bold">{campaign.sent.toLocaleString()}</p><p className="text-slate-500 text-xs">Sent</p></div>
                  <div className="text-center"><p className="text-emerald-400 font-bold">{((campaign.opens / campaign.sent) * 100).toFixed(1)}%</p><p className="text-slate-500 text-xs">Open Rate</p></div>
                  <div className="text-center"><p className="text-blue-400 font-bold">{((campaign.clicks / campaign.opens) * 100).toFixed(1)}%</p><p className="text-slate-500 text-xs">CTR</p></div>
                  <div className="text-center"><p className="text-purple-400 font-bold">{campaign.conversion}%</p><p className="text-slate-500 text-xs">Conv.</p></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
