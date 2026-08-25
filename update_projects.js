const fs = require('fs');
let code = fs.readFileSync('src/sections/ProjectsSection.tsx', 'utf8');

if (!code.includes('usePortfolioData')) {
  code = code.replace("import { Magnet } from '../components/Magnet';", "import { Magnet } from '../components/Magnet';\nimport { usePortfolioData } from '../hooks/usePortfolioData';");
}

if (!code.includes('const { data, loading } = usePortfolioData')) {
  // Wait, ProjectsSection already has a projects array. We should replace the map logic.
  // It's tricky to replace via naive string manipulation. Let's just rewrite the whole section with a proper file edit.
}
