<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\IbookGamesController;

// Integrate by requiring this file from existing routes/web.php.
// Preview lives at /ibook-preview to avoid collisions with existing live routes.
Route::prefix('ibook-preview')->name('ibook.')->group(function () {
    Route::get('/', [IbookGamesController::class, 'home'])->name('home');
    Route::get('/games', [IbookGamesController::class, 'index'])->name('games.index');
    Route::get('/games/{slug}', [IbookGamesController::class, 'show'])->name('games.show');
    Route::get('/subjects', [IbookGamesController::class, 'subjects'])->name('subjects');
    Route::get('/grades', [IbookGamesController::class, 'grades'])->name('grades');
    Route::get('/schools', [IbookGamesController::class, 'schools'])->name('schools');
    Route::get('/about', [IbookGamesController::class, 'about'])->name('about');
    Route::get('/contact', [IbookGamesController::class, 'contact'])->name('contact');
    Route::get('/login', [IbookGamesController::class, 'login'])->name('login');
    Route::get('/favorites', [IbookGamesController::class, 'favorites'])->name('favorites');
});
