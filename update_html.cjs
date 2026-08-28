const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');
content = content.replace(
  '<link rel="preload" href="/joy-photo-transparent.png" as="image" type="image/png" />',
  '<link rel="preload" href="/joy-photo-transparent.png" as="image" type="image/png" fetchpriority="high" />'
);
fs.writeFileSync('index.html', content);
