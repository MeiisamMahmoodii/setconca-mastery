---
conference: ICLR
years_covered:
  - 2026
last_updated: 2026-07-17
status: stub
---

# ICLR — Trend Analysis (mechanistic interpretability & representation learning)

> [!warning] Status
> Stub. Trend analysis requires ≥3 years (2026/2025/2024). Only 2026 candidates are pulled. **Do not assert trends yet** — a trend needs multiple papers and cross-year evidence (CLAUDE.md §11).

## Method
For each trend: (1) evidence, (2) representative papers, (3) why it matters, (4) durable vs temporary, (5) implications. Build candidate lists for 2025 and 2024 first (reuse `_tools/fetch_iclr.py` with the year's group id).

## Candidate trends to test (hypotheses, NOT yet established)

- [ ] Structural / non-i.i.d. priors for SAE training (temporal, geometric, manifold). Seed: [[2026 - Temporal Sparse Autoencoders]].
- [ ] Backlash / scrutiny on SAE utility (steering, probing) — AxBench, Kantamneni.
- [ ] Shift from neurons → features → circuits → sparse dictionaries.
- [ ] Automated interpretability evaluation as standard (SAEBench, LLM judges).
- [ ] Safety-relevant internal representations (refusal, jailbreak, monitoring).
- [ ] Growth of representation-geometry / linear-representation analyses.

## Observed in the 2026 Tier-1 Oral slate (single-year signal; needs 2025/2024 to confirm as a trend)

From all 7 Tier-1 orals read:
1. **Validity / faithfulness scrutiny is oral-worthy.** 2 of 7 explicitly question whether interpretability methods measure what they claim (Divergent Representations = off-manifold interventions; T-SAE partly rebuts "SAEs useless for steering"). CRV, too, is about *verifying* rather than *assuming* faithfulness.
   - _Evidence:_ oral selection of a pure "your interventions are off-distribution" paper.
   - _Why it matters:_ reviewers may increasingly demand causal/faithfulness controls, not just behavioral success.
   - _Durable?_ Likely durable (aligns with maturing field). Confirm across years.
2. **Beyond linear directions → nonlinear geometry & topology.** Persistent homology (TDA) and superposition-through-time both won orals.
3. **Transcoders + attribution graphs are becoming standard tooling** (CRV builds on the Anthropic circuit-tracing lineage and ships open transcoders/datasets).
4. **SAEs cross-pollinating with causal inference / other modalities** (SAEnce: SAE + causal RCT analysis on vision/video FMs).
5. **Training-dynamics theory** re-enters interpretability (closed-form early-training weights).

> [!warning] Do not report these as multi-year trends yet. Single 2026 sample (n=7 orals). Build 2025 + 2024 candidate lists (reuse `_tools/fetch_iclr.py` with the year's group id) before asserting direction.

## 2026 vs 2025 vs 2024

_Pending — build prior-year candidate lists._
