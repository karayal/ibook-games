# Responsive layout verification

The page now fills its available browser width, with fluid gutters and a content
limit of 1320px. Text and controls use readable bounded sizes. The former fixed
mockup frame and page-specific miniature desktop navigation were removed.

## Browser coverage

The responsive pass exercised 97 English/Arabic page-and-width combinations:

| Page | Viewport widths in CSS pixels |
| --- | --- |
| Home | 320, 375, 390, 430, 480, 599, 600, 714, 760, 761, 899, 900, 1023, 1024, 1151, 1152, 1300, 1301, 1440, 1920, 2560 |
| Catalog | 320, 390, 599, 600, 714, 760, 761, 900, 1023, 1024, 1152, 1440, 1920, 2560 |
| Detail | 320, 390, 599, 600, 714, 760, 761, 899, 900, 1024, 1440, 1920, 2560 |
| Arabic home/catalog/detail | Each at 320, 390, 714, 1024, 1152, 1440, 1920 |
| Subjects, Grades, Schools, About, Contact, Log In, Favorites | Each at 320, 714, 1152, 1920 |

No horizontal document overflow or clipped checked button, card-title, subject,
navigation, hero-heading or hero-description text was found. Home calls to action
stayed inside the hero. Catalog cards measured about 219px before the 1024px
sidebar transition and 218px after it, avoiding the old dimension jump.

The filter drawer was opened at tablet width and resized to desktop: the drawer
closed, background `inert` state cleared and body scrolling unlocked. The resize
handler also restores focus to search when the mobile opener becomes hidden.
The Arabic desktop navigation fits at the 1152px transition.

After integrating the high-resolution interface art and six transparent subject
icons, the homepage was checked again at 320, 390, 600, 714, 900, 1024, 1152, 1440
and 1920px. All nine checks found no overflow, no clipped checked text and no
broken images. Raw results: [qa/responsive-home-current.json](qa/responsive-home-current.json).

After all 60 enhanced covers were connected, the browser traversed all eight
catalog pages at 390px: 60 unique game slugs, all 60 images loaded at native
1585–1586 × 992 resolution, and no document overflow. Raw results:
[qa/browser-artwork-current.json](qa/browser-artwork-current.json).

The Sky Chase detail poster and related cards were checked again at 320, 390,
714, 1024, 1440 and 1920px; the 714px check also used a short 615px-high pane.
All six checks found no clipped checked text, broken images or horizontal
overflow. The main poster retained its 1586 × 992 image source. Raw results:
[qa/detail-artwork-current.json](qa/detail-artwork-current.json).
Arabic switching was checked at 390px and restored to English. The tablet
filter drawer was also resized to desktop: focus returned to search, all
background `inert` attributes cleared, and body scrolling unlocked.

Final browser captures:

- [Desktop homepage](qa/homepage-desktop-current.jpg), 1440px viewport, full page.
- [Phone homepage](qa/homepage-mobile-current.jpg), 390 × 844px viewport.
- [Phone full-page review](qa/homepage-mobile-full-current.jpg), 390px viewport.
- [Desktop catalog](qa/catalog-desktop-current.jpg), 1440px viewport, full page.

The fixed phone navigation appears at the original viewport bottom within a
full-page screenshot; the viewport capture shows its normal on-screen position.
All 60 generated covers were also visually reviewed in
`qa/cover-sheet-01-current.jpg` through `qa/cover-sheet-04-current.jpg`.

## Layout decisions

- Phone composition and fixed bottom navigation below 600px.
- Tablet composition from 600px to below 900px; compact hero in short panes.
- Header menu below 1152px; catalog filter drawer below 1024px.
- Catalog columns follow their result container: four above 780px, three at
  580–780px and two at 580px or less.
- Subjects, grades, forms, login, footer and detail panels adapt independently.
- Range media queries include fractional CSS widths from Windows/browser zoom.
- Decorative motion respects `prefers-reduced-motion`; no autoplay audio.

These browser checks establish fit and interaction behavior, not exact pixel
identity with the supplied composite. The reference has a framed presentation;
the current page intentionally adapts to a real browser as requested. Original
reference measurements remain in [DESIGN-AUDIT.md](DESIGN-AUDIT.md). Artwork
resolution, source limits and replacements are documented in [ARTWORK-QA.md](ARTWORK-QA.md).

Historical screenshots in `qa/homepage-desktop.jpg`, `qa/homepage-mobile.jpg`,
`qa/catalog-*.jpg` and `qa/detail-*.jpg` predate the fluid-layout/artwork updates.
Files with `current` in the name record the latest capture pass.
