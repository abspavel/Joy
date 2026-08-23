import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useInView } from 'motion/react';
import { FadeIn } from '../components/FadeIn';
import { Navbar } from '../components/Navbar';
import { Magnet } from '../components/Magnet';
import { ContactButton } from '../components/ContactButton';
import { usePortfolioData } from '../hooks/usePortfolioData';
import RisingLinesVariant5 from '../components/originkit/ui/risinglines-variant-5';

function AnimatedHeroTitle({ text1 = "Hi, i'm ", text2 = "joy" }: { text1?: string, text2?: string }) {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.15 }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', damping: 14, stiffness: 100 }
    }
  };

  return (
    <motion.h1 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="hero-heading text-center whitespace-nowrap z-0 select-none text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw] mt-6 sm:mt-4 md:-mt-5 flex justify-center w-full"
    >
      <span className="text-[var(--text-primary)] flex mr-[2vw]">
        {text1.split('').map((char, index) => (
          <motion.span key={`text1-${index}`} variants={letterVariants} className="inline-block">
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </span>
      <motion.span 
        className="flex"
        style={{
          backgroundImage: 'linear-gradient(90deg, #B600A8, #7621B0, #BE4C00, #B600A8)',
          backgroundSize: '300% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          color: 'transparent'
        }}
        animate={{ backgroundPosition: ['0% center', '-300% center'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      >
        {text2.split('').map((char, index) => (
          <motion.span key={`text2-${index}`} variants={letterVariants} className="inline-block">
            {char}
          </motion.span>
        ))}
      </motion.span>
    </motion.h1>
  );
}

function EnhancedPortrait({ imageUrl = "/joy-photo-transparent.png" }: { imageUrl?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "100px" });
  const { scrollY } = useScroll();
  
  // Parallax + fade as user scrolls out of the hero section
  const pY = useTransform(scrollY, [0, 800], [0, 120]);
  const pScale = useTransform(scrollY, [0, 800], [1, 0.92]);
  const pOp = useTransform(scrollY, [0, 800], [1, 0.7]);

  const mX = useMotionValue(0);
  const mY = useMotionValue(0);
  
  // Smooth spring physics for mouse tilt
  const sX = useSpring(mX, { stiffness: 150, damping: 20 });
  const sY = useSpring(mY, { stiffness: 150, damping: 20 });
  
  // Proportional 3D tilt based on cursor offset (±6deg max)
  const rX = useTransform(sY, [-1, 1], [6, -6]); 
  const rY = useTransform(sX, [-1, 1], [-6, 6]);
  
  useEffect(() => {
    // Only apply mouse tracking on devices that support hover
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');

    const handleMouseMove = (e: MouseEvent) => {
      if (!mq.matches || !isInView) return;
      mX.set((e.clientX / window.innerWidth) * 2 - 1);
      mY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mX, mY, isInView]);

  return (
    <motion.div 
      style={{ y: pY, scale: pScale, opacity: pOp, perspective: 1000 }} 
      ref={ref} className="w-full pointer-events-none will-change-transform"
    >
      <motion.div 
        style={{ rotateX: rX, rotateY: rY, transformStyle: 'preserve-3d' }} 
        className="w-full will-change-transform"
      >
        <motion.div
          whileInView={{ y: [0, -10, 0], rotateY: [-4, 4, -4] }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            rotateY: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
          className="w-full will-change-transform"
        >
          <img
            src={imageUrl}
            alt="Joy - 3D Creator"
            loading="eager"
            fetchPriority="high"
            width="800"
            height="1000"
            className="w-full h-auto object-contain pointer-events-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
            style={{
              imageRendering: 'high-quality',
              WebkitFontSmoothing: 'antialiased',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden'
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function HeroSection() {
  const { data, loading } = usePortfolioData('hero_content');
  const heroData = data?.[0] || {};
  
  const portraitUrl = (heroData.portrait_image_url && heroData.portrait_image_url.trim() !== "") 
    ? heroData.portrait_image_url 
    : "/joy-photo-transparent.png";
    
  useEffect(() => {
    // Dynamically preload the portrait image to ensure it fetches as fast as possible
    if (portraitUrl && portraitUrl !== "/joy-photo-transparent.png") {
      const existingLink = document.querySelector(`link[href="${portraitUrl}"]`);
      if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = portraitUrl;
        document.head.appendChild(link);
      }
    }
  }, [portraitUrl]);
    
  const taglineText = (heroData.tagline_text && heroData.tagline_text.trim() !== "")
    ? heroData.tagline_text
    : "BUILDING CLEAN, MODERN, AND HIGH-PERFORMING WEBSITES THAT LEAVE AN IMPRESSION";
    
  const heading1 = heroData.heading_line1 || "Hi, i'm ";
  const heading2 = heroData.heading_line2 || "joy";

  return (
    <section className="h-[100dvh] flex flex-col overflow-x-clip relative">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <RisingLinesVariant5 />
      </div>
      {/* Navbar */}
      <Navbar />

      {/* Hero Heading */}
      <div className="flex-1 flex flex-col justify-center overflow-hidden z-20 relative pt-10 pointer-events-none">
        <FadeIn delay={0.1} y={0} className="absolute top-[10%] left-[4%] z-20 pointer-events-none hidden sm:block">
          <img src="/moon_icon.webp" width="160" height="160" style={{ aspectRatio: '1/1' }} className="w-[100px] md:w-[160px] opacity-80" alt="Moon" loading="eager" />
        </FadeIn>
        <FadeIn delay={0.15} y={0} className="absolute top-[8%] right-[4%] z-20 pointer-events-none hidden sm:block">
          <img src="/lego_icon.webp" width="150" height="150" style={{ aspectRatio: '1/1' }} className="w-[90px] md:w-[150px] opacity-80" alt="Lego" loading="eager" />
        </FadeIn>
        
        <div className="w-full relative z-10">
          <AnimatedHeroTitle text1={heading1} text2={heading2} />
        </div>
      </div>

      {/* Hero Portrait */}
      <Magnet
        padding={150}
        strength={3}
        className="absolute left-1/2 -translate-x-1/2 z-10 w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px] top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0 pointer-events-auto"
      >
        <FadeIn delay={0.6} y={30} className="w-full">
          <EnhancedPortrait imageUrl={portraitUrl} />
        </FadeIn>
      </Magnet>

      {/* Bottom Bar */}
      <div className="flex justify-between items-end pb-7 sm:pb-8 md:pb-10 px-6 md:px-10 relative z-20 pointer-events-auto">
        <FadeIn delay={0.35} y={20} className="max-w-[160px] sm:max-w-[220px] md:max-w-[260px]">
          <p className="text-[var(--text-primary)] font-light uppercase tracking-wide leading-snug text-[clamp(0.75rem,1.4vw,1.5rem)]">
            {taglineText}
          </p>
        </FadeIn>
        
        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
}
