import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark'; // 'light' for dark backgrounds (footer), 'dark' for light backgrounds (navbar)
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ variant = 'dark', className = '' }) => {
  // Brand colors
  const certColor = '#00a0e3'; // Cyan Blue
  const kraftColor = '#3cb84d'; // Bright Green
  const iconGreen = '#3cb84d';
  const iconOrange = '#f58220'; // Orange
  
  // Subtitle color adjustment based on background
  const subtitleColor = variant === 'dark' ? '#64748b' : '#94a3b8';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Icon Mark */}
      <div className="relative w-10 h-10 flex-shrink-0">
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Green C-shape / Arc */}
          <path 
            d="M15 8C9 8 4 13 4 20C4 27 9 32 15 32" 
            stroke={iconGreen} 
            strokeWidth="4" 
            strokeLinecap="round"
          />
          {/* Orange Chevrons */}
          <path d="M15 12L21 20L15 28" stroke={iconOrange} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M22 12L28 20L22 28" stroke={iconOrange} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M29 12L35 20L29 28" stroke={iconOrange} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Text Wordmark */}
      <div className="flex flex-col leading-none justify-center">
        <div className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
          <span style={{ color: certColor }}>Cert</span>
          <span style={{ color: kraftColor }}>Kraft</span>
        </div>
        <div className="text-[0.65rem] uppercase tracking-wide font-semibold mt-0.5" style={{ color: subtitleColor }}>
          Certifications Online | Tech Labs
        </div>
      </div>
    </div>
  );
};

export default Logo;