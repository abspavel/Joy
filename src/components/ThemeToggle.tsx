import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  id?: string;
}

export function ThemeToggle({ className = '', id }: ThemeToggleProps) {
  const [isLight, setIsLight] = useState<boolean>(false);

  useEffect(() => {
    // Initial sync
    const saved = localStorage.getItem('theme');
    const shouldBeLight = saved === 'light' || document.documentElement.classList.contains('light');
    setIsLight(shouldBeLight);
  }, []);

  const toggleTheme = () => {
    setIsLight((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('light');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.classList.remove('light');
        localStorage.setItem('theme', 'dark');
      }
      return next;
    });
  };

  return (
    <button
      id={id}
      onClick={toggleTheme}
      className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 ml-2 rounded-full border border-[var(--text-primary)]/30 hover:border-[var(--text-primary)]/70 bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-all duration-300 shadow-sm text-[var(--text-primary)] ${className}`}
      aria-label="Toggle Theme"
      title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
    >
      {isLight ? (
        <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
      ) : (
        <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
      )}
    </button>
  );
}
