---
conference: ICLR
last_updated: 2026-07-17
status: in-progress
---

# ICLR — Competitor & Rival Map

> [!note] Competition mapped at the method/claim level, not personally (CLAUDE.md §15). Based on 7 fully read ICLR 2026 Tier-1 orals + their cited baselines.

The 7 read papers cluster into **6 research axes**. Within an axis they compete; across axes they are largely complementary.

## Axis A — SAE feature quality / dictionary learning

| Paper | Core claim | Sparse? | Supervision | Main eval | Strength | Weakness | Overlap w/ us |
|-------|-----------|:-------:|-------------|-----------|----------|----------|---------------|
| [[2026 - Temporal Sparse Autoencoders]] (Oral) | Temporal contrastive prior recovers semantic features | Yes | Self-sup (temporal) | probing, smoothness, steering | cheap, composable, downstream wins | 2 small models, no seeds | direct |
| [[2026 - AbsTopK Bidirectional SAE Features]] (Poster) | Non-negativity (not sparsity) fragments bipolar concepts; signed top-k fixes it; SAEs = proximal operators of sparse coding | Yes (signed) | Unsup | reconstruction, disentangle, steering | principled derivation; bidirectional features; claims DiM parity | no seeds, single example, no scaling | direct |
| Matryoshka SAEs (Bussmann'25) | Nested widths → multi-level features | Yes | Unsup | SAEBench | hierarchical | i.i.d. tokens | baseline |
| Transcoders (Paulo'25) | Transcoders beat SAEs for interp | Yes | Unsup | interp benchmarks | causal-friendlier | different target | baseline |
| Archetypal SAE (Fel'25) | Manifold-constrained stable dict | Yes | Unsup | vision concepts | stability | vision-centric | adjacent |
| AxBench (Wu'25) | Simple baselines > SAEs for steering | — | mixed | steering | strong baselines | anti-SAE framing | narrative rival |
| Kantamneni'25 | SAE usefulness for sparse probing questioned | Yes | probing | sparse probing | rigorous | skeptical | narrative rival |

## Axis B — Causal-intervention faithfulness (validity of the whole toolkit)

| Paper | Core claim | Overlap |
|-------|-----------|---------|
| [[2026 - Divergent Representations from Causal Interventions]] (Oral) | Patching/DAS/SAE reconstruction push activations **off-manifold**; behavioral success ≠ natural mechanism; mitigate w/ Counterfactual-Latent loss | **Meta-critique that constrains every intervention-based claim we make** |

Related lineage: DAS (Geiger et al.), activation/path patching, IIA metrics. This paper is a *standard-setter*, not a competitor.

## Axis C — SAE for scientific causal inference

| Paper | Core claim | Overlap |
|-------|-----------|---------|
| [[2026 - Exploratory Causal Inference in SAEnce]] (Oral) | FM embeddings + SAE + Neural Effect Search discover treatment effects from RCT data unsupervised; tackles SAE feature entanglement/multiple-testing | new application; hands us a leakage framing + semi-synthetic eval rig; all experiments vision/video, not LLM internals |

## Axis D — Training dynamics theory of features

| Paper | Core claim | Overlap |
|-------|-----------|---------|
| [[2026 - How Transformers Learn to Associate Tokens]] (Oral) | Closed-form early-training weights = compositions of bigram / token-interchangeability / context basis functions | conceptual/citational vocabulary for "what a feature encodes"; early-training, attention-only |

## Axis E — Superposition & feature geometry

| Paper | Core claim | Overlap |
|-------|-----------|---------|
| [[2026 - Temporal Superposition and Feature Geometry of RNNs]] (Oral) | Extends Elhage et al. superposition to time/memory; dense vs sparse (interference-free) regimes in RNNs | stakes "superposition-through-time"; geometric target any SAE-for-RNN/SSM must invert |

Lineage: Elhage et al. Toy Models of Superposition (foundational).

## Axis F — Circuits / attribution graphs / CoT faithfulness

| Paper | Core claim | Overlap |
|-------|-----------|---------|
| [[2026 - Verifying Chain-of-Thought via Computational Graph]] (CRV, Oral) | Transcoder attribution-graph **structure** predicts CoT step correctness; supervised classifier; causal interventions | operationalizes Anthropic circuit-tracing into a quantitative verifier; mandatory baseline at MI×CoT-faithfulness |

Lineage: Anthropic circuit tracing (Ameisen, Lindsey, Dunefsky et al.), transcoders.

## Axis G — Validity / critique of interpretability metrics ("does it measure what it claims?")

| Paper | Core claim | Overlap |
|-------|-----------|---------|
| [[2026 - Divergent Representations from Causal Interventions]] (Oral) | Interventions push activations off-manifold; behavioral success ≠ mechanism | standard-setter for all intervention claims |
| [[2026 - Automated Interp Metrics Random Transformers]] (Poster) | SAE auto-interp + reconstruction metrics **can't distinguish trained from random transformers** ⇒ high scores don't certify learned features | forces a random-transformer null baseline into our eval |
| [[2026 - Causality vs Invariance Function and Concept Vectors]] (Poster) | Function vectors are **not format-invariant**; a working steering vector ≠ isolating the concept | RSA invariance diagnostic; caution for any "concept direction" claim |

This is arguably the **defining 2026 theme** for our area (see `trend_analysis.md`): ≥3 of 13 read papers are validity critiques.

## Axis H — Steering as control

| Paper | Core claim | Overlap |
|-------|-----------|---------|
| [[2026 - Activation Steering with a Feedback Controller]] (Poster) | Difference-in-means steering (ActAdd/CAA/Mean-AcT) = proportional control with structural steady-state error; add integral+derivative (PID) across layers | mandatory steering baseline; blocks "control-theoretic steering" claim; note: read partial (arXiv HTML unavailable) |

## Axis I — Concept / function vectors
Covered under Axis G (Causality != Invariance). Related: AbsTopK bidirectional features; T-SAE steering.

## Axis J — Representation geometry gates behavior (editing)

| Paper | Core claim | Overlap |
|-------|-----------|---------|
| [[2026 - Bilinear Representation Reversal Curse Model Editing]] (Poster) | Reversal curse + edit-generalization failures share a cause: unstructured representation; emergent **bilinear** relational geometry enables both; bilinear-probe score predicts edit generalization (R²=0.939) | diagnostic probe triad; "editability depends on geometry, not just algorithm"; correlational, synthetic-only |

## Axis K — Applied SAE fairness / safety

| Paper | Core claim | Overlap |
|-------|-----------|---------|
| [[2026 - SAEs Racial Biases in Healthcare]] (Poster) | SAE steering/ablation surfaces + causally activates racial bias (beats CoT on faithfulness) but only mitigates in contrived tasks; fails on realistic clinical tasks (race entangled) | reusable probe→reinterpret→steer→ablate+FLDD template; honest negative result |

## Cross-cutting observation
**Validity/critique is the standout theme:** Divergent Representations (Oral), Automated Interp Metrics, and Causality≠Invariance all argue interpretability methods can look successful without measuring the intended thing. ICLR 2026 clearly rewards work that stress-tests interpretability claims. (Now supported by ≥3 papers; see `trend_analysis.md`.)
