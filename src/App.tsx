import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import React, { useEffect, Suspense } from 'react';
import Lenis from 'lenis';

import { HeroSection } from './sections/HeroSection';
import { AboutSection } from './sections/AboutSection';
import { ServicesSection } from './sections/ServicesSection';
import { FooterSection } from './sections/FooterSection';

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
const ServiceDetailPage = React.lazy(() => import('./pages/ServiceDetailPage').then(m => ({ default: m.ServiceDetailPage })));

function SectionSkeleton() {
  return (
    <div className="w-full h-[50vh] bg-[#0C0C0C] flex flex-col items-center justify-center gap-8 py-20">
      <div className="w-48 h-12 bg-[#D7E2EA]/10 rounded-xl animate-pulse" />
      <div className="w-full max-w-4xl h-64 bg-[#D7E2EA]/5 rounded-3xl animate-pulse" />
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="w-full h-screen bg-[#0C0C0C] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[#D7E2EA]/20 border-t-[#D7E2EA] animate-spin"></div>
    </div>
  );
}

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

function PublicSite() {
  return (
    <SmoothScroll>
      <main className="main-wrapper flex flex-col min-h-[100dvh] selection:bg-[#BBCCD7] selection:text-[#0C0C0C]">
        <HeroSection />
        <Suspense fallback={<SectionSkeleton />}>
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
