# AGENTS.md — Conference-by-Conference Research Intelligence for Mechanistic Interpretability and Representation Learning

## 1. Mission

Build a rigorous, continuously maintainable research knowledge base covering major AI conferences, with primary emphasis on:

- Mechanistic interpretability
- Sparse autoencoders (SAEs)
- Representation learning
- Feature learning and concept discovery
- Activation analysis
- Model internals and circuit analysis
- Steering, probing, attribution, and intervention
- Concept bottlenecks and disentanglement
- Representation geometry
- Safety-relevant internal representations
- Causal representation learning
- Representation robustness, transfer, and stability
- Any adjacent area that could materially inform our research direction

The goal is not merely to collect papers. The goal is to understand:

1. What research directions are being accepted.
2. What reviewers appear to value.
3. Which weaknesses repeatedly cause rejection or weak reception.
4. Which groups, authors, and institutions are shaping the field.
5. Which methods are direct competitors, indirect competitors, or useful foundations.
6. Where important open gaps remain.
7. What evidence is required to make a paper competitive at each conference.
8. How our own research can be positioned against the current literature.

Work conference-by-conference and paper-by-paper. Do not mix conferences prematurely.

---

## 2. Conferences and Processing Order

Process the following venues separately:

### A* conferences

1. NeurIPS
2. ICML
3. ICLR
4. AAAI
5. IJCAI
6. ACL
7. EMNLP

### A conferences

8. AISTATS
9. UAI
10. ECAI
11. NAACL
12. COLING

Use one conference as the active scope at a time. Fully complete the current conference before moving to the next unless explicitly instructed otherwise.

Default order:

1. ICLR
2. NeurIPS
3. ICML
4. ACL
5. EMNLP
6. AISTATS
7. UAI
8. AAAI
9. IJCAI
10. NAACL
11. COLING
12. ECAI

The order may be changed if the user names a specific conference.

---

## 3. Time Scope

Start with the most recent completed conference cycle and then move backward.

For each conference:

1. Identify the latest completed proceedings.
2. Identify accepted papers relevant to the target areas.
3. If public review data exists, inspect submissions, reviews, rebuttals, decisions, and meta-reviews.
4. Examine at least the previous three conference years to identify trends.
5. Expand farther back when an older paper is foundational, highly cited, or repeatedly referenced by recent work.

Always record the exact conference year and publication status.

Do not assume a paper was accepted merely because it appeared on arXiv. Verify the official venue and status.

---

## 4. Source Priority

Use primary sources whenever possible.

Priority order:

1. Official conference proceedings
2. OpenReview decision pages, reviews, rebuttals, and meta-reviews
3. ACL Anthology
4. PMLR
5. Proceedings hosted by the conference
6. Author-hosted paper or project pages
7. Official GitHub repositories
8. Official datasets and model cards
9. arXiv, when the conference version is unavailable
10. Secondary commentary only as supplementary context

Do not rely on search-result snippets, social media summaries, or third-party blog posts as the main evidence.

Every factual claim that may later matter must be traceable to a source.

---

## 5. Search Scope

Search broadly enough that relevant work is not missed.

### Core search terms

- mechanistic interpretability
- sparse autoencoder
- sparse coding
- dictionary learning
- monosemanticity
- superposition
- feature geometry
- representation geometry
- latent feature
- concept discovery
- concept decomposition
- feature disentanglement
- probing
- causal probing
- activation patching
- path patching
- circuit discovery
- attribution
- representation intervention
- model editing
- representation steering
- activation steering
- concept vectors
- concept bottleneck
- distributed representation
- feature stability
- representation similarity
- representation alignment
- cross-layer representation
- latent space analysis
- neural collapse
- linear representation hypothesis
- causal representation learning
- interpretability benchmark
- interpretability evaluation
- feature visualization
- neuron interpretation
- explanation faithfulness
- faithfulness benchmark
- representation robustness
- OOD representation transfer
- representation sparsity
- token-level features
- sequence-level features
- temporal features
- compositional representations
- multimodal representations
- language model internals
- transformer circuits
- safety representations
- refusal representations
- jailbreak detection
- harmfulness representations
- latent monitoring
- representation-based anomaly detection

### Adjacent areas to include when strategically relevant

- contrastive learning
- metric learning
- self-supervised learning
- causal inference over representations
- concept-based explanations
- test-time monitoring
- internal model auditing
- unlearning and editing
- latent-space control
- scalable oversight
- weak-to-strong generalization
- model organisms of misalignment
- deception detection
- interpretability for agents
- multi-view representation learning
- group-invariant representations
- set encoders
- prototype learning
- clustering and subspace learning
- low-rank representation analysis

Do not include an adjacent paper merely because it contains similar terminology. Explain why it is strategically relevant.

---

## 6. Definition of Relevance

Classify each discovered paper into one of these categories:

### Tier 1 — Directly relevant

The paper directly studies mechanistic interpretability, SAEs, internal representations, circuits, concept features, activation-level analysis, or representation-based monitoring.

### Tier 2 — Strongly adjacent

The paper provides a method, benchmark, objective, evaluation protocol, or theoretical result that can be transferred to mechanistic interpretability or sparse representation learning.

### Tier 3 — Strategically relevant

The paper is not primarily interpretability work but may affect positioning, experimental design, reviewer expectations, or competitive differentiation.

### Tier 4 — Background only

The paper is foundational or frequently cited but not a current direct competitor.

Do not spend equal effort on all tiers. Tier 1 papers receive full reading. Tier 2 papers receive substantial reading. Tier 3 papers receive targeted analysis. Tier 4 papers receive concise background notes unless foundational.

---

## 7. Required Workflow for Each Conference

Create a dedicated conference folder:

```text
Research_Intelligence/
  Conferences/
    ICLR/
      2026/
      2025/
      2024/
      conference_overview.md
      trend_analysis.md
      reviewer_preferences.md
      author_and_lab_map.md
      competitor_map.md
      open_problems.md
      reading_queue.md
      index.md
```

Use the same structure for every conference.

### Step 1 — Build the candidate list

Create a broad initial list of potentially relevant papers.

For every candidate, record:

- title
- authors
- year
- conference
- official URL
- OpenReview URL, if available
- code URL
- project URL
- relevance tier
- one-sentence relevance justification
- reading status

Save this to:

```text
<conference>/<year>/candidate_papers.md
```

### Step 2 — Verify status

For each paper, verify:

- accepted, rejected, withdrawn, desk rejected, or unknown
- oral, spotlight, notable paper, best paper, findings, main conference, workshop, or poster
- whether the available PDF matches the accepted version
- whether reviews are public

Never infer rejection reasons when reviews are unavailable.

### Step 3 — Prioritize

Read papers in this order:

1. Directly relevant accepted papers
2. Directly relevant rejected papers with public reviews
3. Highly cited or highly discussed adjacent accepted papers
4. Papers by major recurring groups
5. Papers that introduce benchmarks or evaluation methods
6. Papers that directly overlap with our method or claims

### Step 4 — Read each paper

Do not summarize from the abstract alone.

At minimum inspect:

- abstract
- introduction
- related work
- method
- experimental setup
- baselines
- ablations
- main results
- limitations
- appendices relevant to implementation and evaluation
- reviews and rebuttal, when public

For central papers, read the entire paper carefully.

### Step 5 — Create one note per paper

Use the paper template in Section 9.

### Step 6 — Synthesize at conference level

After enough papers are analyzed, update:

- trend analysis
- reviewer preferences
- competitor map
- author and lab map
- open research gaps
- implications for our work

### Step 7 — Perform a quality audit

Before marking a conference complete:

- verify all links
- distinguish facts from interpretation
- confirm accepted/rejected status
- check that important papers were not omitted
- check that each important claim has evidence
- identify unresolved uncertainties

---

## 8. Obsidian Requirements

All outputs must be clean Markdown compatible with Obsidian.

Use:

- YAML frontmatter
- `[[internal links]]`
- tags
- clear headings
- callouts where useful
- small tables only when they improve comparison
- no unnecessary HTML
- stable filenames

### Naming convention

```text
YEAR - Short Paper Title.md
```

Example:

```text
2026 - Temporal Sparse Autoencoders.md
```

### Recommended tags

```yaml
tags:
  - conference/iclr
  - year/2026
  - topic/mechanistic-interpretability
  - topic/sparse-autoencoder
  - status/accepted
  - relevance/tier-1
```

### Internal links

Link papers to:

- related papers
- authors
- labs
- methods
- datasets
- benchmarks
- conferences
- research questions

Example:

```markdown
Related to [[2025 - Matryoshka Sparse Autoencoders]] and [[Concept Discovery Benchmarks]].
```

---

## 9. Required Paper Note Template

Create one Markdown file for every fully analyzed paper.

```markdown
---
title: "Paper title"
year: 2026
conference: ICLR
status: accepted
presentation_type: poster
relevance: tier-1
primary_topics:
  - sparse autoencoders
  - mechanistic interpretability
authors:
  - Author One
  - Author Two
institutions:
  - Institution One
paper_url: ""
openreview_url: ""
code_url: ""
project_url: ""
review_visibility: public
reading_status: complete
last_updated: YYYY-MM-DD
---

# Paper Title

## One-sentence summary

A precise sentence explaining what the paper contributes.

## Why this paper matters

Explain why this paper is relevant to mechanistic interpretability, SAEs, representation learning, or our research strategy.

## Research problem

What concrete problem is the paper trying to solve?

## Motivation

Why do the authors believe this problem matters?

Distinguish:

- scientific motivation
- practical motivation
- gap in prior work
- claimed limitation of existing methods

## Core hypothesis

State the main hypothesis in testable form.

## Objective

What exactly is optimized, predicted, reconstructed, aligned, discovered, or evaluated?

Include equations when essential, but explain them in plain language.

## Core idea

Explain the central method intuitively.

Then explain the technical mechanism.

## Method

### Inputs

### Outputs

### Architecture

### Training objective

### Data construction

### Inference procedure

### Computational requirements

## Experimental design

### Models

### Layers or activation sites

### Datasets

### Baselines

### Metrics

### Controls

### Ablations

### Statistical testing

### Number of seeds

## Main results

Report the important results accurately.

Do not say "improves significantly" unless statistical significance is actually established.

## What the results genuinely demonstrate

Separate what is directly supported from what is only suggested.

## What the results do not demonstrate

Identify unsupported generalizations or missing evidence.

## Strongest evidence

Which experiment most strongly supports the paper's central claim?

## Weakest evidence

Which claim has the weakest empirical support?

## Important ablations

Explain what each important ablation reveals.

## Failure cases

What fails, degrades, or remains unresolved?

## Limitations stated by the authors

## Additional limitations not emphasized by the authors

Be fair and evidence-based.

## Reviewer feedback

Only include this section when reviews are public.

### Main positive points

### Main concerns

### Questions raised by reviewers

### Author rebuttal

### Which concerns were resolved

### Which concerns remained unresolved

## Why it was accepted

Infer this only from available evidence such as reviews, meta-review, scores, novelty, results, clarity, and relevance.

Label interpretations explicitly:

> [!note] Interpretation
> The following is an evidence-based inference, not an official reason.

Possible factors:

- clear problem formulation
- timely topic
- strong empirical evidence
- convincing baselines
- useful benchmark
- simple but effective method
- theoretical contribution
- reproducibility
- strong ablation design
- broad relevance
- clear distinction from prior work

## Why it may have been rejected

Use only for rejected papers with public evidence.

Never invent reasons.

Separate:

- reviewer-stated weaknesses
- meta-review rationale
- unresolved rebuttal issues
- your own interpretation

## Novelty analysis

### What is genuinely new

### What is adapted from prior work

### What is mostly engineering or scaling

### Closest prior papers

## Competitor analysis

### Direct competitors

Papers solving nearly the same problem with comparable assumptions.

### Indirect competitors

Papers offering an alternative route to the same broader goal.

### Complementary methods

Methods that could be combined with this work.

## Author and lab context

For each recurring or influential author, record:

- affiliation at publication time
- relevant previous papers
- recurring collaborators
- research trajectory
- whether this appears to be a central research program or a one-off paper

Do not treat author reputation as proof of paper quality.

## Strategic value for our work

Explain:

- what we should borrow
- what we should avoid
- what baseline we may need
- what evaluation protocol we should replicate
- what claim this paper blocks us from making
- what gap remains available
- how our work could be differentiated

## Reproducibility assessment

Score each from 1 to 5:

- code availability
- data availability
- hyperparameter detail
- compute transparency
- seed reporting
- evaluation clarity
- ease of reproduction

## Overall assessment

### Strengths

### Weaknesses

### Confidence in assessment

Use one of:

- high
- medium
- low

Explain why.

## Key quotations

Include only short quotations that are essential. Record page numbers.

## Open questions

## Follow-up papers to read

## Source log

- Official proceedings:
- OpenReview:
- PDF:
- Code:
- Project page:
- Other:
```

---

## 10. Conference Overview Template

Create `conference_overview.md` for each venue.

```markdown
---
conference: ICLR
years_covered:
  - 2026
  - 2025
  - 2024
last_updated: YYYY-MM-DD
---

# ICLR Research Overview

## Scope

## Years analyzed

## Number of candidate papers

## Number of fully read papers

## Number of relevant accepted papers

## Number of relevant rejected papers with public reviews

## Dominant topics

## Emerging topics

## Declining topics

## Most influential papers

## Strongest experimental papers

## Strongest theoretical papers

## Most relevant papers for our work

## Major benchmarks

## Major datasets

## Common methods

## Common evaluation patterns

## Recurring weaknesses

## Reviewer expectations

## Active groups and authors

## Competitive landscape

## Open opportunities

## Implications for our research
```

---

## 11. Trend Analysis

Create `trend_analysis.md` for every conference.

Analyze trends across at least three years.

Track:

- number of relevant papers
- topic growth or decline
- shifts in terminology
- changes in evaluation standards
- changes in benchmark usage
- changes in model scale
- movement from qualitative to quantitative evidence
- movement from neurons to features, circuits, subspaces, or sparse dictionaries
- increased interest in safety monitoring
- increased use of interventions rather than correlations
- increased demand for causal evidence
- increased focus on feature stability and reproducibility
- increased use of automated interpretability
- multimodal interpretability
- agent interpretability
- scaling behavior of interpretability methods
- benchmark saturation
- growing concern about faithfulness

For each trend include:

1. Evidence
2. Representative papers
3. Why it matters
4. Whether it is likely durable or temporary
5. Implications for future submissions

Do not label something a trend based on one paper.

---

## 12. Reviewer Preference Analysis

Create `reviewer_preferences.md`.

Use public reviews when available.

Identify what reviewers reward:

- novelty
- strong motivation
- clean problem formulation
- meaningful baselines
- scaling experiments
- robustness
- multiple seeds
- statistical rigor
- interpretable evaluation
- causal intervention
- theoretical justification
- reproducibility
- compute transparency
- broad relevance
- clear writing
- honest limitations

Identify what reviewers criticize:

- weak or outdated baselines
- unclear novelty
- excessive similarity to prior work
- claims stronger than evidence
- no human evaluation where needed
- poor metric validity
- inadequate ablations
- insufficient seeds
- limited model families
- limited layers
- limited domains
- cherry-picked examples
- purely qualitative evidence
- unclear dataset construction
- leakage
- no test of faithfulness
- no OOD evaluation
- conflating correlation with mechanism
- weak comparison against dense methods
- missing reconstruction-quality trade-offs
- missing sparsity controls
- inadequate compute reporting

For every claimed reviewer preference, record examples from multiple papers.

Separate:

- conference-specific patterns
- field-wide patterns
- year-specific effects

---

## 13. Acceptance and Rejection Analysis

Acceptance analysis must be evidence-based.

For accepted papers, evaluate:

- problem importance
- novelty
- empirical strength
- clarity
- methodological soundness
- benchmark contribution
- practical value
- theoretical value
- timeliness
- reproducibility

For rejected papers with public reviews, evaluate:

- decision scores
- confidence scores
- reviewer disagreements
- meta-review rationale
- rebuttal effectiveness
- unresolved concerns
- whether the paper was later accepted elsewhere

Never state that a paper was rejected because of a particular reason unless public evidence supports it.

Use the phrase:

```markdown
The public reviews suggest that the main decision factors were...
```

Avoid:

```markdown
The paper was rejected because...
```

unless the meta-review states this clearly.

---

## 14. Author and Lab Mapping

Create `author_and_lab_map.md`.

Track authors and groups that repeatedly publish in the target areas.

For each author or lab record:

- name
- affiliation by year
- major papers
- recurring co-authors
- main research themes
- methods they repeatedly use
- benchmarks they introduced
- direct competitors
- likely research trajectory

Classify influence using evidence:

- foundational contributor
- recurring contributor
- emerging contributor
- benchmark builder
- theory-focused group
- systems-focused group
- safety-focused group
- representation-learning group

Do not rank authors by prestige alone.

Author identity matters for understanding research programs, not for deciding whether a paper is correct.

Also identify:

- collaboration clusters
- institution clusters
- advisor-student lineages when publicly clear
- repeated cross-lab collaborations
- authors moving between labs or companies

---

## 15. Competitor and Rival Mapping

Create `competitor_map.md`.

Do not use “rival” in a personal sense. Map research competition at the method and claim level.

For every important paper, identify:

### Direct competitors

Same task, similar data, similar evaluation, overlapping claim.

### Architectural competitors

Different architecture addressing the same objective.

### Objective-level competitors

Different loss or training signal targeting the same representation property.

### Evaluation competitors

Papers proposing alternative ways to measure the same quality.

### Narrative competitors

Papers that occupy the same conceptual contribution space even if the method differs.

### Potential collaborators or complementary methods

Papers that can strengthen rather than replace our work.

Create comparison tables with fields such as:

| Paper | Core claim | Representation type | Sparse? | Supervision | Main evaluation | Strength | Weakness | Overlap with us |
|---|---|---:|---:|---|---|---|---|---|

---

## 16. Open Problem Discovery

Create `open_problems.md`.

For each open problem include:

- concise problem statement
- evidence that the problem remains open
- papers exposing the gap
- why current methods fail
- what a successful method must demonstrate
- minimum viable experiment
- strong-paper experiment
- likely suitable conferences
- novelty risk
- engineering difficulty
- compute cost
- data requirements
- possible baselines
- possible failure modes

Rank opportunities by:

1. scientific importance
2. novelty
3. feasibility
4. availability of evaluation data
5. likelihood of producing decisive evidence
6. fit with our current code and expertise
7. competitiveness at A* venues

---

## 17. Strategic Analysis for Our Research

After each conference, write a section titled:

```markdown
## Implications for Our Research Program
```

Analyze:

- claims we can still make
- claims already occupied by prior work
- baselines we must include
- evaluation methods reviewers are likely to expect
- datasets we should use
- model families we should test
- minimum number of seeds
- robustness checks
- required ablations
- likely reviewer objections
- how to preempt those objections
- possible contribution framing
- suitable conference fit

Also provide:

### Minimal publishable contribution

The smallest contribution that might be defensible.

### Strong contribution

The experiments and evidence needed for a competitive A* paper.

### Best-case contribution

The version that could define a new subproblem, benchmark, or methodology.

### Kill criteria

Conditions under which the direction should be stopped or substantially changed.

---

## 18. Evaluation of Paper Quality

Score important papers from 1 to 5 on:

- problem importance
- novelty
- technical depth
- empirical rigor
- evaluation validity
- baseline strength
- ablation quality
- reproducibility
- clarity
- lasting value
- relevance to our work

Provide a brief justification for each score.

Do not collapse the assessment into a single number without explanation.

---

## 19. Reading Discipline

When reading a paper:

1. First identify the claimed contribution.
2. Translate the claim into a falsifiable statement.
3. Identify which experiment tests that statement.
4. Check whether the metric actually measures the claimed property.
5. Check whether baselines are competitive.
6. Check whether improvements are robust across seeds, models, layers, and datasets.
7. Check whether the method trades off reconstruction, sparsity, interpretability, or compute.
8. Check whether qualitative examples are representative.
9. Inspect appendices for omitted negative results.
10. Compare the accepted paper against the closest prior work.

Always separate:

- claim
- evidence
- interpretation
- speculation

---

## 20. Special Requirements for SAE Papers

For every SAE-related paper, record:

- base model
- layer or hook point
- activation type
- activation dimensionality
- dictionary width
- expansion factor
- sparsity mechanism
- TopK, L1, JumpReLU, thresholding, or other activation rule
- reconstruction loss
- auxiliary losses
- dead feature rate
- feature density
- FVU or explained variance
- reconstruction fidelity
- downstream behavior preservation
- feature interpretability evaluation
- feature stability across seeds
- feature splitting or absorption
- scaling behavior
- compute cost
- comparison with dense representations
- comparison with PCA, ICA, NMF, dictionary learning, probes, or other decompositions
- intervention evidence
- causal evidence
- released dictionaries or code

Identify whether the paper improves:

- reconstruction
- sparsity
- interpretability
- stability
- scalability
- feature quality
- feature uniqueness
- feature controllability
- downstream usefulness

Do not treat better reconstruction as proof of better interpretability.

---

## 21. Special Requirements for Representation Learning Papers

Record:

- representation level
- supervision source
- invariance assumptions
- augmentation assumptions
- contrastive positives and negatives
- collapse prevention
- geometry objective
- dimensionality
- normalization
- alignment-uniformity trade-off
- probing protocol
- transfer protocol
- OOD evaluation
- robustness evaluation
- causal or correlational evidence
- whether representations are sparse, dense, discrete, or structured

Determine whether improvements come from:

- better objective
- better data
- more negatives
- scale
- architecture
- training duration
- stronger augmentation
- evaluation leakage

---

## 22. Special Requirements for Mechanistic Interpretability Papers

Record:

- target behavior
- model and scale
- component analyzed
- localization method
- intervention method
- causal validation
- faithfulness test
- completeness test
- human interpretation process
- automated interpretation process
- false-positive controls
- negative controls
- counterfactual tests
- generalization across prompts
- generalization across models
- whether discovered mechanisms are necessary, sufficient, both, or neither

Do not call a correlation a mechanism.

---

## 23. Citation and Evidence Rules

Every note must include a source log.

For important claims, record:

- source URL
- page number or section
- whether the claim is explicit or inferred

Use labels:

- **Fact** — directly stated or reported
- **Inference** — reasoned from evidence
- **Hypothesis** — plausible but unverified
- **Unknown** — insufficient evidence

Do not fabricate:

- acceptance reasons
- rejection reasons
- author motivations
- reviewer preferences
- institutional affiliations
- code availability
- benchmark results

---

## 24. Handling Missing or Private Reviews

When reviews are unavailable:

- state that reviews are unavailable
- do not speculate about exact reviewer opinions
- analyze likely strengths based on the paper itself
- clearly label this as interpretation

When a rejected paper has no public decision:

- record its status as unknown or unverified
- do not call it rejected

---

## 25. Incremental Progress and State Tracking

Maintain:

```text
Research_Intelligence/progress.md
```

Use this structure:

```markdown
# Progress

## Current conference

## Current year

## Current paper

## Completed conferences

## Completed papers

## Papers awaiting full reading

## Papers awaiting review analysis

## Unresolved questions

## Next actions
```

Update progress after every completed paper.

Also maintain:

```text
Research_Intelligence/master_paper_index.md
```

The master index must include:

| Paper | Conference | Year | Status | Topic | Relevance | Reading status | Note |
|---|---|---:|---|---|---|---|---|

---

## 26. Deliverables Per Conference

A conference is complete only when the following exist:

1. `index.md`
2. `conference_overview.md`
3. `candidate_papers.md` for each year
4. one note per fully read paper
5. `trend_analysis.md`
6. `reviewer_preferences.md`
7. `author_and_lab_map.md`
8. `competitor_map.md`
9. `open_problems.md`
10. `reading_queue.md`
11. `implications_for_our_work.md`
12. a conference completion audit

---

## 27. Conference Completion Audit

Create:

```text
completion_audit.md
```

Checklist:

```markdown
- [ ] Latest official proceedings checked
- [ ] At least three years reviewed
- [ ] Search terms applied broadly
- [ ] Accepted status verified
- [ ] Rejected status verified where claimed
- [ ] Public reviews examined where available
- [ ] Tier 1 papers fully read
- [ ] Major Tier 2 papers analyzed
- [ ] Major authors and labs mapped
- [ ] Direct competitors identified
- [ ] Reviewer preferences supported by examples
- [ ] Trends supported by multiple papers
- [ ] Open problems linked to evidence
- [ ] Implications for our work written
- [ ] All Markdown files pass a formatting check
- [ ] All links checked
- [ ] Uncertainties clearly marked
```

---

## 28. Writing Style

Write in clear, technical, human-readable language.

Avoid:

- vague praise
- excessive jargon without explanation
- abstract-only summaries
- unsupported claims
- marketing language
- treating benchmark gains as automatically meaningful
- saying a paper “solves” a problem unless evidence is decisive

Prefer:

- precise statements
- direct comparisons
- explicit limitations
- plain-language explanation followed by technical detail
- numerical results when relevant
- clear separation between evidence and interpretation

---

## 29. Agent Behavior

The agent must:

- work systematically
- avoid skipping difficult papers
- avoid summarizing unread papers as if fully understood
- save findings continuously
- preserve source links
- update existing notes rather than creating duplicates
- cross-link related papers
- maintain uncertainty labels
- prioritize correctness over speed

The agent must not:

- invent missing review information
- infer paper quality from author prestige
- confuse arXiv publication with conference acceptance
- use citation count as the only measure of importance
- treat all accepted papers as equally strong
- treat all rejected papers as weak
- stop at paper titles and abstracts
- merge distinct methods into one vague category

---

## 30. Execution Command

When asked to begin, follow this protocol:

```markdown
1. Select the requested conference.
2. Determine the latest completed year.
3. Create the conference folder structure.
4. Build and verify the candidate paper list.
5. Rank papers by relevance.
6. Read the highest-priority paper in full.
7. Save its Obsidian note.
8. Update the conference synthesis files.
9. Update progress.md.
10. Continue paper-by-paper until the conference completion audit passes.
```

Do not jump to another conference before completing the active one unless explicitly instructed.

---

## 31. Final Objective

The finished knowledge base should allow us to answer:

- What are the major current directions in mechanistic interpretability and representation learning?
- Which methods are direct competitors to our work?
- Which claims are already saturated?
- Which research gaps remain open?
- What evidence do top conferences demand?
- Why are strong papers accepted?
- Why do promising papers fail?
- Which authors and labs are shaping the field?
- Which benchmarks and evaluation protocols have become standard?
- What project direction has the best combination of novelty, feasibility, and publication value?
- How should our work be framed and evaluated to survive expert review?

The output must function as a research intelligence system, not a loose collection of summaries.
