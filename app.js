// 递归魔法森林 · 网页版
// 树和雪花的画法与 Kitten 版《制作指南》里的积木完全一致，只是加了生长动画和风吹摇摆。
// 网页版去掉了语音识别（国内浏览器大多用不了），只保留按钮、键盘和递递朗读。

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const A = p => '素材/' + p;

// ---------- 舞台缩放 ----------
function fit() {
  const s = Math.min(innerWidth / 1920, innerHeight / 1080);
  const st = $('#stage');
  st.style.transform = `translate(${(innerWidth - 1920 * s) / 2}px, ${(innerHeight - 1080 * s) / 2}px) scale(${s})`;
}
addEventListener('resize', fit); fit();

// ---------- 数据 ----------
const SEASONS = {
  spring: { name: '春天', bg: '背景_2春', trunk: '#6b4630', twig: '#8a6a3c', leaves: ['#ff8fb8', '#ffb3cf', '#ffffff', '#ff6fa3'], leafSize: 13, fall: 'petal' },
  summer: { name: '夏天', bg: '背景_3夏', trunk: '#5a3a24', twig: '#5b7a2a', leaves: ['#2e9e46', '#4cbf55', '#1f7d3a', '#7fd65f'], leafSize: 17, fall: null },
  autumn: { name: '秋天', bg: '背景_4秋', trunk: '#4e2f1c', twig: '#7a4a24', leaves: ['#ff6a2b', '#ffb22e', '#e8402c', '#ffd34d'], leafSize: 15, fall: 'leaf' },
  winter: { name: '冬天', bg: '背景_5冬', trunk: '#3b3550', twig: '#6c6a8c', leaves: ['#ffffff', '#e8f3ff'], leafSize: 7, fall: 'snow' },
};
const ROOT = { x: 960, y: 915 };
const state = {
  depth: 8, angle: 25, len: 190, season: 'spring',
  windOn: false, wind: 0, seed: 1,
  grow: 0,          // 已经长到第几代（可以是小数，用来做动画）
  growStart: 0, snowing: false, sound: true,
};

function rng(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- 递归画树（核心） ----------
// 用“海龟”记录每一根树枝，再按代数一层层画出来，就有了生长动画
function buildTree(wind) {
  const s = SEASONS[state.season], rand = rng(state.seed);
  const segs = [], leaves = [];
  let x = ROOT.x, y = ROOT.y, h = 0;
  const move = d => { const r = h * Math.PI / 180; x += Math.sin(r) * d; y -= Math.cos(r) * d; };

  function branch(len, n, gen) {
    if (n === 0) {                                   // 停止条件：画叶子
      leaves.push({ x, y, size: s.leafSize * (0.8 + rand() * 0.5), color: s.leaves[Math.floor(rand() * s.leaves.length)] });
      return;
    }
    const x0 = x, y0 = y;
    move(len);                                       // 画出这一根树枝
    segs.push({ x0, y0, x1: x, y1: y, size: n * 2.4, color: n > 2 ? s.trunk : s.twig, gen });
    h -= state.angle + wind;                         // 左转
    branch(len * (0.68 + rand() * 0.1), n - 1, gen + 1);   // 自己调用自己 ①
    h += state.angle * 2;                            // 右转
    branch(len * (0.68 + rand() * 0.1), n - 1, gen + 1);   // 自己调用自己 ②
    h -= state.angle - wind;                         // 转回原方向
    move(-len);                                      // 退回根部
  }
  branch(state.len, state.depth, 0);
  return { segs, leaves };
}

const tctx = $('#tree').getContext('2d');
function drawTree(t) {
  const { segs, leaves } = buildTree(state.wind + Math.sin(t * 1.3) * 0.8 + (state.windOn ? Math.sin(t * 2.3) * 3 : 0));
  tctx.clearRect(0, 0, 1920, 1080);
  tctx.lineCap = 'round';
  const g = state.grow;
  for (const s of segs) {
    if (s.gen > g) continue;
    const k = Math.min(1, g - s.gen);               // 这一根长出来了多少
    tctx.strokeStyle = s.color; tctx.lineWidth = s.size;
    tctx.beginPath(); tctx.moveTo(s.x0, s.y0);
    tctx.lineTo(s.x0 + (s.x1 - s.x0) * k, s.y0 + (s.y1 - s.y0) * k); tctx.stroke();
  }
  const lk = Math.max(0, Math.min(1, (g - state.depth) * 2.5));
  if (lk > 0) {
    const e = 1 + 2.2 * Math.pow(lk - 1, 3) + 1.2 * Math.pow(lk - 1, 2);   // 弹一下
    for (const l of leaves) {
      tctx.fillStyle = l.color; tctx.beginPath(); tctx.arc(l.x, l.y, Math.max(0.1, l.size / 2 * e), 0, 7); tctx.fill();
    }
  }
}

function regrow(newSeed) {
  if (newSeed) state.seed = Math.floor(Math.random() * 1e9);
  state.grow = 0; state.growStart = performance.now(); state.announced = false;
  updatePanel();
}

// ---------- 科赫雪花（递归） ----------
function kochPoints(level) {
  const pts = [[0, 0]]; let x = 0, y = 0, h = 90;
  const side = (len, n) => {
    if (n === 0) { const r = h * Math.PI / 180; x += Math.sin(r) * len; y -= Math.cos(r) * len; pts.push([x, y]); return; }
    side(len / 3, n - 1); h -= 60; side(len / 3, n - 1); h += 120; side(len / 3, n - 1); h -= 60; side(len / 3, n - 1);
  };
  for (let i = 0; i < 3; i++) { side(1, level); h += 120; }
  const cx = 0.5, cy = 1 / (2 * Math.sqrt(3));                  // 移到中心
  return pts.map(([a, b]) => [a - cx, b - cy]);
}
const KOCH = [0, 1, 2, 3, 4].map(kochPoints);

// ---------- 飘落特效 ----------
const fctx = $('#fx').getContext('2d');
const IMG = {};
[['petal', '花瓣'], ['leaf1', '落叶_1红'], ['leaf2', '落叶_2橙'], ['leaf3', '落叶_3黄'], ['snow', '雪粒']].forEach(([k, n]) => {
  IMG[k] = new Image(); IMG[k].src = A(`sprites/${n}.png`);
});
let parts = [], flakes = [];
function spawnPart() {
  const kind = SEASONS[state.season].fall; if (!kind) return;
  const img = kind === 'leaf' ? IMG['leaf' + (1 + Math.floor(Math.random() * 3))] : IMG[kind];
  const sz = kind === 'snow' ? 8 + Math.random() * 14 : 34 + Math.random() * 24;
  parts.push({ img, x: Math.random() * 2100 - 90, y: -40, vy: kind === 'snow' ? 1.2 + Math.random() * 1.5 : 1.4 + Math.random() * 1.4,
    sz, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.06, ph: Math.random() * 6 });
}
function letItSnow() {
  state.snowing = true; flakes = [];
  for (let i = 0; i < 12; i++) flakes.push({
    x: 150 + Math.random() * 1620, y: -100 - Math.random() * 700, size: 40 + Math.random() * 70,
    level: 1 + Math.floor(Math.random() * 3), rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.01, vy: 0.6 + Math.random() * 0.7,
  });
}
function drawFx(t) {
  fctx.clearRect(0, 0, 1920, 1080);
  const rate = { petal: 0.12, leaf: 0.1, snow: 0.22 }[SEASONS[state.season].fall] || 0;
  if (Math.random() < rate * (state.windOn ? 1.6 : 1)) spawnPart();
  const push = state.windOn ? -2.2 : 0;
  parts = parts.filter(p => p.y < 1120 && p.x > -150 && p.x < 2100);
  for (const p of parts) {
    p.y += p.vy; p.x += Math.sin(t * 1.5 + p.ph) * 0.9 + push; p.rot += p.vr;
    if (!p.img.complete) continue;
    fctx.save(); fctx.translate(p.x, p.y); fctx.rotate(p.rot); fctx.drawImage(p.img, -p.sz / 2, -p.sz / 2, p.sz, p.sz); fctx.restore();
  }
  if (state.snowing) {
    fctx.strokeStyle = '#fff'; fctx.lineJoin = 'round'; fctx.shadowColor = 'rgba(255,255,255,.9)'; fctx.shadowBlur = 10;
    for (const f of flakes) {
      f.y += f.vy; f.x += push * 0.5 + Math.sin(t + f.size) * 0.3; f.rot += f.vr;
      if (f.y > 1150) { f.y = -80; f.x = 150 + Math.random() * 1620; }
      fctx.save(); fctx.translate(f.x, f.y); fctx.rotate(f.rot); fctx.scale(f.size, f.size);
      fctx.lineWidth = 2.4 / f.size; fctx.beginPath();
      KOCH[f.level].forEach(([a, b], i) => i ? fctx.lineTo(a, b) : fctx.moveTo(a, b));
      fctx.closePath(); fctx.stroke(); fctx.restore();
    }
    fctx.shadowBlur = 0;
  }
}

// ---------- 封面萤火虫 ----------
const ffx = $('#fireflies').getContext('2d');
const flies = Array.from({ length: 46 }, () => ({ x: Math.random() * 1920, y: 300 + Math.random() * 700, r: 3 + Math.random() * 4, ph: Math.random() * 6, sp: 0.3 + Math.random() * 0.6 }));
function drawFlies(t) {
  ffx.clearRect(0, 0, 1920, 1080);
  for (const f of flies) {
    const x = f.x + Math.sin(t * f.sp + f.ph) * 40, y = f.y + Math.cos(t * f.sp * 0.8 + f.ph) * 30;
    const a = 0.45 + 0.55 * Math.abs(Math.sin(t * 1.4 + f.ph));
    const g = ffx.createRadialGradient(x, y, 0, x, y, f.r * 5);
    g.addColorStop(0, `rgba(255,250,170,${a})`); g.addColorStop(1, 'rgba(255,250,170,0)');
    ffx.fillStyle = g; ffx.beginPath(); ffx.arc(x, y, f.r * 5, 0, 7); ffx.fill();
  }
}

// ---------- 主循环 ----------
let screen = 'cover';
function loop(now) {
  const t = now / 1000;
  if (screen === 'cover') drawFlies(t);
  if (screen === 'forest') {
    state.wind += ((state.windOn ? 12 : 0) - state.wind) * 0.04;     // 风慢慢变大/变小
    if (state.grow < state.depth + 1) {
      state.grow = Math.min(state.depth + 1, (now - state.growStart) / 230);
      updateCount();
    } else if (!state.announced) { state.announced = true; announce(); }
    drawTree(t); drawFx(t);
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// ---------- 递递说话 ----------
let bubbleTimer;
function say(html, speakText) {
  const b = $('#bubble'); b.innerHTML = html; b.classList.add('show');
  $('#mascot').src = A('sprites/递递_2施法.png');
  clearTimeout(bubbleTimer);
  bubbleTimer = setTimeout(() => { b.classList.remove('show'); $('#mascot').src = A('sprites/递递_1普通.png'); }, 5200);
  if (state.sound && 'speechSynthesis' in window) {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(speakText || b.textContent);
    u.lang = 'zh-CN'; u.rate = 1.05; u.pitch = 1.3;
    const v = speechSynthesis.getVoices().find(v => /zh[-_]CN/i.test(v.lang));
    if (v) u.voice = v;
    speechSynthesis.speak(u);
  }
}
function announce() {
  const n = state.depth, total = 2 ** n - 1;
  const sum = n <= 4 ? [...Array(n)].map((_, i) => 2 ** i).join('+') : `1+2+4+…+${2 ** (n - 1)}`;
  say(`${SEASONS[state.season].name}的魔法树<br>长到了第 <b>${n}</b> 层，<br>一共有 <b>${total}</b> 根树枝！<br><small>${sum} = ${total}</small>`,
    `${SEASONS[state.season].name}的魔法树长到第${n}层，一共有${total}根树枝！`);
}

// ---------- 面板 ----------
function bump(el, text) { if (el.textContent !== text) { el.textContent = text; el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); } }
function updateCount() {
  const done = Math.min(state.depth, Math.floor(state.grow));
  bump($('#vCount'), String(2 ** done - 1));
}
function updatePanel() {
  bump($('#vDepth'), String(state.depth));
  bump($('#vAngle'), state.angle + '°');
  bump($('#vSeason'), SEASONS[state.season].name);
  $$('.season').forEach(el => {
    const k = el.dataset.season, l = SEASONS[k].name[0];
    el.src = A(`sprites/季节_${l}_${k === state.season ? '2选中' : '1普通'}.png`);
  });
  updateCount();
}

// ---------- 动作 ----------
let bgFlip = false;
function setSeason(k) {
  if (state.season === k) { regrow(true); return; }
  state.season = k; parts = [];
  if (k !== 'winter') state.snowing = false;
  const show = bgFlip ? $('#bgA') : $('#bgB'), hide = bgFlip ? $('#bgB') : $('#bgA');
  show.src = A(`backgrounds/${SEASONS[k].bg}.jpg`); show.style.opacity = 1; hide.style.opacity = 0; bgFlip = !bgFlip;
  regrow(true);
}
const ACT = {
  grow() { if (state.depth >= 10) return say('已经是最大的 10 层啦！<br>再长就要 2047 根树枝了～'); state.depth++; regrow(false); },
  shrink() { if (state.depth <= 1) return say('只剩 1 根树枝啦，<br>不能再小了！'); state.depth--; regrow(false); },
  wind() { state.windOn = !state.windOn; say(state.windOn ? '呼——起风啦！<br>每个分叉都往左多转了 12 度' : '风停了～'); },
  snow() { if (state.season !== 'winter') setSeason('winter'); letItSnow(); say('下雪啦！<br>每一片雪花都是<b>递归</b>画出来的：<br>1 条边 → 4 条边'); },
  reset() { state.depth = 8; state.windOn = false; state.angle = 25; $('#angle').value = 25; regrow(true); },
};
function act(name) { ACT[name](); }

// ---------- 屏幕切换 ----------
function go(name) {
  screen = name;
  $$('.screen').forEach(s => s.classList.toggle('show', s.id === name));
  if (name === 'forest' && state.grow === 0) regrow(false);
  if (name === 'class') setCard(0);
}

// ---------- 课堂 ----------
const CARDS = ['课堂卡片_1什么是递归', '课堂卡片_2树枝的秘密', '课堂卡片_3雪花的魔法'];
let card = 0;
function setCard(i) {
  card = (i + CARDS.length) % CARDS.length;
  $('#card').src = A(`sprites/${CARDS[card]}.png`);
  $$('#dots i').forEach((d, j) => d.classList.toggle('on', j === card));
}
CARDS.forEach(n => { new Image().src = A(`sprites/${n}.png`); });   // 预加载

// ---------- 事件绑定 ----------
document.addEventListener('click', e => {
  const el = e.target.closest('[data-go],[data-act],[data-season],#next');
  if (!el) return;
  el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
  if (el.dataset.go) go(el.dataset.go);
  else if (el.dataset.act) act(el.dataset.act);
  else if (el.dataset.season) setSeason(el.dataset.season);
  else if (el.id === 'next') setCard(card + 1);
});
$('#angle').addEventListener('input', e => { state.angle = +e.target.value; bump($('#vAngle'), state.angle + '°'); });
$('#soundBtn').addEventListener('click', () => {
  state.sound = !state.sound; $('#soundBtn').textContent = state.sound ? '🔊 声音开' : '🔇 声音关';
  if (!state.sound && window.speechSynthesis) speechSynthesis.cancel();
});
addEventListener('keydown', e => {
  if (screen === 'class') { if (e.key === 'ArrowRight') setCard(card + 1); if (e.key === 'ArrowLeft') setCard(card - 1); return; }
  if (screen !== 'forest') { if (e.key === 'Enter') go('forest'); return; }
  const k = e.key.toLowerCase();
  const map = { '1': () => setSeason('spring'), '2': () => setSeason('summer'), '3': () => setSeason('autumn'), '4': () => setSeason('winter'),
    arrowup: () => act('grow'), '+': () => act('grow'), '=': () => act('grow'), arrowdown: () => act('shrink'), '-': () => act('shrink'),
    w: () => act('wind'), s: () => act('snow'), r: () => act('reset') };
  if (map[k]) { e.preventDefault(); map[k](); }
});
if (window.speechSynthesis) speechSynthesis.getVoices();
updatePanel();
