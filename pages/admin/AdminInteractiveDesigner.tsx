import React, { useState } from 'react';
import { 
  Plus, Search, Edit2, Trash2, Layout, Save, 
  ChevronLeft, Type, Image as ImageIcon, 
  CheckSquare, HelpCircle, Eye
} from 'lucide-react';

// --- Types ---

interface Option {
  id: string;
  text: string;
}

interface BlockContent {
  text?: string;
  level?: 'h1' | 'h2' | 'h3';
  align?: 'left' | 'center' | 'right';
  question?: string;
  options?: Option[];
  correctOptionId?: string;
  feedback?: string;
  imageUrl?: string;
  altText?: string;
}

interface Block {
  id: string;
  type: 'heading' | 'text' | 'image' | 'mcq';
  content: BlockContent;
}

interface InteractivePage {
  id: string;
  title: string;
  slug: string;
  status: 'Draft' | 'Published';
  lastEdited: string;
  backgroundColor: string;
  blocks: Block[];
}

// --- Mock Data ---

const MOCK_PAGES: InteractivePage[] = [
  {
    id: 'page_1',
    title: 'DNS Troubleshooting Scenario',
    slug: 'dns-troubleshooting',
    status: 'Published',
    lastEdited: 'Oct 24, 2023',
    backgroundColor: '#ffffff',
    blocks: [
      { id: 'b1', type: 'heading', content: { text: 'Diagnosing DNS Issues', level: 'h1', align: 'center' } },
      { id: 'b2', type: 'text', content: { text: 'In this scenario, users are reporting they cannot access the internal CRM. You need to identify the root cause.', align: 'left' } },
      { 
        id: 'b3', 
        type: 'mcq', 
        content: { 
          question: 'What command would you run first to check connectivity?',
          options: [
            { id: 'opt1', text: 'ping crm.internal' },
            { id: 'opt2', text: 'reboot server' },
            { id: 'opt3', text: 'systemctl restart network' }
          ],
          correctOptionId: 'opt1',
          feedback: 'Correct! Ping is the best first step to verify basic connectivity.' 
        } 
      },
      {
        id: 'b4',
        type: 'mcq',
        content: {
          question: 'Which cloud provider offers the most extensive global infrastructure?',
          options: [
            { id: 'opt_aws', text: 'AWS' },
            { id: 'opt_azure', text: 'Azure' },
            { id: 'opt_gcp', text: 'GCP' }
          ],
          correctOptionId: 'opt_aws',
          feedback: 'AWS has the largest number of regions and availability zones.'
        }
      }
    ]
  }
];

const AdminInteractiveDesigner: React.FC = () => {
  const [pages, setPages] = useState<InteractivePage[]>(MOCK_PAGES);
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [currentPage, setCurrentPage] = useState<InteractivePage | null>(null);

  const handleEdit = (page: InteractivePage) => {
    setCurrentPage(page);
    setView('editor');
  };

  const handleCreate = () => {
    const newPage: InteractivePage = {
      id: `page_${Date.now()}`,
      title: 'New Interactive Page',
      slug: 'new-page',
      status: 'Draft',
      lastEdited: new Date().toLocaleDateString(),
      backgroundColor: '#ffffff',
      blocks: []
    };
    setPages([...pages, newPage]);
    setCurrentPage(newPage);
    setView('editor');
  };

  if (view === 'editor' && currentPage) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('list')} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Page Editor</h1>
              <p className="text-slate-500 text-sm">Editing: {currentPage.title}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50">Preview</button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 flex items-center gap-2">
              <Save className="h-4 w-4" /> Save
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Canvas Area */}
          <div className="lg:col-span-2 space-y-4">
             <div className="bg-white border border-slate-200 rounded-xl p-8 min-h-[500px] shadow-sm" style={{ backgroundColor: currentPage.backgroundColor }}>
                {currentPage.blocks.length === 0 ? (
                  <div className="text-center py-20 text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                    Drag and drop blocks here or click to add
                  </div>
                ) : (
                  currentPage.blocks.map((block) => (
                    <div key={block.id} className="group relative border-2 border-transparent hover:border-indigo-100 hover:bg-indigo-50/10 rounded-lg p-2 transition-all mb-4">
                       <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 flex gap-2">
                          <button className="p-1 text-slate-400 hover:text-indigo-600 bg-white rounded shadow-sm"><Edit2 className="h-3 w-3" /></button>
                          <button className="p-1 text-slate-400 hover:text-red-600 bg-white rounded shadow-sm"><Trash2 className="h-3 w-3" /></button>
                       </div>
                       
                       {/* Block Rendering Logic */}
                       {block.type === 'heading' && (
                          <h2 className={`text-2xl font-bold text-slate-900 text-${block.content.align || 'left'}`}>{block.content.text}</h2>
                       )}
                       {block.type === 'text' && (
                          <p className={`text-slate-700 text-${block.content.align || 'left'}`}>{block.content.text}</p>
                       )}
                       {block.type === 'mcq' && (
                          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                             <p className="font-bold text-slate-800 mb-3">{block.content.question}</p>
                             <div className="space-y-2">
                                {block.content.options?.map(opt => (
                                   <div key={opt.id} className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded">
                                      <div className="w-4 h-4 rounded-full border border-slate-300"></div>
                                      <span className="text-sm">{opt.text}</span>
                                      {opt.id === block.content.correctOptionId && <CheckSquare className="h-4 w-4 text-emerald-500 ml-auto" />}
                                   </div>
                                ))}
                             </div>
                          </div>
                       )}
                    </div>
                  ))
                )}
             </div>
          </div>

          {/* Sidebar Tools */}
          <div className="space-y-6">
             <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Components</h3>
                <div className="grid grid-cols-2 gap-3">
                   <button className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all text-slate-600 hover:text-indigo-700">
                      <Type className="h-6 w-6 mb-2" />
                      <span className="text-xs font-bold">Text</span>
                   </button>
                   <button className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all text-slate-600 hover:text-indigo-700">
                      <ImageIcon className="h-6 w-6 mb-2" />
                      <span className="text-xs font-bold">Image</span>
                   </button>
                   <button className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all text-slate-600 hover:text-indigo-700">
                      <HelpCircle className="h-6 w-6 mb-2" />
                      <span className="text-xs font-bold">Quiz / MCQ</span>
                   </button>
                   <button className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all text-slate-600 hover:text-indigo-700">
                      <Layout className="h-6 w-6 mb-2" />
                      <span className="text-xs font-bold">Layout</span>
                   </button>
                </div>
             </div>
             
             <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Page Settings</h3>
                <div className="space-y-3">
                   <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Page Title</label>
                      <input type="text" value={currentPage.title} className="w-full text-sm border border-slate-300 rounded p-2" readOnly />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Background Color</label>
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 rounded border border-slate-300" style={{ backgroundColor: currentPage.backgroundColor }}></div>
                         <input type="text" value={currentPage.backgroundColor} className="flex-1 text-sm border border-slate-300 rounded p-2" readOnly />
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Interactive Designer</h1>
           <p className="text-slate-500 mt-1">Create engaging, interactive learning modules.</p>
        </div>
        <button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all active:scale-95">
          <Plus className="h-4 w-4" /> Create Page
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
         <div className="p-4 border-b border-slate-100 flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
               <input type="text" placeholder="Search pages..." className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>
         </div>
         <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-xs">
               <tr>
                  <th className="px-6 py-4 font-semibold">Title</th>
                  <th className="px-6 py-4 font-semibold">Slug</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Last Edited</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {pages.map(page => (
                  <tr key={page.id} className="hover:bg-slate-50 transition-colors group">
                     <td className="px-6 py-4 font-bold text-slate-900">{page.title}</td>
                     <td className="px-6 py-4 text-slate-500">{page.slug}</td>
                     <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${page.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                           {page.status}
                        </span>
                     </td>
                     <td className="px-6 py-4 text-slate-500">{page.lastEdited}</td>
                     <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button className="p-2 text-slate-400 hover:text-indigo-600 bg-white border border-slate-200 rounded shadow-sm" title="Preview"><Eye className="h-4 w-4" /></button>
                           <button onClick={() => handleEdit(page)} className="p-2 text-slate-400 hover:text-indigo-600 bg-white border border-slate-200 rounded shadow-sm" title="Edit"><Edit2 className="h-4 w-4" /></button>
                           <button className="p-2 text-slate-400 hover:text-red-600 bg-white border border-slate-200 rounded shadow-sm" title="Delete"><Trash2 className="h-4 w-4" /></button>
                        </div>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
};

export default AdminInteractiveDesigner;