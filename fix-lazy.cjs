const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace lazy imports with normal imports
code = code.replace("const MarqueeSection = React.lazy(() => import('./sections/MarqueeSection').then(m => ({ default: m.MarqueeSection })));", "import { MarqueeSection } from './sections/MarqueeSection';");
code = code.replace("const AchievementsSection = React.lazy(() => import('./sections/AchievementsSection').then(m => ({ default: m.AchievementsSection })));", "import { AchievementsSection } from './sections/AchievementsSection';");
code = code.replace("const ImageCircleSection = React.lazy(() => import('./sections/ImageCircleSection').then(m => ({ default: m.ImageCircleSection })));", "import { ImageCircleSection } from './sections/ImageCircleSection';");
code = code.replace("const SkillsCertificationsSection = React.lazy(() => import('./sections/SkillsCertificationsSection').then(m => ({ default: m.SkillsCertificationsSection })));", "import { SkillsCertificationsSection } from './sections/SkillsCertificationsSection';");
code = code.replace("const ProjectsSection = React.lazy(() => import('./sections/ProjectsSection').then(m => ({ default: m.ProjectsSection })));", "import { ProjectsSection } from './sections/ProjectsSection';");
code = code.replace("const TestimonialsSection = React.lazy(() => import('./sections/TestimonialsSection').then(m => ({ default: m.TestimonialsSection })));", "import { TestimonialsSection } from './sections/TestimonialsSection';");

// Remove SectionSkeleton
code = code.replace(/function SectionSkeleton\(\) \{[\s\S]*?\}\n/, "");

// Replace DeferredBelowTheFold definition
const deferredReplacement = `function BelowTheFold() {
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
}`;
code = code.replace(/function DeferredBelowTheFold\(\) \{[\s\S]*?\}\s*return \([\s\S]*?<\/>\s*\);\s*\}/, deferredReplacement);

// Replace Suspense usage
code = code.replace("<Suspense fallback={<SectionSkeleton />}><DeferredBelowTheFold /></Suspense>", "<BelowTheFold />");

fs.writeFileSync('src/App.tsx', code);
