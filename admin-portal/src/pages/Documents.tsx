import { FolderOpen, Upload, Search, File, FileText, Image, Download, Eye, Trash2, MoreVertical } from 'lucide-react';
import { Button, Badge } from '@/components/ui';

export default function Documents() {
  const documents = [
    { name: 'KYC_MB001_ID.pdf', type: 'PDF', size: '2.4 MB', category: 'KYC', uploaded: '2024-01-15' },
    { name: 'Contract_ACC001.pdf', type: 'PDF', size: '1.2 MB', category: 'Contracts', uploaded: '2024-01-12' },
    { name: 'Statement_2024_01.pdf', type: 'PDF', size: '456 KB', category: 'Statements', uploaded: '2024-01-10' },
    { name: 'Member_Photo.jpg', type: 'Image', size: '234 KB', category: 'Photos', uploaded: '2024-01-08' },
    { name: 'Agreement_LN001.pdf', type: 'PDF', size: '890 KB', category: 'Agreements', uploaded: '2024-01-05' },
  ];

  const stats = { total: 156, storage: '2.4 GB', kyc: 45, contracts: 38, statements: 52 };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Document Center</h1><p className="text-slate-400 text-sm mt-1">Manage uploaded files and documents</p></div>
        <Button variant="primary" icon={<Upload className="w-4 h-4" />}>Upload</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Documents', value: stats.total },
          { label: 'Storage Used', value: stats.storage },
          { label: 'KYC Files', value: stats.kyc },
          { label: 'Contracts', value: stats.contracts },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-500 text-sm">{stat.label}</p><p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input type="text" placeholder="Search documents..." className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50" />
        </div>
        <select className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-300">
          <option>All Categories</option><option>KYC</option><option>Contracts</option><option>Statements</option><option>Agreements</option>
        </select>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="divide-y divide-slate-800">
          {documents.map((doc, i) => (
            <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-800/30">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${doc.type === 'PDF' ? 'bg-red-500/20' : 'bg-blue-500/20'}`}>
                  {doc.type === 'PDF' ? <FileText className="w-6 h-6 text-red-400" /> : <Image className="w-6 h-6 text-blue-400" />}
                </div>
                <div>
                  <p className="text-white font-medium">{doc.name}</p>
                  <div className="flex gap-3 mt-1">
                    <span className="text-slate-500 text-sm">{doc.size}</span>
                    <span className="text-slate-500 text-sm">{doc.category}</span>
                    <span className="text-slate-500 text-sm">Uploaded: {doc.uploaded}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />}>View</Button>
                <Button variant="ghost" size="sm" icon={<Download className="w-4 h-4" />}>Download</Button>
                <Button variant="ghost" size="sm" icon={<Trash2 className="w-4 h-4" />} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
