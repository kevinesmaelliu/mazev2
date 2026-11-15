# Project Overview
- Project name: [Choose a name - e.g., "FeedbackHub" or "DesignTest"]
- Vision: A free/freemium design feedback and user testing platform combining Inflight.co's design review capabilities with Maze.co's user testing features
- Business model: Community-driven credit economy where users trade testing/feedback to earn credits for their own tests

# Core Features
## Phase 1 (MVP)
- Canvas-based design review using TLDraw SDK
- Image upload and artboard management
- Annotation tools (pen, shapes, text, comments)
- Test creation panel with configurable questions/tasks
- Basic test types: first-click tests, task-based testing, preference tests
- Credit system: earn credits by completing tests, spend credits to get designs tested
- User authentication and dashboard

## Phase 2
- Video recording feedback (MediaRecorder API or Loom SDK)
- Multiple test types from Maze (heatmaps, user paths, time-on-task)
- Advanced annotation features
- Test analytics and reporting
- Community marketplace for finding tests

## Phase 3
- Real-time collaboration on canvas
- Integration APIs (Figma, Sketch import)
- Advanced anti-fraud measures
- Team/organization features

# Tech Stack
## Frontend
- Next.js 14 (App Router, TypeScript)
- shadcn/ui + Radix UI for components
- Tailwind CSS for styling
- TLDraw for canvas/annotations
- Zustand or Jotai for state management
- React Query for data fetching

## Backend
- [DECISION NEEDED: Supabase all-in-one vs Next.js API + separate services]
- PostgreSQL database
- Supabase Storage or Cloudflare R2 for images/videos
- Authentication: [DECISION NEEDED: Clerk vs Supabase Auth vs Auth.js]

## Infrastructure
- Vercel hosting
- Background jobs: [DECISION NEEDED: Vercel Cron vs Trigger.dev vs BullMQ]

## Media Processing
- MediaRecorder API for video recording (Phase 2)
- FFmpeg.wasm for video compression (Phase 2)

# Development Workflow
1. Design ideation in Figma (rough concepts only)
2. Define design tokens in `tailwind.config.js` as single source of truth
3. Use v0.dev/DESN for component generation with shadcn/ui compatibility
4. Custom components: Design in Figma → hand to v0/DESN with token reference → iterate in code
5. Track issues in Linear
6. Use Conductor for multi-agent development workflows

# Design System Approach
- **Source of truth:** Code (`tailwind.config.js` + shadcn theme)
- **Figma role:** Mockups and exploration only, not connected to codebase
- **Component strategy:** Use shadcn/ui defaults (80%) + custom components (20%)
- **Token management:** Figma Variables mapped to Tailwind config using Style Dictionary (if needed)

# Database Schema (High-Level)
## Core Tables
- `users` - user accounts, credit balance
- `tests` - test configurations, canvas data, questions
- `test_responses` - user responses, annotations, timestamps
- `credits_transactions` - audit log for credit earning/spending
- `designs` - uploaded images/artboards metadata
- `annotations` - canvas annotation data linked to tests

## Credit Economy
- Base rate: 1 completed test = 1 credit earned
- Test cost: [DECISION NEEDED: flat rate or variable by complexity?]
- Anti-gaming: completion verification, quality scoring, rate limits

# File Structure
```
/app                 # Next.js app router pages
  /(auth)           # Auth pages (login, signup)
  /(dashboard)      # Protected dashboard routes
  /test/[id]        # Test execution pages
  /create           # Test creation flow
/components
  /ui               # shadcn/ui components
  /canvas           # TLDraw integration & custom canvas components
  /test             # Test-specific components
  /layout           # Layout components
/lib
  /db               # Database utilities & queries
  /auth             # Auth helpers
  /credits          # Credit system logic
  /storage          # File upload/storage utilities
/hooks              # Custom React hooks
/types              # TypeScript type definitions
/public             # Static assets
```

# Open Questions & Decisions Needed
1. Authentication provider choice?
2. Video storage strategy and cost limits?
3. Real-time collaboration requirement for MVP?
4. Credit anti-fraud mechanisms?
5. Test pricing model (flat vs variable)?
6. Project name?

# Development Phases
- **Weeks 1-2:** Foundation (Next.js setup, auth, database schema, basic routing)
- **Weeks 3-4:** Core Canvas (TLDraw integration, image upload, annotations)
- **Weeks 5-6:** Testing Engine (test types, response collection, credit backend)
- **Weeks 7-8:** Community Features (marketplace, credit earning/spending, matching)

# Context for AI Assistants
When generating code:
- Always use TypeScript with strict mode
- Follow shadcn/ui patterns and conventions
- Use Tailwind CSS for all styling (no CSS-in-JS)
- Prefer server components unless interactivity required
- Use Zod for schema validation
- Follow Next.js 14 App Router best practices
- Keep components small and focused
- Write accessible HTML with ARIA labels
- Handle loading and error states

# Figma-to-Code Guidelines
- Don't try to maintain Figma-code parity for the entire design system
- Use Figma for custom component mockups only
- Extract Tailwind classes from Figma Dev Mode
- Pass Figma screenshots + theme config to v0.dev for component generation
- Iterate in code, update Figma as documentation

# Resources
- TLDraw Docs: https://tldraw.dev
- shadcn/ui: https://ui.shadcn.com
- Next.js 14 Docs: https://nextjs.org/docs
- Reference platforms: Inflight.co, Maze.co

<!-- ASTRYX:START -->
Astryx v0.7.16 · 174 components
CLI: run every command as `npx astryx <cmd>` (shown below as `astryx ...`).

SETUP (once, in app entry e.g. main.tsx) — without these, components render unstyled:
  import "@astryxdesign/core/reset.css";
  import "@astryxdesign/core/astryx.css";

WORKFLOW — start every page from a template, never from scratch:
1. `astryx build "<idea>"` — names the template to scaffold from and the parts it lacks.
2. `astryx template <name> <path>` — scaffold it; keep its frame, gap and padding; replace the content.
3. `astryx template <Block>` for parts it lacks; `astryx component <Name>` to read props before using one.
Changing an existing page? Keep it: skip step 2 and add blocks/components inside its sections.
Before you deliver a build, run `astryx doctor --built <dir>`; don't deliver it if it fails.

RULES:
- No <div> — components handle all layout and spacing.
- Read `astryx docs layout` before changing a template's frame.
- Dense data = rows (Table, List/Item), not Card-wrapped lists. Badge = counts only.
- Style with component props first, then Tailwind utilities backed by tokens. No raw hex/px.
- THEMES: palettes and custom colors go through the theme, never :root overrides. To make or change a theme (colors, fonts, corners, spacing, a look from a picture), prefer the experimental theme editor over hand-written theme files: `astryx experimental theme editor new <name> --like neutral`, then `editor set <name> <thing> <value>` or `editor how "<what you want>"`; wire it with `astryx theme add <name>`; after each change look at it with `astryx experimental theme editor show <name> --png` and open the PNGs it writes (changes nothing in the app); a theme change is not done until you have looked at the pictures. In code, extend an imported theme to customize it; `theme eject <slug>` only forks source. See `astryx docs theme`.
- SELF-CHECK: re-read the file; replace any style={{…}}, raw <div>/<span>, imported .css/@apply, or hardcoded/arbitrary value (bg-[#fff], p-[13px]) with the component or a token-backed utility.

`astryx help` lists every command. Key ones beyond the workflow:
  search "<query>"   find any component / hook / doc / template
  discover <words>   integrations you could add
  docs <topic>       getting-started, principles, tokens, theme … (`astryx docs` lists all)
  docs cli           commands and API reference
  docs authoring     build an integration package, and every field it holds
  upgrade --from <old version> --apply   run after a dependency bump
<!-- ASTRYX:END -->
