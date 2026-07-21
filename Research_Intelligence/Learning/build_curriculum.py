"""Generate papers.js for SetConCA Mastery interactive curriculum."""
import argparse
import json
import shutil
from pathlib import Path
from superposition_rich import SUPERPOSITION_RICH

ROOT = Path(__file__).parent
RAW = ROOT.parent.parent / "RAW"
EXTRACTS = json.loads((ROOT / "_extracts.json").read_text(encoding="utf-8"))

CURRICULUM = [
    {
        "id": 1,
        "title": "What is a representation?",
        "weeks": "1–2",
        "checkpoint": "Run PCA, ICA, and CCA on the same Gemma activation bank. Compare reconstruction, dimensionality, cross-view correlation, and retrieval.",
        "papers": [
            {
                "id": "pca-shlens",
                "num": 1,
                "title": "A Tutorial on Principal Component Analysis",
                "authors": "Jonathon Shlens",
                "file": "1404.1100v1.pdf",
                "learn": [
                    "Variance and covariance",
                    "Eigenvectors and singular value decomposition",
                    "Low-rank approximation and reconstruction error",
                    "Explained variance and fraction of variance unexplained (FVU)",
                    "Why PCA directions are orthogonal but not necessarily meaningful",
                ],
                "setconca": "Foundation for comparing SAE reconstruction with PCA baselines. Good reconstruction alone does not demonstrate interpretability.",
                "video": "https://www.youtube.com/watch?v=FgakZw6K1Q0",
                "optional": False,
            },
            {
                "id": "ica-shlens",
                "num": 2,
                "title": "A Tutorial on Independent Component Analysis",
                "authors": "Jonathon Shlens",
                "file": "1404.2986v1.pdf",
                "learn": [
                    "Correlation vs statistical independence",
                    "Source separation and linear unmixing",
                    "Why changing coordinates reveals latent components",
                    "Identifiability and assumptions for source recovery",
                ],
                "setconca": "Directly relevant to Concept Component Analysis (ConCA), which treats activations as mixtures of concept components.",
                "video": "https://www.youtube.com/watch?v=GD_IY1Xa7ko",
                "optional": False,
            },
            {
                "id": "cca-uurtio",
                "num": 3,
                "title": "A Tutorial on Canonical Correlation Methods",
                "authors": "Uurtio et al.",
                "file": "1711.02391v1.pdf",
                "learn": [
                    "Shared directions between two views",
                    "Canonical variables and canonical correlations",
                    "Shared vs view-specific information",
                    "Regularized, kernel, sparse, and deep CCA",
                    "Statistical significance and generalisation",
                ],
                "setconca": "After this: PCA preserves within-view variance; ICA recovers independent sources; CCA recovers cross-view correlation. Core baseline for multi-view SetConCA.",
                "optional": False,
            },
        ],
    },
    {
        "id": 2,
        "title": "Sparse representations and dictionaries",
        "weeks": "3–4",
        "checkpoint": "Compare L1 vs TopK sparsity on matched reconstruction budget. Answer: why overcomplete latents need sparsity?",
        "questions": [
            "Why does an overcomplete latent representation need sparsity?",
            "What is the difference between L1, TopK, and L0-style sparsity?",
            "Can a sparse representation still be polysemantic?",
            "Why does good reconstruction not guarantee concept recovery?",
            "What assumptions make a latent variable identifiable?",
        ],
        "papers": [
            {
                "id": "ksparse",
                "num": 4,
                "title": "k-Sparse Autoencoders",
                "authors": "Makhzani and Frey",
                "file": "1312.5663v2.pdf",
                "learn": [
                    "Overcomplete dictionaries",
                    "Encoder-decoder factorisation",
                    "Hard TopK activation",
                    "L1 sparsity vs exact k-sparsity",
                    "Why sparse codes can reconstruct dense inputs",
                ],
                "setconca": "Clearest bridge from classical sparse coding to modern TopK SAEs.",
                "optional": False,
            },
            {
                "id": "vae",
                "num": 5,
                "title": "Auto-Encoding Variational Bayes",
                "authors": "Kingma and Welling",
                "file": "1312.6114v11.pdf",
                "learn": [
                    "Latent-variable models",
                    "Approximate posterior distributions",
                    "Mean and variance parameterisation",
                    "Reparameterisation trick",
                    "Reconstruction vs regularisation; ELBO",
                ],
                "setconca": "Background for Gaussian set representations and product-of-experts aggregation.",
                "optional": False,
            },
        ],
    },
    {
        "id": 3,
        "title": "Nonlinear multi-view representation learning",
        "weeks": "5–6",
        "checkpoint": "Implement shared/private latent decomposition. Visualise what gets aligned vs discarded.",
        "key_lesson": "Do not force all views to become identical. Distinguish shared information from view-specific information.",
        "papers": [
            {"id": "dcca", "num": 6, "title": "Deep Canonical Correlation Analysis", "authors": "Andrew et al.", "file": "andrew13.pdf", "learn": ["Nonlinear view encoders", "Correlation-maximising objectives", "Whitening and covariance constraints", "Maximising correlation while discarding useful information"], "setconca": "Nonlinear extension of CCA — precursor to coordinating SAE views.", "optional": False},
            {"id": "dccae", "num": 7, "title": "On Deep Multi-View Representation Learning", "authors": "Wang et al.", "file": "1602.01024v1.pdf", "learn": ["DCCAE trade-offs", "Cross-view correlation vs within-view reconstruction", "Shared representation vs information preservation"], "setconca": "Central difficulty: coordinate across views without destroying activation information.", "optional": False},
            {"id": "vcca", "num": 8, "title": "Deep Variational Canonical Correlation Analysis", "authors": "Wang et al.", "file": "1610.03454v3.pdf", "learn": ["Shared and private latent variables", "Generative multi-view modelling", "Missing views", "Probabilistic cross-view alignment"], "setconca": "Directly relevant to probabilistic multi-view SetConCA experiments.", "optional": False},
            {"id": "dgcca", "num": 9, "title": "Deep Generalized Canonical Correlation Analysis", "authors": "Benton et al.", "file": "1702.02519v2.pdf", "learn": ["Extending CCA to arbitrary numbers of views", "Common representation across several views", "Multi-view information decomposition"], "setconca": "Conceptual motivation for multi-view SetConCA.", "optional": False},
        ],
    },
    {
        "id": 4,
        "title": "Learning representations of sets",
        "weeks": "7",
        "checkpoint": "Compare mean pooling, Deep Sets, Set Transformer, and Gaussian product-of-experts on reconstruction, view removal, intruder robustness, set-size generalisation.",
        "papers": [
            {"id": "deepsets", "num": 10, "title": "Deep Sets", "authors": "Zaheer et al.", "file": "1703.06114v3.pdf", "learn": ["Permutation invariance and equivariance", "f(X)=ρ(Σφ(x)) form", "What mean/sum pooling preserves or loses", "Why ordering should not affect set representation"], "setconca": "Essential for aggregating multiple activation views into one concept code.", "optional": False},
            {"id": "neural-stat", "num": 11, "title": "Towards a Neural Statistician", "authors": "Edwards and Storkey", "file": "1606.02185v2.pdf", "learn": ["Set as object with latent representation", "Reconstruct members vs distribution", "Set-level latent capturing shared structure"], "setconca": "What should a set code represent for a group of related activations?", "optional": False},
            {"id": "set-transformer", "num": 12, "title": "Set Transformer", "authors": "Lee et al.", "file": "1810.00825v3.pdf", "learn": ["Self-attention over set members", "Inducing points and attention pooling", "Expressivity vs computational complexity"], "setconca": "When set meaning cannot be recovered from simple mean pooling.", "optional": False},
            {"id": "multi-set-transformer", "num": None, "title": "Learning Functions on Multiple Sets using Multi-Set Transformers", "authors": "Selby et al.", "file": "selby22a.pdf", "learn": ["Relationships between several sets", "Multi-set attention"], "setconca": "Optional advanced reading for cross-set relationships.", "optional": True},
        ],
    },
    {
        "id": 5,
        "title": "Contrastive representation learning",
        "weeks": "8–9",
        "checkpoint": "Ablate positive definition, temperature, and projection head. Measure alignment vs uniformity.",
        "questions": [
            "Exactly what creates a positive pair?",
            "What semantic information do positives genuinely share?",
            "Can negatives be false negatives?",
            "Does low loss imply recovery of the intended concept?",
            "Is temperature changing geometry or merely optimisation?",
        ],
        "papers": [
            {"id": "cpc", "num": 13, "title": "Representation Learning with Contrastive Predictive Coding", "authors": "van den Oord et al.", "file": "1807.03748v2.pdf", "learn": ["Positive and negative pairs", "InfoNCE and density-ratio interpretation", "Mutual-information motivation", "Temperature and similarity functions"], "setconca": "Conceptual foundation for contrastive coordination of SAE views.", "optional": False},
            {"id": "simclr", "num": 14, "title": "A Simple Framework for Contrastive Learning of Visual Representations (SimCLR)", "authors": "Chen et al.", "file": "2002.05709v3.pdf", "learn": ["Data augmentation", "Projection heads", "Batch size, normalisation, temperature", "Definition of positive pairs"], "setconca": "Template for designing contrastive view generation.", "optional": False},
            {"id": "supcon", "num": 15, "title": "Supervised Contrastive Learning", "authors": "Khosla et al.", "file": "2004.11362v5.pdf", "learn": ["Multiple-positive objectives", "Positive averaging", "Class-conditioned geometry", "Within-class compactness and between-class separation"], "setconca": "Directly relevant to multi-view positives from the same semantic object.", "optional": False},
            {"id": "align-unif", "num": 16, "title": "Understanding Contrastive Representation Learning through Alignment and Uniformity", "authors": "Wang and Isola", "file": "2005.10242v10.pdf", "learn": ["Alignment: positives should be close", "Uniformity: avoid representation collapse", "Decomposing contrastive objectives"], "setconca": "Interpret positive/negative cosine and pos-minus-neg separation.", "optional": False},
            {"id": "vicreg", "num": 17, "title": "VICReg: Variance-Invariance-Covariance Regularization", "authors": "Bardes et al.", "file": "2105.04906v3.pdf", "learn": ["Invariance between related views", "Variance preservation against collapse", "Covariance reduction against redundancy"], "setconca": "Useful regularisers when pure contrastive alignment damages reconstruction.", "optional": False},
            {"id": "cl-inverts", "num": None, "title": "Contrastive Learning Inverts the Data Generating Process", "authors": "Zimmermann et al.", "file": "zimmermann21a.pdf", "learn": ["When contrastive objectives recover latent factors", "InfoNCE identifiability conditions"], "setconca": "Optional: when does contrastive learning recover concepts vs retrieval geometry?", "optional": True},
        ],
    },
    {
        "id": 6,
        "title": "Measuring and comparing representations",
        "weeks": "10",
        "checkpoint": "Build evaluation notebook: CKA, SVCCA, linear probe, MDL probe, and control tasks on your representations.",
        "metric_table": True,
        "papers": [
            {"id": "svcca", "num": 18, "title": "SVCCA: Singular Vector Canonical Correlation Analysis", "authors": "Raghu et al.", "file": "1706.05806v2.pdf", "learn": ["Combining dimensionality reduction with CCA", "Comparing subspaces across models/layers", "Affine-invariant representation comparison"], "setconca": "Baseline for comparing SAE dictionaries across seeds and architectures.", "optional": False},
            {"id": "cka", "num": 19, "title": "Similarity of Neural Network Representations Revisited (CKA)", "authors": "Kornblith et al.", "file": "1905.00414v4.pdf", "learn": ["Gram matrices", "Invariance to orthogonal transformations", "Linear vs kernel CKA", "Why coordinate-wise matching misleads"], "setconca": "Essential for comparing multi-view SetConCA against pointwise SAEs.", "optional": False},
            {"id": "probe-control", "num": 20, "title": "Designing and Interpreting Probes with Control Tasks", "authors": "Hewitt and Liang", "file": "1909.03368v1.pdf", "learn": ["Probe selectivity", "Control tasks", "Distinguishing extractability from organisation"], "setconca": "Do not over-interpret high probe accuracy on SAE features.", "optional": False},
            {"id": "mdl-probe", "num": 21, "title": "Information-Theoretic Probing with Minimum Description Length", "authors": "Voita and Titov", "file": "2003.12298v1.pdf", "learn": ["Description length vs accuracy", "Information organisation vs mere existence"], "setconca": "High probe accuracy ≠ accessible concept structure.", "optional": False},
        ],
    },
    {
        "id": 7,
        "title": "Mechanistic interpretability foundations",
        "weeks": "11–12",
        "checkpoint": "Write mechanistic interpretation notes connecting superposition theory to your activation geometry.",
        "papers": [
            {"id": "transformer-circuits", "num": 22, "title": "A Mathematical Framework for Transformer Circuits", "authors": "Elhage et al.", "file": None, "learn": ["Residual-stream decomposition", "QK and OV circuits", "Paths through transformers", "Mechanistic vs correlational analysis"], "setconca": "Context for where SAE features live in the residual stream.", "url": "https://transformer-circuits.pub/2021/framework/index.html", "optional": False, "missing_local": True},
            {"id": "superposition", "num": 23, "title": "Toy Models of Superposition", "authors": "Elhage et al. (Anthropic)", "file": "2209.pdf", "learn": [
                "Superposition: more features than dimensions via almost-orthogonal directions",
                "Polysemantic vs monosemantic neurons — both can coexist",
                "Feature benefit vs interference — two competing forces",
                "Phase changes: not learned → superposition → dedicated dimension",
                "Feature dimensionality D_i and sticky geometric points (½, ⅔, ¾…)",
                "Uniform polytopes: digons, triangles, pentagons, tetrahedra (Thomson problem)",
                "Linear model = PCA (no superposition); ReLU enables superposition",
                "Correlated features → orthogonal local bases; anti-correlated → negative interference",
                "Computation in superposition (absolute value circuit)",
                "Three ways out: no superposition, overcomplete basis (SAEs), hybrid",
                "Adversarial vulnerability increases >3× with superposition",
            ], "setconca": "Conceptual foundation for why SAEs are needed — SAEs are literally 'Approach 2: Finding an Overcomplete Basis' from this paper.", "url": "https://transformer-circuits.pub/2022/toy_model/index.html", "optional": False, "richContent": SUPERPOSITION_RICH},
            {"id": "monosemanticity", "num": 24, "title": "Towards Monosemanticity: Decomposing Language Models with Dictionary Learning", "authors": "Bricken et al.", "file": "Bricken - 2023 - Towards Monosemanticity Decomposing Language Mode.pdf", "learn": ["Features vs neurons", "Dictionary overcompleteness", "Feature splitting and polysemanticity", "Automated and manual interpretation"], "setconca": "First large-scale dictionary learning on LM activations.", "optional": False},
            {"id": "cunningham-sae", "num": 25, "title": "Sparse Autoencoders Find Highly Interpretable Features in Language Models", "authors": "Cunningham et al.", "file": "2309.08600v3.pdf", "learn": ["SAE architecture", "Reconstruction and sparsity objectives", "Feature interpretation and interventions", "Comparisons against neurons"], "setconca": "Central academic SAE paper — core reference.", "optional": False},
            {"id": "scaling-mono", "num": 26, "title": "Scaling Monosemanticity", "authors": "Templeton et al.", "file": "2605.29358v1.pdf", "learn": ["Scaling SAE dictionaries to large LMs", "Limitations at scale", "Completeness and uniqueness challenges"], "setconca": "Scale alone does not guarantee canonical decomposition.", "optional": False},
        ],
    },
    {
        "id": 8,
        "title": "Modern SAE architectures",
        "weeks": "13–14",
        "checkpoint": "Train L1, TopK, Gated, JumpReLU, BatchTopK, Matryoshka SAEs at matched reconstruction/sparsity. Plot Pareto curves.",
        "papers": [
            {"id": "topk-sae", "num": 27, "title": "Scaling and Evaluating Sparse Autoencoders", "authors": "Gao et al.", "file": "2406.04093v1.pdf", "learn": ["TopK SAEs", "Dictionary width and expansion factor", "Reconstruction-sparsity frontiers", "Compare at matched sparsity or fidelity"], "setconca": "Main reference for TopK SAE training and evaluation.", "optional": False},
            {"id": "gated-sae", "num": 28, "title": "Improving Dictionary Learning with Gated Sparse Autoencoders", "authors": "Rajamanoharan et al.", "file": "2404.16014v2.pdf", "learn": ["Separating activation gate from magnitude", "Addressing L1 shrinkage"], "setconca": "Architecture choice affects feature quality at same sparsity.", "optional": False},
            {"id": "jumprelu", "num": 29, "title": "Jumping Ahead: Improving Reconstruction Fidelity with JumpReLU SAEs", "authors": "Rajamanoharan et al.", "file": "2407.14435v3.pdf", "learn": ["Learned activation threshold", "L0-style sparsity optimisation"], "setconca": "Why L1 SAEs are no longer the default.", "optional": False},
            {"id": "batchtopk", "num": 30, "title": "BatchTopK Sparse Autoencoders", "authors": "Bussmann and Leask", "file": "2412.06410v1.pdf", "learn": ["Batch-level sparsity constraints", "Variable features per token"], "setconca": "Flexible sparsity for heterogeneous activations.", "optional": False},
            {"id": "matryoshka", "num": 31, "title": "Learning Multi-Level Features with Matryoshka Sparse Autoencoders", "authors": "Bussmann et al.", "file": "2503.17547v1.pdf", "learn": ["Hierarchical features at multiple sparsity levels", "Atomic vs high-level concepts", "Nested representations"], "setconca": "Relevant to multi-granularity concept structure in SetConCA.", "optional": False},
        ],
    },
    {
        "id": 9,
        "title": "SAE evaluation and failure modes",
        "weeks": "15",
        "checkpoint": "Design evaluation protocol using SAEBench families. Document what each metric does and does not establish.",
        "papers": [
            {"id": "principled-eval", "num": 32, "title": "Towards Principled Evaluations of Sparse Autoencoders for Interpretability and Control", "authors": "Makelov et al.", "file": "2405.08366v3.pdf", "learn": ["Task-relevant approximation and control", "Why reconstruction/sparsity alone fail"], "setconca": "Required reading before proposing new SAE methods.", "optional": False},
            {"id": "absorption", "num": 33, "title": "A is for Absorption: Studying Feature Splitting and Absorption in Sparse Autoencoders", "authors": "Chanin et al.", "file": "2409.14507v6.pdf", "learn": ["Feature splitting: one concept across features", "Feature absorption: one feature, many concepts"], "setconca": "Challenges atomic concept assumption.", "optional": False},
            {"id": "non-canonical", "num": 34, "title": "Sparse Autoencoders Do Not Find Canonical Units of Analysis", "authors": "Leask et al.", "file": "2502.04878v1.pdf", "learn": ["Different decompositions at same quality", "Stitching and higher-level analysis"], "setconca": "Critical for SetConCA research narrative.", "optional": False},
            {"id": "saebench", "num": 35, "title": "SAEBench: A Comprehensive Benchmark for Sparse Autoencoders", "authors": "Karvonen et al.", "file": "2503.09532v4.pdf", "learn": ["Multiple evaluation families", "Feature detection, steering, reconstruction", "Proxy metrics vs downstream usefulness"], "setconca": "Standard evaluation suite to replicate.", "optional": False},
            {"id": "bench-reliable", "num": 36, "title": "Are Sparse Autoencoder Benchmarks Reliable?", "authors": "Chanin", "file": "2605.18229v1.pdf", "learn": ["Auditing SAEBench assumptions", "Reseed noise and ground-truth correlation"], "setconca": "Read after SAEBench — calibrate metric trust.", "optional": False},
            {"id": "feature-hedging", "num": None, "title": "Feature Hedging: Correlated Features Break Narrow Sparse Autoencoders", "authors": "Chanin et al.", "file": "2505.11756v2.pdf", "learn": ["Correlated concepts merge in narrow dictionaries"], "setconca": "Optional: dictionary width requirements.", "optional": True},
            {"id": "geometric-wall", "num": None, "title": "The Geometric Wall: Manifold Structure Predicts Layerwise SAE Scaling Laws", "authors": "Zaher et al.", "file": "2605.09887v1.pdf", "learn": ["Intrinsic activation geometry limits SAE scaling"], "setconca": "Optional: layer-wise scaling constraints.", "optional": True},
        ],
    },
    {
        "id": 10,
        "title": "Papers closest to SetConCA research",
        "weeks": "16",
        "checkpoint": "Write 3 research hypotheses: one assumption to challenge, one experiment to reproduce, one SetConCA extension.",
        "central_question": "Under what assumptions does multi-view supervision cause a sparse dictionary to recover more stable, complete, specific, or causally useful concepts than a pointwise SAE?",
        "papers": [
            {"id": "temporal-sae", "num": 37, "title": "Temporal Sparse Autoencoders", "authors": "Bhalla et al.", "file": "2511.05541v2.pdf", "learn": ["Temporal coordination between adjacent tokens", "Contrastive regularisation on SAE codes", "Sparsity vs temporal consistency"], "setconca": "SetConCA generalises from temporal pairs to multi-view semantic objects.", "optional": False},
            {"id": "conca", "num": 38, "title": "Concept Component Analysis", "authors": "Liu et al.", "file": "2601.20420v2.pdf", "learn": ["Generative process for concept components", "Log-posterior representation", "Identifiability and linear unmixing"], "setconca": "Alternative decomposition framework — direct competitor/complement.", "optional": False},
            {"id": "mv-causal", "num": 39, "title": "Multi-View Causal Representation Learning with Partial Observability", "authors": "Yao et al.", "file": "2311.04056v2.pdf", "learn": ["When multiple views permit latent recovery", "Partial observability", "Identifiability under explicit assumptions"], "setconca": "Theoretical foundation for multi-view concept identifiability.", "optional": False},
        ],
    },
]

METRIC_TABLE = [
    ["Reconstruction / FVU", "Information preservation", "Interpretability or atomicity"],
    ["L0, L1, active features", "Sparsity", "Monosemanticity"],
    ["Dead-feature rate", "Dictionary utilisation", "Feature quality"],
    ["CKA / SVCCA", "Subspace similarity", "Same individual concepts"],
    ["Recall@1 / MRR", "Neighbourhood alignment", "Causal relevance or disentanglement"],
    ["Pos-minus-neg cosine", "Contrastive separation", "Concept completeness"],
    ["Linear probe", "Decodability", "Representation causally uses concept"],
    ["k-sparse probe", "Sparse decodability", "SAE features are canonical"],
    ["Steering / ablation", "Intervention effect", "Complete causal mechanism"],
    ["Seed stability", "Repeatability", "Correct semantic decomposition"],
]

QUIZ_BANK = {
    "pca-shlens": [
        {"q": "PCA finds directions that maximise ___?", "options": ["Variance", "Independence", "Cross-view correlation", "Sparsity"], "a": 0, "explain": "PCA maximises variance captured by each successive orthogonal direction."},
        {"q": "High PCA reconstruction quality implies interpretable features?", "options": ["True", "False"], "a": 1, "explain": "PCA optimises variance, not semantic meaning. Orthogonal directions need not align with concepts."},
    ],
    "ica-shlens": [
        {"q": "ICA seeks statistically ___ components.", "options": ["Correlated", "Independent", "Identical", "Sparse only"], "a": 1, "explain": "ICA separates sources by statistical independence, stronger than uncorrelatedness."},
        {"q": "ICA is most relevant to ConCA because both assume ___?", "options": ["Linear mixing of latent sources", "TopK sparsity", "Contrastive pairs", "Permutation invariance"], "a": 0, "explain": "ConCA treats activations as linear mixtures of concept components — same unmixing intuition as ICA."},
    ],
    "cca-uurtio": [
        {"q": "CCA maximises correlation between ___?", "options": ["Two views' canonical variables", "Within-view variance", "Reconstruction error", "Sparsity penalty"], "a": 0, "explain": "CCA finds linear projections of two views that are maximally correlated."},
    ],
    "ksparse": [
        {"q": "k-Sparse Autoencoders enforce sparsity via ___?", "options": ["L1 penalty only", "Exactly k active units", "Dropout", "Batch normalisation"], "a": 1, "explain": "Hard TopK keeps exactly k largest activations — direct ancestor of TopK SAEs."},
        {"q": "Why can sparse codes still reconstruct dense inputs?", "options": ["Overcomplete dictionary", "No encoder needed", "PCA whitening", "BatchTopK only"], "a": 0, "explain": "Many more dictionary atoms than input dimensions allow sparse combinations to span the input space."},
    ],
    "vae": [
        {"q": "The ELBO trades off reconstruction against ___?", "options": ["KL to prior", "TopK sparsity", "CKA alignment", "Probe accuracy"], "a": 0, "explain": "VAEs regularise the approximate posterior toward the prior via KL divergence."},
    ],
    "dcca": [
        {"q": "DCCA can maximise correlation while discarding ___?", "options": ["View-specific information", "All information", "Gradients", "Parameters"], "a": 0, "explain": "Correlation-only objectives may ignore useful private structure in each view."},
    ],
    "deepsets": [
        {"q": "Deep Sets guarantees ___ to input order.", "options": ["Invariance", "Sensitivity", "Causality", "Sparsity"], "a": 0, "explain": "f(X)=ρ(Σφ(x)) is unchanged under permutation of set members."},
    ],
    "supcon": [
        {"q": "SupCon differs from SimCLR by allowing ___?", "options": ["Multiple positives per anchor", "No negatives", "No projection head", "Kernel CKA loss"], "a": 0, "explain": "All same-class samples are positives — key for multi-view concept groups."},
    ],
    "vicreg": [
        {"q": "VICReg prevents collapse via a ___ term.", "options": ["Variance", "L0", "MDL", "Steering"], "a": 0, "explain": "Variance preservation stops all representations collapsing to a point."},
    ],
    "superposition": [
        {"q": "Superposition allows ___ features in ___ dimensions.", "options": ["Fewer; more", "More; fewer", "Equal; equal", "None; infinite"], "a": 1, "explain": "Models can represent more sparse features than dimensions via interference."},
        {"q": "Linear models without ReLU can superpose features because of PCA.", "options": ["True", "False"], "a": 1, "explain": "Linear models perform PCA — they never represent more than m orthogonal features. ReLU enables superposition."},
        {"q": "Feature dimensionality D_i = ½ corresponds to ___?", "options": ["Antipodal pair", "Dedicated dimension", "Not learned", "Pentagon"], "a": 0, "explain": "Two features sharing one dimension equally → D_i = 1/(1+1) = ½."},
        {"q": "SAEs in this paper's framework are which 'way out'?", "options": ["Approach 2: overcomplete basis", "Approach 1: no superposition", "Ignore superposition", "Only adversarial training"], "a": 0, "explain": "Sparse autoencoders / dictionary learning = finding an overcomplete basis after the fact."},
        {"q": "Adversarial vulnerability ___ as superposition forms.", "options": ["Increases >3×", "Decreases", "Stays constant", "Disappears"], "a": 0, "explain": "Interference in W^T W creates attack surface; vulnerability tracks features-per-dimension."},
    ],
    "cunningham-sae": [
        {"q": "SAEs address polysemanticity by learning ___?", "options": ["Sparse dictionary features", "More neurons", "Bigger embeddings", "PCA components"], "a": 0, "explain": "Overcomplete sparse dictionaries decompose superposed activations into interpretable features."},
    ],
    "non-canonical": [
        {"q": "Different SAEs with similar reconstruction may find ___?", "options": ["Different decompositions", "Identical features", "No features", "Only PCA directions"], "a": 0, "explain": "There is no guaranteed canonical sparse decomposition — a key SetConCA narrative point."},
    ],
    "cka": [
        {"q": "CKA is invariant to ___ transformations.", "options": ["Orthogonal", "Nonlinear", "Random noise", "Permutation of samples only"], "a": 0, "explain": "CKA compares representation geometry, not individual neuron alignment."},
    ],
    "probe-control": [
        {"q": "High probe accuracy without control tasks may indicate ___?", "options": ["Probe memorisation", "Causal mechanism", "Monosemanticity", "Canonical decomposition"], "a": 0, "explain": "Control tasks reveal whether the probe itself is doing the work."},
    ],
    "temporal-sae": [
        {"q": "Temporal SAEs use ___ as related pairs.", "options": ["Adjacent token activations", "Random tokens", "Different models", "Dead features"], "a": 0, "explain": "Sequential language structure provides natural positive pairs for contrastive coordination."},
        {"q": "SetConCA generalises temporal pairs to ___?", "options": ["Multi-view semantic objects", "Different models only", "PCA directions", "Dead features"], "a": 0, "explain": "Your project coordinates multiple views of the same concept, not just adjacent tokens."},
    ],
    "conca": [
        {"q": "ConCA recovers concepts via ___?", "options": ["Linear unmixing", "TopK SAE only", "Mean pooling", "SimCLR"], "a": 0, "explain": "ConCA assumes a linear mixture generative model — closer to ICA than standard SAE training."},
    ],
}

for level in CURRICULUM:
    for paper in level["papers"]:
        fname = paper.get("file")
        if fname and fname in EXTRACTS:
            paper["abstract"] = EXTRACTS[fname].get("abstract", "")
            paper["pages"] = EXTRACTS[fname].get("pages", 0)
        else:
            paper.setdefault("abstract", "")


def write_papers_js(pdf_prefix: str, out_path: Path) -> None:
    data = json.loads(json.dumps({
        "title": output_base["title"],
        "subtitle": output_base["subtitle"],
        "formula": output_base["formula"],
        "levels": CURRICULUM,
        "metricTable": METRIC_TABLE,
        "schedule16Weeks": output_base["schedule16Weeks"],
    }))
    for level in data["levels"]:
        for paper in level["papers"]:
            fname = paper.get("file")
            if fname:
                paper["pdfPath"] = f"{pdf_prefix}{fname}"
            if paper["id"] in QUIZ_BANK:
                paper["quiz"] = QUIZ_BANK[paper["id"]]
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(
        "window.CURRICULUM_DATA = " + json.dumps(data, indent=2, ensure_ascii=False) + ";\n",
        encoding="utf-8",
    )


output_base = {
    "title": "SetConCA Mastery Path",
    "subtitle": "From representation foundations to multi-view sparse autoencoders",
    "formula": "SetConCA = Sparse dictionary learning + Multi-view learning + Set representation + Contrastive coordination",
    "levels": CURRICULUM,
    "metricTable": METRIC_TABLE,
    "schedule16Weeks": [
        {"weeks": "1–2", "topic": "PCA, ICA, CCA", "output": "Implement and compare decompositions"},
        {"weeks": "3–4", "topic": "Sparse AEs and VAEs", "output": "L1 vs TopK experiment"},
        {"weeks": "5–6", "topic": "DCCA, DCCAE, VCCA, DGCCA", "output": "Shared/private latent analysis"},
        {"weeks": "7", "topic": "Deep Sets, Set Transformer", "output": "Aggregator comparison"},
        {"weeks": "8–9", "topic": "CPC, SupCon, alignment, VICReg", "output": "Contrastive-loss ablations"},
        {"weeks": "10", "topic": "SVCCA, CKA, probing", "output": "Evaluation notebook"},
        {"weeks": "11–12", "topic": "Circuits and superposition", "output": "Mechanistic notes"},
        {"weeks": "13–14", "topic": "Modern SAE architectures", "output": "Matched Pareto comparison"},
        {"weeks": "15", "topic": "SAE failure modes", "output": "Evaluation protocol"},
        {"weeks": "16", "topic": "Temporal SAE, ConCA, MV causal", "output": "SetConCA research hypotheses"},
    ],
}

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--web", action="store_true", help="Web paths (RAW/...) for GitHub Pages")
    parser.add_argument("--out", type=Path, default=ROOT / "setconca-mastery" / "papers.js")
    args = parser.parse_args()
    prefix = "RAW/" if args.web else "../../../RAW/"
    write_papers_js(prefix, args.out)
    print(f"Wrote {args.out} — {sum(len(l['papers']) for l in CURRICULUM)} papers (pdf prefix: {prefix})")
