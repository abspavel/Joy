cat << 'INNER_EOF' > update_about.js
const fs = require('fs');
let code = fs.readFileSync('src/sections/AboutSection.tsx', 'utf8');

// Add import
if (!code.includes('usePortfolioData')) {
  code = code.replace("import { ContactButton } from '../components/ContactButton';", "import { ContactButton } from '../components/ContactButton';\nimport { usePortfolioData } from '../hooks/usePortfolioData';");
}

// Add hook
if (!code.includes('const { data, loading } = usePortfolioData')) {
  code = code.replace("export function AboutSection() {", "export function AboutSection() {\n  const { data, loading } = usePortfolioData('about_content');\n  const about = data?.[0] || { heading: 'About me', paragraph_text: 'I\\'m Pavel Ahmed Joy, a web developer focused on building clean, responsive, and user-friendly websites. I truly enjoy turning ideas into fast, functional, and well-crafted digital experiences. Let\\'s build something incredible together!' };");
  
  // Replace text
  code = code.replace(
    `text="I'm Pavel Ahmed Joy, a web developer focused on building clean, responsive, and user-friendly websites. I truly enjoy turning ideas into fast, functional, and well-crafted digital experiences. Let's build something incredible together!"`,
    `text={about.paragraph_text}`
  );
  
  // Replace heading
  code = code.replace("About me", "{about.heading}");
  
  fs.writeFileSync('src/sections/AboutSection.tsx', code);
}
INNER_EOF
node update_about.js

cat << 'INNER_EOF' > update_hero.js
const fs = require('fs');
let code = fs.readFileSync('src/sections/HeroSection.tsx', 'utf8');

if (!code.includes('usePortfolioData')) {
  code = code.replace("import { ContactButton } from '../components/ContactButton';", "import { ContactButton } from '../components/ContactButton';\nimport { usePortfolioData } from '../hooks/usePortfolioData';");
}

if (!code.includes('const { data, loading } = usePortfolioData')) {
  code = code.replace("export function HeroSection() {", "export function HeroSection() {\n  const { data, loading } = usePortfolioData('hero_content');\n  const hero = data?.[0] || {\n    heading_line1: \"Hi, i'm \",\n    heading_line2: \"joy\",\n    tagline_text: \"BUILDING CLEAN, MODERN, AND HIGH-PERFORMING WEBSITES THAT LEAVE AN IMPRESSION\",\n    portrait_image_url: \"/joy-photo-transparent.png\"\n  };");
  
  // Pass props to AnimatedHeroTitle
  code = code.replace("<AnimatedHeroTitle />", "<AnimatedHeroTitle text1={hero.heading_line1} text2={hero.heading_line2} />");
  code = code.replace("function AnimatedHeroTitle() {", "function AnimatedHeroTitle({ text1 = \"Hi, i'm \", text2 = \"joy\" }: { text1?: string, text2?: string }) {");
  code = code.replace("const text1 = \"Hi, i'm \";\n  const text2 = \"joy\";", "");
  
  // Pass props to EnhancedPortrait
  code = code.replace("<EnhancedPortrait />", "<EnhancedPortrait imageUrl={hero.portrait_image_url} />");
  code = code.replace("function EnhancedPortrait() {", "function EnhancedPortrait({ imageUrl = \"/joy-photo-transparent.png\" }: { imageUrl?: string }) {");
  code = code.replace('src="/joy-photo-transparent.png"', 'src={imageUrl}');
  
  // Tagline
  code = code.replace("BUILDING CLEAN, MODERN, AND HIGH-PERFORMING WEBSITES THAT LEAVE AN IMPRESSION", "{hero.tagline_text}");
  
  fs.writeFileSync('src/sections/HeroSection.tsx', code);
}
INNER_EOF
node update_hero.js

cat << 'INNER_EOF' > update_projects.js
const fs = require('fs');
let code = fs.readFileSync('src/sections/ProjectsSection.tsx', 'utf8');

if (!code.includes('usePortfolioData')) {
  code = code.replace("import { Magnet } from '../components/Magnet';", "import { Magnet } from '../components/Magnet';\nimport { usePortfolioData } from '../hooks/usePortfolioData';");
}

if (!code.includes('const { data, loading } = usePortfolioData')) {
  // Wait, ProjectsSection already has a projects array. We should replace the map logic.
  // It's tricky to replace via naive string manipulation. Let's just rewrite the whole section with a proper file edit.
}
INNER_EOF
node update_projects.js
