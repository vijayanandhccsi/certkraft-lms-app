import React, { useState } from 'react';
import { 
  Plus, Edit2, Trash2, Search, Map,
  Save, GripVertical,
  Sparkles, Loader2, Image as ImageIcon, X,
  Book, Clock, Tag, Target, DollarSign, Globe, Calendar, Settings,
  BarChart, Layers, FileText, Terminal
} from 'lucide-react';
import { useLearningPaths } from '../../contexts/LearningPathContext';
import { LearningPath, EnrollmentType } from '../../data/learningPaths';
import { generateSimpleText } from '../../services/geminiService';

// Constants for Categories
const CATEGORIES = [
  'Cloud', 'Cybersecurity', 'DevOps', 'AI', 'Networking', 
  'Linux', 'Data Engineering', 'IoT', 'Software Development'
];

// --- EDITOR SUB-COMPONENTS ---

const GeneralTab = ({ path, setPath, handleAiGenerate, aiLoading, handleImageUpload }: { 
  path: LearningPath; 
  setPath: (p: LearningPath) => void;
  handleAiGenerate: (field: any) => Promise<void>;
  aiLoading: Record<string, boolean>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="space-y-8">
    
    {/* SECTION: BASIC INFO */}
    <div>
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2 flex items-center gap-2">
        <FileText className="h-4 w-4" /> Basic Info
      </h3>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
            <Book className="h-4 w-4 text-indigo-500" /> Path Title
          </label>
          <div className="relative w-full">
            <input 
              type="text" 
              value={path.title} 
              onChange={e => setPath({...path, title: e.target.value})}
              placeholder="e.g. Cloud Computing Architect"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 pr-10 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => handleAiGenerate('title')}
              disabled={!path.title || aiLoading.title}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-400 disabled:cursor-not-allowed disabled:text-slate-600"
              title="Auto-generate with Gemini AI"
            >
              {aiLoading.title ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
           <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
             <FileText className="h-4 w-4 text-indigo-500" /> Short Description
           </label>
           <div className="relative w-full">
             <input 
               type="text" 
               value={path.desc}
               onChange={e => setPath({...path, desc: e.target.value})}
               placeholder="Brief overview for card view..."
               className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 pr-10 text-white placeholder-slate-400 outline-none transition-colors"
             />
             <button
                type="button"
                onClick={() => handleAiGenerate('desc')}
                disabled={!path.title || aiLoading.desc}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-400 disabled:cursor-not-allowed disabled:text-slate-600"
                title="Auto-generate with Gemini AI"
              >
                {aiLoading.desc ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              </button>
           </div>
        </div>

        <div>
           <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
             <FileText className="h-4 w-4 text-indigo-500" /> Long Description (Landing Page)
           </label>
           <div className="relative w-full">
             <textarea 
               value={path.longDescription}
               onChange={e => setPath({...path, longDescription: e.target.value})}
               rows={4}
               placeholder="Detailed description covering benefits, outcomes, and curriculum..."
               className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 pr-10 text-white placeholder-slate-400 outline-none transition-colors"
             />
             <button
                type="button"
                onClick={() => handleAiGenerate('longDescription')}
                disabled={!path.title || aiLoading.longDescription}
                className="absolute right-3 top-3 text-slate-400 hover:text-indigo-400 disabled:cursor-not-allowed disabled:text-slate-600"
                title="Auto-generate with Gemini AI"
              >
                {aiLoading.longDescription ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              </button>
           </div>
        </div>
      </div>
    </div>

    {/* SECTION: VISUALS */}
    <div>
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2 flex items-center gap-2">
        <ImageIcon className="h-4 w-4" /> Visuals
      </h3>
      <div>
         <label className="block text-sm font-bold text-slate-700 mb-1">Path Preview Image / Banner</label>
         <div className="mt-2 flex justify-center rounded-xl border-2 border-dashed border-slate-300 px-6 py-10 hover:bg-slate-50 transition-colors bg-white">
            <div className="text-center">
               {path.banner ? (
                 <div className="mb-4 relative group">
                    <img src={path.banner} alt="Banner preview" className="mx-auto h-48 object-cover rounded-lg shadow-md" />
                    <button 
                      onClick={() => setPath({...path, banner: ''})}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                 </div>
               ) : (
                 <ImageIcon className="mx-auto h-12 w-12 text-slate-300" aria-hidden="true" />
               )}
               <div className="mt-4 flex text-sm leading-6 text-slate-600 justify-center">
                  <label
                     htmlFor="banner-upload"
                     className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                  >
                     <span>Upload a file</span>
                     <input 
                       id="banner-upload" 
                       name="banner-upload" 
                       type="file" 
                       className="sr-only" 
                       accept="image/png, image/jpeg, image/gif"
                       onChange={handleImageUpload}
                     />
                  </label>
                  <p className="pl-1">or drag and drop</p>
               </div>
               <p className="text-xs leading-5 text-slate-500">PNG, JPG, GIF (Rec. 1200x630px)</p>
            </div>
         </div>
      </div>
    </div>

    {/* SECTION: METRICS */}
    <div>
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2 flex items-center gap-2">
        <BarChart className="h-4 w-4" /> Metrics
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
           <label className="block text-sm font-bold text-slate-700 mb-1">Difficulty</label>
           <select 
             value={path.level}
             onChange={e => setPath({...path, level: e.target.value as any})}
             className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white outline-none"
           >
             <option value="Beginner">Beginner</option>
             <option value="Intermediate">Intermediate</option>
             <option value="Advanced">Advanced</option>
             <option value="Mixed">Mixed (Auto)</option>
           </select>
        </div>
        <div>
           <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
             <Clock className="h-4 w-4 text-indigo-500" /> Est. Hours
           </label>
           <input 
             type="text" 
             value={path.estimatedHours}
             onChange={e => setPath({...path, estimatedHours: e.target.value})}
             placeholder="e.g. 40"
             className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 outline-none"
           />
        </div>
        <div>
           <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
             <Layers className="h-4 w-4 text-indigo-500" /> # Courses
           </label>
           <input 
             type="number" 
             value={path.coursesCount}
             onChange={e => setPath({...path, coursesCount: Number(e.target.value)})}
             className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 outline-none"
           />
        </div>
        <div>
           <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
             <Terminal className="h-4 w-4 text-indigo-500" /> # Labs
           </label>
           <input 
             type="number" 
             value={path.labsCount}
             onChange={e => setPath({...path, labsCount: Number(e.target.value)})}
             className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 outline-none"
           />
        </div>
      </div>
    </div>

    {/* SECTION: TAXONOMY */}
    <div>
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2 flex items-center gap-2">
        <Tag className="h-4 w-4" /> Taxonomy
      </h3>
      <div className="grid grid-cols-1 gap-6">
        <div>
           <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
             <Target className="h-4 w-4 text-indigo-500" /> Target Roles
           </label>
           <div className="relative w-full">
             <input 
               type="text" 
               value={path.roles.join(', ')}
               onChange={e => setPath({...path, roles: e.target.value.split(',').map(s => s.trim())})}
               placeholder="Comma separated (e.g. Security Analyst, Pen Tester)"
               className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 pr-10 text-white placeholder-slate-400 outline-none transition-colors"
             />
             <button
                type="button"
                onClick={() => handleAiGenerate('roles')}
                disabled={!path.title || aiLoading.roles}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-400 disabled:cursor-not-allowed disabled:text-slate-600"
              >
                {aiLoading.roles ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              </button>
           </div>
        </div>

        <div>
           <label className="block text-sm font-bold text-slate-700 mb-1">Categories</label>
           <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 text-white flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    const exists = path.categories.includes(cat);
                    const newCats = exists ? path.categories.filter(c => c !== cat) : [...path.categories, cat];
                    setPath({...path, categories: newCats});
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors
                    ${path.categories.includes(cat) 
                      ? 'bg-indigo-600 border-indigo-500 text-white' 
                      : 'bg-slate-700 border-slate-600 text-slate-400 hover:bg-slate-600'}
                  `}
                >
                  {cat}
                </button>
              ))}
           </div>
        </div>

        <div>
           <label className="block text-sm font-bold text-slate-700 mb-1">Skills Gained</label>
           <div className="relative w-full">
             <input 
               type="text" 
               value={path.skills.join(', ')}
               onChange={e => setPath({...path, skills: e.target.value.split(',').map(s => s.trim())})}
               placeholder="Comma separated (e.g. AWS IAM, Docker, K8s)"
               className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 pr-10 text-white placeholder-slate-400 outline-none transition-colors"
             />
             <button
                type="button"
                onClick={() => handleAiGenerate('skills')}
                disabled={!path.title || aiLoading.skills}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-400 disabled:cursor-not-allowed disabled:text-slate-600"
              >
                {aiLoading.skills ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              </button>
           </div>
        </div>
      </div>
    </div>
  </div>
);

const SettingsTab = ({ path, setPath, handleAiGenerate, aiLoading }: { 
  path: LearningPath, 
  setPath: (p: LearningPath) => void,
  handleAiGenerate: (field: any) => Promise<void>,
  aiLoading: Record<string, boolean>
}) => (
  <div className="space-y-8">
      
      {/* VISIBILITY */}
      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2 flex items-center gap-2">
          <Globe className="h-4 w-4" /> Path Visibility
        </h3>
        <div className="flex flex-col gap-3">
           <label className="flex items-center gap-3 cursor-pointer">
             <input type="radio" name="status" checked={path.status === 'Draft'} onChange={() => setPath({...path, status: 'Draft'})} className="accent-indigo-600" />
             <span className="text-slate-700 font-medium">Draft (Hidden)</span>
           </label>
           <label className="flex items-center gap-3 cursor-pointer">
             <input type="radio" name="status" checked={path.status === 'Published'} onChange={() => setPath({...path, status: 'Published'})} className="accent-indigo-600" />
             <span className="text-slate-700 font-medium">Published (Visible)</span>
           </label>
           <label className="flex items-center gap-3 cursor-pointer">
             <input type="radio" name="status" checked={path.status === 'Scheduled'} onChange={() => setPath({...path, status: 'Scheduled'})} className="accent-indigo-600" />
             <span className="text-slate-700 font-medium">Scheduled Publish Date</span>
           </label>
           {path.status === 'Scheduled' && (
             <div className="ml-7 mt-1">
                <input 
                  type="date" 
                  value={path.scheduledDate} 
                  onChange={e => setPath({...path, scheduledDate: e.target.value})}
                  className="bg-slate-100 border border-slate-300 rounded p-2 text-sm text-slate-700 outline-none focus:border-indigo-500"
                />
             </div>
           )}
        </div>
      </div>

      {/* ENROLLMENT & PRICING */}
      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2 flex items-center gap-2">
          <DollarSign className="h-4 w-4" /> Enrollment & Pricing
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Enrollment Type</label>
              <select 
                value={path.enrollmentType}
                onChange={e => setPath({...path, enrollmentType: e.target.value as EnrollmentType})}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white outline-none"
              >
                <option value="Free">Free</option>
                <option value="Paid">Paid (Single Purchase)</option>
                <option value="Subscription">Subscription Only</option>
                <option value="Corporate">Corporate License Only</option>
              </select>
           </div>
           
           {(path.enrollmentType === 'Paid' || path.enrollmentType === 'Subscription') && (
             <>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Base Price ($)</label>
                  <input 
                    type="number" 
                    value={path.price}
                    onChange={e => setPath({...path, price: Number(e.target.value)})}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white outline-none"
                  />
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Discount Price ($)</label>
                  <input 
                    type="number" 
                    value={path.discountPrice}
                    onChange={e => setPath({...path, discountPrice: Number(e.target.value)})}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white outline-none"
                  />
               </div>
             </>
           )}
        </div>
      </div>

      {/* SEO & METADATA */}
      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2 flex items-center gap-2">
          <Search className="h-4 w-4" /> SEO & Metadata
        </h3>
        <div className="space-y-4">
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-1">URL Slug</label>
               <div className="flex items-center">
                   <span className="bg-slate-100 border border-r-0 border-slate-300 text-slate-500 rounded-l-lg px-3 py-3 text-sm">
                       /learning-paths/
                   </span>
                   <input 
                       type="text" 
                       value={path.slug} 
                       onChange={e => setPath({...path, slug: e.target.value})}
                       className="flex-1 bg-slate-800 border border-slate-600 rounded-r-lg p-3 text-white placeholder-slate-400 outline-none"
                   />
               </div>
            </div>

            <div>
               <label className="block text-sm font-bold text-slate-700 mb-1">Meta Title</label>
               <div className="relative w-full">
                 <input 
                   type="text" 
                   value={path.seoTitle || ''} 
                   onChange={e => setPath({...path, seoTitle: e.target.value})}
                   placeholder="SEO Title (60 chars)"
                   className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 pr-10 text-white placeholder-slate-400 outline-none"
                 />
                 <button
                    type="button"
                    onClick={() => handleAiGenerate('seoTitle')}
                    disabled={!path.title || aiLoading.seoTitle}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-400 disabled:cursor-not-allowed disabled:text-slate-600"
                  >
                    {aiLoading.seoTitle ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  </button>
               </div>
            </div>

            <div>
               <label className="block text-sm font-bold text-slate-700 mb-1">Meta Description</label>
               <div className="relative w-full">
                 <textarea 
                   value={path.seoDescription || ''} 
                   onChange={e => setPath({...path, seoDescription: e.target.value})}
                   rows={2}
                   placeholder="SEO Description (160 chars)"
                   className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 pr-10 text-white placeholder-slate-400 outline-none"
                 />
                 <button
                    type="button"
                    onClick={() => handleAiGenerate('seoDescription')}
                    disabled={!path.title || aiLoading.seoDescription}
                    className="absolute right-3 top-3 text-slate-400 hover:text-indigo-400 disabled:cursor-not-allowed disabled:text-slate-600"
                  >
                    {aiLoading.seoDescription ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  </button>
               </div>
            </div>
        </div>
      </div>

      {/* AI CONFIG */}
      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4" /> AI Configuration
        </h3>
        <div className="space-y-3">
           <label className="flex items-center gap-3 cursor-pointer">
             <input 
                type="checkbox" 
                checked={path.aiConfig.autoOrder} 
                onChange={() => setPath({...path, aiConfig: {...path.aiConfig, autoOrder: !path.aiConfig.autoOrder}})}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" 
             />
             <span className="text-slate-700 font-medium">Auto-generate Course Order (Recommended)</span>
           </label>
           <label className="flex items-center gap-3 cursor-pointer">
             <input 
                type="checkbox" 
                checked={path.aiConfig.autoLabs} 
                onChange={() => setPath({...path, aiConfig: {...path.aiConfig, autoLabs: !path.aiConfig.autoLabs}})}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" 
             />
             <span className="text-slate-700 font-medium">Auto-recommend Labs based on content</span>
           </label>
           <label className="flex items-center gap-3 cursor-pointer">
             <input 
                type="checkbox" 
                checked={path.aiConfig.autoSeo} 
                onChange={() => setPath({...path, aiConfig: {...path.aiConfig, autoSeo: !path.aiConfig.autoSeo}})}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" 
             />
             <span className="text-slate-700 font-medium">Auto-fill Landing Page SEO Text</span>
           </label>
        </div>
      </div>
  </div>
);


const AdminLearningPaths: React.FC = () => {
  const { paths, deletePath, updatePath, addPath, reorderPath } = useLearningPaths();
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentPath, setCurrentPath] = useState<LearningPath | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'settings'>('general');
  const [aiLoading, setAiLoading] = useState<Record<string, boolean>>({});
  
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState<number | null>(null);

  // Sorted paths for display
  const displayedPaths = [...paths].sort((a, b) => a.order - b.order).filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (path: LearningPath) => {
    setCurrentPath({ ...path });
    setIsEditing(true);
    setActiveTab('general');
  };

  const handleCreate = () => {
    const newPath: LearningPath = {
      id: Date.now(),
      title: '',
      slug: 'new-learning-path',
      status: 'Published', // CHANGED: Default to Published for immediate visibility
      scheduledDate: '',
      order: paths.length + 1,
      icon: Map, // Default icon
      color: 'text-slate-400',
      bg: 'bg-slate-100',
      border: 'border-slate-200',
      desc: '',
      longDescription: '',
      banner: '',
      roles: [],
      skills: [],
      categories: [],
      technologies: [],
      level: 'Beginner',
      totalDuration: '0 Hours',
      estimatedHours: '0',
      coursesCount: 0,
      labsCount: 0,
      enrollmentType: 'Free',
      price: 0,
      discountPrice: 0,
      seoTitle: '',
      seoDescription: '',
      aiConfig: {
        autoOrder: false,
        autoLabs: false,
        autoSeo: false
      },
      syllabus: [],
      outcomes: []
    };
    setCurrentPath(newPath);
    setIsEditing(true);
    setActiveTab('general');
  };

  const handleSave = () => {
    if (currentPath) {
      if (paths.find(p => p.id === currentPath.id)) {
        updatePath(currentPath);
      } else {
        addPath(currentPath);
      }
      setIsEditing(false);
      setCurrentPath(null);
    }
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this Learning Path? This action cannot be undone.')) {
      deletePath(id);
    }
  };
  
  const handleStatusToggle = (path: LearningPath) => {
    const newStatus = path.status === 'Published' ? 'Draft' : 'Published';
    updatePath({ ...path, status: newStatus });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && currentPath) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setCurrentPath({ ...currentPath, banner: imageUrl });
    }
  };

  const handleAiGenerate = async (field: string) => {
    if (!currentPath || !currentPath.title) return;
    setAiLoading(prev => ({ ...prev, [field]: true }));
    let prompt = '';
    switch (field) {
        case 'title':
            prompt = `Refine this topic into a professional and engaging learning path title: '${currentPath.title}'. Respond with only the title text.`;
            break;
        case 'desc':
            prompt = `Generate a short, engaging, one-sentence description for a learning path titled '${currentPath.title}'.`;
            break;
        case 'longDescription':
            prompt = `Generate a detailed, two-paragraph landing page description for a learning path titled '${currentPath.title}'. Emphasize the key benefits for the learner.`;
            break;
        case 'roles':
            prompt = `List 2-3 common job roles for someone who completes a learning path on '${currentPath.title}'. Respond with only a comma-separated list. Example: Role One, Role Two`;
            break;
        case 'technologies':
            prompt = `List 3-5 key technologies or tools covered in a learning path about '${currentPath.title}'. Respond with only a comma-separated list. Example: Tech One, Tech Two`;
            break;
        case 'skills':
            prompt = `List 5 key technical skills gained in a learning path about '${currentPath.title}'. Respond with only a comma-separated list.`;
            break;
        case 'seoTitle':
            prompt = `Generate an SEO-optimized meta title (max 60 chars) for a course on '${currentPath.title}'.`;
            break;
        case 'seoDescription':
            prompt = `Generate an SEO-optimized meta description (max 160 chars) for a course on '${currentPath.title}'.`;
            break;
    }

    try {
        const result = await generateSimpleText(prompt);
        if (result && currentPath) {
            setCurrentPath(prev => {
                if (!prev) return null;
                if (field === 'roles' || field === 'technologies' || field === 'skills') {
                    return { ...prev, [field]: result.split(',').map(s => s.trim()) };
                }
                return { ...prev, [field]: result };
            });
        }
    } catch (error) {
        console.error(`AI generation failed for ${field}:`, error);
    } finally {
        setAiLoading(prev => ({ ...prev, [field]: false }));
    }
  };

  // --- Drag and Drop Handlers ---
  const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    e.preventDefault();
    setDragOverItemIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.preventDefault();
  };

  const handleDrop = () => {
    if (draggedItemIndex !== null && dragOverItemIndex !== null && draggedItemIndex !== dragOverItemIndex) {
      const originalDraggedIndex = paths.findIndex(p => p.id === displayedPaths[draggedItemIndex].id);
      const originalDragOverIndex = paths.findIndex(p => p.id === displayedPaths[dragOverItemIndex].id);
      if (originalDraggedIndex !== -1 && originalDragOverIndex !== -1) {
          reorderPath(originalDraggedIndex, originalDragOverIndex);
      }
    }
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
  };


  if (isEditing && currentPath) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="px-8 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/70">
           <h2 className="text-lg font-bold text-slate-800 flex items-center gap-3">
             {paths.find(p => p.id === currentPath.id) ? 'Edit Learning Path' : 'Create New Path'}
             {currentPath.status === 'Published' && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">Published</span>}
             {currentPath.status === 'Draft' && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 border border-slate-300">Draft</span>}
             {currentPath.status === 'Scheduled' && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">Scheduled</span>}
           </h2>
           <div className="flex gap-3">
              <button onClick={() => setIsEditing(false)} className="text-slate-500 hover:text-slate-700 font-medium text-sm px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors">Cancel</button>
              <button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm">
                <Save className="h-4 w-4" /> Save Changes
              </button>
           </div>
        </div>

        <div className="flex border-b border-slate-200 px-4 bg-white">
           {['general', 'settings'].map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab as any)}
               className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors capitalize
                 ${activeTab === tab ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-700'}
               `}
             >
               {tab}
             </button>
           ))}
        </div>

        <div className="p-8 max-w-5xl mx-auto">
           {activeTab === 'general' && <GeneralTab path={currentPath} setPath={setCurrentPath} handleAiGenerate={handleAiGenerate} aiLoading={aiLoading} handleImageUpload={handleImageUpload} />}
           {activeTab === 'settings' && <SettingsTab path={currentPath} setPath={setCurrentPath} handleAiGenerate={handleAiGenerate} aiLoading={aiLoading} />}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Learning Paths</h1>
           <p className="text-slate-500 mt-1">Manage curated roadmaps and career tracks.</p>
        </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
           <input 
             type="text" 
             placeholder="Search by title..." 
             className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
        <button onClick={handleCreate} className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95">
          <Plus className="h-4 w-4" /> Create New Path
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr className="text-slate-500 text-xs uppercase tracking-wider">
              <th className="px-4 py-4 w-12 text-center font-semibold"><GripVertical className="h-4 w-4 mx-auto text-slate-400"/></th>
              <th className="px-4 py-4 font-semibold">Path Name</th>
              <th className="px-4 py-4 font-semibold">Content</th>
              <th className="px-4 py-4 font-semibold">Status</th>
              <th className="px-4 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
             {displayedPaths.length > 0 ? (
                displayedPaths.map((path, index) => (
                  <tr 
                    key={path.id} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnter={(e) => handleDragEnter(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onDragEnd={handleDragEnd}
                    className={`transition-all duration-100 group
                      ${draggedItemIndex === index ? 'opacity-40 bg-slate-100' : 'hover:bg-slate-50/80'}
                      ${dragOverItemIndex === index && draggedItemIndex !== index ? 'border-t-2 border-indigo-500' : ''}
                    `}
                  >
                    <td className="px-4 py-3 text-center cursor-move">
                      <GripVertical className="h-5 w-5 text-slate-300 group-hover:text-slate-500 mx-auto" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {path.banner ? (
                            <img src={path.banner} alt="" className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                        ) : (
                            <div className={`w-10 h-10 rounded-lg ${path.bg} ${path.color} flex items-center justify-center border ${path.border}`}>
                              <path.icon className="h-5 w-5" />
                            </div>
                        )}
                        <div>
                          <div className="font-bold text-slate-900">{path.title}</div>
                          <div className="text-xs text-slate-400">/{path.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                       {path.coursesCount > 0 ? `${path.coursesCount} Courses` : `${path.syllabus.length} Modules`}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleStatusToggle(path)} className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${path.status === 'Published' ? 'bg-indigo-500' : 'bg-slate-300'}`}>
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${path.status === 'Published' ? 'translate-x-5' : 'translate-x-1'}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleEdit(path)} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          type="button"
                          onClick={(e) => handleDelete(e, path.id)} 
                          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
             ) : (
                <tr>
                    <td colSpan={5} className="text-center py-16 text-slate-500">
                        <div className="flex flex-col items-center gap-3">
                            <Map className="h-12 w-12 text-slate-300" />
                            <h3 className="text-lg font-semibold text-slate-700">No Learning Paths Found</h3>
                            <p className="text-sm">Click "Create New Path" to get started.</p>
                        </div>
                    </td>
                </tr>
             )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminLearningPaths;