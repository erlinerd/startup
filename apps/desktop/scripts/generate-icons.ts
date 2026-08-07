/* oxlint-disable no-console -- CLI script logging */
/**
 * Generate electron-builder icons from the source favicon.png (512x512).
 *
 * - `build/icon.png` (512x512) is a **tracked source asset** used by the
 *   Windows / Linux packaging (electron-builder converts it to .ico).
 *   Regenerate it on macOS with: sips -s format png -z 512 512 public/favicon.png --out build/icon.png
 * - `build/icon.icns` (macOS) is **generated here** and gitignored:
 *
 * Usage: pnpm --filter desktop icons:generate
 *   - on macOS: regenerates icon.png + builds icon.icns (sips + iconutil)
 *   - on Windows/Linux: no-op (icon.png is already tracked)
 *
 * Source is a PNG (not SVG) because `sips` cannot rasterize SVG.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = join(root, 'public')
const buildDir = join(root, 'build')
const source = join(publicDir, 'favicon.png')

// Not macOS: icon.png is already in git — nothing to do here.
if (process.platform !== 'darwin') {
  console.log('[icons] non-macOS: icon.png is a tracked asset; skipping icns.')
  process.exit(0)
}

if (!existsSync(source)) {
  console.error(`[icons] source not found: ${source}`)
  process.exit(1)
}
mkdirSync(buildDir, { recursive: true })

function sh(cmd: string, args: string[]) {
  try {
    execFileSync(cmd, args, { stdio: 'pipe' })
  } catch (err) {
    console.error(`[icons] failed: ${cmd} ${args.join(' ')}`)
    throw err
  }
}

// Refresh the tracked png too, so a favicon change propagates everywhere.
sh('sips', [
  '-s',
  'format',
  'png',
  '-z',
  '512',
  '512',
  source,
  '--out',
  join(buildDir, 'icon.png'),
])
console.log('[icons] icon.png (512x512 — win/linux source)')

// macOS: iconset -> icns
const iconset = join(buildDir, 'icon.iconset')
rmSync(iconset, { recursive: true, force: true })
mkdirSync(iconset, { recursive: true })

const sizes: Array<[number, string]> = [
  [16, 'icon_16x16.png'],
  [32, 'icon_16x16@2x.png'],
  [32, 'icon_32x32.png'],
  [64, 'icon_32x32@2x.png'],
  [128, 'icon_128x128.png'],
  [256, 'icon_128x128@2x.png'],
  [256, 'icon_256x256.png'],
  [512, 'icon_256x256@2x.png'],
  [512, 'icon_512x512.png'],
  [1024, 'icon_512x512@2x.png'],
]
for (const [px, name] of sizes) {
  sh('sips', [
    '-s',
    'format',
    'png',
    '-z',
    String(px),
    String(px),
    source,
    '--out',
    join(iconset, name),
  ])
}
sh('iconutil', ['-c', 'icns', iconset, '-o', join(buildDir, 'icon.icns')])
console.log('[icons] icon.icns (macos)')
