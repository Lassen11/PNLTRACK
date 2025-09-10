// Script to fix MIME types in build files
const fs = require('fs');
const path = require('path');

const buildDir = 'build';

function fixMimeTypes(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fixMimeTypes(filePath);
    } else if (file.endsWith('.js')) {
      // Rename .js to .mjs to force correct MIME type
      const newPath = filePath.replace('.js', '.mjs');
      fs.renameSync(filePath, newPath);
      console.log(`Renamed ${filePath} to ${newPath}`);
    }
  });
}

// Update index.html to reference .mjs files
const indexPath = path.join(buildDir, 'index.html');
if (fs.existsSync(indexPath)) {
  let content = fs.readFileSync(indexPath, 'utf8');
  content = content.replace(/\.js/g, '.mjs');
  fs.writeFileSync(indexPath, content);
  console.log('Updated index.html to reference .mjs files');
}

fixMimeTypes(buildDir);
console.log('MIME type fix completed');
