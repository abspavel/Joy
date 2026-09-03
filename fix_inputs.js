const fs = require('fs');
const path = require('path');

const dir = 'src/admin/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('Admin.tsx'));

files.forEach(file => {
  let content = fs.readFileSync(path.join(dir, file), 'utf8');
  let original = content;

  // Replace <input ... value={x.y} onChange={e => updateSomething(x.id, 'prop', e.target.value)} ... />
  
  // We can just replace the tags safely by regex.
  // Actually, there are only 3 files that need it primarily.
  // ServicesAdmin.tsx, ProjectsAdmin.tsx, TestimonialsAdmin.tsx

  if (file === 'ServicesAdmin.tsx' || file === 'ProjectsAdmin.tsx' || file === 'TestimonialsAdmin.tsx') {
    // Inject EditableField import if not exists
    if (!content.includes('EditableField')) {
      content = content.replace("from 'lucide-react';", "from 'lucide-react';\nimport { EditableField } from './EditableField';");
    }

    // Replace inputs:
    // onChange={e => updateX(id, 'field', e.target.value)}
    // with onSave={val => updateX(id, 'field', val)}
    
    // First, change <input to <EditableField and <textarea to <EditableField type="textarea" 
    // ONLY for those that have onChange={e => update
    
    const inputRegex = /<input([^>]*?)onChange=\{e\s*=>\s*update([a-zA-Z]+)\(([^,]+),\s*'([^']+)',\s*(parseInt\(e\.target\.value\)|e\.target\.value)\)\}([^>]*?)\/>/g;
    
    content = content.replace(inputRegex, (match, before, funcName, idArg, fieldArg, valueArg, after) => {
        let saveArg = 'val';
        let parse = valueArg.includes('parseInt') ? 'parseInt(val)' : 'val';
        return `<EditableField${before}onSave={val => update${funcName}(${idArg}, '${fieldArg}', ${parse})}${after}/>`;
    });

    const textareaRegex = /<textarea([^>]*?)onChange=\{e\s*=>\s*update([a-zA-Z]+)\(([^,]+),\s*'([^']+)',\s*e\.target\.value\)\}([^>]*?)(?:\/>|><\/textarea>)/g;
    content = content.replace(textareaRegex, (match, before, funcName, idArg, fieldArg, after) => {
        return `<EditableField type="textarea"${before}onSave={val => update${funcName}(${idArg}, '${fieldArg}', val)}${after}/>`;
    });
    
    if (content !== original) {
      fs.writeFileSync(path.join(dir, file), content, 'utf8');
      console.log(`Updated ${file}`);
    }
  }
});
