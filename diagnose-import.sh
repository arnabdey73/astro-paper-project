#!/bin/bash
# Script to specifically diagnose import errors in astro.config.ts

echo "=== Astro Import Diagnosis Tool ==="
echo "Checking for Astro version and dependencies..."

# Check Astro version
echo -n "Astro version: "
npx astro --version

# Check package.json
echo ""
echo "Package.json dependencies:"
grep -A 20 '"dependencies"' ./package.json

echo ""
echo "=== Creating minimal test file ==="

# Create a minimal test file
cat > ./test-astro-import.js << 'EOF'
// Test ESM imports to diagnose issues
console.log("Testing Astro imports...");

// Try importing defineConfig from different locations
try {
  const astro = await import('astro');
  console.log("✅ import 'astro' succeeded");
  console.log("  Has defineConfig:", !!astro.defineConfig);
} catch (error) {
  console.log("❌ import 'astro' failed:", error.message);
}

try {
  const astroConfig = await import('astro/config');
  console.log("✅ import 'astro/config' succeeded");
  console.log("  Has defineConfig:", !!astroConfig.defineConfig);
} catch (error) {
  console.log("❌ import 'astro/config' failed:", error.message);
}

try {
  const pkg = await import('./package.json', { assert: { type: 'json' } });
  console.log("\nDetected dependencies:");
  console.log("- Astro:", pkg.default.dependencies.astro);
  if (pkg.default.dependencies["@astrojs/vercel"]) {
    console.log("- @astrojs/vercel:", pkg.default.dependencies["@astrojs/vercel"]);
  }
} catch (error) {
  console.log("\nCouldn't load package.json:", error.message);
}
EOF

# Make it executable
chmod +x ./test-astro-import.js

echo ""
echo "=== Running test script ==="
echo "This will show which import path works for your Astro version"

# Run with Node.js
node --experimental-json-modules ./test-astro-import.js

echo ""
echo "=== Recommendations ==="
echo "Based on the test results above:"
echo "1. Use the import path that shows '✅ succeeded' and 'Has defineConfig: true'"
echo "2. Update your astro.config.ts to use that import path"
echo "3. If both imports fail, try reinstalling dependencies with 'npm install'"
echo ""
echo "To fix your configuration:"
echo "- Edit astro.config.ts and fix the import statement"
echo "- Try running 'npm run dev' again"
