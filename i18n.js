/* Bouton FR / EN — traduit le site à la volée (texte statique + contenu généré par JS).
   À charger tout à la fin du body, après parcours.js. */
(function () {
  'use strict';
  var CV_EN = '';            /* ex : 'CV-Laurent-Battaglia-EN.pdf' — si renseigné, le bouton CV pointe dessus en anglais */
  var CV_FR = 'CV-Laurent-Battaglia.pdf';

  var RAW = {
    /* ouverture, nav, menu */
    'Ouverture du portfolio': 'Opening portfolio', 'Le Havre, Normandie': 'Le Havre, Normandy',
    'Travaux': 'Work', 'Projets choisis': 'Selected projects', 'Parcours': 'Background', 'Études & stages': 'Education & internships',
    'Compétences': 'Skills', 'Logiciels & habilitations': 'Software & certifications', 'Stage 2027': 'Internship 2027',
    'Fermer': 'Close', 'Aller au contenu': 'Skip to content', 'Navigation principale': 'Main navigation', 'Menu mobile': 'Mobile menu',
    'Navigation': 'Navigation', 'Étude de cas': 'Case study',
    /* hero */
    'Portfolio technique · BTS ATI': 'Technical portfolio · BTS ATI',
    'Dessiner ce qui sera fabriqué.': 'Draw what will be built.',
    'Étudiant en BTS Assistance Technique d’Ingénieur au Havre. Modélisation 3D, électrotechnique, automatismes et organisation industrielle.': 'BTS student in Engineering Technical Assistance (Assistance Technique d’Ingénieur) in Le Havre. 3D modelling, electrical engineering, automation and industrial organisation.',
    'Trois stages effectués : Safran Nacelles, SIE Electric, Le Havre Seine Métropole.': 'Three internships completed: Safran Nacelles, SIE Electric, Le Havre Seine Métropole.',
    'Voir les travaux': 'View work', 'Télécharger le CV': 'Download CV',
    'Disponible · stage ou alternance': 'Available · internship or work-study', '10 mai – 2 juillet 2027': '10 May – 2 July 2027', 'Dates adaptables si besoin': 'Flexible dates if needed',
    /* travaux */
    'Sélectionner un projet pour l’ouvrir': 'Select a project to open it', 'Glisser pour organiser · Sélectionner pour ouvrir': 'Drag to arrange · Select to open',
    'Réinitialiser la disposition': 'Reset layout',
    'Aéronautique': 'Aeronautics', 'Électrotechnique': 'Electrical engineering', 'Collectivité': 'Local authority', 'Projet final': 'Final project',
    'Maquette pédagogique de nacelle': 'Educational nacelle mock-up', 'Animation cinématique': 'Kinematic animation', 'Numérisation & archivage': 'Digitisation & archiving',
    'Projet U34': 'U34 project', 'Chef d’œuvre': 'Capstone project', 'Conception industrielle': 'Industrial design',
    /* étude de cas */
    '← Travaux': '← Work', 'Entreprise': 'Company', 'Logiciel': 'Software', 'Durée': 'Duration', 'Norme': 'Standard', 'Livrable': 'Deliverable', 'Livrables': 'Deliverables',
    'Appréciation': 'Rating', 'TB': 'Very good', 'Type': 'Type', 'Secteur': 'Sector', 'Domaine': 'Field', 'Données': 'Data', 'Usage': 'Use', 'Cadre': 'Context', 'Période': 'Period', 'Résultat': 'Result',
    'Maquette + mises en plan': 'Mock-up + technical drawings', 'Animation client livrée': 'Animation delivered to the client', 'Topographie & SIG': 'Surveying & GIS',
    'Géospatiales / GIS': 'Geospatial / GIS', 'Urbanisme & infrastructures': 'Urban planning & infrastructure', 'Mise en plan, analyse fonctionnelle': 'Technical drawing, functional analysis',
    'Mention Bien': 'Merit (Mention Bien)', 'CAO, dossier technique, présentation': 'CAD, technical file, presentation',
    'Assemblage contraint': 'Constrained assembly', 'Norme ISO': 'ISO standard', 'Rendu 3D': '3D rendering', 'Analyse fonctionnelle': 'Functional analysis',
    'Animation': 'Animation', 'Vidéo technique': 'Technical video', 'Montage': 'Video editing', 'Communication client': 'Client communication',
    'Topographie': 'Surveying', 'Métrologie': 'Metrology', 'Archivage': 'Archiving', 'Mise en plan': 'Technical drawing', 'CAO': 'CAD', 'Dossier technique': 'Technical file', 'Présentation': 'Presentation',
    'Conception et modélisation paramétrique d’une maquette représentant la structure interne d’une nacelle de moteur d’avion. Assemblages contraints, mises en plan normalisées ISO et rendu photoréaliste pour un support de formation.': 'Design and parametric modelling of a mock-up showing the internal structure of an aircraft engine nacelle. Constrained assemblies, ISO-standard technical drawings and photorealistic rendering for a training aid.',
    'Modélisation paramétrique, assemblages contraints, mises en plan ISO, rendu photoréaliste pour la formation interne.': 'Parametric modelling, constrained assemblies, ISO technical drawings, photorealistic rendering for internal training.',
    'Production d’animations cinématiques 3D et de vidéos techniques pour illustrer le fonctionnement d’équipements électriques industriels. Mécanismes articulés, montage vidéo pour le client.': 'Production of 3D kinematic animations and technical videos illustrating how industrial electrical equipment works. Articulated mechanisms, video editing for the client.',
    'Numérisation et archivage de précision pour la collectivité havraise : numérisation, repérage et archivage de cartes topographiques pour les services d’urbanisme et d’infrastructure.': 'Precision digitisation and archiving for the Le Havre local authority: digitising, locating and archiving topographic maps for the urban planning and infrastructure departments.',
    'Relevés topographiques, données géospatiales et livrables SIG.': 'Topographic surveys, geospatial data and GIS deliverables.',
    'Projet de conception industrielle réalisé dans le cadre du Bac Pro EDPI. Modélisation, mise en plan et analyse fonctionnelle d’un produit industriel.': 'Industrial design project carried out for the Bac Pro EDPI (vocational baccalaureate in industrial product design). Modelling, technical drawing and functional analysis of an industrial product.',
    'Projet de fin de Bac Pro EDPI : réalisation complète démontrant la maîtrise des compétences en conception et définition de produits industriels.': 'End-of-Bac Pro EDPI project: a complete build demonstrating skills in industrial product design and definition.',
    'Présentation Canva': 'Canva presentation', 'Ouvrir dans un nouvel onglet ↗': 'Open in a new tab ↗',
    'Animation cinématique SIE Electric': 'SIE Electric kinematic animation', 'Présentation du projet U34': 'U34 project presentation', 'Présentation du chef d’œuvre': 'Capstone project presentation',
    /* parcours */
    'Études, stages': 'Education, internships', 'Formation': 'Education', 'Stage': 'Internship', 'Mobilité': 'Mobility',
    'Automatismes & Ingénierie Industrielle · Lycée Jules Siegfried, Le Havre': 'Automation & Industrial Engineering · Lycée Jules Siegfried, Le Havre',
    'En cours · stage mai–juil. 2027': 'Ongoing · internship May–Jul. 2027',
    'Numérisation topographique, données géospatiales SIG': 'Topographic digitisation, GIS geospatial data',
    'Animation cinématique 3D, vidéo technique client · Catia 3D': '3D kinematic animation, technical client video · Catia 3D',
    'Modélisation 3D de la maquette pédagogique d’une nacelle · SolidWorks Expert': '3D modelling of an educational nacelle mock-up · SolidWorks Expert',
    'Étude et Définition de Produits Industriels · Lycée Jules Siegfried, Le Havre': 'Industrial Product Study & Definition · Lycée Jules Siegfried, Le Havre',
    'Voir le détail du diplôme': 'View diploma details',
    'Baccalauréat Professionnel Étude et Définition de Produits Industriels, obtenu en juin 2024 au Lycée Jules Siegfried, Le Havre. Dessin technique industriel, CAO SolidWorks, représentation normalisée ISO, analyse fonctionnelle et structurelle de produits industriels.': 'Vocational Baccalaureate in Industrial Product Study and Definition, obtained in June 2024 at Lycée Jules Siegfried, Le Havre. Industrial technical drawing, SolidWorks CAD, ISO-standard representation, functional and structural analysis of industrial products.',
    'Permis B': 'Driving licence (B)', 'Mobile sur la Normandie et l’axe Seine': 'Mobile across Normandy and the Seine corridor', 'Obtenu': 'Obtained',
    /* compétences */
    'Logiciels': 'Software', 'Habilitations · Profil': 'Authorisations · Profile', 'Habilitations & certifications': 'Authorisations & certifications', 'Profil personnel': 'Personal profile',
    'Confirmé': 'Proficient', 'Avancé': 'Advanced', 'Intermédiaire': 'Intermediate', 'Certifié': 'Certified', 'Suite Office': 'Office suite',
    'Habilitation électrique B0V / H0V': 'Electrical authorisation B0V / H0V', 'Valide': 'Valid', 'SST — Sauveteur Secouriste du Travail': 'SST — Workplace First Aider',
    'Mobilité Normandie · Permis B': 'Normandy mobility · Driving licence (B)', 'Certification PIX': 'PIX certification', 'Obtenue': 'Obtained',
    'Clarinette': 'Clarinet', 'Depuis 2015': 'Since 2015', 'Impression 3D': '3D printing', 'FDM · Prototypage': 'FDM · Prototyping',
    'Passion & veille': 'Passion & industry watch', 'Mécanique': 'Mechanics', 'DIY · Conception': 'DIY · Design',
    /* FAQ */
    'Recruteurs': 'Recruiters',
    'Pourquoi le BTS ATI après un Bac Pro EDPI ?': 'Why a BTS ATI after a Bac Pro EDPI?',
    'Le Bac Pro EDPI m’a donné une solide base en <b>dessin technique et CAO</b>. Le BTS ATI est la suite naturelle pour monter en compétences sur les <b>automatismes, l’ingénierie système</b> et la gestion de projets industriels complets.': 'The Bac Pro EDPI gave me a solid grounding in <b>technical drawing and CAD</b>. The BTS ATI is the natural next step to build skills in <b>automation, systems engineering</b> and complete industrial project management.',
    'Quelles sont les dates de stage ?': 'What are the internship dates?',
    'Le stage peut avoir lieu du <b>10 mai au 2 juillet</b>. Ces dates sont <b>adaptables</b> si besoin.': 'The internship can take place from <b>10 May to 2 July</b>. These dates are <b>flexible</b> if needed.',
    'Quelle est votre disponibilité et mobilité ?': 'What are your availability and mobility?',
    'Disponible pour un <b>stage de fin de BTS ATI de mai à juillet 2027</b>. Basé au Havre, mobile sur la Normandie et l’axe Seine. <b>Permis B obtenu</b>.': 'Available for an <b>end-of-BTS ATI internship from May to July 2027</b>. Based in Le Havre, mobile across Normandy and the Seine corridor. <b>Holds a category B driving licence</b>.',
    'Qu’avez-vous appris chez SIE Electric ?': 'What did you learn at SIE Electric?',
    'La <b>communication technique par le visuel</b> : transformer une pièce mécanique en animation compréhensible pour un client non technicien. Maîtriser à la fois <b>Catia 3D et la narration technique</b> est une compétence transversale rare.': '<b>Technical communication through visuals</b>: turning a mechanical part into an animation a non-technical client can understand. Mastering both <b>Catia 3D and technical storytelling</b> is a rare cross-disciplinary skill.',
    'Quelles sont vos habilitations ?': 'What are your certifications?',
    '<b>Habilitation électrique B0V/H0V</b>, <b>SST</b> (Sauveteur Secouriste du Travail), <b>certification PIX</b> (2024), SolidWorks niveau <b>Expert</b>. Mobile Normandie / axe Seine avec permis B.': '<b>Electrical authorisation B0V/H0V</b>, <b>SST</b> (Workplace First Aider), <b>PIX certification</b> (2024), SolidWorks level <b>Expert</b>. Mobile across Normandy / Seine corridor with a B licence.',
    /* contact */
    'Travaillons': 'Let’s work', 'ensemble': 'together',
    'Disponible pour un <b>stage de fin de BTS ATI (mai–juillet 2027)</b> ou une alternance. Je recherche un environnement technique exigeant : aéronautique, bureaux d’études, automatismes. Basé au Havre, en Normandie. <b>Réponse sous 24 h.</b>': 'Available for an <b>end-of-BTS ATI internship (May–July 2027)</b> or a work-study placement. I am looking for a demanding technical environment: aeronautics, design offices, automation. Based in Le Havre, Normandy. <b>Reply within 24 h.</b>',
    'Afficher l’email': 'Show email', 'Afficher le téléphone': 'Show phone', 'Téléphone': 'Phone',
    /* pied de page + cookies */
    'Mentions légales': 'Legal notice', 'Confidentialité': 'Privacy', 'CGU': 'Terms of use', 'Gérer les cookies': 'Manage cookies', 'Rejouer l’ouverture': 'Replay intro',
    'Ce site ne dépose que des données techniques locales (mémorisation de ce choix) et charge des polices Google Fonts, ce qui peut transmettre votre adresse IP à Google. Aucune donnée personnelle n’est collectée.': 'This site only stores local technical data (remembering this choice) and loads Google Fonts, which may send your IP address to Google. No personal data is collected.',
    'En savoir plus': 'Learn more', 'Refuser': 'Decline', 'Accepter': 'Accept',
    /* parcours.js */
    'Filtrer le parcours': 'Filter background', 'Tout': 'All', 'Stages': 'Internships', 'semaines de stage': 'weeks of internship',
    'Répartition des stages': 'Internship breakdown',
    'Survoler ou sélectionner un stage pour le retrouver dans la frise': 'Hover or select an internship to find it in the timeline',
    'Détails': 'Details',
    'Stage de fin de BTS recherché du 10 mai au 2 juillet 2027.': 'End-of-BTS internship sought from 10 May to 2 July 2027.',
    'Numérisation, repérage et archivage de cartes topographiques.': 'Digitising, locating and archiving topographic maps.',
    'Animations cinématiques pour expliquer des équipements électriques à un client.': 'Kinematic animations to explain electrical equipment to a client.',
    'Maquette pédagogique d’une nacelle de moteur d’avion.': 'Educational mock-up of an aircraft engine nacelle.',
    'Automatismes': 'Automation', 'Ingénierie système': 'Systems engineering', 'Organisation industrielle': 'Industrial organisation',
    'Mises en plan ISO': 'ISO technical drawings'
  };
  var DESC_EN = 'Portfolio of Laurent Battaglia, BTS Engineering Technical Assistance student in Le Havre. CAD, SolidWorks, CATIA 3D, automation and industrial design. Looking for an end-of-BTS internship in 2027.';

  function norm(s) { return String(s).replace(/[’']/g, "'").replace(/\s+/g, ' ').trim(); }
  var M = {}; Object.keys(RAW).forEach(function (k) { M[norm(k)] = RAW[k]; });
  var OV = { fr: {}, en: {} };     /* surcharges publiées via content.json (clé = texte français d'origine) */
  function hasFR() { return Object.keys(OV.fr).length > 0; }
  var RX = [
    [/^Ouvrir le projet (\d+) : (.+)$/, function (m, a, b) { return 'Open project ' + a + ': ' + (tx(b) || b); }],
    [/^Suivant (\d+)$/, 'Next $1'], [/^Précédent (\d+)$/, 'Previous $1'], [/^Voir le projet (\d+) →$/, 'View project $1 →'],
    [/^(.+), (\d+) semaines$/, '$1, $2 weeks'], [/^(\d+) sem\.$/, '$1 wks'],
    [/^(\d+) semaines?$/, '$1 weeks'], [/^(\d+) projets?$/, '$1 projects']
  ];
  function tx(s) {
    var k = norm(s); if (!k) return null;
    if (OV[lang].hasOwnProperty(k)) return OV[lang][k];
    if (lang !== 'en') return null;
    if (M.hasOwnProperty(k)) return M[k];
    var i, m;
    for (i = 0; i < RX.length; i++) { m = k.match(RX[i][0]); if (m) return typeof RX[i][1] === 'function' ? RX[i][1].apply(null, m) : k.replace(RX[i][0], RX[i][1]); }
    if (k.indexOf(' · ') > -1) {
      var ch = false, parts = k.split(' · ').map(function (p) { var t = tx(p); if (t && t !== p) { ch = true; return t; } return p; });
      if (ch) return parts.join(' · ');
    }
    return null;
  }

  var lang = 'fr', texts = new Map(), htmls = new Map(), attrs = [];
  var SKIP = { SCRIPT: 1, STYLE: 1, CANVAS: 1, NOSCRIPT: 1 };
  function skipEl(el) { return !el || SKIP[el.tagName] || (el.closest && el.closest('[data-noi18n],[contenteditable="true"]')); }

  function tText(n) {
    if (skipEl(n.parentElement)) return;
    var v = n.nodeValue, t = tx(v); if (!t) return;
    var lead = v.match(/^\s*/)[0], trail = v.match(/\s*$/)[0], out = lead + t + trail;
    if (out === v) return;
    texts.set(n, v); n.nodeValue = out;
  }
  function tAttrs(el) {
    ['aria-label', 'title', 'alt', 'placeholder'].forEach(function (a) {
      if (!el.hasAttribute(a)) return;
      var v = el.getAttribute(a), t = tx(v); if (t && t !== v) { attrs.push([el, a, v]); el.setAttribute(a, t); }
    });
  }
  function walk(n) {
    if (n.nodeType === 3) { tText(n); return; }
    if (n.nodeType !== 1 || skipEl(n)) return;
    tAttrs(n);
    if (n.firstElementChild && n.querySelector('b') && n.textContent.length < 800) {
      var key = norm(n.innerHTML.replace(/&amp;/g, '&'));
      var hv = OV[lang].hasOwnProperty(key) ? OV[lang][key] : (lang === 'en' && M.hasOwnProperty(key) ? M[key] : null);
      if (hv !== null) { htmls.set(n, n.innerHTML); n.innerHTML = hv; return; }
    }
    var c = n.firstChild; while (c) { var nx = c.nextSibling; walk(c); c = nx; }
  }
  function restore() {
    texts.forEach(function (v, n) { n.nodeValue = v; }); texts.clear();
    htmls.forEach(function (v, el) { el.innerHTML = v; }); htmls.clear();
    attrs.forEach(function (a) { a[0].setAttribute(a[1], a[2]); }); attrs = [];
  }

  var metaDesc = document.querySelector('meta[name="description"]'), descFR = metaDesc ? metaDesc.getAttribute('content') : '';
  var cvLinks = [].slice.call(document.querySelectorAll('a[href="' + CV_FR + '"]'));

  var mo = new MutationObserver(function (recs) {
    if (lang !== 'en' && !hasFR()) { mo.takeRecords(); return; }
    recs.forEach(function (r) {
      if (r.type === 'childList') r.addedNodes.forEach(walk);
      else if (r.type === 'characterData') tText(r.target);
      else if (r.type === 'attributes') tAttrs(r.target);
    });
    mo.takeRecords();
  });

  /* bouton */
  var btn = document.createElement('button');
  btn.id = 'lang'; btn.type = 'button'; btn.setAttribute('data-noi18n', '');
  btn.innerHTML = '<span>FR</span><span>/</span><span>EN</span>';
  var st = document.createElement('style');
  st.textContent = '#lang{font:500 13px var(--m,"Geist Mono",monospace);letter-spacing:.06em;text-transform:uppercase;min-height:44px;min-width:44px;padding:0 8px;display:inline-flex;align-items:center;gap:6px;color:#fff}' +
    '#lang span{opacity:.45;transition:opacity .25s}#lang span.on{opacity:1}#lang:focus-visible{outline:2px solid #fff}' +
    '@media(max-width:899px){#lang{margin-left:auto;margin-right:4px}}';
  document.head.appendChild(st);
  var bar = document.getElementById('bar'), mb = document.getElementById('mbtn');
  if (bar) bar.insertBefore(btn, mb || null); else document.body.appendChild(btn);

  function setLang(l, save) {
    if (l === lang && save !== 'init') return;
    lang = l;
    restore(); if (l === 'en' || hasFR()) walk(document.body);
    mo.takeRecords();
    document.documentElement.lang = l;
    if (metaDesc) metaDesc.setAttribute('content', l === 'en' ? DESC_EN : descFR);
    if (CV_EN) cvLinks.forEach(function (a) { a.setAttribute('href', l === 'en' ? CV_EN : CV_FR); });
    var sp = btn.querySelectorAll('span'); sp[0].className = l === 'fr' ? 'on' : ''; sp[2].className = l === 'en' ? 'on' : '';
    btn.setAttribute('aria-label', l === 'en' ? 'Passer le site en français' : 'Switch the site to English');
    btn.setAttribute('lang', l === 'en' ? 'fr' : 'en');
    if (save) { try { sessionStorage.setItem('lb-lang', l); } catch (e) {} }
    document.dispatchEvent(new CustomEvent('i18n:lang', { detail: l }));
  }
  btn.addEventListener('click', function () { setLang(lang === 'fr' ? 'en' : 'fr', true); });
  mo.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['aria-label', 'title'] });

  var start = null;
  try { start = sessionStorage.getItem('lb-lang'); } catch (e) {}
  if (!start) start = /^fr/i.test(navigator.language || 'fr') ? 'fr' : 'en';   /* navigateur non français → anglais d'office */
  lang = 'fr'; setLang(start, 'init');

  /* API pour l'éditeur (cms.js) */
  window.I18N = {
    norm: norm,
    lang: function () { return lang; },
    set: function (o) { OV = { fr: o.fr || {}, en: o.en || {} }; },
    refresh: function () { restore(); if (lang === 'en' || hasFR()) walk(document.body); mo.takeRecords(); },
    origText: function (n) { return texts.has(n) ? texts.get(n) : n.nodeValue; },
    origHtml: function (el) { return htmls.has(el) ? htmls.get(el) : el.innerHTML; },
    enKnown: function (k) { return OV.en.hasOwnProperty(k) || M.hasOwnProperty(k); }
  };

  /* Textes modifiés depuis l'éditeur : content.json (publié à la racine du dépôt) */
  try {
    fetch('content.json', { cache: 'no-cache' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
      if (!j || (!j.fr && !j.en)) return;
      OV = { fr: j.fr || {}, en: j.en || {} };
      restore(); if (lang === 'en' || hasFR()) walk(document.body); mo.takeRecords();
    }).catch(function () {});
  } catch (e) {}
})();
