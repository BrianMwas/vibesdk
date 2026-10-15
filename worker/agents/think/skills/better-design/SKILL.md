---
name: better-design
description: The Better Design workflow for building and reviewing an interface - read the existing system first, decide hierarchy, spacing, type and colour by principle before writing, keep components to one coherent system and one icon set, then review the result against accessibility and visual-design rules and fix every critical and serious finding before handing over. Load for any page, section, component or form, and before finishing a build.
license: MIT. Adapted from marvkr/better-design (skills/better-design), see LICENSE.txt
metadata:
  source: https://github.com/marvkr/better-design. The original fetches its principles and review rules from the Better Design MCP, which this builder cannot reach; this version carries the workflow and the rules themselves. Its design systems are shadcn/ui token layers, the same shape as the UI kit here.
---

# Better Design

Interfaces that look generated usually fail the same way: tokens guessed instead of chosen, components
left on the kit's defaults, hierarchy carried by labels instead of size and placement, and nobody
checking contrast or focus before handing over. This skill is the order of work that prevents that,
and the review that catches what slipped through.

## The workflow

1. **Read what exists first.** The project's framework, its tokens, its components, the brand in the
   facts you were given (colours, fonts, logo). Preserve an existing brand: do not replace it because
   another direction looks nicer.
2. **Decide by principle before writing** (the principles below): what leads on each screen, the
   spacing scale, the type scale, the colour roles, and how the page behaves on a phone.
3. **One system.** Build on the kit's primitives, themed to the brand through its tokens, never
   shipped on the kit's neutral defaults. Design nuance lives in the components as well as the
   variables: focus states, border weight, hover transitions and radius by context all have to be
   decided, not inherited.
4. **One icon set.** Use the icon library already installed. Never mix families. An icon goes next to
   words, not instead of them, and never as decoration in a coloured tile.
5. **Review, then fix.** When the work is written, go through the review rules below against the code.
   Fix every critical and serious finding before you hand over. Do not claim a check you did not make.

## Principles

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

## Review rules

Go through both lists before handing over. Critical and serious findings must be fixed.

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

Write the findings down, fix them, then read the changed parts once more.
