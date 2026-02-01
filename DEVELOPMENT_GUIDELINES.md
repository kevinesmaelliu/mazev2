# Development Guidelines

> **Purpose:** These guidelines ensure consistent component reuse, proper design token usage, and adherence to established patterns. **ALL Claude Code instances and developers MUST follow these rules.**

---

## 🚨 Mandatory Pre-Development Checklist

Before creating ANY component or writing ANY styles, you MUST:

- [ ] Search for existing components: `grep -r "export.*function ComponentName" components/ app/`
- [ ] Check if shadcn/ui has a built-in component: [ui.shadcn.com](https://ui.shadcn.com)
- [ ] Verify design tokens exist in `tailwind.config.js` (or `tailwind.config.ts`)
- [ ] Read component directories: `components/ui/`, `components/canvas/`, `components/test/`, `components/layout/`
- [ ] Check if a similar pattern exists in the app directory

**If you skip this checklist, you WILL create duplicate components and violate the design system.**

---

## Component Reuse Rules

### Source of Truth: shadcn/ui (80%) + Custom Components (20%)

This project uses **shadcn/ui** as the primary component library. Custom components should only be created when shadcn/ui doesn't provide the functionality.

### Component Directory Structure

```
/components
  /ui/              # shadcn/ui components (installed via CLI)
    button.tsx
    card.tsx
    dialog.tsx
    input.tsx
    label.tsx
    ... (more shadcn components)

  /canvas/          # TLDraw-specific custom components
    canvas-toolbar.tsx
    annotation-layer.tsx
    artboard-manager.tsx

  /test/            # Test creation/execution components
    test-question-editor.tsx
    test-type-selector.tsx
    test-results-display.tsx

  /layout/          # Layout and navigation components
    navbar.tsx
    sidebar.tsx
    footer.tsx
```

### Import Path Convention

Always use the `@/` alias for imports:

```typescript
// ✅ Correct
import { Button } from "@/components/ui/button"
import { CanvasToolbar } from "@/components/canvas/canvas-toolbar"
import { TestQuestionEditor } from "@/components/test/test-question-editor"

// ❌ Wrong
import { Button } from "../../components/ui/button"
import Button from "@/components/ui/button"
```

### When to Use Existing Components

| Need | Use This Component | Import Path | Don't Create |
|------|-------------------|-------------|--------------|
| Button/CTA | `Button` | `@/components/ui/button` | Custom button, submit button, action button |
| Form input | `Input` | `@/components/ui/input` | Custom text field, search box |
| Modal/popup | `Dialog` | `@/components/ui/dialog` | Custom modal, popup, overlay |
| Card container | `Card` | `@/components/ui/card` | Custom card, panel, container |
| Dropdown menu | `DropdownMenu` | `@/components/ui/dropdown-menu` | Custom dropdown, select alternative |
| Form labels | `Label` | `@/components/ui/label` | Custom label component |
| Toast notifications | `Toast` | `@/components/ui/toast` | Custom notification, alert banner |
| Tabs | `Tabs` | `@/components/ui/tabs` | Custom tab navigation |
| Tooltips | `Tooltip` | `@/components/ui/tooltip` | Custom hover info |
| Checkbox | `Checkbox` | `@/components/ui/checkbox` | Custom checkbox |
| Radio | `RadioGroup` | `@/components/ui/radio-group` | Custom radio button |
| Select dropdown | `Select` | `@/components/ui/select` | Custom select, picker |
| Switch/toggle | `Switch` | `@/components/ui/switch` | Custom toggle |

### Adding New shadcn/ui Components

When you need a shadcn/ui component that isn't installed yet:

```bash
# Install a specific component
npx shadcn-ui@latest add button

# Install multiple components
npx shadcn-ui@latest add button card dialog input
```

This will automatically add the component to `components/ui/` with proper styling.

### Custom Component Creation Rules

Only create custom components when:
1. shadcn/ui doesn't provide the functionality
2. The component is domain-specific (e.g., canvas tools, test types)
3. You've verified no similar component exists in the codebase

**Before creating a custom component:**
```bash
# Search for similar functionality
grep -r "function.*Canvas" components/
grep -r "function.*Test" components/
grep -r "export.*Button" components/
```

---

## Design Token Requirements

### Source of Truth: `app/globals.css` (CoffeeMod Theme)

**ALL** colors, spacing, typography, and other design values MUST come from the design system. The CoffeeMod theme (https://tweakcn.com/themes/cml1538aj000404i86i4oc6zc) is the single source of truth for all design tokens defined in `app/globals.css`.

### Location of Design Tokens

```
/app/globals.css       # Single source of truth (CoffeeMod theme colors)
/tailwind.config.ts    # Tailwind configuration mapping CSS variables
```

### Approved Design Tokens

#### Colors

**NEVER use hex codes, RGB values, or hardcoded colors.**

```typescript
// ✅ Correct - Using Tailwind theme colors
<div className="bg-background text-foreground">
<div className="bg-primary text-primary-foreground">
<div className="bg-secondary text-secondary-foreground">
<div className="bg-muted text-muted-foreground">
<div className="bg-accent text-accent-foreground">
<div className="bg-destructive text-destructive-foreground">
<div className="border-border">

// ❌ Wrong - Hardcoded colors
<div className="bg-[#ffffff]">
<div style={{ backgroundColor: '#000000' }}>
<div className="bg-blue-500">  // Only if not in theme
```

#### Spacing

Use Tailwind's spacing scale. Never use arbitrary pixel values unless absolutely necessary.

```typescript
// ✅ Correct - Using spacing scale
<div className="p-4 m-2 gap-6 space-y-8">
<div className="px-6 py-4">

// ❌ Wrong - Arbitrary values
<div className="p-[23px]">
<div style={{ padding: '15px' }}>
```

#### Typography

```typescript
// ✅ Correct - Using Tailwind typography
<h1 className="text-4xl font-bold">
<p className="text-sm text-muted-foreground">
<span className="font-medium text-lg">

// ❌ Wrong - Hardcoded font sizes
<h1 style={{ fontSize: '32px', fontWeight: 700 }}>
<p className="text-[14px]">
```

#### Border Radius

```typescript
// ✅ Correct - Using Tailwind border radius
<div className="rounded-lg">
<div className="rounded-md">
<div className="rounded-sm">

// ❌ Wrong
<div style={{ borderRadius: '8px' }}>
<div className="rounded-[12px]">
```

### CoffeeMod Theme Variables (CSS Variables)

The project uses the CoffeeMod theme defined in `app/globals.css`. These CSS variables map to Tailwind classes:

**Light Mode (`:root`):**
```css
--background: #f9f9f9;         /* Page background */
--foreground: #202020;         /* Main text color */
--primary: #644a40;            /* Warm brown brand color */
--primary-foreground: #ffffff; /* Text on primary */
--secondary: #ffdfb5;          /* Cream accent */
--muted: #efefef;              /* Subtle background */
--accent: #e8e8e8;             /* Light accent */
--destructive: #e54d2e;        /* Error/warning red */
--border: #d8d8d8;             /* Border color */
--ring: #644a40;               /* Focus ring */
```

**Dark Mode (`.dark`):**
```css
--background: #130f0c;         /* Very dark brown */
--foreground: #eeeeee;         /* Light text */
--card: #282420;               /* Dark brown card */
--popover: #191919;            /* Very dark popover */
--primary: #ffe0c2;            /* Light cream */
--primary-foreground: #081a1b; /* Dark text on light */
--secondary: #393028;          /* Dark brown */
--muted: #222222;              /* Subtle dark background */
--muted-foreground: #b4b4b4;   /* Light gray text */
--accent: #2a2a2a;             /* Dark gray accent */
--border: #36332b;             /* Dark border */
--input: #484848;              /* Input field border */
--ring: #ffe0c2;               /* Light focus ring */
--sidebar: #221e1c;            /* Sidebar background */
--sidebar-foreground: #f4f4f5; /* Sidebar text */
--sidebar-primary: #1d4ed8;    /* Sidebar primary (blue) */
--sidebar-border: #27272a;     /* Sidebar border */
```

**Use these via Tailwind classes, NOT by directly referencing CSS variables.**

---

## Styling Approach

### Tailwind CSS Only - No CSS-in-JS

```typescript
// ✅ Correct - Tailwind classes
<div className="flex items-center justify-between p-4 bg-background">
  <Button variant="outline" size="sm">Click me</Button>
</div>

// ❌ Wrong - Inline styles
<div style={{ display: 'flex', alignItems: 'center', padding: '16px' }}>
  <button style={{ padding: '8px 16px' }}>Click me</button>
</div>

// ❌ Wrong - CSS-in-JS
const StyledDiv = styled.div`
  display: flex;
  padding: 16px;
`
```

### Conditional Styling with cn() Utility

Use the `cn()` utility (from `lib/utils.ts`) for conditional classes:

```typescript
import { cn } from "@/lib/utils"

// ✅ Correct
<div className={cn(
  "p-4 rounded-lg",
  isActive && "bg-primary text-primary-foreground",
  isDisabled && "opacity-50 cursor-not-allowed"
)}>

// ❌ Wrong - String concatenation
<div className={`p-4 rounded-lg ${isActive ? 'bg-primary' : ''}`}>
```

---

## TypeScript Requirements

### Strict Mode Enabled

All code must pass TypeScript strict mode checks:

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "noImplicitAny": true
  }
}
```

### Type Definitions

```typescript
// ✅ Correct - Explicit types
interface ButtonProps {
  variant: "default" | "outline" | "ghost"
  size: "sm" | "md" | "lg"
  onClick: () => void
  children: React.ReactNode
}

export function Button({ variant, size, onClick, children }: ButtonProps) {
  // ...
}

// ❌ Wrong - Implicit any
export function Button(props) {
  // ...
}
```

### Use Zod for Runtime Validation

```typescript
// ✅ Correct - Zod schema for forms and API validation
import { z } from "zod"

const testSchema = z.object({
  title: z.string().min(1).max(100),
  questions: z.array(z.object({
    type: z.enum(["first-click", "task", "preference"]),
    content: z.string()
  }))
})

type Test = z.infer<typeof testSchema>
```

---

## Next.js App Router Best Practices

### Server Components by Default

```typescript
// ✅ Correct - Server Component (default)
// app/dashboard/page.tsx
export default async function DashboardPage() {
  const data = await fetchData()
  return <div>{data}</div>
}

// ✅ Correct - Client Component when needed
// components/interactive-button.tsx
"use client"

export function InteractiveButton() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}

// ❌ Wrong - Unnecessary "use client"
"use client"

export default function StaticPage() {
  return <div>Static content</div>
}
```

### File Structure Conventions

```
app/
  (auth)/              # Route group - doesn't affect URL
    login/
      page.tsx
    signup/
      page.tsx

  (dashboard)/         # Protected routes
    layout.tsx         # Shared layout
    page.tsx           # /dashboard
    tests/
      page.tsx         # /dashboard/tests

  test/
    [id]/
      page.tsx         # /test/[id] - dynamic route

  api/
    tests/
      route.ts         # API route handler
```

### Loading and Error States

```typescript
// app/dashboard/loading.tsx
export default function Loading() {
  return <Skeleton />
}

// app/dashboard/error.tsx
'use client'

export default function Error({ error, reset }: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

---

## Common Violations to Avoid

### ❌ Violation #1: Hardcoded Colors

```typescript
// ❌ Wrong
<div className="bg-[#ffffff] text-[#000000]">
<div style={{ backgroundColor: '#f0f0f0' }}>

// ✅ Correct
<div className="bg-background text-foreground">
<div className="bg-muted">
```

### ❌ Violation #2: Creating Duplicate Components

```typescript
// ❌ Wrong - Creating a custom button when shadcn/ui has one
export function MyButton({ children }: { children: ReactNode }) {
  return <button className="px-4 py-2 bg-blue-500">{children}</button>
}

// ✅ Correct - Using shadcn/ui Button
import { Button } from "@/components/ui/button"

<Button>Click me</Button>
```

### ❌ Violation #3: Inline Styles

```typescript
// ❌ Wrong
<div style={{ padding: '16px', marginTop: '8px' }}>

// ✅ Correct
<div className="p-4 mt-2">
```

### ❌ Violation #4: Magic Numbers and Arbitrary Values

```typescript
// ❌ Wrong
<div className="w-[347px] h-[89px] mt-[23px]">

// ✅ Correct - Use spacing scale
<div className="w-full max-w-sm h-24 mt-6">
```

### ❌ Violation #5: Not Using TypeScript

```typescript
// ❌ Wrong
export function TestCard(props) {
  return <div>{props.title}</div>
}

// ✅ Correct
interface TestCardProps {
  title: string
  description?: string
}

export function TestCard({ title, description }: TestCardProps) {
  return <div>{title}</div>
}
```

### ❌ Violation #6: Importing with Relative Paths

```typescript
// ❌ Wrong
import { Button } from "../../../components/ui/button"

// ✅ Correct
import { Button } from "@/components/ui/button"
```

---

## Design Exceptions

### Exception 1: UploadDesignModal Hardcoded Colors & Glow Effect

**Location:** `components/upload-design-modal.tsx` - Canvas and URL/Figma preview cards + modal glow border

**Rationale:** The upload modal cards contain hardcoded brand colors (`blue-500`, `purple-500`, `pink-500`, `red-500`, `yellow-500`, `green-500`) for visual illustration elements only. These colors are part of the visual preview mockups and do not appear in the actual UI structure or content areas. Additionally, the modal container uses SVG filters and inline styles for the glow border effect to achieve the glowing card aesthetic.

**Context:** The browser window mockup in the URL/Figma card uses standard browser chrome colors (red/yellow/green dots) for visual authenticity. The canvas preview uses blue/purple/pink to create an appealing, illustrative design pattern. The glow effect uses an SVG `feColorMatrix` filter and inline `filter: url(#unopaq)` styling to create the enhanced glow appearance with the backdrop blur gradient.

**Specific Elements:**
- Canvas preview: Blue circle marker, purple-to-pink gradient sphere
- Browser mockup: Red/yellow/green traffic light dots, purple-pink gradient content placeholder
- Modal glow: SVG filter definition, absolute positioned gradient blur layer, and inline filter application

**Exceptions Allowed:**
- SVG filter definition with `style={{ position: 'absolute', width: 0, height: 0 }}`
- Inline `style={{ filter: 'url(#unopaq)' }}` on the glow backdrop layer
- Arbitrary shadow value in className using `shadow-[...]` syntax for glow effect

**Note:** This exception applies ONLY to decorative preview elements and the glow border effect within this specific modal. All functional UI elements (buttons, inputs, backgrounds) use proper design tokens. This does NOT establish a precedent for other components.

### Exception 2: AIBlocksGenerator Glassmorphic Button

**Location:** `components/test/ai-blocks-generator.tsx` - AI blocks generation button

**Rationale:** The AI blocks generator button uses inline styles for a glassmorphic design effect with animated shadows and backdrop filters. These effects require dynamic style manipulation that cannot be fully achieved with Tailwind CSS classes alone:
- Gradient backgrounds with transparency
- Multi-layered box-shadow effects for depth
- Backdrop blur filter
- Dynamic shadow transitions on hover and press states

**Context:** This button features a modern glassmorphic design with pronounced 3D depth and smooth interactive animations. The design requires real-time shadow manipulation based on user interaction (hover, press, leave states) to achieve the intended tactile feedback and visual polish.

**Specific Elements:**
- Background gradient with transparency
- Layered shadows (outer + inset)
- Backdrop blur for glassmorphic effect
- Dynamic shadow manipulation on hover/press/release
- Icon color transition on hover

**Note:** This exception applies ONLY to this specific interactive button component. The glassmorphic effect is essential to the intended user experience and visual design. All other UI elements continue to use Tailwind CSS and proper design tokens.

### Exception 3: Test Block Editor Background

**Location:** `components/test/test-block-editor.tsx` - Test block cards in the test creation panel

**Rationale:** Test block cards use `bg-card` (the card background color from the CoffeeMod theme) to provide stronger visual containment and better visual hierarchy within the test creation panel.

**Changes:**
- **Light mode:** `#ffffff` (from `--card` CSS variable)
- **Dark mode:** `#211c18` (from `--card` CSS variable)

**Context:** Blocks represent distinct, independent test questions and benefit from a more defined background. Using the card background color creates visual separation while maintaining consistency with the design system's color tokens.

**Note:** This change uses proper Tailwind tokens (`bg-card`) which automatically adapt to light/dark mode via CSS variables defined in `app/globals.css`.

---

## Component Development Workflow

### 1. Check for Existing Components

```bash
# Search component directories
ls -R components/

# Search for component by name
grep -r "export.*function Button" components/
grep -r "export.*function Card" components/

# Check shadcn/ui documentation
# Visit: https://ui.shadcn.com/docs/components
```

### 2. Install shadcn/ui Component (if available)

```bash
npx shadcn-ui@latest add [component-name]
```

### 3. Create Custom Component (if necessary)

```typescript
// components/custom/my-component.tsx
import { cn } from "@/lib/utils"

interface MyComponentProps {
  className?: string
  children: React.ReactNode
}

export function MyComponent({ className, children }: MyComponentProps) {
  return (
    <div className={cn("p-4 rounded-lg bg-background", className)}>
      {children}
    </div>
  )
}
```

### 4. Document the Component

Add a comment at the top of the file:

```typescript
/**
 * MyComponent - Brief description of what this component does
 *
 * @example
 * <MyComponent>
 *   <p>Content goes here</p>
 * </MyComponent>
 */
```

---

## Design Token Quick Reference

### Colors (from CoffeeMod theme)

**Light Theme:**
```typescript
bg-background           // #f9f9f9 - Light gray page background
text-foreground         // #202020 - Dark text

bg-primary              // #644a40 - Warm brown brand color
text-primary-foreground // #ffffff - White text on primary

bg-secondary            // #ffdfb5 - Cream accent
bg-muted                // #f5f5f5 - Subtle light background
text-muted-foreground   // #808080 - Gray text for captions

bg-accent               // #e8e8e8 - Light gray accent
bg-destructive          // #e54d2e - Red-orange for errors

border-border           // #d8d8d8 - Light gray borders
border-input            // #d8d8d8 - Input field borders
ring-ring               // #644a40 - Brown focus ring
```

**Dark Theme (automatic when `.dark` class is applied):**
```typescript
bg-background           // #130f0c - Very dark brown
text-foreground         // #eeeeee - Light text

bg-card                 // #282420 - Dark brown card
bg-primary              // #ffe0c2 - Light cream brand
text-primary-foreground // #081a1b - Dark text on light bg

bg-secondary            // #393028 - Dark brown
bg-muted                // #222222 - Dark subtle background
text-muted-foreground   // #b4b4b4 - Light gray text

bg-accent               // #2a2a2a - Dark gray accent
bg-destructive          // #e54d2e - Consistent red

border-border           // #36332b - Dark borders
border-input            // #484848 - Darker input borders
ring-ring               // #ffe0c2 - Light cream focus ring

bg-sidebar              // #221e1c - Sidebar background
text-sidebar-foreground // #f4f4f5 - Sidebar text
bg-sidebar-primary      // #1d4ed8 - Sidebar primary (blue accent)
border-sidebar-border   // #27272a - Sidebar border
```

### Spacing (Tailwind default scale)

```typescript
p-0    // 0px
p-0.5  // 2px
p-1    // 4px
p-2    // 8px
p-3    // 12px
p-4    // 16px
p-5    // 20px
p-6    // 24px
p-8    // 32px
p-10   // 40px
p-12   // 48px
p-16   // 64px
p-20   // 80px
p-24   // 96px

// Also works with: m-, px-, py-, mx-, my-, gap-, space-x-, space-y-
```

### Typography

```typescript
text-xs    // 12px
text-sm    // 14px
text-base  // 16px
text-lg    // 18px
text-xl    // 20px
text-2xl   // 24px
text-3xl   // 30px
text-4xl   // 36px

font-normal    // 400
font-medium    // 500
font-semibold  // 600
font-bold      // 700
```

### Border Radius

```typescript
rounded-sm   // 2px (from theme)
rounded-md   // 4px (from theme)
rounded-lg   // 8px (from theme)
rounded-xl   // 12px
rounded-full // 9999px (circles)
```

---

## Pre-commit Checklist

Before committing code, verify:

- [ ] No hardcoded colors (search for `#`, `rgb`, `rgba`, `hsl`)
- [ ] No inline styles (search for `style={{`)
- [ ] All imports use `@/` alias
- [ ] TypeScript has no errors (`npm run type-check` or `tsc --noEmit`)
- [ ] Components use existing shadcn/ui components where possible
- [ ] Design tokens from `tailwind.config.js` are used
- [ ] No duplicate components created
- [ ] Loading and error states are handled (for async operations)

---

## Questions?

If you're unsure whether to create a new component or use an existing one:

1. Search the codebase first
2. Check shadcn/ui documentation
3. Ask in code review: "Does a component for X already exist?"

**When in doubt, reuse over recreate.**

---

## Additional Resources

- [CoffeeMod Theme (Source of Truth)](https://tweakcn.com/themes/cml1538aj000404i86i4oc6zc)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Next.js 14 App Router Docs](https://nextjs.org/docs)
- [TLDraw Documentation](https://tldraw.dev)

---

**Last updated:** 2026-01-30
**Applies to:** All development on this codebase
**Theme:** CoffeeMod (https://tweakcn.com/themes/cml1538aj000404i86i4oc6zc) - SINGLE SOURCE OF TRUTH
