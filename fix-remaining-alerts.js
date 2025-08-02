const fs = require('fs');
const path = require('path');

// Get all TypeScript files in the app directory
function getAllTsxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      getAllTsxFiles(filePath, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    // Check if file contains alert
    if (content.includes('alert(')) {
      // Add toast import if not present
      if (!content.includes('import toast from \'react-hot-toast\'')) {
        // Find the last import statement
        const importRegex = /import.*from.*['"];/g;
        const imports = content.match(importRegex);
        if (imports && imports.length > 0) {
          const lastImport = imports[imports.length - 1];
          content = content.replace(lastImport, lastImport + '\nimport toast from \'react-hot-toast\';');
          changed = true;
        }
      }
      
      // Replace all alert calls
      const originalContent = content;
      content = content.replace(/alert\('([^']+)'\)/g, (match, message) => {
        if (message.toLowerCase().includes('success') || 
            message.toLowerCase().includes('updated') || 
            message.toLowerCase().includes('created') || 
            message.toLowerCase().includes('added') || 
            message.toLowerCase().includes('saved')) {
          return `toast.success('${message}')`;
        }
        return `toast.error('${message}')`;
      });
      
      content = content.replace(/alert\("([^"]+)"\)/g, (match, message) => {
        if (message.toLowerCase().includes('success') || 
            message.toLowerCase().includes('updated') || 
            message.toLowerCase().includes('created') || 
            message.toLowerCase().includes('added') || 
            message.toLowerCase().includes('saved')) {
          return `toast.success("${message}")`;
        }
        return `toast.error("${message}")`;
      });
      
      content = content.replace(/alert\(`([^`]+)`\)/g, (match, message) => {
        if (message.toLowerCase().includes('success') || 
            message.toLowerCase().includes('updated') || 
            message.toLowerCase().includes('created') || 
            message.toLowerCase().includes('added') || 
            message.toLowerCase().includes('saved')) {
          return `toast.success(\`${message}\`)`;
        }
        return `toast.error(\`${message}\`)`;
      });
      
      if (content !== originalContent) {
        changed = true;
      }
    }
    
    if (changed) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed: ${filePath}`);
    }
  } catch (error) {
    console.log(`❌ Error fixing ${filePath}:`, error.message);
  }
}

// Get all files and fix them
const appDir = path.join(__dirname, 'app');
const allFiles = getAllTsxFiles(appDir);

console.log(`Found ${allFiles.length} TypeScript files`);

let fixedCount = 0;
allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('alert(')) {
    fixFile(file);
    fixedCount++;
  }
});

console.log(`\n🎉 Fixed ${fixedCount} files with alert() calls!`);