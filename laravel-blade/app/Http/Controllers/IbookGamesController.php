<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\View\View;

class IbookGamesController extends Controller
{
    private function catalog(): array
    {
        // Keep this adapter as the single connection point for the host's Game model.
        // The supplied catalog contains no playable runtimes or verified grade/age data.
        return array_map(function (array $game): array {
            $game['play_url'] = $this->playerUrl($game['play_url'] ?? null);
            return $game;
        }, config('ibook_games', []));
    }

    private function playerUrl(?string $url): ?string
    {
        if (!$url || preg_match('/[\\\\\x00-\x20]/', $url)) {
            return null;
        }

        // Same-origin public files and HTTPS players are supported. Reject protocol-
        // relative URLs and executable URI schemes before exposing them to the UI.
        if (str_starts_with($url, '/') && !str_starts_with($url, '//')) {
            return $url;
        }

        $parts = parse_url($url);
        return is_array($parts)
            && ($parts['scheme'] ?? null) === 'https'
            && !empty($parts['host'])
            && !isset($parts['user'])
            && !isset($parts['pass']) ? $url : null;
    }

    private function page(string $page, string $title, ?string $slug = null): View
    {
        $games = $this->catalog();
        $gameUrls = [];
        foreach ($games as $game) {
            $gameUrls[$game['slug']] = route('ibook.games.show', ['slug' => $game['slug']]);
        }

        $authRoute = config('ibook_ui.auth_route', 'login');
        $config = [
            'page' => $page,
            'slug' => $slug,
            'assetBase' => rtrim(asset('ibook-assets'), '/') . '/',
            'routes' => [
                'home' => route('ibook.home'),
                'catalog' => route('ibook.games.index'),
                'subjects' => route('ibook.subjects'),
                'grades' => route('ibook.grades'),
                'schools' => route('ibook.schools'),
                'about' => route('ibook.about'),
                'contact' => route('ibook.contact'),
                'login' => route('ibook.login'),
                'favorites' => route('ibook.favorites'),
            ],
            'gameUrls' => $gameUrls,
            'games' => $games,
            'authUrl' => is_string($authRoute) && $authRoute !== 'ibook.login' && Route::has($authRoute)
                ? route($authRoute) : null,
            'contactEmail' => config('ibook_ui.contact_email'),
        ];

        return view('ibook.page', compact('config', 'title', 'page'));
    }

    public function home(): View
    {
        return $this->page('home', 'Home');
    }

    public function index(Request $request): View
    {
        // Query state stays in the URL and is applied by the shared catalog UI.
        return $this->page('catalog', 'Explore Games');
    }

    public function show(string $slug): View
    {
        $games = collect($this->catalog());
        $game = $games->firstWhere('slug', $slug);
        abort_unless($game, 404);
        return $this->page('detail', $game['title'], $slug);
    }

    public function subjects(): View
    {
        return $this->page('subjects', 'Subjects');
    }

    public function grades(): View
    {
        return $this->page('grades', 'Grades');
    }

    public function schools(): View
    {
        return $this->page('schools', 'For Schools');
    }

    public function about(): View
    {
        return $this->page('about', 'About');
    }

    public function contact(): View
    {
        return $this->page('contact', 'Contact');
    }

    public function login(): View
    {
        return $this->page('login', 'Log In');
    }

    public function favorites(): View
    {
        return $this->page('favorites', 'Favorites');
    }
}
