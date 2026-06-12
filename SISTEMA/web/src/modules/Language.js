/* ═══════════════════════════════════════
   LANGUAGE TOGGLE — ES ↔ EN
   ─────────────────────────────────────
   • data-i18n="key"             → sets textContent
   • data-i18n-html="key"        → sets innerHTML  (for markup with em/strong/br)
   • data-i18n-placeholder="key" → sets placeholder attribute
   • data-i18n-aria="key"        → sets aria-label attribute
   Language persisted in localStorage.
═══════════════════════════════════════ */

const T = {
  es: {
    /* ── Navbar ── */
    'nav.about':     'Estudio',
    'nav.services':  'Servicios',
    'nav.portfolio': 'Nuestro trabajo',
    'nav.media':     'Media',
    'nav.contact':   'Contacto',
    'nav.aria':      'Lina Labs — inicio',

    /* ── Hero ── */
    'hero.tagline1': 'El brillo de una idea',
    'hero.tagline2': 'es la luz que proyecta',

    /* ── About ── */
    'about.label': 'Estudio',
    'about.text1': 'Lina Labs es un <em class="highlight-word aberr-text" data-text="laboratorio creativo">laboratorio creativo</em> multidisciplinario que fusiona diseño, narrativa y tecnología lumínica para <em class="highlight-word">dar vida</em> a proyectos memorables.',
    'about.text2': 'Especializados en diseño gráfico, producción audiovisual, desarrollo de juegos, diseño de indumentaria y experiencias inmersivas, transformamos ideas en realidades tangibles a través de un enfoque innovador centrado en <em class="highlight-word aberr-text" data-text="la luz">la luz</em> como elemento narrativo y estético.',

    /* ── Manifesto ── */
    'manifesto.headline': 'NO DEJES DE<br>COMUNICAR',
    'manifesto.sub':      'Ilumina a tus clientes con tu marca',
    'manifesto.body':     'Debatimos los proyectos, sumamos ideas, nos involucramos con la empresa y sus necesidades como socios estratégicos.',

    /* ── Services ── */
    'services.label':    'Servicios',
    'services.headline': 'Tercerizá tus necesidades de comunicación con un <strong class="aberr-text" data-text="Soporte Integral Mensual">Soporte Integral Mensual</strong> para Empresas',
    'services.c1.title': 'Agile Management',
    'services.c1.desc':  'Asumimos la dirección operativa de su comunicación. Prendemos a los creativos necesarios para llevar a cabo la cobertura de su empresa. Nos integramos externamente como su equipo experto para ejecutar roadmaps estratégicos y optimizar sus procesos, devolviéndole el foco a su gerencia.',
    'services.c2.title': 'Tangible Innovation',
    'services.c2.desc':  'Explotamos IA, impresión 3D, hacemos merchandising, brindamos coberturas de eventos, diseñamos stands para llevar ideas al mundo físico. Se comunica mejor con activos táctiles de calidad prémium que aseguran su presencia constante.',
    'services.c3.title': 'Brand Identity',
    'services.c3.desc':  'El branding es un activo financiero que le da robustez a su empresa. Construimos marcas sólidas, blindamos su reputación en el mercado y alineamos su comunicación corporativa externa con su cultura interna.',

    /* ── Portfolio ── */
    'portfolio.label':    'Nuestro trabajo',
    'portfolio.tab1':     'Portfolio',
    'portfolio.tab2':     'Propuesta',
    'portfolio.loading':  'Cargando portfolio…',
    'portfolio.prev':     'Página anterior',
    'portfolio.next':     'Página siguiente',

    /* ── Media ── */
    'media.label':        'Media',

    /* ── Capabilities ── */
    'capabilities.label': 'Capacidades',
    'capabilities.aria':  'Todo lo que podemos hacer para vos',
    'capabilities.dense': 'PIEZAS DIGITALES · PIEZAS IMPRESAS · MOTION GRAPHICS · PRESENTACIONES · BRANDBOOK · SISTEMA DE IDENTIDAD · CATÁLOGOS · LIBROS · INFOGRAFÍAS · ESQUEMAS Y DIBUJOS · BROCHURE · FOLLETOS · CORREOS · MARKETING · CARTELERÍA · INTERNA · LANZAMIENTOS · CAMPAÑAS · COMMUNITY MANAGER · PLANIFICACIÓN · HOJA DE RUTA · DISEÑO DE INDUMENTARIA · PINTURA · DISEÑO 3D Y RENDERS · ILUSTRACIONES · LIBROS INFANTILES · FOTOGRAFÍA Y VIDEO · ANÁLISIS DE COMPETENCIA VISUAL · CREATIVIDAD · MAILINGS PROMOCIONALES · REPORTES · REVISTAS · ANUARIOS · ETIQUETAS · MODELADOS DE PRODUCTOS · PROTOTIPOS VISUALES · 360° · MERCHANDISING EXCLUSIVO · ACCESORIOS PROMOCIONALES · ESTRATEGIA DE CONTENIDOS · KITS DE REDES SOCIALES · POSTS INFORMATIVOS · RETRATOS CORPORATIVOS · ILUSTRACIONES CONCEPTUALES · PERSONAJES EXCLUSIVOS · EXPLAINER VIDEOS · TUTORIALES ANIMADOS · TRANSICIONES PARA VIDEO · SLIDESHOWS DINÁMICOS · SELLOS CORPORATIVOS · INVITACIONES DIGITALES · CERTIFICADOS · DIPLOMAS',

    /* ── Contact ── */
    'contact.label':     'Contacto',
    'contact.headline':  'Trabajemos<br>juntos',
    'contact.email.ph':  'Tu email',
    'contact.subj.ph':   'Asunto',
    'contact.phone.ph':  'Teléfono',
    'contact.msg.ph':    'Tu mensaje',
    'contact.submit':    'Enviar mensaje',

    /* ── Footer ── */
    'footer.copy':    'COPYRIGHT © 2025 LINA LABS. TODOS LOS DERECHOS RESERVADOS.',
    'footer.tagline': 'Deseamos que encuentres un propósito y un camino.',
  },

  en: {
    /* ── Navbar ── */
    'nav.about':     'Studio',
    'nav.services':  'Services',
    'nav.portfolio': 'Our Work',
    'nav.media':     'Media',
    'nav.contact':   'Contact',
    'nav.aria':      'Lina Labs — home',

    /* ── Hero ── */
    'hero.tagline1': 'The brightness of an idea',
    'hero.tagline2': 'is the light it projects',

    /* ── About ── */
    'about.label': 'Studio',
    'about.text1': 'Lina Labs is a multidisciplinary <em class="highlight-word aberr-text" data-text="creative laboratory">creative laboratory</em> that fuses design, narrative and luminic technology to <em class="highlight-word">bring to life</em> memorable projects.',
    'about.text2': 'Specializing in graphic design, audiovisual production, game development, apparel design and immersive experiences, we transform ideas into tangible realities through an innovative approach centered on <em class="highlight-word aberr-text" data-text="light">light</em> as a narrative and aesthetic element.',

    /* ── Manifesto ── */
    'manifesto.headline': 'NEVER STOP<br>COMMUNICATING',
    'manifesto.sub':      'Illuminate your clients with your brand',
    'manifesto.body':     'We debate projects, contribute ideas, and involve ourselves with the company and its needs as strategic partners.',

    /* ── Services ── */
    'services.label':    'Services',
    'services.headline': 'Outsource your communication needs with a <strong class="aberr-text" data-text="Monthly Integral Support">Monthly Integral Support</strong> for Companies',
    'services.c1.title': 'Agile Management',
    'services.c1.desc':  'We assume the operative direction of your communications. We bring in the creatives needed to cover your company\'s needs. We integrate externally as your expert team to execute strategic roadmaps and optimize your processes, returning focus to your management.',
    'services.c2.title': 'Tangible Innovation',
    'services.c2.desc':  'We leverage AI, 3D printing, merchandising, event coverage, and stand design to bring ideas into the physical world. Premium-quality tactile assets communicate better and ensure your constant presence.',
    'services.c3.title': 'Brand Identity',
    'services.c3.desc':  'Branding is a financial asset that strengthens your company. We build solid brands, protect your market reputation, and align your external corporate communication with your internal culture.',

    /* ── Portfolio ── */
    'portfolio.label':   'Our Work',
    'portfolio.tab1':    'Portfolio',
    'portfolio.tab2':    'Proposal',
    'portfolio.loading': 'Loading portfolio…',
    'portfolio.prev':    'Previous page',
    'portfolio.next':    'Next page',

    /* ── Media ── */
    'media.label':        'Media',

    /* ── Capabilities ── */
    'capabilities.label': 'Capabilities',
    'capabilities.aria':  'Everything we can do for you',
    'capabilities.dense': 'DIGITAL PIECES · PRINT PIECES · MOTION GRAPHICS · PRESENTATIONS · BRANDBOOK · IDENTITY SYSTEM · CATALOGUES · BOOKS · INFOGRAPHICS · TECHNICAL DRAWINGS · BROCHURE · FLYERS · EMAIL MARKETING · MARKETING · SIGNAGE · INTERNAL COMMS · LAUNCHES · CAMPAIGNS · COMMUNITY MANAGER · PLANNING · ROADMAP · APPAREL DESIGN · PAINTING · 3D DESIGN & RENDERS · ILLUSTRATIONS · CHILDREN\'S BOOKS · PHOTOGRAPHY & VIDEO · VISUAL COMPETITION ANALYSIS · CREATIVITY · PROMOTIONAL MAILINGS · REPORTS · MAGAZINES · YEARBOOKS · LABELS · PRODUCT MODELLING · VISUAL PROTOTYPES · 360° · EXCLUSIVE MERCHANDISING · PROMOTIONAL ACCESSORIES · CONTENT STRATEGY · SOCIAL MEDIA KITS · INFORMATIONAL POSTS · CORPORATE PORTRAITS · CONCEPTUAL ILLUSTRATIONS · EXCLUSIVE CHARACTERS · EXPLAINER VIDEOS · ANIMATED TUTORIALS · VIDEO TRANSITIONS · DYNAMIC SLIDESHOWS · CORPORATE SEALS · DIGITAL INVITATIONS · CERTIFICATES · DIPLOMAS',

    /* ── Contact ── */
    'contact.label':     'Contact',
    'contact.headline':  'Let\'s work<br>together',
    'contact.email.ph':  'Your email',
    'contact.subj.ph':   'Subject',
    'contact.phone.ph':  'Phone',
    'contact.msg.ph':    'Your message',
    'contact.submit':    'Send message',

    /* ── Footer ── */
    'footer.copy':    'COPYRIGHT © 2025 LINA LABS. ALL RIGHTS RESERVED.',
    'footer.tagline': 'We hope you find a purpose and a path.',
  },
};

/* ── Pieces list translations (injected by Hero.js, updated by this module) ── */
const PIECES = {
  es: [
    'Diseño de Logo','Manual de Marca','Rediseño de Logo','Identidad Corporativa',
    'Naming','Slogan de marca','Concepto y moodboard','Sellos corporativos',
    'Folleto / Flyer','Catálogo / Revista','Diseño de Libro','Infografía',
    'Brochure','Menú restaurante','Portada CD / Spotify','Postal',
    'Libros infantiles','Anuarios escolares','Post para redes','Historias para redes',
    'Banner web / redes','Portada Facebook / LinkedIn','Gestión de comunidades',
    'Invitaciones digitales','Ilustración Digital','Ilustración 3D',
    'Personaje Ilustrado','Ilustración vectorial','Diseño UI / UX','Newsletter',
    'Banners animados','Presentación digital','Sitio WEB institucional','E-Commerce',
    'Mailing','Presentación PPT','Etiquetas de Producto','Packaging / Caja',
    'Diseño de envase','Afiche / Póster','Valla Publicitaria','Merchandising',
    'Tarjeta Personal','Diseño de Invitación','Calcos','Pin / Llavero / Lapicera',
    'Cartel de fachada','Diseño de Stand','Gigantografía','Ploteado vehicular',
    'Lanzamiento de productos','Logo 3D','Modelado 3D baja','Modelado 3D media',
    'Modelado 3D alta','Personaje 3D','Renderizado 3D','Animación 3D',
    'Prototipado 360°','Impresión 3D','Jornada de Filmación','Filmación con Drone',
    'Edición de Video','Spot publicitario','Videos 2D','Explainer Video',
    'Cobertura de eventos','Motion Graphics','Placa animada','Títulos para Video',
    'Pintura al Óleo','Animaciones Dibujadas','Mochilas personalizadas',
    'Indumentaria en cuero','Guardapolvos','Señalética','Carpeta institucional',
    'Hojas membretadas','Tarjetas','Certificados','Diplomas',
    'Foto de producto','Sesión fotográfica','Retoque Fotográfico',
    'Vectorización','Consultoría en Diseño','Hora de Diseño',
  ],
  en: [
    'Logo Design','Brand Manual','Logo Redesign','Corporate Identity',
    'Naming','Brand Slogan','Concept & Moodboard','Corporate Seals',
    'Brochure / Flyer','Catalogue / Magazine','Book Design','Infographic',
    'Brochure','Restaurant Menu','CD / Spotify Cover','Postcard',
    'Children\'s Books','School Yearbooks','Social Media Post','Social Media Stories',
    'Web / Social Banner','Facebook / LinkedIn Cover','Community Management',
    'Digital Invitations','Digital Illustration','3D Illustration',
    'Character Design','Vector Illustration','UI / UX Design','Newsletter',
    'Animated Banners','Digital Presentation','Institutional Website','E-Commerce',
    'Email Marketing','PPT Presentation','Product Labels','Packaging / Box',
    'Container Design','Poster / Billboard','Advertising Billboard','Merchandising',
    'Business Card','Invitation Design','Stickers / Decals','Pin / Keychain / Pen',
    'Facade Sign','Stand Design','Large Format Print','Vehicle Wrap',
    'Product Launch','3D Logo','3D Modeling (Low)','3D Modeling (Mid)',
    '3D Modeling (High)','3D Character','3D Rendering','3D Animation',
    '360° Prototyping','3D Printing','Filming Session','Drone Filming',
    'Video Editing','TV Spot','2D Videos','Explainer Video',
    'Event Coverage','Motion Graphics','Animated Frame','Video Titles',
    'Oil Painting','Drawn Animations','Custom Backpacks',
    'Leather Apparel','Lab Coats','Signage','Institutional Folder',
    'Letterheads','Cards','Certificates','Diplomas',
    'Product Photo','Photo Session','Photo Retouching',
    'Vectorization','Design Consulting','Design Hour',
  ],
};

/* Update all pieces list DOM items (desktop + mobile) */
function updatePiecesList(lang) {
  const list = PIECES[lang] || PIECES.es;
  ['pieces-inner-left', 'pieces-inner-right'].forEach(id => {
    const container = document.getElementById(id);
    if (!container) return;
    container.querySelectorAll('.piece-item').forEach((item, idx) => {
      if (list[idx] !== undefined) item.textContent = list[idx];
    });
  });
}

/* ── Current language — always starts in Spanish, no cross-session persistence ── */
let currentLang = 'es';

/* ── Apply all translations to the DOM ── */
function applyTranslations(lang) {
  const t = T[lang];
  if (!t) return;

  /* textContent swaps */
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) el.textContent = t[key];
  });

  /* innerHTML swaps (elements with markup inside) */
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.dataset.i18nHtml;
    if (t[key] !== undefined) el.innerHTML = t[key];
  });

  /* placeholder swaps */
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (t[key] !== undefined) el.placeholder = t[key];
  });

  /* aria-label swaps */
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.dataset.i18nAria;
    if (t[key] !== undefined) el.setAttribute('aria-label', t[key]);
  });

  /* ── Tagline: rebuild character spans ── */
  document.querySelectorAll('.tagline-line[data-i18n-tagline]').forEach(line => {
    const key     = line.dataset.i18nTagline;
    const newText = t[key];
    if (!newText) return;
    line.dataset.text = newText;
    /* Rebuild spans — use non-breaking space so inline-block renders gaps correctly */
    line.textContent = '';
    [...newText].forEach(ch => {
      const span = document.createElement('span');
      span.className = 'tc';
      span.textContent = ch === ' ' ? ' ' : ch;
      span.style.opacity = '1';
      line.appendChild(span);
    });
  });

  /* ── Pieces lists (Hero.js injected — no data-i18n attributes) ── */
  updatePiecesList(lang);

  /* ── Update html lang attribute ── */
  document.documentElement.lang = lang;

  /* ── Update lang toggle button label ── */
  const btn = document.getElementById('lang-toggle');
  if (btn) {
    const display = btn.querySelector('.lang-display');
    if (display) display.textContent = lang.toUpperCase();
  }
}

/* ── Toggle ── */
function toggleLanguage() {
  currentLang = currentLang === 'es' ? 'en' : 'es';
  applyTranslations(currentLang);
  document.dispatchEvent(new CustomEvent('lang:change', { detail: { lang: currentLang } }));
}

/* ── Export pieces for Hero.js ── */
export function getPiecesForLang(lang) {
  return PIECES[lang] || PIECES.es;
}

/* ── Init ── */
export function initLanguage() {
  const btn = document.getElementById('lang-toggle');
  if (btn) btn.addEventListener('click', toggleLanguage);

  /* Apply saved/default language on load */
  if (currentLang !== 'es') applyTranslations(currentLang);
}
