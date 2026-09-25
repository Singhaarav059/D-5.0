// Syntax-checks every first-party JavaScript file (node --check). Run: npm run check
// Vendor libraries in public/assets/vendor are third-party builds and are skipped.
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dirs = ['.', 'lib', 'src', 'scripts', 'test', 'public/assets'];
const files = dirs.flatMap((dir) => fs.readdirSync(path.join(root, dir))
  .filter((f) => f.endsWith('.js'))
  .map((f) => path.join(dir, f)));

let failed = 0;
for (const file of files) {
  try {
    execFileSync(process.execPath, ['--check', path.join(root, file)], { stdio: 'pipe' });
  } catch (error) {
    failed++;
    console.error(`✖ ${file}\n${error.stderr}`);
  }
}
console.log(`${files.length - failed}/${files.length} files passed the syntax check`);
process.exit(failed ? 1 : 0);
