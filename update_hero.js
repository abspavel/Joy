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
