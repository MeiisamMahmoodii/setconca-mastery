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
            "Two networks can encode the same information with different neuron coordinates. "
            "Coordinate-wise comparison fails. SVCCA first reduces each representation with SVD, then runs CCA to measure shared subspace structure.\n\n"
            "High SVCCA means similar subspaces — not that individual features match."
        ),
        "keyIdeas": [
            _idea("Subspace comparison", "Compare spaces, not neuron indices."),
            _idea("SVD then CCA", "Denoise/reduce, then measure canonical correlations."),
            _idea("Affine invariance motivation", "Allow different bases."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "SVCCA", "def": "Singular Vector Canonical Correlation Analysis."},
            {"term": "Subspace similarity", "def": "Overlap of representational spaces ignoring basis choice."},
        ],
        "whatItShows": ["Representations can be similar as subspaces across training/layers"],
        "whatItDoesNotShow": ["Same individual concepts", "Causal mechanisms"],
        "setconcaUse": [
            "Compare SetConCA codes vs pointwise SAE with SVCCA/CKA.",
            "Never equate high SVCCA with identical features.",
        ],
        "masteryChecklist": [
            "I know what SVCCA compares.",
            "I know what it does not prove.",
        ],
        "commonConfusions": [
            {"wrong": "SVCCA = feature matching.", "right": "It is subspace correlation, not one-to-one features."},
        ],
        "quiz": [
            _q("SVCCA primarily measures?", ["Subspace similarity via CCA after SVD", "Monosemanticity", "L0 sparsity", "Steering effect"], 0, "Subspace tool."),
        ],
    },
    "cka": {
        "whyWeRead": "Most practical representation similarity metric for your comparisons.",
        "oneSentence": "CKA compares representations using Gram matrices; linear and kernel variants; invariant to orthogonal transforms.",
        "plainLanguage": (
            "CKA asks: do two representation matrices induce similar similarity structures across examples? "
            "It uses Gram matrices (pairwise relationships among examples) rather than trying to match neuron i to neuron j.\n\n"
            "Linear CKA is common and fast. Kernel CKA can capture more structure. "
            "Orthogonal transforms do not change CKA — good, because bases are arbitrary.\n\n"
            "High CKA ≠ same concepts. It means similar geometry of examples."
        ),
        "keyIdeas": [
            _idea("Gram matrix view", "Compare example–example similarity patterns."),
            _idea("Orthogonal invariance", "Rotating features doesn't change CKA."),
            _idea("Linear vs kernel CKA", "Kernel can be more expressive."),
            _idea("Coordinate matching is misleading", "Do not require neuron alignment."),
        ],
        "simplifiedMath": [
            {"name": "CKA idea", "formula": "CKA(X,Y) ∝ HSIC(X,Y)/√(HSIC(X,X)HSIC(Y,Y))", "meaning": "Normalised similarity of centered Gram structures."},
        ],
        "vocabulary": [
            {"term": "CKA", "def": "Centered Kernel Alignment — representation similarity."},
            {"term": "Gram matrix", "def": "Matrix of pairwise similarities among examples."},
        ],
        "whatItShows": ["When two nets organise examples similarly"],
        "whatItDoesNotShow": ["Identical concepts", "Causal sharing"],
        "setconcaUse": [
            "Primary similarity metric across methods/seeds.",
            "Pair with probes and interventions.",
        ],
        "masteryChecklist": [
            "I can explain CKA without saying 'neuron matching'.",
            "I can state its non-claims.",
        ],
        "commonConfusions": [
            {"wrong": "CKA high means same SAE features.", "right": "Means similar example geometry."},
        ],
        "quiz": [
            _q("CKA is invariant to?", ["Orthogonal transforms", "Arbitrary nonlinear warps always", "Relabeling classes only", "Changing the dataset freely"], 0, "Orthogonal invariance is key."),
        ],
    },
    "probe-control": {
        "whyWeRead": "Stops you from overclaiming when a probe 'finds' a property in a representation.",
        "oneSentence": "Introduces control tasks and selectivity so probe accuracy is not mistaken for linguistic structure in the representation.",
        "plainLanguage": (
            "A probe is a supervised model predicting a property from frozen representations. "
            "High accuracy can mean (1) the property is organised in the representation, (2) the probe memorised, or (3) the property is easy for the probe architecture.\n\n"
            "Control tasks assign random outputs with similar structure. Selectivity compares real-task accuracy vs control-task accuracy. "
            "High selectivity suggests the representation — not just the probe — carries the property accessibly."
        ),
        "keyIdeas": [
            _idea("Probe pitfalls", "Accuracy ≠ structure."),
            _idea("Control tasks", "Randomised targets with matched complexity."),
            _idea("Selectivity", "Real vs control performance gap."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "Probe", "def": "Supervised decoder trained on frozen representations."},
            {"term": "Selectivity", "def": "Difference between linguistic-task and control-task probe performance."},
        ],
        "whatItShows": ["How to interpret probes more carefully"],
        "whatItDoesNotShow": ["Causal use of the property by the network"],
        "setconcaUse": [
            "Any claim 'concepts are decodable from SetConCA codes' needs controls.",
        ],
        "masteryChecklist": [
            "I can define selectivity.",
            "I refuse probe accuracy alone as proof.",
        ],
        "commonConfusions": [
            {"wrong": "Probe accuracy proves the model uses the feature.", "right": "It proves extractability under the probe class."},
        ],
        "quiz": [
            _q("Control tasks help detect?", ["Probe memorisation / easy decoding", "GPU temperature", "PDF size", "BatchNorm"], 0, "Selectivity vs controls."),
        ],
    },
    "mdl-probe": {
        "whyWeRead": "Distinguishes 'information exists' from 'information is efficiently organised'.",
        "oneSentence": "MDL probing measures how much description length is needed to learn a property from a representation.",
        "plainLanguage": (
            "Even if a probe can eventually reach high accuracy, the property might be buried and hard to extract. "
            "Minimum Description Length probing asks how efficiently the probe can learn — shorter description length means more accessible organisation.\n\n"
            "High accuracy + high description length: information exists but is messy. "
            "High accuracy + low description length: information is neatly organised."
        ),
        "keyIdeas": [
            _idea("Existence vs accessibility", "Decodable ≠ easily organised."),
            _idea("MDL principle", "Prefer short codes for the labelling rule given the representation."),
            _idea("Complement to accuracy", "Report both."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "MDL probing", "def": "Probe evaluation via minimum description length / online coding."},
        ],
        "whatItShows": ["Organisation efficiency of information in representations"],
        "whatItDoesNotShow": ["Causal necessity"],
        "setconcaUse": [
            "If SetConCA claims better concept organisation, MDL is a fitting metric.",
        ],
        "masteryChecklist": [
            "I can contrast accuracy vs description length.",
        ],
        "commonConfusions": [
            {"wrong": "Same accuracy means same representation quality.", "right": "Learning effort/MDL can differ."},
        ],
        "quiz": [
            _q("Low description length suggests?", ["Property is organised accessibly", "Model is smaller only", "No information", "Infinite sparsity"], 0, "Accessible organisation."),
        ],
    },
    "transformer-circuits": {
        "whyWeRead": "Gives the residual-stream / circuit vocabulary for where SAE features live.",
        "oneSentence": "A framework treating transformers as circuits on a residual stream with attention as QK/OV operations.",
        "plainLanguage": (
            "Think of the residual stream as a shared communication bus. Each layer reads from it and writes updates back. "
            "Attention heads can be factored into QK circuits (where to attend) and OV circuits (what to write).\n\n"
            "Mechanistic interpretability studies these paths, not only input–output correlations. "
            "SAE features are often analysed as directions in residual-stream activations."
        ),
        "keyIdeas": [
            _idea("Residual stream", "Running embedding that blocks read/write."),
            _idea("QK circuit", "Computes attention patterns."),
            _idea("OV circuit", "Moves values into the stream."),
            _idea("Paths / circuits", "Compositional routes of information."),
            _idea("Mechanistic vs correlational", "Intervention-based understanding."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "Residual stream", "def": "The main residual pathway carrying activations through the transformer."},
            {"term": "Circuit", "def": "A subgraph of model components implementing a behaviour."},
        ],
        "whatItShows": ["A productive language for analysing transformer internals"],
        "whatItDoesNotShow": ["Automatic discovery of all circuits"],
        "setconcaUse": [
            "Specify which residual sites your views come from.",
            "Plan interventions on SAE directions in the stream.",
        ],
        "masteryChecklist": [
            "I can explain residual stream, QK, OV in one minute.",
        ],
        "commonConfusions": [
            {"wrong": "Neurons alone are the right unit always.", "right": "Directions/circuits in the stream often matter more."},
        ],
        "quiz": [
            _q("OV circuits mainly handle?", ["What information is written", "Only tokenisation", "Only dropout", "Only FVU"], 0, "OV moves values."),
        ],
    },
    "superposition": {
        "whyWeRead": "Conceptual foundation for why SAEs exist — more features than dimensions.",
        "oneSentence": "Toy ReLU models demonstrate superposition, phase changes, geometric feature packing, and why polysemantic neurons appear.",
        "plainLanguage": (
            "When features are sparse, a network can store more features than it has dimensions by packing them into almost-orthogonal directions. "
            "Interference is the cost; nonlinearities can filter small interference.\n\n"
            "Whether a feature is ignored, superposed, or given a dedicated dimension depends on sparsity and importance — often as a phase change. "
            "Features form geometric arrangements (antipodal pairs, triangles, pentagons…).\n\n"
            "SAEs are the practical response: find an overcomplete sparse dictionary that unfolds superposed features. "
            "This paper literally lists that as Approach 2."
        ),
        "keyIdeas": [
            _idea("Superposition hypothesis", "More features than neurons via almost-orthogonal directions."),
            _idea("Polysemantic neurons", "One neuron responds to unrelated features."),
            _idea("Feature benefit vs interference", "Two competing forces."),
            _idea("Phase changes", "Sharp transitions between strategies."),
            _idea("Feature dimensionality D_i", "Fraction of a dimension a feature gets."),
            _idea("Computation in superposition", "Even abs() circuits can run while packed."),
            _idea("Three ways out", "No superposition / overcomplete basis (SAEs) / hybrid."),
        ],
        "simplifiedMath": [
            {"name": "Feature dimensionality", "formula": "D_i = ||W_i||² / Σ_j (Ŵ_i·W_j)²", "meaning": "How much of its dimension a feature owns after interference."},
            {"name": "Linear vs ReLU toy", "formula": "x' = WᵀWx vs ReLU(WᵀWx+b)", "meaning": "ReLU enables superposition solutions linear models lack."},
        ],
        "vocabulary": [
            {"term": "Superposition", "def": "Representing more features than dimensions with interference."},
            {"term": "Polysemantic", "def": "Unit activates for multiple unrelated concepts."},
            {"term": "Privileged basis", "def": "Architecture makes neuron axes special (e.g. after nonlinearity)."},
        ],
        "whatItShows": ["Superposition occurs in natural toy setups", "Phase structure and geometry", "Link to adversarial vulnerability"],
        "whatItDoesNotShow": ["Exact feature geometry of large LMs", "That SAEs uniquely recover ground truth"],
        "setconcaUse": [
            "Justify SAEs as Approach 2.",
            "Expect phase-sensitive behaviour when adding multi-view terms.",
            "Track interference/correlation between concept views.",
        ],
        "masteryChecklist": [
            "I can explain superposition to a beginner.",
            "I can name the three ways out.",
            "I know D=1/2 means antipodal packing.",
        ],
        "commonConfusions": [
            {"wrong": "More parameters always removes superposition.", "right": "Depends on sparsity/importance; may persist at scale."},
            {"wrong": "SAEs are Approach 1.", "right": "SAEs are overcomplete basis finding (Approach 2)."},
        ],
        "quiz": [
            _q("Superposition stores?", ["More features than dimensions", "Fewer features always", "Only labels", "Only PCA comps"], 0, "Packed almost-orthogonal features."),
            _q("SAEs correspond to which way out?", ["Overcomplete basis after the fact", "Delete all MLP layers", "Only adversarial training", "Ignore sparsity"], 0, "Approach 2."),
            _q("Linear toy models superpose like ReLU toys?", ["No — ReLU enables it", "Yes always", "Only with CKA", "Only with probes"], 0, "Nonlinearity matters."),
        ],
    },
    "monosemanticity": {
        "whyWeRead": "Landmark application of dictionary learning to LM activations — features vs neurons.",
        "oneSentence": "Shows sparse dictionary learning can extract more monosemantic features than neurons in a small LM.",
        "plainLanguage": (
            "Towards Monosemanticity trains sparse autoencoders on transformer activations and studies the resulting features. "
            "Many features look more monosemantic than neurons. Dictionary width and sparsity trade off against reconstruction.\n\n"
            "They discuss feature splitting and residual polysemanticity. "
            "Interpretation mixes manual and automated methods. "
            "This sets cultural expectations for SAE research: show features, interventions, and limitations."
        ),
        "keyIdeas": [
            _idea("Features vs neurons", "Directions can be cleaner units than basis neurons."),
            _idea("Dictionary learning on activations", "SAE as dictionary."),
            _idea("Interpretability evidence", "Examples, activation histograms, interventions."),
            _idea("Splitting / leftover polysemanticity", "Not perfect decomposition."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "Dictionary learning", "def": "Learning sparse codes over an overcomplete basis."},
            {"term": "Feature splitting", "def": "One concept spread across multiple dictionary features."},
        ],
        "whatItShows": ["SAE features can be highly interpretable relative to neurons in studied settings"],
        "whatItDoesNotShow": ["Completeness or uniqueness of the dictionary"],
        "setconcaUse": [
            "Adopt their qualitative+intervention reporting style.",
            "Expect splitting as a failure mode to measure.",
        ],
        "masteryChecklist": [
            "I can explain why features beat neurons under superposition.",
            "I can list limitations they emphasise.",
        ],
        "commonConfusions": [
            {"wrong": "Monosemanticity paper proves SAEs solve interpretability.", "right": "It shows promising decomposition with remaining issues."},
        ],
        "quiz": [
            _q("Main empirical claim?", ["SAE features can be more monosemantic than neurons", "PCA is enough", "Attention is unused", "Probes replace SAEs"], 0, "Dictionary features vs neurons."),
        ],
    },
    "cunningham-sae": {
        "whyWeRead": "Central academic SAE paper — architecture, objectives, interventions, comparisons.",
        "oneSentence": "Trains SAEs on LM activations showing sparse features are more interpretable and useful for interventions than alternatives.",
        "plainLanguage": (
            "This paper presents sparse autoencoders that reconstruct activations under a sparsity penalty, then evaluates feature interpretability and causal usefulness via interventions.\n\n"
            "Comparisons against neurons and other decompositions matter. "
            "Take the methodology: reconstruction+sparsity training, qualitative interpretation, and activation interventions."
        ),
        "keyIdeas": [
            _idea("SAE objective", "Reconstruct activations + sparsity."),
            _idea("Feature interpretation", "Human/automated descriptions of when features fire."),
            _idea("Interventions", "Clamp/ablate features to test effects."),
            _idea("Baselines", "Neurons and other decompositions."),
        ],
        "simplifiedMath": [
            {"name": "Typical SAE loss", "formula": "‖x−x̂‖² + λ Sparsity(z)", "meaning": "Fidelity plus sparse codes z=enc(x), x̂=dec(z)."},
        ],
        "vocabulary": [
            {"term": "SAE", "def": "Sparse autoencoder on model activations."},
            {"term": "Activation intervention", "def": "Edit feature activations to test causal effects."},
        ],
        "whatItShows": ["Sparse dictionary features can be interpretable and intervention-relevant"],
        "whatItDoesNotShow": ["Canonical uniqueness", "Perfect completeness"],
        "setconcaUse": [
            "Pointwise SAE from this lineage is your primary baseline.",
            "Replicate intervention-style evaluations.",
        ],
        "masteryChecklist": [
            "I can write the SAE loss in words.",
            "I know why interventions matter beyond FVU.",
        ],
        "commonConfusions": [
            {"wrong": "Interpretable examples prove the dictionary is complete.", "right": "Examples are existence proofs, not completeness."},
        ],
        "quiz": [
            _q("SAE training typically minimises?", ["Reconstruction + sparsity", "Only CKA", "Only InfoNCE", "Only accuracy"], 0, "Classic SAE objective."),
        ],
    },
    "scaling-mono": {
        "whyWeRead": "Shows what happens when SAE dictionaries scale to frontier models — and what scale does not buy.",
        "oneSentence": "Scales monosemantic feature extraction to Claude 3 Sonnet with very large dictionaries.",
        "plainLanguage": (
            "Scaling dictionaries extracts many fascinating features, including safety-relevant ones. "
            "But scale alone does not guarantee completeness, uniqueness, or a canonical decomposition.\n\n"
            "Read this to calibrate ambition: impressive features ≠ solved interpretability."
        ),
        "keyIdeas": [
            _idea("Scale features & models", "Large dictionaries on large LMs."),
            _idea("Rich feature zoo", "Many interpretable features appear."),
            _idea("Limits remain", "Completeness/uniqueness unresolved."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "Dictionary width", "def": "Number of learned features."},
        ],
        "whatItShows": ["SAE methods scale to large models with interesting features"],
        "whatItDoesNotShow": ["Canonical units of analysis"],
        "setconcaUse": [
            "Do not claim scale replaces careful multi-view evaluation.",
        ],
        "masteryChecklist": [
            "I can separate 'many cool features' from 'problem solved'.",
        ],
        "commonConfusions": [
            {"wrong": "Bigger dictionary ⇒ true concepts.", "right": "Bigger can also mean more splitting/noise features."},
        ],
        "quiz": [
            _q("Scaling monosemanticity shows scale alone?", ["Does not guarantee canonical decomposition", "Solves absorption", "Removes need for sparsity", "Replaces probes"], 0, "Limits remain."),
        ],
    },
    "topk-sae": {
        "whyWeRead": "Main modern reference for TopK SAEs, scaling, and matched evaluation frontiers.",
        "oneSentence": "Scales and evaluates SAEs with TopK activations, emphasising fair comparisons at matched sparsity/fidelity.",
        "plainLanguage": (
            "TopK SAEs enforce exact sparsity without L1 shrinkage of active magnitudes. "
            "Gao et al. study how dictionary width, sparsity, and reconstruction trade off as models scale.\n\n"
            "Key methodological point: compare SAEs at similar L0 or similar FVU — not at each method's favourite hyperparameter."
        ),
        "keyIdeas": [
            _idea("TopK activation", "Exact k actives per token (or site)."),
            _idea("Expansion / width", "Dictionary size relative to activation dim."),
            _idea("Reconstruction–sparsity frontier", "Pareto thinking."),
            _idea("Matched comparisons", "Fair operating points."),
        ],
        "simplifiedMath": [
            {"name": "TopK SAE", "formula": "z=TopK(enc(x),k), x̂=dec(z)", "meaning": "Hard sparsity then decode."},
        ],
        "vocabulary": [
            {"term": "Expansion factor", "def": "dictionary_width / d_model (roughly)."},
            {"term": "L0", "def": "Average number of active features."},
        ],
        "whatItShows": ["TopK scales; evaluation must be frontier-aware"],
        "whatItDoesNotShow": ["That TopK solves absorption/non-canonicality"],
        "setconcaUse": [
            "Default architecture family for baselines.",
            "Always plot Pareto curves for variants.",
        ],
        "masteryChecklist": [
            "I can explain TopK vs L1.",
            "I insist on matched sparsity/fidelity comparisons.",
        ],
        "commonConfusions": [
            {"wrong": "Best paper numbers at any hyperparams are comparable.", "right": "Compare on the same frontier point."},
        ],
        "quiz": [
            _q("Fair SAE comparison needs?", ["Matched sparsity or fidelity", "Only biggest width", "Only lowest loss anywhere", "Only CKA"], 0, "Operating point matching."),
        ],
    },
    "gated-sae": {
        "whyWeRead": "Fixes L1 shrinkage by separating gate (whether active) from magnitude.",
        "oneSentence": "Gated SAEs improve the sparsity–fidelity Pareto by decoupling activation and magnitude.",
        "plainLanguage": (
            "L1 penalties encourage sparsity but also shrink the magnitude of active features (shrinkage), hurting reconstruction. "
            "Gated SAEs use a gate to decide if a feature is on, and a separate path for magnitude.\n\n"
            "Result: better tradeoffs on the Pareto frontier versus standard L1 SAEs."
        ),
        "keyIdeas": [
            _idea("Shrinkage problem", "L1 reduces active magnitudes."),
            _idea("Gate vs magnitude", "Two roles separated."),
            _idea("Pareto improvement", "Better recon at given sparsity."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "Shrinkage", "def": "Underestimation of active feature magnitudes due to L1."},
            {"term": "Gated SAE", "def": "SAE with separate gating and magnitude pathways."},
        ],
        "whatItShows": ["Architectural fix for L1 shrinkage"],
        "whatItDoesNotShow": ["Canonical features"],
        "setconcaUse": [
            "Include Gated SAE in architecture bake-offs.",
        ],
        "masteryChecklist": [
            "I can explain shrinkage and how gating helps.",
        ],
        "commonConfusions": [
            {"wrong": "Gating is only for MoE routers.", "right": "Here gating is inside the SAE feature activation."},
        ],
        "quiz": [
            _q("Gated SAEs mainly address?", ["L1 magnitude shrinkage", "Tokenisation", "Dropout only", "CKA only"], 0, "Separate gate/magnitude."),
        ],
    },
    "jumprelu": {
        "whyWeRead": "Learned thresholds and more direct L0-style sparsity — why plain L1 is no longer default.",
        "oneSentence": "JumpReLU SAEs use a discontinuous thresholded activation to improve reconstruction fidelity under sparsity.",
        "plainLanguage": (
            "JumpReLU introduces a jump discontinuity / threshold: below threshold the feature is off; above it contributes. "
            "This approximates hard sparsity better than soft L1 and can improve fidelity at a given sparsity level.\n\n"
            "Together with TopK and Gated, it shows the field moved past vanilla L1 SAEs."
        ),
        "keyIdeas": [
            _idea("Learned threshold", "Feature-specific activation barrier."),
            _idea("L0-style goal", "Penalise count of actives more directly."),
            _idea("Fidelity gains", "Better recon–sparsity tradeoffs reported."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "JumpReLU", "def": "ReLU-like activation with a jump/threshold for sparsity."},
        ],
        "whatItShows": ["Thresholded activations help SAE frontiers"],
        "whatItDoesNotShow": ["Unique correct features"],
        "setconcaUse": [
            "Include JumpReLU in matched Pareto comparisons.",
        ],
        "masteryChecklist": [
            "I can place JumpReLU among TopK/Gated/L1.",
        ],
        "commonConfusions": [
            {"wrong": "JumpReLU removes need for evaluation.", "right": "Architecture ≠ interpretability proof."},
        ],
        "quiz": [
            _q("JumpReLU emphasises?", ["Learned thresholds / L0-like sparsity", "Only CCA", "Only probes", "Only Deep Sets"], 0, "Thresholded activation."),
        ],
    },
    "batchtopk": {
        "whyWeRead": "Relaxes per-token exact-k to a batch sparsity budget — flexible for heterogeneous activations.",
        "oneSentence": "BatchTopK constrains total actives across a batch so hard tokens can use more features.",
        "plainLanguage": (
            "Exact TopK forces every token to use the same number of features. "
            "Some activations are simple; some are complex. BatchTopK shares a sparsity budget across the batch.\n\n"
            "This can improve allocation efficiency while keeping an overall L0 target."
        ),
        "keyIdeas": [
            _idea("Batch-level cardinality", "Sparsity across many tokens."),
            _idea("Heterogeneous difficulty", "Hard examples get more features."),
            _idea("Still TopK family", "Hard selection, not L1."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "BatchTopK", "def": "TopK applied with a batch-wide sparsity constraint."},
        ],
        "whatItShows": ["Flexible sparsity allocation helps"],
        "whatItDoesNotShow": ["Solved absorption"],
        "setconcaUse": [
            "Useful when views/tokens vary wildly in complexity.",
        ],
        "masteryChecklist": [
            "I can contrast per-token TopK vs BatchTopK.",
        ],
        "commonConfusions": [
            {"wrong": "BatchTopK means no sparsity.", "right": "It redistributes a fixed budget."},
        ],
        "quiz": [
            _q("BatchTopK allows?", ["Variable actives per token under a batch budget", "Infinite actives", "No decoder", "Only PCA"], 0, "Shared budget."),
        ],
    },
    "matryoshka": {
        "whyWeRead": "Multi-level nested features — relevant to atomic vs high-level concepts.",
        "oneSentence": "Matryoshka SAEs learn useful features at multiple sparsity/prefix levels within one dictionary.",
        "plainLanguage": (
            "Choosing dictionary size creates tension: small dictionaries merge concepts; large ones split. "
            "Matryoshka training encourages nested subsets of features to remain useful at multiple granularities.\n\n"
            "This connects to questions about hierarchical concepts in SetConCA."
        ),
        "keyIdeas": [
            _idea("Nested dictionaries", "Prefixes of features remain meaningful."),
            _idea("Multi-granularity", "Coarse and fine features together."),
            _idea("Dictionary-size tension", "Motivates nested training."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "Matryoshka representation", "def": "Nested multi-size useful prefixes of a representation."},
        ],
        "whatItShows": ["One SAE can serve multiple sparsity levels"],
        "whatItDoesNotShow": ["True ontological hierarchy of language"],
        "setconcaUse": [
            "Inspiration for multi-granularity concept structure.",
        ],
        "masteryChecklist": [
            "I can explain the dictionary-size tension Matryoshka targets.",
        ],
        "commonConfusions": [
            {"wrong": "Nested training proves hierarchy is correct.", "right": "It encourages multi-scale usefulness."},
        ],
        "quiz": [
            _q("Matryoshka SAEs aim for?", ["Useful multi-level / nested features", "Only one active feature ever", "Removing sparsity", "Only CKA"], 0, "Nested granularities."),
        ],
    },
    "principled-eval": {
        "whyWeRead": "Shows reconstruction/sparsity proxies are insufficient for interpretability and control claims.",
        "oneSentence": "Argues for evaluations tied to task-relevant approximation, control, and interpretation.",
        "plainLanguage": (
            "A nice FVU and L0 do not mean features support the interventions or interpretations you care about. "
            "This paper pushes evaluations that test whether SAE features help approximate and control model behaviour on tasks.\n\n"
            "Internalise: proxy metrics are necessary hygiene, not the scientific endpoint."
        ),
        "keyIdeas": [
            _idea("Proxy insufficiency", "Recon+sparsity ≠ interpretability."),
            _idea("Control & task relevance", "Test useful interventions."),
            _idea("Principled eval design", "Align metrics with claims."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "Proxy metric", "def": "Easy measure that may not track the true goal."},
        ],
        "whatItShows": ["Need claim-aligned evaluations"],
        "whatItDoesNotShow": ["A single universal SAE score"],
        "setconcaUse": [
            "Write claims first, then pick metrics that could falsify them.",
        ],
        "masteryChecklist": [
            "I refuse FVU-only papers as sufficient.",
        ],
        "commonConfusions": [
            {"wrong": "Best FVU SAE is best interpretable SAE.", "right": "Not necessarily."},
        ],
        "quiz": [
            _q("Principled evaluations emphasise?", ["Task-relevant control/interpretation not just proxies", "Only lower L0", "Only wider dictionaries", "Only faster training"], 0, "Claim-aligned tests."),
        ],
    },
    "absorption": {
        "whyWeRead": "Defines feature splitting and absorption — core SAE failure modes.",
        "oneSentence": "Studies how SAE features split concepts across latents or absorb related concepts into one latent.",
        "plainLanguage": (
            "Splitting: one concept distributed across several features. "
            "Absorption: one feature captures several related concepts (often hierarchical or correlated).\n\n"
            "Both break the naive hope that each latent is one atomic concept. "
            "Any SetConCA claim about concept recovery must measure these."
        ),
        "keyIdeas": [
            _idea("Feature splitting", "Fragmentation of one concept."),
            _idea("Feature absorption", "Merger of related concepts."),
            _idea("Measurement methods", "Track how concepts map to latents."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "Absorption", "def": "One feature eating multiple related concepts."},
            {"term": "Splitting", "def": "One concept spread over multiple features."},
        ],
        "whatItShows": ["Systematic failure modes of SAE feature = concept"],
        "whatItDoesNotShow": ["That multi-view automatically fixes them"],
        "setconcaUse": [
            "Primary failure modes to beat with multi-view supervision — if you can demonstrate it.",
        ],
        "masteryChecklist": [
            "I can define splitting vs absorption with examples.",
        ],
        "commonConfusions": [
            {"wrong": "More sparsity prevents absorption always.", "right": "Correlated concepts can still merge, especially in narrow dictionaries."},
        ],
        "quiz": [
            _q("Absorption means?", ["One feature captures several related concepts", "No features fire", "Only PCA", "Only CKA"], 0, "Merged concepts."),
        ],
    },
    "non-canonical": {
        "whyWeRead": "Critical narrative paper: SAEs need not find unique units of analysis.",
        "oneSentence": "Argues different SAEs can yield different decompositions while all looking reasonable; studies stitching and higher-level structure.",
        "plainLanguage": (
            "If two SAEs both reconstruct well and look interpretable but disagree on features, there is no single canonical sparse basis. "
            "This undermines 'we found the true features' rhetoric.\n\n"
            "Stitching analyses and higher-level structure become important. "
            "For SetConCA: aim for stability and causal usefulness under stated assumptions — not metaphysical uniqueness."
        ),
        "keyIdeas": [
            _idea("Non-uniqueness", "Many good dictionaries possible."),
            _idea("Stitching", "Relate features across SAEs."),
            _idea("Units of analysis", "What we treat as atomic may be convention."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "Canonical decomposition", "def": "A unique privileged feature basis — often unavailable."},
            {"term": "Stitching", "def": "Mapping/aligning features between dictionaries."},
        ],
        "whatItShows": ["Reasonable SAEs need not agree"],
        "whatItDoesNotShow": ["That interpretability is impossible"],
        "setconcaUse": [
            "Frame contributions as stability/completeness/causal utility under assumptions.",
            "Cross-seed and cross-architecture agreement tests.",
        ],
        "masteryChecklist": [
            "I can explain non-canonical decompositions.",
            "I avoid 'the true features' claims.",
        ],
        "commonConfusions": [
            {"wrong": "Disagreement means SAEs are useless.", "right": "Means uniqueness fails; usefulness can remain."},
        ],
        "quiz": [
            _q("Non-canonical means?", ["Different good SAEs can disagree on features", "SAEs never reconstruct", "Probes always fail", "CCA is impossible"], 0, "No unique units."),
        ],
    },
    "saebench": {
        "whyWeRead": "Standard multi-family benchmark suite you should know and partially replicate.",
        "oneSentence": "A comprehensive benchmark covering detection, probing, steering, reconstruction, and more for SAEs.",
        "plainLanguage": (
            "SAEBench gathers multiple evaluation families so progress is not judged by one proxy. "
            "Feature detection, sparse probing, steering/interventions, and reconstruction/sparsity all appear.\n\n"
            "Proxy metrics do not always predict downstream usefulness — another reason for a suite."
        ),
        "keyIdeas": [
            _idea("Multiple families", "Broad coverage of claims."),
            _idea("Sparse probing / detection", "Find known concepts."),
            _idea("Steering", "Control behaviour via features."),
            _idea("Proxy vs downstream", "Not always aligned."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "SAEBench", "def": "Benchmark suite for sparse autoencoders."},
        ],
        "whatItShows": ["A practical evaluation menu for SAE methods"],
        "whatItDoesNotShow": ["That every metric is perfectly reliable (see next paper)"],
        "setconcaUse": [
            "Adopt a subset of SAEBench families in your protocol.",
        ],
        "masteryChecklist": [
            "I can name several SAEBench evaluation families.",
        ],
        "commonConfusions": [
            {"wrong": "Winning one SAEBench metric wins interpretability.", "right": "Look across families."},
        ],
        "quiz": [
            _q("SAEBench's point is?", ["Multiple evaluation families", "Only FVU", "Only width", "Only speed"], 0, "Broad suite."),
        ],
    },
    "bench-reliable": {
        "whyWeRead": "Audits SAEBench-style metrics — read after SAEBench to calibrate trust.",
        "oneSentence": "Finds some SAE evaluation signals are less reliable than assumed (noise, weak ground-truth correlation).",
        "plainLanguage": (
            "Even standard benchmarks can be noisy across reseeds or poorly correlated with ground truth in synthetic settings. "
            "This paper audits metric reliability so you do not overfit a flaky leaderboard.\n\n"
            "Practice: report uncertainty, multiple seeds, and treat weak metrics as weak evidence."
        ),
        "keyIdeas": [
            _idea("Reseed noise", "Scores vary across seeds."),
            _idea("Ground-truth correlation", "Synthetic checks of metric validity."),
            _idea("Calibrated trust", "Not all benchmarks are equal."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "Metric reliability", "def": "Stability and validity of an evaluation score."},
        ],
        "whatItShows": ["Some popular SAE metrics are fragile"],
        "whatItDoesNotShow": ["That evaluation is hopeless"],
        "setconcaUse": [
            "Multi-seed reporting; avoid single-run leaderboard chasing.",
        ],
        "masteryChecklist": [
            "I read SAEBench before this and know why order matters.",
            "I report uncertainty.",
        ],
        "commonConfusions": [
            {"wrong": "Benchmarks are ground truth.", "right": "They are instruments with error bars."},
        ],
        "quiz": [
            _q("Read this paper?", ["After SAEBench", "Before learning PCA", "Instead of all evals", "Never"], 0, "Calibrate after knowing the suite."),
        ],
    },
    "feature-hedging": {
        "whyWeRead": "Optional: correlated features break narrow SAEs — motivates width and multi-view disambiguation.",
        "oneSentence": "Shows correlated features cause problems for narrow sparse autoencoders (feature hedging).",
        "plainLanguage": (
            "When concepts co-occur, a narrow dictionary may hedge by merging or misallocating features. "
            "Width and better supervision can help.\n\n"
            "Connects to absorption and to why multi-view signal might disambiguate correlated concepts."
        ),
        "keyIdeas": [
            _idea("Correlation stress test", "Co-occurring concepts stress SAEs."),
            _idea("Narrow dictionaries fail first", "Width matters."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "Feature hedging", "def": "Degenerate solutions under correlated features in narrow SAEs."},
        ],
        "whatItShows": ["Correlated features specifically break narrow SAEs"],
        "whatItDoesNotShow": ["Full fix via multi-view without experiments"],
        "setconcaUse": [
            "Motivation for multi-view disambiguation experiments.",
        ],
        "masteryChecklist": [
            "I can link correlation → merging/hedging.",
        ],
        "commonConfusions": [
            {"wrong": "Sparsity alone separates correlated concepts.", "right": "Correlation can still force merges."},
        ],
        "quiz": [
            _q("Narrow SAEs struggle especially with?", ["Correlated features", "Unit batch size only", "CPU only", "PNG images only"], 0, "Correlation stress."),
        ],
    },
    "geometric-wall": {
        "whyWeRead": "Optional: intrinsic geometry of activations predicts SAE scaling limits by layer.",
        "oneSentence": "Links manifold structure of activations to layerwise SAE scaling laws — a geometric wall.",
        "plainLanguage": (
            "Not all layers are equally easy for SAEs. Intrinsic geometric structure can bound how dictionaries scale. "
            "Useful when choosing layers/sites for SetConCA views."
        ),
        "keyIdeas": [
            _idea("Layerwise difficulty", "Geometry varies by depth."),
            _idea("Scaling limits", "Dictionary growth hits geometric constraints."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "Geometric wall", "def": "Geometry-imposed limit on SAE scaling."},
        ],
        "whatItShows": ["Activation geometry predicts SAE scaling behaviour"],
        "whatItDoesNotShow": ["Exact SetConCA architecture"],
        "setconcaUse": [
            "Choose view sites with geometry in mind.",
        ],
        "masteryChecklist": [
            "I know layer choice is geometric, not arbitrary.",
        ],
        "commonConfusions": [
            {"wrong": "All layers need the same SAE width.", "right": "Geometry differs by layer."},
        ],
        "quiz": [
            _q("Geometric wall relates to?", ["Manifold structure limiting SAE scaling", "Only HTTP hosting", "Only PDF fonts", "Only dropout"], 0, "Geometry → scaling."),
        ],
    },
    "temporal-sae": {
        "whyWeRead": "Closest empirical ancestor: coordinates SAE codes across related activations (adjacent tokens).",
        "oneSentence": "Adds temporal/contrastive coordination between adjacent-token SAE representations for interpretability.",
        "plainLanguage": (
            "Temporal SAEs use the sequential structure of language: nearby tokens provide related pairs for coordinating sparse codes. "
            "Study carefully what counts as a related pair, where the contrastive term applies, and how sparsity interacts with consistency.\n\n"
            "SetConCA generalises: replace 'adjacent tokens' with 'multiple views of the same semantic object'. "
            "Ablate whether gains are semantic consistency or mere local similarity."
        ),
        "keyIdeas": [
            _idea("Related pairs from sequence", "Temporal neighbourhood as supervision."),
            _idea("Contrastive regularisation on codes", "Coordinate sparse representations."),
            _idea("Sparsity interaction", "Alignment must not destroy sparse structure."),
            _idea("Baseline isolation", "Show benefit beyond local similarity."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "Temporal SAE", "def": "SAE trained with temporal coordination between token activations."},
        ],
        "whatItShows": ["Extra structure across related activations can help SAE interpretability goals"],
        "whatItDoesNotShow": ["That multi-view sets automatically inherit all gains"],
        "setconcaUse": [
            "Direct template: change pair definition from time to multi-view sets.",
            "Replicate their ablation philosophy.",
        ],
        "masteryChecklist": [
            "I can state how SetConCA generalises Temporal SAE.",
            "I know which ablations isolate semantic vs local similarity.",
        ],
        "commonConfusions": [
            {"wrong": "Temporal SAE already is SetConCA.", "right": "SetConCA generalises the related-pair notion to multi-view sets."},
        ],
        "quiz": [
            _q("SetConCA generalises Temporal SAE by using?", ["Multi-view semantic objects instead of only adjacent tokens", "Only PCA", "Only deeper MLPs", "Removing sparsity"], 0, "Same idea, broader positives."),
        ],
    },
    "conca": {
        "whyWeRead": "Alternative concept extraction via linear unmixing and identifiability — competitor/complement to SAEs.",
        "oneSentence": "Concept Component Analysis extracts concepts via a principled linear mixture / unmixing approach.",
        "plainLanguage": (
            "ConCA posits a generative process where activations are mixtures of concept components, then recovers components under assumptions (closer to ICA than to pure reconstruction dictionaries).\n\n"
            "Focus on: assumed generative process, log-posterior representation, identifiability, and how component recovery differs from learning a sparse reconstruction dictionary.\n\n"
            "For SetConCA positioning: you may combine sparse dictionaries with multi-view constraints while acknowledging ConCA's unmixing story."
        ),
        "keyIdeas": [
            _idea("Generative mixture story", "Activations as concept mixtures."),
            _idea("Unmixing / components", "Recover latent concept components."),
            _idea("Identifiability", "Assumptions enable recovery."),
            _idea("Vs SAE dictionaries", "Different objective and claims."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "ConCA", "def": "Concept Component Analysis."},
            {"term": "Linear unmixing", "def": "Recovering sources from linear mixtures."},
        ],
        "whatItShows": ["A principled alternative framing for concept extraction"],
        "whatItDoesNotShow": ["That SAEs are obsolete"],
        "setconcaUse": [
            "Cite as alternative generative story.",
            "Compare assumptions explicitly in related work.",
        ],
        "masteryChecklist": [
            "I can contrast ConCA unmixing vs SAE reconstruction dictionaries.",
            "I can state why identifiability assumptions matter.",
        ],
        "commonConfusions": [
            {"wrong": "ConCA and SAE are the same method.", "right": "Different generative/objective stories."},
        ],
        "quiz": [
            _q("ConCA is closest to?", ["ICA-style unmixing of concept components", "Mean pooling only", "SimCLR only", "BatchNorm only"], 0, "Unmixing story."),
        ],
    },
    "mv-causal": {
        "whyWeRead": "Theory for when multiple partial views identify latent factors — foundations for multi-view claims.",
        "oneSentence": "Studies multi-view causal representation learning under partial observability and identifiability conditions.",
        "plainLanguage": (
            "Single views may only partially observe latent factors. Multiple views can make identification possible under explicit assumptions.\n\n"
            "This is the theoretical backbone when you ask not only 'did retrieval improve?' but 'did we recover the shared concept factors?' "
            "Use it to write assumptions and kill criteria for SetConCA."
        ),
        "keyIdeas": [
            _idea("Partial observability", "Each view sees only part of the latents."),
            _idea("Multi-view identification", "Together views identify more."),
            _idea("Assumption-driven claims", "No free identifiability."),
            _idea("Causal representation learning", "Latents with interventional meaning."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "Partial observability", "def": "Not all latents are seen in every view."},
            {"term": "Identifiability conditions", "def": "Assumptions that make recovery unique (up to allowed transforms)."},
        ],
        "whatItShows": ["When multi-view helps identify latents"],
        "whatItDoesNotShow": ["That any multi-view SAE loss identifies concepts"],
        "setconcaUse": [
            "Write explicit assumptions next to every strong claim.",
            "Design experiments that could falsify identifiability-style hypotheses.",
        ],
        "masteryChecklist": [
            "I can explain partial observability.",
            "I refuse assumption-free 'we recovered concepts' claims.",
        ],
        "commonConfusions": [
            {"wrong": "More views always identify everything.", "right": "Only under suitable assumptions and view structure."},
        ],
        "quiz": [
            _q("Multi-view helps identification especially when?", ["Each view is partially observing latents", "Views are identical noise", "There is no sparsity ever", "Probes are banned"], 0, "Partial observability + assumptions."),
        ],
    },
}
