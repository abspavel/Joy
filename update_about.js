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
