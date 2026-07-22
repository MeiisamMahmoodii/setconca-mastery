"""Self-contained teaching modules for Levels 6–10. Learner should not need PDFs."""

def _q(q, options, a, explain):
    return {"q": q, "options": options, "a": a, "explain": explain}


def _idea(title, explain):
    return {"title": title, "explain": explain}


PAPERS = {
    "svcca": {
        "whyWeRead": "Tool to compare neural subspaces across layers/models when coordinates differ.",
        "oneSentence": "SVCCA combines SVD dimensionality reduction with CCA to compare representations invariantly to affine transforms.",
        "plainLanguage": (
            "Welcome to the SVCCA Masterclass. Let's understand why Raghu et al. (NIPS 2017) created SVCCA.\n\n"
            "Suppose you have Model A and Model B. Both process the same inputs, but Model A has 4096 neurons while Model B has 2048 neurons. You cannot match Neuron #5 of Model A to Neuron #5 of Model B.\n\n"
            "--- HOW SVCCA WORKS ---\n"
            "1. Take activations matrix X from Model A and Y from Model B.\n"
            "2. Step 1 (SVD Truncation): Run Singular Value Decomposition (SVD) on X and Y to keep only top principal components that explain 99% of variance, throwing away low-variance noise.\n"
            "3. Step 2 (CCA Alignment): Perform CCA on the truncated subspaces to compute canonical correlations!\n\n"
            "What SVCCA proves: SVCCA measures SUBSPACE OVERLAP between models. High SVCCA score means the models represent similar subspace geometries.\n"
            "What SVCCA DOES NOT prove: SVCCA does NOT prove individual neurons or feature dictionaries are identical."
        ),
        "keyIdeas": [
            _idea("SVD Noise Reduction", "Truncates low-variance directions using SVD before running CCA to remove representational noise."),
            _idea("Affine-Invariant Subspace Comparison", "Compares subspace overlap across different network widths and layer coordinates."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "SVCCA", "def": "Singular Vector Canonical Correlation Analysis."},
            {"term": "Subspace Similarity", "def": "Degree of overlap between representational subspaces ignoring basis choice."},
        ],
        "whatItShows": ["That neural representations can be compared across architectures and layers using subspace correlation"],
        "whatItDoesNotShow": ["That individual features or concepts match one-to-one"],
        "setconcaUse": [
            "Use SVCCA as a subspace similarity baseline when comparing SetConCA feature spaces against pointwise SAEs.",
        ],
        "masteryChecklist": [
            "I can explain the two steps of SVCCA (SVD truncation then CCA).",
        ],
        "commonConfusions": [
            {"wrong": "High SVCCA means features match one-to-one.", "right": "SVCCA measures subspace overlap, not feature-level alignment."},
        ],
        "quiz": [
            _q("What does SVCCA perform before running CCA?", ["SVD truncation to keep high-variance components and remove noise", "TopK sparsity", "Linear probing", "L1 loss"], 0, "SVCCA runs SVD truncation first to reduce noise before computing canonical correlations."),
        ],
    },
    "cka": {
        "whyWeRead": "CKA is the standard representation similarity metric used in modern deep learning research to compare model layers and architectures.",
        "oneSentence": "Centered Kernel Alignment (CKA) measures representation similarity using Gram matrices, invariant to orthogonal transformations.",
        "plainLanguage": (
            "Welcome to the CKA Masterclass (Kornblith et al., ICML 2019).\n\n"
            "--- WHY PREVIOUS METRICS FAILED ---\n"
            "Linear regression probes overfit high dimensions. CCA is unstable when feature dimension > sample size. SVCCA requires arbitrary SVD cutoff hyperparameter tuning.\n\n"
            "--- HOW CKA WORKS ---\n"
            "CKA asks: do two representations induce SIMILAR EXAMPLE-TO-EXAMPLE SIMILARITY STRUCTURES?\n\n"
            "1. Compute N × N Gram Matrix K = X Xᵀ for Model A (where K_ij is cosine similarity between example i and example j in Model A).\n"
            "2. Compute N × N Gram Matrix L = Y Yᵀ for Model B (pairwise similarity of examples in Model B).\n"
            "3. CKA computes the normalized Hilbert-Schmidt Independence Criterion (HSIC) between centered matrices K and L.\n\n"
            "Formula: CKA(K, L) = HSIC(K, L) / sqrt( HSIC(K,K) * HSIC(L,L) )\n\n"
            "PROPERTIES:\n"
            "• Invariant to orthogonal rotation and isotropic scaling.\n"
            "• Robust to high dimensions and sample sizes.\n"
            "• High CKA means two models structure example similarities similarly."
        ),
        "keyIdeas": [
            _idea("Gram Matrix Pairwise Comparison", "Compares example-to-example similarity matrices K = XXᵀ and L = YYᵀ across models."),
            _idea("Orthogonal Invariance", "Invariant to arbitrary rotation of activation spaces."),
            _idea("Linear vs Kernel CKA", "Linear CKA uses dot products; Kernel CKA (RBF) captures non-linear similarity structure."),
        ],
        "simplifiedMath": [
            {"name": "Linear CKA Formula", "formula": "CKA(X,Y) = ||Yᵀ X||_F² / ( ||Xᵀ X||_F ||Yᵀ Y||_F )", "meaning": "Normalized Frobenius norm of cross-covariance matrix between activation matrices X and Y."},
        ],
        "vocabulary": [
            {"term": "CKA", "def": "Centered Kernel Alignment."},
            {"term": "Gram Matrix", "def": "An N × N matrix storing pairwise inner products between N example representations."},
        ],
        "whatItShows": ["When two neural network layers or models organize example geometry similarly"],
        "whatItDoesNotShow": ["That individual dictionary features or concepts are identical"],
        "setconcaUse": [
            "Primary metric for measuring overall representational similarity across training seeds and architectures.",
        ],
        "masteryChecklist": [
            "I can explain Gram matrices and why CKA uses them.",
            "I can state CKA's invariance properties.",
        ],
        "commonConfusions": [
            {"wrong": "High CKA = identical SAE features.", "right": "High CKA means similar example geometry, not identical individual features."},
        ],
        "quiz": [
            _q("CKA is invariant to which transformation?", ["Orthogonal rotations and isotropic scaling", "Non-linear warps", "Arbitrary token deletion", "L0 changes"], 0, "CKA is invariant to orthogonal rotation and isotropic scaling."),
        ],
    },
    "probe-control": {
        "whyWeRead": "Introduces Control Tasks and Selectivity to prevent mistaking probe capacity for representational structure.",
        "oneSentence": "Designing and Interpreting Probes with Control Tasks demonstrates that high probe accuracy alone does not prove representation structure.",
        "plainLanguage": (
            "Welcome to Hewitt & Liang (EMNLP 2019). This paper exposed a major scientific vulnerability in NLP probing research.\n\n"
            "--- THE PROBE FALLACY ---\n"
            "Researchers used to train linear probes on model activations to predict part-of-speech tags. When the probe achieved 97% accuracy, they concluded: 'Layer 8 represents part-of-speech structure!'\n\n"
            "Hewitt & Liang proved this is flawed: high-capacity probes can MEMORIZE random target labels even when representations contain NO linguistic structure!\n\n"
            "--- THE CONTROL TASK SOLUTION ---\n"
            "Construct a Control Task: assign random, arbitrary pseudo-labels to input words (matched in output distribution to real tags).\n"
            "1. Train probe on Real Task -> Real Accuracy.\n"
            "2. Train probe on Control Task -> Control Accuracy.\n"
            "3. Selectivity = Real Accuracy - Control Accuracy.\n\n"
            "High Selectivity proves the representation ITSELF carries accessible structure for the task, ruling out probe memorization!"
        ),
        "keyIdeas": [
            _idea("Probe Capacity vs Representational Content", "High probe accuracy can reflect probe memorization rather than representation quality."),
            _idea("Control Tasks", "Randomized target tasks matched in cardinality and marginal distribution to real tasks."),
            _idea("Probe Selectivity Metric", "Selectivity = Real Task Accuracy - Control Task Accuracy. Measures genuine representation structure."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "Probe", "def": "A supervised classifier trained on frozen representations to evaluate property extractability."},
            {"term": "Selectivity", "def": "Real Task Accuracy minus Control Task Accuracy; measures true representation structure."},
        ],
        "whatItShows": ["How to measure whether a representation genuinely structures a property using control tasks"],
        "whatItDoesNotShow": ["That the model causally uses the probed property during generation"],
        "setconcaUse": [
            "Every probing claim in SetConCA must report Selectivity using control tasks.",
        ],
        "masteryChecklist": [
            "I can define Selectivity and explain why control tasks are mandatory.",
        ],
        "commonConfusions": [
            {"wrong": "High probe accuracy proves the model uses the feature.", "right": "High probe accuracy only proves extractability by that probe. Selectivity is needed to rule out memorization."},
        ],
        "quiz": [
            _q("What does Probe Selectivity measure?", ["Real Task Accuracy minus Control Task Accuracy", "Total L0 count", "CKA score", "FVU"], 0, "Selectivity = Real Task Accuracy - Control Task Accuracy."),
        ],
    },
    "mdl-probe": {
        "whyWeRead": "MDL Probing measures information accessibility and organization effort using minimum description length.",
        "oneSentence": "Information-Theoretic Probing with Minimum Description Length measures how easily a property is extracted from a representation.",
        "plainLanguage": (
            "Welcome to Voita & Titov (EMNLP 2020). MDL Probing evaluates HOW EFFICIENTLY a probe learns a task from representations.\n\n"
            "Even if two representations both achieve 90% probe accuracy, one representation might require only 100 bits of description length for the probe to learn, while the other requires 5,000 bits!\n\n"
            "• Short Description Length = Information is neatly, accessibly organized.\n"
            "• Long Description Length = Information is buried and complex."
        ),
        "keyIdeas": [
            _idea("Accessibility vs Extractability", "High probe accuracy proves extractability; short description length proves accessible organization."),
            _idea("Prequential Code Length", "Measures total code length in bits required to transmit labels online given representations."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "MDL Probing", "def": "Evaluating representations by the description length (bits) required for a probe to learn a task."},
        ],
        "whatItShows": ["That description length measures how neatly information is organized in representations"],
        "whatItDoesNotShow": ["Causal intervention effects"],
        "setconcaUse": [
            "Use MDL description length when evaluating concept organization in SetConCA codes.",
        ],
        "masteryChecklist": [
            "I can explain why description length provides deeper insight than probe accuracy alone.",
        ],
        "commonConfusions": [
            {"wrong": "Same probe accuracy means identical representation quality.", "right": "Probes can require vast differences in description length to achieve the same accuracy."},
        ],
        "quiz": [
            _q("What does a short MDL description length indicate?", ["The property is accessibly and neatly organized in the representation", "The model has zero parameters", "High L0 sparsity", "Low CKA"], 0, "Short description length means the probe learned the property easily from accessible structure."),
        ],
    },
    "transformer-circuits": {
        "whyWeRead": "Gives the foundational residual stream and circuit vocabulary for Mechanistic Interpretability.",
        "oneSentence": "A Mathematical Framework for Transformer Circuits treats transformers as circuits operating on a central residual stream.",
        "plainLanguage": (
            "Welcome to Elhage et al. (Anthropic 2021).\n\n"
            "--- THE RESIDUAL STREAM BUS ---\n"
            "Think of the Transformer residual stream as a central conveyor belt running through all layers. Attention heads and MLP layers read from the stream and write updates back linearly:\n"
            "x_{l+1} = x_l + Attention(x_l) + MLP(x_l)\n\n"
            "--- QK AND OV CIRCUITS ---\n"
            "Attention heads factor into two independent operations:\n"
            "1. QK Circuit (Query-Key): Determines WHERE to attend (computes attention pattern A = Softmax(xᵀ W_Qᵀ W_K x)).\n"
            "2. OV Circuit (Output-Value): Determines WHAT information to move (computes output W_O W_V x).\n\n"
            "SAE features live as directions in this residual stream!"
        ),
        "keyIdeas": [
            _idea("Residual Stream Bus", "Linear pathway where transformer layers read inputs and additively write outputs."),
            _idea("QK Circuit Factorization", "Query-Key matrix product determines attention patterns."),
            _idea("OV Circuit Factorization", "Output-Value matrix product determines what feature content is written to the stream."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "Residual Stream", "def": "The main linear activation pathway running through a Transformer model."},
            {"term": "Circuit", "def": "A computational subgraph of attention heads and MLP neurons implementing a specific behavior."},
        ],
        "whatItShows": ["How Transformer layers interact via linear residual stream updates and factored attention circuits"],
        "whatItDoesNotShow": ["Automated feature dictionary extraction"],
        "setconcaUse": [
            "Specify exact residual stream layer sites for multi-view activation extraction in SetConCA.",
        ],
        "masteryChecklist": [
            "I can explain residual stream linear addition.",
            "I can contrast QK circuits (where to attend) with OV circuits (what to write).",
        ],
        "commonConfusions": [
            {"wrong": "Layers replace the residual stream at each step.", "right": "Layers add updates to the residual stream; the main stream vector persists through the model."},
        ],
        "quiz": [
            _q("What does the OV circuit in a Transformer attention head determine?", ["WHAT information is written to the residual stream", "WHERE attention focuses", "Sparsity L0", "PCA rank"], 0, "OV circuit determines what value content is moved to the residual stream."),
        ],
    },
    "superposition": {
        "whyWeRead": "The foundational Anthropic paper establishing why SAEs exist — explaining superposition, polysemanticity, and geometric feature packing.",
        "oneSentence": "Toy Models of Superposition demonstrates how networks pack more sparse features than dimensions via almost-orthogonal directions.",
        "plainLanguage": (
            "Welcome to Anthropic's Toy Models of Superposition (Elhage et al., 2022).\n\n"
            "--- THE PARADOX OF NEURAL REPRESENTATIONS ---\n"
            "A model with 4,096 activation dimensions can represent TENS OF THOUSANDS of distinct concepts. How?\n\n"
            "--- THE SUPERPOSITION HYPOTHESIS ---\n"
            "When features are SPARSE (active rarely), a network can pack M features into d dimensions (M > d) by embedding features as ALMOST-ORTHOGONAL directions!\n\n"
            "The Interference Cost:\n"
            "Because features are not strictly 90° orthogonal, activating Feature A causes small non-zero interference (crosstalk) on Feature B. When features are sparse, interference happens rarely, and non-linearities (ReLU) wipe out small interference noise.\n\n"
            "--- POLYSEMANTIC NEURONS ---\n"
            "Because packed feature directions do not line up with standard neuron basis axes, single neurons become POLYSEMANTIC — activating for multiple unrelated concepts!\n\n"
            "--- THREE WAYS OUT -> SPARSITY DICTIONARIES (SAES) ---\n"
            "Anthropic listed three ways to resolve superposition:\n"
            "1. Train models without superposition (costly).\n"
            "2. Find an Overcomplete Basis after training (SAEs / Dictionary Learning).\n"
            "3. Hybrid approaches."
        ),
        "priorWork": (
            "HISTORICAL LITERATURE REVIEW & CONTEXT:\n"
            "Earlier interpretability research assumed that single neurons corresponded to single human concepts (the 'one neuron = one concept' hypothesis). "
            "However, empirical studies consistently found polysemantic neurons (e.g. one neuron activating for both academic citations and anime characters). "
            "Elhage et al. (Anthropic 2022) built on compressed sensing, Thomson problem physics, and visual cortex sparse coding literature to establish the Superposition Hypothesis: networks intentionally pack more features than dimensions when features are sparse."
        ),
        "paperArchitecture": (
            "MATHEMATICAL MECHANISM & TOY MODEL ALGORITHM:\n"
            "1. Toy Architecture: Linear feature map h = W x where x ∈ ℝ^M (M features) and h ∈ ℝ^d (d dimensions, d < M). Reconstruction x_hat = ReLU(Wᵀ W x + b).\n"
            "2. Importance & Sparsity Regimes: Feature i has importance I_i and sparsity S_i (probability of being zero = 1 - S_i).\n"
            "3. Interference Optimization: Loss = Σ_i I_i (x_i - x_hat_i)². Minimizing loss forces weights W_i to form geometric packing configurations (antipodal pairs, triangles, pentagons, tetrahedra).\n"
            "4. Feature Dimensionality: D_i = ||W_i||² / Σ_j (Ŵ_i · W_j)² measures the fraction of a dimension dedicated to feature i.\n"
            "5. Phase Transitions: Exhibits sharp 1st-order phase transitions: as sparsity 1-S_i increases, feature i jumps from non-represented (D=0) → superposed (0<D<1) → dedicated axis (D=1)."
        ),
        "experimentalSetup": (
            "EMPIRICAL EVALUATION & PROOF LANDMARKS:\n"
            "• Synthetic Toy Models: Swept feature count M from 2 to 100 in d=2 dimensions across varying sparsity S ∈ [10⁰, 10⁻³] and importance distributions.\n"
            "• Key Finding: Linear models without ReLU NEVER exhibit superposition (they perform PCA). Non-linearities (ReLU) are mathematically required to enable superposition by suppressing interference noise.\n"
            "• Adversarial Vulnerability: Proved adversarial vulnerability increases >3× as superposition forms, because off-axis interference creates easy attack vectors."
        ),
        "keyIdeas": [
            _idea("Superposition Hypothesis", "Networks represent more sparse features than dimensions using almost-orthogonal directions."),
            _idea("Polysemanticity", "Neuron axes activate for combinations of unrelated superposed features."),
            _idea("Feature Dimensionality D_i", "Fraction of a dimension owned by feature i after accounting for interference: D_i = ||W_i||² / Σ_j (Ŵ_i·W_j)²."),
            _idea("Phase Transitions", "Features transition sharply between unrepresented (D_i=0), superposed (0<D_i<1), and dedicated (D_i=1) as sparsity increases."),
            _idea("SAE Motivation (Approach 2)", "SAEs find an overcomplete sparse basis to unfold superposed feature directions."),
        ],
        "simplifiedMath": [
            {"name": "Feature Dimensionality Formula", "formula": "D_i = \\frac{||W_i||^2}{\\sum_j (\\hat{W}_i \\cdot W_j)^2}", "meaning": "Measures effective dimensionality fraction owned by feature i after interference from all other features j."},
        ],
        "vocabulary": [
            {"term": "Superposition", "def": "Representing M > d sparse features in d dimensions using almost-orthogonal vectors."},
            {"term": "Polysemanticity", "def": "A single neuron activating for multiple unrelated concepts due to superposition."},
            {"term": "Privileged Basis", "def": "A coordinate basis made special by architectural non-linearities (e.g. ReLU)."},
        ],
        "whatItShows": ["That superposition occurs naturally in ReLU networks under feature sparsity", "That SAE dictionary learning is the mathematical solution to unfolding superposition"],
        "whatItDoesNotShow": ["That standard SAEs uniquely recover canonical ground-truth features"],
        "setconcaUse": [
            "Use Superposition Theory as the fundamental justification for why SAE dictionaries are required.",
        ],
        "masteryChecklist": [
            "I can explain superposition, interference, and polysemanticity to a beginner.",
            "I can list the three ways out and identify SAEs as Approach 2.",
        ],
        "commonConfusions": [
            {"wrong": "Superposition happens because networks don't have enough parameters.", "right": "Superposition happens because feature sparsity enables efficient high-dimensional packing even in large models."},
        ],
        "quiz": [
            _q("Superposition allows a network to represent?", ["More sparse features than activation dimensions", "Fewer features", "Only orthogonal features", "Only linear PCA"], 0, "Superposition packs more sparse features than dimensions into activation space."),
            _q("Sparse Autoencoders represent which 'way out' of superposition?", ["Approach 2: Finding an overcomplete basis after training", "Deleting MLP layers", "Increasing learning rate", "Using PCA"], 0, "SAEs are Approach 2: finding an overcomplete sparse basis."),
        ],
    },
    "monosemanticity": {
        "whyWeRead": "First large-scale application of sparse dictionary learning to extract monosemantic features from a language model.",
        "oneSentence": "Towards Monosemanticity demonstrates that sparse autoencoders extract interpretable, monosemantic feature directions from language model activations.",
        "plainLanguage": (
            "Welcome to Bricken et al. (Anthropic 2023).\n\n"
            "Anthropic applied sparse autoencoders to a 1-layer language model. They showed that SAE dictionary features are significantly more MONOSEMANTIC than raw model neurons!\n\n"
            "Features activated for specific, consistent concepts (e.g. 'DNA sequences', 'legal terms', 'Hebrew text'). They also demonstrated feature splitting and feature interventions."
        ),
        "keyIdeas": [
            _idea("Monosemantic Features vs Polysemantic Neurons", "SAE features isolate pure concepts far better than individual neurons."),
            _idea("Dictionary Scaling", "Increasing dictionary width improves feature purity but increases feature splitting."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "Monosemanticity", "def": "The degree to which a feature or neuron responds to a single, consistent concept."},
        ],
        "whatItShows": ["That sparse dictionary learning extracts highly interpretable monosemantic feature directions from LM activations"],
        "whatItDoesNotShow": ["That learned dictionaries are complete or canonically unique"],
        "setconcaUse": [
            "Adopt their qualitative feature presentation and intervention protocols in SetConCA.",
        ],
        "masteryChecklist": [
            "I can explain why SAE features are more monosemantic than neurons.",
        ],
        "commonConfusions": [
            {"wrong": "Towards Monosemanticity proved all SAE features are 100% pure.", "right": "It showed strong monosemanticity improvement while documenting feature splitting and leftover polysemanticity."},
        ],
        "quiz": [
            _q("What did Towards Monosemanticity demonstrate?", ["SAE dictionary features are significantly more monosemantic than raw model neurons", "Neurons are pure", "PCA replaces SAEs", "Probes fail"], 0, "Showed SAE features are much more monosemantic than raw model neurons."),
        ],
    },
    "cunningham-sae": {
        "whyWeRead": "Central academic SAE paper establishing sparse autoencoder architectures, reconstruction/sparsity objectives, and intervention methodology.",
        "oneSentence": "Sparse Autoencoders Find Highly Interpretable Features in Language Models presents academic SAE training, evaluation, and activation interventions.",
        "plainLanguage": (
            "Welcome to Cunningham et al. (2023).\n\n"
            "Published concurrently with Anthropic's work, Cunningham et al. established academic SAE methodology:\n"
            "1. Train SAE: Loss = ||x - x_hat||² + λ ||z||₁\n"
            "2. Evaluate Feature Interpretability: Compare SAE features against raw neuron baselines.\n"
            "3. Activation Interventions: Clamp or ablate feature activations z_i to verify causal impact on language model token output probabilities!"
        ),
        "keyIdeas": [
            _idea("Standard SAE Training Objective", "Reconstruction MSE plus L1 sparsity penalty."),
            _idea("Causal Interventions", "Clamping feature activations z_i to verify direct causal control over model generation."),
        ],
        "simplifiedMath": [
            {"name": "Standard SAE Loss", "formula": "L = ||x - x̂||² + λ ||z||₁", "meaning": "MSE reconstruction loss plus L1 sparsity penalty on hidden codes z."},
        ],
        "vocabulary": [
            {"term": "Activation Intervention", "def": "Modifying feature activations during forward pass to measure causal downstream effect."},
        ],
        "whatItShows": ["That SAE features enable precise causal intervention steering of LM output probabilities"],
        "whatItDoesNotShow": ["Canonical uniqueness of dictionaries across random seeds"],
        "setconcaUse": [
            "Pointwise SAEs from this paper are the core baseline for SetConCA comparisons.",
        ],
        "masteryChecklist": [
            "I can write the classic SAE loss and describe activation intervention evaluation.",
        ],
        "commonConfusions": [
            {"wrong": "Interpretable activation text alone proves causal utility.", "right": "Causal interventions (clamping/ablation) are required to verify true model impact."},
        ],
        "quiz": [
            _q("How do Cunningham et al. verify causal feature importance?", ["By clamping/ablating feature activations during forward pass and measuring output probability changes", "By plotting FVU", "By computing CKA", "By running PCA"], 0, "Activation interventions (clamping/ablating) verify direct causal impact on model outputs."),
        ],
    },
    "scaling-mono": {
        "whyWeRead": "Shows what happens when SAE dictionaries are scaled to frontier models (Claude 3 Sonnet) — and what scale alone does not resolve.",
        "oneSentence": "Scaling Monosemanticity extracts millions of interpretable features from Claude 3 Sonnet using massive sparse autoencoders.",
        "plainLanguage": (
            "Welcome to Templeton et al. (Anthropic 2024).\n\n"
            "Anthropic scaled SAEs to Claude 3 Sonnet, extracting millions of features including safety-relevant concepts ('Golden Gate Bridge', 'bias', 'jailbreaks', 'code bugs').\n\n"
            "CRITICAL TAKEAWAY: While scale produces fascinating features, scale ALONE does not solve feature absorption, splitting, or non-canonicality!"
        ),
        "keyIdeas": [
            _idea("Frontier Scale SAEs", "Scales dictionary learning to multi-billion parameter frontier language models."),
            _idea("Safety-Relevant Features", "Discovers high-level abstract safety, refusal, and concept features."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "Frontier SAE", "def": "Massive dictionary sparse autoencoder trained on state-of-the-art language models."},
        ],
        "whatItShows": ["That SAE methods scale to frontier LLMs and reveal safety-relevant feature representations"],
        "whatItDoesNotShow": ["That scaling solves structural dictionary failure modes"],
        "setconcaUse": [
            "Do not rely on scale alone; focus on structural multi-view coordination in SetConCA.",
        ],
        "masteryChecklist": [
            "I can articulate what scaling SAEs achieves and what open limitations remain.",
        ],
        "commonConfusions": [
            {"wrong": "Bigger dictionary width eliminates all interpretability errors.", "right": "Bigger dictionaries increase feature splitting and non-canonicality issues."},
        ],
        "quiz": [
            _q("Does scaling SAE dictionaries to frontier models solve feature non-canonicality?", ["No, structural limitations remain regardless of scale", "Yes, scale solves everything", "Yes, L0 drops to 0", "Yes, PCA is eliminated"], 0, "Structural limitations (non-canonicality, absorption) persist regardless of model scale."),
        ],
    },
    "topk-sae": {
        "whyWeRead": "TopK SAE is the modern gold standard architecture for sparse autoencoder research.",
        "oneSentence": "Scaling and Evaluating Sparse Autoencoders establishes TopK SAEs, expansion factor scaling, and matched Pareto frontier comparisons.",
        "plainLanguage": (
            "Welcome to Gao et al. (OpenAI 2024).\n\n"
            "OpenAI introduced TopK SAEs:\n"
            "z = TopK( W_enc x + b_enc, k )\n"
            "Loss = ||x - W_dec z - b_dec||²\n\n"
            "By keeping the exact top k activations without an L1 penalty, TopK SAEs completely eliminate L1 magnitude shrinkage, achieving a dramatically superior Reconstruction vs. Sparsity Pareto curve!"
        ),
        "keyIdeas": [
            _idea("TopK Hard Sparsity", "Keeps exact top k activations per token, eliminating magnitude shrinkage."),
            _idea("Matched Pareto Comparison", "Insists that SAE architectures must be compared at matched L0 or matched FVU operating points."),
        ],
        "simplifiedMath": [
            {"name": "TopK SAE Encoder", "formula": "z = TopK( W_{enc} (x - b_{dec}) + b_{enc}, k )", "meaning": "Keep top k pre-activations; set remaining entries to 0."},
        ],
        "vocabulary": [
            {"term": "TopK SAE", "def": "Sparse autoencoder using hard TopK activation operator."},
        ],
        "whatItShows": ["That TopK SAEs beat L1 SAEs across reconstruction-sparsity Pareto frontiers"],
        "whatItDoesNotShow": ["That TopK solves feature absorption or non-canonicality"],
        "setconcaUse": [
            "Default baseline architecture family for SetConCA evaluations.",
        ],
        "masteryChecklist": [
            "I can explain why TopK beats L1 on Pareto curves.",
        ],
        "commonConfusions": [
            {"wrong": "TopK uses an L1 penalty.", "right": "TopK uses NO L1 penalty. Sparsity is enforced by hard TopK selection."},
        ],
        "quiz": [
            _q("Why do TopK SAEs achieve better Pareto frontiers than L1 SAEs?", ["TopK eliminates L1 magnitude shrinkage on active features", "TopK uses more parameters", "TopK runs faster on CPU", "TopK uses CKA"], 0, "TopK eliminates L1 magnitude shrinkage on active feature values."),
        ],
    },
    "gated-sae": {
        "whyWeRead": "Gated SAEs fix L1 shrinkage while maintaining full differentiability by separating gating from magnitude.",
        "oneSentence": "Improving Dictionary Learning with Gated Sparse Autoencoders decouples activation gating from feature magnitude calculation.",
        "plainLanguage": (
            "Welcome to Rajamanoharan et al. (DeepMind 2024).\n\n"
            "Gated SAEs split the encoder into two parallel paths:\n"
            "1. Gate Path: π = Heaviside( W_gate x + b_gate ) -> Binary on/off mask.\n"
            "2. Magnitude Path: m = ReLU( W_mag x + b_mag ) -> Unpenalized positive magnitude.\n"
            "3. Output: z = π ⊙ m\n\n"
            "This fixes L1 magnitude shrinkage while remaining fully differentiable!"
        ),
        "keyIdeas": [
            _idea("Gating vs Magnitude Separation", "Decouples feature firing decision from feature strength calculation."),
            _idea("Shrinkage Elimination", "Allows active features to maintain unpenalized magnitudes."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "Gated SAE", "def": "SAE architecture separating gating mask from feature magnitude calculation."},
        ],
        "whatItShows": ["That separating gating from magnitude eliminates L1 shrinkage cleanly"],
        "whatItDoesNotShow": ["That Gated SAEs resolve non-canonical dictionary unit issues"],
        "setconcaUse": [
            "Include Gated SAE in multi-architecture bake-offs.",
        ],
        "masteryChecklist": [
            "I can draw the Gated SAE dual-encoder diagram.",
        ],
        "commonConfusions": [
            {"wrong": "Gated SAE is identical to TopK.", "right": "TopK uses hard k selection. Gated SAE uses dual gating/magnitude pathways with L1 on the gate."},
        ],
        "quiz": [
            _q("How do Gated SAEs eliminate magnitude shrinkage?", ["By using separate neural pathways for gating decisions and magnitude calculations", "By setting k=1", "By removing decoders", "By running PCA"], 0, "Separates gating decisions from magnitude calculations so magnitudes are unpenalized."),
        ],
    },
    "jumprelu": {
        "whyWeRead": "JumpReLU uses learned thresholds for direct L0-style sparsity optimization.",
        "oneSentence": "Jumping Ahead: Improving Reconstruction Fidelity with JumpReLU SAEs uses discontinuous thresholded activations.",
        "plainLanguage": (
            "Welcome to Rajamanoharan et al. (2024).\n\n"
            "JumpReLU applies a feature-specific threshold θ_i:\n"
            "z_i = x_i if x_i > θ_i else 0\n\n"
            "Because below threshold θ_i the feature is strictly zero and above θ_i it retains its full value, JumpReLU approximates direct L0 optimization better than soft L1 penalties."
        ),
        "keyIdeas": [
            _idea("Learned Feature Thresholds", "Each feature learns an explicit activation barrier threshold θ_i."),
            _idea("Direct L0 Approximation", "Avoids magnitude shrinkage while learning per-feature firing barriers."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "JumpReLU", "def": "Thresholded activation function jumping from 0 to value above threshold θ."},
        ],
        "whatItShows": ["That thresholded JumpReLU activations improve SAE Pareto frontiers"],
        "whatItDoesNotShow": ["Unique feature canonicality"],
        "setconcaUse": [
            "Include JumpReLU in matched Pareto comparisons.",
        ],
        "masteryChecklist": [
            "I can explain JumpReLU thresholding.",
        ],
        "commonConfusions": [
            {"wrong": "JumpReLU threshold θ is fixed across all features.", "right": "JumpReLU learns an independent threshold θ_i for each feature."},
        ],
        "quiz": [
            _q("What does JumpReLU use to determine feature firing?", ["Learned per-feature threshold barriers θ_i", "Fixed TopK", "PCA variance", "CKA score"], 0, "JumpReLU uses learned per-feature thresholds θ_i."),
        ],
    },
    "batchtopk": {
        "whyWeRead": "BatchTopK applies TopK across a whole minibatch, allowing variable active features per token.",
        "oneSentence": "BatchTopK Sparse Autoencoders constrain total active features across an entire batch for flexible allocation.",
        "plainLanguage": (
            "Welcome to Bussmann & Leask (2024).\n\n"
            "Standard TopK forces EVERY token to activate exactly k features (e.g. k=32). But simple tokens ('the', '.') need only 5 features, while complex tokens ('quantum electrodynamics') need 60 features!\n\n"
            "BatchTopK applies TopK across all token activations in a MINIBATCH simultaneously! Complex tokens get more active features, simple tokens get fewer, improving overall allocation efficiency."
        ),
        "keyIdeas": [
            _idea("Minibatch-Level Sparsity Budget", "Allocates feature sparsity dynamically based on token complexity."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "BatchTopK", "def": "TopK selection applied across an entire minibatch rather than per-token."},
        ],
        "whatItShows": ["That flexible per-token sparsity allocation improves reconstruction efficiency"],
        "whatItDoesNotShow": ["Solved feature absorption"],
        "setconcaUse": [
            "Useful when activation view sets vary wildly in token complexity.",
        ],
        "masteryChecklist": [
            "I can explain why BatchTopK beats fixed per-token TopK for heterogeneous tokens.",
        ],
        "commonConfusions": [
            {"wrong": "BatchTopK removes sparsity constraints.", "right": "BatchTopK enforces the exact same total sparsity budget across the batch, but distributes it dynamically."},
        ],
        "quiz": [
            _q("Why is BatchTopK advantageous for language model tokens?", ["Allows complex tokens to use more features while simple tokens use fewer", "Eliminates decoders", "Runs offline", "Uses PCA"], 0, "Dynamically allocates feature budgets based on token complexity across the minibatch."),
        ],
    },
    "matryoshka": {
        "whyWeRead": "Matryoshka SAEs learn multi-granularity nested features within a single dictionary model.",
        "oneSentence": "Learning Multi-Level Features with Matryoshka Sparse Autoencoders creates nested feature prefixes for coarse-to-fine concepts.",
        "plainLanguage": (
            "Welcome to Bussmann et al. (2025).\n\n"
            "Named after Russian nesting dolls, Matryoshka SAEs train feature dictionaries so that NESTED PREFIXES of features (e.g. first 500, first 2,000, first 8,000) form valid, high-quality representations at different granularities!\n\n"
            "This resolves the dictionary-size dilemma by capturing coarse high-level concepts and fine-grained sub-concepts inside one trained dictionary."
        ),
        "keyIdeas": [
            _idea("Nested Feature Dictionaries", "Feature prefixes satisfy reconstruction at multiple capacity levels simultaneously."),
            _idea("Multi-Granularity Concepts", "Coarse features appear in early indices; fine sub-features appear in later indices."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "Matryoshka SAE", "def": "SAE trained with nested feature loss prefixes for multi-scale representations."},
        ],
        "whatItShows": ["That nested multi-granularity feature dictionaries can be trained in a single model"],
        "whatItDoesNotShow": ["True ontological hierarchy of language"],
        "setconcaUse": [
            "Inspiration for multi-granularity concept hierarchy in SetConCA.",
        ],
        "masteryChecklist": [
            "I can explain how Matryoshka SAEs nest feature prefixes.",
        ],
        "commonConfusions": [
            {"wrong": "Matryoshka requires training separate SAE models for each size.", "right": "Matryoshka trains a single SAE model with nested prefix loss terms."},
        ],
        "quiz": [
            _q("What characterizes a Matryoshka SAE?", ["Nested feature prefixes providing coarse-to-fine concept granularities in one model", "Linear CCA", "Single feature dictionary of size 1", "No encoder"], 0, "Nested feature prefixes provide multi-granularity representations in one model."),
        ],
    },
    "principled-eval": {
        "whyWeRead": "Demonstrates that reconstruction and sparsity proxy metrics are insufficient to prove interpretability or control.",
        "oneSentence": "Towards Principled Evaluations of Sparse Autoencoders argues for task-relevant control and intervention evaluations.",
        "plainLanguage": (
            "Welcome to Makelov et al. (2024).\n\n"
            "This paper warns the field: low FVU and low L0 are NECESSARY HYGIENE, BUT NOT SUFFICIENT PROOF of interpretability!\n\n"
            "A dictionary can achieve great FVU while completely failing downstream intervention, steering, or task-control tests. Always evaluate claim-aligned downstream tasks."
        ),
        "keyIdeas": [
            _idea("Insufficiency of Proxy Metrics", "Reconstruction and sparsity do not guarantee feature interpretability or control."),
            _idea("Task-Relevant Evaluation", "Evaluates SAEs on downstream task performance, causal interventions, and circuit editing."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "Proxy Metric", "def": "An easy-to-compute metric (like FVU or L0) that may not track true research goals."},
        ],
        "whatItShows": ["That SAE research must evaluate downstream task performance beyond proxy metrics"],
        "whatItDoesNotShow": ["A single universal metric for all interpretability claims"],
        "setconcaUse": [
            "Design SetConCA evaluation around claim-aligned task performance, not just FVU.",
        ],
        "masteryChecklist": [
            "I refuse papers that claim success based on FVU alone.",
        ],
        "commonConfusions": [
            {"wrong": "The SAE with lowest FVU is automatically the most interpretable.", "right": "Lowest FVU only means best variance reconstruction; it can still suffer from feature absorption and non-canonicality."},
        ],
        "quiz": [
            _q("Why are FVU and L0 called 'proxy metrics'?", ["They measure hygiene but do not guarantee downstream feature interpretability or control", "They are inaccurate", "They require GPUs", "They are non-linear"], 0, "Proxy metrics measure hygiene but do not guarantee downstream task control or interpretability."),
        ],
    },
    "absorption": {
        "whyWeRead": "Defines Feature Splitting and Feature Absorption — two core empirical failure modes of SAEs.",
        "oneSentence": "Studying Feature Splitting and Absorption in Sparse Autoencoders details how concepts fragment or get swallowed by latents.",
        "plainLanguage": (
            "Welcome to Chanin et al. (2024).\n\n"
            "This paper details two fundamental structural flaws of SAEs:\n\n"
            "1. Feature Splitting: A single concept fragments into dozens of sub-features as dictionary size grows.\n"
            "2. Feature Absorption: A broad feature 'swallows' or absorbs related specific sub-concepts when dictionary width or sparsity is constrained.\n\n"
            "Both failure modes break the naive hope that '1 SAE Latent = 1 Ground-Truth Atomic Concept'."
        ),
        "keyIdeas": [
            _idea("Feature Splitting", "Fragmentation of a single concept across multiple dictionary latents."),
            _idea("Feature Absorption", "Merger/swallowing of specific sub-concepts into a single dominant latent."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "Feature Absorption", "def": "A failure mode where one SAE feature absorbs multiple related sub-concepts."},
            {"term": "Feature Splitting", "def": "A failure mode where one concept splits across many feature latents."},
        ],
        "whatItShows": ["That SAE latents systematically absorb or split concepts depending on dictionary capacity"],
        "whatItDoesNotShow": ["That single-view SAEs can automatically resolve absorption"],
        "setconcaUse": [
            "Target Feature Absorption as a primary failure mode to beat using multi-view set supervision in SetConCA.",
        ],
        "masteryChecklist": [
            "I can define Splitting and Absorption with concrete examples.",
        ],
        "commonConfusions": [
            {"wrong": "Absorption only happens in bad code implementation.", "right": "Absorption is a structural property of sparse dictionary optimization under capacity constraints."},
        ],
        "quiz": [
            _q("What occurs during Feature Absorption?", ["A single dominant feature swallows related specific sub-concepts", "A feature deletes itself", "FVU drops to 0", "PCA rank increases"], 0, "Feature Absorption occurs when one feature swallows related specific sub-concepts."),
        ],
    },
    "non-canonical": {
        "whyWeRead": "Critical narrative paper proving SAEs do not find unique, canonical units of analysis.",
        "oneSentence": "Sparse Autoencoders Do Not Find Canonical Units of Analysis demonstrates that different random seeds yield non-identical feature dictionaries of equal quality.",
        "plainLanguage": (
            "Welcome to Leask et al. (2025).\n\n"
            "If you train two SAEs (Seed A and Seed B) on the exact same layer with identical hyperparameters, do they discover the same features?\n\n"
            "NO! Leask et al. proved that Seed A and Seed B discover DIFFERENT, non-identical feature dictionaries despite achieving identical reconstruction and sparsity!\n\n"
            "CONCLUSION: There is NO single 'canonical' sparse basis in activation space. Claims that 'we discovered the true fundamental features' are scientifically false."
        ),
        "keyIdeas": [
            _idea("Non-Canonicality Proof", "Multiple non-identical dictionary bases span activation space with equal quality."),
            _idea("Stitching Analysis", "Cross-dictionary feature mapping reveals lack of 1-to-1 feature alignment across seeds."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "Canonical Basis", "def": "A unique, privileged feature decomposition — proven to be absent in standard SAEs."},
        ],
        "whatItShows": ["That standard SAEs do not find unique canonical feature bases across random seeds"],
        "whatItDoesNotShow": ["That interpretability research is useless"],
        "setconcaUse": [
            "Test whether multi-view set supervision in SetConCA increases cross-seed dictionary canonicality (stitching agreement).",
        ],
        "masteryChecklist": [
            "I can explain why seed-variance tests disprove dictionary uniqueness.",
        ],
        "commonConfusions": [
            {"wrong": "Different seeds finding different features means SAEs failed completely.", "right": "It means uniqueness fails; dictionaries are frame representations rather than unique canonical bases."},
        ],
        "quiz": [
            _q("What did Leask et al. prove regarding SAE feature dictionaries?", ["Different random seeds yield different non-identical feature dictionaries of equal quality", "All seeds find identical features", "SAEs cannot be trained", "PCA is unique"], 0, "Proved different random seeds produce non-identical feature dictionaries of equal quality."),
        ],
    },
    "saebench": {
        "whyWeRead": "Standard multi-family benchmark suite for evaluating sparse autoencoders.",
        "oneSentence": "SAEBench provides a standardized multi-family benchmark covering reconstruction, sparsity, probing, steering, and absorption.",
        "plainLanguage": (
            "Welcome to Karvonen et al. (2025).\n\n"
            "SAEBench provides a unified benchmark suite evaluating SAEs across 5 core families:\n"
            "1. Reconstruction & Loss Recovery\n"
            "2. Sparsity & L0 Efficiency\n"
            "3. Feature Interpretability & Monosemanticity\n"
            "4. Sparse Probing (SCR)\n"
            "5. Steering & Causal Interventions"
        ),
        "keyIdeas": [
            _idea("Multi-Family Evaluation Suite", "Standardized suite evaluating SAEs across 5 distinct functional families."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "SAEBench", "def": "Standardized evaluation benchmark suite for sparse autoencoders."},
        ],
        "whatItShows": ["A standardized menu of evaluation families for fair SAE comparison"],
        "whatItDoesNotShow": ["That winning one metric guarantees overall superiority"],
        "setconcaUse": [
            "Adopt SAEBench evaluation protocols to benchmark SetConCA against standard SAEs.",
        ],
        "masteryChecklist": [
            "I can name the 5 evaluation families in SAEBench.",
        ],
        "commonConfusions": [
            {"wrong": "Evaluating on one SAEBench metric is enough.", "right": "Evaluations must report results across all 5 families."},
        ],
        "quiz": [
            _q("How many evaluation families does SAEBench cover?", ["5 core families (reconstruction, sparsity, probing, steering, interpretability)", "1 metric only", "100 metrics", "0 metrics"], 0, "SAEBench covers 5 core evaluation families."),
        ],
    },
    "bench-reliable": {
        "whyWeRead": "Audits SAEBench reliability, warning against noise and metric overfitting.",
        "oneSentence": "Are Sparse Autoencoder Benchmarks Reliable? audits metric stability and ground-truth correlation.",
        "plainLanguage": (
            "Welcome to Chanin (2026). Read this AFTER SAEBench to calibrate your trust!\n\n"
            "Chanin audited SAEBench metrics on synthetic ground-truth models, discovering that several popular metrics suffer from high seed noise and weak ground-truth correlation.\n\n"
            "PRACTICE: Always report multi-seed error bars and treat benchmark scores with calibrated scientific skepticism."
        ),
        "keyIdeas": [
            _idea("Metric Reliability Audit", "Demonstrates noise and synthetic ground-truth failure in popular SAE benchmarks."),
            _idea("Multi-Seed Reporting Hygiene", "Mandates error bars across multiple random seeds."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "Metric Reliability", "def": "Degree to which an evaluation score accurately tracks true underlying capability without seed noise."},
        ],
        "whatItShows": ["That some SAE benchmark metrics are noisy and require multi-seed validation"],
        "whatItDoesNotShow": ["That benchmarking should be abandoned"],
        "setconcaUse": [
            "Report multi-seed mean and standard deviation for all SetConCA evaluation scores.",
        ],
        "masteryChecklist": [
            "I report multi-seed confidence intervals on all benchmark figures.",
        ],
        "commonConfusions": [
            {"wrong": "Single-run benchmark scores are reliable.", "right": "Single-run scores suffer from random seed noise. Multi-seed reporting is required."},
        ],
        "quiz": [
            _q("What does Chanin (2026) mandate for reliable SAE benchmark reporting?", ["Multi-seed reporting with mean and error bars", "Single-run reporting", "Using only FVU", "Ignoring benchmarks"], 0, "Mandates multi-seed reporting with error bars to account for seed noise."),
        ],
    },
    "feature-hedging": {
        "whyWeRead": "Optional: shows how correlated features break narrow SAEs, motivating dictionary expansion and multi-view supervision.",
        "oneSentence": "Feature Hedging: Correlated Features Break Narrow Sparse Autoencoders demonstrates degenerate feature merging under concept co-occurrence.",
        "plainLanguage": (
            "Welcome to Chanin et al. (2025).\n\n"
            "When concepts frequently co-occur (high correlation), narrow SAE dictionaries hedge by merging concepts into degenerate combination features.\n\n"
            "SetConCA Connection: Multi-view set supervision provides the extra cross-context signal needed to disentangle correlated concepts."
        ),
        "keyIdeas": [
            _idea("Feature Hedging Degeneracy", "Correlated concepts force narrow SAEs to learn merged combination features."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "Feature Hedging", "def": "Degenerate feature merging caused by concept co-occurrence in narrow dictionaries."},
        ],
        "whatItShows": ["That correlated features specifically break narrow SAE dictionaries"],
        "whatItDoesNotShow": ["That sparsity alone fixes correlation hedging"],
        "setconcaUse": [
            "Motivation for multi-view concept disambiguation in SetConCA.",
        ],
        "masteryChecklist": [
            "I can explain how concept correlation causes feature hedging.",
        ],
        "commonConfusions": [
            {"wrong": "High sparsity prevents feature hedging.", "right": "Correlated features cause hedging even at high sparsity unless dictionary width or multi-view supervision is added."},
        ],
        "quiz": [
            _q("What causes Feature Hedging in narrow SAEs?", ["High correlation / co-occurrence between concepts", "Zero learning rate", "PCA failure", "Single token input"], 0, "High correlation / co-occurrence between concepts causes feature hedging."),
        ],
    },
    "geometric-wall": {
        "whyWeRead": "Optional: intrinsic activation geometry predicts layerwise SAE scaling limits.",
        "oneSentence": "The Geometric Wall: Manifold Structure Predicts Layerwise SAE Scaling Laws links activation intrinsic dimension to dictionary scaling bounds.",
        "plainLanguage": (
            "Welcome to Zaher et al. (2026).\n\n"
            "Not all transformer layers are equally easy to unpack! Early layers have high intrinsic geometric dimension, while middle/late layers collapse into lower-dimensional manifolds.\n\n"
            "The Geometric Wall shows that intrinsic layer geometry places hard bounds on SAE scaling laws."
        ),
        "keyIdeas": [
            _idea("Intrinsic Layer Dimension Bounds", "Activation manifold geometry constrains dictionary scaling efficiency per layer."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "Geometric Wall", "def": "Geometry-imposed limit on layerwise SAE dictionary scaling."},
        ],
        "whatItShows": ["That intrinsic activation geometry bounds layerwise SAE scaling laws"],
        "whatItDoesNotShow": ["How to design multi-view set losses"],
        "setconcaUse": [
            "Select layer sites for SetConCA views with intrinsic manifold geometry in mind.",
        ],
        "masteryChecklist": [
            "I know layer choice is governed by intrinsic geometric dimension.",
        ],
        "commonConfusions": [
            {"wrong": "All layers scale identically with SAE width.", "right": "Scaling limits vary by layer depending on intrinsic activation manifold geometry."},
        ],
        "quiz": [
            _q("What predicts layerwise SAE scaling limits in Zaher et al. (2026)?", ["Intrinsic activation manifold geometry", "Token count only", "GPU VRAM", "PDF size"], 0, "Intrinsic activation manifold geometry predicts layerwise scaling limits."),
        ],
    },
    "temporal-sae": {
        "whyWeRead": "Closest empirical ancestor to SetConCA: coordinates SAE codes across adjacent-token activation pairs.",
        "oneSentence": "Temporal Sparse Autoencoders adds contrastive temporal coordination between adjacent token activations to improve feature consistency.",
        "plainLanguage": (
            "Welcome to Bhalla et al. (2025).\n\n"
            "--- THE TEMPORAL SAE BREAKTHROUGH ---\n"
            "Standard SAEs treat every token activation in complete isolation. But language has temporal structure: adjacent tokens (t and t+1) share semantic context!\n\n"
            "Temporal SAEs add a CONTRASTIVE LOSS between sparse codes of adjacent tokens:\n"
            "Loss = Reconstruction + λ_sparse * Sparsity + λ_temp * Contrastive_Loss(z_t, z_{t+1})\n\n"
            "Result: Coordinates feature activations over time, improving temporal consistency.\n\n"
            "--- THE SETCONCA GENERALIZATION ---\n"
            "Temporal SAEs coordinate adjacent tokens in time. SetConCA generalizes this idea from temporal pairs to MULTI-VIEW SETS of the exact same semantic object across different context prompts, paraphrases, and layers!"
        ),
        "keyIdeas": [
            _idea("Temporal Pair Coordination", "Uses adjacent token activations as positive pairs for contrastive coordination."),
            _idea("Contrastive SAE Code Loss", "Coordinates sparse codes z_t and z_{t+1} without destroying sparsity."),
            _idea("Template for SetConCA", "SetConCA generalizes temporal pairs to multi-view semantic sets."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "Temporal SAE", "def": "SAE trained with contrastive coordination between adjacent token activations."},
        ],
        "whatItShows": ["That coordinating sparse codes across related activation pairs improves feature consistency"],
        "whatItDoesNotShow": ["How to coordinate unordered sets of multi-view activations"],
        "setconcaUse": [
            "Direct template for SetConCA: replace adjacent temporal pairs with multi-view concept sets.",
        ],
        "masteryChecklist": [
            "I can explain how SetConCA generalizes Temporal SAEs.",
        ],
        "commonConfusions": [
            {"wrong": "Temporal SAEs work on unordered set inputs.", "right": "Temporal SAEs require sequential adjacent tokens. SetConCA uses set aggregators for unordered multi-view sets."},
        ],
        "quiz": [
            _q("How does SetConCA generalize Temporal SAEs?", ["Generalizes adjacent temporal pairs to multi-view semantic sets", "Removes contrastive loss", "Uses linear PCA", "Deletes decoders"], 0, "Generalizes temporal adjacent pairs to multi-view semantic concept sets."),
        ],
    },
    "conca": {
        "whyWeRead": "Concept Component Analysis (ConCA) is a direct generative unmixing rival/complement to dictionary learning.",
        "oneSentence": "Concept Component Analysis (ConCA) derives a generative linear unmixing model for concept components with identifiability proofs.",
        "plainLanguage": (
            "Welcome to Liu et al. (2026).\n\n"
            "--- THE CONCA FRAMEWORK ---\n"
            "ConCA approaches interpretability from an ICA/generative perspective:\n"
            "x = Σ c_i v_i + noise\n\n"
            "ConCA computes representations under log-posterior assumptions, offering formal identifiability proofs showing when concept components can be recovered uniquely."
        ),
        "keyIdeas": [
            _idea("Generative Concept Component Model", "Treats activations as linear combinations of concept components with log-posterior representation."),
            _idea("Identifiability Guarantees", "Provides formal theoretical proofs for concept component recovery under explicit assumptions."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "ConCA", "def": "Concept Component Analysis; generative unmixing model for concept discovery."},
        ],
        "whatItShows": ["That concept components can be identified theoretically under generative unmixing assumptions"],
        "whatItDoesNotShow": ["Standard overcomplete TopK SAE training"],
        "setconcaUse": [
            "Direct theoretical competitor/complement to SetConCA sparse dictionary learning.",
        ],
        "masteryChecklist": [
            "I can contrast ConCA generative unmixing with SAE dictionary learning.",
        ],
        "commonConfusions": [
            {"wrong": "ConCA is just a standard L1 SAE.", "right": "ConCA is a generative unmixing model with posterior representation, closer to ICA than standard SAEs."},
        ],
        "quiz": [
            _q("What theoretical framework does ConCA use?", ["Generative linear unmixing with posterior representation", "SimCLR augmentation", "Deep Sets pooling", "Gram matrix CKA"], 0, "ConCA uses a generative linear unmixing framework with log-posterior representation."),
        ],
    },
    "mv-causal": {
        "whyWeRead": "Provides mathematical proofs for multi-view latent factor identifiability under partial observability.",
        "oneSentence": "Multi-View Causal Representation Learning with Partial Observability proves when latent factors can be identified from multiple partial views.",
        "plainLanguage": (
            "Welcome to Yao et al. (2023).\n\n"
            "Yao et al. provide theoretical identifiability proofs showing that when a single view is partial/incomplete, observing MULTIPLE PARTIAL VIEWS permits exact identification of underlying latent causal factors!\n\n"
            "SETCONCA THEORETICAL FOUNDATION:\n"
            "This paper provides the mathematical proof that multi-view set supervision fundamentally resolves single-view identifiability bottlenecks!"
        ),
        "keyIdeas": [
            _idea("Multi-View Latent Identifiability", "Proves latent causal factors are identifiable from multiple partial view observations."),
            _idea("Partial Observability Solution", "Multiple views overcome single-view information loss."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "Partial Observability", "def": "When a single view observes only a subset of latent causal variables."},
        ],
        "whatItShows": ["Mathematical proof that multi-view observations enable latent factor identifiability"],
        "whatItDoesNotShow": ["Practical SAE PyTorch implementation code"],
        "setconcaUse": [
            "Cite as the theoretical foundation for why multi-view set supervision enables concept recovery in SetConCA.",
        ],
        "masteryChecklist": [
            "I can explain why single views are partially observable and how multi-view resolves it.",
        ],
        "commonConfusions": [
            {"wrong": "Single views provide full latent identifiability.", "right": "Single views suffer from partial observability. Multi-view observations are required for identifiability."},
        ],
        "quiz": [
            _q("What does Yao et al. (2023) prove regarding multi-view observations?", ["Multiple partial views permit exact latent causal factor identification", "Multi-view causes collapse", "Single views are sufficient", "PCA is non-linear"], 0, "Proves multiple partial views permit exact latent causal factor identification."),
        ],
    },
}
