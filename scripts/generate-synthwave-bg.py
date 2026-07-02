#!/usr/bin/env python3
"""Synthwave sky + horizon backdrop (no grid — grid is animated in WebGL)."""

from __future__ import annotations

import math
import random
from pathlib import Path

from PIL import Image, ImageDraw

W = 3840
H = 2160
OUT = Path(__file__).resolve().parents[1] / "public" / "showcase" / "synthwave-bg.jpg"
HORIZON = int(H * 0.52)


def lerp(a: float, b: float, t: float) -> float:
    return a + (b - a) * t


def lerp3(a: tuple[int, int, int], b: tuple[int, int, int], t: float) -> tuple[int, int, int]:
    return (int(lerp(a[0], b[0], t)), int(lerp(a[1], b[1], t)), int(lerp(a[2], b[2], t)))


def sky(img: Image.Image) -> None:
    px = img.load()
    for y in range(HORIZON):
        t = y / max(1, HORIZON - 1)
        if t < 0.55:
            c = lerp3((8, 0, 28), (48, 8, 88), t / 0.55)
        else:
            c = lerp3((48, 8, 88), (255, 96, 148), (t - 0.55) / 0.45)
        for x in range(W):
            px[x, y] = c


def fade_bottom(img: Image.Image) -> None:
    px = img.load()
    for y in range(HORIZON, H):
        t = (y - HORIZON) / (H - HORIZON)
        for x in range(W):
            r, g, b = px[x, HORIZON - 1]
            f = 1.0 - t**1.6
            px[x, y] = (int(r * f * 0.15), int(g * f * 0.08), int(b * f * 0.2))


def stars(draw: ImageDraw.ImageDraw) -> None:
    random.seed(7)
    for _ in range(1200):
        x = random.randint(0, W - 1)
        y = random.randint(0, int(HORIZON * 0.88))
        s = random.choice([1, 1, 2])
        a = random.randint(140, 255)
        draw.ellipse((x - s, y - s, x + s, y + s), fill=(255, 255, 255, a))


def mountain(draw: ImageDraw.ImageDraw, cx: int, w: int, h: int) -> None:
    left, right = cx - w // 2, cx + w // 2
    top = HORIZON - h
    draw.polygon([(left, HORIZON), (cx, top), (right, HORIZON)], fill=(6, 0, 18))
    draw.line([(left, HORIZON), (cx, top), (right, HORIZON)], fill=(0, 235, 255), width=max(2, w // 40))


def mountains(draw: ImageDraw.ImageDraw) -> None:
    specs = [
        (int(W * 0.11), 340, 420),
        (int(W * 0.26), 420, 520),
        (int(W * 0.41), 360, 460),
        (int(W * 0.59), 380, 480),
        (int(W * 0.74), 320, 430),
        (int(W * 0.89), 280, 380),
    ]
    for cx, w, h in specs:
        mountain(draw, cx, w, h)


def sun(img: Image.Image) -> None:
    draw = ImageDraw.Draw(img, "RGBA")
    cx, cy = W // 2, HORIZON + int(H * 0.02)
    r = int(H * 0.22)

    for ring in range(r + 120, r, -3):
        t = (ring - r) / 120
        draw.ellipse(
            (cx - ring, cy - ring, cx + ring, cy + ring),
            fill=(255, int(100 + 80 * t), int(40 + 60 * t), int(35 * (1 - t))),
        )

    for y in range(cy - r, cy + r):
        t = (y - (cy - r)) / (2 * r)
        if t < 0.5:
            c = lerp3((255, 236, 120), (255, 148, 48), t / 0.5)
        else:
            c = lerp3((255, 148, 48), (255, 72, 150), (t - 0.5) / 0.5)
        for x in range(cx - r, cx + r):
            if (x - cx) ** 2 + (y - cy) ** 2 <= r * r:
                img.putpixel((x, y), c)

    draw = ImageDraw.Draw(img, "RGBA")
    for y in range(cy + int(r * 0.08), cy + r, 16):
        draw.rectangle((cx - r, y, cx + r, y + 8), fill=(8, 0, 20))


def palm(draw: ImageDraw.ImageDraw, x: int, base: int, scale: float) -> None:
    tw = max(6, int(22 * scale))
    th = int(180 * scale)
    top = base - th
    draw.rounded_rectangle((x - tw // 2, top, x + tw // 2, base), radius=int(8 * scale), fill=(0, 0, 0))
    for deg in (-150, -115, -78, -42, -8, 28, 62, 98, 132, 168):
        rad = math.radians(deg)
        lx = x + int(math.cos(rad) * 130 * scale)
        ly = top + int(math.sin(rad) * 70 * scale)
        draw.line([(x, top), (lx, ly)], fill=(0, 0, 0), width=max(4, int(14 * scale)))


def palm_rows(draw: ImageDraw.ImageDraw) -> None:
    base = HORIZON + int(H * 0.06)
    for i in range(14):
        t = i / 13
        scale = 0.55 + (1 - t) * 2.2
        xl = int(W * (0.02 + t * 0.24))
        xr = W - xl
        palm(draw, xl, base, scale)
        palm(draw, xr, base, scale * 0.94)


def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    img = Image.new("RGB", (W, H), (0, 0, 0))
    sky(img)
    draw = ImageDraw.Draw(img, "RGBA")
    stars(draw)
    mountains(draw)
    sun(img)
    draw = ImageDraw.Draw(img, "RGBA")
    palm_rows(draw)
    fade_bottom(img)
    img.save(OUT, "JPEG", quality=95, optimize=True, progressive=True)
    print(f"Wrote {OUT} ({OUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
