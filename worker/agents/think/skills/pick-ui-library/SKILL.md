---
name: pick-ui-library
description: Curated, opinionated library picks for common frontend needs not already covered by scaffold_ui_kit — command menus, OTP inputs, charts, drag and drop, virtualization, state, animation, and more. Use whenever a build needs one of these and you're about to hand-roll it or guess at a package.
metadata:
  author: emilkowalski
  version: "1.0.0"
  source: https://github.com/emilkowalski/skills (skills/pick-ui-library/SKILL.md), adapted for ThinkAgent's npm/importmap constraints and the scaffold_ui_kit tool
---

# Picking the right library

A lookup skill. Match the task at hand — not the library name the user happened to mention — to the table below and use that pick. These are deliberate, taste-driven choices; don't substitute an alternative outside this list unless the task genuinely isn't covered or the user asks for something else.

## Check `scaffold_ui_kit` first

Toasts (Sonner), cva-style variant styling, and unstyled-but-accessible primitives (dialog, dropdown, select, tabs, tooltip, popover, accordion, sheet, hover card, etc.) are already vendored by the `scaffold_ui_kit` tool — call that instead of installing a separate package for anything it already exports. Only reach for the rows below for what it doesn't cover.

## How to use this

1. **Identify the task**, not the library the user named. "I need a dropdown" is a UI-primitives task (`scaffold_ui_kit`), even if they asked about something else by name.
2. **Check how the app loads React** (see the `cloudflare-bundler-apps` skill): a pre-compiled build (Vite/esbuild) installs these as ordinary npm deps; the no-build importmap path pulls them from `esm.sh` instead, with `?external=react,react-dom` on every entry that has React as a peer dependency (same dual-React trap as any other importmap package).
3. **Recommend one library**, state what it's for in one sentence, and wire it up if that's part of the request. Don't present a menu when the table has a clear answer.
4. If the task isn't covered here or by `scaffold_ui_kit`, say so explicitly and recommend from your own knowledge — but be clear you've left the curated list.

## The list

### UI components & primitives

| Task | Library |
| --- | --- |
| Unstyled, accessible primitives beyond what `scaffold_ui_kit` covers (combobox/autocomplete, number field) | [base-ui](https://base-ui.com) |
| Command menus (⌘K palettes) | [cmdk](https://cmdk.paco.me) |
| One-time password / verification code inputs | [input-otp](https://input-otp.rodz.dev) |
| Customizable GUIs / control panels | [Leva](https://github.com/pmndrs/leva) |

### Motion & visuals

| Task | Library |
| --- | --- |
| General-purpose animation (springs, layout animations, enter/exit) | [motion](https://motion.dev) (Framer Motion) |
| Animating numbers (counters, prices, stats) | [NumberFlow](https://number-flow.barvian.me) |
| 3D globes | [Cobe](https://cobe.vercel.app) |
| Syntax highlighting | [shiki](https://shiki.style) |

Reach for `motion` when you need springs, layout animations, exit animations, or gesture-driven values. A simple hover or fade doesn't need it — plain CSS transitions are the right tool there (see `frontend-design`'s interface-polish section).

### Charts

| Task | Library |
| --- | --- |
| Real-time / streaming charts | [Liveline](https://github.com/benjitaylor/liveline) |
| General charts (static or interactive dashboards) | [recharts](https://recharts.org) |

The split: if data points arrive live and the chart scrolls with time, use Liveline. Everything else is recharts.

### Interaction & performance

| Task | Library |
| --- | --- |
| Drag and drop | [dnd kit](https://dndkit.com) |
| Virtualization (long lists, large tables) | [Virtuoso](https://virtuoso.dev) |

### State & styling

| Task | Library |
| --- | --- |
| State management | [zustand](https://zustand.docs.pmnd.rs) |
| Constructing `className` strings conditionally | [clsx](https://github.com/lukeed/clsx) |
| Theme switching / dark mode (no flash on load) | [next-themes](https://github.com/pacocoursey/next-themes) |

## Common mismatches to catch

- **A `<div>`-based dropdown/dialog/select with manual focus handling** → `scaffold_ui_kit` (or `base-ui` for what it doesn't cover), which handles accessibility, focus trapping, and dismissal.
- **Toasts built by hand or with a modal library** → `scaffold_ui_kit`'s `Toaster`/`toast` export exists for exactly this.
- **Animating a number by re-rendering text** → NumberFlow handles digit transitions properly.
- **Rendering a 1,000+ row list directly** → Virtuoso before reaching for pagination hacks.
- **A `useState`-per-component web of props for shared state** → zustand.
- **Template-literal className ternaries three conditions deep** → clsx.
