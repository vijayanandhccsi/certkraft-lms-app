import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Play, CheckCircle, Globe, Clock, Award, ShieldCheck, 
  ArrowRight, User, HelpCircle, BookOpen 
} from 'lucide-react';
import { useCourses } from '../contexts/CourseContext';
import { useInstructors } from '../contexts/InstructorContext';
import { useLearningPaths } from '../contexts/LearningPathContext';

const CourseLandingPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { courses } = useCourses();
  const { instructors } = useInstructors();
  const { paths } = useLearningPaths();

  const course = courses.find(c => c.id === Number(courseId));
  
  if (!course) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Course Not Found</h2>
        <p className="text-slate-500 mb-6">The course you are looking for does not exist or has been removed.</p>
        <Link to="/" className="text-indigo-600 font-medium hover:underline">Return Home</Link>
      </div>
    );
  }

  const instructor = instructors.find(i => String(i.id) === course.instructorId);
  const learningPath = paths.find(p => String(p.id) === course.learningPathId);

  // Parse YouTube ID if available
  const getYoutubeEmbed = (url: string) => {
    try {
      if (!url) return null;
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      const id = (match && match[2].length === 11) ? match[2] : null;
      return id ? `https://www.youtube.com/embed/${id}` : null;
    } catch {
      return null;
    }
  };

  const videoUrl = getYoutubeEmbed(course.demoVideoUrl);

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      
      {/* Hero Section */}
      <div className="bg-[#111827] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 to-slate-900/50 z-0"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div>
              {learningPath && (
                <div className="inline-flex items-center gap-2 text-indigo-300 text-sm font-bold uppercase tracking-wide mb-4 bg-indigo-900/50 px-3 py-1 rounded-full border border-indigo-500/30">
                  <BookOpen className="h-4 w-4" />
                  {learningPath.title} Path
                </div>
              )}
              
              <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
                {course.title}
              </h1>
              
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                {course.objective || "Master essential skills in this comprehensive course designed for modern professionals."}
              </p>

              <div className="flex flex-wrap gap-6 text-sm font-medium text-slate-400 mb-8">
                 <div className="flex items-center gap-2">
                   <Globe className="h-4 w-4 text-indigo-400" />
                   {course.language}
                 </div>
                 {instructor && (
                   <div className="flex items-center gap-2">
                     <User className="h-4 w-4 text-indigo-400" />
                     {instructor.name}
                   </div>
                 )}
                 <div className="flex items-center gap-2">
                   <Award className="h-4 w-4 text-indigo-400" />
                   {course.courseType}
                 </div>
              </div>

              <div className="flex gap-4">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-1">
                  Start Learning
                </button>
              </div>
            </div>

            {/* Video / Media Card */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-800 aspect-video group">
               {videoUrl ? (
                 <iframe 
                   src={videoUrl} 
                   title="Course Demo"
                   className="w-full h-full"
                   allowFullScreen
                 />
               ) : (
                 <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-500">
                    <Play className="h-16 w-16 mb-4 opacity-50" />
                    <span>No Preview Available</span>
                 </div>
               )}
            </div>
            
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        <div className="lg:col-span-2 space-y-12">
          
          {/* Description */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">About this course</h2>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-line bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              {course.description}
            </div>
          </section>

          {/* Prerequisites */}
          {course.prerequisites && (
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Prerequisites</h2>
              <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl flex gap-4">
                 <div className="flex-shrink-0 mt-1">
                   <ShieldCheck className="h-6 w-6 text-amber-600" />
                 </div>
                 <div className="text-amber-900">
                   {course.prerequisites}
                 </div>
              </div>
            </section>
          )}

          {/* Exam Objectives */}
          {course.courseType === 'Certification Course' && course.examObjectives && (
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Certification Objectives</h2>
              <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                <div className="whitespace-pre-line text-slate-700">
                  {course.examObjectives}
                </div>
              </div>
            </section>
          )}

          {/* FAQ */}
          {course.faqs.length > 0 && (
             <section>
               <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
               <div className="space-y-4">
                 {course.faqs.map((faq, idx) => (
                   <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                     <h3 className="font-bold text-slate-900 mb-2 flex items-start gap-3">
                       <HelpCircle className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                       {faq.question}
                     </h3>
                     <p className="text-slate-600 pl-8">{faq.answer}</p>
                   </div>
                 ))}
               </div>
             </section>
          )}

        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
             <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
               <h3 className="font-bold text-slate-900 mb-6">Course Features</h3>
               <ul className="space-y-4">
                 <li className="flex items-center gap-3 text-slate-600 text-sm">
                   <Clock className="h-5 w-5 text-slate-400" />
                   <span>Self-paced learning</span>
                 </li>
                 <li className="flex items-center gap-3 text-slate-600 text-sm">
                   <Globe className="h-5 w-5 text-slate-400" />
                   <span>Taught in {course.language}</span>
                 </li>
                 <li className="flex items-center gap-3 text-slate-600 text-sm">
                   <Award className="h-5 w-5 text-slate-400" />
                   <span>Certificate of Completion</span>
                 </li>
               </ul>
               <button className="w-full mt-8 bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors">
                 Enroll Now
               </button>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CourseLandingPage;