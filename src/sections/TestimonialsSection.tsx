import { useRef, useState, useEffect } from 'react';
import { motion, useAnimationFrame, useMotionValue, useInView, AnimatePresence } from 'motion/react';
import { FadeIn } from '../components/FadeIn';
import { Star, User } from 'lucide-react';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { Skeleton } from '../components/Skeleton';

function TestimonialCard({ item }: { item: any }) {
  return (
    <div className="flex flex-col justify-between w-[280px] sm:w-[340px] md:w-[380px] shrink-0 bg-[var(--bg-tertiary)] border border-[var(--text-primary)]/15 rounded-2xl p-6 sm:p-8 h-[280px] sm:h-[320px]">
      <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
        <div className="flex gap-1 text-[var(--text-primary)]">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`w-4 h-4 sm:w-5 sm:h-5 ${i < item.rating ? 'fill-[var(--text-primary)]' : 'text-gray-600'}`} />
          ))}
        </div>
        <p className="text-[var(--text-primary)] font-light leading-relaxed text-sm sm:text-base">"{item.review_text}"</p>
      </div>
      <div className="flex items-center gap-4 mt-6 pt-4 border-t border-[var(--text-primary)]/10 shrink-0">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-[var(--bg-primary)] flex-shrink-0 flex items-center justify-center border border-[var(--text-primary)]/10">
          {item.client_photo_url ? (
            <img src={item.client_photo_url} alt={item.client_name} loading="lazy" width="48" height="48" style={{ aspectRatio: '1/1' }} className="w-full h-full object-cover" />
          ) : (
            <User className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--text-primary)]/40" />
          )}
        </div>
        <div>
          <h4 className="text-[var(--text-primary)] font-medium uppercase text-xs sm:text-sm">{item.client_name}</h4>
          <p className="text-[var(--text-primary)]/60 text-[10px] sm:text-xs">{item.client_role}</p>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const { data: testimonialsData, loading } = usePortfolioData('testimonials');
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef);
  const [isHovered, setIsHovered] = useState(false);
  const [layoutMeasurements, setLayoutMeasurements] = useState({ 
    setWidth: 1000,
    repeats: 3
  });

  useEffect(() => {
    if (!testimonialsData || testimonialsData.length === 0) return;
    const updateMeasurements = () => {
      const screenW = window.innerWidth;
      let tileW = 280, gap = 20; // gap-5 = 20px
      if (screenW >= 768) { tileW = 380; gap = 24; }
      else if (screenW >= 640) { tileW = 340; gap = 24; }

      const setWidth = (tileW + gap) * testimonialsData.length;
      const requiredTrackWidth = screenW * 3;
      const repeats = Math.max(3, Math.ceil(requiredTrackWidth / setWidth) + 1);

      setLayoutMeasurements({ setWidth, repeats });
    };

    updateMeasurements();
    window.addEventListener('resize', updateMeasurements, { passive: true });
    return () => window.removeEventListener('resize', updateMeasurements);
  }, [testimonialsData]);

  const baseX = useMotionValue(0);
  const baseVelocity = -1; 
  
  useAnimationFrame((t, delta) => {
    if (!isInView || isHovered || !testimonialsData || testimonialsData.length === 0) return;
    let moveBy = (baseVelocity * delta) / 16; // approx 60fps normalization
    let newX = baseX.get() + moveBy;
    // When we've scrolled exactly one full set of items to the left, seamlessly snap back
    if (newX <= -layoutMeasurements.setWidth) {
      newX += layoutMeasurements.setWidth;
    }
    baseX.set(newX);
  });

  if (!loading && (!testimonialsData || testimonialsData.length === 0)) {
    return (
      <section className="bg-[var(--bg-primary)] px-5 sm:px-8 md:px-10 py-20 sm:py-28 md:py-32 flex flex-col items-center justify-center">
        <FadeIn delay={0.1} y={30}>
          <h2 className="hero-heading font-black uppercase text-center text-[clamp(2.5rem,10vw,100px)] mb-10">Client Reviews</h2>
        </FadeIn>
        <FadeIn delay={0.2} y={20}>
          <p className="text-[var(--text-primary)]/60 font-light text-center">No reviews yet.</p>
        </FadeIn>
      </section>
    );
  }

  const items = testimonialsData || [];

  const displayItems = Array(layoutMeasurements.repeats).fill(items).flat();

  return (
    <section ref={sectionRef} className="bg-[var(--bg-primary)] py-20 sm:py-28 md:py-32 overflow-hidden flex flex-col relative">
      <FadeIn delay={0} y={30} className="px-5 sm:px-8 md:px-10 mb-12 sm:mb-16 md:mb-20">
        <h2 className="hero-heading font-black uppercase text-center text-[clamp(2.5rem,10vw,100px)]">
          Client Reviews
        </h2>
      </FadeIn>

      <div 
        className="w-full relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
        }}
      >
        <motion.div 
          className="flex flex-nowrap w-max gap-5 sm:gap-6 items-stretch will-change-transform shrink-0 cursor-grab active:cursor-grabbing px-[10vw]"
          style={{ x: baseX }}
        >
          {displayItems.map((item, i) => (
            <TestimonialCard key={`testimonial-${item.id}-${i}`} item={item} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
