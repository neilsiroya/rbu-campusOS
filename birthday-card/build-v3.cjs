const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const cp = require('child_process')

const ROOT = process.cwd()
const APP = path.join(ROOT, 'app')
const RELEASE = path.join(ROOT, 'release-v2')
const PARTS = Array.from({ length: 6 }, (_, i) => path.join(RELEASE, `part-${String(i).padStart(2, '0')}.b64`))
const EXPECTED_SHA1 = 'f97810cc2e1b6c809e88781d35af1e30f3011e12'
const EXPECTED_SHA256 = '7d69e641a48172696e535c01ff3ade27d69b0dac70f8712061606d3a2f0f37b3'

function digest(algo, bytes) {
  return crypto.createHash(algo).update(bytes).digest('hex')
}

function fail(stage, message, code) {
  console.error(`QA_STAGE_FAIL ${stage}: ${message}`)
  process.exit(code)
}

function run(stage, code, cmd, args) {
  console.log(`QA_STAGE_START ${stage}`)
  const result = cp.spawnSync(cmd, args, {
    cwd: APP,
    stdio: 'inherit',
    env: { ...process.env, CI: '1' },
  })
  if (result.error) fail(stage, result.error.stack || String(result.error), code)
  if (result.status !== 0) fail(stage, `${cmd} exited ${result.status}`, code)
  console.log(`QA_STAGE_OK ${stage}`)
}

for (const part of PARTS) {
  if (!fs.existsSync(part)) fail('release-payload', `missing ${path.basename(part)}`, 11)
}

const encoded = PARTS.map((part) => fs.readFileSync(part, 'utf8').trim()).join('')
let archive
try {
  archive = Buffer.from(encoded, 'base64')
} catch (error) {
  fail('release-payload', `invalid base64: ${error}`, 12)
}

const actualSha1 = digest('sha1', archive)
const actualSha256 = digest('sha256', archive)
if (actualSha1 !== EXPECTED_SHA1 || actualSha256 !== EXPECTED_SHA256) {
  fail('release-payload', `archive digest mismatch sha1=${actualSha1} sha256=${actualSha256}`, 12)
}
console.log(`RELEASE_PAYLOAD_OK sha1=${actualSha1}`)

fs.rmSync(APP, { recursive: true, force: true })
fs.mkdirSync(APP, { recursive: true })
const tgz = path.join(RELEASE, 'app.tgz')
fs.writeFileSync(tgz, archive)
const extract = cp.spawnSync('tar', ['-xzf', tgz, '-C', APP], { stdio: 'inherit' })
if (extract.error || extract.status !== 0) fail('release-extraction', String(extract.error || `tar exited ${extract.status}`), 13)
if (!fs.existsSync(path.join(APP, 'package.json')) || !fs.existsSync(path.join(APP, 'src', 'App.tsx'))) {
  fail('release-extraction', 'required app files missing after extraction', 13)
}
console.log('RELEASE_EXTRACTION_OK')

run('photo-restore', 21, 'node', ['scripts/restore-deployment-photos.mjs'])
run('dependency-install', 22, 'npm', ['install', '--no-audit', '--no-fund'])
run('thumbnail-build', 23, 'npm', ['run', 'photos:build'])
run('typecheck', 24, 'npm', ['run', 'typecheck'])
run('photo-integrity', 25, 'npm', ['run', 'verify:photos'])
run('visual-assets', 26, 'npm', ['run', 'verify:assets'])
run('vite-production-build', 27, 'npm', ['run', 'build'])
run('chromium-install', 28, 'npx', ['playwright', 'install', 'chromium'])
run('mobile-browser-qa', 29, 'npx', ['playwright', 'test', '--reporter=line'])

const qaSource = path.join(APP, 'artifacts', 'qa')
const qaDest = path.join(APP, 'dist', 'qa')
if (!fs.existsSync(qaSource)) fail('visual-artifacts', 'artifacts/qa missing after Playwright', 30)
fs.rmSync(qaDest, { recursive: true, force: true })
fs.cpSync(qaSource, qaDest, { recursive: true })

const requiredFrames = [
  '01-cover-portrait.png',
  '02-open-interior.png',
  '03-gallery-explore.png',
  '04-letter.png',
  '05-finale-pullback.png',
]
for (const frame of requiredFrames) {
  if (!fs.existsSync(path.join(qaDest, frame))) fail('visual-artifacts', `missing ${frame}`, 30)
}

console.log('REMOTE_QA_GREEN')
