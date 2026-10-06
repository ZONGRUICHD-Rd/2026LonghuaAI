// 生成全部素材和效果预览图。
// 用法：FONT_DIR=/path/to/fonts node tools/build.js
// FONT_DIR 里需要 kuaile.ttf（站酷快乐体）和 noto500.woff2（思源黑体）。
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { chromium } = require(path.join(execSync('npm root -g').toString().trim(), 'playwright'));
const { css, ASSETS } = require('./ui');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, '素材');
const PREVIEW = path.join(ROOT, '预览图');
const FONT_DIR = process.env.FONT_DIR;
const TMP = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'kitten-build-'));
const drawJs = fs.readFileSync(path.join(__dirname, 'draw.js'), 'utf8');

const head = `<meta charset="utf-8"><style>
@font-face{font-family:'KuaiLe';src:url('file://${FONT_DIR}/kuaile.ttf')}
@font-face{font-family:'Noto';src:url('file://${FONT_DIR}/noto500.woff2')}
${css}</style><script>${drawJs}</script>`;

async function render(page, html, file, w, h, script) {
  const tmp = path.join(TMP, 'p.html');
  fs.writeFileSync(tmp, `<!doctype html><html><head>${head}</head><body><div id="root" style="width:${w}px;height:${h}px;position:relative;overflow:hidden">${html}</div>
    <script>${script || ''}</script></body></html>`);
  await page.setViewportSize({ width: Math.max(w, 200), height: Math.max(h, 200) });
  await page.goto('file://' + tmp);
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => Promise.all([...document.fonts].map(f => f.load())));
  await page.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth > 0));
  if ((script || '').includes('dataset.done')) await page.waitForFunction(() => document.body.dataset.done);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const jpg = file.endsWith('.jpg');
  await page.locator('#root').screenshot(jpg ? { path: file, type: 'jpeg', quality: 90 } : { path: file, omitBackground: true });
}

const bgScript = fn => `const c=document.getElementById('cv');${fn}(c.getContext('2d'));`;

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] })
    .catch(() => chromium.launch({ args: ['--allow-file-access-from-files'] }));
  const page = await browser.newPage();
  page.on('pageerror', e => { console.error('PAGE ERROR', e.message); process.exitCode = 1; });

  // 背景
  const bgs = [
    ['背景_1封面', 'drawCoverBg'], ['背景_2春', "(x=>drawSeasonBg(x,'spring'))"], ['背景_3夏', "(x=>drawSeasonBg(x,'summer'))"],
    ['背景_4秋', "(x=>drawSeasonBg(x,'autumn'))"], ['背景_5冬', "(x=>drawSeasonBg(x,'winter'))"], ['背景_6课堂', 'drawClassBg'],
  ];
  for (const [n, fn] of bgs) {
    await render(page, `<canvas id="cv" width="1920" height="1080"></canvas>`, path.join(OUT, 'backgrounds', n + '.jpg'), 1920, 1080, bgScript(fn));
    console.log('bg', n);
  }

  // 角色/按钮
  for (const a of ASSETS) {
    const script = a.canvas ? `document.fonts.load('30px KuaiLe').then(()=>{const c=document.getElementById('cv');${a.canvas}(c.getContext('2d'),c.width,c.height);document.body.dataset.done=1;});` : '';
    await render(page, a.html, path.join(OUT, a.name + '.png'), a.w, a.h, script);
    console.log('asset', a.name);
  }

  // 效果预览图（把素材拼到一起 + 用递归画树）
  const S = p => `file://${path.join(OUT, p)}${p.startsWith('backgrounds') ? '.jpg' : '.png'}`;
  const img = (p, x, y, s = 1, extra = '') => `<img src="${S(p)}" style="position:absolute;left:${x}px;top:${y}px;transform:scale(${s});transform-origin:0 0;${extra}">`;
  const bubble = (x, y, t) => `<div class="n" style="position:absolute;left:${x}px;top:${y}px;max-width:330px;background:#fff;border-radius:28px;padding:18px 24px;font-size:28px;line-height:1.45;color:#3a2a6a;
     box-shadow:0 8px 20px rgba(40,10,80,.25);border:4px solid #b39bff">${t}<div style="position:absolute;right:-22px;bottom:30px;width:0;height:0;border:16px solid transparent;border-left:24px solid #b39bff"></div></div>`;
  const valueText = (x, y, t) => `<div class="k" style="position:absolute;left:${x}px;top:${y}px;font-size:34px;color:#3a2a6a">${t}</div>`;

  const SEASON_LIST = [
    ['春', 'spring', '背景_2春', { depth: 9, angle: 25, wind: 0, seed: 21 }, '春天来啦！<br>小树长到第 <b>9</b> 层，<br>一共有 <b>511</b> 根树枝！'],
    ['夏', 'summer', '背景_3夏', { depth: 9, angle: 22, wind: 0, seed: 5 }, '夏天的叶子<br>又大又绿～'],
    ['秋', 'autumn', '背景_4秋', { depth: 9, angle: 28, wind: 8, seed: 13 }, '起风啦！<br>树枝都往左边歪了'],
    ['冬', 'winter', '背景_5冬', { depth: 9, angle: 25, wind: 0, seed: 21 }, '下雪了！<br>每片雪花都是<br>递归画出来的哦'],
  ];
  for (const [label, key, bg, opt, say] of SEASON_LIST) {
    const fall = key === 'spring' ? [[620, 380, '花瓣', 20], [1290, 520, '花瓣', -30], [1120, 300, '花瓣', 60], [700, 620, '花瓣', 10]]
      : key === 'autumn' ? [[600, 520, '落叶_1红', 20], [1300, 650, '落叶_3黄', -30], [1220, 380, '落叶_2橙', 60], [760, 760, '落叶_2橙', 0]]
      : key === 'winter' ? [[500, 500, '雪粒', 0], [1350, 600, '雪粒', 0], [1450, 300, '雪粒', 0], [380, 260, '雪粒', 0], [820, 700, '雪粒', 0]] : [];
    const html = `<canvas id="cv" width="1920" height="1080" style="position:absolute;left:0;top:0"></canvas>
      ${fall.map(([x, y, n, r]) => img('sprites/' + n, x, y, 0.8, `rotate:${r}deg`)).join('')}
      ${img('sprites/标题_递归魔法森林', 14, 6, 0.36)}
      ${img('sprites/按钮_首页', 470, 18, 0.75)}
      ${['春', '夏', '秋', '冬'].map((l, i) => img(`sprites/季节_${l}_${l === label ? '2选中' : '1普通'}`, 18, 150 + i * 172, 0.72)).join('')}
      ${img('sprites/魔法数据面板', 1505, 8, 0.78)}
      ${valueText(1700, 80, '9')}${valueText(1700, 135, '511')}${valueText(1700, 190, opt.angle + '°')}${valueText(1700, 244, label + '天')}
      ${img('sprites/递递_2施法', 1590, 470, 0.7)}
      ${bubble(1250, 470, say)}
      ${img('sprites/魔法种子', 925, 880, 0.5)}
      ${['长大', '变小', '刮风', '下雪', '重来'].map((n, i) => img('sprites/按钮_' + n, 200 + i * 128, 930, 0.78)).join('')}
      ${img('sprites/麦克风_' + (key === 'spring' ? '2正在听' : '1等待'), 1660, 820, 0.85)}`;
    const script = `const c=document.getElementById('cv'),x=c.getContext('2d');
      const bg=new Image();bg.src='${S('backgrounds/' + bg)}';
      bg.onload=()=>{x.drawImage(bg,0,0);
        const s=SEASONS['${key}'];
        const n=drawTree(x,ROOT.x,ROOT.y,Object.assign({trunk:s.trunk,twig:s.twig,leaves:s.leaves,leafSize:s.leafSize},${JSON.stringify(opt)}));
        if(n!==511) throw new Error('branch count '+n);
        if('${key}'==='winter'){[[330,170,90,3],[700,140,60,2],[1300,170,70,3],[1180,420,46,2],[420,560,50,2]].forEach(([a,b,s2,k])=>drawSnowflake(x,a,b,s2,k,'#ffffff',2.5));}
        document.body.dataset.done=1;};`;
    await render(page, html, path.join(PREVIEW, `预览_${label}天.jpg`), 1920, 1080, script);
    console.log('preview', label);
  }

  await render(page, `<img src="${S('backgrounds/背景_1封面')}" style="position:absolute;left:0;top:0">
     ${img('sprites/标题_递归魔法森林', 310, 70, 1)}
     ${img('sprites/副标题', 510, 390, 1)}
     ${img('sprites/递递_1普通', 818, 470, 0.75)}
     ${img('sprites/按钮_开始魔法', 500, 840, 1)}
     ${img('sprites/按钮_递归小课堂', 960, 840, 1)}`, path.join(PREVIEW, '预览_封面.jpg'), 1920, 1080);
  console.log('preview cover');

  await render(page, `<img src="${S('backgrounds/背景_6课堂')}" style="position:absolute;left:0;top:0">
     ${img('sprites/课堂卡片_2树枝的秘密', 210, 60, 1)}
     ${img('sprites/递递_2施法', 40, 800, 0.6)}
     ${img('sprites/按钮_返回森林', 300, 900, 0.9)}
     ${img('sprites/按钮_下一页', 1380, 900, 0.9)}`, path.join(PREVIEW, '预览_课堂.jpg'), 1920, 1080);
  console.log('preview class');

  await browser.close();
  fs.rmSync(TMP, { recursive: true, force: true });
})();
