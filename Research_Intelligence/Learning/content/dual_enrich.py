"""
Ensure every teaching atom has both:
  original — how the paper / field states it
  simple   — beginner explanation / analogy

Applied at build time onto ALL_PAPERS.
"""


def _dual_idea(title, original, simple):
    return {"title": title, "original": original, "simple": simple, "explain": original}


# Hand-tuned dual ideas for core papers; others auto-dualized from explain text.
OVERRIDES = {
    "pca-shlens": [
        _dual_idea(
            "Variance and covariance",
            "Variance is E[(x−μ)²]; covariance is E[(x−μ)(y−ν)]. The covariance matrix C summarises all pairwise second-order relationships among centred coordinates.",
            "Variance = how spread out one number is. Covariance = whether two numbers tend to rise and fall together. PCA reads this spreadsheet of co-movements.",
        ),
        _dual_idea(
            "Principal components",
            "Principal components are orthonormal directions that successively maximise captured variance (eigenvectors of C ordered by eigenvalue).",
            "Imagine rotating a cloud of points so the longest stretch of the cloud becomes axis 1, the next-longest stretch (at 90°) becomes axis 2, and so on.",
        ),
        _dual_idea(
            "Eigenvectors / SVD",
            "PCA is solved via the eigen-decomposition of C, or equivalently via the SVD X=UΣVᵀ of the centred data matrix (V holds principal directions).",
            "SVD is a reliable calculator that finds those special stretch-directions without forming C explicitly. Prefer SVD in practice.",
        ),
        _dual_idea(
            "Low-rank approximation",
            "Keeping the top-k components yields the optimal rank-k least-squares approximation of the data (Eckart–Young theorem).",
            "Throw away the small axes and rebuild the points from the big ones. That is the best possible flat approximation with only k directions.",
        ),
        _dual_idea(
            "Explained variance & FVU",
            "Explained variance fraction = (sum of kept eigenvalues)/(sum of all). FVU = 1 − that fraction — residual variance after reconstruction.",
            "FVU asks: what fraction of the cloud’s spread did we fail to capture? Lower FVU = tighter reconstruction, not ‘more meaningful’ axes.",
        ),
        _dual_idea(
            "Orthogonal ≠ meaningful",
            "Orthogonality is a constraint of the PCA objective, not a semantic claim about concepts or causal factors.",
            "Right angles between axes are a math convenience. They do not mean each axis is a clean human concept.",
        ),
    ],
    "ica-shlens": [
        _dual_idea(
            "Mixing model",
            "Observations follow x = A s with statistically independent sources s and unknown mixing matrix A; ICA estimates an unmixing W such that Wx recovers s up to scale and permutation.",
            "Several independent voices are blended by an unknown mixer. ICA tries to turn the recording back into separate voices.",
        ),
        _dual_idea(
            "Independence > uncorrelatedness",
            "Uncorrelated means Cov(s_i,s_j)=0. Independence means the joint density factors: p(s)=∏p(s_i). Uncorrelatedness is necessary but not sufficient.",
            "‘They don’t linearly move together’ is weaker than ‘knowing one tells you nothing about the other.’ ICA needs the stronger idea.",
        ),
        _dual_idea(
            "Why whitening helps",
            "Whitening removes second-order correlations (sphere the covariance) so remaining ICA contrasts can target higher-order dependence / non-Gaussianity.",
            "First flatten and un-correlate the cloud (like PCA+scale). Then rotate to finish separating independent sources.",
        ),
        _dual_idea(
            "Identifiability",
            "Recovery of s is identifiable only under assumptions (typically linear mixing, independent non-Gaussian sources, adequate samples).",
            "If the assumptions are wrong, the algorithm still outputs something — but it may not be the true sources.",
        ),
        _dual_idea(
            "Coordinate change reveals structure",
            "A change of basis can make latent generative factors linearly separable even when they are entangled in the original coordinates.",
            "Sometimes the right rotation of the space suddenly makes hidden pieces pop apart.",
        ),
    ],
    "cca-uurtio": [
        _dual_idea(
            "Two-view setup",
            "Given paired samples (x_i,y_i), CCA seeks vectors u,v maximising corr(Xu, Yv) subject to unit variance of the projections.",
            "You have two cameras on the same events. CCA finds a dial on camera A and a dial on camera B that move up and down together as much as possible.",
        ),
        _dual_idea(
            "Canonical variables",
            "The projected scalars Xu and Yv are canonical variables; their correlation is the canonical correlation. Multiple pairs can be extracted under orthogonality constraints.",
            "Those paired dials are the ‘shared channels’ between views. You can find several such channels, each new one independent of the previous.",
        ),
        _dual_idea(
            "Shared vs view-specific",
            "CCA emphasises cross-view shared covariance structure; variance unique to one view may be ignored by the objective.",
            "CCA loves the overlap. Useful private details that live in only one view can be thrown away if you only maximise correlation.",
        ),
        _dual_idea(
            "Regularised / kernel / sparse / deep CCA",
            "Extensions address high-dimensional covariance estimation (regularisation), nonlinear maps (kernels/deep nets), and sparse loadings for interpretability.",
            "Plain CCA breaks on messy real data. Regularise it, make it nonlinear, or make loadings sparse depending on the failure mode.",
        ),
        _dual_idea(
            "Significance & generalisation",
            "Canonical correlations estimated in-sample can overfit shared noise; evaluate out-of-sample and test significance.",
            "A high training correlation can be fake friendship between noise. Always check on held-out pairs.",
        ),
    ],
    "superposition": [
        _dual_idea(
            "Superposition hypothesis",
            "Networks can represent more features than dimensions by embedding features as almost-orthogonal directions, tolerating interference when features are sparse.",
            "Too many ideas, too little space: pack them at slight angles. When ideas rarely turn on together, the crosstalk is manageable.",
        ),
        _dual_idea(
            "Polysemantic neurons",
            "Basis neurons may activate for several unrelated features because superposition mixes feature directions into neuron coordinates.",
            "One neuron lights up for ‘dog’ and ‘car’ not because that is elegant — because packing forced a mash-up.",
        ),
        _dual_idea(
            "Feature benefit vs interference",
            "Learning balances the loss reduction from representing an extra feature against the interference cost of non-orthogonality.",
            "Adding another packed feature helps sometimes and hurts sometimes. Sparsity and importance tip the scales.",
        ),
        _dual_idea(
            "Phase changes",
            "Whether a feature is ignored, superposed, or given a dedicated dimension can jump discontinuously as sparsity/importance vary (first-order phase structure in the toy models).",
            "Tiny changes in rarity/importance can suddenly switch strategy: ignore ↔ pack ↔ dedicate a whole axis.",
        ),
        _dual_idea(
            "Feature dimensionality D_i",
            "D_i = ||W_i||² / Σ_j (Ŵ_i·W_j)² measures how much of its embedding dimension a feature owns after accounting for interference.",
            "D=1 means ‘has its own private axis.’ D=½ often means ‘shares an axis with an opposite partner.’ D=0 means ‘not represented.’",
        ),
        _dual_idea(
            "Computation in superposition",
            "Toy models show limited computation (e.g. absolute value circuits) can run even while features remain packed.",
            "The network is not only storing packed features — it can sometimes compute with them still packed.",
        ),
        _dual_idea(
            "Three ways out",
            "Resolve superposition by (1) training models without it, (2) finding an overcomplete basis after the fact (SAEs/dictionary learning), or (3) hybrids.",
            "Stop packing, or unpack later with a sparse dictionary (SAEs), or do a bit of both.",
        ),
    ],
}


def auto_dual(title: str, explain: str) -> dict:
    """Fallback: treat existing explain as original; build a simple paraphrase."""
    simple = (
        f"In plain terms: {explain} "
        f"If this feels abstract, anchor on the title — «{title}» — and ask what practical decision it changes."
    )
    # Slightly more "original/paper-like" wrapper
    original = explain
    if not explain.endswith("."):
        original += "."
    return _dual_idea(title, original, simple)


def enrich_paper(paper: dict) -> dict:
    out = dict(paper)
    pid_ideas = None  # filled by caller via overrides key

    # Dualize key ideas if override provided externally
    ideas = paper.get("keyIdeas") or []
    new_ideas = []
    for idea in ideas:
        if idea.get("original") and idea.get("simple"):
            new_ideas.append({
                "title": idea["title"],
                "original": idea["original"],
                "simple": idea["simple"],
                "explain": idea.get("explain") or idea["original"],
            })
        else:
            new_ideas.append(auto_dual(idea.get("title", ""), idea.get("explain", "")))
    out["keyIdeas"] = new_ideas

    # Vocabulary: original = term-in-field sense, simple = def
    vocab = []
    for v in paper.get("vocabulary") or []:
        vocab.append({
            "term": v["term"],
            "original": v.get("original") or f"Technical term: «{v['term']}» as used in this literature.",
            "simple": v.get("simple") or v.get("def", ""),
            "def": v.get("def", ""),
        })
    out["vocabulary"] = vocab

    # Math: formula = original statement, meaning = simple
    maths = []
    for m in paper.get("simplifiedMath") or []:
        maths.append({
            "name": m["name"],
            "formula": m.get("formula", ""),
            "original": m.get("original") or f"{m.get('name')}: {m.get('formula', '')}",
            "simple": m.get("simple") or m.get("meaning", ""),
            "meaning": m.get("meaning", ""),
        })
    out["simplifiedMath"] = maths

    # Lesson dual: original thesis + simple walkthrough
    out["originalIdea"] = paper.get("originalIdea") or paper.get("oneSentence", "")
    out["simpleLesson"] = paper.get("simpleLesson") or paper.get("plainLanguage", "")
    # Keep plainLanguage for compatibility
    out["plainLanguage"] = paper.get("plainLanguage", "")
    out["oneSentence"] = paper.get("oneSentence", "")

    # Limits dual pairs
    shows = paper.get("whatItShows") or []
    nots = paper.get("whatItDoesNotShow") or []
    out["limitPairs"] = paper.get("limitPairs") or [
        {
            "original": s,
            "simple": f"In practice this means evidence supports: {s}",
        }
        for s in shows
    ]
    out["nonClaimPairs"] = paper.get("nonClaimPairs") or [
        {
            "original": s,
            "simple": f"Do not overclaim: {s}",
        }
        for s in nots
    ]

    # SetConCA uses dual
    uses = paper.get("setconcaUse") or []
    out["setconcaPairs"] = paper.get("setconcaPairs") or [
        {"original": u, "simple": f"Action item: {u}"} for u in uses
    ]

    return out


def enrich_all(papers: dict) -> dict:
    from .dual_overrides_all import MORE

    all_overrides = {**OVERRIDES, **MORE}
    enriched = {}
    for pid, paper in papers.items():
        p = dict(paper)
        if pid in all_overrides:
            p["keyIdeas"] = all_overrides[pid]
        enriched[pid] = enrich_paper(p)
        if not enriched[pid].get("originalIdea"):
            enriched[pid]["originalIdea"] = paper.get("oneSentence", "")
        # Dual banners for the lesson tab
        enriched[pid]["originalIdea"] = paper.get("oneSentence") or enriched[pid]["originalIdea"]
        enriched[pid]["simpleLesson"] = paper.get("plainLanguage") or ""
    return enriched
