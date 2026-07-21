---
conference: ICLR
last_updated: 2026-07-17
status: in-progress
---

# ICLR — Open Problems

> [!note] Each problem: statement, evidence it's open, papers exposing gap, why current methods fail, MVP experiment, strong-paper experiment, venue fit, novelty risk, difficulty, compute, data, baselines, failure modes (CLAUDE.md §16). Seeded from 7 Tier-1 orals.

## OP-1: Structural priors for SAEs at scale, with causal validation
- **Statement:** temporal/structural priors improve SAE semantics on small models, but scaling and causal validity are untested.
- **Evidence open:** [[2026 - Temporal Sparse Autoencoders]] uses Pythia-160m + Gemma2-2b, single layers, no seeds, no faithfulness test.
- **MVP:** replicate on ≥1 larger model, ≥3 layers, ≥3 seeds, report variance.
- **Strong:** add causal patching (necessity+sufficiency) for high-level features; scale sweep.
- **Venue:** ICLR/NeurIPS. Novelty: medium. Difficulty: medium. Compute: moderate. Baselines: Matryoshka, BatchTopK, Transcoder, T-SAE.

## OP-2: On-manifold interventions as standard practice
- **Statement:** patching/DAS/SAE reconstruction push activations off the natural manifold; "pernicious" divergences can flip behavior via hidden pathways, so behavioral success ≠ mechanism.
- **Evidence open:** [[2026 - Divergent Representations from Causal Interventions]] shows this theoretically + on real LLMs (EMD), but demonstrates *pernicious* divergence mostly on synthetic circuits and lacks an automatic pernicious-vs-harmless classifier.
- **MVP:** build a detector that flags pernicious divergence in real LLMs (e.g., null-space vs active-pathway test) and audit popular SAE-steering results with it.
- **Strong:** a manifold-constrained intervention method that provably stays on-distribution while preserving interpretive power; benchmark faithfulness gains.
- **Failure modes:** manifold estimation in high-d is hard; controls may be expensive.

## OP-3: Faithfulness of "semantic" SAE features
- **Statement:** semantic SAE gains are measured vs proxy labels (topic, POS) + LLM judges; unclear the features are what the model uses.
- **Papers:** T-SAE, SAEnce (entanglement), Divergent Representations (validity).
- **MVP:** causal link a claimed semantic feature to a behavior with negative controls.

## OP-4: SAE-based causal effect discovery on LLM internals
- **Statement:** SAEnce does unsupervised causal effect discovery over **vision/video** FM embeddings; the same Neural Effect Search over **LLM residual-stream SAEs** is unexplored.
- **Evidence open:** [[2026 - Exploratory Causal Inference in SAEnce]] explicitly leaves LLM-internals transfer + identifiability certification open.
- **MVP:** apply NES to LLM SAE features to discover which features causally mediate a controlled intervention.

## OP-5: Superposition-through-time in real sequence models
- **Statement:** temporal superposition is characterized in linear/nonlinear toy RNNs; not validated in trained SSMs (Mamba) or transformers on natural data.
- **Paper:** [[2026 - Temporal Superposition and Feature Geometry of RNNs]].
- **MVP:** measure the predicted dense→sparse regimes and time-indexed feature directions in a trained small SSM; relax temporal-independence/sparsity assumptions.

## OP-6: Geometry/topology as a deployable monitor
- **Statement:** persistent-homology "topological compression" discriminates adversarial inputs post-hoc across 6 models; not yet per-prompt real-time, causal, or SAE-integrated.
- **Paper:** [[2026 - Shape of Adversarial Influence Persistent Homology]].
- **MVP:** a cheap streaming PH-based (or PH-approximating) detector usable at inference; compare vs linear-probe and SAE-feature monitors.

## OP-7: Domain-invariant CoT error signatures
- **Statement:** CRV finds attribution-graph error signatures are **domain-specific**; a domain-invariant / semantic-feature-level verifier is open, as is multi-model coverage (CRV = single Llama-3.1-8B).
- **Paper:** [[2026 - Verifying Chain-of-Thought via Computational Graph]].
- **MVP:** train a feature-level (not aggregate-graph-stat) classifier; test cross-domain + cross-model transfer.

## Ranking (feasibility × decisiveness × fit) — preliminary
1. OP-1 (clear, buildable, high reviewer value)
2. OP-2 (high impact; sets us apart on rigor)
3. OP-4 (novel SAE×causal on LLMs)
4. OP-7, OP-3, OP-6, OP-5
