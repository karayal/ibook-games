# Artwork provenance and file checks

This report covers filesystem provenance, native image dimensions, transparency,
and encoding. Browser screenshot verification after artwork integration is a
separate check and is not claimed here. The current hero artwork is retained;
this documentation pass does not change it.

## Source cover collection and enhancements

All **60 original WebP covers** under `html-preview/assets/covers/` were compared
byte-for-byte with `iBOOK-Games-60-Cover-Assets.zip`: **60 matches**, no mismatches.
Every original is **760 × 475 pixels**. Slugs and source files remain unchanged.

All 60 enhanced game images are saved separately, and
[`artwork.json`](html-preview/assets/artwork.json) selects them through
60 `coverOverrides`. Cards and detail posters use the same resolved file for a
given slug: 56 covers under
[`quality/covers/`](html-preview/assets/quality/covers/) and four under
[`quality/featured/`](html-preview/assets/quality/featured/).

The four initially enhanced featured covers are RGB, native **1586 × 992 pixels**:

- `quality/featured/pizza-pandas.webp`
- `quality/featured/turtle-dash.webp`
- `quality/featured/spelling-bees.webp`
- `quality/featured/typing-jets.webp`

The remaining catalog covers are native **1585–1586 × 992 pixels**. Each batch
records its actual native dimensions, references, prompts, output paths, and QC
in the linked registries below. Generated artwork follows the supplied identity
and theme; it is a reconstruction, not a recovered original source layer or an
actual game runtime.

## Native masters and website encoding

The built-in image-generation tool produced the native PNGs. Lossless WebP
masters were decoded and compared with their corresponding PNGs: dimensions
and RGBA pixels matched exactly. This validates the lossless conversion rather
than proving visual fidelity to a reference. Source and generated artwork were
also inspected visually for subject identity, clean composition, and removal
of poster titles, badges, borders, and generic circular thumbnail templates.

Native PNGs and lossless game WebP masters are retained outside the public
repository. Registries preserve portable master basenames and provenance;
references to published source assets use repository-relative paths rather
than local machine paths. The website serves separate game-cover
WebPs encoded at **quality 95 without resizing**, preserving the native
1585–1586 × 992 resolution while reducing transfer size. These served files
are lossy and are not asserted to be pixel-identical to the PNGs.

[`web-encoding.json`](html-preview/assets/quality/web-encoding.json) records
the final per-file encoder settings, dimensions, and sizes. The source output
asset folder is [`html-preview/assets/quality/`](html-preview/assets/quality/).
Across all 60 active enhanced game covers, native lossless masters total
**112,985,212 bytes** and served WebPs total **27,192,428 bytes**: a **75.9%
reduction** with unchanged resolution.
The interface scenes and six transparent subject icons retain their lossless
encodings and are unchanged by this game-cover pass.

## Interface scenes

The four high-resolution interface scenes were produced through the built-in
image-generation tool using supplied visual references. Native PNG pixels were
encoded as lossless WebP without resizing or resampling. The scene files are
opaque RGB artwork; transparent backgrounds are not intended for these scenes.

| Asset under `assets/quality/` | Native dimensions | Mode |
| --- | --- | --- |
| `hero-desktop.webp` | 1983 × 793 | RGB |
| `hero-mobile.webp` | 2172 × 724 | RGB |
| `catalog-banner.webp` | 2172 × 724 | RGB |
| `school-banner.webp` | 1983 × 793 | RGB |

HTML remains responsible for the real headings, navigation, and buttons. Small
reference markings such as the school sign are part of the illustrations.

## Transparent subject icons

All six glossy subject WebPs have real **RGBA alpha**, an alpha range of
**0–255**, and preserved native image dimensions. Lossless encoding preserves
their alpha; no opaque enclosing tile or checkerboard backdrop is introduced.

| Asset under `assets/quality/subjects/` | Native dimensions | Corner alpha (TL, TR, BL, BR) |
| --- | --- | --- |
| `subject-calculator.webp` | 1254 × 1254 | 0, 0, 1, 0 |
| `subject-multiply.webp` | 1254 × 1254 | 0, 0, 0, 0 |
| `subject-divide.webp` | 1254 × 1254 | 0, 0, 0, 0 |
| `subject-fraction.webp` | 1254 × 1254 | 0, 0, 0, 0 |
| `subject-spelling.webp` | 1254 × 1254 | 0, 0, 0, 0 |
| `subject-typing.webp` | 1774 × 887 | 0, 0, 0, 0 |

The calculator's one corner at alpha 1/255 is effectively transparent; native
pixels were preserved rather than altered to meet an invisible threshold.
Typing is a naturally wide keyboard illustration and uses CSS `object-fit`
within its tile rather than being stretched into a square.

## Vectors and original Figma assets

`quality/brand/nav-logo.svg` and `hero-logo.svg` provide crisp scalable brand
marks. `quality/icons/` contains scalable controller, school, plus, and subject
fallback icons. See the
[`vector manifest`](html-preview/assets/quality/vector-manifest.json) for their
view boxes and construction notes.

The original `.fig` was decoded into 573 nodes and contained one 1536 × 1024
composite raster. Its 54 exact image-fill crops and measurement data remain in
`assets/design/` for provenance and fallback use. They are not independent
high-resolution character layers.

## Prompt registries

Paths below are relative to `html-preview/assets/quality/`:

| Registry | Assets |
| --- | --- |
| [`prompts-interface.json`](html-preview/assets/quality/prompts-interface.json) | Desktop/mobile hero, catalog banner, school banner |
| [`prompts-subjects-a.jsonl`](html-preview/assets/quality/prompts-subjects-a.jsonl) | Calculator and multiplication |
| [`prompts-subjects-b.jsonl`](html-preview/assets/quality/prompts-subjects-b.jsonl) | Division and fractions |
| [`prompts-subjects-c.jsonl`](html-preview/assets/quality/prompts-subjects-c.jsonl) | Spelling and typing |
| [`prompts-featured-a.jsonl`](html-preview/assets/quality/prompts-featured-a.jsonl) | Pizza Pandas and Turtle Dash |
| [`prompts-featured-b.jsonl`](html-preview/assets/quality/prompts-featured-b.jsonl) | Spelling Bees and Typing Jets |
| [`prompts-catalog-a.jsonl`](html-preview/assets/quality/prompts-catalog-a.jsonl) | Catalog enhancement batch A |
| [`prompts-catalog-b.jsonl`](html-preview/assets/quality/prompts-catalog-b.jsonl) | Catalog enhancement batch B |
| [`prompts-catalog-c.jsonl`](html-preview/assets/quality/prompts-catalog-c.jsonl) | Catalog enhancement batch C |
| [`prompts-catalog-d.jsonl`](html-preview/assets/quality/prompts-catalog-d.jsonl) | Catalog enhancement batch D |

Registry output paths and pixel-identity statements describe generation and
native lossless conversion. The encoding report describes the files served by
the final website. The final build passed, and automated verification passed
**2,374 checks**, including all 60 active overrides, native dimensions and
landscape ratios, all 60 original-cover SHA-256 matches, and enhanced-image
HTTP content types. These checks do not establish browser screenshot fidelity.
Image assets do not add game engines, educational metadata, authentication, or
unavailable backend functionality.
