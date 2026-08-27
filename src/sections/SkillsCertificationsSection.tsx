import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { FadeIn } from '../components/FadeIn';
import { 
  Award, 
  Calendar, 
  ExternalLink, 
  X, 
  Zap, 
  Code, 
  Layers, 
  Database, 
  Terminal, 
  Sparkles, 
  GitBranch, 
  Search, 
  Palette, 
  Smartphone, 
  Cpu, 
  Globe, 
  Box, 
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  Wand2
} from 'lucide-react';

interface SkillVisual {
  icon: React.ReactNode;
  color: string;
  gradient: string;
  borderHover: string;
  glowColor: string;
  category: 'frontend' | 'backend' | 'tools' | 'ai';
  categoryLabel: string;
  level: string;
  percent: number;
}

function getSkillVisual(name: string): SkillVisual {
  const clean = name.toLowerCase().trim();

  if (clean.includes('react')) {
    return {
      icon: <Zap className="w-5 h-5 text-[#00d8ff]" />,
      color: '#00d8ff',
      gradient: 'from-[#00d8ff]/20 via-[#00d8ff]/5 to-transparent',
      borderHover: 'hover:border-[#00d8ff]/60 group-hover:border-[#00d8ff]/50',
      glowColor: 'rgba(0, 216, 255, 0.25)',
      category: 'frontend',
      categoryLabel: 'Frontend',
      level: 'Expert',
      percent: 95
    };
  }
  if (clean.includes('type') || clean.includes('ts')) {
    return {
      icon: <Terminal className="w-5 h-5 text-[#3178c6]" />,
      color: '#3178c6',
      gradient: 'from-[#3178c6]/20 via-[#3178c6]/5 to-transparent',
      borderHover: 'hover:border-[#3178c6]/60 group-hover:border-[#3178c6]/50',
      glowColor: 'rgba(49, 120, 198, 0.25)',
      category: 'frontend',
      categoryLabel: 'Language',
      level: 'Advanced',
      percent: 90
    };
  }
  if (clean.includes('tail') || clean.includes('css')) {
    return {
      icon: <Palette className="w-5 h-5 text-[#38bdf8]" />,
      color: '#38bdf8',
      gradient: 'from-[#38bdf8]/20 via-[#38bdf8]/5 to-transparent',
      borderHover: 'hover:border-[#38bdf8]/60 group-hover:border-[#38bdf8]/50',
      glowColor: 'rgba(56, 189, 248, 0.25)',
      category: 'frontend',
      categoryLabel: 'Styling',
      level: 'Mastery',
      percent: 98
    };
  }
  if (clean.includes('respon') || clean.includes('web') || clean.includes('design') || clean.includes('ui')) {
    return {
      icon: <Smartphone className="w-5 h-5 text-[#e879f9]" />,
      color: '#e879f9',
      gradient: 'from-[#e879f9]/20 via-[#e879f9]/5 to-transparent',
      borderHover: 'hover:border-[#e879f9]/60 group-hover:border-[#e879f9]/50',
      glowColor: 'rgba(232, 121, 249, 0.25)',
      category: 'frontend',
      categoryLabel: 'UI / UX',
      level: 'Mastery',
      percent: 96
    };
  }
  if (clean.includes('supa') || clean.includes('sql') || clean.includes('data') || clean.includes('mongo') || clean.includes('fire')) {
    return {
      icon: <Database className="w-5 h-5 text-[#3ecf8e]" />,
      color: '#3ecf8e',
      gradient: 'from-[#3ecf8e]/20 via-[#3ecf8e]/5 to-transparent',
      borderHover: 'hover:border-[#3ecf8e]/60 group-hover:border-[#3ecf8e]/50',
      glowColor: 'rgba(62, 207, 142, 0.25)',
      category: 'backend',
      categoryLabel: 'Backend & DB',
      level: 'Advanced',
      percent: 88
    };
  }
  if (clean.includes('git') || clean.includes('hub') || clean.includes('devops') || clean.includes('dock')) {
    return {
      icon: <GitBranch className="w-5 h-5 text-[#f97316]" />,
      color: '#f97316',
      gradient: 'from-[#f97316]/20 via-[#f97316]/5 to-transparent',
      borderHover: 'hover:border-[#f97316]/60 group-hover:border-[#f97316]/50',
      glowColor: 'rgba(249, 115, 22, 0.25)',
      category: 'tools',
      categoryLabel: 'Version Control',
      level: 'Advanced',
      percent: 92
    };
  }
  if (clean.includes('prompt') || clean.includes('ai') || clean.includes('llm') || clean.includes('gpt') || clean.includes('gemini')) {
    return {
      icon: <Sparkles className="w-5 h-5 text-[#a855f7]" />,
      color: '#a855f7',
      gradient: 'from-[#a855f7]/20 via-[#a855f7]/5 to-transparent',
      borderHover: 'hover:border-[#a855f7]/60 group-hover:border-[#a855f7]/50',
      glowColor: 'rgba(168, 85, 247, 0.25)',
      category: 'ai',
      categoryLabel: 'AI & Prompts',
      level: 'Specialist',
      percent: 94
    };
  }
  if (clean.includes('seo') || clean.includes('opt') || clean.includes('market') || clean.includes('rank') || clean.includes('speed')) {
    return {
      icon: <TrendingUp className="w-5 h-5 text-[#f59e0b]" />,
      color: '#f59e0b',
      gradient: 'from-[#f59e0b]/20 via-[#f59e0b]/5 to-transparent',
      borderHover: 'hover:border-[#f59e0b]/60 group-hover:border-[#f59e0b]/50',
      glowColor: 'rgba(245, 158, 11, 0.25)',
      category: 'ai',
      categoryLabel: 'Growth & SEO',
      level: 'Advanced',
      percent: 90
    };
  }
  if (clean.includes('next')) {
    return {
      icon: <Globe className="w-5 h-5 text-[#ffffff]" />,
      color: '#ffffff',
      gradient: 'from-white/20 via-white/5 to-transparent',
      borderHover: 'hover:border-white/60 group-hover:border-white/50',
      glowColor: 'rgba(255, 255, 255, 0.2)',
      category: 'frontend',
      categoryLabel: 'Full-Stack',
      level: 'Advanced',
      percent: 92
    };
  }
  if (clean.includes('node') || clean.includes('express')) {
    return {
      icon: <Layers className="w-5 h-5 text-[#84cc16]" />,
      color: '#84cc16',
      gradient: 'from-[#84cc16]/20 via-[#84cc16]/5 to-transparent',
      borderHover: 'hover:border-[#84cc16]/60 group-hover:border-[#84cc16]/50',
      glowColor: 'rgba(132, 204, 22, 0.25)',
      category: 'backend',
      categoryLabel: 'Runtime',
      level: 'Advanced',
      percent: 88
    };
  }
  if (clean.includes('3d') || clean.includes('gl') || clean.includes('three')) {
    return {
      icon: <Box className="w-5 h-5 text-[#f59e0b]" />,
      color: '#f59e0b',
      gradient: 'from-[#f59e0b]/20 via-[#f59e0b]/5 to-transparent',
      borderHover: 'hover:border-[#f59e0b]/60 group-hover:border-[#f59e0b]/50',
      glowColor: 'rgba(245, 158, 11, 0.25)',
      category: 'frontend',
      categoryLabel: '3D Graphics',
      level: 'Proficient',
      percent: 85
    };
  }

  // Fallback dynamic generator
  const colors = [
    { c: '#00d8ff', cat: 'frontend' as const, label: 'Frontend' },
    { c: '#3178c6', cat: 'frontend' as const, label: 'Development' },
    { c: '#a855f7', cat: 'ai' as const, label: 'Specialty' },
    { c: '#3ecf8e', cat: 'backend' as const, label: 'Database' },
    { c: '#f97316', cat: 'tools' as const, label: 'Tooling' },
    { c: '#ec4899', cat: 'frontend' as const, label: 'Creative' }
  ];
  const charSum = name.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const picked = colors[charSum % colors.length];

  return {
    icon: <Code className="w-5 h-5" style={{ color: picked.c }} />,
    color: picked.c,
    gradient: `from-[${picked.c}]/20 via-[${picked.c}]/5 to-transparent`,
    borderHover: `hover:border-[${picked.c}]/60 group-hover:border-[${picked.c}]/50`,
    glowColor: `${picked.c}40`,
    category: picked.cat,
    categoryLabel: picked.label,
    level: 'Advanced',
    percent: 88
  };
}

export function SkillsCertificationsSection() {
  const { data: skillsData } = usePortfolioData('skills');
  const { data: certsData } = usePortfolioData('certifications');
  const [selectedCert, setSelectedCert] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'frontend' | 'backend' | 'tools' | 'ai'>('all');

  const rawSkills = skillsData ? [...skillsData].sort((a, b) => (a.order_index || 0) - (b.order_index || 0)) : [];
  const certs = certsData ? [...certsData].sort((a, b) => (a.order_index || 0) - (b.order_index || 0)) : [];

  // Enrich skills with metadata
  const skillsWithMeta = useMemo(() => {
    return rawSkills.map(skill => ({
      ...skill,
      meta: getSkillVisual(skill.name)
    }));
  }, [rawSkills]);

  // Filter skills
  const filteredSkills = useMemo(() => {
    if (activeCategory === 'all') return skillsWithMeta;
    return skillsWithMeta.filter(s => s.meta.category === activeCategory);
  }, [skillsWithMeta, activeCategory]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedCert(null);
    };
    if (selectedCert) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCert]);

  const categories = [
    { id: 'all', label: 'All Stack', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'frontend', label: 'Frontend & UI', icon: <Zap className="w-3.5 h-3.5 text-[#00d8ff]" /> },
    { id: 'backend', label: 'Backend & Data', icon: <Database className="w-3.5 h-3.5 text-[#3ecf8e]" /> },
    { id: 'tools', label: 'Workflow & Tools', icon: <GitBranch className="w-3.5 h-3.5 text-[#f97316]" /> },
    { id: 'ai', label: 'AI & Optimization', icon: <Sparkles className="w-3.5 h-3.5 text-[#a855f7]" /> }
  ];

  return (
    <section id="skills-certifications" className="bg-[var(--bg-primary)] py-20 sm:py-28 md:py-32 px-5 sm:px-8 md:px-10 relative z-10 overflow-hidden">
      {/* Background Colorful Ambient Glows */}
      <div className="absolute top-1/4 left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/3 w-[450px] h-[450px] rounded-full bg-emerald-600/10 blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Section Header */}
        <FadeIn delay={0} y={30} className="w-full flex flex-col items-center text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 mb-5 backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.15)]">
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-purple-300">
              Technical Expertise & Credentials
            </span>
          </div>

          <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-center text-[clamp(2.5rem,9vw,90px)] mb-6">
            Skills & Mastery
          </h2>

          <p className="text-[var(--text-secondary)] text-sm sm:text-base md:text-lg max-w-2xl font-light">
            Engineered with modern standards, high-performance tooling, and deep-dive technical proficiency across the entire product lifecycle.
          </p>
        </FadeIn>

        {skillsWithMeta.length > 0 && (
          <div className="w-full flex flex-col items-center">
            
            {/* Category Filter Pills */}
            <FadeIn delay={0.1} y={20} className="w-full flex justify-center mb-10">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-1.5 rounded-2xl bg-[var(--bg-secondary)]/80 border border-white/10 backdrop-blur-md shadow-xl max-w-full">
                {categories.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id as any)}
                      className={`relative flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer select-none ${
                        isActive 
                          ? 'text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-[0_4px_16px_rgba(147,51,234,0.4)] border border-purple-400/40' 
                          : 'text-[var(--text-secondary)] hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      {cat.icon}
                      <span>{cat.label}</span>
                      {isActive && (
                        <motion.span
                          layoutId="activeFilterIndicator"
                          className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 -z-10 opacity-70"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </FadeIn>

            {/* Colorful Interactive Skills Grid */}
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full mb-16 sm:mb-20"
            >
              <AnimatePresence mode="popLayout">
                {filteredSkills.map((skill, index) => {
                  const meta = skill.meta;
                  return (
                    <motion.div
                      key={skill.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      transition={{ duration: 0.35, delay: index * 0.04 }}
                      whileHover={{ y: -6, transition: { duration: 0.2 } }}
                      className="group relative rounded-2xl p-5 sm:p-6 bg-[var(--bg-secondary)] border border-white/10 hover:border-white/25 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-2xl"
                      style={{
                        boxShadow: `0 10px 30px -10px rgba(0,0,0,0.5)`
                      }}
                    >
                      {/* Colorful Background Corner Ambient Halo on Hover */}
                      <div 
                        className="absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl opacity-20 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none"
                        style={{ backgroundColor: meta.color }}
                      />
                      
                      {/* Top Row: Icon + Category Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-110 shadow-md"
                          style={{ 
                            backgroundColor: `${meta.color}15`, 
                            borderColor: `${meta.color}40`,
                            boxShadow: `0 0 16px ${meta.glowColor}`
                          }}
                        >
                          {meta.icon}
                        </div>
                        <span 
                          className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-sm"
                          style={{ 
                            color: meta.color, 
                            backgroundColor: `${meta.color}10`,
                            borderColor: `${meta.color}30`
                          }}
                        >
                          {meta.categoryLabel}
                        </span>
                      </div>

                      {/* Middle: Skill Title & Level */}
                      <div className="mb-4">
                        <h3 className="text-[var(--text-primary)] font-bold text-lg sm:text-xl group-hover:text-white transition-colors flex items-center gap-2">
                          {skill.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: meta.color, boxShadow: `0 0 8px ${meta.color}` }} />
                          <span className="text-[var(--text-secondary)] text-xs font-medium">
                            {meta.level} Proficiency
                          </span>
                        </div>
                      </div>

                      {/* Bottom Progress Indicator Bar */}
                      <div className="w-full mt-auto pt-2 border-t border-white/5">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--text-secondary)] mb-1.5">
                          <span>Confidence</span>
                          <span style={{ color: meta.color }}>{meta.percent}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${meta.percent}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: 'easeOut', delay: 0.1 + index * 0.05 }}
                            className="h-full rounded-full"
                            style={{ 
                              background: `linear-gradient(90deg, ${meta.color}88, ${meta.color})`,
                              boxShadow: `0 0 8px ${meta.color}`
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* Quick Floating Highlights Banner */}
            <FadeIn delay={0.2} y={20} className="w-full max-w-4xl mb-16 sm:mb-20">
              <div className="rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-cyan-950/40 border border-purple-500/20 p-5 sm:p-7 backdrop-blur-md flex flex-wrap items-center justify-around gap-6 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm sm:text-base">Pixel-Perfect UI</h4>
                    <p className="text-[var(--text-secondary)] text-xs">Responsive & accessible designs</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm sm:text-base">Ultra Fast Performance</h4>
                    <p className="text-[var(--text-secondary)] text-xs">Optimized Core Web Vitals</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm sm:text-base">Clean Code Architecture</h4>
                    <p className="text-[var(--text-secondary)] text-xs">Maintainable & type-safe</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        )}

        {/* Certifications & Verified Credentials Subsection */}
        {certs.length > 0 && (
          <div className="w-full max-w-6xl flex flex-col items-center pt-8 border-t border-white/10">
            <FadeIn delay={0.2} className="w-full flex flex-col items-center text-center mb-10 sm:mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 mb-4 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-amber-300">
                  Verified Accreditations
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
                Certifications & Badges
              </h3>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 w-full">
              {certs.map((cert, i) => (
                <FadeIn key={cert.id} delay={i * 0.1} y={30} className="h-full">
                  <div 
                    className="group relative flex flex-col h-full rounded-[2rem] bg-[var(--bg-secondary)] border border-white/10 overflow-hidden hover:border-amber-500/40 transition-all duration-500 cursor-pointer shadow-xl hover:shadow-[0_15px_40px_rgba(245,158,11,0.15)] hover:-translate-y-2"
                    onClick={() => setSelectedCert(cert.image_url)}
                  >
                    {/* Image Container with Glow Preview */}
                    <div className="relative w-full aspect-[4/3] bg-black/40 overflow-hidden">
                      <img decoding="async" 
                        src={cert.image_url} 
                        alt={cert.title} 
                        loading="lazy"
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="translate-y-3 group-hover:translate-y-0 transition-transform duration-300 bg-amber-500/90 text-black rounded-full px-5 py-2.5 flex items-center gap-2 font-bold text-xs sm:text-sm shadow-xl">
                          <ExternalLink className="w-4 h-4" />
                          View Certificate
                        </div>
                      </div>

                      {/* Verified Badge Pin */}
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md border border-white/20 text-white rounded-full px-3 py-1 text-[11px] font-semibold flex items-center gap-1.5 shadow-lg">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Verified</span>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-6 sm:p-7 flex flex-col flex-grow bg-gradient-to-b from-[var(--bg-secondary)] to-[var(--bg-primary)]">
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <h4 className="text-[var(--text-primary)] font-bold text-lg sm:text-xl leading-snug group-hover:text-amber-300 transition-colors">
                          {cert.title}
                        </h4>
                        <div className="bg-amber-500/10 text-amber-400 p-2 rounded-xl shrink-0 border border-amber-500/20 shadow-inner">
                          <Award className="w-5 h-5" />
                        </div>
                      </div>
                      
                      <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4">
                        <p className="text-[var(--text-primary)] opacity-80 font-bold text-xs uppercase tracking-wider">
                          {cert.issuer}
                        </p>
                        {cert.issue_date && (
                          <p className="flex items-center gap-1.5 text-[var(--text-secondary)] text-xs font-medium">
                            <Calendar className="w-3.5 h-3.5 text-amber-400/80" />
                            {new Date(cert.issue_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
            onClick={() => setSelectedCert(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white hover:text-amber-400 transition-colors z-[101] bg-white/10 hover:bg-white/20 p-2.5 rounded-full border border-white/20 shadow-2xl cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedCert(null);
              }}
              aria-label="Close modal"
            >
              <X className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
            <motion.img decoding="async" 
              src={selectedCert}
              alt="Certificate Preview"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="max-w-[92vw] max-h-[85vh] object-contain rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/20"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

