const fs = require('fs');
const path = require('path');

// Files that need to be fixed
const filesToFix = [
  'app/admin/services/page.tsx',
  'app/admin/products-page/page.tsx',
  'app/admin/products/components/ProductForm-fixed.tsx',
  'app/admin/products/page-fixed.tsx'
];

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add toast import if not present
    if (!content.includes('import toast from \'react-hot-toast\'')) {
      // Find the last import statement
      const importRegex = /import.*from.*['"];/g;
      const imports = content.match(importRegex);
      if (imports && imports.length > 0) {
        const lastImport = imports[imports.length - 1];
        content = content.replace(lastImport, lastImport + '\nimport toast from \'react-hot-toast\';');
      }
    }
    
    // Replace all alert calls
    content = content.replace(/alert\('([^']+)'\)/g, "toast.error('$1')");
    content = content.replace(/alert\("([^"]+)"\)/g, 'toast.error("$1")');
    content = content.replace(/alert\(`([^`]+)`\)/g, 'toast.error(`$1`)');
    
    // Replace success messages
    content = content.replace(/toast\.error\('([^']*success[^']*|[^']*updated[^']*|[^']*added[^']*|[^']*created[^']*|[^']*saved[^']*)'\)/gi, "toast.success('$1')");
    content = content.replace(/toast\.error\("([^"]*success[^"]*|[^"]*updated[^"]*|[^"]*added[^"]*|[^"]*created[^"]*|[^"]*saved[^"]*)"\)/gi, 'toast.success("$1")');
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed: ${filePath}`);
  } catch (error) {
    console.log(`❌ Error fixing ${filePath}:`, error.message);
  }
}

// Fix all files
filesToFix.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    fixFile(fullPath);
  } else {
    console.log(`⚠️  File not found: ${fullPath}`);
  }
});

console.log('\n🎉 Alert replacement completed!');