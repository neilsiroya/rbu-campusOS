const fs = require('fs')
const path = require('path')
const cp = require('child_process')

const result = cp.spawnSync(process.execPath, ['build-v2.cjs'], {
  cwd: process.cwd(),
  encoding: 'utf8',
  env: { ...process.env, CI: '1' },
  maxBuffer: 20 * 1024 * 1024,
})

const outDir = path.join(process.cwd(), 'app', 'dist')
fs.mkdirSync(outDir, { recursive: true })
const payload = {
  diagnosticOnly: true,
  exitCode: result.status,
  signal: result.signal,
  error: result.error ? String(result.error.stack || result.error) : null,
  stdout: (result.stdout || '').slice(-200000),
  stderr: (result.stderr || '').slice(-200000),
}
fs.writeFileSync(path.join(outDir, 'diagnostic.json'), JSON.stringify(payload, null, 2))
console.log('DIAGNOSTIC_CAPTURED', JSON.stringify({ exitCode: result.status, signal: result.signal }))
process.exit(0)
