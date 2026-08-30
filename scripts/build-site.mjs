import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createLocalReleaseIdentity } from './release-identity.mjs';

const dist = fileURLToPath(new URL('../dist/site/', import.meta.url));

// Static Web Apps must serve known application routes as actual documents.
// Keeping the route documents explicit lets an unknown path retain its HTTP
// 404 status instead of being swallowed by an SPA navigation fallback.
const routeMetadata = {
  demo: {
    title: 'Demo — Self-Host Upgrade Rehearsal',
    description: 'Run the isolated Arbor Desk sample demo and inspect its customer-safe readiness receipt.',
    canonical: 'https://selfhost-upgrade-rehearsal.sociobot.in/?demo=1'
  },
  privacy: {
    title: 'Privacy — Self-Host Upgrade Rehearsal',
    description: 'See what the local CLI, browser demo, release lookup, and license check handle.',
    canonical: 'https://selfhost-upgrade-rehearsal.sociobot.in/privacy'
  },
  terms: {
    title: 'Terms — Self-Host Upgrade Rehearsal',
    description: 'Read the receipt limits, Team kit purchase terms, and operator responsibilities.',
    canonical: 'https://selfhost-upgrade-rehearsal.sociobot.in/terms'
  }
};

const rootDocument = await readFile(`${dist}index.html`, 'utf8');
for (const [route, metadata] of Object.entries(routeMetadata)) {
  await mkdir(`${dist}${route}`, { recursive: true });
  const routeDocument = rootDocument
    .replace(/<title>[^<]+<\/title>/, `<title>${metadata.title}</title>`)
    .replace(/<meta name="description" content="[^"]+" \/>/, `<meta name="description" content="${metadata.description}" />`)
    .replace(/<link rel="canonical" href="[^"]+" \/>/, `<link rel="canonical" href="${metadata.canonical}" />`)
    .replace(/<meta property="og:title" content="[^"]+" \/>/, `<meta property="og:title" content="${metadata.title}" />`)
    .replace(/<meta property="og:description" content="[^"]+" \/>/, `<meta property="og:description" content="${metadata.description}" />`)
    .replace(/<meta name="twitter:title" content="[^"]+" \/>/, `<meta name="twitter:title" content="${metadata.title}" />`)
    .replace(/<meta name="twitter:description" content="[^"]+" \/>/, `<meta name="twitter:description" content="${metadata.description}" />`);
  await writeFile(`${dist}${route}/index.html`, routeDocument);
}

const releaseIdentity = await createLocalReleaseIdentity({
  cwd: fileURLToPath(new URL('../', import.meta.url)),
  expectedCommit: process.env.RELEASE_COMMIT
});
await writeFile(`${dist}release.json`, `${JSON.stringify(releaseIdentity, null, 2)}\n`);
