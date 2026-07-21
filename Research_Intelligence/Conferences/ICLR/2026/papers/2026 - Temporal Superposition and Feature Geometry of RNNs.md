---
title: "Temporal superposition and feature geometry of RNNs under memory demands"
year: 2026
conference: ICLR
status: accepted
presentation_type: oral
relevance: tier-1
primary_topics:
  - superposition
  - representational geometry
  - mechanistic interpretability
  - recurrent neural networks
  - feature geometry
authors:
  - Pratyaksh Sharma
  - Alexandra M. Proca
  - Lucas Prieto
  - Pedro A. M. Mediano
institutions:
  - Imperial College London
  - University College London
paper_url: "https://openreview.net/forum?id=7cMzTpbJHC"
openreview_url: "https://openreview.net/forum?id=7cMzTpbJHC"
arxiv_url: ""
code_url: "https://github.com/kashparty/iclr-rnn-superposition"
project_url: ""
review_visibility: public
reading_status: complete
last_updated: 2026-07-17
tags:
  - conference/iclr
  - year/2026
  - topic/superposition
  - topic/representational-geometry
  - topic/mechanistic-interpretability
  - topic/recurrent-neural-networks
  - status/accepted
  - presentation/oral
  - relevance/tier-1
---

# Temporal superposition and feature geometry of RNNs under memory demands

## One-sentence summary

The paper extends the [[Toy Models of Superposition]] framework from feedforward networks to **time**, introducing "temporal superposition" as the strategy RNNs use to compress a memory window larger than their hidden dimension, and — via an analytic loss decomposition on a linear-recurrence *k*-delay recall task — shows RNNs move between an effectively-linear "dense" regime (smooth forgetting via a spiral sink) and a "sparse" regime that packs old feature directions into a ReLU-created **interference-free space** (sharp forgetting), with a phase transition in feature angular distribution and spectral radius, and confirms the theory generalizes to nonlinear RNNs.

## Why this paper matters

**Fact:** This is a **foundational / theory** paper for superposition and feature-geometry research, and it opens a genuinely new axis — *memory/time as a capacity-constraining pressure* — that the [[Toy Models of Superposition]] (Elhage et al., 2022) program did not consider. Feedforward and transformer superposition studies treat capacity as a spatial quantity (more features than neurons); this paper argues that recurrence adds a *temporal* capacity constraint, because a feature that must be maintained for `k` timesteps occupies `k+1` distinct feature directions in the hidden state.

**Inference:** For a mechanistic-interpretability program this matters because (1) it stakes out the "superposition-through-time" conceptual territory and gives it a clean mathematical object (feature directions `w_s = W_h^s W_x`); (2) it introduces two named interference types (projection vs composition) that are analytically separable and could become standard vocabulary for RNN/SSM interpretability; (3) with SSMs (Mamba-style linear-recurrence models) now widely deployed, a geometric theory of what their hidden states store is directly relevant to interpreting them; and (4) it bridges ML interpretability and computational neuroscience (working memory, serial recall), broadening the audience and citation base.

## Research problem

How do **memory demands** (how long information must be retained) shape the **representational geometry** and **capacity** of recurrent networks? Concretely: when an RNN's hidden state cannot simultaneously hold all task-relevant features across a memory window, what geometric strategy does it learn, and how does that strategy depend on data sparsity, network dimensionality, and the required delay?

## Motivation

- **Scientific:** Superposition is now a central organizing idea in mechanistic interpretability, but prior work studied it almost exclusively in feedforward/transformer settings. Time is an unstudied, additional capacity pressure. There is also a broader complaint (cited via Sharkey et al., 2025 "Open problems in mechanistic interpretability") that the field has focused on *extracting* features and under-studied the *geometry* superposition induces.
- **Practical:** Linear-recurrence SSMs (S4, LRU, Mamba) are increasingly used for long-range sequence modeling precisely because of memory/compute efficiency; understanding how memory limits force compression bears on their long-range behavior.
- **Neuroscience motivation:** RNNs are standard cognitive models; working memory and serial recall are canonically studied with them. A geometric account connects to activity-slot vs resource theories of working memory.
- **Gap in prior work:** Most RNN theory assumes an over-parameterized regime relative to task demand. Memory capacity work (echo-state networks, Jaeger 2002) typically studies the temporally-*dense* regime. François et al. (2025) studied the k-delay task in an underparameterized *linear* RNN in the frequency domain but only the dense/linear regime — this paper adds the *sparse* regime and *nonlinear* RNNs.

## Core hypothesis

**Fact (as stated):** RNNs exhibit a second, time-specific form of superposition ("temporal superposition") that is *fundamentally different* from spatial superposition: each input feature is represented by a *sequence* of distinct directions indexed by how old the input is (`s = t - i`), and when the task-relevant memory window exceeds the hidden dimension, the network must either forget features or represent more feature directions than dimensions (superposition). The geometry the network chooses is predicted by minimizing an analytic loss that trades task benefit against projection and composition interference.

## Objective

**Fact:** The model is trained on the **k-delay task** (Jaeger, 2002): reproduce the input sequence after a fixed delay of `k` steps, i.e., output `y_t = x_{t-k}` (and `0` for `t ≤ k`), with squared-error loss. The delay `k` is the explicit control knob for *how long* a feature must be maintained (temporal demand). This is an explicit temporal extension of the Elhage et al. (2022) setup, and the two are identical at `k = 0`.

Loss (Eq. 4):
`L = Σ_{t=1..k} ||0 - ŷ_t||² + Σ_{t=k+1..T} ||x_{t-k} - ŷ_t||²`.

Under temporal-independence and Bernoulli(`p`) temporal-sparsity assumptions, the expected linear-RNN loss decomposes (Eq. 5) into four interpretable terms:

1. **Task benefit** — reward for aligning the output feature direction `w_s=k` with the readout `w_y`.
2. **Mean correction** — offsets a non-zero input mean by *exploiting* projection interference as an implicit bias (vanishes if an output bias is added or if mean `µ = 0`).
3. **Projection interference cost** — penalizes feature directions `w_{s≠k}` that project onto the readout at the *wrong* time.
4. **Composition interference** — penalizes positive correlations (and rewards negative/antipodal ones) between the readout-projections of co-active feature directions.

Plain language: the network wants the correct-age feature to point at the readout, and wants all other-age features to *not* be readable at the wrong time — so it spreads feature directions out, ideally into antipodal / destructively-interfering arrangements (echoing Elhage et al. and Saxe et al. 2014 dynamics).

## Core idea

**Intuition:** A feature entering at time `t` doesn't sit still — as time passes it is re-multiplied by the recurrent matrix `W_h`, so it *travels through a trajectory of directions* `w_0, w_1, w_2, …` and fades. Interpretability must therefore track *"when"* as much as *"what"*. Because only directions that project onto the readout `w_y` at the current step affect the output, the network can hide old-but-still-present features in directions that don't project onto `w_y` — and with a ReLU readout, there is an entire *half-space* opposite `w_y` that produces zero output and is therefore "interference-free," a place to dump intermediate/old features cheaply.

**Technical mechanism:** Writing `h_t = Σ_{s=0}^{t-1} W_s x_{t-s}` with `W_s := W_h^s W_x`, each `w_s` is the direction that a `s`-steps-old input occupies. Loss minimization then dictates the geometry: linear RNNs form a **spiral sink** (old features spiral into the origin — smooth forgetting; spectral radius `‖w_{s=0}‖ < 1` is optimal in 2D); SSMs (linear recurrence + ReLU readout) approximate packing large feature directions into the interference-free half-space; nonlinear RNNs (ReLU recurrence + readout) fully exploit it, using the ReLU-induced privileged basis to implement **sharp forgetting** (send a feature to the negative quadrant so it's zeroed next step).

## Method

### Inputs
Scalar (`N_x = 1`) or vector (`N_x = 5`, later up to 10 and 75) input sequences `x_t`, generated as `X_t = B_t U_t` with `B_t ~ Bernoulli(p)` controlling **temporal sparsity** (smaller `p` = sparser) and `U_t` an arbitrary i.i.d. amplitude distribution; features assumed temporally independent.

### Outputs
Predicted `ŷ_t` reproducing the delayed input `x_{t-k}`.

### Architecture
RNN with `h_t = W_x x_t + W_h σ_h(h_{t-1})`, `ŷ_t = σ_y(W_y^T h_t)`. Three regimes by activation choice:
- **Linear RNN**: `σ_h`, `σ_y` linear.
- **SSM** (state space model): linear recurrence, **ReLU readout**.
- **Nonlinear RNN**: ReLU recurrence *and* readout.
Core analysis uses `N_h = 2` (for visualization); extended to `N_h = 5, 10, 100` and `N_x` up to 75. Readout is weight-tied to the output feature direction `w_y := w_{s=k}` in main figures (untied results in Appendix I.2).

### Training objective
Squared-error k-delay loss (Eq. 4). Theory derives the *expected* loss decomposition (linear: Eq. 5; high-sparsity ReLU-readout approximation: Eq. 6).

### Data construction
Synthetic sequences with controllable temporal sparsity `p` and delay `k`; temporal independence assumed (Appendix A). Setting `p = 1` recovers a generic i.i.d. process; `k = 0` recovers pure spatial superposition (Elhage et al.).

### Inference procedure
Not a deployed model — analysis measures learned geometry: output projections `w_y^T w_s`, the projection matrix `W_y^T W_s` (higher-dim), the angle `kθ` traversed from `w_{s=0}` to `w_{s=k}`, and spectral radius `ρ = ‖w_{s=0}‖`.

### Computational requirements
**Inference:** Small toy models (2-D hidden states dominate; largest reported `N_h = 100`, 75 features), so compute is minimal. No large-scale training. (Code is Jupyter notebooks.)

## Experimental design

### Models
Linear RNN, SSM (linear recurrence + ReLU readout), nonlinear RNN (ReLU recurrence + readout).

### Layers or activation sites
Single recurrent hidden state; feature directions `w_s = W_h^s W_x` and readout `w_y` are the analyzed "sites."

### Datasets
Synthetic k-delay sequences; temporal sparsity `p` and delay `k` swept.

### Baselines
The paper is theory-first: the "baseline" is the **analytic expected loss** (Eq. 5), against which empirical training curves are matched; and the `k = 0` case reduces to Elhage et al. (2022) spatial superposition as a sanity check. Comparison across the three architecture regimes (linear / SSM / nonlinear) is the main contrast.

### Metrics
Empirical vs expected loss agreement; per-feature output projection `w_y^T w_s` over training; final `w_s` geometry (spiral / packed); angle `kθ`; spectral radius `ρ`; `mean(W_y^T W_{s≠k})` (should be negative) and `mean(diag(W_y^T W_{s=k}))` (should be positive) in higher dimensions.

### Controls
`k = 0` control recovering pure spatial superposition; weight-tying vs untied readout (Appendix I.2); analysis of how many trained models develop the predicted geometry (Appendix I.1).

### Ablations
Vary temporal sparsity `p` (dense↔sparse, revealing the phase transition); vary delay `k` (memory demand); vary hidden size `N_h ∈ {2,5,10,100}`; vary input dimensionality `N_x` (introduce spatial superposition, `N_x = 5, 10, 75`); random-delay tasks (Appendix H).

### Statistical testing
No conventional significance testing — this is a mechanistic/theoretical study; validation is agreement between derived expected loss and empirical loss, and reproducibility of the predicted geometry across trained models (quantified in Appendix I.1).

### Number of seeds
**Inference:** Multiple trained models are analyzed and the fraction developing the predicted geometry is reported in Appendix I.1 (exact counts in the appendix; not the standard "N seeds ± std" reporting on a headline metric because there is no single headline metric).

## Main results

**Fact:**

- **Loss decomposition predicts geometry.** The four-term expected loss closely matches empirical training loss on the k-delay task; distinct loss-term dynamics map onto identifiable geometric stages: first all `w_s` align to the readout, then they separate in temporal order, producing a "staircase" loss consistent with saddle-to-saddle dynamics.
- **Linear RNNs → spiral sink (smooth forgetting).** In 2-D the optimal linear solution is a spiral sink with spectral radius `‖w_{s=0}‖ < 1`; old features gradually rotate and shrink toward the origin. (Optimality proven in Appendices D.2–D.3.)
- **ReLU readout creates an interference-free half-space.** The high-sparsity approximation (Eq. 6) shows that all `w_s` in the half-space opposite `w_y` contribute *zero* projection interference; SSMs exploit this by packing the *largest* feature directions into that space when sparsity is high.
- **Phase transition (dense → sparse).** As temporal sparsity increases, the angle `kθ` spanned by task-relevant feature directions jumps sharply — from a narrow cone (`≈ 90°`, dense regime, spiral-sink-like) to spreading across `≈ 270°` of the plane (sparse regime, using the interference-free space) — accompanied by a decrease in spectral radius `ρ`.
- **Nonlinear RNNs fully exploit the free space + sharp forgetting.** With ReLU recurrence, the network packs all `k` intermediate features into the interference-free space (often a single quadrant) with only the output feature `w_{s=k}` outside; the ReLU privileged basis lets it *immediately* forget (send to negative quadrant → zeroed next step) rather than only decay.
- **Spatial × temporal tradeoff is "all-or-none".** With vector inputs, as `k` grows the network prioritizes the most important feature(s): at `k=1` it keeps A,B,C and drops D,E; at higher `k` it keeps only A. Because a feature only helps if maintained for *all* `k+1` steps, partial representation is useless — hence all-or-none.
- **Scales to higher dimensions.** For `N_x = 10`, `N_h ∈ {2,5,10}` on the 2-delay task, `W_y^T W_{s=2}` shows a positive diagonal and negative/zero elsewhere as predicted; larger `N_h` simply captures more features along the diagonal. Verified up to `N_h = 100`, 75 features.

## What the results genuinely demonstrate

- In this analytically tractable toy setting, memory demand is a real, quantifiable capacity pressure that reshapes learned geometry, and a simple four-term loss predicts *which* geometry emerges as a function of sparsity, delay, and dimensionality.
- The interference-free half-space is a genuine consequence of a ReLU readout and is empirically exploited by SSMs and nonlinear RNNs.
- There is a bona fide phase transition (in `kθ` and `ρ`) between dense and sparse regimes, not merely a smooth interpolation.
- Linear-recurrence models are provably limited to smooth (spiral) forgetting, while nonlinearity enables sharp forgetting — a concrete, mechanistic distinction between architecture classes.

## What the results do not demonstrate

- **No evidence in realistic/large models.** All results are toy RNNs/SSMs on a synthetic recall task with scalar or low-dim inputs; nothing is shown on trained language SSMs (Mamba) or any real dataset. The claim that "recurrence and memory will exacerbate [superposition]" in LLMs is an *extrapolation*, explicitly flagged as such.
- **Strong data assumptions.** Temporal independence and temporal sparsity (Bernoulli gating) are assumed for tractability; the authors concede temporal sparsity "may be a strong assumption" and its generality is an open question.
- **Task is limited to fixed-delay recall.** Only the k-delay (reproduce-after-delay) task is studied in depth (plus random-delay in Appendix H); tasks requiring *manipulation* of stored information are not covered.
- **Linear representation hypothesis assumed.** The whole feature-direction machinery presupposes features are linear directions; non-linear feature encodings are out of scope.

## Strongest evidence

**Inference:** The tight match between the derived expected loss (four terms) and empirical training curves, *combined with* the fact that each term's dynamics maps onto an observed geometric reconfiguration (align-then-separate, spiral vs packed), is the strongest support: it is not just a fit but a mechanistic explanation whose components are individually interpretable and independently visualized.

## Weakest evidence

**Inference:** The bridge to real models — "our study indicates that recurrence and memory will exacerbate [superposition]" in LLMs/SSMs — rests on citation + analogy (Jelassi et al. 2024 on memory decreasing capacity linearly; superposition demonstrated in LLMs by Bricken/Templeton), not on any experiment in this paper. It is the claim most likely to attract reviewer skepticism about real-world relevance.

## Important ablations

- **Sparsity sweep** is the key ablation: it reveals the dense↔sparse phase transition and is what distinguishes this work from prior dense-regime-only analyses (François et al. 2025).
- **Delay `k` sweep** demonstrates the all-or-none spatial/temporal tradeoff and the growth of feature directions per retained feature (`k+1`).
- **Hidden-size sweep** (`N_h = 2 → 100`) shows the predicted geometry is not an artifact of 2-D and that capacity simply scales the number of features packed along the diagonal.
- **Weight-tying ablation** (Appendix I.2) checks the readout tie `w_y := w_{s=k}` is not driving the conclusions.

## Failure cases

**Fact/Inference:** SSMs (linear recurrence) *cannot* perfectly isolate feature directions into the interference-free space because their `w_s` are constrained to an elliptical spiral — they only *approximate* the ideal by grouping the largest directions; this is a stated limitation of linear-recurrence expressivity, not a bug. In the dense regime the SSM abandons the interference-free strategy entirely (speculated to be due to composition interference: summing large negative-space features with small positive ones can be zeroed by the ReLU).

## Limitations stated by the authors

- Temporal-independence and temporal-sparsity assumptions; small RNNs; 2-D focus for the core analysis.
- Only the k-delay task; manipulation tasks and general varying-memory-demand tasks left to future work.
- Reliance on the linear representation hypothesis.
- Open question of how far the toy setting captures behavior in seemingly over-parameterized modern models.

## Additional limitations not emphasized by the authors

**Inference:**
- No empirical contact with any trained real-world SSM or language model, so the headline "temporal superposition" concept is validated only in a designed toy world where it is almost guaranteed to appear.
- The Bernoulli temporal-sparsity generative model is precisely the regime in which the interference-free-space argument is cleanest; it is unclear whether naturally correlated sequential data (language, video) would produce the same phase transition.
- Composition interference is treated more heuristically (the dense-regime SSM behavior is "speculated") than projection interference, which has the cleaner derivation.

## Reviewer feedback

> [!warning] Review availability
> Reviews for `7cMzTpbJHC` are **public on OpenReview** (this is an ICLR 2026 Oral), but the OpenReview `/notes` and `/pdf` endpoints returned an anti-bot **`ChallengeRequiredError`** in this session, so the review texts, scores, and meta-review were **not retrieved**. This section is intentionally left unfilled rather than fabricated. **Action:** fetch reviews via an authenticated browser session and complete positive points, concerns, questions raised, rebuttal, and resolved/unresolved items. (Per CLAUDE.md §24.)

## Why it was accepted

> [!note] Interpretation
> The following is an evidence-based inference from the paper and its Oral status, not an official reason. Reviews were not read this session.

**Inference:** Plausible factors: (1) it introduces a **genuinely new conceptual axis** (time/memory as a capacity constraint for superposition) with a clean name and clean math, extending a heavily-cited framework (Elhage et al.); (2) the **analytic loss decomposition into interpretable terms** gives the paper theoretical weight rare in interpretability work, and the derived loss *predicts* observed geometry — a satisfying theory↔experiment loop; (3) the **phase transition** result is crisp and quantitative; (4) it **bridges ML interpretability and computational neuroscience** (working memory, serial recall, motor-preparation output-null subspaces), widening its appeal; (5) timely given the rise of linear-recurrence SSMs; (6) code released for full reproducibility. Oral selection likely rewards the conceptual novelty and the clean theoretical narrative.

## Why it may have been rejected

Not applicable (accepted, Oral).

## Novelty analysis

### What is genuinely new
The concept of **temporal superposition**; the **projection vs composition interference** distinction; the four-term analytic loss decomposition for the k-delay task; identification of the **ReLU interference-free space** and the **dense↔sparse phase transition** (in `kθ` and spectral radius); the smooth (linear/spiral) vs sharp (nonlinear/ReLU) forgetting dichotomy; and the analysis of the **spatial × temporal superposition tradeoff**.

### What is adapted from prior work
The toy-model / linear-representation-hypothesis framing and the sparse-feature setup are directly from Elhage et al. (2022) "Toy Models of Superposition." The k-delay task is from echo-state / memory-capacity literature (Jaeger, 2002). Saddle-to-saddle / staircase learning dynamics build on Saxe et al. (2014), Jacot et al. (2022), and the authors' own Proca et al. (2025) linear-RNN dynamics work.

### What is mostly engineering or scaling
Very little engineering; this is analysis + small simulations. There is no scaling contribution (deliberately — it is a theory paper).

### Closest prior papers
- Elhage et al. (2022) — Toy Models of Superposition (the direct feedforward predecessor).
- François et al. (2025) — uncertainty principle for linear RNNs; studied the k-delay task in an underparameterized *linear* RNN in the frequency domain (dense regime only).
- Proca et al. (2025, ICML) — learning dynamics in linear RNNs (same senior authors' lineage).
- Henighan et al. (2023) — superposition, memorization, double descent (data-size dependence of geometry).

## Competitor analysis

### Direct competitors
Other theoretical treatments of memory/geometry in linear RNNs — chiefly **François et al. (2025)** (same task, linear/dense regime, frequency domain). This paper differentiates by adding the *sparse* regime and *nonlinear* RNNs and by the superposition framing.

### Indirect competitors
Broader superposition-geometry work (Elhage et al. 2022; Henighan et al. 2023) and RNN dynamics theory (low-rank RNN line: Mastrogiuseppe & Ostojic 2018; Schuessler et al. 2020/2024; Dubreuil et al. 2022) that offers alternative lenses (dynamics/connectivity) on the same phenomena.

### Complementary methods
SAE / dictionary-learning feature-extraction methods (Bricken et al. 2023; Templeton et al. 2024) are complementary: this paper explains *what geometry* superposition induces over time, which could inform *how* to build extraction methods for recurrent/SSM models. Neuroscience working-memory models (activity-slot vs resource; Xie et al. 2022a; Soni & Frank 2025) are complementary interpretive frames.

## Author and lab context

**Inference (affiliations from paper header):**
- **Pedro A. M. Mediano** (Imperial College London; also UCL) — senior author; information-theory / neural-computation / representational-dynamics group. Likely the anchoring PI.
- **Alexandra M. Proca** (Imperial, President's PhD Scholarship) — co-first; prior "Learning dynamics in linear recurrent neural networks" (ICML 2025), directly feeding the learning-dynamics analysis here.
- **Pratyaksh Sharma** (Imperial) — co-first.
- **Lucas Prieto** (Imperial; UKRI CDT in Safe and Trusted AI) — co-author.
- **Interpretation:** This looks like a **coherent, theory-focused research program** on RNN/SSM learning dynamics and representational geometry (the Proca et al. 2025 → this paper progression), sitting at the ML-neuroscience interface, rather than a one-off.

Do not treat author reputation as evidence of correctness; noted only to map the research program.

## Strategic value for our work

- **Borrow:** the *feature-direction-over-time* formalism (`w_s = W_h^s W_x`) and the **projection/composition interference** vocabulary as analytical tools; the practice of deriving an *expected loss* that decomposes into interpretable, individually-visualizable terms; the sparsity-sweep-to-find-phase-transition experimental pattern.
- **Avoid:** overclaiming real-model relevance from a purely synthetic setting — reviewers will (rightly) ask for contact with a trained SSM/LLM.
- **Baseline / framing we may need:** any future work on **SAEs or feature extraction for SSMs/RNNs** should now cite and position against "temporal superposition," since it defines the geometry those methods would have to invert.
- **Evaluation protocol to replicate:** measuring `W_y^T W_s` projection structure, angle `kθ`, and spectral radius as geometry diagnostics; reporting the fraction of trained models that reach the predicted geometry.
- **Claims this blocks:** "we are first to study superposition through time / memory" and "we introduce interference typing for recurrent models" are now taken.
- **Gap still open (high value):** (1) empirically demonstrating temporal superposition in a *real trained SSM* (Mamba) on natural data; (2) relaxing temporal independence/sparsity to correlated sequential data; (3) tasks requiring manipulation (not just delayed recall) and varying/adaptive memory demands; (4) building extraction/SAE methods that account for the time-indexed trajectory of a feature; (5) connecting the interference-free space to actual interpretability interventions.
- **Differentiation:** our angle could be the *empirical* validation and the *extraction-method* side that this (deliberately theoretical) paper leaves open.

## Reproducibility assessment

- Code availability: **5** (official repo `github.com/kashparty/iclr-rnn-superposition`, MIT, Jupyter notebooks; "code to replicate all experiments and figures").
- Data availability: **5** (synthetic, generation described in Appendix I.3).
- Hyperparameter detail: **4** (model definition, initialization, training in Appendix I.4; figure details in I.5).
- Compute transparency: **4** (tiny models; budget not itemized but clearly negligible).
- Seed reporting: **4** (fraction of models developing the geometry reported in Appendix I.1, appropriate for a mechanistic study).
- Evaluation clarity: **5** (metrics are geometric quantities, precisely defined; theory↔experiment matching explicit).
- Ease of reproduction: **5** (toy scale + released notebooks make it very tractable).

## Overall assessment

### Strengths
Conceptually original (time as a superposition axis); genuinely theoretical (derived, interpretable loss that predicts geometry); crisp phase-transition and interference-free-space results; clean architecture-class dichotomy (smooth vs sharp forgetting); strong ML↔neuroscience bridge; fully reproducible.

### Weaknesses
Entirely toy/synthetic with strong data assumptions (temporal independence + Bernoulli sparsity); no contact with any trained real-world SSM/LLM; limited to fixed-delay recall; real-model relevance is extrapolated, not shown.

### Confidence in assessment
**High** for the method, theory, and results as reported (full main text + appendix front-matter read). **Low** on reviewer dynamics (reviews not retrieved this session).

## Key quotations

- "we can think of each input feature as also having a temporal component dependent on its sequential position … representations of features are now determined by 'when' just as much as 'what'." (§2, Temporal superposition)
- "in the extremely sparse regime (where composition interference becomes negligible), this half-space essentially becomes interference free … a remarkable incentive for the model to take advantage of this phenomenon by packing as many `w_{s≠k}` vectors into this half-space as possible." (§4.2)
- "the ReLU activation makes it possible to immediately forget a feature by sending it to the negative quadrant … the nonlinear RNN can implement sharp forgetting." (§4.4)
- "our study indicates that recurrence and memory will exacerbate it [superposition]." (§6 Discussion — flagged here as extrapolation, not experiment.)

## Open questions

- Does temporal superposition appear in a *trained* Mamba/SSM on natural sequence data, and can it be measured there?
- How does relaxing temporal independence/sparsity (to correlated, language-like data) change the phase transition?
- What geometry arises for tasks requiring *manipulation* of stored information, or *adaptive/varying* memory demands?
- Can feature-extraction methods (SAEs) be adapted to the time-indexed feature trajectory `w_s`?
- Is the composition-interference story (currently partly speculative for dense SSMs) derivable rather than heuristic?

## Follow-up papers to read

- Elhage et al. 2022 — Toy Models of Superposition (Transformer Circuits Thread)
- François, Orvieto, Bach 2025 — An uncertainty principle for linear RNNs (`arXiv:2502.09287`)
- Proca et al. 2025 — Learning dynamics in linear recurrent neural networks (ICML 2025)
- Henighan et al. 2023 — Superposition, memorization, and double descent (Transformer Circuits Thread)
- Sharkey et al. 2025 — Open problems in mechanistic interpretability (`arXiv:2501.16496`)
- Jelassi et al. 2024 — Repeat after me: Transformers vs SSMs at copying (ICML 2024)
- Park, Choe, Veitch 2024 — The linear representation hypothesis and the geometry of LLMs (ICML 2024)
- Xie et al. 2022a — Geometry of sequence working memory in macaque PFC (Science)

## Source log

- Official / OpenReview: https://openreview.net/forum?id=7cMzTpbJHC (Oral; reviews public but **not retrieved** this session — `ChallengeRequiredError`)
- PDF (full text read): https://openreview.net/pdf?id=7cMzTpbJHC (also mirror `.../pdf/721473c0eb9679dee88c87af9f96fadc360de3e3.pdf`)
- arXiv: none found this session (paper distributed via OpenReview PDF; no arXiv ID located)
- Code: https://github.com/kashparty/iclr-rnn-superposition (MIT, Jupyter notebooks; author Pratyaksh Sharma / "kashparty")
- Correspondence: sharma.pratyaksh@gmail.com, a.proca22@imperial.ac.uk
