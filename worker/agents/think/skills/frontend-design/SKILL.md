---
name: frontend-design
description: Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one. Helps with aesthetic direction, typography, and making choices that don't read as templated defaults.
license: Complete terms in LICENSE.txt
---

# Frontend Design

Approach this as the design lead at a design studio known for giving every client a distinct visual identity that is not mistaken for anyone else's. This client has already rejected proposals that felt cliché or templated, and is paying for a distinctive point of view: make deliberate, opinionated choices about palette, typography, and layout that are specific to this brief, and take aesthetic risk if justified.

## Ground your designs in the subject matter

If the brief does not identify what the product or subject matter is, identify it yourself before designing, and confirm with the client. You can come up with one concrete subject, the design's audience, and the design's primary job, as a proposal. If there's any information in your memory about the client's preferences or context about what they're building, use that as a hint. The subject's industry, subject matter, materials, and vernacular are where distinctive visual choices come from — a design for a toy for girls aged 8–11 will be very aesthetically different from a dashboard for financial analysts. Build with the brief's real content and subject matter throughout.

## Design principles

For web designs, the hero is the first thing viewers will see. Open with the most characteristic thing in the subject's world, in the form that is most appropriate: a headline, an image, an animation, a live demo, an interactive moment, or other treatments. Be deliberate with your choice: a big number with a small label, supporting stats, and a gradient accent is the default treatment, so only use it if that's truly the best option.

When the subject is concrete and photographic — people, places, food, products, physical spaces — a real photo can be the strongest hero or section treatment, and often beats a gradient or an abstract illustration at conveying what the thing actually is. Use the `search_images` tool to pull real, licensed photography matched to the brief's actual subject (specific query terms, not generic ones) rather than defaulting to a decorative gradient panel. This is a choice, not a reflex: plenty of strong heroes stay typographic, illustrative, or data-driven, and a photo bolted onto a subject it doesn't fit (abstract SaaS concepts, data tools, anything without a real-world visual referent) is its own generic tell. Use a photo where it earns its place, skip it where it wouldn't.

Typography carries the personality of the page. You don't need a different typeface for display or headline text and body content: use one family or two, and if two, make them clearly distinct.

Choose your typefaces deliberately, not the default families you would reach for on any other project, and set a clear type scale following the default guidance of The Elements of Typographic Style with intentional weights, widths, and spacing. When type is used as a headline or visual element, use the type treatment itself as an active part of the design, not a neutral delivery vehicle for the content.

Default to line lengths of less than 80 characters. Serif typefaces can have slightly longer line lengths; give serif body text slightly more line-height than a sans-serif.

Avoid these default typographic treatments; they are the commonest tells of a generated page:
- Accenting just a single word or phrase in a headline, like putting one word in italic/bold or a different color.
- Using all caps for labels.
- Adding unnecessary typographic labels above content.

Visual structure is information. Structural devices like outlines, borders, numbering, eyebrows, dividers, labels, etc., encode useful information about the content rather than decorate it. Many generic designs use numbered markers (01 / 02 / 03), but that's only appropriate if the content actually is a sequence — like a stepped process or a timeline. Before adding numbered markers, check the content really is a sequence.

Favor subtle over bold as the default register. A page that whispers its quality reads as more considered than one that shouts it — reach for loud color, heavy chrome, or maximal density only when the brief specifically calls for that energy. Navigation is a good example: a full-width bar with a hard edge and a solid fill is the heavy default; a floating navbar (inset from the viewport edges, modest height, a soft shadow or hairline border instead of a hard background) usually reads as more deliberate and gets out of the content's way.

Build navigation, dialogs, dropdowns, sheets, tabs, and form controls on the `scaffold_ui_kit` tool's primitives (see the cloudflare-bundler-apps skill) rather than hand-rolling them from raw divs — they're accessible and well-behaved by construction (focus trapping, keyboard nav, portal-rendered overlays), which is what most hand-rolled nav/dropdown implementations get wrong. Start pages from `get_ui_blocks` so structure and spacing come from the kit's layout primitives rather than ad-hoc values. Heroes and processes are where hand-built pages are weakest, so start those from blocks too: `hero-product` to show software working, `hero-workflow` to show how the work flows, `hero-statement` for a type-led brand, `hero-split` for a photo of the real thing; `process-steps` or `process-interactive` for "how it works". Rewrite their sample content (steps, cases, screens) for the brief and keep their structure and motion. Using the kit is not a license to accept its neutral defaults: choose a `theme` and `radius` preset that fit the brief, or set its tokens (`--background`, `--primary`, etc., as bare HSL components) to the brief's actual palette, the same way you'd restyle a hired designer's component library rather than ship it unthemed. A kit component with the wrong theme tokens is as generic a tell as a stock gradient hero.

When you do use a gradient, prefer a subtle single-hue fade — one color moving to transparent, or to a lighter/darker shade of itself, typically top-to-bottom or bottom-to-top (e.g. to ease a hero image into the background color, or add quiet depth behind a section) — over a mixed-color gradient that blends two or more distinct hues. A single-hue fade reads as a restrained lighting/depth cue; a multi-hue blend is the decorative "gradient wash" that makes a page look templated. This refines, not replaces, the general gradient caution below: even a single-hue fade should have a clear job (legibility, depth, transition), not be applied reflexively to every section.

Use non-user-triggered motion sparingly and deliberately, only to draw attention. A single orchestrated moment — one page-load sequence or one reveal — lands better than scattered effects; fade-and-slide-up entrances on each section and hover transitions on every card are the generic default and read as AI-generated. Motion that answers a person's action (opening, expanding, confirming) is welcome when it shows what changed.

Consider written content carefully. Often a design brief may not contain real content, and it's up to you to come up with copy and placeholder content. Copy can make a design feel as templated as the design itself. See the below section on writing for more guidance.

## Interface polish

Distinctive direction still needs to execute cleanly at the detail level — a strong concept reads as amateurish if the small mechanics are off. These are specific values, not ranges to approximate: `cubic-bezier(0.2, 0, 0, 1)` is not `cubic-bezier(0.4, 0, 0.2, 1)`, and `0.96` is not `0.95`. With `scaffold_ui_kit`, most of this is already handled by the kit's primitives — apply these rules to the custom surfaces you build around them (heroes, custom cards, bespoke sections).

**Concentric border radius.** When nesting rounded elements, outer radius = inner radius + padding (e.g. a `16px`-radius container with `8px` padding gets an `8px`-radius child). Mismatched radii on closely nested surfaces is the most common thing that makes an interface feel off. Past `24px` of padding, treat the layers as independent surfaces and pick each radius on its own rather than forcing the math.

**Optical over geometric alignment.** When geometric centering looks off, nudge it. A button with a trailing icon reads better with slightly less padding on the icon side (start with `text-side − 2px`). Play-button triangles and other asymmetric icons (stars, carets, arrows) need a manual translate, ideally fixed in the SVG itself rather than patched with margin.

**Shadows for elevation, borders for structure.** Where a border on a button, card, or container exists only to create depth, replace it with a layered `box-shadow` instead — shadows use transparency so they adapt to any background, which a fixed border color can't. Never apply this to dividers, table boundaries, or anything whose job is layout separation, not depth — those stay borders. A light-mode "shadow as border" recipe: `0px 0px 0px 1px oklch(0 0 0 / 0.06), 0px 1px 2px -1px oklch(0 0 0 / 0.06), 0px 2px 4px 0px oklch(0 0 0 / 0.04)` (a hover state can deepen each alpha by ~0.02). In dark mode, simplify to a single ring: `0 0 0 1px oklch(1 0 0 / 0.08)`.

**Image outlines.** Give photos a `1px` outline at low opacity for consistent depth: pure black in light mode (`oklch(0 0 0 / 0.1)`), pure white in dark (`oklch(1 0 0 / 0.1)`), with `outline-offset: -1px` so it hugs the image's corner radius. Never a tinted neutral (slate, zinc, a near-black hex) or the brand accent — a tinted outline picks up the surface underneath and reads as dirt on the edge.

**Animation mechanics.** Use CSS transitions for interactive state changes (they can be interrupted mid-animation); reserve keyframes for staged sequences that run once. Name the exact properties being transitioned (`transition-property: scale, opacity`) rather than `transition: all`. Reserve `will-change` for `transform`/`opacity`/`filter` and only add it where you see real first-frame stutter.

**Staged enter, soft exit.** For an infrequent staged entrance where sequence communicates hierarchy (a hero on first load, a success state) — not routine interactions like row hovers — split the content into semantic chunks and stagger them by ~100ms; titles can split further into words at ~80ms. Combine `opacity`, `blur(4px→0)`, and a small `translateY` for the enter. Exits should be softer and shorter than enters: a small fixed `translateY` (around `-12px`, not the full container height) over ~150ms with `ease-out`, versus ~300ms for the enter.

**Contextual icon swaps** (e.g. play/pause, menu/close). Animate with `opacity`, `scale`, and `blur` rather than toggling visibility: scale `0.25→1`, opacity `0→1`, blur `4px→0px`. With a motion library already in the project, use a zero-bounce spring (`{ type: "spring", duration: 0.3, bounce: 0 }`); without one, keep both icon states in the DOM, one absolutely positioned, and cross-fade with `cubic-bezier(0.2, 0, 0, 1)`.

**Scale on press.** `scale(0.96)` on click gives tactile feedback — always `0.96`, not lower (it starts to feel exaggerated below `0.95`).

**Theme-switch transitions.** A light/dark toggle changes color, background, border, and shadow on most elements at once; if those all have their own transitions, the switch smears instead of snapping. Suppress transitions globally for one frame during the toggle (`*,*::before,*::after{transition:none!important}`, force a reflow, then remove it), rather than leaving per-element transitions to fire together.

**Icon stroke weight.** Match the icon's stroke to the adjacent text's optical weight: `1.5px` beside regular (400) text, `2px` beside semibold (600). Keep one stroke weight and one icon library per surface, and recolor a single outline icon via `currentColor` for hover/selected/disabled states rather than swapping in separate filled assets per state.

## Process: plan, review against the brief, build, critique

For calibration, AI-generated design right now clusters around some traits:
1. a warm cream background (near #F4F1EA) with a high-contrast serif display and a terracotta or warm-clay accent (often near #D97757 — Anthropic's own Claude-interaction accent, so on a user's brief it reads as a tell);
2. a near-black background with a single bright acid-green or vermilion accent;
3. a broadsheet-style layout with hairline rules, zero border-radius, and dense newspaper-like columns;
4. the SaaS-card kit: content chopped into identical rounded cards, one border-radius on everything regardless of hierarchy, the same soft grey shadow (rgba(0,0,0,.1)) under each, and gradient washes as decoration;
5. template chrome that appears whatever the subject: a tracked-out ALL-CAPS eyebrow label above every heading; meta strings joined with middle dots ('A · B · C'); labels built as 'WORD — fragment' with a spaced em dash; tinted near-black (#0B0B0B, #111) standing in for black; a monospace face for small data labels; a '→' appended to link and button text.

All traits are legitimate for some briefs, but they are defaults rather than choices, and they appear regardless of subject. Where the brief pins down a visual direction, follow it exactly — the brief's own words always win, including when it asks for one of these looks. Where it leaves an axis free, don't spend that freedom on one of these defaults. As with a hired human designer, there's often a careful balance between doing what you're good at and taking each project as a chance to experiment and learn.

Work in two passes. First, brainstorm a short design plan based on the client's design brief: create a compact token system with color, type, layout, and principles.
- Color: describe the core base palette as 4–6 named hex values.
- Type: the typefaces and their roles.
- Layout: a layout concept, using one-sentence prose descriptions and ASCII wireframes to ideate and compare. Include alignment guidance; should the content be left aligned, center aligned, justified?
- Principles: the high-level guidance for what makes this page unique.

Then review that plan against the brief before building: if any part of it reads like the generic default you would produce for any similar page (work through a similar prompt to see if you arrive somewhere similar) rather than a choice made for this specific brief — revise that part, say what you changed and why. Only after you've confirmed the relative uniqueness of your design plan should you start to write the code, following the revised plan.

When writing the code, be careful of structuring your CSS selector specificities. It's easy to generate CSS classes that cancel each other out (especially with a type-based selector like .section and an element-based selector like .cta). This can happen often with padding/margin between sections.

## Restraint and self-critique

Spend your boldness in one place. Let one element be the memorable thing, keep everything around it quiet and disciplined, and cut any decoration that does not serve the brief. Build to a quality floor without announcing it: responsive down to mobile, visible keyboard focus, reduced motion respected, visually accessible, harmonious color palettes. Critique your own work as you build, taking screenshots to review if your environment supports it — a picture is worth 1000 tokens. Consider Chanel's advice: before leaving the house, take a look in the mirror and remove one accessory. Human creatives have memory and always try to do something new, so if you have a space to quickly jot down notes about what you've tried, it can help you in future passes.

## More on writing in design

Words appear in a design for one reason: to make it easier to understand and use. They are design content, not decoration. Bring the same intentionality and minimalism to copywriting that you would bring to spacing and color. Before writing anything, ask what the design needs to say, and how it can best be said to help the person navigate the experience.

Write from the end user's perspective. Name things by what users will understand in simple language, not by how the system is built. A user manages notifications, not webhook config. Describe what something is or does in plain terms rather than selling it. Being specific and legible to new users is always better than being clever.

Use active voice as default. A CTA says exactly what happens when it is used: "Save changes," not "Submit." An action keeps the same name through the whole flow, so the button that says "Publish" produces a toast that says "Published." The vocabulary of an interface is the signposting for someone navigating the product. Cohesion and consistency are how people learn their way around.

Treat failure and emptiness as moments for direction, not mood. Explain what went wrong and how to fix it, in the interface's voice rather than a person's. Errors don't apologize, and they are never vague about what happened. An empty screen is an invitation to act.

Keep the tone conversational: plain verbs, sentence case, no filler, with tone matched to the brand and the audience. Let each written element do exactly one job.
