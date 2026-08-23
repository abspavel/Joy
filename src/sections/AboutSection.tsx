import { FadeIn } from '../components/FadeIn';
import { AnimatedText } from '../components/AnimatedText';
import { ContactButton } from '../components/ContactButton';
import { RoundCarousel } from '../components/RoundCarousel';
import { usePortfolioData } from '../hooks/usePortfolioData';

export function AboutSection() {
  const { data, loading } = usePortfolioData('about_content');
  const about = data?.[0] || { heading: 'About me', paragraph_text: "I'm Pavel Ahmed Joy, a passionate web developer with 5+ years of experience building clean, responsive, and high-performing websites. I've successfully completed 250+ projects, ranging from business websites to full-scale web applications, always focused on clean code, modern design, and great user experience. I love turning ideas into fast, functional, and visually striking digital products. Let's build something incredible together!" };

  return (
    <section id="about" className="min-h-screen relative flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-20 overflow-hidden">
      
      {/* Decorative 3D Images */}
      <FadeIn delay={0.1} x={-80} y={0} duration={0.9} className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] z-0">
        <img 
          src="/moon-3d.webp" 
          alt="Moon 3D icon" 
          loading="lazy"
          width="210"
          height="210"
          style={{ aspectRatio: '1/1' }}
          className="w-[120px] sm:w-[160px] md:w-[210px] object-contain drop-shadow-2xl"
        />
      </FadeIn>

      <FadeIn delay={0.25} x={-80} y={0} duration={0.9} className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] z-0">
        <img 
          src="/p59-3d.webp" 
          alt="3D object" 
          loading="lazy"
          width="180"
          height="180"
          style={{ aspectRatio: '1/1' }}
          className="w-[100px] sm:w-[140px] md:w-[180px] object-contain drop-shadow-2xl"
        />
      </FadeIn>

      <FadeIn delay={0.15} x={80} y={0} duration={0.9} className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] z-0">
        <img 
          src="/lego-3d.webp" 
          alt="Lego 3D icon" 
          loading="lazy"
          width="210"
          height="210"
          style={{ aspectRatio: '1/1' }}
          className="w-[120px] sm:w-[160px] md:w-[210px] object-contain drop-shadow-2xl"
        />
      </FadeIn>

      <FadeIn delay={0.3} x={80} y={0} duration={0.9} className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] z-0">
        <img 
          src="/group-3d.webp" 
          alt="3D group" 
          loading="lazy"
          width="220"
          height="220"
          style={{ aspectRatio: '1/1' }}
          className="w-[130px] sm:w-[170px] md:w-[220px] object-contain drop-shadow-2xl"
        />
      </FadeIn>

      <div className="relative z-10 flex flex-col items-center gap-12 sm:gap-16 md:gap-20">
        <FadeIn delay={0} y={40}>
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-center text-[clamp(3rem,12vw,160px)]">
            {about.heading}
          </h2>
        </FadeIn>

        <div className="text-center w-full flex justify-center px-4">
          <AnimatedText 
            text={about.paragraph_text}
            className="text-[var(--text-primary)] font-medium leading-relaxed max-w-[720px] text-[clamp(1.15rem,2.6vw,1.75rem)]"
          />
        </div>

        {/* 3D Round Carousel */}
        <div className="w-full max-w-[100vw] overflow-visible">
          <FadeIn delay={0.4} y={50}>
            <RoundCarousel />
          </FadeIn>
        </div>

        <div>
          <FadeIn delay={0.2} y={30}>
            <ContactButton />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
