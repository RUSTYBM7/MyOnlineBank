import { Bell, BellRing, Check, CheckCircle, Info, AlertTriangle, AlertCircle, Clock, Settings } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import { Button, Badge } from '@/components/ui';

export default function Notifications() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAdminStore();
  const unread = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      default: return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Notifications</h1><p className="text-slate-400 text-sm mt-1">{unread} unread notifications</p></div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={markAllNotificationsRead} icon={<Check className="w-4 h-4" />}>Mark All Read</Button>
          <Button variant="ghost" size="sm" icon={<Settings className="w-4 h-4" />}>Settings</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: notifications.length, color: 'slate' },
          { label: 'Unread', value: unread, color: 'blue' },
          { label: 'Today', value: notifications.filter(n => n.date.startsWith('2024')).length, color: 'emerald' },
          { label: 'This Week', value: notifications.length, color: 'purple' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-500 text-sm">{stat.label}</p><p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {notifications.map(notif => (
          <div key={notif.id} className={`bg-slate-900 border rounded-xl p-5 transition-all ${notif.read ? 'border-slate-800' : 'border-emerald-500/30'}`}>
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${notif.type === 'error' ? 'bg-red-500/20' : notif.type === 'warning' ? 'bg-amber-500/20' : notif.type === 'success' ? 'bg-emerald-500/20' : 'bg-blue-500/20'}`}>
                {getIcon(notif.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className={`font-medium ${notif.read ? 'text-slate-400' : 'text-white'}`}>{notif.title}</p>
                  <span className="text-slate-500 text-sm">{notif.date}</span>
                </div>
                <p className="text-slate-500 text-sm">{notif.message}</p>
              </div>
              {!notif.read && (
                <button onClick={() => markNotificationRead(notif.id)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg" title="Mark as read">
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
