import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';
import { promisify } from 'node:util';
import {
  assertIdentityMatches,
  createLocalReleaseIdentity,
  verifyReleaseIdentity,
  verifyRemoteBranch
} from '../scripts/release-identity.mjs';

const exec = promisify(execFile);
const root = resolve(import.meta.dirname, '..');
const unavailableVerifierSha = '4510fe62d2c568fefb7ef464a621ab929763a92f';

async function git(cwd, ...args) {
  const { stdout } = await exec('git', args, { cwd });
  return stdout.trim();
}

test('the built identity is bound to the exact checkout commit', async () => {
  const expected = await createLocalReleaseIdentity({ cwd: root });
  const published = JSON.parse(await readFile(join(root, 'dist/site/release.json'), 'utf8'));
  assertIdentityMatches(published, expected);
});

test('the verifier rejects the unavailable SHA from independent verification 12', async () => {
  await assert.rejects(
    createLocalReleaseIdentity({ cwd: root, expectedCommit: unavailableVerifierSha }),
    /not available in this checkout/
  );
});

test('the verifier rejects a release commit that has not reached the configured remote branch', async () => {
  const sandbox = await mkdtemp(join(tmpdir(), 'rehearsal-release-identity-'));
  const remote = join(sandbox, 'remote.git');
  const checkout = join(sandbox, 'checkout');
  const site = join(checkout, 'site-output');
  try {
    await mkdir(checkout);
    await git(sandbox, 'init', '--bare', remote);
    await git(checkout, 'init', '-b', 'main');
    await git(checkout, 'config', 'user.name', 'Release identity test');
    await git(checkout, 'config', 'user.email', 'release-identity@example.invalid');
    await git(checkout, 'remote', 'add', 'origin', remote);
    await writeFile(join(checkout, 'package.json'), '{"version":"0.1.5"}\n');
    await writeFile(join(checkout, 'tracked.txt'), 'published\n');
    await git(checkout, 'add', '.');
    await git(checkout, 'commit', '-m', 'published candidate');
    await git(checkout, 'push', '-u', 'origin', 'main');

    const publishedCommit = await git(checkout, 'rev-parse', 'HEAD');
    await verifyRemoteBranch({ cwd: checkout, expectedCommit: publishedCommit, remote: 'origin', branch: 'main' });

    await writeFile(join(checkout, 'tracked.txt'), 'local only\n');
    await git(checkout, 'add', 'tracked.txt');
    await git(checkout, 'commit', '-m', 'unpublished candidate');
    const unpublished = await createLocalReleaseIdentity({ cwd: checkout });
    await mkdir(site);
    await writeFile(join(site, 'release.json'), `${JSON.stringify(unpublished)}\n`);

    await assert.rejects(
      verifyReleaseIdentity({ cwd: checkout, expectedCommit: unpublished.commit, remote: 'origin', branch: 'main', site }),
      /is not origin\/main/
    );
  } finally {
    await rm(sandbox, { recursive: true, force: true });
  }
});
