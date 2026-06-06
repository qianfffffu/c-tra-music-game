const LANES = [
  { key: "a", tone: "宫", name: "gong", freq: 261.63, color: "#b77a38" },
  { key: "s", tone: "商", name: "shang", freq: 293.66, color: "#8c9ca4" },
  { key: "d", tone: "角", name: "jiao", freq: 329.63, color: "#4f8d63" },
  { key: "f", tone: "徵", name: "zhi", freq: 392.0, color: "#b94b3f" },
  { key: "g", tone: "羽", name: "yu", freq: 440.0, color: "#4d83bb" },
];

const INSTRUMENTS = [
  {
    id: "guqin",
    name: "古琴",
    tier: "基础版",
    desc: "沉静、留白，适合慢速入门谱面。",
    attack: 0.012,
    decay: 1.4,
    wave: "triangle",
    filter: 1800,
  },
  {
    id: "guzheng",
    name: "古筝",
    tier: "基础版",
    desc: "颗粒清晰，扫弦感更明亮。",
    attack: 0.006,
    decay: 1.05,
    wave: "sawtooth",
    filter: 2600,
  },
  {
    id: "yangqin",
    name: "扬琴",
    tier: "基础版",
    desc: "竹槌击弦，短促而有光泽。",
    attack: 0.002,
    decay: 0.72,
    wave: "square",
    filter: 3200,
  },
  {
    id: "harp",
    name: "竖琴",
    tier: "进阶版",
    desc: "柔和泛音，适合加入 Shift 变奏。",
    attack: 0.008,
    decay: 1.9,
    wave: "sine",
    filter: 4200,
  },
  {
    id: "bianzhong",
    name: "编钟",
    tier: "进阶版",
    desc: "金石余响，变奏音会带双泛音。",
    attack: 0.004,
    decay: 2.1,
    wave: "sine",
    filter: 5200,
  },
];

const SONGS = [
  {
    id: "gaoshan",
    title: "高山流水",
    source: "传统名曲，高频出现在古琴十大名曲榜单。",
    difficulty: "入门",
    bpm: 82,
    heat: "大众识别度极高",
    pattern: "宫 商 角 徵 羽 徵 角 商 宫 - 宫 角 徵 羽 +羽 徵 角 商 宫",
  },
  {
    id: "meihua",
    title: "梅花三弄",
    source: "传统古琴名曲，旋律记忆点强，适合三段变奏。",
    difficulty: "基础",
    bpm: 92,
    heat: "短视频/国风改编常见",
    pattern: "角 角 宫 商 角 - 徵 羽 +羽 徵 角 商 角 - 宫 商 角 徵 +徵 羽",
  },
  {
    id: "pingsha",
    title: "平沙落雁",
    source: "明清以来流传广泛，传统榜单常见。",
    difficulty: "基础",
    bpm: 88,
    heat: "古琴学习与演出常见曲目",
    pattern: "羽 徵 角 商 宫 - 商 角 徵 羽 徵 角 商 - 宫 +商 角 徵 羽",
  },
  {
    id: "xiaoxiang",
    title: "潇湘水云",
    source: "传统名曲，山水意象鲜明，适合流动型谱面。",
    difficulty: "进阶",
    bpm: 104,
    heat: "古琴经典曲库高频收录",
    pattern: "宫 角 商 徵 角 羽 +羽 徵 角 商 宫 - 商 角 徵 +徵 羽 徵 角 商 宫",
  },
  {
    id: "guangling",
    title: "广陵散",
    source: "大型古琴武曲代表，知名度与讨论度长期靠前。",
    difficulty: "进阶",
    bpm: 116,
    heat: "经典叙事性强",
    pattern: "宫 宫 商 角 +角 徵 羽 徵 角 商 宫 - 宫 商 角 徵 +羽 羽 徵 角 商 宫",
  },
  {
    id: "yangguan",
    title: "阳关三叠",
    source: "由诗歌意象流传而来，传统名曲榜单常见。",
    difficulty: "进阶",
    bpm: 98,
    heat: "人声/器乐改编传播广",
    pattern: "商 角 徵 - 商 角 徵 羽 +羽 徵 角 商 宫 商 角 - +徵 羽 徵 角 商",
  },
];

const SOURCES = [
  {
    title: "传统高频榜单",
    text: "多份古琴十大名曲榜单共同出现《高山流水》《广陵散》《梅花三弄》《平沙落雁》等。",
  },
  {
    title: "流传与教学热度",
    text: "优先选择琴谱、演奏、教学和国风内容中长期反复出现的曲目，而不是短期单个平台热歌。",
  },
  {
    title: "游戏化整理",
    text: "本项目使用五声音阶动机与节奏意象生成谱面，不复制完整古谱或商业录音。",
  },
];

const KEY_TO_LANE = Object.fromEntries(LANES.map((lane, index) => [lane.key, index]));
const CODE_TO_LANE = {
  KeyA: 0,
  KeyS: 1,
  KeyD: 2,
  KeyF: 3,
  KeyG: 4,
};
const TRAVEL_MS = 1900;
const PERFECT_MS = 90;
const GOOD_MS = 170;
const MISS_MS = 280;

const state = {
  instrument: INSTRUMENTS[0],
  song: SONGS[0],
  notes: [],
  running: false,
  practice: false,
  startedAt: 0,
  audio: null,
  score: 0,
  combo: 0,
  bestCombo: 0,
  hits: 0,
  misses: 0,
  total: 0,
  raf: 0,
};

const els = {
  instrumentGrid: document.querySelector("#instrumentGrid"),
  songList: document.querySelector("#songList"),
  sourceList: document.querySelector("#sourceList"),
  startBtn: document.querySelector("#startBtn"),
  practiceBtn: document.querySelector("#practiceBtn"),
  notesLayer: document.querySelector("#notesLayer"),
  gameStage: document.querySelector("#gameStage"),
  judgement: document.querySelector("#judgement"),
  scoreValue: document.querySelector("#scoreValue"),
  comboValue: document.querySelector("#comboValue"),
  accuracyValue: document.querySelector("#accuracyValue"),
  currentSongTitle: document.querySelector("#currentSongTitle"),
  currentSongMeta: document.querySelector("#currentSongMeta"),
  mentorTip: document.querySelector("#mentorTip"),
};

function buildChart(song, practice = false) {
  const beat = 60000 / song.bpm / (practice ? 0.82 : 1);
  const tokens = song.pattern.split(/\s+/).filter(Boolean);
  const notes = [];
  let beatIndex = 0;

  tokens.forEach((token) => {
    if (token === "-") {
      beatIndex += 1;
      return;
    }

    const variant = token.startsWith("+");
    const tone = token.replace("+", "");
    const lane = LANES.findIndex((item) => item.tone === tone);
    if (lane >= 0) {
      notes.push({
        id: `${song.id}-${notes.length}`,
        lane,
        tone,
        variant,
        hitAt: 1100 + beatIndex * beat,
        hit: false,
        missed: false,
      });
    }
    beatIndex += variant ? 0.75 : 1;
  });

  return notes;
}

function renderInstruments() {
  els.instrumentGrid.innerHTML = INSTRUMENTS.map((instrument) => `
    <button class="instrument-card ${instrument.id === state.instrument.id ? "active" : ""}" data-instrument="${instrument.id}">
      <span class="tag">${instrument.tier}</span>
      <strong>${instrument.name}</strong>
      <small>${instrument.desc}</small>
    </button>
  `).join("");
}

function renderSongs() {
  els.songList.innerHTML = SONGS.map((song) => `
    <button class="song-card ${song.id === state.song.id ? "active" : ""}" data-song="${song.id}">
      <strong>${song.title} · ${song.difficulty}</strong>
      <small>${song.source}<br />热度参考：${song.heat}</small>
    </button>
  `).join("");
  els.currentSongTitle.textContent = state.song.title;
  els.currentSongMeta.textContent = `${state.song.source} · ${state.song.difficulty}`;
}

function renderSources() {
  els.sourceList.innerHTML = SOURCES.map((source) => `
    <div class="source-card">
      <strong>${source.title}</strong>
      <span>${source.text}</span>
    </div>
  `).join("");
}

function ensureAudio() {
  if (!state.audio) {
    state.audio = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (state.audio.state === "suspended") {
    state.audio.resume();
  }
  return state.audio;
}

function playTone(laneIndex, variant = false, volume = 0.22) {
  const ctx = ensureAudio();
  const lane = LANES[laneIndex];
  const instrument = state.instrument;
  const now = ctx.currentTime;
  const freq = lane.freq * (variant ? 2 : 1);
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  const osc = ctx.createOscillator();

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(instrument.filter, now);
  osc.type = instrument.wave;
  osc.frequency.setValueAtTime(freq, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + instrument.attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + instrument.decay);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + instrument.decay + 0.05);

  if (instrument.id === "bianzhong" || variant) {
    const overtone = ctx.createOscillator();
    const overtoneGain = ctx.createGain();
    overtone.type = "sine";
    overtone.frequency.setValueAtTime(freq * (instrument.id === "bianzhong" ? 2.42 : 1.5), now);
    overtoneGain.gain.setValueAtTime(0.0001, now);
    overtoneGain.gain.exponentialRampToValueAtTime(volume * 0.42, now + 0.01);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + instrument.decay * 0.72);
    overtone.connect(overtoneGain);
    overtoneGain.connect(ctx.destination);
    overtone.start(now);
    overtone.stop(now + instrument.decay);
  }
}

function updateScore(kind) {
  if (kind === "perfect") {
    state.score += 1000 + state.combo * 12;
    state.combo += 1;
    state.hits += 1;
    judge("清越", "一气正中");
  } else if (kind === "good") {
    state.score += 620 + state.combo * 7;
    state.combo += 1;
    state.hits += 1;
    judge("入拍", "落指稳了");
  } else {
    state.combo = 0;
    state.misses += 1;
    judge("散音", "慢半息也无妨");
  }

  state.bestCombo = Math.max(state.bestCombo, state.combo);
  renderStats();
}

function judge(label, tip) {
  els.judgement.textContent = label;
  els.mentorTip.textContent = tip;
}

function renderStats() {
  els.scoreValue.textContent = String(state.score);
  els.comboValue.textContent = String(state.combo);
  const judged = state.hits + state.misses;
  const accuracy = judged ? Math.round((state.hits / judged) * 100) : 100;
  els.accuracyValue.textContent = `${accuracy}%`;
}

function startGame(practice = false) {
  cancelAnimationFrame(state.raf);
  ensureAudio();
  state.practice = practice;
  state.notes = buildChart(state.song, practice);
  state.running = true;
  state.startedAt = performance.now();
  state.score = 0;
  state.combo = 0;
  state.bestCombo = 0;
  state.hits = 0;
  state.misses = 0;
  state.total = state.notes.length;
  els.startBtn.textContent = "重新开始";
  judge(practice ? "练习起手" : "开弦", practice ? "慢一点，听每个字落下。" : "心定，手就稳。");
  renderStats();
  loop();
}

function loop() {
  const elapsed = performance.now() - state.startedAt;
  const stageHeight = els.gameStage.clientHeight;
  const hitY = stageHeight - 106;
  const lastHitAt = state.notes.at(-1)?.hitAt ?? 0;

  state.notes.forEach((note) => {
    if (!note.hit && !note.missed && elapsed - note.hitAt > MISS_MS) {
      note.missed = true;
      updateScore("miss");
    }
  });

  const visibleNotes = state.notes
    .filter((note) => !note.hit && !note.missed && elapsed > note.hitAt - TRAVEL_MS && elapsed < note.hitAt + 260)
    .map((note) => {
      const progress = (elapsed - (note.hitAt - TRAVEL_MS)) / (TRAVEL_MS + 220);
      const y = Math.round(-74 + progress * (hitY + 118));
      const lane = LANES[note.lane];
      return `
        <div class="note ${note.variant ? "variant" : ""}" style="--lane:${note.lane}; --y:${y}px; --tone:${lane.color}">
          ${note.tone}
        </div>
      `;
    });

  els.notesLayer.innerHTML = visibleNotes.join("");

  if (elapsed > lastHitAt + 1300 && state.running) {
    finishGame();
    return;
  }

  if (state.running) {
    state.raf = requestAnimationFrame(loop);
  }
}

function finishGame() {
  state.running = false;
  els.notesLayer.innerHTML = "";
  const accuracy = state.total ? Math.round((state.hits / state.total) * 100) : 100;
  const rank = accuracy >= 92 ? "入神" : accuracy >= 78 ? "雅正" : accuracy >= 58 ? "可听" : "再试";
  judge(rank, `最高连击 ${state.bestCombo}，准度 ${accuracy}%。`);
  els.judgement.textContent = `终曲 · ${rank}`;
}

function hitLane(laneIndex, shiftKey) {
  if (!state.running) {
    playTone(laneIndex, shiftKey, 0.14);
    return;
  }

  const elapsed = performance.now() - state.startedAt;
  const candidates = state.notes
    .filter((note) => !note.hit && !note.missed && note.lane === laneIndex)
    .map((note) => ({ note, delta: Math.abs(note.hitAt - elapsed) }))
    .sort((a, b) => a.delta - b.delta);
  const target = candidates[0];

  if (!target || target.delta > MISS_MS) {
    playTone(laneIndex, shiftKey, 0.1);
    updateScore("miss");
    return;
  }

  if (target.note.variant && !shiftKey) {
    target.note.missed = true;
    playTone(laneIndex, false, 0.1);
    updateScore("miss");
    judge("缺变", "变奏音要按住 Shift。");
    return;
  }

  target.note.hit = true;
  playTone(laneIndex, target.note.variant || shiftKey, target.delta < PERFECT_MS ? 0.26 : 0.2);
  updateScore(target.delta < PERFECT_MS ? "perfect" : "good");
}

function bindEvents() {
  els.instrumentGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-instrument]");
    if (!button) return;
    state.instrument = INSTRUMENTS.find((item) => item.id === button.dataset.instrument);
    renderInstruments();
    judge("试音", `${state.instrument.name} 已入席。`);
    playTone(0, false, 0.14);
  });

  els.songList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-song]");
    if (!button) return;
    state.song = SONGS.find((item) => item.id === button.dataset.song);
    renderSongs();
    judge("换谱", `已取《${state.song.title}》。`);
  });

  els.startBtn.addEventListener("click", () => startGame(false));
  els.practiceBtn.addEventListener("click", () => startGame(true));

  window.addEventListener("keydown", (event) => {
    const key = String(event.key || "").toLowerCase();
    const laneIndex = key in KEY_TO_LANE ? KEY_TO_LANE[key] : CODE_TO_LANE[event.code];
    if (event.repeat || laneIndex === undefined) return;
    event.preventDefault();
    hitLane(laneIndex, event.shiftKey);
  });
}

function init() {
  renderInstruments();
  renderSongs();
  renderSources();
  renderStats();
  bindEvents();
}

init();
