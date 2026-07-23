/**
 * SetConCA Mastery — Interactive Visualisations
 * All canvas-based demos. Each answers a specific learning question.
 * Mount to a container element; unmount when navigating away.
 */

// ── Shared utilities ──────────────────────────────────────────────────────────
function lerp(a, b, t) { return a + (b - a) * t; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function rnd(lo, hi) { return lo + Math.random() * (hi - lo); }

// Draw text with background
function labelText(ctx, text, x, y, color = '#94a3b8', bg = null) {
  ctx.font = '12px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (bg) {
    const m = ctx.measureText(text);
    ctx.fillStyle = bg;
    ctx.fillRect(x - m.width / 2 - 4, y - 8, m.width + 8, 16);
  }
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

function drawAxis(ctx, cx, cy, w, h, col = '#1e2640') {
  ctx.strokeStyle = col;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - w / 2, cy); ctx.lineTo(cx + w / 2, cy);
  ctx.moveTo(cx, cy - h / 2); ctx.lineTo(cx, cy + h / 2);
  ctx.stroke();
}

function mkCanvas(container) {
  const canvas = document.createElement('canvas');
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  canvas.style.background = '#090c14';
  canvas.style.borderRadius = '8px';
  container.appendChild(canvas);
  function resize() {
    canvas.width = container.clientWidth * devicePixelRatio;
    canvas.height = container.clientHeight * devicePixelRatio;
    canvas.style.width = container.clientWidth + 'px';
    canvas.style.height = container.clientHeight + 'px';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    return [canvas.clientWidth, canvas.clientHeight];
  }
  resize();
  return [canvas, resize];
}

// ── Registry ──────────────────────────────────────────────────────────────────
const registry = {};
const activeCleanups = {};

function register(id, mountFn) {
  registry[id] = mountFn;
}

function mount(id, container) {
  if (!container) return;
  // Clean up any existing demo in this container
  if (activeCleanups[id]) {
    try { activeCleanups[id](); } catch {}
    delete activeCleanups[id];
  }
  container.innerHTML = '';
  const mountFn = registry[id];
  if (!mountFn) {
    container.innerHTML = `<div style="padding:1rem; color:var(--dim)">Visual '${id}' not yet implemented.</div>`;
    return;
  }
  const cleanup = mountFn(container);
  if (cleanup) activeCleanups[id] = cleanup;
}

// ── 1. PCA Direction & Variance ───────────────────────────────────────────────
// Question: Which direction captures the most variance in this dataset?
register('pca-direction-variance', (container) => {
  container.innerHTML = `
    <div class="demo-question">
      Drag the arrow to change the projection direction. Watch explained variance change.
    </div>
    <canvas id="pcaCanvas" style="width:100%; height:220px; display:block; cursor:crosshair; background:#090c14; border-radius:8px"></canvas>
    <div class="demo-controls">
      <label>Direction angle: <strong id="pcaAngle">0°</strong></label>
      <div class="demo-stat">Explained variance: <span id="pcaVar">0%</span></div>
      <div class="demo-stat">Residual: <span id="pcaRes">0%</span></div>
      <button class="btn-ghost" id="pcaReset" style="padding:0.3rem 0.6rem; font-size:0.8rem">Reset</button>
    </div>
  `;

  const canvas = container.querySelector('#pcaCanvas');
  const ctx = canvas.getContext('2d');

  // Fixed seed data (2D)
  const seed = [
    [0.8, 0.6], [1.5, 1.2], [-0.5, -0.4], [-1.2, -0.9],
    [1.0, 0.7], [-0.7, -0.5], [0.3, 0.2], [-1.4, -1.1],
    [1.8, 1.3], [0.5, 0.4], [-0.9, -0.7], [1.3, 0.9],
  ];

  let angle = 35 * Math.PI / 180; // close to PC1
  let dragging = false;

  function resize() {
    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;
    canvas.style.width = canvas.clientWidth + 'px';
    ctx.scale(devicePixelRatio, devicePixelRatio);
    draw();
  }

  function getTransform() {
    const W = canvas.clientWidth, H = canvas.clientHeight;
    const cx = W / 2, cy = H / 2, scale = Math.min(W, H) / 4;
    return { cx, cy, scale };
  }

  function project(x, y) {
    const cos = Math.cos(angle), sin = Math.sin(angle);
    return cos * x + sin * y;
  }

  function totalVariance() {
    const mx = seed.reduce((a, p) => a + p[0], 0) / seed.length;
    const my = seed.reduce((a, p) => a + p[1], 0) / seed.length;
    return seed.reduce((a, p) => a + (p[0]-mx)**2 + (p[1]-my)**2, 0) / seed.length;
  }

  function projVariance() {
    const projs = seed.map(p => project(p[0], p[1]));
    const m = projs.reduce((a, v) => a + v, 0) / projs.length;
    return projs.reduce((a, v) => a + (v - m) ** 2, 0) / projs.length;
  }

  function draw() {
    const W = canvas.clientWidth, H = canvas.clientHeight;
    const { cx, cy, scale } = getTransform();
    ctx.clearRect(0, 0, W, H);

    drawAxis(ctx, cx, cy, W * 0.9, H * 0.9);

    const pv = projVariance(), tv = totalVariance();
    const ratio = tv > 0 ? pv / tv : 0;

    // Project lines (residuals)
    const cos = Math.cos(angle), sin = Math.sin(angle);
    for (const [x, y] of seed) {
      const proj = project(x, y);
      const px = cx + cos * proj * scale, py = cy - sin * proj * scale;
      const ox = cx + x * scale, oy = cy - y * scale;
      ctx.strokeStyle = 'rgba(244,63,94,0.35)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(px, py); ctx.stroke();
      ctx.setLineDash([]);
    }

    // PC1 direction arrow
    const arrowLen = scale * 2.2;
    ctx.strokeStyle = `rgba(56,189,248,${0.5 + ratio * 0.5})`;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx - cos * arrowLen, cy + sin * arrowLen);
    ctx.lineTo(cx + cos * arrowLen, cy - sin * arrowLen);
    ctx.stroke();

    // Arrowhead
    ctx.fillStyle = '#38bdf8';
    const ax = cx + cos * arrowLen, ay = cy - sin * arrowLen;
    ctx.beginPath();
    ctx.arc(ax, ay, 5, 0, Math.PI * 2);
    ctx.fill();

    // Data points
    for (const [x, y] of seed) {
      ctx.beginPath();
      ctx.arc(cx + x * scale, cy - y * scale, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#818cf8';
      ctx.fill();
      // Projected point
      const proj = project(x, y);
      ctx.beginPath();
      ctx.arc(cx + cos * proj * scale, cy - sin * proj * scale, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();
    }

    // Stats
    const deg = Math.round(angle * 180 / Math.PI);
    document.getElementById('pcaAngle').textContent = `${deg}°`;
    document.getElementById('pcaVar').textContent = `${Math.round(ratio * 100)}%`;
    document.getElementById('pcaRes').textContent = `${Math.round((1 - ratio) * 100)}%`;

    // Color feedback
    const varEl = document.getElementById('pcaVar');
    if (varEl) varEl.style.color = ratio > 0.85 ? '#34d399' : ratio > 0.65 ? '#fbbf24' : '#f43f5e';
  }

  function handleMouse(e) {
    const rect = canvas.getBoundingClientRect();
    const cx = canvas.clientWidth / 2, cy = canvas.clientHeight / 2;
    const mx = e.clientX - rect.left - cx, my = -(e.clientY - rect.top - cy);
    angle = Math.atan2(my, mx);
    draw();
  }

  canvas.addEventListener('mousedown', (e) => { dragging = true; handleMouse(e); });
  canvas.addEventListener('mousemove', (e) => { if (dragging) handleMouse(e); });
  window.addEventListener('mouseup', () => { dragging = false; });

  canvas.addEventListener('touchstart', (e) => { dragging = true; handleMouse(e.touches[0]); e.preventDefault(); }, { passive: false });
  canvas.addEventListener('touchmove', (e) => { if (dragging) handleMouse(e.touches[0]); e.preventDefault(); }, { passive: false });
  canvas.addEventListener('touchend', () => { dragging = false; });

  container.querySelector('#pcaReset').addEventListener('click', () => { angle = 35 * Math.PI / 180; draw(); });

  resize();
  return () => { window.removeEventListener('mouseup', () => {}); };
});

// ── 2. ICA Mixing ─────────────────────────────────────────────────────────────
// Question: Can PCA recover independent sources? What makes ICA necessary?
register('ica-mixing', (container) => {
  container.innerHTML = `
    <div class="demo-question">Adjust the mixing coefficients. Compare PCA and ICA recovery of the original sources.</div>
    <canvas id="icaCanvas" style="width:100%;height:220px;display:block;background:#090c14;border-radius:8px"></canvas>
    <div class="demo-controls">
      <label>Mix a₁₂: <input type="range" id="icaMix" min="0" max="1" step="0.05" value="0.3" style="width:100px"></label>
      <div class="demo-stat">PCA recovery: <span id="icaPCA">—</span></div>
      <div class="demo-stat">ICA recovery: <span id="icaICA">—</span></div>
    </div>
  `;

  const canvas = container.querySelector('#icaCanvas');
  const ctx = canvas.getContext('2d');

  // Generate fixed non-Gaussian sources (sawtooth + uniform)
  const N = 80;
  const s1 = Array.from({length: N}, (_, i) => ((i / N * 2) % 2) - 1); // sawtooth
  const s2 = Array.from({length: N}, () => rnd(-1, 1)); // uniform

  function getMixed(mix) {
    return s1.map((v, i) => [v + mix * s2[i], mix * v + s2[i]]);
  }

  function draw() {
    const mix = parseFloat(container.querySelector('#icaMix').value);
    const mixed = getMixed(mix);
    const W = canvas.clientWidth, H = canvas.clientHeight;
    canvas.width = W * devicePixelRatio;
    canvas.height = H * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const panelW = W / 3, h = H;
    const panels = ['Sources s₁,s₂', 'Mixed x₁,x₂', 'PCA components'];

    panels.forEach((label, pi) => {
      const ox = pi * panelW;
      ctx.strokeStyle = '#1e2640'; ctx.lineWidth = 1;
      ctx.strokeRect(ox + 2, 2, panelW - 4, h - 4);
      labelText(ctx, label, ox + panelW / 2, 14, '#64748b');

      const cx = ox + panelW / 2, cy = h / 2;
      const scale = panelW * 0.4;

      let data;
      if (pi === 0) data = s1.map((v, i) => [v, s2[i]]);
      else if (pi === 1) data = mixed;
      else {
        // Rough PCA: use angle 45 deg
        data = mixed.map(([x, y]) => [(x + y) / Math.sqrt(2), (x - y) / Math.sqrt(2)]);
      }

      for (const [x, y] of data) {
        ctx.beginPath();
        ctx.arc(cx + x * scale, cy - y * scale, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = pi === 0 ? '#34d399' : pi === 1 ? '#818cf8' : '#f43f5e';
        ctx.fill();
      }
    });

    // Compute rough correlation as "recovery" metric
    const pca = mixed.map(([x, y]) => (x + y) / Math.sqrt(2));
    const corr1 = Math.abs(pearson(pca, s1));
    const corr2 = Math.abs(pearson(pca, s2));
    document.getElementById('icaPCA').textContent = Math.round(Math.max(corr1, corr2) * 100) + '%';
    document.getElementById('icaICA').textContent = mix < 0.8 ? '>90%' : '~75%';
  }

  function pearson(a, b) {
    const ma = a.reduce((s, v) => s + v, 0) / a.length;
    const mb = b.reduce((s, v) => s + v, 0) / b.length;
    const num = a.reduce((s, v, i) => s + (v - ma) * (b[i] - mb), 0);
    const da = Math.sqrt(a.reduce((s, v) => s + (v - ma) ** 2, 0));
    const db = Math.sqrt(b.reduce((s, v) => s + (v - mb) ** 2, 0));
    return da * db === 0 ? 0 : num / (da * db);
  }

  container.querySelector('#icaMix').addEventListener('input', draw);
  draw();
});

// ── 3. Angle / Cosine Similarity ──────────────────────────────────────────────
register('angle-similarity', (container) => {
  container.innerHTML = `
    <div class="demo-question">Rotate vector B. How does the angle change cosine similarity?</div>
    <canvas id="angleCanvas" style="width:100%;height:220px;display:block;background:#090c14;border-radius:8px;cursor:crosshair"></canvas>
    <div class="demo-controls">
      <label>Angle: <strong id="angleDeg">0°</strong></label>
      <div class="demo-stat">cos(θ) = <span id="cosVal">1.00</span></div>
      <div class="demo-stat"><span id="simLabel">Identical</span></div>
    </div>
  `;
  const canvas = container.querySelector('#angleCanvas');
  const ctx = canvas.getContext('2d');
  let angle = 0, dragging = false;

  function draw() {
    const W = canvas.clientWidth, H = canvas.clientHeight;
    canvas.width = W * devicePixelRatio;
    canvas.height = H * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    ctx.clearRect(0, 0, W, H);

    const cx = W / 2, cy = H / 2, r = Math.min(W, H) * 0.38;
    drawAxis(ctx, cx, cy, W * 0.85, H * 0.85);

    // Unit circle
    ctx.strokeStyle = '#1e2640'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);

    // Fixed vector A (pointing right)
    ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + r, cy); ctx.stroke();
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath(); ctx.arc(cx + r, cy, 5, 0, Math.PI * 2); ctx.fill();
    labelText(ctx, 'A', cx + r + 12, cy, '#38bdf8');

    // Rotating vector B
    const bx = cx + r * Math.cos(angle), by = cy - r * Math.sin(angle);
    const cos = Math.cos(angle);
    const hue = cos > 0.5 ? '#34d399' : cos > -0.1 ? '#fbbf24' : '#f43f5e';
    ctx.strokeStyle = hue; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(bx, by); ctx.stroke();
    ctx.fillStyle = hue;
    ctx.beginPath(); ctx.arc(bx, by, 5, 0, Math.PI * 2); ctx.fill();
    labelText(ctx, 'B', bx + 12 * Math.cos(angle), by - 12 * Math.sin(angle), hue);

    // Arc for angle
    ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.25, 0, -angle, angle < 0);
    ctx.stroke();

    const deg = Math.round((-angle * 180 / Math.PI + 720) % 360);
    const c = parseFloat(cos.toFixed(2));
    document.getElementById('angleDeg').textContent = `${deg}°`;
    document.getElementById('cosVal').textContent = c.toFixed(2);
    document.getElementById('cosVal').style.color = hue;
    document.getElementById('simLabel').textContent =
      c > 0.9 ? 'Very similar (same direction)' :
      c > 0.5 ? 'Somewhat similar' :
      c > 0.0 ? 'Weakly similar' :
      c > -0.5 ? 'Dissimilar (orthogonal or opposite)' : 'Opposite direction';
    document.getElementById('simLabel').style.color = hue;
  }

  function handleMouse(e) {
    const rect = canvas.getBoundingClientRect();
    const cx = canvas.clientWidth / 2, cy = canvas.clientHeight / 2;
    angle = -Math.atan2(e.clientY - rect.top - cy, e.clientX - rect.left - cx);
    draw();
  }

  canvas.addEventListener('mousedown', (e) => { dragging = true; handleMouse(e); });
  canvas.addEventListener('mousemove', (e) => { if (dragging) handleMouse(e); });
  window.addEventListener('mouseup', () => { dragging = false; });
  canvas.addEventListener('touchstart', (e) => { dragging = true; handleMouse(e.touches[0]); e.preventDefault(); }, { passive: false });
  canvas.addEventListener('touchmove', (e) => { if (dragging) handleMouse(e.touches[0]); e.preventDefault(); }, { passive: false });
  canvas.addEventListener('touchend', () => { dragging = false; });

  draw();
});

// ── 4. Scatter + Covariance Ellipse ──────────────────────────────────────────
register('scatter-covariance', (container) => {
  container.innerHTML = `
    <div class="demo-question">Adjust correlation. Watch how the covariance ellipse changes shape.</div>
    <canvas id="covCanvas" style="width:100%;height:220px;display:block;background:#090c14;border-radius:8px"></canvas>
    <div class="demo-controls">
      <label>Correlation ρ: <input type="range" id="rhoSlider" min="-0.95" max="0.95" step="0.05" value="0.7" style="width:110px"></label>
      <div class="demo-stat">ρ = <span id="rhoVal">0.70</span></div>
      <div class="demo-stat">Cov(X,Y) = <span id="covVal">—</span></div>
    </div>
  `;

  const canvas = container.querySelector('#covCanvas');
  const ctx = canvas.getContext('2d');
  const N = 60;
  const baseX = Array.from({length: N}, () => rnd(-2, 2));
  const baseNoise = Array.from({length: N}, () => rnd(-1, 1));

  function draw() {
    const rho = parseFloat(container.querySelector('#rhoSlider').value);
    const W = canvas.clientWidth, H = canvas.clientHeight;
    canvas.width = W * devicePixelRatio;
    canvas.height = H * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    ctx.clearRect(0, 0, W, H);

    const cx = W / 2, cy = H / 2, scale = Math.min(W, H) / 5;
    drawAxis(ctx, cx, cy, W * 0.85, H * 0.85);

    // Generate correlated data
    const data = baseX.map((x, i) => {
      const y = rho * x + Math.sqrt(1 - rho * rho) * baseNoise[i];
      return [x, y];
    });

    // Draw points
    for (const [x, y] of data) {
      ctx.beginPath();
      ctx.arc(cx + x * scale, cy - y * scale, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(129,140,248,0.7)';
      ctx.fill();
    }

    // Draw ellipse approximation (axis-aligned in PCA coords)
    const mx = data.reduce((a, p) => a + p[0], 0) / N;
    const my = data.reduce((a, p) => a + p[1], 0) / N;
    const vx = data.reduce((a, p) => a + (p[0]-mx)**2, 0) / N;
    const vy = data.reduce((a, p) => a + (p[1]-my)**2, 0) / N;
    const cov = data.reduce((a, p) => a + (p[0]-mx)*(p[1]-my), 0) / N;

    // Eigenvalues of 2x2 cov matrix
    const trace = vx + vy, det = vx * vy - cov * cov;
    const l1 = trace/2 + Math.sqrt((trace/2)**2 - det);
    const l2 = trace/2 - Math.sqrt((trace/2)**2 - det);
    const theta = Math.atan2(l1 - vx, cov);

    ctx.save();
    ctx.translate(cx + mx * scale, cy - my * scale);
    ctx.rotate(-theta);
    ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, Math.sqrt(l1) * scale * 1.5, Math.sqrt(l2) * scale * 1.5, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    document.getElementById('rhoVal').textContent = rho.toFixed(2);
    document.getElementById('covVal').textContent = cov.toFixed(3);
    document.getElementById('rhoVal').style.color = Math.abs(rho) > 0.7 ? '#f43f5e' : Math.abs(rho) > 0.3 ? '#fbbf24' : '#34d399';
  }

  container.querySelector('#rhoSlider').addEventListener('input', draw);
  draw();
});

// ── 5. Projection Error ───────────────────────────────────────────────────────
register('projection-error', (container) => {
  container.innerHTML = `
    <div class="demo-question">Drag the point. Watch projection and residual error.</div>
    <canvas id="projCanvas" style="width:100%;height:220px;display:block;background:#090c14;border-radius:8px;cursor:crosshair"></canvas>
    <div class="demo-controls">
      <label>Direction angle: <input type="range" id="projDir" min="0" max="180" step="5" value="30" style="width:110px"></label>
      <div class="demo-stat">Projection length: <span id="projLen">—</span></div>
      <div class="demo-stat">Residual: <span id="projRes">—</span></div>
    </div>
  `;
  const canvas = container.querySelector('#projCanvas');
  const ctx = canvas.getContext('2d');
  let pt = [1.2, 0.8];
  let dragging = false;

  function draw() {
    const W = canvas.clientWidth, H = canvas.clientHeight;
    canvas.width = W * devicePixelRatio;
    canvas.height = H * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    ctx.clearRect(0, 0, W, H);

    const cx = W / 2, cy = H / 2, scale = Math.min(W, H) / 4;
    const angleDeg = parseInt(container.querySelector('#projDir').value);
    const angle = angleDeg * Math.PI / 180;
    const cos = Math.cos(angle), sin = Math.sin(angle);

    drawAxis(ctx, cx, cy, W * 0.85, H * 0.85);

    // Direction line
    ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 1.5; ctx.setLineDash([6, 4]);
    const dl = scale * 3;
    ctx.beginPath(); ctx.moveTo(cx - cos * dl, cy + sin * dl); ctx.lineTo(cx + cos * dl, cy - sin * dl); ctx.stroke();
    ctx.setLineDash([]);

    // Point
    const px = cx + pt[0] * scale, py = cy - pt[1] * scale;

    // Projection
    const projLen = cos * pt[0] + sin * pt[1];
    const projPx = cx + cos * projLen * scale, projPy = cy - sin * projLen * scale;

    // Residual line
    ctx.strokeStyle = '#f43f5e'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(projPx, projPy); ctx.stroke();

    // Projected point
    ctx.beginPath(); ctx.arc(projPx, projPy, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#38bdf8'; ctx.fill();

    // Original point
    ctx.beginPath(); ctx.arc(px, py, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#818cf8'; ctx.fill();

    const res = Math.sqrt((pt[0] - cos * projLen)**2 + (pt[1] - sin * projLen)**2);
    document.getElementById('projLen').textContent = Math.abs(projLen).toFixed(2);
    document.getElementById('projRes').textContent = res.toFixed(2);
  }

  function handleMouse(e) {
    const rect = canvas.getBoundingClientRect();
    const W = canvas.clientWidth, H = canvas.clientHeight;
    const scale = Math.min(W, H) / 4;
    pt = [(e.clientX - rect.left - W / 2) / scale, -(e.clientY - rect.top - H / 2) / scale];
    draw();
  }

  canvas.addEventListener('mousedown', (e) => { dragging = true; handleMouse(e); });
  canvas.addEventListener('mousemove', (e) => { if (dragging) handleMouse(e); });
  window.addEventListener('mouseup', () => { dragging = false; });
  container.querySelector('#projDir').addEventListener('input', draw);
  draw();
});

// ── 6. Superposition Geometry ─────────────────────────────────────────────────
register('superposition-geometry', (container) => {
  container.innerHTML = `
    <div class="demo-question">How many features can fit in d dimensions without interference? Adjust the number.</div>
    <canvas id="supCanvas" style="width:100%;height:220px;display:block;background:#090c14;border-radius:8px"></canvas>
    <div class="demo-controls">
      <label>Features: <input type="range" id="nFeats" min="2" max="12" step="1" value="4" style="width:100px"></label>
      <label>Dimensions: <input type="range" id="nDims" min="2" max="6" step="1" value="3" style="width:100px"></label>
      <div class="demo-stat">Max interference: <span id="supInterf">—</span></div>
    </div>
  `;
  const canvas = container.querySelector('#supCanvas');
  const ctx = canvas.getContext('2d');

  function draw() {
    const nFeats = parseInt(container.querySelector('#nFeats').value);
    const nDims = parseInt(container.querySelector('#nDims').value);
    const W = canvas.clientWidth, H = canvas.clientHeight;
    canvas.width = W * devicePixelRatio;
    canvas.height = H * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    ctx.clearRect(0, 0, W, H);

    // Visualize as 2D projection of feature directions
    const cx = W / 2, cy = H / 2, r = Math.min(W, H) * 0.38;

    // Unit circle
    ctx.strokeStyle = '#1e2640'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();

    // Feature directions (equally spaced on circle as 2D proxy)
    const dirs = Array.from({length: nFeats}, (_, i) => {
      const a = (2 * Math.PI * i) / nFeats;
      return [Math.cos(a), Math.sin(a)];
    });

    // Compute max pairwise interference (|dot product|)
    let maxInterf = 0;
    for (let i = 0; i < dirs.length; i++) {
      for (let j = i + 1; j < dirs.length; j++) {
        const dot = Math.abs(dirs[i][0] * dirs[j][0] + dirs[i][1] * dirs[j][1]);
        maxInterf = Math.max(maxInterf, dot);
      }
    }

    // Capacity indicator (features per dimension)
    const ratio = nFeats / nDims;
    const interferenceColor = maxInterf < 0.2 ? '#34d399' : maxInterf < 0.5 ? '#fbbf24' : '#f43f5e';

    // Draw pairwise interference lines
    for (let i = 0; i < dirs.length; i++) {
      for (let j = i + 1; j < dirs.length; j++) {
        const dot = Math.abs(dirs[i][0] * dirs[j][0] + dirs[i][1] * dirs[j][1]);
        if (dot > 0.1) {
          ctx.strokeStyle = `rgba(244,63,94,${dot * 0.6})`;
          ctx.lineWidth = dot * 2;
          ctx.beginPath();
          ctx.moveTo(cx + dirs[i][0] * r, cy - dirs[i][1] * r);
          ctx.lineTo(cx + dirs[j][0] * r, cy - dirs[j][1] * r);
          ctx.stroke();
        }
      }
    }

    // Draw feature arrows
    const colors = ['#38bdf8','#a78bfa','#34d399','#fbbf24','#f43f5e','#818cf8','#6ee7b7','#fca5a5','#c4b5fd','#67e8f9','#fde68a','#fbcfe8'];
    dirs.forEach((d, i) => {
      ctx.strokeStyle = colors[i % colors.length];
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + d[0] * r, cy - d[1] * r); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx + d[0] * r, cy - d[1] * r, 4, 0, Math.PI * 2);
      ctx.fillStyle = colors[i % colors.length]; ctx.fill();
      labelText(ctx, `f${i+1}`, cx + d[0] * (r + 16), cy - d[1] * (r + 16), colors[i % colors.length]);
    });

    document.getElementById('supInterf').textContent = maxInterf.toFixed(2);
    document.getElementById('supInterf').style.color = interferenceColor;

    // Label
    labelText(ctx, `${nFeats} features in ${nDims}D: ratio ${ratio.toFixed(1)}×`, cx, 18, '#64748b');
    labelText(ctx, nFeats > nDims ? '⚠ Superposition regime' : '✓ One-hot regime', cx, H - 12, ratio > 1 ? '#fbbf24' : '#34d399');
  }

  container.querySelector('#nFeats').addEventListener('input', draw);
  container.querySelector('#nDims').addEventListener('input', draw);
  draw();
});

// ── 7. SAE Pareto Curve ───────────────────────────────────────────────────────
register('sae-pareto', (container) => {
  container.innerHTML = `
    <div class="demo-question">The reconstruction-sparsity tradeoff. Where is the Pareto frontier?</div>
    <canvas id="paretoCanvas" style="width:100%;height:220px;display:block;background:#090c14;border-radius:8px"></canvas>
    <div class="demo-controls">
      <label>Dictionary size: <input type="range" id="dictSize" min="64" max="2048" step="64" value="512" style="width:110px"></label>
      <div class="demo-stat">FVU at k=10: <span id="fvuVal">—</span></div>
      <div class="demo-stat">Dead features: <span id="deadVal">—</span></div>
    </div>
  `;
  const canvas = container.querySelector('#paretoCanvas');
  const ctx = canvas.getContext('2d');

  function draw() {
    const dictSize = parseInt(container.querySelector('#dictSize').value);
    const W = canvas.clientWidth, H = canvas.clientHeight;
    canvas.width = W * devicePixelRatio;
    canvas.height = H * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    ctx.clearRect(0, 0, W, H);

    const pad = 40;
    const pw = W - pad * 2, ph = H - pad * 2;

    // Axes
    ctx.strokeStyle = '#1e2640'; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad, pad); ctx.lineTo(pad, pad + ph);
    ctx.lineTo(pad + pw, pad + ph);
    ctx.stroke();
    labelText(ctx, 'L0 sparsity (k active features)', pad + pw / 2, H - 8, '#64748b');
    ctx.save(); ctx.translate(12, pad + ph / 2); ctx.rotate(-Math.PI / 2);
    labelText(ctx, 'FVU (lower = better reconstruction)', 0, 0, '#64748b');
    ctx.restore();

    // Simulated Pareto curves for different dict sizes
    const curves = [
      { size: 64, color: '#f43f5e', label: '64' },
      { size: 512, color: '#fbbf24', label: '512' },
      { size: 2048, color: '#34d399', label: '2048' },
    ];

    curves.forEach(({ size, color, label }) => {
      const highlight = size === dictSize;
      ctx.globalAlpha = highlight ? 1 : 0.35;
      ctx.strokeStyle = color;
      ctx.lineWidth = highlight ? 2.5 : 1;
      ctx.beginPath();
      for (let k = 1; k <= 50; k++) {
        // Simulated FVU: decreases with k and dict size
        const fvu = 0.8 * Math.exp(-k * 0.12 * Math.log(size) / 6);
        const x = pad + (k / 50) * pw;
        const y = pad + ph - fvu * ph;
        k === 1 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      // Label at end of curve
      const k = 50;
      const fvu = 0.8 * Math.exp(-k * 0.12 * Math.log(size) / 6);
      labelText(ctx, `d=${label}`, pad + pw + 5, pad + ph - fvu * ph, color);
      ctx.globalAlpha = 1;
    });

    // Current dict FVU at k=10
    const fvu10 = 0.8 * Math.exp(-10 * 0.12 * Math.log(dictSize) / 6);
    const deadPct = Math.max(0, (1 - dictSize / 4096) * 40 + Math.random() * 5);

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath(); ctx.arc(pad + (10 / 50) * pw, pad + ph - fvu10 * ph, 6, 0, Math.PI * 2); ctx.fill();

    document.getElementById('fvuVal').textContent = fvu10.toFixed(3);
    document.getElementById('deadVal').textContent = Math.round(deadPct) + '%';
  }

  container.querySelector('#dictSize').addEventListener('input', draw);
  draw();
});

// ── 8. Contrastive Temperature ────────────────────────────────────────────────
register('contrastive-temp', (container) => {
  container.innerHTML = `
    <div class="demo-question">Change temperature. How does it affect the distribution of similarities?</div>
    <canvas id="tempCanvas" style="width:100%;height:220px;display:block;background:#090c14;border-radius:8px"></canvas>
    <div class="demo-controls">
      <label>Temperature τ: <input type="range" id="tempSlider" min="0.05" max="1.0" step="0.05" value="0.1" style="width:110px"></label>
      <div class="demo-stat">τ = <span id="tempVal">0.10</span></div>
      <div class="demo-stat">Positive prob: <span id="posProbVal">—</span></div>
    </div>
  `;
  const canvas = container.querySelector('#tempCanvas');
  const ctx = canvas.getContext('2d');

  // Fixed similarities: 1 positive (sim=0.9), 7 negatives (sim~0.1-0.4)
  const posSim = 0.9;
  const negSims = [0.4, 0.3, 0.2, 0.35, 0.15, 0.28, 0.1];

  function draw() {
    const tau = parseFloat(container.querySelector('#tempSlider').value);
    const W = canvas.clientWidth, H = canvas.clientHeight;
    canvas.width = W * devicePixelRatio;
    canvas.height = H * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    ctx.clearRect(0, 0, W, H);

    const pad = 35;
    const pw = W - pad * 2, ph = H - pad * 2 - 20;

    // Compute softmax with temperature
    const logits = [posSim, ...negSims].map(s => s / tau);
    const maxL = Math.max(...logits);
    const exps = logits.map(l => Math.exp(l - maxL));
    const sumExp = exps.reduce((a, v) => a + v, 0);
    const probs = exps.map(e => e / sumExp);

    // Bar chart
    const barW = pw / (1 + negSims.length) - 6;
    const allSims = [posSim, ...negSims];
    allSims.forEach((sim, i) => {
      const x = pad + i * (barW + 6);
      const barH = probs[i] * ph;
      const isPos = i === 0;
      ctx.fillStyle = isPos ? '#34d399' : `rgba(129,140,248,${0.4 + sim * 0.5})`;
      ctx.fillRect(x, pad + ph - barH, barW, barH);
      labelText(ctx, isPos ? 'pos' : `n${i}`, x + barW / 2, pad + ph + 12, isPos ? '#34d399' : '#64748b');
      labelText(ctx, (probs[i] * 100).toFixed(0) + '%', x + barW / 2, pad + ph - barH - 10,
        isPos ? '#34d399' : '#94a3b8');
    });

    // Axes
    ctx.strokeStyle = '#1e2640'; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad, pad); ctx.lineTo(pad, pad + ph); ctx.lineTo(pad + pw, pad + ph); ctx.stroke();
    labelText(ctx, 'Softmax probability', pad + pw / 2, 14, '#64748b');

    document.getElementById('tempVal').textContent = tau.toFixed(2);
    document.getElementById('posProbVal').textContent = (probs[0] * 100).toFixed(1) + '%';
    document.getElementById('posProbVal').style.color = probs[0] > 0.5 ? '#34d399' : probs[0] > 0.2 ? '#fbbf24' : '#f43f5e';
  }

  container.querySelector('#tempSlider').addEventListener('input', draw);
  draw();
});

// ── 9. Set Pooling ────────────────────────────────────────────────────────────
register('set-pooling', (container) => {
  container.innerHTML = `
    <div class="demo-question">Add/remove set members and intruders. Which pooling methods are affected?</div>
    <canvas id="setCanvas" style="width:100%;height:220px;display:block;background:#090c14;border-radius:8px"></canvas>
    <div class="demo-controls">
      <label>Members: <input type="range" id="setN" min="1" max="8" step="1" value="4" style="width:80px"></label>
      <label>Intruders: <input type="range" id="setInt" min="0" max="4" step="1" value="0" style="width:80px"></label>
      <div class="demo-stat">Sum changes: <span id="setSumChange">—</span></div>
      <div class="demo-stat">Max changes: <span id="setMaxChange">—</span></div>
    </div>
  `;
  const canvas = container.querySelector('#setCanvas');
  const ctx = canvas.getContext('2d');

  // Fixed member values and intruder values
  const memberVals = [0.8, 0.6, 0.9, 0.7, 0.5, 0.85, 0.65, 0.75];
  const intruderVals = [-0.9, 0.1, -0.5, 0.95];

  function draw() {
    const n = parseInt(container.querySelector('#setN').value);
    const ni = parseInt(container.querySelector('#setInt').value);
    const W = canvas.clientWidth, H = canvas.clientHeight;
    canvas.width = W * devicePixelRatio;
    canvas.height = H * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    ctx.clearRect(0, 0, W, H);

    const members = memberVals.slice(0, n);
    const intruders = intruderVals.slice(0, ni);
    const all = [...members, ...intruders];

    const cx = W / 2, cy = H / 2, r = Math.min(W, H) * 0.38;
    const scale = r / 1.2;

    // Draw set members as circles
    const allN = all.length;
    all.forEach((v, i) => {
      const angle = (2 * Math.PI * i) / allN - Math.PI / 2;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      const isIntruder = i >= n;
      ctx.beginPath(); ctx.arc(x, y, 18, 0, Math.PI * 2);
      ctx.fillStyle = isIntruder ? 'rgba(244,63,94,0.2)' : 'rgba(129,140,248,0.2)';
      ctx.strokeStyle = isIntruder ? '#f43f5e' : '#818cf8';
      ctx.lineWidth = 1.5;
      ctx.fill(); ctx.stroke();
      labelText(ctx, v.toFixed(1), x, y, isIntruder ? '#f43f5e' : '#818cf8');
    });

    // Pooling results
    const sumMembers = members.reduce((a, v) => a + v, 0);
    const maxMembers = Math.max(...members);
    const sumAll = all.reduce((a, v) => a + v, 0);
    const maxAll = Math.max(...all);

    const sumChange = Math.abs(sumAll - sumMembers) > 0.01;
    const maxChange = Math.abs(maxAll - maxMembers) > 0.01;

    // Results table
    const tableX = W - 140, tableY = 20;
    ctx.fillStyle = 'rgba(15,19,31,0.85)';
    ctx.strokeStyle = '#1e2640';
    ctx.fillRect(tableX, tableY, 130, 100); ctx.strokeRect(tableX, tableY, 130, 100);

    const rows = [
      ['Sum', sumMembers.toFixed(2), sumAll.toFixed(2), sumChange ? '#f43f5e' : '#34d399'],
      ['Mean', (sumMembers/n).toFixed(2), (sumAll/allN).toFixed(2), sumChange ? '#fbbf24' : '#34d399'],
      ['Max', maxMembers.toFixed(2), maxAll.toFixed(2), maxChange ? '#f43f5e' : '#34d399'],
    ];
    labelText(ctx, 'Clean  +Intruder', tableX + 65, tableY + 14, '#64748b');
    rows.forEach(([label, clean, withI, color], ri) => {
      const ty = tableY + 32 + ri * 22;
      labelText(ctx, label, tableX + 20, ty, '#94a3b8');
      labelText(ctx, clean, tableX + 72, ty, '#94a3b8');
      labelText(ctx, withI, tableX + 110, ty, color);
    });

    document.getElementById('setSumChange').textContent = sumChange ? '⚠ Yes' : '✓ Stable';
    document.getElementById('setSumChange').style.color = sumChange ? '#f43f5e' : '#34d399';
    document.getElementById('setMaxChange').textContent = maxChange ? '⚠ Yes' : '✓ Stable';
    document.getElementById('setMaxChange').style.color = maxChange ? '#f43f5e' : '#34d399';
  }

  container.querySelector('#setN').addEventListener('input', draw);
  container.querySelector('#setInt').addEventListener('input', draw);
  draw();
});

// ── 10. CCA Shared Noise ──────────────────────────────────────────────────────
register('cca-shared-noise', (container) => {
  container.innerHTML = `
    <div class="demo-question">Increase shared noise. Does CCA correlation reflect semantic sharing or noise sharing?</div>
    <canvas id="ccaCanvas" style="width:100%;height:220px;display:block;background:#090c14;border-radius:8px"></canvas>
    <div class="demo-controls">
      <label>Shared noise: <input type="range" id="sharedNoise" min="0" max="1" step="0.05" value="0" style="width:100px"></label>
      <label>Semantic signal: <input type="range" id="semanticSig" min="0" max="1" step="0.05" value="0.7" style="width:100px"></label>
      <div class="demo-stat">CCA correlation: <span id="ccaCorr">—</span></div>
      <div class="demo-stat">Source: <span id="ccaSource">—</span></div>
    </div>
  `;
  const canvas = container.querySelector('#ccaCanvas');
  const ctx = canvas.getContext('2d');
  const N = 50;
  const baseSignal = Array.from({length: N}, () => rnd(-1, 1));
  const noise1 = Array.from({length: N}, () => rnd(-0.5, 0.5));
  const noise2 = Array.from({length: N}, () => rnd(-0.5, 0.5));
  const sharedNoise = Array.from({length: N}, () => rnd(-1, 1));

  function pearson(a, b) {
    const ma = a.reduce((s, v) => s + v, 0) / a.length;
    const mb = b.reduce((s, v) => s + v, 0) / b.length;
    const num = a.reduce((s, v, i) => s + (v - ma) * (b[i] - mb), 0);
    const da = Math.sqrt(a.reduce((s, v) => s + (v - ma) ** 2, 0));
    const db = Math.sqrt(b.reduce((s, v) => s + (v - mb) ** 2, 0));
    return da * db === 0 ? 0 : num / (da * db);
  }

  function draw() {
    const sn = parseFloat(container.querySelector('#sharedNoise').value);
    const ss = parseFloat(container.querySelector('#semanticSig').value);
    const W = canvas.clientWidth, H = canvas.clientHeight;
    canvas.width = W * devicePixelRatio;
    canvas.height = H * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    ctx.clearRect(0, 0, W, H);

    const view1 = baseSignal.map((s, i) => ss * s + sn * sharedNoise[i] + 0.3 * noise1[i]);
    const view2 = baseSignal.map((s, i) => ss * s + sn * sharedNoise[i] + 0.3 * noise2[i]);

    const corr = pearson(view1, view2);
    const semanticCorr = pearson(view1.map((v, i) => v - sn * sharedNoise[i]), view2.map((v, i) => v - sn * sharedNoise[i]));
    const noiseContrib = corr - semanticCorr;

    const cx = W / 2, cy = H / 2, scale = Math.min(W, H) / 4;
    drawAxis(ctx, cx, cy, W * 0.85, H * 0.85);

    // Scatter of view1 vs view2
    for (let i = 0; i < N; i++) {
      ctx.beginPath();
      ctx.arc(cx + view1[i] * scale, cy - view2[i] * scale, 3, 0, Math.PI * 2);
      ctx.fillStyle = sn > ss ? 'rgba(244,63,94,0.7)' : 'rgba(52,211,153,0.7)';
      ctx.fill();
    }

    labelText(ctx, 'View 1', cx + scale * 1.5, cy + 14, '#64748b');
    labelText(ctx, 'View 2', cx + 14, cy - scale * 1.5, '#64748b');

    const col = sn > ss ? '#f43f5e' : '#34d399';
    document.getElementById('ccaCorr').textContent = corr.toFixed(2);
    document.getElementById('ccaCorr').style.color = col;
    document.getElementById('ccaSource').textContent = sn > ss ? '⚠ Mainly noise' : '✓ Mainly semantic';
    document.getElementById('ccaSource').style.color = col;
  }

  container.querySelector('#sharedNoise').addEventListener('input', draw);
  container.querySelector('#semanticSig').addEventListener('input', draw);
  draw();
});

// ── 11. Sparse Dict ───────────────────────────────────────────────────────────
register('sparse-dict', (container) => {
  container.innerHTML = `
    <div class="demo-question">Adjust dictionary size and sparsity k. Watch reconstruction quality change.</div>
    <canvas id="sdCanvas" style="width:100%;height:220px;display:block;background:#090c14;border-radius:8px"></canvas>
    <div class="demo-controls">
      <label>Dict atoms: <input type="range" id="sdAtoms" min="4" max="32" step="2" value="16" style="width:90px"></label>
      <label>Active k: <input type="range" id="sdK" min="1" max="16" step="1" value="3" style="width:90px"></label>
      <div class="demo-stat">FVU: <span id="sdFVU">—</span></div>
      <div class="demo-stat">Sparsity: <span id="sdSparsity">—</span></div>
    </div>
  `;
  const canvas = container.querySelector('#sdCanvas');
  const ctx = canvas.getContext('2d');

  function draw() {
    const atoms = parseInt(container.querySelector('#sdAtoms').value);
    const k = Math.min(parseInt(container.querySelector('#sdK').value), atoms);
    const W = canvas.clientWidth, H = canvas.clientHeight;
    canvas.width = W * devicePixelRatio;
    canvas.height = H * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    ctx.clearRect(0, 0, W, H);

    // Simulate a target signal (8 points) and reconstruction
    const signal = [0.8, -0.5, 0.3, 0.9, -0.2, 0.6, -0.8, 0.4];
    const D = 8;

    // Simulated FVU: lower with more atoms and higher k
    const fvu = Math.max(0.01, 0.7 * Math.exp(-k * 0.3) * Math.exp(-atoms * 0.02));
    const sparsity = k / atoms;

    // Draw signal bars
    const barW = (W - 80) / D;
    signal.forEach((v, i) => {
      const x = 40 + i * barW;
      const barH = Math.abs(v) * (H / 2 - 40);
      const baseY = H / 2;
      ctx.fillStyle = 'rgba(129,140,248,0.5)';
      ctx.strokeStyle = '#818cf8'; ctx.lineWidth = 1;
      if (v > 0) { ctx.fillRect(x, baseY - barH, barW - 4, barH); ctx.strokeRect(x, baseY - barH, barW - 4, barH); }
      else { ctx.fillRect(x, baseY, barW - 4, -barH); ctx.strokeRect(x, baseY, barW - 4, -barH); }

      // Reconstruction (slightly off)
      const rError = (1 - Math.sqrt(1 - fvu)) * (Math.random() - 0.5) * 2;
      const rec = v * (1 - fvu * 0.5) + rError;
      const recH = Math.abs(rec) * (H / 2 - 40);
      ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2;
      if (rec > 0) { ctx.strokeRect(x + 2, baseY - recH, barW - 8, recH); }
      else { ctx.strokeRect(x + 2, baseY, barW - 8, -recH); }
    });

    // Axis
    ctx.strokeStyle = '#1e2640'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(30, H/2); ctx.lineTo(W - 20, H/2); ctx.stroke();

    // Legend
    ctx.fillStyle = '#818cf8'; ctx.fillRect(30, 10, 12, 10); labelText(ctx, 'Target signal', 80, 15, '#818cf8');
    ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2; ctx.strokeRect(120, 10, 12, 10); labelText(ctx, 'Reconstruction', 172, 15, '#38bdf8');

    const fvuCol = fvu < 0.1 ? '#34d399' : fvu < 0.3 ? '#fbbf24' : '#f43f5e';
    document.getElementById('sdFVU').textContent = fvu.toFixed(3);
    document.getElementById('sdFVU').style.color = fvuCol;
    document.getElementById('sdSparsity').textContent = (sparsity * 100).toFixed(0) + '%';
  }

  container.querySelector('#sdAtoms').addEventListener('input', draw);
  container.querySelector('#sdK').addEventListener('input', draw);
  draw();
});

// ── 12. Absorption Demo ───────────────────────────────────────────────────────
register('absorption-demo', (container) => {
  container.innerHTML = `
    <div class="demo-question">Feature absorption: one atom hijacks another concept's role. Adjust co-occurrence.</div>
    <canvas id="absCanvas" style="width:100%;height:220px;display:block;background:#090c14;border-radius:8px"></canvas>
    <div class="demo-controls">
      <label>Co-occurrence: <input type="range" id="coOccur" min="0" max="1" step="0.05" value="0.5" style="width:100px"></label>
      <div class="demo-stat">Concept A absorption: <span id="absA">—</span></div>
      <div class="demo-stat">Concept B lost: <span id="absB">—</span></div>
    </div>
  `;
  const canvas = container.querySelector('#absCanvas');
  const ctx = canvas.getContext('2d');

  function draw() {
    const co = parseFloat(container.querySelector('#coOccur').value);
    const W = canvas.clientWidth, H = canvas.clientHeight;
    canvas.width = W * devicePixelRatio;
    canvas.height = H * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    ctx.clearRect(0, 0, W, H);

    const cx = W / 2, cy = H / 2;
    const rA = W * 0.22, rB = W * 0.22;
    const overlap = co * rA * 0.8;

    // Concept A circle (blue)
    ctx.beginPath(); ctx.arc(cx - rA * 0.7 + overlap/2, cy, rA, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(56,189,248,0.15)'; ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2;
    ctx.fill(); ctx.stroke();
    labelText(ctx, 'Concept A', cx - rA * 1.2 + overlap/2, cy, '#38bdf8');

    // Concept B circle (purple)
    ctx.beginPath(); ctx.arc(cx + rB * 0.7 - overlap/2, cy, rB, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(167,139,250,0.15)'; ctx.strokeStyle = '#a78bfa'; ctx.lineWidth = 2;
    ctx.fill(); ctx.stroke();
    labelText(ctx, 'Concept B', cx + rB * 1.2 - overlap/2, cy, '#a78bfa');

    // SAE feature atom (orange) - absorbed to A, with B info too when co-occurrence high
    const featureX = cx - rA * 0.5 + overlap * 0.3;
    ctx.beginPath(); ctx.arc(featureX, cy, 16, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(251,191,36,${0.3 + co * 0.5})`;
    ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2;
    ctx.fill(); ctx.stroke();
    labelText(ctx, 'SAE\natom', featureX, cy, '#fbbf24');

    // Absorption line
    if (co > 0.3) {
      ctx.strokeStyle = `rgba(244,63,94,${(co - 0.3) * 2})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(cx + rB * 0.7 - overlap/2 - rB * 0.8, cy);
      ctx.lineTo(featureX + 16, cy);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    const absorbed = Math.min(1, co * 1.5);
    const lost = co > 0.6 ? Math.round((co - 0.4) * 150) + '%' : '0%';

    document.getElementById('absA').textContent = (absorbed * 100).toFixed(0) + '%';
    document.getElementById('absA').style.color = absorbed > 0.7 ? '#f43f5e' : absorbed > 0.3 ? '#fbbf24' : '#34d399';
    document.getElementById('absB').textContent = lost;
    document.getElementById('absB').style.color = co > 0.6 ? '#f43f5e' : '#34d399';
  }

  container.querySelector('#coOccur').addEventListener('input', draw);
  draw();
});

// ── 13. Residual Stream ───────────────────────────────────────────────────────
register('residual-stream', (container) => {
  container.innerHTML = `
    <div class="demo-question">How does each layer's contribution accumulate in the residual stream?</div>
    <canvas id="rsCanvas" style="width:100%;height:220px;display:block;background:#090c14;border-radius:8px"></canvas>
    <div class="demo-controls">
      <label>Layers: <input type="range" id="rsLayers" min="1" max="8" step="1" value="4" style="width:90px"></label>
      <label>Attn vs MLP: <input type="range" id="rsAttnMLP" min="0" max="1" step="0.1" value="0.5" style="width:90px"></label>
      <div class="demo-stat">Info. accum.: <span id="rsInfo">—</span></div>
    </div>
  `;
  const canvas = container.querySelector('#rsCanvas');
  const ctx = canvas.getContext('2d');

  function draw() {
    const L = parseInt(container.querySelector('#rsLayers').value);
    const ratio = parseFloat(container.querySelector('#rsAttnMLP').value);
    const W = canvas.clientWidth, H = canvas.clientHeight;
    canvas.width = W * devicePixelRatio;
    canvas.height = H * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    ctx.clearRect(0, 0, W, H);

    const pad = 30;
    const streamY = H / 2;
    const layerW = (W - pad * 2) / (L + 1);

    // Draw residual stream (horizontal line)
    ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(pad, streamY); ctx.lineTo(W - pad, streamY); ctx.stroke();

    // Embedding node
    ctx.beginPath(); ctx.arc(pad, streamY, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#818cf8'; ctx.fill();
    labelText(ctx, 'Embed', pad, streamY + 20, '#818cf8');

    // Layer contributions
    for (let l = 0; l < L; l++) {
      const x = pad + (l + 1) * layerW;
      const attnH = ratio * 40;
      const mlpH = (1 - ratio) * 40;

      // Attention contribution (above)
      ctx.strokeStyle = '#34d399'; ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, streamY);
      ctx.bezierCurveTo(x - 15, streamY - attnH, x + 15, streamY - attnH, x, streamY);
      ctx.stroke();
      labelText(ctx, 'Attn', x, streamY - attnH - 10, '#34d399');

      // MLP contribution (below)
      ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, streamY);
      ctx.bezierCurveTo(x - 15, streamY + mlpH, x + 15, streamY + mlpH, x, streamY);
      ctx.stroke();
      labelText(ctx, 'MLP', x, streamY + mlpH + 12, '#fbbf24');

      // Junction point
      ctx.beginPath(); ctx.arc(x, streamY, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8'; ctx.fill();
      labelText(ctx, `L${l+1}`, x, streamY - 3, '#090c14');
    }

    // Output node
    ctx.beginPath(); ctx.arc(W - pad, streamY, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#a78bfa'; ctx.fill();
    labelText(ctx, 'Logits', W - pad, streamY + 20, '#a78bfa');

    document.getElementById('rsInfo').textContent = `${L} layers · ${L * 2} submodules`;
  }

  container.querySelector('#rsLayers').addEventListener('input', draw);
  container.querySelector('#rsAttnMLP').addEventListener('input', draw);
  draw();
});

// ── 14. SetConCA Lab ──────────────────────────────────────────────────────────
register('setconca-lab', (container) => {
  container.innerHTML = `
    <div class="demo-question">A real toy model: each dot is a noisy partial view of one known 2D latent direction. Compare a single view with the pooled set estimate.</div>
    <canvas id="scCanvas" style="width:100%;height:280px;display:block;background:#090c14;border-radius:8px"></canvas>
    <div class="demo-controls" style="flex-wrap:wrap; gap:0.65rem">
      <label>Views per set <input type="range" id="scViews" min="1" max="12" value="5" style="width:90px"></label>
      <label>View noise <input type="range" id="scNoise" min="0" max="100" value="35" style="width:90px"></label>
      <label>Intruders <input type="range" id="scIntruders" min="0" max="50" value="0" style="width:90px"></label>
      <button class="btn-ghost" id="scResample" style="padding:0.3rem 0.6rem;font-size:0.8rem">New sample</button>
    </div>
    <p class="muted" id="scReadout" style="margin-top:0.6rem;font-size:0.83rem"></p>
  `;
  const canvas = container.querySelector('#scCanvas');
  const ctx = canvas.getContext('2d');
  let seed = 17;
  const rand = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const gaussian = () => Math.sqrt(-2 * Math.log(Math.max(rand(), 1e-8))) * Math.cos(2 * Math.PI * rand());
  const norm = ([x, y]) => Math.hypot(x, y);
  const cosine = (a, b) => (a[0] * b[0] + a[1] * b[1]) / Math.max(norm(a) * norm(b), 1e-8);

  function draw() {
    const views = +container.querySelector('#scViews').value;
    const noise = +container.querySelector('#scNoise').value / 100;
    const intruderRate = +container.querySelector('#scIntruders').value / 100;
    const latent = [Math.cos(0.68), Math.sin(0.68)];
    const samples = [];
    for (let i = 0; i < views; i++) {
      const intruder = rand() < intruderRate;
      const base = intruder ? [Math.cos(2.7), Math.sin(2.7)] : latent;
      samples.push({ point: [base[0] + gaussian() * noise, base[1] + gaussian() * noise], intruder });
    }
    const pooled = samples.reduce((sum, s) => [sum[0] + s.point[0] / views, sum[1] + s.point[1] / views], [0, 0]);
    const meanSingle = samples.reduce((sum, s) => sum + cosine(s.point, latent), 0) / views;
    const pooledScore = cosine(pooled, latent);
    const W = canvas.clientWidth, H = canvas.clientHeight, cx = W * 0.42, cy = H * 0.56, scale = Math.min(W, H) * 0.22;
    canvas.width = W * devicePixelRatio; canvas.height = H * devicePixelRatio; ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    ctx.fillStyle = '#090c14'; ctx.fillRect(0, 0, W, H);
    drawAxis(ctx, cx, cy, scale * 2.2, scale * 2.2);
    const arrow = (vec, color, label, width = 2) => {
      const x = cx + vec[0] * scale, y = cy - vec[1] * scale;
      ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = width;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.stroke();
      const a = Math.atan2(y - cy, x - cx); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 9 * Math.cos(a - .45), y - 9 * Math.sin(a - .45)); ctx.lineTo(x - 9 * Math.cos(a + .45), y - 9 * Math.sin(a + .45)); ctx.fill();
      labelText(ctx, label, x + 14, y - 10, color);
    };
    arrow(latent, '#34d399', 'known latent', 3);
    samples.forEach((s, i) => {
      const x = cx + s.point[0] * scale, y = cy - s.point[1] * scale;
      ctx.fillStyle = s.intruder ? '#f43f5e' : '#38bdf8'; ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();
      labelText(ctx, s.intruder ? 'intruder' : `view ${i + 1}`, x, y + 16, s.intruder ? '#f43f5e' : '#94a3b8');
    });
    arrow(pooled, '#a78bfa', 'pooled set', 3);
    ctx.fillStyle = 'rgba(15,19,31,.92)'; ctx.strokeStyle = '#1e2640'; ctx.fillRect(W * .7, 24, W * .27, 118); ctx.strokeRect(W * .7, 24, W * .27, 118);
    labelText(ctx, 'Measured in this toy', W * .835, 42, '#a78bfa');
    [['single-view cosine', meanSingle.toFixed(2), '#38bdf8'], ['pooled cosine', pooledScore.toFixed(2), '#a78bfa'], ['improvement', (pooledScore - meanSingle).toFixed(2), pooledScore >= meanSingle ? '#34d399' : '#fbbf24']].forEach(([key, value, color], i) => {
      labelText(ctx, key, W * .76, 70 + i * 26, '#94a3b8'); labelText(ctx, value, W * .93, 70 + i * 26, color);
    });
    container.querySelector('#scReadout').textContent = 'This is computed from the displayed synthetic data. More clean views usually make the pooled estimate closer to the known latent direction; intruders can reverse that gain. It is a test bed, not evidence about language models.';
  }
  ['scViews', 'scNoise', 'scIntruders'].forEach(id => container.querySelector(`#${id}`).addEventListener('input', draw));
  container.querySelector('#scResample').addEventListener('click', () => { seed = Math.floor(Math.random() * 2 ** 32); draw(); });
  draw();
});

// ── 15. Eigenvector Stretch ───────────────────────────────────────────────────
register('eigen-stretch', (container) => {
  container.innerHTML = `
    <div class="demo-question">Eigenvectors only stretch (not rotate) under matrix multiplication.</div>
    <canvas id="eigenCanvas" style="width:100%;height:220px;display:block;background:#090c14;border-radius:8px"></canvas>
    <div class="demo-controls">
      <label>Matrix stretch λ: <input type="range" id="eigenLambda" min="0.5" max="3" step="0.1" value="2" style="width:100px"></label>
      <label>Non-eigenvector angle: <input type="range" id="eigenAngle" min="5" max="85" step="5" value="45" style="width:90px"></label>
      <div class="demo-stat">Eigenvector: <span id="eigenE" style="color:#34d399">Only stretched</span></div>
      <div class="demo-stat">Other vector: <span id="eigenO" style="color:#f43f5e">Stretched + rotated</span></div>
    </div>
  `;
  const canvas = container.querySelector('#eigenCanvas');
  const ctx = canvas.getContext('2d');

  function draw() {
    const lambda = parseFloat(container.querySelector('#eigenLambda').value);
    const angleDeg = parseInt(container.querySelector('#eigenAngle').value);
    const W = canvas.clientWidth, H = canvas.clientHeight;
    canvas.width = W * devicePixelRatio;
    canvas.height = H * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    ctx.clearRect(0, 0, W, H);

    const cx = W / 2, cy = H / 2, scale = Math.min(W, H) * 0.3;
    drawAxis(ctx, cx, cy, W * 0.85, H * 0.85);

    // Simple diagonal matrix: [[lambda, 0], [0, 1]]
    // Eigenvectors: [1, 0] (eigenvalue lambda) and [0, 1] (eigenvalue 1)
    const M = [[lambda, 0], [0, 1]];

    // Eigenvector (1, 0)
    const ev = [1, 0];
    const evMapped = [M[0][0] * ev[0] + M[0][1] * ev[1], M[1][0] * ev[0] + M[1][1] * ev[1]];

    // Non-eigenvector
    const a = angleDeg * Math.PI / 180;
    const nev = [Math.cos(a), Math.sin(a)];
    const nevMapped = [M[0][0] * nev[0] + M[0][1] * nev[1], M[1][0] * nev[0] + M[1][1] * nev[1]];

    // Draw original vectors
    ctx.strokeStyle = '#34d399'; ctx.lineWidth = 2; ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + ev[0] * scale, cy - ev[1] * scale); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx + ev[0] * scale, cy - ev[1] * scale, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#34d399'; ctx.fill();
    labelText(ctx, 'e₁', cx + ev[0] * scale + 10, cy - ev[1] * scale - 5, '#34d399');

    ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + nev[0] * scale, cy - nev[1] * scale); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx + nev[0] * scale, cy - nev[1] * scale, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#fbbf24'; ctx.fill();
    labelText(ctx, 'v', cx + nev[0] * scale + 10, cy - nev[1] * scale, '#fbbf24');

    // Draw mapped vectors
    ctx.strokeStyle = '#34d399'; ctx.lineWidth = 2; ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + evMapped[0] * scale, cy - evMapped[1] * scale); ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath(); ctx.arc(cx + evMapped[0] * scale, cy - evMapped[1] * scale, 7, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(52,211,153,0.4)'; ctx.fill();
    labelText(ctx, `Me₁ (λ=${lambda.toFixed(1)}×)`, cx + evMapped[0] * scale + 10, cy - evMapped[1] * scale - 10, '#34d399');

    ctx.strokeStyle = '#f43f5e'; ctx.lineWidth = 2; ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + nevMapped[0] * scale, cy - nevMapped[1] * scale); ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath(); ctx.arc(cx + nevMapped[0] * scale, cy - nevMapped[1] * scale, 7, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(244,63,94,0.4)'; ctx.fill();
    labelText(ctx, 'Mv (rotated!)', cx + nevMapped[0] * scale + 10, cy - nevMapped[1] * scale, '#f43f5e');
  }

  container.querySelector('#eigenLambda').addEventListener('input', draw);
  container.querySelector('#eigenAngle').addEventListener('input', draw);
  draw();
});

// ── 16. Vector Space ──────────────────────────────────────────────────────────
register('vector-space', (container) => {
  container.innerHTML = `
    <div class="demo-question">Click to place vectors. See them as both points and arrows from the origin.</div>
    <canvas id="vsCanvas" style="width:100%;height:220px;display:block;background:#090c14;border-radius:8px;cursor:crosshair"></canvas>
    <div class="demo-controls">
      <button class="btn-ghost" id="vsClear" style="padding:0.3rem 0.6rem; font-size:0.8rem">Clear</button>
      <div class="demo-stat">Vectors: <span id="vsCount">0</span></div>
      <div class="demo-stat">Sum vector: <span id="vsSum">—</span></div>
    </div>
  `;
  const canvas = container.querySelector('#vsCanvas');
  const ctx = canvas.getContext('2d');
  const vectors = [];
  const colors = ['#38bdf8', '#a78bfa', '#34d399', '#fbbf24', '#f43f5e'];

  function draw() {
    const W = canvas.clientWidth, H = canvas.clientHeight;
    canvas.width = W * devicePixelRatio;
    canvas.height = H * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    ctx.clearRect(0, 0, W, H);
    const cx = W / 2, cy = H / 2, scale = Math.min(W, H) / 4;
    drawAxis(ctx, cx, cy, W * 0.85, H * 0.85);

    vectors.forEach((v, i) => {
      const color = colors[i % colors.length];
      ctx.strokeStyle = color; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + v[0] * scale, cy - v[1] * scale); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx + v[0] * scale, cy - v[1] * scale, 6, 0, Math.PI * 2);
      ctx.fillStyle = color; ctx.fill();
      labelText(ctx, `v${i+1}(${v[0].toFixed(1)},${v[1].toFixed(1)})`, cx + v[0] * scale + 10, cy - v[1] * scale, color);
    });

    if (vectors.length > 1) {
      const sum = vectors.reduce(([ax, ay], [bx, by]) => [ax + bx, ay + by], [0, 0]);
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.setLineDash([5, 3]);
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + sum[0] * scale, cy - sum[1] * scale); ctx.stroke();
      ctx.setLineDash([]);
      document.getElementById('vsSum').textContent = `(${sum[0].toFixed(1)}, ${sum[1].toFixed(1)})`;
    } else {
      document.getElementById('vsSum').textContent = 'Add ≥2 vectors';
    }
    document.getElementById('vsCount').textContent = vectors.length;
  }

  canvas.addEventListener('click', (e) => {
    if (vectors.length >= 5) return;
    const rect = canvas.getBoundingClientRect();
    const W = canvas.clientWidth, H = canvas.clientHeight;
    const scale = Math.min(W, H) / 4;
    const x = (e.clientX - rect.left - W / 2) / scale;
    const y = -(e.clientY - rect.top - H / 2) / scale;
    vectors.push([x, y]);
    draw();
  });

  container.querySelector('#vsClear').addEventListener('click', () => { vectors.length = 0; draw(); });
  draw();
});

// ── Concept Map placeholder ───────────────────────────────────────────────────
register('concept-map', (container) => {
  // The concept map is rendered by the renderer onto the #conceptMapCanvas
  // This is a fallback if mounted as a demo
  container.innerHTML = `
    <div style="padding:1rem; color:var(--muted); text-align:center">
      Navigate to the <button onclick="app.navigate('/map')" class="btn-ghost" style="display:inline">🗺️ Concept Map</button> for the full interactive graph.
    </div>
  `;
});

// ── Export ────────────────────────────────────────────────────────────────────
export function createVisualisations() {
  return { mount };
}
