---
title: "The Shape of Adversarial Influence: Characterizing LLM Latent Spaces with Persistent Homology"
year: 2026
conference: ICLR
status: accepted
presentation_type: oral
relevance: tier-1
primary_topics:
  - persistent homology
  - topological data analysis
  - representation geometry
  - adversarial robustness / AI security
  - mechanistic interpretability
authors:
  - Aideen Fay
  - Inés García-Redondo
  - Qiquan Wang
  - Haim Dubossarsky
  - Anthea Monod
institutions:
  - Imperial College London
  - Microsoft Security Response Center (Cambridge)
  - Queen Mary University of London
  - University of Cambridge (Language Technology Lab)
  - The Alan Turing Institute
paper_url: "https://openreview.net/forum?id=v2PglvLLKT"
openreview_url: "https://openreview.net/forum?id=v2PglvLLKT"
arxiv_url: "https://arxiv.org/abs/2505.20435"
code_url: ""
project_url: ""
review_visibility: public
reading_status: complete
last_updated: 2026-07-17
tags:
  - conference/iclr
  - year/2026
  - topic/persistent-homology
  - topic/topological-data-analysis
  - topic/representation-geometry
  - topic/ai-security
  - topic/mechanistic-interpretability
  - status/accepted
  - presentation/oral
  - relevance/tier-1
---

# The Shape of Adversarial Influence: Characterizing LLM Latent Spaces with Persistent Homology

## One-sentence summary

Applying persistent homology (PH) to last-token activation point clouds across six LLMs (3.8B–70B) under two very different attacks (indirect prompt injection and backdoor-finetuning "sandbagging"), the paper shows that adversarial inputs induce a consistent, architecture-agnostic **"topological compression"** — the latent space collapses from many compact, small-scale, high-entropy topological features (loops/components) into fewer, later-born, longer-lived, more dispersed large-scale ones — and that a simple classifier on 41-dim barcode summaries separates clean from adversarial states with near-perfect accuracy while remaining *interpretable* about *why* the separation exists.

## Why this paper matters

It is a **tier-1, coordinate-free, nonlinear complement** to the SAE/linear-probe program that dominates our knowledge base. Where SAEs and linear directions treat each activation in isolation and cannot be compared across model weights, PH gives an intrinsic, relational, cross-model-comparable geometric summary of the *whole* activation cloud. Strategically it matters because: (1) it stakes out **"topology/geometry of the representation space as a safety monitor"** as a distinct interpretability axis; (2) it reframes robustness/OOD detection as a *measurable geometric invariant* ("topological compression") rather than a purely behavioral property; (3) it directly argues that the empirical success of linear probes may be a *shadow* of deeper topological structure — a claim that, if it holds, reshapes how we justify linear interpretability; and (4) as an ICLR 2026 **Oral**, it signals reviewer appetite for TDA-flavored, security-relevant representation analysis.

## Research problem

Most LLM interpretability captures linear directions or isolated features and ignores the high-dimensional, nonlinear, relational geometry of activations. The concrete problem: **can a principled, coordinate-free geometric/topological framework characterize — and interpretably explain — how adversarial inputs reshape LLM internal representation spaces, in a way that generalizes across architectures, scales, and operationally distinct attacks?**

## Motivation

- **Scientific:** LLM representations form a multi-scale conceptual hierarchy (neurons → circuits → global activation patterns), but empirical work overwhelmingly assumes linear structure, neglecting nonlinear geometry (Brüel-Gabrielsson et al. 2020; Engels et al. 2025). PH is presented as uniquely suited: coordinate-free, noise-robust (stability theorem, Cohen-Steiner et al. 2007), multi-scale via a filtration, and comparable across models/inputs/finetuning stages.
- **Practical / security:** The linear assumption creates a "security gap" — attacks exploit nonlinear features and bypass linear-classifier defenses (Kirch et al. 2024). Understanding the geometry of adversarial states could ground more robust monitors.
- **Gap in prior work:** How adversarial inputs *systematically* affect representation geometry — especially across *operationally different* attack modes — is described as "poorly understood." SAEs cannot be compared across model weights; linear methods separate but do not *explain* separation.

## Core hypothesis

Adversarial influence leaves a **consistent, architecture-agnostic topological signature** in LLM activation point clouds — specifically a "topological compression" — that is (a) statistically robust across layers and models, (b) highly discriminative between normal and adversarial states, and (c) *interpretable* as a shift in the multi-scale shape of representations.

## Objective

There is no learned training objective for a new model; the "objective" is a **measurement + classification + interpretation pipeline** on fixed pretrained/fine-tuned LLM activations:

- Build a Vietoris–Rips filtration on a point cloud `X ⊂ R^D` (D = hidden dim, e.g. 4096), each point = last-token representation of one input.
- Compute persistence barcodes in dimensions 0 (connected components) and 1 (loops); vectorize each barcode into a **41-dimensional "barcode summary"** (means/quartiles/std of births, deaths, persistences, birth/death ratios of 0- and 1-bars; total persistence; number of bars; persistent entropy).
- Prune features correlated > 0.5, run PCA + CCA for structure, train logistic regression to classify clean vs. adversarial, and use SHAP for feature-level interpretation.

Persistent entropy (dim-1): `E = -Σ_i p_i ln(p_i + ε)` with `p_i = ℓ_i / Σ_j ℓ_j`, `ℓ_i = d_i − b_i`. High `E` = many similarly-lived loops (diverse); low `E` = a few long-lived loops dominate.

Plain language: measure the *shape* of the whole activation cloud at every scale, turn that shape into 41 numbers, and see whether/why those numbers tell clean from adversarial.

## Core idea

Intuition: normal processing spreads representational capacity across **many small, compact structures** (many short loops, high-entropy lifetimes, compact components); adversarial processing **reallocates capacity into a few large, dominant structures** (fewer but longer, later-born loops; more spread-out components). This "compression" (fewer, larger topological features) is the fingerprint of an adversarial state.

Mechanism: PH's filtration records *at what scale* topological features appear and die. Adversarial clouds are more dispersed (higher mean death of 0-bars), so 1-loops form later and persist longer, while their number drops and their lifetime distribution concentrates (lower persistent entropy). These moves are captured by a handful of barcode statistics.

## Method

### Inputs
Point clouds `X ⊂ R^D` where each point is the **last-token hidden state** of an input at a given layer (D typically 4096). Two data regimes:
- **XPIA (clean vs. poisoned):** TaskTracker test set (>62k examples; Abdelnabi et al. 2024), each a user prompt + retrieved data block; poisoned blocks embed injected secondary tasks drawn from BeaverTails, HarmBench, JailbreakBench.
- **Sandbagging (locked vs. elicited):** models fine-tuned to hide capability until a password trigger.
- **Local analysis input:** 2D point clouds where each of the D points is `(v_i^ℓ, v_i^ℓ')` — the same-index neuron's activation in two layers.

### Outputs
Persistence barcodes (dim 0 and 1) → 41-dim barcode summaries → pruned summaries → classifier predictions + SHAP importances + interpreted "topological compression" signature; and, locally, total-persistence-of-1-bars curves across layers.

### Architecture
No new neural architecture. Tooling: **Ripser / Ripser++** (Bauer 2021; Zhang et al. 2020, GPU-accelerated) for Vietoris–Rips PH; PCA, CCA, logistic regression, SHAP for analysis.

### Training objective
None for the PH pipeline. The only training is (a) the LoRA backdoor fine-tuning that *creates* the sandbagged models (WMDP-inspired corpus of 3,347 synthetic questions, following van der Weij et al. 2024), and (b) the downstream classifiers (logistic regression; baseline LDA/SVM).

### Data construction
XPIA activations from the public TaskTracker set; sandbagged models built in-house via LoRA (Hu et al. 2021) with locked (default) and elicited (password) modes; final-token representations extracted per layer under both states. Poisoned prompts further sub-typed into **executed / refused / ignored** for the dispersion analysis.

### Inference procedure
For each layer: draw **K = 64 subsamples of k = 4096** activations from normal and 64 from adversarial (subsampling is theoretically grounded — persistence diagrams converge to population diagrams, Chazal et al. 2014/2015), compute barcodes, vectorize, prune, classify, interpret. Local analysis uses n = 1000 clean and 1000 adversarial samples, with **normalized** and **index-permuted control** conditions.

### Computational requirements
Dominant cost is PH: exact Vietoris–Rips distance/boundary matrices scale **quadratically** in the number of points, which is why subsampling (k = 4096) is mandatory. GPU-accelerated Ripser++ is used. Models analyzed range 3.8B → 70B; the 70B/Mixtral analyses are the heaviest.

## Experimental design

### Models
Six instruction-tuned LLMs: **Phi3-mini-4k (3.8B)**, **Phi3-medium-128k (14B)**, **Mistral 7B**, **LLaMA3 8B**, **LLaMA3 70B**, **Mixtral-8x7B**. Sandbagging fine-tunes only Mistral 7B and LLaMA3 8B.

### Layers or activation sites
Last-token residual/hidden states at multiple layers (representative reporting at layers 1, 8, 16, 24, 32 for Mistral; layer indexing zero-based). Local analysis spans consecutive and non-consecutive layer pairs (intervals 1, 3, 10).

### Datasets
TaskTracker (XPIA, >62k), with injected tasks from BeaverTails / HarmBench / JailbreakBench; a WMDP-inspired synthetic sandbagging corpus (3,347 Qs); and, for robustness, the **LLMail-Inject** adaptive red-teaming dataset (Abdelnabi et al. 2025).

### Baselines
For the discrimination claim: **LDA, linear SVM, logistic regression** trained to separate 1000 clean vs. 1000 poisoned raw activations, **with and without** dimensionality reduction by a **sparse autoencoder (hidden dim 128)**. (This is the paper's *only* SAE use — see below.)

### Metrics
Classification accuracy + AUC-ROC (70/30 split, 5-fold CV); PCA explained variance; CCA loadings; SHAP values; dim-1 barcode statistics (mean birth/death/persistence, number of 1-bars, persistent entropy); total persistence of 1-bars; local dispersion ratio (`Σ_{j≥2} λ_j / (λ_1+ε)`); mean pairwise cosine distance; precision@k for peak localization.

### Controls
**Index-permutation control** (randomly permute neuron indices between layers — kills neuron-to-neuron correspondence); **normalization control** (zero-mean/unit-variance — rules out pure scale effects); within-class ablations for the dispersion metric: **clean-vs-clean, poisoned-vs-poisoned, mixed-vs-mixed**.

### Ablations
Poisoned sub-type split (executed/refused/ignored) for dispersion; neighborhood size `k=30` selected by max clean-vs-poisoned separation; layer-interval sweep (1/3/10) for non-consecutive local analysis; adaptive-attack stress test (LLMail-Inject).

### Statistical testing
Welch's t-test with **FDR correction** across layers for dispersion; permutation testing for peak-localization significance (Table 2, p<.05 / p<.01); bootstrap for cosine-distance distributions. Note: **the headline "perfect accuracy" logistic-regression result is not paired with a variance/seed report** (single 70/30 split + 5-fold CV).

### Number of seeds
Not reported for the main classifiers; robustness comes from **K = 64 subsamples per condition** rather than multiple random seeds.

## Main results

- **Global discrimination (Fact).** A logistic regression on pruned barcode summaries achieves **perfect accuracy and AUC-ROC** on held-out data (70/30) and under 5-fold CV, and **PCA of the pruned summaries visibly separates clean vs. poisoned** across layers (explained variance for Mistral layers 1/8/16/24/32 = 0.59 / 0.49 / 0.52 / 0.96 / 0.83).
- **Barcode summaries vs. linear baselines (Fact, Table 1, Mistral).** Raw-activation linear methods are already strong in deep layers but weaker early; the SAE-reduced versions degrade markedly early. E.g. Layer 0: LR 0.87 (raw) / 0.74 (SAE), SVM 0.8875 / 0.74; Layer 7: SVM 1.0 (raw) / 0.6475 (SAE), LR 0.995 / 0.635; by Layer 31 all reach ~1.0. Barcode summaries "outperform these methods in general, **particularly for early layers**," but the paper frames PH's value as *complementary + interpretable*, not merely higher accuracy.
- **The topological-compression signature (Fact).** Adversarial (poisoned/elicited) conditions yield **fewer 1-bars (loops)** that are **born later, die later, and persist longer**, with **lower persistent entropy** (lifetime mass concentrated in a few dominant cycles) and **higher mean death of 0-bars** (more dispersed/spread-out components). Clean conditions show **many compact, earlier, shorter-lived loops** with higher entropy. Appendix Table 3 confirms mostly-negative clean−poisoned differences in mean birth/death and mostly-positive entropy and #1-bar differences across LLaMA3-8B, Mistral-7B, Phi3-3.8B.
- **SHAP interpretation (Fact).** **Mean death of 0-bars** ranks first in CCA loadings at all layers; higher values push predictions toward "poisoned," lower toward "clean." **Number of 1-bars** is the second key feature; more loops → "clean," fewer → "poisoned."
- **Local information-flow phase transition (Fact).** Total persistence of 1-bars in the 2D consecutive-layer embedding shows clean starts *more* topologically complex and simplifies with depth, while **poisoned starts simpler then rises, diverging from clean around layer ~12** (Mistral). The **permutation control removes the signal**, tying it to specific neuron-to-neuron pathways rather than a statistical artifact.
- **Unsupervised layer localization (Fact).** The per-layer *variance* of a topological feature correlates with clean-vs-poisoned separation; peak-variance layers localize the largest class separations (Table 2: total-persistence-1-bars p@5 = .8 (p<.01); mean birth/death 1-bars p@1 = 1.0 (p<.05)). This gives a **label-free** way to find the most informative layers.
- **Robustness (Fact).** The signature persists even against **adaptive attacks (LLMail-Inject)** designed to evade activation-based defenses (Appendix C.5).
- **Non-consecutive layers (Fact).** Topological interactions remain distinct at layer intervals of 1 and 3 but collapse toward the control at interval 10 — adjacent-layer neuron correspondence carries the signal.

## What the results genuinely demonstrate

- A small set of barcode statistics reliably and interpretably separates clean from adversarial last-token activation *distributions*, and the same qualitative signature ("topological compression") recurs across **6 architectures, 2 attack families, and many layers**.
- The signature is **not a pure scale/artifact effect** (survives normalization) and is **tied to neuron-to-neuron pathways** (destroyed by index permutation).
- There exists a **label-free heuristic** (feature variance) to find the layers where adversarial effects are strongest.
- PH captures information that early-layer linear classifiers on raw/SAE-reduced activations miss.

## What the results do not demonstrate

- **Not a causal mechanism.** The work is descriptive/correlational geometry; it does not show that topological compression *causes* the adversarial behavior, nor intervene to test necessity/sufficiency. (The paper is careful to call these "invariants" / "signatures," not mechanisms.)
- **Not a deployed detector.** Perfect classification is on **distributions of K=64 subsamples**, each pooling 4096 activations — not per-prompt, real-time detection; practical monitoring latency/threshold behavior is untested here.
- **No seed/variance on the classifier accuracy**, so "perfect accuracy" should be read as an in-sample separability result, not a benchmarked generalization number.
- **Generality of attack coverage is limited** to XPIA + sandbagging (+ one adaptive set); it does not cover jailbreak prompting, gradient adversarial suffixes, or many-shot attacks.
- The claim that "linear probe success is a shadow of topological structure" is **argued/suggested**, not proven.

## Strongest evidence

The **local consecutive-layer analysis with the permutation control** (Fig. 9): the clean/poisoned divergence in total 1-bar persistence around layer 12 *disappears* under index permutation. This control most convincingly rules out "PH is just picking up scale/noise" and localizes the effect to genuine neuron-pathway reconfiguration.

## Weakest evidence

The headline **"perfect accuracy and AUC-ROC"** logistic regression. It rests on one 70/30 split + 5-fold CV over subsample-level barcode summaries, with no seeds/variance and a small effective sample of barcodes; near-perfect deep-layer accuracy is *also* achieved by plain linear methods (Table 1), so the accuracy number alone does not establish PH's added value — the interpretability/early-layer/robustness arguments carry that weight.

## Important ablations

- **Permutation control** → signal vanishes ⇒ effect is neuron-correspondence-specific, not statistical.
- **Normalization control** → signal survives ⇒ not merely a magnitude/scale artifact.
- **Clean-vs-clean / poisoned-vs-poisoned / mixed** dispersion checks ⇒ dispersion differences reflect true class structure, not random partitioning.
- **Poisoned sub-typing (executed/refused/ignored)** ⇒ refused prompts *compress* (lower mid-layer dispersion, "shutting down"), executed/ignored *expand* dispersion in mid-layers — the geometry tracks the model's behavioral disposition.
- **Layer-interval sweep (1/3/10)** ⇒ topological interactions are a short-range (adjacent-layer) phenomenon.

## Failure cases

- **LLaMA3-70B is an outlier** in the cosine-distance analysis: poisoned representations show *smaller* cosine distance in middle layers (opposite of smaller models), interpreted as larger models partitioning space differently before re-expanding — the "compression" story is thus not perfectly uniform across scale.
- Non-consecutive interactions **wash out at interval 10**, bounding the range of the local signal.
- PH's **quadratic memory** forces subsampling, so the population topology is only ever *estimated*.

## Limitations stated by the authors

- **PH memory cost** (quadratic in points) → reliance on random subsampling (mitigated by TDA convergence results).
- Need to test whether the topological signatures **generalize to a broader range of adversarial scenarios**.

## Additional limitations not emphasized by the authors

- No causal/interventional validation; purely observational geometry.
- No per-prompt detector, no false-positive-rate / deployment analysis, no seeds on the main classifier.
- The single "SAE" baseline is a generic hidden-dim-128 autoencoder used for dimensionality reduction, **not** a trained interpretability SAE (Anthropic/Gemma-Scope style); so "PH beats SAEs" is not a fair head-to-head against modern dictionary-learning SAEs, and the Discussion's SAE critique is conceptual rather than empirical.
- "Topological compression" is defined via a cluster of correlated statistics dominated by mean death of 0-bars; the distinctness of the 1-bar (loop) contribution over the 0-bar (component/dispersion) contribution is partly entangled (the authors acknowledge 0-bar death ↔ 1-bar birth coupling via Morse theory).

## Reviewer feedback

> [!note] Review availability
> Reviews for `v2PglvLLKT` are **public on OpenReview** (ICLR 2026), but the OpenReview `/notes` and `/pdf` endpoints returned an anti-bot **ChallengeRequiredError** in this session, so the individual review texts, scores, and the meta-review were **not retrieved**. This section is intentionally left unfilled rather than fabricated. **Action:** fetch reviews via a browser/authenticated session and complete: positive points, concerns, questions, rebuttal, resolved/unresolved. (Per CLAUDE.md §24.)

## Why it was accepted

> [!note] Interpretation
> Evidence-based inference from the paper itself + its **Oral** status, not an official reason. Reviews not yet read.

Plausible factors: (1) a **novel, principled lens** (persistent homology / TDA) on a hot topic (LLM interpretability + AI security) that is genuinely underexplored at ICLR; (2) **breadth** — 6 models spanning 3.8B–70B and 2 operationally distinct attack families, yielding a "one consistent signature" narrative that reads as a fundamental finding; (3) **rigor signals** — permutation/normalization controls, subsampling with convergence guarantees, FDR-corrected tests, SHAP interpretability; (4) a **memorable, quotable concept** ("topological compression") plus a provocative theoretical claim (linear-probe success as a shadow of topology); (5) **safety relevance** with a robustness stress test against adaptive attacks. Oral selection likely rewards the crisp, transferable story and cross-disciplinary novelty.

## Why it may have been rejected

Not applicable (accepted, Oral).

## Novelty analysis

### What is genuinely new
Using **persistent homology of LLM activation point clouds to characterize adversarial influence**, the identification of a cross-architecture **"topological compression"** signature, the **neuron-level 2D-embedding local information-flow PH analysis** (with a phase transition), and the **unsupervised feature-variance heuristic** for locating informative layers.

### What is adapted from prior work
Vietoris–Rips PH + barcode vectorization (Ali et al. 2023 survey; 41-dim summary), subsampling theory (Chazal et al. 2014/2015), persistent entropy (Chintakunta 2015; Rucco 2016), Ripser/Ripser++ (Bauer 2021; Zhang et al. 2020), the attack setups (TaskTracker/Abdelnabi 2024; sandbagging/van der Weij 2024; XPIA/Greshake 2023), SHAP (Lipovetsky & Conklin 2001).

### What is mostly engineering or scaling
Building the sandbagged models via LoRA and running PH at 70B scale via subsampling + GPU Ripser is substantial engineering but not conceptual novelty.

### Closest prior papers
Stephenson et al. 2021 (memorization ↔ reduced effective dimensionality of the representation manifold — the direct conceptual ancestor of "compression"); Engels et al. 2025 ("Not all LM features are one-dimensionally linear" — nonlinear geometry / linear-probe-as-approximation); Brüel-Gabrielsson et al. 2020 (topology layer for ML); Zou et al. 2023 (representation engineering); Abdelnabi et al. 2024 (TaskTracker / activation-based task-drift detection).

## Competitor analysis

### Direct competitors
Activation-based adversarial/OOD **monitors** that use *linear* or *isolated-feature* representations: linear probes / task-drift detectors (Abdelnabi et al. 2024, TaskTracker), representation-engineering readouts (Zou et al. 2023), and SAE-latent-based safety classifiers. PH competes on the *geometry-of-the-whole-cloud*, cross-model-comparable axis.

### Architectural / methodological competitors
Other manifold-geometry diagnostics: effective-dimensionality / manifold-capacity analyses (Stephenson et al. 2021; Chung-style), intrinsic-dimension estimators, curvature/anisotropy metrics — alternative ways to quantify representational "shape."

### Evaluation competitors
Any method proposing to *measure* adversarial/OOD state from internals (linear separability accuracy, probe AUC). The paper's contribution is that PH additionally *explains* separability.

### Complementary methods
SAEs and linear probes are framed as complementary: PH could supply the relational/topological view that SAEs (weight-specific, per-activation) structurally cannot, and could help *validate* that linear directions approximate deeper topological structure. Cycle-matching (García-Redondo et al. 2024) and persistent Morse theory are named as future complementary tools.

## Author and lab context

- **Anthea Monod** (Imperial College London, Dept. of Mathematics) — senior/PI; TDA + statistics on geometric/topological data; likely the anchoring lab (multiple co-authors are her students). Central, sustained research program in applied topology, now extending into LLM representation geometry.
- **Inés García-Redondo** (Imperial, LSGNT PhD studentship) — co-first; prior work on **persistent cohomological cycle matching** (2024), directly reusable for future LLM topology work.
- **Qiquan Wang** (Imperial, CRUK Convergence Science PhD) — co-first; applied TDA.
- **Aideen Fay** (Imperial + **Microsoft Security Response Center**, Cambridge) — bridges the AI-security side; co-author on TaskTracker (Abdelnabi et al. 2024) and LLMail-Inject (2025), which supply the attack data. This connection is why the paper's attack setups are unusually realistic/current.
- **Haim Dubossarsky** (Queen Mary Univ. London + Cambridge Language Technology Lab + Alan Turing Institute) — NLP/representation semantics; highest citation count among authors, adds the language-modeling grounding.
- **Interpretation:** a **cross-disciplinary applied-topology × AI-security collaboration** centered on Monod's Imperial math group, plugged into Microsoft's prompt-injection research. This looks like the *start* of a program (apply TDA to model internals), not a one-off.

## Strategic value for our work

- **Borrow:** (1) the **barcode-summary → prune → PCA/CCA → logistic + SHAP** pipeline as a ready-made, interpretable geometry probe; (2) the **permutation + normalization controls** as a template for showing a geometric signal is real (reviewers will expect these of *us*); (3) the **feature-variance unsupervised layer-selection** trick; (4) the **executed/refused/ignored** behavioral sub-typing to connect geometry to model behavior.
- **Avoid:** presenting "perfect accuracy" without seeds/variance; and calling a generic hidden-dim-128 autoencoder an "SAE" baseline — if we compare geometry vs. SAEs we should use *real* trained interpretability SAEs.
- **Baseline we may need:** if we make any "representation geometry / topology detects X" claim, this PH pipeline (and the "topological compression" signature) is now a mandatory baseline/reference.
- **Evaluation protocol to replicate:** subsampled Vietoris–Rips PH (K=64, k=4096) with convergence justification; FDR-corrected Welch tests across layers; adaptive-attack robustness (LLMail-Inject).
- **Claims this blocks:** "we are first to use PH/TDA to characterize adversarial influence on LLM latent spaces" and "adversarial inputs induce topological compression" are now taken.
- **Gaps still open (opportunities):** (a) **causal/interventional** validation — steer along topological directions and test behavior; (b) **per-prompt, real-time** topological detectors with FPR budgets; (c) unifying PH with **SAEs** (do SAE features tile the persistent cycles?); (d) testing the compression hypothesis on **jailbreaks, gradient suffixes, refusal, and hallucination** (is compression a *general* misalignment/OOD signature, as they conjecture?); (e) explaining the **70B outlier** (scale-dependent geometry); (f) turning the "linear probes approximate topology" claim into a **provable** statement.
- **Differentiation:** provide the causal + deployable + SAE-integrated version of this descriptive geometry, or generalize "topological compression" into a broader theory of representation-manifold collapse under distribution shift.

## Reproducibility assessment

- Code availability: **1** — no public repository was found in the arXiv text or an ICLR reproducibility statement this session (Fact: none cited in the read version; OpenReview supplementary not retrievable here).
- Data availability: **4** — TaskTracker (public, >62k), BeaverTails/HarmBench/JailbreakBench, WMDP, LLMail-Inject are public; the in-house LoRA sandbagged checkpoints are not clearly released.
- Hyperparameter detail: **4** — K=64, k=4096, 41-dim summary composition, corr-threshold 0.5, k=30 neighborhood, LoRA/3,347-Q corpus, Ripser/Ripser++ all specified; some classifier details terse.
- Compute transparency: **2** — quadratic PH cost and subsampling explained, but no explicit hardware/runtime budget, especially for 70B/Mixtral.
- Seed reporting: **2** — robustness via 64 subsamples + 5-fold CV, but no multi-seed variance on headline accuracy.
- Evaluation clarity: **4** — metrics and controls well-defined; many results live in appendix tables/figures.
- Ease of reproduction: **3** — public data + standard TDA tooling make the pipeline reconstructable, but absence of released code and the in-house sandbagged models add friction.

## Overall assessment

### Strengths
Genuinely novel, well-motivated cross-disciplinary lens; broad and consistent empirical finding across 6 models and 2 attack families; strong controls (permutation, normalization, within-class); interpretable (SHAP-grounded) rather than black-box; realistic, current attack data; robust to adaptive attacks; a crisp transferable concept ("topological compression") and a provocative theoretical framing.

### Weaknesses
Descriptive/correlational (no causal test); headline accuracy lacks seeds/variance and is matched by linear baselines in deep layers; the "SAE" baseline is not a real interpretability SAE; no deployable per-prompt detector; a scale-dependent 70B outlier; no released code found.

### Confidence in assessment
**High** for method and reported results (full arXiv text incl. appendices A–C read). **Medium** on exact positioning vs. the newest geometry/OOD-monitoring competitors and on whether the accepted version differs from the read arXiv v2. **Low** on reviewer dynamics (reviews not retrieved).

## Key quotations

- "Adversarial inputs induce 'topological compression', where the latent space becomes structurally simpler, collapsing from varied, compact, small-scale features into fewer, dominant, and more dispersed large-scale ones." (Abstract)
- "the success of linear probes may stem from their approximation of more complex, underlying topological structures." (Introduction)
- "While methods such as sparse autoencoders (SAEs) are powerful for identifying the 'building block' features of a representation, they analyze each activation in isolation... because the feature dictionaries learned by SAEs are specific to a single set of model weights, they cannot be reliably compared across different models or fine-tuning stages." (Discussion)
- "poisoned conditions often yield fewer but more dominant dimension-1 features that appear later and persist longer, whereas clean spreads its total persistence across numerous shorter-lived cycles, resulting in higher entropy." (Appendix A.1.1)

## Open questions

- Is topological compression **causal** for the adversarial behavior, or an epiphenomenon of dispersion?
- Does it generalize to jailbreaks, gradient adversarial suffixes, hallucination, and general misalignment (the authors' own conjecture)?
- Can it be made a **real-time, per-prompt** monitor with a controlled false-positive rate?
- Why does **LLaMA3-70B** behave differently in mid-layers — is compression scale-dependent?
- Can the "linear probes approximate topology" claim be formalized/proved?
- How do SAE dictionary features relate to persistent cycles — do they tile them?

## Follow-up papers to read

- Stephenson et al. 2021 — Geometry of generalization and memorization; effective dimensionality (`arXiv:2105.14602`)
- Engels et al. 2025 — Not all LM features are one-dimensionally linear (`arXiv:2405.14860`; ICLR 2025)
- Abdelnabi et al. 2024 — TaskTracker: catching LLM task drift with activations (`arXiv:2406.00799`)
- Abdelnabi et al. 2025 — LLMail-Inject adaptive prompt-injection dataset (`arXiv:2506.09956`)
- van der Weij et al. 2024 — AI sandbagging / password-locked models (`arXiv:2406.07358`)
- Brüel-Gabrielsson et al. 2020 — A topology layer for ML (`arXiv:1905.12200`)
- Zou et al. 2023 — Representation engineering (`arXiv:2310.01405`)
- García-Redondo et al. 2024 — Persistent cohomological cycle matching (JACT 8:695–726)

## Source log

- OpenReview: https://openreview.net/forum?id=v2PglvLLKT (ICLR 2026 Oral; reviews public but **not retrieved** this session — ChallengeRequiredError)
- arXiv abstract: https://arxiv.org/abs/2505.20435
- arXiv full text read (HTML v2): https://arxiv.org/html/2505.20435v2 (main text + Appendices A–C read)
- SlidesLive talk: https://slideslive.com/39056697 (ICLR presentation)
- Code: none found in the read version (repository not cited)
