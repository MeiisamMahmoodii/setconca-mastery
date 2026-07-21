---
title: "Automated Interpretability Metrics Do Not Distinguish Trained and Random Transformers"
year: 2026
conference: ICLR
status: accepted
presentation_type: poster
relevance: tier-1
primary_topics:
  - sparse autoencoders
  - mechanistic interpretability
  - interpretability evaluation
  - auto-interpretability
  - null models / sanity checks
authors:
  - Thomas Heap
  - Tim Lawson
  - Lucy Farnik
  - Laurence Aitchison
institutions:
  - University of Bristol
paper_url: "https://openreview.net/forum?id=USyGD0eUod"
openreview_url: "https://openreview.net/forum?id=USyGD0eUod"
arxiv_url: "https://arxiv.org/abs/2501.17727"
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
  - topic/interpretability-evaluation
  - topic/auto-interpretability
  - status/accepted
  - presentation/poster
  - relevance/tier-1
---

# Automated Interpretability Metrics Do Not Distinguish Trained and Random Transformers

## One-sentence summary

Using randomly initialized transformers as a null model, the authors show that SAEs trained on random-weight Pythia models produce auto-interpretability scores and reconstruction metrics that are often close to those from fully trained models, so high aggregate SAE metrics are **not** by themselves evidence that computationally relevant learned features have been recovered.

## Why this paper matters

This is a **validity / critique** result, not a new method — and that is precisely why it is strategically high-value. It applies a classic interpretability sanity check (compare against a strong null model; Adebayo et al. 2020 for saliency maps) to the SAE evaluation stack that the whole field currently relies on (auto-interp fuzzing/detection scores, explained variance, cosine similarity, CE-loss-recovered). The finding is that the most-cited **aggregate** metrics fail the sanity check in many settings: a transformer with i.i.d. Gaussian weights, when fed through the same SAE + auto-interp pipeline, looks "interpretable" too. For any paper (including ours) that argues "our SAE learns good/interpretable features because metric X is high," this paper raises the evidentiary bar: it makes a **randomized-baseline control** something reviewers can now reasonably demand.

## Research problem

Do the standard quantitative SAE quality metrics — especially aggregate auto-interpretability scores — actually measure whether an SAE has recovered *learned, computationally relevant* features, or can they be driven high by structure that exists even without training (data statistics + architectural inductive bias)?

## Motivation

- **Scientific:** A robust interpretability method must separate features that come from *learning* from artifacts of the *data* or *architecture*. The standard way to check this (borrowed from the saliency-map literature, Adebayo et al. 2020) is a null-model / sanity check: run the method on a randomly initialized network and see if the metric collapses. This check had not been systematically applied to the modern SAE auto-interp pipeline.
- **Practical:** Auto-interp scores (Bills et al. 2023; Paulo et al. 2024) and reconstruction metrics are the currency used to claim SAE progress (SAEBench, Neuronpedia, GemmaScope). If they don't discriminate trained from random, headline SAE "quality" numbers are weaker evidence than assumed.
- **Gap in prior work:** Prior random-network results were narrow. Bricken et al. (2023) found auto-interp *did* discriminate random vs trained **one-layer** transformers; Karvonen et al. (2024c) found SAEs extract much more structure from trained vs random transformers **on board games**. This paper argues language data is different (sparse and concept-aligned) and tests across the full Pythia scale ladder.

## Core hypothesis

If common aggregate SAE metrics genuinely track learned computation, they should be much higher for SAEs trained on trained transformers than for SAEs trained on randomly initialized transformers. The paper's finding is the negation: for many metrics, model sizes, and layers, the trained and randomized settings are **similar** (and clearly separated only from a degenerate control), so the metrics do not, on their own, certify recovery of learned features.

## Objective

There is no new training objective — the paper *evaluates* standard TopK SAEs. What is "optimized/measured" is a battery of established SAE quality metrics computed on SAEs trained on activations from five transformer variants, plus a toy-model analysis of where the apparent sparsity/superposition comes from.

Metrics evaluated (Fact, §3, Figs 1–2):

- Auto-interpretability AUROC via the Paulo et al. (2024) **"fuzzing"** task (primary), with **"detection"** in Appendix B.
- Reconstruction: **cosine similarity** (activation vs reconstruction) and **explained variance**.
- Sparsity/norm: $L^1$ norm.
- **CE-loss-recovered** (loss added by substituting SAE reconstruction, normalized by zero-ablation).
- **Token-distribution entropy** of each latent's activations over token IDs — a proposed proxy for feature "abstractness"/complexity.

## Core idea

Intuition: a randomly initialized transformer has learned nothing, so if an SAE + auto-interp pipeline still reports "interpretable, high-quality features" on it, the metric must be picking up something other than learned computation — most likely (a) sparse/superposed structure already present in the token embeddings and (b) the tendency of random nonlinear layers to *preserve or even amplify* that sparse structure.

Mechanism: train per-layer TopK SAEs on each transformer variant (trained vs several randomization schemes vs a degenerate control), run identical evaluation, and compare curves across layers and model sizes. Then use toy models (Sharkey-style superposed data, GloVe vectors, random MLPs) to argue *why* random networks can look interpretable.

## Method

### Inputs

Residual-stream activation vectors from Pythia language models (70M–7B; Fact: "between 70M and 7B parameters", experiments cover 70m / 160m / 410m / 1b / 6.9b), collected on text from **RedPajama** (RedPajama-V2), with a 10M-token activation buffer.

### Outputs

Trained SAEs per (model, variant, layer), and the resulting evaluation metrics + auto-interp explanations/scores.

### Architecture

**TopK / $k$-sparse SAEs** (Makhzani & Frey 2014; Gao et al. 2024). Default hyperparameters: **expansion factor $R=64$**, **sparsity $k=32$**. Training implementation based on EleutherAI **sparsify**; evaluation/auto-interp based on EleutherAI **delphi** (Caden et al. 2025) and **SAEBench** (Karvonen et al. 2024a).

### Training objective

Standard TopK SAE reconstruction (no novel loss). SAEs trained on **100M tokens** for primary experiments (Appendix C repeats a subset at **1B tokens** with qualitatively similar results; Appendix D shows a 1M-token SAE is visibly under-trained).

### Data construction — the five transformer variants (Fact, §3)

1. **Trained** — the normal Pythia model.
2. **Re-randomized incl. embeddings** — all parameters (including embeddings) re-sampled from Gaussians whose per-matrix mean/variance match the trained weights (norm-preserving randomization).
3. **Re-randomized excl. embeddings** — as above, but the pretrained embedding / unembedding matrices are kept (frozen), only the other weights randomized.
4. **Step-0** — Pythia's official `step0` revision = weights at initialization, before any training.
5. **Control** — the trained model, but at inference each token's embedding is replaced by fresh i.i.d. standard-Gaussian noise (so a token has no consistent embedding). Expected to perform at chance — this is the *negative* control that the metrics **should** flag.

### Inference procedure

For each trained SAE, randomly sample **100 latents** and compute auto-interp with **Meta-Llama-3.1-70B-Instruct-AWQ-INT4** as both explainer and simulator/classifier. Report fuzzing AUROC (detection in appendix).

### Computational requirements

Single **NVIDIA A100 80GB**; ~**435 GPU-hours** total for final runs (Pythia-6.9b dominates at ~350h across its 5 variants), with roughly equal additional cost for preliminary/failed runs (Appendix K).

## Experimental design

### Models

Pythia suite: 70m, 160m, 410m, 1b, 6.9b. SAEs trained at every layer (<410M), every 2nd layer (1b), every 4th layer (6.9b).

### Layers or activation sites

Residual stream, swept across layers (a central axis of the analysis — many effects are layer-dependent).

### Datasets

RedPajama / RedPajama-V2 for SAE training and auto-interp text. Toy-model section (§4) uses Sharkey-style synthetic superposed data and GloVe word vectors (50/100/200/300-dim).

### Baselines / comparison conditions

The five variants above are the comparison. The **"Trained"** variant is also cross-checked against SAEs from the literature (Kissane et al. 2024; Rajamanoharan et al. 2024a; Mudide et al. 2024) to confirm the trained SAEs are of normal quality.

### Metrics

Fuzzing AUROC (primary auto-interp), detection AUROC, cosine similarity, explained variance, $L^1$ norm, CE-loss-recovered, token-distribution entropy.

### Controls

Two kinds: (a) the **Control** inference-time random-embedding variant as a *negative* control that should collapse; (b) toy-model Gaussian controls with matched mean/variance to isolate the effect of superposed structure.

### Ablations / robustness

- **Training-data size:** 100M (main) vs 1B (Appendix C, similar) vs 1M (Appendix D, under-trained).
- **SAE hyperparameters (Pythia-160m):** expansion factors $R \in \{16,32,64,128\}$ and $k \in \{16,32\}$ — results stable (Appendix F, Fig 18). Pythia-1b with tiny $R=2,k=4$ separates on explained variance / CE-recovered but **auto-interp stays similar** (Appendix G).
- **Scoring method:** fuzzing (main) vs detection (Appendix B) — same qualitative story.

### Statistical testing / seeds

**Five random seeds** for uncertainty on **Pythia-70m** metrics (Appendix E, Fig 17). The larger-model main curves are not reported with multi-seed error bars (compute cost). No formal significance tests on the trained-vs-random gap.

## Main results

> [!note] Numbers vs figures
> Most quantitative results are presented as **AUROC/metric-vs-layer curves and ROC curves** (Figs 1–2, 6–14), not tabulated point values. Claims below are the qualitative patterns the authors report; exact per-point values live in the figures, so specific numbers are **not** transcribed here to avoid invention.

- **Auto-interp does not separate trained from randomized (headline).** Fuzzing AUROC curves for Trained, Re-randomized (incl./excl. embeddings), and Step-0 largely **overlap**, while only the **Control** sits near chance (Figs 1, 2). Same pattern for detection scoring (Appendix B).
- **Reconstruction metrics partly discriminate — but mostly separate the Control, not trained-vs-random.** Cosine similarity and explained variance are much lower for the **Control** than for the other variants; the randomized variants (esp. norm-preserving re-randomizations) track the trained model reasonably closely. The Control's reconstruction error tends to *rise* across layers while the others *fall* (attributed to the Gaussian being maximum-entropy / "least structured").
- **CE-loss-recovered is meaningful only for the Trained variant.** For any randomized variant the underlying model's loss is bad regardless of whether original or reconstructed activations are used, so loss-recovered is not a usable discriminator there.
- **Scale effect:** auto-interp AUROC increases with model size for all non-Control variants; the trained-vs-random gap is *wider for small models* (e.g., Pythia-70m) and *narrows for large models* (e.g., Pythia-6.9b). This is consistent with — and extends — Bricken et al. (2023), who saw discrimination for one-layer models.
- **Where a difference does show up — feature "abstractness" via token-distribution entropy.** Trained models' latents get **higher entropy with depth** (later-layer latents fire across many tokens = more abstract). Randomized variants stay **low entropy** (single-/few-token latents) and do not become more complex with depth. The Control is uniformly high-entropy but low auto-interp. So a *targeted, per-latent* measure reveals the distinction the *aggregate* scores miss (Fig 2 last row; Appendix H, Fig 20).
- **Toy models (§4) — plausible mechanism.** (i) Linear maps provably preserve superposition; (ii) random ReLU MLPs empirically *preserve and can amplify* sparse structure (Fig 3; Pareto frontiers Fig 5). (iii) GloVe embeddings and Pythia embedding matrices already show some superposition, and passing them through a random MLP *increases* apparent sparsity — supporting the idea that random transformers "sparsify" their inputs.

## What the results genuinely demonstrate

- **Fact:** Under the tested conditions (Pythia 70M–7B, RedPajama, TopK SAEs, Llama-3.1-70B auto-interp), aggregate fuzzing/detection auto-interp scores are close for SAEs on trained vs randomized transformers, and clearly separated only from a degenerate random-embedding control.
- **Fact:** A cheap per-latent statistic (token-distribution entropy) recovers a qualitative trained-vs-random distinction that the aggregate scores obscure.
- **Fact (toy):** Random linear/nonlinear maps preserve, and often amplify, sparse/superposed structure in their inputs.

## What the results do not demonstrate

- **Inference (authors are explicit):** This does **not** show SAEs on real models fail to learn meaningful features. It shows the *metrics* are insufficient proxies. (§5, §6.)
- **Hypothesis:** Which mechanism (input superposition preserved vs random-network-introduced superposition) dominates is left open (§4 defers to future work).
- **Unknown:** Whether the same overlap holds for non-Pythia families, non-residual sites, non-TopK SAEs (JumpReLU/Gated/Matryoshka), or non-fuzzing/detection metrics (e.g., probing-based SAEBench tasks, downstream unlearning). The evidence is confined to the tested stack.
- No causal/faithfulness claim: the paper is about evaluation validity, not about mechanisms in trained models.

## Strongest evidence

The **consistency of the trained-vs-random overlap across the full Pythia scale ladder and across both fuzzing and detection scoring** (Figs 1–2, Appendix B), *combined with* the Control collapsing to chance. The Control is what makes the argument sound: it proves the pipeline *can* register "no learned features," so the trained/random overlap is a real failure of discrimination rather than a saturated/uninformative metric.

## Weakest evidence

The **toy-model mechanism (§4)** is suggestive but not conclusive — the authors themselves defer the "which cause dominates" question, and the GloVe/embedding superposition gap is smaller than for the synthetic Sharkey data. The **token-entropy "abstractness"** proxy is explicitly called preliminary/proof-of-concept and is not a validated abstractness measure.

## Important ablations

- **Hyperparameter robustness (Fig 18):** the overlap is not an artifact of a specific $R$/$k$ — it holds across expansion factors 16–128 and $k \in \{16,32\}$.
- **Very small SAE (Fig 19, $R=2,k=4$):** reconstruction/CE metrics *do* separate such degenerate SAEs, yet **auto-interp remains similar** — reinforcing that auto-interp specifically is the fragile metric.
- **Data scale (Figs 15–16):** 1B tokens ≈ 100M tokens qualitatively; 1M tokens under-trains — so the effect is not a data-starvation artifact.

## Failure cases

The relevant "failure" here is a failure *of the metrics*: aggregate auto-interp cannot flag a model that has learned nothing. A secondary observed pattern is auto-interp *quality degrading with layer depth* for smaller models (Appendix B), and CE-loss-recovered being undefined-in-spirit for random variants.

## Limitations stated by the authors

- Focused on **one model family (Pythia)** and **one dataset (RedPajama-V2)**; cannot test all datasets/architectures (§5).
- Used the **default explainer/simulator model** in the EleutherAI (delphi) framework; other judge models might behave differently (§5).
- Explicit disclaimer: they do **not** claim SAEs fail to capture trained-model information beyond random — only that aggregate auto-interp doesn't necessarily indicate interesting underlying features (§5).

## Additional limitations not emphasized by the authors

- Multi-seed uncertainty is only shown for **Pythia-70m** (Appendix E); the large-model headline curves lack error bars, and there is no formal significance test on the (small) trained-vs-random gap.
- Only **fuzzing/detection** auto-interp + reconstruction/CE metrics are tested; the broader SAEBench suite (probing, spurious-correlation, unlearning, feature-splitting tasks) is **not** run, yet the title generalizes to "automated interpretability metrics." The claim is strongest for *aggregate auto-interp AUROC* specifically.
- Only **100 sampled latents per SAE** feed the auto-interp aggregates.
- "Abstractness" is operationalized only via token-ID entropy; no human validation.

## Reviewer feedback

> [!warning] Reviews not retrieved — do not fabricate
> Per the task brief, OpenReview reviews for `USyGD0eUod` are **public but were blocked this session** (a `ChallengeRequiredError` / anti-bot challenge prevented retrieving the `/notes` and `/pdf` review endpoints; cf. the same issue noted for `bojVI4l9Kn`). The review texts, scores, and meta-review were therefore **not read**. This section is intentionally left unfilled rather than invented. **Action:** fetch reviews via a browser/authenticated OpenReview session and complete positive points, concerns, questions, rebuttal, and resolved/unresolved items. (Per CLAUDE.md §24.)

### Main positive points

*Not retrieved.*

### Main concerns

*Not retrieved.*

### Questions raised by reviewers

*Not retrieved.*

### Author rebuttal

*Not retrieved.*

### Which concerns were resolved

*Not retrieved.*

### Which concerns remained unresolved

*Not retrieved.*

## Why it was accepted

> [!note] Interpretation
> The following is an evidence-based inference from the paper and its accepted/Poster status, **not** an official reason. Reviews were not read this session.

Plausible factors: (1) a **clean, community-relevant sanity-check result** that questions metrics everyone uses; (2) it imports a well-established methodology (null-model sanity checks; Adebayo et al. 2020) into SAE-land, which is easy for reviewers to endorse; (3) breadth across the **full Pythia scale ladder** and multiple randomization schemes gives the negative result credibility; (4) careful controls (the random-embedding Control collapsing to chance) pre-empt the obvious "your metric is just saturated" objection; (5) it is **constructive** — it proposes a direction (routine randomized baselines + targeted abstractness measures) rather than only criticizing. Poster (not Oral) may reflect that it is a critique/negative-result rather than a new capability, and that the mechanism (§4) is left open.

## Why it may have been rejected

Not applicable (accepted, Poster).

## Novelty analysis

### What is genuinely new

Systematically applying the **null-model sanity check** to the *modern SAE + LLM-based auto-interp* pipeline across a wide model-size range and multiple carefully-designed randomization schemes; the demonstration that **aggregate auto-interp AUROC** in particular fails to discriminate; and the **token-distribution-entropy** abstractness proxy that does discriminate.

### What is adapted from prior work

Null-model/sanity-check philosophy (Adebayo et al. 2020, saliency maps); auto-interp fuzzing/detection scoring (Paulo et al. 2024) and simulation scoring (Bills et al. 2023); TopK SAEs (Makhzani & Frey 2014; Gao et al. 2024); toy superposition setup (Sharkey et al. 2022; Elhage et al. 2022); tooling (EleutherAI sparsify/delphi, SAEBench).

### What is mostly engineering or scaling

Running the existing SAE-training + auto-interp stack over five variants × many layers × five model sizes is largely careful, expensive experimentation on top of existing codebases, not new machinery.

### Closest prior papers

Bricken et al. (2023) (random vs trained *one-layer* discrimination — this paper extends to multi-layer/scale and finds the gap narrows with size); Karvonen et al. (2024c) (board-game random-vs-trained, opposite-leaning finding, which this paper contextualizes via language-data sparsity); Paulo & Belrose (2025) "SAEs trained on the same data learn different features" (adjacent SAE-reliability critique).

## Competitor analysis

### Direct competitors

Other **SAE-evaluation / critique** works that shape what counts as evidence: **SAEBench** (Karvonen et al. 2024a) as the positive-framing benchmark this paper implicitly pressure-tests; **AxBench** (Wu et al. 2025) and **Kantamneni et al. 2025** (simple baselines beat SAEs) as fellow "are SAE metrics telling us what we think?" skeptics. Bricken et al. (2023) is a partial counter-data-point.

### Architectural competitors

n/a in the usual sense — no method proposed. The nearest "rival contribution space" is any paper proposing *better* SAE evaluation metrics or *null-model protocols*.

### Objective-level competitors

Works proposing alternative *validity signals* for SAEs: causal/faithfulness-based evaluation, probing-based benchmarks, feature-abstractness or -complexity measures.

### Evaluation competitors

SAEBench, Neuronpedia dashboards, GemmaScope evaluations — this paper argues their **aggregate auto-interp** headline is insufficient without randomized baselines.

### Narrative competitors

The broader "SAE skepticism" cluster (AxBench, Kantamneni, Paulo & Belrose on feature non-identifiability). This paper occupies the "your metrics don't pass a null-model sanity check" slot.

### Potential collaborators / complementary methods

Any group building SAE benchmarks — the recommended "routine randomized baseline" could be added to SAEBench directly; abstractness measures complement probing/causal evals.

## Author and lab context

- **Laurence Aitchison** (University of Bristol) — senior author; ML/probabilistic-ML PI with a growing interpretability/SAE line (also senior author on Jacobian SAEs, Farnik et al. 2025, ICML; and Multi-Layer SAEs, Lawson et al., ICLR). This is a **coherent Bristol interpretability program**, not a one-off.
- **Tim Lawson** (Bristol) — recurring SAE author (Multi-Layer SAEs; Jacobian SAEs).
- **Lucy Farnik** (Bristol) — recurring SAE author (Jacobian SAEs), also listed among EleutherAI **delphi** contributors, i.e., embedded in the auto-interp tooling community.
- **Thomas Heap** (Bristol) — lead author.
- **Fact:** the group builds on and contributes to EleutherAI's open SAE ecosystem (sparsify, delphi). **Inference:** they are a **critique/methodology-focused** SAE group with tooling credibility, which strengthens the paper's authority on evaluation.

## Strategic value for our work

> [!important] This is a validity/critique result that directly raises the evaluation bar for any SAE claim we make.

- **New minimum bar for our SAE claims:** if we assert "our SAE recovers good/interpretable features" based on auto-interp AUROC, explained variance, or cosine similarity, a reviewer can now cite this paper and demand a **randomized-transformer null baseline**. We should build that control into our pipeline *pre-emptively* and report the trained-minus-random gap, not just the absolute number.
- **Borrow (protocol):** adopt the five-variant control design (esp. **norm-preserving re-randomization** and the **random-embedding Control**) as a standard sanity check; report **token-distribution entropy** (or a better abstractness measure) per latent and show it increases with depth for our trained model but not for the null.
- **Borrow (framing):** "our metric passes the null-model sanity check that Heap et al. 2026 shows aggregate auto-interp fails" is a strong, reviewer-friendly positioning move.
- **Avoid:** headlining a single aggregate auto-interp number as evidence of feature quality; relying on fuzzing/detection AUROC alone; claiming "interpretable features recovered" without a null comparison.
- **Baseline we now likely need:** an SAE trained on a **randomly initialized / step-0** version of our target model, evaluated identically — this becomes a mandatory control for a "better features" claim.
- **Claim this paper blocks:** "high auto-interp / reconstruction ⇒ we recovered learned, computationally relevant features." That inference is now explicitly contested; we must instead show **discrimination from a null** and, ideally, **causal/faithfulness** evidence.
- **Gap still open (opportunity):** a *validated* feature-abstractness / computational-relevance metric that (a) passes the null-model sanity check, (b) is cheap, and (c) correlates with downstream causal usefulness. The paper explicitly calls for "targeted measures of feature 'abstractness'" and "more robust metrics that quantify the computational significance of features" — a concrete, publishable niche, especially if paired with the causal evidence they lack.
- **Differentiation:** extend beyond Pythia/TopK/fuzzing (other families, JumpReLU/Gated/Matryoshka SAEs, probing/causal SAEBench tasks) and resolve the §4 mechanism (input superposition vs random-network amplification) — either would be a clean follow-up.

## Reproducibility assessment

- Code availability: **3** — *no paper-specific repository was identified in the text* (Inference); however the work is built entirely on public tooling: EleutherAI **sparsify** (training), EleutherAI **delphi** (auto-interp), and **SAEBench** (evaluation), all open-source, so re-implementation is very feasible. (Confirm whether an author repo exists on the OpenReview/camera-ready page.)
- Data availability: **5** — Pythia (incl. `step0` revisions), RedPajama-V2, GloVe all public.
- Hyperparameter detail: **4** — $R=64$, $k=32$, 100M/1B tokens, 10M buffer, 100 latents sampled, judge model named; optimizer/schedule less explicit.
- Compute transparency: **5** — explicit A100-80GB, ~435 GPU-hours table (Appendix K).
- Seed reporting: **2** — five seeds only for Pythia-70m (Appendix E); large-model curves single-run.
- Evaluation clarity: **4** — metrics well-defined; many results only in figures.
- Ease of reproduction: **4** — public models/data/tooling and modest compute for small models (large-model sweep is costly).

## Overall assessment

### Strengths

Timely, well-controlled negative result; imports a rigorous sanity-check methodology; broad scale coverage; a constructive proposal (randomized baselines + abstractness measures); honest scoping; credible tooling-native authorship.

### Weaknesses

Confined to Pythia + RedPajama + TopK + fuzzing/detection auto-interp (title generalizes further than the evidence); limited multi-seed/significance on large models; the mechanism (§4) and the abstractness proxy are preliminary.

### Confidence in assessment

**High** for the method and reported findings (full paper + appendices read). **Low** on reviewer dynamics (reviews not retrieved). **Medium** on exact magnitudes (results are in figures; no point values transcribed).

## Key quotations

- "SAEs trained on randomly initialized transformers produce auto-interpretability scores and reconstruction metrics that are similar to those from trained models." (Abstract)
- "High aggregate auto-interpretability scores are insufficient proof for the discovery of complex, learned computations: they may instead reflect simpler structure inherent in the data or model architecture that is preserved even by random weights." (§6 Conclusion)
- "We therefore recommend treating common SAE metrics as useful but insufficient proxies for mechanistic interpretability and argue for routine randomized baselines and targeted measures of feature 'abstractness.'" (Abstract)
- "Our work reaffirms the importance of benchmarking interpretability techniques against strong, appropriately constructed null models... Without such baselines, it is difficult to confidently attribute discovered features to the process of learning." (§6)

## Open questions

- Does the trained-vs-random overlap persist for non-Pythia families, JumpReLU/Gated/Matryoshka SAEs, attention/MLP sites, and probing/causal SAEBench tasks?
- Which mechanism dominates — preserved input superposition or random-network amplification (§4)?
- Can token-entropy be turned into a *validated* abstractness/computational-relevance metric that passes the null-model check and correlates with causal usefulness?
- At what scale (if any) does auto-interp cleanly separate trained from random, and why does the gap narrow with size?

## Follow-up papers to read

- Adebayo et al. 2020 — Sanity Checks for Saliency Maps (`arXiv:1810.03292`) — the null-model methodology.
- Paulo et al. 2024 — Automatically Interpreting Millions of Features (`arXiv:2410.13928`) — the fuzzing/detection auto-interp used here.
- Bills et al. 2023 — Language models can explain neurons in language models — original auto-interp/simulation scoring.
- Karvonen et al. 2024a — SAEBench (`arXiv:2503.09532`) — the benchmark this pressure-tests.
- Karvonen et al. 2024c — Board-game dictionary learning (`arXiv:2408.00113`) — contrasting random-vs-trained result.
- Bricken et al. 2023 — Towards Monosemanticity — one-layer random-vs-trained discrimination.
- Paulo & Belrose 2025 — SAEs trained on the same data learn different features (`arXiv:2501.16615`).
- Sharkey et al. 2022 — Taking features out of superposition with SAEs — toy-model basis for §4.
- Elhage et al. 2022 — Toy Models of Superposition (`arXiv:2209.10652`).
- Zhong & Andreas 2024 — Algorithmic Capabilities of Random Transformers (`arXiv:2410.04368`).

## Source log

- Official proceedings / OpenReview: https://openreview.net/forum?id=USyGD0eUod (Poster; reviews public but **not retrieved** this session — anti-bot ChallengeRequiredError)
- OpenReview PDF (accepted version, full text + appendices read): https://openreview.net/pdf?id=USyGD0eUod
- arXiv (HTML v2, full text read): https://arxiv.org/abs/2501.17727 (`arXiv:2501.17727`; earlier arXiv title: "Sparse Autoencoders Can Interpret Randomly Initialized Transformers")
- ML Anthology entry: https://mlanthology.org/iclr/2026/heap2026iclr-automated/
- Tooling referenced (public): EleutherAI/sparsify, EleutherAI/delphi, SAEBench
- Code (paper-specific repository): none identified in the text this session — verify on camera-ready/OpenReview page
