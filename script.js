// ── Year ─────────────────────────────────────────
document.getElementById("year").textContent = new Date().getFullYear();

const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const effectsButton = document.getElementById("effects-toggle");
let effectsRequested = true;
let effectsEnabled = !motionPreference.matches;
let clockInitialized = false;

// Keep one upstream clock instance; the layer controls its visibility.
function initializeClock() {
  if (clockInitialized || !effectsEnabled || document.readyState !== "complete" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  if (!window.cursoreffects?.clockCursor) {
    console.error("Clock cursor could not load: cursor-effects library is unavailable.");
    return;
  }
  new window.cursoreffects.clockCursor({
    dateColor: "#c4b5fd",
    faceColor: "#e2e8f0",
    secondsColor: "#ec4899",
    minutesColor: "#a5b4fc",
    hoursColor: "#c4b5fd",
    zIndex: "60"
  });
  // Track mouse events on body, not the pointer-transparent display layer.
  const canvas = document.body.lastElementChild;
  if (!(canvas instanceof HTMLCanvasElement)) {
    console.error("Clock cursor initialization did not create the expected canvas.");
    return;
  }
  document.getElementById("clock-layer").appendChild(canvas);
  clockInitialized = true;
}

function updateEffects() {
  effectsEnabled = effectsRequested && !motionPreference.matches;
  document.documentElement.classList.toggle("effects-off", !effectsEnabled);
  effectsButton.textContent = `Effects: ${effectsEnabled ? "On" : "Off"}`;
  effectsButton.setAttribute("aria-pressed", String(effectsEnabled));
  effectsButton.disabled = motionPreference.matches;
  document.getElementById("effects-status").textContent = motionPreference.matches
    ? "Effects are off to respect your reduced-motion setting."
    : `Decorative effects are ${effectsEnabled ? "on" : "off"}. Games remain available.`;
  clearTimeout(typingTimer);
  if (effectsEnabled) {
    typingTimer = setTimeout(typeRole, 300);
    initializeClock();
  } else {
    typedEl.textContent = roles[0];
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("show"));
    document.getElementById("loader-overlay")?.remove();
  }
}
effectsButton.addEventListener("click", () => {
  effectsRequested = !effectsRequested;
  updateEffects();
});
motionPreference.addEventListener("change", updateEffects);
window.addEventListener("load", initializeClock);

// ── Splash loader dismiss ─────────────────────────
(function () {
  const loader = document.getElementById("loader-overlay");
  if (!loader) return;
  // Hide after 2.4s, or immediately once page is fully loaded — whichever comes last
  function hideLoader() {
    loader.classList.add("hidden");
    // Remove from DOM after transition ends so it doesn't block
    loader.addEventListener("transitionend", () => loader.remove(), { once: true });
    setTimeout(() => loader.remove(), 800);
  }
  if (document.readyState === "complete") {
    setTimeout(hideLoader, 2400);
  } else {
    window.addEventListener("load", () => setTimeout(hideLoader, 2400));
  }
})();

// ── Scroll progress ───────────────────────────────
const progressEl = document.getElementById("scroll-progress");
window.addEventListener("scroll", () => {
  const h = document.documentElement.scrollHeight - innerHeight;
  progressEl.style.width = (h ? (scrollY / h) * 100 : 0) + "%";
}, { passive: true });

// ── Mobile nav ────────────────────────────────────
const navbar    = document.getElementById("navbar");
const navToggle = document.getElementById("nav-toggle");
function setNavOpen(open) {
  navbar.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}
navToggle.addEventListener("click", () => setNavOpen(!navbar.classList.contains("open")));
document.querySelectorAll(".nav-links a").forEach(a =>
  a.addEventListener("click", () => setNavOpen(false))
);
navbar.addEventListener("keydown", event => {
  if (event.key === "Escape" && navbar.classList.contains("open")) {
    setNavOpen(false);
    navToggle.focus();
  }
});
window.matchMedia("(min-width: 961px)").addEventListener("change", () => setNavOpen(false));

// ── Reveal on scroll ──────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("show"); });
}, { threshold: 0.08 });
document.querySelectorAll(".reveal").forEach(el => revealObs.observe(el));

// ── Typing animation (multiple roles) ────────────
const roles = [
  "Senior System Administrator",
  "Windows Infrastructure Engineer",
  "VMware & PowerShell Specialist",
  "Production Operations Expert",
  "Gaming Enthusiast"
];

const typedEl = document.getElementById("typed-role");
let rIdx = 0, cIdx = 0, deleting = false;
let typingTimer = null;

function typeRole() {
  if (!typedEl || !effectsEnabled) return;
  const current = roles[rIdx];
  if (!deleting) {
    typedEl.textContent = current.slice(0, ++cIdx);
    if (cIdx === current.length) {
      deleting = true;
      typingTimer = setTimeout(typeRole, 2200);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, --cIdx);
    if (cIdx === 0) {
      deleting = false;
      rIdx = (rIdx + 1) % roles.length;
    }
  }
  typingTimer = setTimeout(typeRole, deleting ? 40 : 65 + Math.random() * 30);
}

updateEffects();

// ── Experience accordion ──────────────────────────
function toggleExp(header) {
  const card = header.closest(".exp-card");
  document.querySelectorAll(".exp-card").forEach(c => {
    if (c !== card) {
      c.classList.remove("active");
      c.querySelector(".exp-head").setAttribute("aria-expanded", "false");
    }
  });
  card.classList.toggle("active");
  header.setAttribute("aria-expanded", String(card.classList.contains("active")));
}

// ── Email reveal ──────────────────────────────────
function revealEmail() {
  const box = document.getElementById("email-box");
  const btn = document.getElementById("email-btn");
  const visible = box.classList.toggle("visible");
  box.setAttribute("aria-hidden", String(!visible));
  box.inert = !visible;
  btn.setAttribute("aria-expanded", String(visible));
  btn.textContent = visible ? "Hide Email" : "Email Me \uD83D\uDCEC";
}

const scriptChoices = document.querySelectorAll("[data-script]");
if (typeof labExamples === "undefined") {
  document.getElementById("script-status").textContent = "Code examples could not load. Use the direct download or reload the page.";
  document.getElementById("sample-toggle").disabled = true;
  scriptChoices.forEach(button => { button.disabled = true; });
  console.error("PowerShell lab data is missing.");
} else {
  function showScript(key) {
    const example = labExamples[key];
    document.getElementById("script-title").textContent = example.title;
    document.getElementById("script-description").textContent = example.description;
    document.getElementById("script-code").textContent = example.code;
    document.getElementById("script-download").href = example.file;
    document.getElementById("script-output").textContent = JSON.stringify(example.output, null, 2);
    document.getElementById("script-sample").hidden = true;
    document.getElementById("sample-toggle").setAttribute("aria-expanded", "false");
    document.getElementById("sample-toggle").textContent = "View Sample Output";
    scriptChoices.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.script === key)));
  }
  scriptChoices.forEach(button => button.addEventListener("click", () => {
    showScript(button.dataset.script);
    document.getElementById("script-status").textContent = `${labExamples[button.dataset.script].title} selected.`;
  }));
  document.getElementById("sample-toggle").addEventListener("click", event => {
    const sample = document.getElementById("script-sample");
    sample.hidden = !sample.hidden;
    event.currentTarget.setAttribute("aria-expanded", String(!sample.hidden));
    event.currentTarget.textContent = sample.hidden ? "View Sample Output" : "Hide Sample Output";
  });
  showScript("health");
}

const components = {
  dns: ["DNS", "Resolves service names to addresses so clients can locate the right endpoint.", "Network reachability, authoritative records and configured resolvers. AD uses DNS to locate domain services.", "Check the configured resolver and query the expected record. Separate name-resolution failures from application-port failures."],
  ad: ["Active Directory", "Provides domain identities, authentication and Group Policy for Windows environments.", "DNS, time synchronization, domain-controller reachability and replication health.", "Check authentication errors, time skew and replication status before making directory changes."],
  vmware: ["VMware", "Provides the virtualization layer for guest workloads through ESXi and vCenter management.", "Host networking, shared storage where used, capacity and management connectivity.", "Check host and datastore health, recent events and resource contention. HA restarts are not a substitute for backups."],
  windows: ["Windows Server", "Hosts operating-system services and application workloads inside the compute layer.", "Virtual or physical resources, DNS, identity where applicable and application dependencies.", "Correlate event logs, service state, free disk space and recent changes. A running service alone does not prove application health."],
  messaging: ["Messaging", "IBM MQ or RabbitMQ can decouple producers and consumers using managed messaging.", "Network listeners, permissions, certificates where TLS is used, storage and healthy consumers.", "Inspect queue depth trends, channel or connection state and application errors. Avoid deleting messages as a first response."],
  monitoring: ["Monitoring", "Collects infrastructure and application signals and turns useful symptoms into actionable alerts.", "Reachable targets, appropriate collection permissions, working agents or pollers and meaningful thresholds.", "Validate alert freshness and service impact, then correlate related signals. Treat a green dashboard as evidence, not proof."],
  backup: ["Backup & DR", "Provides recovery copies and tested procedures to recover services and data.", "Backup storage, credentials, retention, application consistency and a documented recovery plan.", "Review job results and run an authorized restore test. Check recovery against RPO and RTO; snapshots alone are not backups."]
};
document.querySelectorAll("[data-component]").forEach(button => {
  button.addEventListener("click", () => {
    const [title, role, dependencies, check] = components[button.dataset.component];
    document.getElementById("component-title").textContent = title;
    document.getElementById("component-role").textContent = role;
    document.getElementById("component-dependencies").textContent = dependencies;
    document.getElementById("component-check").textContent = check;
    document.querySelectorAll("[data-component]").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
    document.getElementById("component-status").textContent = `${title} selected. Details updated.`;
  });
});

// Mini-games run locally and never connect to real infrastructure.
(() => {
  const snakePanel = document.getElementById("snake-game");
  const quizPanel = document.getElementById("infra-quiz");
  const board = document.getElementById("snake-board");
  const context = board.getContext("2d");
  const snakeStatus = document.getElementById("snake-status");
  const pauseButton = document.getElementById("pause-snake");
  let snake = [];
  let direction = { x: 1, y: 0 };
  let nextDirection = direction;
  let food = null;
  let timer = null;
  let running = false;
  let score = 0;

  function drawSnake() {
    context.fillStyle = "#0d0d1a";
    context.fillRect(0, 0, 320, 320);
    context.strokeStyle = "#1e1e3f";
    for (let i = 0; i <= 320; i += 16) {
      context.beginPath();
      context.moveTo(i, 0);
      context.lineTo(i, 320);
      context.moveTo(0, i);
      context.lineTo(320, i);
      context.stroke();
    }
    if (food) {
      context.fillStyle = "#ec4899";
      context.fillRect(food.x * 16 + 2, food.y * 16 + 2, 12, 12);
    }
    snake.forEach((cell, index) => {
      context.fillStyle = index === 0 ? "#c4b5fd" : "#667eea";
      context.fillRect(cell.x * 16 + 1, cell.y * 16 + 1, 14, 14);
    });
  }

  function placeFood() {
    const free = [];
    for (let y = 0; y < 20; y++) {
      for (let x = 0; x < 20; x++) {
        if (!snake.some(cell => cell.x === x && cell.y === y)) free.push({ x, y });
      }
    }
    food = free[Math.floor(Math.random() * free.length)] || null;
  }

  function stopTimer() {
    clearInterval(timer);
    timer = null;
  }

  function endSnake(message) {
    stopTimer();
    running = false;
    pauseButton.disabled = true;
    snakeStatus.textContent = `${message} Score: ${score}. Select Start / Restart to play again.`;
  }

  function tickSnake() {
    direction = nextDirection;
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    const eating = head.x === food.x && head.y === food.y;
    const body = eating ? snake : snake.slice(0, -1);
    if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 ||
        body.some(cell => cell.x === head.x && cell.y === head.y)) {
      endSnake("Game over!");
      return;
    }
    snake.unshift(head);
    if (eating) {
      score++;
      placeFood();
      snakeStatus.textContent = `Playing. Score: ${score}`;
    } else {
      snake.pop();
    }
    drawSnake();
    if (!food) endSnake("You filled the board!");
  }

  function pauseSnake() {
    if (!running || timer === null) return;
    stopTimer();
    pauseButton.textContent = "Resume";
    snakeStatus.textContent = `Paused. Score: ${score}`;
  }

  function togglePause() {
    if (!running) return;
    if (timer !== null) {
      pauseSnake();
    } else {
      timer = setInterval(tickSnake, 150);
      pauseButton.textContent = "Pause";
      snakeStatus.textContent = `Playing. Score: ${score}`;
      board.focus({ preventScroll: true });
    }
  }

  document.getElementById("start-snake").addEventListener("click", () => {
    stopTimer();
    snake = [{ x: 7, y: 10 }, { x: 6, y: 10 }, { x: 5, y: 10 }];
    direction = { x: 1, y: 0 };
    nextDirection = direction;
    score = 0;
    running = true;
    placeFood();
    drawSnake();
    pauseButton.disabled = false;
    pauseButton.textContent = "Pause";
    snakeStatus.textContent = "Playing. Score: 0";
    timer = setInterval(tickSnake, 150);
    board.focus({ preventScroll: true });
  });
  pauseButton.addEventListener("click", togglePause);

  const directions = {
    up: { x: 0, y: -1 }, down: { x: 0, y: 1 },
    left: { x: -1, y: 0 }, right: { x: 1, y: 0 }
  };
  function steer(name) {
    const candidate = directions[name];
    if (running && (candidate.x !== -direction.x || candidate.y !== -direction.y)) {
      nextDirection = candidate;
    }
  }
  document.querySelectorAll("[data-direction]").forEach(button => {
    button.addEventListener("click", () => steer(button.dataset.direction));
  });
  board.addEventListener("keydown", event => {
    const keys = { ArrowUp: "up", w: "up", ArrowDown: "down", s: "down", ArrowLeft: "left", a: "left", ArrowRight: "right", d: "right" };
    const name = keys[event.key] || keys[event.key.toLowerCase()];
    if (name) {
      event.preventDefault();
      steer(name);
    } else if (event.code === "Space") {
      event.preventDefault();
      togglePause();
    }
  });
  window.addEventListener("blur", pauseSnake);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pauseSnake();
  });
  new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) pauseSnake();
  }).observe(board);

  function shuffled(items) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  const topicSelect = document.getElementById("quiz-topic");
  const quizQuestion = document.getElementById("quiz-question");
  const quizOptions = document.getElementById("quiz-options");
  const quizFeedback = document.getElementById("quiz-feedback");
  const quizNext = document.getElementById("quiz-next");
  const quizProgress = document.getElementById("quiz-progress");
  let round = [];
  let questionIndex = 0;
  let quizScore = 0;
  let answered = false;

  if (typeof infraQuestions === "undefined" || !infraQuestions.length) {
    document.getElementById("quiz-bank-info").textContent = "The question bank could not load. Please reload the page.";
    console.error("Infrastructure quiz data is missing.");
    topicSelect.disabled = true;
    document.getElementById("quiz-restart").disabled = true;
  } else {
    document.getElementById("quiz-bank-info").textContent = `${infraQuestions.length} original offline questions. Each round uses up to 10 questions without repeats.`;
    [...new Set(infraQuestions.map(item => item.topic))].sort().forEach(topic => {
      const option = document.createElement("option");
      option.value = topic;
      option.textContent = topic;
      topicSelect.appendChild(option);
    });
    startQuiz();
  }

  function startQuiz() {
    round = shuffled(infraQuestions.filter(item => topicSelect.value === "all" || item.topic === topicSelect.value)).slice(0, 10);
    questionIndex = 0;
    quizScore = 0;
    renderQuestion();
  }

  function renderQuestion() {
    const item = round[questionIndex];
    answered = false;
    quizFeedback.textContent = "";
    quizNext.disabled = true;
    quizNext.textContent = questionIndex === round.length - 1 ? "Finish Round" : "Next Question";
    quizProgress.textContent = `${item.topic} | Question ${questionIndex + 1}/${round.length} | Score: ${quizScore}`;
    quizQuestion.textContent = item.question;
    quizOptions.replaceChildren();
    shuffled([item.answer, ...item.distractors]).forEach(text => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = text;
      button.addEventListener("click", () => {
        if (answered) return;
        answered = true;
        const correct = text === item.answer;
        if (correct) quizScore++;
        [...quizOptions.children].forEach(option => {
          option.disabled = true;
          if (option.textContent === item.answer) option.classList.add("answer-correct");
        });
        if (!correct) button.classList.add("answer-wrong");
        quizFeedback.textContent = `${correct ? "Correct!" : `Not quite. Correct answer: ${item.answer}.`} ${item.explanation}`;
        quizProgress.textContent = `${item.topic} | Question ${questionIndex + 1}/${round.length} | Score: ${quizScore}`;
        quizNext.disabled = false;
        quizNext.focus({ preventScroll: true });
      });
      quizOptions.appendChild(button);
    });
  }
  quizNext.addEventListener("click", () => {
    if (!answered) return;
    questionIndex++;
    if (questionIndex === round.length) {
      quizQuestion.textContent = `Round complete! ${quizScore}/${round.length} correct.`;
      quizOptions.replaceChildren();
      quizFeedback.textContent = "Try another topic or start a new round.";
      quizNext.disabled = true;
    } else {
      renderQuestion();
    }
    quizQuestion.focus({ preventScroll: true });
  });
  topicSelect.addEventListener("change", startQuiz);
  document.getElementById("quiz-restart").addEventListener("click", startQuiz);

  const memoryBoard = document.getElementById("memory-board");
  const memoryStatus = document.getElementById("memory-status");
  let memoryCards = [];
  let revealed = [];
  let matched = new Set();
  let memoryMoves = 0;
  let memoryTimeout = null;
  function resetMemory() {
    clearTimeout(memoryTimeout);
    memoryTimeout = null;
    memoryCards = shuffled(["PC", "VM", "PS", "GG", "XP", "UP"].flatMap(value => [value, value]));
    revealed = [];
    matched = new Set();
    memoryMoves = 0;
    memoryBoard.replaceChildren();
    memoryCards.forEach((value, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.addEventListener("click", () => {
        if (revealed.length === 2 || matched.has(index) || revealed.includes(index)) return;
        revealed.push(index);
        if (revealed.length === 2) {
          memoryMoves++;
          if (memoryCards[revealed[0]] === memoryCards[revealed[1]]) {
            revealed.forEach(i => matched.add(i));
            revealed = [];
          } else {
            memoryTimeout = setTimeout(() => {
              revealed = [];
              memoryTimeout = null;
              renderMemory();
            }, 850);
          }
        }
        renderMemory();
      });
      memoryBoard.appendChild(button);
    });
    renderMemory();
  }
  function renderMemory() {
    [...memoryBoard.children].forEach((button, index) => {
      const visible = revealed.includes(index) || matched.has(index);
      button.textContent = visible ? memoryCards[index] : "?";
      button.setAttribute("aria-label", `Card ${index + 1}: ${visible ? memoryCards[index] : "hidden"}`);
      button.disabled = matched.has(index);
    });
    memoryStatus.textContent = matched.size === 12
      ? `All six pairs found in ${memoryMoves} moves!`
      : `${matched.size / 2}/6 pairs. Moves: ${memoryMoves}`;
  }
  document.getElementById("memory-restart").addEventListener("click", resetMemory);

  const reactionTarget = document.getElementById("reaction-target");
  const reactionStatus = document.getElementById("reaction-status");
  let reactionTimer = null;
  let reactionState = "idle";
  let greenTime = 0;
  function resetReaction() {
    clearTimeout(reactionTimer);
    reactionTimer = null;
    reactionState = "idle";
    reactionTarget.classList.remove("ready");
    reactionTarget.textContent = "Start Round";
    reactionStatus.textContent = "Ready when you are.";
  }
  reactionTarget.addEventListener("click", () => {
    if (reactionState === "idle") {
      reactionState = "waiting";
      reactionTarget.textContent = "Wait for green...";
      reactionStatus.textContent = "Wait...";
      reactionTimer = setTimeout(() => {
        reactionTimer = null;
        reactionState = "ready";
        greenTime = performance.now();
        reactionTarget.classList.add("ready");
        reactionTarget.textContent = "GO! Press now!";
        reactionStatus.textContent = "Green! Press the target.";
      }, 1500 + Math.random() * 2500);
    } else {
      const message = reactionState === "waiting"
        ? "Too soon! Start another round."
        : `${Math.round(performance.now() - greenTime)} ms. Nice reflexes!`;
      resetReaction();
      reactionStatus.textContent = message;
    }
  });
  function stopArcade() {
    pauseSnake();
    resetReaction();
    clearTimeout(memoryTimeout);
    memoryTimeout = null;
    revealed = [];
    renderMemory();
  }
  let currentGame = null;
  function chooseGame(name) {
    stopArcade();
    currentGame = name;
    ["snake", "memory", "reaction"].forEach(game => {
      document.getElementById(`${game}-content`).hidden = game !== name;
      document.querySelector(`[data-play-game="${game}"]`).setAttribute("aria-pressed", String(game === name));
    });
    if (name === "memory") resetMemory();
    document.getElementById("snake-game-title").textContent = { snake: "Snake Arcade", memory: "Memory Match", reaction: "Reaction Time" }[name];
  }
  function randomGame() {
    const games = ["snake", "memory", "reaction"].filter(game => game !== currentGame);
    chooseGame(games[Math.floor(Math.random() * games.length)]);
  }
  document.getElementById("random-game").addEventListener("click", randomGame);
  document.querySelectorAll("[data-play-game]").forEach(button => {
    button.addEventListener("click", () => chooseGame(button.dataset.playGame));
  });
  window.addEventListener("blur", resetReaction);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) resetReaction();
  });
  new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) resetReaction();
  }).observe(reactionTarget);
  resetMemory();
  drawSnake();

  const panels = [
    { panel: quizPanel, button: document.getElementById("open-quiz") },
    { panel: snakePanel, button: document.getElementById("open-snake") }
  ];
  function closeGames() {
    stopArcade();
    panels.forEach(({ panel, button }) => {
      panel.hidden = true;
      button.setAttribute("aria-expanded", "false");
    });
  }
  panels.forEach(({ panel, button }) => {
    button.addEventListener("click", () => {
      const wasHidden = panel.hidden;
      closeGames();
      if (wasHidden) {
        panel.hidden = false;
        if (panel === snakePanel) randomGame();
        button.setAttribute("aria-expanded", "true");
        panel.querySelector("button").focus({ preventScroll: true });
      }
    });
    panel.querySelector("[data-close-game]").addEventListener("click", () => {
      closeGames();
      button.focus({ preventScroll: true });
    });
    panel.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        closeGames();
        button.focus({ preventScroll: true });
      }
    });
  });
})();