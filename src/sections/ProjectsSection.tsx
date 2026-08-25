import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'motion/react';
import { LiveProjectButton } from '../components/LiveProjectButton';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { ProjectDetailModal, ProjectData } from '../components/ProjectDetailModal';
import { Sparkles, Maximize2, ExternalLink } from 'lucide-react';

export function ProjectsSection() {
  const { data, loading } = usePortfolioData('projects');
  const projects = (data || []) as ProjectData[];
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenProject = (project: ProjectData) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section id="projects" className="bg-[var(--bg-primary)] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 z-10 relative pt-20 sm:pt-24 md:pt-32 pb-40">
      <div className="text-center mb-16 sm:mb-20 md:mb-28">
        <h2 className="hero-heading font-black uppercase text-[clamp(3rem,12vw,160px)] leading-none">
          Project
        </h2>
        <p className="text-xs sm:text-sm font-light tracking-widest uppercase text-[var(--text-primary)]/50 mt-2">
          Click any project to explore live interactive preview & details
        </p>
      </div>

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
              key={project.id || project.project_number || i} 
              project={project} 
              index={i} 
              totalCards={projects.length}
              onOpen={() => handleOpenProject(project)}
            />
          ))
        )}
      </div>

      {/* Project Detail & Live Preview Modal */}
      <ProjectDetailModal
        project={selectedProject}
        allProjects={projects}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSelectProject={(proj) => setSelectedProject(proj)}
      />
    </section>
  );
}

const ProjectCard: React.FC<{ 
  project: ProjectData; 
  index: number; 
  totalCards: number;
  onOpen: () => void;
}> = ({ project, index, totalCards, onOpen }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
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

  const tiltRotateX = useTransform(smoothMouseY, [-0.5, 0.5], [5, -5]);
  const tiltRotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-5, 5]);

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

  const title = project.name || project.title || 'Project';

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
          id={`project-card-${project.project_number || index}`}
          onClick={onOpen}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX: tiltRotateX,
            rotateY: tiltRotateY,
            transformPerspective: 1000
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpen();
            }
          }}
          className="w-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[var(--text-primary)] bg-[var(--bg-primary)] p-4 sm:p-6 md:p-8 flex flex-col gap-6 md:gap-8 relative overflow-hidden group will-change-transform cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--text-primary)] transition-shadow hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
          {/* Spotlight Layer */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-50 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: spotlightBackground }}
          />

          {/* Hover Explore Indicator Banner */}
          <div className="absolute top-4 right-24 sm:right-36 z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--text-primary)]/10 backdrop-blur-md border border-[var(--text-primary)]/20 text-[11px] font-semibold text-[var(--text-primary)]">
            <Sparkles className="w-3 h-3 text-[#B600A8]" />
            <span>Click to explore preview & details</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-6 md:gap-10">
              <span className="font-black text-[var(--text-primary)] text-[clamp(2.5rem,6vw,80px)] leading-none">{project.project_number}</span>
              <div className="flex flex-col gap-1">
                <span className="text-[var(--text-primary)]/60 uppercase tracking-wider text-sm font-medium">{project.category}</span>
                <h3 className="text-[var(--text-primary)] text-[clamp(1.5rem,3vw,2.5rem)] uppercase font-medium leading-none group-hover:text-highlight transition-colors flex items-center gap-3">
                  {title}
                  <Maximize2 className="w-5 h-5 opacity-0 group-hover:opacity-70 transition-opacity hidden md:inline-block" />
                </h3>
              </div>
            </div>
            
            {/* Live Project Button (Trigger modal) */}
            <div 
              className="shrink-0" 
              onClick={(e) => {
                e.stopPropagation();
                onOpen();
              }}
            >
              <LiveProjectButton 
                label="View Project"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen();
                }}
              />
            </div>
          </div>

          {/* Project Images with parallax */}
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
                  <motion.img decoding="async" loading="lazy" style={{ y: y1, scale: 1.15 }} src={project.col1_image1_url} alt={`${title} preview 1`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
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
                  <motion.img decoding="async" loading="lazy" style={{ y: y2, scale: 1.15 }} src={project.col1_image2_url} alt={`${title} preview 2`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
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
                <motion.img decoding="async" loading="lazy" style={{ y: y3, scale: 1.1 }} src={project.col2_image_url} alt={`${title} preview 3`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </motion.div>
            </div>
            
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

