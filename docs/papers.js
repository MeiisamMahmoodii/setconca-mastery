window.CURRICULUM_DATA = {
  "title": "SetConCA Mastery Path",
  "subtitle": "From representation foundations to multi-view sparse autoencoders",
  "formula": "SetConCA = Sparse dictionary learning + Multi-view learning + Set representation + Contrastive coordination",
  "courseIntro": {
    "title": "SetConCA Mastery",
    "promise": "By the end of this course you will understand every idea in the curriculum without opening a PDF. Each module teaches the paper in full.",
    "formula": "SetConCA = Sparse dictionary learning + Multi-view learning + Set representation + Contrastive coordination",
    "howToUse": [
      "Start at Level 1. Read the Level Primer (the lecture) first.",
      "Open each paper module in order. Read every section — Plain English, Key Ideas, Math, Vocabulary.",
      "Complete the Mastery Checklist and Quiz before moving on.",
      "Do the Practical Checkpoint when a level has one.",
      "Do not skip levels — later papers assume earlier vocabulary."
    ],
    "pathMap": "Levels 1–2 teach classical decompositions and sparse codes. Levels 3–5 teach multi-view, sets, and contrastive coordination. Level 6 teaches how to measure representations honestly. Levels 7–9 teach why SAEs exist, how they are built, and how they fail. Level 10 connects everything to SetConCA."
  },
  "levelPrimers": {
    "1": {
      "title": "What is a representation?",
      "mission": "Explain PCA, ICA, and CCA, and know which objective each uses.",
      "beforeYouStart": "None — this is the starting point.",
      "primer": "A representation is a transformed version of data that makes some structure easier to use. Raw activations from a language model are high-dimensional vectors. We rarely care about every coordinate. We care about directions that carry meaning.\n\nThree classical tools answer three different questions.\n\nPCA asks: which directions capture the most variance inside one view? It finds orthogonal axes ordered by how much spread they explain. Analogy: rotate a cloud of points so the longest axis of the cloud comes first. PCA is the baseline for reconstruction quality (FVU). High reconstruction does not mean the axes are concepts.\n\nICA asks: which directions are statistically independent sources mixed together? Independence is stronger than zero correlation. Analogy: unmixing two overlapping voices from a recording. This is the mental model behind Concept Component Analysis (ConCA).\n\nCCA asks: which directions line up between two views of the same thing? Analogy: find the shared signal between audio and video of the same speech. This is the ancestor of multi-view SetConCA.\n\nAfter this level, memorize: PCA = within-view variance; ICA = independent sources; CCA = cross-view correlation.",
      "bigPictureDiagram": [
        "One view  → PCA  → keep variance axes",
        "One view  → ICA  → unmix independent sources",
        "Two views → CCA  → shared correlated directions"
      ],
      "conceptsToMaster": [
        {
          "name": "Variance / covariance",
          "simple": "How much a variable spreads; how two variables co-move.",
          "deeper": "Covariance matrix C = E[(x−μ)(x−μ)ᵀ]. PCA diagonalizes it."
        },
        {
          "name": "Eigenvector / SVD",
          "simple": "Special directions that only stretch under a matrix.",
          "deeper": "SVD X=UΣVᵀ gives principal directions as columns of V (or U)."
        },
        {
          "name": "FVU",
          "simple": "Fraction of variance left unexplained after reconstruction.",
          "deeper": "FVU=1−explained_variance_fraction. Used later for SAE fidelity."
        },
        {
          "name": "Independence vs correlation",
          "simple": "Uncorrelated ≠ independent.",
          "deeper": "ICA needs independence (or non-Gaussianity) for source recovery."
        },
        {
          "name": "Canonical correlation",
          "simple": "Max correlation after projecting two views.",
          "deeper": "CCA finds (u,v) maximizing corr(Xu, Yv) under unit variance."
        }
      ],
      "checkpoint": {
        "goal": "Compare PCA, ICA, CCA on the same activation bank.",
        "steps": [
          "Take Gemma activations for the same set of prompts.",
          "Run PCA; record FVU vs number of components.",
          "Run ICA; inspect recovered components.",
          "Split views (e.g. two layers or two paraphrases); run CCA.",
          "Compare reconstruction, dimensionality, cross-view correlation, retrieval."
        ],
        "successLooksLike": "You can say which method wins on which metric and why that metric is not interpretability."
      },
      "bridgeToNext": "Sparse autoencoders keep the reconstruction idea from PCA but add overcomplete sparse codes."
    },
    "2": {
      "title": "Sparse representations and dictionaries",
      "mission": "Explain why overcomplete codes need sparsity, and how TopK differs from L1 and from VAEs.",
      "beforeYouStart": "Level 1 — especially FVU and linear unmixing.",
      "primer": "If you have more dictionary atoms than input dimensions (overcomplete), a dense code can always reconstruct by using many tiny weights. That is useless for interpretability — every atom becomes a mush of everything.\n\nSparsity forces each activation to use only a few atoms. Then atoms can specialize.\n\nk-Sparse Autoencoders keep exactly the top-k encoder activations. This is the ancestor of TopK SAEs.\n\nVAEs are different: they learn a probabilistic latent with a prior, using the ELBO. You need this vocabulary for Gaussian set aggregations and product-of-experts later — not to become a VAE researcher.\n\nCritical lesson: sparse + good reconstruction ≠ monosemantic concept recovery.",
      "bigPictureDiagram": [
        "Dense x → Encoder → Overcomplete z → keep sparse → Decoder → x̂",
        "L1: soft shrink magnitudes | TopK: hard keep k | L0: count of nonzeros"
      ],
      "conceptsToMaster": [
        {
          "name": "Overcomplete dictionary",
          "simple": "More features than dimensions.",
          "deeper": "Needed if many sparse concepts live in a small activation space (superposition)."
        },
        {
          "name": "TopK vs L1",
          "simple": "TopK = exact k actives; L1 = soft penalty that also shrinks magnitudes.",
          "deeper": "L1 shrinkage motivates Gated SAEs later."
        },
        {
          "name": "ELBO",
          "simple": "Lower bound on log likelihood: reconstruct − KL to prior.",
          "deeper": "VAE trains with reparameterization so gradients flow through sampling."
        }
      ],
      "checkpoint": {
        "goal": "Train L1 vs TopK under matched reconstruction.",
        "steps": [
          "Fix FVU budget",
          "Vary sparsity",
          "Compare active features and qualitative codes"
        ],
        "successLooksLike": "You can answer all Level-2 questions without notes."
      },
      "bridgeToNext": "Multi-view methods ask how to align several representations without destroying private information."
    },
    "3": {
      "title": "Nonlinear multi-view representation learning",
      "mission": "Separate shared vs view-specific information; know DCCA, DCCAE, VCCA, DGCCA.",
      "beforeYouStart": "CCA from Level 1; reconstruction from Level 2.",
      "primer": "A view is one observation of the same underlying object: two layers, two paraphrases, two modalities, or several activation sites.\n\nLinear CCA finds shared linear directions. Deep CCA replaces the linear maps with neural nets.\n\nDanger: maximizing correlation alone can throw away useful view-specific structure. DCCAE adds reconstruction to protect information. VCCA uses shared and private latents in a generative model. DGCCA extends the idea to many views.\n\nSetConCA must not force all views to become identical. Align what is shared; preserve what is private.",
      "bigPictureDiagram": [
        "View A ─┐",
        "         ├─→ shared z  → align",
        "View B ─┘      private z_a, z_b → reconstruct each view"
      ],
      "conceptsToMaster": [
        {
          "name": "Shared vs private",
          "simple": "Shared = common across views; private = view-only.",
          "deeper": "Aligning everything can erase useful activation structure."
        },
        {
          "name": "Whitening / covariance constraints",
          "simple": "Normalize so correlation is meaningful.",
          "deeper": "DCCA typically constrains latent covariance."
        }
      ],
      "checkpoint": {
        "goal": "Visualize shared vs private latents.",
        "steps": [
          "Train a simple multi-view model",
          "Ablate shared vs private",
          "See what retrieval vs reconstruction need"
        ],
        "successLooksLike": "You refuse to equate 'aligned' with 'identical'."
      },
      "bridgeToNext": "When views form an unordered set, you need set architectures."
    },
    "4": {
      "title": "Learning representations of sets",
      "mission": "Build permutation-invariant aggregators and know when mean pooling fails.",
      "beforeYouStart": "Shared/private multi-view from Level 3.",
      "primer": "A set has no order. The representation of {a,b,c} must equal that of {c,a,b}.\n\nDeep Sets proves a universal form: encode each member with φ, sum (or pool), then transform with ρ. Mean pooling is a special case — and it can lose pairwise structure.\n\nSet Transformer lets members talk via attention before pooling.\n\nNeural Statistician treats a whole dataset as one object with a latent — useful when the set code should capture a distribution, not one member.\n\nIn SetConCA, a concept may appear as several activation views. Aggregation choice is a first-class design decision.",
      "bigPictureDiagram": [
        "members → φ(x) → SUM/ATTN pool → ρ → set code"
      ],
      "conceptsToMaster": [
        {
          "name": "Permutation invariance",
          "simple": "Order does not change the output.",
          "deeper": "f(π(X))=f(X) for any permutation π."
        },
        {
          "name": "Equivariance",
          "simple": "Permuting inputs permutes outputs the same way.",
          "deeper": "Useful for per-member predictions."
        }
      ],
      "checkpoint": {
        "goal": "Compare mean, Deep Sets, Set Transformer, Gaussian PoE.",
        "steps": [
          "Reconstruction",
          "View removal",
          "Intruder robustness",
          "Set-size generalisation",
          "Collapse checks"
        ],
        "successLooksLike": "You know which aggregator fails when meaning is relational."
      },
      "bridgeToNext": "Contrastive learning teaches how to pull related views together."
    },
    "5": {
      "title": "Contrastive representation learning",
      "mission": "Design positives/negatives correctly and diagnose alignment vs collapse.",
      "beforeYouStart": "Set aggregation from Level 4.",
      "primer": "Contrastive learning pulls positive pairs together and pushes negatives apart.\n\nCPC introduces InfoNCE. SimCLR shows augmentation + projection heads matter. Supervised Contrastive Learning allows many positives per class — exactly like multiple views of one concept. Alignment–Uniformity decomposes the geometry. VICReg can align without heavy negatives via variance and covariance regularizers.\n\nBefore inventing another loss for SetConCA, write down: what makes a positive? Can negatives be false negatives? Does low loss mean concept recovery?",
      "bigPictureDiagram": [
        "anchor ↔ positives (close) | negatives (far)",
        "alignment ↑ + uniformity ↑ = healthy geometry"
      ],
      "conceptsToMaster": [
        {
          "name": "InfoNCE",
          "simple": "Classify the true positive among negatives via softmax of similarities.",
          "deeper": "Related to a mutual-information lower bound under assumptions."
        },
        {
          "name": "Projection head",
          "simple": "Extra MLP before the loss; often discarded for downstream use.",
          "deeper": "Can hide info unavailable in the SAE code — check carefully."
        },
        {
          "name": "Temperature",
          "simple": "Softmax sharpness hyperparameter.",
          "deeper": "Changes geometry and optimisation, not just 'learning rate'."
        }
      ],
      "checkpoint": {
        "goal": "Ablate positive definition, temperature, projection head.",
        "steps": [
          "Measure alignment and uniformity",
          "Check false negatives",
          "Compare retrieval vs reconstruction"
        ],
        "successLooksLike": "You never treat low contrastive loss as proof of concept recovery."
      },
      "bridgeToNext": "Level 6 teaches metrics that prevent fooling yourself."
    },
    "6": {
      "title": "Measuring and comparing representations",
      "mission": "Know what each metric supports and what it does not establish.",
      "beforeYouStart": "Levels 1–5 vocabulary.",
      "primer": "No single number measures interpretability.\n\nSVCCA and CKA compare subspaces — similar geometry ≠ same concepts. Probes test decodability — high accuracy can be probe memorisation unless you use control tasks. MDL probing asks how efficiently information is organised.\n\nMemorize the table: reconstruction ≠ interpretability; sparsity ≠ monosemanticity; CKA ≠ same features; probe ≠ causal use; steering ≠ complete mechanism.",
      "bigPictureDiagram": [
        "Preservation (FVU) | Similarity (CKA) | Decodability (probe) | Causality (intervention)",
        "Need several families for a strong claim."
      ],
      "conceptsToMaster": [
        {
          "name": "CKA",
          "simple": "Similarity of representation Gram matrices.",
          "deeper": "Invariant to orthogonal transforms; not feature matching."
        },
        {
          "name": "Selectivity",
          "simple": "Probe accuracy on real labels vs control tasks.",
          "deeper": "Hewitt & Liang: without controls, probes can look good for the wrong reason."
        }
      ],
      "checkpoint": {
        "goal": "Build an evaluation notebook.",
        "steps": [
          "CKA",
          "SVCCA",
          "linear probe",
          "MDL probe",
          "control tasks"
        ],
        "successLooksLike": "You refuse any paper claim backed by one metric alone."
      },
      "bridgeToNext": "Mechanistic interpretability explains why sparse features matter inside transformers."
    },
    "7": {
      "title": "Mechanistic interpretability foundations",
      "mission": "Explain residual streams, superposition, and why SAEs exist.",
      "beforeYouStart": "Levels 1–2 and metrics from Level 6.",
      "primer": "Transformers move information through a residual stream. Attention and MLP blocks read and write directions in that stream.\n\nToy Models of Superposition show that networks can pack more features than dimensions when features are sparse — at the cost of interference. Neurons become polysemantic. That is why reading individual neurons fails.\n\nSparse autoencoders try to recover the underlying feature directions as an overcomplete sparse dictionary — Approach 2 from the superposition paper.\n\nTowards Monosemanticity and Cunningham et al. apply this to language models. Scaling Monosemanticity shows scale helps but does not guarantee a unique canonical decomposition.",
      "bigPictureDiagram": [
        "many sparse features → packed into few dims (superposition) → polysemantic neurons",
        "SAE: learn overcomplete sparse dictionary ≈ unfold features"
      ],
      "conceptsToMaster": [
        {
          "name": "Superposition",
          "simple": "More features than neurons via almost-orthogonal directions.",
          "deeper": "Phase changes with sparsity/importance; geometric packing."
        },
        {
          "name": "Monosemantic vs polysemantic",
          "simple": "One concept vs many unrelated concepts on one unit.",
          "deeper": "SAE features aim for monosemanticity; not guaranteed."
        }
      ],
      "checkpoint": {
        "goal": "Write notes linking superposition to your activation geometry.",
        "steps": [
          "Estimate sparsity regime",
          "List interference risks",
          "State why a pointwise SAE is a baseline"
        ],
        "successLooksLike": "You can justify SAEs without saying 'everyone uses them'."
      },
      "bridgeToNext": "Modern SAE architectures improve the sparsity–fidelity frontier."
    },
    "8": {
      "title": "Modern SAE architectures",
      "mission": "Compare L1, TopK, Gated, JumpReLU, BatchTopK, Matryoshka on matched frontiers.",
      "beforeYouStart": "Level 7 SAE motivation.",
      "primer": "Architecture changes how sparsity is enforced and how magnitudes behave.\n\nTopK (Gao et al.): exact sparsity, strong scaling study. Gated: separate whether a feature fires from how strongly — fights L1 shrinkage. JumpReLU: learned threshold, more direct L0-style objective. BatchTopK: sparsity budget across a batch, not fixed k per token. Matryoshka: nested multi-level features in one dictionary.\n\nNever compare architectures only at their favourite hyperparameters. Plot reconstruction–sparsity Pareto curves.",
      "bigPictureDiagram": [
        "same data → family of SAEs → Pareto(FVU, L0) → pick at matched operating point"
      ],
      "conceptsToMaster": [
        {
          "name": "Expansion factor",
          "simple": "dictionary width / activation dim.",
          "deeper": "Wider dictionaries can reduce feature merging but cost compute."
        },
        {
          "name": "Pareto frontier",
          "simple": "Best reconstruction for each sparsity level.",
          "deeper": "Fair comparison lives on this curve."
        }
      ],
      "checkpoint": {
        "goal": "Train six SAE variants under matched budgets.",
        "steps": [
          "L1",
          "TopK",
          "Gated",
          "JumpReLU",
          "BatchTopK",
          "Matryoshka",
          "plot Pareto"
        ],
        "successLooksLike": "You refuse single-hyperparameter bake-offs."
      },
      "bridgeToNext": "Evaluation must catch absorption, non-canonical decompositions, and flaky benchmarks."
    },
    "9": {
      "title": "SAE evaluation and failure modes",
      "mission": "Design an honest evaluation protocol before proposing new methods.",
      "beforeYouStart": "Levels 6–8.",
      "primer": "Reconstruction and sparsity are necessary but not sufficient.\n\nFeature splitting: one concept spreads across many SAE features. Feature absorption: one feature swallows related concepts. Non-canonical: different SAEs can all look good while finding different decompositions.\n\nSAEBench provides multiple evaluation families. Are SAE Benchmarks Reliable? warns that some signals are noisy — read it after SAEBench, not before.\n\nA strong SetConCA paper needs complementary tests, not one leaderboard score.",
      "bigPictureDiagram": [
        "proxy metrics ≠ downstream usefulness",
        "splitting / absorption / seed instability / non-canonical"
      ],
      "conceptsToMaster": [
        {
          "name": "Absorption / splitting",
          "simple": "Wrong granularity of features.",
          "deeper": "Challenges 'one latent = one atomic concept'."
        },
        {
          "name": "Canonical units",
          "simple": "Unique true decomposition.",
          "deeper": "Evidence suggests SAEs do not find unique units of analysis."
        }
      ],
      "checkpoint": {
        "goal": "Write your evaluation protocol.",
        "steps": [
          "List metrics",
          "For each: supports / does not establish",
          "Add seed + stitching checks"
        ],
        "successLooksLike": "Protocol rejects claims based on FVU alone."
      },
      "bridgeToNext": "Level 10 papers sit next to SetConCA."
    },
    "10": {
      "title": "Papers closest to SetConCA",
      "mission": "State research hypotheses that connect multi-view sets to sparse dictionaries.",
      "beforeYouStart": "Entire curriculum.",
      "primer": "Temporal Sparse Autoencoders coordinate adjacent-token activations with contrastive structure. SetConCA generalises that idea from temporal neighbours to multiple views of the same semantic object.\n\nConcept Component Analysis offers a different generative story: linear unmixing of concept components with identifiability assumptions — closer to ICA than to reconstruction dictionaries.\n\nMulti-View Causal Representation Learning asks when multiple partial views identify latent factors.\n\nYour central question is not merely 'does multi-view help retrieval?' It is:\n\nUnder what assumptions does multi-view supervision cause a sparse dictionary to recover more stable, complete, specific, or causally useful concepts than a pointwise SAE?\n\nThat question decides your experiments.",
      "bigPictureDiagram": [
        "Temporal SAE: adjacent tokens as pairs",
        "SetConCA: multi-view set of same concept + sparse dict + contrastive coord",
        "ConCA: unmixing components | MV-causal: identifiability theory"
      ],
      "conceptsToMaster": [
        {
          "name": "Related pair definition",
          "simple": "What counts as the same object across views.",
          "deeper": "Ablate this — local similarity ≠ semantic consistency."
        },
        {
          "name": "Identifiability",
          "simple": "When latents can be recovered uniquely (up to allowed transforms).",
          "deeper": "Needs assumptions; multi-view can help when single views are partial."
        }
      ],
      "checkpoint": {
        "goal": "Write three SetConCA hypotheses.",
        "steps": [
          "One assumption to challenge",
          "One reproduction",
          "One extension beyond Temporal SAE / ConCA"
        ],
        "successLooksLike": "Hypotheses name metrics from Level 6 and failure modes from Level 9."
      },
      "bridgeToNext": "You are ready to design SetConCA experiments without treating papers as oracles."
    }
  },
  "levels": [
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
            "Why PCA directions are orthogonal but not necessarily meaningful"
          ],
          "setconca": "Foundation for comparing SAE reconstruction with PCA baselines. Good reconstruction alone does not demonstrate interpretability.",
          "video": "https://www.youtube.com/watch?v=FgakZw6K1Q0",
          "optional": false,
          "abstract": "",
          "pages": 12,
          "pdfPath": "RAW/1404.1100v1.pdf",
          "teach": {
            "whyWeRead": "PCA is the default linear baseline for reconstruction. You need it to understand FVU and why good reconstruction is not interpretability.",
            "oneSentence": "A tutorial deriving PCA from variance maximisation, eigenvectors, and SVD, with emphasis on intuition.",
            "plainLanguage": "Imagine a cloud of points in many dimensions. PCA rotates the cloud so the first axis points along the longest stretch of the cloud, the second along the next longest stretch orthogonal to the first, and so on.\n\nThose axes are eigenvectors of the covariance matrix — or equivalently the right singular vectors from an SVD of the centred data matrix. If you keep only the first k axes and project back, you get a low-rank reconstruction. The leftover error is reconstruction error; the fraction of variance you failed to capture is FVU.\n\nImportant: orthogonality is a mathematical convenience, not a semantic guarantee. PCA directions need not be concepts. Later, when an SAE reconstructs well, compare against PCA at matched rank — but never treat either as proof of monosemantic features.",
            "keyIdeas": [
              {
                "title": "Variance and covariance",
                "original": "Variance is E[(x−μ)²]; covariance is E[(x−μ)(y−ν)]. The covariance matrix C summarises all pairwise second-order relationships among centred coordinates.",
                "simple": "Variance = how spread out one number is. Covariance = whether two numbers tend to rise and fall together. PCA reads this spreadsheet of co-movements.",
                "explain": "Variance is E[(x−μ)²]; covariance is E[(x−μ)(y−ν)]. The covariance matrix C summarises all pairwise second-order relationships among centred coordinates."
              },
              {
                "title": "Principal components",
                "original": "Principal components are orthonormal directions that successively maximise captured variance (eigenvectors of C ordered by eigenvalue).",
                "simple": "Imagine rotating a cloud of points so the longest stretch of the cloud becomes axis 1, the next-longest stretch (at 90°) becomes axis 2, and so on.",
                "explain": "Principal components are orthonormal directions that successively maximise captured variance (eigenvectors of C ordered by eigenvalue)."
              },
              {
                "title": "Eigenvectors / SVD",
                "original": "PCA is solved via the eigen-decomposition of C, or equivalently via the SVD X=UΣVᵀ of the centred data matrix (V holds principal directions).",
                "simple": "SVD is a reliable calculator that finds those special stretch-directions without forming C explicitly. Prefer SVD in practice.",
                "explain": "PCA is solved via the eigen-decomposition of C, or equivalently via the SVD X=UΣVᵀ of the centred data matrix (V holds principal directions)."
              },
              {
                "title": "Low-rank approximation",
                "original": "Keeping the top-k components yields the optimal rank-k least-squares approximation of the data (Eckart–Young theorem).",
                "simple": "Throw away the small axes and rebuild the points from the big ones. That is the best possible flat approximation with only k directions.",
                "explain": "Keeping the top-k components yields the optimal rank-k least-squares approximation of the data (Eckart–Young theorem)."
              },
              {
                "title": "Explained variance & FVU",
                "original": "Explained variance fraction = (sum of kept eigenvalues)/(sum of all). FVU = 1 − that fraction — residual variance after reconstruction.",
                "simple": "FVU asks: what fraction of the cloud’s spread did we fail to capture? Lower FVU = tighter reconstruction, not ‘more meaningful’ axes.",
                "explain": "Explained variance fraction = (sum of kept eigenvalues)/(sum of all). FVU = 1 − that fraction — residual variance after reconstruction."
              },
              {
                "title": "Orthogonal ≠ meaningful",
                "original": "Orthogonality is a constraint of the PCA objective, not a semantic claim about concepts or causal factors.",
                "simple": "Right angles between axes are a math convenience. They do not mean each axis is a clean human concept.",
                "explain": "Orthogonality is a constraint of the PCA objective, not a semantic claim about concepts or causal factors."
              }
            ],
            "simplifiedMath": [
              {
                "name": "PCA objective",
                "formula": "max_u uᵀ C u  s.t. ||u||=1",
                "original": "PCA objective: max_u uᵀ C u  s.t. ||u||=1",
                "simple": "C is covariance. First PC maximises projected variance.",
                "meaning": "C is covariance. First PC maximises projected variance."
              },
              {
                "name": "SVD",
                "formula": "X = U Σ Vᵀ",
                "original": "SVD: X = U Σ Vᵀ",
                "simple": "Columns of V (for row-centred X) are principal directions; singular values relate to explained variance.",
                "meaning": "Columns of V (for row-centred X) are principal directions; singular values relate to explained variance."
              },
              {
                "name": "FVU",
                "formula": "FVU = 1 − (Σ_{i≤k} λ_i)/(Σ_all λ_i)",
                "original": "FVU: FVU = 1 − (Σ_{i≤k} λ_i)/(Σ_all λ_i)",
                "simple": "Fraction of variance unexplained after keeping k components.",
                "meaning": "Fraction of variance unexplained after keeping k components."
              }
            ],
            "vocabulary": [
              {
                "term": "Principal component",
                "original": "Technical term: «Principal component» as used in this literature.",
                "simple": "An orthogonal direction of maximal remaining variance.",
                "def": "An orthogonal direction of maximal remaining variance."
              },
              {
                "term": "Covariance matrix",
                "original": "Technical term: «Covariance matrix» as used in this literature.",
                "simple": "Matrix of pairwise covariances of centred features.",
                "def": "Matrix of pairwise covariances of centred features."
              },
              {
                "term": "FVU",
                "original": "Technical term: «FVU» as used in this literature.",
                "simple": "Fraction of variance unexplained by a reconstruction.",
                "def": "Fraction of variance unexplained by a reconstruction."
              },
              {
                "term": "Low-rank approximation",
                "original": "Technical term: «Low-rank approximation» as used in this literature.",
                "simple": "Approximating a matrix/data using few components.",
                "def": "Approximating a matrix/data using few components."
              }
            ],
            "whatItShows": [
              "How to compress one view by variance",
              "How to measure reconstruction fidelity via explained variance"
            ],
            "whatItDoesNotShow": [
              "That PCs are interpretable concepts",
              "How to recover independent sources",
              "How to align two views"
            ],
            "setconcaUse": [
              "Always report SAE FVU against a PCA baseline at comparable capacity.",
              "Do not claim interpretability from reconstruction alone.",
              "Use PCA as a dense linear competitor in ablations."
            ],
            "masteryChecklist": [
              "I can derive PCA as variance maximisation.",
              "I can compute/interpret FVU.",
              "I can explain why orthogonal PCs need not be concepts.",
              "I know when to use PCA as an SAE baseline."
            ],
            "commonConfusions": [
              {
                "wrong": "Good PCA reconstruction means features are meaningful.",
                "right": "It only means variance was preserved."
              },
              {
                "wrong": "PCA finds independent sources.",
                "right": "PCA finds uncorrelated directions; ICA targets independence."
              }
            ],
            "quiz": [
              {
                "q": "PCA maximises?",
                "options": [
                  "Variance",
                  "Independence",
                  "Cross-view correlation",
                  "Sparsity"
                ],
                "a": 0,
                "explain": "PCA is variance maximisation under orthogonality."
              },
              {
                "q": "FVU measures?",
                "options": [
                  "Unexplained variance fraction",
                  "Monosemanticity",
                  "Causal effect",
                  "Probe accuracy"
                ],
                "a": 0,
                "explain": "FVU = 1 − explained variance fraction."
              },
              {
                "q": "Orthogonal PCs are always concepts?",
                "options": [
                  "False",
                  "True"
                ],
                "a": 0,
                "explain": "Orthogonality is mathematical, not semantic."
              }
            ],
            "originalIdea": "A tutorial deriving PCA from variance maximisation, eigenvectors, and SVD, with emphasis on intuition.",
            "simpleLesson": "Imagine a cloud of points in many dimensions. PCA rotates the cloud so the first axis points along the longest stretch of the cloud, the second along the next longest stretch orthogonal to the first, and so on.\n\nThose axes are eigenvectors of the covariance matrix — or equivalently the right singular vectors from an SVD of the centred data matrix. If you keep only the first k axes and project back, you get a low-rank reconstruction. The leftover error is reconstruction error; the fraction of variance you failed to capture is FVU.\n\nImportant: orthogonality is a mathematical convenience, not a semantic guarantee. PCA directions need not be concepts. Later, when an SAE reconstructs well, compare against PCA at matched rank — but never treat either as proof of monosemantic features.",
            "limitPairs": [
              {
                "original": "How to compress one view by variance",
                "simple": "In practice this means evidence supports: How to compress one view by variance"
              },
              {
                "original": "How to measure reconstruction fidelity via explained variance",
                "simple": "In practice this means evidence supports: How to measure reconstruction fidelity via explained variance"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That PCs are interpretable concepts",
                "simple": "Do not overclaim: That PCs are interpretable concepts"
              },
              {
                "original": "How to recover independent sources",
                "simple": "Do not overclaim: How to recover independent sources"
              },
              {
                "original": "How to align two views",
                "simple": "Do not overclaim: How to align two views"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Always report SAE FVU against a PCA baseline at comparable capacity.",
                "simple": "Action item: Always report SAE FVU against a PCA baseline at comparable capacity."
              },
              {
                "original": "Do not claim interpretability from reconstruction alone.",
                "simple": "Action item: Do not claim interpretability from reconstruction alone."
              },
              {
                "original": "Use PCA as a dense linear competitor in ablations.",
                "simple": "Action item: Use PCA as a dense linear competitor in ablations."
              }
            ]
          },
          "quiz": [
            {
              "q": "PCA maximises?",
              "options": [
                "Variance",
                "Independence",
                "Cross-view correlation",
                "Sparsity"
              ],
              "a": 0,
              "explain": "PCA is variance maximisation under orthogonality."
            },
            {
              "q": "FVU measures?",
              "options": [
                "Unexplained variance fraction",
                "Monosemanticity",
                "Causal effect",
                "Probe accuracy"
              ],
              "a": 0,
              "explain": "FVU = 1 − explained variance fraction."
            },
            {
              "q": "Orthogonal PCs are always concepts?",
              "options": [
                "False",
                "True"
              ],
              "a": 0,
              "explain": "Orthogonality is mathematical, not semantic."
            }
          ]
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
            "Identifiability and assumptions for source recovery"
          ],
          "setconca": "Directly relevant to Concept Component Analysis (ConCA), which treats activations as mixtures of concept components.",
          "video": "https://www.youtube.com/watch?v=GD_IY1Xa7ko",
          "optional": false,
          "abstract": "",
          "pages": 13,
          "pdfPath": "RAW/1404.2986v1.pdf",
          "teach": {
            "whyWeRead": "ICA is the classical unmixing story. ConCA and concept recovery arguments depend on independence-style assumptions.",
            "oneSentence": "A linear-algebra first tutorial on recovering statistically independent sources from mixtures.",
            "plainLanguage": "Suppose several independent source signals are mixed by an unknown matrix into what you observe. ICA tries to find an unmixing matrix that recovers those sources.\n\nCorrelation zero is not enough: two variables can be uncorrelated but still dependent. ICA uses stronger statistical criteria (often non-Gaussianity / mutual information).\n\nIdentifiability needs assumptions: typically linear mixing, independent non-Gaussian sources, enough samples. If assumptions fail, you can still get a transform — but not the true sources.\n\nHold this contrast: PCA rotates for variance; ICA rotates for independence; CCA aligns two views.",
            "keyIdeas": [
              {
                "title": "Mixing model",
                "original": "Observations follow x = A s with statistically independent sources s and unknown mixing matrix A; ICA estimates an unmixing W such that Wx recovers s up to scale and permutation.",
                "simple": "Several independent voices are blended by an unknown mixer. ICA tries to turn the recording back into separate voices.",
                "explain": "Observations follow x = A s with statistically independent sources s and unknown mixing matrix A; ICA estimates an unmixing W such that Wx recovers s up to scale and permutation."
              },
              {
                "title": "Independence > uncorrelatedness",
                "original": "Uncorrelated means Cov(s_i,s_j)=0. Independence means the joint density factors: p(s)=∏p(s_i). Uncorrelatedness is necessary but not sufficient.",
                "simple": "‘They don’t linearly move together’ is weaker than ‘knowing one tells you nothing about the other.’ ICA needs the stronger idea.",
                "explain": "Uncorrelated means Cov(s_i,s_j)=0. Independence means the joint density factors: p(s)=∏p(s_i). Uncorrelatedness is necessary but not sufficient."
              },
              {
                "title": "Why whitening helps",
                "original": "Whitening removes second-order correlations (sphere the covariance) so remaining ICA contrasts can target higher-order dependence / non-Gaussianity.",
                "simple": "First flatten and un-correlate the cloud (like PCA+scale). Then rotate to finish separating independent sources.",
                "explain": "Whitening removes second-order correlations (sphere the covariance) so remaining ICA contrasts can target higher-order dependence / non-Gaussianity."
              },
              {
                "title": "Identifiability",
                "original": "Recovery of s is identifiable only under assumptions (typically linear mixing, independent non-Gaussian sources, adequate samples).",
                "simple": "If the assumptions are wrong, the algorithm still outputs something — but it may not be the true sources.",
                "explain": "Recovery of s is identifiable only under assumptions (typically linear mixing, independent non-Gaussian sources, adequate samples)."
              },
              {
                "title": "Coordinate change reveals structure",
                "original": "A change of basis can make latent generative factors linearly separable even when they are entangled in the original coordinates.",
                "simple": "Sometimes the right rotation of the space suddenly makes hidden pieces pop apart.",
                "explain": "A change of basis can make latent generative factors linearly separable even when they are entangled in the original coordinates."
              }
            ],
            "simplifiedMath": [
              {
                "name": "Linear mixing",
                "formula": "x = A s",
                "original": "Linear mixing: x = A s",
                "simple": "A mixes independent sources s into observations x.",
                "meaning": "A mixes independent sources s into observations x."
              },
              {
                "name": "Unmixing",
                "formula": "ŷ = W x ≈ P D s",
                "original": "Unmixing: ŷ = W x ≈ P D s",
                "simple": "Recovered sources up to permutation P and scaling D.",
                "meaning": "Recovered sources up to permutation P and scaling D."
              }
            ],
            "vocabulary": [
              {
                "term": "Source separation",
                "original": "Technical term: «Source separation» as used in this literature.",
                "simple": "Recovering latent sources from mixtures.",
                "def": "Recovering latent sources from mixtures."
              },
              {
                "term": "Identifiability",
                "original": "Technical term: «Identifiability» as used in this literature.",
                "simple": "When parameters/sources can be uniquely recovered given assumptions.",
                "def": "When parameters/sources can be uniquely recovered given assumptions."
              },
              {
                "term": "Statistical independence",
                "original": "Technical term: «Statistical independence» as used in this literature.",
                "simple": "Knowing one variable gives no information about another.",
                "def": "Knowing one variable gives no information about another."
              }
            ],
            "whatItShows": [
              "When linear unmixing can recover independent sources",
              "Why independence assumptions matter"
            ],
            "whatItDoesNotShow": [
              "That LM activations are exactly independent concept mixtures",
              "A training recipe for SAEs"
            ],
            "setconcaUse": [
              "Use ICA as a conceptual relative of ConCA.",
              "State assumptions whenever claiming component recovery.",
              "Do not confuse sparse coding with ICA identifiability."
            ],
            "masteryChecklist": [
              "I can contrast correlation vs independence.",
              "I can write the linear mixing model.",
              "I can list assumptions needed for identifiability.",
              "I can relate ICA to ConCA's story."
            ],
            "commonConfusions": [
              {
                "wrong": "PCA and ICA solve the same problem.",
                "right": "PCA maximises variance; ICA seeks independent sources."
              },
              {
                "wrong": "If ICA runs, sources are recovered.",
                "right": "Only if modelling assumptions hold."
              }
            ],
            "quiz": [
              {
                "q": "ICA targets?",
                "options": [
                  "Independence",
                  "Max variance",
                  "Max correlation across views",
                  "TopK sparsity"
                ],
                "a": 0,
                "explain": "ICA seeks statistically independent components."
              },
              {
                "q": "Uncorrelated implies independent?",
                "options": [
                  "No",
                  "Yes"
                ],
                "a": 0,
                "explain": "Independence is stronger."
              },
              {
                "q": "ICA is closest in spirit to?",
                "options": [
                  "ConCA / unmixing",
                  "SimCLR",
                  "Deep Sets",
                  "CKA"
                ],
                "a": 0,
                "explain": "Both treat observations as mixtures of latent components."
              }
            ],
            "originalIdea": "A linear-algebra first tutorial on recovering statistically independent sources from mixtures.",
            "simpleLesson": "Suppose several independent source signals are mixed by an unknown matrix into what you observe. ICA tries to find an unmixing matrix that recovers those sources.\n\nCorrelation zero is not enough: two variables can be uncorrelated but still dependent. ICA uses stronger statistical criteria (often non-Gaussianity / mutual information).\n\nIdentifiability needs assumptions: typically linear mixing, independent non-Gaussian sources, enough samples. If assumptions fail, you can still get a transform — but not the true sources.\n\nHold this contrast: PCA rotates for variance; ICA rotates for independence; CCA aligns two views.",
            "limitPairs": [
              {
                "original": "When linear unmixing can recover independent sources",
                "simple": "In practice this means evidence supports: When linear unmixing can recover independent sources"
              },
              {
                "original": "Why independence assumptions matter",
                "simple": "In practice this means evidence supports: Why independence assumptions matter"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That LM activations are exactly independent concept mixtures",
                "simple": "Do not overclaim: That LM activations are exactly independent concept mixtures"
              },
              {
                "original": "A training recipe for SAEs",
                "simple": "Do not overclaim: A training recipe for SAEs"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Use ICA as a conceptual relative of ConCA.",
                "simple": "Action item: Use ICA as a conceptual relative of ConCA."
              },
              {
                "original": "State assumptions whenever claiming component recovery.",
                "simple": "Action item: State assumptions whenever claiming component recovery."
              },
              {
                "original": "Do not confuse sparse coding with ICA identifiability.",
                "simple": "Action item: Do not confuse sparse coding with ICA identifiability."
              }
            ]
          },
          "quiz": [
            {
              "q": "ICA targets?",
              "options": [
                "Independence",
                "Max variance",
                "Max correlation across views",
                "TopK sparsity"
              ],
              "a": 0,
              "explain": "ICA seeks statistically independent components."
            },
            {
              "q": "Uncorrelated implies independent?",
              "options": [
                "No",
                "Yes"
              ],
              "a": 0,
              "explain": "Independence is stronger."
            },
            {
              "q": "ICA is closest in spirit to?",
              "options": [
                "ConCA / unmixing",
                "SimCLR",
                "Deep Sets",
                "CKA"
              ],
              "a": 0,
              "explain": "Both treat observations as mixtures of latent components."
            }
          ]
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
            "Statistical significance and generalisation"
          ],
          "setconca": "After this: PCA preserves within-view variance; ICA recovers independent sources; CCA recovers cross-view correlation. Core baseline for multi-view SetConCA.",
          "optional": false,
          "abstract": "",
          "pages": 33,
          "pdfPath": "RAW/1711.02391v1.pdf",
          "teach": {
            "whyWeRead": "CCA is the foundation of multi-view learning and of comparing representations across views — core to SetConCA.",
            "oneSentence": "A comprehensive tutorial on canonical correlation analysis and its regularised, kernel, sparse, and deep variants.",
            "plainLanguage": "You have two views of the same objects — say two sensors, or two layers, or two paraphrases. CCA finds a projection of each view so that the projected scalars are as correlated as possible.\n\nThose projected coordinates are canonical variables; their correlations are canonical correlations. High canonical correlation means shared information was found. Low does not mean the views are useless — they may carry private information.\n\nVariants matter: regularisation for high dimensions, kernels for nonlinear maps, sparsity for interpretable loadings, deep CCA for neural encoders. Always ask about generalisation: CCA can overfit shared noise.\n\nAfter this paper: PCA = within-view variance; ICA = independent sources; CCA = cross-view shared signal.",
            "keyIdeas": [
              {
                "title": "Two-view setup",
                "original": "Given paired samples (x_i,y_i), CCA seeks vectors u,v maximising corr(Xu, Yv) subject to unit variance of the projections.",
                "simple": "You have two cameras on the same events. CCA finds a dial on camera A and a dial on camera B that move up and down together as much as possible.",
                "explain": "Given paired samples (x_i,y_i), CCA seeks vectors u,v maximising corr(Xu, Yv) subject to unit variance of the projections."
              },
              {
                "title": "Canonical variables",
                "original": "The projected scalars Xu and Yv are canonical variables; their correlation is the canonical correlation. Multiple pairs can be extracted under orthogonality constraints.",
                "simple": "Those paired dials are the ‘shared channels’ between views. You can find several such channels, each new one independent of the previous.",
                "explain": "The projected scalars Xu and Yv are canonical variables; their correlation is the canonical correlation. Multiple pairs can be extracted under orthogonality constraints."
              },
              {
                "title": "Shared vs view-specific",
                "original": "CCA emphasises cross-view shared covariance structure; variance unique to one view may be ignored by the objective.",
                "simple": "CCA loves the overlap. Useful private details that live in only one view can be thrown away if you only maximise correlation.",
                "explain": "CCA emphasises cross-view shared covariance structure; variance unique to one view may be ignored by the objective."
              },
              {
                "title": "Regularised / kernel / sparse / deep CCA",
                "original": "Extensions address high-dimensional covariance estimation (regularisation), nonlinear maps (kernels/deep nets), and sparse loadings for interpretability.",
                "simple": "Plain CCA breaks on messy real data. Regularise it, make it nonlinear, or make loadings sparse depending on the failure mode.",
                "explain": "Extensions address high-dimensional covariance estimation (regularisation), nonlinear maps (kernels/deep nets), and sparse loadings for interpretability."
              },
              {
                "title": "Significance & generalisation",
                "original": "Canonical correlations estimated in-sample can overfit shared noise; evaluate out-of-sample and test significance.",
                "simple": "A high training correlation can be fake friendship between noise. Always check on held-out pairs.",
                "explain": "Canonical correlations estimated in-sample can overfit shared noise; evaluate out-of-sample and test significance."
              }
            ],
            "simplifiedMath": [
              {
                "name": "CCA objective",
                "formula": "max_{u,v} corr(Xu, Yv) = uᵀΣ_xy v / √(uᵀΣ_xx u vᵀΣ_yy v)",
                "original": "CCA objective: max_{u,v} corr(Xu, Yv) = uᵀΣ_xy v / √(uᵀΣ_xx u vᵀΣ_yy v)",
                "simple": "Maximise cross-covariance relative to within-view variances.",
                "meaning": "Maximise cross-covariance relative to within-view variances."
              }
            ],
            "vocabulary": [
              {
                "term": "Canonical correlation",
                "original": "Technical term: «Canonical correlation» as used in this literature.",
                "simple": "Max correlation between linear projections of two views.",
                "def": "Max correlation between linear projections of two views."
              },
              {
                "term": "View",
                "original": "Technical term: «View» as used in this literature.",
                "simple": "One representation or modality of the same objects.",
                "def": "One representation or modality of the same objects."
              },
              {
                "term": "Multi-view learning",
                "original": "Technical term: «Multi-view learning» as used in this literature.",
                "simple": "Learning from multiple paired observations of each example.",
                "def": "Learning from multiple paired observations of each example."
              }
            ],
            "whatItShows": [
              "How to extract shared linear directions across views",
              "How variants address practical failures of plain CCA"
            ],
            "whatItDoesNotShow": [
              "That shared directions are causal concepts",
              "How to keep private information automatically"
            ],
            "setconcaUse": [
              "CCA between view groups is a mandatory baseline.",
              "Report shared vs private explicitly in multi-view designs.",
              "Beware discarding activation detail when maximising correlation."
            ],
            "masteryChecklist": [
              "I can state the CCA objective in words and symbols.",
              "I can distinguish shared vs private information.",
              "I know why deep/regularised CCA exist.",
              "I can place PCA/ICA/CCA in one sentence each."
            ],
            "commonConfusions": [
              {
                "wrong": "CCA maximises variance like PCA.",
                "right": "CCA maximises cross-view correlation."
              },
              {
                "wrong": "Perfect CCA means views are identical.",
                "right": "It means projections correlate; private structure may remain."
              }
            ],
            "quiz": [
              {
                "q": "CCA maximises?",
                "options": [
                  "Cross-view correlation of projections",
                  "Within-view variance",
                  "Independence",
                  "Sparsity"
                ],
                "a": 0,
                "explain": "Canonical correlations are about shared directions."
              },
              {
                "q": "Private information is?",
                "options": [
                  "View-specific structure CCA may ignore",
                  "Always noise",
                  "Always shared",
                  "Impossible"
                ],
                "a": 0,
                "explain": "Useful private structure can exist."
              },
              {
                "q": "After CCA tutorials, PCA/ICA/CCA mean?",
                "options": [
                  "variance / independence / cross-view corr",
                  "all the same",
                  "sparsity / attention / probes",
                  "only deep learning"
                ],
                "a": 0,
                "explain": "Memorise this triad."
              }
            ],
            "originalIdea": "A comprehensive tutorial on canonical correlation analysis and its regularised, kernel, sparse, and deep variants.",
            "simpleLesson": "You have two views of the same objects — say two sensors, or two layers, or two paraphrases. CCA finds a projection of each view so that the projected scalars are as correlated as possible.\n\nThose projected coordinates are canonical variables; their correlations are canonical correlations. High canonical correlation means shared information was found. Low does not mean the views are useless — they may carry private information.\n\nVariants matter: regularisation for high dimensions, kernels for nonlinear maps, sparsity for interpretable loadings, deep CCA for neural encoders. Always ask about generalisation: CCA can overfit shared noise.\n\nAfter this paper: PCA = within-view variance; ICA = independent sources; CCA = cross-view shared signal.",
            "limitPairs": [
              {
                "original": "How to extract shared linear directions across views",
                "simple": "In practice this means evidence supports: How to extract shared linear directions across views"
              },
              {
                "original": "How variants address practical failures of plain CCA",
                "simple": "In practice this means evidence supports: How variants address practical failures of plain CCA"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That shared directions are causal concepts",
                "simple": "Do not overclaim: That shared directions are causal concepts"
              },
              {
                "original": "How to keep private information automatically",
                "simple": "Do not overclaim: How to keep private information automatically"
              }
            ],
            "setconcaPairs": [
              {
                "original": "CCA between view groups is a mandatory baseline.",
                "simple": "Action item: CCA between view groups is a mandatory baseline."
              },
              {
                "original": "Report shared vs private explicitly in multi-view designs.",
                "simple": "Action item: Report shared vs private explicitly in multi-view designs."
              },
              {
                "original": "Beware discarding activation detail when maximising correlation.",
                "simple": "Action item: Beware discarding activation detail when maximising correlation."
              }
            ]
          },
          "quiz": [
            {
              "q": "CCA maximises?",
              "options": [
                "Cross-view correlation of projections",
                "Within-view variance",
                "Independence",
                "Sparsity"
              ],
              "a": 0,
              "explain": "Canonical correlations are about shared directions."
            },
            {
              "q": "Private information is?",
              "options": [
                "View-specific structure CCA may ignore",
                "Always noise",
                "Always shared",
                "Impossible"
              ],
              "a": 0,
              "explain": "Useful private structure can exist."
            },
            {
              "q": "After CCA tutorials, PCA/ICA/CCA mean?",
              "options": [
                "variance / independence / cross-view corr",
                "all the same",
                "sparsity / attention / probes",
                "only deep learning"
              ],
              "a": 0,
              "explain": "Memorise this triad."
            }
          ]
        }
      ],
      "primer": {
        "title": "What is a representation?",
        "mission": "Explain PCA, ICA, and CCA, and know which objective each uses.",
        "beforeYouStart": "None — this is the starting point.",
        "primer": "A representation is a transformed version of data that makes some structure easier to use. Raw activations from a language model are high-dimensional vectors. We rarely care about every coordinate. We care about directions that carry meaning.\n\nThree classical tools answer three different questions.\n\nPCA asks: which directions capture the most variance inside one view? It finds orthogonal axes ordered by how much spread they explain. Analogy: rotate a cloud of points so the longest axis of the cloud comes first. PCA is the baseline for reconstruction quality (FVU). High reconstruction does not mean the axes are concepts.\n\nICA asks: which directions are statistically independent sources mixed together? Independence is stronger than zero correlation. Analogy: unmixing two overlapping voices from a recording. This is the mental model behind Concept Component Analysis (ConCA).\n\nCCA asks: which directions line up between two views of the same thing? Analogy: find the shared signal between audio and video of the same speech. This is the ancestor of multi-view SetConCA.\n\nAfter this level, memorize: PCA = within-view variance; ICA = independent sources; CCA = cross-view correlation.",
        "bigPictureDiagram": [
          "One view  → PCA  → keep variance axes",
          "One view  → ICA  → unmix independent sources",
          "Two views → CCA  → shared correlated directions"
        ],
        "conceptsToMaster": [
          {
            "name": "Variance / covariance",
            "simple": "How much a variable spreads; how two variables co-move.",
            "deeper": "Covariance matrix C = E[(x−μ)(x−μ)ᵀ]. PCA diagonalizes it."
          },
          {
            "name": "Eigenvector / SVD",
            "simple": "Special directions that only stretch under a matrix.",
            "deeper": "SVD X=UΣVᵀ gives principal directions as columns of V (or U)."
          },
          {
            "name": "FVU",
            "simple": "Fraction of variance left unexplained after reconstruction.",
            "deeper": "FVU=1−explained_variance_fraction. Used later for SAE fidelity."
          },
          {
            "name": "Independence vs correlation",
            "simple": "Uncorrelated ≠ independent.",
            "deeper": "ICA needs independence (or non-Gaussianity) for source recovery."
          },
          {
            "name": "Canonical correlation",
            "simple": "Max correlation after projecting two views.",
            "deeper": "CCA finds (u,v) maximizing corr(Xu, Yv) under unit variance."
          }
        ],
        "checkpoint": {
          "goal": "Compare PCA, ICA, CCA on the same activation bank.",
          "steps": [
            "Take Gemma activations for the same set of prompts.",
            "Run PCA; record FVU vs number of components.",
            "Run ICA; inspect recovered components.",
            "Split views (e.g. two layers or two paraphrases); run CCA.",
            "Compare reconstruction, dimensionality, cross-view correlation, retrieval."
          ],
          "successLooksLike": "You can say which method wins on which metric and why that metric is not interpretability."
        },
        "bridgeToNext": "Sparse autoencoders keep the reconstruction idea from PCA but add overcomplete sparse codes."
      }
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
        "What assumptions make a latent variable identifiable?"
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
            "Why sparse codes can reconstruct dense inputs"
          ],
          "setconca": "Clearest bridge from classical sparse coding to modern TopK SAEs.",
          "optional": false,
          "abstract": "Recently, it has been observed that when rep- resentations are learnt in a way that encour- ages sparsity, improved performance is ob- tained on classiﬁcation tasks. These meth- ods involve combinations of activation func- tions, sampling steps and diﬀerent kinds of penalties. To investigate the eﬀectiveness of sparsity by itself, we propose the “k- sparse autoencoder”, which is an autoen- coder with linear activation function, where in hidden layers only the k highest activities are kept. When applied to the MNIST and NORB datasets, we ﬁnd that this method achieves better classiﬁcation results than de- noising autoencoders, networks trained with dropout, and RBMs. k-sparse autoencoders are simple to train and the encoding stage is very fast, making them well-suited to large problem sizes, where conventional sparse cod- ing algorithms cannot be applied.",
          "pages": 9,
          "pdfPath": "RAW/1312.5663v2.pdf",
          "teach": {
            "whyWeRead": "Clearest bridge from classical sparse coding to modern TopK SAEs.",
            "oneSentence": "Autoencoders with a hard TopK activation that keep exactly k units active.",
            "plainLanguage": "An autoencoder compresses input through a bottleneck then reconstructs. If the bottleneck is wider than the input (overcomplete), you must constrain the code or it can cheat.\n\nk-Sparse AEs keep only the k largest hidden activations and zero the rest. Magnitudes of survivors are not softly shrunk by an L1 term. That hard selection is exactly the spirit of TopK SAEs used in modern interpretability.\n\nSparse codes can still reconstruct dense inputs because many dictionary atoms combine. Sparsity is about which atoms fire, not about the input being sparse.",
            "keyIdeas": [
              {
                "title": "Encoder–decoder factorisation",
                "original": "An autoencoder factorises reconstruction as x̂ = g(f(x)) with encoder f and decoder g trained to minimise reconstruction loss.",
                "simple": "A compressor writes a code; a decompressor rebuilds the input. Training makes rebuilds accurate.",
                "explain": "An autoencoder factorises reconstruction as x̂ = g(f(x)) with encoder f and decoder g trained to minimise reconstruction loss."
              },
              {
                "title": "Overcomplete hidden layer",
                "original": "Hidden dimension larger than input dimension yields an overcomplete dictionary capable of sparse coding.",
                "simple": "More code slots than input numbers — only useful if most slots stay off (sparse).",
                "explain": "Hidden dimension larger than input dimension yields an overcomplete dictionary capable of sparse coding."
              },
              {
                "title": "Hard TopK",
                "original": "TopK retains the k largest activations and zeroes the rest, enforcing exact cardinality sparsity.",
                "simple": "Keep the k loudest switches; silence the rest. No soft maybe.",
                "explain": "TopK retains the k largest activations and zeroes the rest, enforcing exact cardinality sparsity."
              },
              {
                "title": "L1 vs exact k-sparsity",
                "original": "L1 penalties encourage sparsity but also shrink magnitudes of active units; TopK enforces exact k without that shrinkage on survivors.",
                "simple": "L1 nudges toward zero and weakens survivors. TopK just picks winners and leaves their strength alone.",
                "explain": "L1 penalties encourage sparsity but also shrink magnitudes of active units; TopK enforces exact k without that shrinkage on survivors."
              },
              {
                "title": "Dense inputs, sparse codes",
                "original": "Sparse latent codes can reconstruct dense inputs because many dictionary atoms combine linearly in the decoder.",
                "simple": "The input can be messy and dense; the secret is that only a few dictionary pieces turn on to rebuild it.",
                "explain": "Sparse latent codes can reconstruct dense inputs because many dictionary atoms combine linearly in the decoder."
              }
            ],
            "simplifiedMath": [
              {
                "name": "TopK code",
                "formula": "z = TopK(f(x), k)",
                "original": "TopK code: z = TopK(f(x), k)",
                "simple": "Only k entries of the encoder output remain nonzero.",
                "meaning": "Only k entries of the encoder output remain nonzero."
              },
              {
                "name": "Reconstruction loss",
                "formula": "L = ||x − g(z)||²",
                "original": "Reconstruction loss: L = ||x − g(z)||²",
                "simple": "Train encoder/decoder to reconstruct under the TopK constraint.",
                "meaning": "Train encoder/decoder to reconstruct under the TopK constraint."
              }
            ],
            "vocabulary": [
              {
                "term": "Dictionary atom",
                "original": "Technical term: «Dictionary atom» as used in this literature.",
                "simple": "A column of the decoder; a reusable feature direction.",
                "def": "A column of the decoder; a reusable feature direction."
              },
              {
                "term": "k-sparsity",
                "original": "Technical term: «k-sparsity» as used in this literature.",
                "simple": "Exactly k nonzero code entries.",
                "def": "Exactly k nonzero code entries."
              },
              {
                "term": "Overcomplete",
                "original": "Technical term: «Overcomplete» as used in this literature.",
                "simple": "Code dimension larger than input dimension.",
                "def": "Code dimension larger than input dimension."
              }
            ],
            "whatItShows": [
              "Exact cardinality constraints work for autoencoders",
              "Sparse overcomplete codes can reconstruct"
            ],
            "whatItDoesNotShow": [
              "Monosemanticity of atoms",
              "Causal role of features in an LM"
            ],
            "setconcaUse": [
              "Treat TopK SAE as descendant of this paper.",
              "Prefer matched-k comparisons when ablating sparsity mechanisms."
            ],
            "masteryChecklist": [
              "I can explain why overcomplete codes need sparsity.",
              "I can contrast L1 and TopK.",
              "I can sketch encoder→TopK→decoder."
            ],
            "commonConfusions": [
              {
                "wrong": "Sparse code means input is sparse.",
                "right": "The latent is sparse; input can be dense."
              },
              {
                "wrong": "TopK is the same as L1.",
                "right": "TopK enforces exact k; L1 soft-penalises and shrinks."
              }
            ],
            "quiz": [
              {
                "q": "k-Sparse AEs enforce sparsity by?",
                "options": [
                  "Keeping exactly k actives",
                  "Only dropout",
                  "Only L2",
                  "PCA"
                ],
                "a": 0,
                "explain": "Hard TopK."
              },
              {
                "q": "Why overcomplete needs sparsity?",
                "options": [
                  "Otherwise dense mush reconstructs without specialisation",
                  "It doesn't",
                  "For speed only",
                  "For CCA"
                ],
                "a": 0,
                "explain": "Without sparsity, overcomplete codes need not specialise."
              }
            ],
            "originalIdea": "Autoencoders with a hard TopK activation that keep exactly k units active.",
            "simpleLesson": "An autoencoder compresses input through a bottleneck then reconstructs. If the bottleneck is wider than the input (overcomplete), you must constrain the code or it can cheat.\n\nk-Sparse AEs keep only the k largest hidden activations and zero the rest. Magnitudes of survivors are not softly shrunk by an L1 term. That hard selection is exactly the spirit of TopK SAEs used in modern interpretability.\n\nSparse codes can still reconstruct dense inputs because many dictionary atoms combine. Sparsity is about which atoms fire, not about the input being sparse.",
            "limitPairs": [
              {
                "original": "Exact cardinality constraints work for autoencoders",
                "simple": "In practice this means evidence supports: Exact cardinality constraints work for autoencoders"
              },
              {
                "original": "Sparse overcomplete codes can reconstruct",
                "simple": "In practice this means evidence supports: Sparse overcomplete codes can reconstruct"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "Monosemanticity of atoms",
                "simple": "Do not overclaim: Monosemanticity of atoms"
              },
              {
                "original": "Causal role of features in an LM",
                "simple": "Do not overclaim: Causal role of features in an LM"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Treat TopK SAE as descendant of this paper.",
                "simple": "Action item: Treat TopK SAE as descendant of this paper."
              },
              {
                "original": "Prefer matched-k comparisons when ablating sparsity mechanisms.",
                "simple": "Action item: Prefer matched-k comparisons when ablating sparsity mechanisms."
              }
            ]
          },
          "quiz": [
            {
              "q": "k-Sparse AEs enforce sparsity by?",
              "options": [
                "Keeping exactly k actives",
                "Only dropout",
                "Only L2",
                "PCA"
              ],
              "a": 0,
              "explain": "Hard TopK."
            },
            {
              "q": "Why overcomplete needs sparsity?",
              "options": [
                "Otherwise dense mush reconstructs without specialisation",
                "It doesn't",
                "For speed only",
                "For CCA"
              ],
              "a": 0,
              "explain": "Without sparsity, overcomplete codes need not specialise."
            }
          ]
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
            "Reconstruction vs regularisation; ELBO"
          ],
          "setconca": "Background for Gaussian set representations and product-of-experts aggregation.",
          "optional": false,
          "abstract": "How can we perform efﬁcient inference and learning in directed probabilistic models, in the presence of continuous latent variables with intractable posterior distributions, and large datasets? We introduce a stochastic variational inference and learning algorithm that scales to large datasets and, under some mild differ- entiability conditions, even works in the intractable case. Our contributions are two-fold. First, we show that a reparameterization of the variational lower bound yields a lower bound estimator that can be straightforwardly optimized using stan- dard stochastic gradient methods. Second, we show that for i.i.d. datasets with continuous latent variables per datapoint, posterior inference can be made espe- cially efﬁcient by ﬁtting an approximate inference model (also called a recogni- tion model) to the intractable posterior using the proposed lower bound estimator. Theoretical advantages are reﬂected in experimental results. 1",
          "pages": 14,
          "pdfPath": "RAW/1312.6114v11.pdf",
          "teach": {
            "whyWeRead": "Background for probabilistic latents, Gaussian aggregation, and ELBO thinking — not to become a VAE specialist.",
            "oneSentence": "Derives variational autoencoders: approximate posteriors, reparameterisation, and the ELBO.",
            "plainLanguage": "A VAE treats each input as generated from a latent random variable z. We cannot compute the true posterior p(z|x) easily, so we learn an approximate posterior q(z|x), usually a Gaussian with predicted mean and variance.\n\nThe reparameterisation trick writes z = μ + σ⊙ε with ε~N(0,I) so gradients flow through sampling.\n\nTraining maximises a lower bound on log p(x) called the ELBO: reconstruction quality minus KL divergence from q to a prior (often N(0,I)). Too much KL pressure can over-regularise; too little can ignore the prior.\n\nFor SetConCA: when you aggregate views as Gaussians or use product-of-experts, you are using this probabilistic vocabulary.",
            "keyIdeas": [
              {
                "title": "Latent variable model",
                "original": "Data are modelled as generated from latent z via a decoder likelihood p(x|z).",
                "simple": "Imagine a hidden knob z; the model generates x by decoding that knob.",
                "explain": "Data are modelled as generated from latent z via a decoder likelihood p(x|z)."
              },
              {
                "title": "Approximate posterior",
                "original": "Because p(z|x) is intractable, an encoder parameterises q_φ(z|x) (often diagonal Gaussian).",
                "simple": "We cannot compute the true posterior, so we learn a handy approximation — usually a mean and variance.",
                "explain": "Because p(z|x) is intractable, an encoder parameterises q_φ(z|x) (often diagonal Gaussian)."
              },
              {
                "title": "Reparameterisation",
                "original": "Sampling z=μ+σ⊙ε with ε~N(0,I) moves randomness outside the parameters so gradients flow to μ,σ.",
                "simple": "Don’t sample in a way that blocks learning. Add noise outside, then scale/shift with predicted μ and σ.",
                "explain": "Sampling z=μ+σ⊙ε with ε~N(0,I) moves randomness outside the parameters so gradients flow to μ,σ."
              },
              {
                "title": "ELBO tradeoff",
                "original": "Maximise E_q[log p(x|z)] − KL(q(z|x)||p(z)): reconstruct well while staying close to the prior.",
                "simple": "Two pressures: rebuild x, and don’t let latents wander into crazy regions far from the prior.",
                "explain": "Maximise E_q[log p(x|z)] − KL(q(z|x)||p(z)): reconstruct well while staying close to the prior."
              },
              {
                "title": "Prior / posterior / likelihood",
                "original": "Prior p(z), approximate posterior q(z|x), and likelihood p(x|z) are the three distributions in the generative story.",
                "simple": "Prior = default belief about z. Posterior = belief after seeing x. Likelihood = how x is made from z.",
                "explain": "Prior p(z), approximate posterior q(z|x), and likelihood p(x|z) are the three distributions in the generative story."
              }
            ],
            "simplifiedMath": [
              {
                "name": "ELBO",
                "formula": "E_q[log p(x|z)] − KL(q(z|x)||p(z))",
                "original": "ELBO: E_q[log p(x|z)] − KL(q(z|x)||p(z))",
                "simple": "Reconstruction term minus regulariser toward prior.",
                "meaning": "Reconstruction term minus regulariser toward prior."
              },
              {
                "name": "Reparameterisation",
                "formula": "z = μ(x) + σ(x) ⊙ ε, ε~N(0,I)",
                "original": "Reparameterisation: z = μ(x) + σ(x) ⊙ ε, ε~N(0,I)",
                "simple": "Differentiable sampling.",
                "meaning": "Differentiable sampling."
              }
            ],
            "vocabulary": [
              {
                "term": "ELBO",
                "original": "Technical term: «ELBO» as used in this literature.",
                "simple": "Evidence lower bound on log likelihood.",
                "def": "Evidence lower bound on log likelihood."
              },
              {
                "term": "KL divergence",
                "original": "Technical term: «KL divergence» as used in this literature.",
                "simple": "Measure of how one distribution differs from another.",
                "def": "Measure of how one distribution differs from another."
              },
              {
                "term": "Reparameterisation trick",
                "original": "Technical term: «Reparameterisation trick» as used in this literature.",
                "simple": "Rewrite sampling so parameters receive gradients.",
                "def": "Rewrite sampling so parameters receive gradients."
              }
            ],
            "whatItShows": [
              "How to train continuous latents with variational inference",
              "Reconstruction–regularisation tradeoff"
            ],
            "whatItDoesNotShow": [
              "That Gaussian latents are monosemantic",
              "SAE dictionary learning"
            ],
            "setconcaUse": [
              "Use ELBO intuition for Gaussian set codes and PoE fusion.",
              "Separate reconstruction goals from alignment goals explicitly."
            ],
            "masteryChecklist": [
              "I can explain ELBO in words.",
              "I can write the reparameterisation formula.",
              "I know why this matters for probabilistic multi-view aggregation."
            ],
            "commonConfusions": [
              {
                "wrong": "VAE = SAE.",
                "right": "VAE is probabilistic bottleneck; SAE is sparse overcomplete dictionary for interpretability."
              }
            ],
            "quiz": [
              {
                "q": "ELBO balances?",
                "options": [
                  "Reconstruction vs KL to prior",
                  "Only sparsity",
                  "Only CCA",
                  "Only TopK"
                ],
                "a": 0,
                "explain": "Classic VAE tradeoff."
              },
              {
                "q": "Reparameterisation exists to?",
                "options": [
                  "Backprop through sampling",
                  "Increase sparsity",
                  "Compute CKA",
                  "Remove decoder"
                ],
                "a": 0,
                "explain": "Make sampling differentiable."
              }
            ],
            "originalIdea": "Derives variational autoencoders: approximate posteriors, reparameterisation, and the ELBO.",
            "simpleLesson": "A VAE treats each input as generated from a latent random variable z. We cannot compute the true posterior p(z|x) easily, so we learn an approximate posterior q(z|x), usually a Gaussian with predicted mean and variance.\n\nThe reparameterisation trick writes z = μ + σ⊙ε with ε~N(0,I) so gradients flow through sampling.\n\nTraining maximises a lower bound on log p(x) called the ELBO: reconstruction quality minus KL divergence from q to a prior (often N(0,I)). Too much KL pressure can over-regularise; too little can ignore the prior.\n\nFor SetConCA: when you aggregate views as Gaussians or use product-of-experts, you are using this probabilistic vocabulary.",
            "limitPairs": [
              {
                "original": "How to train continuous latents with variational inference",
                "simple": "In practice this means evidence supports: How to train continuous latents with variational inference"
              },
              {
                "original": "Reconstruction–regularisation tradeoff",
                "simple": "In practice this means evidence supports: Reconstruction–regularisation tradeoff"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That Gaussian latents are monosemantic",
                "simple": "Do not overclaim: That Gaussian latents are monosemantic"
              },
              {
                "original": "SAE dictionary learning",
                "simple": "Do not overclaim: SAE dictionary learning"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Use ELBO intuition for Gaussian set codes and PoE fusion.",
                "simple": "Action item: Use ELBO intuition for Gaussian set codes and PoE fusion."
              },
              {
                "original": "Separate reconstruction goals from alignment goals explicitly.",
                "simple": "Action item: Separate reconstruction goals from alignment goals explicitly."
              }
            ]
          },
          "quiz": [
            {
              "q": "ELBO balances?",
              "options": [
                "Reconstruction vs KL to prior",
                "Only sparsity",
                "Only CCA",
                "Only TopK"
              ],
              "a": 0,
              "explain": "Classic VAE tradeoff."
            },
            {
              "q": "Reparameterisation exists to?",
              "options": [
                "Backprop through sampling",
                "Increase sparsity",
                "Compute CKA",
                "Remove decoder"
              ],
              "a": 0,
              "explain": "Make sampling differentiable."
            }
          ]
        }
      ],
      "primer": {
        "title": "Sparse representations and dictionaries",
        "mission": "Explain why overcomplete codes need sparsity, and how TopK differs from L1 and from VAEs.",
        "beforeYouStart": "Level 1 — especially FVU and linear unmixing.",
        "primer": "If you have more dictionary atoms than input dimensions (overcomplete), a dense code can always reconstruct by using many tiny weights. That is useless for interpretability — every atom becomes a mush of everything.\n\nSparsity forces each activation to use only a few atoms. Then atoms can specialize.\n\nk-Sparse Autoencoders keep exactly the top-k encoder activations. This is the ancestor of TopK SAEs.\n\nVAEs are different: they learn a probabilistic latent with a prior, using the ELBO. You need this vocabulary for Gaussian set aggregations and product-of-experts later — not to become a VAE researcher.\n\nCritical lesson: sparse + good reconstruction ≠ monosemantic concept recovery.",
        "bigPictureDiagram": [
          "Dense x → Encoder → Overcomplete z → keep sparse → Decoder → x̂",
          "L1: soft shrink magnitudes | TopK: hard keep k | L0: count of nonzeros"
        ],
        "conceptsToMaster": [
          {
            "name": "Overcomplete dictionary",
            "simple": "More features than dimensions.",
            "deeper": "Needed if many sparse concepts live in a small activation space (superposition)."
          },
          {
            "name": "TopK vs L1",
            "simple": "TopK = exact k actives; L1 = soft penalty that also shrinks magnitudes.",
            "deeper": "L1 shrinkage motivates Gated SAEs later."
          },
          {
            "name": "ELBO",
            "simple": "Lower bound on log likelihood: reconstruct − KL to prior.",
            "deeper": "VAE trains with reparameterization so gradients flow through sampling."
          }
        ],
        "checkpoint": {
          "goal": "Train L1 vs TopK under matched reconstruction.",
          "steps": [
            "Fix FVU budget",
            "Vary sparsity",
            "Compare active features and qualitative codes"
          ],
          "successLooksLike": "You can answer all Level-2 questions without notes."
        },
        "bridgeToNext": "Multi-view methods ask how to align several representations without destroying private information."
      }
    },
    {
      "id": 3,
      "title": "Nonlinear multi-view representation learning",
      "weeks": "5–6",
      "checkpoint": "Implement shared/private latent decomposition. Visualise what gets aligned vs discarded.",
      "key_lesson": "Do not force all views to become identical. Distinguish shared information from view-specific information.",
      "papers": [
        {
          "id": "dcca",
          "num": 6,
          "title": "Deep Canonical Correlation Analysis",
          "authors": "Andrew et al.",
          "file": "andrew13.pdf",
          "learn": [
            "Nonlinear view encoders",
            "Correlation-maximising objectives",
            "Whitening and covariance constraints",
            "Maximising correlation while discarding useful information"
          ],
          "setconca": "Nonlinear extension of CCA — precursor to coordinating SAE views.",
          "optional": false,
          "abstract": "We introduce Deep Canonical Correlation Analysis (DCCA), a method to learn com- plex nonlinear transformations of two views of data such that the resulting representations are highly linearly correlated. Parameters of both transformations are jointly learned to maximize the (regularized) total correlation. It can be viewed as a nonlinear extension of the linear method canonical correlation analy- sis (CCA). It is an alternative to the nonpara- metric method kernel canonical correlation analysis (KCCA) for learning correlated non- linear transformations. Unlike KCCA, DCCA does not require an inner product, and has the advantages of a parametric method: train- ing time scales well with data size and the training data need not be referenced when computing the representations of unseen in- stances. In experiments on two real-world datasets, we ﬁnd that DCCA learns represen- tations with signiﬁcantly higher correlation than those learned by CCA and KCCA. We also introduce a novel non-saturating sigmoid function based on the cube root that may be useful more generally in feedforward neural networks. Proceedings of the 30 th International Conference on Ma- chine Learning, Atlanta, Georgia",
          "pages": 9,
          "pdfPath": "RAW/andrew13.pdf",
          "teach": {
            "whyWeRead": "Nonlinear upgrade of CCA — precursor to coordinating neural view encoders.",
            "oneSentence": "Deep CCA replaces linear CCA projections with neural networks trained to maximise canonical correlation.",
            "plainLanguage": "Linear CCA can miss shared structure that is nonlinear in the raw views. DCCA puts a neural net on each view, then applies a CCA-style correlation objective on the net outputs.\n\nWhitening / covariance constraints keep the latent dimensions from collapsing into duplicates.\n\nWarning: maximising correlation can discard information that is useful but not shared. That failure mode is why DCCAE later adds reconstruction.",
            "keyIdeas": [
              {
                "title": "Nonlinear view encoders",
                "original": "DCCA replaces linear CCA maps with neural networks f_θ, g_φ on each view.",
                "simple": "Each view gets its own neural translator before we ask how correlated they are.",
                "explain": "DCCA replaces linear CCA maps with neural networks f_θ, g_φ on each view."
              },
              {
                "title": "Correlation-maximising objective",
                "original": "Networks are trained so embeddings maximise a CCA-style total correlation objective under covariance constraints.",
                "simple": "Push the translated views to move together as much as possible.",
                "explain": "Networks are trained so embeddings maximise a CCA-style total correlation objective under covariance constraints."
              },
              {
                "title": "Covariance constraints",
                "original": "Latent covariances are constrained/whitened to avoid collapsed or duplicated correlated dimensions.",
                "simple": "Without rules, the net can cheat by making duplicate dimensions. Whitening blocks that cheat.",
                "explain": "Latent covariances are constrained/whitened to avoid collapsed or duplicated correlated dimensions."
              },
              {
                "title": "Information discard risk",
                "original": "Maximising shared correlation can discard view-specific information that is useful but not shared.",
                "simple": "Chasing only the overlap can throw away private treasure that still matters.",
                "explain": "Maximising shared correlation can discard view-specific information that is useful but not shared."
              }
            ],
            "simplifiedMath": [
              {
                "name": "DCCA idea",
                "formula": "max corr(f_θ(X), g_φ(Y))",
                "original": "DCCA idea: max corr(f_θ(X), g_φ(Y))",
                "simple": "Learn nonlinear f,g to maximise cross-view correlation (with constraints).",
                "meaning": "Learn nonlinear f,g to maximise cross-view correlation (with constraints)."
              }
            ],
            "vocabulary": [
              {
                "term": "Deep CCA",
                "original": "Technical term: «Deep CCA» as used in this literature.",
                "simple": "CCA with neural view encoders.",
                "def": "CCA with neural view encoders."
              },
              {
                "term": "Whitening",
                "original": "Technical term: «Whitening» as used in this literature.",
                "simple": "Transform so dimensions have unit variance and zero correlation.",
                "def": "Transform so dimensions have unit variance and zero correlation."
              }
            ],
            "whatItShows": [
              "Nonlinear shared structure can beat linear CCA on some tasks"
            ],
            "whatItDoesNotShow": [
              "That correlation maximisation preserves all useful activation detail"
            ],
            "setconcaUse": [
              "Treat DCCA as a nonlinear multi-view baseline.",
              "Audit whether alignment destroyed private SAE-relevant information."
            ],
            "masteryChecklist": [
              "I can explain DCCA vs linear CCA.",
              "I can name the discard-information failure mode."
            ],
            "commonConfusions": [
              {
                "wrong": "Higher correlation is always better.",
                "right": "It can erase private structure you still need."
              }
            ],
            "quiz": [
              {
                "q": "DCCA upgrades CCA with?",
                "options": [
                  "Neural view encoders",
                  "TopK only",
                  "Probes only",
                  "Attention only"
                ],
                "a": 0,
                "explain": "Deep nonlinear maps."
              }
            ],
            "originalIdea": "Deep CCA replaces linear CCA projections with neural networks trained to maximise canonical correlation.",
            "simpleLesson": "Linear CCA can miss shared structure that is nonlinear in the raw views. DCCA puts a neural net on each view, then applies a CCA-style correlation objective on the net outputs.\n\nWhitening / covariance constraints keep the latent dimensions from collapsing into duplicates.\n\nWarning: maximising correlation can discard information that is useful but not shared. That failure mode is why DCCAE later adds reconstruction.",
            "limitPairs": [
              {
                "original": "Nonlinear shared structure can beat linear CCA on some tasks",
                "simple": "In practice this means evidence supports: Nonlinear shared structure can beat linear CCA on some tasks"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That correlation maximisation preserves all useful activation detail",
                "simple": "Do not overclaim: That correlation maximisation preserves all useful activation detail"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Treat DCCA as a nonlinear multi-view baseline.",
                "simple": "Action item: Treat DCCA as a nonlinear multi-view baseline."
              },
              {
                "original": "Audit whether alignment destroyed private SAE-relevant information.",
                "simple": "Action item: Audit whether alignment destroyed private SAE-relevant information."
              }
            ]
          },
          "quiz": [
            {
              "q": "DCCA upgrades CCA with?",
              "options": [
                "Neural view encoders",
                "TopK only",
                "Probes only",
                "Attention only"
              ],
              "a": 0,
              "explain": "Deep nonlinear maps."
            }
          ]
        },
        {
          "id": "dccae",
          "num": 7,
          "title": "On Deep Multi-View Representation Learning",
          "authors": "Wang et al.",
          "file": "1602.01024v1.pdf",
          "learn": [
            "DCCAE trade-offs",
            "Cross-view correlation vs within-view reconstruction",
            "Shared representation vs information preservation"
          ],
          "setconca": "Central difficulty: coordinate across views without destroying activation information.",
          "optional": false,
          "abstract": "We consider learning representations (features) in the setting in which we have access to multiple unlabeled views of the data for learning while only one view is available for downstream tasks. Previous work on this problem has proposed several techniques based on deep neural networks, typically involving either autoencoder-like networks with a reconstruction objective or paired feed- forward networks with a batch-style correlation-based objective. We analyze several techniques based on prior work, as well as new variants, and compare them empirically on image, speech, and text tasks. We ﬁnd an advantage for correlation-based representation learning, while the best results on most tasks are obtained with our new variant, deep canonically correlated autoencoders (DCCAE). We also explore a stochastic optimization procedure for minibatch correlation-based objectives and discuss the time/performance trade-offs for kernel-based and neural network-based implementations.",
          "pages": 34,
          "pdfPath": "RAW/1602.01024v1.pdf",
          "teach": {
            "whyWeRead": "Central tradeoff for SetConCA: cross-view correlation vs within-view reconstruction.",
            "oneSentence": "Studies deep multi-view objectives, introducing DCCAE which balances correlation and autoencoding.",
            "plainLanguage": "If you only maximise correlation, you may learn a tiny shared signal and throw away the rest. If you only reconstruct each view, you may never align them.\n\nDCCAE combines both: learn representations that correlate across views and reconstruct each view. This is almost exactly SetConCA's tension — coordinate views without destroying activation information.",
            "keyIdeas": [
              {
                "title": "Correlation–reconstruction tradeoff",
                "original": "DCCAE combines cross-view correlation with within-view autoencoding losses.",
                "simple": "Align the shared signal AND rebuild each view so you don’t delete useful private detail.",
                "explain": "DCCAE combines cross-view correlation with within-view autoencoding losses."
              },
              {
                "title": "Shared representation",
                "original": "The correlated latent is intended to capture shared factors across views.",
                "simple": "The shared code is the handshake between views.",
                "explain": "The correlated latent is intended to capture shared factors across views."
              },
              {
                "title": "Information preservation",
                "original": "Reconstruction terms protect within-view information from being optimised away.",
                "simple": "If you must rebuild the view, you cannot throw everything away for correlation.",
                "explain": "Reconstruction terms protect within-view information from being optimised away."
              },
              {
                "title": "Objective choice matters",
                "original": "Different multi-view losses induce different invariances and failure modes.",
                "simple": "Your loss is a contract: it says what to keep and what to ignore.",
                "explain": "Different multi-view losses induce different invariances and failure modes."
              }
            ],
            "simplifiedMath": [
              {
                "name": "Schematic DCCAE loss",
                "formula": "L ≈ −corr(z_x,z_y) + λ(‖x−x̂‖²+‖y−ŷ‖²)",
                "original": "Schematic DCCAE loss: L ≈ −corr(z_x,z_y) + λ(‖x−x̂‖²+‖y−ŷ‖²)",
                "simple": "Align shared codes while reconstructing views.",
                "meaning": "Align shared codes while reconstructing views."
              }
            ],
            "vocabulary": [
              {
                "term": "DCCAE",
                "original": "Technical term: «DCCAE» as used in this literature.",
                "simple": "Deep canonically correlated autoencoders.",
                "def": "Deep canonically correlated autoencoders."
              }
            ],
            "whatItShows": [
              "Explicit tradeoff between alignment and preservation"
            ],
            "whatItDoesNotShow": [
              "The unique correct λ for language-model SAEs"
            ],
            "setconcaUse": [
              "When adding contrastive alignment to SAEs, keep a reconstruction term and ablate λ.",
              "Report both retrieval and FVU."
            ],
            "masteryChecklist": [
              "I can explain why correlation-only training is dangerous.",
              "I can state the DCCAE design pattern."
            ],
            "commonConfusions": [
              {
                "wrong": "Alignment replaces reconstruction.",
                "right": "You often need both."
              }
            ],
            "quiz": [
              {
                "q": "DCCAE adds what to DCCA?",
                "options": [
                  "Within-view reconstruction",
                  "Only TopK",
                  "Only probes",
                  "Only PCA"
                ],
                "a": 0,
                "explain": "Autoencoding term."
              }
            ],
            "originalIdea": "Studies deep multi-view objectives, introducing DCCAE which balances correlation and autoencoding.",
            "simpleLesson": "If you only maximise correlation, you may learn a tiny shared signal and throw away the rest. If you only reconstruct each view, you may never align them.\n\nDCCAE combines both: learn representations that correlate across views and reconstruct each view. This is almost exactly SetConCA's tension — coordinate views without destroying activation information.",
            "limitPairs": [
              {
                "original": "Explicit tradeoff between alignment and preservation",
                "simple": "In practice this means evidence supports: Explicit tradeoff between alignment and preservation"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "The unique correct λ for language-model SAEs",
                "simple": "Do not overclaim: The unique correct λ for language-model SAEs"
              }
            ],
            "setconcaPairs": [
              {
                "original": "When adding contrastive alignment to SAEs, keep a reconstruction term and ablate λ.",
                "simple": "Action item: When adding contrastive alignment to SAEs, keep a reconstruction term and ablate λ."
              },
              {
                "original": "Report both retrieval and FVU.",
                "simple": "Action item: Report both retrieval and FVU."
              }
            ]
          },
          "quiz": [
            {
              "q": "DCCAE adds what to DCCA?",
              "options": [
                "Within-view reconstruction",
                "Only TopK",
                "Only probes",
                "Only PCA"
              ],
              "a": 0,
              "explain": "Autoencoding term."
            }
          ]
        },
        {
          "id": "vcca",
          "num": 8,
          "title": "Deep Variational Canonical Correlation Analysis",
          "authors": "Wang et al.",
          "file": "1610.03454v3.pdf",
          "learn": [
            "Shared and private latent variables",
            "Generative multi-view modelling",
            "Missing views",
            "Probabilistic cross-view alignment"
          ],
          "setconca": "Directly relevant to probabilistic multi-view SetConCA experiments.",
          "optional": false,
          "abstract": "We present deep variational canonical correla- tion analysis (VCCA), a deep multi-view learn- ing model that extends the latent variable model interpretation of linear CCA to nonlinear obser- vation models parameterized by deep neural net- works. We derive variational lower bounds of the data likelihood by parameterizing the posterior probability of the latent variables from the view that is available at test time. We also propose a variant of VCCA called VCCA-private that can, in addition to the “common variables” underly- ing both views, extract the “private variables” within each view, and disentangles the shared and private information for multi-view data with- out hard supervision. Experimental results on real-world datasets show that our methods are competitive across domains.",
          "pages": 13,
          "pdfPath": "RAW/1610.03454v3.pdf",
          "teach": {
            "whyWeRead": "Probabilistic multi-view model with shared and private latents — closest classical cousin to probabilistic SetConCA.",
            "oneSentence": "Deep variational CCA with shared (and optionally private) latents and a generative multi-view story.",
            "plainLanguage": "VCCA extends the latent-variable view of CCA into deep generative models. A shared latent explains both views; private latents can explain view-specific details.\n\nBecause it is generative, it can handle missing views in principle. The probabilistic framing clarifies what 'alignment' means: shared latents, not forced identical embeddings.",
            "keyIdeas": [
              {
                "title": "Shared latent",
                "original": "A shared latent z explains generative factors common to both views.",
                "simple": "One hidden story both views are reading from.",
                "explain": "A shared latent z explains generative factors common to both views."
              },
              {
                "title": "Private latents",
                "original": "Private latents z_x, z_y capture view-specific residual structure.",
                "simple": "Each view may also have its own private subplot.",
                "explain": "Private latents z_x, z_y capture view-specific residual structure."
              },
              {
                "title": "Variational training",
                "original": "Deep VCCA is trained with variational bounds (ELBO-style) using neural parameterisations.",
                "simple": "Same VAE training idea, but for multi-view generation.",
                "explain": "Deep VCCA is trained with variational bounds (ELBO-style) using neural parameterisations."
              },
              {
                "title": "Missing views",
                "original": "A generative multi-view model can in principle condition or impute when a view is absent.",
                "simple": "If one camera fails, a generative shared model still has a story to fall back on.",
                "explain": "A generative multi-view model can in principle condition or impute when a view is absent."
              }
            ],
            "simplifiedMath": [
              {
                "name": "Shared factor idea",
                "formula": "x ← dec_x(z_shared, z_x), y ← dec_y(z_shared, z_y)",
                "original": "Shared factor idea: x ← dec_x(z_shared, z_x), y ← dec_y(z_shared, z_y)",
                "simple": "Both views generated from shared + private latents.",
                "meaning": "Both views generated from shared + private latents."
              }
            ],
            "vocabulary": [
              {
                "term": "Private latent",
                "original": "Technical term: «Private latent» as used in this literature.",
                "simple": "Latent used by only one view.",
                "def": "Latent used by only one view."
              },
              {
                "term": "VCCA",
                "original": "Technical term: «VCCA» as used in this literature.",
                "simple": "Variational deep CCA / multi-view VAE-style model.",
                "def": "Variational deep CCA / multi-view VAE-style model."
              }
            ],
            "whatItShows": [
              "Shared/private decomposition in a probabilistic multi-view model"
            ],
            "whatItDoesNotShow": [
              "Automatic monosemantic concepts"
            ],
            "setconcaUse": [
              "Borrow shared/private design in multi-view SAE experiments.",
              "Evaluate missing-view robustness."
            ],
            "masteryChecklist": [
              "I can draw shared vs private latents.",
              "I can relate VCCA to VAE + CCA ideas."
            ],
            "commonConfusions": [
              {
                "wrong": "Shared latent means views are identical.",
                "right": "Shared explains commonality; private can differ."
              }
            ],
            "quiz": [
              {
                "q": "VCCA's private latents capture?",
                "options": [
                  "View-specific information",
                  "Only noise always",
                  "Only labels",
                  "Only TopK"
                ],
                "a": 0,
                "explain": "Private = view-specific."
              }
            ],
            "originalIdea": "Deep variational CCA with shared (and optionally private) latents and a generative multi-view story.",
            "simpleLesson": "VCCA extends the latent-variable view of CCA into deep generative models. A shared latent explains both views; private latents can explain view-specific details.\n\nBecause it is generative, it can handle missing views in principle. The probabilistic framing clarifies what 'alignment' means: shared latents, not forced identical embeddings.",
            "limitPairs": [
              {
                "original": "Shared/private decomposition in a probabilistic multi-view model",
                "simple": "In practice this means evidence supports: Shared/private decomposition in a probabilistic multi-view model"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "Automatic monosemantic concepts",
                "simple": "Do not overclaim: Automatic monosemantic concepts"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Borrow shared/private design in multi-view SAE experiments.",
                "simple": "Action item: Borrow shared/private design in multi-view SAE experiments."
              },
              {
                "original": "Evaluate missing-view robustness.",
                "simple": "Action item: Evaluate missing-view robustness."
              }
            ]
          },
          "quiz": [
            {
              "q": "VCCA's private latents capture?",
              "options": [
                "View-specific information",
                "Only noise always",
                "Only labels",
                "Only TopK"
              ],
              "a": 0,
              "explain": "Private = view-specific."
            }
          ]
        },
        {
          "id": "dgcca",
          "num": 9,
          "title": "Deep Generalized Canonical Correlation Analysis",
          "authors": "Benton et al.",
          "file": "1702.02519v2.pdf",
          "learn": [
            "Extending CCA to arbitrary numbers of views",
            "Common representation across several views",
            "Multi-view information decomposition"
          ],
          "setconca": "Conceptual motivation for multi-view SetConCA.",
          "optional": false,
          "abstract": "We present Deep Generalized Canonical Correlation Analysis (DGCCA) – a method for learning nonlinear transformations of arbitrarily many views of data, such that the resulting transformations are maximally informative of each other. While methods for nonlinear two-view representation learning (Deep CCA, (An- drew et al., 2013)) and linear many-view representation learning (Generalized CCA (Horst, 1961)) exist, DGCCA is the ﬁrst CCA-style multiview representation learning technique that combines the ﬂexibility of nonlinear (deep) representation learning with the statistical power of incorporating information from many inde- pendent sources, or views. We present the DGCCA formulation as well as an efﬁcient stochastic optimization algorithm for solving it. We learn DGCCA repre- sentations on two distinct datasets for three downstream tasks: phonetic transcrip- tion from acoustic and articulatory measurements, and recommending hashtags and friends on a dataset of Twitter users. We ﬁnd that DGCCA representations soundly beat existing methods at phonetic transcription and hashtag recommenda- tion, and in general perform no worse than standard linear many-view techniques. 1",
          "pages": 14,
          "pdfPath": "RAW/1702.02519v2.pdf",
          "teach": {
            "whyWeRead": "Extends CCA thinking from two views to many views — the conceptual jump SetConCA needs.",
            "oneSentence": "Deep generalized CCA learns a common representation across an arbitrary number of views.",
            "plainLanguage": "Real problems often have more than two views: many layers, many paraphrases, many sites. DGCCA seeks a common representation that explains shared information across several views.\n\nThe key question becomes: what common code should all views agree on? Not: how do we force every view embedding to be identical.",
            "keyIdeas": [
              {
                "title": "Many-view generalisation",
                "original": "DGCCA extends canonical correlation thinking beyond two views to an arbitrary number of views.",
                "simple": "Not just twins — a whole committee of views.",
                "explain": "DGCCA extends canonical correlation thinking beyond two views to an arbitrary number of views."
              },
              {
                "title": "Common representation",
                "original": "Learn a common representation that relates to every view’s nonlinear embedding.",
                "simple": "Find one shared board that every view can point to.",
                "explain": "Learn a common representation that relates to every view’s nonlinear embedding."
              },
              {
                "title": "Deep encoders per view",
                "original": "Each view has its own deep encoder into a joint GCCA-style analysis.",
                "simple": "Every view brings its own neural translator to the joint meeting.",
                "explain": "Each view has its own deep encoder into a joint GCCA-style analysis."
              }
            ],
            "simplifiedMath": [],
            "vocabulary": [
              {
                "term": "GCCA / DGCCA",
                "original": "Technical term: «GCCA / DGCCA» as used in this literature.",
                "simple": "Generalized CCA; deep version for many views.",
                "def": "Generalized CCA; deep version for many views."
              }
            ],
            "whatItShows": [
              "Multi-view shared representation beyond two views"
            ],
            "whatItDoesNotShow": [
              "Optimal aggregation for SAE feature dictionaries"
            ],
            "setconcaUse": [
              "Motivate multi-view SetConCA with DGCCA's question.",
              "Use many-view CCA baselines before contrastive set losses."
            ],
            "masteryChecklist": [
              "I can explain why two-view CCA is not enough for SetConCA.",
              "I can state DGCCA's central question."
            ],
            "commonConfusions": [
              {
                "wrong": "More views means force them all equal.",
                "right": "Seek common shared structure; keep private."
              }
            ],
            "quiz": [
              {
                "q": "DGCCA is for?",
                "options": [
                  "Many views",
                  "Only images",
                  "Only TopK SAEs",
                  "Only probes"
                ],
                "a": 0,
                "explain": "Generalized multi-view CCA."
              }
            ],
            "originalIdea": "Deep generalized CCA learns a common representation across an arbitrary number of views.",
            "simpleLesson": "Real problems often have more than two views: many layers, many paraphrases, many sites. DGCCA seeks a common representation that explains shared information across several views.\n\nThe key question becomes: what common code should all views agree on? Not: how do we force every view embedding to be identical.",
            "limitPairs": [
              {
                "original": "Multi-view shared representation beyond two views",
                "simple": "In practice this means evidence supports: Multi-view shared representation beyond two views"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "Optimal aggregation for SAE feature dictionaries",
                "simple": "Do not overclaim: Optimal aggregation for SAE feature dictionaries"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Motivate multi-view SetConCA with DGCCA's question.",
                "simple": "Action item: Motivate multi-view SetConCA with DGCCA's question."
              },
              {
                "original": "Use many-view CCA baselines before contrastive set losses.",
                "simple": "Action item: Use many-view CCA baselines before contrastive set losses."
              }
            ]
          },
          "quiz": [
            {
              "q": "DGCCA is for?",
              "options": [
                "Many views",
                "Only images",
                "Only TopK SAEs",
                "Only probes"
              ],
              "a": 0,
              "explain": "Generalized multi-view CCA."
            }
          ]
        }
      ],
      "primer": {
        "title": "Nonlinear multi-view representation learning",
        "mission": "Separate shared vs view-specific information; know DCCA, DCCAE, VCCA, DGCCA.",
        "beforeYouStart": "CCA from Level 1; reconstruction from Level 2.",
        "primer": "A view is one observation of the same underlying object: two layers, two paraphrases, two modalities, or several activation sites.\n\nLinear CCA finds shared linear directions. Deep CCA replaces the linear maps with neural nets.\n\nDanger: maximizing correlation alone can throw away useful view-specific structure. DCCAE adds reconstruction to protect information. VCCA uses shared and private latents in a generative model. DGCCA extends the idea to many views.\n\nSetConCA must not force all views to become identical. Align what is shared; preserve what is private.",
        "bigPictureDiagram": [
          "View A ─┐",
          "         ├─→ shared z  → align",
          "View B ─┘      private z_a, z_b → reconstruct each view"
        ],
        "conceptsToMaster": [
          {
            "name": "Shared vs private",
            "simple": "Shared = common across views; private = view-only.",
            "deeper": "Aligning everything can erase useful activation structure."
          },
          {
            "name": "Whitening / covariance constraints",
            "simple": "Normalize so correlation is meaningful.",
            "deeper": "DCCA typically constrains latent covariance."
          }
        ],
        "checkpoint": {
          "goal": "Visualize shared vs private latents.",
          "steps": [
            "Train a simple multi-view model",
            "Ablate shared vs private",
            "See what retrieval vs reconstruction need"
          ],
          "successLooksLike": "You refuse to equate 'aligned' with 'identical'."
        },
        "bridgeToNext": "When views form an unordered set, you need set architectures."
      }
    },
    {
      "id": 4,
      "title": "Learning representations of sets",
      "weeks": "7",
      "checkpoint": "Compare mean pooling, Deep Sets, Set Transformer, and Gaussian product-of-experts on reconstruction, view removal, intruder robustness, set-size generalisation.",
      "papers": [
        {
          "id": "deepsets",
          "num": 10,
          "title": "Deep Sets",
          "authors": "Zaheer et al.",
          "file": "1703.06114v3.pdf",
          "learn": [
            "Permutation invariance and equivariance",
            "f(X)=ρ(Σφ(x)) form",
            "What mean/sum pooling preserves or loses",
            "Why ordering should not affect set representation"
          ],
          "setconca": "Essential for aggregating multiple activation views into one concept code.",
          "optional": false,
          "abstract": "We study the problem of designing models for machine learning tasks deﬁned on sets. In contrast to traditional approach of operating on ﬁxed dimensional vectors, we consider objective functions deﬁned on sets that are invariant to permutations. Such problems are widespread, ranging from estimation of population statistics [1], to anomaly detection in piezometer data of embankment dams [2], to cosmology [3, 4]. Our main theorem characterizes the permutation invariant functions and provides a family of functions to which any permutation invariant objective function must belong. This family of functions has a special structure which enables us to design a deep network architecture that can operate on sets and which can be deployed on a variety of scenarios including both unsupervised and supervised learning tasks. We also derive the necessary and sufﬁcient conditions for permutation equivariance in deep models. We demonstrate the applicability of our method on population statistic estimation, point cloud classiﬁcation, set expansion, and outlier detection. 1",
          "pages": 29,
          "pdfPath": "RAW/1703.06114v3.pdf",
          "teach": {
            "whyWeRead": "Essential theory for aggregating unordered activation views into one concept code.",
            "oneSentence": "Characterises permutation-invariant set functions as ρ(Σ φ(x)).",
            "plainLanguage": "If your input is a set, order must not matter. Deep Sets shows that (under mild conditions) invariant functions can be written as: encode each element, sum the encodings, then apply a network ρ.\n\nMean pooling is the special case where φ is identity-ish and ρ is simple. Sum/mean can lose information about pairwise relations and multiplicities in some tasks.\n\nIf SetConCA's meaning depends on how views relate — not just their average — Deep Sets alone may be insufficient; consider attention.",
            "keyIdeas": [
              {
                "title": "Permutation invariance",
                "original": "A set function satisfies f(π(X))=f(X) for every permutation π.",
                "simple": "Shuffling the bag must not change the answer.",
                "explain": "A set function satisfies f(π(X))=f(X) for every permutation π."
              },
              {
                "title": "Sum-decomposition",
                "original": "Under mild conditions, invariant set functions can be written f(X)=ρ(∑_x φ(x)).",
                "simple": "Encode each item, add the encodings, then transform the sum — that is enough in theory.",
                "explain": "Under mild conditions, invariant set functions can be written f(X)=ρ(∑_x φ(x))."
              },
              {
                "title": "What pooling preserves",
                "original": "Sum/mean pooling preserves aggregate statistics but can lose relational/pairwise structure.",
                "simple": "Averages remember totals; they can forget who interacted with whom.",
                "explain": "Sum/mean pooling preserves aggregate statistics but can lose relational/pairwise structure."
              },
              {
                "title": "Equivariance",
                "original": "Equivariant maps permute outputs when inputs are permuted — useful for per-member predictions.",
                "simple": "If you shuffle inputs, outputs shuffle the same way.",
                "explain": "Equivariant maps permute outputs when inputs are permuted — useful for per-member predictions."
              }
            ],
            "simplifiedMath": [
              {
                "name": "Deep Sets form",
                "formula": "f(X)=ρ(∑_{x∈X} φ(x))",
                "original": "Deep Sets form: f(X)=ρ(∑_{x∈X} φ(x))",
                "simple": "Encode, sum-pool, transform.",
                "meaning": "Encode, sum-pool, transform."
              }
            ],
            "vocabulary": [
              {
                "term": "Permutation invariance",
                "original": "Technical term: «Permutation invariance» as used in this literature.",
                "simple": "Order-independent set function.",
                "def": "Order-independent set function."
              },
              {
                "term": "Pooling",
                "original": "Technical term: «Pooling» as used in this literature.",
                "simple": "Aggregate many vectors into one.",
                "def": "Aggregate many vectors into one."
              }
            ],
            "whatItShows": [
              "A universal architectural pattern for invariant set learning"
            ],
            "whatItDoesNotShow": [
              "That mean pooling is always enough semantically"
            ],
            "setconcaUse": [
              "Default aggregator candidate: Deep Sets.",
              "Ablate against mean and Set Transformer."
            ],
            "masteryChecklist": [
              "I can write the Deep Sets formula.",
              "I know when mean pooling fails."
            ],
            "commonConfusions": [
              {
                "wrong": "Any MLP on concatenated views is fine.",
                "right": "Concatenation encodes order unless carefully handled."
              }
            ],
            "quiz": [
              {
                "q": "Deep Sets core form?",
                "options": [
                  "ρ(sum φ(x))",
                  "softmax only",
                  "PCA only",
                  "CCA only"
                ],
                "a": 0,
                "explain": "Encode–sum–transform."
              }
            ],
            "originalIdea": "Characterises permutation-invariant set functions as ρ(Σ φ(x)).",
            "simpleLesson": "If your input is a set, order must not matter. Deep Sets shows that (under mild conditions) invariant functions can be written as: encode each element, sum the encodings, then apply a network ρ.\n\nMean pooling is the special case where φ is identity-ish and ρ is simple. Sum/mean can lose information about pairwise relations and multiplicities in some tasks.\n\nIf SetConCA's meaning depends on how views relate — not just their average — Deep Sets alone may be insufficient; consider attention.",
            "limitPairs": [
              {
                "original": "A universal architectural pattern for invariant set learning",
                "simple": "In practice this means evidence supports: A universal architectural pattern for invariant set learning"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That mean pooling is always enough semantically",
                "simple": "Do not overclaim: That mean pooling is always enough semantically"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Default aggregator candidate: Deep Sets.",
                "simple": "Action item: Default aggregator candidate: Deep Sets."
              },
              {
                "original": "Ablate against mean and Set Transformer.",
                "simple": "Action item: Ablate against mean and Set Transformer."
              }
            ]
          },
          "quiz": [
            {
              "q": "Deep Sets core form?",
              "options": [
                "ρ(sum φ(x))",
                "softmax only",
                "PCA only",
                "CCA only"
              ],
              "a": 0,
              "explain": "Encode–sum–transform."
            }
          ]
        },
        {
          "id": "neural-stat",
          "num": 11,
          "title": "Towards a Neural Statistician",
          "authors": "Edwards and Storkey",
          "file": "1606.02185v2.pdf",
          "learn": [
            "Set as object with latent representation",
            "Reconstruct members vs distribution",
            "Set-level latent capturing shared structure"
          ],
          "setconca": "What should a set code represent for a group of related activations?",
          "optional": false,
          "abstract": "An efﬁcient learner is one who reuses what they already know to tackle a new problem. For a machine learner, this means understanding the similarities amongst datasets. In order to do this, one must take seriously the idea of working with datasets, rather than datapoints, as the key objects to model. Towards this goal, we demonstrate an extension of a variational autoencoder that can learn a method for computing representations, or statistics, of datasets in an unsupervised fash- ion. The network is trained to produce statistics that encapsulate a generative model for each dataset. Hence the network enables efﬁcient learning from new datasets for both unsupervised and supervised tasks. We show that we are able to learn statistics that can be used for: clustering datasets, transferring generative models to new datasets, selecting representative samples of datasets and classify- ing previously unseen classes. We refer to our model as a neural statistician, and by this we mean a neural network that can learn to compute summary statistics of datasets without supervision. 1",
          "pages": 13,
          "pdfPath": "RAW/1606.02185v2.pdf",
          "teach": {
            "whyWeRead": "Treats a whole set/dataset as an object with a latent — clarifies what a set code should mean.",
            "oneSentence": "Learns latent representations of datasets/sets, aiming to capture shared generative structure.",
            "plainLanguage": "Sometimes the object of interest is not one example but a collection: a dataset, a class, a bag of views. The Neural Statistician learns a latent that represents the set's underlying distributional structure.\n\nAsk: should your set code reconstruct members, or capture the distribution they come from? For SetConCA, a concept code might need shared structure across views more than perfect member reconstruction.",
            "keyIdeas": [
              {
                "title": "Set as object",
                "original": "The modelling target is a latent for an entire set/dataset, not a single example.",
                "simple": "The whole bag is one object with one code.",
                "explain": "The modelling target is a latent for an entire set/dataset, not a single example."
              },
              {
                "title": "Statistic network",
                "original": "A network maps variable-sized sets into latent statistics describing shared generative structure.",
                "simple": "Read a summary of the bag into a fixed-size latent.",
                "explain": "A network maps variable-sized sets into latent statistics describing shared generative structure."
              },
              {
                "title": "Distributional view",
                "original": "The set latent aims to capture the distribution members are drawn from.",
                "simple": "Not ‘this one point’ — ‘what kind of cloud these points come from.’",
                "explain": "The set latent aims to capture the distribution members are drawn from."
              }
            ],
            "simplifiedMath": [],
            "vocabulary": [
              {
                "term": "Set latent",
                "original": "Technical term: «Set latent» as used in this literature.",
                "simple": "A code for an entire set, not one element.",
                "def": "A code for an entire set, not one element."
              }
            ],
            "whatItShows": [
              "Sets can be first-class latent objects"
            ],
            "whatItDoesNotShow": [
              "Exact recipe for SAE multi-view fusion"
            ],
            "setconcaUse": [
              "Decide whether set codes target member recon or shared concept structure."
            ],
            "masteryChecklist": [
              "I can state what a set-level latent is for."
            ],
            "commonConfusions": [
              {
                "wrong": "Set code = mean of members always.",
                "right": "Mean is one statistic; latents can be richer."
              }
            ],
            "quiz": [
              {
                "q": "Neural Statistician mainly represents?",
                "options": [
                  "A whole set/dataset",
                  "One pixel",
                  "Only a probe",
                  "Only PCA"
                ],
                "a": 0,
                "explain": "Set-level latent."
              }
            ],
            "originalIdea": "Learns latent representations of datasets/sets, aiming to capture shared generative structure.",
            "simpleLesson": "Sometimes the object of interest is not one example but a collection: a dataset, a class, a bag of views. The Neural Statistician learns a latent that represents the set's underlying distributional structure.\n\nAsk: should your set code reconstruct members, or capture the distribution they come from? For SetConCA, a concept code might need shared structure across views more than perfect member reconstruction.",
            "limitPairs": [
              {
                "original": "Sets can be first-class latent objects",
                "simple": "In practice this means evidence supports: Sets can be first-class latent objects"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "Exact recipe for SAE multi-view fusion",
                "simple": "Do not overclaim: Exact recipe for SAE multi-view fusion"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Decide whether set codes target member recon or shared concept structure.",
                "simple": "Action item: Decide whether set codes target member recon or shared concept structure."
              }
            ]
          },
          "quiz": [
            {
              "q": "Neural Statistician mainly represents?",
              "options": [
                "A whole set/dataset",
                "One pixel",
                "Only a probe",
                "Only PCA"
              ],
              "a": 0,
              "explain": "Set-level latent."
            }
          ]
        },
        {
          "id": "set-transformer",
          "num": 12,
          "title": "Set Transformer",
          "authors": "Lee et al.",
          "file": "1810.00825v3.pdf",
          "learn": [
            "Self-attention over set members",
            "Inducing points and attention pooling",
            "Expressivity vs computational complexity"
          ],
          "setconca": "When set meaning cannot be recovered from simple mean pooling.",
          "optional": false,
          "abstract": "Many machine learning tasks such as multiple instance learning, 3D shape recognition and few- shot image classiﬁcation are deﬁned on sets of in- stances. Since solutions to such problems do not depend on the order of elements of the set, mod- els used to address them should be permutation invariant. We present an attention-based neural network module, the Set Transformer, speciﬁcally designed to model interactions among elements in the input set. The model consists of an encoder and a decoder, both of which rely on attention mechanisms. In an effort to reduce computational complexity, we introduce an attention scheme in- spired by inducing point methods from sparse Gaussian process literature. It reduces computa- tion time of self-attention from quadratic to linear in the number of elements in the set. We show that our model is theoretically attractive and we evaluate it on a range of tasks, demonstrating in- creased performance compared to recent methods for set-structured data.",
          "pages": 17,
          "pdfPath": "RAW/1810.00825v3.pdf",
          "teach": {
            "whyWeRead": "When set meaning needs interactions among members, attention beats independent pooling.",
            "oneSentence": "Attention-based permutation-invariant networks with self-attention and inducing points.",
            "plainLanguage": "Deep Sets encodes members independently before pooling. Set Transformer lets members attend to each other, modelling pairwise structure, then pools (including attention pooling).\n\nInducing points reduce quadratic cost by attending through a smaller set of learned points.\n\nUse this when average pooling cannot recover the concept — e.g. when a few views are critical and others are distractors.",
            "keyIdeas": [
              {
                "title": "Self-attention over members",
                "original": "Set Transformer lets set elements attend to each other before aggregation.",
                "simple": "Items talk to each other before the summary is written.",
                "explain": "Set Transformer lets set elements attend to each other before aggregation."
              },
              {
                "title": "Attention pooling",
                "original": "Pooling can be implemented via attention weights rather than uniform mean/sum.",
                "simple": "Important members get louder votes in the final summary.",
                "explain": "Pooling can be implemented via attention weights rather than uniform mean/sum."
              },
              {
                "title": "Inducing points",
                "original": "Learned inducing points reduce quadratic attention cost by attending through a smaller bottleneck set.",
                "simple": "A small set of meeting hubs keeps attention cheaper.",
                "explain": "Learned inducing points reduce quadratic attention cost by attending through a smaller bottleneck set."
              },
              {
                "title": "Expressivity vs cost",
                "original": "Higher relational expressivity increases compute and sample needs.",
                "simple": "More power costs more time and can overfit small view sets.",
                "explain": "Higher relational expressivity increases compute and sample needs."
              }
            ],
            "simplifiedMath": [],
            "vocabulary": [
              {
                "term": "Inducing points",
                "original": "Technical term: «Inducing points» as used in this literature.",
                "simple": "Learned bottleneck elements for efficient attention.",
                "def": "Learned bottleneck elements for efficient attention."
              },
              {
                "term": "Attention pooling",
                "original": "Technical term: «Attention pooling» as used in this literature.",
                "simple": "Pool by attention weights rather than uniform mean.",
                "def": "Pool by attention weights rather than uniform mean."
              }
            ],
            "whatItShows": [
              "Interaction-aware set models outperform independent pooling on relational tasks"
            ],
            "whatItDoesNotShow": [
              "That attention always helps SAE stability"
            ],
            "setconcaUse": [
              "Baseline aggregator when intruders/relations matter.",
              "Watch compute and overfitting on small view sets."
            ],
            "masteryChecklist": [
              "I can contrast Deep Sets vs Set Transformer.",
              "I know what inducing points buy."
            ],
            "commonConfusions": [
              {
                "wrong": "Attention always beats mean pooling.",
                "right": "Not if the concept truly is an average and data is tiny."
              }
            ],
            "quiz": [
              {
                "q": "Set Transformer adds?",
                "options": [
                  "Member interactions via attention",
                  "Only PCA",
                  "Only L1",
                  "Only CCA"
                ],
                "a": 0,
                "explain": "Self-attention over set elements."
              }
            ],
            "originalIdea": "Attention-based permutation-invariant networks with self-attention and inducing points.",
            "simpleLesson": "Deep Sets encodes members independently before pooling. Set Transformer lets members attend to each other, modelling pairwise structure, then pools (including attention pooling).\n\nInducing points reduce quadratic cost by attending through a smaller set of learned points.\n\nUse this when average pooling cannot recover the concept — e.g. when a few views are critical and others are distractors.",
            "limitPairs": [
              {
                "original": "Interaction-aware set models outperform independent pooling on relational tasks",
                "simple": "In practice this means evidence supports: Interaction-aware set models outperform independent pooling on relational tasks"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That attention always helps SAE stability",
                "simple": "Do not overclaim: That attention always helps SAE stability"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Baseline aggregator when intruders/relations matter.",
                "simple": "Action item: Baseline aggregator when intruders/relations matter."
              },
              {
                "original": "Watch compute and overfitting on small view sets.",
                "simple": "Action item: Watch compute and overfitting on small view sets."
              }
            ]
          },
          "quiz": [
            {
              "q": "Set Transformer adds?",
              "options": [
                "Member interactions via attention",
                "Only PCA",
                "Only L1",
                "Only CCA"
              ],
              "a": 0,
              "explain": "Self-attention over set elements."
            }
          ]
        },
        {
          "id": "multi-set-transformer",
          "num": null,
          "title": "Learning Functions on Multiple Sets using Multi-Set Transformers",
          "authors": "Selby et al.",
          "file": "selby22a.pdf",
          "learn": [
            "Relationships between several sets",
            "Multi-set attention"
          ],
          "setconca": "Optional advanced reading for cross-set relationships.",
          "optional": true,
          "abstract": "We propose a general deep architecture for learning functions on multiple permutation-invariant sets. We also show how to generalize this architecture to sets of elements of any dimension by dimension equivariance. We demonstrate that our architecture is a universal approximator of these functions, and show superior results to existing methods on a va- riety of tasks including counting tasks, alignment tasks, distinguishability tasks and statistical dis- tance measurements. This last task is quite impor- tant in Machine Learning. Although our approach is quite general, we demonstrate that it can gener- ate approximate estimates of KL divergence and mutual information that are more accurate than previous techniques that are speciﬁcally designed to approximate those statistical distances. 1",
          "pages": 11,
          "pdfPath": "RAW/selby22a.pdf",
          "teach": {
            "whyWeRead": "Optional advanced reading when relationships exist between several sets, not only within one set.",
            "oneSentence": "Extends set transformers to functions on multiple sets.",
            "plainLanguage": "Sometimes you have several sets (e.g. views of concept A vs concept B) and need relations between sets. Multi-Set Transformers model within- and between-set interactions.\n\nOnly needed when SetConCA experiments involve multiple concept-sets interacting.",
            "keyIdeas": [
              {
                "title": "Multiple sets as input",
                "original": "The architecture consumes several sets, not one bag.",
                "simple": "Several bags enter together.",
                "explain": "The architecture consumes several sets, not one bag."
              },
              {
                "title": "Cross-set attention",
                "original": "Attention can model relations within and between sets.",
                "simple": "Items may look inside their bag and across bags.",
                "explain": "Attention can model relations within and between sets."
              }
            ],
            "simplifiedMath": [],
            "vocabulary": [
              {
                "term": "Multi-set model",
                "original": "Technical term: «Multi-set model» as used in this literature.",
                "simple": "Architecture taking several sets as arguments.",
                "def": "Architecture taking several sets as arguments."
              }
            ],
            "whatItShows": [
              "Cross-set relational modelling is possible with attention"
            ],
            "whatItDoesNotShow": [
              "Necessity for basic SetConCA"
            ],
            "setconcaUse": [
              "Optional: cross-concept set relations."
            ],
            "masteryChecklist": [
              "I know when multi-set models are needed vs single-set."
            ],
            "commonConfusions": [
              {
                "wrong": "Required for any multi-view SAE.",
                "right": "Optional; single-set aggregation often comes first."
              }
            ],
            "quiz": [
              {
                "q": "Multi-Set Transformers help when?",
                "options": [
                  "Relations between several sets matter",
                  "Only training PCA",
                  "Only FVU",
                  "Never"
                ],
                "a": 0,
                "explain": "Cross-set relations."
              }
            ],
            "originalIdea": "Extends set transformers to functions on multiple sets.",
            "simpleLesson": "Sometimes you have several sets (e.g. views of concept A vs concept B) and need relations between sets. Multi-Set Transformers model within- and between-set interactions.\n\nOnly needed when SetConCA experiments involve multiple concept-sets interacting.",
            "limitPairs": [
              {
                "original": "Cross-set relational modelling is possible with attention",
                "simple": "In practice this means evidence supports: Cross-set relational modelling is possible with attention"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "Necessity for basic SetConCA",
                "simple": "Do not overclaim: Necessity for basic SetConCA"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Optional: cross-concept set relations.",
                "simple": "Action item: Optional: cross-concept set relations."
              }
            ]
          },
          "quiz": [
            {
              "q": "Multi-Set Transformers help when?",
              "options": [
                "Relations between several sets matter",
                "Only training PCA",
                "Only FVU",
                "Never"
              ],
              "a": 0,
              "explain": "Cross-set relations."
            }
          ]
        }
      ],
      "primer": {
        "title": "Learning representations of sets",
        "mission": "Build permutation-invariant aggregators and know when mean pooling fails.",
        "beforeYouStart": "Shared/private multi-view from Level 3.",
        "primer": "A set has no order. The representation of {a,b,c} must equal that of {c,a,b}.\n\nDeep Sets proves a universal form: encode each member with φ, sum (or pool), then transform with ρ. Mean pooling is a special case — and it can lose pairwise structure.\n\nSet Transformer lets members talk via attention before pooling.\n\nNeural Statistician treats a whole dataset as one object with a latent — useful when the set code should capture a distribution, not one member.\n\nIn SetConCA, a concept may appear as several activation views. Aggregation choice is a first-class design decision.",
        "bigPictureDiagram": [
          "members → φ(x) → SUM/ATTN pool → ρ → set code"
        ],
        "conceptsToMaster": [
          {
            "name": "Permutation invariance",
            "simple": "Order does not change the output.",
            "deeper": "f(π(X))=f(X) for any permutation π."
          },
          {
            "name": "Equivariance",
            "simple": "Permuting inputs permutes outputs the same way.",
            "deeper": "Useful for per-member predictions."
          }
        ],
        "checkpoint": {
          "goal": "Compare mean, Deep Sets, Set Transformer, Gaussian PoE.",
          "steps": [
            "Reconstruction",
            "View removal",
            "Intruder robustness",
            "Set-size generalisation",
            "Collapse checks"
          ],
          "successLooksLike": "You know which aggregator fails when meaning is relational."
        },
        "bridgeToNext": "Contrastive learning teaches how to pull related views together."
      }
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
        "Is temperature changing geometry or merely optimisation?"
      ],
      "papers": [
        {
          "id": "cpc",
          "num": 13,
          "title": "Representation Learning with Contrastive Predictive Coding",
          "authors": "van den Oord et al.",
          "file": "1807.03748v2.pdf",
          "learn": [
            "Positive and negative pairs",
            "InfoNCE and density-ratio interpretation",
            "Mutual-information motivation",
            "Temperature and similarity functions"
          ],
          "setconca": "Conceptual foundation for contrastive coordination of SAE views.",
          "optional": false,
          "abstract": "While supervised learning has enabled great progress in many applications, unsu- pervised learning has not seen such widespread adoption, and remains an important and challenging endeavor for artiﬁcial intelligence. In this work, we propose a universal unsupervised learning approach to extract useful representations from high-dimensional data, which we call Contrastive Predictive Coding. The key in- sight of our model is to learn such representations by predicting the future in latent space by using powerful autoregressive models. We use a probabilistic contrastive loss which induces the latent space to capture information that is maximally useful to predict future samples. It also makes the model tractable by using negative sampling. While most prior work has focused on evaluating representations for a particular modality, we demonstrate that our approach is able to learn useful representations achieving strong performance on four distinct domains: speech, images, text and reinforcement learning in 3D environments. 1",
          "pages": 13,
          "pdfPath": "RAW/1807.03748v2.pdf",
          "teach": {
            "whyWeRead": "Conceptual home of InfoNCE — the standard contrastive loss family.",
            "oneSentence": "Learns representations by predicting future/context with a contrastive InfoNCE objective.",
            "plainLanguage": "CPC trains an encoder so that a representation of context can identify the true future sample among negatives. The loss is InfoNCE: a softmax cross-entropy over similarities.\n\nPositives define what 'same' means. Negatives define what 'different' means. Change either and you change the learned task.\n\nTemperature and similarity function reshape the geometry. InfoNCE relates to mutual information bounds under assumptions — useful intuition, not a licence to claim MI was measured in your SAE codes.",
            "keyIdeas": [
              {
                "title": "Positive / negative pairs",
                "original": "Contrastive learning defines a discrimination task via positives (related) and negatives (unrelated).",
                "simple": "Teach sameness and difference by examples of each.",
                "explain": "Contrastive learning defines a discrimination task via positives (related) and negatives (unrelated)."
              },
              {
                "title": "InfoNCE",
                "original": "InfoNCE is a softmax cross-entropy identifying the positive key among negatives using similarity scores.",
                "simple": "Pick the true partner out of a lineup of impostors.",
                "explain": "InfoNCE is a softmax cross-entropy identifying the positive key among negatives using similarity scores."
              },
              {
                "title": "Density-ratio view",
                "original": "Optimal scores relate to density ratios between positive and candidate distributions.",
                "simple": "The score learns ‘how much more likely is this the real partner?’",
                "explain": "Optimal scores relate to density ratios between positive and candidate distributions."
              },
              {
                "title": "Negative distribution matters",
                "original": "Hard or false negatives change the semantics of the learned representation.",
                "simple": "Bad impostors teach the wrong lesson about what ‘different’ means.",
                "explain": "Hard or false negatives change the semantics of the learned representation."
              }
            ],
            "simplifiedMath": [
              {
                "name": "InfoNCE (schematic)",
                "formula": "L = -log Softmax(sim(q,k⁺)/τ among {k⁺,k⁻})",
                "original": "InfoNCE (schematic): L = -log Softmax(sim(q,k⁺)/τ among {k⁺,k⁻})",
                "simple": "Pull positive key toward query; push negatives away; τ=temperature.",
                "meaning": "Pull positive key toward query; push negatives away; τ=temperature."
              }
            ],
            "vocabulary": [
              {
                "term": "InfoNCE",
                "original": "Technical term: «InfoNCE» as used in this literature.",
                "simple": "Contrastive loss identifying the positive among negatives.",
                "def": "Contrastive loss identifying the positive among negatives."
              },
              {
                "term": "Temperature τ",
                "original": "Technical term: «Temperature τ» as used in this literature.",
                "simple": "Softmax sharpness hyperparameter.",
                "def": "Softmax sharpness hyperparameter."
              }
            ],
            "whatItShows": [
              "Contrastive prediction learns useful representations"
            ],
            "whatItDoesNotShow": [
              "That low InfoNCE recovers ground-truth concepts in SAEs"
            ],
            "setconcaUse": [
              "Default language for multi-view contrastive terms.",
              "Document positive definition carefully."
            ],
            "masteryChecklist": [
              "I can write InfoNCE in words.",
              "I know why negatives define the task."
            ],
            "commonConfusions": [
              {
                "wrong": "InfoNCE maximises MI exactly.",
                "right": "It relates to a bound under assumptions; practice is a discrimination task."
              }
            ],
            "quiz": [
              {
                "q": "InfoNCE trains by?",
                "options": [
                  "Identifying the positive among negatives",
                  "Only PCA",
                  "Only FVU",
                  "Only L0"
                ],
                "a": 0,
                "explain": "Contrastive classification."
              }
            ],
            "originalIdea": "Learns representations by predicting future/context with a contrastive InfoNCE objective.",
            "simpleLesson": "CPC trains an encoder so that a representation of context can identify the true future sample among negatives. The loss is InfoNCE: a softmax cross-entropy over similarities.\n\nPositives define what 'same' means. Negatives define what 'different' means. Change either and you change the learned task.\n\nTemperature and similarity function reshape the geometry. InfoNCE relates to mutual information bounds under assumptions — useful intuition, not a licence to claim MI was measured in your SAE codes.",
            "limitPairs": [
              {
                "original": "Contrastive prediction learns useful representations",
                "simple": "In practice this means evidence supports: Contrastive prediction learns useful representations"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That low InfoNCE recovers ground-truth concepts in SAEs",
                "simple": "Do not overclaim: That low InfoNCE recovers ground-truth concepts in SAEs"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Default language for multi-view contrastive terms.",
                "simple": "Action item: Default language for multi-view contrastive terms."
              },
              {
                "original": "Document positive definition carefully.",
                "simple": "Action item: Document positive definition carefully."
              }
            ]
          },
          "quiz": [
            {
              "q": "InfoNCE trains by?",
              "options": [
                "Identifying the positive among negatives",
                "Only PCA",
                "Only FVU",
                "Only L0"
              ],
              "a": 0,
              "explain": "Contrastive classification."
            }
          ]
        },
        {
          "id": "simclr",
          "num": 14,
          "title": "A Simple Framework for Contrastive Learning of Visual Representations (SimCLR)",
          "authors": "Chen et al.",
          "file": "2002.05709v3.pdf",
          "learn": [
            "Data augmentation",
            "Projection heads",
            "Batch size, normalisation, temperature",
            "Definition of positive pairs"
          ],
          "setconca": "Template for designing contrastive view generation.",
          "optional": false,
          "abstract": "This paper presents SimCLR: a simple framework for contrastive learning of visual representations. We simplify recently proposed contrastive self- supervised learning algorithms without requiring specialized architectures or a memory bank. In order to understand what enables the contrastive prediction tasks to learn useful representations, we systematically study the major components of our framework. We show that (1) composition of data augmentations plays a critical role in deﬁning effective predictive tasks, (2) introducing a learn- able nonlinear transformation between the repre- sentation and the contrastive loss substantially im- proves the quality of the learned representations, and (3) contrastive learning beneﬁts from larger batch sizes and more training steps compared to supervised learning. By combining these ﬁndings, we are able to considerably outperform previous methods for self-supervised and semi-supervised learning on ImageNet. A linear classiﬁer trained on self-supervised representations learned by Sim- CLR achieves 76.5% top-1 accuracy, which is a 7% relative improvement over previous state-of- the-art, matching the performance of a supervised ResNet-50. When ﬁne",
          "pages": 20,
          "pdfPath": "RAW/2002.05709v3.pdf",
          "teach": {
            "whyWeRead": "Shows practical ingredients of contrastive learning: augmentations, projection heads, batch size, temperature.",
            "oneSentence": "A simple contrastive framework showing what matters empirically for visual representation learning.",
            "plainLanguage": "SimCLR creates two augmented views of an image as a positive pair, embeds them, maps through a projection head, and applies InfoNCE with in-batch negatives.\n\nLessons that transfer beyond vision: positive-pair definition (augmentation) is crucial; projection heads help training but may be discarded later; normalisation and temperature matter; large batches supply negatives.\n\nFor SetConCA, 'augmentation' becomes 'how you form views of the same concept'.",
            "keyIdeas": [
              {
                "title": "Augmentation defines positives",
                "original": "Two augmented views of one image form a positive pair — the augmentation policy is the task definition.",
                "simple": "Whatever transform you call ‘same thing’ becomes the meaning of similarity.",
                "explain": "Two augmented views of one image form a positive pair — the augmentation policy is the task definition."
              },
              {
                "title": "Projection head",
                "original": "A MLP projection head maps representations into the space where InfoNCE is applied; often discarded downstream.",
                "simple": "A temporary adapter for the loss — you may keep the layer before it for later use.",
                "explain": "A MLP projection head maps representations into the space where InfoNCE is applied; often discarded downstream."
              },
              {
                "title": "Batch negatives",
                "original": "Other in-batch examples act as negatives for the contrastive loss.",
                "simple": "Everyone else in the minibatch is treated as ‘not my twin.’",
                "explain": "Other in-batch examples act as negatives for the contrastive loss."
              },
              {
                "title": "Normalisation & temperature",
                "original": "ℓ2 normalisation and temperature τ reshape the similarity geometry and gradient focus.",
                "simple": "Normalise directions; τ controls how sharp the ‘pick the twin’ exam is.",
                "explain": "ℓ2 normalisation and temperature τ reshape the similarity geometry and gradient focus."
              }
            ],
            "simplifiedMath": [],
            "vocabulary": [
              {
                "term": "Projection head",
                "original": "Technical term: «Projection head» as used in this literature.",
                "simple": "Network mapping representations to the contrastive space.",
                "def": "Network mapping representations to the contrastive space."
              },
              {
                "term": "In-batch negatives",
                "original": "Technical term: «In-batch negatives» as used in this literature.",
                "simple": "Negatives taken from other examples in the minibatch.",
                "def": "Negatives taken from other examples in the minibatch."
              }
            ],
            "whatItShows": [
              "Which practical choices make contrastive learning work"
            ],
            "whatItDoesNotShow": [
              "That vision augmentations translate unchanged to activation views"
            ],
            "setconcaUse": [
              "Treat view construction as carefully as SimCLR treats augmentation.",
              "Ablate projection head: does info remain in SAE codes?"
            ],
            "masteryChecklist": [
              "I can list SimCLR's critical ingredients.",
              "I can translate 'augmentation' to 'view definition'."
            ],
            "commonConfusions": [
              {
                "wrong": "Projection head output is always the representation you should keep.",
                "right": "Often the pre-projection embedding is used downstream."
              }
            ],
            "quiz": [
              {
                "q": "In SimCLR, positives are mainly defined by?",
                "options": [
                  "Data augmentations of the same image",
                  "Random labels",
                  "PCA",
                  "L1"
                ],
                "a": 0,
                "explain": "Augmentation defines sameness."
              }
            ],
            "originalIdea": "A simple contrastive framework showing what matters empirically for visual representation learning.",
            "simpleLesson": "SimCLR creates two augmented views of an image as a positive pair, embeds them, maps through a projection head, and applies InfoNCE with in-batch negatives.\n\nLessons that transfer beyond vision: positive-pair definition (augmentation) is crucial; projection heads help training but may be discarded later; normalisation and temperature matter; large batches supply negatives.\n\nFor SetConCA, 'augmentation' becomes 'how you form views of the same concept'.",
            "limitPairs": [
              {
                "original": "Which practical choices make contrastive learning work",
                "simple": "In practice this means evidence supports: Which practical choices make contrastive learning work"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That vision augmentations translate unchanged to activation views",
                "simple": "Do not overclaim: That vision augmentations translate unchanged to activation views"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Treat view construction as carefully as SimCLR treats augmentation.",
                "simple": "Action item: Treat view construction as carefully as SimCLR treats augmentation."
              },
              {
                "original": "Ablate projection head: does info remain in SAE codes?",
                "simple": "Action item: Ablate projection head: does info remain in SAE codes?"
              }
            ]
          },
          "quiz": [
            {
              "q": "In SimCLR, positives are mainly defined by?",
              "options": [
                "Data augmentations of the same image",
                "Random labels",
                "PCA",
                "L1"
              ],
              "a": 0,
              "explain": "Augmentation defines sameness."
            }
          ]
        },
        {
          "id": "supcon",
          "num": 15,
          "title": "Supervised Contrastive Learning",
          "authors": "Khosla et al.",
          "file": "2004.11362v5.pdf",
          "learn": [
            "Multiple-positive objectives",
            "Positive averaging",
            "Class-conditioned geometry",
            "Within-class compactness and between-class separation"
          ],
          "setconca": "Directly relevant to multi-view positives from the same semantic object.",
          "optional": false,
          "abstract": "Contrastive learning applied to self-supervised representation learning has seen a resurgence in recent years, leading to state of the art performance in the unsu- pervised training of deep image models. Modern batch contrastive approaches subsume or signiﬁcantly outperform traditional contrastive losses such as triplet, max-margin and the N-pairs loss. In this work, we extend the self-supervised batch contrastive approach to the fully-supervised setting, allowing us to effec- tively leverage label information. Clusters of points belonging to the same class are pulled together in embedding space, while simultaneously pushing apart clus- ters of samples from different classes. We analyze two possible versions of the supervised contrastive (SupCon) loss, identifying the best-performing formula- tion of the loss. On ResNet-200, we achieve top-1 accuracy of 81.4% on the Ima- geNet dataset, which is 0.8% above the best number reported for this architecture. We show consistent outperformance over cross-entropy on other datasets and two ResNet variants. The loss shows beneﬁts for robustness to natural corruptions, and is more stable to hyperparameter settings such as optimizers and data a",
          "pages": 23,
          "pdfPath": "RAW/2004.11362v5.pdf",
          "teach": {
            "whyWeRead": "Directly relevant: multiple positives per semantic class — like multiple views of one concept.",
            "oneSentence": "Contrastive learning with many positives sharing a class label, encouraging within-class compactness.",
            "plainLanguage": "Ordinary contrastive learning often has one positive. Supervised Contrastive Learning treats all same-class examples as positives. The loss averages attraction to all positives while repelling other classes.\n\nThis creates class-conditioned geometry: tight within class, separated between classes. Sampling imbalance matters when some classes have more positives.\n\nSetConCA mapping: each activation view of the same semantic object is a positive.",
            "keyIdeas": [
              {
                "title": "Multiple positives",
                "original": "All samples sharing a class label are treated as positives for an anchor.",
                "simple": "Every classmate is a friend to pull closer.",
                "explain": "All samples sharing a class label are treated as positives for an anchor."
              },
              {
                "title": "Positive averaging",
                "original": "The loss aggregates attraction over many positives rather than a single pair.",
                "simple": "Don’t cling to only one friend — pull toward the whole group.",
                "explain": "The loss aggregates attraction over many positives rather than a single pair."
              },
              {
                "title": "Within-class compactness",
                "original": "Optimisation tightens clusters of the same class.",
                "simple": "Same-label points form tighter blobs.",
                "explain": "Optimisation tightens clusters of the same class."
              },
              {
                "title": "Between-class separation",
                "original": "Different classes are pushed apart in embedding space.",
                "simple": "Different labels stay farther away.",
                "explain": "Different classes are pushed apart in embedding space."
              }
            ],
            "simplifiedMath": [],
            "vocabulary": [
              {
                "term": "Multi-positive contrastive loss",
                "original": "Technical term: «Multi-positive contrastive loss» as used in this literature.",
                "simple": "Contrastive objective with several positives per anchor.",
                "def": "Contrastive objective with several positives per anchor."
              }
            ],
            "whatItShows": [
              "Class-level positives improve supervised representation geometry"
            ],
            "whatItDoesNotShow": [
              "That class labels equal ground-truth concepts in SAE space"
            ],
            "setconcaUse": [
              "Use SupCon-style losses for multi-view positives.",
              "Watch imbalance when some concepts have more views."
            ],
            "masteryChecklist": [
              "I can contrast SimCLR-style vs SupCon-style positives.",
              "I can map SupCon to multi-view concepts."
            ],
            "commonConfusions": [
              {
                "wrong": "More positives always better with no caveats.",
                "right": "False positives / imbalance can distort geometry."
              }
            ],
            "quiz": [
              {
                "q": "SupCon differs by allowing?",
                "options": [
                  "Multiple positives per anchor",
                  "No encoder",
                  "No negatives ever",
                  "Only PCA"
                ],
                "a": 0,
                "explain": "Class-conditioned multi-positive loss."
              }
            ],
            "originalIdea": "Contrastive learning with many positives sharing a class label, encouraging within-class compactness.",
            "simpleLesson": "Ordinary contrastive learning often has one positive. Supervised Contrastive Learning treats all same-class examples as positives. The loss averages attraction to all positives while repelling other classes.\n\nThis creates class-conditioned geometry: tight within class, separated between classes. Sampling imbalance matters when some classes have more positives.\n\nSetConCA mapping: each activation view of the same semantic object is a positive.",
            "limitPairs": [
              {
                "original": "Class-level positives improve supervised representation geometry",
                "simple": "In practice this means evidence supports: Class-level positives improve supervised representation geometry"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That class labels equal ground-truth concepts in SAE space",
                "simple": "Do not overclaim: That class labels equal ground-truth concepts in SAE space"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Use SupCon-style losses for multi-view positives.",
                "simple": "Action item: Use SupCon-style losses for multi-view positives."
              },
              {
                "original": "Watch imbalance when some concepts have more views.",
                "simple": "Action item: Watch imbalance when some concepts have more views."
              }
            ]
          },
          "quiz": [
            {
              "q": "SupCon differs by allowing?",
              "options": [
                "Multiple positives per anchor",
                "No encoder",
                "No negatives ever",
                "Only PCA"
              ],
              "a": 0,
              "explain": "Class-conditioned multi-positive loss."
            }
          ]
        },
        {
          "id": "align-unif",
          "num": 16,
          "title": "Understanding Contrastive Representation Learning through Alignment and Uniformity",
          "authors": "Wang and Isola",
          "file": "2005.10242v10.pdf",
          "learn": [
            "Alignment: positives should be close",
            "Uniformity: avoid representation collapse",
            "Decomposing contrastive objectives"
          ],
          "setconca": "Interpret positive/negative cosine and pos-minus-neg separation.",
          "optional": false,
          "abstract": "Contrastive representation learning has been out- standingly successful in practice. In this work, we identify two key properties related to the con- trastive loss: (1) alignment (closeness) of features from positive pairs, and (2) uniformity of the in- duced distribution of the (normalized) features on the hypersphere. We prove that, asymptotically, the contrastive loss optimizes these properties, and analyze their positive effects on downstream tasks. Empirically, we introduce an optimizable metric to quantify each property. Extensive exper- iments on standard vision and language datasets conﬁrm the strong agreement between both met- rics and downstream task performance. Directly optimizing for these two metrics leads to repre- sentations with comparable or better performance at downstream tasks than contrastive learning. Project Page: ssnl.github.io/hypersphere. Code: github.com/SsnL/align uniform. github.com/SsnL/moco align uniform.",
          "pages": 41,
          "pdfPath": "RAW/2005.10242v10.pdf",
          "teach": {
            "whyWeRead": "Gives a clean geometric vocabulary for diagnosing contrastive training: alignment and uniformity.",
            "oneSentence": "Decomposes contrastive learning into aligning positives and spreading features uniformly on the hypersphere.",
            "plainLanguage": "Alignment: positive pairs should be close. Uniformity: features should not collapse into a small region of the sphere — they should spread out.\n\nA model can achieve low loss in unhealthy ways if you only watch one side. Plot positive cosine, negative cosine, and their difference with this decomposition in mind.",
            "keyIdeas": [
              {
                "title": "Alignment",
                "original": "Alignment measures closeness of embeddings of positive pairs.",
                "simple": "Twins should sit near each other.",
                "explain": "Alignment measures closeness of embeddings of positive pairs."
              },
              {
                "title": "Uniformity",
                "original": "Uniformity encourages features to spread on the hypersphere, preventing dimensional collapse.",
                "simple": "Don’t pile everyone into one corner of the sphere.",
                "explain": "Uniformity encourages features to spread on the hypersphere, preventing dimensional collapse."
              },
              {
                "title": "Hypersphere geometry",
                "original": "Normalised embeddings live on a sphere; contrastive geometry is naturally spherical.",
                "simple": "Think directions on a ball, not unbounded vectors.",
                "explain": "Normalised embeddings live on a sphere; contrastive geometry is naturally spherical."
              },
              {
                "title": "Diagnostic metrics",
                "original": "Track alignment and uniformity to interpret training beyond scalar loss.",
                "simple": "Loss can hide failure modes; these two meters expose them.",
                "explain": "Track alignment and uniformity to interpret training beyond scalar loss."
              }
            ],
            "simplifiedMath": [],
            "vocabulary": [
              {
                "term": "Alignment",
                "original": "Technical term: «Alignment» as used in this literature.",
                "simple": "Closeness of positive-pair embeddings.",
                "def": "Closeness of positive-pair embeddings."
              },
              {
                "term": "Uniformity",
                "original": "Technical term: «Uniformity» as used in this literature.",
                "simple": "How evenly embeddings spread (anti-collapse).",
                "def": "How evenly embeddings spread (anti-collapse)."
              }
            ],
            "whatItShows": [
              "Contrastive success factors can be split into two geometric properties"
            ],
            "whatItDoesNotShow": [
              "Concept completeness or causal faithfulness"
            ],
            "setconcaUse": [
              "Log alignment and uniformity whenever training contrastive SAE terms.",
              "Detect collapse early."
            ],
            "masteryChecklist": [
              "I can define alignment and uniformity.",
              "I can diagnose collapse using them."
            ],
            "commonConfusions": [
              {
                "wrong": "Perfect alignment alone is success.",
                "right": "Without uniformity, everything collapses together."
              }
            ],
            "quiz": [
              {
                "q": "Uniformity fights?",
                "options": [
                  "Representation collapse",
                  "SVD",
                  "FVU only",
                  "Probes only"
                ],
                "a": 0,
                "explain": "Spread prevents collapse."
              }
            ],
            "originalIdea": "Decomposes contrastive learning into aligning positives and spreading features uniformly on the hypersphere.",
            "simpleLesson": "Alignment: positive pairs should be close. Uniformity: features should not collapse into a small region of the sphere — they should spread out.\n\nA model can achieve low loss in unhealthy ways if you only watch one side. Plot positive cosine, negative cosine, and their difference with this decomposition in mind.",
            "limitPairs": [
              {
                "original": "Contrastive success factors can be split into two geometric properties",
                "simple": "In practice this means evidence supports: Contrastive success factors can be split into two geometric properties"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "Concept completeness or causal faithfulness",
                "simple": "Do not overclaim: Concept completeness or causal faithfulness"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Log alignment and uniformity whenever training contrastive SAE terms.",
                "simple": "Action item: Log alignment and uniformity whenever training contrastive SAE terms."
              },
              {
                "original": "Detect collapse early.",
                "simple": "Action item: Detect collapse early."
              }
            ]
          },
          "quiz": [
            {
              "q": "Uniformity fights?",
              "options": [
                "Representation collapse",
                "SVD",
                "FVU only",
                "Probes only"
              ],
              "a": 0,
              "explain": "Spread prevents collapse."
            }
          ]
        },
        {
          "id": "vicreg",
          "num": 17,
          "title": "VICReg: Variance-Invariance-Covariance Regularization",
          "authors": "Bardes et al.",
          "file": "2105.04906v3.pdf",
          "learn": [
            "Invariance between related views",
            "Variance preservation against collapse",
            "Covariance reduction against redundancy"
          ],
          "setconca": "Useful regularisers when pure contrastive alignment damages reconstruction.",
          "optional": false,
          "abstract": "Recent self-supervised methods for image representation learning maximize the agreement between embedding vectors produced by encoders fed with different views of the same image. The main challenge is to prevent a collapse in which the encoders produce constant or non-informative vectors. We introduce VICReg (Variance-Invariance-Covariance Regularization), a method that explicitly avoids the collapse problem with two regularizations terms applied to both embeddings separately: (1) a term that maintains the variance of each embedding dimension above a threshold, (2) a term that decorrelates each pair of variables. Unlike most other approaches to the same problem, VICReg does not require techniques such as: weight sharing between the branches, batch normalization, feature-wise normalization, output quantization, stop gradient, memory banks, etc., and achieves results on par with the state of the art on several downstream tasks. In addition, we show that our variance regularization term stabilizes the training of other methods and leads to performance improvements. 1",
          "pages": 23,
          "pdfPath": "RAW/2105.04906v3.pdf",
          "teach": {
            "whyWeRead": "Shows how to keep variance and reduce redundancy without relying heavily on explicit negatives — useful regularisers for SetConCA.",
            "oneSentence": "Self-supervised learning via Variance–Invariance–Covariance regularisation.",
            "plainLanguage": "VICReg has three terms: Invariance — related views match; Variance — each dimension keeps enough spread (anti-collapse); Covariance — off-diagonals pushed down (less redundant dimensions).\n\nThis is a toolbox when pure contrastive alignment damages reconstruction or diversity in SAE codes.",
            "keyIdeas": [
              {
                "title": "Invariance",
                "original": "Related views should match in representation space.",
                "simple": "Two views of the same thing should agree.",
                "explain": "Related views should match in representation space."
              },
              {
                "title": "Variance hinge",
                "original": "A hinge on per-dimension variance prevents collapse to a constant embedding.",
                "simple": "Keep each coordinate alive — don’t let it flatline.",
                "explain": "A hinge on per-dimension variance prevents collapse to a constant embedding."
              },
              {
                "title": "Covariance off-diagonal penalty",
                "original": "Penalising off-diagonal covariance reduces redundant dimensions.",
                "simple": "Stop many axes from saying the same thing.",
                "explain": "Penalising off-diagonal covariance reduces redundant dimensions."
              },
              {
                "title": "Negatives optional",
                "original": "VICReg can train without large explicit negative sets.",
                "simple": "You can fight collapse with statistics instead of a huge impostor lineup.",
                "explain": "VICReg can train without large explicit negative sets."
              }
            ],
            "simplifiedMath": [],
            "vocabulary": [
              {
                "term": "VICReg",
                "original": "Technical term: «VICReg» as used in this literature.",
                "simple": "Variance–Invariance–Covariance Regularization.",
                "def": "Variance–Invariance–Covariance Regularization."
              }
            ],
            "whatItShows": [
              "Non-contrastive SSL can avoid collapse with explicit stats penalties"
            ],
            "whatItDoesNotShow": [
              "Automatic concept recovery"
            ],
            "setconcaUse": [
              "Try variance/covariance regularisers when contrastive terms hurt FVU or diversity."
            ],
            "masteryChecklist": [
              "I can name VICReg's three terms and their jobs."
            ],
            "commonConfusions": [
              {
                "wrong": "VICReg needs InfoNCE.",
                "right": "It is an alternative regularisation path."
              }
            ],
            "quiz": [
              {
                "q": "VICReg variance term prevents?",
                "options": [
                  "Collapse of embedding dimensions",
                  "PDF download",
                  "SVD only",
                  "Attention only"
                ],
                "a": 0,
                "explain": "Keep per-dimension variance."
              }
            ],
            "originalIdea": "Self-supervised learning via Variance–Invariance–Covariance regularisation.",
            "simpleLesson": "VICReg has three terms: Invariance — related views match; Variance — each dimension keeps enough spread (anti-collapse); Covariance — off-diagonals pushed down (less redundant dimensions).\n\nThis is a toolbox when pure contrastive alignment damages reconstruction or diversity in SAE codes.",
            "limitPairs": [
              {
                "original": "Non-contrastive SSL can avoid collapse with explicit stats penalties",
                "simple": "In practice this means evidence supports: Non-contrastive SSL can avoid collapse with explicit stats penalties"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "Automatic concept recovery",
                "simple": "Do not overclaim: Automatic concept recovery"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Try variance/covariance regularisers when contrastive terms hurt FVU or diversity.",
                "simple": "Action item: Try variance/covariance regularisers when contrastive terms hurt FVU or diversity."
              }
            ]
          },
          "quiz": [
            {
              "q": "VICReg variance term prevents?",
              "options": [
                "Collapse of embedding dimensions",
                "PDF download",
                "SVD only",
                "Attention only"
              ],
              "a": 0,
              "explain": "Keep per-dimension variance."
            }
          ]
        },
        {
          "id": "cl-inverts",
          "num": null,
          "title": "Contrastive Learning Inverts the Data Generating Process",
          "authors": "Zimmermann et al.",
          "file": "zimmermann21a.pdf",
          "learn": [
            "When contrastive objectives recover latent factors",
            "InfoNCE identifiability conditions"
          ],
          "setconca": "Optional: when does contrastive learning recover concepts vs retrieval geometry?",
          "optional": true,
          "abstract": "Contrastive learning has recently seen tremendous success in self-supervised learning. So far, how- ever, it is largely unclear why the learned represen- tations generalize so effectively to a large variety of downstream tasks. We here prove that feed- forward models trained with objectives belonging to the commonly used InfoNCE family learn to implicitly invert the underlying generative model of the observed data. While the proofs make cer- tain statistical assumptions about the generative model, we observe empirically that our ﬁndings hold even if these assumptions are severely vio- lated. Our theory highlights a fundamental con- nection between contrastive learning, generative modeling, and nonlinear independent component analysis, thereby furthering our understanding of the learned representations as well as providing a theoretical foundation to derive more effective contrastive losses.1",
          "pages": 12,
          "pdfPath": "RAW/zimmermann21a.pdf",
          "teach": {
            "whyWeRead": "Optional theory: when contrastive objectives recover latent factors of the data-generating process.",
            "oneSentence": "Proves conditions under which InfoNCE-like objectives invert the generative process and recover latents.",
            "plainLanguage": "Contrastive learning often works; this paper asks when it recovers the true latent factors rather than merely a useful retrieval geometry.\n\nThe answer depends on assumptions about the data-generating process and the contrastive setup. Use it as a caution: success on retrieval does not automatically mean identifiability of concepts.",
            "keyIdeas": [
              {
                "title": "Identifiability lens on contrastive learning",
                "original": "Under stated assumptions, InfoNCE-like objectives can recover latent factors of the data-generating process.",
                "simple": "Sometimes contrastive learning doesn’t just help retrieval — it can recover the hidden knobs that made the data.",
                "explain": "Under stated assumptions, InfoNCE-like objectives can recover latent factors of the data-generating process."
              },
              {
                "title": "Assumptions matter",
                "original": "Without the paper’s assumptions, latent inversion is not guaranteed.",
                "simple": "Useful embeddings ≠ proven recovery of true factors.",
                "explain": "Without the paper’s assumptions, latent inversion is not guaranteed."
              }
            ],
            "simplifiedMath": [],
            "vocabulary": [
              {
                "term": "Latent inversion",
                "original": "Technical term: «Latent inversion» as used in this literature.",
                "simple": "Recovering ground-truth generative factors from observations.",
                "def": "Recovering ground-truth generative factors from observations."
              }
            ],
            "whatItShows": [
              "Theoretical conditions for contrastive latent recovery"
            ],
            "whatItDoesNotShow": [
              "That your SAE multi-view positives meet those conditions"
            ],
            "setconcaUse": [
              "Cite when claiming concept recovery, not only retrieval gains."
            ],
            "masteryChecklist": [
              "I distinguish retrieval usefulness from latent identifiability."
            ],
            "commonConfusions": [
              {
                "wrong": "Contrastive success implies factor recovery.",
                "right": "Only under assumptions."
              }
            ],
            "quiz": [
              {
                "q": "This paper warns that contrastive learning?",
                "options": [
                  "May not invert the DGP without assumptions",
                  "Always finds SAEs",
                  "Removes need for sparsity",
                  "Replaces CCA"
                ],
                "a": 0,
                "explain": "Identifiability is conditional."
              }
            ],
            "originalIdea": "Proves conditions under which InfoNCE-like objectives invert the generative process and recover latents.",
            "simpleLesson": "Contrastive learning often works; this paper asks when it recovers the true latent factors rather than merely a useful retrieval geometry.\n\nThe answer depends on assumptions about the data-generating process and the contrastive setup. Use it as a caution: success on retrieval does not automatically mean identifiability of concepts.",
            "limitPairs": [
              {
                "original": "Theoretical conditions for contrastive latent recovery",
                "simple": "In practice this means evidence supports: Theoretical conditions for contrastive latent recovery"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That your SAE multi-view positives meet those conditions",
                "simple": "Do not overclaim: That your SAE multi-view positives meet those conditions"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Cite when claiming concept recovery, not only retrieval gains.",
                "simple": "Action item: Cite when claiming concept recovery, not only retrieval gains."
              }
            ]
          },
          "quiz": [
            {
              "q": "This paper warns that contrastive learning?",
              "options": [
                "May not invert the DGP without assumptions",
                "Always finds SAEs",
                "Removes need for sparsity",
                "Replaces CCA"
              ],
              "a": 0,
              "explain": "Identifiability is conditional."
            }
          ]
        }
      ],
      "primer": {
        "title": "Contrastive representation learning",
        "mission": "Design positives/negatives correctly and diagnose alignment vs collapse.",
        "beforeYouStart": "Set aggregation from Level 4.",
        "primer": "Contrastive learning pulls positive pairs together and pushes negatives apart.\n\nCPC introduces InfoNCE. SimCLR shows augmentation + projection heads matter. Supervised Contrastive Learning allows many positives per class — exactly like multiple views of one concept. Alignment–Uniformity decomposes the geometry. VICReg can align without heavy negatives via variance and covariance regularizers.\n\nBefore inventing another loss for SetConCA, write down: what makes a positive? Can negatives be false negatives? Does low loss mean concept recovery?",
        "bigPictureDiagram": [
          "anchor ↔ positives (close) | negatives (far)",
          "alignment ↑ + uniformity ↑ = healthy geometry"
        ],
        "conceptsToMaster": [
          {
            "name": "InfoNCE",
            "simple": "Classify the true positive among negatives via softmax of similarities.",
            "deeper": "Related to a mutual-information lower bound under assumptions."
          },
          {
            "name": "Projection head",
            "simple": "Extra MLP before the loss; often discarded for downstream use.",
            "deeper": "Can hide info unavailable in the SAE code — check carefully."
          },
          {
            "name": "Temperature",
            "simple": "Softmax sharpness hyperparameter.",
            "deeper": "Changes geometry and optimisation, not just 'learning rate'."
          }
        ],
        "checkpoint": {
          "goal": "Ablate positive definition, temperature, projection head.",
          "steps": [
            "Measure alignment and uniformity",
            "Check false negatives",
            "Compare retrieval vs reconstruction"
          ],
          "successLooksLike": "You never treat low contrastive loss as proof of concept recovery."
        },
        "bridgeToNext": "Level 6 teaches metrics that prevent fooling yourself."
      }
    },
    {
      "id": 6,
      "title": "Measuring and comparing representations",
      "weeks": "10",
      "checkpoint": "Build evaluation notebook: CKA, SVCCA, linear probe, MDL probe, and control tasks on your representations.",
      "metric_table": true,
      "papers": [
        {
          "id": "svcca",
          "num": 18,
          "title": "SVCCA: Singular Vector Canonical Correlation Analysis",
          "authors": "Raghu et al.",
          "file": "1706.05806v2.pdf",
          "learn": [
            "Combining dimensionality reduction with CCA",
            "Comparing subspaces across models/layers",
            "Affine-invariant representation comparison"
          ],
          "setconca": "Baseline for comparing SAE dictionaries across seeds and architectures.",
          "optional": false,
          "abstract": "We propose a new technique, Singular Vector Canonical Correlation Analysis (SVCCA), a tool for quickly comparing two representations in a way that is both invariant to afﬁne transform (allowing comparison between different layers and networks) and fast to compute (allowing more comparisons to be calculated than with previous methods). We deploy this tool to measure the intrinsic dimension- ality of layers, showing in some cases needless over-parameterization; to probe learning dynamics throughout training, ﬁnding that networks converge to ﬁnal representations from the bottom up; to show where class-speciﬁc information in networks is formed; and to suggest new training regimes that simultaneously save computation and overﬁt less. 1",
          "pages": 17,
          "pdfPath": "RAW/1706.05806v2.pdf",
          "teach": {
            "whyWeRead": "Tool to compare neural subspaces across layers/models when coordinates differ.",
            "oneSentence": "SVCCA combines SVD dimensionality reduction with CCA to compare representations invariantly to affine transforms.",
            "plainLanguage": "Two networks can encode the same information with different neuron coordinates. Coordinate-wise comparison fails. SVCCA first reduces each representation with SVD, then runs CCA to measure shared subspace structure.\n\nHigh SVCCA means similar subspaces — not that individual features match.",
            "keyIdeas": [
              {
                "title": "Subspace comparison",
                "original": "Compare representational subspaces rather than neuron-aligned coordinates.",
                "simple": "Don’t match wire #17 to wire #17 — compare the spaces they span.",
                "explain": "Compare representational subspaces rather than neuron-aligned coordinates."
              },
              {
                "title": "SVD then CCA",
                "original": "SVCCA reduces each representation with SVD then applies CCA to measure shared directions.",
                "simple": "Compress noise first, then ask how correlated the remaining spaces are.",
                "explain": "SVCCA reduces each representation with SVD then applies CCA to measure shared directions."
              },
              {
                "title": "Affine invariance motivation",
                "original": "Similarity should survive invertible linear rebasings of features.",
                "simple": "If someone rotates the feature axes, the meaning comparison should stay stable.",
                "explain": "Similarity should survive invertible linear rebasings of features."
              }
            ],
            "simplifiedMath": [],
            "vocabulary": [
              {
                "term": "SVCCA",
                "original": "Technical term: «SVCCA» as used in this literature.",
                "simple": "Singular Vector Canonical Correlation Analysis.",
                "def": "Singular Vector Canonical Correlation Analysis."
              },
              {
                "term": "Subspace similarity",
                "original": "Technical term: «Subspace similarity» as used in this literature.",
                "simple": "Overlap of representational spaces ignoring basis choice.",
                "def": "Overlap of representational spaces ignoring basis choice."
              }
            ],
            "whatItShows": [
              "Representations can be similar as subspaces across training/layers"
            ],
            "whatItDoesNotShow": [
              "Same individual concepts",
              "Causal mechanisms"
            ],
            "setconcaUse": [
              "Compare SetConCA codes vs pointwise SAE with SVCCA/CKA.",
              "Never equate high SVCCA with identical features."
            ],
            "masteryChecklist": [
              "I know what SVCCA compares.",
              "I know what it does not prove."
            ],
            "commonConfusions": [
              {
                "wrong": "SVCCA = feature matching.",
                "right": "It is subspace correlation, not one-to-one features."
              }
            ],
            "quiz": [
              {
                "q": "SVCCA primarily measures?",
                "options": [
                  "Subspace similarity via CCA after SVD",
                  "Monosemanticity",
                  "L0 sparsity",
                  "Steering effect"
                ],
                "a": 0,
                "explain": "Subspace tool."
              }
            ],
            "originalIdea": "SVCCA combines SVD dimensionality reduction with CCA to compare representations invariantly to affine transforms.",
            "simpleLesson": "Two networks can encode the same information with different neuron coordinates. Coordinate-wise comparison fails. SVCCA first reduces each representation with SVD, then runs CCA to measure shared subspace structure.\n\nHigh SVCCA means similar subspaces — not that individual features match.",
            "limitPairs": [
              {
                "original": "Representations can be similar as subspaces across training/layers",
                "simple": "In practice this means evidence supports: Representations can be similar as subspaces across training/layers"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "Same individual concepts",
                "simple": "Do not overclaim: Same individual concepts"
              },
              {
                "original": "Causal mechanisms",
                "simple": "Do not overclaim: Causal mechanisms"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Compare SetConCA codes vs pointwise SAE with SVCCA/CKA.",
                "simple": "Action item: Compare SetConCA codes vs pointwise SAE with SVCCA/CKA."
              },
              {
                "original": "Never equate high SVCCA with identical features.",
                "simple": "Action item: Never equate high SVCCA with identical features."
              }
            ]
          },
          "quiz": [
            {
              "q": "SVCCA primarily measures?",
              "options": [
                "Subspace similarity via CCA after SVD",
                "Monosemanticity",
                "L0 sparsity",
                "Steering effect"
              ],
              "a": 0,
              "explain": "Subspace tool."
            }
          ]
        },
        {
          "id": "cka",
          "num": 19,
          "title": "Similarity of Neural Network Representations Revisited (CKA)",
          "authors": "Kornblith et al.",
          "file": "1905.00414v4.pdf",
          "learn": [
            "Gram matrices",
            "Invariance to orthogonal transformations",
            "Linear vs kernel CKA",
            "Why coordinate-wise matching misleads"
          ],
          "setconca": "Essential for comparing multi-view SetConCA against pointwise SAEs.",
          "optional": false,
          "abstract": "Recent work has sought to understand the behav- ior of neural networks by comparing representa- tions between layers and between different trained models. We examine methods for comparing neu- ral network representations based on canonical correlation analysis (CCA). We show that CCA belongs to a family of statistics for measuring mul- tivariate similarity, but that neither CCA nor any other statistic that is invariant to invertible linear transformation can measure meaningful similari- ties between representations of higher dimension than the number of data points. We introduce a similarity index that measures the relationship between representational similarity matrices and does not suffer from this limitation. This simi- larity index is equivalent to centered kernel align- ment (CKA) and is also closely connected to CCA. Unlike CCA, CKA can reliably identify corre- spondences between representations in networks trained from different initializations.",
          "pages": 20,
          "pdfPath": "RAW/1905.00414v4.pdf",
          "teach": {
            "whyWeRead": "Most practical representation similarity metric for your comparisons.",
            "oneSentence": "CKA compares representations using Gram matrices; linear and kernel variants; invariant to orthogonal transforms.",
            "plainLanguage": "CKA asks: do two representation matrices induce similar similarity structures across examples? It uses Gram matrices (pairwise relationships among examples) rather than trying to match neuron i to neuron j.\n\nLinear CKA is common and fast. Kernel CKA can capture more structure. Orthogonal transforms do not change CKA — good, because bases are arbitrary.\n\nHigh CKA ≠ same concepts. It means similar geometry of examples.",
            "keyIdeas": [
              {
                "title": "Gram matrix view",
                "original": "CKA compares example–example similarity structures (Gram matrices) induced by two representations.",
                "simple": "Do the two models agree on which examples are neighbours?",
                "explain": "CKA compares example–example similarity structures (Gram matrices) induced by two representations."
              },
              {
                "title": "Orthogonal invariance",
                "original": "CKA is invariant to orthogonal transforms of features.",
                "simple": "Rotating features inside a model doesn’t fake a difference.",
                "explain": "CKA is invariant to orthogonal transforms of features."
              },
              {
                "title": "Linear vs kernel CKA",
                "original": "Linear CKA is standard; kernel CKA can capture richer similarity structure.",
                "simple": "Start linear; use kernels if you need more sensitive geometry.",
                "explain": "Linear CKA is standard; kernel CKA can capture richer similarity structure."
              },
              {
                "title": "Coordinate matching is misleading",
                "original": "Neuron-index alignment is generally the wrong comparison when bases differ.",
                "simple": "Same information can live in different coordinate systems.",
                "explain": "Neuron-index alignment is generally the wrong comparison when bases differ."
              }
            ],
            "simplifiedMath": [
              {
                "name": "CKA idea",
                "formula": "CKA(X,Y) ∝ HSIC(X,Y)/√(HSIC(X,X)HSIC(Y,Y))",
                "original": "CKA idea: CKA(X,Y) ∝ HSIC(X,Y)/√(HSIC(X,X)HSIC(Y,Y))",
                "simple": "Normalised similarity of centered Gram structures.",
                "meaning": "Normalised similarity of centered Gram structures."
              }
            ],
            "vocabulary": [
              {
                "term": "CKA",
                "original": "Technical term: «CKA» as used in this literature.",
                "simple": "Centered Kernel Alignment — representation similarity.",
                "def": "Centered Kernel Alignment — representation similarity."
              },
              {
                "term": "Gram matrix",
                "original": "Technical term: «Gram matrix» as used in this literature.",
                "simple": "Matrix of pairwise similarities among examples.",
                "def": "Matrix of pairwise similarities among examples."
              }
            ],
            "whatItShows": [
              "When two nets organise examples similarly"
            ],
            "whatItDoesNotShow": [
              "Identical concepts",
              "Causal sharing"
            ],
            "setconcaUse": [
              "Primary similarity metric across methods/seeds.",
              "Pair with probes and interventions."
            ],
            "masteryChecklist": [
              "I can explain CKA without saying 'neuron matching'.",
              "I can state its non-claims."
            ],
            "commonConfusions": [
              {
                "wrong": "CKA high means same SAE features.",
                "right": "Means similar example geometry."
              }
            ],
            "quiz": [
              {
                "q": "CKA is invariant to?",
                "options": [
                  "Orthogonal transforms",
                  "Arbitrary nonlinear warps always",
                  "Relabeling classes only",
                  "Changing the dataset freely"
                ],
                "a": 0,
                "explain": "Orthogonal invariance is key."
              }
            ],
            "originalIdea": "CKA compares representations using Gram matrices; linear and kernel variants; invariant to orthogonal transforms.",
            "simpleLesson": "CKA asks: do two representation matrices induce similar similarity structures across examples? It uses Gram matrices (pairwise relationships among examples) rather than trying to match neuron i to neuron j.\n\nLinear CKA is common and fast. Kernel CKA can capture more structure. Orthogonal transforms do not change CKA — good, because bases are arbitrary.\n\nHigh CKA ≠ same concepts. It means similar geometry of examples.",
            "limitPairs": [
              {
                "original": "When two nets organise examples similarly",
                "simple": "In practice this means evidence supports: When two nets organise examples similarly"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "Identical concepts",
                "simple": "Do not overclaim: Identical concepts"
              },
              {
                "original": "Causal sharing",
                "simple": "Do not overclaim: Causal sharing"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Primary similarity metric across methods/seeds.",
                "simple": "Action item: Primary similarity metric across methods/seeds."
              },
              {
                "original": "Pair with probes and interventions.",
                "simple": "Action item: Pair with probes and interventions."
              }
            ]
          },
          "quiz": [
            {
              "q": "CKA is invariant to?",
              "options": [
                "Orthogonal transforms",
                "Arbitrary nonlinear warps always",
                "Relabeling classes only",
                "Changing the dataset freely"
              ],
              "a": 0,
              "explain": "Orthogonal invariance is key."
            }
          ]
        },
        {
          "id": "probe-control",
          "num": 20,
          "title": "Designing and Interpreting Probes with Control Tasks",
          "authors": "Hewitt and Liang",
          "file": "1909.03368v1.pdf",
          "learn": [
            "Probe selectivity",
            "Control tasks",
            "Distinguishing extractability from organisation"
          ],
          "setconca": "Do not over-interpret high probe accuracy on SAE features.",
          "optional": false,
          "abstract": "Probes, supervised models trained to pre- dict properties (like parts-of-speech) from representations (like ELMo), have achieved high accuracy on a range of linguistic tasks. But does this mean that the representations encode linguistic structure or just that the probe has learned the linguistic task? In this paper, we propose control tasks, which associate word types with random outputs, to complement linguistic tasks. By construction, these tasks can only be learned by the probe itself. So a good probe, (one that reﬂects the representation), should be selective, achieving high linguistic task accuracy and low control task accuracy. The selectivity of a probe puts linguistic task accuracy in context with the probe’s capacity to memorize from word types. We construct control tasks for English part-of-speech tagging and dependency edge prediction, and show that popular probes on ELMo representations are not selective. We also ﬁnd that dropout, commonly used to control probe complexity, is ineffective for improving selectivity of MLPs, but that other forms of regularization are effective. Finally, we ﬁnd that while probes on the ﬁrst layer of ELMo yield slightly better part-of-speech",
          "pages": 11,
          "pdfPath": "RAW/1909.03368v1.pdf",
          "teach": {
            "whyWeRead": "Stops you from overclaiming when a probe 'finds' a property in a representation.",
            "oneSentence": "Introduces control tasks and selectivity so probe accuracy is not mistaken for linguistic structure in the representation.",
            "plainLanguage": "A probe is a supervised model predicting a property from frozen representations. High accuracy can mean (1) the property is organised in the representation, (2) the probe memorised, or (3) the property is easy for the probe architecture.\n\nControl tasks assign random outputs with similar structure. Selectivity compares real-task accuracy vs control-task accuracy. High selectivity suggests the representation — not just the probe — carries the property accessibly.",
            "keyIdeas": [
              {
                "title": "Probe pitfalls",
                "original": "High probe accuracy can reflect probe power/memorisation rather than organised linguistic structure.",
                "simple": "A smart decoder can look successful even when the representation is messy.",
                "explain": "High probe accuracy can reflect probe power/memorisation rather than organised linguistic structure."
              },
              {
                "title": "Control tasks",
                "original": "Control tasks assign random targets with complexity matched to the real task.",
                "simple": "Give the probe a fake exam of similar hardness to see if it cheats.",
                "explain": "Control tasks assign random targets with complexity matched to the real task."
              },
              {
                "title": "Selectivity",
                "original": "Selectivity compares real-task vs control-task probe performance.",
                "simple": "Big gap ⇒ representation likely carries the property; tiny gap ⇒ probe did the work.",
                "explain": "Selectivity compares real-task vs control-task probe performance."
              }
            ],
            "simplifiedMath": [],
            "vocabulary": [
              {
                "term": "Probe",
                "original": "Technical term: «Probe» as used in this literature.",
                "simple": "Supervised decoder trained on frozen representations.",
                "def": "Supervised decoder trained on frozen representations."
              },
              {
                "term": "Selectivity",
                "original": "Technical term: «Selectivity» as used in this literature.",
                "simple": "Difference between linguistic-task and control-task probe performance.",
                "def": "Difference between linguistic-task and control-task probe performance."
              }
            ],
            "whatItShows": [
              "How to interpret probes more carefully"
            ],
            "whatItDoesNotShow": [
              "Causal use of the property by the network"
            ],
            "setconcaUse": [
              "Any claim 'concepts are decodable from SetConCA codes' needs controls."
            ],
            "masteryChecklist": [
              "I can define selectivity.",
              "I refuse probe accuracy alone as proof."
            ],
            "commonConfusions": [
              {
                "wrong": "Probe accuracy proves the model uses the feature.",
                "right": "It proves extractability under the probe class."
              }
            ],
            "quiz": [
              {
                "q": "Control tasks help detect?",
                "options": [
                  "Probe memorisation / easy decoding",
                  "GPU temperature",
                  "PDF size",
                  "BatchNorm"
                ],
                "a": 0,
                "explain": "Selectivity vs controls."
              }
            ],
            "originalIdea": "Introduces control tasks and selectivity so probe accuracy is not mistaken for linguistic structure in the representation.",
            "simpleLesson": "A probe is a supervised model predicting a property from frozen representations. High accuracy can mean (1) the property is organised in the representation, (2) the probe memorised, or (3) the property is easy for the probe architecture.\n\nControl tasks assign random outputs with similar structure. Selectivity compares real-task accuracy vs control-task accuracy. High selectivity suggests the representation — not just the probe — carries the property accessibly.",
            "limitPairs": [
              {
                "original": "How to interpret probes more carefully",
                "simple": "In practice this means evidence supports: How to interpret probes more carefully"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "Causal use of the property by the network",
                "simple": "Do not overclaim: Causal use of the property by the network"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Any claim 'concepts are decodable from SetConCA codes' needs controls.",
                "simple": "Action item: Any claim 'concepts are decodable from SetConCA codes' needs controls."
              }
            ]
          },
          "quiz": [
            {
              "q": "Control tasks help detect?",
              "options": [
                "Probe memorisation / easy decoding",
                "GPU temperature",
                "PDF size",
                "BatchNorm"
              ],
              "a": 0,
              "explain": "Selectivity vs controls."
            }
          ]
        },
        {
          "id": "mdl-probe",
          "num": 21,
          "title": "Information-Theoretic Probing with Minimum Description Length",
          "authors": "Voita and Titov",
          "file": "2003.12298v1.pdf",
          "learn": [
            "Description length vs accuracy",
            "Information organisation vs mere existence"
          ],
          "setconca": "High probe accuracy ≠ accessible concept structure.",
          "optional": false,
          "abstract": "To measure how well pretrained representa- tions encode some linguistic property, it is common to use accuracy of a probe, i.e. a classiﬁer trained to predict the property from the representations. Despite widespread adop- tion of probes, differences in their accuracy fail to adequately reﬂect differences in repre- sentations. For example, they do not substan- tially favour pretrained representations over randomly initialized ones. Analogously, their accuracy can be similar when probing for gen- uine linguistic labels and probing for random synthetic tasks. To see reasonable differences in accuracy with respect to these random base- lines, previous work had to constrain either the amount of probe training data or its model size. Instead, we propose an alternative to the standard probes, information-theoretic prob- ing with minimum description length (MDL). With MDL probing, training a probe to pre- dict labels is recast as teaching it to effectively transmit the data. Therefore, the measure of interest changes from probe accuracy to the de- scription length of labels given representations. In addition to probe quality, the description length evaluates ‘the amount of effort’ needed ",
          "pages": 14,
          "pdfPath": "RAW/2003.12298v1.pdf",
          "teach": {
            "whyWeRead": "Distinguishes 'information exists' from 'information is efficiently organised'.",
            "oneSentence": "MDL probing measures how much description length is needed to learn a property from a representation.",
            "plainLanguage": "Even if a probe can eventually reach high accuracy, the property might be buried and hard to extract. Minimum Description Length probing asks how efficiently the probe can learn — shorter description length means more accessible organisation.\n\nHigh accuracy + high description length: information exists but is messy. High accuracy + low description length: information is neatly organised.",
            "keyIdeas": [
              {
                "title": "Existence vs accessibility",
                "original": "Information may be present yet inefficiently organised for learning.",
                "simple": "Being able to eventually decode ≠ being neatly organised.",
                "explain": "Information may be present yet inefficiently organised for learning."
              },
              {
                "title": "MDL principle",
                "original": "Prefer labelling rules with short description length given the representation.",
                "simple": "If a short program can map representation→label, the info is accessible.",
                "explain": "Prefer labelling rules with short description length given the representation."
              },
              {
                "title": "Complement to accuracy",
                "original": "Report accuracy and description-length style metrics together.",
                "simple": "Same score, different effort — both matter.",
                "explain": "Report accuracy and description-length style metrics together."
              }
            ],
            "simplifiedMath": [],
            "vocabulary": [
              {
                "term": "MDL probing",
                "original": "Technical term: «MDL probing» as used in this literature.",
                "simple": "Probe evaluation via minimum description length / online coding.",
                "def": "Probe evaluation via minimum description length / online coding."
              }
            ],
            "whatItShows": [
              "Organisation efficiency of information in representations"
            ],
            "whatItDoesNotShow": [
              "Causal necessity"
            ],
            "setconcaUse": [
              "If SetConCA claims better concept organisation, MDL is a fitting metric."
            ],
            "masteryChecklist": [
              "I can contrast accuracy vs description length."
            ],
            "commonConfusions": [
              {
                "wrong": "Same accuracy means same representation quality.",
                "right": "Learning effort/MDL can differ."
              }
            ],
            "quiz": [
              {
                "q": "Low description length suggests?",
                "options": [
                  "Property is organised accessibly",
                  "Model is smaller only",
                  "No information",
                  "Infinite sparsity"
                ],
                "a": 0,
                "explain": "Accessible organisation."
              }
            ],
            "originalIdea": "MDL probing measures how much description length is needed to learn a property from a representation.",
            "simpleLesson": "Even if a probe can eventually reach high accuracy, the property might be buried and hard to extract. Minimum Description Length probing asks how efficiently the probe can learn — shorter description length means more accessible organisation.\n\nHigh accuracy + high description length: information exists but is messy. High accuracy + low description length: information is neatly organised.",
            "limitPairs": [
              {
                "original": "Organisation efficiency of information in representations",
                "simple": "In practice this means evidence supports: Organisation efficiency of information in representations"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "Causal necessity",
                "simple": "Do not overclaim: Causal necessity"
              }
            ],
            "setconcaPairs": [
              {
                "original": "If SetConCA claims better concept organisation, MDL is a fitting metric.",
                "simple": "Action item: If SetConCA claims better concept organisation, MDL is a fitting metric."
              }
            ]
          },
          "quiz": [
            {
              "q": "Low description length suggests?",
              "options": [
                "Property is organised accessibly",
                "Model is smaller only",
                "No information",
                "Infinite sparsity"
              ],
              "a": 0,
              "explain": "Accessible organisation."
            }
          ]
        }
      ],
      "primer": {
        "title": "Measuring and comparing representations",
        "mission": "Know what each metric supports and what it does not establish.",
        "beforeYouStart": "Levels 1–5 vocabulary.",
        "primer": "No single number measures interpretability.\n\nSVCCA and CKA compare subspaces — similar geometry ≠ same concepts. Probes test decodability — high accuracy can be probe memorisation unless you use control tasks. MDL probing asks how efficiently information is organised.\n\nMemorize the table: reconstruction ≠ interpretability; sparsity ≠ monosemanticity; CKA ≠ same features; probe ≠ causal use; steering ≠ complete mechanism.",
        "bigPictureDiagram": [
          "Preservation (FVU) | Similarity (CKA) | Decodability (probe) | Causality (intervention)",
          "Need several families for a strong claim."
        ],
        "conceptsToMaster": [
          {
            "name": "CKA",
            "simple": "Similarity of representation Gram matrices.",
            "deeper": "Invariant to orthogonal transforms; not feature matching."
          },
          {
            "name": "Selectivity",
            "simple": "Probe accuracy on real labels vs control tasks.",
            "deeper": "Hewitt & Liang: without controls, probes can look good for the wrong reason."
          }
        ],
        "checkpoint": {
          "goal": "Build an evaluation notebook.",
          "steps": [
            "CKA",
            "SVCCA",
            "linear probe",
            "MDL probe",
            "control tasks"
          ],
          "successLooksLike": "You refuse any paper claim backed by one metric alone."
        },
        "bridgeToNext": "Mechanistic interpretability explains why sparse features matter inside transformers."
      }
    },
    {
      "id": 7,
      "title": "Mechanistic interpretability foundations",
      "weeks": "11–12",
      "checkpoint": "Write mechanistic interpretation notes connecting superposition theory to your activation geometry.",
      "papers": [
        {
          "id": "transformer-circuits",
          "num": 22,
          "title": "A Mathematical Framework for Transformer Circuits",
          "authors": "Elhage et al.",
          "file": null,
          "learn": [
            "Residual-stream decomposition",
            "QK and OV circuits",
            "Paths through transformers",
            "Mechanistic vs correlational analysis"
          ],
          "setconca": "Context for where SAE features live in the residual stream.",
          "url": "https://transformer-circuits.pub/2021/framework/index.html",
          "optional": false,
          "missing_local": true,
          "abstract": "",
          "teach": {
            "whyWeRead": "Gives the residual-stream / circuit vocabulary for where SAE features live.",
            "oneSentence": "A framework treating transformers as circuits on a residual stream with attention as QK/OV operations.",
            "plainLanguage": "Think of the residual stream as a shared communication bus. Each layer reads from it and writes updates back. Attention heads can be factored into QK circuits (where to attend) and OV circuits (what to write).\n\nMechanistic interpretability studies these paths, not only input–output correlations. SAE features are often analysed as directions in residual-stream activations.",
            "keyIdeas": [
              {
                "title": "Residual stream",
                "original": "Activations travel through a residual pathway that layers read from and write to.",
                "simple": "A shared bus: each block reads the bus and adds an update.",
                "explain": "Activations travel through a residual pathway that layers read from and write to."
              },
              {
                "title": "QK circuit",
                "original": "Query–key interactions determine attention patterns (where to look).",
                "simple": "QK decides ‘who should I listen to?’",
                "explain": "Query–key interactions determine attention patterns (where to look)."
              },
              {
                "title": "OV circuit",
                "original": "Output–value maps decide what information is written into the stream.",
                "simple": "OV decides ‘what message do I write after listening?’",
                "explain": "Output–value maps decide what information is written into the stream."
              },
              {
                "title": "Paths / circuits",
                "original": "Behaviours are analysed as compositional paths through components.",
                "simple": "Follow the wires that implement a behaviour, not only input–output correlations.",
                "explain": "Behaviours are analysed as compositional paths through components."
              },
              {
                "title": "Mechanistic vs correlational",
                "original": "Mechanistic analysis seeks causal routes; correlations alone are insufficient.",
                "simple": "Seeing a correlation is not the same as finding the mechanism.",
                "explain": "Mechanistic analysis seeks causal routes; correlations alone are insufficient."
              }
            ],
            "simplifiedMath": [],
            "vocabulary": [
              {
                "term": "Residual stream",
                "original": "Technical term: «Residual stream» as used in this literature.",
                "simple": "The main residual pathway carrying activations through the transformer.",
                "def": "The main residual pathway carrying activations through the transformer."
              },
              {
                "term": "Circuit",
                "original": "Technical term: «Circuit» as used in this literature.",
                "simple": "A subgraph of model components implementing a behaviour.",
                "def": "A subgraph of model components implementing a behaviour."
              }
            ],
            "whatItShows": [
              "A productive language for analysing transformer internals"
            ],
            "whatItDoesNotShow": [
              "Automatic discovery of all circuits"
            ],
            "setconcaUse": [
              "Specify which residual sites your views come from.",
              "Plan interventions on SAE directions in the stream."
            ],
            "masteryChecklist": [
              "I can explain residual stream, QK, OV in one minute."
            ],
            "commonConfusions": [
              {
                "wrong": "Neurons alone are the right unit always.",
                "right": "Directions/circuits in the stream often matter more."
              }
            ],
            "quiz": [
              {
                "q": "OV circuits mainly handle?",
                "options": [
                  "What information is written",
                  "Only tokenisation",
                  "Only dropout",
                  "Only FVU"
                ],
                "a": 0,
                "explain": "OV moves values."
              }
            ],
            "originalIdea": "A framework treating transformers as circuits on a residual stream with attention as QK/OV operations.",
            "simpleLesson": "Think of the residual stream as a shared communication bus. Each layer reads from it and writes updates back. Attention heads can be factored into QK circuits (where to attend) and OV circuits (what to write).\n\nMechanistic interpretability studies these paths, not only input–output correlations. SAE features are often analysed as directions in residual-stream activations.",
            "limitPairs": [
              {
                "original": "A productive language for analysing transformer internals",
                "simple": "In practice this means evidence supports: A productive language for analysing transformer internals"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "Automatic discovery of all circuits",
                "simple": "Do not overclaim: Automatic discovery of all circuits"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Specify which residual sites your views come from.",
                "simple": "Action item: Specify which residual sites your views come from."
              },
              {
                "original": "Plan interventions on SAE directions in the stream.",
                "simple": "Action item: Plan interventions on SAE directions in the stream."
              }
            ]
          },
          "quiz": [
            {
              "q": "OV circuits mainly handle?",
              "options": [
                "What information is written",
                "Only tokenisation",
                "Only dropout",
                "Only FVU"
              ],
              "a": 0,
              "explain": "OV moves values."
            }
          ]
        },
        {
          "id": "superposition",
          "num": 23,
          "title": "Toy Models of Superposition",
          "authors": "Elhage et al. (Anthropic)",
          "file": "2209.pdf",
          "learn": [
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
            "Adversarial vulnerability increases >3× with superposition"
          ],
          "setconca": "Conceptual foundation for why SAEs are needed — SAEs are literally 'Approach 2: Finding an Overcomplete Basis' from this paper.",
          "url": "https://transformer-circuits.pub/2022/toy_model/index.html",
          "optional": false,
          "richContent": {
            "source": "2209.pdf",
            "published": "Sept 14, 2022",
            "venue": "Transformer Circuits Thread (Anthropic)",
            "url": "https://transformer-circuits.pub/2022/toy_model/index.html",
            "abstract": "Neural networks often pack many unrelated concepts into a single neuron — polysemanticity. This paper uses toy models (small ReLU networks on synthetic sparse features) to show that networks can represent more features than dimensions via superposition: almost-orthogonal directions in activation space, tolerating interference when features are sparse. Superposition is governed by phase changes, organizes features into geometric structures (digons, triangles, pentagons, tetrahedra), and may link to adversarial vulnerability.",
            "keyResults": [
              "Superposition is a real, observed phenomenon in toy ReLU models",
              "Both monosemantic and polysemantic neurons can coexist in the same model",
              "At least some computation (e.g. absolute value) can run in superposition",
              "Whether a feature is stored in superposition is governed by a phase change",
              "Superposition organizes features into geometric structures: digons, triangles, pentagons, tetrahedra",
              "Linear models (PCA-like) never superpose; adding ReLU enables radically different solutions",
              "Adversarial vulnerability increases sharply (>3×) as superposition forms"
            ],
            "hierarchy": [
              {
                "level": "Decomposability",
                "desc": "Activations decompose into independently understandable features"
              },
              {
                "level": "Linearity",
                "desc": "Features are directions: x = Σ x_i W_i"
              },
              {
                "level": "Superposition",
                "desc": "W^T W not invertible — more features than dimensions, with interference"
              },
              {
                "level": "Basis-aligned",
                "desc": "Features align with neurons (privileged basis) — monosemantic when achieved"
              }
            ],
            "forces": [
              {
                "name": "Feature benefit",
                "desc": "Representing more features reduces loss (weighted MSE by importance I_i)"
              },
              {
                "name": "Interference",
                "desc": "Non-orthogonal features cause cross-talk; sparse activations reduce cost"
              },
              {
                "name": "Privileged basis",
                "desc": "Activation functions break symmetry — encourages neuron alignment"
              },
              {
                "name": "Superposition",
                "desc": "Pushes features off basis directions into almost-orthogonal arrangements"
              }
            ],
            "models": [
              {
                "name": "Linear model",
                "eq": "h = Wx; x' = W^T h + b  →  x' = W^T W x + b",
                "behavior": "PCA-like: stores top-m most important features orthogonally. Never superposes."
              },
              {
                "name": "ReLU output model",
                "eq": "h = Wx; x' = ReLU(W^T h + b)",
                "behavior": "With sparse features, stores extra features non-orthogonally. Superposition emerges."
              },
              {
                "name": "ReLU hidden layer model",
                "eq": "h = ReLU(Wx); x' = ReLU(W^T h + b)",
                "behavior": "Privileged basis: W maps features→neurons directly. Monosemantic vs polysemantic neurons."
              }
            ],
            "syntheticData": [
              "Each x_i is a feature; zero with probability S_i (sparsity), else uniform [0,1]",
              "Importance I_i scales MSE contribution — higher I = more loss if misrepresented",
              "More features n than hidden dimensions m (n >> m)",
              "Uniform case: all S_i = S, all I_i = 1 for geometry analysis"
            ],
            "loss": "L = Σ_x Σ_i I_i (x_i − x'_i)²  — weighted reconstruction MSE",
            "featureDimensionality": {
              "formula": "D_i = ||W_i||² / Σ_j (Ŵ_i · W_j)²",
              "interpretation": "Numerator = how much feature i is represented. Denominator = how many features share its direction. D=1 dedicated dimension; D=½ antipodal pair; D=0 not learned.",
              "stickyPoints": [
                {
                  "dim": 1.0,
                  "geometry": "Dedicated dimension",
                  "color": "#7ee787"
                },
                {
                  "dim": 0.75,
                  "geometry": "Tetrahedron (3D Thomson)",
                  "color": "#6c9eff"
                },
                {
                  "dim": 0.667,
                  "geometry": "Triangle (equilateral)",
                  "color": "#a78bfa"
                },
                {
                  "dim": 0.5,
                  "geometry": "Antipodal pair (digon)",
                  "color": "#f0b060"
                },
                {
                  "dim": 0.4,
                  "geometry": "Pentagon",
                  "color": "#f07178"
                },
                {
                  "dim": 0.375,
                  "geometry": "Square antiprism",
                  "color": "#56d4dd"
                },
                {
                  "dim": 0.0,
                  "geometry": "Not learned",
                  "color": "#8b95a8"
                }
              ]
            },
            "phaseDiagram": {
              "description": "2 features in 1 dimension: three strategies — ignore extra feature W⊥[0,1], dedicated dimension W⊥[1,0], antipodal superposition W=[1,-1]. Optimal strategy discontinuously switches with sparsity and relative importance — first-order phase change.",
              "outcomes": [
                {
                  "id": "not_learned",
                  "label": "Not learned",
                  "color": "#8b95a8"
                },
                {
                  "id": "superposition",
                  "label": "Superposition (antipodal)",
                  "color": "#f0b060"
                },
                {
                  "id": "orthogonal",
                  "label": "Dedicated dimension",
                  "color": "#7ee787"
                }
              ]
            },
            "geometrySection": [
              "Uniform superposition → connection to uniform polytopes and Thomson problem",
              "Antipodal pairs (D=½) are sticky — model prefers them over wide sparsity range",
              "Features form feature geometry graphs: nodes=features, edges=|dot product|",
              "Non-uniform: pentagons deform smoothly until critical point, then snap to new polytope",
              "Correlated features prefer orthogonal arrangement (local almost-orthogonal bases)",
              "Anti-correlated features prefer same tegum factor with negative interference",
              "Correlated + capacity-limited → collapse to PCA principal component (a+b)/√2"
            ],
            "computationInSuperposition": [
              "Model computes y = |x| with ReLU: |x| = ReLU(x) + ReLU(−x)",
              "Without superposition: 2 neurons per feature (positive + negative side)",
              "With sparsity: neurons become polysemantic — primary + secondary features",
              "Asymmetric superposition motif: unequal weights W=[2,−½] with reciprocal outputs to control interference"
            ],
            "threeWaysOut": [
              {
                "approach": "1. Models without superposition",
                "desc": "L1 on activations works in toy models but likely hurts performance at scale. MoE may reduce superposition by recovering neuron sparsity as free FLOPs.",
                "saes": "Train with strong sparsity + wide dictionary — but performance tradeoff"
              },
              {
                "approach": "2. Find overcomplete basis (SAEs)",
                "desc": "Sparse coding / dictionary learning on activations. This is exactly the SAE research program. Challenge: no ground truth for feature count; interference already baked in.",
                "saes": "Core SetConCA / SAE approach — Approach 2 from the paper"
              },
              {
                "approach": "3. Hybrid",
                "desc": "Reduce superposition slightly (L1 reg) then decode remainder with SAE. Margin exists where d(loss)/d(superposition)=0.",
                "saes": "Practical pipeline: regularize then decompose"
              }
            ],
            "adversarial": "Superposition creates ε interference in W^T W off-diagonals → L2 adversarial attack surface. Vulnerability tracks features-per-dimension (1/D). Increases >3× as superposition forms.",
            "predictions": [
              "Polysemantic neurons increase with feature sparsity",
              "Later InceptionV1 layers more polysemantic (higher-level = sparser features)",
              "Early Transformer MLP neurons extremely polysemantic (token disambiguation = sparse)",
              "Mixture of Experts may show less superposition (eats sparsity gap)"
            ],
            "openQuestions": [
              "Statistical test for superposition in real models?",
              "Closed-form solutions for ReLU toy models?",
              "Feature importance and sparsity curves for real LMs?",
              "Does scaling eliminate superposition or keep constant fraction?",
              "How much computation is possible in superposition beyond storage?"
            ],
            "setconcaLinks": [
              "SAEs are explicitly 'Approach 2: Finding an Overcomplete Basis' from this paper",
              "Reconstruction quality alone does not prove monosemanticity — interference is tolerated",
              "Multi-view SetConCA must handle correlated features (local orthogonal bases) and anti-correlated features (negative interference preference)",
              "Phase changes explain why small hyperparameter changes suddenly alter feature geometry — relevant for SAE seed stability",
              "Feature dimensionality D_i is a metric you could track across SetConCA views",
              "PCA vs superposition tradeoff reappears when correlated views collapse to principal components"
            ],
            "comparisonTable": [
              [
                "Linear / PCA",
                "Max variance, orthogonal",
                "m features max",
                "No interference",
                "Not interpretable"
              ],
              [
                "Superposition (ReLU)",
                "Max weighted recon",
                ">> m features",
                "Tolerated when sparse",
                "Polysemantic neurons"
              ],
              [
                "SAE / dictionary learning",
                "Sparse recon of activations",
                "Overcomplete dict",
                "Explicit sparsity penalty",
                "More monosemantic features"
              ],
              [
                "SetConCA (your work)",
                "Sparse dict + multi-view alignment",
                "Overcomplete + set agg",
                "Sparsity + contrastive coord",
                "Goal: stable concept recovery"
              ]
            ],
            "sections": [
              "Definitions and Motivation: Features, Directions, Superposition",
              "Demonstrating Superposition (linear vs ReLU)",
              "Superposition as a Phase Change",
              "The Geometry of Superposition",
              "Superposition and Learning Dynamics",
              "Relationship to Adversarial Robustness",
              "Superposition in a Privileged Basis",
              "Computation in Superposition",
              "The Strategic Picture (3 ways out → SAEs)",
              "Discussion and Open Questions"
            ]
          },
          "abstract": "",
          "pdfPath": "RAW/2209.pdf",
          "teach": {
            "whyWeRead": "Conceptual foundation for why SAEs exist — more features than dimensions.",
            "oneSentence": "Toy ReLU models demonstrate superposition, phase changes, geometric feature packing, and why polysemantic neurons appear.",
            "plainLanguage": "When features are sparse, a network can store more features than it has dimensions by packing them into almost-orthogonal directions. Interference is the cost; nonlinearities can filter small interference.\n\nWhether a feature is ignored, superposed, or given a dedicated dimension depends on sparsity and importance — often as a phase change. Features form geometric arrangements (antipodal pairs, triangles, pentagons…).\n\nSAEs are the practical response: find an overcomplete sparse dictionary that unfolds superposed features. This paper literally lists that as Approach 2.",
            "keyIdeas": [
              {
                "title": "Superposition hypothesis",
                "original": "Networks can represent more features than dimensions by embedding features as almost-orthogonal directions, tolerating interference when features are sparse.",
                "simple": "Too many ideas, too little space: pack them at slight angles. When ideas rarely turn on together, the crosstalk is manageable.",
                "explain": "Networks can represent more features than dimensions by embedding features as almost-orthogonal directions, tolerating interference when features are sparse."
              },
              {
                "title": "Polysemantic neurons",
                "original": "Basis neurons may activate for several unrelated features because superposition mixes feature directions into neuron coordinates.",
                "simple": "One neuron lights up for ‘dog’ and ‘car’ not because that is elegant — because packing forced a mash-up.",
                "explain": "Basis neurons may activate for several unrelated features because superposition mixes feature directions into neuron coordinates."
              },
              {
                "title": "Feature benefit vs interference",
                "original": "Learning balances the loss reduction from representing an extra feature against the interference cost of non-orthogonality.",
                "simple": "Adding another packed feature helps sometimes and hurts sometimes. Sparsity and importance tip the scales.",
                "explain": "Learning balances the loss reduction from representing an extra feature against the interference cost of non-orthogonality."
              },
              {
                "title": "Phase changes",
                "original": "Whether a feature is ignored, superposed, or given a dedicated dimension can jump discontinuously as sparsity/importance vary (first-order phase structure in the toy models).",
                "simple": "Tiny changes in rarity/importance can suddenly switch strategy: ignore ↔ pack ↔ dedicate a whole axis.",
                "explain": "Whether a feature is ignored, superposed, or given a dedicated dimension can jump discontinuously as sparsity/importance vary (first-order phase structure in the toy models)."
              },
              {
                "title": "Feature dimensionality D_i",
                "original": "D_i = ||W_i||² / Σ_j (Ŵ_i·W_j)² measures how much of its embedding dimension a feature owns after accounting for interference.",
                "simple": "D=1 means ‘has its own private axis.’ D=½ often means ‘shares an axis with an opposite partner.’ D=0 means ‘not represented.’",
                "explain": "D_i = ||W_i||² / Σ_j (Ŵ_i·W_j)² measures how much of its embedding dimension a feature owns after accounting for interference."
              },
              {
                "title": "Computation in superposition",
                "original": "Toy models show limited computation (e.g. absolute value circuits) can run even while features remain packed.",
                "simple": "The network is not only storing packed features — it can sometimes compute with them still packed.",
                "explain": "Toy models show limited computation (e.g. absolute value circuits) can run even while features remain packed."
              },
              {
                "title": "Three ways out",
                "original": "Resolve superposition by (1) training models without it, (2) finding an overcomplete basis after the fact (SAEs/dictionary learning), or (3) hybrids.",
                "simple": "Stop packing, or unpack later with a sparse dictionary (SAEs), or do a bit of both.",
                "explain": "Resolve superposition by (1) training models without it, (2) finding an overcomplete basis after the fact (SAEs/dictionary learning), or (3) hybrids."
              }
            ],
            "simplifiedMath": [
              {
                "name": "Feature dimensionality",
                "formula": "D_i = ||W_i||² / Σ_j (Ŵ_i·W_j)²",
                "original": "Feature dimensionality: D_i = ||W_i||² / Σ_j (Ŵ_i·W_j)²",
                "simple": "How much of its dimension a feature owns after interference.",
                "meaning": "How much of its dimension a feature owns after interference."
              },
              {
                "name": "Linear vs ReLU toy",
                "formula": "x' = WᵀWx vs ReLU(WᵀWx+b)",
                "original": "Linear vs ReLU toy: x' = WᵀWx vs ReLU(WᵀWx+b)",
                "simple": "ReLU enables superposition solutions linear models lack.",
                "meaning": "ReLU enables superposition solutions linear models lack."
              }
            ],
            "vocabulary": [
              {
                "term": "Superposition",
                "original": "Technical term: «Superposition» as used in this literature.",
                "simple": "Representing more features than dimensions with interference.",
                "def": "Representing more features than dimensions with interference."
              },
              {
                "term": "Polysemantic",
                "original": "Technical term: «Polysemantic» as used in this literature.",
                "simple": "Unit activates for multiple unrelated concepts.",
                "def": "Unit activates for multiple unrelated concepts."
              },
              {
                "term": "Privileged basis",
                "original": "Technical term: «Privileged basis» as used in this literature.",
                "simple": "Architecture makes neuron axes special (e.g. after nonlinearity).",
                "def": "Architecture makes neuron axes special (e.g. after nonlinearity)."
              }
            ],
            "whatItShows": [
              "Superposition occurs in natural toy setups",
              "Phase structure and geometry",
              "Link to adversarial vulnerability"
            ],
            "whatItDoesNotShow": [
              "Exact feature geometry of large LMs",
              "That SAEs uniquely recover ground truth"
            ],
            "setconcaUse": [
              "Justify SAEs as Approach 2.",
              "Expect phase-sensitive behaviour when adding multi-view terms.",
              "Track interference/correlation between concept views."
            ],
            "masteryChecklist": [
              "I can explain superposition to a beginner.",
              "I can name the three ways out.",
              "I know D=1/2 means antipodal packing."
            ],
            "commonConfusions": [
              {
                "wrong": "More parameters always removes superposition.",
                "right": "Depends on sparsity/importance; may persist at scale."
              },
              {
                "wrong": "SAEs are Approach 1.",
                "right": "SAEs are overcomplete basis finding (Approach 2)."
              }
            ],
            "quiz": [
              {
                "q": "Superposition stores?",
                "options": [
                  "More features than dimensions",
                  "Fewer features always",
                  "Only labels",
                  "Only PCA comps"
                ],
                "a": 0,
                "explain": "Packed almost-orthogonal features."
              },
              {
                "q": "SAEs correspond to which way out?",
                "options": [
                  "Overcomplete basis after the fact",
                  "Delete all MLP layers",
                  "Only adversarial training",
                  "Ignore sparsity"
                ],
                "a": 0,
                "explain": "Approach 2."
              },
              {
                "q": "Linear toy models superpose like ReLU toys?",
                "options": [
                  "No — ReLU enables it",
                  "Yes always",
                  "Only with CKA",
                  "Only with probes"
                ],
                "a": 0,
                "explain": "Nonlinearity matters."
              }
            ],
            "originalIdea": "Toy ReLU models demonstrate superposition, phase changes, geometric feature packing, and why polysemantic neurons appear.",
            "simpleLesson": "When features are sparse, a network can store more features than it has dimensions by packing them into almost-orthogonal directions. Interference is the cost; nonlinearities can filter small interference.\n\nWhether a feature is ignored, superposed, or given a dedicated dimension depends on sparsity and importance — often as a phase change. Features form geometric arrangements (antipodal pairs, triangles, pentagons…).\n\nSAEs are the practical response: find an overcomplete sparse dictionary that unfolds superposed features. This paper literally lists that as Approach 2.",
            "limitPairs": [
              {
                "original": "Superposition occurs in natural toy setups",
                "simple": "In practice this means evidence supports: Superposition occurs in natural toy setups"
              },
              {
                "original": "Phase structure and geometry",
                "simple": "In practice this means evidence supports: Phase structure and geometry"
              },
              {
                "original": "Link to adversarial vulnerability",
                "simple": "In practice this means evidence supports: Link to adversarial vulnerability"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "Exact feature geometry of large LMs",
                "simple": "Do not overclaim: Exact feature geometry of large LMs"
              },
              {
                "original": "That SAEs uniquely recover ground truth",
                "simple": "Do not overclaim: That SAEs uniquely recover ground truth"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Justify SAEs as Approach 2.",
                "simple": "Action item: Justify SAEs as Approach 2."
              },
              {
                "original": "Expect phase-sensitive behaviour when adding multi-view terms.",
                "simple": "Action item: Expect phase-sensitive behaviour when adding multi-view terms."
              },
              {
                "original": "Track interference/correlation between concept views.",
                "simple": "Action item: Track interference/correlation between concept views."
              }
            ]
          },
          "quiz": [
            {
              "q": "Superposition stores?",
              "options": [
                "More features than dimensions",
                "Fewer features always",
                "Only labels",
                "Only PCA comps"
              ],
              "a": 0,
              "explain": "Packed almost-orthogonal features."
            },
            {
              "q": "SAEs correspond to which way out?",
              "options": [
                "Overcomplete basis after the fact",
                "Delete all MLP layers",
                "Only adversarial training",
                "Ignore sparsity"
              ],
              "a": 0,
              "explain": "Approach 2."
            },
            {
              "q": "Linear toy models superpose like ReLU toys?",
              "options": [
                "No — ReLU enables it",
                "Yes always",
                "Only with CKA",
                "Only with probes"
              ],
              "a": 0,
              "explain": "Nonlinearity matters."
            }
          ]
        },
        {
          "id": "monosemanticity",
          "num": 24,
          "title": "Towards Monosemanticity: Decomposing Language Models with Dictionary Learning",
          "authors": "Bricken et al.",
          "file": "Bricken - 2023 - Towards Monosemanticity Decomposing Language Mode.pdf",
          "learn": [
            "Features vs neurons",
            "Dictionary overcompleteness",
            "Feature splitting and polysemanticity",
            "Automated and manual interpretation"
          ],
          "setconca": "First large-scale dictionary learning on LM activations.",
          "optional": false,
          "abstract": "",
          "pages": 97,
          "pdfPath": "RAW/Bricken - 2023 - Towards Monosemanticity Decomposing Language Mode.pdf",
          "teach": {
            "whyWeRead": "Landmark application of dictionary learning to LM activations — features vs neurons.",
            "oneSentence": "Shows sparse dictionary learning can extract more monosemantic features than neurons in a small LM.",
            "plainLanguage": "Towards Monosemanticity trains sparse autoencoders on transformer activations and studies the resulting features. Many features look more monosemantic than neurons. Dictionary width and sparsity trade off against reconstruction.\n\nThey discuss feature splitting and residual polysemanticity. Interpretation mixes manual and automated methods. This sets cultural expectations for SAE research: show features, interventions, and limitations.",
            "keyIdeas": [
              {
                "title": "Features vs neurons",
                "original": "Interpretable directions (features) can be cleaner units than neuron basis elements under superposition.",
                "simple": "Don’t trust the factory wiring labels — find better directions.",
                "explain": "Interpretable directions (features) can be cleaner units than neuron basis elements under superposition."
              },
              {
                "title": "Dictionary learning on activations",
                "original": "Sparse autoencoders learn an overcomplete dictionary for residual-stream activations.",
                "simple": "Build a big menu of sparse feature detectors for activation vectors.",
                "explain": "Sparse autoencoders learn an overcomplete dictionary for residual-stream activations."
              },
              {
                "title": "Interpretability evidence",
                "original": "Evidence includes activation examples, automated descriptions, and interventions.",
                "simple": "Show when it fires, describe it, and poke it to see effects.",
                "explain": "Evidence includes activation examples, automated descriptions, and interventions."
              },
              {
                "title": "Splitting / leftover polysemanticity",
                "original": "Even strong dictionaries show feature splitting and residual polysemanticity.",
                "simple": "Not perfect atoms — concepts can fragment or remain mixed.",
                "explain": "Even strong dictionaries show feature splitting and residual polysemanticity."
              }
            ],
            "simplifiedMath": [],
            "vocabulary": [
              {
                "term": "Dictionary learning",
                "original": "Technical term: «Dictionary learning» as used in this literature.",
                "simple": "Learning sparse codes over an overcomplete basis.",
                "def": "Learning sparse codes over an overcomplete basis."
              },
              {
                "term": "Feature splitting",
                "original": "Technical term: «Feature splitting» as used in this literature.",
                "simple": "One concept spread across multiple dictionary features.",
                "def": "One concept spread across multiple dictionary features."
              }
            ],
            "whatItShows": [
              "SAE features can be highly interpretable relative to neurons in studied settings"
            ],
            "whatItDoesNotShow": [
              "Completeness or uniqueness of the dictionary"
            ],
            "setconcaUse": [
              "Adopt their qualitative+intervention reporting style.",
              "Expect splitting as a failure mode to measure."
            ],
            "masteryChecklist": [
              "I can explain why features beat neurons under superposition.",
              "I can list limitations they emphasise."
            ],
            "commonConfusions": [
              {
                "wrong": "Monosemanticity paper proves SAEs solve interpretability.",
                "right": "It shows promising decomposition with remaining issues."
              }
            ],
            "quiz": [
              {
                "q": "Main empirical claim?",
                "options": [
                  "SAE features can be more monosemantic than neurons",
                  "PCA is enough",
                  "Attention is unused",
                  "Probes replace SAEs"
                ],
                "a": 0,
                "explain": "Dictionary features vs neurons."
              }
            ],
            "originalIdea": "Shows sparse dictionary learning can extract more monosemantic features than neurons in a small LM.",
            "simpleLesson": "Towards Monosemanticity trains sparse autoencoders on transformer activations and studies the resulting features. Many features look more monosemantic than neurons. Dictionary width and sparsity trade off against reconstruction.\n\nThey discuss feature splitting and residual polysemanticity. Interpretation mixes manual and automated methods. This sets cultural expectations for SAE research: show features, interventions, and limitations.",
            "limitPairs": [
              {
                "original": "SAE features can be highly interpretable relative to neurons in studied settings",
                "simple": "In practice this means evidence supports: SAE features can be highly interpretable relative to neurons in studied settings"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "Completeness or uniqueness of the dictionary",
                "simple": "Do not overclaim: Completeness or uniqueness of the dictionary"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Adopt their qualitative+intervention reporting style.",
                "simple": "Action item: Adopt their qualitative+intervention reporting style."
              },
              {
                "original": "Expect splitting as a failure mode to measure.",
                "simple": "Action item: Expect splitting as a failure mode to measure."
              }
            ]
          },
          "quiz": [
            {
              "q": "Main empirical claim?",
              "options": [
                "SAE features can be more monosemantic than neurons",
                "PCA is enough",
                "Attention is unused",
                "Probes replace SAEs"
              ],
              "a": 0,
              "explain": "Dictionary features vs neurons."
            }
          ]
        },
        {
          "id": "cunningham-sae",
          "num": 25,
          "title": "Sparse Autoencoders Find Highly Interpretable Features in Language Models",
          "authors": "Cunningham et al.",
          "file": "2309.08600v3.pdf",
          "learn": [
            "SAE architecture",
            "Reconstruction and sparsity objectives",
            "Feature interpretation and interventions",
            "Comparisons against neurons"
          ],
          "setconca": "Central academic SAE paper — core reference.",
          "optional": false,
          "abstract": "One of the roadblocks to a better understanding of neural networks’ internals is polysemanticity, where neurons appear to activate in multiple, semantically dis- tinct contexts. Polysemanticity prevents us from identifying concise, human- understandable explanations for what neural networks are doing internally. One hypothesised cause of polysemanticity is superposition, where neural networks represent more features than they have neurons by assigning features to an over- complete set of directions in activation space, rather than to individual neurons. Here, we attempt to identify those directions, using sparse autoencoders to re- construct the internal activations of a language model. These autoencoders learn sets of sparsely activating features that are more interpretable and monoseman- tic than directions identified by alternative approaches, where interpretability is measured by automated methods. Moreover, we show that with our learned set of features, we can pinpoint the features that are causally responsible for coun- terfactual behaviour on the indirect object identification task (Wang et al., 2022) to a finer degree than previous decompositions. This work indicates that i",
          "pages": 20,
          "pdfPath": "RAW/2309.08600v3.pdf",
          "teach": {
            "whyWeRead": "Central academic SAE paper — architecture, objectives, interventions, comparisons.",
            "oneSentence": "Trains SAEs on LM activations showing sparse features are more interpretable and useful for interventions than alternatives.",
            "plainLanguage": "This paper presents sparse autoencoders that reconstruct activations under a sparsity penalty, then evaluates feature interpretability and causal usefulness via interventions.\n\nComparisons against neurons and other decompositions matter. Take the methodology: reconstruction+sparsity training, qualitative interpretation, and activation interventions.",
            "keyIdeas": [
              {
                "title": "SAE objective",
                "original": "Train encoders/decoders to reconstruct activations under a sparsity penalty on codes.",
                "simple": "Rebuild activations, but keep codes mostly off.",
                "explain": "Train encoders/decoders to reconstruct activations under a sparsity penalty on codes."
              },
              {
                "title": "Feature interpretation",
                "original": "Interpret features by contexts where they activate and qualitative/automated descriptions.",
                "simple": "Look at the situations that light a feature up.",
                "explain": "Interpret features by contexts where they activate and qualitative/automated descriptions."
              },
              {
                "title": "Interventions",
                "original": "Edit feature activations to test causal influence on outputs/behaviour.",
                "simple": "Turn a feature up/down and watch what changes.",
                "explain": "Edit feature activations to test causal influence on outputs/behaviour."
              },
              {
                "title": "Baselines",
                "original": "Compare against neurons and alternative decompositions.",
                "simple": "Beat naive units and other splits — don’t only show pretty examples.",
                "explain": "Compare against neurons and alternative decompositions."
              }
            ],
            "simplifiedMath": [
              {
                "name": "Typical SAE loss",
                "formula": "‖x−x̂‖² + λ Sparsity(z)",
                "original": "Typical SAE loss: ‖x−x̂‖² + λ Sparsity(z)",
                "simple": "Fidelity plus sparse codes z=enc(x), x̂=dec(z).",
                "meaning": "Fidelity plus sparse codes z=enc(x), x̂=dec(z)."
              }
            ],
            "vocabulary": [
              {
                "term": "SAE",
                "original": "Technical term: «SAE» as used in this literature.",
                "simple": "Sparse autoencoder on model activations.",
                "def": "Sparse autoencoder on model activations."
              },
              {
                "term": "Activation intervention",
                "original": "Technical term: «Activation intervention» as used in this literature.",
                "simple": "Edit feature activations to test causal effects.",
                "def": "Edit feature activations to test causal effects."
              }
            ],
            "whatItShows": [
              "Sparse dictionary features can be interpretable and intervention-relevant"
            ],
            "whatItDoesNotShow": [
              "Canonical uniqueness",
              "Perfect completeness"
            ],
            "setconcaUse": [
              "Pointwise SAE from this lineage is your primary baseline.",
              "Replicate intervention-style evaluations."
            ],
            "masteryChecklist": [
              "I can write the SAE loss in words.",
              "I know why interventions matter beyond FVU."
            ],
            "commonConfusions": [
              {
                "wrong": "Interpretable examples prove the dictionary is complete.",
                "right": "Examples are existence proofs, not completeness."
              }
            ],
            "quiz": [
              {
                "q": "SAE training typically minimises?",
                "options": [
                  "Reconstruction + sparsity",
                  "Only CKA",
                  "Only InfoNCE",
                  "Only accuracy"
                ],
                "a": 0,
                "explain": "Classic SAE objective."
              }
            ],
            "originalIdea": "Trains SAEs on LM activations showing sparse features are more interpretable and useful for interventions than alternatives.",
            "simpleLesson": "This paper presents sparse autoencoders that reconstruct activations under a sparsity penalty, then evaluates feature interpretability and causal usefulness via interventions.\n\nComparisons against neurons and other decompositions matter. Take the methodology: reconstruction+sparsity training, qualitative interpretation, and activation interventions.",
            "limitPairs": [
              {
                "original": "Sparse dictionary features can be interpretable and intervention-relevant",
                "simple": "In practice this means evidence supports: Sparse dictionary features can be interpretable and intervention-relevant"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "Canonical uniqueness",
                "simple": "Do not overclaim: Canonical uniqueness"
              },
              {
                "original": "Perfect completeness",
                "simple": "Do not overclaim: Perfect completeness"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Pointwise SAE from this lineage is your primary baseline.",
                "simple": "Action item: Pointwise SAE from this lineage is your primary baseline."
              },
              {
                "original": "Replicate intervention-style evaluations.",
                "simple": "Action item: Replicate intervention-style evaluations."
              }
            ]
          },
          "quiz": [
            {
              "q": "SAE training typically minimises?",
              "options": [
                "Reconstruction + sparsity",
                "Only CKA",
                "Only InfoNCE",
                "Only accuracy"
              ],
              "a": 0,
              "explain": "Classic SAE objective."
            }
          ]
        },
        {
          "id": "scaling-mono",
          "num": 26,
          "title": "Scaling Monosemanticity",
          "authors": "Templeton et al.",
          "file": "2605.29358v1.pdf",
          "learn": [
            "Scaling SAE dictionaries to large LMs",
            "Limitations at scale",
            "Completeness and uniqueness challenges"
          ],
          "setconca": "Scale alone does not guarantee canonical decomposition.",
          "optional": false,
          "abstract": "We demonstrate that sparse autoencoders can extract interpretable features from Claude 3 Sonnet, a production-scale language model, addressing the open question of whether dictionary learning methods scale beyond small transformers. We trained sparse autoencoders with up to 34 million features on the model’s middle layer residual stream, using scaling laws to guide hyperparameter selection. The resulting features are multilingual and multimodal (generalizing to images despite text-only training), respond to both concrete instances and abstract discussions of concepts, and can be used to steer model behavior in ways consistent with their interpretations. We find features corresponding to famous entities and locations, as well as more abstract concepts like sarcasm or errors in code. We also identify features relevant to ways in which language models might cause harm—including features representing deception, power-seeking, sycophancy, and bias—and show that these causally influence model outputs when manipulated. Additionally, we conduct analyses of feature interpretability, geometry, and computational function. However, significant limitations remain: our suite of features is incom",
          "pages": 71,
          "pdfPath": "RAW/2605.29358v1.pdf",
          "teach": {
            "whyWeRead": "Shows what happens when SAE dictionaries scale to frontier models — and what scale does not buy.",
            "oneSentence": "Scales monosemantic feature extraction to Claude 3 Sonnet with very large dictionaries.",
            "plainLanguage": "Scaling dictionaries extracts many fascinating features, including safety-relevant ones. But scale alone does not guarantee completeness, uniqueness, or a canonical decomposition.\n\nRead this to calibrate ambition: impressive features ≠ solved interpretability.",
            "keyIdeas": [
              {
                "title": "Scale features & models",
                "original": "Large SAE dictionaries on frontier LMs extract many interpretable features.",
                "simple": "Bigger models + bigger dictionaries → huge feature zoos.",
                "explain": "Large SAE dictionaries on frontier LMs extract many interpretable features."
              },
              {
                "title": "Rich feature zoo",
                "original": "Scaled SAEs surface detailed, sometimes safety-relevant features.",
                "simple": "You will find striking features; that is not the same as finishing interpretability.",
                "explain": "Scaled SAEs surface detailed, sometimes safety-relevant features."
              },
              {
                "title": "Limits remain",
                "original": "Scale does not imply completeness, uniqueness, or canonicality of the decomposition.",
                "simple": "More features ≠ the one true dictionary of concepts.",
                "explain": "Scale does not imply completeness, uniqueness, or canonicality of the decomposition."
              }
            ],
            "simplifiedMath": [],
            "vocabulary": [
              {
                "term": "Dictionary width",
                "original": "Technical term: «Dictionary width» as used in this literature.",
                "simple": "Number of learned features.",
                "def": "Number of learned features."
              }
            ],
            "whatItShows": [
              "SAE methods scale to large models with interesting features"
            ],
            "whatItDoesNotShow": [
              "Canonical units of analysis"
            ],
            "setconcaUse": [
              "Do not claim scale replaces careful multi-view evaluation."
            ],
            "masteryChecklist": [
              "I can separate 'many cool features' from 'problem solved'."
            ],
            "commonConfusions": [
              {
                "wrong": "Bigger dictionary ⇒ true concepts.",
                "right": "Bigger can also mean more splitting/noise features."
              }
            ],
            "quiz": [
              {
                "q": "Scaling monosemanticity shows scale alone?",
                "options": [
                  "Does not guarantee canonical decomposition",
                  "Solves absorption",
                  "Removes need for sparsity",
                  "Replaces probes"
                ],
                "a": 0,
                "explain": "Limits remain."
              }
            ],
            "originalIdea": "Scales monosemantic feature extraction to Claude 3 Sonnet with very large dictionaries.",
            "simpleLesson": "Scaling dictionaries extracts many fascinating features, including safety-relevant ones. But scale alone does not guarantee completeness, uniqueness, or a canonical decomposition.\n\nRead this to calibrate ambition: impressive features ≠ solved interpretability.",
            "limitPairs": [
              {
                "original": "SAE methods scale to large models with interesting features",
                "simple": "In practice this means evidence supports: SAE methods scale to large models with interesting features"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "Canonical units of analysis",
                "simple": "Do not overclaim: Canonical units of analysis"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Do not claim scale replaces careful multi-view evaluation.",
                "simple": "Action item: Do not claim scale replaces careful multi-view evaluation."
              }
            ]
          },
          "quiz": [
            {
              "q": "Scaling monosemanticity shows scale alone?",
              "options": [
                "Does not guarantee canonical decomposition",
                "Solves absorption",
                "Removes need for sparsity",
                "Replaces probes"
              ],
              "a": 0,
              "explain": "Limits remain."
            }
          ]
        }
      ],
      "primer": {
        "title": "Mechanistic interpretability foundations",
        "mission": "Explain residual streams, superposition, and why SAEs exist.",
        "beforeYouStart": "Levels 1–2 and metrics from Level 6.",
        "primer": "Transformers move information through a residual stream. Attention and MLP blocks read and write directions in that stream.\n\nToy Models of Superposition show that networks can pack more features than dimensions when features are sparse — at the cost of interference. Neurons become polysemantic. That is why reading individual neurons fails.\n\nSparse autoencoders try to recover the underlying feature directions as an overcomplete sparse dictionary — Approach 2 from the superposition paper.\n\nTowards Monosemanticity and Cunningham et al. apply this to language models. Scaling Monosemanticity shows scale helps but does not guarantee a unique canonical decomposition.",
        "bigPictureDiagram": [
          "many sparse features → packed into few dims (superposition) → polysemantic neurons",
          "SAE: learn overcomplete sparse dictionary ≈ unfold features"
        ],
        "conceptsToMaster": [
          {
            "name": "Superposition",
            "simple": "More features than neurons via almost-orthogonal directions.",
            "deeper": "Phase changes with sparsity/importance; geometric packing."
          },
          {
            "name": "Monosemantic vs polysemantic",
            "simple": "One concept vs many unrelated concepts on one unit.",
            "deeper": "SAE features aim for monosemanticity; not guaranteed."
          }
        ],
        "checkpoint": {
          "goal": "Write notes linking superposition to your activation geometry.",
          "steps": [
            "Estimate sparsity regime",
            "List interference risks",
            "State why a pointwise SAE is a baseline"
          ],
          "successLooksLike": "You can justify SAEs without saying 'everyone uses them'."
        },
        "bridgeToNext": "Modern SAE architectures improve the sparsity–fidelity frontier."
      }
    },
    {
      "id": 8,
      "title": "Modern SAE architectures",
      "weeks": "13–14",
      "checkpoint": "Train L1, TopK, Gated, JumpReLU, BatchTopK, Matryoshka SAEs at matched reconstruction/sparsity. Plot Pareto curves.",
      "papers": [
        {
          "id": "topk-sae",
          "num": 27,
          "title": "Scaling and Evaluating Sparse Autoencoders",
          "authors": "Gao et al.",
          "file": "2406.04093v1.pdf",
          "learn": [
            "TopK SAEs",
            "Dictionary width and expansion factor",
            "Reconstruction-sparsity frontiers",
            "Compare at matched sparsity or fidelity"
          ],
          "setconca": "Main reference for TopK SAE training and evaluation.",
          "optional": false,
          "abstract": "Sparse autoencoders provide a promising unsupervised approach for extracting in- terpretable features from a language model by reconstructing activations from a sparse bottleneck layer. Since language models learn many concepts, autoencoders need to be very large to recover all relevant features. However, studying the proper- ties of autoencoder scaling is difficult due to the need to balance reconstruction and sparsity objectives and the presence of dead latents. We propose using k-sparse autoencoders [Makhzani and Frey, 2013] to directly control sparsity, simplifying tuning and improving the reconstruction-sparsity frontier. Additionally, we find modifications that result in few dead latents, even at the largest scales we tried. Us- ing these techniques, we find clean scaling laws with respect to autoencoder size and sparsity. We also introduce several new metrics for evaluating feature qual- ity based on the recovery of hypothesized features, the explainability of activation patterns, and the sparsity of downstream effects. These metrics all generally im- prove with autoencoder size. To demonstrate the scalability of our approach, we train a 16 million latent autoencoder on GPT-",
          "pages": 34,
          "pdfPath": "RAW/2406.04093v1.pdf",
          "teach": {
            "whyWeRead": "Main modern reference for TopK SAEs, scaling, and matched evaluation frontiers.",
            "oneSentence": "Scales and evaluates SAEs with TopK activations, emphasising fair comparisons at matched sparsity/fidelity.",
            "plainLanguage": "TopK SAEs enforce exact sparsity without L1 shrinkage of active magnitudes. Gao et al. study how dictionary width, sparsity, and reconstruction trade off as models scale.\n\nKey methodological point: compare SAEs at similar L0 or similar FVU — not at each method's favourite hyperparameter.",
            "keyIdeas": [
              {
                "title": "TopK activation",
                "original": "Exactly k latent activations remain nonzero per token/site.",
                "simple": "Hard budget: only k features may fire.",
                "explain": "Exactly k latent activations remain nonzero per token/site."
              },
              {
                "title": "Expansion / width",
                "original": "Dictionary width / expansion factor controls capacity for sparse features.",
                "simple": "Wider menus can separate concepts — at compute cost.",
                "explain": "Dictionary width / expansion factor controls capacity for sparse features."
              },
              {
                "title": "Reconstruction–sparsity frontier",
                "original": "Methods should be compared on Pareto curves of fidelity vs sparsity.",
                "simple": "Don’t brag at mismatched operating points.",
                "explain": "Methods should be compared on Pareto curves of fidelity vs sparsity."
              },
              {
                "title": "Matched comparisons",
                "original": "Fair bake-offs hold L0 or FVU roughly fixed across architectures.",
                "simple": "Compare apples to apples on the same sparsity/fidelity budget.",
                "explain": "Fair bake-offs hold L0 or FVU roughly fixed across architectures."
              }
            ],
            "simplifiedMath": [
              {
                "name": "TopK SAE",
                "formula": "z=TopK(enc(x),k), x̂=dec(z)",
                "original": "TopK SAE: z=TopK(enc(x),k), x̂=dec(z)",
                "simple": "Hard sparsity then decode.",
                "meaning": "Hard sparsity then decode."
              }
            ],
            "vocabulary": [
              {
                "term": "Expansion factor",
                "original": "Technical term: «Expansion factor» as used in this literature.",
                "simple": "dictionary_width / d_model (roughly).",
                "def": "dictionary_width / d_model (roughly)."
              },
              {
                "term": "L0",
                "original": "Technical term: «L0» as used in this literature.",
                "simple": "Average number of active features.",
                "def": "Average number of active features."
              }
            ],
            "whatItShows": [
              "TopK scales; evaluation must be frontier-aware"
            ],
            "whatItDoesNotShow": [
              "That TopK solves absorption/non-canonicality"
            ],
            "setconcaUse": [
              "Default architecture family for baselines.",
              "Always plot Pareto curves for variants."
            ],
            "masteryChecklist": [
              "I can explain TopK vs L1.",
              "I insist on matched sparsity/fidelity comparisons."
            ],
            "commonConfusions": [
              {
                "wrong": "Best paper numbers at any hyperparams are comparable.",
                "right": "Compare on the same frontier point."
              }
            ],
            "quiz": [
              {
                "q": "Fair SAE comparison needs?",
                "options": [
                  "Matched sparsity or fidelity",
                  "Only biggest width",
                  "Only lowest loss anywhere",
                  "Only CKA"
                ],
                "a": 0,
                "explain": "Operating point matching."
              }
            ],
            "originalIdea": "Scales and evaluates SAEs with TopK activations, emphasising fair comparisons at matched sparsity/fidelity.",
            "simpleLesson": "TopK SAEs enforce exact sparsity without L1 shrinkage of active magnitudes. Gao et al. study how dictionary width, sparsity, and reconstruction trade off as models scale.\n\nKey methodological point: compare SAEs at similar L0 or similar FVU — not at each method's favourite hyperparameter.",
            "limitPairs": [
              {
                "original": "TopK scales; evaluation must be frontier-aware",
                "simple": "In practice this means evidence supports: TopK scales; evaluation must be frontier-aware"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That TopK solves absorption/non-canonicality",
                "simple": "Do not overclaim: That TopK solves absorption/non-canonicality"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Default architecture family for baselines.",
                "simple": "Action item: Default architecture family for baselines."
              },
              {
                "original": "Always plot Pareto curves for variants.",
                "simple": "Action item: Always plot Pareto curves for variants."
              }
            ]
          },
          "quiz": [
            {
              "q": "Fair SAE comparison needs?",
              "options": [
                "Matched sparsity or fidelity",
                "Only biggest width",
                "Only lowest loss anywhere",
                "Only CKA"
              ],
              "a": 0,
              "explain": "Operating point matching."
            }
          ]
        },
        {
          "id": "gated-sae",
          "num": 28,
          "title": "Improving Dictionary Learning with Gated Sparse Autoencoders",
          "authors": "Rajamanoharan et al.",
          "file": "2404.16014v2.pdf",
          "learn": [
            "Separating activation gate from magnitude",
            "Addressing L1 shrinkage"
          ],
          "setconca": "Architecture choice affects feature quality at same sparsity.",
          "optional": false,
          "abstract": "",
          "pages": 37,
          "pdfPath": "RAW/2404.16014v2.pdf",
          "teach": {
            "whyWeRead": "Fixes L1 shrinkage by separating gate (whether active) from magnitude.",
            "oneSentence": "Gated SAEs improve the sparsity–fidelity Pareto by decoupling activation and magnitude.",
            "plainLanguage": "L1 penalties encourage sparsity but also shrink the magnitude of active features (shrinkage), hurting reconstruction. Gated SAEs use a gate to decide if a feature is on, and a separate path for magnitude.\n\nResult: better tradeoffs on the Pareto frontier versus standard L1 SAEs.",
            "keyIdeas": [
              {
                "title": "Shrinkage problem",
                "original": "L1 sparsity shrinks magnitudes of active features, harming reconstruction.",
                "simple": "The same penalty that turns features off also weakens survivors.",
                "explain": "L1 sparsity shrinks magnitudes of active features, harming reconstruction."
              },
              {
                "title": "Gate vs magnitude",
                "original": "Gated SAEs separate ‘is it on?’ from ‘how strong?’",
                "simple": "One switch for on/off, another pathway for strength.",
                "explain": "Gated SAEs separate ‘is it on?’ from ‘how strong?’"
              },
              {
                "title": "Pareto improvement",
                "original": "Separating gate/magnitude improves the sparsity–fidelity tradeoff vs plain L1.",
                "simple": "Same sparsity, better rebuilds — or same rebuilds, fewer actives.",
                "explain": "Separating gate/magnitude improves the sparsity–fidelity tradeoff vs plain L1."
              }
            ],
            "simplifiedMath": [],
            "vocabulary": [
              {
                "term": "Shrinkage",
                "original": "Technical term: «Shrinkage» as used in this literature.",
                "simple": "Underestimation of active feature magnitudes due to L1.",
                "def": "Underestimation of active feature magnitudes due to L1."
              },
              {
                "term": "Gated SAE",
                "original": "Technical term: «Gated SAE» as used in this literature.",
                "simple": "SAE with separate gating and magnitude pathways.",
                "def": "SAE with separate gating and magnitude pathways."
              }
            ],
            "whatItShows": [
              "Architectural fix for L1 shrinkage"
            ],
            "whatItDoesNotShow": [
              "Canonical features"
            ],
            "setconcaUse": [
              "Include Gated SAE in architecture bake-offs."
            ],
            "masteryChecklist": [
              "I can explain shrinkage and how gating helps."
            ],
            "commonConfusions": [
              {
                "wrong": "Gating is only for MoE routers.",
                "right": "Here gating is inside the SAE feature activation."
              }
            ],
            "quiz": [
              {
                "q": "Gated SAEs mainly address?",
                "options": [
                  "L1 magnitude shrinkage",
                  "Tokenisation",
                  "Dropout only",
                  "CKA only"
                ],
                "a": 0,
                "explain": "Separate gate/magnitude."
              }
            ],
            "originalIdea": "Gated SAEs improve the sparsity–fidelity Pareto by decoupling activation and magnitude.",
            "simpleLesson": "L1 penalties encourage sparsity but also shrink the magnitude of active features (shrinkage), hurting reconstruction. Gated SAEs use a gate to decide if a feature is on, and a separate path for magnitude.\n\nResult: better tradeoffs on the Pareto frontier versus standard L1 SAEs.",
            "limitPairs": [
              {
                "original": "Architectural fix for L1 shrinkage",
                "simple": "In practice this means evidence supports: Architectural fix for L1 shrinkage"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "Canonical features",
                "simple": "Do not overclaim: Canonical features"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Include Gated SAE in architecture bake-offs.",
                "simple": "Action item: Include Gated SAE in architecture bake-offs."
              }
            ]
          },
          "quiz": [
            {
              "q": "Gated SAEs mainly address?",
              "options": [
                "L1 magnitude shrinkage",
                "Tokenisation",
                "Dropout only",
                "CKA only"
              ],
              "a": 0,
              "explain": "Separate gate/magnitude."
            }
          ]
        },
        {
          "id": "jumprelu",
          "num": 29,
          "title": "Jumping Ahead: Improving Reconstruction Fidelity with JumpReLU SAEs",
          "authors": "Rajamanoharan et al.",
          "file": "2407.14435v3.pdf",
          "learn": [
            "Learned activation threshold",
            "L0-style sparsity optimisation"
          ],
          "setconca": "Why L1 SAEs are no longer the default.",
          "optional": false,
          "abstract": "",
          "pages": 26,
          "pdfPath": "RAW/2407.14435v3.pdf",
          "teach": {
            "whyWeRead": "Learned thresholds and more direct L0-style sparsity — why plain L1 is no longer default.",
            "oneSentence": "JumpReLU SAEs use a discontinuous thresholded activation to improve reconstruction fidelity under sparsity.",
            "plainLanguage": "JumpReLU introduces a jump discontinuity / threshold: below threshold the feature is off; above it contributes. This approximates hard sparsity better than soft L1 and can improve fidelity at a given sparsity level.\n\nTogether with TopK and Gated, it shows the field moved past vanilla L1 SAEs.",
            "keyIdeas": [
              {
                "title": "Learned threshold",
                "original": "JumpReLU uses a thresholded activation so small pre-activations contribute nothing.",
                "simple": "Below the curb: off. Above: on. The curb can be learned.",
                "explain": "JumpReLU uses a thresholded activation so small pre-activations contribute nothing."
              },
              {
                "title": "L0-style goal",
                "original": "Training more directly targets counting actives rather than soft L1 shrinkage.",
                "simple": "Aim at ‘how many are on’ more honestly.",
                "explain": "Training more directly targets counting actives rather than soft L1 shrinkage."
              },
              {
                "title": "Fidelity gains",
                "original": "Thresholded activations can improve reconstruction at a given sparsity level.",
                "simple": "Better rebuilds without giving up sparsity.",
                "explain": "Thresholded activations can improve reconstruction at a given sparsity level."
              }
            ],
            "simplifiedMath": [],
            "vocabulary": [
              {
                "term": "JumpReLU",
                "original": "Technical term: «JumpReLU» as used in this literature.",
                "simple": "ReLU-like activation with a jump/threshold for sparsity.",
                "def": "ReLU-like activation with a jump/threshold for sparsity."
              }
            ],
            "whatItShows": [
              "Thresholded activations help SAE frontiers"
            ],
            "whatItDoesNotShow": [
              "Unique correct features"
            ],
            "setconcaUse": [
              "Include JumpReLU in matched Pareto comparisons."
            ],
            "masteryChecklist": [
              "I can place JumpReLU among TopK/Gated/L1."
            ],
            "commonConfusions": [
              {
                "wrong": "JumpReLU removes need for evaluation.",
                "right": "Architecture ≠ interpretability proof."
              }
            ],
            "quiz": [
              {
                "q": "JumpReLU emphasises?",
                "options": [
                  "Learned thresholds / L0-like sparsity",
                  "Only CCA",
                  "Only probes",
                  "Only Deep Sets"
                ],
                "a": 0,
                "explain": "Thresholded activation."
              }
            ],
            "originalIdea": "JumpReLU SAEs use a discontinuous thresholded activation to improve reconstruction fidelity under sparsity.",
            "simpleLesson": "JumpReLU introduces a jump discontinuity / threshold: below threshold the feature is off; above it contributes. This approximates hard sparsity better than soft L1 and can improve fidelity at a given sparsity level.\n\nTogether with TopK and Gated, it shows the field moved past vanilla L1 SAEs.",
            "limitPairs": [
              {
                "original": "Thresholded activations help SAE frontiers",
                "simple": "In practice this means evidence supports: Thresholded activations help SAE frontiers"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "Unique correct features",
                "simple": "Do not overclaim: Unique correct features"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Include JumpReLU in matched Pareto comparisons.",
                "simple": "Action item: Include JumpReLU in matched Pareto comparisons."
              }
            ]
          },
          "quiz": [
            {
              "q": "JumpReLU emphasises?",
              "options": [
                "Learned thresholds / L0-like sparsity",
                "Only CCA",
                "Only probes",
                "Only Deep Sets"
              ],
              "a": 0,
              "explain": "Thresholded activation."
            }
          ]
        },
        {
          "id": "batchtopk",
          "num": 30,
          "title": "BatchTopK Sparse Autoencoders",
          "authors": "Bussmann and Leask",
          "file": "2412.06410v1.pdf",
          "learn": [
            "Batch-level sparsity constraints",
            "Variable features per token"
          ],
          "setconca": "Flexible sparsity for heterogeneous activations.",
          "optional": false,
          "abstract": "Sparse autoencoders (SAEs) have emerged as a powerful tool for interpreting language model activations by decomposing them into sparse, interpretable features. A popular approach is the TopK SAE, that uses a fixed number of the most active latents per sample to reconstruct the model activations. We introduce BatchTopK SAEs, a training method that improves upon TopK SAEs by relaxing the top- k constraint to the batch-level, allowing for a variable number of latents to be active per sample. As a result, BatchTopK adaptively allocates more or fewer latents depending on the sample, improving reconstruction without sacrificing average sparsity. We show that BatchTopK SAEs consistently outperform TopK SAEs in reconstructing activations from GPT-2 Small and Gemma 2 2B, and achieve comparable performance to state-of-the-art JumpReLU SAEs. However, an advantage of BatchTopK is that the average number of latents can be directly specified, rather than approximately tuned through a costly hyperparameter sweep. We provide code for training and evaluating BatchTopK SAEs at https://github. com/bartbussmann/BatchTopK. 1",
          "pages": 6,
          "pdfPath": "RAW/2412.06410v1.pdf",
          "teach": {
            "whyWeRead": "Relaxes per-token exact-k to a batch sparsity budget — flexible for heterogeneous activations.",
            "oneSentence": "BatchTopK constrains total actives across a batch so hard tokens can use more features.",
            "plainLanguage": "Exact TopK forces every token to use the same number of features. Some activations are simple; some are complex. BatchTopK shares a sparsity budget across the batch.\n\nThis can improve allocation efficiency while keeping an overall L0 target.",
            "keyIdeas": [
              {
                "title": "Batch-level cardinality",
                "original": "Sparsity is constrained across a batch rather than forcing identical k on every token.",
                "simple": "Share a total ‘feature budget’ across many tokens.",
                "explain": "Sparsity is constrained across a batch rather than forcing identical k on every token."
              },
              {
                "title": "Heterogeneous difficulty",
                "original": "Hard activations can consume more features; easy ones fewer.",
                "simple": "Complicated tokens get more tools; simple ones don’t waste them.",
                "explain": "Hard activations can consume more features; easy ones fewer."
              },
              {
                "title": "Still TopK family",
                "original": "Selection remains hard TopK-style rather than L1 shrinkage.",
                "simple": "Still hard winners — just reallocated across the batch.",
                "explain": "Selection remains hard TopK-style rather than L1 shrinkage."
              }
            ],
            "simplifiedMath": [],
            "vocabulary": [
              {
                "term": "BatchTopK",
                "original": "Technical term: «BatchTopK» as used in this literature.",
                "simple": "TopK applied with a batch-wide sparsity constraint.",
                "def": "TopK applied with a batch-wide sparsity constraint."
              }
            ],
            "whatItShows": [
              "Flexible sparsity allocation helps"
            ],
            "whatItDoesNotShow": [
              "Solved absorption"
            ],
            "setconcaUse": [
              "Useful when views/tokens vary wildly in complexity."
            ],
            "masteryChecklist": [
              "I can contrast per-token TopK vs BatchTopK."
            ],
            "commonConfusions": [
              {
                "wrong": "BatchTopK means no sparsity.",
                "right": "It redistributes a fixed budget."
              }
            ],
            "quiz": [
              {
                "q": "BatchTopK allows?",
                "options": [
                  "Variable actives per token under a batch budget",
                  "Infinite actives",
                  "No decoder",
                  "Only PCA"
                ],
                "a": 0,
                "explain": "Shared budget."
              }
            ],
            "originalIdea": "BatchTopK constrains total actives across a batch so hard tokens can use more features.",
            "simpleLesson": "Exact TopK forces every token to use the same number of features. Some activations are simple; some are complex. BatchTopK shares a sparsity budget across the batch.\n\nThis can improve allocation efficiency while keeping an overall L0 target.",
            "limitPairs": [
              {
                "original": "Flexible sparsity allocation helps",
                "simple": "In practice this means evidence supports: Flexible sparsity allocation helps"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "Solved absorption",
                "simple": "Do not overclaim: Solved absorption"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Useful when views/tokens vary wildly in complexity.",
                "simple": "Action item: Useful when views/tokens vary wildly in complexity."
              }
            ]
          },
          "quiz": [
            {
              "q": "BatchTopK allows?",
              "options": [
                "Variable actives per token under a batch budget",
                "Infinite actives",
                "No decoder",
                "Only PCA"
              ],
              "a": 0,
              "explain": "Shared budget."
            }
          ]
        },
        {
          "id": "matryoshka",
          "num": 31,
          "title": "Learning Multi-Level Features with Matryoshka Sparse Autoencoders",
          "authors": "Bussmann et al.",
          "file": "2503.17547v1.pdf",
          "learn": [
            "Hierarchical features at multiple sparsity levels",
            "Atomic vs high-level concepts",
            "Nested representations"
          ],
          "setconca": "Relevant to multi-granularity concept structure in SetConCA.",
          "optional": false,
          "abstract": "Sparse autoencoders (SAEs) have emerged as a powerful tool for interpreting neural networks by extracting the concepts represented in their acti- vations. However, choosing the size of the SAE dictionary (i.e. number of learned concepts) cre- ates a tension: as dictionary size increases to cap- ture more relevant concepts, sparsity incentivizes features to be split or absorbed into more spe- cific features, leaving high-level features missing or warped. We introduce Matryoshka SAEs, a novel variant that addresses these issues by simul- taneously training multiple nested dictionaries of increasing size, forcing the smaller dictionaries to independently reconstruct the inputs without using the larger dictionaries. This organizes fea- tures hierarchically - the smaller dictionaries learn general concepts, while the larger dictionaries learn more specific concepts, without incentive to absorb the high-level features. We train Ma- tryoshka SAEs on Gemma-2-2B and TinyStories and find superior performance on sparse prob- ing and targeted concept erasure tasks, more dis- entangled concept representations, and reduced feature absorption. While there is a minor trade- off with reconstruction",
          "pages": 23,
          "pdfPath": "RAW/2503.17547v1.pdf",
          "teach": {
            "whyWeRead": "Multi-level nested features — relevant to atomic vs high-level concepts.",
            "oneSentence": "Matryoshka SAEs learn useful features at multiple sparsity/prefix levels within one dictionary.",
            "plainLanguage": "Choosing dictionary size creates tension: small dictionaries merge concepts; large ones split. Matryoshka training encourages nested subsets of features to remain useful at multiple granularities.\n\nThis connects to questions about hierarchical concepts in SetConCA.",
            "keyIdeas": [
              {
                "title": "Nested dictionaries",
                "original": "Prefixes of the feature list remain useful at multiple widths/sparsity levels.",
                "simple": "Like nested dolls: smaller prefixes should still work.",
                "explain": "Prefixes of the feature list remain useful at multiple widths/sparsity levels."
              },
              {
                "title": "Multi-granularity",
                "original": "Encourages coarse and fine features to coexist productively.",
                "simple": "Both big themes and small details can live in one dictionary.",
                "explain": "Encourages coarse and fine features to coexist productively."
              },
              {
                "title": "Dictionary-size tension",
                "original": "Small dictionaries merge concepts; large ones split — nesting softens the dilemma.",
                "simple": "One size rarely fits all granularities; nesting hedges the bet.",
                "explain": "Small dictionaries merge concepts; large ones split — nesting softens the dilemma."
              }
            ],
            "simplifiedMath": [],
            "vocabulary": [
              {
                "term": "Matryoshka representation",
                "original": "Technical term: «Matryoshka representation» as used in this literature.",
                "simple": "Nested multi-size useful prefixes of a representation.",
                "def": "Nested multi-size useful prefixes of a representation."
              }
            ],
            "whatItShows": [
              "One SAE can serve multiple sparsity levels"
            ],
            "whatItDoesNotShow": [
              "True ontological hierarchy of language"
            ],
            "setconcaUse": [
              "Inspiration for multi-granularity concept structure."
            ],
            "masteryChecklist": [
              "I can explain the dictionary-size tension Matryoshka targets."
            ],
            "commonConfusions": [
              {
                "wrong": "Nested training proves hierarchy is correct.",
                "right": "It encourages multi-scale usefulness."
              }
            ],
            "quiz": [
              {
                "q": "Matryoshka SAEs aim for?",
                "options": [
                  "Useful multi-level / nested features",
                  "Only one active feature ever",
                  "Removing sparsity",
                  "Only CKA"
                ],
                "a": 0,
                "explain": "Nested granularities."
              }
            ],
            "originalIdea": "Matryoshka SAEs learn useful features at multiple sparsity/prefix levels within one dictionary.",
            "simpleLesson": "Choosing dictionary size creates tension: small dictionaries merge concepts; large ones split. Matryoshka training encourages nested subsets of features to remain useful at multiple granularities.\n\nThis connects to questions about hierarchical concepts in SetConCA.",
            "limitPairs": [
              {
                "original": "One SAE can serve multiple sparsity levels",
                "simple": "In practice this means evidence supports: One SAE can serve multiple sparsity levels"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "True ontological hierarchy of language",
                "simple": "Do not overclaim: True ontological hierarchy of language"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Inspiration for multi-granularity concept structure.",
                "simple": "Action item: Inspiration for multi-granularity concept structure."
              }
            ]
          },
          "quiz": [
            {
              "q": "Matryoshka SAEs aim for?",
              "options": [
                "Useful multi-level / nested features",
                "Only one active feature ever",
                "Removing sparsity",
                "Only CKA"
              ],
              "a": 0,
              "explain": "Nested granularities."
            }
          ]
        }
      ],
      "primer": {
        "title": "Modern SAE architectures",
        "mission": "Compare L1, TopK, Gated, JumpReLU, BatchTopK, Matryoshka on matched frontiers.",
        "beforeYouStart": "Level 7 SAE motivation.",
        "primer": "Architecture changes how sparsity is enforced and how magnitudes behave.\n\nTopK (Gao et al.): exact sparsity, strong scaling study. Gated: separate whether a feature fires from how strongly — fights L1 shrinkage. JumpReLU: learned threshold, more direct L0-style objective. BatchTopK: sparsity budget across a batch, not fixed k per token. Matryoshka: nested multi-level features in one dictionary.\n\nNever compare architectures only at their favourite hyperparameters. Plot reconstruction–sparsity Pareto curves.",
        "bigPictureDiagram": [
          "same data → family of SAEs → Pareto(FVU, L0) → pick at matched operating point"
        ],
        "conceptsToMaster": [
          {
            "name": "Expansion factor",
            "simple": "dictionary width / activation dim.",
            "deeper": "Wider dictionaries can reduce feature merging but cost compute."
          },
          {
            "name": "Pareto frontier",
            "simple": "Best reconstruction for each sparsity level.",
            "deeper": "Fair comparison lives on this curve."
          }
        ],
        "checkpoint": {
          "goal": "Train six SAE variants under matched budgets.",
          "steps": [
            "L1",
            "TopK",
            "Gated",
            "JumpReLU",
            "BatchTopK",
            "Matryoshka",
            "plot Pareto"
          ],
          "successLooksLike": "You refuse single-hyperparameter bake-offs."
        },
        "bridgeToNext": "Evaluation must catch absorption, non-canonical decompositions, and flaky benchmarks."
      }
    },
    {
      "id": 9,
      "title": "SAE evaluation and failure modes",
      "weeks": "15",
      "checkpoint": "Design evaluation protocol using SAEBench families. Document what each metric does and does not establish.",
      "papers": [
        {
          "id": "principled-eval",
          "num": 32,
          "title": "Towards Principled Evaluations of Sparse Autoencoders for Interpretability and Control",
          "authors": "Makelov et al.",
          "file": "2405.08366v3.pdf",
          "learn": [
            "Task-relevant approximation and control",
            "Why reconstruction/sparsity alone fail"
          ],
          "setconca": "Required reading before proposing new SAE methods.",
          "optional": false,
          "abstract": "Disentangling model activations into meaningful features is a central prob- lem in interpretability. However, the absence of ground-truth for these features in realistic scenarios makes validating recent approaches, such as sparse dictionary learning, elusive. To address this challenge, we propose a framework for evaluating feature dictionaries in the context of specific tasks, by comparing them against supervised feature dictionaries. First, we demonstrate that supervised dictionaries achieve excellent approximation, control, and interpretability of model computations on the task. Second, we use the supervised dictionaries to develop and contextualize evaluations of unsupervised dictionaries along the same three axes. We apply this framework to the indirect object identification (IOI) task using GPT-2 Small, with sparse autoencoders (SAEs) trained on either the IOI or OpenWebText datasets. We find that these SAEs capture interpretable fea- tures for the IOI task, but they are less successful than supervised features in controlling the model. Finally, we observe two qualitative phenomena in SAE training: feature occlusion (where a causally relevant concept is robustly overshadowed ",
          "pages": 51,
          "pdfPath": "RAW/2405.08366v3.pdf",
          "teach": {
            "whyWeRead": "Shows reconstruction/sparsity proxies are insufficient for interpretability and control claims.",
            "oneSentence": "Argues for evaluations tied to task-relevant approximation, control, and interpretation.",
            "plainLanguage": "A nice FVU and L0 do not mean features support the interventions or interpretations you care about. This paper pushes evaluations that test whether SAE features help approximate and control model behaviour on tasks.\n\nInternalise: proxy metrics are necessary hygiene, not the scientific endpoint.",
            "keyIdeas": [
              {
                "title": "Proxy insufficiency",
                "original": "Reconstruction and sparsity proxies do not entail interpretability or control.",
                "simple": "Nice FVU/L0 is hygiene, not the scientific finish line.",
                "explain": "Reconstruction and sparsity proxies do not entail interpretability or control."
              },
              {
                "title": "Control & task relevance",
                "original": "Evaluate whether features support task-relevant approximation and interventions.",
                "simple": "Can you use the features to do the job you claim?",
                "explain": "Evaluate whether features support task-relevant approximation and interventions."
              },
              {
                "title": "Principled eval design",
                "original": "Metrics must match claims; otherwise optimisation will game the proxy.",
                "simple": "State the claim, then pick tests that could falsify it.",
                "explain": "Metrics must match claims; otherwise optimisation will game the proxy."
              }
            ],
            "simplifiedMath": [],
            "vocabulary": [
              {
                "term": "Proxy metric",
                "original": "Technical term: «Proxy metric» as used in this literature.",
                "simple": "Easy measure that may not track the true goal.",
                "def": "Easy measure that may not track the true goal."
              }
            ],
            "whatItShows": [
              "Need claim-aligned evaluations"
            ],
            "whatItDoesNotShow": [
              "A single universal SAE score"
            ],
            "setconcaUse": [
              "Write claims first, then pick metrics that could falsify them."
            ],
            "masteryChecklist": [
              "I refuse FVU-only papers as sufficient."
            ],
            "commonConfusions": [
              {
                "wrong": "Best FVU SAE is best interpretable SAE.",
                "right": "Not necessarily."
              }
            ],
            "quiz": [
              {
                "q": "Principled evaluations emphasise?",
                "options": [
                  "Task-relevant control/interpretation not just proxies",
                  "Only lower L0",
                  "Only wider dictionaries",
                  "Only faster training"
                ],
                "a": 0,
                "explain": "Claim-aligned tests."
              }
            ],
            "originalIdea": "Argues for evaluations tied to task-relevant approximation, control, and interpretation.",
            "simpleLesson": "A nice FVU and L0 do not mean features support the interventions or interpretations you care about. This paper pushes evaluations that test whether SAE features help approximate and control model behaviour on tasks.\n\nInternalise: proxy metrics are necessary hygiene, not the scientific endpoint.",
            "limitPairs": [
              {
                "original": "Need claim-aligned evaluations",
                "simple": "In practice this means evidence supports: Need claim-aligned evaluations"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "A single universal SAE score",
                "simple": "Do not overclaim: A single universal SAE score"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Write claims first, then pick metrics that could falsify them.",
                "simple": "Action item: Write claims first, then pick metrics that could falsify them."
              }
            ]
          },
          "quiz": [
            {
              "q": "Principled evaluations emphasise?",
              "options": [
                "Task-relevant control/interpretation not just proxies",
                "Only lower L0",
                "Only wider dictionaries",
                "Only faster training"
              ],
              "a": 0,
              "explain": "Claim-aligned tests."
            }
          ]
        },
        {
          "id": "absorption",
          "num": 33,
          "title": "A is for Absorption: Studying Feature Splitting and Absorption in Sparse Autoencoders",
          "authors": "Chanin et al.",
          "file": "2409.14507v6.pdf",
          "learn": [
            "Feature splitting: one concept across features",
            "Feature absorption: one feature, many concepts"
          ],
          "setconca": "Challenges atomic concept assumption.",
          "optional": false,
          "abstract": "Sparse Autoencoders (SAEs) aim to decompose the activation space of large language models (LLMs) into human-interpretable latent directions or features. As we increase the number of features in the SAE, hierarchical features tend to split into finer features (“math” may split into “algebra”, “geometry”, etc.), a phenomenon referred to as feature splitting. However, we show that sparse decomposition and splitting of hierarchical features is not robust. Specifically, we show that seemingly monosemantic features fail to fire where they should, and instead get “absorbed” into their children features. We coin this phenomenon feature absorption, and show that it is caused by optimizing for sparsity in SAEs whenever the underlying features form a hierarchy. We introduce a metric to detect absorption in SAEs, and validate our findings empirically on hundreds of LLM SAEs. Our investigation suggests that varying SAE sizes or sparsity is insufficient to solve this issue. We discuss the implications of feature absorption in SAEs and some potential approaches to solve the fundamental theoretical issues before SAEs can be used for interpreting LLMs robustly and at scale. 1",
          "pages": 31,
          "pdfPath": "RAW/2409.14507v6.pdf",
          "teach": {
            "whyWeRead": "Defines feature splitting and absorption — core SAE failure modes.",
            "oneSentence": "Studies how SAE features split concepts across latents or absorb related concepts into one latent.",
            "plainLanguage": "Splitting: one concept distributed across several features. Absorption: one feature captures several related concepts (often hierarchical or correlated).\n\nBoth break the naive hope that each latent is one atomic concept. Any SetConCA claim about concept recovery must measure these.",
            "keyIdeas": [
              {
                "title": "Feature splitting",
                "original": "A single concept is distributed across multiple SAE latents.",
                "simple": "One idea, many fragments.",
                "explain": "A single concept is distributed across multiple SAE latents."
              },
              {
                "title": "Feature absorption",
                "original": "One latent absorbs several related concepts (often correlated/hierarchical).",
                "simple": "One feature eats a whole family of related ideas.",
                "explain": "One latent absorbs several related concepts (often correlated/hierarchical)."
              },
              {
                "title": "Measurement methods",
                "original": "Track how known concepts map onto learned latents to quantify these failures.",
                "simple": "You need maps from concepts→features, not vibes.",
                "explain": "Track how known concepts map onto learned latents to quantify these failures."
              }
            ],
            "simplifiedMath": [],
            "vocabulary": [
              {
                "term": "Absorption",
                "original": "Technical term: «Absorption» as used in this literature.",
                "simple": "One feature eating multiple related concepts.",
                "def": "One feature eating multiple related concepts."
              },
              {
                "term": "Splitting",
                "original": "Technical term: «Splitting» as used in this literature.",
                "simple": "One concept spread over multiple features.",
                "def": "One concept spread over multiple features."
              }
            ],
            "whatItShows": [
              "Systematic failure modes of SAE feature = concept"
            ],
            "whatItDoesNotShow": [
              "That multi-view automatically fixes them"
            ],
            "setconcaUse": [
              "Primary failure modes to beat with multi-view supervision — if you can demonstrate it."
            ],
            "masteryChecklist": [
              "I can define splitting vs absorption with examples."
            ],
            "commonConfusions": [
              {
                "wrong": "More sparsity prevents absorption always.",
                "right": "Correlated concepts can still merge, especially in narrow dictionaries."
              }
            ],
            "quiz": [
              {
                "q": "Absorption means?",
                "options": [
                  "One feature captures several related concepts",
                  "No features fire",
                  "Only PCA",
                  "Only CKA"
                ],
                "a": 0,
                "explain": "Merged concepts."
              }
            ],
            "originalIdea": "Studies how SAE features split concepts across latents or absorb related concepts into one latent.",
            "simpleLesson": "Splitting: one concept distributed across several features. Absorption: one feature captures several related concepts (often hierarchical or correlated).\n\nBoth break the naive hope that each latent is one atomic concept. Any SetConCA claim about concept recovery must measure these.",
            "limitPairs": [
              {
                "original": "Systematic failure modes of SAE feature = concept",
                "simple": "In practice this means evidence supports: Systematic failure modes of SAE feature = concept"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That multi-view automatically fixes them",
                "simple": "Do not overclaim: That multi-view automatically fixes them"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Primary failure modes to beat with multi-view supervision — if you can demonstrate it.",
                "simple": "Action item: Primary failure modes to beat with multi-view supervision — if you can demonstrate it."
              }
            ]
          },
          "quiz": [
            {
              "q": "Absorption means?",
              "options": [
                "One feature captures several related concepts",
                "No features fire",
                "Only PCA",
                "Only CKA"
              ],
              "a": 0,
              "explain": "Merged concepts."
            }
          ]
        },
        {
          "id": "non-canonical",
          "num": 34,
          "title": "Sparse Autoencoders Do Not Find Canonical Units of Analysis",
          "authors": "Leask et al.",
          "file": "2502.04878v1.pdf",
          "learn": [
            "Different decompositions at same quality",
            "Stitching and higher-level analysis"
          ],
          "setconca": "Critical for SetConCA research narrative.",
          "optional": false,
          "abstract": "A common goal of mechanistic interpretability is to decompose the activations of neural networks into features: interpretable properties of the input computed by the model. Sparse autoencoders (SAEs) are a popular method for finding these features in LLMs, and it has been postulated that they can be used to find a canon- ical set of units: a unique and complete list of atomic features. We cast doubt on this belief using two novel techniques: SAE stitching to show they are in- complete, and meta-SAEs to show they are not atomic. SAE stitching involves inserting or swapping latents from a larger SAE into a smaller one. Latents from the larger SAE can be divided into two categories: novel latents, which improve performance when added to the smaller SAE, indicating they capture novel in- formation, and reconstruction latents, which can replace corresponding latents in the smaller SAE that have similar behavior. The existence of novel features in- dicates incompleteness of smaller SAEs. Using meta-SAEs - SAEs trained on the decoder matrix of another SAE - we find that latents in SAEs often decom- pose into combinations of latents from a smaller SAE, showing that larger SAE latents are n",
          "pages": 23,
          "pdfPath": "RAW/2502.04878v1.pdf",
          "teach": {
            "whyWeRead": "Critical narrative paper: SAEs need not find unique units of analysis.",
            "oneSentence": "Argues different SAEs can yield different decompositions while all looking reasonable; studies stitching and higher-level structure.",
            "plainLanguage": "If two SAEs both reconstruct well and look interpretable but disagree on features, there is no single canonical sparse basis. This undermines 'we found the true features' rhetoric.\n\nStitching analyses and higher-level structure become important. For SetConCA: aim for stability and causal usefulness under stated assumptions — not metaphysical uniqueness.",
            "keyIdeas": [
              {
                "title": "Non-uniqueness",
                "original": "Different SAEs can achieve similar quality with different decompositions.",
                "simple": "Many ‘good’ dictionaries can disagree.",
                "explain": "Different SAEs can achieve similar quality with different decompositions."
              },
              {
                "title": "Stitching",
                "original": "Relate features across dictionaries via stitching/alignment analyses.",
                "simple": "Translate between two SAE ‘languages.’",
                "explain": "Relate features across dictionaries via stitching/alignment analyses."
              },
              {
                "title": "Units of analysis",
                "original": "Treating SAE latents as unique natural atoms is often unjustified.",
                "simple": "Atomic units may be a convenience, not nature’s labels.",
                "explain": "Treating SAE latents as unique natural atoms is often unjustified."
              }
            ],
            "simplifiedMath": [],
            "vocabulary": [
              {
                "term": "Canonical decomposition",
                "original": "Technical term: «Canonical decomposition» as used in this literature.",
                "simple": "A unique privileged feature basis — often unavailable.",
                "def": "A unique privileged feature basis — often unavailable."
              },
              {
                "term": "Stitching",
                "original": "Technical term: «Stitching» as used in this literature.",
                "simple": "Mapping/aligning features between dictionaries.",
                "def": "Mapping/aligning features between dictionaries."
              }
            ],
            "whatItShows": [
              "Reasonable SAEs need not agree"
            ],
            "whatItDoesNotShow": [
              "That interpretability is impossible"
            ],
            "setconcaUse": [
              "Frame contributions as stability/completeness/causal utility under assumptions.",
              "Cross-seed and cross-architecture agreement tests."
            ],
            "masteryChecklist": [
              "I can explain non-canonical decompositions.",
              "I avoid 'the true features' claims."
            ],
            "commonConfusions": [
              {
                "wrong": "Disagreement means SAEs are useless.",
                "right": "Means uniqueness fails; usefulness can remain."
              }
            ],
            "quiz": [
              {
                "q": "Non-canonical means?",
                "options": [
                  "Different good SAEs can disagree on features",
                  "SAEs never reconstruct",
                  "Probes always fail",
                  "CCA is impossible"
                ],
                "a": 0,
                "explain": "No unique units."
              }
            ],
            "originalIdea": "Argues different SAEs can yield different decompositions while all looking reasonable; studies stitching and higher-level structure.",
            "simpleLesson": "If two SAEs both reconstruct well and look interpretable but disagree on features, there is no single canonical sparse basis. This undermines 'we found the true features' rhetoric.\n\nStitching analyses and higher-level structure become important. For SetConCA: aim for stability and causal usefulness under stated assumptions — not metaphysical uniqueness.",
            "limitPairs": [
              {
                "original": "Reasonable SAEs need not agree",
                "simple": "In practice this means evidence supports: Reasonable SAEs need not agree"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That interpretability is impossible",
                "simple": "Do not overclaim: That interpretability is impossible"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Frame contributions as stability/completeness/causal utility under assumptions.",
                "simple": "Action item: Frame contributions as stability/completeness/causal utility under assumptions."
              },
              {
                "original": "Cross-seed and cross-architecture agreement tests.",
                "simple": "Action item: Cross-seed and cross-architecture agreement tests."
              }
            ]
          },
          "quiz": [
            {
              "q": "Non-canonical means?",
              "options": [
                "Different good SAEs can disagree on features",
                "SAEs never reconstruct",
                "Probes always fail",
                "CCA is impossible"
              ],
              "a": 0,
              "explain": "No unique units."
            }
          ]
        },
        {
          "id": "saebench",
          "num": 35,
          "title": "SAEBench: A Comprehensive Benchmark for Sparse Autoencoders",
          "authors": "Karvonen et al.",
          "file": "2503.09532v4.pdf",
          "learn": [
            "Multiple evaluation families",
            "Feature detection, steering, reconstruction",
            "Proxy metrics vs downstream usefulness"
          ],
          "setconca": "Standard evaluation suite to replicate.",
          "optional": false,
          "abstract": "Sparse autoencoders (SAEs) are a popular tech- nique for interpreting language model activations, and there is extensive recent work on improving SAE effectiveness. However, most prior work evaluates progress using unsupervised proxy met- rics with unclear practical relevance. We in- troduce SAEBench, a comprehensive evaluation suite that measures SAE performance across eight diverse metrics, spanning interpretability, feature disentanglement and practical applications like unlearning. To enable systematic comparison, we open-source a suite of over 200 SAEs across seven recently proposed SAE architectures and training algorithms. Our evaluation reveals that gains on proxy metrics do not reliably translate to better practical performance. For instance, while Matryoshka SAEs slightly underperform on ex- isting proxy metrics, they substantially outper- form other architectures on feature disentangle- ment metrics; moreover, this advantage grows with SAE scale. By providing a standardized framework for measuring progress in SAE de- velopment, SAEBench enables researchers to study scaling trends and make nuanced compar- isons between different SAE architectures and training methodologie",
          "pages": 42,
          "pdfPath": "RAW/2503.09532v4.pdf",
          "teach": {
            "whyWeRead": "Standard multi-family benchmark suite you should know and partially replicate.",
            "oneSentence": "A comprehensive benchmark covering detection, probing, steering, reconstruction, and more for SAEs.",
            "plainLanguage": "SAEBench gathers multiple evaluation families so progress is not judged by one proxy. Feature detection, sparse probing, steering/interventions, and reconstruction/sparsity all appear.\n\nProxy metrics do not always predict downstream usefulness — another reason for a suite.",
            "keyIdeas": [
              {
                "title": "Multiple families",
                "original": "SAEBench aggregates detection, probing, steering, reconstruction, and related suites.",
                "simple": "One leaderboard score is not enough — use a battery of tests.",
                "explain": "SAEBench aggregates detection, probing, steering, reconstruction, and related suites."
              },
              {
                "title": "Sparse probing / detection",
                "original": "Tests whether known concepts are sparsely decodable/detectable.",
                "simple": "Can we find a concept with few features?",
                "explain": "Tests whether known concepts are sparsely decodable/detectable."
              },
              {
                "title": "Steering",
                "original": "Tests whether feature edits control behaviour.",
                "simple": "Push a feature and see if behaviour follows.",
                "explain": "Tests whether feature edits control behaviour."
              },
              {
                "title": "Proxy vs downstream",
                "original": "Proxy wins do not always predict downstream usefulness.",
                "simple": "A pretty proxy can fail the real job.",
                "explain": "Proxy wins do not always predict downstream usefulness."
              }
            ],
            "simplifiedMath": [],
            "vocabulary": [
              {
                "term": "SAEBench",
                "original": "Technical term: «SAEBench» as used in this literature.",
                "simple": "Benchmark suite for sparse autoencoders.",
                "def": "Benchmark suite for sparse autoencoders."
              }
            ],
            "whatItShows": [
              "A practical evaluation menu for SAE methods"
            ],
            "whatItDoesNotShow": [
              "That every metric is perfectly reliable (see next paper)"
            ],
            "setconcaUse": [
              "Adopt a subset of SAEBench families in your protocol."
            ],
            "masteryChecklist": [
              "I can name several SAEBench evaluation families."
            ],
            "commonConfusions": [
              {
                "wrong": "Winning one SAEBench metric wins interpretability.",
                "right": "Look across families."
              }
            ],
            "quiz": [
              {
                "q": "SAEBench's point is?",
                "options": [
                  "Multiple evaluation families",
                  "Only FVU",
                  "Only width",
                  "Only speed"
                ],
                "a": 0,
                "explain": "Broad suite."
              }
            ],
            "originalIdea": "A comprehensive benchmark covering detection, probing, steering, reconstruction, and more for SAEs.",
            "simpleLesson": "SAEBench gathers multiple evaluation families so progress is not judged by one proxy. Feature detection, sparse probing, steering/interventions, and reconstruction/sparsity all appear.\n\nProxy metrics do not always predict downstream usefulness — another reason for a suite.",
            "limitPairs": [
              {
                "original": "A practical evaluation menu for SAE methods",
                "simple": "In practice this means evidence supports: A practical evaluation menu for SAE methods"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That every metric is perfectly reliable (see next paper)",
                "simple": "Do not overclaim: That every metric is perfectly reliable (see next paper)"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Adopt a subset of SAEBench families in your protocol.",
                "simple": "Action item: Adopt a subset of SAEBench families in your protocol."
              }
            ]
          },
          "quiz": [
            {
              "q": "SAEBench's point is?",
              "options": [
                "Multiple evaluation families",
                "Only FVU",
                "Only width",
                "Only speed"
              ],
              "a": 0,
              "explain": "Broad suite."
            }
          ]
        },
        {
          "id": "bench-reliable",
          "num": 36,
          "title": "Are Sparse Autoencoder Benchmarks Reliable?",
          "authors": "Chanin",
          "file": "2605.18229v1.pdf",
          "learn": [
            "Auditing SAEBench assumptions",
            "Reseed noise and ground-truth correlation"
          ],
          "setconca": "Read after SAEBench — calibrate metric trust.",
          "optional": false,
          "abstract": "Sparse autoencoders (SAEs) are a core interpretability tool for large language models, and progress on SAE architectures depends on benchmarks that reliably distinguish better SAEs from worse ones. We audit the SAE quality metrics in SAEBench, the de-facto standard SAE evaluation suite, through three complemen- tary lenses: reseed noise on a fixed SAE, ground-truth correlation on synthetic SAEs, and discriminability across training trajectories. We find that two of these metrics, Targeted Probe Perturbation (TPP) and Spurious Correlation Removal (SCR), fail multiple lenses at their canonical settings and should not be used to eval- uate SAEs. The other metrics show higher reseed noise and lower discriminability than the field assumes. The sae-probes variant of k-sparse probing is the most reliable metric we tested, but even sae-probes struggles to separate variants of the same SAE architecture. Our results show the field needs better SAE benchmarks. 1",
          "pages": 32,
          "pdfPath": "RAW/2605.18229v1.pdf",
          "teach": {
            "whyWeRead": "Audits SAEBench-style metrics — read after SAEBench to calibrate trust.",
            "oneSentence": "Finds some SAE evaluation signals are less reliable than assumed (noise, weak ground-truth correlation).",
            "plainLanguage": "Even standard benchmarks can be noisy across reseeds or poorly correlated with ground truth in synthetic settings. This paper audits metric reliability so you do not overfit a flaky leaderboard.\n\nPractice: report uncertainty, multiple seeds, and treat weak metrics as weak evidence.",
            "keyIdeas": [
              {
                "title": "Reseed noise",
                "original": "Some metrics vary substantially across random seeds.",
                "simple": "Run again — did the ranking survive?",
                "explain": "Some metrics vary substantially across random seeds."
              },
              {
                "title": "Ground-truth correlation",
                "original": "Synthetic audits check whether scores track known truth.",
                "simple": "If a metric can’t follow ground truth in toys, distrust it in the wild.",
                "explain": "Synthetic audits check whether scores track known truth."
              },
              {
                "title": "Calibrated trust",
                "original": "Treat benchmark scores as instruments with error bars, not oracles.",
                "simple": "Instruments can be noisy; report uncertainty.",
                "explain": "Treat benchmark scores as instruments with error bars, not oracles."
              }
            ],
            "simplifiedMath": [],
            "vocabulary": [
              {
                "term": "Metric reliability",
                "original": "Technical term: «Metric reliability» as used in this literature.",
                "simple": "Stability and validity of an evaluation score.",
                "def": "Stability and validity of an evaluation score."
              }
            ],
            "whatItShows": [
              "Some popular SAE metrics are fragile"
            ],
            "whatItDoesNotShow": [
              "That evaluation is hopeless"
            ],
            "setconcaUse": [
              "Multi-seed reporting; avoid single-run leaderboard chasing."
            ],
            "masteryChecklist": [
              "I read SAEBench before this and know why order matters.",
              "I report uncertainty."
            ],
            "commonConfusions": [
              {
                "wrong": "Benchmarks are ground truth.",
                "right": "They are instruments with error bars."
              }
            ],
            "quiz": [
              {
                "q": "Read this paper?",
                "options": [
                  "After SAEBench",
                  "Before learning PCA",
                  "Instead of all evals",
                  "Never"
                ],
                "a": 0,
                "explain": "Calibrate after knowing the suite."
              }
            ],
            "originalIdea": "Finds some SAE evaluation signals are less reliable than assumed (noise, weak ground-truth correlation).",
            "simpleLesson": "Even standard benchmarks can be noisy across reseeds or poorly correlated with ground truth in synthetic settings. This paper audits metric reliability so you do not overfit a flaky leaderboard.\n\nPractice: report uncertainty, multiple seeds, and treat weak metrics as weak evidence.",
            "limitPairs": [
              {
                "original": "Some popular SAE metrics are fragile",
                "simple": "In practice this means evidence supports: Some popular SAE metrics are fragile"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That evaluation is hopeless",
                "simple": "Do not overclaim: That evaluation is hopeless"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Multi-seed reporting; avoid single-run leaderboard chasing.",
                "simple": "Action item: Multi-seed reporting; avoid single-run leaderboard chasing."
              }
            ]
          },
          "quiz": [
            {
              "q": "Read this paper?",
              "options": [
                "After SAEBench",
                "Before learning PCA",
                "Instead of all evals",
                "Never"
              ],
              "a": 0,
              "explain": "Calibrate after knowing the suite."
            }
          ]
        },
        {
          "id": "feature-hedging",
          "num": null,
          "title": "Feature Hedging: Correlated Features Break Narrow Sparse Autoencoders",
          "authors": "Chanin et al.",
          "file": "2505.11756v2.pdf",
          "learn": [
            "Correlated concepts merge in narrow dictionaries"
          ],
          "setconca": "Optional: dictionary width requirements.",
          "optional": true,
          "abstract": "It is assumed that sparse autoencoders (SAEs) decompose polysemantic activa- tions into interpretable linear directions, as long as the activations are composed of sparse linear combinations of underlying features. However, we find that if an SAE is more narrow than the number of underlying “true features” on which it is trained, and there is correlation between features, the SAE will merge compo- nents of correlated features together, thus destroying monosemanticity. In LLM SAEs, these two conditions are almost certainly true. This phenomenon, which we call feature hedging, is caused by SAE reconstruction loss, and is more severe the narrower the SAE. In this work, we introduce the problem of feature hedg- ing and study it both theoretically in toy models and empirically in SAEs trained on LLMs. We suspect that feature hedging may be one of the core reasons that SAEs consistently underperform supervised baselines. Finally, we use our under- standing of feature hedging to propose an improved variant of matryoshka SAEs. Importantly, our work shows that SAE width is not a neutral hyperparameter: nar- rower SAEs suffer more from hedging than wider SAEs. 1",
          "pages": 21,
          "pdfPath": "RAW/2505.11756v2.pdf",
          "teach": {
            "whyWeRead": "Optional: correlated features break narrow SAEs — motivates width and multi-view disambiguation.",
            "oneSentence": "Shows correlated features cause problems for narrow sparse autoencoders (feature hedging).",
            "plainLanguage": "When concepts co-occur, a narrow dictionary may hedge by merging or misallocating features. Width and better supervision can help.\n\nConnects to absorption and to why multi-view signal might disambiguate correlated concepts.",
            "keyIdeas": [
              {
                "title": "Correlation stress test",
                "original": "Correlated co-occurring features create degenerate SAE solutions.",
                "simple": "When concepts always appear together, dictionaries get confused.",
                "explain": "Correlated co-occurring features create degenerate SAE solutions."
              },
              {
                "title": "Narrow dictionaries fail first",
                "original": "Insufficient width worsens hedging/merging under correlation.",
                "simple": "A tiny menu cannot separate clingy concepts.",
                "explain": "Insufficient width worsens hedging/merging under correlation."
              }
            ],
            "simplifiedMath": [],
            "vocabulary": [
              {
                "term": "Feature hedging",
                "original": "Technical term: «Feature hedging» as used in this literature.",
                "simple": "Degenerate solutions under correlated features in narrow SAEs.",
                "def": "Degenerate solutions under correlated features in narrow SAEs."
              }
            ],
            "whatItShows": [
              "Correlated features specifically break narrow SAEs"
            ],
            "whatItDoesNotShow": [
              "Full fix via multi-view without experiments"
            ],
            "setconcaUse": [
              "Motivation for multi-view disambiguation experiments."
            ],
            "masteryChecklist": [
              "I can link correlation → merging/hedging."
            ],
            "commonConfusions": [
              {
                "wrong": "Sparsity alone separates correlated concepts.",
                "right": "Correlation can still force merges."
              }
            ],
            "quiz": [
              {
                "q": "Narrow SAEs struggle especially with?",
                "options": [
                  "Correlated features",
                  "Unit batch size only",
                  "CPU only",
                  "PNG images only"
                ],
                "a": 0,
                "explain": "Correlation stress."
              }
            ],
            "originalIdea": "Shows correlated features cause problems for narrow sparse autoencoders (feature hedging).",
            "simpleLesson": "When concepts co-occur, a narrow dictionary may hedge by merging or misallocating features. Width and better supervision can help.\n\nConnects to absorption and to why multi-view signal might disambiguate correlated concepts.",
            "limitPairs": [
              {
                "original": "Correlated features specifically break narrow SAEs",
                "simple": "In practice this means evidence supports: Correlated features specifically break narrow SAEs"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "Full fix via multi-view without experiments",
                "simple": "Do not overclaim: Full fix via multi-view without experiments"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Motivation for multi-view disambiguation experiments.",
                "simple": "Action item: Motivation for multi-view disambiguation experiments."
              }
            ]
          },
          "quiz": [
            {
              "q": "Narrow SAEs struggle especially with?",
              "options": [
                "Correlated features",
                "Unit batch size only",
                "CPU only",
                "PNG images only"
              ],
              "a": 0,
              "explain": "Correlation stress."
            }
          ]
        },
        {
          "id": "geometric-wall",
          "num": null,
          "title": "The Geometric Wall: Manifold Structure Predicts Layerwise SAE Scaling Laws",
          "authors": "Zaher et al.",
          "file": "2605.09887v1.pdf",
          "learn": [
            "Intrinsic activation geometry limits SAE scaling"
          ],
          "setconca": "Optional: layer-wise scaling constraints.",
          "optional": true,
          "abstract": "Sparse autoencoders (SAEs) operationalise the linear representation hypothesis: they reconstruct model activations as sparse linear combinations of interpretable dictionary atoms, on the implicit assumption that activation space is well approx- imated by a globally linear structure. Their reconstruction error varies sharply across layers in ways that existing scaling laws, fitted at single layers, do not explain. We argue that this variation is the empirical trace of a geometric mis- match: where the activation manifold is curved and its intrinsic dimension varies across layers, no sparse linear dictionary can match it uniformly, and the SAE’s width-sparsity scaling becomes a layer-dependent function of manifold structure rather than a single universal law. We conduct the first cross-layer SAE scaling study, fitting and regressing on 844 residual-stream Gemma Scope SAE check- points across 68 layers of Gemma 2 2B and 9B. Stage 1 fits a per-layer scaling-law surface; Stage 2 regresses the fitted parameters and the derived per-layer width exponents on four layerwise geometric summaries. We find that manifold ge- ometry predicts the per-layer width exponent in both models, and that th",
          "pages": 27,
          "pdfPath": "RAW/2605.09887v1.pdf",
          "teach": {
            "whyWeRead": "Optional: intrinsic geometry of activations predicts SAE scaling limits by layer.",
            "oneSentence": "Links manifold structure of activations to layerwise SAE scaling laws — a geometric wall.",
            "plainLanguage": "Not all layers are equally easy for SAEs. Intrinsic geometric structure can bound how dictionaries scale. Useful when choosing layers/sites for SetConCA views.",
            "keyIdeas": [
              {
                "title": "Layerwise difficulty",
                "original": "Activation manifold geometry varies by layer and changes SAE difficulty.",
                "simple": "Some layers are geometrically harder for dictionaries.",
                "explain": "Activation manifold geometry varies by layer and changes SAE difficulty."
              },
              {
                "title": "Scaling limits",
                "original": "Intrinsic geometry predicts limits on productive dictionary scaling.",
                "simple": "You can hit a wall where adding width helps less than you hope.",
                "explain": "Intrinsic geometry predicts limits on productive dictionary scaling."
              }
            ],
            "simplifiedMath": [],
            "vocabulary": [
              {
                "term": "Geometric wall",
                "original": "Technical term: «Geometric wall» as used in this literature.",
                "simple": "Geometry-imposed limit on SAE scaling.",
                "def": "Geometry-imposed limit on SAE scaling."
              }
            ],
            "whatItShows": [
              "Activation geometry predicts SAE scaling behaviour"
            ],
            "whatItDoesNotShow": [
              "Exact SetConCA architecture"
            ],
            "setconcaUse": [
              "Choose view sites with geometry in mind."
            ],
            "masteryChecklist": [
              "I know layer choice is geometric, not arbitrary."
            ],
            "commonConfusions": [
              {
                "wrong": "All layers need the same SAE width.",
                "right": "Geometry differs by layer."
              }
            ],
            "quiz": [
              {
                "q": "Geometric wall relates to?",
                "options": [
                  "Manifold structure limiting SAE scaling",
                  "Only HTTP hosting",
                  "Only PDF fonts",
                  "Only dropout"
                ],
                "a": 0,
                "explain": "Geometry → scaling."
              }
            ],
            "originalIdea": "Links manifold structure of activations to layerwise SAE scaling laws — a geometric wall.",
            "simpleLesson": "Not all layers are equally easy for SAEs. Intrinsic geometric structure can bound how dictionaries scale. Useful when choosing layers/sites for SetConCA views.",
            "limitPairs": [
              {
                "original": "Activation geometry predicts SAE scaling behaviour",
                "simple": "In practice this means evidence supports: Activation geometry predicts SAE scaling behaviour"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "Exact SetConCA architecture",
                "simple": "Do not overclaim: Exact SetConCA architecture"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Choose view sites with geometry in mind.",
                "simple": "Action item: Choose view sites with geometry in mind."
              }
            ]
          },
          "quiz": [
            {
              "q": "Geometric wall relates to?",
              "options": [
                "Manifold structure limiting SAE scaling",
                "Only HTTP hosting",
                "Only PDF fonts",
                "Only dropout"
              ],
              "a": 0,
              "explain": "Geometry → scaling."
            }
          ]
        }
      ],
      "primer": {
        "title": "SAE evaluation and failure modes",
        "mission": "Design an honest evaluation protocol before proposing new methods.",
        "beforeYouStart": "Levels 6–8.",
        "primer": "Reconstruction and sparsity are necessary but not sufficient.\n\nFeature splitting: one concept spreads across many SAE features. Feature absorption: one feature swallows related concepts. Non-canonical: different SAEs can all look good while finding different decompositions.\n\nSAEBench provides multiple evaluation families. Are SAE Benchmarks Reliable? warns that some signals are noisy — read it after SAEBench, not before.\n\nA strong SetConCA paper needs complementary tests, not one leaderboard score.",
        "bigPictureDiagram": [
          "proxy metrics ≠ downstream usefulness",
          "splitting / absorption / seed instability / non-canonical"
        ],
        "conceptsToMaster": [
          {
            "name": "Absorption / splitting",
            "simple": "Wrong granularity of features.",
            "deeper": "Challenges 'one latent = one atomic concept'."
          },
          {
            "name": "Canonical units",
            "simple": "Unique true decomposition.",
            "deeper": "Evidence suggests SAEs do not find unique units of analysis."
          }
        ],
        "checkpoint": {
          "goal": "Write your evaluation protocol.",
          "steps": [
            "List metrics",
            "For each: supports / does not establish",
            "Add seed + stitching checks"
          ],
          "successLooksLike": "Protocol rejects claims based on FVU alone."
        },
        "bridgeToNext": "Level 10 papers sit next to SetConCA."
      }
    },
    {
      "id": 10,
      "title": "Papers closest to SetConCA research",
      "weeks": "16",
      "checkpoint": "Write 3 research hypotheses: one assumption to challenge, one experiment to reproduce, one SetConCA extension.",
      "central_question": "Under what assumptions does multi-view supervision cause a sparse dictionary to recover more stable, complete, specific, or causally useful concepts than a pointwise SAE?",
      "papers": [
        {
          "id": "temporal-sae",
          "num": 37,
          "title": "Temporal Sparse Autoencoders",
          "authors": "Bhalla et al.",
          "file": "2511.05541v2.pdf",
          "learn": [
            "Temporal coordination between adjacent tokens",
            "Contrastive regularisation on SAE codes",
            "Sparsity vs temporal consistency"
          ],
          "setconca": "SetConCA generalises from temporal pairs to multi-view semantic objects.",
          "optional": false,
          "abstract": "Translating the internal representations and computations of models into concepts that humans can understand is a key goal of interpretability. While recent dic- tionary learning methods such as Sparse Autoencoders (SAEs) provide a promis- ing route to discover human-interpretable features, they often only recover token- specific, noisy, or highly local concepts. We argue that this limitation stems from neglecting the temporal structure of language, where semantic content typically evolves smoothly over sequences. Building on this insight, we introduce Tempo- ral Sparse Autoencoders (T-SAEs), which incorporate a novel contrastive loss en- couraging consistent activations of high-level features over adjacent tokens. This simple yet powerful modification enables SAEs to disentangle semantic from syn- tactic features in a self-supervised manner. Across multiple datasets and models, T-SAEs recover smoother, more coherent semantic concepts without sacrificing reconstruction quality. Strikingly, they exhibit clear semantic structure despite being trained without explicit semantic signal, offering a new pathway for unsu- pervised interpretability in language models. 1",
          "pages": 29,
          "pdfPath": "RAW/2511.05541v2.pdf",
          "teach": {
            "whyWeRead": "Closest empirical ancestor: coordinates SAE codes across related activations (adjacent tokens).",
            "oneSentence": "Adds temporal/contrastive coordination between adjacent-token SAE representations for interpretability.",
            "plainLanguage": "Temporal SAEs use the sequential structure of language: nearby tokens provide related pairs for coordinating sparse codes. Study carefully what counts as a related pair, where the contrastive term applies, and how sparsity interacts with consistency.\n\nSetConCA generalises: replace 'adjacent tokens' with 'multiple views of the same semantic object'. Ablate whether gains are semantic consistency or mere local similarity.",
            "keyIdeas": [
              {
                "title": "Related pairs from sequence",
                "original": "Adjacent-token activations provide natural positive pairs for coordination.",
                "simple": "Nearby words give free ‘same context’ pairs.",
                "explain": "Adjacent-token activations provide natural positive pairs for coordination."
              },
              {
                "title": "Contrastive regularisation on codes",
                "original": "Sparse codes are pulled together for related tokens while preserving SAE structure.",
                "simple": "Make related SAE codes agree — without destroying sparsity.",
                "explain": "Sparse codes are pulled together for related tokens while preserving SAE structure."
              },
              {
                "title": "Sparsity interaction",
                "original": "Alignment terms can fight sparsity/fidelity unless carefully weighted.",
                "simple": "Too much ‘agree with neighbour’ can ruin the dictionary.",
                "explain": "Alignment terms can fight sparsity/fidelity unless carefully weighted."
              },
              {
                "title": "Baseline isolation",
                "original": "Ablate to show gains are not just local similarity hacks.",
                "simple": "Prove it is semantic consistency, not ‘nearby vectors are close.’",
                "explain": "Ablate to show gains are not just local similarity hacks."
              }
            ],
            "simplifiedMath": [],
            "vocabulary": [
              {
                "term": "Temporal SAE",
                "original": "Technical term: «Temporal SAE» as used in this literature.",
                "simple": "SAE trained with temporal coordination between token activations.",
                "def": "SAE trained with temporal coordination between token activations."
              }
            ],
            "whatItShows": [
              "Extra structure across related activations can help SAE interpretability goals"
            ],
            "whatItDoesNotShow": [
              "That multi-view sets automatically inherit all gains"
            ],
            "setconcaUse": [
              "Direct template: change pair definition from time to multi-view sets.",
              "Replicate their ablation philosophy."
            ],
            "masteryChecklist": [
              "I can state how SetConCA generalises Temporal SAE.",
              "I know which ablations isolate semantic vs local similarity."
            ],
            "commonConfusions": [
              {
                "wrong": "Temporal SAE already is SetConCA.",
                "right": "SetConCA generalises the related-pair notion to multi-view sets."
              }
            ],
            "quiz": [
              {
                "q": "SetConCA generalises Temporal SAE by using?",
                "options": [
                  "Multi-view semantic objects instead of only adjacent tokens",
                  "Only PCA",
                  "Only deeper MLPs",
                  "Removing sparsity"
                ],
                "a": 0,
                "explain": "Same idea, broader positives."
              }
            ],
            "originalIdea": "Adds temporal/contrastive coordination between adjacent-token SAE representations for interpretability.",
            "simpleLesson": "Temporal SAEs use the sequential structure of language: nearby tokens provide related pairs for coordinating sparse codes. Study carefully what counts as a related pair, where the contrastive term applies, and how sparsity interacts with consistency.\n\nSetConCA generalises: replace 'adjacent tokens' with 'multiple views of the same semantic object'. Ablate whether gains are semantic consistency or mere local similarity.",
            "limitPairs": [
              {
                "original": "Extra structure across related activations can help SAE interpretability goals",
                "simple": "In practice this means evidence supports: Extra structure across related activations can help SAE interpretability goals"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That multi-view sets automatically inherit all gains",
                "simple": "Do not overclaim: That multi-view sets automatically inherit all gains"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Direct template: change pair definition from time to multi-view sets.",
                "simple": "Action item: Direct template: change pair definition from time to multi-view sets."
              },
              {
                "original": "Replicate their ablation philosophy.",
                "simple": "Action item: Replicate their ablation philosophy."
              }
            ]
          },
          "quiz": [
            {
              "q": "SetConCA generalises Temporal SAE by using?",
              "options": [
                "Multi-view semantic objects instead of only adjacent tokens",
                "Only PCA",
                "Only deeper MLPs",
                "Removing sparsity"
              ],
              "a": 0,
              "explain": "Same idea, broader positives."
            }
          ]
        },
        {
          "id": "conca",
          "num": 38,
          "title": "Concept Component Analysis",
          "authors": "Liu et al.",
          "file": "2601.20420v2.pdf",
          "learn": [
            "Generative process for concept components",
            "Log-posterior representation",
            "Identifiability and linear unmixing"
          ],
          "setconca": "Alternative decomposition framework — direct competitor/complement.",
          "optional": false,
          "abstract": "Developing human understandable interpretation of large language models (LLMs) becomes in- creasingly critical for their deployment in essen- tial domains. Mechanistic interpretability seeks to mitigate the issues through extracts human- interpretable process and concepts from LLMs’ activations. Sparse autoencoders (SAEs) have emerged as a popular approach for extracting in- terpretable and monosemantic concepts by decom- posing the LLM internal representations into a dic- tionary. Despite their empirical progress, SAEs suffer from a fundamental theoretical ambiguity: the well-defined correspondence between LLM representations and human-interpretable concepts remains unclear. This lack of theoretical ground- ing gives rise to several methodological chal- lenges, including difficulties in principled method design and evaluation criteria. In this work, we show that, under mild assumptions, LLM repre- sentations can be approximated as a linear mix- ture of the log-posteriors over concepts given the input context, through the lens of a latent vari- able model where concepts are treated as latent variables. This motivates a principled framework for concept extraction, namely Concept Com",
          "pages": 36,
          "pdfPath": "RAW/2601.20420v2.pdf",
          "teach": {
            "whyWeRead": "Alternative concept extraction via linear unmixing and identifiability — competitor/complement to SAEs.",
            "oneSentence": "Concept Component Analysis extracts concepts via a principled linear mixture / unmixing approach.",
            "plainLanguage": "ConCA posits a generative process where activations are mixtures of concept components, then recovers components under assumptions (closer to ICA than to pure reconstruction dictionaries).\n\nFocus on: assumed generative process, log-posterior representation, identifiability, and how component recovery differs from learning a sparse reconstruction dictionary.\n\nFor SetConCA positioning: you may combine sparse dictionaries with multi-view constraints while acknowledging ConCA's unmixing story.",
            "keyIdeas": [
              {
                "title": "Generative mixture story",
                "original": "Activations are treated as mixtures of latent concept components under an explicit generative model.",
                "simple": "Assume concepts mix into activations like ingredients into a recipe.",
                "explain": "Activations are treated as mixtures of latent concept components under an explicit generative model."
              },
              {
                "title": "Unmixing / components",
                "original": "Recover concept components via an unmixing/inference procedure rather than only sparse reconstruction.",
                "simple": "Separate the ingredients — don’t only rebuild the soup.",
                "explain": "Recover concept components via an unmixing/inference procedure rather than only sparse reconstruction."
              },
              {
                "title": "Identifiability",
                "original": "Component recovery claims require assumptions that make solutions unique (up to allowed transforms).",
                "simple": "Without assumptions, many ingredient lists can taste the same.",
                "explain": "Component recovery claims require assumptions that make solutions unique (up to allowed transforms)."
              },
              {
                "title": "Vs SAE dictionaries",
                "original": "ConCA’s unmixing story differs from SAE reconstruction+sparsity dictionaries.",
                "simple": "Different contract: unmix concepts vs sparsely rebuild activations.",
                "explain": "ConCA’s unmixing story differs from SAE reconstruction+sparsity dictionaries."
              }
            ],
            "simplifiedMath": [],
            "vocabulary": [
              {
                "term": "ConCA",
                "original": "Technical term: «ConCA» as used in this literature.",
                "simple": "Concept Component Analysis.",
                "def": "Concept Component Analysis."
              },
              {
                "term": "Linear unmixing",
                "original": "Technical term: «Linear unmixing» as used in this literature.",
                "simple": "Recovering sources from linear mixtures.",
                "def": "Recovering sources from linear mixtures."
              }
            ],
            "whatItShows": [
              "A principled alternative framing for concept extraction"
            ],
            "whatItDoesNotShow": [
              "That SAEs are obsolete"
            ],
            "setconcaUse": [
              "Cite as alternative generative story.",
              "Compare assumptions explicitly in related work."
            ],
            "masteryChecklist": [
              "I can contrast ConCA unmixing vs SAE reconstruction dictionaries.",
              "I can state why identifiability assumptions matter."
            ],
            "commonConfusions": [
              {
                "wrong": "ConCA and SAE are the same method.",
                "right": "Different generative/objective stories."
              }
            ],
            "quiz": [
              {
                "q": "ConCA is closest to?",
                "options": [
                  "ICA-style unmixing of concept components",
                  "Mean pooling only",
                  "SimCLR only",
                  "BatchNorm only"
                ],
                "a": 0,
                "explain": "Unmixing story."
              }
            ],
            "originalIdea": "Concept Component Analysis extracts concepts via a principled linear mixture / unmixing approach.",
            "simpleLesson": "ConCA posits a generative process where activations are mixtures of concept components, then recovers components under assumptions (closer to ICA than to pure reconstruction dictionaries).\n\nFocus on: assumed generative process, log-posterior representation, identifiability, and how component recovery differs from learning a sparse reconstruction dictionary.\n\nFor SetConCA positioning: you may combine sparse dictionaries with multi-view constraints while acknowledging ConCA's unmixing story.",
            "limitPairs": [
              {
                "original": "A principled alternative framing for concept extraction",
                "simple": "In practice this means evidence supports: A principled alternative framing for concept extraction"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That SAEs are obsolete",
                "simple": "Do not overclaim: That SAEs are obsolete"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Cite as alternative generative story.",
                "simple": "Action item: Cite as alternative generative story."
              },
              {
                "original": "Compare assumptions explicitly in related work.",
                "simple": "Action item: Compare assumptions explicitly in related work."
              }
            ]
          },
          "quiz": [
            {
              "q": "ConCA is closest to?",
              "options": [
                "ICA-style unmixing of concept components",
                "Mean pooling only",
                "SimCLR only",
                "BatchNorm only"
              ],
              "a": 0,
              "explain": "Unmixing story."
            }
          ]
        },
        {
          "id": "mv-causal",
          "num": 39,
          "title": "Multi-View Causal Representation Learning with Partial Observability",
          "authors": "Yao et al.",
          "file": "2311.04056v2.pdf",
          "learn": [
            "When multiple views permit latent recovery",
            "Partial observability",
            "Identifiability under explicit assumptions"
          ],
          "setconca": "Theoretical foundation for multi-view concept identifiability.",
          "optional": false,
          "abstract": "We present a unified framework for studying the identifiability of representations learned from simultaneously observed views, such as different data modalities. We allow a partially observed setting in which each view constitutes a nonlinear mixture of a subset of underlying latent variables, which can be causally related. We prove that the information shared across all subsets of any number of views can be learned up to a smooth bijection using contrastive learning and a single encoder per view. We also provide graphical criteria indicating which latent variables can be identified through a simple set of rules, which we refer to as identifiability algebra. Our general framework and theoretical results unify and extend several previous works on multi-view nonlinear ICA, disentanglement, and causal representation learning. We experimentally validate our claims on numerical, image, and multi- modal data sets. Further, we demonstrate that the performance of prior methods is recovered in different special cases of our setup. Overall, we find that access to multiple partial views enables us to identify a more fine-grained representation, under the generally milder assumption of partial",
          "pages": 32,
          "pdfPath": "RAW/2311.04056v2.pdf",
          "teach": {
            "whyWeRead": "Theory for when multiple partial views identify latent factors — foundations for multi-view claims.",
            "oneSentence": "Studies multi-view causal representation learning under partial observability and identifiability conditions.",
            "plainLanguage": "Single views may only partially observe latent factors. Multiple views can make identification possible under explicit assumptions.\n\nThis is the theoretical backbone when you ask not only 'did retrieval improve?' but 'did we recover the shared concept factors?' Use it to write assumptions and kill criteria for SetConCA.",
            "keyIdeas": [
              {
                "title": "Partial observability",
                "original": "Each view may observe only a subset of latent factors.",
                "simple": "Every camera sees only part of the truth.",
                "explain": "Each view may observe only a subset of latent factors."
              },
              {
                "title": "Multi-view identification",
                "original": "Multiple partial views can identify latents that a single view cannot.",
                "simple": "Together, incomplete views can pin down the hidden state.",
                "explain": "Multiple partial views can identify latents that a single view cannot."
              },
              {
                "title": "Assumption-driven claims",
                "original": "Identifiability results are conditional on explicit assumptions about views and mixing.",
                "simple": "No assumption-free free lunch for ‘we recovered the latents.’",
                "explain": "Identifiability results are conditional on explicit assumptions about views and mixing."
              },
              {
                "title": "Causal representation learning",
                "original": "Targets latents with meaning under interventions, not only predictive embeddings.",
                "simple": "Want knobs that cause changes — not only knobs that correlate.",
                "explain": "Targets latents with meaning under interventions, not only predictive embeddings."
              }
            ],
            "simplifiedMath": [],
            "vocabulary": [
              {
                "term": "Partial observability",
                "original": "Technical term: «Partial observability» as used in this literature.",
                "simple": "Not all latents are seen in every view.",
                "def": "Not all latents are seen in every view."
              },
              {
                "term": "Identifiability conditions",
                "original": "Technical term: «Identifiability conditions» as used in this literature.",
                "simple": "Assumptions that make recovery unique (up to allowed transforms).",
                "def": "Assumptions that make recovery unique (up to allowed transforms)."
              }
            ],
            "whatItShows": [
              "When multi-view helps identify latents"
            ],
            "whatItDoesNotShow": [
              "That any multi-view SAE loss identifies concepts"
            ],
            "setconcaUse": [
              "Write explicit assumptions next to every strong claim.",
              "Design experiments that could falsify identifiability-style hypotheses."
            ],
            "masteryChecklist": [
              "I can explain partial observability.",
              "I refuse assumption-free 'we recovered concepts' claims."
            ],
            "commonConfusions": [
              {
                "wrong": "More views always identify everything.",
                "right": "Only under suitable assumptions and view structure."
              }
            ],
            "quiz": [
              {
                "q": "Multi-view helps identification especially when?",
                "options": [
                  "Each view is partially observing latents",
                  "Views are identical noise",
                  "There is no sparsity ever",
                  "Probes are banned"
                ],
                "a": 0,
                "explain": "Partial observability + assumptions."
              }
            ],
            "originalIdea": "Studies multi-view causal representation learning under partial observability and identifiability conditions.",
            "simpleLesson": "Single views may only partially observe latent factors. Multiple views can make identification possible under explicit assumptions.\n\nThis is the theoretical backbone when you ask not only 'did retrieval improve?' but 'did we recover the shared concept factors?' Use it to write assumptions and kill criteria for SetConCA.",
            "limitPairs": [
              {
                "original": "When multi-view helps identify latents",
                "simple": "In practice this means evidence supports: When multi-view helps identify latents"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That any multi-view SAE loss identifies concepts",
                "simple": "Do not overclaim: That any multi-view SAE loss identifies concepts"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Write explicit assumptions next to every strong claim.",
                "simple": "Action item: Write explicit assumptions next to every strong claim."
              },
              {
                "original": "Design experiments that could falsify identifiability-style hypotheses.",
                "simple": "Action item: Design experiments that could falsify identifiability-style hypotheses."
              }
            ]
          },
          "quiz": [
            {
              "q": "Multi-view helps identification especially when?",
              "options": [
                "Each view is partially observing latents",
                "Views are identical noise",
                "There is no sparsity ever",
                "Probes are banned"
              ],
              "a": 0,
              "explain": "Partial observability + assumptions."
            }
          ]
        }
      ],
      "primer": {
        "title": "Papers closest to SetConCA",
        "mission": "State research hypotheses that connect multi-view sets to sparse dictionaries.",
        "beforeYouStart": "Entire curriculum.",
        "primer": "Temporal Sparse Autoencoders coordinate adjacent-token activations with contrastive structure. SetConCA generalises that idea from temporal neighbours to multiple views of the same semantic object.\n\nConcept Component Analysis offers a different generative story: linear unmixing of concept components with identifiability assumptions — closer to ICA than to reconstruction dictionaries.\n\nMulti-View Causal Representation Learning asks when multiple partial views identify latent factors.\n\nYour central question is not merely 'does multi-view help retrieval?' It is:\n\nUnder what assumptions does multi-view supervision cause a sparse dictionary to recover more stable, complete, specific, or causally useful concepts than a pointwise SAE?\n\nThat question decides your experiments.",
        "bigPictureDiagram": [
          "Temporal SAE: adjacent tokens as pairs",
          "SetConCA: multi-view set of same concept + sparse dict + contrastive coord",
          "ConCA: unmixing components | MV-causal: identifiability theory"
        ],
        "conceptsToMaster": [
          {
            "name": "Related pair definition",
            "simple": "What counts as the same object across views.",
            "deeper": "Ablate this — local similarity ≠ semantic consistency."
          },
          {
            "name": "Identifiability",
            "simple": "When latents can be recovered uniquely (up to allowed transforms).",
            "deeper": "Needs assumptions; multi-view can help when single views are partial."
          }
        ],
        "checkpoint": {
          "goal": "Write three SetConCA hypotheses.",
          "steps": [
            "One assumption to challenge",
            "One reproduction",
            "One extension beyond Temporal SAE / ConCA"
          ],
          "successLooksLike": "Hypotheses name metrics from Level 6 and failure modes from Level 9."
        },
        "bridgeToNext": "You are ready to design SetConCA experiments without treating papers as oracles."
      }
    }
  ],
  "metricTable": [
    [
      "Reconstruction / FVU",
      "Information preservation",
      "Interpretability or atomicity"
    ],
    [
      "L0, L1, active features",
      "Sparsity",
      "Monosemanticity"
    ],
    [
      "Dead-feature rate",
      "Dictionary utilisation",
      "Feature quality"
    ],
    [
      "CKA / SVCCA",
      "Subspace similarity",
      "Same individual concepts"
    ],
    [
      "Recall@1 / MRR",
      "Neighbourhood alignment",
      "Causal relevance or disentanglement"
    ],
    [
      "Pos-minus-neg cosine",
      "Contrastive separation",
      "Concept completeness"
    ],
    [
      "Linear probe",
      "Decodability",
      "Representation causally uses concept"
    ],
    [
      "k-sparse probe",
      "Sparse decodability",
      "SAE features are canonical"
    ],
    [
      "Steering / ablation",
      "Intervention effect",
      "Complete causal mechanism"
    ],
    [
      "Seed stability",
      "Repeatability",
      "Correct semantic decomposition"
    ]
  ],
  "schedule16Weeks": [
    {
      "weeks": "1–2",
      "topic": "PCA, ICA, CCA",
      "output": "Implement and compare decompositions"
    },
    {
      "weeks": "3–4",
      "topic": "Sparse AEs and VAEs",
      "output": "L1 vs TopK experiment"
    },
    {
      "weeks": "5–6",
      "topic": "DCCA, DCCAE, VCCA, DGCCA",
      "output": "Shared/private latent analysis"
    },
    {
      "weeks": "7",
      "topic": "Deep Sets, Set Transformer",
      "output": "Aggregator comparison"
    },
    {
      "weeks": "8–9",
      "topic": "CPC, SupCon, alignment, VICReg",
      "output": "Contrastive-loss ablations"
    },
    {
      "weeks": "10",
      "topic": "SVCCA, CKA, probing",
      "output": "Evaluation notebook"
    },
    {
      "weeks": "11–12",
      "topic": "Circuits and superposition",
      "output": "Mechanistic notes"
    },
    {
      "weeks": "13–14",
      "topic": "Modern SAE architectures",
      "output": "Matched Pareto comparison"
    },
    {
      "weeks": "15",
      "topic": "SAE failure modes",
      "output": "Evaluation protocol"
    },
    {
      "weeks": "16",
      "topic": "Temporal SAE, ConCA, MV causal",
      "output": "SetConCA research hypotheses"
    }
  ]
};
