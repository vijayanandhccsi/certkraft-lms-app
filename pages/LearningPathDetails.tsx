import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, BookOpen, User, Star, Award, ShieldCheck, PlayCircle, Terminal } from 'lucide-react';
import { useLearningPaths } from '../contexts/LearningPathContext';

const LearningPathDetails: React.FC = () => {
  const { paths } = useLearningPaths();
  const { id } = useParams<{ id: string }>();
  const path = paths.find(p => p.id === Number(id));

  if (!path) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Learning Path Not Found</h2>
        <p className="text-slate-500 mb-6">The requested path may have been removed or does not exist.</p>
        <Link to="/learning-paths" className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to All Paths
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* Hero Section */}
      <section className="bg-slate-900 text-white relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <Link to="/learning-paths" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Learning Paths
          </Link>
          
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="flex-1">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-6 ${path.bg} ${path.color} border ${path.border}`}>
                <path.icon className="h-4 w-4" />
                {path.level} Path
              </div>
              
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
                {path.title}
              </h1>
              
              <p className="text-xl text-slate-300 leading-relaxed mb-8 max-w-2xl">
                {path.longDescription}
              </p>
              
              <div className="flex flex-wrap gap-6 text-sm font-medium text-slate-400 mb-10">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-indigo-400" />
                  <span>{path.totalDuration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-indigo-400" />
                  <span>{path.syllabus.length} Modules</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-indigo-400" />
                  <span>1.2k Enrolled</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-white">4.8</span>
                  <span>(120 reviews)</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-1">
                  Enroll Now
                </button>
                <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg backdrop-blur-sm border border-white/10 transition-all">
                  Download Syllabus
                </button>
              </div>
            </div>

            {/* Hero Card / Visual */}
            <div className="w-full md:w-[400px] hidden lg:block">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center mb-6 shadow-inner border border-slate-700 mx-auto">
                    <path.icon className={`h-12 w-12 ${path.color}`} />
                 </div>
                 <h3 className="text-center text-2xl font-bold mb-2">Become a {path.roles[0]}</h3>
                 <div className="space-y-4 mt-6">
                    <div className="flex items-center gap-3 text-slate-300">
                      <ShieldCheck className="h-5 w-5 text-emerald-400" />
                      <span>Industry Recognized</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-300">
                      <Award className="h-5 w-5 text-yellow-400" />
                      <span>Certificate of Completion</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-300">
                      <PlayCircle className="h-5 w-5 text-cyan-400" />
                      {/* FIX: Correctly reduce lesson count by using `.length` on the lessons array. */}
                      <span>{path.syllabus.reduce((acc, mod) => acc + mod.lessons.length, 0)} Lessons</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column: Curriculum & Details */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Outcomes */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">What you'll learn</h2>
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {path.outcomes.map((outcome, idx) => (
                  <div key={idx} className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 leading-relaxed">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Syllabus */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Course Curriculum</h2>
            <div className="space-y-4">
              {path.syllabus.map((module, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-indigo-200 transition-colors">
                  <div className="p-5 flex items-center justify-between cursor-pointer">
                     <div className="flex items-center gap-4">
                       <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">
                         {idx + 1}
                       </div>
                       <div>
                         <h3 className="font-bold text-slate-900">{module.title}</h3>
                         {/* FIX: Correctly display lesson count and remove non-existent 'duration' property. */}
                         <div className="text-xs text-slate-500 mt-1">{module.lessons.length} Lessons</div>
                       </div>
                     </div>
                     {/* Placeholder for expansion logic if needed */}
                     <div className="text-indigo-600 font-medium text-sm">View</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Tools Covered */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Tools & Technologies</h2>
            <div className="flex flex-wrap gap-3">
              {path.technologies.map((tech) => (
                <span key={tech} className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium shadow-sm">
                  {tech}
                </span>
              ))}
            </div>
          </section>

        </div>

        {/* Right Column: Sticky Sidebar Info */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
               <h3 className="text-lg font-bold text-slate-900 mb-4">This path includes:</h3>
               <ul className="space-y-4">
                 <li className="flex items-center gap-3 text-slate-600 text-sm">
                   <PlayCircle className="h-5 w-5 text-slate-400" />
                   <span>{path.totalDuration} on-demand video</span>
                 </li>
                 <li className="flex items-center gap-3 text-slate-600 text-sm">
                   <BookOpen className="h-5 w-5 text-slate-400" />
                   {/* FIX: Correctly reduce lesson count by using `.length` on the lessons array. */}
                   <span>{path.syllabus.reduce((acc, mod) => acc + mod.lessons.length, 0)} interactive lessons</span>
                 </li>
                 <li className="flex items-center gap-3 text-slate-600 text-sm">
                   <Terminal className="h-5 w-5 text-slate-400" />
                   <span>50+ hands-on labs</span>
                 </li>
                 <li className="flex items-center gap-3 text-slate-600 text-sm">
                   <Award className="h-5 w-5 text-slate-400" />
                   <span>Certificate of completion</span>
                 </li>
               </ul>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="text-xl font-bold mb-2">Train your team?</h3>
              <p className="text-indigo-100 text-sm mb-4">Get enterprise access for your entire organization.</p>
              <button className="w-full bg-white text-indigo-600 font-bold py-2 rounded-lg hover:bg-indigo-50 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LearningPathDetails;
