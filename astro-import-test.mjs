// Astro import test utility
// Run with: node astro-import-test.mjs

console.log("Testing Astro import options...");

// Try different import paths
async function testImports() {
  try {
    const astroConfig = await import('astro/config');
    console.log("✓ import from 'astro/config' works!");
    console.log("  - defineConfig exists:", !!astroConfig.defineConfig);
    
    if (astroConfig.defineConfig) {
      console.log("\n=== Use this import: ===");
      console.log("import { defineConfig } from 'astro/config';");
    }
  } catch (error) {
    console.log("✗ import from 'astro/config' failed:", error.message);
  }
  
  try {
    const astro = await import('astro');
    console.log("\n✓ import from 'astro' works!");
    console.log("  - defineConfig exists:", !!astro.defineConfig);
    
    if (astro.defineConfig) {
      console.log("\n=== Use this import: ===");
      console.log("import { defineConfig } from 'astro';");
    }
  } catch (error) {
    console.log("\n✗ import from 'astro' failed:", error.message);
  }
  
  // Print recommendation
  console.log("\n=== Recommendation ===");
  console.log("Update your astro.config.ts to use the import that worked above.");
  console.log("If both worked, prefer the one from 'astro/config' for compatibility.");
  console.log("If neither worked, you may need to reinstall Astro.");
}

testImports().catch(error => {
  console.error("Test failed:", error);
});
