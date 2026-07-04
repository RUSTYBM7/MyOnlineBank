import { motion } from 'framer-motion';
import { GlassCard, GlassButton, GlassBadge } from '@/components/glass';
import { useStore } from '@/store';
import { Check, X, FileText, Clock } from 'lucide-react';

export default function KycQueue() {
  const { kycDocuments, users, updateKycDocument } = useStore();

  const pendingDocs = kycDocuments.filter((d) => d.status === 'pending');
  const reviewedDocs = kycDocuments.filter((d) => d.status !== 'pending');

  const handleApprove = (id: string) => {
    updateKycDocument(id, { status: 'approved', reviewedBy: 'admin_1', reviewedAt: new Date().toISOString() });
  };

  const handleReject = (id: string) => {
    updateKycDocument(id, { status: 'rejected', reviewedBy: 'admin_1', reviewedAt: new Date().toISOString(), rejectionReason: 'Document unclear, please resubmit' });
  };

  const getUser = (userId: string) => users.find((u) => u.id === userId);

  const docTypeLabels: Record<string, string> = {
    id_card: 'ID Card',
    passport: 'Passport',
    selfie: 'Selfie',
    address_proof: 'Address Proof',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#0A0A0A]">KYC Verification Queue</h1>
        <p className="text-sm text-[#0A0A0A]/50">{pendingDocs.length} pending, {reviewedDocs.length} reviewed</p>
      </div>

      {/* Pending Documents */}
      {pendingDocs.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-medium text-[#0A0A0A] flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#F4F7C0]" /> Pending Review
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pendingDocs.map((doc) => {
              const user = getUser(doc.userId);
              return (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <GlassCard className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-24 h-16 rounded-xl bg-[#0A0A0A]/5 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {doc.url ? (
                          <img src={doc.url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <FileText className="w-6 h-6 text-[#0A0A0A]/30" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-[#0A0A0A]">{docTypeLabels[doc.docType]}</p>
                          <GlassBadge variant="yellow" size="sm">Pending</GlassBadge>
                        </div>
                        {user && (
                          <div className="flex items-center gap-2 mb-2">
                            <img src={user.avatar} alt="" className="w-5 h-5 rounded-full" />
                            <span className="text-xs text-[#0A0A0A]/60">{user.fullName}</span>
                          </div>
                        )}
                        {doc.ocrData && (
                          <div className="text-xs text-[#0A0A0A]/40 space-y-0.5">
                            {Object.entries(doc.ocrData).slice(0, 2).map(([k, v]) => (
                              <p key={k}>{k}: {v}</p>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2 mt-3">
                          <GlassButton variant="default" size="sm" onClick={() => handleApprove(doc.id)}>
                            <Check className="w-3.5 h-3.5" /> Approve
                          </GlassButton>
                          <GlassButton variant="danger" size="sm" onClick={() => handleReject(doc.id)}>
                            <X className="w-3.5 h-3.5" /> Reject
                          </GlassButton>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reviewed Documents */}
      {reviewedDocs.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-medium text-[#0A0A0A] flex items-center gap-2">
            <Check className="w-5 h-5 text-[#2ECC71]" /> Reviewed
          </h2>
          <GlassCard className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left text-xs font-medium text-[#0A0A0A]/50 uppercase px-4 py-3">User</th>
                  <th className="text-left text-xs font-medium text-[#0A0A0A]/50 uppercase px-4 py-3">Document</th>
                  <th className="text-left text-xs font-medium text-[#0A0A0A]/50 uppercase px-4 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-[#0A0A0A]/50 uppercase px-4 py-3">Reviewed By</th>
                  <th className="text-left text-xs font-medium text-[#0A0A0A]/50 uppercase px-4 py-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {reviewedDocs.map((doc) => {
                  const user = getUser(doc.userId);
                  return (
                    <tr key={doc.id} className="hover:bg-white/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {user && <img src={user.avatar} alt="" className="w-7 h-7 rounded-full" />}
                          <span className="text-sm text-[#0A0A0A]">{user?.fullName || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#0A0A0A]">{docTypeLabels[doc.docType]}</td>
                      <td className="px-4 py-3">
                        <GlassBadge variant={doc.status === 'approved' ? 'green' : 'red'} size="sm">
                          {doc.status}
                        </GlassBadge>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#0A0A0A]/50">{doc.reviewedBy || '-'}</td>
                      <td className="px-4 py-3 text-sm text-[#0A0A0A]/40 max-w-[200px] truncate">
                        {doc.rejectionReason || '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </GlassCard>
        </div>
      )}

      {pendingDocs.length === 0 && reviewedDocs.length === 0 && (
        <GlassCard className="p-12 text-center">
          <FileText className="w-12 h-12 text-[#0A0A0A]/20 mx-auto mb-3" />
          <p className="text-[#0A0A0A]/40">No KYC documents in queue</p>
        </GlassCard>
      )}
    </div>
  );
}
