"""Construit src/app/data/exercises.ts et public/img/ex/* à partir de Free Exercise DB.

Usage : python3 tools/build_data.py chemin/vers/exercises.json
Les images sont téléchargées depuis GitHub puis réduites (360 px de large).
"""
import io
import json
import os
import sys
import urllib.request

from PIL import Image

sys.path.insert(0, os.path.dirname(__file__))
from curation import EX  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/"

MUSCLES = {
    "quadriceps": "quadriceps", "shoulders": "epaules", "abdominals": "abdos",
    "chest": "pectoraux", "hamstrings": "ischios", "triceps": "triceps",
    "biceps": "biceps", "lats": "dorsaux", "middle back": "haut_dos",
    "calves": "mollets", "lower back": "lombaires", "forearms": "avant_bras",
    "glutes": "fessiers", "traps": "trapezes", "adductors": "adducteurs",
    "abductors": "abducteurs", "neck": "cou",
}
LEVEL = {"beginner": 1, "intermediate": 2, "expert": 3}


def main(src):
    db = {x["id"]: x for x in json.load(open(src))}
    out = []
    os.makedirs(os.path.join(ROOT, "public", "img", "ex"), exist_ok=True)
    for sid, (name, eq, typ, mode, cues) in EX.items():
        s = db[sid]
        slug = sid.lower().replace("_", "-")
        imgs = []
        for i, rel in enumerate(s["images"][:2]):
            dest = os.path.join(ROOT, "public", "img", "ex", f"{slug}-{i}.jpg")
            if not os.path.exists(dest):
                data = urllib.request.urlopen(RAW + rel, timeout=30).read()
                im = Image.open(io.BytesIO(data)).convert("RGB")
                w = 360
                im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
                im.save(dest, "JPEG", quality=68, optimize=True, progressive=True)
            imgs.append(f"img/ex/{slug}-{i}.jpg")
        lvl = LEVEL.get(s["level"], 1)
        if sid in ("Natural_Glute_Ham_Raise", "Plyo_Push-up", "Pullups", "Dips_-_Triceps_Version"):
            lvl = max(lvl, 2)
        out.append({
            "id": slug, "nom": name, "materiel": eq, "type": typ, "mode": mode,
            "niveau": lvl,
            "muscles": [MUSCLES[m] for m in s["primaryMuscles"]],
            "secondaires": [MUSCLES[m] for m in s["secondaryMuscles"]],
            "consignes": cues, "images": imgs, "source": sid,
        })
    ts = "// Généré par tools/build_data.py. Images : Free Exercise DB (Unlicense, domaine public).\n"
    ts += "import { Exercise } from '../models';\n\n"
    ts += "export const EXERCISES: Exercise[] = " + json.dumps(out, ensure_ascii=False, indent=1) + ";\n"
    os.makedirs(os.path.join(ROOT, "src", "app", "data"), exist_ok=True)
    open(os.path.join(ROOT, "src", "app", "data", "exercises.ts"), "w").write(ts)
    print(len(out), "exercices")


if __name__ == "__main__":
    main(sys.argv[1])
