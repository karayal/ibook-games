# Laravel integration

This folder is a drop-in for an existing Laravel 10–13 application. It is not a
second application: the archive contains no `artisan`, `composer.json`, database,
authentication backend, or game runtimes.

1. Merge `app/`, `config/`, `resources/`, and `public/` into the matching host
   application directories. Preserve the host's files and middleware.
2. Copy `routes/ibook_games.php` into the host's `routes/` directory and add
   `require __DIR__ . '/ibook_games.php';` to its existing `routes/web.php`.
3. Run `php artisan optimize:clear` and `php artisan route:list --name=ibook`.
4. Open `/ibook-preview`. The original route names and URLs remain isolated from
   the live site; `/ibook-preview/favorites` is an additional browser-local page.

## Shared presentation

`IbookGamesController` sends a safely serialized `window.IBOOK_CONFIG` to
`resources/views/ibook/layouts/app.blade.php`. The same `app.js`, `styles.css`,
design artwork, fonts, covers, and catalog data used by the runnable HTML version
belong under `public/ibook-assets/`. There is one renderer for both versions, so
the Laravel screens use the same visual and responsive behavior.

`config/ibook_games.php` is the catalog adapter. Replace `catalog()` in the
controller with a host-model adapter when the actual database is available.
Preserve the supplied `id` and `slug` mapping. An unknown slug returns HTTP 404.

## Integrations to supply

All 60 records currently have `play_url`, `grade`, and `age` set to `null`.
The CSV's verified subject, grade, age, instructions, and learning-objective
columns are empty. The subject field in the starter is provisional. No game
engine or original gameplay instructions can be recovered from these covers.

Set each `play_url` to a verified HTTPS player URL or a same-origin public path
such as `/games/penguin-jump/index.html`. The controller rejects executable URI
schemes, protocol-relative URLs, embedded credentials, backslashes, and control
characters. The front end starts a connected player only after a play action.
Test the actual game bundle, keyboard controls, mobile input, embedding policy,
and fullscreen behavior in the host before production.

`config/ibook_ui.php` accepts an existing authentication route name. The default
is `login`; `authUrl` is emitted only if that real host route exists. No demo
session or invented login endpoint is provided. Set `contact_email` to an
approved mailbox to enable email composition; there is no email-sending backend.
Favorites and language preference are stored in the visitor's browser.

## Verification boundary

The source bundle does not include a Laravel application or PHP/Composer runtime.
Laravel boot, route, Blade, authentication, and real-player tests must therefore
run in the host application after installation. Front-end validation is recorded
with the runnable website deliverable. Do not interpret those checks as proof
that absent game engines or backend services are functional.
