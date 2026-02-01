# Setting Up Git Hooks for CSS Validation

This guide helps you automatically validate CSS configuration before committing, preventing styling issues.

## Option 1: Manual Pre-Commit Hook (Recommended)

This is the simplest and doesn't require additional dependencies.

### Setup

1. Create `.git/hooks/pre-commit`:
```bash
mkdir -p .git/hooks
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/sh
# Validate CSS configuration before commit

echo "🔍 Validating CSS configuration..."
npm run validate:css

if [ $? -ne 0 ]; then
  echo ""
  echo "❌ CSS validation failed. Fix issues and try again."
  echo "Run: npm run clean && npm run dev:clean"
  exit 1
fi

echo "✅ CSS validation passed"
exit 0
EOF
chmod +x .git/hooks/pre-commit
```

2. Test it:
```bash
git add .
git commit -m "test"  # Should run validation
```

### Benefits
- ✅ No dependencies needed
- ✅ Runs before every commit
- ✅ Can still bypass with `git commit --no-verify` if needed
- ✅ Works immediately

---

## Option 2: Using Husky + lint-staged

For teams that want more comprehensive hooks:

### Setup

```bash
npm install husky lint-staged --save-dev
npx husky install
npx husky add .husky/pre-commit "npm run validate:css"
```

### Add to `package.json`:
```json
{
  "lint-staged": {
    "*.{tsx,ts}": ["eslint --fix", "npm run validate:css"],
    "*.css": ["npm run validate:css"]
  }
}
```

### Benefits
- ✅ More flexible
- ✅ Can run multiple checks
- ✅ Integrates with linting
- ✅ Great for team collaboration

---

## Testing Your Hook

After setup, test that it works:

```bash
# This should trigger validation
git add .
git commit -m "test commit"

# You should see:
# 🔍 Validating CSS configuration...
# ✅ All CSS configuration checks passed!
# ✅ CSS validation passed
```

---

## What the Hook Checks

The `npm run validate:css` script checks:

1. ✅ `globals.css` contains `@tailwind` directives
2. ✅ `app/layout.tsx` imports `globals.css`
3. ✅ `postcss.config.mjs` includes tailwindcss
4. ✅ `tailwind.config.ts` has content paths
5. ✅ `.next` build cache is populated

If any of these fail, the commit is blocked with helpful error messages.

---

## Bypass If Needed

Sometimes you need to commit without running validation:

```bash
git commit --no-verify
# Skips pre-commit hooks
```

⚠️ **Use sparingly** - these checks exist to prevent broken styling!

---

## Troubleshooting

### Hook doesn't run after setup

```bash
# Check if hook exists and is executable
ls -l .git/hooks/pre-commit

# Make it executable
chmod +x .git/hooks/pre-commit
```

### "npm run validate:css" command not found

```bash
# Verify script is in package.json
grep "validate:css" package.json

# Rebuild hooks
rm -rf .git/hooks
npx husky install  # if using husky
# OR manually recreate .git/hooks/pre-commit
```

### Want to disable hooks temporarily

```bash
# Disable all hooks
rm -rf .git/hooks

# Re-enable hooks
npm install  # if using husky
# OR manually recreate .git/hooks/pre-commit
```

---

## Automation Tips

### Run before pushing
Add to `.git/hooks/pre-push`:
```bash
npm run validate:css && npm run build
```

### Run on every dev restart
Add to terminal profile (`~/.zshrc` or `~/.bashrc`):
```bash
# When you cd into project
cd ~/conductor/workspaces/mazev2-v1/belo-horizonte && npm run validate:css
```

---

## Recommended Setup

For this project, I recommend **Option 1 (Manual Pre-Commit Hook)** because:

1. No additional dependencies
2. Works immediately
3. Clear, simple validation
4. Easy to understand and modify
5. Perfect for preventing styling regressions

**To enable it:**

```bash
mkdir -p .git/hooks
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/sh
npm run validate:css || exit 1
EOF
chmod +x .git/hooks/pre-commit
```

Done! Now every commit will validate CSS configuration.
