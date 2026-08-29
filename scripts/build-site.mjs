import { cp, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/site/', import.meta.url));

// Static Web Apps must serve known application routes as actual documents.
// Keeping the route documents explicit lets an unknown path retain its HTTP
// 404 status instead of being swallowed by an SPA navigation fallback.
for (const route of ['demo', 'privacy', 'terms']) {
  await mkdir(`${dist}${route}`, { recursive: true });
  await cp(`${dist}index.html`, `${dist}${route}/index.html`);
}
