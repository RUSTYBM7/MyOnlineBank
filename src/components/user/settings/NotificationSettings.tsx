import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '@/components/glass';
import {
  Bell, Mail, Smartphone, MessageSquare, CreditCard, Shield,
  ChevronRight, Check, CheckCircle2, AlertTriangle
} from 'lucide-react';

interface NotificationChannel {
  id: string;
  icon: React.ReactNode;
  name: string;
  push: boolean;
  email: boolean;
  sms: boolean;
}

export default function NotificationSettings() {
  const navigate = useNavigate();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [notifications, setNotifications] = useState<NotificationChannel[]>([
    {
      id: 'transactions',
      icon: <CreditCard className="w-5 h-5" />,
      name: 'Transactions',
      push: true,
      email: true,
      sms: true,
    },
    {
      id: 'security',
      icon: <Shield className="w-5 h-5" />,
      name: 'Security Alerts',
      push: true,
      email: true,
      sms: true,
    },
    {
      id: 'promotions',
      icon: <Bell className="w-5 h-5" />,
      name: 'Promotions & Offers',
      push: false,
      email: true,
      sms: false,
    },
    {
      id: 'tips',
      icon: <MessageSquare className="w-5 h-5" />,
      name: 'Financial Tips',
      push: false,
      email: true,
      sms: false,
    },
  ]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleNotification = (id: string, channel: 'push' | 'email' | 'sms') => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, [channel]: !n[channel] } : n
      )
    );
    showToast('Notification preference updated', 'success');
  };

  const channels = [
    { id: 'push', label: 'Push', icon: <Smartphone className="w-4 h-4" /> },
    { id: 'email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
    { id: 'sms', label: 'SMS', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  return (
    <div className="p-5 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/app/settings')}
          className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center"
        >
          <ChevronRight className="w-5 h-5 text-emerald-800 rotate-180" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-emerald-800">Notifications</h1>
          <p className="text-sm text-emerald-800/50">Manage how you receive alerts</p>
        </div>
      </div>

      {/* Notification Summary */}
      <GlassCard className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Bell className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-emerald-800">Notification Center</p>
            <p className="text-sm text-emerald-800/70">
              {notifications.filter(n => n.push || n.email || n.sms).length} notification types enabled
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Channel Toggles */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-around">
          {channels.map((channel) => (
            <div key={channel.id} className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                {channel.icon}
              </div>
              <span className="text-xs font-medium text-emerald-800">{channel.label}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Notification Types */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-emerald-800/60 uppercase tracking-wider">Notification Types</h3>
        {notifications.map((notification) => (
          <GlassCard key={notification.id} className="p-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                {notification.icon}
              </div>
              <p className="flex-1 font-medium text-emerald-800">{notification.name}</p>
              <Check className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => toggleNotification(notification.id, channel.id as 'push' | 'email' | 'sms')}
                  className={`py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                    notification[channel.id as keyof typeof notification]
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {channel.label}
                </button>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Quiet Hours */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-emerald-800/60 uppercase tracking-wider">Quiet Hours</h3>
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium text-emerald-800">Enable Quiet Hours</p>
              <p className="text-xs text-emerald-800/60">Pause non-urgent notifications</p>
            </div>
            <button className="w-12 h-7 rounded-full bg-emerald-500 p-1">
              <motion.div
                animate={{ x: 20 }}
                className="w-5 h-5 rounded-full bg-white shadow-sm"
              />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-emerald-800/60 mb-1 block">Start Time</label>
              <div className="px-4 py-3 bg-white/50 rounded-xl text-emerald-800">10:00 PM</div>
            </div>
            <div>
              <label className="text-xs text-emerald-800/60 mb-1 block">End Time</label>
              <div className="px-4 py-3 bg-white/50 rounded-xl text-emerald-800">7:00 AM</div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed bottom-24 left-4 right-4 z-[200] p-4 rounded-2xl shadow-lg flex items-center gap-3 ${
            toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          <span className="text-sm font-medium">{toast.message}</span>
        </motion.div>
      )}
    </div>
  );
}
