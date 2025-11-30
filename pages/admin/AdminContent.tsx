import React from 'react';
import { Layers, Plus, Search, FileText, Video, Box } from 'lucide-react';

const AdminContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Course Content</h1>
           <p className="text-slate-500 mt-1">Manage reusable content blocks, SCORM packages, and assessments.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-colors">
            <Box className="h-4 w-4" /> Import SCORM
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all">
            <Plus className="h-4 w-4" /> Add Content Block
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
           <input 
             type="text" 
             placeholder="Search content..." 
             className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
           />
        </div>
        <div className="flex gap-2">
            <select className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-600 bg-white focus:outline-none focus:border-indigo-500">
                <option>All Types</option>
                <option>Video</option>
                <option>Quiz</option>
                <option>Lab</option>
                <option>SCORM</option>
            </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* Placeholder Empty State */}
        <div className="flex flex-col items-center justify-center py-20 text-center">
           <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
             <Layers className="h-8 w-8 text-slate-300" />
           </div>
           <h3 className="text-lg font-medium text-slate-900 mb-2">Content Library Empty</h3>
           <p className="text-slate-500 max-w-md mb-6">
             Start building your library of reusable content snippets that can be attached to any lesson.
           </p>
           <button className="text-indigo-600 font-semibold hover:text-indigo-700">
             Learn about Content Blocks &rarr;
           </button>
        </div>
      </div>
    </div>
  );
};

export default AdminContent;