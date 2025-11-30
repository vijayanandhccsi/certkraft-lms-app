import React, { useState } from 'react';
import { 
  Upload, Image, FileVideo, FileText, Box, 
  MoreVertical, Trash2, Download, Search, Filter 
} from 'lucide-react';

const AdminMediaLibrary: React.FC = () => {
  const [filterType, setFilterType] = useState('All');

  const ASSETS = [
    { id: 1, name: 'aws-architecture-diagram.png', type: 'Image', size: '2.4 MB', date: 'Oct 24, 2023', url: '#' },
    { id: 2, name: 'intro-to-python.mp4', type: 'Video', size: '145 MB', date: 'Oct 22, 2023', url: '#' },
    { id: 3, name: 'security-policies-template.pdf', type: 'Document', size: '1.1 MB', date: 'Oct 20, 2023', url: '#' },
    { id: 4, name: 'interactive-quiz-module.zip', type: 'SCORM', size: '12 MB', date: 'Oct 18, 2023', url: '#' },
    { id: 5, name: 'kubernetes-cluster-setup.mp4', type: 'Video', size: '210 MB', date: 'Oct 15, 2023', url: '#' },
    { id: 6, name: 'kali-linux-logo.svg', type: 'Image', size: '45 KB', date: 'Oct 12, 2023', url: '#' },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'Image': return <Image className="h-8 w-8 text-purple-500" />;
      case 'Video': return <FileVideo className="h-8 w-8 text-blue-500" />;
      case 'Document': return <FileText className="h-8 w-8 text-slate-500" />;
      case 'SCORM': return <Box className="h-8 w-8 text-orange-500" />;
      default: return <FileText className="h-8 w-8 text-slate-400" />;
    }
  };

  const filteredAssets = filterType === 'All' ? ASSETS : ASSETS.filter(a => a.type === filterType);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Media Library</h1>
           <p className="text-slate-500 mt-1">Manage images, videos, documents, and SCORM packages.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm">
          <Upload className="h-4 w-4" /> Upload New Asset
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
           {['All', 'Image', 'Video', 'Document', 'SCORM'].map(type => (
             <button 
               key={type}
               onClick={() => setFilterType(type)}
               className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                 ${filterType === type ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}
               `}
             >
               {type}
             </button>
           ))}
        </div>
        <div className="relative w-full md:w-64">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
           <input 
             type="text" 
             placeholder="Search files..." 
             className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
           />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredAssets.map(asset => (
          <div key={asset.id} className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 relative">
            <div className="aspect-square bg-slate-50 flex items-center justify-center relative">
               {/* Preview Background Pattern */}
               <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"></div>
               
               <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                  {getIcon(asset.type)}
               </div>

               {/* Overlay Actions */}
               <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                  <button className="p-2 bg-white rounded-full text-slate-700 hover:text-indigo-600 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all" title="Download">
                    <Download className="h-4 w-4" />
                  </button>
                  <button className="p-2 bg-white rounded-full text-slate-700 hover:text-red-600 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all delay-75" title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
               </div>
            </div>
            
            <div className="p-3 border-t border-slate-100">
              <div className="flex justify-between items-start mb-1">
                 <h3 className="font-medium text-slate-900 text-sm truncate w-full pr-4" title={asset.name}>{asset.name}</h3>
                 <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="h-3 w-3" /></button>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-500">
                 <span>{asset.size}</span>
                 <span>{asset.date}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Upload Placeholder */}
        <button className="border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50/50 transition-all min-h-[200px]">
           <Upload className="h-8 w-8" />
           <span className="font-medium text-sm">Upload File</span>
        </button>
      </div>
    </div>
  );
};

export default AdminMediaLibrary;
