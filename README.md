# iBOOK Games redesign

A runnable HTML/CSS/JavaScript website and matching Laravel integration, built
from the supplied Figma geometry, reference artwork, starter routes, and game
catalog. The original technology stack and all 60 game identifiers are preserved.
The same reusable renderer powers both versions.

## Run locally

Use Node.js 20 or newer. No npm installation or package download is required.
From this folder:

```text
node server.mjs
```

Open [the local website](http://127.0.0.1:4173/). Stop the server with Ctrl+C.
By default the server binds only to `127.0.0.1`; set `PORT` to select another
port. On Windows, `START.cmd` runs the same local server.

To preview on a phone or another computer on the same local network, run
`START-LAN.cmd`. The equivalent PowerShell commands are:

```powershell
$env:IBOOK_HOST = '0.0.0.0'
node server.mjs
```

On the other device, open `http://<PC-IP>:4173/`, replacing `<PC-IP>` with this
computer's Wi-Fi or Ethernet address. Both devices must use the same network.
`127.0.0.1` always refers to the device opening the page, so use the computer's
LAN address on the phone. `0.0.0.0` is the listening setting, not the URL to open.

```text
node scripts/build.mjs
node scripts/verify.mjs
```

The build regenerates 69 HTML routes and the browser catalog, creates `dist/`,
and synchronizes the shared assets into `laravel-blade/public/ibook-assets/`.
Run it after editing source assets or metadata. The verification script runs
catalog, asset, route, and HTTP checks using its own temporary server.
The final build passed, and automated verification passed **2,374 checks**,
including all 60 active enhanced covers, their native dimensions, unchanged
original-cover hashes, and enhanced-image HTTP content types.
See [TESTING.md](TESTING.md) for verification scope and limitations, and
[RESPONSIVE-QA.md](RESPONSIVE-QA.md) for the current fluid-layout browser results
and screenshots. [ARTWORK-QA.md](ARTWORK-QA.md) records image provenance, native
dimensions, transparency checks, and prompt registries. [QA-REPORT.md](QA-REPORT.md) records the initial implementation;
its fixed-frame measurements are historical and do not describe the current
responsive dimensions.

## Implemented

- Homepage with reference-based high-resolution space artwork, subject tiles, eight featured
  games, schools banner, and footer.
- A 60-game catalog with title/subject search, multiple subject filters, sorting,
  grid/list views, and eight pages of up to eight games.
- All 60 individual detail URLs, related games, persistent browser-local
  favorites, a copy-link dialog with optional native sharing, and a connected-player hook.
- Subjects, Grades, For Schools, About, Contact, Log In, and Favorites pages:
  **69 HTML routes** in total.
- English/Arabic shared interface translation, persisted language preference,
  RTL layout, and local Arabic font. The supplied game titles remain unchanged.
- Responsive desktop, tablet, and mobile layouts; mobile menus, filter drawer,
  and bottom navigation; keyboard focus treatment and reduced-motion support.
- Lightweight decorative floating/twinkling motion, button feedback, card lift
  and image zoom, dropdown transitions, and scroll entrances. No autoplay audio.

Search, filters, sorting, favorites, sharing, and language switching work without
a backend. Grade and age controls explain that verified mapping data is absent.
The login page links to real authentication only when configured; it does not
create a fake session. Contact prepares a draft in the visitor's email app and
does not send or store messages. Its recipient must be supplied through
`IBOOK_CONFIG.contactEmail`, or entered by the visitor in the email app.

## Responsive dimensions

The outer page fills the browser width. Content uses fluid side gutters and an
inner width of up to **1320px**, so desktop pages no longer sit inside a fixed
1000px or 1440px presentation frame. Typography, spacing, buttons, and artwork
scale within readable minimum and maximum sizes rather than shrinking the whole
page as one image.

- Phone layouts apply below 600px, including the bottom navigation.
- Tablet layouts apply from 600px to below 900px. Short tablet/browser panels
  also use a shorter hero, leaving more content visible.
- The common header switches to its menu below 1152px so navigation stays usable
  when a desktop browser is resized or a side panel is open.
- Catalog filters become a drawer below 1024px.
- Catalog card columns follow the width of the results area: four on wide
  containers, three at 780px or less, and two at 580px or less. This also adapts
  when the sidebar consumes space. List view becomes one column in the smaller
  results container.
- Supporting subject/feature grids, grade tiles, forms, login, and the footer
  use their available space independently. English and Arabic use the same
  dimension rules with the appropriate text direction.

## Design and artwork provenance

The local `.fig` archive was decoded into **573 nodes**, recovering frame sizes,
type styles, colors, transforms, and image crops. It contains a single
**1536 × 1024 composite screenshot**, rather than separate high-resolution
illustration sources. Its **54 exact image-fill crops** remain in `assets/design/`
as design provenance and fallbacks, with measurements and source coordinates
recorded in [DESIGN-AUDIT.md](DESIGN-AUDIT.md) and the design asset manifest.

All **60 supplied 760 × 475 WebP cover files** remain byte-identical to the
provided ZIP and keep their original slugs. All 60 games also have separate
native high-resolution artwork, selected through
[`artwork.json`](html-preview/assets/artwork.json) and applied consistently to
cards and game-detail posters. Its 60 `coverOverrides` point to 56 files in
[`quality/covers/`](html-preview/assets/quality/covers/) and four files in
[`quality/featured/`](html-preview/assets/quality/featured/): Pizza Pandas,
Turtle Dash, Spelling Bees, and Typing Jets.

Game illustrations were generated at **1585–1586 × 992 pixels**, then encoded
for the website as **WebP quality 95 at the same dimensions**. Encoding does
not resize the artwork. Native PNGs and pixel-identical lossless WebP masters
are retained outside the public repository. Prompt registries preserve their
portable basenames and provenance; the published artwork is available in the
linked asset folders. Served game WebPs use a separate lossy
encoding, so pixel-identity checks apply to the masters rather than the served
files. [`web-encoding.json`](html-preview/assets/quality/web-encoding.json)
records the final encoding settings, dimensions, and file sizes.
The 60 native lossless game masters total **112,985,212 bytes**; their website
encodings total **27,192,428 bytes**, a **75.9% reduction** at unchanged
resolution. All 60 enhanced covers are active in the completed override map.

The interface uses four native high-resolution scene illustrations: desktop
hero, mobile hero, catalog banner, and school banner. Six glossy subject icons
use genuine RGBA transparency. These images were produced with the built-in
image-generation tool using the supplied artwork as references, then encoded as
lossless WebP without resizing. These interface scenes and six subject icons
are unchanged by the game-cover encoding pass. The brand mark and small
interface icons use crisp SVG assets. Native dimensions, alpha checks, and
links to every prompt registry are in [ARTWORK-QA.md](ARTWORK-QA.md). Artwork
outputs and their provenance records are in
[`html-preview/assets/quality/`](html-preview/assets/quality/).

Generated artwork follows the supplied characters and themes but is a
reconstruction rather than a recovery of original high-resolution source
layers. No independent articulated astronaut layers or game runtimes were
supplied. A game poster is artwork, not a playable engine. See
[DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) for design measurements and tokens; browser
visual verification is separate from image-format and provenance checks.

## Laravel integration

The archive contains a drop-in Laravel 10–13 integration, not a complete Laravel
application. Merge the supplied folders into the existing host, require its
route file, and open `/ibook-preview`. Original named preview routes remain
intact; favorites is an additional route. The controller supplies catalog and
route data safely to the same front-end renderer.

Follow [Laravel installation and integration](laravel-blade/INTEGRATION.md).
Use `config/ibook_ui.php` for the existing authentication route and approved
contact mailbox. Adapt `IbookGamesController::catalog()` to real database
records when the host is available. Unknown game slugs return 404.

## Missing source integrations

**None of the 60 original game engines or verified player URLs was supplied.**
Play buttons explain the missing player until an approved `play_url` is added.
The integration accepts HTTPS players or same-origin public game paths and
launches them only after the visitor presses Play.

The package also lacks the original authentication backend, school services,
database, verified grade/age mappings, game instructions, learning objectives,
and verified curriculum classifications. The starter's subject assignments
are provisional, and the UI identifies that limitation. These cannot be
recovered from the covers or illustrated gameplay scene.

Complete [game-integration-mapping.csv](game-integration-mapping.csv) from the
actual game records before enabling grade/age recommendations or publishing
curriculum claims. Connect the real host authentication rather than adding
demo credentials. PHP/Composer and a Laravel application are required for
Laravel runtime tests; front-end checks do not validate those absent services.

## Main source files

| File | Purpose |
| --- | --- |
| [html-preview/assets/app.js](html-preview/assets/app.js) | Shared page renderer, English/Arabic UI, navigation and interactions |
| [html-preview/assets/styles.css](html-preview/assets/styles.css) | Shared visual components, artwork treatment, colors and motion |
| [html-preview/assets/responsive.css](html-preview/assets/responsive.css) | Fluid shell, header, hero, catalog/detail dimensions and container-dependent card columns |
| [html-preview/assets/responsive-secondary.css](html-preview/assets/responsive-secondary.css) | Responsive supporting pages, forms, subject/grade grids and footer |
| [html-preview/assets/artwork.css](html-preview/assets/artwork.css) | High-resolution scene treatment and transparent artwork presentation |
| [html-preview/assets/artwork.json](html-preview/assets/artwork.json) | Active interface assets and slug-based high-resolution game-cover overrides |
| [html-preview/assets/catalog-core.js](html-preview/assets/catalog-core.js) | Pure search, filter, sorting and pagination logic |
| [html-preview/assets/games.json](html-preview/assets/games.json) | Preserved 60-game source catalog |
| [html-preview/assets/design/asset-manifest.json](html-preview/assets/design/asset-manifest.json) | Exact Figma image-fill crops and source coordinates |
| [html-preview/assets/design/figma-measurements.json](html-preview/assets/design/figma-measurements.json) | Decoded node geometry and styles |
| [scripts/build.mjs](scripts/build.mjs) | HTML generation, static distribution and Laravel asset sync |
| [scripts/verify.mjs](scripts/verify.mjs) | Automated catalog, asset, route and server verification |
| [server.mjs](server.mjs) | Dependency-free local static server |
| [START.cmd](START.cmd), [START-LAN.cmd](START-LAN.cmd) | Windows startup for local-only or same-network previews |
| [laravel-blade/app/Http/Controllers/IbookGamesController.php](laravel-blade/app/Http/Controllers/IbookGamesController.php) | Host catalog, route and player integration |
| [laravel-blade/resources/views/ibook/layouts/app.blade.php](laravel-blade/resources/views/ibook/layouts/app.blade.php) | Shared renderer Blade shell |

Edit these source files rather than generated HTML. `dist/` is the static
deployment output; the Laravel host uses its synchronized public assets.
