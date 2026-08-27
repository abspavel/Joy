import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSEO } from '../hooks/useSEO';
import { 
  X, 
  ExternalLink, 
  Monitor, 
  Tablet, 
  Smartphone, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Layers, 
  Code2, 
  CheckCircle2,
  Maximize2,
  Globe,
  Eye
} from 'lucide-react';

export interface ProjectData {
  id?: string;
  project_number?: string;
  name?: string;
  title?: string;
  category?: string;
  description?: string;
  overview?: string;
  tech_stack?: string | string[];
  features?: string | string[];
  col1_image1_url?: string;
  col1_image2_url?: string;
  col2_image_url?: string;
  image_url?: string;
  live_project_url?: string;
  live_link?: string;
  github_url?: string;
}

interface ProjectDetailModalProps {
  project: ProjectData | null;
  allProjects?: ProjectData[];
  isOpen: boolean;
  onClose: () => void;
  onSelectProject?: (project: ProjectData) => void;
}

export function ProjectDetailModal({
  project,
  allProjects = [],
  isOpen,
  onClose,
  onSelectProject
}: ProjectDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'live'>('overview');
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const modalContainerRef = useRef<HTMLDivElement>(null);

  // Dynamic Open Graph, Twitter cards, and Schema.org SEO for individual project
  const projectTitle = project?.title || project?.name || 'Project Case Study';
  const projectDescription = project?.description || project?.overview || `Explore ${projectTitle}, an interactive 3D and frontend development case study by Joy.`;
  const projectImage = project?.col1_image1_url || project?.col2_image_url || project?.image_url;
  const projectUrl = typeof window !== 'undefined' && project?.id 
    ? `${window.location.origin}/?project=${project.id}` 
    : undefined;

  const techStackKeywords = Array.isArray(project?.tech_stack)
    ? project.tech_stack
    : (typeof project?.tech_stack === 'string' ? project.tech_stack.split(',').map((s) => s.trim()) : []);

  useSEO({
    title: isOpen && project ? `${projectTitle} | 3D Case Study` : 'Joy -- 3D Creator',
    description: isOpen && project ? projectDescription : undefined,
    image: isOpen && project ? projectImage : undefined,
    imageAlt: isOpen && project ? `${projectTitle} Preview Showcase` : undefined,
    url: isOpen && project ? projectUrl : undefined,
    type: 'article',
    twitterCard: 'summary_large_image',
    section: project?.category || 'Creative 3D Projects',
    keywords: [
      projectTitle,
      project?.category || '3D Development',
      '3D Interactive Demo',
      'Creative Frontend',
      'WebGL Case Study',
      ...techStackKeywords,
    ],
    structuredData: isOpen && project ? {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      'name': projectTitle,
      'headline': projectTitle,
      'description': projectDescription,
      'image': projectImage || `${typeof window !== 'undefined' ? window.location.origin : ''}/joy-photo-transparent.png`,
      'url': projectUrl,
      'author': {
        '@type': 'Person',
        'name': 'Pavel Ahmed Joy',
        'jobTitle': '3D Creator & Frontend Developer'
      },
      'genre': project?.category || 'Interactive 3D Art & Development',
      'keywords': techStackKeywords.join(', ')
    } : undefined
  });

  // Reset tab when project changes
  useEffect(() => {
    if (project) {
      setActiveTab('overview');
      setIsIframeLoading(true);
      setIframeKey(prev => prev + 1);
    }
  }, [project?.id, project?.name]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          if (lightboxImage) {
            setLightboxImage(null);
          } else {
            onClose();
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = originalStyle;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, lightboxImage, onClose]);

  if (!project) return null;

  const title = project.name || project.title || 'Featured Project';
  const projectNumber = project.project_number || '01';
  const category = project.category || 'Portfolio';
  const liveUrl = project.live_project_url || project.live_link || '';

  // Get gallery images
  const images = [
    project.col2_image_url,
    project.col1_image1_url,
    project.col1_image2_url,
    project.image_url
  ].filter(Boolean) as string[];

  // Fallback description
  const description = project.description || project.overview || 
    `An innovative digital project crafted with extreme attention to detail, responsive motion, and modern web technologies. Designed to deliver an unforgettable user experience and high visual craft.`;

  // Parse tech stack
  let techStack: string[] = [];
  if (Array.isArray(project.tech_stack)) {
    techStack = project.tech_stack;
  } else if (typeof project.tech_stack === 'string' && project.tech_stack.trim()) {
    techStack = project.tech_stack.split(',').map(t => t.trim()).filter(Boolean);
  } else {
    techStack = ['React 19', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Responsive UI', '3D Interactive'];
  }

  // Parse features
  let features: string[] = [];
  if (Array.isArray(project.features)) {
    features = project.features;
  } else if (typeof project.features === 'string' && project.features.trim()) {
    features = project.features.split(',').map(f => f.trim()).filter(Boolean);
  } else {
    features = [
      'High-performance smooth animations & interactive physics',
      'Ultra-responsive mobile-first design system',
      'Modern accessible UI components with dark mode support',
      'Optimized asset loading & crisp rendering'
    ];
  }

  // Next / Previous navigation
  const currentIndex = allProjects.findIndex(p => (p.id && p.id === project.id) || (p.project_number === project.project_number) || (p.name === project.name));
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < allProjects.length - 1;

  const handlePrev = () => {
    if (hasPrev && onSelectProject) {
      onSelectProject(allProjects[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (hasNext && onSelectProject) {
      onSelectProject(allProjects[currentIndex + 1]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="project-detail-modal-root" className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            id="project-detail-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Main Modal Container */}
          <motion.div
            id="project-detail-dialog"
            ref={modalContainerRef}
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-6xl h-[92vh] max-h-[920px] bg-[var(--bg-primary)] border-2 border-[var(--text-primary)]/20 rounded-[28px] sm:rounded-[36px] md:rounded-[44px] shadow-2xl flex flex-col overflow-hidden z-10 text-[var(--text-primary)]"
            onClick={e => e.stopPropagation()}
            data-lenis-prevent
          >
            {/* Top Navigation Bar */}
            <div id="project-modal-header" className="px-5 sm:px-8 py-4 sm:py-5 border-b border-[var(--text-primary)]/10 flex flex-wrap items-center justify-between gap-4 bg-[var(--bg-secondary)]/50 shrink-0">
              <div className="flex items-center gap-3 sm:gap-5">
                <span className="font-black text-2xl sm:text-3xl text-[var(--text-primary)] leading-none">
                  {projectNumber}
                </span>
                <div className="h-6 w-px bg-[var(--text-primary)]/20 hidden sm:block" />
                <div className="flex flex-col">
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]/60">
                    {category}
                  </span>
                  <h3 className="font-bold text-base sm:text-xl uppercase tracking-tight text-[var(--text-primary)] line-clamp-1">
                    {title}
                  </h3>
                </div>
              </div>

              {/* Center Tabs: Overview vs Live Preview */}
              <div id="project-modal-tabs" className="flex items-center bg-[var(--bg-primary)] p-1 rounded-full border border-[var(--text-primary)]/15 mx-auto md:mx-0">
                <button
                  id="tab-btn-overview"
                  onClick={() => setActiveTab('overview')}
                  className={`flex items-center gap-2 px-4 sm:px-5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                    activeTab === 'overview'
                      ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm'
                      : 'text-[var(--text-primary)]/70 hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Overview & Details</span>
                </button>

                <button
                  id="tab-btn-live"
                  onClick={() => setActiveTab('live')}
                  className={`flex items-center gap-2 px-4 sm:px-5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                    activeTab === 'live'
                      ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm'
                      : 'text-[var(--text-primary)]/70 hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Live Interactive Preview</span>
                </button>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-2">
                {/* Prev / Next Buttons */}
                {allProjects.length > 1 && (
                  <div className="flex items-center gap-1 mr-2 border-r border-[var(--text-primary)]/15 pr-3 hidden sm:flex">
                    <button
                      id="btn-prev-project"
                      onClick={handlePrev}
                      disabled={!hasPrev}
                      title="Previous Project"
                      className="p-2 rounded-full hover:bg-[var(--text-primary)]/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-[var(--text-primary)]"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-mono opacity-60">
                      {currentIndex + 1}/{allProjects.length}
                    </span>
                    <button
                      id="btn-next-project"
                      onClick={handleNext}
                      disabled={!hasNext}
                      title="Next Project"
                      className="p-2 rounded-full hover:bg-[var(--text-primary)]/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-[var(--text-primary)]"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* External Live Link */}
                {liveUrl && (
                  <a
                    id="btn-external-live-link"
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--text-primary)]/30 hover:border-[var(--text-primary)] bg-[var(--text-primary)]/5 hover:bg-[var(--text-primary)]/15 text-xs font-medium transition-all"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Visit Live</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>
                )}

                {/* Close Button */}
                <button
                  id="btn-close-project-modal"
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-[var(--text-primary)]/10 transition-colors text-[var(--text-primary)] ml-1"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-8 custom-scrollbar">
              {activeTab === 'overview' ? (
                /* TAB 1: OVERVIEW & DETAILS */
                <div id="project-overview-content" className="max-w-5xl mx-auto space-y-8 md:space-y-12">
                  {/* Hero Showcase Preview Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-stretch">
                    {/* Main Featured Image */}
                    {images[0] && (
                      <div 
                        className="md:col-span-8 rounded-2xl sm:rounded-3xl overflow-hidden border border-[var(--text-primary)]/20 bg-black/40 group relative aspect-[16/10] cursor-pointer shadow-lg"
                        onClick={() => setLightboxImage(images[0])}
                      >
                        <img
                          src={images[0]}
                          alt={`${title} main preview`}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 sm:p-6">
                          <span className="flex items-center gap-2 text-white text-xs sm:text-sm font-medium bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full">
                            <Maximize2 className="w-3.5 h-3.5" /> Click to expand image
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Secondary Gallery Images Column */}
                    <div className="md:col-span-4 flex flex-col gap-4 sm:gap-6 justify-between">
                      {images[1] && (
                        <div 
                          className="rounded-2xl sm:rounded-3xl overflow-hidden border border-[var(--text-primary)]/20 bg-black/40 group relative aspect-[16/10] flex-1 cursor-pointer shadow-md"
                          onClick={() => setLightboxImage(images[1])}
                        >
                          <img
                            src={images[1]}
                            alt={`${title} detail 1`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Maximize2 className="w-6 h-6 text-white drop-shadow-md" />
                          </div>
                        </div>
                      )}

                      {images[2] && (
                        <div 
                          className="rounded-2xl sm:rounded-3xl overflow-hidden border border-[var(--text-primary)]/20 bg-black/40 group relative aspect-[16/10] flex-1 cursor-pointer shadow-md"
                          onClick={() => setLightboxImage(images[2])}
                        >
                          <img
                            src={images[2]}
                            alt={`${title} detail 2`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Maximize2 className="w-6 h-6 text-white drop-shadow-md" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Project Details Columns */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-4">
                    {/* Left Details: Story, Overview & Features */}
                    <div className="lg:col-span-8 space-y-6 sm:space-y-8">
                      <div>
                        <div className="flex items-center gap-2 mb-3 text-[var(--text-primary)]/70 text-xs sm:text-sm font-semibold uppercase tracking-wider">
                          <Layers className="w-4 h-4 text-[#B600A8]" />
                          <span>Project Overview</span>
                        </div>
                        <p className="text-base sm:text-lg text-[var(--text-primary)]/90 leading-relaxed font-light whitespace-pre-line">
                          {description}
                        </p>
                      </div>

                      {/* Key Highlights & Features */}
                      <div>
                        <div className="flex items-center gap-2 mb-4 text-[var(--text-primary)]/70 text-xs sm:text-sm font-semibold uppercase tracking-wider">
                          <Sparkles className="w-4 h-4 text-[#B600A8]" />
                          <span>Key Deliverables & Highlights</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          {features.map((feat, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--text-primary)]/10"
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              <span className="text-xs sm:text-sm text-[var(--text-primary)]/85 leading-snug">
                                {feat}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Details: Tech Stack & Live Actions */}
                    <div className="lg:col-span-4 space-y-6">
                      {/* Tech Stack Card */}
                      <div className="p-5 sm:p-6 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--text-primary)]/15 space-y-4">
                        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[var(--text-primary)]/70">
                          <Code2 className="w-4 h-4 text-[#B600A8]" />
                          <span>Tech Stack & Tools</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {techStack.map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1.5 rounded-full text-xs font-medium bg-[var(--bg-primary)] border border-[var(--text-primary)]/20 text-[var(--text-primary)] hover:border-[var(--text-primary)]/50 transition-colors"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Interactive Live CTA Card */}
                      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#B600A8]/15 via-[var(--bg-secondary)] to-[var(--bg-secondary)] border border-[#B600A8]/30 space-y-4">
                        <div className="space-y-1">
                          <h4 className="font-bold text-base sm:text-lg text-[var(--text-primary)]">
                            Interactive Live Preview
                          </h4>
                          <p className="text-xs sm:text-sm text-[var(--text-primary)]/70">
                            Experience the responsive site right inside this page or visit the live deployment.
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 pt-2">
                          <button
                            id="btn-open-live-tab"
                            onClick={() => setActiveTab('live')}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold text-sm hover:opacity-90 transition-opacity shadow-md"
                          >
                            <Monitor className="w-4 h-4" />
                            <span>Launch Embedded Preview</span>
                          </button>

                          {liveUrl && (
                            <a
                              id="btn-visit-external"
                              href={liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full border border-[var(--text-primary)]/25 text-[var(--text-primary)] font-medium text-xs hover:bg-[var(--text-primary)]/10 transition-colors"
                            >
                              <Globe className="w-3.5 h-3.5" />
                              <span>Open in New Tab</span>
                              <ExternalLink className="w-3 h-3 opacity-60" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* TAB 2: LIVE INTERACTIVE PREVIEW WITH DEVICE SIMULATOR */
                <div id="project-live-preview-content" className="h-full flex flex-col space-y-4">
                  {/* Browser Mockup Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--bg-secondary)] p-3 sm:p-4 rounded-2xl border border-[var(--text-primary)]/15">
                    {/* Simulated URL bar */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-primary)] border border-[var(--text-primary)]/15 text-xs text-[var(--text-primary)]/70 flex-1 max-w-md overflow-hidden">
                      <div className="flex gap-1.5 items-center shrink-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      </div>
                      <Globe className="w-3.5 h-3.5 ml-1 shrink-0 opacity-60" />
                      <span className="truncate font-mono">
                        {liveUrl || 'https://demo-preview.local/project'}
                      </span>
                    </div>

                    {/* Device Switcher */}
                    <div className="flex items-center gap-1 bg-[var(--bg-primary)] p-1 rounded-full border border-[var(--text-primary)]/15">
                      <button
                        id="device-btn-desktop"
                        onClick={() => setDeviceView('desktop')}
                        title="Desktop View"
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          deviceView === 'desktop'
                            ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                            : 'text-[var(--text-primary)]/70 hover:text-[var(--text-primary)]'
                        }`}
                      >
                        <Monitor className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Desktop</span>
                      </button>

                      <button
                        id="device-btn-tablet"
                        onClick={() => setDeviceView('tablet')}
                        title="Tablet View"
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          deviceView === 'tablet'
                            ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                            : 'text-[var(--text-primary)]/70 hover:text-[var(--text-primary)]'
                        }`}
                      >
                        <Tablet className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Tablet</span>
                      </button>

                      <button
                        id="device-btn-mobile"
                        onClick={() => setDeviceView('mobile')}
                        title="Mobile View"
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          deviceView === 'mobile'
                            ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                            : 'text-[var(--text-primary)]/70 hover:text-[var(--text-primary)]'
                        }`}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Mobile</span>
                      </button>
                    </div>

                    {/* Reload and Open Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        id="btn-reload-iframe"
                        onClick={() => {
                          setIsIframeLoading(true);
                          setIframeKey(k => k + 1);
                        }}
                        title="Reload Frame"
                        className="p-2 rounded-full bg-[var(--bg-primary)] border border-[var(--text-primary)]/15 hover:bg-[var(--text-primary)]/10 text-[var(--text-primary)] transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>

                      {liveUrl && (
                        <a
                          id="btn-live-open-tab"
                          href={liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs font-semibold hover:opacity-90 transition-opacity"
                        >
                          <span>Open Live</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Device Stage Simulator */}
                  <div className="flex-1 min-h-[480px] bg-black/60 rounded-3xl border border-[var(--text-primary)]/20 p-2 sm:p-4 flex items-center justify-center overflow-hidden relative">
                    <motion.div
                      layout
                      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                      className={`h-full bg-[var(--bg-primary)] rounded-2xl overflow-hidden border border-[var(--text-primary)]/20 shadow-2xl relative flex flex-col transition-all duration-300 ${
                        deviceView === 'desktop'
                          ? 'w-full'
                          : deviceView === 'tablet'
                          ? 'w-[768px] max-w-full'
                          : 'w-[375px] max-w-full'
                      }`}
                    >
                      {liveUrl ? (
                        <div className="w-full h-full relative">
                          {isIframeLoading && (
                            <div className="absolute inset-0 bg-[var(--bg-primary)] flex flex-col items-center justify-center gap-3 z-10">
                              <div className="w-8 h-8 rounded-full border-2 border-[var(--text-primary)]/20 border-t-[#B600A8] animate-spin" />
                              <p className="text-xs text-[var(--text-primary)]/60 font-mono">
                                Loading interactive preview...
                              </p>
                            </div>
                          )}

                          <iframe
                            key={iframeKey}
                            src={liveUrl}
                            title={`${title} Live Preview`}
                            className="w-full h-full border-0 bg-white"
                            onLoad={() => setIsIframeLoading(false)}
                            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                          />

                          {/* Fallback Notice in case external site blocks iframes */}
                          <div className="absolute bottom-3 right-3 z-20">
                            <a
                              href={liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-white text-[11px] font-medium border border-white/20 flex items-center gap-1.5 shadow-lg hover:bg-black transition-colors"
                            >
                              <span>Website blocked in frame? Click to open</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      ) : (
                        /* Rich Visual Interactive Showcase Mockup when no external live URL is provided */
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-5 bg-gradient-to-b from-[var(--bg-secondary)] to-[var(--bg-primary)] overflow-y-auto">
                          <div className="w-14 h-14 rounded-full bg-[#B600A8]/20 border border-[#B600A8]/40 flex items-center justify-center text-[#B600A8]">
                            <Sparkles className="w-7 h-7" />
                          </div>

                          <div className="max-w-md space-y-2">
                            <h4 className="text-lg sm:text-xl font-bold uppercase text-[var(--text-primary)]">
                              {title}
                            </h4>
                            <p className="text-xs sm:text-sm text-[var(--text-primary)]/70 leading-relaxed">
                              {description}
                            </p>
                          </div>

                          {images[0] && (
                            <div className="w-full max-w-lg rounded-2xl overflow-hidden border border-[var(--text-primary)]/20 shadow-xl aspect-[16/10]">
                              <img
                                src={images[0]}
                                alt={title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}

                          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                            <button
                              onClick={() => setActiveTab('overview')}
                              className="px-5 py-2.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-medium text-xs hover:opacity-90 transition-opacity"
                            >
                              View Full Image Gallery & Details
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* High Resolution Lightbox for Images */}
          <AnimatePresence>
            {lightboxImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 p-4"
                onClick={() => setLightboxImage(null)}
              >
                <button
                  onClick={() => setLightboxImage(null)}
                  className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-[121]"
                  aria-label="Close image preview"
                >
                  <X className="w-6 h-6" />
                </button>
                <motion.img
                  src={lightboxImage}
                  alt="Expanded preview"
                  initial={{ scale: 0.85 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.85 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="max-w-[95vw] max-h-[90vh] object-contain rounded-2xl shadow-2xl"
                  onClick={e => e.stopPropagation()}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}
