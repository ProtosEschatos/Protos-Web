#!/usr/bin/env node
/**
 * Convert public/showcase/* to real optimized JPEGs (Firefox headless saves PNG bytes as .jpg).
 * Run before upload:showcase-assets or sync:showcase-assets.
 */
import { spawnSync } from 'node:child_process'
import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const showcaseDir = join(root, 'public/showcase')

const py = `
import glob, os, sys
from PIL import Image

SHOWCASE = sys.argv[1]
DESKTOP_MAX = (1440, 900)
MOBILE_SIZE = (390, 844)
BG = (2, 6, 23)  # #020617 showcase frame backdrop

def to_rgb(im):
    if im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info):
        base = Image.new("RGB", im.size, BG)
        rgba = im.convert("RGBA")
        base.paste(rgba, mask=rgba.split()[-1])
        return base
    return im.convert("RGB")

def fit(im, max_size):
    im = im.copy()
    im.thumbnail(max_size, Image.Resampling.LANCZOS)
    return im

count = 0
for path in sorted(glob.glob(os.path.join(SHOWCASE, "*.jpg"))):
    name = os.path.basename(path)
    before = os.path.getsize(path)
    im = Image.open(path)
    im = to_rgb(im)
    if name.startswith("desktop-"):
        im = fit(im, DESKTOP_MAX)
    elif name.startswith("mobile-"):
        im = fit(im, MOBILE_SIZE)
    tmp = path + ".tmp"
    im.save(tmp, "JPEG", quality=85, optimize=True, progressive=True)
    os.replace(tmp, path)
    after = os.path.getsize(path)
    print(f"OK {name}: {im.size[0]}x{im.size[1]} {before//1024}KB -> {after//1024}KB")
    count += 1

if count == 0:
    print("No .jpg files in public/showcase/")
    sys.exit(1)
print(f"Normalized {count} showcase JPEG(s).")
`

if (!statSync(showcaseDir).isDirectory()) {
  console.error(`Missing directory: ${showcaseDir}`)
  process.exit(1)
}

const files = readdirSync(showcaseDir).filter((f) => /\.jpe?g$/i.test(f))
if (files.length === 0) {
  console.error('No JPEG files to normalize in public/showcase/')
  process.exit(1)
}

const result = spawnSync('python3', ['-c', py, showcaseDir], { encoding: 'utf8' })
process.stdout.write(result.stdout ?? '')
process.stderr.write(result.stderr ?? '')

if (result.status !== 0) {
  console.error('normalize-showcase-screenshots failed (is python3-pil installed?)')
  process.exit(result.status ?? 1)
}
