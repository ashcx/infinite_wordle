# Infinite Wordle — Production Design

## 1. Product summary

Build a polished, accessible Wordle-style game named Infinite Wordle for GitHub Pages. The repository ships a semantic `WORDLE.html` shell, external `styles.css` and `wordle.js` assets, plus eight same-site text word lists. The browser loads those assets over the Pages site; no server-side runtime, package installation, or backend is required.

The game supports 4-, 5-, and 6-letter variants with 6 guesses, plus a harder 7-letter variant with 10 guesses. A player selects the length from the top bar, enters a valid word, receives letter-position feedback, and either solves the hidden word or exhausts their attempts. Each length has its own answer pool, persistent round, and statistics. The first round opened on a new local calendar day uses that day's deterministic answer; **New word** then starts a fresh answer that persists across reloads until the round ends or another word is requested.

## 2. Goals and non-goals

### Goals

- Fast, attractive, responsive play on desktop and touch devices.
- Accurate duplicate-letter scoring compatible with standard Wordle behavior.
- Fully keyboard-accessible gameplay with useful screen-reader feedback.
- Persistent round state and player statistics using `localStorage`.
- Deterministic daily puzzle selection that is the same for every local player on a calendar day.
- No third-party assets, analytics, frameworks, or fonts; only relative requests to the eight repository word-list files.
- Everyday, recognizable English words only for answers; avoid technical, archaic, dialect-specific, highly regional, inflected-only, or otherwise obscure vocabulary.

### Non-goals

- Multiplayer, accounts, leaderboards, backend services, ads, or monetization.
- Exact cloning of Wordle branding, proprietary word lists, visual assets, or copy.
- Support for browsers without modern ES2015+ JavaScript and CSS Grid/Flexbox.

## 3. Functional requirements

### Core game loop

1. Render a length-specific 4-, 5-, or 6-column × 6-row board, or a 7-column × 10-row board, plus an on-screen QWERTY keyboard.
2. Accept physical-keyboard and on-screen-keyboard letters, Backspace/Delete, and Enter.
3. Permit submission only when the row has the selected number of letters and the word is in that length's loaded allowed-word list.
4. Animate accepted guesses, then score each tile:
   - **Correct**: right letter in the right position.
   - **Present**: right letter in a different position.
   - **Absent**: letter not remaining in the answer.
5. Score duplicate letters correctly: mark exact-position matches first, consume them, then mark remaining matches as present only while answer-letter counts remain.
6. End the game immediately after a correct guess, the sixth scored guess for 4–6-letter modes, or the tenth scored guess for 7-letter mode.
7. Lock board input once complete, announce the result, and show the result dialog.

### Round lifecycle

- On the first load of a new local calendar day, select the answer deterministically from the selected length's solution list using the documented fixed epoch and local date.
- Persist the active answer, guesses, current row, scoring state, and completion state across reloads.
- **New word** immediately replaces the active answer with a randomly selected solution word. The new round persists across reloads, including across calendar days, until it is solved, revealed after the guess limit, or replaced with another New word request.
- After a completed round is loaded again, start a fresh random round so the game can continue without a separate practice mode.
- Provide a top-bar length selector for 4, 5, 6, and 7 letters. Switching length loads that length's own persistent round and statistics without cross-contamination.

### Persistence and statistics

Use namespaced `localStorage` keys, versioned in case the data schema changes. Persist:

- Current round source/date, answer identifier/answer, guesses, active row, completion state, and selected length.
- Statistics for all completed rounds: games played, wins, current win streak, maximum win streak, and wins by guess count (1–6 for 4–6-letter modes; 1–10 for 7-letter mode).
- User preferences such as dark mode and optional high-contrast colors.

If storage is blocked, keep the game playable for the current page session and fail silently except for a non-disruptive optional notice.

### User feedback

- Show a transient toast for invalid length, unknown word, win, and loss.
- Include a help dialog explaining feedback colors and controls.
- Include a result dialog with outcome, answer on loss, stats, and a compact text-share result. Use `navigator.clipboard.writeText` when available with a robust fallback.
- Explain the deterministic daily seed and the New word lifecycle in Help.

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

`WORDLE.html` is the semantic runtime page. Its presentation lives in `styles.css` and its behavior lives in `wordle.js`. Each length has a same-site solution file and accepted dictionary file:

- Four letters: `data/solutions-4.txt`, `data/accepted-4.txt`
- Five letters: `data/solutions.txt`, `data/accepted-words.txt`
- Six letters: `data/solutions-6.txt`, `data/accepted-6.txt`
- Seven letters: `data/solutions-7.txt`, `data/accepted-7.txt`

1. Document metadata and links to `styles.css` and deferred `wordle.js`.
2. Semantic application markup: header, game section, keyboard, live region, and hidden dialogs.
3. `styles.css` containing tokens, responsive layout, component styles, and reduced-motion rules.
4. `wordle.js` containing constants/data, state, pure game logic, persistence, rendering, input handlers, dialogs, and initialization.

Keep the JavaScript organized into small named functions. Separate pure logic from DOM updates whenever useful:

- `evaluateGuess(guess, answer)` returns one result per selected letter (`correct`, `present`, `absent`).
- `getDailyPuzzleIndex(date)` is deterministic and documented.
- State changes call a single `render()` (or focused render functions) to update UI consistently.
- Keyboard state always retains the strongest known status: correct > present > absent.
- Keep `state.length` explicit on every game state. Select the matching list bundle before creating a game, and namespace round/stat records by length so changing the top-bar selector cannot mix answers or statistics.

Maintain two intentionally different vocabularies per length: (1) a curated solution set containing only common, broadly recognizable English words suitable for a general audience, and (2) a broad accepted-word dictionary containing every alphabetic entry of that length and ordinary inflected variant from the downloaded `dwyl/english-words` `words_alpha.txt` snapshot. The accepted dictionaries may include technical, archaic, regional, or obscure entries because they validate guesses rather than select answers. Normalize consistently and ensure every solution appears in its matching accepted dictionary. The browser loads all eight lists from relative same-site paths after page load and shows a recoverable error if any request fails.

## 7. Edge cases and quality bar

- Ignore letter input after completion and while a guess animation/scoring sequence is active.
- Normalize physical key input case-insensitively; prevent page scrolling on game-control keys when appropriate.
- Do not accept repeated Enter presses as multiple guesses.
- Do not expose an answer through the UI before completion; do not log it in normal operation.
- Recover from malformed/old `localStorage` data by clearing only this app's affected record and starting safely.
- Avoid console errors and uncaught promise rejections.
- Keep the complete file reasonably legible and under a practical size target of 250 KB uncompressed where word-list quality permits.

## 8. Acceptance checklist

- Opening the GitHub Pages site starts a playable daily game and loads all eight length-specific word lists from the published repository.
- The board, physical keyboard, and virtual keyboard all work.
- Known duplicate-letter cases produce correct feedback.
- Invalid words and incomplete guesses do not advance a row.
- Common everyday guesses such as `PEARS` and `LOOKS` are accepted in five-letter mode when present in the loaded allow-list.
- Standard dictionary words such as `CATER`, including valid variants, are accepted in five-letter mode even when they are not possible daily answers.
- Switching among 4-, 5-, 6-, and 7-letter modes updates the board, row count, input limits, scoring, answer source, round state, and statistics without cross-contamination.
- The New word control starts a different answer immediately and persists it across reloads.
- Win/loss behavior, dialog, and share result work without a separate practice/daily flow.
- Reloading resumes the active round; a simulated different date selects a new deterministic daily answer only when no New word round is active.
- A completed round is replaced by a fresh random round on the next load or New word request.
- Stats/streaks update once per completed round and survive reloads.
- Layout works at approximately 320px wide and desktop widths for all four lengths.
- Layout works at approximately 320px phone width, common 375–430px phone widths, 768px tablet width in portrait and landscape, and 1024px+ desktop widths without clipping or horizontal scrolling.
- Keyboard-only and reduced-motion paths are usable.

## 9. Suggested autonomous delivery sequence

1. Create the semantic HTML shell, external style sheet, board, keyboard, and dialogs.
2. Implement state and pure scoring logic; add and validate the eight repository word-list files.
3. Add input, scoring animation, end-game flow, and keyboard-state updates.
4. Add deterministic daily-start selection, unified round persistence, statistics, and share behavior.
5. Perform manual verification using the acceptance checklist; fix regressions and keep all runtime requests same-site and relative.
