import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import React, { useEffect, useLayoutEffect, Suspense } from 'react';
import Lenis from 'lenis';
import { useSEO, useSectionViewportSEO, SectionMetaConfig } from './hooks/useSEO';
import { TopProgressBar } from './components/TopProgressBar';
import { 
  getSavedHomepageScrollPosition, 
  restoreInstantScroll, 
  clearHomepageScrollPosition 
} from './utils/scrollRestoration';

// Disable default browser scroll restoration to prevent flicker and race conditions in SPA
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

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
const BlogSection = React.lazy(() => import('./sections/BlogSection').then(m => ({ default: m.BlogSection })));

// Lazy loaded pages/routes
const AdminRouter = React.lazy(() => import('./admin/AdminRouter').then(m => ({ default: m.AdminRouter })));
const ContactPage = React.lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const ServiceDetailPage = React.lazy(() => import('./pages/ServiceDetailPage').then(m => ({ default: m.ServiceDetailPage })));
const BlogListingPage = React.lazy(() => import('./pages/BlogListingPage').then(m => ({ default: m.BlogListingPage })));
const BlogPostPage = React.lazy(() => import('./pages/BlogPostPage').then(m => ({ default: m.BlogPostPage })));


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

  // Clear homepage scroll position when navigating to unrelated full pages (e.g. contact, blog, admin)
  useEffect(() => {
    if (pathname !== '/' && !pathname.startsWith('/services/')) {
      clearHomepageScrollPosition();
    }
  }, [pathname]);

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

  // Pre-paint synchronous restoration when returning to the homepage from a service page
  useLayoutEffect(() => {
    if (pathname === '/') {
      const savedHomepageY = getSavedHomepageScrollPosition();
      if (savedHomepageY !== null) {
        restoreInstantScroll(savedHomepageY);
      }
    }
  }, [pathname]);

  // Handle native browser back button (popstate)
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname === '/') {
        const savedHomepageY = getSavedHomepageScrollPosition();
        if (savedHomepageY !== null) {
          restoreInstantScroll(savedHomepageY);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  
  useEffect(() => {
    // If returning to homepage with a saved position from service, restore instantly and skip hash delay
    if (pathname === '/' && !hash) {
      const savedHomepageY = getSavedHomepageScrollPosition();
      if (savedHomepageY !== null) {
        restoreInstantScroll(savedHomepageY);
        requestAnimationFrame(() => {
          restoreInstantScroll(savedHomepageY);
        });
        return;
      }
    }

    // Standard navigation handling
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

    (window as any).__lenis = lenis;

    // Immediately sync with saved homepage scroll position if available
    const savedY = getSavedHomepageScrollPosition();
    if (savedY !== null) {
      lenis.scrollTo(savedY, { immediate: true, force: true });
    }

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      (window as any).__lenis = null;
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}

function LazySection({ 
  children, 
  fallbackHeight = "100vh",
  forceMount = false 
}: { 
  children: React.ReactNode; 
  fallbackHeight?: string;
  forceMount?: boolean;
}) {
  const [inView, setInView] = React.useState(forceMount);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (forceMount) {
      setInView(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, { rootMargin: '600px' });
    observer.observe(el);
    return () => observer.disconnect();
  }, [forceMount]);

  return (
    <div ref={ref} style={{ minHeight: inView || forceMount ? 'auto' : fallbackHeight }}>
      {(inView || forceMount) && <Suspense fallback={<div style={{ height: fallbackHeight }} />}>{children}</Suspense>}
    </div>
  );
}

function BelowTheFold() {
  const hasSavedScroll = typeof window !== 'undefined' && getSavedHomepageScrollPosition() !== null;
  const hasHash = typeof window !== 'undefined' && window.location.hash !== '';
  const shouldForceMount = hasSavedScroll || hasHash;

  return (
    <>
      <LazySection fallbackHeight="600px" forceMount={shouldForceMount}>
        <AchievementsSection />
      </LazySection>
      <LazySection fallbackHeight="800px" forceMount={shouldForceMount}>
        <ImageCircleSection />
      </LazySection>
      <LazySection fallbackHeight="100vh" forceMount={shouldForceMount}>
        <AboutSection />
      </LazySection>
      <LazySection fallbackHeight="100vh" forceMount={shouldForceMount}>
        <SkillsCertificationsSection />
      </LazySection>
      <LazySection fallbackHeight="100vh" forceMount={shouldForceMount}>
        <ServicesSection />
      </LazySection>
      <LazySection fallbackHeight="100vh" forceMount={shouldForceMount}>
        <ProjectsSection />
      </LazySection>
      <LazySection fallbackHeight="100vh" forceMount={shouldForceMount}>
        <TestimonialsSection />
      </LazySection>
      <LazySection fallbackHeight="600px" forceMount={shouldForceMount}>
        <BlogSection />
      </LazySection>
      <LazySection fallbackHeight="500px" forceMount={shouldForceMount}>
        <FooterSection />
      </LazySection>
    </>
  );
}

const HOME_SECTIONS_SEO: SectionMetaConfig[] = [
  {
    id: 'hero',
    title: 'Pavel Ahmed Joy — Web Developer | Clean, Modern, High-Performing Websites',
    description: "Welcome to the portfolio of Pavel Ahmed Joy, a web developer building clean, modern, and high-performing websites, e-commerce solutions, and user interfaces.",
    keywords: ['Pavel Ahmed Joy', 'Web Developer', 'Frontend Developer', 'React Developer', 'Full Stack Engineer'],
  },
  {
    id: 'achievements',
    title: 'Milestones & Accomplishments | Pavel Ahmed Joy — Web Developer',
    description: 'Track record of completed digital projects, professional web development experience, worldwide clients, and client satisfaction.',
    keywords: ['Projects', 'Years of Experience', 'Pavel Ahmed Joy Milestones', 'Client Success', 'Portfolio Stats'],
  },
  {
    id: 'about',
    title: 'About Pavel Ahmed Joy | Web Developer',
    description: "Discover Pavel Ahmed Joy's background, philosophy, and expertise in crafting modern, high-performing websites and web applications.",
    keywords: ['About Joy', 'Pavel Ahmed Joy Biography', 'Web Developer', 'Frontend Engineer', 'Full Stack'],
  },
  {
    id: 'skills-certifications',
    title: 'Skills & Technical Credentials | Pavel Ahmed Joy — Web Developer',
    description: 'Technical proficiency in React, TypeScript, Next.js, Node.js, Tailwind CSS, API development, and verified developer certifications.',
    keywords: ['React Developer', 'TypeScript', 'Next.js', 'Node.js', 'Tailwind CSS', 'Technical Certifications'],
  },
  {
    id: 'services',
    title: 'Web Development Services & Solutions | Pavel Ahmed Joy — Web Developer',
    description: 'Professional services in Responsive Frontend Development, Backend & API Architectures, E-Commerce, and Website Performance Optimization.',
    keywords: ['Web Design Services', 'Frontend Development', 'Backend Solutions', 'Fullstack Web Services', 'Web Performance'],
  },
  {
    id: 'projects',
    title: 'Selected Projects & Case Studies | Pavel Ahmed Joy — Web Developer',
    description: 'Browse web applications, e-commerce sites, case studies, live previews, and design systems crafted by Pavel Ahmed Joy.',
    keywords: ['Web Projects', 'React Applications', 'Frontend Case Studies', 'E-commerce Portfolio', 'Creative Web Portfolio'],
  },
  {
    id: 'testimonials',
    title: 'Client Reviews & Testimonials | Pavel Ahmed Joy — Web Developer',
    description: 'Client testimonials, reviews, and feedback from founders, teams, and collaborators worldwide partnering with Joy.',
    keywords: ['Client Reviews', 'Joy Testimonials', 'Collaborations', 'Customer Satisfaction', 'Recommendations'],
  },
  {
    id: 'blog',
    title: 'Latest Articles & Technical Insights | Pavel Ahmed Joy — Web Developer',
    description: 'Articles and case studies covering web development, React architecture, backend APIs, performance optimization, and UI engineering by Pavel Ahmed Joy.',
    keywords: ['Tech Articles', 'Web Performance', 'React Blog', 'Frontend Insights', 'Backend Engineering'],
  },
  {
    id: 'contact',
    title: 'Contact & Collaboration | Pavel Ahmed Joy — Web Developer',
    description: 'Start a project or connect with Pavel Ahmed Joy for freelance web development, engineering, and web inquiries.',
    keywords: ['Contact Joy', 'Hire Web Developer', 'Freelance React Developer', 'Work Together'],
  },
];

function PublicSite() {
  // Base initial SEO with Schema.org Person, WebSite, and ProfessionalService structured data
  useSEO({
    title: 'Pavel Ahmed Joy — Web Developer | Clean, Modern, High-Performing Websites',
    description: 'Portfolio of Pavel Ahmed Joy, a web developer specializing in frontend development, backend & API development, e-commerce solutions, and modern responsive web design.',
    keywords: [
      'Pavel Ahmed Joy',
      'Web Developer',
      'Frontend Developer',
      'React Developer',
      'Next.js',
      'Web Design',
      'E-commerce Development',
      'Backend Development',
      'Full Stack Developer'
    ],
    image: '/joy-photo-transparent.png',
    imageAlt: 'Pavel Ahmed Joy - Web Developer',
    type: 'website',
    twitterCard: 'summary_large_image',
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'Person',
        'name': 'Pavel Ahmed Joy',
        'alternateName': ['Joy', 'Pavel Joy'],
        'jobTitle': 'Web Developer',
        'url': typeof window !== 'undefined' ? window.location.origin : 'https://joy.dev',
        'image': typeof window !== 'undefined' ? `${window.location.origin}/joy-photo-transparent.png` : '/joy-photo-transparent.png',
        'sameAs': [
          'https://github.com',
          'https://linkedin.com',
          'https://twitter.com',
          'https://instagram.com'
        ],
        'knowsAbout': [
          'Web Development',
          'Frontend Engineering',
          'Backend Development',
          'React',
          'TypeScript',
          'Next.js',
          'E-commerce Development',
          'UI/UX Design'
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': 'Pavel Ahmed Joy — Web Developer',
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

  // Synchronously restore scroll position before initial paint
  useLayoutEffect(() => {
    const savedY = getSavedHomepageScrollPosition();
    if (savedY !== null) {
      restoreInstantScroll(savedY);
    }
  }, []);

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
      <Route path="/blog" element={<BlogListingPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
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
