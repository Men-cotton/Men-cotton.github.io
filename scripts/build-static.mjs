import { createHash } from "node:crypto";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const clientDir = path.join(dist, "client");
const serverDir = path.join(dist, "server");
const portraitFile = "profile-82d807edf2.webp";
const portraitRoute = `/_media/${portraitFile}`;
const siteUrl = "https://akimasa-watanuki.mencotton.chatgpt.site";

if (path.dirname(dist) !== root || path.basename(dist) !== "dist") {
  throw new Error(`Refusing to replace unexpected build directory: ${dist}`);
}

const copy = {
  en: {
    nav: ["Research", "Engineering", "Contact"],
    navLabel: "Page navigation",
    language: "日本語",
    languageHref: "/ja",
    languageCode: "ja",
    facts: ["Affiliation", "Lab", "Program"],
    profileLinks: "External profiles",
    sections: ["Research output", "Software and engineering", "Research interests", "Experience", "Recognition", "Interests", "Contact"],
    portrait: "Portrait of Akimasa Watanuki",
    title: "Akimasa Watanuki — High-Performance Computing and Compilers",
    description: "Portfolio of Akimasa Watanuki, a researcher working on high-performance computing and compiler infrastructure.",
    openGraphLocale: "en_US",
    canonical: `${siteUrl}/`,
  },
  ja: {
    nav: ["研究実績", "開発実績", "連絡先"],
    navLabel: "ページ内ナビゲーション",
    language: "English",
    languageHref: "/",
    languageCode: "en",
    facts: ["所属", "研究室", "学年"],
    profileLinks: "外部プロフィール",
    sections: ["研究実績", "開発実績", "研究の関心", "経歴", "受賞・成績", "関心", "連絡先"],
    portrait: "綿貫晃雅のポートレート",
    title: "綿貫晃雅 — 高性能計算・コンパイラ",
    description: "高性能計算とコンパイラを研究する綿貫晃雅のポートフォリオ。",
    openGraphLocale: "ja_JP",
    canonical: `${siteUrl}/ja`,
  },
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function parseProfile(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error("Profile frontmatter is missing.");

  const frontmatter = Object.fromEntries(
    match[1].split(/\r?\n/).filter(Boolean).map((line) => {
      const separator = line.indexOf(":");
      if (separator < 0) throw new Error(`Invalid frontmatter line: ${line}`);
      return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
    }),
  );

  const sections = new Map();
  for (const part of match[2].split(/^## /m).slice(1)) {
    const [heading, ...lines] = part.split(/\r?\n/);
    sections.set(heading.trim(), lines.join("\n").trim());
  }
  return { frontmatter, sections };
}

function parseEntries(section = "") {
  return section.split(/^### /m).slice(1).map((block) => {
    const [title, ...lines] = block.split(/\r?\n/).filter(Boolean);
    const linkLines = lines.filter((line) => /^\[.+\]\(https?:\/\/.+\)$/.test(line));
    return {
      title: title.trim(),
      description: lines.filter((line) => !linkLines.includes(line)).join(" ").trim(),
      links: linkLines.flatMap((line) => {
        const match = line.match(/^\[(.+)\]\((https?:\/\/.+)\)$/);
        return match ? [{ label: match[1], href: match[2] }] : [];
      }),
    };
  });
}

function parseBullets(section = "") {
  return section.split(/\r?\n/).filter((line) => line.startsWith("- ")).map((line) => {
    const value = line.slice(2).trim();
    const match = value.match(/^\[(.+)\]\((https?:\/\/.+)\)$/);
    return match ? { label: match[1], link: match[2] } : { label: value };
  });
}

function externalLink(href, label) {
  return `<a href="${escapeHtml(href)}" target="_blank" rel="noreferrer">${escapeHtml(label)}<span aria-hidden="true"> ↗</span></a>`;
}

function renderWorkEntries(entries) {
  return entries.map((item) => `
          <article class="entry work-entry">
            <div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p></div>
            ${item.links.length ? `<div class="entry-links">${item.links.map((link) => externalLink(link.href, link.label)).join("")}</div>` : ""}
          </article>`).join("");
}

function renderExperience(entries) {
  return entries.map((item) => `
          <article class="entry">
            <h3>${escapeHtml(item.title)}</h3>
            <div class="experience-detail"><p>${escapeHtml(item.description)}</p>${item.links.map((link) => externalLink(link.href, link.label)).join("")}</div>
          </article>`).join("");
}

function renderBullets(items) {
  return items.map((item) => `<li>${item.link ? externalLink(item.link, item.label) : escapeHtml(item.label)}</li>`).join("");
}

function renderPage(markdown, locale, css) {
  const labels = copy[locale];
  const { frontmatter, sections } = parseProfile(markdown);
  const researchOutput = parseEntries(sections.get(labels.sections[0]));
  const developmentWork = parseEntries(sections.get(labels.sections[1]));
  const researchInterests = parseEntries(sections.get(labels.sections[2]));
  const experience = parseEntries(sections.get(labels.sections[3]));
  const achievements = parseBullets(sections.get(labels.sections[4]));
  const interests = parseBullets(sections.get(labels.sections[5]));
  const alternateUrl = locale === "en" ? `${siteUrl}/ja` : `${siteUrl}/`;

  return `<!doctype html>
<html lang="${locale}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(labels.title)}</title>
  <meta name="description" content="${escapeHtml(labels.description)}">
  <link rel="canonical" href="${labels.canonical}">
  <link rel="alternate" hreflang="${labels.languageCode}" href="${alternateUrl}">
  <link rel="preload" href="${portraitRoute}" as="image" type="image/webp" fetchpriority="high">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="${labels.openGraphLocale}">
  <meta property="og:title" content="${escapeHtml(labels.title)}">
  <meta property="og:description" content="${escapeHtml(labels.description)}">
  <meta property="og:url" content="${labels.canonical}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escapeHtml(labels.title)}">
  <meta name="twitter:description" content="${escapeHtml(labels.description)}">
  <style>${css}</style>
</head>
<body>
  <main>
    <header class="site-header">
      <a class="site-name" href="#top">Akimasa Watanuki</a>
      <nav aria-label="${escapeHtml(labels.navLabel)}">
        <a href="#research">${escapeHtml(labels.nav[0])}</a>
        <a href="#development">${escapeHtml(labels.nav[1])}</a>
        <a href="#contact">${escapeHtml(labels.nav[2])}</a>
        <a class="language-switch" href="${labels.languageHref}" hreflang="${labels.languageCode}">${escapeHtml(labels.language)}</a>
      </nav>
    </header>

    <section class="profile" id="top">
      <img src="${portraitRoute}" alt="${escapeHtml(labels.portrait)}" width="180" height="180" decoding="async" fetchpriority="high">
      <div>
        <p class="role">${escapeHtml(frontmatter.role)}</p>
        <h1>${escapeHtml(frontmatter.name)}</h1>
        <p class="name-en">${escapeHtml(frontmatter.name_secondary)}</p>
        <p class="summary">${escapeHtml(frontmatter.summary)}</p>
        <p class="keywords"><span>${escapeHtml(frontmatter.keywords_label)}</span>${escapeHtml(frontmatter.keywords)}</p>
        <dl class="facts">
          <div><dt>${escapeHtml(labels.facts[0])}</dt><dd>${escapeHtml(frontmatter.affiliation)}</dd></div>
          <div><dt>${escapeHtml(labels.facts[1])}</dt><dd>${externalLink(frontmatter.lab_url, frontmatter.lab)}${locale === "ja" ? "（主宰：" : " — led by "}${externalLink(frontmatter.advisor_url, frontmatter.advisor)}${locale === "ja" ? "）" : ""}</dd></div>
          <div><dt>${escapeHtml(labels.facts[2])}</dt><dd>${escapeHtml(frontmatter.year)}</dd></div>
        </dl>
        <div class="profile-links" aria-label="${escapeHtml(labels.profileLinks)}">
          ${externalLink(frontmatter.github, "GitHub")}${externalLink(frontmatter.linkedin, "LinkedIn")}${externalLink(frontmatter.atcoder, "AtCoder")}${externalLink(frontmatter.x, "X")}
        </div>
      </div>
    </section>

    <section class="section" id="research">
      <h2>${escapeHtml(labels.sections[0])}</h2>
      <div class="entry-list">${renderWorkEntries(researchOutput)}
      </div>
    </section>

    <section class="section" id="development">
      <h2>${escapeHtml(labels.sections[1])}</h2>
      <div class="entry-list">${renderWorkEntries(developmentWork)}
      </div>
    </section>

    <section class="section research-interests" id="research-interests">
      <h2>${escapeHtml(labels.sections[2])}</h2>
      <div class="entry-list">${renderWorkEntries(researchInterests)}
      </div>
    </section>

    <section class="section" id="experience">
      <h2>${escapeHtml(labels.sections[3])}</h2>
      <div class="entry-list">${renderExperience(experience)}
      </div>
    </section>

    <section class="section two-column">
      <div class="recognition"><h2>${escapeHtml(labels.sections[4])}</h2><ul>${renderBullets(achievements)}</ul></div>
      <div><h2>${escapeHtml(labels.sections[5])}</h2><ul>${renderBullets(interests)}</ul></div>
    </section>

    <section class="section contact" id="contact">
      <h2>${escapeHtml(labels.sections[6])}</h2>
      <p>${escapeHtml(frontmatter.contact_before)}${locale === "en" ? " " : ""}<a class="email" href="mailto:${escapeHtml(frontmatter.email)}">${escapeHtml(frontmatter.email)}</a>${escapeHtml(frontmatter.contact_after)}</p>
      <p>${escapeHtml(frontmatter.casual_contact)} ${externalLink(frontmatter.x, frontmatter.casual_contact_link)}</p>
    </section>

    <footer><span>© 2026 Akimasa Watanuki</span><span>Tokyo, Japan</span></footer>
  </main>
</body>
</html>
`;
}

const [englishMarkdown, japaneseMarkdown, css, portrait] = await Promise.all([
  readFile(path.join(root, "content", "profile.en.md"), "utf8"),
  readFile(path.join(root, "content", "profile.md"), "utf8"),
  readFile(path.join(root, "styles.css"), "utf8"),
  readFile(path.join(root, "public", portraitFile)),
]);

const portraitHash = createHash("sha256").update(portrait).digest("hex");
if (!portraitHash.startsWith("82d807edf2")) {
  throw new Error(`Portrait content no longer matches its versioned filename: ${portraitHash}`);
}

await rm(dist, { recursive: true, force: true });
await Promise.all([mkdir(clientDir, { recursive: true }), mkdir(serverDir, { recursive: true })]);

const headers = `# The portrait URL contains its content hash.\n/${portraitFile}\n  Cache-Control: public, max-age=31536000, immutable\n`;
const notFound = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found</title><style>${css}</style><body><main><section class="profile"><div><h1>Page not found</h1><p><a href="/">Return home</a></p></div></section></main></body></html>\n`;
const wrangler = {
  name: "akimasa-watanuki-portfolio",
  compatibility_date: "2026-05-15",
  main: "index.js",
  no_bundle: true,
  rules: [{ type: "ESModule", globs: ["**/*.js", "**/*.mjs"] }],
  assets: {
    binding: "ASSETS",
    directory: "../client",
    html_handling: "auto-trailing-slash",
    not_found_handling: "404-page",
    run_worker_first: ["/_media/*"],
  },
};

await Promise.all([
  writeFile(path.join(clientDir, "index.html"), renderPage(englishMarkdown, "en", css)),
  writeFile(path.join(clientDir, "ja.html"), renderPage(japaneseMarkdown, "ja", css)),
  writeFile(path.join(clientDir, "404.html"), notFound),
  writeFile(path.join(clientDir, "_headers"), headers),
  cp(path.join(root, "public", portraitFile), path.join(clientDir, portraitFile)),
  cp(path.join(root, "worker", "index.js"), path.join(serverDir, "index.js")),
  writeFile(path.join(serverDir, "wrangler.json"), `${JSON.stringify(wrangler)}\n`),
]);

console.log("Built static HTML pages: / and /ja");
