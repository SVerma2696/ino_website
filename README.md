A fan-made, single-file "link in bio" page for ITZY content creator INO, styled after ITZY's discography — no trackers, no build step, no third-party link tool required, a live dropdown that reskins the whole site to any of ITZY's 17 comeback/solo eras, and its own independent light/dark/system theme dropdown.

# INO's Link Page 🖤📱

A lightweight, single-file website that works like Linktree or Solo.to, but fully custom-built and self-hosted. Built with plain HTML, CSS, and vanilla JavaScript — no frameworks, no bundler, no `npm install`. It presents INO's profile photo, bio, and every social link (Discord, YouTube x3, TikTok, Instagram, and a smart email button) inside a frosted-glass card floating over a blurred photo backdrop, flanked on wide screens by a "moodboard" of 31 photocards spanning ITZY's entire discography in chronological order — every title track, pre-release, Japanese release, and collab from "DALLA DALLA" (2019) through "MOTTO" (2026), plus Yeji's and Yuna's solo debuts. Every photocard has a real photo and doubles as a link straight to that song's official music video on YouTube.

---

## 📂 Project Structure

```
ino_website/
├── index.html                 # The whole site: HTML structure, CSS styling, and JS logic, all in one file
├── ino-pfp.jpg                  # INO's profile picture, shown inside the glowing circle avatar
├── crown.png                    # Browser tab favicon
├── IMG_2927.jpg … IMG_5257.jpg  # 9 photos tiled into the blurred background "photo wall" behind the card
├── dalla-dalla.jpg … motto.webp # 31 real photos, one per song in the moodboard timeline (filenames roughly
│                                 # match each song's name — pre-releases, Japanese versions, and collabs
│                                 # included, not just the 17 main comeback eras)
├── README.md                   # Project documentation (this file)
└── .gitignore                  # Ignores OS junk files, editor folders, and node/env leftovers — images are tracked, not hidden
```

There is no `package.json`, build step, or dependency install — `index.html` is the entire deployed app.

---

## ⚙️ Features

* **Zero Dependencies, Zero Build Step:** The whole site is one HTML file. No npm, no bundler, no framework — open it in a browser and it just works.
* **17-Era Color Theme Switcher:** The "MOTTO" pill in the badges row is a real `<select>` dropdown, styled with its own chevron and hover/focus states so it reads clearly as interactive — the chevron itself even flips upside-down while the list is open, and back down again once it closes (see "Shared Dropdown Arrow" below for how that reliably works now). Choosing a different era (DALLA DALLA, ICY, WANNABE, NOT SHY, IN THE MORNING, LOCO, SNEAKERS, CHESHIRE, CAKE, UNTOUCHABLE, GOLD, IMAGINARY FRIEND, YEJI · AIR, GIRLS WILL BE GIRLS, TUNNEL VISION, YUNA · ICE CREAM, or MOTTO) writes a `data-era` attribute onto `<html>`; a matching `:root[data-era="..."]` block in the CSS swaps out the site's 5 accent colors plus the wall color (`--bg`). Critically, `--bg-card` — the background color used by *every* card, badge, and photocard frame on the page — isn't a fixed color at all; it's `color-mix(in srgb, var(--bg) 75%, white)`, so it automatically re-tints itself from whatever `--bg` the active era sets. Combined with the background gradient blobs and photo-wall tint also pulling from the same variables, one dropdown selection repaints the large surfaces of the page, not just thin accent stripes. The chevron itself is drawn with `stroke="currentColor"` (instead of a fixed hex color) so it always matches the pill's own text color and stays visible no matter how dark or light the currently-picked era's theme is.
* **Light / Dark / System Theme Dropdown:** The floating pill in the top-right corner is a real `<select>` dropdown with three choices — 🖥️ System, ☀️ Light, and 🌙 Dark — instead of the single on/off button it used to be, each with a little emoji icon in front of its label (a real `<select>`'s `<option>` text can only ever be plain text, no embedded HTML or `<svg>`, so an emoji is the closest thing to "put a picture on this option" that actually works in every browser). "System" means "just copy whatever my phone or computer is already set to," and it stays live: if the visitor's own device switches from light to dark (like a phone that goes dark automatically at sunset) while "System" is picked, the page follows along immediately via a `matchMedia('(prefers-color-scheme: dark)')` change listener, no refresh needed. Whichever mode is picked overrides `--bg`, `--bg-card`, `--text`, `--muted`, and `--border` for dark mode specifically — while deliberately leaving the 5 era accent colors untouched, so whichever era is active keeps its "flavor" against the dark backdrop instead of the page going flat. The choice is remembered in `localStorage`, and defaults to "System" for a brand new visitor.
* **Shared Dropdown Arrow, as a Real Overlaid `<svg>`:** Both dropdowns share one arrow mechanism, driven by a JavaScript-managed `.is-open` class on a wrapping `<span class="select-wrap">` rather than a plain CSS `:focus` rule. Two earlier versions of this had real bugs, fixed in order: (1) a `:focus`-only version got stuck because a native `<select>` usually keeps its keyboard "focus" even after its popup list closes, so the arrow would flip up once and never flip back down — fixed by listening for every way a dropdown can actually close (picking an option, pressing Escape, tabbing away, or clicking anywhere else on the page) and removing `.is-open` every time; (2) baking the arrow into the `<select>`'s own `background-image` turned out to render broken/oversized for some visitors, since a custom background sitting underneath a native dropdown's own popup list doesn't behave consistently across browsers — fixed by pulling the arrow out into its own real `<svg class="select-arrow">`, absolutely positioned on top of the select with `pointer-events: none` (so clicks still pass through to open it), flipped with a plain `transform: rotate(180deg)` instead of swapping background images.
* **Shareable Era Links:** Picking an era also rewrites the address bar to `?era=loco` (via `history.replaceState`, so it doesn't spam the back button), and the reverse happens on load — visiting a link with `?era=` already in it opens the page pre-themed to that era, with the dropdown showing the right selection. Sharing "look at the page in LOCO mode" is just sharing a URL.
* **Full 31-Song Moodboard, Every Photo and Link Real:** Every ITZY release has its own photocard — not just the 17 main comebacks, but every pre-release, Japanese version, and collab too — all in chronological order from 2019's "DALLA DALLA" to 2026's "MOTTO," each with a real photo and a real official YouTube link (no placeholders left). Only the 17 *main* comebacks (the ones with proper music-show promotion) are also options in the era color-theme dropdown — the pre-releases/Japanese versions/collabs are extra photocards for completeness, not full "eras." On wide screens, each side of the card is a real CSS multi-column ("masonry") cluster — `columns: 2` — instead of one single-file column, so cards sit beside AND above/below each other in a loose brick pattern; on top of that, every card gets its own rotation (cycling through 4 different angles) and small vertical nudge for a properly "scattered on a desk" look. Because the browser's own column-flow layout is doing the actual positioning (nothing is absolutely-positioned or hand-placed by pixel math), two cards can never overlap however many songs get added to the timeline later — see "Concepts Demonstrated" below for the two earlier layout attempts this replaced, and the bugs that pushed each change. Each photocard is a genuine link (`<a>`) that opens in a new tab; each one also carries its own `aria-label` (e.g. "Watch the DALLA DALLA music video on YouTube") for screen readers. Photos use `object-fit: contain` so nothing gets cropped, however tall or wide the source image is. None of the photos on the page use `loading="lazy"` — that attribute can misfire on a layout this dynamic, so every image is set to load immediately instead, trading a small amount of best-practice performance for guaranteed reliability across devices.
* **Blurred Background Photo Wall, Uncropped AND Seamless:** 9 additional photos tile into a fixed, full-viewport 3×3 grid behind everything. Each grid square actually holds the SAME photo twice, layered on top of each other (see ".bg-cell" in the code) — a big, heavily-blurred copy underneath using `object-fit: cover` that always completely fills its square edge-to-edge with zero gaps, and a second, less-blurred copy on top using `object-fit: contain` so the WHOLE photo is visible with nothing cropped off. This two-layer trick is what makes the grid genuinely invisible: a single-layer "contain" approach leaves flat, hard-edged empty bars around any photo whose shape doesn't perfectly match its square (which is exactly what was making the 3×3 grid so obvious before, and on some phone screens was shrinking a mismatched photo down so much it barely read as "there" at all) — layering a seamless blurred "fill" underneath means there's never a flat empty gap to see, on any device, regardless of any individual photo's shape.
* **Frosted-Glass Legibility Panel:** The name, handle, bio, and badges sit inside a `backdrop-filter: blur()` panel so text stays readable regardless of what's in the photo behind it, without needing to dim the photos themselves.
* **Copy-to-Clipboard Email:** The email address inside the "Ads, Promos & Business" button is its own separately-clickable target (a `<span role="button">` nested inside the bigger `<button>`) — tapping just the address copies it via the `navigator.clipboard` API and shows a small "Copied!" toast, for anyone who'd rather paste the address somewhere than open a mail app. `event.stopPropagation()` keeps that tap from also popping open the mail-app menu underneath it.
* **Smart Email Routing:** The "Ads, Promos & Business" button doesn't guess which mail client to use. Clicking it (anywhere except the address itself) pops open a small menu offering a Gmail web-compose deep link, an Outlook web-compose deep link, or a plain `mailto:` fallback for whatever mail app is already configured on the device. A chevron on the button flips upside-down whenever the menu is open — pure CSS watching the same `aria-expanded` attribute the JS already sets for accessibility, no extra script needed.
* **Accessible Popup Menu:** The email menu is fully keyboard- and screen-reader-aware — `aria-haspopup`/`aria-expanded` track its state, it closes on outside click or `Escape`, and focus states are visible for keyboard users.
* **"View Source" & Share Previews:** A GitHub-mark button (floating top-left, mirroring the theme dropdown's corner on the right) links straight to this repository. Open Graph and Twitter Card meta tags mean pasting this page's link into Discord, iMessage, or Twitter shows a proper preview card with INO's photo, title, and bio instead of a bare blue link. A `<meta name="theme-color">` tag — kept in sync by JavaScript every time the era or light/dark mode changes — tints a mobile browser's own toolbar to match whatever's currently on screen. The browser tab itself shows `crown.png` as its favicon.
* **Dismissible "Next Comeback" Countdown:** A banner mechanism that's completely OFF by default (an empty `NEXT_COMEBACK_DATE` constant means it never renders) — but is ready to switch on the moment there's a real announced date, just by filling in one line in the script. It counts down in days/hours/minutes, and remembers a dismissal per-date in `localStorage`, so closing an old announcement doesn't hide a future one.
* **Gentle Fade-In:** The whole page fades in from transparent over half a second on first load instead of just "popping" into view, skipped automatically for visitors with `prefers-reduced-motion` set.
* **Reduced-Motion Respect:** A `prefers-reduced-motion` media query turns off the pulsing avatar glow, hover transitions, page fade-in, and photocard tilt-reset for visitors who are sensitive to animation.
* **Responsive Across Devices:** Four tuned breakpoint tiers instead of one-size-fits-all. Under 380px (small phones and a folded phone's outer cover screen), padding and avatar/badge sizing shrink further so nothing feels cramped. The default tier covers ordinary phones as a single-column card. Between 700–1079px (tablets and a foldable phone's unfolded inner screen) the card widens and the moodboard spreads across more columns instead of piling into a tall, skinny stack. At 1080px and up (laptops and desktops), `<body>` becomes a CSS Grid with the card centered and the two scattered photocard columns flanking it, auto-sized so the layout never overlaps or overflows regardless of screen size.
* **Real Brand Colors:** Every platform icon (Discord, YouTube, TikTok, Instagram, Gmail) uses that brand's actual logo colors rather than a generic icon set, including a 3-layer TikTok mark built from one shared SVG path (offset via `transform: translate()`) to accurately mimic its real chromatic-aberration logo.
* **Third YouTube Link for the Temporary Backup Channel:** A third YouTube-styled link card (`@aceofgenzy`) sits alongside the main and longform channel buttons, clearly labeled "Temporary YouTube" with a "backup channel, for now" subtitle, for whenever INO is posting from a backup channel instead of the main one.
* **Copyright / Ownership Disclaimer:** A second line in the footer states plainly that this fan page doesn't own any of the linked ITZY photos or videos — "I do not claim ownership of this content. All rights belong to the respective owner." — right below the existing "not affiliated with JYP Entertainment" line.

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

### Light/Dark/System Mode + Persistence
The theme `<select>` stores one of three values — `'light'`, `'dark'`, or `'system'` — and calls `applyTheme(mode)`, which writes `data-theme="dark"` (or removes it) on `<html>` based on that mode (for `'system'`, it also checks `window.matchMedia('(prefers-color-scheme: dark)').matches` live). The chosen mode is saved to `localStorage['ino-theme']`; on the next page load, that saved value takes priority, defaulting to `'system'` for a first-time visitor. A `matchMedia(...).addEventListener('change', ...)` listener keeps watching the device's own setting for as long as `'system'` stays selected, so the page updates immediately if that device setting changes mid-visit. `:root[data-theme="dark"]` is written *after* all 16 era blocks in the CSS specifically so it wins any specificity tie when both an era and dark mode are active together.

### Shared Dropdown Arrow State
Both `<select>` dropdowns call a shared `setUpDropdownArrow(selectElement)` function, which adds/removes a `.is-open` CSS class on the select's wrapping `<span class="select-wrap">` (rather than relying on `:focus`):
```
mousedown / focus  -> add "is-open"     (dropdown is opening)
change / blur      -> remove "is-open"  (an option was picked, or focus moved away)
keydown "Escape"    -> remove "is-open"  (popup dismissed via keyboard)
document "click"    -> remove "is-open" (unless the click landed on this exact <select>)
```
That last listener is the important one: clicking outside a `<select>`'s open popup to dismiss it doesn't reliably blur the element in every browser, so watching only `focus`/`blur` left the arrow stuck open. Listening for clicks anywhere on the whole document (and checking the click's target isn't the dropdown itself) catches that case too.

The arrow itself is a real `<svg class="select-arrow">`, absolutely positioned on top of the select (`pointer-events: none`, so clicks fall straight through to the `<select>` underneath) rather than being baked into the select's own `background-image`. CSS handles the actual flip with a plain rotate:
```
.select-wrap.is-open .select-arrow{ transform: translateY(-50%) rotate(180deg); }
```
This replaced an earlier version where the arrow WAS a `background-image` on the `<select>` itself — that approach could render broken/oversized for some visitors, since a custom background sitting underneath a native dropdown's own OS-drawn popup list isn't guaranteed to behave the same way in every browser.

### Shareable Era URLs
```
Load:   ?era=loco in the URL  ->  eraSelect.value = 'loco' (only if that's a real option)
                               ->  applyEra('loco')
Change: pick a new era        ->  history.replaceState() rewrites ?era= in the address bar
```
Setting a `<select>`'s `.value` to something that isn't one of its real `<option>`s silently fails and leaves the value unchanged — that's used as a lightweight, built-in way to validate the URL parameter without writing a separate allow-list.

### Moodboard → YouTube Linking
All 31 photocards are a plain `<a href="https://youtu.be/...">` pointing directly at that song's official music video, with `target="_blank" rel="noopener"` so it opens in a new tab without handing the new page a reference back to this one. No JavaScript is involved — it's the same anchor-tag mechanism as every other link on the page, just styled to look like a photo instead of a button.

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
* **CSS Grid for Self-Balancing Layout:** The desktop layout uses `grid-template-areas` with a column spanning two rows, so the page's total height automatically matches whichever is taller — the card + footer, or the two photocard columns — with zero JavaScript measuring or magic-number padding.
* **Knowing When to Abandon an Approach That Stopped Scaling:** The desktop moodboard has gone through three real layout approaches, each one replaced because of a genuine problem the last one hit. (1) It started by hand-placing all cards at exact percent-based positions (absolute positioning + `nth-child` rules), stretched to always match the card + footer's height. That worked at 17 cards, but once the timeline grew to 31 real photos, the math ran out of vertical room and captions started overlapping, making them unreadable. (2) The fix was a plain auto-height single-file column (flexbox) — safe from overlap, but visually just a straight list, not "scattered." (3) The current version switches to a real CSS multi-column layout (`columns: 2`) plus per-card rotation, which reads as genuinely scattered while still being 100% overlap-safe, since normal column-flow layout (not manual pixel math) is doing the actual positioning. Each step traded away a nice-sounding guarantee (fixed height, or true randomness) for a more important one (readability, then "actually looks scattered") once real content revealed the previous approach's limits.
* **A Reminder That "columns" Only Works on Block-Level Boxes:** The multi-column moodboard layout silently failed the first time it was written — every card kept stacking in one single-file column despite `columns: 2` being set, with zero errors anywhere. The cause: `.gallery-left`/`.gallery-right` also carry a shared `.gallery` class used for the mobile/tablet flex-wrap layout, and `display: flex` was never explicitly turned back off for the desktop tier. CSS multi-column layout (the `columns` property) has no effect at all on a flex container — a flex container's own layout algorithm always wins. The fix was one line (`display: block;`), but finding it meant remembering that a CSS property silently doing nothing is often a sign that a *different* property elsewhere is overriding the whole layout mode, not that the property itself is broken.
* **Progressive Disclosure UI:** The email popup and the era dropdown both reveal extra choices only when opened, instead of cluttering the main interface.
* **Approximating Missing Browser Hooks:** There's no CSS pseudo-class or JavaScript event for "this native `<select>`'s popup is currently open" — so both dropdowns' chevron flip is approximated in JavaScript by listening for every different way the popup can close (`change`, `blur`, `Escape`, and clicking anywhere else on the document) and toggling a plain `.is-open` class, rather than trusting any single browser event to mean "closed." A practical example of working within a platform's real constraints instead of over-engineering around them.
* **Overlaying a Real Element Instead of Fighting a Native Control's Internals:** The dropdown arrows used to be a `background-image` painted directly onto the `<select>`, which could render broken/oversized for some visitors since a native `<select>`'s own OS-drawn popup doesn't always composite a custom background consistently. Pulling the arrow out into a separate, absolutely-positioned `<svg>` with `pointer-events: none` sidesteps the whole class of bug — it's a completely ordinary DOM element now, styled and animated with completely ordinary CSS, that just happens to sit visually on top of an unstyled-arrow `<select>`.
* **Live-Following a System Preference:** The "System" theme option doesn't just check `prefers-color-scheme` once on page load — it subscribes to that media query with `addEventListener('change', ...)`, so the page's theme updates immediately if the visitor's OS-level light/dark setting changes while the tab is still open.
* **Accessible Popup & Form Control Patterns:** Proper use of `aria-haspopup`, `aria-expanded`, `aria-label`, `role="button"` on a non-button element (with matching keyboard handling), focus-visible outlines, and `Escape`-to-close support.
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
* **Not affiliated with JYP Entertainment, ITZY, or Midzy** — this is an unofficial fan project made for the YouTuber INO (@aceofgenz).
