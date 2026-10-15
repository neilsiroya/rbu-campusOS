const cp = require('child_process')

const result = cp.spawnSync(process.execPath, ['build-v2.cjs'], {
  cwd: process.cwd(),
  encoding: 'utf8',
  env: { ...process.env, CI: '1' },
  maxBuffer: 20 * 1024 * 1024,
})

const text = `${result.stdout || ''}\n${result.stderr || ''}`
if (result.status === 0) {
  console.log('DIAGNOSTIC_FULL_BUILD_GREEN')
  process.exit(0)
}

const exactSourceFailures = [
  ['SOURCE_CHUNK_MISSING', 111],
  ['SOURCE_ARCHIVE_SHA1_MISMATCH', 112],
  ['SOURCE_EXTRACTION_FAILED', 113],
]
for (const [marker, code] of exactSourceFailures) {
  if (text.includes(marker)) {
    console.error(`DIAGNOSTIC_SOURCE_CODE=${code}`)
    process.exit(code)
  }
}

const stages = [
  ['npx playwright test', 30],
  ['npx playwright install chromium', 29],
  ['> npm run build', 28],
  ['> npm run verify:assets', 27],
  ['> npm run verify:photos', 26],
  ['> npm run verify', 25],
  ['> npm run test:native', 24],
  ['> npm run typecheck', 23],
  ['> npm run photos:build', 22],
  ['> npm install --no-audit --no-fund', 21],
]
let code = text.includes('ORIGINAL_PHOTOS_OK 10/10') ? 20 : (text.includes('SOURCE_ARCHIVE_OK') ? 12 : 114)
for (const [marker, stageCode] of stages) {
  if (text.includes(marker)) { code = stageCode; break }
}
console.error(`DIAGNOSTIC_STAGE_CODE=${code}`)
process.exit(code)
