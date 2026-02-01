#!/usr/bin/env node

/**
 * CSS Validation Script
 *
 * Detects common CSS/Tailwind issues:
 * 1. Missing globals.css import in layout
 * 2. Tailwind directives missing in globals.css
 * 3. PostCSS config missing tailwindcss plugin
 * 4. Tailwind content paths misconfigured
 *
 * Run with: npm run validate:css
 */

const fs = require('fs');
const path = require('path');

const errors = [];
const warnings = [];

console.log('🔍 Validating CSS/Tailwind configuration...\n');

// Check 1: globals.css exists and has Tailwind directives
const globalsPath = path.join(process.cwd(), 'app', 'globals.css');
if (fs.existsSync(globalsPath)) {
  const globalsContent = fs.readFileSync(globalsPath, 'utf-8');
  if (!globalsContent.includes('@tailwind')) {
    errors.push('❌ globals.css is missing @tailwind directives');
  } else {
    console.log('✅ globals.css contains @tailwind directives');
  }
} else {
  errors.push('❌ app/globals.css not found');
}

// Check 2: layout.tsx imports globals.css
const layoutPath = path.join(process.cwd(), 'app', 'layout.tsx');
if (fs.existsSync(layoutPath)) {
  const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
  if (!layoutContent.includes('globals.css')) {
    errors.push('❌ app/layout.tsx does not import globals.css');
  } else {
    console.log('✅ app/layout.tsx imports globals.css');
  }
} else {
  errors.push('❌ app/layout.tsx not found');
}

// Check 3: PostCSS config
const postcssPath = path.join(process.cwd(), 'postcss.config.mjs');
if (fs.existsSync(postcssPath)) {
  const postcssContent = fs.readFileSync(postcssPath, 'utf-8');
  if (!postcssContent.includes('tailwindcss')) {
    errors.push('❌ postcss.config.mjs does not include tailwindcss plugin');
  } else {
    console.log('✅ postcss.config.mjs includes tailwindcss plugin');
  }
} else {
  warnings.push('⚠️  postcss.config.mjs not found (may be using defaults)');
}

// Check 4: Tailwind config
const tailwindPath = path.join(process.cwd(), 'tailwind.config.ts');
if (fs.existsSync(tailwindPath)) {
  const tailwindContent = fs.readFileSync(tailwindPath, 'utf-8');
  const hasContent = tailwindContent.includes('content');
  if (!hasContent) {
    warnings.push('⚠️  tailwind.config.ts may be missing content paths');
  } else {
    console.log('✅ tailwind.config.ts includes content paths');
  }
} else {
  errors.push('❌ tailwind.config.ts not found');
}

// Check 5: Verify .next directory is clean (potential cache issue)
const nextDir = path.join(process.cwd(), '.next');
if (fs.existsSync(nextDir)) {
  const nextDirSize = getDirectorySize(nextDir);
  if (nextDirSize === 0) {
    warnings.push('⚠️  .next directory is empty - run npm run build to rebuild');
  } else {
    console.log(`✅ .next directory exists (${Math.round(nextDirSize / 1024 / 1024)}MB)`);
  }
}

// Print results
console.log('\n' + '='.repeat(60));
if (warnings.length > 0) {
  console.log('\n⚠️  Warnings:');
  warnings.forEach(w => console.log('  ' + w));
}

if (errors.length > 0) {
  console.log('\n❌ Errors found:');
  errors.forEach(e => console.log('  ' + e));
  console.log('\n💡 Fix these issues and clear cache with: npm run clean');
  process.exit(1);
} else {
  console.log('\n✅ All CSS configuration checks passed!');
  console.log('\nIf styles are still not showing:');
  console.log('  1. Run: npm run clean');
  console.log('  2. Run: npm run dev:clean');
  console.log('  3. Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+F5)');
  process.exit(0);
}

function getDirectorySize(dirPath) {
  let size = 0;
  const files = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const file of files) {
    const filePath = path.join(dirPath, file.name);
    if (file.isDirectory()) {
      size += getDirectorySize(filePath);
    } else {
      size += fs.statSync(filePath).size;
    }
  }
  return size;
}
