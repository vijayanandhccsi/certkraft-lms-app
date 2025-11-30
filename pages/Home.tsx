import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Search, Loader2, Target, Clock, CheckCircle, Globe, Award, ShieldCheck, Terminal, Cpu, Database, Cloud, Lock, Play, ClipboardCheck, Layers, Trophy } from 'lucide-react';
import AILearningPathGenerator from '../components/AILearningPathGenerator';
import LearningPathsCarousel from '../components/LearningPathsCarousel';
import { LearningPathResponse } from '../types';
import { generateLearningPath } from '../services/geminiService';

// Tech Stack for Marquee
const TECH_STACK = [
  { name: 'AWS', icon: <Cloud className="h-6 w-6" /> },
  { name: 'Azure', icon: <Cloud className="h-6 w-6" /> },
  { name: 'Python', icon: <Terminal className="h-6 w-6" /> },
  { name: 'React', icon: <Cpu className="h-6 w-6" /> },
  { name: 'Docker', icon: <Database className="h-6 w-6" /> },
  { name: 'Kubernetes', icon: <Globe className="h-6 w-6" /> },
  { name: 'Terraform', icon: <Database className="h-6 w-6" /> },
  { name: 'Linux', icon: <Terminal className="h-6 w-6" /> },
  { name: 'CyberSec', icon: <ShieldCheck className="h-6 w-6" /> },
  { name: 'GenAI', icon: <Sparkles className="h-6 w-6" /> },
  { name: 'IoT', icon: <Cpu className="h-6 w-6" /> },
];

// Methodology Steps
const LEARNING_STEPS = [
  { id: 1, title: 'Interactive Course', description: 'Immersive video lessons with real-time feedback.', icon: Play },
  { id: 2, title: 'In-Course Assessments', description: 'Test your knowledge instantly with smart quizzes.', icon: ClipboardCheck },
  { id: 3, title: 'Hands-on Labs', description: 'Practice in real cloud environments, no setup required.', icon: Terminal },
  { id: 4, title: 'Learn by Doing Projects', description: 'Build real-world applications for your portfolio.', icon: Layers },
  { id: 5, title: 'Capstone Projects', description: 'Master the complete lifecycle with a final big project.', icon: Trophy },
];

const Home: React.FC = () => {
  const [learningPath, setLearningPath] = useState<LearningPathResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');

  const handleGeneratePath = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const result = await generateLearningPath(prompt);
      setLearningPath(result);
      // Smooth scroll to results
      setTimeout(() => {
        const resultsElement = document.getElementById('generated-path');
        if (resultsElement) resultsElement.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* INNOVATIVE HEADER SECTION */}
      <section className="relative min-h-[800px] flex flex-col justify-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-slate-950/80 z-10 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-900/60 z-10" />
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover opacity-60"
            poster="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1920&auto=format&fit=crop"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-monitor-close-up-1728-large.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-64 text-center">
          
          {/* Main Title with Animated Gradient */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 drop-shadow-2xl">
            Your Tech Career Starts Here — <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-400 to-indigo-500 animate-gradient-x">
              Learn, Practice, Get Certified.
            </span>
          </h1>

          {/* Subtext */}
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-300 mb-10 leading-relaxed font-light shadow-black drop-shadow-md">
            Master Cybersecurity, AWS, Azure, Cisco, and Palo Alto using real labs and bite-sized lessons built for fast, practical learning.
          </p>

          {/* AI Input Container - Glassmorphism */}
          <div className="max-w-2xl mx-auto relative group mb-12">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-xl blur opacity-30 group-hover:opacity-80 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-xl p-2 shadow-2xl">
              <div className="pl-4 text-cyan-400">
                <Sparkles className="h-6 w-6 animate-pulse" />
              </div>
              <input 
                type="text" 
                placeholder="I want to learn cloud computing / cyber security..."
                className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-slate-400 text-lg py-3 px-4"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGeneratePath()}
              />
              <button 
                onClick={handleGeneratePath}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white p-3 rounded-lg transition-all duration-200 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]"
              >
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <ArrowRight className="h-6 w-6" />}
              </button>
            </div>
            {/* Quick Pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              <span className="text-xs text-slate-400 uppercase tracking-widest mr-2 pt-1.5">Quick Start:</span>
              {['Cloud Computing', 'Cyber Security', 'Gen AI', 'IoT', 'DevOps'].map((tag) => (
                <button 
                  key={tag}
                  onClick={() => setPrompt(`I want to learn ${tag}`)}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 hover:bg-white/10 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-300 border border-white/10 transition-all backdrop-blur-sm"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Infinite Tech Marquee */}
        <div className="absolute bottom-0 left-0 right-0 bg-slate-950/80 border-t border-white/5 py-6 backdrop-blur-sm overflow-hidden z-20">
          <div className="flex items-center gap-12 animate-scroll whitespace-nowrap opacity-60 hover:opacity-100 transition-opacity duration-300">
            {/* Doubled for seamless loop */}
            {[...TECH_STACK, ...TECH_STACK, ...TECH_STACK].map((tech, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-300 font-medium hover:text-cyan-400 transition-colors cursor-default">
                <span className="text-cyan-500">{tech.icon}</span>
                {tech.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Generated Result Section (Conditional) */}
      {learningPath && (
        <section id="generated-path" className="py-16 bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4">
             <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-3xl p-8 shadow-lg">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl text-white shadow-md">
                    <Target className="h-8 w-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Your Personal Path: {learningPath.careerGoal}</h2>
                    <p className="text-slate-600">Generated by Certkraft AI Advisor</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {learningPath.steps.map((step, index) => (
                    <div key={index} className="flex gap-4 group">
                       <div className="flex flex-col items-center">
                         <div className="w-10 h-10 rounded-full bg-white border-2 border-indigo-200 text-indigo-700 font-bold flex items-center justify-center shadow-sm group-hover:border-indigo-500 group-hover:text-indigo-600 transition-colors">
                           {step.stepNumber}
                         </div>
                         {index !== learningPath.steps.length - 1 && (
                           <div className="w-0.5 h-full bg-indigo-100 my-2 group-hover:bg-indigo-200 transition-colors" />
                         )}
                       </div>
                       <div className="pb-8">
                         <h3 className="text-lg font-bold text-slate-800 mb-2">{step.title}</h3>
                         <p className="text-slate-600 leading-relaxed mb-3">{step.description}</p>
                         <div className="inline-flex items-center text-xs font-semibold text-indigo-600 bg-indigo-100 px-2.5 py-1 rounded-md">
                           <Clock className="h-3.5 w-3.5 mr-1" />
                           {step.estimatedDuration}
                         </div>
                       </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 pt-6 border-t border-indigo-200 flex justify-end">
                   <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 flex items-center gap-2">
                     Start This Path <ArrowRight className="h-4 w-4" />
                   </button>
                </div>
             </div>
          </div>
        </section>
      )}

      {/* NEW INNOVATIVE METHODOLOGY SECTION */}
      <section id="labs" className="py-[100px] bg-slate-950 relative overflow-hidden">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 z-0 opacity-15">
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>
        
        {/* Glowing Orb Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div id="assessments" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <span className="text-emerald-400 font-bold tracking-widest uppercase text-sm mb-3 block">Our Secret Sauce</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">5-Step Mastery</span> Engine
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              We've engineered the perfect learning loop. From your first line of code to your final certification.
            </p>
          </div>

          {/* The Pipeline Visual */}
          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-800 -translate-y-1/2 rounded-full overflow-hidden">
               {/* Animated Beam */}
               <div className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-emerald-400 to-transparent blur-sm animate-beam"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {LEARNING_STEPS.map((step, index) => (
                <div key={step.id} className="relative group">
                  
                  {/* Connector Dot (Desktop) */}
                  <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-slate-900 border-2 border-slate-700 rounded-full z-0 group-hover:border-emerald-400 group-hover:bg-emerald-400 transition-colors duration-300 shadow-[0_0_15px_rgba(52,211,153,0.5)]"></div>

                  {/* Card */}
                  <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl hover:bg-slate-800 transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl hover:shadow-emerald-500/10 group-hover:border-emerald-500/30 h-full flex flex-col items-center text-center relative z-10">
                    
                    {/* Step Number */}
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-xs font-bold text-slate-400 group-hover:bg-emerald-500 group-hover:text-slate-900 transition-colors border border-slate-700 group-hover:border-emerald-400">
                      0{step.id}
                    </div>

                    {/* Icon Container */}
                    <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center text-slate-400 mb-5 group-hover:scale-110 group-hover:from-emerald-500 group-hover:to-cyan-500 group-hover:text-white transition-all duration-500 shadow-lg ring-1 ring-slate-700 group-hover:ring-0">
                      <step.icon className="h-8 w-8" />
                    </div>

                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors">{step.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NEW LEARNING PATHS CAROUSEL */}
      <section>
        <LearningPathsCarousel />
        <div className="text-center pb-20 bg-slate-950">
            <Link to="/learning-paths" className="inline-flex items-center gap-2 text-indigo-400 font-semibold hover:text-white transition-colors group">
                View All Learning Paths 
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
      </section>
      
      {/* AI Advisor Section (Static Teaser) */}
      <section id="ai-advisor" className="py-16 bg-slate-950 text-white overflow-hidden border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
           <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-cyan-600 rounded-full blur-3xl opacity-10"></div>
           <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-600 rounded-full blur-3xl opacity-10"></div>
           
           <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
             <div>
               <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/20 px-3 py-1 rounded-full text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6">
                  <Sparkles className="h-3 w-3" />
                  <span>AI-Powered Learning</span>
               </div>
               <h2 className="text-4xl font-bold mb-6">Not just a course player.<br/>A career builder.</h2>
               <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                 Our Gemini-powered AI Advisor analyzes your goals to create a personalized curriculum. Stop guessing what to learn next.
               </p>
               <ul className="space-y-4 mb-8">
                 {[
                   'Personalized roadmap generation',
                   'Skill gap analysis',
                   'Real-time interview prep questions'
                 ].map((item, i) => (
                   <li key={i} className="flex items-center gap-3">
                     <CheckCircle className="h-5 w-5 text-emerald-400" />
                     <span className="text-slate-300">{item}</span>
                   </li>
                 ))}
               </ul>
             </div>
             <div className="relative">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative z-10">
                   <div className="flex items-center gap-4 mb-6 border-b border-slate-800 pb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-semibold">AI Advisor</div>
                        <div className="text-xs text-slate-400">Always online</div>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div className="bg-slate-800/50 rounded-lg p-3 rounded-tl-none text-sm text-slate-300">
                        Hello! I see you're interested in Cyber Security. Shall we start with Network Fundamentals or jump into Penetration Testing labs?
                      </div>
                      <div className="bg-indigo-600/20 border border-indigo-500/30 rounded-lg p-3 rounded-tr-none text-sm text-indigo-200 ml-auto max-w-[80%]">
                        I'd like to try the Penetration Testing labs, please.
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-3 rounded-tl-none text-sm text-slate-300">
                        Great choice! I've prepared a "Kali Linux Basics" lab for you. It will take about 45 minutes. Ready to deploy?
                      </div>
                   </div>
                   <button className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white py-2 rounded-lg font-medium transition-colors text-sm shadow-lg">
                     Try AI Advisor
                   </button>
                </div>
                {/* Decorative element behind card */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 transform rotate-3 scale-105 rounded-2xl opacity-10 -z-10 blur-sm"></div>
             </div>
           </div>
        </div>
      </section>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        @keyframes beam {
          0% { left: -20%; opacity: 0; }
          50% { opacity: 1; }
          100% { left: 120%; opacity: 0; }
        }
        .animate-beam {
          animation: beam 4s linear infinite;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Home;