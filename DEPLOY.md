# Deploy SetConCA Mastery — access from anywhere

Yes — this app is **plain HTML + JavaScript**, so it runs on any static host. **GitHub Pages is the easiest free option.**

## Quick answer

| Host | Free? | PDFs included? | URL example |
|------|-------|----------------|-------------|
| **GitHub Pages** | Yes (public repo) | Yes, if you push `RAW/` | `https://YOUR_USER.github.io/Confrance/` |
| **Netlify** | Yes | Drag-drop `docs/` folder | `https://random-name.netlify.app` |
| **Cloudflare Pages** | Yes | Connect git or upload | `https://setconca.pages.dev` |

Progress saves in **browser localStorage** (per device/browser) — not synced unless you add a backend later.

---

## Option A — GitHub Pages (recommended)

### 1. Build the site folder

```powershell
cd c:\Users\MPC\Documents\Confrance
python Research_Intelligence\Learning\deploy_pages.py
```

This creates `docs/` with:
- `index.html` + `papers.js`
- `RAW/*.pdf` (~176 MB of papers)

App-only (no PDFs, smaller repo):

```powershell
python Research_Intelligence\Learning\deploy_pages.py --no-pdfs
```

### 2. Create a GitHub repo

1. Go to [github.com/new](https://github.com/new)
2. Name it e.g. `Confrance` or `setconca-mastery`
3. **Public** repo required for free GitHub Pages (unless you have GitHub Pro for private Pages)

### 3. Push the project

```powershell
cd c:\Users\MPC\Documents\Confrance
git init
git add docs/ .github/ .gitignore DEPLOY.md Research_Intelligence/Learning/
git add RAW/   # only if you want PDFs online — see copyright note below
git commit -m "Add SetConCA Mastery web app for GitHub Pages"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 4. Enable GitHub Pages

**Method 1 — GitHub Actions (already configured)**

1. Repo → **Settings** → **Pages**
2. **Build and deployment** → Source: **GitHub Actions**
3. After push, Actions tab runs `Deploy GitHub Pages` automatically
4. Live in ~1–2 minutes at `https://YOUR_USERNAME.github.io/YOUR_REPO/`

**Method 2 — Deploy from branch (simpler, no Actions)**

1. Run `deploy_pages.py` locally
2. Commit the `docs/` folder
3. Settings → Pages → Source: **Deploy from branch**
4. Branch: `main`, folder: **`/docs`**

---

## Option B — Netlify (no git required)

1. Run `deploy_pages.py`
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag the entire `docs/` folder onto the page
4. Instant URL — rename in Site settings → Domain management

---

## Option C — Your own server

Upload contents of `docs/` to any web root (nginx, Apache, S3 + CloudFront, etc.).

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

---

## PDFs on a public repo — important

Your `RAW/` folder contains copyrighted papers. Options:

1. **Private learning** — keep repo **private**, use Netlify with password protection, or self-host
2. **App only on GitHub** — deploy with `--no-pdfs`; read papers locally from `RAW/`
3. **Public app** — only if you're comfortable with PDF visibility (many arXiv papers are already public)

---

## After deploy — rebuild when you change the app

```powershell
python Research_Intelligence\Learning\build_curriculum.py          # local paths
python Research_Intelligence\Learning\deploy_pages.py            # web build
git add docs/
git commit -m "Update curriculum"
git push
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Blank page | Open browser console; ensure `papers.js` loads (same folder as index) |
| PDF 404 | Re-run `deploy_pages.py` with PDFs; check `docs/RAW/` exists on host |
| Wrong base URL | All links are relative — works on any subpath (`/repo-name/`) |
| Progress lost | localStorage is per-browser; export notes from Research pass manually |

---

## Local vs web paths

| Build | PDF path in papers.js |
|-------|------------------------|
| Local (`build_curriculum.py`) | `../../../RAW/file.pdf` |
| Web (`deploy_pages.py`) | `RAW/file.pdf` |
