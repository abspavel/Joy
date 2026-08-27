import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import React, { useEffect, Suspense } from 'react';
import Lenis from 'lenis';
import { useSEO } from './hooks/useSEO';
import { TopProgressBar } from './components/TopProgressBar';
import { ServiceDetailPage } from './pages/ServiceDetailPage';

import { HeroSection } from './sections/HeroSection';
const AboutSection = React.lazy(() => import('./sections/AboutSection').then(m => ({ default: m.AboutSection })));
const ServicesSection = React.lazy(() => import('./sections/ServicesSection').then(m => ({ default: m.ServicesSection })));
const FooterSection = React.lazy(() => import('./sections/FooterSection').then(m => ({ default: m.FooterSection })));

// Lazy loaded sections
const MarqueeSection = React.lazy(() => import('./sections/MarqueeSection').then(m => ({ default: m.MarqueeSection })));
const AchievementsSection = React.lazy(() => import('./sections/AchievementsSection').then(m => ({ default: m.AchievementsSection })));
const ImageCircleSection = React.lazy(() => import('./sections/ImageCircleSection').then(m => ({ default: m.ImageCircleSection })));
const SkillsCertificationsSection = React.lazy(() => import('./sections/SkillsCertificationsSection').then(m => ({ default: m.SkillsCertificationsSection })));
const ProjectsSection = React.lazy(() => import('./sections/ProjectsSection').then(m => ({ default: m.ProjectsSection })));
const TestimonialsSection = React.lazy(() => import('./sections/TestimonialsSection').then(m => ({ default: m.TestimonialsSection })));

// Lazy loaded pages/routes
const AdminRouter = React.lazy(() => import('./admin/AdminRouter').then(m => ({ default: m.AdminRouter })));
const ContactPage = React.lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));


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
    // Instant scroll restoration for seamless navigation
    const delay = hash ? 150 : 0;
    const timeout = setTimeout(() => {
      if (hash) {
        const id = hash.replace('#', '');
        const scrollToHash = () => {
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
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
        const savedPosition = sessionStorage.getItem(`scroll-${key}`);
        if (savedPosition) {
          window.scrollTo(0, parseInt(savedPosition, 10));
        } else {
          window.scrollTo(0, 0);
        }
      }
    }, delay);

    return () => clearTimeout(timeout);
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
    <Suspense fallback={<div style={{height: '100vh'}} />}>
      <MarqueeSection />
      <AchievementsSection />
      <ImageCircleSection />
      <AboutSection />
      <SkillsCertificationsSection />
      <ServicesSection />
      <ProjectsSection />
      <TestimonialsSection />
      <FooterSection />
    </Suspense>
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

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname} {...({} as any)}>
        <Route path="/admin/*" element={<AdminRouter />} />
        <Route path="/contact" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <ContactPage />
          </motion.div>
        } />
        <Route path="/services/:slug" element={
          <motion.div 
            initial={{ opacity: 0, y: 8 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -8 }} 
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <ServiceDetailPage />
          </motion.div>
        } />
        <Route path="*" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <PublicSite />
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <TopProgressBar />
      <Suspense fallback={<PageSkeleton />}>
        <AnimatedRoutes />
      </Suspense>
    </BrowserRouter>
  );
}
