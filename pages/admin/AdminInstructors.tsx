import React, { useState } from 'react';
import { 
  Plus, Search, Mail, User, Edit, Trash, 
  Save, ChevronRight, Upload, Sparkles, Loader2,
  Briefcase, Globe, Lock, Settings as SettingsIcon,
  Image as ImageIcon, Linkedin, Github, Twitter, ExternalLink,
  Check, X
} from 'lucide-react';
import { useInstructors, Instructor, InstructorRole, InstructorType, InstructorStatus } from '../../contexts/InstructorContext';
import { generateSimpleText } from '../../services/geminiService';

// Constants
const ROLES_LIST: InstructorRole[] = ['Instructor', 'Content Creator', 'Course Manager', 'Lab Manager', 'Quiz Author', 'Reviewer'];
const EXPERTISE_LIST = ['Cloud Computing', 'Cybersecurity', 'DevOps', 'AI & ML', 'Networking', 'Software Development', 'Data Science', 'IT Support', 'Project Management'];

const AdminInstructors: React.FC = () => {
  const { instructors, addInstructor, updateInstructor, deleteInstructor } = useInstructors();
  
  // State
  const [isEditing, setIsEditing] = useState(false);
  const [currentInstructor, setCurrentInstructor] = useState<Instructor | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'expertise' | 'media' | 'access' | 'settings'>('basic');
  const [aiLoading, setAiLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Handlers
  const handleCreate = () => {
    const newInstructor: Instructor = {
      id: Date.now(),
      name: '',
      email: '',
      phone: '',
      title: '',
      shortBio: '',
      bio: '',
      status: 'Active',
      primaryExpertise: 'Cloud Computing',
      skills: [],
      avatar: '',
      coverImage: '',
      introVideoUrl: '',
      socials: { linkedin: '', github: '', website: '', twitter: '' },
      account: { hasAccess: false, username: '', password: '', roles: ['Instructor'] },
      type: 'Full-time',
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setCurrentInstructor(newInstructor);
    setIsEditing(true);
    setActiveTab('basic');
  };

  const handleEdit = (instructor: Instructor) => {
    setCurrentInstructor({ ...instructor });
    setIsEditing(true);
    setActiveTab('basic');
  };

  const handleSave = () => {
    if (!currentInstructor || !currentInstructor.name) return;
    
    // Auto-generate username if empty and email is present
    if (currentInstructor.account.hasAccess && !currentInstructor.account.username && currentInstructor.email) {
       currentInstructor.account.username = currentInstructor.email.split('@')[0];
    }

    const exists = instructors.find(i => i.id === currentInstructor.id);
    if (exists) {
      updateInstructor(currentInstructor);
    } else {
      addInstructor(currentInstructor);
    }
    setIsEditing(false);
    setCurrentInstructor(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this instructor?')) {
      deleteInstructor(id);
    }
  };

  const handleAiBio = async () => {
    if (!currentInstructor || !currentInstructor.name) return;
    setAiLoading(true);
    
    const prompt = `Write a professional and engaging biography (2 paragraphs) for an instructor named ${currentInstructor.name}. 
    Title: ${currentInstructor.title || 'Tech Instructor'}. 
    Expertise: ${currentInstructor.primaryExpertise}. 
    Skills: ${currentInstructor.skills.join(', ')}.
    Tone: Professional, experienced, and passionate about teaching.`;

    try {
      const bio = await generateSimpleText(prompt);
      if (bio) {
        setCurrentInstructor(prev => prev ? ({ ...prev, bio }) : null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'avatar' | 'coverImage') => {
    if (e.target.files && e.target.files[0] && currentInstructor) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setCurrentInstructor({ ...currentInstructor, [field]: url });
    }
  };

  const toggleRole = (role: InstructorRole) => {
    if (!currentInstructor) return;
    const currentRoles = currentInstructor.account.roles;
    const newRoles = currentRoles.includes(role) 
      ? currentRoles.filter(r => r !== role)
      : [...currentRoles, role];
    setCurrentInstructor({ 
      ...currentInstructor, 
      account: { ...currentInstructor.account, roles: newRoles } 
    });
  };

  // --- EDITOR VIEW ---
  if (isEditing && currentInstructor) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-8 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/70">
           <div>
             <h2 className="text-lg font-bold text-slate-800 flex items-center gap-3">
               {instructors.find(i => i.id === currentInstructor.id) ? 'Edit Instructor' : 'Add New Instructor'}
             </h2>
             <p className="text-xs text-slate-500 mt-1">ID: {currentInstructor.id}</p>
           </div>
           <div className="flex gap-3">
              <button onClick={() => setIsEditing(false)} className="text-slate-500 hover:text-slate-700 font-medium text-sm px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors">Cancel</button>
              <button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm">
                <Save className="h-4 w-4" /> Save Profile
              </button>
           </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 px-4 bg-white overflow-x-auto">
           {[
             { id: 'basic', label: 'Basic Info', icon: User },
             { id: 'expertise', label: 'Expertise & Skills', icon: Briefcase },
             { id: 'media', label: 'Media & Branding', icon: ImageIcon },
             { id: 'access', label: 'Account Access', icon: Lock },
             { id: 'settings', label: 'Settings', icon: SettingsIcon },
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

        <div className="p-8 max-w-4xl mx-auto min-h-[500px]">
          
          {/* TAB 1: BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="space-y-6 animate-fade-in">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Full Name *</label>
                    <input 
                      type="text" 
                      value={currentInstructor.name} 
                      onChange={e => setCurrentInstructor({...currentInstructor, name: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-400"
                      placeholder="e.g. Dr. Jane Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Email Address *</label>
                    <input 
                      type="email" 
                      value={currentInstructor.email} 
                      onChange={e => setCurrentInstructor({...currentInstructor, email: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-400"
                      placeholder="jane@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
                    <input 
                      type="text" 
                      value={currentInstructor.phone || ''} 
                      onChange={e => setCurrentInstructor({...currentInstructor, phone: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-400"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Designation / Title</label>
                    <input 
                      type="text" 
                      value={currentInstructor.title} 
                      onChange={e => setCurrentInstructor({...currentInstructor, title: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-400"
                      placeholder="e.g. Senior Cloud Architect"
                    />
                  </div>
               </div>

               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Short Bio (Card View)</label>
                  <input 
                    type="text" 
                    value={currentInstructor.shortBio} 
                    onChange={e => setCurrentInstructor({...currentInstructor, shortBio: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-400"
                    placeholder="One line summary e.g. 'Expert in Cloud Security and AWS'"
                  />
               </div>

               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Detailed Biography</label>
                  <div className="relative">
                    <textarea 
                      value={currentInstructor.bio} 
                      onChange={e => setCurrentInstructor({...currentInstructor, bio: e.target.value})}
                      rows={6}
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 pr-10 text-white focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-400"
                      placeholder="Full professional background..."
                    />
                    <button 
                      onClick={handleAiBio}
                      disabled={aiLoading || !currentInstructor.name}
                      className="absolute right-3 top-3 text-slate-400 hover:text-indigo-400 disabled:cursor-not-allowed"
                      title="Generate Bio with AI"
                    >
                      {aiLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                    </button>
                  </div>
               </div>

               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                  <div className="flex gap-4">
                     {['Active', 'Inactive', 'Pending'].map(status => (
                        <label key={status} className="flex items-center gap-2 cursor-pointer">
                           <input 
                             type="radio" 
                             name="status" 
                             checked={currentInstructor.status === status}
                             onChange={() => setCurrentInstructor({...currentInstructor, status: status as InstructorStatus})}
                             className="accent-indigo-600"
                           />
                           <span className="text-slate-700 font-medium">{status}</span>
                        </label>
                     ))}
                  </div>
               </div>
            </div>
          )}

          {/* TAB 2: EXPERTISE */}
          {activeTab === 'expertise' && (
            <div className="space-y-8 animate-fade-in">
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Primary Expertise</label>
                  <select 
                    value={currentInstructor.primaryExpertise}
                    onChange={e => setCurrentInstructor({...currentInstructor, primaryExpertise: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white outline-none"
                  >
                    {EXPERTISE_LIST.map(exp => (
                      <option key={exp} value={exp}>{exp}</option>
                    ))}
                  </select>
               </div>

               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Skills (Multi-select)</label>
                  <div className="relative">
                     <input 
                       type="text" 
                       value={currentInstructor.skills.join(', ')}
                       onChange={e => setCurrentInstructor({...currentInstructor, skills: e.target.value.split(',').map(s => s.trim())})}
                       className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white outline-none placeholder-slate-400"
                       placeholder="Comma separated e.g. AWS, Python, Docker"
                     />
                     <p className="text-xs text-slate-500 mt-2">Enter skills separated by commas.</p>
                  </div>
               </div>

               {/* Placeholder for Courses Taught */}
               <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <Briefcase className="h-4 w-4" /> Linked Courses
                  </h4>
                  <p className="text-sm text-slate-500 mb-4">
                    Courses are automatically linked when you assign this instructor in the Course Editor.
                  </p>
                  <button className="text-indigo-600 text-sm font-medium hover:underline">View Assigned Courses</button>
               </div>
            </div>
          )}

          {/* TAB 3: MEDIA */}
          {activeTab === 'media' && (
            <div className="space-y-8 animate-fade-in">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Profile Picture */}
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Profile Picture (Square)</label>
                     <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center bg-white hover:bg-slate-50 transition-colors h-64">
                        {currentInstructor.avatar ? (
                           <div className="relative group">
                              <img src={currentInstructor.avatar} alt="Profile" className="w-32 h-32 rounded-full object-cover shadow-md" />
                              <button 
                                onClick={() => setCurrentInstructor({...currentInstructor, avatar: ''})}
                                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-4 w-4" />
                              </button>
                           </div>
                        ) : (
                           <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 mb-4">
                              <User className="h-16 w-16" />
                           </div>
                        )}
                        <label className="cursor-pointer mt-4 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium text-sm hover:bg-indigo-100 transition-colors">
                           <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'avatar')} />
                           Upload Photo
                        </label>
                     </div>
                  </div>

                  {/* Cover Banner */}
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Cover Banner (Optional)</label>
                     <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center bg-white hover:bg-slate-50 transition-colors h-64">
                        {currentInstructor.coverImage ? (
                           <div className="relative group w-full">
                              <img src={currentInstructor.coverImage} alt="Cover" className="w-full h-32 object-cover rounded-lg shadow-sm" />
                              <button 
                                onClick={() => setCurrentInstructor({...currentInstructor, coverImage: ''})}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-4 w-4" />
                              </button>
                           </div>
                        ) : (
                           <div className="w-full h-32 rounded-lg bg-slate-100 flex items-center justify-center text-slate-300 mb-4">
                              <ImageIcon className="h-12 w-12" />
                           </div>
                        )}
                        <label className="cursor-pointer mt-4 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium text-sm hover:bg-indigo-100 transition-colors">
                           <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'coverImage')} />
                           Upload Banner
                        </label>
                     </div>
                  </div>
               </div>

               {/* Social Links */}
               <div>
                  <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
                     <Globe className="h-4 w-4" /> Social Profiles
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="flex items-center gap-3">
                        <Linkedin className="h-5 w-5 text-blue-700" />
                        <input 
                          type="text" 
                          placeholder="LinkedIn URL" 
                          value={currentInstructor.socials.linkedin}
                          onChange={e => setCurrentInstructor({...currentInstructor, socials: {...currentInstructor.socials, linkedin: e.target.value}})}
                          className="flex-1 bg-slate-800 border border-slate-600 rounded-lg p-2 text-white text-sm outline-none"
                        />
                     </div>
                     <div className="flex items-center gap-3">
                        <Github className="h-5 w-5 text-slate-800" />
                        <input 
                          type="text" 
                          placeholder="GitHub URL" 
                          value={currentInstructor.socials.github}
                          onChange={e => setCurrentInstructor({...currentInstructor, socials: {...currentInstructor.socials, github: e.target.value}})}
                          className="flex-1 bg-slate-800 border border-slate-600 rounded-lg p-2 text-white text-sm outline-none"
                        />
                     </div>
                     <div className="flex items-center gap-3">
                        <Twitter className="h-5 w-5 text-sky-500" />
                        <input 
                          type="text" 
                          placeholder="Twitter / X URL" 
                          value={currentInstructor.socials.twitter}
                          onChange={e => setCurrentInstructor({...currentInstructor, socials: {...currentInstructor.socials, twitter: e.target.value}})}
                          className="flex-1 bg-slate-800 border border-slate-600 rounded-lg p-2 text-white text-sm outline-none"
                        />
                     </div>
                     <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-indigo-500" />
                        <input 
                          type="text" 
                          placeholder="Website URL" 
                          value={currentInstructor.socials.website}
                          onChange={e => setCurrentInstructor({...currentInstructor, socials: {...currentInstructor.socials, website: e.target.value}})}
                          className="flex-1 bg-slate-800 border border-slate-600 rounded-lg p-2 text-white text-sm outline-none"
                        />
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* TAB 4: ACCESS */}
          {activeTab === 'access' && (
            <div className="space-y-8 animate-fade-in">
               <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                     <div>
                        <h3 className="font-bold text-slate-900 text-lg">LMS Admin Access</h3>
                        <p className="text-slate-500 text-sm">Allow this instructor to log in to the admin panel.</p>
                     </div>
                     <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={currentInstructor.account.hasAccess}
                          onChange={e => setCurrentInstructor({...currentInstructor, account: {...currentInstructor.account, hasAccess: e.target.checked}})}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                     </label>
                  </div>

                  {currentInstructor.account.hasAccess && (
                     <div className="space-y-6 border-t border-slate-200 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div>
                              <label className="block text-sm font-bold text-slate-700 mb-1">Username</label>
                              <input 
                                type="text" 
                                value={currentInstructor.account.username || ''}
                                onChange={e => setCurrentInstructor({...currentInstructor, account: {...currentInstructor.account, username: e.target.value}})}
                                className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-900 focus:border-indigo-500 outline-none"
                                placeholder={currentInstructor.email ? currentInstructor.email.split('@')[0] : 'username'}
                              />
                           </div>
                           <div>
                              <label className="block text-sm font-bold text-slate-700 mb-1">Temporary Password</label>
                              <input 
                                type="text" 
                                value={currentInstructor.account.password || ''}
                                onChange={e => setCurrentInstructor({...currentInstructor, account: {...currentInstructor.account, password: e.target.value}})}
                                className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-900 focus:border-indigo-500 outline-none"
                                placeholder="Leave empty to auto-generate"
                              />
                           </div>
                        </div>

                        <div>
                           <label className="block text-sm font-bold text-slate-700 mb-3">Role Permissions</label>
                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {ROLES_LIST.map(role => (
                                 <label key={role} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-indigo-300 transition-colors">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${currentInstructor.account.roles.includes(role) ? 'bg-indigo-600 border-indigo-600' : 'bg-slate-100 border-slate-300'}`}>
                                       {currentInstructor.account.roles.includes(role) && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                                    </div>
                                    <input 
                                      type="checkbox" 
                                      className="hidden"
                                      checked={currentInstructor.account.roles.includes(role)}
                                      onChange={() => toggleRole(role)}
                                    />
                                    <span className="text-sm font-medium text-slate-700">{role}</span>
                                 </label>
                              ))}
                           </div>
                        </div>
                     </div>
                  )}
               </div>
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
             <div className="space-y-6 animate-fade-in">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Instructor Type</label>
                   <select 
                     value={currentInstructor.type}
                     onChange={e => setCurrentInstructor({...currentInstructor, type: e.target.value as InstructorType})}
                     className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white outline-none"
                   >
                     <option value="Full-time">Full-time</option>
                     <option value="Part-time">Part-time</option>
                     <option value="Guest">Guest Instructor</option>
                     <option value="External">External Partner</option>
                   </select>
                </div>
                
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                   <h4 className="font-bold text-slate-800 mb-4">Notifications</h4>
                   <div className="space-y-3">
                      <label className="flex items-center gap-3 text-sm text-slate-600">
                         <input type="checkbox" defaultChecked className="rounded accent-indigo-600" />
                         Receive email when a student enrolls
                      </label>
                      <label className="flex items-center gap-3 text-sm text-slate-600">
                         <input type="checkbox" defaultChecked className="rounded accent-indigo-600" />
                         Receive weekly digest of course performance
                      </label>
                   </div>
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
           <h1 className="text-2xl font-bold text-slate-900">Instructors</h1>
           <p className="text-slate-500 mt-1">Manage instructor profiles and assignments.</p>
        </div>
        <button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all active:scale-95">
          <Plus className="h-4 w-4" /> Add Instructor
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
         <div className="relative w-full max-w-md">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
           <input
             type="text"
             placeholder="Search instructors..."
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
             className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
           />
         </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-slate-500 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Instructor</th>
              <th className="px-6 py-4 font-semibold">Designation & Role</th>
              <th className="px-6 py-4 font-semibold">Expertise</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {instructors.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())).map((instructor) => (
              <tr key={instructor.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {instructor.avatar ? (
                       <img src={instructor.avatar} alt={instructor.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                       <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                         <User className="h-5 w-5" />
                       </div>
                    )}
                    <div>
                      <div className="font-bold text-slate-900">{instructor.name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {instructor.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-slate-900 font-medium">{instructor.title}</div>
                  <div className="text-xs text-slate-500">{instructor.type}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-slate-700 bg-slate-100 px-2 py-1 rounded text-xs border border-slate-200">
                    {instructor.primaryExpertise}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                    ${instructor.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 
                      instructor.status === 'Inactive' ? 'bg-slate-100 text-slate-600' : 'bg-amber-100 text-amber-700'}
                  `}>
                    {instructor.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEdit(instructor)} className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(instructor.id)}
                      className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
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

export default AdminInstructors;