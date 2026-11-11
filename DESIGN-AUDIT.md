# Supplied design audit

Inspected `Untitled.fig`, both screenshot references, both ZIP archives, and the embedded Figma image. The Figma archive is readable: its `canvas.fig` consists of a Kiwi schema plus Zstandard node payload. A local decoder recovered **573 nodes** and the exact frame geometry, typography, fills, and image transforms. No Figma network access was needed for this extraction.

## Source facts

- Desktop homepage frame: **1440 × 1699.07 px**.
- Mobile homepage frame: **390 × 1070.28 px**.
- Explore All Games frame: **1000 × 865.94 px**.
- Penguin Jump detail frame: **1000 × 914.86 px**.
- Typography: **Nunito**, Regular (400), Bold (700), ExtraBold (800), Black (900). The `.fig` contains font names and geometry; it does not contain the font binary. The official Nunito variable font is now bundled locally, together with Noto Sans Arabic for RTL text and both SIL Open Font License notices; no external font request is required at runtime.
- The `.fig` embeds only **one 1536 × 1024 raster image**: the same composite reference screenshot supplied separately. All illustration layers are cropped regions of this image. There are no high-resolution separate astronauts, planets, school illustrations, or transparent hero characters in the supplied design.
- The supplied cover ZIP has **60 distinct WebP files**. Its first 15 concept covers differ from the small game images shown in the main design. The other 45 are themed compositions using low-resolution source thumbnails. All source cover files remain available.
- The Figma catalog's `Browse and filter games` frame (node `2:242`) is orphaned beside the page frames, rather than parented to the catalog frame. Its dimensions and content clearly represent the catalog body. The supplied main reference screenshot shows the intended assembled position immediately below the catalog banner.
- Seven pasted briefs have identical SHA-256 hashes; they are duplicate copies of the same brief.

## Extracted files

`html-preview/assets/design/asset-manifest.json` records all **54 image-fill crops**, exact source coordinates, Figma sizes, and transforms. `figma-measurements.json` records all decoded node geometry and concise styles. The extracted PNGs reproduce the actual Figma image fills; they do not invent or regenerate supplied artwork.

`hero-plus.png` is an additional unmodified source screenshot crop at `(456,87)`, size70×69px, restoring the yellow dimensional plus sign from the supplied reference. At1440px layout scale it displays117.76×116.08px at hero-relative `(612.34,37.01)`. It is already rotated in the source image.

Useful assets:

| File prefix | Use | Original crop pixels |
| --- | --- | --- |
| `012` | Header logo | 70 × 42 |
| `023` | Astronaut children, cat, planet and rocket | 413 × 313 |
| `025` | Upper left purple clouds | 126 × 99 |
| `026` | Hero brand mark | 152 × 90 |
| `038`, `041`, `044`, `047`, `050`, `053` | Subject illustrations | ~36–46 × 32–41 |
| `060`, `069`, `078`, `087`, `096`, `105`, `114`, `123` | Eight featured card image crops from the approved design | ~162–170 × 91–101 |
| `131`, `132` | Schools banner building and small schoolhouse | 166 × 64; 60 × 53 |
| `237`, `238` | Catalog controller/rocket scene and yellow gamepad | 231 × 70; 49 × 48 |
| `444` | Penguin avatar | 31 × 28 |
| `458` | Penguin Jump illustrated player scene | 339 × 198 |
| `550` | Continuous lower purple landscape | 856 × 33 |
| `579` | Mobile illustration strip | 176 × 61 |

## Principal measurements

At the 1440 px desktop frame:

- Header height: **89.16 px**. Logo at `(104.30, 8.41)`, size `117.76 × 70.65`.
- Hero starts at `y89.16`; height **573.64**. Illustration right edge aligns with frame edge; size `694.77 × 526.54`, x`745.23`. Figma masks the left edge from transparent to opaque over the first **16%**.
- Hero mark: `(222.06,58.88)` relative to hero, `255.70 × 151.40`.
- Hero title: `(94.21,215.33)`, **67.29 px Nunito Black**. Supporting text: `(97.57,302.80)`, **26.92 px Regular**.
- Hero buttons: x`117.76` and `430.65`, y`366.73`; sizes `285.98 × 68.97` and `280.93 × 68.97`.
- Subject panel starts at `y614.02`, overlapping the hero by ~49 px; six tiles `178.32 × 131.21`, gap21.87, start x174.95.
- Popular section starts at `y857.94`. Grid starts x222.06, relative y99.25; four columns of `279.25 × 255.70`, horizontal gap20.19, row separation28.60. Featured image area `279.25 ×169.91`.
- Schools banner `(208.60,1508.97)`, size`1201.12 ×107.66`.
- Footer y`1630.09`, height68.97.

At the 390 px mobile frame (status bar included by Figma):

- Combined navigation/hero area height602.73. Status bar height53.18. Logo `(33.24,64.26)`, size137.39×73.13.
- Illustration strip starts y150.68, height135.17. Its top and bottom are softly masked.
- Title `(17.73,281.43)`, font42.10. Copy `(19.94,341.25)`, font25.48.
- Pink CTA `(44.32,425.45)`, size305.80×62.05. Grade CTA `(35.45,507.44)`, size319.09×62.05.
- Subjects panel y598.30, height181.70. Three tiles113.01×99.72, beginning x19.94, y66.48 inside panel.
- Popular section y780; featured compact card350.11×117.44 at x19.94,y64.26 inside panel.
- Bottom nav y981.65, height88.64. A real browser should not duplicate the illustrated phone status bar.

At the 1000 px catalog:

- Header59.78; banner126.81; body679.35.
- Sidebar195.65 wide; x14.49, body y16.30.
- Results group x235.51, width748.19. Four cards per row173.91×206.52, image115.94 high. Search y27.17; grid y125 inside body.

At the 1000 px detail:

- Content horizontal margins36.23. Heading y119.57; title36.23 px.
- Player `(36.23,184.78)`, size614.13×358.70; right metadata panel x675.72,width288.04.
- About panel y563.41,height97.83; how-to panel y456.52,height204.71.
- Related section `(36.23,684.78)`, width931.16; cards215.58×159.42.

## Color values from Figma

- Base page surface: approximately `#FCFAFF`.
- Desktop header: `#8810B5` → `#582196`.
- Hero: `#7B18BF` → `#6324BC` at43% → `#125ED1` at70% → `#00A6DF`.
- Pink controls: `#FF4BB2` → `#FA1597`.
- Yellow slogan highlight: `#FFE659`.
- Mobile hero: `#6B229C` → `#008DCD`.
- Catalog banner: `#7A21DD` → `#09C0F0`.
- Subject tile backgrounds: `#FDE8FB`, `#E7F6FF`, `#FFF3DA`, `#F3E9FF`, `#DDFBF6`, `#E1F5FF` (see precise node data).
- Subject tile radius25.23 at1440; typical featured card radius~25.23. Shadow color around `rgba(61,13,102,.15)`, offset`0 5.05`, blur10.09.

## Fidelity boundaries

High-resolution transparent illustrations, separate astronaut character layers, and original Figma font binaries were not supplied. Hero character motion must remain a gentle composite movement or use separate decorative CSS elements; individual body-part animation would require new source layers. The PNG crops preserve the approved artwork, but enlargement exposes the resolution of the original composite screenshot. The visible Penguin gameplay scene is illustrative artwork, not an included game runtime.

## Centered desktop interpretation

The main screenshot is a composite with a phone overlay covering its left side. The Figma reconstruction preserves that compositing offset in the desktop content. For an actual full-width website, centering the existing Figma card geometry removes the composite bias without changing the cards: popular grid width1177.57 gives x131.21 at1440; subject group width1179.25 gives x130.38; schools width1201.12 gives x119.44. A common centered1200px content container gives nearly identical geometry. The hero character crop remains anchored to the right edge, as specified by Figma.
