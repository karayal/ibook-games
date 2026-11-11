# GitHub Pages deployment

The public website is built from `html-preview/` and published from the generated
`dist/` folder. The source repository also includes the Laravel integration.
GitHub Pages runs the standalone HTML interface; Laravel needs a PHP application
host for its server routes and configured backend services.

The workflow in [pages.yml](.github/workflows/pages.yml) runs on pushes to `main`:

1. Set up Node.js 24, with no package installation required.
2. Run `node scripts/build.mjs` to generate all 69 routes and shared assets.
3. Run `node scripts/verify.mjs` to verify the catalog, artwork and local HTTP routes.
4. Upload `dist/` and deploy it through GitHub Pages.

Pull requests run the build and verification without publishing. The workflow
can also be run manually from the repository's Actions tab. Pages is configured
to use **GitHub Actions** as its publishing source under **Settings → Pages**.

App links and asset paths resolve relative to the application script, supporting
the repository subpath without a custom domain or build-time base URL.

Local hosting associations, environment files, dependency directories and generated
copies are excluded by `.gitignore`. Run the build after cloning to recreate
`dist/` and `laravel-blade/public/ibook-assets/`.

Deployment follows the official [GitHub Pages custom workflow guide](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
