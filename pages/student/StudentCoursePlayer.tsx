import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Menu, CheckCircle, Play, FileText, 
  HelpCircle, Terminal, ChevronRight, MessageSquare, 
  ThumbsUp, Meh, ThumbsDown
} from 'lucide-react';
import { useCourses } from '../../contexts/CourseContext';
import { useStudent } from '../../contexts/StudentContext';

const StudentCoursePlayer: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { courses } = useCourses();
  const { enrolledCourses, markLessonComplete } = useStudent();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Find Data
  const course = courses.find(c => c.id === Number(courseId));
  const enrollment = enrolledCourses.find(ec => ec.courseId === Number(courseId));

  // State for active lesson (mocking standard selection logic)
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);

  if (!course) return <div className="p-8 text-white">Course not found</div>;

  const activeModule = course.modules[activeModuleIndex];
  const activeLesson = activeModule?.lessons[activeLessonIndex];

  const handleNext = () => {
    // Logic to move to next lesson across modules
    if (activeLessonIndex < activeModule.lessons.length - 1) {
       setActiveLessonIndex(prev => prev + 1);
    } else if (activeModuleIndex < course.modules.length - 1) {
       setActiveModuleIndex(prev => prev + 1);
       setActiveLessonIndex(0);
    }
  };

  const handleComplete = () => {
    if (activeLesson) {
       markLessonComplete(course.id, activeLesson.id);
       handleNext();
    }
  };

  const isCompleted = (lessonId: string) => enrollment?.completedLessons.includes(lessonId);

  return (
    <div className="fixed inset-0 bg-[#0f172a] text-slate-300 flex flex-col z-50 font-sans">
      
      {/* Top Bar */}
      <header className="h-16 bg-[#1e293b] border-b border-slate-700 flex items-center justify-between px-4 flex-shrink-0">
         <div className="flex items-center gap-4">
            <Link to="/student/dashboard" className="text-slate-400 hover:text-white transition-colors">
               <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="h-6 w-px bg-slate-700 hidden md:block"></div>
            <div>
               <h1 className="text-sm font-bold text-white line-clamp-1">{course.title}</h1>
               {enrollment && (
                 <div className="flex items-center gap-2 text-xs text-slate-400">
                    <div className="w-20 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${enrollment.progress}%` }}></div>
                    </div>
                    <span>{enrollment.progress}% Complete</span>
                 </div>
               )}
            </div>
         </div>
         
         <div className="flex items-center gap-4">
            <button 
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded text-sm font-bold transition-colors flex items-center gap-2"
              onClick={() => alert('Opening AI Assistant...')}
            >
               <MessageSquare className="h-4 w-4" /> Ask AI
            </button>
            <button 
               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
               className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white md:hidden"
            >
               <Menu className="h-5 w-5" />
            </button>
         </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
         
         {/* Main Content Area */}
         <div className="flex-1 flex flex-col relative overflow-y-auto">
            <div className="flex-1 bg-black flex items-center justify-center relative group overflow-hidden">
               {/* Content Placeholder based on Type */}
               {activeLesson?.type === 'Video' ? (
                  <div className="w-full h-full bg-black flex items-center justify-center">
                     {activeLesson.content ? (
                        // Check if content is a blob URL or a direct video link, otherwise assume iframe/embed
                        activeLesson.content.startsWith('blob:') || activeLesson.content.match(/\.(mp4|webm|ogg)$/i) ? (
                           <video 
                              controls 
                              className="w-full h-full max-h-[80vh]" 
                              src={activeLesson.content}
                              controlsList="nodownload"
                           >
                              Your browser does not support the video tag.
                           </video>
                        ) : (
                           // Assume embeddable URL (YouTube etc)
                           <iframe
                              src={activeLesson.content.includes('watch?v=') ? activeLesson.content.replace('watch?v=', 'embed/') : activeLesson.content}
                              className="w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              title={activeLesson.title}
                           />
                        )
                     ) : (
                        <div className="text-center text-slate-500">
                            <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No video content available</p>
                        </div>
                     )}
                  </div>
               ) : activeLesson?.type === 'Quiz' ? (
                  <div className="text-center p-8 bg-slate-800 rounded-2xl border border-slate-700 max-w-md">
                     <HelpCircle className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
                     <h3 className="text-xl font-bold text-white mb-2">Quiz: {activeLesson.title}</h3>
                     <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold mt-4 hover:bg-indigo-500">Start Quiz</button>
                  </div>
               ) : activeLesson?.type === 'HTML' ? (
                  <div className="w-full h-full bg-white">
                      {activeLesson.content ? (
                        <iframe 
                            src={activeLesson.content} 
                            className="w-full h-full border-0"
                            title="Interactive Content"
                            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
                            allowFullScreen
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-slate-500">
                            <p>No content file uploaded.</p>
                        </div>
                      )}
                  </div>
               ) : (
                  <div className="text-center text-slate-500">
                     <Terminal className="h-12 w-12 mx-auto mb-2 opacity-50" />
                     <p>Interactive Content Area</p>
                  </div>
               )}
            </div>

            {/* Lesson Footer */}
            <div className="h-20 bg-[#1e293b] border-t border-slate-700 flex items-center justify-between px-8 flex-shrink-0">
               <div className="flex items-center gap-4 text-sm">
                  <span className="text-slate-400 hidden md:inline">How was this lesson?</span>
                  <div className="flex gap-2">
                     <button className="p-1.5 hover:bg-slate-700 rounded text-slate-500 hover:text-emerald-400 transition-colors"><ThumbsUp className="h-4 w-4" /></button>
                     <button className="p-1.5 hover:bg-slate-700 rounded text-slate-500 hover:text-yellow-400 transition-colors"><Meh className="h-4 w-4" /></button>
                     <button className="p-1.5 hover:bg-slate-700 rounded text-slate-500 hover:text-red-400 transition-colors"><ThumbsDown className="h-4 w-4" /></button>
                  </div>
               </div>

               <div className="flex items-center gap-4">
                  <button 
                    onClick={handleComplete}
                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
                  >
                    {isCompleted(activeLesson?.id || '') ? 'Completed' : 'Mark as Complete'} 
                    <ChevronRight className="h-4 w-4" />
                  </button>
               </div>
            </div>
         </div>

         {/* Sidebar Navigation */}
         <div className={`
            w-80 bg-[#1e293b] border-l border-slate-700 flex flex-col transition-all duration-300 absolute md:relative right-0 h-full z-20
            ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:w-0 md:translate-x-0 opacity-0 md:opacity-100'} 
            ${!isSidebarOpen && 'md:hidden'}
         `}>
            <div className="p-4 border-b border-slate-700 font-bold text-white">Course Content</div>
            <div className="flex-1 overflow-y-auto">
               {course.modules.map((module, mIndex) => (
                  <div key={module.id} className="border-b border-slate-700/50">
                     <div className="bg-slate-800/50 px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider sticky top-0 backdrop-blur-sm">
                        {module.title}
                     </div>
                     <div>
                        {module.lessons.map((lesson, lIndex) => {
                           const active = mIndex === activeModuleIndex && lIndex === activeLessonIndex;
                           const completed = isCompleted(lesson.id);
                           
                           return (
                              <button
                                 key={lesson.id}
                                 onClick={() => {
                                    setActiveModuleIndex(mIndex);
                                    setActiveLessonIndex(lIndex);
                                 }}
                                 className={`w-full flex items-start gap-3 p-4 text-left transition-colors border-l-4
                                    ${active ? 'bg-[#334155] border-indigo-500' : 'hover:bg-slate-800/50 border-transparent'}
                                 `}
                              >
                                 <div className="mt-0.5">
                                    {completed ? (
                                       <CheckCircle className="h-4 w-4 text-emerald-500" />
                                    ) : lesson.type === 'Video' ? (
                                       <Play className={`h-4 w-4 ${active ? 'text-indigo-400' : 'text-slate-500'}`} />
                                    ) : (
                                       <FileText className={`h-4 w-4 ${active ? 'text-indigo-400' : 'text-slate-500'}`} />
                                    )}
                                 </div>
                                 <div>
                                    <div className={`text-sm font-medium ${active ? 'text-white' : 'text-slate-400'} mb-1`}>
                                       {lesson.title}
                                    </div>
                                    <div className="text-xs text-slate-600 flex items-center gap-2">
                                       <span>{lesson.duration}</span>
                                       {lesson.type !== 'Video' && (
                                          <span className="px-1.5 py-0.5 bg-slate-700 rounded text-[10px] uppercase text-slate-400">{lesson.type}</span>
                                       )}
                                    </div>
                                 </div>
                              </button>
                           );
                        })}
                     </div>
                  </div>
               ))}
            </div>
         </div>

      </div>
    </div>
  );
};

export default StudentCoursePlayer;