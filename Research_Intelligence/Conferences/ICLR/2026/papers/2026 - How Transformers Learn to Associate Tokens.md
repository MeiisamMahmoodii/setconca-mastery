---
title: "How Do Transformers Learn to Associate Tokens: Gradient Leading Terms Bring Mechanistic Interpretability"
year: 2026
conference: ICLR
status: accepted
presentation_type: oral
relevance: tier-1
primary_topics:
  - training dynamics
  - mechanistic interpretability
  - semantic associations
  - transformer theory
authors:
  - Shawn Im
  - Changdae Oh
  - Zhen Fang
  - Yixuan (Sharon) Li
institutions:
  - University of Wisconsin–Madison
  - University of Technology Sydney
paper_url: "https://arxiv.org/abs/2601.19208"
openreview_url: "https://openreview.net/forum?id=A4Us8jxVGq"
arxiv_url: "https://arxiv.org/abs/2601.19208"
code_url: "https://github.com/deeplearning-wisc/attn-dynamics-basis"
project_url: ""
review_visibility: public
reading_status: complete
last_updated: 2026-07-17
tags:
  - conference/iclr
  - year/2026
  - topic/mechanistic-interpretability
  - topic/training-dynamics
  - topic/transformer-theory
  - topic/semantic-associations
  - status/accepted
  - presentation/oral
  - relevance/tier-1
---

# How Do Transformers Learn to Associate Tokens: Gradient Leading Terms Bring Mechanistic Interpretability

## One-sentence summary

Using a leading-term (early-training) approximation of full-batch gradient descent, the authors derive closed-form expressions for **every** weight matrix of a realistic attention-only transformer (output, value, query–key, positional) as simple compositions of **three corpus-statistic basis functions** — a bigram mapping, a token-interchangeability mapping, and a context (prefix) mapping — and show these theoretical weights match those learned in a toy transformer and in Pythia-1.4B early in training.

## Why this paper matters

This is a **theory / training-dynamics** paper, not an SAE or probing method paper, but it is Tier-1 because it supplies a **mechanistic account of where associative features come from** — the raw material that SAEs, probes, and circuit analyses later carve up. Most feature-learning theory papers assume away the parts that make transformers realistic (synthetic/structured data, no positional encoding, no residual stream, sequential/frozen training). This paper's selling point is that it keeps **naturalistic text, relative positional encodings, causal masking, residual streams, and standard simultaneous-layer cross-entropy training**, then still gets a clean closed form. For our program its value is conceptual and foundational: it gives a principled, corpus-statistics vocabulary (bigram / interchangeability / context) for what "a feature" is at the weight level, and it is a **linear-representation / distributional-semantics** anchor we can cite when arguing that SAE features or probe directions reflect these three statistics rather than arbitrary structure.

## Research problem

How do **semantic associations** between tokens (e.g., "bird"→"flew", the interchangeability of "car"/"truck", the coupling of "country"/"capital") **emerge during the training** of attention-based language models trained on natural language data — and can this emergence be characterized in closed form for the actual weight matrices, not just for behavior?

## Motivation

- **Scientific motivation:** Semantic association is foundational to language modeling (distributional semantics; Harris 1954, Firth 1957, Miller & Charles 1991). Prior mechanistic results (induction heads, linear semantic relations, topic clustering) describe *specific* mechanisms but there is no *principled account* of how associations arise from training dynamics.
- **Practical motivation:** A theory-grounded, mechanistic foundation for representation learning in LLMs supports interpretability and diagnosis; the early training phase is where many core behaviors crystallize and persist (Olsson et al. 2022; Elhage et al. 2021; Nanda et al. 2023), so it is both important and analytically tractable.
- **Gap in prior work (their framing):** Existing training-dynamics theory relies on unrealistic departures — (1) synthetic/structured language, (2) simplified architectures (no positional encoding / residual stream / low-rank attention / no causal mask), (3) non-standard training (sequential component-wise or partially frozen weights). These raise doubts about generalizing to practical LLMs.
- **Claimed limitation of existing methods:** Because of those departures, prior theorems do not tell us what the *learned weights of a realistic transformer on real text* actually look like.

## Core hypothesis

At an early training stage, the **leading term** of the gradient expansion dominates each weight matrix's update, and this leading term is a **fixed composition of a small number of corpus statistics**; therefore the learned weights of a realistic attention transformer can be predicted in closed form (up to bounded error) from three basis functions computed directly from the training corpus, uniformly across layers.

## Objective

Standard next-token cross-entropy on one-hot sequences, optimized by **full-batch gradient descent with constant learning rate** (Eq. 3–4). The analysis is not of a new objective but of how this standard objective shapes weights.

- Model (Def. 3.1): attention-only, L layers, with **relative positional encoding** (T5-style), **causal masking**, **residual stream**; parameters per layer are a shared key–query matrix `W^(l) ∈ R^{|V|×|V|}`, value matrix `V^(l)`, relative position matrix `P^(l) ∈ R^{T×T}`, plus a single output matrix `W_O ∈ R^{|V|×|V|}`. No MLP, single (shared) attention operator per layer in the theory.
- Technical device: expand the gradient at each step; keep the **leading order term**; bound the accumulated deviation of the true weights from the leading-term prediction over `O(1/η)` steps.

## Core idea

Intuition: very early in training the model starts from (near-)uniform outputs, so the first thing each weight can learn is the dominant, low-order statistic of the corpus. The **output matrix** first learns bigram statistics (what usually follows a token); the **value matrix** then learns a context-summary composed with bigram; the **attention (query–key)** and **positional** matrices learn a higher-order token-to-token / position-to-position correlation built from interchangeability and context. Stacking these gradient steps yields a closed form for every matrix, and — crucially — the same characterization holds **uniformly across all layers** at the early stage before layers differentiate.

Mechanism (technical): they show weights are polynomials in `sη` (steps × learning rate) whose coefficients are the three basis operators. Concretely (Theorem 4.1 / D.9, Gaussian and zero init):

- `W_O ≈ sη · B̄` (bigram), error `≤ 3s²η²`
- `V^(l) ≈ s²η² · Φ̄ᵀB̄ᵀ` (context ∘ bigram), error `≤ 12s³η³`
- `W^(l) ≈ (3s⁴+2s³)η⁴ · Q̄` (token-to-token correlation from interchangeability + context), error `≤ 13s⁵η⁵T`
- `P^(l) ≈ (3s⁴+2s³)η⁴ · Δ` (same feature mapped to relative positions), error `≤ 13s⁵η⁵T`

valid for `L ≤ √T/4`, `s ≤ η⁻¹·min(5/(8√T), 1/(12L))`, `T ≥ 60`, `|V| ≥ 500`.

## Method

### Inputs
One-hot token sequences `X ∈ R^{T×|V|}` from a natural-language corpus; next-token one-hot targets `Y`.

### Outputs
Closed-form (leading-term) matrices `B̄`, `Φ̄`, `Q̄`, `Δ` computed from corpus statistics, plus Frobenius-norm error bounds relating them to the actually-learned weights.

### Architecture
Attention-only transformer (Def. 3.1) with residual recurrence `h^(l) = h^(l−1) + S(Mask(h^(l−1)W^(l)h^(l−1)ᵀ + DM(P^(l)))) h^(l−1) V^(l)`, `h^(0)=X`, output `F_Θ(X) = h^(L) W_O`. Relative positional encoding, causal mask, no MLP in theory (MLP appears only in the Pythia validation).

### Training objective
Standard cross-entropy next-token loss (Eq. 3); full-batch GD, constant `η` (Eq. 4).

### Data construction
- **Theory validation (toy):** TinyStories (Eldan & Li 2023), truncated to the 3,000 most frequent words as vocabulary (word-level); also a **BPE** variant with vocab 10,000. Sequence length `T = 200/201`; 65,536 filtered samples; theoretical matrices computed from the first batch.
- **Real-LLM validation:** OpenWebText (Gokaslan et al. 2019) and, in the appendix, FineWeb (Penedo et al. 2024); first 100K samples with length ≥ 512 chars.

### Inference procedure
Not applicable in the usual sense — the "prediction" being tested is the closed-form weight, compared to trained weights via cosine similarity of the weights (toy model) or of covariance matrices of derived token-basis mappings (Pythia).

### Computational requirements
Toy: batch size 2048, learning rates 0.005 (small-LR) and 0.05 (large-LR), 100 epochs. Pythia analysis: 4× A100 (80GB); explicitly stated to be reducible by shrinking batch/sequence length.

## Experimental design

### Models
(1) A 3-layer attention-only transformer matching Def. 3.1 (trained from scratch on TinyStories). (2) **Pythia-1.4B** (Biderman et al. 2023), chosen because it releases intermediate training checkpoints, enabling training-dynamics analysis. Pythia has MLP + multi-head attention, i.e., beyond the theory.

### Layers or activation sites
Toy: all 3 layers. Pythia: all layers for aggregate cosine-similarity curves; individual-head analysis at an **early (layer 2), middle (layer 13), and late (layer 24)** layer.

### Datasets
TinyStories (word + BPE), OpenWebText, FineWeb.

### Baselines
No competing *method* baselines (it is theory). The comparison target is the **learned weights themselves** vs the theoretical leading terms; the causal-intervention appendix uses the **original model loss** as the reference.

### Metrics
- Toy: **cosine similarity** between each learned weight matrix and its theoretical leading term, tracked across epochs (min over epochs reported).
- Pythia: **cosine similarity between covariance matrices** of (a) a token-basis attention mapping `A_l,tok` derived from averaged head key–query products vs `Q̄`, and (b) layer output embeddings `E_l,post` vs `Φ̄ᵀB̄ᵀ` (value term), tracked across checkpoints; row-normalization to unit norm to control for architecture differences.
- Qualitative: top-30 most-correlated tokens under each basis function `B̄`, `Σ_B̄`, `Φ̄`.

### Controls
Row/column centering so each basis operator sums to zero; unit-norm normalization of leading-term rows to control for embedding-space scaling; an **MLP ablation** (using `E_l,attn`, the attention-only output) to isolate the attention block's contribution.

### Ablations
- **MLP ablation** (attention-only embedding correlations) — tests whether MLP changes the picture.
- **Individual attention heads** across early/mid/late layers — tests head specialization rate.
- **Causal intervention** (Appendix B, Table 3): remove the projection of each weight onto its leading term and measure loss change.
- **BPE tokenization** (Appendix B, Table 2) — robustness to tokenizer.
- **Second dataset** FineWeb (Appendix B, Fig. 8).

### Statistical testing
None (no significance tests, no error bars over seeds reported).

### Number of seeds
Not reported. **Fact:** no seed/variance analysis is presented.

## Main results

- **Toy model matches theory extremely well.** Minimum cosine similarity over 100 epochs (small LR): attention 0.9995, value 0.9992, output 0.9985 (Table 1 / Fig. 4). Even after 30 epochs all weights stay ≥ 0.9; all matrices stay > 0.7 even at 100 epochs, where loss fell from 8.00 → 5.35. BPE variant (Table 2): attention 0.99991, value 0.99880, output 0.99789 (min over 10 epochs). **Interpretation by authors:** the leading-term features characterize the model well *beyond* the early stage the theorem formally covers.
- **Pythia-1.4B early-training agreement.** Fig. 6: at early training, strong agreement between Pythia embeddings and the leading-term features across **all layers** for the embedding (value) mapping, and for attention across all layers **except the first**. As training continues, weights **gradually drift** from fixed associative features toward richer knowledge, **starting with earlier layers**, but retain the features for a relatively long time.
- **MLP ablation.** Fig. 6 (middle): correlations captured by embeddings with vs without the MLP are similar except at layer 1 → **Hypothesis (authors):** at early stages the first-layer MLP behaves similarly to the leading-term value mapping.
- **Head specialization.** Fig. 7: layers evolve differently; earlier layers (esp. layer 2) acquire leading-term features **more slowly**; layer 13 shows **faster head specialization** (high within-column variance late) → suggests **intermediate layers** are where specialization initially occurs.
- **Causal intervention (Table 3).** Removing each weight's leading-term projection raises TinyStories loss from 5.349: output → 8.287 (largest), value layers → ~6.19–6.53, attention layers → ~5.35–5.36 (smallest). Ordering matches theory (output has the largest-order update, attention the smallest).
- **Qualitative semantics (Fig. 5).** Top-correlated tokens per basis are linguistically sensible: under `B̄`, "red" correlates with objects it modifies ("truck", "ball", "dress"); under `Σ_B̄`, interchangeable/role-similar words cluster ("car"/"truck", "he"/"she"/"they"); under `Φ̄`, "fish" correlates with context settings ("pond", "lake", "water", "sea").
- **FineWeb (Fig. 8).** Very similar cosine-similarity behavior as OpenWebText.

## What the results genuinely demonstrate

- For a **realistic-but-simplified** (attention-only, relative-PE, residual, causal, standard-CE, full-batch GD) transformer, the learned weights at the early stage are, to high cosine similarity, the predicted **compositions of bigram / interchangeability / context** statistics — and this holds uniformly across layers and across two tokenizations.
- The characterization is **empirically informative beyond** the formally-bounded early window (toy cosine ≥ 0.7 at 100 epochs).
- On a **real LLM with MLP + multi-head attention** (Pythia-1.4B), the same corpus-statistic structure is **present early in training** across layers and on two web-scale corpora, and the leading-term components are **causally load-bearing** in the toy model (projecting them out degrades loss in the theory-predicted order).

## What the results do not demonstrate

- It does **not** characterize the *converged* weights of a practical LLM — agreement decays with training (Fig. 6), so this is an account of **emergence/early dynamics**, not of the final representation.
- The Pythia comparison is at the level of **covariance-matrix cosine similarity** of derived mappings, not a direct read-off of weights; MLP and multi-head structure are only partially controlled.
- **No causal/faithfulness test on the real LLM** — the causal intervention (Table 3) is only on the toy model.
- The theory assumes **full-batch GD, constant LR, no MLP, shared key–query per layer, `L ≤ √T/4`** — real LLMs use Adam, minibatches, LR schedules, MLPs, etc.; the paper argues empirical robustness but does not extend the proof to these.
- "Semantic association" is operationalized via **co-occurrence statistics**; the paper shows these statistics are learned, not that the model's downstream *semantic behavior* is *explained* by them (only that features "are correlated with the behavior").

## Strongest evidence

The **toy-model cosine-similarity result** (Table 1, Fig. 4): near-perfect (≥ 0.998) agreement between three distinct learned weight matrices and three distinct theoretical leading terms, sustained far past the early stage, is a direct, hard-to-fake confirmation of the closed-form claim under conditions that closely match the theorem's assumptions.

## Weakest evidence

The **Pythia-1.4B extension**: it relies on covariance-cosine of *derived* token-basis mappings, agreement is early-only and decays, and the "MLP ≈ leading-term value mapping" and "intermediate layers specialize first" statements are explicitly framed by the authors as hypotheses/initial results rather than established facts.

## Important ablations

- **MLP ablation (Fig. 6 middle):** attention-only vs full-layer embedding correlations agree except at layer 1 → the associative structure is carried largely by attention/value, with the first-layer MLP playing a value-like role early.
- **Causal intervention (Table 3):** confirms the *relative importance ordering* predicted by the update-order theory (output ≫ value ≫ attention).
- **BPE (Table 2) and FineWeb (Fig. 8):** robustness of the closed-form match to tokenizer and corpus.
- **Per-head, per-layer (Fig. 7):** reveals *heterogeneous* rates of feature acquisition, nuancing the "uniform across layers" theorem as an early-stage starting point that then differentiates.

## Failure cases

- Agreement between theory and Pythia weights **degrades as training proceeds**, earliest in the early layers — the theory does not cover the mature model.
- The **first attention layer** in Pythia is the consistent exception (lower agreement) across analyses.

## Limitations stated by the authors

- The theorem is an **early-stage** characterization; later dynamics require finer-grained analysis (they position their result as "a starting point").
- Real models add **MLP and multi-head attention** not in the theory; agreement is empirical, and MLP behavior is offered as a hypothesis.
- (Reproducibility statement) results depend on the specified toy setup; they emphasize full proofs and open code for verification.

## Additional limitations not emphasized by the authors

- **No seeds / no variance / no significance testing** anywhere; all curves are single-run.
- **Full-batch GD + constant LR** is far from Adam + minibatch + schedule used in practice; the `L ≤ √T/4` depth constraint excludes deep models at short context.
- The **shared query–key matrix** and single value operator per layer are simplifications relative to real multi-head attention.
- "Semantic" is essentially **distributional co-occurrence**; the paper does not separate genuinely semantic association from surface collocation, and the qualitative examples are hand-selected.
- Only **one real model** (Pythia-1.4B); no scaling across model sizes or families.

## Reviewer feedback

> [!note] Review availability
> Reviews for `A4Us8jxVGq` are **public on OpenReview** (ICLR 2026), and this is an **Oral**. However, the OpenReview `/notes` and `/pdf` endpoints returned an anti-bot **challenge** (`ChallengeRequiredError`) in this session, so the individual review texts, scores, rebuttal, and meta-review were **not retrieved**. This section is intentionally left unfilled rather than fabricated. **Action:** fetch reviews via an authenticated browser session and complete: main positive points, main concerns, questions, author rebuttal, resolved/unresolved. (Per CLAUDE.md §24.)

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
> Evidence-based inference from the paper itself + its **Oral** status. Reviews were not read this session; this is not an official reason.

Plausible factors: (1) it stakes a **"first explicit characterization of realistic transformer weights on real text under standard NTP training"** claim — a clean, ambitious framing reviewers reward; (2) it explicitly **removes the standard unrealistic assumptions** (synthetic data, no PE/residual, non-standard training) that reviewers routinely criticize in feature-learning theory; (3) **strong, legible empirical confirmation** (near-1.0 cosine on the toy model) plus a **real-LLM (Pythia) validation across checkpoints and two corpora**; (4) it connects **training dynamics ↔ distributional semantics ↔ interpretability**, a broadly relevant, timely bridge; (5) **full proofs + open code** support reproducibility. Oral selection likely rewards the crisp "three basis functions" story and its foundational framing.

## Why it may have been rejected

Not applicable (accepted, Oral).

## Novelty analysis

### What is genuinely new
The **leading-term-of-the-gradient technique applied to a realistic attention transformer**, yielding **closed-form, per-matrix** weight characterizations (output/value/query–key/positional) as compositions of **three named corpus-statistic basis functions** (bigram `B̄`, interchangeability `Σ_B̄ = B̄ᵀB̄`, context/prefix `Φ̄`), proven **uniformly across all layers** under both zero and small-Gaussian initialization.

### What is adapted from prior work
The realistic architecture choice (residual + PE + causal mask) follows Nichani et al. (2024); relative PE from T5 (Raffel et al. 2020); the "core behaviors emerge early and persist" premise from Olsson et al. 2022 / Elhage et al. 2021 / Nanda et al. 2023; distributional-semantics framing from Harris 1954 / Firth 1957. Pythia-checkpoint dynamics analysis follows the interpretability-via-checkpoints line (Marks et al. 2024; Gallego-Feliciano et al. 2025).

### What is mostly engineering or scaling
Little — this is a proof-driven paper. The empirical side (toy training, Pythia covariance analysis) is light engineering to validate the theory.

### Closest prior papers
Bietti et al. 2023 (Birth of a Transformer — bigram/associative memory viewpoint); Tian et al. 2023 (Scan and Snap — 1-layer token composition dynamics); Nichani et al. 2024 (learning causal structure with GD); Li et al. 2023b (how transformers learn topic structure); Yang et al. 2024 (word co-occurrence via gradient flow); Huang et al. 2025 (non-asymptotic NTP convergence).

## Competitor analysis

### Direct competitors
Other **training-dynamics-of-transformers theory** on associative/co-occurrence feature learning: Bietti et al. 2023, Tian et al. 2023, Nichani et al. 2024, Yang et al. 2024, Huang et al. 2025. This paper competes by claiming a **more realistic setting** (natural data, PE, residual, standard training) and a **full multi-matrix closed form**.

### Indirect competitors
Static-interpretability accounts of the *same phenomena* (linear semantic relations: Nanda et al. 2023; Jiang et al. 2024 origins of linear representations; induction heads: Olsson et al. 2022) — these describe converged mechanisms rather than emergence.

### Complementary methods
SAEs / dictionary learning (Cunningham et al. 2023) and sparse feature circuits (Marks et al. 2024) operate on the *learned* representations this paper explains the *origin* of — the three basis functions could be a lens for interpreting what SAE features/probe directions recover.

| Paper | Core claim | Setting realism | PE / residual? | Training | Main evidence | Overlap with us |
|---|---|---|---|---|---|---|
| This paper | Weights = compositions of bigram/interchangeability/context | Natural text, attention-only | Yes / Yes | Standard full-batch GD, CE | Toy cosine + Pythia checkpoints | Foundational (origin of features) |
| Bietti et al. 2023 | Bigram/associative memory forms | Semi-synthetic | Partial | Adjusted | Toy transformer | Related mechanism |
| Nichani et al. 2024 | Learns causal structure via GD | Structured data | Yes | GD | Theory | Method lineage |
| Yang et al. 2024 | Learns word co-occurrence | Abstracted | — | Gradient flow | Theory | Related statistic |

## Author and lab context

- **Yixuan (Sharon) Li** (UW–Madison) — senior PI; large body of work on OOD detection, reliable/robust ML, and increasingly LLM interpretability/representation analysis. This is a **central lab research program** (the `deeplearning-wisc` group), not a one-off.
- **Shawn Im** (UW–Madison, NSF GRFP) — recurring first author in Sharon Li's group on LLM alignment/representation dynamics.
- **Changdae Oh** (UW–Madison) — recurring collaborator; representation/robustness work.
- **Zhen Fang** (University of Technology Sydney; ARC DECRA-funded) — theory-leaning collaborator (learnability/OOD theory), providing the formal backbone.
- **Interpretation:** a coordinated theory+representation program; the author name appears as "Sharon Li" on OpenReview/arXiv and "Yixuan Li" on the code repo — same person. Do not treat lab prestige as evidence of correctness (CLAUDE.md §14).

## Strategic value for our work

> This is Tier-1 but **theoretical / training-dynamics**, not an SAE or benchmark method. Its value to us is **conceptual and citational**, not a drop-in baseline or eval protocol.

- **Borrow (framing, not code):** the **three-basis vocabulary** (bigram / interchangeability / context) is a clean way to *describe what a discovered feature encodes*. When we interpret SAE latents or probe directions, we can ask which of these three statistics a feature aligns with — a principled, corpus-grounded interpretation layer.
- **Borrow (method idea):** the **leading-term / early-training** lens and the **project-out-the-leading-term causal intervention** (Table 3) is a cheap, transferable diagnostic for attributing a weight's function to a known statistic.
- **Avoid:** treating this as evidence about *converged* representations — agreement decays with training; do not over-claim that mature SAE features are "just" these three statistics.
- **Baseline we may need:** **none directly** — there is no competing method to benchmark against. But if we make claims about *how* a feature emerges during training, this paper's characterization is the reference to beat/cite.
- **Evaluation protocol to replicate:** the **Pythia-checkpoint covariance-cosine tracking** across training steps is a reusable way to study *emergence* of any feature family we care about (e.g., "when do our target features appear, and in which layers first?").
- **Claim this blocks:** "we are the first to give a closed-form / corpus-statistic account of how associative features emerge in realistic transformers" is now taken. Also "semantic associations reduce to bigram+interchangeability+context statistics early in training" is staked.
- **Gap still open (for us):** (1) extending the characterization **to MLPs and multi-head attention with proofs**, not just an ablation-level hypothesis; (2) the **converged-regime** characterization (this paper explicitly stops at early stage); (3) connecting the three basis functions **causally to SAE features / steering behavior** at scale and with seeds; (4) whether these statistics predict **feature stability / splitting** in SAEs.
- **Differentiation:** our angle can be *representation-level and causal at scale* (SAEs, interventions, faithfulness) where this paper is *weight-level and early-stage*; the two are complementary and citing it strengthens a "from-training-dynamics-to-features" narrative.

## Reproducibility assessment

- Code availability: **5** (public repo `deeplearning-wisc/attn-dynamics-basis`; reproducibility statement confirms code + full proofs).
- Data availability: **5** (TinyStories, OpenWebText, FineWeb, Pythia checkpoints all public).
- Hyperparameter detail: **4** (LRs 0.005/0.05, batch 2048, T=200/201, vocab 3000/10000, 100 epochs, 4×A100 for Pythia stated; optimizer beyond "GD" and full schedule less explicit).
- Compute transparency: **4** (toy is trivially cheap; Pythia analysis hardware given and said to be reducible).
- Seed reporting: **1** (none).
- Evaluation clarity: **4** (metrics well-defined; several results only in figures).
- Ease of reproduction: **4** (toy model + released code + open checkpoints make the core claim very tractable; theorem constants are conservative but proofs are complete).

## Overall assessment

### Strengths
Ambitious yet clean closed-form theory under **realistic** architectural/training assumptions; a memorable, reusable three-basis vocabulary; **near-perfect** toy validation across two tokenizers; a **real-LLM** validation across checkpoints and two corpora; a theory-consistent causal-intervention ordering; full proofs and open code.

### Weaknesses
Early-stage only (decays on real models); no MLP/multi-head in the proof; full-batch GD + constant LR + `L ≤ √T/4` are strong idealizations; single real model, no seeds, no significance tests; "semantic" ≈ distributional co-occurrence; several key results are figure-only and qualitatively selected.

### Confidence in assessment
**High** for the method/claims/results as reported (full paper + appendix/proofs read). **Low** on reviewer dynamics (reviews not retrieved this session).

## Key quotations

- "each set of weights of the transformer has closed-form expressions as simple compositions of three basis functions–bigram, token-interchangeability, and context mappings–reflecting the statistics of the text corpus" (Abstract).
- "We present the first explicit characterization of weights in attention-based transformers trained on real-world text corpora under the next-token prediction loss" (Contribution 1, §1).
- "the weights of attention-based transformers remain close to their gradient leading terms for O(1/η) steps under both zero and Gaussian initializations" (§4.1).
- "as the model continues training, the weights gradually drift from fixed associative features to represent richer knowledge beyond association, starting with the earlier layers" (§5.2, Results).
- "one possible hypothesis is that the MLP at early stages functions similarly to the leading-term value mapping" (§5.2, MLP ablation).

## Open questions

- Can the closed form be extended to **MLPs, multi-head attention, and Adam/minibatch/schedule** with proofs rather than empirical analogy?
- What characterizes the **converged** weights, once agreement with the early leading term decays?
- Why is the **first attention layer** consistently the exception in Pythia?
- Do the three basis functions **predict SAE feature content / stability / steering effects** at scale?
- How do the **head-specialization dynamics** (intermediate layers first) connect to circuit formation?

## Follow-up papers to read

- Bietti et al. 2023 — Birth of a Transformer: a memory viewpoint (`NeurIPS 2023`)
- Tian et al. 2023 — Scan and Snap: training dynamics of 1-layer transformers (`NeurIPS 2023`)
- Nichani et al. 2024 — How transformers learn causal structure with gradient descent (`ICML 2024`)
- Yang et al. 2024 — Training dynamics of transformers to recognize word co-occurrence (`NeurIPS 2024`)
- Huang et al. 2025 — Non-asymptotic convergence of training transformers for next-token prediction (`NeurIPS 2024/25`)
- Jiang et al. 2024 — On the origins of linear representations in LLMs (`ICML 2024`)
- Nanda et al. 2023 — Progress measures for grokking via mechanistic interpretability (`arXiv:2301.05217`)
- Olsson et al. 2022 — In-context learning and induction heads (`arXiv:2209.11895`)

## Source log

- Official / OpenReview: https://openreview.net/forum?id=A4Us8jxVGq (ICLR 2026 **Oral**; Submission 7902; reviews public but **not retrieved** this session — `ChallengeRequiredError`)
- arXiv (full text + full appendix/proofs read): https://arxiv.org/abs/2601.19208 (HTML), https://arxiv.org/pdf/2601.19208
- Code (verified): https://github.com/deeplearning-wisc/attn-dynamics-basis
- Third-party note (cross-check only, not primary): https://en.papernotes.org/ICLR2026/interpretability/how_do_transformers_learn_to_associate_tokens_gradient_leading_terms_bring_mecha/
- Other: OpenReview PDF endpoint https://openreview.net/pdf?id=A4Us8jxVGq (gated)
