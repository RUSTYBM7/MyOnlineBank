import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useStore } from '@/store';
import {
  LayoutDashboard, Users, Receipt, ShieldCheck, MessageSquare,
  UserCog, FileText, Settings, LogOut, Menu, X, Bell, Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import AdminOverview from '@/components/admin/AdminOverview';
import UserManagement from '@/components/admin/UserManagement';
import TransactionMonitor from '@/components/admin/TransactionMonitor';
import KycQueue from '@/components/admin/KycQueue';
import AdminChat from '@/components/admin/AdminChat';
import StaffManagement from '@/components/admin/StaffManagement';
import AuditLogs from '@/components/admin/AuditLogs';
import AdminConfig from '@/components/admin/AdminConfig';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '' },
  { icon: Users, label: 'Users', path: 'users' },
  { icon: Receipt, label: 'Transactions', path: 'transactions' },
  { icon: ShieldCheck, label: 'KYC Queue', path: 'kyc' },
  { icon: MessageSquare, label: 'B2B Chat', path: 'chat' },
  { icon: UserCog, label: 'Staff', path: 'staff' },
  { icon: FileText, label: 'Audit Logs', path: 'audit' },
  { icon: Settings, label: 'Config', path: 'config' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, logoutAdmin, users, transactions, kycDocuments, chatRooms } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  if (!admin) return null;

  const currentPath = location.pathname.split('/admin/')[1] || '';

  const stats = {
    totalUsers: users.length,
    activeToday: users.filter((u) => u.isOnline).length,
    totalDeposits: transactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0),
    totalWithdrawals: Math.abs(transactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + t.amount, 0)),
    pendingKycs: kycDocuments.filter((k) => k.status === 'pending').length,
    flaggedTransactions: transactions.filter((t) => t.status === 'flagged').length,
  };

  const unreadChats = chatRooms.reduce((sum, r) => sum + r.unreadCount, 0);

  return (
    <div className="min-h-screen bg-[#F0F2ED] dark:bg-[#0A0A0F]">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-[#0A0A0F]/80 backdrop-blur-xl border-b border-white/20 z-50 px-4 lg:px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-10 h-10 rounded-xl hover:bg-black/5 flex items-center justify-center transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0A0A0A] flex items-center justify-center">
              <span className="text-white font-bold text-xs">A</span>
            </div>
            <span className="font-semibold text-[#0A0A0A] dark:text-white hidden sm:block">OrbitPay Admin</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0A0A0A]/30" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users, transactions..."
              className="w-64 glass-input pl-10 pr-4 py-2 rounded-xl text-sm text-[#0A0A0A]"
            />
          </div>
          <button className="relative w-10 h-10 rounded-xl hover:bg-black/5 flex items-center justify-center transition-colors">
            <Bell className="w-5 h-5 text-[#0A0A0A]/60" />
            {unreadChats > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#FF6B6B] rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                {unreadChats}
              </span>
            )}
          </button>
          <div className="flex items-center gap-2 pl-3 border-l border-[#0A0A0A]/10">
            <img
              src={admin.avatar}
              alt={admin.fullName}
              className="w-9 h-9 rounded-full border-2 border-[#A8E6CF]/50"
            />
            <div className="hidden lg:block">
              <p className="text-sm font-medium text-[#0A0A0A] leading-tight">{admin.fullName}</p>
              <p className="text-xs text-[#0A0A0A]/40 capitalize">{admin.role.replace('_', ' ')}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 bottom-0 bg-white/70 dark:bg-[#0A0A0F]/70 backdrop-blur-xl border-r border-white/20 z-40 transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
        )}
      >
        <nav className="p-4 space-y-1">
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
                    ? 'bg-[#0A0A0A] text-white shadow-lg shadow-black/10'
                    : 'text-[#0A0A0A]/50 hover:text-[#0A0A0A] hover:bg-black/5'
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
                {item.path === 'chat' && unreadChats > 0 && (
                  <span className="ml-auto w-5 h-5 bg-[#FF6B6B] rounded-full text-white text-[10px] flex items-center justify-center">
                    {unreadChats}
                  </span>
                )}
                {item.path === 'kyc' && stats.pendingKycs > 0 && (
                  <span className="ml-auto w-5 h-5 bg-[#F4F7C0] rounded-full text-[#0A0A0A] text-[10px] flex items-center justify-center">
                    {stats.pendingKycs}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 mt-4 border-t border-[#0A0A0A]/5">
            <button
              onClick={() => {
                logoutAdmin();
                navigate('/admin/login');
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#FF6B6B]/70 hover:text-[#FF6B6B] hover:bg-[#FF6B6B]/5 transition-all"
            >
              <LogOut className="w-5 h-5" />
              Log Out
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          'pt-16 min-h-screen transition-all duration-300',
          sidebarOpen ? 'pl-64' : 'pl-0'
        )}
      >
        <div className="p-6">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<AdminOverview stats={stats} />} />
              <Route path="/users" element={<UserManagement searchQuery={searchQuery} />} />
              <Route path="/transactions" element={<TransactionMonitor searchQuery={searchQuery} />} />
              <Route path="/kyc" element={<KycQueue />} />
              <Route path="/chat" element={<AdminChat />} />
              <Route path="/staff" element={<StaffManagement />} />
              <Route path="/audit" element={<AuditLogs />} />
              <Route path="/config" element={<AdminConfig />} />
            </Routes>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
