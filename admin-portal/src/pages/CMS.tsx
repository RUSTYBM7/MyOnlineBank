import { Globe, FileText, Image, Plus, Edit, Eye, Trash2 } from 'lucide-react';
import { Button, Badge } from '@/components/ui';

export default function CMS() {
  const pages = [
    { title: 'Homepage', status: 'published', lastUpdated: '2024-01-15' },
    { title: 'About Us', status: 'published', lastUpdated: '2024-01-10' },
    { title: 'Products & Services', status: 'published', lastUpdated: '2024-01-12' },
    { title: 'Contact Us', status: 'draft', lastUpdated: '2024-01-08' },
    { title: 'FAQ', status: 'published', lastUpdated: '2024-01-05' },
    { title: 'Privacy Policy', status: 'published', lastUpdated: '2024-01-01' },
  ];

  const banners = [
    { title: 'New Year Savings', image: 'banner1.jpg', status: 'active', clicks: 12450 },
    { title: 'Premium Upgrade', image: 'banner2.jpg', status: 'inactive', clicks: 0 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">CMS & Website</h1><p className="text-slate-400 text-sm mt-1">Manage website content and media</p></div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />}>Add Page</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Pages', value: 12 },
          { label: 'Published', value: 10 },
          { label: 'Drafts', value: 2 },
          { label: 'Media Files', value: 156 },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-500 text-sm">{stat.label}</p><p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800"><h3 className="text-lg font-semibold text-white">Pages</h3></div>
          <div className="divide-y divide-slate-800">
            {pages.map((page, i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-800/30">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-slate-400" />
                  <div><p className="text-white">{page.title}</p><p className="text-slate-500 text-xs">Updated: {page.lastUpdated}</p></div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={page.status === 'published' ? 'success' : 'warning'}>{page.status}</Badge>
                  <button className="p-1.5 text-slate-400 hover:text-white"><Eye className="w-4 h-4" /></button>
                  <button className="p-1.5 text-slate-400 hover:text-white"><Edit className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800"><h3 className="text-lg font-semibold text-white">Hero Banners</h3></div>
          <div className="p-4 space-y-4">
            {banners.map((banner, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl">
                <div className="w-24 h-16 bg-slate-700 rounded-lg flex items-center justify-center">
                  <Image className="w-8 h-8 text-slate-500" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{banner.title}</p>
                  <p className="text-slate-500 text-sm">{banner.clicks > 0 ? `${banner.clicks.toLocaleString()} clicks` : 'No views yet'}</p>
                </div>
                <Badge variant={banner.status === 'active' ? 'success' : 'default'}>{banner.status}</Badge>
                <button className="p-1.5 text-slate-400 hover:text-white"><Edit className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
