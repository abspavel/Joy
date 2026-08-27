import { useState, useEffect, useMemo, Suspense } from 'react';
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { DEFAULT_PORTFOLIO_DATA } from '../data/defaultPortfolioData';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { FadeIn } from '../components/FadeIn';
import { Navbar } from '../components/Navbar';
import { ContactButton } from '../components/ContactButton';
import { Check, ArrowLeft } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

const FooterSection = React.lazy(() => import('../sections/FooterSection').then(m => ({ default: m.FooterSection })));

function findServiceInList(slug: string | undefined, list: any[]) {
  if (!slug || !Array.isArray(list)) return null;
  const cleanSlug = slug.toLowerCase().trim();
  return list.find((item: any) => {
    if (!item) return false;
    const itemSlug = (item.slug || item.name?.toLowerCase()?.replace(/[^a-z0-9]+/g, '-') || '').toLowerCase();
    const itemNumber = (item.number || '').toString().toLowerCase();
    return itemSlug === cleanSlug || itemNumber === cleanSlug || item.id === cleanSlug;
  }) || null;
}

export function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: allServices } = usePortfolioData('services');

  // Immediately resolve service from in-memory cache or default bundled dataset
  const fallbackList = DEFAULT_PORTFOLIO_DATA.services || [];
  const initialResolvedService = useMemo(() => {
    return findServiceInList(slug, allServices) || findServiceInList(slug, fallbackList);
  }, [slug, allServices, fallbackList]);

  const [service, setService] = useState<any>(initialResolvedService);
  const [loading, setLoading] = useState<boolean>(!initialResolvedService);

  const serviceName = service ? (service.name || service.title || 'Creative Service') : 'Creative Service';
  const serviceDescription = service?.description || 'Custom 3D modeling, interactive web animations, WebGL experiences, and frontend engineering solutions.';
  const serviceImage = service?.image_url || '/joy-photo-transparent.png';
  const serviceFeatures = Array.isArray(service?.features) ? service.features : [];

  useSEO({
    title: service ? `${serviceName} | Creative 3D & Web Services` : 'Creative 3D & Web Services | Joy',
    description: serviceDescription,
    image: serviceImage,
    imageAlt: `${serviceName} Showcase`,
    type: 'website',
    twitterCard: 'summary_large_image',
    keywords: [
      serviceName,
      '3D Design Services',
      'WebGL Development',
      'Interactive Web Experiences',
      'Creative Frontend Services',
      'Blender Modeling',
      'Three.js Consulting',
      ...serviceFeatures
    ],
    structuredData: service ? {
      '@context': 'https://schema.org',
      '@type': 'Service',
      'name': serviceName,
      'description': serviceDescription,
      'provider': {
        '@type': 'Person',
        'name': 'Pavel Ahmed Joy',
        'jobTitle': '3D Creator & Frontend Engineer'
      },
      'areaServed': 'Worldwide',
      'hasOfferCatalog': {
        '@type': 'OfferCatalog',
        'name': `${serviceName} Deliverables`,
        'itemListElement': serviceFeatures.map((f: string, idx: number) => ({
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': f
          },
          'position': idx + 1
        }))
      }
    } : undefined
  });

  // Keep state in sync if data arrives from hook
  useEffect(() => {
    const matched = findServiceInList(slug, allServices) || findServiceInList(slug, fallbackList);
    if (matched) {
      setService(matched);
      setLoading(false);
    }
  }, [slug, allServices, fallbackList]);

  // Non-blocking background sync from Supabase
  useEffect(() => {
    let isMounted = true;
    async function syncLatestService() {
      if (!slug) return;
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .or(`slug.eq.${slug},id.eq.${slug}`)
          .single();
          
        if (isMounted && data) {
          setService(data);
        }
      } catch (err) {
        // Silent graceful fallback
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    syncLatestService();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (!service && loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center text-[var(--text-primary)]">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--text-primary)]/20 border-t-[var(--text-primary)] animate-spin" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center text-[var(--text-primary)] font-sans selection:bg-[var(--text-highlight)] selection:text-[var(--bg-primary)] px-4 text-center">
        <h1 className="hero-heading font-black text-4xl sm:text-6xl mb-4 uppercase tracking-tighter">Service Not Found</h1>
        <p className="text-[var(--text-primary)]/60 font-light mb-8 max-w-md">The service you are looking for does not exist or has been moved.</p>
        <Link to="/#services" className="border border-[var(--text-primary)]/20 px-6 py-2.5 rounded-full hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-colors uppercase tracking-widest text-xs sm:text-sm font-semibold">
          Back to All Services
        </Link>
      </div>
    );
  }

  const features = service.features || [
    "Custom UI/UX Design & Prototyping",
    "High-Performance Responsive Layouts",
    "Core Web Vitals & Speed Optimization",
    "Clean Code & Type-Safe Architecture"
  ];
  
  const processSteps = service.process_steps || [
    { title: "Discovery & Strategy", description: "In-depth consultation to understand your brand goals, target audience, and functional specifications." },
    { title: "Design & Prototyping", description: "Crafting wireframes and high-fidelity interactive prototypes with meticulous attention to detail." },
    { title: "Development & Testing", description: "Building with modern scalable frameworks, robust test coverage, and smooth micro-interactions." },
    { title: "Deployment & Support", description: "Launching to production with continuous monitoring, SEO configuration, and technical maintenance." }
  ];

  return (
    <main className="bg-[var(--bg-primary)] min-h-screen flex flex-col font-sans selection:bg-[var(--text-highlight)] selection:text-[var(--bg-primary)]">
      {/* Navbar Reused */}
      <Navbar />

      <div className="flex-1 w-full max-w-7xl mx-auto px-5 sm:px-8 md:px-10 pt-16 md:pt-24 pb-20">
        <FadeIn delay={0.05} y={15} className="mb-10">
          <Link to="/#services" className="inline-flex items-center gap-2 text-[var(--text-primary)]/60 hover:text-[var(--text-primary)] transition-colors text-xs sm:text-sm uppercase tracking-widest font-semibold">
            <ArrowLeft className="w-4 h-4" /> All Services
          </Link>
        </FadeIn>

        {/* Header */}
        <div className="mb-14 sm:mb-20 md:mb-24">
          <FadeIn delay={0.1} y={20}>
            <div className="text-[var(--text-primary)]/60 font-semibold uppercase tracking-widest text-xs sm:text-sm md:text-base mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              SERVICE {service.number || '01'}
            </div>
            <h1 className="hero-heading font-black uppercase text-[clamp(2.5rem,8vw,110px)] leading-[0.92] tracking-tighter mb-8 max-w-5xl">
              {service.name}
            </h1>
          </FadeIn>
          
          <FadeIn delay={0.15} y={20}>
            <p className="text-[var(--text-primary)] font-normal text-base sm:text-xl md:text-2xl leading-relaxed max-w-4xl border-l-2 border-purple-500 pl-5 sm:pl-7">
              {service.description}
            </p>
          </FadeIn>
        </div>

        {/* Detailed Content */}
        {service.detailed_content && (
          <FadeIn delay={0.2} y={20} className="mb-16 sm:mb-20">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-wider text-[var(--text-primary)] mb-5">
              Service Overview
            </h3>
            <p className="text-[var(--text-primary)]/80 font-light text-base sm:text-lg leading-relaxed max-w-3xl whitespace-pre-wrap">
              {service.detailed_content}
            </p>
          </FadeIn>
        )}

        {/* Features */}
        {features.length > 0 && (
          <FadeIn delay={0.25} y={20} className="mb-16 sm:mb-20">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-wider text-[var(--text-primary)] mb-6 sm:mb-8">
              What's Included
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl">
              {features.map((feature: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3.5 p-4 rounded-2xl bg-[var(--bg-secondary)] border border-white/5 shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-purple-500/15 border border-purple-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <span className="text-[var(--text-primary)]/90 font-medium text-sm sm:text-base leading-snug">{feature}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        )}

        {/* Process */}
        {processSteps.length > 0 && (
          <div className="mb-20 sm:mb-24">
            <FadeIn delay={0.3} y={20} className="mb-8">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-wider text-[var(--text-primary)]">
                The Process & Workflow
              </h3>
            </FadeIn>
            <div className="space-y-6 sm:space-y-8 max-w-4xl">
              {processSteps.map((step: {title: string, description: string}, idx: number) => (
                <FadeIn key={idx} delay={0.05 * idx} y={15} className="relative pl-9 sm:pl-14">
                  {/* Vertical line indicator */}
                  {idx !== processSteps.length - 1 && (
                    <div className="absolute left-3.5 sm:left-5 top-9 bottom-[-1.5rem] w-px bg-white/10" />
                  )}
                  <div className="absolute left-0 top-1 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-[var(--bg-secondary)] border border-purple-500/30 flex items-center justify-center text-xs sm:text-sm font-black text-purple-400 shadow-md">
                    {idx + 1}
                  </div>
                  
                  <div className="bg-[var(--bg-secondary)] border border-white/10 rounded-2xl p-5 sm:p-7 hover:border-purple-500/30 transition-colors shadow-sm">
                    <h4 className="text-base sm:text-lg font-bold uppercase tracking-wide text-[var(--text-primary)] mb-2">
                      {step.title}
                    </h4>
                    <p className="text-[var(--text-secondary)] font-normal text-xs sm:text-sm md:text-base leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <FadeIn delay={0.35} y={20} className="bg-[var(--bg-secondary)] border border-white/10 rounded-3xl p-8 sm:p-12 md:p-16 flex flex-col items-center text-center max-w-4xl mx-auto shadow-xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-[var(--text-primary)] mb-3">
            Ready to Build Something Extraordinary?
          </h2>
          <p className="text-[var(--text-secondary)] text-sm sm:text-base font-light mb-8 max-w-md">
            Let's discuss how {service.name.toLowerCase()} can elevate your product and business goals.
          </p>
          <ContactButton>Get a Quote</ContactButton>
        </FadeIn>
      </div>

      <Suspense fallback={<div className="h-40 bg-[var(--bg-secondary)]" />}>
        <FooterSection />
      </Suspense>
    </main>
  );
}
