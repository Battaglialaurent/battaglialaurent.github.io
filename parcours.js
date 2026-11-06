/* parcours.js — Parcours interactif : filtres, barre « semaines de stage » liée à la frise, détails dépliables.
   À charger APRÈS le script principal : <script src="parcours.js"></script> */
(function(){
'use strict';
var tl=document.querySelector('.tl');if(!tl)return;
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,EO='cubic-bezier(0.23, 1, 0.32, 1)';
var items=[].slice.call(tl.querySelectorAll('.tli'));

/* Données issues du contenu du portfolio */
var D={
 'BTS ATI':{t:['Automatismes','Électrotechnique','Ingénierie système','Organisation industrielle'],n:'Stage de fin de BTS recherché du 10 mai au 2 juillet 2027.'},
 'Le Havre Seine Métropole':{w:5,s:'Métropole',t:['Topographie','SIG / GIS','Métrologie','Archivage'],n:'Numérisation, repérage et archivage de cartes topographiques.'},
 'SIE Electric':{w:8,s:'SIE',t:['Catia 3D','Animation','Vidéo technique','Montage'],n:'Animations cinématiques pour expliquer des équipements électriques à un client.'},
 'Safran Nacelles':{w:6,s:'Safran',t:['SolidWorks Expert','Assemblage contraint','Mises en plan ISO','Rendu 3D'],n:'Maquette pédagogique d’une nacelle de moteur d’avion.'}
};

/* ── Styles ── */
var css=''+
'.tli[hidden]{display:none!important}'+
'.pv{margin-bottom:clamp(34px,5vw,60px)}'+
'.pv-top{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:14px 24px}'+
'.pv-chips{display:flex;flex-wrap:wrap;gap:8px}'+
'.pv-chip{min-height:44px;padding:0 18px;border:1px solid var(--ink);border-radius:999px;font:500 12px var(--m);letter-spacing:.05em;text-transform:uppercase;transition:background-color .18s ease,color .18s ease,transform .16s ease-out}'+
'.pv-chip:active{transform:scale(.97)}'+
'.pv-chip[aria-pressed=true]{background:var(--ink);color:var(--bg)}'+
'.pv-count{color:var(--mut)}.pv-count b{font:600 clamp(30px,4vw,48px) var(--f);letter-spacing:-.04em;color:var(--ink);margin-right:.35em;font-variant-numeric:tabular-nums}'+
'.pv-bar{display:flex;gap:4px;margin-top:18px}'+
'.pv-seg{min-height:52px;padding:8px 12px;display:flex;flex-direction:column;justify-content:space-between;align-items:flex-start;text-align:left;background:#ff5a1f;color:#0b0c0e;font:500 12px var(--m);letter-spacing:.04em;text-transform:uppercase;overflow:hidden;white-space:nowrap;transition:background-color .18s ease,color .18s ease,transform .2s '+EO+'}'+
'.pv-seg:nth-child(2){background:#ff7a47}.pv-seg:nth-child(3){background:#ff9a73}'+
'.pv-seg b{font:600 20px var(--f);letter-spacing:-.03em}'+
'.pv-seg.on,.pv-seg:focus-visible{background:var(--ink);color:var(--bg)}'+
'.pv-hint{margin-top:10px;color:var(--mut)}'+
'.tli.pv-hl .tl-b h3{color:var(--at)}'+
'.pv-tg{display:inline-flex;align-items:center;gap:8px;min-height:44px;margin-top:6px;margin-right:18px;font:500 12px var(--m);letter-spacing:.05em;text-transform:uppercase;color:var(--ink)}'+
'.pv-tg i{font-style:normal;display:inline-block;transition:transform .2s '+EO+'}'+
'.pv-tg[aria-expanded=true] i{transform:rotate(45deg)}'+
'.pv-pn{display:grid;grid-template-rows:0fr;transition:grid-template-rows .25s '+EO+'}'+
'.pv-pn.open{grid-template-rows:1fr}'+
'.pv-pn>div{overflow:hidden;min-height:0}'+
'.tl-b .pv-pn p{margin-top:10px;color:var(--ink)}'+
'.pv-tags{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0 6px}'+
'.pv-tags span{font:400 12px var(--m);letter-spacing:.03em;border:1px solid var(--line);border-radius:999px;padding:5px 12px}'+
'@media(hover:hover) and (pointer:fine){.pv-chip:not([aria-pressed=true]):hover{background:var(--bg2)}.pv-seg:hover{background:var(--ink);color:var(--bg)}}'+
'@media(prefers-reduced-motion:reduce){.pv-pn,.pv-tg i,.pv-seg{transition-duration:.01ms!important}}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

/* ── Panneau de contrôle ── */
var kinds=[['all','Tout'],['k-f','Formation'],['k-s','Stages'],['k-d','Mobilité']];
var pv=document.createElement('div');pv.className='pv';
var weeks=0,segs=[],order=items.slice().reverse(); /* du plus ancien au plus récent */
order.forEach(function(li){var d=D[li.querySelector('h3').textContent];if(d&&d.w){weeks+=d.w;segs.push({li:li,d:d})}});
pv.innerHTML='<div class="pv-top"><div class="pv-chips" role="group" aria-label="Filtrer le parcours">'+
 kinds.map(function(k,i){return '<button type="button" class="pv-chip" data-k="'+k[0]+'" aria-pressed="'+(i===0)+'">'+k[1]+'</button>'}).join('')+
 '</div><p class="pv-count mono"><b id="pv-n" aria-label="'+weeks+' semaines">0</b>semaines de stage</p></div>'+
 '<div class="pv-bar" role="group" aria-label="Répartition des stages">'+
 segs.map(function(s,i){return '<button type="button" class="pv-seg" data-i="'+i+'" style="flex:'+s.d.w+' 1 0" aria-label="'+s.li.querySelector('h3').textContent+', '+s.d.w+' semaines"><span>'+s.d.s+'</span><b>'+s.d.w+' sem.</b></button>'}).join('')+
 '</div><p class="pv-hint mono">Survoler ou sélectionner un stage pour le retrouver dans la frise</p>';
tl.parentNode.insertBefore(pv,tl);

/* Compteur */
var num=document.getElementById('pv-n');
function count(){
  if(reduce){num.textContent=weeks;return}
  var t0=null;(function f(t){if(!t0)t0=t;var k=Math.min((t-t0)/900,1);num.textContent=Math.round(weeks*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(f)})(performance.now());
}
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(e){if(e[0].isIntersecting){count();io.disconnect()}},{threshold:.5});io.observe(pv)}else num.textContent=weeks;

/* ── Détails dépliables ── */
function toggle(li,open){
  var b=li.querySelector('.pv-tg'),p=li.querySelector('.pv-pn');if(!b)return;
  b.setAttribute('aria-expanded',open);p.classList.toggle('open',open);
}
items.forEach(function(li,i){
  var d=D[li.querySelector('h3').textContent];if(!d)return;
  var id='pv-pn-'+i,box=li.querySelector('.tl-b');
  var b=document.createElement('button');b.type='button';b.className='pv-tg';b.setAttribute('aria-expanded','false');b.setAttribute('aria-controls',id);
  b.innerHTML='Détails <i aria-hidden="true">+</i>';
  var p=document.createElement('div');p.className='pv-pn';p.id=id;
  p.innerHTML='<div><p>'+d.n+'</p>'+(d.w?'<p class="mono" style="color:var(--mut)">'+d.w+' semaines · 2024</p>':'')+'<div class="pv-tags">'+d.t.map(function(t){return '<span>'+t+'</span>'}).join('')+'</div></div>';
  var go=box.querySelector('.tl-go');
  if(go)box.insertBefore(b,go);else box.appendChild(b);
  box.appendChild(p);
  b.addEventListener('click',function(){toggle(li,b.getAttribute('aria-expanded')!=='true')});
});

/* ── Filtre ── */
pv.querySelector('.pv-chips').addEventListener('click',function(e){
  var c=e.target.closest('.pv-chip');if(!c)return;
  [].forEach.call(pv.querySelectorAll('.pv-chip'),function(x){x.setAttribute('aria-pressed',x===c)});
  var k=c.dataset.k,n=0;
  items.forEach(function(li){
    var show=k==='all'||li.classList.contains(k),was=li.hidden;
    li.hidden=!show;
    if(show){li.classList.add('in');
      if(was&&!reduce)li.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:220,delay:n*40,easing:EO,fill:'backwards'});
      n++}
  });
  dispatchEvent(new Event('resize')); /* recalcule la progression de la frise */
});

/* ── Barre ↔ frise ── */
var bar=[].slice.call(pv.querySelectorAll('.pv-seg'));
bar.forEach(function(sg,i){
  var li=segs[i].li;
  function on(){li.classList.add('pv-hl')}function off(){li.classList.remove('pv-hl')}
  sg.addEventListener('mouseenter',on);sg.addEventListener('mouseleave',off);sg.addEventListener('focus',on);sg.addEventListener('blur',off);
  li.addEventListener('mouseenter',function(){sg.classList.add('on')});li.addEventListener('mouseleave',function(){sg.classList.remove('on')});
  sg.addEventListener('click',function(){
    var all=pv.querySelector('[data-k="all"]');
    if(li.hidden)all.click();
    li.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'});
    toggle(li,true);
  });
});
})();
