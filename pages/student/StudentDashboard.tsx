import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, BookOpen, Clock, Award, ChevronRight, 
  Terminal, Activity, Zap, Star, ShieldCheck, 
  CheckCircle, ArrowRight, TrendingUp, Calendar, FileText, Download, X, Flame
} from 'lucide-react';
import { useStudent } from '../../contexts/StudentContext';
import { useLearningPaths } from '../../contexts/LearningPathContext';
import { useCourses } from '../../contexts/CourseContext';

const StudentDashboard: React.FC = () => {
  const { 
    student, enrolledPaths, enrolledCourses, activeLabs, upcomingLabs, stats,
    announcements, smartSheets, learningTimeline, weeklyActivity,
    dismissAnnouncement 
  } = useStudent();
  
  const { paths } = useLearningPaths();
  const { courses } = useCourses();
  
  const [courseTab, setCourseTab] = useState<'All' | 'In Progress' | 'Completed'>('In Progress');
  const [labTab, setLabTab] = useState<'Active' | 'Upcoming'>('Active');

  // Resolve Data
  const activePathEnrollment = enrolledPaths[0];
  const activePath = activePathEnrollment ? paths.find(p => p.id === activePathEnrollment.pathId) : null;

  const resolvedCourses = enrolledCourses.map(enrollment => {
    const course = courses.find(c => c.id === enrollment.courseId);
    return { ...course, ...enrollment };
  }).filter(c => c.title); // Filter out undefined courses

  const filteredCourses = resolvedCourses.filter(c => {
    if (courseTab === 'All') return true;
    return c.status === courseTab;
  });

  return (
    <div className="space-y-8">
      
      {/* 0. ANNOUNCEMENT BANNER */}
      {announcements.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl p-4 text-white shadow-md relative animate-fade-in">
           <div className="flex items-start gap-3">
              <span className="bg-white/20 p-1 rounded">
                 <Zap className="h-4 w-4" />
              </span>
              <div>
                 <p className="font-semibold text-sm">{announcements[0].message}</p>
                 <p className="text-xs text-indigo-100 mt-0.5">{announcements[0].date}</p>
              </div>
              <button 
                onClick={() => dismissAnnouncement(announcements[0].id)}
                className="absolute top-2 right-2 text-indigo-200 hover:text-white p-1"
              >
                <X className="h-4 w-4" />
              </button>
           </div>
        </div>
      )}

      {/* 1. HEADER & GREETING */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Hi, {student.name} 👋</h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            Target Role: <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full text-xs uppercase tracking-wide">{student.role}</span>
          </p>
        </div>
        
        {/* Top Stats Strip */}
        <div className="flex gap-4 bg-white p-3 rounded-xl shadow-sm border border-slate-200 text-sm">
           <div className="flex items-center gap-2 px-2">
             <Clock className="h-4 w-4 text-indigo-500" />
             <div>
               <span className="font-bold text-slate-900 block leading-none">{stats.totalHours}h</span>
               <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Learned</span>
             </div>
           </div>
           <div className="w-px bg-slate-100"></div>
           <div className="flex items-center gap-2 px-2">
             <Terminal className="h-4 w-4 text-emerald-500" />
             <div>
               <span className="font-bold text-slate-900 block leading-none">{stats.labsCompleted}</span>
               <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Labs</span>
             </div>
           </div>
           <div className="w-px bg-slate-100"></div>
           <div className="flex items-center gap-2 px-2">
             <Award className="h-4 w-4 text-yellow-500" />
             <div>
               <span className="font-bold text-slate-900 block leading-none">{stats.certificatesEarned}</span>
               <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Certs</span>
             </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: MAIN CONTENT (2/3) */}
        <div className="lg:col-span-2 space-y-8">
           
           {/* SECTION 2: HERO - CONTINUE LEARNING */}
           {activePath ? (
             <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-100 transition-colors"></div>
                
                <div className="relative z-10">
                   <div className="flex justify-between items-start mb-4">
                      <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-slate-600 text-xs font-bold uppercase tracking-wider">
                         <Activity className="h-3 w-3" /> Continue Learning
                      </div>
                      <span className="text-sm font-bold text-indigo-600">{activePathEnrollment.progress}% Complete</span>
                   </div>

                   <h2 className="text-2xl font-bold text-slate-900 mb-1">{activePath.title}</h2>
                   <p className="text-slate-500 mb-6 text-sm">
                     Next: <span className="font-semibold text-slate-700">Module 3 - IAM Fundamentals & Best Practices</span>
                   </p>

                   {/* Progress Bar */}
                   <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-6">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-1000" style={{ width: `${activePathEnrollment.progress}%` }}></div>
                   </div>
                   
                   <div className="flex gap-3">
                      <Link to={`/student/paths/${activePath.id}`} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 shadow-lg shadow-indigo-200">
                         <Play className="h-4 w-4 fill-current" /> Resume Lesson
                      </Link>
                      <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors">
                         View Curriculum
                      </button>
                   </div>
                </div>
             </div>
           ) : (
             <div className="bg-indigo-600 rounded-2xl p-8 text-white text-center shadow-lg">
                <h3 className="text-xl font-bold mb-2">Start Your Journey</h3>
                <p className="text-indigo-200 mb-6">Enroll in a learning path to unlock your career potential.</p>
                <Link to="/learning-paths" className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-bold hover:bg-indigo-50 transition-colors">
                  Explore Paths
                </Link>
             </div>
           )}

           {/* SECTION 3: QUICK ACTIONS */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/learning-paths" className="bg-white border border-slate-200 p-4 rounded-xl hover:shadow-md transition-all group text-center">
                 <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                    <BookOpen className="h-5 w-5" />
                 </div>
                 <span className="text-xs font-bold text-slate-700">Browse Courses</span>
              </Link>
              <button className="bg-white border border-slate-200 p-4 rounded-xl hover:shadow-md transition-all group text-center">
                 <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                    <Terminal className="h-5 w-5" />
                 </div>
                 <span className="text-xs font-bold text-slate-700">Launch Labs</span>
              </button>
              <button className="bg-white border border-slate-200 p-4 rounded-xl hover:shadow-md transition-all group text-center">
                 <div className="w-10 h-10 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                    <Award className="h-5 w-5" />
                 </div>
                 <span className="text-xs font-bold text-slate-700">My Certificates</span>
              </button>
              <button className="bg-white border border-slate-200 p-4 rounded-xl hover:shadow-md transition-all group text-center">
                 <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                    <FileText className="h-5 w-5" />
                 </div>
                 <span className="text-xs font-bold text-slate-700">Smart Sheets</span>
              </button>
           </div>

           {/* SECTION 4: MY LEARNING PATHS */}
           <div>
              <div className="flex items-center justify-between mb-4">
                 <h2 className="text-lg font-bold text-slate-900">My Learning Paths</h2>
                 <Link to="/student/paths" className="text-sm text-indigo-600 font-semibold hover:underline">View All</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {enrolledPaths.map((ep) => {
                    const p = paths.find(path => path.id === ep.pathId);
                    if (!p) return null;
                    return (
                       <div key={p.id} className="bg-white border border-slate-200 p-5 rounded-xl hover:border-indigo-300 transition-all cursor-pointer group">
                          <div className="flex items-center gap-3 mb-4">
                             <div className={`w-10 h-10 rounded-lg ${p.bg} ${p.color} flex items-center justify-center`}>
                                <p.icon className="h-5 w-5" />
                             </div>
                             <div>
                                <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{p.title}</h3>
                                <p className="text-xs text-slate-500">{p.coursesCount || 5} Courses • Career Track</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-3 text-xs font-medium text-slate-600 mb-3">
                             <span className="bg-slate-100 px-2 py-1 rounded">Est. {p.estimatedHours || '40h'} Left</span>
                             <span className="bg-slate-100 px-2 py-1 rounded">{ep.progress}% Done</span>
                          </div>
                          <Link to={`/student/paths/${p.id}`} className="block w-full text-center bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 py-2 rounded-lg text-xs font-bold transition-colors">
                             Open Path
                          </Link>
                       </div>
                    );
                 })}
              </div>
           </div>

           {/* SECTION 5: MY COURSES */}
           <div>
              <div className="flex items-center justify-between mb-4">
                 <h2 className="text-lg font-bold text-slate-900">My Courses</h2>
                 <div className="bg-slate-100 p-1 rounded-lg flex text-xs font-bold">
                    {['All', 'In Progress', 'Completed'].map((tab) => (
                      <button 
                        key={tab}
                        onClick={() => setCourseTab(tab as any)}
                        className={`px-3 py-1.5 rounded-md transition-all ${courseTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        {tab}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="space-y-3">
                 {filteredCourses.length > 0 ? (
                   filteredCourses.map((course: any) => (
                     <div key={course.courseId} className="bg-white border border-slate-200 rounded-xl p-4 flex gap-4 hover:shadow-md transition-shadow group">
                        <div className="w-24 h-16 bg-slate-100 rounded-lg flex-shrink-0 overflow-hidden relative">
                           {course.thumbnail ? (
                             <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-slate-300">
                               <Activity className="h-6 w-6" />
                             </div>
                           )}
                           {/* Play Overlay */}
                           <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Play className="h-6 w-6 text-white fill-current" />
                           </div>
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="flex justify-between items-start">
                              <h3 className="font-bold text-slate-800 text-sm truncate pr-4 group-hover:text-indigo-600 transition-colors">{course.title}</h3>
                              {course.status === 'Completed' && <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />}
                           </div>
                           <p className="text-xs text-slate-500 mt-0.5 truncate">{course.instructorId ? 'Instructor-Led' : 'Self-Paced'}</p>
                           
                           {/* Progress Bar */}
                           <div className="flex items-center gap-3 mt-2">
                              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                 <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${course.progress}%` }}></div>
                              </div>
                              <span className="text-xs font-bold text-slate-700">{course.progress}%</span>
                           </div>
                        </div>
                        <div className="flex items-center">
                           <Link to={`/student/courses/${course.courseId}`} className="text-xs font-bold text-indigo-600 hover:underline px-2">
                              {course.progress > 0 ? 'Resume' : 'Start'}
                           </Link>
                        </div>
                     </div>
                   ))
                 ) : (
                   <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      <p className="text-xs text-slate-500">No courses found in this category.</p>
                   </div>
                 )}
              </div>
           </div>

        </div>

        {/* RIGHT COLUMN: SIDEBAR (1/3) */}
        <div className="space-y-8">
           
           {/* WIDGET: WEEKLY STREAK */}
           <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                 <div>
                    <h3 className="font-bold text-slate-900 text-sm">Weekly Progress</h3>
                    <div className="flex items-center gap-1.5 mt-1 text-emerald-600">
                       <Flame className="h-4 w-4 fill-current" />
                       <span className="text-xs font-bold">{stats.currentStreak} Day Streak!</span>
                    </div>
                 </div>
                 <div className="text-right">
                    <span className="block text-2xl font-bold text-slate-900">4.5h</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">This Week</span>
                 </div>
              </div>
              
              {/* Chart */}
              <div className="flex items-end justify-between h-24 gap-2">
                 {weeklyActivity.map((day, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 flex-1">
                       <div 
                         className={`w-full rounded-t-sm transition-all hover:opacity-80 ${day.active ? 'bg-indigo-500' : 'bg-slate-100'}`} 
                         style={{ height: `${day.active ? Math.max(day.hours * 20, 15) : 10}%` }}
                         title={`${day.hours} hours`}
                       ></div>
                       <span className={`text-[10px] font-bold ${day.active ? 'text-slate-700' : 'text-slate-400'}`}>{day.day}</span>
                    </div>
                 ))}
              </div>
           </div>

           {/* WIDGET: GOAL PROGRESS */}
           <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-[60px] opacity-20"></div>
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Goal Progress</h3>
              
              <div className="flex items-center gap-4 mb-4">
                 <div className="relative w-16 h-16">
                    <svg className="w-full h-full transform -rotate-90">
                       <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-700" />
                       <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={175} strokeDashoffset={175 * 0.82} className="text-emerald-400" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center font-bold text-sm">18%</div>
                 </div>
                 <div>
                    <div className="font-bold text-white mb-1">Level 6 Engineer</div>
                    <p className="text-xs text-slate-400 leading-relaxed">Complete 2 more courses to reach your next milestone.</p>
                 </div>
              </div>
              <button className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg text-xs font-bold transition-colors">
                 View Career Path
              </button>
           </div>

           {/* WIDGET: LABS */}
           <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                   <Terminal className="h-4 w-4 text-indigo-600" /> Labs
                 </h3>
                 <div className="flex bg-slate-100 rounded-lg p-0.5">
                    <button 
                      onClick={() => setLabTab('Active')}
                      className={`px-2 py-1 text-[10px] font-bold rounded ${labTab === 'Active' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
                    >
                      Active
                    </button>
                    <button 
                      onClick={() => setLabTab('Upcoming')}
                      className={`px-2 py-1 text-[10px] font-bold rounded ${labTab === 'Upcoming' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
                    >
                      Upcoming
                    </button>
                 </div>
              </div>

              <div className="space-y-3">
                 {labTab === 'Active' ? (
                    activeLabs.length > 0 ? activeLabs.map(lab => (
                       <div key={lab.id} className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                          <div className="flex justify-between items-start mb-2">
                             <span className="text-xs font-bold text-emerald-900">{lab.name}</span>
                             <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded uppercase">Running</span>
                          </div>
                          <div className="flex justify-between items-center">
                             <span className="text-[10px] text-emerald-600 font-mono">Time Left: {lab.timeLeft}</span>
                             <button className="text-[10px] font-bold text-white bg-emerald-600 px-2 py-1 rounded hover:bg-emerald-700">Connect</button>
                          </div>
                       </div>
                    )) : <p className="text-xs text-slate-500 text-center py-4">No active labs.</p>
                 ) : (
                    upcomingLabs.length > 0 ? upcomingLabs.map(lab => (
                       <div key={lab.id} className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                          <div className="flex justify-between items-start mb-1">
                             <span className="text-xs font-bold text-slate-800">{lab.name}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-1">
                             <Calendar className="h-3 w-3" /> {lab.startTime}
                          </div>
                       </div>
                    )) : <p className="text-xs text-slate-500 text-center py-4">No scheduled labs.</p>
                 )}
              </div>
           </div>

           {/* WIDGET: SMART SHEETS */}
           <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
                 <FileText className="h-4 w-4 text-purple-500" /> Your Smart Sheets
              </h3>
              <div className="space-y-2">
                 {smartSheets.map(sheet => (
                    <div key={sheet.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg group transition-colors cursor-pointer">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 font-bold text-[10px]">
                             {sheet.type === 'PDF' ? 'PDF' : 'DOC'}
                          </div>
                          <div>
                             <p className="text-xs font-bold text-slate-700">{sheet.title}</p>
                             <p className="text-[10px] text-slate-400">{sheet.size}</p>
                          </div>
                       </div>
                       <Download className="h-4 w-4 text-slate-300 group-hover:text-purple-600 transition-colors" />
                    </div>
                 ))}
              </div>
           </div>

           {/* WIDGET: LEARNING TIMELINE */}
           <div className="relative pl-4 space-y-6 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-px before:bg-slate-200">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-2">Timeline</h3>
              {learningTimeline.map(event => (
                 <div key={event.id} className="relative pl-6">
                    <div className={`absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm
                       ${event.type === 'Badge' ? 'bg-yellow-400' : event.type === 'Quiz' ? 'bg-purple-500' : 'bg-indigo-500'}
                    `}></div>
                    <p className="text-xs font-bold text-slate-800">{event.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{event.date}</p>
                    {event.score && (
                       <span className="inline-block mt-1 text-[10px] font-bold bg-green-50 text-green-700 px-1.5 py-0.5 rounded border border-green-100">
                          Score: {event.score}
                       </span>
                    )}
                 </div>
              ))}
           </div>

        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;