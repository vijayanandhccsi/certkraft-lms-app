import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Clock, CheckCircle, Search, Trophy, 
  Play, MoreVertical, Terminal, ChevronRight, Map 
} from 'lucide-react';
import { useStudent } from '../../contexts/StudentContext';
import { useLearningPaths } from '../../contexts/LearningPathContext';

const StudentMyPaths: React.FC = () => {
  const { enrolledPaths, stats } = useStudent();
  const { paths } = useLearningPaths();
  const [filter, setFilter] = useState<'All' | 'In Progress' | 'Completed' | 'Not Started'>('All');

  // Resolve Path Data
  const myPaths = enrolledPaths.map(ep => {
    const pathData = paths.find(p => p.id === ep.pathId);
    return { ...ep, ...pathData };
  }).filter(p => p.title); // Ensure data integrity

  const filteredPaths = myPaths.filter(p => {
    if (filter === 'All') return true;
    return p.status === filter;
  });

  const activePath = myPaths.find(p => p.status === 'In Progress');

  // Stats for the header
  const completedPathsCount = enrolledPaths.filter(p => p.status === 'Completed').length;
  const avgProgress = enrolledPaths.length > 0 
    ? Math.round(enrolledPaths.reduce((acc, curr) => acc + curr.progress, 0) / enrolledPaths.length) 
    : 0;

  // Unenrolled popular paths for discovery
  const unenrolledPaths = paths
    .filter(p => !enrolledPaths.some(ep => ep.pathId === p.id) && p.status === 'Published')
    .slice(0, 3);

  return (
    <div className="space-y-8">
      
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Learning Paths</h1>
          <p className="text-slate-500 mt-1">View your enrolled career tracks and skill paths.</p>
        </div>
        
        <div className="flex gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
           <div className="text-center px-4 border-r border-slate-100">
              <span className="block text-2xl font-bold text-slate-900">{enrolledPaths.length}</span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Enrolled</span>
           </div>
           <div className="text-center px-4 border-r border-slate-100">
              <span className="block text-2xl font-bold text-emerald-600">{completedPathsCount}</span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Completed</span>
           </div>
           <div className="text-center px-4">
              <span className="block text-2xl font-bold text-indigo-600">{avgProgress}%</span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Avg. Progress</span>
           </div>
        </div>
      </div>

      {/* Hero Banner: Continue Active Path */}
      {activePath && (
        <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-lg group">
           <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
           <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex-1">
                 <div className="flex items-center gap-2 mb-4 text-indigo-300 font-bold text-xs uppercase tracking-wider">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    Continue Learning
                 </div>
                 <h2 className="text-3xl font-bold mb-2">{activePath.title}</h2>
                 <p className="text-indigo-200 mb-6 max-w-xl text-sm leading-relaxed">
                   You're making great progress! Finish the current module to unlock your next badge.
                 </p>
                 <div className="flex items-center gap-4">
                    <div className="flex-1 max-w-xs h-2 bg-slate-700 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${activePath.progress}%` }}></div>
                    </div>
                    <span className="text-sm font-bold text-emerald-400">{activePath.progress}%</span>
                 </div>
              </div>
              <div className="flex-shrink-0">
                 <Link 
                   to={`/student/paths/${activePath.id}`}
                   className="bg-white text-indigo-900 hover:bg-indigo-50 px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg"
                 >
                    <Play className="h-5 w-5 fill-current" /> Resume Path
                 </Link>
              </div>
           </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-slate-200 pb-4">
         <div className="flex bg-slate-100 p-1 rounded-lg">
            {['All', 'In Progress', 'Completed', 'Not Started'].map((f) => (
               <button
                 key={f}
                 onClick={() => setFilter(f as any)}
                 className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === f ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 {f}
               </button>
            ))}
         </div>
         
         <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search your paths..." 
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
            />
         </div>
      </div>

      {/* Path List */}
      <div className="grid grid-cols-1 gap-6">
         {filteredPaths.length > 0 ? (
            filteredPaths.map((path) => (
               <div key={path.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 items-center">
                  
                  {/* Icon */}
                  <div className={`w-20 h-20 rounded-2xl ${path.bg || 'bg-slate-100'} ${path.color || 'text-slate-500'} flex items-center justify-center flex-shrink-0 shadow-inner`}>
                     {path.icon ? <path.icon className="h-10 w-10" /> : <BookOpen className="h-10 w-10" />}
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-center md:text-left">
                     <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                        <h3 className="text-xl font-bold text-slate-900">{path.title}</h3>
                        {path.status === 'Completed' && <CheckCircle className="h-5 w-5 text-emerald-500" />}
                     </div>
                     <p className="text-sm text-slate-500 mb-4 line-clamp-1">{path.desc}</p>
                     
                     <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-medium text-slate-600">
                        <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded">
                           <Clock className="h-3.5 w-3.5 text-slate-400" /> {path.estimatedHours || '40'}h left
                        </span>
                        <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded">
                           <BookOpen className="h-3.5 w-3.5 text-slate-400" /> {path.coursesCount || 5} Courses
                        </span>
                        <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded">
                           <Terminal className="h-3.5 w-3.5 text-slate-400" /> {path.labsCount || 10} Labs
                        </span>
                     </div>
                  </div>

                  {/* Progress Ring & Action */}
                  <div className="flex items-center gap-6">
                     <div className="relative w-16 h-16 flex-shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                           <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100" />
                           <circle 
                             cx="32" cy="32" r="28" 
                             stroke="currentColor" strokeWidth="4" 
                             fill="transparent" 
                             strokeDasharray={175} 
                             strokeDashoffset={175 - (175 * path.progress) / 100} 
                             className={`transition-all duration-1000 ${path.progress === 100 ? 'text-emerald-500' : 'text-indigo-500'}`} 
                             strokeLinecap="round"
                           />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700">
                           {path.progress}%
                        </div>
                     </div>
                     
                     <div className="flex flex-col gap-2 min-w-[140px]">
                        <Link 
                          to={`/student/paths/${path.id}`}
                          className={`w-full py-2.5 rounded-lg text-sm font-bold text-center transition-colors shadow-sm
                             ${path.status === 'Completed' 
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200' 
                                : 'bg-indigo-600 text-white hover:bg-indigo-700'}
                          `}
                        >
                           {path.status === 'Completed' ? 'Review Path' : path.status === 'Not Started' ? 'Start Path' : 'Resume'}
                        </Link>
                        <button className="text-xs font-medium text-slate-500 hover:text-indigo-600">
                           View Details
                        </button>
                     </div>
                  </div>

               </div>
            ))
         ) : (
            // Empty State
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Map className="h-10 w-10 text-slate-300" />
               </div>
               <h3 className="text-lg font-bold text-slate-900 mb-2">No paths found</h3>
               <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                  You haven't enrolled in any learning paths matching this filter yet.
               </p>
               <button onClick={() => setFilter('All')} className="text-indigo-600 font-bold hover:underline">
                  Clear Filters
               </button>
            </div>
         )}
      </div>

      {/* Discovery Section */}
      {unenrolledPaths.length > 0 && (
         <div className="pt-8 border-t border-slate-200">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold text-slate-900">Recommended for You</h2>
               <Link to="/learning-paths" className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                  Browse All <ChevronRight className="h-4 w-4" />
               </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {unenrolledPaths.map(path => (
                  <div key={path.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg hover:border-indigo-200 transition-all group cursor-pointer">
                     <div className={`w-12 h-12 rounded-lg ${path.bg} ${path.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        {path.icon && <path.icon className="h-6 w-6" />}
                     </div>
                     <h3 className="font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{path.title}</h3>
                     <p className="text-xs text-slate-500 mb-4 line-clamp-2">{path.desc}</p>
                     <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                        <span className="text-xs font-semibold text-slate-500">{path.level}</span>
                        <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                           Learn More <ChevronRight className="h-3 w-3" />
                        </span>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      )}

    </div>
  );
};

export default StudentMyPaths;