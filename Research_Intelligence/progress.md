# Progress

_Last updated: 2026-07-21_

## Learning curriculum (SetConCA Mastery)

Interactive path built at `Learning/setconca-mastery/index.html` — **43 papers**, **10 levels**, 3-pass learning with demos and quizzes. RAW folder mapped; missing: Toy Models of Superposition (web link in app).

## Current conference

ICLR (active scope)

## Current year

2026 (latest completed cycle: decisions 25 Jan 2026; conference Apr 2026)

## Current paper

Next up: P0 queue item — `Exploratory Causal Inference in SAEnce` (`Ml8t8kQMUP`) or another P0 oral.

## Completed conferences

- None yet.

## Completed papers (full note written)

All 7 ICLR 2026 Tier-1 **Orals** fully read:
1. [[2026 - Temporal Sparse Autoencoders]] — `bojVI4l9Kn` (SAE)
2. [[2026 - Divergent Representations from Causal Interventions]] — `cZrTMqYVL6` (intervention faithfulness)
3. [[2026 - Exploratory Causal Inference in SAEnce]] — `Ml8t8kQMUP` (SAE + causal inference)
4. [[2026 - How Transformers Learn to Associate Tokens]] — `A4Us8jxVGq` (training dynamics theory)
5. [[2026 - Temporal Superposition and Feature Geometry of RNNs]] — `7cMzTpbJHC` (superposition)
6. [[2026 - Shape of Adversarial Influence Persistent Homology]] — `v2PglvLLKT` (TDA / safety)
7. [[2026 - Verifying Chain-of-Thought via Computational Graph]] — `CxiNICq0Rr` (transcoder circuits)

P1 batch (core SAE/mech-interp) — 6 done:
8. [[2026 - AbsTopK Bidirectional SAE Features]] — `EEs6I4cO7S` (SAE architecture)
9. [[2026 - Automated Interp Metrics Random Transformers]] — `USyGD0eUod` (SAE validity/critique)
10. [[2026 - Causality vs Invariance Function and Concept Vectors]] — `LmLmhb6GEL` (concept vectors)
11. [[2026 - Activation Steering with a Feedback Controller]] — `vzkEX2SwFD` (steering; partial read)
12. [[2026 - Bilinear Representation Reversal Curse Model Editing]] — `pdNaYcApbz` (rep geometry / editing)
13. [[2026 - SAEs Racial Biases in Healthcare]] — `HAdITwqwLH` (applied SAE fairness)

## Papers awaiting full reading

- ICLR 2026 reading queue: see `Conferences/ICLR/2026/reading_queue.md`.
  - P0 (Oral): **7/7 done.**
  - P1 (Accepted, Tier-1, core SAE/mech-interp): 86 — **6 done**, 80 remaining.
  - P2 (Accepted, Tier-1, other interpretability): remaining.
  - P3 (Accepted, Tier-2): 156.
  - P4 (Rejected, Tier-1, public reviews): see candidate file.

## Papers awaiting review analysis

- All 13 read papers — OpenReview reviews public but not yet captured. Browser harvest attempt **failed on a usage limit** (no files written); API path is challenge-gated. Retry review harvest in a later session; each note has a Reviewer-feedback callout marking this.

## Unresolved questions / blockers

- **OpenReview access:** `/notes?forum=`, `/notes?content.venueid=`, and `/pdf` endpoints return `ChallengeRequiredError` (403). Only `/notes/search` works. Consequence: reviews + official PDFs are not directly scriptable here. Workarounds: (a) arXiv HTML full text (worked for the first paper), (b) browser MCP for reviews.
- Candidate recall is broad but not exhaustive (fuzzy search, ~47 terms). Some relevant papers may be missing.

## Next actions

1. Incorporate the browser-harvested reviews (in `Conferences/ICLR/2026/reviews/`) into each note's Reviewer feedback section, then fill `reviewer_preferences.md`.
2. Continue P1 (80 remaining) then P2/P3; then P4 rejected-with-reviews for reviewer signal.
3. Add 2025 + 2024 candidate lists for trend analysis (min 3 years) — reuse `_tools/fetch_iclr.py` with the year's group id.
4. Retry full text for the 1 partial note (Activation Steering PID) once a PDF reader path is available.
5. Keep `competitor_map.md` / `author_and_lab_map.md` / `open_problems.md` growing as notes accrue.
