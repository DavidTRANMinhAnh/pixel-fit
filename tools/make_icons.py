"""Génère les icônes pixel art de l'appli (haltère sur fond sombre)."""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Grille 16x16 : . fond, k contour, g vert, w reflet
ART = [
    "................",
    "................",
    "................",
    "..kkk......kkk..",
    ".kgggk....kgggk.",
    ".kgwgk....kgwgk.",
    "kkgggkkkkkkgggkk",
    "kgggggwwwwgggggk",
    "kggggggggggggggk",
    "kkgggkkkkkkgggkk",
    ".kgggk....kgggk.",
    ".kgggk....kgggk.",
    "..kkk......kkk..",
    "................",
    "................",
    "................",
]
COL = {".": (26, 28, 44), "k": (10, 10, 18), "g": (56, 183, 100), "w": (167, 240, 112)}
SIZES = [72, 96, 128, 144, 152, 192, 384, 512]

base = Image.new("RGB", (16, 16))
for y, row in enumerate(ART):
    for x, c in enumerate(row):
        base.putpixel((x, y), COL[c])
for s in SIZES:
    # marge "maskable" : l'image occupe 80 % au centre
    canvas = Image.new("RGB", (s, s), COL["."])
    inner = int(s * 0.8) // 16 * 16 or 16
    im = base.resize((inner, inner), Image.NEAREST)
    canvas.paste(im, ((s - inner) // 2, (s - inner) // 2))
    canvas.save(os.path.join(ROOT, "public", "icons", f"icon-{s}x{s}.png"))
fav = base.resize((32, 32), Image.NEAREST)
fav.save(os.path.join(ROOT, "public", "favicon.ico"), sizes=[(32, 32)])
