import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard, GlassButton } from '@/components/glass';
import {
  Check,
  ChevronLeft,
  Clock,
  Info,
  MapPin,
  Monitor,
  Smartphone,
  Tablet,
  X
} from 'lucide-react';;
import { useNavigate } from 'react-router-dom';

interface Device {
  id: string;
  type: 'mobile' | 'desktop' | 'tablet';
  name: string;
  browser: string;
  location: string;
  lastActive: string;
  current: boolean;
}

export default function DevicesPage() {
  const navigate = useNavigate();
  const [devices, setDevices] = useState<Device[]>([
    {
      id: '1',
      type: 'mobile',
      name: 'iPhone 15 Pro',
      browser: 'Safari 17',
      location: 'San Francisco, CA',
      lastActive: 'Active now',
      current: true,
    },
    {
      id: '2',
      type: 'desktop',
      name: 'MacBook Pro 16"',
      browser: 'Chrome 120',
      location: 'San Francisco, CA',
      lastActive: '2 hours ago',
      current: false,
    },
    {
      id: '3',
      type: 'tablet',
      name: 'iPad Pro 12.9"',
      browser: 'Safari 17',
      location: 'Los Angeles, CA',
      lastActive: '3 days ago',
      current: false,
    },
    {
      id: '4',
      type: 'mobile',
      name: 'Samsung Galaxy S24',
      browser: 'Chrome 120',
      location: 'New York, NY',
      lastActive: '1 week ago',
      current: false,
    },
  ]);

  const [showRemoveConfirm, setShowRemoveConfirm] = useState<string | null>(null);

  const getDeviceIcon = (type: Device['type']) => {
    switch (type) {
      case 'mobile':
        return Smartphone;
      case 'desktop':
        return Monitor;
      case 'tablet':
        return Tablet;
    }
  };

  const removeDevice = (deviceId: string) => {
    setDevices(devices.filter(d => d.id !== deviceId));
    setShowRemoveConfirm(null);
  };

  const removeAllOtherDevices = () => {
    setDevices(devices.filter(d => d.current));
    setShowRemoveConfirm(null);
  };

  return (
    <div className="p-5 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/app/settings')}
          className="w-10 h-10 rounded-xl bg-white/50 backdrop-blur-sm flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5 text-emerald-800" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-emerald-800">Connected Devices</h1>
          <p className="text-sm text-emerald-800/50">Manage your active sessions</p>
        </div>
      </div>

      {/* Current Device Info */}
      <GlassCard className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-bold text-emerald-800">Current Session</p>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                This Device
              </span>
            </div>
            <p className="text-sm text-emerald-800/60">iPhone 15 Pro • Safari 17</p>
          </div>
          <Check className="w-6 h-6 text-emerald-500" />
        </div>
      </GlassCard>

      {/* Other Devices */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-emerald-800/70">Other Devices</p>
          {devices.filter(d => !d.current).length > 0 && (
            <button
              onClick={() => setShowRemoveConfirm('all')}
              className="text-sm text-red-500 hover:text-red-600 font-medium"
            >
              Remove All
            </button>
          )}
        </div>

        {devices.filter(d => !d.current).length === 0 ? (
          <GlassCard className="p-6 text-center">
            <Smartphone className="w-12 h-12 text-emerald-800/20 mx-auto mb-3" />
            <p className="text-emerald-800/60">No other devices connected</p>
          </GlassCard>
        ) : (
          devices.filter(d => !d.current).map((device) => {
            const DeviceIcon = getDeviceIcon(device.type);
            return (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
              >
                <GlassCard className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/30 flex items-center justify-center">
                      <DeviceIcon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-emerald-800">{device.name}</p>
                      <p className="text-sm text-emerald-800/60">{device.browser}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs text-emerald-800/40">
                          <MapPin className="w-3 h-3" />
                          {device.location}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-emerald-800/40">
                          <Clock className="w-3 h-3" />
                          {device.lastActive}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowRemoveConfirm(device.id)}
                      className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors"
                    >
                      <X className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </GlassCard>

                {/* Remove Confirmation */}
                {showRemoveConfirm === device.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2 p-4 bg-red-50 rounded-xl border border-red-200"
                  >
                    <p className="text-sm text-red-700 mb-3">
                      Are you sure you want to remove this device? You'll need to sign in again if you use it.
                    </p>
                    <div className="flex gap-2">
                      <GlassButton
                        onClick={() => setShowRemoveConfirm(null)}
                        variant="secondary"
                        size="sm"
                        className="flex-1"
                      >
                        Cancel
                      </GlassButton>
                      <GlassButton
                        onClick={() => removeDevice(device.id)}
                        variant="danger"
                        size="sm"
                        className="flex-1"
                      >
                        Remove
                      </GlassButton>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })
        )}
      </div>

      {/* Remove All Confirmation */}
      {showRemoveConfirm === 'all' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 bg-red-50 rounded-xl border border-red-200"
        >
          <p className="text-sm text-red-700 mb-3">
            This will sign out all other devices. You'll need to sign in again on those devices.
          </p>
          <div className="flex gap-2">
            <GlassButton
              onClick={() => setShowRemoveConfirm(null)}
              variant="secondary"
              size="sm"
              className="flex-1"
            >
              Cancel
            </GlassButton>
            <GlassButton
              onClick={removeAllOtherDevices}
              variant="danger"
              size="sm"
              className="flex-1"
            >
              Remove All
            </GlassButton>
          </div>
        </motion.div>
      )}

      {/* Security Tip */}
      <div className="p-4 bg-amber-50 rounded-xl">
        <p className="text-sm text-amber-700">
          <strong>Security Tip:</strong> If you see unfamiliar devices, remove them immediately and consider changing your password.
        </p>
      </div>
    </div>
  );
}
