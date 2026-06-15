const fs = require('fs');
const path = require('path');

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (p.endsWith('.ts') || p.endsWith('.tsx')) {
      let c = fs.readFileSync(p, 'utf8');
      
      // Fix void("str", err) to void(err)
      let nc = c.replace(/void\((['"`]).*?\1,\s*(.*?)\)/g, 'void($2)');
      
      // Fix specific test errors
      if (p.includes('community-dashboard.test.tsx')) {
        nc = nc.replace(/<CommunityDashboard \/>/g, '<CommunityDashboard apiKey="dummy" />');
      }
      if (p.includes('home.test.tsx')) {
        nc = nc.replace(/<HeroSection \/>/g, '<HeroSection userId="dummy" />');
      }
      
      if (c !== nc) {
        fs.writeFileSync(p, nc);
        console.log('Fixed', p);
      }
    }
  });
}

walk('src');
walk('tests');

// Also fix footprint-history.tsx TS2322 error: 
// Type '(value: string | number) => [string, string]' is not assignable to type 'Formatter...
const fhPath = 'src/components/carbon-calculator/footprint-history.tsx';
if (fs.existsSync(fhPath)) {
  let fhContent = fs.readFileSync(fhPath, 'utf8');
  fhContent = fhContent.replace(/formatter=\{\(value: string \| number\)/g, 'formatter={(value: any)');
  fs.writeFileSync(fhPath, fhContent);
  console.log('Fixed', fhPath);
}
