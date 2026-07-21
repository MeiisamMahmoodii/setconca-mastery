---
title: "AbsTopK: Rethinking Sparse Autoencoders For Bidirectional Features"
year: 2026
conference: ICLR
status: accepted
presentation_type: poster
relevance: tier-1
primary_topics:
  - sparse autoencoders
  - mechanistic interpretability
  - dictionary learning
  - bidirectional/bipolar features
  - proximal gradient / sparse coding
authors:
  - Xudong Zhu
  - Mohammad Mahdi Khalili
  - Zhihui Zhu
institutions:
  - The Ohio State University
paper_url: "https://openreview.net/forum?id=EEs6I4cO7S"
openreview_url: "https://openreview.net/forum?id=EEs6I4cO7S"
arxiv_url: "https://arxiv.org/abs/2510.00404"
code_url: ""
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
  - topic/linear-representation-hypothesis
  - status/accepted
  - presentation/poster
  - relevance/tier-1
---

# AbsTopK: Rethinking Sparse Autoencoders For Bidirectional Features

## One-sentence summary

AbsTopK derives SAEs as a single unrolled proximal-gradient step for sparse coding (recovering ReLU/JumpReLU/TopK as proximal operators of specific regularizers), identifies the non-negativity constraint as the reason SAEs fragment bipolar concepts (e.g., male vs female) into separate atoms, and fixes it with a top-k-by-absolute-value operator that keeps both signs so a single feature can encode a full bidirectional semantic axis.

## Why this paper matters

It is a **direct competitor / foundation** for any work proposing a new SAE activation or objective. Two moves make it strategically important: (1) it gives a **principled derivation** of SAE nonlinearities from the classical dictionary-learning objective via proximal gradient, turning "which activation function?" into "which sparsity regularizer?"—a framing reviewers will now reach for; and (2) it isolates **non-negativity** (not sparsity per se) as a concrete, previously-underexamined structural defect and proposes a one-line drop-in fix (AbsTopK). It also enters the live "**are SAEs actually useful vs simple supervised baselines?**" debate (AxBench / Kantamneni) by claiming AbsTopK matches or beats Difference-in-Means (DiM) on steering while preserving general capability. For our program it stakes claims on both the theory framing (proximal/unrolling lens) and the "signed/bipolar features" direction.

## Research problem

Conventional SAEs (ReLU, JumpReLU, TopK) constrain latent codes to be **non-negative**. The paper asks: is non-negativity essential to SAE success, or does it limit representational completeness by preventing a single feature from encoding a bidirectional concept? Concretely: can allowing negative activations recover richer, bipolar features and improve reconstruction, interpretability, and steering?

## Motivation

- **Scientific:** The linear representation hypothesis holds that concepts are directions and that traversing a semantic axis means moving positively *and* negatively along a vector (the `king − man + woman ≈ queen` analogy). Non-negative codes can only ever move in one direction along an atom, so a bipolar axis must be split into two atoms or half-discarded. **(Fact — §1, §2.3.)**
- **Practical:** Recent work (AxBench/Wu et al. 2025; Arditi et al. 2024) shows simple supervised DiM can beat SAEs on steering; the authors interpret this as evidence SAE features only partially align with the model's true (bidirectional) directions. **(Fact — §1.)**
- **Gap in prior work:** No prior framework derives the common SAE variants from the original dictionary-learning formulation; the activation choices were somewhat ad hoc. There was also no clean account of *why* non-negativity is a problem. **(Fact — §1, §2.2, Appendix A.)**

## Core hypothesis

Removing the non-negativity constraint from the SAE sparsity mechanism (i.e., selecting the top-k features by **absolute magnitude** and keeping their signed values) lets a single latent encode a bidirectional concept, yielding higher reconstruction fidelity and more useful/steerable features than non-negative SAEs, without needing labels.

## Objective

Two coupled objects:

1. **Derivation objective (the framing).** Sparse coding solves
   `min_z (1/2)||x − (Dz + b)||² + λ R(z)`, and a **one-step proximal gradient** update from `z⁽⁰⁾=0`, with learnable `W` (for `D`) and `b_e` (for `−Dᵀb`), gives an encoder `z = prox_{λR}(Wᵀx + b_e)`. Different `R` reproduce different SAEs (Lemma 1).
2. **Training objective (AbsTopK SAE).** Plain reconstruction under a global `ℓ0 ≤ k` constraint (no non-negativity):
   `min_{D,W,b,b_e} E_x [ (1/2)||x − (Dz + b)||² ], where z = AbsTopK(Wᵀx + b_e)`,
   and `AbsTopK_k(u)` keeps the `k` entries of largest **absolute** value (with their original sign) and zeros the rest.

Plain language: instead of "keep the k biggest positive activations", keep "the k activations biggest in magnitude, sign included". This is exactly the **hard-thresholding operator** from compressive sensing, applied as the proximal operator of `ι_{||z||₀ ≤ k}`.

## Core idea

Intuition: a concept axis like gender is one direction; "man" is +α along it and "woman" is −α. A non-negative code cannot represent −α, so a standard SAE must spend two atoms (one for "male", one for "female"), fragmenting the axis and wasting dictionary capacity. If you let the code be signed but still sparse (top-k by magnitude), one atom can serve the whole axis. **(Fact/Interpretation — §1 Fig 1, §2.3.)**

Mechanism: (i) show ReLU/JumpReLU/TopK are `prox` of regularizers that all include a non-negativity indicator `ι_{z≥0}` (Lemma 1, Appendix C); (ii) drop the `ι_{z≥0}` term, keep only `ι_{||z||₀ ≤ k}`; (iii) its proximal operator is AbsTopK (Eq. 10–11); (iv) plug into the encoder/decoder and train with reconstruction loss only.

## Method

### Inputs
Residual-stream activations `x ∈ R^d` at a chosen layer `ℓ` of a frozen LLM.

### Outputs
Signed sparse code `z ∈ R^P` (exactly `k` nonzeros, any sign); reconstruction `x̂ = Dz + b`.

### Architecture
Standard single-hidden-layer SAE: encoder `z = AbsTopK(Wᵀx + b_e)`, decoder `x̂ = Dz + b`. Expansion factor **16** for all models. AbsTopK = keep k largest-|·| entries, preserve sign (contrast with TopK, which applies ReLU then keeps k largest positives). **(Fact — §2.3, Appendix B.)**

### Training objective
Reconstruction MSE only, with sparsity enforced *structurally* by AbsTopK (no explicit `λR` penalty term at train time for the TopK/AbsTopK configs). **(Fact — Eq. 13.)**

### Data construction
Trained on `monology/pile-uncopyrighted`. No special pairing/labeling (unsupervised). **(Fact — §3, Appendix B.)**

### Inference procedure
Encode → AbsTopK → decode. Steering via **latent clamping** `C_{i,c}`: set feature `z_i` to a constant `c` (negative suppresses, positive amplifies the concept), decode, intervene on the residual stream. DiM baseline uses activation addition / directional ablation with a supervised concept vector. **(Fact — Appendix F.)**

### Computational requirements
Modest: expansion 16, Adam, **30,000 steps**, batch **4096**, lr **3e-4**, β=(0.9, 0.99), JumpReLU bandwidth 0.001. Four models up to 4B params; no frontier-scale run. **(Fact — Appendix B.)**

## Experimental design

### Models
Four LLMs: **GPT2-small, Pythia-70M, Gemma2-2B, Qwen3-4B**. **(Fact — §3.)**

### Layers or activation sites
Middle-layer residual stream: Pythia-70M {3,4}; Gemma2-2B {12,16} (note Table 2 lists L12/L14); Qwen3-4B {18,20}; GPT2-small {6,8}. `k ≈ d/10` per model (Pythia 51, Gemma 230, Qwen 256, GPT2 76). **(Fact — Appendix B; minor layer-label inconsistency between §B and Table 2 for Gemma.)**

### Datasets
Train: the Pile (uncopyrighted). Eval: SAEBench task datasets (WMDP-bio + MMLU for unlearning; first-letter task for absorption; Bias-in-Bios + Amazon Reviews for SCR; multiclass NLP for TPP; RAVEL entities; 35 binary probing tasks across 5 domains). Steering-vs-utility: MMLU + HarmBench. **(Fact — §3, Appendix E/F.)**

### Baselines
**TopK SAE**, **JumpReLU SAE** (primary SAE competitors), and **Difference-in-Means (DiM)** as a supervised steering upper-reference. Original model ("Original") as the no-intervention reference. **(Fact — §3, Table 1.)**

### Metrics
Unsupervised: MSE training loss, **normalized MSE** (`||x−x̂||²/||x||²`), **Loss Recovered** (`(H*−H0)/(H_orig−H0)`). SAEBench tasks: **Unlearning, Absorption, SCR, TPP, RAVEL, Sparse Probing** (Absorption & Unlearning reported as `1 − score`). Steering-vs-utility: **MMLU** (capability) and **HarmBench** (safety). **(Fact — §3.1–3.3, Appendix E.)**

### Controls
"Original" (unmodified model) rows for MMLU/HarmBench; DiM as a labeled-data reference; sparsity swept via `k` (TopK/AbsTopK) or threshold `θ` (JumpReLU) to compare at matched sparsity. **(Fact — §3.1, Table 1.)**

### Ablations
No dedicated ablation section. The "ablation-like" evidence is: (i) sweeping `k` across models/layers (Appendix D) and (ii) the theoretical isolation of AbsTopK vs TopK differing *only* in the non-negativity term. JumpReLU-with-abs-thresholding is proposed but **explicitly left to future work**. **(Fact — §2.3, Appendix D.)**

### Statistical testing
**None reported** (no significance tests, no error bars on the reported tables). **(Fact — inspection of §3, Tables 1–2.)**

### Number of seeds
**Not reported.** No seed/variance analysis, which is notable given the paper itself cites SAE seed-instability as a known problem (Appendix A). **(Fact/Inference.)**

## Main results

- **Reconstruction / LM preservation (unsupervised).** AbsTopK reportedly achieves lower training MSE, lower normalized MSE across most sparsity levels, and higher Loss Recovered than TopK and JumpReLU, "across the majority of evaluated models". **Exact curves are in figures (Figs 2, 4), not tabulated**, so per-point numbers are not extractable from text. **(Fact for the qualitative claim; numbers = in-figure only.)**
- **SAEBench tasks (Table 2).** AbsTopK is best on the **majority** of {Unlearning, Absorption, SCR, TPP, RAVEL, Sparse Probing} across the 10 model/layer settings, with the clearest, most consistent margins on **SCR** (spurious-correlation removal). Illustrative Qwen3-4B L18: AbsTopK SCR 0.35 vs TopK 0.26 / JumpReLU 0.28; TPP 0.36 vs 0.31 / 0.30; RAVEL 0.81 vs 0.79 / 0.80. It is **not** uniformly best (e.g., Pythia-70M L4 Sparse Probing: AbsTopK 0.57 < TopK 0.61; GPT2 L6 Unlearning: AbsTopK 0.74 < TopK 0.80). **(Fact — Table 2.)**
- **Steering vs utility (Table 1).** On Qwen3-4B and Gemma2-2B, AbsTopK improves HarmBench safety while retaining more MMLU than TopK/JumpReLU. E.g., Qwen3-4B L18: MMLU 75.9 (AbsTopK) vs 75.2/75.0 (TopK/JumpReLU) vs 77.3 original; HarmBench 81.3 vs 78.2/79.1. Vs **DiM**: AbsTopK is competitive—sometimes slightly lower on HarmBench (e.g., Qwen L20 79.0 vs DiM 80.0) but usually equal-or-better on MMLU retention. **(Fact — Table 1.)**
- **Bidirectional feature case study (Fig 1).** On controlled minimal-pair sentences differing only in one token (man vs woman), a single AbsTopK feature activates **positively for "man" and negatively for "woman"**, demonstrating bipolar encoding within one dimension. **(Fact — Fig 1; single qualitative example.)**
- **Theory (Lemma 1).** ReLU, JumpReLU, and TopK are exactly the proximal operators of `ℓ1 + ι_{z≥0}`, `ℓ0 + ι_{z≥0}`, and `ι_{||z||₀≤k, z≥0}` respectively; AbsTopK is `prox` of `ι_{||z||₀≤k}` (no non-negativity). Proofs in Appendix C. **(Fact.)**

## What the results genuinely demonstrate

- A clean, correct **mathematical unification**: standard SAE activations are proximal operators of nonnegativity-constrained sparsity regularizers, and dropping that constraint yields AbsTopK. This is a genuine conceptual contribution independent of the empirics.
- On four models and many layers, a signed top-k operator **can match or beat** TopK/JumpReLU on reconstruction proxies and a broad SAEBench suite, and can trade off safety-vs-capability more favorably than non-negative SAEs.
- At least one **existence proof** that a single latent can carry both poles of a concept (Fig 1).

## What the results do not demonstrate

- **No statistics / no seeds** ⇒ "outperforms" and "superiority" are stated from point estimates only; several table cells are near-ties or reversed, so the claimed dominance is not shown to be robust.
- **Bidirectionality is shown by one curated minimal-pair example**, not a quantitative, dataset-level measure of how many features become genuinely bipolar or how much fragmentation is reduced.
- **Reconstruction gains are only in figures**, preventing precise comparison and independent effect-size judgement from the text.
- **No AutoInterp / human interpretability evaluation** (the authors deliberately omit AutoInterp, citing reliability concerns), so "enhances interpretability" rests on **proxy** disentanglement/probing tasks, not direct interpretability judgments.
- No causal/faithfulness test that AbsTopK features are the mechanism the model uses; steering results are behavioral.

## Strongest evidence

The **Table 2 SCR column** plus the **Table 1 MMLU-retention-at-equal-safety** pattern together: SCR directly rewards disentangling a concept from a spurious correlate, and AbsTopK's consistent SCR lead across almost all 10 settings is the most on-theme, repeated (if un-error-barred) signal that signed features aid concept isolation/control. The Lemma 1 derivation is the strongest *theoretical* evidence.

## Weakest evidence

The **bidirectional-encoding claim** (the paper's headline conceptual selling point) is supported mainly by **one qualitative feature in Fig 1**; there is no aggregate metric quantifying reduced fragmentation or the prevalence of bipolar features, so the central "single feature = bidirectional axis" story is under-measured relative to its prominence.

## Important ablations

There is no formal ablation suite. The most informative controlled comparisons are:

- **AbsTopK vs TopK** — identical except the `ι_{z≥0}` term; the whole empirical gap is attributed to removing non-negativity. This is the cleanest "ablation" and it is baked into the design. **(Fact.)**
- **`k` sweep (Appendix D)** — AbsTopK's advantage is claimed to hold across sparsity levels and layers, i.e., not a single-`k` artifact (shown in figures).
- **JumpReLU + absolute thresholding** — proposed as a natural extension but **not run**, leaving open whether the benefit is specific to AbsTopK or generic to any sign-preserving thresholding.

## Failure cases

- AbsTopK is **not** best everywhere (see reversed cells in Table 2, e.g., GPT2-small L6 Unlearning, Pythia-70M L4 Sparse Probing, Pythia-70M L4 RAVEL). **(Fact.)**
- On raw safety (HarmBench) AbsTopK can be slightly below DiM, i.e., the supervised baseline still edges it on the targeted concept in some settings. **(Fact — Table 1.)**
- Smallest models (Pythia-70M, GPT2-small) score near-zero on MMLU, so the safety-vs-utility analysis is only meaningful on Gemma/Qwen. **(Fact — §3.3.)**

## Limitations stated by the authors

- The one-step proximal encoder is only an **approximate** sparse-coding solution; multi-step/unrolled encoders could be more accurate (left to future work). **(Fact — §2.2.)**
- They focus on AbsTopK and **defer** the JumpReLU-with-two-sided-threshold variant to future work. **(Fact — §2.3.)**
- Conclusion calls for "more efficient, neurally-plausible approximations of the `ℓ0` operator for large-scale models", implicitly conceding scaling is unaddressed. **(Fact — §4.)**
- AutoInterp omitted due to reliability concerns. **(Fact — Appendix E.1.)**

## Additional limitations not emphasized by the authors

- **No seeds, no significance tests, no error bars** — especially glaring since the paper's own related-work section highlights SAE seed instability.
- **Reconstruction numbers only in figures**; no table of nMSE/Loss-Recovered at matched sparsity.
- **Bidirectionality under-quantified** (single example).
- **Layer-labeling inconsistency** (Appendix B says Gemma layers 12,16; Table 2 reports L12,L14) — minor but a reproducibility nit.
- **No public code repository identified**; reproducibility relies on OpenReview supplementary material.
- Sign-preserving codes may complicate downstream tooling/convention built around non-negative activations (feature "firing" semantics), a practical cost not discussed.

## Reviewer feedback

> [!note] Review availability
> Reviews for `EEs6I4cO7S` are **public on OpenReview** (ICLR 2026), but the OpenReview endpoints returned an anti-bot **ChallengeRequiredError** in this session, so the review texts, scores, and meta-review were **not retrieved**. This section is intentionally left unfilled rather than fabricated. **Action:** fetch reviews via a browser/authenticated session and complete: positive points, concerns, questions, rebuttal, resolved/unresolved. (Per CLAUDE.md §24.)

## Why it was accepted

> [!note] Interpretation
> Evidence-based inference from the paper (Poster status), not an official reason. Reviews not yet read.

Plausible factors: (1) a **clean theoretical framing** (proximal-gradient unrolling unifying ReLU/JumpReLU/TopK) that gives the community a reusable lens; (2) a **simple, well-motivated, drop-in** modification (one operator change) with an intuitive story (non-negativity fragments bipolar concepts); (3) **timely engagement** with the "SAEs vs simple baselines" debate, claiming parity with supervised DiM; (4) **breadth**: four models, multiple layers, a standard benchmark suite (SAEBench). A Poster (not Oral) decision is consistent with a solid, useful contribution whose empirical rigor (no seeds/stats, figure-only reconstruction, single bidirectionality example) is not decisive.

## Why it may have been rejected

Not applicable (accepted, Poster).

## Novelty analysis

### What is genuinely new
The **AbsTopK operator** (signed top-k / hard-thresholding as an SAE nonlinearity) and the explicit identification of **non-negativity (not sparsity) as the source of bipolar-concept fragmentation**, plus the **proximal-gradient derivation** framing SAE activations as `prox` operators of specific regularizers.

### What is adapted from prior work
Hard-thresholding / `ℓ0` proximal operator (Foucart 2011; compressive sensing), unrolled sparse coding / LISTA (Gregor & LeCun 2010), the SAE variants themselves (Cunningham et al. 2023; Rajamanoharan et al. 2024/JumpReLU; Gao et al. 2025/TopK), SAEBench evaluation (Karvonen et al. 2025), DiM steering (Arditi et al. 2024; AxBench/Wu et al. 2025), linear representation hypothesis (Park et al. 2023; Mikolov 2013).

### What is mostly engineering or scaling
The training pipeline is light engineering on standard SAE code (expansion 16, Adam, 30k steps). No scaling contribution; largest model is 4B.

### Closest prior papers
TopK SAE (Gao et al. 2025); JumpReLU SAE (Rajamanoharan et al. 2025); "Not all LM features are one-dimensionally linear" (Engels et al. 2025); AxBench (Wu et al. 2025); the SAE/concept-geometry duality (Hindupur et al. 2025); PACE / parsimonious concept engineering (Luo et al. 2024).

## Competitor analysis

### Direct competitors
Other SAE activation/objective variants: **TopK**, **JumpReLU**, **BatchTopK**, **Gated SAE**, **ProLU** — AbsTopK competes head-on as "the next activation function", differentiated by sign preservation.

### Indirect competitors
Supervised concept-vector methods (**DiM**, refusal-direction steering) and the AxBench/Kantamneni line arguing simple baselines beat SAEs; AbsTopK is partly a rebuttal ("SAEs can rival DiM").

### Complementary methods
Matryoshka/Transcoder/Archetypal SAEs (orthogonal structural priors that could stack with a signed operator); SAEBench tooling; the proposed sign-preserving JumpReLU; multi-step unrolled encoders.

## Author and lab context

- **Zhihui Zhu** (Ohio State University, ECE/CSE) — senior author; research program in optimization, low-dimensional structure, dictionary learning, and representation geometry. AbsTopK's proximal/`ℓ0` framing fits this signal-processing/optimization lineage rather than the Anthropic/DeepMind SAE-engineering lineage. **(Inference from affiliation + reference style.)**
- **Mohammad Mahdi Khalili** (Ohio State University) — trustworthy ML / fairness / privacy background; aligns with the steering/safety (HarmBench, SCR, Bias-in-Bios) framing.
- **Xudong Zhu** (Ohio State University) — first author; also on "From emergence to control: probing and modulating self-reflection in language models" (2025, ref [51]) with the same group, indicating a **continuing LLM-control/interpretability program**, not a one-off.
- **Interpretation:** an optimization/signal-processing group entering mechanistic interpretability and bringing the classical dictionary-learning toolkit (proximal operators, hard thresholding) to bear — a differentiator from the mainline SAE community.

## Strategic value for our work

- **Borrow:** the **proximal-gradient / unrolling derivation** as a principled way to motivate any new SAE activation (reviewer-friendly framing); the **signed/bipolar feature** idea and its `SCR`-based evaluation; the safety-vs-utility (MMLU vs HarmBench) framing for steering claims.
- **Avoid:** shipping "our operator is superior" with **no seeds, no significance, and figure-only reconstruction** — reviewers now have AbsTopK as precedent and can demand better; also avoid over-claiming bidirectionality from a single example (measure it).
- **Baseline we likely need:** **AbsTopK** now joins TopK/JumpReLU/BatchTopK as a mandatory SAE baseline, *especially* for any claim about reconstruction fidelity, disentanglement, or bidirectional/steering behavior.
- **Evaluation protocol to replicate:** SAEBench (SCR, TPP, RAVEL, Absorption, Unlearning, Sparse Probing), Loss Recovered, nMSE at matched `k`; steering via latent clamping vs DiM activation addition.
- **Claims this blocks:** "we are first to relax SAE non-negativity for bidirectional features" and "SAE activations are proximal operators of sparsity regularizers" are now taken.
- **Gap still open:** a **quantitative** measure of fragmentation/bipolarity; **seeded, error-barred** evaluation; the **sign-preserving JumpReLU** variant (they defer it); **scaling** AbsTopK to frontier models; **causal/faithfulness** validation that signed features are mechanistically used; interaction of signed codes with Matryoshka/transcoder structure.
- **Differentiation:** provide the statistical rigor, the bidirectionality metric, and the causal evidence this paper lacks — or generalize sign-preservation to other operators and to structured/nested SAEs.

## Reproducibility assessment

- Code availability: **3** (submitted as OpenReview supplementary material per the Reproducibility Statement; **no public GitHub repo identified this session**).
- Data availability: **5** (Pile-uncopyrighted + all SAEBench datasets are public/standard).
- Hyperparameter detail: **4** (expansion 16, per-model `k` and layers, Adam, 30k steps, batch 4096, lr 3e-4, bandwidth 0.001; a Gemma layer-label inconsistency between §B and Table 2).
- Compute transparency: **3** (steps/batch/optimizer given; no wall-clock/hardware/FLOPs).
- Seed reporting: **1** (none).
- Evaluation clarity: **4** (metrics well-defined via SAEBench; but key reconstruction results only in figures and no error bars).
- Ease of reproduction: **4** (small models, standard datasets, standard SAE pipeline make it tractable).

## Overall assessment

### Strengths
Elegant and correct unifying theory (proximal operators ↔ SAE activations); a crisp, well-motivated diagnosis (non-negativity fragments bipolar concepts) with a one-line fix; broad model coverage (4 LLMs, multiple layers) on a standard benchmark; a credible counter-data-point to "simple baselines beat SAEs".

### Weaknesses
No seeds/significance/error bars; reconstruction numbers only in figures; bidirectionality shown by a single example rather than quantified; no AutoInterp/human interpretability check; no causal/faithfulness test; scaling and the sign-preserving-JumpReLU variant deferred; no public code repo located.

### Confidence in assessment
**High** for method and reported results (full paper + appendices read). **Medium** on precise effect sizes (reconstruction is figure-only) and on positioning vs the newest 2025 SAE variants. **Low** on reviewer dynamics (reviews not retrieved — anti-bot challenge).

## Key quotations

- "their sparsity-inducing regularizers enforce non-negativity, preventing a single feature from representing bidirectional concepts (e.g., male vs. female). This structural constraint fragments semantic axes into separate, redundant features." (Abstract)
- "a single-step update naturally recovers common SAE variants, including ReLU, JumpReLU, and TopK." (Abstract / §2.2)
- "AbsTopK matches or even surpasses the Difference-in-Mean method—a supervised approach that requires labeled data for each concept and has been shown in prior work to outperform SAEs." (Abstract / §3.3)
- "This fragmentation is a direct consequence of the non-negativity constraint." (§2.3)

## Open questions

- How much fragmentation does AbsTopK actually remove, measured across the whole dictionary (not one feature)?
- Are the reconstruction/SAEBench gains robust to seeds and reported with error bars?
- Does the benefit come specifically from AbsTopK, or from any sign-preserving thresholding (the un-run JumpReLU-abs variant)?
- Do signed features survive at frontier scale and remain interpretable under human/AutoInterp evaluation?
- Are AbsTopK's bidirectional features causally used by the model (necessity/sufficiency), or only behaviorally steerable?

## Follow-up papers to read

- Gao et al. 2025 — Scaling and evaluating SAEs / TopK (`ICLR 2025`)
- Rajamanoharan et al. 2025 — JumpReLU SAEs
- Bussmann et al. 2024 — BatchTopK SAEs
- Wu et al. 2025 — AxBench: simple baselines beat SAEs for steering (`arXiv:2501.17148`)
- Kantamneni et al. 2025 — Are SAEs useful? sparse probing (`ICML 2025`)
- Engels et al. 2025 — Not all LM features are one-dimensionally linear (`ICLR 2025`)
- Karvonen et al. 2025 — SAEBench (`ICML 2025`)
- Park et al. 2023 — Linear representation hypothesis & geometry (`arXiv:2311.03658`)
- Hindupur et al. 2025 — Duality between SAEs and concept geometry
- Tolooshams & Ba 2022 — Stable and interpretable unrolled dictionary learning (TMLR)

## Source log

- Official / OpenReview: https://openreview.net/forum?id=EEs6I4cO7S (ICLR 2026 Poster; reviews public but **not retrieved** this session — anti-bot ChallengeRequiredError)
- OpenReview PDF: https://openreview.net/pdf/ac9d8c1ff00c4036c97381b77ecf7d5f01270c5f.pdf (read)
- arXiv (full text + appendices read): https://arxiv.org/abs/2510.00404 ; HTML: https://arxiv.org/html/2510.00404v1
- Code: submitted as OpenReview supplementary material (Reproducibility Statement); no standalone public repository identified this session
- Keywords (OpenReview): Sparse Autoencoder, Mechanistic Interpretability
