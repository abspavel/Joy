const fs = require('fs');
let code = fs.readFileSync('src/admin/Dashboard.tsx', 'utf8');

code = code.replace("import { CertificationsAdmin } from './components/CertificationsAdmin';", "import { CertificationsAdmin } from './components/CertificationsAdmin';\nimport { OptimizeImagesAdmin } from './components/OptimizeImagesAdmin';");
code = code.replace("const tabs = ['Hero', 'About', 'Achievements', 'Skills', 'Certifications', 'Circle Photos', 'Carousel', 'Projects', 'Services', 'Testimonials', 'Messages'];", "const tabs = ['Hero', 'About', 'Achievements', 'Skills', 'Certifications', 'Circle Photos', 'Carousel', 'Projects', 'Services', 'Testimonials', 'Messages', 'Optimize Images'];");
code = code.replace("{activeTab === 'Messages' && <MessagesAdmin />}", "{activeTab === 'Messages' && <MessagesAdmin />}\n          {activeTab === 'Optimize Images' && <OptimizeImagesAdmin />}");

fs.writeFileSync('src/admin/Dashboard.tsx', code);
