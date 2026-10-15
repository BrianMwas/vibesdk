---
name: design-archetypes
description: How a customer's website is designed. The idea from the business itself (an inventory, the idea sentence, the competitor test, one live thing), the house rules (no gradients, resting shadows, glass, eyebrows, monospace labels, index numbers, hairlines or icon-card rows), contrast-checked palettes and type by kind of business, twenty compositions researched from 247 gallery sites, and the check before handing over. Load before designing, building or restyling any business's website; its house rules win over any other design skill.
metadata:
  source: Font pairings are from the ui-ux-pro-max typography dataset. Palettes are written for this skill and checked for WCAG contrast. The run, house rules, laws and the twenty compositions are adapted from tasteskill v2 (github.com/Leonxlnx/taste-skill, MIT, see LICENSE-tasteskill.txt), a study of 247 curated gallery sites.
---

# Design archetypes

A business's website should look like that business, and not like the last one you built. A page built
by a model usually looks like the average of every page the model has seen: a centred headline over
three lines, a little label above it, a row of icon cards, a soft gradient, a few thin rules and a
monospace caption. Nothing in it is wrong and nothing in it was decided. This skill replaces those
defaults with decisions: the idea comes from the business, a house style with no ornaments, and
substance where the ornaments were.

Taking the ornaments away is only half the job. A page that has lost its labels, rules and cards and
gained nothing in their place reads as thin, and blind jurors rightly prefer a richer page with tells
over an empty page without them. The other half is type set larger, whole fields of colour, real
pictures of this business's world, and every section carrying its full content.

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

Choose a palette and type from the archetype tables below and a composition from the directions after
them, then hold both against your inventory: which way of composing can carry something only this business has? If the
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

## How to choose

1. Do the inventory and write the idea sentence first (above). Then use the archetype the platform named. If it named none, pick the closest from the list below.
2. If a variation number was given, take direction `number mod count` within the archetype. If none was given, pick the direction that best fits what the business sells and who it sells to.
3. If the site data carries brand colours, they replace the direction's primary and accent. Keep the direction's background and text, then check the contrast rules below.
4. Commit to the direction. Adapt it to the business's own materials, products and words. Do not blend two directions into a safe average.
5. Do not default to Inter, Roboto, Arial or system fonts, and do not reuse one pairing for every site.

## Contrast rules

A palette that fails these is wrong, whatever it looks like.

- Body text on the background: at least 4.5:1.
- A button's label on its fill: at least 4.5:1. On a dark direction the label is the background colour, not white.
- The accent colour on the background: at least 3:1, and use it only for rules, large type and marks. Small text in the accent needs 4.5:1.
- Check brand colours against these before using them. If one fails, darken it until it passes and keep the hue.

## Fonts

Load fonts from Google Fonts with a `<link>` in the page head, using the URL given for the direction, and set `font-display: swap`. The published site's content policy allows `fonts.googleapis.com` and `fonts.gstatic.com` and nothing else, so do not self-host from other origins.

## Editorial (a publication, blog or magazine)

Type carries the page. Keep lines under about 70 characters, give serif body more line height than sans, and let the headline treatment do the work.

| Direction | Headings / body | Background, text, primary, accent | Suits |
|---|---|---|---|
| Broadsheet, modern | Libre Bodoni / Public Sans | `#FAFAFA` `#09090B` `#18181B` `#BE123C` | News, features, magazines with a sharp voice |
| Literary | Cormorant Garamond / Libre Baskerville | `#F6F8F4` `#14291F` `#14532D` `#9A3412` | Essays, books, slow reading |

Fonts: `https://fonts.googleapis.com/css2?family=Libre+Bodoni:wght@400;500;600;700&family=Public+Sans:wght@300;400;500;600;700&display=swap` and `https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Libre+Baskerville:wght@400;700&display=swap`.

## Ecommerce showcase (products shown, not sold on the page)

The products are the design. Show them large, give each a clear way to get in touch, and add no cart or checkout.

| Direction | Headings / body | Background, text, primary, accent | Suits |
|---|---|---|---|
| Luxury | Cormorant / Montserrat | `#FAFAF9` `#0C0A09` `#1C1917` `#A16207` | Jewellery, fine goods, bespoke work |
| Fashion, avant-garde | Syne / Manrope | `#FFFFFF` `#0A0A0A` `#0A0A0A` `#1D4ED8` | Fashion, design objects, a confident point of view |
| Streetwear | Anton / Epilogue | `#F4F4F5` `#09090B` `#09090B` `#BE123C` | Streetwear, youth brands, loud and direct |

Fonts: `https://fonts.googleapis.com/css2?family=Cormorant:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap`, `https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=Manrope:wght@300;400;500;600;700&display=swap` and `https://fonts.googleapis.com/css2?family=Anton&family=Epilogue:wght@300;400;500;600;700&display=swap`.

## Local business (restaurant, salon, clinic, studio)

Warm and specific to the place. Hours, location and a way to book belong near the top.

| Direction | Headings / body | Background, text, primary, accent | Suits |
|---|---|---|---|
| Restaurant | Playfair Display SC / Karla | `#FEF2F2` `#450A0A` `#B91C1C` `#A16207` | Restaurants, cafes, bakeries |
| Wellness | Lora / Raleway | `#F3F7F4` `#1F2D26` `#2F5D50` `#8A5A44` | Spas, salons, clinics, yoga |

Fonts: `https://fonts.googleapis.com/css2?family=Playfair+Display+SC:wght@400;700&family=Karla:wght@300;400;500;600;700&display=swap` and `https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=Raleway:wght@300;400;500;600;700&display=swap`.

## Professional services (legal, accounting, consulting)

Trust comes from restraint, clear structure and plain language. Lead with who the firm helps and how to reach it.

| Direction | Headings / body | Background, text, primary, accent | Suits |
|---|---|---|---|
| Legal | EB Garamond / Lato | `#F8FAFC` `#0F172A` `#1E3A5F` `#92400E` | Law, advisory, anything formal |
| Consulting | Lexend / Source Sans 3 | `#FFFFFF` `#111827` `#0F766E` `#B45309` | Consulting, accounting, agencies |

Fonts: `https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700&family=Lato:wght@300;400;700&display=swap` and `https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&family=Source+Sans+3:wght@300;400;500;600;700&display=swap`.

## Portfolio (a person or studio showing work)

The work is the content. Quiet type, generous space, and an obvious way to commission.

| Direction | Headings / body | Background, text, primary, accent | Suits |
|---|---|---|---|
| Minimal | Archivo / Space Grotesk | `#FFFFFF` `#111111` `#111111` `#C2410C` | Designers, photographers, architects |

Fonts: `https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap`.

## Technology (a product or developer tool)

Precise and plain. Show what it does before you say how good it is.

| Direction | Headings / body | Background, text, primary, accent | Suits |
|---|---|---|---|
| Product | Space Grotesk / DM Sans | `#F8FAFC` `#0F172A` `#1E40AF` `#0F766E` | Software, startups |
| Technical, dark | Exo / IBM Plex Sans | `#0B1220` `#E5E7EB` `#22D3EE` `#FBBF24` | Research, data, hardware, developer tools |

Fonts: `https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap` and `https://fonts.googleapis.com/css2?family=Exo:wght@400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap`.

## What makes it distinct

The table gets you a sound base. The difference between this business and another in the same archetype comes from what you build on it: a hero that shows the thing the business actually makes or sells, a layout shaped by that content, one memorable element, and copy in the business's own words. If the page could belong to any business in the category, it is not finished.

## Compositions

The archetype tables give colour and type. These give the shape of the page. Each is a researched
way of composing from the study of 247 gallery sites; choose the one that can carry something only
this business has, not the most familiar. Keep its geometry and change the subject. Adopt it whole
rather than blending it with the layout you would have made anyway.

### The name as a monument

Suits agencies, studios, personal portfolios, hotels and stays, restaurants, music, culture, fashion.

**Idea.** The name is the headline. Set it so large that it becomes architecture: as wide as the viewport, cropped by an edge, or stacked to fill the screen. Nothing else on the first screen competes; the description of what this is drops to a single small sentence. The idea comes from treating the name's letters as material. Ask what the subject can do to its own name: a photograph of the work sits inside a counter or replaces a letter, the name repeats down the page like a reel, the letters are split to opposite corners and the page happens between them. In the study this was the single most common device among sites scoring 7.5 or more.

**Composition.** First screen: the wordmark spans 88–100% of the viewport width (font-size 16–24vw, set with a clamp so it never wraps), anchored either to the bottom edge with its descenders nearly touching it, or dead centre with everything else pushed to the corners. One line of supporting text at 16–20px sits in a corner on a shared margin; navigation is three or four words in the opposite corner. After the hero the page is deliberately small and calm: a narrow text column or a simple two-column grid, so the contrast with the monument holds. The name returns once more at full width as the footer, in the inverse colours. Margins are tight (20–32px) so the type reaches the edges. Two type sizes do nearly all the work: the monument and a small text size, with one mid size for section headings.

**Type.** One family. The display cut must survive enormous sizes: tight tracking (-0.04 to -0.07em), leading 0.8–0.9, optical kerning on. Section headings are modest (28–40px) on purpose.

**Colour.** Two values carry the page (ground and ink). The accent, if used at all, appears on one thing only: the single action or the inset image frame. The footer inverts ground and ink.

**Pictures.** Few images, used as inserts in the typography rather than as illustrations beside it: one photograph inside or behind the name (a 4:5 or 1:1 frame replacing a letter, or tucked between two words), then a short run of large full-width or half-width photographs further down. Square corners. No collage of small thumbnails.

**Watch for.** A long name set small is just a logo. If the name has more than about 12 characters, stack it on two lines or crop it with the viewport edge; never drop below 12vw. Do not add a second big headline under the name. Do not decorate the letters.

### The sentence is the layout

Suits agencies, software, AI products, developer tools, non-profits, culture, education, physical products.

**Idea.** One short sentence, set at poster scale, is the composition. The trick that makes it an idea rather than a big headline: something from the subject sits inside the sentence where a word would be. A strip of photograph fills the gap between two words; a small live fragment of the product replaces the noun; the object the sentence names is pictured at the size of a letter. Write the sentence first, find the word that can be shown instead of said, and put the showing in its place. The reader completes the sentence with their eyes.

**Composition.** The sentence is four to seven words and runs as one or two full-width lines at 9–13vw. Inline with the type, on the baseline, sits one media slot: a rounded-rectangle or square frame exactly one line-height tall and two to three ems wide, holding a photograph or a looping crop. Above and below the sentence the screen is empty except for a small navigation line and one supporting sentence set small, both on the same left margin. Later sections repeat the grammar at smaller scale: each is a short statement on the left six columns with its proof (image, figure, list) on the right, so the page reads as a series of sentences with evidence. Generous vertical space (160px or more) between sections.

**Type.** Display weight with real presence (medium to bold), tracking -0.03 to -0.05em, leading 0.95–1.0 so two lines sit close. The inline frame aligns to cap height and baseline exactly; set it with em units so it scales with the type.

**Colour.** A calm ground with ink at full contrast. The only colour comes from the photograph inside the sentence; if the palette has an accent, use it once, on the action.

**Pictures.** One strong, simple photograph that reads at small size (a face, an object, a texture, a horizon), cropped to a wide strip inside the sentence. The same image may open to full width in the next section, so the small slot feels like a window onto something larger.

**Watch for.** The sentence must be short enough for two lines on a phone, where the inline frame drops to its own line between the two halves. Do not style one word differently to fake the device. Do not use more than one slot per sentence.

### The pinned poster

Suits culture, music, events, fashion, personal portfolios, studios, physical products, shops.

**Idea.** Something stays put while everything else changes. A title holds its place across the viewport and the images beneath it swap; the name is split to two opposite corners and the page passes between the halves; a single frame stays centred while its contents change. Every scroll step is a new cover of the same magazine. The idea suits subjects that are a series (a book of portraits, a line-up, a collection, a set of projects): the fixed element says what the series is, the changing element shows its members.

**Composition.** A sticky layer holds the fixed element for the height of two to three viewports: usually the title at 10–14vw across the middle or top of the screen, or two words pinned to the top-left and bottom-right corners. Under it, a stack of full-height panels scrolls by, each a single large photograph (portrait 4:5, centred, 40–50% of the viewport wide) with one line of caption at the same small size everywhere. The title sits above the images in the stacking order and uses `mix-blend-mode: difference` or a solid colour that reads on every panel. When the pinned run ends, the page releases into ordinary flowing sections with a narrow measure. Build with `position: sticky`; never hijack the scroll.

**Type.** The pinned title is the only large type on the page. Captions and body share one small size (15–17px). Tight tracking and solid weight so the title reads over photographs.

**Colour.** One strong title colour against a pale or dark ground. Each panel may take its own flat ground colour sampled from its photograph.

**Pictures.** A series of photographs with the same crop ratio and the same framing (all portraits, all objects, all rooms), so that swapping them reads as one image changing. Five to eight in the pinned run.

**Watch for.** If the title is not legible over every panel, the idea fails: test each one. Keep the pinned run under six viewports or it feels like a trap. On a phone the title shrinks to 16–18vw and stays pinned at the top; panels become full-width. A pin longer than three screens, or one where the screens under it are nearly empty, read in blind tests as a stuck page. Every screen under the pin needs its own content, and nothing may pass over the pinned words.

### Colour chapters

Suits agencies, music, events, education, non-profits, software, apps, culture.

**Idea.** Every section is a chapter with its own flat colour, floor to ceiling. The page reads like a set of posters hung in a row, held together by one typeface and one grid. The colours are not decoration: they come from the subject (the brand's packaging, the artist's record sleeves, the product's own colour ways, the categories of the content) and each chapter's colour means that chapter. Decide the sequence like a designer orders a book: a strong opener, a quiet second, a surprise in the middle, a dark or very light closer.

**Composition.** Sections are full-bleed fields, each at least 90svh tall, butted directly against each other with no gap and no divider. Inside every field the same 12-column grid and the same margins apply, and each field holds one thing: a huge heading (8–12vw) with a small paragraph, or one photograph with a caption, or one list. Text colour is chosen per field for strong contrast (ink or paper, never grey). Headings start on the same left edge in every chapter, so the eye feels the system as colours change. The navigation and the footer take the colours of the first and last chapter.

**Type.** One typeface in two weights. Headings very large and tight; body 18–20px. Because colour is loud, the type stays plain: no italics, no second face.

**Colour.** Four to six flat fields used at full strength, one per section, each with its assigned text colour. No tints, no gradients between them: the hard edge where two fields meet is the look.

**Pictures.** Sparing. One photograph or object per chapter at most, either cut out and sitting directly on the colour, or a plain rectangle with generous colour around it. Photographs should be simple enough not to fight the field.

**Watch for.** Check contrast on every field with the palette's assigned ink. Do not put cards on the fields. Do not use more than six colours. Two neighbouring fields should differ clearly in lightness as well as hue.

### The place carries it

Suits hotels and stays, restaurants, property, architects, events, clinics and wellness, culture, non-profits.

**Idea.** For a place, the photograph is the argument. One full-bleed image of where you would be standing fills the first screen, and the design steps back: the name sits along the bottom edge like a film title, or small in a corner, and nothing else interrupts the view. The page that follows keeps that restraint: few words, large pictures, long pauses. The designer's work here is editing: choosing the one frame that makes someone want to be there, and then not covering it.

**Composition.** First screen: a single photograph at 100vw by 100svh, focal point kept clear of text. The name is set either very large (14–20vw) hugging the bottom edge with 16–24px of margin, or small (20–28px) top-left with a one-line description bottom-left. Navigation is two to four words in the top corners in the same small size. If text sits on the image, a soft neutral scrim under the text area only. Below, sections alternate between a short centred or left-set paragraph in a narrow column (max 52ch) with wide empty margins, and photographs shown large: one full-bleed, then a pair at different sizes, then one portrait offset to the right. Practical information (hours, address, rates, booking) is gathered once near the end in a plain two-column block.

**Type.** A face with some grace for the name; small, calm, well-spaced text everywhere else. Sentence case. Body 17–19px with leading around 1.55.

**Colour.** Neutral paper or deep neutral ground chosen to flatter the photographs; text ink drawn from the darkest tone in the imagery. Colour lives in the pictures.

**Pictures.** The photographs are the palette. Choose four to six photographs with the same light. The hero image must have a calm area for the name. Full-bleed or large with square corners; never thumbnails, never a carousel of ten.

**Watch for.** A weak hero photograph cannot be fixed by typography; pick again. Do not stack a headline, a paragraph and two buttons on the image. Do not use a booking bar that covers the bottom of the view; one small action is enough.

### The page is the object

Suits restaurants, events, hotels and stays, culture, music, physical products, shops, non-profits.

**Idea.** Find the printed or physical artefact that already exists in the subject's world and build the page as that thing. A wedding site is the invitation card. A restaurant is its menu. A conference is the ticket; a record is its sleeve; a shop is the receipt or the swing tag; an archive is a stack of tabbed folders; a course is the syllabus sheet. The artefact supplies everything a template would otherwise invent: its proportions, its typographic manners, its way of grouping information. Visitors recognise the object instantly, which is why these pages feel specific.

**Composition.** The first screen shows the artefact as a single filled panel (paper colour on a contrasting ground) centred or offset, with believable proportions: a card at 5:7, a ticket at about 2.2:1 with a notch cut by `clip-path`, a menu as a tall sheet. All primary content lives on it, set the way that object is set: centred and symmetrical for an invitation, in tidy aligned columns for a menu or ticket. The ground behind is a flat colour or one full-bleed photograph. As the page continues, each section is another piece of the same stationery: a second card, a tear-off stub, a folded panel, always filled shapes with real edges (straight, notched, scalloped, perforated by a dotted `border` of round dots at 4px or more), never outlined boxes. The footer is the back of the object.

**Type.** Take the manners of the artefact: a bookish serif with small caps avoided, or a blunt condensed face for tickets and posters. Sizes stay within what print would use relative to the panel; the name is large on the panel, details are small and exact.

**Colour.** Paper and ink plus the ground the paper sits on. Two or three flat colours in total, like a two-colour print job.

**Pictures.** Optional. One photograph behind the object, or small photographs placed on it like tipped-in plates. The object itself is the image.

**Watch for.** Choose an artefact that truly belongs to the subject, or it becomes costume. Shape the edges with fills and `clip-path`; an outlined rectangle with a thin border is not an object. Keep text sizes readable on a phone, where the object becomes full width with its shaped edge kept at top and bottom.

### One motif

Suits software, finance, apps, AI products, developer tools, clinics and wellness, physical products, restaurants.

**Idea.** Take one shape from the subject and let it run the whole system. A drilling tool's octagonal cross-section becomes the buttons, the image masks and the loader. A two-account money app becomes two circles that recur as icon, inline dot and section colour. A café's striped awning becomes every band on the page. Look at the product, the logo, the object or the word in the headline and find the simplest geometry in it (a circle, an arc, a chamfer, a stripe, a notch, a ring). Then use only that shape, at three or four very different scales, everywhere a designer would normally reach for a generic rounded rectangle.

**Composition.** Hero: the motif appears once at enormous scale as a flat filled shape, cropped by the viewport (a circle 120vh across entering from the right, a chamfered block filling the lower half), with a short headline at 6–8vw and one supporting sentence set on the remaining ground, left-aligned on a shared margin. Through the page the motif returns as: the mask for every photograph (via `clip-path` or `border-radius` made from the same geometry), the shape of the primary button, the bullet beside list items at text size, and one full-width band that separates the two halves of the page. Sections use simple two-column or single-column layouts so the shape is the only thing with character.

**Type.** A clean geometric or grotesk face that echoes the shape (round bowls for circles, squared terminals for chamfers). Medium weight; headings 6–8vw in the hero and 3–4vw after.

**Colour.** The motif carries the accent colour at large scale, flat. Everything else is ground and ink. A second motif colour is allowed only if the subject has a real pair (two accounts, two modes).

**Pictures.** Photographs appear inside the motif's shape. If there is product interface to show, it sits on a flat colour stage shaped by the motif. Draw the shape with CSS or a simple inline SVG path; do not draw illustrations.

**Watch for.** One motif means one. A circle here, a hexagon there and a blob behind is the generated look this replaces. The motif must come from the subject and you must be able to say from where in one clause.

### The product performs

Suits software, developer tools, AI products, apps, finance.

**Idea.** Software is most convincing when it is doing its job in front of you. Instead of describing features, put small, true, working fragments of the product on the page: the actual control, with real content, responding to the pointer. A colour picker's loupe reads the page's own background and prints its value. A list tool lets you tick an item right there. A type-scale plugin sets the page's own headings. Find the one interaction that is the product and make the hero that interaction; then show each further capability as another fragment at real size. No dashboard collage, no browser frame, no screenshots shrunk until unreadable.

**Composition.** Hero: a short plain headline (4–6vw, left-aligned, upper-left third) and one sentence; the rest of the first screen is the main fragment at actual interface size, sitting directly on the page or on one flat stage colour, large enough to read every label. The fragment is built in HTML and works. Below, capabilities are a single-column sequence, each a row of two parts on a 5/7 split: a two-line statement on one side and the relevant fragment on the other, with the fragments varying in size and shape so the column never becomes a zigzag of equal blocks. Fragments are cropped pieces of interface (a menu, a row, a control, a panel edge), not whole windows. One section pins a fragment while three short statements change it.

**Type.** The marketing type matches the product's interface type so the fragments and the page feel like one thing. Headline modest; interface text at its true size (13–15px) inside fragments.

**Colour.** Neutral ground. The product's own interface colours provide the colour. At most one flat stage colour behind fragments.

**Pictures.** The interface fragments are the main imagery: build them carefully with real labels, real numbers and sensible states (one hovered, one selected). Around them, two or three real pictures of the customer's world (found with scripts/assets.mjs), never stock of people at laptops.

**Watch for.** A fake interface made of grey bars and circles is the worst outcome; if you cannot build a believable fragment, change direction. Inside a fragment the product's own conventions (1px control borders, its menus) are fine; outside it the house rules hold. Do not put the fragment in a browser or laptop frame.

### The quiet instrument

Suits software, developer tools, AI products, personal portfolios, apps, finance, anything else.

**Idea.** Radical understatement. Where every competitor shouts, this page almost whispers: a headline barely larger than body text, a narrow column, small exact demonstrations, and a great deal of untouched space. The restraint is the claim. It says the thing is simple, finished and sure of itself. This only works when it is carried through completely; one loud element breaks it. In the study, a tool for simple lists sold itself with a 27px headline and 12–14px copy and was one of the most confident pages in the set.

**Composition.** A single column 440–560px wide, placed left of centre (starting at about 22% of the viewport width) or dead centre, running the whole page. The headline is the one large thing on the first screen: two lines at display size (5–7vw), medium weight, starting on the column's left edge and allowed to run wider than the column. The supporting paragraph follows at body size (17–19px) in the full ink. One small primary button and one text link. Below, each point is a short paragraph followed by a compact demonstration or image no wider than the column. Sections are separated only by space (96–140px). Nothing spans the full width until the footer, which is a single quiet line. The first screen is mostly empty and that emptiness is composed: the column's top edge sits at about 30% of the viewport height.

**Type.** One family, two weights. A display size for the headline (5–7vw), one heading size for section titles (about 32–40px), body at 17–19px, a small size for captions (14–15px). Leading 1.5 for text. Letter-spacing near zero. The typeface must be handsome at small sizes.

**Colour.** Paper and two inks (full and soft). One accent used on exactly one element per screen.

**Pictures.** Precise rather than loud: cropped interface details at true size, and real photographs of the customer's world held to the column width, each doing one job. One short looping clip can sit at column width too. Never a large stock hero image.

**Watch for.** This is the one direction where a small headline is right, but do not mix it with a large display line. Emptiness must look decided: keep the column edges exact and the vertical rhythm even. Not suitable when the subject needs emotion or photography to sell. Quiet is not thin: the column must still deliver every piece of content the brief asks for, in full, at 16px or more in the full ink. In blind tests the quiet version lost every time it was quiet everywhere: a small headline beside an empty panel read as unfinished. Quiet means few things, not small things: the headline and the demonstration are large, and every screen holds content.

### The object, large

Suits physical products, shops, apps, fashion, finance, clinics and wellness, restaurants, music. Needs real product photographs; skip it without them.

**Idea.** Show the thing, bigger than seems reasonable. One photographed object fills the first screen, scaled until the viewport crops it, with the text small and tucked beside or behind it. The crop is the idea: a record whose edge leaves the top-right corner, a bottle whose shoulder runs off the bottom, a chair seen so close you read its grain. Being that close reads as confidence in the object. Everything else on the page serves it: details as tight close-ups, facts as short lines, one way to buy.

**Composition.** First screen: the object occupies 55–75% of the viewport and breaks at least one edge. It sits on a flat field (ground colour or one bold colour), never in a box. The headline is short and either very large and partly hidden behind the object (10–13vw, the object overlapping two or three letters) or small (28–36px) in the opposite corner with a one-line description. No navigation bar beyond a wordmark and one action. Following sections: a row of three or four close-up details at different crop ratios (not equal tiles), a single wide photograph of the object in use, a plain list of facts set large (materials, size, price) aligned to one edge, then the purchase action. The object returns once at the end from a different angle.

**Type.** Either very large and structural or very small and precise; pick one for the headline and hold it. Facts are set in the text face at 22–28px, not in a table.

**Colour.** A flat field chosen to make the object's own colour sing (its complement, or a tone darker than its shadow side). One field for the whole page, or a second for the facts section.

**Pictures.** Use the product's own photographs if they exist. Otherwise use a still-life photograph from search_images as a stand-in and say so. Prefer images with a plain background; use `mix-blend-mode: multiply` on light fields so a white studio background disappears into the page colour.

**Watch for.** A small centred product shot with space all round is a catalogue thumbnail, not this direction. If the image has a busy background it cannot sit on a field; crop tighter or change image. Keep text off the object's focal area.

### The specimen catalogue

Suits shops, physical products, restaurants, fashion, culture, education, clinics and wellness, anything else. Needs real product photographs; skip it without them.

**Idea.** Present what is on offer the way a field guide presents birds: each item alone on a flat colour, same scale, same angle, named plainly. A bakery's pastries become specimens and the specimens become the menu. A furniture maker's chairs each get their own colour tile. The format flatters ordinary objects because it treats each as worth looking at, and it replaces both the feature grid and the product-card grid with something that has a point of view.

**Composition.** Hero: a left-aligned statement of what this is (5–7vw, upper-left) beside or above a tight cluster of four to seven specimen tiles of different sizes arranged as a loose mosaic that runs off the right edge. Each tile is a flat colour square or 4:5 rectangle with one photograph centred on it, no border, 8–12px gaps. The main section is the catalogue itself: a grid of tiles in which each item has its name and one fact set beneath the tile in the text face, aligned left to the tile edge. Tile colours rotate through three or four fields from the palette. One tile in every six or seven is double size. Supporting sections (about, how to order) are plain text on the ground colour, kept short.

**Type.** Friendly and plain. Item names at 18–22px in medium weight, facts beneath in the soft ink. One big statement in the hero; no other display type.

**Colour.** The tiles are the colour: three or four flat fields from the palette, repeated in a steady rotation. Ground stays neutral.

**Pictures.** Photographs of single items on plain backgrounds, all cropped to sit at the same apparent size within their tile. On light tiles, `mix-blend-mode: multiply` removes white studio backgrounds. If the subject's own item photographs are missing, use the dealt set and say so.

**Watch for.** It needs at least six items that can be shown as objects; with three it is a feature row. Keep labels outside the tiles. No shadows under the objects, no hover lift.

### Dressed as something else

Suits finance, software, apps, physical products, clinics and wellness, developer tools, AI products, education.

**Idea.** Art-direct the subject as if it belonged to a different, more vivid category. A money app is sold like a streetwear drop. An industrial roaster is presented like a design object. Drilling hardware gets the calm of a watch brand. A parcel-locker service becomes a fairground of stickers. Choose the borrowed category by asking what feeling the audience is missing from this kind of product (swagger, calm, glamour, play) and which category owns that feeling. Then take its manners completely: its type, its pacing, its way of photographing things. The contrast between dull subject and vivid dress is what people remember.

**Composition.** Depends on the borrowed category, so decide it explicitly and write it in your notes. Fashion drop: one shouted condensed headline across the full width, a single cropped image under it, then product facts as a blunt list. Watch or perfume: a centred object on a dark field, a small serif name, very few words, long vertical pauses. Poster or zine: flat colour blocks, heavy type, tilted cut-out images. Museum: one item per screen on a plinth-like band of colour with a short label beside it. Whichever you choose, the page structure stays simple (four to six sections) and every section uses the borrowed manners, including pricing and the footer.

**Type.** The borrowed category's type, fully committed: condensed and loud, or refined and small. No halfway.

**Colour.** The borrowed category's palette, which will be unlike the subject's sector norm. That mismatch is intended.

**Pictures.** Photograph the subject the way the borrowed category would be photographed. With stock photographs, choose images for attitude, not literal relevance, and crop them hard.

**Watch for.** Name the borrowed category in one word before you start, or the result is merely loud. The content must still be clear: what it is, what it costs, how to get it. Avoid borrowing from 'tech startup', which is the default you are escaping.

### The contact sheet

Suits personal portfolios, studios, agencies, fashion, culture, architects, music, shops.

**Idea.** Show everything at once, small, in order. The work is laid out like a photographer's contact sheet or an archive drawer: dozens of small frames in strict rows, with all text set at one small size. Nothing is featured, which is the point: the volume and consistency of the body of work is the statement, and the visitor does the choosing. It suits people and studios whose strength is range and output.

**Composition.** The name, or one sentence about the work, sits at display size (6–9vw) across the top of the first screen, and the sheet begins directly under it, still inside the first screen. The first screen opens with three or four short blocks of small text across the top on a 12-column grid (who, what, where to reach them), all at 14–16px, and immediately below, the sheet begins: rows of thumbnails at a fixed height (90–140px) with their natural widths, 6–10px gaps, each project forming a run of four to eight frames preceded by its title in the same small text. The sheet fills the whole page width edge to edge with 16–20px margins. Hovering a run dims the others and shows that project's one-line description in a fixed position. A single enlarged frame may interrupt the sheet once per screen at four times the size.

**Type.** One face. The name at display size on the first screen; everything else at one text size and one small size; hierarchy below the name comes from position and from a single brighter ink for titles.

**Colour.** Black or white ground, so the thumbnails are the only colour.

**Pictures.** Many images: at least 24 frames to make a sheet. They can be project photographs cropped to mixed ratios, or page captures of the work. Square corners, no captions on the frames.

**Watch for.** With fewer than about 20 images it looks unfinished; choose another direction. Do not add a big headline above the sheet. On a phone the frames become two per row at a fixed height and each run scrolls sideways. Rows that run past the right edge read as clipped in screenshots and to most visitors: wrap the frames onto the next line, or end each row inside the grid.

### The printed annual

Suits culture, non-profits, education, finance, software, AI products, clinics and wellness, agencies.

**Idea.** Lay the page out like a well-designed printed report or magazine feature: a masthead image, a tight oversized title, text held to a strict column line, and colour used in solid blocks the way a two-colour print job would. It gives weight and authority to subjects that are really about content: findings, a manifesto, a programme, a serious product. The reader should feel that someone edited this.

**Composition.** A fixed vertical axis at about 42% of the viewport width organises everything: headings begin on it, body columns hang from it, and the 0–42% zone holds small side notes, figures or stays empty. Masthead: a wide image band (photographic mosaic or a single crop) across the top 45% of the first screen; below it the title at 7–9vw starting on the axis, with a two-sentence standfirst at 20–24px. Sections alternate between text pages (title on the axis, body in one or two columns of 34–40ch to its right) and full-bleed colour pages carrying one large figure, quotation or image mosaic. Mosaics are gutterless: photographs and flat colour tiles butted together in a 4- or 6-cell grid. Page numbers, running heads and other print furniture are left out.

**Type.** A tight heavy grotesk or a sharp serif for titles; an excellent text face for reading at 18–20px with leading near 1.5. Headings in sentence case, tracked tight.

**Colour.** Paper, ink and two or three solid block colours. A colour page is a whole section in one flat colour.

**Pictures.** Photographs used as blocks in mosaics alongside flat colour tiles; mixed subjects are fine if cropped tight and converted to one treatment.

**Watch for.** The axis must be exact and reused everywhere or it reads as random indentation. Keep paragraphs to a real reading measure. On a phone the axis collapses to the left margin and side notes move inline above their paragraph.

### Loud and flat

Suits agencies, apps, music, events, education, non-profits, physical products, software.

**Idea.** A page with the directness of a street poster: flat saturated colour, the heaviest type you can find, short blunt statements, and photographs cut out and stuck on. It is for subjects with a voice. Write the page as things a person would actually say out loud, and let the design say them at full volume. The craft is in the control beneath the noise: a strict grid, two or three colours, and exact alignment keep it from becoming a mess.

**Composition.** Hero: a statement of three to six words in ultra-heavy type at 11–15vw, filling the width, lines stacked tight (leading 0.85), flush left with 20–28px margins, on a flat saturated ground. One cut-out or hard-cropped photograph overlaps the type from the right or bottom, tilted 3–6 degrees. A single chunky button in the contrasting flat colour. Sections are solid panels in alternating palette colours: one is a row of short statements each on its own panel of unequal width; one is a single photograph bleeding off two edges with a caption block set over a solid colour bar; one is a large plain list. Panels meet edge to edge. Corners are square or use one large radius (28–40px) consistently.

**Type.** The heaviest weight available, set tight, mostly lowercase or mostly uppercase (choose one). Body text is a plain grotesk at 18–20px.

**Colour.** Three or four flat colours at full strength including black or white. Each panel is one colour; text on it is one other.

**Pictures.** Photographs with attitude, cropped hard or cut to a simple shape with `clip-path` (circle, arch, blunt polygon), slightly rotated, overlapping the type. Two or three on the page.

**Watch for.** Headlines still obey the two-line rule: at 13vw that means very few words, which is correct for this voice. No outlines, no offset shadows, no sticker confetti. Rotation is for two or three images only, never for text blocks.

### The split stage

Suits restaurants, hotels and stays, personal portfolios, physical products, fashion, property, clinics and wellness, culture.

**Idea.** Half the screen never moves. One side is a fixed photograph (or object, or product view) that stays in place for the whole visit; the other side is a calm scrolling column with everything you need to read. The fixed half keeps the feeling present while the reader gets on with the facts, like sitting in the room while reading the menu. As sections pass, the fixed image may quietly change to the one that matches.

**Composition.** Desktop: a two-column page, 50/50 or 45/55. One column is `position: sticky; top: 0; height: 100svh` and holds a single photograph filling it edge to edge, or the object centred on a flat field. The other column scrolls and holds all content in a single narrow measure (max 46ch) with comfortable padding (48–72px): name and one-line description first, then sections separated by generous space, then contact and footer. Headings in the scrolling column are modest (32–44px). The column grounds differ: photograph on one side, flat paper colour on the other, meeting at a clean vertical edge. On a phone the fixed half becomes a 60svh image at the top that stays sticky behind the first section, then releases.

**Type.** A text-first setting: a readable serif or a calm sans at 17–19px, with one display size for the name. Left-aligned throughout.

**Colour.** The paper colour of the reading column is chosen against the photograph: a tone taken from its shadows or its lightest area. One ink, optionally one accent ink for links and the action.

**Pictures.** One excellent portrait-orientation photograph for the fixed half, plus three or four more that crossfade in as their sections arrive. Small inline photographs in the reading column are optional and should be few.

**Watch for.** The reading column must be genuinely well typeset, since it is half the page. Do not put cards or grids in it. Check that the fixed image crops well at short viewport heights. In blind tests the commonest complaint was monotony: several screens of the same split with only the text changing. Change what the reading half holds from section to section (a list, a large figure, a table, a full-colour panel, a drawing) and let at least one section break the split and run full width.

### The well-kept board

Suits agencies, studios, software, developer tools, AI products, culture, music, anything else.

**Idea.** The whole page is a board of tiles fitted edge to edge with narrow gaps, like a tidy desk seen from above. Each tile is one thing: the name, a statement, a photograph, a number, a link, a short list. There is no hero and no sequence of bands; the page is one continuous composition that the eye roams. It suits subjects with many small true things to show (a studio with work, writing, clients and news; a product with several distinct capabilities) and it replaces the generic bento by having real content in every tile and a strict system for sizes.

**Composition.** A 12-column grid with 8px gaps and 8–12px outer margins, filled completely, no empty cells. Tiles use only four sizes (for example 6×4, 6×2, 3×2, 3×4 in column × row units of about 90px). Every tile is a flat filled rectangle: ground colour one step from the page, or a palette colour, or a photograph covering it. One radius everywhere (0, or 6–10px). The first screen contains: a name tile (the name at display size, the largest type on the page) with the wordmark set large, a statement tile with the description at 28–40px, two or three image tiles and one action tile in the accent colour. Text inside tiles is top-left aligned with 20–24px padding and never centred. Below the first screen the board continues with the same sizes; the last row is the footer made of tiles.

**Type.** One grotesk in two weights. Inside tiles: a large size for single statements, a small size for lists. No uppercase labels in tile corners.

**Colour.** Page ground, tile ground one step lighter or darker, and one or two palette colours on selected tiles. Photographs supply the rest.

**Pictures.** Photographs fill whole tiles with `object-fit: cover`; choose images that crop well to both wide and tall tiles.

**Watch for.** Tiles are filled, never outlined, and never carry shadows. Do not put an icon and a two-line feature blurb in every tile; vary what tiles hold. Decide the phone layout as its own board: two columns, tiles re-ordered so the name and statement lead.

### Photographs at uneven sizes

Suits hotels and stays, property, architects, fashion, restaurants, culture, clinics and wellness, non-profits.

**Idea.** A calm page where the pictures are placed like prints on a gallery wall: each at its own size and position, with text set small and light between them. Nothing lines up in the obvious way, yet everything sits on a grid you can feel. The unevenness is what makes it read as art-directed by a person: a small portrait far left, a wide landscape running off the right edge, a square that overlaps the next section. It lets photographs lead without ever becoming a slideshow.

**Composition.** A 12-column grid with wide margins (5–7vw). The hero is a single line of large light type (6–9vw) across the top third, and below it one photograph placed off-centre (columns 6–12, 16:10), its top edge overlapping the baseline zone of the headline by a few pixels of deliberate tension. Each following section places two or three photographs with different spans and vertical offsets: for example a 3:4 portrait in columns 2–5 starting 120px lower than a 16:10 landscape in columns 7–12; then a single small 1:1 in columns 9–11 beside a paragraph in columns 2–6. Paragraphs are short (max 40ch) and sit in the gaps. No two consecutive sections use the same arrangement. Vertical spacing is large and irregular on purpose (120–260px).

**Type.** A light or regular weight at large size for the few headings; small, quiet text. Serif or a slender sans. Everything left-aligned to grid lines.

**Colour.** A pale neutral ground with one deep ink taken from the photographs. No accent beyond a quiet link colour.

**Pictures.** Six to nine photographs from one set, in a deliberate mix of ratios (3:4, 4:5, 1:1, 16:10, 21:9). Square corners. Captions, if any, are one short line under an image in the soft ink.

**Watch for.** Uneven is not random: every image edge lands on a column line, and offsets come from a small set of values. On a phone, keep the unevenness with alternating widths (100%, 72% left, 60% right) rather than stacking everything full width.

### The dark room

Suits hotels and stays, restaurants, music, fashion, physical products, finance, architects, studios.

**Idea.** One dark field from top to bottom, and in it, lit things. Photographs and objects appear like exhibits in a dim gallery: each with space around it, each the brightest thing on its screen. Type is light, small and sparse. The darkness is not a theme switch; it is a room, and the page is a slow walk through it. It suits subjects sold on atmosphere and material: an evening restaurant, a metal card, a record, a house at dusk.

**Composition.** A single near-black or deep-toned ground runs the full page with no section bands. First screen: either the name at full width in a light weight along the bottom edge with one dim photograph above it, or one object or photograph centred at 40–50% of the viewport with a line of text beneath at 16–18px. Each later screen holds one or two lit items at a generous size (the main one 40–60% of the screen width) with its text set beside it at full reading size; the darkness frames the items, it does not replace content. Images vary in size but all share the same darkness at their edges so they sit in the ground without frames. Practical details come last in a simple two-column text block. The only solid light element on the page is the single primary action.

**Type.** Light or regular weights; they glow on dark. Avoid heavy bold, which looks cheap on black. Headings 4–7vw at most; text 16–18px with leading 1.6 and a slightly lifted ink (not pure white).

**Colour.** A dark ground with a tint (blue-black, green-black, brown-black), a soft light ink, a dimmer ink for secondary text, and one warm or bright accent used once per screen at most.

**Pictures.** Low-key photographs: dark backgrounds, one light source, subjects emerging from shadow. Their dark edges should blend into the page ground.

**Watch for.** Grey text on black fails contrast quickly: check it. No glow effects, no neon accent, no coloured light blobs. A dark page with a bright busy photograph is not this direction; choose low-key images. Dark does not mean empty: every screen still carries its content at a readable size, and running text is a light ink at 7:1 or more, not a dim grey.

### Type and nothing else

Suits software, developer tools, AI products, finance, agencies, non-profits, education, personal portfolios.

**Idea.** The first screen is made only of words, colour and space, good enough that nobody misses a picture there. Pictures arrive later, large and few, as relief from the type. This is the honest answer when a subject has nothing worth photographing: instead of inventing illustrations, set what you have to say as well as it can be set. The typography carries a point of view through scale (one enormous statement, everything else small), through measure (a narrow, bookish column or a full-width line), and through one committed colour.

**Composition.** First screen: the statement, two lines at most, set at 9–14vw and occupying the full width with tight leading, positioned in the upper two-thirds. One supporting sentence at 20–24px sits bottom-left on the same margin and the single action sits bottom-right on the same baseline. No navigation bar; two or three links in a top corner. Sections that follow are typographic set pieces, each different: a list of five to eight capabilities set at 4–6vw one per line; a paragraph at 28–36px in a 28ch column pushed to the right half; a pair of large numerals with a sentence each; a single quotation filling a colour field. Each section uses a different horizontal position (left, right, full) so the page has movement without imagery.

**Type.** This direction lives or dies on the face and its settings. Display at tight tracking and leading; text sizes few and far apart (for example 15, 22, 34 and the display size). Use real typographic detail: proper quotes, balanced line breaks, hung punctuation where it helps.

**Colour.** Either one saturated ground for the whole page with a single ink, or paper and ink with one section inverted and one in the accent as a full field. Colour does the job images would have done.

**Pictures.** The first screen has no picture. Further down, real pictures of the subject's world (found with scripts/assets.mjs) arrive large and few: a full-bleed photograph between two type sections, a looping clip in one band, an archival image beside a list. Do not add icons, shapes, patterns or abstract graphics to compensate for anything.

**Watch for.** Without pictures, weak copy has nowhere to hide: write real sentences. Vary the set pieces; four sections of big-heading-plus-paragraph is a text document, not a design. Keep all headings within two lines.


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
