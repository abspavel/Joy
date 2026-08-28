const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const belowTheFoldMatch = code.match(/function BelowTheFold\(\) \{[\s\S]*?return \([\s\S]*?<\/>\s*\);\s*\}/);

if (belowTheFoldMatch) {
  const newBelowTheFold = `function LazySection({ children, fallbackHeight = "100vh" }: { children: React.ReactNode, fallbackHeight?: string }) {
  const [inView, setInView] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, { rootMargin: '800px' });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ minHeight: inView ? 'auto' : fallbackHeight }}>
      {inView && <Suspense fallback={<div style={{ height: fallbackHeight }} />}>{children}</Suspense>}
    </div>
  );
}

function BelowTheFold() {
  return (
    <>
      <LazySection fallbackHeight="600px">
        <AchievementsSection />
      </LazySection>
      <LazySection fallbackHeight="800px">
        <ImageCircleSection />
      </LazySection>
      <LazySection fallbackHeight="100vh">
        <AboutSection />
      </LazySection>
      <LazySection fallbackHeight="100vh">
        <SkillsCertificationsSection />
      </LazySection>
      <LazySection fallbackHeight="100vh">
        <ServicesSection />
      </LazySection>
      <LazySection fallbackHeight="100vh">
        <ProjectsSection />
      </LazySection>
      <LazySection fallbackHeight="100vh">
        <TestimonialsSection />
      </LazySection>
      <LazySection fallbackHeight="500px">
        <FooterSection />
      </LazySection>
    </>
  );
}`;
  code = code.replace(belowTheFoldMatch[0], newBelowTheFold);
  fs.writeFileSync('src/App.tsx', code);
}
