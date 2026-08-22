const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const deferredComponent = `
function DeferredBelowTheFold() {
  const [isIdle, setIsIdle] = React.useState(false);

  React.useEffect(() => {
    const startRender = () => setIsIdle(true);
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(startRender);
    } else {
      setTimeout(startRender, 100);
    }
  }, []);

  if (!isIdle) {
    // Return early to not trigger suspense block
    return null;
  }

  return (
    <>
      <MarqueeSection />
      <AchievementsSection />
      <ImageCircleSection />
      <AboutSection />
      <SkillsCertificationsSection />
      <ServicesSection />
      <ProjectsSection />
      <TestimonialsSection />
      <FooterSection />
    </>
  );
}
`;

if (!code.includes('DeferredBelowTheFold')) {
  // Add the component definition right before PublicSite
  code = code.replace('function PublicSite() {', deferredComponent + '\nfunction PublicSite() {');
  
  // Replace the contents of Suspense with DeferredBelowTheFold
  code = code.replace(/<Suspense fallback=\{<SectionSkeleton \/>\}>[\s\S]*?<\/Suspense>/, '<Suspense fallback={<SectionSkeleton />}><DeferredBelowTheFold /></Suspense>');
}

fs.writeFileSync('src/App.tsx', code);
