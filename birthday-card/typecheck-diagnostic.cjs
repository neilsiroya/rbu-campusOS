const fs = require('fs')
const path = require('path')
const cp = require('child_process')

const result = cp.spawnSync(process.execPath, ['build-v3.cjs'], {
  cwd: process.cwd(),
  encoding: 'utf8',
  env: { ...process.env, CI: '1' },
  maxBuffer: 20 * 1024 * 1024,
})

const outDir = path.join(process.cwd(), 'app', 'dist')
fs.mkdirSync(outDir, { recursive: true })
const text = [
  `exitCode=${result.status}`,
  `signal=${result.signal || ''}`,
  result.error ? String(result.error.stack || result.error) : '',
  '--- STDOUT ---',
  result.stdout || '',
  '--- STDERR ---',
  result.stderr || '',
].join('\n')
fs.writeFileSync(path.join(outDir, 'diagnostic.txt'), text)
fs.writeFileSync(path.join(outDir, 'index.html'), '<!doctype html><meta charset="utf-8"><title>QA diagnostic</title><pre>QA diagnostic captured</pre>')
console.log('TYPECHECK_DIAGNOSTIC_CAPTURED', result.status)
process.exit(0)
