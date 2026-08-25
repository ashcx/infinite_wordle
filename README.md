# Infinite Wordle

## Play the game

Visit the live site:

**https://ashcx.github.io/infinite_wordle/**

Infinite Wordle is a small personal project made for fun. Choose a 3- through 6-letter puzzle with 6 guesses, or a harder 7- or 8-letter puzzle with 10 guesses. The first round each day uses a deterministic daily word; press **New word** for a fresh answer, or **Reset board** to clear guesses while keeping the same answer. It may not receive regular updates.

## What’s included

- 3-, 4-, 5-, 6-, 7-, and 8-letter games with persistent daily-start, New word, and Reset board controls
- Mobile, tablet, and desktop layouts
- Accessible keyboard and touch controls
- Statistics, streaks, sharing, dark mode, and high contrast
- No account, ads, or tracking

## About this repository

This is a casual, low-maintenance project rather than an actively developed product. The playable page is [`WORDLE.html`](WORDLE.html), with presentation in [`styles.css`](styles.css) and game behavior in [`wordle.js`](wordle.js). It loads separate maintained solution and accepted-word sources for each length from the same GitHub Pages site: the `data/solutions-*.txt` and `data/accepted-*.txt` files for 3, 4, 6, 7, and 8 letters, plus the existing five-letter `data/solutions.txt` and `data/accepted-words.txt` files.

GitHub Pages deployment is automated by [`.github/workflows/pages.yml`](.github/workflows/pages.yml). It publishes the game at the site root and also keeps `/WORDLE.html` available. Because the CSS, JavaScript, and word files are loaded by the browser, play through the hosted Pages URL rather than opening `WORDLE.html` directly from your filesystem.

The accepted dictionary is based on [`dwyl/english-words`](https://github.com/dwyl/english-words), specifically `words_alpha.txt`, released to the public domain under the Unlicense. Daily answers are curated separately for general familiarity.
