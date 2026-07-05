import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GlassCard, GlassButton, GlassBadge } from '@/components/glass';
import { useStore } from '@/store';
import {
  AlertTriangle,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  Download,
  Edit2,
  Home,
  Mail,
  MapPin,
  Phone,
  Settings,
  Shield,
  Trash2,
  User
} from 'lucide-react';;

export default function AccountSettings() {
  const navigate = useNavigate();
  const { user, updateUser } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editField, setEditField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  if (!user) return null;

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleEdit = (field: string, currentValue: string) => {
    setEditField(field);
    setEditValue(currentValue);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editField) {
      updateUser(user.id, { [editField]: editValue });
      showToast('Profile updated successfully', 'success');
    }
    setIsEditing(false);
    setEditField(null);
  };

  const profileFields = [
    { id: 'fullName', label: 'Full Name', value: user.fullName, icon: User, editable: true },
    { id: 'email', label: 'Email Address', value: user.email, icon: Mail, editable: true },
    { id: 'phone', label: 'Phone Number', value: user.phone, icon: Phone, editable: true },
    { id: 'address', label: 'Home Address', value: user.address || 'Not set', icon: MapPin, editable: true },
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
          <h1 className="text-xl font-bold text-emerald-800">Account Settings</h1>
          <p className="text-sm text-emerald-800/50">Manage your account details</p>
        </div>
      </div>

      {/* Profile Header */}
      <GlassCard className="p-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
              alt={user.fullName}
              className="w-20 h-20 rounded-full border-4 border-white/40 shadow-lg"
            />
            <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-emerald-800">{user.fullName}</h2>
            <p className="text-sm text-emerald-800/60">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <GlassBadge
                variant={user.kycStatus === 'verified' ? 'green' : user.kycStatus === 'pending' ? 'yellow' : 'red'}
                size="sm"
              >
                {user.kycStatus === 'verified' ? 'Verified' : user.kycStatus === 'pending' ? 'Pending' : 'Unverified'}
              </GlassBadge>
              <GlassBadge variant="mint" size="sm">
                {user.tier.toUpperCase()} TIER
              </GlassBadge>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Profile Information */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-emerald-800/60 uppercase tracking-wider">Personal Information</h3>
        {profileFields.map((field) => (
          <GlassCard key={field.id} className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <field.icon className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-emerald-800/50">{field.label}</p>
                {isEditing && editField === field.id ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-white/50 rounded-lg border border-emerald-200 text-emerald-800 outline-none focus:border-emerald-500"
                    autoFocus
                  />
                ) : (
                  <p className="text-sm font-medium text-emerald-800">{field.value}</p>
                )}
              </div>
              {field.editable && (
                isEditing && editField === field.id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="p-2 rounded-lg bg-slate-100 text-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="p-2 rounded-lg bg-emerald-500 text-white"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEdit(field.id, field.value)}
                    className="p-2 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )
              )}
            </div>
          </GlassCard>
        ))}
      </div>

      {/* KYC Verification */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-emerald-800/60 uppercase tracking-wider">Identity Verification</h3>
        <GlassCard className="p-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              user.kycStatus === 'verified' ? 'bg-emerald-100' : 'bg-amber-100'
            }`}>
              <Shield className={`w-6 h-6 ${
                user.kycStatus === 'verified' ? 'text-emerald-600' : 'text-amber-600'
              }`} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-emerald-800">
                {user.kycStatus === 'verified' ? 'Identity Verified' : 'KYC Verification Required'}
              </p>
              <p className="text-xs text-emerald-800/60">
                {user.kycStatus === 'verified'
                  ? 'Your identity has been successfully verified'
                  : 'Complete verification to unlock all features'}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-emerald-800/40" />
          </div>
          {user.kycStatus !== 'verified' && (
            <GlassButton className="w-full mt-4" onClick={() => showToast('Opening verification...', 'success')}>
              Verify Identity
            </GlassButton>
          )}
        </GlassCard>
      </div>

      {/* Account Actions */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-emerald-800/60 uppercase tracking-wider">Account Actions</h3>
        <GlassCard className="p-4 border-2 border-amber-200/50">
          <div className="space-y-3">
            <button
              onClick={() => setShowExportModal(true)}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/50 hover:bg-emerald-50 transition-colors"
            >
              <Download className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-800">Export Account Data</span>
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-red-50 hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium text-red-500">Delete Account</span>
            </button>
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

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-5" onClick={() => setShowExportModal(false)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full bg-white rounded-3xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-emerald-800 text-center mb-2">Export Your Data</h2>
            <p className="text-sm text-emerald-800/60 text-center mb-6">
              Download a complete copy of your account data including transactions, statements, and personal information.
            </p>
            <div className="space-y-3">
              <GlassButton fullWidth onClick={() => { setShowExportModal(false); showToast('Data export sent to email', 'success'); }}>
                Export as PDF
              </GlassButton>
              <GlassButton variant="ghost" fullWidth onClick={() => setShowExportModal(false)}>
                Cancel
              </GlassButton>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-5" onClick={() => setShowDeleteModal(false)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full bg-white rounded-3xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-emerald-800 text-center mb-2">Delete Account?</h2>
            <p className="text-sm text-emerald-800/60 text-center mb-6">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
            <div className="space-y-3">
              <GlassButton variant="danger" fullWidth onClick={() => setShowDeleteModal(false)}>
                Delete Permanently
              </GlassButton>
              <GlassButton variant="ghost" fullWidth onClick={() => setShowDeleteModal(false)}>
                Cancel
              </GlassButton>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
