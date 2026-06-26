import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ArrowUpRight, ArrowDown, Globe, Mail, Linkedin,
  Play, Download, Phone, Award, X, ArrowRight,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

/* ════════════════════════════════════════════════════════════════
   DAVID MALDONADO — "EDITORIAL" · v3 (elevated)
   ----------------------------------------------------------------
   Same soul — bone paper, Fraunces serif, the yellow highlighter —
   but with the motion systems that separate awarded sites from
   flat ones:

   · INK PRELOADER: 0→100 counter + cycling Hola/Hello/您好,
     curtain wipes up with a curved trailing edge
   · KINETIC HEADLINE: hero title enters char-by-char with rotation
   · VELOCITY SKEW: outlined marquee strip tilts with scroll speed
   · STICKY STACKING CARDS: capabilities as full cards that pile
     on top of each other (card 02 inverts to ink)
   · INK SLAB: the statement floats as a dark rounded slab,
     words revealing in paper as you scroll
   · SPINNING BADGE: "Open to work · Disponible · 求職中" rotating
     over the hero photo
   · MAGNETIC CTAs, photo clip-path reveal, giant footer name
   · One rAF loop drives progress bar, parallax, skew and card
     scaling through refs (no per-frame React renders)

   MEDIA / ASSET SLOTS (fill the constants below):
   ════════════════════════════════════════════════════════════════ */

/* // HERO PHOTO — large portrait / 3-4 body shot. "" = placeholder */
const HERO_PHOTO_URL = "/david.jpg";
/* // VIDEO — David speaking to camera (mp4/webm URL). "" = placeholder */
const VIDEO_URL = "";
/* // optional poster frame for the video */
const VIDEO_POSTER_URL = "";
/* // SUBTITLES — WebVTT (.vtt) files per language. The player auto-selects
   // the track matching the site's active language. */
const SUBTITLE_URLS = { EN: "", ES: "", ZH: "" };
/* // GIF — David giving a talk (gif/mp4 URL works in <img> if gif). "" = placeholder */
const SPEAKING_GIF_URL = "/gif.JPG";
/* // CV — link to the hosted PDF */
const CV_URL = "/David_Maldonado_CV.pdf";

/* // JOURNEY ILLUSTRATIONS — one small image per chapter (in order, oldest→newest).
   // Put your art in /public and reference with a leading slash, e.g. "/journey-1.png".
   // Leave "" to show a numbered placeholder marker instead. */
const JOURNEY_ART = [
  "", // 01 — The first leap (Pizzería Porto)
  "", // 02 — Learning to ship (Consultancy)
  "", // 03 — Finding the craft (Mosan)
  "", // 04 — Leading the team (Crunch DNA)
  "", // 05 — The high-stakes test (Mosan)
  "", // 06 — Crossing the world (NYCU)
  "", // 07 — Bridging two worlds (DRISA)
];

const copy = {
  EN: {
    splashSub: "Choose your language · Elige tu idioma · 選擇語言",
    navContact: "Contact",
    formTitle: "Let's talk.",
    formSubtitle: "Tell me what you're building. I answer in three languages, usually within a day.",
    formName: "Your name",
    formEmail: "Your email",
    formMessage: "Your message",
    formSend: "Send message",
    formSending: "Sending...",
    formSuccess: "Thank you. I'll be in touch soon.",
    formError: "Something went wrong. You can also email me directly.",
    formClose: "Close",
    formRe: "Regarding:",
    formRePrefill: "Hi David, I'm reaching out about",
    availability: "Available, graduating June 2026",
    heroKicker: "GUATEMALA → TAIWAN → ANYWHERE",
    heroLine1: "Strategy and",
    heroHl1: "ventures,",
    heroLine2: "across",
    heroHl2: "two worlds.",
    heroLine3: "",
    heroHl3: "",
    heroSub: "A strategist bridging Latin America and Asia, helping turn distance, language and culture into deals, ventures and working AI.",
    heroCta: "How am I useful?",
    heroRoles: "Open to roles in Strategy · Business Development · AI",
    downloadCV: "Download CV",
    scroll: "Scroll",
    marqueeStrip: "Strategy ◇ AI Systems ◇ Markets ◇ Ventures ◇ ",
    manifestoLabel: "My story",
    manifesto: [
      { t: "I was " }, { t: "born in Guatemala", hl: 1 },
      { t: ", and now working " }, { t: "from Taiwan", hl: 2 },
      { t: ". In seven years I've done strategic analysis and implementations for " },
      { t: "50+ clients across 6 markets", hl: 3 },
      { t: "; leading teams, opening doors between Latin America and Asia, and lately " },
      { t: "implementing AI into real business decisions", hl: 4 },
      { t: "." },
    ],
    mediaLabel: "In person",
    mediaTitle: "A few words from David.",
    videoCaption: "DAVID, IN HIS OWN WORDS, 90 SEC",
    videoPlaceholder: "[ VIDEO, DAVID SPEAKING ]",
    gifCaption: "ON STAGE · BANGKOK BUSINESS CHALLENGE, 2025",
    gifPlaceholder: "[ GIVING A TALK ]",
    statementLabel: "How I operate",
    statement:
      "I've planned the strategy and run the execution for clients across different markets, languages and cultures. What I do, in the end, is be like a bridge between worlds.",
    trajLabel: "Trajectory",
    trajTitle: "The path so far.",
    trajIntro: "Every path has a shape. Mine runs from a kitchen in Guatemala to boardrooms across Asia, one chapter building on the last.",
    timeline: [
      {
        chapter: "The first leap", years: "2013–14", role: "Co-Founder", org: "Pizzería Porto",
        desc: "At nineteen, I built a restaurant from nothing; brand, market validation, launch, a team to hire and train. My first lesson that an idea is only worth what you can execute.",
      },
      {
        chapter: "Learning to ship", years: "2018–19", role: "Co-Founder & Project Manager", org: "Online Reputation Consultancy",
        desc: "My first real venture: taking clients from a handshake to a delivered result. SEO, content, a third-party team to coordinate. I learned to carry a project end to end.",
      },
      {
        chapter: "Finding the craft", years: "2019–21", role: "Lead Business Model Innovation", org: "Mosan",
        desc: "Here strategy became my craft. I led business-model innovation and built a dynamic pricing tool that shaped how new products came to life. The work got sharper, and so did I.",
      },
      {
        chapter: "Leading the team", years: "2021–23", role: "Lead Strategic Analyst", org: "Crunch DNA",
        desc: "The chapter that defined me. Leading the Strategic Development team across 50+ accounts, I lifted client retention 20% and doubled implementation targets month over month. I learned to move a team, not just a plan.",
      },
      {
        chapter: "The high-stakes test", years: "2023", role: "Project Manager & BM Innovation", org: "Mosan",
        desc: "Called back for a major strategic investment: end-to-end execution, forecasting models, reporting straight to investors. Real money, real decisions, no room to hide.",
      },
      {
        chapter: "Crossing the world", years: "2024–26", role: "Global MBA · Technology Management", org: "NYCU Taiwan",
        desc: "I crossed the Pacific to study where the future is being built. Now I teach what I once learned, mentoring student teams as a Teaching Assistant.",
      },
      {
        chapter: "Bridging two worlds", years: "2026–Now", role: "Procurement Research Intern", org: "DRISA · Remote, Taiwan / SEA",
        desc: "The threads come together. I run cross-regional sourcing across six countries, earning responses from top-tier manufacturers in Thailand, Vietnam and China, the kind of bridge between Latin America and Asia I was built to be.",
      },
    ],
    eduLabel: "Education",
    education: [
      { school: "National Yang Ming Chiao Tung University", degree: "Global MBA — Technology Management Specialization", year: "2024–26", note: "TA, Business Model & Value Proposition" },
      { school: "Inter-American Development Bank (IDB)", degree: "Master's in Professional Project Management", year: "2021", note: "Guatemala" },
      { school: "Universidad Francisco Marroquín", degree: "B.A. in Entrepreneurship", year: "2020", note: "Guatemala" },
    ],
    certsLabel: "Certifications",
    certifications: [
      "Coaching Skills for Managers — UC Davis / Coursera (2020)",
      "Sustainable Tourism & Social Innovation — ZHdK Strategic Design (2019)",
      "TOEFL iBT — C1 (100)",
    ],
    statsLabel: "In numbers",
    stats: [
      { value: 50, suffix: "+", label: "Clients served" },
      { value: 6, suffix: "", label: "Markets entered" },
      { value: 4, suffix: "", label: "Languages" },
      { value: 7, suffix: "+", label: "Years operating" },
    ],
    flagsNote: "🇺🇸 🇬🇹 🇲🇽 🇵🇪 🇨🇴 🇦🇷 → 🇹🇼",
    langsLabel: "Languages",
    languages: [
      { name: "Español", level: "Native", pct: 100 },
      { name: "English", level: "Advanced · C1", pct: 85 },
      { name: "Français", level: "Intermediate", pct: 55 },
      { name: "中文", level: "Basic and learning", pct: 18 },
    ],
    personalLabel: "Off the clock",
    personalText: "When I'm not working, I write poetry in Spanish, play guitar, and run. I crossed the world to study in a language I'm still learning; which is, more or less, how I approach everything.",
    capLabel: "What I do",
    capTitle: "Three ways I'm useful.",
    capHint: "Click a card to open the detail",
    capDetailMeta: "Detail",
    capOpenCta: "View case",
    capCloseCta: "Close",
    capCaseLabel: "How I do it",
    capProcessLabel: "How I work",
    capToolsLabel: "Tools & methods",
    capCtaLabel: "This sounds like your role?",
    capabilities: [
      {
        n: "01", title: "Strategy & Ventures",
        body: "Business model innovation, financial forecasting, and cross-cultural project management across Latin America and Asia.",
        tags: ["BM Innovation", "Entrepreneurship", "Intrapreneurship", "Cross-Cultural PM"],
        lead: "I connect the model to the money; business design, forecasting, and the project management to actually ship it, whether as a founder or inside an organization.",
        caseTitle: "Crunch DNA: strategy lead",
        caseMetric: "+20% retention",
        caseBody: "Leading the Strategic Development team, I ran a portfolio of 50+ accounts monthly, improving client retention by 20% and doubling implementation targets month over month.",
        process: [
          { h: "Read the business", d: "Understand the model, the market, and where the real constraint sits." },
          { h: "Design the move", d: "Shape the strategy or business-model change, pressure-tested with forecasting." },
          { h: "Build the plan", d: "Translate it into phases, owners and milestones across functions and cultures." },
          { h: "Drive delivery", d: "Coordinate stakeholders and reporting until the result actually lands." },
        ],
        tools: ["Business model design", "Financial forecasting", "Market analysis", "Intrapreneurship", "Cross-cultural PM", "Investor reporting"],
      },
      {
        n: "02", title: "Market & Sourcing Research",
        body: "Cross-regional supplier outreach across 6 countries. From Guatemala to Southeast Asia; finding the right partners.",
        tags: ["Procurement", "LATAM → Asia", "Tier-1 Suppliers"],
        lead: "I find and qualify the right partners across borders.",
        caseTitle: "Coats Thread, Thailand",
        caseMetric: "6 countries",
        caseBody: "At DRISA I ran a structured cross-regional sourcing strategy across six countries, earning direct responses from top-tier manufacturers; including Coats Thread, the world's largest industrial thread producer.",
        process: [
          { h: "Map the field", d: "Define the category, target tiers, and a country-by-country shortlist of credible suppliers." },
          { h: "Reach the right person", d: "Craft outreach that lands with decision-makers, adapted to each market's business culture." },
          { h: "Qualify fast", d: "Compare capabilities, MOQs and fit; surface the partners worth a real conversation." },
          { h: "Hand off clean", d: "Deliver a decision-ready brief so the team can move without re-doing the research." },
        ],
        tools: ["Supplier mapping", "Cross-border outreach", "Procurement research", "Market entry", "Cultural adaptation"],
      },
      {
        n: "03", title: "AI Systems & Automation",
        body: "Building n8n workflows, researching LLM memory architecture, and delivering AI-powered solutions for real business problems.",
        tags: ["n8n", "LLM Memory", "Workflow Design"],
        lead: "I turn repetitive, judgment-heavy work into systems; automation pipelines and AI tools aimed at a real business outcome.",
        caseTitle: "HeyNona: memory architecture",
        caseMetric: "Top 12",
        caseBody: "I designed and prototyped an AI companion built on LLM memory research; structuring how a system recalls what matters emotionally to a person.",
        process: [
          { h: "Find the bottleneck", d: "Locate where time and attention leak, and where a system can carry the load." },
          { h: "Design the flow", d: "Map the automation in n8n: triggers, logic, the human checkpoints that stay human." },
          { h: "Wire the intelligence", d: "Bring in LLMs where reasoning or memory adds real leverage." },
          { h: "Ship & iterate", d: "Deliver something that runs, then tighten it against how it's actually used." },
        ],
        tools: ["n8n", "LLM memory", "Workflow design", "Prompt engineering", "Rapid prototyping"],
      },
    ],
    featuredLabel: "Featured project",
    featured: {
      title: "HeyNona",
      tagline: "An AI companion for older adults, built on emotional-memory research.",
      body: "My MBA thesis turned venture: a conversational companion that remembers what matters emotionally to each person. Grounded in autobiographical-memory research, prototyped end to end, and pitched to a Top 12 finish at the Bangkok Business Challenge.",
      tags: ["AI Companion", "LLM Memory", "Bangkok Top 12", "MBA Thesis"],
      note: "[ project image / demo, coming soon ]",
    },
    proofLabel: "Recognition",
    recognition: [
      { title: "Bangkok Business Challenge", sub: "Top 12 Finalist · Sasin / Chulalongkorn", year: "2025" },
      { title: "Whirlpool Innovation Challenge", sub: "Best Creative Award · NYCU", year: "2025" },
      { title: "AIT Colombia Camp", sub: "Finalist · UPB Bogotá", year: "2020" },
    ],
    workedWith: "Worked with",
    testimonialPlaceholder: "References from past managers and teammates are available on request; a selected quote will live here.",
    testimonialAttribution: "Coming soon",
    contactLabel: "Next chapter",
    contactTitle: "Let's talk.",
    contactSub: "Hiring? Building something across markets? Write me; I answer in three languages, and I'm in Taiwan ready to start.",
    cta: "Write me",
    footer: "Written & designed like an essay · Hsinchu, Taiwan",
  },
  ES: {
    splashSub: "Elige tu idioma · Choose your language · 選擇語言",
    navContact: "Contacto",
    formTitle: "Hablemos.",
    formSubtitle: "Cuéntame qué estás construyendo. Respondo en tres idiomas, normalmente en menos de un día.",
    formName: "Tu nombre",
    formEmail: "Tu correo",
    formMessage: "Tu mensaje",
    formSend: "Enviar mensaje",
    formSending: "Enviando...",
    formSuccess: "Gracias. Te contactaré pronto.",
    formError: "Algo salió mal. También puedes escribirme directo por correo.",
    formClose: "Cerrar",
    formRe: "Sobre:",
    formRePrefill: "Hola David, te escribo sobre",
    availability: "Disponible, graduación junio 2026",
    heroKicker: "GUATEMALA → TAIWÁN → EL MUNDO",
    heroLine1: "Estrategia y",
    heroHl1: "ventures,",
    heroLine2: "entre",
    heroHl2: "dos mundos.",
    heroLine3: "",
    heroHl3: "",
    heroSub: "Un estratega que conecta Latinoamérica y Asia, ayudando a convertir distancia, idioma y cultura en acuerdos, ventures e IA que funciona.",
    heroCta: "¿Cómo soy útil?",
    heroRoles: "Abierto a roles en Estrategia · Business Development · IA",
    downloadCV: "Descargar CV",
    scroll: "Desliza",
    marqueeStrip: "Estrategia ◇ Sistemas de IA ◇ Mercados ◇ Ventures ◇ ",
    manifestoLabel: "Mi historia",
    manifesto: [
      { t: "Nací en " }, { t: "Guatemala", hl: 1 },
      { t: ", y ahora trabajo " }, { t: "desde Taiwán", hl: 2 },
      { t: ". En siete años he hecho análisis estratégico e implementaciones para " },
      { t: "50+ clientes en 6 mercados", hl: 3 },
      { t: "; liderando equipos, abriendo puertas entre Latinoamérica y Asia, y últimamente " },
      { t: "implementando IA en decisiones de negocio reales", hl: 4 },
      { t: "." },
    ],
    mediaLabel: "En persona",
    mediaTitle: "Unas palabras de David.",
    videoCaption: "DAVID, EN SUS PROPIAS PALABRAS, 90 SEG",
    videoPlaceholder: "[ VIDEO, DAVID HABLANDO ]",
    gifCaption: "EN ESCENA · BANGKOK BUSINESS CHALLENGE, 2025",
    gifPlaceholder: "[ DANDO UNA CHARLA ]",
    statementLabel: "Cómo opero",
    statement:
      "He planificado la estrategia y ejecutado proyectos para clientes en distintos mercados, idiomas y culturas. Lo que hago, al final, es ser como un puente entre mundos.",
    trajLabel: "Trayectoria",
    trajTitle: "El camino hasta hoy.",
    trajIntro: "Todo camino tiene una forma. El mío va de una cocina en Guatemala a salas de juntas en Asia, cada capítulo construido sobre el anterior.",
    timeline: [
      {
        chapter: "El primer salto", years: "2013–14", role: "Co-Fundador", org: "Pizzería Porto",
        desc: "A los diecinueve construí un restaurante de la nada; marca, validación de mercado, lanzamiento, un equipo que contratar y formar. Mi primera lección: una idea vale lo que puedes ejecutar.",
      },
      {
        chapter: "Aprender a entregar", years: "2018–19", role: "Co-Fundador & Project Manager", org: "Consultora de Reputación Online",
        desc: "Mi primer venture real: llevar clientes de un apretón de manos a un resultado entregado. SEO, contenido, un equipo externo que coordinar. Aprendí a cargar un proyecto de principio a fin.",
      },
      {
        chapter: "Encontrar el oficio", years: "2019–21", role: "Lead de Innovación en Modelos de Negocio", org: "Mosan",
        desc: "Aquí la estrategia se volvió mi oficio. Lideré innovación de modelo de negocio y construí una herramienta de pricing dinámico que dio forma a cómo nacían los productos. El trabajo se afinó, y yo también.",
      },
      {
        chapter: "Liderar al equipo", years: "2021–23", role: "Analista Estratégico Líder", org: "Crunch DNA",
        desc: "El capítulo que me definió. Liderando el equipo de Desarrollo Estratégico con 50+ cuentas, subí la retención de clientes 20% y dupliqué las metas de implementación mes a mes. Aprendí a mover a un equipo, no solo un plan.",
      },
      {
        chapter: "La prueba de alto riesgo", years: "2023", role: "Project Manager & Innovación de BM", org: "Mosan",
        desc: "Me llamaron de vuelta para una inversión estratégica mayor: ejecución end-to-end, modelos de forecasting, reporting directo a inversionistas. Dinero real, decisiones reales, sin dónde esconderse.",
      },
      {
        chapter: "Cruzar el mundo", years: "2024–26", role: "Global MBA · Technology Management", org: "NYCU Taiwán",
        desc: "Crucé el Pacífico para estudiar donde se construye el futuro. Hoy enseño lo que un día aprendí, mentoreando equipos de estudiantes como Teaching Assistant.",
      },
      {
        chapter: "Ser puente entre dos mundos", years: "2026–Hoy", role: "Procurement Research Intern", org: "DRISA · Remoto, Taiwán / SEA",
        desc: "Los hilos se unen. Dirijo sourcing interregional en seis países, logrando respuestas de fabricantes top-tier en Tailandia, Vietnam y China; la clase de puente entre Latinoamérica y Asia que nací para ser.",
      },
    ],
    eduLabel: "Formación",
    education: [
      { school: "National Yang Ming Chiao Tung University", degree: "Global MBA — Especialización en Technology Management", year: "2024–26", note: "TA, Business Model & Value Proposition" },
      { school: "Banco Interamericano de Desarrollo (BID)", degree: "Máster en Gestión Profesional de Proyectos", year: "2021", note: "Guatemala" },
      { school: "Universidad Francisco Marroquín", degree: "Licenciatura en Entrepreneurship", year: "2020", note: "Guatemala" },
    ],
    certsLabel: "Certificaciones",
    certifications: [
      "Coaching Skills for Managers — UC Davis / Coursera (2020)",
      "Turismo Sostenible e Innovación Social — ZHdK Strategic Design (2019)",
      "TOEFL iBT — C1 (100)",
    ],
    statsLabel: "En números",
    stats: [
      { value: 50, suffix: "+", label: "Clientes atendidos" },
      { value: 6, suffix: "", label: "Mercados" },
      { value: 4, suffix: "", label: "Idiomas" },
      { value: 7, suffix: "+", label: "Años operando" },
    ],
    flagsNote: "🇺🇸 🇬🇹 🇲🇽 🇵🇪 🇨🇴 🇦🇷 → 🇹🇼",
    langsLabel: "Idiomas",
    languages: [
      { name: "Español", level: "Nativo", pct: 100 },
      { name: "English", level: "Avanzado · C1", pct: 85 },
      { name: "Français", level: "Intermedio", pct: 55 },
      { name: "中文", level: "Básico y aprendiendo", pct: 18 },
    ],
    personalLabel: "Fuera de horario",
    personalText: "Cuando no estoy trabajando, escribo poesía en español, toco guitarra y corro. Crucé el mundo para estudiar en un idioma que todavía estoy aprendiendo; que es, más o menos, como encaro todo.",
    capLabel: "Lo que hago",
    capTitle: "Tres formas en que soy útil.",
    capHint: "Haz click en una tarjeta para ver el detalle",
    capDetailMeta: "Detalle",
    capOpenCta: "Ver caso",
    capCloseCta: "Cerrar",
    capCaseLabel: "Cómo lo hago",
    capProcessLabel: "Cómo trabajo",
    capToolsLabel: "Herramientas y métodos",
    capCtaLabel: "¿Suena a tu vacante?",
    capabilities: [
      {
        n: "01", title: "Estrategia y Ventures",
        body: "Innovación en modelos de negocio, forecasting financiero y gestión de proyectos cross-cultural en Latinoamérica y Asia.",
        tags: ["Innovación de BM", "Emprendimiento", "Intraemprendimiento", "PM Cross-Cultural"],
        lead: "Conecto el modelo con el dinero; diseño de negocio, forecasting, y la gestión de proyectos para realmente ejecutarlo, ya sea como fundador o dentro de una organización.",
        caseTitle: "Crunch DNA: líder de estrategia",
        caseMetric: "+20% retención",
        caseBody: "Liderando el equipo de Desarrollo Estratégico, manejé un portafolio de 50+ cuentas mensuales, mejorando la retención de clientes en 20% y duplicando las metas de implementación mes a mes.",
        process: [
          { h: "Leer el negocio", d: "Entender el modelo, el mercado, y dónde está la restricción real." },
          { h: "Diseñar la jugada", d: "Dar forma a la estrategia o el cambio de modelo, pressure-tested con forecasting." },
          { h: "Construir el plan", d: "Traducirlo en fases, responsables y milestones entre funciones y culturas." },
          { h: "Empujar la entrega", d: "Coordinar stakeholders y reporting hasta que el resultado realmente aterrice." },
        ],
        tools: ["Diseño de modelo de negocio", "Forecasting financiero", "Análisis de mercado", "Intraemprendimiento", "PM cross-cultural", "Reporting a inversionistas"],
      },
      {
        n: "02", title: "Investigación de Mercados y Sourcing",
        body: "Outreach de proveedores en 6 países. De Guatemala al Sudeste Asiático; encontrando los socios correctos.",
        tags: ["Procurement", "LATAM → Asia", "Proveedores Tier-1"],
        lead: "Encuentro y califico a los socios correctos a través de fronteras.",
        caseTitle: "Coats Thread, Tailandia",
        caseMetric: "6 países",
        caseBody: "En DRISA ejecuté una estrategia estructurada de sourcing interregional en seis países, logrando respuestas directas de fabricantes top-tier; incluyendo Coats Thread, el mayor productor de hilo industrial del mundo.",
        process: [
          { h: "Mapear el terreno", d: "Definir la categoría, los tiers objetivo y una lista corta país por país de proveedores creíbles." },
          { h: "Localizar a la persona correcta", d: "Diseñar un outreach que aterrice con quien decide, adaptado a la cultura de negocios de cada mercado." },
          { h: "Calificar rápido", d: "Comparar capacidades, MOQs y fit; destacar los socios que valen una conversación real." },
          { h: "Entregar limpio", d: "Un brief listo para decidir, para que el equipo avance sin rehacer la investigación." },
        ],
        tools: ["Mapeo de proveedores", "Outreach transfronterizo", "Procurement", "Entrada a mercados", "Adaptación cultural"],
      },
      {
        n: "03", title: "IA y Automatización",
        body: "Construyendo flujos en n8n, investigando arquitectura de memoria en LLMs, y entregando soluciones con IA para problemas reales de negocio.",
        tags: ["n8n", "Memoria LLM", "Diseño de Workflows"],
        lead: "Convierto trabajo repetitivo y de criterio en sistemas; pipelines de automatización y herramientas de IA apuntadas a un resultado real de negocio.",
        caseTitle: "HeyNona: arquitectura de memoria",
        caseMetric: "Top 12",
        caseBody: "Diseñé y prototipé un compañero de IA construido sobre investigación de memoria en LLMs; estructurando cómo un sistema recuerda lo que le importa emocionalmente a una persona.",
        process: [
          { h: "Encontrar el cuello de botella", d: "Ubicar dónde se fuga el tiempo y la atención, y dónde un sistema puede cargar el peso." },
          { h: "Diseñar el flujo", d: "Mapear la automatización en n8n: triggers, lógica, los checkpoints humanos que siguen siendo humanos." },
          { h: "Conectar la inteligencia", d: "Traer LLMs donde el razonamiento o la memoria dan apalancamiento real." },
          { h: "Entregar e iterar", d: "Lanzar algo que corre, y afinarlo contra cómo se usa de verdad." },
        ],
        tools: ["n8n", "Memoria LLM", "Diseño de workflows", "Prompt engineering", "Prototipado rápido"],
      },
    ],
    featuredLabel: "Proyecto destacado",
    featured: {
      title: "HeyNona",
      tagline: "Un compañero de IA para adultos mayores, construido sobre investigación de memoria emocional.",
      body: "Mi tesis de MBA convertida en venture: un compañero conversacional que recuerda lo que le importa emocionalmente a cada persona. Basado en investigación de memoria autobiográfica, prototipado de punta a punta, y presentado hasta un Top 12 en el Bangkok Business Challenge.",
      tags: ["Compañero de IA", "Memoria LLM", "Bangkok Top 12", "Tesis MBA"],
      note: "[ imagen / demo del proyecto, próximamente ]",
    },
    proofLabel: "Reconocimientos",
    recognition: [
      { title: "Bangkok Business Challenge", sub: "Top 12 Finalista · Sasin / Chulalongkorn", year: "2025" },
      { title: "Whirlpool Innovation Challenge", sub: "Best Creative Award · NYCU", year: "2025" },
      { title: "AIT Colombia Camp", sub: "Finalista · UPB Bogotá", year: "2020" },
    ],
    workedWith: "He trabajado con",
    testimonialPlaceholder: "Referencias de managers y colegas anteriores disponibles a solicitud; aquí vivirá una cita seleccionada.",
    testimonialAttribution: "Próximamente",
    contactLabel: "Siguiente capítulo",
    contactTitle: "Hablemos.",
    contactSub: "¿Contratando? ¿Construyendo algo entre mercados? Escríbeme; respondo en tres idiomas, y ya estoy en Taiwán listo para empezar.",
    cta: "Escríbeme",
    footer: "Escrito y diseñado como un ensayo · Hsinchu, Taiwán",
  },
  ZH: {
    splashSub: "選擇語言 · Choose your language · Elige tu idioma",
    navContact: "聯絡",
    formTitle: "聊聊吧。",
    formSubtitle: "告訴我你正在打造什麼。我能用三種語言回覆，通常一天內回應。",
    formName: "你的名字",
    formEmail: "你的電子郵件",
    formMessage: "你的訊息",
    formSend: "送出訊息",
    formSending: "傳送中...",
    formSuccess: "謝謝你，我會盡快與你聯繫。",
    formError: "發生錯誤，你也可以直接寄信給我。",
    formClose: "關閉",
    formRe: "關於：",
    formRePrefill: "David 你好，我想聊聊關於",
    availability: "求職中，2026 年 6 月畢業",
    heroKicker: "瓜地馬拉 → 台灣 → 世界",
    heroLine1: "策略與創業，",
    heroHl1: "",
    heroLine2: "",
    heroHl2: "橫跨兩個世界。",
    heroLine3: "",
    heroHl3: "",
    heroSub: "一位連結拉丁美洲與亞洲的策略家，把距離、語言與文化，轉化為交易、事業與真正能用的 AI。",
    heroCta: "我能幫上什麼忙？",
    heroRoles: "尋找策略 · 商業開發 · AI 相關職位",
    downloadCV: "下載履歷",
    scroll: "向下捲動",
    marqueeStrip: "策略 ◇ AI 系統 ◇ 市場 ◇ 創業 ◇ ",
    manifestoLabel: "我的故事",
    manifesto: [
      { t: "我出生在" }, { t: "瓜地馬拉", hl: 1 },
      { t: "，現在" }, { t: "以台灣為基地", hl: 2 },
      { t: "工作。七年來，我為" },
      { t: "橫跨 6 個市場的 50+ 客戶", hl: 3 },
      { t: "進行策略分析與落地執行; 帶領團隊、串連拉美與亞洲，最近更專注於" },
      { t: "將 AI 落實在真實商業決策", hl: 4 },
      { t: "。" },
    ],
    mediaLabel: "親自見面",
    mediaTitle: "David 的幾句話。",
    videoCaption: "DAVID 親自介紹，90 秒",
    videoPlaceholder: "[ 影片，DAVID 自我介紹 ]",
    gifCaption: "舞台上 · 曼谷商業挑戰賽，2025",
    gifPlaceholder: "[ 演講片段 ]",
    statementLabel: "我的方式",
    statement:
      "我為不同市場、語言與文化的客戶，規劃策略並推動執行。而我真正在做的，是像一座連結不同世界的橋樑。",
    trajLabel: "軌跡",
    trajTitle: "至今走過的路。",
    trajIntro: "每段旅程都有它的形狀。我的旅程，從瓜地馬拉的一間廚房，走到亞洲的會議室，每一章都建立在前一章之上。",
    timeline: [
      {
        chapter: "第一次躍進", years: "2013–14", role: "共同創辦人", org: "Pizzería Porto",
        desc: "十九歲時，我從零打造一家餐廳；品牌、市場驗證、開業，還有要招募與培訓的團隊。我學到的第一課：一個點子的價值，取決於你能否執行。",
      },
      {
        chapter: "學會交付", years: "2018–19", role: "共同創辦人 & 專案經理", org: "線上聲譽顧問公司",
        desc: "我的第一次真正創業：把客戶從一次握手帶到一份交付成果。SEO、內容、要協調的外部團隊。我學會了完整地扛起一個專案。",
      },
      {
        chapter: "磨練專業", years: "2019–21", role: "商業模式創新主管", org: "Mosan",
        desc: "在這裡，策略成了我的專業。我主導商業模式創新，打造了一套動態定價工具，形塑新產品的誕生方式。工作更鋒利，我也是。",
      },
      {
        chapter: "帶領團隊", years: "2021–23", role: "首席策略分析師", org: "Crunch DNA",
        desc: "定義了我的一章。帶領策略發展團隊管理 50+ 客戶，我將客戶留存率提升 20%，執行目標月增 100%。我學會的，是帶動一個團隊，而不只是一份計畫。",
      },
      {
        chapter: "高風險的考驗", years: "2023", role: "專案經理 & 商模創新", org: "Mosan",
        desc: "被召回負責一項重大策略投資：端到端執行、財務預測模型、直接向投資人報告。真實的資金、真實的決策，無處可躲。",
      },
      {
        chapter: "跨越世界", years: "2024–26", role: "Global MBA · 科技管理", org: "陽明交大",
        desc: "我橫越太平洋，到正在打造未來的地方求學。如今我教授曾經學過的東西，以助教身分指導學生團隊。",
      },
      {
        chapter: "成為兩個世界的橋樑", years: "2026–現在", role: "採購研究實習", org: "DRISA · 遠端，台灣 / 東南亞",
        desc: "線索匯聚於此。我負責橫跨六國的跨區域採購，獲得泰國、越南與中國一線製造商的回應；正是我生來要成為的，連結拉丁美洲與亞洲的那座橋。",
      },
    ],
    eduLabel: "學歷",
    education: [
      { school: "國立陽明交通大學", degree: "Global MBA — 科技管理專業", year: "2024–26", note: "商業模式與價值主張課程助教" },
      { school: "美洲開發銀行（IDB）", degree: "專業專案管理碩士", year: "2021", note: "瓜地馬拉" },
      { school: "Universidad Francisco Marroquín", degree: "創業學學士", year: "2020", note: "瓜地馬拉" },
    ],
    certsLabel: "證照",
    certifications: [
      "Coaching Skills for Managers — UC Davis / Coursera（2020）",
      "永續觀光與社會創新 — ZHdK Strategic Design（2019）",
      "TOEFL iBT — C1（100）",
    ],
    statsLabel: "數字會說話",
    stats: [
      { value: 50, suffix: "+", label: "服務客戶" },
      { value: 6, suffix: "", label: "進入市場" },
      { value: 4, suffix: "", label: "語言" },
      { value: 7, suffix: "+", label: "年實戰經驗" },
    ],
    flagsNote: "🇺🇸 🇬🇹 🇲🇽 🇵🇪 🇨🇴 🇦🇷 → 🇹🇼",
    langsLabel: "語言能力",
    languages: [
      { name: "Español", level: "母語", pct: 100 },
      { name: "English", level: "進階 · C1", pct: 85 },
      { name: "Français", level: "中級", pct: 55 },
      { name: "中文", level: "基礎，持續學習中", pct: 18 },
    ],
    personalLabel: "工作之外",
    personalText: "不工作的時候，我用西班牙文寫詩、彈吉他、跑步。我跨越半個地球，用一個還在學的語言求學; 這差不多就是我面對所有事情的方式。",
    capLabel: "我的專長",
    capTitle: "三種我能幫上忙的方式。",
    capHint: "點擊卡片查看詳細內容",
    capDetailMeta: "詳細",
    capOpenCta: "查看案例",
    capCloseCta: "收合",
    capCaseLabel: "我怎麼做",
    capProcessLabel: "我的工作方式",
    capToolsLabel: "工具與方法",
    capCtaLabel: "這正是你要找的人？",
    capabilities: [
      {
        n: "01", title: "策略與創業",
        body: "商業模式創新、財務預測，以及橫跨拉丁美洲與亞洲的跨文化專案管理。",
        tags: ["商模創新", "創業", "內部創業", "跨文化專案管理"],
        lead: "我把商業模式與獲利連結起來; 商業設計、財務預測，以及真正能落地執行的專案管理，無論是身為創辦人，或在組織內部推動。",
        caseTitle: "Crunch DNA: 策略主管",
        caseMetric: "留存 +20%",
        caseBody: "帶領策略發展團隊，我每月管理 50+ 客戶組合, 客戶留存率提升 20%，執行目標達成月增 100%。",
        process: [
          { h: "讀懂業務", d: "理解商業模式、市場，以及真正的限制所在。" },
          { h: "設計策略", d: "形塑策略或商業模式的轉變，並以財務預測進行壓力測試。" },
          { h: "建立計畫", d: "轉化為跨部門、跨文化的階段、負責人與里程碑。" },
          { h: "推動交付", d: "協調利害關係人與報告，直到成果真正落地。" },
        ],
        tools: ["商業模式設計", "財務預測", "市場分析", "內部創業", "跨文化專案管理", "投資人報告"],
      },
      {
        n: "02", title: "市場與採購研究",
        body: "跨區域供應商開發，涵蓋 6 個國家。從瓜地馬拉到東南亞; 找到對的合作夥伴。",
        tags: ["採購", "拉美 → 亞洲", "一級供應商"],
        lead: "我跨越國界尋找並篩選對的合作夥伴。",
        caseTitle: "Coats Thread，泰國",
        caseMetric: "6 國",
        caseBody: "在 DRISA，我規劃橫跨六國的結構化跨區域採購策略，獲得一線製造商的直接回應; 包括全球最大工業縫線製造商 Coats Thread。",
        process: [
          { h: "盤點戰場", d: "定義品類、目標層級，並逐國列出可信供應商的短名單。" },
          { h: "找到對的窗口", d: "設計能打動決策者的開發訊息，依各市場的商業文化調整。" },
          { h: "快速篩選", d: "比較產能、最低訂量與契合度；篩出值得深談的夥伴。" },
          { h: "乾淨交接", d: "提供可直接決策的簡報，讓團隊無需重做研究即可推進。" },
        ],
        tools: ["供應商盤點", "跨境開發", "採購研究", "市場開拓", "文化調適"],
      },
      {
        n: "03", title: "AI 系統與自動化",
        body: "打造 n8n 自動化流程、研究 LLM 記憶架構，為真實商業問題提供 AI 解決方案。",
        tags: ["n8n", "LLM 記憶", "流程設計"],
        lead: "我把重複又需要判斷的工作轉化為系統; 自動化流程與 AI 工具，瞄準真實的商業成果。",
        caseTitle: "HeyNona: 記憶架構",
        caseMetric: "Top 12",
        caseBody: "我設計並打造了一個建立在 LLM 記憶研究上的 AI 陪伴者; 構建系統如何記住一個人情感上最在意的事。",
        process: [
          { h: "找出瓶頸", d: "定位時間與注意力流失之處，以及系統可以承擔的部分。" },
          { h: "設計流程", d: "在 n8n 中規劃自動化：觸發、邏輯，以及該保留給人的關卡。" },
          { h: "接入智能", d: "在推理或記憶能帶來真正槓桿之處導入 LLM。" },
          { h: "上線並迭代", d: "先交付能運作的版本，再依實際使用情況優化。" },
        ],
        tools: ["n8n", "LLM 記憶", "流程設計", "提示工程", "快速原型"],
      },
    ],
    featuredLabel: "精選專案",
    featured: {
      title: "HeyNona",
      tagline: "為長輩設計的 AI 陪伴者，建立在情感記憶研究之上。",
      body: "從 MBA 論文長出的創業計畫：一個會記得每個人情感重點的對話式陪伴者。以自傳式記憶研究為基礎，完成端到端原型，並在曼谷商業挑戰賽闖進 Top 12。",
      tags: ["AI 陪伴", "LLM 記憶", "曼谷 Top 12", "MBA 論文"],
      note: "[ 專案圖片 / 展示，即將更新 ]",
    },
    proofLabel: "獲獎紀錄",
    recognition: [
      { title: "Bangkok Business Challenge", sub: "Top 12 決賽入圍 · Sasin / 朱拉隆功", year: "2025" },
      { title: "Whirlpool Innovation Challenge", sub: "最佳創意獎 · 陽明交大", year: "2025" },
      { title: "AIT Colombia Camp", sub: "決賽入圍 · UPB 波哥大", year: "2020" },
    ],
    workedWith: "合作企業",
    testimonialPlaceholder: "可應要求提供前主管與同事的推薦; 此處將放上一則精選評價。",
    testimonialAttribution: "即將更新",
    contactLabel: "下一章",
    contactTitle: "聊聊吧。",
    contactSub: "正在招募？正在打造跨市場的事業？寫信給我; 我能用三種語言回覆，而且我人就在台灣，隨時可以開始。",
    cta: "寫信給我",
    footer: "如散文般書寫與設計 · 台灣新竹",
  },
};

/* // Replace text chips with <img> logo assets when available */
const companies = ["BELIV", "TRUPPER", "POSTOBÓN", "PERU PIMA", "CBC", "KRAM", "MASTER HOLDER"];

/* loader greeting cycle — 您好 (formal) reads right when addressing recruiters */
const GREETINGS = ["Hola.", "Hello.", "您好。"];

const css = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=Inter:wght@300;400;500&family=JetBrains+Mono:wght@300;400&display=swap');

/* global reset — kill the default white frame / margins */
html, body, #root {
  margin: 0; padding: 0;
  background: #11131f;
  width: 100%;
  overflow-x: hidden;
}
* { box-sizing: border-box; }

.ed-root {
  /* deep midnight-blue base, warm cream ink, glowing yellow */
  --paper: #11131f;
  --paper-deep: #0c0e18;
  --paper-mark: #1b1e30;
  --ink: #f3efe3;
  --ink-soft: rgba(243,239,227,0.66);
  --ink-faint: rgba(243,239,227,0.20);
  --mark: #ffe14d;
  --teal: #6fd6c4;
  --line: rgba(243,239,227,0.14);
  --pline: rgba(243,239,227,0.16);
  /* accent slab — an inverted (light) panel for contrast moments */
  --slab-bg: #f3efe3;
  --slab-ink: #11131f;
  --serif: 'Fraunces', Georgia, serif;
  --mono: 'JetBrains Mono', monospace;
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  background: var(--paper);
  color: var(--ink);
  min-height: 100vh;
  overflow-x: hidden;
}
.ed-root ::selection { background: var(--mark); color: var(--ink); }
.ed-serif { font-family: var(--serif); font-weight: 300; letter-spacing: -0.015em; }
.ed-mono { font-family: var(--mono); }

/* ═══════ THE SIGNATURE — highlighter sweep ═══════ */
.mk {
  background-image: linear-gradient(transparent 10%, var(--mark) 10%, var(--mark) 86%, transparent 86%);
  background-repeat: no-repeat;
  background-size: 0% 100%;
  transition: background-size 0.85s cubic-bezier(0.22, 1, 0.36, 1), color 0.5s ease 0.25s;
  padding: 0 0.12em;
  margin: 0 -0.04em;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
}
.mk.on { background-size: 100% 100%; color: var(--slab-ink); }
.ink-w { transition: color 0.35s ease; }

/* ═══════ KINETIC CHARS ═══════ */
.chm { display: inline-block; overflow: hidden; vertical-align: bottom; }
.ch { display: inline-block; transform: translateY(112%) rotate(7deg); opacity: 0; transform-origin: bottom left; }
.ch.in { animation: chIn 0.75s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
@keyframes chIn { to { transform: translateY(0) rotate(0deg); opacity: 1; } }

/* ═══════ LABELS ═══════ */
.ed-label {
  font-family: var(--mono);
  font-size: 13px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--ink-soft);
  display: inline-flex;
  align-items: center;
  gap: 14px;
}
.ed-label::before { content: ''; width: 42px; height: 1.5px; background: var(--ink); opacity: 0.5; }
.ed-label.inv { color: rgba(245,241,232,0.6); }
.ed-label.inv::before { background: var(--paper); }
.ed-label.slab-label { color: rgba(17,19,31,0.6); }
.ed-label.slab-label::before { background: var(--slab-ink); opacity: 0.6; }

/* ═══════ REVEALS ═══════ */
@keyframes edUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
.rv { opacity: 0; }
.rv.in { animation: edUp 0.85s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
@keyframes lineRise { from { opacity: 0; transform: translateY(108%); } to { opacity: 1; transform: translateY(0); } }
.lmask { display: block; overflow: hidden; }
.lrise { display: block; animation: lineRise 0.95s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }

/* ═══════ INK PRELOADER — counter, greetings, curtain wipe ═══════ */
.ed-loader {
  position: fixed; inset: 0;
  z-index: 95;
  background: var(--ink);
  color: var(--paper);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 32px;
  transform: translateY(0);
  transition: transform 1.05s cubic-bezier(0.76, 0, 0.24, 1);
}
.ed-loader.leaving { transform: translateY(calc(-100% - 18vh)); }
.ed-loader .curve {
  position: absolute;
  top: calc(100% - 1px); left: -6%;
  width: 112%; height: 18vh;
  background: var(--ink);
  border-radius: 0 0 50% 50%;
}
.ed-loader .greet {
  font-family: var(--serif);
  font-style: italic;
  font-weight: 300;
  font-size: clamp(56px, 11vw, 140px);
  line-height: 1.1;
}
@keyframes greetIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
.ed-loader .greet > span { display: inline-block; animation: greetIn 0.5s ease; }
.ed-loader .sub {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: rgba(245,241,232,0.5);
  text-align: center;
  padding: 0 20px;
}
.ed-loader .row { display: flex; gap: clamp(14px, 4vw, 36px); min-height: 56px; flex-wrap: wrap; justify-content: center; }
.ed-lang2 {
  font-family: var(--serif);
  font-weight: 400;
  font-size: clamp(17px, 2.4vw, 24px);
  padding: 10px 28px;
  border-radius: 9999px;
  border: 1px solid rgba(245,241,232,0.3);
  background: none;
  color: var(--paper);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  opacity: 0;
}
.ed-lang2.in { animation: edUp 0.55s ease forwards; }
.ed-lang2:hover, .ed-lang2:focus-visible {
  background: var(--mark);
  color: var(--ink);
  border-color: var(--mark);
  transform: translateY(-3px);
}
.ed-lang2:focus-visible { outline: 1px solid var(--mark); outline-offset: 4px; }
.ed-loader .pct {
  position: absolute;
  bottom: 22px; left: clamp(20px, 5vw, 64px);
  font-family: var(--serif);
  font-weight: 300;
  font-size: clamp(58px, 9vw, 120px);
  line-height: 1;
  color: var(--mark);
  font-variant-numeric: tabular-nums;
}
.ed-loader .pct small { font-size: 0.32em; font-style: italic; }
.ed-loader .pct-note {
  position: absolute;
  bottom: 30px; right: clamp(20px, 5vw, 64px);
  font-family: var(--mono);
  font-size: 9px; letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(245,241,232,0.35);
}

/* ═══════ NAV ═══════ */
.ed-nav {
  position: fixed; top: 0; left: 0; right: 0;
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px clamp(20px, 5vw, 64px);
  z-index: 50;
  background: rgba(245,241,232,0);
  border-bottom: 1px solid transparent;
  transition: background 0.4s ease, border-color 0.4s ease;
}
.ed-nav.scrolled {
  background: rgba(17,19,31,0.9);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--line);
}
.ed-nav .brand { font-family: var(--serif); font-style: italic; font-size: 18px; }
.ed-nav .right { display: flex; align-items: center; gap: 18px; }
.ed-toggle {
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.08em;
  background: none; border: none; cursor: pointer;
  color: var(--ink-soft);
  padding: 3px 4px;
  transition: color 0.2s ease;
  position: relative;
}
.ed-toggle.active { color: var(--ink); }
.ed-toggle.active::after {
  content: '';
  position: absolute; left: 0; right: 0; bottom: 0;
  height: 40%;
  background: var(--mark);
  z-index: -1;
}
.ed-toggle:hover:not(.active) { color: var(--ink); }
.ed-nav .contact-link {
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink); text-decoration: none;
  border: none; border-bottom: 1px solid var(--ink);
  background: none; cursor: pointer;
  padding: 0 0 1px;
  transition: border-color 0.2s ease, color 0.2s ease;
}
.ed-nav .contact-link:hover { color: var(--teal); border-color: var(--teal); }
@media (max-width: 560px) { .ed-nav .contact-link { display: none; } }

/* ═══════ THE CONNECTING THREAD ═══════ */
.ed-thread-wrap {
  position: absolute;
  top: 0; right: 0;
  width: 200px; height: 100%;
  pointer-events: none;
  z-index: 6;
  overflow: visible;
}
.ed-thread { display: block; overflow: visible; }
.thread-path {
  fill: none;
  stroke: var(--mark);
  stroke-width: 2.5;
  stroke-linecap: round;
  opacity: 0.9;
  filter: drop-shadow(0 0 4px rgba(255,225,77,0.7)) drop-shadow(0 0 9px rgba(255,225,77,0.35));
}
.thread-dot {
  fill: var(--mark);
  stroke: var(--paper);
  stroke-width: 3;
  filter: drop-shadow(0 0 6px rgba(255,225,77,0.9)) drop-shadow(0 0 14px rgba(255,225,77,0.5));
}
@media (max-width: 759px) {
  .ed-thread-wrap { width: 70px; opacity: 0.55; }
}

/* ═══════ HIGHLIGHTER PROGRESS BAR ═══════ */
.ed-progress { position: fixed; top: 0; left: 0; right: 0; height: 5px; z-index: 60; pointer-events: none; }
.ed-progress .fill { height: 100%; width: 0%; background: var(--mark); border-right: 3px solid var(--ink); }

/* ═══════ FLOATING CTA ═══════ */
.ed-float-cta {
  position: fixed; bottom: 22px; right: 22px; z-index: 55;
  display: inline-flex; align-items: center; gap: 10px;
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--paper); background: var(--ink);
  border-radius: 9999px; padding: 14px 24px;
  text-decoration: none;
  box-shadow: 0 12px 28px -12px rgba(27,24,18,0.5);
  opacity: 0; transform: translateY(14px); pointer-events: none;
  transition: opacity 0.4s ease, transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), background 0.3s ease, color 0.3s ease;
}
.ed-float-cta.show { opacity: 1; transform: translateY(0); pointer-events: auto; }
.ed-float-cta:hover { background: var(--mark); color: var(--slab-ink); }

/* ═══════ MAGNETIC ═══════ */
.magnet { transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1); will-change: transform; }

/* ═══════ HERO ═══════ */
.ed-hero {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: flex-end;
  padding: clamp(90px, 14vh, 140px) clamp(20px, 5vw, 64px) clamp(48px, 8vh, 90px);
  overflow: hidden;
}
.ed-hero-photo {
  position: absolute;
  top: 0; right: 0; bottom: 0;
  width: min(62vw, 760px);
  will-change: transform;
}
.ed-hero-photo .reveal {
  /* // HERO PHOTO — set HERO_PHOTO_URL; clip-path unveils it on enter */
  position: absolute; inset: 0;
  clip-path: inset(0 0 100% 0);
  transition: clip-path 1.3s cubic-bezier(0.76, 0, 0.24, 1) 0.15s;
  background: radial-gradient(ellipse at 50% 35%, #c9c0ab 0%, #a89e87 55%, #8d8470 100%);
  overflow: hidden;
}
.ed-hero-photo .reveal.open { clip-path: inset(0 0 0% 0); }
.ed-hero-photo .reveal img,
.ed-hero-photo .reveal .inner-zoom {
  width: 100%; height: 100%;
  object-fit: cover; display: block;
  transform: scale(1.22);
  transition: transform 1.8s cubic-bezier(0.22, 1, 0.36, 1) 0.15s;
}
.ed-hero-photo .reveal.open img,
.ed-hero-photo .reveal.open .inner-zoom { transform: scale(1); }
.ed-hero-photo .ph-label {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.3em;
  color: rgba(27,24,18,0.4);
}
.ed-hero-photo::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(90deg, var(--paper) 0%, rgba(17,19,31,0.55) 22%, transparent 55%);
  pointer-events: none;
}
@media (max-width: 1023px) {
  .ed-hero-photo { width: 100%; opacity: 0.42; }
  .ed-hero-photo::after { background: linear-gradient(180deg, rgba(17,19,31,0.78), rgba(17,19,31,0.6)); }
}
.ed-hero .grain {
  position: absolute; inset: 0; pointer-events: none;
  opacity: 0.4; mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='matrix' values='0 0 0 0 0.6  0 0 0 0 0.58  0 0 0 0 0.5  0 0 0 0.5 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  background-size: 240px 240px;
}
.ed-hero-kicker {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--ink-soft);
}
.ed-status {
  display: inline-flex; align-items: center; gap: 9px;
  font-family: var(--mono); font-size: 10px; letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--ink);
  border: 1px solid var(--line);
  background: rgba(243,239,227,0.06);
  border-radius: 9999px;
  padding: 8px 16px;
}
.ed-status .pulse {
  width: 8px; height: 8px; border-radius: 50%;
  background: #2e9e6b;
  position: relative;
  flex-shrink: 0;
}
@keyframes statusPing { 0% { transform: scale(1); opacity: 0.7; } 100% { transform: scale(2.6); opacity: 0; } }
.ed-status .pulse::after {
  content: '';
  position: absolute; inset: 0;
  border-radius: 50%;
  background: #2e9e6b;
  animation: statusPing 1.8s ease-out infinite;
}
.ed-hero-title {
  font-family: var(--serif);
  font-weight: 300;
  font-size: clamp(46px, 9.5vw, 132px);
  line-height: 1.02;
  letter-spacing: -0.02em;
  position: relative;
  z-index: 2;
}
.ed-hero-title > div { white-space: nowrap; }
.ed-hero-title em { font-style: italic; font-weight: 400; }
@media (max-width: 600px) {
  .ed-hero-title { font-size: clamp(40px, 13vw, 60px); line-height: 1.08; }
  .ed-hero-title > div { white-space: normal; }
  .ed-hero-title .h-plain, .ed-hero-title .h-accent { display: inline; }
}
.ed-hero-sub {
  font-size: clamp(15px, 1.6vw, 18px);
  line-height: 1.7;
  color: var(--ink-soft);
  max-width: 460px;
}
.ed-scroll-cue {
  position: absolute;
  bottom: 22px; right: clamp(20px, 5vw, 64px);
  display: flex; align-items: center; gap: 10px;
  font-family: var(--mono); font-size: 10px; letter-spacing: 0.3em;
  text-transform: uppercase; color: var(--ink-soft);
  z-index: 3;
}
@keyframes cueBob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(6px); } }
.ed-scroll-cue svg { animation: cueBob 1.8s ease-in-out infinite; }
.ed-cv-btn {
  display: inline-flex; align-items: center; gap: 9px;
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ink); text-decoration: none;
  border: 1px solid var(--ink);
  border-radius: 9999px;
  padding: 11px 22px;
  position: relative; overflow: hidden;
  transition: color 0.3s ease;
}
.ed-cv-btn::before {
  content: '';
  position: absolute; inset: 0;
  background: var(--mark);
  transform: translateY(101%);
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.ed-cv-btn:hover::before { transform: translateY(0); }
.ed-cv-btn span, .ed-cv-btn svg { position: relative; z-index: 1; }

/* ROLES TAG — states the target roles up front */
.ed-roles-tag {
  display: inline-block;
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--mark);
  border: 1px solid rgba(255,225,77,0.4);
  border-radius: 9999px;
  padding: 8px 16px;
}

/* PRIMARY HERO CTA — the loud "how am I useful" button */
.ed-hero-cta {
  display: inline-flex; align-items: center; gap: 11px;
  font-family: var(--mono); font-size: clamp(12px, 1.4vw, 14px);
  letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--slab-ink);
  background: var(--mark);
  border-radius: 9999px;
  padding: 15px 28px;
  text-decoration: none;
  position: relative; overflow: hidden;
  box-shadow: 0 14px 36px -12px rgba(255,225,77,0.5);
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease;
}
.ed-hero-cta .mk-bg {
  position: absolute; inset: 0;
  background: var(--ink);
  transform: translateY(101%);
  transition: transform 0.38s cubic-bezier(0.22, 1, 0.36, 1);
}
.ed-hero-cta:hover { transform: translateY(-2px); box-shadow: 0 18px 44px -12px rgba(255,225,77,0.6); }
.ed-hero-cta:hover .mk-bg { transform: translateY(0); }
.ed-hero-cta:hover span, .ed-hero-cta:hover svg { color: var(--mark); }
.ed-hero-cta span, .ed-hero-cta svg { position: relative; z-index: 1; transition: color 0.3s ease; }
@keyframes ctaBob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(3px); } }
.ed-hero-cta svg { animation: ctaBob 1.8s ease-in-out infinite; }

/* ═══════ SPINNING BADGE — open to work ═══════ */
.ed-badge-wrap {
  position: absolute;
  left: -56px; bottom: 13%;
  width: 136px; height: 136px;
  z-index: 4;
  text-decoration: none;
  display: block;
}
@keyframes badgeSpin { to { transform: rotate(360deg); } }
.ed-badge-wrap svg { width: 100%; height: 100%; animation: badgeSpin 16s linear infinite; }
.ed-badge-wrap svg text {
  font-family: var(--mono);
  font-size: 10.5px;
  letter-spacing: 0.18em;
  fill: var(--ink);
  text-transform: uppercase;
}
.ed-badge-wrap .disc { fill: var(--paper); stroke: var(--line); stroke-width: 1; }
.ed-badge-wrap .core {
  position: absolute; inset: 38px;
  border-radius: 50%;
  background: var(--mark);
  display: flex; align-items: center; justify-content: center;
  color: var(--ink);
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.ed-badge-wrap:hover .core { transform: scale(1.15) rotate(45deg); }
@media (max-width: 1023px) {
  .ed-badge-wrap { left: auto; right: 10px; bottom: auto; top: 84px; width: 100px; height: 100px; }
  .ed-badge-wrap .core { inset: 28px; }
}

/* ═══════ VELOCITY MARQUEE STRIP ═══════ */
.ed-vstrip {
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  padding: clamp(12px, 2vh, 20px) 0;
  overflow: hidden;
  background: var(--paper);
}
.ed-vstrip .trk { display: flex; width: max-content; will-change: transform; }
@keyframes vscroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.ed-vstrip .mv { display: flex; flex-shrink: 0; width: max-content; animation: vscroll 55s linear infinite; }
.ed-vstrip .it {
  font-family: var(--serif);
  font-weight: 300;
  font-style: italic;
  font-size: clamp(20px, 2.8vw, 36px);
  white-space: nowrap;
  color: transparent;
  -webkit-text-stroke: 1px rgba(243,239,227,0.32);
  padding-right: 0.4em;
  transition: color 0.4s ease, -webkit-text-stroke 0.4s ease;
}
.ed-vstrip:hover .it { color: var(--mark); -webkit-text-stroke: 1px transparent; }

/* ═══════ SECTIONS ═══════ */
.ed-section { padding: clamp(90px, 13vh, 170px) clamp(20px, 5vw, 64px); position: relative; }
.ed-rule { border-top: 1px solid var(--line); }

.ed-manifesto {
  font-family: var(--serif);
  font-weight: 300;
  font-size: clamp(26px, 4.4vw, 52px);
  line-height: 1.35;
  letter-spacing: -0.01em;
  max-width: 1080px;
}

/* ═══════ INK SLAB — the statement as a floating dark sheet ═══════ */
.ed-slab-wrap { padding: clamp(40px, 7vh, 90px) clamp(10px, 2vw, 28px); }
.ed-slab {
  background: var(--mark);
  color: var(--slab-ink);
  border-radius: clamp(24px, 4vw, 56px);
  padding: clamp(80px, 13vh, 170px) clamp(24px, 5vw, 72px);
  position: relative;
  overflow: hidden;
}
.ed-slab .slab-grain {
  position: absolute; inset: 0; pointer-events: none;
  opacity: 0.20; mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0.1  0 0 0 1 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  background-size: 240px 240px;
}
.ed-statement {
  font-family: var(--serif);
  font-weight: 300;
  font-style: italic;
  font-size: clamp(28px, 5vw, 60px);
  line-height: 1.32;
  max-width: 1000px;
  position: relative;
}

/* ═══════ THE JOURNEY — winding path ═══════ */
.ed-journey {
  position: relative;
  margin-top: clamp(50px, 8vh, 90px);
  padding: 20px 0;
}
.ed-journey-path {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  pointer-events: none; overflow: visible;
  z-index: 0;
}
.jp-line {
  fill: none;
  stroke: var(--ink-faint);
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-dasharray: 2 12;
}
.jp-line-draw {
  fill: none;
  stroke: var(--mark);
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-dasharray: 2 12;
  filter: drop-shadow(0 0 5px rgba(255,225,77,0.6)) drop-shadow(0 0 12px rgba(255,225,77,0.3));
}
.ed-stop {
  position: relative; z-index: 1;
  display: grid;
  align-items: center;
  gap: clamp(20px, 4vw, 56px);
  margin-bottom: clamp(60px, 11vh, 130px);
}
.ed-stop:last-child { margin-bottom: 20px; }
@media (min-width: 820px) {
  .ed-stop.left { grid-template-columns: 1fr 1fr; }
  .ed-stop.right { grid-template-columns: 1fr 1fr; }
  .ed-stop.right .ed-stop-art { order: 2; }
  .ed-stop.right .ed-stop-card { order: 1; text-align: right; }
  .ed-stop.right .ed-stop-org { justify-content: flex-end; }
}

/* the art marker on the path */
.ed-stop-art {
  position: relative;
  display: flex; align-items: center; justify-content: center;
  width: clamp(120px, 18vw, 200px);
  height: clamp(120px, 18vw, 200px);
  margin: 0 auto;
  border-radius: 50%;
  background: radial-gradient(circle at 50% 40%, var(--paper-mark), var(--paper-deep));
  border: 1px solid rgba(255,225,77,0.25);
  opacity: 0;
  transform: scale(0.6);
  transition: opacity 0.6s ease, transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.ed-stop.in .ed-stop-art { opacity: 1; transform: scale(1); }
.ed-stop-art img { width: 64%; height: 64%; object-fit: contain; }
.ed-stop-num {
  font-family: var(--serif); font-style: italic; font-weight: 300;
  font-size: clamp(40px, 7vw, 68px);
  color: var(--mark);
}
.ed-stop-dot {
  position: absolute;
  width: 14px; height: 14px; border-radius: 50%;
  background: var(--mark);
  border: 3px solid var(--paper);
  bottom: -7px; left: 50%; transform: translateX(-50%);
  box-shadow: 0 0 10px rgba(255,225,77,0.8);
}
@media (min-width: 820px) {
  .ed-stop-dot { bottom: auto; top: 50%; }
  .ed-stop.left .ed-stop-dot { left: auto; right: -7px; transform: translateY(-50%); }
  .ed-stop.right .ed-stop-dot { left: -7px; transform: translateY(-50%); }
}

/* the text card for each stop */
.ed-stop-card {
  opacity: 0;
  transform: translateY(26px);
  transition: opacity 0.6s ease 0.15s, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.15s;
}
.ed-stop.in .ed-stop-card { opacity: 1; transform: translateY(0); }
.ed-stop-years {
  font-family: var(--mono); font-size: 12px; letter-spacing: 0.2em;
  color: var(--mark);
}
.ed-stop-chapter {
  font-family: var(--serif); font-style: italic; font-weight: 400;
  font-size: clamp(28px, 4vw, 46px); line-height: 1.08;
  letter-spacing: -0.01em; margin-top: 10px;
}
.ed-stop-role {
  font-family: var(--mono); font-size: clamp(12px, 1.4vw, 14px);
  letter-spacing: 0.05em; text-transform: uppercase;
  margin-top: 16px; color: var(--ink);
}
.ed-stop-org {
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.18em;
  text-transform: uppercase; color: var(--teal); margin-top: 6px;
  display: flex;
}
.ed-stop-desc {
  font-size: clamp(15px, 1.6vw, 17px); line-height: 1.75;
  color: var(--ink-soft); margin-top: 16px;
}
@media (max-width: 819px) {
  .ed-journey { padding-left: 8px; }
  .ed-stop {
    grid-template-columns: 56px 1fr;
    text-align: left;
    align-items: start;
    gap: 18px;
    margin-bottom: clamp(44px, 8vh, 80px);
  }
  /* art marker sits small on the left rail */
  .ed-stop-art {
    width: 56px; height: 56px;
    margin: 0;
  }
  .ed-stop-num { font-size: 26px; }
  .ed-stop-art img { width: 60%; height: 60%; }
  /* dot hugs the bottom of each marker, on the rail */
  .ed-stop-dot { bottom: -6px; top: auto; left: 50%; right: auto; transform: translateX(-50%); }
  /* text always to the right, never centered over the line */
  .ed-stop.right .ed-stop-art { order: 0; }
  .ed-stop.right .ed-stop-card { order: 0; text-align: left; }
  .ed-stop.right .ed-stop-org { justify-content: flex-start; }
  .ed-stop-org { justify-content: flex-start; }
  .ed-stop-desc { max-width: 100%; margin: 16px 0 0; }
  .ed-stop-chapter { font-size: clamp(24px, 7vw, 34px); }
}

/* ═══════ EDUCATION + CERTS ═══════ */
.ed-edu-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(36px, 5vw, 80px);
  margin-top: 48px;
}
@media (min-width: 900px) { .ed-edu-grid { grid-template-columns: 7fr 5fr; } }
.ed-edu-row {
  display: flex; align-items: baseline; justify-content: space-between;
  gap: 16px; flex-wrap: wrap;
  padding: 22px 6px;
  border-bottom: 1px solid var(--line);
  transition: background 0.3s ease;
}
.ed-edu-row:hover { background: rgba(255,225,77,0.07); }
.ed-edu-row .school { font-family: var(--serif); font-weight: 400; font-size: clamp(18px, 2vw, 23px); }
.ed-edu-row .deg { font-size: 14px; color: var(--ink-soft); margin-top: 3px; }
.ed-edu-row .note { font-family: var(--mono); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--teal); margin-top: 7px; }
.ed-edu-row .yr { font-family: var(--serif); font-style: italic; font-size: 17px; color: var(--ink-soft); }
.ed-cert {
  display: flex; align-items: flex-start; gap: 12px;
  font-size: 14px; line-height: 1.6; color: var(--ink-soft);
  padding: 13px 0;
  border-bottom: 1px solid var(--line);
}
.ed-cert svg { width: 15px; height: 15px; color: var(--teal); flex-shrink: 0; margin-top: 3px; }

/* ═══════ MEDIA ═══════ */
.ed-media-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(28px, 4vw, 56px);
  margin-top: 56px;
  align-items: start;
}
@media (min-width: 900px) { .ed-media-grid { grid-template-columns: 7fr 5fr; } }
.ed-video-frame {
  /* // VIDEO SLOT — set VIDEO_URL above */
  position: relative;
  aspect-ratio: 16 / 9;
  background: #161310;
  border: 1px solid var(--line);
  border-radius: clamp(14px, 1.6vw, 22px);
  overflow: hidden;
}
.ed-video-frame video { width: 100%; height: 100%; object-fit: cover; display: block; }
.ed-video-ph {
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 18px;
  background: radial-gradient(ellipse at 50% 40%, #3a352c 0%, #1c1914 75%);
}
.ed-video-ph .play {
  width: clamp(56px, 7vw, 78px); height: clamp(56px, 7vw, 78px);
  border-radius: 50%;
  background: var(--mark);
  display: flex; align-items: center; justify-content: center;
  color: var(--ink);
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.ed-video-frame:hover .ed-video-ph .play { transform: scale(1.1); }
.ed-video-ph .lbl {
  font-family: var(--mono); font-size: 10px; letter-spacing: 0.3em;
  color: rgba(245,241,232,0.55);
}
.ed-media-cap {
  font-family: var(--mono); font-size: 10px; letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink-soft);
  margin-top: 14px;
  display: flex; align-items: center; gap: 10px;
}
.ed-media-cap::before { content: ''; width: 22px; height: 1px; background: var(--mark); box-shadow: 0 0 0 1px var(--mark); }
.ed-gif-card {
  /* // GIF SLOT — set SPEAKING_GIF_URL above */
  position: relative;
  background: #fff;
  padding: 12px 12px 16px;
  box-shadow: 0 14px 34px -18px rgba(27,24,18,0.45);
  transform: rotate(-1.6deg);
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  margin-top: clamp(0px, 2vw, 24px);
}
.ed-gif-card:hover { transform: rotate(0deg) scale(1.015); }
.ed-gif-card .tape {
  position: absolute;
  width: 86px; height: 26px;
  background: rgba(255,225,77,0.85);
  box-shadow: 0 1px 3px rgba(27,24,18,0.15);
  top: -12px; left: 50%;
  transform: translateX(-50%) rotate(-3deg);
}
.ed-gif-card .frame {
  aspect-ratio: 4 / 3;
  background: radial-gradient(ellipse at 50% 40%, #d6cdb8 0%, #b3a98f 80%);
  position: relative;
  overflow: hidden;
}
.ed-gif-card .frame img { width: 100%; height: 100%; object-fit: cover; display: block; }
.ed-gif-card .ph {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--mono); font-size: 10px; letter-spacing: 0.26em;
  color: rgba(27,24,18,0.4); text-align: center; padding: 0 14px;
}

/* ═══════ STATS + LANGUAGES ═══════ */
.ed-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin-top: 48px;
  border-top: 1px solid var(--line);
  border-left: 1px solid var(--line);
}
@media (min-width: 768px) { .ed-stats { grid-template-columns: repeat(4, 1fr); } }
.ed-stat {
  padding: clamp(24px, 3.4vw, 44px) clamp(18px, 2.4vw, 32px);
  border-right: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  transition: background 0.3s ease;
}
.ed-stat:hover { background: rgba(255,225,77,0.1); }
.ed-stat .num {
  font-family: var(--serif);
  font-weight: 300;
  font-size: clamp(48px, 6.5vw, 88px);
  line-height: 1;
  font-variant-numeric: tabular-nums;
}
.ed-stat .num .sx { color: var(--teal); font-style: italic; }
.ed-stat .lbl {
  font-family: var(--mono); font-size: 13px;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--ink-soft); margin-top: 14px;
  line-height: 1.4;
}
.ed-langs {
  display: grid;
  grid-template-columns: 1fr;
  gap: 22px 48px;
  margin-top: 54px;
}
@media (min-width: 768px) { .ed-langs { grid-template-columns: repeat(2, 1fr); } }
.ed-lang-row .top { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
.ed-lang-row .nm { font-family: var(--serif); font-weight: 400; font-size: clamp(19px, 2.2vw, 24px); }
.ed-lang-row .lv { font-family: var(--mono); font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink-soft); }
.ed-lang-row .bar { height: 7px; background: rgba(27,24,18,0.08); margin-top: 10px; overflow: hidden; }
.ed-lang-row .bar .fill {
  height: 100%;
  background: var(--mark);
  border-right: 2px solid var(--ink);
  width: 0%;
  transition: width 1.1s cubic-bezier(0.22, 1, 0.36, 1);
}

/* ═══════ STICKY STACKING CARDS — capabilities (expand in place) ═══════ */
.ed-stack { position: relative; margin-top: 56px; }
.ed-stack-card {
  position: sticky;
  border-radius: clamp(20px, 2.6vw, 36px);
  border: 1px solid var(--line);
  background: var(--paper-deep);
  margin-bottom: clamp(22px, 4vh, 48px);
  box-shadow: 0 -14px 44px -26px rgba(27,24,18,0.4);
  transform-origin: top center;
  will-change: transform;
  overflow: hidden;
  transition: box-shadow 0.4s ease, border-color 0.4s ease;
}
.ed-stack-card::before {
  content: '';
  position: absolute; inset: 0;
  pointer-events: none;
  opacity: 0.5; mix-blend-mode: screen;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='matrix' values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  background-size: 220px 220px;
  z-index: 0;
}
.ed-stack-card.is-open { position: relative; border-color: rgba(255,225,77,0.4); box-shadow: 0 30px 80px -40px rgba(0,0,0,0.7); }
.ed-stack.has-open .ed-stack-card { position: relative; top: auto !important; }

/* the always-visible clickable header */
.ed-card-head {
  position: relative; z-index: 1;
  width: 100%; text-align: left;
  background: none; border: none; color: inherit; cursor: pointer;
  font: inherit;
  display: flex; flex-direction: column;
  gap: 28px;
  padding: clamp(28px, 4.5vw, 64px);
  min-height: min(56vh, 480px);
  justify-content: space-between;
  touch-action: pan-y;
  -webkit-tap-highlight-color: transparent;
}
.ed-card-head > * { position: relative; z-index: 1; }
@media (max-width: 600px) {
  .ed-card-head { min-height: auto; gap: 22px; }
}

/* the peek nudge — cards gesture when they enter view */
@keyframes cardPeek {
  0% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
}
.ed-stack-card.peek { animation: cardPeek 0.9s cubic-bezier(0.34, 1.56, 0.64, 1); }

/* expandable detail panel */
.ed-card-panel {
  position: relative; z-index: 1;
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}
.ed-card-panel.open { grid-template-rows: 1fr; }
.ed-card-panel-inner {
  overflow: hidden;
  min-height: 0;
}
.ed-card-panel .ed-card-panel-inner {
  opacity: 0;
  transition: opacity 0.4s ease;
}
.ed-card-panel.open .ed-card-panel-inner {
  opacity: 1;
  transition: opacity 0.5s ease 0.15s;
  padding: 4px clamp(28px, 4.5vw, 64px) clamp(32px, 5vw, 56px);
}
.ed-stack-card.dark {
  background: linear-gradient(155deg, #1a1d2e 0%, #15182629 60%, var(--paper-deep) 100%);
  color: var(--ink);
  border-color: rgba(255,225,77,0.22);
}
.ed-stack-card.dark .n { background: var(--mark); color: var(--slab-ink); }
.ed-stack-card.tint { background: var(--paper-mark); }
.ed-stack-card .n {
  font-family: var(--mono); font-size: 12px; letter-spacing: 0.15em;
  color: #11131f;
  font-weight: 500;
  background: var(--mark);
  padding: 5px 11px;
  display: inline-block;
  width: fit-content;
}
.ed-stack-card h3 {
  font-family: var(--serif); font-weight: 300;
  font-size: clamp(34px, 6vw, 80px);
  letter-spacing: -0.02em; line-height: 1.02;
  margin-top: 22px;
  max-width: 14em;
}
.ed-stack-card p {
  font-size: clamp(15px, 1.5vw, 18px);
  line-height: 1.75;
  color: var(--ink-soft);
  max-width: 620px;
  margin-top: 20px;
}
.ed-stack-card.dark p { color: var(--ink-soft); }
.ed-stack-card .ghost {
  position: absolute;
  right: clamp(10px, 3vw, 40px); bottom: -0.18em;
  font-family: var(--serif); font-weight: 300; font-style: italic;
  font-size: clamp(110px, 20vw, 280px);
  line-height: 1;
  color: currentColor;
  opacity: 0.06;
  pointer-events: none;
}
.ed-tag {
  font-family: var(--mono); font-size: 12.5px; letter-spacing: 0.08em;
  padding: 8px 16px;
  color: var(--ink);
  border: 1px solid var(--line);
  border-radius: 9999px;
  white-space: nowrap;
  line-height: 1.2;
}
.ed-stack-card.dark .ed-tag { color: var(--ink-soft); border-color: rgba(243,239,227,0.25); }

/* clickable stacking card affordance */
.ed-stack-card { cursor: pointer; }
.ed-stack-card .open-hint {
  position: absolute;
  top: clamp(28px, 4.5vw, 64px); right: clamp(28px, 4.5vw, 64px);
  display: inline-flex; align-items: center; gap: 9px;
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--slab-ink);
  background: var(--mark);
  padding: 9px 9px 9px 18px;
  border-radius: 9999px;
  z-index: 2;
  box-shadow: 0 6px 18px -8px rgba(27,24,18,0.4);
  transition: gap 0.3s ease, transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease;
}
.ed-stack-card .open-hint .ic {
  width: 30px; height: 30px; border-radius: 50%;
  background: var(--slab-ink); color: var(--mark);
  display: flex; align-items: center; justify-content: center;
  transition: transform 0.35s cubic-bezier(0.22,1,0.36,1);
}
@keyframes icBob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(4px); } }
.ed-stack-card:not(.is-open) .open-hint .ic { animation: icBob 1.6s ease-in-out infinite; }
.ed-card-head:hover .open-hint { gap: 13px; transform: scale(1.05); }
.ed-card-head:hover .open-hint .ic { animation: none; transform: translateY(3px); }
.ed-stack-card .open-hint.active .ic { animation: none; transform: rotate(0deg); }
.ed-stack-card:not(.is-open):hover { box-shadow: 0 -14px 50px -24px rgba(0,0,0,0.5), 0 24px 50px -28px rgba(0,0,0,0.5); }
@keyframes hintPulse {
  0%, 100% { box-shadow: 0 6px 18px -8px rgba(255,225,77,0.5), 0 0 0 0 rgba(255,225,77,0.4); }
  50% { box-shadow: 0 6px 22px -6px rgba(255,225,77,0.7), 0 0 0 8px rgba(255,225,77,0); }
}
.ed-stack-card:not(.is-open) .open-hint { animation: hintPulse 2.4s ease-in-out infinite; }

/* ═══════ CONTACT MODAL ═══════ */
.ed-modal-overlay {
  position: fixed; inset: 0; z-index: 90;
  background: rgba(8,9,15,0.7);
  backdrop-filter: blur(6px);
  opacity: 0; pointer-events: none;
  transition: opacity 0.4s ease;
}
.ed-modal-overlay.open { opacity: 1; pointer-events: auto; }
.ed-modal {
  position: fixed; z-index: 91;
  top: 50%; left: 50%;
  transform: translate(-50%, -46%) scale(0.97);
  width: min(540px, 92vw);
  max-height: 90vh; overflow-y: auto;
  overscroll-behavior: contain;
  background: var(--paper-mark);
  border: 1px solid rgba(255,225,77,0.25);
  border-radius: clamp(20px, 3vw, 32px);
  padding: clamp(32px, 5vw, 56px);
  box-shadow: 0 40px 100px -30px rgba(0,0,0,0.8);
  opacity: 0; pointer-events: none;
  transition: opacity 0.45s ease, transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}
.ed-modal.open { opacity: 1; pointer-events: auto; transform: translate(-50%, -50%) scale(1); }
.ed-modal-close {
  position: absolute; top: 18px; right: 18px;
  width: 40px; height: 40px; border-radius: 50%;
  background: none; border: 1px solid var(--line); color: var(--ink);
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: background 0.3s ease, color 0.3s ease, transform 0.3s ease;
}
.ed-modal-close:hover { background: var(--mark); color: var(--slab-ink); transform: rotate(90deg); }
.ed-modal-title {
  font-weight: 300; font-size: clamp(32px, 5vw, 48px);
  line-height: 1.05; margin-top: 16px; letter-spacing: -0.02em;
}
.ed-modal-sub {
  font-size: 15px; line-height: 1.6; color: var(--ink-soft);
  margin-top: 14px; max-width: 38em;
}
.ed-form { display: flex; flex-direction: column; gap: 14px; margin-top: 28px; }
.ed-form-context {
  display: inline-flex; align-items: center; gap: 9px;
  font-family: var(--mono); font-size: 12px; letter-spacing: 0.06em;
  color: var(--ink-soft);
  margin-top: 18px;
  padding: 9px 15px;
  border: 1px solid rgba(255,225,77,0.3);
  border-radius: 9999px;
  width: fit-content;
}
.ed-form-context strong { color: var(--mark); font-weight: 500; }
.ed-form-context .ec-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--mark);
  box-shadow: 0 0 8px rgba(255,225,77,0.8);
}
.ed-input {
  font-family: var(--sans, 'Inter', sans-serif); font-size: 15px;
  color: var(--ink);
  background: rgba(243,239,227,0.04);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 14px 16px;
  width: 100%;
  transition: border-color 0.3s ease, background 0.3s ease;
}
.ed-input::placeholder { color: rgba(243,239,227,0.4); }
.ed-input:focus {
  outline: none;
  border-color: var(--mark);
  background: rgba(243,239,227,0.07);
}
.ed-textarea { resize: vertical; min-height: 96px; line-height: 1.5; }
.ed-form-send {
  display: inline-flex; align-items: center; justify-content: center; gap: 11px;
  font-family: var(--mono); font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--slab-ink); background: var(--mark);
  border: none; border-radius: 9999px; padding: 16px 28px;
  cursor: pointer; position: relative; overflow: hidden;
  margin-top: 8px;
  transition: transform 0.3s ease;
}
.ed-form-send .mk-bg { position: absolute; inset: 0; background: var(--ink); transform: translateY(101%); transition: transform 0.38s cubic-bezier(0.22,1,0.36,1); }
.ed-form-send:hover:not(:disabled) .mk-bg { transform: translateY(0); }
.ed-form-send:hover:not(:disabled) span, .ed-form-send:hover:not(:disabled) svg { color: var(--mark); }
.ed-form-send span, .ed-form-send svg { position: relative; z-index: 1; transition: color 0.3s ease; }
.ed-form-send:disabled { opacity: 0.6; cursor: wait; }
.ed-form-error { font-size: 13px; color: #ff9d8a; margin-top: 4px; }
.ed-modal-success { text-align: center; padding: 20px 0; }
.ed-modal-success .check {
  width: 64px; height: 64px; border-radius: 50%;
  background: var(--mark); color: var(--slab-ink);
  font-size: 32px; display: flex; align-items: center; justify-content: center;
  margin: 0 auto 22px;
}
.ed-modal-success p { font-size: clamp(20px, 3vw, 26px); font-weight: 300; }

/* ═══════ DETAIL DRAWER ═══════ */
.ed-drawer-overlay {
  position: fixed; inset: 0; z-index: 80;
  background: rgba(27,24,18,0);
  pointer-events: none;
  transition: background 0.5s ease;
}
.ed-drawer-overlay.open { background: rgba(27,24,18,0.55); pointer-events: auto; backdrop-filter: blur(2px); -webkit-backdrop-filter: blur(2px); }
.ed-drawer {
  position: fixed; top: 0; right: 0; bottom: 0; z-index: 81;
  width: min(620px, 94vw);
  background: var(--paper);
  transform: translateX(100%);
  transition: transform 0.6s cubic-bezier(0.76, 0, 0.24, 1);
  display: flex; flex-direction: column;
  box-shadow: -30px 0 80px -40px rgba(27,24,18,0.6);
  will-change: transform;
}
.ed-drawer.open { transform: translateX(0); }
.ed-drawer .bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px clamp(24px, 4vw, 48px);
  border-bottom: 1px solid var(--line);
  flex-shrink: 0;
}
.ed-drawer .bar .meta { font-family: var(--mono); font-size: 10px; letter-spacing: 0.24em; text-transform: uppercase; color: var(--ink-soft); }
.ed-drawer .bar .meta b { color: var(--ink); font-weight: 400; }
.ed-drawer-close {
  width: 42px; height: 42px; border-radius: 50%;
  border: 1px solid var(--line); background: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: var(--ink);
  transition: background 0.3s ease, transform 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}
.ed-drawer-close:hover { background: var(--ink); color: var(--paper); transform: rotate(90deg); border-color: var(--ink); }
.ed-drawer-close:focus-visible { outline: 2px solid var(--mark); outline-offset: 2px; }
.ed-drawer .scroll {
  overflow-y: auto; flex: 1;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  padding: clamp(28px, 4.5vw, 52px) clamp(24px, 4vw, 48px) clamp(40px, 7vh, 80px);
}
.ed-card-panel-inner .d-num {
  font-family: var(--serif); font-style: italic; font-weight: 300;
  font-size: clamp(64px, 12vw, 120px); line-height: 0.8;
  color: var(--mark);
  -webkit-text-stroke: 1px rgba(27,24,18,0.25);
}
.ed-card-panel-inner .d-title {
  font-family: var(--serif); font-weight: 300;
  font-size: clamp(30px, 4.4vw, 46px); line-height: 1.08;
  letter-spacing: -0.02em;
  margin-top: 14px;
}
.ed-card-panel-inner .d-lead {
  font-family: var(--serif); font-style: italic; font-weight: 300;
  font-size: clamp(18px, 2.2vw, 23px); line-height: 1.5;
  color: var(--ink); margin-top: 22px; max-width: 30em;
}
.ed-card-panel-inner .d-section-label {
  font-family: var(--mono); font-size: 10px; letter-spacing: 0.24em;
  text-transform: uppercase; color: var(--ink-soft);
  display: flex; align-items: center; gap: 10px;
  margin: 40px 0 18px;
}
.ed-card-panel-inner .d-section-label::before { content: ''; width: 26px; height: 1px; background: var(--ink); opacity: 0.5; }
.ed-case {
  background: var(--paper-mark); color: var(--ink);
  border: 1px solid var(--line);
  border-left: 3px solid var(--mark);
  border-radius: 18px;
  padding: clamp(22px, 3vw, 32px);
  position: relative; overflow: hidden;
}
.ed-case .metric {
  font-family: var(--serif); font-weight: 300;
  font-size: clamp(34px, 6vw, 56px); line-height: 1;
  color: var(--mark);
}
.ed-case .ct { font-family: var(--serif); font-size: clamp(18px, 2.4vw, 22px); margin-top: 12px; }
.ed-case .cb { font-size: 14px; line-height: 1.7; color: var(--ink-soft); margin-top: 12px; }
.ed-step {
  display: grid; grid-template-columns: auto 1fr; gap: 4px 16px;
  padding: 16px 0; border-bottom: 1px solid var(--line);
}
.ed-step .sn {
  grid-row: span 2;
  font-family: var(--mono); font-size: 12px; color: var(--ink);
  background: var(--mark); width: 26px; height: 26px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 50%; flex-shrink: 0;
}
.ed-step .sh { font-family: var(--serif); font-size: clamp(17px, 2vw, 20px); }
.ed-step .sd { font-size: 13.5px; line-height: 1.6; color: var(--ink-soft); }
.ed-card-panel-inner .d-tools { display: flex; flex-wrap: wrap; gap: 11px; }
.ed-card-panel-inner .d-cta {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  flex-wrap: wrap;
  margin-top: 44px; padding-top: 28px;
  border-top: 1px solid var(--line);
}
.ed-card-panel-inner .d-cta .q { font-family: var(--serif); font-style: italic; font-size: clamp(17px, 2.2vw, 22px); }
.ed-card-panel-inner .d-cta a, .ed-card-panel-inner .d-cta button {
  display: inline-flex; align-items: center; gap: 10px;
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--slab-ink); background: var(--mark);
  border: none; cursor: pointer;
  border-radius: 9999px; padding: 13px 24px; text-decoration: none;
  position: relative; overflow: hidden;
}
.ed-card-panel-inner .d-cta a .mk-bg, .ed-card-panel-inner .d-cta button .mk-bg { position: absolute; inset: 0; background: var(--ink); transform: translateY(101%); transition: transform 0.4s cubic-bezier(0.22,1,0.36,1); }
.ed-card-panel-inner .d-cta a:hover .mk-bg, .ed-card-panel-inner .d-cta button:hover .mk-bg { transform: translateY(0); }
.ed-card-panel-inner .d-cta a span, .ed-card-panel-inner .d-cta a svg, .ed-card-panel-inner .d-cta button span, .ed-card-panel-inner .d-cta button svg { position: relative; z-index: 1; transition: color 0.3s ease; }
.ed-card-panel-inner .d-cta a:hover span, .ed-card-panel-inner .d-cta a:hover svg, .ed-card-panel-inner .d-cta button:hover span, .ed-card-panel-inner .d-cta button:hover svg { color: var(--mark); }

/* ═══════ FEATURED PROJECT ═══════ */
.ed-feat-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(28px, 4vw, 64px);
  align-items: center;
}
@media (min-width: 900px) { .ed-feat-grid { grid-template-columns: 7fr 5fr; } }

/* ═══════ PROOF ═══════ */
.ed-award {
  display: flex; align-items: baseline; justify-content: space-between;
  gap: 16px; flex-wrap: wrap;
  padding: 24px 6px;
  border-bottom: 1px solid var(--line);
  transition: background 0.3s ease, transform 0.3s ease;
}
.ed-award:hover { background: rgba(255,225,77,0.08); transform: translateX(6px); }
.ed-award .t { font-family: var(--serif); font-weight: 400; font-size: clamp(19px, 2.2vw, 26px); }
.ed-award .s { font-size: 13px; color: var(--ink-soft); margin-top: 2px; }
.ed-award .y { font-family: var(--serif); font-style: italic; font-size: 18px; color: var(--teal); }
.ed-logos { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 22px; }
.ed-logo-chip {
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.2em;
  color: var(--ink-soft);
  border: 1px solid var(--line);
  border-radius: 9999px;
  padding: 12px 22px;
  transition: all 0.25s ease;
}
.ed-logo-chip:hover { background: var(--ink); color: var(--paper); border-color: var(--ink); }
.ed-quote {
  /* // TESTIMONIAL PLACEHOLDER — replace text + attribution when available */
  margin-top: 72px;
  max-width: 820px;
  position: relative;
  padding-left: clamp(24px, 4vw, 56px);
}
.ed-quote .qmark {
  position: absolute; left: 0; top: -10px;
  font-family: var(--serif); font-size: clamp(60px, 8vw, 110px);
  line-height: 1; color: var(--mark);
}
.ed-quote p {
  font-family: var(--serif); font-weight: 300; font-style: italic;
  font-size: clamp(22px, 3vw, 34px); line-height: 1.45;
}
.ed-quote .attr { font-family: var(--mono); font-size: 12px; letter-spacing: 0.1em; color: var(--ink-soft); margin-top: 20px; }

/* ═══════ CONTACT ═══════ */
.ed-contact {
  min-height: 80vh;
  display: flex; flex-direction: column; justify-content: center;
  background: var(--paper-deep);
}
.ed-contact-title {
  font-family: var(--serif);
  font-weight: 300;
  font-size: clamp(64px, 14vw, 200px);
  line-height: 1.02;
  letter-spacing: -0.02em;
  position: relative;
  display: inline-block;
}
.ed-circle-svg {
  position: absolute;
  inset: -12% -7%;
  width: 114%; height: 124%;
  pointer-events: none;
  overflow: visible;
}
.ed-circle-svg path {
  fill: none;
  stroke: var(--mark);
  stroke-width: clamp(5px, 0.8vw, 11px);
  stroke-linecap: round;
  opacity: 0.92;
  stroke-dasharray: 1500;
  stroke-dashoffset: 1500;
}
.ed-circle-svg.draw path { animation: circleDraw 1.3s cubic-bezier(0.4, 0, 0.2, 1) 0.5s forwards; }
@keyframes circleDraw { to { stroke-dashoffset: 0; } }
.ed-big-btn {
  display: inline-flex; align-items: center; gap: 14px;
  font-family: var(--mono); font-size: clamp(12px, 1.5vw, 15px);
  letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--paper);
  background: var(--ink);
  border: none; cursor: pointer;
  border-radius: 9999px;
  padding: clamp(18px, 2.4vw, 24px) clamp(30px, 4vw, 48px);
  text-decoration: none;
  position: relative; overflow: hidden;
  box-shadow: 0 14px 30px -16px rgba(27,24,18,0.45);
}
.ed-big-btn .mk-bg {
  position: absolute; inset: 0;
  background: var(--mark);
  transform: translateY(101%);
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.ed-big-btn:hover .mk-bg { transform: translateY(0); }
.ed-big-btn:hover span, .ed-big-btn:hover svg { color: var(--slab-ink); }
.ed-big-btn span, .ed-big-btn svg { position: relative; z-index: 1; transition: color 0.3s ease; }
.ed-contact-link {
  display: flex; align-items: center; gap: 12px;
  font-family: var(--mono); font-size: 13px; letter-spacing: 0.06em;
  color: var(--ink-soft); text-decoration: none;
  padding: 14px 0;
  border-bottom: 1px solid var(--line);
  transition: color 0.2s ease, padding-left 0.3s ease;
}
.ed-contact-link:hover { color: var(--ink); padding-left: 10px; }
.ed-contact-link svg { width: 15px; height: 15px; color: var(--teal); flex-shrink: 0; }

/* ═══════ MEGA FOOTER — the giant name ═══════ */
.ed-mega {
  background: var(--paper-deep);
  color: var(--ink);
  margin: 0 clamp(10px, 2vw, 28px);
  border-radius: clamp(24px, 4vw, 56px) clamp(24px, 4vw, 56px) 0 0;
  padding: clamp(70px, 11vh, 130px) clamp(20px, 5vw, 64px) 0;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--line);
  border-bottom: none;
}
.ed-mega .name {
  font-family: var(--serif);
  font-weight: 300;
  font-size: clamp(44px, 12.5vw, 190px);
  line-height: 0.95;
  letter-spacing: -0.03em;
  text-transform: uppercase;
}
.ed-mega .name .ghosted {
  color: transparent;
  -webkit-text-stroke: 1px var(--mark);
}
.ed-mega .tagrow {
  font-family: var(--mono);
  font-size: 10px; letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--ink-soft);
  margin-top: 28px;
}
.ed-mega-foot {
  display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap;
  padding: 26px 0;
  margin-top: clamp(36px, 6vh, 70px);
  border-top: 1px solid var(--line);
  font-family: var(--mono); font-size: 10px; letter-spacing: 0.16em;
  color: var(--ink-soft); text-transform: uppercase;
}

.ed-main { opacity: 0; transition: opacity 0.6s ease; position: relative; }
.ed-main.visible { opacity: 1; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
  .rv, .lrise, .ed-lang2, .ch { opacity: 1 !important; transform: none !important; }
  .mk { background-size: 100% 100% !important; color: var(--slab-ink) !important; }
  .ink-w { color: inherit !important; }
  .ed-circle-svg path { stroke-dashoffset: 0 !important; }
  .ed-lang-row .bar .fill { transition: none; }
  .ed-hero-photo .reveal { clip-path: inset(0 0 0 0) !important; }
  .ed-hero-photo .reveal img, .ed-hero-photo .reveal .inner-zoom { transform: scale(1) !important; }
}
`;

/* ════════════ helpers ════════════ */

function useInView(threshold = 0.25, once = true) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          if (once) obs.disconnect();
        } else if (!once) setInView(false);
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, once]);
  return [ref, inView];
}

function useCountUp(target, duration, start) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setValue(target); return; }
    let raf, t0 = null;
    const tick = (t) => {
      if (t0 === null) t0 = t;
      const p = Math.min((t - t0) / duration, 1);
      setValue(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return value;
}

/* magnetic pull toward the cursor */
function useMagnetic(strength = 0.25) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    };
    const leave = () => { el.style.transform = "translate(0px, 0px)"; };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, [strength]);
  return ref;
}

function Mark({ children, on, delay = 0 }) {
  return (
    <span className={`mk ${on ? "on" : ""}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </span>
  );
}

/* kinetic char-by-char reveal */
function CharReveal({ text, start, baseDelay = 0, per = 26 }) {
  const chars = Array.from(text);
  return (
    <>
      {chars.map((c, i) => (
        <span className="chm" key={i}>
          <span
            className={`ch ${start ? "in" : ""}`}
            style={{ animationDelay: `${baseDelay + i * per}ms` }}
          >
            {c === " " ? "\u00A0" : c}
          </span>
        </span>
      ))}
    </>
  );
}

function RisingLines({ lines, start, baseDelay = 0 }) {
  return (
    <>
      {lines.map((l, i) => (
        <span className="lmask" key={i}>
          <span
            className={start ? "lrise" : ""}
            style={{ animationDelay: `${baseDelay + i * 130}ms`, opacity: start ? undefined : 0 }}
          >
            {l}
          </span>
        </span>
      ))}
    </>
  );
}

/* scroll-driven word-by-word ink reveal (color-configurable for dark slab) */
function InkReveal({ text, lang, activeColor, faintColor, className = "", style }) {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setProgress(1); return; }
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const p = (vh * 0.85 - r.top) / (vh * 0.5 + r.height * 0.4);
        setProgress(Math.min(Math.max(p, 0), 1));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const words = lang === "ZH" ? Array.from(text) : text.split(" ");
  return (
    <p ref={ref} className={className} style={style}>
      {words.map((w, i) => (
        <span
          key={i}
          className="ink-w"
          style={{ color: i / words.length < progress ? activeColor : faintColor }}
        >
          {w}
          {lang !== "ZH" && i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}

function Stat({ value, suffix, label, start }) {
  const n = useCountUp(value, 1500, start);
  return (
    <div className="ed-stat">
      <div className="num">
        {n}
        <span className="sx">{suffix}</span>
      </div>
      <div className="lbl">{label}</div>
    </div>
  );
}

/* spinning "open to work" badge */
function SpinBadge() {
  return (
    <a className="ed-badge-wrap" href="mailto:davidm.mg13@nycu.edu.tw" aria-label="Open to work — contact David">
      <svg viewBox="0 0 140 140">
        <circle className="disc" cx="70" cy="70" r="68" />
        <defs>
          <path id="badge-circ" d="M 70,70 m -52,0 a 52,52 0 1,1 104,0 a 52,52 0 1,1 -104,0" />
        </defs>
        <text>
          <textPath href="#badge-circ">OPEN TO WORK • DISPONIBLE • 求職中 •&#160;</textPath>
        </text>
      </svg>
      <span className="core">
        <ArrowUpRight strokeWidth={1.5} style={{ width: 20, height: 20 }} />
      </span>
    </a>
  );
}

/* ════════════ main ════════════ */

export default function DavidEditorial() {
  const [lang, setLang] = useState("ES");
  const [showLoader, setShowLoader] = useState(true);
  const [loaderLeaving, setLoaderLeaving] = useState(false);
  const [entered, setEntered] = useState(false);
  const [loadPct, setLoadPct] = useState(0);
  const [greetIdx, setGreetIdx] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [showFloat, setShowFloat] = useState(false);
  const [openCard, setOpenCard] = useState(-1);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactContext, setContactContext] = useState("");
  const [formStatus, setFormStatus] = useState("idle"); // idle | sending | success | error

  const t = copy[lang];
  const langReady = loadPct >= 100;

  /* lock scroll + close drawer on Escape */
  useEffect(() => {
    if (openCard < 0) return;
    const onKey = (e) => { if (e.key === "Escape") setOpenCard(-1); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [openCard]);

  /* refs driven by the single rAF loop (no per-frame React renders) */
  const progressFillRef = useRef(null);
  const threadRef = useRef(null);
  const threadDotRef = useRef(null);
  const photoRef = useRef(null);
  const stripTrkRef = useRef(null);
  const stackRefs = useRef([]);
  const journeyRef = useRef(null);
  const journeyPathRef = useRef(null);
  const journeyPathDrawRef = useRef(null);
  const journeyStopRefs = useRef([]);
  const bigBtnRef = useMagnetic(0.22);

  /* loader counter 0 → 100 */
  useEffect(() => {
    if (!showLoader) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setLoadPct(100); return; }
    let raf, t0 = null;
    const dur = 1700;
    const tick = (ts) => {
      if (t0 === null) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      setLoadPct(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [showLoader]);

  /* greeting cycle — Hola · Hello · 您好 */
  useEffect(() => {
    if (!showLoader) return;
    const id = setInterval(() => setGreetIdx((g) => (g + 1) % GREETINGS.length), 1600);
    return () => clearInterval(id);
  }, [showLoader]);

  const pickLanguage = useCallback((l) => {
    setLang(l);
    setLoaderLeaving(true);
    setTimeout(() => {
      setShowLoader(false);
      requestAnimationFrame(() => setEntered(true));
    }, 1050);
  }, []);

  /* smooth-scroll to a section by id (works with native + Lenis) */
  const scrollToId = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  /* contact form submit — sends via Formspree (no backend needed) */
  const handleContactSubmit = useCallback(async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    setFormStatus("sending");
    try {
      // FORMSPREE — replace YOUR_FORM_ID with your real Formspree form ID.
      const res = await fetch("https://formspree.io/f/xykqwyge", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setFormStatus("success");
        form.reset();
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    }
  }, []);

  /* low-frequency scroll state (booleans only re-render on change) */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      setShowFloat(window.scrollY > window.innerHeight * 0.9);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ───────── LENIS SMOOTH SCROLL + GSAP sync ───────── */
  useEffect(() => {
    if (!entered) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    // On touch devices, native scrolling is already smooth and Lenis can
    // cause sticking — only enable smooth wheel on non-touch (desktop).
    const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    if (isTouch) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
    });

    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [entered]);

  /* ───────── THE CONNECTING THREAD — draws as you scroll ───────── */
  useEffect(() => {
    if (!entered) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const path = threadRef.current;
    const svg = path && path.ownerSVGElement;
    if (!path || !svg) return;

    let st = null;

    const build = () => {
      const h = document.documentElement.scrollHeight;
      const isMobile = window.innerWidth < 760;
      // thread weaves in the right margin; cx measured within the 200px band
      const cx = isMobile ? 150 : 128;         // px (band is 200 wide, anchored right)
      const amp = isMobile ? 14 : 44;          // how far it swings
      svg.setAttribute("viewBox", `0 0 200 ${h}`);
      svg.setAttribute("width", "200");
      svg.setAttribute("height", `${h}`);

      // weave a smooth sine-like path down the full height
      const seg = isMobile ? 420 : 540;        // vertical distance per swing
      let d = `M ${cx} 0`;
      let y = 0;
      let dir = 1;
      while (y < h) {
        const ny = Math.min(y + seg, h);
        const midY = (y + ny) / 2;
        const ctrlX = cx + dir * amp;
        d += ` C ${ctrlX} ${midY}, ${ctrlX} ${midY}, ${cx} ${ny}`;
        y = ny;
        dir *= -1;
      }
      path.setAttribute("d", d);

      const len = path.getTotalLength();
      path.style.strokeDasharray = `${len}`;
      path.style.strokeDashoffset = reduced ? "0" : `${len}`;

      if (st) st.kill();
      if (reduced) return;

      st = ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.1,
        onUpdate: (self) => {
          const drawn = len * self.progress;
          path.style.strokeDashoffset = `${len - drawn}`;
          if (threadDotRef.current) {
            const pt = path.getPointAtLength(drawn);
            threadDotRef.current.setAttribute("cx", pt.x);
            threadDotRef.current.setAttribute("cy", pt.y);
          }
        },
      });
    };

    build();
    const onResize = () => { ScrollTrigger.refresh(); build(); };
    window.addEventListener("resize", onResize);
    // rebuild once more after fonts/images settle
    const t = setTimeout(build, 600);

    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(t);
      if (st) st.kill();
    };
  }, [entered]);

  /* ───────── CARD PEEK — nudge each card once as it enters view ───────── */
  useEffect(() => {
    if (!entered) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const triggers = [];
    stackRefs.current.forEach((card) => {
      if (!card) return;
      const st = ScrollTrigger.create({
        trigger: card,
        start: "top 75%",
        once: true,
        onEnter: () => {
          card.classList.add("peek");
          setTimeout(() => card.classList.remove("peek"), 1000);
        },
      });
      triggers.push(st);
    });
    return () => triggers.forEach((t) => t.kill());
  }, [entered]);

  /* ───────── THE JOURNEY — winding path drawn through the stops ───────── */
  useEffect(() => {
    if (!entered) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wrap = journeyRef.current;
    const linePath = journeyPathRef.current;
    const drawPath = journeyPathDrawRef.current;
    const svg = linePath && linePath.ownerSVGElement;
    if (!wrap || !linePath || !drawPath || !svg) return;

    let drawST = null;
    const revealTriggers = [];

    const build = () => {
      const W = wrap.offsetWidth;
      const H = wrap.offsetHeight;
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      svg.setAttribute("width", `${W}`);
      svg.setAttribute("height", `${H}`);

      // build a smooth path that weaves between each stop's art marker
      const stops = journeyStopRefs.current.filter(Boolean);
      if (!stops.length) return;
      const wrapBox = wrap.getBoundingClientRect();
      const pts = stops.map((stop) => {
        const dot = stop.querySelector(".ed-stop-art");
        const b = dot.getBoundingClientRect();
        return {
          x: b.left - wrapBox.left + b.width / 2,
          y: b.top - wrapBox.top + b.height / 2,
        };
      });

      // catmull-rom-ish smooth curve through the points
      let d = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i];
        const p1 = pts[i + 1];
        const midY = (p0.y + p1.y) / 2;
        d += ` C ${p0.x} ${midY}, ${p1.x} ${midY}, ${p1.x} ${p1.y}`;
      }
      linePath.setAttribute("d", d);
      drawPath.setAttribute("d", d);

      const len = drawPath.getTotalLength();
      drawPath.style.strokeDasharray = `${len}`;
      drawPath.style.strokeDashoffset = reduced ? "0" : `${len}`;

      if (drawST) drawST.kill();
      if (!reduced) {
        drawST = ScrollTrigger.create({
          trigger: wrap,
          start: "top 70%",
          end: "bottom 70%",
          scrub: 1,
          onUpdate: (self) => {
            drawPath.style.strokeDashoffset = `${len * (1 - self.progress)}`;
          },
        });
      }
    };

    // reveal each stop as it enters
    journeyStopRefs.current.forEach((stop) => {
      if (!stop) return;
      if (reduced) { stop.classList.add("in"); return; }
      const st = ScrollTrigger.create({
        trigger: stop,
        start: "top 78%",
        once: true,
        onEnter: () => stop.classList.add("in"),
      });
      revealTriggers.push(st);
    });

    build();
    const onResize = () => { build(); ScrollTrigger.refresh(); };
    window.addEventListener("resize", onResize);
    const t = setTimeout(() => { build(); ScrollTrigger.refresh(); }, 700);

    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(t);
      if (drawST) drawST.kill();
      revealTriggers.forEach((r) => r.kill());
    };
  }, [entered, lang]);
  useEffect(() => {
    if (!entered) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let last = window.scrollY;
    let vel = 0;
    let raf;
    const loop = () => {
      const y = window.scrollY;
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      if (progressFillRef.current) {
        progressFillRef.current.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
      }
      if (!reduced) {
        vel += (y - last - vel) * 0.08;
        if (photoRef.current) {
          photoRef.current.style.transform = `translateY(${Math.min(y * 0.12, 140)}px) scale(1.06)`;
        }
        if (stripTrkRef.current) {
          const skew = Math.max(-5, Math.min(5, vel * 0.18));
          stripTrkRef.current.style.transform = `skewX(${skew}deg)`;
        }
      }
      last = y;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [entered]);

  /* section triggers */
  const [maniRef, maniIn] = useInView(0.35);
  const [mediaRef, mediaIn] = useInView(0.2);
  const [trajRef, trajIn] = useInView(0.08);
  const [eduRef, eduIn] = useInView(0.15);
  const [statsRef, statsIn] = useInView(0.2);
  const [capRef, capIn] = useInView(0.1);
  const [proofRef, proofIn] = useInView(0.12);
  const [contactRef, contactIn] = useInView(0.3);
  const [megaRef, megaIn] = useInView(0.3);

  /* hero title — kinetic lines (blank lines dropped, delays recomputed) */
  const heroLines = [
    { plain: t.heroLine1, accent: t.heroHl1, kind: "em" },
    { plain: t.heroLine2, accent: t.heroHl2, kind: "mk" },
    { plain: t.heroLine3, accent: t.heroHl3, kind: "em" },
  ]
    .filter((l) => (l.plain && l.plain.trim()) || (l.accent && l.accent.trim()))
    .map((l, i) => ({ ...l, base: 350 + i * 330 }));

  return (
    <div className="ed-root">
      <style>{css}</style>

      {/* ═══ INK PRELOADER ═══ */}
      {showLoader && (
        <div className={`ed-loader ${loaderLeaving ? "leaving" : ""}`}>
          <div className="curve" />
          <div className="greet" key={greetIdx}>
            <span>{GREETINGS[greetIdx]}</span>
          </div>
          <div className="sub">{t.splashSub}</div>
          <div className="row">
            {langReady &&
              [["EN", "English"], ["ES", "Español"], ["ZH", "中文"]].map(([code, label], i) => (
                <button
                  key={code}
                  className="ed-lang2 in"
                  style={{ animationDelay: `${i * 110}ms` }}
                  onClick={() => pickLanguage(code)}
                >
                  {label}
                </button>
              ))}
          </div>
          <div className="pct">
            {loadPct}
            <small>%</small>
          </div>
          <div className="pct-note">GUATEMALA → TAIWAN</div>
        </div>
      )}

      {/* ═══ NAV ═══ */}
      {entered && (
        <nav className={`ed-nav ${scrolled ? "scrolled" : ""}`}>
          <div className="brand">David Maldonado</div>
          <div className="right">
            {["EN", "ES", "ZH"].map((l) => (
              <button
                key={l}
                className={`ed-toggle ${lang === l ? "active" : ""}`}
                onClick={() => setLang(l)}
              >
                {l === "ZH" ? "中文" : l}
              </button>
            ))}
            <button className="contact-link" onClick={() => { setContactContext(""); setContactOpen(true); setFormStatus("idle"); }}>
              {t.navContact}
            </button>
          </div>
        </nav>
      )}

      {/* highlighter fills the top edge as the page is read */}
      {entered && (
        <div className="ed-progress" aria-hidden="true">
          <div className="fill" ref={progressFillRef} />
        </div>
      )}

      {/* floating CTA */}
      {entered && (
        <a
          className={`ed-float-cta ${showFloat ? "show" : ""}`}
          href="mailto:davidm.mg13@nycu.edu.tw"
        >
          <span>{t.cta}</span>
          <ArrowUpRight strokeWidth={1.5} style={{ width: 15, height: 15 }} />
        </a>
      )}

      <div className={`ed-main ${entered ? "visible" : ""}`}>
        {/* ═══ THE CONNECTING THREAD — a stitched line drawn as you scroll ═══ */}
        <div className="ed-thread-wrap" aria-hidden="true">
          <svg className="ed-thread" preserveAspectRatio="none">
            <path ref={threadRef} className="thread-path" />
            <circle ref={threadDotRef} className="thread-dot" cx="-10" cy="-10" r="5.5" />
          </svg>
        </div>

        {/* ═══ HERO ═══ */}
        <section className="ed-hero">
          <div className="ed-hero-photo" ref={photoRef}>
            <div className={`reveal ${entered ? "open" : ""}`}>
              {HERO_PHOTO_URL ? (
                <img src={HERO_PHOTO_URL} alt="David Maldonado" />
              ) : (
                <div className="inner-zoom" style={{ background: "radial-gradient(ellipse at 50% 35%, #c9c0ab 0%, #a89e87 55%, #8d8470 100%)" }} />
              )}
              {!HERO_PHOTO_URL && <div className="ph-label">[ FOTO — DAVID ]</div>}
            </div>
            <SpinBadge />
          </div>
          <div className="grain" />

          <div style={{ position: "relative", zIndex: 2, width: "100%" }}>
            <div
              className={`rv ${entered ? "in" : ""}`}
              style={{ animationDelay: "120ms", marginBottom: 18 }}
            >
              <span className="ed-status">
                <span className="pulse" />
                {t.availability}
              </span>
            </div>

            <div
              className={`ed-hero-kicker rv ${entered ? "in" : ""}`}
              style={{ animationDelay: "240ms", marginBottom: 20 }}
            >
              {t.heroKicker}
            </div>

            <h1 className="ed-hero-title">
              {heroLines.map((line, li) => {
                const hasPlain = line.plain && line.plain.trim();
                const hasAccent = line.accent && line.accent.trim();
                const plainText = hasPlain ? (hasAccent ? line.plain + " " : line.plain) : "";
                const accentBase = line.base + (hasPlain ? Array.from(plainText).length * 26 : 0);
                return (
                  <div key={li}>
                    {hasPlain && (
                      <span className="h-plain"><CharReveal text={plainText} start={entered} baseDelay={line.base} /></span>
                    )}
                    {hasAccent && (
                      line.kind === "em" ? (
                        <em className="h-accent">
                          <CharReveal text={line.accent} start={entered} baseDelay={accentBase} />
                        </em>
                      ) : (
                        <span className="h-accent"><Mark on={entered} delay={1700}>
                          <CharReveal text={line.accent} start={entered} baseDelay={accentBase} />
                        </Mark></span>
                      )
                    )}
                  </div>
                );
              })}
            </h1>

            <p
              className={`ed-hero-sub rv ${entered ? "in" : ""}`}
              style={{ marginTop: 26, animationDelay: "1250ms", fontSize: "clamp(16px, 1.8vw, 19px)" }}
            >
              {t.heroSub}
            </p>

            <div
              className={`rv ${entered ? "in" : ""}`}
              style={{ marginTop: 14, animationDelay: "1350ms" }}
            >
              <span className="ed-roles-tag">{t.heroRoles}</span>
            </div>

            <div
              className={`flex items-center gap-4 flex-wrap rv ${entered ? "in" : ""}`}
              style={{ marginTop: 28, animationDelay: "1480ms" }}
            >
              {/* PRIMARY CTA — scrolls to the capabilities ("how am I useful") */}
              <a
                className="ed-hero-cta"
                href="#capabilities"
                onClick={(e) => { e.preventDefault(); scrollToId("capabilities"); }}
              >
                <span className="mk-bg" />
                <span>{t.heroCta}</span>
                <ArrowDown strokeWidth={1.5} style={{ width: 16, height: 16 }} />
              </a>
              {/* // CV BUTTON — set CV_URL above to the hosted PDF */}
              <a className="ed-cv-btn" href={CV_URL || "#"} target={CV_URL ? "_blank" : undefined} rel="noreferrer">
                <Download strokeWidth={1.5} style={{ width: 14, height: 14 }} />
                <span>{t.downloadCV}</span>
              </a>
            </div>
          </div>

          <div className="ed-scroll-cue">
            {t.scroll}
            <ArrowDown strokeWidth={1.5} style={{ width: 14, height: 14 }} />
          </div>
        </section>

        {/* ═══ VELOCITY MARQUEE — tilts with your scroll speed ═══ */}
        <div className="ed-vstrip" aria-hidden="true">
          <div className="trk" ref={stripTrkRef}>
            {[0, 1].map((d) => (
              <div className="mv" key={d}>
                <span className="it">{t.marqueeStrip.repeat(3)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ MANIFESTO ═══ */}
        <section className="ed-section">
          <div ref={maniRef}>
            <span className="ed-label">{t.manifestoLabel}</span>
            <p className="ed-manifesto" style={{ marginTop: 36 }}>
              {t.manifesto.map((seg, i) =>
                seg.hl ? (
                  <Mark key={i} on={maniIn} delay={seg.hl * 450}>{seg.t}</Mark>
                ) : (
                  <React.Fragment key={i}>{seg.t}</React.Fragment>
                )
              )}
            </p>
          </div>
        </section>

        {/* ═══ IN PERSON — video + speaking GIF ═══ */}
        <section className="ed-section ed-rule" style={{ background: "var(--paper-deep)" }}>
          <div ref={mediaRef}>
            <span className="ed-label">{t.mediaLabel}</span>
            <h2 className="ed-serif" style={{ fontSize: "clamp(30px, 4.4vw, 56px)", marginTop: 20, lineHeight: 1.1, maxWidth: 760 }}>
              <RisingLines lines={[t.mediaTitle]} start={mediaIn} baseDelay={120} />
            </h2>

            <div className="ed-media-grid">
              <div className={`rv ${mediaIn ? "in" : ""}`} style={{ animationDelay: "250ms" }}>
                <div className="ed-video-frame">
                  {VIDEO_URL ? (
                    <video
                      key={lang}
                      controls
                      playsInline
                      preload="metadata"
                      poster={VIDEO_POSTER_URL || undefined}
                      crossOrigin="anonymous"
                    >
                      <source src={VIDEO_URL} />
                      {Object.entries(SUBTITLE_URLS).map(([code, url]) =>
                        url ? (
                          <track
                            key={code}
                            kind="subtitles"
                            src={url}
                            srcLang={code === "ZH" ? "zh-TW" : code.toLowerCase()}
                            label={code === "ZH" ? "中文" : code === "ES" ? "Español" : "English"}
                            default={code === lang}
                          />
                        ) : null
                      )}
                    </video>
                  ) : (
                    <div className="ed-video-ph">
                      <div className="play">
                        <Play strokeWidth={1.5} style={{ width: 26, height: 26, marginLeft: 3 }} fill="currentColor" />
                      </div>
                      <div className="lbl">{t.videoPlaceholder}</div>
                    </div>
                  )}
                </div>
                <div className="ed-media-cap">{t.videoCaption}</div>
              </div>

              <div className={`rv ${mediaIn ? "in" : ""}`} style={{ animationDelay: "420ms" }}>
                <div className="ed-gif-card">
                  <div className="tape" />
                  <div className="frame">
                    {SPEAKING_GIF_URL ? (
                      <img src={SPEAKING_GIF_URL} alt="David giving a talk" />
                    ) : (
                      <div className="ph">{t.gifPlaceholder}</div>
                    )}
                  </div>
                </div>
                <div className="ed-media-cap" style={{ marginTop: 22 }}>{t.gifCaption}</div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ STATEMENT SLAB — bold yellow, words turning to ink ═══ */}
        <div className="ed-slab-wrap">
          <section className="ed-slab">
            <div className="slab-grain" />
            <span className="ed-label slab-label">{t.statementLabel}</span>
            <InkReveal
              text={t.statement}
              lang={lang}
              activeColor="var(--slab-ink)"
              faintColor="rgba(17,19,31,0.22)"
              className="ed-statement"
              style={{ marginTop: 36 }}
            />
          </section>
        </div>

        {/* ═══ TRAJECTORY — the winding journey ═══ */}
        <section className="ed-section ed-journey-section">
          <div ref={trajRef}>
            <span className="ed-label">{t.trajLabel}</span>
            <h2 className="ed-serif" style={{ fontSize: "clamp(34px, 5vw, 64px)", marginTop: 20, lineHeight: 1.08 }}>
              <RisingLines lines={[t.trajTitle]} start={trajIn} baseDelay={120} />
            </h2>
            <p
              className={`ed-serif rv ${trajIn ? "in" : ""}`}
              style={{ fontSize: "clamp(18px, 2.2vw, 24px)", fontStyle: "italic", color: "var(--ink-soft)", marginTop: 22, maxWidth: "30em", lineHeight: 1.5, animationDelay: "200ms" }}
            >
              {t.trajIntro}
            </p>

            <div className="ed-journey" ref={journeyRef}>
              {/* the winding dotted path, drawn as you scroll */}
              <svg className="ed-journey-path" preserveAspectRatio="none" aria-hidden="true">
                <path ref={journeyPathRef} className="jp-line" />
                <path ref={journeyPathDrawRef} className="jp-line-draw" />
              </svg>

              {t.timeline.map((row, i) => {
                const side = i % 2 === 0 ? "left" : "right";
                const art = JOURNEY_ART[i];
                return (
                  <div
                    key={row.years + row.org}
                    className={`ed-stop ${side}`}
                    ref={(el) => { journeyStopRefs.current[i] = el; }}
                  >
                    <div className="ed-stop-art">
                      {art
                        ? <img src={art} alt={row.chapter} loading="lazy" />
                        : <span className="ed-stop-num">{String(i + 1).padStart(2, "0")}</span>}
                      <span className="ed-stop-dot" />
                    </div>
                    <div className="ed-stop-card">
                      <span className="ed-stop-years">{row.years}</span>
                      <h3 className="ed-stop-chapter">{row.chapter}</h3>
                      <div className="ed-stop-role">{row.role}</div>
                      <div className="ed-stop-org">{row.org}</div>
                      <p className="ed-stop-desc">{row.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══ EDUCATION + CERTIFICATIONS ═══ */}
        <section className="ed-section ed-rule" style={{ background: "var(--paper-deep)" }}>
          <div ref={eduRef}>
            <div className="ed-edu-grid">
              <div>
                <span className="ed-label">{t.eduLabel}</span>
                <div style={{ marginTop: 30, borderTop: "1px solid var(--line)" }}>
                  {t.education.map((e, i) => (
                    <div
                      key={e.school}
                      className={`ed-edu-row rv ${eduIn ? "in" : ""}`}
                      style={{ animationDelay: `${150 + i * 120}ms` }}
                    >
                      <div>
                        <div className="school">{e.school}</div>
                        <div className="deg">{e.degree}</div>
                        <div className="note">{e.note}</div>
                      </div>
                      <div className="yr">{e.year}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <span className="ed-label">{t.certsLabel}</span>
                <div style={{ marginTop: 30, borderTop: "1px solid var(--line)" }}>
                  {t.certifications.map((c, i) => (
                    <div
                      key={c}
                      className={`ed-cert rv ${eduIn ? "in" : ""}`}
                      style={{ animationDelay: `${300 + i * 120}ms` }}
                    >
                      <Award strokeWidth={1.5} />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ STATS + LANGUAGES ═══ */}
        <section className="ed-section" style={{ paddingTop: "clamp(60px, 9vh, 110px)" }}>
          <div ref={statsRef}>
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <span className="ed-label">{t.statsLabel}</span>
              <span style={{ fontSize: 18, letterSpacing: "0.1em" }}>{t.flagsNote}</span>
            </div>
            <div className="ed-stats">
              {t.stats.map((s) => (
                <Stat key={s.label} value={s.value} suffix={s.suffix} label={s.label} start={statsIn} />
              ))}
            </div>

            <div style={{ marginTop: 64 }}>
              <span className="ed-label">{t.langsLabel}</span>
              <div className="ed-langs">
                {t.languages.map((l, i) => (
                  <div key={l.name} className="ed-lang-row">
                    <div className="top">
                      <span className="nm">{l.name}</span>
                      <span className="lv">{l.level}</span>
                    </div>
                    <div className="bar">
                      <div
                        className="fill"
                        style={{
                          width: statsIn ? `${l.pct}%` : "0%",
                          transitionDelay: `${i * 150}ms`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ CAPABILITIES — sticky stacking cards ═══ */}
        <section id="capabilities" className="ed-section ed-rule" style={{ paddingBottom: "clamp(40px, 6vh, 80px)", scrollMarginTop: "80px" }}>
          <div ref={capRef}>
            <span className="ed-label">{t.capLabel}</span>
            <h2 className="ed-serif" style={{ fontSize: "clamp(34px, 5vw, 64px)", marginTop: 20, lineHeight: 1.08 }}>
              <RisingLines lines={[t.capTitle]} start={capIn} baseDelay={120} />
            </h2>
            <p className="ed-mono" style={{ fontSize: 11, letterSpacing: "0.18em", color: "var(--ink-soft)", textTransform: "uppercase", marginTop: 16 }}>
              {t.capHint}
            </p>

            <div className={`ed-stack ${openCard >= 0 ? "has-open" : ""}`}>
              {t.capabilities.map((c, i) => {
                const isOpen = openCard === i;
                return (
                <div
                  key={c.n}
                  ref={(el) => { stackRefs.current[i] = el; }}
                  className={`ed-stack-card ${i === 1 ? "dark" : i === 2 ? "tint" : ""} ${isOpen ? "is-open" : ""}`}
                  style={{ top: `calc(8vh + ${i * 18}px)` }}
                >
                  {/* clickable header — always visible */}
                  <button
                    className="ed-card-head"
                    onClick={() => setOpenCard(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    aria-controls={`card-panel-${i}`}
                  >
                    <span className={`open-hint ${isOpen ? "active" : ""}`}>
                      {isOpen ? t.capCloseCta : t.capOpenCta}
                      <span className="ic">
                        {isOpen
                          ? <X strokeWidth={1.5} style={{ width: 16, height: 16 }} />
                          : <ArrowDown strokeWidth={1.5} style={{ width: 16, height: 16 }} />}
                      </span>
                    </span>
                    <div>
                      <span className="n">{c.n}</span>
                      <h3>{c.title}</h3>
                      <p>{c.body}</p>
                    </div>
                    <div className="flex flex-wrap gap-2" style={{ position: "relative", zIndex: 1 }}>
                      {c.tags.map((tag) => (
                        <span key={tag} className="ed-tag">{tag}</span>
                      ))}
                    </div>
                  </button>

                  {/* expandable detail — revealed in place */}
                  <div
                    id={`card-panel-${i}`}
                    className={`ed-card-panel ${isOpen ? "open" : ""}`}
                  >
                    <div className="ed-card-panel-inner">
                      <p className="d-lead">{c.lead}</p>

                      <div className="d-section-label">{t.capCaseLabel}</div>
                      <div className="ed-case">
                        <div className="metric">{c.caseMetric}</div>
                        <div className="ct">{c.caseTitle}</div>
                        <div className="cb">{c.caseBody}</div>
                      </div>

                      <div className="d-section-label">{t.capProcessLabel}</div>
                      <div>
                        {c.process.map((s, j) => (
                          <div className="ed-step" key={j}>
                            <span className="sn">{j + 1}</span>
                            <div className="sh">{s.h}</div>
                            <div className="sd">{s.d}</div>
                          </div>
                        ))}
                      </div>

                      <div className="d-section-label">{t.capToolsLabel}</div>
                      <div className="d-tools">
                        {c.tools.map((tool) => (
                          <span key={tool} className="ed-tag">{tool}</span>
                        ))}
                      </div>

                      <div className="d-cta">
                        <span className="q">{t.capCtaLabel}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setContactContext(c.title);
                            setFormStatus("idle");
                            setContactOpen(true);
                          }}
                        >
                          <span className="mk-bg" />
                          <span>{t.cta}</span>
                          <ArrowRight strokeWidth={1.5} style={{ width: 15, height: 15 }} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="ghost">{c.n}</div>
                </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══ PROOF ═══ */}
        <section className="ed-section ed-rule" style={{ background: "var(--paper-deep)" }}>
          <div ref={proofRef}>
            <span className="ed-label">{t.proofLabel}</span>
            <div style={{ marginTop: 36, borderTop: "1px solid var(--line)" }}>
              {t.recognition.map((r, i) => (
                <div
                  key={r.title}
                  className={`ed-award rv ${proofIn ? "in" : ""}`}
                  style={{ animationDelay: `${150 + i * 120}ms` }}
                >
                  <div>
                    <div className="t">{r.title}</div>
                    <div className="s">{r.sub}</div>
                  </div>
                  <div className="y">{r.year}</div>
                </div>
              ))}
            </div>

            <div className="ed-mono" style={{ fontSize: 10, letterSpacing: "0.25em", color: "var(--ink-soft)", marginTop: 56, textTransform: "uppercase" }}>
              {t.workedWith}
            </div>
            {/* // Replace text chips with <img> logo assets when available */}
            <div className="ed-logos">
              {companies.map((c) => (
                <span key={c} className="ed-logo-chip">{c}</span>
              ))}
            </div>

            <div className="ed-quote">
              <span className="qmark">"</span>
              <p>{t.testimonialPlaceholder}</p>
              <div className="attr">{t.testimonialAttribution}</div>
            </div>
          </div>
        </section>

        {/* ═══ CONTACT ═══ */}
        <section className="ed-section ed-contact ed-rule">
          <div ref={contactRef}>
            <span className="ed-label">{t.contactLabel}</span>
            <div style={{ marginTop: 30 }}>
              <h2 className="ed-contact-title">
                <RisingLines lines={[t.contactTitle]} start={contactIn} baseDelay={100} />
                <svg
                  className={`ed-circle-svg ${contactIn ? "draw" : ""}`}
                  viewBox="0 0 600 220"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path d="M 310 18 C 120 8, 18 52, 22 112 C 26 178, 200 208, 330 202 C 470 196, 582 162, 576 100 C 570 42, 430 10, 290 22" />
                </svg>
              </h2>
            </div>
            <p
              className={`rv ${contactIn ? "in" : ""}`}
              style={{ fontSize: 16, color: "var(--ink-soft)", maxWidth: 500, marginTop: 36, lineHeight: 1.7, animationDelay: "400ms" }}
            >
              {t.contactSub}
            </p>

            <div
              className={`flex flex-col md:flex-row md:items-center gap-8 rv ${contactIn ? "in" : ""}`}
              style={{ marginTop: 44, animationDelay: "550ms" }}
            >
              <div className="flex flex-col gap-4" style={{ alignItems: "flex-start" }}>
                <button
                  ref={bigBtnRef}
                  type="button"
                  className="ed-big-btn magnet"
                  onClick={() => { setContactContext(""); setFormStatus("idle"); setContactOpen(true); }}
                >
                  <span className="mk-bg" />
                  <span>{t.cta}</span>
                  <ArrowUpRight strokeWidth={1.5} style={{ width: 17, height: 17 }} />
                </button>
                {/* // CV BUTTON — set CV_URL above */}
                <a className="ed-cv-btn" href={CV_URL || "#"} target={CV_URL ? "_blank" : undefined} rel="noreferrer">
                  <Download strokeWidth={1.5} style={{ width: 14, height: 14 }} />
                  <span>{t.downloadCV}</span>
                </a>
              </div>
              <div style={{ flex: 1, maxWidth: 440 }}>
                <a className="ed-contact-link" href="https://davidmr.me" target="_blank" rel="noreferrer">
                  <Globe strokeWidth={1.5} /> davidmr.me
                </a>
                <a className="ed-contact-link" href="mailto:davidm.mg13@nycu.edu.tw">
                  <Mail strokeWidth={1.5} /> davidm.mg13@nycu.edu.tw
                </a>
                <a className="ed-contact-link" href="https://linkedin.com/in/david-ricardo-maldonado" target="_blank" rel="noreferrer">
                  <Linkedin strokeWidth={1.5} /> linkedin.com/in/david-ricardo-maldonado
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ MEGA FOOTER — the name, giant ═══ */}
        <div className="ed-mega" ref={megaRef}>
          <h2 className="ed-serif name" style={{ margin: 0 }}>
            <RisingLines lines={["DAVID"]} start={megaIn} baseDelay={100} />
            <span className="lmask">
              <span
                className={megaIn ? "lrise" : ""}
                style={{ animationDelay: "240ms", opacity: megaIn ? undefined : 0 }}
              >
                <span className="ghosted">MALDONADO</span>
              </span>
            </span>
          </h2>
          <div className="tagrow">Hola · Hello · 您好 — Guatemala → Taiwán → Anywhere</div>
          <div className="ed-mega-foot">
            <span>© David Maldonado</span>
            <span>{t.footer}</span>
          </div>
        </div>
      </div>

      {/* ═══ CONTACT MODAL ═══ */}
      <div
        className={`ed-modal-overlay ${contactOpen ? "open" : ""}`}
        onClick={() => setContactOpen(false)}
        aria-hidden={!contactOpen}
      />
      <div
        className={`ed-modal ${contactOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={t.formTitle}
        data-lenis-prevent
      >
        <button className="ed-modal-close" onClick={() => setContactOpen(false)} aria-label={t.formClose}>
          <X strokeWidth={1.5} style={{ width: 20, height: 20 }} />
        </button>
        {formStatus === "success" ? (
          <div className="ed-modal-success">
            <div className="check">✓</div>
            <p className="ed-serif">{t.formSuccess}</p>
            <a className="ed-contact-link" href="mailto:davidm.mg13@nycu.edu.tw" style={{ justifyContent: "center", marginTop: 8 }}>
              <Mail strokeWidth={1.5} /> davidm.mg13@nycu.edu.tw
            </a>
          </div>
        ) : (
          <>
            <span className="ed-label">{t.navContact}</span>
            <h2 className="ed-modal-title ed-serif">{t.formTitle}</h2>
            <p className="ed-modal-sub">{t.formSubtitle}</p>
            {contactContext && (
              <div className="ed-form-context">
                <span className="ec-dot" />
                {t.formRe} <strong>{contactContext}</strong>
              </div>
            )}
            <form className="ed-form" onSubmit={handleContactSubmit}>
              {contactContext && <input type="hidden" name="regarding" value={contactContext} />}
              <input className="ed-input" type="text" name="name" placeholder={t.formName} required />
              <input className="ed-input" type="email" name="email" placeholder={t.formEmail} required />
              <textarea
                className="ed-input ed-textarea"
                name="message"
                placeholder={t.formMessage}
                rows={4}
                required
                defaultValue={contactContext ? `${t.formRePrefill} "${contactContext}".\n\n` : ""}
                key={contactContext}
              />
              <button className="ed-form-send" type="submit" disabled={formStatus === "sending"}>
                <span className="mk-bg" />
                <span>{formStatus === "sending" ? t.formSending : t.formSend}</span>
                <ArrowRight strokeWidth={1.5} style={{ width: 15, height: 15 }} />
              </button>
              {formStatus === "error" && <p className="ed-form-error">{t.formError}</p>}
            </form>
          </>
        )}
      </div>

    </div>
  );
}
