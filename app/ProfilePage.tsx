type Frontmatter = Record<string, string>;
type Entry = { title: string; description: string; link?: { label: string; href: string } };
type ListItem = { label: string; link?: string };
type Locale = "en" | "ja";

const labels = {
  en: {
    nav: ["Research", "Work", "Contact"],
    navLabel: "Page navigation",
    language: "日本語",
    languageHref: "/ja",
    facts: ["Affiliation", "Lab", "Program"],
    profileLinks: "External profiles",
    sections: ["Research and current work", "Selected work", "Recognition", "Interests", "Contact"],
    portrait: "Portrait of Akimasa Watanuki",
  },
  ja: {
    nav: ["研究・活動", "実績", "連絡先"],
    navLabel: "ページ内ナビゲーション",
    language: "English",
    languageHref: "/",
    facts: ["所属", "研究室", "学年"],
    profileLinks: "外部プロフィール",
    sections: ["現在の研究・活動", "主な実績", "受賞・成績", "関心", "連絡先"],
    portrait: "綿貫晃雅のポートレート",
  },
} as const;

function parseProfile(markdown: string) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error("Profile frontmatter is missing.");

  const frontmatter = Object.fromEntries(
    match[1].split(/\r?\n/).filter(Boolean).map((line) => {
      const separator = line.indexOf(":");
      return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
    }),
  ) as Frontmatter;

  const sections = new Map<string, string>();
  for (const part of match[2].split(/^## /m).slice(1)) {
    const [heading, ...lines] = part.split(/\r?\n/);
    sections.set(heading.trim(), lines.join("\n").trim());
  }
  return { frontmatter, sections };
}

function parseEntries(section = ""): Entry[] {
  return section.split(/^### /m).slice(1).map((block) => {
    const [title, ...lines] = block.split(/\r?\n/).filter(Boolean);
    const linkLine = lines.find((line) => /^\[.+\]\(https?:\/\/.+\)$/.test(line));
    const linkMatch = linkLine?.match(/^\[(.+)\]\((https?:\/\/.+)\)$/);
    return {
      title: title.trim(),
      description: lines.filter((line) => line !== linkLine).join(" ").trim(),
      link: linkMatch ? { label: linkMatch[1], href: linkMatch[2] } : undefined,
    };
  });
}

function parseBullets(section = ""): ListItem[] {
  return section.split(/\r?\n/).filter((line) => line.startsWith("- ")).map((line) => {
    const value = line.slice(2).trim();
    const match = value.match(/^\[(.+)\]\((https?:\/\/.+)\)$/);
    return match ? { label: match[1], link: match[2] } : { label: value };
  });
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noreferrer">{children}<span aria-hidden="true"> ↗</span></a>;
}

export function ProfilePage({ markdown, locale }: { markdown: string; locale: Locale }) {
  const copy = labels[locale];
  const { frontmatter, sections } = parseProfile(markdown);
  const activities = parseEntries(sections.get(copy.sections[0]));
  const work = parseEntries(sections.get(copy.sections[1]));
  const achievements = parseBullets(sections.get(copy.sections[2]));
  const interests = parseBullets(sections.get(copy.sections[3]));

  return (
    <main lang={locale}>
      <header className="site-header">
        <a className="site-name" href="#top">Akimasa Watanuki</a>
        <nav aria-label={copy.navLabel}>
          <a href="#activity">{copy.nav[0]}</a>
          <a href="#work">{copy.nav[1]}</a>
          <a href="#contact">{copy.nav[2]}</a>
          <a className="language-switch" href={copy.languageHref} hrefLang={locale === "en" ? "ja" : "en"}>{copy.language}</a>
        </nav>
      </header>

      <section className="profile" id="top">
        <img src="/profile.png" alt={copy.portrait} width="180" height="180" />
        <div>
          <p className="role">{frontmatter.role}</p>
          <h1>{frontmatter.name}</h1>
          <p className="name-en">{frontmatter.name_secondary}</p>
          <p className="summary">{frontmatter.summary}</p>
          <p className="keywords"><span>{frontmatter.keywords_label}</span>{frontmatter.keywords}</p>
          <dl className="facts">
            <div><dt>{copy.facts[0]}</dt><dd>{frontmatter.affiliation}</dd></div>
            <div><dt>{copy.facts[1]}</dt><dd><ExternalLink href={frontmatter.lab_url}>{frontmatter.lab}</ExternalLink></dd></div>
            <div><dt>{copy.facts[2]}</dt><dd>{frontmatter.year}</dd></div>
          </dl>
          <div className="profile-links" aria-label={copy.profileLinks}>
            <ExternalLink href={frontmatter.github}>GitHub</ExternalLink>
            <ExternalLink href={frontmatter.linkedin}>LinkedIn</ExternalLink>
            <ExternalLink href={frontmatter.atcoder}>AtCoder</ExternalLink>
            <ExternalLink href={frontmatter.x}>X</ExternalLink>
          </div>
        </div>
      </section>

      <section className="section" id="activity">
        <h2>{copy.sections[0]}</h2>
        <div className="entry-list">
          {activities.map((item) => (
            <article className="entry" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="work">
        <h2>{copy.sections[1]}</h2>
        <div className="entry-list">
          {work.map((item) => (
            <article className="entry work-entry" key={item.title}>
              <div><h3>{item.title}</h3><p>{item.description}</p></div>
              {item.link && <ExternalLink href={item.link.href}>{item.link.label}</ExternalLink>}
            </article>
          ))}
        </div>
      </section>

      <section className="section two-column">
        <div>
          <h2>{copy.sections[2]}</h2>
          <ul>{achievements.map((item) => <li key={item.label}>{item.link ? <ExternalLink href={item.link}>{item.label}</ExternalLink> : item.label}</li>)}</ul>
        </div>
        <div>
          <h2>{copy.sections[3]}</h2>
          <ul>{interests.map((item) => <li key={item.label}>{item.link ? <ExternalLink href={item.link}>{item.label}</ExternalLink> : item.label}</li>)}</ul>
        </div>
      </section>

      <section className="section contact" id="contact">
        <h2>{copy.sections[4]}</h2>
        <p>{frontmatter.contact}</p>
        <p>{frontmatter.casual_contact} <ExternalLink href={frontmatter.x}>{frontmatter.casual_contact_link}</ExternalLink></p>
        <a className="email" href={`mailto:${frontmatter.email}`}>{frontmatter.email}</a>
      </section>

      <footer><span>© 2026 Akimasa Watanuki</span><span>Tokyo, Japan</span></footer>
    </main>
  );
}
