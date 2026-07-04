import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useStore } from '@/store';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminOverview from '@/components/admin/AdminOverview';
import UserManagement from '@/components/admin/UserManagement';
import TransactionMonitor from '@/components/admin/TransactionMonitor';
import KycQueue from '@/components/admin/KycQueue';
import AdminChat from '@/components/admin/AdminChat';
import StaffManagement from '@/components/admin/StaffManagement';
import AuditLogs from '@/components/admin/AuditLogs';
import AdminConfig from '@/components/admin/AdminConfig';

export default function AdminDashboard() {
  const location = useLocation();
  const { admin, users, transactions, kycDocuments, chatRooms } = useStore();

  if (!admin) return null;

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
    <AdminLayout stats={stats} unreadChats={unreadChats}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<AdminOverview stats={stats} />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/transactions" element={<TransactionMonitor />} />
          <Route path="/kyc" element={<KycQueue />} />
          <Route path="/chat" element={<AdminChat />} />
          <Route path="/staff" element={<StaffManagement />} />
          <Route path="/audit" element={<AuditLogs />} />
          <Route path="/config" element={<AdminConfig />} />
        </Routes>
      </AnimatePresence>
    </AdminLayout>
  );
}
