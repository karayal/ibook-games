(function (root) {
  'use strict';
  const normalize = value => String(value ?? '').trim().normalize('NFKC').toLocaleLowerCase();
  const nonMathSubjects = new Set(['spelling', 'typing', 'geography']);
  function subjectMatches(gameOrSubject, filter) {
    const subject = normalize(typeof gameOrSubject === 'object' ? gameOrSubject.subject : gameOrSubject);
    const selected = normalize(filter);
    if (!selected || selected === 'all' || selected === 'all subjects') return true;
    if (selected === 'math') return !!subject && !nonMathSubjects.has(subject);
    return subject === selected;
  }
  /** Pure catalog operations shared by UI and Node verification. Never changes source data. */
  function selectGames(games, options = {}) {
    const query = normalize(options.query);
    const subjects = Array.isArray(options.subjects) ? options.subjects : [];
    const favorites = new Set(Array.isArray(options.favorites) ? options.favorites.map(String) : []);
    const pageSize = Math.min(60, Math.max(1, Math.floor(Number(options.pageSize) || 8)));
    let rows = games.map((game, index) => ({ game, index })).filter(({ game }) => {
      const queryMatches = !query || normalize(`${game.title} ${game.subject}`).includes(query);
      const filterMatches = !subjects.length || subjects.some(subject => subjectMatches(game, subject));
      const favoriteMatches = !options.favoritesOnly || favorites.has(String(game.slug)) || favorites.has(String(game.id));
      return queryMatches && filterMatches && favoriteMatches;
    });
    const compareTitle = (a, b) => a.game.title.localeCompare(b.game.title, 'en', { sensitivity: 'base', numeric: true });
    rows.sort((a, b) => {
      if (options.sort === 'az') return compareTitle(a, b) || a.index - b.index;
      if (options.sort === 'za') return compareTitle(b, a) || a.index - b.index;
      return (Number(a.game.order) || a.index + 1) - (Number(b.game.order) || b.index + 1) || a.index - b.index;
    });
    const total = rows.length;
    const pages = Math.max(1, Math.ceil(total / pageSize));
    const page = Math.min(pages, Math.max(1, Math.floor(Number(options.page) || 1)));
    return { rows: rows.slice((page - 1) * pageSize, page * pageSize).map(row => row.game), total, pages, page };
  }
  root.IBookCatalog = Object.freeze({ selectGames, subjectMatches });
})(globalThis);
