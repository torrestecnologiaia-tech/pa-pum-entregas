# Design System Strategy: Kinetic Precision

## 1. Overview & Creative North Star: "Kinetic Precision"
The "Pa Pum Entregas" experience is defined by the intersection of high-velocity movement and absolute professional reliability. To move beyond the "standard delivery app" look, this design system adopts a **Kinetic Precision** aesthetic. 

This North Star rejects the static, boxed-in layouts of the past in favor of a "living" interface. We use intentional asymmetry, overlapping maps and cards, and high-contrast typography to simulate the feeling of a city in motion. The goal is to make the user feel like they are orchestrating a complex logistics ballet with a single tap. We don't just deliver packages; we deliver time.

## 2. Colors: The High-Octane Palette
Our palette utilizes high-contrast vibrance to command attention, balanced by deep, sophisticated neutrals to maintain a premium "professional" feel.

### The "No-Line" Rule
**Lines are friction.** Friction slows down delivery. Therefore, 1px solid borders are strictly prohibited for sectioning. Boundaries must be defined through background color shifts. For example, a `surface-container-low` tracking card should sit directly on a `surface` background, using only tonal contrast to define its edges.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the hierarchy below to stack importance:
*   **Base:** `surface` (#f6f6f6) – The canvas.
*   **Secondary Sections:** `surface-container` (#e8e8e8) – Used for grouping related actions.
*   **Interactive Cards:** `surface-container-lowest` (#ffffff) – To create a natural "pop" against the grey background without using shadows.

### The "Glass & Gradient" Rule
To convey agility, floating action buttons (FABs) and navigation bars should utilize **Glassmorphism**. Apply `surface-container-lowest` with 80% opacity and a 20px backdrop-blur. 
*   **Signature Textures:** For primary action buttons, use a subtle linear gradient from `primary` (#6c5a00) to `primary-fixed` (#ffd709) at a 45-degree angle. This adds a "metallic" sheen that flat color cannot replicate, signifying premium service.

## 3. Typography: The Editorial Edge
We use **Plus Jakarta Sans** for its geometric, modern personality and **Inter** for utility.

*   **Display & Headlines (Plus Jakarta Sans):** These are our "speed markers." Use `display-md` for promotional headers. Use tight letter-spacing (-0.02em) to create an authoritative, editorial feel.
*   **Titles (Plus Jakarta Sans):** `title-lg` and `title-md` should be used for order status and destination names. Bold weights are mandatory here to ensure readability during "glanceable" moments.
*   **Body (Plus Jakarta Sans):** `body-md` is the workhorse for descriptions. 
*   **Labels (Inter):** `label-md` and `label-sm` are used for technical data (tracking numbers, timestamps, distances). The switch to Inter signals "Data Mode" to the user, providing a functional contrast to the brand-heavy headlines.

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "heavy" for an agile app. We achieve depth through light and layering.

*   **The Layering Principle:** Instead of a shadow, place a white `surface-container-lowest` card on top of a `surface-container` background. The subtle shift from #e8e8e8 to #ffffff is enough to signal elevation while keeping the UI "light."
*   **Ambient Shadows:** If a card must float over a map, use an ambient shadow: `y: 8px, blur: 24px, color: rgba(47, 47, 47, 0.06)`. This mimics soft, natural light.
*   **The "Ghost Border":** If accessibility requires a stroke, use `outline-variant` (#adadad) at 15% opacity. Never use a 100% opaque border.

## 5. Components: Precision Engineered

### Buttons (The "Agile" Button)
*   **Primary:** Roundedness `full`. Gradient fill (`primary` to `primary-fixed`). Typography: `title-sm` (Bold). No border.
*   **Secondary:** Roundedness `full`. Background: `secondary-container`. Typography: `on-secondary-container`.
*   **Quick Action (Tertiary):** Background: Transparent. Border: Ghost Border (15% `outline`). Typography: `on-background`.

### Cards & Lists (The "Border-Free" Card)
*   **Order Cards:** Use `surface-container-lowest`. Roundedness `lg` (1rem). 
*   **The Divider Rule:** Forbid divider lines. Separate items using a 16px vertical gap. Use a `surface-container-low` background on every second list item to create a "zebra" stripe effect for readability.

### Tracking Map & Overlays
*   **The Map Scrim:** When a card is active over a map, apply a subtle gradient scrim from `surface` (bottom) to transparent (top) to blend the UI elements into the map environment.

### Action Chips
*   **Status Chips:** (e.g., "In Transit", "Delivered") Use `tertiary-container` with `on-tertiary-container` text. Roundedness `sm`. This adds a pop of sophisticated "safety green" that complements the yellow primary brand color.

### Input Fields
*   **Style:** Minimalist. No bottom line. Use `surface-container-high` as a filled background with `md` roundedness. Focus state should only be signaled by a 2px `primary-fixed` "glow" (ambient shadow), not a border change.

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical margins. A map can bleed to the edges of the screen while the text remains centered.
*   **Do** use high-contrast sizing. Pair a massive `display-sm` headline with a tiny `label-sm` tracking ID for visual interest.
*   **Do** lean into the Amarelo Vibrante (#FFD700) for "success" moments and CTA highlights.

### Don't
*   **Don't** use standard 1px grey dividers. They make the app look like a legacy system.
*   **Don't** use sharp corners. Everything in motion is smoothed; use the `md` and `lg` roundedness scale.
*   **Don't** use pure black (#000000) for body text. Use `on-surface` (#2f2f2f) to maintain a premium, softer editorial feel. Pure black is reserved for heavy brand elements and headings.