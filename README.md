# Infinite Wordle

An offline, single-file Wordle-style game. The complete game lives in [`WORDLE.html`](WORDLE.html); it has no runtime dependencies or network requests.

## Play locally

Open `WORDLE.html` directly in a modern browser.

## Publish with GitHub Pages

This repository includes [`.github/workflows/pages.yml`](.github/workflows/pages.yml). It builds a Pages artifact on every push to `main`, copies `WORDLE.html` to the published site root as `index.html`, and deploys it with GitHub Pages. The original `WORDLE.html` is also published at `/WORDLE.html`.

One-time setup:

1. Create a GitHub repository named `infinite_wordle` and push this project to its `main` branch.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
4. Push a commit, or open **Actions → Deploy Infinite Wordle to GitHub Pages → Run workflow**.
5. After the workflow succeeds, GitHub shows the site URL in the workflow's deployment environment and on **Settings → Pages**. For this repository it is usually `https://<owner>.github.io/infinite_wordle/`.

The workflow only publishes the generated static site artifact. It does not need npm, a server, secrets, or a custom build tool.

## Word-list source

The accepted five-letter dictionary is an embedded build-time snapshot of [`dwyl/english-words`](https://github.com/dwyl/english-words), specifically `words_alpha.txt`. That source is released to the public domain under the Unlicense. Only its alphabetic five-letter entries are copied into `WORDLE.html`; the daily solution list is curated separately.
