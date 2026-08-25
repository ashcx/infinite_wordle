    "use strict";
    /*
      Infinite Wordle is a GitHub Pages-hosted game. The answer list is curated toward
      common, everyday English; it is not a frequency-ranked dictionary.
      Daily index = local calendar days since 2024-01-01 modulo answer count.
    */
    const WORD_LENGTHS = [4, 5, 6, 7];
    const MAX_GUESSES_BY_LENGTH = { 7: 10 };
    const WORD_LIST_URLS = {
      4: { solutions: "data/solutions-4.txt", accepted: "data/accepted-4.txt" },
      5: { solutions: "data/solutions.txt", accepted: "data/accepted-words.txt" },
      6: { solutions: "data/solutions-6.txt", accepted: "data/accepted-6.txt" },
      7: { solutions: "data/solutions-7.txt", accepted: "data/accepted-7.txt" }
    };
    let wordLists = {};
    let selectedLength = 5;
    let SOLUTIONS = [];
    const EXTRA_GUESSES = [
      "ADDED","ADORE","ADULT","AGILE","ALERT","AMAZE","AMEND","ANKLE","ASSET","AVERT","BASIC","BEARD","BEAST","BEGAN","BERRY","BLADE","BLANK","BLAST","BLEND","BLUES","BLUNT","BOAST","BONUS","BRAIN","BRICK","BRUSH","BURST","CANDY","CANOE","CARVE","CLOUD","COAST","COMMA","CORAL","CREPT","CRISP","CROSS","CYCLE","DECAF","DECOY","DEFER","DITCH","DIZZY","DODGE","DONOR","DRAIN","DRAPE","DRIED","DRILL","DWELL","EAGER","EAGLE","EARNS","EASED","EDGES","EIGHT","ELBOW","EMBER","EMPTY","ENACT","ENEMY","ENJOY","EPOXY","ESSAY","ETHIC","EXACT","FAIRY","FERRY","FEVER","FIERY","FILTH","FINER","FLAIR","FLAKE","FLANK","FLARE","FLEET","FLINT","FLOCK","FLOOD","FLOSS","FROST","FRONT","GAMES","GAMMA","GHOST","GIVEN","GLOVE","GRAIN","GRANT","GRAVE","GRAZE","GRIEF","GRILL","GRIND","GROVE","GUMMY","HABIT","HALVE","HANDY","HARDY","HASTE","HAUNT","HAVEN","HEARD","HEELS","HONEY","HONOR","HOURS","HOVER","HUMOR","HURRY","IDEAS","INBOX","INFER","INNER","IRONY","IVORY","JEWEL","JOLLY","KNEEL","KNOWN","LANCE","LEAKY","LEMON","LIVID","LOBBY","LODGE","LOVER","MAGMA","MANOR","MARRY","MAYOR","MERCY","MERRY","METER","MIGHT","MIMIC","MOTEL","MOTTO","MOVES","MURAL","NOBLE","NOMAD","NORTH","OASIS","OCCUR","OLIVE","OPERA","ORBIT","ORGAN","PASTA","PATCH","PATIO","PENCE","PERKY","PERRY","PESKY","PICKY","PLANK","PLAZA","PLEAD","PLUCK","POACH","POEMS","PORCH","PRANK","PROBE","PROSE","PROUD","PROWL","PULSE","PURSE","QUILT","QUIRK","RANCH","RAVEN","REACT","REIGN","RELAY","RENEW","REPAY","RIDER","RIDGE","ROAST","ROBIN","ROBOT","ROCKY","ROGER","ROOST","SAFER","SAINT","SALAD","SAUCE","SAUNA","SAVOR","SCARF","SCARY","SCOUT","SCRAP","SEEDY","SHACK","SHAME","SHARK","SHAVE","SHINY","SHORE","SHOUT","SHRUG","SIXTH","SKULL","SLANG","SLOPE","SLOTH","SLUNG","SNEAK","SNORE","SNOWY","SOLAR","SORRY","SPICE","SPIKE","SPILL","SPINE","SPOON","SPRAY","SQUAD","STAIR","STALE","STARE","STEER","STERN","STICK","STING","STOMP","STRAW","SWEEP","SWELL","SWING","SWORD","TACIT","TANGY","TAPER","TEASE","TEMPO","TENOR","TENTH","THUMB","TIGER","TIMER","TIPSY","TOKEN","TOPAZ","TORCH","TORSO","TOXIC","TRAMP","TRASH","TREAD","TREND","TROLL","TUTOR","TWIRL","UNCUT","UNFED","UNFIT","USHER","UTTER","VAPOR","VAULT","VENOM","VERGE","VITAL","VOTER","WAGON","WALTZ","WEAVE","WEIRD","WHEEL","WHISK","WHOLE","WIDEN","WINDY","WIPER","WITCH","WOKEN","WOVEN","WRIST","YACHT","YEARN","ZEBRA"
    ];
    // Keep common inflections and everyday nouns available as guesses even
    // when they are not selected as daily answers.
    const COMMON_GUESSES = [
      "ASKED","BARES","BEARS","BILLS","BLUSH","BOOTS","BOXES","BROOM","CHAIR","CHIPS","CHOIR","CHORE","CIGAR","CLOTH","COINS","COUGH","CRATE","CROPS","CURLY","DARES","DEALS","DREAM","DRIES","EARED","EASES","FEARS","FEEDS","FEELS","FIRMS","FISHY","FLOWS","FOODS","FOOLS","FROGS","GOODS","HABIT","HANDS","HILLS","HOMES","HOOPS","JOKES","KICKS","KILLS","KNEES","LAKES","LIKES","LIMBS","LIONS","LOADS","LOANS","LOCKS","LOOKS","LOVES","MEALS","MEETS","MESSY","MILLS","MOMMY","NAMES","NEARS","NEEDS","OASES","OPENS","PAGES","PAIRS","PANTS","PARKS","PARTS","PASTA","PEARS","PICKS","PILES","PLAYS","POOLS","PULLS","RACES","RAINS","RAKES","REARS","REEDS","REELS","ROADS","ROOMS","ROPES","SAILS","SAVES","SEATS","SEEMS","SELLS","SHOES","SHOPS","SINGS","SIZES","SKIES","SLIPS","SMELL","SNACK","SOCKS","SONGS","STARS","STAYS","STEPS","STOPS","STRAW","STUFF","TAKES","TALKS","TANKS","TEARS","TELLS","THUMB","TILES","TOOLS","TRIPS","TURNS","USERS","WALKS","WALLS","WANTS","WARMS","WAVES","WEARS","WEEKS","WELLS","WORSE","YEARS"
    ];
    let DICTIONARY_WORDS = [];
    let ALLOWED = new Set();
    const KEY_ROWS = [["Q","W","E","R","T","Y","U","I","O","P"],["A","S","D","F","G","H","J","K","L"],["ENTER","Z","X","C","V","B","N","M","BACK"]];
    const KEY_RANK = { absent: 1, present: 2, correct: 3 };
    const STORAGE = { daily: "single-file-word-game:v2:daily", stats: "single-file-word-game:v2:stats", prefs: "single-file-word-game:v2:prefs" };
    const EPOCH_UTC = Date.UTC(2024, 0, 1);
    function maxGuesses(length = selectedLength) { return MAX_GUESSES_BY_LENGTH[length] || 6; }
    const DEFAULT_STATS = (length = selectedLength) => ({ played: 0, wins: 0, currentStreak: 0, maxStreak: 0, distribution: Array(maxGuesses(length)).fill(0), lastWinDate: null, lastPlayedDate: null });
    const $ = id => document.getElementById(id);
    const boardEl = $("board"), keyboardEl = $("keyboard"), statusEl = $("status"), toastEl = $("toast");
    let state;
    let stats = DEFAULT_STATS();
    let prefs = normalizePrefs(readJson(STORAGE.prefs, { theme: "light", contrast: false, length: 5 }));
    let toastTimer = null;
    let modalId = null;
    let modalReturnFocus = null;

    function parseWordList(text, length) {
      const pattern = new RegExp(`^[A-Z]{${length}}$`);
      return [...new Set(text.split(/\r?\n/).map(word => word.trim().toUpperCase()).filter(word => pattern.test(word)))];
    }
    async function loadWordLists() {
      const entries = await Promise.all(WORD_LENGTHS.map(async length => {
        const urls = WORD_LIST_URLS[length];
        const responses = await Promise.all([fetch(urls.solutions), fetch(urls.accepted)]);
        if (responses.some(response => !response.ok)) throw new Error(`Word list request failed for ${length}`);
        const [solutionsText, acceptedText] = await Promise.all(responses.map(response => response.text()));
        const solutions = parseWordList(solutionsText, length);
        const accepted = parseWordList(acceptedText, length);
        if (!solutions.length || !accepted.length || solutions.some(word => !accepted.includes(word))) throw new Error(`Word list is empty or inconsistent for ${length}`);
        const extras = length === 5 ? [...EXTRA_GUESSES, ...COMMON_GUESSES] : [];
        return [length, { solutions, accepted, allowed: new Set([...accepted, ...solutions, ...extras]) }];
      }));
      wordLists = Object.fromEntries(entries);
      applyWordList(selectedLength);
    }
    function applyWordList(length) {
      if (!WORD_LENGTHS.includes(length) || !wordLists[length]) return;
      selectedLength = length;
      const list = wordLists[length];
      SOLUTIONS = list.solutions;
      DICTIONARY_WORDS = list.accepted;
      ALLOWED = list.allowed;
      document.documentElement.dataset.length = String(length);
      const select = $("lengthSelect");
      if (select) select.value = String(length);
    }

    function readJson(key, fallback) {
      try { const value = JSON.parse(localStorage.getItem(key)); return value && typeof value === "object" ? value : fallback; } catch (_) { return fallback; }
    }
    function writeJson(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) { /* offline/session-only fallback */ } }
    function normalizeStats(value, length = selectedLength) {
      const fallback = DEFAULT_STATS(length);
      return { played: Number.isFinite(value && value.played) ? Math.max(0, value.played) : 0, wins: Number.isFinite(value && value.wins) ? Math.max(0, value.wins) : 0, currentStreak: Number.isFinite(value && value.currentStreak) ? Math.max(0, value.currentStreak) : 0, maxStreak: Number.isFinite(value && value.maxStreak) ? Math.max(0, value.maxStreak) : 0, distribution: Array.isArray(value && value.distribution) && value.distribution.length === maxGuesses(length) ? value.distribution.map(number => Number.isFinite(number) ? Math.max(0, number) : 0) : fallback.distribution, lastWinDate: typeof (value && value.lastWinDate) === "string" ? value.lastWinDate : null, lastPlayedDate: typeof (value && value.lastPlayedDate) === "string" ? value.lastPlayedDate : null };
    }
    function normalizePrefs(value) { return { theme: value && value.theme === "dark" ? "dark" : "light", contrast: Boolean(value && value.contrast), length: WORD_LENGTHS.includes(Number(value && value.length)) ? Number(value.length) : 5 }; }
    function localDateKey(date = new Date()) { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`; }
    function dayNumber(date = new Date()) { return Math.floor((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - EPOCH_UTC) / 86400000); }
    function getDailyPuzzleIndex(date = new Date()) { return ((dayNumber(date) % SOLUTIONS.length) + SOLUTIONS.length) % SOLUTIONS.length; }
    function lengthStorageKey(base, length = selectedLength) { return `${base}:${length}`; }
    function newGame(mode, answer) { return { mode, length: selectedLength, dateKey: mode === "daily" ? localDateKey() : null, answer, guesses: [], current: "", status: "playing", scored: [], animatingRow: null }; }
    function isValidGuess(value) { const pattern = new RegExp(`^[A-Z]{${selectedLength}}$`); return typeof value === "string" && pattern.test(value) && ALLOWED.has(value); }
    function isValidScore(value) { return Array.isArray(value) && value.length === selectedLength && value.every(outcome => outcome === "correct" || outcome === "present" || outcome === "absent"); }
    function loadStats(length = selectedLength) { stats = normalizeStats(readJson(lengthStorageKey(STORAGE.stats, length), DEFAULT_STATS(length)), length); }
    function loadDaily() {
      const today = localDateKey();
      const saved = readJson(lengthStorageKey(STORAGE.daily), null);
      if (saved && saved.length === selectedLength && saved.dateKey === today && SOLUTIONS.includes(saved.answer) && Array.isArray(saved.guesses) && Array.isArray(saved.scored)) {
        const guesses = saved.guesses.slice(0, maxGuesses(selectedLength));
        const scored = saved.scored.slice(0, maxGuesses(selectedLength));
        const current = typeof saved.current === "string" && new RegExp(`^[A-Z]{0,${selectedLength}}$`).test(saved.current) ? saved.current : "";
        const status = saved.status === "won" || saved.status === "lost" ? saved.status : "playing";
        if (guesses.length === scored.length && guesses.every(isValidGuess) && scored.every(isValidScore)) {
          return { ...newGame("daily", saved.answer), mode: "daily", length: selectedLength, dateKey: today, answer: saved.answer, guesses, current: status === "playing" && guesses.length < maxGuesses(selectedLength) ? current : "", status: status === "playing" && guesses.length >= maxGuesses(selectedLength) ? "lost" : status, scored, counted: Boolean(saved.counted), animatingRow: null };
        }
      }
      const fresh = newGame("daily", SOLUTIONS[getDailyPuzzleIndex()]);
      writeJson(lengthStorageKey(STORAGE.daily), fresh);
      return fresh;
    }
    function saveDaily() { if (state.mode === "daily") writeJson(lengthStorageKey(STORAGE.daily, state.length), state); }
    function evaluateGuess(guess, answer) {
      const length = guess.length;
      const result = Array(length).fill("absent");
      const remaining = {};
      for (let i = 0; i < length; i++) {
        if (guess[i] === answer[i]) result[i] = "correct";
        else remaining[answer[i]] = (remaining[answer[i]] || 0) + 1;
      }
      for (let i = 0; i < length; i++) {
        if (result[i] === "correct") continue;
        if (remaining[guess[i]] > 0) { result[i] = "present"; remaining[guess[i]]--; }
      }
      return result;
    }
    function tileLabel(letter, result) { return result ? `${letter}, ${result}` : (letter ? `${letter}, not scored` : "empty"); }
    function renderBoard() {
      boardEl.innerHTML = "";
      boardEl.setAttribute("aria-label", `${maxGuesses(state.length)} guesses, ${state.length} letters each`);
      for (let row = 0; row < maxGuesses(state.length); row++) {
        const guess = state.guesses[row] || (row === state.guesses.length && state.status === "playing" ? state.current : "");
        const result = state.scored[row] || [];
        for (let col = 0; col < state.length; col++) {
          const tile = document.createElement("div");
          const letter = guess[col] || "";
          const outcome = result[col];
          tile.className = `tile ${letter ? "filled" : ""} ${outcome || ""}`;
          if (outcome) tile.style.setProperty("--delay", `${col * 120}ms`);
          // Only the row submitted in the current turn animates. Re-rendering
          // while typing must not replay older rows' reveal animations.
          if (outcome && state.animatingRow === row) tile.classList.add("flip");
          tile.setAttribute("role", "gridcell");
          tile.setAttribute("aria-label", tileLabel(letter, outcome));
          tile.textContent = letter;
          boardEl.appendChild(tile);
        }
      }
    }
    function keyboardStatuses() {
      const result = {};
      state.guesses.forEach((guess, index) => {
        (state.scored[index] || evaluateGuess(guess, state.answer)).forEach((outcome, i) => {
          const letter = guess[i];
          if (!letter || (KEY_RANK[outcome] || 0) > (KEY_RANK[result[letter]] || 0)) result[letter] = outcome;
        });
      });
      return result;
    }
    function renderKeyboard() {
      const statuses = keyboardStatuses();
      keyboardEl.innerHTML = "";
      KEY_ROWS.forEach((row, rowIndex) => {
        const rowEl = document.createElement("div"); rowEl.className = "key-row";
        row.forEach(key => {
          const button = document.createElement("button");
          button.type = "button"; button.className = `key ${key.length > 1 ? "wide" : ""} ${statuses[key] || ""}`;
          button.dataset.key = key; button.textContent = key === "BACK" ? "⌫" : key;
          button.setAttribute("aria-label", key === "BACK" ? "Backspace" : key === "ENTER" ? "Enter guess" : `Letter ${key}`);
          if (statuses[key]) button.setAttribute("aria-label", `${button.getAttribute("aria-label")}, ${statuses[key]}`);
          rowEl.appendChild(button);
        });
        keyboardEl.appendChild(rowEl);
      });
    }
    function render() {
      document.documentElement.dataset.length = String(state.length);
      $("lengthSelect").disabled = Boolean(state.scoring);
      $("modeLabel").textContent = `${state.mode === "daily" ? "Daily puzzle" : "Practice round"} · ${state.length} letters`;
      $("newGameButton").textContent = state.mode === "daily" ? "New practice word" : "New word";
      $("modeButton").textContent = state.mode === "daily" ? "Try practice" : "Back to daily";
      renderBoard(); renderKeyboard();
      if (state.status === "playing") statusEl.textContent = `${maxGuesses(state.length) - state.guesses.length} ${maxGuesses(state.length) - state.guesses.length === 1 ? "guess" : "guesses"} left`;
      else statusEl.textContent = state.status === "won" ? "Solved" : `The word was ${state.answer}`;
    }
    function showToast(message) {
      clearTimeout(toastTimer); toastEl.textContent = message; toastEl.classList.add("show");
      toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
    }
    function setStatus(message) { statusEl.textContent = message; showToast(message); }
    function submitGuess() {
      if (state.status !== "playing" || state.current.length !== state.length || state.scoring) {
        if (state.status === "playing" && state.current.length !== state.length) setStatus("Not enough letters");
        return;
      }
      const guess = state.current;
      if (!ALLOWED.has(guess)) { setStatus("That word is not in the list"); shakeCurrentRow(); return; }
      state.scoring = true;
      const result = evaluateGuess(guess, state.answer);
      state.guesses.push(guess); state.scored.push(result); state.current = ""; state.animatingRow = state.guesses.length - 1;
      if (state.mode === "daily") saveDaily();
      render();
      const finish = () => {
        state.scoring = false; state.animatingRow = null;
        if (guess === state.answer) { state.status = "won"; onDailyComplete(); }
        else if (state.guesses.length === maxGuesses(state.length)) { state.status = "lost"; onDailyComplete(); }
        if (state.mode === "daily") saveDaily();
        render();
        if (state.status !== "playing") {
          setStatus(state.status === "won" ? "You solved it!" : `The answer was ${state.answer}`);
          setTimeout(() => openResult(), 280);
        }
      };
      setTimeout(finish, window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 30 : 680);
    }
    function shakeCurrentRow() {
      const start = state.guesses.length * state.length;
      [...boardEl.children].slice(start, start + state.length).forEach(tile => tile.classList.add("shake"));
    }
    function inputKey(key) {
      if (state.status !== "playing" || state.scoring) return;
      if (key === "ENTER") return submitGuess();
      if (key === "BACK") { state.current = state.current.slice(0, -1); saveDaily(); render(); return; }
      if (/^[A-Z]$/.test(key) && state.current.length < state.length) { state.current += key; saveDaily(); render(); }
    }
    function onDailyComplete() {
      if (state.mode !== "daily" || state.counted) return;
      state.counted = true;
      stats.played++;
      const today = localDateKey();
      if (state.status === "won") {
        stats.wins++; stats.distribution[state.guesses.length - 1]++;
        if (stats.lastWinDate === localDateKey(new Date(Date.now() - 86400000))) stats.currentStreak++; else stats.currentStreak = 1;
        stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak); stats.lastWinDate = today;
      } else stats.currentStreak = 0;
      stats.lastPlayedDate = today; writeJson(lengthStorageKey(STORAGE.stats, state.length), stats);
    }
    function resultGrid() { return state.scored.map(row => row.map(x => x === "correct" ? "🟩" : x === "present" ? "🟨" : "⬛").join("")).join("\n"); }
    function shareText() { return `Infinite Wordle ${state.length} ${state.status === "won" ? state.guesses.length : "X"}/${maxGuesses(state.length)}\n\n${resultGrid()}`; }
    async function copyResult() {
      const text = shareText();
      try { await navigator.clipboard.writeText(text); showToast("Result copied"); $("shareButton").textContent = "Copied"; }
      catch (_) {
        const area = document.createElement("textarea"); area.value = text; area.setAttribute("readonly", ""); area.style.position = "fixed"; area.style.opacity = "0"; document.body.appendChild(area); area.select();
        try { document.execCommand("copy"); showToast("Result copied"); $("shareButton").textContent = "Copied"; } catch (__) { showToast("Copy unavailable — select the result manually"); } area.remove();
      }
    }
    function statsMarkup(target) {
      const values = [[stats.played,"Played"],[stats.wins,"Wins"],[stats.currentStreak,"Streak"],[stats.maxStreak,"Best"]];
      target.innerHTML = values.map(([value,label]) => `<div><div class="stat-value">${value}</div><div class="stat-label">${label}</div></div>`).join("");
    }
    function renderStats() {
      statsGridMarkup(); statsMarkup($("resultStats"));
    }
    function statsGridMarkup() {
      statsMarkup($("statsGrid")); const max = Math.max(1, ...stats.distribution);
      $("distribution").innerHTML = stats.distribution.map((value, i) => `<div class="dist-row"><span>${i+1}</span><span class="dist-bar" style="width:${Math.max(8, value / max * 100)}%">${value}</span></div>`).join("");
    }
    function openResult() {
      const win = state.status === "won";
      $("resultTitle").textContent = win ? "Nice solve" : "Round over";
      $("resultSummary").innerHTML = `<div class="result-label">${win ? "Solved in " + state.guesses.length + " guesses" : "The answer was"}</div><div class="result-word">${state.answer}</div><div class="result-label">Share your result</div><p style="white-space:pre-line;font-family:ui-monospace,monospace;line-height:1.35">${resultGrid()}</p>`;
      $("nextPuzzle").innerHTML = state.mode === "daily" ? `Next daily puzzle in <span class="countdown" id="countdown">—</span>` : "Practice does not change your daily statistics.";
      $("resultContinue").style.display = state.mode === "practice" ? "inline-block" : "none";
      $("shareButton").textContent = "Copy result"; renderStats(); openModal("resultModal"); updateCountdown();
    }
    function updateCountdown() {
      const countdown = $("countdown"); if (!countdown) return;
      const now = new Date(); const next = new Date(now); next.setHours(24,0,0,0); const diff = Math.max(0, next - now);
      countdown.textContent = `${String(Math.floor(diff / 3600000)).padStart(2,"0")}h ${String(Math.floor(diff % 3600000 / 60000)).padStart(2,"0")}m ${String(Math.floor(diff % 60000 / 1000)).padStart(2,"0")}s`;
    }
    function openModal(id) {
      modalReturnFocus = document.activeElement; modalId = id; const backdrop = $(id); backdrop.hidden = false; backdrop.querySelector(".modal").focus();
    }
    function closeModal(id = modalId) {
      if (!id) return; $(id).hidden = true; if (modalReturnFocus && modalReturnFocus.focus) modalReturnFocus.focus(); modalReturnFocus = null; modalId = null;
    }
    function toggleTheme() { prefs.theme = prefs.theme === "dark" ? "light" : "dark"; applyPrefs(); }
    function toggleContrast() { prefs.contrast = !prefs.contrast; applyPrefs(); $("contrastSwitch").setAttribute("aria-checked", String(prefs.contrast)); }
    function applyPrefs() { document.documentElement.dataset.theme = prefs.theme; document.documentElement.dataset.contrast = prefs.contrast ? "high" : "normal"; writeJson(STORAGE.prefs, prefs); $("themeButton").setAttribute("aria-label", prefs.theme === "dark" ? "Use light mode" : "Use dark mode"); }
    function switchLength(value) {
      const length = Number(value);
      if (!WORD_LENGTHS.includes(length) || !wordLists[length] || state && state.scoring) return;
      if (modalId) closeModal();
      applyWordList(length);
      prefs.length = length;
      writeJson(STORAGE.prefs, prefs);
      loadStats(length);
      if (state && state.mode === "practice") {
        const answer = SOLUTIONS[Math.floor(Math.random() * SOLUTIONS.length)];
        state = newGame("practice", answer);
      } else state = loadDaily();
      render();
      showToast(`${length}-letter game ready`);
    }
    function startPractice() {
      let answer = SOLUTIONS[Math.floor(Math.random() * SOLUTIONS.length)];
      while (SOLUTIONS.length > 1 && state && answer === state.answer) answer = SOLUTIONS[Math.floor(Math.random() * SOLUTIONS.length)];
      state = newGame("practice", answer); render(); showToast("New practice word ready");
    }
    function switchMode() { if (state.mode === "daily") startPractice(); else { state = loadDaily(); render(); } }
    function checkNewDay() { if (state && state.mode === "daily" && state.dateKey !== localDateKey()) { state = loadDaily(); render(); showToast("A new daily puzzle is ready"); } }
    function init() {
      applyWordList(prefs.length); applyPrefs(); $("contrastSwitch").setAttribute("aria-checked", String(Boolean(prefs.contrast)));
      loadStats(selectedLength);
      state = loadDaily(); render();
      keyboardEl.addEventListener("click", event => { const button = event.target.closest("button[data-key]"); if (button) inputKey(button.dataset.key); });
      document.addEventListener("keydown", event => { if (modalId) { if (event.key === "Escape" && modalId !== "resultModal") { closeModal(); return; } if (event.key === "Tab") { const modal = $(modalId).querySelector(".modal"); const focusable = [...modal.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])")].filter(node => !node.disabled); if (!focusable.length) return; const first = focusable[0], last = focusable[focusable.length - 1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } } return; } if (/^[a-zA-Z]$/.test(event.key)) { event.preventDefault(); inputKey(event.key.toUpperCase()); } else if (event.key === "Enter" || event.key === "Backspace" || event.key === "Delete") { event.preventDefault(); inputKey(event.key === "Enter" ? "ENTER" : "BACK"); } });
      $("lengthSelect").addEventListener("change", event => { if (state.scoring) { event.target.value = String(state.length); return; } switchLength(event.target.value); }); $("helpButton").addEventListener("click", () => openModal("helpModal")); $("statsButton").addEventListener("click", () => { renderStats(); openModal("statsModal"); }); $("themeButton").addEventListener("click", toggleTheme); $("contrastSwitch").addEventListener("click", toggleContrast); $("modeButton").addEventListener("click", switchMode); $("newGameButton").addEventListener("click", startPractice); $("shareButton").addEventListener("click", copyResult); $("resultContinue").addEventListener("click", () => { closeModal("resultModal"); switchMode(); }); $("brandLink").addEventListener("click", event => { event.preventDefault(); if (state.mode !== "daily") { state = loadDaily(); render(); } });
      document.querySelectorAll("[data-close]").forEach(button => button.addEventListener("click", () => closeModal(button.dataset.close)));
      document.querySelectorAll(".modal-backdrop").forEach(backdrop => backdrop.addEventListener("click", event => { if (event.target === backdrop && backdrop.id !== "resultModal") closeModal(backdrop.id); }));
      setInterval(() => { checkNewDay(); updateCountdown(); }, 1000);
    }
    loadWordLists().then(init).catch(() => { statusEl.textContent = "Word list unavailable. Please open Infinite Wordle through GitHub Pages."; });
  
