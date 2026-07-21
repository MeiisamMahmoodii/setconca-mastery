---
title: "Causality ≠ Invariance: Function and Concept Vectors in LLMs"
year: 2026
conference: ICLR
status: accepted
presentation_type: poster
relevance: tier-1
primary_topics:
  - function vectors
  - concept vectors
  - mechanistic interpretability
  - representation invariance
  - activation steering
authors:
  - Gustaw Opiełka
  - Hannes Rosenbusch
  - Claire E. Stevenson
institutions:
  - University of Amsterdam
paper_url: "https://openreview.net/forum?id=LmLmhb6GEL"
openreview_url: "https://openreview.net/forum?id=LmLmhb6GEL"
arxiv_url: "https://arxiv.org/abs/2602.22424"
code_url: ""
project_url: ""
review_visibility: public
reading_status: complete
last_updated: 2026-07-17
tags:
  - conference/iclr
  - year/2026
  - topic/function-vectors
  - topic/concept-vectors
  - topic/mechanistic-interpretability
  - topic/steering
  - status/accepted
  - presentation/poster
  - relevance/tier-1
---

# Causality ≠ Invariance: Function and Concept Vectors in LLMs

## One-sentence summary

The paper dissociates two representational roles in LLMs — Function Vectors (FVs), attention-head sums selected by activation patching that *causally* drive in-context learning but mix concept with input format, versus Concept Vectors (CVs), head sums selected by Representational Similarity Analysis (RSA) that encode a *format-invariant* abstract concept — and shows the two head sets are largely disjoint, so "what drives behavior" (causality) is not "what represents the abstract concept" (invariance).

## Why this paper matters

It is a **direct competitor / cautionary result** for concept-vector, task-vector, and steering-vector research. Much prior work treats FVs / task vectors as if they *were* the model's abstract concept representation and portable across contexts. This paper empirically breaks that assumption: FVs of the same relational concept extracted from different surface formats (open-ended English vs. French vs. multiple-choice) are **nearly orthogonal**, so they carry format, not just concept. For our program this matters because: (1) it introduces a concrete **invariance test** (RSA against concept vs. format design matrices) that reviewers may now expect anyone claiming a "concept direction" to pass; (2) it reframes the causal-vs-representational distinction — a steering vector that *works* is not evidence that you found the *concept*; (3) it stakes a claim on the "RSA-selected invariant heads (CVs)" construct and on the causality≠invariance framing, closing off that specific narrative.

## Research problem

Do LLMs represent (relational) concepts abstractly — i.e., independently of surface input format — and if so, are those abstract representations the same components that causally drive in-context-learning (ICL) behavior? Concretely: are Function Vectors, which are known to causally mediate ICL, actually format-invariant concept encodings, or something else?

## Motivation

- **Scientific:** Cognitive science (Gentner 1983; Hofstadter 1995; Mitchell 2020) argues abstract relational representation underlies human analogical generalization; recent work reports LLM–human representational alignment. This motivates asking whether the "abstract concept" story holds mechanistically inside LLMs.
- **Practical:** FVs / task vectors are widely used for steering and are often assumed portable across prompts and formats; if they secretly encode format, steering and interpretation claims built on them are fragile out-of-distribution.
- **Gap in prior work:** Prior FV work (Todd et al. 2024; Hendel et al. 2023) computes indirect effects mostly in one format (OE-EN) and treats FV portability as evidence of concept-encoding. The paper's gap claim: **invariance to input format was assumed, not tested**, and the single-circuit hypothesis (format-invariant representations *are* what enables ICL) was untested.

## Core hypothesis

Causality and invariance are mediated by **largely distinct** attention-head mechanisms in LLMs: activation-patching-selected heads (FVs) causally drive ICL but conflate concept with format, whereas a separate set of RSA-selected heads (CVs) encodes the concept invariantly across format but does not primarily drive behavior. Stated falsifiably: the top-K AIE heads and top-K Concept-RSA heads should overlap near chance, and CVs should cluster by concept across formats while FVs cluster by format.

## Objective

Two localization criteria are compared, then their head sets are summed into vectors and evaluated for invariance (RSA) and causal effect (steering ΔP / patching):

- **Causal criterion (FV heads):** rank heads by Average Indirect Effect. Causal indirect effect of head `a_{ℓj}` is `CIE(a_{ℓj}) = f(p̃ | a_{ℓj}:=ā_{ℓj})[y] − f(p̃)[y]` (Eq. 1), i.e., the change in probability of the expected token `y` on a corrupted prompt `p̃` when the clean mean activation `ā_{ℓj}` is transplanted; AIE averages CIE over all datasets/formats (Eq. 2).
- **Invariance criterion (CV heads):** for each head build a representational similarity matrix (cosine similarity of head outputs across prompts) and score it by Spearman ρ against a binary **concept** design matrix (1 if two prompts share a concept regardless of format): `Concept-RSA(a_{ℓj}) = ρ(RSM_{ℓj}, Concept-DM)` (Eq. 4). A parallel **question-type / format** DM measures how much a head tracks format instead.
- **Vector construction:** `FV_i = Σ_{a∈A_FV} a_{ℓj}^i`, `CV_i = Σ_{a∈A_CV} a_{ℓj}^i` over the top-K heads by AIE / RSA respectively (Eq. 5).

Plain language: FV heads are picked for "moving the answer" (cause); CV heads are picked for "organizing prompts by concept, not by format" (invariance). The paper then checks whether these are the same heads (they are not) and which vector steers better in vs. out of distribution.

## Core idea

Intuition: "the head that changes the output" and "the head that represents the abstract concept" need not be the same head. Behavioral causality (found by patching) and representational invariance (found by RSA) are different questions, so use different tools for each and compare.

Mechanism: run activation patching to get causal (FV) heads and RSA to get invariance (CV) heads over the *same* prompts spanning 7 concepts × 3 formats; compare their layer profiles (similar) and top-K identity overlap (near chance); then sum each head set into a steering vector and test in-distribution vs. out-of-distribution transfer.

## Method

### Inputs
Last-token attention-head outputs `a_{ℓj}` from ICL prompts. Datasets = one concept in one format; 5-shot for open-ended, 3-shot for multiple-choice. 50 prompts/dataset, 21 datasets (7 concepts × 3 formats), N = 1050 prompts. Input–output pairs sourced from Todd et al. (2024) or generated with GPT-4o; French/Spanish via DeepL.

### Outputs
Two head sets (A_FV via AIE, A_CV via Concept-RSA) and their summed vectors (FV, CV) per prompt/format; steering deltas ΔP and KL divergences.

### Architecture
No new architecture — analysis of pretrained autoregressive transformers; residual stream `h_ℓ = h_{ℓ-1} + MLP_ℓ + Σ_j a_{ℓj}` (Elhage et al. 2021 decomposition). Interventions add `h_ℓ ← h_ℓ + α·v` at a chosen layer (Eq. 6).

### Training objective
None — no training; purely localization (AP, RSA) + intervention.

### Data construction
Concepts: Antonym, Categorical, Causal, Synonym, Translation, Present–Past, Singular–Plural. Formats: open-ended English (OE-EN), open-ended French/Spanish (OE-FR/OE-ES), multiple-choice (MC). MC options built by sampling 3 distractors from the same concept. Quality filtering (dedup, single/two-word, lowercase).

### Inference procedure
- Invariance: compute Concept-RSA and question-type-RSA for FVs vs. CVs.
- Overlap: rank heads by AIE and by RSA, measure top-K intersection vs. a hypergeometric null.
- Steering: build per-format mean vectors from 50 extraction prompts, inject into a novel **AmbiguousICL** task (two interleaved concepts; second always EN→FR translation; steer toward the first), measure ΔP = P_after(y) − P_before(y) over 100 prompts/concept and KL divergence between ID- and OOD-steered next-token distributions. Sweep α∈{1,3,5,10,15}, K∈{1,3,5,10,20,50}, report best per model.

### Computational requirements
Four models up to 72B (Llama 3.1 8B/70B, Qwen 2.5 7B/72B); LUMI supercomputer / SURF e-infrastructure acknowledged. No explicit GPU-hour budget reported.

## Experimental design

### Models
Llama 3.1 8B, Llama 3.1 70B, Qwen 2.5 7B, Qwen 2.5 72B (4 models, 2 families, two scales each).

### Layers or activation sites
Attention-head outputs across all layers; head-level AIE and RSA computed per head; steering injected at the residual stream, layer swept (Figs 7, 16).

### Datasets
7 relational-concept datasets × 3 formats (21 datasets, N=1050). AmbiguousICL diagnostic task for steering. Spanish variant for a language-generalization check (Appendix N).

### Baselines
FVs (the standard activation-patching construction, Todd et al. 2024) are the primary comparison point for CVs; the paper contrasts FV vs. CV throughout rather than against external methods. Zero-shot steering and cross-format patching serve as internal controls.

### Metrics
Concept-RSA and question-type-RSA (Spearman ρ); mean cosine similarity of similarity-matrix clusters; top-K head overlap with hypergeometric significance; steering ΔP; Top-1 accuracy (Appendix L); KL divergence between ID/OOD post-steering distributions; token-level ΔP tables.

### Controls
- **Cross-format activation patching** (Appendix O): extract clean activations in one format, patch into a corrupted run of another — still recovers FV heads (e.g., Llama-3.1-70B head L31H18), never CV heads, ruling out "patching within a format biases toward format heads".
- **MC-with-words** variant (Appendix M): FV MC clusters persist even when the model outputs a word not a letter → the MC cluster is format, not letter-token, driven.
- **Spanish AmbiguousICL** (Appendix N): CVs extracted from English steer toward the *Spanish* antonym → CVs encode "Antonym", not "English Antonym".
- **Qwen 72B outlier exclusion** (Appendix J): two anomalous Categorical datasets excluded; top-5 rankings unchanged (100% overlap).

### Ablations
Sweeps over K (number of heads) and α (steering strength); FV head partition into All / Common / Unique-MC heads (Appendix K) to test whether "common" causal heads are format-invariant (they are not — orthogonal across formats).

### Statistical testing
Head-overlap significance via one-sided hypergeometric tail probability, p<0.05 bolded (Table 1, Appendix E). No significance tests reported on steering ΔP / KL magnitudes.

### Number of seeds
Not reported. **No seed/variance analysis** on RSA scores, ΔP, or KL.

## Main results

- **FVs are not format-invariant (headline).** Same-concept FVs from different formats are nearly orthogonal; FV similarity matrices cluster by **format** while CV matrices cluster by **concept across formats** (Fig 3). In Llama 3.1 70B, within-format-type FV clusters have mean cosine ≈ **0.90**, whereas CVs retain only weak within-format clustering (mean cosine ≈ **0.55**), i.e., some residual format info but markedly more invariant. **[Fact]**
- **CVs carry more concept, less format.** Across models and K, CVs show higher Concept-RSA and lower question-type-RSA than FVs (Fig 4). **[Fact]**
- **FV and CV heads are largely disjoint.** For K≤20 the top-K overlap is near zero (Table 1); e.g., Llama-3.1-70B has 0 overlap through K=20 and only 6 overlapping heads at K=100; overlap rises above chance only at large K for some models. AIE scores are highly sparse (histogram peaks at 0, long tail; Fig 12), so few heads are causal. **[Fact]**
- **In-distribution steering: FVs win.** Extracted from OE-EN and applied to OE-EN AmbiguousICL, FVs give the largest ΔP; CVs help less and have minimal zero-shot effect (Fig 7, Fig 17). **[Fact]**
- **Out-of-distribution steering: CVs are more consistent.** When vectors are extracted from OE-FR or MC, CVs more often keep positive, concept-aligned effects and yield **lower KL** between ID and OOD steering distributions than FVs; the CV–FV KL gap is larger for MC than OE-FR (Fig 8). FVs frequently degrade OOD, especially MC. **[Fact]**
- **FVs inject format artifacts.** OOD FVs push format-specific tokens: OE-FR FVs raise the French translation's probability; MC FVs raise the opening-bracket token `_(`. OE-**Spanish** FVs induce nearly the same French-token bias as French FVs, i.e., a generic "foreign-language/translation" signal tied to extraction format, not language-specific content (Table 2, Figs 13–15). **[Fact]**
- **Token-level example (Llama-3.1-70B, query "salty →"):** unsteered model predicts French `_sa` (49%), antonym `_sweet` only 2%. ID FV lifts `_sweet` +56%; OOD FV from MC instead lifts `_(` +53%; CVs lift `_sweet` across all extraction formats (+49/+54/+35%), i.e., concept-aligned regardless of format. **[Fact]**
- **CVs need the concept already present.** In zero-shot steering and activation patching (inducing a task "from scratch"), CVs are ineffective; they only help when the concept is present but competing (AmbiguousICL). FVs seem needed to *instantiate* a task; CVs can *modulate* an existing one (§5). **[Fact / authors' interpretation]**

## What the results genuinely demonstrate

- Activation-patching-selected (causal) heads and RSA-selected (invariant) heads are, for these relational-concept ICL tasks and four models, **largely different heads in similar layers** — a robust dissociation, reinforced by cross-format patching.
- FVs empirically encode surface format (language, MC structure), not just abstract concept, contradicting the common "FV = portable concept vector" reading.
- There **exist** format-invariant abstract concept representations in these LLMs (CVs), demonstrable via RSA and via CV steering toward the concept regardless of surface form.

## What the results do not demonstrate

- **Not** that CVs are a better steering tool in general — their absolute gains are smaller and they fail zero-shot / from-scratch. The contribution is a *dissociation*, explicitly not a CV-beats-FV claim (§5).
- **No** direct causal necessity/sufficiency test that CV heads are used by the model during normal (non-steered) inference; RSA is correlational and AP specifically does *not* flag CV heads.
- Scope limited to **relational-concept ICL** (7 concepts) and 2 model families; nothing about non-relational concepts, other task types, or SAE-style feature-level concepts.
- The "higher level of abstraction" claim rests on clustering/orthogonality arguments under the Linear Representation Hypothesis, not on an independent behavioral abstraction benchmark.

## Strongest evidence

The combination of (a) near-zero top-K FV/CV head overlap with a hypergeometric null (Table 1) and (b) cross-format activation patching (Appendix O) that keeps recovering the *same* FV heads (e.g., L31H18) and *never* CV heads. Together these make the causality-vs-invariance dissociation hard to explain away as a patching artifact.

## Weakest evidence

The steering "CVs generalize better OOD" claim rests on ΔP and KL without significance tests or seeds, on a single diagnostic task (AmbiguousICL), and with per-model best-α/K selection; absolute CV gains are small and sometimes near zero, so the OOD advantage is a consistency-not-magnitude argument.

## Important ablations

- **FV head partition (Appendix K):** even the FV "common heads" (causal across all three formats) are nearly orthogonal between open-ended and MC for the same concept → causal-across-formats does not imply format-invariant representation; FVs sit at a *lower* abstraction level ("antonym in MC format").
- **MC-with-words (Appendix M):** FV MC clustering survives when outputs are words not letters → the MC effect is genuine format structure, not letter-token artifact.
- **Spanish AmbiguousICL (Appendix N):** English-extracted CVs steer to the Spanish antonym → CVs encode "Antonym" abstractly, supporting the invariance claim; FVs would inject language content.
- **K / α sweeps (Appendix F):** best K is small (1–5) and α around 10–15, showing effects are driven by a handful of heads.

## Failure cases

- CVs are **ineffective zero-shot** and cannot restore a task under activation patching — they require the concept to already be present in context.
- FVs **fail OOD**, especially multiple-choice, and actively inject format tokens (brackets, foreign-language subwords), which would be harmful for cross-format steering.

## Limitations stated by the authors

- CV head selection used a **global** criterion (heads encoding *all* concepts simultaneously); a per-concept RSA might reveal concept-specific heads that were missed.
- They did **not** study how FVs/CVs emerge during training or how they interact at inference; two competing hypotheses (detection/execution coupling vs. independent backup circuit) are left open.

## Additional limitations not emphasized by the authors

- No seeds / no variance / no significance tests on the steering (ΔP, KL) metrics — "more consistent OOD" is descriptive.
- Only relational concepts and two model families; generality to other concept types, modalities, or SAE-derived concepts is untested.
- RSA is a correlational similarity method; the CV "concept" heads are never shown to be *used* by the model behaviorally (they are precisely the ones AP does not pick up), so their functional role at inference remains a hypothesis.
- The steering benchmark is a single bespoke diagnostic (AmbiguousICL), tuned per model, which limits external comparability.

## Reviewer feedback

> [!warning] Review availability
> Reviews for OpenReview `LmLmhb6GEL` are **public** for ICLR 2026 but were **not retrievable** in this session: the OpenReview note/review endpoints returned a `ChallengeRequiredError` (anti-bot challenge). Per CLAUDE.md §24, this section is intentionally left **unfilled rather than fabricated** — no scores, no meta-review, no rebuttal content is inferred. **Action:** fetch reviews via an authenticated/browser session and complete: main positive points, main concerns, questions, author rebuttal, and which concerns were resolved vs. unresolved.

### Main positive points
Not retrieved (see callout).

### Main concerns
Not retrieved (see callout).

### Questions raised by reviewers
Not retrieved (see callout).

### Author rebuttal
Not retrieved (see callout).

### Which concerns were resolved
Not retrieved (see callout).

### Which concerns remained unresolved
Not retrieved (see callout).

## Why it was accepted

> [!note] Interpretation
> The following is an evidence-based inference from the paper itself and its Poster status, **not** an official reason. Reviews were not read.

Plausible factors: (1) a **clean, counterintuitive, falsifiable claim** (FVs are not format-invariant; causality ≠ invariance) that revises a widely-held assumption in the fast-moving function/task-vector literature; (2) **methodologically careful controls** (cross-format patching, MC-with-words, Spanish variant, hypergeometric null) that pre-empt the obvious "it's an artifact" objections; (3) a **timely, well-referenced** positioning against Todd et al. 2024, Yang et al. 2025, and single-circuit ICL theories (Bu et al. 2025); (4) breadth across **four models up to 72B**. The modesty of the framing (CVs are not pitched as beating FVs) likely helped credibility.

## Why it may have been rejected

Not applicable (accepted, Poster).

## Novelty analysis

### What is genuinely new
Using **RSA over concept-vs-format design matrices to localize invariant "Concept Vector" heads**, and the explicit empirical **dissociation** between causal (AP/FV) and invariant (RSA/CV) heads — i.e., the causality≠invariance thesis for ICL task/function vectors, plus the finding that same-concept FVs are near-orthogonal across formats.

### What is adapted from prior work
Function Vectors and activation patching / AIE (Todd et al. 2024; Hendel et al. 2023). RSA is standard from systems neuroscience (Kriegeskorte 2008). Steering-by-addition to the residual stream is standard. The AmbiguousICL competing-concept setup builds on ICL task-vector evaluation traditions.

### What is mostly engineering or scaling
Applying the pipeline across four models and three formats is careful but standard engineering; no new architecture or training.

### Closest prior papers
Todd et al. 2024 (Function Vectors); Hendel et al. 2023 (task vectors); Yin & Steinhardt 2025 (which heads matter for ICL / FV-heads); Yang et al. 2025 (emergent symbolic mechanisms / symbol-abstraction heads); Hernandez et al. 2024 (linearity of relation decoding); Bu et al. 2025 (single function-vector retrieval theory, which this paper argues is incomplete).

## Competitor analysis

### Direct competitors
Function/task-vector work that treats these vectors as portable concept encodings (Todd et al. 2024; Hendel et al. 2023) — this paper is a corrective to that framing. Symbol-abstraction-head work (Yang et al. 2025) competes on the "abstract, invariant representation" narrative.

### Indirect competitors
Steering-vector / activation-steering methods broadly (concept/steering directions from contrastive activations, SAE feature steering) — they share the goal of format-robust concept control that CVs target, via different constructions.

### Complementary methods
SAE / dictionary-learning concept features (a different route to invariant concepts that could be cross-checked against CV heads); the encoder/decoder view of ICL (Han et al. 2025) and detection/execution feature findings (Lindsey et al. 2025) that the authors propose as mechanisms linking CVs and FVs.

## Author and lab context

- **Claire E. Stevenson** (University of Amsterdam) — senior author / PI; grant on analogical reasoning ("Why do children excel where AI models fail?", NWO 406.22.GO.029); research program on analogy, abstraction, and human-vs-model reasoning. This paper sits squarely in that program.
- **Gustaw Opiełka** (University of Amsterdam) — corresponding/first author (g.j.opielka@uva.nl); early-career (low public citation footprint at time of writing). **[Fact: corresponding author; Inference: likely PhD student in Stevenson's group.]**
- **Hannes Rosenbusch** (University of Amsterdam) — co-author; ML / social-psychology methods background.
- This appears to be a **focused cognitive-science-flavored interpretability program** (analogy/abstraction in LLMs and humans), not a large industrial interpretability lab. Compute via LUMI/SURF (EU public HPC).

## Strategic value for our work

- **Borrow:** the **RSA-with-design-matrices invariance test** (concept DM vs. format DM) as a standard diagnostic for any "concept direction" we claim; the **cross-format / cross-language control** design (extract in one format, apply in another) to prove format-invariance rather than assume it; the **causality-vs-representation separation** as a framing device (a working steering vector ≠ the model's concept).
- **Avoid:** claiming a steering vector "is" the concept representation without an invariance test; reporting steering wins without OOD-format checks; single-format activation-patching as evidence of concept encoding.
- **Baseline we likely need:** for concept-steering claims, report **both** an AP/AIE-selected (causal) and an RSA-selected (invariant) head set, and both ID and OOD (format/language) transfer — this pair is now an expected comparison.
- **Evaluation protocol to replicate:** Concept-RSA / question-type-RSA scoring, top-K head-overlap with a hypergeometric null, and the AmbiguousICL ΔP + KL-consistency evaluation.
- **Claims this blocks:** "function/task vectors are format-invariant concept representations" and "RSA-selected invariant heads (CVs) are distinct from causal ICL heads" are now taken; also the causality≠invariance framing for ICL vectors.
- **Gap still open:** (1) whether CV heads are *causally used* in normal inference (necessity/sufficiency beyond RSA correlation); (2) how FVs/CVs **emerge in training** and **interact at inference** (detection/execution vs. backup-circuit — the authors' two open hypotheses); (3) **per-concept** invariant heads (global criterion missed them); (4) extending invariance testing to **SAE features** and non-relational concepts.
- **Differentiation:** we could supply the **causal validation of invariant (CV-type) directions** and a **training-dynamics / mechanistic-interaction** account that this paper explicitly leaves open, or connect CV heads to SAE-derived concept features.

## Reproducibility assessment

- Code availability: **1** (no code URL found in the arXiv HTML, PDF, or OpenReview forum page as inspected this session; **[Unknown]** whether a repo exists elsewhere).
- Data availability: **3** (concept pairs partly from Todd et al. 2024, partly GPT-4o-generated with described filtering; generated JSONs not confirmed released).
- Hyperparameter detail: **4** (K and α grids, best per model in Table 3, formats, shot counts, layer sweeps all stated).
- Compute transparency: **2** (LUMI/SURF acknowledged; no GPU-hour/wall-clock budget).
- Seed reporting: **1** (none).
- Evaluation clarity: **4** (AIE, RSA, ΔP, KL well-defined; many results only in figures).
- Ease of reproduction: **3** (methods are standard AP + RSA + residual-stream steering on open-weight Llama/Qwen, but 70B/72B needs real compute and no code was found).

## Overall assessment

### Strengths
Clear, falsifiable, and somewhat counterintuitive central claim; strong controls (cross-format patching, MC-with-words, Spanish variant, hypergeometric null) that address the obvious confounds; breadth across four open-weight models to 72B; careful, non-overclaiming framing (dissociation, not "CVs beat FVs").

### Weaknesses
No seeds/variance/significance on steering metrics; correlational RSA for the CV construct without a causal validation that CV heads are used in normal inference; a single bespoke steering task tuned per model; scope limited to relational-concept ICL and two model families; no code found.

### Confidence in assessment
**High** for the method and reported results (full arXiv HTML read end-to-end). **Low** on reviewer dynamics (reviews blocked by anti-bot challenge, not read).

## Key quotations

- "For the same concept, FVs extracted from different input formats (open-ended vs. multiple-choice) are nearly orthogonal, indicating that FVs mix concept with format." (§1)
- "we do not propose CVs as competitors to FVs, but rather highlight a mechanistic dissociation: FVs drive behavior (causality) while CVs represent abstract structure (invariance)." (§5)
- "FVs seem necessary to instantiate a task, while CVs can modulate it once present." (§5)
- "This procedure continued to identify the same FV heads and did not identify CV heads … confirming that FVs are the primary causal drivers regardless of input format." (§2.2.2 / Appendix O)

## Open questions

- Are CV (RSA-selected) heads ever causally used during normal, unsteered inference, or purely representational?
- Do FVs and CVs interact as detection→execution, or is CV a redundant backup circuit (the authors' two hypotheses)?
- Does the causality≠invariance dissociation generalize beyond relational-concept ICL, to non-relational concepts, other tasks, and SAE-level features?
- How do FV/CV heads form during training, and does per-concept RSA reveal a richer set of invariant heads?

## Follow-up papers to read

- Todd et al. 2024 — Function Vectors in Large Language Models (`arXiv:2310.15213`)
- Hendel et al. 2023 — In-Context Learning Creates Task Vectors (`arXiv:2310.15916`)
- Yin & Steinhardt 2025 — Which attention heads matter for in-context learning? (`arXiv:2502.14010`)
- Yang et al. 2025 — Emergent symbolic mechanisms support abstract reasoning in LLMs (`arXiv:2502.20332`)
- Hernandez et al. 2024 — Linearity of relation decoding in transformer LMs (`arXiv:2308.09124`)
- Bu et al. 2025 — Provable in-context vector arithmetic via retrieving task concepts (`arXiv:2508.09820`)
- Han et al. 2025 — Emergence and effectiveness of task vectors: encoder–decoder perspective (`arXiv:2412.12276`)
- Lindsey et al. 2025 — On the biology of a large language model (Transformer Circuits)

## Source log

- Official / OpenReview: https://openreview.net/forum?id=LmLmhb6GEL (ICLR 2026 Poster; keywords: mechanistic interpretability, LLMs, attention heads, in-context learning, concept invariance; Submission #20082; reviews public but **not retrieved** — ChallengeRequiredError this session)
- arXiv (full text read, HTML): https://arxiv.org/html/2602.22424v1 (also https://arxiv.org/abs/2602.22424 ; DOI https://doi.org/10.48550/arxiv.2602.22424)
- alphaXiv mirror: https://www.alphaxiv.org/abs/2602.22424
- Code: none found this session (no repository linked in arXiv HTML/PDF or OpenReview forum page)
- Other: OpenReview PDF https://openreview.net/pdf?id=LmLmhb6GEL
