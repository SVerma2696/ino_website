A fan-made, single-file "link in bio" page for ITZY content creator INO, styled after ITZY's discography — no trackers, no build step, no third-party link tool required, a live dropdown that reskins the whole site to any of ITZY's 17 comeback/solo eras, and its own independent light/dark mode.

# INO's Link Page 🖤📱

A lightweight, single-file website that works like Linktree or Solo.to, but fully custom-built and self-hosted. Built with plain HTML, CSS, and vanilla JavaScript — no frameworks, no bundler, no `npm install`. It presents INO's profile photo, bio, and every social link (Discord, YouTube x2, TikTok, Instagram, and a smart email button) inside a frosted-glass card floating over a blurred photo backdrop, flanked on wide screens by a scattered "moodboard" of photocards spanning ITZY's entire era timeline — DALLA DALLA (2019) through MOTTO (2026), plus Yeji's and Yuna's solo debuts. Every photocard doubles as a link straight to that era's music video on YouTube.

---

## 📂 Project Structure

```
ino_website/
├── index.html                 # The whole site: HTML structure, CSS styling, and JS logic, all in one file
├── ino-pfp.jpg                  # INO's profile picture, shown inside the glowing circle avatar
├── IMG_2927.jpg … IMG_5257.jpg  # 9 photos tiled into the blurred background "photo wall" behind the card
├── dalla-dalla.jpg … motto.webp # 17 real era photos for the moodboard (one per comeback/solo era, filenames match era slugs)
├── README.md                   # Project documentation (this file)
└── .gitignore                  # Ignores OS junk files, editor folders, and node/env leftovers — images are tracked, not hidden
```

There is no `package.json`, build step, or dependency install — `index.html` is the entire deployed app.

---

## ⚙️ Features

* **Zero Dependencies, Zero Build Step:** The whole site is one HTML file. No npm, no bundler, no framework — open it in a browser and it just works.
* **17-Era Color Theme Switcher:** The "MOTTO" pill in the badges row is a real `<select>` dropdown, styled with its own chevron and hover/focus states so it reads clearly as interactive — the chevron itself even flips upside-down while the list is open (approximated via `:focus`, since browsers don't expose a true "is this select's popup open" CSS hook). Choosing a different era (DALLA DALLA, ICY, WANNABE, NOT SHY, IN THE MORNING, LOCO, SNEAKERS, CHESHIRE, CAKE, UNTOUCHABLE, GOLD, IMAGINARY FRIEND, YEJI · AIR, GIRLS WILL BE GIRLS, TUNNEL VISION, YUNA · ICE CREAM, or MOTTO) writes a `data-era` attribute onto `<html>`; a matching `:root[data-era="..."]` block in the CSS swaps out the site's 5 accent colors plus the wall color (`--bg`). Critically, `--bg-card` — the background color used by *every* card, badge, and photocard frame on the page — isn't a fixed color at all; it's `color-mix(in srgb, var(--bg) 75%, white)`, so it automatically re-tints itself from whatever `--bg` the active era sets. Combined with the background gradient blobs and photo-wall tint also pulling from the same variables, one dropdown selection repaints the large surfaces of the page, not just thin accent stripes.
* **Independent Light/Dark Mode:** A floating circular button in the top-right corner toggles a completely separate `data-theme="dark"` attribute, overriding `--bg`, `--bg-card`, `--text`, `--muted`, and `--border` for a proper dark palette — while deliberately leaving the 5 era accent colors untouched, so whichever era is active keeps its "flavor" against the dark backdrop instead of the page going flat. It defaults to whatever the visitor picked last time (saved in `localStorage`), falling back to their OS-level `prefers-color-scheme` if they've never toggled it before. The moon/sun icon swaps automatically to show what clicking it will do next.
* **Shareable Era Links:** Picking an era also rewrites the address bar to `?era=loco` (via `history.replaceState`, so it doesn't spam the back button), and the reverse happens on load — visiting a link with `?era=` already in it opens the page pre-themed to that era, with the dropdown showing the right selection. Sharing "look at the page in LOCO mode" is just sharing a URL.
* **Scattered, Clickable Era Moodboard:** 17 photocards — one real photo per era — are laid out with individually hand-placed rotation, vertical offset, and horizontal jitter for a "jumbled corkboard" look rather than a tidy grid. Every photocard is a genuine link (`<a>`) that opens that era's official music video on YouTube in a new tab; because they're real, useful links now rather than decoration, the `aria-hidden="true"` that used to sit on the gallery wrappers was removed, and each link carries its own `aria-label` (e.g. "Watch the DALLA DALLA music video on YouTube") for screen readers. On wide screens the two scatter zones use `align-self: stretch` to lock their height to exactly match the card + footer beside them, so the scatter never forces extra scrolling no matter how many eras get added later. Photos use `object-fit: contain` so nothing gets cropped, however tall or wide the source image is. None of the 26 photos on the page use `loading="lazy"` — that attribute can misfire on a layout this dynamic (percentage-based absolute positioning inside a CSS Grid column that resizes itself), so every image is set to load immediately instead, trading a small amount of best-practice performance for guaranteed reliability across devices.
* **Blurred Background Photo Wall:** 9 additional photos tile into a fixed, full-viewport 3×3 grid behind everything, heavily blurred and tinted so they read as ambient texture rather than a distracting gallery.
* **Frosted-Glass Legibility Panel:** The name, handle, bio, and badges sit inside a `backdrop-filter: blur()` panel so text stays readable regardless of what's in the photo behind it, without needing to dim the photos themselves.
* **Copy-to-Clipboard Email:** The email address inside the "Ads, Promos & Business" button is its own separately-clickable target (a `<span role="button">` nested inside the bigger `<button>`) — tapping just the address copies it via the `navigator.clipboard` API and shows a small "Copied!" toast, for anyone who'd rather paste the address somewhere than open a mail app. `event.stopPropagation()` keeps that tap from also popping open the mail-app menu underneath it.
* **Smart Email Routing:** The "Ads, Promos & Business" button doesn't guess which mail client to use. Clicking it (anywhere except the address itself) pops open a small menu offering a Gmail web-compose deep link, an Outlook web-compose deep link, or a plain `mailto:` fallback for whatever mail app is already configured on the device. A chevron on the button flips upside-down whenever the menu is open — pure CSS watching the same `aria-expanded` attribute the JS already sets for accessibility, no extra script needed.
* **Accessible Popup Menu:** The email menu is fully keyboard- and screen-reader-aware — `aria-haspopup`/`aria-expanded` track its state, it closes on outside click or `Escape`, and focus states are visible for keyboard users.
* **"View Source" & Share Previews:** A GitHub-mark button (mirroring the theme toggle, floating top-left) links straight to this repository. Open Graph and Twitter Card meta tags mean pasting this page's link into Discord, iMessage, or Twitter shows a proper preview card with INO's photo, title, and bio instead of a bare blue link. A `<meta name="theme-color">` tag — kept in sync by JavaScript every time the era or light/dark mode changes — tints a mobile browser's own toolbar to match whatever's currently on screen.
* **Dismissible "Next Comeback" Countdown:** A banner mechanism that's completely OFF by default (an empty `NEXT_COMEBACK_DATE` constant means it never renders) — but is ready to switch on the moment there's a real announced date, just by filling in one line in the script. It counts down in days/hours/minutes, and remembers a dismissal per-date in `localStorage`, so closing an old announcement doesn't hide a future one.
* **Gentle Fade-In:** The whole page fades in from transparent over half a second on first load instead of just "popping" into view, skipped automatically for visitors with `prefers-reduced-motion` set.
* **Reduced-Motion Respect:** A `prefers-reduced-motion` media query turns off the pulsing avatar glow, hover transitions, page fade-in, and photocard tilt-reset for visitors who are sensitive to animation.
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
<html data-era="loco">
  -> :root[data-era="loco"] { --bg:#F3E8FF; --pink:#FF2DAF; --blue:#00B8D9; ... }
  -> --bg-card recalculates itself: color-mix(in srgb, var(--bg) 75%, white)
  -> every card/badge/photocard/background-blob that references --bg-card or the
     5 accent variables repaints automatically
```
No JavaScript touches colors directly — the script only ever toggles one attribute. All the actual repainting is plain CSS cascading through custom properties (including one property, `--bg-card`, that's itself defined in terms of another), so the whole switch is one attribute write plus whatever the browser's style engine already does for free.

### Light/Dark Mode + Persistence
The theme toggle writes `data-theme="dark"` (or removes it) on `<html>`, then saves the choice to `localStorage['ino-theme']`. On the next page load, that saved value takes priority; if none exists yet, `window.matchMedia('(prefers-color-scheme: dark)')` decides the starting point instead. `:root[data-theme="dark"]` is written *after* all 16 era blocks in the CSS specifically so it wins any specificity tie when both an era and dark mode are active together.

### Shareable Era URLs
```
Load:   ?era=loco in the URL  ->  eraSelect.value = 'loco' (only if that's a real option)
                               ->  applyEra('loco')
Change: pick a new era        ->  history.replaceState() rewrites ?era= in the address bar
```
Setting a `<select>`'s `.value` to something that isn't one of its real `<option>`s silently fails and leaves the value unchanged — that's used as a lightweight, built-in way to validate the URL parameter without writing a separate allow-list.

### Moodboard → YouTube Linking
Each of the 17 photocards is a plain `<a href="https://youtu.be/...">` pointing directly at that era's official music video, with `target="_blank" rel="noopener"` so it opens in a new tab without handing the new page a reference back to this one. No JavaScript is involved — it's the same anchor-tag mechanism as every other link on the page, just styled to look like a photo instead of a button.

### Copy-to-Clipboard
Clicking (or pressing Enter/Space on) the email address calls `navigator.clipboard.writeText()`, then shows the "Copied!" toast only inside the returned Promise's `.then()` — so if a browser blocks clipboard access for any reason, the `.catch()` simply does nothing extra rather than showing a false "Copied!" message.

### Email Deep-Linking
The email button doesn't rely on the browser's default `mailto:` handler alone. Instead, JavaScript toggles a small dropdown offering three explicit destinations for the same address (`theaceofgenz@gmail.com`):
```
Gmail   -> https://mail.google.com/mail/?view=cm&fs=1&to=<address>
Outlook -> https://outlook.live.com/mail/0/deeplink/compose?to=<address>
Default -> mailto:<address>
```
This avoids the common problem where clicking a plain `mailto:` link on desktop launches an unconfigured local mail app instead of the webmail service the visitor actually uses.

### Menu State Management
The email popup's open/closed state is tracked with a single CSS class (`is-open`) toggled by three listeners: a click on the button itself, a click anywhere else on the document, and an `Escape` keypress. `event.stopPropagation()` on the button's own click handler stops the "click outside closes it" listener from immediately closing the menu it just opened. The same `stopPropagation()` trick keeps the copy-to-clipboard span's clicks from also triggering this menu.

---

## 📘 Concepts Demonstrated

* **CSS Custom Properties as a Theming Engine:** A single `:root` block, 16 `:root[data-era="..."]` override blocks, and one `:root[data-theme="dark"]` block drive every color on the page, so a full site reskin — era, light/dark, or both together — is an attribute change rather than a JavaScript re-render.
* **`color-mix()` for Derived Colors:** Badge borders, background gradient blobs, and frosted-panel tints are computed from the base palette variables at paint time (`color-mix(in srgb, var(--blue) 60%, transparent)`) instead of being separately hardcoded, so they can't drift out of sync with the active theme. `--bg-card` takes this a step further by deriving itself from a *different* custom property (`--bg`) rather than a fixed value, so every card surface on the page inherits whatever mood the active era (and light/dark mode) sets without needing its own override in every theme block.
* **Progressive Enhancement via `localStorage` + `matchMedia`:** Both the dark-mode preference and the countdown banner's dismissal state are wrapped in `try`/`catch` around `localStorage` calls, since some browser privacy modes block it entirely — the features still work for the current visit even when nothing can be remembered for the next one.
* **Feature Flags via a Single Empty Value:** The comeback countdown banner is entirely gated behind one constant (`NEXT_COMEBACK_DATE = ''`) — leaving it empty means the whole feature (including a `hidden` HTML attribute on the banner) never activates, and turning it on later is a one-line edit rather than un-commenting a block of code.
* **Reliability Over Micro-Optimization:** `loading="lazy"` was deliberately left off every image once it became clear the attribute could misfire against this page's more dynamic, percentage-based layout — a reminder that a "best practice" attribute is only good if it actually behaves correctly on the specific layout it's applied to.
* **CSS Grid for Self-Balancing Layout:** The desktop layout uses `grid-template-areas` with a column spanning two rows, so the page's total height automatically matches whichever is taller — the card, or the scattered photo column — with zero JavaScript measuring or magic-number padding.
* **Hand-Tuned Absolute Positioning for "Designed Chaos":** The scattered moodboard looks random but is fully deterministic — each photocard has an explicit `nth-child` rule controlling its position and rotation, which is what keeps the layout reproducible and stable across reloads instead of using actual randomness.
* **Progressive Disclosure UI:** The email popup and the era dropdown both reveal extra choices only when opened, instead of cluttering the main interface.
* **Approximating Missing Browser Hooks:** There's no CSS pseudo-class for "this native `<select>`'s popup is currently open," so the era dropdown's chevron flip uses `:focus` as a close-enough stand-in — a practical example of working within a platform's real constraints instead of over-engineering around them.
* **Accessible Popup & Form Control Patterns:** Proper use of `aria-haspopup`, `aria-expanded`, `aria-pressed`, `aria-label`, `role="button"` on a non-button element (with matching keyboard handling), focus-visible outlines, and `Escape`-to-close support.
* **Backdrop Filters for Legibility Without Sacrificing Visuals:** `backdrop-filter: blur()` panels keep text readable over busy photos without needing to dim or desaturate the photos themselves.
* **Semantic, Dependency-Free HTML/CSS/JS:** No frameworks or libraries — every interaction is built from plain DOM APIs (`classList`, `addEventListener`, `getAttribute`/`setAttribute`, `URL`/`URLSearchParams`, `history.replaceState`).
* **Brand-Accurate Iconography:** Hand-coded inline SVGs matching each platform's real logo colors and shapes, including a multi-layer TikTok mark built from one reused path and the standard GitHub octocat mark.

---

## 🔧 Requirements

* **To use the site:** A modern browser with `backdrop-filter` and `color-mix()` support (Chrome/Edge 111+, Safari 16.2+, Firefox 113+ — anything from 2023 onward). No internet connection is required after the initial load, aside from the Google Fonts CDN request. Copy-to-clipboard additionally requires a browser granting Clipboard API access, which normally happens automatically on a real click in a secure (`https://`) context.
* **To edit or host it:** Nothing beyond a text editor and, optionally, Git/GitHub for hosting — there's no `npm install`, no build command, and nothing to compile.

---

## 🎓 Credits & Professional Attributions

This project was built as a personal "link in bio" page for INO, demonstrating dependency-free frontend development, CSS-driven theming, and accessible UI patterns.

* **Theme Inspiration:** ITZY's full comeback and solo discography, from "DALLA DALLA" (2019) through "MOTTO" (2026), plus Midzy fandom colors and a few Ryujin-specific nods.
* **Fonts:** [Archivo Black](https://fonts.google.com/specimen/Archivo+Black), [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk), and [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono), served via Google Fonts.
* **Not affiliated with JYP Entertainment, ITZY, or Midzy** — this is an unofficial fan project made for INO.
