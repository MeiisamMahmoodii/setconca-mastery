"""Course intro and level primers — self-contained lectures before papers."""

COURSE_INTRO = {
    "title": "SetConCA Mastery",
    "promise": "By the end of this course you will understand every idea in the curriculum without opening a PDF. Each module teaches the paper in full.",
    "formula": "SetConCA = Sparse dictionary learning + Multi-view learning + Set representation + Contrastive coordination",
    "howToUse": [
        "Start at Level 1. Read the Level Primer (the lecture) first.",
        "Open each paper module in order. Read every section — Plain English, Key Ideas, Math, Vocabulary.",
        "Complete the Mastery Checklist and Quiz before moving on.",
        "Do the Practical Checkpoint when a level has one.",
        "Do not skip levels — later papers assume earlier vocabulary.",
    ],
    "pathMap": (
        "Levels 1–2 teach classical decompositions and sparse codes. "
        "Levels 3–5 teach multi-view, sets, and contrastive coordination. "
        "Level 6 teaches how to measure representations honestly. "
        "Levels 7–9 teach why SAEs exist, how they are built, and how they fail. "
        "Level 10 connects everything to SetConCA."
    ),
}

LEVEL_PRIMERS = {
    1: {
        "title": "What is a representation?",
        "mission": "Explain PCA, ICA, and CCA, and know which objective each uses.",
        "beforeYouStart": "None — this is the starting point.",
        "primer": (
            "A representation is a transformed version of data that makes some structure easier to use. "
            "Raw activations from a language model are high-dimensional vectors. We rarely care about every coordinate. "
            "We care about directions that carry meaning.\n\n"
            "Three classical tools answer three different questions.\n\n"
            "PCA asks: which directions capture the most variance inside one view? "
            "It finds orthogonal axes ordered by how much spread they explain. "
            "Analogy: rotate a cloud of points so the longest axis of the cloud comes first. "
            "PCA is the baseline for reconstruction quality (FVU). High reconstruction does not mean the axes are concepts.\n\n"
            "ICA asks: which directions are statistically independent sources mixed together? "
            "Independence is stronger than zero correlation. "
            "Analogy: unmixing two overlapping voices from a recording. "
            "This is the mental model behind Concept Component Analysis (ConCA).\n\n"
            "CCA asks: which directions line up between two views of the same thing? "
            "Analogy: find the shared signal between audio and video of the same speech. "
            "This is the ancestor of multi-view SetConCA.\n\n"
            "After this level, memorize: PCA = within-view variance; ICA = independent sources; CCA = cross-view correlation."
        ),
        "bigPictureDiagram": [
            "One view  → PCA  → keep variance axes",
            "One view  → ICA  → unmix independent sources",
            "Two views → CCA  → shared correlated directions",
        ],
        "conceptsToMaster": [
            {"name": "Variance / covariance", "simple": "How much a variable spreads; how two variables co-move.", "deeper": "Covariance matrix C = E[(x−μ)(x−μ)ᵀ]. PCA diagonalizes it."},
            {"name": "Eigenvector / SVD", "simple": "Special directions that only stretch under a matrix.", "deeper": "SVD X=UΣVᵀ gives principal directions as columns of V (or U)."},
            {"name": "FVU", "simple": "Fraction of variance left unexplained after reconstruction.", "deeper": "FVU=1−explained_variance_fraction. Used later for SAE fidelity."},
            {"name": "Independence vs correlation", "simple": "Uncorrelated ≠ independent.", "deeper": "ICA needs independence (or non-Gaussianity) for source recovery."},
            {"name": "Canonical correlation", "simple": "Max correlation after projecting two views.", "deeper": "CCA finds (u,v) maximizing corr(Xu, Yv) under unit variance."},
        ],
        "checkpoint": {
            "goal": "Compare PCA, ICA, CCA on the same activation bank.",
            "steps": [
                "Take Gemma activations for the same set of prompts.",
                "Run PCA; record FVU vs number of components.",
                "Run ICA; inspect recovered components.",
                "Split views (e.g. two layers or two paraphrases); run CCA.",
                "Compare reconstruction, dimensionality, cross-view correlation, retrieval.",
            ],
            "successLooksLike": "You can say which method wins on which metric and why that metric is not interpretability.",
        },
        "bridgeToNext": "Sparse autoencoders keep the reconstruction idea from PCA but add overcomplete sparse codes.",
    },
    2: {
        "title": "Sparse representations and dictionaries",
        "mission": "Explain why overcomplete codes need sparsity, and how TopK differs from L1 and from VAEs.",
        "beforeYouStart": "Level 1 — especially FVU and linear unmixing.",
        "primer": (
            "If you have more dictionary atoms than input dimensions (overcomplete), a dense code can always reconstruct by using many tiny weights. "
            "That is useless for interpretability — every atom becomes a mush of everything.\n\n"
            "Sparsity forces each activation to use only a few atoms. Then atoms can specialize.\n\n"
            "k-Sparse Autoencoders keep exactly the top-k encoder activations. This is the ancestor of TopK SAEs.\n\n"
            "VAEs are different: they learn a probabilistic latent with a prior, using the ELBO. "
            "You need this vocabulary for Gaussian set aggregations and product-of-experts later — not to become a VAE researcher.\n\n"
            "Critical lesson: sparse + good reconstruction ≠ monosemantic concept recovery."
        ),
        "bigPictureDiagram": [
            "Dense x → Encoder → Overcomplete z → keep sparse → Decoder → x̂",
            "L1: soft shrink magnitudes | TopK: hard keep k | L0: count of nonzeros",
        ],
        "conceptsToMaster": [
            {"name": "Overcomplete dictionary", "simple": "More features than dimensions.", "deeper": "Needed if many sparse concepts live in a small activation space (superposition)."},
            {"name": "TopK vs L1", "simple": "TopK = exact k actives; L1 = soft penalty that also shrinks magnitudes.", "deeper": "L1 shrinkage motivates Gated SAEs later."},
            {"name": "ELBO", "simple": "Lower bound on log likelihood: reconstruct − KL to prior.", "deeper": "VAE trains with reparameterization so gradients flow through sampling."},
        ],
        "checkpoint": {
            "goal": "Train L1 vs TopK under matched reconstruction.",
            "steps": ["Fix FVU budget", "Vary sparsity", "Compare active features and qualitative codes"],
            "successLooksLike": "You can answer all Level-2 questions without notes.",
        },
        "bridgeToNext": "Multi-view methods ask how to align several representations without destroying private information.",
    },
    3: {
        "title": "Nonlinear multi-view representation learning",
        "mission": "Separate shared vs view-specific information; know DCCA, DCCAE, VCCA, DGCCA.",
        "beforeYouStart": "CCA from Level 1; reconstruction from Level 2.",
        "primer": (
            "A view is one observation of the same underlying object: two layers, two paraphrases, two modalities, or several activation sites.\n\n"
            "Linear CCA finds shared linear directions. Deep CCA replaces the linear maps with neural nets.\n\n"
            "Danger: maximizing correlation alone can throw away useful view-specific structure. "
            "DCCAE adds reconstruction to protect information. VCCA uses shared and private latents in a generative model. "
            "DGCCA extends the idea to many views.\n\n"
            "SetConCA must not force all views to become identical. Align what is shared; preserve what is private."
        ),
        "bigPictureDiagram": [
            "View A ─┐",
            "         ├─→ shared z  → align",
            "View B ─┘      private z_a, z_b → reconstruct each view",
        ],
        "conceptsToMaster": [
            {"name": "Shared vs private", "simple": "Shared = common across views; private = view-only.", "deeper": "Aligning everything can erase useful activation structure."},
            {"name": "Whitening / covariance constraints", "simple": "Normalize so correlation is meaningful.", "deeper": "DCCA typically constrains latent covariance."},
        ],
        "checkpoint": {
            "goal": "Visualize shared vs private latents.",
            "steps": ["Train a simple multi-view model", "Ablate shared vs private", "See what retrieval vs reconstruction need"],
            "successLooksLike": "You refuse to equate 'aligned' with 'identical'.",
        },
        "bridgeToNext": "When views form an unordered set, you need set architectures.",
    },
    4: {
        "title": "Learning representations of sets",
        "mission": "Build permutation-invariant aggregators and know when mean pooling fails.",
        "beforeYouStart": "Shared/private multi-view from Level 3.",
        "primer": (
            "A set has no order. The representation of {a,b,c} must equal that of {c,a,b}.\n\n"
            "Deep Sets proves a universal form: encode each member with φ, sum (or pool), then transform with ρ. "
            "Mean pooling is a special case — and it can lose pairwise structure.\n\n"
            "Set Transformer lets members talk via attention before pooling.\n\n"
            "Neural Statistician treats a whole dataset as one object with a latent — useful when the set code should capture a distribution, not one member.\n\n"
            "In SetConCA, a concept may appear as several activation views. Aggregation choice is a first-class design decision."
        ),
        "bigPictureDiagram": [
            "members → φ(x) → SUM/ATTN pool → ρ → set code",
        ],
        "conceptsToMaster": [
            {"name": "Permutation invariance", "simple": "Order does not change the output.", "deeper": "f(π(X))=f(X) for any permutation π."},
            {"name": "Equivariance", "simple": "Permuting inputs permutes outputs the same way.", "deeper": "Useful for per-member predictions."},
        ],
        "checkpoint": {
            "goal": "Compare mean, Deep Sets, Set Transformer, Gaussian PoE.",
            "steps": ["Reconstruction", "View removal", "Intruder robustness", "Set-size generalisation", "Collapse checks"],
            "successLooksLike": "You know which aggregator fails when meaning is relational.",
        },
        "bridgeToNext": "Contrastive learning teaches how to pull related views together.",
    },
    5: {
        "title": "Contrastive representation learning",
        "mission": "Design positives/negatives correctly and diagnose alignment vs collapse.",
        "beforeYouStart": "Set aggregation from Level 4.",
        "primer": (
            "Contrastive learning pulls positive pairs together and pushes negatives apart.\n\n"
            "CPC introduces InfoNCE. SimCLR shows augmentation + projection heads matter. "
            "Supervised Contrastive Learning allows many positives per class — exactly like multiple views of one concept. "
            "Alignment–Uniformity decomposes the geometry. VICReg can align without heavy negatives via variance and covariance regularizers.\n\n"
            "Before inventing another loss for SetConCA, write down: what makes a positive? Can negatives be false negatives? Does low loss mean concept recovery?"
        ),
        "bigPictureDiagram": [
            "anchor ↔ positives (close) | negatives (far)",
            "alignment ↑ + uniformity ↑ = healthy geometry",
        ],
        "conceptsToMaster": [
            {"name": "InfoNCE", "simple": "Classify the true positive among negatives via softmax of similarities.", "deeper": "Related to a mutual-information lower bound under assumptions."},
            {"name": "Projection head", "simple": "Extra MLP before the loss; often discarded for downstream use.", "deeper": "Can hide info unavailable in the SAE code — check carefully."},
            {"name": "Temperature", "simple": "Softmax sharpness hyperparameter.", "deeper": "Changes geometry and optimisation, not just 'learning rate'."},
        ],
        "checkpoint": {
            "goal": "Ablate positive definition, temperature, projection head.",
            "steps": ["Measure alignment and uniformity", "Check false negatives", "Compare retrieval vs reconstruction"],
            "successLooksLike": "You never treat low contrastive loss as proof of concept recovery.",
        },
        "bridgeToNext": "Level 6 teaches metrics that prevent fooling yourself.",
    },
    6: {
        "title": "Measuring and comparing representations",
        "mission": "Know what each metric supports and what it does not establish.",
        "beforeYouStart": "Levels 1–5 vocabulary.",
        "primer": (
            "No single number measures interpretability.\n\n"
            "SVCCA and CKA compare subspaces — similar geometry ≠ same concepts. "
            "Probes test decodability — high accuracy can be probe memorisation unless you use control tasks. "
            "MDL probing asks how efficiently information is organised.\n\n"
            "Memorize the table: reconstruction ≠ interpretability; sparsity ≠ monosemanticity; CKA ≠ same features; probe ≠ causal use; steering ≠ complete mechanism."
        ),
        "bigPictureDiagram": [
            "Preservation (FVU) | Similarity (CKA) | Decodability (probe) | Causality (intervention)",
            "Need several families for a strong claim.",
        ],
        "conceptsToMaster": [
            {"name": "CKA", "simple": "Similarity of representation Gram matrices.", "deeper": "Invariant to orthogonal transforms; not feature matching."},
            {"name": "Selectivity", "simple": "Probe accuracy on real labels vs control tasks.", "deeper": "Hewitt & Liang: without controls, probes can look good for the wrong reason."},
        ],
        "checkpoint": {
            "goal": "Build an evaluation notebook.",
            "steps": ["CKA", "SVCCA", "linear probe", "MDL probe", "control tasks"],
            "successLooksLike": "You refuse any paper claim backed by one metric alone.",
        },
        "bridgeToNext": "Mechanistic interpretability explains why sparse features matter inside transformers.",
    },
    7: {
        "title": "Mechanistic interpretability foundations",
        "mission": "Explain residual streams, superposition, and why SAEs exist.",
        "beforeYouStart": "Levels 1–2 and metrics from Level 6.",
        "primer": (
            "Transformers move information through a residual stream. Attention and MLP blocks read and write directions in that stream.\n\n"
            "Toy Models of Superposition show that networks can pack more features than dimensions when features are sparse — at the cost of interference. "
            "Neurons become polysemantic. That is why reading individual neurons fails.\n\n"
            "Sparse autoencoders try to recover the underlying feature directions as an overcomplete sparse dictionary — Approach 2 from the superposition paper.\n\n"
            "Towards Monosemanticity and Cunningham et al. apply this to language models. Scaling Monosemanticity shows scale helps but does not guarantee a unique canonical decomposition."
        ),
        "bigPictureDiagram": [
            "many sparse features → packed into few dims (superposition) → polysemantic neurons",
            "SAE: learn overcomplete sparse dictionary ≈ unfold features",
        ],
        "conceptsToMaster": [
            {"name": "Superposition", "simple": "More features than neurons via almost-orthogonal directions.", "deeper": "Phase changes with sparsity/importance; geometric packing."},
            {"name": "Monosemantic vs polysemantic", "simple": "One concept vs many unrelated concepts on one unit.", "deeper": "SAE features aim for monosemanticity; not guaranteed."},
        ],
        "checkpoint": {
            "goal": "Write notes linking superposition to your activation geometry.",
            "steps": ["Estimate sparsity regime", "List interference risks", "State why a pointwise SAE is a baseline"],
            "successLooksLike": "You can justify SAEs without saying 'everyone uses them'.",
        },
        "bridgeToNext": "Modern SAE architectures improve the sparsity–fidelity frontier.",
    },
    8: {
        "title": "Modern SAE architectures",
        "mission": "Compare L1, TopK, Gated, JumpReLU, BatchTopK, Matryoshka on matched frontiers.",
        "beforeYouStart": "Level 7 SAE motivation.",
        "primer": (
            "Architecture changes how sparsity is enforced and how magnitudes behave.\n\n"
            "TopK (Gao et al.): exact sparsity, strong scaling study. "
            "Gated: separate whether a feature fires from how strongly — fights L1 shrinkage. "
            "JumpReLU: learned threshold, more direct L0-style objective. "
            "BatchTopK: sparsity budget across a batch, not fixed k per token. "
            "Matryoshka: nested multi-level features in one dictionary.\n\n"
            "Never compare architectures only at their favourite hyperparameters. Plot reconstruction–sparsity Pareto curves."
        ),
        "bigPictureDiagram": [
            "same data → family of SAEs → Pareto(FVU, L0) → pick at matched operating point",
        ],
        "conceptsToMaster": [
            {"name": "Expansion factor", "simple": "dictionary width / activation dim.", "deeper": "Wider dictionaries can reduce feature merging but cost compute."},
            {"name": "Pareto frontier", "simple": "Best reconstruction for each sparsity level.", "deeper": "Fair comparison lives on this curve."},
        ],
        "checkpoint": {
            "goal": "Train six SAE variants under matched budgets.",
            "steps": ["L1", "TopK", "Gated", "JumpReLU", "BatchTopK", "Matryoshka", "plot Pareto"],
            "successLooksLike": "You refuse single-hyperparameter bake-offs.",
        },
        "bridgeToNext": "Evaluation must catch absorption, non-canonical decompositions, and flaky benchmarks.",
    },
    9: {
        "title": "SAE evaluation and failure modes",
        "mission": "Design an honest evaluation protocol before proposing new methods.",
        "beforeYouStart": "Levels 6–8.",
        "primer": (
            "Reconstruction and sparsity are necessary but not sufficient.\n\n"
            "Feature splitting: one concept spreads across many SAE features. "
            "Feature absorption: one feature swallows related concepts. "
            "Non-canonical: different SAEs can all look good while finding different decompositions.\n\n"
            "SAEBench provides multiple evaluation families. "
            "Are SAE Benchmarks Reliable? warns that some signals are noisy — read it after SAEBench, not before.\n\n"
            "A strong SetConCA paper needs complementary tests, not one leaderboard score."
        ),
        "bigPictureDiagram": [
            "proxy metrics ≠ downstream usefulness",
            "splitting / absorption / seed instability / non-canonical",
        ],
        "conceptsToMaster": [
            {"name": "Absorption / splitting", "simple": "Wrong granularity of features.", "deeper": "Challenges 'one latent = one atomic concept'."},
            {"name": "Canonical units", "simple": "Unique true decomposition.", "deeper": "Evidence suggests SAEs do not find unique units of analysis."},
        ],
        "checkpoint": {
            "goal": "Write your evaluation protocol.",
            "steps": ["List metrics", "For each: supports / does not establish", "Add seed + stitching checks"],
            "successLooksLike": "Protocol rejects claims based on FVU alone.",
        },
        "bridgeToNext": "Level 10 papers sit next to SetConCA.",
    },
    10: {
        "title": "Papers closest to SetConCA",
        "mission": "State research hypotheses that connect multi-view sets to sparse dictionaries.",
        "beforeYouStart": "Entire curriculum.",
        "primer": (
            "Temporal Sparse Autoencoders coordinate adjacent-token activations with contrastive structure. "
            "SetConCA generalises that idea from temporal neighbours to multiple views of the same semantic object.\n\n"
            "Concept Component Analysis offers a different generative story: linear unmixing of concept components with identifiability assumptions — closer to ICA than to reconstruction dictionaries.\n\n"
            "Multi-View Causal Representation Learning asks when multiple partial views identify latent factors.\n\n"
            "Your central question is not merely 'does multi-view help retrieval?' It is:\n\n"
            "Under what assumptions does multi-view supervision cause a sparse dictionary to recover more stable, complete, specific, or causally useful concepts than a pointwise SAE?\n\n"
            "That question decides your experiments."
        ),
        "bigPictureDiagram": [
            "Temporal SAE: adjacent tokens as pairs",
            "SetConCA: multi-view set of same concept + sparse dict + contrastive coord",
            "ConCA: unmixing components | MV-causal: identifiability theory",
        ],
        "conceptsToMaster": [
            {"name": "Related pair definition", "simple": "What counts as the same object across views.", "deeper": "Ablate this — local similarity ≠ semantic consistency."},
            {"name": "Identifiability", "simple": "When latents can be recovered uniquely (up to allowed transforms).", "deeper": "Needs assumptions; multi-view can help when single views are partial."},
        ],
        "checkpoint": {
            "goal": "Write three SetConCA hypotheses.",
            "steps": ["One assumption to challenge", "One reproduction", "One extension beyond Temporal SAE / ConCA"],
            "successLooksLike": "Hypotheses name metrics from Level 6 and failure modes from Level 9.",
        },
        "bridgeToNext": "You are ready to design SetConCA experiments without treating papers as oracles.",
    },
}
