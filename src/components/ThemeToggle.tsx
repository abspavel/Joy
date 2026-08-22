import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    // Check local storage or system preference on mount
    const savedTheme = localStorage.getItem('theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    
    if (savedTheme === 'light' || (!savedTheme && prefersLight)) {
      // By default it's dark, so we only need to activate light mode if explicitly set
      // Actually, user wants it to DEFAULT TO DARK, so we can ignore prefers-color-scheme
      // and only check savedTheme. Let's just default to dark unless savedTheme is 'light'.
    }
    
    if (savedTheme === 'light') {
      setIsLight(true);
      document.documentElement.classList.add('light');
    } else {
      setIsLight(false);
      document.documentElement.classList.remove('light');
    }
  }, []);

  const toggleTheme = () => {
    setIsLight(!isLight);
    if (!isLight) {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <button 
      onClick={toggleTheme}
      className="text-[var(--text-primary)] hover:opacity-70 transition-opacity duration-200 ml-2 md:ml-4 flex items-center justify-center"
      aria-label="Toggle theme"
    >
      {isLight ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
}
