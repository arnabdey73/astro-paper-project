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
