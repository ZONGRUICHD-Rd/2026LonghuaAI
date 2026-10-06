// 浏览器端绘图库：背景、递归树、科赫雪花。
// 递归树的画法与 Kitten 里的积木一一对应，用来出预览图、验证参数。

function rng(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 海龟：heading 0 = 朝上，左转为负方向
class Turtle {
  constructor(ctx, x, y) {
    this.ctx = ctx; this.x = x; this.y = y; this.h = 0;
    this.down = false; this.size = 2; this.color = '#000';
  }
  move(d) {
    const r = this.h * Math.PI / 180;
    const nx = this.x + Math.sin(r) * d, ny = this.y - Math.cos(r) * d;
    if (this.down) {
      const c = this.ctx;
      c.strokeStyle = this.color; c.lineWidth = this.size; c.lineCap = 'round';
      c.beginPath(); c.moveTo(this.x, this.y); c.lineTo(nx, ny); c.stroke();
    }
    this.x = nx; this.y = ny;
  }
  left(a) { this.h -= a; }
  right(a) { this.h += a; }
}

const SEASONS = {
  spring: {
    sky: ['#9fd6ff', '#cfeaff', '#ffe2ef'],
    sun: { x: 1530, y: 210, r: 80, c: '#fff8d6', glow: 'rgba(255,246,200,0.55)' },
    clouds: true,
    hills: ['#cdeccb', '#a8dca2', '#86cc80', '#6cbd68'],
    trunk: '#6b4630', twig: '#8a6a3c',
    leaves: ['#ff8fb8', '#ffb3cf', '#ffffff', '#ff6fa3'], leafSize: 13,
    sil: 'rgba(90,150,95,0.35)',
  },
  summer: {
    sky: ['#2ea8ff', '#7fd0ff', '#d9f4ff'],
    sun: { x: 1560, y: 190, r: 100, c: '#ffe04d', glow: 'rgba(255,220,80,0.5)', rays: true },
    clouds: true,
    hills: ['#93d47c', '#63bd56', '#43a648', '#2f9140'],
    trunk: '#5a3a24', twig: '#5b7a2a',
    leaves: ['#2e9e46', '#4cbf55', '#1f7d3a', '#7fd65f'], leafSize: 17,
    sil: 'rgba(30,110,50,0.35)',
  },
  autumn: {
    sky: ['#ff8a4c', '#ffbd7a', '#ffe7c0'],
    sun: { x: 1520, y: 560, r: 150, c: '#ffe2a6', glow: 'rgba(255,200,120,0.55)' },
    clouds: false, birds: true,
    hills: ['#efbc75', '#d99446', '#bd7130', '#9e5626'],
    trunk: '#4e2f1c', twig: '#7a4a24',
    leaves: ['#ff6a2b', '#ffb22e', '#e8402c', '#ffd34d'], leafSize: 15,
    sil: 'rgba(140,70,30,0.35)',
  },
  winter: {
    sky: ['#0a1838', '#1b3263', '#3d5f97'],
    moon: { x: 1560, y: 200, r: 80 },
    stars: true,
    hills: ['#8ea9d4', '#b9cdea', '#dce7f8', '#f2f7ff'],
    trunk: '#3b3550', twig: '#6c6a8c',
    leaves: ['#ffffff', '#e8f3ff'], leafSize: 7,
    sil: 'rgba(40,60,110,0.45)',
  },
};

// Kitten 积木的镜像：
// 函数 画树枝(长度, 层数)
function branch(t, len, n, o) {
  if (n === 0) {                       // 停止条件：画一片叶子/花
    if (o.noLeaf) return;
    t.size = o.leafSize * (0.8 + o.rand() * 0.5);
    t.color = o.leaves[Math.floor(o.rand() * o.leaves.length)];
    t.down = true; t.move(1); t.move(-1); t.down = false;
    return;
  }
  o.count++;
  t.size = n * o.thick;
  t.color = n > 2 ? o.trunk : o.twig;
  t.down = true; t.move(len);           // 落笔，向前画树枝
  t.left(o.angle + o.wind);
  branch(t, len * (o.ratio + o.rand() * o.jitter), n - 1, o);
  t.right(o.angle * 2);
  branch(t, len * (o.ratio + o.rand() * o.jitter), n - 1, o);
  t.left(o.angle - o.wind);
  t.down = false; t.move(-len);         // 抬笔，退回树枝根部
}

function drawTree(ctx, x, y, opts) {
  const o = Object.assign({
    len: 190, depth: 9, angle: 25, wind: 0, ratio: 0.68, jitter: 0.1,
    thick: 2.4, count: 0, seed: 7,
  }, opts);
  o.rand = rng(o.seed);
  const t = new Turtle(ctx, x, y);
  branch(t, o.len, o.depth, o);
  // 验证“回到原位”这个不变量
  if (Math.abs(t.x - x) > 0.01 || Math.abs(t.y - y) > 0.01 || Math.abs(t.h) > 0.01)
    throw new Error('turtle did not return home');
  return o.count;
}

// 函数 画雪花边(长度, 层数)
function kochSide(t, len, n) {
  if (n === 0) { t.move(len); return 1; }
  let c = 0;
  c += kochSide(t, len / 3, n - 1); t.left(60);
  c += kochSide(t, len / 3, n - 1); t.right(120);
  c += kochSide(t, len / 3, n - 1); t.left(60);
  c += kochSide(t, len / 3, n - 1);
  return c;
}

function drawSnowflake(ctx, cx, cy, size, n, color, width) {
  // 从中心算出起点，让雪花居中
  const h = size / Math.sqrt(3);
  const t = new Turtle(ctx, cx - size / 2, cy - h / 2);
  t.h = 90; t.color = color; t.size = width || 2; t.down = true;
  ctx.save(); ctx.shadowColor = 'rgba(255,255,255,0.9)'; ctx.shadowBlur = 8;
  let c = 0;
  for (let i = 0; i < 3; i++) { c += kochSide(t, size, n); t.right(120); }
  ctx.restore();
  return c;
}

function grad(ctx, y0, y1, stops) {
  const g = ctx.createLinearGradient(0, y0, 0, y1);
  stops.forEach((s, i) => g.addColorStop(i / (stops.length - 1), s));
  return g;
}

function hillPath(ctx, W, base, amp, f, ph, extra) {
  ctx.beginPath(); ctx.moveTo(0, 1080);
  for (let x = 0; x <= W; x += 8) {
    let y = base + Math.sin(x / f + ph) * amp + Math.sin(x / (f * 0.37) + ph * 2) * amp * 0.3;
    if (extra) y += extra(x);
    ctx.lineTo(x, y);
  }
  ctx.lineTo(W, 1080); ctx.closePath();
}

function hillY(W, base, amp, f, ph, extra, x) {
  let y = base + Math.sin(x / f + ph) * amp + Math.sin(x / (f * 0.37) + ph * 2) * amp * 0.3;
  if (extra) y += extra(x);
  return y;
}

function cloud(ctx, x, y, s, a) {
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#fff';
  [[0, 0, 60], [55, -25, 70], [120, 0, 55], [60, 20, 60], [-40, 15, 40], [160, 20, 40]]
    .forEach(([dx, dy, r]) => { ctx.beginPath(); ctx.arc(x + dx * s, y + dy * s, r * s, 0, 7); ctx.fill(); });
  ctx.restore();
}

// 种子位置（树根）：1920x1080 画布上的 (960, 915)
const ROOT = { x: 960, y: 915 };
const frontExtra = x => -70 * Math.exp(-Math.pow((x - 960) / 360, 2));

function drawSeasonBg(ctx, key) {
  const s = SEASONS[key], W = 1920, H = 1080, r = rng(42);
  ctx.fillStyle = grad(ctx, 0, 900, s.sky); ctx.fillRect(0, 0, W, H);

  if (s.stars) {
    for (let i = 0; i < 260; i++) {
      const x = r() * W, y = r() * 700, rr = r() * 2.2 + 0.4;
      ctx.fillStyle = `rgba(255,255,255,${0.35 + r() * 0.65})`;
      ctx.beginPath(); ctx.arc(x, y, rr, 0, 7); ctx.fill();
    }
    // 几颗会闪的大星星
    for (let i = 0; i < 14; i++) sparkle(ctx, r() * W, r() * 520, 8 + r() * 10, 'rgba(255,255,255,0.9)');
  }
  if (s.sun) {
    const g = ctx.createRadialGradient(s.sun.x, s.sun.y, 0, s.sun.x, s.sun.y, s.sun.r * 4);
    g.addColorStop(0, s.sun.glow); g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    if (s.sun.rays) {
      ctx.save(); ctx.translate(s.sun.x, s.sun.y); ctx.strokeStyle = 'rgba(255,230,120,0.7)';
      ctx.lineWidth = 10; ctx.lineCap = 'round';
      for (let i = 0; i < 12; i++) {
        ctx.rotate(Math.PI / 6); ctx.beginPath();
        ctx.moveTo(0, s.sun.r + 22); ctx.lineTo(0, s.sun.r + 60); ctx.stroke();
      }
      ctx.restore();
    }
    ctx.fillStyle = s.sun.c; ctx.beginPath(); ctx.arc(s.sun.x, s.sun.y, s.sun.r, 0, 7); ctx.fill();
  }
  if (s.moon) {
    const m = s.moon;
    const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 4);
    g.addColorStop(0, 'rgba(200,220,255,0.45)'); g.addColorStop(1, 'rgba(200,220,255,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#fff8dc'; ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, 7); ctx.fill();
    ctx.fillStyle = s.sky[0]; ctx.beginPath(); ctx.arc(m.x + 38, m.y - 22, m.r * 0.9, 0, 7); ctx.fill();
  }
  if (s.clouds) {
    cloud(ctx, 220, 170, 1.0, 0.9); cloud(ctx, 680, 110, 0.7, 0.75);
    cloud(ctx, 1150, 230, 0.85, 0.85); cloud(ctx, 1750, 380, 0.6, 0.7);
  }
  if (s.birds) {
    ctx.strokeStyle = 'rgba(120,60,30,0.7)'; ctx.lineWidth = 4; ctx.lineCap = 'round';
    [[380, 220, 1], [450, 260, 0.8], [520, 200, 0.7], [1180, 300, 0.6], [1230, 330, 0.5]].forEach(([x, y, k]) => {
      ctx.beginPath(); ctx.moveTo(x - 22 * k, y); ctx.quadraticCurveTo(x - 10 * k, y - 14 * k, x, y);
      ctx.quadraticCurveTo(x + 10 * k, y - 14 * k, x + 22 * k, y); ctx.stroke();
    });
  }

  // 远山 + 远处的小分形树剪影
  const layers = [
    { base: 690, amp: 40, f: 260, ph: 1.2 },
    { base: 780, amp: 32, f: 210, ph: 2.6 },
    { base: 860, amp: 22, f: 170, ph: 0.4 },
  ];
  layers.forEach((L, i) => {
    ctx.fillStyle = s.hills[i]; hillPath(ctx, W, L.base, L.amp, L.f, L.ph); ctx.fill();
    if (i < 2) {
      const n = i === 0 ? 14 : 9;
      for (let k = 0; k < n; k++) {
        const x = r() * W;
        if (Math.abs(x - 960) < 260) continue;
        const y = hillY(W, L.base, L.amp, L.f, L.ph, null, x) + 6;
        drawTree(ctx, x, y, {
          len: (i === 0 ? 34 : 48) * (0.8 + r() * 0.5), depth: 7, angle: 22 + r() * 8,
          thick: i === 0 ? 0.55 : 0.8, trunk: s.sil, twig: s.sil, leaves: [s.sil],
          leafSize: i === 0 ? 4 : 6, seed: Math.floor(r() * 1e6),
        });
      }
    }
  });
  // 前景地面，中间隆起的小土坡是“种树”的地方
  ctx.fillStyle = s.hills[3]; hillPath(ctx, W, 985, 10, 130, 0, frontExtra); ctx.fill();
  // 前景亮边
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 4;
  ctx.beginPath();
  for (let x = 0; x <= W; x += 8) {
    const y = hillY(W, 985, 10, 130, 0, frontExtra, x);
    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();
  // 小草 / 小花 / 雪点
  for (let i = 0; i < 90; i++) {
    const x = r() * W, y0 = hillY(W, 985, 10, 130, 0, frontExtra, x);
    const y = y0 + 15 + r() * (H - y0 - 20);
    if (key === 'winter') {
      ctx.fillStyle = 'rgba(160,190,235,0.6)';
      ctx.beginPath(); ctx.ellipse(x, y, 10 + r() * 14, 3, 0, 0, 7); ctx.fill();
    } else {
      ctx.strokeStyle = 'rgba(0,60,0,0.25)'; ctx.lineWidth = 3; ctx.lineCap = 'round';
      for (let j = -1; j <= 1; j++) {
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + j * 7, y - 14 - r() * 6); ctx.stroke();
      }
      if (key === 'spring' && r() < 0.5) {
        ctx.fillStyle = r() < 0.5 ? '#ff9ec2' : '#fff4a8';
        ctx.beginPath(); ctx.arc(x + 4, y - 18, 5, 0, 7); ctx.fill();
      }
    }
  }
  // 种子位置的小光圈（提示树根）
  const g = ctx.createRadialGradient(ROOT.x, ROOT.y, 0, ROOT.x, ROOT.y, 90);
  g.addColorStop(0, 'rgba(255,255,220,0.35)'); g.addColorStop(1, 'rgba(255,255,220,0)');
  ctx.fillStyle = g; ctx.fillRect(ROOT.x - 100, ROOT.y - 100, 200, 200);
  vignette(ctx, W, H, 0.22);
}

function sparkle(ctx, x, y, s, c) {
  ctx.save(); ctx.fillStyle = c; ctx.beginPath();
  ctx.moveTo(x, y - s); ctx.quadraticCurveTo(x, y, x + s, y); ctx.quadraticCurveTo(x, y, x, y + s);
  ctx.quadraticCurveTo(x, y, x - s, y); ctx.quadraticCurveTo(x, y, x, y - s); ctx.fill(); ctx.restore();
}

function vignette(ctx, W, H, a) {
  const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.45, W / 2, H / 2, H * 1.05);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(20,10,40,${a})`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}

function drawCoverBg(ctx) {
  const W = 1920, H = 1080, r = rng(9);
  ctx.fillStyle = grad(ctx, 0, H, ['#1d1450', '#4b2a8c', '#a24fa8', '#ff9fb8']); ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 180; i++) {
    ctx.fillStyle = `rgba(255,255,255,${0.2 + r() * 0.7})`;
    ctx.beginPath(); ctx.arc(r() * W, r() * 600, r() * 2 + 0.4, 0, 7); ctx.fill();
  }
  // 大月亮
  const g = ctx.createRadialGradient(960, 760, 0, 960, 760, 620);
  g.addColorStop(0, 'rgba(255,230,240,0.85)'); g.addColorStop(0.35, 'rgba(255,200,230,0.35)');
  g.addColorStop(1, 'rgba(255,200,230,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(255,240,245,0.95)'; ctx.beginPath(); ctx.arc(960, 800, 230, 0, 7); ctx.fill();
  // 远处山和剪影树
  ctx.fillStyle = '#5a2f7a'; hillPath(ctx, W, 860, 35, 240, 1); ctx.fill();
  ctx.fillStyle = '#3d1f5e'; hillPath(ctx, W, 940, 25, 180, 3); ctx.fill();
  const sil = '#2a1446';
  drawTree(ctx, 250, 1000, { len: 230, depth: 11, angle: 22, thick: 1.6, ratio: 0.7, jitter: 0.08,
    trunk: sil, twig: sil, leaves: ['#ffd1e8', '#fff', '#c9a7ff'], leafSize: 6, seed: 3, wind: 4 });
  drawTree(ctx, 1680, 1000, { len: 220, depth: 11, angle: 24, thick: 1.6, ratio: 0.7, jitter: 0.08,
    trunk: sil, twig: sil, leaves: ['#ffd1e8', '#fff', '#c9a7ff'], leafSize: 6, seed: 11, wind: -4 });
  ctx.fillStyle = '#1c0d33'; hillPath(ctx, W, 1010, 10, 120, 0); ctx.fill();
  // 萤火虫
  for (let i = 0; i < 40; i++) {
    const x = r() * W, y = 350 + r() * 650, rr = 3 + r() * 4;
    const fg = ctx.createRadialGradient(x, y, 0, x, y, rr * 5);
    fg.addColorStop(0, 'rgba(255,250,170,0.95)'); fg.addColorStop(1, 'rgba(255,250,170,0)');
    ctx.fillStyle = fg; ctx.beginPath(); ctx.arc(x, y, rr * 5, 0, 7); ctx.fill();
  }
  vignette(ctx, W, H, 0.3);
}

function drawClassBg(ctx) {
  const W = 1920, H = 1080;
  ctx.fillStyle = grad(ctx, 0, H, ['#fff6e3', '#ffe6c4']); ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(200,150,90,0.18)';
  for (let x = 30; x < W; x += 48) for (let y = 30; y < H; y += 48) {
    ctx.beginPath(); ctx.arc(x, y, 3, 0, 7); ctx.fill();
  }
  // 四个角的小分形枝条
  const c = 'rgba(160,110,60,0.55)';
  const sprig = (x, y, h, seed) => {
    const t = new Turtle(ctx, x, y); t.h = h;
    const o = { len: 70, depth: 6, angle: 28, wind: 0, ratio: 0.72, jitter: 0.05, thick: 1.4, count: 0,
      trunk: c, twig: c, leaves: ['#ff9ec2', '#9bd67a', '#ffc94d'], leafSize: 9, rand: rng(seed) };
    branch(t, o.len, o.depth, o);
  };
  sprig(70, 1060, 30, 1); sprig(1850, 1060, -30, 2); sprig(70, 20, 150, 3); sprig(1850, 20, -150, 4);
}

// 课堂卡片 2：小树 1~4 层（2×2 排列）
function drawTreeSteps(ctx, W, H) {
  const pos = [[W * 0.27, H * 0.43], [W * 0.73, H * 0.43], [W * 0.27, H * 0.93], [W * 0.73, H * 0.93]];
  pos.forEach(([x, y], i) => {
    drawTree(ctx, x, y - 10, { len: 62, depth: i + 1, angle: 28, ratio: 0.75, jitter: 0, thick: 3.5,
      trunk: '#7a4a24', twig: '#7a4a24', leaves: ['#4cbf55'], leafSize: 13, seed: 1 });
    ctx.fillStyle = '#36b04a'; ctx.font = '30px KuaiLe'; ctx.textAlign = 'center';
    ctx.fillText((i + 1) + '层', x + (i % 2 ? 1 : -1) * 0, y + 22);
  });
}

function drawKochSteps(ctx, W, H) {
  const xs = [W * 0.13, W * 0.37, W * 0.62, W * 0.87];
  xs.forEach((x, i) => drawSnowflake(ctx, x, H / 2 - 6, 120, i, '#3b82f6', 3));
}
