import { useState } from 'react';
import { Bell, Check, Trash2, Filter, Search, AlertTriangle, Info, CheckCircle, XCircle, Clock, User, CreditCard, DollarSign, Shield } from 'lucide-react';

const mockNotifications = [
  { id: 1, type: 'alert', title: 'Unusual Transaction Detected', message: 'Large withdrawal of $45,000 from account USR034', time: '5 mins ago', read: false, icon: DollarSign },
  { id: 2, type: 'user', title: 'New User Registration', message: 'Robert Martinez completed KYC verification', time: '12 mins ago', read: false, icon: User },
  { id: 3, type: 'success', title: 'System Update Complete', message: 'All services are now operational', time: '1 hour ago', read: true, icon: CheckCircle },
  { id: 4, type: 'warning', title: 'KYC Review Required', message: '3 documents need manual verification', time: '2 hours ago', read: true, icon: Shield },
  { id: 5, type: 'info', title: 'New Feature Released', message: 'Multi-currency support is now available', time: '3 hours ago', read: true, icon: Info },
  { id: 6, type: 'alert', title: 'Payment Failed', message: 'Wire transfer to account USR089 failed', time: '4 hours ago', read: true, icon: XCircle },
  { id: 7, type: 'user', title: 'Card Activation', message: 'New credit card activated by Sarah Johnson', time: '5 hours ago', read: true, icon: CreditCard },
  { id: 8, type: 'success', title: 'Batch Processing Complete', message: 'Successfully processed 1,247 transactions', time: '6 hours ago', read: true, icon: Check },
];

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || notification.type === filter;
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'alert': return 'text-red-400 bg-red-500/20';
      case 'success': return 'text-emerald-400 bg-emerald-500/20';
      case 'warning': return 'text-amber-400 bg-amber-500/20';
      case 'info': return 'text-cyan-400 bg-cyan-500/20';
      case 'user': return 'text-purple-400 bg-purple-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Notifications</h1>
          <p className="text-slate-400 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 font-medium rounded-xl transition-all"
            >
              <Check className="w-5 h-5" />
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 font-medium rounded-xl transition-all"
            >
              <Trash2 className="w-5 h-5" />
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Types</option>
              <option value="alert">Alerts</option>
              <option value="success">Success</option>
              <option value="warning">Warnings</option>
              <option value="info">Info</option>
              <option value="user">User Activity</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
        {filteredNotifications.length > 0 ? (
          <div className="divide-y divide-slate-700/50">
            {filteredNotifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-slate-800/30 transition-all ${
                    !notification.read ? 'bg-slate-800/20' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getIconColor(notification.type)}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className={`font-medium ${!notification.read ? 'text-white' : 'text-slate-300'}`}>
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            )}
                          </div>
                          <p className="text-sm text-slate-400 mt-1">{notification.message}</p>
                          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {notification.time}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-4">
              <Bell className="w-10 h-10 text-slate-600" />
            </div>
            <p className="text-slate-400">No notifications found</p>
            <p className="text-sm text-slate-500 mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>

      {/* Notification Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { type: 'alert', label: 'Alerts', count: notifications.filter(n => n.type === 'alert').length, color: 'red' },
          { type: 'success', label: 'Success', count: notifications.filter(n => n.type === 'success').length, color: 'emerald' },
          { type: 'warning', label: 'Warnings', count: notifications.filter(n => n.type === 'warning').length, color: 'amber' },
          { type: 'info', label: 'Info', count: notifications.filter(n => n.type === 'info').length, color: 'cyan' },
          { type: 'user', label: 'User Activity', count: notifications.filter(n => n.type === 'user').length, color: 'purple' },
        ].map((item) => (
          <div key={item.type} className={`bg-${item.color}-500/10 border border-${item.color}-500/20 rounded-xl p-4`}>
            <p className={`text-2xl font-bold text-${item.color}-400`}>{item.count}</p>
            <p className="text-sm text-slate-400">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
