import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle, Circle, PlayCircle, Lock, 
  ChevronDown, ChevronUp, Trophy, Clock, BookOpen 
} from 'lucide-react';
import { useLearningPaths } from '../../contexts/LearningPathContext';
import { useStudent } from '../../contexts/StudentContext';

const StudentPathView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { paths } = useLearningPaths();
  const { enrolledPaths } = useStudent();
  
  const path = paths.find(p => p.id === Number(id));
  const enrollment = enrolledPaths.find(ep => ep.pathId === Number(id));
  
  const [expandedModules, setExpandedModules] = useState<number[]>([0]);

  if (!path) return <div className="p-8">Path not found</div>;

  const toggleModule = (index: number) => {
    setExpandedModules(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Back Link */}
      <Link to="/student/dashboard" className="inline-flex items-center text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
      </Link>

      {/* Hero Card */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
         <div className="h-32 bg-gradient-to-r from-slate-900 to-indigo-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="absolute bottom-0 left-0 p-8">
               <span className="bg-indigo-500/20 border border-indigo-400/30 text-indigo-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
                 Career Track
               </span>
            </div>
         </div>
         <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
               <div className="flex-1">
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">{path.title}</h1>
                  <p className="text-slate-500 mb-6">{path.desc}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-slate-500 mb-6">
                     <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" /> {path.totalDuration || '40h'}
                     </div>
                     <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" /> {path.coursesCount || 5} Courses
                     </div>
                     <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-yellow-500" /> Certificate Included
                     </div>
                  </div>

                  {/* Progress */}
                  <div className="max-w-md">
                     <div className="flex justify-between text-sm mb-2 font-medium">
                        <span className="text-slate-700">Overall Progress</span>
                        <span className="text-indigo-600">{enrollment?.progress || 0}%</span>
                     </div>
                     <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 rounded-full transition-all duration-1000" style={{ width: `${enrollment?.progress || 0}%` }}></div>
                     </div>
                  </div>
               </div>

               <div className="flex-shrink-0">
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95 flex items-center gap-2">
                     <PlayCircle className="h-5 w-5" /> Resume Learning
                  </button>
               </div>
            </div>
         </div>
      </div>

      {/* Curriculum Structure */}
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Curriculum</h2>
            <button className="text-sm text-indigo-600 font-medium hover:underline">Collapse All</button>
         </div>

         <div className="space-y-4">
            {/* Mock Curriculum based on Path Syllabus or Mock Data if Syllabus is simple */}
            {path.syllabus.length > 0 ? path.syllabus.map((module, mIndex) => (
               <div key={mIndex} className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all">
                  <button 
                    onClick={() => toggleModule(mIndex)}
                    className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors text-left"
                  >
                     <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                           {mIndex + 1}
                        </div>
                        <div>
                           <h3 className="font-bold text-slate-800 text-lg">{module.title}</h3>
                           <p className="text-xs text-slate-500 mt-1">{module.lessons.length} Lessons • 2h 15m</p>
                        </div>
                     </div>
                     {expandedModules.includes(mIndex) ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                  </button>

                  {expandedModules.includes(mIndex) && (
                     <div className="border-t border-slate-100 bg-slate-50/50">
                        {module.lessons.map((lesson, lIndex) => (
                           <div key={lIndex} className="flex items-center justify-between p-4 pl-20 hover:bg-indigo-50/50 transition-colors border-b border-slate-100 last:border-0">
                              <div className="flex items-center gap-3">
                                 {/* Mock status based on index for demo */}
                                 {lIndex === 0 && mIndex === 0 ? (
                                    <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                                 ) : lIndex === 1 && mIndex === 0 ? (
                                    <Circle className="h-5 w-5 text-indigo-500 flex-shrink-0 stroke-[3px]" />
                                 ) : (
                                    <Lock className="h-5 w-5 text-slate-300 flex-shrink-0" />
                                 )}
                                 
                                 <div className="flex flex-col">
                                    <span className={`text-sm font-medium ${lIndex === 0 ? 'text-slate-500 line-through' : 'text-slate-700'}`}>
                                       {lesson.title}
                                    </span>
                                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wide mt-0.5">
                                       {lesson.type}
                                    </span>
                                 </div>
                              </div>
                              
                              <div className="flex items-center gap-4">
                                 <span className="text-xs text-slate-400 font-medium">10 min</span>
                                 {(lIndex <= 1 && mIndex === 0) ? (
                                    <button className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:border-indigo-500 hover:text-indigo-600 transition-colors shadow-sm">
                                       {lIndex === 0 ? 'Review' : 'Start'}
                                    </button>
                                 ) : (
                                    <span className="px-3 py-1.5 text-xs font-bold text-slate-400">Locked</span>
                                 )}
                              </div>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            )) : (
               <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
                  Curriculum details not available for this path.
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default StudentPathView;