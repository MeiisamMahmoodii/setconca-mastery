"""Dual original/simple key ideas for all curriculum papers not covered in dual_enrich.OVERRIDES."""
from .dual_enrich import _dual_idea as D

MORE = {
    "ksparse": [
        D("Encoder–decoder factorisation", "An autoencoder factorises reconstruction as x̂ = g(f(x)) with encoder f and decoder g trained to minimise reconstruction loss.", "A compressor writes a code; a decompressor rebuilds the input. Training makes rebuilds accurate."),
        D("Overcomplete hidden layer", "Hidden dimension larger than input dimension yields an overcomplete dictionary capable of sparse coding.", "More code slots than input numbers — only useful if most slots stay off (sparse)."),
        D("Hard TopK", "TopK retains the k largest activations and zeroes the rest, enforcing exact cardinality sparsity.", "Keep the k loudest switches; silence the rest. No soft maybe."),
        D("L1 vs exact k-sparsity", "L1 penalties encourage sparsity but also shrink magnitudes of active units; TopK enforces exact k without that shrinkage on survivors.", "L1 nudges toward zero and weakens survivors. TopK just picks winners and leaves their strength alone."),
        D("Dense inputs, sparse codes", "Sparse latent codes can reconstruct dense inputs because many dictionary atoms combine linearly in the decoder.", "The input can be messy and dense; the secret is that only a few dictionary pieces turn on to rebuild it."),
    ],
    "vae": [
        D("Latent variable model", "Data are modelled as generated from latent z via a decoder likelihood p(x|z).", "Imagine a hidden knob z; the model generates x by decoding that knob."),
        D("Approximate posterior", "Because p(z|x) is intractable, an encoder parameterises q_φ(z|x) (often diagonal Gaussian).", "We cannot compute the true posterior, so we learn a handy approximation — usually a mean and variance."),
        D("Reparameterisation", "Sampling z=μ+σ⊙ε with ε~N(0,I) moves randomness outside the parameters so gradients flow to μ,σ.", "Don’t sample in a way that blocks learning. Add noise outside, then scale/shift with predicted μ and σ."),
        D("ELBO tradeoff", "Maximise E_q[log p(x|z)] − KL(q(z|x)||p(z)): reconstruct well while staying close to the prior.", "Two pressures: rebuild x, and don’t let latents wander into crazy regions far from the prior."),
        D("Prior / posterior / likelihood", "Prior p(z), approximate posterior q(z|x), and likelihood p(x|z) are the three distributions in the generative story.", "Prior = default belief about z. Posterior = belief after seeing x. Likelihood = how x is made from z."),
    ],
    "dcca": [
        D("Nonlinear view encoders", "DCCA replaces linear CCA maps with neural networks f_θ, g_φ on each view.", "Each view gets its own neural translator before we ask how correlated they are."),
        D("Correlation-maximising objective", "Networks are trained so embeddings maximise a CCA-style total correlation objective under covariance constraints.", "Push the translated views to move together as much as possible."),
        D("Covariance constraints", "Latent covariances are constrained/whitened to avoid collapsed or duplicated correlated dimensions.", "Without rules, the net can cheat by making duplicate dimensions. Whitening blocks that cheat."),
        D("Information discard risk", "Maximising shared correlation can discard view-specific information that is useful but not shared.", "Chasing only the overlap can throw away private treasure that still matters."),
    ],
    "dccae": [
        D("Correlation–reconstruction tradeoff", "DCCAE combines cross-view correlation with within-view autoencoding losses.", "Align the shared signal AND rebuild each view so you don’t delete useful private detail."),
        D("Shared representation", "The correlated latent is intended to capture shared factors across views.", "The shared code is the handshake between views."),
        D("Information preservation", "Reconstruction terms protect within-view information from being optimised away.", "If you must rebuild the view, you cannot throw everything away for correlation."),
        D("Objective choice matters", "Different multi-view losses induce different invariances and failure modes.", "Your loss is a contract: it says what to keep and what to ignore."),
    ],
    "vcca": [
        D("Shared latent", "A shared latent z explains generative factors common to both views.", "One hidden story both views are reading from."),
        D("Private latents", "Private latents z_x, z_y capture view-specific residual structure.", "Each view may also have its own private subplot."),
        D("Variational training", "Deep VCCA is trained with variational bounds (ELBO-style) using neural parameterisations.", "Same VAE training idea, but for multi-view generation."),
        D("Missing views", "A generative multi-view model can in principle condition or impute when a view is absent.", "If one camera fails, a generative shared model still has a story to fall back on."),
    ],
    "dgcca": [
        D("Many-view generalisation", "DGCCA extends canonical correlation thinking beyond two views to an arbitrary number of views.", "Not just twins — a whole committee of views."),
        D("Common representation", "Learn a common representation that relates to every view’s nonlinear embedding.", "Find one shared board that every view can point to."),
        D("Deep encoders per view", "Each view has its own deep encoder into a joint GCCA-style analysis.", "Every view brings its own neural translator to the joint meeting."),
    ],
    "deepsets": [
        D("Permutation invariance", "A set function satisfies f(π(X))=f(X) for every permutation π.", "Shuffling the bag must not change the answer."),
        D("Sum-decomposition", "Under mild conditions, invariant set functions can be written f(X)=ρ(∑_x φ(x)).", "Encode each item, add the encodings, then transform the sum — that is enough in theory."),
        D("What pooling preserves", "Sum/mean pooling preserves aggregate statistics but can lose relational/pairwise structure.", "Averages remember totals; they can forget who interacted with whom."),
        D("Equivariance", "Equivariant maps permute outputs when inputs are permuted — useful for per-member predictions.", "If you shuffle inputs, outputs shuffle the same way."),
    ],
    "neural-stat": [
        D("Set as object", "The modelling target is a latent for an entire set/dataset, not a single example.", "The whole bag is one object with one code."),
        D("Statistic network", "A network maps variable-sized sets into latent statistics describing shared generative structure.", "Read a summary of the bag into a fixed-size latent."),
        D("Distributional view", "The set latent aims to capture the distribution members are drawn from.", "Not ‘this one point’ — ‘what kind of cloud these points come from.’"),
    ],
    "set-transformer": [
        D("Self-attention over members", "Set Transformer lets set elements attend to each other before aggregation.", "Items talk to each other before the summary is written."),
        D("Attention pooling", "Pooling can be implemented via attention weights rather than uniform mean/sum.", "Important members get louder votes in the final summary."),
        D("Inducing points", "Learned inducing points reduce quadratic attention cost by attending through a smaller bottleneck set.", "A small set of meeting hubs keeps attention cheaper."),
        D("Expressivity vs cost", "Higher relational expressivity increases compute and sample needs.", "More power costs more time and can overfit small view sets."),
    ],
    "multi-set-transformer": [
        D("Multiple sets as input", "The architecture consumes several sets, not one bag.", "Several bags enter together."),
        D("Cross-set attention", "Attention can model relations within and between sets.", "Items may look inside their bag and across bags."),
    ],
    "cpc": [
        D("Positive / negative pairs", "Contrastive learning defines a discrimination task via positives (related) and negatives (unrelated).", "Teach sameness and difference by examples of each."),
        D("InfoNCE", "InfoNCE is a softmax cross-entropy identifying the positive key among negatives using similarity scores.", "Pick the true partner out of a lineup of impostors."),
        D("Density-ratio view", "Optimal scores relate to density ratios between positive and candidate distributions.", "The score learns ‘how much more likely is this the real partner?’"),
        D("Negative distribution matters", "Hard or false negatives change the semantics of the learned representation.", "Bad impostors teach the wrong lesson about what ‘different’ means."),
    ],
    "simclr": [
        D("Augmentation defines positives", "Two augmented views of one image form a positive pair — the augmentation policy is the task definition.", "Whatever transform you call ‘same thing’ becomes the meaning of similarity."),
        D("Projection head", "A MLP projection head maps representations into the space where InfoNCE is applied; often discarded downstream.", "A temporary adapter for the loss — you may keep the layer before it for later use."),
        D("Batch negatives", "Other in-batch examples act as negatives for the contrastive loss.", "Everyone else in the minibatch is treated as ‘not my twin.’"),
        D("Normalisation & temperature", "ℓ2 normalisation and temperature τ reshape the similarity geometry and gradient focus.", "Normalise directions; τ controls how sharp the ‘pick the twin’ exam is."),
    ],
    "supcon": [
        D("Multiple positives", "All samples sharing a class label are treated as positives for an anchor.", "Every classmate is a friend to pull closer."),
        D("Positive averaging", "The loss aggregates attraction over many positives rather than a single pair.", "Don’t cling to only one friend — pull toward the whole group."),
        D("Within-class compactness", "Optimisation tightens clusters of the same class.", "Same-label points form tighter blobs."),
        D("Between-class separation", "Different classes are pushed apart in embedding space.", "Different labels stay farther away."),
    ],
    "align-unif": [
        D("Alignment", "Alignment measures closeness of embeddings of positive pairs.", "Twins should sit near each other."),
        D("Uniformity", "Uniformity encourages features to spread on the hypersphere, preventing dimensional collapse.", "Don’t pile everyone into one corner of the sphere."),
        D("Hypersphere geometry", "Normalised embeddings live on a sphere; contrastive geometry is naturally spherical.", "Think directions on a ball, not unbounded vectors."),
        D("Diagnostic metrics", "Track alignment and uniformity to interpret training beyond scalar loss.", "Loss can hide failure modes; these two meters expose them."),
    ],
    "vicreg": [
        D("Invariance", "Related views should match in representation space.", "Two views of the same thing should agree."),
        D("Variance hinge", "A hinge on per-dimension variance prevents collapse to a constant embedding.", "Keep each coordinate alive — don’t let it flatline."),
        D("Covariance off-diagonal penalty", "Penalising off-diagonal covariance reduces redundant dimensions.", "Stop many axes from saying the same thing."),
        D("Negatives optional", "VICReg can train without large explicit negative sets.", "You can fight collapse with statistics instead of a huge impostor lineup."),
    ],
    "cl-inverts": [
        D("Identifiability lens on contrastive learning", "Under stated assumptions, InfoNCE-like objectives can recover latent factors of the data-generating process.", "Sometimes contrastive learning doesn’t just help retrieval — it can recover the hidden knobs that made the data."),
        D("Assumptions matter", "Without the paper’s assumptions, latent inversion is not guaranteed.", "Useful embeddings ≠ proven recovery of true factors."),
    ],
    "svcca": [
        D("Subspace comparison", "Compare representational subspaces rather than neuron-aligned coordinates.", "Don’t match wire #17 to wire #17 — compare the spaces they span."),
        D("SVD then CCA", "SVCCA reduces each representation with SVD then applies CCA to measure shared directions.", "Compress noise first, then ask how correlated the remaining spaces are."),
        D("Affine invariance motivation", "Similarity should survive invertible linear rebasings of features.", "If someone rotates the feature axes, the meaning comparison should stay stable."),
    ],
    "cka": [
        D("Gram matrix view", "CKA compares example–example similarity structures (Gram matrices) induced by two representations.", "Do the two models agree on which examples are neighbours?"),
        D("Orthogonal invariance", "CKA is invariant to orthogonal transforms of features.", "Rotating features inside a model doesn’t fake a difference."),
        D("Linear vs kernel CKA", "Linear CKA is standard; kernel CKA can capture richer similarity structure.", "Start linear; use kernels if you need more sensitive geometry."),
        D("Coordinate matching is misleading", "Neuron-index alignment is generally the wrong comparison when bases differ.", "Same information can live in different coordinate systems."),
    ],
    "probe-control": [
        D("Probe pitfalls", "High probe accuracy can reflect probe power/memorisation rather than organised linguistic structure.", "A smart decoder can look successful even when the representation is messy."),
        D("Control tasks", "Control tasks assign random targets with complexity matched to the real task.", "Give the probe a fake exam of similar hardness to see if it cheats."),
        D("Selectivity", "Selectivity compares real-task vs control-task probe performance.", "Big gap ⇒ representation likely carries the property; tiny gap ⇒ probe did the work."),
    ],
    "mdl-probe": [
        D("Existence vs accessibility", "Information may be present yet inefficiently organised for learning.", "Being able to eventually decode ≠ being neatly organised."),
        D("MDL principle", "Prefer labelling rules with short description length given the representation.", "If a short program can map representation→label, the info is accessible."),
        D("Complement to accuracy", "Report accuracy and description-length style metrics together.", "Same score, different effort — both matter."),
    ],
    "transformer-circuits": [
        D("Residual stream", "Activations travel through a residual pathway that layers read from and write to.", "A shared bus: each block reads the bus and adds an update."),
        D("QK circuit", "Query–key interactions determine attention patterns (where to look).", "QK decides ‘who should I listen to?’"),
        D("OV circuit", "Output–value maps decide what information is written into the stream.", "OV decides ‘what message do I write after listening?’"),
        D("Paths / circuits", "Behaviours are analysed as compositional paths through components.", "Follow the wires that implement a behaviour, not only input–output correlations."),
        D("Mechanistic vs correlational", "Mechanistic analysis seeks causal routes; correlations alone are insufficient.", "Seeing a correlation is not the same as finding the mechanism."),
    ],
    "monosemanticity": [
        D("Features vs neurons", "Interpretable directions (features) can be cleaner units than neuron basis elements under superposition.", "Don’t trust the factory wiring labels — find better directions."),
        D("Dictionary learning on activations", "Sparse autoencoders learn an overcomplete dictionary for residual-stream activations.", "Build a big menu of sparse feature detectors for activation vectors."),
        D("Interpretability evidence", "Evidence includes activation examples, automated descriptions, and interventions.", "Show when it fires, describe it, and poke it to see effects."),
        D("Splitting / leftover polysemanticity", "Even strong dictionaries show feature splitting and residual polysemanticity.", "Not perfect atoms — concepts can fragment or remain mixed."),
    ],
    "cunningham-sae": [
        D("SAE objective", "Train encoders/decoders to reconstruct activations under a sparsity penalty on codes.", "Rebuild activations, but keep codes mostly off."),
        D("Feature interpretation", "Interpret features by contexts where they activate and qualitative/automated descriptions.", "Look at the situations that light a feature up."),
        D("Interventions", "Edit feature activations to test causal influence on outputs/behaviour.", "Turn a feature up/down and watch what changes."),
        D("Baselines", "Compare against neurons and alternative decompositions.", "Beat naive units and other splits — don’t only show pretty examples."),
    ],
    "scaling-mono": [
        D("Scale features & models", "Large SAE dictionaries on frontier LMs extract many interpretable features.", "Bigger models + bigger dictionaries → huge feature zoos."),
        D("Rich feature zoo", "Scaled SAEs surface detailed, sometimes safety-relevant features.", "You will find striking features; that is not the same as finishing interpretability."),
        D("Limits remain", "Scale does not imply completeness, uniqueness, or canonicality of the decomposition.", "More features ≠ the one true dictionary of concepts."),
    ],
    "topk-sae": [
        D("TopK activation", "Exactly k latent activations remain nonzero per token/site.", "Hard budget: only k features may fire."),
        D("Expansion / width", "Dictionary width / expansion factor controls capacity for sparse features.", "Wider menus can separate concepts — at compute cost."),
        D("Reconstruction–sparsity frontier", "Methods should be compared on Pareto curves of fidelity vs sparsity.", "Don’t brag at mismatched operating points."),
        D("Matched comparisons", "Fair bake-offs hold L0 or FVU roughly fixed across architectures.", "Compare apples to apples on the same sparsity/fidelity budget."),
    ],
    "gated-sae": [
        D("Shrinkage problem", "L1 sparsity shrinks magnitudes of active features, harming reconstruction.", "The same penalty that turns features off also weakens survivors."),
        D("Gate vs magnitude", "Gated SAEs separate ‘is it on?’ from ‘how strong?’", "One switch for on/off, another pathway for strength."),
        D("Pareto improvement", "Separating gate/magnitude improves the sparsity–fidelity tradeoff vs plain L1.", "Same sparsity, better rebuilds — or same rebuilds, fewer actives."),
    ],
    "jumprelu": [
        D("Learned threshold", "JumpReLU uses a thresholded activation so small pre-activations contribute nothing.", "Below the curb: off. Above: on. The curb can be learned."),
        D("L0-style goal", "Training more directly targets counting actives rather than soft L1 shrinkage.", "Aim at ‘how many are on’ more honestly."),
        D("Fidelity gains", "Thresholded activations can improve reconstruction at a given sparsity level.", "Better rebuilds without giving up sparsity."),
    ],
    "batchtopk": [
        D("Batch-level cardinality", "Sparsity is constrained across a batch rather than forcing identical k on every token.", "Share a total ‘feature budget’ across many tokens."),
        D("Heterogeneous difficulty", "Hard activations can consume more features; easy ones fewer.", "Complicated tokens get more tools; simple ones don’t waste them."),
        D("Still TopK family", "Selection remains hard TopK-style rather than L1 shrinkage.", "Still hard winners — just reallocated across the batch."),
    ],
    "matryoshka": [
        D("Nested dictionaries", "Prefixes of the feature list remain useful at multiple widths/sparsity levels.", "Like nested dolls: smaller prefixes should still work."),
        D("Multi-granularity", "Encourages coarse and fine features to coexist productively.", "Both big themes and small details can live in one dictionary."),
        D("Dictionary-size tension", "Small dictionaries merge concepts; large ones split — nesting softens the dilemma.", "One size rarely fits all granularities; nesting hedges the bet."),
    ],
    "principled-eval": [
        D("Proxy insufficiency", "Reconstruction and sparsity proxies do not entail interpretability or control.", "Nice FVU/L0 is hygiene, not the scientific finish line."),
        D("Control & task relevance", "Evaluate whether features support task-relevant approximation and interventions.", "Can you use the features to do the job you claim?"),
        D("Principled eval design", "Metrics must match claims; otherwise optimisation will game the proxy.", "State the claim, then pick tests that could falsify it."),
    ],
    "absorption": [
        D("Feature splitting", "A single concept is distributed across multiple SAE latents.", "One idea, many fragments."),
        D("Feature absorption", "One latent absorbs several related concepts (often correlated/hierarchical).", "One feature eats a whole family of related ideas."),
        D("Measurement methods", "Track how known concepts map onto learned latents to quantify these failures.", "You need maps from concepts→features, not vibes."),
    ],
    "non-canonical": [
        D("Non-uniqueness", "Different SAEs can achieve similar quality with different decompositions.", "Many ‘good’ dictionaries can disagree."),
        D("Stitching", "Relate features across dictionaries via stitching/alignment analyses.", "Translate between two SAE ‘languages.’"),
        D("Units of analysis", "Treating SAE latents as unique natural atoms is often unjustified.", "Atomic units may be a convenience, not nature’s labels."),
    ],
    "saebench": [
        D("Multiple families", "SAEBench aggregates detection, probing, steering, reconstruction, and related suites.", "One leaderboard score is not enough — use a battery of tests."),
        D("Sparse probing / detection", "Tests whether known concepts are sparsely decodable/detectable.", "Can we find a concept with few features?"),
        D("Steering", "Tests whether feature edits control behaviour.", "Push a feature and see if behaviour follows."),
        D("Proxy vs downstream", "Proxy wins do not always predict downstream usefulness.", "A pretty proxy can fail the real job."),
    ],
    "bench-reliable": [
        D("Reseed noise", "Some metrics vary substantially across random seeds.", "Run again — did the ranking survive?"),
        D("Ground-truth correlation", "Synthetic audits check whether scores track known truth.", "If a metric can’t follow ground truth in toys, distrust it in the wild."),
        D("Calibrated trust", "Treat benchmark scores as instruments with error bars, not oracles.", "Instruments can be noisy; report uncertainty."),
    ],
    "feature-hedging": [
        D("Correlation stress test", "Correlated co-occurring features create degenerate SAE solutions.", "When concepts always appear together, dictionaries get confused."),
        D("Narrow dictionaries fail first", "Insufficient width worsens hedging/merging under correlation.", "A tiny menu cannot separate clingy concepts."),
    ],
    "geometric-wall": [
        D("Layerwise difficulty", "Activation manifold geometry varies by layer and changes SAE difficulty.", "Some layers are geometrically harder for dictionaries."),
        D("Scaling limits", "Intrinsic geometry predicts limits on productive dictionary scaling.", "You can hit a wall where adding width helps less than you hope."),
    ],
    "temporal-sae": [
        D("Related pairs from sequence", "Adjacent-token activations provide natural positive pairs for coordination.", "Nearby words give free ‘same context’ pairs."),
        D("Contrastive regularisation on codes", "Sparse codes are pulled together for related tokens while preserving SAE structure.", "Make related SAE codes agree — without destroying sparsity."),
        D("Sparsity interaction", "Alignment terms can fight sparsity/fidelity unless carefully weighted.", "Too much ‘agree with neighbour’ can ruin the dictionary."),
        D("Baseline isolation", "Ablate to show gains are not just local similarity hacks.", "Prove it is semantic consistency, not ‘nearby vectors are close.’"),
    ],
    "conca": [
        D("Generative mixture story", "Activations are treated as mixtures of latent concept components under an explicit generative model.", "Assume concepts mix into activations like ingredients into a recipe."),
        D("Unmixing / components", "Recover concept components via an unmixing/inference procedure rather than only sparse reconstruction.", "Separate the ingredients — don’t only rebuild the soup."),
        D("Identifiability", "Component recovery claims require assumptions that make solutions unique (up to allowed transforms).", "Without assumptions, many ingredient lists can taste the same."),
        D("Vs SAE dictionaries", "ConCA’s unmixing story differs from SAE reconstruction+sparsity dictionaries.", "Different contract: unmix concepts vs sparsely rebuild activations."),
    ],
    "mv-causal": [
        D("Partial observability", "Each view may observe only a subset of latent factors.", "Every camera sees only part of the truth."),
        D("Multi-view identification", "Multiple partial views can identify latents that a single view cannot.", "Together, incomplete views can pin down the hidden state."),
        D("Assumption-driven claims", "Identifiability results are conditional on explicit assumptions about views and mixing.", "No assumption-free free lunch for ‘we recovered the latents.’"),
        D("Causal representation learning", "Targets latents with meaning under interventions, not only predictive embeddings.", "Want knobs that cause changes — not only knobs that correlate."),
    ],
}
