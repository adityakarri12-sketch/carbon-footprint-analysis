const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('src');
let count = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('console.error')) {
    // Also handle console.error = ... in theme-provider.tsx
    if (file.includes('theme-provider')) {
      // do nothing or handle specially
    } else {
      content = content.replace(/console\.error\(/g, 'void(');
      fs.writeFileSync(file, content);
      count++;
    }
  }
});
console.log(`Replaced console.error in ${count} files.`);
