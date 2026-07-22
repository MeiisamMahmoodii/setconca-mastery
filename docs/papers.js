window.CURRICULUM_DATA = {
  "title": "SetConCA Mastery Path",
  "subtitle": "From representation foundations to multi-view sparse autoencoders",
  "formula": "SetConCA = Sparse dictionary learning + Multi-view learning + Set representation + Contrastive coordination",
  "courseIntro": {
    "title": "SetConCA Mastery",
    "promise": "Welcome to your step-by-step masterclass. You will learn every concept from absolute first principles. Every paper, equation, and term is explained as if sitting right beside a patient teacher.",
    "formula": "SetConCA = Sparse dictionary learning + Multi-view learning + Set representation + Contrastive coordination",
    "howToUse": [
      "Start at Level 1. Read the Level Primer (the lecture) carefully from top to bottom.",
      "When a new mathematical term or concept appears, pause — the primer explains what it means, where it came from, and how to read its formula.",
      "Open each paper module in order. Read Plain English, Key Ideas, Math, and Vocabulary.",
      "Complete the Mastery Checklist and Quiz before moving to the next level.",
      "Do not skip levels — each level builds naturally on the concepts taught in the previous one."
    ],
    "pathMap": "Levels 1–2 build the foundation: how to break down vectors into variance (PCA), independent sources (ICA), correlated views (CCA), and sparse codes (TopK/SAEs). Levels 3–5 extend to nonlinear neural networks: multi-view alignment (DCCA/DCCAE), set aggregators (Deep Sets/Set Transformer), and contrastive losses (InfoNCE/SimCLR/SupCon). Level 6 teaches honest evaluation (CKA, probes, control tasks). Levels 7–9 dive deep into AI internals: superposition, transformer residual streams, modern SAE architectures, and failure modes (absorption/splitting). Level 10 synthesises everything into the SetConCA research frontier."
  },
  "levelPrimers": {
    "1": {
      "title": "What is a representation?",
      "mission": "Master PCA, ICA, and CCA from first principles. Understand what each objective measures, how to read their math, and why good reconstruction does not equal interpretability.",
      "beforeYouStart": "None — we start from absolute zero.",
      "primer": "Welcome to Level 1. Imagine a modern language model like Gemma or Llama processing a sentence. Inside the model, words are converted into long lists of numbers — vectors with thousands of dimensions (e.g. 4096 numbers per token). We call these numbers 'activations', and together they form the model's internal representation.\n\nHere is the fundamental problem: why can't we just look at index #42 of that vector to see if the model is thinking about 'dogs'? Because neural networks do not allocate one number per concept. Information is spread out across all dimensions simultaneously. To understand what the network is doing, we need mathematical tools to rotate, unmix, or align these high-dimensional vector spaces.\n\nIn this level, we master the three classical linear tools that started it all: PCA, ICA, and CCA.\n\n--- STEP 1: PCA (Principal Component Analysis) — Finding Variance Inside One View ---\nWhere did it come from? In 1901, Karl Pearson wanted a way to summarize a complex cloud of data points using fewer dimensions without losing important spread.\n\nHow does it work? Imagine a 3D cloud of data shaped like a football floating in a room. If you must project this 3D cloud onto a flat 2D screen, which angle preserves the most information? You want to rotate the screen so it faces the longest axis of the football!\n\nLet's build the math step-by-step:\n1. Mean (μ): The central point of your data cloud.\n2. Variance: How far data points spread out around that mean. For a variable x, variance is E[(x - μ)²]. We square the differences so positive and negative offsets don't cancel each other out.\n3. Covariance: How two different coordinates move together. If coordinate X goes up whenever coordinate Y goes up, their covariance E[(x - μ_x)(y - μ_y)] is positive.\n4. Covariance Matrix (C): A square grid recording the pairwise covariance between every single pair of dimensions.\n5. Eigenvectors & Singular Value Decomposition (SVD): An eigenvector of matrix C is a special direction in space that DOES NOT ROTATE when multiplied by C — it only gets stretched! The stretch factor is the Eigenvalue (λ). SVD (X = U Σ Vᵀ) is the standard numerical algorithm to compute these principal directions directly from raw data.\n\nThe PCA recipe: PCA finds orthogonal (90-degree right angle) axes ordered by how much variance they capture. The first component is the longest axis of the cloud; the second component is the next longest axis strictly perpendicular to the first.\n\nWhat is FVU (Fraction of Variance Unexplained)?\nIf you keep only the top k components and throw away the rest, your reconstructed points will have a small error. FVU = 1 - (Explained Variance / Total Variance). If FVU is 0.02, your rank-k subspace captures 98% of the data's spread.\n\nCRITICAL LESSON FOR MI & SAE RESEARCH:\nOrthogonality is a mathematical convenience, NOT a guarantee of semantic meaning. PCA directions are orthogonal pure-math axes. They are rarely clean human concepts! Good reconstruction (low FVU) only means you kept the spread — it does NOT mean you found interpretable features.\n\n--- STEP 2: ICA (Independent Component Analysis) — Unmixing Independent Sources ---\nWhere did it come from? Imagine the 'Cocktail Party Problem'. Two people are speaking at the exact same time in a room. You place two microphones at different locations. Mic 1 picks up 70% Person A + 30% Person B. Mic 2 picks up 40% Person A + 60% Person B. How do you recover the original pure individual voices without knowing who spoke or where the mics were?\n\nWhy PCA fails here: Person A and Person B's voices are NOT orthogonal in microphone space. PCA would just find the direction of highest combined volume, mixing both voices together!\n\nThe ICA core concept: ICA assumes the observations x come from a linear mixture x = A * s, where s is a vector of statistically INDEPENDENT source signals. Independence is much stronger than zero correlation. Zero correlation means E[xy] = E[x]E[y] (no linear relation). Independence means p(x,y) = p(x)p(y) — knowing variable x gives you ABSOLUTELY ZERO information about variable y.\n\nHow ICA unmixes: The Central Limit Theorem states that adding independent random variables together makes their combined distribution more Gaussian (bell-shaped). Therefore, mixed signals are always more Gaussian than single pure signals! ICA searches for an unmixing matrix W such that the recovered signals y = W * x are as NON-GAUSSIAN as possible (maximizing kurtosis or negentropy). By pushing distributions away from bell curves, ICA pops the independent sources back out.\n\nConnection to SetConCA: Concept Component Analysis (ConCA) uses this exact unmixing mental model, treating neural activations as linear mixtures of independent concept components.\n\n--- STEP 3: CCA (Canonical Correlation Analysis) — Finding Shared Signals Between Two Views ---\nWhere did it come from? Harold Hotelling (1936) asked: what if you have TWO different measurements of the same items? For example, View 1 is an audio recording of a speech, and View 2 is a video recording of the speaker's lips. Audio vectors and video vectors have different dimensions and different units.\n\nHow does CCA work? CCA searches for a linear direction u in View 1 space and a linear direction v in View 2 space such that the projected numbers (uᵀx and vᵀy) have the MAXIMUM possible correlation with each other!\n\nShared vs. Private Information:\nCCA focuses strictly on what is SHARED between the two views. If View 1 contains background noise that has nothing to do with View 2, CCA ignores it. The projected variables (uᵀx, vᵀy) are called Canonical Variables, and their correlation is the Canonical Correlation.\n\nTHE CLASSICAL TRIAD TO MEMORIZE:\n• PCA asks: Which directions capture max variance INSIDE one view?\n• ICA asks: Which directions unmix INDEPENDENT sources inside one view?\n• CCA asks: Which directions LINE UP (correlate) ACROSS two views?",
      "bigPictureDiagram": [
        "One view  → PCA  → keep max variance axes (orthogonal, math-driven)",
        "One view  → ICA  → unmix independent non-Gaussian sources (Cocktail party)",
        "Two views → CCA  → find maximum cross-view linear correlation (shared signal)"
      ],
      "conceptsToMaster": [
        {
          "name": "Variance / Covariance",
          "simple": "Variance = how much one variable spreads out around its average. Covariance = whether two variables rise and fall together.",
          "deeper": "Covariance matrix C = E[(x−μ)(x−μ)ᵀ]. Diagonals are variances; off-diagonals are pairwise covariances. PCA diagonalizes C."
        },
        {
          "name": "Eigenvector / SVD",
          "simple": "An eigenvector is a special arrow in space that only gets stretched (not tilted) when multiplied by a matrix. SVD is the master algorithm that finds these stretch directions.",
          "deeper": "Singular Value Decomposition X = U Σ Vᵀ factors data matrix X into left singular vectors U, singular values Σ, and right singular vectors V. The columns of V are the principal component directions."
        },
        {
          "name": "FVU (Fraction of Variance Unexplained)",
          "simple": "The percentage of original data spread lost after compressing and reconstructing.",
          "deeper": "FVU = 1 - (Explained Variance / Total Variance) = ||X - X_hat||_F^2 / ||X - X_mean||_F^2. Lower FVU means better reconstruction, but NOT higher interpretability."
        },
        {
          "name": "Independence vs. Uncorrelatedness",
          "simple": "Uncorrelated means no straight-line relationship. Independent means knowing one variable tells you absolutely nothing about the other.",
          "deeper": "Uncorrelatedness only requires Cov(X,Y) = 0 (2nd-order statistic). Independence requires joint probability p(x,y) = p(x)p(y) across all higher-order moments. ICA requires independence or non-Gaussianity for source recovery."
        },
        {
          "name": "Canonical Correlation",
          "simple": "The highest correlation achievable between two different views after rotating each view appropriately.",
          "deeper": "CCA finds projection vectors u, v maximizing corr(uᵀX, vᵀY) subject to Var(uᵀX) = 1 and Var(vᵀY) = 1. Solved via a generalized eigenvalue problem on cross-covariance matrices."
        }
      ],
      "checkpoint": {
        "goal": "Compare PCA, ICA, and CCA on the same activation dataset.",
        "steps": [
          "Extract activations from Gemma for a dataset of prompts.",
          "Run PCA: plot FVU versus the number of components k.",
          "Run ICA: inspect whether unmixed components isolate distinct activation patterns.",
          "Create two views (e.g. Layer 10 vs Layer 14 activations for the same prompts) and run CCA.",
          "Compare reconstruction error (FVU), cross-view correlation, and retrieval performance."
        ],
        "successLooksLike": "You can explain clearly which method wins on which metric and why high reconstruction or high correlation does NOT automatically mean you found human-interpretable concepts."
      },
      "bridgeToNext": "Now that you understand linear decompositions (PCA/ICA/CCA), Level 2 moves to Sparse Representations & Autoencoders — expanding feature count beyond input dimensions."
    },
    "2": {
      "title": "Sparse representations and dictionaries",
      "mission": "Understand overcomplete dictionaries, why overcompleteness REQUIRES sparsity, how TopK differs from L1, and how VAEs use probabilistic latents.",
      "beforeYouStart": "Level 1 — especially linear reconstruction, FVU, and unmixing.",
      "primer": "Welcome to Level 2. In Level 1, PCA compressed N-dimensional data into k dimensions where k < N (undercomplete). But in neural networks, a fascinating phenomenon occurs: models often pack THOUSANDS of concepts into just hundreds of activation dimensions! To unpack them, we need an OVERCOMPLETE dictionary — a hidden code with MORE features than activation dimensions (e.g. 16,000 dictionary features for a 4,000-dimensional model).\n\n--- STEP 1: Why Overcompleteness Demands Sparsity ---\nImagine you have a 100-dimensional activation vector, and you build a hidden dictionary with 10,000 feature directions. If your neural network is allowed to use ALL 10,000 features at the same time for every single token, what happens?\nThe network can easily reconstruct the input perfectly by assigning tiny, mushy numbers to all 10,000 features! Every feature becomes a generic soup of everything. It is completely uninterpretable.\n\nSparsity is the strict constraint that saves us: for any given token, ONLY A FEW features (e.g. 20 out of 10,000) are allowed to be active (nonzero)! The rest MUST be zero.\nWhen forced to represent data with only 20 active features out of 10,000, each feature direction HAS to specialize into a pure, clean concept (e.g. 'text about legal contracts' or 'Python syntax for loops').\n\n--- STEP 2: The Sparsity Mechanisms — L0, L1, and TopK ---\nHow do we mathematically enforce sparsity?\n\n1. L0 Norm (Ideal but hard):\nThe L0 'norm' ||z||₀ simply counts how many entries in vector z are non-zero. Ideally, we would optimize Loss = Reconstruction_Error + λ * ||z||₀. However, counting non-zeros is non-differentiable (gradient is zero everywhere except jumps). We cannot train neural nets with standard backpropagation using pure L0.\n\n2. L1 Regularization (Lasso penalty):\nIn 2012–2023, researchers relaxed L0 to L1: ||z||₁ = Σ |z_i| (the sum of absolute values). L1 is convex and differentiable everywhere except at 0. It pushes small feature activations to exactly zero.\nThe Hidden Flaw of L1 (Shrinkage): L1 penalizes the MAGNITUDE of active features along with their presence. To reduce the L1 penalty, the model artificially shrinks the active feature values below their true true size! This 'shrinkage' damages reconstruction accuracy.\n\n3. Hard TopK Activation (Makhzani & Frey, 2013 → Gao et al., 2024):\nInstead of adding an L1 penalty to the loss, TopK modifies the network architecture directly! The encoder computes pre-activations for all 10,000 features. Then, a TopK operator selects the top k largest pre-activations (e.g. k=32), keeps their exact values, and forcefully SETS ALL OTHER 9,968 ACTIVATIONS TO ZERO!\nBecause TopK keeps the exact magnitude of the top k features without shrinking them, it achieves much better reconstruction at matched sparsity levels than L1.\n\n--- STEP 3: Autoencoders vs VAEs (Variational Autoencoders) ---\nAn Autoencoder consists of an Encoder z = f(x) that compresses input x into latent code z, and a Decoder x_hat = g(z) that reconstructs x.\n\nWhat is a VAE (Kingma & Welling, 2013)?\nInstead of mapping input x to a single fixed point z, a VAE maps x to a PROBABILISTIC DISTRIBUTION — predicting a mean vector μ and a variance vector σ. The latent z is then sampled from N(μ, σ²).\n\nHow does backprop flow through random sampling? The Reparameterization Trick!\nYou cannot backpropagate gradients through random sampling. Kingma & Welling solved this by separating the randomness: sample noise ε ~ N(0, I) externally, then write z = μ + σ ⊙ ε. Now μ and σ are deterministic node outputs that receive normal gradients!\n\nThe VAE ELBO Loss (Evidence Lower Bound):\nLoss = Reconstruction Error + KL-Divergence(q(z|x) || p(z))\nThe KL-Divergence term forces the learned distribution q(z|x) to stay close to a standard normal prior p(z) = N(0, I), preventing the latent space from leaving empty gaps.\n\nWhy VAEs matter for SetConCA:\nYou don't need to become a VAE researcher, but when SetConCA aggregates multiple activation views using Gaussian distributions or Product-of-Experts (PoE), you are using this exact probabilistic latent vocabulary.",
      "bigPictureDiagram": [
        "Dense Input x → Encoder → Overcomplete z (width > N) → Sparsity Gate → Decoder → Reconstruction x_hat",
        "L1 Sparsity: Soft penalty Σ|z_i| (causes magnitude shrinkage)",
        "TopK Sparsity: Hard keep top-k values, zero rest (no shrinkage, exact k)",
        "VAE Latent: Predict μ, σ → Reparameterize z = μ + σ ⊙ ε → ELBO Loss"
      ],
      "conceptsToMaster": [
        {
          "name": "Overcomplete Dictionary",
          "simple": "Having more feature directions in your hidden layer than dimensions in the input space.",
          "deeper": "Dictionary matrix W_dec has dimension d_model × d_hidden where d_hidden > d_model (e.g. 4x, 16x, 32x expansion). Essential for unfolding superposed features."
        },
        {
          "name": "L0 vs L1 vs TopK",
          "simple": "L0 counts non-zero features. L1 adds up absolute values (causing shrinkage). TopK keeps exactly the k largest features and zeroes the rest.",
          "deeper": "L0 is non-differentiable. L1 is a convex proxy but penalizes magnitude. TopK enforces exact cardinality k while preserving true pre-activation magnitudes of active units."
        },
        {
          "name": "Shrinkage Problem",
          "simple": "When L1 penalties force active features to be smaller than they should be, harming reconstruction quality.",
          "deeper": "L1 loss derivative is constant λ w.r.t active z_i. To minimize L1 penalty, optimizer reduces z_i, causing under-estimation of feature firing strength. Resolved by Gated SAEs and TopK SAEs."
        },
        {
          "name": "ELBO (Evidence Lower Bound)",
          "simple": "The training objective of a VAE balancing reconstruction accuracy with keeping latents near a simple prior distribution.",
          "deeper": "ELBO = E_q[log p(x|z)] - KL(q(z|x) || p(z)). Maximizing ELBO maximizes log-likelihood lower bound. KL term prevents arbitrary latent cluster dispersion."
        },
        {
          "name": "Reparameterization Trick",
          "simple": "A trick to let backprop gradients flow through random sampling by writing z = μ + σ * noise.",
          "deeper": "Expresses stochastic latent z ~ N(μ(x), Σ(x)) as deterministic transformation z = μ(x) + L(x)ε where ε ~ N(0,I). Enables standard gradient computation w.r.t encoder parameters."
        }
      ],
      "checkpoint": {
        "goal": "Train a simple L1 Autoencoder versus a TopK Autoencoder on activation data under matched reconstruction budgets.",
        "steps": [
          "Fix a target FVU budget (e.g. FVU = 0.05).",
          "Train an L1 SAE by tuning penalty λ.",
          "Train a TopK SAE by setting parameter k.",
          "Compare average L0 (active features per token) and inspect active feature magnitudes to observe L1 shrinkage in action."
        ],
        "successLooksLike": "You can explain from experimental data why TopK achieves better reconstruction at the same L0 count than L1."
      },
      "bridgeToNext": "Now that you understand single-view sparse dictionaries, Level 3 moves to Multi-View Representation Learning — aligning multiple observations of the same object."
    },
    "3": {
      "title": "Nonlinear multi-view representation learning",
      "mission": "Master Deep CCA, DCCAE, VCCA, and DGCCA. Learn how to separate shared cross-view information from private view-specific information.",
      "beforeYouStart": "Level 1 CCA and Level 2 Autoencoders.",
      "primer": "Welcome to Level 3. What is a 'view'? A view is one observation of an underlying object. In AI research, multiple views arise naturally:\n• Two different layers of a transformer processing the same text.\n• Two different prompt paraphrases expressing the same concept ('A photo of a dog' vs 'An image showing a canine').\n• Two different modalities (e.g. image + caption in CLIP).\n\nIn Level 1, we learned linear CCA. But neural networks process data nonlinearly. How do we extend multi-view alignment to deep neural networks?\n\n--- STEP 1: Deep CCA (Andrew et al., 2013) ---\nDeep CCA places a neural network encoder f_θ on View 1 and a neural network encoder g_φ on View 2. The objective trains both networks simultaneously to maximize the canonical correlation between their output embeddings!\n\nThe Whitening Constraint in DCCA:\nIf you simply maximize cosine similarity between network outputs without constraints, the networks can cheat by collapsing all outputs into a single constant vector (representation collapse)! DCCA prevents this by enforcing a covariance constraint (whitening): the output dimensions of each view must have unit variance and zero correlation with each other.\n\n--- STEP 2: The Critical Danger of DCCA — Information Discard ---\nSuppose View 1 is a detailed text description of a scene and View 2 is a low-resolution thumbnail image. If your ONLY objective is to maximize correlation between the two views, what will the text encoder do?\nIt will THROW AWAY 90% of the text details (specific names, dates, fine details) because those details do not exist in the thumbnail image! Correlation-only objectives erase useful view-specific (private) information.\n\n--- STEP 3: DCCAE (Wang et al., 2015) — Balancing Alignment and Reconstruction ---\nTo solve the information discard problem, Deep Canonically Correlated Autoencoders (DCCAE) add an autoencoding reconstruction loss to each view!\n\nDCCAE Loss = - Canonical_Correlation(z_A, z_B) + λ * (||x_A - dec_A(z_A)||² + ||x_B - dec_B(z_B)||²)\n\nNow the model is forced to find a shared code z that aligns across views while preserving enough internal information to reconstruct each raw view!\n\n--- STEP 4: VCCA & DGCCA — Probabilistic Shared/Private Latents & Many Views ---\n• VCCA (Wang et al., 2016) explicitly splits the latent representation into TWO parts: a Shared Latent z_shared (explaining what is common) and Private Latents z_privA, z_privB (explaining view-specific details). View A is reconstructed from (z_shared, z_privA).\n• DGCCA (Benton et al., 2017) extends GCCA to deep networks for 3, 4, or 100 views, learning a single central shared representation matrix G that all view encoders target.\n\nSETCONCA MANDATE:\nNever force all view representations to become identical. A healthy multi-view representation aligns shared concept directions while preserving view-specific details!",
      "bigPictureDiagram": [
        "View A (x_A) → Encoder f_θ → z_A ──┐",
        "                                    ├─→ Maximize Cross-View Correlation",
        "View B (x_B) → Encoder g_φ → z_B ──┘",
        "DCCAE Addition: z_A → Decoder_A → x_hat_A  |  z_B → Decoder_B → x_hat_B (Preserves private info!)",
        "VCCA Explicit Split: z = [z_shared | z_private]"
      ],
      "conceptsToMaster": [
        {
          "name": "Shared vs. Private Information",
          "simple": "Shared = what is common across all views. Private = view-specific details that exist in only one view.",
          "deeper": "In multi-view setup (X_1, X_2), I(X_1; X_2) is shared information. I(X_1; X_1 | X_2) is private information of view 1. Maximizing multi-view correlation targets shared info but risks destroying private info unless reconstruction losses are included."
        },
        {
          "name": "Covariance / Whitening Constraints",
          "simple": "Forcing latent dimensions to be uncorrelated and normalized so the network cannot cheat by collapsing.",
          "deeper": "DCCA requires 1/N Z_A^T Z_A = I and 1/N Z_B^T Z_B = I. Prevents trivial solution where all output coordinates become identical or scalar multiples."
        },
        {
          "name": "DCCAE Tradeoff",
          "simple": "The hyperparameter balancing cross-view alignment correlation against within-view reconstruction quality.",
          "deeper": "Loss = -CCA_loss(f(X_1), g(X_2)) + λ_1 ||X_1 - dec_1(f(X_1))||^2 + λ_2 ||X_2 - dec_2(g(X_2))||^2. Tuning λ traces out an alignment-fidelity Pareto frontier."
        },
        {
          "name": "Generalized CCA (DGCCA)",
          "simple": "Extending CCA math from 2 views to an arbitrary number of views (e.g. 5 layers or 10 prompt views).",
          "deeper": "DGCCA optimizes min_G sum_i ||G - U_i^T f_i(X_i)||_F^2 where G is a shared target representation matrix and U_i are view-specific projections."
        }
      ],
      "checkpoint": {
        "goal": "Implement a shared vs private latent decomposition on a 2-view synthetic dataset.",
        "steps": [
          "Generate synthetic paired views with known shared factors and view-specific noise.",
          "Train a DCCA model (correlation only) versus a DCCAE model (correlation + reconstruction).",
          "Test downstream retrieval (shared task) and view reconstruction (private task)."
        ],
        "successLooksLike": "You can demonstrate visually how pure DCCA discards private details while DCCAE retains both."
      },
      "bridgeToNext": "In Level 3, views had fixed pairings (View A & View B). In Level 4, views form an UNORDERED SET — requiring Set Representation architectures."
    },
    "4": {
      "title": "Learning representations of sets",
      "mission": "Master permutation-invariant set architectures: Deep Sets, Neural Statistician, and Set Transformer.",
      "beforeYouStart": "Level 3 multi-view representations.",
      "primer": "Welcome to Level 4. What is a set? A set is an unordered collection of items: X = {x_1, x_2, ..., x_N}. The set {apple, banana, cherry} is EXACTLY THE SAME as {cherry, apple, banana}.\n\nWhy standard neural networks fail on sets:\nIf you feed a set into a standard MLP or RNN by concatenating elements [x_1, x_2, x_3], the network treats the order of elements as meaningful. Swapping the inputs changes the output! That is forbidden for set functions.\n\n--- STEP 1: Deep Sets (Zaheer et al., 2017) — The Universal Set Theorem ---\nZaheer et al. proved a mathematical theorem: ANY valid permutation-invariant function f(X) operating on an unordered set X can be decomposed into three steps:\n1. Process each element independently using a neural network φ(x_i).\n2. Aggregate (pool) the element representations using a commutative pooling operation (SUM or MEAN).\n3. Process the aggregated set vector using a post-processing network ρ.\n\nFormula: f(X) = ρ( Σ_{x ∈ X} φ(x) )\n\nWhy SUM / MEAN pooling works:\nAddition is commutative (a + b = b + a). Therefore, summing element vectors guarantees that input order cannot change the output!\n\n--- STEP 2: When Mean Pooling Fails — The Need for Set Transformer ---\nDeep Sets processes every set member in total isolation before summing. But what if the meaning of a set depends on RELATIONS between members?\nExample: Imagine a set of activations representing a context. If one member is an 'outlier/intruder' activation, simple mean pooling blends the intruder into the average, corrupting the set representation!\n\nSet Transformer (Lee et al., 2019):\nSet Transformer uses Self-Attention OVER set members before pooling! Members can attend to each other, allowing the network to compare items, suppress outliers, or highlight pairwise relationships. To maintain permutation invariance, Set Transformer uses Pooling by Multihead Attention (PMA) with learned seed vectors.\n\n--- STEP 3: Neural Statistician (Edwards & Storkey, 2016) ---\nInstead of outputting a single point vector for a set, Neural Statistician maps a set of observations to a LATENT STATISTICAL DISTRIBUTION capturing the dataset's generative structure.\n\nAPPLICATION TO SETCONCA:\nIn SetConCA, a single concept is observed across multiple activation views. How should we aggregate those views into one concept code? Deep Sets (mean pooling) is our baseline aggregator, and Set Transformer is our relational aggregator.",
      "bigPictureDiagram": [
        "Unordered Set {x_1, x_2, x_3}",
        "Deep Sets: φ(x_1) + φ(x_2) + φ(x_3) ──[SUM/MEAN]──→ Vector ──[ρ]──→ Set Code f(X)",
        "Set Transformer: {x_i} ──[Self-Attention over members]──→ {x_i'} ──[PMA Attention Pool]──→ Relational Set Code"
      ],
      "conceptsToMaster": [
        {
          "name": "Permutation Invariance",
          "simple": "The property that changing the order of input items does not change the network's output: f(π(X)) = f(X).",
          "deeper": "A function f: 2^X → Y is permutation invariant if for any permutation matrix P, f(PX) = f(X). Proved by Zaheer et al. to equal ρ(sum φ(x_i)) for continuous set functions."
        },
        {
          "name": "Permutation Equivariance",
          "simple": "Changing the order of input items changes the output items in the exact same order: f(π(X)) = π(f(X)).",
          "deeper": "Used when outputting a prediction for each member of a set (e.g. per-element scoring). Maintained by layerwise transformations that treat each element symmetrically."
        },
        {
          "name": "Inducing Points (in Set Transformer)",
          "simple": "A small set of learned memory vectors used in attention to reduce the computational cost of set self-attention from O(N²) to O(N * M).",
          "deeper": "Set Attention Blocks (SAB) cost O(N^2). Induced Set Attention Blocks (ISAB) project N elements onto M learned inducing vectors I via attention, then project back, reducing cost to O(N M)."
        },
        {
          "name": "Intruder / Outlier Robustness",
          "simple": "How well a set aggregator handles noise or an unrelated item inserted into the set.",
          "deeper": "Mean pooling is vulnerable to outliers (O(1/N) shift). Attention pooling can assign near-zero attention weights to intruder items, preserving set code integrity."
        }
      ],
      "checkpoint": {
        "goal": "Compare Mean Pooling, Deep Sets, and Set Transformer on a synthetic set task with intruder items.",
        "steps": [
          "Create set datasets where target label depends on pairwise member relationships.",
          "Inject 10% intruder (noise) vectors into each set.",
          "Train Deep Sets vs Set Transformer.",
          "Evaluate set classification accuracy and code stability under intruder presence."
        ],
        "successLooksLike": "You can demonstrate empirically why Set Transformer's attention mechanism resists intruder corruption better than Deep Sets mean pooling."
      },
      "bridgeToNext": "Now that you can represent sets of views, Level 5 teaches Contrastive Learning — how to pull related view sets together while pushing unrelated ones apart."
    },
    "5": {
      "title": "Contrastive representation learning",
      "mission": "Master InfoNCE, SimCLR, Supervised Contrastive Learning (SupCon), Alignment & Uniformity, and VICReg.",
      "beforeYouStart": "Level 4 set representations.",
      "primer": "Welcome to Level 5. Contrastive learning is the dominant self-supervised paradigm in modern AI. The core intuition is beautifully simple:\nPULL representations of related items (Positive Pairs) CLOSER TOGETHER in vector space, and PUSH representations of unrelated items (Negative Pairs) FARTHER APART!\n\n--- STEP 1: CPC & InfoNCE Loss (van den Oord et al., 2018) ---\nWhat is InfoNCE?\nInfoNCE is a multi-class softmax loss where the network must correctly identify the single true positive key k⁺ among a minibatch of negative keys {k⁻}.\n\nFormula:\nLoss = - log [ exp( sim(q, k⁺) / τ ) / ( exp( sim(q, k⁺) / τ ) + Σ exp( sim(q, k⁻_i) / τ ) ) ]\n\nLet's unpack every symbol:\n• q: The Query representation vector.\n• k⁺: The Positive Key representation vector (e.g. another view of the same concept).\n• k⁻_i: Negative Key vectors (other unrelated samples in the batch).\n• sim(a, b): Cosine similarity (aᵀb / (||a|| ||b||)).\n• τ (Temperature): A hyperparameter scaling cosine scores. Small τ (e.g. 0.07) makes the softmax extremely peaky, forcing the network to focus heavily on hard negatives!\n\n--- STEP 2: SimCLR (Chen et al., 2020) — Practical Engineering Rules ---\nSimCLR established four critical rules for contrastive learning:\n1. Positive Definition: Positives are created by data augmentations of the same image (or prompt/view variations of the same concept).\n2. Projection Head: Maps representations through a non-linear MLP g(h) BEFORE computing InfoNCE loss. CRITICAL FINDING: The output of the projection head is used for loss computation, but DISCARDED after training! The pre-projection representation h retains much richer detail.\n3. Large Batch Size: Larger minibatches provide more negative pairs, improving geometric quality.\n\n--- STEP 3: SupCon (Khosla et al., 2020) — Multiple Positives Per Anchor ---\nStandard SimCLR has only ONE positive per anchor. But in Supervised Contrastive Learning (SupCon), ALL items sharing the same class label are treated as positives!\nSupCon averages attraction across MULTIPLE positives while repelling all other classes.\n\nSetConCA Connection: This is EXACTLY what SetConCA needs! A single semantic concept has MULTIPLE activation views. SupCon is the loss template for coordinating set views.\n\n--- STEP 4: Alignment vs Uniformity (Wang & Isola, 2020) ---\nWang & Isola proved that contrastive learning optimizes two distinct geometric properties on the unit hypersphere:\n1. Alignment: Positive pairs map to nearby points on the sphere. (E[||z - z⁺||²]).\n2. Uniformity: All representations spread out evenly across the hypersphere, preventing representation collapse. (log E[exp(-2 ||z_i - z_j||²)]).\n\n--- STEP 5: VICReg (Bardes et al., 2021) — Alignment Without Negatives ---\nWhat if you don't have negative pairs? VICReg prevents collapse using three explicit regularizers:\n• Variance (V): Forces variance of each feature dimension to stay above a threshold.\n• Invariance (I): Minimizes distance between positive view embeddings.\n• Covariance (C): Minimizes off-diagonal covariance between feature pairs, driving decorrelation.",
      "bigPictureDiagram": [
        "Anchor Vector q",
        "  ├─→ Pull toward Positive Key k⁺ (High Cosine Sim)",
        "  └─→ Push away from Negative Keys k⁻_1, k⁻_2, ... k⁻_N (Low Cosine Sim)",
        "Geometry on Hypersphere: Alignment (Positives close) + Uniformity (Spread evenly, anti-collapse)",
        "VICReg Non-Contrastive: Variance (Keep std > 1) + Invariance (Match views) + Covariance (Decorrelate features)"
      ],
      "conceptsToMaster": [
        {
          "name": "InfoNCE Loss",
          "simple": "A softmax classification loss over cosine similarities that picks out the true positive view among many negative distractors.",
          "deeper": "L_InfoNCE = -log ( exp(q·k⁺/τ) / [exp(q·k⁺/τ) + sum_i exp(q·k⁻_i/τ)] ). Lower bounds mutual information I(X;Y) <= log(K) - L_InfoNCE under density ratio assumptions."
        },
        {
          "name": "Temperature (τ)",
          "simple": "A scale factor that controls how harshly the loss punishes hard negatives.",
          "deeper": "Scales cosine similarities before softmax. Low temperature (τ < 0.1) amplifies gradients for hard negatives (negatives close to anchor), creating tight local clusters. High temperature spreads gradients uniformly."
        },
        {
          "name": "Projection Head",
          "simple": "An extra MLP layer placed after the encoder during contrastive training, then discarded when using embeddings downstream.",
          "deeper": "Prevents contrastive loss from discarding high-frequency non-invariant information needed for downstream tasks. The encoder representation h preserves details, while projection z = g(h) is invariant."
        },
        {
          "name": "Alignment and Uniformity",
          "simple": "Alignment = positive pairs are close. Uniformity = embeddings cover the entire sphere evenly without collapsing into a clump.",
          "deeper": "Alignment = E_{(x,x⁺)} [||f(x) - f(x⁺)||^2]. Uniformity = log E_{x,y ~ p} [exp(-2 ||f(x) - f(y)||^2)]. Healthy contrastive geometry requires both."
        }
      ],
      "checkpoint": {
        "goal": "Ablate temperature τ and projection head presence on an activation view dataset.",
        "steps": [
          "Implement InfoNCE loss.",
          "Vary temperature τ from 0.01 to 1.0.",
          "Train with and without a 2-layer MLP projection head.",
          "Measure Alignment score, Uniformity score, and downstream retrieval accuracy."
        ],
        "successLooksLike": "You can plot Alignment vs Uniformity and explain why training without a projection head harms downstream generalisation."
      },
      "bridgeToNext": "Now that you know how to build multi-view and contrastive models, Level 6 teaches how to MEASURE and COMPARE representations honestly without fooling yourself."
    },
    "6": {
      "title": "Measuring and comparing representations",
      "mission": "Master CKA, SVCCA, Probes with Control Tasks, and Minimum Description Length (MDL) probing.",
      "beforeYouStart": "Levels 1–5 foundational concepts.",
      "primer": "Welcome to Level 6. In AI research, self-deception is easy. A researcher trains a model, runs one evaluation, gets a 92% score, and claims 'We discovered the internal concept!'\n\nLevel 6 is your scientific reality check. You will learn what each metric ACTUALLY proves and what it CANNOT establish.\n\n--- STEP 1: CKA (Centered Kernel Alignment) — Comparing Geometries Across Models ---\nSuppose Model A has 4096 dimensions and Model B has 2048 dimensions. How do you compare if Model A and Model B represent data similarly?\n\nYou CANNOT compare neuron indices (Neuron #12 in Model A has nothing to do with Neuron #12 in Model B). You CANNOT use raw Euclidean distance because Model A might be rotated relative to Model B.\n\nHow CKA works (Kornblith et al., 2019):\n1. Take N example inputs. Pass them through Model A to get N activation vectors. Compute the N × N Gram Matrix K = X Xᵀ (pairwise similarity of examples in Model A).\n2. Pass the same N inputs through Model B to get N activation vectors. Compute Gram Matrix L = Y Yᵀ (pairwise similarity of examples in Model B).\n3. CKA measures the Hilbert-Schmidt Independence Criterion (HSIC) between centered matrices K and L!\n\nWhat CKA proves: High CKA means Model A and Model B organize example similarities similarly. CKA is invariant to orthogonal rotations.\nWhat CKA DOES NOT prove: High CKA does NOT mean the individual features or concepts inside Model A and Model B are identical!\n\n--- STEP 2: Linear Probing and Hewitt & Liang's Control Tasks ---\nWhat is a Probe?\nA probe is a simple classifier (e.g. linear logistic regression) trained on top of frozen model activations to predict a property (e.g. part-of-speech tag).\n\nThe Probe Fallacy:\nIf a linear probe achieves 98% accuracy predicting part-of-speech tags from Layer 8 activations, does that mean Layer 8 internally uses part-of-speech tags?\n\nNOT NECESSARILY! Hewitt & Liang (2019) showed that powerful probes can MEMORIZE random target labels even when the representation carries no real structure!\n\nThe Fix — Control Tasks & Selectivity:\nConstruct a Control Task by assigning random, arbitrary labels to input words (matched in output distribution to real tags). Train the probe on real tags (Real Accuracy) and on control tags (Control Accuracy).\nSelectivity = Real Accuracy - Control Accuracy.\nHigh Selectivity proves the representation itself carries structured, accessible information about the property — not just that the probe memorized!\n\n--- STEP 3: MDL Probing (Voita & Titov, 2020) — Description Length ---\nMinimum Description Length (MDL) probing measures HOW MUCH EFFORT (code length in bits) a probe requires to learn the task from the representation.\n• High Accuracy + Short Description Length = Information is neatly, efficiently organized.\n• High Accuracy + Long Description Length = Information is buried and messy; the probe worked hard to extract it.\n\nTHE METRIC TRUTH TABLE TO MEMORIZE:\n• Low Reconstruction FVU → High fidelity (preserved variance). Does NOT prove monosemantic concepts.\n• High Sparsity (L0) → Few active units. Does NOT prove individual units are pure concepts.\n• High CKA → Similar example geometry across models. Does NOT prove identical features.\n• High Probe Accuracy → Property is extractable. Does NOT prove model uses it without Control Tasks.\n• Steering Effect → Causal intervention alters output. Does NOT prove complete mechanism.",
      "bigPictureDiagram": [
        "Dataset of N Examples",
        "Model A → Activations X → N×N Gram Matrix K (Similarity of examples in A)",
        "Model B → Activations Y → N×N Gram Matrix L (Similarity of examples in B)",
        "CKA(K, L) = HSIC(K, L) / √(HSIC(K,K) HSIC(L,L))  ──[Invariant to Orthogonal Rotation]──",
        "Probing: Real Task Accuracy vs. Control Task Accuracy → Selectivity = Real - Control"
      ],
      "conceptsToMaster": [
        {
          "name": "CKA (Centered Kernel Alignment)",
          "simple": "A metric that compares whether two different neural networks organize a set of examples in the same geometric pattern, regardless of rotation or matrix size.",
          "deeper": "CKA(K,L) = HSIC(K,L) / sqrt(HSIC(K,K) HSIC(L,L)) where K = X Xᵀ and L = Y Yᵀ are centered Gram matrices. Invariant to orthogonal transformation and isotropic scaling. Measures representational similarity without needing feature alignment."
        },
        {
          "name": "Probe Selectivity",
          "simple": "The difference between probe accuracy on real labels versus probe accuracy on random control labels. High selectivity proves representation structure.",
          "deeper": "Selectivity = Accuracy(Real Task) - Accuracy(Control Task). Control task assigns pseudo-labels with identical marginal distribution. High selectivity rules out probe memorization capacity."
        },
        {
          "name": "MDL Probing (Minimum Description Length)",
          "simple": "Measuring how many bits of information a probe needs to learn a task from a representation. Shorter code length = more accessible organization.",
          "deeper": "Measures codelength L_{online}(Y|X) using online coding (prequential code). Evaluates representation quality by total description length required to transmit labels given representations."
        },
        {
          "name": "Subspace Similarity (SVCCA)",
          "simple": "Running SVD first to remove noise, then running CCA to compare shared subspaces between two models.",
          "deeper": "Truncates low-variance singular values via SVD to reduce noise dimensions, then computes canonical correlations on truncated subspace. Measures affine-invariant subspace overlap."
        }
      ],
      "checkpoint": {
        "goal": "Build a complete evaluation notebook computing CKA, Linear Probe Accuracy, Control Task Accuracy, and Selectivity on two model layers.",
        "steps": [
          "Extract activations from Layer 8 and Layer 16 of a model.",
          "Compute Linear CKA between Layer 8 and Layer 16.",
          "Train a linear probe to predict a linguistic property (Real Task).",
          "Construct a Control Task with randomized labels; train probe (Control Task).",
          "Calculate Selectivity and plot the results."
        ],
        "successLooksLike": "You can explain why a probe with 95% real accuracy and 90% control accuracy provides WEAKER evidence than a probe with 85% real accuracy and 20% control accuracy."
      },
      "bridgeToNext": "Armed with honest metrics, Levels 7–9 enter Mechanistic Interpretability — exploring transformer internals, superposition, and Sparse Autoencoders."
    },
    "7": {
      "title": "Mechanistic interpretability foundations",
      "mission": "Understand the Transformer Residual Stream, the Toy Models of Superposition hypothesis, Polysemanticity, and why Sparse Autoencoders (SAEs) exist.",
      "beforeYouStart": "Level 1–2 sparse dictionaries and Level 6 evaluation hygiene.",
      "primer": "Welcome to Level 7. We now enter Mechanistic Interpretability — opening the black box of Transformer language models to understand their exact internal mechanisms.\n\n--- STEP 1: The Residual Stream — The Central Communication Bus ---\nIn a Transformer architecture (Elhage et al., 2021), think of the Residual Stream as a central conveyor belt (communication bus) running through the entire model from Layer 1 to Layer L.\n\nEvery Attention block and MLP block reads from the residual stream, performs computation, and WRITES ITS RESULT BACK by adding it to the residual stream:\nx_{l+1} = x_l + Attention(x_l) + MLP(x_l)\n\nBecause updates are added linearly, features written by early layers can travel directly to deep layers unimpeded!\n\n--- STEP 2: The Superposition Hypothesis (Elhage et al., Anthropic 2022) ---\nHere is the central paradox of neural networks:\nA model with d_model = 4096 dimensions can represent TENS OF THOUSANDS of distinct concepts. How is this mathematically possible?\n\nThe Superposition Hypothesis:\nWhen concepts are SPARSE (only active occasionally), a network can pack MORE features than dimensions by embedding features as ALMOST-ORTHOGONAL directions in space!\n\nThe Interference Cost:\nBecause the feature directions are not strictly 90° orthogonal, activating Feature A creates a small non-zero projection onto Feature B. We call this INTERFERENCE (crosstalk). When features are sparse, interference happens rarely enough that non-linearities (like ReLU) can wipe out the small interference noise!\n\n--- STEP 3: Polysemantic Neurons — Why Reading Single Neurons Fails ---\nBecause features are packed into almost-orthogonal directions in superposition, individual basis neurons in the network get aligned with COMBINATIONS of multiple features!\nA single neuron might fire for 'academic citation markers' AND 'photos of anime characters' AND 'Arabic verbs'. This is called a POLYSEMANTIC NEURON.\n\nReading individual neurons is a dead end. Concepts live along FEATURE DIRECTIONS, not along individual neuron axes!\n\n--- STEP 4: Enter Sparse Autoencoders (SAEs) — Finding an Overcomplete Basis ---\nIn 'Toy Models of Superposition' (2022), Anthropic listed 'Approach 2: Find an Overcomplete Basis after training'. This is EXACTLY what a Sparse Autoencoder (SAE) is!\n\nAn SAE takes superposed activations x from the residual stream, projects them into a high-dimensional overcomplete sparse dictionary z = TopK(W_enc x + b_enc), and reconstructs x_hat = W_dec z + b_dec.\n\nBy enforcing high overcompleteness (e.g. 16x width) and strict sparsity, the SAE unfolds superposed directions into clean, MONOSEMANTIC dictionary features!",
      "bigPictureDiagram": [
        "Residual Stream (d_model dimensions) ──[Carries superposed features]──",
        "Superposition: N sparse features (N > d_model) packed as almost-orthogonal vectors",
        "Result on Basis Neurons: Polysemanticity (1 neuron = mashup of 3 unrelated concepts)",
        "SAE Solution: Overcomplete Encoder → Sparse Bottleneck (z) → Unfolds monosemantic feature directions"
      ],
      "conceptsToMaster": [
        {
          "name": "Residual Stream",
          "simple": "The main vector pathway running through a Transformer that layers read from and write updates into via linear addition.",
          "deeper": "x_{l+1} = x_l + f_l(x_l). Acts as a linear communication bus. Allows linear paths through the network where components write feature vectors directly to downstream layers."
        },
        {
          "name": "Superposition",
          "simple": "Packing more sparse features than available dimensions into a vector space by placing feature directions at slight non-orthogonal angles.",
          "deeper": "Representing M features in d dimensions (M > d). Enabled by feature sparsity and non-linearities. Features form geometric polytopes (e.g. Thomson problem configurations) to minimize cross-feature interference."
        },
        {
          "name": "Polysemanticity",
          "simple": "When a single neuron lights up for multiple totally unrelated concepts because superposition packed those concepts together.",
          "deeper": "Occurs when feature directions are not aligned with standard basis vectors. A neuron coordinate x_i = e_i^T (sum c_j v_j) receives projections from multiple concept directions v_j."
        },
        {
          "name": "Monosemantic Feature",
          "simple": "A feature direction that fires for ONE clear, consistent semantic concept across all contexts.",
          "deeper": "A direction v in activation space corresponding to a single conceptual variable. SAEs attempt to isolate monosemantic directions by finding an overcomplete sparse basis."
        }
      ],
      "checkpoint": {
        "goal": "Write a mechanistic interpretation breakdown linking superposition theory to residual stream activations.",
        "steps": [
          "Estimate the activation sparsity regime of a chosen layer.",
          "Identify polysemantic neurons by inspecting top-activating token contexts.",
          "State why a standard pointwise SAE acts as Approach 2 for unfolding superposition."
        ],
        "successLooksLike": "You can explain clearly why neuron-level interpretability fails under superposition and why SAE overcomplete dictionaries are required."
      },
      "bridgeToNext": "Now that you know why SAEs are needed, Level 8 compares Modern SAE Architectures (TopK, Gated, JumpReLU, BatchTopK, Matryoshka) on fair Pareto frontiers."
    },
    "8": {
      "title": "Modern SAE architectures",
      "mission": "Compare modern SAE architectures: L1, TopK, Gated, JumpReLU, BatchTopK, and Matryoshka SAEs. Master fair evaluation on Pareto frontiers.",
      "beforeYouStart": "Level 7 SAE motivation.",
      "primer": "Welcome to Level 8. Once researchers realized Sparse Autoencoders could unpack superposed features, an architectural arms race began.\n\nDifferent architectures enforce sparsity differently and handle feature magnitudes differently. In this level, we compare the six major SAE architecture families.\n\n--- 1. L1 SAE (Bricken et al., 2023; Cunningham et al., 2023) ---\n• Encoder: z = ReLU(W_enc x + b_enc)\n• Loss: ||x - x_hat||² + λ ||z||₁\n• Pros: Simple, classic baseline.\n• Cons: Severe L1 magnitude shrinkage (under-estimates feature strength) and dead feature problems.\n\n--- 2. TopK SAE (Gao et al., OpenAI 2024) ---\n• Encoder: z = TopK(W_enc x + b_enc, k)\n• Loss: Pure reconstruction loss ||x - x_hat||²\n• Pros: Enforces exact sparsity k per token with ZERO magnitude shrinkage! Superior Pareto frontier.\n• Cons: Hard threshold can create optimization step-function challenges.\n\n--- 3. Gated SAE (Rajamanoharan et al., DeepMind 2024) ---\n• Mechanism: Separates the gating decision (is feature active?) from magnitude calculation.\n• Gate: π = Heaviside(W_gate x + b_gate)\n• Magnitude: m = ReLU(W_mag x + b_mag)\n• Output: z = π ⊙ m\n• Pros: Eliminates L1 shrinkage while remaining fully differentiable.\n\n--- 4. JumpReLU SAE (Rajamanoharan et al., 2024) ---\n• Encoder: z = x * H(x - θ) where H is Heaviside step and θ is a learned threshold per feature.\n• Pros: Direct L0-style optimization with learned feature-specific thresholds.\n\n--- 5. BatchTopK SAE (Bussmann & Leask, 2024) ---\n• Mechanism: Instead of fixing exactly k active features for EVERY token, BatchTopK enforces a global sparsity budget across an ENTIRE MINIBATCH.\n• Advantage: Difficult tokens (complex text) get to activate 50 features, while simple tokens (punctuation) activate only 5 features!\n\n--- 6. Matryoshka SAE (Bussmann et al., 2025) ---\n• Mechanism: Nested multi-level dictionaries. Features are ordered such that the first 500 features form a coarse dictionary, the first 2000 form a medium dictionary, and all 8000 form a fine-grained dictionary!\n• Advantage: Provides multi-granularity concept representations inside a single trained model.\n\nRULE OF FAIR COMPARISON — THE PARETO FRONTIER:\nNEVER compare two SAE architectures at arbitrary single hyperparameter points! Always plot the Reconstruction vs. Sparsity Pareto Curve (FVU vs. L0). Method A is superior to Method B ONLY if Method A's curve lies strictly below Method B's curve across matched operating points.",
      "bigPictureDiagram": [
        "L1 SAE: ReLU pre-activations + L1 penalty (Shrinkage flaw)",
        "TopK SAE: Keep top-k values, zero rest (Exact sparsity, no shrinkage)",
        "Gated SAE: Separate Gate Pathway π ⊙ Magnitude Pathway m (Differentiable, no shrinkage)",
        "JumpReLU: Learned feature threshold θ_i (Direct L0 proxy)",
        "BatchTopK: TopK applied across full minibatch (Flexible token budgets)",
        "Matryoshka: Nested feature prefixes [Coarse | Medium | Fine] (Multi-scale concepts)"
      ],
      "conceptsToMaster": [
        {
          "name": "TopK SAE",
          "simple": "An SAE that keeps exactly the k largest feature activations per token and zeroes the rest, avoiding L1 magnitude shrinkage.",
          "deeper": "z = TopK(W_enc(x - b_dec) + b_enc, k). Loss is pure MSE. Eliminates shrinkage because non-zero activations carry unpenalized encoder magnitudes."
        },
        {
          "name": "Gated SAE",
          "simple": "An SAE that uses one neural path to decide IF a feature turns on, and a separate path to measure HOW STRONGLY it fires.",
          "deeper": "Uses dual encoder pathways: gating net produces binary mask π via thresholding, magnitude net produces positive magnitude m. z = π ⊙ m. Resolves shrinkage while maintaining smooth gradient flow."
        },
        {
          "name": "Expansion Factor",
          "simple": "The ratio of dictionary width to activation dimension (e.g. 16x expansion = 65,536 features for a 4,096-dim model).",
          "deeper": "Expansion ratio r = d_sae / d_model. Higher expansion reduces feature merging and absorption, but increases compute and memory footprint."
        },
        {
          "name": "Pareto Frontier (FVU vs L0)",
          "simple": "A graph plotting reconstruction error against sparsity. Fair comparisons compare architectures at the exact same sparsity level.",
          "deeper": "Plots Fraction of Variance Unexplained (FVU) on y-axis against L0 (average active features) on x-axis. Evaluates architectural efficiency across all operational regimes."
        }
      ],
      "checkpoint": {
        "goal": "Train L1, TopK, and Gated SAE variants on activation data; plot their FVU vs L0 Pareto curves.",
        "steps": [
          "Sweep L1 penalty λ to generate L1 Pareto curve.",
          "Sweep TopK parameter k to generate TopK Pareto curve.",
          "Plot both curves on the same FVU vs L0 axes.",
          "Verify at matched L0 = 20 which architecture achieves lower FVU."
        ],
        "successLooksLike": "You can demonstrate on a clean Pareto graph why TopK and Gated SAEs outperform vanilla L1 SAEs."
      },
      "bridgeToNext": "Now that you know modern architectures, Level 9 explores SAE Evaluation & Failure Modes: Feature Absorption, Feature Splitting, and Non-Canonical Units."
    },
    "9": {
      "title": "SAE evaluation and failure modes",
      "mission": "Master SAE failure modes (Absorption, Splitting, Non-canonicality) and understand the SAEBench evaluation suite.",
      "beforeYouStart": "Levels 6–8 evaluation metrics and architectures.",
      "primer": "Welcome to Level 9. Having built modern SAEs, we now confront their deepest empirical failure modes.\n\nA common naive belief is: 'One SAE feature = One true atomic concept in the world.' Level 9 proves why this assumption is flawed.\n\n--- FAILURE MODE 1: Feature Splitting (Chanin et al., 2024) ---\nWhat is Feature Splitting?\nAs you increase dictionary width (e.g. from 4x to 32x expansion), a single broad concept (e.g. 'Medical text') SPLITS into dozens of hyper-specific sub-features ('Pediatric medicine', 'Medical insurance claims', 'Surgical procedures').\n\nThe Problem: Feature splitting means concepts exist at multiple granularities simultaneously, making it hard to define what an 'atomic' feature is.\n\n--- FAILURE MODE 2: Feature Absorption (Chanin et al., 2024) ---\nWhat is Feature Absorption?\nFeature Absorption is the inverse of splitting: a single dominant SAE feature 'swallows' or absorbs related specific sub-concepts!\nExample: Instead of having separate features for 'Golden Retriever' and 'Poodle', a single 'Dog' feature activates for both, absorbing the specific identity.\n\nWhy it happens: Narrow dictionaries or high sparsity penalties force the model to merge correlated concepts into single shared latents.\n\n--- FAILURE MODE 3: Non-Canonical Units (Leask et al., 2025) ---\nSuppose you train two SAEs (SAE A and SAE B) on the EXACT SAME model layer with identical hyperparameters, but using different random seeds.\n\nBoth SAE A and SAE B achieve identical low reconstruction error (FVU = 0.03) and identical sparsity (L0 = 25).\nDo SAE A and SAE B discover the same features?\n\nNO! Leask et al. proved that SAE A and SAE B discover DIFFERENT feature bases! There is no single 'canonical' sparse basis in activation space. Multiple distinct dictionary decompositions achieve equal quality.\n\n--- THE SAEBENCH SUITE (Karvonen et al., 2025) & METRIC RELIABILITY ---\nTo evaluate SAEs rigorously, Karvonen et al. introduced SAEBench, covering five evaluation families:\n1. Reconstruction & Fidelity: FVU, CE loss recovery.\n2. Sparsity & Efficiency: L0, L1, dead feature rate.\n3. Feature Interpretability: Automated explanations, monosemanticity scores.\n4. Downstream Probing: Sparse probing performance on target concepts.\n5. Steering & Interventions: Causal effect of feature clamping on output behavior.\n\nAuditing Reliability (Chanin, 2026):\nAlways report seed variance! Single-run leaderboard scores are unreliable due to random initialization noise.",
      "bigPictureDiagram": [
        "Ideal Assumption: 1 SAE Feature = 1 Atomic Ground-Truth Concept",
        "Reality Failure 1 (Splitting): Concept 'Dog' splits into 50 hyper-specific sub-features as width expands",
        "Reality Failure 2 (Absorption): Feature 'Animal' absorbs 'Dog', 'Cat', and 'Horse' into 1 latent",
        "Reality Failure 3 (Non-Canonical): Seed A and Seed B find completely different valid feature dictionaries",
        "SAEBench Solution: Evaluate across 5 families (Reconstruction, Sparsity, Interpretation, Probing, Steering)"
      ],
      "conceptsToMaster": [
        {
          "name": "Feature Splitting",
          "simple": "When a broad concept breaks into multiple narrower sub-features as dictionary size grows.",
          "deeper": "As dictionary width d_sae increases, coarse feature directions decompose into finer sub-directions. Illustrates that feature granularity is a function of dictionary capacity."
        },
        {
          "name": "Feature Absorption",
          "simple": "When one high-level feature swallows up specific sub-concepts because the dictionary is too small or too sparse.",
          "deeper": "Occurs when a parent feature vector v_parent absorbs child feature vectors v_child, firing whenever any child concept is present. Reduces feature specificity."
        },
        {
          "name": "Non-Canonical Units",
          "simple": "The discovery that different random seeds yield different interpretable dictionaries of equal quality, proving there is no single 'true' feature basis.",
          "deeper": "Proves non-uniqueness of sparse dictionary solutions. Multiple overcomplete frame representations span activation space with equivalent L0 and MSE, challenging naive realism in interpretability."
        },
        {
          "name": "SAEBench",
          "simple": "A standardized benchmark suite evaluating SAEs across reconstruction, sparsity, probing, steering, and interpretability.",
          "deeper": "Comprehensive evaluation framework combining loss recovery, L0 efficiency, SCR (sparse probing accuracy), feature absorption metrics, and intervention causal effects."
        }
      ],
      "checkpoint": {
        "goal": "Design a complete SAE evaluation protocol incorporating SAEBench families and document metric non-claims.",
        "steps": [
          "List evaluation metrics across 5 families.",
          "For each metric, write down explicitly what it proves and what it CANNOT establish.",
          "Incorporate seed-variance checks for non-canonicality testing."
        ],
        "successLooksLike": "You can produce an evaluation protocol that rejects any research claim based on FVU or single-seed results alone."
      },
      "bridgeToNext": "With all foundations built, Level 10 reaches the SetConCA Research Frontier — combining multi-view set coordination with sparse dictionaries."
    },
    "10": {
      "title": "Papers closest to SetConCA research",
      "mission": "Master Temporal SAEs, Concept Component Analysis (ConCA), and Multi-View Causal Identifiability. Formulate actionable research hypotheses for SetConCA.",
      "beforeYouStart": "All previous Levels (1–9).",
      "primer": "Welcome to Level 10 — the capstone level of your mastery path. Here we study the three papers closest to SetConCA and state our core research hypotheses.\n\n--- STEP 1: Temporal Sparse Autoencoders (Bhalla et al., 2025) ---\nWhat did Temporal SAEs do?\nStandard SAEs treat every token activation in isolation. But language has natural sequential structure: adjacent tokens (token t and token t+1) often share semantic context!\n\nTemporal SAEs add a CONTRASTIVE REGULARIZATION loss between the sparse codes of adjacent tokens:\nLoss = Reconstruction + λ_sparse * Sparsity + λ_temp * Contrastive_Loss(z_t, z_{t+1})\n\nResult: Coordinates feature activations over time, improving feature consistency.\n\nTHE SETCONCA GENERALIZATION:\nTemporal SAEs coordinate adjacent tokens in time. SetConCA generalizes this idea from temporal pairs to MULTI-VIEW SETS of the exact same semantic object across different contexts, prompts, or layers!\n\n--- STEP 2: Concept Component Analysis / ConCA (Liu et al., 2026) ---\nConCA proposes a generative linear unmixing model for concepts (closer in spirit to Level 1 ICA than standard autoencoders):\nx = Σ c_i v_i + noise\n\nConCA derives identifiability conditions under log-posterior representation assumptions, offering a principled theoretical rival/complement to dictionary learning.\n\n--- STEP 3: Multi-View Causal Representation Learning (Yao et al., 2023) ---\nYao et al. provide mathematical identifiability proofs showing WHEN multi-view observations permit exact latent factor recovery under partial observability.\n\nTHE CENTRAL RESEARCH QUESTION OF SETCONCA:\nUnder what mathematical assumptions does multi-view set supervision cause a sparse dictionary to recover more stable, complete, specific, or causally useful concepts than a pointwise SAE?\n\nYOUR THREE SETCONCA HYPOTHESES TO TEST:\n1. Multi-View Set Coordination reduces Feature Absorption by disambiguating co-occurring concepts across views.\n2. Contrastive Set Losses increase cross-seed Feature Canonicality (dictionary stitching agreement).\n3. Set-aggregated concept codes achieve higher Probe Selectivity and Steering Causality than single-token SAE latents.",
      "bigPictureDiagram": [
        "Temporal SAE (Bhalla '25): Coordinates adjacent tokens in time z_t ↔ z_{t+1}",
        "SetConCA (Your Project): Coordinates MULTI-VIEW SETS of same concept {x_v1, x_v2, x_v3} ──[Set Aggregator]──→ Sparse Code z",
        "ConCA (Liu '26): Generative linear unmixing with identifiability proofs (ICA-lineage)",
        "MV-Causal (Yao '23): Formal proofs of latent recovery from partial multi-view observations"
      ],
      "conceptsToMaster": [
        {
          "name": "Multi-View Set Coordination",
          "simple": "Using multiple views of the same concept as a positive set to train sparse autoencoder feature dictionaries.",
          "deeper": "Extending single-view SAE objectives by adding set-based contrastive loss L_set(Z_views) = InfoNCE(Set_Pool(Z_pos), Set_Pool(Z_neg)). Enforces representational consistency across semantic view transformations."
        },
        {
          "name": "Identifiability under Partial Observability",
          "simple": "Mathematical proof showing when latent concept variables can be uniquely recovered if you observe multiple partial views.",
          "deeper": "Proves that under non-Gaussianity and multi-view conditional independence assumptions, the latent factor vector z is identifiable up to component-wise invertible transformations."
        },
        {
          "name": "SetConCA Core Thesis",
          "simple": "Combining sparse dictionaries + multi-view alignment + set aggregators + contrastive coordination yields cleaner concepts than pointwise SAEs.",
          "deeper": "Hypothesizes that multi-view set supervision resolves non-canonicality and feature absorption by enforcing latent invariance across view transforms while maintaining overcomplete dictionary sparsity."
        }
      ],
      "checkpoint": {
        "goal": "Write three formal research hypotheses for SetConCA naming Level 6 metrics and Level 9 failure modes.",
        "steps": [
          "Hypothesis 1: Target a specific failure mode (Absorption or Splitting).",
          "Hypothesis 2: Target dictionary stability across seeds (Canonicality / CKA).",
          "Hypothesis 3: Target causal intervention performance (Steering / Probing Selectivity)."
        ],
        "successLooksLike": "You can state three precise, falsifiable experimental hypotheses ready for implementation and testing."
      },
      "bridgeToNext": "Congratulations! You have completed the entire SetConCA Mastery Curriculum. You are ready to build, execute, and publish SetConCA research."
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
            "whyWeRead": "PCA is the default linear baseline for vector compression and reconstruction. You need it to understand Fraction of Variance Unexplained (FVU) and why good reconstruction is NOT interpretability.",
            "oneSentence": "A classic tutorial deriving PCA from variance maximization, covariance matrices, eigenvectors, and Singular Value Decomposition (SVD).",
            "plainLanguage": "Welcome to the PCA Masterclass. Let's start from absolute zero: why did Karl Pearson invent PCA in 1901, and why does every AI researcher still use it today?\n\nImagine you have data points in a 100-dimensional space. Humans cannot visualize 100 dimensions. If you want to compress this data down to 2 dimensions so you can plot it on a screen, how do you choose the 2 dimensions?\n\nIf you randomly pick 2 coordinates, you might project a long, stretched cloud into a tiny flat dot, losing almost all the information! PCA solves this by finding the exact directions in space along which your data SPREADS OUT THE MOST (maximum variance).\n\n--- STEP-BY-STEP MATHEMATICAL BUILD-UP ---\n1. Mean (μ): The average position of all data points. We center the data by subtracting μ so the cloud is centered at zero.\n2. Variance: For a single coordinate x, variance is E[(x - μ)²]. It measures how far data points spread out around zero.\n3. Covariance: For two coordinates x and y, covariance is E[(x - μ_x)(y - μ_y)]. If x and y increase together, covariance is positive. If x increases when y decreases, it is negative.\n4. Covariance Matrix (C): A grid storing all pairwise covariances. The diagonal entries are the variances of each coordinate.\n5. Eigenvectors & Eigenvalues: An eigenvector of C is a special arrow in space that DOES NOT TILT when multiplied by C — it only gets stretched! The stretch factor is the Eigenvalue λ.\n6. Singular Value Decomposition (SVD): Numerical computing prefers SVD (X = U Σ Vᵀ) over computing C directly. The columns of V are the exact Principal Component directions!\n\n--- THE CRITICAL RECONSTRUCTION METRIC: FVU ---\nFraction of Variance Unexplained (FVU) = ||X - X_reconstructed||² / ||X||².\nIf you keep top-k principal components, FVU measures what percentage of the data's spread you lost. FVU = 0 means perfect reconstruction.\n\n--- THE SCIENTIFIC WARNING FOR SAE RESEARCHERS ---\nPCA axes are strictly ORTHOGONAL (at 90° right angles to each other). Orthogonality is a mathematical constraint, NOT a human concept guarantee! PCA directions are linear combinations of features created by linear algebra. Never assume low FVU means you found human concepts.",
            "priorWork": "HISTORICAL LITERATURE REVIEW & CONTEXT:\nKarl Pearson (1901) introduced PCA as an analogue to the principal axis theorem in classical mechanics. Harold Hotelling (1933) independently expanded PCA to random variables. Before PCA, data reduction relied on manual variable selection or arbitrary coordinate truncation. Shlens (2014) synthesized decades of linear algebra literature into a unified tutorial connecting variance maximization, mean-squared error minimization, and Singular Value Decomposition (SVD).\n\nRESEARCH GAP ADDRESSED:\nProvides a rigorous linear algebra derivation bridging raw data matrices, empirical covariance estimation, diagonalisation, and SVD numerical computation without hand-waving.",
            "paperArchitecture": "MATHEMATICAL MECHANISM & STEP-BY-STEP ALGORITHM:\n1. Centering: Given data matrix X (N samples × d features), compute sample mean vector μ = (1/N) Σ x_i and subtract: X_centered = X - 1 μᵀ.\n2. Empirical Covariance: Compute C = (1/(N-1)) X_centeredᵀ X_centered. C is a d × d symmetric positive semi-definite matrix.\n3. Diagonalization: Solve C v_i = λ_i v_i subject to v_iᵀ v_j = δ_ij. Eigenvalues λ_1 ≥ λ_2 ≥ ... ≥ λ_d quantify variance along orthogonal eigenvectors v_i.\n4. Singular Value Decomposition (SVD): Compute X_centered = U Σ Vᵀ. Columns of V are exact principal directions v_i; singular values σ_i relate to eigenvalues via λ_i = σ_i² / (N-1).\n5. Projection & Reconstruction: Compress to rank-k via Z = X_centered V_k. Reconstruct X_hat = Z V_kᵀ + μ.",
            "experimentalSetup": "EMPIRICAL EVALUATION & PROOF LANDMARKS:\n• Mathematical Proof: Eckart–Young–Mirsky Theorem proves rank-k SVD truncation minimizes Frobenius norm reconstruction error ||X - X_hat||_F² over all rank-k matrices.\n• Baseline Metric: Establishes Fraction of Variance Unexplained (FVU) = 1 - (Σ_{i≤k} λ_i / Σ_all λ_i) as the universal benchmark for linear representation preservation.",
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
                "name": "PCA Optimization Objective",
                "formula": "max_u uᵀ C u   s.t. ||u|| = 1",
                "original": "PCA Optimization Objective: max_u uᵀ C u   s.t. ||u|| = 1",
                "simple": "Find unit direction u that maximizes projected variance, where C is the covariance matrix.",
                "meaning": "Find unit direction u that maximizes projected variance, where C is the covariance matrix."
              },
              {
                "name": "Singular Value Decomposition (SVD)",
                "formula": "X = U Σ Vᵀ",
                "original": "Singular Value Decomposition (SVD): X = U Σ Vᵀ",
                "simple": "Decomposes data X into left singular vectors U, singular values Σ, and right singular vectors V (principal directions).",
                "meaning": "Decomposes data X into left singular vectors U, singular values Σ, and right singular vectors V (principal directions)."
              },
              {
                "name": "Fraction of Variance Unexplained (FVU)",
                "formula": "FVU = 1 - (Σ_{i≤k} λ_i) / (Σ_{all} λ_i)",
                "original": "Fraction of Variance Unexplained (FVU): FVU = 1 - (Σ_{i≤k} λ_i) / (Σ_{all} λ_i)",
                "simple": "Ratio of leftover variance to total variance after keeping k components.",
                "meaning": "Ratio of leftover variance to total variance after keeping k components."
              }
            ],
            "vocabulary": [
              {
                "term": "Principal Component",
                "original": "Technical term: «Principal Component» as used in this literature.",
                "simple": "An orthogonal direction in vector space along which data variance is maximized.",
                "def": "An orthogonal direction in vector space along which data variance is maximized."
              },
              {
                "term": "Covariance Matrix",
                "original": "Technical term: «Covariance Matrix» as used in this literature.",
                "simple": "A square matrix containing pairwise covariances between all feature dimensions.",
                "def": "A square matrix containing pairwise covariances between all feature dimensions."
              },
              {
                "term": "FVU",
                "original": "Technical term: «FVU» as used in this literature.",
                "simple": "Fraction of Variance Unexplained; normalized reconstruction error.",
                "def": "Fraction of Variance Unexplained; normalized reconstruction error."
              },
              {
                "term": "Low-Rank Approximation",
                "original": "Technical term: «Low-Rank Approximation» as used in this literature.",
                "simple": "Approximating a high-dimensional matrix using a small number of basis vectors.",
                "def": "Approximating a high-dimensional matrix using a small number of basis vectors."
              }
            ],
            "whatItShows": [
              "How to compress high-dimensional vectors by preserving maximum variance",
              "How to compute linear reconstruction fidelity using FVU"
            ],
            "whatItDoesNotShow": [
              "That principal components correspond to human-interpretable concepts",
              "How to unmix independent non-orthogonal sources",
              "How to align two different observation views"
            ],
            "setconcaUse": [
              "Use PCA as a mandatory baseline when evaluating SAE reconstruction (FVU).",
              "Never claim interpretability from low FVU alone.",
              "Compare SAE dictionary efficiency against PCA at matched rank."
            ],
            "masteryChecklist": [
              "I can derive PCA as variance maximization under orthogonality constraints.",
              "I can calculate and interpret FVU.",
              "I can explain why orthogonal principal components are rarely pure human concepts.",
              "I know how to use PCA as an SAE reconstruction baseline."
            ],
            "commonConfusions": [
              {
                "wrong": "Good PCA reconstruction means we found interpretable features.",
                "right": "It only means variance was preserved. Orthogonal axes are math artifacts, not concepts."
              },
              {
                "wrong": "PCA finds independent sources.",
                "right": "PCA only decorrelates (zero covariance). ICA is required for statistical independence."
              }
            ],
            "quiz": [
              {
                "q": "PCA maximizes which metric along orthogonal axes?",
                "options": [
                  "Variance",
                  "Statistical independence",
                  "Cross-view correlation",
                  "L0 sparsity"
                ],
                "a": 0,
                "explain": "PCA maximizes captured variance under orthogonality constraints."
              },
              {
                "q": "What does FVU measure?",
                "options": [
                  "Fraction of variance left unexplained by reconstruction",
                  "Monosemanticity score",
                  "Causal intervention effect",
                  "Probe accuracy"
                ],
                "a": 0,
                "explain": "FVU = 1 - explained variance fraction."
              },
              {
                "q": "Are orthogonal principal components guaranteed to be clean human concepts?",
                "options": [
                  "No",
                  "Yes"
                ],
                "a": 0,
                "explain": "Orthogonality is a mathematical convenience, not a semantic guarantee."
              }
            ],
            "originalIdea": "A classic tutorial deriving PCA from variance maximization, covariance matrices, eigenvectors, and Singular Value Decomposition (SVD).",
            "simpleLesson": "Welcome to the PCA Masterclass. Let's start from absolute zero: why did Karl Pearson invent PCA in 1901, and why does every AI researcher still use it today?\n\nImagine you have data points in a 100-dimensional space. Humans cannot visualize 100 dimensions. If you want to compress this data down to 2 dimensions so you can plot it on a screen, how do you choose the 2 dimensions?\n\nIf you randomly pick 2 coordinates, you might project a long, stretched cloud into a tiny flat dot, losing almost all the information! PCA solves this by finding the exact directions in space along which your data SPREADS OUT THE MOST (maximum variance).\n\n--- STEP-BY-STEP MATHEMATICAL BUILD-UP ---\n1. Mean (μ): The average position of all data points. We center the data by subtracting μ so the cloud is centered at zero.\n2. Variance: For a single coordinate x, variance is E[(x - μ)²]. It measures how far data points spread out around zero.\n3. Covariance: For two coordinates x and y, covariance is E[(x - μ_x)(y - μ_y)]. If x and y increase together, covariance is positive. If x increases when y decreases, it is negative.\n4. Covariance Matrix (C): A grid storing all pairwise covariances. The diagonal entries are the variances of each coordinate.\n5. Eigenvectors & Eigenvalues: An eigenvector of C is a special arrow in space that DOES NOT TILT when multiplied by C — it only gets stretched! The stretch factor is the Eigenvalue λ.\n6. Singular Value Decomposition (SVD): Numerical computing prefers SVD (X = U Σ Vᵀ) over computing C directly. The columns of V are the exact Principal Component directions!\n\n--- THE CRITICAL RECONSTRUCTION METRIC: FVU ---\nFraction of Variance Unexplained (FVU) = ||X - X_reconstructed||² / ||X||².\nIf you keep top-k principal components, FVU measures what percentage of the data's spread you lost. FVU = 0 means perfect reconstruction.\n\n--- THE SCIENTIFIC WARNING FOR SAE RESEARCHERS ---\nPCA axes are strictly ORTHOGONAL (at 90° right angles to each other). Orthogonality is a mathematical constraint, NOT a human concept guarantee! PCA directions are linear combinations of features created by linear algebra. Never assume low FVU means you found human concepts.",
            "limitPairs": [
              {
                "original": "How to compress high-dimensional vectors by preserving maximum variance",
                "simple": "In practice this means evidence supports: How to compress high-dimensional vectors by preserving maximum variance"
              },
              {
                "original": "How to compute linear reconstruction fidelity using FVU",
                "simple": "In practice this means evidence supports: How to compute linear reconstruction fidelity using FVU"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That principal components correspond to human-interpretable concepts",
                "simple": "Do not overclaim: That principal components correspond to human-interpretable concepts"
              },
              {
                "original": "How to unmix independent non-orthogonal sources",
                "simple": "Do not overclaim: How to unmix independent non-orthogonal sources"
              },
              {
                "original": "How to align two different observation views",
                "simple": "Do not overclaim: How to align two different observation views"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Use PCA as a mandatory baseline when evaluating SAE reconstruction (FVU).",
                "simple": "Action item: Use PCA as a mandatory baseline when evaluating SAE reconstruction (FVU)."
              },
              {
                "original": "Never claim interpretability from low FVU alone.",
                "simple": "Action item: Never claim interpretability from low FVU alone."
              },
              {
                "original": "Compare SAE dictionary efficiency against PCA at matched rank.",
                "simple": "Action item: Compare SAE dictionary efficiency against PCA at matched rank."
              }
            ]
          },
          "quiz": [
            {
              "q": "PCA maximizes which metric along orthogonal axes?",
              "options": [
                "Variance",
                "Statistical independence",
                "Cross-view correlation",
                "L0 sparsity"
              ],
              "a": 0,
              "explain": "PCA maximizes captured variance under orthogonality constraints."
            },
            {
              "q": "What does FVU measure?",
              "options": [
                "Fraction of variance left unexplained by reconstruction",
                "Monosemanticity score",
                "Causal intervention effect",
                "Probe accuracy"
              ],
              "a": 0,
              "explain": "FVU = 1 - explained variance fraction."
            },
            {
              "q": "Are orthogonal principal components guaranteed to be clean human concepts?",
              "options": [
                "No",
                "Yes"
              ],
              "a": 0,
              "explain": "Orthogonality is a mathematical convenience, not a semantic guarantee."
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
            "whyWeRead": "ICA is the classical source-unmixing framework. It is the direct conceptual ancestor of Concept Component Analysis (ConCA) and independence-style representation unmixing.",
            "oneSentence": "A linear-algebra tutorial on recovering statistically independent source signals from linear mixtures.",
            "plainLanguage": "Welcome to the ICA Masterclass. Let's build the intuition, the low-level math, and the underlying meaning from absolute zero.\n\n--- LAYER 1: EVERYDAY INTUITION & THE COCKTAIL PARTY PROBLEM ---\nImagine two people talking at the exact same time in a room. You place two microphones at different locations. Microphone 1 picks up: x_1 = 0.70 * Voice_A + 0.30 * Voice_B.\nMicrophone 2 picks up: x_2 = 0.40 * Voice_A + 0.60 * Voice_B.\nHow do you extract the pure Voice_A and Voice_B without knowing who spoke or where the mics were?\n\nPCA FAILS HERE: PCA looks for orthogonal (90°) directions of maximum volume. But Voice_A and Voice_B are NOT orthogonal in microphone space! PCA just finds the loudest combined direction, giving you a noisy mix of both voices.\n\n--- LAYER 2: THE CENTRAL LIMIT THEOREM & THE DICE-ROLL ANALOGY ---\nWhy does ICA work? It uses a fundamental law of probability: The Central Limit Theorem (CLT).\n• Single Pure Signal: Imagine rolling ONE 6-sided die. The numbers {1, 2, 3, 4, 5, 6} each have probability 1/6. The histogram is completely FLAT (a uniform rectangle, 0% bell-curve shape).\n• Mixed Signal: Now roll TEN dice and sum their values. Getting all 1s (sum=10) or all 6s (sum=60) is almost impossible (probability ~1.65×10⁻⁸). But getting sums near 35 is extremely common! The histogram of the sum turns into a smooth, bell-shaped GAUSSIAN curve!\n\nTHE ICA INSIGHT: Adding/mixing independent signals ALWAYS makes their combined distribution MORE Gaussian (bell-shaped) than the pure original signals! Therefore, mixed signals are always bell-shaped, while pure independent signals are non-Gaussian!\n\nHOW ICA UNMIXES: ICA searches for an unmixing matrix W such that the outputs y = W x have histograms that are as NON-GAUSSIAN as possible! By turning the rotation dial to maximize non-Gaussianity, ICA pops the pure independent sources back out!\n\n--- LAYER 3: WHY GAUSSIANS CANNOT BE UNMIXED (ROTATIONAL SYMMETRY) ---\nWhy does ICA require sources to be non-Gaussian? A 2D Gaussian probability density p(s_1, s_2) = (1 / 2π) * exp(-(s_1² + s_2²)/2) is a perfect circular blob. If you rotate a circle by any angle θ, it stays 100% identical! There is no unique direction. Non-Gaussian distributions (like a square, cross, or sparse spike) are NOT rotationally symmetric. There is exactly ONE angle where the independent axes line up!\n\n--- LAYER 4: EXACT MATHEMATICAL MEASURES (KURTOSIS & NEGENTROPY) ---\n1. Kurtosis: Kurt(y) = E[y⁴] - 3(E[y²])². Measures 4th-order tail weight. For a Gaussian variable, Kurt(y) = 0. For flat signals, Kurt(y) < 0. For sparse spikes/voices, Kurt(y) > 0. ICA optimizes W to maximize |Kurt(W x)|.\n2. Negentropy: J(y) = H(y_gaussian) - H(y), where H(y) is differential entropy. J(y) ≥ 0, and J(y) = 0 IF AND ONLY IF y is Gaussian. Maximizing negentropy pushes y away from Gaussianity.",
            "priorWork": "HISTORICAL LITERATURE REVIEW & CONTEXT:\nPierre Comon (1994) formalized ICA to solve blind source separation in signal processing. Before ICA, linear unmixing relied on 2nd-order correlation (PCA/Factor Analysis), which failed whenever sources were non-orthogonal. Hyvärinen & Oja (2000) introduced FastICA, using fixed-point iteration to maximize negentropy exponentially faster than gradient descent.",
            "paperArchitecture": "MATHEMATICAL MECHANISM & ALGORITHM FLOW:\n1. Centering: Subtract mean vector μ: x_centered = x - μ.\n2. Whitening (ZCA/PCA Whitening): Compute covariance C = E[x_centered x_centeredᵀ] = U Σ Uᵀ. Compute whitened vector x̃ = Σ^(-1/2) Uᵀ x_centered so that E[x̃ x̃ᵀ] = I. Whitening removes all 2nd-order correlations.\n3. Orthogonal Search: After whitening, the unmixing matrix W is strictly an ORTHOGONAL ROTATION MATRIX (W Wᵀ = I).\n4. Non-Gaussian Optimization: Maximize negentropy J(wᵀ x̃) ≈ [E{G(wᵀ x̃)} - E{G(v)}]^2 where G(u) = -exp(-u²/2).\n5. Source Recovery: Reconstructed independent sources y = W x̃ = W A s ≈ P D s (recovered up to permutation P and scaling D).",
            "simplifiedMath": [
              {
                "name": "Linear Mixing Equation",
                "formula": "x = A s",
                "original": "Linear Mixing Equation: x = A s",
                "simple": "Observed vector x is a linear combination of independent source vector s via matrix A.",
                "meaning": "Observed vector x is a linear combination of independent source vector s via matrix A."
              },
              {
                "name": "Unmixing Recovery",
                "formula": "y = W x = W A s ≈ P D s",
                "original": "Unmixing Recovery: y = W x = W A s ≈ P D s",
                "simple": "Unmixing matrix W recovers sources up to permutation P and scaling matrix D.",
                "meaning": "Unmixing matrix W recovers sources up to permutation P and scaling matrix D."
              }
            ],
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
            "vocabulary": [
              {
                "term": "Blind Source Separation",
                "original": "Technical term: «Blind Source Separation» as used in this literature.",
                "simple": "Extracting unobserved source signals from mixed sensor observations without prior mixing info.",
                "def": "Extracting unobserved source signals from mixed sensor observations without prior mixing info."
              },
              {
                "term": "Identifiability",
                "original": "Technical term: «Identifiability» as used in this literature.",
                "simple": "Mathematical proof that parameters or latent sources can be uniquely recovered under specific assumptions.",
                "def": "Mathematical proof that parameters or latent sources can be uniquely recovered under specific assumptions."
              },
              {
                "term": "Statistical Independence",
                "original": "Technical term: «Statistical Independence» as used in this literature.",
                "simple": "The condition where joint probability density equals the product of marginal densities: p(x,y) = p(x)p(y).",
                "def": "The condition where joint probability density equals the product of marginal densities: p(x,y) = p(x)p(y)."
              }
            ],
            "whatItShows": [
              "When and how linear unmixing recovers independent latent sources",
              "Why non-Gaussianity enables source identification beyond PCA"
            ],
            "whatItDoesNotShow": [
              "That neural network activations are purely linear independent mixtures",
              "How to handle overcomplete dictionaries (where sources > dimensions)"
            ],
            "setconcaUse": [
              "Use ICA as the conceptual foundation for Concept Component Analysis (ConCA).",
              "State explicit identifiability assumptions whenever claiming concept recovery.",
              "Distinguish ICA linear unmixing from SAE dictionary learning."
            ],
            "masteryChecklist": [
              "I can explain the Cocktail Party Problem and why PCA fails it.",
              "I can contrast correlation vs. statistical independence.",
              "I can list the three mathematical assumptions required for ICA identifiability.",
              "I understand why non-Gaussianity maximization recovers independent sources."
            ],
            "commonConfusions": [
              {
                "wrong": "PCA and ICA do the same thing.",
                "right": "PCA maximizes variance along orthogonal axes. ICA maximizes statistical independence to unmix sources."
              },
              {
                "wrong": "Uncorrelated variables are automatically independent.",
                "right": "Uncorrelatedness is weaker. Variables can have zero covariance but strong non-linear dependence."
              }
            ],
            "quiz": [
              {
                "q": "ICA target objective is?",
                "options": [
                  "Statistical independence / Non-Gaussianity",
                  "Maximum variance",
                  "Cross-view correlation",
                  "L1 penalty"
                ],
                "a": 0,
                "explain": "ICA searches for independent sources by maximizing non-Gaussianity."
              },
              {
                "q": "Why does ICA require non-Gaussian sources?",
                "options": [
                  "Gaussian distributions are rotationally symmetric, making direction unidentifiable",
                  "Gaussian sources are non-linear",
                  "PCA requires Gaussianity",
                  "TopK fails on Gaussians"
                ],
                "a": 0,
                "explain": "Rotational symmetry of Gaussian distributions prevents unique axis identification."
              },
              {
                "q": "ICA is the direct conceptual ancestor of which concept paper?",
                "options": [
                  "ConCA (Concept Component Analysis)",
                  "SimCLR",
                  "Deep Sets",
                  "CKA"
                ],
                "a": 0,
                "explain": "ConCA treats activations as mixtures of concept components using unmixing logic."
              }
            ],
            "originalIdea": "A linear-algebra tutorial on recovering statistically independent source signals from linear mixtures.",
            "simpleLesson": "Welcome to the ICA Masterclass. Let's build the intuition, the low-level math, and the underlying meaning from absolute zero.\n\n--- LAYER 1: EVERYDAY INTUITION & THE COCKTAIL PARTY PROBLEM ---\nImagine two people talking at the exact same time in a room. You place two microphones at different locations. Microphone 1 picks up: x_1 = 0.70 * Voice_A + 0.30 * Voice_B.\nMicrophone 2 picks up: x_2 = 0.40 * Voice_A + 0.60 * Voice_B.\nHow do you extract the pure Voice_A and Voice_B without knowing who spoke or where the mics were?\n\nPCA FAILS HERE: PCA looks for orthogonal (90°) directions of maximum volume. But Voice_A and Voice_B are NOT orthogonal in microphone space! PCA just finds the loudest combined direction, giving you a noisy mix of both voices.\n\n--- LAYER 2: THE CENTRAL LIMIT THEOREM & THE DICE-ROLL ANALOGY ---\nWhy does ICA work? It uses a fundamental law of probability: The Central Limit Theorem (CLT).\n• Single Pure Signal: Imagine rolling ONE 6-sided die. The numbers {1, 2, 3, 4, 5, 6} each have probability 1/6. The histogram is completely FLAT (a uniform rectangle, 0% bell-curve shape).\n• Mixed Signal: Now roll TEN dice and sum their values. Getting all 1s (sum=10) or all 6s (sum=60) is almost impossible (probability ~1.65×10⁻⁸). But getting sums near 35 is extremely common! The histogram of the sum turns into a smooth, bell-shaped GAUSSIAN curve!\n\nTHE ICA INSIGHT: Adding/mixing independent signals ALWAYS makes their combined distribution MORE Gaussian (bell-shaped) than the pure original signals! Therefore, mixed signals are always bell-shaped, while pure independent signals are non-Gaussian!\n\nHOW ICA UNMIXES: ICA searches for an unmixing matrix W such that the outputs y = W x have histograms that are as NON-GAUSSIAN as possible! By turning the rotation dial to maximize non-Gaussianity, ICA pops the pure independent sources back out!\n\n--- LAYER 3: WHY GAUSSIANS CANNOT BE UNMIXED (ROTATIONAL SYMMETRY) ---\nWhy does ICA require sources to be non-Gaussian? A 2D Gaussian probability density p(s_1, s_2) = (1 / 2π) * exp(-(s_1² + s_2²)/2) is a perfect circular blob. If you rotate a circle by any angle θ, it stays 100% identical! There is no unique direction. Non-Gaussian distributions (like a square, cross, or sparse spike) are NOT rotationally symmetric. There is exactly ONE angle where the independent axes line up!\n\n--- LAYER 4: EXACT MATHEMATICAL MEASURES (KURTOSIS & NEGENTROPY) ---\n1. Kurtosis: Kurt(y) = E[y⁴] - 3(E[y²])². Measures 4th-order tail weight. For a Gaussian variable, Kurt(y) = 0. For flat signals, Kurt(y) < 0. For sparse spikes/voices, Kurt(y) > 0. ICA optimizes W to maximize |Kurt(W x)|.\n2. Negentropy: J(y) = H(y_gaussian) - H(y), where H(y) is differential entropy. J(y) ≥ 0, and J(y) = 0 IF AND ONLY IF y is Gaussian. Maximizing negentropy pushes y away from Gaussianity.",
            "limitPairs": [
              {
                "original": "When and how linear unmixing recovers independent latent sources",
                "simple": "In practice this means evidence supports: When and how linear unmixing recovers independent latent sources"
              },
              {
                "original": "Why non-Gaussianity enables source identification beyond PCA",
                "simple": "In practice this means evidence supports: Why non-Gaussianity enables source identification beyond PCA"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That neural network activations are purely linear independent mixtures",
                "simple": "Do not overclaim: That neural network activations are purely linear independent mixtures"
              },
              {
                "original": "How to handle overcomplete dictionaries (where sources > dimensions)",
                "simple": "Do not overclaim: How to handle overcomplete dictionaries (where sources > dimensions)"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Use ICA as the conceptual foundation for Concept Component Analysis (ConCA).",
                "simple": "Action item: Use ICA as the conceptual foundation for Concept Component Analysis (ConCA)."
              },
              {
                "original": "State explicit identifiability assumptions whenever claiming concept recovery.",
                "simple": "Action item: State explicit identifiability assumptions whenever claiming concept recovery."
              },
              {
                "original": "Distinguish ICA linear unmixing from SAE dictionary learning.",
                "simple": "Action item: Distinguish ICA linear unmixing from SAE dictionary learning."
              }
            ]
          },
          "quiz": [
            {
              "q": "ICA target objective is?",
              "options": [
                "Statistical independence / Non-Gaussianity",
                "Maximum variance",
                "Cross-view correlation",
                "L1 penalty"
              ],
              "a": 0,
              "explain": "ICA searches for independent sources by maximizing non-Gaussianity."
            },
            {
              "q": "Why does ICA require non-Gaussian sources?",
              "options": [
                "Gaussian distributions are rotationally symmetric, making direction unidentifiable",
                "Gaussian sources are non-linear",
                "PCA requires Gaussianity",
                "TopK fails on Gaussians"
              ],
              "a": 0,
              "explain": "Rotational symmetry of Gaussian distributions prevents unique axis identification."
            },
            {
              "q": "ICA is the direct conceptual ancestor of which concept paper?",
              "options": [
                "ConCA (Concept Component Analysis)",
                "SimCLR",
                "Deep Sets",
                "CKA"
              ],
              "a": 0,
              "explain": "ConCA treats activations as mixtures of concept components using unmixing logic."
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
            "whyWeRead": "CCA is the foundation of multi-view learning. It defines how to extract shared signals across two paired representations — a core baseline for SetConCA.",
            "oneSentence": "A comprehensive tutorial on Canonical Correlation Analysis (CCA), regularized CCA, kernel CCA, and deep variants.",
            "plainLanguage": "Welcome to the CCA Masterclass. Let's understand why Harold Hotelling invented CCA in 1936.\n\nSuppose you have TWO different feature spaces observing the exact same items. Example: View 1 is a 512-dimensional audio embedding of a speech, and View 2 is a 2048-dimensional image embedding of the speaker. Audio and image vectors live in completely different dimensions with different metrics. How do you find the SHARED information between them?\n\n--- HOW CCA WORKS ---\nCCA searches for a projection direction u in View 1 space and a projection direction v in View 2 space such that the projected 1D numbers (uᵀx and vᵀy) have the MAXIMUM POSSIBLE CORRELATION!\n\nThese projected scalar channels are called Canonical Variables, and their correlation value is the Canonical Correlation.\n\n--- MULTIPLE CANONICAL PAIRS ---\nOnce CCA finds the 1st most correlated pair of directions (u_1, v_1), it searches for a 2nd pair (u_2, v_2) that is maximally correlated while remaining uncorrelated with the 1st pair. You can extract multiple canonical pairs ordered by correlation strength.\n\n--- SHARED VS. PRIVATE INFORMATION ---\nCCA focuses strictly on SHARED covariance. If View 1 contains high-variance background noise that does not exist in View 2, CCA completely ignores it. This is both a strength (filters private noise) and a risk (may discard useful view-specific detail).\n\n--- CCA VARIANTS ---\n1. Regularized CCA: Adds ridge penalty to sample covariance matrices when feature dimension > sample size.\n2. Kernel CCA: Maps views through non-linear kernel functions to find non-linear shared correlations.\n3. Deep CCA: Replaces linear projections with deep neural networks (Andrew et al., 2013).\n\nTHE CLASSICAL DECOMPOSITION TRIAD:\n• PCA: Within-view max variance.\n• ICA: Within-view independent sources.\n• CCA: Cross-view shared correlation.",
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
                "name": "CCA Optimization Objective",
                "formula": "max_{u,v}  uᵀ Σ_{xy} v / √(uᵀ Σ_{xx} u · vᵀ Σ_{yy} v)",
                "original": "CCA Optimization Objective: max_{u,v}  uᵀ Σ_{xy} v / √(uᵀ Σ_{xx} u · vᵀ Σ_{yy} v)",
                "simple": "Maximize cross-covariance between projected views relative to within-view variance.",
                "meaning": "Maximize cross-covariance between projected views relative to within-view variance."
              }
            ],
            "vocabulary": [
              {
                "term": "Canonical Correlation",
                "original": "Technical term: «Canonical Correlation» as used in this literature.",
                "simple": "The maximum linear correlation between projected dimensions of two multi-variable views.",
                "def": "The maximum linear correlation between projected dimensions of two multi-variable views."
              },
              {
                "term": "Canonical Variables",
                "original": "Technical term: «Canonical Variables» as used in this literature.",
                "simple": "The 1D scalar projections uᵀX and vᵀY produced by CCA directions.",
                "def": "The 1D scalar projections uᵀX and vᵀY produced by CCA directions."
              },
              {
                "term": "Multi-View Learning",
                "original": "Technical term: «Multi-View Learning» as used in this literature.",
                "simple": "Learning representations from multiple distinct paired observations of the same underlying entities.",
                "def": "Learning representations from multiple distinct paired observations of the same underlying entities."
              }
            ],
            "whatItShows": [
              "How to extract shared linear correlation channels between two different feature views",
              "How variants handle non-linearity and high dimensions"
            ],
            "whatItDoesNotShow": [
              "That shared directions are causally interpretable concepts",
              "How to preserve view-specific private details automatically"
            ],
            "setconcaUse": [
              "Use linear CCA as a mandatory multi-view baseline.",
              "Report shared vs. private information explicitly when designing multi-view SAE losses.",
              "Validate canonical correlations on held-out test sets to prevent noise overfitting."
            ],
            "masteryChecklist": [
              "I can state the CCA objective in plain English and symbols.",
              "I can explain the difference between shared information and private information.",
              "I know why Deep CCA and Regularized CCA were developed.",
              "I can recite the PCA / ICA / CCA comparison triad from memory."
            ],
            "commonConfusions": [
              {
                "wrong": "CCA maximizes variance inside View 1.",
                "right": "PCA maximizes within-view variance. CCA maximizes cross-view correlation."
              },
              {
                "wrong": "High CCA correlation means the two views are identical.",
                "right": "It means their projected directions correlate; their unprojected spaces can differ greatly."
              }
            ],
            "quiz": [
              {
                "q": "CCA maximizes which metric between two views?",
                "options": [
                  "Correlation of projected dimensions",
                  "Within-view variance",
                  "L0 sparsity",
                  "Reconstruction error"
                ],
                "a": 0,
                "explain": "CCA maximizes cross-view linear correlation of projected canonical variables."
              },
              {
                "q": "What happens to view-specific private details in standard CCA?",
                "options": [
                  "They may be discarded because CCA targets shared correlation",
                  "They are amplified",
                  "They are turned into PCA components",
                  "They are saved automatically"
                ],
                "a": 0,
                "explain": "CCA targets shared cross-view signal, so private details are ignored."
              },
              {
                "q": "What is the primary baseline function of CCA in SetConCA?",
                "options": [
                  "Primary classical baseline for cross-view feature alignment",
                  "Sparsity enforcer",
                  "Probe classifier",
                  "Decoder enforcer"
                ],
                "a": 0,
                "explain": "CCA is the classical baseline for multi-view feature alignment."
              }
            ],
            "originalIdea": "A comprehensive tutorial on Canonical Correlation Analysis (CCA), regularized CCA, kernel CCA, and deep variants.",
            "simpleLesson": "Welcome to the CCA Masterclass. Let's understand why Harold Hotelling invented CCA in 1936.\n\nSuppose you have TWO different feature spaces observing the exact same items. Example: View 1 is a 512-dimensional audio embedding of a speech, and View 2 is a 2048-dimensional image embedding of the speaker. Audio and image vectors live in completely different dimensions with different metrics. How do you find the SHARED information between them?\n\n--- HOW CCA WORKS ---\nCCA searches for a projection direction u in View 1 space and a projection direction v in View 2 space such that the projected 1D numbers (uᵀx and vᵀy) have the MAXIMUM POSSIBLE CORRELATION!\n\nThese projected scalar channels are called Canonical Variables, and their correlation value is the Canonical Correlation.\n\n--- MULTIPLE CANONICAL PAIRS ---\nOnce CCA finds the 1st most correlated pair of directions (u_1, v_1), it searches for a 2nd pair (u_2, v_2) that is maximally correlated while remaining uncorrelated with the 1st pair. You can extract multiple canonical pairs ordered by correlation strength.\n\n--- SHARED VS. PRIVATE INFORMATION ---\nCCA focuses strictly on SHARED covariance. If View 1 contains high-variance background noise that does not exist in View 2, CCA completely ignores it. This is both a strength (filters private noise) and a risk (may discard useful view-specific detail).\n\n--- CCA VARIANTS ---\n1. Regularized CCA: Adds ridge penalty to sample covariance matrices when feature dimension > sample size.\n2. Kernel CCA: Maps views through non-linear kernel functions to find non-linear shared correlations.\n3. Deep CCA: Replaces linear projections with deep neural networks (Andrew et al., 2013).\n\nTHE CLASSICAL DECOMPOSITION TRIAD:\n• PCA: Within-view max variance.\n• ICA: Within-view independent sources.\n• CCA: Cross-view shared correlation.",
            "limitPairs": [
              {
                "original": "How to extract shared linear correlation channels between two different feature views",
                "simple": "In practice this means evidence supports: How to extract shared linear correlation channels between two different feature views"
              },
              {
                "original": "How variants handle non-linearity and high dimensions",
                "simple": "In practice this means evidence supports: How variants handle non-linearity and high dimensions"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That shared directions are causally interpretable concepts",
                "simple": "Do not overclaim: That shared directions are causally interpretable concepts"
              },
              {
                "original": "How to preserve view-specific private details automatically",
                "simple": "Do not overclaim: How to preserve view-specific private details automatically"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Use linear CCA as a mandatory multi-view baseline.",
                "simple": "Action item: Use linear CCA as a mandatory multi-view baseline."
              },
              {
                "original": "Report shared vs. private information explicitly when designing multi-view SAE losses.",
                "simple": "Action item: Report shared vs. private information explicitly when designing multi-view SAE losses."
              },
              {
                "original": "Validate canonical correlations on held-out test sets to prevent noise overfitting.",
                "simple": "Action item: Validate canonical correlations on held-out test sets to prevent noise overfitting."
              }
            ]
          },
          "quiz": [
            {
              "q": "CCA maximizes which metric between two views?",
              "options": [
                "Correlation of projected dimensions",
                "Within-view variance",
                "L0 sparsity",
                "Reconstruction error"
              ],
              "a": 0,
              "explain": "CCA maximizes cross-view linear correlation of projected canonical variables."
            },
            {
              "q": "What happens to view-specific private details in standard CCA?",
              "options": [
                "They may be discarded because CCA targets shared correlation",
                "They are amplified",
                "They are turned into PCA components",
                "They are saved automatically"
              ],
              "a": 0,
              "explain": "CCA targets shared cross-view signal, so private details are ignored."
            },
            {
              "q": "What is the primary baseline function of CCA in SetConCA?",
              "options": [
                "Primary classical baseline for cross-view feature alignment",
                "Sparsity enforcer",
                "Probe classifier",
                "Decoder enforcer"
              ],
              "a": 0,
              "explain": "CCA is the classical baseline for multi-view feature alignment."
            }
          ]
        }
      ],
      "primer": {
        "title": "What is a representation?",
        "mission": "Master PCA, ICA, and CCA from first principles. Understand what each objective measures, how to read their math, and why good reconstruction does not equal interpretability.",
        "beforeYouStart": "None — we start from absolute zero.",
        "primer": "Welcome to Level 1. Imagine a modern language model like Gemma or Llama processing a sentence. Inside the model, words are converted into long lists of numbers — vectors with thousands of dimensions (e.g. 4096 numbers per token). We call these numbers 'activations', and together they form the model's internal representation.\n\nHere is the fundamental problem: why can't we just look at index #42 of that vector to see if the model is thinking about 'dogs'? Because neural networks do not allocate one number per concept. Information is spread out across all dimensions simultaneously. To understand what the network is doing, we need mathematical tools to rotate, unmix, or align these high-dimensional vector spaces.\n\nIn this level, we master the three classical linear tools that started it all: PCA, ICA, and CCA.\n\n--- STEP 1: PCA (Principal Component Analysis) — Finding Variance Inside One View ---\nWhere did it come from? In 1901, Karl Pearson wanted a way to summarize a complex cloud of data points using fewer dimensions without losing important spread.\n\nHow does it work? Imagine a 3D cloud of data shaped like a football floating in a room. If you must project this 3D cloud onto a flat 2D screen, which angle preserves the most information? You want to rotate the screen so it faces the longest axis of the football!\n\nLet's build the math step-by-step:\n1. Mean (μ): The central point of your data cloud.\n2. Variance: How far data points spread out around that mean. For a variable x, variance is E[(x - μ)²]. We square the differences so positive and negative offsets don't cancel each other out.\n3. Covariance: How two different coordinates move together. If coordinate X goes up whenever coordinate Y goes up, their covariance E[(x - μ_x)(y - μ_y)] is positive.\n4. Covariance Matrix (C): A square grid recording the pairwise covariance between every single pair of dimensions.\n5. Eigenvectors & Singular Value Decomposition (SVD): An eigenvector of matrix C is a special direction in space that DOES NOT ROTATE when multiplied by C — it only gets stretched! The stretch factor is the Eigenvalue (λ). SVD (X = U Σ Vᵀ) is the standard numerical algorithm to compute these principal directions directly from raw data.\n\nThe PCA recipe: PCA finds orthogonal (90-degree right angle) axes ordered by how much variance they capture. The first component is the longest axis of the cloud; the second component is the next longest axis strictly perpendicular to the first.\n\nWhat is FVU (Fraction of Variance Unexplained)?\nIf you keep only the top k components and throw away the rest, your reconstructed points will have a small error. FVU = 1 - (Explained Variance / Total Variance). If FVU is 0.02, your rank-k subspace captures 98% of the data's spread.\n\nCRITICAL LESSON FOR MI & SAE RESEARCH:\nOrthogonality is a mathematical convenience, NOT a guarantee of semantic meaning. PCA directions are orthogonal pure-math axes. They are rarely clean human concepts! Good reconstruction (low FVU) only means you kept the spread — it does NOT mean you found interpretable features.\n\n--- STEP 2: ICA (Independent Component Analysis) — Unmixing Independent Sources ---\nWhere did it come from? Imagine the 'Cocktail Party Problem'. Two people are speaking at the exact same time in a room. You place two microphones at different locations. Mic 1 picks up 70% Person A + 30% Person B. Mic 2 picks up 40% Person A + 60% Person B. How do you recover the original pure individual voices without knowing who spoke or where the mics were?\n\nWhy PCA fails here: Person A and Person B's voices are NOT orthogonal in microphone space. PCA would just find the direction of highest combined volume, mixing both voices together!\n\nThe ICA core concept: ICA assumes the observations x come from a linear mixture x = A * s, where s is a vector of statistically INDEPENDENT source signals. Independence is much stronger than zero correlation. Zero correlation means E[xy] = E[x]E[y] (no linear relation). Independence means p(x,y) = p(x)p(y) — knowing variable x gives you ABSOLUTELY ZERO information about variable y.\n\nHow ICA unmixes: The Central Limit Theorem states that adding independent random variables together makes their combined distribution more Gaussian (bell-shaped). Therefore, mixed signals are always more Gaussian than single pure signals! ICA searches for an unmixing matrix W such that the recovered signals y = W * x are as NON-GAUSSIAN as possible (maximizing kurtosis or negentropy). By pushing distributions away from bell curves, ICA pops the independent sources back out.\n\nConnection to SetConCA: Concept Component Analysis (ConCA) uses this exact unmixing mental model, treating neural activations as linear mixtures of independent concept components.\n\n--- STEP 3: CCA (Canonical Correlation Analysis) — Finding Shared Signals Between Two Views ---\nWhere did it come from? Harold Hotelling (1936) asked: what if you have TWO different measurements of the same items? For example, View 1 is an audio recording of a speech, and View 2 is a video recording of the speaker's lips. Audio vectors and video vectors have different dimensions and different units.\n\nHow does CCA work? CCA searches for a linear direction u in View 1 space and a linear direction v in View 2 space such that the projected numbers (uᵀx and vᵀy) have the MAXIMUM possible correlation with each other!\n\nShared vs. Private Information:\nCCA focuses strictly on what is SHARED between the two views. If View 1 contains background noise that has nothing to do with View 2, CCA ignores it. The projected variables (uᵀx, vᵀy) are called Canonical Variables, and their correlation is the Canonical Correlation.\n\nTHE CLASSICAL TRIAD TO MEMORIZE:\n• PCA asks: Which directions capture max variance INSIDE one view?\n• ICA asks: Which directions unmix INDEPENDENT sources inside one view?\n• CCA asks: Which directions LINE UP (correlate) ACROSS two views?",
        "bigPictureDiagram": [
          "One view  → PCA  → keep max variance axes (orthogonal, math-driven)",
          "One view  → ICA  → unmix independent non-Gaussian sources (Cocktail party)",
          "Two views → CCA  → find maximum cross-view linear correlation (shared signal)"
        ],
        "conceptsToMaster": [
          {
            "name": "Variance / Covariance",
            "simple": "Variance = how much one variable spreads out around its average. Covariance = whether two variables rise and fall together.",
            "deeper": "Covariance matrix C = E[(x−μ)(x−μ)ᵀ]. Diagonals are variances; off-diagonals are pairwise covariances. PCA diagonalizes C."
          },
          {
            "name": "Eigenvector / SVD",
            "simple": "An eigenvector is a special arrow in space that only gets stretched (not tilted) when multiplied by a matrix. SVD is the master algorithm that finds these stretch directions.",
            "deeper": "Singular Value Decomposition X = U Σ Vᵀ factors data matrix X into left singular vectors U, singular values Σ, and right singular vectors V. The columns of V are the principal component directions."
          },
          {
            "name": "FVU (Fraction of Variance Unexplained)",
            "simple": "The percentage of original data spread lost after compressing and reconstructing.",
            "deeper": "FVU = 1 - (Explained Variance / Total Variance) = ||X - X_hat||_F^2 / ||X - X_mean||_F^2. Lower FVU means better reconstruction, but NOT higher interpretability."
          },
          {
            "name": "Independence vs. Uncorrelatedness",
            "simple": "Uncorrelated means no straight-line relationship. Independent means knowing one variable tells you absolutely nothing about the other.",
            "deeper": "Uncorrelatedness only requires Cov(X,Y) = 0 (2nd-order statistic). Independence requires joint probability p(x,y) = p(x)p(y) across all higher-order moments. ICA requires independence or non-Gaussianity for source recovery."
          },
          {
            "name": "Canonical Correlation",
            "simple": "The highest correlation achievable between two different views after rotating each view appropriately.",
            "deeper": "CCA finds projection vectors u, v maximizing corr(uᵀX, vᵀY) subject to Var(uᵀX) = 1 and Var(vᵀY) = 1. Solved via a generalized eigenvalue problem on cross-covariance matrices."
          }
        ],
        "checkpoint": {
          "goal": "Compare PCA, ICA, and CCA on the same activation dataset.",
          "steps": [
            "Extract activations from Gemma for a dataset of prompts.",
            "Run PCA: plot FVU versus the number of components k.",
            "Run ICA: inspect whether unmixed components isolate distinct activation patterns.",
            "Create two views (e.g. Layer 10 vs Layer 14 activations for the same prompts) and run CCA.",
            "Compare reconstruction error (FVU), cross-view correlation, and retrieval performance."
          ],
          "successLooksLike": "You can explain clearly which method wins on which metric and why high reconstruction or high correlation does NOT automatically mean you found human-interpretable concepts."
        },
        "bridgeToNext": "Now that you understand linear decompositions (PCA/ICA/CCA), Level 2 moves to Sparse Representations & Autoencoders — expanding feature count beyond input dimensions."
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
            "whyWeRead": "k-Sparse Autoencoders are the clearest bridge from classical sparse coding to modern TopK SAEs used in mechanistic interpretability.",
            "oneSentence": "Autoencoders with a hard TopK activation operator that keeps exactly k active units while zeroing all others.",
            "plainLanguage": "Welcome to the k-Sparse Autoencoder Masterclass. Let's understand why Alireza Makhzani and Brendan Frey invented this model in 2013.\n\n--- THE OVERCOMPLETE BOTTLENECK PROBLEM ---\nAn Autoencoder consists of an Encoder z = f(x) and a Decoder x_hat = g(z). If the hidden layer z is OVERCOMPLETE (has more units than input dimension N), an unconstrained autoencoder can easily achieve 0 reconstruction error by learning trivial identity mappings! Every unit becomes a dense, useless mixture of everything.\n\n--- THE HARD TOPK SOLUTION ---\nMakhzani & Frey solved this by inserting a hard TopK activation operator after the encoder:\n1. Encoder computes pre-activations for all hidden units.\n2. TopK operator finds the k largest pre-activation values.\n3. Keeps those k activations EXACTLY as they are, and FORCEFULLY SETS ALL OTHER UNITS TO ZERO!\n4. Decoder reconstructs x_hat from this exact k-sparse code z.\n\n--- WHY TOPK BEATS L1 REGULARIZATION ---\nIn standard L1 autoencoders, sparsity is encouraged by adding λ Σ|z_i| to the loss function. But L1 penalizes activation MAGNITUDES as well as presence, shrinking active feature values (shrinkage flaw).\n\nk-Sparse Autoencoders enforce exact cardinality k WITHOUT penalizing magnitudes! The active k units retain their true strength, leading to much better reconstruction at matched sparsity levels.\n\n--- WHY DENSE INPUTS CAN HAVE SPARSE CODES ---\nA common beginner confusion: 'If my input vector x is dense (all non-zeros), how can code z be 99% sparse?'\nBecause the dictionary is overcomplete! Dense input vector x is reconstructed as a linear combination of just k dictionary columns (atoms): x_hat = Σ_{i ∈ TopK} z_i W_col_i. A few selected dictionary atoms combine to span the dense input vector.",
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
                "name": "k-Sparse Activation",
                "formula": "z = TopK( W_{enc} x + b_{enc}, k )",
                "original": "k-Sparse Activation: z = TopK( W_{enc} x + b_{enc}, k )",
                "simple": "Keep k largest encoder pre-activations; set remaining entries to 0.",
                "meaning": "Keep k largest encoder pre-activations; set remaining entries to 0."
              },
              {
                "name": "Reconstruction Loss",
                "formula": "Loss = ||x - (W_{dec} z + b_{dec})||²",
                "original": "Reconstruction Loss: Loss = ||x - (W_{dec} z + b_{dec})||²",
                "simple": "Train encoder/decoder weights to minimize mean squared reconstruction error under the TopK constraint.",
                "meaning": "Train encoder/decoder weights to minimize mean squared reconstruction error under the TopK constraint."
              }
            ],
            "vocabulary": [
              {
                "term": "Dictionary Atom",
                "original": "Technical term: «Dictionary Atom» as used in this literature.",
                "simple": "A single column vector of the decoder matrix representing a reusable feature direction.",
                "def": "A single column vector of the decoder matrix representing a reusable feature direction."
              },
              {
                "term": "k-Sparsity",
                "original": "Technical term: «k-Sparsity» as used in this literature.",
                "simple": "The condition where a vector has exactly k non-zero entries (||z||₀ = k).",
                "def": "The condition where a vector has exactly k non-zero entries (||z||₀ = k)."
              },
              {
                "term": "Overcomplete",
                "original": "Technical term: «Overcomplete» as used in this literature.",
                "simple": "A representation where hidden dimension exceeds input dimension.",
                "def": "A representation where hidden dimension exceeds input dimension."
              }
            ],
            "whatItShows": [
              "That hard TopK activation enforces exact k-sparsity in autoencoders",
              "That overcomplete sparse codes can reconstruct dense input vectors accurately"
            ],
            "whatItDoesNotShow": [
              "That TopK features are guaranteed to be monosemantic concepts",
              "How features behave in transformer language model residual streams"
            ],
            "setconcaUse": [
              "Treat TopK SAEs as the direct descendant of this architecture.",
              "Use matched-k operating points when comparing sparsity mechanisms."
            ],
            "masteryChecklist": [
              "I can explain why overcomplete autoencoders require sparsity.",
              "I can contrast L1 soft penalties with hard TopK selection.",
              "I understand how a sparse combination of dictionary atoms reconstructs a dense input."
            ],
            "commonConfusions": [
              {
                "wrong": "Sparse latent code means the input vector must be sparse.",
                "right": "Input vector x can be dense. Overcomplete dictionary atoms combine to reconstruct dense x from sparse z."
              },
              {
                "wrong": "TopK is just L1 regularization.",
                "right": "L1 adds soft magnitude penalty to loss. TopK is a hard architectural selection operator with no magnitude shrinkage."
              }
            ],
            "quiz": [
              {
                "q": "How do k-Sparse Autoencoders enforce sparsity?",
                "options": [
                  "Hard TopK selection keeping exactly k largest activations",
                  "L1 magnitude penalty in loss",
                  "Dropout layers",
                  "PCA truncation"
                ],
                "a": 0,
                "explain": "Hard TopK selection keeps the top k values and zeroes all others."
              },
              {
                "q": "Why do overcomplete autoencoders fail without sparsity?",
                "options": [
                  "Without sparsity, dense overcomplete codes learn trivial non-specialized solutions",
                  "They overflow memory",
                  "They cannot compute gradients",
                  "They fail CCA"
                ],
                "a": 0,
                "explain": "Without sparsity, overcomplete codes reconstruct using tiny weights across all units without specializing."
              },
              {
                "q": "What advantage does TopK have over L1 regularization?",
                "options": [
                  "TopK avoids magnitude shrinkage on active features",
                  "TopK is linear",
                  "TopK requires no hyperparameter",
                  "TopK guarantees 0 loss"
                ],
                "a": 0,
                "explain": "TopK does not penalize active feature magnitudes, avoiding L1 shrinkage."
              }
            ],
            "originalIdea": "Autoencoders with a hard TopK activation operator that keeps exactly k active units while zeroing all others.",
            "simpleLesson": "Welcome to the k-Sparse Autoencoder Masterclass. Let's understand why Alireza Makhzani and Brendan Frey invented this model in 2013.\n\n--- THE OVERCOMPLETE BOTTLENECK PROBLEM ---\nAn Autoencoder consists of an Encoder z = f(x) and a Decoder x_hat = g(z). If the hidden layer z is OVERCOMPLETE (has more units than input dimension N), an unconstrained autoencoder can easily achieve 0 reconstruction error by learning trivial identity mappings! Every unit becomes a dense, useless mixture of everything.\n\n--- THE HARD TOPK SOLUTION ---\nMakhzani & Frey solved this by inserting a hard TopK activation operator after the encoder:\n1. Encoder computes pre-activations for all hidden units.\n2. TopK operator finds the k largest pre-activation values.\n3. Keeps those k activations EXACTLY as they are, and FORCEFULLY SETS ALL OTHER UNITS TO ZERO!\n4. Decoder reconstructs x_hat from this exact k-sparse code z.\n\n--- WHY TOPK BEATS L1 REGULARIZATION ---\nIn standard L1 autoencoders, sparsity is encouraged by adding λ Σ|z_i| to the loss function. But L1 penalizes activation MAGNITUDES as well as presence, shrinking active feature values (shrinkage flaw).\n\nk-Sparse Autoencoders enforce exact cardinality k WITHOUT penalizing magnitudes! The active k units retain their true strength, leading to much better reconstruction at matched sparsity levels.\n\n--- WHY DENSE INPUTS CAN HAVE SPARSE CODES ---\nA common beginner confusion: 'If my input vector x is dense (all non-zeros), how can code z be 99% sparse?'\nBecause the dictionary is overcomplete! Dense input vector x is reconstructed as a linear combination of just k dictionary columns (atoms): x_hat = Σ_{i ∈ TopK} z_i W_col_i. A few selected dictionary atoms combine to span the dense input vector.",
            "limitPairs": [
              {
                "original": "That hard TopK activation enforces exact k-sparsity in autoencoders",
                "simple": "In practice this means evidence supports: That hard TopK activation enforces exact k-sparsity in autoencoders"
              },
              {
                "original": "That overcomplete sparse codes can reconstruct dense input vectors accurately",
                "simple": "In practice this means evidence supports: That overcomplete sparse codes can reconstruct dense input vectors accurately"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That TopK features are guaranteed to be monosemantic concepts",
                "simple": "Do not overclaim: That TopK features are guaranteed to be monosemantic concepts"
              },
              {
                "original": "How features behave in transformer language model residual streams",
                "simple": "Do not overclaim: How features behave in transformer language model residual streams"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Treat TopK SAEs as the direct descendant of this architecture.",
                "simple": "Action item: Treat TopK SAEs as the direct descendant of this architecture."
              },
              {
                "original": "Use matched-k operating points when comparing sparsity mechanisms.",
                "simple": "Action item: Use matched-k operating points when comparing sparsity mechanisms."
              }
            ]
          },
          "quiz": [
            {
              "q": "How do k-Sparse Autoencoders enforce sparsity?",
              "options": [
                "Hard TopK selection keeping exactly k largest activations",
                "L1 magnitude penalty in loss",
                "Dropout layers",
                "PCA truncation"
              ],
              "a": 0,
              "explain": "Hard TopK selection keeps the top k values and zeroes all others."
            },
            {
              "q": "Why do overcomplete autoencoders fail without sparsity?",
              "options": [
                "Without sparsity, dense overcomplete codes learn trivial non-specialized solutions",
                "They overflow memory",
                "They cannot compute gradients",
                "They fail CCA"
              ],
              "a": 0,
              "explain": "Without sparsity, overcomplete codes reconstruct using tiny weights across all units without specializing."
            },
            {
              "q": "What advantage does TopK have over L1 regularization?",
              "options": [
                "TopK avoids magnitude shrinkage on active features",
                "TopK is linear",
                "TopK requires no hyperparameter",
                "TopK guarantees 0 loss"
              ],
              "a": 0,
              "explain": "TopK does not penalize active feature magnitudes, avoiding L1 shrinkage."
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
            "whyWeRead": "VAEs introduce probabilistic latent-variable modeling, variational inference, the reparameterization trick, and the ELBO loss — foundational vocabulary for Gaussian set aggregations and Product-of-Experts (PoE).",
            "oneSentence": "Derives Variational Autoencoders (VAEs), approximate posterior estimation, the reparameterization trick, and the Evidence Lower Bound (ELBO).",
            "plainLanguage": "Welcome to the VAE Masterclass. Let's understand why Diederik Kingma and Max Welling invented VAEs in 2013.\n\n--- DETERMINISTIC VS PROBABILISTIC AUTOENCODERS ---\nA standard autoencoder maps input x to a single deterministic point z in latent space. But what if you want to GENERATE new data, or model UNCERTAINTY? Deterministic latent spaces have empty gaps where decoding produces nonsense.\n\nA VAE treats each input x as being generated by a probabilistic latent variable z. Instead of predicting a single point z, the encoder predicts the PARAMETERS of a distribution: a mean vector μ(x) and a variance vector σ²(x)!\n\n--- THE REPARAMETERIZATION TRICK ---\nHere is the technical wall Kingma & Welling hit: how do you backpropagate neural network gradients through a random sampling step z ~ N(μ, σ²)?\nRandom sampling is non-differentiable! Standard backpropagation fails.\n\nThe Brilliant Solution (Reparameterization Trick):\nIsolate the randomness outside the network! Sample pure noise ε from a standard normal distribution N(0, I). Then compute latent z deterministically:\nz = μ(x) + σ(x) ⊙ ε\nNow μ and σ are standard deterministic outputs, and gradients flow cleanly back into the encoder parameters!\n\n--- THE ELBO LOSS (Evidence Lower Bound) ---\nVAEs optimize the ELBO, which balances two competing forces:\nLoss = Reconstruction Error + KL-Divergence( q(z|x) || p(z) )\n1. Reconstruction Error: Encoder and decoder work together to reconstruct input x accurately.\n2. KL-Divergence Penalty: Forces the predicted distribution q(z|x) to stay close to a simple standard normal prior p(z) = N(0, I). This prevents the encoder from scattering latent distributions far apart, keeping the latent space continuous and smooth.\n\nFOR SETCONCA:\nWhen SetConCA represents sets of activation views as probabilistic Gaussian distributions or merges them using Product-of-Experts (PoE), you are using this exact VAE ELBO vocabulary.",
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
                "name": "Reparameterization Formula",
                "formula": "z = μ(x) + σ(x) ⊙ ε,   ε ~ N(0, I)",
                "original": "Reparameterization Formula: z = μ(x) + σ(x) ⊙ ε,   ε ~ N(0, I)",
                "simple": "Differentiable latent sampling separating deterministic parameters from random noise ε.",
                "meaning": "Differentiable latent sampling separating deterministic parameters from random noise ε."
              },
              {
                "name": "ELBO Objective",
                "formula": "ELBO = E_{q(z|x)}[log p(x|z)] - KL(q(z|x) || p(z))",
                "original": "ELBO Objective: ELBO = E_{q(z|x)}[log p(x|z)] - KL(q(z|x) || p(z))",
                "simple": "Maximize expected log reconstruction likelihood minus KL divergence to standard normal prior.",
                "meaning": "Maximize expected log reconstruction likelihood minus KL divergence to standard normal prior."
              }
            ],
            "vocabulary": [
              {
                "term": "ELBO",
                "original": "Technical term: «ELBO» as used in this literature.",
                "simple": "Evidence Lower Bound; the variational objective maximized during VAE training.",
                "def": "Evidence Lower Bound; the variational objective maximized during VAE training."
              },
              {
                "term": "KL Divergence",
                "original": "Technical term: «KL Divergence» as used in this literature.",
                "simple": "Kullback–Leibler divergence; measures relative entropy/difference between two probability distributions.",
                "def": "Kullback–Leibler divergence; measures relative entropy/difference between two probability distributions."
              },
              {
                "term": "Reparameterization Trick",
                "original": "Technical term: «Reparameterization Trick» as used in this literature.",
                "simple": "Method rewriting stochastic sampling so encoder parameters receive backprop gradients.",
                "def": "Method rewriting stochastic sampling so encoder parameters receive backprop gradients."
              }
            ],
            "whatItShows": [
              "How to train continuous probabilistic latents using variational inference",
              "How the reparameterization trick enables gradient flow through sampling"
            ],
            "whatItDoesNotShow": [
              "That VAE Gaussian latents are monosemantic features",
              "How overcomplete dictionaries unpack superposed representations"
            ],
            "setconcaUse": [
              "Use ELBO intuition for Gaussian set view representations.",
              "Apply Product-of-Experts (PoE) fusion when combining multi-view posteriors."
            ],
            "masteryChecklist": [
              "I can explain why standard random sampling breaks backpropagation.",
              "I can write the reparameterization formula and explain why it works.",
              "I can explain the two terms in the ELBO loss and their trade-off."
            ],
            "commonConfusions": [
              {
                "wrong": "VAE is the same as SAE.",
                "right": "VAE is a probabilistic bottleneck model with a Gaussian prior. SAE is an overcomplete sparse dictionary enforcer for interpretability."
              }
            ],
            "quiz": [
              {
                "q": "What problem does the Reparameterization Trick solve?",
                "options": [
                  "Enables gradient backpropagation through stochastic sampling",
                  "Increases L0 sparsity",
                  "Computes CKA",
                  "Solves PCA"
                ],
                "a": 0,
                "explain": "It isolates random sampling outside the parameter graph so backprop gradients can flow."
              },
              {
                "q": "The ELBO loss balances which two terms?",
                "options": [
                  "Reconstruction quality vs. KL divergence to prior",
                  "L0 sparsity vs. L1 penalty",
                  "CCA correlation vs. PCA variance",
                  "Precision vs. Recall"
                ],
                "a": 0,
                "explain": "ELBO balances expected reconstruction likelihood against KL divergence from the prior."
              },
              {
                "q": "Why is VAE vocabulary relevant to SetConCA?",
                "options": [
                  "Provides framework for probabilistic Gaussian set representations and Product-of-Experts fusion",
                  "Replaces SAEs",
                  "Eliminates need for data",
                  "Computes TopK"
                ],
                "a": 0,
                "explain": "VAEs provide the probabilistic framework for multi-view Gaussian fusion."
              }
            ],
            "originalIdea": "Derives Variational Autoencoders (VAEs), approximate posterior estimation, the reparameterization trick, and the Evidence Lower Bound (ELBO).",
            "simpleLesson": "Welcome to the VAE Masterclass. Let's understand why Diederik Kingma and Max Welling invented VAEs in 2013.\n\n--- DETERMINISTIC VS PROBABILISTIC AUTOENCODERS ---\nA standard autoencoder maps input x to a single deterministic point z in latent space. But what if you want to GENERATE new data, or model UNCERTAINTY? Deterministic latent spaces have empty gaps where decoding produces nonsense.\n\nA VAE treats each input x as being generated by a probabilistic latent variable z. Instead of predicting a single point z, the encoder predicts the PARAMETERS of a distribution: a mean vector μ(x) and a variance vector σ²(x)!\n\n--- THE REPARAMETERIZATION TRICK ---\nHere is the technical wall Kingma & Welling hit: how do you backpropagate neural network gradients through a random sampling step z ~ N(μ, σ²)?\nRandom sampling is non-differentiable! Standard backpropagation fails.\n\nThe Brilliant Solution (Reparameterization Trick):\nIsolate the randomness outside the network! Sample pure noise ε from a standard normal distribution N(0, I). Then compute latent z deterministically:\nz = μ(x) + σ(x) ⊙ ε\nNow μ and σ are standard deterministic outputs, and gradients flow cleanly back into the encoder parameters!\n\n--- THE ELBO LOSS (Evidence Lower Bound) ---\nVAEs optimize the ELBO, which balances two competing forces:\nLoss = Reconstruction Error + KL-Divergence( q(z|x) || p(z) )\n1. Reconstruction Error: Encoder and decoder work together to reconstruct input x accurately.\n2. KL-Divergence Penalty: Forces the predicted distribution q(z|x) to stay close to a simple standard normal prior p(z) = N(0, I). This prevents the encoder from scattering latent distributions far apart, keeping the latent space continuous and smooth.\n\nFOR SETCONCA:\nWhen SetConCA represents sets of activation views as probabilistic Gaussian distributions or merges them using Product-of-Experts (PoE), you are using this exact VAE ELBO vocabulary.",
            "limitPairs": [
              {
                "original": "How to train continuous probabilistic latents using variational inference",
                "simple": "In practice this means evidence supports: How to train continuous probabilistic latents using variational inference"
              },
              {
                "original": "How the reparameterization trick enables gradient flow through sampling",
                "simple": "In practice this means evidence supports: How the reparameterization trick enables gradient flow through sampling"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That VAE Gaussian latents are monosemantic features",
                "simple": "Do not overclaim: That VAE Gaussian latents are monosemantic features"
              },
              {
                "original": "How overcomplete dictionaries unpack superposed representations",
                "simple": "Do not overclaim: How overcomplete dictionaries unpack superposed representations"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Use ELBO intuition for Gaussian set view representations.",
                "simple": "Action item: Use ELBO intuition for Gaussian set view representations."
              },
              {
                "original": "Apply Product-of-Experts (PoE) fusion when combining multi-view posteriors.",
                "simple": "Action item: Apply Product-of-Experts (PoE) fusion when combining multi-view posteriors."
              }
            ]
          },
          "quiz": [
            {
              "q": "What problem does the Reparameterization Trick solve?",
              "options": [
                "Enables gradient backpropagation through stochastic sampling",
                "Increases L0 sparsity",
                "Computes CKA",
                "Solves PCA"
              ],
              "a": 0,
              "explain": "It isolates random sampling outside the parameter graph so backprop gradients can flow."
            },
            {
              "q": "The ELBO loss balances which two terms?",
              "options": [
                "Reconstruction quality vs. KL divergence to prior",
                "L0 sparsity vs. L1 penalty",
                "CCA correlation vs. PCA variance",
                "Precision vs. Recall"
              ],
              "a": 0,
              "explain": "ELBO balances expected reconstruction likelihood against KL divergence from the prior."
            },
            {
              "q": "Why is VAE vocabulary relevant to SetConCA?",
              "options": [
                "Provides framework for probabilistic Gaussian set representations and Product-of-Experts fusion",
                "Replaces SAEs",
                "Eliminates need for data",
                "Computes TopK"
              ],
              "a": 0,
              "explain": "VAEs provide the probabilistic framework for multi-view Gaussian fusion."
            }
          ]
        }
      ],
      "primer": {
        "title": "Sparse representations and dictionaries",
        "mission": "Understand overcomplete dictionaries, why overcompleteness REQUIRES sparsity, how TopK differs from L1, and how VAEs use probabilistic latents.",
        "beforeYouStart": "Level 1 — especially linear reconstruction, FVU, and unmixing.",
        "primer": "Welcome to Level 2. In Level 1, PCA compressed N-dimensional data into k dimensions where k < N (undercomplete). But in neural networks, a fascinating phenomenon occurs: models often pack THOUSANDS of concepts into just hundreds of activation dimensions! To unpack them, we need an OVERCOMPLETE dictionary — a hidden code with MORE features than activation dimensions (e.g. 16,000 dictionary features for a 4,000-dimensional model).\n\n--- STEP 1: Why Overcompleteness Demands Sparsity ---\nImagine you have a 100-dimensional activation vector, and you build a hidden dictionary with 10,000 feature directions. If your neural network is allowed to use ALL 10,000 features at the same time for every single token, what happens?\nThe network can easily reconstruct the input perfectly by assigning tiny, mushy numbers to all 10,000 features! Every feature becomes a generic soup of everything. It is completely uninterpretable.\n\nSparsity is the strict constraint that saves us: for any given token, ONLY A FEW features (e.g. 20 out of 10,000) are allowed to be active (nonzero)! The rest MUST be zero.\nWhen forced to represent data with only 20 active features out of 10,000, each feature direction HAS to specialize into a pure, clean concept (e.g. 'text about legal contracts' or 'Python syntax for loops').\n\n--- STEP 2: The Sparsity Mechanisms — L0, L1, and TopK ---\nHow do we mathematically enforce sparsity?\n\n1. L0 Norm (Ideal but hard):\nThe L0 'norm' ||z||₀ simply counts how many entries in vector z are non-zero. Ideally, we would optimize Loss = Reconstruction_Error + λ * ||z||₀. However, counting non-zeros is non-differentiable (gradient is zero everywhere except jumps). We cannot train neural nets with standard backpropagation using pure L0.\n\n2. L1 Regularization (Lasso penalty):\nIn 2012–2023, researchers relaxed L0 to L1: ||z||₁ = Σ |z_i| (the sum of absolute values). L1 is convex and differentiable everywhere except at 0. It pushes small feature activations to exactly zero.\nThe Hidden Flaw of L1 (Shrinkage): L1 penalizes the MAGNITUDE of active features along with their presence. To reduce the L1 penalty, the model artificially shrinks the active feature values below their true true size! This 'shrinkage' damages reconstruction accuracy.\n\n3. Hard TopK Activation (Makhzani & Frey, 2013 → Gao et al., 2024):\nInstead of adding an L1 penalty to the loss, TopK modifies the network architecture directly! The encoder computes pre-activations for all 10,000 features. Then, a TopK operator selects the top k largest pre-activations (e.g. k=32), keeps their exact values, and forcefully SETS ALL OTHER 9,968 ACTIVATIONS TO ZERO!\nBecause TopK keeps the exact magnitude of the top k features without shrinking them, it achieves much better reconstruction at matched sparsity levels than L1.\n\n--- STEP 3: Autoencoders vs VAEs (Variational Autoencoders) ---\nAn Autoencoder consists of an Encoder z = f(x) that compresses input x into latent code z, and a Decoder x_hat = g(z) that reconstructs x.\n\nWhat is a VAE (Kingma & Welling, 2013)?\nInstead of mapping input x to a single fixed point z, a VAE maps x to a PROBABILISTIC DISTRIBUTION — predicting a mean vector μ and a variance vector σ. The latent z is then sampled from N(μ, σ²).\n\nHow does backprop flow through random sampling? The Reparameterization Trick!\nYou cannot backpropagate gradients through random sampling. Kingma & Welling solved this by separating the randomness: sample noise ε ~ N(0, I) externally, then write z = μ + σ ⊙ ε. Now μ and σ are deterministic node outputs that receive normal gradients!\n\nThe VAE ELBO Loss (Evidence Lower Bound):\nLoss = Reconstruction Error + KL-Divergence(q(z|x) || p(z))\nThe KL-Divergence term forces the learned distribution q(z|x) to stay close to a standard normal prior p(z) = N(0, I), preventing the latent space from leaving empty gaps.\n\nWhy VAEs matter for SetConCA:\nYou don't need to become a VAE researcher, but when SetConCA aggregates multiple activation views using Gaussian distributions or Product-of-Experts (PoE), you are using this exact probabilistic latent vocabulary.",
        "bigPictureDiagram": [
          "Dense Input x → Encoder → Overcomplete z (width > N) → Sparsity Gate → Decoder → Reconstruction x_hat",
          "L1 Sparsity: Soft penalty Σ|z_i| (causes magnitude shrinkage)",
          "TopK Sparsity: Hard keep top-k values, zero rest (no shrinkage, exact k)",
          "VAE Latent: Predict μ, σ → Reparameterize z = μ + σ ⊙ ε → ELBO Loss"
        ],
        "conceptsToMaster": [
          {
            "name": "Overcomplete Dictionary",
            "simple": "Having more feature directions in your hidden layer than dimensions in the input space.",
            "deeper": "Dictionary matrix W_dec has dimension d_model × d_hidden where d_hidden > d_model (e.g. 4x, 16x, 32x expansion). Essential for unfolding superposed features."
          },
          {
            "name": "L0 vs L1 vs TopK",
            "simple": "L0 counts non-zero features. L1 adds up absolute values (causing shrinkage). TopK keeps exactly the k largest features and zeroes the rest.",
            "deeper": "L0 is non-differentiable. L1 is a convex proxy but penalizes magnitude. TopK enforces exact cardinality k while preserving true pre-activation magnitudes of active units."
          },
          {
            "name": "Shrinkage Problem",
            "simple": "When L1 penalties force active features to be smaller than they should be, harming reconstruction quality.",
            "deeper": "L1 loss derivative is constant λ w.r.t active z_i. To minimize L1 penalty, optimizer reduces z_i, causing under-estimation of feature firing strength. Resolved by Gated SAEs and TopK SAEs."
          },
          {
            "name": "ELBO (Evidence Lower Bound)",
            "simple": "The training objective of a VAE balancing reconstruction accuracy with keeping latents near a simple prior distribution.",
            "deeper": "ELBO = E_q[log p(x|z)] - KL(q(z|x) || p(z)). Maximizing ELBO maximizes log-likelihood lower bound. KL term prevents arbitrary latent cluster dispersion."
          },
          {
            "name": "Reparameterization Trick",
            "simple": "A trick to let backprop gradients flow through random sampling by writing z = μ + σ * noise.",
            "deeper": "Expresses stochastic latent z ~ N(μ(x), Σ(x)) as deterministic transformation z = μ(x) + L(x)ε where ε ~ N(0,I). Enables standard gradient computation w.r.t encoder parameters."
          }
        ],
        "checkpoint": {
          "goal": "Train a simple L1 Autoencoder versus a TopK Autoencoder on activation data under matched reconstruction budgets.",
          "steps": [
            "Fix a target FVU budget (e.g. FVU = 0.05).",
            "Train an L1 SAE by tuning penalty λ.",
            "Train a TopK SAE by setting parameter k.",
            "Compare average L0 (active features per token) and inspect active feature magnitudes to observe L1 shrinkage in action."
          ],
          "successLooksLike": "You can explain from experimental data why TopK achieves better reconstruction at the same L0 count than L1."
        },
        "bridgeToNext": "Now that you understand single-view sparse dictionaries, Level 3 moves to Multi-View Representation Learning — aligning multiple observations of the same object."
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
            "whyWeRead": "Deep CCA is the non-linear extension of CCA. It is the precursor to coordinating neural view encoders with multi-view alignment objectives.",
            "oneSentence": "Deep Canonical Correlation Analysis replaces linear CCA projections with neural network encoders trained to maximize canonical correlation.",
            "plainLanguage": "Welcome to the Deep CCA Masterclass. Let's understand why Galen Andrew et al. developed Deep CCA in 2013.\n\n--- BEYOND LINEAR CCA ---\nIn linear CCA (Level 1), we search for linear projections u and v that maximize correlation between two views. But real-world data (images, text, audio, neural activations) has complex NON-LINEAR relationships. Linear CCA fails when the shared signal requires non-linear transformations.\n\n--- HOW DEEP CCA WORKS ---\nDeep CCA places a deep neural network f_θ on View 1 and a deep neural network g_φ on View 2. The entire system is trained end-to-end to maximize the sum of canonical correlations between output embeddings f_θ(X_1) and g_φ(X_2)!\n\n--- THE WHITENING / COVARIANCE CONSTRAINT ---\nWithout constraints, neural network encoders would cheat! Both networks could output a constant vector (e.g. [1, 1, 1]), achieving a fake 'perfect' correlation of 1.0 (representation collapse).\n\nTo prevent collapse, DCCA enforces a whitening constraint: the output dimensions of each encoder MUST have unit variance and zero correlation with each other (1/N Z_1ᵀ Z_1 = I and 1/N Z_2ᵀ Z_2 = I).\n\n--- THE FAILURE MODE: INFORMATION DISCARD ---\nIf DCCA's ONLY objective is cross-view correlation, the networks learn to THROW AWAY any information that is unique to one view (private details). This failure mode directly motivated DCCAE.",
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
                "name": "DCCA Optimization",
                "formula": "max_{θ, φ}  corr( f_θ(X_1), g_φ(X_2) )   s.t. Cov(f_θ) = I, Cov(g_φ) = I",
                "original": "DCCA Optimization: max_{θ, φ}  corr( f_θ(X_1), g_φ(X_2) )   s.t. Cov(f_θ) = I, Cov(g_φ) = I",
                "simple": "Train neural network weights θ and φ to maximize canonical correlation under whitening constraints.",
                "meaning": "Train neural network weights θ and φ to maximize canonical correlation under whitening constraints."
              }
            ],
            "vocabulary": [
              {
                "term": "Deep CCA",
                "original": "Technical term: «Deep CCA» as used in this literature.",
                "simple": "Multi-view representation learning using deep neural encoders trained on canonical correlation objectives.",
                "def": "Multi-view representation learning using deep neural encoders trained on canonical correlation objectives."
              },
              {
                "term": "Representation Collapse",
                "original": "Technical term: «Representation Collapse» as used in this literature.",
                "simple": "A failure state where neural encoders output constant or degenerate vectors to achieve fake correlation.",
                "def": "A failure state where neural encoders output constant or degenerate vectors to achieve fake correlation."
              }
            ],
            "whatItShows": [
              "That non-linear neural networks can be trained directly on canonical correlation objectives"
            ],
            "whatItDoesNotShow": [
              "How to preserve view-specific private details needed for reconstruction"
            ],
            "setconcaUse": [
              "Use Deep CCA as a non-linear multi-view baseline.",
              "Audit whether alignment objectives destroy private activation details."
            ],
            "masteryChecklist": [
              "I can explain how Deep CCA extends linear CCA.",
              "I know why whitening constraints are mandatory in DCCA.",
              "I can describe the private information discard failure mode."
            ],
            "commonConfusions": [
              {
                "wrong": "Maximizing correlation is always sufficient for multi-view learning.",
                "right": "Pure correlation objectives throw away useful private details present in single views."
              }
            ],
            "quiz": [
              {
                "q": "What does Deep CCA add to classical linear CCA?",
                "options": [
                  "Deep neural network view encoders",
                  "L1 sparse dictionaries",
                  "Probes",
                  "Attention layers"
                ],
                "a": 0,
                "explain": "Deep CCA replaces linear projections with deep neural encoders."
              },
              {
                "q": "Why are covariance whitening constraints necessary in DCCA?",
                "options": [
                  "Prevents representation collapse into constant vectors",
                  "Increases L0 sparsity",
                  "Computes SVD",
                  "Speeds up GPU"
                ],
                "a": 0,
                "explain": "Constraints prevent trivial constant solutions where output covariance collapses."
              }
            ],
            "originalIdea": "Deep Canonical Correlation Analysis replaces linear CCA projections with neural network encoders trained to maximize canonical correlation.",
            "simpleLesson": "Welcome to the Deep CCA Masterclass. Let's understand why Galen Andrew et al. developed Deep CCA in 2013.\n\n--- BEYOND LINEAR CCA ---\nIn linear CCA (Level 1), we search for linear projections u and v that maximize correlation between two views. But real-world data (images, text, audio, neural activations) has complex NON-LINEAR relationships. Linear CCA fails when the shared signal requires non-linear transformations.\n\n--- HOW DEEP CCA WORKS ---\nDeep CCA places a deep neural network f_θ on View 1 and a deep neural network g_φ on View 2. The entire system is trained end-to-end to maximize the sum of canonical correlations between output embeddings f_θ(X_1) and g_φ(X_2)!\n\n--- THE WHITENING / COVARIANCE CONSTRAINT ---\nWithout constraints, neural network encoders would cheat! Both networks could output a constant vector (e.g. [1, 1, 1]), achieving a fake 'perfect' correlation of 1.0 (representation collapse).\n\nTo prevent collapse, DCCA enforces a whitening constraint: the output dimensions of each encoder MUST have unit variance and zero correlation with each other (1/N Z_1ᵀ Z_1 = I and 1/N Z_2ᵀ Z_2 = I).\n\n--- THE FAILURE MODE: INFORMATION DISCARD ---\nIf DCCA's ONLY objective is cross-view correlation, the networks learn to THROW AWAY any information that is unique to one view (private details). This failure mode directly motivated DCCAE.",
            "limitPairs": [
              {
                "original": "That non-linear neural networks can be trained directly on canonical correlation objectives",
                "simple": "In practice this means evidence supports: That non-linear neural networks can be trained directly on canonical correlation objectives"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "How to preserve view-specific private details needed for reconstruction",
                "simple": "Do not overclaim: How to preserve view-specific private details needed for reconstruction"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Use Deep CCA as a non-linear multi-view baseline.",
                "simple": "Action item: Use Deep CCA as a non-linear multi-view baseline."
              },
              {
                "original": "Audit whether alignment objectives destroy private activation details.",
                "simple": "Action item: Audit whether alignment objectives destroy private activation details."
              }
            ]
          },
          "quiz": [
            {
              "q": "What does Deep CCA add to classical linear CCA?",
              "options": [
                "Deep neural network view encoders",
                "L1 sparse dictionaries",
                "Probes",
                "Attention layers"
              ],
              "a": 0,
              "explain": "Deep CCA replaces linear projections with deep neural encoders."
            },
            {
              "q": "Why are covariance whitening constraints necessary in DCCA?",
              "options": [
                "Prevents representation collapse into constant vectors",
                "Increases L0 sparsity",
                "Computes SVD",
                "Speeds up GPU"
              ],
              "a": 0,
              "explain": "Constraints prevent trivial constant solutions where output covariance collapses."
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
            "whyWeRead": "DCCAE illuminates the central tradeoff for SetConCA: balancing cross-view alignment correlation against within-view reconstruction fidelity.",
            "oneSentence": "Deep Canonically Correlated Autoencoders (DCCAE) combine cross-view correlation maximization with autoencoder reconstruction losses.",
            "plainLanguage": "Welcome to the DCCAE Masterclass. Let's understand why Weiran Wang et al. introduced DCCAE in 2015.\n\n--- THE MULTI-VIEW DILEMMA ---\nIn Deep CCA, you maximize cross-view correlation. But correlation-only training discards view-specific (private) information.\nIn standard Autoencoders, you maximize within-view reconstruction. But autoencoders trained independently never align their representations across views!\n\n--- THE DCCAE SYNTHESIS ---\nDCCAE solves this dilemma by combining BOTH objectives into a single unified loss function:\n\nLoss = - Canonical_Correlation(z_1, z_2) + λ_1 ||x_1 - dec_1(z_1)||² + λ_2 ||x_2 - dec_2(z_2)||²\n\n• The CCA term pulls shared representations into cross-view alignment.\n• The Autoencoder reconstruction terms FORCE each encoder to retain enough private detail to reconstruct raw inputs!\n\n--- LESSON FOR SETCONCA ---\nSetConCA faces this exact same tension! When coordinating sparse autoencoders across multiple activation views, you must balance contrastive set alignment against within-view reconstruction (FVU). Tuning λ traces out an alignment-fidelity Pareto curve.",
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
                "name": "DCCAE Combined Loss",
                "formula": "Loss = - corr(z_1, z_2) + λ ( ||x_1 - x̂_1||² + ||x_2 - x̂_2||² )",
                "original": "DCCAE Combined Loss: Loss = - corr(z_1, z_2) + λ ( ||x_1 - x̂_1||² + ||x_2 - x̂_2||² )",
                "simple": "Trade off cross-view canonical correlation against individual view reconstruction errors.",
                "meaning": "Trade off cross-view canonical correlation against individual view reconstruction errors."
              }
            ],
            "vocabulary": [
              {
                "term": "DCCAE",
                "original": "Technical term: «DCCAE» as used in this literature.",
                "simple": "Deep Canonically Correlated Autoencoders; multi-view model combining correlation and autoencoding.",
                "def": "Deep Canonically Correlated Autoencoders; multi-view model combining correlation and autoencoding."
              }
            ],
            "whatItShows": [
              "That combining alignment and reconstruction objectives preserves both shared and private information"
            ],
            "whatItDoesNotShow": [
              "The optimal hyperparameter λ for sparse autoencoders on language model activations"
            ],
            "setconcaUse": [
              "Always include reconstruction loss when adding contrastive alignment to SAEs.",
              "Sweep alignment weight λ and plot alignment vs. FVU Pareto curves."
            ],
            "masteryChecklist": [
              "I can explain why correlation-only multi-view training is dangerous.",
              "I can write the combined DCCAE loss function and explain both parts."
            ],
            "commonConfusions": [
              {
                "wrong": "Cross-view alignment replaces the need for reconstruction loss.",
                "right": "Alignment alone discards private information. You need reconstruction to preserve activation detail."
              }
            ],
            "quiz": [
              {
                "q": "What does DCCAE add to Deep CCA?",
                "options": [
                  "Autoencoder reconstruction losses for each view",
                  "TopK sparsity",
                  "Linear probes",
                  "Random dropout"
                ],
                "a": 0,
                "explain": "DCCAE adds within-view reconstruction losses to protect private information."
              }
            ],
            "originalIdea": "Deep Canonically Correlated Autoencoders (DCCAE) combine cross-view correlation maximization with autoencoder reconstruction losses.",
            "simpleLesson": "Welcome to the DCCAE Masterclass. Let's understand why Weiran Wang et al. introduced DCCAE in 2015.\n\n--- THE MULTI-VIEW DILEMMA ---\nIn Deep CCA, you maximize cross-view correlation. But correlation-only training discards view-specific (private) information.\nIn standard Autoencoders, you maximize within-view reconstruction. But autoencoders trained independently never align their representations across views!\n\n--- THE DCCAE SYNTHESIS ---\nDCCAE solves this dilemma by combining BOTH objectives into a single unified loss function:\n\nLoss = - Canonical_Correlation(z_1, z_2) + λ_1 ||x_1 - dec_1(z_1)||² + λ_2 ||x_2 - dec_2(z_2)||²\n\n• The CCA term pulls shared representations into cross-view alignment.\n• The Autoencoder reconstruction terms FORCE each encoder to retain enough private detail to reconstruct raw inputs!\n\n--- LESSON FOR SETCONCA ---\nSetConCA faces this exact same tension! When coordinating sparse autoencoders across multiple activation views, you must balance contrastive set alignment against within-view reconstruction (FVU). Tuning λ traces out an alignment-fidelity Pareto curve.",
            "limitPairs": [
              {
                "original": "That combining alignment and reconstruction objectives preserves both shared and private information",
                "simple": "In practice this means evidence supports: That combining alignment and reconstruction objectives preserves both shared and private information"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "The optimal hyperparameter λ for sparse autoencoders on language model activations",
                "simple": "Do not overclaim: The optimal hyperparameter λ for sparse autoencoders on language model activations"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Always include reconstruction loss when adding contrastive alignment to SAEs.",
                "simple": "Action item: Always include reconstruction loss when adding contrastive alignment to SAEs."
              },
              {
                "original": "Sweep alignment weight λ and plot alignment vs. FVU Pareto curves.",
                "simple": "Action item: Sweep alignment weight λ and plot alignment vs. FVU Pareto curves."
              }
            ]
          },
          "quiz": [
            {
              "q": "What does DCCAE add to Deep CCA?",
              "options": [
                "Autoencoder reconstruction losses for each view",
                "TopK sparsity",
                "Linear probes",
                "Random dropout"
              ],
              "a": 0,
              "explain": "DCCAE adds within-view reconstruction losses to protect private information."
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
            "whyWeRead": "VCCA introduces explicit shared and private latent variable factorizations in a probabilistic multi-view generative model.",
            "oneSentence": "Deep Variational CCA models multi-view data using variational inference with explicit shared and private latent variables.",
            "plainLanguage": "Welcome to the VCCA Masterclass. Let's understand how Weiran Wang et al. (2016) formalized multi-view learning probablistically.\n\n--- EXPLICIT SHARED AND PRIVATE LATENTS ---\nRather than hoping a single latent vector contains a mixture of shared and private information, VCCA EXPLICITLY SPLITS the latent representation into separate vectors:\n• z_shared: Shared latent vector explaining commonality across all views.\n• z_priv1: Private latent vector explaining view 1 details.\n• z_priv2: Private latent vector explaining view 2 details.\n\nView 1 is decoded from (z_shared, z_priv1). View 2 is decoded from (z_shared, z_priv2).\n\n--- HANDLING MISSING VIEWS ---\nBecause VCCA is a probabilistic generative model, if View 2 is missing at test time, the model can still infer z_shared from View 1 alone! This provides robustness against incomplete view sets.",
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
            "simplifiedMath": [],
            "vocabulary": [
              {
                "term": "Private Latent",
                "original": "Technical term: «Private Latent» as used in this literature.",
                "simple": "A latent variable dedicated strictly to modeling variance unique to a single view.",
                "def": "A latent variable dedicated strictly to modeling variance unique to a single view."
              },
              {
                "term": "VCCA",
                "original": "Technical term: «VCCA» as used in this literature.",
                "simple": "Variational Deep Canonical Correlation Analysis.",
                "def": "Variational Deep Canonical Correlation Analysis."
              }
            ],
            "whatItShows": [
              "How to explicitly factorize multi-view representations into shared and private probabilistic latents"
            ],
            "whatItDoesNotShow": [
              "How to discover sparse monosemantic dictionaries"
            ],
            "setconcaUse": [
              "Incorporate explicit shared/private split designs when building multi-view SAE architectures.",
              "Test SetConCA robustness under missing view conditions."
            ],
            "masteryChecklist": [
              "I can draw the VCCA generative diagram showing shared and private latents.",
              "I can explain how VCCA handles missing views."
            ],
            "commonConfusions": [
              {
                "wrong": "Shared latent means view embeddings are identical.",
                "right": "Shared latent models common underlying factors; private latents model view differences."
              }
            ],
            "quiz": [
              {
                "q": "VCCA's private latents capture what type of information?",
                "options": [
                  "View-specific variance unique to one view",
                  "Shared correlation",
                  "Label noise only",
                  "TopK indices"
                ],
                "a": 0,
                "explain": "Private latents explicitly capture view-specific details."
              }
            ],
            "originalIdea": "Deep Variational CCA models multi-view data using variational inference with explicit shared and private latent variables.",
            "simpleLesson": "Welcome to the VCCA Masterclass. Let's understand how Weiran Wang et al. (2016) formalized multi-view learning probablistically.\n\n--- EXPLICIT SHARED AND PRIVATE LATENTS ---\nRather than hoping a single latent vector contains a mixture of shared and private information, VCCA EXPLICITLY SPLITS the latent representation into separate vectors:\n• z_shared: Shared latent vector explaining commonality across all views.\n• z_priv1: Private latent vector explaining view 1 details.\n• z_priv2: Private latent vector explaining view 2 details.\n\nView 1 is decoded from (z_shared, z_priv1). View 2 is decoded from (z_shared, z_priv2).\n\n--- HANDLING MISSING VIEWS ---\nBecause VCCA is a probabilistic generative model, if View 2 is missing at test time, the model can still infer z_shared from View 1 alone! This provides robustness against incomplete view sets.",
            "limitPairs": [
              {
                "original": "How to explicitly factorize multi-view representations into shared and private probabilistic latents",
                "simple": "In practice this means evidence supports: How to explicitly factorize multi-view representations into shared and private probabilistic latents"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "How to discover sparse monosemantic dictionaries",
                "simple": "Do not overclaim: How to discover sparse monosemantic dictionaries"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Incorporate explicit shared/private split designs when building multi-view SAE architectures.",
                "simple": "Action item: Incorporate explicit shared/private split designs when building multi-view SAE architectures."
              },
              {
                "original": "Test SetConCA robustness under missing view conditions.",
                "simple": "Action item: Test SetConCA robustness under missing view conditions."
              }
            ]
          },
          "quiz": [
            {
              "q": "VCCA's private latents capture what type of information?",
              "options": [
                "View-specific variance unique to one view",
                "Shared correlation",
                "Label noise only",
                "TopK indices"
              ],
              "a": 0,
              "explain": "Private latents explicitly capture view-specific details."
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
            "whyWeRead": "DGCCA extends CCA thinking from 2 views to an arbitrary number of views (N views) — essential for multi-view set coordination.",
            "oneSentence": "Deep Generalized CCA learns a central common representation across an arbitrary number of neural view encoders.",
            "plainLanguage": "Welcome to DGCCA. What happens when you have 5 layers, 10 prompt paraphrases, or 4 image modalities?\n\nPairwise CCA requires N(N-1)/2 separate pairwise models. Deep Generalized CCA (DGCCA, Benton et al., 2017) introduces a single central target matrix G. Every view encoder f_i(X_i) is trained to project into this common shared matrix G simultaneously!",
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
                "term": "DGCCA",
                "original": "Technical term: «DGCCA» as used in this literature.",
                "simple": "Deep Generalized Canonical Correlation Analysis for N > 2 views.",
                "def": "Deep Generalized Canonical Correlation Analysis for N > 2 views."
              }
            ],
            "whatItShows": [
              "How to scale multi-view alignment to arbitrary numbers of views"
            ],
            "whatItDoesNotShow": [
              "Sparse dictionary dictionary learning"
            ],
            "setconcaUse": [
              "Use DGCCA conceptual framework when extending SetConCA beyond pairs to multi-view activation sets."
            ],
            "masteryChecklist": [
              "I can explain why pairwise CCA scales poorly for N views and how DGCCA solves it."
            ],
            "commonConfusions": [
              {
                "wrong": "DGCCA forces all views to output identical vectors.",
                "right": "DGCCA aligns view projections with a shared central target space G."
              }
            ],
            "quiz": [
              {
                "q": "DGCCA is designed for how many views?",
                "options": [
                  "Arbitrary N views (N ≥ 2)",
                  "Exactly 2 views only",
                  "1 view only",
                  "0 views"
                ],
                "a": 0,
                "explain": "DGCCA generalizes CCA to arbitrary numbers of views."
              }
            ],
            "originalIdea": "Deep Generalized CCA learns a central common representation across an arbitrary number of neural view encoders.",
            "simpleLesson": "Welcome to DGCCA. What happens when you have 5 layers, 10 prompt paraphrases, or 4 image modalities?\n\nPairwise CCA requires N(N-1)/2 separate pairwise models. Deep Generalized CCA (DGCCA, Benton et al., 2017) introduces a single central target matrix G. Every view encoder f_i(X_i) is trained to project into this common shared matrix G simultaneously!",
            "limitPairs": [
              {
                "original": "How to scale multi-view alignment to arbitrary numbers of views",
                "simple": "In practice this means evidence supports: How to scale multi-view alignment to arbitrary numbers of views"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "Sparse dictionary dictionary learning",
                "simple": "Do not overclaim: Sparse dictionary dictionary learning"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Use DGCCA conceptual framework when extending SetConCA beyond pairs to multi-view activation sets.",
                "simple": "Action item: Use DGCCA conceptual framework when extending SetConCA beyond pairs to multi-view activation sets."
              }
            ]
          },
          "quiz": [
            {
              "q": "DGCCA is designed for how many views?",
              "options": [
                "Arbitrary N views (N ≥ 2)",
                "Exactly 2 views only",
                "1 view only",
                "0 views"
              ],
              "a": 0,
              "explain": "DGCCA generalizes CCA to arbitrary numbers of views."
            }
          ]
        }
      ],
      "primer": {
        "title": "Nonlinear multi-view representation learning",
        "mission": "Master Deep CCA, DCCAE, VCCA, and DGCCA. Learn how to separate shared cross-view information from private view-specific information.",
        "beforeYouStart": "Level 1 CCA and Level 2 Autoencoders.",
        "primer": "Welcome to Level 3. What is a 'view'? A view is one observation of an underlying object. In AI research, multiple views arise naturally:\n• Two different layers of a transformer processing the same text.\n• Two different prompt paraphrases expressing the same concept ('A photo of a dog' vs 'An image showing a canine').\n• Two different modalities (e.g. image + caption in CLIP).\n\nIn Level 1, we learned linear CCA. But neural networks process data nonlinearly. How do we extend multi-view alignment to deep neural networks?\n\n--- STEP 1: Deep CCA (Andrew et al., 2013) ---\nDeep CCA places a neural network encoder f_θ on View 1 and a neural network encoder g_φ on View 2. The objective trains both networks simultaneously to maximize the canonical correlation between their output embeddings!\n\nThe Whitening Constraint in DCCA:\nIf you simply maximize cosine similarity between network outputs without constraints, the networks can cheat by collapsing all outputs into a single constant vector (representation collapse)! DCCA prevents this by enforcing a covariance constraint (whitening): the output dimensions of each view must have unit variance and zero correlation with each other.\n\n--- STEP 2: The Critical Danger of DCCA — Information Discard ---\nSuppose View 1 is a detailed text description of a scene and View 2 is a low-resolution thumbnail image. If your ONLY objective is to maximize correlation between the two views, what will the text encoder do?\nIt will THROW AWAY 90% of the text details (specific names, dates, fine details) because those details do not exist in the thumbnail image! Correlation-only objectives erase useful view-specific (private) information.\n\n--- STEP 3: DCCAE (Wang et al., 2015) — Balancing Alignment and Reconstruction ---\nTo solve the information discard problem, Deep Canonically Correlated Autoencoders (DCCAE) add an autoencoding reconstruction loss to each view!\n\nDCCAE Loss = - Canonical_Correlation(z_A, z_B) + λ * (||x_A - dec_A(z_A)||² + ||x_B - dec_B(z_B)||²)\n\nNow the model is forced to find a shared code z that aligns across views while preserving enough internal information to reconstruct each raw view!\n\n--- STEP 4: VCCA & DGCCA — Probabilistic Shared/Private Latents & Many Views ---\n• VCCA (Wang et al., 2016) explicitly splits the latent representation into TWO parts: a Shared Latent z_shared (explaining what is common) and Private Latents z_privA, z_privB (explaining view-specific details). View A is reconstructed from (z_shared, z_privA).\n• DGCCA (Benton et al., 2017) extends GCCA to deep networks for 3, 4, or 100 views, learning a single central shared representation matrix G that all view encoders target.\n\nSETCONCA MANDATE:\nNever force all view representations to become identical. A healthy multi-view representation aligns shared concept directions while preserving view-specific details!",
        "bigPictureDiagram": [
          "View A (x_A) → Encoder f_θ → z_A ──┐",
          "                                    ├─→ Maximize Cross-View Correlation",
          "View B (x_B) → Encoder g_φ → z_B ──┘",
          "DCCAE Addition: z_A → Decoder_A → x_hat_A  |  z_B → Decoder_B → x_hat_B (Preserves private info!)",
          "VCCA Explicit Split: z = [z_shared | z_private]"
        ],
        "conceptsToMaster": [
          {
            "name": "Shared vs. Private Information",
            "simple": "Shared = what is common across all views. Private = view-specific details that exist in only one view.",
            "deeper": "In multi-view setup (X_1, X_2), I(X_1; X_2) is shared information. I(X_1; X_1 | X_2) is private information of view 1. Maximizing multi-view correlation targets shared info but risks destroying private info unless reconstruction losses are included."
          },
          {
            "name": "Covariance / Whitening Constraints",
            "simple": "Forcing latent dimensions to be uncorrelated and normalized so the network cannot cheat by collapsing.",
            "deeper": "DCCA requires 1/N Z_A^T Z_A = I and 1/N Z_B^T Z_B = I. Prevents trivial solution where all output coordinates become identical or scalar multiples."
          },
          {
            "name": "DCCAE Tradeoff",
            "simple": "The hyperparameter balancing cross-view alignment correlation against within-view reconstruction quality.",
            "deeper": "Loss = -CCA_loss(f(X_1), g(X_2)) + λ_1 ||X_1 - dec_1(f(X_1))||^2 + λ_2 ||X_2 - dec_2(g(X_2))||^2. Tuning λ traces out an alignment-fidelity Pareto frontier."
          },
          {
            "name": "Generalized CCA (DGCCA)",
            "simple": "Extending CCA math from 2 views to an arbitrary number of views (e.g. 5 layers or 10 prompt views).",
            "deeper": "DGCCA optimizes min_G sum_i ||G - U_i^T f_i(X_i)||_F^2 where G is a shared target representation matrix and U_i are view-specific projections."
          }
        ],
        "checkpoint": {
          "goal": "Implement a shared vs private latent decomposition on a 2-view synthetic dataset.",
          "steps": [
            "Generate synthetic paired views with known shared factors and view-specific noise.",
            "Train a DCCA model (correlation only) versus a DCCAE model (correlation + reconstruction).",
            "Test downstream retrieval (shared task) and view reconstruction (private task)."
          ],
          "successLooksLike": "You can demonstrate visually how pure DCCA discards private details while DCCAE retains both."
        },
        "bridgeToNext": "In Level 3, views had fixed pairings (View A & View B). In Level 4, views form an UNORDERED SET — requiring Set Representation architectures."
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
            "whyWeRead": "Deep Sets provides the fundamental mathematical theory for constructing permutation-invariant set representations.",
            "oneSentence": "Proves that any continuous permutation-invariant set function can be factorized as f(X) = ρ( Σ_{x∈X} φ(x) ).",
            "plainLanguage": "Welcome to the Deep Sets Masterclass. Let's understand why Manzil Zaheer et al. published this landmark paper in 2017.\n\n--- WHAT IS A SET? ---\nA set is an UNORDERED collection of items: X = {x_1, x_2, ..., x_N}. The set {A, B, C} is IDENTICAL to {C, A, B}.\n\n--- WHY STANDARD NEURAL NETWORKS FAIL ON SETS ---\nIf you concatenate set elements [x_1, x_2, x_3] into a standard MLP, the network treats input position 1 differently from position 2! If you swap inputs, the output changes. That violates the mathematical definition of a set function.\n\n--- THE DEEP SETS THEOREM ---\nZaheer et al. proved that ANY valid permutation-invariant function f(X) can be decomposed into three clean steps:\n1. Element Encoder φ: Map each set member x_i independently through a neural network φ(x_i).\n2. Commutative Aggregation: Sum (or average) the encodings: Σ φ(x_i).\n3. Set Decoder ρ: Map the aggregated sum vector through a post-processing network ρ.\n\nFormula: f(X) = ρ( Σ_{x ∈ X} φ(x) )\n\nWhy SUM/MEAN pooling guarantees invariance: Addition is commutative (a + b = b + a). The sum is 100% identical regardless of input order!\n\nFOR SETCONCA:\nDeep Sets (mean pooling over φ(x_i)) is the foundational aggregator for combining multiple activation views into one concept code.",
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
                "name": "Deep Sets Universal Form",
                "formula": "f(X) = ρ( Σ_{x ∈ X} φ(x) )",
                "original": "Deep Sets Universal Form: f(X) = ρ( Σ_{x ∈ X} φ(x) )",
                "simple": "Process elements with φ, sum pool, then transform with ρ.",
                "meaning": "Process elements with φ, sum pool, then transform with ρ."
              }
            ],
            "vocabulary": [
              {
                "term": "Permutation Invariance",
                "original": "Technical term: «Permutation Invariance» as used in this literature.",
                "simple": "The property that input order does not alter output.",
                "def": "The property that input order does not alter output."
              },
              {
                "term": "Permutation Equivariance",
                "original": "Technical term: «Permutation Equivariance» as used in this literature.",
                "simple": "The property that permuting inputs permutes outputs identically.",
                "def": "The property that permuting inputs permutes outputs identically."
              }
            ],
            "whatItShows": [
              "The exact architectural requirement for universal permutation-invariant set learning"
            ],
            "whatItDoesNotShow": [
              "That simple mean pooling is sufficient when element relationships matter"
            ],
            "setconcaUse": [
              "Use Deep Sets (mean pooling of φ(x)) as the baseline set aggregator in SetConCA."
            ],
            "masteryChecklist": [
              "I can write the Deep Sets formula and explain φ, Σ, and ρ.",
              "I can explain why addition guarantees permutation invariance."
            ],
            "commonConfusions": [
              {
                "wrong": "Concatenating set items into an MLP works fine for sets.",
                "right": "Concatenation encodes arbitrary order. Deep Sets sum pooling is required for true set invariance."
              }
            ],
            "quiz": [
              {
                "q": "What is the core Deep Sets formula?",
                "options": [
                  "ρ( Σ φ(x) )",
                  "TopK(x)",
                  "CCA(x,y)",
                  "InfoNCE(q,k)"
                ],
                "a": 0,
                "explain": "Deep Sets factorizes set functions as ρ( Σ φ(x) )."
              }
            ],
            "originalIdea": "Proves that any continuous permutation-invariant set function can be factorized as f(X) = ρ( Σ_{x∈X} φ(x) ).",
            "simpleLesson": "Welcome to the Deep Sets Masterclass. Let's understand why Manzil Zaheer et al. published this landmark paper in 2017.\n\n--- WHAT IS A SET? ---\nA set is an UNORDERED collection of items: X = {x_1, x_2, ..., x_N}. The set {A, B, C} is IDENTICAL to {C, A, B}.\n\n--- WHY STANDARD NEURAL NETWORKS FAIL ON SETS ---\nIf you concatenate set elements [x_1, x_2, x_3] into a standard MLP, the network treats input position 1 differently from position 2! If you swap inputs, the output changes. That violates the mathematical definition of a set function.\n\n--- THE DEEP SETS THEOREM ---\nZaheer et al. proved that ANY valid permutation-invariant function f(X) can be decomposed into three clean steps:\n1. Element Encoder φ: Map each set member x_i independently through a neural network φ(x_i).\n2. Commutative Aggregation: Sum (or average) the encodings: Σ φ(x_i).\n3. Set Decoder ρ: Map the aggregated sum vector through a post-processing network ρ.\n\nFormula: f(X) = ρ( Σ_{x ∈ X} φ(x) )\n\nWhy SUM/MEAN pooling guarantees invariance: Addition is commutative (a + b = b + a). The sum is 100% identical regardless of input order!\n\nFOR SETCONCA:\nDeep Sets (mean pooling over φ(x_i)) is the foundational aggregator for combining multiple activation views into one concept code.",
            "limitPairs": [
              {
                "original": "The exact architectural requirement for universal permutation-invariant set learning",
                "simple": "In practice this means evidence supports: The exact architectural requirement for universal permutation-invariant set learning"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That simple mean pooling is sufficient when element relationships matter",
                "simple": "Do not overclaim: That simple mean pooling is sufficient when element relationships matter"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Use Deep Sets (mean pooling of φ(x)) as the baseline set aggregator in SetConCA.",
                "simple": "Action item: Use Deep Sets (mean pooling of φ(x)) as the baseline set aggregator in SetConCA."
              }
            ]
          },
          "quiz": [
            {
              "q": "What is the core Deep Sets formula?",
              "options": [
                "ρ( Σ φ(x) )",
                "TopK(x)",
                "CCA(x,y)",
                "InfoNCE(q,k)"
              ],
              "a": 0,
              "explain": "Deep Sets factorizes set functions as ρ( Σ φ(x) )."
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
            "whyWeRead": "Neural Statistician treats an entire dataset or set as a single probabilistic object with a latent code.",
            "oneSentence": "Learns latent representations of entire datasets/sets to capture underlying generative distributions.",
            "plainLanguage": "Welcome to Neural Statistician (Edwards & Storkey, 2016). Instead of creating a latent vector for a single image, what if your goal is to represent an ENTIRE DATASET or BAG OF VIEWS as a single latent statistic?\n\nNeural Statistician builds a statistic network that pools summary statistics across a set to infer a set-level latent c. The set code c represents the underlying probability distribution that generated the set items.",
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
                "term": "Set Latent",
                "original": "Technical term: «Set Latent» as used in this literature.",
                "simple": "A latent code representing an entire set or distribution of items.",
                "def": "A latent code representing an entire set or distribution of items."
              }
            ],
            "whatItShows": [
              "That entire sets can be represented as latent probabilistic objects"
            ],
            "whatItDoesNotShow": [
              "How to construct sparse autoencoder dictionaries"
            ],
            "setconcaUse": [
              "Inspiration for defining what a SetConCA concept code should capture across activation view sets."
            ],
            "masteryChecklist": [
              "I can explain the difference between an item latent and a set latent."
            ],
            "commonConfusions": [
              {
                "wrong": "A set representation must reconstruct every individual member perfectly.",
                "right": "Set latents can target the shared generative distribution rather than raw member noise."
              }
            ],
            "quiz": [
              {
                "q": "Neural Statistician primarily represents what object as a latent code?",
                "options": [
                  "An entire set/dataset",
                  "A single pixel",
                  "A linear probe",
                  "A single token"
                ],
                "a": 0,
                "explain": "Neural Statistician represents an entire set/dataset as a latent object."
              }
            ],
            "originalIdea": "Learns latent representations of entire datasets/sets to capture underlying generative distributions.",
            "simpleLesson": "Welcome to Neural Statistician (Edwards & Storkey, 2016). Instead of creating a latent vector for a single image, what if your goal is to represent an ENTIRE DATASET or BAG OF VIEWS as a single latent statistic?\n\nNeural Statistician builds a statistic network that pools summary statistics across a set to infer a set-level latent c. The set code c represents the underlying probability distribution that generated the set items.",
            "limitPairs": [
              {
                "original": "That entire sets can be represented as latent probabilistic objects",
                "simple": "In practice this means evidence supports: That entire sets can be represented as latent probabilistic objects"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "How to construct sparse autoencoder dictionaries",
                "simple": "Do not overclaim: How to construct sparse autoencoder dictionaries"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Inspiration for defining what a SetConCA concept code should capture across activation view sets.",
                "simple": "Action item: Inspiration for defining what a SetConCA concept code should capture across activation view sets."
              }
            ]
          },
          "quiz": [
            {
              "q": "Neural Statistician primarily represents what object as a latent code?",
              "options": [
                "An entire set/dataset",
                "A single pixel",
                "A linear probe",
                "A single token"
              ],
              "a": 0,
              "explain": "Neural Statistician represents an entire set/dataset as a latent object."
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
            "whyWeRead": "Set Transformer handles sets where meaning depends on INTERACTIONS among members, outperforming independent Deep Sets pooling.",
            "oneSentence": "An attention-based permutation-invariant network using self-attention over set members and inducing points for efficiency.",
            "plainLanguage": "Welcome to the Set Transformer Masterclass. Let me explain why Juho Lee et al. invented Set Transformer in 2019.\n\n--- WHERE DEEP SETS STRUGGLES ---\nDeep Sets encodes every set member in COMPLETE ISOLATION (φ(x_i)) before sum pooling. But what if the meaning of a set depends on PAIRWISE RELATIONSHIPS between members?\nExample: If an intruder/outlier activation is added to a set, Deep Sets blindly adds the intruder into the sum, corrupting the set representation!\n\n--- THE SET TRANSFORMER SOLUTION ---\nSet Transformer lets set members ATTEND TO EACH OTHER using Self-Attention before pooling!\nMembers can compare values, identify outliers, and weight contributions dynamically. To maintain permutation invariance, Set Transformer uses Pooling by Multihead Attention (PMA) with learned seed vectors.\n\n--- INDUCING POINTS (ISAB) FOR COMPUTATIONAL EFFICIENCY ---\nStandard self-attention over N set members costs O(N²) memory/compute. For large sets, this is expensive.\nSet Transformer introduces Induced Set Attention Blocks (ISAB): members attend to M learned 'Inducing Points' (where M << N), reducing computational complexity from O(N²) to O(N M)!",
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
            "simplifiedMath": [
              {
                "name": "ISAB Complexity",
                "formula": "O(N · M)  where M << N",
                "original": "ISAB Complexity: O(N · M)  where M << N",
                "simple": "Linear scaling w.r.t set size N using M inducing points.",
                "meaning": "Linear scaling w.r.t set size N using M inducing points."
              }
            ],
            "vocabulary": [
              {
                "term": "Inducing Points",
                "original": "Technical term: «Inducing Points» as used in this literature.",
                "simple": "Learned memory vectors acting as attention bottlenecks to speed up set self-attention.",
                "def": "Learned memory vectors acting as attention bottlenecks to speed up set self-attention."
              },
              {
                "term": "PMA",
                "original": "Technical term: «PMA» as used in this literature.",
                "simple": "Pooling by Multihead Attention; attention-based set aggregation operator.",
                "def": "Pooling by Multihead Attention; attention-based set aggregation operator."
              }
            ],
            "whatItShows": [
              "That interaction-aware attention pooling beats independent sum pooling on relational set tasks"
            ],
            "whatItDoesNotShow": [
              "That attention pooling is always necessary for simple independent set averages"
            ],
            "setconcaUse": [
              "Use Set Transformer as the relational aggregator when view sets contain intruders or complex view interactions."
            ],
            "masteryChecklist": [
              "I can contrast Deep Sets independent pooling with Set Transformer self-attention.",
              "I understand how Inducing Points reduce computational cost."
            ],
            "commonConfusions": [
              {
                "wrong": "Set Transformer loses permutation invariance because it uses attention.",
                "right": "Self-attention is permutation-equivariant, and PMA pooling with learned seeds ensures complete permutation invariance."
              }
            ],
            "quiz": [
              {
                "q": "What key mechanism does Set Transformer add over Deep Sets?",
                "options": [
                  "Self-attention over set members before pooling",
                  "L1 penalty",
                  "PCA reduction",
                  "Linear probing"
                ],
                "a": 0,
                "explain": "Set Transformer allows members to interact via self-attention before pooling."
              },
              {
                "q": "What is the computational benefit of Inducing Points (ISAB)?",
                "options": [
                  "Reduces self-attention complexity from O(N²) to O(N M)",
                  "Increases L0 sparsity",
                  "Eliminates decoder",
                  "Computes CKA"
                ],
                "a": 0,
                "explain": "Inducing points reduce self-attention complexity to linear scaling O(N M)."
              }
            ],
            "originalIdea": "An attention-based permutation-invariant network using self-attention over set members and inducing points for efficiency.",
            "simpleLesson": "Welcome to the Set Transformer Masterclass. Let me explain why Juho Lee et al. invented Set Transformer in 2019.\n\n--- WHERE DEEP SETS STRUGGLES ---\nDeep Sets encodes every set member in COMPLETE ISOLATION (φ(x_i)) before sum pooling. But what if the meaning of a set depends on PAIRWISE RELATIONSHIPS between members?\nExample: If an intruder/outlier activation is added to a set, Deep Sets blindly adds the intruder into the sum, corrupting the set representation!\n\n--- THE SET TRANSFORMER SOLUTION ---\nSet Transformer lets set members ATTEND TO EACH OTHER using Self-Attention before pooling!\nMembers can compare values, identify outliers, and weight contributions dynamically. To maintain permutation invariance, Set Transformer uses Pooling by Multihead Attention (PMA) with learned seed vectors.\n\n--- INDUCING POINTS (ISAB) FOR COMPUTATIONAL EFFICIENCY ---\nStandard self-attention over N set members costs O(N²) memory/compute. For large sets, this is expensive.\nSet Transformer introduces Induced Set Attention Blocks (ISAB): members attend to M learned 'Inducing Points' (where M << N), reducing computational complexity from O(N²) to O(N M)!",
            "limitPairs": [
              {
                "original": "That interaction-aware attention pooling beats independent sum pooling on relational set tasks",
                "simple": "In practice this means evidence supports: That interaction-aware attention pooling beats independent sum pooling on relational set tasks"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That attention pooling is always necessary for simple independent set averages",
                "simple": "Do not overclaim: That attention pooling is always necessary for simple independent set averages"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Use Set Transformer as the relational aggregator when view sets contain intruders or complex view interactions.",
                "simple": "Action item: Use Set Transformer as the relational aggregator when view sets contain intruders or complex view interactions."
              }
            ]
          },
          "quiz": [
            {
              "q": "What key mechanism does Set Transformer add over Deep Sets?",
              "options": [
                "Self-attention over set members before pooling",
                "L1 penalty",
                "PCA reduction",
                "Linear probing"
              ],
              "a": 0,
              "explain": "Set Transformer allows members to interact via self-attention before pooling."
            },
            {
              "q": "What is the computational benefit of Inducing Points (ISAB)?",
              "options": [
                "Reduces self-attention complexity from O(N²) to O(N M)",
                "Increases L0 sparsity",
                "Eliminates decoder",
                "Computes CKA"
              ],
              "a": 0,
              "explain": "Inducing points reduce self-attention complexity to linear scaling O(N M)."
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
            "whyWeRead": "Advanced reading for modeling relationships between multiple distinct sets, extending single-set attention.",
            "oneSentence": "Learning Functions on Multiple Sets using Multi-Set Transformers models interactions within and between several input sets.",
            "plainLanguage": "Welcome to Multi-Set Transformer (Selby et al., 2022). Standard Set Transformer operates on a single set. Multi-Set Transformers handle functions that operate on MULTIPLE SETS simultaneously (e.g. Set A vs. Set B).\n\nUses cross-set attention to model relational structure between different set collections.",
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
                "term": "Multi-Set Function",
                "original": "Technical term: «Multi-Set Function» as used in this literature.",
                "simple": "A function taking multiple sets as arguments and operating symmetrically within and across sets.",
                "def": "A function taking multiple sets as arguments and operating symmetrically within and across sets."
              }
            ],
            "whatItShows": [
              "How to model relationships between multiple input sets using attention"
            ],
            "whatItDoesNotShow": [
              "Necessity for simple single-set activation view pooling"
            ],
            "setconcaUse": [
              "Optional extension for modeling relationships between multiple distinct concept-sets."
            ],
            "masteryChecklist": [
              "I know when multi-set models are needed over single-set aggregators."
            ],
            "commonConfusions": [
              {
                "wrong": "Required for basic SetConCA.",
                "right": "Optional advanced extension; single-set aggregation comes first."
              }
            ],
            "quiz": [
              {
                "q": "Multi-Set Transformers model relationships between?",
                "options": [
                  "Multiple distinct input sets",
                  "Single vectors only",
                  "Scalar numbers",
                  "PCA axes"
                ],
                "a": 0,
                "explain": "Models interactions within and across multiple input sets."
              }
            ],
            "originalIdea": "Learning Functions on Multiple Sets using Multi-Set Transformers models interactions within and between several input sets.",
            "simpleLesson": "Welcome to Multi-Set Transformer (Selby et al., 2022). Standard Set Transformer operates on a single set. Multi-Set Transformers handle functions that operate on MULTIPLE SETS simultaneously (e.g. Set A vs. Set B).\n\nUses cross-set attention to model relational structure between different set collections.",
            "limitPairs": [
              {
                "original": "How to model relationships between multiple input sets using attention",
                "simple": "In practice this means evidence supports: How to model relationships between multiple input sets using attention"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "Necessity for simple single-set activation view pooling",
                "simple": "Do not overclaim: Necessity for simple single-set activation view pooling"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Optional extension for modeling relationships between multiple distinct concept-sets.",
                "simple": "Action item: Optional extension for modeling relationships between multiple distinct concept-sets."
              }
            ]
          },
          "quiz": [
            {
              "q": "Multi-Set Transformers model relationships between?",
              "options": [
                "Multiple distinct input sets",
                "Single vectors only",
                "Scalar numbers",
                "PCA axes"
              ],
              "a": 0,
              "explain": "Models interactions within and across multiple input sets."
            }
          ]
        }
      ],
      "primer": {
        "title": "Learning representations of sets",
        "mission": "Master permutation-invariant set architectures: Deep Sets, Neural Statistician, and Set Transformer.",
        "beforeYouStart": "Level 3 multi-view representations.",
        "primer": "Welcome to Level 4. What is a set? A set is an unordered collection of items: X = {x_1, x_2, ..., x_N}. The set {apple, banana, cherry} is EXACTLY THE SAME as {cherry, apple, banana}.\n\nWhy standard neural networks fail on sets:\nIf you feed a set into a standard MLP or RNN by concatenating elements [x_1, x_2, x_3], the network treats the order of elements as meaningful. Swapping the inputs changes the output! That is forbidden for set functions.\n\n--- STEP 1: Deep Sets (Zaheer et al., 2017) — The Universal Set Theorem ---\nZaheer et al. proved a mathematical theorem: ANY valid permutation-invariant function f(X) operating on an unordered set X can be decomposed into three steps:\n1. Process each element independently using a neural network φ(x_i).\n2. Aggregate (pool) the element representations using a commutative pooling operation (SUM or MEAN).\n3. Process the aggregated set vector using a post-processing network ρ.\n\nFormula: f(X) = ρ( Σ_{x ∈ X} φ(x) )\n\nWhy SUM / MEAN pooling works:\nAddition is commutative (a + b = b + a). Therefore, summing element vectors guarantees that input order cannot change the output!\n\n--- STEP 2: When Mean Pooling Fails — The Need for Set Transformer ---\nDeep Sets processes every set member in total isolation before summing. But what if the meaning of a set depends on RELATIONS between members?\nExample: Imagine a set of activations representing a context. If one member is an 'outlier/intruder' activation, simple mean pooling blends the intruder into the average, corrupting the set representation!\n\nSet Transformer (Lee et al., 2019):\nSet Transformer uses Self-Attention OVER set members before pooling! Members can attend to each other, allowing the network to compare items, suppress outliers, or highlight pairwise relationships. To maintain permutation invariance, Set Transformer uses Pooling by Multihead Attention (PMA) with learned seed vectors.\n\n--- STEP 3: Neural Statistician (Edwards & Storkey, 2016) ---\nInstead of outputting a single point vector for a set, Neural Statistician maps a set of observations to a LATENT STATISTICAL DISTRIBUTION capturing the dataset's generative structure.\n\nAPPLICATION TO SETCONCA:\nIn SetConCA, a single concept is observed across multiple activation views. How should we aggregate those views into one concept code? Deep Sets (mean pooling) is our baseline aggregator, and Set Transformer is our relational aggregator.",
        "bigPictureDiagram": [
          "Unordered Set {x_1, x_2, x_3}",
          "Deep Sets: φ(x_1) + φ(x_2) + φ(x_3) ──[SUM/MEAN]──→ Vector ──[ρ]──→ Set Code f(X)",
          "Set Transformer: {x_i} ──[Self-Attention over members]──→ {x_i'} ──[PMA Attention Pool]──→ Relational Set Code"
        ],
        "conceptsToMaster": [
          {
            "name": "Permutation Invariance",
            "simple": "The property that changing the order of input items does not change the network's output: f(π(X)) = f(X).",
            "deeper": "A function f: 2^X → Y is permutation invariant if for any permutation matrix P, f(PX) = f(X). Proved by Zaheer et al. to equal ρ(sum φ(x_i)) for continuous set functions."
          },
          {
            "name": "Permutation Equivariance",
            "simple": "Changing the order of input items changes the output items in the exact same order: f(π(X)) = π(f(X)).",
            "deeper": "Used when outputting a prediction for each member of a set (e.g. per-element scoring). Maintained by layerwise transformations that treat each element symmetrically."
          },
          {
            "name": "Inducing Points (in Set Transformer)",
            "simple": "A small set of learned memory vectors used in attention to reduce the computational cost of set self-attention from O(N²) to O(N * M).",
            "deeper": "Set Attention Blocks (SAB) cost O(N^2). Induced Set Attention Blocks (ISAB) project N elements onto M learned inducing vectors I via attention, then project back, reducing cost to O(N M)."
          },
          {
            "name": "Intruder / Outlier Robustness",
            "simple": "How well a set aggregator handles noise or an unrelated item inserted into the set.",
            "deeper": "Mean pooling is vulnerable to outliers (O(1/N) shift). Attention pooling can assign near-zero attention weights to intruder items, preserving set code integrity."
          }
        ],
        "checkpoint": {
          "goal": "Compare Mean Pooling, Deep Sets, and Set Transformer on a synthetic set task with intruder items.",
          "steps": [
            "Create set datasets where target label depends on pairwise member relationships.",
            "Inject 10% intruder (noise) vectors into each set.",
            "Train Deep Sets vs Set Transformer.",
            "Evaluate set classification accuracy and code stability under intruder presence."
          ],
          "successLooksLike": "You can demonstrate empirically why Set Transformer's attention mechanism resists intruder corruption better than Deep Sets mean pooling."
        },
        "bridgeToNext": "Now that you can represent sets of views, Level 5 teaches Contrastive Learning — how to pull related view sets together while pushing unrelated ones apart."
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
            "whyWeRead": "CPC introduced the InfoNCE loss function — the mathematical foundation for contrastive representation learning.",
            "oneSentence": "Learns representations by predicting future context using the contrastive InfoNCE objective.",
            "plainLanguage": "Welcome to the CPC / InfoNCE Masterclass. Let's understand Aaron van den Oord et al.'s (DeepMind 2018) breakthrough.\n\n--- THE CONTRASTIVE PREDICTION IDEA ---\nInstead of predicting raw future data pixels or tokens directly (which wastes capacity on fine noise), CPC predicts FUTURE REPRESENTATIONS by framing representation learning as a DISCRIMINATION TASK!\n\nGiven context query q, the model must select the true positive future sample k⁺ out of a minibatch containing 1 positive key and N-1 negative noise keys {k⁻}.\n\n--- THE INFONCE LOSS ---\nLoss = - log [ exp(qᵀ k⁺ / τ) / ( exp(qᵀ k⁺ / τ) + Σ exp(qᵀ k⁻_i / τ) ) ]\n\nThis is a softmax cross-entropy loss over cosine similarities scaled by temperature τ.\n\n--- MUTUAL INFORMATION BOUND ---\nVan den Oord et al. proved that minimizing InfoNCE loss MAXIMIZES A LOWER BOUND on the Mutual Information I(q; k⁺) between query and positive key:\nI(q; k⁺) ≥ log(K) - L_InfoNCE (where K is minibatch size).\n\nFOR SETCONCA:\nInfoNCE is the exact loss template used to coordinate sparse dictionary codes across multiple activation views.",
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
                "name": "InfoNCE Loss Formula",
                "formula": "L_{InfoNCE} = - log \\frac{\\exp(q \\cdot k^+ / \\tau)}{\\exp(q \\cdot k^+ / \\tau) + \\sum_{i} \\exp(q \\cdot k^-_i / \\tau)}",
                "original": "InfoNCE Loss Formula: L_{InfoNCE} = - log \\frac{\\exp(q \\cdot k^+ / \\tau)}{\\exp(q \\cdot k^+ / \\tau) + \\sum_{i} \\exp(q \\cdot k^-_i / \\tau)}",
                "simple": "Softmax cross-entropy picking positive key k⁺ over negative keys k⁻ given query q.",
                "meaning": "Softmax cross-entropy picking positive key k⁺ over negative keys k⁻ given query q."
              }
            ],
            "vocabulary": [
              {
                "term": "InfoNCE",
                "original": "Technical term: «InfoNCE» as used in this literature.",
                "simple": "Information Noise-Contrastive Estimation loss function.",
                "def": "Information Noise-Contrastive Estimation loss function."
              },
              {
                "term": "Query & Key",
                "original": "Technical term: «Query & Key» as used in this literature.",
                "simple": "Query q is the anchor representation; Key k⁺ is positive target; Keys k⁻ are negative noise.",
                "def": "Query q is the anchor representation; Key k⁺ is positive target; Keys k⁻ are negative noise."
              }
            ],
            "whatItShows": [
              "That contrastive prediction extracts rich structural representations without pixel/token generation"
            ],
            "whatItDoesNotShow": [
              "That low InfoNCE loss guarantees monosemantic feature dictionary recovery"
            ],
            "setconcaUse": [
              "Default contrastive loss formulation for SetConCA multi-view coordination."
            ],
            "masteryChecklist": [
              "I can write the InfoNCE loss formula from memory.",
              "I can explain the query, positive key, and negative key setup.",
              "I understand the connection between InfoNCE and mutual information lower bounds."
            ],
            "commonConfusions": [
              {
                "wrong": "InfoNCE measures exact mutual information.",
                "right": "InfoNCE provides a lower bound on mutual information bounded by log(K)."
              }
            ],
            "quiz": [
              {
                "q": "What task does InfoNCE use to train representations?",
                "options": [
                  "Selecting the true positive key among negative noise keys",
                  "Predicting raw pixel values",
                  "L1 autoencoding",
                  "PCA projection"
                ],
                "a": 0,
                "explain": "InfoNCE frames learning as selecting the positive key among negative noise keys."
              }
            ],
            "originalIdea": "Learns representations by predicting future context using the contrastive InfoNCE objective.",
            "simpleLesson": "Welcome to the CPC / InfoNCE Masterclass. Let's understand Aaron van den Oord et al.'s (DeepMind 2018) breakthrough.\n\n--- THE CONTRASTIVE PREDICTION IDEA ---\nInstead of predicting raw future data pixels or tokens directly (which wastes capacity on fine noise), CPC predicts FUTURE REPRESENTATIONS by framing representation learning as a DISCRIMINATION TASK!\n\nGiven context query q, the model must select the true positive future sample k⁺ out of a minibatch containing 1 positive key and N-1 negative noise keys {k⁻}.\n\n--- THE INFONCE LOSS ---\nLoss = - log [ exp(qᵀ k⁺ / τ) / ( exp(qᵀ k⁺ / τ) + Σ exp(qᵀ k⁻_i / τ) ) ]\n\nThis is a softmax cross-entropy loss over cosine similarities scaled by temperature τ.\n\n--- MUTUAL INFORMATION BOUND ---\nVan den Oord et al. proved that minimizing InfoNCE loss MAXIMIZES A LOWER BOUND on the Mutual Information I(q; k⁺) between query and positive key:\nI(q; k⁺) ≥ log(K) - L_InfoNCE (where K is minibatch size).\n\nFOR SETCONCA:\nInfoNCE is the exact loss template used to coordinate sparse dictionary codes across multiple activation views.",
            "limitPairs": [
              {
                "original": "That contrastive prediction extracts rich structural representations without pixel/token generation",
                "simple": "In practice this means evidence supports: That contrastive prediction extracts rich structural representations without pixel/token generation"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That low InfoNCE loss guarantees monosemantic feature dictionary recovery",
                "simple": "Do not overclaim: That low InfoNCE loss guarantees monosemantic feature dictionary recovery"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Default contrastive loss formulation for SetConCA multi-view coordination.",
                "simple": "Action item: Default contrastive loss formulation for SetConCA multi-view coordination."
              }
            ]
          },
          "quiz": [
            {
              "q": "What task does InfoNCE use to train representations?",
              "options": [
                "Selecting the true positive key among negative noise keys",
                "Predicting raw pixel values",
                "L1 autoencoding",
                "PCA projection"
              ],
              "a": 0,
              "explain": "InfoNCE frames learning as selecting the positive key among negative noise keys."
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
            "whyWeRead": "SimCLR established the practical engineering blueprint for contrastive learning: data augmentations, projection heads, and temperature.",
            "oneSentence": "A simple framework for contrastive learning showing the critical role of data augmentations, non-linear projection heads, and batch size.",
            "plainLanguage": "Welcome to the SimCLR Masterclass (Ting Chen et al., Google Brain 2020). SimCLR systematically identified the four practical pillars that make contrastive learning work:\n\n1. Data Augmentations Define the Task: Positive pairs are created by applying two random augmentations to the same image. The choice of augmentation defines what invariant features the model learns!\n2. Non-Linear Projection Head: Maps representation h through MLP g(h) = z BEFORE computing InfoNCE loss. CRITICAL: Projection z is used during training, but DISCARDED afterwards! Pre-projection representation h retains richer downstream information.\n3. Large Batch Size & Negatives: Uses all other images in the minibatch as negative pairs.\n4. Normalized Temperature-scaled Cross-Entropy (NT-Xent).",
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
                "term": "Projection Head",
                "original": "Technical term: «Projection Head» as used in this literature.",
                "simple": "An MLP layer g(h) used during contrastive training and discarded afterwards.",
                "def": "An MLP layer g(h) used during contrastive training and discarded afterwards."
              },
              {
                "term": "In-Batch Negatives",
                "original": "Technical term: «In-Batch Negatives» as used in this literature.",
                "simple": "Using other samples in the training minibatch as negative pairs.",
                "def": "Using other samples in the training minibatch as negative pairs."
              }
            ],
            "whatItShows": [
              "Which empirical components (augmentations, projection head, temperature) optimize contrastive performance"
            ],
            "whatItDoesNotShow": [
              "That image augmentations translate directly to neural activation views without adaptation"
            ],
            "setconcaUse": [
              "Treat prompt/context view generation as carefully as SimCLR treats image augmentation.",
              "Ablate whether projection heads preserve sparse dictionary features in SetConCA."
            ],
            "masteryChecklist": [
              "I can list SimCLR's four key empirical ingredients.",
              "I can explain why the projection head is discarded after training."
            ],
            "commonConfusions": [
              {
                "wrong": "You should use the projection head output z for downstream evaluation.",
                "right": "Pre-projection representation h is richer and performs better downstream."
              }
            ],
            "quiz": [
              {
                "q": "What is done with SimCLR's projection head g(h) after contrastive training?",
                "options": [
                  "It is discarded, keeping pre-projection embedding h for downstream tasks",
                  "It is frozen and used for all tasks",
                  "It replaces the encoder",
                  "It computes PCA"
                ],
                "a": 0,
                "explain": "The projection head is discarded after training; pre-projection representation h is used."
              }
            ],
            "originalIdea": "A simple framework for contrastive learning showing the critical role of data augmentations, non-linear projection heads, and batch size.",
            "simpleLesson": "Welcome to the SimCLR Masterclass (Ting Chen et al., Google Brain 2020). SimCLR systematically identified the four practical pillars that make contrastive learning work:\n\n1. Data Augmentations Define the Task: Positive pairs are created by applying two random augmentations to the same image. The choice of augmentation defines what invariant features the model learns!\n2. Non-Linear Projection Head: Maps representation h through MLP g(h) = z BEFORE computing InfoNCE loss. CRITICAL: Projection z is used during training, but DISCARDED afterwards! Pre-projection representation h retains richer downstream information.\n3. Large Batch Size & Negatives: Uses all other images in the minibatch as negative pairs.\n4. Normalized Temperature-scaled Cross-Entropy (NT-Xent).",
            "limitPairs": [
              {
                "original": "Which empirical components (augmentations, projection head, temperature) optimize contrastive performance",
                "simple": "In practice this means evidence supports: Which empirical components (augmentations, projection head, temperature) optimize contrastive performance"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That image augmentations translate directly to neural activation views without adaptation",
                "simple": "Do not overclaim: That image augmentations translate directly to neural activation views without adaptation"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Treat prompt/context view generation as carefully as SimCLR treats image augmentation.",
                "simple": "Action item: Treat prompt/context view generation as carefully as SimCLR treats image augmentation."
              },
              {
                "original": "Ablate whether projection heads preserve sparse dictionary features in SetConCA.",
                "simple": "Action item: Ablate whether projection heads preserve sparse dictionary features in SetConCA."
              }
            ]
          },
          "quiz": [
            {
              "q": "What is done with SimCLR's projection head g(h) after contrastive training?",
              "options": [
                "It is discarded, keeping pre-projection embedding h for downstream tasks",
                "It is frozen and used for all tasks",
                "It replaces the encoder",
                "It computes PCA"
              ],
              "a": 0,
              "explain": "The projection head is discarded after training; pre-projection representation h is used."
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
            "whyWeRead": "Supervised Contrastive Learning (SupCon) extends contrastive learning to MULTIPLE POSITIVES per anchor — directly applicable to multi-view concept sets.",
            "oneSentence": "Extends contrastive learning to leverage label information by pulling ALL same-class samples together as positive pairs.",
            "plainLanguage": "Welcome to SupCon (Khosla et al., Google 2020). Standard SimCLR has only ONE positive key per anchor. But what if you have multiple images of dogs in your dataset?\n\nSupCon treats ALL samples sharing the same class label as POSITIVES for an anchor! The loss averages attraction across all positive keys while repelling all negative class keys.\n\nRESULT: Creates tight class-conditioned clusters in representation space (high within-class compactness, strong between-class separation).\n\nSETCONCA MAPPING:\nEach activation view of the exact same concept is a positive sample. SupCon is the direct mathematical loss for coordinating multi-view concept sets.",
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
                "term": "Multi-Positive Loss",
                "original": "Technical term: «Multi-Positive Loss» as used in this literature.",
                "simple": "Contrastive loss averaging attraction over multiple positive samples per anchor.",
                "def": "Contrastive loss averaging attraction over multiple positive samples per anchor."
              }
            ],
            "whatItShows": [
              "That multi-positive contrastive learning improves supervised representation geometry"
            ],
            "whatItDoesNotShow": [
              "That class labels equal true monosemantic concepts in SAE dictionaries"
            ],
            "setconcaUse": [
              "Use SupCon-style multi-positive loss for coordinating activation view sets in SetConCA."
            ],
            "masteryChecklist": [
              "I can contrast SimCLR single-positive vs. SupCon multi-positive setups.",
              "I can explain how SupCon maps to multi-view concept sets."
            ],
            "commonConfusions": [
              {
                "wrong": "SupCon only works with single positive pairs.",
                "right": "SupCon explicitly handles arbitrary numbers of positive pairs per anchor."
              }
            ],
            "quiz": [
              {
                "q": "How does SupCon differ from SimCLR?",
                "options": [
                  "SupCon allows multiple positive pairs per anchor based on shared labels/concepts",
                  "SupCon has no negatives",
                  "SupCon uses L1 loss",
                  "SupCon removes projection heads"
                ],
                "a": 0,
                "explain": "SupCon averages contrastive attraction across multiple positive samples per anchor."
              }
            ],
            "originalIdea": "Extends contrastive learning to leverage label information by pulling ALL same-class samples together as positive pairs.",
            "simpleLesson": "Welcome to SupCon (Khosla et al., Google 2020). Standard SimCLR has only ONE positive key per anchor. But what if you have multiple images of dogs in your dataset?\n\nSupCon treats ALL samples sharing the same class label as POSITIVES for an anchor! The loss averages attraction across all positive keys while repelling all negative class keys.\n\nRESULT: Creates tight class-conditioned clusters in representation space (high within-class compactness, strong between-class separation).\n\nSETCONCA MAPPING:\nEach activation view of the exact same concept is a positive sample. SupCon is the direct mathematical loss for coordinating multi-view concept sets.",
            "limitPairs": [
              {
                "original": "That multi-positive contrastive learning improves supervised representation geometry",
                "simple": "In practice this means evidence supports: That multi-positive contrastive learning improves supervised representation geometry"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That class labels equal true monosemantic concepts in SAE dictionaries",
                "simple": "Do not overclaim: That class labels equal true monosemantic concepts in SAE dictionaries"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Use SupCon-style multi-positive loss for coordinating activation view sets in SetConCA.",
                "simple": "Action item: Use SupCon-style multi-positive loss for coordinating activation view sets in SetConCA."
              }
            ]
          },
          "quiz": [
            {
              "q": "How does SupCon differ from SimCLR?",
              "options": [
                "SupCon allows multiple positive pairs per anchor based on shared labels/concepts",
                "SupCon has no negatives",
                "SupCon uses L1 loss",
                "SupCon removes projection heads"
              ],
              "a": 0,
              "explain": "SupCon averages contrastive attraction across multiple positive samples per anchor."
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
            "whyWeRead": "Wang & Isola give the clean geometric decomposition for diagnosing contrastive training: Alignment and Uniformity on the hypersphere.",
            "oneSentence": "Decomposes contrastive representation learning into two key geometric properties: Alignment of positive pairs and Uniformity of overall feature distribution.",
            "plainLanguage": "Welcome to Wang & Isola (MIT 2020). This paper provides the geometric magnifying glass for contrastive learning.\n\nThey proved that optimizing contrastive loss drives two distinct geometric properties on the unit hypersphere:\n\n1. Alignment: Positive pairs should map to nearby points on the sphere. (E[||z - z⁺||²] → 0).\n2. Uniformity: All representations should spread out evenly across the hypersphere, maximizing entropy and preventing representation collapse (log E[exp(-2 ||z_i - z_j||²)] → min).\n\nDIAGNOSTIC HYGIENE:\nIf your model training fails, plot Alignment score vs. Uniformity score! If Alignment is bad, positive views aren't matching. If Uniformity is bad, representations have collapsed into a clump.",
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
                "simple": "Expected distance between positive pair representations on the hypersphere.",
                "def": "Expected distance between positive pair representations on the hypersphere."
              },
              {
                "term": "Uniformity",
                "original": "Technical term: «Uniformity» as used in this literature.",
                "simple": "Log expected pairwise Gaussian potential measuring distribution uniformity across the hypersphere.",
                "def": "Log expected pairwise Gaussian potential measuring distribution uniformity across the hypersphere."
              }
            ],
            "whatItShows": [
              "That contrastive learning optimizes alignment and uniformity on the hypersphere"
            ],
            "whatItDoesNotShow": [
              "How alignment/uniformity behave in unnormalized sparse dictionary spaces"
            ],
            "setconcaUse": [
              "Use Alignment and Uniformity metrics to diagnose multi-view SetConCA loss training."
            ],
            "masteryChecklist": [
              "I can define Alignment and Uniformity in words and geometry.",
              "I can explain how to use them to diagnose contrastive training failure."
            ],
            "commonConfusions": [
              {
                "wrong": "Good alignment alone is sufficient.",
                "right": "Without uniformity enforcers, all vectors collapse to a single point (perfect alignment, zero utility)."
              }
            ],
            "quiz": [
              {
                "q": "What does Uniformity measure in contrastive geometry?",
                "options": [
                  "How evenly feature vectors spread across the hypersphere to prevent collapse",
                  "How close positive pairs are",
                  "L0 count",
                  "PCA rank"
                ],
                "a": 0,
                "explain": "Uniformity measures feature spread across the hypersphere, preventing representation collapse."
              }
            ],
            "originalIdea": "Decomposes contrastive representation learning into two key geometric properties: Alignment of positive pairs and Uniformity of overall feature distribution.",
            "simpleLesson": "Welcome to Wang & Isola (MIT 2020). This paper provides the geometric magnifying glass for contrastive learning.\n\nThey proved that optimizing contrastive loss drives two distinct geometric properties on the unit hypersphere:\n\n1. Alignment: Positive pairs should map to nearby points on the sphere. (E[||z - z⁺||²] → 0).\n2. Uniformity: All representations should spread out evenly across the hypersphere, maximizing entropy and preventing representation collapse (log E[exp(-2 ||z_i - z_j||²)] → min).\n\nDIAGNOSTIC HYGIENE:\nIf your model training fails, plot Alignment score vs. Uniformity score! If Alignment is bad, positive views aren't matching. If Uniformity is bad, representations have collapsed into a clump.",
            "limitPairs": [
              {
                "original": "That contrastive learning optimizes alignment and uniformity on the hypersphere",
                "simple": "In practice this means evidence supports: That contrastive learning optimizes alignment and uniformity on the hypersphere"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "How alignment/uniformity behave in unnormalized sparse dictionary spaces",
                "simple": "Do not overclaim: How alignment/uniformity behave in unnormalized sparse dictionary spaces"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Use Alignment and Uniformity metrics to diagnose multi-view SetConCA loss training.",
                "simple": "Action item: Use Alignment and Uniformity metrics to diagnose multi-view SetConCA loss training."
              }
            ]
          },
          "quiz": [
            {
              "q": "What does Uniformity measure in contrastive geometry?",
              "options": [
                "How evenly feature vectors spread across the hypersphere to prevent collapse",
                "How close positive pairs are",
                "L0 count",
                "PCA rank"
              ],
              "a": 0,
              "explain": "Uniformity measures feature spread across the hypersphere, preventing representation collapse."
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
            "whyWeRead": "VICReg shows how to achieve self-supervised multi-view alignment WITHOUT negative pairs using explicit Variance, Invariance, and Covariance regularizers.",
            "oneSentence": "Variance-Invariance-Covariance Regularization (VICReg) prevents representation collapse in non-contrastive multi-view learning.",
            "plainLanguage": "Welcome to VICReg (Bardes et al., Meta 2021). Contrastive methods require large minibatches of negative pairs to prevent collapse. What if you don't want negative pairs?\n\nVICReg achieves non-contrastive multi-view alignment using three explicit loss terms:\n\n1. Variance (V): Forces standard deviation of each feature dimension across a batch to remain above 1 (stops all vectors collapsing to a point).\n2. Invariance (I): Minimizes mean squared error between positive view embeddings (pulls views together).\n3. Covariance (C): Minimizes off-diagonal covariance between feature pairs (decorrelates features, preventing redundancy).\n\nLoss = λ v(Z) + μ i(Z, Z') + ν c(Z)",
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
                "simple": "Variance-Invariance-Covariance Regularization for non-contrastive self-supervised learning.",
                "def": "Variance-Invariance-Covariance Regularization for non-contrastive self-supervised learning."
              }
            ],
            "whatItShows": [
              "That explicit variance and covariance regularization prevents representation collapse without negative pairs"
            ],
            "whatItDoesNotShow": [
              "That VICReg features automatically satisfy sparse autoencoder monosemanticity"
            ],
            "setconcaUse": [
              "Use VICReg variance/covariance terms as regularizers if negative contrastive pairs damage SAE reconstruction."
            ],
            "masteryChecklist": [
              "I can explain V, I, and C in VICReg and what each term prevents."
            ],
            "commonConfusions": [
              {
                "wrong": "VICReg requires thousands of negative pairs.",
                "right": "VICReg is non-contrastive and uses ZERO negative pairs."
              }
            ],
            "quiz": [
              {
                "q": "What does the Variance term in VICReg prevent?",
                "options": [
                  "Representation collapse into a constant point by enforcing minimum feature std",
                  "Feature splitting",
                  "Slow training",
                  "PCA rank loss"
                ],
                "a": 0,
                "explain": "Variance regularization forces feature std ≥ 1, preventing collapse into a constant vector."
              }
            ],
            "originalIdea": "Variance-Invariance-Covariance Regularization (VICReg) prevents representation collapse in non-contrastive multi-view learning.",
            "simpleLesson": "Welcome to VICReg (Bardes et al., Meta 2021). Contrastive methods require large minibatches of negative pairs to prevent collapse. What if you don't want negative pairs?\n\nVICReg achieves non-contrastive multi-view alignment using three explicit loss terms:\n\n1. Variance (V): Forces standard deviation of each feature dimension across a batch to remain above 1 (stops all vectors collapsing to a point).\n2. Invariance (I): Minimizes mean squared error between positive view embeddings (pulls views together).\n3. Covariance (C): Minimizes off-diagonal covariance between feature pairs (decorrelates features, preventing redundancy).\n\nLoss = λ v(Z) + μ i(Z, Z') + ν c(Z)",
            "limitPairs": [
              {
                "original": "That explicit variance and covariance regularization prevents representation collapse without negative pairs",
                "simple": "In practice this means evidence supports: That explicit variance and covariance regularization prevents representation collapse without negative pairs"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That VICReg features automatically satisfy sparse autoencoder monosemanticity",
                "simple": "Do not overclaim: That VICReg features automatically satisfy sparse autoencoder monosemanticity"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Use VICReg variance/covariance terms as regularizers if negative contrastive pairs damage SAE reconstruction.",
                "simple": "Action item: Use VICReg variance/covariance terms as regularizers if negative contrastive pairs damage SAE reconstruction."
              }
            ]
          },
          "quiz": [
            {
              "q": "What does the Variance term in VICReg prevent?",
              "options": [
                "Representation collapse into a constant point by enforcing minimum feature std",
                "Feature splitting",
                "Slow training",
                "PCA rank loss"
              ],
              "a": 0,
              "explain": "Variance regularization forces feature std ≥ 1, preventing collapse into a constant vector."
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
            "whyWeRead": "Theoretical analysis showing when InfoNCE contrastive learning inverts the data generating process to recover true latent factors.",
            "oneSentence": "Contrastive Learning Inverts the Data Generating Process provides identifiability proofs for contrastive learning under specific view-generation assumptions.",
            "plainLanguage": "Welcome to Zimmermann et al. (2021).\n\nThis paper provides mathematical proofs showing that contrastive learning (InfoNCE) can INVERT the true underlying generative process, recovering ground-truth latent factors up to coordinate-wise transformations IF positive views share true latent factors.",
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
                "term": "Generative Process Inversion",
                "original": "Technical term: «Generative Process Inversion» as used in this literature.",
                "simple": "Recovering true underlying latent causal variables from observed data using contrastive learning.",
                "def": "Recovering true underlying latent causal variables from observed data using contrastive learning."
              }
            ],
            "whatItShows": [
              "That contrastive learning can provably recover true latent variables under identifiability conditions"
            ],
            "whatItDoesNotShow": [
              "That contrastive learning automatically solves SAE overcompleteness without dictionary constraints"
            ],
            "setconcaUse": [
              "Theoretical foundation supporting contrastive set loss concept recovery claims in SetConCA."
            ],
            "masteryChecklist": [
              "I can explain why contrastive learning can invert generative processes."
            ],
            "commonConfusions": [
              {
                "wrong": "Contrastive loss only does heuristic clustering.",
                "right": "Under formal assumptions, contrastive loss provably inverts the latent data generating process."
              }
            ],
            "quiz": [
              {
                "q": "What does Zimmermann et al. (2021) prove about contrastive learning?",
                "options": [
                  "Contrastive learning can provably invert the latent data generating process",
                  "Contrastive learning always fails",
                  "PCA is non-linear",
                  "L0 is non-differentiable"
                ],
                "a": 0,
                "explain": "Proves contrastive learning can invert the data generating process under identifiability assumptions."
              }
            ],
            "originalIdea": "Contrastive Learning Inverts the Data Generating Process provides identifiability proofs for contrastive learning under specific view-generation assumptions.",
            "simpleLesson": "Welcome to Zimmermann et al. (2021).\n\nThis paper provides mathematical proofs showing that contrastive learning (InfoNCE) can INVERT the true underlying generative process, recovering ground-truth latent factors up to coordinate-wise transformations IF positive views share true latent factors.",
            "limitPairs": [
              {
                "original": "That contrastive learning can provably recover true latent variables under identifiability conditions",
                "simple": "In practice this means evidence supports: That contrastive learning can provably recover true latent variables under identifiability conditions"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That contrastive learning automatically solves SAE overcompleteness without dictionary constraints",
                "simple": "Do not overclaim: That contrastive learning automatically solves SAE overcompleteness without dictionary constraints"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Theoretical foundation supporting contrastive set loss concept recovery claims in SetConCA.",
                "simple": "Action item: Theoretical foundation supporting contrastive set loss concept recovery claims in SetConCA."
              }
            ]
          },
          "quiz": [
            {
              "q": "What does Zimmermann et al. (2021) prove about contrastive learning?",
              "options": [
                "Contrastive learning can provably invert the latent data generating process",
                "Contrastive learning always fails",
                "PCA is non-linear",
                "L0 is non-differentiable"
              ],
              "a": 0,
              "explain": "Proves contrastive learning can invert the data generating process under identifiability assumptions."
            }
          ]
        }
      ],
      "primer": {
        "title": "Contrastive representation learning",
        "mission": "Master InfoNCE, SimCLR, Supervised Contrastive Learning (SupCon), Alignment & Uniformity, and VICReg.",
        "beforeYouStart": "Level 4 set representations.",
        "primer": "Welcome to Level 5. Contrastive learning is the dominant self-supervised paradigm in modern AI. The core intuition is beautifully simple:\nPULL representations of related items (Positive Pairs) CLOSER TOGETHER in vector space, and PUSH representations of unrelated items (Negative Pairs) FARTHER APART!\n\n--- STEP 1: CPC & InfoNCE Loss (van den Oord et al., 2018) ---\nWhat is InfoNCE?\nInfoNCE is a multi-class softmax loss where the network must correctly identify the single true positive key k⁺ among a minibatch of negative keys {k⁻}.\n\nFormula:\nLoss = - log [ exp( sim(q, k⁺) / τ ) / ( exp( sim(q, k⁺) / τ ) + Σ exp( sim(q, k⁻_i) / τ ) ) ]\n\nLet's unpack every symbol:\n• q: The Query representation vector.\n• k⁺: The Positive Key representation vector (e.g. another view of the same concept).\n• k⁻_i: Negative Key vectors (other unrelated samples in the batch).\n• sim(a, b): Cosine similarity (aᵀb / (||a|| ||b||)).\n• τ (Temperature): A hyperparameter scaling cosine scores. Small τ (e.g. 0.07) makes the softmax extremely peaky, forcing the network to focus heavily on hard negatives!\n\n--- STEP 2: SimCLR (Chen et al., 2020) — Practical Engineering Rules ---\nSimCLR established four critical rules for contrastive learning:\n1. Positive Definition: Positives are created by data augmentations of the same image (or prompt/view variations of the same concept).\n2. Projection Head: Maps representations through a non-linear MLP g(h) BEFORE computing InfoNCE loss. CRITICAL FINDING: The output of the projection head is used for loss computation, but DISCARDED after training! The pre-projection representation h retains much richer detail.\n3. Large Batch Size: Larger minibatches provide more negative pairs, improving geometric quality.\n\n--- STEP 3: SupCon (Khosla et al., 2020) — Multiple Positives Per Anchor ---\nStandard SimCLR has only ONE positive per anchor. But in Supervised Contrastive Learning (SupCon), ALL items sharing the same class label are treated as positives!\nSupCon averages attraction across MULTIPLE positives while repelling all other classes.\n\nSetConCA Connection: This is EXACTLY what SetConCA needs! A single semantic concept has MULTIPLE activation views. SupCon is the loss template for coordinating set views.\n\n--- STEP 4: Alignment vs Uniformity (Wang & Isola, 2020) ---\nWang & Isola proved that contrastive learning optimizes two distinct geometric properties on the unit hypersphere:\n1. Alignment: Positive pairs map to nearby points on the sphere. (E[||z - z⁺||²]).\n2. Uniformity: All representations spread out evenly across the hypersphere, preventing representation collapse. (log E[exp(-2 ||z_i - z_j||²)]).\n\n--- STEP 5: VICReg (Bardes et al., 2021) — Alignment Without Negatives ---\nWhat if you don't have negative pairs? VICReg prevents collapse using three explicit regularizers:\n• Variance (V): Forces variance of each feature dimension to stay above a threshold.\n• Invariance (I): Minimizes distance between positive view embeddings.\n• Covariance (C): Minimizes off-diagonal covariance between feature pairs, driving decorrelation.",
        "bigPictureDiagram": [
          "Anchor Vector q",
          "  ├─→ Pull toward Positive Key k⁺ (High Cosine Sim)",
          "  └─→ Push away from Negative Keys k⁻_1, k⁻_2, ... k⁻_N (Low Cosine Sim)",
          "Geometry on Hypersphere: Alignment (Positives close) + Uniformity (Spread evenly, anti-collapse)",
          "VICReg Non-Contrastive: Variance (Keep std > 1) + Invariance (Match views) + Covariance (Decorrelate features)"
        ],
        "conceptsToMaster": [
          {
            "name": "InfoNCE Loss",
            "simple": "A softmax classification loss over cosine similarities that picks out the true positive view among many negative distractors.",
            "deeper": "L_InfoNCE = -log ( exp(q·k⁺/τ) / [exp(q·k⁺/τ) + sum_i exp(q·k⁻_i/τ)] ). Lower bounds mutual information I(X;Y) <= log(K) - L_InfoNCE under density ratio assumptions."
          },
          {
            "name": "Temperature (τ)",
            "simple": "A scale factor that controls how harshly the loss punishes hard negatives.",
            "deeper": "Scales cosine similarities before softmax. Low temperature (τ < 0.1) amplifies gradients for hard negatives (negatives close to anchor), creating tight local clusters. High temperature spreads gradients uniformly."
          },
          {
            "name": "Projection Head",
            "simple": "An extra MLP layer placed after the encoder during contrastive training, then discarded when using embeddings downstream.",
            "deeper": "Prevents contrastive loss from discarding high-frequency non-invariant information needed for downstream tasks. The encoder representation h preserves details, while projection z = g(h) is invariant."
          },
          {
            "name": "Alignment and Uniformity",
            "simple": "Alignment = positive pairs are close. Uniformity = embeddings cover the entire sphere evenly without collapsing into a clump.",
            "deeper": "Alignment = E_{(x,x⁺)} [||f(x) - f(x⁺)||^2]. Uniformity = log E_{x,y ~ p} [exp(-2 ||f(x) - f(y)||^2)]. Healthy contrastive geometry requires both."
          }
        ],
        "checkpoint": {
          "goal": "Ablate temperature τ and projection head presence on an activation view dataset.",
          "steps": [
            "Implement InfoNCE loss.",
            "Vary temperature τ from 0.01 to 1.0.",
            "Train with and without a 2-layer MLP projection head.",
            "Measure Alignment score, Uniformity score, and downstream retrieval accuracy."
          ],
          "successLooksLike": "You can plot Alignment vs Uniformity and explain why training without a projection head harms downstream generalisation."
        },
        "bridgeToNext": "Now that you know how to build multi-view and contrastive models, Level 6 teaches how to MEASURE and COMPARE representations honestly without fooling yourself."
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
            "plainLanguage": "Welcome to the SVCCA Masterclass. Let's understand why Raghu et al. (NIPS 2017) created SVCCA.\n\nSuppose you have Model A and Model B. Both process the same inputs, but Model A has 4096 neurons while Model B has 2048 neurons. You cannot match Neuron #5 of Model A to Neuron #5 of Model B.\n\n--- HOW SVCCA WORKS ---\n1. Take activations matrix X from Model A and Y from Model B.\n2. Step 1 (SVD Truncation): Run Singular Value Decomposition (SVD) on X and Y to keep only top principal components that explain 99% of variance, throwing away low-variance noise.\n3. Step 2 (CCA Alignment): Perform CCA on the truncated subspaces to compute canonical correlations!\n\nWhat SVCCA proves: SVCCA measures SUBSPACE OVERLAP between models. High SVCCA score means the models represent similar subspace geometries.\nWhat SVCCA DOES NOT prove: SVCCA does NOT prove individual neurons or feature dictionaries are identical.",
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
                "term": "Subspace Similarity",
                "original": "Technical term: «Subspace Similarity» as used in this literature.",
                "simple": "Degree of overlap between representational subspaces ignoring basis choice.",
                "def": "Degree of overlap between representational subspaces ignoring basis choice."
              }
            ],
            "whatItShows": [
              "That neural representations can be compared across architectures and layers using subspace correlation"
            ],
            "whatItDoesNotShow": [
              "That individual features or concepts match one-to-one"
            ],
            "setconcaUse": [
              "Use SVCCA as a subspace similarity baseline when comparing SetConCA feature spaces against pointwise SAEs."
            ],
            "masteryChecklist": [
              "I can explain the two steps of SVCCA (SVD truncation then CCA)."
            ],
            "commonConfusions": [
              {
                "wrong": "High SVCCA means features match one-to-one.",
                "right": "SVCCA measures subspace overlap, not feature-level alignment."
              }
            ],
            "quiz": [
              {
                "q": "What does SVCCA perform before running CCA?",
                "options": [
                  "SVD truncation to keep high-variance components and remove noise",
                  "TopK sparsity",
                  "Linear probing",
                  "L1 loss"
                ],
                "a": 0,
                "explain": "SVCCA runs SVD truncation first to reduce noise before computing canonical correlations."
              }
            ],
            "originalIdea": "SVCCA combines SVD dimensionality reduction with CCA to compare representations invariantly to affine transforms.",
            "simpleLesson": "Welcome to the SVCCA Masterclass. Let's understand why Raghu et al. (NIPS 2017) created SVCCA.\n\nSuppose you have Model A and Model B. Both process the same inputs, but Model A has 4096 neurons while Model B has 2048 neurons. You cannot match Neuron #5 of Model A to Neuron #5 of Model B.\n\n--- HOW SVCCA WORKS ---\n1. Take activations matrix X from Model A and Y from Model B.\n2. Step 1 (SVD Truncation): Run Singular Value Decomposition (SVD) on X and Y to keep only top principal components that explain 99% of variance, throwing away low-variance noise.\n3. Step 2 (CCA Alignment): Perform CCA on the truncated subspaces to compute canonical correlations!\n\nWhat SVCCA proves: SVCCA measures SUBSPACE OVERLAP between models. High SVCCA score means the models represent similar subspace geometries.\nWhat SVCCA DOES NOT prove: SVCCA does NOT prove individual neurons or feature dictionaries are identical.",
            "limitPairs": [
              {
                "original": "That neural representations can be compared across architectures and layers using subspace correlation",
                "simple": "In practice this means evidence supports: That neural representations can be compared across architectures and layers using subspace correlation"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That individual features or concepts match one-to-one",
                "simple": "Do not overclaim: That individual features or concepts match one-to-one"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Use SVCCA as a subspace similarity baseline when comparing SetConCA feature spaces against pointwise SAEs.",
                "simple": "Action item: Use SVCCA as a subspace similarity baseline when comparing SetConCA feature spaces against pointwise SAEs."
              }
            ]
          },
          "quiz": [
            {
              "q": "What does SVCCA perform before running CCA?",
              "options": [
                "SVD truncation to keep high-variance components and remove noise",
                "TopK sparsity",
                "Linear probing",
                "L1 loss"
              ],
              "a": 0,
              "explain": "SVCCA runs SVD truncation first to reduce noise before computing canonical correlations."
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
            "whyWeRead": "CKA is the standard representation similarity metric used in modern deep learning research to compare model layers and architectures.",
            "oneSentence": "Centered Kernel Alignment (CKA) measures representation similarity using Gram matrices, invariant to orthogonal transformations.",
            "plainLanguage": "Welcome to the CKA Masterclass (Kornblith et al., ICML 2019).\n\n--- WHY PREVIOUS METRICS FAILED ---\nLinear regression probes overfit high dimensions. CCA is unstable when feature dimension > sample size. SVCCA requires arbitrary SVD cutoff hyperparameter tuning.\n\n--- HOW CKA WORKS ---\nCKA asks: do two representations induce SIMILAR EXAMPLE-TO-EXAMPLE SIMILARITY STRUCTURES?\n\n1. Compute N × N Gram Matrix K = X Xᵀ for Model A (where K_ij is cosine similarity between example i and example j in Model A).\n2. Compute N × N Gram Matrix L = Y Yᵀ for Model B (pairwise similarity of examples in Model B).\n3. CKA computes the normalized Hilbert-Schmidt Independence Criterion (HSIC) between centered matrices K and L.\n\nFormula: CKA(K, L) = HSIC(K, L) / sqrt( HSIC(K,K) * HSIC(L,L) )\n\nPROPERTIES:\n• Invariant to orthogonal rotation and isotropic scaling.\n• Robust to high dimensions and sample sizes.\n• High CKA means two models structure example similarities similarly.",
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
                "name": "Linear CKA Formula",
                "formula": "CKA(X,Y) = ||Yᵀ X||_F² / ( ||Xᵀ X||_F ||Yᵀ Y||_F )",
                "original": "Linear CKA Formula: CKA(X,Y) = ||Yᵀ X||_F² / ( ||Xᵀ X||_F ||Yᵀ Y||_F )",
                "simple": "Normalized Frobenius norm of cross-covariance matrix between activation matrices X and Y.",
                "meaning": "Normalized Frobenius norm of cross-covariance matrix between activation matrices X and Y."
              }
            ],
            "vocabulary": [
              {
                "term": "CKA",
                "original": "Technical term: «CKA» as used in this literature.",
                "simple": "Centered Kernel Alignment.",
                "def": "Centered Kernel Alignment."
              },
              {
                "term": "Gram Matrix",
                "original": "Technical term: «Gram Matrix» as used in this literature.",
                "simple": "An N × N matrix storing pairwise inner products between N example representations.",
                "def": "An N × N matrix storing pairwise inner products between N example representations."
              }
            ],
            "whatItShows": [
              "When two neural network layers or models organize example geometry similarly"
            ],
            "whatItDoesNotShow": [
              "That individual dictionary features or concepts are identical"
            ],
            "setconcaUse": [
              "Primary metric for measuring overall representational similarity across training seeds and architectures."
            ],
            "masteryChecklist": [
              "I can explain Gram matrices and why CKA uses them.",
              "I can state CKA's invariance properties."
            ],
            "commonConfusions": [
              {
                "wrong": "High CKA = identical SAE features.",
                "right": "High CKA means similar example geometry, not identical individual features."
              }
            ],
            "quiz": [
              {
                "q": "CKA is invariant to which transformation?",
                "options": [
                  "Orthogonal rotations and isotropic scaling",
                  "Non-linear warps",
                  "Arbitrary token deletion",
                  "L0 changes"
                ],
                "a": 0,
                "explain": "CKA is invariant to orthogonal rotation and isotropic scaling."
              }
            ],
            "originalIdea": "Centered Kernel Alignment (CKA) measures representation similarity using Gram matrices, invariant to orthogonal transformations.",
            "simpleLesson": "Welcome to the CKA Masterclass (Kornblith et al., ICML 2019).\n\n--- WHY PREVIOUS METRICS FAILED ---\nLinear regression probes overfit high dimensions. CCA is unstable when feature dimension > sample size. SVCCA requires arbitrary SVD cutoff hyperparameter tuning.\n\n--- HOW CKA WORKS ---\nCKA asks: do two representations induce SIMILAR EXAMPLE-TO-EXAMPLE SIMILARITY STRUCTURES?\n\n1. Compute N × N Gram Matrix K = X Xᵀ for Model A (where K_ij is cosine similarity between example i and example j in Model A).\n2. Compute N × N Gram Matrix L = Y Yᵀ for Model B (pairwise similarity of examples in Model B).\n3. CKA computes the normalized Hilbert-Schmidt Independence Criterion (HSIC) between centered matrices K and L.\n\nFormula: CKA(K, L) = HSIC(K, L) / sqrt( HSIC(K,K) * HSIC(L,L) )\n\nPROPERTIES:\n• Invariant to orthogonal rotation and isotropic scaling.\n• Robust to high dimensions and sample sizes.\n• High CKA means two models structure example similarities similarly.",
            "limitPairs": [
              {
                "original": "When two neural network layers or models organize example geometry similarly",
                "simple": "In practice this means evidence supports: When two neural network layers or models organize example geometry similarly"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That individual dictionary features or concepts are identical",
                "simple": "Do not overclaim: That individual dictionary features or concepts are identical"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Primary metric for measuring overall representational similarity across training seeds and architectures.",
                "simple": "Action item: Primary metric for measuring overall representational similarity across training seeds and architectures."
              }
            ]
          },
          "quiz": [
            {
              "q": "CKA is invariant to which transformation?",
              "options": [
                "Orthogonal rotations and isotropic scaling",
                "Non-linear warps",
                "Arbitrary token deletion",
                "L0 changes"
              ],
              "a": 0,
              "explain": "CKA is invariant to orthogonal rotation and isotropic scaling."
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
            "whyWeRead": "Introduces Control Tasks and Selectivity to prevent mistaking probe capacity for representational structure.",
            "oneSentence": "Designing and Interpreting Probes with Control Tasks demonstrates that high probe accuracy alone does not prove representation structure.",
            "plainLanguage": "Welcome to Hewitt & Liang (EMNLP 2019). This paper exposed a major scientific vulnerability in NLP probing research.\n\n--- THE PROBE FALLACY ---\nResearchers used to train linear probes on model activations to predict part-of-speech tags. When the probe achieved 97% accuracy, they concluded: 'Layer 8 represents part-of-speech structure!'\n\nHewitt & Liang proved this is flawed: high-capacity probes can MEMORIZE random target labels even when representations contain NO linguistic structure!\n\n--- THE CONTROL TASK SOLUTION ---\nConstruct a Control Task: assign random, arbitrary pseudo-labels to input words (matched in output distribution to real tags).\n1. Train probe on Real Task -> Real Accuracy.\n2. Train probe on Control Task -> Control Accuracy.\n3. Selectivity = Real Accuracy - Control Accuracy.\n\nHigh Selectivity proves the representation ITSELF carries accessible structure for the task, ruling out probe memorization!",
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
                "simple": "A supervised classifier trained on frozen representations to evaluate property extractability.",
                "def": "A supervised classifier trained on frozen representations to evaluate property extractability."
              },
              {
                "term": "Selectivity",
                "original": "Technical term: «Selectivity» as used in this literature.",
                "simple": "Real Task Accuracy minus Control Task Accuracy; measures true representation structure.",
                "def": "Real Task Accuracy minus Control Task Accuracy; measures true representation structure."
              }
            ],
            "whatItShows": [
              "How to measure whether a representation genuinely structures a property using control tasks"
            ],
            "whatItDoesNotShow": [
              "That the model causally uses the probed property during generation"
            ],
            "setconcaUse": [
              "Every probing claim in SetConCA must report Selectivity using control tasks."
            ],
            "masteryChecklist": [
              "I can define Selectivity and explain why control tasks are mandatory."
            ],
            "commonConfusions": [
              {
                "wrong": "High probe accuracy proves the model uses the feature.",
                "right": "High probe accuracy only proves extractability by that probe. Selectivity is needed to rule out memorization."
              }
            ],
            "quiz": [
              {
                "q": "What does Probe Selectivity measure?",
                "options": [
                  "Real Task Accuracy minus Control Task Accuracy",
                  "Total L0 count",
                  "CKA score",
                  "FVU"
                ],
                "a": 0,
                "explain": "Selectivity = Real Task Accuracy - Control Task Accuracy."
              }
            ],
            "originalIdea": "Designing and Interpreting Probes with Control Tasks demonstrates that high probe accuracy alone does not prove representation structure.",
            "simpleLesson": "Welcome to Hewitt & Liang (EMNLP 2019). This paper exposed a major scientific vulnerability in NLP probing research.\n\n--- THE PROBE FALLACY ---\nResearchers used to train linear probes on model activations to predict part-of-speech tags. When the probe achieved 97% accuracy, they concluded: 'Layer 8 represents part-of-speech structure!'\n\nHewitt & Liang proved this is flawed: high-capacity probes can MEMORIZE random target labels even when representations contain NO linguistic structure!\n\n--- THE CONTROL TASK SOLUTION ---\nConstruct a Control Task: assign random, arbitrary pseudo-labels to input words (matched in output distribution to real tags).\n1. Train probe on Real Task -> Real Accuracy.\n2. Train probe on Control Task -> Control Accuracy.\n3. Selectivity = Real Accuracy - Control Accuracy.\n\nHigh Selectivity proves the representation ITSELF carries accessible structure for the task, ruling out probe memorization!",
            "limitPairs": [
              {
                "original": "How to measure whether a representation genuinely structures a property using control tasks",
                "simple": "In practice this means evidence supports: How to measure whether a representation genuinely structures a property using control tasks"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That the model causally uses the probed property during generation",
                "simple": "Do not overclaim: That the model causally uses the probed property during generation"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Every probing claim in SetConCA must report Selectivity using control tasks.",
                "simple": "Action item: Every probing claim in SetConCA must report Selectivity using control tasks."
              }
            ]
          },
          "quiz": [
            {
              "q": "What does Probe Selectivity measure?",
              "options": [
                "Real Task Accuracy minus Control Task Accuracy",
                "Total L0 count",
                "CKA score",
                "FVU"
              ],
              "a": 0,
              "explain": "Selectivity = Real Task Accuracy - Control Task Accuracy."
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
            "whyWeRead": "MDL Probing measures information accessibility and organization effort using minimum description length.",
            "oneSentence": "Information-Theoretic Probing with Minimum Description Length measures how easily a property is extracted from a representation.",
            "plainLanguage": "Welcome to Voita & Titov (EMNLP 2020). MDL Probing evaluates HOW EFFICIENTLY a probe learns a task from representations.\n\nEven if two representations both achieve 90% probe accuracy, one representation might require only 100 bits of description length for the probe to learn, while the other requires 5,000 bits!\n\n• Short Description Length = Information is neatly, accessibly organized.\n• Long Description Length = Information is buried and complex.",
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
                "term": "MDL Probing",
                "original": "Technical term: «MDL Probing» as used in this literature.",
                "simple": "Evaluating representations by the description length (bits) required for a probe to learn a task.",
                "def": "Evaluating representations by the description length (bits) required for a probe to learn a task."
              }
            ],
            "whatItShows": [
              "That description length measures how neatly information is organized in representations"
            ],
            "whatItDoesNotShow": [
              "Causal intervention effects"
            ],
            "setconcaUse": [
              "Use MDL description length when evaluating concept organization in SetConCA codes."
            ],
            "masteryChecklist": [
              "I can explain why description length provides deeper insight than probe accuracy alone."
            ],
            "commonConfusions": [
              {
                "wrong": "Same probe accuracy means identical representation quality.",
                "right": "Probes can require vast differences in description length to achieve the same accuracy."
              }
            ],
            "quiz": [
              {
                "q": "What does a short MDL description length indicate?",
                "options": [
                  "The property is accessibly and neatly organized in the representation",
                  "The model has zero parameters",
                  "High L0 sparsity",
                  "Low CKA"
                ],
                "a": 0,
                "explain": "Short description length means the probe learned the property easily from accessible structure."
              }
            ],
            "originalIdea": "Information-Theoretic Probing with Minimum Description Length measures how easily a property is extracted from a representation.",
            "simpleLesson": "Welcome to Voita & Titov (EMNLP 2020). MDL Probing evaluates HOW EFFICIENTLY a probe learns a task from representations.\n\nEven if two representations both achieve 90% probe accuracy, one representation might require only 100 bits of description length for the probe to learn, while the other requires 5,000 bits!\n\n• Short Description Length = Information is neatly, accessibly organized.\n• Long Description Length = Information is buried and complex.",
            "limitPairs": [
              {
                "original": "That description length measures how neatly information is organized in representations",
                "simple": "In practice this means evidence supports: That description length measures how neatly information is organized in representations"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "Causal intervention effects",
                "simple": "Do not overclaim: Causal intervention effects"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Use MDL description length when evaluating concept organization in SetConCA codes.",
                "simple": "Action item: Use MDL description length when evaluating concept organization in SetConCA codes."
              }
            ]
          },
          "quiz": [
            {
              "q": "What does a short MDL description length indicate?",
              "options": [
                "The property is accessibly and neatly organized in the representation",
                "The model has zero parameters",
                "High L0 sparsity",
                "Low CKA"
              ],
              "a": 0,
              "explain": "Short description length means the probe learned the property easily from accessible structure."
            }
          ]
        }
      ],
      "primer": {
        "title": "Measuring and comparing representations",
        "mission": "Master CKA, SVCCA, Probes with Control Tasks, and Minimum Description Length (MDL) probing.",
        "beforeYouStart": "Levels 1–5 foundational concepts.",
        "primer": "Welcome to Level 6. In AI research, self-deception is easy. A researcher trains a model, runs one evaluation, gets a 92% score, and claims 'We discovered the internal concept!'\n\nLevel 6 is your scientific reality check. You will learn what each metric ACTUALLY proves and what it CANNOT establish.\n\n--- STEP 1: CKA (Centered Kernel Alignment) — Comparing Geometries Across Models ---\nSuppose Model A has 4096 dimensions and Model B has 2048 dimensions. How do you compare if Model A and Model B represent data similarly?\n\nYou CANNOT compare neuron indices (Neuron #12 in Model A has nothing to do with Neuron #12 in Model B). You CANNOT use raw Euclidean distance because Model A might be rotated relative to Model B.\n\nHow CKA works (Kornblith et al., 2019):\n1. Take N example inputs. Pass them through Model A to get N activation vectors. Compute the N × N Gram Matrix K = X Xᵀ (pairwise similarity of examples in Model A).\n2. Pass the same N inputs through Model B to get N activation vectors. Compute Gram Matrix L = Y Yᵀ (pairwise similarity of examples in Model B).\n3. CKA measures the Hilbert-Schmidt Independence Criterion (HSIC) between centered matrices K and L!\n\nWhat CKA proves: High CKA means Model A and Model B organize example similarities similarly. CKA is invariant to orthogonal rotations.\nWhat CKA DOES NOT prove: High CKA does NOT mean the individual features or concepts inside Model A and Model B are identical!\n\n--- STEP 2: Linear Probing and Hewitt & Liang's Control Tasks ---\nWhat is a Probe?\nA probe is a simple classifier (e.g. linear logistic regression) trained on top of frozen model activations to predict a property (e.g. part-of-speech tag).\n\nThe Probe Fallacy:\nIf a linear probe achieves 98% accuracy predicting part-of-speech tags from Layer 8 activations, does that mean Layer 8 internally uses part-of-speech tags?\n\nNOT NECESSARILY! Hewitt & Liang (2019) showed that powerful probes can MEMORIZE random target labels even when the representation carries no real structure!\n\nThe Fix — Control Tasks & Selectivity:\nConstruct a Control Task by assigning random, arbitrary labels to input words (matched in output distribution to real tags). Train the probe on real tags (Real Accuracy) and on control tags (Control Accuracy).\nSelectivity = Real Accuracy - Control Accuracy.\nHigh Selectivity proves the representation itself carries structured, accessible information about the property — not just that the probe memorized!\n\n--- STEP 3: MDL Probing (Voita & Titov, 2020) — Description Length ---\nMinimum Description Length (MDL) probing measures HOW MUCH EFFORT (code length in bits) a probe requires to learn the task from the representation.\n• High Accuracy + Short Description Length = Information is neatly, efficiently organized.\n• High Accuracy + Long Description Length = Information is buried and messy; the probe worked hard to extract it.\n\nTHE METRIC TRUTH TABLE TO MEMORIZE:\n• Low Reconstruction FVU → High fidelity (preserved variance). Does NOT prove monosemantic concepts.\n• High Sparsity (L0) → Few active units. Does NOT prove individual units are pure concepts.\n• High CKA → Similar example geometry across models. Does NOT prove identical features.\n• High Probe Accuracy → Property is extractable. Does NOT prove model uses it without Control Tasks.\n• Steering Effect → Causal intervention alters output. Does NOT prove complete mechanism.",
        "bigPictureDiagram": [
          "Dataset of N Examples",
          "Model A → Activations X → N×N Gram Matrix K (Similarity of examples in A)",
          "Model B → Activations Y → N×N Gram Matrix L (Similarity of examples in B)",
          "CKA(K, L) = HSIC(K, L) / √(HSIC(K,K) HSIC(L,L))  ──[Invariant to Orthogonal Rotation]──",
          "Probing: Real Task Accuracy vs. Control Task Accuracy → Selectivity = Real - Control"
        ],
        "conceptsToMaster": [
          {
            "name": "CKA (Centered Kernel Alignment)",
            "simple": "A metric that compares whether two different neural networks organize a set of examples in the same geometric pattern, regardless of rotation or matrix size.",
            "deeper": "CKA(K,L) = HSIC(K,L) / sqrt(HSIC(K,K) HSIC(L,L)) where K = X Xᵀ and L = Y Yᵀ are centered Gram matrices. Invariant to orthogonal transformation and isotropic scaling. Measures representational similarity without needing feature alignment."
          },
          {
            "name": "Probe Selectivity",
            "simple": "The difference between probe accuracy on real labels versus probe accuracy on random control labels. High selectivity proves representation structure.",
            "deeper": "Selectivity = Accuracy(Real Task) - Accuracy(Control Task). Control task assigns pseudo-labels with identical marginal distribution. High selectivity rules out probe memorization capacity."
          },
          {
            "name": "MDL Probing (Minimum Description Length)",
            "simple": "Measuring how many bits of information a probe needs to learn a task from a representation. Shorter code length = more accessible organization.",
            "deeper": "Measures codelength L_{online}(Y|X) using online coding (prequential code). Evaluates representation quality by total description length required to transmit labels given representations."
          },
          {
            "name": "Subspace Similarity (SVCCA)",
            "simple": "Running SVD first to remove noise, then running CCA to compare shared subspaces between two models.",
            "deeper": "Truncates low-variance singular values via SVD to reduce noise dimensions, then computes canonical correlations on truncated subspace. Measures affine-invariant subspace overlap."
          }
        ],
        "checkpoint": {
          "goal": "Build a complete evaluation notebook computing CKA, Linear Probe Accuracy, Control Task Accuracy, and Selectivity on two model layers.",
          "steps": [
            "Extract activations from Layer 8 and Layer 16 of a model.",
            "Compute Linear CKA between Layer 8 and Layer 16.",
            "Train a linear probe to predict a linguistic property (Real Task).",
            "Construct a Control Task with randomized labels; train probe (Control Task).",
            "Calculate Selectivity and plot the results."
          ],
          "successLooksLike": "You can explain why a probe with 95% real accuracy and 90% control accuracy provides WEAKER evidence than a probe with 85% real accuracy and 20% control accuracy."
        },
        "bridgeToNext": "Armed with honest metrics, Levels 7–9 enter Mechanistic Interpretability — exploring transformer internals, superposition, and Sparse Autoencoders."
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
            "whyWeRead": "Gives the foundational residual stream and circuit vocabulary for Mechanistic Interpretability.",
            "oneSentence": "A Mathematical Framework for Transformer Circuits treats transformers as circuits operating on a central residual stream.",
            "plainLanguage": "Welcome to Elhage et al. (Anthropic 2021).\n\n--- THE RESIDUAL STREAM BUS ---\nThink of the Transformer residual stream as a central conveyor belt running through all layers. Attention heads and MLP layers read from the stream and write updates back linearly:\nx_{l+1} = x_l + Attention(x_l) + MLP(x_l)\n\n--- QK AND OV CIRCUITS ---\nAttention heads factor into two independent operations:\n1. QK Circuit (Query-Key): Determines WHERE to attend (computes attention pattern A = Softmax(xᵀ W_Qᵀ W_K x)).\n2. OV Circuit (Output-Value): Determines WHAT information to move (computes output W_O W_V x).\n\nSAE features live as directions in this residual stream!",
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
                "term": "Residual Stream",
                "original": "Technical term: «Residual Stream» as used in this literature.",
                "simple": "The main linear activation pathway running through a Transformer model.",
                "def": "The main linear activation pathway running through a Transformer model."
              },
              {
                "term": "Circuit",
                "original": "Technical term: «Circuit» as used in this literature.",
                "simple": "A computational subgraph of attention heads and MLP neurons implementing a specific behavior.",
                "def": "A computational subgraph of attention heads and MLP neurons implementing a specific behavior."
              }
            ],
            "whatItShows": [
              "How Transformer layers interact via linear residual stream updates and factored attention circuits"
            ],
            "whatItDoesNotShow": [
              "Automated feature dictionary extraction"
            ],
            "setconcaUse": [
              "Specify exact residual stream layer sites for multi-view activation extraction in SetConCA."
            ],
            "masteryChecklist": [
              "I can explain residual stream linear addition.",
              "I can contrast QK circuits (where to attend) with OV circuits (what to write)."
            ],
            "commonConfusions": [
              {
                "wrong": "Layers replace the residual stream at each step.",
                "right": "Layers add updates to the residual stream; the main stream vector persists through the model."
              }
            ],
            "quiz": [
              {
                "q": "What does the OV circuit in a Transformer attention head determine?",
                "options": [
                  "WHAT information is written to the residual stream",
                  "WHERE attention focuses",
                  "Sparsity L0",
                  "PCA rank"
                ],
                "a": 0,
                "explain": "OV circuit determines what value content is moved to the residual stream."
              }
            ],
            "originalIdea": "A Mathematical Framework for Transformer Circuits treats transformers as circuits operating on a central residual stream.",
            "simpleLesson": "Welcome to Elhage et al. (Anthropic 2021).\n\n--- THE RESIDUAL STREAM BUS ---\nThink of the Transformer residual stream as a central conveyor belt running through all layers. Attention heads and MLP layers read from the stream and write updates back linearly:\nx_{l+1} = x_l + Attention(x_l) + MLP(x_l)\n\n--- QK AND OV CIRCUITS ---\nAttention heads factor into two independent operations:\n1. QK Circuit (Query-Key): Determines WHERE to attend (computes attention pattern A = Softmax(xᵀ W_Qᵀ W_K x)).\n2. OV Circuit (Output-Value): Determines WHAT information to move (computes output W_O W_V x).\n\nSAE features live as directions in this residual stream!",
            "limitPairs": [
              {
                "original": "How Transformer layers interact via linear residual stream updates and factored attention circuits",
                "simple": "In practice this means evidence supports: How Transformer layers interact via linear residual stream updates and factored attention circuits"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "Automated feature dictionary extraction",
                "simple": "Do not overclaim: Automated feature dictionary extraction"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Specify exact residual stream layer sites for multi-view activation extraction in SetConCA.",
                "simple": "Action item: Specify exact residual stream layer sites for multi-view activation extraction in SetConCA."
              }
            ]
          },
          "quiz": [
            {
              "q": "What does the OV circuit in a Transformer attention head determine?",
              "options": [
                "WHAT information is written to the residual stream",
                "WHERE attention focuses",
                "Sparsity L0",
                "PCA rank"
              ],
              "a": 0,
              "explain": "OV circuit determines what value content is moved to the residual stream."
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
            "whyWeRead": "The foundational Anthropic paper establishing why SAEs exist — explaining superposition, polysemanticity, and geometric feature packing.",
            "oneSentence": "Toy Models of Superposition demonstrates how networks pack more sparse features than dimensions via almost-orthogonal directions.",
            "plainLanguage": "Welcome to Anthropic's Toy Models of Superposition (Elhage et al., 2022).\n\n--- THE PARADOX OF NEURAL REPRESENTATIONS ---\nA model with 4,096 activation dimensions can represent TENS OF THOUSANDS of distinct concepts. How?\n\n--- THE SUPERPOSITION HYPOTHESIS ---\nWhen features are SPARSE (active rarely), a network can pack M features into d dimensions (M > d) by embedding features as ALMOST-ORTHOGONAL directions!\n\nThe Interference Cost:\nBecause features are not strictly 90° orthogonal, activating Feature A causes small non-zero interference (crosstalk) on Feature B. When features are sparse, interference happens rarely, and non-linearities (ReLU) wipe out small interference noise.\n\n--- POLYSEMANTIC NEURONS ---\nBecause packed feature directions do not line up with standard neuron basis axes, single neurons become POLYSEMANTIC — activating for multiple unrelated concepts!\n\n--- THREE WAYS OUT -> SPARSITY DICTIONARIES (SAES) ---\nAnthropic listed three ways to resolve superposition:\n1. Train models without superposition (costly).\n2. Find an Overcomplete Basis after training (SAEs / Dictionary Learning).\n3. Hybrid approaches.",
            "priorWork": "HISTORICAL LITERATURE REVIEW & CONTEXT:\nEarlier interpretability research assumed that single neurons corresponded to single human concepts (the 'one neuron = one concept' hypothesis). However, empirical studies consistently found polysemantic neurons (e.g. one neuron activating for both academic citations and anime characters). Elhage et al. (Anthropic 2022) built on compressed sensing, Thomson problem physics, and visual cortex sparse coding literature to establish the Superposition Hypothesis: networks intentionally pack more features than dimensions when features are sparse.",
            "paperArchitecture": "MATHEMATICAL MECHANISM & TOY MODEL ALGORITHM:\n1. Toy Architecture: Linear feature map h = W x where x ∈ ℝ^M (M features) and h ∈ ℝ^d (d dimensions, d < M). Reconstruction x_hat = ReLU(Wᵀ W x + b).\n2. Importance & Sparsity Regimes: Feature i has importance I_i and sparsity S_i (probability of being zero = 1 - S_i).\n3. Interference Optimization: Loss = Σ_i I_i (x_i - x_hat_i)². Minimizing loss forces weights W_i to form geometric packing configurations (antipodal pairs, triangles, pentagons, tetrahedra).\n4. Feature Dimensionality: D_i = ||W_i||² / Σ_j (Ŵ_i · W_j)² measures the fraction of a dimension dedicated to feature i.\n5. Phase Transitions: Exhibits sharp 1st-order phase transitions: as sparsity 1-S_i increases, feature i jumps from non-represented (D=0) → superposed (0<D<1) → dedicated axis (D=1).",
            "experimentalSetup": "EMPIRICAL EVALUATION & PROOF LANDMARKS:\n• Synthetic Toy Models: Swept feature count M from 2 to 100 in d=2 dimensions across varying sparsity S ∈ [10⁰, 10⁻³] and importance distributions.\n• Key Finding: Linear models without ReLU NEVER exhibit superposition (they perform PCA). Non-linearities (ReLU) are mathematically required to enable superposition by suppressing interference noise.\n• Adversarial Vulnerability: Proved adversarial vulnerability increases >3× as superposition forms, because off-axis interference creates easy attack vectors.",
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
                "name": "Feature Dimensionality Formula",
                "formula": "D_i = \\frac{||W_i||^2}{\\sum_j (\\hat{W}_i \\cdot W_j)^2}",
                "original": "Feature Dimensionality Formula: D_i = \\frac{||W_i||^2}{\\sum_j (\\hat{W}_i \\cdot W_j)^2}",
                "simple": "Measures effective dimensionality fraction owned by feature i after interference from all other features j.",
                "meaning": "Measures effective dimensionality fraction owned by feature i after interference from all other features j."
              }
            ],
            "vocabulary": [
              {
                "term": "Superposition",
                "original": "Technical term: «Superposition» as used in this literature.",
                "simple": "Representing M > d sparse features in d dimensions using almost-orthogonal vectors.",
                "def": "Representing M > d sparse features in d dimensions using almost-orthogonal vectors."
              },
              {
                "term": "Polysemanticity",
                "original": "Technical term: «Polysemanticity» as used in this literature.",
                "simple": "A single neuron activating for multiple unrelated concepts due to superposition.",
                "def": "A single neuron activating for multiple unrelated concepts due to superposition."
              },
              {
                "term": "Privileged Basis",
                "original": "Technical term: «Privileged Basis» as used in this literature.",
                "simple": "A coordinate basis made special by architectural non-linearities (e.g. ReLU).",
                "def": "A coordinate basis made special by architectural non-linearities (e.g. ReLU)."
              }
            ],
            "whatItShows": [
              "That superposition occurs naturally in ReLU networks under feature sparsity",
              "That SAE dictionary learning is the mathematical solution to unfolding superposition"
            ],
            "whatItDoesNotShow": [
              "That standard SAEs uniquely recover canonical ground-truth features"
            ],
            "setconcaUse": [
              "Use Superposition Theory as the fundamental justification for why SAE dictionaries are required."
            ],
            "masteryChecklist": [
              "I can explain superposition, interference, and polysemanticity to a beginner.",
              "I can list the three ways out and identify SAEs as Approach 2."
            ],
            "commonConfusions": [
              {
                "wrong": "Superposition happens because networks don't have enough parameters.",
                "right": "Superposition happens because feature sparsity enables efficient high-dimensional packing even in large models."
              }
            ],
            "quiz": [
              {
                "q": "Superposition allows a network to represent?",
                "options": [
                  "More sparse features than activation dimensions",
                  "Fewer features",
                  "Only orthogonal features",
                  "Only linear PCA"
                ],
                "a": 0,
                "explain": "Superposition packs more sparse features than dimensions into activation space."
              },
              {
                "q": "Sparse Autoencoders represent which 'way out' of superposition?",
                "options": [
                  "Approach 2: Finding an overcomplete basis after training",
                  "Deleting MLP layers",
                  "Increasing learning rate",
                  "Using PCA"
                ],
                "a": 0,
                "explain": "SAEs are Approach 2: finding an overcomplete sparse basis."
              }
            ],
            "originalIdea": "Toy Models of Superposition demonstrates how networks pack more sparse features than dimensions via almost-orthogonal directions.",
            "simpleLesson": "Welcome to Anthropic's Toy Models of Superposition (Elhage et al., 2022).\n\n--- THE PARADOX OF NEURAL REPRESENTATIONS ---\nA model with 4,096 activation dimensions can represent TENS OF THOUSANDS of distinct concepts. How?\n\n--- THE SUPERPOSITION HYPOTHESIS ---\nWhen features are SPARSE (active rarely), a network can pack M features into d dimensions (M > d) by embedding features as ALMOST-ORTHOGONAL directions!\n\nThe Interference Cost:\nBecause features are not strictly 90° orthogonal, activating Feature A causes small non-zero interference (crosstalk) on Feature B. When features are sparse, interference happens rarely, and non-linearities (ReLU) wipe out small interference noise.\n\n--- POLYSEMANTIC NEURONS ---\nBecause packed feature directions do not line up with standard neuron basis axes, single neurons become POLYSEMANTIC — activating for multiple unrelated concepts!\n\n--- THREE WAYS OUT -> SPARSITY DICTIONARIES (SAES) ---\nAnthropic listed three ways to resolve superposition:\n1. Train models without superposition (costly).\n2. Find an Overcomplete Basis after training (SAEs / Dictionary Learning).\n3. Hybrid approaches.",
            "limitPairs": [
              {
                "original": "That superposition occurs naturally in ReLU networks under feature sparsity",
                "simple": "In practice this means evidence supports: That superposition occurs naturally in ReLU networks under feature sparsity"
              },
              {
                "original": "That SAE dictionary learning is the mathematical solution to unfolding superposition",
                "simple": "In practice this means evidence supports: That SAE dictionary learning is the mathematical solution to unfolding superposition"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That standard SAEs uniquely recover canonical ground-truth features",
                "simple": "Do not overclaim: That standard SAEs uniquely recover canonical ground-truth features"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Use Superposition Theory as the fundamental justification for why SAE dictionaries are required.",
                "simple": "Action item: Use Superposition Theory as the fundamental justification for why SAE dictionaries are required."
              }
            ]
          },
          "quiz": [
            {
              "q": "Superposition allows a network to represent?",
              "options": [
                "More sparse features than activation dimensions",
                "Fewer features",
                "Only orthogonal features",
                "Only linear PCA"
              ],
              "a": 0,
              "explain": "Superposition packs more sparse features than dimensions into activation space."
            },
            {
              "q": "Sparse Autoencoders represent which 'way out' of superposition?",
              "options": [
                "Approach 2: Finding an overcomplete basis after training",
                "Deleting MLP layers",
                "Increasing learning rate",
                "Using PCA"
              ],
              "a": 0,
              "explain": "SAEs are Approach 2: finding an overcomplete sparse basis."
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
            "whyWeRead": "First large-scale application of sparse dictionary learning to extract monosemantic features from a language model.",
            "oneSentence": "Towards Monosemanticity demonstrates that sparse autoencoders extract interpretable, monosemantic feature directions from language model activations.",
            "plainLanguage": "Welcome to Bricken et al. (Anthropic 2023).\n\nAnthropic applied sparse autoencoders to a 1-layer language model. They showed that SAE dictionary features are significantly more MONOSEMANTIC than raw model neurons!\n\nFeatures activated for specific, consistent concepts (e.g. 'DNA sequences', 'legal terms', 'Hebrew text'). They also demonstrated feature splitting and feature interventions.",
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
                "term": "Monosemanticity",
                "original": "Technical term: «Monosemanticity» as used in this literature.",
                "simple": "The degree to which a feature or neuron responds to a single, consistent concept.",
                "def": "The degree to which a feature or neuron responds to a single, consistent concept."
              }
            ],
            "whatItShows": [
              "That sparse dictionary learning extracts highly interpretable monosemantic feature directions from LM activations"
            ],
            "whatItDoesNotShow": [
              "That learned dictionaries are complete or canonically unique"
            ],
            "setconcaUse": [
              "Adopt their qualitative feature presentation and intervention protocols in SetConCA."
            ],
            "masteryChecklist": [
              "I can explain why SAE features are more monosemantic than neurons."
            ],
            "commonConfusions": [
              {
                "wrong": "Towards Monosemanticity proved all SAE features are 100% pure.",
                "right": "It showed strong monosemanticity improvement while documenting feature splitting and leftover polysemanticity."
              }
            ],
            "quiz": [
              {
                "q": "What did Towards Monosemanticity demonstrate?",
                "options": [
                  "SAE dictionary features are significantly more monosemantic than raw model neurons",
                  "Neurons are pure",
                  "PCA replaces SAEs",
                  "Probes fail"
                ],
                "a": 0,
                "explain": "Showed SAE features are much more monosemantic than raw model neurons."
              }
            ],
            "originalIdea": "Towards Monosemanticity demonstrates that sparse autoencoders extract interpretable, monosemantic feature directions from language model activations.",
            "simpleLesson": "Welcome to Bricken et al. (Anthropic 2023).\n\nAnthropic applied sparse autoencoders to a 1-layer language model. They showed that SAE dictionary features are significantly more MONOSEMANTIC than raw model neurons!\n\nFeatures activated for specific, consistent concepts (e.g. 'DNA sequences', 'legal terms', 'Hebrew text'). They also demonstrated feature splitting and feature interventions.",
            "limitPairs": [
              {
                "original": "That sparse dictionary learning extracts highly interpretable monosemantic feature directions from LM activations",
                "simple": "In practice this means evidence supports: That sparse dictionary learning extracts highly interpretable monosemantic feature directions from LM activations"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That learned dictionaries are complete or canonically unique",
                "simple": "Do not overclaim: That learned dictionaries are complete or canonically unique"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Adopt their qualitative feature presentation and intervention protocols in SetConCA.",
                "simple": "Action item: Adopt their qualitative feature presentation and intervention protocols in SetConCA."
              }
            ]
          },
          "quiz": [
            {
              "q": "What did Towards Monosemanticity demonstrate?",
              "options": [
                "SAE dictionary features are significantly more monosemantic than raw model neurons",
                "Neurons are pure",
                "PCA replaces SAEs",
                "Probes fail"
              ],
              "a": 0,
              "explain": "Showed SAE features are much more monosemantic than raw model neurons."
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
            "whyWeRead": "Central academic SAE paper establishing sparse autoencoder architectures, reconstruction/sparsity objectives, and intervention methodology.",
            "oneSentence": "Sparse Autoencoders Find Highly Interpretable Features in Language Models presents academic SAE training, evaluation, and activation interventions.",
            "plainLanguage": "Welcome to Cunningham et al. (2023).\n\nPublished concurrently with Anthropic's work, Cunningham et al. established academic SAE methodology:\n1. Train SAE: Loss = ||x - x_hat||² + λ ||z||₁\n2. Evaluate Feature Interpretability: Compare SAE features against raw neuron baselines.\n3. Activation Interventions: Clamp or ablate feature activations z_i to verify causal impact on language model token output probabilities!",
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
                "name": "Standard SAE Loss",
                "formula": "L = ||x - x̂||² + λ ||z||₁",
                "original": "Standard SAE Loss: L = ||x - x̂||² + λ ||z||₁",
                "simple": "MSE reconstruction loss plus L1 sparsity penalty on hidden codes z.",
                "meaning": "MSE reconstruction loss plus L1 sparsity penalty on hidden codes z."
              }
            ],
            "vocabulary": [
              {
                "term": "Activation Intervention",
                "original": "Technical term: «Activation Intervention» as used in this literature.",
                "simple": "Modifying feature activations during forward pass to measure causal downstream effect.",
                "def": "Modifying feature activations during forward pass to measure causal downstream effect."
              }
            ],
            "whatItShows": [
              "That SAE features enable precise causal intervention steering of LM output probabilities"
            ],
            "whatItDoesNotShow": [
              "Canonical uniqueness of dictionaries across random seeds"
            ],
            "setconcaUse": [
              "Pointwise SAEs from this paper are the core baseline for SetConCA comparisons."
            ],
            "masteryChecklist": [
              "I can write the classic SAE loss and describe activation intervention evaluation."
            ],
            "commonConfusions": [
              {
                "wrong": "Interpretable activation text alone proves causal utility.",
                "right": "Causal interventions (clamping/ablation) are required to verify true model impact."
              }
            ],
            "quiz": [
              {
                "q": "How do Cunningham et al. verify causal feature importance?",
                "options": [
                  "By clamping/ablating feature activations during forward pass and measuring output probability changes",
                  "By plotting FVU",
                  "By computing CKA",
                  "By running PCA"
                ],
                "a": 0,
                "explain": "Activation interventions (clamping/ablating) verify direct causal impact on model outputs."
              }
            ],
            "originalIdea": "Sparse Autoencoders Find Highly Interpretable Features in Language Models presents academic SAE training, evaluation, and activation interventions.",
            "simpleLesson": "Welcome to Cunningham et al. (2023).\n\nPublished concurrently with Anthropic's work, Cunningham et al. established academic SAE methodology:\n1. Train SAE: Loss = ||x - x_hat||² + λ ||z||₁\n2. Evaluate Feature Interpretability: Compare SAE features against raw neuron baselines.\n3. Activation Interventions: Clamp or ablate feature activations z_i to verify causal impact on language model token output probabilities!",
            "limitPairs": [
              {
                "original": "That SAE features enable precise causal intervention steering of LM output probabilities",
                "simple": "In practice this means evidence supports: That SAE features enable precise causal intervention steering of LM output probabilities"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "Canonical uniqueness of dictionaries across random seeds",
                "simple": "Do not overclaim: Canonical uniqueness of dictionaries across random seeds"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Pointwise SAEs from this paper are the core baseline for SetConCA comparisons.",
                "simple": "Action item: Pointwise SAEs from this paper are the core baseline for SetConCA comparisons."
              }
            ]
          },
          "quiz": [
            {
              "q": "How do Cunningham et al. verify causal feature importance?",
              "options": [
                "By clamping/ablating feature activations during forward pass and measuring output probability changes",
                "By plotting FVU",
                "By computing CKA",
                "By running PCA"
              ],
              "a": 0,
              "explain": "Activation interventions (clamping/ablating) verify direct causal impact on model outputs."
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
            "whyWeRead": "Shows what happens when SAE dictionaries are scaled to frontier models (Claude 3 Sonnet) — and what scale alone does not resolve.",
            "oneSentence": "Scaling Monosemanticity extracts millions of interpretable features from Claude 3 Sonnet using massive sparse autoencoders.",
            "plainLanguage": "Welcome to Templeton et al. (Anthropic 2024).\n\nAnthropic scaled SAEs to Claude 3 Sonnet, extracting millions of features including safety-relevant concepts ('Golden Gate Bridge', 'bias', 'jailbreaks', 'code bugs').\n\nCRITICAL TAKEAWAY: While scale produces fascinating features, scale ALONE does not solve feature absorption, splitting, or non-canonicality!",
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
                "term": "Frontier SAE",
                "original": "Technical term: «Frontier SAE» as used in this literature.",
                "simple": "Massive dictionary sparse autoencoder trained on state-of-the-art language models.",
                "def": "Massive dictionary sparse autoencoder trained on state-of-the-art language models."
              }
            ],
            "whatItShows": [
              "That SAE methods scale to frontier LLMs and reveal safety-relevant feature representations"
            ],
            "whatItDoesNotShow": [
              "That scaling solves structural dictionary failure modes"
            ],
            "setconcaUse": [
              "Do not rely on scale alone; focus on structural multi-view coordination in SetConCA."
            ],
            "masteryChecklist": [
              "I can articulate what scaling SAEs achieves and what open limitations remain."
            ],
            "commonConfusions": [
              {
                "wrong": "Bigger dictionary width eliminates all interpretability errors.",
                "right": "Bigger dictionaries increase feature splitting and non-canonicality issues."
              }
            ],
            "quiz": [
              {
                "q": "Does scaling SAE dictionaries to frontier models solve feature non-canonicality?",
                "options": [
                  "No, structural limitations remain regardless of scale",
                  "Yes, scale solves everything",
                  "Yes, L0 drops to 0",
                  "Yes, PCA is eliminated"
                ],
                "a": 0,
                "explain": "Structural limitations (non-canonicality, absorption) persist regardless of model scale."
              }
            ],
            "originalIdea": "Scaling Monosemanticity extracts millions of interpretable features from Claude 3 Sonnet using massive sparse autoencoders.",
            "simpleLesson": "Welcome to Templeton et al. (Anthropic 2024).\n\nAnthropic scaled SAEs to Claude 3 Sonnet, extracting millions of features including safety-relevant concepts ('Golden Gate Bridge', 'bias', 'jailbreaks', 'code bugs').\n\nCRITICAL TAKEAWAY: While scale produces fascinating features, scale ALONE does not solve feature absorption, splitting, or non-canonicality!",
            "limitPairs": [
              {
                "original": "That SAE methods scale to frontier LLMs and reveal safety-relevant feature representations",
                "simple": "In practice this means evidence supports: That SAE methods scale to frontier LLMs and reveal safety-relevant feature representations"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That scaling solves structural dictionary failure modes",
                "simple": "Do not overclaim: That scaling solves structural dictionary failure modes"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Do not rely on scale alone; focus on structural multi-view coordination in SetConCA.",
                "simple": "Action item: Do not rely on scale alone; focus on structural multi-view coordination in SetConCA."
              }
            ]
          },
          "quiz": [
            {
              "q": "Does scaling SAE dictionaries to frontier models solve feature non-canonicality?",
              "options": [
                "No, structural limitations remain regardless of scale",
                "Yes, scale solves everything",
                "Yes, L0 drops to 0",
                "Yes, PCA is eliminated"
              ],
              "a": 0,
              "explain": "Structural limitations (non-canonicality, absorption) persist regardless of model scale."
            }
          ]
        }
      ],
      "primer": {
        "title": "Mechanistic interpretability foundations",
        "mission": "Understand the Transformer Residual Stream, the Toy Models of Superposition hypothesis, Polysemanticity, and why Sparse Autoencoders (SAEs) exist.",
        "beforeYouStart": "Level 1–2 sparse dictionaries and Level 6 evaluation hygiene.",
        "primer": "Welcome to Level 7. We now enter Mechanistic Interpretability — opening the black box of Transformer language models to understand their exact internal mechanisms.\n\n--- STEP 1: The Residual Stream — The Central Communication Bus ---\nIn a Transformer architecture (Elhage et al., 2021), think of the Residual Stream as a central conveyor belt (communication bus) running through the entire model from Layer 1 to Layer L.\n\nEvery Attention block and MLP block reads from the residual stream, performs computation, and WRITES ITS RESULT BACK by adding it to the residual stream:\nx_{l+1} = x_l + Attention(x_l) + MLP(x_l)\n\nBecause updates are added linearly, features written by early layers can travel directly to deep layers unimpeded!\n\n--- STEP 2: The Superposition Hypothesis (Elhage et al., Anthropic 2022) ---\nHere is the central paradox of neural networks:\nA model with d_model = 4096 dimensions can represent TENS OF THOUSANDS of distinct concepts. How is this mathematically possible?\n\nThe Superposition Hypothesis:\nWhen concepts are SPARSE (only active occasionally), a network can pack MORE features than dimensions by embedding features as ALMOST-ORTHOGONAL directions in space!\n\nThe Interference Cost:\nBecause the feature directions are not strictly 90° orthogonal, activating Feature A creates a small non-zero projection onto Feature B. We call this INTERFERENCE (crosstalk). When features are sparse, interference happens rarely enough that non-linearities (like ReLU) can wipe out the small interference noise!\n\n--- STEP 3: Polysemantic Neurons — Why Reading Single Neurons Fails ---\nBecause features are packed into almost-orthogonal directions in superposition, individual basis neurons in the network get aligned with COMBINATIONS of multiple features!\nA single neuron might fire for 'academic citation markers' AND 'photos of anime characters' AND 'Arabic verbs'. This is called a POLYSEMANTIC NEURON.\n\nReading individual neurons is a dead end. Concepts live along FEATURE DIRECTIONS, not along individual neuron axes!\n\n--- STEP 4: Enter Sparse Autoencoders (SAEs) — Finding an Overcomplete Basis ---\nIn 'Toy Models of Superposition' (2022), Anthropic listed 'Approach 2: Find an Overcomplete Basis after training'. This is EXACTLY what a Sparse Autoencoder (SAE) is!\n\nAn SAE takes superposed activations x from the residual stream, projects them into a high-dimensional overcomplete sparse dictionary z = TopK(W_enc x + b_enc), and reconstructs x_hat = W_dec z + b_dec.\n\nBy enforcing high overcompleteness (e.g. 16x width) and strict sparsity, the SAE unfolds superposed directions into clean, MONOSEMANTIC dictionary features!",
        "bigPictureDiagram": [
          "Residual Stream (d_model dimensions) ──[Carries superposed features]──",
          "Superposition: N sparse features (N > d_model) packed as almost-orthogonal vectors",
          "Result on Basis Neurons: Polysemanticity (1 neuron = mashup of 3 unrelated concepts)",
          "SAE Solution: Overcomplete Encoder → Sparse Bottleneck (z) → Unfolds monosemantic feature directions"
        ],
        "conceptsToMaster": [
          {
            "name": "Residual Stream",
            "simple": "The main vector pathway running through a Transformer that layers read from and write updates into via linear addition.",
            "deeper": "x_{l+1} = x_l + f_l(x_l). Acts as a linear communication bus. Allows linear paths through the network where components write feature vectors directly to downstream layers."
          },
          {
            "name": "Superposition",
            "simple": "Packing more sparse features than available dimensions into a vector space by placing feature directions at slight non-orthogonal angles.",
            "deeper": "Representing M features in d dimensions (M > d). Enabled by feature sparsity and non-linearities. Features form geometric polytopes (e.g. Thomson problem configurations) to minimize cross-feature interference."
          },
          {
            "name": "Polysemanticity",
            "simple": "When a single neuron lights up for multiple totally unrelated concepts because superposition packed those concepts together.",
            "deeper": "Occurs when feature directions are not aligned with standard basis vectors. A neuron coordinate x_i = e_i^T (sum c_j v_j) receives projections from multiple concept directions v_j."
          },
          {
            "name": "Monosemantic Feature",
            "simple": "A feature direction that fires for ONE clear, consistent semantic concept across all contexts.",
            "deeper": "A direction v in activation space corresponding to a single conceptual variable. SAEs attempt to isolate monosemantic directions by finding an overcomplete sparse basis."
          }
        ],
        "checkpoint": {
          "goal": "Write a mechanistic interpretation breakdown linking superposition theory to residual stream activations.",
          "steps": [
            "Estimate the activation sparsity regime of a chosen layer.",
            "Identify polysemantic neurons by inspecting top-activating token contexts.",
            "State why a standard pointwise SAE acts as Approach 2 for unfolding superposition."
          ],
          "successLooksLike": "You can explain clearly why neuron-level interpretability fails under superposition and why SAE overcomplete dictionaries are required."
        },
        "bridgeToNext": "Now that you know why SAEs are needed, Level 8 compares Modern SAE Architectures (TopK, Gated, JumpReLU, BatchTopK, Matryoshka) on fair Pareto frontiers."
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
            "whyWeRead": "TopK SAE is the modern gold standard architecture for sparse autoencoder research.",
            "oneSentence": "Scaling and Evaluating Sparse Autoencoders establishes TopK SAEs, expansion factor scaling, and matched Pareto frontier comparisons.",
            "plainLanguage": "Welcome to Gao et al. (OpenAI 2024).\n\nOpenAI introduced TopK SAEs:\nz = TopK( W_enc x + b_enc, k )\nLoss = ||x - W_dec z - b_dec||²\n\nBy keeping the exact top k activations without an L1 penalty, TopK SAEs completely eliminate L1 magnitude shrinkage, achieving a dramatically superior Reconstruction vs. Sparsity Pareto curve!",
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
                "name": "TopK SAE Encoder",
                "formula": "z = TopK( W_{enc} (x - b_{dec}) + b_{enc}, k )",
                "original": "TopK SAE Encoder: z = TopK( W_{enc} (x - b_{dec}) + b_{enc}, k )",
                "simple": "Keep top k pre-activations; set remaining entries to 0.",
                "meaning": "Keep top k pre-activations; set remaining entries to 0."
              }
            ],
            "vocabulary": [
              {
                "term": "TopK SAE",
                "original": "Technical term: «TopK SAE» as used in this literature.",
                "simple": "Sparse autoencoder using hard TopK activation operator.",
                "def": "Sparse autoencoder using hard TopK activation operator."
              }
            ],
            "whatItShows": [
              "That TopK SAEs beat L1 SAEs across reconstruction-sparsity Pareto frontiers"
            ],
            "whatItDoesNotShow": [
              "That TopK solves feature absorption or non-canonicality"
            ],
            "setconcaUse": [
              "Default baseline architecture family for SetConCA evaluations."
            ],
            "masteryChecklist": [
              "I can explain why TopK beats L1 on Pareto curves."
            ],
            "commonConfusions": [
              {
                "wrong": "TopK uses an L1 penalty.",
                "right": "TopK uses NO L1 penalty. Sparsity is enforced by hard TopK selection."
              }
            ],
            "quiz": [
              {
                "q": "Why do TopK SAEs achieve better Pareto frontiers than L1 SAEs?",
                "options": [
                  "TopK eliminates L1 magnitude shrinkage on active features",
                  "TopK uses more parameters",
                  "TopK runs faster on CPU",
                  "TopK uses CKA"
                ],
                "a": 0,
                "explain": "TopK eliminates L1 magnitude shrinkage on active feature values."
              }
            ],
            "originalIdea": "Scaling and Evaluating Sparse Autoencoders establishes TopK SAEs, expansion factor scaling, and matched Pareto frontier comparisons.",
            "simpleLesson": "Welcome to Gao et al. (OpenAI 2024).\n\nOpenAI introduced TopK SAEs:\nz = TopK( W_enc x + b_enc, k )\nLoss = ||x - W_dec z - b_dec||²\n\nBy keeping the exact top k activations without an L1 penalty, TopK SAEs completely eliminate L1 magnitude shrinkage, achieving a dramatically superior Reconstruction vs. Sparsity Pareto curve!",
            "limitPairs": [
              {
                "original": "That TopK SAEs beat L1 SAEs across reconstruction-sparsity Pareto frontiers",
                "simple": "In practice this means evidence supports: That TopK SAEs beat L1 SAEs across reconstruction-sparsity Pareto frontiers"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That TopK solves feature absorption or non-canonicality",
                "simple": "Do not overclaim: That TopK solves feature absorption or non-canonicality"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Default baseline architecture family for SetConCA evaluations.",
                "simple": "Action item: Default baseline architecture family for SetConCA evaluations."
              }
            ]
          },
          "quiz": [
            {
              "q": "Why do TopK SAEs achieve better Pareto frontiers than L1 SAEs?",
              "options": [
                "TopK eliminates L1 magnitude shrinkage on active features",
                "TopK uses more parameters",
                "TopK runs faster on CPU",
                "TopK uses CKA"
              ],
              "a": 0,
              "explain": "TopK eliminates L1 magnitude shrinkage on active feature values."
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
            "whyWeRead": "Gated SAEs fix L1 shrinkage while maintaining full differentiability by separating gating from magnitude.",
            "oneSentence": "Improving Dictionary Learning with Gated Sparse Autoencoders decouples activation gating from feature magnitude calculation.",
            "plainLanguage": "Welcome to Rajamanoharan et al. (DeepMind 2024).\n\nGated SAEs split the encoder into two parallel paths:\n1. Gate Path: π = Heaviside( W_gate x + b_gate ) -> Binary on/off mask.\n2. Magnitude Path: m = ReLU( W_mag x + b_mag ) -> Unpenalized positive magnitude.\n3. Output: z = π ⊙ m\n\nThis fixes L1 magnitude shrinkage while remaining fully differentiable!",
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
                "term": "Gated SAE",
                "original": "Technical term: «Gated SAE» as used in this literature.",
                "simple": "SAE architecture separating gating mask from feature magnitude calculation.",
                "def": "SAE architecture separating gating mask from feature magnitude calculation."
              }
            ],
            "whatItShows": [
              "That separating gating from magnitude eliminates L1 shrinkage cleanly"
            ],
            "whatItDoesNotShow": [
              "That Gated SAEs resolve non-canonical dictionary unit issues"
            ],
            "setconcaUse": [
              "Include Gated SAE in multi-architecture bake-offs."
            ],
            "masteryChecklist": [
              "I can draw the Gated SAE dual-encoder diagram."
            ],
            "commonConfusions": [
              {
                "wrong": "Gated SAE is identical to TopK.",
                "right": "TopK uses hard k selection. Gated SAE uses dual gating/magnitude pathways with L1 on the gate."
              }
            ],
            "quiz": [
              {
                "q": "How do Gated SAEs eliminate magnitude shrinkage?",
                "options": [
                  "By using separate neural pathways for gating decisions and magnitude calculations",
                  "By setting k=1",
                  "By removing decoders",
                  "By running PCA"
                ],
                "a": 0,
                "explain": "Separates gating decisions from magnitude calculations so magnitudes are unpenalized."
              }
            ],
            "originalIdea": "Improving Dictionary Learning with Gated Sparse Autoencoders decouples activation gating from feature magnitude calculation.",
            "simpleLesson": "Welcome to Rajamanoharan et al. (DeepMind 2024).\n\nGated SAEs split the encoder into two parallel paths:\n1. Gate Path: π = Heaviside( W_gate x + b_gate ) -> Binary on/off mask.\n2. Magnitude Path: m = ReLU( W_mag x + b_mag ) -> Unpenalized positive magnitude.\n3. Output: z = π ⊙ m\n\nThis fixes L1 magnitude shrinkage while remaining fully differentiable!",
            "limitPairs": [
              {
                "original": "That separating gating from magnitude eliminates L1 shrinkage cleanly",
                "simple": "In practice this means evidence supports: That separating gating from magnitude eliminates L1 shrinkage cleanly"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That Gated SAEs resolve non-canonical dictionary unit issues",
                "simple": "Do not overclaim: That Gated SAEs resolve non-canonical dictionary unit issues"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Include Gated SAE in multi-architecture bake-offs.",
                "simple": "Action item: Include Gated SAE in multi-architecture bake-offs."
              }
            ]
          },
          "quiz": [
            {
              "q": "How do Gated SAEs eliminate magnitude shrinkage?",
              "options": [
                "By using separate neural pathways for gating decisions and magnitude calculations",
                "By setting k=1",
                "By removing decoders",
                "By running PCA"
              ],
              "a": 0,
              "explain": "Separates gating decisions from magnitude calculations so magnitudes are unpenalized."
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
            "whyWeRead": "JumpReLU uses learned thresholds for direct L0-style sparsity optimization.",
            "oneSentence": "Jumping Ahead: Improving Reconstruction Fidelity with JumpReLU SAEs uses discontinuous thresholded activations.",
            "plainLanguage": "Welcome to Rajamanoharan et al. (2024).\n\nJumpReLU applies a feature-specific threshold θ_i:\nz_i = x_i if x_i > θ_i else 0\n\nBecause below threshold θ_i the feature is strictly zero and above θ_i it retains its full value, JumpReLU approximates direct L0 optimization better than soft L1 penalties.",
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
                "simple": "Thresholded activation function jumping from 0 to value above threshold θ.",
                "def": "Thresholded activation function jumping from 0 to value above threshold θ."
              }
            ],
            "whatItShows": [
              "That thresholded JumpReLU activations improve SAE Pareto frontiers"
            ],
            "whatItDoesNotShow": [
              "Unique feature canonicality"
            ],
            "setconcaUse": [
              "Include JumpReLU in matched Pareto comparisons."
            ],
            "masteryChecklist": [
              "I can explain JumpReLU thresholding."
            ],
            "commonConfusions": [
              {
                "wrong": "JumpReLU threshold θ is fixed across all features.",
                "right": "JumpReLU learns an independent threshold θ_i for each feature."
              }
            ],
            "quiz": [
              {
                "q": "What does JumpReLU use to determine feature firing?",
                "options": [
                  "Learned per-feature threshold barriers θ_i",
                  "Fixed TopK",
                  "PCA variance",
                  "CKA score"
                ],
                "a": 0,
                "explain": "JumpReLU uses learned per-feature thresholds θ_i."
              }
            ],
            "originalIdea": "Jumping Ahead: Improving Reconstruction Fidelity with JumpReLU SAEs uses discontinuous thresholded activations.",
            "simpleLesson": "Welcome to Rajamanoharan et al. (2024).\n\nJumpReLU applies a feature-specific threshold θ_i:\nz_i = x_i if x_i > θ_i else 0\n\nBecause below threshold θ_i the feature is strictly zero and above θ_i it retains its full value, JumpReLU approximates direct L0 optimization better than soft L1 penalties.",
            "limitPairs": [
              {
                "original": "That thresholded JumpReLU activations improve SAE Pareto frontiers",
                "simple": "In practice this means evidence supports: That thresholded JumpReLU activations improve SAE Pareto frontiers"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "Unique feature canonicality",
                "simple": "Do not overclaim: Unique feature canonicality"
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
              "q": "What does JumpReLU use to determine feature firing?",
              "options": [
                "Learned per-feature threshold barriers θ_i",
                "Fixed TopK",
                "PCA variance",
                "CKA score"
              ],
              "a": 0,
              "explain": "JumpReLU uses learned per-feature thresholds θ_i."
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
            "whyWeRead": "BatchTopK applies TopK across a whole minibatch, allowing variable active features per token.",
            "oneSentence": "BatchTopK Sparse Autoencoders constrain total active features across an entire batch for flexible allocation.",
            "plainLanguage": "Welcome to Bussmann & Leask (2024).\n\nStandard TopK forces EVERY token to activate exactly k features (e.g. k=32). But simple tokens ('the', '.') need only 5 features, while complex tokens ('quantum electrodynamics') need 60 features!\n\nBatchTopK applies TopK across all token activations in a MINIBATCH simultaneously! Complex tokens get more active features, simple tokens get fewer, improving overall allocation efficiency.",
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
                "simple": "TopK selection applied across an entire minibatch rather than per-token.",
                "def": "TopK selection applied across an entire minibatch rather than per-token."
              }
            ],
            "whatItShows": [
              "That flexible per-token sparsity allocation improves reconstruction efficiency"
            ],
            "whatItDoesNotShow": [
              "Solved feature absorption"
            ],
            "setconcaUse": [
              "Useful when activation view sets vary wildly in token complexity."
            ],
            "masteryChecklist": [
              "I can explain why BatchTopK beats fixed per-token TopK for heterogeneous tokens."
            ],
            "commonConfusions": [
              {
                "wrong": "BatchTopK removes sparsity constraints.",
                "right": "BatchTopK enforces the exact same total sparsity budget across the batch, but distributes it dynamically."
              }
            ],
            "quiz": [
              {
                "q": "Why is BatchTopK advantageous for language model tokens?",
                "options": [
                  "Allows complex tokens to use more features while simple tokens use fewer",
                  "Eliminates decoders",
                  "Runs offline",
                  "Uses PCA"
                ],
                "a": 0,
                "explain": "Dynamically allocates feature budgets based on token complexity across the minibatch."
              }
            ],
            "originalIdea": "BatchTopK Sparse Autoencoders constrain total active features across an entire batch for flexible allocation.",
            "simpleLesson": "Welcome to Bussmann & Leask (2024).\n\nStandard TopK forces EVERY token to activate exactly k features (e.g. k=32). But simple tokens ('the', '.') need only 5 features, while complex tokens ('quantum electrodynamics') need 60 features!\n\nBatchTopK applies TopK across all token activations in a MINIBATCH simultaneously! Complex tokens get more active features, simple tokens get fewer, improving overall allocation efficiency.",
            "limitPairs": [
              {
                "original": "That flexible per-token sparsity allocation improves reconstruction efficiency",
                "simple": "In practice this means evidence supports: That flexible per-token sparsity allocation improves reconstruction efficiency"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "Solved feature absorption",
                "simple": "Do not overclaim: Solved feature absorption"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Useful when activation view sets vary wildly in token complexity.",
                "simple": "Action item: Useful when activation view sets vary wildly in token complexity."
              }
            ]
          },
          "quiz": [
            {
              "q": "Why is BatchTopK advantageous for language model tokens?",
              "options": [
                "Allows complex tokens to use more features while simple tokens use fewer",
                "Eliminates decoders",
                "Runs offline",
                "Uses PCA"
              ],
              "a": 0,
              "explain": "Dynamically allocates feature budgets based on token complexity across the minibatch."
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
            "whyWeRead": "Matryoshka SAEs learn multi-granularity nested features within a single dictionary model.",
            "oneSentence": "Learning Multi-Level Features with Matryoshka Sparse Autoencoders creates nested feature prefixes for coarse-to-fine concepts.",
            "plainLanguage": "Welcome to Bussmann et al. (2025).\n\nNamed after Russian nesting dolls, Matryoshka SAEs train feature dictionaries so that NESTED PREFIXES of features (e.g. first 500, first 2,000, first 8,000) form valid, high-quality representations at different granularities!\n\nThis resolves the dictionary-size dilemma by capturing coarse high-level concepts and fine-grained sub-concepts inside one trained dictionary.",
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
                "term": "Matryoshka SAE",
                "original": "Technical term: «Matryoshka SAE» as used in this literature.",
                "simple": "SAE trained with nested feature loss prefixes for multi-scale representations.",
                "def": "SAE trained with nested feature loss prefixes for multi-scale representations."
              }
            ],
            "whatItShows": [
              "That nested multi-granularity feature dictionaries can be trained in a single model"
            ],
            "whatItDoesNotShow": [
              "True ontological hierarchy of language"
            ],
            "setconcaUse": [
              "Inspiration for multi-granularity concept hierarchy in SetConCA."
            ],
            "masteryChecklist": [
              "I can explain how Matryoshka SAEs nest feature prefixes."
            ],
            "commonConfusions": [
              {
                "wrong": "Matryoshka requires training separate SAE models for each size.",
                "right": "Matryoshka trains a single SAE model with nested prefix loss terms."
              }
            ],
            "quiz": [
              {
                "q": "What characterizes a Matryoshka SAE?",
                "options": [
                  "Nested feature prefixes providing coarse-to-fine concept granularities in one model",
                  "Linear CCA",
                  "Single feature dictionary of size 1",
                  "No encoder"
                ],
                "a": 0,
                "explain": "Nested feature prefixes provide multi-granularity representations in one model."
              }
            ],
            "originalIdea": "Learning Multi-Level Features with Matryoshka Sparse Autoencoders creates nested feature prefixes for coarse-to-fine concepts.",
            "simpleLesson": "Welcome to Bussmann et al. (2025).\n\nNamed after Russian nesting dolls, Matryoshka SAEs train feature dictionaries so that NESTED PREFIXES of features (e.g. first 500, first 2,000, first 8,000) form valid, high-quality representations at different granularities!\n\nThis resolves the dictionary-size dilemma by capturing coarse high-level concepts and fine-grained sub-concepts inside one trained dictionary.",
            "limitPairs": [
              {
                "original": "That nested multi-granularity feature dictionaries can be trained in a single model",
                "simple": "In practice this means evidence supports: That nested multi-granularity feature dictionaries can be trained in a single model"
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
                "original": "Inspiration for multi-granularity concept hierarchy in SetConCA.",
                "simple": "Action item: Inspiration for multi-granularity concept hierarchy in SetConCA."
              }
            ]
          },
          "quiz": [
            {
              "q": "What characterizes a Matryoshka SAE?",
              "options": [
                "Nested feature prefixes providing coarse-to-fine concept granularities in one model",
                "Linear CCA",
                "Single feature dictionary of size 1",
                "No encoder"
              ],
              "a": 0,
              "explain": "Nested feature prefixes provide multi-granularity representations in one model."
            }
          ]
        }
      ],
      "primer": {
        "title": "Modern SAE architectures",
        "mission": "Compare modern SAE architectures: L1, TopK, Gated, JumpReLU, BatchTopK, and Matryoshka SAEs. Master fair evaluation on Pareto frontiers.",
        "beforeYouStart": "Level 7 SAE motivation.",
        "primer": "Welcome to Level 8. Once researchers realized Sparse Autoencoders could unpack superposed features, an architectural arms race began.\n\nDifferent architectures enforce sparsity differently and handle feature magnitudes differently. In this level, we compare the six major SAE architecture families.\n\n--- 1. L1 SAE (Bricken et al., 2023; Cunningham et al., 2023) ---\n• Encoder: z = ReLU(W_enc x + b_enc)\n• Loss: ||x - x_hat||² + λ ||z||₁\n• Pros: Simple, classic baseline.\n• Cons: Severe L1 magnitude shrinkage (under-estimates feature strength) and dead feature problems.\n\n--- 2. TopK SAE (Gao et al., OpenAI 2024) ---\n• Encoder: z = TopK(W_enc x + b_enc, k)\n• Loss: Pure reconstruction loss ||x - x_hat||²\n• Pros: Enforces exact sparsity k per token with ZERO magnitude shrinkage! Superior Pareto frontier.\n• Cons: Hard threshold can create optimization step-function challenges.\n\n--- 3. Gated SAE (Rajamanoharan et al., DeepMind 2024) ---\n• Mechanism: Separates the gating decision (is feature active?) from magnitude calculation.\n• Gate: π = Heaviside(W_gate x + b_gate)\n• Magnitude: m = ReLU(W_mag x + b_mag)\n• Output: z = π ⊙ m\n• Pros: Eliminates L1 shrinkage while remaining fully differentiable.\n\n--- 4. JumpReLU SAE (Rajamanoharan et al., 2024) ---\n• Encoder: z = x * H(x - θ) where H is Heaviside step and θ is a learned threshold per feature.\n• Pros: Direct L0-style optimization with learned feature-specific thresholds.\n\n--- 5. BatchTopK SAE (Bussmann & Leask, 2024) ---\n• Mechanism: Instead of fixing exactly k active features for EVERY token, BatchTopK enforces a global sparsity budget across an ENTIRE MINIBATCH.\n• Advantage: Difficult tokens (complex text) get to activate 50 features, while simple tokens (punctuation) activate only 5 features!\n\n--- 6. Matryoshka SAE (Bussmann et al., 2025) ---\n• Mechanism: Nested multi-level dictionaries. Features are ordered such that the first 500 features form a coarse dictionary, the first 2000 form a medium dictionary, and all 8000 form a fine-grained dictionary!\n• Advantage: Provides multi-granularity concept representations inside a single trained model.\n\nRULE OF FAIR COMPARISON — THE PARETO FRONTIER:\nNEVER compare two SAE architectures at arbitrary single hyperparameter points! Always plot the Reconstruction vs. Sparsity Pareto Curve (FVU vs. L0). Method A is superior to Method B ONLY if Method A's curve lies strictly below Method B's curve across matched operating points.",
        "bigPictureDiagram": [
          "L1 SAE: ReLU pre-activations + L1 penalty (Shrinkage flaw)",
          "TopK SAE: Keep top-k values, zero rest (Exact sparsity, no shrinkage)",
          "Gated SAE: Separate Gate Pathway π ⊙ Magnitude Pathway m (Differentiable, no shrinkage)",
          "JumpReLU: Learned feature threshold θ_i (Direct L0 proxy)",
          "BatchTopK: TopK applied across full minibatch (Flexible token budgets)",
          "Matryoshka: Nested feature prefixes [Coarse | Medium | Fine] (Multi-scale concepts)"
        ],
        "conceptsToMaster": [
          {
            "name": "TopK SAE",
            "simple": "An SAE that keeps exactly the k largest feature activations per token and zeroes the rest, avoiding L1 magnitude shrinkage.",
            "deeper": "z = TopK(W_enc(x - b_dec) + b_enc, k). Loss is pure MSE. Eliminates shrinkage because non-zero activations carry unpenalized encoder magnitudes."
          },
          {
            "name": "Gated SAE",
            "simple": "An SAE that uses one neural path to decide IF a feature turns on, and a separate path to measure HOW STRONGLY it fires.",
            "deeper": "Uses dual encoder pathways: gating net produces binary mask π via thresholding, magnitude net produces positive magnitude m. z = π ⊙ m. Resolves shrinkage while maintaining smooth gradient flow."
          },
          {
            "name": "Expansion Factor",
            "simple": "The ratio of dictionary width to activation dimension (e.g. 16x expansion = 65,536 features for a 4,096-dim model).",
            "deeper": "Expansion ratio r = d_sae / d_model. Higher expansion reduces feature merging and absorption, but increases compute and memory footprint."
          },
          {
            "name": "Pareto Frontier (FVU vs L0)",
            "simple": "A graph plotting reconstruction error against sparsity. Fair comparisons compare architectures at the exact same sparsity level.",
            "deeper": "Plots Fraction of Variance Unexplained (FVU) on y-axis against L0 (average active features) on x-axis. Evaluates architectural efficiency across all operational regimes."
          }
        ],
        "checkpoint": {
          "goal": "Train L1, TopK, and Gated SAE variants on activation data; plot their FVU vs L0 Pareto curves.",
          "steps": [
            "Sweep L1 penalty λ to generate L1 Pareto curve.",
            "Sweep TopK parameter k to generate TopK Pareto curve.",
            "Plot both curves on the same FVU vs L0 axes.",
            "Verify at matched L0 = 20 which architecture achieves lower FVU."
          ],
          "successLooksLike": "You can demonstrate on a clean Pareto graph why TopK and Gated SAEs outperform vanilla L1 SAEs."
        },
        "bridgeToNext": "Now that you know modern architectures, Level 9 explores SAE Evaluation & Failure Modes: Feature Absorption, Feature Splitting, and Non-Canonical Units."
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
            "whyWeRead": "Demonstrates that reconstruction and sparsity proxy metrics are insufficient to prove interpretability or control.",
            "oneSentence": "Towards Principled Evaluations of Sparse Autoencoders argues for task-relevant control and intervention evaluations.",
            "plainLanguage": "Welcome to Makelov et al. (2024).\n\nThis paper warns the field: low FVU and low L0 are NECESSARY HYGIENE, BUT NOT SUFFICIENT PROOF of interpretability!\n\nA dictionary can achieve great FVU while completely failing downstream intervention, steering, or task-control tests. Always evaluate claim-aligned downstream tasks.",
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
                "term": "Proxy Metric",
                "original": "Technical term: «Proxy Metric» as used in this literature.",
                "simple": "An easy-to-compute metric (like FVU or L0) that may not track true research goals.",
                "def": "An easy-to-compute metric (like FVU or L0) that may not track true research goals."
              }
            ],
            "whatItShows": [
              "That SAE research must evaluate downstream task performance beyond proxy metrics"
            ],
            "whatItDoesNotShow": [
              "A single universal metric for all interpretability claims"
            ],
            "setconcaUse": [
              "Design SetConCA evaluation around claim-aligned task performance, not just FVU."
            ],
            "masteryChecklist": [
              "I refuse papers that claim success based on FVU alone."
            ],
            "commonConfusions": [
              {
                "wrong": "The SAE with lowest FVU is automatically the most interpretable.",
                "right": "Lowest FVU only means best variance reconstruction; it can still suffer from feature absorption and non-canonicality."
              }
            ],
            "quiz": [
              {
                "q": "Why are FVU and L0 called 'proxy metrics'?",
                "options": [
                  "They measure hygiene but do not guarantee downstream feature interpretability or control",
                  "They are inaccurate",
                  "They require GPUs",
                  "They are non-linear"
                ],
                "a": 0,
                "explain": "Proxy metrics measure hygiene but do not guarantee downstream task control or interpretability."
              }
            ],
            "originalIdea": "Towards Principled Evaluations of Sparse Autoencoders argues for task-relevant control and intervention evaluations.",
            "simpleLesson": "Welcome to Makelov et al. (2024).\n\nThis paper warns the field: low FVU and low L0 are NECESSARY HYGIENE, BUT NOT SUFFICIENT PROOF of interpretability!\n\nA dictionary can achieve great FVU while completely failing downstream intervention, steering, or task-control tests. Always evaluate claim-aligned downstream tasks.",
            "limitPairs": [
              {
                "original": "That SAE research must evaluate downstream task performance beyond proxy metrics",
                "simple": "In practice this means evidence supports: That SAE research must evaluate downstream task performance beyond proxy metrics"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "A single universal metric for all interpretability claims",
                "simple": "Do not overclaim: A single universal metric for all interpretability claims"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Design SetConCA evaluation around claim-aligned task performance, not just FVU.",
                "simple": "Action item: Design SetConCA evaluation around claim-aligned task performance, not just FVU."
              }
            ]
          },
          "quiz": [
            {
              "q": "Why are FVU and L0 called 'proxy metrics'?",
              "options": [
                "They measure hygiene but do not guarantee downstream feature interpretability or control",
                "They are inaccurate",
                "They require GPUs",
                "They are non-linear"
              ],
              "a": 0,
              "explain": "Proxy metrics measure hygiene but do not guarantee downstream task control or interpretability."
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
            "whyWeRead": "Defines Feature Splitting and Feature Absorption — two core empirical failure modes of SAEs.",
            "oneSentence": "Studying Feature Splitting and Absorption in Sparse Autoencoders details how concepts fragment or get swallowed by latents.",
            "plainLanguage": "Welcome to Chanin et al. (2024).\n\nThis paper details two fundamental structural flaws of SAEs:\n\n1. Feature Splitting: A single concept fragments into dozens of sub-features as dictionary size grows.\n2. Feature Absorption: A broad feature 'swallows' or absorbs related specific sub-concepts when dictionary width or sparsity is constrained.\n\nBoth failure modes break the naive hope that '1 SAE Latent = 1 Ground-Truth Atomic Concept'.",
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
                "term": "Feature Absorption",
                "original": "Technical term: «Feature Absorption» as used in this literature.",
                "simple": "A failure mode where one SAE feature absorbs multiple related sub-concepts.",
                "def": "A failure mode where one SAE feature absorbs multiple related sub-concepts."
              },
              {
                "term": "Feature Splitting",
                "original": "Technical term: «Feature Splitting» as used in this literature.",
                "simple": "A failure mode where one concept splits across many feature latents.",
                "def": "A failure mode where one concept splits across many feature latents."
              }
            ],
            "whatItShows": [
              "That SAE latents systematically absorb or split concepts depending on dictionary capacity"
            ],
            "whatItDoesNotShow": [
              "That single-view SAEs can automatically resolve absorption"
            ],
            "setconcaUse": [
              "Target Feature Absorption as a primary failure mode to beat using multi-view set supervision in SetConCA."
            ],
            "masteryChecklist": [
              "I can define Splitting and Absorption with concrete examples."
            ],
            "commonConfusions": [
              {
                "wrong": "Absorption only happens in bad code implementation.",
                "right": "Absorption is a structural property of sparse dictionary optimization under capacity constraints."
              }
            ],
            "quiz": [
              {
                "q": "What occurs during Feature Absorption?",
                "options": [
                  "A single dominant feature swallows related specific sub-concepts",
                  "A feature deletes itself",
                  "FVU drops to 0",
                  "PCA rank increases"
                ],
                "a": 0,
                "explain": "Feature Absorption occurs when one feature swallows related specific sub-concepts."
              }
            ],
            "originalIdea": "Studying Feature Splitting and Absorption in Sparse Autoencoders details how concepts fragment or get swallowed by latents.",
            "simpleLesson": "Welcome to Chanin et al. (2024).\n\nThis paper details two fundamental structural flaws of SAEs:\n\n1. Feature Splitting: A single concept fragments into dozens of sub-features as dictionary size grows.\n2. Feature Absorption: A broad feature 'swallows' or absorbs related specific sub-concepts when dictionary width or sparsity is constrained.\n\nBoth failure modes break the naive hope that '1 SAE Latent = 1 Ground-Truth Atomic Concept'.",
            "limitPairs": [
              {
                "original": "That SAE latents systematically absorb or split concepts depending on dictionary capacity",
                "simple": "In practice this means evidence supports: That SAE latents systematically absorb or split concepts depending on dictionary capacity"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That single-view SAEs can automatically resolve absorption",
                "simple": "Do not overclaim: That single-view SAEs can automatically resolve absorption"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Target Feature Absorption as a primary failure mode to beat using multi-view set supervision in SetConCA.",
                "simple": "Action item: Target Feature Absorption as a primary failure mode to beat using multi-view set supervision in SetConCA."
              }
            ]
          },
          "quiz": [
            {
              "q": "What occurs during Feature Absorption?",
              "options": [
                "A single dominant feature swallows related specific sub-concepts",
                "A feature deletes itself",
                "FVU drops to 0",
                "PCA rank increases"
              ],
              "a": 0,
              "explain": "Feature Absorption occurs when one feature swallows related specific sub-concepts."
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
            "whyWeRead": "Critical narrative paper proving SAEs do not find unique, canonical units of analysis.",
            "oneSentence": "Sparse Autoencoders Do Not Find Canonical Units of Analysis demonstrates that different random seeds yield non-identical feature dictionaries of equal quality.",
            "plainLanguage": "Welcome to Leask et al. (2025).\n\nIf you train two SAEs (Seed A and Seed B) on the exact same layer with identical hyperparameters, do they discover the same features?\n\nNO! Leask et al. proved that Seed A and Seed B discover DIFFERENT, non-identical feature dictionaries despite achieving identical reconstruction and sparsity!\n\nCONCLUSION: There is NO single 'canonical' sparse basis in activation space. Claims that 'we discovered the true fundamental features' are scientifically false.",
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
                "term": "Canonical Basis",
                "original": "Technical term: «Canonical Basis» as used in this literature.",
                "simple": "A unique, privileged feature decomposition — proven to be absent in standard SAEs.",
                "def": "A unique, privileged feature decomposition — proven to be absent in standard SAEs."
              }
            ],
            "whatItShows": [
              "That standard SAEs do not find unique canonical feature bases across random seeds"
            ],
            "whatItDoesNotShow": [
              "That interpretability research is useless"
            ],
            "setconcaUse": [
              "Test whether multi-view set supervision in SetConCA increases cross-seed dictionary canonicality (stitching agreement)."
            ],
            "masteryChecklist": [
              "I can explain why seed-variance tests disprove dictionary uniqueness."
            ],
            "commonConfusions": [
              {
                "wrong": "Different seeds finding different features means SAEs failed completely.",
                "right": "It means uniqueness fails; dictionaries are frame representations rather than unique canonical bases."
              }
            ],
            "quiz": [
              {
                "q": "What did Leask et al. prove regarding SAE feature dictionaries?",
                "options": [
                  "Different random seeds yield different non-identical feature dictionaries of equal quality",
                  "All seeds find identical features",
                  "SAEs cannot be trained",
                  "PCA is unique"
                ],
                "a": 0,
                "explain": "Proved different random seeds produce non-identical feature dictionaries of equal quality."
              }
            ],
            "originalIdea": "Sparse Autoencoders Do Not Find Canonical Units of Analysis demonstrates that different random seeds yield non-identical feature dictionaries of equal quality.",
            "simpleLesson": "Welcome to Leask et al. (2025).\n\nIf you train two SAEs (Seed A and Seed B) on the exact same layer with identical hyperparameters, do they discover the same features?\n\nNO! Leask et al. proved that Seed A and Seed B discover DIFFERENT, non-identical feature dictionaries despite achieving identical reconstruction and sparsity!\n\nCONCLUSION: There is NO single 'canonical' sparse basis in activation space. Claims that 'we discovered the true fundamental features' are scientifically false.",
            "limitPairs": [
              {
                "original": "That standard SAEs do not find unique canonical feature bases across random seeds",
                "simple": "In practice this means evidence supports: That standard SAEs do not find unique canonical feature bases across random seeds"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That interpretability research is useless",
                "simple": "Do not overclaim: That interpretability research is useless"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Test whether multi-view set supervision in SetConCA increases cross-seed dictionary canonicality (stitching agreement).",
                "simple": "Action item: Test whether multi-view set supervision in SetConCA increases cross-seed dictionary canonicality (stitching agreement)."
              }
            ]
          },
          "quiz": [
            {
              "q": "What did Leask et al. prove regarding SAE feature dictionaries?",
              "options": [
                "Different random seeds yield different non-identical feature dictionaries of equal quality",
                "All seeds find identical features",
                "SAEs cannot be trained",
                "PCA is unique"
              ],
              "a": 0,
              "explain": "Proved different random seeds produce non-identical feature dictionaries of equal quality."
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
            "whyWeRead": "Standard multi-family benchmark suite for evaluating sparse autoencoders.",
            "oneSentence": "SAEBench provides a standardized multi-family benchmark covering reconstruction, sparsity, probing, steering, and absorption.",
            "plainLanguage": "Welcome to Karvonen et al. (2025).\n\nSAEBench provides a unified benchmark suite evaluating SAEs across 5 core families:\n1. Reconstruction & Loss Recovery\n2. Sparsity & L0 Efficiency\n3. Feature Interpretability & Monosemanticity\n4. Sparse Probing (SCR)\n5. Steering & Causal Interventions",
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
                "simple": "Standardized evaluation benchmark suite for sparse autoencoders.",
                "def": "Standardized evaluation benchmark suite for sparse autoencoders."
              }
            ],
            "whatItShows": [
              "A standardized menu of evaluation families for fair SAE comparison"
            ],
            "whatItDoesNotShow": [
              "That winning one metric guarantees overall superiority"
            ],
            "setconcaUse": [
              "Adopt SAEBench evaluation protocols to benchmark SetConCA against standard SAEs."
            ],
            "masteryChecklist": [
              "I can name the 5 evaluation families in SAEBench."
            ],
            "commonConfusions": [
              {
                "wrong": "Evaluating on one SAEBench metric is enough.",
                "right": "Evaluations must report results across all 5 families."
              }
            ],
            "quiz": [
              {
                "q": "How many evaluation families does SAEBench cover?",
                "options": [
                  "5 core families (reconstruction, sparsity, probing, steering, interpretability)",
                  "1 metric only",
                  "100 metrics",
                  "0 metrics"
                ],
                "a": 0,
                "explain": "SAEBench covers 5 core evaluation families."
              }
            ],
            "originalIdea": "SAEBench provides a standardized multi-family benchmark covering reconstruction, sparsity, probing, steering, and absorption.",
            "simpleLesson": "Welcome to Karvonen et al. (2025).\n\nSAEBench provides a unified benchmark suite evaluating SAEs across 5 core families:\n1. Reconstruction & Loss Recovery\n2. Sparsity & L0 Efficiency\n3. Feature Interpretability & Monosemanticity\n4. Sparse Probing (SCR)\n5. Steering & Causal Interventions",
            "limitPairs": [
              {
                "original": "A standardized menu of evaluation families for fair SAE comparison",
                "simple": "In practice this means evidence supports: A standardized menu of evaluation families for fair SAE comparison"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That winning one metric guarantees overall superiority",
                "simple": "Do not overclaim: That winning one metric guarantees overall superiority"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Adopt SAEBench evaluation protocols to benchmark SetConCA against standard SAEs.",
                "simple": "Action item: Adopt SAEBench evaluation protocols to benchmark SetConCA against standard SAEs."
              }
            ]
          },
          "quiz": [
            {
              "q": "How many evaluation families does SAEBench cover?",
              "options": [
                "5 core families (reconstruction, sparsity, probing, steering, interpretability)",
                "1 metric only",
                "100 metrics",
                "0 metrics"
              ],
              "a": 0,
              "explain": "SAEBench covers 5 core evaluation families."
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
            "whyWeRead": "Audits SAEBench reliability, warning against noise and metric overfitting.",
            "oneSentence": "Are Sparse Autoencoder Benchmarks Reliable? audits metric stability and ground-truth correlation.",
            "plainLanguage": "Welcome to Chanin (2026). Read this AFTER SAEBench to calibrate your trust!\n\nChanin audited SAEBench metrics on synthetic ground-truth models, discovering that several popular metrics suffer from high seed noise and weak ground-truth correlation.\n\nPRACTICE: Always report multi-seed error bars and treat benchmark scores with calibrated scientific skepticism.",
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
                "term": "Metric Reliability",
                "original": "Technical term: «Metric Reliability» as used in this literature.",
                "simple": "Degree to which an evaluation score accurately tracks true underlying capability without seed noise.",
                "def": "Degree to which an evaluation score accurately tracks true underlying capability without seed noise."
              }
            ],
            "whatItShows": [
              "That some SAE benchmark metrics are noisy and require multi-seed validation"
            ],
            "whatItDoesNotShow": [
              "That benchmarking should be abandoned"
            ],
            "setconcaUse": [
              "Report multi-seed mean and standard deviation for all SetConCA evaluation scores."
            ],
            "masteryChecklist": [
              "I report multi-seed confidence intervals on all benchmark figures."
            ],
            "commonConfusions": [
              {
                "wrong": "Single-run benchmark scores are reliable.",
                "right": "Single-run scores suffer from random seed noise. Multi-seed reporting is required."
              }
            ],
            "quiz": [
              {
                "q": "What does Chanin (2026) mandate for reliable SAE benchmark reporting?",
                "options": [
                  "Multi-seed reporting with mean and error bars",
                  "Single-run reporting",
                  "Using only FVU",
                  "Ignoring benchmarks"
                ],
                "a": 0,
                "explain": "Mandates multi-seed reporting with error bars to account for seed noise."
              }
            ],
            "originalIdea": "Are Sparse Autoencoder Benchmarks Reliable? audits metric stability and ground-truth correlation.",
            "simpleLesson": "Welcome to Chanin (2026). Read this AFTER SAEBench to calibrate your trust!\n\nChanin audited SAEBench metrics on synthetic ground-truth models, discovering that several popular metrics suffer from high seed noise and weak ground-truth correlation.\n\nPRACTICE: Always report multi-seed error bars and treat benchmark scores with calibrated scientific skepticism.",
            "limitPairs": [
              {
                "original": "That some SAE benchmark metrics are noisy and require multi-seed validation",
                "simple": "In practice this means evidence supports: That some SAE benchmark metrics are noisy and require multi-seed validation"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That benchmarking should be abandoned",
                "simple": "Do not overclaim: That benchmarking should be abandoned"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Report multi-seed mean and standard deviation for all SetConCA evaluation scores.",
                "simple": "Action item: Report multi-seed mean and standard deviation for all SetConCA evaluation scores."
              }
            ]
          },
          "quiz": [
            {
              "q": "What does Chanin (2026) mandate for reliable SAE benchmark reporting?",
              "options": [
                "Multi-seed reporting with mean and error bars",
                "Single-run reporting",
                "Using only FVU",
                "Ignoring benchmarks"
              ],
              "a": 0,
              "explain": "Mandates multi-seed reporting with error bars to account for seed noise."
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
            "whyWeRead": "Optional: shows how correlated features break narrow SAEs, motivating dictionary expansion and multi-view supervision.",
            "oneSentence": "Feature Hedging: Correlated Features Break Narrow Sparse Autoencoders demonstrates degenerate feature merging under concept co-occurrence.",
            "plainLanguage": "Welcome to Chanin et al. (2025).\n\nWhen concepts frequently co-occur (high correlation), narrow SAE dictionaries hedge by merging concepts into degenerate combination features.\n\nSetConCA Connection: Multi-view set supervision provides the extra cross-context signal needed to disentangle correlated concepts.",
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
                "term": "Feature Hedging",
                "original": "Technical term: «Feature Hedging» as used in this literature.",
                "simple": "Degenerate feature merging caused by concept co-occurrence in narrow dictionaries.",
                "def": "Degenerate feature merging caused by concept co-occurrence in narrow dictionaries."
              }
            ],
            "whatItShows": [
              "That correlated features specifically break narrow SAE dictionaries"
            ],
            "whatItDoesNotShow": [
              "That sparsity alone fixes correlation hedging"
            ],
            "setconcaUse": [
              "Motivation for multi-view concept disambiguation in SetConCA."
            ],
            "masteryChecklist": [
              "I can explain how concept correlation causes feature hedging."
            ],
            "commonConfusions": [
              {
                "wrong": "High sparsity prevents feature hedging.",
                "right": "Correlated features cause hedging even at high sparsity unless dictionary width or multi-view supervision is added."
              }
            ],
            "quiz": [
              {
                "q": "What causes Feature Hedging in narrow SAEs?",
                "options": [
                  "High correlation / co-occurrence between concepts",
                  "Zero learning rate",
                  "PCA failure",
                  "Single token input"
                ],
                "a": 0,
                "explain": "High correlation / co-occurrence between concepts causes feature hedging."
              }
            ],
            "originalIdea": "Feature Hedging: Correlated Features Break Narrow Sparse Autoencoders demonstrates degenerate feature merging under concept co-occurrence.",
            "simpleLesson": "Welcome to Chanin et al. (2025).\n\nWhen concepts frequently co-occur (high correlation), narrow SAE dictionaries hedge by merging concepts into degenerate combination features.\n\nSetConCA Connection: Multi-view set supervision provides the extra cross-context signal needed to disentangle correlated concepts.",
            "limitPairs": [
              {
                "original": "That correlated features specifically break narrow SAE dictionaries",
                "simple": "In practice this means evidence supports: That correlated features specifically break narrow SAE dictionaries"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "That sparsity alone fixes correlation hedging",
                "simple": "Do not overclaim: That sparsity alone fixes correlation hedging"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Motivation for multi-view concept disambiguation in SetConCA.",
                "simple": "Action item: Motivation for multi-view concept disambiguation in SetConCA."
              }
            ]
          },
          "quiz": [
            {
              "q": "What causes Feature Hedging in narrow SAEs?",
              "options": [
                "High correlation / co-occurrence between concepts",
                "Zero learning rate",
                "PCA failure",
                "Single token input"
              ],
              "a": 0,
              "explain": "High correlation / co-occurrence between concepts causes feature hedging."
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
            "whyWeRead": "Optional: intrinsic activation geometry predicts layerwise SAE scaling limits.",
            "oneSentence": "The Geometric Wall: Manifold Structure Predicts Layerwise SAE Scaling Laws links activation intrinsic dimension to dictionary scaling bounds.",
            "plainLanguage": "Welcome to Zaher et al. (2026).\n\nNot all transformer layers are equally easy to unpack! Early layers have high intrinsic geometric dimension, while middle/late layers collapse into lower-dimensional manifolds.\n\nThe Geometric Wall shows that intrinsic layer geometry places hard bounds on SAE scaling laws.",
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
                "term": "Geometric Wall",
                "original": "Technical term: «Geometric Wall» as used in this literature.",
                "simple": "Geometry-imposed limit on layerwise SAE dictionary scaling.",
                "def": "Geometry-imposed limit on layerwise SAE dictionary scaling."
              }
            ],
            "whatItShows": [
              "That intrinsic activation geometry bounds layerwise SAE scaling laws"
            ],
            "whatItDoesNotShow": [
              "How to design multi-view set losses"
            ],
            "setconcaUse": [
              "Select layer sites for SetConCA views with intrinsic manifold geometry in mind."
            ],
            "masteryChecklist": [
              "I know layer choice is governed by intrinsic geometric dimension."
            ],
            "commonConfusions": [
              {
                "wrong": "All layers scale identically with SAE width.",
                "right": "Scaling limits vary by layer depending on intrinsic activation manifold geometry."
              }
            ],
            "quiz": [
              {
                "q": "What predicts layerwise SAE scaling limits in Zaher et al. (2026)?",
                "options": [
                  "Intrinsic activation manifold geometry",
                  "Token count only",
                  "GPU VRAM",
                  "PDF size"
                ],
                "a": 0,
                "explain": "Intrinsic activation manifold geometry predicts layerwise scaling limits."
              }
            ],
            "originalIdea": "The Geometric Wall: Manifold Structure Predicts Layerwise SAE Scaling Laws links activation intrinsic dimension to dictionary scaling bounds.",
            "simpleLesson": "Welcome to Zaher et al. (2026).\n\nNot all transformer layers are equally easy to unpack! Early layers have high intrinsic geometric dimension, while middle/late layers collapse into lower-dimensional manifolds.\n\nThe Geometric Wall shows that intrinsic layer geometry places hard bounds on SAE scaling laws.",
            "limitPairs": [
              {
                "original": "That intrinsic activation geometry bounds layerwise SAE scaling laws",
                "simple": "In practice this means evidence supports: That intrinsic activation geometry bounds layerwise SAE scaling laws"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "How to design multi-view set losses",
                "simple": "Do not overclaim: How to design multi-view set losses"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Select layer sites for SetConCA views with intrinsic manifold geometry in mind.",
                "simple": "Action item: Select layer sites for SetConCA views with intrinsic manifold geometry in mind."
              }
            ]
          },
          "quiz": [
            {
              "q": "What predicts layerwise SAE scaling limits in Zaher et al. (2026)?",
              "options": [
                "Intrinsic activation manifold geometry",
                "Token count only",
                "GPU VRAM",
                "PDF size"
              ],
              "a": 0,
              "explain": "Intrinsic activation manifold geometry predicts layerwise scaling limits."
            }
          ]
        }
      ],
      "primer": {
        "title": "SAE evaluation and failure modes",
        "mission": "Master SAE failure modes (Absorption, Splitting, Non-canonicality) and understand the SAEBench evaluation suite.",
        "beforeYouStart": "Levels 6–8 evaluation metrics and architectures.",
        "primer": "Welcome to Level 9. Having built modern SAEs, we now confront their deepest empirical failure modes.\n\nA common naive belief is: 'One SAE feature = One true atomic concept in the world.' Level 9 proves why this assumption is flawed.\n\n--- FAILURE MODE 1: Feature Splitting (Chanin et al., 2024) ---\nWhat is Feature Splitting?\nAs you increase dictionary width (e.g. from 4x to 32x expansion), a single broad concept (e.g. 'Medical text') SPLITS into dozens of hyper-specific sub-features ('Pediatric medicine', 'Medical insurance claims', 'Surgical procedures').\n\nThe Problem: Feature splitting means concepts exist at multiple granularities simultaneously, making it hard to define what an 'atomic' feature is.\n\n--- FAILURE MODE 2: Feature Absorption (Chanin et al., 2024) ---\nWhat is Feature Absorption?\nFeature Absorption is the inverse of splitting: a single dominant SAE feature 'swallows' or absorbs related specific sub-concepts!\nExample: Instead of having separate features for 'Golden Retriever' and 'Poodle', a single 'Dog' feature activates for both, absorbing the specific identity.\n\nWhy it happens: Narrow dictionaries or high sparsity penalties force the model to merge correlated concepts into single shared latents.\n\n--- FAILURE MODE 3: Non-Canonical Units (Leask et al., 2025) ---\nSuppose you train two SAEs (SAE A and SAE B) on the EXACT SAME model layer with identical hyperparameters, but using different random seeds.\n\nBoth SAE A and SAE B achieve identical low reconstruction error (FVU = 0.03) and identical sparsity (L0 = 25).\nDo SAE A and SAE B discover the same features?\n\nNO! Leask et al. proved that SAE A and SAE B discover DIFFERENT feature bases! There is no single 'canonical' sparse basis in activation space. Multiple distinct dictionary decompositions achieve equal quality.\n\n--- THE SAEBENCH SUITE (Karvonen et al., 2025) & METRIC RELIABILITY ---\nTo evaluate SAEs rigorously, Karvonen et al. introduced SAEBench, covering five evaluation families:\n1. Reconstruction & Fidelity: FVU, CE loss recovery.\n2. Sparsity & Efficiency: L0, L1, dead feature rate.\n3. Feature Interpretability: Automated explanations, monosemanticity scores.\n4. Downstream Probing: Sparse probing performance on target concepts.\n5. Steering & Interventions: Causal effect of feature clamping on output behavior.\n\nAuditing Reliability (Chanin, 2026):\nAlways report seed variance! Single-run leaderboard scores are unreliable due to random initialization noise.",
        "bigPictureDiagram": [
          "Ideal Assumption: 1 SAE Feature = 1 Atomic Ground-Truth Concept",
          "Reality Failure 1 (Splitting): Concept 'Dog' splits into 50 hyper-specific sub-features as width expands",
          "Reality Failure 2 (Absorption): Feature 'Animal' absorbs 'Dog', 'Cat', and 'Horse' into 1 latent",
          "Reality Failure 3 (Non-Canonical): Seed A and Seed B find completely different valid feature dictionaries",
          "SAEBench Solution: Evaluate across 5 families (Reconstruction, Sparsity, Interpretation, Probing, Steering)"
        ],
        "conceptsToMaster": [
          {
            "name": "Feature Splitting",
            "simple": "When a broad concept breaks into multiple narrower sub-features as dictionary size grows.",
            "deeper": "As dictionary width d_sae increases, coarse feature directions decompose into finer sub-directions. Illustrates that feature granularity is a function of dictionary capacity."
          },
          {
            "name": "Feature Absorption",
            "simple": "When one high-level feature swallows up specific sub-concepts because the dictionary is too small or too sparse.",
            "deeper": "Occurs when a parent feature vector v_parent absorbs child feature vectors v_child, firing whenever any child concept is present. Reduces feature specificity."
          },
          {
            "name": "Non-Canonical Units",
            "simple": "The discovery that different random seeds yield different interpretable dictionaries of equal quality, proving there is no single 'true' feature basis.",
            "deeper": "Proves non-uniqueness of sparse dictionary solutions. Multiple overcomplete frame representations span activation space with equivalent L0 and MSE, challenging naive realism in interpretability."
          },
          {
            "name": "SAEBench",
            "simple": "A standardized benchmark suite evaluating SAEs across reconstruction, sparsity, probing, steering, and interpretability.",
            "deeper": "Comprehensive evaluation framework combining loss recovery, L0 efficiency, SCR (sparse probing accuracy), feature absorption metrics, and intervention causal effects."
          }
        ],
        "checkpoint": {
          "goal": "Design a complete SAE evaluation protocol incorporating SAEBench families and document metric non-claims.",
          "steps": [
            "List evaluation metrics across 5 families.",
            "For each metric, write down explicitly what it proves and what it CANNOT establish.",
            "Incorporate seed-variance checks for non-canonicality testing."
          ],
          "successLooksLike": "You can produce an evaluation protocol that rejects any research claim based on FVU or single-seed results alone."
        },
        "bridgeToNext": "With all foundations built, Level 10 reaches the SetConCA Research Frontier — combining multi-view set coordination with sparse dictionaries."
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
            "whyWeRead": "Closest empirical ancestor to SetConCA: coordinates SAE codes across adjacent-token activation pairs.",
            "oneSentence": "Temporal Sparse Autoencoders adds contrastive temporal coordination between adjacent token activations to improve feature consistency.",
            "plainLanguage": "Welcome to Bhalla et al. (2025).\n\n--- THE TEMPORAL SAE BREAKTHROUGH ---\nStandard SAEs treat every token activation in complete isolation. But language has temporal structure: adjacent tokens (t and t+1) share semantic context!\n\nTemporal SAEs add a CONTRASTIVE LOSS between sparse codes of adjacent tokens:\nLoss = Reconstruction + λ_sparse * Sparsity + λ_temp * Contrastive_Loss(z_t, z_{t+1})\n\nResult: Coordinates feature activations over time, improving temporal consistency.\n\n--- THE SETCONCA GENERALIZATION ---\nTemporal SAEs coordinate adjacent tokens in time. SetConCA generalizes this idea from temporal pairs to MULTI-VIEW SETS of the exact same semantic object across different context prompts, paraphrases, and layers!",
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
                "simple": "SAE trained with contrastive coordination between adjacent token activations.",
                "def": "SAE trained with contrastive coordination between adjacent token activations."
              }
            ],
            "whatItShows": [
              "That coordinating sparse codes across related activation pairs improves feature consistency"
            ],
            "whatItDoesNotShow": [
              "How to coordinate unordered sets of multi-view activations"
            ],
            "setconcaUse": [
              "Direct template for SetConCA: replace adjacent temporal pairs with multi-view concept sets."
            ],
            "masteryChecklist": [
              "I can explain how SetConCA generalizes Temporal SAEs."
            ],
            "commonConfusions": [
              {
                "wrong": "Temporal SAEs work on unordered set inputs.",
                "right": "Temporal SAEs require sequential adjacent tokens. SetConCA uses set aggregators for unordered multi-view sets."
              }
            ],
            "quiz": [
              {
                "q": "How does SetConCA generalize Temporal SAEs?",
                "options": [
                  "Generalizes adjacent temporal pairs to multi-view semantic sets",
                  "Removes contrastive loss",
                  "Uses linear PCA",
                  "Deletes decoders"
                ],
                "a": 0,
                "explain": "Generalizes temporal adjacent pairs to multi-view semantic concept sets."
              }
            ],
            "originalIdea": "Temporal Sparse Autoencoders adds contrastive temporal coordination between adjacent token activations to improve feature consistency.",
            "simpleLesson": "Welcome to Bhalla et al. (2025).\n\n--- THE TEMPORAL SAE BREAKTHROUGH ---\nStandard SAEs treat every token activation in complete isolation. But language has temporal structure: adjacent tokens (t and t+1) share semantic context!\n\nTemporal SAEs add a CONTRASTIVE LOSS between sparse codes of adjacent tokens:\nLoss = Reconstruction + λ_sparse * Sparsity + λ_temp * Contrastive_Loss(z_t, z_{t+1})\n\nResult: Coordinates feature activations over time, improving temporal consistency.\n\n--- THE SETCONCA GENERALIZATION ---\nTemporal SAEs coordinate adjacent tokens in time. SetConCA generalizes this idea from temporal pairs to MULTI-VIEW SETS of the exact same semantic object across different context prompts, paraphrases, and layers!",
            "limitPairs": [
              {
                "original": "That coordinating sparse codes across related activation pairs improves feature consistency",
                "simple": "In practice this means evidence supports: That coordinating sparse codes across related activation pairs improves feature consistency"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "How to coordinate unordered sets of multi-view activations",
                "simple": "Do not overclaim: How to coordinate unordered sets of multi-view activations"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Direct template for SetConCA: replace adjacent temporal pairs with multi-view concept sets.",
                "simple": "Action item: Direct template for SetConCA: replace adjacent temporal pairs with multi-view concept sets."
              }
            ]
          },
          "quiz": [
            {
              "q": "How does SetConCA generalize Temporal SAEs?",
              "options": [
                "Generalizes adjacent temporal pairs to multi-view semantic sets",
                "Removes contrastive loss",
                "Uses linear PCA",
                "Deletes decoders"
              ],
              "a": 0,
              "explain": "Generalizes temporal adjacent pairs to multi-view semantic concept sets."
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
            "whyWeRead": "Concept Component Analysis (ConCA) is a direct generative unmixing rival/complement to dictionary learning.",
            "oneSentence": "Concept Component Analysis (ConCA) derives a generative linear unmixing model for concept components with identifiability proofs.",
            "plainLanguage": "Welcome to Liu et al. (2026).\n\n--- THE CONCA FRAMEWORK ---\nConCA approaches interpretability from an ICA/generative perspective:\nx = Σ c_i v_i + noise\n\nConCA computes representations under log-posterior assumptions, offering formal identifiability proofs showing when concept components can be recovered uniquely.",
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
                "simple": "Concept Component Analysis; generative unmixing model for concept discovery.",
                "def": "Concept Component Analysis; generative unmixing model for concept discovery."
              }
            ],
            "whatItShows": [
              "That concept components can be identified theoretically under generative unmixing assumptions"
            ],
            "whatItDoesNotShow": [
              "Standard overcomplete TopK SAE training"
            ],
            "setconcaUse": [
              "Direct theoretical competitor/complement to SetConCA sparse dictionary learning."
            ],
            "masteryChecklist": [
              "I can contrast ConCA generative unmixing with SAE dictionary learning."
            ],
            "commonConfusions": [
              {
                "wrong": "ConCA is just a standard L1 SAE.",
                "right": "ConCA is a generative unmixing model with posterior representation, closer to ICA than standard SAEs."
              }
            ],
            "quiz": [
              {
                "q": "What theoretical framework does ConCA use?",
                "options": [
                  "Generative linear unmixing with posterior representation",
                  "SimCLR augmentation",
                  "Deep Sets pooling",
                  "Gram matrix CKA"
                ],
                "a": 0,
                "explain": "ConCA uses a generative linear unmixing framework with log-posterior representation."
              }
            ],
            "originalIdea": "Concept Component Analysis (ConCA) derives a generative linear unmixing model for concept components with identifiability proofs.",
            "simpleLesson": "Welcome to Liu et al. (2026).\n\n--- THE CONCA FRAMEWORK ---\nConCA approaches interpretability from an ICA/generative perspective:\nx = Σ c_i v_i + noise\n\nConCA computes representations under log-posterior assumptions, offering formal identifiability proofs showing when concept components can be recovered uniquely.",
            "limitPairs": [
              {
                "original": "That concept components can be identified theoretically under generative unmixing assumptions",
                "simple": "In practice this means evidence supports: That concept components can be identified theoretically under generative unmixing assumptions"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "Standard overcomplete TopK SAE training",
                "simple": "Do not overclaim: Standard overcomplete TopK SAE training"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Direct theoretical competitor/complement to SetConCA sparse dictionary learning.",
                "simple": "Action item: Direct theoretical competitor/complement to SetConCA sparse dictionary learning."
              }
            ]
          },
          "quiz": [
            {
              "q": "What theoretical framework does ConCA use?",
              "options": [
                "Generative linear unmixing with posterior representation",
                "SimCLR augmentation",
                "Deep Sets pooling",
                "Gram matrix CKA"
              ],
              "a": 0,
              "explain": "ConCA uses a generative linear unmixing framework with log-posterior representation."
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
            "whyWeRead": "Provides mathematical proofs for multi-view latent factor identifiability under partial observability.",
            "oneSentence": "Multi-View Causal Representation Learning with Partial Observability proves when latent factors can be identified from multiple partial views.",
            "plainLanguage": "Welcome to Yao et al. (2023).\n\nYao et al. provide theoretical identifiability proofs showing that when a single view is partial/incomplete, observing MULTIPLE PARTIAL VIEWS permits exact identification of underlying latent causal factors!\n\nSETCONCA THEORETICAL FOUNDATION:\nThis paper provides the mathematical proof that multi-view set supervision fundamentally resolves single-view identifiability bottlenecks!",
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
                "term": "Partial Observability",
                "original": "Technical term: «Partial Observability» as used in this literature.",
                "simple": "When a single view observes only a subset of latent causal variables.",
                "def": "When a single view observes only a subset of latent causal variables."
              }
            ],
            "whatItShows": [
              "Mathematical proof that multi-view observations enable latent factor identifiability"
            ],
            "whatItDoesNotShow": [
              "Practical SAE PyTorch implementation code"
            ],
            "setconcaUse": [
              "Cite as the theoretical foundation for why multi-view set supervision enables concept recovery in SetConCA."
            ],
            "masteryChecklist": [
              "I can explain why single views are partially observable and how multi-view resolves it."
            ],
            "commonConfusions": [
              {
                "wrong": "Single views provide full latent identifiability.",
                "right": "Single views suffer from partial observability. Multi-view observations are required for identifiability."
              }
            ],
            "quiz": [
              {
                "q": "What does Yao et al. (2023) prove regarding multi-view observations?",
                "options": [
                  "Multiple partial views permit exact latent causal factor identification",
                  "Multi-view causes collapse",
                  "Single views are sufficient",
                  "PCA is non-linear"
                ],
                "a": 0,
                "explain": "Proves multiple partial views permit exact latent causal factor identification."
              }
            ],
            "originalIdea": "Multi-View Causal Representation Learning with Partial Observability proves when latent factors can be identified from multiple partial views.",
            "simpleLesson": "Welcome to Yao et al. (2023).\n\nYao et al. provide theoretical identifiability proofs showing that when a single view is partial/incomplete, observing MULTIPLE PARTIAL VIEWS permits exact identification of underlying latent causal factors!\n\nSETCONCA THEORETICAL FOUNDATION:\nThis paper provides the mathematical proof that multi-view set supervision fundamentally resolves single-view identifiability bottlenecks!",
            "limitPairs": [
              {
                "original": "Mathematical proof that multi-view observations enable latent factor identifiability",
                "simple": "In practice this means evidence supports: Mathematical proof that multi-view observations enable latent factor identifiability"
              }
            ],
            "nonClaimPairs": [
              {
                "original": "Practical SAE PyTorch implementation code",
                "simple": "Do not overclaim: Practical SAE PyTorch implementation code"
              }
            ],
            "setconcaPairs": [
              {
                "original": "Cite as the theoretical foundation for why multi-view set supervision enables concept recovery in SetConCA.",
                "simple": "Action item: Cite as the theoretical foundation for why multi-view set supervision enables concept recovery in SetConCA."
              }
            ]
          },
          "quiz": [
            {
              "q": "What does Yao et al. (2023) prove regarding multi-view observations?",
              "options": [
                "Multiple partial views permit exact latent causal factor identification",
                "Multi-view causes collapse",
                "Single views are sufficient",
                "PCA is non-linear"
              ],
              "a": 0,
              "explain": "Proves multiple partial views permit exact latent causal factor identification."
            }
          ]
        }
      ],
      "primer": {
        "title": "Papers closest to SetConCA research",
        "mission": "Master Temporal SAEs, Concept Component Analysis (ConCA), and Multi-View Causal Identifiability. Formulate actionable research hypotheses for SetConCA.",
        "beforeYouStart": "All previous Levels (1–9).",
        "primer": "Welcome to Level 10 — the capstone level of your mastery path. Here we study the three papers closest to SetConCA and state our core research hypotheses.\n\n--- STEP 1: Temporal Sparse Autoencoders (Bhalla et al., 2025) ---\nWhat did Temporal SAEs do?\nStandard SAEs treat every token activation in isolation. But language has natural sequential structure: adjacent tokens (token t and token t+1) often share semantic context!\n\nTemporal SAEs add a CONTRASTIVE REGULARIZATION loss between the sparse codes of adjacent tokens:\nLoss = Reconstruction + λ_sparse * Sparsity + λ_temp * Contrastive_Loss(z_t, z_{t+1})\n\nResult: Coordinates feature activations over time, improving feature consistency.\n\nTHE SETCONCA GENERALIZATION:\nTemporal SAEs coordinate adjacent tokens in time. SetConCA generalizes this idea from temporal pairs to MULTI-VIEW SETS of the exact same semantic object across different contexts, prompts, or layers!\n\n--- STEP 2: Concept Component Analysis / ConCA (Liu et al., 2026) ---\nConCA proposes a generative linear unmixing model for concepts (closer in spirit to Level 1 ICA than standard autoencoders):\nx = Σ c_i v_i + noise\n\nConCA derives identifiability conditions under log-posterior representation assumptions, offering a principled theoretical rival/complement to dictionary learning.\n\n--- STEP 3: Multi-View Causal Representation Learning (Yao et al., 2023) ---\nYao et al. provide mathematical identifiability proofs showing WHEN multi-view observations permit exact latent factor recovery under partial observability.\n\nTHE CENTRAL RESEARCH QUESTION OF SETCONCA:\nUnder what mathematical assumptions does multi-view set supervision cause a sparse dictionary to recover more stable, complete, specific, or causally useful concepts than a pointwise SAE?\n\nYOUR THREE SETCONCA HYPOTHESES TO TEST:\n1. Multi-View Set Coordination reduces Feature Absorption by disambiguating co-occurring concepts across views.\n2. Contrastive Set Losses increase cross-seed Feature Canonicality (dictionary stitching agreement).\n3. Set-aggregated concept codes achieve higher Probe Selectivity and Steering Causality than single-token SAE latents.",
        "bigPictureDiagram": [
          "Temporal SAE (Bhalla '25): Coordinates adjacent tokens in time z_t ↔ z_{t+1}",
          "SetConCA (Your Project): Coordinates MULTI-VIEW SETS of same concept {x_v1, x_v2, x_v3} ──[Set Aggregator]──→ Sparse Code z",
          "ConCA (Liu '26): Generative linear unmixing with identifiability proofs (ICA-lineage)",
          "MV-Causal (Yao '23): Formal proofs of latent recovery from partial multi-view observations"
        ],
        "conceptsToMaster": [
          {
            "name": "Multi-View Set Coordination",
            "simple": "Using multiple views of the same concept as a positive set to train sparse autoencoder feature dictionaries.",
            "deeper": "Extending single-view SAE objectives by adding set-based contrastive loss L_set(Z_views) = InfoNCE(Set_Pool(Z_pos), Set_Pool(Z_neg)). Enforces representational consistency across semantic view transformations."
          },
          {
            "name": "Identifiability under Partial Observability",
            "simple": "Mathematical proof showing when latent concept variables can be uniquely recovered if you observe multiple partial views.",
            "deeper": "Proves that under non-Gaussianity and multi-view conditional independence assumptions, the latent factor vector z is identifiable up to component-wise invertible transformations."
          },
          {
            "name": "SetConCA Core Thesis",
            "simple": "Combining sparse dictionaries + multi-view alignment + set aggregators + contrastive coordination yields cleaner concepts than pointwise SAEs.",
            "deeper": "Hypothesizes that multi-view set supervision resolves non-canonicality and feature absorption by enforcing latent invariance across view transforms while maintaining overcomplete dictionary sparsity."
          }
        ],
        "checkpoint": {
          "goal": "Write three formal research hypotheses for SetConCA naming Level 6 metrics and Level 9 failure modes.",
          "steps": [
            "Hypothesis 1: Target a specific failure mode (Absorption or Splitting).",
            "Hypothesis 2: Target dictionary stability across seeds (Canonicality / CKA).",
            "Hypothesis 3: Target causal intervention performance (Steering / Probing Selectivity)."
          ],
          "successLooksLike": "You can state three precise, falsifiable experimental hypotheses ready for implementation and testing."
        },
        "bridgeToNext": "Congratulations! You have completed the entire SetConCA Mastery Curriculum. You are ready to build, execute, and publish SetConCA research."
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
