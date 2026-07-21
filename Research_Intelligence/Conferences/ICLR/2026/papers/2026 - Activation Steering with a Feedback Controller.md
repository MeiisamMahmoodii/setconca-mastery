---
title: "Activation Steering with a Feedback Controller"
year: 2026
conference: ICLR
status: accepted
presentation_type: poster
relevance: tier-1
primary_topics:
  - activation steering
  - representation steering
  - mechanistic interpretability
  - control theory / feedback control
authors:
  - Dung Viet Nguyen
  - Yen Nhi Pham
  - Hieu M. Vu
  - Lei Zhang
  - Tan Minh Nguyen
institutions:
  - National University of Singapore
paper_url: "https://openreview.net/forum?id=vzkEX2SwFD"
openreview_url: "https://openreview.net/forum?id=vzkEX2SwFD"
arxiv_url: "https://arxiv.org/abs/2510.04309"
code_url: "https://github.com/dungnvnus/pid-steering"
project_url: ""
review_visibility: public
reading_status: partial
last_updated: 2026-07-17
tags:
  - conference/iclr
  - year/2026
  - topic/activation-steering
  - topic/representation-steering
  - topic/mechanistic-interpretability
  - topic/control-theory
  - status/accepted
  - presentation/poster
  - relevance/tier-1
---

# Activation Steering with a Feedback Controller

> [!warning] Reading status: partial — primary PDF not fully read this session
> The arXiv **HTML** rendering (`arxiv.org/html/2510.04309`, all versions) returned **404** and the PDF is binary (not fetchable by the tooling used). Primary text confirmed this session: the **arXiv abstract page** (`abs/2510.04309`, v3, last revised 2026-05-16), the **OpenReview forum header** (title, authors, keywords, TL;DR, abstract), the **official GitHub README** (method equation, baseline-equivalence claims), and the **ICLR virtual page**. Method/equations/results detail below is corroborated by a **third-party paper note** (`en.papernotes.org`) that summarizes the full paper. **All numerical results are transcribed from that secondary source and are NOT verified against the primary PDF/tables** — they are flagged inline as `[secondary]`. Treat exact numbers as provisional until the PDF is read. (Per CLAUDE.md §23–§24.)

## One-sentence summary

PID Steering reframes LLM activation steering as a discrete-time closed-loop control problem over the layer stack, proves that popular difference-in-means steering methods (ActAdd, DirAblate, Mean-AcT) are exactly proportional (P) controllers that leave a nonzero steady-state error, and adds integral (accumulate cross-layer error to cancel that bias) and derivative (damp overshoot) terms to get a training-free, plug-in steering-vector computation that reportedly improves detoxification, jailbreak success, and diffusion style control.

## Why this paper matters

It is a **direct competitor and reframing** for essentially all work on steering-vector / representation-control methods. Rather than proposing yet another way to *compute* a steering direction, it supplies a **control-theoretic scaffold** that (1) unifies the existing difference-in-means family under a single equation, (2) diagnoses a specific, named failure mode (steady-state error from pure P control), and (3) prescribes the classical fix (I and D terms) with stated stability guarantees (ISS, bias cancellation, bounded overshoot). For our program this matters because: it stakes a claim on "control theory for activation steering", it introduces an **evaluation lens** (layer-wise error-signal dynamics: does the error cross zero, plateau, or overshoot?) that reviewers of steering papers may now expect, and it turns "add a fixed vector" into "close the loop over layers", which is a conceptual competitor to any fixed-vector or single-layer intervention we might propose.

## Research problem

Existing activation-steering methods are empirically motivated and lack performance guarantees; in particular they exhibit a **residual bias**: driving the steered branch toward a target concept, the layer-wise error does not converge to zero but plateaus at a nonzero value. How can steering-vector computation be made principled and eliminate this residual error without inducing instability/overshoot?

## Motivation

- **Scientific:** The LLM forward pass \(x(k{+}1)=f^{(k)}(x(k))\) is a discrete-time dynamical system with the layer index as "time"; steering is a control input injected each layer. Prior "algebraic" views treat activation space as static geometry and ignore this dynamical structure. **(Fact — abstract + secondary source.)**
- **Practical:** Steering is a cheap, training-free alternative to SFT/RLHF for behavior control (detox, refusal, style). Reliability and lack of guarantees limit deployment for safety alignment.
- **Gap in prior work:** ActAdd, DirAblate, Mean-AcT and difference-in-means variants correct only using the *current-layer* error → structurally equivalent to a P controller → structurally admit steady-state error under persistent disturbance; no amount of gain tuning removes it (higher gain → oscillation). **(Fact as stated by authors; the equivalence is a claimed theoretical result.)**

## Core hypothesis

Because existing steering ≈ P control, and P control provably leaves a disturbance-proportional steady-state error, **augmenting the controller with integral and derivative action will cancel the residual bias and suppress overshoot**, yielding more robust behavioral control across layers with no extra training.

## Objective

Make the layer-wise activation **error signal** \(\bar e(k)\) — the difference-in-means between a target (e.g. harmless) and source (e.g. harmful) branch at layer \(k\) — converge to zero along the forward pass. The steering vector is the control input \(u(k)\) chosen to drive \(\bar e(k)\to 0\) while remaining stable (ISS) and low-overshoot.

## Core idea

Intuition: existing steering is a thermostat that only reacts to the *current* temperature gap (P), so it never fully closes the gap under a constant draft (disturbance). Add "memory" of the accumulated gap (I) to erase the persistent offset, and "anticipation" of how fast the gap is changing (D) to avoid overshooting.

Mechanism: keep the entire existing steering pipeline (contrastive data → difference-in-means error → inject via a steering function \(\rho_\text{steer}\)); only **replace the step that turns the error into the steering vector** with a full PID law, evaluated layer-by-layer. Combining PID with the Mean-AcT paradigm gives the primary configuration **PID-AcT**. **(Fact — GitHub + secondary source.)**

## Method

### Inputs
Residual-stream activations at each layer from two contrastive prompt sets (target vs. source), used to form the layer-wise difference-in-means error \(r(k)=\bar e(k)\). No weight updates, no training.

### Outputs
A per-layer steering vector \(u(k)\) injected into activations via \(\rho_\text{steer}\); ultimately a steered generation (detoxified / jailbroken / style-controlled).

### Architecture
No new network. The controller is the PID law over the layer index \(k\):
\[u(k)=K_p\,r(k)+K_i\sum_{j=0}^{k-1} r(j)+K_d\big(r(k)-r(k-1)\big)\]
with gains \(K_p,K_i,K_d\ge 0\). Here **integration = accumulation across layers** and **differentiation = adjacent-layer difference**. Existing methods are recovered by setting \(u(k)=K_p r(k)\) (P only). Different choices of \(\rho_\text{steer}\) / error computation recover ActAdd (\(x+\alpha u\), non-sequential), DirAblate (projection onto the orthogonal complement of \(r\)), and Mean-AcT (\(x+\alpha u\), sequential). **(Fact — equation from GitHub README; recovery claims from secondary source.)**

### Training objective
None (inference-time intervention only). "Optimization" is the closed-loop error dynamics, not gradient training.

### Data construction
Contrastive dataset pairs supply the error signal, e.g. ADVBENCH (harmful) vs. ALPACA (harmless) for jailbreak; toxic vs. non-toxic prompts for detox. **(Fact — secondary source.)**

### Inference procedure
Two variants for computing \(r(k)\): **non-sequential** (difference-in-means on the original, unsteered activations — ignores that steering layer \(k\) changes layer \(k{+}1\)) and **sequential** (inherited from Mean-AcT: inject \(u(k{-}1)\), forward-pass to get intervened \(\tilde x(k)\), then recompute difference-in-means). The primary PID-AcT uses the **sequential** variant, aligning with true closed-loop control. **(Fact — secondary source.)**

### Computational requirements
Lightweight: a few extra vector accumulations/differences per layer over the base steering method; no training/finetuning. Extra cost vs. a base method is negligible except for hyperparameter search over \(K_p,K_i,K_d\).

## Experimental design

> [!note] All numbers below are `[secondary]` (from `en.papernotes.org`), not verified against the primary PDF.

### Models
Text: Qwen2.5, Gemma2, Llama3 families, ~3B–14B. Image/diffusion: SDXL-Lightning, Flux. **(Fact — secondary source; abstract says "multiple LLM families".)**

### Layers or activation sites
Residual-stream activations across layers; the controller runs over the full layer stack (the control "time axis" is the layer index).

### Datasets / tasks
Detoxification (RealToxicityPrompts), jailbreaking (ADVBENCH source / ALPACA target; ASR on harmful requests), image style control (diffusion). Capability monitoring via PPL-Wiki, MMLU, tinyBenchmarks (tinyMMLU, tinyHellaSwag).

### Baselines
Within the difference-in-means/steering family: **ActAdd, DirAblate, Mean-AcT (Seq.), Linear-AcT, DIM, Angular Steering**; editing/probing baselines: **CAA, ITI / ITI-C, AURA, RePE**. PID is applied as a drop-in on top of these paradigms (P → PID). **(Fact — secondary source + abstract "integrates with SOTA steering methods".)**

### Metrics
Toxicity classifiers (CLS Toxic %, 0-shot Toxic %, QVQ %) ↓, PPL-Wiki ↓, MMLU ↑ (detox); ASR ↑ with tinyMMLU/tinyHellaSwag capability checks (jailbreak); qualitative/behavioral for diffusion style. Key **diagnostic**: layer-wise error signal \(\langle\bar e(0),\bar e(k)\rangle\) (does it plateau / cross zero / overshoot).

### Controls
General-capability metrics (PPL, MMLU, tinyBenchmarks) act as controls that steering does not destroy the model.

### Ablations
P → PI → PID progression (I removes steady-state error; D removes overshoot); sequential vs. non-sequential error signal. **(Fact — secondary source.)**

### Statistical testing
Not reported in available sources (no significance tests surfaced). **Unknown.**

### Number of seeds
**Unknown** — not surfaced in the accessible sources.

## Main results

> [!warning] Numbers are `[secondary]` transcriptions and NOT verified against the primary PDF.

- **Detoxification.** PID-AcT reportedly gives the strongest toxicity reduction while holding PPL/MMLU roughly stable. `[secondary]` e.g. Gemma2-2B CLS-Toxic 4.17% (orig) → 0.68% (Mean-AcT) → **0.51% (PID-AcT)**; Llama3-8B 5.80% → 1.21% → **0.72%**. Authors reportedly summarize this as ≈1/8.2 (Gemma2) and ≈1/8.1 (Llama3) of the original toxicity, ranking first in the sequential family and beating ActAdd, AURA, ITI-C, CAA.
- **Jailbreaking (ASR ↑).** Within Angular Steering, replacing the DIM direction with PID reportedly yields the top ASR with near-flat capability metrics. `[secondary]` Qwen2.5: DIM 74.03 / ITI 70.19 / RePE 68.44 / **PID 76.07**, tinyMMLU slightly higher than DIM.
- **Error dynamics (the mechanistic evidence).** In the error-signal figure: **P plateaus at nonzero** (steady-state error), **PI crosses zero but overshoots**, **PID crosses zero with much smaller overshoot** — matching the theory (Prop. 1, Prop. 3, Thm. 2).
- **Generality.** Demonstrated on diffusion models (image style control), argued as evidence the feedback-control view transfers beyond text.
- **Theory.** Claimed results: P steering is ISS but has disturbance-proportional steady-state error (Prop. 1); PI cancels the *matchable* disturbance component \(w_\parallel\) in the Jacobian range, leaving orthogonal \(w_\perp\) (Prop. 3); PID stays ISS, keeps bias cancellation, and its first overshoot peak \(A_0^{\text{PID}}\le A_0^{\text{PI}}\) (Thm. 1–2). **(Fact that theorems are claimed; correctness not independently checked.)**

## What the results genuinely demonstrate

- A clean, testable **equivalence**: fixed-vector / difference-in-means steering is P control, so its residual bias is a *structural* property, not just poor tuning — a genuinely useful conceptual result if the equivalence holds as stated.
- Adding I/D terms **measurably changes the layer-wise error trajectory** in the predicted direction (plateau → zero-crossing; large overshoot → small overshoot), which is the paper's most direct empirical support because it is a scalar signal tied to the theory, not just a downstream score.
- On the reported benchmarks, PID-AcT/PID is at least competitive with and often better than strong steering/editing baselines while preserving general capability metrics `[secondary]`.

## What the results do not demonstrate

- **Not verified here numerically.** No primary table was read this session; treat all magnitudes as provisional.
- **No causal/mechanistic faithfulness test** that the driven "error to zero" corresponds to the model's *internal* mechanism for the behavior; success is behavioral (toxicity %, ASR), not necessity/sufficiency of a circuit.
- **Local-linearity dependence.** The stability/overshoot theory leans on a mean local Jacobian \(\bar A(k)\) and Euler discretization; strong nonlinearity / discretization error is not deeply probed (author-acknowledged limitation).
- **Hyperparameter burden.** Three gains vs. one \(\alpha\); whether the wins survive fair, matched per-method tuning and how sensitive they are is not established in accessible sources.
- **Orthogonal disturbance \(w_\perp\) is uncompensated** by design — PID does not claim to remove all bias.

## Strongest evidence

The **layer-wise error-signal curve** (P plateaus, PI overshoots, PID converges cleanly) is the most convincing single result: it is a direct, low-degrees-of-freedom observable that matches three separate theoretical predictions, tying the control-theory story to something measurable inside the network rather than only to downstream scores.

## Weakest evidence

The **downstream-benchmark superiority** as evidence of the method's value: gains over already-strong baselines can be small `[secondary]`, PID adds tuning freedom (\(K_p,K_i,K_d\)) that can flatter it, and the diffusion "generality" section is reportedly brief. Without verified tables, matched tuning, seeds, and significance, "consistently outperforms" is not yet independently supported here.

## Important ablations

- **P → PI:** eliminates the steady-state plateau (the I term does what theory predicts). **(Fact — secondary.)**
- **PI → PID:** removes the overshoot introduced by pure integral action while keeping bias cancellation → both I and D are argued indispensable.
- **Sequential vs. non-sequential error:** sequential (recompute error on already-steered activations) respects layer causality and is used for the primary PID-AcT.

## Failure cases

- The **orthogonal disturbance component \(w_\perp\)** cannot be canceled by the integral term (structural limit).
- Any MMLU drop under PID-AcT is attributed to the underlying AcT framework rather than PID itself `[secondary]` — i.e., the base paradigm still bounds capability preservation.

## Limitations stated by the authors

- Integral action only cancels the *matchable* disturbance \(w_\parallel\); orthogonal \(w_\perp\) remains.
- More hyperparameters (\(K_p,K_i,K_d\)) than single-gain methods; tuning cost/sensitivity needs systematic study.
- Dual-use: demonstrating higher jailbreak ASR shows how to bypass safety mechanisms.
- Theory relies on local linearization (mean Jacobian) and Euler discretization; nonlinearity/discretization error not deeply analyzed.

## Additional limitations not emphasized by the authors

- No seed/variance or significance reporting surfaced ⇒ "consistently outperforms" is not yet quantified with uncertainty (in accessible sources).
- Fairness of comparison: PID's extra tunable gains vs. baselines' single \(\alpha\); matched-budget tuning not shown here.
- Model scale caps at ~14B; no frontier-scale check.
- "Steering error → 0" is defined via difference-in-means proxies; whether zero error in that metric equals the intended *behavioral* target is assumed, not causally validated.

## Reviewer feedback

> [!warning] Reviews public but not retrieved (do not fabricate)
> OpenReview `vzkEX2SwFD` reviews are public for ICLR 2026, but automated access was **blocked (ChallengeRequiredError / anti-bot challenge)** this session, so review texts, scores, and the meta-review were **not retrieved**. This section is intentionally left unfilled rather than invented. **Action:** fetch via an authenticated/browser session and fill: main positive points, concerns, questions, rebuttal, resolved/unresolved. (Per CLAUDE.md §24.)

## Why it was accepted

> [!note] Interpretation
> Evidence-based inference from the paper and its Poster status, not an official reason. Reviews not read.

Plausible factors: (1) a **clean "unify then upgrade" narrative** — proving a whole family of popular methods are P controllers is memorable and explanatory; (2) it imports a **century-old, well-understood toolkit** (PID + ISS/overshoot theory) into a hot topic (steering/safety) with stated guarantees, which is unusual for a literature the authors correctly note is "empirically driven"; (3) **training-free, plug-and-play** on top of SOTA methods lowers adoption cost; (4) breadth across model families, tasks, and even diffusion; (5) the error-dynamics figure gives a crisp theory-matches-observation moment; (6) code released.

## Why it may have been rejected

Not applicable (accepted, Poster).

## Novelty analysis

### What is genuinely new
The **explicit equivalence "difference-in-means steering = P controller"** with an ISS + steady-state-error characterization, and the **PID-over-layers** steering law (integration = cross-layer accumulation, differentiation = adjacent-layer difference) with accompanying stability/overshoot theorems.

### What is adapted from prior work
The PID controller and ISS/steady-state/overshoot analysis are classical control theory. The steering substrate (difference-in-means directions, ActAdd, DirAblate, Mean-AcT/Linear-AcT, Angular Steering) and the contrastive-data error signal are from prior steering work. Discretization via Euler is standard.

### What is mostly engineering or scaling
The implementation is a light modification of existing steering code (swap the vector-computation step); no scaling contribution.

### Closest prior papers
Mean-AcT / Linear-AcT (the sequential steering paradigm PID-AcT builds on); ActAdd; DirAblate; CAA (contrastive activation addition); ITI / RePE (representation engineering); prior control-theoretic views of LLM generation at the token level (Luo 2023; Soatto 2023; Kong 2024), which this paper distinguishes by operating at the **layer-wise feature** level.

## Competitor analysis

### Direct competitors
The entire **difference-in-means steering family** — ActAdd, DirAblate, Mean-AcT/Linear-AcT, CAA, Angular Steering — which PID subsumes as P controllers and then claims to dominate. Any "better steering-vector computation" method competes head-on.

### Indirect / architectural competitors
Representation-engineering and probing-based interventions (ITI/ITI-C, RePE, AURA), and heavier alternatives (SFT/RLHF, targeted finetuning) for behavior control. Token-level control-theory approaches occupy an adjacent but distinct granularity.

### Complementary methods
PID is additive/plug-in, so it complements any base steering method and could stack with SAE-feature steering, refusal-direction work, or diffusion-guidance pipelines. Contrastive-dataset construction and capability-monitoring benchmarks are reusable.

## Author and lab context

- **Tan Minh Nguyen** (Assistant/Presidential Young Professor, Dept. of Mathematics, **National University of Singapore**; PhD Rice under R. Baraniuk; postdoc UCLA under S. Osher) — senior author; stated current focus is *"programmable control of foundation models through activation steering, feedback control, distributional and kernelized steering, and compositional control."* This paper is squarely within a **central, ongoing research program**, not a one-off. **(Fact — his homepage.)**
- **Dung Viet Nguyen** (co-first; 1st-year PhD at NUS, co-advised by **Lei Zhang** and Tan M. Nguyen; email @u.nus.edu) — also on Expert-Merging/Nash-Bargaining and CAMEx expert-merging (ICLR 2025/2026). **(Fact — homepage + Google Scholar.)**
- **Yen Nhi Pham** and **Hieu M. Vu** — co-first authors (all three starred as equal contribution on the group page). Affiliations beyond the NUS group not confirmed this session → **Unknown**.
- **Lei Zhang** — co-senior / co-advisor. Affiliation details not confirmed this session → **Unknown** (listed with NUS group).
- Collaboration cluster: NUS Dept. of Mathematics steering/control group under Tan M. Nguyen, with recurring co-authors from the expert-merging line.

> Author reputation is context for the research program, not evidence of paper correctness (per CLAUDE.md §14).

## Strategic value for our work

- **Borrow:** the **layer-wise error-dynamics diagnostic** (plateau / zero-crossing / overshoot of \(\langle\bar e(0),\bar e(k)\rangle\)) as a general evaluation for *any* steering/intervention method — it is cheap, theory-linked, and reviewer-friendly; and the **"reframe a family under one equation, then improve it"** narrative pattern.
- **Avoid:** shipping steering claims with extra tunable knobs but no matched-budget tuning, seeds, or significance — this paper's own soft spot and a bar reviewers will now apply to us.
- **Baseline we likely need:** **PID / PID-AcT** now joins ActAdd, CAA, Mean-AcT, ITI, RePE as a mandatory steering baseline for any "better control" claim, and its error-dynamics plot becomes an expected diagnostic.
- **Evaluation protocol to replicate:** contrastive-data difference-in-means error signal; detox (RealToxicityPrompts) + jailbreak (ADVBENCH/ALPACA, ASR) with capability controls (PPL, MMLU, tinyBenchmarks).
- **Claim this blocks:** "we are first to give activation steering a control-theoretic / closed-loop foundation" and "existing steering is P control with steady-state error" are now taken; also "add integral/derivative feedback across layers".
- **Gap still open:** **causal/mechanistic validation** that closed-loop steering drives the model's actual mechanism (not just a difference-in-means proxy); **principled/auto-tuned gains** (adaptive \(K_p,K_i,K_d\)); handling the **orthogonal disturbance \(w_\perp\)** (nonlinear/gain-scheduled or learned controllers); **frontier-scale** validation; combining feedback control with **SAE-feature-level** targets rather than raw difference-in-means directions.
- **Differentiation:** supply the causal evidence, seeds/significance, and scale this paper lacks, or move from linear PID over raw directions to **feature-space / nonlinear / learned controllers** with interpretability guarantees.

## Reproducibility assessment

- Code availability: **5** (public repo `github.com/dungnvnus/pid-steering`, README with core equation and baseline mapping).
- Data availability: **5** (RealToxicityPrompts, ADVBENCH, ALPACA, standard benchmarks all public).
- Hyperparameter detail: **2** (`Unknown` this session — gains \(K_p,K_i,K_d\), per-task settings not verified from primary text; check PDF/repo).
- Compute transparency: **3** (training-free ⇒ cheap, but explicit budget/hardware not confirmed).
- Seed reporting: **1** (none surfaced).
- Evaluation clarity: **3** (tasks/metrics clear from secondary source; primary tables unverified).
- Ease of reproduction: **4** (training-free, standard models/datasets, released code make it tractable).

> Scores are provisional given `reading_status: partial`; revisit after reading the PDF and repo.

## Overall assessment

### Strengths
Crisp unifying theory (steering family = P control), a classical and well-motivated fix (PID) with stated ISS/overshoot guarantees, a theory-matching error-dynamics diagnostic, training-free plug-in design, breadth across models/tasks/modalities, and released code.

### Weaknesses
Theory rests on local linearization/Euler assumptions; extra hyperparameters without demonstrated matched-budget fairness (in accessible sources); no seeds/significance surfaced; behavioral—not causal/mechanistic—success; primary numbers unverified in this session.

### Confidence in assessment
**Medium.** High confidence on the *conceptual contribution and framing* (consistently reported across abstract, OpenReview, GitHub, and a detailed paper note). **Low** on exact numbers (secondary only) and on reviewer dynamics (reviews blocked). Upgrade after reading the PDF + reviews.

## Key quotations

> [!note] Verbatim from primary sources read this session (OpenReview abstract / TL;DR). Section-level quotes deferred until the PDF is read.

- "we develop a control-theoretic foundation for activation steering by showing that popular steering methods correspond to the proportional (P) controllers, with the steering vector serving as the feedback signal." (Abstract, OpenReview)
- "The proportional (P) term aligns activations with target semantic directions, the integral (I) term accumulates errors to enforce persistent corrections across layers, and the derivative (D) term mitigates overshoot by counteracting rapid activation changes." (Abstract, OpenReview)
- "We propose Proportional–Integral–Derivative (PID) Steering, a principled framework that leverages the full PID controller for activation steering in LLMs." (TL;DR, OpenReview)

## Open questions

- Does the "steering = P control, add I/D" story hold causally, or only for difference-in-means proxies?
- Can the gains \(K_p,K_i,K_d\) be set/learned automatically per layer/task, and how sensitive are results?
- How is the uncompensated orthogonal disturbance \(w_\perp\) best handled (nonlinear / gain-scheduled / feature-space controllers)?
- Do the gains survive frontier scale and matched-budget comparison against single-gain baselines?
- Does closing the loop over **SAE features** (instead of raw directions) improve interpretability and control jointly?

## Follow-up papers to read

- Turner et al. — ActAdd / Activation Addition (steering-vector baseline)
- Rimsky et al. — Contrastive Activation Addition (CAA)
- Mean-AcT / Linear-AcT (the sequential steering paradigm PID-AcT builds on)
- Li et al. — Inference-Time Intervention (ITI)
- Zou et al. — Representation Engineering (RePE)
- Angular Steering (jailbreak framework used here)
- Token-level control-theory views of generation (Luo 2023; Soatto 2023; Kong 2024)

## Source log

- OpenReview (abstract, authors, keywords, TL;DR — read): https://openreview.net/forum?id=vzkEX2SwFD (reviews public but **blocked by anti-bot challenge** this session)
- ICLR virtual (Poster; author display names): https://iclr.cc/virtual/2026/poster/10006765
- arXiv (abstract page read; **HTML 404**, PDF not fetched): https://arxiv.org/abs/2510.04309 (v3, last revised 2026-05-16; "10 pages main text, ICLR2026 Poster")
- Code (README read): https://github.com/dungnvnus/pid-steering
- Secondary paper note (full-paper summary; **source of all numeric results, unverified**): https://en.papernotes.org/ICLR2026/interpretability/activation_steering_with_a_feedback_controller/
- Author homepage (affiliation/context): https://tanmnguyen89.github.io/
- Google Scholar (Nguyen Viet Dung, NUS): https://scholar.google.com/citations?user=wKkzrtEAAAAJ
