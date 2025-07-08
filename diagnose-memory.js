// Script to diagnose memory usage issues with Node.js
// Run with: node diagnose-memory.js

const os = require('os');
const v8 = require('v8');
const fs = require('fs');
const path = require('path');

// Print system information
console.log('=== System Information ===');
console.log(`Node version: ${process.version}`);
console.log(`Platform: ${os.platform()} ${os.release()}`);
console.log(`Architecture: ${os.arch()}`);
console.log(`CPUs: ${os.cpus().length} cores`);
console.log(`Total memory: ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`);
console.log(`Free memory: ${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`);

// Print Node.js memory limits
console.log('\n=== Node.js Memory Information ===');
console.log(`Process memory usage: ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`);
console.log(`V8 heap size limit: ${(v8.getHeapStatistics().heap_size_limit / 1024 / 1024).toFixed(2)} MB`);

// Check for memory flags
console.log('\n=== Memory Flags ===');
const maxOldSpace = process.env.NODE_OPTIONS?.match(/--max-old-space-size=(\d+)/);
if (maxOldSpace) {
  console.log(`--max-old-space-size flag detected: ${maxOldSpace[1]} MB`);
} else {
  console.log('--max-old-space-size flag not detected');
}

// Check project size
console.log('\n=== Project Statistics ===');

// Count files by extension
function countFilesByExtension(dir, extensions = {}, ignoreDirs = ['node_modules', '.git', 'dist', '.astro']) {
  try {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !ignoreDirs.includes(file)) {
        countFilesByExtension(filePath, extensions, ignoreDirs);
      } else if (stat.isFile()) {
        const ext = path.extname(file).toLowerCase();
        if (ext) {
          extensions[ext] = (extensions[ext] || 0) + 1;
        }
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${dir}: ${err.message}`);
  }
  
  return extensions;
}

// Get project root
const projectRoot = process.cwd();
console.log(`Project directory: ${projectRoot}`);

// Count files by extension
const filesByExtension = countFilesByExtension(projectRoot);
console.log('\nFile count by extension:');
Object.entries(filesByExtension)
  .sort((a, b) => b[1] - a[1])
  .forEach(([ext, count]) => {
    console.log(`${ext}: ${count} files`);
  });

// Check for common performance issues
console.log('\n=== Astro Performance Checks ===');
try {
  // Check if using SSR
  const astroConfigPath = path.join(projectRoot, 'astro.config.ts');
  if (fs.existsSync(astroConfigPath)) {
    const astroConfig = fs.readFileSync(astroConfigPath, 'utf8');
    
    if (astroConfig.includes('output: "server"')) {
      console.log('⚠️ Using SSR (output: "server") which requires more resources');
    }
    
    // Check for many integrations
    const integrationMatches = astroConfig.match(/integrations:\s*\[([^[\]]*)\]/s);
    if (integrationMatches) {
      const integrationCount = (integrationMatches[1].match(/,/g) || []).length + 1;
      if (integrationCount > 3) {
        console.log(`⚠️ Found ${integrationCount} integrations - consider reducing if possible`);
      } else {
        console.log(`✓ Using a reasonable number of integrations (${integrationCount})`);
      }
    }
    
    // Check for React integration
    if (astroConfig.includes('@astrojs/react')) {
      console.log('⚠️ Using React integration which increases bundle size');
    }
  }
  
  // Check package.json for dev dependencies
  const packageJsonPath = path.join(projectRoot, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const devDependencyCount = Object.keys(packageJson.devDependencies || {}).length;
    const dependencyCount = Object.keys(packageJson.dependencies || {}).length;
    
    console.log(`Total dependencies: ${dependencyCount + devDependencyCount} (${dependencyCount} prod, ${devDependencyCount} dev)`);
    
    if (dependencyCount + devDependencyCount > 20) {
      console.log('⚠️ Large number of dependencies may impact build performance');
    }
  }
  
} catch (err) {
  console.error(`Error checking for performance issues: ${err.message}`);
}

console.log('\n=== Recommendations ===');
console.log('1. Use NODE_OPTIONS="--max-old-space-size=4096" for builds');
console.log('2. Consider reducing the number of integrations');
console.log('3. Make sure to clear .astro and .vite caches when having build issues');
console.log('4. Use lazily loaded imports in astro.config.ts for better startup time');
