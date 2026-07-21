---
title: "Addressing divergent representations from causal interventions on neural networks"
year: 2026
conference: ICLR
status: accepted
presentation_type: oral
relevance: tier-1
primary_topics:
  - mechanistic interpretability
  - activation patching
  - distributed alignment search
  - causal intervention faithfulness
  - representational divergence
authors:
  - Satchel Grant
  - Simon Jerome Han
  - Alexa R. Tartaglini
  - Christopher Potts
institutions:
  - Stanford University
paper_url: "https://openreview.net/forum?id=cZrTMqYVL6"
openreview_url: "https://openreview.net/forum?id=cZrTMqYVL6"
arxiv_url: "https://arxiv.org/abs/2511.04638"
code_url: "https://github.com/grantsrb/rep_divergence"
review_visibility: public
reading_status: complete
last_updated: 2026-07-17
tags:
  - conference/iclr
  - year/2026
  - topic/mechanistic-interpretability
  - topic/activation-patching
  - topic/distributed-alignment-search
  - topic/faithfulness
  - status/accepted
  - presentation/oral
  - relevance/tier-1
---

# Addressing divergent representations from causal interventions on neural networks

## One-sentence summary

The paper argues (theoretically and empirically) that common causal-intervention techniques in mech interp — coordinate/neuron patching, mean-difference patching, SAE reconstruction, and DAS — routinely push internal representations **off the model's natural manifold**, distinguishes "harmless" divergence (in the behavioral null-space or within-decision-boundary covariance) from "pernicious" divergence (activating hidden pathways / dormant behavioral changes that corrupt mechanistic claims), and shows the Counterfactual Latent (CL) loss from Grant (2025) can reduce that divergence while preserving intervention accuracy (IIA), plus a modified subspace-targeted CL loss that improves OOD interchange-intervention transfer on synthetic tasks.

## Why this paper matters

This is a **foundational faithfulness/validity paper for the entire causal-intervention toolkit** that our program relies on (activation patching, DAS, and — critically — the "use an intervention as the final judge of whether a feature/SAE latent is real" workflow). It reframes a mostly-ignored assumption: that the counterfactual states produced by interventions are *realistic* for the target model. If interventions systematically create OOD activations, then a "successful" patch (high behavioral effect / high IIA) can be an artifact of an **off-manifold hidden pathway** rather than evidence about the model's *natural* mechanism. For SAE/mech-interp work specifically, it puts pressure on the common validation loop "we steer/patch with the SAE feature and behavior changes, therefore the feature is causal" by showing SAE reconstruction itself is a divergence source (Fig 2). It also offers a concrete, cheap mitigation (CL auxiliary loss) and a diagnostic vocabulary (harmless vs pernicious; behavioral null-space; hidden pathways; dormant behavioral changes) that reviewers may start expecting interventions to address.

## Research problem

Do targeted causal interventions produce representations that diverge from the target model's natural (in-distribution) representations, and if so, when does that divergence invalidate the mechanistic conclusions drawn from the intervention? And how can we constrain interventions to remain "innocuous"?

## Motivation

- **Scientific motivation:** Causal interventions occupy the central place in making functional claims about neural circuitry, yet they rest on an *untested* assumption that intervened (counterfactual) states are realistic for the model. The paper wants to interrogate that assumption directly.
- **Practical motivation:** Some published patching setups multiply feature values by up to ~15× (cited: Lindsey et al. 2025, "biology of an LLM"), which plausibly yields large divergence; if divergence changes behavior via non-natural routes, the resulting explanations are unreliable.
- **Gap in prior work:** Prior work only *implicitly* touched this (causal scrubbing / noising-denoising deliberately inject divergence; best-practice-patching notes misinterpretations; Makelov et al. 2023 "interpretability illusions" for DAS; counterfactual-explanation work on on-/off-manifold attacks). No prior work gives a unified theoretical + empirical treatment of representational divergence across intervention families *and* a mitigation that constrains divergence specifically along causal dimensions.
- **Claimed limitation of existing methods:** Existing manifold-constrained counterfactual methods constrain features directly to the dataset manifold; the authors instead want a *principled alignment* that generates counterfactuals constrained to be innocuous along causal dimensions.

## Core hypothesis

Two testable claims: (1) Common causal interventions produce representations that are statistically off the model's natural distribution (divergent). (2) Some divergence is behaviorally inert ("harmless" — null-space or sign-preserving covariance), but some divergence is "pernicious" — it activates units/pathways that are silent for all natural inputs, so the observed behavioral effect does not reflect the model's natural mechanism. Corollary/engineering claim: (3) Regularizing intervened states toward counterfactual-latent (CL) targets reduces divergence without lowering intervention accuracy, and targeting only causal subspaces can improve OOD intervention transfer.

## Objective

Two objects are optimized/measured:

1. **Diagnosis (measurement, not optimization):** quantify divergence between natural distribution `H` and intervened distribution `Ĥ` via Earth Mover's Distance (Sinkhorn, p=2, blur=0.05) plus a battery of manifold metrics (nearest cos/L2, min-cost pairing, Local PCA distance, Local Linear Reconstruction error, KDE log-density). Baseline = natural-vs-natural (ground-truth-pair) EMD.
2. **Mitigation (optimization):** the CL auxiliary loss regularizes the intervened vector `ĥ` toward a **counterfactual-latent target** `h_CL` (the average of natural vectors that already carry the post-intervention variable values).
   - CL loss (Grant 2025): `L_CL(ĥ, h_CL) = ½‖ĥ − h_CL‖² − ½ · (ĥ·h_CL)/(‖ĥ‖‖h_CL‖)` (mean of L2 + cosine distance).
   - Combined with the DAS behavioral loss: `L_total = ε·L_CL + L_DAS`, ε a tunable weight.
   - **Modified/standalone CL loss** (new here): apply CL *per causal subspace* using the DAS selection matrix `D_var`: `ĥ^var_i = A⁻¹(D_var_i A(ĥ))`, target `h_CL^var_i = stopgrad(A⁻¹(D_var_i A(h_CL)))`, and sum `L'_CL = Σ_i L_CL(ĥ^var_i, h_CL^var_i)`. This minimizes divergence **only along causal dimensions**, leaving the rest free.

Plain language: instead of judging an intervention only by whether it flips behavior (IIA), also pull the intervened activation toward where a *real* activation with those variable values would sit — and do that pull specifically on the causal directions.

## Core idea

Intuition: patching copies coordinates/subspaces between two on-manifold vectors, but the *combination* need not lie on the manifold (like taking the x of one boundary point of a disk and the y of another — you land outside the disk). So divergence is the default, not the exception. Whether that matters depends on the model's *functional landscape* at the intervention site: if the divergence lands in the behavioral null-space or only changes magnitudes within a decision region, behavior (and the causal claim) is safe; if it turns on a unit that never fires for natural inputs of that class (a "hidden pathway"), the behavioral effect is an off-manifold artifact.

Mechanism: (a) prove coordinate patching leaves the manifold for essentially all non-hyperrectangle manifolds; (b) empirically show EMD/manifold divergence for MDVP, SAEs, and DAS on Llama-3-8B; (c) construct minimal ReLU circuits where mean-difference patching flips a decision *only* by activating a silent unit, and where a "benign" patch becomes a class flip in a different context (dormant behavioral change); (d) fix via CL regularization to keep intervened states near natural counterfactual targets.

## Method

### Inputs

- Diagnosis: natural residual-stream activations `h ∈ R^d` from Llama-3-8B-Instruct plus their intervened counterparts `ĥ` for three intervention families.
- Mitigation: (i) Boundless DAS setup from Wu et al. 2024 (Alpaca/Llama, pyvene tutorial), intervention samples with counterfactual labels; (ii) synthetic MLP setting with hand-constructed representations `h ∈ R^{2+16}` (2 causal dims + 16 noise dims), 10 classes.

### Outputs

- Diagnosis: divergence measurements (EMD + manifold metrics) and 2-D PCA visualizations of natural vs intervened clouds.
- Mitigation: trained DAS alignment function `A` (linear, invertible) whose interventions have reduced EMD and (for the modified loss) better OOD IIA.

### Architecture

- Interventions studied: (1) **Mean-Difference Vector Patching** `ĥ = h + δ_MD`; (2) **SAE projection** `h' = D(E(h))` (SAELens pretrained SAE); (3) **DAS** with a learnable invertible linear alignment `A(h)=Wh` and interchange intervention `ĥ = A⁻¹((I−D_var)A(h^trg) + D_var A(h^src))`.
- Synthetic classifier: MLP (input 18 → BatchNorm → hidden 128, ReLU, dropout 0.5 → BatchNorm → 10 logits).
- Alignment matrix uses the symmetric invertible parameterization `X=(MMᵀ+λI)S` from Grant (2025).

### Training objective

- DAS behavioral loss `L_DAS = −(1/N)Σ log p_A(c | x, ĥ)` (cross-entropy on counterfactual label `c`).
- CL auxiliary loss (Eq. 7) added with weight ε; modified subspace CL loss (Eq. 9) usable standalone (behavioral weight = 0).

### Data construction

- Empirical divergence: MDVP on Llama-3-8B layer 10 (chosen as lowest-EMD layer; 100 contexts × 4 token positions); SAE on layer 25 (only SAELens pretrained layer available), 2000 natural vs reconstructed vectors; DAS with 1000 natural vs intervened vectors on the Wu et al. setup.
- Synthetic: Cartesian grid `{−1,1}×{0,1,2,3,4}` → 10 class centroids; Gaussian noise σ²=0.1², **covariance 0.2** between the two causal dims (this correlation is what creates "harmless-covariance" and OOD structure); +16 `N(0,1)` noise dims. OOD split into Dense vs Sparse class clusters; 2 classes held out.

### Inference procedure

Evaluate interventions by **Interchange Intervention Accuracy (IIA)** (model accuracy on counterfactual label after the patch) and by divergence (EMD, restricted "Row EMD" along causal dims). For OOD: train alignment on one partition, test IIA on the held-out partition.

### Computational requirements

Modest. One LLM (Llama-3-8B-Instruct) used only for forward passes/visualization at single layers; the CL experiments reuse the pyvene Boundless DAS tutorial; the core mitigation experiments are small synthetic MLPs (SGD/Adam, lr 0.01, ~300 epochs, 5 seeds). No large-scale training.

## Experimental design

### Models

- Meta-Llama-3-8B-Instruct (diagnosis + Boundless DAS mitigation).
- A synthetic 128-hidden MLP (mitigation / OOD study).

### Layers or activation sites

- MDVP: Llama-3 layer 10 (residual stream). SAE: layer 25 (SAELens availability). DAS: model/layer from Wu et al. 2024. Synthetic: the single simulated intermediate layer.

### Datasets

- Llama contexts for entity-binding style MDVP (replicating Feng et al. 2024); the Wu et al. 2024 Alpaca-DAS task (Boundless DAS pyvene tutorial); a fully synthetic 10-class dataset.

### Baselines

- **Divergence baseline:** natural-vs-natural EMD using ground-truth counterfactual pairs (`H` vs `H'`).
- **Mitigation baseline:** DAS trained with behavioral loss only (vs DAS+CL, and CL-only).

### Metrics

- EMD (Sinkhorn), Local PCA distance, Local Linear Reconstruction error, KDE (neg log-density), nearest-cosine/L2, min-cost cosine/L2 pairing; IIA; "Row EMD" (EMD restricted to causal dimensions).

### Controls

- Ground-truth-pair sampling for the baseline EMD (to avoid sampling bias). Convex-hull / local-PCA projection used to *test* whether a ReLU state change is an off-manifold artifact (projecting onto `conv(S_K)` removes the spurious activation).

### Ablations

- CL loss weight ε sweep (IIA vs EMD tradeoff) in Boundless DAS.
- DAS learning rate × number of extra noise dims sweeps (Appendix A.4.5), reporting IIA and Row EMD for trained and held-out partitions, DAS vs DAS+CL vs CL-only.
- OOD Dense vs Sparse partition transfer.

### Statistical testing

Synthetic results reported as mean ± std over seeds (e.g., DAS EMD 0.032±0.003 vs CL 0.007±0.001; IIA 0.997±0.001 vs 0.9988±0.0005), 5 seeds for the MLP/DAS synthetic runs. No formal hypothesis tests (t-tests) reported; the LLM-scale divergence panels are qualitative + single EMD numbers.

### Number of seeds

- Synthetic MLP/DAS: 5 seeds (mean IIA reported). LLM diagnosis panels: no seed/variance reporting (single-sample visualizations + EMD).

## Main results

- **Divergence is theoretically near-guaranteed.** Proposition (§3.1): for a circular class manifold, coordinate patching of boundary points `u=(r,0)`, `v=(0,r)` yields `‖ĥ−c_K‖ = r√2 > r`, i.e. off-manifold. Appendix A.2 generalizes: **axis-aligned hyperrectangles are the *only* convex manifold shape closed under coordinate patching** (Theorem A.2: patch-closed ⇔ `M = I₁×…×I_d`). So any non-rectangular convex representation manifold has source/target pairs whose patch is off-manifold.
- **Divergence is empirically common across methods.** For MDVP, SAE reconstruction, and DAS on Llama-3-8B, intervened distributions have higher EMD from the natural distribution than the natural-vs-natural baseline (Fig 2c), corroborated by the extra manifold metrics (Fig 4). The authors stress this does **not** by itself invalidate those methods — it only establishes divergence exists.
- **Harmless divergence characterized (§4.1).** Divergence bottlenecked into the behavioral null-space `N(f_{≥ℓ})`, or occurring in a "behaviorally binary" subspace (output depends only on the *sign* of the subspace), leaves behavior unchanged even though the intervened vector never co-occurred naturally. Under a superposition reading, only decision boundaries (not exact values) matter, so within-boundary covariance divergence is acceptable.
- **Pernicious divergence demonstrated (§4.2).** In a minimal 2-layer ReLU circuit, a mean-difference patch flips the decision to class A **only by activating a third hidden unit that is silent for all natural class-A inputs** — a "hidden pathway." Projecting the patched vector onto `conv(S_A)` removes the ReLU state change and the flip disappears, proving the effect was off-manifold, not a natural mechanism.
- **Dormant behavioral changes (§4.2.2).** Extending the circuit with a context vector `v`, the *same* patch that is benign when `v₄<0.75` produces a class-C flip when `0.75<v₄<1` — a value that could never trigger class C naturally (bias threshold = 1). "Behaviorally safe" interventions can therefore carry hidden context-dependent effects; detecting them exhaustively is infeasible.
- **CL loss reduces divergence without hurting IIA (§5.1).** Applying the CL auxiliary loss to Boundless DAS: for small ε, **IIA is maintained (and possibly improved) while EMD decreases** (Fig 3b), with qualitative tightening of the intervened cloud (Fig 3a).
- **Modified (subspace) CL loss improves OOD transfer (§5.2).** On the synthetic task, DAS-behavioral gives feature-dim EMD 0.032±0.003 (IIA 0.997±0.001); CL-only gives EMD 0.007±0.001 (IIA 0.9988±0.0005). Transferring the alignment across Dense↔Sparse partitions, **CL yields higher held-out IIA than the behavioral loss** (Fig 3f), i.e., lower divergence → better OOD interchange generalization.

## What the results genuinely demonstrate

- Coordinate/subspace patching is off-manifold for essentially all realistic (non-rectangular) representation geometries — a clean, general mathematical fact.
- Three widely-used intervention families measurably produce OOD activations on a real LLM.
- There exist concrete, fully-worked circuits where a behaviorally "successful" patch is driven entirely by an off-manifold hidden pathway, and where a benign patch flips behavior in another context — so behavioral success (IIA) is **not sufficient** evidence for a natural-mechanism claim.
- A counterfactual-latent regularizer can trade off almost no IIA for large divergence reductions, and (on synthetic data) reduced causal-dimension divergence improves OOD intervention transfer.

## What the results do not demonstrate

- **No demonstration of a pernicious case *inside a real LLM*.** The hidden-pathway and dormant-change results are hand-constructed minimal circuits (existence proofs), not measured frequencies in Llama-3 or any production model.
- **No principled classifier of harmful vs harmless divergence** — the authors explicitly state this is missing. The CL mitigation minimizes *all* causal-dim divergence, not specifically the pernicious part.
- **Mitigation efficacy at scale is untested.** OOD improvement is shown only on a small synthetic MLP with 2 causal + 16 noise dims; the LLM CL result shows divergence↓ / IIA-preserved but not downstream faithfulness gains.
- **No evidence about how often divergence actually changes real interpretability conclusions** — Fig 2 explicitly does not claim the studied methods are invalid.
- Layer selection is opportunistic (lowest-EMD layer for MDVP; the only available SAELens layer for SAE), so the LLM divergence numbers are not a systematic layer sweep.

## Strongest evidence

The **coordinate-patching / hyperrectangle theorem (Prop §3.1 + Theorem A.2)** combined with the **minimal ReLU hidden-pathway construction (§4.2.1)** where projecting onto `conv(S_A)` provably removes the decision flip. Together they move the central claim from "divergence exists" to "divergence can be the sole cause of a confirmatory behavioral result," and the convex-hull projection is a decisive within-paper control.

## Weakest evidence

The **empirical LLM divergence section (§3.2)** as support for *practical harm*: it establishes divergence via EMD on cherry-picked/available single layers with no seeds/variance and explicitly disclaims invalidating the methods, so it demonstrates presence but not consequence. The **OOD CL improvement** is real but confined to a low-dimensional synthetic task engineered with the exact covariance structure the method exploits.

## Important ablations

- **CL weight ε sweep (Fig 3b):** small ε reduces EMD while holding/improving IIA; large ε presumably trades IIA — identifies a usable operating regime.
- **CL-only vs DAS-behavioral (§5.2):** removing the behavioral loss entirely and using only per-subspace CL still reaches ≥ comparable IIA with ~4–5× lower feature-dim EMD → the *causal-dimension* constraint, not behavioral supervision, is what tightens the manifold.
- **lr × extra-noise-dim sweeps (Appendix A.4.5, Figs 6–9):** CL's OOD IIA and Row-EMD advantages persist across noise dimensionality and learning rates.
- **Layer choice for MDVP:** EMD-minimizing layer did *not* correlate with subjective visual divergence — an implicit caution that scalar divergence metrics are imperfect proxies.

## Failure cases

- The modified CL loss is "confined to a narrow set of simplistic settings and is not specific to pernicious divergence" (authors' words) — it can over-regularize harmless divergence one might actually *want* to keep.
- Detecting dormant behavioral changes requires evaluating across all contexts, which is infeasible; the paper offers no scalable detector.
- Divergence metrics can disagree with qualitative divergence (MDVP layer note), so a "low-EMD" intervention is not guaranteed benign.

## Limitations stated by the authors

- No principled, reliable method to *classify* harmful divergence.
- The modified CL loss works only in narrow/simplistic settings and is not targeted specifically at pernicious divergence.
- "Any divergence outside the null-space is potentially pernicious," which challenges hopes for complete mechanistic understanding using current methods alone (tempered by the point that large intervention eval datasets + methods like CL can reduce the problem).

## Additional limitations not emphasized by the authors

- Pernicious examples are synthetic minimal circuits; no measured prevalence in real models.
- LLM divergence uses single, availability-driven layers, no seeds/variance, and one model family.
- The synthetic OOD benchmark's covariance structure is hand-designed and small (2 causal dims), which may flatter a method built to constrain causal-dimension covariance.
- The CL target `h_CL` requires the ability to construct/label counterfactual-consistent natural vectors (via a CA), which is exactly what is hard to obtain in open-ended real-model interpretability.
- Focus is on DAS-style interchange interventions; the popular "steer by scaling an SAE feature" workflow is only touched via the SAE-reconstruction divergence panel, not a full steering-faithfulness study.

## Reviewer feedback

> [!note] Review availability
> Reviews for `cZrTMqYVL6` are **public on OpenReview** (ICLR 2026 reviews/meta-reviews are open), but the OpenReview API and PDF/notes endpoints returned an anti-bot **ChallengeRequiredError** in this session, so the individual review texts, scores, rebuttal, and meta-review were **not retrieved**. Per CLAUDE.md §24, this section is intentionally left unfilled rather than fabricated. **Action for a later pass:** fetch reviews via an authenticated browser session and complete: main positive points, main concerns, reviewer questions, author rebuttal, resolved vs unresolved concerns. The Oral decision is confirmed independently via the ICLR 2026 virtual site (see Source log).

### Main positive points

Not retrieved this session.

### Main concerns

Not retrieved this session.

### Questions raised by reviewers

Not retrieved this session.

### Author rebuttal

Not retrieved this session.

### Which concerns were resolved

Not retrieved this session.

### Which concerns remained unresolved

Not retrieved this session.

## Why it was accepted

> [!note] Interpretation
> Evidence-based inference from the paper itself and its **Oral** status (top ~1–2% of submissions), not an official reason. Reviews were not read this session.

Plausible factors: (1) it targets a **foundational, under-examined assumption** underlying the whole causal-intervention program (patching, DAS, SAE-as-judged-by-intervention), which is high-leverage and broadly relevant; (2) it combines **clean theory** (a crisp closed-form manifold theorem) with **minimal, fully-worked counterexamples** and a real-LLM empirical demonstration — the "theory + intuition-pump + practical fix" arc reviewers tend to reward; (3) it provides a **constructive mitigation** (CL loss) rather than only a critique, with an OOD-transfer payoff; (4) it introduces **durable vocabulary** (harmless vs pernicious divergence, behavioral null-space, hidden pathways, dormant behavioral changes) that is likely to be cited; (5) authorship/lineage in a recognized causal-abstraction/DAS research program (Stanford; Potts; building on Geiger, Wu, Grant 2025) situates it credibly. Oral selection likely rewards the crisp, community-relevant "are our interventions even faithful?" message.

## Why it may have been rejected

Not applicable (accepted, Oral).

## Novelty analysis

### What is genuinely new

- A **unified theoretical + empirical treatment of representational divergence** across intervention families, including the closed-form result that only axis-aligned hyperrectangles are patch-closed.
- The **harmless vs pernicious** taxonomy grounded in behavioral null-space and behaviorally-binary subspaces, plus explicit **hidden-pathway** and **dormant-behavioral-change** constructions with a convex-hull projection test.
- The **modified, subspace-targeted CL loss** (`L'_CL`, Eq. 9) that constrains divergence *only along causal dimensions* and improves OOD interchange transfer.

### What is adapted from prior work

- The base **CL auxiliary loss** and symmetric-invertible alignment parameterization are from Grant (2025) (`grant2025mas`, `grant2025das`); the DAS/Boundless-DAS machinery from Geiger et al. and Wu et al. 2024 (via pyvene); MDVP from Feng et al. 2024; SAE reconstruction via SAELens (Bloom 2024); EMD via Sinkhorn/GeomLoss.
- Conceptual antecedents: interpretability illusions in DAS (Makelov et al. 2023), best-practice-patching cautions (Zhang et al. 2024), on-/off-manifold counterfactuals (Stutz & Schiele 2019; Verma et al.).

### What is mostly engineering or scaling

- Wiring the CL loss into the pyvene Boundless DAS tutorial and constructing the synthetic OOD benchmark are light engineering; there is **no scaling contribution**.

### Closest prior papers

- Grant (2025) — Counterfactual Latent loss / MAS (direct parent of the mitigation).
- Makelov et al. 2023 — DAS interpretability illusions (null-space × dormant subspace interactions).
- Wu et al. 2024 — Boundless DAS (the LLM setting mitigated here).
- Zhang et al. 2024 — best-practice activation patching.
- Sutter et al. 2025 — nonlinear-representation dilemma (what nonlinear alignments really tell us).

## Competitor analysis

### Direct competitors

Papers auditing the **faithfulness/validity of causal interventions**: interpretability-illusions work (Makelov et al. 2023), circuit-hypothesis-testing / faithfulness-completeness-minimality criteria (Shi et al. 2024; Wang et al. 2022), best-practice-patching (Zhang et al. 2024). These share the "when do interventions mislead?" claim space.

### Architectural / objective competitors

Manifold-constrained counterfactual-explanation methods (Verma et al. 2024; Tsiourvas et al. 2024) constrain features to the data manifold — an alternative route to the same "keep interventions realistic" goal, differing from CL by not being a principled *causal-subspace* alignment.

### Evaluation competitors

Alternative faithfulness diagnostics: causal scrubbing, noising/denoising sufficiency-completeness tests, EMD/manifold-distance batteries. This paper effectively proposes divergence (EMD / Row-EMD) as an additional reporting metric for any intervention study.

### Complementary methods

CL is additive to DAS and, in principle, to any intervention that yields a target counterfactual state; the divergence metrics complement SAE-quality metrics and steering benchmarks. The "report divergence outside the null-space + test context-sensitivity" recommendation could bolt onto any patching pipeline.

## Author and lab context

- **Satchel Grant** (Stanford, Dept. of Psychology; PDP Lab) — lead author; author of the CL loss / DAS-alignment lineage (Grant 2025). Trajectory centers on causal-abstraction alignment and reliable interventions; this is part of a coherent program, not a one-off.
- **Simon Jerome Han** (Stanford) — co-author.
- **Alexa R. Tartaglini** (Stanford, Depts. of CS/Linguistics) — co-author; representation/interpretability work.
- **Christopher Potts** (Stanford, Linguistics/CS) — senior author; long-running program on causal abstraction, DAS, and interpretability (with Geiger, Wu, et al.). Central, well-established interpretability group.
- Acknowledgments thank the **PDP Lab**, the Stanford Psychology department, and Noah Goodman & Jay McClelland — situating the work in Stanford's PDP / mech-interp community. **Inference:** this is a central, coordinated research program on causal-abstraction interpretability, closely tied to the DAS/pyvene ecosystem.

## Strategic value for our work

- **Borrow:** (1) **Report representational divergence** (EMD + at least one manifold metric like Local PCA distance or KDE) alongside any patching/steering/SAE-causality result — this is likely to become an expected robustness check; (2) the **convex-hull / local-PCA projection test** to check whether a claimed causal effect survives when the intervened state is pushed back on-manifold (cheap, decisive control); (3) the **harmless-vs-pernicious framing** to scope our causal claims precisely (null-space vs mechanism); (4) the CL auxiliary loss as an optional regularizer when we have counterfactual-consistent targets.
- **Avoid:** treating "steering/patching an SAE feature changed behavior" as sufficient proof the feature is a *natural* mechanism — this paper gives reviewers a ready objection (off-manifold hidden pathway). Also avoid extreme activation scaling (the ~15× multiplier example) without a divergence report.
- **Baseline / control we likely need:** an **on-manifold (convex-hull-projected) intervention** control, plus a **divergence-vs-effect** curve, for any causal-feature claim in our SAE work.
- **Evaluation protocol to replicate:** EMD (Sinkhorn, p=2) natural-vs-intervened with a ground-truth-pair baseline; Row-EMD restricted to the causal subspace; IIA-vs-divergence tradeoff sweeps.
- **Claim this blocks:** "our intervention succeeded, therefore we identified the model's natural mechanism" — now needs an off-manifold/dormant-change rebuttal. Also "we are first to constrain interventions along causal dimensions" is taken by the modified CL loss.
- **Gap still open (our opportunity):** (1) a **principled classifier of pernicious vs harmless divergence** (authors flag this as missing); (2) demonstrating/measuring **pernicious divergence *in real LLMs*** (not just synthetic circuits), e.g. auditing SAE-steering results for hidden-pathway activation; (3) **scalable dormant-behavior / context-sensitivity tests**; (4) self-supervised divergence mitigation that does not require CA-labeled counterfactual targets.
- **Differentiation:** we can position an SAE/mech-interp method as "faithful-by-construction" if we add on-manifold constraints and report divergence — turning this paper's critique into a selling point for our approach.

## Reproducibility assessment

- Code availability: **5** (public repo `github.com/grantsrb/rep_divergence` stated in the paper).
- Data availability: **4** (synthetic dataset fully specified; LLM interventions rely on public pyvene/SAELens tutorials and Llama-3-8B; exact intervention datasets less centralized).
- Hyperparameter detail: **4** (synthetic MLP/DAS lr, epochs, covariance, noise dims, alignment parameterization, λ all given; LLM-side ε only swept, some choices in appendix).
- Compute transparency: **3** (small-scale implied, but no explicit hardware/budget).
- Seed reporting: **4** (5 seeds + mean±std on synthetic results; none on LLM divergence panels).
- Evaluation clarity: **4** (metrics precisely defined in Appendix A.1; some results only in figures).
- Ease of reproduction: **4** (synthetic experiments and pyvene tutorial base make the core claims very tractable).

## Overall assessment

### Strengths

Tackles a foundational, high-leverage assumption; clean general theorem; decisive minimal counterexamples with a within-paper on-manifold control; a constructive, cheap mitigation with an OOD-transfer payoff; durable conceptual vocabulary; public code; strong lineage in the DAS/causal-abstraction community.

### Weaknesses

Pernicious cases are synthetic existence proofs, not measured in real models; LLM divergence is single-layer, single-model, no seeds; the mitigation is validated mainly on a small hand-designed synthetic task; no principled harmful-vs-harmless classifier; requires CA-labeled counterfactual targets that are hard to get in open-ended interpretability.

### Confidence in assessment

**High** for the method, theory, and reported results (full arXiv v3 read end-to-end, including appendices). **Low** on reviewer dynamics and the official acceptance rationale (reviews not retrieved this session).

## Key quotations

- "we ask whether such interventions create out-of-distribution (divergent) representations, and whether this raises concerns about how faithful their resulting explanations are to the target model in its natural state." (Abstract)
- "the patched point ĥ is off-manifold whenever u₁² + v₂² > r_K² … ‖ĥ − c_K‖₂ = r_K√2 > r_K." (§3.1, Proposition)
- "This new activation is a hidden pathway that was silent under all native samples. Thus the mean-difference patch crosses the decision boundary only by activating an off-manifold circuit." (§4.2.1)
- "the same intervention that was benign in one context … produces a behavioral flip in another … purely due to the latent divergence priming a new pathway." (§4.2.2)
- "any divergence outside of the null-space of NN layers is potentially pernicious. This poses challenges for aspirations of a complete mechanistic understanding of NNs using existing methods alone." (§6)

## Open questions

- How often does pernicious (hidden-pathway / dormant) divergence actually occur inside frontier LLMs, and can we detect it at scale?
- Can we build a principled classifier that separates harmless (null-space / sign-preserving) from pernicious divergence without exhaustive context enumeration?
- Does the CL / on-manifold constraint improve *downstream interpretability faithfulness* (not just IIA/EMD) on real models?
- Can divergence be minimized self-supervised, without CA-labeled counterfactual-latent targets?
- How does divergence interact with SAE feature-steering at high scaling factors specifically?

## Follow-up papers to read

- Grant 2025 — Counterfactual Latent loss / MAS and symmetric DAS alignment (direct parent; `grant2025mas`, `grant2025das`).
- Wu et al. 2024 — Boundless DAS / Alpaca (`wu2024alpacadas`) and pyvene (`wu2024pyvene`).
- Makelov et al. 2023 — Interpretability illusions for DAS.
- Geiger et al. 2021/2023/2024 — DAS and causal abstraction theoretical foundations.
- Zhang et al. 2024 — Best practices for activation patching.
- Sutter et al. 2025 — The nonlinear representation dilemma.
- Feng et al. 2024 — Language models bind entities (MDVP source).
- Lindsey et al. 2025 — "Biology of an LLM" (the ~15× feature-scaling example).

## Source log

- Official / OpenReview: https://openreview.net/forum?id=cZrTMqYVL6 (Oral; reviews public but **not retrieved** this session — ChallengeRequiredError / anti-bot)
- ICLR 2026 virtual (Oral confirmation, Poster Session 6): https://iclr.cc/virtual/2026/oral/10008488
- arXiv abstract: https://arxiv.org/abs/2511.04638
- arXiv full text read (HTML v3, full paper + appendices): https://arxiv.org/html/2511.04638v3
- Code: https://github.com/grantsrb/rep_divergence (stated in the paper's footnote 1)
