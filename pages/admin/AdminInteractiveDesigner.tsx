import React, { useState } from 'react';
import { 
  Brain, Sparkles, Loader2, RefreshCw, Copy, Check, 
  Layers, Lightbulb, MessageSquare, MousePointer
} from 'lucide-react';
import { generateSimpleText } from '../../services/geminiService';

const AdminInteractiveDesigner: React.FC = () => {
  const [formData, setFormData] = useState({
    topic: '',
    learningGoal: '',
    type: 'Scenario-Based Learning',
    complexity: 'Intermediate'
  });
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!formData.topic) return;
    setLoading(true);
    
    const prompt = `
      Design a detailed "Interactive Learning Module" for a web-based LMS.
      Topic: ${formData.topic}
      Learning Goal: ${formData.learningGoal}
      Interaction Type: ${formData.type}
      Complexity Level: ${formData.complexity}

      Please provide the output in a structured format (Markdown) that a developer can implementation:
      
      ### 1. Context & Setup
      Describe the scenario or environment the learner is in.

      ### 2. The Challenge
      What specific problem must the user solve?

      ### 3. Step-by-Step Interaction Flow
      - Step 1: System shows [X]
      - User Action: [User clicks/drags/types Y]
      - System Feedback: [If correct, show Z. If incorrect, show Hint.]
      (Repeat for 3-5 steps)

      ### 4. Knowledge Check
      A multiple-choice question to reinforce the concept learned.

      ### 5. Success Message
      The congratulatory message shown upon completion.
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Interactive Designer</h1>
           <p className="text-slate-500 mt-1">Design immersive scenarios, simulations, and gamified lessons with AI.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Brain className="h-5 w-5 text-indigo-600" /> Module Config
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Topic / Subject</label>
                <input 
                  type="text" 
                  value={formData.topic}
                  onChange={e => setFormData({...formData, topic: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                  placeholder="e.g. Troubleshooting DNS Records"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Learning Goal</label>
                <textarea 
                  rows={3}
                  value={formData.learningGoal}
                  onChange={e => setFormData({...formData, learningGoal: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                  placeholder="e.g. Learner understands the difference between A and CNAME records."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Type</label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option>Scenario-Based Learning</option>
                    <option>Drag and Drop Simulation</option>
                    <option>Interactive Code Walkthrough</option>
                    <option>Chat Simulation</option>
                    <option>Equipment Configurator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Complexity</label>
                  <select 
                    value={formData.complexity}
                    onChange={e => setFormData({...formData, complexity: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={handleGenerate}
                  disabled={loading || !formData.topic}
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-indigo-500/25 active:scale-95"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Sparkles className="h-5 w-5" /> Generate Module</>}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
             <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
               <Lightbulb className="h-4 w-4" /> Pro Tip
             </h4>
             <p className="text-sm text-indigo-700 leading-relaxed">
               For best results with code simulations, specify the programming language in the topic field (e.g., "Python Error Handling").
             </p>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900 rounded-xl shadow-xl border border-slate-800 flex flex-col h-[calc(100vh-12rem)] min-h-[600px]">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-950/50 rounded-t-xl">
              <h3 className="text-white font-bold flex items-center gap-2">
                <Layers className="h-5 w-5 text-cyan-400" /> Blueprint Preview
              </h3>
              <div className="flex gap-2">
                 <button onClick={() => setGeneratedContent('')} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors" title="Clear">
                   <RefreshCw className="h-4 w-4" />
                 </button>
                 <button 
                   onClick={handleCopy}
                   className="p-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-900/30 rounded-lg flex items-center gap-2 transition-colors font-medium text-sm"
                   disabled={!generatedContent}
                 >
                   {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                   {copied ? 'Copied' : 'Copy'}
                 </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0f172a] p-8">
              {generatedContent ? (
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap font-sans text-slate-300 leading-relaxed">
                    {generatedContent}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600">
                   <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
                      <MousePointer className="h-10 w-10 opacity-50" />
                   </div>
                   <p className="text-lg font-medium mb-2">Ready to Design</p>
                   <p className="text-sm max-w-xs text-center">Configure your module settings on the left and click Generate to see the blueprint here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInteractiveDesigner;
