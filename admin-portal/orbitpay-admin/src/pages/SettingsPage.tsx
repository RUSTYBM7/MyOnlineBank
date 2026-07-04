import { useState } from 'react';
import { User, Bell, Shield, Palette, Globe, Database, Mail, Key, Smartphone, Save, Upload, Download } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'integrations', name: 'Integrations', icon: Globe },
    { id: 'data', name: 'Data & Privacy', icon: Database },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-6">
              <h2 className="text-xl font-semibold text-white">Profile Settings</h2>

              {/* Avatar */}
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">SM</span>
                </div>
                <div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-all">
                    <Upload className="w-4 h-4" />
                    Upload Photo
                  </button>
                  <p className="text-xs text-slate-400 mt-2">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>

              {/* Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    defaultValue="Sarah Mitchell"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue="admin@orbitpay.com"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
                  <input
                    type="text"
                    defaultValue="Super Administrator"
                    disabled
                    className="w-full px-4 py-3 bg-slate-800/30 border border-slate-700 rounded-xl text-slate-400 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Department</label>
                  <select className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500">
                    <option>Operations</option>
                    <option>Compliance</option>
                    <option>Technology</option>
                    <option>Customer Service</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-all">
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-6">
              <h2 className="text-xl font-semibold text-white">Security Settings</h2>

              {/* Password */}
              <div className="p-4 bg-slate-800/30 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Key className="w-5 h-5 text-emerald-400" />
                    <div>
                      <p className="font-medium text-white">Password</p>
                      <p className="text-sm text-slate-400">Last changed 30 days ago</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-all">
                    Change
                  </button>
                </div>
              </div>

              {/* 2FA */}
              <div className="p-4 bg-slate-800/30 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-emerald-400" />
                    <div>
                      <p className="font-medium text-white">Two-Factor Authentication</p>
                      <p className="text-sm text-slate-400">Enabled - Using authenticator app</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 font-medium rounded-lg transition-all">
                    Manage
                  </button>
                </div>
              </div>

              {/* Active Sessions */}
              <div className="p-4 bg-slate-800/30 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-emerald-400" />
                    <div>
                      <p className="font-medium text-white">Active Sessions</p>
                      <p className="text-sm text-slate-400">2 devices currently logged in</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 font-medium rounded-lg transition-all">
                    Sign Out All
                  </button>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                    <div>
                      <p className="text-sm text-white">Chrome on MacOS</p>
                      <p className="text-xs text-slate-400">New York, USA • Current session</p>
                    </div>
                    <span className="px-2 py-1 text-xs bg-emerald-500/10 text-emerald-400 rounded">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                    <div>
                      <p className="text-sm text-white">Safari on iPhone</p>
                      <p className="text-xs text-slate-400">New York, USA • 2 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-6">
              <h2 className="text-xl font-semibold text-white">Notification Preferences</h2>

              {[
                { name: 'New User Registrations', desc: 'Get notified when a new user signs up', enabled: true },
                { name: 'KYC Applications', desc: 'Alerts for pending identity verification', enabled: true },
                { name: 'Large Transactions', desc: 'Notify for transactions over $10,000', enabled: true },
                { name: 'System Alerts', desc: 'Critical system notifications', enabled: true },
                { name: 'Daily Reports', desc: 'Receive daily summary reports', enabled: false },
                { name: 'Marketing Updates', desc: 'Product updates and announcements', enabled: false },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl">
                  <div>
                    <p className="font-medium text-white">{item.name}</p>
                    <p className="text-sm text-slate-400">{item.desc}</p>
                  </div>
                  <button className={`w-12 h-6 rounded-full transition-colors ${
                    item.enabled ? 'bg-emerald-500' : 'bg-slate-600'
                  }`}>
                    <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      item.enabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`}></div>
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-6">
              <h2 className="text-xl font-semibold text-white">Appearance</h2>

              <div>
                <p className="font-medium text-white mb-4">Theme</p>
                <div className="grid grid-cols-3 gap-4">
                  {['Dark', 'Light', 'System'].map((theme) => (
                    <button
                      key={theme}
                      className={`p-4 rounded-xl border transition-all ${
                        theme === 'Dark'
                          ? 'bg-emerald-500/10 border-emerald-500/50'
                          : 'bg-slate-800/30 border-slate-700/50 hover:border-emerald-500/30'
                      }`}
                    >
                      <p className={`font-medium ${
                        theme === 'Dark' ? 'text-white' : 'text-slate-300'
                      }`}>{theme}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-medium text-white mb-4">Sidebar Density</p>
                <div className="grid grid-cols-3 gap-4">
                  {['Compact', 'Default', 'Comfortable'].map((density) => (
                    <button
                      key={density}
                      className={`p-4 rounded-xl border transition-all ${
                        density === 'Default'
                          ? 'bg-emerald-500/10 border-emerald-500/50'
                          : 'bg-slate-800/30 border-slate-700/50 hover:border-emerald-500/30'
                      }`}
                    >
                      <p className={`font-medium ${
                        density === 'Default' ? 'text-white' : 'text-slate-300'
                      }`}>{density}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-6">
              <h2 className="text-xl font-semibold text-white">Integrations</h2>

              {[
                { name: 'Slack', desc: 'Receive notifications in Slack', connected: true },
                { name: 'Jira', desc: 'Create tickets for issues', connected: false },
                { name: 'GitHub', desc: 'Link code repositories', connected: false },
                { name: 'Salesforce', desc: 'Sync customer data', connected: true },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{item.name}</p>
                      <p className="text-sm text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                  <button className={`px-4 py-2 font-medium rounded-lg transition-all ${
                    item.connected
                      ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                      : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                  }`}>
                    {item.connected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'data' && (
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-6">
              <h2 className="text-xl font-semibold text-white">Data & Privacy</h2>

              <div className="p-4 bg-slate-800/30 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Export Data</p>
                    <p className="text-sm text-slate-400">Download all your data in JSON format</p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-all">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>

              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-red-400">Delete Account</p>
                    <p className="text-sm text-slate-400">Permanently delete your account and all data</p>
                  </div>
                  <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-all">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
