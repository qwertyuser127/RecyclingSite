# Smart Recycling — Multi-Page Site

A student project site: recycling education, an AI chat assistant, a mini-game,
a branching story, and a quiz — split across separate pages and sharing one
design system.

## Pages
- `index.html` — home: hero, the problem, top 15 problems, impact, **Eco Catch** game
- `about.html` — about the project
- `solution.html` — the three-part solution
- `chatbot.html` — EcoMind-01, the AI recycling assistant
- `story.html` — Recylo's branching story (by Matteo)
- `quiz.html` — dedicated quiz page (Wayground embed, by Matias)
- `gallery.html` — image gallery
- `team.html` — team credits
- `contact.html` — email + WhatsApp
- `settings.html` — language / theme / font size / high contrast

## Shared code
- `css/style.css` — all styles (glass UI, blobs, dark mode, game, story, etc.)
- `js/common.js` — builds the header/footer/loader/settings modal on every page,
  and handles theme, language, font size, contrast, scroll reveal, back-to-top
- `js/chatbot.js` — EcoMind-01 logic (only runs on `chatbot.html`)
- `js/story.js` — the branching story engine (only runs on `story.html`)
- `js/game.js` — Eco Catch game logic (only runs on `index.html`)

## Things to plug in with your own content

**Quiz embed** — already live in `quiz.html` using Matias's real Wayground quiz
(`https://wayground.com/embed/quiz/69f0e328c832ec2a2d1c49d8`). If the quiz is
ever swapped for a new one, replace that iframe `src` with the new "Share →
Embed" link from Wayground.

**WhatsApp number** — already set to `+356 7935 0315` in `contact.html`
(as `https://wa.me/35679350315`). Update the digits in that link if the number
changes; `wa.me` links use the number with no spaces, `+`, or leading zeros.

**Gallery photos** — `gallery.html` currently uses simple local SVG
illustrations in `images/gallery-1.svg` … `gallery-4.svg` instead of the
original external stock photos (no external requests needed). Drop real
photos into `images/` and update the `src` attributes in `gallery.html` to
swap them in.

**Sounds** — `sounds/` contains small generated `.wav` effects (`catch`,
`miss`, `gameover`, `levelup`, `click`) so Eco Catch has working audio out of
the box. Swap in your own `.mp3`/`.wav` files with the same names if you'd
like different sounds — `js/game.js` already has the hooks wired up and fails
silently if a file is missing.

**Icons** — `icons/` has simple hand-built SVGs (logo, favicon, bin, tips, ai,
whatsapp) so nothing depends on external icon CDNs.

## Notes
- All pages share one header/nav/footer/settings panel, injected by
  `js/common.js` — edit that file once and it updates everywhere.
- Dark mode, language, font size, and high-contrast preferences are saved in
  the browser (`localStorage`) and persist across pages and visits.
- Eco Catch achievements are also saved locally per-browser.
