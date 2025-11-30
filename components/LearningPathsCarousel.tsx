import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLearningPaths } from '../contexts/LearningPathContext';

const LearningPathsCarousel: React.FC = () => {
  const { paths } = useLearningPaths();
  
  // Only show Published paths, sorted by Order
  const displayPaths = useMemo(() => {
    return paths
      .filter(p => p.status === 'Published')
      .sort((a, b) => a.order - b.order);
  }, [paths]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Handle circular navigation
  const next = useCallback(() => {
    if (displayPaths.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % displayPaths.length);
  }, [displayPaths.length]);

  const prev = useCallback(() => {
    if (displayPaths.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + displayPaths.length) % displayPaths.length);
  }, [displayPaths.length]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || displayPaths.length === 0) return;

    const interval = setInterval(() => {
      next();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, next, displayPaths.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prev();
        setIsAutoPlaying(false);
      } else if (e.key === 'ArrowRight') {
        next();
        setIsAutoPlaying(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [next, prev]);

  // Determine styles for each card based on its position relative to active
  const getCardStyle = (index: number) => {
    const total = displayPaths.length;
    if (total === 0) return {};
    
    // Calculate shortest distance in a circle
    let offset = index - activeIndex;
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;

    // We only show a few cards: Center (0), and +/- 1, +/- 2
    // Hide others to prevent rendering issues or visual clutter
    if (Math.abs(offset) > 2) return { 
      opacity: 0, 
      pointerEvents: 'none' as const, 
      transform: 'translate(-50%, -50%) scale(0)',
      zIndex: 0,
      display: 'none' // Performance optimization
    };

    // 3D Transform Logic
    // Center: scale 1, x: 0
    // Neighbors: scale down, translate out, rotate Y
    
    const isActive = offset === 0;
    const absOffset = Math.abs(offset);
    const sign = Math.sign(offset);

    // Visual Constants
    const X_TRANSLATE = 60; // Percent
    const SCALE_STEP = 0.2;
    const ROTATE_Y = 45; // Degrees
    const Z_INDEX_BASE = 50;

    const scale = 1 - (absOffset * SCALE_STEP);
    const translateX = offset * X_TRANSLATE; 
    const rotateY = -sign * ROTATE_Y * (absOffset > 0 ? 1 : 0); // Rotate inward
    const zIndex = Z_INDEX_BASE - absOffset;
    const opacity = isActive ? 1 : 0.5;

    return {
      transform: `
        translate(-50%, -50%) 
        translateX(${translateX}%) 
        scale(${scale}) 
        perspective(1000px) 
        rotateY(${rotateY}deg)
      `,
      zIndex,
      opacity,
      transition: 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
    };
  };

  if (displayPaths.length === 0) {
    return (
        <div id="courses" className="py-24 bg-slate-950 text-center text-slate-500">
            No learning paths available. Check back soon!
        </div>
    );
  }

  return (
    <div id="courses" className="py-24 bg-slate-950 relative overflow-hidden flex flex-col items-center justify-center min-h-[700px]">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 pointer-events-none" />
      
      {/* Header */}
      <div className="text-center mb-16 relative z-10 px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">Explore Our Learning Paths</h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Swipe through our expert-curated roadmaps. From beginner to pro.
        </p>
      </div>

      {/* 3D Carousel Stage */}
      <div className="relative w-full max-w-6xl mx-auto h-[400px] flex items-center justify-center perspective-[2000px]">
        
        {/* Navigation Buttons (Left) */}
        <button 
          onClick={() => {
            prev();
            setIsAutoPlaying(false);
          }}
          className="absolute left-4 md:left-10 z-50 p-4 rounded-full bg-slate-800/50 text-white hover:bg-indigo-600 hover:scale-110 transition-all backdrop-blur-sm border border-slate-700 hover:border-indigo-500 shadow-xl"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>

        {/* Navigation Buttons (Right) */}
        <button 
          onClick={() => {
            next();
            setIsAutoPlaying(false);
          }}
          className="absolute right-4 md:right-10 z-50 p-4 rounded-full bg-slate-800/50 text-white hover:bg-indigo-600 hover:scale-110 transition-all backdrop-blur-sm border border-slate-700 hover:border-indigo-500 shadow-xl"
        >
          <ChevronRight className="h-8 w-8" />
        </button>

        {/* Cards */}
        {displayPaths.map((path, index) => {
          const style = getCardStyle(index);
          const isActive = index === activeIndex;

          return (
            <div
              key={path.id}
              onClick={() => {
                setActiveIndex(index);
                setIsAutoPlaying(false);
              }}
              className={`absolute top-1/2 left-1/2 w-[300px] md:w-[350px] h-[420px] rounded-2xl p-8 cursor-pointer
                ${isActive ? 'bg-slate-900 border-indigo-500/50 shadow-[0_0_50px_rgba(79,70,229,0.3)]' : 'bg-slate-900/80 border-slate-700 shadow-2xl'}
                border backdrop-blur-xl flex flex-col items-center justify-center text-center group
              `}
              style={style as React.CSSProperties}
            >
              {/* Glossy Overlay for "Glass" effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl pointer-events-none"></div>

              {/* Icon */}
              <div className={`w-20 h-20 rounded-2xl bg-slate-950 flex items-center justify-center mb-6 shadow-inner border border-slate-800 group-hover:scale-110 transition-transform duration-500
                 ${isActive ? 'ring-2 ring-indigo-500/30' : ''}
              `}>
                <path.icon className={`h-10 w-10 ${path.color}`} />
              </div>

              {/* Content */}
              <h3 className={`text-2xl font-bold mb-3 ${isActive ? 'text-white' : 'text-slate-300'}`}>
                {path.title}
              </h3>
              <p className={`text-sm leading-relaxed mb-6 ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                {path.desc}
              </p>

              {/* Decorative Number */}
              <div className="absolute top-4 right-4 text-xs font-mono text-slate-700">
                {String(index + 1).padStart(2, '0')}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Indicators */}
      <div className="flex justify-center gap-2 mt-12">
        {displayPaths.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setActiveIndex(i);
              setIsAutoPlaying(false);
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeIndex ? 'w-8 bg-indigo-500' : 'w-2 bg-slate-700 hover:bg-slate-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default LearningPathsCarousel;