import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FadeIn } from './FadeIn';
import { ThemeToggle } from './ThemeToggle';
import MagneticButton from './originkit/ui/magnetic-hover-button';
import { clearHomepageScrollPosition } from '../utils/scrollRestoration';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname === '/') {
      e.preventDefault();
      clearHomepageScrollPosition();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href.startsWith('/#')) {
      const targetId = href.replace('/#', '');
      if (location.pathname === '/') {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          window.history.pushState(null, '', `#${targetId}`);
        }
      } else {
        navigate(href);
      }
    } else {
      navigate(href);
    }
  };

  return (
    <FadeIn delay={0} y={-20} as="nav" className="flex justify-between items-center px-3 sm:px-6 md:px-10 pt-3.5 sm:pt-6 md:pt-8 relative z-40 w-full max-w-7xl mx-auto">
      <Link 
        to="/" 
        onClick={handleLogoClick}
        className="text-lg sm:text-xl md:text-2xl font-black tracking-tighter text-[var(--text-primary)] hover:opacity-80 transition-opacity shrink-0 mr-1.5 sm:mr-4"
      >
        JOY
      </Link>
      
      <div className="flex gap-1 sm:gap-2.5 md:gap-3.5 items-center">
        <MagneticButton
          label="About"
          link="/#about"
          onClick={(e) => handleNavClick(e, '/#about')}
          fill="transparent"
          textColor="var(--text-primary)"
          sweepColor="var(--text-primary)"
          sweepTextColor="var(--bg-primary)"
          border={true}
          borderOptions={{ color: 'rgba(215, 226, 234, 0.2)', width: 1 }}
          magnet={6}
          className="px-2 py-1 sm:px-3.5 sm:py-1.5 md:px-4 md:py-2 text-[11px] sm:text-xs md:text-sm font-semibold tracking-wider border border-[var(--text-primary)]/20 hover:border-[var(--text-primary)]/50 transition-colors"
        />

        <MagneticButton
          label="Projects"
          link="/#projects"
          onClick={(e) => handleNavClick(e, '/#projects')}
          fill="transparent"
          textColor="var(--text-primary)"
          sweepColor="var(--text-primary)"
          sweepTextColor="var(--bg-primary)"
          border={true}
          borderOptions={{ color: 'rgba(215, 226, 234, 0.2)', width: 1 }}
          magnet={6}
          className="px-2 py-1 sm:px-3.5 sm:py-1.5 md:px-4 md:py-2 text-[11px] sm:text-xs md:text-sm font-semibold tracking-wider border border-[var(--text-primary)]/20 hover:border-[var(--text-primary)]/50 transition-colors"
        />

        <MagneticButton
          label="Blog"
          link="/blog"
          onClick={(e) => handleNavClick(e, '/blog')}
          fill={location.pathname.startsWith('/blog') ? 'var(--text-primary)' : 'transparent'}
          textColor={location.pathname.startsWith('/blog') ? 'var(--bg-primary)' : 'var(--text-primary)'}
          sweepColor={location.pathname.startsWith('/blog') ? 'var(--text-highlight)' : 'var(--text-primary)'}
          sweepTextColor="var(--bg-primary)"
          border={true}
          borderOptions={{ color: location.pathname.startsWith('/blog') ? 'var(--text-primary)' : 'rgba(215, 226, 234, 0.2)', width: 1 }}
          magnet={6}
          className="px-2 py-1 sm:px-3.5 sm:py-1.5 md:px-4 md:py-2 text-[11px] sm:text-xs md:text-sm font-semibold tracking-wider border border-[var(--text-primary)]/20 hover:border-[var(--text-primary)]/50 transition-colors"
        />

        <MagneticButton
          label="Contact"
          link="/contact"
          onClick={(e) => handleNavClick(e, '/contact')}
          fill={location.pathname === '/contact' ? 'var(--text-primary)' : 'transparent'}
          textColor={location.pathname === '/contact' ? 'var(--bg-primary)' : 'var(--text-primary)'}
          sweepColor={location.pathname === '/contact' ? 'var(--text-highlight)' : 'var(--text-primary)'}
          sweepTextColor="var(--bg-primary)"
          border={true}
          borderOptions={{ color: location.pathname === '/contact' ? 'var(--text-primary)' : 'rgba(215, 226, 234, 0.2)', width: 1 }}
          magnet={6}
          className="px-2 py-1 sm:px-3.5 sm:py-1.5 md:px-4 md:py-2 text-[11px] sm:text-xs md:text-sm font-bold tracking-wider border border-[var(--text-primary)]/20 hover:border-[var(--text-primary)]/50 transition-colors"
        />

        <ThemeToggle className="ml-1 sm:ml-2" />
      </div>
    </FadeIn>
  );
}

