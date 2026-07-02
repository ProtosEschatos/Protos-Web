#!/usr/bin/env python3
"""Generate synthwave horizon backdrop for portfolio showcase."""

from __future__ import annotations

import math
import random
from pathlib import Path

from PIL import Image, ImageDraw

W = 4096
H = 2048
OUT = Path(__file__).resolve().parents[1] / "public" / "showcase" / "synthwave-bg.jpg"


def lerp(a: float, b: float, t: float) -> float:
    return a + (b - a) * t


def lerp_color(c1: tuple[int, int, int], c2: tuple[int, int, int], t: float) -> tuple[int, int, int]:
    return (
        int(lerp(c1[0], c2[0], t)),
        int(lerp(c1[1], c2[1], t)),
        int(lerp(c1[2], c2[2], t)),
    )


def draw_sky(img: Image.Image) -> None:
    px = img.load()
    zenith = (10, 0, 36)
    mid = (72, 10, 112)
    dusk = (242, 72, 132)
    horizon = (255, 140, 80)
    for y in range(H):
        t = y / (H - 1)
        if t < 0.55:
            c = lerp_color(zenith, mid, t / 0.55)
        elif t < 0.78:
            c = lerp_color(mid, dusk, (t - 0.55) / 0.23)
        else:
            c = lerp_color(dusk, horizon, (t - 0.78) / 0.22)
        for x in range(W):
            px[x, y] = c


def draw_stars(draw: ImageDraw.ImageDraw) -> None:
    random.seed(42)
    for _ in range(900):
        x = random.randint(0, W - 1)
        y = random.randint(0, int(H * 0.62))
        r = random.choice([1, 1, 1, 2])
        alpha = random.randint(120, 255)
        draw.ellipse((x - r, y - r, x + r, y + r), fill=(255, 255, 255, alpha))


def draw_mountain(draw: ImageDraw.ImageDraw, cx: int, base_y: int, width: int, height: int) -> None:
    left = cx - width // 2
    right = cx + width // 2
    top = base_y - height
    fill = (8, 0, 24)
    outline = (0, 238, 255)
    draw.polygon([(left, base_y), (cx, top), (right, base_y)], fill=fill)
    draw.line([(left, base_y), (cx, top), (right, base_y)], fill=outline, width=3)


def draw_palm(draw: ImageDraw.ImageDraw, x: int, base_y: int, scale: float) -> None:
    trunk_w = max(4, int(14 * scale))
    trunk_h = int(120 * scale)
    top_y = base_y - trunk_h
    draw.rounded_rectangle(
        (x - trunk_w // 2, top_y, x + trunk_w // 2, base_y),
        radius=max(2, int(4 * scale)),
        fill=(0, 0, 0),
    )
    frond_len = int(90 * scale)
    for angle in (-140, -95, -55, -15, 25, 65, 110, 155):
        rad = math.radians(angle)
        ex = x + int(math.cos(rad) * frond_len)
        ey = top_y + int(math.sin(rad) * frond_len * 0.55)
        draw.line([(x, top_y), (ex, ey)], fill=(0, 0, 0), width=max(3, int(8 * scale)))


def draw_sun(img: Image.Image) -> None:
    draw = ImageDraw.Draw(img, "RGBA")
    cx, cy = W // 2, int(H * 0.72)
    radius = int(H * 0.28)

    for r in range(radius + 80, radius, -4):
        t = (r - radius) / 80
        color = (255, int(120 + 80 * t), int(40 + 80 * t), int(30 + 40 * (1 - t)))
        draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=color)

    for y in range(cy - radius, cy + radius):
        t = (y - (cy - radius)) / (radius * 2)
        if t < 0.5:
            c = lerp_color((255, 230, 102), (255, 154, 60), t / 0.5)
        else:
            c = lerp_color((255, 154, 60), (255, 77, 157), (t - 0.5) / 0.5)
        for x in range(cx - radius, cx + radius):
            if (x - cx) ** 2 + (y - cy) ** 2 <= radius**2:
                img.putpixel((x, y), c)

    for y in range(cy + int(radius * 0.05), cy + radius, 12):
        draw.rectangle((cx - radius, y, cx + radius, y + 6), fill=(11, 0, 24))


def draw_mountains(draw: ImageDraw.ImageDraw) -> None:
    base_y = int(H * 0.74)
    specs = [
        (int(W * 0.12), 180, 260),
        (int(W * 0.28), 240, 320),
        (int(W * 0.42), 200, 280),
        (int(W * 0.58), 220, 300),
        (int(W * 0.72), 190, 270),
        (int(W * 0.88), 160, 230),
    ]
    for cx, width, height in specs:
        draw_mountain(draw, cx, base_y, width, height)


def draw_palm_rows(draw: ImageDraw.ImageDraw) -> None:
    base_y = int(H * 0.98)
    for i in range(18):
        t = i / 17
        scale = 0.35 + (1 - t) * 1.65
        x_left = int(W * (0.02 + t * 0.22))
        x_right = W - x_left
        draw_palm(draw, x_left, base_y, scale)
        draw_palm(draw, x_right, base_y, scale * 0.95)


def draw_horizon_glow(img: Image.Image) -> None:
    draw = ImageDraw.Draw(img, "RGBA")
    cx = W // 2
    cy = int(H * 0.74)
    for r in range(500, 0, -2):
        alpha = int(18 * (1 - r / 500))
        draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(255, 80, 160, alpha))


def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    img = Image.new("RGB", (W, H), (0, 0, 0))
    draw_sky(img)
    draw = ImageDraw.Draw(img, "RGBA")
    draw_stars(draw)
    draw_mountains(draw)
    draw_horizon_glow(img)
    draw_sun(img)
    draw = ImageDraw.Draw(img, "RGBA")
    draw_palm_rows(draw)

    img.save(OUT, "JPEG", quality=94, optimize=True, progressive=True)
    print(f"Wrote {OUT} ({OUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
