/* Hero : le dessin isométrique (cubes) est remplacé par le nombre d'or animé.
   Rectangle d'or → carrés emboîtés → spirale, puis un point glisse en boucle sur la spirale.
   À charger APRÈS le script principal, avant parcours.js. Le lynx de l'ouverture n'est pas touché. */
(function () {
  'use strict';
  var old = document.getElementById('epure');
  if (!old || !old.getContext) return;
  var cv = old.cloneNode(false);               /* neutralise l'ancien dessin (il écrit dans l'ancien canvas) */
  old.parentNode.replaceChild(cv, old);
  var ctx = cv.getContext('2d'); if (!ctx) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var PHI = (1 + Math.sqrt(5)) / 2, N = 10;
  var W = 0, H = 0, R = null, items = [], pts = [], cum = [], total = 0;
  var raf = 0, t0 = 0, running = false;
  var INK = 'rgba(11,12,14,', BLUE = 'rgba(36,56,255,';

  function cl(v) { return Math.max(0, Math.min(1, v)); }

  function setup() {
    var r = cv.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.lineJoin = 'round';
    var small = W < 700, pad = W * (small ? .06 : .045);
    var w = Math.min(W * (small ? .88 : .44), H * .5 * PHI), h = w / PHI;
    var x0 = W - w - pad, y0 = Math.max(small ? 84 : 74, H * (small ? .17 : .36) - h / 2);
    R = { x: x0, y: y0, w: w, h: h };
    build();
  }

  function build() {
    var r = { x: R.x, y: R.y, w: R.w, h: R.h }, i, s, sq, cx, cy, a0, a1;
    items = []; pts = []; cum = []; total = 0;
    for (i = 0; i < N; i++) {
      var d = i % 4;
      if (d === 0) { s = r.h; sq = [r.x, r.y, s]; cx = r.x + s; cy = r.y + s; a0 = Math.PI; a1 = 1.5 * Math.PI; r = { x: r.x + s, y: r.y, w: r.w - s, h: r.h }; }
      else if (d === 1) { s = r.w; sq = [r.x, r.y, s]; cx = r.x; cy = r.y + s; a0 = 1.5 * Math.PI; a1 = 2 * Math.PI; r = { x: r.x, y: r.y + s, w: r.w, h: r.h - s }; }
      else if (d === 2) { s = r.h; sq = [r.x + r.w - s, r.y, s]; cx = r.x + r.w - s; cy = r.y; a0 = 0; a1 = .5 * Math.PI; r = { x: r.x, y: r.y, w: r.w - s, h: r.h }; }
      else { s = r.w; sq = [r.x, r.y + r.h - s, s]; cx = r.x + s; cy = r.y + r.h - s; a0 = .5 * Math.PI; a1 = Math.PI; r = { x: r.x, y: r.y, w: r.w, h: r.h - s }; }
      items.push({ sq: sq, cx: cx, cy: cy, s: s, a0: a0, a1: a1 });
      for (var m = 0; m < 48; m++) {                      /* spirale échantillonnée pour le point mobile */
        var a = a0 + (a1 - a0) * m / 48, p = [cx + s * Math.cos(a), cy + s * Math.sin(a)];
        if (pts.length) total += Math.hypot(p[0] - pts[pts.length - 1][0], p[1] - pts[pts.length - 1][1]);
        pts.push(p); cum.push(total);
      }
    }
  }

  function dashRect(x, y, w, h, k) {                      /* rectangle tracé progressivement */
    var per = 2 * (w + h);
    ctx.setLineDash([per, per]); ctx.lineDashOffset = per * (1 - k);
    ctx.strokeRect(x, y, w, h); ctx.setLineDash([]);
  }

  function frame(ts, still) {
    if (!t0) t0 = ts;
    var el = ts - t0, p = still ? 1 : cl((el - 400) / 6800), i;
    ctx.clearRect(0, 0, W, H);

    /* cadre */
    ctx.lineWidth = 1; ctx.strokeStyle = INK + '.3)';
    dashRect(R.x, R.y, R.w, R.h, cl(p / .1));

    /* carrés puis arcs */
    var t = cl((p - .08) / .9) * (N + .4);
    for (i = 0; i < N; i++) {
      var k = cl(t - i); if (k <= 0) continue;
      var it = items[i], q = it.sq;
      ctx.strokeStyle = INK + (.1 + .12 * k) + ')'; ctx.lineWidth = 1;
      dashRect(q[0], q[1], q[2], q[2], k);
      ctx.strokeStyle = BLUE + '.7)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(it.cx, it.cy, it.s, it.a0, it.a0 + (it.a1 - it.a0) * k); ctx.stroke();
    }

    /* cote φ */
    var la = cl((p - .82) / .18);
    if (la > 0) {
      var y = R.y - 14, x1 = R.x, x2 = R.x + R.w;
      ctx.globalAlpha = la; ctx.strokeStyle = BLUE + '.6)'; ctx.fillStyle = BLUE + '.85)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.moveTo(x1, y - 5); ctx.lineTo(x1, y + 5); ctx.moveTo(x2, y - 5); ctx.lineTo(x2, y + 5); ctx.stroke();
      ctx.font = '500 12px "Geist Mono",ui-monospace,monospace'; ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(247,247,245,1)'; ctx.fillRect((x1 + x2) / 2 - 44, y - 9, 88, 18);
      ctx.fillStyle = BLUE + '.9)'; ctx.fillText('φ = 1,618', (x1 + x2) / 2, y + 4);
      ctx.globalAlpha = 1;
    }

    /* point qui glisse sur la spirale, en boucle */
    if (!still && p >= 1) {
      var loop = 7000, s = ((el - 7200) % loop + loop) % loop / loop * total, tr = total * .16, j, first = true;
      var fade = cl((el - 7200) / 800);
      if (el > 7200 - 1) {
        ctx.globalAlpha = fade; ctx.strokeStyle = BLUE + '.9)'; ctx.lineWidth = 2.4; ctx.beginPath();
        for (j = 0; j < pts.length; j++) if (cum[j] >= s - tr && cum[j] <= s) { if (first) { ctx.moveTo(pts[j][0], pts[j][1]); first = false; } else ctx.lineTo(pts[j][0], pts[j][1]); }
        ctx.stroke();
        for (j = 0; j < pts.length - 1 && cum[j + 1] < s; j++);
        ctx.fillStyle = '#2438ff'; ctx.beginPath(); ctx.arc(pts[j][0], pts[j][1], 4, 0, 7); ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
  }

  function loop(ts) { if (!running) return; frame(ts); raf = requestAnimationFrame(loop); }
  function start() { if (running) return; running = true; raf = requestAnimationFrame(loop); }
  function stop() { running = false; cancelAnimationFrame(raf); }

  setup();
  if (reduce) { frame(0, true); }
  else {
    setTimeout(start, 300);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { es[0].isIntersecting ? start() : stop(); }, { threshold: 0 }).observe(cv);
  }
  var lw = W;
  window.addEventListener('resize', function () { if (Math.abs(cv.getBoundingClientRect().width - lw) > 40) { lw = cv.getBoundingClientRect().width; setup(); if (reduce) frame(0, true); else t0 = 0; } });
})();
