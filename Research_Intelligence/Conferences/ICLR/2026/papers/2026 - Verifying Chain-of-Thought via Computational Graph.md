---
title: "Verifying Chain-of-Thought Reasoning via Its Computational Graph"
year: 2026
conference: ICLR
status: accepted
presentation_type: oral
relevance: tier-1
primary_topics:
  - mechanistic interpretability
  - chain-of-thought reasoning
  - attribution graphs
  - transcoders
  - circuit analysis
authors:
  - Zheng Zhao
  - Yeskendir Koishekenov
  - Xianjun Yang
  - Naila Murray
  - Nicola Cancedda
institutions:
  - FAIR at Meta
  - University of Edinburgh
paper_url: "https://openreview.net/forum?id=CxiNICq0Rr"
openreview_url: "https://openreview.net/forum?id=CxiNICq0Rr"
arxiv_url: "https://arxiv.org/abs/2510.09312"
code_url: "https://github.com/facebookresearch/CRV"
project_url: "https://huggingface.co/facebook/crv-8b-instruct-transcoders"
review_visibility: public
reading_status: complete
last_updated: 2026-07-17
tags:
  - conference/iclr
  - year/2026
  - topic/mechanistic-interpretability
  - topic/chain-of-thought
  - topic/attribution-graphs
  - topic/transcoders
  - topic/circuit-analysis
  - status/accepted
  - presentation/oral
  - relevance/tier-1
---

# Verifying Chain-of-Thought Reasoning via Its Computational Graph

## One-sentence summary

CRV (Circuit-based Reasoning Verification) is a white-box method that replaces an LLM's MLPs with trained TopK transcoders, builds a per-step attribution graph over the resulting sparse features, extracts hand-crafted **structural** features of that graph ("structural fingerprints"), and trains a gradient-boosting classifier on them to predict whether each Chain-of-Thought step is correct — beating black-box and gray-box verifiers, showing error signatures are domain-specific, and demonstrating (via single-feature clamp/amplify interventions) that the identified features are causally implicated in the errors.

## Why this paper matters

**Fact:** It is the first work to operationalize transcoder-based **attribution graphs** (the Anthropic "circuit tracing" / "biology of an LLM" lineage) into a *quantitative, supervised* verification signal, rather than using them for qualitative case-study inspection. This matters for our program because: (1) it converts the Anthropic circuit-tracing methodology into a measurable downstream task with AUROC/AUPR/FPR@95 numbers, giving the whole "attribution graph" agenda an evaluation harness; (2) it sits at the **intersection of mechanistic interpretability and CoT faithfulness/monitoring**, two areas reviewers increasingly want connected; (3) it ships open transcoders for Llama-3.1-8B-Instruct plus step-level labeled reasoning datasets, i.e. reusable infrastructure. **Inference:** As an ICLR 2026 Oral from FAIR, it is likely to become a canonical reference point for "can we read reasoning errors off the circuit?" and a baseline/positioning anchor for circuit-level CoT verification.

## Research problem

Existing CoT verification is either **black-box** (operates on generated text / final logits: MaxProb, perplexity, entropy, temperature scaling, energy) or **gray-box** (operates on raw activations / hidden-state trajectories: linear probes, Chain-of-Embedding, CoT-Kinetics). Both can detect *that* an internal state correlates with an error but cannot explain *why* the computation fails. The problem: verify the correctness of an individual reasoning step by inspecting the **computational process** that produced it, treating the attribution graph as an "execution trace."

## Motivation

- **Scientific:** If models implement latent algorithms via specialized subgraphs (circuits; Olah et al. 2020, Elhage et al. 2021), then a reasoning failure is a *flaw in executing a latent algorithm*, not merely an anomalous activation vector. Diagnosing it should require inspecting the trace, analogous to examining an execution trace in classical software debugging.
- **Practical:** Reasoning models (o1, DeepSeek-R1) are central but their CoT is sometimes unfaithful/flawed (Turpin, Arcuschin, Chen, Lindsey et al.); reliable step-level verification is valuable for debugging and monitoring.
- **Gap in prior work:** Prior transcoder/attribution-graph work (Ameisen et al. 2025; Lindsey et al. 2025) used graphs for *qualitative* faithfulness inspection; no prior work extracted quantitative structural features from these graphs to *automatically* verify reasoning. Text-only step datasets (PRM800K, REVEAL) are incompatible because they lack the model's internal computational trace.

## Core hypothesis

**Fact (stated):** Attribution graphs of correct CoT steps, viewed as execution traces of the model's latent reasoning circuits, possess **distinct structural fingerprints** from those of incorrect steps, and these fingerprints carry a detectable, verifiable signal of reasoning error.

## Objective

Learn a diagnostic classifier `ŷ_i = f_θ(x_i)` where `x_i = φ(G_i)` is a fixed-size structural feature vector extracted from the attribution graph `G_i` of reasoning step `s_i`, and `ŷ_i ∈ {correct, incorrect}`. The **incorrect** label is treated as the positive class (goal = error detection). Upstream, the transcoders themselves are trained to emulate each MLP: minimize L2 reconstruction of the MLP output under a TopK sparsity constraint (`f(x) ≈ MLP(x)`).

## Core idea

Intuition: make the model interpretable by forcing every MLP's computation through a sparse, meaningful bottleneck (a transcoder); then draw the causal wiring diagram of a single reasoning step (the attribution graph); then treat "what does the wiring diagram *look like*" (its topology, node activations, influence distribution) as a fingerprint that distinguishes sound from flawed computation. A simple tabular classifier reads the fingerprint.

Mechanism: a 4-stage pipeline — (1) MLP→transcoder replacement to create an interpretable surrogate model; (2) per-step attribution graph via greedy backward path-finding from the logits; (3) prune the graph and extract ~three families of structural features; (4) gradient-boosting classifier on those features.

## Method

### Inputs
Llama-3.1-8B-Instruct residual-stream activations; specifically, for each MLP the transcoder takes the **residual stream before the MLP block** and reconstructs the **residual stream after the MLP**. For classification, the input is the structural feature vector `x_i` of a step's attribution graph.

### Outputs
Per-step binary correctness prediction (`correct` / `incorrect`) with a score usable for AUROC/AUPR/FPR@95.

### Architecture
- **Transcoders (per-layer, "PLTs"):** single hidden layer, ReLU, **TopK** activation with `k = 128`; input dim 4096 (Llama MLP hidden dim); overcomplete latent dim **131,072**; decoder weights unit-normalized; encoder/decoder untied; dead-feature revival auxiliary loss (coeff 1/32) if a feature is silent for 10M tokens. One transcoder per MLP layer replaces that MLP in the forward pass.
- **Attribution graph:** nodes = disjoint union of input tokens, active transcoder features, and output logits; directed weighted edges = high-attribution causal pathways; built with the `circuit-tracer` implementation (Hanna et al. 2025) of Dunefsky et al. (2025) / Ameisen et al. (2025) methodology. Hyperparameters: max 4096 feature nodes, attribution from ≤10 logit nodes (cumulative prob 0.95), backward batch size 16.
- **Classifier:** Gradient Boosting Classifier (scikit-learn defaults) on the structural feature vector; also benchmarked vs Logistic Regression, Random Forest, Dummy.

### Training objective
Transcoders: L2 reconstruction of MLP output + TopK sparsity (+ dead-neuron aux loss). Classifier: supervised gradient boosting on step-level correctness labels.

### Data construction
Three datasets of `(text, label, computational trace)` tuples generated from the target model itself:
- **Synthetic Boolean** and **Synthetic Arithmetic**: procedurally generated expressions (operators `n ∈ {3,5,7,10}`), CoT generated by Llama-3.1-8B-Instruct, split into steps by regex. Labels via a two-pronged protocol — (a) Llama-3.3-70B-Instruct LLM-as-judge, and (b) programmatic state verification (re-prompt the model to output the simplified expression, evaluate ground truth) — keeping only steps where both agree.
- **GSM8K**: official test split, natural-language steps, labeled by the validated LLM-as-judge pipeline only.
- **Strict truncation policy:** for each chain, retain steps only up to and including the **first incorrect step** (to avoid ambiguous "correct calculation on a corrupted path").

### Inference procedure
For a step: run the transcoder-infused model to the step's final token ("After" position beats "Before"; Table 15), build + prune the attribution graph (retain nodes/edges accounting for ~80% of influence to the logits), extract features, classify.

### Computational requirements
Transcoder training: 10B-token subset of RedPajama-V2, 4 epochs, AdamW, lr 7e-5, warmup 0.5, batch 4096, on **4 nodes × 8 NVIDIA H200 GPUs**; loss saturates ~4,000 steps. **Fact (author-stated):** the full pipeline is "orders of magnitude more resource-intensive" than black/gray-box verifiers and is positioned as a scientific instrument, not a production verifier.

## Experimental design

### Models
Single model: **Llama-3.1-8B-Instruct** (instruction-tuned chosen for reliable CoT elicitation), modified with the trained transcoders. Judge: Llama-3.3-70B-Instruct.

### Layers or activation sites
All MLP layers replaced by transcoders (32 layers). Attribution graphs span all layers; a layer-wise feature histogram is one of the structural features. LR-probe baseline layer chosen per-dataset (Boolean = layer 0, Arithmetic = layer 9, GSM8K = layer 0).

### Datasets
Synthetic Boolean (126,624 steps, 0.2% incorrect), Synthetic Arithmetic (155,434 steps, 1.2% incorrect), GSM8K (8,737 steps, 6.6% incorrect). 80/20 train/test split for synthetic.

### Baselines
- **Black-box:** MaxProb, Perplexity, Entropy, Temperature Scaling, Energy.
- **Gray-box:** Chain-of-Embedding (CoE-R, CoE-C), CoT-Kinetics (γ=0.8), Logistic-Regression probe on average hidden state.

### Metrics
AUROC, AUPR, FPR@95 (incorrect = positive class).

### Controls
Dummy classifier (≈50 AUROC) confirms signal is non-trivial. Human validation of LLM-judge labels (4 annotators, ~700 steps): human-human κ=0.42 / 87.3% agreement; human-vs-judge κ=0.26 / 84.1% agreement (κ depressed by extreme class imbalance).

### Ablations
- **Leave-one-out feature family** (Arithmetic): drop Global / Node / Topological.
- **Attribution position** (Before vs After the step).
- **Transcoder training data** (Base vs +Instruction-Tuning data on LMSYS-Chat-1M).
- **Classifier choice** (Dummy / LR / RF / GBC).
- **Difficulty scaling** on Arithmetic (`n ∈ {5,7,10}`).
- **Cross-domain transfer** (train on one dataset, test zero-shot on the others).

### Statistical testing
Per-feature separations in the "fingerprint" figures are independent t-tests, `p < 0.001`, with medium-to-large Cohen's d. Main verification-table results report **no confidence intervals / no seed variance**.

### Number of seeds
Not reported for the headline verification metrics (single split). **Additional limitation (not emphasized by authors).**

## Main results

**Fact — Table 1 (AUROC / AUPR / FPR@95, incorrect = positive):**

| Dataset | Best baseline (AUROC) | CRV AUROC | CRV FPR@95 |
|---|---|---|---|
| Synthetic Boolean | MaxProb 58.81 | **75.87** | 79.17 (vs 88.42 best baseline) |
| Synthetic Arithmetic | Energy 76.45 | **92.47** | 37.09 (vs 63.33 best baseline CoE-C) |
| GSM8K | Energy 62.55 | **70.17** | 79.61 |

- CRV **consistently beats every black-box and gray-box baseline on every dataset and metric**; the gap is largest on structured synthetic tasks (Arithmetic AUROC 92.47 vs 76.45; AUPR 28.92 vs 5.59).
- **Difficulty (Fig 2):** CRV keeps a consistent advantage as operator count rises (`n = 5,7,10`); most baselines are flat.
- **Cross-domain (Table 2):** error fingerprints are **highly domain-specific** — transfer degrades sharply, often below the best training-free baseline (e.g., train-Arithmetic → test-GSM8K = 57.04 AUROC, below Energy's 62.55; train-GSM8K → test-Boolean = 45.77, below chance-ish).
- **Feature-family ablation (Table 3, Arithmetic):** **Node Influence & Activation** features are most critical (removal: AUROC 92.47→88.31, FPR@95 +12 pts); Global Stats next; Topological least critical for this task; all three together are best.
- **Attribution position (Table 15):** "After" (final token of current step) beats "Before" across nearly all metrics (Arithmetic 92.47 vs 85.95).
- **Instruction-tuning transcoders (Table 14):** fine-tuning transcoders on LMSYS-Chat-1M gives **no consistent improvement** over base transcoders (consistent with Kissane et al. 2024 that base-model SAEs transfer to chat models).
- **Classifier (Table 16):** Logistic Regression is surprisingly competitive (best AUROC on 2/3 datasets, best on GSM8K); Random Forest best AUPR/FPR@95 on Arithmetic; no single classifier dominates — GBC chosen for robustness.
- **Causal interventions (RQ3, Tables 4 & 17):** two proof-of-concept case studies on Arithmetic. (a) **Suppression:** clamping a single last-layer "multiplication" transcoder feature (ID 91814) to zero fixes an order-of-operations error `7*((5+9)+7)` (98→correct path to 147). (b) **Amplification:** boosting a multiplication feature fixes a unary-minus parsing error `-(5+(4*9))` (−42→−41). Both restore correct reasoning.

## What the results genuinely demonstrate

- **Fact:** The topology + node statistics + global summary of a transcoder-based attribution graph carry a **strong, supervisedly-recoverable** signal of step correctness that exceeds all tested output- and activation-based verifiers on this model and these three tasks.
- **Fact:** Correct vs incorrect steps are separable in the structural-feature space (PCA/t-SNE; per-feature t-tests p<0.001, medium-large effect); incorrect steps form a dense subset within the correct-step distribution ("near misses"), with a "zone of computational integrity" occupied only by correct steps.
- **Inference (supported):** Two single-feature interventions changed the reasoning trajectory in the predicted direction, providing **closed-loop causal evidence** that at least *some* identified features are causally implicated, not merely correlated.

## What the results do not demonstrate

- **Not** shown to generalize across models/scales/architectures — a **single model** (Llama-3.1-8B-Instruct) only; MoE, 70B+, non-Llama untested (author-acknowledged).
- **Not** a practical verifier — explicitly too compute-heavy; positioned as a scientific instrument.
- The causal claim rests on **two hand-picked case studies** on the arithmetic task, not a systematic, quantified intervention success rate over many errors. This is exploratory (RQ3 described as "exploratory study").
- Cross-domain results show the signatures are **not** universal fingerprints of "flawed reasoning" — they are task-specific, so the method does not (yet) recover a domain-invariant notion of computational error.
- No seed/variance on the main table ⇒ "significant leap" is descriptive, not backed by a stated significance test on the verification metrics.
- Extreme class imbalance (0.2% / 1.2% incorrect on synthetic) makes AUPR very low on Boolean (0.97) and stresses the reliability of the positive-class estimates.

## Strongest evidence

The synthetic Arithmetic result (AUROC 92.47 vs best baseline 76.45; AUPR 28.92 vs 5.59; FPR@95 37.09 vs 63.33), combined with the difficulty-scaling robustness (Fig 2) and the leave-one-out ablation localizing the signal to node-influence features. The controlled ground truth (programmatic + LLM-judge agreement) makes the labels trustworthy here.

## Weakest evidence

The **causal intervention** claim (RQ3): two qualitative single-feature edits on cherry-picked arithmetic expressions. Compelling as proof-of-concept but far from establishing that CRV's structural signatures are *systematically* causal. Also the GSM8K numbers (AUROC 70.17) are much weaker than synthetic, and cross-domain transfer to GSM8K falls below baselines.

## Important ablations

- **Node Influence & Activation is the dominant feature family** → the *state of key local features* matters more than holistic topology for arithmetic error detection.
- **"After" > "Before" attribution position** → the executed step's final-token trace consolidates the failure evidence better than the pre-computation/planning state.
- **IT-data transcoders don't help** → base-model transcoders suffice even for an instruct model (SAE/transcoder base→chat transfer).
- **LR competitive with GBC** → the *features*, not the classifier, carry the signal.

## Failure cases

- Cross-domain transfer collapses (some settings below chance / below simple baselines).
- GSM8K (real-world NL) markedly harder than synthetic.
- Boolean AUPR near-floor due to 0.2% positive rate.
- Error-propagation ambiguity forced a strict-truncation labeling policy (discarding post-first-error steps), i.e., the clean task is a simplification of real CoT verification.

## Limitations stated by the authors

- **Computational intensity** — not a drop-in/real-time verifier.
- **Aggregative, not semantic** — the classifier uses statistical/topological graph features, not the *meaning* of individual transcoder features (no symbolic reasoning over feature semantics yet); flagged as an opening for neuro-symbolic verifiers.
- **Generalizability** — single family (Llama-3.1, 8B); MoE / larger scales / other architectures open; signatures are domain-specific.
- **Fidelity of interpretability tools** — transcoders are one possible sparse basis; attribution is an incomplete approximation of true information flow.

## Additional limitations not emphasized by the authors

- No seeds / no variance on the headline verification metrics.
- Causal evidence limited to two curated examples; no quantified intervention success rate, no negative controls on interventions (e.g., clamping random features).
- GSM8K labels rely solely on a 70B LLM-judge with only fair κ vs humans (0.26) — real-world label quality is weaker than the synthetic ground truth.
- The "reasoning error" construct is entangled with the truncation policy and severe class imbalance; the operationalization may not match production error distributions.

## Reviewer feedback

> [!note] Review availability
> Reviews for `CxiNICq0Rr` are **public on OpenReview** (ICLR 2026), but the OpenReview `/notes` and `/pdf` endpoints returned an anti-bot **ChallengeRequiredError** in this session, so reviewer texts, scores, and the meta-review were **not retrieved**. This section is intentionally left unfilled rather than fabricated. **Action:** fetch reviews via an authenticated/browser session and complete: positive points, concerns, questions, rebuttal, resolved/unresolved. (Per CLAUDE.md §24.)

## Why it was accepted

> [!note] Interpretation
> Evidence-based inference from the paper + its Oral status, not an official reason. Reviews not yet read.

Plausible factors: (1) a **novel, clearly-framed contribution** — first to turn transcoder attribution graphs into a quantitative, supervised verification signal; (2) rides two timely waves at once (Anthropic circuit-tracing lineage + CoT faithfulness/monitoring); (3) a genuinely *white-box* narrative with a memorable "execution trace / structural fingerprint" framing and a causal-intervention payoff; (4) careful data engineering (dual-verified labels, human validation, truncation policy) that reviewers reward; (5) strong open-source release (code + Llama-3.1-8B transcoders + labeled datasets on HuggingFace). Oral selection likely rewards the crisp conceptual story and FAIR/community relevance.

## Why it may have been rejected

Not applicable (accepted, Oral).

## Novelty analysis

### What is genuinely new
Operationalizing **attribution graphs as quantitative verification features** — defining a graph-structural "fingerprint" (`φ(G_i)`) of a reasoning step and training a classifier on it — plus the accompanying `(text, label, computational trace)` step-level datasets and the domain-specificity finding.

### What is adapted from prior work
Transcoders (Dunefsky et al. 2025); per-layer transcoders + attribution graphs / circuit tracing (Ameisen et al. 2025; Lindsey et al. 2025 — Anthropic Transformer Circuits); `circuit-tracer` tooling (Hanna et al. 2025); TopK-SAE training practices (Gao et al. 2025); LLM-as-judge labeling; standard black/gray-box verifiers as baselines (CoE, CoT-Kinetics, energy/OOD scores).

### What is mostly engineering or scaling
Training the full transcoder suite for Llama-3.1-8B (131k-wide, k=128, all layers) at scale; graph extraction pipeline; tabular feature engineering. Real but incremental on top of existing methodology.

### Closest prior papers
Ameisen et al. 2025 ("Circuit tracing") and Lindsey et al. 2025 ("On the biology of a large language model") — same attribution-graph machinery, but *qualitative* faithfulness inspection; Dunefsky et al. 2025 (transcoder feature circuits). CRV is the quantitative/supervised operationalization of these.

## Competitor analysis

### Direct competitors
Other CoT step verifiers: Process Reward Models (Lightman et al. 2024; Math-Shepherd; rStar-Math), gray-box self-verification probes (Zhang et al. 2025 "Reasoning models know when they're right"), Chain-of-Embedding (Wang et al. 2025a), CoT-Kinetics (Bi et al. 2025). CRV competes on the *mechanistic/white-box* axis specifically and beats these training-free/probe methods on its own benchmark.

### Architectural / objective-level competitors
SAE-based (rather than transcoder-based) circuit analyses of reasoning; activation-probing faithfulness monitors (Baker et al. 2025 CoT monitoring). Different route to the same "is this reasoning sound?" goal.

### Evaluation competitors
Text-only step benchmarks (PRM800K, REVEAL, Jacovi et al. 2024) — CRV argues these are incompatible with white-box analysis and introduces its own trace-carrying datasets.

### Complementary methods
Better SAEs/transcoders, more faithful attribution methods, and neuro-symbolic classifiers over feature semantics would all directly strengthen CRV. Could stack with PRMs (structural signal as an extra feature).

## Author and lab context

- **Nicola Cancedda** (FAIR at Meta) — senior/corresponding; recurring program on LLM reliability/interpretability (e.g., Ji et al. 2025 "Calibrating verbal uncertainty as a linear feature to reduce hallucinations"). Central research program.
- **Zheng Zhao** (University of Edinburgh; work done during a FAIR internship) — co-lead/first author (edinburgh email as correspondence).
- **Yeskendir Koishekenov, Xianjun Yang, Naila Murray** (FAIR at Meta) — Yang has prior SAE-for-data-selection work (Yang et al. 2025); Murray is a senior FAIR researcher.
- **Inference:** This is a **coordinated FAIR interpretability/reliability effort**, not a one-off, connecting to Meta's broader hallucination/uncertainty/faithfulness line. Author reputation is context, not evidence of correctness.

## Strategic value for our work

- **Borrow:** the "attribution-graph → structural fingerprint → tabular classifier" pattern is a cheap, reusable evaluation harness for *any* circuit-level property (not just correctness); the dual-verified (programmatic + LLM-judge) labeling + strict truncation policy is a clean template for step-level datasets; the "After > Before" attribution-position finding.
- **Avoid:** shipping causal claims on 2 cherry-picked interventions and a single model — reviewers will now expect quantified intervention success rates and multi-model coverage.
- **Baselines we likely need:** CRV joins CoE, CoT-Kinetics, PRMs, and hidden-state probes as a mandatory comparison for any CoT-verification or circuit-faithfulness claim.
- **Evaluation protocol to replicate:** AUROC/AUPR/FPR@95 with incorrect-as-positive; leave-one-out feature-family ablation; cross-domain transfer as a generalization stress test.
- **Claims this blocks:** "first to verify reasoning from its computational graph" and "attribution-graph structure predicts step correctness" are now taken.
- **Gaps still open (opportunities):** (1) **domain-invariant** error signatures / domain adaptation for circuit verifiers; (2) **semantic/feature-level** (neuro-symbolic) classifiers over transcoder feature meanings rather than aggregate stats; (3) **scaling** to 70B+ / MoE / reasoning-native models (o1/R1-style) with backtracking; (4) **systematic, quantified causal interventions** with negative controls; (5) a **cheaper** approximation that makes circuit verification practical; (6) faithfulness-aware transcoders/attribution to raise resolution.
- **Differentiation:** provide the multi-model scaling + quantified causality + domain-general signatures this paper lacks, or move from aggregate graph stats to semantic feature-level verification.

## Reproducibility assessment

- Code availability: **5** (official `facebookresearch/CRV`).
- Data availability: **5** (labeled datasets on HuggingFace `facebook/crv`; GSM8K/RedPajama-V2/LMSYS public).
- Hyperparameter detail: **5** (transcoder k=128, 131,072 latents, lr 7e-5, 4 epochs, batch 4096, aux-loss coeff 1/32; graph hyperparams; classifier = sklearn defaults — all stated).
- Compute transparency: **4** (4×8 H200 nodes, ~4,000-step saturation given; total GPU-hours not itemized).
- Seed reporting: **2** (per-feature t-tests reported; no seeds/CIs on main verification metrics).
- Evaluation clarity: **4** (metrics well-defined; some results only in figures/appendix).
- Ease of reproduction: **3** (released artifacts help a lot, but full pipeline needs multi-node H200-scale transcoder training + a forked circuit-tracer for TopK transcoders).

## Overall assessment

### Strengths
Genuinely novel operationalization of circuit-tracing into quantitative verification; strong, well-controlled synthetic results; careful labeling + human validation; informative ablations (feature families, attribution position, IT-data, classifier); closed-loop causal proof-of-concept; excellent open-source release; timely at the MI × CoT-faithfulness intersection.

### Weaknesses
Single 8B model; domain-specific (non-transferable) signatures; causal claim from 2 case studies; no seeds/CIs on headline metrics; aggregative (non-semantic) features; extreme class imbalance; explicitly impractical compute cost.

### Confidence in assessment
**High** on method/results as reported (full arXiv text + appendices read; code/artifacts confirmed). **Low** on reviewer dynamics (reviews not retrieved this session).

## Key quotations

- "We hypothesize that attribution graphs of correct CoT steps, viewed as execution traces of the model's latent reasoning circuits, possess distinct structural fingerprints from those of incorrect steps." (Abstract)
- "a reasoning failure is not merely an erroneous state, but a flaw in the execution of a latent algorithm... akin to examining an execution trace in classical software." (§1)
- "CRV's learned error fingerprints are highly domain-specific... the performance of CRV drops substantially compared to in-domain and often falls below the strongest training-free baseline." (§4.2)
- "with the premature multiply impulse suppressed, the model correctly generated the next step 14+7=21 and proceeded to the correct final answer." (§4.4)
- "CRV in its current form is positioned as a scientific tool for deep analysis, not as a scalable, real-time verifier for production systems." (§11)

## Open questions

- Do structural error signatures exist at 70B+ scale, on MoE, and on reasoning-native models with search/backtracking?
- Can a domain-invariant "computational failure" signature be learned (or is error fundamentally task-shaped)?
- What is the *quantified* causal intervention success rate across many errors, with negative controls?
- Does moving from aggregate graph stats to feature-*semantic* classification (neuro-symbolic) improve accuracy and generalization?
- How much can the pipeline be cheapened before the signal degrades?

## Follow-up papers to read

- Ameisen et al. 2025 — Circuit tracing: revealing computational graphs in language models (Transformer Circuits)
- Lindsey et al. 2025 — On the biology of a large language model (Transformer Circuits)
- Dunefsky et al. 2025 — Transcoders find interpretable LLM feature circuits (NeurIPS)
- Hanna et al. 2025 — `circuit-tracer` (safety-research)
- Gao et al. 2025 — Scaling and evaluating sparse autoencoders (ICLR)
- Zhang et al. 2025 — Reasoning models know when they're right: probing hidden states for self-verification (COLM)
- Wang et al. 2025a — Latent-space Chain-of-Embedding for output-free self-evaluation (ICLR)
- Bi et al. 2025 — CoT-Kinetics (`arXiv:2505.13408`)
- Baker et al. 2025 — Monitoring reasoning models for misbehavior (`arXiv:2503.11926`)
- Lightman et al. 2024 — Let's verify step by step (PRM800K; ICLR)

## Source log

- Official / OpenReview: https://openreview.net/forum?id=CxiNICq0Rr (Oral; reviews public but **not retrieved** this session — ChallengeRequiredError)
- OpenReview PDF: https://openreview.net/pdf/91870c1fe75134b7dc25ff28dc74b4434d060b51.pdf
- arXiv (full text + appendices read): https://arxiv.org/abs/2510.09312 (HTML v1 at https://arxiv.org/html/2510.09312v1)
- Code: https://github.com/facebookresearch/CRV
- Transcoders (model): https://huggingface.co/facebook/crv-8b-instruct-transcoders
- Datasets: https://huggingface.co/datasets/facebook/crv
- Poster: https://zsquaredz.github.io/assets/pdfs/posters/2026-iclr-poster-crv.pdf
