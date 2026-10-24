"""Renders the 1200x630 share images listed in scripts/site/og-manifest.json.

    python3 scripts/site/render-og.py <dm-serif-ttf> <sans-ttf>

Needs Pillow. The lit hearts in assets/og/src/heart-<family>.png are renders of the site's
own WebGL heart (scripts/site/README in scripts/README.md says how to refresh them).
"""
import json, os, sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
SERIF, SANS = sys.argv[1], sys.argv[2]
OUT = os.path.join(ROOT, 'assets/og')
SRC = os.path.join(OUT, 'src')
W, H = 1200, 630
BG = (14, 9, 16)
ACCENT = {'attachment': (221, 160, 184), 'loveStyle': (192, 160, 220), 'conflict': (152, 164, 220), 'profile': (232, 200, 216), 'full': (232, 200, 216)}
GLOW = {'attachment': [(192, 112, 144)], 'loveStyle': [(160, 128, 192)], 'conflict': [(112, 128, 192)], 'profile': [(176, 133, 160)], 'full': [(192, 112, 144), (112, 128, 192)]}

def blob(size, color, radius, alpha):
    layer = Image.new('RGBA', size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    x, y = color[1]
    d.ellipse((x - radius, y - radius, x + radius, y + radius), fill=color[0] + (alpha,))
    return layer.filter(ImageFilter.GaussianBlur(radius * 0.55))

def wrap(draw, text, font, width):
    words, lines, cur = text.split(), [], ''
    for w in words:
        t = (cur + ' ' + w).strip()
        if draw.textlength(t, font=font) <= width: cur = t
        else: lines.append(cur); cur = w
    if cur: lines.append(cur)
    return lines

def render(item):
    fam = item.get('family', 'full')
    img = Image.new('RGBA', (W, H), BG + (255,))
    glows = GLOW.get(fam, GLOW['full'])
    img.alpha_composite(blob((W, H), (glows[0], (-40, 120)), 320, 120))
    img.alpha_composite(blob((W, H), (glows[-1], (W + 60, H + 40)), 300, 80))
    # Edge light: a thin bright rim on the left, like the glass in the app.
    rim = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(rim).rounded_rectangle((6, 6, W - 6, H - 6), radius=46, outline=ACCENT[fam] + (150,), width=3)
    mask = Image.new('L', (W, H), 0)
    ImageDraw.Draw(mask).ellipse((-500, -260, 520, 700), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(120))
    rim.putalpha(Image.composite(rim.getchannel('A'), Image.new('L', (W, H), 0), mask))
    img.alpha_composite(rim.filter(ImageFilter.GaussianBlur(1.2)))
    heart = Image.open(os.path.join(SRC, f'heart-{fam if os.path.exists(os.path.join(SRC, f"heart-{fam}.png")) else "full"}.png')).convert('RGBA')
    heart = heart.resize((560, 560), Image.LANCZOS)
    img.alpha_composite(heart, (W - 560 + 30, (H - 560) // 2 + 10))
    d = ImageDraw.Draw(img)
    x = 72
    label = ImageFont.truetype(SANS, 20)
    eyebrow = item.get('eyebrow', '')
    cx = x
    for ch in eyebrow:
        d.text((cx, 96), ch, font=label, fill=ACCENT[fam])
        cx += d.textlength(ch, font=label) + 3.2
    title_font = ImageFont.truetype(SERIF, 76)
    lines = wrap(d, item['title'], title_font, 640)
    if len(lines) > 3:
        title_font = ImageFont.truetype(SERIF, 60)
        lines = wrap(d, item['title'], title_font, 660)
    y = 142
    lh = int(title_font.size * 1.06)
    for ln in lines:
        d.text((x, y), ln, font=title_font, fill=(245, 238, 242))
        y += lh
    if item.get('sub'):
        sub_font = ImageFont.truetype(SERIF, 40)
        for ln in wrap(d, item['sub'], sub_font, 620)[:2]:
            d.text((x, y + 6), ln, font=sub_font, fill=(128, 116, 124))
            y += 48
    mark = ImageFont.truetype(SANS, 19)
    cx = x
    for ch in 'LOVETYPE':
        d.text((cx, H - 84), ch, font=mark, fill=(245, 238, 242))
        cx += d.textlength(ch, font=mark) + 6.5
    d.text((cx + 14, H - 84), 'Relationship test · free on iPhone', font=ImageFont.truetype(SANS, 19), fill=(138, 126, 134))
    img.convert('RGB').save(os.path.join(OUT, item['name'] + '.jpg'), quality=86, optimize=True, progressive=True)

if __name__ == '__main__':
    items = json.load(open(os.path.join(ROOT, 'scripts/site/og-manifest.json')))
    os.makedirs(OUT, exist_ok=True)
    for it in items: render(it)
    print('rendered', len(items))
