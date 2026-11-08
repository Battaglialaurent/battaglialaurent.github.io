/* cms.js — mode édition directement sur le site (textes FR et EN), publication sur GitHub.
   Activation : ouvrir le site avec  #edit  à la fin de l'adresse  (ex : https://battaglialaurent.github.io/#edit)
   À charger APRÈS i18n.js. Sans #edit, ce fichier ne fait rien. */
(function () {
  'use strict';
  var DEFAULT_REPO = 'battaglialaurent/battaglialaurent.github.io', DEFAULT_BRANCH = 'main', FILE = 'content.json', KEY = 'lb-cms';
  var on = false, cfg = null, published = { fr: {}, en: {} }, draft = { fr: {}, en: {} }, auto = {}, ed = null, bar, toastEl;

  function wanted() { return /(^|[#&])edit$/.test(location.hash) || /[?&]edit(&|$)/.test(location.search); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ── jeton / dépôt ── */
  function getCfg() { try { return JSON.parse(localStorage.getItem(KEY) || sessionStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }
  function saveCfg(c, remember) { try { (remember ? localStorage : sessionStorage).setItem(KEY, JSON.stringify(c)); (remember ? sessionStorage : localStorage).removeItem(KEY); } catch (e) {} }
  function clearCfg() { try { localStorage.removeItem(KEY); sessionStorage.removeItem(KEY); } catch (e) {} }

  /* ── GitHub ── */
  function gh(path, body, method) {
    var h = { 'Accept': 'application/vnd.github+json', 'Authorization': 'Bearer ' + cfg.token, 'X-GitHub-Api-Version': '2022-11-28' };
    if (body) h['Content-Type'] = 'application/json';
    return fetch('https://api.github.com' + path, { method: method || (body ? 'PUT' : 'GET'), headers: h, body: body ? JSON.stringify(body) : undefined });
  }
  function b64e(s) { return btoa(unescape(encodeURIComponent(s))); }
  function b64d(s) { return decodeURIComponent(escape(atob(s.replace(/\n/g, '')))); }
  function fileUrl() { return '/repos/' + cfg.repo + '/contents/' + FILE + '?ref=' + encodeURIComponent(cfg.branch); }
  function httpErr(r) {
    var e = new Error(r.status === 401 ? 'Jeton refusé (401). Vérifie-le.' : r.status === 403 ? 'Accès refusé (403) : le jeton n’a pas le droit « Contents : Read and write ».' : r.status === 404 ? 'Dépôt ou branche introuvable (404). Vérifie le nom du dépôt.' : 'Erreur GitHub ' + r.status);
    e.status = r.status; return e;
  }
  function loadRemote() {
    return gh(fileUrl()).then(function (r) {
      if (r.status === 404) {
        return gh('/repos/' + cfg.repo).then(function (rr) { if (!rr.ok) throw httpErr(rr); return { fr: {}, en: {} }; });   /* dépôt ok, pas encore de content.json */
      }
      if (!r.ok) throw httpErr(r);
      return r.json().then(function (j) { var c = JSON.parse(b64d(j.content)); return { fr: c.fr || {}, en: c.en || {} }; });
    });
  }
  function publish() {
    return gh(fileUrl()).then(function (r) {
      if (r.status === 404) return null; if (!r.ok) throw httpErr(r); return r.json().then(function (j) { return j.sha; });
    }).then(function (sha) {
      var body = { message: 'Mise à jour des textes (éditeur du site)', content: b64e(JSON.stringify({ fr: draft.fr, en: draft.en }, null, 2) + '\n'), branch: cfg.branch };
      if (sha) body.sha = sha;
      return gh('/repos/' + cfg.repo + '/contents/' + FILE, body).then(function (r) { if (!r.ok) throw httpErr(r); });
    });
  }

  /* ── interface ── */
  var css = '' +
    '#cms-bar{position:fixed;left:12px;bottom:12px;z-index:9999;max-width:calc(100vw - 24px);background:#0a0b0d;color:#eceded;border:1px solid rgba(236,237,237,.3);padding:10px 12px;font:400 12px/1.4 "Geist Mono",ui-monospace,monospace;display:flex;flex-wrap:wrap;gap:8px 12px;align-items:center}' +
    '#cms-bar b{font-weight:500;letter-spacing:.05em;text-transform:uppercase}' +
    '#cms-bar .m{color:#9a9ea5}' +
    '#cms-bar button,#cms-dlg button{min-height:40px;padding:0 14px;border:1px solid #eceded;border-radius:999px;background:none;color:inherit;font:500 12px "Geist Mono",ui-monospace,monospace;letter-spacing:.05em;text-transform:uppercase;cursor:pointer}' +
    '#cms-bar button.p,#cms-dlg button.p{background:#eceded;color:#0a0b0d}#cms-bar button:disabled{opacity:.5}' +
    '#cms-hint{flex-basis:100%;color:#9a9ea5}' +
    '#cms-toast{position:fixed;left:50%;top:16px;transform:translateX(-50%);z-index:10000;background:#2438ff;color:#fff;padding:10px 16px;font:500 13px "Geist Mono",ui-monospace,monospace;max-width:calc(100vw - 24px);display:none}' +
    '#cms-dlg{position:fixed;inset:0;z-index:10001;background:rgba(10,11,13,.7);display:flex;align-items:center;justify-content:center;padding:16px}' +
    '#cms-dlg form{background:#f7f7f5;color:#0b0c0e;width:min(440px,100%);padding:22px;font:400 14px/1.5 "Geist",system-ui,sans-serif;display:flex;flex-direction:column;gap:12px}' +
    '#cms-dlg h2{font-size:22px;letter-spacing:-.03em}#cms-dlg label{display:flex;flex-direction:column;gap:4px;font:500 12px "Geist Mono",monospace;text-transform:uppercase;letter-spacing:.04em}' +
    '#cms-dlg input[type=text],#cms-dlg input[type=password]{font:400 15px "Geist Mono",monospace;padding:10px;border:1px solid #0b0c0e;background:#fff;text-transform:none}' +
    '#cms-dlg .r{flex-direction:row;align-items:center;gap:8px;text-transform:none;font-weight:400}#cms-dlg .row{display:flex;gap:8px}' +
    '#cms-dlg .e{color:#c2410c;font-size:13px}#cms-dlg small{color:#63676e}#cms-dlg button{border-color:#0b0c0e}#cms-dlg button.p{background:#0b0c0e;color:#fff}' +
    'body.cms-on #ck{display:none!important}' +
    'body.cms-on :is(h1,h2,h3,p,span,b,a,button,summary,li,small,em,dt,dd,div):not(:has(*)):hover,body.cms-on :is(p,summary):hover{outline:1px dashed #2438ff;outline-offset:2px;cursor:text}' +
    '.cms-edit{outline:2px solid #2438ff!important;outline-offset:3px;background:rgba(36,56,255,.08);color:#0b0c0e!important;-webkit-text-fill-color:currentColor!important;-webkit-text-stroke:0!important;user-select:text!important;-webkit-user-select:text!important;cursor:text}';

  function toast(msg, ms) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.id = 'cms-toast'; toastEl.setAttribute('data-noi18n', ''); toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.style.display = 'block'; clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.style.display = 'none'; }, ms || 3500);
  }

  function dialog(err, cb) {
    var d = document.createElement('div'); d.id = 'cms-dlg'; d.setAttribute('data-noi18n', '');
    var c = getCfg() || {};
    d.innerHTML = '<form><h2>Connexion à l’éditeur</h2>' +
      '<small>Le jeton reste dans ton navigateur : il n’est jamais dans le code du site. <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">Créer un jeton ↗</a> (dépôt unique · Contents : Read and write)</small>' +
      '<label>Dépôt<input type="text" name="repo" value="' + esc(c.repo || DEFAULT_REPO) + '" autocomplete="off" spellcheck="false"></label>' +
      '<label>Branche<input type="text" name="branch" value="' + esc(c.branch || DEFAULT_BRANCH) + '" autocomplete="off" spellcheck="false"></label>' +
      '<label>Jeton GitHub<input type="password" name="token" autocomplete="off" spellcheck="false"></label>' +
      '<label class="r"><input type="checkbox" name="rem"> Se souvenir sur cet appareil</label>' +
      (err ? '<p class="e">' + esc(err) + '</p>' : '') +
      '<div class="row"><button type="submit" class="p">Valider</button><button type="button" id="cms-dlg-x">Annuler</button></div></form>';
    document.body.appendChild(d);
    var f = d.querySelector('form'); f.token.focus();
    d.querySelector('#cms-dlg-x').onclick = function () { d.remove(); on = false; history.replaceState(null, '', location.pathname); };
    f.onsubmit = function (e) {
      e.preventDefault();
      var n = { repo: f.repo.value.trim(), branch: f.branch.value.trim() || 'main', token: f.token.value.trim() };
      if (!/^[\w.-]+\/[\w.-]+$/.test(n.repo) || !n.token) { d.remove(); dialog('Renseigne un dépôt (nom/dépôt) et un jeton.', cb); return; }
      cfg = n; saveCfg(n, f.rem.checked); d.remove(); cb();
    };
  }

  function count() {
    var n = 0;
    ['fr', 'en'].forEach(function (l) {
      var k, a = draft[l], b = published[l];
      for (k in a) if (a[k] !== b[k]) n++;
      for (k in b) if (!(k in a)) n++;
    });
    return n;
  }
  function updateCount() {
    var n = count(); bar.querySelector('#cms-n').textContent = n + ' modification' + (n > 1 ? 's' : '');
    bar.querySelector('#cms-pub').disabled = !n; bar.querySelector('#cms-undo').disabled = !n;
  }
  function setLangLabel() { var el = bar && bar.querySelector('#cms-l'); if (el) el.textContent = 'Langue éditée : ' + I18N.lang().toUpperCase(); }

  /* ── édition ── */
  function clean(html) {
    var t = document.createElement('div'); t.innerHTML = html;
    (function w(n) {
      [].slice.call(n.childNodes).forEach(function (c) {
        if (c.nodeType === 1) {
          w(c);
          if (c.tagName === 'B' || c.tagName === 'STRONG') { if (c.tagName === 'STRONG') { var b = document.createElement('b'); while (c.firstChild) b.appendChild(c.firstChild); n.replaceChild(b, c); } }
          else if (c.tagName === 'BR') n.replaceChild(document.createTextNode(' '), c);
          else { while (c.firstChild) n.insertBefore(c.firstChild, c); n.removeChild(c); }
        }
      });
    })(t);
    return t.innerHTML.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function caretAt(x, y) {
    var r = null;
    if (document.caretRangeFromPoint) r = document.caretRangeFromPoint(x, y);
    else if (document.caretPositionFromPoint) { var p = document.caretPositionFromPoint(x, y); if (p) { r = document.createRange(); r.setStart(p.offsetNode, p.offset); r.collapse(true); } }
    return r;
  }
  function pass(t, e) { return e.altKey || !t.closest || t.closest('#cms-bar,#cms-dlg,#cms-toast,#lang,#case-close,[data-go],.tl-go,#mbtn,#menu a'); }

  function startEdit(e) {
    var t = e.target; if (!t || t === document.body || t === document.documentElement || !t.closest) return;
    var r = caretAt(e.clientX, e.clientY), unit = null;
    var hasEl = [].some.call(t.children, function (c) { return c.tagName !== 'B'; });
    if (!hasEl) {
      if (!t.textContent.trim()) return;
      var mixed = !!t.querySelector('b');
      unit = mixed ? { el: t, kind: 'html', orig: I18N.origHtml(t), before: I18N.norm(t.innerHTML) }
        : { el: t, kind: 'text', orig: [].map.call(t.childNodes, function (n) { return I18N.origText(n); }).join(''), before: I18N.norm(t.textContent) };
    } else {
      var node = r && r.startContainer;
      if (!node || node.nodeType !== 3 || !node.nodeValue.trim() || !t.contains(node)) return;
      var orig = I18N.origText(node), off = r.startOffset, span = document.createElement('span');
      span.textContent = node.nodeValue; node.parentNode.replaceChild(span, node);
      unit = { el: span, kind: 'wrap', orig: orig, before: I18N.norm(span.textContent) };
      r = document.createRange(); r.setStart(span.firstChild, Math.min(off, span.firstChild.length)); r.collapse(true);
    }
    ed = unit; var el = unit.el;
    el.setAttribute('contenteditable', 'true'); el.classList.add('cms-edit'); el.focus();
    var sel = getSelection(), rg = document.createRange();
    if (r && el.contains(r.startContainer)) rg = r; else { rg.selectNodeContents(el); rg.collapse(false); }
    sel.removeAllRanges(); sel.addRange(rg);
    el.addEventListener('blur', function () { if (ed && ed.el === el) finish(true); }, { once: true });
    el.addEventListener('paste', function (ev) { ev.preventDefault(); var tx = (ev.clipboardData || window.clipboardData).getData('text'); document.execCommand('insertText', false, tx.replace(/\s+/g, ' ')); });
  }

  function record(u, val) {
    var key = u.kind === 'html' ? I18N.norm(u.orig.replace(/&amp;/g, '&')) : I18N.norm(u.orig), L = I18N.lang(), known = I18N.enKnown(key);
    draft[L][key] = val;
    if (L === 'fr') {
      if (!known || auto[key]) { draft.en[key] = val; auto[key] = true; }                   /* même texte dans les 2 langues */
      else toast('Pense à mettre à jour la version EN (bouton FR / EN en haut).', 5000);
    }
  }
  function finish(save) {
    if (!ed) return; var u = ed, el = u.el; ed = null;
    el.removeAttribute('contenteditable'); el.classList.remove('cms-edit');
    var val = u.kind === 'html' ? clean(el.innerHTML) : el.textContent.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
    if (u.kind === 'wrap') { if (el.parentNode) el.parentNode.replaceChild(document.createTextNode(u.orig), el); }
    else if (u.kind === 'html') el.innerHTML = u.orig; else el.textContent = u.orig;
    if (save && val && val !== u.before) record(u, val);
    I18N.set(draft); I18N.refresh(); updateCount();
  }

  /* ── garde-fous : en mode édition, les clics modifient au lieu d'agir ── */
  function onPointer(e) { if (!pass(e.target, e)) e.stopPropagation(); }
  function onClick(e) {
    if (pass(e.target, e)) return;
    e.preventDefault(); e.stopPropagation();
    if (ed && ed.el.contains(e.target)) return;
    finish(true);
    startEdit(e);
  }
  function onKey(e) {
    if (!ed || !ed.el.contains(e.target)) return;
    e.stopPropagation();
    if (e.type === 'keyup') { if (e.key === ' ') e.preventDefault(); return; }
    if (e.key === 'Enter') { e.preventDefault(); finish(true); }
    else if (e.key === 'Escape') { e.preventDefault(); finish(false); }
  }

  function buildUI() {
    var st = document.createElement('style'); st.id = 'cms-css'; st.textContent = css; document.head.appendChild(st);
    bar = document.createElement('div'); bar.id = 'cms-bar'; bar.setAttribute('data-noi18n', '');
    bar.innerHTML = '<b>Mode édition</b><span class="m" id="cms-l"></span><span id="cms-n">0 modification</span>' +
      '<button type="button" id="cms-undo">Annuler tout</button><button type="button" class="p" id="cms-pub">Publier</button><button type="button" id="cms-quit">Quitter</button>' +
      '<span id="cms-hint">Clique un texte pour le modifier · Entrée valide · Échap annule · Alt + clic = utiliser le site normalement · Pour l’anglais, bascule avec FR / EN</span>';
    document.body.appendChild(bar); document.body.classList.add('cms-on');
    [].forEach.call(document.querySelectorAll('details'), function (d) { d.open = true; });
    ['pointerdown', 'pointerup'].forEach(function (t) { document.addEventListener(t, onPointer, true); });
    document.addEventListener('click', onClick, true);
    document.addEventListener('keydown', onKey, true); document.addEventListener('keyup', onKey, true);
    document.addEventListener('i18n:lang', setLangLabel);
    setLangLabel(); updateCount();

    bar.querySelector('#cms-undo').onclick = function () {
      finish(false); if (!confirm('Annuler toutes les modifications non publiées ?')) return;
      draft = clone(published); auto = {}; I18N.set(draft); I18N.refresh(); updateCount();
    };
    bar.querySelector('#cms-pub').onclick = function () {
      finish(true); var b = this; if (!count()) return;
      b.disabled = true; b.textContent = 'Publication…';
      publish().then(function () { published = clone(draft); auto = {}; toast('Publié. Visible sur le site dans environ 1 minute.', 5000); })
        .catch(function (err) { toast(err.message || 'Échec de la publication', 6000); if (err.status === 401) clearCfg(); })
        .then(function () { b.textContent = 'Publier'; updateCount(); });
    };
    bar.querySelector('#cms-quit').onclick = function () {
      finish(true);
      if (count() && !confirm('Quitter ? Les modifications non publiées seront perdues.')) return;
      draft = clone(published); I18N.set(draft); I18N.refresh();
      ['pointerdown', 'pointerup'].forEach(function (t) { document.removeEventListener(t, onPointer, true); });
      document.removeEventListener('click', onClick, true); document.removeEventListener('keydown', onKey, true); document.removeEventListener('keyup', onKey, true);
      document.removeEventListener('i18n:lang', setLangLabel);
      bar.remove(); document.getElementById('cms-css').remove(); document.body.classList.remove('cms-on'); on = false;
      history.replaceState(null, '', location.pathname);
    };
  }

  function proceed() {
    loadRemote().then(function (c) {
      published = clone(c); draft = clone(c); I18N.set(draft); I18N.refresh(); buildUI();
    }).catch(function (err) {
      if (err.status === 401 || err.status === 403 || err.status === 404) { clearCfg(); dialog(err.message, proceed); }
      else { on = false; alert('Impossible de joindre GitHub : ' + (err.message || err)); }
    });
  }
  function enter() {
    if (on || !window.I18N) return; on = true; cfg = getCfg();
    if (cfg && cfg.token) proceed(); else dialog('', proceed);
  }
  if (wanted()) enter();
  window.addEventListener('hashchange', function () { if (wanted()) enter(); });
})();
