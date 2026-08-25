# Infinite Wordle

## Play the game

Visit the live site:

**https://ashcx.github.io/infinite_wordle/**

Infinite Wordle is a small personal project made for fun. Choose a 4-, 5-, or 6-letter puzzle with 6 guesses, or a harder 7-letter puzzle with 10 guesses. The first round each day uses a deterministic daily word; press **New word** for a fresh answer that persists until the round ends or you start another one. It may not receive regular updates.

## What’s included

- 4-, 5-, 6-, and 7-letter games with persistent daily-start and New word rounds
- Mobile, tablet, and desktop layouts
- Accessible keyboard and touch controls
- Statistics, streaks, sharing, dark mode, and high contrast
- No account, ads, or tracking

## About this repository

This is a casual, low-maintenance project rather than an actively developed product. The playable page is [`WORDLE.html`](WORDLE.html), with presentation in [`styles.css`](styles.css) and game behavior in [`wordle.js`](wordle.js). It loads separate maintained solution and accepted-word sources for each length from the same GitHub Pages site: [`data/solutions-4.txt`](data/solutions-4.txt), [`data/accepted-4.txt`](data/accepted-4.txt), [`data/solutions.txt`](data/solutions.txt), [`data/accepted-words.txt`](data/accepted-words.txt), [`data/solutions-6.txt`](data/solutions-6.txt), [`data/accepted-6.txt`](data/accepted-6.txt), [`data/solutions-7.txt`](data/solutions-7.txt), and [`data/accepted-7.txt`](data/accepted-7.txt).

GitHub Pages deployment is automated by [`.github/workflows/pages.yml`](.github/workflows/pages.yml). It publishes the game at the site root and also keeps `/WORDLE.html` available. Because the CSS, JavaScript, and word files are loaded by the browser, play through the hosted Pages URL rather than opening `WORDLE.html` directly from your filesystem.

The accepted dictionary is based on [`dwyl/english-words`](https://github.com/dwyl/english-words), specifically `words_alpha.txt`, released to the public domain under the Unlicense. Daily answers are curated separately for general familiarity.
