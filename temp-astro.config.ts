// Ultra-minimal configuration for debugging purposes
import { defineConfig } from "astro/config";
import { SITE } from "./src/config";

// Simplest possible config to test if Astro can start
export default defineConfig({
  site: SITE.website,
  output: "static"
});
