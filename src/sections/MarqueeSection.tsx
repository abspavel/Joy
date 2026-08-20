import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';

const gifs = [
  "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
  "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
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

const row1Original = gifs.slice(0, 11);
const row2Original = gifs.slice(11);

function MarqueeImage({ src, index }: { src: string; index: number }) {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <img 
      src={src}
      alt="Portfolio preview"
      loading={index < 4 ? "eager" : "lazy"}
      onLoad={() => setLoaded(true)}
      className={`w-[160px] h-[100px] sm:w-[280px] sm:h-[180px] md:w-[420px] md:h-[270px] rounded-2xl object-cover object-center shrink-0 transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      style={{ aspectRatio: '420/270' }}
    />
  );
}

export function MarqueeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
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
    const updateMeasurements = () => {
      if (sectionRef.current) {
        const screenW = window.innerWidth;
        
        // Calculate tile width + gap per breakpoint
        let tileW = 160, gap = 8;
        if (screenW >= 768) {
          tileW = 420; gap = 12;
        } else if (screenW >= 640) {
          tileW = 280; gap = 8;
        }

        const r1SetWidth = (tileW + gap) * row1Original.length;
        const r2SetWidth = (tileW + gap) * row2Original.length;

        // Dynamically calculate repeats so track width is >= 3x screen width
        // Add 2 extra sets for safe modulo buffering
        const requiredTrackWidth = screenW * 3;
        const rep1 = Math.max(3, Math.ceil(requiredTrackWidth / r1SetWidth) + 2);
        const rep2 = Math.max(3, Math.ceil(requiredTrackWidth / r2SetWidth) + 2);

        setLayoutMeasurements({
          top: sectionRef.current.offsetTop,
          windowHeight: window.innerHeight,
          row1SetWidth: r1SetWidth,
          row2SetWidth: r2SetWidth,
          repeats1: rep1,
          repeats2: rep2
        });
      }
    };
    
    // Throttle resize events for performance
    const handleResize = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(updateMeasurements);
    };

    updateMeasurements();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const rawScrollOffset = useTransform(scrollY, (y) => {
    return (y - layoutMeasurements.top + layoutMeasurements.windowHeight) * 0.3;
  });

  const smoothScrollOffset = useSpring(rawScrollOffset, {
    stiffness: 100,
    damping: 30,
    mass: 0.5
  });

  const row1Transform = useTransform(smoothScrollOffset, (offset) => {
    const { row1SetWidth } = layoutMeasurements;
    // Ensure safe positive modulo for seamless reset
    const modOffset = ((offset % row1SetWidth) + row1SetWidth) % row1SetWidth;
    // Row 1 moves right -> shift starting position left by 1 full set
    return `${modOffset - row1SetWidth}px`;
  });

  const row2Transform = useTransform(smoothScrollOffset, (offset) => {
    const { row2SetWidth } = layoutMeasurements;
    const modOffset = ((offset % row2SetWidth) + row2SetWidth) % row2SetWidth;
    // Row 2 moves left -> starts at 0, shifts negative up to 1 full set
    return `${-modOffset}px`;
  });

  const row1Images = Array(layoutMeasurements.repeats1).fill(row1Original).flat();
  const row2Images = Array(layoutMeasurements.repeats2).fill(row2Original).flat();

  return (
    <section 
      ref={sectionRef} 
      className="bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden flex flex-col gap-2 md:gap-3"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)'
      }}
    >
      <motion.div 
        className="flex flex-nowrap w-max gap-2 md:gap-3 will-change-transform shrink-0"
        style={{ x: row1Transform }}
      >
        {row1Images.map((src, i) => (
          <MarqueeImage key={`row1-${i}`} src={src} index={i} />
        ))}
      </motion.div>

      <motion.div 
        className="flex flex-nowrap w-max gap-2 md:gap-3 will-change-transform shrink-0"
        style={{ x: row2Transform }}
      >
        {row2Images.map((src, i) => (
          <MarqueeImage key={`row2-${i}`} src={src} index={i} />
        ))}
      </motion.div>
    </section>
  );
}
