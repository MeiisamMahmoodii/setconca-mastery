"""Rich structured content for Toy Models of Superposition (2209.pdf)."""

SUPERPOSITION_RICH = {
    "source": "2209.pdf",
    "published": "Sept 14, 2022",
    "venue": "Transformer Circuits Thread (Anthropic)",
    "url": "https://transformer-circuits.pub/2022/toy_model/index.html",
    "abstract": (
        "Neural networks often pack many unrelated concepts into a single neuron — polysemanticity. "
        "This paper uses toy models (small ReLU networks on synthetic sparse features) to show that "
        "networks can represent more features than dimensions via superposition: almost-orthogonal "
        "directions in activation space, tolerating interference when features are sparse. "
        "Superposition is governed by phase changes, organizes features into geometric structures "
        "(digons, triangles, pentagons, tetrahedra), and may link to adversarial vulnerability."
    ),
    "keyResults": [
        "Superposition is a real, observed phenomenon in toy ReLU models",
        "Both monosemantic and polysemantic neurons can coexist in the same model",
        "At least some computation (e.g. absolute value) can run in superposition",
        "Whether a feature is stored in superposition is governed by a phase change",
        "Superposition organizes features into geometric structures: digons, triangles, pentagons, tetrahedra",
        "Linear models (PCA-like) never superpose; adding ReLU enables radically different solutions",
        "Adversarial vulnerability increases sharply (>3×) as superposition forms",
    ],
    "hierarchy": [
        {"level": "Decomposability", "desc": "Activations decompose into independently understandable features"},
        {"level": "Linearity", "desc": "Features are directions: x = Σ x_i W_i"},
        {"level": "Superposition", "desc": "W^T W not invertible — more features than dimensions, with interference"},
        {"level": "Basis-aligned", "desc": "Features align with neurons (privileged basis) — monosemantic when achieved"},
    ],
    "forces": [
        {"name": "Feature benefit", "desc": "Representing more features reduces loss (weighted MSE by importance I_i)"},
        {"name": "Interference", "desc": "Non-orthogonal features cause cross-talk; sparse activations reduce cost"},
        {"name": "Privileged basis", "desc": "Activation functions break symmetry — encourages neuron alignment"},
        {"name": "Superposition", "desc": "Pushes features off basis directions into almost-orthogonal arrangements"},
    ],
    "models": [
        {
            "name": "Linear model",
            "eq": "h = Wx; x' = W^T h + b  →  x' = W^T W x + b",
            "behavior": "PCA-like: stores top-m most important features orthogonally. Never superposes.",
        },
        {
            "name": "ReLU output model",
            "eq": "h = Wx; x' = ReLU(W^T h + b)",
            "behavior": "With sparse features, stores extra features non-orthogonally. Superposition emerges.",
        },
        {
            "name": "ReLU hidden layer model",
            "eq": "h = ReLU(Wx); x' = ReLU(W^T h + b)",
            "behavior": "Privileged basis: W maps features→neurons directly. Monosemantic vs polysemantic neurons.",
        },
    ],
    "syntheticData": [
        "Each x_i is a feature; zero with probability S_i (sparsity), else uniform [0,1]",
        "Importance I_i scales MSE contribution — higher I = more loss if misrepresented",
        "More features n than hidden dimensions m (n >> m)",
        "Uniform case: all S_i = S, all I_i = 1 for geometry analysis",
    ],
    "loss": "L = Σ_x Σ_i I_i (x_i − x'_i)²  — weighted reconstruction MSE",
    "featureDimensionality": {
        "formula": "D_i = ||W_i||² / Σ_j (Ŵ_i · W_j)²",
        "interpretation": "Numerator = how much feature i is represented. Denominator = how many features share its direction. D=1 dedicated dimension; D=½ antipodal pair; D=0 not learned.",
        "stickyPoints": [
            {"dim": 1.0, "geometry": "Dedicated dimension", "color": "#7ee787"},
            {"dim": 0.75, "geometry": "Tetrahedron (3D Thomson)", "color": "#6c9eff"},
            {"dim": 0.667, "geometry": "Triangle (equilateral)", "color": "#a78bfa"},
            {"dim": 0.5, "geometry": "Antipodal pair (digon)", "color": "#f0b060"},
            {"dim": 0.4, "geometry": "Pentagon", "color": "#f07178"},
            {"dim": 0.375, "geometry": "Square antiprism", "color": "#56d4dd"},
            {"dim": 0.0, "geometry": "Not learned", "color": "#8b95a8"},
        ],
    },
    "phaseDiagram": {
        "description": "2 features in 1 dimension: three strategies — ignore extra feature W⊥[0,1], dedicated dimension W⊥[1,0], antipodal superposition W=[1,-1]. Optimal strategy discontinuously switches with sparsity and relative importance — first-order phase change.",
        "outcomes": [
            {"id": "not_learned", "label": "Not learned", "color": "#8b95a8"},
            {"id": "superposition", "label": "Superposition (antipodal)", "color": "#f0b060"},
            {"id": "orthogonal", "label": "Dedicated dimension", "color": "#7ee787"},
        ],
    },
    "geometrySection": [
        "Uniform superposition → connection to uniform polytopes and Thomson problem",
        "Antipodal pairs (D=½) are sticky — model prefers them over wide sparsity range",
        "Features form feature geometry graphs: nodes=features, edges=|dot product|",
        "Non-uniform: pentagons deform smoothly until critical point, then snap to new polytope",
        "Correlated features prefer orthogonal arrangement (local almost-orthogonal bases)",
        "Anti-correlated features prefer same tegum factor with negative interference",
        "Correlated + capacity-limited → collapse to PCA principal component (a+b)/√2",
    ],
    "computationInSuperposition": [
        "Model computes y = |x| with ReLU: |x| = ReLU(x) + ReLU(−x)",
        "Without superposition: 2 neurons per feature (positive + negative side)",
        "With sparsity: neurons become polysemantic — primary + secondary features",
        "Asymmetric superposition motif: unequal weights W=[2,−½] with reciprocal outputs to control interference",
    ],
    "threeWaysOut": [
        {"approach": "1. Models without superposition", "desc": "L1 on activations works in toy models but likely hurts performance at scale. MoE may reduce superposition by recovering neuron sparsity as free FLOPs.", "saes": "Train with strong sparsity + wide dictionary — but performance tradeoff"},
        {"approach": "2. Find overcomplete basis (SAEs)", "desc": "Sparse coding / dictionary learning on activations. This is exactly the SAE research program. Challenge: no ground truth for feature count; interference already baked in.", "saes": "Core SetConCA / SAE approach — Approach 2 from the paper"},
        {"approach": "3. Hybrid", "desc": "Reduce superposition slightly (L1 reg) then decode remainder with SAE. Margin exists where d(loss)/d(superposition)=0.", "saes": "Practical pipeline: regularize then decompose"},
    ],
    "adversarial": "Superposition creates ε interference in W^T W off-diagonals → L2 adversarial attack surface. Vulnerability tracks features-per-dimension (1/D). Increases >3× as superposition forms.",
    "predictions": [
        "Polysemantic neurons increase with feature sparsity",
        "Later InceptionV1 layers more polysemantic (higher-level = sparser features)",
        "Early Transformer MLP neurons extremely polysemantic (token disambiguation = sparse)",
        "Mixture of Experts may show less superposition (eats sparsity gap)",
    ],
    "openQuestions": [
        "Statistical test for superposition in real models?",
        "Closed-form solutions for ReLU toy models?",
        "Feature importance and sparsity curves for real LMs?",
        "Does scaling eliminate superposition or keep constant fraction?",
        "How much computation is possible in superposition beyond storage?",
    ],
    "setconcaLinks": [
        "SAEs are explicitly 'Approach 2: Finding an Overcomplete Basis' from this paper",
        "Reconstruction quality alone does not prove monosemanticity — interference is tolerated",
        "Multi-view SetConCA must handle correlated features (local orthogonal bases) and anti-correlated features (negative interference preference)",
        "Phase changes explain why small hyperparameter changes suddenly alter feature geometry — relevant for SAE seed stability",
        "Feature dimensionality D_i is a metric you could track across SetConCA views",
        "PCA vs superposition tradeoff reappears when correlated views collapse to principal components",
    ],
    "comparisonTable": [
        ["Linear / PCA", "Max variance, orthogonal", "m features max", "No interference", "Not interpretable"],
        ["Superposition (ReLU)", "Max weighted recon", ">> m features", "Tolerated when sparse", "Polysemantic neurons"],
        ["SAE / dictionary learning", "Sparse recon of activations", "Overcomplete dict", "Explicit sparsity penalty", "More monosemantic features"],
        ["SetConCA (your work)", "Sparse dict + multi-view alignment", "Overcomplete + set agg", "Sparsity + contrastive coord", "Goal: stable concept recovery"],
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
        "Discussion and Open Questions",
    ],
}
