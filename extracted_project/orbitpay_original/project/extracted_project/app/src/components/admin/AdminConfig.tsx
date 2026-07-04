import { useState } from 'react';
import { GlassCard, GlassButton } from '@/components/glass';
import { useStore } from '@/store';
import {
  Palette, DollarSign, Bell, Upload, Globe, Save, Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminConfig() {
  const { config, setConfig } = useStore();
  const [saved, setSaved] = useState(false);

  const [localConfig, setLocalConfig] = useState({
    brandName: config.brandName,
    glassOpacity: config.glassOpacity,
    transferFee: config.transferFee,
    withdrawalFee: config.withdrawalFee,
    investmentFee: config.investmentFee,
    mint: config.brandColors.mint,
    lavender: config.brandColors.lavender,
    yellow: config.brandColors.yellow,
    black: config.brandColors.black,
  });

  const handleSave = () => {
    setConfig({
      brandName: localConfig.brandName,
      glassOpacity: localConfig.glassOpacity,
      transferFee: localConfig.transferFee,
      withdrawalFee: localConfig.withdrawalFee,
      investmentFee: localConfig.investmentFee,
      brandColors: {
        mint: localConfig.mint,
        lavender: localConfig.lavender,
        yellow: localConfig.yellow,
        black: localConfig.black,
      },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#0A0A0A]">Configuration</h1>
          <p className="text-sm text-[#0A0A0A]/50">Manage app settings and branding</p>
        </div>
        <GlassButton
          variant={saved ? 'gradient' : 'primary'}
          size="sm"
          onClick={handleSave}
          icon={saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
        >
          {saved ? 'Saved!' : 'Save Changes'}
        </GlassButton>
      </div>

      {/* Brand Settings */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <Palette className="w-5 h-5 text-[#A8E6CF]" />
          <h2 className="font-medium text-[#0A0A0A]">Brand Settings</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-[#0A0A0A]/50 mb-1.5 block">Brand Name</label>
            <input
              type="text"
              value={localConfig.brandName}
              onChange={(e) => setLocalConfig({ ...localConfig, brandName: e.target.value })}
              className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-[#0A0A0A]/50 mb-2 block">Brand Colors</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { key: 'mint', label: 'Mint', default: '#A8E6CF' },
                { key: 'lavender', label: 'Lavender', default: '#DDA0DD' },
                { key: 'yellow', label: 'Yellow', default: '#F4F7C0' },
                { key: 'black', label: 'Black', default: '#0A0A0A' },
              ].map((color) => (
                <div key={color.key}>
                  <label className="text-[10px] text-[#0A0A0A]/40 mb-1 block">{color.label}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={localConfig[color.key as keyof typeof localConfig] as string}
                      onChange={(e) => setLocalConfig({ ...localConfig, [color.key]: e.target.value })}
                      className="w-10 h-10 rounded-xl border-0 cursor-pointer"
                    />
                    <span className="text-xs font-mono text-[#0A0A0A]/50">
                      {localConfig[color.key as keyof typeof localConfig] as string}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-[#0A0A0A]/50 mb-1.5 block">Glass Opacity: {Math.round(localConfig.glassOpacity * 100)}%</label>
            <input
              type="range"
              min={0.05}
              max={0.5}
              step={0.05}
              value={localConfig.glassOpacity}
              onChange={(e) => setLocalConfig({ ...localConfig, glassOpacity: Number(e.target.value) })}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #A8E6CF 0%, #A8E6CF ${(localConfig.glassOpacity / 0.5) * 100}%, rgba(255,255,255,0.3) ${(localConfig.glassOpacity / 0.5) * 100}%)`,
              }}
            />
          </div>
          <div>
            <label className="text-xs text-[#0A0A0A]/50 mb-1.5 block">Logo Upload</label>
            <div className="border-2 border-dashed border-white/30 rounded-2xl p-8 text-center hover:border-[#A8E6CF]/50 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-[#0A0A0A]/20 mx-auto mb-2" />
              <p className="text-sm text-[#0A0A0A]/40">Click to upload logo</p>
              <p className="text-xs text-[#0A0A0A]/30">PNG, SVG up to 2MB</p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Fee Structure */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <DollarSign className="w-5 h-5 text-[#DDA0DD]" />
          <h2 className="font-medium text-[#0A0A0A]">Fee Structure</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { key: 'transferFee', label: 'Transfer Fee', desc: 'Per transfer transaction', suffix: '%' },
            { key: 'withdrawalFee', label: 'Withdrawal Fee', desc: 'Per withdrawal', suffix: '%' },
            { key: 'investmentFee', label: 'Investment Fee', desc: 'Per investment', suffix: '%' },
          ].map((fee) => (
            <div key={fee.key}>
              <label className="text-xs text-[#0A0A0A]/50 mb-1 block">{fee.label}</label>
              <div className="relative">
                <input
                  type="number"
                  step={0.1}
                  value={localConfig[fee.key as keyof typeof localConfig] as number}
                  onChange={(e) => setLocalConfig({ ...localConfig, [fee.key]: Number(e.target.value) })}
                  className="w-full glass-input px-4 py-2.5 pr-8 rounded-xl text-sm"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#0A0A0A]/30">{fee.suffix}</span>
              </div>
              <p className="text-[10px] text-[#0A0A0A]/30 mt-1">{fee.desc}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Currency Management */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <Globe className="w-5 h-5 text-[#F4F7C0]" />
          <h2 className="font-medium text-[#0A0A0A]">Currency Management</h2>
        </div>
        <div className="space-y-2">
          {config.enabledCurrencies.map((curr) => (
            <div key={curr} className="flex items-center justify-between p-3 rounded-xl bg-white/30">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#A8E6CF]/20 flex items-center justify-center text-sm font-bold text-[#0A0A0A]">
                  {curr.slice(0, 1)}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#0A0A0A]">{curr}</p>
                  <p className="text-xs text-[#0A0A0A]/40">
                    {curr === 'USD' ? 'US Dollar' : curr === 'EUR' ? 'Euro' : curr === 'GBP' ? 'British Pound' : 'Bitcoin'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn('w-2 h-2 rounded-full', curr !== 'BTC' ? 'bg-[#2ECC71]' : 'bg-[#2ECC71]')} />
                <span className="text-xs text-[#0A0A0A]/40">Active</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Notifications */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <Bell className="w-5 h-5 text-[#FF6B6B]" />
          <h2 className="font-medium text-[#0A0A0A]">Notifications</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/30">
            <div>
              <p className="text-sm font-medium text-[#0A0A0A]">Broadcast Message</p>
              <p className="text-xs text-[#0A0A0A]/40">Send to all users</p>
            </div>
            <GlassButton variant="primary" size="sm">Send</GlassButton>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/30">
            <div>
              <p className="text-sm font-medium text-[#0A0A0A]">Push Notifications</p>
              <p className="text-xs text-[#0A0A0A]/40">Firebase Cloud Messaging</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2ECC71]" />
              <span className="text-xs text-[#0A0A0A]/40">Active</span>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
