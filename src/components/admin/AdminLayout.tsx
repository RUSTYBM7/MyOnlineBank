import { useState, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useStore } from '@/store';
import {
  LayoutDashboard, Users, Receipt, ShieldCheck, MessageSquare,
  UserCog, FileText, Settings, LogOut, Menu, X, Bell, Search,
  ChevronDown, Activity, AlertTriangle
} from 'lucide-react';

interface NavItem {
  icon: typeof LayoutDashboard;
  label: string;
  path: string;
  badge?: number;
}

interface AdminLayoutProps {
  children: ReactNode;
  stats?: {
    totalUsers: number;
    activeToday: number;
    totalDeposits: number;
    totalWithdrawals: number;
    pendingKycs: number;
    flaggedTransactions: number;
  };
  unreadChats?: number;
}

const AdminLayout = ({ children, stats = {}, unreadChats = 0 }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, logoutAdmin } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!admin) return null;

  const currentPath = location.pathname.split('/admin/')[1] || '';

  const navItems: NavItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '' },
    { icon: Users, label: 'Users', path: 'users' },
    { icon: Receipt, label: 'Transactions', path: 'transactions' },
    { icon: ShieldCheck, label: 'KYC Queue', path: 'kyc', badge: stats.pendingKycs },
    { icon: MessageSquare, label: 'B2B Chat', path: 'chat', badge: unreadChats },
    { icon: UserCog, label: 'Staff', path: 'staff' },
    { icon: FileText, label: 'Audit Logs', path: 'audit' },
    { icon: Settings, label: 'Config', path: 'config' },
  ];

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 z-50 px-4 lg:px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xs">OP</span>
            </div>
            <div>
              <span className="font-semibold text-slate-800 dark:text-white hidden sm:block">OrbitPay</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Admin Portal</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* System Status */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800">
            <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">System Online</span>
          </div>

          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users, transactions..."
              className="w-64 bg-slate-100 dark:bg-slate-700 border-0 pl-10 pr-4 py-2 rounded-xl text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Alerts */}
          {stats.flaggedTransactions > 0 && (
            <button className="relative w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center transition-colors">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                {stats.flaggedTransactions}
              </span>
            </button>
          )}

          {/* Notifications */}
          <button className="relative w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center transition-colors">
            <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            {unreadChats > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                {unreadChats}
              </span>
            )}
          </button>

          {/* Admin Profile */}
          <div className="flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-600">
            <img
              src={admin.avatar}
              alt={admin.fullName}
              className="w-9 h-9 rounded-full border-2 border-emerald-300 dark:border-emerald-600"
            />
            <div className="hidden lg:block">
              <p className="text-sm font-medium text-slate-800 dark:text-white leading-tight">{admin.fullName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{admin.role.replace('_', ' ')}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 bottom-0 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 z-40 transition-all duration-300 shadow-sm',
          sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
        )}
      >
        <div className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(`/admin/${item.path}`)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
                    : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={cn(
                    'ml-auto w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400'
                  )}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            >
              <LogOut className="w-5 h-5" />
              Log Out
            </button>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            <p>OrbitPay Admin v2.0</p>
            <p className="mt-1">Session: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          'pt-16 min-h-screen transition-all duration-300',
          sidebarOpen ? 'lg:pl-64' : 'pl-0'
        )}
      >
        <div className="p-6">
          {children}
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
