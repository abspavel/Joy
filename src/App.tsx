import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import React, { useEffect, Suspense } from 'react';
import Lenis from 'lenis';
import { useSEO } from './hooks/useSEO';
import { TopProgressBar } from './components/TopProgressBar';

import { HeroSection } from './sections/HeroSection';
import { AboutSection } from './sections/AboutSection';
import { ServicesSection } from './sections/ServicesSection';
import { FooterSection } from './sections/FooterSection';

// Lazy loaded sections
import { MarqueeSection } from './sections/MarqueeSection';
import { AchievementsSection } from './sections/AchievementsSection';
import { ImageCircleSection } from './sections/ImageCircleSection';
import { SkillsCertificationsSection } from './sections/SkillsCertificationsSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { TestimonialsSection } from './sections/TestimonialsSection';

// Lazy loaded pages/routes
const AdminRouter = React.lazy(() => import('./admin/AdminRouter').then(m => ({ default: m.AdminRouter })));
const ContactPage = React.lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const ServiceDetailPage = React.lazy(() => import('./pages/ServiceDetailPage').then(m => ({ default: m.ServiceDetailPage })));


function PageSkeleton() {
  return (
    <div className="w-full h-screen bg-[var(--bg-primary)] flex items-center justify-center">
      <TopProgressBar />
      <div className="w-8 h-8 rounded-full border-2 border-[var(--text-primary)]/20 border-t-[var(--text-primary)] animate-spin"></div>
    </div>
  );
}

function ScrollToTop() {
  const { pathname, hash, key } = useLocation();

  // Save scroll position for current location key
  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem(`scroll-${key}`, window.scrollY.toString());
    };
    
    // Throttle scroll saving slightly for performance
    let timeoutId: any;
    const throttledScroll = () => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        handleScroll();
        timeoutId = null;
      }, 100);
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [key]);
  
  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const scrollToHash = () => {
        const element = document.getElementById(id);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 100);
          return true;
        }
        return false;
      };

      if (!scrollToHash()) {
        const observer = new MutationObserver(() => {
          if (scrollToHash()) {
            observer.disconnect();
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => observer.disconnect(), 3000);
      }
    } else {
      // Check if we have a saved scroll position for this specific history key
      const savedPosition = sessionStorage.getItem(`scroll-${key}`);
      if (savedPosition) {
        // Wait a tick for rendering, then restore scroll
        setTimeout(() => {
          window.scrollTo(0, parseInt(savedPosition, 10));
        }, 50);
      } else {
        // New navigation without hash -> scroll to top
        window.scrollTo(0, 0);
      }
    }
  }, [pathname, hash, key]);
  
  return null;
}

// Lenis smooth scroll wrapper
function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}


function BelowTheFold() {
  return (
    <>
      <MarqueeSection />
      <AchievementsSection />
      <ImageCircleSection />
      <AboutSection />
      <SkillsCertificationsSection />
      <ServicesSection />
      <ProjectsSection />
      <TestimonialsSection />
      <FooterSection />
    </>
  );
}

function PublicSite() {
  const [activeSection, setActiveSection] = React.useState('Home');

  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      let maxRatio = 0;
      let mostVisibleId = '';
      
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          mostVisibleId = entry.target.id;
        }
      });
      
      if (mostVisibleId && maxRatio > 0) {
        const titleMap: Record<string, string> = {
          'projects': 'Projects',
          'about': 'About Me',
          'services': 'Services',
          'contact': 'Contact',
          'skills-certifications': 'Skills & Certifications'
        };
        const sectionName = titleMap[mostVisibleId] || mostVisibleId.charAt(0).toUpperCase() + mostVisibleId.slice(1);
        setActiveSection(sectionName);
      } else if (window.scrollY < 100) {
        setActiveSection('Home');
      }
    }, {
      threshold: [0.1, 0.3, 0.5, 0.7, 0.9]
    });

    const sections = document.querySelectorAll('section[id], footer[id]');
    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const title = activeSection === 'Home' 
    ? 'Joy -- 3D Creator' 
    : `${activeSection} | Joy -- 3D Creator`;
    
  useSEO({
    title,
    description: `View the ${activeSection} section of Joy's 3D Creator portfolio. Exploring 3D design, development, and more.`,
  });

  return (
    <SmoothScroll>
      <main className="main-wrapper flex flex-col min-h-[100dvh] selection:bg-[var(--text-highlight)] selection:text-[var(--bg-primary)]">
        <HeroSection />
        <BelowTheFold />
      </main>
    </SmoothScroll>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route path="/admin/*" element={<AdminRouter />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route path="*" element={<PublicSite />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
