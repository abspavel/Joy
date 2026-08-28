import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import React, { useEffect, Suspense } from 'react';
import Lenis from 'lenis';
import { useSEO, useSectionViewportSEO, SectionMetaConfig } from './hooks/useSEO';
import { TopProgressBar } from './components/TopProgressBar';

import { HeroSection } from './sections/HeroSection';
import { MarqueeSection } from './sections/MarqueeSection';
import { prefetchAllPortfolioData } from './hooks/usePortfolioData';

// Fire off the network request for marquee images immediately during module parsing
// so it's already fetching while Hero and App are rendering.
if (typeof window !== 'undefined') {
  
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => {
      prefetchAllPortfolioData(['marquee_images']);
    }, { timeout: 2000 });
  } else {
    setTimeout(() => {
      prefetchAllPortfolioData(['marquee_images']);
    }, 1000);
  }

}

const AboutSection = React.lazy(() => import('./sections/AboutSection').then(m => ({ default: m.AboutSection })));
const ServicesSection = React.lazy(() => import('./sections/ServicesSection').then(m => ({ default: m.ServicesSection })));
const FooterSection = React.lazy(() => import('./sections/FooterSection').then(m => ({ default: m.FooterSection })));

// Lazy loaded sections
const AchievementsSection = React.lazy(() => import('./sections/AchievementsSection').then(m => ({ default: m.AchievementsSection })));
const ImageCircleSection = React.lazy(() => import('./sections/ImageCircleSection').then(m => ({ default: m.ImageCircleSection })));
const SkillsCertificationsSection = React.lazy(() => import('./sections/SkillsCertificationsSection').then(m => ({ default: m.SkillsCertificationsSection })));
const ProjectsSection = React.lazy(() => import('./sections/ProjectsSection').then(m => ({ default: m.ProjectsSection })));
const TestimonialsSection = React.lazy(() => import('./sections/TestimonialsSection').then(m => ({ default: m.TestimonialsSection })));

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


function LazySection({ children, fallbackHeight = "100vh" }: { children: React.ReactNode, fallbackHeight?: string }) {
  const [inView, setInView] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, { rootMargin: '200px' });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ minHeight: inView ? 'auto' : fallbackHeight }}>
      {inView && <Suspense fallback={<div style={{ height: fallbackHeight }} />}>{children}</Suspense>}
    </div>
  );
}

function BelowTheFold() {
  return (
    <>
      <LazySection fallbackHeight="600px">
        <AchievementsSection />
      </LazySection>
      <LazySection fallbackHeight="800px">
        <ImageCircleSection />
      </LazySection>
      <LazySection fallbackHeight="100vh">
        <AboutSection />
      </LazySection>
      <LazySection fallbackHeight="100vh">
        <SkillsCertificationsSection />
      </LazySection>
      <LazySection fallbackHeight="100vh">
        <ServicesSection />
      </LazySection>
      <LazySection fallbackHeight="100vh">
        <ProjectsSection />
      </LazySection>
      <LazySection fallbackHeight="100vh">
        <TestimonialsSection />
      </LazySection>
      <LazySection fallbackHeight="500px">
        <FooterSection />
      </LazySection>
    </>
  );
}

const HOME_SECTIONS_SEO: SectionMetaConfig[] = [
  {
    id: 'hero',
    title: 'Joy -- 3D Creator & Frontend Developer',
    description: "Welcome to the portfolio of Pavel Ahmed Joy, a passionate 3D creator and frontend developer building interactive 3D web experiences, WebGL demos, and high-performance user interfaces.",
    keywords: ['Pavel Ahmed Joy', 'Joy 3D Creator', 'Interactive 3D Portfolio', 'WebGL Developer', 'Three.js Enthusiast', 'Frontend Engineer'],
  },
  {
    id: 'achievements',
    title: 'Milestones & Accomplishments | Joy -- 3D Creator',
    description: 'Track record of 250+ completed digital projects, 5+ years in professional web development, 50+ worldwide clients, and 98% client satisfaction rate.',
    keywords: ['250+ Projects', 'Years of Experience', 'Pavel Ahmed Joy Milestones', 'Client Success', 'Portfolio Stats'],
  },
  {
    id: 'about',
    title: 'About Pavel Ahmed Joy | 3D Creator & Web Developer',
    description: "Discover Pavel Ahmed Joy's creative background, philosophy, and expertise in crafting modern, high-performing websites and 3D visual experiences.",
    keywords: ['About Joy', 'Pavel Ahmed Joy Biography', '3D Artist', 'Creative Technologist', 'Web Developer'],
  },
  {
    id: 'skills-certifications',
    title: 'Skills & Technical Credentials | Joy -- 3D Creator',
    description: 'Technical proficiency in React, TypeScript, Three.js, WebGL, Blender, Tailwind CSS, API development, and verified developer certifications.',
    keywords: ['React Developer', 'TypeScript', 'Three.js 3D', 'WebGL Shader Art', 'Blender 3D Modeling', 'Technical Certifications'],
  },
  {
    id: 'services',
    title: 'Creative Services & Solutions | Joy -- 3D Creator',
    description: 'Professional services in 3D Web Design, Responsive Frontend Development, Backend & API Architectures, E-Commerce, and Website Performance Optimization.',
    keywords: ['3D Web Design Services', 'Frontend Development', 'WebGL Custom Experience', 'Fullstack Web Services', 'Web Performance'],
  },
  {
    id: 'projects',
    title: 'Selected Projects & Interactive Demos | Joy -- 3D Creator',
    description: 'Browse interactive 3D web applications, case studies, live previews, and design systems crafted by Pavel Ahmed Joy.',
    keywords: ['3D Projects', 'Interactive Web Demos', 'WebGL Showcase', 'Frontend Case Studies', 'Creative Web Portfolio'],
  },
  {
    id: 'testimonials',
    title: 'Client Reviews & Testimonials | Joy -- 3D Creator',
    description: 'Client testimonials, reviews, and feedback from founders, teams, and collaborators worldwide partnering with Joy.',
    keywords: ['Client Reviews', 'Joy Testimonials', 'Collaborations', 'Customer Satisfaction', 'Recommendations'],
  },
  {
    id: 'contact',
    title: 'Contact & Collaboration | Joy -- 3D Creator',
    description: 'Start a project or connect with Pavel Ahmed Joy for freelance 3D design, interactive development, and web inquiries.',
    keywords: ['Contact Joy', 'Hire 3D Developer', 'Freelance 3D Designer', 'Work Together'],
  },
];

function PublicSite() {
  // Base initial SEO with Schema.org Person, WebSite, and ProfessionalService structured data
  useSEO({
    title: 'Joy -- 3D Creator & Frontend Developer',
    description: 'Portfolio of Pavel Ahmed Joy, a passionate 3D creator and frontend developer building interactive 3D web experiences, WebGL demos, and modern UI/UX.',
    keywords: [
      'Pavel Ahmed Joy',
      'Joy 3D Creator',
      '3D Web Designer',
      'WebGL Developer',
      'Three.js',
      'React Developer',
      'Creative Technologist',
      'Blender Artist',
      'Interactive 3D Portfolio'
    ],
    image: '/joy-photo-transparent.png',
    imageAlt: 'Pavel Ahmed Joy - 3D Creator & Frontend Developer',
    type: 'website',
    twitterCard: 'summary_large_image',
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'Person',
        'name': 'Pavel Ahmed Joy',
        'alternateName': ['Joy', 'Pavel Joy'],
        'jobTitle': '3D Creator & Frontend Developer',
        'url': typeof window !== 'undefined' ? window.location.origin : 'https://joy.dev',
        'image': typeof window !== 'undefined' ? `${window.location.origin}/joy-photo-transparent.png` : '/joy-photo-transparent.png',
        'sameAs': [
          'https://github.com',
          'https://linkedin.com',
          'https://twitter.com',
          'https://instagram.com'
        ],
        'knowsAbout': [
          '3D Modeling',
          'WebGL',
          'Three.js',
          'React',
          'TypeScript',
          'Blender',
          'Frontend Engineering',
          'UI/UX Design'
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': 'Joy -- 3D Creator & Developer Portfolio',
        'url': typeof window !== 'undefined' ? window.location.origin : 'https://joy.dev',
        'author': {
          '@type': 'Person',
          'name': 'Pavel Ahmed Joy'
        }
      }
    ]
  });

  // Dynamically update SEO meta tags as user scrolls into different sections
  useSectionViewportSEO(HOME_SECTIONS_SEO, true);

  return (
    <SmoothScroll>
      <main className="main-wrapper flex flex-col min-h-[100dvh] selection:bg-[var(--text-highlight)] selection:text-[var(--bg-primary)]">
        <HeroSection />
        
        {/* Render Marquee immediately after Hero since it's directly visible. */}
        <LazySection fallbackHeight="400px"><MarqueeSection /></LazySection>

        <BelowTheFold />
      </main>
    </SmoothScroll>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <Routes location={location}>
      <Route path="/admin/*" element={<AdminRouter />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/services/:slug" element={<ServiceDetailPage />} />
      <Route path="*" element={<PublicSite />} />
    </Routes>
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
