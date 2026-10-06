// 各个按钮、面板、吉祥物、卡片的 HTML/SVG 模板。
// 每个条目：name(输出文件名) / w,h / html

const KITTEN_PURPLE = '#3a1f6e';

const css = `
*{box-sizing:border-box;margin:0;padding:0}
body{background:transparent}
.k{font-family:'KuaiLe',sans-serif}
.n{font-family:'Noto',sans-serif}
.wrap{display:flex;align-items:center;justify-content:center}
.pill{border-radius:999px;color:#fff;display:flex;align-items:center;justify-content:center;gap:16px;
  font-family:'KuaiLe';letter-spacing:4px;text-shadow:0 3px 0 rgba(0,0,0,.25);
  box-shadow:0 10px 0 var(--d),0 18px 30px rgba(40,10,80,.35),inset 0 4px 0 rgba(255,255,255,.45);
  border:5px solid rgba(255,255,255,.85)}
.round{border-radius:50%;display:flex;align-items:center;justify-content:center;
  box-shadow:0 8px 0 var(--d),0 14px 24px rgba(40,10,80,.3),inset 0 4px 0 rgba(255,255,255,.6);
  border:6px solid #fff}
.sq{border-radius:32px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;
  box-shadow:0 8px 0 var(--d),0 14px 22px rgba(40,10,80,.3),inset 0 4px 0 rgba(255,255,255,.55);
  border:5px solid #fff;color:#fff;font-family:'KuaiLe';font-size:30px;text-shadow:0 2px 0 rgba(0,0,0,.25)}
`;

// ---------- 小图标 ----------
const ICON = {
  flower: (s = 90) => `<svg width="${s}" height="${s}" viewBox="-50 -50 100 100">
    ${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-22" rx="16" ry="22" fill="#ff8fb8" stroke="#fff" stroke-width="3" transform="rotate(${a})"/>`).join('')}
    <circle r="13" fill="#ffd34d" stroke="#fff" stroke-width="3"/></svg>`,
  sun: (s = 90) => `<svg width="${s}" height="${s}" viewBox="-50 -50 100 100">
    ${[...Array(10)].map((_, i) => `<rect x="-4" y="-46" width="8" height="16" rx="4" fill="#ffb21e" transform="rotate(${i * 36})"/>`).join('')}
    <circle r="25" fill="#ffd84d" stroke="#ff9f1c" stroke-width="4"/>
    <circle cx="-8" cy="-3" r="3" fill="#7a4a10"/><circle cx="8" cy="-3" r="3" fill="#7a4a10"/>
    <path d="M-8 8 Q0 15 8 8" stroke="#7a4a10" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`,
  leaf: (s = 90, c = '#ff7a2b', c2 = '#e04e1f') => `<svg width="${s}" height="${s}" viewBox="-50 -50 100 100">
    <path d="M0 42 L0 18" stroke="#8a4b1e" stroke-width="6" stroke-linecap="round"/>
    <path d="M0 22 L-10 14 L-34 18 L-26 2 L-42 -10 L-22 -14 L-26 -34 L-8 -24 L0 -44 L8 -24 L26 -34 L22 -14 L42 -10 L26 2 L34 18 L10 14 Z"
      fill="${c}" stroke="${c2}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M0 18 L0 -32 M0 0 L-20 -16 M0 0 L20 -16 M0 10 L-22 8 M0 10 L22 8" stroke="${c2}" stroke-width="3" stroke-linecap="round" opacity=".8"/></svg>`,
  snow: (s = 90, c = '#5aa9ff') => `<svg width="${s}" height="${s}" viewBox="-50 -50 100 100">
    <g stroke="${c}" stroke-width="7" stroke-linecap="round">
    ${[0, 60, 120].map(a => `<g transform="rotate(${a})"><line x1="0" y1="-40" x2="0" y2="40"/>
      <path d="M-12 -32 L0 -22 L12 -32 M-12 32 L0 22 L12 32" fill="none"/></g>`).join('')}</g>
    <circle r="7" fill="#fff" stroke="${c}" stroke-width="4"/></svg>`,
  mic: (c = '#fff') => `<svg width="96" height="96" viewBox="-50 -50 100 100">
    <rect x="-15" y="-40" width="30" height="50" rx="15" fill="${c}"/>
    <path d="M-27 -2 Q-27 26 0 26 Q27 26 27 -2" stroke="${c}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <line x1="0" y1="26" x2="0" y2="40" stroke="${c}" stroke-width="7" stroke-linecap="round"/>
    <line x1="-15" y1="41" x2="15" y2="41" stroke="${c}" stroke-width="7" stroke-linecap="round"/></svg>`,
  plus: `<svg width="64" height="64" viewBox="-50 -50 100 100"><path d="M0 -36V36M-36 0H36" stroke="#fff" stroke-width="16" stroke-linecap="round"/></svg>`,
  minus: `<svg width="64" height="64" viewBox="-50 -50 100 100"><path d="M-36 0H36" stroke="#fff" stroke-width="16" stroke-linecap="round"/></svg>`,
  reset: `<svg width="64" height="64" viewBox="-50 -50 100 100"><path d="M30 -10 A32 32 0 1 1 10 -30" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round"/>
    <path d="M2 -46 L22 -30 L2 -14 Z" fill="#fff"/></svg>`,
  wind: `<svg width="64" height="64" viewBox="-50 -50 100 100"><g stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round">
    <path d="M-40 -14 H18 A14 14 0 1 0 4 -28"/><path d="M-40 6 H28 A12 12 0 1 1 16 18"/><path d="M-30 24 H0"/></g></svg>`,
  sparkle: (c = '#fff') => `<svg width="64" height="64" viewBox="-50 -50 100 100"><path d="M0 -42 Q0 0 42 0 Q0 0 0 42 Q0 0 -42 0 Q0 0 0 -42Z" fill="${c}"/></svg>`,
};

function seasonBtn(icon, label, ring, selected) {
  const glow = selected
    ? `box-shadow:0 0 0 10px rgba(255,214,77,.95),0 0 40px 14px rgba(255,214,77,.8),0 8px 0 10px #c99a14;`
    : `box-shadow:0 8px 0 ${ring},0 12px 20px rgba(40,10,80,.3);`;
  return `<div class="wrap" style="width:220px;height:240px;flex-direction:column;gap:10px">
    <div class="round" style="width:150px;height:150px;background:${selected ? '#fffbe8' : '#ffffff'};border:7px solid ${selected ? '#ffd64d' : ring};${glow}">${icon}</div>
    <div class="k" style="font-size:36px;color:#fff;background:${ring};border-radius:999px;padding:2px 22px;border:4px solid #fff;
      box-shadow:0 4px 10px rgba(0,0,0,.25)">${label}</div></div>`;
}

function pill(text, c1, c2, dark, w = 400, h = 116, fs = 50, icon = '') {
  return `<div class="wrap" style="width:${w + 60}px;height:${h + 60}px">
   <div class="pill" style="--d:${dark};width:${w}px;height:${h}px;font-size:${fs}px;background:linear-gradient(180deg,${c1},${c2})">${icon}${text}</div></div>`;
}

function sq(icon, text, c1, c2, dark) {
  return `<div class="wrap" style="width:170px;height:180px">
   <div class="sq" style="--d:${dark};width:132px;height:132px;background:linear-gradient(180deg,${c1},${c2})">${icon}<div>${text}</div></div></div>`;
}

function mascot(talking) {
  const beak = talking
    ? `<path d="M-14 6 L14 6 L0 22 Z" fill="#ff9f1c" stroke="#c96a00" stroke-width="3" stroke-linejoin="round"/>
       <path d="M-12 8 L12 8 L0 -2 Z" fill="#ffc04d" stroke="#c96a00" stroke-width="3" stroke-linejoin="round"/>`
    : `<path d="M-12 0 L12 0 L0 16 Z" fill="#ff9f1c" stroke="#c96a00" stroke-width="3" stroke-linejoin="round"/>`;
  const wand = talking
    ? `<g transform="translate(96,-6) rotate(-35)"><rect x="-5" y="-6" width="10" height="70" rx="5" fill="#6b3f1f"/>
         <path d="M0 -34 L8 -14 L30 -14 L12 -2 L19 20 L0 7 L-19 20 L-12 -2 L-30 -14 L-8 -14Z" fill="#ffd64d" stroke="#fff" stroke-width="4"/></g>
       <g fill="#fff">${[[150, -80, 9], [170, -30, 6], [120, -110, 6]].map(([x, y, s]) =>
         `<path d="M${x} ${y - s} Q${x} ${y} ${x + s} ${y} Q${x} ${y} ${x} ${y + s} Q${x} ${y} ${x - s} ${y} Q${x} ${y} ${x} ${y - s}Z"/>`).join('')}</g>`
    : `<g transform="translate(92,20) rotate(-10)"><rect x="-5" y="-6" width="10" height="64" rx="5" fill="#6b3f1f"/>
         <path d="M0 -30 L7 -12 L26 -12 L10 -1 L16 18 L0 6 L-16 18 L-10 -1 L-26 -12 L-7 -12Z" fill="#ffd64d" stroke="#fff" stroke-width="4"/></g>`;
  return `<svg width="380" height="420" viewBox="-190 -230 380 420">
   <defs>
    <radialGradient id="b" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#a98bff"/><stop offset="1" stop-color="#6a45e0"/></radialGradient>
    <radialGradient id="bl" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="#fff6e8"/><stop offset="1" stop-color="#ffe0b8"/></radialGradient>
   </defs>
   <ellipse cx="0" cy="178" rx="110" ry="12" fill="rgba(0,0,0,.18)"/>
   <!-- 脚 -->
   <g fill="#ff9f1c" stroke="#c96a00" stroke-width="3"><ellipse cx="-36" cy="168" rx="24" ry="10"/><ellipse cx="36" cy="168" rx="24" ry="10"/></g>
   <!-- 翅膀 -->
   <ellipse cx="-104" cy="70" rx="34" ry="62" fill="#5a36cf" transform="rotate(18 -104 70)"/>
   ${wand}
   <ellipse cx="104" cy="70" rx="34" ry="62" fill="#5a36cf" transform="rotate(-18 104 70)"/>
   <!-- 身体 -->
   <ellipse cx="0" cy="60" rx="118" ry="112" fill="url(#b)" stroke="#4b2bb0" stroke-width="5"/>
   <ellipse cx="0" cy="96" rx="70" ry="66" fill="url(#bl)"/>
   <g stroke="#e8b98a" stroke-width="4" fill="none" stroke-linecap="round">
     <path d="M-30 80 q10 10 20 0"/><path d="M10 80 q10 10 20 0"/><path d="M-12 110 q10 10 20 0"/></g>
   <!-- 眼睛 -->
   <g><circle cx="-44" cy="20" r="40" fill="#fff" stroke="#4b2bb0" stroke-width="5"/>
      <circle cx="44" cy="20" r="40" fill="#fff" stroke="#4b2bb0" stroke-width="5"/>
      <circle cx="-38" cy="24" r="20" fill="#2a1a4a"/><circle cx="38" cy="24" r="20" fill="#2a1a4a"/>
      <circle cx="-31" cy="16" r="7" fill="#fff"/><circle cx="45" cy="16" r="7" fill="#fff"/>
      <circle cx="-44" cy="32" r="3" fill="#fff"/><circle cx="32" cy="32" r="3" fill="#fff"/></g>
   <g fill="#ff9ec2" opacity=".7"><ellipse cx="-78" cy="60" rx="14" ry="8"/><ellipse cx="78" cy="60" rx="14" ry="8"/></g>
   <g transform="translate(0,42)">${beak}</g>
   <!-- 魔法帽 -->
   <path d="M-96 -38 Q0 -70 96 -38 Q60 -50 30 -60 L8 -200 Q0 -214 -8 -200 L-30 -60 Q-60 -50 -96 -38Z"
     fill="#24306e" stroke="#151c4a" stroke-width="5" stroke-linejoin="round"/>
   <path d="M-34 -62 Q0 -74 34 -62 L30 -82 Q0 -94 -30 -82Z" fill="#ffd64d"/>
   <path d="M0 -168 L6 -152 L22 -152 L10 -142 L14 -126 L0 -136 L-14 -126 L-10 -142 L-22 -152 L-6 -152Z" fill="#ffd64d"/>
   <circle cx="-14" cy="-110" r="4" fill="#fff"/><circle cx="14" cy="-96" r="3" fill="#fff"/>
  </svg>`;
}

function card(title, color, leftHtml, rightHtml, page) {
  return `<div style="width:1500px;height:800px;padding:20px">
   <div style="width:1460px;height:760px;background:#fff;border-radius:48px;overflow:hidden;
     box-shadow:0 14px 0 ${color}55,0 24px 50px rgba(90,50,10,.25);border:6px solid ${color};display:flex;flex-direction:column">
    <div style="height:130px;background:${color};display:flex;align-items:center;padding:0 50px;gap:24px">
      <div class="k" style="width:84px;height:84px;border-radius:50%;background:#fff;color:${color};font-size:52px;display:flex;align-items:center;justify-content:center">${page}</div>
      <div class="k" style="font-size:66px;color:#fff;letter-spacing:4px;text-shadow:0 4px 0 rgba(0,0,0,.18)">${title}</div>
    </div>
    <div style="flex:1;display:flex;padding:36px 50px;gap:40px">
      <div style="width:620px;display:flex;align-items:center;justify-content:center;background:${color}14;border-radius:32px">${leftHtml}</div>
      <div class="n" style="flex:1;font-size:36px;line-height:1.65;color:#3a2a1a;display:flex;flex-direction:column;justify-content:center;gap:14px">${rightHtml}</div>
    </div></div></div>`;
}

const hl = (t, c) => `<b style="color:${c}">${t}</b>`;

function dolls() {
  const doll = (x, s, c) => `<g transform="translate(${x},250) scale(${s})">
    <ellipse cx="0" cy="-60" rx="80" ry="100" fill="${c}" stroke="#7a2a2a" stroke-width="5"/>
    <circle cx="0" cy="-150" r="56" fill="${c}" stroke="#7a2a2a" stroke-width="5"/>
    <circle cx="0" cy="-140" r="38" fill="#ffe3cc"/>
    <circle cx="-13" cy="-144" r="5" fill="#3a2a1a"/><circle cx="13" cy="-144" r="5" fill="#3a2a1a"/>
    <path d="M-10 -124 Q0 -116 10 -124" stroke="#d14" stroke-width="4" fill="none" stroke-linecap="round"/>
    <circle cx="-22" cy="-130" r="6" fill="#ff9ec2"/><circle cx="22" cy="-130" r="6" fill="#ff9ec2"/>
    <circle cx="0" cy="-40" r="34" fill="#fff4c2" stroke="#7a2a2a" stroke-width="4"/>
    ${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-54" rx="7" ry="11" fill="#ff6f91" transform="rotate(${a} 0 -40)"/>`).join('')}
    <circle cx="0" cy="-40" r="7" fill="#ffd34d"/></g>`;
  return `<svg width="580" height="520" viewBox="0 -40 580 340">
    ${doll(120, 1, '#e8473a')}${doll(310, 0.72, '#ff8a3d')}${doll(455, 0.5, '#3fa9f5')}
    <text x="520" y="230" font-family="KuaiLe" font-size="40" fill="#e8473a">停!</text>
    <path d="M190 -10 C 240 -50, 280 -50, 300 0" stroke="#999" stroke-width="4" fill="none" stroke-dasharray="8 8"/>
    <path d="M345 50 C 380 20, 410 20, 440 60" stroke="#999" stroke-width="4" fill="none" stroke-dasharray="8 8"/>
  </svg>`;
}

const ASSETS = [
  // ---- 标题 ----
  { name: 'sprites/标题_递归魔法森林', w: 1300, h: 340, html: `<div class="wrap" style="width:1300px;height:340px;position:relative">
     <div class="k" style="font-size:168px;letter-spacing:10px;line-height:1;position:relative">
       <span style="position:absolute;left:0;top:0;-webkit-text-stroke:34px ${KITTEN_PURPLE};color:${KITTEN_PURPLE};filter:drop-shadow(0 14px 0 #1a0b3a)">递归魔法森林</span>
       <span style="position:relative;background:linear-gradient(180deg,#fff8b0 10%,#ffd23f 45%,#ff8fb8 95%);-webkit-background-clip:text;color:transparent">递归魔法森林</span>
     </div>
     ${[[70, 60, 46], [1230, 70, 40], [1180, 270, 28], [120, 280, 30], [650, 22, 26]].map(([x, y, s]) =>
       `<div style="position:absolute;left:${x - s / 2}px;top:${y - s / 2}px">${ICON.sparkle('#fff7c2').replace(/64/g, s)}</div>`).join('')}
   </div>` },
  { name: 'sprites/副标题', w: 900, h: 90, html: `<div class="wrap k" style="width:900px;height:90px;font-size:44px;color:#fff;letter-spacing:6px;text-shadow:0 3px 0 ${KITTEN_PURPLE},0 0 20px rgba(255,180,230,.9)">
     一颗种子 · 一个函数 · 一整片森林</div>` },

  // ---- 大按钮 ----
  { name: 'sprites/按钮_开始魔法', w: 460, h: 176, html: pill('开始魔法', '#ffb347', '#ff6a3d', '#c4421f', 400, 116, 52, ICON.sparkle().replace(/64/g, 44)) },
  { name: 'sprites/按钮_递归小课堂', w: 460, h: 176, html: pill('递归小课堂', '#4fd8c4', '#1fa6a0', '#147a75', 400, 116, 48) },
  { name: 'sprites/按钮_返回森林', w: 380, h: 150, html: pill('返回森林', '#b39bff', '#7a5cf0', '#4f35b5', 320, 96, 42) },
  { name: 'sprites/按钮_下一页', w: 380, h: 150, html: pill('下一页 ▶', '#ffb347', '#ff6a3d', '#c4421f', 320, 96, 42) },
  { name: 'sprites/按钮_首页', w: 250, h: 130, html: pill('首页', '#b39bff', '#7a5cf0', '#4f35b5', 190, 80, 38) },

  // ---- 季节按钮（每个两个造型：普通 / 选中） ----
  ...[['春', 'spring', ICON.flower(), '#ff7fae'], ['夏', 'summer', ICON.sun(), '#ffa31a'],
      ['秋', 'autumn', ICON.leaf(), '#e8602c'], ['冬', 'winter', ICON.snow(), '#4a90e2']].flatMap(([l, k, ic, c]) => [
    { name: `sprites/季节_${l}_1普通`, w: 220, h: 240, html: seasonBtn(ic, l + '天', c, false) },
    { name: `sprites/季节_${l}_2选中`, w: 220, h: 240, html: seasonBtn(ic, l + '天', c, true) },
  ]),

  // ---- 麦克风（AI 语音） ----
  { name: 'sprites/麦克风_1等待', w: 300, h: 300, html: `<div class="wrap" style="width:300px;height:300px;flex-direction:column;gap:6px">
     <div class="round" style="--d:#1f5fbf;width:180px;height:180px;background:linear-gradient(180deg,#5ab0ff,#2b7be4)">${ICON.mic()}</div>
     <div class="k" style="font-size:34px;color:#fff;background:#2b7be4;border:4px solid #fff;border-radius:999px;padding:0 20px;box-shadow:0 4px 10px rgba(0,0,0,.25)">点我说话</div></div>` },
  { name: 'sprites/麦克风_2正在听', w: 300, h: 300, html: `<div class="wrap" style="width:300px;height:300px;flex-direction:column;gap:6px;position:relative">
     <div style="position:absolute;top:2px;width:230px;height:230px;border-radius:50%;border:8px solid rgba(255,90,110,.45)"></div>
     <div style="position:absolute;top:-16px;width:266px;height:266px;border-radius:50%;border:6px solid rgba(255,90,110,.22)"></div>
     <div class="round" style="--d:#b0213a;width:180px;height:180px;background:linear-gradient(180deg,#ff7a8c,#e8344f);margin-top:-4px">${ICON.mic()}</div>
     <div class="k" style="font-size:34px;color:#fff;background:#e8344f;border:4px solid #fff;border-radius:999px;padding:0 20px;box-shadow:0 4px 10px rgba(0,0,0,.25)">我在听…</div></div>` },

  // ---- 小方按钮 ----
  { name: 'sprites/按钮_长大', w: 170, h: 180, html: sq(ICON.plus, '长大', '#7be07b', '#36b04a', '#23802f') },
  { name: 'sprites/按钮_变小', w: 170, h: 180, html: sq(ICON.minus, '变小', '#ffb05a', '#f07a1e', '#b35512') },
  { name: 'sprites/按钮_刮风', w: 170, h: 180, html: sq(ICON.wind, '刮风', '#7fd3ff', '#3a9be8', '#1f6cb0') },
  { name: 'sprites/按钮_下雪', w: 170, h: 180, html: sq(ICON.snow(64, '#fff'), '下雪', '#9db4ff', '#6a7ff0', '#4552b5') },
  { name: 'sprites/按钮_重来', w: 170, h: 180, html: sq(ICON.reset, '重来', '#ff8fa8', '#e8506e', '#ad2f4a') },

  // ---- 数据面板 ----
  { name: 'sprites/魔法数据面板', w: 520, h: 420, html: `<div style="width:520px;height:420px;padding:16px">
     <div style="width:488px;height:388px;border-radius:36px;background:linear-gradient(180deg,rgba(255,255,255,.92),rgba(245,238,255,.88));
       border:6px solid #fff;box-shadow:0 10px 0 rgba(90,60,180,.35),0 18px 34px rgba(40,10,80,.3);padding:18px 28px">
       <div class="k" style="font-size:42px;color:#6a45e0;display:flex;align-items:center;gap:10px;margin-bottom:10px">
         ${ICON.sparkle('#ffc832').replace(/64/g, 38)}魔法数据</div>
       ${[['层　数', '#7a5cf0'], ['树枝数', '#36b04a'], ['角　度', '#f07a1e'], ['季　节', '#e8507a']].map(([t, c]) => `
       <div style="display:flex;align-items:center;gap:16px;margin:12px 0">
         <div class="k" style="width:150px;font-size:36px;color:#fff;background:${c};border-radius:16px;text-align:center;padding:4px 0">${t}</div>
         <div style="flex:1;height:58px;border-radius:16px;background:#fff;border:4px dashed ${c}66"></div></div>`).join('')}
     </div></div>` },

  // ---- 吉祥物 ----
  { name: 'sprites/递递_1普通', w: 380, h: 420, html: mascot(false) },
  { name: 'sprites/递递_2施法', w: 380, h: 420, html: mascot(true) },

  // ---- 飘落物（克隆体用） ----
  { name: 'sprites/落叶_1红', w: 80, h: 80, html: ICON.leaf(80, '#e8402c', '#a8261a') },
  { name: 'sprites/落叶_2橙', w: 80, h: 80, html: ICON.leaf(80, '#ff8a2b', '#c45a12') },
  { name: 'sprites/落叶_3黄', w: 80, h: 80, html: ICON.leaf(80, '#ffc93d', '#c98f0e') },
  { name: 'sprites/花瓣', w: 60, h: 60, html: `<svg width="60" height="60" viewBox="-30 -30 60 60"><path d="M0 -24 C 18 -18, 18 10, 0 24 C -18 10, -18 -18, 0 -24Z" fill="#ffa8c8" stroke="#ff7fae" stroke-width="2"/><path d="M0 -14 L0 14" stroke="#ff7fae" stroke-width="2"/></svg>` },
  { name: 'sprites/雪粒', w: 40, h: 40, html: `<div style="width:40px;height:40px;border-radius:50%;background:radial-gradient(circle,#fff 0 35%,rgba(255,255,255,.6) 50%,rgba(255,255,255,0) 70%)"></div>` },
  { name: 'sprites/魔法种子', w: 140, h: 140, html: `<svg width="140" height="140" viewBox="-70 -70 140 140">
     <defs><radialGradient id="g"><stop offset="0" stop-color="#fffbd0"/><stop offset=".35" stop-color="rgba(255,230,120,.7)"/><stop offset="1" stop-color="rgba(255,230,120,0)"/></radialGradient></defs>
     <circle r="68" fill="url(#g)"/>
     <ellipse cx="0" cy="6" rx="16" ry="22" fill="#a0622d" stroke="#6b3f1f" stroke-width="4"/>
     <path d="M0 -14 C -4 -30, -22 -34, -26 -26 C -18 -20, -8 -20, 0 -14 Z" fill="#6ccf5a" stroke="#3f9a3a" stroke-width="3"/>
     <path d="M0 -14 C 4 -30, 22 -34, 26 -26 C 18 -20, 8 -20, 0 -14 Z" fill="#7be07b" stroke="#3f9a3a" stroke-width="3"/>
     <path d="M-40 -40 Q-40 -30 -30 -30 Q-40 -30 -40 -20 Q-40 -30 -50 -30 Q-40 -30 -40 -40Z" fill="#fff"/>
     <path d="M42 -20 Q42 -12 50 -12 Q42 -12 42 -4 Q42 -12 34 -12 Q42 -12 42 -20Z" fill="#fff"/></svg>` },

  // ---- 课堂卡片 ----
  { name: 'sprites/课堂卡片_1什么是递归', w: 1500, h: 800, html: card('什么是递归？', '#e8473a', dolls(), `
     <div>打开一个套娃，里面还有一个<b>更小的同样的</b>套娃……</div>
     <div>一直打开，直到最小的那个，${hl('就停下来！', '#e8473a')}</div>
     <div style="background:#fff3ef;border-radius:24px;padding:18px 26px;font-size:34px">
       递归的两个法宝：<br>① ${hl('自己调用自己', '#e8473a')}（每次变小一点）<br>② ${hl('停止条件', '#e8473a')}（不然永远停不下来）</div>`, 1) },
  { name: 'sprites/课堂卡片_2树枝的秘密', w: 1500, h: 800, html: card('树枝里的数学', '#36b04a', `<canvas id="cv" width="600" height="460"></canvas>`, `
     <div>每一根树枝，都长出 ${hl('2 根', '#36b04a')} 更短的小树枝。</div>
     <div style="display:grid;grid-template-columns:repeat(4,1fr);text-align:center;font-size:32px;background:#eefbe9;border-radius:20px;padding:10px">
       <div>1层</div><div>2层</div><div>3层</div><div>4层</div>
       <div>1</div><div>1+2</div><div>1+2+4</div><div>1+2+4+8</div>
       <div><b>=1</b></div><div><b>=3</b></div><div><b>=7</b></div><div><b>=15</b></div></div>
     <div>规律：树枝总数 = ${hl('2×2×…×2 − 1', '#36b04a')}<br>10 层的大树有 ${hl('1023', '#36b04a')} 根树枝！</div>`, 2),
    canvas: 'drawTreeSteps' },
  { name: 'sprites/课堂卡片_3雪花的魔法', w: 1500, h: 800, html: card('雪花的魔法', '#3b82f6', `<canvas id="cv" width="600" height="300"></canvas>`, `
     <div>把每条线段分成 3 份，中间那份 ${hl('变成一个小尖角', '#3b82f6')}。</div>
     <div>每一次，${hl('1 条边就变成 4 条边', '#3b82f6')}：</div>
     <div style="display:grid;grid-template-columns:repeat(4,1fr);text-align:center;font-size:32px;background:#eaf2ff;border-radius:20px;padding:10px">
       <div>0次</div><div>1次</div><div>2次</div><div>3次</div>
       <div><b>3</b></div><div><b>12</b></div><div><b>48</b></div><div><b>192</b></div></div>
     <div>边越来越多，雪花却${hl('一直待在圈里', '#3b82f6')}，<br>这就是数学家科赫发现的“科赫雪花”。</div>`, 3),
    canvas: 'drawKochSteps' },
];

module.exports = { css, ASSETS };
