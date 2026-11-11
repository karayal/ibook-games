import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { createStaticServer, publicDirectory } from '../server.mjs';

const projectDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
let assertions = 0;
function check(value, message) { assertions++; if (!value) failures.push(message); }
async function exists(path) { try { return (await stat(path)).isFile(); } catch { return false; } }
async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? files(join(directory, entry.name)) : join(directory, entry.name)))).flat();
}
function localReference(ref, source) {
  ref = ref.replaceAll('&amp;', '&').split('#')[0].split('?')[0];
  if (!ref || /^(?:[a-z][\w+.-]*:|\/\/|\{)/i.test(ref) || /[{}$]/.test(ref)) return null;
  try { ref = decodeURIComponent(ref); } catch { return null; }
  return ref.startsWith('/') ? resolve(publicDirectory, `.${ref}`) : resolve(dirname(source), ref);
}

const allFiles = await files(publicDirectory);
const htmlFiles = allFiles.filter(file => extname(file) === '.html');
const games = JSON.parse(await readFile(join(publicDirectory, 'assets/games.json'), 'utf8'));
const catalogPayload = await readFile(join(publicDirectory, 'assets/catalog-data.js'), 'utf8');
const artworkRegistry = JSON.parse(await readFile(join(publicDirectory, 'assets/artwork.json'), 'utf8'));
const artworkPayload = await readFile(join(publicDirectory, 'assets/artwork-map.js'), 'utf8');
const embeddedArtwork = JSON.parse(artworkPayload.split('window.IBOOK_ARTWORK = ')[1].trim().replace(/;$/, ''));
check(JSON.stringify(embeddedArtwork) === JSON.stringify(artworkRegistry), 'Generated browser artwork must match artwork.json exactly.');
check(Object.keys(artworkRegistry.coverOverrides || {}).length === games.length, 'All 60 games must have enhanced artwork.');
for (const slug of Object.keys(artworkRegistry.coverOverrides || {})) {
  check(games.some(game => game.slug === slug), `Unknown enhanced game artwork: ${slug}`);
}
for (const asset of [...Object.values(artworkRegistry.art), ...Object.values(artworkRegistry.scenes), ...Object.values(artworkRegistry.coverOverrides || {})]) {
  const assetPath = resolve(publicDirectory, 'assets', asset);
  check(assetPath.startsWith(resolve(publicDirectory, 'assets') + '/') || assetPath.startsWith(resolve(publicDirectory, 'assets') + '\\'), `Artwork escapes assets: ${asset}`);
  check(await exists(assetPath), `Missing enhanced artwork: ${asset}`);
}
function webpSize(bytes) {
  for (let cursor = 12; cursor + 8 <= bytes.length;) {
    const type = bytes.subarray(cursor, cursor + 4).toString();
    const size = bytes.readUInt32LE(cursor + 4), start = cursor + 8;
    if (start + size > bytes.length) break;
    if (type === 'VP8X' && size >= 10) return [bytes.readUIntLE(start + 4, 3) + 1, bytes.readUIntLE(start + 7, 3) + 1];
    if (type === 'VP8L' && size >= 5 && bytes[start] === 0x2f) {
      const bits = bytes.readUInt32LE(start + 1);
      return [(bits & 0x3fff) + 1, ((bits >>> 14) & 0x3fff) + 1];
    }
    if (type === 'VP8 ' && size >= 10) return [bytes.readUInt16LE(start + 6) & 0x3fff, bytes.readUInt16LE(start + 8) & 0x3fff];
    cursor = start + size + (size % 2);
  }
  return [0, 0];
}
for (const [slug, asset] of Object.entries(artworkRegistry.coverOverrides || {})) {
  const bytes = await readFile(join(publicDirectory, 'assets', asset));
  const [width, height] = webpSize(bytes);
  check(width >= 1500 && height >= 900, `Enhanced cover must retain native high resolution: ${slug} (${width}×${height}).`);
  check(width / height > 1.5 && width / height < 1.7, `Enhanced cover must use the landscape card composition: ${slug}.`);
}
const originalCoverHashes = JSON.parse(await readFile(join(projectDirectory, 'original-cover-hashes.json'), 'utf8'));
const embeddedGames = JSON.parse(catalogPayload.split('window.IBOOK_GAMES = ')[1].trim().replace(/;$/, ''));
check(JSON.stringify(embeddedGames) === JSON.stringify(games), 'Generated browser catalog must match games.json exactly. Run node scripts/build.mjs after metadata edits.');
check(htmlFiles.length === 69, `Expected 69 HTML routes (including favorites), found ${htmlFiles.length}.`);
const routeRegistry = [
  'index.html', 'games/index.html', 'subjects.html', 'grades.html',
  'schools.html', 'about.html', 'contact.html', 'login.html', 'favorites.html',
  ...games.map(game => `games/${game.slug}.html`),
];
for (const route of routeRegistry) check(await exists(join(publicDirectory, route)), `Missing registered UI route: ${route}`);
check(games.length === 60, `Expected 60 games, found ${games.length}.`);
check(new Set(games.map(game => game.id)).size === 60, 'Game IDs must be unique.');
check(new Set(games.map(game => game.slug)).size === 60, 'Game slugs must be unique.');
check(new Set(games.map(game => game.title)).size === 60, 'Game titles must be unique.');
check(new Set(games.map(game => game.cover)).size === 60, 'Each game needs its own cover.');
const coverFiles = allFiles.filter(file => dirname(file) === join(publicDirectory, 'assets/covers') && extname(file) === '.webp');
check(coverFiles.length === 60, `Expected 60 cover files, found ${coverFiles.length}.`);

for (const game of games) {
  check(typeof game.title === 'string' && game.title.trim().length > 0, `Game ${game.id} needs a title.`);
  check(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(game.slug), `Invalid slug: ${game.slug}`);
  check(game.cover === `assets/covers/${game.slug}.webp`, `Cover mapping mismatch: ${game.slug}`);
  const coverPath = join(publicDirectory, game.cover);
  check(await exists(coverPath), `Missing cover: ${game.cover}`);
  if (await exists(coverPath)) {
    const bytes = await readFile(coverPath);
    check(bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP', `Invalid WebP cover: ${game.slug}`);
    check(createHash('sha256').update(bytes).digest('hex') === originalCoverHashes[game.slug], `Supplied original cover was modified: ${game.slug}`);
  }
  check(await exists(join(publicDirectory, 'games', `${game.slug}.html`)), `Missing detail page: ${game.slug}`);
  if (game.original_thumbnail) check(await exists(join(publicDirectory, game.original_thumbnail)), `Missing original thumbnail: ${game.slug}`);
  check(game.play_url === null || (typeof game.play_url === 'string' && game.play_url.length > 0), `Invalid runtime URL: ${game.slug}`);
}

const mapping = await readFile(join(projectDirectory, 'game-integration-mapping.csv'), 'utf8');
for (const game of games) check(mapping.includes(game.slug), `Integration worksheet missing ${game.slug}.`);

await import('../html-preview/assets/catalog-core.js');
const { selectGames, subjectMatches } = globalThis.IBookCatalog;
const initialData = JSON.stringify(games);
const defaultResult = selectGames(games);
check(defaultResult.total === 60 && defaultResult.rows.length === 8 && defaultResult.pages === 8 && defaultResult.page === 1, 'Default catalog must paginate 60 entries into 8 pages.');
check(selectGames(games, { page: 8 }).rows.length === 4, 'Last catalog page must show four entries.');
check(selectGames(games, { page: 999 }).page === 8, 'Out-of-range pages must be clamped.');
check(selectGames(games, { page: -1 }).page === 1, 'Negative page must be clamped.');
const searched = selectGames(games, { query: '  PENGUIN  ' });
check(searched.total === 2 && searched.rows.every(game => /penguin/i.test(game.title)), 'Search must be trimmed and case insensitive.');
const multiplication = games.filter(game => game.subject === 'Multiplication');
check(selectGames(games, { subjects: ['Multiplication'] }).total === multiplication.length, 'Subject filter must match supplied metadata.');
check(selectGames(games, { query: 'penguin', subjects: ['Multiplication'] }).total === 0, 'Search and subject filters must combine.');
const spellingTyping = selectGames(games, { subjects: ['Spelling', 'Typing'], pageSize: 60 });
check(spellingTyping.total === games.filter(game => ['Spelling', 'Typing'].includes(game.subject)).length, 'Multiple subject filters must use OR.');
check(subjectMatches('Multiplication', 'Math') && !subjectMatches('Spelling', 'Math') && !subjectMatches('Geography', 'Math'), 'Math subject grouping must exclude language and geography.');
const ascending = selectGames(games, { sort: 'az', pageSize: 60 }).rows.map(game => game.title);
check(ascending.join('|') === [...ascending].sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base', numeric: true })).join('|'), 'A–Z sorting must order the complete filtered list.');
check(selectGames(games, { sort: 'za', pageSize: 60 }).rows.map(game => game.title).join('|') === [...ascending].reverse().join('|'), 'Z–A sorting must reverse alphabetical order.');
const favorite = games[11];
check(selectGames(games, { favoritesOnly: true, favorites: [favorite.slug] }).rows[0]?.slug === favorite.slug, 'Favorites filter must use persisted stable slugs.');
check(selectGames(games, { favoritesOnly: true }).total === 0, 'Empty favorites must be empty.');
const empty = selectGames(games, { query: 'no-such-game-398284', page: 4 });
check(empty.total === 0 && empty.rows.length === 0 && empty.page === 1 && empty.pages === 1, 'Empty result state must have valid pagination.');
check(JSON.stringify(games) === initialData, 'Catalog operations must not mutate the supplied metadata.');

for (const file of allFiles.filter(file => ['.html', '.css', '.js', '.mjs'].includes(extname(file)))) {
  const source = await readFile(file, 'utf8');
  const refs = extname(file) === '.html'
    ? [...source.matchAll(/(?:href|src)\s*=\s*["']([^"']+)["']/gi)].map(match => match[1])
    : extname(file) === '.css'
      ? [...source.matchAll(/url\(\s*["']?([^"')\s]+)["']?\s*\)/gi)].map(match => match[1])
      : [...source.matchAll(/(?:from\s*|import\s*\(|fetch\s*\()\s*["'](\.{1,2}\/[^"']+)["']/g)].map(match => match[1]);
  for (const ref of refs) {
    let target = localReference(ref, file);
    if (!target) continue;
    try { if ((await stat(target)).isDirectory()) target = join(target, 'index.html'); } catch {}
    check(await exists(target), `${relative(publicDirectory, file)} references missing ${ref}`);
  }
  if (extname(file) === '.html') {
    const route = relative(publicDirectory, file).replaceAll('\\', '/');
    check(/<title>[^<]+<\/title>/i.test(source), `Missing document title: ${relative(publicDirectory, file)}`);
    check(/name=["']viewport["']/i.test(source), `Missing mobile viewport: ${relative(publicDirectory, file)}`);
    const scripts = [...source.matchAll(/<script[^>]+src=["']([^"']+)["'][^>]*>/gi)];
    check(scripts.map(match => match[1].split('/').at(-1)).join('|') === 'catalog-core.js|catalog-data.js|artwork-map.js|app.js', `Script dependency order is invalid: ${route}`);
    check(scripts.every(match => /\bdefer\b/.test(match[0])), `Application scripts must defer until shell DOM exists: ${route}`);
    check(/id=["']app["']/.test(source) && /<noscript>/i.test(source), `Missing app mount or JavaScript fallback: ${route}`);
    if (route.startsWith('games/') && route !== 'games/index.html') {
      const slug = route.slice('games/'.length, -'.html'.length);
      check(source.includes('data-page="detail"') && source.includes(`data-slug="${slug}"`), `Detail shell has incorrect route identity: ${route}`);
    }
  }
}

// The app constructs these supplied-art URLs at runtime; HTML reference scanning cannot see them.
const dynamicArtwork = [
  'nav-logo', 'hero-logo', 'hero-art', 'hero-cloud', 'landscape', 'mobile-hero',
  'controller', 'catalog-art', 'school-icon', 'school-art', 'penguin-preview',
  'subject-calculator', 'subject-multiply', 'subject-divide', 'subject-fraction', 'subject-spelling', 'subject-typing',
  ...['grand-prix-multiplication', 'penguin-jump', 'space-race', 'jet-ski-addition', 'pizza-pandas', 'turtle-dash', 'spelling-bees', 'typing-jets'].map(slug => `featured-${slug}`),
];
for (const artwork of dynamicArtwork) check(await exists(join(publicDirectory, 'assets/design', `${artwork}.png`)), `Missing runtime artwork: ${artwork}`);

const server = createStaticServer();
await new Promise((resolveReady, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolveReady); });
const origin = `http://127.0.0.1:${server.address().port}`;
try {
  for (const file of htmlFiles) {
    const path = relative(publicDirectory, file).replaceAll('\\', '/');
    const response = await fetch(`${origin}/${path}`);
    check(response.status === 200, `HTTP ${response.status}: ${path}`);
    check(response.headers.get('content-type')?.startsWith('text/html'), `Wrong HTML MIME type: ${path}`);
    await response.text();
  }
  for (const path of ['/', '/games/', '/assets/styles.css', '/assets/app.js', '/assets/games.json', '/assets/covers/penguin-jump.webp']) {
    const response = await fetch(`${origin}${path}`, { method: 'HEAD' });
    check(response.status === 200, `HEAD ${response.status}: ${path}`);
    check(Number(response.headers.get('content-length')) > 0, `Empty response: ${path}`);
  }
  for (const asset of Object.values(artworkRegistry.coverOverrides || {})) {
    const response = await fetch(`${origin}/assets/${asset}`, { method: 'HEAD' });
    check(response.status === 200 && response.headers.get('content-type') === 'image/webp', `Enhanced artwork must be served as WebP: ${asset}`);
  }
  const redirect = await fetch(`${origin}/games?subject=Counting`, { redirect: 'manual' });
  check(redirect.status === 308 && redirect.headers.get('location') === '/games/?subject=Counting', 'Directory redirect must retain catalog query.');
  check((await fetch(`${origin}/missing-game.html`)).status === 404, 'Missing routes must return 404.');
  check((await fetch(`${origin}/assets/app.js`, { method: 'POST' })).status === 405, 'Static server must reject writes.');
  check((await fetch(`${origin}/%2e%2e%2fREADME.md`)).status !== 200, 'Static server must not serve project files outside html-preview.');
  check((await fetch(`${origin}/%5c..%5cREADME.md`)).status !== 200, 'Static server must reject backslash traversal.');
} finally {
  server.closeAllConnections();
  await new Promise(resolveClosed => server.close(resolveClosed));
}

if (failures.length) {
  console.error(`${failures.length} of ${assertions} checks failed:\n${failures.map(error => `- ${error}`).join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`PASS: ${assertions} checks; 69 HTML routes; 60 unique games and WebP covers; search, combined filters, sorting, pagination and favorites; all local references; HTTP routes, MIME types and server path protection.`);
  console.log('Browser interaction, responsive layout, Arabic, motion and visual comparison require the separate browser QA pass.');
}
