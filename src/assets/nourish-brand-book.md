# Nourish Brand Book

**Better choices. Brighter days.**
Version 1.0 · For design and development implementation

---

## 1. Brand Foundation

### Mission
Nourish is a low-friction, budget-friendly, AI-powered health and nutrition tracker that turns daily meal logging into an encouraging, natural conversation.

### Brand Vibe
Organic · Warm · Modern · Calm · Judgment-free

### Personality
Nourish is a supportive companion, not a tool that grades you. Every screen, message, and empty state should feel like a friend saying "you've got this."

### Tagline
`BETTER CHOICES. BRIGHTER DAYS.`
Always uppercase, letter-spacing `0.12em`, sans-serif, Fern green or Espresso.

---

## 2. Voice & Tone

| Do | Don't |
|---|---|
| Supportive, empathetic, clear | Clinical, shame-inducing, restrictive |
| "You're making great progress!" | "You failed your goal." |
| "Here's your daily breakdown." | "You went over your limit." |
| "Want to log a snack?" | "Guilty pleasure" / "Cheat day" |
| "Tomorrow's a fresh start." | "You blew it today." |

### Writing rules
1. **Describe, don't judge.** Say what happened ("1,420 of 1,950 calories so far"), never whether it was good or bad.
2. **Celebrate effort, not perfection.** Progress copy rewards logging and consistency.
3. **Never use food moralizing:** no "clean," "bad," "junk," "sinful," "earned," "burn off."
4. **Over-goal states are gentle.** Use a neutral note ("A little over today. Totally normal.") with the warm terracotta accent. Never red or warning icons.
5. **Keep it short.** One idea per message; plain words; no jargon.

---

## 3. Color System

### 3.1 Brand palette

| Token | Hex | Role |
|---|---|---|
| `--nourish-espresso` | `#3E2A1F` | Primary text, headers, dark button backgrounds |
| `--nourish-fern` | `#556B3F` | Primary accents, leaf details, active buttons, success states |
| `--nourish-sage` | `#A7B89A` | Progress tracks, secondary borders, soft badges |
| `--nourish-terracotta` | `#B76A45` | Sun elements, highlights, calorie ring indicator |
| `--nourish-cream` | `#F7F3E9` | Main page canvas, card surfaces |
| `--nourish-surface-light` | `#FFFFFF` | Form cards for contrast over the cream canvas |

### 3.2 CSS tokens

```css
:root {
  /* Brand */
  --nourish-espresso: #3E2A1F;
  --nourish-fern: #556B3F;
  --nourish-sage: #A7B89A;
  --nourish-terracotta: #B76A45;
  --nourish-cream: #F7F3E9;
  --nourish-surface-light: #FFFFFF;

  /* Semantic roles */
  --color-bg: var(--nourish-cream);
  --color-surface: var(--nourish-surface-light);
  --color-text: var(--nourish-espresso);
  --color-text-muted: #7A6657;
  --color-primary: var(--nourish-fern);
  --color-primary-hover: #465A33;
  --color-on-primary: var(--nourish-cream);
  --color-accent: var(--nourish-terracotta);
  --color-border: var(--nourish-sage);
  --color-track: var(--nourish-sage);
  --color-success: var(--nourish-fern);

  /* Macros */
  --macro-calories: var(--nourish-terracotta);
  --macro-protein: var(--nourish-fern);
  --macro-carbs: var(--nourish-terracotta);
  --macro-fiber: var(--nourish-fern);

  /* Shape & elevation */
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-pill: 9999px;
  --shadow-card: 0 4px 20px rgba(62, 42, 31, 0.06);

  /* Type */
  --font-sans: "Nunito", "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
  --tracking-caps: 0.12em;
}
```

### 3.3 Accessibility notes (WCAG contrast, approximate)

| Pairing | Ratio | Use |
|---|---|---|
| Espresso on Cream | ~12:1 | All text. Passes AAA. |
| Fern on Cream | ~5.3:1 | Text and buttons. Passes AA. |
| Cream text on Fern button | ~5.3:1 | Primary buttons. Passes AA. |
| Terracotta on Cream | ~3.7:1 | **Large text (18px+ bold) and graphics only.** Fails AA for body text. |
| White text on Terracotta | ~4.1:1 | **Large/bold button labels only.** For small text, use Espresso text or darken to `#A25A38`. |
| Sage on Cream | ~2:1 | **Decorative only** (tracks, borders). Never for text. |

Rule of thumb: terracotta and sage carry color, not information. Always pair them with a number or label.

---

## 4. Typography

| Use | Font | Weight | Notes |
|---|---|---|---|
| Wordmark, H1, H2 | Nunito | 700 / 800 | Rounded terminals |
| UI body, forms | Nunito (fallback Inter, system-ui) | 400 | |
| Labels, buttons | Nunito | 600 | |
| Tagline, subheaders | Sans-serif, all caps | 600 | `letter-spacing: 0.12em` |

### Type scale (mobile-first)

| Style | Size / Line height | Weight |
|---|---|---|
| H1 | 32 / 40 | 800 |
| H2 | 24 / 32 | 700 |
| H3 | 20 / 28 | 700 |
| Body | 16 / 24 | 400 |
| Label / Button | 16 / 20 | 600 |
| Small / Caption | 14 / 20 | 400–600 |
| Tagline / Subheader | 12–14 / 16 | 600, caps |

Load via Google Fonts: Nunito 400, 600, 700, 800. Use `font-display: swap`.

---

## 5. Logo & Asset Usage

### 5.1 Logo family
- **Primary horizontal logo:** app icon badge (left) + "Nourish" wordmark + tagline beneath, on Soft Cream `#F7F3E9`.
- **App icon / favicon:** rounded-rectangle container in Soft Cream featuring the terracotta sun disk and a crisp fern leaf branch.
- **Wordmark only:** for tight spaces such as the navbar on mobile.
- **Stacked lockup:** icon above wordmark, for splash screens and social avatars.

### 5.2 Rules
- **Clear space:** keep at least **16px** of padding on all sides of any logo asset.
- **Minimum sizes:** horizontal logo with tagline, 160px wide. Without tagline, 100px wide. Icon alone, 24px.
- **Drop the tagline** below 160px wide.
- **Small-size icon variant:** below 48px, use the simplified icon (sun disk plus 3 to 5 bold leaves on a thick stem). The detailed branch becomes a blur at small sizes.
- **Backgrounds:** Cream or white by default. On Fern or Espresso, use the reversed (cream) version.
- **Do not** recolor outside the palette, stretch, rotate, add shadows or outlines, or place on busy imagery.

---

## 6. Components

### 6.1 Cards & containers
- Background `#FFFFFF` or `#F7F3E9`
- Radius `16px` (standard) or `24px` (hero / feature cards)
- Shadow `0 4px 20px rgba(62, 42, 31, 0.06)`
- Padding `16px` mobile, `24px` desktop

### 6.2 Buttons

| Type | Background | Text | Border | Radius |
|---|---|---|---|---|
| Primary | Fern `#556B3F` | Cream | none | 12px or pill |
| Secondary (outline) | transparent | Espresso | 1.5px Espresso | 12px or pill |
| Accent (soft) | Terracotta `#B76A45` | Espresso or white, **large/bold labels only** | none | 12px or pill |
| Ghost | transparent | Fern | none | 12px |

- Label: Nunito 600, 16px. Minimum touch target **44 × 44px**.
- Hover: darken fill ~8% (Fern `#465A33`). Focus: 2px Fern ring with 2px offset.
- Disabled: 40% opacity, no shadow.

### 6.3 Nutrient progress

| Element | Fill | Track |
|---|---|---|
| Calorie ring | Terracotta `#B76A45` | Sage `#A7B89A` |
| Protein, Fiber | Fern `#556B3F` | Sage `#A7B89A` |
| Carbs, Potassium | Warm terracotta / umber accent | Sage `#A7B89A` |

- Rings: 10–12px stroke, rounded caps, center shows the number in Nunito 800.
- Bars: 8px height, pill radius.
- Going over the goal: keep the same color and show a calm note. No red, no alarms.
- Always show the numeric value next to every ring or bar (color alone is not enough).

### 6.4 Encouragement chip
Pill shape, soft sage-tint background, Fern text, leaf icon on the left. Example: "Good progress!"

### 6.5 Background artwork
- Watercolor botanical overlay fixed to screen corners or landing hero views.
- Opacity 12–20%, `pointer-events: none`, always behind content.
- Never overlap body text or form fields. Hide or shrink on small screens if it crowds content.

### 6.6 Bottom navigation (mobile)
Tabs: Home · Log · Progress · Profile. Active tab in Fern with a filled icon; inactive in muted espresso. Cream background, 1px sage top border.

---

## 7. Asset Production Checklist

Notes: SVGs should be outlined (text converted to paths) with no external fonts. All raster assets are exported from the SVG master at exact pixel sizes. Use sRGB. Use transparent backgrounds unless noted.

### 7.1 Logo files

| # | Asset | Format | Dimensions |
|---|---|---|---|
| 1 | Primary horizontal logo (icon + wordmark + tagline), full color on transparent | SVG | Artboard 1360 × 400 (ratio ~3.4:1) |
| 2 | Primary horizontal logo on Soft Cream background | PNG | 2720 × 800 and 1360 × 400 |
| 3 | Horizontal logo without tagline | SVG | 1100 × 320 |
| 4 | Navbar logo (no tagline) | PNG @1x/@2x/@3x + SVG | 137×40, 274×80, 411×120 (desktop 40px tall); 109×32, 218×64, 327×96 (mobile 32px tall) |
| 5 | Wordmark only, Espresso | SVG | 900 × 260 |
| 6 | Stacked lockup (icon above wordmark and tagline) | SVG + PNG | SVG 800 × 800; PNG 1600 × 1600 |
| 7 | Reversed logo (cream, for Fern/Espresso backgrounds) | SVG | Same as #1 |
| 8 | Monochrome logo, one color Espresso | SVG | Same as #1 |
| 9 | Icon badge only (detailed version) | SVG + PNG | SVG 512 × 512; PNG 1024 × 1024 |
| 10 | Icon badge only (simplified small-size version) | SVG | 512 × 512 |

### 7.2 Favicon & web app icons

| # | Asset | Format | Dimensions |
|---|---|---|---|
| 11 | `favicon.ico` (multi-size, uses simplified icon) | ICO | 16×16, 32×32, 48×48 embedded |
| 12 | `favicon.svg` (modern browsers, supports dark mode via CSS) | SVG | viewBox 0 0 32 32 |
| 13 | `favicon-16x16.png` | PNG | 16 × 16 |
| 14 | `favicon-32x32.png` | PNG | 32 × 32 |
| 15 | `apple-touch-icon.png` (full-bleed square, no transparency; iOS rounds corners) | PNG | 180 × 180 |
| 16 | `icon-192.png` (PWA manifest) | PNG | 192 × 192 |
| 17 | `icon-512.png` (PWA manifest) | PNG | 512 × 512 |
| 18 | `icon-maskable-512.png` (key art inside the center 80% safe zone, solid cream background) | PNG | 512 × 512 |
| 19 | `safari-pinned-tab.svg` (single-color) | SVG | viewBox 0 0 16 16 |
| 20 | `mstile-150x150.png` (Windows tile) | PNG | 150 × 150 |

### 7.3 Native app icons (if/when wrapped for stores)

| # | Asset | Format | Dimensions |
|---|---|---|---|
| 21 | iOS App Store master (square, no transparency, no pre-rounded corners) | PNG | 1024 × 1024 |
| 22 | Android Play Store icon | PNG | 512 × 512 |
| 23 | Android adaptive icon foreground (keep art inside the center 288 × 288 safe zone) | PNG | 432 × 432 |
| 24 | Android adaptive icon background (solid Cream `#F7F3E9`) | PNG | 432 × 432 |
| 25 | Android themed/monochrome icon | PNG/SVG | 432 × 432 |

### 7.4 Splash & social

| # | Asset | Format | Dimensions |
|---|---|---|---|
| 26 | Splash screen master (cream, stacked logo, rolling sage and terracotta shapes at bottom) | SVG | viewBox 390 × 844 |
| 27 | iOS/PWA splash exports | PNG | 1170 × 2532, 1284 × 2778, 750 × 1334, 1536 × 2048 |
| 28 | Open Graph / link preview image | PNG | 1200 × 630 |
| 29 | Twitter/X summary large card | PNG | 1200 × 600 |
| 30 | Social profile avatar (icon on cream, safe in a circle crop) | PNG | 400 × 400 |
| 31 | Social cover / banner | PNG | 1500 × 500 |

### 7.5 Background artwork

| # | Asset | Format | Dimensions |
|---|---|---|---|
| 32 | Watercolor botanical, top-left corner overlay (transparent) | WebP + PNG fallback | 1200 × 1200 (displays at 600 × 600 @2x) |
| 33 | Watercolor botanical, bottom-right corner overlay (transparent) | WebP + PNG fallback | 1200 × 1200 |
| 34 | Landing hero overlay, desktop (leaves along one edge, transparent) | WebP + PNG fallback | 2400 × 1200 (2:1) |
| 35 | Landing hero overlay, mobile | WebP + PNG fallback | 1170 × 1000 |
| 36 | Rolling hills footer shapes (sage + terracotta) | SVG | viewBox 1440 × 320 |
| 37 | Subtle paper-grain texture, seamless tile (optional) | PNG | 512 × 512 |

Keep each overlay under ~150 KB. Export WebP at quality 80.

### 7.6 UI icon set

| # | Asset | Format | Dimensions |
|---|---|---|---|
| 38 | Core icons: leaf, utensils, droplet, heart, sun, bar chart, camera (snap), chat bubble, plus, check, flame, settings, home, log, progress, profile | SVG | 24 × 24 grid, 1.75px stroke, rounded caps/joins, `currentColor` |
| 39 | Active (filled) variants of the 4 nav icons | SVG | 24 × 24 |
| 40 | Macro icons: protein, carbs, fat, fiber | SVG | 24 × 24 |

### 7.7 Illustrations & placeholders

| # | Asset | Format | Dimensions |
|---|---|---|---|
| 41 | Empty state: "No meals logged yet" (friendly sprout) | SVG | 480 × 360 |
| 42 | Celebration: first meal logged / streak milestone | SVG | 480 × 360 |
| 43 | Gentle error / offline state | SVG | 480 × 360 |
| 44 | Meal photo placeholder (cream with leaf motif) | WebP | 640 × 480 (4:3) |
| 45 | AI chat avatar (sprout badge) | SVG | 64 × 64 |

### 7.8 Not an asset (build in code)
Calorie ring, macro bars, chips, buttons, and cards are built with CSS/SVG in code from the tokens above. They do not need image files.

---

## 8. Implementation Notes
- Put tokens in a single `tokens.css` and import it before all other styles.
- Serve logos as inline SVG or `<img src=".svg">`; use `srcset` for PNG fallbacks.
- Declare favicons in `<head>` and list `icon-192`, `icon-512`, and `icon-maskable-512` in `manifest.webmanifest`.
- Add `prefers-reduced-motion` handling to any ring or bar animations.
- Test every screen at 320px wide and with the browser zoomed to 200%.

## 9. Open Items Before Launch
1. Finalize the simplified small-size icon (#10); the detailed branch artwork does not survive below ~48px.
2. Choose and clear a license for any watercolor artwork (#32–35). Confirm commercial use if it comes from a stock or AI source.
3. Decide on the umber hex for "Carbs / Potassium" (suggested `#8A5A3C`) and add it to the token set.
4. Add a dark theme, if wanted, as a separate token map.
