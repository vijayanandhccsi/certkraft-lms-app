import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Play, CheckCircle, Clock, BookOpen, 
  Terminal, BarChart, ChevronDown, Filter, Layers, 
  ArrowRight, Award
} from 'lucide-react';
import { useStudent } from '../../contexts/StudentContext';
import { useCourses } from '../../contexts/CourseContext';

const StudentMyCourses: React.FC = () => {
  const { enrolledCourses, stats } = useStudent();
  const { courses } = useCourses();
  
  const [filterTab, setFilterTab] = useState<'All' | 'In Progress' | 'Completed' | 'Not Started'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'Recently Viewed' | 'Progress' | 'A-Z'>('Recently Viewed');

  // Resolve Enrolled Data
  const myCourses = enrolledCourses.map(enrollment => {
    const courseData = courses.find(c => c.id === enrollment.courseId);
    return { ...enrollment, ...courseData };
  }).filter(c => c.title); // Remove undefined

  // Filtering Logic
  const filteredCourses = myCourses.filter(course => {
    const matchesTab = filterTab === 'All' || course.status === filterTab;
    const matchesSearch = course.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.subtitle?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Sorting Logic
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === 'Progress') return b.progress - a.progress;
    if (sortBy === 'A-Z') return (a.title || '').localeCompare(b.title || '');
    // Default: Recently Viewed (mocked by simply keeping order or using lastAccessed if available)
    return 0; 
  });

  const activeCourse = myCourses.find(c => c.status === 'In Progress' && c.progress > 0);

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Courses</h1>
          <p className="text-slate-500 mt-1">View and resume all the courses you’re enrolled in.</p>
        </div>
      </div>

      {/* Hero: Continue Learning (Optional but Recommended) */}
      {activeCourse && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-center relative overflow-hidden group">
           <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
           
           <div className="w-full md:w-64 h-36 rounded-xl overflow-hidden flex-shrink-0 relative">
              <img src={activeCourse.thumbnail} alt={activeCourse.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                 <button className="bg-white/90 text-indigo-600 p-3 rounded-full shadow-lg hover:scale-110 transition-transform">
                    <Play className="h-6 w-6 fill-current" />
                 </button>
              </div>
           </div>

           <div className="flex-1 w-full">
              <div className="flex items-center gap-2 mb-2">
                 <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Continue Learning</span>
                 <span className="text-slate-400 text-xs">• Last accessed 2 hours ago</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">{activeCourse.title}</h2>
              <p className="text-slate-500 text-sm mb-4 line-clamp-1">{activeCourse.subtitle}</p>
              
              <div className="flex items-center gap-4 mb-2">
                 <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${activeCourse.progress}%` }}></div>
                 </div>
                 <span className="text-sm font-bold text-slate-700">{activeCourse.progress}%</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                 <span>Next: Module 2 - Advanced Concepts</span>
                 <span>{activeCourse.durationHours}h remaining</span>
              </div>
           </div>

           <div className="md:self-end">
              <Link to={`/student/courses/${activeCourse.courseId}`} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-lg shadow-indigo-200">
                 Resume
              </Link>
           </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
         {/* Tabs */}
         <div className="flex bg-slate-100 p-1 rounded-lg w-full lg:w-auto overflow-x-auto">
            {['All', 'In Progress', 'Completed', 'Not Started'].map((tab) => (
               <button
                 key={tab}
                 onClick={() => setFilterTab(tab as any)}
                 className={`px-4 py-2 rounded-md text-sm font-bold transition-all whitespace-nowrap ${filterTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 {tab}
               </button>
            ))}
         </div>

         <div className="flex gap-3 w-full lg:w-auto">
            {/* Search */}
            <div className="relative flex-1 lg:w-64">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Search your courses..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
               />
            </div>

            {/* Sort */}
            <div className="relative group">
               <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Sort: {sortBy}</span>
                  <ChevronDown className="h-3 w-3" />
               </button>
               {/* Dropdown would go here in a full implementation */}
            </div>
         </div>
      </div>

      {/* Course Grid */}
      {sortedCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
           {sortedCourses.map(course => (
              <div key={course.courseId} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all group flex flex-col h-full">
                 
                 {/* Thumbnail */}
                 <div className="h-44 bg-slate-200 relative overflow-hidden">
                    {course.thumbnail ? (
                       <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                       <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <Layers className="h-12 w-12" />
                       </div>
                    )}
                    <div className="absolute top-3 right-3">
                       <span className={`px-2.5 py-1 rounded text-xs font-bold shadow-sm backdrop-blur-md
                          ${course.status === 'Completed' ? 'bg-emerald-500/90 text-white' : 
                            course.status === 'In Progress' ? 'bg-blue-500/90 text-white' : 
                            'bg-slate-800/80 text-white'}
                       `}>
                          {course.status}
                       </span>
                    </div>
                 </div>

                 {/* Body */}
                 <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-slate-900 text-lg mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                       {course.title}
                    </h3>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-grow">
                       {course.subtitle || course.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-4 bg-slate-50 p-2 rounded-lg">
                       <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-indigo-500" />
                          <span>{course.durationHours || 10}h</span>
                       </div>
                       <div className="flex items-center gap-1.5">
                          <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
                          <span>{course.lessonsCount || 20} Lessons</span>
                       </div>
                       {(course.labsCount ?? 0) > 0 && (
                          <div className="flex items-center gap-1.5">
                             <Terminal className="h-3.5 w-3.5 text-emerald-500" />
                             <span>{course.labsCount} Labs</span>
                          </div>
                       )}
                    </div>

                    {/* Progress */}
                    <div className="space-y-2 mt-auto">
                       <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-600">{course.progress}% Complete</span>
                       </div>
                       <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                             className={`h-full rounded-full ${course.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
                             style={{ width: `${course.progress}%` }}
                          ></div>
                       </div>
                    </div>
                 </div>

                 {/* Footer Action */}
                 <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                    {course.status === 'Completed' ? (
                       <button className="w-full flex items-center justify-center gap-2 text-emerald-700 font-bold text-sm hover:text-emerald-800 transition-colors">
                          <Award className="h-4 w-4" /> View Certificate
                       </button>
                    ) : (
                       <Link 
                          to={`/student/courses/${course.courseId}`}
                          className="w-full flex items-center justify-center gap-2 bg-white border border-slate-300 hover:border-indigo-500 hover:text-indigo-600 text-slate-700 font-bold py-2 rounded-lg text-sm transition-all shadow-sm"
                       >
                          {course.progress > 0 ? 'Continue Course' : 'Start Course'} <ArrowRight className="h-4 w-4" />
                       </Link>
                    )}
                 </div>
              </div>
           ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-slate-200 rounded-2xl text-center">
           <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
              <Layers className="h-10 w-10 text-indigo-300" />
           </div>
           <h3 className="text-xl font-bold text-slate-900 mb-2">
              {filterTab === 'All' ? "You haven't enrolled in any courses yet." : `No courses found in "${filterTab}"`}
           </h3>
           <p className="text-slate-500 max-w-md mb-8">
              Start your first course and begin your learning journey to become a certified professional.
           </p>
           <Link to="/learning-paths" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-indigo-200">
              Browse Catalog
           </Link>
        </div>
      )}

    </div>
  );
};

export default StudentMyCourses;