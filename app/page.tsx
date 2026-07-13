import profileMarkdown from "../content/profile.md?raw";

type Frontmatter = Record<string, string>;
type Entry = { title: string; description: string; link?: { label: string; href: string } };

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

function parseBullets(section = "") {
  return section.split(/\r?\n/).filter((line) => line.startsWith("- ")).map((line) => line.slice(2).trim());
}

const { frontmatter, sections } = parseProfile(profileMarkdown);
const activities = parseEntries(sections.get("現在の研究・活動"));
const work = parseEntries(sections.get("主な実績"));
const achievements = parseBullets(sections.get("受賞・成績"));
const interests = parseBullets(sections.get("関心"));

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noreferrer">{children}<span aria-hidden="true"> ↗</span></a>;
}

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="site-name" href="#top">Akimasa Watanuki</a>
        <nav aria-label="ページ内ナビゲーション">
          <a href="#activity">研究・活動</a>
          <a href="#work">実績</a>
          <a href="#contact">連絡先</a>
        </nav>
      </header>

      <section className="profile" id="top">
        <img src="/profile.png" alt={`${frontmatter.name}のポートレート`} width="180" height="180" />
        <div>
          <p className="role">{frontmatter.role}</p>
          <h1>{frontmatter.name}</h1>
          <p className="name-en">{frontmatter.name_en}</p>
          <p className="summary">{frontmatter.summary}</p>
          <dl className="facts">
            <div><dt>所属</dt><dd>{frontmatter.affiliation}</dd></div>
            <div><dt>研究室</dt><dd>{frontmatter.lab}</dd></div>
            <div><dt>学年</dt><dd>{frontmatter.year}</dd></div>
          </dl>
          <div className="profile-links" aria-label="外部プロフィール">
            <ExternalLink href={frontmatter.github}>GitHub</ExternalLink>
            <ExternalLink href={frontmatter.linkedin}>LinkedIn</ExternalLink>
            <ExternalLink href={frontmatter.atcoder}>AtCoder</ExternalLink>
            <ExternalLink href={frontmatter.x}>X</ExternalLink>
          </div>
        </div>
      </section>

      <section className="section" id="activity">
        <h2>現在の研究・活動</h2>
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
        <h2>主な実績</h2>
        <div className="entry-list">
          {work.map((item) => (
            <article className="entry work-entry" key={item.title}>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              {item.link && <ExternalLink href={item.link.href}>{item.link.label}</ExternalLink>}
            </article>
          ))}
        </div>
      </section>

      <section className="section two-column">
        <div>
          <h2>受賞・成績</h2>
          <ul>{achievements.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div>
          <h2>関心</h2>
          <ul>{interests.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </section>

      <section className="section contact" id="contact">
        <h2>連絡先</h2>
        <p>研究、OSS、インターンシップに関する連絡はメールでお願いします。</p>
        <a className="email" href={`mailto:${frontmatter.email}`}>{frontmatter.email}</a>
      </section>

      <footer>
        <span>© 2026 {frontmatter.name_en}</span>
        <span>Tokyo, Japan</span>
      </footer>
    </main>
  );
}
