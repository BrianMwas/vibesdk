---
name: design-taste
description: Art direction and a strict no-slop house style for public websites, from tasteskill v2 (a study of 247 curated gallery sites). The idea comes from the subject, not the category; no gradients, eyebrows, monospace labels, index numbers, hairlines, resting shadows, glass or icon-card rows; type set large, whole fields of flat colour, real pictures, and every section carrying its full content. Load before designing, building, restyling or reviewing a landing page, marketing site, small-business site or one-pager. Where another design skill disagrees with the house rules here, these win.
license: MIT. Adapted from Leonxlnx/taste-skill (skills/taste-skill), see LICENSE.txt
metadata:
  source: https://github.com/Leonxlnx/taste-skill. The original deals directions with a script and measures pages in a real browser; neither runs here, so this version keeps the rules and the order of work and replaces the scripts with checks you make yourself.
---

# Design taste

A page built by a model usually looks like the average of every page the model has seen: a centred
headline over three lines, a little label above it, a row of icon cards, a soft gradient, a few thin
rules and a monospace caption. Nothing in it is wrong and nothing in it was decided.

This skill replaces those defaults with decisions:

1. **The idea comes from the subject.** In the study, what separated the best sites from the
   forgettable ones was a concept taken from the thing itself, not the styling.
2. **A house style with no ornaments.** The rules below are checked, not hoped for.
3. **Substance in place of ornament.** Taking the ornaments away is only half the job. A page that has
   lost its labels, rules and cards and gained nothing in their place reads as thin, and blind jurors
   rightly prefer a richer page with tells over an empty page without them. The other half is type
   set larger, whole fields of colour, real pictures of this subject's world, and every section
   carrying its full content. Do not trade that for restraint.

## The run

Do these in order. Steps 1 to 4 take a few minutes and decide whether the page is any good.

### 1. Inventory the subject

Find out what is real: the business, its customers, the one thing the page must get someone to do,
any existing brand (colours, fonts, logo), and what imagery truly exists (the business's own photos in
its facts, or nothing). Do not plan around pictures you do not have.

Then write down, in your notes, eight to twelve things that belong to this business and to no
competitor: its name and what the name means; its town, street and neighbourhood and what that place
looks like (its signs, paint colours, materials, light, weather); the numbers in its facts (prices,
hours, years, sizes); the constraint it lives with (by appointment, one batch a week, closed Sundays);
its materials and colours; its rituals and hours; the printed things of its world (a menu, a receipt,
a ticket, a label, a price list). This list is where the idea comes from, and each place, material and
printed thing on it is a query for `search_images`.

### 2. Write the argument

Before any design, list the page as claims with their proof, one line per section. The claims decide
which sections exist and in what order. Delete any section that has no claim. This is how you avoid
the stock sequence of hero, logos, three features, testimonial, pricing, call to action.

### 3. Choose the direction

Choose a starting direction (the design-archetypes skill gives them by kind of business), then hold it
against your inventory: which way of composing can carry something only this business has? If the
direction's palette fights the subject's own material (candy pastels for a hardware store, neon for a
bakery), keep its proportions and take the colours from the subject instead. When the business has a
brand, keep its colours and faces and take only the composition.

### 4. Find the idea

Write this sentence in your notes and do not start building until both blanks are filled from the
subject itself:

> On this page, **[something that belongs to the subject]** becomes **[the device the direction calls for]**.

Places to look for the first blank: its output (put the real output on the page as material); its
object or shape (enlarge it, crop it, make it the frame or the one motif); its name (can the letters
hold a photograph, stack into a wall?); its place (one view that makes someone want to be there); its
ritual (a sequence the page can perform as it scrolls); its artefact (the menu, the ticket, the label
that already exists in its world).

**The competitor test:** put the nearest real competitor in the sentence (the salon two streets away,
another furniture maker). If the sentence still works, the idea belongs to the category, not to this
business. "Clean and modern" is not an idea.

**One live thing.** Give the page one thing the visitor can do, made from the idea and the real facts:
pick a product and see its price and the WhatsApp message it would send; choose a service and see how
long it takes and what it costs; see whether the shop is open right now from its real hours. It uses
real content, works with a thumb, has a plain fallback without script, never blocks reading, and is
one thing, not a playground.

### 5. Write the words

Write the whole page as plain text before markup:

- **Every headline fits in two lines or fewer at every width.** About 32 characters is safe everywhere
  at a confident size. The studied gallery heroes have a median of 5 words and 32 characters.
- One supporting sentence. One primary action, named for what it does, as a real button on the first
  screen.
- **The first screen answers the visitor's first question in large type:** what this business is and
  what it does or costs.
- **Write the full content.** Every section delivers its information completely: every product with
  its price, every service, an answer for each real question. Thin sections are the commonest reason a
  clean page loses to a busier one.
- Proof is never invented: no customers, quotes, reviews, press, logos or statistics the facts do not
  hold. Leave the section out instead.
- No genre words: unlock, supercharge, seamless, elevate, effortless, cutting-edge, all-in-one. No
  "not just X, it's Y". No "Get started" or "Learn more" as labels. Few em dashes.

### 6. Build it, still

Build with motion switched off in your head; a page that needs animation to look finished is not
finished.

1. **Tokens first.** Colour and type roles as CSS custom properties. Everything downstream references
   tokens only.
2. **The hero,** at desktop and phone width. Get the big thing big and the small things small before
   anything else exists.
3. **Each section,** with this business's content. Neighbouring sections must not share a layout.
   **Carry the idea into every section,** questions and footer included: the commonest failure in the
   study is a distinctive first screen followed by stock blocks.
4. **Imagery,** in this order of preference: the business's own photos from its facts; real
   photographs of the subject's world from `search_images`, searched from the inventory and not the
   category (its trade, its material up close, its kind of street), used large and with intent; a
   drawing in code of what no honest picture exists of, in one flat graphic language in the palette's
   real colours; type and colour alone. A found picture shows the world around the business and is
   never presented as its own product, room, dish, person or team. Aim for at least four real pictures
   on a full page; drawings do not count toward that.
5. **The live thing** from step 4, built into the section where it proves the claim.
6. **Fullness.** Look at each desktop screen as a poster: one dominant thing and the content it
   carries. A screen that is mostly empty ground is an underbuilt section, not a rest. One deliberate
   rest per page at most. Running text is in the full ink at 16px or more; grey is for secondary notes.
7. **States and semantics.** Real links and buttons, visible focus, alt text, a phone layout that is a
   composition of its own.

### 7. Check it

You cannot see the page here, so read what you wrote as a juror would look at it. Go through the house
rules below one by one against the code, then these passes:

1. **One second.** What is the one thing on the first screen? If the answer is "a website", there is
   no focal point.
2. **Cover the logo.** Could this first screen belong to a competitor? Does the idea reach the
   questions and the footer, or does the page turn into stock blocks after the first screen?
3. **Edges.** Text blocks share two or three left edges on the whole page, not six.
4. **Space.** The gap between sections is clearly larger than any gap inside one.
5. **Type.** The jump from body to headline is three times or more; five sizes at most.
6. **Colour.** One colour holds most of the surface; the accent appears on the action and perhaps one
   other thing.
7. **Sameness.** Write one word for each section's layout (split, list, full-bleed, statement, index…).
   The same word twice in a row is the template showing.
8. **Phone.** The phone screen is its own composition, with its own crop and line breaks.
9. **Substance.** Every section delivers its information completely, and the primary action is a real
   button on the first screen.

Fix what fails in this order: the idea, hierarchy, composition, typography, imagery, colour, detail,
motion. When removing something leaves a gap, close the gap, enlarge what remains, or let a picture or
a colour field take the space; never refill it with an ornament.

### 8. Move

Then a small motion layer: an entrance for the parts of each section (heading, then text, then
picture, staggered 60 to 90ms, rising 16 to 32px with opacity, once, and never content that stays
hidden if the script fails); feedback on every control (press, hover, focus); one slow move on one
picture. Transform and opacity only, and a `prefers-reduced-motion` fallback that keeps the content
and drops the travel. No bounce, no infinite loops that mean nothing, no hover lift on every card.

## House rules

These hold on every build, whatever the direction.

| Rule | Instead |
| --- | --- |
| **Headlines: two lines or fewer, at every width.** Every `h1` to `h6`, and the main line of the first screen whatever its tag. | Cut words. Then widen the measure. Size last. |
| **Statements are paragraphs.** An intro sentence or a quotation set large is a `<p>` or `<blockquote>`, at most 36px on desktop and 24px on a phone, about 25 words. | Larger than that it is a headline and the two-line rule applies. |
| **No eyebrows.** No small label above a heading, no pill badge above the headline, no "New ·" chip. | Put the information in the heading or the first sentence, or drop it. |
| **No monospace** outside real code. | The text face. Tabular figures where numbers align. |
| **No index numbering.** No 01 / 02 / 03, no (001), no "Step 2". | Order shown by position, size, or the words. A real `<ol>` if order matters. |
| **No thin rules.** No hairline dividers, no 1px outlined boxes, no grid lines, crosshairs or crop marks. | Space. A step in background tone. A change of scale. A filled shape. |
| **No gradients.** Not as backgrounds, not on buttons, not in text, not as a fade between sections. | Flat colour, or a real photograph. A neutral scrim under text on a photo is the one exception. |
| **No shadows on things at rest.** No glows. | A tone step between surfaces. Shadows only on what truly floats: a menu, a dialog. |
| **No assistant palette.** No yellow-cream ground with terracotta or rust; no violet or indigo; no near-black with one neon accent. | A palette taken from the subject. |
| **No tiny uppercase letter-spaced labels.** | Sentence case at a readable size. |
| **No icon-topped feature cards, no rows of identical cards, no bento grids.** | A composed section. |
| **No glass.** No backdrop blur panels, no floating pill navigation. | A plain bar: wordmark, a few links, one action. |
| **No emoji, no gradient blobs, no decorative shapes, no fake dashboards of grey bars, no decorative status dots.** | A real picture, a real interface fragment, or nothing. |
| **No styled accent word** in a headline (italic, serif, coloured, underlined). | One face, one colour. The words carry the emphasis. |
| **Two typefaces at most,** usually one. | One family set at a few sizes far apart. |

Real code in `<pre>`/`<code>`, real tables and form fields keep their own conventions (they may have
lines).

Why these, honestly. Among the 247 sites, those scored 7.5 or higher used icon feature cards 1% of the
time against 28% for sites under 6.5, pill badges 14% against 34%, gradients 22% against 52%, shadows
24% against 48%, tiny tracked caps 16% against 57%. Monospace labels, index numbers and hairline grids
are actually more common on award sites than on weak ones, which is exactly why generators imitate
them and why they now read as costume. They are banned here without exception.

## Laws of the craft

**Type**
- Two or three sizes do the visible work: one very large, one small, little in between. The best
  sites set their largest type far larger than the weak ones (median 8.4vw against 5.0vw).
- Display type: tracking -0.02 to -0.05em, leading 0.85 to 1.05. Text: 16 to 20px, leading 1.45 to
  1.6, 45 to 75 characters per line.
- Five sizes on a page is the ceiling. Left-aligned by default; centre at most one moment.

**Space**
- One grid, one pair of tight margins (16 to 32px) used everywhere; large things run to the edges.
- The gap between sections is clearly larger than any gap inside one: 120 to 220px on desktop.
- Each section has a different composition from its neighbours; none is a card grid.

**Colour**
- One ground, one ink, one accent. The accent appears on the action and perhaps one other thing.
- Running text in the full ink. A page set in soft grey reads unfinished.
- Surfaces are separated by a small step in tone, never by a line or a shadow.
- A section may change the whole field colour. Nothing fades into anything.

**Imagery**
- One dominant image beats six small ones. On the top-scored sites the hero picture covers at least
  half the first screen 68% of the time.
- Same crop ratios, same treatment, square corners unless the direction says otherwise.
- No image is better than a placeholder, an icon or an abstract shape.
- Nothing ever lies on top of a headline or a statement.

**Components**
- Buttons: flat, one fill colour, either square-cornered or fully round, decided once. The soft 9 to
  16px radius on everything is the weak-site default.
- Navigation: wordmark, three to five plain links, one action. No bar chrome.
- The footer is a designed close, not a sitemap: on most strong sites the name returns at full width.

## Tells, and why removal is not enough

A tell is a device that makes a page read as generated. Most began as good ideas and became tells by
being produced by default. The recent waves: violet gradients and glowing buttons; eyebrows, pill
badges, bento grids and floating blurred navigation; then the "fix" that became the look, a cream
ground with a terracotta accent, an oversized italic serif headline, and hairline rules everywhere.
Every published "use this instead" list becomes the next wave, which is why the replacement is always
a procedure (derive it from the subject), never a product.

A page with every tell removed and nothing put in their place is an empty page with good manners, and
that is a tell too. The tells were filling a gap where an idea should have been. The order of work
above exists to fill that gap first: the idea from the subject, real pictures or committed type, the
full content, and only then the checks.
