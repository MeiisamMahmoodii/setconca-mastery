"""Course intro and level primers — self-contained lectures before papers."""

COURSE_INTRO = {
    "title": "SetConCA Mastery",
    "promise": "Welcome to your step-by-step masterclass. You will learn every concept from absolute first principles. Every paper, equation, and term is explained as if sitting right beside a patient teacher.",
    "formula": "SetConCA = Sparse dictionary learning + Multi-view learning + Set representation + Contrastive coordination",
    "howToUse": [
        "Start at Level 1. Read the Level Primer (the lecture) carefully from top to bottom.",
        "When a new mathematical term or concept appears, pause — the primer explains what it means, where it came from, and how to read its formula.",
        "Open each paper module in order. Read Plain English, Key Ideas, Math, and Vocabulary.",
        "Complete the Mastery Checklist and Quiz before moving to the next level.",
        "Do not skip levels — each level builds naturally on the concepts taught in the previous one.",
    ],
    "pathMap": (
        "Levels 1–2 build the foundation: how to break down vectors into variance (PCA), independent sources (ICA), correlated views (CCA), and sparse codes (TopK/SAEs). "
        "Levels 3–5 extend to nonlinear neural networks: multi-view alignment (DCCA/DCCAE), set aggregators (Deep Sets/Set Transformer), and contrastive losses (InfoNCE/SimCLR/SupCon). "
        "Level 6 teaches honest evaluation (CKA, probes, control tasks). "
        "Levels 7–9 dive deep into AI internals: superposition, transformer residual streams, modern SAE architectures, and failure modes (absorption/splitting). "
        "Level 10 synthesises everything into the SetConCA research frontier."
    ),
}

LEVEL_PRIMERS = {
    1: {
        "title": "What is a representation?",
        "mission": "Master PCA, ICA, and CCA from first principles. Understand what each objective measures, how to read their math, and why good reconstruction does not equal interpretability.",
        "beforeYouStart": "None — we start from absolute zero.",
        "primer": (
            "Welcome to Level 1. Imagine a modern language model like Gemma or Llama processing a sentence. Inside the model, words are converted into long lists of numbers — vectors with thousands of dimensions (e.g. 4096 numbers per token). We call these numbers 'activations', and together they form the model's internal representation.\n\n"
            "Here is the fundamental problem: why can't we just look at index #42 of that vector to see if the model is thinking about 'dogs'? Because neural networks do not allocate one number per concept. Information is spread out across all dimensions simultaneously. To understand what the network is doing, we need mathematical tools to rotate, unmix, or align these high-dimensional vector spaces.\n\n"
            "In this level, we master the three classical linear tools that started it all: PCA, ICA, and CCA.\n\n"
            "--- STEP 1: PCA (Principal Component Analysis) — Finding Variance Inside One View ---\n"
            "Where did it come from? In 1901, Karl Pearson wanted a way to summarize a complex cloud of data points using fewer dimensions without losing important spread.\n\n"
            "How does it work? Imagine a 3D cloud of data shaped like a football floating in a room. If you must project this 3D cloud onto a flat 2D screen, which angle preserves the most information? You want to rotate the screen so it faces the longest axis of the football!\n\n"
            "Let's build the math step-by-step:\n"
            "1. Mean (μ): The central point of your data cloud.\n"
            "2. Variance: How far data points spread out around that mean. For a variable x, variance is E[(x - μ)²]. We square the differences so positive and negative offsets don't cancel each other out.\n"
            "3. Covariance: How two different coordinates move together. If coordinate X goes up whenever coordinate Y goes up, their covariance E[(x - μ_x)(y - μ_y)] is positive.\n"
            "4. Covariance Matrix (C): A square grid recording the pairwise covariance between every single pair of dimensions.\n"
            "5. Eigenvectors & Singular Value Decomposition (SVD): An eigenvector of matrix C is a special direction in space that DOES NOT ROTATE when multiplied by C — it only gets stretched! The stretch factor is the Eigenvalue (λ). SVD (X = U Σ Vᵀ) is the standard numerical algorithm to compute these principal directions directly from raw data.\n\n"
            "The PCA recipe: PCA finds orthogonal (90-degree right angle) axes ordered by how much variance they capture. The first component is the longest axis of the cloud; the second component is the next longest axis strictly perpendicular to the first.\n\n"
            "What is FVU (Fraction of Variance Unexplained)?\n"
            "If you keep only the top k components and throw away the rest, your reconstructed points will have a small error. FVU = 1 - (Explained Variance / Total Variance). If FVU is 0.02, your rank-k subspace captures 98% of the data's spread.\n\n"
            "CRITICAL LESSON FOR MI & SAE RESEARCH:\n"
            "Orthogonality is a mathematical convenience, NOT a guarantee of semantic meaning. PCA directions are orthogonal pure-math axes. They are rarely clean human concepts! Good reconstruction (low FVU) only means you kept the spread — it does NOT mean you found interpretable features.\n\n"
            "--- STEP 2: ICA (Independent Component Analysis) — Unmixing Independent Sources ---\n"
            "Where did it come from? Imagine the 'Cocktail Party Problem'. Two people are speaking at the exact same time in a room. You place two microphones at different locations. Mic 1 picks up 70% Person A + 30% Person B. Mic 2 picks up 40% Person A + 60% Person B. How do you recover the original pure individual voices without knowing who spoke or where the mics were?\n\n"
            "Why PCA fails here: Person A and Person B's voices are NOT orthogonal in microphone space. PCA would just find the direction of highest combined volume, mixing both voices together!\n\n"
            "The ICA core concept: ICA assumes the observations x come from a linear mixture x = A * s, where s is a vector of statistically INDEPENDENT source signals. Independence is much stronger than zero correlation. Zero correlation means E[xy] = E[x]E[y] (no linear relation). Independence means p(x,y) = p(x)p(y) — knowing variable x gives you ABSOLUTELY ZERO information about variable y.\n\n"
            "How ICA unmixes: The Central Limit Theorem states that adding independent random variables together makes their combined distribution more Gaussian (bell-shaped). Therefore, mixed signals are always more Gaussian than single pure signals! ICA searches for an unmixing matrix W such that the recovered signals y = W * x are as NON-GAUSSIAN as possible (maximizing kurtosis or negentropy). By pushing distributions away from bell curves, ICA pops the independent sources back out.\n\n"
            "Connection to SetConCA: Concept Component Analysis (ConCA) uses this exact unmixing mental model, treating neural activations as linear mixtures of independent concept components.\n\n"
            "--- STEP 3: CCA (Canonical Correlation Analysis) — Finding Shared Signals Between Two Views ---\n"
            "Where did it come from? Harold Hotelling (1936) asked: what if you have TWO different measurements of the same items? For example, View 1 is an audio recording of a speech, and View 2 is a video recording of the speaker's lips. Audio vectors and video vectors have different dimensions and different units.\n\n"
            "How does CCA work? CCA searches for a linear direction u in View 1 space and a linear direction v in View 2 space such that the projected numbers (uᵀx and vᵀy) have the MAXIMUM possible correlation with each other!\n\n"
            "Shared vs. Private Information:\n"
            "CCA focuses strictly on what is SHARED between the two views. If View 1 contains background noise that has nothing to do with View 2, CCA ignores it. The projected variables (uᵀx, vᵀy) are called Canonical Variables, and their correlation is the Canonical Correlation.\n\n"
            "THE CLASSICAL TRIAD TO MEMORIZE:\n"
            "• PCA asks: Which directions capture max variance INSIDE one view?\n"
            "• ICA asks: Which directions unmix INDEPENDENT sources inside one view?\n"
            "• CCA asks: Which directions LINE UP (correlate) ACROSS two views?"
        ),
        "bigPictureDiagram": [
            "One view  → PCA  → keep max variance axes (orthogonal, math-driven)",
            "One view  → ICA  → unmix independent non-Gaussian sources (Cocktail party)",
            "Two views → CCA  → find maximum cross-view linear correlation (shared signal)",
        ],
        "conceptsToMaster": [
            {"name": "Variance / Covariance", "simple": "Variance = how much one variable spreads out around its average. Covariance = whether two variables rise and fall together.", "deeper": "Covariance matrix C = E[(x−μ)(x−μ)ᵀ]. Diagonals are variances; off-diagonals are pairwise covariances. PCA diagonalizes C."},
            {"name": "Eigenvector / SVD", "simple": "An eigenvector is a special arrow in space that only gets stretched (not tilted) when multiplied by a matrix. SVD is the master algorithm that finds these stretch directions.", "deeper": "Singular Value Decomposition X = U Σ Vᵀ factors data matrix X into left singular vectors U, singular values Σ, and right singular vectors V. The columns of V are the principal component directions."},
            {"name": "FVU (Fraction of Variance Unexplained)", "simple": "The percentage of original data spread lost after compressing and reconstructing.", "deeper": "FVU = 1 - (Explained Variance / Total Variance) = ||X - X_hat||_F^2 / ||X - X_mean||_F^2. Lower FVU means better reconstruction, but NOT higher interpretability."},
            {"name": "Independence vs. Uncorrelatedness", "simple": "Uncorrelated means no straight-line relationship. Independent means knowing one variable tells you absolutely nothing about the other.", "deeper": "Uncorrelatedness only requires Cov(X,Y) = 0 (2nd-order statistic). Independence requires joint probability p(x,y) = p(x)p(y) across all higher-order moments. ICA requires independence or non-Gaussianity for source recovery."},
            {"name": "Canonical Correlation", "simple": "The highest correlation achievable between two different views after rotating each view appropriately.", "deeper": "CCA finds projection vectors u, v maximizing corr(uᵀX, vᵀY) subject to Var(uᵀX) = 1 and Var(vᵀY) = 1. Solved via a generalized eigenvalue problem on cross-covariance matrices."},
        ],
        "checkpoint": {
            "goal": "Compare PCA, ICA, and CCA on the same activation dataset.",
            "steps": [
                "Extract activations from Gemma for a dataset of prompts.",
                "Run PCA: plot FVU versus the number of components k.",
                "Run ICA: inspect whether unmixed components isolate distinct activation patterns.",
                "Create two views (e.g. Layer 10 vs Layer 14 activations for the same prompts) and run CCA.",
                "Compare reconstruction error (FVU), cross-view correlation, and retrieval performance.",
            ],
            "successLooksLike": "You can explain clearly which method wins on which metric and why high reconstruction or high correlation does NOT automatically mean you found human-interpretable concepts.",
        },
        "bridgeToNext": "Now that you understand linear decompositions (PCA/ICA/CCA), Level 2 moves to Sparse Representations & Autoencoders — expanding feature count beyond input dimensions.",
    },
    2: {
        "title": "Sparse representations and dictionaries",
        "mission": "Understand overcomplete dictionaries, why overcompleteness REQUIRES sparsity, how TopK differs from L1, and how VAEs use probabilistic latents.",
        "beforeYouStart": "Level 1 — especially linear reconstruction, FVU, and unmixing.",
        "primer": (
            "Welcome to Level 2. In Level 1, PCA compressed N-dimensional data into k dimensions where k < N (undercomplete). But in neural networks, a fascinating phenomenon occurs: models often pack THOUSANDS of concepts into just hundreds of activation dimensions! To unpack them, we need an OVERCOMPLETE dictionary — a hidden code with MORE features than activation dimensions (e.g. 16,000 dictionary features for a 4,000-dimensional model).\n\n"
            "--- STEP 1: Why Overcompleteness Demands Sparsity ---\n"
            "Imagine you have a 100-dimensional activation vector, and you build a hidden dictionary with 10,000 feature directions. If your neural network is allowed to use ALL 10,000 features at the same time for every single token, what happens?\n"
            "The network can easily reconstruct the input perfectly by assigning tiny, mushy numbers to all 10,000 features! Every feature becomes a generic soup of everything. It is completely uninterpretable.\n\n"
            "Sparsity is the strict constraint that saves us: for any given token, ONLY A FEW features (e.g. 20 out of 10,000) are allowed to be active (nonzero)! The rest MUST be zero.\n"
            "When forced to represent data with only 20 active features out of 10,000, each feature direction HAS to specialize into a pure, clean concept (e.g. 'text about legal contracts' or 'Python syntax for loops').\n\n"
            "--- STEP 2: The Sparsity Mechanisms — L0, L1, and TopK ---\n"
            "How do we mathematically enforce sparsity?\n\n"
            "1. L0 Norm (Ideal but hard):\n"
            "The L0 'norm' ||z||₀ simply counts how many entries in vector z are non-zero. Ideally, we would optimize Loss = Reconstruction_Error + λ * ||z||₀. However, counting non-zeros is non-differentiable (gradient is zero everywhere except jumps). We cannot train neural nets with standard backpropagation using pure L0.\n\n"
            "2. L1 Regularization (Lasso penalty):\n"
            "In 2012–2023, researchers relaxed L0 to L1: ||z||₁ = Σ |z_i| (the sum of absolute values). L1 is convex and differentiable everywhere except at 0. It pushes small feature activations to exactly zero.\n"
            "The Hidden Flaw of L1 (Shrinkage): L1 penalizes the MAGNITUDE of active features along with their presence. To reduce the L1 penalty, the model artificially shrinks the active feature values below their true true size! This 'shrinkage' damages reconstruction accuracy.\n\n"
            "3. Hard TopK Activation (Makhzani & Frey, 2013 → Gao et al., 2024):\n"
            "Instead of adding an L1 penalty to the loss, TopK modifies the network architecture directly! The encoder computes pre-activations for all 10,000 features. Then, a TopK operator selects the top k largest pre-activations (e.g. k=32), keeps their exact values, and forcefully SETS ALL OTHER 9,968 ACTIVATIONS TO ZERO!\n"
            "Because TopK keeps the exact magnitude of the top k features without shrinking them, it achieves much better reconstruction at matched sparsity levels than L1.\n\n"
            "--- STEP 3: Autoencoders vs VAEs (Variational Autoencoders) ---\n"
            "An Autoencoder consists of an Encoder z = f(x) that compresses input x into latent code z, and a Decoder x_hat = g(z) that reconstructs x.\n\n"
            "What is a VAE (Kingma & Welling, 2013)?\n"
            "Instead of mapping input x to a single fixed point z, a VAE maps x to a PROBABILISTIC DISTRIBUTION — predicting a mean vector μ and a variance vector σ. The latent z is then sampled from N(μ, σ²).\n\n"
            "How does backprop flow through random sampling? The Reparameterization Trick!\n"
            "You cannot backpropagate gradients through random sampling. Kingma & Welling solved this by separating the randomness: sample noise ε ~ N(0, I) externally, then write z = μ + σ ⊙ ε. Now μ and σ are deterministic node outputs that receive normal gradients!\n\n"
            "The VAE ELBO Loss (Evidence Lower Bound):\n"
            "Loss = Reconstruction Error + KL-Divergence(q(z|x) || p(z))\n"
            "The KL-Divergence term forces the learned distribution q(z|x) to stay close to a standard normal prior p(z) = N(0, I), preventing the latent space from leaving empty gaps.\n\n"
            "Why VAEs matter for SetConCA:\n"
            "You don't need to become a VAE researcher, but when SetConCA aggregates multiple activation views using Gaussian distributions or Product-of-Experts (PoE), you are using this exact probabilistic latent vocabulary."
        ),
        "bigPictureDiagram": [
            "Dense Input x → Encoder → Overcomplete z (width > N) → Sparsity Gate → Decoder → Reconstruction x_hat",
            "L1 Sparsity: Soft penalty Σ|z_i| (causes magnitude shrinkage)",
            "TopK Sparsity: Hard keep top-k values, zero rest (no shrinkage, exact k)",
            "VAE Latent: Predict μ, σ → Reparameterize z = μ + σ ⊙ ε → ELBO Loss",
        ],
        "conceptsToMaster": [
            {"name": "Overcomplete Dictionary", "simple": "Having more feature directions in your hidden layer than dimensions in the input space.", "deeper": "Dictionary matrix W_dec has dimension d_model × d_hidden where d_hidden > d_model (e.g. 4x, 16x, 32x expansion). Essential for unfolding superposed features."},
            {"name": "L0 vs L1 vs TopK", "simple": "L0 counts non-zero features. L1 adds up absolute values (causing shrinkage). TopK keeps exactly the k largest features and zeroes the rest.", "deeper": "L0 is non-differentiable. L1 is a convex proxy but penalizes magnitude. TopK enforces exact cardinality k while preserving true pre-activation magnitudes of active units."},
            {"name": "Shrinkage Problem", "simple": "When L1 penalties force active features to be smaller than they should be, harming reconstruction quality.", "deeper": "L1 loss derivative is constant λ w.r.t active z_i. To minimize L1 penalty, optimizer reduces z_i, causing under-estimation of feature firing strength. Resolved by Gated SAEs and TopK SAEs."},
            {"name": "ELBO (Evidence Lower Bound)", "simple": "The training objective of a VAE balancing reconstruction accuracy with keeping latents near a simple prior distribution.", "deeper": "ELBO = E_q[log p(x|z)] - KL(q(z|x) || p(z)). Maximizing ELBO maximizes log-likelihood lower bound. KL term prevents arbitrary latent cluster dispersion."},
            {"name": "Reparameterization Trick", "simple": "A trick to let backprop gradients flow through random sampling by writing z = μ + σ * noise.", "deeper": "Expresses stochastic latent z ~ N(μ(x), Σ(x)) as deterministic transformation z = μ(x) + L(x)ε where ε ~ N(0,I). Enables standard gradient computation w.r.t encoder parameters."},
        ],
        "checkpoint": {
            "goal": "Train a simple L1 Autoencoder versus a TopK Autoencoder on activation data under matched reconstruction budgets.",
            "steps": [
                "Fix a target FVU budget (e.g. FVU = 0.05).",
                "Train an L1 SAE by tuning penalty λ.",
                "Train a TopK SAE by setting parameter k.",
                "Compare average L0 (active features per token) and inspect active feature magnitudes to observe L1 shrinkage in action.",
            ],
            "successLooksLike": "You can explain from experimental data why TopK achieves better reconstruction at the same L0 count than L1.",
        },
        "bridgeToNext": "Now that you understand single-view sparse dictionaries, Level 3 moves to Multi-View Representation Learning — aligning multiple observations of the same object.",
    },
    3: {
        "title": "Nonlinear multi-view representation learning",
        "mission": "Master Deep CCA, DCCAE, VCCA, and DGCCA. Learn how to separate shared cross-view information from private view-specific information.",
        "beforeYouStart": "Level 1 CCA and Level 2 Autoencoders.",
        "primer": (
            "Welcome to Level 3. What is a 'view'? A view is one observation of an underlying object. In AI research, multiple views arise naturally:\n"
            "• Two different layers of a transformer processing the same text.\n"
            "• Two different prompt paraphrases expressing the same concept ('A photo of a dog' vs 'An image showing a canine').\n"
            "• Two different modalities (e.g. image + caption in CLIP).\n\n"
            "In Level 1, we learned linear CCA. But neural networks process data nonlinearly. How do we extend multi-view alignment to deep neural networks?\n\n"
            "--- STEP 1: Deep CCA (Andrew et al., 2013) ---\n"
            "Deep CCA places a neural network encoder f_θ on View 1 and a neural network encoder g_φ on View 2. The objective trains both networks simultaneously to maximize the canonical correlation between their output embeddings!\n\n"
            "The Whitening Constraint in DCCA:\n"
            "If you simply maximize cosine similarity between network outputs without constraints, the networks can cheat by collapsing all outputs into a single constant vector (representation collapse)! DCCA prevents this by enforcing a covariance constraint (whitening): the output dimensions of each view must have unit variance and zero correlation with each other.\n\n"
            "--- STEP 2: The Critical Danger of DCCA — Information Discard ---\n"
            "Suppose View 1 is a detailed text description of a scene and View 2 is a low-resolution thumbnail image. If your ONLY objective is to maximize correlation between the two views, what will the text encoder do?\n"
            "It will THROW AWAY 90% of the text details (specific names, dates, fine details) because those details do not exist in the thumbnail image! Correlation-only objectives erase useful view-specific (private) information.\n\n"
            "--- STEP 3: DCCAE (Wang et al., 2015) — Balancing Alignment and Reconstruction ---\n"
            "To solve the information discard problem, Deep Canonically Correlated Autoencoders (DCCAE) add an autoencoding reconstruction loss to each view!\n\n"
            "DCCAE Loss = - Canonical_Correlation(z_A, z_B) + λ * (||x_A - dec_A(z_A)||² + ||x_B - dec_B(z_B)||²)\n\n"
            "Now the model is forced to find a shared code z that aligns across views while preserving enough internal information to reconstruct each raw view!\n\n"
            "--- STEP 4: VCCA & DGCCA — Probabilistic Shared/Private Latents & Many Views ---\n"
            "• VCCA (Wang et al., 2016) explicitly splits the latent representation into TWO parts: a Shared Latent z_shared (explaining what is common) and Private Latents z_privA, z_privB (explaining view-specific details). View A is reconstructed from (z_shared, z_privA).\n"
            "• DGCCA (Benton et al., 2017) extends GCCA to deep networks for 3, 4, or 100 views, learning a single central shared representation matrix G that all view encoders target.\n\n"
            "SETCONCA MANDATE:\n"
            "Never force all view representations to become identical. A healthy multi-view representation aligns shared concept directions while preserving view-specific details!"
        ),
        "bigPictureDiagram": [
            "View A (x_A) → Encoder f_θ → z_A ──┐",
            "                                    ├─→ Maximize Cross-View Correlation",
            "View B (x_B) → Encoder g_φ → z_B ──┘",
            "DCCAE Addition: z_A → Decoder_A → x_hat_A  |  z_B → Decoder_B → x_hat_B (Preserves private info!)",
            "VCCA Explicit Split: z = [z_shared | z_private]",
        ],
        "conceptsToMaster": [
            {"name": "Shared vs. Private Information", "simple": "Shared = what is common across all views. Private = view-specific details that exist in only one view.", "deeper": "In multi-view setup (X_1, X_2), I(X_1; X_2) is shared information. I(X_1; X_1 | X_2) is private information of view 1. Maximizing multi-view correlation targets shared info but risks destroying private info unless reconstruction losses are included."},
            {"name": "Covariance / Whitening Constraints", "simple": "Forcing latent dimensions to be uncorrelated and normalized so the network cannot cheat by collapsing.", "deeper": "DCCA requires 1/N Z_A^T Z_A = I and 1/N Z_B^T Z_B = I. Prevents trivial solution where all output coordinates become identical or scalar multiples."},
            {"name": "DCCAE Tradeoff", "simple": "The hyperparameter balancing cross-view alignment correlation against within-view reconstruction quality.", "deeper": "Loss = -CCA_loss(f(X_1), g(X_2)) + λ_1 ||X_1 - dec_1(f(X_1))||^2 + λ_2 ||X_2 - dec_2(g(X_2))||^2. Tuning λ traces out an alignment-fidelity Pareto frontier."},
            {"name": "Generalized CCA (DGCCA)", "simple": "Extending CCA math from 2 views to an arbitrary number of views (e.g. 5 layers or 10 prompt views).", "deeper": "DGCCA optimizes min_G sum_i ||G - U_i^T f_i(X_i)||_F^2 where G is a shared target representation matrix and U_i are view-specific projections."},
        ],
        "checkpoint": {
            "goal": "Implement a shared vs private latent decomposition on a 2-view synthetic dataset.",
            "steps": [
                "Generate synthetic paired views with known shared factors and view-specific noise.",
                "Train a DCCA model (correlation only) versus a DCCAE model (correlation + reconstruction).",
                "Test downstream retrieval (shared task) and view reconstruction (private task).",
            ],
            "successLooksLike": "You can demonstrate visually how pure DCCA discards private details while DCCAE retains both.",
        },
        "bridgeToNext": "In Level 3, views had fixed pairings (View A & View B). In Level 4, views form an UNORDERED SET — requiring Set Representation architectures.",
    },
    4: {
        "title": "Learning representations of sets",
        "mission": "Master permutation-invariant set architectures: Deep Sets, Neural Statistician, and Set Transformer.",
        "beforeYouStart": "Level 3 multi-view representations.",
        "primer": (
            "Welcome to Level 4. What is a set? A set is an unordered collection of items: X = {x_1, x_2, ..., x_N}. The set {apple, banana, cherry} is EXACTLY THE SAME as {cherry, apple, banana}.\n\n"
            "Why standard neural networks fail on sets:\n"
            "If you feed a set into a standard MLP or RNN by concatenating elements [x_1, x_2, x_3], the network treats the order of elements as meaningful. Swapping the inputs changes the output! That is forbidden for set functions.\n\n"
            "--- STEP 1: Deep Sets (Zaheer et al., 2017) — The Universal Set Theorem ---\n"
            "Zaheer et al. proved a mathematical theorem: ANY valid permutation-invariant function f(X) operating on an unordered set X can be decomposed into three steps:\n"
            "1. Process each element independently using a neural network φ(x_i).\n"
            "2. Aggregate (pool) the element representations using a commutative pooling operation (SUM or MEAN).\n"
            "3. Process the aggregated set vector using a post-processing network ρ.\n\n"
            "Formula: f(X) = ρ( Σ_{x ∈ X} φ(x) )\n\n"
            "Why SUM / MEAN pooling works:\n"
            "Addition is commutative (a + b = b + a). Therefore, summing element vectors guarantees that input order cannot change the output!\n\n"
            "--- STEP 2: When Mean Pooling Fails — The Need for Set Transformer ---\n"
            "Deep Sets processes every set member in total isolation before summing. But what if the meaning of a set depends on RELATIONS between members?\n"
            "Example: Imagine a set of activations representing a context. If one member is an 'outlier/intruder' activation, simple mean pooling blends the intruder into the average, corrupting the set representation!\n\n"
            "Set Transformer (Lee et al., 2019):\n"
            "Set Transformer uses Self-Attention OVER set members before pooling! Members can attend to each other, allowing the network to compare items, suppress outliers, or highlight pairwise relationships. To maintain permutation invariance, Set Transformer uses Pooling by Multihead Attention (PMA) with learned seed vectors.\n\n"
            "--- STEP 3: Neural Statistician (Edwards & Storkey, 2016) ---\n"
            "Instead of outputting a single point vector for a set, Neural Statistician maps a set of observations to a LATENT STATISTICAL DISTRIBUTION capturing the dataset's generative structure.\n\n"
            "APPLICATION TO SETCONCA:\n"
            "In SetConCA, a single concept is observed across multiple activation views. How should we aggregate those views into one concept code? Deep Sets (mean pooling) is our baseline aggregator, and Set Transformer is our relational aggregator."
        ),
        "bigPictureDiagram": [
            "Unordered Set {x_1, x_2, x_3}",
            "Deep Sets: φ(x_1) + φ(x_2) + φ(x_3) ──[SUM/MEAN]──→ Vector ──[ρ]──→ Set Code f(X)",
            "Set Transformer: {x_i} ──[Self-Attention over members]──→ {x_i'} ──[PMA Attention Pool]──→ Relational Set Code",
        ],
        "conceptsToMaster": [
            {"name": "Permutation Invariance", "simple": "The property that changing the order of input items does not change the network's output: f(π(X)) = f(X).", "deeper": "A function f: 2^X → Y is permutation invariant if for any permutation matrix P, f(PX) = f(X). Proved by Zaheer et al. to equal ρ(sum φ(x_i)) for continuous set functions."},
            {"name": "Permutation Equivariance", "simple": "Changing the order of input items changes the output items in the exact same order: f(π(X)) = π(f(X)).", "deeper": "Used when outputting a prediction for each member of a set (e.g. per-element scoring). Maintained by layerwise transformations that treat each element symmetrically."},
            {"name": "Inducing Points (in Set Transformer)", "simple": "A small set of learned memory vectors used in attention to reduce the computational cost of set self-attention from O(N²) to O(N * M).", "deeper": "Set Attention Blocks (SAB) cost O(N^2). Induced Set Attention Blocks (ISAB) project N elements onto M learned inducing vectors I via attention, then project back, reducing cost to O(N M)."},
            {"name": "Intruder / Outlier Robustness", "simple": "How well a set aggregator handles noise or an unrelated item inserted into the set.", "deeper": "Mean pooling is vulnerable to outliers (O(1/N) shift). Attention pooling can assign near-zero attention weights to intruder items, preserving set code integrity."},
        ],
        "checkpoint": {
            "goal": "Compare Mean Pooling, Deep Sets, and Set Transformer on a synthetic set task with intruder items.",
            "steps": [
                "Create set datasets where target label depends on pairwise member relationships.",
                "Inject 10% intruder (noise) vectors into each set.",
                "Train Deep Sets vs Set Transformer.",
                "Evaluate set classification accuracy and code stability under intruder presence.",
            ],
            "successLooksLike": "You can demonstrate empirically why Set Transformer's attention mechanism resists intruder corruption better than Deep Sets mean pooling.",
        },
        "bridgeToNext": "Now that you can represent sets of views, Level 5 teaches Contrastive Learning — how to pull related view sets together while pushing unrelated ones apart.",
    },
    5: {
        "title": "Contrastive representation learning",
        "mission": "Master InfoNCE, SimCLR, Supervised Contrastive Learning (SupCon), Alignment & Uniformity, and VICReg.",
        "beforeYouStart": "Level 4 set representations.",
        "primer": (
            "Welcome to Level 5. Contrastive learning is the dominant self-supervised paradigm in modern AI. The core intuition is beautifully simple:\n"
            "PULL representations of related items (Positive Pairs) CLOSER TOGETHER in vector space, and PUSH representations of unrelated items (Negative Pairs) FARTHER APART!\n\n"
            "--- STEP 1: CPC & InfoNCE Loss (van den Oord et al., 2018) ---\n"
            "What is InfoNCE?\n"
            "InfoNCE is a multi-class softmax loss where the network must correctly identify the single true positive key k⁺ among a minibatch of negative keys {k⁻}.\n\n"
            "Formula:\n"
            "Loss = - log [ exp( sim(q, k⁺) / τ ) / ( exp( sim(q, k⁺) / τ ) + Σ exp( sim(q, k⁻_i) / τ ) ) ]\n\n"
            "Let's unpack every symbol:\n"
            "• q: The Query representation vector.\n"
            "• k⁺: The Positive Key representation vector (e.g. another view of the same concept).\n"
            "• k⁻_i: Negative Key vectors (other unrelated samples in the batch).\n"
            "• sim(a, b): Cosine similarity (aᵀb / (||a|| ||b||)).\n"
            "• τ (Temperature): A hyperparameter scaling cosine scores. Small τ (e.g. 0.07) makes the softmax extremely peaky, forcing the network to focus heavily on hard negatives!\n\n"
            "--- STEP 2: SimCLR (Chen et al., 2020) — Practical Engineering Rules ---\n"
            "SimCLR established four critical rules for contrastive learning:\n"
            "1. Positive Definition: Positives are created by data augmentations of the same image (or prompt/view variations of the same concept).\n"
            "2. Projection Head: Maps representations through a non-linear MLP g(h) BEFORE computing InfoNCE loss. CRITICAL FINDING: The output of the projection head is used for loss computation, but DISCARDED after training! The pre-projection representation h retains much richer detail.\n"
            "3. Large Batch Size: Larger minibatches provide more negative pairs, improving geometric quality.\n\n"
            "--- STEP 3: SupCon (Khosla et al., 2020) — Multiple Positives Per Anchor ---\n"
            "Standard SimCLR has only ONE positive per anchor. But in Supervised Contrastive Learning (SupCon), ALL items sharing the same class label are treated as positives!\n"
            "SupCon averages attraction across MULTIPLE positives while repelling all other classes.\n\n"
            "SetConCA Connection: This is EXACTLY what SetConCA needs! A single semantic concept has MULTIPLE activation views. SupCon is the loss template for coordinating set views.\n\n"
            "--- STEP 4: Alignment vs Uniformity (Wang & Isola, 2020) ---\n"
            "Wang & Isola proved that contrastive learning optimizes two distinct geometric properties on the unit hypersphere:\n"
            "1. Alignment: Positive pairs map to nearby points on the sphere. (E[||z - z⁺||²]).\n"
            "2. Uniformity: All representations spread out evenly across the hypersphere, preventing representation collapse. (log E[exp(-2 ||z_i - z_j||²)]).\n\n"
            "--- STEP 5: VICReg (Bardes et al., 2021) — Alignment Without Negatives ---\n"
            "What if you don't have negative pairs? VICReg prevents collapse using three explicit regularizers:\n"
            "• Variance (V): Forces variance of each feature dimension to stay above a threshold.\n"
            "• Invariance (I): Minimizes distance between positive view embeddings.\n"
            "• Covariance (C): Minimizes off-diagonal covariance between feature pairs, driving decorrelation."
        ),
        "bigPictureDiagram": [
            "Anchor Vector q",
            "  ├─→ Pull toward Positive Key k⁺ (High Cosine Sim)",
            "  └─→ Push away from Negative Keys k⁻_1, k⁻_2, ... k⁻_N (Low Cosine Sim)",
            "Geometry on Hypersphere: Alignment (Positives close) + Uniformity (Spread evenly, anti-collapse)",
            "VICReg Non-Contrastive: Variance (Keep std > 1) + Invariance (Match views) + Covariance (Decorrelate features)",
        ],
        "conceptsToMaster": [
            {"name": "InfoNCE Loss", "simple": "A softmax classification loss over cosine similarities that picks out the true positive view among many negative distractors.", "deeper": "L_InfoNCE = -log ( exp(q·k⁺/τ) / [exp(q·k⁺/τ) + sum_i exp(q·k⁻_i/τ)] ). Lower bounds mutual information I(X;Y) <= log(K) - L_InfoNCE under density ratio assumptions."},
            {"name": "Temperature (τ)", "simple": "A scale factor that controls how harshly the loss punishes hard negatives.", "deeper": "Scales cosine similarities before softmax. Low temperature (τ < 0.1) amplifies gradients for hard negatives (negatives close to anchor), creating tight local clusters. High temperature spreads gradients uniformly."},
            {"name": "Projection Head", "simple": "An extra MLP layer placed after the encoder during contrastive training, then discarded when using embeddings downstream.", "deeper": "Prevents contrastive loss from discarding high-frequency non-invariant information needed for downstream tasks. The encoder representation h preserves details, while projection z = g(h) is invariant."},
            {"name": "Alignment and Uniformity", "simple": "Alignment = positive pairs are close. Uniformity = embeddings cover the entire sphere evenly without collapsing into a clump.", "deeper": "Alignment = E_{(x,x⁺)} [||f(x) - f(x⁺)||^2]. Uniformity = log E_{x,y ~ p} [exp(-2 ||f(x) - f(y)||^2)]. Healthy contrastive geometry requires both."},
        ],
        "checkpoint": {
            "goal": "Ablate temperature τ and projection head presence on an activation view dataset.",
            "steps": [
                "Implement InfoNCE loss.",
                "Vary temperature τ from 0.01 to 1.0.",
                "Train with and without a 2-layer MLP projection head.",
                "Measure Alignment score, Uniformity score, and downstream retrieval accuracy.",
            ],
            "successLooksLike": "You can plot Alignment vs Uniformity and explain why training without a projection head harms downstream generalisation.",
        },
        "bridgeToNext": "Now that you know how to build multi-view and contrastive models, Level 6 teaches how to MEASURE and COMPARE representations honestly without fooling yourself.",
    },
    6: {
        "title": "Measuring and comparing representations",
        "mission": "Master CKA, SVCCA, Probes with Control Tasks, and Minimum Description Length (MDL) probing.",
        "beforeYouStart": "Levels 1–5 foundational concepts.",
        "primer": (
            "Welcome to Level 6. In AI research, self-deception is easy. A researcher trains a model, runs one evaluation, gets a 92% score, and claims 'We discovered the internal concept!'\n\n"
            "Level 6 is your scientific reality check. You will learn what each metric ACTUALLY proves and what it CANNOT establish.\n\n"
            "--- STEP 1: CKA (Centered Kernel Alignment) — Comparing Geometries Across Models ---\n"
            "Suppose Model A has 4096 dimensions and Model B has 2048 dimensions. How do you compare if Model A and Model B represent data similarly?\n\n"
            "You CANNOT compare neuron indices (Neuron #12 in Model A has nothing to do with Neuron #12 in Model B). You CANNOT use raw Euclidean distance because Model A might be rotated relative to Model B.\n\n"
            "How CKA works (Kornblith et al., 2019):\n"
            "1. Take N example inputs. Pass them through Model A to get N activation vectors. Compute the N × N Gram Matrix K = X Xᵀ (pairwise similarity of examples in Model A).\n"
            "2. Pass the same N inputs through Model B to get N activation vectors. Compute Gram Matrix L = Y Yᵀ (pairwise similarity of examples in Model B).\n"
            "3. CKA measures the Hilbert-Schmidt Independence Criterion (HSIC) between centered matrices K and L!\n\n"
            "What CKA proves: High CKA means Model A and Model B organize example similarities similarly. CKA is invariant to orthogonal rotations.\n"
            "What CKA DOES NOT prove: High CKA does NOT mean the individual features or concepts inside Model A and Model B are identical!\n\n"
            "--- STEP 2: Linear Probing and Hewitt & Liang's Control Tasks ---\n"
            "What is a Probe?\n"
            "A probe is a simple classifier (e.g. linear logistic regression) trained on top of frozen model activations to predict a property (e.g. part-of-speech tag).\n\n"
            "The Probe Fallacy:\n"
            "If a linear probe achieves 98% accuracy predicting part-of-speech tags from Layer 8 activations, does that mean Layer 8 internally uses part-of-speech tags?\n\n"
            "NOT NECESSARILY! Hewitt & Liang (2019) showed that powerful probes can MEMORIZE random target labels even when the representation carries no real structure!\n\n"
            "The Fix — Control Tasks & Selectivity:\n"
            "Construct a Control Task by assigning random, arbitrary labels to input words (matched in output distribution to real tags). Train the probe on real tags (Real Accuracy) and on control tags (Control Accuracy).\n"
            "Selectivity = Real Accuracy - Control Accuracy.\n"
            "High Selectivity proves the representation itself carries structured, accessible information about the property — not just that the probe memorized!\n\n"
            "--- STEP 3: MDL Probing (Voita & Titov, 2020) — Description Length ---\n"
            "Minimum Description Length (MDL) probing measures HOW MUCH EFFORT (code length in bits) a probe requires to learn the task from the representation.\n"
            "• High Accuracy + Short Description Length = Information is neatly, efficiently organized.\n"
            "• High Accuracy + Long Description Length = Information is buried and messy; the probe worked hard to extract it.\n\n"
            "THE METRIC TRUTH TABLE TO MEMORIZE:\n"
            "• Low Reconstruction FVU → High fidelity (preserved variance). Does NOT prove monosemantic concepts.\n"
            "• High Sparsity (L0) → Few active units. Does NOT prove individual units are pure concepts.\n"
            "• High CKA → Similar example geometry across models. Does NOT prove identical features.\n"
            "• High Probe Accuracy → Property is extractable. Does NOT prove model uses it without Control Tasks.\n"
            "• Steering Effect → Causal intervention alters output. Does NOT prove complete mechanism."
        ),
        "bigPictureDiagram": [
            "Dataset of N Examples",
            "Model A → Activations X → N×N Gram Matrix K (Similarity of examples in A)",
            "Model B → Activations Y → N×N Gram Matrix L (Similarity of examples in B)",
            "CKA(K, L) = HSIC(K, L) / √(HSIC(K,K) HSIC(L,L))  ──[Invariant to Orthogonal Rotation]──",
            "Probing: Real Task Accuracy vs. Control Task Accuracy → Selectivity = Real - Control",
        ],
        "conceptsToMaster": [
            {"name": "CKA (Centered Kernel Alignment)", "simple": "A metric that compares whether two different neural networks organize a set of examples in the same geometric pattern, regardless of rotation or matrix size.", "deeper": "CKA(K,L) = HSIC(K,L) / sqrt(HSIC(K,K) HSIC(L,L)) where K = X Xᵀ and L = Y Yᵀ are centered Gram matrices. Invariant to orthogonal transformation and isotropic scaling. Measures representational similarity without needing feature alignment."},
            {"name": "Probe Selectivity", "simple": "The difference between probe accuracy on real labels versus probe accuracy on random control labels. High selectivity proves representation structure.", "deeper": "Selectivity = Accuracy(Real Task) - Accuracy(Control Task). Control task assigns pseudo-labels with identical marginal distribution. High selectivity rules out probe memorization capacity."},
            {"name": "MDL Probing (Minimum Description Length)", "simple": "Measuring how many bits of information a probe needs to learn a task from a representation. Shorter code length = more accessible organization.", "deeper": "Measures codelength L_{online}(Y|X) using online coding (prequential code). Evaluates representation quality by total description length required to transmit labels given representations."},
            {"name": "Subspace Similarity (SVCCA)", "simple": "Running SVD first to remove noise, then running CCA to compare shared subspaces between two models.", "deeper": "Truncates low-variance singular values via SVD to reduce noise dimensions, then computes canonical correlations on truncated subspace. Measures affine-invariant subspace overlap."},
        ],
        "checkpoint": {
            "goal": "Build a complete evaluation notebook computing CKA, Linear Probe Accuracy, Control Task Accuracy, and Selectivity on two model layers.",
            "steps": [
                "Extract activations from Layer 8 and Layer 16 of a model.",
                "Compute Linear CKA between Layer 8 and Layer 16.",
                "Train a linear probe to predict a linguistic property (Real Task).",
                "Construct a Control Task with randomized labels; train probe (Control Task).",
                "Calculate Selectivity and plot the results.",
            ],
            "successLooksLike": "You can explain why a probe with 95% real accuracy and 90% control accuracy provides WEAKER evidence than a probe with 85% real accuracy and 20% control accuracy.",
        },
        "bridgeToNext": "Armed with honest metrics, Levels 7–9 enter Mechanistic Interpretability — exploring transformer internals, superposition, and Sparse Autoencoders.",
    },
    7: {
        "title": "Mechanistic interpretability foundations",
        "mission": "Understand the Transformer Residual Stream, the Toy Models of Superposition hypothesis, Polysemanticity, and why Sparse Autoencoders (SAEs) exist.",
        "beforeYouStart": "Level 1–2 sparse dictionaries and Level 6 evaluation hygiene.",
        "primer": (
            "Welcome to Level 7. We now enter Mechanistic Interpretability — opening the black box of Transformer language models to understand their exact internal mechanisms.\n\n"
            "--- STEP 1: The Residual Stream — The Central Communication Bus ---\n"
            "In a Transformer architecture (Elhage et al., 2021), think of the Residual Stream as a central conveyor belt (communication bus) running through the entire model from Layer 1 to Layer L.\n\n"
            "Every Attention block and MLP block reads from the residual stream, performs computation, and WRITES ITS RESULT BACK by adding it to the residual stream:\n"
            "x_{l+1} = x_l + Attention(x_l) + MLP(x_l)\n\n"
            "Because updates are added linearly, features written by early layers can travel directly to deep layers unimpeded!\n\n"
            "--- STEP 2: The Superposition Hypothesis (Elhage et al., Anthropic 2022) ---\n"
            "Here is the central paradox of neural networks:\n"
            "A model with d_model = 4096 dimensions can represent TENS OF THOUSANDS of distinct concepts. How is this mathematically possible?\n\n"
            "The Superposition Hypothesis:\n"
            "When concepts are SPARSE (only active occasionally), a network can pack MORE features than dimensions by embedding features as ALMOST-ORTHOGONAL directions in space!\n\n"
            "The Interference Cost:\n"
            "Because the feature directions are not strictly 90° orthogonal, activating Feature A creates a small non-zero projection onto Feature B. We call this INTERFERENCE (crosstalk). When features are sparse, interference happens rarely enough that non-linearities (like ReLU) can wipe out the small interference noise!\n\n"
            "--- STEP 3: Polysemantic Neurons — Why Reading Single Neurons Fails ---\n"
            "Because features are packed into almost-orthogonal directions in superposition, individual basis neurons in the network get aligned with COMBINATIONS of multiple features!\n"
            "A single neuron might fire for 'academic citation markers' AND 'photos of anime characters' AND 'Arabic verbs'. This is called a POLYSEMANTIC NEURON.\n\n"
            "Reading individual neurons is a dead end. Concepts live along FEATURE DIRECTIONS, not along individual neuron axes!\n\n"
            "--- STEP 4: Enter Sparse Autoencoders (SAEs) — Finding an Overcomplete Basis ---\n"
            "In 'Toy Models of Superposition' (2022), Anthropic listed 'Approach 2: Find an Overcomplete Basis after training'. This is EXACTLY what a Sparse Autoencoder (SAE) is!\n\n"
            "An SAE takes superposed activations x from the residual stream, projects them into a high-dimensional overcomplete sparse dictionary z = TopK(W_enc x + b_enc), and reconstructs x_hat = W_dec z + b_dec.\n\n"
            "By enforcing high overcompleteness (e.g. 16x width) and strict sparsity, the SAE unfolds superposed directions into clean, MONOSEMANTIC dictionary features!"
        ),
        "bigPictureDiagram": [
            "Residual Stream (d_model dimensions) ──[Carries superposed features]──",
            "Superposition: N sparse features (N > d_model) packed as almost-orthogonal vectors",
            "Result on Basis Neurons: Polysemanticity (1 neuron = mashup of 3 unrelated concepts)",
            "SAE Solution: Overcomplete Encoder → Sparse Bottleneck (z) → Unfolds monosemantic feature directions",
        ],
        "conceptsToMaster": [
            {"name": "Residual Stream", "simple": "The main vector pathway running through a Transformer that layers read from and write updates into via linear addition.", "deeper": "x_{l+1} = x_l + f_l(x_l). Acts as a linear communication bus. Allows linear paths through the network where components write feature vectors directly to downstream layers."},
            {"name": "Superposition", "simple": "Packing more sparse features than available dimensions into a vector space by placing feature directions at slight non-orthogonal angles.", "deeper": "Representing M features in d dimensions (M > d). Enabled by feature sparsity and non-linearities. Features form geometric polytopes (e.g. Thomson problem configurations) to minimize cross-feature interference."},
            {"name": "Polysemanticity", "simple": "When a single neuron lights up for multiple totally unrelated concepts because superposition packed those concepts together.", "deeper": "Occurs when feature directions are not aligned with standard basis vectors. A neuron coordinate x_i = e_i^T (sum c_j v_j) receives projections from multiple concept directions v_j."},
            {"name": "Monosemantic Feature", "simple": "A feature direction that fires for ONE clear, consistent semantic concept across all contexts.", "deeper": "A direction v in activation space corresponding to a single conceptual variable. SAEs attempt to isolate monosemantic directions by finding an overcomplete sparse basis."},
        ],
        "checkpoint": {
            "goal": "Write a mechanistic interpretation breakdown linking superposition theory to residual stream activations.",
            "steps": [
                "Estimate the activation sparsity regime of a chosen layer.",
                "Identify polysemantic neurons by inspecting top-activating token contexts.",
                "State why a standard pointwise SAE acts as Approach 2 for unfolding superposition.",
            ],
            "successLooksLike": "You can explain clearly why neuron-level interpretability fails under superposition and why SAE overcomplete dictionaries are required.",
        },
        "bridgeToNext": "Now that you know why SAEs are needed, Level 8 compares Modern SAE Architectures (TopK, Gated, JumpReLU, BatchTopK, Matryoshka) on fair Pareto frontiers.",
    },
    8: {
        "title": "Modern SAE architectures",
        "mission": "Compare modern SAE architectures: L1, TopK, Gated, JumpReLU, BatchTopK, and Matryoshka SAEs. Master fair evaluation on Pareto frontiers.",
        "beforeYouStart": "Level 7 SAE motivation.",
        "primer": (
            "Welcome to Level 8. Once researchers realized Sparse Autoencoders could unpack superposed features, an architectural arms race began.\n\n"
            "Different architectures enforce sparsity differently and handle feature magnitudes differently. In this level, we compare the six major SAE architecture families.\n\n"
            "--- 1. L1 SAE (Bricken et al., 2023; Cunningham et al., 2023) ---\n"
            "• Encoder: z = ReLU(W_enc x + b_enc)\n"
            "• Loss: ||x - x_hat||² + λ ||z||₁\n"
            "• Pros: Simple, classic baseline.\n"
            "• Cons: Severe L1 magnitude shrinkage (under-estimates feature strength) and dead feature problems.\n\n"
            "--- 2. TopK SAE (Gao et al., OpenAI 2024) ---\n"
            "• Encoder: z = TopK(W_enc x + b_enc, k)\n"
            "• Loss: Pure reconstruction loss ||x - x_hat||²\n"
            "• Pros: Enforces exact sparsity k per token with ZERO magnitude shrinkage! Superior Pareto frontier.\n"
            "• Cons: Hard threshold can create optimization step-function challenges.\n\n"
            "--- 3. Gated SAE (Rajamanoharan et al., DeepMind 2024) ---\n"
            "• Mechanism: Separates the gating decision (is feature active?) from magnitude calculation.\n"
            "• Gate: π = Heaviside(W_gate x + b_gate)\n"
            "• Magnitude: m = ReLU(W_mag x + b_mag)\n"
            "• Output: z = π ⊙ m\n"
            "• Pros: Eliminates L1 shrinkage while remaining fully differentiable.\n\n"
            "--- 4. JumpReLU SAE (Rajamanoharan et al., 2024) ---\n"
            "• Encoder: z = x * H(x - θ) where H is Heaviside step and θ is a learned threshold per feature.\n"
            "• Pros: Direct L0-style optimization with learned feature-specific thresholds.\n\n"
            "--- 5. BatchTopK SAE (Bussmann & Leask, 2024) ---\n"
            "• Mechanism: Instead of fixing exactly k active features for EVERY token, BatchTopK enforces a global sparsity budget across an ENTIRE MINIBATCH.\n"
            "• Advantage: Difficult tokens (complex text) get to activate 50 features, while simple tokens (punctuation) activate only 5 features!\n\n"
            "--- 6. Matryoshka SAE (Bussmann et al., 2025) ---\n"
            "• Mechanism: Nested multi-level dictionaries. Features are ordered such that the first 500 features form a coarse dictionary, the first 2000 form a medium dictionary, and all 8000 form a fine-grained dictionary!\n"
            "• Advantage: Provides multi-granularity concept representations inside a single trained model.\n\n"
            "RULE OF FAIR COMPARISON — THE PARETO FRONTIER:\n"
            "NEVER compare two SAE architectures at arbitrary single hyperparameter points! Always plot the Reconstruction vs. Sparsity Pareto Curve (FVU vs. L0). Method A is superior to Method B ONLY if Method A's curve lies strictly below Method B's curve across matched operating points."
        ),
        "bigPictureDiagram": [
            "L1 SAE: ReLU pre-activations + L1 penalty (Shrinkage flaw)",
            "TopK SAE: Keep top-k values, zero rest (Exact sparsity, no shrinkage)",
            "Gated SAE: Separate Gate Pathway π ⊙ Magnitude Pathway m (Differentiable, no shrinkage)",
            "JumpReLU: Learned feature threshold θ_i (Direct L0 proxy)",
            "BatchTopK: TopK applied across full minibatch (Flexible token budgets)",
            "Matryoshka: Nested feature prefixes [Coarse | Medium | Fine] (Multi-scale concepts)",
        ],
        "conceptsToMaster": [
            {"name": "TopK SAE", "simple": "An SAE that keeps exactly the k largest feature activations per token and zeroes the rest, avoiding L1 magnitude shrinkage.", "deeper": "z = TopK(W_enc(x - b_dec) + b_enc, k). Loss is pure MSE. Eliminates shrinkage because non-zero activations carry unpenalized encoder magnitudes."},
            {"name": "Gated SAE", "simple": "An SAE that uses one neural path to decide IF a feature turns on, and a separate path to measure HOW STRONGLY it fires.", "deeper": "Uses dual encoder pathways: gating net produces binary mask π via thresholding, magnitude net produces positive magnitude m. z = π ⊙ m. Resolves shrinkage while maintaining smooth gradient flow."},
            {"name": "Expansion Factor", "simple": "The ratio of dictionary width to activation dimension (e.g. 16x expansion = 65,536 features for a 4,096-dim model).", "deeper": "Expansion ratio r = d_sae / d_model. Higher expansion reduces feature merging and absorption, but increases compute and memory footprint."},
            {"name": "Pareto Frontier (FVU vs L0)", "simple": "A graph plotting reconstruction error against sparsity. Fair comparisons compare architectures at the exact same sparsity level.", "deeper": "Plots Fraction of Variance Unexplained (FVU) on y-axis against L0 (average active features) on x-axis. Evaluates architectural efficiency across all operational regimes."},
        ],
        "checkpoint": {
            "goal": "Train L1, TopK, and Gated SAE variants on activation data; plot their FVU vs L0 Pareto curves.",
            "steps": [
                "Sweep L1 penalty λ to generate L1 Pareto curve.",
                "Sweep TopK parameter k to generate TopK Pareto curve.",
                "Plot both curves on the same FVU vs L0 axes.",
                "Verify at matched L0 = 20 which architecture achieves lower FVU.",
            ],
            "successLooksLike": "You can demonstrate on a clean Pareto graph why TopK and Gated SAEs outperform vanilla L1 SAEs.",
        },
        "bridgeToNext": "Now that you know modern architectures, Level 9 explores SAE Evaluation & Failure Modes: Feature Absorption, Feature Splitting, and Non-Canonical Units.",
    },
    9: {
        "title": "SAE evaluation and failure modes",
        "mission": "Master SAE failure modes (Absorption, Splitting, Non-canonicality) and understand the SAEBench evaluation suite.",
        "beforeYouStart": "Levels 6–8 evaluation metrics and architectures.",
        "primer": (
            "Welcome to Level 9. Having built modern SAEs, we now confront their deepest empirical failure modes.\n\n"
            "A common naive belief is: 'One SAE feature = One true atomic concept in the world.' Level 9 proves why this assumption is flawed.\n\n"
            "--- FAILURE MODE 1: Feature Splitting (Chanin et al., 2024) ---\n"
            "What is Feature Splitting?\n"
            "As you increase dictionary width (e.g. from 4x to 32x expansion), a single broad concept (e.g. 'Medical text') SPLITS into dozens of hyper-specific sub-features ('Pediatric medicine', 'Medical insurance claims', 'Surgical procedures').\n\n"
            "The Problem: Feature splitting means concepts exist at multiple granularities simultaneously, making it hard to define what an 'atomic' feature is.\n\n"
            "--- FAILURE MODE 2: Feature Absorption (Chanin et al., 2024) ---\n"
            "What is Feature Absorption?\n"
            "Feature Absorption is the inverse of splitting: a single dominant SAE feature 'swallows' or absorbs related specific sub-concepts!\n"
            "Example: Instead of having separate features for 'Golden Retriever' and 'Poodle', a single 'Dog' feature activates for both, absorbing the specific identity.\n\n"
            "Why it happens: Narrow dictionaries or high sparsity penalties force the model to merge correlated concepts into single shared latents.\n\n"
            "--- FAILURE MODE 3: Non-Canonical Units (Leask et al., 2025) ---\n"
            "Suppose you train two SAEs (SAE A and SAE B) on the EXACT SAME model layer with identical hyperparameters, but using different random seeds.\n\n"
            "Both SAE A and SAE B achieve identical low reconstruction error (FVU = 0.03) and identical sparsity (L0 = 25).\n"
            "Do SAE A and SAE B discover the same features?\n\n"
            "NO! Leask et al. proved that SAE A and SAE B discover DIFFERENT feature bases! There is no single 'canonical' sparse basis in activation space. Multiple distinct dictionary decompositions achieve equal quality.\n\n"
            "--- THE SAEBENCH SUITE (Karvonen et al., 2025) & METRIC RELIABILITY ---\n"
            "To evaluate SAEs rigorously, Karvonen et al. introduced SAEBench, covering five evaluation families:\n"
            "1. Reconstruction & Fidelity: FVU, CE loss recovery.\n"
            "2. Sparsity & Efficiency: L0, L1, dead feature rate.\n"
            "3. Feature Interpretability: Automated explanations, monosemanticity scores.\n"
            "4. Downstream Probing: Sparse probing performance on target concepts.\n"
            "5. Steering & Interventions: Causal effect of feature clamping on output behavior.\n\n"
            "Auditing Reliability (Chanin, 2026):\n"
            "Always report seed variance! Single-run leaderboard scores are unreliable due to random initialization noise."
        ),
        "bigPictureDiagram": [
            "Ideal Assumption: 1 SAE Feature = 1 Atomic Ground-Truth Concept",
            "Reality Failure 1 (Splitting): Concept 'Dog' splits into 50 hyper-specific sub-features as width expands",
            "Reality Failure 2 (Absorption): Feature 'Animal' absorbs 'Dog', 'Cat', and 'Horse' into 1 latent",
            "Reality Failure 3 (Non-Canonical): Seed A and Seed B find completely different valid feature dictionaries",
            "SAEBench Solution: Evaluate across 5 families (Reconstruction, Sparsity, Interpretation, Probing, Steering)",
        ],
        "conceptsToMaster": [
            {"name": "Feature Splitting", "simple": "When a broad concept breaks into multiple narrower sub-features as dictionary size grows.", "deeper": "As dictionary width d_sae increases, coarse feature directions decompose into finer sub-directions. Illustrates that feature granularity is a function of dictionary capacity."},
            {"name": "Feature Absorption", "simple": "When one high-level feature swallows up specific sub-concepts because the dictionary is too small or too sparse.", "deeper": "Occurs when a parent feature vector v_parent absorbs child feature vectors v_child, firing whenever any child concept is present. Reduces feature specificity."},
            {"name": "Non-Canonical Units", "simple": "The discovery that different random seeds yield different interpretable dictionaries of equal quality, proving there is no single 'true' feature basis.", "deeper": "Proves non-uniqueness of sparse dictionary solutions. Multiple overcomplete frame representations span activation space with equivalent L0 and MSE, challenging naive realism in interpretability."},
            {"name": "SAEBench", "simple": "A standardized benchmark suite evaluating SAEs across reconstruction, sparsity, probing, steering, and interpretability.", "deeper": "Comprehensive evaluation framework combining loss recovery, L0 efficiency, SCR (sparse probing accuracy), feature absorption metrics, and intervention causal effects."},
        ],
        "checkpoint": {
            "goal": "Design a complete SAE evaluation protocol incorporating SAEBench families and document metric non-claims.",
            "steps": [
                "List evaluation metrics across 5 families.",
                "For each metric, write down explicitly what it proves and what it CANNOT establish.",
                "Incorporate seed-variance checks for non-canonicality testing.",
            ],
            "successLooksLike": "You can produce an evaluation protocol that rejects any research claim based on FVU or single-seed results alone.",
        },
        "bridgeToNext": "With all foundations built, Level 10 reaches the SetConCA Research Frontier — combining multi-view set coordination with sparse dictionaries.",
    },
    10: {
        "title": "Papers closest to SetConCA research",
        "mission": "Master Temporal SAEs, Concept Component Analysis (ConCA), and Multi-View Causal Identifiability. Formulate actionable research hypotheses for SetConCA.",
        "beforeYouStart": "All previous Levels (1–9).",
        "primer": (
            "Welcome to Level 10 — the capstone level of your mastery path. Here we study the three papers closest to SetConCA and state our core research hypotheses.\n\n"
            "--- STEP 1: Temporal Sparse Autoencoders (Bhalla et al., 2025) ---\n"
            "What did Temporal SAEs do?\n"
            "Standard SAEs treat every token activation in isolation. But language has natural sequential structure: adjacent tokens (token t and token t+1) often share semantic context!\n\n"
            "Temporal SAEs add a CONTRASTIVE REGULARIZATION loss between the sparse codes of adjacent tokens:\n"
            "Loss = Reconstruction + λ_sparse * Sparsity + λ_temp * Contrastive_Loss(z_t, z_{t+1})\n\n"
            "Result: Coordinates feature activations over time, improving feature consistency.\n\n"
            "THE SETCONCA GENERALIZATION:\n"
            "Temporal SAEs coordinate adjacent tokens in time. SetConCA generalizes this idea from temporal pairs to MULTI-VIEW SETS of the exact same semantic object across different contexts, prompts, or layers!\n\n"
            "--- STEP 2: Concept Component Analysis / ConCA (Liu et al., 2026) ---\n"
            "ConCA proposes a generative linear unmixing model for concepts (closer in spirit to Level 1 ICA than standard autoencoders):\n"
            "x = Σ c_i v_i + noise\n\n"
            "ConCA derives identifiability conditions under log-posterior representation assumptions, offering a principled theoretical rival/complement to dictionary learning.\n\n"
            "--- STEP 3: Multi-View Causal Representation Learning (Yao et al., 2023) ---\n"
            "Yao et al. provide mathematical identifiability proofs showing WHEN multi-view observations permit exact latent factor recovery under partial observability.\n\n"
            "THE CENTRAL RESEARCH QUESTION OF SETCONCA:\n"
            "Under what mathematical assumptions does multi-view set supervision cause a sparse dictionary to recover more stable, complete, specific, or causally useful concepts than a pointwise SAE?\n\n"
            "YOUR THREE SETCONCA HYPOTHESES TO TEST:\n"
            "1. Multi-View Set Coordination reduces Feature Absorption by disambiguating co-occurring concepts across views.\n"
            "2. Contrastive Set Losses increase cross-seed Feature Canonicality (dictionary stitching agreement).\n"
            "3. Set-aggregated concept codes achieve higher Probe Selectivity and Steering Causality than single-token SAE latents."
        ),
        "bigPictureDiagram": [
            "Temporal SAE (Bhalla '25): Coordinates adjacent tokens in time z_t ↔ z_{t+1}",
            "SetConCA (Your Project): Coordinates MULTI-VIEW SETS of same concept {x_v1, x_v2, x_v3} ──[Set Aggregator]──→ Sparse Code z",
            "ConCA (Liu '26): Generative linear unmixing with identifiability proofs (ICA-lineage)",
            "MV-Causal (Yao '23): Formal proofs of latent recovery from partial multi-view observations",
        ],
        "conceptsToMaster": [
            {"name": "Multi-View Set Coordination", "simple": "Using multiple views of the same concept as a positive set to train sparse autoencoder feature dictionaries.", "deeper": "Extending single-view SAE objectives by adding set-based contrastive loss L_set(Z_views) = InfoNCE(Set_Pool(Z_pos), Set_Pool(Z_neg)). Enforces representational consistency across semantic view transformations."},
            {"name": "Identifiability under Partial Observability", "simple": "Mathematical proof showing when latent concept variables can be uniquely recovered if you observe multiple partial views.", "deeper": "Proves that under non-Gaussianity and multi-view conditional independence assumptions, the latent factor vector z is identifiable up to component-wise invertible transformations."},
            {"name": "SetConCA Core Thesis", "simple": "Combining sparse dictionaries + multi-view alignment + set aggregators + contrastive coordination yields cleaner concepts than pointwise SAEs.", "deeper": "Hypothesizes that multi-view set supervision resolves non-canonicality and feature absorption by enforcing latent invariance across view transforms while maintaining overcomplete dictionary sparsity."},
        ],
        "checkpoint": {
            "goal": "Write three formal research hypotheses for SetConCA naming Level 6 metrics and Level 9 failure modes.",
            "steps": [
                "Hypothesis 1: Target a specific failure mode (Absorption or Splitting).",
                "Hypothesis 2: Target dictionary stability across seeds (Canonicality / CKA).",
                "Hypothesis 3: Target causal intervention performance (Steering / Probing Selectivity).",
            ],
            "successLooksLike": "You can state three precise, falsifiable experimental hypotheses ready for implementation and testing.",
        },
        "bridgeToNext": "Congratulations! You have completed the entire SetConCA Mastery Curriculum. You are ready to build, execute, and publish SetConCA research.",
    },
}
