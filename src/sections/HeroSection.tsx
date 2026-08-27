import React, { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import { Layers, Terminal, Database, Zap, Box, Palette, Layout, ChevronDown } from 'lucide-react';
import { FadeIn } from '../components/FadeIn';
import { Navbar } from '../components/Navbar';
import { Magnet } from '../components/Magnet';
import { ContactButton } from '../components/ContactButton';
import { usePortfolioData } from '../hooks/usePortfolioData';
import RisingLinesVariant5 from '../components/originkit/ui/risinglines-variant-5';

interface FloatingBadgeProps {
  icon: ReactNode;
  label: string;
  badgeDotColor: string;
  delay?: number;
  animationClass: string;
  className: string;
}

function FloatingBadge({
  icon,
  label,
  badgeDotColor,
  delay = 0,
  animationClass,
  className
}: FloatingBadgeProps) {
  return (
    <motion.div
      className={`absolute z-30 pointer-events-auto select-none ${className}`}
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 220,
        damping: 16,
        mass: 0.8,
        delay: 0.2 + delay
      }}
    >
      <div className={animationClass}>
        <div 
          className="flex items-center gap-1 sm:gap-1.5 md:gap-2 px-1.5 py-0.5 sm:px-2.5 sm:py-1 md:px-3.5 md:py-1.5 rounded-full bg-[var(--bg-secondary)]/90 backdrop-blur-md border border-white/15 shadow-[0_6px_20px_rgba(0,0,0,0.35)] text-[var(--text-primary)] hover:border-white/40 hover:scale-110 transition-all duration-300 cursor-default"
        >
          <div className="flex items-center justify-center shrink-0">
            {icon}
          </div>
          <span className="text-[9px] sm:text-xs md:text-sm font-medium tracking-tight sm:tracking-wide whitespace-nowrap">
            {label}
          </span>
          <span 
            className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full shrink-0 animate-pulse"
            style={{ backgroundColor: badgeDotColor, boxShadow: `0 0 6px ${badgeDotColor}` }}
          />
        </div>
      </div>
    </motion.div>
  );
}

function AnimatedHeroTitle({ text1 = "Hi, i'm ", text2 = "joy" }: { text1?: string, text2?: string }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.15 }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', damping: 14, stiffness: 100 }
    }
  };

  const renderChar = (char: string, key: string, isGradient = false) => {
    if (char === ' ') return <span key={key}>{'\u00A0'}</span>;
    // Check all variants of commas and apostrophes / single quotes / primes
    const isPurplePunctuation = [',', "'", '’', '`', '‘', 'ʼ', '′', '´', 'ʻ', '‚', '՚'].includes(char);
    
    if (isPurplePunctuation) {
      return (
        <motion.span
          key={key}
          variants={letterVariants}
          style={{
            color: '#c084fc',
            WebkitTextFillColor: '#c084fc',
            background: 'none',
            WebkitBackgroundClip: 'unset',
            display: 'inline-block'
          }}
          className="inline-block text-[#c084fc] drop-shadow-[0_0_20px_rgba(192,132,252,1)] font-black mx-[0.5px]"
        >
          {char}
        </motion.span>
      );
    }

    if (isGradient) {
      return (
        <motion.span
          key={key}
          variants={letterVariants}
          className="inline-block"
          style={{
            backgroundImage: 'linear-gradient(90deg, #d946ef, #a855f7, #f43f5e, #d946ef)',
            backgroundSize: '300% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: 'transparent'
          }}
        >
          {char}
        </motion.span>
      );
    }

    return (
      <motion.span 
        key={key} 
        variants={letterVariants} 
        className="inline-block text-[var(--text-primary)]"
        style={{
          color: 'var(--text-primary)',
          WebkitTextFillColor: 'var(--text-primary)'
        }}
      >
        {char}
      </motion.span>
    );
  };

  return (
    <div className="relative inline-flex items-center justify-center mx-auto max-w-full">
      {/* Ambient background glow highlight */}
      <div 
        className="absolute -inset-x-8 -inset-y-4 rounded-full bg-gradient-to-r from-purple-600/20 via-fuchsia-500/15 to-indigo-600/20 blur-2xl pointer-events-none -z-10 animate-pulse" 
        style={{ animationDuration: '4s' }}
      />
      
      {/* Highlighted text container */}
      <div className="relative px-4 sm:px-8 py-1 sm:py-2.5 rounded-2xl sm:rounded-3xl bg-white/[0.04] border border-white/10 sm:border-white/15 shadow-[0_4px_35px_rgba(168,85,247,0.15)] backdrop-blur-[4px]">
        <motion.h1 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="font-black uppercase tracking-tight text-center whitespace-nowrap z-20 select-none text-[11vw] sm:text-[10vw] md:text-[8.5vw] lg:text-[7.5vw] xl:text-[7vw] flex justify-center items-center w-full leading-none"
        >
          <span className="flex mr-[1.5vw] drop-shadow-[0_2px_15px_rgba(0,0,0,0.5)]">
            {text1.split('').map((char, index) => renderChar(char, `text1-${index}`, false))}
          </span>
          <motion.span 
            className="flex drop-shadow-[0_2px_18px_rgba(168,85,247,0.4)]"
            animate={{ backgroundPosition: ['0% center', '-300% center'] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          >
            {text2.split('').map((char, index) => renderChar(char, `text2-${index}`, true))}
          </motion.span>
        </motion.h1>
      </div>
    </div>
  );
}

function ScrollDownIndicator() {
  const handleScroll = () => {
    const nextSection = document.getElementById('about') || document.querySelector('section:nth-of-type(2)');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  return (
    <motion.button
      onClick={handleScroll}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.8 }}
      className="flex flex-col items-center gap-1.5 cursor-pointer group focus:outline-none select-none transition-all duration-200"
      aria-label="Scroll down to view more content"
    >
      {/* Animated Mouse Icon */}
      <div className="w-5 h-8 sm:w-6 sm:h-9 rounded-full border-2 border-white/30 group-hover:border-purple-400/90 transition-colors flex justify-center pt-1.5 bg-[var(--bg-secondary)]/60 backdrop-blur-sm shadow-[0_2px_12px_rgba(0,0,0,0.3)]">
        <motion.div
          animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc]"
        />
      </div>

      {/* Label + Animated Chevron */}
      <div className="flex items-center gap-0.5 text-[9px] sm:text-[10px] font-semibold tracking-[0.22em] uppercase text-[var(--text-secondary)] group-hover:text-purple-300 transition-colors">
        <span>SCROLL</span>
        <motion.div
          animate={{ y: [0, 3, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-3 h-3 text-purple-400 group-hover:text-purple-300" />
        </motion.div>
      </div>
    </motion.button>
  );
}

function EnhancedPortrait({ imageUrl = "/joy-photo-transparent.png" }: { imageUrl?: string }) {
  const { scrollY } = useScroll();
  
  // Parallax + fade as user scrolls out of the hero section
  const pY = useTransform(scrollY, [0, 800], [0, 100]);
  const pScale = useTransform(scrollY, [0, 800], [1, 0.94]);
  const pOp = useTransform(scrollY, [0, 800], [1, 0.7]);

  const mX = useMotionValue(0);
  const mY = useMotionValue(0);
  
  // Smooth spring physics for mouse tilt
  const sX = useSpring(mX, { stiffness: 150, damping: 20 });
  const sY = useSpring(mY, { stiffness: 150, damping: 20 });
  
  // Proportional 3D tilt based on cursor offset (±5deg max)
  const rX = useTransform(sY, [-1, 1], [5, -5]); 
  const rY = useTransform(sX, [-1, 1], [-5, 5]);
  
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');

    const handleMouseMove = (e: MouseEvent) => {
      if (!mq.matches) return;
      mX.set((e.clientX / window.innerWidth) * 2 - 1);
      mY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mX, mY]);

  return (
    <motion.div 
      style={{ y: pY, scale: pScale, opacity: pOp, perspective: 1000 }} 
      className="w-full pointer-events-none will-change-transform"
    >
      <motion.div 
        style={{ rotateX: rX, rotateY: rY, transformStyle: 'preserve-3d' }} 
        className="w-full will-change-transform"
      >
        <motion.div
          whileInView={{ y: [0, -8, 0], rotateY: [-3, 3, -3] }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{
            y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
            rotateY: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
          className="w-full will-change-transform"
        >
          <img
            src={imageUrl}
            alt="Joy - 3D Creator & Full-Stack Developer"
            loading="eager"
            fetchPriority="high"
            width="800"
            height="1000"
            className="w-full max-h-[45vh] sm:max-h-[54vh] md:max-h-[60vh] h-auto object-contain pointer-events-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)]"
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
  const { data } = usePortfolioData('hero_content');
  const heroData = data?.[0] || {};
  
  const portraitUrl = (heroData.portrait_image_url && heroData.portrait_image_url.trim() !== "") 
    ? heroData.portrait_image_url 
    : "/joy-photo-transparent.png";
    
  useEffect(() => {
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
    <section className="min-h-[100dvh] flex flex-col justify-between overflow-x-clip relative">
      {/* Background Matrix/Rising lines effect */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <RisingLinesVariant5 
          horizonOpacity={40}
          opacity={60}
        />
      </div>

      {/* 1. Top Navbar */}
      <div className="relative z-30 w-full">
        <Navbar />
      </div>

      {/* 2. Distinct, Clean Upper Heading Section (No Overlap with Portrait) */}
      <div className="w-full relative z-20 pt-6 sm:pt-10 md:pt-14 pb-2 sm:pb-4 text-center pointer-events-none">
        <FadeIn delay={0.1} y={0} className="absolute top-2 left-[3%] z-20 pointer-events-none hidden lg:block">
          <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png" width="110" height="110" style={{ aspectRatio: '1/1' }} className="w-[70px] md:w-[110px] opacity-75" alt="Moon" loading="eager" fetchPriority="high" />
        </FadeIn>
        <FadeIn delay={0.15} y={0} className="absolute top-2 right-[3%] z-20 pointer-events-none hidden lg:block">
          <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png" width="100" height="100" style={{ aspectRatio: '1/1' }} className="w-[65px] md:w-[100px] opacity-75" alt="Lego" loading="eager" fetchPriority="high" />
        </FadeIn>
        
        <div className="w-full flex justify-center items-center px-4">
          <AnimatedHeroTitle text1={heading1} text2={heading2} />
        </div>
      </div>

      {/* 3. Center Section: Portrait with Surrounding Floating Tech Badges */}
      <div className="relative flex-1 flex items-center justify-center w-full px-2 sm:px-4 my-auto pointer-events-auto">
        <div className="relative w-[190px] sm:w-[280px] md:w-[360px] lg:w-[420px] flex justify-center items-center">
          
          {/* Floating Badges - Fluid Wind Floating Physics */}
          {/* Left Flank */}
          {/* Badge 1: React */}
          <FloatingBadge
            icon={<Layers className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-[#00d8ff]" />}
            label="React"
            badgeDotColor="#00d8ff"
            delay={0}
            animationClass="animate-float-1"
            className="-left-14 sm:-left-20 md:-left-28 lg:-left-32 top-[4%] sm:top-[6%]"
          />

          {/* Badge 2: Next.js */}
          <FloatingBadge
            icon={<Zap className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white" />}
            label="Next.js"
            badgeDotColor="#ffffff"
            delay={0.2}
            animationClass="animate-float-2"
            className="-left-16 sm:-left-24 md:-left-32 lg:-left-36 top-[38%] sm:top-[38%]"
          />

          {/* Badge 3: 3D & WebGL */}
          <FloatingBadge
            icon={<Box className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-[#f59e0b]" />}
            label="3D / WebGL"
            badgeDotColor="#f59e0b"
            delay={0.4}
            animationClass="animate-float-3"
            className="-left-14 sm:-left-20 md:-left-28 lg:-left-32 top-[72%] sm:top-[70%]"
          />

          {/* Right Flank */}
          {/* Badge 4: TypeScript */}
          <FloatingBadge
            icon={<Terminal className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-[#3178c6]" />}
            label="TypeScript"
            badgeDotColor="#3178c6"
            delay={0.1}
            animationClass="animate-float-4"
            className="-right-14 sm:-right-20 md:-right-28 lg:-right-32 top-[4%] sm:top-[6%]"
          />

          {/* Badge 5: Supabase */}
          <FloatingBadge
            icon={<Database className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-[#3ecf8e]" />}
            label="Supabase"
            badgeDotColor="#3ecf8e"
            delay={0.3}
            animationClass="animate-float-5"
            className="-right-16 sm:-right-24 md:-right-32 lg:-right-36 top-[38%] sm:top-[38%]"
          />

          {/* Badge 6: Tailwind */}
          <FloatingBadge
            icon={<Palette className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-[#38bdf8]" />}
            label="Tailwind"
            badgeDotColor="#38bdf8"
            delay={0.5}
            animationClass="animate-float-6"
            className="-right-14 sm:-right-20 md:-right-28 lg:-right-32 top-[72%] sm:top-[70%]"
          />

          {/* Badge 7: UI/UX Design (Bottom - only visible on tablet/desktop to keep mobile extra clean) */}
          <FloatingBadge
            icon={<Layout className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-[#a855f7]" />}
            label="UI/UX Design"
            badgeDotColor="#a855f7"
            delay={0.6}
            animationClass="animate-float-7"
            className="hidden sm:block left-1/2 -translate-x-1/2 -bottom-4 md:-bottom-6"
          />

          {/* Hero Portrait with Magnet Interaction */}
          <Magnet
            padding={120}
            strength={2.5}
            className="w-full flex justify-center"
          >
            <FadeIn delay={0.3} y={20} className="w-full flex justify-center">
              <EnhancedPortrait imageUrl={portraitUrl} />
            </FadeIn>
          </Magnet>
        </div>
      </div>

      {/* 4. Bottom Bar */}
      <div className="flex justify-between items-end pb-4 sm:pb-8 md:pb-10 px-4 sm:px-6 md:px-10 relative z-20 pointer-events-auto mt-auto gap-2">
        <FadeIn delay={0.35} y={20} className="max-w-[130px] sm:max-w-[220px] md:max-w-[280px]">
          <p className="text-[var(--text-primary)] font-light uppercase tracking-wide leading-snug text-[clamp(0.7rem,1.2vw,1.35rem)]">
            {taglineText}
          </p>
        </FadeIn>
        
        {/* Scroll Down Indicator in Center */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-3 sm:bottom-6 md:bottom-8 z-30 pointer-events-auto">
          <ScrollDownIndicator />
        </div>

        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>

      {/* Smooth bottom gradient overlay */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[20vh] min-h-[120px] max-h-[220px] z-10 pointer-events-none bg-gradient-to-b from-transparent to-[var(--bg-primary)]"
      />
    </section>
  );
}

