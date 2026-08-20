import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';
import Lenis from 'lenis';

import { HeroSection } from './sections/HeroSection';
import { MarqueeSection } from './sections/MarqueeSection';
import { AchievementsSection } from './sections/AchievementsSection';
import { ImageCircleSection } from './sections/ImageCircleSection';
import { AboutSection } from './sections/AboutSection';
import { SkillsCertificationsSection } from './sections/SkillsCertificationsSection';
import { ServicesSection } from './sections/ServicesSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { TestimonialsSection } from './sections/TestimonialsSection';
import { FooterSection } from './sections/FooterSection';

import { AdminRouter } from './admin/AdminRouter';
import { ContactPage } from './pages/ContactPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // Only scroll to top if we're not using hash links on the home page
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);
  
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
      // Optional: you can set syncTouch: true to apply smooth scroll on touch, 
      // but native is often better. We'll stick to Lenis defaults for touch.
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}

function PublicSite() {
  return (
    <SmoothScroll>
      <main className="main-wrapper flex flex-col min-h-[100dvh] selection:bg-[#BBCCD7] selection:text-[#0C0C0C]">
        <HeroSection />
        <MarqueeSection />
        <AchievementsSection />
        <ImageCircleSection />
        <AboutSection />
        <SkillsCertificationsSection />
        <ServicesSection />
        <ProjectsSection />
        <TestimonialsSection />
        <FooterSection />
      </main>
    </SmoothScroll>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/admin/*" element={<AdminRouter />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/services/:slug" element={<ServiceDetailPage />} />
        <Route path="*" element={<PublicSite />} />
      </Routes>
    </BrowserRouter>
  );
}
