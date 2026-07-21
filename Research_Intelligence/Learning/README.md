# SetConCA Mastery — Interactive Learning Path

A self-paced, multimedia curriculum covering **43 papers** across **10 levels**, designed to take you from representation-learning foundations to multi-view sparse autoencoder research (SetConCA).

## Quick start

1. Open the interactive app in your browser:

   ```
   Research_Intelligence/Learning/setconca-mastery/index.html
   ```

   Double-click the file, or run:

   ```powershell
   Start-Process "c:\Users\MPC\Documents\Confrance\Research_Intelligence\Learning\setconca-mastery\index.html"
   ```

2. Work **level by level**, **paper by paper**.
3. For each paper, complete **three passes**:
   - **Concept** — abstract, figures, intro, conclusion + interactive demo
   - **Technical** — objective, assumptions, architecture, evaluation
   - **Research** — challenge an assumption, plan a reproduction, apply to SetConCA

Progress and research notes are saved in your browser (`localStorage`).

## What's included

| Feature | Description |
|---------|-------------|
| 10 levels | Matches your curriculum from PCA/ICA/CCA → SetConCA papers |
| Local PDF links | Opens papers from `RAW/` folder |
| Interactive demos | PCA reconstruction, ICA mixing, CCA views, SAE diagram, alignment/uniformity, set pooling, superposition |
| Quizzes | Quick checks with explanations |
| Text-to-speech | Listen to SetConCA connection summaries |
| YouTube embeds | Shlens PCA/ICA tutorials where available |
| Metric table | Level 6 — what each evaluation test does and does not prove |
| 16-week schedule | Built into Level 1 dashboard |
| Research notebook | Per-paper fields for assumptions, reproductions, SetConCA ideas |

## Your RAW folder

**43 PDFs mapped.** Notes:

1. **Toy Models of Superposition** — `RAW/2209.pdf` (62 pages, full rich module in app)
2. **`2209.10652v1.pdf`** — duplicate of the same paper
3. **Transformer Circuits framework** — web link only (different from superposition paper)
4. **`248_Feature_Hedging_Correlated.pdf`** — empty; use `2505.11756v2.pdf`

## Rebuild curriculum data

After adding PDFs to `RAW/`:

```powershell
python Research_Intelligence/Learning/build_curriculum.py
```

Then refresh the browser.

## Recommended workflow

1. **Week 1–2:** Level 1 + run PCA/ICA/CCA checkpoint on Gemma activations
2. Mark each pass complete only after you can explain the idea without the PDF
3. Fill in **Research pass** notes — these become your SetConCA hypothesis doc
4. At Level 6, build the evaluation notebook before training new SAE variants
5. At Level 10, write 3 concrete research hypotheses

## Core question (Level 10)

> Under what assumptions does multi-view supervision cause a sparse dictionary to recover more stable, complete, specific, or causally useful concepts than a pointwise SAE?

Every paper connects back to this via the **SetConCA connection** callout.

## SetConCA formula

```
SetConCA = Sparse dictionary learning + Multi-view learning + Set representation + Contrastive coordination
```

---

To schedule a weekly research watch for new SAE papers, say **"set it up"** in chat.
