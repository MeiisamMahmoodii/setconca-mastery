---
conference: ICLR
last_updated: 2026-07-17
status: in-progress
---

# ICLR — Author & Lab Map

> [!note] Author identity informs research-program mapping, NOT paper quality (CLAUDE.md §14). Built from 7 fully read ICLR 2026 Tier-1 orals.

## Harvard — AI4LIFE group (Lakkaraju lab + Calmon)
- **Himabindu (Hima) Lakkaraju** — PI, interpretability/XAI/LLM control. Foundational/recurring contributor.
- **Flavio P. Calmon** — PI, information theory / trustworthy ML.
- **Usha Bhalla** (Kempner Fellow), **Alex Oesterling** (NSF GRFP) — co-first authors; **Claudio Mayrink Verdun** (bridges to SAE-eval / David Bau / Sam Marks community via Karvonen et al. 2024).
- Paper: [[2026 - Temporal Sparse Autoencoders]]. Theme: unifying interpretability with control + evaluation.

## Stanford NLP — Potts group
- **Christopher Potts** (PI), **Satchel Grant** (lead; author of the Counterfactual-Latent loss, Grant 2025), Simon Jerome Han, Alexa R. Tartaglini.
- Paper: [[2026 - Divergent Representations from Causal Interventions]]. Theme: causal abstraction / DAS / faithfulness of interventions. Classification: recurring contributor, methodology/validity focus.

## ISTA — Locatello group
- **Francesco Locatello** (PI; causal representation learning, disentanglement), Tommaso Mencattini, Riccardo Cadei.
- Paper: [[2026 - Exploratory Causal Inference in SAEnce]]. Theme: causal representation learning meets SAEs + foundation models. Classification: representation-learning + causal group.

## UW-Madison — Sharon (Yixuan) Li group (`deeplearning-wisc`)
- **Sharon (Yixuan) Li** (PI; OOD, reliable ML), Shawn Im, Changdae Oh, Zhen Fang.
- Paper: [[2026 - How Transformers Learn to Associate Tokens]]. Theme: learning dynamics / theory of transformers. Classification: theory-leaning group.

## Imperial College London — Mediano / Monod (two distinct groups)
- **Pedro A. M. Mediano** group — Pratyaksh Sharma, Alexandra Maria Proca, Lucas Prieto. Paper: [[2026 - Temporal Superposition and Feature Geometry of RNNs]]. Theme: neuroscience-adjacent representational geometry / superposition.
- **Anthea Monod** group (+ Haim Dubossarsky) — Aideen Fay, Ines Garcia-Redondo, Qiquan Wang. Paper: [[2026 - Shape of Adversarial Influence Persistent Homology]]. Theme: topological data analysis for ML / representation geometry / AI security.

## Meta FAIR
- **Nicola Cancedda**, Naila Murray, Zheng Zhao, Yeskendir Koishekenov, Xianjun Yang.
- Paper: [[2026 - Verifying Chain-of-Thought via Computational Graph]] (CRV). Theme: applied mechanistic interpretability at scale (transcoders, attribution graphs), CoT faithfulness. Industry systems-focused group with full open-source release.

## Additional labs (from P1 posters)

- **Ohio State University** — Xudong Zhu, Zhihui Zhu (+ Mohammad Mahdi Khalili). Paper: [[2026 - AbsTopK Bidirectional SAE Features]]. Theme: sparse-coding/optimization view of SAEs. Classification: optimization-grounded interpretability.
- **University of Bristol** — Thomas Heap, Tim Lawson, Lucy Farnik, **Laurence Aitchison** (PI). Paper: [[2026 - Automated Interp Metrics Random Transformers]]. Theme: SAE evaluation validity / critique.
- **University of Amsterdam** — Gustaw Opiełka, Hannes Rosenbusch, Claire E. Stevenson. Paper: [[2026 - Causality vs Invariance Function and Concept Vectors]]. Theme: concept/function vectors, cognitive-science-informed interpretability.
- **National University of Singapore (Math)** — Dung Viet Nguyen, Yen Nhi Pham, Hieu M. Vu, Lei Zhang, **Tan Minh Nguyen** (PI). Paper: [[2026 - Activation Steering with a Feedback Controller]]. Theme: control-theoretic / mathematical ML. Tan M. Nguyen recurs across efficient-transformer/ODE-view work.
- **MPI-SP + SNU + KAIST** — Dong-Kyum Kim, Minsung Kim, Jea Kwon, Nakyeong Yang, **Meeyoung Cha** (corresponding). Paper: [[2026 - Bilinear Representation Reversal Curse Model Editing]]. Theme: representation structure + knowledge editing.
- **Northeastern University** — Hiba Ahsan, **Byron C. Wallace** (PI). Paper: [[2026 - SAEs Racial Biases in Healthcare]]. Theme: clinical NLP + interpretability/fairness. Wallace = established clinical-NLP group.

## Collaboration clusters / lineages referenced
- **SAE-eval / dictionary-learning community:** Neel Nanda, Bart Bussmann, Adam Karvonen, Joseph Bloom, David Bau, Samuel Marks, Nora Belrose (cited across SAE papers).
- **Anthropic circuits lineage:** Elhage, Olah, Ameisen, Lindsey, Dunefsky (superposition, transcoders, attribution graphs) — underpins CRV and the RNN-superposition paper.
- **Causal abstraction lineage:** Geiger, Potts, Grant (DAS, CL loss) — underpins the Divergent Representations paper.

## Preliminary observation
The 7 orals come from 7 distinct labs across 5 institutions + 1 industry lab; no single group dominates the Tier-1 oral slate. Interpretability at ICLR 2026 is **institutionally broad** (academic labs + FAIR), not concentrated. (Inference from a small sample; revisit with P1.)
