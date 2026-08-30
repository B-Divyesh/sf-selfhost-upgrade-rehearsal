import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { promisify } from 'node:util';

const exec = promisify(execFile);
const SHA_PATTERN = /^[a-f0-9]{40}$/;
const DEFAULT_PRODUCT = 'selfhost-upgrade-rehearsal';

async function git(args, cwd) {
  const { stdout } = await exec('git', args, { cwd });
  return stdout.trim();
}

export function assertFullCommitSha(value) {
  if (!SHA_PATTERN.test(value)) {
    throw new Error(`Release commit must be a full lowercase Git SHA, received: ${value || '(empty)'}`);
  }
}

export async function createLocalReleaseIdentity({ cwd = process.cwd(), expectedCommit } = {}) {
  const head = await git(['rev-parse', 'HEAD'], cwd);
  const commit = expectedCommit || head;
  assertFullCommitSha(commit);

  try {
    await git(['cat-file', '-e', `${commit}^{commit}`], cwd);
  } catch {
    throw new Error(`Release commit is not available in this checkout: ${commit}`);
  }

  if (commit !== head) {
    throw new Error(`Release commit ${commit} does not match checkout HEAD ${head}`);
  }

  const packageJson = JSON.parse(await readFile(resolve(cwd, 'package.json'), 'utf8'));
  return {
    schema: 1,
    product: DEFAULT_PRODUCT,
    version: packageJson.version,
    commit
  };
}

export async function verifyRemoteBranch({ cwd = process.cwd(), expectedCommit, remote = 'origin', branch = 'main' }) {
  assertFullCommitSha(expectedCommit);
  const output = await git(['ls-remote', '--heads', remote, `refs/heads/${branch}`], cwd);
  const remoteCommit = output.split(/\s+/)[0] || '';
  if (remoteCommit !== expectedCommit) {
    throw new Error(`Release commit ${expectedCommit} is not ${remote}/${branch}; remote points to ${remoteCommit || '(missing)'}`);
  }
  return remoteCommit;
}

export function assertIdentityMatches(identity, expected) {
  if (identity?.schema !== 1 || identity?.product !== DEFAULT_PRODUCT) {
    throw new Error('Release identity has the wrong schema or product');
  }
  if (identity.version !== expected.version) {
    throw new Error(`Release identity version ${identity.version} does not match ${expected.version}`);
  }
  if (identity.commit !== expected.commit) {
    throw new Error(`Release identity commit ${identity.commit} does not match ${expected.commit}`);
  }
}

async function readSiteIdentity(site) {
  if (/^https?:\/\//.test(site)) {
    const url = new URL('/release.json', site);
    url.searchParams.set('verify', Date.now().toString());
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Release identity request failed with HTTP ${response.status}`);
    return response.json();
  }
  return JSON.parse(await readFile(resolve(site, 'release.json'), 'utf8'));
}

function parseArguments(args) {
  const options = { cwd: process.cwd(), site: 'dist/site' };
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === '--expected') options.expectedCommit = args[++index];
    else if (argument === '--site') options.site = args[++index];
    else if (argument === '--remote') options.remote = args[++index];
    else if (argument === '--branch') options.branch = args[++index];
    else throw new Error(`Unknown release identity option: ${argument}`);
  }
  return options;
}

export async function verifyReleaseIdentity(options = {}) {
  const expected = await createLocalReleaseIdentity({ cwd: options.cwd, expectedCommit: options.expectedCommit });
  if (options.remote) {
    await verifyRemoteBranch({
      cwd: options.cwd,
      expectedCommit: expected.commit,
      remote: options.remote,
      branch: options.branch || 'main'
    });
  }
  const published = await readSiteIdentity(options.site || 'dist/site');
  assertIdentityMatches(published, expected);
  return expected;
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : '';
if (import.meta.url === invokedPath) {
  try {
    const identity = await verifyReleaseIdentity(parseArguments(process.argv.slice(2)));
    process.stdout.write(`Release identity verified: ${identity.commit} (${identity.version})\n`);
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
}
