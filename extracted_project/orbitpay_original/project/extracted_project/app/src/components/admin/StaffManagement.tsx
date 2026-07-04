import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, GlassButton, GlassBadge } from '@/components/glass';
import { useStore } from '@/store';
import { Plus, X, Edit3, Eye } from 'lucide-react';
import type { AdminRole } from '@/types';
import { cn } from '@/lib/utils';

const roleColors: Record<AdminRole, string> = {
  super_admin: 'bg-[#FF6B6B]/15 text-[#FF6B6B]',
  support_admin: 'bg-[#A8E6CF]/20 text-[#0A0A0A]',
  finance_admin: 'bg-[#DDA0DD]/20 text-[#0A0A0A]',
  viewer: 'bg-[#0A0A0A]/10 text-[#0A0A0A]/50',
};

export default function StaffManagement() {
  const { adminUsers } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    fullName: '', email: '', role: 'support_admin' as AdminRole, permissions: [] as string[],
  });

  const allPermissions = [
    { key: 'all', label: 'Full Access' },
    { key: 'users', label: 'User Management' },
    { key: 'transactions', label: 'Transactions' },
    { key: 'kyc', label: 'KYC Verification' },
    { key: 'chat', label: 'B2B Chat' },
    { key: 'staff', label: 'Staff Management' },
    { key: 'audit', label: 'Audit Logs' },
    { key: 'config', label: 'Configuration' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#0A0A0A]">Staff Management</h1>
          <p className="text-sm text-[#0A0A0A]/50">{adminUsers.length} admin accounts</p>
        </div>
        <GlassButton variant="primary" size="sm" onClick={() => setShowAddModal(true)} icon={<Plus className="w-4 h-4" />}>
          Add Admin
        </GlassButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {adminUsers.map((admin, i) => (
          <motion.div
            key={admin.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <GlassCard className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img src={admin.avatar} alt="" className="w-12 h-12 rounded-full" />
                  <div>
                    <p className="font-medium text-[#0A0A0A]">{admin.fullName}</p>
                    <p className="text-xs text-[#0A0A0A]/40">{admin.email}</p>
                  </div>
                </div>
                <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium', roleColors[admin.role])}>
                  {admin.role.replace('_', ' ')}
                </span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#0A0A0A]/40">Last Login</span>
                  <span className="text-[#0A0A0A]">{new Date(admin.lastLogin).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#0A0A0A]/40">Status</span>
                  <div className="flex items-center gap-1.5">
                    <span className={cn('w-2 h-2 rounded-full', admin.isOnline ? 'bg-[#2ECC71]' : 'bg-[#0A0A0A]/20')} />
                    <span className="text-[#0A0A0A]">{admin.isOnline ? 'Online' : 'Offline'}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#0A0A0A]/40">IP Whitelist</span>
                  <span className="text-[#0A0A0A]">{admin.ipWhitelist.length} IPs</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {admin.permissions.slice(0, 4).map((perm) => (
                  <GlassBadge key={perm} variant="default" size="sm">{perm}</GlassBadge>
                ))}
                {admin.permissions.length > 4 && (
                  <GlassBadge variant="default" size="sm">+{admin.permissions.length - 4}</GlassBadge>
                )}
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                <button className="flex-1 py-2 rounded-xl text-xs font-medium text-[#0A0A0A]/50 hover:text-[#0A0A0A] hover:bg-white/20 transition-colors flex items-center justify-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> View
                </button>
                <button className="flex-1 py-2 rounded-xl text-xs font-medium text-[#0A0A0A]/50 hover:text-[#0A0A0A] hover:bg-white/20 transition-colors flex items-center justify-center gap-1">
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Add Admin Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-surface-strong rounded-3xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[#0A0A0A]">Add Admin</h2>
                <button onClick={() => setShowAddModal(false)} className="w-8 h-8 rounded-lg hover:bg-white/30 flex items-center justify-center">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-[#0A0A0A]/50 mb-1 block">Full Name</label>
                  <input type="text" className="w-full glass-input px-4 py-2.5 rounded-xl text-sm" placeholder="John Doe" />
                </div>
                <div>
                  <label className="text-xs text-[#0A0A0A]/50 mb-1 block">Email</label>
                  <input type="email" className="w-full glass-input px-4 py-2.5 rounded-xl text-sm" placeholder="admin@glassbank.com" />
                </div>
                <div>
                  <label className="text-xs text-[#0A0A0A]/50 mb-1 block">Role</label>
                  <select
                    value={newAdmin.role}
                    onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value as AdminRole })}
                    className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
                  >
                    <option value="super_admin">Super Admin</option>
                    <option value="support_admin">Support Admin</option>
                    <option value="finance_admin">Finance Admin</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#0A0A0A]/50 mb-2 block">Permissions</label>
                  <div className="flex flex-wrap gap-2">
                    {allPermissions.map((perm) => (
                      <button
                        key={perm.key}
                        onClick={() => {
                          const has = newAdmin.permissions.includes(perm.key);
                          setNewAdmin({
                            ...newAdmin,
                            permissions: has
                              ? newAdmin.permissions.filter((p) => p !== perm.key)
                              : [...newAdmin.permissions, perm.key],
                          });
                        }}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                          newAdmin.permissions.includes(perm.key)
                            ? 'bg-[#A8E6CF] text-[#0A0A0A]'
                            : 'glass-button text-[#0A0A0A]/50'
                        )}
                      >
                        {perm.label}
                      </button>
                    ))}
                  </div>
                </div>
                <GlassButton variant="primary" fullWidth onClick={() => setShowAddModal(false)}>
                  <Plus className="w-4 h-4" /> Create Admin
                </GlassButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
