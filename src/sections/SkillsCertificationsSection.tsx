import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { FadeIn } from '../components/FadeIn';
import { Award, Calendar, ExternalLink, X } from 'lucide-react';

export function SkillsCertificationsSection() {
  const { data: skillsData } = usePortfolioData('skills');
  const { data: certsData } = usePortfolioData('certifications');
  const [selectedCert, setSelectedCert] = useState<string | null>(null);

  const skills = skillsData ? [...skillsData].sort((a, b) => (a.order_index || 0) - (b.order_index || 0)) : [];
  const certs = certsData ? [...certsData].sort((a, b) => (a.order_index || 0) - (b.order_index || 0)) : [];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedCert(null);
    };
    if (selectedCert) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCert]);

  // If both are empty and data has loaded, we could return null, but for now we render structure or just hide subsections.
  // We'll hide the whole section if both are empty after initial load check, but it's safe to just return section and empty if so.

  return (
    <section id="skills-certifications" className="bg-[var(--bg-primary)] py-20 sm:py-28 md:py-32 px-5 sm:px-8 md:px-10 relative z-10 border-none">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        <FadeIn delay={0} y={40} className="w-full">
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-center text-[clamp(2.5rem,10vw,100px)] mb-16 sm:mb-20 md:mb-24">
            Skills & Certifications
          </h2>
        </FadeIn>

        {skills.length > 0 && (
          <div className="w-full max-w-4xl flex flex-col items-center">
            <FadeIn delay={0.1}>
              <h3 className="text-[var(--text-primary)] font-medium uppercase tracking-wide text-center text-sm sm:text-base md:text-lg mb-8 sm:mb-10 opacity-80">
                Skills
              </h3>
            </FadeIn>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              {skills.map((skill, i) => (
                <FadeIn key={skill.id} delay={i * 0.05} y={20}>
                  <div className="rounded-full border border-[var(--text-primary)]/25 px-5 py-2 sm:px-6 sm:py-2.5 text-[var(--text-primary)] text-sm sm:text-base font-medium hover:bg-[var(--text-primary)]/10 hover:border-[var(--text-primary)]/50 transition-all duration-200 cursor-default">
                    {skill.name}
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        )}

        {certs.length > 0 && (
          <div className={`w-full max-w-6xl flex flex-col items-center ${skills.length > 0 ? 'mt-24 sm:mt-32' : ''}`}>
            <FadeIn delay={0.2} className="w-full flex justify-center mb-10 sm:mb-14">
              <div className="inline-flex items-center justify-center px-5 py-2 rounded-full border border-[var(--text-primary)]/20 bg-[var(--text-primary)]/5">
                <span className="text-[var(--text-primary)] font-semibold uppercase tracking-widest text-xs sm:text-sm">
                  Certifications & Licenses
                </span>
              </div>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 w-full">
              {certs.map((cert, i) => (
                <FadeIn key={cert.id} delay={i * 0.1} y={30} className="h-full">
                  <div 
                    className="group relative flex flex-col h-full rounded-[2rem] bg-[var(--bg-secondary)] border border-[var(--text-primary)]/10 overflow-hidden hover:border-[var(--text-primary)]/30 transition-all duration-500 cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-2"
                    onClick={() => setSelectedCert(cert.image_url)}
                  >
                    {/* Image Area */}
                    <div className="relative w-full aspect-[4/3] bg-[var(--bg-primary)] overflow-hidden">
                      <img decoding="async" 
                        src={cert.image_url} 
                        alt={cert.title} 
                        loading="lazy"
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="translate-y-4 group-hover:translate-y-0 transition-all duration-500 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full px-6 py-3 flex items-center gap-2 font-medium text-sm shadow-xl">
                          <ExternalLink className="w-4 h-4" />
                          View Full Certificate
                        </div>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-6 sm:p-8 flex flex-col flex-grow bg-gradient-to-b from-[var(--bg-secondary)] to-[var(--bg-tertiary)]">
                      <div className="flex items-start justify-between gap-4 mb-6">
                        <h4 className="text-[var(--text-primary)] font-bold text-lg sm:text-xl leading-snug">
                          {cert.title}
                        </h4>
                        <div className="bg-[var(--text-highlight)]/10 text-[var(--text-highlight)] p-2.5 rounded-full shrink-0">
                          <Award className="w-5 h-5" />
                        </div>
                      </div>
                      
                      <div className="mt-auto flex items-center justify-between border-t border-[var(--text-primary)]/10 pt-5">
                        <p className="text-[var(--text-primary)] opacity-70 font-bold text-sm uppercase tracking-wider">
                          {cert.issuer}
                        </p>
                        {cert.issue_date && (
                          <p className="flex items-center gap-1.5 text-[var(--text-primary)] opacity-50 text-xs font-medium">
                            <Calendar className="w-3.5 h-3.5" />
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
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedCert(null)}
          >
            <button 
              className="absolute top-6 right-6 text-[var(--text-primary)] hover:text-white transition-colors z-[101] bg-black/50 p-2 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedCert(null);
              }}
            >
              <X className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
            <motion.img decoding="async" 
              src={selectedCert}
              alt="Certificate Preview"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-2xl shadow-2xl pointer-events-none"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
