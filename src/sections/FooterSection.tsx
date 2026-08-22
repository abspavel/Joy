import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FadeIn } from '../components/FadeIn';
import { Magnet } from '../components/Magnet';
import { ContactButton } from '../components/ContactButton';
import { Github, Linkedin, Instagram, Twitter, ArrowUp, CheckCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const footerServices = [
  { name: 'Web Design', slug: 'web-design' },
  { name: 'Frontend Development', slug: 'frontend-development' },
  { name: 'Backend & API Development', slug: 'backend-api-development' },
  { name: 'E-commerce Development', slug: 'ecommerce-development' },
  { name: 'Website Maintenance & Optimization', slug: 'website-maintenance-optimization' }
];

export function FooterSection() {
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setSubscribeStatus('loading');
    
    // Simulate API call for subscription
    setTimeout(() => {
      setSubscribeStatus('success');
      setEmail('');
      setTimeout(() => setSubscribeStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <footer id="contact" className="bg-[var(--bg-primary)] px-5 sm:px-8 md:px-10 pt-20 sm:pt-28 md:pt-32 pb-8 relative z-10">
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
          <p className="text-[var(--text-primary)] font-light text-[clamp(1rem,1.5vw,1.2rem)] mb-10">
            Have a project in mind? Let's build something great.
          </p>
          <ContactButton />
        </FadeIn>
      </div>

      {/* 2. Main Footer Grid */}
      <div className="max-w-7xl mx-auto mt-20 sm:mt-24 md:mt-28 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
        
        {/* Column 1 - Brand */}
        <FadeIn delay={0.0} className="flex flex-col gap-4">
          <div className="text-xl md:text-2xl font-bold tracking-tighter text-[var(--text-primary)]">JOY</div>
          <p className="text-[var(--text-primary)] opacity-70 text-sm leading-relaxed max-w-[250px]">
            Pavel Ahmed Joy — a web developer building clean, modern, and high-performing websites.
          </p>
        </FadeIn>

        {/* Column 2 - Quick Links */}
        <FadeIn delay={0.1} className="flex flex-col gap-4">
          <h4 className="text-[var(--text-primary)] font-bold uppercase tracking-widest text-xs sm:text-sm mb-1">Quick Links</h4>
          {['About', 'Services', 'Projects'].map(link => (
            <a 
              key={link} 
              href={`#${link.toLowerCase()}`} 
              className="text-[var(--text-primary)] opacity-70 hover:opacity-100 transition-opacity uppercase tracking-wide text-xs sm:text-sm w-fit py-1"
            >
              {link}
            </a>
          ))}
        </FadeIn>

        {/* Column 3 - Services */}
        <FadeIn delay={0.2} className="flex flex-col gap-4">
          <h4 className="text-[var(--text-primary)] font-bold uppercase tracking-widest text-xs sm:text-sm mb-1">Services</h4>
          {footerServices.map(service => (
            <Link 
              key={service.name} 
              to={`/services/${service.slug}`}
              className="text-[var(--text-primary)] opacity-70 hover:opacity-100 transition-opacity text-xs sm:text-sm leading-snug block"
            >
              {service.name}
            </Link>
          ))}
        </FadeIn>

        {/* Column 4 - Contact & Social */}
        <FadeIn delay={0.3} className="flex flex-col gap-4">
          <h4 className="text-[var(--text-primary)] font-bold uppercase tracking-widest text-xs sm:text-sm mb-1">Contact</h4>
          <a href="mailto:hello@joy.dev" className="text-[var(--text-primary)] opacity-70 hover:opacity-100 transition-opacity text-xs sm:text-sm w-fit py-1">
            hello@joy.dev
          </a>
          <a href="tel:+8801835985730" className="text-[var(--text-primary)] opacity-70 hover:opacity-100 transition-opacity text-xs sm:text-sm w-fit py-1">
            +880 183 598 5730
          </a>
          <span className="text-[var(--text-primary)] opacity-70 text-xs sm:text-sm">
            Dhaka, Bangladesh
          </span>
          
          <div className="flex gap-4 mt-2">
            {[Github, Linkedin, Instagram, Twitter].map((Icon, i) => (
              <Magnet key={i} padding={20} strength={2}>
                <motion.a 
                  href="#" 
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 rounded-full border border-[var(--text-primary)]/20 flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-colors"
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
        <FadeIn delay={0.4} className="mt-16 sm:mt-20 bg-[var(--bg-secondary)] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-[var(--text-primary)]/5">
          <span className="text-[var(--text-primary)] font-medium text-[clamp(1rem,1.5vw,1.1rem)] text-center md:text-left">
            Get occasional updates on new projects
          </span>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
            <input 
              type="email" 
              placeholder="hello@joy.dev" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={subscribeStatus !== 'idle'}
              className="bg-transparent border border-[var(--text-primary)]/20 rounded-full px-5 py-3 text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--text-primary)]/50 w-full sm:w-64 placeholder:text-[var(--text-primary)]/30 transition-colors disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={subscribeStatus !== 'idle'}
              className="bg-transparent border-2 border-[var(--text-primary)] text-[var(--text-primary)] px-8 py-3 rounded-full uppercase text-xs font-bold tracking-widest hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-colors shrink-0 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[var(--text-primary)] min-w-[140px] flex items-center justify-center"
            >
              {subscribeStatus === 'loading' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : subscribeStatus === 'success' ? (
                <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Subscribed</span>
              ) : (
                'Subscribe'
              )}
            </button>
          </form>
        </FadeIn>
      </div>

      {/* 4. Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-16 sm:mt-20 pt-8 border-t border-[var(--text-primary)]/15 flex flex-col-reverse sm:flex-row justify-between items-center gap-6 relative">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-center sm:text-left">
          <span className="text-[var(--text-primary)] opacity-60 text-xs sm:text-sm">
            © 2026 Pavel Ahmed Joy. All rights reserved.
          </span>
          <span className="text-[var(--text-primary)] opacity-60 text-xs sm:text-sm hidden sm:block">
            •
          </span>
          <span className="text-[var(--text-primary)] opacity-80 text-xs sm:text-sm font-medium">
            Built with ❤️ by Joy
          </span>
        </div>

        <Magnet padding={30} strength={3}>
          <motion.button 
            onClick={scrollToTop}
            whileHover={{ scale: 1.1 }}
            className="w-12 h-12 rounded-full border border-[var(--text-primary)]/20 flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-colors cursor-pointer"
            aria-label="Back to top"
          >
            <ArrowUp size={20} />
          </motion.button>
        </Magnet>
      </div>
    </footer>
  );
}
