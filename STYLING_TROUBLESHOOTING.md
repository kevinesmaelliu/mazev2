# Styling & CSS Troubleshooting Guide

## Quick Fix for Missing Styles

If the app loads but styles (colors, spacing, borders) are not showing:

### Step 1: Validate CSS Configuration
```bash
npm run validate:css
```

This checks:
- ✅ `globals.css` has `@tailwind` directives
- ✅ `app/layout.tsx` imports `globals.css`
- ✅ `postcss.config.mjs` has tailwindcss plugin
- ✅ `tailwind.config.ts` has content paths
- ✅ `.next` build cache exists

### Step 2: Clear Cache and Rebuild
```bash
npm run clean        # Clear .next and node_modules cache
npm run dev:clean    # Clean rebuild for development
# OR
npm run build:clean  # Clean rebuild for production
```

### Step 3: Hard Refresh Browser
- **Mac**: `Cmd + Shift + R`
- **Windows/Linux**: `Ctrl + Shift + F5`

---

## Why This Happens (Root Causes)

### 1. **Build Cache Corruption** (Most Common)
- `.next` directory becomes out of sync
- Tailwind CSS file generation fails silently
- **Solution**: `npm run clean && npm run dev:clean`

### 2. **CSS File Not Imported**
- `app/layout.tsx` doesn't import `app/globals.css`
- **Solution**: Verify line 4 of `app/layout.tsx`:
  ```tsx
  import "./globals.css";
  ```

### 3. **Missing Tailwind Directives**
- `globals.css` missing `@tailwind` statements
- **Solution**: Verify `globals.css` contains:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```

### 4. **PostCSS Configuration Issue**
- `postcss.config.mjs` doesn't include tailwindcss
- **Solution**: Verify it contains:
  ```js
  const config = {
    plugins: {
      tailwindcss: {},
    },
  };
  ```

### 5. **Browser Cache**
- Browser serving stale HTML without CSS
- **Solution**: Hard refresh (Cmd+Shift+R or Ctrl+Shift+F5)

---

## Validation Checklist

Run this before reporting style issues:

```bash
npm run validate:css
```

This script automatically checks:
1. ✅ `globals.css` exists and has `@tailwind` directives
2. ✅ `layout.tsx` imports `globals.css`
3. ✅ `postcss.config.mjs` includes tailwindcss
4. ✅ `tailwind.config.ts` has content paths
5. ✅ `.next` build directory is populated

---

## Prevention Strategy

### Automatic Detection
Every time you run:
- `npm run dev` - Start development
- `npm run build` - Build for production

Check if CSS is properly configured by running:
```bash
npm run validate:css
```

### Git Hook (Optional)
To prevent committing broken CSS config, add to `.git/hooks/pre-commit`:
```bash
npm run validate:css || exit 1
```

---

## Complete Fix Sequence

If styles are completely broken, run in order:

```bash
# 1. Clean everything
npm run clean

# 2. Clean rebuild dev
npm run dev:clean

# 3. Validate configuration
npm run validate:css

# 4. Hard refresh browser
# Mac: Cmd+Shift+R
# Windows/Linux: Ctrl+Shift+F5
```

---

## Files to Check Manually

If the above doesn't work, verify these files manually:

### 1. `app/layout.tsx` (Line 4)
```tsx
import "./globals.css";  // ← Must be present
```

### 2. `app/globals.css` (Lines 1-3)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 3. `postcss.config.mjs`
```js
const config = {
  plugins: {
    tailwindcss: {},  // ← tailwindcss must be here
  },
};
```

### 4. `tailwind.config.ts` (Lines 5-9)
```ts
content: [
  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
],
```

---

## Emergency Nuclear Option

If nothing else works:

```bash
# Delete all caches and dependencies
rm -rf .next
rm -rf node_modules
rm -rf package-lock.json

# Reinstall everything
npm install

# Rebuild
npm run build

# Run
npm run dev
```

---

## Reporting Issues

Before reporting a styling bug, always:

1. Run `npm run validate:css` - screenshot result
2. Run `npm run clean`
3. Hard refresh browser
4. If still broken, include:
   - Output of `npm run validate:css`
   - Screenshot of the issue
   - Browser console errors (F12 → Console)
