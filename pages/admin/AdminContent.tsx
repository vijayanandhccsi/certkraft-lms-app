import React, { useState } from 'react';
import { 
  Layers, Plus, Search, FileText, Video, Box, 
  LayoutTemplate, MonitorPlay, Wand2, Copy, Check,
  Loader2, RefreshCw, Sparkles, Brain
} from 'lucide-react';
import { generateSimpleText } from '../../services/geminiService';

// --- SUB-COMPONENT: LANDING PAGE GENERATOR ---
const LandingPageGenerator = () => {
  const [formData, setFormData] = useState({
    courseTitle: '',
    targetAudience: '',
    keyBenefits: '',
    tone: 'Professional & Encouraging'
  });
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!formData.courseTitle) return;
    setLoading(true);
    
    const prompt = `
      Create a high-converting course landing page copy for a course titled "${formData.courseTitle}".
      Target Audience: ${formData.targetAudience}
      Key Benefits/USPs: ${formData.keyBenefits}
      Tone: ${formData.tone}

      Please structure the response with the following sections using Markdown:
      1. Catchy Headline (H1)
      2. Subheadline (H2)
      3. The Problem (Why they need this)
      4. The Solution (What this course offers)
      5. 5 Key Learning Outcomes (Bulleted list)
      6. Who this is for
      7. Call to Action (CTA)
    `;

    try {
      const result = await generateSimpleText(prompt);
      if (result) setGeneratedContent(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
      {/* Input Form */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm h-fit">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <LayoutTemplate className="h-5 w-5 text-indigo-600" /> Configuration
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Course Title</label>
            <input 
              type="text" 
              value={formData.courseTitle}
              onChange={e => setFormData({...formData, courseTitle: e.target.value})}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g. Advanced React Patterns"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Target Audience</label>
            <input 
              type="text" 
              value={formData.targetAudience}
              onChange={e => setFormData({...formData, targetAudience: e.target.value})}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g. Mid-level Frontend Developers"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Key Benefits (Comma separated)</label>
            <textarea 
              rows={3}
              value={formData.keyBenefits}
              onChange={e => setFormData({...formData, keyBenefits: e.target.value})}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g. Master Hooks, Performance Optimization, Scalable Architecture"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Tone of Voice</label>
            <select 
              value={formData.tone}
              onChange={e => setFormData({...formData, tone: e.target.value})}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option>Professional & Encouraging</option>
              <option>Exciting & High Energy</option>
              <option>Technical & Concise</option>
              <option>Friendly & Accessible</option>
            </select>
          </div>
          <button 
            onClick={handleGenerate}
            disabled={loading || !formData.courseTitle}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Wand2 className="h-5 w-5" /> Generate Landing Page</>}
          </button>
        </div>
      </div>

      {/* Output Preview */}
      <div className="bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-800 flex flex-col h-[600px]">
        <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-4">
          <h3 className="text-white font-bold flex items-center gap-2">
            <MonitorPlay className="h-5 w-5 text-emerald-400" /> Generated Content
          </h3>
          <div className="flex gap-2">
             <button onClick={() => setGeneratedContent('')} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg" title="Clear">
               <RefreshCw className="h-4 w-4" />
             </button>
             <button 
               onClick={handleCopy}
               className="p-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-900/30 rounded-lg flex items-center gap-2 transition-colors"
               disabled={!generatedContent}
             >
               {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
               {copied ? 'Copied' : 'Copy'}
             </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-950/50 rounded-lg p-4 font-mono text-sm text-slate-300 whitespace-pre-wrap">
          {generatedContent || <span className="text-slate-600 italic">Content will appear here...</span>}
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: INTERACTIVE PAGE GENERATOR ---
const InteractivePageGenerator = () => {
  const [formData, setFormData] = useState({
    topic: '',
    learningGoal: '',
    type: 'Scenario-Based Learning'
  });
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!formData.topic) return;
    setLoading(true);
    
    const prompt = `
      Create content for an "Interactive Learning Page" about: ${formData.topic}.
      Learning Goal: ${formData.learningGoal}.
      Interaction Type: ${formData.type}.

      Structure the response as a JSON-like or structured Markdown format suitable for a developer to build:
      1. Scene Setup / Context (The scenario)
      2. Key Concept Explanation (Short & punchy)
      3. Interactive Element Description (e.g., "User drags block A to B", "User selects option 2")
      4. Feedback Logic (If user does X, show Y)
      5. Quiz Question to reinforce learning.
    `;

    try {
      const result = await generateSimpleText(prompt);
      if (result) setGeneratedContent(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
      {/* Input Form */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm h-fit">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Brain className="h-5 w-5 text-indigo-600" /> Lesson Design
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Topic / Subject</label>
            <input 
              type="text" 
              value={formData.topic}
              onChange={e => setFormData({...formData, topic: e.target.value})}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g. Troubleshooting DNS Issues"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Learning Goal</label>
            <input 
              type="text" 
              value={formData.learningGoal}
              onChange={e => setFormData({...formData, learningGoal: e.target.value})}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g. Student can identify an A-record mismatch"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Interaction Type</label>
            <select 
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value})}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option>Scenario-Based Learning</option>
              <option>Drag and Drop Simulation</option>
              <option>Interactive Code Walkthrough</option>
              <option>Gamified Quiz</option>
            </select>
          </div>
          <button 
            onClick={handleGenerate}
            disabled={loading || !formData.topic}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Sparkles className="h-5 w-5" /> Design Interaction</>}
          </button>
        </div>
      </div>

      {/* Output Preview */}
      <div className="bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-800 flex flex-col h-[600px]">
        <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-4">
          <h3 className="text-white font-bold flex items-center gap-2">
            <Layers className="h-5 w-5 text-cyan-400" /> Structure Blueprint
          </h3>
          <div className="flex gap-2">
             <button onClick={() => setGeneratedContent('')} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg" title="Clear">
               <RefreshCw className="h-4 w-4" />
             </button>
             <button 
               onClick={handleCopy}
               className="p-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-900/30 rounded-lg flex items-center gap-2 transition-colors"
               disabled={!generatedContent}
             >
               {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
               {copied ? 'Copied' : 'Copy'}
             </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-950/50 rounded-lg p-4 font-mono text-sm text-slate-300 whitespace-pre-wrap">
          {generatedContent || <span className="text-slate-600 italic">Generated structure will appear here...</span>}
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: CONTENT LIBRARY ---
const ContentLibrary = () => (
  <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm">
    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
      <Box className="h-10 w-10 text-slate-300" />
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-2">Content Library</h3>
    <p className="text-slate-500 mb-6 max-w-md mx-auto">
      Access your saved landing pages, reusable text blocks, and interactive module definitions here.
    </p>
    <button className="bg-white border border-slate-300 text-slate-700 px-6 py-2.5 rounded-lg font-bold hover:bg-slate-50 transition-colors">
      Browse Saved Items
    </button>
  </div>
);

const AdminContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'library' | 'landing' | 'interactive'>('library');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Course Content & Tools</h1>
           <p className="text-slate-500 mt-1">Generate and manage rich learning content.</p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-slate-200 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('library')}
          className={`px-4 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'library' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <Layers className="h-4 w-4" /> Content Library
        </button>
        <button 
          onClick={() => setActiveTab('landing')}
          className={`px-4 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'landing' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <LayoutTemplate className="h-4 w-4" /> Landing Page Generator
        </button>
        <button 
          onClick={() => setActiveTab('interactive')}
          className={`px-4 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'interactive' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <Brain className="h-4 w-4" /> Interactive Page Generator
        </button>
      </div>

      <div className="pt-2">
        {activeTab === 'library' && <ContentLibrary />}
        {activeTab === 'landing' && <LandingPageGenerator />}
        {activeTab === 'interactive' && <InteractivePageGenerator />}
      </div>
    </div>
  );
};

export default AdminContent;
