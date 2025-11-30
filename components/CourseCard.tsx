import React from 'react';
import { Star, Users, Clock } from 'lucide-react';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer flex flex-col h-full">
      <div className="relative overflow-hidden h-48">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-slate-800 shadow-sm">
          {course.level}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="text-xs font-medium text-indigo-600 mb-2 uppercase tracking-wide">
          {course.category}
        </div>
        <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2 leading-tight">
          {course.title}
        </h3>
        <p className="text-slate-500 text-sm mb-4">by {course.instructor}</p>
        
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-slate-700">{course.rating}</span>
              <span className="text-slate-400">({course.students.toLocaleString()})</span>
            </div>
            <div className="flex items-center gap-1">
               <Clock className="h-3.5 w-3.5" />
               <span>22h</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
             <span className="text-lg font-bold text-slate-900">
               {course.price === 0 ? 'Free' : `$${course.price}`}
             </span>
             <button className="text-indigo-600 font-semibold text-sm hover:text-indigo-800 transition-colors">
               View Details &rarr;
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
