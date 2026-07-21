---
title: "Bilinear representation mitigates reversal curse and enables consistent model editing"
year: 2026
conference: ICLR
status: accepted
presentation_type: poster
relevance: tier-1
primary_topics:
  - representation geometry
  - model editing
  - mechanistic interpretability
  - linear representation hypothesis
authors:
  - Dong-Kyum Kim
  - Minsung Kim
  - Jea Kwon
  - Nakyeong Yang
  - Meeyoung Cha
institutions:
  - Max Planck Institute for Security and Privacy (MPI-SP)
  - Seoul National University (SNU)
  - KAIST
paper_url: "https://openreview.net/forum?id=pdNaYcApbz"
openreview_url: "https://openreview.net/forum?id=pdNaYcApbz"
arxiv_url: "https://arxiv.org/abs/2509.21993"
code_url: ""
project_url: ""
review_visibility: public
reading_status: complete
last_updated: 2026-07-17
tags:
  - conference/iclr
  - year/2026
  - topic/representation-geometry
  - topic/model-editing
  - topic/mechanistic-interpretability
  - topic/linear-representation-hypothesis
  - status/accepted
  - presentation/poster
  - relevance/tier-1
---

# Bilinear representation mitigates reversal curse and enables consistent model editing

## One-sentence summary

Training decoder-only Transformers from scratch on a synthetic family knowledge graph with sufficient weight decay induces an emergent **bilinear** relational structure (relations as matrices `M_r` with `s^T M_r o`) in the middle layers, and the presence of this structure — not the editing algorithm — is what lets a model overcome the reversal curse AND propagate a single fact edit consistently to its inverse and compositionally entailed facts.

## Why this paper matters

It is a **tier-1 representation-structure / model-editing** paper that reframes two separate, much-discussed failure modes — the **reversal curse** and **model-editing generalization failure** — as symptoms of the *same* cause: an unstructured internal knowledge representation. Its central mechanistic claim is that the **algebraic geometry** of how relational knowledge is encoded (linear vs translational vs bilinear) determines logical consistency, and that a **bilinear** geometry (à la RESCAL knowledge-graph embeddings) is the one that supports inversion (matrix transpose) and composition (matrix product). For our program this matters because: (1) it stakes a strong "representation geometry gates editability" claim that any editing or knowledge-representation work must now engage with; (2) it introduces a concrete **probe battery** (linear / translational / bilinear) as a diagnostic for relational structure; and (3) it links a static structural property (bilinear probe accuracy) to a downstream behavioral outcome (edit propagation) with a high reported correlation, which is exactly the kind of "structure → behavior" evidence reviewers reward.

## Research problem

Are the reversal curse and the failure of model edits to propagate to logically entailed facts (a) inherent limitations of the Transformer architecture / autoregressive objective, or (b) artifacts of *how* knowledge is represented internally? Concretely: which mathematical structure must the hidden representation have to support symmetric (inverse) and compositional (multi-hop) relational reasoning, and does that structure govern edit consistency?

## Motivation

- **Scientific:** Prior work shows LMs learn meaningful geometric structure for features like space/time (Gurnee & Tegmark 2024; Engels et al. 2025), and that relation decoding is often approximable by **linear** (Hernandez et al. 2024) or **translational / Word2Vec-style** (Merullo et al. 2024) maps. But neither linear nor translational structure natively supports symmetric + compositional relations. Bilinear models (RESCAL; Nickel et al. 2011) do, and attention itself is fundamentally bilinear (`x^T A y`, Elhage et al. 2021).
- **Practical:** Editing methods (ROME, MEMIT) fail to propagate edits to entailed facts and require explicitly co-editing both directions to avoid the reversal curse (Thibodeau 2022; Yao et al. 2023; Hase et al. 2024). This is costly and logically brittle.
- **Gap in prior work:** Reversal-curse literature blames the autoregressive objective and proposes data/objective fixes (reverse training, direction-agnostic objectives); it treats the curse as an unavoidable training artifact. Almost no work asks which *internal algebraic structure* is the prerequisite for symmetric/compositional reasoning, or ties that structure to editing.

## Core hypothesis

If a Transformer learns to encode relations as a **bilinear** relational structure (a relation-specific matrix `M_r` mediating subject–object interaction), then transposition of `M_r` yields the inverse relation and products of matrices yield composed relations; such a model will (a) overcome the reversal curse and (b) support logically consistent model editing (edits propagate to inverse + entailed facts). Models lacking this structure will exhibit the reversal curse and fail edit generalization.

## Objective

There is no single trained loss unique to the method; the paper's *analysis* objective is a probe fit. The bilinear probe fits a relation matrix `M_r` via a ridge-regularized RESCAL objective:

- Score: `f_r(s_l, o_l) = s_l^T M_r o_l` (Eq. 3), with target 1 if `(s,r,o)` is a true fact else 0 (Eq. 4).
- Fit: `L(M_r) = (1/2)||X_r − A M_r A^T||_F^2 + (λ_R/2)||M_r||_F^2` (Eq. 5), where `A` stacks entity embeddings and `X_r` is the relation adjacency; solved with an SVD-based closed form to avoid `O(d^6)` Kronecker inversion (Appendix C).
- Linear probe: `o_L ≈ W_r s_l + b_r`, `W_r` from the averaged Jacobian `∂o_L/∂s_l` scaled by `β` (Eq. 1). Translational probe: `s_l + v_r ≈ o_l`, `v_r` = mean displacement (Eq. 2).

Plain language: for each relation, fit the *best* linear map, translation vector, and bilinear matrix that predict the correct object from the subject's hidden state, then see which structure best explains the model's representations layer by layer — and whether the bilinear matrices obey `M_r^T = inverse` and `M_{r2} M_{r1} = composition`.

## Core idea

Intuition: relations like family ties have algebraic closure — "husband" is the inverse of "wife," "father" = "husband ∘ mother." A representation that stores each relation as a *matrix* gets inversion for free (transpose) and composition for free (matrix product). If a model's hidden geometry is bilinear, editing a single fact can ripple correctly to all entailed facts because the same matrices govern them.

Mechanism: train from scratch on a closed-world synthetic family graph, sweep weight decay, and observe that only sufficiently regularized (and seed-lucky) models break the reversal curse. Probe those models: the successful ones develop a strong bilinear signal in **middle layers (6–9)**; the failing ones show no coherent relational geometry. Then verify the matrices are genuinely algebraic (transpose → inverse, product → composition), and finally show bilinear structure predicts edit propagation.

## Method

### Inputs
Hidden states `s_l, o_l ∈ R^d` (`d = 896`) taken at the final token of subject/object names, at layer `l`, for facts `(s, r, o)` from a synthetic family knowledge graph.

### Outputs
(1) Layer-wise probe accuracies for linear/translational/bilinear structure; (2) algebra-test accuracies (transpose→inverse, product→composition); (3) post-edit metrics (edit success, logical generalization, locality) and their correlation with bilinear probe accuracy.

### Architecture
Decoder-only Transformer, **GPT-NeoX** architecture, trained **from scratch**: 12 layers, hidden size 896, 16 attention heads (head dim 56), FFN 3584 (4×), RoPE (base 10,000), max context 1024, dropout 0.1 (attn + MLP hidden), non-parallel residual, ~206M parameters.

### Training objective
Standard autoregressive LM training (next-token). **The one key knob is weight decay** (AdamW), swept over `{0, 0.1, 0.5, 1, 2, 3, 4, 5, 6}` with seeds `{0,1,2}` (27 models). lr `3e-4`, `(β1,β2)=(0.9,0.95)`, cosine decay + 0.01 warmup, 20 epochs.

### Data construction
Synthetic family graph: 1,000 families × 10 entities, 8 relations (husband, wife, father, mother, son, daughter, brother, sister), 36 facts/family. Split into two groups of 500: **Group 1** keeps all 36 facts; **Group 2** withholds father/mother (24 facts). Train set = all facts from both groups (~318M tokens/epoch after augmentation by permuting sentence order, 1,000 permutations/family). **Test set** = the withheld father/mother facts of Group 2 (12/family) — solvable only by inferring reverse/composed relations from Group 1 patterns.

### Inference procedure
Facts are plain sentences ("[Subj First] [Family] [Relation] [Obj First] [Family]"); accuracy = correct next-token generation of the object name (exact match). Reverse inference is tested on unseen father/mother facts.

### Computational requirements
4× A100 GPUs; ~206M-param models trained from scratch. Modest scale (single small architecture, synthetic data), no frontier-scale training.

## Experimental design

### Models
27 GPT-NeoX 206M models (weight-decay × seed sweep); two representatives selected for deep analysis — a **"Reversal Cursed"** model (reverse acc < 40%, shown in blue) and a **"Not Reversal Cursed"** model (reverse acc > 98%, shown in orange).

### Layers or activation sites
All 12 layers probed; subject/object hidden states at the final token of the name. Bilinear structure peaks in **middle layers (6–9)**; best *editing* layers are **early (1–4)**.

### Datasets
Single synthetic family knowledge graph (train + withheld-relation test). No natural-language / pretrained-model data.

### Baselines
Within-paper structural baselines: **linear** relational embedding (Hernandez et al. 2024) and **translational** (Merullo et al. 2024) probes vs the **bilinear** probe; chance = 1/3 (three valid objects per relation per family). For editing: comparison is between bilinear vs non-bilinear (reversal-cursed) models, not between editing algorithms. ROME/MEMIT are discussed as motivation/related work but are **not run**; the edit itself is layer-wise MLP-output fine-tuning.

### Metrics
- Probe accuracy per layer/relation (vs 1/3 chance).
- Algebra tests: transpose accuracy (`M_r^T ⇒ r^{-1}`), composition accuracy (`M_{r2} M_{r1} ⇒ r2∘r1`).
- Editing: **Edit Success** (predicts (A, husband, B′)), **Logical Generalization** (mean over entailed facts: (B′, wife, A); (C/D, father, B′); (B′, son/daughter, C/D)), **Locality** (in-family unrelated facts + other families unchanged).

### Controls
Chance baseline 1/3 justified by closed-world family structure (three candidate objects per relation per family). Probe train/eval on **disjoint family sets** (125 families train, 125 different families eval). Per-relation breakdowns isolate which structure explains which relation.

### Ablations
- Probe sample size `n ∈ {10, 100, 500}` for the linear/Jacobian probe: more samples do **not** rescue linear accuracy (rules out undersampling); bilinear underfits only at very small `n`.
- Per-relation probing (Appendix D): translational structure appears **only** for the symmetric husband/wife pair; bilinear generalizes across all 8 relations.
- Editing layer sweep (all 12 layers) revealing the early-layer editing / mid-layer structure mismatch.

### Statistical testing
No significance tests on probe metrics. Weight-decay sweep uses **3 seeds** per setting. Key quantitative link: `R^2 = 0.939` correlation between peak bilinear probe accuracy and peak logical generalization across models.

### Number of seeds
**3 seeds** per weight-decay setting for the training sweep (27 models total). Editing: 50 independent single-fact edits per model, averaged.

## Main results

- **Reversal curse is regularization-dependent (Fact).** All 27 models reach 100% *train* accuracy, but *test* (unseen reverse father/mother) accuracy depends on weight decay + seed: with weight decay < 1.0 models are consistently cursed; as weight decay increases, outcomes **split** — some models break the curse and reach near-perfect reverse accuracy, others stay cursed (Fig. 2 right). → the curse is an artifact of an under-constrained objective, not architecture.
- **Bilinear structure explains success (Fact).** The Not-Reversal-Cursed model develops a strong, localized **bilinear** probe signal peaking > 95% in middle layers (6–9), while linear/translational probes hover near/below the 1/3 chance line; the Reversal-Cursed model shows no coherent relational geometry (Fig. 3).
- **Structure is genuinely algebraic (Fact).** For the successful model, `M_r^T` predicts inverse relations and `M_{r2}M_{r1}` predicts composed relations with high accuracy, peaking in the same layers 6–9; the cursed model fails both tests (Fig. 4).
- **Per-relation specificity (Fact).** Translational structure exists only for symmetric husband/wife; some cursed models show weak, isolated linear maps for a few relations but not consistently; only the not-cursed model has consistent high-fidelity bilinear structure across all 8 relations (Appendix D).
- **Editing: structure gates propagation (Fact).** Both model types achieve near-perfect **direct** edit success on (A, husband, B′). But **logical generalization** to entailed facts diverges sharply: bilinear (not-cursed) models propagate; cursed models fail almost entirely. Not-cursed models also show **better locality** (Fig. 5b).
- **Structure→editing correlation (Fact).** Peak bilinear probe accuracy correlates with peak logical generalization at `R^2 = 0.939` across models (Fig. 5c).
- **Layer mismatch (Fact/Inference).** Logical generalization is highest when editing **early-to-mid layers (1–4)**, whereas bilinear structure is strongest in **middle layers (6–9)** (Fig. 5d). The authors interpret this as: edit where the structured representation is *forming*, not where it is already established, so the change propagates downstream.

## What the results genuinely demonstrate

- In a controlled from-scratch synthetic setting, the reversal curse is **not** architecturally inevitable: appropriate regularization can produce models that infer unseen reverse facts near-perfectly.
- Among three candidate relational geometries, **bilinear** structure is the one that co-occurs with reversal-curse-free behavior, and the fitted relation matrices satisfy the algebraic identities (transpose=inverse, product=composition) that inverse/compositional reasoning requires.
- A **static, pre-edit** representational property (bilinear probe accuracy) is strongly predictive of a **downstream behavioral** property (edit propagation to entailed facts), with high correlation.

## What the results do not demonstrate

- **No evidence at pretrained / frontier scale.** All models are 206M params trained from scratch on clean synthetic family data; the authors explicitly flag that whether such bilinear structure exists in real large pretrained LMs is an open question.
- **Correlational, not fully causal.** The `R^2=0.939` is a correlation across models; the paper does **not** intervene to *install/remove* bilinear structure and observe the causal effect on editing (the attention-head causal test is proposed as future work, not run).
- **Editing baselines not benchmarked.** ROME/MEMIT are motivation, not compared; the edit is simple layer-wise MLP-output fine-tuning, so results speak to "editability given structure," not to which algorithm is best.
- **Domain generality unknown.** One closed-world relational domain (family) with strong algebraic closure; whether findings transfer to non-family, non-closed, or multi-domain knowledge (where geometry may be non-uniform) is untested.
- **The regularization mechanism is partly opaque.** Weight decay *enables* but does not *guarantee* the structure (seed-dependent split); why some seeds succeed and others fail at the same weight decay is not explained.

## Strongest evidence

The combination of Experiment 2 (bilinear probe dominates in layers 6–9) + Experiment 3 (the *same* matrices pass transpose/composition algebra tests in the *same* layers) + Fig. 5c (`R^2=0.939` structure↔edit-propagation). Together these make the "bilinear geometry underlies logical consistency" claim internally coherent across probing, algebra, and editing.

## Weakest evidence

The layer-mismatch interpretation (edit early layers 1–4 even though structure lives in 6–9). It is a plausible and interesting observation, but the "edit where structure is forming" explanation is an inference from aggregate curves, not tested by a mechanistic intervention; it rests on averaged editing accuracy across 50 edits without variance/significance reporting per layer.

## Important ablations

- **Probe sample size (`n=10/100/500`):** linear probe stays poor regardless of `n` → its failure is structural, not a sampling artifact (strengthens the "bilinear, not linear" conclusion). Bilinear only underfits at tiny `n`.
- **Per-relation translational probe:** high only for symmetric husband/wife → translational geometry captures symmetric pairs but cannot represent asymmetric/compositional relations, motivating bilinear.
- **Editing across all 12 layers:** exposes the structure/editing layer mismatch — the key practical takeaway that *where* you edit matters relative to where structure forms.

## Failure cases

- **Reversal-cursed models** (low weight decay, or unlucky seeds) fail unseen reverse facts and fail edit propagation despite perfect train accuracy and successful *direct* edits.
- Even in successful models, edits made at **later layers** (where structure is already established) propagate worse than early-layer edits — a brittleness of naive fine-tuning w.r.t. layer choice.

## Limitations stated by the authors

- Models are trained **from scratch on clean synthetic data**; scaling to large pretrained models with noisy real knowledge is unverified.
- Knowledge is unlikely to be encoded by a single uniform geometry in real models; different domains may use different relational structures.
- The work is framed explicitly as a **proof of concept** that LMs *can* form this structure, not that they generally *do*.
- The bilinear ↔ attention-head connection is a **hypothesis** (attention is bilinear; specific heads may implement `M_r`), not demonstrated.

## Additional limitations not emphasized by the authors

- **Single architecture / size** (GPT-NeoX 206M); no architecture or scale sweep for the structural claim itself.
- **Correlational core result**; no causal manipulation of the representation to establish that bilinear structure is *necessary/sufficient* for editing.
- **No standard editing baselines** (ROME/MEMIT/MEND) actually run, so the practical "structure > algorithm" message is inferred, not benchmarked against the algorithms it critiques.
- **Closed-world, type-constrained domain** with only 8 relations engineered to have clean inverses/compositions — arguably the most favorable possible setting for a bilinear story (construct-validity concern).
- No variance/significance on editing metrics; `R^2=0.939` is across a modest number of models.

## Reviewer feedback

> [!note] Review availability
> Reviews for `pdNaYcApbz` are listed as **public** on OpenReview (ICLR 2026), but the review texts, scores, and meta-review were **not retrieved** in this session: OpenReview access returned a `ChallengeRequiredError` / anti-bot challenge as noted by the requester. Per CLAUDE.md §24, this section is intentionally left unfilled rather than fabricated. **Action:** fetch reviews via a browser/authenticated session and complete: positive points, concerns, questions raised, author rebuttal, and which concerns were resolved vs unresolved.

## Why it was accepted

> [!note] Interpretation
> Evidence-based inference from the paper itself and its Poster acceptance; reviews were not read this session, so this is not an official rationale.

Plausible factors: (1) it offers a **unifying, mechanistic reframing** of two prominent problems (reversal curse + editing generalization) under one representational cause; (2) the **linear/translational/bilinear probe comparison** is clean and the algebra tests (transpose/composition) give a satisfying "the structure is real, not just predictive" argument; (3) a crisp headline quantitative link (`R^2=0.939`); (4) fully controlled synthetic setup allows unambiguous claims; (5) timely for the active model-editing and knowledge-representation communities (Primary Area: interpretability and explainable AI). The controlled-toy nature likely capped it at Poster rather than a higher tier.

## Why it may have been rejected

Not applicable (accepted, Poster).

## Novelty analysis

### What is genuinely new
The claim + evidence that a **bilinear relational geometry** is the specific algebraic structure gating both reversal-curse mitigation and edit propagation, and the demonstration that a **static bilinear-probe score predicts editing generalization** (`R^2=0.939`). The transpose=inverse / product=composition algebra tests applied to probe-extracted relation matrices in an LM are a novel diagnostic.

### What is adapted from prior work
RESCAL bilinear relational model + SVD/ALS solver (Nickel et al. 2011; Nickel 2013); linear relation embedding probe (Hernandez et al. 2024; Paccanaro & Hinton 2002); translational structure (Merullo et al. 2024; Word2Vec, Mikolov et al. 2013); reversal-curse framing (Berglund et al. 2024; Allen-Zhu & Li 2025); editing-as-belief-revision critique (Hase et al. 2024); representation shattering under editing (Nishi et al. 2025); attention-is-bilinear (Elhage et al. 2021); attention-head relational functionality (Elhelo & Geva 2025).

### What is mostly engineering or scaling
The synthetic-graph construction and probe pipeline are careful but standard engineering; the editing procedure is vanilla layer-wise MLP-output fine-tuning. No scaling contribution.

### Closest prior papers
Hernandez et al. 2024 (linear relation decoding) and Merullo et al. 2024 (translational) — this paper's direct structural foils; Nishi et al. 2025 (editing breaks topology) — closest on the structure↔editing link; Berglund et al. 2024 (reversal curse definition).

## Competitor analysis

### Direct competitors
Papers claiming a *specific* geometry for relational decoding: **Hernandez et al. 2024** (linear relation embeddings), **Merullo et al. 2024** (translational/Word2Vec arithmetic). This paper argues both are insufficient and bilinear wins — direct claim-space overlap.

### Indirect competitors
Reversal-curse mitigation via **data/objective** interventions: reverse training (Golovneva et al. 2024), LM-generated reversed examples (Lampinen et al. 2025), factorization/direction-agnostic objectives (Kitouni et al. 2024), reversal-curse training-dynamics theory (Zhu et al. 2024). They target the same failure via a different route (training, not representation geometry).

### Evaluation competitors
Model-editing evaluation / critique frameworks: **Hase et al. 2024** (belief-revision framing), **Nishi et al. 2025** (representation shattering), editing surveys (Yao et al. 2023). They offer alternative ways to conceptualize/measure edit consistency.

### Complementary methods
ROME/MEMIT (Meng et al. 2022, 2023) and EasyEdit (Wang et al. 2024) as the editing algorithms whose failures this paper explains; RESCAL/KG-embedding literature as the structural toolkit. A "geometry-aware editing algorithm" would *combine* this diagnosis with those editors.

## Author and lab context

- **Meeyoung Cha** (corresponding; MPI-SP, Germany + KAIST) — senior PI; data science / computational social science / trustworthy ML, now interpretability + knowledge in LMs. Likely the anchoring lab.
- **Dong-Kyum Kim** (MPI-SP) — appears as lead author (personal page lists this paper); prior work in ML / physics-of-learning style controlled studies (Fact: authorship + homepage; specific trajectory = Inference).
- **Jea Kwon** (MPI-SP) — co-author, MPI-SP group.
- **Minsung Kim** (SNU) and **Nakyeong Yang** (SNU / MPI-SP) — Seoul National University collaborators; Yang has a joint MPI-SP/SNU affiliation.
- Cross-institution collaboration **MPI-SP (Germany) ↔ SNU / KAIST (South Korea)**. This reads as a **coordinated group program** on knowledge representation + editing in a controlled/synthetic paradigm rather than a one-off. (Institutional affiliations = Fact from the paper masthead; program characterization = Inference.)

## Strategic value for our work

- **Borrow:** the **linear / translational / bilinear probe triad** as a reusable diagnostic for relational structure; the **algebra-test** idea (transpose→inverse, product→composition) as evidence that a probed structure is *functional*, not just correlational; the **structure-score ↔ behavior** correlation design (predict a downstream capability from a static representational metric); the controlled synthetic-knowledge-graph paradigm for clean causal-ish claims.
- **Avoid:** stopping at correlation — reviewers (and our own standards) will want a **causal intervention** (install/ablate the structure, or patch attention heads) before claiming a mechanism; and avoid over-generalizing from a single closed-world domain.
- **Baseline we likely need:** if we work on editing or relational representation, the bilinear-probe diagnostic and the "edit early layers where structure forms" observation become things to test against / cite.
- **Evaluation protocol to replicate:** edit-success / logical-generalization / locality triad; disjoint-family probe train/eval split; weight-decay × seed sweep to expose the regularization-dependent phase split.
- **Claim this blocks:** "we are first to link a specific representational geometry to editing consistency," and "bilinear structure underlies reversal-curse mitigation," are now taken.
- **Gap still open:** (1) does bilinear structure exist / can it be *induced* in **real pretrained** LMs; (2) **causal** demonstration (attention-head intervention aligned to estimated `M_r`); (3) **geometry-aware editing algorithms** that exploit or preserve the structure; (4) multi-domain / non-closed-world knowledge where geometry may be heterogeneous; (5) principled explanation of the seed-dependent phase transition.
- **Differentiation:** provide the causal + pretrained-scale evidence this paper lacks, or generalize beyond bilinear to mixtures/heterogeneous relational geometries.

## Reproducibility assessment

- Code availability: **2** (no public repository found this session; the paper only states it uses the GPT-NeoX library + HuggingFace Transformers + PyTorch — **Fact:** no code URL located; treat as *not released / unverified*).
- Data availability: **4** (dataset is synthetic and fully specified — generation rules, exact name pools, splits, augmentation, ~318M tokens — so it is regenerable, though no download link).
- Hyperparameter detail: **5** (full architecture, optimizer, lr, betas, schedule, epochs, weight-decay sweep, seeds, edit lr / early-stop, probe `n`, `β`, `λ_R` sweeps all stated in Appendices A–D).
- Compute transparency: **4** (4× A100 stated; ~206M params; no wall-clock/total-GPU-hours).
- Seed reporting: **4** (3 seeds for the training sweep; 50 edits averaged; but no variance bars/significance on core probe/edit metrics).
- Evaluation clarity: **4** (metrics precisely defined; several results only in figures, not tabulated numerically in text).
- Ease of reproduction: **4** (small models + fully specified synthetic data make it tractable; absence of released code is the main friction).

## Overall assessment

### Strengths
Clean unifying thesis (one representational cause for two failures); careful probe design + algebra validation showing the structure is functional; a memorable quantitative structure↔behavior link (`R^2=0.939`); fully controlled, well-documented synthetic setup; practically actionable "which layer to edit" observation.

### Weaknesses
Toy/synthetic + from-scratch only (no pretrained/frontier evidence); correlational core result without causal intervention; editing baselines (ROME/MEMIT) discussed but not run; single closed-world domain engineered to favor a bilinear story; unexplained seed-dependent phase transition; no variance/significance on core metrics; no public code located.

### Confidence in assessment
**High** for method and results as reported (full paper + appendices read from the arXiv HTML v3). **Low** on reviewer dynamics (reviews blocked by anti-bot challenge, not read). **Medium** on code status (searched; none found, but absence of evidence ≠ evidence of absence).

## Key quotations

- "We show that this is not an inherent failure but an artifact of how models encode knowledge." (Abstract)
- "the efficacy of language model editing depends not only on the choice of algorithm but on the underlying representational geometry of the knowledge itself." (Abstract)
- "Figure 5c reveals a robust positive correlation (R² = 0.939), establishing that a well-structured bilinear representation predicts a successful logical propagation of a single edit." (§4.4)
- "to effectively edit an entity, one must intervene at the layers where the structured representation is being formed, rather than at the layers where it is already fully established and utilized." (§4.4)

## Open questions

- Do bilinear relational structures exist in — or can they be induced in — large **pretrained** LMs with noisy real knowledge?
- Is the structure→editing link **causal**? Would intervening on attention heads aligned to estimated `M_r` matrices change edit propagation?
- Why does the reversal-curse outcome **split by seed** at the same weight decay — what determines which basin a model falls into?
- Can editing algorithms be made **geometry-aware** (detect a fact's local geometry, then edit to respect/leverage it)?
- Does the finding survive multi-domain, non-closed-world, or non-symmetric relation sets?

## Follow-up papers to read

- Hernandez et al. 2024 — Linearity of relation decoding in transformer LMs (`openreview:w7LU2s14kE`)
- Merullo et al. 2024 — LMs implement Word2Vec-style vector arithmetic (NAACL 2024)
- Nickel et al. 2011 — RESCAL: three-way model for relational data (ICML 2011)
- Berglund et al. 2024 — The Reversal Curse (`openreview:GPKTIktA0k`)
- Hase et al. 2024 — Fundamental problems with model editing / belief revision (TMLR)
- Nishi et al. 2025 — Representation shattering in transformers via knowledge editing (ICML 2025, `openreview:BKOeyZal0x`)
- Meng et al. 2022 / 2023 — ROME / MEMIT
- Kitouni et al. 2024 — The factorization curse (NeurIPS 2024, `openreview:f70e6YYFHF`)
- Elhelo & Geva 2025 — Inferring functionality of attention heads (ACL 2025)

## Source log

- Official / OpenReview: https://openreview.net/forum?id=pdNaYcApbz (ICLR 2026 Poster; Primary Area: interpretability and explainable AI; Submission #21044; reviews public but **not retrieved** — anti-bot ChallengeRequiredError)
- arXiv (full text + appendices read): https://arxiv.org/abs/2509.21993 ; HTML v3: https://arxiv.org/html/2509.21993v3
- OpenReview PDF: https://openreview.net/pdf?id=pdNaYcApbz
- Author page (confirms authors + BibTeX + ICLR 2026): https://kdkyum.github.io/
- Code: none located this session (paper cites GPT-NeoX library + HuggingFace Transformers + PyTorch; no dedicated repo found)
- Secondary (context only): https://en.papernotes.org/ICLR2026/knowledge_editing/bilinear_representation_mitigates_reversal_curse_and_enables_consistent_model_ed/
