# Autonomous Build Guide

## Mission

Build the production-ready Infinite Wordle game described in [PRODUCT_DESIGN.md](PRODUCT_DESIGN.md). Deliver it as a semantic `WORDLE.html` shell, external `styles.css` and `wordle.js` assets, plus eight same-site word-list files it loads at runtime for 4-, 5-, 6-, and 7-letter modes. Do not require user decisions unless a request conflicts with this guide or introduces a material new product scope.

## Authority and scope

- You may create or modify `WORDLE.html`, `styles.css`, `wordle.js`, the six `data/solutions*.txt`/`data/accepted*.txt` files, the Pages workflow, and this design documentation when implementation reveals an objective correction.
- Do not add package managers, build tooling, external CDN dependencies, backend services, tracking, or generated asset directories.
- Runtime word-list requests must be same-site relative requests served by GitHub Pages. Do not request external domains at runtime. Do not copy Wordle branding or proprietary assets.
- Preserve unrelated user files and existing changes. Inspect before changing an existing artifact.

## Implementation decisions to make autonomously

- Use vanilla HTML, CSS, and modern browser JavaScript. Keep semantic markup in `WORDLE.html`, presentation in `styles.css`, and behavior in `wordle.js` using standard external-asset conventions.
- Use original, accessible system-font styling and inline SVG only when an icon is needed.
- Maintain two text-file vocabularies per length in `data/`: a full accepted dictionary (from the downloaded `dwyl/english-words` `words_alpha.txt` snapshot, filtered to unique alphabetic entries of that length) and a separate solution list. `WORDLE.html` loads all eight from relative same-site paths at runtime. Ensure all solutions are in the matching accepted dictionary. Curate solutions for broad everyday familiarity; reject technical, archaic, obscure, specialist, dialect-only, or unusually challenging words from solution lists. Do not narrow accepted dictionaries merely because a word is too obscure to be a solution.
- Use local date components, a fixed documented epoch, and modulo solution-list length for daily selection.
- Namespace and version `localStorage` keys (for example `single-file-word-game:v1:*`). Treat parsing/storage failures as recoverable.
- Favor readable small functions and constants over clever abstractions. No framework is necessary.
- Build mobile-first responsive CSS with fluid sizing, safe-area insets, `100dvh`, and breakpoints for narrow phones, standard phones, tablets (portrait and landscape), and desktop. Cap the game column on large screens; prevent horizontal overflow at every supported width. Keep touch targets roughly 44px or larger, but allow compact keyboard gaps on very narrow phones. Ensure short landscape view remains reachable with vertical scrolling.

## Required behavior

- Implement all functional, accessibility, and acceptance requirements in `PRODUCT_DESIGN.md`.
- Implement duplicate-letter scoring with a two-pass algorithm: exact matches first, then remaining present matches while consuming answer-letter counts.
- Make physical and virtual keyboard behavior consistent. Key colors must only upgrade in priority: correct > present > absent.
- Persist/resume one active round per length. The first round opened on a new local day uses the deterministic daily answer; New word starts a persisted random answer, with no separate practice mode or daily-only statistics.
- Use an ARIA live region, visible focus styles, modal focus management, and a reduced-motion fallback.
- Expose a visible New word control that replaces the active answer and persists it across reloads until completion or another replacement.
- Expose a visible Reset board control with confirmation that clears guesses and feedback while preserving the active answer; replaying a completed round must not double-count statistics.
- Expose a top-bar selector for 4-, 5-, 6-, and 7-letter modes. Switching length must update board columns, row count, input limits, scoring, dictionaries, answer selection, and length-specific persistence/statistics without cross-contamination. 7-letter mode must allow 10 guesses; all other modes allow 6.

## Validation workflow

Before handoff, perform proportionate validation without adding test infrastructure unless it remains self-contained:

1. Parse/check the HTML and inspect it in a browser if an available browser tool permits.
2. Serve the repository over HTTP (or inspect the GitHub Pages preview) and verify all eight relative word-list requests succeed before the board becomes active.
3. Exercise incomplete and invalid guesses; ensure rows do not advance.
4. Exercise ordinary common-word guesses (including plural nouns and third-person verbs such as `PEARS` and `LOOKS` in five-letter mode) so the allow-list is not accidentally too narrow.
5. Exercise standard dictionary words outside the curated solutions (for example `CATER` in five-letter mode) and ensure they are accepted.
6. Exercise at least two duplicate-letter scoring examples, including an answer with fewer repeated letters than the guess.
7. Verify win and loss paths, virtual and physical input, reload persistence, length switching, New word and Reset board confirmation behavior, share output, and stats update behavior.
8. Check a narrow mobile viewport (~320px) and reduced-motion styling in all four lengths, including the 10-row 7-letter board.
9. Check representative 375–430px phone, 768px tablet portrait and landscape, and 1024px+ desktop viewports for clipping, overlap, and horizontal overflow.
10. Confirm no external URLs, missing assets, or unhandled word-list load errors are required; same-site relative requests are expected.

Record any limitations plainly in the final handoff. Do not claim tests or browser checks that were not run.

## Definition of done

The work is complete when the GitHub Pages site loads `WORDLE.html`, `styles.css`, `wordle.js`, and all eight word-list files, meets the acceptance checklist in the design document, and has been validated according to the workflow above. Summarize files changed and validation results in the final response.
