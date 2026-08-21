import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const clientDir = path.join(root, "dist", "client");
const port = Number.parseInt(process.env.PORT || "3000", 10);
const portraitRoute = "/_media/profile-82d807edf2.webp";

const routes = new Map([
  ["/", "index.html"],
  ["/index.html", "index.html"],
  ["/ja", "ja.html"],
  ["/ja/", "ja.html"],
  ["/ja.html", "ja.html"],
  [portraitRoute, "profile-82d807edf2.webp"],
]);

const types = new Map([
  [".html", "text/html; charset=utf-8"],
  [".webp", "image/webp"],
]);

const server = http.createServer(async (request, response) => {
  const pathname = new URL(request.url || "/", "http://localhost").pathname;
  const relative = routes.get(pathname) || "404.html";
  const file = path.resolve(clientDir, relative);

  if (!file.startsWith(`${clientDir}${path.sep}`)) {
    response.writeHead(400).end();
    return;
  }

  try {
    const info = await stat(file);
    const headers = {
      "Content-Type": types.get(path.extname(file)) || "application/octet-stream",
      "Content-Length": info.size,
      "Cache-Control": pathname === portraitRoute ? "public, max-age=31536000, immutable" : "no-cache",
    };
    response.writeHead(relative === "404.html" ? 404 : 200, headers);
    if (request.method === "HEAD") response.end();
    else createReadStream(file).pipe(response);
  } catch {
    response.writeHead(500).end("Static build is unavailable. Run the build first.");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Static site running at http://127.0.0.1:${port}/`);
});
