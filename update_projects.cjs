const fs = require('fs');

let code = fs.readFileSync('src/sections/ProjectsSection.tsx', 'utf8');

// Add icons import
if (!code.includes('lucide-react')) {
    code = code.replace("import { Skeleton } from '../components/Skeleton';", "import { Skeleton } from '../components/Skeleton';\nimport { X, ExternalLink, Info } from 'lucide-react';\nimport { useEffect } from 'react';");
}

// Modify ProjectsSection to have selectedProject state
if (!code.includes('selectedProject')) {
    code = code.replace("const projects = data || [];", "const projects = data || [];\n  const [selectedProject, setSelectedProject] = useState<any>(null);");
    
    code = code.replace("totalCards={projects.length}", "totalCards={projects.length}\n               onClick={() => setSelectedProject(project)}");
    
    // Add AnimatePresence and Modal
    code = code.replace("</section>", `  <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </section>`);
}

// Modify ProjectCard props
code = code.replace("index: number, totalCards: number }>", "index: number, totalCards: number, onClick: () => void }>");
code = code.replace("({ project, index, totalCards })", "({ project, index, totalCards, onClick })");

// Replace Flip logic with simple onClick on LiveProjectButton
const flipCodeOld = `{/* Live Project Flip Button */}
            <div 
              className="shrink-0 perspective-[1000px] cursor-pointer" 
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <motion.div
                animate={{ rotateX: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
                style={{ transformStyle: 'preserve-3d' }}
                className="relative"
              >
                <div className="relative z-10" style={{ backfaceVisibility: 'hidden' }}>
                  <LiveProjectButton />
                </div>
                <div
                  className="absolute inset-0 bg-[var(--bg-primary)] border-2 border-[var(--text-primary)] rounded-full flex flex-col items-center justify-center text-[var(--text-primary)] uppercase tracking-widest leading-tight z-0"
                  style={{ transform: 'rotateX(180deg)', backfaceVisibility: 'hidden' }}
                >
                  <span className="text-[10px] sm:text-xs font-bold px-2">{project.category}</span>
                </div>
              </motion.div>
            </div>`;

const newButtonCode = `{/* Live Project Button */}
            <div 
              className="shrink-0 cursor-pointer group"
              onClick={onClick}
            >
              <div className="relative z-10 transition-transform duration-300 group-hover:scale-105">
                <LiveProjectButton />
              </div>
            </div>`;

code = code.replace(flipCodeOld, newButtonCode);

// Add ProjectModal component at the end
if (!code.includes('function ProjectModal')) {
    const modalCode = `
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
                title={\`\${project.name} Live Preview\`}
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
}`;
    code += modalCode;
}

fs.writeFileSync('src/sections/ProjectsSection.tsx', code);
