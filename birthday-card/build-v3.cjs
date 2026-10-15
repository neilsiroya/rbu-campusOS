const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const cp = require('child_process')

const ROOT = process.cwd()
const APP = path.join(ROOT, 'app')
const PARTS = Array.from({ length: 8 }, (_, i) => path.join(ROOT, 'v3', `core-${String(i).padStart(2, '0')}.b64`))
const EXPECTED_SHA1 = '203cd1662c6356c073b04f25cb9a8b2038322e43'
const EXPECTED_SHA256 = '13adaa1cd2f0e3398193bfb8d8f6a62b62f26571068117397f00e726b878cdf0'

function digest(algo, bytes) {
  return crypto.createHash(algo).update(bytes).digest('hex')
}

function run(cmd, args) {
  console.log(`> ${cmd} ${args.join(' ')}`)
  cp.execFileSync(cmd, args, {
    cwd: APP,
    stdio: 'inherit',
    env: { ...process.env, CI: '1' },
  })
}

function main() {
  for (const file of PARTS) {
    if (!fs.existsSync(file)) throw new Error(`SOURCE_CHUNK_MISSING ${file}`)
  }

  const core = Buffer.concat(PARTS.map((file) => Buffer.from(fs.readFileSync(file, 'utf8').trim(), 'base64')))
  const sha1 = digest('sha1', core)
  const sha256 = digest('sha256', core)
  if (sha1 !== EXPECTED_SHA1) throw new Error(`SOURCE_ARCHIVE_SHA1_MISMATCH ${sha1}`)
  if (sha256 !== EXPECTED_SHA256) throw new Error(`SOURCE_ARCHIVE_SHA256_MISMATCH ${sha256}`)

  fs.rmSync(APP, { recursive: true, force: true })
  fs.mkdirSync(APP, { recursive: true })
  const archive = path.join(ROOT, 'v3', 'current-core.tgz')
  fs.writeFileSync(archive, core)
  cp.execFileSync('tar', ['-xzf', archive, '-C', APP], { stdio: 'inherit' })

  if (!fs.existsSync(path.join(APP, 'package.json'))) throw new Error('SOURCE_EXTRACTION_FAILED package.json')
  if (!fs.existsSync(path.join(APP, 'scripts', 'restore-deployment-photos.mjs'))) throw new Error('SOURCE_EXTRACTION_FAILED restore-deployment-photos.mjs')
  console.log('SOURCE_ARCHIVE_OK', sha1, sha256)

  run('node', ['scripts/restore-deployment-photos.mjs'])
  run('npm', ['install', '--no-audit', '--no-fund'])
  run('npm', ['run', 'photos:build'])
  run('npm', ['run', 'typecheck'])
  run('npm', ['run', 'test:native'])
  run('npm', ['run', 'verify'])
  run('npm', ['run', 'verify:photos'])
  run('npm', ['run', 'verify:assets'])
  run('npm', ['run', 'build'])
  run('npx', ['playwright', 'install', 'chromium'])
  run('npx', ['playwright', 'test', 'tests/e2e/birthday-card.mobile.spec.ts', 'tests/e2e/recovery.mobile.spec.ts', 'tests/e2e/visual-gates.mobile.spec.ts', '--reporter=line'])

  const qaSrc = path.join(APP, 'artifacts', 'qa')
  const qaDest = path.join(APP, 'dist', 'qa')
  if (!fs.existsSync(qaSrc)) throw new Error('VISUAL_GATE_ARTIFACTS_MISSING')
  fs.rmSync(qaDest, { recursive: true, force: true })
  fs.cpSync(qaSrc, qaDest, { recursive: true })
  console.log('REMOTE_QA_GREEN')
}

try {
  main()
} catch (error) {
  console.error(error && error.stack ? error.stack : error)
  process.exit(1)
}
