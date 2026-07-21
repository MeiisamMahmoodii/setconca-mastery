---
title: "Temporal Sparse Autoencoders: Leveraging the Sequential Nature of Language for Interpretability"
year: 2026
conference: ICLR
status: accepted
presentation_type: oral
relevance: tier-1
primary_topics:
  - sparse autoencoders
  - mechanistic interpretability
  - dictionary learning
  - semantic/syntactic disentanglement
authors:
  - Usha Bhalla
  - Alex Oesterling
  - Claudio Mayrink Verdun
  - Himabindu Lakkaraju
  - Flavio P. Calmon
institutions:
  - Harvard University
paper_url: "https://openreview.net/forum?id=bojVI4l9Kn"
openreview_url: "https://openreview.net/forum?id=bojVI4l9Kn"
arxiv_url: "https://arxiv.org/abs/2511.05541"
code_url: "https://github.com/AI4LIFE-GROUP/temporal-saes"
project_url: ""
review_visibility: public
reading_status: complete
last_updated: 2026-07-17
tags:
  - conference/iclr
  - year/2026
  - topic/sparse-autoencoder
  - topic/mechanistic-interpretability
  - topic/dictionary-learning
  - status/accepted
  - presentation/oral
  - relevance/tier-1
---

# Temporal Sparse Autoencoders: Leveraging the Sequential Nature of Language for Interpretability

## One-sentence summary

T-SAEs add a temporal contrastive loss to a Matryoshka SAE so that a designated "high-level" subset of features is encouraged to activate consistently across adjacent tokens, which (self-supervised) disentangles smooth semantic/contextual features from local syntactic ones and improves probing, activation smoothness, and steering with only a small hit to reconstruction.

## Why this paper matters

It is a **direct competitor / foundation** for any work on improving SAE feature quality. It reframes a widely-cited failure mode of SAEs (recovering shallow token-level "syntax" features like "the word 'The'") not as a property of the underlying LLM but as a defect of the **i.i.d. training assumption** in dictionary learning. The fix is an inductive-bias/structural-prior on the training objective rather than a new architecture, which is cheap and composable ("can be applied to any SAE training scheme"). For our program this is important because: (1) it stakes a claim on "structural priors for SAEs", (2) it introduces an evaluation angle (semantic vs contextual vs syntactic probing + activation smoothness) reviewers may now expect, and (3) it partially rebuts the "SAEs are useless for steering" narrative (AxBench / Kantamneni), which changes the competitive landscape.

## Research problem

SAEs applied to LLMs disproportionately recover token-specific, local, noisy (syntactic) features and fail to surface high-level semantic/contextual concepts. The problem: how to make unsupervised dictionary learning recover semantic structure without any semantic supervision.

## Motivation

- **Scientific:** Language has a well-studied semantics/syntax distinction; semantics has long-range dependencies and is smooth over a sequence, syntax is local (Chomsky; Griffiths et al. 2004 integrating topics + syntax; neuroscience/dev-psych evidence of separate representations).
- **Practical:** Token-level "dense"/noisy features cannot be read at the sequence level, and SAEs have underdelivered for steering/intervention (AxBench, Kantamneni et al. 2025).
- **Gap in prior work:** Matryoshka SAEs, Transcoders, Archetypal SAEs, manifold/geometry-constrained SAEs all keep the **i.i.d.-over-tokens** assumption; none inject the temporal/sequential prior.

## Core hypothesis

Enforcing temporal consistency (high-level features similar for adjacent tokens of the same sequence) is a sufficient self-supervised signal to bias SAEs toward recovering semantic/contextual features and to disentangle them from syntactic features, without sacrificing reconstruction.

## Objective

Minimize a Matryoshka reconstruction loss (high-level split reconstructs `x`; full set reconstructs the residual) **plus** an InfoNCE-style temporal contrastive loss on the high-level latent split, with weight `alpha`.

- Matryoshka: `L_matr = L_H + L_L`, where `L_H = || x_t - (W_dec[0:h] f_[0:h](x_t) + b_dec) ||^2` and `L_L = || x_t - (W_dec f(x_t) + b_dec) ||^2`.
- Contrastive (symmetric InfoNCE over a batch, cosine similarity `s`, positives = same-sequence adjacent tokens `z_t`, `z_{t-1}`):
  `L_contr = -(1/N) Σ_i log[ e^{s(z_t^i, z_{t-1}^i)} / Σ_j e^{s(z_t^i, z_{t-1}^j)} ] + (symmetric term)`.
- Full: `L = Σ_i L_matr(x_t^i) + alpha · L_contr`. Contrastive is applied **only** to the high-level split; low-level features are left unconstrained to soak up the fluctuating residual.

Plain language: pull each token's high-level code toward its neighbor's high-level code (positive) and away from other tokens' codes in the batch (negatives); let the leftover features handle whatever changes token-to-token.

## Core idea

Intuition: semantics is "slow", syntax is "fast". If you force part of the dictionary to be slow-changing over a sequence, that part is pushed to encode semantics/context, and the rest naturally captures the fast syntactic residual — a self-supervised disentanglement with no semantic labels.

Mechanism: reuse the Matryoshka partition (first `h` = high-level, rest = low-level) so there is already a natural place to apply the temporal constraint, then add the contrastive term on the high-level codes.

## Method

### Inputs
LLM residual-stream activations `x_t ∈ R^d` at a fixed layer, loaded in adjacent pairs `(x_{t-1}, x_t)`; pairs shuffled for batch diversity.

### Outputs
Sparse codes `f(x_t) ∈ R^m` partitioned into high-level `f_[0:h]` and low-level `f_[h:m]`; reconstruction `x_hat`.

### Architecture
Standard SAE (`W_enc ∈ R^{m×d}`, `W_dec ∈ R^{d×m}`, biases) with BatchTopK activation. `m = 16k` features; BatchTopK k = 20. Matryoshka-style nested reconstruction with a 20%/80% high/low split (high-level = 20%).

### Training objective
Matryoshka reconstruction (+ the auxiliary/aux-loss from Matryoshka/Gao et al.) + temporal contrastive on high-level split, `alpha = 1.0`.

### Data construction
Train on subsets of the Pile. Adjacent-token pairs supply positives. An ablation samples the contrastive partner uniformly from any previous token within `r < 25` for longer-range consistency.

### Inference procedure
Encode activations; high-level features give sequence-level semantic reads; steering = encode, amplify a chosen feature, decode, add back SAE error (setup from Bhalla et al. 2025).

### Computational requirements
Small/modest: Pythia-160m (layer 8) and Gemma2-2b (layer 12); 16k-width SAEs. No large-model scaling. Autointerp and steering judged by Llama3.3-70B-Instruct (SAEBench).

## Experimental design

### Models
Pythia-160m, Gemma2-2b (2 models, both small).

### Layers or activation sites
Pythia layer 8; Gemma layer 12 (chosen for comparability with Neuronpedia pretrained SAEs).

### Datasets
Train: Pile. Probing: MMLU, Wikipedia, FineFineWeb. Case study: Anthropic HH-RLHF.

### Baselines
BatchTopK SAE, Matryoshka SAE, raw model latents; for steering, also the best Neuronpedia Gemma-2-2b Matryoshka SAE (`gemma-2-2b-res-matryoshka-dc`).

### Metrics
FVE, cosine sim, fraction alive, **activation smoothness** (avg per-feature max token-to-token change normalized by change in model latents — an average per-feature Lipschitz constant), **autointerp** (SAEBench, Llama3.3-70B), and **probing accuracy** (k-sparse probing from Kantamneni et al. with k∈{1,5,10,20}, plus dense logistic regression) for semantic/contextual/syntactic labels.

### Controls
Semantic label = MMLU question category; contextual label = question ID; syntactic label = spaCy POS tag (all proxies). Probes trained directly on raw model latents (768-d Pythia / 2304-d Gemma) as a reference.

### Ablations
High/low split ratio (10:90, 50:50 vs 20:80); random-past-token vs adjacent-token contrast; contrastive InfoNCE vs naive L2 temporal-similarity vs no contrastive.

### Statistical testing
Only in the case study (two-sided t-test on response length, p = 9e-10). Main SAE metrics report no significance tests.

### Number of seeds
Not reported. **No seed/variance analysis on the core metrics** (autointerp reports a std over features, not over seeds).

## Main results

- **Reconstruction essentially preserved.** Pythia: FVE 0.94 (T-SAE) vs 0.95 (Matryoshka/BatchTopK); cos sim 0.93 vs 0.94. Gemma: FVE 0.75 vs 0.75/0.76. Small, consistent, minor cost.
- **Smoothness improved.** Activation smoothness (lower is better) on the high-level split: 0.09 (Pythia) / 0.10 (Gemma) vs 0.12–0.14 for Matryoshka and 0.13 for BatchTopK. This is the metric the loss directly targets.
- **Autointerp roughly on par or slightly lower.** Pythia 0.81±0.17 vs 0.83/0.85; Gemma 0.83 for all three (within noise; authors flag the judge as noisy).
- **Probing: the headline claim.** T-SAEs "significantly outperform" baseline SAEs on **semantic** and **contextual** labels with "little-to-no" drop on syntax, across Gemma + Pythia and MMLU/Wikipedia/FineFineWeb (Figs 3, 7, 8). Exact numbers are in figures (not tabulated in text).
- **Disentanglement.** High-level split carries semantics/context; low-level split carries syntax. For baseline Matryoshka SAEs, almost all predictive power sits in the high-level split (no specialization).
- **Alignment case study.** On HH-RLHF, T-SAE surfaces expected safety features (violence, crime, etiquette) in rejected responses AND a **spurious length correlation** (rejected completions 29.7% longer, p=9e-10), plus length-correlated features (transition words, quotes, formal language).
- **Steering.** T-SAE high-level features **Pareto-dominate** baselines (incl. best Neuronpedia SAE) on the success-vs-coherence tradeoff over 30 features (Gemma2-2b); baselines catastrophically repeat tokens at high strength.

## What the results genuinely demonstrate

- A temporal contrastive prior measurably shifts which linguistic information a fixed-capacity SAE encodes, moving semantic/contextual signal into a designated feature subset while keeping reconstruction close to baselines.
- The high/low split becomes genuinely specialized (unlike vanilla Matryoshka), supported by per-split probing.
- On these two small models, the semantic features are more useful for two concrete downstream tasks (dataset auditing, steering) than baseline SAE features.

## What the results do not demonstrate

- **No evidence of scaling** beyond 2 small models / single layers; nothing about frontier-scale SAEs.
- The "semantic" gains are measured against **proxy labels** (MMLU category, question ID, POS) — not validated human semantic judgments at the feature level beyond noisy autointerp.
- The smoothness win is partly **circular** (the objective optimizes exactly this quantity); it is evidence of successful optimization, not independently that smoother = more meaningful.
- No causal/faithfulness test that the high-level features are the mechanism the model uses (steering success is behavioral, not mechanistic necessity/sufficiency).
- No seeds/variance ⇒ "significantly outperform" for probing is not backed by a stated significance test on the SAE metrics.

## Strongest evidence

The per-split probing + TSNE combination (Figs 2, 3, 6): it shows both that semantic/contextual accuracy rises AND that it localizes to the high-level split while syntax stays recoverable — the specialization story is internally consistent across datasets and both models.

## Weakest evidence

Autointerp parity (Table 1) is used to argue "no interpretability cost", but the authors themselves call the judge "highly noisy"; and the steering "Pareto-dominance" rests on an LLM judge over 30 hand-selected features with feature-matching across SAEs that is admittedly imperfect.

## Important ablations

- **Split ratio:** larger high-level split → better semantics/context, worse syntax (expected capacity tradeoff; 20:80 is the chosen compromise).
- **Random vs adjacent contrast:** contrasting with a random earlier token (≤25 back) sharply improves *context* and hurts *syntax*, with minor semantic change → the temporal window is a tunable knob for context vs syntax.
- **InfoNCE vs naive L2:** naive L2 similarity gives better reconstruction but worse semantics/context → the *contrastive* (with negatives) formulation, not mere smoothing, is what buys the structure.

## Failure cases

- "Feature leakage": high-level features keep firing into later, semantically unrelated spliced passages (framed as context rollover, but also a limitation of clean separation).
- Steering with baselines fails catastrophically (token repetition) — reported as a baseline failure, but underscores brittleness of SAE steering generally.

## Limitations stated by the authors

- Autointerp generation + scoring is noisy and LLM-judge dependent.
- Metrics like FVE/sparsity don't capture downstream utility (motivating the case studies).

## Additional limitations not emphasized by the authors

- Only 2 small models, single layers each; no scaling law or frontier check.
- No seeds / no variance on core metrics; "significant" is informal for the SAE results.
- Proxy semantic labels; MMLU-category ≈ topic, which the contrastive-over-sequence objective is almost designed to cluster (mild construct-validity concern).
- The method presupposes the Matryoshka partition; interaction with non-nested SAEs is claimed but not shown.

## Reviewer feedback

> [!note] Review availability
> Reviews for `bojVI4l9Kn` are **public on OpenReview** (all ICLR 2026 submissions were deanonymized post-decision), but the OpenReview `/notes?forum=` and `/pdf` endpoints returned an anti-bot **challenge** in this session, so the review texts, scores, and meta-review were **not retrieved**. This section is intentionally left unfilled rather than fabricated. **Action:** fetch reviews via a browser/authenticated session and complete: positive points, concerns, questions, rebuttal, resolved/unresolved. (Per CLAUDE.md §24.)

## Why it was accepted

> [!note] Interpretation
> Evidence-based inference from the paper + its Oral status, not an official reason. Reviews not yet read.

Plausible factors: (1) a **simple, intuitive, composable** idea with a clean linguistic motivation; (2) it reframes a prominent, much-discussed SAE failure mode and offers a cheap fix; (3) it touches a timely debate ("are SAEs useful for steering?") and provides a counter-data-point; (4) multi-dataset probing + a concrete safety-data case study give it both rigor and a memorable narrative; (5) full code + trained SAEs + interpreted latents released. Oral selection likely rewards the crisp story and community relevance.

## Why it may have been rejected

Not applicable (accepted, Oral).

## Novelty analysis

### What is genuinely new
The **temporal contrastive loss as a structural/temporal prior for SAE training**, and the accompanying high/low (semantic/syntactic) data-generating-process framing with the temporal-consistency assumption.

### What is adapted from prior work
Matryoshka nested reconstruction (Bussmann et al. 2025), BatchTopK activation (Bussmann et al. 2024), aux loss (Gao et al.), InfoNCE contrastive learning (standard), k-sparse probing eval (Kantamneni et al. 2025), steering eval protocol (Bhalla et al. 2025 / AxBench-style). Historical lineage to natural-prior dictionary learning (Olshausen & Field; video temporal consistency, Luo et al. 2019).

### What is mostly engineering or scaling
The implementation itself is light engineering on top of existing SAE codebases; there is no scaling contribution.

### Closest prior papers
Matryoshka SAEs; Transcoders (Paulo et al. 2025); Archetypal SAE (Fel et al. 2025); "Dense SAE latents are features, not bugs" (Sun et al. 2025); the concept-geometry duality paper (Hindupur et al. 2025).

## Competitor analysis

### Direct competitors
Other "better SAE feature quality" methods: **Matryoshka SAEs**, **Transcoders**, **Archetypal SAEs**, manifold/geometry-constrained SAEs. T-SAE competes on the semantic-feature-quality axis specifically.

### Indirect competitors
Supervised alternatives the paper concedes may match it on *known* harms: linear probing, supervised steering, targeted finetuning. Also AxBench (Wu et al. 2025) and Kantamneni et al. (2025), which argue simple baselines beat SAEs for steering/probing — T-SAE is partly a rebuttal.

### Complementary methods
Any base SAE (loss is additive), SAEBench/Neuronpedia tooling, automated interpretability pipelines. The temporal loss could stack with transcoders or archetypal constraints.

## Author and lab context

- **Himabindu (Hima) Lakkaraju** (Harvard) — senior interpretability/XAI PI; large body of explainability + LLM interpretability/control work. Central research program.
- **Flavio P. Calmon** (Harvard) — information theory / fairness / trustworthy ML PI.
- **Usha Bhalla** (Harvard, Kempner Fellow) — co-first; prior "Towards unifying interpretability and control: evaluation via intervention" (2025), directly relevant to the steering eval here.
- **Alex Oesterling** (Harvard, NSF GRFP) — co-first.
- **Claudio Mayrink Verdun** (Harvard) — also a co-author on the board-game dictionary-learning progress-measurement paper (Karvonen et al. 2024), i.e., embedded in the SAE-eval community.
- This is a **central, coordinated research program** (AI4LIFE group), not a one-off; recurring theme = unifying interpretability with control/evaluation.

## Strategic value for our work

- **Borrow:** the semantic/contextual/syntactic probing decomposition + activation-smoothness metric as evaluation axes; the additive-loss design pattern (structural priors on SAE training); the "surface a spurious correlation in an alignment dataset" case-study format (compelling to reviewers).
- **Avoid:** shipping SAE claims with only 2 small models and no seeds — reviewers of *our* work will now have a higher bar.
- **Baseline we likely need:** T-SAE joins Matryoshka/BatchTopK/Transcoder as a mandatory SAE baseline for any "better features" claim, especially on semantic recovery and steering coherence.
- **Evaluation protocol to replicate:** k-sparse probing (Kantamneni), SAEBench autointerp, the AAxBench/Bhalla steering success-vs-coherence curve.
- **Claim this blocks:** "we are first to inject sequence/temporal structure into SAE training" and "temporal consistency improves SAE semantics" are now taken.
- **Gap still open:** temporal/structural priors at **scale**, with **seeds + causal/faithfulness validation**, on **more layers/models**; principled selection of the high/low split; combining temporal priors with transcoders; theoretical guarantees for the DGP recovery.
- **Differentiation:** provide the causal/mechanistic evidence and scaling this paper lacks, or generalize the "slow feature" prior beyond adjacency (e.g., learned time-scales, discourse structure).

## Reproducibility assessment

- Code availability: **5** (code + trained T-SAEs + interpreted latents released).
- Data availability: **5** (Pile, MMLU, Wikipedia, FineFineWeb, HH-RLHF all public).
- Hyperparameter detail: **4** (layers, k=20, 16k width, 20:80 split, alpha=1.0, aux loss stated; optimizer/schedule/steps less explicit in text).
- Compute transparency: **3** (small models implied cheap, but no explicit budget/hardware).
- Seed reporting: **1** (none).
- Evaluation clarity: **4** (metrics well-defined; some results only in figures).
- Ease of reproduction: **4** (small models + released artifacts make it very tractable).

## Overall assessment

### Strengths
Elegant, well-motivated, cheap, composable idea; consistent multi-dataset probing story; genuine downstream payoff (alignment-data auditing + steering); strong open-source release; timely rebuttal to "SAEs useless for steering".

### Weaknesses
Small-scale (2 models, single layers), no seeds/significance on core metrics, proxy semantic labels, a partly circular smoothness metric, LLM-judge-dependent autointerp/steering, no causal/faithfulness validation.

### Confidence in assessment
**High** for method/results as reported (full paper read). **Medium** on positioning vs the very newest 2025 SAE competitors and **low** on reviewer dynamics (reviews not yet read).

## Key quotations

- "we introduce Temporal Sparse Autoencoders (T-SAEs), which incorporate a novel contrastive loss encouraging consistent activations of high-level features over adjacent tokens." (Abstract)
- "current concept discovery methods simply aren't good enough to reveal the types of features we generally are interested in and that LLMs likely encode." (§5 Discussion)
- "rejected responses are on average 29.7% longer than chosen responses with statistical significance (p=9e-10)." (§4.5)

## Open questions

- Do temporal priors survive at frontier scale and across many layers?
- Is the semantic gain robust to seeds and to non-topic semantic labels?
- Can the "slow feature" idea be made causal (necessary/sufficient for behavior)?
- How does it interact with transcoders / archetypal SAEs when stacked?

## Follow-up papers to read

- Bussmann et al. 2025 — Matryoshka SAEs (`arXiv:2503.17547`)
- Paulo et al. 2025 — Transcoders beat SAEs (`arXiv:2501.18823`)
- Fel et al. 2025 — Archetypal SAE (`arXiv:2502.12892`)
- Kantamneni et al. 2025 — Are SAEs useful? sparse probing (`arXiv:2502.16681`)
- Wu et al. 2025 — AxBench: even simple baselines outperform SAEs for steering (`arXiv:2501.17148`)
- Sun et al. 2025 — Dense SAE latents are features, not bugs (`arXiv:2506.15679`)
- Bhalla et al. 2025 — Unifying interpretability and control via intervention (`arXiv:2411.04430`)
- Karvonen et al. 2025 — SAEBench (`arXiv:2503.09532`)

## Source log

- Official proceedings / OpenReview: https://openreview.net/forum?id=bojVI4l9Kn (Oral; reviews public but not retrieved this session — anti-bot challenge)
- ICLR virtual: https://www.iclr.cc/virtual/2026/oral/10008574
- arXiv (full text read): https://arxiv.org/abs/2511.05541 (HTML v1)
- Code: https://github.com/AI4LIFE-GROUP/temporal-saes
- Other: ML Anthology entry https://mlanthology.org/iclr/2026/bhalla2026iclr-temporal/
