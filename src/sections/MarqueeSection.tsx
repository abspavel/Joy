import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'motion/react';

const gifs = [
  "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif",
  "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
  "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
  "https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif",
  "https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif",
  "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif",
  "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
  "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif",
  "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif",
  "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
  "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif",
  "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif",
  "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif",
  "https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif",
  "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
  "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif",
  "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif"
];

const row1Original = gifs.slice(0, 10);
const row2Original = gifs.slice(10);

function MarqueeImage({ src, index, sectionVisible }: { src: string; index: number; sectionVisible: boolean; key?: React.Key }) {
  return (
    <div 
      className="w-[160px] h-[100px] sm:w-[280px] sm:h-[180px] md:w-[420px] md:h-[270px] rounded-2xl shrink-0 bg-[var(--text-primary)]/5 flex items-center justify-center overflow-hidden relative"
    >
      <img 
        src={src}
        alt={`Portfolio preview ${index}`}
        width="420"
        height="270"
        loading="lazy"
        decoding="async"
        style={{ aspectRatio: '420/270' }}
        className="w-full h-full object-cover object-center"
      />
    </div>
  );
}

export function MarqueeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const sectionInView = useInView(sectionRef, { margin: "200px" });
  const [hasMounted, setHasMounted] = useState(false);
  const { scrollY } = useScroll();
  
  useEffect(() => {
    if (sectionInView && !hasMounted) setHasMounted(true);
  }, [sectionInView, hasMounted]);
  
  const [layoutMeasurements, setLayoutMeasurements] = useState({ 
    top: 0, 
    windowHeight: 0,
    row1SetWidth: 1000,
    row2SetWidth: 1000,
    repeats1: 3,
    repeats2: 3
  });

  useEffect(() => {
    let animationFrameId: number;

    // Cache window dimensions so we don't force reflows repeatedly
    let cachedScreenW = window.innerWidth;
    let cachedScreenH = window.innerHeight;

    const updateMeasurements = () => {
      if (sectionRef.current) {
        let tileW = 160, gap = 8;
        if (cachedScreenW >= 768) {
          tileW = 420; gap = 12;
        } else if (cachedScreenW >= 640) {
          tileW = 280; gap = 8;
        }

        const r1SetWidth = (tileW + gap) * row1Original.length;
        const r2SetWidth = (tileW + gap) * row2Original.length;
        const requiredTrackWidth = cachedScreenW * 3;

        const rep1 = Math.max(3, Math.ceil(requiredTrackWidth / r1SetWidth) + 2);
        const rep2 = Math.max(3, Math.ceil(requiredTrackWidth / r2SetWidth) + 2);

        // offsetTop causes reflow, but only run when resize happens
        setLayoutMeasurements({
          top: sectionRef.current.offsetTop,
          windowHeight: cachedScreenH,
          row1SetWidth: r1SetWidth,
          row2SetWidth: r2SetWidth,
          repeats1: rep1,
          repeats2: rep2
        });
      }
    };
    
    // Initial measurement
    updateMeasurements();

    const handleResize = () => {
      cachedScreenW = window.innerWidth;
      cachedScreenH = window.innerHeight;
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(updateMeasurements);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Compute offset conditionally to save CPU when not in view
  const rawScrollOffset = useTransform(scrollY, (y) => {
    if (!sectionInView) return 0; // Pause tracking when off screen
    return (y - layoutMeasurements.top + layoutMeasurements.windowHeight) * 0.3;
  });

  const smoothScrollOffset = useSpring(rawScrollOffset, {
    stiffness: 100,
    damping: 30,
    mass: 0.5
  });

  const row1Transform = useTransform(smoothScrollOffset, (offset) => {
    if (!sectionInView) return "0px";
    const { row1SetWidth } = layoutMeasurements;
    if (row1SetWidth === 0) return "0px";
    const modOffset = ((offset % row1SetWidth) + row1SetWidth) % row1SetWidth;
    return `${modOffset - row1SetWidth}px`;
  });

  const row2Transform = useTransform(smoothScrollOffset, (offset) => {
    if (!sectionInView) return "0px";
    const { row2SetWidth } = layoutMeasurements;
    if (row2SetWidth === 0) return "0px";
    const modOffset = ((offset % row2SetWidth) + row2SetWidth) % row2SetWidth;
    return `${-modOffset}px`;
  });

  const row1Images = Array(layoutMeasurements.repeats1).fill(row1Original).flat();
  const row2Images = Array(layoutMeasurements.repeats2).fill(row2Original).flat();

  return (
    <section 
      ref={sectionRef} 
      className="bg-[var(--bg-primary)] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden flex flex-col gap-2 md:gap-3 min-h-[300px]"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)'
      }}
    >
      <motion.div 
        className="flex flex-nowrap w-max gap-2 md:gap-3 will-change-transform shrink-0 min-h-[100px] sm:min-h-[180px] md:min-h-[270px]"
        style={{ x: row1Transform }}
      >
        {hasMounted && row1Images.map((src, i) => (
          <MarqueeImage key={`row1-${i}`} src={src} index={i} sectionVisible={sectionInView} />
        ))}
      </motion.div>
      
      <motion.div 
        className="flex flex-nowrap w-max gap-2 md:gap-3 will-change-transform shrink-0 min-h-[100px] sm:min-h-[180px] md:min-h-[270px]"
        style={{ x: row2Transform }}
      >
        {hasMounted && row2Images.map((src, i) => (
          <MarqueeImage key={`row2-${i}`} src={src} index={i} sectionVisible={sectionInView} />
        ))}
      </motion.div>
    </section>
  );
}
