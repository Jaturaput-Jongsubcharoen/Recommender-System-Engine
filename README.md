---

name: Recommender System Engine
description: Experimental editorial recommendation platform combining monochrome imagery, oversized typography, technical grid layouts, and bold red graphic accents.
version: 3.0.0
tags: [recommendation-system, machine-learning, editorial, swiss, experimental, monochrome]
-------------------------------------------------------------------------------------------

# Recommender System Engine — Design System

## 1. Design Philosophy

The visual direction is based on the attached reference MP4.

The goal is NOT to create a conventional SaaS dashboard or a stereotypical AI website.

The application should feel like:

**an experimental editorial website + a machine-learning recommendation product**

The visual system should combine:

* oversized black typography
* warm off-white backgrounds
* monochrome photography
* strong red graphic accents
* small green secondary accents
* grid-based editorial layouts
* tiny technical labels
* asymmetrical positioning
* line art
* handwritten/script accents
* controlled visual movement
* generous negative space

The interface should feel curated and art-directed rather than generated from standard UI components.

Functionality and readability remain mandatory.

---

# 2. Core Visual Language

## Primary Characteristics

Use:

* warm ivory/off-white background
* black typography
* red as the dominant visual accent
* green only as a small supporting accent
* monochrome imagery
* large editorial typography
* compressed/condensed headings
* visible layout grid
* technical micro-labels
* geometric forms
* hand-drawn red marks or strokes
* intentional cropping
* asymmetrical visual composition

Avoid:

* purple
* cyan AI gradients
* dark futuristic backgrounds
* glassmorphism
* glowing neural networks
* generic rounded SaaS cards
* excessive shadows
* neon
* cyberpunk aesthetics
* conventional dashboard layouts

---

# 3. Color System

## Core Palette

* `--color-bg`: `#F4F1E8` — warm editorial ivory
* `--color-surface`: `#F8F5EC` — slightly lighter content surface
* `--color-black`: `#111111` — primary typography
* `--color-text`: `#161616`
* `--color-muted`: `#69665F`
* `--color-grid`: `#D8D2C5`

## Main Accent

* `--color-red`: `#C91520`
* `--color-red-dark`: `#991018`
* `--color-red-soft`: `#E8B9B9`

Red is the dominant expressive color.

Use red for:

* graphic arrows
* underline strokes
* active controls
* large geometric shapes
* section markers
* visual transitions
* important buttons
* small annotation marks

Do NOT fill every component with red.

## Secondary Accent

* `--color-green`: `#3A8A16`

Green is used very sparingly.

Use it for:

* one or two secondary visual markers
* success/API-online state
* occasional geometric accent

Never let green compete visually with red.

---

# 4. Typography

Typography is one of the most important parts of this design.

## Display Typography

Large headings should feel editorial, bold, and compressed.

Preferred appearance:

* heavy condensed sans-serif
* uppercase where appropriate
* extremely large display size
* tight line-height
* tight letter spacing
* deliberate cropping on desktop where safe

Example:

`APRIORI`

may appear extremely large behind or above a cuisine composition.

`CONTENT-BASED`

may become a large typographic section anchor.

Do not use a soft rounded SaaS font for major display headings.

## Functional Typography

Forms, labels, descriptions, results, and metrics must use a clean readable sans-serif.

Use:

`Arial, Helvetica, system-ui, sans-serif`

or another neutral sans-serif available locally.

## Script Accent

A handwritten/script visual may be used selectively for short decorative words such as:

* `Explore`
* `Discover`
* `Listen`
* `Taste`

Do not use script fonts for functional text.

## Micro Typography

Small labels should resemble technical editorial annotations.

Examples:

`01 · APRIORI RECOMMENDATION ENGINE`

`MODEL INPUT`

`ASSOCIATION RULE`

`TF-IDF VECTOR`

`RANK 01`

Use:

* uppercase
* small size
* increased letter spacing
* monospace or compact sans-serif

---

# 5. Grid System

The site should visibly reference an editorial grid.

Use subtle horizontal and vertical grid lines where appropriate.

The grid should support the composition without making the page look like a spreadsheet.

Suggested desktop grid:

* 12 columns
* maximum content width around `1440px`
* visible or semi-visible divider lines in feature sections

Use thin:

`1px solid var(--color-grid)`

for selected structural lines.

---

# 6. Header

Create a minimal editorial header.

Left:

`RECOMMENDER SYSTEM ENGINE`

with a small abstract black geometric logo.

Right:

* Overview
* Cuisine
* Music
* How It Works
* API Status

Header appearance:

* off-white background
* thin bottom rule
* very little vertical height
* compact uppercase navigation
* black text
* active item may use red underline or red dot

API status:

`● API ONLINE`

Use green only for the status indicator.

On mobile, collapse into a simple menu.

---

# 7. Hero

The hero should feel like an editorial cover or magazine spread.

Do not use centered SaaS hero composition.

Use an asymmetrical layout.

Suggested structure:

### Large display headline

`RECOMMEND`
or

`FIND WHAT`
`BELONGS NEXT`

Large black compressed typography may extend close to the viewport edges.

### Supporting line

`Two recommendation engines. Two different ways of finding similarity.`

### Visual composition

Use a monochrome visual combining:

* food/ingredient imagery
* sound/music imagery
* red lines/arrows
* small technical labels
* simple geometric shapes

Do not use generic AI brain/network graphics.

The hero should visually preview both models.

---

# 8. Cuisine Section

Use the user's content:

`01 · APRIORI RECOMMENDATION ENGINE`

## Explore the Cuisine Model

`Start with cuisine patterns and uncover ingredients that frequently belong together.`

Display:

`APRIORI · ASSOCIATION RULES`

## Cuisine Patterns

`Discover ingredients that frequently belong together using Apriori association rules.`

### Search supported cuisines

Cuisine selector

### Analyze Cuisine

Button

`20 cuisines available`

---

## Cuisine Art Direction

This section should use MONOCHROME FOOD IMAGERY.

Possible imagery:

* vegetables
* herbs
* ingredients
* plates
* cutlery
* food textures
* ingredient clusters

Images should be:

* grayscale or near-monochrome
* high contrast
* editorially cropped
* isolated where possible

Overlay or combine with:

* bold red arrows
* red circles
* red hand-drawn ingredient connections
* small black labels
* technical annotations

Example visual composition:

large monochrome ingredient image centered or offset

with red connection lines linking:

`GARLIC`
`CHILI`
`FISH SAUCE`

Small labels can describe:

`SUPPORT`
`CONFIDENCE`
`LIFT`

---

# 9. Cuisine Results

Do NOT show results as generic floating cards.

Use an editorial data layout.

### Top Ingredient Group

Display recommended ingredients as:

* printed labels
* black text blocks
* red underlines
* compact bordered strips

### Association Rule Example

`GARLIC + CHILI`

large black type

red directional arrow

`FISH SAUCE`

Metrics underneath:

`SUPPORT 0.0813`
`CONFIDENCE 0.5181`
`LIFT 2.3117`

Metrics can be aligned like technical specifications.

Use grid lines instead of heavy cards.

---

# 10. Music Section

Use the user's content:

`02 · CONTENT-BASED RECOMMENDATION ENGINE`

## Explore the Music Model

`Search the music catalog and discover titles with similar content features.`

Display:

`TF-IDF · COSINE SIMILARITY`

## Similar Sounds

`Discover related music using TF-IDF vectors and cosine similarity.`

### Search song or album title

Search field

### Find Similar Music

Button

`Autocomplete searches the recommendation index`

---

# 11. Music Art Direction

Use MONOCHROME MUSIC / SOUND IMAGERY.

Possible imagery:

* headphones
* vinyl record
* speaker
* waveform
* microphone
* turntable
* abstract sound equipment
* audio cable
* compact cassette-inspired shapes

Use grayscale imagery with:

* red circles
* red signal/waveform lines
* large red geometric shapes
* red editorial arrows
* black technical labels

Avoid album artwork or recognizable commercial branding.

The visual should represent sound/similarity abstractly rather than copying a music service.

---

# 12. Music Results

Present ranked results as an editorial list.

Example:

`01`
`SONG TITLE`

thin divider

`02`
`SONG TITLE`

thin divider

...

`10`
`SONG TITLE`

Use:

* large rank numbers
* clean black song titles
* subtle grid lines
* red active marker
* optional small metadata label

Do not use Spotify-style rows or rounded music cards.

---

# 13. TF-IDF / Cosine Similarity Explanation

Display:

## TF-IDF

`Transforms descriptive text into weighted numerical features.`

## Cosine Similarity

`Measures how similar two content vectors are.`

Treat these as editorial technical modules.

For example:

Large:

`TF`
`IDF`

with smaller explanatory text beside it.

A red line or diagram can connect:

`TEXT`
→
`VECTOR`
→
`SIMILARITY`

---

# 14. Large Editorial Section Numbers

Use large visual identifiers:

`01`

for Apriori

and

`02`

for Content-Based recommendation.

Numbers may be oversized, partly cropped, or aligned to grid edges.

Use black or red depending on the composition.

These numbers should create visual rhythm between sections.

---

# 15. Graphic Motifs

The reference video frequently combines imagery with expressive graphic overlays.

Use similar techniques:

### Red strokes

Hand-drawn-like red lines can:

* circle important content
* connect ingredients
* underline a word
* indicate direction
* connect algorithm stages

### Red geometric shapes

Use:

* arrows
* triangles
* ribbons
* rectangles
* circles

sparingly as editorial devices.

### Technical markers

Small labels around imagery:

`INPUT`
`MODEL`
`RESULT`
`SIMILARITY`
`RULE`
`INDEX`

Do not clutter every area with annotations.

---

# 16. Image Treatment

Food and music visuals should be monochrome.

Preferred:

```css
filter: grayscale(1) contrast(1.1);
```

or use purpose-prepared monochrome illustrations.

Red should remain the only highly saturated dominant color.

Green remains a rare supporting accent.

Images may overlap typography or geometric forms when readability remains safe.

---

# 17. Motion System

Animation should mimic editorial recomposition rather than generic UI movement.

The reference video changes:

* objects
* graphic shapes
* large words
* visual focus
* annotation lines

while the overall grid remains stable.

Use:

* masked image reveals
* clipped image slides
* red shape transitions
* text wipe/reveal
* line drawing
* object replacement
* subtle composition shifts

Avoid:

* bouncing
* glowing
* particle effects
* floating gradient blobs
* spinning
* excessive parallax

---

# 18. Hero / Section Transition Animation

On section entrance:

1. Large black heading reveals through a vertical or horizontal mask.
2. Monochrome image enters independently.
3. Red graphic line or shape draws or slides into position.
4. Technical labels fade in last.
5. Interactive controls remain stable and immediately usable.

Suggested durations:

* title reveal: `500–800ms`
* image reveal: `500–900ms`
* red graphic motion: `350–700ms`
* labels: `200–400ms`

Use staggered timing.

---

# 19. Image State Changes

For editorial visual sections, imagery may change between several predefined compositions.

Example Cuisine:

State A:
monochrome garlic/herbs

State B:
monochrome plated ingredients

State C:
monochrome ingredient cluster

Each state may change together with a different red graphic overlay.

Example Music:

State A:
headphones

State B:
speaker

State C:
vinyl / waveform composition

Do not randomly change every frame.

Use deterministic transitions with enough time for the viewer to perceive each composition.

---

# 20. Buttons

Primary button:

* red background
* off-white text
* black/red border
* squared or lightly rounded
* compact uppercase label

Example:

`ANALYZE CUISINE →`

`FIND SIMILAR MUSIC →`

Hover:

* red darkens slightly
* arrow shifts right a few pixels
* button may translate `-1px`

Secondary button:

* transparent
* black border
* black text

Do not use pill-shaped SaaS buttons.

---

# 21. Inputs

Inputs should look editorial but remain familiar.

Use:

* off-white background
* black bottom or full border
* minimal radius
* strong focus state
* red focus line

Avoid large glowing focus rings.

Autocomplete dropdown:

* off-white surface
* black dividers
* red hover indicator
* no heavy shadows

---

# 22. Cards and Panels

Avoid conventional floating cards.

Prefer:

* grid sections
* bordered regions
* editorial content blocks
* full-width modules
* thin dividers

If a card is required:

* minimal radius
* no heavy shadow
* black border
* off-white background

---

# 23. How It Works

Build a technical editorial diagram.

Cuisine:

`RECIPES`
→
`INGREDIENT TRANSACTIONS`
→
`APRIORI`
→
`ASSOCIATION RULES`
→
`RECOMMENDATIONS`

Music:

`MUSIC METADATA`
→
`TEXT FEATURES`
→
`TF-IDF`
→
`COSINE SIMILARITY`
→
`TOP MATCHES`

Use:

* thin black lines
* red active path
* large stage numbers
* small technical labels
* editorial icons/monochrome visuals

Do not use glowing neural-network nodes.

---

# 24. Responsive Design

Responsive design is a HARD requirement.

Test:

* 1920px large desktop
* 1440px desktop
* 1366px laptop
* 1024px iPad landscape
* 768px iPad portrait
* 430px phone
* 390px phone
* 360px phone

No horizontal scrolling.

---

## Desktop

Use the most expressive art direction here.

Allow:

* oversized typography
* asymmetrical imagery
* overlapping red graphics
* multi-column editorial grid
* cropped display words

Maximum useful content width:

`1440px`

---

## Laptop

Preserve editorial character while reducing:

* giant typography
* image size
* decorative labels
* extreme cropping

Ensure interactive controls remain clearly visible.

---

## iPad / Tablet

Do not shrink desktop blindly.

Adapt to:

* fewer columns
* stacked recommendation controls
* simplified image compositions
* reduced overlap
* smaller oversized typography
* fewer technical labels

Keep food/music imagery visible.

Touch targets should be at least approximately `44px`.

---

## Mobile

Mobile should look intentionally art-directed.

Use:

* one-column structure
* smaller editorial typography
* carefully cropped monochrome images
* red graphics adapted to available width
* compact technical labels
* full-width controls where practical

Do not allow decorative imagery to overlap form fields.

Large display text should use `clamp()`.

Example:

```css
font-size: clamp(3.5rem, 18vw, 7rem);
```

Disable or simplify extreme cropping on small screens.

---

# 25. Reduced Motion

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

When enabled:

* disable masked travel animations
* disable automated image changes
* show static final compositions
* keep all recommendation functionality

---

# 26. Performance

Prefer:

* optimized WebP/AVIF imagery
* CSS graphics
* lightweight SVG
* transform/opacity animation

Avoid:

* background videos
* very large unoptimized photographs
* animation loops that run continuously
* unnecessary libraries

---

# 27. Functional Priority

Never sacrifice these functions for visual styling:

Cuisine:

* search/select cuisine
* analyze
* top ingredients
* rules
* support
* confidence
* lift

Music:

* search
* autocomplete
* recommendation action
* top ten results
* TF-IDF explanation
* cosine similarity explanation

System:

* API health
* errors
* loading
* keyboard navigation
* responsive layout

---

# 28. Final Visual Goal

The website should feel like:

**experimental editorial art direction applied to a real ML recommendation engine.**

The cuisine section should immediately communicate:

**FOOD + PATTERNS + APRIORI**

through monochrome food imagery and expressive red analytical graphics.

The music section should immediately communicate:

**SOUND + SIMILARITY + CONTENT-BASED RECOMMENDATION**

through monochrome audio imagery and expressive red signal graphics.

The final interface must NOT resemble:

* a generic AI website
* a standard SaaS dashboard
* a Bootstrap template
* a neon ML demo
* a Spotify clone

The overall visual identity should be memorable, graphic, sophisticated,
and portfolio-ready while keeping the recommendation system easy to use.
