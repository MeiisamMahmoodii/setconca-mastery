"""Self-contained teaching modules for Levels 1–5. Learner should not need PDFs."""

def _q(q, options, a, explain):
    return {"q": q, "options": options, "a": a, "explain": explain}


def _idea(title, explain):
    return {"title": title, "explain": explain}


PAPERS = {
    "pca-shlens": {
        "whyWeRead": "PCA is the default linear baseline for vector compression and reconstruction. You need it to understand Fraction of Variance Unexplained (FVU) and why good reconstruction is NOT interpretability.",
        "oneSentence": "A classic tutorial deriving PCA from variance maximization, covariance matrices, eigenvectors, and Singular Value Decomposition (SVD).",
        "plainLanguage": (
            "Welcome to the PCA Masterclass. Let's start from absolute zero: why did Karl Pearson invent PCA in 1901, and why does every AI researcher still use it today?\n\n"
            "Imagine you have data points in a 100-dimensional space. Humans cannot visualize 100 dimensions. If you want to compress this data down to 2 dimensions so you can plot it on a screen, how do you choose the 2 dimensions?\n\n"
            "If you randomly pick 2 coordinates, you might project a long, stretched cloud into a tiny flat dot, losing almost all the information! PCA solves this by finding the exact directions in space along which your data SPREADS OUT THE MOST (maximum variance).\n\n"
            "--- STEP-BY-STEP MATHEMATICAL BUILD-UP ---\n"
            "1. Mean (μ): The average position of all data points. We center the data by subtracting μ so the cloud is centered at zero.\n"
            "2. Variance: For a single coordinate x, variance is E[(x - μ)²]. It measures how far data points spread out around zero.\n"
            "3. Covariance: For two coordinates x and y, covariance is E[(x - μ_x)(y - μ_y)]. If x and y increase together, covariance is positive. If x increases when y decreases, it is negative.\n"
            "4. Covariance Matrix (C): A grid storing all pairwise covariances. The diagonal entries are the variances of each coordinate.\n"
            "5. Eigenvectors & Eigenvalues: An eigenvector of C is a special arrow in space that DOES NOT TILT when multiplied by C — it only gets stretched! The stretch factor is the Eigenvalue λ.\n"
            "6. Singular Value Decomposition (SVD): Numerical computing prefers SVD (X = U Σ Vᵀ) over computing C directly. The columns of V are the exact Principal Component directions!\n\n"
            "--- THE CRITICAL RECONSTRUCTION METRIC: FVU ---\n"
            "Fraction of Variance Unexplained (FVU) = ||X - X_reconstructed||² / ||X||².\n"
            "If you keep top-k principal components, FVU measures what percentage of the data's spread you lost. FVU = 0 means perfect reconstruction.\n\n"
            "--- THE SCIENTIFIC WARNING FOR SAE RESEARCHERS ---\n"
            "PCA axes are strictly ORTHOGONAL (at 90° right angles to each other). Orthogonality is a mathematical constraint, NOT a human concept guarantee! PCA directions are linear combinations of features created by linear algebra. Never assume low FVU means you found human concepts."
        ),
        "priorWork": (
            "HISTORICAL LITERATURE REVIEW & CONTEXT:\n"
            "Karl Pearson (1901) introduced PCA as an analogue to the principal axis theorem in classical mechanics. Harold Hotelling (1933) independently expanded PCA to random variables. "
            "Before PCA, data reduction relied on manual variable selection or arbitrary coordinate truncation. "
            "Shlens (2014) synthesized decades of linear algebra literature into a unified tutorial connecting variance maximization, mean-squared error minimization, and Singular Value Decomposition (SVD).\n\n"
            "RESEARCH GAP ADDRESSED:\n"
            "Provides a rigorous linear algebra derivation bridging raw data matrices, empirical covariance estimation, diagonalisation, and SVD numerical computation without hand-waving."
        ),
        "paperArchitecture": (
            "MATHEMATICAL MECHANISM & STEP-BY-STEP ALGORITHM:\n"
            "1. Centering: Given data matrix X (N samples × d features), compute sample mean vector μ = (1/N) Σ x_i and subtract: X_centered = X - 1 μᵀ.\n"
            "2. Empirical Covariance: Compute C = (1/(N-1)) X_centeredᵀ X_centered. C is a d × d symmetric positive semi-definite matrix.\n"
            "3. Diagonalization: Solve C v_i = λ_i v_i subject to v_iᵀ v_j = δ_ij. Eigenvalues λ_1 ≥ λ_2 ≥ ... ≥ λ_d quantify variance along orthogonal eigenvectors v_i.\n"
            "4. Singular Value Decomposition (SVD): Compute X_centered = U Σ Vᵀ. Columns of V are exact principal directions v_i; singular values σ_i relate to eigenvalues via λ_i = σ_i² / (N-1).\n"
            "5. Projection & Reconstruction: Compress to rank-k via Z = X_centered V_k. Reconstruct X_hat = Z V_kᵀ + μ."
        ),
        "experimentalSetup": (
            "EMPIRICAL EVALUATION & PROOF LANDMARKS:\n"
            "• Mathematical Proof: Eckart–Young–Mirsky Theorem proves rank-k SVD truncation minimizes Frobenius norm reconstruction error ||X - X_hat||_F² over all rank-k matrices.\n"
            "• Baseline Metric: Establishes Fraction of Variance Unexplained (FVU) = 1 - (Σ_{i≤k} λ_i / Σ_all λ_i) as the universal benchmark for linear representation preservation."
        ),
        "keyIdeas": [
            _idea("Variance and Covariance", "Variance measures single-variable spread; covariance measures how two variables co-move. The covariance matrix summarizes all 2nd-order relationships."),
            _idea("Principal Component Directions", "Orthonormal directions that successively maximize remaining variance. First PC = longest axis of the data cloud."),
            _idea("Eigenvectors & SVD", "PCA solves an eigen-problem on covariance matrix C, or SVD X = U Σ Vᵀ on the centered data matrix X."),
            _idea("Optimal Low-Rank Reconstruction", "Keeping top-k principal components yields the provably optimal rank-k linear reconstruction in least-squares sense (Eckart–Young theorem)."),
            _idea("FVU (Fraction of Variance Unexplained)", "FVU = 1 - (Explained Variance / Total Variance). Used throughout SAE literature to measure reconstruction fidelity."),
            _idea("Orthogonal ≠ Interpretable Concept", "Orthogonality is a mathematical convenience for linear basis construction, not a semantic guarantee of monosemanticity."),
        ],
        "simplifiedMath": [
            {"name": "PCA Optimization Objective", "formula": "max_u uᵀ C u   s.t. ||u|| = 1", "meaning": "Find unit direction u that maximizes projected variance, where C is the covariance matrix."},
            {"name": "Singular Value Decomposition (SVD)", "formula": "X = U Σ Vᵀ", "meaning": "Decomposes data X into left singular vectors U, singular values Σ, and right singular vectors V (principal directions)."},
            {"name": "Fraction of Variance Unexplained (FVU)", "formula": "FVU = 1 - (Σ_{i≤k} λ_i) / (Σ_{all} λ_i)", "meaning": "Ratio of leftover variance to total variance after keeping k components."},
        ],
        "vocabulary": [
            {"term": "Principal Component", "def": "An orthogonal direction in vector space along which data variance is maximized."},
            {"term": "Covariance Matrix", "def": "A square matrix containing pairwise covariances between all feature dimensions."},
            {"term": "FVU", "def": "Fraction of Variance Unexplained; normalized reconstruction error."},
            {"term": "Low-Rank Approximation", "def": "Approximating a high-dimensional matrix using a small number of basis vectors."},
        ],
        "whatItShows": ["How to compress high-dimensional vectors by preserving maximum variance", "How to compute linear reconstruction fidelity using FVU"],
        "whatItDoesNotShow": ["That principal components correspond to human-interpretable concepts", "How to unmix independent non-orthogonal sources", "How to align two different observation views"],
        "setconcaUse": [
            "Use PCA as a mandatory baseline when evaluating SAE reconstruction (FVU).",
            "Never claim interpretability from low FVU alone.",
            "Compare SAE dictionary efficiency against PCA at matched rank.",
        ],
        "masteryChecklist": [
            "I can derive PCA as variance maximization under orthogonality constraints.",
            "I can calculate and interpret FVU.",
            "I can explain why orthogonal principal components are rarely pure human concepts.",
            "I know how to use PCA as an SAE reconstruction baseline.",
        ],
        "commonConfusions": [
            {"wrong": "Good PCA reconstruction means we found interpretable features.", "right": "It only means variance was preserved. Orthogonal axes are math artifacts, not concepts."},
            {"wrong": "PCA finds independent sources.", "right": "PCA only decorrelates (zero covariance). ICA is required for statistical independence."},
        ],
        "quiz": [
            _q("PCA maximizes which metric along orthogonal axes?", ["Variance", "Statistical independence", "Cross-view correlation", "L0 sparsity"], 0, "PCA maximizes captured variance under orthogonality constraints."),
            _q("What does FVU measure?", ["Fraction of variance left unexplained by reconstruction", "Monosemanticity score", "Causal intervention effect", "Probe accuracy"], 0, "FVU = 1 - explained variance fraction."),
            _q("Are orthogonal principal components guaranteed to be clean human concepts?", ["No", "Yes"], 0, "Orthogonality is a mathematical convenience, not a semantic guarantee."),
        ],
    },
    "ica-shlens": {
        "whyWeRead": "ICA is the classical source-unmixing framework. It is the direct conceptual ancestor of Concept Component Analysis (ConCA) and independence-style representation unmixing.",
        "oneSentence": "A linear-algebra tutorial on recovering statistically independent source signals from linear mixtures.",
        "plainLanguage": (
            "Welcome to the ICA Masterclass. Let's start with the fundamental problem ICA solves: the Cocktail Party Problem.\n\n"
            "Imagine two independent speakers talking simultaneously in a room. Two microphones record different blended mixtures of their voices: x_1 = a s_1 + b s_2 and x_2 = c s_1 + d s_2. How can we recover the original pure voices s_1 and s_2 without knowing the mixing weights a,b,c,d?\n\n"
            "PCA fails here because the independent voices are NOT orthogonal in microphone space. PCA simply finds the direction of maximum combined volume, mixing both voices together!\n\n"
            "--- THE POWER OF STATISTICAL INDEPENDENCE ---\n"
            "ICA relies on a much stronger principle than PCA: Statistical Independence. Zero correlation only means E[xy] = E[x]E[y] (no linear relationship). Independence means the joint probability distribution factors completely: p(x,y) = p(x)p(y) — knowing x gives ZERO information about y across ALL higher-order moments.\n\n"
            "--- HOW ICA UNMIXES SIGNALS (NON-GAUSSIANITY) ---\n"
            "The Central Limit Theorem states that adding independent signals together makes the resulting mixture MORE Gaussian (bell-curve shaped). Therefore, mixed signals are always more bell-shaped than individual pure signals!\n\n"
            "ICA operates by searching for an unmixing matrix W such that the recovered outputs y = W x are as NON-GAUSSIAN as possible! By maximizing kurtosis or negentropy, ICA pops the independent non-Gaussian sources back out.\n\n"
            "--- IDENTIFIABILITY AND ASSUMPTIONS ---\n"
            "ICA can successfully recover the true sources (up to permutation and scaling) ONLY IF three assumptions hold:\n"
            "1. The sources are statistically independent.\n"
            "2. At most one source is Gaussian (Gaussian sources cannot be unmixed because bell curves are rotationally symmetric).\n"
            "3. The mixing process is linear (x = A s).\n\n"
            "RELATION TO CONCA:\n"
            "Concept Component Analysis (ConCA) treats model activations as linear mixtures of concept components, directly inheriting ICA's generative unmixing framework."
        ),
        "keyIdeas": [
            _idea("Linear Mixing Model", "Observed activations x = A s come from independent sources s mixed by matrix A. Goal: learn W to recover y = W x ≈ P D s."),
            _idea("Independence vs. Uncorrelatedness", "Uncorrelatedness (Cov=0) is 2nd-order. Independence (p(s)=∏p(s_i)) is higher-order across all moments."),
            _idea("Non-Gaussianity Maximization", "Central Limit Theorem implies mixed signals are more Gaussian. ICA maximizes non-Gaussianity to unmix sources."),
            _idea("Whitening Pre-processing", "Whitening removes 2nd-order correlation (PCA + scaling) so ICA can focus entirely on higher-order rotation."),
            _idea("Identifiability Conditions", "Source recovery is mathematically guaranteed only under linear mixing and non-Gaussian independent sources."),
        ],
        "simplifiedMath": [
            {"name": "Linear Mixing Equation", "formula": "x = A s", "meaning": "Observed vector x is a linear combination of independent source vector s via matrix A."},
            {"name": "Unmixing Recovery", "formula": "y = W x = W A s ≈ P D s", "meaning": "Unmixing matrix W recovers sources up to permutation P and scaling matrix D."},
        ],
        "vocabulary": [
            {"term": "Blind Source Separation", "def": "Extracting unobserved source signals from mixed sensor observations without prior mixing info."},
            {"term": "Identifiability", "def": "Mathematical proof that parameters or latent sources can be uniquely recovered under specific assumptions."},
            {"term": "Statistical Independence", "def": "The condition where joint probability density equals the product of marginal densities: p(x,y) = p(x)p(y)."},
        ],
        "whatItShows": ["When and how linear unmixing recovers independent latent sources", "Why non-Gaussianity enables source identification beyond PCA"],
        "whatItDoesNotShow": ["That neural network activations are purely linear independent mixtures", "How to handle overcomplete dictionaries (where sources > dimensions)"],
        "setconcaUse": [
            "Use ICA as the conceptual foundation for Concept Component Analysis (ConCA).",
            "State explicit identifiability assumptions whenever claiming concept recovery.",
            "Distinguish ICA linear unmixing from SAE dictionary learning.",
        ],
        "masteryChecklist": [
            "I can explain the Cocktail Party Problem and why PCA fails it.",
            "I can contrast correlation vs. statistical independence.",
            "I can list the three mathematical assumptions required for ICA identifiability.",
            "I understand why non-Gaussianity maximization recovers independent sources.",
        ],
        "commonConfusions": [
            {"wrong": "PCA and ICA do the same thing.", "right": "PCA maximizes variance along orthogonal axes. ICA maximizes statistical independence to unmix sources."},
            {"wrong": "Uncorrelated variables are automatically independent.", "right": "Uncorrelatedness is weaker. Variables can have zero covariance but strong non-linear dependence."},
        ],
        "quiz": [
            _q("ICA target objective is?", ["Statistical independence / Non-Gaussianity", "Maximum variance", "Cross-view correlation", "L1 penalty"], 0, "ICA searches for independent sources by maximizing non-Gaussianity."),
            _q("Why does ICA require non-Gaussian sources?", ["Gaussian distributions are rotationally symmetric, making direction unidentifiable", "Gaussian sources are non-linear", "PCA requires Gaussianity", "TopK fails on Gaussians"], 0, "Rotational symmetry of Gaussian distributions prevents unique axis identification."),
            _q("ICA is the direct conceptual ancestor of which concept paper?", ["ConCA (Concept Component Analysis)", "SimCLR", "Deep Sets", "CKA"], 0, "ConCA treats activations as mixtures of concept components using unmixing logic."),
        ],
    },
    "cca-uurtio": {
        "whyWeRead": "CCA is the foundation of multi-view learning. It defines how to extract shared signals across two paired representations — a core baseline for SetConCA.",
        "oneSentence": "A comprehensive tutorial on Canonical Correlation Analysis (CCA), regularized CCA, kernel CCA, and deep variants.",
        "plainLanguage": (
            "Welcome to the CCA Masterclass. Let's understand why Harold Hotelling invented CCA in 1936.\n\n"
            "Suppose you have TWO different feature spaces observing the exact same items. Example: View 1 is a 512-dimensional audio embedding of a speech, and View 2 is a 2048-dimensional image embedding of the speaker. Audio and image vectors live in completely different dimensions with different metrics. How do you find the SHARED information between them?\n\n"
            "--- HOW CCA WORKS ---\n"
            "CCA searches for a projection direction u in View 1 space and a projection direction v in View 2 space such that the projected 1D numbers (uᵀx and vᵀy) have the MAXIMUM POSSIBLE CORRELATION!\n\n"
            "These projected scalar channels are called Canonical Variables, and their correlation value is the Canonical Correlation.\n\n"
            "--- MULTIPLE CANONICAL PAIRS ---\n"
            "Once CCA finds the 1st most correlated pair of directions (u_1, v_1), it searches for a 2nd pair (u_2, v_2) that is maximally correlated while remaining uncorrelated with the 1st pair. You can extract multiple canonical pairs ordered by correlation strength.\n\n"
            "--- SHARED VS. PRIVATE INFORMATION ---\n"
            "CCA focuses strictly on SHARED covariance. If View 1 contains high-variance background noise that does not exist in View 2, CCA completely ignores it. This is both a strength (filters private noise) and a risk (may discard useful view-specific detail).\n\n"
            "--- CCA VARIANTS ---\n"
            "1. Regularized CCA: Adds ridge penalty to sample covariance matrices when feature dimension > sample size.\n"
            "2. Kernel CCA: Maps views through non-linear kernel functions to find non-linear shared correlations.\n"
            "3. Deep CCA: Replaces linear projections with deep neural networks (Andrew et al., 2013).\n\n"
            "THE CLASSICAL DECOMPOSITION TRIAD:\n"
            "• PCA: Within-view max variance.\n"
            "• ICA: Within-view independent sources.\n"
            "• CCA: Cross-view shared correlation."
        ),
        "keyIdeas": [
            _idea("Two-View Paired Setup", "Given paired samples (x_i, y_i) from two views, CCA finds linear directions u,v maximizing corr(uᵀX, vᵀY)."),
            _idea("Canonical Variables & Correlations", "Projected scalars uᵀX and vᵀY are canonical variables; their correlation is canonical correlation."),
            _idea("Shared vs. View-Specific Focus", "CCA extracts shared cross-view information; private view-specific variance is ignored."),
            _idea("Regularized / Kernel / Deep Extensions", "Addresses high dimensions (regularization), non-linearity (kernels), and deep neural maps (Deep CCA)."),
            _idea("Generalization & Overfitting Risk", "High sample canonical correlation can overfit finite sample noise; out-of-sample validation is mandatory."),
        ],
        "simplifiedMath": [
            {"name": "CCA Optimization Objective", "formula": "max_{u,v}  uᵀ Σ_{xy} v / √(uᵀ Σ_{xx} u · vᵀ Σ_{yy} v)", "meaning": "Maximize cross-covariance between projected views relative to within-view variance."},
        ],
        "vocabulary": [
            {"term": "Canonical Correlation", "def": "The maximum linear correlation between projected dimensions of two multi-variable views."},
            {"term": "Canonical Variables", "def": "The 1D scalar projections uᵀX and vᵀY produced by CCA directions."},
            {"term": "Multi-View Learning", "def": "Learning representations from multiple distinct paired observations of the same underlying entities."},
        ],
        "whatItShows": ["How to extract shared linear correlation channels between two different feature views", "How variants handle non-linearity and high dimensions"],
        "whatItDoesNotShow": ["That shared directions are causally interpretable concepts", "How to preserve view-specific private details automatically"],
        "setconcaUse": [
            "Use linear CCA as a mandatory multi-view baseline.",
            "Report shared vs. private information explicitly when designing multi-view SAE losses.",
            "Validate canonical correlations on held-out test sets to prevent noise overfitting.",
        ],
        "masteryChecklist": [
            "I can state the CCA objective in plain English and symbols.",
            "I can explain the difference between shared information and private information.",
            "I know why Deep CCA and Regularized CCA were developed.",
            "I can recite the PCA / ICA / CCA comparison triad from memory.",
        ],
        "commonConfusions": [
            {"wrong": "CCA maximizes variance inside View 1.", "right": "PCA maximizes within-view variance. CCA maximizes cross-view correlation."},
            {"wrong": "High CCA correlation means the two views are identical.", "right": "It means their projected directions correlate; their unprojected spaces can differ greatly."},
        ],
        "quiz": [
            _q("CCA maximizes which metric between two views?", ["Correlation of projected dimensions", "Within-view variance", "L0 sparsity", "Reconstruction error"], 0, "CCA maximizes cross-view linear correlation of projected canonical variables."),
            _q("What happens to view-specific private details in standard CCA?", ["They may be discarded because CCA targets shared correlation", "They are amplified", "They are turned into PCA components", "They are saved automatically"], 0, "CCA targets shared cross-view signal, so private details are ignored."),
            _q("What is the primary baseline function of CCA in SetConCA?", ["Primary classical baseline for cross-view feature alignment", "Sparsity enforcer", "Probe classifier", "Decoder enforcer"], 0, "CCA is the classical baseline for multi-view feature alignment."),
        ],
    },
    "ksparse": {
        "whyWeRead": "k-Sparse Autoencoders are the clearest bridge from classical sparse coding to modern TopK SAEs used in mechanistic interpretability.",
        "oneSentence": "Autoencoders with a hard TopK activation operator that keeps exactly k active units while zeroing all others.",
        "plainLanguage": (
            "Welcome to the k-Sparse Autoencoder Masterclass. Let's understand why Alireza Makhzani and Brendan Frey invented this model in 2013.\n\n"
            "--- THE OVERCOMPLETE BOTTLENECK PROBLEM ---\n"
            "An Autoencoder consists of an Encoder z = f(x) and a Decoder x_hat = g(z). If the hidden layer z is OVERCOMPLETE (has more units than input dimension N), an unconstrained autoencoder can easily achieve 0 reconstruction error by learning trivial identity mappings! Every unit becomes a dense, useless mixture of everything.\n\n"
            "--- THE HARD TOPK SOLUTION ---\n"
            "Makhzani & Frey solved this by inserting a hard TopK activation operator after the encoder:\n"
            "1. Encoder computes pre-activations for all hidden units.\n"
            "2. TopK operator finds the k largest pre-activation values.\n"
            "3. Keeps those k activations EXACTLY as they are, and FORCEFULLY SETS ALL OTHER UNITS TO ZERO!\n"
            "4. Decoder reconstructs x_hat from this exact k-sparse code z.\n\n"
            "--- WHY TOPK BEATS L1 REGULARIZATION ---\n"
            "In standard L1 autoencoders, sparsity is encouraged by adding λ Σ|z_i| to the loss function. But L1 penalizes activation MAGNITUDES as well as presence, shrinking active feature values (shrinkage flaw).\n\n"
            "k-Sparse Autoencoders enforce exact cardinality k WITHOUT penalizing magnitudes! The active k units retain their true strength, leading to much better reconstruction at matched sparsity levels.\n\n"
            "--- WHY DENSE INPUTS CAN HAVE SPARSE CODES ---\n"
            "A common beginner confusion: 'If my input vector x is dense (all non-zeros), how can code z be 99% sparse?'\n"
            "Because the dictionary is overcomplete! Dense input vector x is reconstructed as a linear combination of just k dictionary columns (atoms): x_hat = Σ_{i ∈ TopK} z_i W_col_i. A few selected dictionary atoms combine to span the dense input vector."
        ),
        "keyIdeas": [
            _idea("Overcomplete Bottleneck Requirement", "Overcomplete hidden layers (dim > input) require strict sparsity constraints to prevent trivial non-specialized solutions."),
            _idea("Hard TopK Selection", "Enforces exact sparsity by zeroing all activations outside the k largest values."),
            _idea("No Magnitude Shrinkage", "Unlike L1 penalties, TopK does not penalize active unit magnitudes, preserving reconstruction fidelity."),
            _idea("Sparse Code Reconstructs Dense Input", "Sparse code z combined with overcomplete dictionary decoder columns reconstructs dense activation vectors."),
        ],
        "simplifiedMath": [
            {"name": "k-Sparse Activation", "formula": "z = TopK( W_{enc} x + b_{enc}, k )", "meaning": "Keep k largest encoder pre-activations; set remaining entries to 0."},
            {"name": "Reconstruction Loss", "formula": "Loss = ||x - (W_{dec} z + b_{dec})||²", "meaning": "Train encoder/decoder weights to minimize mean squared reconstruction error under the TopK constraint."},
        ],
        "vocabulary": [
            {"term": "Dictionary Atom", "def": "A single column vector of the decoder matrix representing a reusable feature direction."},
            {"term": "k-Sparsity", "def": "The condition where a vector has exactly k non-zero entries (||z||₀ = k)."},
            {"term": "Overcomplete", "def": "A representation where hidden dimension exceeds input dimension."},
        ],
        "whatItShows": ["That hard TopK activation enforces exact k-sparsity in autoencoders", "That overcomplete sparse codes can reconstruct dense input vectors accurately"],
        "whatItDoesNotShow": ["That TopK features are guaranteed to be monosemantic concepts", "How features behave in transformer language model residual streams"],
        "setconcaUse": [
            "Treat TopK SAEs as the direct descendant of this architecture.",
            "Use matched-k operating points when comparing sparsity mechanisms.",
        ],
        "masteryChecklist": [
            "I can explain why overcomplete autoencoders require sparsity.",
            "I can contrast L1 soft penalties with hard TopK selection.",
            "I understand how a sparse combination of dictionary atoms reconstructs a dense input.",
        ],
        "commonConfusions": [
            {"wrong": "Sparse latent code means the input vector must be sparse.", "right": "Input vector x can be dense. Overcomplete dictionary atoms combine to reconstruct dense x from sparse z."},
            {"wrong": "TopK is just L1 regularization.", "right": "L1 adds soft magnitude penalty to loss. TopK is a hard architectural selection operator with no magnitude shrinkage."},
        ],
        "quiz": [
            _q("How do k-Sparse Autoencoders enforce sparsity?", ["Hard TopK selection keeping exactly k largest activations", "L1 magnitude penalty in loss", "Dropout layers", "PCA truncation"], 0, "Hard TopK selection keeps the top k values and zeroes all others."),
            _q("Why do overcomplete autoencoders fail without sparsity?", ["Without sparsity, dense overcomplete codes learn trivial non-specialized solutions", "They overflow memory", "They cannot compute gradients", "They fail CCA"], 0, "Without sparsity, overcomplete codes reconstruct using tiny weights across all units without specializing."),
            _q("What advantage does TopK have over L1 regularization?", ["TopK avoids magnitude shrinkage on active features", "TopK is linear", "TopK requires no hyperparameter", "TopK guarantees 0 loss"], 0, "TopK does not penalize active feature magnitudes, avoiding L1 shrinkage."),
        ],
    },
    "vae": {
        "whyWeRead": "VAEs introduce probabilistic latent-variable modeling, variational inference, the reparameterization trick, and the ELBO loss — foundational vocabulary for Gaussian set aggregations and Product-of-Experts (PoE).",
        "oneSentence": "Derives Variational Autoencoders (VAEs), approximate posterior estimation, the reparameterization trick, and the Evidence Lower Bound (ELBO).",
        "plainLanguage": (
            "Welcome to the VAE Masterclass. Let's understand why Diederik Kingma and Max Welling invented VAEs in 2013.\n\n"
            "--- DETERMINISTIC VS PROBABILISTIC AUTOENCODERS ---\n"
            "A standard autoencoder maps input x to a single deterministic point z in latent space. But what if you want to GENERATE new data, or model UNCERTAINTY? Deterministic latent spaces have empty gaps where decoding produces nonsense.\n\n"
            "A VAE treats each input x as being generated by a probabilistic latent variable z. Instead of predicting a single point z, the encoder predicts the PARAMETERS of a distribution: a mean vector μ(x) and a variance vector σ²(x)!\n\n"
            "--- THE REPARAMETERIZATION TRICK ---\n"
            "Here is the technical wall Kingma & Welling hit: how do you backpropagate neural network gradients through a random sampling step z ~ N(μ, σ²)?\n"
            "Random sampling is non-differentiable! Standard backpropagation fails.\n\n"
            "The Brilliant Solution (Reparameterization Trick):\n"
            "Isolate the randomness outside the network! Sample pure noise ε from a standard normal distribution N(0, I). Then compute latent z deterministically:\n"
            "z = μ(x) + σ(x) ⊙ ε\n"
            "Now μ and σ are standard deterministic outputs, and gradients flow cleanly back into the encoder parameters!\n\n"
            "--- THE ELBO LOSS (Evidence Lower Bound) ---\n"
            "VAEs optimize the ELBO, which balances two competing forces:\n"
            "Loss = Reconstruction Error + KL-Divergence( q(z|x) || p(z) )\n"
            "1. Reconstruction Error: Encoder and decoder work together to reconstruct input x accurately.\n"
            "2. KL-Divergence Penalty: Forces the predicted distribution q(z|x) to stay close to a simple standard normal prior p(z) = N(0, I). This prevents the encoder from scattering latent distributions far apart, keeping the latent space continuous and smooth.\n\n"
            "FOR SETCONCA:\n"
            "When SetConCA represents sets of activation views as probabilistic Gaussian distributions or merges them using Product-of-Experts (PoE), you are using this exact VAE ELBO vocabulary."
        ),
        "keyIdeas": [
            _idea("Probabilistic Latent Variable Model", "Data x is generated from latent distribution z. Encoder predicts posterior parameters μ(x) and σ(x)."),
            _idea("Reparameterization Trick", "Expresses random sample z = μ + σ ⊙ ε with external noise ε ~ N(0,I), enabling differentiable backprop."),
            _idea("ELBO Tradeoff", "Balances reconstruction quality (fidelity) against KL divergence regularization toward prior p(z)=N(0,I)."),
            _idea("Smooth Latent Manifold", "KL regularization prevents latent space gaps, enabling continuous interpolation and probabilistic fusion."),
        ],
        "simplifiedMath": [
            {"name": "Reparameterization Formula", "formula": "z = μ(x) + σ(x) ⊙ ε,   ε ~ N(0, I)", "meaning": "Differentiable latent sampling separating deterministic parameters from random noise ε."},
            {"name": "ELBO Objective", "formula": "ELBO = E_{q(z|x)}[log p(x|z)] - KL(q(z|x) || p(z))", "meaning": "Maximize expected log reconstruction likelihood minus KL divergence to standard normal prior."},
        ],
        "vocabulary": [
            {"term": "ELBO", "def": "Evidence Lower Bound; the variational objective maximized during VAE training."},
            {"term": "KL Divergence", "def": "Kullback–Leibler divergence; measures relative entropy/difference between two probability distributions."},
            {"term": "Reparameterization Trick", "def": "Method rewriting stochastic sampling so encoder parameters receive backprop gradients."},
        ],
        "whatItShows": ["How to train continuous probabilistic latents using variational inference", "How the reparameterization trick enables gradient flow through sampling"],
        "whatItDoesNotShow": ["That VAE Gaussian latents are monosemantic features", "How overcomplete dictionaries unpack superposed representations"],
        "setconcaUse": [
            "Use ELBO intuition for Gaussian set view representations.",
            "Apply Product-of-Experts (PoE) fusion when combining multi-view posteriors.",
        ],
        "masteryChecklist": [
            "I can explain why standard random sampling breaks backpropagation.",
            "I can write the reparameterization formula and explain why it works.",
            "I can explain the two terms in the ELBO loss and their trade-off.",
        ],
        "commonConfusions": [
            {"wrong": "VAE is the same as SAE.", "right": "VAE is a probabilistic bottleneck model with a Gaussian prior. SAE is an overcomplete sparse dictionary enforcer for interpretability."},
        ],
        "quiz": [
            _q("What problem does the Reparameterization Trick solve?", ["Enables gradient backpropagation through stochastic sampling", "Increases L0 sparsity", "Computes CKA", "Solves PCA"], 0, "It isolates random sampling outside the parameter graph so backprop gradients can flow."),
            _q("The ELBO loss balances which two terms?", ["Reconstruction quality vs. KL divergence to prior", "L0 sparsity vs. L1 penalty", "CCA correlation vs. PCA variance", "Precision vs. Recall"], 0, "ELBO balances expected reconstruction likelihood against KL divergence from the prior."),
            _q("Why is VAE vocabulary relevant to SetConCA?", ["Provides framework for probabilistic Gaussian set representations and Product-of-Experts fusion", "Replaces SAEs", "Eliminates need for data", "Computes TopK"], 0, "VAEs provide the probabilistic framework for multi-view Gaussian fusion."),
        ],
    },
    "dcca": {
        "whyWeRead": "Deep CCA is the non-linear extension of CCA. It is the precursor to coordinating neural view encoders with multi-view alignment objectives.",
        "oneSentence": "Deep Canonical Correlation Analysis replaces linear CCA projections with neural network encoders trained to maximize canonical correlation.",
        "plainLanguage": (
            "Welcome to the Deep CCA Masterclass. Let's understand why Galen Andrew et al. developed Deep CCA in 2013.\n\n"
            "--- BEYOND LINEAR CCA ---\n"
            "In linear CCA (Level 1), we search for linear projections u and v that maximize correlation between two views. But real-world data (images, text, audio, neural activations) has complex NON-LINEAR relationships. Linear CCA fails when the shared signal requires non-linear transformations.\n\n"
            "--- HOW DEEP CCA WORKS ---\n"
            "Deep CCA places a deep neural network f_θ on View 1 and a deep neural network g_φ on View 2. The entire system is trained end-to-end to maximize the sum of canonical correlations between output embeddings f_θ(X_1) and g_φ(X_2)!\n\n"
            "--- THE WHITENING / COVARIANCE CONSTRAINT ---\n"
            "Without constraints, neural network encoders would cheat! Both networks could output a constant vector (e.g. [1, 1, 1]), achieving a fake 'perfect' correlation of 1.0 (representation collapse).\n\n"
            "To prevent collapse, DCCA enforces a whitening constraint: the output dimensions of each encoder MUST have unit variance and zero correlation with each other (1/N Z_1ᵀ Z_1 = I and 1/N Z_2ᵀ Z_2 = I).\n\n"
            "--- THE FAILURE MODE: INFORMATION DISCARD ---\n"
            "If DCCA's ONLY objective is cross-view correlation, the networks learn to THROW AWAY any information that is unique to one view (private details). This failure mode directly motivated DCCAE."
        ),
        "keyIdeas": [
            _idea("Non-Linear Neural View Encoders", "Replaces linear projections with deep neural networks to extract complex non-linear shared signals."),
            _idea("Correlation-Maximizing Loss", "Trains network parameters end-to-end to maximize top-k canonical correlations."),
            _idea("Covariance Whitening Constraint", "Enforces identity covariance on latent outputs to prevent representation collapse."),
            _idea("Risk of Private Detail Loss", "Correlation-only loss discards view-specific details not present in both views."),
        ],
        "simplifiedMath": [
            {"name": "DCCA Optimization", "formula": "max_{θ, φ}  corr( f_θ(X_1), g_φ(X_2) )   s.t. Cov(f_θ) = I, Cov(g_φ) = I", "meaning": "Train neural network weights θ and φ to maximize canonical correlation under whitening constraints."},
        ],
        "vocabulary": [
            {"term": "Deep CCA", "def": "Multi-view representation learning using deep neural encoders trained on canonical correlation objectives."},
            {"term": "Representation Collapse", "def": "A failure state where neural encoders output constant or degenerate vectors to achieve fake correlation."},
        ],
        "whatItShows": ["That non-linear neural networks can be trained directly on canonical correlation objectives"],
        "whatItDoesNotShow": ["How to preserve view-specific private details needed for reconstruction"],
        "setconcaUse": [
            "Use Deep CCA as a non-linear multi-view baseline.",
            "Audit whether alignment objectives destroy private activation details.",
        ],
        "masteryChecklist": [
            "I can explain how Deep CCA extends linear CCA.",
            "I know why whitening constraints are mandatory in DCCA.",
            "I can describe the private information discard failure mode.",
        ],
        "commonConfusions": [
            {"wrong": "Maximizing correlation is always sufficient for multi-view learning.", "right": "Pure correlation objectives throw away useful private details present in single views."},
        ],
        "quiz": [
            _q("What does Deep CCA add to classical linear CCA?", ["Deep neural network view encoders", "L1 sparse dictionaries", "Probes", "Attention layers"], 0, "Deep CCA replaces linear projections with deep neural encoders."),
            _q("Why are covariance whitening constraints necessary in DCCA?", ["Prevents representation collapse into constant vectors", "Increases L0 sparsity", "Computes SVD", "Speeds up GPU"], 0, "Constraints prevent trivial constant solutions where output covariance collapses."),
        ],
    },
    "dccae": {
        "whyWeRead": "DCCAE illuminates the central tradeoff for SetConCA: balancing cross-view alignment correlation against within-view reconstruction fidelity.",
        "oneSentence": "Deep Canonically Correlated Autoencoders (DCCAE) combine cross-view correlation maximization with autoencoder reconstruction losses.",
        "plainLanguage": (
            "Welcome to the DCCAE Masterclass. Let's understand why Weiran Wang et al. introduced DCCAE in 2015.\n\n"
            "--- THE MULTI-VIEW DILEMMA ---\n"
            "In Deep CCA, you maximize cross-view correlation. But correlation-only training discards view-specific (private) information.\n"
            "In standard Autoencoders, you maximize within-view reconstruction. But autoencoders trained independently never align their representations across views!\n\n"
            "--- THE DCCAE SYNTHESIS ---\n"
            "DCCAE solves this dilemma by combining BOTH objectives into a single unified loss function:\n\n"
            "Loss = - Canonical_Correlation(z_1, z_2) + λ_1 ||x_1 - dec_1(z_1)||² + λ_2 ||x_2 - dec_2(z_2)||²\n\n"
            "• The CCA term pulls shared representations into cross-view alignment.\n"
            "• The Autoencoder reconstruction terms FORCE each encoder to retain enough private detail to reconstruct raw inputs!\n\n"
            "--- LESSON FOR SETCONCA ---\n"
            "SetConCA faces this exact same tension! When coordinating sparse autoencoders across multiple activation views, you must balance contrastive set alignment against within-view reconstruction (FVU). Tuning λ traces out an alignment-fidelity Pareto curve."
        ),
        "keyIdeas": [
            _idea("Unified Loss Function", "Combines cross-view canonical correlation with dual autoencoder reconstruction losses."),
            _idea("Alignment vs. Preservation Tradeoff", "Correlation aligns shared concepts; reconstruction preserves private view details."),
            _idea("Pareto Frontier Tuning", "Weight parameter λ controls the operating point between cross-view alignment and raw view reconstruction."),
        ],
        "simplifiedMath": [
            {"name": "DCCAE Combined Loss", "formula": "Loss = - corr(z_1, z_2) + λ ( ||x_1 - x̂_1||² + ||x_2 - x̂_2||² )", "meaning": "Trade off cross-view canonical correlation against individual view reconstruction errors."},
        ],
        "vocabulary": [
            {"term": "DCCAE", "def": "Deep Canonically Correlated Autoencoders; multi-view model combining correlation and autoencoding."},
        ],
        "whatItShows": ["That combining alignment and reconstruction objectives preserves both shared and private information"],
        "whatItDoesNotShow": ["The optimal hyperparameter λ for sparse autoencoders on language model activations"],
        "setconcaUse": [
            "Always include reconstruction loss when adding contrastive alignment to SAEs.",
            "Sweep alignment weight λ and plot alignment vs. FVU Pareto curves.",
        ],
        "masteryChecklist": [
            "I can explain why correlation-only multi-view training is dangerous.",
            "I can write the combined DCCAE loss function and explain both parts.",
        ],
        "commonConfusions": [
            {"wrong": "Cross-view alignment replaces the need for reconstruction loss.", "right": "Alignment alone discards private information. You need reconstruction to preserve activation detail."},
        ],
        "quiz": [
            _q("What does DCCAE add to Deep CCA?", ["Autoencoder reconstruction losses for each view", "TopK sparsity", "Linear probes", "Random dropout"], 0, "DCCAE adds within-view reconstruction losses to protect private information."),
        ],
    },
    "vcca": {
        "whyWeRead": "VCCA introduces explicit shared and private latent variable factorizations in a probabilistic multi-view generative model.",
        "oneSentence": "Deep Variational CCA models multi-view data using variational inference with explicit shared and private latent variables.",
        "plainLanguage": (
            "Welcome to the VCCA Masterclass. Let's understand how Weiran Wang et al. (2016) formalized multi-view learning probablistically.\n\n"
            "--- EXPLICIT SHARED AND PRIVATE LATENTS ---\n"
            "Rather than hoping a single latent vector contains a mixture of shared and private information, VCCA EXPLICITLY SPLITS the latent representation into separate vectors:\n"
            "• z_shared: Shared latent vector explaining commonality across all views.\n"
            "• z_priv1: Private latent vector explaining view 1 details.\n"
            "• z_priv2: Private latent vector explaining view 2 details.\n\n"
            "View 1 is decoded from (z_shared, z_priv1). View 2 is decoded from (z_shared, z_priv2).\n\n"
            "--- HANDLING MISSING VIEWS ---\n"
            "Because VCCA is a probabilistic generative model, if View 2 is missing at test time, the model can still infer z_shared from View 1 alone! This provides robustness against incomplete view sets."
        ),
        "keyIdeas": [
            _idea("Explicit Latent Factorization", "Splits latents into z = [z_shared | z_private] to separate alignment from view-specific variance."),
            _idea("Generative Multi-View Architecture", "Views are conditionally independent given shared and private latents."),
            _idea("Robustness to Missing Views", "Generative inference allows conditioning on any subset of observed views."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "Private Latent", "def": "A latent variable dedicated strictly to modeling variance unique to a single view."},
            {"term": "VCCA", "def": "Variational Deep Canonical Correlation Analysis."},
        ],
        "whatItShows": ["How to explicitly factorize multi-view representations into shared and private probabilistic latents"],
        "whatItDoesNotShow": ["How to discover sparse monosemantic dictionaries"],
        "setconcaUse": [
            "Incorporate explicit shared/private split designs when building multi-view SAE architectures.",
            "Test SetConCA robustness under missing view conditions.",
        ],
        "masteryChecklist": [
            "I can draw the VCCA generative diagram showing shared and private latents.",
            "I can explain how VCCA handles missing views.",
        ],
        "commonConfusions": [
            {"wrong": "Shared latent means view embeddings are identical.", "right": "Shared latent models common underlying factors; private latents model view differences."},
        ],
        "quiz": [
            _q("VCCA's private latents capture what type of information?", ["View-specific variance unique to one view", "Shared correlation", "Label noise only", "TopK indices"], 0, "Private latents explicitly capture view-specific details."),
        ],
    },
    "dgcca": {
        "whyWeRead": "DGCCA extends CCA thinking from 2 views to an arbitrary number of views (N views) — essential for multi-view set coordination.",
        "oneSentence": "Deep Generalized CCA learns a central common representation across an arbitrary number of neural view encoders.",
        "plainLanguage": (
            "Welcome to DGCCA. What happens when you have 5 layers, 10 prompt paraphrases, or 4 image modalities?\n\n"
            "Pairwise CCA requires N(N-1)/2 separate pairwise models. Deep Generalized CCA (DGCCA, Benton et al., 2017) introduces a single central target matrix G. Every view encoder f_i(X_i) is trained to project into this common shared matrix G simultaneously!"
        ),
        "keyIdeas": [
            _idea("N-View Generalization", "Extends CCA from 2 views to arbitrary N views efficiently."),
            _idea("Central Target Matrix G", "Learns a single shared target representation matrix G that all views align with."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "DGCCA", "def": "Deep Generalized Canonical Correlation Analysis for N > 2 views."},
        ],
        "whatItShows": ["How to scale multi-view alignment to arbitrary numbers of views"],
        "whatItDoesNotShow": ["Sparse dictionary dictionary learning"],
        "setconcaUse": [
            "Use DGCCA conceptual framework when extending SetConCA beyond pairs to multi-view activation sets.",
        ],
        "masteryChecklist": [
            "I can explain why pairwise CCA scales poorly for N views and how DGCCA solves it.",
        ],
        "commonConfusions": [
            {"wrong": "DGCCA forces all views to output identical vectors.", "right": "DGCCA aligns view projections with a shared central target space G."},
        ],
        "quiz": [
            _q("DGCCA is designed for how many views?", ["Arbitrary N views (N ≥ 2)", "Exactly 2 views only", "1 view only", "0 views"], 0, "DGCCA generalizes CCA to arbitrary numbers of views."),
        ],
    },
    "deepsets": {
        "whyWeRead": "Deep Sets provides the fundamental mathematical theory for constructing permutation-invariant set representations.",
        "oneSentence": "Proves that any continuous permutation-invariant set function can be factorized as f(X) = ρ( Σ_{x∈X} φ(x) ).",
        "plainLanguage": (
            "Welcome to the Deep Sets Masterclass. Let's understand why Manzil Zaheer et al. published this landmark paper in 2017.\n\n"
            "--- WHAT IS A SET? ---\n"
            "A set is an UNORDERED collection of items: X = {x_1, x_2, ..., x_N}. The set {A, B, C} is IDENTICAL to {C, A, B}.\n\n"
            "--- WHY STANDARD NEURAL NETWORKS FAIL ON SETS ---\n"
            "If you concatenate set elements [x_1, x_2, x_3] into a standard MLP, the network treats input position 1 differently from position 2! If you swap inputs, the output changes. That violates the mathematical definition of a set function.\n\n"
            "--- THE DEEP SETS THEOREM ---\n"
            "Zaheer et al. proved that ANY valid permutation-invariant function f(X) can be decomposed into three clean steps:\n"
            "1. Element Encoder φ: Map each set member x_i independently through a neural network φ(x_i).\n"
            "2. Commutative Aggregation: Sum (or average) the encodings: Σ φ(x_i).\n"
            "3. Set Decoder ρ: Map the aggregated sum vector through a post-processing network ρ.\n\n"
            "Formula: f(X) = ρ( Σ_{x ∈ X} φ(x) )\n\n"
            "Why SUM/MEAN pooling guarantees invariance: Addition is commutative (a + b = b + a). The sum is 100% identical regardless of input order!\n\n"
            "FOR SETCONCA:\n"
            "Deep Sets (mean pooling over φ(x_i)) is the foundational aggregator for combining multiple activation views into one concept code."
        ),
        "keyIdeas": [
            _idea("Permutation Invariance Requirement", "Set functions must satisfy f(π(X)) = f(X) for any input permutation π."),
            _idea("Universal Sum-Decomposition", "Proves invariant functions factorize into per-element map φ, sum pooling, and post-map ρ."),
            _idea("Permutation Equivariance", "When predicting per-member outputs, equivariance requires output permutation to match input permutation: f(π(X)) = π(f(X))."),
        ],
        "simplifiedMath": [
            {"name": "Deep Sets Universal Form", "formula": "f(X) = ρ( Σ_{x ∈ X} φ(x) )", "meaning": "Process elements with φ, sum pool, then transform with ρ."},
        ],
        "vocabulary": [
            {"term": "Permutation Invariance", "def": "The property that input order does not alter output."},
            {"term": "Permutation Equivariance", "def": "The property that permuting inputs permutes outputs identically."},
        ],
        "whatItShows": ["The exact architectural requirement for universal permutation-invariant set learning"],
        "whatItDoesNotShow": ["That simple mean pooling is sufficient when element relationships matter"],
        "setconcaUse": [
            "Use Deep Sets (mean pooling of φ(x)) as the baseline set aggregator in SetConCA.",
        ],
        "masteryChecklist": [
            "I can write the Deep Sets formula and explain φ, Σ, and ρ.",
            "I can explain why addition guarantees permutation invariance.",
        ],
        "commonConfusions": [
            {"wrong": "Concatenating set items into an MLP works fine for sets.", "right": "Concatenation encodes arbitrary order. Deep Sets sum pooling is required for true set invariance."},
        ],
        "quiz": [
            _q("What is the core Deep Sets formula?", ["ρ( Σ φ(x) )", "TopK(x)", "CCA(x,y)", "InfoNCE(q,k)"], 0, "Deep Sets factorizes set functions as ρ( Σ φ(x) )."),
        ],
    },
    "neural-stat": {
        "whyWeRead": "Neural Statistician treats an entire dataset or set as a single probabilistic object with a latent code.",
        "oneSentence": "Learns latent representations of entire datasets/sets to capture underlying generative distributions.",
        "plainLanguage": (
            "Welcome to Neural Statistician (Edwards & Storkey, 2016). Instead of creating a latent vector for a single image, what if your goal is to represent an ENTIRE DATASET or BAG OF VIEWS as a single latent statistic?\n\n"
            "Neural Statistician builds a statistic network that pools summary statistics across a set to infer a set-level latent c. The set code c represents the underlying probability distribution that generated the set items."
        ),
        "keyIdeas": [
            _idea("Dataset/Set as First-Class Object", "Learns a latent representation for an entire collection of items."),
            _idea("Distributional Summary Code", "Set code represents the generating distribution rather than individual items."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "Set Latent", "def": "A latent code representing an entire set or distribution of items."},
        ],
        "whatItShows": ["That entire sets can be represented as latent probabilistic objects"],
        "whatItDoesNotShow": ["How to construct sparse autoencoder dictionaries"],
        "setconcaUse": [
            "Inspiration for defining what a SetConCA concept code should capture across activation view sets.",
        ],
        "masteryChecklist": [
            "I can explain the difference between an item latent and a set latent.",
        ],
        "commonConfusions": [
            {"wrong": "A set representation must reconstruct every individual member perfectly.", "right": "Set latents can target the shared generative distribution rather than raw member noise."},
        ],
        "quiz": [
            _q("Neural Statistician primarily represents what object as a latent code?", ["An entire set/dataset", "A single pixel", "A linear probe", "A single token"], 0, "Neural Statistician represents an entire set/dataset as a latent object."),
        ],
    },
    "set-transformer": {
        "whyWeRead": "Set Transformer handles sets where meaning depends on INTERACTIONS among members, outperforming independent Deep Sets pooling.",
        "oneSentence": "An attention-based permutation-invariant network using self-attention over set members and inducing points for efficiency.",
        "plainLanguage": (
            "Welcome to the Set Transformer Masterclass. Let me explain why Juho Lee et al. invented Set Transformer in 2019.\n\n"
            "--- WHERE DEEP SETS STRUGGLES ---\n"
            "Deep Sets encodes every set member in COMPLETE ISOLATION (φ(x_i)) before sum pooling. But what if the meaning of a set depends on PAIRWISE RELATIONSHIPS between members?\n"
            "Example: If an intruder/outlier activation is added to a set, Deep Sets blindly adds the intruder into the sum, corrupting the set representation!\n\n"
            "--- THE SET TRANSFORMER SOLUTION ---\n"
            "Set Transformer lets set members ATTEND TO EACH OTHER using Self-Attention before pooling!\n"
            "Members can compare values, identify outliers, and weight contributions dynamically. To maintain permutation invariance, Set Transformer uses Pooling by Multihead Attention (PMA) with learned seed vectors.\n\n"
            "--- INDUCING POINTS (ISAB) FOR COMPUTATIONAL EFFICIENCY ---\n"
            "Standard self-attention over N set members costs O(N²) memory/compute. For large sets, this is expensive.\n"
            "Set Transformer introduces Induced Set Attention Blocks (ISAB): members attend to M learned 'Inducing Points' (where M << N), reducing computational complexity from O(N²) to O(N M)!"
        ),
        "keyIdeas": [
            _idea("Inter-Member Self-Attention", "Allows set elements to interact and compare before aggregation."),
            _idea("PMA (Pooling by Multihead Attention)", "Permutation-invariant pooling using learned seed vectors as attention queries."),
            _idea("Inducing Points (ISAB)", "Bottleneck memory vectors reducing self-attention cost from O(N²) to O(N M)."),
        ],
        "simplifiedMath": [
            {"name": "ISAB Complexity", "formula": "O(N · M)  where M << N", "meaning": "Linear scaling w.r.t set size N using M inducing points."},
        ],
        "vocabulary": [
            {"term": "Inducing Points", "def": "Learned memory vectors acting as attention bottlenecks to speed up set self-attention."},
            {"term": "PMA", "def": "Pooling by Multihead Attention; attention-based set aggregation operator."},
        ],
        "whatItShows": ["That interaction-aware attention pooling beats independent sum pooling on relational set tasks"],
        "whatItDoesNotShow": ["That attention pooling is always necessary for simple independent set averages"],
        "setconcaUse": [
            "Use Set Transformer as the relational aggregator when view sets contain intruders or complex view interactions.",
        ],
        "masteryChecklist": [
            "I can contrast Deep Sets independent pooling with Set Transformer self-attention.",
            "I understand how Inducing Points reduce computational cost.",
        ],
        "commonConfusions": [
            {"wrong": "Set Transformer loses permutation invariance because it uses attention.", "right": "Self-attention is permutation-equivariant, and PMA pooling with learned seeds ensures complete permutation invariance."},
        ],
        "quiz": [
            _q("What key mechanism does Set Transformer add over Deep Sets?", ["Self-attention over set members before pooling", "L1 penalty", "PCA reduction", "Linear probing"], 0, "Set Transformer allows members to interact via self-attention before pooling."),
            _q("What is the computational benefit of Inducing Points (ISAB)?", ["Reduces self-attention complexity from O(N²) to O(N M)", "Increases L0 sparsity", "Eliminates decoder", "Computes CKA"], 0, "Inducing points reduce self-attention complexity to linear scaling O(N M)."),
        ],
    },
    "cpc": {
        "whyWeRead": "CPC introduced the InfoNCE loss function — the mathematical foundation for contrastive representation learning.",
        "oneSentence": "Learns representations by predicting future context using the contrastive InfoNCE objective.",
        "plainLanguage": (
            "Welcome to the CPC / InfoNCE Masterclass. Let's understand Aaron van den Oord et al.'s (DeepMind 2018) breakthrough.\n\n"
            "--- THE CONTRASTIVE PREDICTION IDEA ---\n"
            "Instead of predicting raw future data pixels or tokens directly (which wastes capacity on fine noise), CPC predicts FUTURE REPRESENTATIONS by framing representation learning as a DISCRIMINATION TASK!\n\n"
            "Given context query q, the model must select the true positive future sample k⁺ out of a minibatch containing 1 positive key and N-1 negative noise keys {k⁻}.\n\n"
            "--- THE INFONCE LOSS ---\n"
            "Loss = - log [ exp(qᵀ k⁺ / τ) / ( exp(qᵀ k⁺ / τ) + Σ exp(qᵀ k⁻_i / τ) ) ]\n\n"
            "This is a softmax cross-entropy loss over cosine similarities scaled by temperature τ.\n\n"
            "--- MUTUAL INFORMATION BOUND ---\n"
            "Van den Oord et al. proved that minimizing InfoNCE loss MAXIMIZES A LOWER BOUND on the Mutual Information I(q; k⁺) between query and positive key:\n"
            "I(q; k⁺) ≥ log(K) - L_InfoNCE (where K is minibatch size).\n\n"
            "FOR SETCONCA:\n"
            "InfoNCE is the exact loss template used to coordinate sparse dictionary codes across multiple activation views."
        ),
        "keyIdeas": [
            _idea("Contrastive Discrimination Task", "Replaces raw signal prediction with selecting true positive key among negative noise distractors."),
            _idea("InfoNCE Softmax Objective", "Softmax cross-entropy over scaled cosine similarities."),
            _idea("Mutual Information Lower Bound", "Minimizing InfoNCE maximizes lower bound on mutual information I(X;Y) <= log(K) - Loss."),
            _idea("Temperature Hyperparameter τ", "Controls softmax sharpness and penalty weight assigned to hard negatives."),
        ],
        "simplifiedMath": [
            {"name": "InfoNCE Loss Formula", "formula": "L_{InfoNCE} = - log \\frac{\\exp(q \\cdot k^+ / \\tau)}{\\exp(q \\cdot k^+ / \\tau) + \\sum_{i} \\exp(q \\cdot k^-_i / \\tau)}", "meaning": "Softmax cross-entropy picking positive key k⁺ over negative keys k⁻ given query q."},
        ],
        "vocabulary": [
            {"term": "InfoNCE", "def": "Information Noise-Contrastive Estimation loss function."},
            {"term": "Query & Key", "def": "Query q is the anchor representation; Key k⁺ is positive target; Keys k⁻ are negative noise."},
        ],
        "whatItShows": ["That contrastive prediction extracts rich structural representations without pixel/token generation"],
        "whatItDoesNotShow": ["That low InfoNCE loss guarantees monosemantic feature dictionary recovery"],
        "setconcaUse": [
            "Default contrastive loss formulation for SetConCA multi-view coordination.",
        ],
        "masteryChecklist": [
            "I can write the InfoNCE loss formula from memory.",
            "I can explain the query, positive key, and negative key setup.",
            "I understand the connection between InfoNCE and mutual information lower bounds.",
        ],
        "commonConfusions": [
            {"wrong": "InfoNCE measures exact mutual information.", "right": "InfoNCE provides a lower bound on mutual information bounded by log(K)."},
        ],
        "quiz": [
            _q("What task does InfoNCE use to train representations?", ["Selecting the true positive key among negative noise keys", "Predicting raw pixel values", "L1 autoencoding", "PCA projection"], 0, "InfoNCE frames learning as selecting the positive key among negative noise keys."),
        ],
    },
    "simclr": {
        "whyWeRead": "SimCLR established the practical engineering blueprint for contrastive learning: data augmentations, projection heads, and temperature.",
        "oneSentence": "A simple framework for contrastive learning showing the critical role of data augmentations, non-linear projection heads, and batch size.",
        "plainLanguage": (
            "Welcome to the SimCLR Masterclass (Ting Chen et al., Google Brain 2020). SimCLR systematically identified the four practical pillars that make contrastive learning work:\n\n"
            "1. Data Augmentations Define the Task: Positive pairs are created by applying two random augmentations to the same image. The choice of augmentation defines what invariant features the model learns!\n"
            "2. Non-Linear Projection Head: Maps representation h through MLP g(h) = z BEFORE computing InfoNCE loss. CRITICAL: Projection z is used during training, but DISCARDED afterwards! Pre-projection representation h retains richer downstream information.\n"
            "3. Large Batch Size & Negatives: Uses all other images in the minibatch as negative pairs.\n"
            "4. Normalized Temperature-scaled Cross-Entropy (NT-Xent)."
        ),
        "keyIdeas": [
            _idea("Augmentations Define Invariance", "The semantic meaning of 'sameness' is determined by the positive pair generation rule."),
            _idea("Projection Head Discard Trick", "Training loss operates on projected z = g(h); downstream tasks evaluate pre-projection embedding h."),
            _idea("In-Batch Negatives", "Uses all other minibatch samples as negative keys."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "Projection Head", "def": "An MLP layer g(h) used during contrastive training and discarded afterwards."},
            {"term": "In-Batch Negatives", "def": "Using other samples in the training minibatch as negative pairs."},
        ],
        "whatItShows": ["Which empirical components (augmentations, projection head, temperature) optimize contrastive performance"],
        "whatItDoesNotShow": ["That image augmentations translate directly to neural activation views without adaptation"],
        "setconcaUse": [
            "Treat prompt/context view generation as carefully as SimCLR treats image augmentation.",
            "Ablate whether projection heads preserve sparse dictionary features in SetConCA.",
        ],
        "masteryChecklist": [
            "I can list SimCLR's four key empirical ingredients.",
            "I can explain why the projection head is discarded after training.",
        ],
        "commonConfusions": [
            {"wrong": "You should use the projection head output z for downstream evaluation.", "right": "Pre-projection representation h is richer and performs better downstream."},
        ],
        "quiz": [
            _q("What is done with SimCLR's projection head g(h) after contrastive training?", ["It is discarded, keeping pre-projection embedding h for downstream tasks", "It is frozen and used for all tasks", "It replaces the encoder", "It computes PCA"], 0, "The projection head is discarded after training; pre-projection representation h is used."),
        ],
    },
    "supcon": {
        "whyWeRead": "Supervised Contrastive Learning (SupCon) extends contrastive learning to MULTIPLE POSITIVES per anchor — directly applicable to multi-view concept sets.",
        "oneSentence": "Extends contrastive learning to leverage label information by pulling ALL same-class samples together as positive pairs.",
        "plainLanguage": (
            "Welcome to SupCon (Khosla et al., Google 2020). Standard SimCLR has only ONE positive key per anchor. But what if you have multiple images of dogs in your dataset?\n\n"
            "SupCon treats ALL samples sharing the same class label as POSITIVES for an anchor! The loss averages attraction across all positive keys while repelling all negative class keys.\n\n"
            "RESULT: Creates tight class-conditioned clusters in representation space (high within-class compactness, strong between-class separation).\n\n"
            "SETCONCA MAPPING:\n"
            "Each activation view of the exact same concept is a positive sample. SupCon is the direct mathematical loss for coordinating multi-view concept sets."
        ),
        "keyIdeas": [
            _idea("Multi-Positive Contrastive Loss", "Allows arbitrary numbers of positive keys per anchor sample."),
            _idea("Within-Class Compactness", "Pulls all same-class / same-concept representations into tight clusters."),
            _idea("Between-Class Separation", "Pushes different concept clusters far apart in vector space."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "Multi-Positive Loss", "def": "Contrastive loss averaging attraction over multiple positive samples per anchor."},
        ],
        "whatItShows": ["That multi-positive contrastive learning improves supervised representation geometry"],
        "whatItDoesNotShow": ["That class labels equal true monosemantic concepts in SAE dictionaries"],
        "setconcaUse": [
            "Use SupCon-style multi-positive loss for coordinating activation view sets in SetConCA.",
        ],
        "masteryChecklist": [
            "I can contrast SimCLR single-positive vs. SupCon multi-positive setups.",
            "I can explain how SupCon maps to multi-view concept sets.",
        ],
        "commonConfusions": [
            {"wrong": "SupCon only works with single positive pairs.", "right": "SupCon explicitly handles arbitrary numbers of positive pairs per anchor."},
        ],
        "quiz": [
            _q("How does SupCon differ from SimCLR?", ["SupCon allows multiple positive pairs per anchor based on shared labels/concepts", "SupCon has no negatives", "SupCon uses L1 loss", "SupCon removes projection heads"], 0, "SupCon averages contrastive attraction across multiple positive samples per anchor."),
        ],
    },
    "align-unif": {
        "whyWeRead": "Wang & Isola give the clean geometric decomposition for diagnosing contrastive training: Alignment and Uniformity on the hypersphere.",
        "oneSentence": "Decomposes contrastive representation learning into two key geometric properties: Alignment of positive pairs and Uniformity of overall feature distribution.",
        "plainLanguage": (
            "Welcome to Wang & Isola (MIT 2020). This paper provides the geometric magnifying glass for contrastive learning.\n\n"
            "They proved that optimizing contrastive loss drives two distinct geometric properties on the unit hypersphere:\n\n"
            "1. Alignment: Positive pairs should map to nearby points on the sphere. (E[||z - z⁺||²] → 0).\n"
            "2. Uniformity: All representations should spread out evenly across the hypersphere, maximizing entropy and preventing representation collapse (log E[exp(-2 ||z_i - z_j||²)] → min).\n\n"
            "DIAGNOSTIC HYGIENE:\n"
            "If your model training fails, plot Alignment score vs. Uniformity score! If Alignment is bad, positive views aren't matching. If Uniformity is bad, representations have collapsed into a clump."
        ),
        "keyIdeas": [
            _idea("Alignment Property", "Measures expected distance between normalized positive pair embeddings (closeness)."),
            _idea("Uniformity Property", "Measures how uniformly feature vectors cover the unit hypersphere (anti-collapse)."),
            _idea("Hypersphere Geometry", "Normalized embeddings live on S^{d-1} sphere where Euclidean distance relates to cosine similarity."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "Alignment", "def": "Expected distance between positive pair representations on the hypersphere."},
            {"term": "Uniformity", "def": "Log expected pairwise Gaussian potential measuring distribution uniformity across the hypersphere."},
        ],
        "whatItShows": ["That contrastive learning optimizes alignment and uniformity on the hypersphere"],
        "whatItDoesNotShow": ["How alignment/uniformity behave in unnormalized sparse dictionary spaces"],
        "setconcaUse": [
            "Use Alignment and Uniformity metrics to diagnose multi-view SetConCA loss training.",
        ],
        "masteryChecklist": [
            "I can define Alignment and Uniformity in words and geometry.",
            "I can explain how to use them to diagnose contrastive training failure.",
        ],
        "commonConfusions": [
            {"wrong": "Good alignment alone is sufficient.", "right": "Without uniformity enforcers, all vectors collapse to a single point (perfect alignment, zero utility)."},
        ],
        "quiz": [
            _q("What does Uniformity measure in contrastive geometry?", ["How evenly feature vectors spread across the hypersphere to prevent collapse", "How close positive pairs are", "L0 count", "PCA rank"], 0, "Uniformity measures feature spread across the hypersphere, preventing representation collapse."),
        ],
    },
    "vicreg": {
        "whyWeRead": "VICReg shows how to achieve self-supervised multi-view alignment WITHOUT negative pairs using explicit Variance, Invariance, and Covariance regularizers.",
        "oneSentence": "Variance-Invariance-Covariance Regularization (VICReg) prevents representation collapse in non-contrastive multi-view learning.",
        "plainLanguage": (
            "Welcome to VICReg (Bardes et al., Meta 2021). Contrastive methods require large minibatches of negative pairs to prevent collapse. What if you don't want negative pairs?\n\n"
            "VICReg achieves non-contrastive multi-view alignment using three explicit loss terms:\n\n"
            "1. Variance (V): Forces standard deviation of each feature dimension across a batch to remain above 1 (stops all vectors collapsing to a point).\n"
            "2. Invariance (I): Minimizes mean squared error between positive view embeddings (pulls views together).\n"
            "3. Covariance (C): Minimizes off-diagonal covariance between feature pairs (decorrelates features, preventing redundancy).\n\n"
            "Loss = λ v(Z) + μ i(Z, Z') + ν c(Z)"
        ),
        "keyIdeas": [
            _idea("Non-Contrastive Alignment", "Aligns multi-view representations without needing negative pairs or memory banks."),
            _idea("Variance Regularization (V)", "Hinge loss forcing feature dimension standard deviation std(Z) ≥ 1 to prevent collapse."),
            _idea("Invariance Loss (I)", "MSE loss pulling positive view representations together."),
            _idea("Covariance Decorrelation (C)", "Drives off-diagonal covariance terms to zero, preventing feature redundancy."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "VICReg", "def": "Variance-Invariance-Covariance Regularization for non-contrastive self-supervised learning."},
        ],
        "whatItShows": ["That explicit variance and covariance regularization prevents representation collapse without negative pairs"],
        "whatItDoesNotShow": ["That VICReg features automatically satisfy sparse autoencoder monosemanticity"],
        "setconcaUse": [
            "Use VICReg variance/covariance terms as regularizers if negative contrastive pairs damage SAE reconstruction.",
        ],
        "masteryChecklist": [
            "I can explain V, I, and C in VICReg and what each term prevents.",
        ],
        "commonConfusions": [
            {"wrong": "VICReg requires thousands of negative pairs.", "right": "VICReg is non-contrastive and uses ZERO negative pairs."},
        ],
        "quiz": [
            _q("What does the Variance term in VICReg prevent?", ["Representation collapse into a constant point by enforcing minimum feature std", "Feature splitting", "Slow training", "PCA rank loss"], 0, "Variance regularization forces feature std ≥ 1, preventing collapse into a constant vector."),
        ],
    },
    "multi-set-transformer": {
        "whyWeRead": "Advanced reading for modeling relationships between multiple distinct sets, extending single-set attention.",
        "oneSentence": "Learning Functions on Multiple Sets using Multi-Set Transformers models interactions within and between several input sets.",
        "plainLanguage": (
            "Welcome to Multi-Set Transformer (Selby et al., 2022). Standard Set Transformer operates on a single set. Multi-Set Transformers handle functions that operate on MULTIPLE SETS simultaneously (e.g. Set A vs. Set B).\n\n"
            "Uses cross-set attention to model relational structure between different set collections."
        ),
        "keyIdeas": [
            _idea("Cross-Set Relational Attention", "Extends attention mechanisms to operate across multiple set arguments."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "Multi-Set Function", "def": "A function taking multiple sets as arguments and operating symmetrically within and across sets."},
        ],
        "whatItShows": ["How to model relationships between multiple input sets using attention"],
        "whatItDoesNotShow": ["Necessity for simple single-set activation view pooling"],
        "setconcaUse": [
            "Optional extension for modeling relationships between multiple distinct concept-sets.",
        ],
        "masteryChecklist": [
            "I know when multi-set models are needed over single-set aggregators.",
        ],
        "commonConfusions": [
            {"wrong": "Required for basic SetConCA.", "right": "Optional advanced extension; single-set aggregation comes first."},
        ],
        "quiz": [
            _q("Multi-Set Transformers model relationships between?", ["Multiple distinct input sets", "Single vectors only", "Scalar numbers", "PCA axes"], 0, "Models interactions within and across multiple input sets."),
        ],
    },
    "cl-inverts": {
        "whyWeRead": "Theoretical analysis showing when InfoNCE contrastive learning inverts the data generating process to recover true latent factors.",
        "oneSentence": "Contrastive Learning Inverts the Data Generating Process provides identifiability proofs for contrastive learning under specific view-generation assumptions.",
        "plainLanguage": (
            "Welcome to Zimmermann et al. (2021).\n\n"
            "This paper provides mathematical proofs showing that contrastive learning (InfoNCE) can INVERT the true underlying generative process, recovering ground-truth latent factors up to coordinate-wise transformations IF positive views share true latent factors."
        ),
        "keyIdeas": [
            _idea("Contrastive Inversion Identifiability", "Proves InfoNCE recovers ground-truth latent factors under explicit view-generation assumptions."),
        ],
        "simplifiedMath": [],
        "vocabulary": [
            {"term": "Generative Process Inversion", "def": "Recovering true underlying latent causal variables from observed data using contrastive learning."},
        ],
        "whatItShows": ["That contrastive learning can provably recover true latent variables under identifiability conditions"],
        "whatItDoesNotShow": ["That contrastive learning automatically solves SAE overcompleteness without dictionary constraints"],
        "setconcaUse": [
            "Theoretical foundation supporting contrastive set loss concept recovery claims in SetConCA.",
        ],
        "masteryChecklist": [
            "I can explain why contrastive learning can invert generative processes.",
        ],
        "commonConfusions": [
            {"wrong": "Contrastive loss only does heuristic clustering.", "right": "Under formal assumptions, contrastive loss provably inverts the latent data generating process."},
        ],
        "quiz": [
            _q("What does Zimmermann et al. (2021) prove about contrastive learning?", ["Contrastive learning can provably invert the latent data generating process", "Contrastive learning always fails", "PCA is non-linear", "L0 is non-differentiable"], 0, "Proves contrastive learning can invert the data generating process under identifiability assumptions."),
        ],
    },
}

