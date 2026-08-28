const fs = require('fs');
let code = fs.readFileSync('src/sections/HeroSection.tsx', 'utf8');

code = code.replace(/<img\s*src=\{imageUrl\}\s*alt="Pavel Ahmed Joy - 3D Creator"/,
  `<img src={imageUrl} alt="Pavel Ahmed Joy - 3D Creator" decoding="sync" loading="eager"`);

fs.writeFileSync('src/sections/HeroSection.tsx', code);
