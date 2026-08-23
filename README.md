# Infinite Wordle

## Play the game

Visit the live site:

**https://ashcx.github.io/infinite_wordle/**

Infinite Wordle is a small personal project made for fun. Solve the common five-letter answer in six guesses, or start a fresh practice round whenever you like. It may not receive regular updates.

## What’s included

- Daily and practice games
- Mobile, tablet, and desktop layouts
- Accessible keyboard and touch controls
- Statistics, streaks, sharing, dark mode, and high contrast
- No account, ads, or tracking

## About this repository

This is a casual, low-maintenance project rather than an actively developed product. The playable page is [`WORDLE.html`](WORDLE.html). It loads the maintained word sources in [`data/solutions.txt`](data/solutions.txt) and [`data/accepted-words.txt`](data/accepted-words.txt) from the same GitHub Pages site.

GitHub Pages deployment is automated by [`.github/workflows/pages.yml`](.github/workflows/pages.yml). It publishes the game at the site root and also keeps `/WORDLE.html` available. Because the word files are loaded by the browser, play through the hosted Pages URL rather than opening `WORDLE.html` directly from your filesystem.

The accepted dictionary is based on [`dwyl/english-words`](https://github.com/dwyl/english-words), specifically `words_alpha.txt`, released to the public domain under the Unlicense. Daily answers are curated separately for general familiarity.
