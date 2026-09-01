import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import { once } from "node:events";
import { cp, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const temporaryParent = path.resolve(os.tmpdir());
const origin = "https://men-cotton.github.io";
const googleVerificationFile = "googlefca8208491e66f3b.html";
const gitCommitDate = "2024-06-15T10:20:30+09:00";
const defaultLastModified = {
  en: "2025-02-20T08:15:30+09:00",
  ja: "2024-02-29T23:59:59Z",
};
const pages = [
  { locale: "en", file: "index.html", source: "profile.en.md", url: `${origin}/` },
  { locale: "ja", file: "ja/index.html", source: "profile.md", url: `${origin}/ja/` },
];
let fixture;

function build(environment = {}, useOverrides = true) {
  const env = { ...process.env };
  delete env.SITE_LAST_MODIFIED_EN;
  delete env.SITE_LAST_MODIFIED_JA;
  if (useOverrides) {
    env.SITE_LAST_MODIFIED_EN = defaultLastModified.en;
    env.SITE_LAST_MODIFIED_JA = defaultLastModified.ja;
  }
  Object.assign(env, environment);
  return execFileSync(process.execPath, ["scripts/build-static.mjs"], {
    cwd: fixture,
    env,
    encoding: "utf8",
    stdio: "pipe",
    timeout: 15_000,
  });
}

function output(file) {
  return readFile(path.join(fixture, "dist", file), "utf8");
}

function structuredData(html) {
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length, 1, "Only the non-executable JSON-LD data block is present");
  assert.equal(scripts[0][1].trim(), 'type="application/ld+json"');
  assert.ok(Buffer.byteLength(scripts[0][2]) < 4096, "Structured data stays small");
  return JSON.parse(scripts[0][2]);
}

function field(markdown, key) {
  return markdown.match(new RegExp(`^${key}: (.+)$`, "m"))?.[1].trim();
}

before(async () => {
  fixture = await mkdtemp(path.join(temporaryParent, "portfolio-static-test-"));
  await Promise.all(["scripts", "content", "public", "styles.css", "cv-llt.pdf", googleVerificationFile].map((file) =>
    cp(path.join(root, file), path.join(fixture, file), { recursive: true })));
  execFileSync("git", ["init", "--quiet"], { cwd: fixture });
  execFileSync("git", ["add", "--all"], { cwd: fixture });
  execFileSync("git", ["-c", "user.name=Build Test", "-c", "user.email=build-test@example.invalid", "commit", "--quiet", "-m", "fixture"], {
    cwd: fixture,
    env: { ...process.env, GIT_AUTHOR_DATE: gitCommitDate, GIT_COMMITTER_DATE: gitCommitDate },
  });
  build();
});

after(async () => {
  if (!fixture) return;
  assert.equal(path.dirname(fixture), temporaryParent);
  assert.ok(path.basename(fixture).startsWith("portfolio-static-test-"));
  await rm(fixture, { recursive: true, force: true });
});

for (const page of pages) {
  test(`${page.locale}: canonical, reciprocal hreflang and social metadata match`, async () => {
    const html = await output(page.file);
    const markdown = await readFile(path.join(fixture, "content", page.source), "utf8");
    assert.ok(html.includes(`<html lang="${page.locale}">`));
    assert.ok(html.includes(`<link rel="canonical" href="${page.url}">`));
    assert.equal([...html.matchAll(/rel="canonical"/g)].length, 1);
    assert.deepEqual([...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/g)]
      .map((match) => [match[1], match[2]]), [
      ["en", `${origin}/`], ["ja", `${origin}/ja/`], ["x-default", `${origin}/`],
    ]);
    const title = field(markdown, "title");
    const description = field(markdown, "description");
    assert.ok(html.includes(`<title>${title}</title>`));
    assert.ok(html.includes(`<meta name="description" content="${description}">`));
    for (const prefix of ['property="og:', 'name="twitter:']) {
      assert.ok(html.includes(`<meta ${prefix}title" content="${title}">`));
      assert.ok(html.includes(`<meta ${prefix}description" content="${description}">`));
    }
    assert.ok(html.includes(`<meta property="og:url" content="${page.url}">`));
    assert.ok(html.includes(`class="language-switch" href="${page.locale === "en" ? "/ja/" : "/"}"`));
    assert.doesNotMatch(html, /href="(?:https:\/\/men-cotton\.github\.io)?\/ja(?:\.html)?"/);
    assert.doesNotMatch(html, /<link[^>]+rel="stylesheet"|<script[^>]+src=/);
    assert.ok(html.includes(field(markdown, "role")), "The existing hero copy is retained");
  });

  test(`${page.locale}: JSON-LD identifies the same person and this language's profile`, async () => {
    const html = await output(page.file);
    const markdown = await readFile(path.join(fixture, "content", page.source), "utf8");
    const data = structuredData(html);
    assert.equal(data["@context"], "https://schema.org");
    assert.deepEqual(data["@graph"].map((item) => item["@type"]), ["WebSite", "ProfilePage", "Person"]);
    const [website, profile, person] = data["@graph"];
    assert.equal(website["@id"], `${origin}/#website`);
    assert.equal(website.url, `${origin}/`);
    assert.equal(website.name, "Akimasa Watanuki");
    assert.deepEqual(website.inLanguage, ["en", "ja"]);
    assert.equal(website.publisher["@id"], person["@id"]);
    assert.equal(profile["@id"], `${page.url}#profile`);
    assert.equal(profile.url, page.url);
    assert.equal(profile.inLanguage, page.locale);
    assert.equal(profile.mainEntity["@id"], person["@id"]);
    assert.equal(profile.isPartOf["@id"], website["@id"]);
    assert.equal(profile.name, field(markdown, "title"));
    assert.equal(profile.description, field(markdown, "description"));
    assert.equal(profile.dateModified, defaultLastModified[page.locale]);
    assert.match(profile.dateModified, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})$/);
    assert.ok(Number.isFinite(Date.parse(profile.dateModified)));
    assert.ok(html.includes(`<time datetime="${profile.dateModified}">${profile.dateModified.slice(0, 10)}</time>`));
    assert.equal(person["@id"], `${origin}/#person`);
    assert.equal(person.name, "Akimasa Watanuki");
    assert.deepEqual(person.alternateName, ["綿貫晃雅", "Men-cotton"]);
    assert.equal(person.url, `${origin}/`);
    assert.equal(person.image, `${origin}/_media/profile-82d807edf2.webp`);
    assert.equal(person.description, field(markdown, "summary"));
    assert.equal(person.affiliation[0].name, field(markdown, "institution"));
    assert.equal(person.affiliation[1].name, field(markdown, "lab"));
    assert.equal(person.affiliation[1].url, field(markdown, "lab_url"));
    assert.deepEqual(person.sameAs, ["github", "linkedin", "atcoder", "x"].map((key) => field(markdown, key)));
    const body = html.split("<body>")[1];
    for (const url of person.sameAs) assert.ok(body.includes(`href="${url}"`));
    assert.ok(body.includes("Men-cotton"), "The handle is visible, not just in metadata");
    for (const affiliation of person.affiliation) assert.ok(body.includes(affiliation.name));
  });
}

test("sitemap lists only the two canonical pages and robots allows crawling", async () => {
  const sitemap = await output("sitemap.xml");
  assert.ok(sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>\n'));
  assert.ok(sitemap.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'));
  assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]), pages.map((page) => page.url));
  assert.deepEqual([...sitemap.matchAll(/<lastmod>(.*?)<\/lastmod>/g)].map((match) => match[1]),
    pages.map((page) => defaultLastModified[page.locale]));
  assert.doesNotMatch(sitemap, /ja\.html|index\.html|404|priority|changefreq/);
  assert.equal(await output("robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);
});

test("legacy Japanese URL is only a small immediate redirect, not another profile", async () => {
  const redirect = await output("ja.html");
  assert.ok(redirect.includes(`<link rel="canonical" href="${origin}/ja/">`));
  assert.ok(redirect.includes(`<meta http-equiv="refresh" content="0; url=${origin}/ja/">`));
  assert.ok(redirect.includes(`<a href="${origin}/ja/">`));
  assert.doesNotMatch(redirect, /<script|<style|<h1|<article|application\/ld\+json|noindex/);
  assert.ok(Buffer.byteLength(redirect) < 1024);
  assert.deepEqual((await readdir(path.join(fixture, "dist"), { recursive: true }))
    .filter((file) => file.endsWith(".html")).map((file) => file.replaceAll(path.sep, "/")).sort(),
  ["404.html", googleVerificationFile, "index.html", "ja.html", "ja/index.html"]);
});

test("Google verification file is copied byte-for-byte and excluded from the sitemap", async () => {
  assert.deepEqual(await readFile(path.join(fixture, "dist", googleVerificationFile)),
    await readFile(path.join(root, googleVerificationFile)));
  assert.ok(!(await output("sitemap.xml")).includes(googleVerificationFile));
});

test("lastmod and dateModified follow each profile's supplied commit date, not the build clock", async () => {
  build();
  const sitemap = await output("sitemap.xml");
  assert.deepEqual([...sitemap.matchAll(/<lastmod>(.*?)<\/lastmod>/g)].map((match) => match[1]),
    pages.map((page) => defaultLastModified[page.locale]));
  for (const page of pages) {
    assert.equal(structuredData(await output(page.file))["@graph"][1].dateModified,
      defaultLastModified[page.locale]);
  }
});

test("a normal build derives the timestamp from Git history", async () => {
  build({}, false);
  for (const page of pages) {
    assert.equal(structuredData(await output(page.file))["@graph"][1].dateModified, gitCommitDate);
  }
  build();
});

test("invalid commit dates fail before replacing the last successful build", async () => {
  const sitemap = await output("sitemap.xml");
  for (const updated of [
    "", "not-a-date", "2026-09-01", "2026-02-29T00:00:00+09:00",
    "2026-02-30T00:00:00+09:00", "2026-13-01T00:00:00+09:00",
    "2026-09-01T24:00:00+09:00", "2026-09-01T12:00:00", "2026-09-01T12:00:00+24:00",
  ]) {
    assert.throws(() => build({ SITE_LAST_MODIFIED_EN: updated }), /last-modified/);
    assert.equal(await output("sitemap.xml"), sitemap);
  }
});

test("frontmatter is escaped for HTML and JSON-LD data blocks", async () => {
  const source = path.join(fixture, "content", "profile.en.md");
  const original = await readFile(source, "utf8");
  const hostile = 'A & B </script><script>alert("metadata")</script>';
  try {
    await writeFile(source, original.replace(/^description: .+$/m, `description: ${hostile}`));
    build();
    const html = await output("index.html");
    assert.equal(structuredData(html)["@graph"][1].description, hostile);
    assert.ok(html.includes('A &amp; B &lt;/script&gt;&lt;script&gt;alert(&quot;metadata&quot;)&lt;/script&gt;'));
    assert.doesNotMatch(html, /<script>alert/);
  } finally {
    await writeFile(source, original);
    build();
  }
});

test("preview server serves crawler files and canonical routes with correct content types", { timeout: 15_000 }, async (t) => {
  const server = spawn(process.execPath, ["scripts/serve-static.mjs"], {
    cwd: fixture,
    env: { ...process.env, PORT: "0" },
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  });
  const closed = once(server, "close");
  t.after(async () => {
    server.kill();
    await closed;
  });
  const base = await new Promise((resolve, reject) => {
    let log = "";
    let errors = "";
    const timer = setTimeout(() => reject(new Error(`Preview startup timed out: ${errors}`)), 5000);
    server.once("error", (error) => { clearTimeout(timer); reject(error); });
    server.once("exit", (code) => { clearTimeout(timer); reject(new Error(`Preview exited (${code}): ${errors}`)); });
    server.stderr.on("data", (data) => { errors += data; });
    server.stdout.on("data", (data) => {
      log += data;
      const match = log.match(/http:\/\/127\.0\.0\.1:\d+\//);
      if (match) { clearTimeout(timer); resolve(match[0]); }
    });
  });
  for (const [route, type, file] of [
    ["", "text/html", "index.html"],
    ["ja/", "text/html", "ja/index.html"],
    ["ja/index.html", "text/html", "ja/index.html"],
    ["ja.html", "text/html", "ja.html"],
    ["sitemap.xml", "application/xml", "sitemap.xml"],
    ["robots.txt", "text/plain", "robots.txt"],
    [googleVerificationFile, "text/html", googleVerificationFile],
  ]) {
    const response = await fetch(new URL(route, base));
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), `${type}; charset=utf-8`);
    assert.equal(await response.text(), await output(file));
    const head = await fetch(new URL(route, base), { method: "HEAD" });
    assert.equal(head.status, 200);
    assert.equal(head.headers.get("content-length"), response.headers.get("content-length"));
    assert.equal(await head.text(), "");
  }
  const redirect = await fetch(new URL("ja?from=test", base), { redirect: "manual" });
  assert.equal(redirect.status, 301);
  assert.equal(redirect.headers.get("location"), "/ja/?from=test");
  for (const [route, type] of [["cv-llt.pdf", "application/pdf"], ["_media/profile-82d807edf2.webp", "image/webp"]]) {
    const response = await fetch(new URL(route, base));
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), type);
    assert.ok((await response.arrayBuffer()).byteLength > 0);
  }
  const missing = await fetch(new URL("missing", base));
  assert.equal(missing.status, 404);
});
