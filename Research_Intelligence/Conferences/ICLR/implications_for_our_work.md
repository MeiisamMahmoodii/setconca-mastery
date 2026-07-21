---
conference: ICLR
last_updated: 2026-07-17
status: in-progress
---

# Implications for Our Research Program (ICLR)

> [!warning] Preliminary — based on 1 fully read paper. Revisit after broad reading.

## Claims we can still make
- Structural priors for SAEs *at scale with causal validation* remain open (temporal on small models is now taken).
- Faithfulness of semantic SAE features is unresolved.

## Claims already occupied
- "Inject temporal/sequential structure into SAE training" and "temporal consistency improves SAE semantics" → [[2026 - Temporal Sparse Autoencoders]].

## Baselines we must include (SAE feature-quality work)
BatchTopK SAE, Matryoshka SAE, Transcoder, and now Temporal SAE.

## Evaluation methods reviewers likely expect
- k-sparse probing (Kantamneni et al. 2025) for semantic/contextual/syntactic content.
- SAEBench autointerp.
- Steering success-vs-coherence curve (AxBench / Bhalla et al.).
- Reconstruction (FVE, cos sim), fraction alive, activation smoothness.

## Datasets / models / rigor
- Data: Pile (train), MMLU / Wikipedia / FineFineWeb (probing), HH-RLHF (alignment case study).
- Models: go beyond 2 small models; test ≥1 larger model + multiple layers.
- **Seeds:** report ≥3 (this paper reports none — an easy differentiator).
- Robustness: multiple layers, models, datasets; causal/faithfulness checks.

## Likely reviewer objections to preempt
- "Only small models / single layer."
- "No seeds / no significance."
- "Proxy labels — is this really semantics?"
- "Metric is circular (you optimized it)."
- "Correlation, not mechanism."

## Contribution framing options
- **Minimal publishable:** replicate + scale a structural-prior SAE with seeds and one causal check.
- **Strong:** a general framework for structural priors (temporal + geometric + discourse) with causal validation and scaling.
- **Best-case:** a new evaluation/benchmark that operationalizes "semantic faithfulness" of SAE features and settles the SAE-usefulness debate.

## Kill criteria
- If structural priors give no benefit once seeds + larger models are added, or if gains are entirely explained by proxy-label leakage, pivot.
