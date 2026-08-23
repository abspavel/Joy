import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate, AnimatePresence } from 'motion/react';
import { LiveProjectButton } from '../components/LiveProjectButton';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { Skeleton } from '../components/Skeleton';
import { X, ExternalLink, Info } from 'lucide-react';
import { useEffect } from 'react';

export function ProjectsSection() {
  const { data, loading } = usePortfolioData('projects');
  const projects = data || [];
  const [selectedProject, setSelectedProject] = useState<any>(null);

  return (
    <section id="projects" className="bg-[var(--bg-primary)] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 z-10 relative pt-20 sm:pt-24 md:pt-32 pb-40">
      <h2 className="hero-heading font-black uppercase text-center text-[clamp(3rem,12vw,160px)] mb-16 sm:mb-20 md:mb-28 leading-none">
        Project
      </h2>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col">
        {loading ? (
          <>
            {[1, 2, 3].map(i => (
              <div key={i} className="sticky flex items-center justify-center w-full min-h-[500px] sm:min-h-[600px] md:min-h-[700px] lg:min-h-[800px] mb-8" style={{ top: `calc(10vh + ${i * 40}px)` }}>
                 <div className="w-full h-full min-h-[500px] sm:min-h-[600px] md:min-h-[700px] lg:min-h-[800px] bg-[var(--text-primary)]/5 rounded-[30px] sm:rounded-[40px] md:rounded-[50px] animate-pulse border border-[var(--text-primary)]/10" />
              </div>
            ))}
          </>
        ) : projects.length === 0 ? (
          <div className="text-[var(--text-primary)]/50 text-center py-20 font-medium tracking-wide">
            No projects yet.
          </div>
        ) : (
          projects.map((project, i) => (
            <ProjectCard 
              key={project.id || project.project_number} 
              project={project} 
              index={i} 
              totalCards={projects.length}
               onClick={() => setSelectedProject(project)} 
            />
          ))
        )}
      </div>
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

const ProjectCard: React.FC<{ project: any, index: number, totalCards: number, onClick: () => void }> = ({ project, index, totalCards, onClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'start start']
  });

  const { scrollYProgress: scrollYProgressLeave } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  const { scrollYProgress: cardScroll } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  // Stacking Depth & Scale
  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgressLeave, [0, 1], [1, targetScale]);
  const rotateXStack = useTransform(scrollYProgressLeave, [0, 1], [0, index * -1.5]);

  // Parallax Layering
  const y1 = useTransform(cardScroll, [0, 1], [20, -20]);
  const y2 = useTransform(cardScroll, [0, 1], [30, -30]);
  const y3 = useTransform(cardScroll, [0, 1], [15, -15]);

  // Tilt & Spotlight Dynamics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  const tiltRotateX = useTransform(smoothMouseY, [-0.5, 0.5], [6, -6]);
  const tiltRotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-6, 6]);

  const spotlightX = useTransform(smoothMouseX, [-0.5, 0.5], [0, 100]);
  const spotlightY = useTransform(smoothMouseY, [-0.5, 0.5], [0, 100]);
  const spotlightBackground = useMotionTemplate`radial-gradient(circle at ${spotlightX}% ${spotlightY}%, rgba(215,226,234,0.15) 0%, transparent 60%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div ref={containerRef} className="h-[85vh] flex items-start justify-center perspective-[1500px]" style={{ marginTop: index === 0 ? 0 : '10vh' }}>
      <motion.div 
        style={{ 
          scale, 
          rotateX: rotateXStack,
          top: `calc(6rem + ${index * 28}px)`,
          transformOrigin: 'top center'
        }} 
        className="sticky w-full"
      >
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX: tiltRotateX,
            rotateY: tiltRotateY,
            transformPerspective: 1000
          }}
          className="w-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[var(--text-primary)] bg-[var(--bg-primary)] p-4 sm:p-6 md:p-8 flex flex-col gap-6 md:gap-8 relative overflow-hidden group will-change-transform"
        >
          {/* Spotlight Layer */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-50 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: spotlightBackground }}
          />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-6 md:gap-10">
              <span className="font-black text-[var(--text-primary)] text-[clamp(2.5rem,6vw,80px)] leading-none">{project.project_number}</span>
              <div className="flex flex-col gap-1">
                <span className="text-[var(--text-primary)]/60 uppercase tracking-wider text-sm font-medium">{project.category}</span>
                <h3 className="text-[var(--text-primary)] text-[clamp(1.5rem,3vw,2.5rem)] uppercase font-medium leading-none">{project.name}</h3>
              </div>
            </div>
            
            {/* Live Project Button */}
            <div 
              className="shrink-0 cursor-pointer group"
              onClick={onClick}
            >
              <div className="relative z-10 transition-transform duration-300 group-hover:scale-105">
                <LiveProjectButton />
              </div>
            </div>
          </div>

          {/* Project Images */}
          <div className="flex flex-col md:flex-row gap-4 sm:gap-6 flex-1 min-h-0 relative z-0">
            <div className="w-full md:w-[40%] flex flex-col gap-4 sm:gap-6">
              
              <div className="w-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] overflow-hidden relative" style={{ height: 'clamp(130px, 16vw, 230px)' }}>
                <motion.div
                  initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
                  whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
                  viewport={{ once: true, margin: "800px" }}
                  transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
                  className="absolute inset-0 w-full h-full"
                >
                  <motion.img loading="lazy" style={{ y: y1, scale: 1.15 }} src={project.col1_image1_url} alt={`${project.name} preview 1`} className="w-full h-full object-cover" />
                </motion.div>
              </div>

              <div className="w-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] overflow-hidden flex-1 relative" style={{ minHeight: 'clamp(160px, 22vw, 340px)' }}>
                <motion.div
                  initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
                  whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
                  viewport={{ once: true, margin: "800px" }}
                  transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
                  className="absolute inset-0 w-full h-full"
                >
                  <motion.img loading="lazy" style={{ y: y2, scale: 1.15 }} src={project.col1_image2_url} alt={`${project.name} preview 2`} className="w-full h-full object-cover" />
                </motion.div>
              </div>

            </div>

            <div className="w-full md:w-[60%] rounded-[40px] sm:rounded-[50px] md:rounded-[60px] overflow-hidden h-[300px] md:h-auto relative">
              <motion.div
                initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
                whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
                viewport={{ once: true, margin: "800px" }}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
                className="absolute inset-0 w-full h-full"
              >
                <motion.img loading="lazy" style={{ y: y3, scale: 1.1 }} src={project.col2_image_url} alt={`${project.name} preview 3`} className="w-full h-full object-cover" />
              </motion.div>
            </div>
            
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function ProjectModal({ project, onClose }: { project: any, onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const description = project.description || "A comprehensive digital experience designed with clean aesthetics and modern technologies. This project focuses on delivering seamless user interactions, optimized performance, and a responsive layout that adapts to any device. Explore the live preview to see the functional details and design system in action.";

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/60 backdrop-blur-md"
    >
      <motion.div 
        initial={{ y: 50, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 20, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-6xl max-h-[90vh] bg-[var(--bg-primary)] rounded-[30px] sm:rounded-[40px] border border-[var(--text-primary)]/10 overflow-hidden flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 sm:p-8 border-b border-[var(--text-primary)]/10 shrink-0">
          <div>
            <span className="text-[var(--text-primary)]/60 uppercase tracking-wider text-xs font-medium">{project.category}</span>
            <h3 className="text-[var(--text-primary)] text-2xl sm:text-3xl uppercase font-bold leading-none mt-1">{project.name}</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-[var(--text-primary)]/5 hover:bg-[var(--text-primary)]/10 transition-colors text-[var(--text-primary)]"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto flex flex-col md:flex-row">
          {/* Left Info Panel */}
          <div className="w-full md:w-[35%] lg:w-[30%] p-6 sm:p-8 flex flex-col gap-8 border-b md:border-b-0 md:border-r border-[var(--text-primary)]/10 bg-[var(--text-primary)]/5 shrink-0">
            <div>
              <h4 className="flex items-center gap-2 text-[var(--text-primary)] font-bold uppercase tracking-wider text-sm mb-4">
                <Info size={18} /> About Project
              </h4>
              <p className="text-[var(--text-primary)]/80 text-sm sm:text-base leading-relaxed">
                {description}
              </p>
            </div>
            {project.live_project_url && (
              <a 
                href={project.live_project_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-4 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-full font-bold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity mt-auto"
              >
                Visit Live Site <ExternalLink size={16} />
              </a>
            )}
          </div>

          {/* Right Preview Panel */}
          <div className="flex-1 bg-[var(--text-primary)]/5 relative min-h-[500px] md:min-h-0">
            {project.live_project_url ? (
              <iframe 
                src={project.live_project_url} 
                className="w-full h-full border-none absolute inset-0 bg-white"
                title={`${project.name} Live Preview`}
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-[var(--text-primary)]/40 p-8 text-center">
                <ExternalLink size={48} className="mb-4 opacity-50" />
                <p className="text-lg font-medium">Live preview not available</p>
                <p className="text-sm mt-2 max-w-sm">A live URL has not been provided for this project yet.</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}