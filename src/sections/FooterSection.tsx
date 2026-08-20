import React from 'react';
import { motion } from 'motion/react';
import { FadeIn } from '../components/FadeIn';
import { Magnet } from '../components/Magnet';
import { ContactButton } from '../components/ContactButton';
import { Github, Linkedin, Instagram, Twitter, ArrowUp } from 'lucide-react';

export function FooterSection() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-[#0C0C0C] px-5 sm:px-8 md:px-10 pt-20 sm:pt-28 md:pt-32 pb-8 relative z-10">
      {/* 1. Big CTA Heading */}
      <div className="flex flex-col items-center text-center">
        <FadeIn delay={0} y={30} className="flex flex-col items-center w-full">
          <motion.h2 
            className="hero-heading font-black uppercase text-[clamp(2.5rem,10vw,120px)] leading-none mb-4"
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
            LET'S TALK
          </motion.h2>
          <p className="text-[#D7E2EA] font-light text-[clamp(1rem,1.5vw,1.2rem)] mb-10">
            Have a project in mind? Let's build something great.
          </p>
          <ContactButton />
        </FadeIn>
      </div>

      {/* 2. Main Footer Grid */}
      <div className="max-w-7xl mx-auto mt-20 sm:mt-24 md:mt-28 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
        
        {/* Column 1 - Brand */}
        <FadeIn delay={0.0} className="flex flex-col gap-4">
          <div className="text-xl md:text-2xl font-bold tracking-tighter text-[#D7E2EA]">JOY</div>
          <p className="text-[#D7E2EA] opacity-70 text-sm leading-relaxed max-w-[250px]">
            Pavel Ahmed Joy — a web developer building clean, modern, and high-performing websites.
          </p>
        </FadeIn>

        {/* Column 2 - Quick Links */}
        <FadeIn delay={0.1} className="flex flex-col gap-4">
          <h4 className="text-[#D7E2EA] font-bold uppercase tracking-widest text-xs sm:text-sm mb-1">Quick Links</h4>
          {['About', 'Services', 'Projects'].map(link => (
            <a 
              key={link} 
              href={`#${link.toLowerCase()}`} 
              className="text-[#D7E2EA] opacity-70 hover:opacity-100 transition-opacity uppercase tracking-wide text-xs sm:text-sm w-fit py-1"
            >
              {link}
            </a>
          ))}
        </FadeIn>

        {/* Column 3 - Services */}
        <FadeIn delay={0.2} className="flex flex-col gap-4">
          <h4 className="text-[#D7E2EA] font-bold uppercase tracking-widest text-xs sm:text-sm mb-1">Services</h4>
          {[
            'Web Design', 
            'Frontend Development', 
            'Backend & API Development', 
            'E-commerce Development', 
            'Website Maintenance & Optimization'
          ].map(service => (
            <span key={service} className="text-[#D7E2EA] opacity-70 text-xs sm:text-sm leading-snug cursor-default block">
              {service}
            </span>
          ))}
        </FadeIn>

        {/* Column 4 - Contact & Social */}
        <FadeIn delay={0.3} className="flex flex-col gap-4">
          <h4 className="text-[#D7E2EA] font-bold uppercase tracking-widest text-xs sm:text-sm mb-1">Contact</h4>
          <a href="mailto:hello@joy.dev" className="text-[#D7E2EA] opacity-70 hover:opacity-100 transition-opacity text-xs sm:text-sm w-fit py-1">
            hello@joy.dev
          </a>
          <a href="tel:+8801835985730" className="text-[#D7E2EA] opacity-70 hover:opacity-100 transition-opacity text-xs sm:text-sm w-fit py-1">
            +880 183 598 5730
          </a>
          <span className="text-[#D7E2EA] opacity-70 text-xs sm:text-sm">
            Dhaka, Bangladesh
          </span>
          
          <div className="flex gap-4 mt-2">
            {[Github, Linkedin, Instagram, Twitter].map((Icon, i) => (
              <Magnet key={i} padding={20} strength={2}>
                <motion.a 
                  href="#" 
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 rounded-full border border-[#D7E2EA]/20 flex items-center justify-center text-[#D7E2EA] hover:bg-[#D7E2EA] hover:text-[#0C0C0C] transition-colors"
                >
                  <Icon size={18} />
                </motion.a>
              </Magnet>
            ))}
          </div>
        </FadeIn>

      </div>

      {/* 3. Newsletter / Mini CTA */}
      <div className="max-w-7xl mx-auto">
        <FadeIn delay={0.4} className="mt-16 sm:mt-20 bg-[#181818] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-[#D7E2EA]/5">
          <span className="text-[#D7E2EA] font-medium text-[clamp(1rem,1.5vw,1.1rem)] text-center md:text-left">
            Get occasional updates on new projects
          </span>
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
            <input 
              type="email" 
              placeholder="hello@joy.dev" 
              className="bg-transparent border border-[#D7E2EA]/20 rounded-full px-5 py-3 text-[#D7E2EA] text-sm focus:outline-none focus:border-[#D7E2EA]/50 w-full sm:w-64 placeholder:text-[#D7E2EA]/30 transition-colors"
            />
            <button className="bg-transparent border-2 border-[#D7E2EA] text-[#D7E2EA] px-8 py-3 rounded-full uppercase text-xs font-bold tracking-widest hover:bg-[#D7E2EA] hover:text-[#0C0C0C] transition-colors shrink-0">
              Subscribe
            </button>
          </div>
        </FadeIn>
      </div>

      {/* 4. Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-16 sm:mt-20 pt-8 border-t border-[#D7E2EA]/15 flex flex-col-reverse sm:flex-row justify-between items-center gap-6 relative">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-center sm:text-left">
          <span className="text-[#D7E2EA] opacity-60 text-xs sm:text-sm">
            © 2026 Pavel Ahmed Joy. All rights reserved.
          </span>
          <span className="text-[#D7E2EA] opacity-60 text-xs sm:text-sm hidden sm:block">
            •
          </span>
          <span className="text-[#D7E2EA] opacity-80 text-xs sm:text-sm font-medium">
            Built with ❤️ by Joy
          </span>
          <span className="text-[#D7E2EA] opacity-60 text-xs sm:text-sm hidden sm:block">
            •
          </span>
          <a 
            href="/admin" 
            className="text-[#D7E2EA] opacity-60 hover:opacity-100 transition-opacity duration-200 text-xs uppercase tracking-wide"
          >
            Admin
          </a>
        </div>

        <Magnet padding={30} strength={3}>
          <motion.button 
            onClick={scrollToTop}
            whileHover={{ scale: 1.1 }}
            className="w-12 h-12 rounded-full border border-[#D7E2EA]/20 flex items-center justify-center text-[#D7E2EA] hover:bg-[#D7E2EA] hover:text-[#0C0C0C] transition-colors cursor-pointer"
            aria-label="Back to top"
          >
            <ArrowUp size={20} />
          </motion.button>
        </Magnet>
      </div>
    </footer>
  );
}
