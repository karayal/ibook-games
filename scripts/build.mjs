import { access, cp, mkdir, readFile, realpath, rm, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourceDirectory = resolve(projectDirectory, 'html-preview');
const assetsDirectory = resolve(sourceDirectory, 'assets');
const distDirectory = resolve(projectDirectory, 'dist');
const laravelAssetsDirectory = resolve(projectDirectory, 'laravel-blade/public/ibook-assets');
const games = JSON.parse(await readFile(resolve(assetsDirectory, 'games.json'), 'utf8'));
const artwork = JSON.parse(await readFile(resolve(assetsDirectory, 'artwork.json'), 'utf8'));
for (const slug of Object.keys(artwork.coverOverrides || {})) {
  if (!games.some(game => game.slug === slug)) throw new Error(`Artwork override has an unknown game slug: ${slug}`);
}
for (const asset of [...Object.values(artwork.art), ...Object.values(artwork.scenes), ...Object.values(artwork.coverOverrides || {})]) {
  const assetPath = resolve(assetsDirectory, asset);
  if (!assetPath.startsWith(assetsDirectory + sep)) throw new Error('Artwork path must stay within assets.');
  await access(assetPath);
}
await writeFile(resolve(assetsDirectory, 'artwork-map.js'), `/* Generated from artwork.json. */\nwindow.IBOOK_ARTWORK = ${JSON.stringify(artwork).replaceAll('<', '\\u003c')};\n`, 'utf8');
if (games.length !== 60 || new Set(games.map(game => game.slug)).size !== 60) {
  throw new Error('The supplied catalog must contain exactly 60 unique game slugs.');
}
const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
const standardDescription = 'Learn. Play. Grow. Explore 60 educational games for curious minds with iBOOK Games.';
const routes = [
  { file: 'index.html', page: 'home', title: 'Home' },
  { file: 'games/index.html', page: 'catalog', title: 'Explore All Games' },
  { file: 'subjects.html', page: 'subjects', title: 'Explore by Subject' },
  { file: 'grades.html', page: 'grades', title: 'Browse by Grade' },
  { file: 'schools.html', page: 'schools', title: 'For Schools' },
  { file: 'about.html', page: 'about', title: 'About Us' },
  { file: 'contact.html', page: 'contact', title: 'Contact Us' },
  { file: 'login.html', page: 'login', title: 'Log In' },
  { file: 'favorites.html', page: 'favorites', title: 'My Favorite Games' },
  ...games.map(game => ({ file: `games/${game.slug}.html`, page: 'detail', title: game.title, slug: game.slug, description: `Discover ${game.title} in the iBOOK Games library. View its artwork, save it to your favorites, and explore related games.` })),
];

function htmlShell(route) {
  const prefix = route.file.includes('/') ? '../' : '';
  const title = escapeHTML(`${route.title} | iBOOK Games`);
  return `<!doctype html>
<html lang="en" dir="ltr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#5711ac">
  <meta name="description" content="${escapeHTML(route.description || standardDescription)}">
  <title>${title}</title>
  <link rel="preload" href="${prefix}assets/fonts/nunito-variable.ttf" as="font" type="font/ttf" crossorigin>
  <link rel="stylesheet" href="${prefix}assets/styles.css">
  <link rel="stylesheet" href="${prefix}assets/responsive.css">
  <link rel="stylesheet" href="${prefix}assets/responsive-secondary.css">
  <link rel="stylesheet" href="${prefix}assets/artwork.css">
  <script src="${prefix}assets/catalog-core.js" defer></script>
  <script src="${prefix}assets/catalog-data.js" defer></script>
  <script src="${prefix}assets/artwork-map.js" defer></script>
  <script src="${prefix}assets/app.js" defer></script>
</head>
<body data-page="${route.page}"${route.slug ? ` data-slug="${escapeHTML(route.slug)}"` : ''}>
  <div id="app"><div role="status" style="min-height:60vh;display:grid;place-content:center;text-align:center;padding:2rem;font-family:Nunito,Arial,sans-serif;color:#5711ac"><strong style="font-size:2rem">iBOOK GAMES</strong><p>Loading your next adventure…</p></div></div>
  <noscript><main style="max-width:48rem;margin:3rem auto;padding:1.5rem;font-family:Arial,sans-serif"><h1>iBOOK Games</h1><p>Enable JavaScript to explore the interactive game catalog, filters and favorites.</p><p>فعّل JavaScript لاستكشاف الألعاب التعليمية والمفضلة.</p><a href="${prefix}index.html">Home / الرئيسية</a></main></noscript>
</body>
</html>
`;
}

for (const route of routes) {
  const path = resolve(sourceDirectory, route.file);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, htmlShell(route), 'utf8');
}
// Keep a script payload for standalone HTML; Laravel supplies its own catalog through IBOOK_CONFIG.
await writeFile(resolve(assetsDirectory, 'catalog-data.js'), `/* Generated from games.json by scripts/build.mjs. */\nwindow.IBOOK_GAMES = ${JSON.stringify(games).replaceAll('<', '\\u003c').replaceAll('\u2028', '\\u2028').replaceAll('\u2029', '\\u2029')};\n`, 'utf8');

// The only cleaned output is this project's dedicated dist directory.
// Resolve and verify it before recursive removal; never follow a link outside the project.
if (dirname(distDirectory) !== projectDirectory || relative(projectDirectory, distDirectory) !== 'dist') throw new Error('Unsafe build output path.');
try {
  const canonicalProject = await realpath(projectDirectory);
  const canonicalDist = await realpath(distDirectory);
  if (dirname(canonicalDist).toLowerCase() !== canonicalProject.toLowerCase() || !canonicalDist.toLowerCase().endsWith(`${sep}dist`)) throw new Error('Build output resolves outside its dedicated directory.');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
await rm(distDirectory, { recursive: true, force: true });
await cp(sourceDirectory, distDirectory, { recursive: true, force: true });
await mkdir(laravelAssetsDirectory, { recursive: true });
await cp(assetsDirectory, laravelAssetsDirectory, { recursive: true, force: true });
console.log(`Built ${routes.length} HTML routes and ${games.length} games into dist; synchronized shared Laravel assets.`);
