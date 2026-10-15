const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const cp = require('child_process')

const ROOT = process.cwd()
const APP = path.join(ROOT, 'app')
const ARCHIVE = path.join(ROOT, 'core.tgz')
const EXPECTED_CORE_SHA256 = '0bdeea07b4adf71969f914f55c577c78d1ac2f298eb6c7478f4ec50802270adc'

function digest(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex')
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
  const core = fs.readFileSync(ARCHIVE)
  const actual = digest(core)
  if (actual !== EXPECTED_CORE_SHA256) {
    throw new Error(`SOURCE_ARCHIVE_SHA256_MISMATCH ${actual}`)
  }

  fs.rmSync(APP, { recursive: true, force: true })
  fs.mkdirSync(APP, { recursive: true })
  cp.execFileSync('tar', ['-xzf', ARCHIVE, '-C', APP], { stdio: 'inherit' })
  if (!fs.existsSync(path.join(APP, 'package.json'))) {
    throw new Error('SOURCE_EXTRACTION_FAILED')
  }
  console.log('SOURCE_ARCHIVE_OK', actual)

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
  run('npx', [
    'playwright', 'test',
    'tests/e2e/birthday-card.mobile.spec.ts',
    'tests/e2e/recovery.mobile.spec.ts',
    'tests/e2e/visual-gates.mobile.spec.ts',
    '--reporter=line',
  ])

  const qaSrc = path.join(APP, 'artifacts/qa')
  const qaDest = path.join(APP, 'dist/qa')
  if (!fs.existsSync(qaSrc)) throw new Error('VISUAL_GATE_ARTIFACTS_MISSING')
  fs.cpSync(qaSrc, qaDest, { recursive: true })
  console.log('REMOTE_QA_GREEN')
}

try {
  main()
} catch (error) {
  console.error(error)
  process.exit(1)
}
