const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');
if (!css.includes('overscroll-behavior: none;')) {
  css = css.replace(/body \{/, "body {\n  overscroll-behavior: none;");
}
fs.writeFileSync('src/index.css', css);
