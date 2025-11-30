import React, { useState } from 'react';
// Fix: Imported Clock from lucide-react for UI consistency.
import { Sparkles, ArrowRight, Loader2, Target, CheckCircle, Clock } from 'lucide-react';
import { generateLearningPath } from '../services/geminiService';
import { LearningPathResponse } from '../types';

const AILearningPathGenerator: React.FC = () => {
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [learningPath, setLearningPath] = useState<LearningPathResponse | null>(null);

  const handleGenerate = async () => {
    if (!goal.trim()) return;

    setLoading(true);
    setLearningPath(null);
    try {
      const result = await generateLearningPath(goal);
      setLearningPath(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="ai-advisor" className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative shadow-2xl">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-600 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-teal-500 rounded-full blur-3xl opacity-20"></div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 rounded-full text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="h-3 w-3" />
          <span>Powered by Gemini 2.5</span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Not sure where to start?</h2>
        <p className="text-indigo-200 mb-8 text-lg">
          Tell our AI Advisor what you want to become, and we'll design a custom learning path just for you.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mb-10">
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g. Full Stack Developer, Data Scientist..."
            className="flex-grow px-5 py-4 rounded-xl text-slate-900 bg-white border-2 border-transparent focus:border-indigo-400 focus:outline-none placeholder-slate-400 shadow-lg text-base"
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !goal.trim()}
            className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Generate Path'}
          </button>
        </div>

        {/* Results Section */}
        {learningPath && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 text-left border border-white/10 animate-fade-in">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Target className="h-6 w-6 text-teal-400" />
              Path to becoming a {learningPath.careerGoal}
            </h3>
            
            <div className="space-y-6">
              {learningPath.steps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-sm shadow-lg ring-2 ring-indigo-400/50">
                      {step.stepNumber}
                    </div>
                    {index !== learningPath.steps.length - 1 && (
                      <div className="w-0.5 flex-grow bg-indigo-500/30 my-2"></div>
                    )}
                  </div>
                  <div className="pb-2">
                    <h4 className="font-bold text-lg text-white mb-1">{step.title}</h4>
                    <p className="text-indigo-100 text-sm mb-2">{step.description}</p>
                    <div className="inline-flex items-center gap-1.5 text-xs text-teal-300 font-medium bg-teal-500/10 px-2 py-1 rounded">
                      {/* Fix: Replaced custom ClockIcon with Clock from lucide-react. */}
                      <Clock className="h-3 w-3" />
                      {step.estimatedDuration}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex justify-center">
              <button className="text-white bg-indigo-600 hover:bg-indigo-700 px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                Start Learning Now <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Fix: Removed unused custom ClockIcon component definition.

export default AILearningPathGenerator;