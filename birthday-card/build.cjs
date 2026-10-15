const fs = require('fs')
const fsp = require('fs/promises')
const path = require('path')
const crypto = require('crypto')
const https = require('https')
const cp = require('child_process')

const ROOT = process.cwd()
const APP = path.join(ROOT, 'app')
const EXPECTED_CORE_SHA1 = '4b6c9e022e2975c21816885a803722d5b11435cf'
const PARTS = Array.from({ length: 7 }, (_, i) => path.join(ROOT, 'qa', `core-part-${String(i).padStart(2, '0')}.b64`))
const PHOTOS = [
  ['photo-01.jpeg','https://d2ol7oe51mr4n9.cloudfront.net/user_3KHf1ALtFsTvxGmy4TkDYHLfuhs/b18f64b8-3557-4a63-895a-1aeead112fb6.jpg','9dc5615ee64ce8c8373adb3fdf9084ad1aaafcbcbc299de0af0f74c47dead430'],
  ['photo-02.jpeg','https://d2ol7oe51mr4n9.cloudfront.net/user_3KHf1ALtFsTvxGmy4TkDYHLfuhs/e0c3e2e5-1f94-4c14-ba3e-9d9ec9b5388c.jpg','8568bd2f1e8f942b2a27be219dfcb7ab5e08f41c1d3209ee956d8ef54ad46949'],
  ['photo-03.jpeg','https://d2ol7oe51mr4n9.cloudfront.net/user_3KHf1ALtFsTvxGmy4TkDYHLfuhs/bf734e94-dcd3-4794-8bbf-afe5b0e2aca7.jpg','91c7ebf969d0a7fed3744eb7120f618e1d9cf639716808532a637b784864bbbe'],
  ['photo-04.jpeg','https://d2ol7oe51mr4n9.cloudfront.net/user_3KHf1ALtFsTvxGmy4TkDYHLfuhs/6427523b-be9f-42c0-be7a-5ea6183cea61.jpg','29d8df95fe2d0ab5045fc124ea48bd7af64453c7fa542066d09c5cf9823797ab'],
  ['photo-05.jpeg','https://d2ol7oe51mr4n9.cloudfront.net/user_3KHf1ALtFsTvxGmy4TkDYHLfuhs/56824fad-bcd3-4cad-938e-b80930cf7a5b.jpg','70cc2851ca9f75a4e55eb912caa9eec09d140ac7e2e97603f298afa6094a7e6f'],
  ['photo-06.jpeg','https://d2ol7oe51mr4n9.cloudfront.net/user_3KHf1ALtFsTvxGmy4TkDYHLfuhs/5cf6b1e1-d5e8-47c3-9cb5-5bd66348a6da.jpg','05e27f9828e7067734a34cfceb8958e83770f9b14bb04b56cbfa19d794fff29d'],
  ['photo-07.jpeg','https://d2ol7oe51mr4n9.cloudfront.net/user_3KHf1ALtFsTvxGmy4TkDYHLfuhs/a2bb6ba1-dc24-4ee4-8577-372fa184198b.jpg','4a7e365cfece99233211288559183fd2afb7205e6bb77f79fa7c2c8bca0254f8'],
  ['photo-08.jpeg','https://d2ol7oe51mr4n9.cloudfront.net/user_3KHf1ALtFsTvxGmy4TkDYHLfuhs/b7f969fd-c87e-46e9-9850-acfe919bec21.jpg','c6ca7bbf200804d30822eccf75dc290fbb1948fce8fe328a26c4fd766e4021e2'],
  ['photo-09.jpeg','https://d2ol7oe51mr4n9.cloudfront.net/user_3KHf1ALtFsTvxGmy4TkDYHLfuhs/575fd67d-5d77-4798-9a4e-2ca7858370b5.jpg','1370de1f7bcb52fa23675409e291fda2a183809fdacb4ab1987582bccada3d90'],
  ['photo-10.jpeg','https://d2ol7oe51mr4n9.cloudfront.net/user_3KHf1ALtFsTvxGmy4TkDYHLfuhs/b690d3fb-e9fd-4b6f-ba7a-ffd1dbcf1be9.jpg','178aecedfef63a55ffb02be11cb8f9a88257f9905f67d3b3b47e65cfe3e290fe'],
]

function digest(algo, bytes) { return crypto.createHash(algo).update(bytes).digest('hex') }
function run(cmd, args, opts = {}) {
  console.log(`> ${cmd} ${args.join(' ')}`)
  cp.execFileSync(cmd, args, { cwd: APP, stdio: 'inherit', env: { ...process.env, CI: '1' }, ...opts })
}
function fetchBytes(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'user-agent': 'birthday-card-build/1.0' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirects < 5) {
        res.resume(); return resolve(fetchBytes(new URL(res.headers.location, url).toString(), redirects + 1))
      }
      if (res.statusCode !== 200) { res.resume(); return reject(new Error(`${url}: HTTP ${res.statusCode}`)) }
      const chunks = []; res.on('data', c => chunks.push(c)); res.on('end', () => resolve(Buffer.concat(chunks))); res.on('error', reject)
    }).on('error', reject)
  })
}

async function main() {
  const core = Buffer.concat(PARTS.map(file => Buffer.from(fs.readFileSync(file, 'utf8').trim(), 'base64')))
  const actual = digest('sha1', core)
  if (actual !== EXPECTED_CORE_SHA1) throw new Error(`SOURCE_ARCHIVE_SHA1_MISMATCH ${actual}`)
  fs.rmSync(APP, { recursive: true, force: true }); fs.mkdirSync(APP, { recursive: true })
  const archive = path.join(ROOT, 'qa', 'current-core.tgz'); fs.writeFileSync(archive, core)
  cp.execFileSync('tar', ['-xzf', archive, '-C', APP], { stdio: 'inherit' })
  if (!fs.existsSync(path.join(APP, 'package.json'))) throw new Error('SOURCE_EXTRACTION_FAILED')
  console.log('SOURCE_ARCHIVE_OK', actual)

  const originals = path.join(APP, 'public/assets/photos/original'); await fsp.mkdir(originals, { recursive: true })
  for (const [name, url, expected] of PHOTOS) {
    const bytes = await fetchBytes(url); const hash = digest('sha256', bytes)
    if (hash !== expected) throw new Error(`PHOTO_SHA256_MISMATCH ${name} ${hash}`)
    await fsp.writeFile(path.join(originals, name), bytes)
  }
  console.log('ORIGINAL_PHOTOS_OK 10/10')

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

  const qaSrc = path.join(APP, 'artifacts/qa'); const qaDest = path.join(APP, 'dist/qa')
  if (!fs.existsSync(qaSrc)) throw new Error('VISUAL_GATE_ARTIFACTS_MISSING')
  fs.cpSync(qaSrc, qaDest, { recursive: true })
  console.log('REMOTE_QA_GREEN')
}
main().catch(err => { console.error(err); process.exit(1) })
