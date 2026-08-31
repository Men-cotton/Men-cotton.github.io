import { createHash } from "node:crypto";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const japaneseDir = path.join(dist, "ja");
const mediaDir = path.join(dist, "_media");
const portraitFile = "profile-82d807edf2.webp";
const portraitRoute = `/_media/${portraitFile}`;
const cvFile = "cv-llt.pdf";
const googleVerificationFile = "googlefca8208491e66f3b.html";
const cvRoute = `/${cvFile}`;
const siteUrl = "https://men-cotton.github.io";

if (path.dirname(dist) !== root || path.basename(dist) !== "dist") {
  throw new Error(`Refusing to replace unexpected build directory: ${dist}`);
}

const copy = {
  en: {
    nav: ["Research", "Open Source", "Contact"],
    navLabel: "Page navigation",
    language: "日本語",
    languageHref: "/ja/",
    languageCode: "ja",
    facts: ["Affiliation", "Lab", "Status"],
    profileLinks: "CV and external profiles",
    sections: ["Research Projects", "Independent Development and Open-Source Contributions", "Research Interests", "Education", "Work Experience", "Recognition", "Interests", "Contact"],
    portrait: "Portrait of Akimasa Watanuki",
    updatedLabel: "Last updated",
    openGraphLocale: "en_US",
    canonical: `${siteUrl}/`,
  },
  ja: {
    nav: ["研究", "個人開発・OSS", "連絡先"],
    navLabel: "ページ内ナビゲーション",
    language: "English",
    languageHref: "/",
    languageCode: "en",
    facts: ["所属", "研究室", "学年"],
    profileLinks: "CV・外部プロフィール",
    sections: ["研究プロジェクト・発表", "個人開発・OSS貢献", "研究の関心", "学歴", "職歴", "受賞・成績", "関心", "連絡先"],
    portrait: "綿貫晃雅のポートレート",
    updatedLabel: "最終更新",
    openGraphLocale: "ja_JP",
    canonical: `${siteUrl}/ja/`,
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

  for (const field of ["name", "name_secondary", "handle", "title", "description", "institution", "updated"]) {
    if (!frontmatter[field]) throw new Error(`Profile frontmatter field is missing: ${field}`);
  }
  const updatedDate = new Date(frontmatter.updated);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(frontmatter.updated)
      || !Number.isFinite(updatedDate.getTime())
      || updatedDate.toISOString().slice(0, 10) !== frontmatter.updated) {
    throw new Error(`Profile updated must be a real date in YYYY-MM-DD format: ${frontmatter.updated}`);
  }

  const sections = new Map();
  for (const part of match[2].split(/^## /m).slice(1)) {
    const [heading, ...lines] = part.split(/\r?\n/);
    sections.set(heading.trim(), lines.join("\n").trim());
  }
  return { frontmatter, sections };
}

function parseEntries(section = "") {
  return section.split(/^### /m).slice(1).map((block) => {
    const [title, ...lines] = block.split(/\r?\n/);
    const linkLines = lines.filter((line) => /^\[.+\]\(https?:\/\/.+\)$/.test(line.trim()));
    const description = lines.filter((line) => !linkLines.includes(line)).join("\n").trim();
    return {
      title: title.trim(),
      description: description.split(/\r?\n\s*\r?\n/).map((paragraph) => paragraph.replace(/\r?\n/g, " ").trim()).filter(Boolean),
      links: linkLines.flatMap((line) => {
        const match = line.trim().match(/^\[(.+)\]\((https?:\/\/.+)\)$/);
        return match ? [{ label: match[1], href: match[2] }] : [];
      }),
    };
  });
}

function parseSectionIntro(section = "") {
  return section.split(/^### /m)[0].trim().split(/\r?\n\s*\r?\n/).map((paragraph) => paragraph.replace(/\r?\n/g, " ").trim()).filter(Boolean);
}

function parseBullets(section = "") {
  const roots = [];
  const parents = [];
  for (const line of section.split(/\r?\n/)) {
    const bullet = line.match(/^(\s*)-\s+(.+)$/);
    if (!bullet) continue;
    const depth = Math.floor(bullet[1].replaceAll("\t", "  ").length / 2);
    const value = bullet[2].trim();
    const match = value.match(/^\[(.+)\]\((https?:\/\/.+)\)$/);
    const item = match ? { label: match[1], link: match[2], children: [] } : { label: value, children: [] };
    if (depth === 0 || !parents[depth - 1]) roots.push(item);
    else parents[depth - 1].children.push(item);
    parents[depth] = item;
    parents.length = depth + 1;
  }
  return roots;
}

function externalLink(href, label) {
  return `<a href="${escapeHtml(href)}" target="_blank" rel="noreferrer">${escapeHtml(label)}<span aria-hidden="true"> ↗</span></a>`;
}

function renderInline(value) {
  const pattern = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;
  let output = "";
  let cursor = 0;
  for (const match of value.matchAll(pattern)) {
    output += escapeHtml(value.slice(cursor, match.index));
    output += externalLink(match[2], match[1]);
    cursor = match.index + match[0].length;
  }
  return output + escapeHtml(value.slice(cursor));
}

function renderWorkEntries(entries) {
  return entries.map((item) => `
          <article class="entry work-entry">
            <div><h3>${escapeHtml(item.title)}</h3>${item.description.map((paragraph) => `<p>${renderInline(paragraph)}</p>`).join("")}</div>
            ${item.links.length ? `<div class="entry-links">${item.links.map((link) => externalLink(link.href, link.label)).join("")}</div>` : ""}
          </article>`).join("");
}

function renderExperience(entries) {
  return entries.map((item) => `
          <article class="entry">
            <h3>${escapeHtml(item.title)}</h3>
            <div class="experience-detail">${item.description.map((paragraph) => `<p>${renderInline(paragraph)}</p>`).join("")}${item.links.map((link) => externalLink(link.href, link.label)).join("")}</div>
          </article>`).join("");
}

function renderBullets(items) {
  return items.map((item) => `<li>${item.link ? externalLink(item.link, item.label) : escapeHtml(item.label)}${item.children.length ? `<ul>${renderBullets(item.children)}</ul>` : ""}</li>`).join("");
}

function renderStructuredData(frontmatter, locale, identity) {
  const canonical = copy[locale].canonical;
  const personId = `${siteUrl}/#person`;
  const websiteId = `${siteUrl}/#website`;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: copy.en.canonical,
        ...identity,
        inLanguage: ["en", "ja"],
        publisher: { "@id": personId },
      },
      {
        "@type": "ProfilePage",
        "@id": `${canonical}#profile`,
        url: canonical,
        name: frontmatter.title,
        description: frontmatter.description,
        inLanguage: locale,
        dateModified: frontmatter.updated,
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        ...identity,
        url: copy.en.canonical,
        image: `${siteUrl}${portraitRoute}`,
        description: frontmatter.summary,
        affiliation: [
          { "@type": "Organization", name: frontmatter.institution },
          { "@type": "Organization", name: frontmatter.lab, url: frontmatter.lab_url },
        ],
        sameAs: [frontmatter.github, frontmatter.linkedin, frontmatter.atcoder, frontmatter.x],
      },
    ],
  };
  // JSON in a script data block must not be able to close the surrounding tag.
  return JSON.stringify(data).replaceAll("<", "\\u003c");
}

function renderSitemap(profiles) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Object.entries(profiles).map(([locale, { frontmatter }]) => `  <url>
    <loc>${escapeHtml(copy[locale].canonical)}</loc>
    <lastmod>${frontmatter.updated}</lastmod>
  </url>`).join("\n")}
</urlset>
`;
}

function renderPage(profile, locale, css, identity) {
  const labels = copy[locale];
  const { frontmatter, sections } = profile;
  const researchOutput = parseEntries(sections.get(labels.sections[0]));
  const developmentWork = parseEntries(sections.get(labels.sections[1]));
  const researchInterests = parseEntries(sections.get(labels.sections[2]));
  const researchInterestsIntro = parseSectionIntro(sections.get(labels.sections[2]));
  const education = parseEntries(sections.get(labels.sections[3]));
  const workExperience = parseEntries(sections.get(labels.sections[4]));
  const achievements = parseBullets(sections.get(labels.sections[5]));
  const interests = parseBullets(sections.get(labels.sections[6]));

  return `<!doctype html>
<html lang="${locale}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(frontmatter.title)}</title>
  <meta name="description" content="${escapeHtml(frontmatter.description)}">
  <link rel="canonical" href="${labels.canonical}">
  <link rel="alternate" hreflang="en" href="${copy.en.canonical}">
  <link rel="alternate" hreflang="ja" href="${copy.ja.canonical}">
  <link rel="alternate" hreflang="x-default" href="${copy.en.canonical}">
  <link rel="preload" href="${portraitRoute}" as="image" type="image/webp" fetchpriority="high">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="${labels.openGraphLocale}">
  <meta property="og:locale:alternate" content="${copy[labels.languageCode].openGraphLocale}">
  <meta property="og:site_name" content="${escapeHtml(identity.name)}">
  <meta property="og:title" content="${escapeHtml(frontmatter.title)}">
  <meta property="og:description" content="${escapeHtml(frontmatter.description)}">
  <meta property="og:url" content="${labels.canonical}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escapeHtml(frontmatter.title)}">
  <meta name="twitter:description" content="${escapeHtml(frontmatter.description)}">
  <script type="application/ld+json">${renderStructuredData(frontmatter, locale, identity)}</script>
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
        <p class="name-en">${escapeHtml(frontmatter.name_secondary)} / ${escapeHtml(frontmatter.handle)}</p>
        <p class="summary">${escapeHtml(frontmatter.summary)}</p>
        <p class="keywords"><span>${escapeHtml(frontmatter.fields_label)}</span>${escapeHtml(frontmatter.fields)}</p>
        <p class="keywords"><span>${escapeHtml(frontmatter.keywords_label)}</span>${escapeHtml(frontmatter.keywords)}</p>
        <dl class="facts">
          <div><dt>${escapeHtml(labels.facts[0])}</dt><dd>${escapeHtml(frontmatter.affiliation)}</dd></div>
          <div><dt>${escapeHtml(labels.facts[1])}</dt><dd>${externalLink(frontmatter.lab_url, frontmatter.lab)}${locale === "ja" ? "（主宰：" : " — led by "}${externalLink(frontmatter.advisor_url, frontmatter.advisor)}${locale === "ja" ? "）" : ""}</dd></div>
          <div><dt>${escapeHtml(labels.facts[2])}</dt><dd>${escapeHtml(frontmatter.year)}</dd></div>
        </dl>
        <div class="profile-links" aria-label="${escapeHtml(labels.profileLinks)}">
          <a href="${cvRoute}" type="application/pdf" target="_blank" rel="noreferrer">CV (PDF)<span aria-hidden="true"> ↗</span></a>
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
      ${researchInterestsIntro.length ? `<div class="section-intro">${researchInterestsIntro.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}</div>` : ""}
      <div class="entry-list">${renderWorkEntries(researchInterests)}
      </div>
    </section>

    <section class="section" id="education">
      <h2>${escapeHtml(labels.sections[3])}</h2>
      <div class="entry-list">${renderExperience(education)}
      </div>
    </section>

    <section class="section" id="experience">
      <h2>${escapeHtml(labels.sections[4])}</h2>
      <div class="entry-list">${renderExperience(workExperience)}
      </div>
    </section>

    <section class="section two-column">
      <div class="recognition"><h2>${escapeHtml(labels.sections[5])}</h2><ul>${renderBullets(achievements)}</ul></div>
      <div><h2>${escapeHtml(labels.sections[6])}</h2><ul>${renderBullets(interests)}</ul></div>
    </section>

    <section class="section contact" id="contact">
      <h2>${escapeHtml(labels.sections[7])}</h2>
      <p>${escapeHtml(frontmatter.contact_before)}${locale === "en" ? " " : ""}<a class="email" href="mailto:${escapeHtml(frontmatter.email)}">${escapeHtml(frontmatter.email)}</a>${escapeHtml(frontmatter.contact_after)}</p>
      <p>${escapeHtml(frontmatter.casual_contact)} ${externalLink(frontmatter.x, frontmatter.casual_contact_link)}${locale === "en" ? "." : ""}</p>
    </section>

    <footer><span>© 2026 Akimasa Watanuki</span><span>${labels.updatedLabel}: <time datetime="${frontmatter.updated}">${frontmatter.updated}</time> · Tokyo, Japan</span></footer>
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

const profiles = {
  en: parseProfile(englishMarkdown),
  ja: parseProfile(japaneseMarkdown),
};
if (profiles.en.frontmatter.handle !== profiles.ja.frontmatter.handle) {
  throw new Error("The English and Japanese profile handles must match.");
}
const identity = {
  name: profiles.en.frontmatter.name,
  alternateName: [profiles.ja.frontmatter.name.replace(/\s+/g, ""), profiles.en.frontmatter.handle],
};
const englishPage = renderPage(profiles.en, "en", css, identity);
const japanesePage = renderPage(profiles.ja, "ja", css, identity);
const sitemap = renderSitemap(profiles);
const robots = `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
const japaneseRedirect = `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>日本語ページへ移動</title>
  <link rel="canonical" href="${copy.ja.canonical}">
  <meta http-equiv="refresh" content="0; url=${copy.ja.canonical}">
</head>
<body><p><a href="${copy.ja.canonical}">日本語ページへ移動</a></p></body>
</html>
`;

await rm(dist, { recursive: true, force: true });
await Promise.all([
  mkdir(japaneseDir, { recursive: true }),
  mkdir(mediaDir, { recursive: true }),
]);

const notFound = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found</title><style>${css}</style><body><main><section class="profile"><div><h1>Page not found</h1><p><a href="/">Return home</a></p></div></section></main></body></html>\n`;

await Promise.all([
  writeFile(path.join(dist, "index.html"), englishPage),
  writeFile(path.join(dist, "ja.html"), japaneseRedirect),
  writeFile(path.join(japaneseDir, "index.html"), japanesePage),
  writeFile(path.join(dist, "404.html"), notFound),
  writeFile(path.join(dist, ".nojekyll"), ""),
  writeFile(path.join(dist, "sitemap.xml"), sitemap),
  writeFile(path.join(dist, "robots.txt"), robots),
  cp(path.join(root, "public", portraitFile), path.join(mediaDir, portraitFile)),
  cp(path.join(root, cvFile), path.join(dist, cvFile)),
  cp(path.join(root, googleVerificationFile), path.join(dist, googleVerificationFile)),
]);

console.log(`Built GitHub Pages site: /, /ja/, ${cvRoute}, sitemap.xml, and robots.txt`);
