const fs = require('fs');
const path = './src/data/projects.ts';

let content = fs.readFileSync(path, 'utf-8');

// Replace drive.usercontent.google.com with drive.google.com preview links
content = content.replace(/https:\/\/drive\.usercontent\.google\.com\/download\?id=([a-zA-Z0-9_-]+)&export=download/g, 'https://drive.google.com/file/d/$1/preview');

fs.writeFileSync(path, content);
console.log('Links updated.');
