#!/usr/bin/env python3
"""Build docs/ folder for GitHub Pages (or any static host)."""
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent  # Confrance/
LEARNING = ROOT / "Research_Intelligence" / "Learning"
APP = LEARNING / "setconca-mastery"
RAW = ROOT / "RAW"
DOCS = ROOT / "docs"
INCLUDE_PDFS = "--no-pdfs" not in sys.argv


def main() -> None:
    print("Building SetConCA Mastery for web deploy...")
    DOCS.mkdir(parents=True, exist_ok=True)

    # papers.js with web-relative PDF paths
    subprocess.check_call(
        [sys.executable, str(LEARNING / "build_curriculum.py"), "--web", "--out", str(DOCS / "papers.js")],
        cwd=str(LEARNING),
    )

    shutil.copy2(APP / "index.html", DOCS / "index.html")

    if INCLUDE_PDFS:
        dest_raw = DOCS / "RAW"
        if dest_raw.exists():
            shutil.rmtree(dest_raw)
        dest_raw.mkdir()
        count = 0
        for pdf in RAW.glob("*.pdf"):
            if pdf.stat().st_size == 0:
                continue
            shutil.copy2(pdf, dest_raw / pdf.name)
            count += 1
        print(f"  Copied {count} PDFs ({sum(f.stat().st_size for f in dest_raw.glob('*.pdf')) / 1e6:.1f} MB)")
    else:
        print("  Skipped PDFs (--no-pdfs). App works; PDF buttons need local files or arXiv links.")

    # GitHub Pages needs this file when not using Actions
    (DOCS / ".nojekyll").touch()

    print(f"\nDone → {DOCS}")
    print("Next: push to GitHub and enable Pages (see DEPLOY.md)")


if __name__ == "__main__":
    main()
