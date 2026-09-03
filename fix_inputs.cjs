const fs = require('fs');
const path = require('path');

const dir = 'src/admin/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('Admin.tsx'));

files.forEach(file => {
  let content = fs.readFileSync(path.join(dir, file), 'utf8');
  let original = content;

  if (file === 'ServicesAdmin.tsx' || file === 'ProjectsAdmin.tsx' || file === 'TestimonialsAdmin.tsx') {
    if (!content.includes('EditableField')) {
      content = content.replace("from 'lucide-react';", "from 'lucide-react';\nimport { EditableField } from './EditableField';");
    }

    const inputRegex = /<input([^>]*?)onChange=\{e\s*=>\s*update([a-zA-Z0-9_]+)\(([^,]+),\s*'([^']+)',\s*(parseInt\(e\.target\.value\)|e\.target\.value)\)\}([^>]*?)\/>/g;
    
    content = content.replace(inputRegex, (match, before, funcName, idArg, fieldArg, valueArg, after) => {
        let parse = valueArg.includes('parseInt') ? 'parseInt(val)' : 'val';
        return `<EditableField${before}onSave={val => update${funcName}(${idArg}, '${fieldArg}', ${parse})}${after}/>`;
    });

    const textareaRegex = /<textarea([^>]*?)onChange=\{e\s*=>\s*update([a-zA-Z0-9_]+)\(([^,]+),\s*'([^']+)',\s*e\.target\.value\)\}([^>]*?)(?:\/>|><\/textarea>)/g;
    content = content.replace(textareaRegex, (match, before, funcName, idArg, fieldArg, after) => {
        return `<EditableField type="textarea"${before}onSave={val => update${funcName}(${idArg}, '${fieldArg}', val)}${after}/>`;
    });
    
    if (content !== original) {
      fs.writeFileSync(path.join(dir, file), content, 'utf8');
      console.log(`Updated ${file}`);
    }
  }
});
