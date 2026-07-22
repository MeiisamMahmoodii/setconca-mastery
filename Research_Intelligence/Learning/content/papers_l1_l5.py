"""Self-contained teaching modules for Levels 1–5. Learner should not need PDFs."""

def _q(q, options, a, explain):
    return {"q": q, "options": options, "a": a, "explain": explain}


def _idea(title, explain):
    return {"title": title, "explain": explain}


PAPERS = {
    "pca-shlens": {
        "whyWeRead": "PCA is the default linear baseline for reconstruction. You need it to understand FVU and why good reconstruction is not interpretability.",
        "oneSentence": "A tutorial deriving PCA from variance maximisation, eigenvectors, and SVD, with emphasis on intuition.",
        "plainLanguage": (
            "Imagine a cloud of points in many dimensions. PCA rotates the cloud so the first axis points along the longest stretch of the cloud, "
            "the second along the next longest stretch orthogonal to the first, and so on.\n\n"
            "Those axes are eigenvectors of the covariance matrix — or equivalently the right singular vectors from an SVD of the centred data matrix. "
            "If you keep only the first k axes and project back, you get a low-rank reconstruction. The leftover error is reconstruction error; "
            "the fraction of variance you failed to capture is FVU.\n\n"
            "Important: orthogonality is a mathematical convenience, not a semantic guarantee. PCA directions need not be concepts. "
            "Later, when an SAE reconstructs well, compare against PCA at matched rank — but never treat either as proof of monosemantic features."
        ),
        "keyIdeas": [
            _idea("Variance and covariance", "Variance measures spread of one coordinate. Covariance measures how two coordinates rise and fall together. The covariance matrix summarises all pairwise co-movements."),
            _idea("Principal components", "Directions that successively maximise captured variance under orthogonality constraints."),
            _idea("Eigenvectors / SVD", "PCA solves an eigenproblem on the covariance, or uses SVD of the data matrix. SVD is numerically preferred."),
            _idea("Low-rank approximation", "Keeping top-k components is the best rank-k linear reconstruction in least-squares sense (Eckart–Young)."),
            _idea("Explained variance & FVU", "Explained variance fraction = sum of kept eigenvalues / total. FVU = 1 − that fraction."),
            _idea("Orthogonal ≠ meaningful", "Axes are uncorrelated by construction, not necessarily human concepts."),
        ],
        "simplifiedMath": [
            {"name": "PCA objective", "formula": "max_u uᵀ C u  s.t. ||u||=1", "meaning": "C is covariance. First PC maximises projected variance."},
            {"name": "SVD", "formula": "X = U Σ Vᵀ", "meaning": "Columns of V (for row-centred X) are principal directions; singular values relate to explained variance."},
            {"name": "FVU", "formula": "FVU = 1 − (Σ_{i≤k} λ_i)/(Σ_all λ_i)", "meaning": "Fraction of variance unexplained after keeping k components."},
        ],
        "vocabulary": [
            {"term": "Principal component", "def": "An orthogonal direction of maximal remaining variance."},
            {"term": "Covariance matrix", "def": "Matrix of pairwise covariances of centred features."},
            {"term": "FVU", "def": "Fraction of variance unexplained by a reconstruction."},
            {"term": "Low-rank approximation", "def": "Approximating a matrix/data using few components."},
        ],
        "whatItShows": ["How to compress one view by variance", "How to measure reconstruction fidelity via explained variance"],
        "whatItDoesNotShow": ["That PCs are interpretable concepts", "How to recover independent sources", "How to align two views"],
        "setconcaUse": [
            "Always report SAE FVU against a PCA baseline at comparable capacity.",
            "Do not claim interpretability from reconstruction alone.",
            "Use PCA as a dense linear competitor in ablations.",
        ],
        "masteryChecklist": [
            "I can derive PCA as variance maximisation.",
            "I can compute/interpret FVU.",
            "I can explain why orthogonal PCs need not be concepts.",
            "I know when to use PCA as an SAE baseline.",
        ],
        "commonConfusions": [
            {"wrong": "Good PCA reconstruction means features are meaningful.", "right": "It only means variance was preserved."},
            {"wrong": "PCA finds independent sources.", "right": "PCA finds uncorrelated directions; ICA targets independence."},
        ],
        "quiz": [
            _q("PCA maximises?", ["Variance", "Independence", "Cross-view correlation", "Sparsity"], 0, "PCA is variance maximisation under orthogonality."),
            _q("FVU measures?", ["Unexplained variance fraction", "Monosemanticity", "Causal effect", "Probe accuracy"], 0, "FVU = 1 − explained variance fraction."),
            _q("Orthogonal PCs are always concepts?", ["False", "True"], 0, "Orthogonality is mathematical, not semantic."),
        ],
    },
    "ica-shlens": {
        "whyWeRead": "ICA is the classical unmixing story. ConCA and concept recovery arguments depend on independence-style assumptions.",
        "oneSentence": "A linear-algebra first tutorial on recovering statistically independent sources from mixtures.",
        "plainLanguage": (
            "Suppose several independent source signals are mixed by an unknown matrix into what you observe. "
            "ICA tries to find an unmixing matrix that recovers those sources.\n\n"
            "Correlation zero is not enough: two variables can be uncorrelated but still dependent. "
            "ICA uses stronger statistical criteria (often non-Gaussianity / mutual information).\n\n"
            "Identifiability needs assumptions: typically linear mixing, independent non-Gaussian sources, enough samples. "
            "If assumptions fail, you can still get a transform — but not the true sources.\n\n"
            "Hold this contrast: PCA rotates for variance; ICA rotates for independence; CCA aligns two views."
        ),
        "keyIdeas": [
            _idea("Mixing model", "Observed x = A s, with s independent sources. Goal: recover s (up to scale/permutation)."),
            _idea("Independence > uncorrelatedness", "Uncorrelated means Cov=0. Independence means the joint factors into the product of margins."),
            _idea("Why whitening helps", "Whitening removes second-order correlations so ICA can focus on higher-order structure."),
            _idea("Identifiability", "Recovery is possible only under assumptions (non-Gaussianity, linear mixing, etc.)."),
            _idea("Coordinate change reveals structure", "The right basis makes latent components separable."),
        ],
        "simplifiedMath": [
            {"name": "Linear mixing", "formula": "x = A s", "meaning": "A mixes independent sources s into observations x."},
            {"name": "Unmixing", "formula": "ŷ = W x ≈ P D s", "meaning": "Recovered sources up to permutation P and scaling D."},
        ],
        "vocabulary": [
            {"term": "Source separation", "def": "Recovering latent sources from mixtures."},
            {"term": "Identifiability", "def": "When parameters/sources can be uniquely recovered given assumptions."},
            {"term": "Statistical independence", "def": "Knowing one variable gives no information about another."},
        ],
        "whatItShows": ["When linear unmixing can recover independent sources", "Why independence assumptions matter"],
        "whatItDoesNotShow": ["That LM activations are exactly independent concept mixtures", "A training recipe for SAEs"],
        "setconcaUse": [
            "Use ICA as a conceptual relative of ConCA.",
            "State assumptions whenever claiming component recovery.",
            "Do not confuse sparse coding with ICA identifiability.",
        ],
        "masteryChecklist": [
            "I can contrast correlation vs independence.",
            "I can write the linear mixing model.",
            "I can list assumptions needed for identifiability.",
            "I can relate ICA to ConCA's story.",
        ],
        "commonConfusions": [
            {"wrong": "PCA and ICA solve the same problem.", "right": "PCA maximises variance; ICA seeks independent sources."},
            {"wrong": "If ICA runs, sources are recovered.", "right": "Only if modelling assumptions hold."},
        ],
        "quiz": [
            _q("ICA targets?", ["Independence", "Max variance", "Max correlation across views", "TopK sparsity"], 0, "ICA seeks statistically independent components."),
            _q("Uncorrelated implies independent?", ["No", "Yes"], 0, "Independence is stronger."),
            _q("ICA is closest in spirit to?", ["ConCA / unmixing", "SimCLR", "Deep Sets", "CKA"], 0, "Both treat observations as mixtures of latent components."),
        ],
    },
    "cca-uurtio": {
        "whyWeRead": "CCA is the foundation of multi-view learning and of comparing representations across views — core to SetConCA.",
        "oneSentence": "A comprehensive tutorial on canonical correlation analysis and its regularised, kernel, sparse, and deep variants.",
        "plainLanguage": (
            "You have two views of the same objects — say two sensors, or two layers, or two paraphrases. "
            "CCA finds a projection of each view so that the projected scalars are as correlated as possible.\n\n"
            "Those projected coordinates are canonical variables; their correlations are canonical correlations. "
            "High canonical correlation means shared information was found. Low does not mean the views are useless — they may carry private information.\n\n"
            "Variants matter: regularisation for high dimensions, kernels for nonlinear maps, sparsity for interpretable loadings, deep CCA for neural encoders. "
            "Always ask about generalisation: CCA can overfit shared noise.\n\n"
            "After this paper: PCA = within-view variance; ICA = independent sources; CCA = cross-view shared signal."
        ),
        "keyIdeas": [
            _idea("Two-view setup", "Paired samples (x_i, y_i). Seek u,v maximising corr(Xu, Yv)."),
            _idea("Canonical variables", "The projected one-dimensional views that are maximally correlated."),
            _idea("Shared vs view-specific", "CCA emphasises shared structure; private structure may be discarded."),
            _idea("Regularised / kernel / sparse / deep CCA", "Extensions for high-dim, nonlinearity, sparsity, neural encoders."),
            _idea("Significance & generalisation", "Validate canonical correlations out of sample; high train correlation can be noise."),
        ],
        "simplifiedMath": [
            {"name": "CCA objective", "formula": "max_{u,v} corr(Xu, Yv) = uᵀΣ_xy v / √(uᵀΣ_xx u vᵀΣ_yy v)", "meaning": "Maximise cross-covariance relative to within-view variances."},
        ],
        "vocabulary": [
            {"term": "Canonical correlation", "def": "Max correlation between linear projections of two views."},
            {"term": "View", "def": "One representation or modality of the same objects."},
            {"term": "Multi-view learning", "def": "Learning from multiple paired observations of each example."},
        ],
        "whatItShows": ["How to extract shared linear directions across views", "How variants address practical failures of plain CCA"],
        "whatItDoesNotShow": ["That shared directions are causal concepts", "How to keep private information automatically"],
        "setconcaUse": [
            "CCA between view groups is a mandatory baseline.",
            "Report shared vs private explicitly in multi-view designs.",
            "Beware discarding activation detail when maximising correlation.",
        ],
        "masteryChecklist": [
            "I can state the CCA objective in words and symbols.",
            "I can distinguish shared vs private information.",
            "I know why deep/regularised CCA exist.",
            "I can place PCA/ICA/CCA in one sentence each.",
        ],
        "commonConfusions": [
            {"wrong": "CCA maximises variance like PCA.", "right": "CCA maximises cross-view correlation."},
            {"wrong": "Perfect CCA means views are identical.", "right": "It means projections correlate; private structure may remain."},
        ],
        "quiz": [
            _q("CCA maximises?", ["Cross-view correlation of projections", "Within-view variance", "Independence", "Sparsity"], 0, "Canonical correlations are about shared directions."),
            _q("Private information is?", ["View-specific structure CCA may ignore", "Always noise", "Always shared", "Impossible"], 0, "Useful private structure can exist."),
            _q("After CCA tutorials, PCA/ICA/CCA mean?", ["variance / independence / cross-view corr", "all the same", "sparsity / attention / probes", "only deep learning"], 0, "Memorise this triad."),
        ],
    },
    "ksparse": {
        "whyWeRead": "Clearest bridge from classical sparse coding to modern TopK SAEs.",
        "oneSentence": "Autoencoders with a hard TopK activation that keep exactly k units active.",
        "plainLanguage": (
            "An autoencoder compresses input through a bottleneck then reconstructs. "
            "If the bottleneck is wider than the input (overcomplete), you must constrain the code or it can cheat.\n\n"
            "k-Sparse AEs keep only the k largest hidden activations and zero the rest. Magnitudes of survivors are not softly shrunk by an L1 term. "
            "That hard selection is exactly the spirit of TopK SAEs used in modern interpretability.\n\n"
            "Sparse codes can still reconstruct dense inputs because many dictionary atoms combine. "
            "Sparsity is about which atoms fire, not about the input being sparse."
        ),
        "keyIdeas": [
            _idea("Encoder–decoder factorisation", "Encoder maps x→z; decoder maps z→x̂. Training minimises reconstruction."),
            _idea("Overcomplete hidden layer", "More units than input dims enables richer sparse codes."),
            _idea("Hard TopK", "Keep k largest activations; others zero."),
            _idea("L1 vs exact k-sparsity", "L1 softly penalises and shrinks; TopK enforces cardinality."),
            _idea("Dense inputs, sparse codes", "Sparse z can reconstruct dense x via linear combinations of atoms."),
        ],
        "simplifiedMath": [
            {"name": "TopK code", "formula": "z = TopK(f(x), k)", "meaning": "Only k entries of the encoder output remain nonzero."},
            {"name": "Reconstruction loss", "formula": "L = ||x − g(z)||²", "meaning": "Train encoder/decoder to reconstruct under the TopK constraint."},
        ],
        "vocabulary": [
            {"term": "Dictionary atom", "def": "A column of the decoder; a reusable feature direction."},
            {"term": "k-sparsity", "def": "Exactly k nonzero code entries."},
            {"term": "Overcomplete", "def": "Code dimension larger than input dimension."},
        ],
        "whatItShows": ["Exact cardinality constraints work for autoencoders", "Sparse overcomplete codes can reconstruct"],
        "whatItDoesNotShow": ["Monosemanticity of atoms", "Causal role of features in an LM"],
        "setconcaUse": [
            "Treat TopK SAE as descendant of this paper.",
            "Prefer matched-k comparisons when ablating sparsity mechanisms.",
        ],
        "masteryChecklist": [
            "I can explain why overcomplete codes need sparsity.",
            "I can contrast L1 and TopK.",
            "I can sketch encoder→TopK→decoder.",
        ],
        "commonConfusions": [
            {"wrong": "Sparse code means input is sparse.", "right": "The latent is sparse; input can be dense."},
            {"wrong": "TopK is the same as L1.", "right": "TopK enforces exact k; L1 soft-penalises and shrinks."},
        ],
        "quiz": [
            _q("k-Sparse AEs enforce sparsity by?", ["Keeping exactly k actives", "Only dropout", "Only L2", "PCA"], 0, "Hard TopK."),
            _q("Why overcomplete needs sparsity?", ["Otherwise dense mush reconstructs without specialisation", "It doesn't", "For speed only", "For CCA"], 0, "Without sparsity, overcomplete codes need not specialise."),
        ],
    },
    "vae": {
        "whyWeRead": "Background for probabilistic latents, Gaussian aggregation, and ELBO thinking — not to become a VAE specialist.",
        "oneSentence": "Derives variational autoencoders: approximate posteriors, reparameterisation, and the ELBO.",
        "plainLanguage": (
            "A VAE treats each input as generated from a latent random variable z. "
            "We cannot compute the true posterior p(z|x) easily, so we learn an approximate posterior q(z|x), usually a Gaussian with predicted mean and variance.\n\n"
            "The reparameterisation trick writes z = μ + σ⊙ε with ε~N(0,I) so gradients flow through sampling.\n\n"
            "Training maximises a lower bound on log p(x) called the ELBO: reconstruction quality minus KL divergence from q to a prior (often N(0,I)). "
            "Too much KL pressure can over-regularise; too little can ignore the prior.\n\n"
            "For SetConCA: when you aggregate views as Gaussians or use product-of-experts, you are using this probabilistic vocabulary."
        ),
        "keyIdeas": [
            _idea("Latent variable model", "Data arises from latent z through a decoder generative process."),
            _idea("Approximate posterior", "Encoder outputs parameters of q(z|x)."),
            _idea("Reparameterisation", "Move randomness to ε so μ,σ get gradients."),
            _idea("ELBO tradeoff", "Reconstruct well vs stay close to prior."),
            _idea("Prior / posterior / likelihood", "Three distributions in the generative story."),
        ],
        "simplifiedMath": [
            {"name": "ELBO", "formula": "E_q[log p(x|z)] − KL(q(z|x)||p(z))", "meaning": "Reconstruction term minus regulariser toward prior."},
            {"name": "Reparameterisation", "formula": "z = μ(x) + σ(x) ⊙ ε, ε~N(0,I)", "meaning": "Differentiable sampling."},
        ],
        "vocabulary": [
            {"term": "ELBO", "def": "Evidence lower bound on log likelihood."},
            {"term": "KL divergence", "def": "Measure of how one distribution differs from another."},
            {"term": "Reparameterisation trick", "def": "Rewrite sampling so parameters receive gradients."},
        ],
        "whatItShows": ["How to train continuous latents with variational inference", "Reconstruction–regularisation tradeoff"],
        "whatItDoesNotShow": ["That Gaussian latents are monosemantic", "SAE dictionary learning"],
        "setconcaUse": [
            "Use ELBO intuition for Gaussian set codes and PoE fusion.",
            "Separate reconstruction goals from alignment goals explicitly.",
        ],
        "masteryChecklist": [
            "I can explain ELBO in words.",
            "I can write the reparameterisation formula.",
            "I know why this matters for probabilistic multi-view aggregation.",
        ],
        "commonConfusions": [
            {"wrong": "VAE = SAE.", "right": "VAE is probabilistic bottleneck; SAE is sparse overcomplete dictionary for interpretability."},
        ],
        "quiz": [
            _q("ELBO balances?", ["Reconstruction vs KL to prior", "Only sparsity", "Only CCA", "Only TopK"], 0, "Classic VAE tradeoff."),
            _q("Reparameterisation exists to?", ["Backprop through sampling", "Increase sparsity", "Compute CKA", "Remove decoder"], 0, "Make sampling differentiable."),
        ],
    },
    "dcca": {
        "whyWeRead": "Nonlinear upgrade of CCA — precursor to coordinating neural view encoders.",
        "oneSentence": "Deep CCA replaces linear CCA projections with neural networks trained to maximise canonical correlation.",
        "plainLanguage": (
            "Linear CCA can miss shared structure that is nonlinear in the raw views. "
            "DCCA puts a neural net on each view, then applies a CCA-style correlation objective on the net outputs.\n\n"
            "Whitening / covariance constraints keep the latent dimensions from collapsing into duplicates.\n\n"
            "Warning: maximising correlation can discard information that is useful but not shared. "
            "That failure mode is why DCCAE later adds reconstruction."
        ),
        "keyIdeas": [
            _idea("Nonlinear view encoders", "Each view has its own DNN."),
            _idea("Correlation-maximising objective", "Train nets so embeddings correlate like CCA."),
            _idea("Covariance constraints", "Prevent degenerate high-correlation solutions."),
            _idea("Information discard risk", "Non-shared but useful signals may be thrown away."),
        ],
        "simplifiedMath": [
            {"name": "DCCA idea", "formula": "max corr(f_θ(X), g_φ(Y))", "meaning": "Learn nonlinear f,g to maximise cross-view correlation (with constraints)."},
        ],
        "vocabulary": [
            {"term": "Deep CCA", "def": "CCA with neural view encoders."},
            {"term": "Whitening", "def": "Transform so dimensions have unit variance and zero correlation."},
        ],
        "whatItShows": ["Nonlinear shared structure can beat linear CCA on some tasks"],
        "whatItDoesNotShow": ["That correlation maximisation preserves all useful activation detail"],
        "setconcaUse": [
            "Treat DCCA as a nonlinear multi-view baseline.",
            "Audit whether alignment destroyed private SAE-relevant information.",
        ],
        "masteryChecklist": [
            "I can explain DCCA vs linear CCA.",
            "I can name the discard-information failure mode.",
        ],
        "commonConfusions": [
            {"wrong": "Higher correlation is always better.", "right": "It can erase private structure you still need."},
        ],
        "quiz": [
            _q("DCCA upgrades CCA with?", ["Neural view encoders", "TopK only", "Probes only", "Attention only"], 0, "Deep nonlinear maps."),
        ],
    },
    "dccae": {
        "whyWeRead": "Central tradeoff for SetConCA: cross-view correlation vs within-view reconstruction.",
        "oneSentence": "Studies deep multi-view objectives, introducing DCCAE which balances correlation and autoencoding.",
        "plainLanguage": (
            "If you only maximise correlation, you may learn a tiny shared signal and throw away the rest. "
            "If you only reconstruct each view, you may never align them.\n\n"
            "DCCAE combines both: learn representations that correlate across views and reconstruct each view. "
            "This is almost exactly SetConCA's tension — coordinate views without destroying activation information."
        ),
        "keyIdeas": [
            _idea("Correlation–reconstruction tradeoff", "Two objectives pull differently."),
            _idea("Shared representation", "What is kept for alignment."),
            _idea("Information preservation", "Reconstruction protects within-view detail."),
            _idea("Objective choice matters", "Different multi-view losses imply different invariances."),
        ],
        "simplifiedMath": [
            {"name": "Schematic DCCAE loss", "formula": "L ≈ −corr(z_x,z_y) + λ(‖x−x̂‖²+‖y−ŷ‖²)", "meaning": "Align shared codes while reconstructing views."},
        ],
        "vocabulary": [
            {"term": "DCCAE", "def": "Deep canonically correlated autoencoders."},
        ],
        "whatItShows": ["Explicit tradeoff between alignment and preservation"],
        "whatItDoesNotShow": ["The unique correct λ for language-model SAEs"],
        "setconcaUse": [
            "When adding contrastive alignment to SAEs, keep a reconstruction term and ablate λ.",
            "Report both retrieval and FVU.",
        ],
        "masteryChecklist": [
            "I can explain why correlation-only training is dangerous.",
            "I can state the DCCAE design pattern.",
        ],
        "commonConfusions": [
            {"wrong": "Alignment replaces reconstruction.", "right": "You often need both."},
        ],
        "quiz": [
            _q("DCCAE adds what to DCCA?", ["Within-view reconstruction", "Only TopK", "Only probes", "Only PCA"], 0, "Autoencoding term."),
        ],
    },
    "vcca": {
        "whyWeRead": "Probabilistic multi-view model with shared and private latents — closest classical cousin to probabilistic SetConCA.",
        "oneSentence": "Deep variational CCA with shared (and optionally private) latents and a generative multi-view story.",
        "plainLanguage": (
            "VCCA extends the latent-variable view of CCA into deep generative models. "
            "A shared latent explains both views; private latents can explain view-specific details.\n\n"
            "Because it is generative, it can handle missing views in principle. "
            "The probabilistic framing clarifies what 'alignment' means: shared latents, not forced identical embeddings."
        ),
        "keyIdeas": [
            _idea("Shared latent", "Common factor for both views."),
            _idea("Private latents", "View-specific factors."),
            _idea("Variational training", "ELBO-style bounds with neural parameterisations."),
            _idea("Missing views", "Generative models can impute or condition."),
        ],
        "simplifiedMath": [
            {"name": "Shared factor idea", "formula": "x ← dec_x(z_shared, z_x), y ← dec_y(z_shared, z_y)", "meaning": "Both views generated from shared + private latents."},
        ],
        "vocabulary": [
            {"term": "Private latent", "def": "Latent used by only one view."},
            {"term": "VCCA", "def": "Variational deep CCA / multi-view VAE-style model."},
        ],
        "whatItShows": ["Shared/private decomposition in a probabilistic multi-view model"],
        "whatItDoesNotShow": ["Automatic monosemantic concepts"],
        "setconcaUse": [
            "Borrow shared/private design in multi-view SAE experiments.",
            "Evaluate missing-view robustness.",
        ],
        "masteryChecklist": [
            "I can draw shared vs private latents.",
            "I can relate VCCA to VAE + CCA ideas.",
        ],
        "commonConfusions": [
            {"wrong": "Shared latent means views are identical.", "right": "Shared explains commonality; private can differ."},
        ],
        "quiz": [
            _q("VCCA's private latents capture?", ["View-specific information", "Only noise always", "Only labels", "Only TopK"], 0, "Private = view-specific."),
        ],
    },
    "dgcca": {
        "whyWeRead": "Extends CCA thinking from two views to many views — the conceptual jump SetConCA needs.",
        "oneSentence": "Deep generalized CCA learns a common representation across an arbitrary number of views.",
        "plainLanguage": (
            "Real problems often have more than two views: many layers, many paraphrases, many sites. "
            "DGCCA seeks a common representation that explains shared information across several views.\n\n"
            "The key question becomes: what common code should all views agree on? "
            "Not: how do we force every view embedding to be identical."
        ),
        "keyIdeas": [
            _idea("Many-view generalisation", "CCA beyond pairs."),
            _idea("Common representation", "One shared target that views relate to."),
            _idea("Deep encoders per view", "Nonlinear maps into a joint analysis."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "GCCA / DGCCA", "def": "Generalized CCA; deep version for many views."},
        ],
        "whatItShows": ["Multi-view shared representation beyond two views"],
        "whatItDoesNotShow": ["Optimal aggregation for SAE feature dictionaries"],
        "setconcaUse": [
            "Motivate multi-view SetConCA with DGCCA's question.",
            "Use many-view CCA baselines before contrastive set losses.",
        ],
        "masteryChecklist": [
            "I can explain why two-view CCA is not enough for SetConCA.",
            "I can state DGCCA's central question.",
        ],
        "commonConfusions": [
            {"wrong": "More views means force them all equal.", "right": "Seek common shared structure; keep private."},
        ],
        "quiz": [
            _q("DGCCA is for?", ["Many views", "Only images", "Only TopK SAEs", "Only probes"], 0, "Generalized multi-view CCA."),
        ],
    },
    "deepsets": {
        "whyWeRead": "Essential theory for aggregating unordered activation views into one concept code.",
        "oneSentence": "Characterises permutation-invariant set functions as ρ(Σ φ(x)).",
        "plainLanguage": (
            "If your input is a set, order must not matter. Deep Sets shows that (under mild conditions) invariant functions can be written as: "
            "encode each element, sum the encodings, then apply a network ρ.\n\n"
            "Mean pooling is the special case where φ is identity-ish and ρ is simple. "
            "Sum/mean can lose information about pairwise relations and multiplicities in some tasks.\n\n"
            "If SetConCA's meaning depends on how views relate — not just their average — Deep Sets alone may be insufficient; consider attention."
        ),
        "keyIdeas": [
            _idea("Permutation invariance", "f(π(X))=f(X)."),
            _idea("Sum-decomposition", "f(X)=ρ(Σ_x φ(x))."),
            _idea("What pooling preserves", "Totals/averages; may lose relational structure."),
            _idea("Equivariance", "Outputs permute with inputs when predicting per member."),
        ],
        "simplifiedMath": [
            {"name": "Deep Sets form", "formula": "f(X)=ρ(∑_{x∈X} φ(x))", "meaning": "Encode, sum-pool, transform."},
        ],
        "vocabulary": [
            {"term": "Permutation invariance", "def": "Order-independent set function."},
            {"term": "Pooling", "def": "Aggregate many vectors into one."},
        ],
        "whatItShows": ["A universal architectural pattern for invariant set learning"],
        "whatItDoesNotShow": ["That mean pooling is always enough semantically"],
        "setconcaUse": [
            "Default aggregator candidate: Deep Sets.",
            "Ablate against mean and Set Transformer.",
        ],
        "masteryChecklist": [
            "I can write the Deep Sets formula.",
            "I know when mean pooling fails.",
        ],
        "commonConfusions": [
            {"wrong": "Any MLP on concatenated views is fine.", "right": "Concatenation encodes order unless carefully handled."},
        ],
        "quiz": [
            _q("Deep Sets core form?", ["ρ(sum φ(x))", "softmax only", "PCA only", "CCA only"], 0, "Encode–sum–transform."),
        ],
    },
    "neural-stat": {
        "whyWeRead": "Treats a whole set/dataset as an object with a latent — clarifies what a set code should mean.",
        "oneSentence": "Learns latent representations of datasets/sets, aiming to capture shared generative structure.",
        "plainLanguage": (
            "Sometimes the object of interest is not one example but a collection: a dataset, a class, a bag of views. "
            "The Neural Statistician learns a latent that represents the set's underlying distributional structure.\n\n"
            "Ask: should your set code reconstruct members, or capture the distribution they come from? "
            "For SetConCA, a concept code might need shared structure across views more than perfect member reconstruction."
        ),
        "keyIdeas": [
            _idea("Set as object", "One latent for the whole set."),
            _idea("Statistic network", "Maps set → latent statistics."),
            _idea("Distributional view", "Represent what is common across members."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "Set latent", "def": "A code for an entire set, not one element."},
        ],
        "whatItShows": ["Sets can be first-class latent objects"],
        "whatItDoesNotShow": ["Exact recipe for SAE multi-view fusion"],
        "setconcaUse": [
            "Decide whether set codes target member recon or shared concept structure.",
        ],
        "masteryChecklist": [
            "I can state what a set-level latent is for.",
        ],
        "commonConfusions": [
            {"wrong": "Set code = mean of members always.", "right": "Mean is one statistic; latents can be richer."},
        ],
        "quiz": [
            _q("Neural Statistician mainly represents?", ["A whole set/dataset", "One pixel", "Only a probe", "Only PCA"], 0, "Set-level latent."),
        ],
    },
    "set-transformer": {
        "whyWeRead": "When set meaning needs interactions among members, attention beats independent pooling.",
        "oneSentence": "Attention-based permutation-invariant networks with self-attention and inducing points.",
        "plainLanguage": (
            "Deep Sets encodes members independently before pooling. "
            "Set Transformer lets members attend to each other, modelling pairwise structure, then pools (including attention pooling).\n\n"
            "Inducing points reduce quadratic cost by attending through a smaller set of learned points.\n\n"
            "Use this when average pooling cannot recover the concept — e.g. when a few views are critical and others are distractors."
        ),
        "keyIdeas": [
            _idea("Self-attention over members", "Interactions before aggregation."),
            _idea("Attention pooling", "Learned weighted aggregation."),
            _idea("Inducing points", "Efficient attention bottleneck."),
            _idea("Expressivity vs cost", "More power, higher compute."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "Inducing points", "def": "Learned bottleneck elements for efficient attention."},
            {"term": "Attention pooling", "def": "Pool by attention weights rather than uniform mean."},
        ],
        "whatItShows": ["Interaction-aware set models outperform independent pooling on relational tasks"],
        "whatItDoesNotShow": ["That attention always helps SAE stability"],
        "setconcaUse": [
            "Baseline aggregator when intruders/relations matter.",
            "Watch compute and overfitting on small view sets.",
        ],
        "masteryChecklist": [
            "I can contrast Deep Sets vs Set Transformer.",
            "I know what inducing points buy.",
        ],
        "commonConfusions": [
            {"wrong": "Attention always beats mean pooling.", "right": "Not if the concept truly is an average and data is tiny."},
        ],
        "quiz": [
            _q("Set Transformer adds?", ["Member interactions via attention", "Only PCA", "Only L1", "Only CCA"], 0, "Self-attention over set elements."),
        ],
    },
    "multi-set-transformer": {
        "whyWeRead": "Optional advanced reading when relationships exist between several sets, not only within one set.",
        "oneSentence": "Extends set transformers to functions on multiple sets.",
        "plainLanguage": (
            "Sometimes you have several sets (e.g. views of concept A vs concept B) and need relations between sets. "
            "Multi-Set Transformers model within- and between-set interactions.\n\n"
            "Only needed when SetConCA experiments involve multiple concept-sets interacting."
        ),
        "keyIdeas": [
            _idea("Multiple sets as input", "Not just one bag."),
            _idea("Cross-set attention", "Relate sets to each other."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "Multi-set model", "def": "Architecture taking several sets as arguments."},
        ],
        "whatItShows": ["Cross-set relational modelling is possible with attention"],
        "whatItDoesNotShow": ["Necessity for basic SetConCA"],
        "setconcaUse": [
            "Optional: cross-concept set relations.",
        ],
        "masteryChecklist": [
            "I know when multi-set models are needed vs single-set.",
        ],
        "commonConfusions": [
            {"wrong": "Required for any multi-view SAE.", "right": "Optional; single-set aggregation often comes first."},
        ],
        "quiz": [
            _q("Multi-Set Transformers help when?", ["Relations between several sets matter", "Only training PCA", "Only FVU", "Never"], 0, "Cross-set relations."),
        ],
    },
    "cpc": {
        "whyWeRead": "Conceptual home of InfoNCE — the standard contrastive loss family.",
        "oneSentence": "Learns representations by predicting future/context with a contrastive InfoNCE objective.",
        "plainLanguage": (
            "CPC trains an encoder so that a representation of context can identify the true future sample among negatives. "
            "The loss is InfoNCE: a softmax cross-entropy over similarities.\n\n"
            "Positives define what 'same' means. Negatives define what 'different' means. "
            "Change either and you change the learned task.\n\n"
            "Temperature and similarity function reshape the geometry. "
            "InfoNCE relates to mutual information bounds under assumptions — useful intuition, not a licence to claim MI was measured in your SAE codes."
        ),
        "keyIdeas": [
            _idea("Positive / negative pairs", "Define the discrimination task."),
            _idea("InfoNCE", "Softmax over similarities with one positive."),
            _idea("Density-ratio view", "Classifier scores relate to density ratios."),
            _idea("Negative distribution matters", "Hard or false negatives change learning."),
        ],
        "simplifiedMath": [
            {"name": "InfoNCE (schematic)", "formula": "L = -log Softmax(sim(q,k⁺)/τ among {k⁺,k⁻})", "meaning": "Pull positive key toward query; push negatives away; τ=temperature."},
        ],
        "vocabulary": [
            {"term": "InfoNCE", "def": "Contrastive loss identifying the positive among negatives."},
            {"term": "Temperature τ", "def": "Softmax sharpness hyperparameter."},
        ],
        "whatItShows": ["Contrastive prediction learns useful representations"],
        "whatItDoesNotShow": ["That low InfoNCE recovers ground-truth concepts in SAEs"],
        "setconcaUse": [
            "Default language for multi-view contrastive terms.",
            "Document positive definition carefully.",
        ],
        "masteryChecklist": [
            "I can write InfoNCE in words.",
            "I know why negatives define the task.",
        ],
        "commonConfusions": [
            {"wrong": "InfoNCE maximises MI exactly.", "right": "It relates to a bound under assumptions; practice is a discrimination task."},
        ],
        "quiz": [
            _q("InfoNCE trains by?", ["Identifying the positive among negatives", "Only PCA", "Only FVU", "Only L0"], 0, "Contrastive classification."),
        ],
    },
    "simclr": {
        "whyWeRead": "Shows practical ingredients of contrastive learning: augmentations, projection heads, batch size, temperature.",
        "oneSentence": "A simple contrastive framework showing what matters empirically for visual representation learning.",
        "plainLanguage": (
            "SimCLR creates two augmented views of an image as a positive pair, embeds them, maps through a projection head, and applies InfoNCE with in-batch negatives.\n\n"
            "Lessons that transfer beyond vision: positive-pair definition (augmentation) is crucial; projection heads help training but may be discarded later; "
            "normalisation and temperature matter; large batches supply negatives.\n\n"
            "For SetConCA, 'augmentation' becomes 'how you form views of the same concept'."
        ),
        "keyIdeas": [
            _idea("Augmentation defines positives", "Task semantics come from the pair rule."),
            _idea("Projection head", "Extra MLP for the loss."),
            _idea("Batch negatives", "Other batch items act as negatives."),
            _idea("Normalisation & temperature", "Control similarity geometry."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "Projection head", "def": "Network mapping representations to the contrastive space."},
            {"term": "In-batch negatives", "def": "Negatives taken from other examples in the minibatch."},
        ],
        "whatItShows": ["Which practical choices make contrastive learning work"],
        "whatItDoesNotShow": ["That vision augmentations translate unchanged to activation views"],
        "setconcaUse": [
            "Treat view construction as carefully as SimCLR treats augmentation.",
            "Ablate projection head: does info remain in SAE codes?",
        ],
        "masteryChecklist": [
            "I can list SimCLR's critical ingredients.",
            "I can translate 'augmentation' to 'view definition'.",
        ],
        "commonConfusions": [
            {"wrong": "Projection head output is always the representation you should keep.", "right": "Often the pre-projection embedding is used downstream."},
        ],
        "quiz": [
            _q("In SimCLR, positives are mainly defined by?", ["Data augmentations of the same image", "Random labels", "PCA", "L1"], 0, "Augmentation defines sameness."),
        ],
    },
    "supcon": {
        "whyWeRead": "Directly relevant: multiple positives per semantic class — like multiple views of one concept.",
        "oneSentence": "Contrastive learning with many positives sharing a class label, encouraging within-class compactness.",
        "plainLanguage": (
            "Ordinary contrastive learning often has one positive. Supervised Contrastive Learning treats all same-class examples as positives. "
            "The loss averages attraction to all positives while repelling other classes.\n\n"
            "This creates class-conditioned geometry: tight within class, separated between classes. "
            "Sampling imbalance matters when some classes have more positives.\n\n"
            "SetConCA mapping: each activation view of the same semantic object is a positive."
        ),
        "keyIdeas": [
            _idea("Multiple positives", "All same-class samples attract."),
            _idea("Positive averaging", "Loss accounts for several positives."),
            _idea("Within-class compactness", "Class clusters tighten."),
            _idea("Between-class separation", "Different classes push apart."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "Multi-positive contrastive loss", "def": "Contrastive objective with several positives per anchor."},
        ],
        "whatItShows": ["Class-level positives improve supervised representation geometry"],
        "whatItDoesNotShow": ["That class labels equal ground-truth concepts in SAE space"],
        "setconcaUse": [
            "Use SupCon-style losses for multi-view positives.",
            "Watch imbalance when some concepts have more views.",
        ],
        "masteryChecklist": [
            "I can contrast SimCLR-style vs SupCon-style positives.",
            "I can map SupCon to multi-view concepts.",
        ],
        "commonConfusions": [
            {"wrong": "More positives always better with no caveats.", "right": "False positives / imbalance can distort geometry."},
        ],
        "quiz": [
            _q("SupCon differs by allowing?", ["Multiple positives per anchor", "No encoder", "No negatives ever", "Only PCA"], 0, "Class-conditioned multi-positive loss."),
        ],
    },
    "align-unif": {
        "whyWeRead": "Gives a clean geometric vocabulary for diagnosing contrastive training: alignment and uniformity.",
        "oneSentence": "Decomposes contrastive learning into aligning positives and spreading features uniformly on the hypersphere.",
        "plainLanguage": (
            "Alignment: positive pairs should be close. "
            "Uniformity: features should not collapse into a small region of the sphere — they should spread out.\n\n"
            "A model can achieve low loss in unhealthy ways if you only watch one side. "
            "Plot positive cosine, negative cosine, and their difference with this decomposition in mind."
        ),
        "keyIdeas": [
            _idea("Alignment", "Positives close."),
            _idea("Uniformity", "Avoid collapse; spread on hypersphere."),
            _idea("Hypersphere geometry", "Normalised embeddings live on a sphere."),
            _idea("Diagnostic metrics", "Use alignment/uniformity to interpret training."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "Alignment", "def": "Closeness of positive-pair embeddings."},
            {"term": "Uniformity", "def": "How evenly embeddings spread (anti-collapse)."},
        ],
        "whatItShows": ["Contrastive success factors can be split into two geometric properties"],
        "whatItDoesNotShow": ["Concept completeness or causal faithfulness"],
        "setconcaUse": [
            "Log alignment and uniformity whenever training contrastive SAE terms.",
            "Detect collapse early.",
        ],
        "masteryChecklist": [
            "I can define alignment and uniformity.",
            "I can diagnose collapse using them.",
        ],
        "commonConfusions": [
            {"wrong": "Perfect alignment alone is success.", "right": "Without uniformity, everything collapses together."},
        ],
        "quiz": [
            _q("Uniformity fights?", ["Representation collapse", "SVD", "FVU only", "Probes only"], 0, "Spread prevents collapse."),
        ],
    },
    "vicreg": {
        "whyWeRead": "Shows how to keep variance and reduce redundancy without relying heavily on explicit negatives — useful regularisers for SetConCA.",
        "oneSentence": "Self-supervised learning via Variance–Invariance–Covariance regularisation.",
        "plainLanguage": (
            "VICReg has three terms: "
            "Invariance — related views match; "
            "Variance — each dimension keeps enough spread (anti-collapse); "
            "Covariance — off-diagonals pushed down (less redundant dimensions).\n\n"
            "This is a toolbox when pure contrastive alignment damages reconstruction or diversity in SAE codes."
        ),
        "keyIdeas": [
            _idea("Invariance", "Views of the same thing agree."),
            _idea("Variance hinge", "Prevent per-dimension collapse."),
            _idea("Covariance off-diagonal penalty", "Discourage redundant axes."),
            _idea("Negatives optional", "Can train without large negative sets."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "VICReg", "def": "Variance–Invariance–Covariance Regularization."},
        ],
        "whatItShows": ["Non-contrastive SSL can avoid collapse with explicit stats penalties"],
        "whatItDoesNotShow": ["Automatic concept recovery"],
        "setconcaUse": [
            "Try variance/covariance regularisers when contrastive terms hurt FVU or diversity.",
        ],
        "masteryChecklist": [
            "I can name VICReg's three terms and their jobs.",
        ],
        "commonConfusions": [
            {"wrong": "VICReg needs InfoNCE.", "right": "It is an alternative regularisation path."},
        ],
        "quiz": [
            _q("VICReg variance term prevents?", ["Collapse of embedding dimensions", "PDF download", "SVD only", "Attention only"], 0, "Keep per-dimension variance."),
        ],
    },
    "cl-inverts": {
        "whyWeRead": "Optional theory: when contrastive objectives recover latent factors of the data-generating process.",
        "oneSentence": "Proves conditions under which InfoNCE-like objectives invert the generative process and recover latents.",
        "plainLanguage": (
            "Contrastive learning often works; this paper asks when it recovers the true latent factors rather than merely a useful retrieval geometry.\n\n"
            "The answer depends on assumptions about the data-generating process and the contrastive setup. "
            "Use it as a caution: success on retrieval does not automatically mean identifiability of concepts."
        ),
        "keyIdeas": [
            _idea("Identifiability lens on contrastive learning", "When latents are recovered."),
            _idea("Assumptions matter", "Without them, inversion may fail."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "Latent inversion", "def": "Recovering ground-truth generative factors from observations."},
        ],
        "whatItShows": ["Theoretical conditions for contrastive latent recovery"],
        "whatItDoesNotShow": ["That your SAE multi-view positives meet those conditions"],
        "setconcaUse": [
            "Cite when claiming concept recovery, not only retrieval gains.",
        ],
        "masteryChecklist": [
            "I distinguish retrieval usefulness from latent identifiability.",
        ],
        "commonConfusions": [
            {"wrong": "Contrastive success implies factor recovery.", "right": "Only under assumptions."},
        ],
        "quiz": [
            _q("This paper warns that contrastive learning?", ["May not invert the DGP without assumptions", "Always finds SAEs", "Removes need for sparsity", "Replaces CCA"], 0, "Identifiability is conditional."),
        ],
    },
}
