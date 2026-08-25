import React from 'react';

interface LiveProjectButtonProps {
  onClick?: (e: React.MouseEvent) => void;
  label?: string;
  className?: string;
}

export function LiveProjectButton({ onClick, label = "View Project", className = "" }: LiveProjectButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={`rounded-full border-2 border-[var(--text-primary)] text-[var(--text-primary)] font-medium uppercase tracking-widest px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-all duration-300 shadow-sm cursor-pointer ${className}`}
    >
      {label}
    </button>
  );
}

