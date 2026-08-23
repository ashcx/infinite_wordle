# Autonomous Build Guide

## Mission

Build the production-ready single-file Infinite Wordle game described in [PRODUCT_DESIGN.md](PRODUCT_DESIGN.md). Deliver it as `WORDLE.html` with all CSS, JavaScript, data, and visual assets embedded. Do not require user decisions unless a request conflicts with this guide or introduces a material new product scope.

## Authority and scope

- You may create or modify `WORDLE.html`, and may update this design documentation when implementation reveals an objective correction.
- Do not add package managers, build tooling, external CDN dependencies, backend services, tracking, or generated asset directories.
- Do not make external network requests at runtime. Do not copy Wordle branding or proprietary assets.
- Preserve unrelated user files and existing changes. Inspect before changing an existing artifact.

## Implementation decisions to make autonomously

- Use vanilla HTML, CSS, and modern browser JavaScript in one file.
- Use original, accessible system-font styling and inline SVG only when an icon is needed.
- Maintain two embedded five-letter vocabularies: a full accepted dictionary (generated from the downloaded `dwyl/english-words` `words_alpha.txt` snapshot, filtered to unique alphabetic five-letter entries) and a separate solution list. Ensure all solutions are in the accepted dictionary. Curate solutions for broad everyday familiarity; reject technical, archaic, obscure, specialist, dialect-only, or unusually challenging words from the solution list. Do not narrow the accepted dictionary merely because a word is too obscure to be a solution. Download/refresh the source only at build time; never fetch it during runtime.
- Use local date components, a fixed documented epoch, and modulo solution-list length for daily selection.
- Namespace and version `localStorage` keys (for example `single-file-word-game:v1:*`). Treat parsing/storage failures as recoverable.
- Favor readable small functions and constants over clever abstractions. No framework is necessary.
- Build mobile-first responsive CSS with fluid sizing, safe-area insets, `100dvh`, and breakpoints for narrow phones, standard phones, tablets (portrait and landscape), and desktop. Cap the game column on large screens; prevent horizontal overflow at every supported width. Keep touch targets roughly 44px or larger, but allow compact keyboard gaps on very narrow phones. Ensure short landscape view remains reachable with vertical scrolling.

## Required behavior

- Implement all functional, accessibility, and acceptance requirements in `PRODUCT_DESIGN.md`.
- Implement duplicate-letter scoring with a two-pass algorithm: exact matches first, then remaining present matches while consuming answer-letter counts.
- Make physical and virtual keyboard behavior consistent. Key colors must only upgrade in priority: correct > present > absent.
- Persist/resume only the daily game; keep practice sessions separate and do not let practice alter daily streak statistics.
- Use an ARIA live region, visible focus styles, modal focus management, and a reduced-motion fallback.
- Expose a visible New word control that starts a fresh practice answer at any time without changing daily state or daily statistics.

## Validation workflow

Before handoff, perform proportionate validation without adding test infrastructure unless it remains self-contained:

1. Parse/check the HTML and inspect it in a browser if an available browser tool permits.
2. Exercise incomplete and invalid guesses; ensure rows do not advance.
3. Exercise ordinary common-word guesses (including plural nouns and third-person verbs such as `PEARS` and `LOOKS`) so the allow-list is not accidentally too narrow.
4. Exercise standard dictionary words outside the curated solutions (for example `CATER`) and ensure they are accepted.
5. Exercise at least two duplicate-letter scoring examples, including an answer with fewer repeated letters than the guess.
6. Verify win and loss paths, virtual and physical input, reload persistence, mode switching, New word behavior, share output, and stats update behavior.
7. Check a narrow mobile viewport (~320px) and reduced-motion styling.
8. Check representative 375–430px phone, 768px tablet portrait and landscape, and 1024px+ desktop viewports for clipping, overlap, and horizontal overflow.
9. Confirm offline operation: no external URLs, runtime fetches, console errors, or missing assets are required.

Record any limitations plainly in the final handoff. Do not claim tests or browser checks that were not run.

## Definition of done

The work is complete when `WORDLE.html` directly opens into the complete playable game, meets the acceptance checklist in the design document, remains self-contained, and has been validated according to the workflow above. Summarize files changed and validation results in the final response.
