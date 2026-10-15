---
name: web-design-guidelines
description: Decide hierarchy, spacing, type and colour by principle before writing UI, then review it against the Web Interface Guidelines (accessibility, focus, forms, animation, typography, images, performance, navigation, touch, theming, i18n) and a graded accessibility and visual-design review, fixing every critical and serious finding. Use before every deploy_space on a customer-facing site, and whenever asked to review or audit UI.
metadata:
  author: vercel
  version: "1.0.0"
  source: https://github.com/vercel-labs/web-interface-guidelines (command.md), vendored because this agent has no network tool. The principles and the graded review are adapted from Better Design (github.com/marvkr/better-design, MIT, see LICENSE-better-design.txt), whose MCP this agent cannot reach.
---

# Web Interface Guidelines

Before writing, decide the page by the principles below. Before you call `deploy_space`, check the files you wrote against the rules and the graded review, and fix every violation. Report only what you cannot fix. Findings are terse, grouped by file, as `file:line - issue`.

### Decide before writing (Better Design principles)

**Hierarchy**
- One focal point per screen and one primary action per flow. If everything is emphasised, nothing is.
- Use size, weight, placement and contrast before labels, badges and captions.
- Group by proximity before containers: related things sit closer than unrelated ones.

**Spacing**
- One spacing scale (4 or 8px based), used everywhere. No one-off values.
- Space inside a group is smaller than space between groups, and space between sections is larger
  still.
- Align to a small number of shared edges.

**Typography**
- A clear scale with few sizes far apart. Body text at 16px or more, line length 45 to 75 characters,
  leading around 1.5.
- Weight and size carry hierarchy; colour does not do it alone.
- At most two families.

**Colour**
- Semantic roles (background, foreground, primary, muted, border, destructive), used through tokens,
  never raw values in components.
- The primary colour marks the primary action, not decoration.
- Flat fills. Depth from a step in tone, not from gradients or glows.

**Depth and shape**
- Shadow only on what floats above the page (menus, dialogs, popovers). Resting surfaces separate by
  tone.
- Radius is decided once per role (controls, surfaces, media) and kept.

**Forms and interaction**
- Every input has a visible label, not just a placeholder. Errors say what went wrong and how to fix
  it, next to the field.
- Every interactive element has hover, active, focus-visible and disabled states.
- Touch targets at least 44 by 44px. Links look like links.

**Motion**
- Motion explains a change of state, place or cause. Transform and opacity only, 150 to 300ms for
  controls, with a `prefers-reduced-motion` fallback.

**Navigation**
- The current page is shown in the navigation. Every page is reachable in one tap from the menu on a
  phone.

### Graded review (Better Design)

Grade what you find, and fix every critical and serious finding before `deploy_space`. Moderate findings are fixed when the fix is local.

**Accessibility**
- Critical: body text contrast below 4.5:1, or large text and essential icons below 3:1, against
  their real background.
- Critical: an interactive element with no visible focus state, or one that cannot be reached and
  used with the keyboard.
- Critical: an image that carries meaning with no alt text; a control with no accessible name (an
  icon-only button needs `aria-label`).
- Serious: a form field without a programmatic label; an error shown only by colour.
- Serious: headings that skip levels, or more than one `h1` on a page.
- Serious: touch targets under 44px on a phone; text that cannot be zoomed to 200% without loss.
- Serious: motion with no reduced-motion fallback; anything that flashes.
- Moderate: links that are only distinguished by colour inside running text.

**Visual design**
- Serious: no clear focal point on a screen, or two primary actions competing.
- Serious: inconsistent spacing (values off the scale, groups not separated more than their items).
- Serious: more than five type sizes, or body text under 16px or in low-contrast grey.
- Serious: components left on the kit's default theme, or raw colour values instead of tokens.
- Serious: content that overflows or is clipped at 390px wide.
- Moderate: mixed icon families, mixed radii within one role, mixed shadow styles.
- Moderate: decoration doing a job that hierarchy should do (badges, eyebrows, dividers to separate
  what space could).

Write the findings down with their grade, fix them, then read the changed parts once more. On a business's website, also check the house rules in `design-archetypes`: a gradient, a shadow on a resting surface, an eyebrow label, monospace labels, 01/02/03 numbering, a hairline divider or a row of icon cards is a serious finding.

## Rules

### Accessibility

- Icon-only buttons need `aria-label`
- Form controls need `<label>` or `aria-label`
- Interactive elements need keyboard handlers (`onKeyDown`/`onKeyUp`)
- `<button>` for actions, `<a>`/`<Link>` for navigation (not `<div onClick>`)
- Images need `alt` (or `alt=""` if decorative)
- Decorative icons need `aria-hidden="true"`
- Async updates (toasts, validation) need `aria-live="polite"`
- Use semantic HTML (`<button>`, `<a>`, `<label>`, `<table>`) before ARIA
- Headings hierarchical `<h1>`–`<h6>`; include skip link for main content
- `scroll-margin-top` on heading anchors
- Meaningful media needs captions, transcripts, or descriptions as applicable
- Media controls need keyboard support; decorative media needs assistive-tech hiding

### Focus States

- Interactive elements need visible focus: `focus-visible:ring-*` or equivalent
- Never `outline-none` / `outline: none` without focus replacement
- Use `:focus-visible` over `:focus` (avoid focus ring on click)
- Group focus with `:focus-within` for compound controls
- Sticky headers/footers/overlays must not cover the focused element

### Forms

- Inputs need `autocomplete` and meaningful `name`
- Use correct `type` (`email`, `tel`, `url`, `number`) and `inputmode`
- Never block paste (`onPaste` + `preventDefault`)
- Labels clickable (`htmlFor` or wrapping control)
- Disable spellcheck on emails, codes, usernames (`spellCheck={false}`)
- Checkboxes/radios: label + control share single hit target (no dead zones)
- Submit button stays enabled until request starts; spinner during request
- Errors inline next to fields; focus first error on submit
- Placeholders end with `…` and show example pattern
- `autocomplete="off"` on non-auth fields to avoid password manager triggers
- Warn before navigation with unsaved changes (`beforeunload` or router guard)

### Animation

- Honor `prefers-reduced-motion` (provide reduced variant or disable)
- Animate `transform`/`opacity` only (compositor-friendly)
- Never `transition: all`—list properties explicitly
- Set correct `transform-origin`
- SVG: transforms on `<g>` wrapper with `transform-box: fill-box; transform-origin: center`
- Animations interruptible—respond to user input mid-animation
- Autoplay motion >5 seconds alongside other content needs pause, stop, or hide controls
- Muted decorative loops must stop under `prefers-reduced-motion`

### Typography

- `…` not `...`
- Curly quotes `“` `”` not straight `"`
- Non-breaking spaces: `10&nbsp;MB`, `⌘&nbsp;K`, brand names
- Loading states end with `…`: `"Loading…"`, `"Saving…"`
- `font-variant-numeric: tabular-nums` for number columns/comparisons
- Use `text-wrap: balance` or `text-pretty` on headings (prevents widows)

### Content Handling

- Text containers handle long content: `truncate`, `line-clamp-*`, or `break-words`
- Flex children need `min-w-0` to allow text truncation
- Handle empty states—don't render broken UI for empty strings/arrays
- User-generated content: anticipate short, average, and very long inputs

### Images

- `<img>` needs explicit `width` and `height` (prevents CLS)
- Below-fold images: `loading="lazy"`
- Above-fold critical images: `priority` or `fetchpriority="high"`

### Performance

- Large lists (>50 items): virtualize (`virtua`, `content-visibility: auto`)
- No layout reads in render (`getBoundingClientRect`, `offsetHeight`, `offsetWidth`, `scrollTop`)
- Batch DOM reads/writes; avoid interleaving
- Prefer uncontrolled inputs; controlled inputs must be cheap per keystroke
- Add `<link rel="preconnect">` for CDN/asset domains
- Critical fonts: `<link rel="preload" as="font">` with `font-display: swap`
- Prefer `<video autoplay muted loop playsinline>` over animated GIF; provide a still alternative
- Short non-essential loops: Safari H.264 MP4 `<picture>` source, `prefers-reduced-motion` media condition, and still fallback

### Navigation & State

- URL reflects state—filters, tabs, pagination, expanded panels in query params
- Links use `<a>`/`<Link>` (Cmd/Ctrl+click, middle-click support)
- Deep-link all stateful UI (if uses `useState`, consider URL sync via nuqs or similar)
- Destructive actions need confirmation modal or undo window—never immediate

### Touch & Interaction

- `touch-action: manipulation` (prevents double-tap zoom delay)
- `-webkit-tap-highlight-color` set intentionally
- `overscroll-behavior: contain` in modals/drawers/sheets
- During drag: disable text selection, `inert` on dragged elements
- Drag/swipe/pinch/path gestures need tap/click and keyboard alternatives unless essential
- `autoFocus` sparingly—desktop only, single primary input; avoid on mobile

### Safe Areas & Layout

- Full-bleed layouts need `env(safe-area-inset-*)` for notches
- Avoid unwanted scrollbars: `overflow-x-hidden` on containers, fix content overflow
- Flex/grid over JS measurement for layout

### Dark Mode & Theming

- `color-scheme: dark` on `<html>` for dark themes (fixes scrollbar, inputs)
- `<meta name="theme-color">` matches page background
- Native `<select>`: explicit `background-color` and `color` (Windows dark mode)

### Locale & i18n

- Dates/times: use `Intl.DateTimeFormat` not hardcoded formats
- Numbers/currency: use `Intl.NumberFormat` not hardcoded formats
- Detect language via `Accept-Language` / `navigator.languages`, not IP
- Brand names, code tokens, identifiers: wrap with `translate="no"` to prevent garbled auto-translation

### Hydration Safety

- Inputs with `value` need `onChange` (or use `defaultValue` for uncontrolled)
- Date/time rendering: guard against hydration mismatch (server vs client)
- `suppressHydrationWarning` only where truly needed

### Hover & Interactive States

- Buttons/links need `hover:` state (visual feedback)
- Interactive states increase contrast: hover/active/focus more prominent than rest

### Content & Copy

- Active voice: "Install the CLI" not "The CLI will be installed"
- Title Case for headings/buttons (Chicago style)
- Numerals for counts: "8 deployments" not "eight"
- Specific button labels: "Save API Key" not "Continue"
- Error messages include fix/next step, not just problem
- Second person; avoid first person
- `&` over "and" where space-constrained

### Anti-patterns (flag these)

- `user-scalable=no` or `maximum-scale=1` disabling zoom
- `onPaste` with `preventDefault`
- `transition: all`
- `outline-none` without focus-visible replacement
- Inline `onClick` navigation without `<a>`
- `<div>` or `<span>` with click handlers (should be `<button>`)
- Images without dimensions
- Large arrays `.map()` without virtualization
- Form inputs without labels
- Icon buttons without `aria-label`
- Hardcoded date/number formats (use `Intl.*`)
- `autoFocus` without clear justification
- Animated GIF when compressed video is suitable
- Gesture-only action without tap/click and keyboard alternative

## Output Format

Group by file. Use `file:line` format (VS Code clickable). Terse findings.

```text
## src/Button.tsx

src/Button.tsx:42 - icon button missing aria-label
src/Button.tsx:18 - input lacks label
src/Button.tsx:55 - animation missing prefers-reduced-motion
src/Button.tsx:67 - transition: all → list properties

## src/Modal.tsx

src/Modal.tsx:12 - missing overscroll-behavior: contain
src/Modal.tsx:34 - "..." → "…"

## src/Card.tsx

✓ pass
```

State issue + location. Skip explanation unless fix non-obvious. No preamble.
