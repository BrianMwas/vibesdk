---
name: design-archetypes
description: Starting directions for a customer's website by kind of site (editorial, ecommerce showcase, local business, professional services, portfolio, technology). Each gives a font pairing and a contrast-checked palette, and the rules for varying them so no two businesses get the same site. Load before choosing fonts or colours for a business's website.
metadata:
  source: Font pairings are from the ui-ux-pro-max typography dataset. Palettes are written for this skill and checked for WCAG contrast.
---

# Design archetypes

A business's website should look like that business, and not like the last one you built. These are starting directions, not templates. Choose one, then make it specific to the business.

## How to choose

1. Use the archetype the platform named. If it named none, pick the closest from the list below.
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
| Product | Space Grotesk / DM Sans | `#F8FAFC` `#0F172A` `#4338CA` `#0F766E` | Software, startups |
| Technical, dark | Exo / Roboto Mono | `#0B1220` `#E5E7EB` `#22D3EE` `#A78BFA` | Research, data, hardware, developer tools |

Fonts: `https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap` and `https://fonts.googleapis.com/css2?family=Exo:wght@400;500;600;700&family=Roboto+Mono:wght@400;500;700&display=swap`.

## What makes it distinct

The table gets you a sound base. The difference between this business and another in the same archetype comes from what you build on it: a hero that shows the thing the business actually makes or sells, a layout shaped by that content, one memorable element, and copy in the business's own words. If the page could belong to any business in the category, it is not finished.
