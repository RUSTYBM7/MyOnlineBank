import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassSurface } from '@/components/glass'
import { useStore } from '@/store'
import {
  Activity,
  AlertTriangle,
  Bell,
  BellOff,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  CreditCard,
  DollarSign,
  Info,
  RefreshCw,
  Save,
  Send,
  Shield,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils'

interface Notification {
  id: string
  type: 'info' | 'alert' | 'success' | 'tip'
  title: string
  message: string
  timestamp: string
  read: boolean
  category: 'security' | 'account' | 'transaction' | 'promotion' | 'system'
  actionUrl?: string
}

const initialNotifications: Notification[] = [
  {
    id: 'notif_001',
    type: 'alert',
    title: 'Large Transaction Detected',
    message: 'A transaction of $2,500 was made from your account. If this was not you, please contact support immediately.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    read: false,
    category: 'security',
    actionUrl: '/app/security'
  },
  {
    id: 'notif_002',
    type: 'success',
    title: 'Direct Deposit Received',
    message: 'Your salary of $4,250.00 has been deposited into your Primary Checking account.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
    category: 'transaction',
    actionUrl: '/app/accounts'
  },
  {
    id: 'notif_003',
    type: 'info',
    title: 'Statement Ready',
    message: 'Your December 2024 statement is now available. Review your transactions and download your statement.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: true,
    category: 'account',
    actionUrl: '/app/statement'
  },
  {
    id: 'notif_004',
    type: 'tip',
    title: 'Save More with Auto-Save',
    message: 'Set up automatic transfers to your savings account. You could save $500 more this month!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true,
    category: 'promotion',
    actionUrl: '/app/accounts'
  },
  {
    id: 'notif_005',
    type: 'info',
    title: 'Card Activity',
    message: 'Your OrbitPay Visa card was used at Netflix for $15.99',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    read: true,
    category: 'transaction'
  }
]

export default function ChatScreen() {
  const { user, addNotification } = useStore()
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [showNotifications, setShowNotifications] = useState(true)
  const [expandedNotif, setExpandedNotif] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<Notification['category'] | 'all'>('all')

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n =>
      n.id === id ? { ...n, read: true } : n
    ))
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const filteredNotifications = notifications.filter(n =>
    filterCategory === 'all' || n.category === filterCategory
  )

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const getNotificationIcon = (type: Notification['type'], category: Notification['category']) => {
    const iconClass = "w-5 h-5"
    switch (category) {
      case 'security':
        return <Shield className={iconClass} />
      case 'transaction':
        return <DollarSign className={iconClass} />
      case 'account':
        return <CreditCard className={iconClass} />
      default:
        switch (type) {
          case 'alert':
            return <AlertTriangle className={iconClass} />
          case 'success':
            return <Check className={iconClass} />
          case 'tip':
            return <TrendingUp className={iconClass} />
          default:
            return <Info className={iconClass} />
        }
    }
  }

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'alert':
        return 'bg-red-100 text-red-600 border-red-200'
      case 'success':
        return 'bg-emerald-100 text-emerald-600 border-emerald-200'
      case 'tip':
        return 'bg-blue-100 text-blue-600 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }

  if (!user) return null

  return (
    <div className="h-screen flex flex-col animate-fade-in bg-gradient-to-br from-emerald-50 to-cyan-50">
      {/* Header */}
      <div className="p-5 pb-3 bg-white/80 backdrop-blur-sm border-b border-emerald-100/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Notifications</h1>
              <p className="text-xs text-gray-500">
                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={cn(
                "p-2 rounded-full transition-colors",
                showNotifications ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-400"
              )}
            >
              {showNotifications ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { key: 'all', label: 'All' },
            { key: 'security', label: 'Security' },
            { key: 'transaction', label: 'Transactions' },
            { key: 'account', label: 'Account' },
            { key: 'promotion', label: 'Tips' }
          ].map(filter => (
            <button
              key={filter.key}
              onClick={() => setFilterCategory(filter.key as typeof filterCategory)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                filterCategory === filter.key
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {showNotifications ? (
          <>
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-500">No notifications</p>
                <p className="text-sm text-gray-400">You're all caught up!</p>
              </div>
            ) : (
              <AnimatePresence>
                {filteredNotifications.map((notif) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className={cn(
                      "bg-white rounded-2xl border shadow-sm overflow-hidden transition-all",
                      notif.read ? "border-gray-100" : "border-emerald-200 shadow-md"
                    )}
                  >
                    <button
                      onClick={() => {
                        if (expandedNotif === notif.id) {
                          setExpandedNotif(null)
                        } else {
                          setExpandedNotif(notif.id)
                          markAsRead(notif.id)
                        }
                      }}
                      className="w-full p-4 text-left"
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border",
                          getNotificationColor(notif.type)
                        )}>
                          {getNotificationIcon(notif.type, notif.category)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                            )}
                            <h3 className={cn(
                              "font-medium text-sm truncate",
                              notif.read ? "text-gray-700" : "text-gray-900"
                            )}>
                              {notif.title}
                            </h3>
                          </div>
                          <p className={cn(
                            "text-xs line-clamp-2",
                            notif.read ? "text-gray-400" : "text-gray-600"
                          )}>
                            {notif.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-400">
                              {formatTimestamp(notif.timestamp)}
                            </span>
                            <span className={cn(
                              "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                              getNotificationColor(notif.type)
                            )}>
                              {notif.category}
                            </span>
                          </div>
                        </div>

                        {/* Expand Icon */}
                        <div className="flex-shrink-0">
                          {expandedNotif === notif.id ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {expandedNotif === notif.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-gray-100 px-4 py-4 bg-gray-50/50"
                        >
                          <p className="text-sm text-gray-600 mb-4">
                            {notif.message}
                          </p>
                          <div className="flex items-center gap-2">
                            {notif.actionUrl && (
                              <button
                                onClick={() => window.location.href = notif.actionUrl}
                                className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium"
                              >
                                View Details
                              </button>
                            )}
                            <button
                              onClick={() => dismissNotification(notif.id)}
                              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium"
                            >
                              Dismiss
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <BellOff className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-500">Notifications paused</p>
            <p className="text-sm text-gray-400">Tap the bell to resume</p>
          </div>
        )}
      </div>

      {/* Internal AI Advisor Info */}
      <div className="p-4 border-t border-emerald-100/50 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-700">OrbitPay AI Advisor</p>
            <p>Internal assistant - provides account insights and security alerts</p>
          </div>
          <RefreshCw className="w-4 h-4" />
        </div>
      </div>
    </div>
  )
}
