import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '@/components/glass';
import { useStore } from '@/store';
import {
  Moon, Sun, Monitor, Languages, Palette, ChevronRight,
  Check, CheckCircle2, AlertTriangle
} from 'lucide-react';

export default function AppearanceSettings() {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode, config } = useStore();
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [language, setLanguage] = useState('English');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const themeOptions = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Monitor },
  ];

  const colorOptions = [
    { id: 'emerald', color: 'bg-emerald-500', name: 'Emerald' },
    { id: 'blue', color: 'bg-blue-500', name: 'Ocean' },
    { id: 'purple', color: 'bg-purple-500', name: 'Royal' },
    { id: 'amber', color: 'bg-amber-500', name: 'Golden' },
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
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
          <h1 className="text-xl font-bold text-emerald-800">Appearance</h1>
          <p className="text-sm text-emerald-800/50">Customize your experience</p>
        </div>
      </div>

      {/* Theme Selection */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-emerald-800/60 uppercase tracking-wider">Theme</h3>
        <GlassCard className="p-4">
          <div className="grid grid-cols-3 gap-3">
            {themeOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  setTheme(option.id as typeof theme);
                  if (option.id === 'dark') toggleDarkMode();
                  else if (option.id === 'light' && darkMode) toggleDarkMode();
                  showToast(`Theme set to ${option.label}`, 'success');
                }}
                className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all ${
                  theme === option.id
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : 'bg-white/50 text-emerald-800 hover:bg-emerald-50'
                }`}
              >
                <option.icon className="w-6 h-6" />
                <span className="text-xs font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Accent Color */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-emerald-800/60 uppercase tracking-wider">Accent Color</h3>
        <GlassCard className="p-4">
          <div className="grid grid-cols-4 gap-4">
            {colorOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => showToast(`Accent color changed to ${option.name}`, 'success')}
                className="flex flex-col items-center gap-2"
              >
                <div className={`w-12 h-12 rounded-full ${option.color} shadow-lg flex items-center justify-center`}>
                  <Check className="w-5 h-5 text-white opacity-0" />
                </div>
                <span className="text-xs text-emerald-800">{option.name}</span>
              </button>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Language */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-emerald-800/60 uppercase tracking-wider">Language</h3>
        <GlassCard className="p-4">
          <button className="w-full flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Languages className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-emerald-800">App Language</p>
              <p className="text-xs text-emerald-800/60">{language}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-emerald-800/40" />
          </button>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {languages.slice(0, 6).map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.name);
                  showToast(`Language set to ${lang.name}`, 'success');
                }}
                className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                  language === lang.name
                    ? 'bg-emerald-100 border-2 border-emerald-500'
                    : 'bg-white/50 border-2 border-transparent'
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="text-xs text-emerald-800">{lang.name}</span>
              </button>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Display Options */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-emerald-800/60 uppercase tracking-wider">Display</h3>
        <GlassCard className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="font-medium text-emerald-800">Compact Mode</p>
                <p className="text-xs text-emerald-800/60">Show more content</p>
              </div>
            </div>
            <button className="w-12 h-7 rounded-full bg-slate-200 p-1">
              <motion.div
                animate={{ x: 0 }}
                className="w-5 h-5 rounded-full bg-white shadow-sm"
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sun className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="font-medium text-emerald-800">High Contrast</p>
                <p className="text-xs text-emerald-800/60">Improve visibility</p>
              </div>
            </div>
            <button className="w-12 h-7 rounded-full bg-slate-200 p-1">
              <motion.div
                animate={{ x: 0 }}
                className="w-5 h-5 rounded-full bg-white shadow-sm"
              />
            </button>
          </div>
        </GlassCard>
      </div>

      {/* Preview */}
      <GlassCard className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10">
        <h3 className="text-sm font-semibold text-emerald-800/60 uppercase tracking-wider mb-4">Preview</h3>
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500" />
            <div>
              <p className="font-medium text-emerald-800">OrbitPay</p>
              <p className="text-xs text-emerald-800/60">Credit Union</p>
            </div>
          </div>
          <div className="h-20 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl mb-3" />
          <div className="space-y-2">
            <div className="h-8 bg-emerald-100 rounded-lg" />
            <div className="h-8 bg-emerald-100 rounded-lg w-3/4" />
          </div>
        </div>
      </GlassCard>

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
    </div>
  );
}
