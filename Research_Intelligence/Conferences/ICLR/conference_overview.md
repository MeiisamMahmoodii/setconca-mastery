---
conference: ICLR
years_covered:
  - 2026
last_updated: 2026-07-17
status: in-progress
---

# ICLR Research Overview

> [!warning] Status
> In-progress. **13 of ~184 Tier-1-accepted (2026) papers fully read: all 7 Tier-1 Orals + 6 core P1 posters (12 complete, 1 partial).** Counts are candidate-set statistics from the OpenReview pull. Synthesis below is grounded in those 13; broader claims await further P1/P2 reading.

## Scope
Mechanistic interpretability, SAEs, representation learning, and adjacent internal-representation work at ICLR.

## Years analyzed
2026 (candidate list + 7 orals). 2025 + 2024 pending (needed for trends; min 3 years).

## Number of candidate papers
2026: 1312 total (340 accepted, 580 rejected, 332 withdrawn, 60 desk-rejected).

## Number of fully read papers
13 (7 Tier-1 Orals + 6 core P1 posters; 1 partial).

## Number of relevant accepted papers
2026: 340 candidates (Tier-1: 184; Tier-2: 156).

## Number of relevant rejected papers with public reviews
2026: 580 candidate rejected (all ICLR reviews public). Not yet analyzed.

## Dominant topics (among Tier-1 orals; preliminary)
The 7 orals span 6 axes: (A) SAE feature quality, (B) causal-intervention faithfulness, (C) SAE for scientific causal inference, (D) training-dynamics theory, (E) superposition/feature geometry, (F) circuits/attribution graphs + CoT faithfulness. SAEs appear in 3 of 7 (A, C, F-adjacent via transcoders).

## Emerging topics (hypotheses)
- **Validity/critique papers** ("does the interpretability method measure what it claims?") — Divergent Representations is a pure faithfulness-of-interventions paper; T-SAE partly rebuts "SAEs useless for steering".
- **Geometry beyond linear directions** — persistent homology (TDA), superposition-through-time.
- **Transcoders + attribution graphs** operationalized into quantitative tools (CRV).

## Declining topics
_Pending (needs 2024/2025)._

## Most influential papers (of those read)
- [[2026 - Divergent Representations from Causal Interventions]] — potentially field-shaping: sets a faithfulness bar for all intervention work.
- [[2026 - Verifying Chain-of-Thought via Computational Graph]] — gives circuit tracing a quantitative eval harness; full FAIR open-source.

## Strongest experimental papers
- CRV (multi-metric, causal interventions, open datasets); Shape of Adversarial Influence (6 models 3.8B–70B, two attack modes).

## Strongest theoretical papers
- How Transformers Learn to Associate Tokens (closed-form training dynamics); Temporal Superposition of RNNs (formal capacity/geometry framework).

## Most relevant papers for our work
- [[2026 - Temporal Sparse Autoencoders]], [[2026 - Divergent Representations from Causal Interventions]], [[2026 - Exploratory Causal Inference in SAEnce]].

## Major benchmarks
SAEBench, Neuronpedia, k-sparse probing (Kantamneni'25), AxBench (steering). CRV releases new step-level labeled datasets.

## Major datasets
The Pile, MMLU, Wikipedia, FineFineWeb, HH-RLHF, plus (CRV) CoT reasoning datasets; (SAEnce) ecology RCT + semi-synthetic; (Adversarial) prompt-injection/backdoor sets.

## Common methods
SAE variants (BatchTopK, Matryoshka, Transcoders), activation patching / DAS, probing, activation steering, attribution graphs, persistent homology.

## Common evaluation patterns
FVE/reconstruction, autointerp via LLM judge, probing accuracy, steering success-vs-coherence, AUROC/AUPR/FPR@95 (CRV), and — increasingly — **off-distribution / faithfulness controls**.

## Recurring weaknesses (observed across the 7)
- Small/single-model scale or single layer (T-SAE: 2 small models; CRV: single Llama-3.1-8B).
- Missing seeds / significance on core metrics (T-SAE).
- Behavioral rather than causal validation — the exact gap Divergent Representations warns about.
- LLM-judge dependence for autointerp/steering.

## Reviewer expectations
_Pending — see `reviewer_preferences.md` (browser review harvest in progress)._

## Active groups and authors
7 orals → 7 labs across Harvard, Stanford, ISTA, UW-Madison, Imperial (×2), Meta FAIR. No single dominant group. See `author_and_lab_map.md`.

## Competitive landscape
See `competitor_map.md` (6 axes).

## Open opportunities
See `open_problems.md`.

## Implications for our research
See `implications_for_our_work.md`.
