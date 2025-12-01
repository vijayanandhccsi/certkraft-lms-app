import React, { useState } from 'react';
import { 
  Plus, Edit, Trash, Search, ChevronDown, ChevronRight, 
  FileText, Video, Save, BookOpen, Image as ImageIcon,
  Youtube, List, HelpCircle, X, CheckCircle, Eye, ExternalLink,
  Sparkles, Loader2, Clock, Layers, Target, Tag, Globe, 
  BarChart, Layout, FolderPlus, FilePlus, GripVertical, ArrowUp, ArrowDown,
  Terminal, Box, MousePointer2
} from 'lucide-react';
import { useLearningPaths } from '../../contexts/LearningPathContext';
import { useInstructors } from '../../contexts/InstructorContext';
import { useCourses, Course, CourseModule, CourseLesson } from '../../contexts/CourseContext';
import { generateSimpleText } from '../../services/geminiService';

// Categories for Taxonomy
const CATEGORIES = [
  'Cloud', 'Cybersecurity', 'DevOps', 'AI', 'Networking', 
  'Linux', 'Data Engineering', 'IoT', 'Software Development'
];

const AdminCourses: React.FC = () => {
  // Contexts
  const { paths } = useLearningPaths();
  const { instructors } = useInstructors();
  const { courses, addCourse, updateCourse, deleteCourse } = useCourses();

  // State
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'media' | 'details' | 'structure' | 'faq'>('basic');
  const [aiLoading, setAiLoading] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');

  // --- HANDLERS ---

  const handleCreate = () => {
    const newCourse: Course = {
      id: Date.now(),
      title: '',
      subtitle: '',
      courseType: 'Self-Paced',
      language: 'English',
      instructorId: '',
      learningPathId: '',
      level: 'Beginner',
      status: 'Published', // CHANGED: Default to Published for immediate visibility
      categories: [],
      tags: [],
      durationHours: 0,
      lessonsCount: 0,
      labsCount: 0,
      thumbnail: '',
      promoVideoUrl: '',
      banner: '',
      description: '',
      longDescription: '',
      objective: '',
      learningObjectives: [],
      prerequisites: '',
      examObjectives: '',
      whatIsIncluded: ['Video lessons', 'Certificate of Completion'],
      modules: [],
      seo: { metaTitle: '', metaDescription: '', slug: '' },
      faqs: [],
    };
    setCurrentCourse(newCourse);
    setIsEditing(true);
    setActiveTab('basic');
  };

  const handleEdit = (course: Course) => {
    setCurrentCourse({ ...course });
    setIsEditing(true);
    setActiveTab('basic');
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      deleteCourse(id);
    }
  };

  const handleSave = () => {
    if (!currentCourse || !currentCourse.title) return;

    // Recalculate Lesson Count automatically based on structure
    const totalLessons = currentCourse.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
    const updatedCourse = { ...currentCourse, lessonsCount: totalLessons };

    const exists = courses.find(c => c.id === updatedCourse.id);
    if (exists) {
      updateCourse(updatedCourse);
    } else {
      addCourse(updatedCourse);
    }
    setIsEditing(false);
    setCurrentCourse(null);
  };

  // --- AI GENERATION ---
  const handleAiGenerate = async (field: string) => {
    if (!currentCourse || !currentCourse.title) return;
    setAiLoading(prev => ({ ...prev, [field]: true }));
    let prompt = '';

    switch (field) {
        case 'subtitle':
            prompt = `Write a short, catchy subtitle (under 15 words) for a course titled '${currentCourse.title}'.`;
            break;
        case 'description':
            prompt = `Write a 2-sentence elevator pitch for a course titled '${currentCourse.title}'.`;
            break;
        case 'longDescription':
            prompt = `Write a detailed course description (2 paragraphs) for '${currentCourse.title}' covering what students will learn and who it is for.`;
            break;
        case 'objective':
            prompt = `Summarize the main goal of the course '${currentCourse.title}' in one sentence.`;
            break;
        case 'learningObjectives':
            prompt = `List 5 key learning outcomes for the course '${currentCourse.title}'. Respond with a comma-separated list.`;
            break;
        case 'tags':
            prompt = `Generate 5 relevant technical tags for a course on '${currentCourse.title}'. Comma-separated.`;
            break;
        case 'seoTitle':
            prompt = `Generate an SEO meta title for '${currentCourse.title}' (max 60 chars).`;
            break;
        case 'seoDescription':
            prompt = `Generate an SEO meta description for '${currentCourse.title}' (max 160 chars).`;
            break;
    }

    try {
        const result = await generateSimpleText(prompt);
        if (result) {
            setCurrentCourse(prev => {
                if (!prev) return null;
                if (field === 'learningObjectives' || field === 'tags') {
                    // Split lists
                    const list = result.split(',').map(s => s.trim());
                    return { ...prev, [field]: list };
                }
                if (field.startsWith('seo')) {
                    const seoField = field === 'seoTitle' ? 'metaTitle' : 'metaDescription';
                    return { ...prev, seo: { ...prev.seo, [seoField]: result } };
                }
                // @ts-ignore - dynamic key access
                return { ...prev, [field]: result };
            });
        }
    } catch (error) {
        console.error(error);
    } finally {
        setAiLoading(prev => ({ ...prev, [field]: false }));
    }
  };

  // --- FILE HANDLING ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'thumbnail' | 'banner') => {
    if (e.target.files && e.target.files[0] && currentCourse) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setCurrentCourse({ ...currentCourse, [field]: imageUrl });
    }
  };

  // --- STRUCTURE (MODULES/LESSONS) HANDLERS ---
  const addModule = () => {
    if (!currentCourse) return;
    const newModule: CourseModule = {
        id: crypto.randomUUID(),
        title: 'New Module',
        lessons: []
    };
    setCurrentCourse({ ...currentCourse, modules: [...currentCourse.modules, newModule] });
  };

  const updateModule = (index: number, field: string, value: any) => {
    if (!currentCourse) return;
    const newModules = [...currentCourse.modules];
    // @ts-ignore
    newModules[index][field] = value;
    setCurrentCourse({ ...currentCourse, modules: newModules });
  };

  const deleteModule = (index: number) => {
    if (!currentCourse) return;
    const newModules = currentCourse.modules.filter((_, i) => i !== index);
    setCurrentCourse({ ...currentCourse, modules: newModules });
  };

  const addLesson = (moduleIndex: number) => {
    if (!currentCourse) return;
    const newLesson: CourseLesson = {
        id: crypto.randomUUID(),
        title: 'New Lesson',
        type: 'Video',
        duration: '10 min',
        isPreview: false
    };
    const newModules = [...currentCourse.modules];
    newModules[moduleIndex].lessons.push(newLesson);
    setCurrentCourse({ ...currentCourse, modules: newModules });
  };

  const updateLesson = (modIndex: number, lessonIndex: number, field: keyof CourseLesson, value: any) => {
    if (!currentCourse) return;
    const newModules = [...currentCourse.modules];
    // @ts-ignore
    newModules[modIndex].lessons[lessonIndex][field] = value;
    setCurrentCourse({ ...currentCourse, modules: newModules });
  };

  const deleteLesson = (modIndex: number, lessonIndex: number) => {
    if (!currentCourse) return;
    const newModules = [...currentCourse.modules];
    newModules[modIndex].lessons = newModules[modIndex].lessons.filter((_, i) => i !== lessonIndex);
    setCurrentCourse({ ...currentCourse, modules: newModules });
  };

  // --- EDITOR RENDER ---
  if (isEditing && currentCourse) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-8 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/70">
           <div>
             <h2 className="text-lg font-bold text-slate-800 flex items-center gap-3">
               {courses.find(c => c.id === currentCourse.id) ? 'Edit Course' : 'Create New Course'}
             </h2>
             <p className="text-xs text-slate-500 mt-1">ID: {currentCourse.id}</p>
           </div>
           <div className="flex gap-3">
              <button onClick={() => setIsEditing(false)} className="text-slate-500 hover:text-slate-700 font-medium text-sm px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors">Cancel</button>
              <button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm">
                <Save className="h-4 w-4" /> Save Course
              </button>
           </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 px-4 bg-white overflow-x-auto">
           {[
             { id: 'basic', label: 'Basic Info', icon: FileText },
             { id: 'media', label: 'Media', icon: ImageIcon }, // Fixed: icon: ImageIcon instead of Image
             { id: 'details', label: 'Details & SEO', icon: BookOpen },
             { id: 'structure', label: 'Structure', icon: Layers },
             { id: 'faq', label: 'FAQ', icon: HelpCircle }
           ].map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap
                 ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}
               `}
             >
               <tab.icon className="h-4 w-4" />
               {tab.label}
             </button>
           ))}
        </div>

        <div className="p-8 max-w-5xl mx-auto min-h-[500px]">
          
          {/* TAB 1: BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="space-y-8 animate-fade-in">
              {/* Section: Course Identity */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <FileText className="h-3 w-3" /> Course Identity
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Course Title</label>
                    <input 
                      type="text" 
                      value={currentCourse.title} 
                      onChange={e => setCurrentCourse({...currentCourse, title: e.target.value})}
                      placeholder="e.g. Master AWS IAM"
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Subtitle</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={currentCourse.subtitle} 
                        onChange={e => setCurrentCourse({...currentCourse, subtitle: e.target.value})}
                        placeholder="Short tagline for the course card..."
                        className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 pr-10 text-white outline-none placeholder-slate-400"
                      />
                      <button onClick={() => handleAiGenerate('subtitle')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-400">
                        {aiLoading.subtitle ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Short Description</label>
                    <div className="relative">
                      <textarea 
                        value={currentCourse.description} 
                        onChange={e => setCurrentCourse({...currentCourse, description: e.target.value})}
                        rows={3}
                        placeholder="One-paragraph elevator pitch..."
                        className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 pr-10 text-white outline-none placeholder-slate-400"
                      />
                      <button onClick={() => handleAiGenerate('description')} className="absolute right-3 top-3 text-slate-400 hover:text-indigo-400">
                        {aiLoading.description ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Metadata & Instructor */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                   <Target className="h-3 w-3" /> Metadata & Classification
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Instructor</label>
                      <select 
                        value={currentCourse.instructorId}
                        onChange={e => setCurrentCourse({...currentCourse, instructorId: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white outline-none"
                      >
                        <option value="">Select Instructor</option>
                        {instructors.map(inst => (
                          <option key={inst.id} value={inst.id}>{inst.name} ({inst.title})</option>
                        ))}
                      </select>
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Learning Path</label>
                      <select 
                        value={currentCourse.learningPathId}
                        onChange={e => setCurrentCourse({...currentCourse, learningPathId: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white outline-none"
                      >
                        <option value="">Select Learning Path</option>
                        {paths.map(path => (
                          <option key={path.id} value={path.id}>{path.title}</option>
                        ))}
                      </select>
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Skill Level</label>
                      <select 
                        value={currentCourse.level}
                        onChange={e => setCurrentCourse({...currentCourse, level: e.target.value as any})}
                        className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white outline-none"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Mixed">Mixed</option>
                      </select>
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Language</label>
                      <select 
                        value={currentCourse.language}
                        onChange={e => setCurrentCourse({...currentCourse, language: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white outline-none"
                      >
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                      </select>
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                      <select 
                        value={currentCourse.status}
                        onChange={e => setCurrentCourse({...currentCourse, status: e.target.value as any})}
                        className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white outline-none"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Published">Published</option>
                        <option value="Scheduled">Scheduled</option>
                      </select>
                   </div>
                </div>
              </div>

              {/* Section: Taxonomy */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                   <Tag className="h-3 w-3" /> Taxonomy
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Categories</label>
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => {
                                    const exists = currentCourse.categories.includes(cat);
                                    const newCats = exists ? currentCourse.categories.filter(c => c !== cat) : [...currentCourse.categories, cat];
                                    setCurrentCourse({...currentCourse, categories: newCats});
                                }}
                                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${currentCourse.categories.includes(cat) ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Tags (Skills)</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={currentCourse.tags.join(', ')} 
                        onChange={e => setCurrentCourse({...currentCourse, tags: e.target.value.split(',').map(s => s.trim())})}
                        placeholder="Comma separated (e.g. IAM, EC2, S3)..."
                        className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 pr-10 text-white outline-none placeholder-slate-400"
                      />
                      <button onClick={() => handleAiGenerate('tags')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-400">
                        {aiLoading.tags ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                 <button onClick={() => setActiveTab('media')} className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 flex items-center gap-2">
                    Save & Continue <ChevronRight className="h-4 w-4" />
                 </button>
              </div>
            </div>
          )}

          {/* TAB 2: MEDIA */}
          {activeTab === 'media' && (
             <div className="space-y-8 animate-fade-in">
                {/* Thumbnail */}
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Course Thumbnail (16:9)</label>
                   <div className="mt-2 flex justify-center rounded-xl border-2 border-dashed border-slate-300 px-6 py-10 hover:bg-slate-50 transition-colors">
                      <div className="text-center">
                         {currentCourse.thumbnail ? (
                           <div className="mb-4 relative group">
                              <img src={currentCourse.thumbnail} alt="Thumbnail preview" className="mx-auto h-48 object-cover rounded-lg shadow-md" />
                              <button 
                                onClick={() => setCurrentCourse({...currentCourse, thumbnail: ''})}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-4 w-4" />
                              </button>
                           </div>
                         ) : (
                           <ImageIcon className="mx-auto h-12 w-12 text-slate-300" aria-hidden="true" />
                         )}
                         <div className="mt-4 flex text-sm leading-6 text-slate-600 justify-center">
                            <label className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 hover:text-indigo-500">
                               <span>Upload Image</span>
                               <input type="file" className="sr-only" accept="image/*" onChange={(e) => handleImageUpload(e, 'thumbnail')} />
                            </label>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Banner */}
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Course Intro Banner (Optional)</label>
                   <div className="mt-2 flex justify-center rounded-xl border-2 border-dashed border-slate-300 px-6 py-10 hover:bg-slate-50 transition-colors">
                      <div className="text-center">
                         {currentCourse.banner ? (
                           <div className="mb-4 relative group">
                              <img src={currentCourse.banner} alt="Banner preview" className="mx-auto h-32 w-full object-cover rounded-lg shadow-md" />
                              <button 
                                onClick={() => setCurrentCourse({...currentCourse, banner: ''})}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-4 w-4" />
                              </button>
                           </div>
                         ) : (
                           <Layout className="mx-auto h-12 w-12 text-slate-300" aria-hidden="true" />
                         )}
                         <div className="mt-4 flex text-sm leading-6 text-slate-600 justify-center">
                            <label className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 hover:text-indigo-500">
                               <span>Upload Banner</span>
                               <input type="file" className="sr-only" accept="image/*" onChange={(e) => handleImageUpload(e, 'banner')} />
                            </label>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Video */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Promo Video URL (YouTube/Vimeo)</label>
                  <div className="relative">
                    <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
                    <input 
                      type="text" 
                      value={currentCourse.promoVideoUrl} 
                      onChange={e => setCurrentCourse({...currentCourse, promoVideoUrl: e.target.value})}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg pl-10 pr-3 py-3 text-white outline-none placeholder-slate-400"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                   <button onClick={() => setActiveTab('basic')} className="text-slate-500 font-medium hover:text-slate-800">Back</button>
                   <button onClick={() => setActiveTab('details')} className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 flex items-center gap-2">
                      Save & Continue <ChevronRight className="h-4 w-4" />
                   </button>
                </div>
             </div>
          )}

          {/* TAB 3: DETAILS */}
          {activeTab === 'details' && (
             <div className="space-y-8 animate-fade-in">
                {/* Long Description */}
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Long Description (Rich Text)</label>
                   <div className="relative">
                     <textarea 
                       value={currentCourse.longDescription} 
                       onChange={e => setCurrentCourse({...currentCourse, longDescription: e.target.value})}
                       rows={8}
                       placeholder="Full course details using Markdown/HTML..."
                       className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 pr-10 text-white outline-none placeholder-slate-400 font-mono text-sm"
                     />
                     <button onClick={() => handleAiGenerate('longDescription')} className="absolute right-3 top-3 text-slate-400 hover:text-indigo-400">
                       {aiLoading.longDescription ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                     </button>
                   </div>
                </div>

                {/* Objectives */}
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Learning Objectives</label>
                   <div className="relative">
                     <textarea 
                       value={currentCourse.learningObjectives.join('\n')} 
                       onChange={e => setCurrentCourse({...currentCourse, learningObjectives: e.target.value.split('\n')})}
                       rows={5}
                       placeholder="List key outcomes (one per line)..."
                       className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 pr-10 text-white outline-none placeholder-slate-400"
                     />
                     <button onClick={() => handleAiGenerate('learningObjectives')} className="absolute right-3 top-3 text-slate-400 hover:text-indigo-400">
                       {aiLoading.learningObjectives ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                     </button>
                   </div>
                   <p className="text-xs text-slate-500 mt-1">Enter one objective per line.</p>
                </div>

                {/* Prerequisites */}
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Prerequisites</label>
                   <textarea 
                      value={currentCourse.prerequisites} 
                      onChange={e => setCurrentCourse({...currentCourse, prerequisites: e.target.value})}
                      rows={3}
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white outline-none placeholder-slate-400"
                    />
                </div>

                {/* SEO Section */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Search className="h-3 w-3" /> SEO Configuration
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">URL Slug</label>
                        <div className="flex">
                           <span className="bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg px-3 py-2 text-slate-500 text-sm flex items-center">/courses/</span>
                           <input 
                             type="text"
                             value={currentCourse.seo.slug}
                             onChange={e => setCurrentCourse({...currentCourse, seo: {...currentCourse.seo, slug: e.target.value}})}
                             className="flex-1 bg-slate-800 border border-slate-600 rounded-r-lg p-2 text-white outline-none"
                           />
                        </div>
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Meta Title</label>
                        <div className="relative">
                           <input 
                             type="text"
                             value={currentCourse.seo.metaTitle}
                             onChange={e => setCurrentCourse({...currentCourse, seo: {...currentCourse.seo, metaTitle: e.target.value}})}
                             className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 pr-8 text-white outline-none"
                           />
                           <button onClick={() => handleAiGenerate('seoTitle')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-400">
                             {aiLoading.seoTitle ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                           </button>
                        </div>
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Meta Description</label>
                        <div className="relative">
                           <input 
                             type="text"
                             value={currentCourse.seo.metaDescription}
                             onChange={e => setCurrentCourse({...currentCourse, seo: {...currentCourse.seo, metaDescription: e.target.value}})}
                             className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 pr-8 text-white outline-none"
                           />
                           <button onClick={() => handleAiGenerate('seoDescription')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-400">
                             {aiLoading.seoDescription ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                           </button>
                        </div>
                     </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                   <button onClick={() => setActiveTab('media')} className="text-slate-500 font-medium hover:text-slate-800">Back</button>
                   <button onClick={() => setActiveTab('structure')} className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 flex items-center gap-2">
                      Save & Continue <ChevronRight className="h-4 w-4" />
                   </button>
                </div>
             </div>
          )}

          {/* TAB 4: STRUCTURE (COURSE BUILDER) */}
          {activeTab === 'structure' && (
             <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="text-lg font-bold text-slate-800">Course Content</h3>
                   <button onClick={addModule} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                     <FolderPlus className="h-4 w-4" /> Add Module
                   </button>
                </div>

                {currentCourse.modules.length === 0 && (
                   <div className="text-center py-12 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50">
                      <Layers className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 font-medium">No modules yet. Start building your course.</p>
                   </div>
                )}

                <div className="space-y-4">
                   {currentCourse.modules.map((module, mIndex) => (
                      <div key={module.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                         {/* Module Header */}
                         <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                               <GripVertical className="h-4 w-4 text-slate-400 cursor-move" />
                               <input 
                                 type="text" 
                                 value={module.title}
                                 onChange={e => updateModule(mIndex, 'title', e.target.value)}
                                 className="bg-transparent font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1 outline-none w-full max-w-md"
                                 placeholder="Module Title"
                               />
                            </div>
                            <div className="flex items-center gap-2">
                               <button onClick={() => deleteModule(mIndex)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded">
                                  <Trash className="h-4 w-4" />
                               </button>
                            </div>
                         </div>

                         {/* Lessons List */}
                         <div className="p-4 space-y-2">
                            {module.lessons.map((lesson, lIndex) => (
                               <div key={lesson.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg group">
                                  <GripVertical className="h-4 w-4 text-slate-300 cursor-move" />
                                  
                                  {/* Type Icon */}
                                  <div className={`p-1.5 rounded ${
                                     lesson.type === 'Video' ? 'bg-blue-100 text-blue-600' :
                                     lesson.type === 'Quiz' ? 'bg-purple-100 text-purple-600' :
                                     lesson.type === 'Lab' ? 'bg-emerald-100 text-emerald-600' :
                                     lesson.type === 'SCORM' ? 'bg-orange-100 text-orange-600' :
                                     lesson.type === 'Interactive Page' ? 'bg-pink-100 text-pink-600' :
                                     'bg-slate-100 text-slate-600'
                                  }`}>
                                     {lesson.type === 'Video' ? <Video className="h-3 w-3" /> :
                                      lesson.type === 'Quiz' ? <HelpCircle className="h-3 w-3" /> :
                                      lesson.type === 'Lab' ? <Terminal className="h-3 w-3" /> :
                                      lesson.type === 'SCORM' ? <Box className="h-3 w-3" /> :
                                      lesson.type === 'Interactive Page' ? <MousePointer2 className="h-3 w-3" /> :
                                      <BookOpen className="h-3 w-3" />}
                                  </div>

                                  <input 
                                     type="text" 
                                     value={lesson.title}
                                     onChange={e => updateLesson(mIndex, lIndex, 'title', e.target.value)}
                                     className="flex-1 bg-transparent text-sm text-slate-700 focus:bg-white border border-transparent focus:border-indigo-300 rounded px-2 py-1 outline-none"
                                  />

                                  <input 
                                     type="text" 
                                     value={lesson.duration}
                                     onChange={e => updateLesson(mIndex, lIndex, 'duration', e.target.value)}
                                     className="w-20 bg-transparent text-xs text-slate-500 focus:bg-white border border-transparent focus:border-indigo-300 rounded px-2 py-1 outline-none text-right"
                                  />

                                  <select 
                                     value={lesson.type}
                                     onChange={e => updateLesson(mIndex, lIndex, 'type', e.target.value)}
                                     className="text-xs bg-slate-100 border-none rounded px-2 py-1 text-slate-600 outline-none"
                                  >
                                     <option value="Video">Video</option>
                                     <option value="Quiz">Quiz</option>
                                     <option value="Lab">Lab</option>
                                     <option value="SCORM">SCORM</option>
                                     <option value="Interactive Page">Interactive Page</option>
                                  </select>

                                  <label className="flex items-center gap-1.5 cursor-pointer">
                                     <input 
                                       type="checkbox" 
                                       checked={lesson.isPreview} 
                                       onChange={e => updateLesson(mIndex, lIndex, 'isPreview', e.target.checked)}
                                       className="rounded text-indigo-600 focus:ring-indigo-500"
                                     />
                                     <span className="text-xs text-slate-500">Preview</span>
                                  </label>

                                  <button onClick={() => deleteLesson(mIndex, lIndex)} className="p-1.5 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                     <X className="h-3 w-3" />
                                  </button>
                               </div>
                            ))}
                            
                            <button onClick={() => addLesson(mIndex)} className="w-full mt-2 py-2 border border-dashed border-slate-300 rounded-lg text-xs font-medium text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition-colors flex items-center justify-center gap-1">
                               <Plus className="h-3 w-3" /> Add Lesson
                            </button>
                         </div>
                      </div>
                   ))}
                </div>

                <div className="flex justify-between pt-4">
                   <button onClick={() => setActiveTab('details')} className="text-slate-500 font-medium hover:text-slate-800">Back</button>
                   <button onClick={() => setActiveTab('faq')} className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 flex items-center gap-2">
                      Save & Continue <ChevronRight className="h-4 w-4" />
                   </button>
                </div>
             </div>
          )}

          {/* TAB 5: FAQ */}
          {activeTab === 'faq' && (
            <div className="space-y-6 animate-fade-in">
               <div className="flex justify-between items-center">
                 <h3 className="text-lg font-bold text-slate-800">Frequently Asked Questions</h3>
                 <button 
                    onClick={() => setCurrentCourse({...currentCourse, faqs: [...currentCourse.faqs, { question: '', answer: '' }]})} 
                    className="text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1"
                 >
                    <Plus className="h-3 w-3" /> Add Question
                 </button>
               </div>
               
               {currentCourse.faqs.length === 0 && (
                 <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
                   <HelpCircle className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                   <p className="text-slate-500">No FAQs added yet.</p>
                 </div>
               )}

               <div className="space-y-4">
                 {currentCourse.faqs.map((faq, index) => (
                   <div key={index} className="bg-slate-50 border border-slate-200 rounded-xl p-4 relative group">
                      <button 
                        onClick={() => {
                            const newFaqs = currentCourse.faqs.filter((_, i) => i !== index);
                            setCurrentCourse({ ...currentCourse, faqs: newFaqs });
                        }}
                        className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                      <div className="mb-3">
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Question</label>
                         <input 
                           type="text" 
                           value={faq.question}
                           onChange={e => {
                               const newFaqs = [...currentCourse.faqs];
                               newFaqs[index].question = e.target.value;
                               setCurrentCourse({ ...currentCourse, faqs: newFaqs });
                           }}
                           className="w-full bg-white border border-slate-300 rounded-md p-2 text-sm focus:border-indigo-500 outline-none"
                           placeholder="e.g. Do I get a certificate?"
                         />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Answer</label>
                         <textarea 
                           value={faq.answer}
                           onChange={e => {
                               const newFaqs = [...currentCourse.faqs];
                               newFaqs[index].answer = e.target.value;
                               setCurrentCourse({ ...currentCourse, faqs: newFaqs });
                           }}
                           rows={2}
                           className="w-full bg-white border border-slate-300 rounded-md p-2 text-sm focus:border-indigo-500 outline-none"
                           placeholder="Yes, a certificate is included..."
                         />
                      </div>
                   </div>
                 ))}
               </div>

               <div className="flex justify-between pt-4">
                  <button onClick={() => setActiveTab('structure')} className="text-slate-500 font-medium hover:text-slate-800">Back</button>
                  {/* Final Save handled by Header Save button for UX clarity, or duplicate here */}
               </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Courses</h1>
           <p className="text-slate-500 mt-1">Manage courses, curriculum structure, and media.</p>
        </div>
        <button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all active:scale-95">
          <Plus className="h-4 w-4" /> Create Course
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search courses..." 
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        <div className="divide-y divide-slate-100">
          {courses.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase())).length > 0 ? (
            courses.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase())).map(course => (
              <div key={course.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-4 flex-1">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} className="w-16 h-10 object-cover rounded shadow-sm border border-slate-200" />
                    ) : (
                      <div className="w-16 h-10 bg-slate-100 rounded flex items-center justify-center border border-slate-200 text-slate-300">
                        <ImageIcon className="h-5 w-5" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{course.title}</h3>
                      <div className="text-xs text-slate-500 flex items-center gap-3 mt-1">
                         <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {course.courseType}</span>
                         <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {course.durationHours || 0}h</span>
                         <span>{instructors.find(i => String(i.id) === course.instructorId)?.name || 'Unassigned'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border
                      ${course.status === 'Published' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                        course.status === 'Scheduled' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                        'bg-slate-100 text-slate-600 border-slate-200'}
                    `}>
                      {course.status}
                    </span>
                    <div className="flex items-center gap-1">
                       <button 
                         onClick={() => window.open(`#/courses/${course.id}`, '_blank')}
                         className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                         title="Preview Public Page"
                       >
                         <Eye className="h-4 w-4" />
                       </button>
                       <button 
                         onClick={() => handleEdit(course)}
                         className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                         title="Edit"
                       >
                         <Edit className="h-4 w-4" />
                       </button>
                       <button 
                          onClick={() => handleDelete(course.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                         <Trash className="h-4 w-4" />
                       </button>
                    </div>
                  </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 text-slate-500">
              <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                     <Layers className="h-8 w-8 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-700">No Courses Found</h3>
                  <p className="text-sm text-slate-400 max-w-xs mx-auto">
                    Get started by creating your first course and building its curriculum structure.
                  </p>
                  <button onClick={handleCreate} className="mt-4 text-indigo-600 font-bold hover:underline text-sm">Create Now &rarr;</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCourses;