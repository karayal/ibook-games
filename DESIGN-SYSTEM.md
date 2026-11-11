# iBOOK Games design system

Implementation values follow the decoded Figma frames and supplied reference
artwork. [DESIGN-AUDIT.md](DESIGN-AUDIT.md) records detailed node measurements,
source crops, and the limits of the supplied assets.

## Color and typography

| Token or component | Value |
| --- | --- |
| Brand purple / deep purple | `#5711AC` / `#340475` |
| Pink / cyan | `#FF299A` / `#13B7E9` |
| Text / page surface / outer background | `#20103F` / `#FCFAFF` / `#F1EDF9` |
| Header gradient | `#8810B5` → `#582196` |
| Hero gradient | `#7B18BF` → `#6324BC` at 43% → `#125ED1` at 70% → `#00A6DF` |
| Primary button gradient | `#FF4BB2` → `#FA1597` |
| Slogan highlight | `#FFE659` |
| Subject surfaces | `#FDE8FB`, `#E7F6FF`, `#FFF3DA`, `#F3E9FF`, `#DDFBF6`, `#E1F5FF` |
| Shared shadow | `0 5px 11px #3D0D6620` |
| Motion easing | `cubic-bezier(.22,.75,.25,1)` |

Nunito is bundled locally at weights 200–1000. The Figma uses Regular 400,
Bold 700, ExtraBold 800, and Black 900. Noto Sans Arabic is bundled for Arabic
text, with weights 100–900. Both font license notices are included. Runtime
font delivery does not depend on a third-party request.

## Reference frames

| Figma frame | Dimensions |
| --- | --- |
| Desktop homepage | `1440 × 1699.07px` |
| Mobile homepage | `390 × 1070.28px`, including illustrated status area |
| Desktop catalog | `1000 × 865.94px` |
| Desktop Penguin detail | `1000 × 914.86px` |

The live browser does not duplicate a phone status bar. Desktop homepage
content is centered using the measured card geometry; the reference composite
places a phone over the left side. Catalog and detail shells use a 1000px
maximum width; the homepage shell uses 1440px.

## Principal component geometry

| Component | Desktop measurement |
| --- | --- |
| Homepage header / hero | `89.16px` / `573.64px` high |
| Hero logo | `255.70 × 151.40px` |
| Hero headline / supporting copy | `67.29px` / `26.92px` |
| Hero primary / secondary CTA | `285.98 × 68.97px` / `280.93 × 68.97px` |
| Subject tile / gap / radius | `178.32 × 131.21px` / `21.87px` / `25.23px` |
| Featured card / image | `279.25 × 255.70px` / `279.25 × 169.91px` reference geometry |
| Featured grid | Four columns, `20.19px` horizontal and `28.60px` row gaps |
| Schools banner | `1201.12 × 107.66px` |
| Catalog header / banner | `59.78px` / `126.81px` high |
| Catalog sidebar | `195.65px` wide |
| Catalog card / image | `173.91 × 206.52px` / `173.91 × 115.94px` |
| Detail player | `614.13 × 358.70px` |
| Detail sidebar | `288.04px` wide |

Below desktop widths the CSS scales components and adapts the grids. Mobile
homepage cards use the compact horizontal reference treatment; catalog cards
remain a responsive grid. Mobile navigation uses bottom safe-area padding,
and catalog filters open as a dismissible drawer. Layout uses logical
properties for RTL; artwork retains its supplied aspect ratio.

## Artwork and motion

The 54 extracted image-fill crops preserve the actual supplied screenshot
artwork. The 60 original WebP covers remain intact; featured cards use the
corresponding exact reference crops. Illustrations are raster crops rather
than independently articulated character layers.

Animate suitable decorative elements with transform and opacity, and use
short transitions for controls, cards, menus and scroll entrances. Respect
`prefers-reduced-motion`: disable animations, transitions, smooth scrolling,
and hover transforms. Never autoplay music or sound.

## Content boundaries

Game titles and identifiers are preserved. Shared interface text is translated
into Arabic with RTL support. Subjects follow the provisional supplied catalog;
grade, age, instructions, objectives, and playable runtimes require verified
source data. Visual components must not imply these integrations exist.
