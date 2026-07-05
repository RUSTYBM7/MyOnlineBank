import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Shield, Bell, Database, Globe, CreditCard, DollarSign, Lock, Key, Users, Mail, Smartphone, FileText, Check } from 'lucide-react';
import { Button, Input, Select, Badge } from '@/components/ui';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const tabs = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'integrations', label: 'Integrations', icon: Database },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'roles', label: 'Roles & Permissions', icon: Users },
  { id: 'api', label: 'API Keys', icon: Key },
  { id: 'templates', label: 'Templates', icon: Mail },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-6 space-y-6">
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Configure your admin portal settings</p>
      </motion.div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <motion.div variants={itemVariants} className="w-64 flex-shrink-0">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 space-y-1">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                  activeTab === tab.id ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}>
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div variants={itemVariants} className="flex-1">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            {saved && (
              <div className="flex items-center gap-2 mb-4 p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400">
                <Check className="w-5 h-5" /> Settings saved successfully
              </div>
            )}

            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Organization Settings</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Organization Name" value="OrbitPay Credit Union" onChange={() => {}} />
                    <Input label="Display Name" value="OrbitPay" onChange={() => {}} />
                    <Input label="Support Email" type="email" value="support@orbitpay.com" onChange={() => {}} />
                    <Input label="Support Phone" value="+1 (555) 123-4567" onChange={() => {}} />
                    <div className="col-span-2"><Input label="Address" value="123 Financial District, Downtown" onChange={() => {}} /></div>
                    <Select label="Timezone" value="America/New_York" onChange={() => {}} options={[
                      { value: 'America/New_York', label: 'Eastern Time (ET)' },
                      { value: 'America/Chicago', label: 'Central Time (CT)' },
                      { value: 'America/Denver', label: 'Mountain Time (MT)' },
                      { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
                    ]} />
                    <Select label="Currency" value="USD" onChange={() => {}} options={[
                      { value: 'USD', label: 'US Dollar (USD)' },
                      { value: 'EUR', label: 'Euro (EUR)' },
                      { value: 'GBP', label: 'British Pound (GBP)' },
                    ]} />
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Branding</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Logo</label>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center"><Globe className="w-8 h-8 text-slate-400" /></div>
                        <Button variant="secondary" size="sm">Upload Logo</Button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Favicon</label>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center"><Globe className="w-5 h-5 text-slate-400" /></div>
                        <Button variant="secondary" size="sm">Upload Favicon</Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button variant="primary" onClick={handleSave}>Save Changes</Button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Password Policy</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Select label="Minimum Length" value="12" onChange={() => {}} options={[
                      { value: '8', label: '8 characters' },
                      { value: '10', label: '10 characters' },
                      { value: '12', label: '12 characters' },
                      { value: '16', label: '16 characters' },
                    ]} />
                    <Select label="Require Uppercase" value="yes" onChange={() => {}} options={[
                      { value: 'yes', label: 'Yes' },
                      { value: 'no', label: 'No' },
                    ]} />
                    <Select label="Require Numbers" value="yes" onChange={() => {}} options={[
                      { value: 'yes', label: 'Yes' },
                      { value: 'no', label: 'No' },
                    ]} />
                    <Select label="Require Special Characters" value="yes" onChange={() => {}} options={[
                      { value: 'yes', label: 'Yes' },
                      { value: 'no', label: 'No' },
                    ]} />
                    <Select label="Password Expiry" value="90" onChange={() => {}} options={[
                      { value: '30', label: '30 days' },
                      { value: '60', label: '60 days' },
                      { value: '90', label: '90 days' },
                      { value: 'never', label: 'Never' },
                    ]} />
                    <Select label="Session Timeout" value="30" onChange={() => {}} options={[
                      { value: '15', label: '15 minutes' },
                      { value: '30', label: '30 minutes' },
                      { value: '60', label: '1 hour' },
                      { value: 'never', label: 'Never' },
                    ]} />
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Two-Factor Authentication</h3>
                  <div className="space-y-4">
                    {[
                      { title: 'TOTP (Authenticator App)', desc: 'Use apps like Google Authenticator or Authy', enabled: true },
                      { title: 'SMS Authentication', desc: 'Receive codes via text message', enabled: false },
                      { title: 'Email Authentication', desc: 'Receive codes via email', enabled: false },
                    ].map((mfa, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                        <div><p className="text-white font-medium">{mfa.title}</p><p className="text-slate-500 text-sm">{mfa.desc}</p></div>
                        <Badge variant={mfa.enabled ? 'success' : 'default'}>{mfa.enabled ? 'Enabled' : 'Disabled'}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button variant="primary" onClick={handleSave}>Save Changes</Button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Email Notifications</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'New member registration', enabled: true },
                      { label: 'Large transaction alerts', enabled: true },
                      { label: 'KYC application submitted', enabled: true },
                      { label: 'Fraud alert detected', enabled: true },
                      { label: 'Daily summary report', enabled: false },
                    ].map((notif, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                        <span className="text-white">{notif.label}</span>
                        <button className={`w-12 h-6 rounded-full transition-colors ${notif.enabled ? 'bg-emerald-500' : 'bg-slate-600'}`}>
                          <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${notif.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">SMS Notifications</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Critical fraud alerts', enabled: true },
                      { label: 'System downtime alerts', enabled: true },
                    ].map((notif, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                        <span className="text-white">{notif.label}</span>
                        <button className={`w-12 h-6 rounded-full transition-colors ${notif.enabled ? 'bg-emerald-500' : 'bg-slate-600'}`}>
                          <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${notif.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button variant="primary" onClick={handleSave}>Save Changes</Button>
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Connected Services</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { name: 'Stripe', status: 'Connected', desc: 'Payment processing' },
                      { name: 'Twilio', status: 'Connected', desc: 'SMS & Voice' },
                      { name: 'SendGrid', status: 'Connected', desc: 'Email delivery' },
                      { name: 'AWS S3', status: 'Connected', desc: 'File storage' },
                    ].map((svc, i) => (
                      <div key={i} className="p-4 bg-slate-800/50 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">{svc.name}</span>
                          <Badge variant="success">{svc.status}</Badge>
                        </div>
                        <p className="text-slate-500 text-sm">{svc.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">API Keys</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Production API Key', key: 'sk_live_****************************', created: '2024-01-01' },
                      { name: 'Development API Key', key: 'sk_test_****************************', created: '2024-01-01' },
                      { name: 'Mobile App Key', key: 'sk_mobile_****************************', created: '2024-01-10' },
                    ].map((api, i) => (
                      <div key={i} className="p-4 bg-slate-800/50 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">{api.name}</span>
                          <Button variant="secondary" size="sm">Regenerate</Button>
                        </div>
                        <p className="text-slate-400 font-mono text-sm mb-1">{api.key}</p>
                        <p className="text-slate-500 text-xs">Created: {api.created}</p>
                      </div>
                    ))}
                  </div>
                  <Button variant="primary" className="mt-4" icon={<Key className="w-4 h-4" />}>Create New API Key</Button>
                </div>
              </div>
            )}

            {(activeTab === 'roles' || activeTab === 'billing' || activeTab === 'templates') && (
              <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                <Settings className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-lg font-medium">Settings Panel</p>
                <p className="text-sm mt-2">{tabs.find(t => t.id === activeTab)?.label} configuration options</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
