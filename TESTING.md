# Run and verify

Node.js 20 or newer is the only requirement for the standalone HTML website. No package download is required. The delivery includes generated HTML; rebuild after editing the game metadata or page shell generator:

```text
node scripts/build.mjs
```

This writes the 69 HTML shells and browser catalog, creates the deployment-ready
`dist/` directory, and copies shared artwork, fonts, CSS and JavaScript into the
Laravel public assets directory. Edit these source files; generated HTML is
overwritten on build:

- `html-preview/assets/app.js`: reusable pages, catalog interaction and language behavior.
- `html-preview/assets/styles.css`: visual components, artwork, colors and motion.
- `html-preview/assets/responsive.css`: fluid dimensions, shared navigation, hero, catalog/detail layouts and container queries.
- `html-preview/assets/responsive-secondary.css`: supporting pages, subject/grade grids, forms and footer.
- `html-preview/assets/artwork.css`: high-resolution scene and transparent-icon presentation.
- `html-preview/assets/artwork.json`: active interface assets and game-cover overrides.
- `html-preview/assets/games.json` and `scripts/build.mjs`: preserved catalog data and HTML generation.

Stylesheets load as `styles.css` → `responsive.css` →
`responsive-secondary.css` → `artwork.css`.

From this directory run:

```text
node server.mjs
```

Open `http://127.0.0.1:4173/`. The server preserves the supplied `.html` URLs and
serves the catalog at `/games/` or `/games/index.html`. Set `PORT` to use another
port. Stop with Ctrl+C. With `IBOOK_HOST` unset, the server binds only to
`127.0.0.1`. It does not implement authentication, form submissions or game engines.

## Same-network phone testing

Use `START-LAN.cmd` on Windows, or set `IBOOK_HOST=0.0.0.0` before starting Node:

```powershell
$env:IBOOK_HOST = '0.0.0.0'
node server.mjs
```

Connect the phone and computer to the same local network. On the phone open
`http://<PC-IP>:4173/`, using the computer's actual Wi-Fi/Ethernet IPv4 address.
Do not use `127.0.0.1` on the phone; that points to the phone itself.
`START.cmd` is the ordinary local-only launcher when no host override is set.

## Automated verification

Run automated verification from a separate terminal:

```text
node scripts/verify.mjs
```

The script starts and stops its own temporary localhost server. Network permission must allow Node.js to connect to localhost. It checks:

- All 69 registered pages, including 60 individual game routes and favorites.
- Unique titles, IDs, slugs, cover mapping and valid WebP signatures for all 60 games.
- The integration worksheet and supplied original thumbnail references.
- Browser catalog data matching its JSON source, script dependency order, page identities, JavaScript fallbacks and all dynamically constructed artwork URLs.
- Search trimming and case handling, subject search, combined filters, multiple subjects, Math grouping, empty results, ascending and descending sort, stable source order, page limits and favorites.
- Local HTML, stylesheet and module references.
- HTTP success for every page, correct HTML MIME type, representative asset and HEAD requests, directory redirects, missing pages, write rejection and traversal protection.

The final build passed, and automated verification passed **2,374 checks**
after all 60 enhanced covers were mapped, encoded, and synchronized. This
includes native dimensions and landscape ratios for all 60 enhanced covers,
SHA-256 identity for all 60 supplied originals, and successful enhanced-image
HTTP responses with the correct content types. Check JavaScript syntax with
`node --check html-preview/assets/app.js` after code changes. The automated
checks use a temporary server and do not stop or reconfigure the running
preview server.

## Artwork provenance and transparency

All 60 original cover files under `assets/covers/` are retained unchanged and
were compared byte-for-byte with the supplied cover ZIP: 60 matches, each
760 × 475 pixels. Active enhanced covers are separate files resolved by
`artwork.json`, so changing their presentation does not overwrite the source
collection. The final override mapping has 60 entries: 56 under
[`quality/covers/`](html-preview/assets/quality/covers/) and four under
[`quality/featured/`](html-preview/assets/quality/featured/). The same resolved
cover is used for cards and game-detail posters.

The interface has six native transparent glossy subject WebPs and four native
high-resolution scene WebPs. SVG logos and small interface icons remain crisp
at different display sizes. The 54 original Figma crops remain available for
provenance/fallback use. Inspect [ARTWORK-QA.md](ARTWORK-QA.md) for native
dimensions, alpha values, and links to all interface, subject, featured, and
catalog prompt registries. The source artwork output folder is
[`html-preview/assets/quality/`](html-preview/assets/quality/).

Native game PNGs and lossless WebP masters were checked for exact decoded RGBA
pixel identity. Masters are retained outside the public repository, with
portable basenames recorded in the prompt registries. The website
serves game covers encoded separately at **WebP quality 95**, at the same
native **1585–1586 × 992 dimensions**. No resizing or resampling occurs during
encoding. Because these served game files are lossy, native pixel-identity
checks do not apply to them. Verify their settings, dimensions, and sizes
against [`web-encoding.json`](html-preview/assets/quality/web-encoding.json).
The final 60-cover encoding set totals **27,192,428 bytes**, compared with
**112,985,212 bytes** for the native lossless masters, a **75.9% reduction**
at unchanged resolution. All 60 enhanced covers are active.
Interface scenes and six transparent subjects remain lossless and unchanged.

Image-file checks do not establish that the final browser crop, blending, or
responsive placement is correct. A separate screenshot pass is required after
the artwork integration; no such new screenshot verification is claimed by
this asset documentation.

## Responsive browser checks

The full-width shell uses fluid gutters with content up to 1320px. Check narrow
embedded browser panes as well as full desktop windows; the page should adapt
to the available width without clipping or tiny controls. Relevant transitions
are:

| Width/space | Expected behavior |
| --- | --- |
| Below 600px | Phone composition and fixed bottom navigation |
| 600px to below 900px | Tablet composition; shorter hero when viewport height is 650px or less |
| Below 1152px | Shared desktop navigation becomes a menu |
| Below 1024px | Catalog sidebar becomes an accessible filter drawer |
| Results container above 780px | Four catalog columns |
| Results container 580–780px | Three catalog columns |
| Results container 580px or less | Two catalog columns; list view uses one column |

The exact 580px boundary uses the smaller layout. Card columns use the results
container width rather than only the browser width, so account for sidebar and
gutter space. Supporting pages adapt their grids and readable text/form widths
independently. Repeat checks in Arabic/RTL and at fractional CSS widths produced
by browser zoom.

These checks do not replace visual browser review. Browser QA must separately cover the desktop and mobile homepage, catalog, detail page, menu, favorites persistence, sharing, RTL switching, keyboard focus, reduced motion and overflow. Screenshot comparison is required for visual fidelity. The Laravel files need PHP, Composer and an actual Laravel host application to execute framework-level tests.
