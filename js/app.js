// Cirque Pardi - render de páginas a partir de /data/*.json y /i18n/*.json.
// Requiere servidor HTTP (fetch): `python3 -m http.server` en la raíz.

const LANGS = ["es", "fr"];
// Sin backend todavía: el formulario abre el correo. Rellenar cuando se conozca la dirección.
const CONTACT_EMAIL = "";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const load = (path) => fetch(path).then((r) => r.json());
const slugify = (s) => String(s ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const showMeta = (s) => [s.duration, L(s.format), L(s.audience), s.year].filter(Boolean).join(" · ");

let lang = "es";
try { const s = localStorage.getItem("lang"); if (LANGS.includes(s)) lang = s; } catch {}

let dict, contacts;
// Campo bilingüe {es, fr} o valor simple; si falta fr, cae a es.
const L = (v) => (v && typeof v === "object" && !Array.isArray(v) ? v[lang] ?? v.es ?? "" : v ?? "");
const t = (key) => key.split(".").reduce((o, k) => o?.[k], dict) ?? key;

const locale = () => (lang === "fr" ? "fr-FR" : "es-ES");
function fmtDate(iso, opts = { day: "numeric", month: "short" }) {
  return new Date(iso + "T12:00:00").toLocaleDateString(locale(), opts);
}
function agendaDate(e) {
  if (!e.start) return L(e.dateLabel);
  const sameDay = !e.end || e.end === e.start;
  if (sameDay) return fmtDate(e.start, { day: "numeric", month: "short", year: "numeric" });
  const a = new Date(e.start + "T12:00:00"), b = new Date(e.end + "T12:00:00");
  const sameMonth = a.getMonth() === b.getMonth();
  return sameMonth
    ? `${a.getDate()}–${fmtDate(e.end, { day: "numeric", month: "short", year: "numeric" })}`
    : `${fmtDate(e.start)} – ${fmtDate(e.end, { day: "numeric", month: "short", year: "numeric" })}`;
}

const img = (src, h) => `<div class="img" ${h ? `style="height:${h}px"` : ""}>${src ? `<img src="${esc(src)}" alt="">` : "Image"}</div>`;
const showUrl = (slug) => `espectaculo.html?slug=${encodeURIComponent(slug)}`;

/* Componentes */
function header() {
  const page = document.body.dataset.page;
  const cur = (p) => (page === p || (p === "shows" && page === "show") ? ' aria-current="page"' : "");
  return `<header class="site-header">
    <a class="logo" href="index.html">CIRQUE PARDI!</a>
    <nav class="site-nav">
      <a href="espectaculos.html"${cur("shows")}>${t("nav.shows")}</a>
      <a href="agenda.html"${cur("agenda")}>${t("nav.agenda")}</a>
      <a href="noticias.html"${cur("news")}>${t("nav.news")}</a>
      <a href="contacto.html"${cur("contact")}>${t("nav.contact")}</a>
      <span class="lang">${LANGS.map((l) => `<button type="button" data-lang="${l}" aria-pressed="${l === lang}">${l.toUpperCase()}</button>`).join("")}</span>
    </nav></header>`;
}

function footer() {
  const c = contacts.company;
  return `<footer class="site-footer">
    <div class="footer-cols">
      <div><h3>${esc(c.name)}</h3><p>${esc(c.address)}</p><p class="muted">${t("footer.tagline")}</p></div>
      <div><h3>${t("footer.nav")}</h3><ul>
        <li><a href="espectaculos.html">${t("nav.shows")}</a></li><li><a href="agenda.html">${t("nav.agenda")}</a></li>
        <li><a href="noticias.html">${t("nav.news")}</a></li><li><a href="contacto.html">${t("nav.contact")}</a></li></ul></div>
      <div><h3>${t("footer.newsletter")}</h3>
        <form class="newsletter" action="contacto.html" method="get">
          <input type="email" name="newsletter" required placeholder="${t("footer.emailPh")}" aria-label="Email">
          <button class="btn btn-primary" type="submit">${t("btn.subscribe")}</button></form></div>
    </div>
    <p class="small muted legal">SIRET ${c.siret} · APE ${c.ape} · ${t("footer.licences")} ${c.licences} · <a href="contacto.html">${t("footer.legal")}</a></p>
  </footer>`;
}

const bookBtn = (cls = "btn-primary") => `<a class="btn ${cls}" href="${esc(contacts.company.ticketUrl)}" target="_blank" rel="noopener">${t("btn.book")}</a>`;
const pageHead = (k) => `<div class="container"><div class="page-head"><h1>${t(k + ".h1")}</h1><p class="lead muted">${t(k + ".intro")}</p></div></div>`;

const showCard = (s) => `<article class="show-card">${img(s.image, 260)}<h3>${esc(s.title)}</h3>
  <p class="small muted">${esc(showMeta(s))}</p><p>${esc(L(s.summary))}</p>
  <a class="btn btn-secondary" href="${showUrl(s.slug)}">${t("btn.more")}</a></article>`;

const newsCard = (n, i) => `<article class="news-card"><p class="small muted">${fmtDate(n.date, { day: "numeric", month: "long", year: "numeric" })}</p>
  <h3>${esc(L(n.title))}</h3><p>${esc(L(n.excerpt))}</p><a class="more" href="noticias.html#n${i}" id="n${i}">${t("btn.read")}</a></article>`;

function agendaRow(e, shows) {
  const s = shows.find((x) => x.slug === slugify(e.show));
  return `<div class="agenda-row"><div class="agenda-date">${esc(agendaDate(e))}</div>
    <div class="agenda-info"><a class="agenda-title" href="${showUrl(slugify(e.show))}">${esc(s?.title ?? e.show)}</a><span class="muted">${esc(L(e.place))}</span></div>
    ${bookBtn()}</div>`;
}

/* Páginas */
const pages = {
  home: () => `<section class="hero"><h1 class="display">${t("home.title")}</h1></section>`,

  shows: ({ shows }) => `${pageHead("shows")}<section class="container"><h2>${t("shows.h2")}</h2>
    <div class="grid-3" style="margin-top:var(--space-xl)">${shows.map(showCard).join("")}</div></section>`,

  show: ({ shows, agenda }) => {
    const slug = new URLSearchParams(location.search).get("slug");
    const s = shows.find((x) => x.slug === slug);
    if (!s) return `<div class="container"><div class="page-head"><h1>${t("show.notFound")}</h1><a class="btn btn-secondary" href="espectaculos.html">${t("nav.shows")}</a></div></div>`;
    document.title = `${s.title} · Cirque Pardi`;
    const dates = agenda.filter((e) => slugify(e.show) === s.slug).slice(0, 2);
    const meta = showMeta(s);
    const list = (arr) => (arr.length ? `<ul class="chips">${arr.map((d) => `<li class="chip">${esc(d)}</li>`).join("")}</ul>` : "");
    const tech = L(s.tech) || [];
    const cast = [...(s.cast ?? []), ...(L(s.crew) || [])];
    return `<div class="container">
      <div class="show-meta"><h1>${esc(s.title)}</h1><p class="lead">${esc(L(s.hook))}</p><p class="small muted">${esc(meta)}</p>
        <div class="btn-row">${bookBtn()}<a class="btn btn-secondary" href="#dates">${t("btn.dates")}</a></div></div>
      ${img(s.image).replace('class="img"', 'class="img show-hero"')}
      <div class="section show-cols">
        <div class="stack"><h2>${t("show.synopsis")}</h2><p class="lead">${esc(L(s.synopsis))}</p>
          ${(L(s.disciplines) || []).length ? `<h3 style="margin-top:var(--space-lg)">${t("show.disciplines")}</h3>${list(L(s.disciplines))}` : ""}</div>
        <aside class="tech-card"><h3>${t("show.tech")}</h3><dl>${tech.map((r) => `<div><dt>${esc(r.label)}</dt><dd>${esc(r.value)}</dd></div>`).join("")}</dl></aside>
      </div>
      ${cast.length ? `<section class="section stack"><h2>${t("show.cast")}</h2><ul class="stack">${cast.map((c) => `<li>${esc(c)}</li>`).join("")}</ul></section>` : ""}
      <section class="section" id="dates"><h2>${t("show.dates")}</h2>
        ${dates.length ? dates.map((e) => agendaRow(e, shows)).join("") : `<p class="muted" style="margin-top:var(--space-md)">${t("show.noDates")}</p>`}</section>
    </div>`;
  },

  agenda: ({ shows, agenda }) => {
    const years = [...new Set(agenda.map((e) => e.year))].sort((a, b) => b - a);
    return `${pageHead("agenda")}<div class="container">${years.map((y) => `<section class="agenda-year"><h2>${y}</h2>
      ${agenda.filter((e) => e.year === y).sort((a, b) => b.sort.localeCompare(a.sort)).map((e) => agendaRow(e, shows)).join("")}</section>`).join("")}</div>`;
  },

  news: ({ news }) => `${pageHead("news")}<section class="container"><div class="grid-3">${news.map(newsCard).join("")}</div></section>`,

  contact: () => {
    const p = new URLSearchParams(location.search);
    const groups = contacts.groups.map((g) => `<div class="contact-group"><h3>${esc(L(g.title))}</h3>
      ${g.people.map((x) => `<p>${esc(x.name)} <span class="muted">· ${esc(L(x.role))}</span></p>`).join("")}<p class="small muted">${t("contact.phone")}</p></div>`).join("");
    const field = (id, label, type = "text", val = "") => `<div class="field"><label for="${id}">${label}</label>${type === "textarea" ? `<textarea id="${id}" name="${id}" required></textarea>` : `<input id="${id}" name="${id}" type="${type}" value="${esc(val)}" required>`}</div>`;
    return `${pageHead("contact")}<div class="container contact-cols">
      <div class="contact-groups">${groups}</div>
      <form class="stack" id="contact-form">${field("name", t("contact.name"))}${field("email", t("contact.email"), "email", p.get("newsletter") || "")}
        ${field("subject", t("contact.subject"))}${field("message", t("contact.message"), "textarea")}
        <div><button class="btn btn-primary" type="submit">${t("btn.send")}</button></div><p class="form-note" id="form-note" hidden>${t("contact.sent")}</p></form></div>`;
  },
};

function bindContactForm() {
  const f = document.getElementById("contact-form");
  if (!f) return;
  f.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const d = Object.fromEntries(new FormData(f));
    const body = `${d.message}\n\n— ${d.name} (${d.email})`;
    document.getElementById("form-note").hidden = false;
    location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(d.subject)}&body=${encodeURIComponent(body)}`;
  });
}

async function render() {
  document.documentElement.lang = lang;
  const [d, c, rawShows, rawAgenda, rawNews] = await Promise.all([
    load(`i18n/${lang}.json`), load("data/contacts.json"), load("data/shows.json"), load("data/agenda.json"), load("data/news.json"),
  ]);
  dict = d; contacts = c;
  // Los JSON los edita el CMS: slug, año y orden se derivan aquí.
  const shows = (rawShows.items ?? []).map((s) => ({ ...s, slug: slugify(s.title) }));
  const agenda = (rawAgenda.items ?? []).map((e) => {
    const year = e.start ? +e.start.slice(0, 4) : +e.year || 0;
    return { ...e, year, sort: e.start ?? `${year}-01-01` };
  });
  const news = [...(rawNews.items ?? [])].sort((a, b) => b.date.localeCompare(a.date));
  document.title = "Cirque Pardi";
  document.getElementById("site-header").innerHTML = header();
  document.getElementById("main").innerHTML = pages[document.body.dataset.page]({ shows, agenda, news });
  document.getElementById("site-footer").innerHTML = footer();
  document.querySelectorAll("[data-lang]").forEach((b) =>
    b.addEventListener("click", () => { lang = b.dataset.lang; try { localStorage.setItem("lang", lang); } catch {} render(); }));
  bindContactForm();
}

render();
