import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'motion/react';
import { LiveProjectButton } from '../components/LiveProjectButton';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { ProjectDetailModal, ProjectData } from '../components/ProjectDetailModal';
import { 
  Sparkles, 
  Maximize2, 
  ExternalLink, 
  Eye, 
  ArrowUpRight, 
  Layers, 
  Globe, 
  CheckCircle2,
  Code2
} from 'lucide-react';

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
    <section id="projects" className="bg-[var(--bg-primary)] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 z-10 relative pt-20 sm:pt-24 md:pt-32 pb-40 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/3 left-[-15%] w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-[-15%] w-[600px] h-[600px] rounded-full bg-cyan-600/10 blur-[150px] pointer-events-none -z-10" />

      <div className="text-center mb-16 sm:mb-20 md:mb-24 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--text-primary)]/20 bg-[var(--text-primary)]/5 mb-4 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--text-primary)]/80">
            Selected Works & Interactive Demos
          </span>
        </div>
        <h2 className="hero-heading font-black uppercase text-[clamp(3rem,12vw,160px)] leading-none">
          Projects
        </h2>
        <p className="text-xs sm:text-sm font-light tracking-widest uppercase text-[var(--text-primary)]/60 mt-3 max-w-xl mx-auto">
          Hover across preview tiles or click to launch live interactive demos & case studies
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
  const y1 = useTransform(cardScroll, [0, 1], [15, -15]);
  const y2 = useTransform(cardScroll, [0, 1], [25, -25]);
  const y3 = useTransform(cardScroll, [0, 1], [10, -10]);

  // Tilt & Spotlight Dynamics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  const tiltRotateX = useTransform(smoothMouseY, [-0.5, 0.5], [4, -4]);
  const tiltRotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-4, 4]);

  const spotlightX = useTransform(smoothMouseX, [-0.5, 0.5], [0, 100]);
  const spotlightY = useTransform(smoothMouseY, [-0.5, 0.5], [0, 100]);
  const spotlightBackground = useMotionTemplate`radial-gradient(circle at ${spotlightX}% ${spotlightY}%, rgba(168,85,247,0.12) 0%, transparent 65%)`;

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
  
  // Smart brief description fallback
  const briefDescription = project.description || project.overview || 
    (title.toLowerCase().includes('webtrix') 
      ? 'Full-stack digital agency solution engineered with responsive interfaces, custom animations, and lightning-fast web performance.'
      : 'Modern interactive application crafted with high visual craft, smooth micro-interactions, and robust architectural design.');

  // Parse tech stack tags
  let techTags: string[] = [];
  if (Array.isArray(project.tech_stack)) {
    techTags = project.tech_stack;
  } else if (typeof project.tech_stack === 'string' && project.tech_stack.trim()) {
    techTags = project.tech_stack.split(',').map(t => t.trim()).filter(Boolean);
  } else {
    techTags = ['React 19', 'TypeScript', 'Tailwind CSS', 'Interactive UI'];
  }

  const liveUrl = project.live_project_url || project.live_link;

  return (
    <div ref={containerRef} className="h-[92vh] sm:h-[88vh] flex items-start justify-center perspective-[1500px]" style={{ marginTop: index === 0 ? 0 : '8vh' }}>
      <motion.div 
        style={{ 
          scale, 
          rotateX: rotateXStack,
          top: `calc(5rem + ${index * 26}px)`,
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
          className="w-full rounded-[36px] sm:rounded-[46px] md:rounded-[56px] border-2 border-[var(--text-primary)] bg-[var(--bg-primary)] p-4 sm:p-6 md:p-8 flex flex-col gap-5 md:gap-7 relative overflow-hidden group will-change-transform cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 hover:shadow-[0_25px_60px_rgba(0,0,0,0.6)]"
        >
          {/* Ambient Spotlight Layer */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-40 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: spotlightBackground }}
          />

          {/* Interactive Hover Indicator Badge */}
          <div className="absolute top-4 right-20 sm:right-36 z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-1 group-hover:translate-y-0 hidden sm:flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-500/15 backdrop-blur-md border border-purple-500/30 text-[11px] font-semibold text-purple-300 shadow-lg">
            <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" />
            <span>Interactive Demo & Details</span>
          </div>

          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="flex items-start md:items-center gap-5 md:gap-8">
              <span className="font-black text-[var(--text-primary)] text-[clamp(2.5rem,5.5vw,75px)] leading-none select-none tracking-tighter">
                {project.project_number}
              </span>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs uppercase tracking-widest font-semibold px-2.5 py-0.5 rounded-full bg-[var(--text-primary)]/10 text-[var(--text-primary)] border border-[var(--text-primary)]/15">
                    {project.category || 'Client Work'}
                  </span>
                  {liveUrl && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live Site
                    </span>
                  )}
                </div>

                <h3 className="text-[var(--text-primary)] text-[clamp(1.4rem,2.8vw,2.2rem)] uppercase font-extrabold leading-none group-hover:text-purple-400 transition-colors flex items-center gap-3">
                  {title}
                  <Maximize2 className="w-4 h-4 opacity-0 group-hover:opacity-80 transition-opacity hidden md:inline-block text-purple-400" />
                </h3>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
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
          </div>

          {/* Interactive Project Images Grid with Hover Enlargement & Description Reveal */}
          <div className="flex flex-col md:flex-row gap-4 sm:gap-6 flex-1 min-h-0 relative z-10">
            
            {/* Left Column: 2 Stacked Tiles with Zoom & Micro-Badge */}
            <div className="w-full md:w-[38%] flex flex-col gap-4 sm:gap-6">
              
              {/* Tile 1 */}
              <div className="group/img1 w-full rounded-[28px] sm:rounded-[36px] md:rounded-[42px] overflow-hidden relative border border-white/10 hover:border-purple-400/50 transition-colors duration-300 shadow-md" style={{ height: 'clamp(140px, 16vw, 220px)' }}>
                <motion.div
                  initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
                  whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
                  viewport={{ once: true, margin: "800px" }}
                  transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
                  className="absolute inset-0 w-full h-full bg-black/30"
                >
                  <motion.img 
                    decoding="async" 
                    loading="lazy" 
                    style={{ y: y1 }} 
                    src={project.col1_image1_url} 
                    alt={`${title} preview 1`} 
                    className="w-full h-full object-cover scale-105 group-hover/img1:scale-120 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" 
                  />
                  
                  {/* Subtle Gradient Shade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/img1:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Floating Hover Badge */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover/img1:opacity-100 transition-all duration-300 transform translate-y-2 group-hover/img1:translate-y-0">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[11px] font-medium text-white shadow-lg">
                      <Eye className="w-3 h-3 text-purple-400" />
                      UI Overview
                    </span>
                    <span className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Tile 2 */}
              <div className="group/img2 w-full rounded-[28px] sm:rounded-[36px] md:rounded-[42px] overflow-hidden flex-1 relative border border-white/10 hover:border-cyan-400/50 transition-colors duration-300 shadow-md" style={{ minHeight: 'clamp(170px, 20vw, 300px)' }}>
                <motion.div
                  initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
                  whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
                  viewport={{ once: true, margin: "800px" }}
                  transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
                  className="absolute inset-0 w-full h-full bg-black/30"
                >
                  <motion.img 
                    decoding="async" 
                    loading="lazy" 
                    style={{ y: y2 }} 
                    src={project.col1_image2_url} 
                    alt={`${title} preview 2`} 
                    className="w-full h-full object-cover scale-105 group-hover/img2:scale-120 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" 
                  />
                  
                  {/* Subtle Gradient Shade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/img2:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Floating Hover Badge */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover/img2:opacity-100 transition-all duration-300 transform translate-y-2 group-hover/img2:translate-y-0">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[11px] font-medium text-white shadow-lg">
                      <Layers className="w-3 h-3 text-cyan-400" />
                      Component Details
                    </span>
                    <span className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </motion.div>
              </div>

            </div>

            {/* Right Column: Main Big Showcase with Zoom & Floating Interactive Drawer */}
            <div className="group/main w-full md:w-[62%] rounded-[28px] sm:rounded-[36px] md:rounded-[42px] overflow-hidden h-[340px] md:h-auto relative border border-white/10 hover:border-purple-400/40 transition-colors duration-300 shadow-xl">
              <motion.div
                initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
                whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
                viewport={{ once: true, margin: "800px" }}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
                className="absolute inset-0 w-full h-full bg-black/30"
              >
                <motion.img 
                  decoding="async" 
                  loading="lazy" 
                  style={{ y: y3 }} 
                  src={project.col2_image_url} 
                  alt={`${title} preview 3`} 
                  className="w-full h-full object-cover scale-105 group-hover/main:scale-115 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" 
                />

                {/* Dark Vignette on Image Bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                {/* Top Badge: Quick View */}
                <div className="absolute top-4 right-4 z-20 opacity-0 group-hover/main:opacity-100 transition-all duration-300 transform -translate-y-1 group-hover/main:translate-y-0">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-xl">
                    <Maximize2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>Expand Case Study</span>
                  </div>
                </div>

                {/* Slide-Up Interactive Description & Tech Drawer */}
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 z-20">
                  <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-black/75 backdrop-blur-xl border border-white/15 shadow-2xl transition-all duration-400 transform group-hover/main:translate-y-0 group-hover:translate-y-0 translate-y-1">
                    
                    {/* Excerpt Description */}
                    <p className="text-white/90 text-xs sm:text-sm font-normal line-clamp-2 leading-relaxed mb-3">
                      {briefDescription}
                    </p>

                    {/* Tech Stack Pills & Action Button */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {techTags.slice(0, 3).map((tag, tIdx) => (
                          <span 
                            key={tIdx}
                            className="text-[10px] sm:text-[11px] font-semibold text-white/80 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10"
                          >
                            {tag}
                          </span>
                        ))}
                        {techTags.length > 3 && (
                          <span className="text-[10px] text-purple-300 font-semibold px-1.5 py-0.5">
                            +{techTags.length - 3} more
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-purple-300 group-hover/main:text-white transition-colors">
                        <span>Explore Story</span>
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover/main:translate-x-0.5 group-hover/main:-translate-y-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>

              </motion.div>
            </div>
            
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

