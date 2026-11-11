<!doctype html>
<html lang="en" dir="ltr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta name="theme-color" content="#5711ac">
    <title>{{ $title }} | iBOOK Games</title>
    <meta name="description" content="Learn. Play. Grow. Explore 60 educational games with iBOOK Games.">
    <link rel="stylesheet" href="{{ asset('ibook-assets/styles.css') }}">
    <link rel="stylesheet" href="{{ asset('ibook-assets/responsive.css') }}">
    <link rel="stylesheet" href="{{ asset('ibook-assets/responsive-secondary.css') }}">
    <link rel="stylesheet" href="{{ asset('ibook-assets/artwork.css') }}">
    <script>window.IBOOK_CONFIG = {{ Illuminate\Support\Js::from($config) }};</script>
    <script src="{{ asset('ibook-assets/catalog-core.js') }}" defer></script>
    <script src="{{ asset('ibook-assets/artwork-map.js') }}" defer></script>
    <script src="{{ asset('ibook-assets/app.js') }}" defer></script>
</head>
<body data-page="{{ $page }}">
    <div id="app"></div>
    <noscript><main style="max-width:48rem;margin:3rem auto;padding:1.5rem;font-family:system-ui"><h1>iBOOK Games</h1><p>Enable JavaScript to explore the interactive game catalog.</p><a href="{{ route('ibook.home') }}">Home</a></main></noscript>
</body>
</html>
