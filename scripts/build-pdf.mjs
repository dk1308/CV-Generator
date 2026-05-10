/**
 * Build a CV PDF from a content entry under src/content/cv/<id>.yaml.
 *
 * Flow:
 *   1. `astro build` → dist/cv/<id>/index.html
 *   2. Serve dist/ via serve-handler on a random free port
 *   3. Run pagedjs-cli against http://localhost:<port>/cv/<id>/
 *   4. Output dist/pdf/<id>.pdf, teardown server
 *
 * Usage:
 *   npm run pdf -- <id>            # e.g. `npm run pdf -- sample`
 *
 * Why this script exists:
 *   - cv-layout.astro skips the Paged.js polyfill in production; prod pagination
 *     is delegated to pagedjs-cli (puppeteer + paged.js headless).
 *   - Dev-server pagination uses the polyfill and is only for preview.
 */
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { mkdir, stat, readdir } from "node:fs/promises";
import path from "node:path";
import handler from "serve-handler";

const CV_DIR = "src/content/cv";
const DIST_DIR = "dist";
const PDF_DIR = "dist/pdf";

const id = process.argv[2];
if (!id) {
  const available = await listAvailableIds();
  console.error("Usage: npm run pdf -- <id>");
  console.error(`Available CV ids: ${available.join(", ") || "(none)"}`);
  process.exit(1);
}

try {
  await runAstroBuild();
  await assertBuiltPage(id);
  const { server, port } = await startStaticServer(DIST_DIR);
  try {
    await mkdir(PDF_DIR, { recursive: true });
    const outPath = path.join(PDF_DIR, `${id}.pdf`);
    await runPagedjsCli(`http://localhost:${port}/cv/${id}/`, outPath);
    await reportOutput(outPath);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
} catch (err) {
  console.error(`\n[build-pdf] FAILED: ${err.message}`);
  process.exit(1);
}

// --- Helpers ---

async function listAvailableIds() {
  try {
    const files = await readdir(CV_DIR);
    return files.filter((f) => f.endsWith(".yaml")).map((f) => f.replace(/\.yaml$/, ""));
  } catch {
    return [];
  }
}

function runAstroBuild() {
  // Use npx so the local devDep bin is resolved on both POSIX + Windows
  // without relying on PATH containing node_modules/.bin.
  return runSpawn("npx", ["--no-install", "astro", "build"], "astro build");
}

async function assertBuiltPage(id) {
  const indexHtml = path.join(DIST_DIR, "cv", id, "index.html");
  try {
    await stat(indexHtml);
  } catch {
    const available = await listAvailableIds();
    throw new Error(
      `Built page not found: ${indexHtml}\n` +
        `Is "${id}" a valid CV id? Available: ${available.join(", ") || "(none)"}`
    );
  }
}

function startStaticServer(rootDir) {
  return new Promise((resolve, reject) => {
    const server = createServer((req, res) =>
      handler(req, res, { public: rootDir, cleanUrls: true })
    );
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => resolve({ server, port: server.address().port }));
  });
}

function runPagedjsCli(url, outPath) {
  // pagedjs-cli is invoked via npx so the local devDep bin is resolved on
  // both POSIX + Windows without hardcoding node_modules paths.
  return runSpawn("npx", ["--no-install", "pagedjs-cli", url, "-o", outPath], "pagedjs-cli");
}

function runSpawn(cmd, args, label) {
  return new Promise((resolve, reject) => {
    console.log(`[build-pdf] $ ${label}`);
    const proc = spawn(cmd, args, { stdio: "inherit", shell: process.platform === "win32" });
    proc.on("error", reject);
    proc.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`${label} exited with code ${code}`))
    );
  });
}

async function reportOutput(outPath) {
  const st = await stat(outPath);
  const kb = (st.size / 1024).toFixed(1);
  // File size is a rough proxy for page count; a real (non-empty) PDF is
  // almost always >10KB. Warn if the output is suspiciously small.
  if (st.size < 10_000) {
    console.warn(`[build-pdf] WARN: output is only ${kb} KB — might be empty/broken`);
  }
  console.log(`[build-pdf] OK  → ${outPath} (${kb} KB)`);
}
