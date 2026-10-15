const cp = require('child_process')

const result = cp.spawnSync(process.execPath, ['build-v3.cjs'], {
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
  ['SOURCE_CHUNK_LENGTH_MISMATCH', 116],
  ['SOURCE_ARCHIVE_SHA1_MISMATCH', 112],
  ['SOURCE_ARCHIVE_SHA256_MISMATCH', 115],
  ['SOURCE_EXTRACTION_FAILED', 113],
]
for (const [marker, code] of exactSourceFailures) {
  if (text.includes(marker)) process.exit(code)
}

if (text.includes('> npm run typecheck')) {
  const files = [
    'playwright.config.ts','src/App.tsx','src/art/florals/FloralCluster.tsx','src/art/florals/FloralPrimitives.tsx','src/art/materials.ts','src/art/palette.ts','src/art/textureAssets.ts','src/assets/photoManifest.ts','src/compatibility/capabilities.ts','src/copy.ts','src/directors/AnimationDirector.tsx','src/directors/AudioDirector.tsx','src/directors/CameraDirector.tsx','src/directors/animationChoreography.ts','src/directors/audioController.ts','src/directors/cameraShots.ts','src/directors/webAudioEngine.ts','src/experience/ExperienceProvider.tsx','src/experience/reducer.ts','src/experience/types.ts','src/main.tsx','src/scene/BirthdayCard.tsx','src/scene/CoverArtwork.tsx','src/scene/Environment.tsx','src/scene/ExperienceScene.tsx','src/scene/Finale.tsx','src/scene/InteriorComposition.tsx','src/scene/LetterScene.tsx','src/scene/LightingRig.tsx','src/scene/PhotoGallery.tsx','src/scene/PhotoInstallation.tsx','src/scene/PhotoMount.tsx','src/scene/photoLayout.ts','src/ui/LetterOverlay.tsx','src/ui/PhotoViewer.tsx','src/ui/UIOverlay.tsx','src/vite-env.d.ts','tests/e2e/birthday-card.mobile.spec.ts','tests/e2e/camera-photo-focus.mobile.spec.ts','tests/e2e/cover-art.mobile.spec.ts','tests/e2e/finale.mobile.spec.ts','tests/e2e/interior-art.mobile.spec.ts','tests/e2e/letter-audio.mobile.spec.ts','tests/e2e/recovery.mobile.spec.ts','tests/e2e/visual-gates.mobile.spec.ts','tests/setup.ts','tests/unit/animationChoreography.test.ts','tests/unit/appCompatibility.test.tsx','tests/unit/audioDirector.test.ts','tests/unit/birthdayCard.test.tsx','tests/unit/cameraShots.test.ts','tests/unit/capabilities.test.ts','tests/unit/finale.test.tsx','tests/unit/interiorComposition.test.tsx','tests/unit/letterOverlay.test.tsx','tests/unit/photoGallery.test.tsx','tests/unit/photoLayout.test.ts','tests/unit/photoManifest.test.ts','tests/unit/photoViewer.test.tsx','tests/unit/reducer.test.ts','vite.config.ts'
  ]
  const match = text.match(/(?:^|\n)([^\n(]+\.(?:ts|tsx))\((\d+),(\d+)\): error TS(\d+):/)
  if (match) {
    const file = match[1].trim().replace(/^\.\//, '')
    const index = files.indexOf(file)
    if (index >= 0) process.exit(100 + index)
  }
  process.exit(23)
}

const stages = [
  ['> npx playwright test', 30],['> npx playwright install chromium', 29],['> npm run build', 28],['> npm run verify:assets', 27],['> npm run verify:photos', 26],['> npm run verify', 25],['> npm run test:native', 24],['> npm run photos:build', 22],['> npm install --no-audit --no-fund', 21],['> node scripts/restore-deployment-photos.mjs', 20],
]
let code = text.includes('SOURCE_ARCHIVE_OK') ? 12 : 114
for (const [marker, stageCode] of stages) {
  if (text.includes(marker)) { code = stageCode; break }
}
process.exit(code)
