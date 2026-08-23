# Infinite Wordle — Production Design

## 1. Product summary

Build a polished, accessible Wordle-style game named Infinite Wordle that ships as one self-contained `WORDLE.html` file. HTML, CSS, JavaScript, word data, and SVG/icon assets must all live in that file. Opening it directly in a modern desktop or mobile browser must work fully offline, without a server, package installation, network access, or build step.

The game uses the familiar five-letter, six-guess format. A player enters a valid word, receives letter-position feedback, and either solves the hidden word or exhausts their attempts. The game supports a daily puzzle and a random-practice mode.

## 2. Goals and non-goals

### Goals

- Fast, attractive, responsive play on desktop and touch devices.
- Accurate duplicate-letter scoring compatible with standard Wordle behavior.
- Fully keyboard-accessible gameplay with useful screen-reader feedback.
- Persistent daily-game state and player statistics using `localStorage`.
- Deterministic daily puzzle selection that is the same for every local player on a calendar day.
- No external assets, analytics, frameworks, fonts, or requests.
- Everyday, recognizable five-letter English words only; avoid technical, archaic, dialect-specific, highly regional, inflected-only, or otherwise obscure vocabulary.

### Non-goals

- Multiplayer, accounts, leaderboards, backend services, ads, or monetization.
- Exact cloning of Wordle branding, proprietary word lists, visual assets, or copy.
- Support for browsers without modern ES2015+ JavaScript and CSS Grid/Flexbox.

## 3. Functional requirements

### Core game loop

1. Render a 5-column × 6-row game board and an on-screen QWERTY keyboard.
2. Accept physical-keyboard and on-screen-keyboard letters, Backspace/Delete, and Enter.
3. Permit submission only when the row has five letters and the word is in the embedded allowed-word list.
4. Animate accepted guesses, then score each tile:
   - **Correct**: right letter in the right position.
   - **Present**: right letter in a different position.
   - **Absent**: letter not remaining in the answer.
5. Score duplicate letters correctly: mark exact-position matches first, consume them, then mark remaining matches as present only while answer-letter counts remain.
6. End the game immediately after a correct guess or the sixth scored guess.
7. Lock board input once complete, announce the result, and show the result dialog.

### Daily and practice modes

- **Daily** is the default. Select its answer deterministically from the solution list using a documented fixed epoch and the user's local calendar date.
- A completed daily puzzle resumes exactly where it was left after reload; a new day begins a new game.
- **Practice** starts a fresh randomly selected answer and does not overwrite daily progress or daily statistics.
- Provide a clearly visible **New word** control that can start a fresh practice round at any time, plus controls to return to daily mode, open help, and view statistics.

### Persistence and statistics

Use namespaced `localStorage` keys, versioned in case the data schema changes. Persist:

- Current daily game date, answer identifier/answer, guesses, active row, completion state, and mode.
- Statistics: games played, wins, current streak, maximum streak, and wins by guess count (1–6).
- User preferences such as dark mode and optional high-contrast colors.

If storage is blocked, keep the game playable for the current page session and fail silently except for a non-disruptive optional notice.

### User feedback

- Show a transient toast for invalid length, unknown word, win, and loss.
- Include a help dialog explaining feedback colors and controls.
- Include a result dialog with outcome, answer on loss, stats, and a compact text-share result. Use `navigator.clipboard.writeText` when available with a robust fallback.
- Display a countdown to the next local daily puzzle after daily completion.

## 4. UX and visual design

- Use a clean original visual identity; do not use Wordle logo, name treatment, or copied artwork.
- Layout: compact header, centered responsive board, keyboard below it, dialogs as modal overlays.
- Tile states must be distinguishable by more than color (e.g., animation/labels for assistive tech); choose color-blind-considerate default colors.
- Fit common phones without horizontal scroll. Support safe-area padding and portrait/landscape phone, tablet, and desktop layouts.
- Responsive breakpoints should be designed around content constraints rather than device brands: at approximately 320–374px, keep the board within the viewport with tiles around 48–56px and compact keyboard gaps; at 375–767px, use the available width while preserving comfortable touch targets; at 768–1023px, center a moderately sized game column and avoid stretching controls excessively; at 1024px and wider, use a balanced desktop composition with board and keyboard widths capped for readability.
- The page must remain usable in tablet split-screen and rotated landscape modes. Use fluid sizing (`clamp`, percentages, and max-widths), `min-height: 100dvh`, and `env(safe-area-inset-*)` where supported. Never require horizontal scrolling or pinch zoom to play.
- On short landscape screens, allow the board/keyboard region to scroll vertically while keeping controls reachable; do not overlap the browser's safe areas. On touch devices, disable accidental text selection and double-tap zoom on game controls while preserving normal zoom for explanatory text.
- Respect `prefers-reduced-motion`; disable or substantially reduce flip/shake/bounce animations.
- Use system fonts; all controls need clear focus indicators, readable contrast, and 44px-ish touch targets where practical.

## 5. Accessibility requirements

- Use semantic buttons for keyboard keys and controls.
- Make the board understandable with an accessible label and each tile's state exposed after scoring.
- Include an `aria-live="polite"` status region for validation feedback and result announcements.
- Trap focus inside open modal dialogs; Escape closes non-result dialogs. Restore focus to the invoking control.
- Do not rely solely on hover or color. Verify operation using only keyboard (letters, Enter, Backspace, Tab, Escape).

## 6. Technical architecture

`WORDLE.html` is the only runtime artifact, arranged in this order:

1. Document metadata and inline `<style>`.
2. Semantic application markup: header, game section, keyboard, live region, and hidden dialogs.
3. One `<script>` containing constants/data, state, pure game logic, persistence, rendering, input handlers, dialogs, and initialization.

Keep the JavaScript organized into small named functions. Separate pure logic from DOM updates whenever useful:

- `evaluateGuess(guess, answer)` returns a five-element result array (`correct`, `present`, `absent`).
- `getDailyPuzzleIndex(date)` is deterministic and documented.
- State changes call a single `render()` (or focused render functions) to update UI consistently.
- Keyboard state always retains the strongest known status: correct > present > absent.

Embed two intentionally different vocabularies: (1) a curated set of five-letter solutions containing only common, broadly recognizable English words suitable for a general audience, and (2) a broad accepted-word dictionary containing every alphabetic five-letter entry and ordinary inflected variant from the downloaded `dwyl/english-words` `words_alpha.txt` snapshot. The accepted dictionary may include technical, archaic, regional, or obscure entries because it is for validating guesses, not selecting answers. Normalize consistently, and ensure every solution appears in the accepted dictionary. The source is downloaded at build time and embedded; runtime gameplay must never fetch it.

## 7. Edge cases and quality bar

- Ignore letter input after completion and while a guess animation/scoring sequence is active.
- Normalize physical key input case-insensitively; prevent page scrolling on game-control keys when appropriate.
- Do not accept repeated Enter presses as multiple guesses.
- Do not expose an answer through the UI before completion; do not log it in normal operation.
- Recover from malformed/old `localStorage` data by clearing only this app's affected record and starting safely.
- Avoid console errors and uncaught promise rejections.
- Keep the complete file reasonably legible and under a practical size target of 250 KB uncompressed where word-list quality permits.

## 8. Acceptance checklist

- Opening `WORDLE.html` directly starts a playable daily game offline, with no network requests.
- The board, physical keyboard, and virtual keyboard all work.
- Known duplicate-letter cases produce correct feedback.
- Invalid words and incomplete guesses do not advance a row.
- Common everyday guesses such as `PEARS` and `LOOKS` are accepted when present in the embedded allow-list.
- Standard five-letter dictionary words such as `CATER`, including valid variants, are accepted even when they are not possible daily answers.
- The New word control starts a different practice answer immediately without altering daily progress.
- Win/loss behavior, dialog, share result, and next-puzzle countdown work.
- Reloading resumes daily state; a simulated different date selects a new daily puzzle.
- Practice mode is independent from daily state and can restart.
- Stats/streaks update once per completed daily game and survive reloads.
- Layout works at approximately 320px wide and desktop widths.
- Layout works at approximately 320px phone width, common 375–430px phone widths, 768px tablet width in portrait and landscape, and 1024px+ desktop widths without clipping or horizontal scrolling.
- Keyboard-only and reduced-motion paths are usable.

## 9. Suggested autonomous delivery sequence

1. Create the semantic single-file shell, tokens/styles, board, keyboard, and dialogs.
2. Implement state and pure scoring logic; add a small embedded word dataset.
3. Add input, scoring animation, end-game flow, and keyboard-state updates.
4. Add daily selection, persistence, practice mode, statistics, share, and countdown.
5. Perform manual verification using the acceptance checklist; fix regressions and keep the artifact self-contained.
