# Frontend implementation plan — Barcelona Sessions

Track progress with the checkboxes below. Scope is **frontend only** (no backend or real booking APIs unless noted as prep for later).

---

## 1. Navigation and scroll experience

Goal: persistent wayfinding and a clear primary action after the hero scrolls away.

- [x] Add a **minimal sticky header** (brand/name, anchor links, primary Book CTA)
- [x] Wire anchor links to existing sections (e.g. Schedule, About/coach, Testimonials, Practical info)
- [x] Add **floating “Book” control on small viewports** (optional: show only after hero is out of view)
- [x] Add **secondary hero link** aligned with anchors (e.g. “About Alex”) if it reduces scroll-only discovery
- [x] Verify **scroll offset** so fixed header does not hide section titles when jumping to `#ids`

---

## 2. Schedule section

Goal: faster scanning, optional filtering, clearer scarcity — all with static or client-side data.

- [x] **Group sessions by day** (day subheads or visual separation) *or* implement a **day strip** that filters rows
- [x] Add **filter chips** (e.g. Studio / Outdoor, optional Focus: Strength / Conditioning / Mobility)
- [x] Refine **low-availability UX** (e.g. “Last spots” copy, optional subtle visual for `spots ≤ 2`)
- [x] Handle edge case: **`spots === 0`** (disabled Book, “Full” or waitlist copy) if you add that data later
- [x] **Keyboard / focus**: logical tab order; consider row-level focus or prominent Book per row
- [x] Add **`aria`** where helpful (region labels, live region for filter results if dynamic)

---

## 3. Booking modal

Goal: modal state matches the session the user chose; forms are accessible and predictable.

- [x] When opened from a schedule row, **pre-fill or constrain** date/time to that session (or show read-only session summary + adjust pickers)
- [x] Surface **location** (Studio vs Outdoor) in title, description, or summary line when relevant
- [x] Add **email** field (optional validation only; no send logic required yet)
- [x] Associate **labels with inputs** (`htmlFor` / `id`) for all fields
- [x] Define **reset behavior** on dialog close (clear vs preserve draft) and implement consistently
- [x] Quick pass: **focus management** and Escape/overlay behavior (Radix defaults + any custom tweaks)

---

## 4. Visual and narrative rhythm

Goal: clearer editorial structure without breaking the minimal dark aesthetic.

- [x] Add **eyebrow / kicker text** above major `h2` sections where it helps skimmers
- [x] Introduce **light section variation** (e.g. subtle background band, border, or card wrapper on one block)
- [x] Tune **hero image `object-position`** (and breakpoints) so crops work on narrow screens
- [x] **Mobile testimonials**: consider horizontal snap scroll or compact carousel (only if it improves scan time)
- [x] Optional: **minimal motion** on hover for schedule rows (respect `prefers-reduced-motion` if added)

---

## 5. Practical info and trust

Goal: reduce friction for “where is this?” without building backend.

- [x] Add **map affordance**: static map image, embedded map, or outbound links (Google Maps / Apple Maps) for studio + sample outdoor pin
- [x] Reserve layout for **short credentials / languages** (or “As seen in…” if applicable) near coach copy
- [x] Extend **footer**: social links, contact line, or legal placeholder as needed

---

## 6. Performance and assets

Goal: better LCP and fewer layout surprises.

- [x] **Hero image**: responsive sources (`srcset` / `<picture>`) and appropriate sizes
- [x] Consider **`fetchpriority="high"`** (or equivalent) on LCP image where supported
- [x] **Fonts**: subset or preload strategy for **Space Grotesk** / Inter; audit FOUT/CLS
- [x] Optional: **blur placeholder** or dominant-color for hero (if you adopt a helper or build step)

---

## 7. Accessibility and motion

Goal: baseline compliance and comfort for reduced motion.

- [x] Add **“Skip to main content”** link at top of layout (targets main landmark)
- [x] Ensure **main landmark** and logical **heading order** across the page
- [x] **Contrast review** for `muted-foreground` and small text (badges, footer, labels)
- [x] Honor **`prefers-reduced-motion`** for any scroll/hover animations you add
- [x] Revisit **focus styles** so custom components match visible focus rings

---

## 8. SEO, meta, and global chrome

Goal: shareable, discoverable single-page experience.

- [x] Set **document title** and **meta description** in `index.html` (or head management)
- [x] Add **Open Graph** / Twitter cards (title, description, image path)
- [x] Optional: **canonical** and `lang` attribute if you add locales later

---

## 9. 404 and error states

Goal: consistency with the main brand shell.

- [x] Restyle **`NotFound`** to match dark theme, typography (`font-display`), and spacing
- [x] Replace plain `<a href="/">` with **router `Link`** (or equivalent) for client-side navigation
- [x] Remove or gate **`console.error`** in production if it is only for dev debugging

---

## 10. Internationalization (optional)

Goal: EN / ES (or EN / ES / CA) without backend.

- [x] Decide **languages** and **default**
- [x] Extract user-visible strings into a **dictionary** or i18n module
- [x] Add a **language toggle** in header or footer
- [x] Set **`html lang`** (and optionally `dir`) when locale changes

---

## Progress summary

| Area                         | Items | Done |
|-----------------------------|-------|------|
| Navigation & scroll         | 5     | 5    |
| Schedule                    | 6     | 6    |
| Booking modal               | 6     | 6    |
| Visual rhythm               | 5     | 5    |
| Trust & practical info      | 3     | 3    |
| Performance                 | 4     | 4    |
| Accessibility & motion      | 5     | 5    |
| SEO & meta                  | 3     | 3    |
| 404 / global                | 3     | 3    |
| i18n (optional)             | 4     | 4    |
| **Total checklist items**   | **44** | **44** |

Update the **Done** column (or mark checkboxes) as you complete work. Optional i18n can stay unchecked until you commit to languages.

---

## Suggested implementation order

1. **Navigation + skip link** — unblocks testing anchors and Book visibility on mobile.  
2. **Schedule grouping or filters** — high impact on daily use of the page.  
3. **Booking modal alignment with rows + label associations** — removes confusion at conversion.  
4. **Hero / fonts / meta** — LCP and sharing.  
5. **Maps + footer trust** — answers “where” without backend.  
6. **404 polish + a11y contrast/motion** — polish pass.  
7. **i18n** — if the product needs it; can ship last.

This order can shift if you prioritize marketing (SEO/O first) or compliance (a11y first).
