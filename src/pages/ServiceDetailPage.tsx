import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { FadeIn } from '../components/FadeIn';
import { FooterSection } from '../sections/FooterSection';
import { ContactButton } from '../components/ContactButton';
import { Check, Loader2, ArrowLeft } from 'lucide-react';

export function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchService() {
      if (!slug) return;
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('slug', slug)
        .single();
        
      if (data) {
        setService(data);
      }
      setLoading(false);
    }
    fetchService();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] flex items-center justify-center text-[#D7E2EA]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] flex flex-col items-center justify-center text-[#D7E2EA] font-sans selection:bg-[#BBCCD7] selection:text-[#0C0C0C]">
        <h1 className="hero-heading font-black text-6xl mb-4 uppercase tracking-tighter">Service Not Found</h1>
        <p className="text-[#D7E2EA]/60 font-light mb-8">The service you are looking for doesn't exist.</p>
        <Link to="/#services" className="border border-[#D7E2EA]/20 px-6 py-2 rounded-full hover:bg-[#D7E2EA] hover:text-[#0C0C0C] transition-colors uppercase tracking-widest text-sm font-medium">
          Back to Services
        </Link>
      </div>
    );
  }

  const features = service.features || [];
  const processSteps = service.process_steps || [];

  return (
    <main className="bg-[#0C0C0C] min-h-screen flex flex-col font-sans selection:bg-[#BBCCD7] selection:text-[#0C0C0C]">
      {/* Navbar Reused */}
      <FadeIn delay={0} y={-20} as="nav" className="flex justify-between items-center px-6 md:px-10 pt-6 md:pt-8 relative z-40">
        <Link to="/" className="text-xl md:text-2xl font-bold tracking-tighter text-[#D7E2EA]">JOY</Link>
        <div className="flex gap-4 sm:gap-8 md:gap-12 items-center">
          {['About', 'Projects'].map((item) => (
            <a
              key={item}
              href={`/#${item.toLowerCase()}`}
              className="text-[#D7E2EA] font-medium uppercase tracking-wider text-xs sm:text-sm md:text-lg lg:text-[1.2rem] hover:opacity-70 transition-opacity duration-200"
            >
              {item}
            </a>
          ))}
          <Link
            to="/contact"
            className="text-[#D7E2EA] font-medium uppercase tracking-wider text-xs sm:text-sm md:text-lg lg:text-[1.2rem] hover:opacity-70 transition-opacity duration-200"
          >
            CONTACT
          </Link>
        </div>
      </FadeIn>

      <div className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-20">
        <FadeIn delay={0.1} y={20} className="mb-10">
          <Link to="/#services" className="inline-flex items-center gap-2 text-[#D7E2EA]/60 hover:text-[#D7E2EA] transition-colors text-sm uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> All Services
          </Link>
        </FadeIn>

        {/* Header */}
        <div className="mb-16 md:mb-24">
          <FadeIn delay={0.2} y={30}>
            <div className="text-[#D7E2EA]/60 font-medium uppercase tracking-widest text-sm md:text-base mb-2">
              SERVICE {service.number}
            </div>
            <h1 className="hero-heading font-black uppercase text-[clamp(2.5rem,10vw,120px)] leading-[0.9] tracking-tighter mb-8 max-w-5xl">
              {service.name}
            </h1>
          </FadeIn>
          
          <FadeIn delay={0.3} y={20}>
            <p className="text-[#D7E2EA] font-medium text-lg sm:text-xl md:text-2xl leading-relaxed max-w-4xl border-l-2 border-[#B600A8] pl-6">
              {service.description}
            </p>
          </FadeIn>
        </div>

        {/* Detailed Content */}
        {service.detailed_content && (
          <FadeIn delay={0.4} y={30} className="mb-20">
            <h3 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-[#D7E2EA] mb-6">Overview</h3>
            <p className="text-[#D7E2EA]/80 font-light text-base md:text-lg leading-relaxed max-w-3xl whitespace-pre-wrap">
              {service.detailed_content}
            </p>
          </FadeIn>
        )}

        {/* Features */}
        {features.length > 0 && (
          <FadeIn delay={0.5} y={30} className="mb-20">
            <h3 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-[#D7E2EA] mb-8">What's Included</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              {features.map((feature: string, idx: number) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-[#18011F] border border-[#B600A8]/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-[#B600A8]" />
                  </div>
                  <span className="text-[#D7E2EA]/80 font-light leading-snug">{feature}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        )}

        {/* Process */}
        {processSteps.length > 0 && (
          <div className="mb-24">
            <FadeIn delay={0.6} y={30} className="mb-8">
              <h3 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-[#D7E2EA]">The Process</h3>
            </FadeIn>
            <div className="space-y-8 max-w-4xl">
              {processSteps.map((step: {title: string, description: string}, idx: number) => (
                <FadeIn key={idx} delay={0.1 * idx} y={20} className="relative pl-10 md:pl-16">
                  {/* Vertical line indicator */}
                  {idx !== processSteps.length - 1 && (
                    <div className="absolute left-3.5 md:left-5 top-10 bottom-[-2rem] w-px bg-[#D7E2EA]/10"></div>
                  )}
                  <div className="absolute left-0 md:left-1 top-1.5 w-7 h-7 md:w-9 md:h-9 rounded-full bg-[#141414] border border-[#D7E2EA]/20 flex items-center justify-center text-xs md:text-sm font-bold text-[#D7E2EA]">
                    {idx + 1}
                  </div>
                  
                  <div className="bg-[#141414] border border-[#D7E2EA]/10 rounded-2xl p-6 md:p-8 hover:border-[#D7E2EA]/20 transition-colors">
                    <h4 className="text-lg md:text-xl font-medium uppercase tracking-wide text-[#D7E2EA] mb-3">{step.title}</h4>
                    <p className="text-[#D7E2EA]/70 font-light leading-relaxed">{step.description}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <FadeIn delay={0.7} y={30} className="bg-[#141414] border border-[#D7E2EA]/10 rounded-3xl p-10 md:p-16 flex flex-col items-center text-center max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-wide text-[#D7E2EA] mb-4">Ready to start?</h2>
          <p className="text-[#D7E2EA]/60 font-light mb-8 max-w-md">
            Let's discuss how my {service.name.toLowerCase()} services can help bring your vision to life.
          </p>
          <ContactButton>Get a Quote</ContactButton>
        </FadeIn>
      </div>

      <FooterSection />
    </main>
  );
}
