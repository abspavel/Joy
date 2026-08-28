const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const fontLinks = `
    <!-- Preconnect to Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
`;

code = code.replace('<!-- Supabase DNS & Connection Optimization -->', fontLinks + '\n    <!-- Supabase DNS & Connection Optimization -->');
fs.writeFileSync('index.html', code);
