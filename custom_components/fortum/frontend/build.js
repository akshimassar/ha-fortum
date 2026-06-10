/**
 * Build script for Fortum Energy frontend.
 *
 * Bundles source files from src/ into dist/fortum-energy-strategy.js
 * with Lit included for HA 2026.6+ tooltip compatibility.
 *
 * Usage:
 *   npm run build        # One-time build
 *   npm run watch        # Watch mode for development
 */

import * as esbuild from "esbuild";

const isWatch = process.argv.includes("--watch");

/** @type {esbuild.BuildOptions} */
const buildOptions = {
  entryPoints: ["src/fortum-energy-strategy.js"],
  bundle: true,
  format: "esm",
  outfile: "dist/fortum-energy-strategy.js",
  minify: !isWatch,
  sourcemap: isWatch ? "inline" : false,
  target: ["es2022"],
  // Mark paths that should remain external (resolved at runtime by HA)
  // None needed - we bundle everything
  logLevel: "info",
};

if (isWatch) {
  const ctx = await esbuild.context(buildOptions);
  await ctx.watch();
  console.log("Watching for changes...");
} else {
  await esbuild.build(buildOptions);
  console.log("Build complete: dist/fortum-energy-strategy.js");
}
