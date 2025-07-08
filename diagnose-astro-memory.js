#!/usr/bin/env node
// diagnose-astro-memory.js - Check memory usage and performance issues

import fs from 'fs';
import os from 'os';

console.log('===== Astro Memory & Performance Diagnostic Tool =====');
console.log('');

// System info
const totalMem = os.totalmem() / 1024 / 1024 / 1024; // GB
const freeMem = os.freemem() / 1024 / 1024 / 1024; // GB
console.log(`System Memory: ${totalMem.toFixed(2)} GB total, ${freeMem.toFixed(2)} GB free (${((freeMem/totalMem)*100).toFixed(1)}% available)`);
console.log(`CPU: ${os.cpus().length} cores, ${os.cpus()[0].model}`);
console.log(`Platform: ${os.platform()} ${os.release()}`);
console.log(`Node.js: ${process.version}`);
console.log('');

// Check Node.js memory limit
const nodeOptions = process.env.NODE_OPTIONS || '';
const memLimitMatch = nodeOptions.match(/--max-old-space-size=(\d+)/);
const memLimit = memLimitMatch ? parseInt(memLimitMatch[1]) : 0;

console.log('===== Node.js Memory Configuration =====');
if (memLimit) {
  console.log(`Node.js memory limit: ${memLimit} MB (${(memLimit/1024).toFixed(2)} GB)`);
  if (memLimit < 4096 && totalMem > 8) {
    console.log('⚠️ RECOMMENDATION: Increase Node.js memory limit to 4096MB or higher');
    console.log('   Add NODE_OPTIONS="--max-old-space-size=4096" to your scripts');
  }
} else {
  console.log('⚠️ No explicit Node.js memory limit set');
  console.log('   RECOMMENDATION: Add NODE_OPTIONS="--max-old-space-size=4096" to your scripts');
}
console.log('');

// Check package.json
let packageData;
try {
  packageData = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log('===== Package Analysis =====');
  const depCount = Object.keys(packageData.dependencies || {}).length;
  const devDepCount = Object.keys(packageData.devDependencies || {}).length;
  
  console.log(`Dependencies: ${depCount} production, ${devDepCount} development (${depCount + devDepCount} total)`);
  
  // Check for problematic dependencies
  const allDeps = {
    ...(packageData.dependencies || {}),
    ...(packageData.devDependencies || {})
  };
  
  const largePackages = [
    '@resvg/resvg-js',
    'sharp',
    'satori',
    'puppeteer',
    'playwright',
    'react',
    'react-dom',
    'three',
    '@astrojs/react'
  ];
  
  console.log('\nPotentially resource-intensive packages:');
  largePackages.forEach(pkg => {
    if (allDeps[pkg]) {
      console.log(`- ${pkg}: ${allDeps[pkg]}`);
    }
  });
  
  // Check Astro version
  if (allDeps.astro) {
    console.log(`\nAstro version: ${allDeps.astro}`);
    if (allDeps.astro.includes('^5.')) {
      console.log('✅ Using Astro 5.x (latest major version)');
    } else {
      console.log('⚠️ Not using latest major version of Astro');
      console.log('   Consider upgrading to Astro 5.x for better performance');
    }
  }
  
  console.log('');
} catch (err) {
  console.log('❌ Error reading package.json:', err.message);
}

// Check astro.config.ts
console.log('===== Astro Configuration Analysis =====');
try {
  const configPath = fs.existsSync('astro.config.ts') 
    ? 'astro.config.ts' 
    : (fs.existsSync('astro.config.mjs') ? 'astro.config.mjs' : 'astro.config.js');
  
  if (fs.existsSync(configPath)) {
    const configContent = fs.readFileSync(configPath, 'utf8');
    
    // Check for potential issues
    console.log('Checking for potential configuration issues:');
    
    // Check import statements
    if (configContent.includes('import { defineConfig } from "astro";')) {
      console.log('❌ Incorrect import: import { defineConfig } from "astro";');
      console.log('   Should be: import { defineConfig } from "astro/config";');
    } else if (configContent.includes('import { defineConfig } from "astro/config";')) {
      console.log('✅ Correct import: import { defineConfig } from "astro/config";');
    }
    
    // Check for direct imports that could be lazy-loaded
    const directImports = configContent.match(/import [^{].*? from ['"]@astrojs\/.+?['"]/g) || [];
    if (directImports.length > 0) {
      console.log('\n⚠️ Direct imports that could be lazy-loaded to improve startup time:');
      directImports.forEach(imp => console.log(`   ${imp}`));
      console.log('\n   Consider using lazy imports like:');
      console.log('   const getTailwind = async () => {');
      console.log('     const tailwind = (await import("@astrojs/tailwind")).default;');
      console.log('     return tailwind({ applyBaseStyles: false });');
      console.log('   };');
    }
    
    // Check for SSR mode
    if (configContent.includes('output: "server"')) {
      console.log('\n⚠️ Using SSR output mode which is more resource-intensive');
    }
    
    // Check for vite configuration
    if (!configContent.includes('vite:') || !configContent.includes('optimizeDeps:')) {
      console.log('\n⚠️ Missing Vite optimization settings');
      console.log('   Consider adding:');
      console.log('   vite: {');
      console.log('     optimizeDeps: {');
      console.log('       include: [\'@resvg/resvg-js\', \'react\', \'react-dom\'],');
      console.log('     },');
      console.log('   },');
    }
  } else {
    console.log('❌ Could not find Astro config file');
  }
} catch (err) {
  console.log('❌ Error analyzing Astro config:', err.message);
}

console.log('');
console.log('===== Recommendations =====');
console.log('1. Use lazy loading for integrations in astro.config.ts');
console.log('2. Set NODE_OPTIONS="--max-old-space-size=4096" for builds');
console.log('3. Clear caches before builds: rm -rf .astro dist node_modules/.vite');
console.log('4. Consider using the optimized configuration file provided: astro.config.optimized.ts');
console.log('5. Run the fix-ssr-timeout.sh script to test with minimal configuration');
console.log('\nFor more help, see: https://docs.astro.build/en/guides/troubleshooting/');
