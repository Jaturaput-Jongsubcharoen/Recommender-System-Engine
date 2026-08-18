---
name: Recommender System Engine
description: A playful retro-editorial recommendation platform combining scrapbook collage graphics with a clean, usable machine-learning interface.
version: 2.0.0
tags: [recommendation-system, machine-learning, retro, editorial, collage, playful]
---

# Recommender System Engine — Design System

## Design Philosophy

The interface should feel creative, memorable, warm, and handcrafted.

The primary visual inspiration is a retro editorial / scrapbook collage:
cut-paper typography, printed labels, vintage colors, simple borders, and
small playful imperfections.

The application must still feel professional enough for a software and
machine-learning portfolio.

The design should NOT look like a stereotypical AI website.

Avoid:
- neon purple/cyan AI gradients
- glowing neural-network backgrounds
- cyberpunk aesthetics
- glassmorphism everywhere
- futuristic AI imagery
- generic SaaS dashboard styling
- excessive drop shadows
- excessive animation
- huge corporate gradient headlines

The personality should come from typography, paper-like labels, borders,
small decorative details, and layout rather than visual effects.

---

## Colors

Use a restrained vintage palette inspired by the reference image.

### Core Palette

- `--color-bg`: `#F3F5DF` — warm pale cream page background
- `--color-surface`: `#FAF8E9` — cards and content surfaces
- `--color-text`: `#171812` — primary text
- `--color-text-muted`: `#64624F` — descriptions and helper text
- `--color-border`: `#654123` — strong retro brown framing
- `--color-green`: `#688B45` — primary natural accent
- `--color-green-dark`: `#49662F` — hover/active green
- `--color-cyan`: `#61C8C8` — playful secondary accent
- `--color-red`: `#E94D45` — collage highlight
- `--color-pink`: `#D56B91` — small decorative accent
- `--color-yellow`: `#E5C62F` — tags and small highlights

### Semantic Colors

- `--color-success`: `#688B45`
- `--color-warning`: `#C68B2D`
- `--color-error`: `#B9473F`

Do not introduce purple/cyan neon gradients.

Accent colors should be used selectively.

---

## Typography

The interface should combine readable modern typography with decorative
retro typography.

### Functional UI

Body text, navigation, buttons, forms, metrics, and explanations:

`Arial, Helvetica, system-ui, sans-serif`

or another clean sans-serif already available to the project.

### Display Typography

Major hero words may use a bold retro/display style.

Use mixed collage typography only for selected words.

For example:

`RECOMMEND`
`DISCOVER`
`FLAVOR`
`MUSIC`

These may appear as individual paper-cut labels with slightly different:
- font weights
- background colors
- rotations
- sizes

Do NOT use ransom-note styling for paragraphs, form labels, buttons, or
important technical information.

### Technical Labels

Small labels such as:

`APRIORI`
`TF-IDF`
`COSINE SIMILARITY`
`SUPPORT`
`CONFIDENCE`
`LIFT`

may use a pixel/monospace-inspired treatment.

---

## Spacing

Base unit: `4px`

| Token | Value |
|---|---:|
| `xs` | `4px` |
| `sm` | `8px` |
| `md` | `16px` |
| `lg` | `24px` |
| `xl` | `32px` |
| `2xl` | `48px` |
| `3xl` | `64px` |

Layouts should feel spacious but intentionally composed rather than
perfectly corporate.

---

## Borders and Radius

The reference uses visible framing.

Use:
- strong brown outer framing where appropriate
- thin dark/brown card borders
- occasional green accent lines
- small decorative corner blocks inspired by printed registration marks

Card radius:
`8px`

Button radius:
`6px`

Input radius:
`6px`

Avoid oversized 20–30px SaaS-style rounded cards.

---

## Page Background

Use the warm cream background as the primary canvas.

Do NOT use:
- dark navy background
- glowing radial gradients
- animated gradient blobs
- neon light effects

Optional extremely subtle paper texture is acceptable if implemented
without hurting performance or readability.

---

## Header

Create a compact retro-modern header.

Left:
`RECOMMENDER SYSTEM ENGINE`

The logo may use a small pixel-inspired mark.

Right:
- Overview
- Cuisine
- Music
- How It Works
- API status

Use dark text with restrained borders.

API status should appear as a small printed label rather than a glowing
status pill.

Mobile navigation must collapse cleanly.

---

## Hero

The hero should immediately establish the project's personality.

Use a headline concept such as:

`Find Your Next Flavor or Sound`

Create selected words using cut-paper/collage typography inspired by the
reference image.

Possible treatment:

`FIND YOUR`
normal bold typography

`FLAVOR`
collage letters

`OR`

`SOUND`
collage letters

Keep the supporting text clean and readable:

"Explore two recommendation approaches powered by association-rule
mining and content-based similarity."

Technology labels:

`PYTHON`
`FASTAPI`
`REACT`
`APRIORI`
`TF-IDF`
`COSINE SIMILARITY`

Present them like small printed/stamped labels.

Do NOT use the glowing neural-network illustration from the previous
design.

Instead, use small editorial illustrations, arrows, paper labels, simple
diagram lines, or recommendation cards.

---

## Cuisine Recommendation Section

Give this section a subtle food/editorial personality.

Title:

`Cuisine Patterns`

Subtitle:

`Discover ingredients that frequently belong together using Apriori
association rules.`

Include:
- cuisine selector
- Analyze Cuisine button
- ingredient recommendations
- association rules
- Support
- Confidence
- Lift

### Ingredient Chips

Ingredient chips may look like small paper labels.

Use slight visual variation without sacrificing readability.

### Association Rule

Present rules visually:

`GARLIC + CHILI  →  FISH SAUCE`

The arrow can have a hand-drawn/editorial character.

Metrics should remain structured and easy to scan.

---

## Music Recommendation Section

Give this section a retro record/music editorial character without
imitating a specific brand.

Title:

`Similar Sounds`

Subtitle:

`Discover related music using TF-IDF and cosine similarity.`

Include:
- title search
- autocomplete
- Find Similar Music button
- ranked top-10 recommendations

Results may resemble:
- record catalog entries
- printed track labels
- numbered editorial cards

Example:

`01  Song Title`
`02  Song Title`
`03  Song Title`

Use clean typography for titles.

---

## Algorithm Education

Create an editorial "How It Works" section.

### Cuisine

`RECIPES`
↓
`INGREDIENT TRANSACTIONS`
↓
`APRIORI`
↓
`ASSOCIATION RULES`
↓
`RECOMMENDATIONS`

### Music

`MUSIC METADATA`
↓
`TEXT FEATURES`
↓
`TF-IDF`
↓
`COSINE SIMILARITY`
↓
`TOP MATCHES`

Use simple lines, arrows, paper labels, and boxes.

Do not use glowing neural-network nodes.

---

## Buttons

### Primary

- dark green or brown background
- cream text
- thin dark border
- medium weight
- subtle movement on hover

Hover may move approximately `-2px` vertically.

### Secondary

- transparent/cream background
- brown border
- dark text

Avoid glowing buttons and gradient fills.

---

## Cards

Cards should resemble clean printed panels.

Use:
- cream/light surface
- thin brown border
- restrained shadow
- 8px radius
- generous padding

Optional:
small colored corner details or label tabs.

Do not use translucent glass cards.

---

## Interaction

Animations should feel tactile rather than futuristic.

Allowed:
- slight card lift
- small label rotation correction on hover
- button press movement
- results fade/slide in
- subtle arrow movement
- loading indicators

Avoid:
- glowing pulses
- continuously animated nodes
- moving gradient backgrounds
- excessive parallax

---

## Error States

Never expose raw API errors.

Use friendly language:

`We couldn't reach the recommendation engine. Please try again.`

Style the error like a small printed warning label.

---

## API Status

Use:

`● API ONLINE`

or

`● API OFFLINE`

Keep it small and readable.

Do not use neon glow.

---

## Responsive Design

Must support:
- desktop
- laptop
- tablet
- iPad
- mobile

Desktop may use asymmetrical editorial compositions.

On tablet and mobile:
- collapse to one column
- preserve collage typography without overlapping
- reduce decorative elements
- keep forms full-width where appropriate
- maintain comfortable touch targets
- prevent horizontal scrolling

Decorative elements must never interfere with functionality.

---

## Accessibility

Maintain:
- strong text/background contrast
- visible keyboard focus
- semantic labels
- keyboard-accessible controls
- readable font sizes
- reduced-motion support
- meaningful error states

The scrapbook aesthetic must never reduce usability.

---

## Final Visual Rule

The interface should feel like:

"Retro editorial scrapbook meets a modern recommendation engine."

It should be distinctive enough to remember in a portfolio while still
making the underlying Python, machine-learning, API, and React engineering
easy for a recruiter to understand.

When visual personality conflicts with usability, usability wins.