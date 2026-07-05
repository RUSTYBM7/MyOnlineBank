import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Users, CreditCard, DollarSign, FileText,
  Settings, LogOut, ChevronLeft, Bell, Menu, X, Shield,
  Building2, Wallet, BarChart3, AlertTriangle, UserRound,
  Globe, Megaphone, Headphones, FileCheck, Calculator,
  FolderOpen, Lock, BellRing, UserCog
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useAdminStore } from '@/store/adminStore';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: 'dashboard' },
  { id: 'members', label: 'Members', icon: Users, permission: 'members.view' },
  { id: 'accounts', label: 'Accounts', icon: DollarSign, permission: 'accounts.view' },
  { id: 'transactions', label: 'Transactions', icon: FileText, permission: 'transactions.view' },
  { id: 'cards', label: 'Cards', icon: CreditCard, permission: 'cards.view' },
  { id: 'loans', label: 'Loans', icon: Wallet, permission: 'loans.view' },
  { id: 'kyc', label: 'KYC Review', icon: FileCheck, permission: 'kyc.view' },
  { id: 'fraud', label: 'Fraud Center', icon: AlertTriangle, permission: 'fraud.view' },
  { id: 'branches', label: 'Branches', icon: Building2, permission: 'branches.view' },
  { id: 'employees', label: 'Employees', icon: UserRound, permission: 'employees.view' },
  { id: 'financial', label: 'Financial', icon: Calculator, permission: 'financial.view' },
  { id: 'marketing', label: 'Marketing', icon: Megaphone, permission: 'marketing.view' },
  { id: 'cms', label: 'CMS', icon: Globe, permission: 'cms.view' },
  { id: 'compliance', label: 'Compliance', icon: Shield, permission: 'compliance.view' },
  { id: 'audit', label: 'Audit Logs', icon: BarChart3, permission: 'audit.view' },
  { id: 'reports', label: 'Reports', icon: FileText, permission: 'reports.view' },
  { id: 'support', label: 'Support', icon: Headphones, permission: 'support.view' },
  { id: 'documents', label: 'Documents', icon: FolderOpen, permission: 'documents.view' },
  { id: 'notifications', label: 'Notifications', icon: BellRing, permission: 'notifications.view' },
  { id: 'settings', label: 'Settings', icon: Settings, permission: 'settings.view' },
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, currentAdmin, logout, checkPermission } = useAuthStore();
  const { notifications } = useAdminStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentPath = location.pathname.replace('/', '') || 'dashboard';
  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Check authentication
  useEffect(() => {
    const stored = sessionStorage.getItem('orbitpay-admin-auth');
    if (!stored || !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNav = (id: string) => {
    navigate(`/${id}`);
    setMobileOpen(false);
  };

  // Filter nav items based on permissions
  const visibleNavItems = navItems.filter(item => {
    if (item.id === 'dashboard') return true;
    return checkPermission(item.permission as any);
  });

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside className={`
        hidden lg:flex flex-col bg-slate-900 border-r border-slate-800
        transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}
      `}>
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div>
                <p className="text-white font-bold">OrbitPay</p>
                <p className="text-xs text-slate-500">Admin Portal</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {visibleNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm
                ${currentPath === item.id
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }
              `}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-slate-500 hover:text-slate-300 rounded-lg transition-all"
          >
            <ChevronLeft className={`w-5 h-5 transition-transform ${collapsed && 'rotate-180'}`} />
            {!collapsed && <span className="text-xs">Collapse</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all text-sm"
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <p className="text-white font-bold">OrbitPay Admin</p>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-slate-400">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="lg:hidden fixed inset-0 z-40 bg-black/80 pt-16"
          onClick={() => setMobileOpen(false)}
        >
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            className="w-80 h-full bg-slate-900 border-r border-slate-800 pt-6 overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <nav className="px-4 space-y-1 pb-20">
              {visibleNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm
                    ${currentPath === item.id
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'text-slate-400 hover:bg-slate-800/50'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800 bg-slate-900">
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 rounded-xl hover:bg-red-500/10">
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:overflow-y-auto pt-16 lg:pt-0">
        <div className="hidden lg:flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-30">
          <div className="relative w-96">
            <input
              type="text"
              placeholder="Search members, accounts, transactions..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/notifications')}
              className="relative p-2 text-slate-400 hover:text-white transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {currentAdmin ? `${currentAdmin.firstName[0]}${currentAdmin.lastName[0]}` : 'SA'}
                </span>
              </div>
              <div className="text-left">
                <p className="text-slate-200 text-sm font-medium">
                  {currentAdmin ? `${currentAdmin.firstName} ${currentAdmin.lastName}` : 'System Admin'}
                </p>
                <p className="text-slate-500 text-xs capitalize">
                  {currentAdmin?.role.replace('_', ' ') || 'Super Administrator'}
                </p>
              </div>
            </div>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
