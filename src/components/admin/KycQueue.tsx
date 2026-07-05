import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertCircle,
  Camera,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Eye,
  EyeOff,
  FileText,
  Filter,
  Fingerprint,
  FlipHorizontal,
  Image,
  Info,
  Plus,
  RotateCw,
  Search,
  Shield,
  User,
  X,
  XCircle,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { cn } from '@/lib/utils'

interface KycApplication {
  id: string
  userId: string
  userName: string
  userEmail: string
  accountType: string
  submittedAt: string
  status: 'pending' | 'reviewing' | 'approved' | 'rejected'
  idImage?: string
  selfieImage?: string
  livenessVerified?: boolean
  verificationNotes?: string
  reviewedBy?: string
  reviewedAt?: string
  rejectionReason?: string
}

const mockApplications: KycApplication[] = [
  {
    id: 'kyc_001',
    userId: 'u_12345',
    userName: 'Sarah Chen',
    userEmail: 'sarah.chen@email.com',
    accountType: 'Premium Checking',
    submittedAt: '2024-12-20T10:30:00Z',
    status: 'pending',
    livenessVerified: true
  },
  {
    id: 'kyc_002',
    userId: 'u_67890',
    userName: 'Michael Rodriguez',
    userEmail: 'm.rodriguez@email.com',
    accountType: 'Business Account',
    submittedAt: '2024-12-20T09:15:00Z',
    status: 'reviewing'
  },
  {
    id: 'kyc_003',
    userId: 'u_54321',
    userName: 'Emily Johnson',
    userEmail: 'emily.j@email.com',
    accountType: 'Savings Plus',
    submittedAt: '2024-12-19T14:20:00Z',
    status: 'approved',
    reviewedBy: 'Admin_Admin',
    reviewedAt: '2024-12-20T08:00:00Z'
  },
  {
    id: 'kyc_004',
    userId: 'u_98765',
    userName: 'David Kim',
    userEmail: 'd.kim@email.com',
    accountType: 'Student Account',
    submittedAt: '2024-12-19T11:45:00Z',
    status: 'rejected',
    verificationNotes: 'ID document expired',
    rejectionReason: 'ID document expired. Please resubmit with valid ID.',
    reviewedBy: 'Admin_Admin',
    reviewedAt: '2024-12-19T16:30:00Z'
  }
]

export function KycQueue() {
  const [applications, setApplications] = useState<KycApplication[]>(mockApplications)
  const [selectedApp, setSelectedApp] = useState<KycApplication | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'queue' | 'approved' | 'rejected'>('queue')
  const [imageZoom, setImageZoom] = useState(1)
  const [compareMode, setCompareMode] = useState<'side' | 'overlay'>('side')
  const [notes, setNotes] = useState('')

  const filteredApplications = applications.filter(app => {
    const matchesSearch =
      app.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.userId.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === 'queue') {
      return matchesSearch && (app.status === 'pending' || app.status === 'reviewing')
    } else if (activeTab === 'approved') {
      return matchesSearch && app.status === 'approved'
    } else {
      return matchesSearch && app.status === 'rejected'
    }
  })

  const handleStatusChange = useCallback((appId: string, newStatus: 'approved' | 'rejected', reason?: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status: newStatus,
          verificationNotes: notes,
          rejectionReason: reason || notes,
          reviewedBy: 'Admin_Current',
          reviewedAt: new Date().toISOString()
        }
      }
      return app
    }))
    setSelectedApp(null)
    setNotes('')
  }, [notes])

  const handleStartReview = useCallback((appId: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId && app.status === 'pending') {
        return { ...app, status: 'reviewing' }
      }
      return app
    }))
  }, [])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: KycApplication['status']) => {
    const styles = {
      pending: 'bg-amber-100 text-amber-700 border-amber-200',
      reviewing: 'bg-blue-100 text-blue-700 border-blue-200',
      approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      rejected: 'bg-red-100 text-red-700 border-red-200'
    }
    return styles[status]
  }

  const getStatusIcon = (status: KycApplication['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'reviewing': return <Eye className="w-4 h-4" />
      case 'approved': return <CheckCircle2 className="w-4 h-4" />
      case 'rejected': return <XCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">KYC Verification Queue</h1>
            <p className="text-sm text-gray-500 mt-1">
              Review and verify user identity documents and selfies
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
              {applications.filter(a => a.status === 'pending').length} Pending
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {applications.filter(a => a.status === 'reviewing').length} In Review
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 border-b border-gray-200">
          {[
            { key: 'queue', label: 'Review Queue', count: applications.filter(a => a.status === 'pending' || a.status === 'reviewing').length },
            { key: 'approved', label: 'Approved', count: applications.filter(a => a.status === 'approved').length },
            { key: 'rejected', label: 'Rejected', count: applications.filter(a => a.status === 'rejected').length }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={cn(
                "pb-3 px-1 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab.key
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              {tab.label}
              <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Applications List */}
        <div className={cn(
          "w-96 border-r border-gray-200 bg-white overflow-y-auto transition-all",
          selectedApp && "hidden lg:block"
        )}>
          {/* Search */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* List */}
          <div className="divide-y divide-gray-100">
            {filteredApplications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No applications found</p>
              </div>
            ) : (
              filteredApplications.map(app => (
                <button
                  key={app.id}
                  onClick={() => {
                    setSelectedApp(app)
                    setNotes(app.verificationNotes || '')
                  }}
                  className={cn(
                    "w-full p-4 text-left hover:bg-gray-50 transition-colors",
                    selectedApp?.id === app.id && "bg-emerald-50"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 truncate">{app.userName}</p>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-medium border",
                          getStatusBadge(app.status)
                        )}>
                          {app.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{app.userEmail}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400">{app.accountType}</span>
                        <span className="text-xs text-gray-300">•</span>
                        <span className="text-xs text-gray-400">{formatDate(app.submittedAt)}</span>
                      </div>
                      {/* Document Status Icons */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className={cn(
                          "flex items-center gap-1 text-xs px-2 py-0.5 rounded-full",
                          app.idImage ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"
                        )}>
                          <FileText className="w-3 h-3" />
                          ID
                        </span>
                        <span className={cn(
                          "flex items-center gap-1 text-xs px-2 py-0.5 rounded-full",
                          app.selfieImage ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"
                        )}>
                          <Camera className="w-3 h-3" />
                          Selfie
                        </span>
                        <span className={cn(
                          "flex items-center gap-1 text-xs px-2 py-0.5 rounded-full",
                          app.livenessVerified ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"
                        )}>
                          <Fingerprint className="w-3 h-3" />
                          Liveness
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Detail View */}
        <div className={cn(
          "flex-1 bg-gray-50 overflow-y-auto",
          !selectedApp && "hidden lg:flex lg:items-center lg:justify-center"
        )}>
          {selectedApp ? (
            <motion.div
              key={selectedApp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col"
            >
              {/* Detail Header */}
              <div className="p-6 bg-white border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setSelectedApp(null)}
                      className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedApp.userName}</h2>
                      <p className="text-sm text-gray-500">{selectedApp.userEmail}</p>
                    </div>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-1",
                      getStatusBadge(selectedApp.status)
                    )}>
                      {getStatusIcon(selectedApp.status)}
                      {selectedApp.status}
                    </span>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>Application ID</p>
                    <p className="font-mono font-medium">{selectedApp.id}</p>
                    <p className="text-xs mt-1">{formatDate(selectedApp.submittedAt)}</p>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                  {/* Document Status Cards */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className={cn(
                      "bg-white rounded-xl border p-4",
                      selectedApp.idImage ? "border-emerald-200" : "border-gray-200"
                    )}>
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className={cn(
                          "w-5 h-5",
                          selectedApp.idImage ? "text-emerald-600" : "text-gray-400"
                        )} />
                        <span className="font-medium text-gray-700">ID Document</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {selectedApp.idImage ? 'Uploaded' : 'Not provided'}
                      </p>
                    </div>
                    <div className={cn(
                      "bg-white rounded-xl border p-4",
                      selectedApp.selfieImage ? "border-emerald-200" : "border-gray-200"
                    )}>
                      <div className="flex items-center gap-2 mb-2">
                        <Camera className={cn(
                          "w-5 h-5",
                          selectedApp.selfieImage ? "text-emerald-600" : "text-gray-400"
                        )} />
                        <span className="font-medium text-gray-700">Selfie Photo</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {selectedApp.selfieImage ? 'Captured' : 'Not provided'}
                      </p>
                    </div>
                    <div className={cn(
                      "bg-white rounded-xl border p-4",
                      selectedApp.livenessVerified ? "border-emerald-200" : "border-gray-200"
                    )}>
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className={cn(
                          "w-5 h-5",
                          selectedApp.livenessVerified ? "text-emerald-600" : "text-gray-400"
                        )} />
                        <span className="font-medium text-gray-700">Liveness Check</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {selectedApp.livenessVerified ? 'Verified' : 'Not verified'}
                      </p>
                    </div>
                  </div>

                  {/* Image Comparison Tools */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCompareMode('side')}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                          compareMode === 'side' ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"
                        )}
                      >
                        Side by Side
                      </button>
                      <button
                        onClick={() => setCompareMode('overlay')}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                          compareMode === 'overlay' ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"
                        )}
                      >
                        Overlay
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setImageZoom(Math.max(0.5, imageZoom - 0.25))}
                        className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <span className="text-sm text-gray-600 w-16 text-center">
                        {Math.round(imageZoom * 100)}%
                      </span>
                      <button
                        onClick={() => setImageZoom(Math.min(2, imageZoom + 0.25))}
                        className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setImageZoom(1)}
                        className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <RotateCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Document Images */}
                  <div className={compareMode === 'side' ? 'grid grid-cols-2 gap-6' : 'relative'}>
                    {/* ID Document */}
                    <div className={compareMode === 'overlay' ? 'max-w-md mx-auto' : ''}>
                      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-gray-700">Government ID Document</span>
                          </div>
                          <span className="text-xs text-gray-400">Front Side</span>
                        </div>
                        <div
                          className={cn(
                            "bg-gray-100 flex items-center justify-center overflow-hidden",
                            compareMode === 'side' ? "aspect-[4/3]" : "aspect-[4/3]"
                          )}
                          style={{ transform: `scale(${imageZoom})`, transformOrigin: 'center' }}
                        >
                          {selectedApp.idImage ? (
                            <img
                              src={selectedApp.idImage}
                              alt="ID Document"
                              className="max-w-full max-h-full object-contain"
                            />
                          ) : (
                            <div className="text-center text-gray-400">
                              <FileText className="w-16 h-16 mx-auto mb-2" />
                              <p>No ID image uploaded</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Selfie */}
                    <div className={compareMode === 'overlay' ? 'absolute inset-0 z-10 pointer-events-none opacity-50' : ''}>
                      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-gray-700">Selfie Photo</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {selectedApp.livenessVerified && (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-medium flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                Liveness Verified
                              </span>
                            )}
                            <span className="text-xs text-gray-400">Captured</span>
                          </div>
                        </div>
                        <div
                          className={cn(
                            "bg-gray-100 flex items-center justify-center overflow-hidden",
                            compareMode === 'side' ? "aspect-square" : "aspect-square"
                          )}
                          style={{ transform: `scale(${imageZoom})`, transformOrigin: 'center' }}
                        >
                          {selectedApp.selfieImage ? (
                            <img
                              src={selectedApp.selfieImage}
                              alt="Selfie"
                              className="max-w-full max-h-full object-contain rounded-full"
                            />
                          ) : (
                            <div className="text-center text-gray-400">
                              <User className="w-16 h-16 mx-auto mb-2" />
                              <p>No selfie uploaded</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Verification Notes */}
                  <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-4">
                    <label className="block font-medium text-gray-700 mb-2">Verification Notes</label>
                    <textarea
                      placeholder="Add notes about this verification..."
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              {selectedApp.status !== 'approved' && selectedApp.status !== 'rejected' && (
                <div className="p-6 bg-white border-t border-gray-200">
                  <div className="flex items-center justify-between max-w-6xl mx-auto">
                    <div className="text-sm text-gray-500">
                      {selectedApp.status === 'pending' ? (
                        <span>Start reviewing to take action</span>
                      ) : (
                        <span>Reviewing since {formatDate(selectedApp.submittedAt)}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {selectedApp.status === 'pending' && (
                        <button
                          onClick={() => handleStartReview(selectedApp.id)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-xl font-medium flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Start Review
                        </button>
                      )}
                      <button
                        onClick={() => {
                          const reason = prompt('Enter rejection reason:')
                          if (reason) {
                            handleStatusChange(selectedApp.id, 'rejected', reason)
                          }
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded-xl font-medium flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                      <button
                        onClick={() => handleStatusChange(selectedApp.id, 'approved')}
                        className="px-4 py-2 bg-emerald-500 text-white rounded-xl font-medium flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Approve
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Reviewed Info */}
              {(selectedApp.status === 'approved' || selectedApp.status === 'rejected') && selectedApp.reviewedAt && (
                <div className="p-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
                  {selectedApp.status === 'approved' ? 'Approved' : 'Rejected'} by {selectedApp.reviewedBy} on {formatDate(selectedApp.reviewedAt)}
                  {selectedApp.rejectionReason && (
                    <span className="block mt-1 text-red-600">Reason: {selectedApp.rejectionReason}</span>
                  )}
                </div>
              )}
            </motion.div>
          ) : (
            <div className="text-center text-gray-500">
              <Eye className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Select an application</p>
              <p className="text-sm">Choose an application from the queue to review</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default KycQueue
