# Portfolio — Huynh Thien An Nguyen

A one-page portfolio for a freelance content creator, built as plain HTML, CSS, and JavaScript.
No build step, no framework, no dependencies — open `index.html` and it runs.

The design language is **"Editorial Index"**: a paper-and-ink palette, one display serif
(Fraunces), one reading serif (Newsreader), one mono for labels (IBM Plex Mono), hairline rules
instead of drop shadows, and a numbered chapter structure you can jump through.

## Content source

Every claim on the page is taken from **`An_Nguyen_Freelance_Content_Creator_Resume_Professional_A4.pdf`**
(Anaheim, CA · freelance content creator — writing, editing & web design):

| Resume section | On the page |
| --- | --- |
| Professional profile | Chapter 01 · Profile |
| Core capabilities (4 areas) | Chapter 02 · Capabilities |
| Independent website & publishing projects | Chapter 03 · Website Work (13 concepts, 4 live) |
| Relevant experience | Chapter 04 · Experience |
| Project workflow (clarify / create / refine) | Chapter 05 · Process |
| Selected published writing | Chapter 06 · Selected Writing |
| Social content concept — TheLoneChair | Chapter 07 · Social Concept |
| Long-form publishing (the book) | Chapter 08 · Long-form Publishing |
| — (kept from the earlier site) | Chapter 09 · Research preprints |
| Education & languages | Chapter 10 · Background |
| Contact details | Chapter 11 · Contact |

The resume's own disclaimers are preserved verbatim in spirit: the four websites are labelled
**independent concepts, not paid-client work or business endorsement**, and the preprints are
labelled **preprint / not peer-reviewed**.

## What changed from the previous version

- The old hero statistics ("3+ years experience", "100% client satisfaction", "50+ projects") were
  replaced by figures the resume actually supports: 13 website concepts, 4 live, publishing since
  2024, 2 working languages.
- The Fiverr experience, education, and preprints were kept, but re-labelled so nothing reads as
  client work that was not client work.
- The generic timeline / card / progress-bar layout was replaced by a chapter-and-ledger layout.
- Font Awesome and the old colour system were dropped; icons are now typographic.

## Design system

- **Type**: Fraunces (display, variable), Newsreader (body), IBM Plex Mono (labels, figures).
- **Colour**: `--paper` / `--ink` / `--accent` (vermilion) with a full dark variant that flips
  `--invert-*`, so the two inverted chapters (Social Concept, Contact) invert again in dark mode.
- **Layout**: fixed vertical spine on ≥1180px, full-screen index overlay, numbered chapters,
  marginalia column, hairline rules, a 13-cell figure block for the "13 concepts / 4 live" claim.
- **Components**: `.chapter`, `.specimen`, `.capability-grid`, `.ledger`, `.counter`, `.work-row`,
  `.writing-row`, `.research-row`, `.bg-table`, `.note`, `.toast`.

## Behaviour (`script.js`)

- Colour mode: follows `prefers-color-scheme` on first visit, remembers the choice in
  `localStorage` under `theme`.
- Index overlay: opens from the top bar, closes on Escape / link click, locks body scroll, returns
  focus to the button.
- Scroll-spy: the spine shows the current chapter (`№ 06 · Selected Writing`).
- Reading-progress bar, sticky top-bar rule, and reveal-on-scroll (`prefers-reduced-motion` is
  respected).
- Contact form: validates name / email / project type / brief, marks `aria-invalid`, then opens the
  visitor's mail app with a pre-filled `mailto:` to `annguyen030205@gmail.com`. Nothing is stored
  or sent anywhere else — there is no backend.

## Files

```
index.html   # all content, one page, 11 numbered chapters
styles.css   # the design system (tokens → components → responsive → print)
script.js    # theme, index overlay, scroll-spy, reveal, form
Untitled design (3).jpg   # book cover
```

## Run and deploy

```bash
# any static server, e.g.
python -m http.server 4321 --bind 127.0.0.1
```

Static hosting works as-is: GitHub Pages, Netlify, Cloudflare Pages, Vercel. There is no build
step, so publishing means uploading this folder.

## Known placeholders

- The three article titles link to the Medium archive (`medium.com/@nguyenan04102004`) rather than
  to individual posts, because the resume lists only the archive URL. Replace with the per-article
  URLs when they are handy.
- The footer note records that two third-party editorial templates were used as *visual references
  only*, and that the travel sample carries third-party attribution to be verified before
  commercial use.
- The page ends with a print stylesheet, so `Cmd/Ctrl + P` produces a clean paper-shaped version.
