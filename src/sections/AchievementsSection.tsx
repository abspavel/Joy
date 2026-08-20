import React, { useEffect, useState, useRef } from 'react';
import { useInView } from 'motion/react';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { FadeIn } from '../components/FadeIn';

const FALLBACK_STATS = [
  { id: '1', value: '250+', label: 'Projects Completed' },
  { id: '2', value: '5+', label: 'Years of Experience' },
  { id: '3', value: '50+', label: 'Happy Clients' },
  { id: '4', value: '98%', label: 'Client Satisfaction' },
];

function AnimatedNumber({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    // Match prefix, number (can be decimal), and suffix
    const match = value.match(/^(\D*)(\d+(?:\.\d+)?)(\D*)$/);
    if (!match) {
      setDisplayValue(value);
      return;
    }
    
    const [, prefix, numStr, suffix] = match;
    const target = parseFloat(numStr);

    if (inView) {
      let start = 0;
      const duration = 1500;
      let startTime: number | null = null;

      const update = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // easeOutExpo
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentNum = start + (target - start) * easeProgress;
        
        // keep integers as integers, preserve decimals if they exist
        const isDecimal = numStr.includes('.');
        const rounded = isDecimal ? currentNum.toFixed(1) : Math.round(currentNum).toString();
        
        setDisplayValue(`${prefix}${rounded}${suffix}`);

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };
      
      requestAnimationFrame(update);
    } else {
      setDisplayValue(`${prefix}0${suffix}`);
    }
  }, [value, inView]);

  return <span ref={ref}>{displayValue}</span>;
}

export function AchievementsSection() {
  const { data, loading } = usePortfolioData('achievements');
  
  // Sort by order_index if it exists
  const stats = data && data.length > 0 
    ? [...data].sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
    : FALLBACK_STATS;

  const count = stats.length;
  // Calculate dynamic grid columns (max 4 per row)
  const gridColsClasses = count === 1 ? 'md:grid-cols-1' 
    : count === 2 ? 'md:grid-cols-2' 
    : count === 3 ? 'md:grid-cols-3' 
    : 'md:grid-cols-4';

  return (
    <section className="bg-[#0C0C0C] px-5 sm:px-8 md:px-10 py-16 sm:py-20 md:py-24 border-none relative z-10">
      <div className={`max-w-5xl mx-auto grid grid-cols-2 ${gridColsClasses} gap-6 sm:gap-8 md:gap-10`}>
        {stats.map((stat, i) => {
          // Determine if we need a left border for desktop (not the first item in a row)
          const colsCount = count < 4 ? count : 4;
          const needsDivider = (i % colsCount) !== 0;

          return (
            <FadeIn key={stat.id} delay={i * 0.15} y={30} className="w-full">
              <div className={`flex flex-col items-center justify-center gap-2 text-center relative w-full h-full ${needsDivider ? 'md:border-l md:border-[#D7E2EA]/15' : ''}`}>
                <h3 className="hero-heading font-black tracking-tight leading-none text-[clamp(2.5rem,7vw,4.5rem)]">
                  <AnimatedNumber value={stat.value} />
                </h3>
                <p className="text-[#D7E2EA] font-light uppercase tracking-wide text-xs sm:text-sm md:text-base opacity-70">
                  {stat.label}
                </p>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
}
