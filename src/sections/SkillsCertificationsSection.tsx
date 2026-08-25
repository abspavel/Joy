import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { FadeIn } from '../components/FadeIn';
import { X } from 'lucide-react';

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
          <div className={`w-full max-w-4xl flex flex-col items-center ${skills.length > 0 ? 'mt-16 sm:mt-20 md:mt-24' : ''}`}>
            <FadeIn delay={0.2}>
              <h3 className="text-[var(--text-primary)] font-medium uppercase tracking-wide text-center text-sm sm:text-base md:text-lg mb-8 sm:mb-10 opacity-80">
                Certifications
              </h3>
            </FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 w-full">
              {certs.map((cert, i) => (
                <FadeIn key={cert.id} delay={i * 0.1} y={30} className="h-full">
                  <div 
                    className="flex flex-col h-full rounded-2xl border border-[var(--text-primary)]/15 overflow-hidden hover:-translate-y-1 transition-transform duration-300 cursor-pointer bg-[var(--bg-tertiary)]"
                    onClick={() => setSelectedCert(cert.image_url)}
                  >
                    <div className="w-full aspect-[4/3] bg-black/50 overflow-hidden">
                      <img 
                        src={cert.image_url} 
                        alt={cert.title} 
                        loading="lazy"
                        width="800"
                        height="600"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <div className="p-5 flex flex-col gap-1">
                      <h4 className="text-[var(--text-primary)] font-medium uppercase text-base sm:text-lg leading-tight">
                        {cert.title}
                      </h4>
                      <p className="text-[var(--text-primary)] opacity-70 text-sm">
                        {cert.issuer}
                      </p>
                      {cert.issue_date && (
                        <p className="text-[var(--text-primary)] opacity-50 text-xs mt-1">
                          {new Date(cert.issue_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
                        </p>
                      )}
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
            <motion.img 
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
