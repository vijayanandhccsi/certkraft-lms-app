import React from 'react';
import { Star, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Course } from '../contexts/CourseContext'; // Updated import source

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <Link to={`/courses/${course.id}`} className="block h-full group">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 overflow-hidden flex flex-col h-full transform group-hover:-translate-y-1">
        <div className="relative overflow-hidden h-48">
          <img 
            src={course.thumbnail} 
            alt={course.title} 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-slate-800 shadow-sm border border-white/50">
            {course.level}
          </div>
          {course.courseType === 'Certification Course' && (
            <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide shadow-sm">
              Certification
            </div>
          )}
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex flex-wrap gap-2 mb-2">
             {course.categories.slice(0, 1).map(cat => (
                <span key={cat} className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wide">
                  {cat}
                </span>
             ))}
          </div>
          <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
            {course.title}
          </h3>
          <p className="text-slate-500 text-sm mb-4 line-clamp-2">{course.subtitle || course.description}</p>
          
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-4 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                <span>1.2k</span>
              </div>
              <div className="flex items-center gap-1">
                 <Clock className="h-3.5 w-3.5" />
                 <span>{course.durationHours}h</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-indigo-600 transition-colors">
                 View Details
               </span>
               <span className="bg-slate-100 text-slate-600 p-1.5 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                 </svg>
               </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;