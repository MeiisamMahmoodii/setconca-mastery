---
title: "Exploratory Causal Inference in SAEnce"
year: 2026
conference: ICLR
status: accepted
presentation_type: oral
relevance: tier-1
primary_topics:
  - sparse autoencoders
  - causal inference
  - interpretability
  - unsupervised scientific discovery
authors:
  - Tommaso Mencattini
  - Riccardo Cadei
  - Francesco Locatello
institutions:
  - Institute of Science and Technology Austria (ISTA)
  - École Polytechnique Fédérale de Lausanne (EPFL)
paper_url: "https://openreview.net/forum?id=Ml8t8kQMUP"
openreview_url: "https://openreview.net/forum?id=Ml8t8kQMUP"
arxiv_url: "https://arxiv.org/abs/2510.14073"
code_url: ""
project_url: ""
review_visibility: public
reading_status: complete
last_updated: 2026-07-17
tags:
  - conference/iclr
  - year/2026
  - topic/sparse-autoencoder
  - topic/causal-inference
  - topic/interpretability
  - topic/scientific-discovery
  - status/accepted
  - presentation/oral
  - relevance/tier-1
---

# Exploratory Causal Inference in SAEnce

## One-sentence summary

The paper repurposes a Sparse Auto Encoder (trained on frozen foundation-model features of raw trial data) as an unsupervised "measurement device" for Randomized Controlled Trials, and introduces **Neural Effect Search (NES)** — a recursive, stratification-based multiple-testing procedure — to discover *which* latent outcomes a treatment causally affects without any hand-crafted hypotheses or labels, overcoming a "significance-collapse" paradox that ordinary multiple-testing suffers under SAE feature entanglement.

## Why this paper matters

It is a **tier-1, cross-over paper**: it takes SAEs out of the "interpret an LLM's internal computation" setting and reframes them as a **statistical measurement interface for scientific causal inference**. For a mechanistic-interpretability program this matters for three reasons: (1) it is, per the authors, the **first application of SAEs to causal inference** on a real scientific trial, opening a new use-case (and a new competitor space) for SAE features; (2) it squarely confronts SAE **feature entanglement / leakage / polysemanticity** as the central obstacle and gives a *causally principled* algorithm to handle it, which is directly relevant to any claim that SAE features are "monosemantic measurement channels"; and (3) it is an **Oral**, so it signals to reviewers that "SAEs as scientific hypothesis generators" is a validated, high-visibility direction. It is also notable for being honest about SAE negative results (it cites the random-network, atomicity-failure, and AxBench critiques) and building its method *around* imperfect disentanglement rather than assuming it away.

## Research problem

In **exploratory** experiments the affected outcome variable(s) `Y` are unknown a priori — scientists only observe a high-dimensional indirect measurement `X` (e.g., video of ants) and a randomized treatment `T`. The problem: **discover, in a purely data-driven way, which latent outcomes are causally affected by the treatment**, when (i) you have thousands of candidate "channels" (multiple testing) and (ii) those channels are entangled (an SAE is not perfectly monosemantic, so effects leak across neurons).

## Motivation

- **Scientific motivation:** Modern science increasingly builds "atlases" (genomes, cell-perturbation imaging, cancer sequencing) collected for general purposes; these call for an *empiricist*, data-first view rather than the classical *rationalist* hypothesis-first view. The datasets are too large to "just look at."
- **Practical motivation:** The running example is experimental ecology — ISTAnt, a real RCT filming ant triplets under a treatment/placebo to study **social immunity** behaviors. Which behaviors to annotate is currently chosen by the scientist's prior.
- **Gap in prior work:** The rationalist pipeline (annotate a target behavior, train a predictor, then do prediction-powered causal inference — Cadei et al. 2024/2025) suffers the **"Matthew effect"** (rich-get-richer): analyses anchor on previously studied outcomes and miss unknown effects. Existing empiricist causal methods (Causal Feature Learning, Chalupka et al. 2017) commit to a *single* grouping via density estimation/clustering, which is infeasible in high dimensions and discovers only one hypothesis. Interventional causal-representation-learning identifies the *setting* `W`, not the *outcome* `Y`, so it cannot solve exploratory outcome discovery.

## Core hypothesis

**Fact (stated):** If a foundation model is *sufficient* for the outcome information (`I(X,Y)=I(φ(X),Y)`) and an SAE gives approximately monosemantic, principally-aligned codes, then treatment effects on the (unknown) outcomes manifest as detectable treatment–control mean shifts on individual SAE codes — and a recursive stratification procedure can identify exactly the `r` codes principally aligned with the `r` true affected outcomes, even under broad leakage.

## Objective

Two coupled objectives:

1. **SAE training** (standard): minimize reconstruction MSE with a sparsity penalty on frozen FM features `h = φ(x)`:
   `min_{D,z≥0} E[ ‖h − Dz − b_d‖₂² ] + λ·S(z)`, with top-`k` encoder nonlinearity.
2. **Causal discovery** (the real contribution): recover the set `S_final` of SAE codes principally aligned with the affected outcomes `Y`, i.e., converge to `{j₁,…,j_r}` with FWER/FDR → 0, via Neural Effect Search.

Plain language: the SAE turns raw data into thousands of interpretable yes/no "measurement channels"; NES then figures out which channels genuinely shifted because of the treatment, peeling off one confirmed effect at a time so that leakage from already-found effects can't masquerade as new effects.

## Core idea

**Intuition:** Test all SAE codes for a treatment effect, but don't trust the whole list. Vanilla multiple testing can't tell a code that *carries its own* effect from one that merely *leaks* another code's effect — and as you add power (more samples `n` or bigger effect `τ`), *every* entangled code eventually becomes "significant" (the **Paradox of Exploratory Causal Inference**). NES instead **greedily identifies the single strongest effect, then statistically controls for it (stratifies on the discovered code) and re-tests everything else on the residual signal**, repeating until nothing significant remains.

**Mechanism:** Treat the discovered principal neuron `Z₁` as a proxy for its underlying latent `Y₁`; conditioning (stratifying) on `Z₁` zeroes out, in expectation, the mean of every code's leakage that was mediated by `Y₁`, so only *undiscovered* effects surface next round. This makes NES simultaneously (a) a multiplicity correction robust to entanglement and (b) an effect-disentanglement algorithm.

## Method

### Inputs
Raw trial observations `X` (images / video frames) and a randomized binary treatment `T ∈ {0,1}`. Outcomes `Y ∈ {0,1}^r` are latent/unknown (the paper restricts to discrete outcomes because continuous concepts in SAEs are not well understood).

### Outputs
A set `S_final` of SAE code indices deemed causally affected by `T`, each with an estimated ATE `τ̂_j` and p-value, handed to domain experts for interpretation (visualize most/least activating clips).

### Architecture
Frozen pretrained **foundation model** `φ` (SigLIP for CelebA images; DINOv2 for ISTAnt frames) → mean-pool patch tokens → feature `h`. A **top-k SAE** (encoder `E`, decoder `D`, biases) maps `h` to sparse code `z` and reconstructs `ĥ = Dz + b_d`. Per-image/frame codes are obtained by mean-pooling patchwise codes into a single vector.

### Training objective
Standard reconstruction + sparsity (top-k enforces `k` active codes). No causal signal is used during SAE training — the pipeline is fully unsupervised w.r.t. the outcome.

### Data construction
Causal discovery operates on the matrix of per-unit SAE codes `Z ∈ R^{n×m}` plus treatment labels `T`. NES uses **pooled quantile/median stratification** on already-discovered codes and (optionally) **arm-wise residualization** (regress `Z_j` on `Z_S` within each arm) for variance reduction.

### Inference procedure (Neural Effect Search — Algorithm 1)
1. For every unselected code `j`, run `NeuralEffectTest` (Algorithm 2): stratify on discovered set `S`, optionally arm-wise residualize `Z_j`, compute a post-stratified difference-in-means ATE `τ̂_j`, a Satterthwaite-df stratified t-statistic, and a p-value.
2. Keep the significant set `R = {j : p_j < α/m}` (Bonferroni over `m` remaining hypotheses), ordered by `|τ̂_j|`.
3. If `R` is empty → return `S`. Else add only the single strongest code `R₁` to `S` and recurse.
Per-neuron ATE default = **associational difference** (unbiased under RCT); **AIPW** is offered as an efficiency alternative. For very small samples, Bonferroni may be relaxed (more, possibly false, positives for experts to review).

### Computational requirements
Modest. SAEs are small dictionaries (`m ≈ 3k–12k`) on ≤768-dim FM features; testing is classical statistics (pandas + SciPy). No large-model training. **Fact:** no explicit compute/hardware budget is reported.

## Experimental design

### Models (foundation models + SAE)
- **SigLIP** (main FM, CelebA), `d=768`, final-layer patch tokens averaged; SAE `m=9216` (12×`d`).
- **DINOv2** (ISTAnt; also a CelebA ablation FM), `d=384` (ISTAnt) / `d=768` (CelebA), SAE `m=4608` (ISTAnt).
- SAE nonlinearity ablations: top-k with `k ∈ {5,10,20,50,100}` and JumpReLU.

> [!warning] Hyperparameter ambiguity (Fact)
> Table 1 lists the **CelebA** SAE as top-k with **k=5**, but the assumption-validation text (App. E.1) and the ablation section state top-k with **k=20** as the "default … in the main experiments." This is an internal inconsistency in the paper; the ISTAnt SAE (Table 2) is unambiguously k=20.

### Layers or activation sites
Final-layer token features of the FM (patch tokens mean-pooled). No cross-layer analysis; the "neurons" analyzed are **SAE codes**, not FM neurons.

### Datasets
- **CelebA** (Liu et al. 2018): semi-synthetic RCTs built from real images with known binary attributes as ground-truth outcomes.
- **ISTAnt** (Cadei et al. 2024): real-world randomized ecology trial, `n=44` videos of ant triplets; annotations used *only a posteriori* for interpretation/evaluation, never for training.

### Baselines
Vanilla two-sample **t-test** (no correction), **FDR** (Benjamini–Hochberg-style), **Bonferroni**, **top-k effect selection**, and (App. E.3) two **Causal-Feature-Learning-inspired** heuristics: **LASSO** and **stability-selected LASSO** regressing `T` on `Z`. Also an **AIPW vs AD** estimator ablation.

### Metrics
Against ground-truth affected codes `G` (the single best-F1 SAE code per known attribute): **Precision, Recall, IoU** of the returned set; plus **F1 of code-vs-attribute** to establish ground truth and SAE sufficiency/alignment. ISTAnt uses the same protocol with expert annotations only for evaluation.

### Controls
Semi-synthetic DGP with a designed **co-effect + exogenous modifier**: `Y₁=Eyeglasses`, `Y₂=Wearing_Hat`, exogenous `W=Smiling` modifying only `Y₁`; `T ~ Bernoulli(0.5)`. A **zero-effect** control (`τ=0`, method should return nothing) and **opposite/complementary effects** and **unbalanced propensity** stress tests.

### Ablations
Foundation model (SigLIP vs DINOv2); SAE width `m ∈ {3072…12288}`; nonlinearity (top-k `k`, JumpReLU); multiplicity rule inside NES (Bonferroni/FDR/t); arm-wise residualization on/off; ATE estimator (AD vs AIPW); DGP variants (zero-effect, opposite effects, propensity `P(T=1) ∈ {0.2,0.4,0.6,0.8}`); two extra CFL-inspired baselines.

### Statistical testing
The method **is** a statistical testing procedure (stratified t-tests with Satterthwaite df, Bonferroni/FDR). Theory: Theorem 3.1 (collapse with `n`), Theorem 3.2/Cor. (collapse with effect magnitude `s`), Theorem 4.1 (NES consistency: `Pr(S_final={j₁..j_r})→1`, `E[|S_final|]→r`, FWER/FDR→0), with an `O(n^{-1/2})` detectable-margin rate.

### Number of seeds
Semi-synthetic evaluations resample each experiment **10 times** (mean ± std). Additionally the **SAE is retrained with 2 more random seeds** (replicas 1–2) to check consistency. ISTAnt (real data, `n=44`) is a single trial.

## Main results

- **The Paradox is real and demonstrated.** Numerically and on CelebA, as `n` or `τ` grows, t-test/FDR/Bonferroni/top-k all drive **Recall→1 but Precision (and IoU)→0**: they flag every weakly-entangled code as significant. This is exactly what Theorems 3.1–3.2 predict.
- **NES is the only method keeping a good Precision/Recall/IoU trade-off** across the sample-size and effect-size grids, both when `r` is unknown and when the true `r` is given (top-`r` selection). Baselines cannot exceed ~0.5 Precision/Recall in high power: they get the strongest effect (equivalent to NES round 1) but miss the second, entangled effect.
- **Robustness/consistency:** results replicate across FM (SigLIP↔DINOv2), SAE width (`m` up to 12,288), top-k `k`, propensity imbalance, opposite effects, and 3 SAE seeds. **JumpReLU breaks the required principal-alignment assumption** (no clear principal neuron for `Wearing_Hat`), invalidating both NES guarantees and the evaluation ground truth.
- **Zero-effect control:** with `τ=0`, NES, Bonferroni, and FDR return essentially nothing; uncorrected t-test and top-k over-discover (top-k reports `k` codes by design).
- **AIPW vs AD:** in these balanced RCTs with low-dim `W`, AIPW gives only marginal variance gains; crucially it does **not** fix entanglement — NES's advantage comes from recursive stratification, not the first-stage estimator.
- **Real-world headline (ISTAnt):** with `n=44` (Bonferroni relaxed), NES returns exactly **two** codes: **code 394 = grooming behavior** (independently the single most grooming-predictive of 4,608 codes, F1=0.398 — matching prior *supervised/rationalist* analyses) and **code 550 = a black dish-palette position marking in the background** (F1=0.568), i.e., a **finite-sample experimental-design confound** (those videos happened to all share one treatment arm). The authors frame recovering the confound as a *strength*: it is a real, significant signal experts can act on.

## What the results genuinely demonstrate

- **Fact:** Standard multiplicity corrections provably and empirically fail under SAE entanglement in the high-power regime; NES empirically avoids this on controlled semi-synthetic data with known ground truth.
- **Fact:** On a genuine scientific RCT, an unsupervised SAE + NES pipeline *rediscovered* the one behavior (grooming) that prior hand-annotated analyses found treatment-affected — without labels — plus a legitimate design artifact.
- **Inference:** The recursive-stratification idea is the operative ingredient (supported by the AD-vs-AIPW ablation and the residualization ablation), not the choice of estimator.

## What the results do not demonstrate

- **Only two ground-truth effects (`r=2`).** All quantitative recovery evidence is on a 2-effect semi-synthetic DGP; scalability of NES to many simultaneous entangled effects is untested.
- **Real-world validation is qualitative for `n=44`.** ISTAnt has no ground-truth `r`; grooming F1 is only 0.398 (the code is *most* predictive but far from monosemantic), so the treatment→behavior link cannot be asserted from the code alone (the authors say so explicitly).
- **Identifiability is assumed, not verified.** Correctness rests on FM sufficiency + SAE principal alignment/approximate disentanglement (Assumptions A.1–A.3), which are **untestable without outcome labels** in real use — the authors concede the method is only a "rescue system" for missed hypotheses, not a replacement for the rationalist pipeline.
- **Discrete outcomes only.** Continuous concepts are explicitly out of scope.
- **No LLM / mechanistic-circuit setting.** The "neurons" are SAE codes over *image/video FM features*; nothing is shown about SAEs on language-model internals here.

## Strongest evidence

The **semi-synthetic Precision/Recall/IoU curves (Figure 5, expanded in Figs 30–31)**: because ground-truth affected codes are known, they cleanly show the predicted significance-collapse of every baseline and NES's stable trade-off across both `n` and `τ`, in both `r`-known and `r`-unknown regimes — a tight match between Theorems 3.1–3.2 and experiment.

## Weakest evidence

The **real-world ISTAnt result**: compelling as a narrative and consistent with prior work, but it rests on `n=44`, a relaxed (no-Bonferroni) test, two returned codes with sub-0.6 F1, and expert post-hoc interpretation. It is a proof-of-concept, not a quantitative validation of causal identification.

## Important ablations

- **Multiplicity rule inside NES (Fig 27):** Bonferroni/FDR give best recovery at sufficient power; the t-test variant is more exploratory at very low power (`n=30`) but less precise mid-power.
- **Arm-wise residualization (Fig 28):** improves precision in low-power regimes without hurting recall; negligible at high power (as the theory predicts).
- **SAE nonlinearity:** top-k (any `k` tested) preserves the required principal alignment; **JumpReLU destroys it**, which both invalidates NES and reveals a genuine dependency of the method on the SAE achieving principal alignment.
- **AD vs AIPW (Fig 29):** entanglement is not an estimator-variance problem — orthogonalization doesn't cure the paradox.

## Failure cases

- **JumpReLU SAEs**: no principal neuron for some concepts → NES has no guarantees and evaluation is ill-defined.
- **Very low power** (`n≈30`, tiny `τ`): the paradox doesn't even arise, so simpler exploratory tests may be preferable; NES can also miss a very weak second effect.
- **Confound surfacing**: NES will return experiment-design artifacts (e.g., background marking) — by design a feature, but it shifts interpretive burden fully onto domain experts.

## Limitations stated by the authors

- Strong **data-sufficiency** assumption on `X` (e.g., X-ray sees shrinkage but not metabolic change); multimodal `X` is future work.
- Reliance on the **linear representation hypothesis** and on SAEs approximately recovering effects; **SAE identifiability theory is immature** (weaker than causal-representation-learning identifiability), and continuous concepts are unhandled.
- Because identifiability isn't guaranteed, the method should be used **only as a "rescue system"** for missed hypotheses before the (still necessary) rationalist inference.

## Additional limitations not emphasized by the authors

- **Ground-truth `r=2` throughout** the quantitative study; behavior with many entangled effects and realistic `r` is unknown.
- The **k=5 vs k=20 inconsistency** for the main CelebA SAE is unresolved in text.
- Greedy one-effect-per-round selection could be sensitive to **near-tied principal margins** (the `Γ > 2ε` margin condition); no empirical stress test of tie-breaking is reported.
- Evaluation ground truth itself is **SAE-derived** (best-F1 code), so "recovery" is partly self-referential to the chosen SAE.

## Reviewer feedback

> [!note] Review availability
> Reviews for `Ml8t8kQMUP` are **public on OpenReview** (ICLR 2026), but the OpenReview note/PDF endpoints returned an anti-bot **`ChallengeRequiredError`** in this session, so the review texts, scores, rebuttal, and meta-review were **not retrieved**. This section is intentionally left unfilled rather than fabricated (per CLAUDE.md §24). **Action:** fetch the reviews via an authenticated browser session and complete: positive points, concerns, questions, rebuttal, and which concerns were resolved/unresolved. The paper's **Oral** designation is confirmed via OpenReview and ML Anthology, but Oral status is not itself review content.

## Why it was accepted

> [!note] Interpretation
> Evidence-based inference from the paper text and its Oral status, **not** an official reason (reviews not read this session).

Plausible factors: (1) a **genuinely novel cross-disciplinary framing** — SAEs as measurement devices for causal discovery, claimed first-of-kind; (2) a **clean, memorable theoretical result** (the "Paradox of Exploratory Causal Inference" + two collapse theorems) paired with a principled fix (NES) with a consistency proof; (3) **rigor**: 10-seed semi-synthetic study, extensive ablations across FM/width/nonlinearity/propensity/DGP, zero-effect and opposite-effect controls; (4) a **compelling real-world story** (ants / social immunity) that recovers a known effect unsupervised *and* flags a design confound; (5) **intellectual honesty** about SAE negative results and non-identifiability, positioning the tool as a complement to (not replacement for) rigorous causal inference. Oral selection likely rewards the crisp paradox-and-cure narrative plus interdisciplinary reach.

## Why it may have been rejected

Not applicable (accepted, Oral).

## Novelty analysis

### What is genuinely new
The **Exploratory Causal Inference** problem formulation (discover *what* outcome is affected, not *who*), the **Paradox of Exploratory Causal Inference** (significance collapse under entanglement, formalized in Theorems 3.1–3.2), and **Neural Effect Search**: recursive stratification/residualization as a multiplicity correction *and* effect-disentanglement algorithm with a consistency guarantee. Claimed **first use of SAEs for causal inference** on a real trial.

### What is adapted from prior work
SAEs and monosemanticity framing (Bricken et al. 2023; Huben et al. 2024; Templeton et al. 2024); top-k SAEs; foundation models SigLIP (Zhai et al. 2023), DINOv2 (Oquab et al. 2023); post-stratification / g-computation and AIPW (Robins et al. 1994); Bonferroni/FDR multiplicity; prediction-powered causal inference and the ISTAnt trial (Cadei et al. 2024/2025); CFL as conceptual foil (Chalupka et al. 2017).

### What is mostly engineering or scaling
The statistical machinery (stratified t-tests, Satterthwaite df, residualization) is classical; the contribution is the *recursion + causal framing*, not new estimators. No large-scale/systems contribution.

### Closest prior papers
Causal Feature Learning (Chalupka et al. 2017); HypotheSAEs (Movva et al. 2025) — SAEs to surface *correlational* hypotheses; interpretable heterogeneous-treatment-effect discovery (causal trees/forests, Athey et al.); prediction-powered causal inference on ISTAnt (Cadei et al. 2024/2025).

## Competitor analysis

### Direct competitors
**HypotheSAEs (Movva et al. 2025)** — also SAEs-for-hypothesis-generation, but correlational and without significance/causal testing; this paper's explicit differentiation is *causal* effects + inference. **Causal Feature Learning (Chalupka et al. 2017)** — single clustering-based hypothesis vs NES's all-significant discovery.

### Indirect competitors
Interpretable HTE methods (causal trees/forests/rule ensembles) — they discover heterogeneity over covariates `W` (who), not affected outcomes `Y` (what). Interventional causal-representation-learning — identifies the setting `W`, not the outcome.

### Complementary methods
Any SAE-quality improvement (Matryoshka, transcoders, archetypal, JumpReLU-done-right, identifiability results such as Cui et al. 2025 / Hindupur et al. 2025) would strengthen NES's principal-alignment precondition. Prediction-powered / rationalist causal inference is explicitly framed as the downstream complement that NES feeds hypotheses into.

## Author and lab context

- **Francesco Locatello** (ISTA) — leads the Causal Learning and AI group; central program on **causal representation learning, disentanglement, and identifiability** (famous for "Challenging Common Assumptions in Unsupervised Disentanglement," ICML 2019 best paper). This paper sits squarely in that lineage (identifiability, disentanglement, leakage).
- **Riccardo Cadei** (ISTA, co-first) — author of the **ISTAnt** trial and the **prediction-powered/"smoke" causal inference** line (Cadei et al. 2024/2025); supported by a Google Research Scholar Award. This paper is the empiricist counterpart to his earlier rationalist pipeline.
- **Tommaso Mencattini** (ISTA + EPFL, co-first, MSc Data Science) — prior work on **model merging** (Mergenetic, ACL 2025 Demo; MERGE³, ICML 2025) and **SAE transferability** across base/finetuned LMs (repo `SAE-Transferability`), giving him direct SAE background.
- This is a **coordinated ISTA research program** at the intersection of causal representation learning and applied scientific ML (an interdisciplinary "ALED" collaboration with ecologist **Sylvia Cremer** on ants), not a one-off; acknowledgments cite the Bellairs Causal Representation Learning workshop and feedback from Judea Pearl.

## Strategic value for our work

- **Borrow:** the **entanglement/leakage framing** as a first-class quantity (leakage set `A_ε`, leakage index `ρ_ε`) — a clean, citable way to *quantify* SAE polysemanticity; and the **recursive "discover → control → re-test" pattern** as a template for any SAE-feature attribution where features are correlated.
- **Baseline / positioning:** if we make claims about **SAE features as measurements or for downstream discovery**, NES is now the reference method to compare against and the "Paradox of Exploratory Causal Inference" is a critique reviewers may raise against naive per-feature testing.
- **Evaluation protocol to replicate:** the **semi-synthetic RCT-from-attributes construction** (real images, controlled outcome/confound structure, Precision/Recall/IoU vs best-F1 ground-truth codes, 10 resamples + SAE re-seeds) is a strong, reusable rig for testing *any* SAE-feature-selection claim under known ground truth.
- **Claim this blocks:** "first to use SAEs for causal inference / unsupervised treatment-effect discovery," and "recursive stratification solves multiple-testing under feature entanglement," are now taken.
- **Gaps still open (opportunities):** (i) **identifiability of SAE features** good enough to *certify* principal alignment without labels — the paper's own admitted weakest point; (ii) NES for **continuous concepts** and **multimodal `X`**; (iii) **many-effect / large-`r`** regimes and tie-breaking robustness; (iv) applying the paradox/NES analysis to **SAEs over LLM internals** (all experiments here are vision/video FMs); (v) a **non-greedy or joint** alternative to one-effect-per-round selection.
- **Differentiation:** we could provide the missing **causal/faithfulness validation of SAE features** (necessity/sufficiency) or an **identifiability-aware** variant that these authors flag as future work.

## Reproducibility assessment

- Code availability: **2** — a **minimal pandas/SciPy NES+NET snippet is in Appendix C**, and the text refers to "full code," but **no public repository link is given in the paper or located via search this session**; the community "paper note" lists code as "to be confirmed."
- Data availability: **5** — CelebA and ISTAnt are public; SigLIP/DINOv2 are public.
- Hyperparameter detail: **4** — SAE tables (dims, optimizer, LR, epochs, top-k), NES algorithm, DGP probabilities all specified; dampened by the **k=5 vs k=20** discrepancy.
- Compute transparency: **2** — no explicit hardware/compute budget (small models imply low cost).
- Seed reporting: **4** — 10 evaluation resamples + 2 extra SAE seeds on semi-synthetic; single real trial (`n=44`).
- Evaluation clarity: **4** — metrics and ground-truth construction clearly defined; most results are figures rather than tables.
- Ease of reproduction: **4** — small models + public data + full algorithm/pseudocode make it tractable even without an official repo.

## Overall assessment

### Strengths
Novel and well-motivated cross-disciplinary problem; a crisp theoretical failure mode (the Paradox) with matching proofs; a principled, provably-consistent fix (NES); thorough controlled experiments with seeds and many ablations; a genuine real-world proof-of-concept; unusually honest about SAE limitations and non-identifiability.

### Weaknesses
Quantitative validation limited to `r=2` semi-synthetic effects; real-world result is qualitative at `n=44`; correctness hinges on untestable SAE principal-alignment (which JumpReLU already breaks); no public code repo located; internal k=5/k=20 inconsistency; vision/video only (no LLM-internals evidence).

### Confidence in assessment
**High** on the method, theory, and experiments (full arXiv v2 read end-to-end including appendices). **Low** on reviewer dynamics (reviews not retrieved) and on exact code-release status (no repository confirmed).

## Key quotations

- "we introduce Neural Effect Search, a novel recursive procedure solving both issues by progressive stratification." (Abstract)
- "To the best of our knowledge, this is the first successful application of sparse autoencoders to causal inference, tailored to the analysis of scientific experiments." (§1 Contributions)
- "In Exploratory Causal Inference, as the trial sample size `n` or the effect magnitude `τ` grows, multiple testing, even with Bonferroni adjustment, redundantly returns all the outcome-entangled neurons as independent and significantly affected by the treatment." (Paradox statement, §3)
- "NES does not merely test for effects: it disentangles the effects … identifying and adjusting the estimation of one true treatment effect factor at a time until the entire effect subspace is recovered." (§4 Discussion)
- "Lacking identifiability means that domain experts can today only use our method 'as a rescue system for hypotheses they may have missed'." (§7 Limitations)

## Open questions

- Can SAE **principal alignment** be certified (or at least estimated) *without* outcome labels, to make NES's guarantees usable in genuine exploration?
- How does NES behave with **large `r`** and near-tied principal margins (`Γ ≈ 2ε`)?
- Does the paradox-and-NES story transfer to **SAEs over LLM internals** and to **continuous** concepts / **multimodal** `X`?
- Is greedy one-effect-per-round optimal, or would a joint/backward-elimination variant recover more effects at low power?

## Follow-up papers to read

- Cadei et al. 2024 — ISTAnt / "smoke" prediction-powered causal inference (the trial + rationalist baseline)
- Cadei et al. 2025 — Causal inference with artificial predictions / prediction-powered CI
- Movva et al. 2025 — HypotheSAEs: SAEs for hypothesis generation (`correlational` competitor)
- Chalupka et al. 2017 — Causal Feature Learning
- Locatello et al. 2019 — Challenging Common Assumptions in Unsupervised Disentanglement (identifiability lineage)
- Heap et al. 2025 — SAEs interpret randomly (SAE negative result)
- Wu et al. 2025 — AxBench (limited downstream SAE benefit)
- Cui et al. 2025 / Hindupur et al. 2025 — early SAE identifiability theory

## Source log

- Official proceedings / OpenReview: https://openreview.net/forum?id=Ml8t8kQMUP (ICLR 2026 Oral; Primary Area: interpretability and explainable AI; Submission 22028; reviews public but **not retrieved** — `ChallengeRequiredError`)
- ML Anthology entry: https://mlanthology.org/iclr/2026/mencattini2026iclr-exploratory/
- arXiv (full text read, HTML v2, 6 Jan 2026): https://arxiv.org/abs/2510.14073 · https://arxiv.org/html/2510.14073v2
- alphaXiv mirror (cross-checked): https://www.alphaxiv.org/abs/2510.14073
- Community paper note (secondary, cross-check only): https://en.papernotes.org/ICLR2026/causal_inference/exploratory_causal_inference_in_saence/
- Code: **no public repository located** (Appendix C snippet only; "full code" referenced without link; author GitHub `tommasomncttn` has no matching public repo as of this session)
