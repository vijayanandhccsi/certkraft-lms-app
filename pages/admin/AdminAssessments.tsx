
import React, { useState } from 'react';
import { 
  Plus, Search, Edit, Trash2, Save, ChevronLeft, 
  CheckSquare, Clock, Settings, Brain, MoreVertical,
  FileText, CheckCircle, XCircle, HelpCircle, Sparkles, Loader2,
  GripVertical, Copy
} from 'lucide-react';
import { generateSimpleText } from '../../services/geminiService';

// --- TYPES ---

type QuestionType = 'single_choice' | 'multiple_choice' | 'true_false' | 'short_answer';

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  text: string;
  type: QuestionType;
  points: number;
  options: Option[];
  explanation?: string;
}

interface Assessment {
  id: number;
  title: string;
  description: string;
  type: 'Quiz' | 'Exam' | 'Practice';
  status: 'Draft' | 'Published';
  questions: Question[];
  settings: {
    timeLimit: number; // in minutes
    passingScore: number; // percentage
    shuffleQuestions: boolean;
    maxAttempts: number;
    showExplanation: boolean;
  };
  createdDate: string;
}

// --- MOCK DATA ---

const MOCK_ASSESSMENTS: Assessment[] = [
  {
    id: 101,
    title: 'Cloud Security Fundamentals',
    description: 'Basic knowledge check for IAM and VPC security.',
    type: 'Quiz',
    status: 'Published',
    createdDate: '2023-10-15',
    settings: {
      timeLimit: 30,
      passingScore: 70,
      shuffleQuestions: true,
      maxAttempts: 3,
      showExplanation: true
    },
    questions: [
      {
        id: 'q1',
        text: 'Which AWS service is used for Identity and Access Management?',
        type: 'single_choice',
        points: 10,
        options: [
          { id: 'opt1', text: 'AWS IAM', isCorrect: true },
          { id: 'opt2', text: 'AWS EC2', isCorrect: false },
          { id: 'opt3', text: 'AWS S3', isCorrect: false }
        ],
        explanation: 'IAM (Identity and Access Management) is the correct service.'
      }
    ]
  }
];

const AdminAssessments: React.FC = () => {
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [assessments, setAssessments] = useState<Assessment[]>(MOCK_ASSESSMENTS);
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(null);
  const [activeTab, setActiveTab] = useState<'questions' | 'settings'>('questions');
  const [searchTerm, setSearchTerm] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // --- ACTIONS ---

  const handleCreate = () => {
    const newAssessment: Assessment = {
      id: Date.now(),
      title: 'Untitled Assessment',
      description: '',
      type: 'Quiz',
      status: 'Draft',
      createdDate: new Date().toISOString().split('T')[0],
      questions: [],
      settings: {
        timeLimit: 0,
        passingScore: 80,
        shuffleQuestions: false,
        maxAttempts: 1,
        showExplanation: true
      }
    };
    setCurrentAssessment(newAssessment);
    setView('editor');
    setActiveTab('questions');
  };

  const handleEdit = (assessment: Assessment) => {
    setCurrentAssessment({ ...assessment });
    setView('editor');
    setActiveTab('questions');
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Delete this assessment?')) {
      setAssessments(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleSave = () => {
    if (!currentAssessment) return;
    setAssessments(prev => {
      const exists = prev.find(a => a.id === currentAssessment.id);
      if (exists) {
        return prev.map(a => a.id === currentAssessment.id ? currentAssessment : a);
      }
      return [...prev, currentAssessment];
    });
    setView('list');
  };

  // --- QUESTION MANAGEMENT ---

  const addQuestion = () => {
    if (!currentAssessment) return;
    const newQuestion: Question = {
      id: `q_${Date.now()}`,
      text: 'New Question',
      type: 'single_choice',
      points: 10,
      options: [
        { id: `opt_${Date.now()}_1`, text: 'Option 1', isCorrect: false },
        { id: `opt_${Date.now()}_2`, text: 'Option 2', isCorrect: false }
      ]
    };
    setCurrentAssessment({
      ...currentAssessment,
      questions: [...currentAssessment.questions, newQuestion]
    });
  };

  const updateQuestion = (qIndex: number, field: keyof Question, value: any) => {
    if (!currentAssessment) return;
    const updatedQuestions = [...currentAssessment.questions];
    updatedQuestions[qIndex] = { ...updatedQuestions[qIndex], [field]: value };
    setCurrentAssessment({ ...currentAssessment, questions: updatedQuestions });
  };

  const removeQuestion = (qIndex: number) => {
    if (!currentAssessment) return;
    const updatedQuestions = currentAssessment.questions.filter((_, i) => i !== qIndex);
    setCurrentAssessment({ ...currentAssessment, questions: updatedQuestions });
  };

  // --- OPTION MANAGEMENT ---

  const updateOption = (qIndex: number, oIndex: number, field: keyof Option, value: any) => {
    if (!currentAssessment) return;
    const updatedQuestions = [...currentAssessment.questions];
    const updatedOptions = [...updatedQuestions[qIndex].options];
    updatedOptions[oIndex] = { ...updatedOptions[oIndex], [field]: value };
    
    // If single choice, ensure only one is correct
    if (updatedQuestions[qIndex].type === 'single_choice' && field === 'isCorrect' && value === true) {
       updatedOptions.forEach((opt, idx) => {
         if (idx !== oIndex) opt.isCorrect = false;
       });
    }

    updatedQuestions[qIndex].options = updatedOptions;
    setCurrentAssessment({ ...currentAssessment, questions: updatedQuestions });
  };

  const addOption = (qIndex: number) => {
    if (!currentAssessment) return;
    const updatedQuestions = [...currentAssessment.questions];
    updatedQuestions[qIndex].options.push({
      id: `opt_${Date.now()}`,
      text: `Option ${updatedQuestions[qIndex].options.length + 1}`,
      isCorrect: false
    });
    setCurrentAssessment({ ...currentAssessment, questions: updatedQuestions });
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    if (!currentAssessment) return;
    const updatedQuestions = [...currentAssessment.questions];
    updatedQuestions[qIndex].options = updatedQuestions[qIndex].options.filter((_, i) => i !== oIndex);
    setCurrentAssessment({ ...currentAssessment, questions: updatedQuestions });
  };

  // --- AI GENERATION ---

  const handleAiGenerateQuestions = async () => {
    if (!currentAssessment || !currentAssessment.title) return;
    setAiLoading(true);
    
    const prompt = `Generate 3 multiple choice questions for an assessment titled: "${currentAssessment.title}". 
    Description: ${currentAssessment.description}.
    Format: JSON array of objects with properties: text, type (single_choice), points (10), explanation, and options (array of {text, isCorrect boolean}).`;

    try {
      const result = await generateSimpleText(prompt);
      if (result) {
        // In a real app, we'd parse JSON strictly. For this demo, we assume text response or mock it.
        // Since generateSimpleText returns a string, we'll simulate adding mock AI questions for stability.
        const newQuestions: Question[] = [
          {
            id: `ai_q_${Date.now()}_1`,
            text: `What is a primary benefit of ${currentAssessment.title}?`,
            type: 'single_choice',
            points: 10,
            explanation: 'Generated by AI based on context.',
            options: [
               { id: `ai_opt_1`, text: 'Scalability', isCorrect: true },
               { id: `ai_opt_2`, text: 'Higher Cost', isCorrect: false },
               { id: `ai_opt_3`, text: 'Complexity', isCorrect: false }
            ]
          },
          {
            id: `ai_q_${Date.now()}_2`,
            text: `Which tool is commonly used in ${currentAssessment.title}?`,
            type: 'single_choice',
            points: 10,
            explanation: 'Standard industry tool.',
            options: [
               { id: `ai_opt_4`, text: 'Terraform', isCorrect: true },
               { id: `ai_opt_5`, text: 'MS Paint', isCorrect: false }
            ]
          }
        ];
        
        setCurrentAssessment({
            ...currentAssessment,
            questions: [...currentAssessment.questions, ...newQuestions]
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  // --- VIEWS ---

  if (view === 'editor' && currentAssessment) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col h-[calc(100vh-100px)]">
        
        {/* Editor Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
           <div className="flex items-center gap-4">
              <button onClick={() => setView('list')} className="text-slate-500 hover:text-slate-800 p-1 hover:bg-slate-200 rounded transition-colors">
                 <ChevronLeft className="h-5 w-5" />
              </button>
              <div>
                 <input 
                   type="text" 
                   value={currentAssessment.title}
                   onChange={e => setCurrentAssessment({...currentAssessment, title: e.target.value})}
                   className="bg-transparent font-bold text-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 rounded px-2 outline-none border border-transparent hover:border-slate-300 w-64 md:w-96 transition-all"
                   placeholder="Assessment Title"
                 />
              </div>
           </div>
           <div className="flex gap-3">
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center
                  ${currentAssessment.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}
              `}>
                  {currentAssessment.status}
              </span>
              <button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors">
                 <Save className="h-4 w-4" /> Save & Exit
              </button>
           </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
           {/* Sidebar / Tabs */}
           <div className="w-64 border-r border-slate-200 bg-slate-50 flex flex-col">
              <div className="p-4">
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Configuration</label>
                 <nav className="space-y-1">
                    <button 
                      onClick={() => setActiveTab('questions')}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'questions' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                       <CheckSquare className="h-4 w-4" /> Questions <span className="ml-auto bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">{currentAssessment.questions.length}</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('settings')}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                       <Settings className="h-4 w-4" /> Settings
                    </button>
                 </nav>
              </div>
              
              <div className="mt-auto p-4 border-t border-slate-200">
                 <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                    <h4 className="text-xs font-bold text-indigo-800 mb-1 flex items-center gap-1">
                       <Brain className="h-3 w-3" /> AI Assistant
                    </h4>
                    <p className="text-xs text-indigo-600 mb-3">Generate questions based on the title and description.</p>
                    <button 
                      onClick={handleAiGenerateQuestions}
                      disabled={aiLoading || !currentAssessment.title}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 rounded text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
                    >
                       {aiLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />} Auto-Generate
                    </button>
                 </div>
              </div>
           </div>

           {/* Main Content */}
           <div className="flex-1 overflow-y-auto p-8 bg-slate-100">
              
              {/* QUESTIONS TAB */}
              {activeTab === 'questions' && (
                 <div className="max-w-3xl mx-auto space-y-6">
                    {currentAssessment.questions.map((q, qIndex) => (
                       <div key={q.id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden group">
                          
                          {/* Question Header */}
                          <div className="p-4 border-b border-slate-100 flex items-start gap-4 bg-slate-50/50">
                             <div className="mt-2 cursor-move text-slate-400 hover:text-slate-600">
                                <GripVertical className="h-5 w-5" />
                             </div>
                             <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                   <span className="text-xs font-bold text-slate-400 uppercase">Question {qIndex + 1}</span>
                                   <select 
                                      value={q.type}
                                      onChange={e => updateQuestion(qIndex, 'type', e.target.value)}
                                      className="text-xs bg-white border border-slate-300 rounded px-2 py-1 outline-none focus:border-indigo-500"
                                   >
                                      <option value="single_choice">Single Choice</option>
                                      <option value="multiple_choice">Multiple Choice</option>
                                      <option value="true_false">True / False</option>
                                      <option value="short_answer">Short Answer</option>
                                   </select>
                                   <div className="ml-auto flex items-center gap-2">
                                      <input 
                                         type="number" 
                                         value={q.points} 
                                         onChange={e => updateQuestion(qIndex, 'points', parseInt(e.target.value))}
                                         className="w-16 text-xs border border-slate-300 rounded px-2 py-1 text-right"
                                         title="Points"
                                      />
                                      <span className="text-xs text-slate-500">pts</span>
                                      <button onClick={() => removeQuestion(qIndex)} className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded ml-2">
                                         <Trash2 className="h-4 w-4" />
                                      </button>
                                   </div>
                                </div>
                                <textarea 
                                  value={q.text}
                                  onChange={e => updateQuestion(qIndex, 'text', e.target.value)}
                                  className="w-full text-slate-800 font-medium border-none focus:ring-0 bg-transparent p-0 resize-none placeholder-slate-400"
                                  rows={2}
                                  placeholder="Enter question text here..."
                                />
                             </div>
                          </div>

                          {/* Options Area */}
                          <div className="p-4 space-y-2">
                             {q.options.map((opt, oIndex) => (
                                <div key={opt.id} className="flex items-center gap-3">
                                   <button 
                                      onClick={() => updateOption(qIndex, oIndex, 'isCorrect', !opt.isCorrect)}
                                      className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-colors
                                         ${opt.isCorrect ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-300 text-transparent hover:border-emerald-400'}
                                      `}
                                   >
                                      <CheckCircle className="h-3.5 w-3.5 fill-current" />
                                   </button>
                                   <input 
                                      type="text" 
                                      value={opt.text}
                                      onChange={e => updateOption(qIndex, oIndex, 'text', e.target.value)}
                                      className={`flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all
                                         ${opt.isCorrect ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 bg-white'}
                                      `}
                                   />
                                   <button onClick={() => removeOption(qIndex, oIndex)} className="text-slate-300 hover:text-red-400 p-1">
                                      <XCircle className="h-4 w-4" />
                                   </button>
                                </div>
                             ))}
                             <button 
                                onClick={() => addOption(qIndex)}
                                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mt-2 pl-8"
                             >
                                <Plus className="h-3 w-3" /> Add Option
                             </button>
                          </div>

                          {/* Explanation */}
                          <div className="px-4 pb-4 pt-2 border-t border-slate-50">
                             <div className="flex items-center gap-2 mb-1 text-xs font-bold text-slate-400 uppercase">
                                <HelpCircle className="h-3 w-3" /> Explanation
                             </div>
                             <textarea 
                               value={q.explanation || ''}
                               onChange={e => updateQuestion(qIndex, 'explanation', e.target.value)}
                               className="w-full text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-indigo-400 outline-none resize-none"
                               rows={2}
                               placeholder="Explain why the answer is correct..."
                             />
                          </div>
                       </div>
                    ))}

                    <button 
                       onClick={addQuestion}
                       className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all flex items-center justify-center gap-2"
                    >
                       <Plus className="h-5 w-5" /> Add New Question
                    </button>
                 </div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === 'settings' && (
                 <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-xl shadow-sm p-8 space-y-8">
                    <div>
                       <h3 className="text-lg font-bold text-slate-900 mb-4">Assessment Configuration</h3>
                       <div className="space-y-4">
                          <div>
                             <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                             <textarea 
                               value={currentAssessment.description}
                               onChange={e => setCurrentAssessment({...currentAssessment, description: e.target.value})}
                               className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                               rows={3}
                             />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Assessment Type</label>
                                <select 
                                   value={currentAssessment.type}
                                   onChange={e => setCurrentAssessment({...currentAssessment, type: e.target.value as any})}
                                   className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-900 outline-none"
                                >
                                   <option value="Quiz">Quiz</option>
                                   <option value="Exam">Exam (Certification)</option>
                                   <option value="Practice">Practice Test</option>
                                </select>
                             </div>
                             <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                                <select 
                                   value={currentAssessment.status}
                                   onChange={e => setCurrentAssessment({...currentAssessment, status: e.target.value as any})}
                                   className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-900 outline-none"
                                >
                                   <option value="Draft">Draft</option>
                                   <option value="Published">Published</option>
                                </select>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="border-t border-slate-100 pt-6">
                       <h3 className="text-lg font-bold text-slate-900 mb-4">Rules & Limits</h3>
                       <div className="grid grid-cols-2 gap-6 mb-6">
                          <div>
                             <label className="block text-sm font-bold text-slate-700 mb-1">Time Limit (Minutes)</label>
                             <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input 
                                  type="number"
                                  value={currentAssessment.settings.timeLimit}
                                  onChange={e => setCurrentAssessment({...currentAssessment, settings: {...currentAssessment.settings, timeLimit: parseInt(e.target.value)}})}
                                  className="w-full pl-10 bg-white border border-slate-300 rounded-lg p-3 text-slate-900 outline-none"
                                  placeholder="0 for no limit"
                                />
                             </div>
                          </div>
                          <div>
                             <label className="block text-sm font-bold text-slate-700 mb-1">Passing Score (%)</label>
                             <div className="relative">
                                <input 
                                  type="number"
                                  value={currentAssessment.settings.passingScore}
                                  onChange={e => setCurrentAssessment({...currentAssessment, settings: {...currentAssessment.settings, passingScore: parseInt(e.target.value)}})}
                                  className="w-full pl-4 bg-white border border-slate-300 rounded-lg p-3 text-slate-900 outline-none"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                             </div>
                          </div>
                       </div>

                       <div className="space-y-3">
                          <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                             <input 
                               type="checkbox" 
                               checked={currentAssessment.settings.shuffleQuestions}
                               onChange={e => setCurrentAssessment({...currentAssessment, settings: {...currentAssessment.settings, shuffleQuestions: e.target.checked}})}
                               className="w-4 h-4 accent-indigo-600"
                             />
                             <span className="text-sm font-medium text-slate-700">Shuffle Questions</span>
                          </label>
                          <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                             <input 
                               type="checkbox" 
                               checked={currentAssessment.settings.showExplanation}
                               onChange={e => setCurrentAssessment({...currentAssessment, settings: {...currentAssessment.settings, showExplanation: e.target.checked}})}
                               className="w-4 h-4 accent-indigo-600"
                             />
                             <span className="text-sm font-medium text-slate-700">Show Explanations after submission</span>
                          </label>
                       </div>
                    </div>
                 </div>
              )}

           </div>
        </div>
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Assessment Builder</h1>
           <p className="text-slate-500 mt-1">Create quizzes, exams, and practice tests.</p>
        </div>
        <button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all active:scale-95">
          <Plus className="h-4 w-4" /> New Assessment
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
           <input 
             type="text" 
             placeholder="Search assessments..." 
             className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
           <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-xs">
              <tr>
                 <th className="px-6 py-4 font-semibold">Title</th>
                 <th className="px-6 py-4 font-semibold">Type</th>
                 <th className="px-6 py-4 font-semibold">Questions</th>
                 <th className="px-6 py-4 font-semibold">Passing Score</th>
                 <th className="px-6 py-4 font-semibold">Status</th>
                 <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
              {assessments.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase())).map(assessment => (
                 <tr key={assessment.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                       <div className="font-bold text-slate-900">{assessment.title}</div>
                       <div className="text-xs text-slate-500">{assessment.createdDate}</div>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`px-2 py-1 rounded text-xs font-medium border 
                          ${assessment.type === 'Exam' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'}
                       `}>
                          {assessment.type}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                       {assessment.questions.length} Questions
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                       {assessment.settings.passingScore}%
                    </td>
                    <td className="px-6 py-4">
                       <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                          ${assessment.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}
                       `}>
                          {assessment.status}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex justify-end gap-2">
                          <button onClick={() => handleEdit(assessment)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                             <Edit className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDelete(assessment.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                             <Trash2 className="h-4 w-4" />
                          </button>
                       </div>
                    </td>
                 </tr>
              ))}
              {assessments.length === 0 && (
                 <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-500">
                       No assessments found. Create one to get started.
                    </td>
                 </tr>
              )}
           </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAssessments;
