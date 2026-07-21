---
title: "Can SAEs reveal and mitigate racial biases of LLMs in healthcare?"
year: 2026
conference: ICLR
status: accepted
presentation_type: poster
relevance: tier-1
primary_topics:
  - sparse autoencoders
  - mechanistic interpretability
  - fairness / bias mitigation
  - clinical / healthcare NLP
  - activation steering and ablation
authors:
  - Hiba Ahsan
  - Byron C. Wallace
institutions:
  - Northeastern University
paper_url: "https://openreview.net/forum?id=HAdITwqwLH"
openreview_url: "https://openreview.net/forum?id=HAdITwqwLH"
arxiv_url: "https://arxiv.org/abs/2511.00177"
code_url: "https://github.com/hibaahsan/sae_bias"
project_url: ""
review_visibility: public
reading_status: complete
last_updated: 2026-07-17
tags:
  - conference/iclr
  - year/2026
  - topic/sparse-autoencoder
  - topic/mechanistic-interpretability
  - topic/fairness
  - topic/healthcare
  - status/accepted
  - presentation/poster
  - relevance/tier-1
---

# Can SAEs reveal and mitigate racial biases of LLMs in healthcare?

## One-sentence summary

Using Gemma Scope SAEs on gemma-2 models over real clinical notes, the paper finds "Black latents" that both encode Black identity and fire on stigmatizing concepts (incarceration, cocaine, gunshot wounds), shows via steering that these latents causally push the model toward harmful predictions (e.g., patient "belligerence") while the model's CoT never mentions race, and concludes that SAE-based ablation mitigates bias in a contrived vignette task but is only marginally effective on realistic clinical tasks.

## Why this paper matters

It is a **tier-1, applied-interpretability** data point on the practical limits of SAEs for a high-stakes fairness use case. Rather than proposing a new SAE architecture, it stress-tests the increasingly popular claim that SAEs are useful tools for *detecting and controlling* concepts, in a domain (clinical decision support) where getting it wrong is directly harmful. For our program it is important because: (1) it provides an honest negative-leaning result — SAE steering/ablation degrades from "works" to "marginal" as tasks become realistic — which reviewers now cite as a cautionary baseline; (2) it demonstrates a concrete SAE-vs-CoT faithfulness contrast (SAEs surface race reliance that CoT hides); and (3) it operationalizes an end-to-end "find race latent → verify causally → mitigate" pipeline reusable for any spurious-attribute setting, not just race in healthcare.

## Research problem

When an LLM used for clinical prediction spuriously relies on patient race, clinicians cannot see it and cannot easily correct it. Can SAEs (i) reveal that a model is using race, especially when its chain-of-thought does not admit it, and (ii) be used to mitigate that reliance in clinical tasks?

## Motivation

- **Scientific:** SAEs promise disentangled, interpretable, causally-actionable concepts. Whether that promise survives contact with a messy, high-stakes, domain-specific setting (clinical notes) is untested. Prior mech-interp work on demographic bias in healthcare (Ahsan et al. 2025) motivates a targeted SAE study.
- **Practical:** LLMs are being adopted for clinical documentation and decision support, and are known to change predictions when patient race is altered (Zack et al. 2024; Xie et al. 2024; Poulain et al. 2024). Consumers of these outputs (clinicians) are usually blind to when race drove a prediction.
- **Gap in prior work:** SAEs had been applied mostly in the general domain and to *known-concept removal* (unlearning, spurious-feature editing). This is described as **one of the first assessments of SAEs for LLMs in clinical applications** (they note Bouzid et al. 2025 for multimodal radiology and Peng et al. 2025 for discussion). Existing latent descriptions (Neuronpedia) are also shown to be wrong/imprecise in the clinical context.

## Core hypothesis

SAE latents that are predictive of patient race (i) exist and are locatable, (ii) causally mediate the model's clinical outputs (not merely correlate with input tokens), and (iii) can be ablated to reduce racial bias — with the third hypothesis holding only weakly for realistic tasks.

## Objective

There is no new training objective; the paper *uses* pretrained Gemma Scope SAEs and optimizes/estimates several downstream quantities:

- **Latent selection:** an $\ell_1$-regularized logistic regression probe predicting race $y$ from max-aggregated SAE activations $Z \in \mathbb{R}^{N \times W}$; the latent with highest coefficient is taken as the "Black latent".
- **Steering:** amplify the Black latent's activation by $\alpha \cdot z_{\max}$ (Eq. 1, Arad et al. 2025 style), decode, and measure change in a target behavior ("Yes" belligerence rate) and whether the output now states the patient is Black.
- **Causal effect / ablation:** approximate each latent's effect $E = \sum_t (m(x) - m(x\,|\,\text{do}(z_t=0)))$ on the metric $m = \text{logit(``Yes'')} - \text{logit(``No'')}$ (Eq. 2, Marks et al. 2025), then zero-ablate race latents and measure **Fractional Logit Difference Decrease** $\text{FLDD} = 1 - \text{logitdiff}_\text{ablated}/\text{logitdiff}_\text{clean}$ (Eq. 5, Makelov et al. 2023).

Plain language: use a sparse probe to find the latent that "means race", turn it up to prove it causally changes clinical judgments, then turn it off to try to remove the bias — and measure how much the Yes/No gap between Black and white patients shrinks.

## Core idea

Intuition: if a single sparse feature both "lights up" on Black identity and on stigmatizing clinical concepts, then that feature is a candidate *mechanism* for racial bias, and manipulating it should move the model's behavior. Detection = does the feature reveal the reliance? Mitigation = does ablating the feature remove the reliance without wrecking clinical performance?

Mechanism: locate race-predictive Gemma Scope latents on real discharge summaries, **re-interpret** them with a clinical-text autointerp pipeline (because general-domain Neuronpedia labels are wrong here), validate causality by steering, then attempt bias removal by zero-ablation and compare against a simple anti-bias prompt baseline.

## Method

### Inputs
Residual-stream activations $h_j \in \mathbb{R}^D$ at a fixed middle layer of gemma-2 models, computed on clinical notes (discharge summaries / brief hospital courses / Q-Pain scenarios).

### Outputs
SAE latent activations $z \in \mathbb{R}^W$ (max-aggregated across tokens for probing); a selected set of race latents; steered/ablated model generations and Yes/No logits.

### Architecture
Pretrained **Gemma Scope** SAEs (Lieberum et al. 2024), width $W = 16\text{K}$, trained on residual-stream activations of the base model. Middle-layer SAEs: $\ell=12$ for gemma-2-2B, $\ell=20$ for gemma-2-9B. Interventions performed with **NNsight** (Fiotto-Kaufman et al. 2024).

### Training objective
None trained; SAEs are off-the-shelf. The only "learning" is the $\ell_1$ logistic-regression race probe over SAE activations.

### Data construction
- **Probe / latent discovery:** MIMIC-III discharge summaries; adult patients self-reporting race as "White" or "Black/African-American" (restricted to two groups for sample size); one summary per patient; random train/test split. Race is explicitly mentioned in only **4.3%** of notes, so this is not trivial keyword matching.
- **Steering:** Brief Hospital Courses (BHC) from Hegselmann et al. 2024 (derived from MIMIC-IV-Note); 500 BHCs for eval, 100 for selecting $\alpha$.
- **Vignette task:** model-generated vignettes for conditions the Black latent fires on (cocaine abuse, gestational hypertension for 2B; uterine fibroids for 9B); 500 vignettes/condition at temperature 0.7.
- **Clinical tasks:** diagnosis-evidence / risk prediction over BHCs with race surgically substituted into the note ("___ y/o M" → "___ y/o African-American M"), plus **Q-Pain** (Logé et al. 2021) pain-management scenarios with race/name substitution (100 Black–white pairs).

### Inference procedure
Encode activations → probe/aggregate to find latents → for steering, add $\mathbf{1}_{i=r}\cdot\alpha z_{\max}$ to the Black latent then decode $h' = Wz' + b$ → for mitigation, zero-ablate the set of race latents (7 latents for 2B, 9 for 9B, manually curated from reinterpreted descriptions) and re-run.

### Computational requirements
Modest: two model sizes (2B, 9B) plus a gpt-oss-20b appendix check. Explainer/scoring model Llama-3.1-70B-Instruct; perplexity gate via Llama-3.1-8B. Hardware: **2× NVIDIA H200 GPUs**. Compute allocation on DeltaAI/NCSA acknowledged.

## Experimental design

### Models
gemma-2-2B-it and gemma-2-9B-it (Team et al. 2024); generalization check on **gpt-oss-20b** (Appendix B.1). All instruction-tuned.

### Layers or activation sites
Middle-layer residual stream: $\ell=12$ (2B), $\ell=20$ (9B); gpt-oss uses its middle-layer SAE (resid_post layer 11). White-latent steering used later layers ($\ell=19$ latent 2894 for 2B; $\ell=31$ latent 13191 for 9B) because clean "white" latents were not found mid-network. Multi-layer ablation ($\ell\in\{12..16\}$ / $\{20..24\}$) tested in Appendix D.3.

### Datasets
MIMIC-III (discharge summaries), MIMIC-IV-Note BHC subset (Hegselmann et al. 2024), Q-Pain (Logé et al. 2021). Autointerp uses Llama-3.1-70B-Instruct.

### Baselines
For mitigation, the primary baseline is **anti-bias prompting** ("Avoid generating demographics that solely reflect stereotypes…" for vignettes; "Do not make assumptions about the patient based on their race." / "Do not make hidden assumptions…" for clinical tasks). No SAE-architecture baselines (the SAE is fixed).

### Metrics
- AUROC of the single Black latent for predicting race.
- Steering: $\Delta_{\text{Black}}/\Delta_{\text{white}}$ (change in positive/"Yes" belligerence rate) and $\text{race}_{\text{Black}}/\text{race}_{\text{white}}$ (fraction of outputs that state the steered race); $\alpha$ selected by positive-rate/perplexity ratio.
- Vignette task: fraction of Black-patient vignettes (lower = less over-representation).
- Clinical tasks: $\Delta_{\text{logitdiff}} = \text{logitdiff}_B - \text{logitdiff}_W$ (bias magnitude), latent effect $E$, and **FLDD** (bias reduction from ablation).

### Controls
White-latent steering as a contrast to Black-latent steering; anti-bias prompting as the mitigation baseline; CoT keyword search ('African', 'Black', 'racial') to test faithfulness; race explicitly substituted so only race varies across paired inputs.

### Ablations
Zero-ablation of the Black latent (vignettes); zero-ablation of the curated race-latent set (clinical tasks); single-layer vs five-layer ablation (Appendix D.3, no improvement); steering-factor $\alpha$ sweep vs perplexity (Appendix C).

### Statistical testing
Paired $t$-test on $\Delta_{\text{logitdiff}}$ per task — all pre-intervention race differences are statistically significant ($p<0.05$). No seeds/variance reported for the SAE metrics themselves.

### Number of seeds
Not reported for the core pipeline (random train/test split for the probe is mentioned; no multi-seed variance analysis). **Fact:** the authors cite Amir et al. 2021 (their own prior work on seed sensitivity of clinical classifiers), but do not run a seed study here.

## Main results

- **Race latents exist and are strongly predictive.** The top $\ell_1$-probe latent in each model is an "African-American ethnicity" latent; single-latent max-activation AUROC for race is **0.63 (2B)** and **0.72 (9B)**. Black latent IDs: **6364 (2B, $\ell$12)**, **14766 (9B, $\ell$20)**.
- **Latents encode stigmatizing associations.** The Black latents fire on "Black"/"African-American" (and, per multi-token entity storage, on "American"), on conditions more prevalent in Black patients (preterm labor, gestational hypertension), **and** on problematic tokens: incarceration, gunshot wounds, altercation with police, cocaine use. The pattern replicates in gpt-oss-20b.
- **Neuronpedia labels are wrong in-domain.** E.g., latent 14880 labeled "vehicle maintenance and repairs" actually fires on surgical *replacements* (valve replacement, tube change) — motivating clinical re-interpretation via autointerp.
- **Steering is causal.** Amplifying the Black latent makes the model both *label* the patient Black (race$_\text{Black}$ = 1.0 for 2B, 0.78 for 9B) and *raise* predicted belligerence risk: $\Delta_{\text{Black}} = {+}0.51$ (2B), ${+}0.80$ (9B). Amplifying "white" gives negligible change ($\Delta_{\text{white}} = -0.01$ / $+0.09$).
- **CoT is unfaithful.** None of the steered reasoning chains from either model mention race despite race causally driving the changed prediction — a striking clinical instance of CoT unfaithfulness.
- **Mitigation works in the toy task.** Zero-ablating the Black latent reduces the Black-vignette fraction from >85% by **~30% on average**, beating anti-bias prompting (~18% reduction): cocaine abuse 0.88→0.46, gestational hypertension 0.85→0.52, uterine fibroids 0.99→0.73 (SAE column, all better than prompting).
- **Mitigation largely fails on realistic tasks.** On risk-prediction / Q-Pain, race latents have low causal effect ($E$ max ~0.07). Zero-ablation yields tiny **FLDD**: 0.8% (cocaine, 2B), 1.1% (g-hypertension, 2B), 0.01% (Q-Pain, 2B), 2.9% (uterine fibroids, 9B), 0.3% (Q-Pain, 9B). Anti-bias **prompting** reduces $\Delta_{\text{logitdiff}}$ in 4/5 tasks (but over-corrects for cocaine, flipping toward "Yes" for white patients); SAE ablation helps only marginally in 2/5 (uterine fibroids −0.05, g-hypertension −0.03). Multi-layer ablation does not help.

## What the results genuinely demonstrate

- SAEs can **surface** a model's spurious race reliance in clinical text, including reliance that the model's own CoT conceals — a genuine detection/faithfulness win over verbal explanations.
- The identified Black latent is **causal**, not merely correlational, for at least one harmful downstream behavior (belligerence risk) under controlled steering.
- On a **localized, contrived** generation task, single-latent ablation reduces measured over-representation more than a prompting baseline.

## What the results do not demonstrate

- **No reliable mitigation on realistic clinical tasks:** FLDDs are near-zero and SAE ablation underperforms simple prompting on the tasks that actually matter.
- The steering harm demonstration (belligerence) is an **elicitation/red-teaming** result, not evidence that this behavior arises unprompted in deployment.
- Findings are limited to **gemma-2 (+one gpt-oss check)**, a single mid-layer per model, **two race groups (Black vs white)**, and **one hospital's** data (MIMIC-III/IV, Beth Israel Deaconess) — external validity is untested.
- "Race latents" are selected via a probe + manual curation and *reinterpreted* descriptions; there is no guarantee the curated set is complete or that ablation removes only race (entanglement is explicitly flagged).

## Strongest evidence

The **steering + CoT** combination (§3, Tables 2–3): manipulating a single latent both reassigns patient race in the output and raises predicted belligerence ($\Delta_{\text{Black}}$ up to +0.80), while zero reasoning chains mention race. This jointly supports causality *and* the SAE-over-CoT faithfulness claim, and the white-latent contrast rules out a generic "any-race" effect.

## Weakest evidence

The **realistic-task mitigation** conclusion rests on very small FLDDs (≤2.9%) and low latent effects ($E \le 0.07$) over modest sample sizes (Table 5: 100–437 samples/task), with **no seeds/variance** on these estimates. The negative result is plausible but under-powered; it is more accurately "no detectable benefit here" than "SAE ablation cannot work." The vignette-task success also uses only 3 condition/model cells.

## Important ablations

- **Single Black latent vs curated race-latent set:** expanding to 7 (2B) / 9 (9B) race latents still yields minimal FLDD — more coverage does not rescue mitigation.
- **Single-layer vs five-layer ablation (Appendix D.3):** ablating race latents across $\ell\in\{12..16\}$ / $\{20..24\}$ gives essentially identical (still tiny) FLDDs — the failure is not a single-layer artifact.
- **Steering-factor $\alpha$ sweep (Appendix C):** $\alpha$ chosen via positive-rate/perplexity to avoid text degradation; small $\alpha$ (0.03–0.9) suffices, showing the effect is not just noise from destroying the representation.

## Failure cases

- SAE ablation barely moves logits on cocaine-abuse, g-hypertension, uterine-fibroid risk prediction, and Q-Pain (FLDD 0.01–2.9%).
- Anti-bias **prompting over-corrects** on cocaine abuse, shifting toward "Yes" for white patients (a different bias).
- Clean mid-layer "white" latents could not be found (the "white" latents fired on "white blood cell" etc.), forcing later-layer steering for the contrast condition.

## Limitations stated by the authors

- Analysis limited to gemma-2 models (taken as broadly representative, but others may encode race differently).
- Data from a single hospital source (MIMIC-III / MIMIC-IV) due to scarcity of public clinical datasets.
- Only Black (vs white) studied; other racial groups left to future work.
- If race and clinical concepts are entangled, it is unclear how to remove problematic associations without ablating legitimate clinical concepts and hurting performance — and if you must re-check whether a "clinical" latent is race in disguise, the interpretability benefit is undercut.

## Additional limitations not emphasized by the authors

- **No seeds / no variance** on AUROC, $\Delta_{\text{logitdiff}}$, $E$, or FLDD; the negative mitigation result is therefore statistically under-characterized.
- **Race-latent set is human-curated** (manual false-positive removal); selection bias and incompleteness are possible.
- **Steering metric = LLM-judged / logit-based proxies** (belligerence "Yes" rate, perplexity gate); no human clinical review of harm.
- The AUROC of 0.63 (2B) for a "strongly correlated" single latent is modest; the "strongly correlates" phrasing is generous for the 2B case.
- Vignette-task evaluation covers only 3 condition/model cells, so "~30% average reduction" is a small-sample average.

## Reviewer feedback

> [!warning] Reviews not retrieved — do not fabricate
> The OpenReview forum for `HAdITwqwLH` indicates reviews exist, but the review/notes endpoints returned a **ChallengeRequiredError** (anti-bot challenge) in this session, so the individual review texts, scores, rebuttal, and meta-review were **not retrieved**. Per CLAUDE.md §24, this section is intentionally left unfilled rather than invented. **Action:** fetch reviews via an authenticated browser session and complete positive points, concerns, questions, rebuttal, and resolved/unresolved items.

## Why it was accepted

> [!note] Interpretation
> Evidence-based inference from the paper itself + its accepted-Poster status; reviews were not read.

Plausible factors: (1) a **timely, high-stakes application** (clinical fairness) with an honest, nuanced result rather than an oversold "SAEs solve bias" claim; (2) a **memorable, striking finding** — steering a single latent raises predicted "belligerence" for Black patients while CoT stays silent — that crisply demonstrates SAE-over-CoT faithfulness; (3) **methodological soundness** (causal effect estimation à la Marks et al., FLDD, paired $t$-tests, a prompting baseline, a gpt-oss replication); (4) a **useful negative/mixed result** for the community's "are SAEs useful for control?" debate; (5) **reproducibility** (public code, public datasets, documented compute). Poster (not oral) is consistent with a valuable applied study of limited model/task scope.

## Why it may have been rejected

Not applicable (accepted, Poster).

## Novelty analysis

### What is genuinely new
The **first (self-described) systematic assessment of SAEs for revealing and mitigating racial bias in clinical LLM tasks**, including the clinical **re-interpretation of latents** (showing general-domain descriptions are wrong in-domain) and the SAE-vs-CoT faithfulness contrast in a clinical setting.

### What is adapted from prior work
Steering formulation (Arad et al. 2025), latent causal-effect approximation + spurious-feature ablation (Marks et al. 2025 sparse feature circuits), FLDD (Makelov et al. 2023), autointerp pipeline (Paulo et al. 2024), max-aggregation for probing (Bricken et al. 2024), $\ell_1$ probe-over-SAE latent selection (Movva et al. 2025), Gemma Scope SAEs (Lieberum et al. 2024), vignette protocol (Zack et al. 2024).

### What is mostly engineering or scaling
Assembling the pipeline over MIMIC data with NNsight; no new architecture, loss, or theory.

### Closest prior papers
Ahsan et al. 2025 ("Elucidating mechanisms of demographic bias in LLMs for healthcare" — same first author, mechanistic but not SAE-centric); Marks et al. 2025 (sparse feature circuits / spurious-feature editing); Karvonen & Marks 2025 (robustly improving LLM fairness via interpretability); Movva et al. 2025 (SAEs for hypothesis generation); Peng et al. 2025 ("use SAEs to discover unknown concepts, not to act on known concepts").

## Competitor analysis

### Direct competitors
Methods that use SAEs/interpretability to **detect or remove demographic bias**: Karvonen & Marks 2025 (LLM fairness via interpretability in realistic settings), Nguyen & Tan 2025 (race representations for debiasing high-stakes decisions), FairSteer (Li et al. 2025). This paper competes on the *evaluation/positioning* axis — it argues SAE editing under-delivers where those methods claim gains.

### Indirect competitors
Prompt-based debiasing (Tamkin et al. 2023; Gallegos et al. 2024) — here shown to often *beat* SAE ablation on realistic tasks; projection/nullspace concept removal (Ravfogel et al. 2020; Liang et al. 2020; Xie et al. 2024); fine-tuning on balanced data / concept ablation fine-tuning (Casademunt et al. 2025).

### Complementary methods
SAE unlearning / concept removal (Farrell et al. 2024; Ashuach et al. 2025 CRISP; Muhamed et al. 2025), autointerp (Paulo et al. 2024), Neuronpedia/Gemma Scope tooling, NNsight. The paper's pipeline could stack with any better SAE or a better latent-selection method.

## Author and lab context

- **Byron C. Wallace** (Northeastern University) — senior PI; large body of clinical NLP / EHR / LLM-for-healthcare and ML-fairness work; recurring MIMIC-based studies. Central, sustained research program on trustworthy clinical NLP.
- **Hiba Ahsan** (Northeastern University, corresponding author) — PhD researcher; prior directly-related work: "Retrieving evidence from EHRs with LLMs" (2024) and "Elucidating mechanisms of demographic bias in LLMs for healthcare" (2025, with David Bau, Arnab Sen Sharma, Silvio Amir). This SAE paper is a natural continuation of that mech-interp-for-healthcare line.
- **Fact:** acknowledgements thank **David Bau, Can Rager, Koyena Pal, Caden Juang** (Northeastern/NDIF interpretability circle) and credit **Coefficient Giving** funding + ACCESS/DeltaAI compute — situating the work inside the NNsight/NDIF interpretability ecosystem.
- **Inference:** this is part of a coordinated Northeastern clinical-interpretability program, not a one-off; theme = mechanistic tools applied to demographic bias in medical LLMs.

## Strategic value for our work

- **Borrow:** the end-to-end **"probe→reinterpret→steer(verify causality)→ablate(measure FLDD)"** pipeline as a template for evaluating any SAE-for-spurious-attribute claim; the **domain-specific re-interpretation** point (never trust Neuronpedia labels out-of-domain); the **SAE-vs-CoT faithfulness** framing as a compelling narrative device; the **prompting baseline** as a mandatory comparator for any SAE-mitigation claim.
- **Avoid:** overclaiming SAE control utility, and shipping fairness/mitigation results without **seeds/variance** and without a **prompting baseline** — this paper shows reviewers now expect both, and that prompting can beat SAE ablation.
- **Baseline we likely need:** anti-bias prompting + FLDD + latent-effect ($E$) estimation become expected comparators for "SAEs mitigate X" papers; the **entanglement caveat** (ablating race may ablate clinical signal) is a reviewer objection to preempt.
- **Evaluation protocol to replicate:** $\Delta_{\text{logitdiff}}$ with paired $t$-tests over race-substituted inputs; FLDD for ablation; positive-rate/perplexity for steering-strength selection; autointerp detection scoring (Paulo et al.).
- **Claim this blocks:** "SAE steering/ablation is an effective, deployment-ready bias-mitigation tool for realistic clinical tasks" is now contested; and "SAEs are the first interpretability tool applied to clinical racial bias" is taken.
- **Gap still open:** *making* SAE-based mitigation work on realistic, entangled tasks (disentangling race from legitimate clinical features), scaling beyond gemma-2 and one hospital, multi-group (beyond Black/white) analysis, seed/variance-backed effect sizes, and mitigation that provably preserves clinical performance.
- **Differentiation:** provide the scaling, seeds, multi-model/multi-group evidence, and a mitigation method that survives entanglement — precisely what this paper concludes is unresolved.

## Reproducibility assessment

- Code availability: **5** (public repo `hibaahsan/sae_bias`).
- Data availability: **3** (MIMIC-III/IV, BHC, Q-Pain are public but **credentialed/PhysioNet-gated**; not freely downloadable).
- Hyperparameter detail: **4** (models, layers, SAE width 16K, $\alpha$ values, latent IDs, race-latent lists in appendix; probe regularization stated, optimizer/schedule less so).
- Compute transparency: **4** (2× H200, NNsight, DeltaAI allocation named).
- Seed reporting: **1** (no multi-seed variance on core metrics).
- Evaluation clarity: **4** (metrics well-defined; several results only in figures).
- Ease of reproduction: **3** (code + off-the-shelf SAEs help, but credentialed clinical data is a real barrier).

## Overall assessment

### Strengths
Timely, high-stakes, honest applied study; clean causal steering demonstration; striking SAE-vs-CoT faithfulness result; domain-specific latent re-interpretation insight; prompting baseline included; cross-model replication (gemma-2 2B/9B + gpt-oss-20b); public code.

### Weaknesses
Narrow scope (gemma-2, one mid-layer, Black-vs-white, single hospital); no seeds/variance; small per-task samples; human-curated latent sets; realistic-task mitigation result is under-powered (near-zero FLDDs); harm demonstration is elicited, not observed in deployment.

### Confidence in assessment
**High** on method and reported results (full arXiv text read). **Medium** on positioning vs the newest SAE-fairness competitors. **Low** on reviewer dynamics (reviews blocked, not read).

## Key quotations

- "We find that this offers improvements in simple settings, but is less successful for more realistic and complex clinical tasks." (Abstract)
- "increasing the 'Black'-ness of a patient … increases the predicted risk of patient belligerence." (§3)
- "None of the reasoning chains generated by either of the models contain such terms, indicating unfaithful explanations for the task." (§3, CoT)
- "if race and clinical concepts are entangled, then it is unclear how problematic associations can be removed using SAEs without ablating clinical concepts and compromising downstream performance." (§5 Discussion)
- "their utility in bias detection and mitigation may not generalize beyond contrived settings." (§5 Discussion)

## Open questions

- Can SAE-based mitigation be made to work on realistic, entangled clinical tasks without harming clinical performance?
- Do these findings hold beyond gemma-2 / one hospital / Black-vs-white, and across many layers?
- Is the near-zero FLDD a true negative or an under-powered / method-limited one (seeds, better latent selection, non-linear intervention)?
- How should race–clinical-feature entanglement be measured and disentangled?

## Follow-up papers to read

- Ahsan et al. 2025 — Elucidating mechanisms of demographic bias in LLMs for healthcare (`arXiv:2502.13319`)
- Marks et al. 2025 — Sparse feature circuits (`arXiv:2403.19647`)
- Karvonen & Marks 2025 — Robustly improving LLM fairness via interpretability (`arXiv:2506.10922`)
- Arad et al. 2025 — SAEs are good for steering if you select the right features (`arXiv:2505.20063`)
- Movva et al. 2025 — SAEs for hypothesis generation (`arXiv:2502.04382`)
- Peng et al. 2025 — Use SAEs to discover unknown concepts, not to act on known concepts (`arXiv:2506.23845`)
- Lieberum et al. 2024 — Gemma Scope (`arXiv:2408.05147`)
- Nguyen & Tan 2025 — Race representations for debiasing high-stakes decisions (`arXiv:2504.06303`)

## Source log

- Official proceedings / OpenReview: https://openreview.net/forum?id=HAdITwqwLH (Poster; reviews exist but **not retrieved** — ChallengeRequiredError anti-bot block this session)
- OpenReview PDF: https://openreview.net/pdf?id=HAdITwqwLH
- arXiv (full text read): https://arxiv.org/abs/2511.00177 (HTML v2)
- Code: https://github.com/hibaahsan/sae_bias
- ML Anthology entry: https://mlanthology.org/iclr/2026/ahsan2026iclr-saes/
- Other: MIMIC-III/IV (PhysioNet, credentialed), Q-Pain (PhysioNet), Gemma Scope SAEs (Neuronpedia / HuggingFace)
