A fan-made, single-file "link in bio" page for ITZY content creator INO, styled after ITZY's discography — no trackers, no build step, no third-party link tool required, and a live dropdown that reskins the whole site to any of ITZY's 17 comeback/solo eras.

# INO's Link Page 🖤📱

A lightweight, single-file website that works like Linktree or Solo.to, but fully custom-built and self-hosted. Built with plain HTML, CSS, and vanilla JavaScript — no frameworks, no bundler, no `npm install`. It presents INO's profile photo, bio, and every social link (Discord, YouTube x2, TikTok, Instagram, and a smart email button) inside a frosted-glass card floating over a blurred photo backdrop, flanked on wide screens by a scattered "moodboard" of photocards spanning ITZY's entire era timeline — DALLA DALLA (2019) through MOTTO (2026), plus Yeji's and Yuna's solo debuts.

---

## 📂 Project Structure

```
ino_website/
├── index.html                 # The whole site: HTML structure, CSS styling, and JS logic, all in one file
├── ino-pfp.png                 # INO's profile picture, shown inside the glowing circle avatar
├── IMG_2927.jpg … IMG_5257.jpg  # 9 photos tiled into the blurred background "photo wall" behind the card
├── dalla-dalla.jpg … motto.webp # 17 real era photos for the moodboard (one per comeback/solo era, filenames match era slugs)
├── README.md                   # Project documentation (this file)
└── .gitignore                  # Ignores OS junk files, editor folders, and node/env leftovers — images are tracked, not hidden
```

There is no `package.json`, build step, or dependency install — `index.html` is the entire deployed app.

---

## ⚙️ Features

* **Zero Dependencies, Zero Build Step:** The whole site is one HTML file. No npm, no bundler, no framework — open it in a browser and it just works.
* **17-Era Color Theme Switcher:** The "MOTTO" pill in the badges row is a real `<select>` dropdown, styled with its own chevron and hover/focus states so it reads clearly as interactive. Choosing a different era (DALLA DALLA, ICY, WANNABE, NOT SHY, MAFIA IN THE MORNING, LOCO, SNEAKERS, CHESHIRE, CAKE, UNTOUCHABLE, GOLD, IMAGINARY FRIEND, YEJI · AIR, GIRLS WILL BE GIRLS, TUNNEL VISION, YUNA · ICE CREAM, or MOTTO) writes a `data-era` attribute onto `<html>`; a matching `:root[data-era="..."]` block in the CSS swaps out the site's 5 accent colors plus the background tint. Because almost every colored element on the page (glow, badges, link-card stripes, photocard borders, background blobs) references those same CSS custom properties via `color-mix()` instead of hardcoded values, one dropdown selection repaints the *entire* site.
* **Scattered Era Moodboard:** 17 photocards — one real photo per era — are laid out with individually hand-placed rotation, vertical offset, and horizontal jitter for a "jumbled corkboard" look rather than a tidy grid. On wide screens the two scatter zones use `align-self: stretch` to lock their height to exactly match the card + footer beside them, so the scatter never forces extra scrolling no matter how many eras get added later. Photos use `object-fit: contain` so nothing gets cropped, however tall or wide the source image is.
* **Blurred Background Photo Wall:** 9 additional photos tile into a fixed, full-viewport 3×3 grid behind everything, heavily blurred and tinted so they read as ambient texture rather than a distracting gallery.
* **Frosted-Glass Legibility Panel:** The name, handle, bio, and badges sit inside a `backdrop-filter: blur()` panel so text stays readable regardless of what's in the photo behind it, without needing to dim the photos themselves.
* **Smart Email Routing:** The "Ads, Promos & Business" button doesn't guess which mail client to use. Clicking it pops open a small menu offering a Gmail web-compose deep link, an Outlook web-compose deep link, or a plain `mailto:` fallback for whatever mail app is already configured on the device. A chevron on the button flips upside-down whenever the menu is open — pure CSS watching the same `aria-expanded` attribute the JS already sets for accessibility, no extra script needed.
* **Accessible Popup Menu:** The email menu is fully keyboard- and screen-reader-aware — `aria-haspopup`/`aria-expanded` track its state, it closes on outside click or `Escape`, and focus states are visible for keyboard users.
* **Reduced-Motion Respect:** A `prefers-reduced-motion` media query turns off the pulsing avatar glow, hover transitions, and photocard tilt-reset for visitors who are sensitive to animation.
* **Responsive Across Devices:** Four tuned breakpoint tiers instead of one-size-fits-all. Under 380px (small phones and a folded phone's outer cover screen), padding and avatar/badge sizing shrink further so nothing feels cramped. The default tier covers ordinary phones as a single-column card. Between 700–1079px (tablets and a foldable phone's unfolded inner screen) the card widens and the moodboard spreads across more columns instead of piling into a tall, skinny stack. At 1080px and up (laptops and desktops), `<body>` becomes a CSS Grid with the card centered and the two scattered photocard columns flanking it, auto-sized so the layout never overlaps or overflows regardless of screen size.
* **Real Brand Colors:** Every platform icon (Discord, YouTube, TikTok, Instagram, Gmail) uses that brand's actual logo colors rather than a generic icon set, including a 3-layer TikTok mark built from one shared SVG path (offset via `transform: translate()`) to accurately mimic its real chromatic-aberration logo.

---

## 🚀 How to Run

### 1. Get the files
Clone this repository — all the image files are required for the background wall and moodboard to render correctly, so a partial download (just `index.html`) won't look right.

### 2. Run Locally in VS Code
Because this project has zero dependencies, there is no build step. Simply open the file:
* **Option A:** Right-click `index.html` in your VS Code explorer and select **Open with Live Server** (if you have the extension installed).
* **Option B:** Double-click `index.html` in a file explorer, or run it directly from your terminal:
```
start index.html
```

### 3. Or Host it for Free
Push this folder to a GitHub repository, then enable **Settings → Pages** on the `main` branch and root folder. GitHub will provide a live URL within a couple of minutes.

---

## 🔌 System Integrations (Data Flow)

### Era Theme Switching
Picking an option in the era `<select>` fires a `change` listener that sets (or, for "Motto," removes) a `data-era` attribute on `document.documentElement`:
```
<html data-era="loco">   ->  :root[data-era="loco"] { --pink:#FF2DAF; --blue:#00B8D9; ... }
```
No JavaScript touches colors directly — the script only ever toggles one attribute. All the actual repainting is plain CSS cascading through custom properties, so the whole switch is one attribute write plus whatever the browser's style engine already does for free.

### Email Deep-Linking
The email button doesn't rely on the browser's default `mailto:` handler alone. Instead, JavaScript toggles a small dropdown offering three explicit destinations for the same address (`theaceofgenz@gmail.com`):
```
Gmail   -> https://mail.google.com/mail/?view=cm&fs=1&to=<address>
Outlook -> https://outlook.live.com/mail/0/deeplink/compose?to=<address>
Default -> mailto:<address>
```
This avoids the common problem where clicking a plain `mailto:` link on desktop launches an unconfigured local mail app instead of the webmail service the visitor actually uses.

### Menu State Management
The email popup's open/closed state is tracked with a single CSS class (`is-open`) toggled by three listeners: a click on the button itself, a click anywhere else on the document, and an `Escape` keypress. `event.stopPropagation()` on the button's own click handler stops the "click outside closes it" listener from immediately closing the menu it just opened.

---

## 📘 Concepts Demonstrated

* **CSS Custom Properties as a Theming Engine:** A single `:root` block plus 16 `:root[data-era="..."]` override blocks drive every color on the page, so a full site reskin is one attribute change rather than a JavaScript re-render.
* **`color-mix()` for Derived Colors:** Badge borders, background gradient blobs, and frosted-panel tints are computed from the base palette variables at paint time (`color-mix(in srgb, var(--blue) 60%, transparent)`) instead of being separately hardcoded, so they can't drift out of sync with the active theme.
* **CSS Grid for Self-Balancing Layout:** The desktop layout uses `grid-template-areas` with a column spanning two rows, so the page's total height automatically matches whichever is taller — the card, or the scattered photo column — with zero JavaScript measuring or magic-number padding.
* **Hand-Tuned Absolute Positioning for "Designed Chaos":** The scattered moodboard looks random but is fully deterministic — each photocard has an explicit `nth-child` rule controlling its position and rotation, which is what keeps the layout reproducible and stable across reloads instead of using actual randomness.
* **Progressive Disclosure UI:** Both the email popup and the era dropdown reveal extra choices only when opened, instead of cluttering the main interface.
* **Accessible Popup & Form Control Patterns:** Proper use of `aria-haspopup`, `aria-expanded`, `aria-label`, focus-visible outlines, and `Escape`-to-close keyboard support.
* **Backdrop Filters for Legibility Without Sacrificing Visuals:** `backdrop-filter: blur()` panels keep text readable over busy photos without needing to dim or desaturate the photos themselves.
* **Semantic, Dependency-Free HTML/CSS/JS:** No frameworks or libraries — every interaction is built from plain DOM APIs (`classList`, `addEventListener`, `getAttribute`/`setAttribute`).
* **Brand-Accurate Iconography:** Hand-coded inline SVGs matching each platform's real logo colors and shapes, including a multi-layer TikTok mark built from one reused path.

---

## 🔧 Requirements

* **To use the site:** A modern browser with `backdrop-filter` and `color-mix()` support (Chrome/Edge 111+, Safari 16.2+, Firefox 113+ — anything from 2023 onward). No internet connection is required after the initial load, aside from the Google Fonts CDN request.
* **To edit or host it:** Nothing beyond a text editor and, optionally, Git/GitHub for hosting — there's no `npm install`, no build command, and nothing to compile.

---

## 🎓 Credits & Professional Attributions

This project was built as a personal "link in bio" page for INO, demonstrating dependency-free frontend development, CSS-driven theming, and accessible UI patterns.

* **Design & Code:** Built collaboratively with Claude (Anthropic).
* **Theme Inspiration:** ITZY's full comeback and solo discography, from "DALLA DALLA" (2019) through "MOTTO" (2026), plus Midzy fandom colors and a few Ryujin-specific nods.
* **Fonts:** [Archivo Black](https://fonts.google.com/specimen/Archivo+Black), [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk), and [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono), served via Google Fonts.
* **Not affiliated with JYP Entertainment, ITZY, or Midzy** — this is an unofficial fan project made for INO.
