"""Generate the concept-first SetConCA curriculum data files."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "docs"

PHASES = [
    (0, "Orientation", "Build the vocabulary for looking inside a neural network.", [
        "What happens inside a language model?", "Tokens, layers, and activations", "Representations, features, and concepts", "Why neurons are not concepts", "What SetConCA is trying to improve"], "vector-space"),
    (1, "Geometry of representations", "Learn the geometry needed to measure, rotate, compress, and compare activation spaces.", [
        "Vectors as locations and directions", "Distance, dot products, and cosine similarity", "Mean, variance, and covariance", "Projections, eigenvectors, and SVD", "PCA: what it reveals and what it hides"], "pca-direction-variance"),
    (2, "Latent sources and identifiability", "Understand when hidden causes can be recovered from observations—and when they cannot.", [
        "Observed variables versus latent causes", "Correlation is not independence", "ICA and the cocktail-party problem", "Identifiability: what can be uniquely recovered?", "Interventions and causal representation claims"], "ica-mixing"),
    (3, "Sparse representation learning", "See why overcomplete dictionaries need sparse codes and how SAEs trade fidelity for selectivity.", [
        "Undercomplete and overcomplete codes", "L0, L1, and TopK sparsity", "The sparse autoencoder objective", "Dead features, shrinkage, and dictionary width", "Reconstruction is not interpretability"], "sparse-dict"),
    (4, "Multi-view representation learning", "Coordinate information shared across views without erasing view-specific information.", [
        "What counts as a view?", "CCA: align shared variation", "Deep multi-view models", "Shared and private latent variables", "Alignment versus information preservation"], "cca-shared-noise"),
    (5, "Learning representations of sets", "Represent unordered collections while retaining the relationships that matter.", [
        "Sets, sequences, and permutation invariance", "Deep Sets and sum decomposition", "Attention over set members", "Set statistics and intruder robustness", "Why SetConCA needs a set encoder"], "set-pooling"),
    (6, "Contrastive coordination", "Use positive and negative relationships carefully, with explicit control of geometry and false negatives.", [
        "What makes a positive pair?", "InfoNCE and temperature", "Alignment and uniformity", "False negatives and shortcut solutions", "Contrastive coordination for sparse features"], "contrastive-temp"),
    (7, "Transformer and mechanistic interpretability", "Connect representation geometry to residual streams, features, circuits, and interventions.", [
        "The residual stream as a communication bus", "Attention and MLP circuit hypotheses", "Superposition and polysemanticity", "SAEs as overcomplete dictionaries", "From feature correlation to mechanism"], "superposition-geometry"),
    (8, "Evaluating representations honestly", "Match each claim to an evaluation that can actually test it.", [
        "Reconstruction, FVU, and loss recovery", "Probes and control tasks", "CKA, SVCCA, and representation similarity", "Stability across seeds and models", "Causal faithfulness and steering"], "sae-pareto"),
    (9, "SAE limitations and open problems", "Treat splitting, absorption, non-canonicality, and scaling as testable failure modes.", [
        "Feature splitting and granularity", "Feature absorption and missed distinctions", "Non-canonical dictionaries", "Automated interpretability and metric validity", "A rigorous SAE evaluation protocol"], "absorption-demo"),
    (10, "SetConCA research synthesis", "Turn the curriculum into a falsifiable research program and a realistic experimental lab.", [
        "SetConCA: the full objective", "Designing multi-view activation sets", "A realistic toy experiment", "Hypotheses, baselines, and ablations", "Writing the research claim without overclaiming"], "setconca-lab"),
]

TOPICS = {
    "What happens inside a language model?": ("A language model repeatedly transforms a token representation, adding updates in a shared residual stream until the final vector supports a prediction.", "A sentence is like a relay race: each layer reads the current baton, computes a small update, and passes the baton on. The useful object is the changing vector, not a single neuron.", r"x_{l+1}=x_l+\Delta_l(x_l)", "Residual-stream diagrams make information flow inspectable, but an additive path is not by itself a causal explanation."),
    "Tokens, layers, and activations": ("Tokens are discrete inputs; activations are the numerical states produced as those inputs pass through layers.", "Give the model the same word in two sentences: the token id is fixed, but its activation can change because context changes the computation.", "h_{l,t}=f_l(h_{l-1,1:T})", "Token position, layer, and hook point are part of the measurement definition; changing them changes the scientific question."),
    "Representations, features, and concepts": ("A representation is a vector state; a feature is a direction or function that detects a recurring property; a concept is the human-level hypothesis attached to that feature.", "A map can store the same city with coordinates, pixels, or roads. A representation is the encoding; a feature is a useful direction through that encoding.", r"x\approx\sum_i z_i d_i", "A label is an interpretation of a pattern until interventions show that changing the feature changes the target behavior."),
    "Why neurons are not concepts": ("A neuron coordinate can respond to several features when the model stores more features than dimensions: this is polysemanticity.", "One shelf can hold several rarely co-occurring objects. Looking at the shelf's occupancy does not tell you which object caused it without context.", r"x=\sum_i z_i d_i,\quad M>d", "Sparsity can make feature directions clearer, but it does not guarantee a unique or complete semantic basis."),
    "What SetConCA is trying to improve": ("SetConCA tests whether coordinating sparse codes across multiple views of the same underlying item improves stability, specificity, and causal usefulness.", "Instead of judging a feature from one photograph, compare several photographs of the same object and ask what survives the viewpoint change.", r"\mathcal L=\mathcal L_{recon}+\lambda_s\mathcal L_{sparse}+\lambda_c\mathcal L_{coord}", "This is a research hypothesis, not an established result; the lab must measure gains against matched pointwise baselines."),
}

# Each lesson gets a concrete claim. This keeps the course from sounding like a
# template with a topic name pasted into it.
LESSON_FOCUSES = {
    "Vectors as locations and directions": "A vector is an ordered list of numbers, but geometrically it is a point or an arrow. Which view is useful depends on whether you care about state or change.",
    "Distance, dot products, and cosine similarity": "Euclidean distance asks how far two states are apart; the dot product asks how much they point together; cosine similarity removes length so it compares direction alone.",
    "Mean, variance, and covariance": "The mean locates a cloud, variance measures spread along one coordinate, and covariance records whether two coordinates move together.",
    "Projections, eigenvectors, and SVD": "Projection keeps the part of a vector along a chosen direction. Eigenvectors and SVD give useful directions for transforming or compressing a whole dataset.",
    "PCA: what it reveals and what it hides": "PCA keeps directions of high variance. That is valuable for compression and visualization, but the directions can mix several semantic causes.",
    "Observed variables versus latent causes": "We observe activations and labels; latent causes are the hidden variables proposed to explain why those observations covary.",
    "Correlation is not independence": "Two variables can have zero correlation and still depend on one another. Independence rules out every statistical dependence, not just a linear one.",
    "ICA and the cocktail-party problem": "ICA assumes observations are mixtures of independent, non-Gaussian sources and searches for an unmixing transformation.",
    "Identifiability: what can be uniquely recovered?": "A latent variable is identifiable only when the stated assumptions rule out alternative explanations for the same observations, apart from known symmetries such as permutation or scaling.",
    "Interventions and causal representation claims": "If changing a representation component changes a target behaviour while relevant alternatives are controlled, that is stronger evidence than a correlation or probe score.",
    "Undercomplete and overcomplete codes": "An undercomplete code compresses into fewer dimensions. An overcomplete code offers more feature directions than input dimensions, so it must be constrained to avoid arbitrary dense solutions.",
    "L0, L1, and TopK sparsity": "L0 counts active features, L1 penalizes their magnitude, and TopK keeps exactly the largest k activations. They impose different trade-offs during training.",
    "The sparse autoencoder objective": "A sparse autoencoder must reconstruct activations while using a small, selective code. Its objective determines which reconstruction--sparsity compromise it learns.",
    "Dead features, shrinkage, and dictionary width": "A feature can die when it rarely receives gradient; L1 can shrink useful magnitudes; a wider dictionary can reduce merging but can also split broad patterns into many fragments.",
    "Reconstruction is not interpretability": "Low reconstruction error says the decoder retained information. It does not say the individual latent features line up with human concepts or causal variables.",
    "What counts as a view?": "A view is a second observation of the same underlying item that changes some information while preserving something you want to identify.",
    "CCA: align shared variation": "CCA finds one direction in each view whose projected values are maximally correlated. It recovers shared variation, not necessarily the causal factor that generated it.",
    "Deep multi-view models": "Deep CCA-style models learn nonlinear encoders before applying an alignment objective, which increases flexibility but also creates more ways to discard useful information.",
    "Shared and private latent variables": "A good multi-view model separates what should agree across views from details that belong to one view only.",
    "Alignment versus information preservation": "Forcing two representations to agree can erase view-specific signal. Reconstruction and private-latent controls tell you whether alignment is buying agreement by throwing information away.",
    "Sets, sequences, and permutation invariance": "A set has members but no meaningful order. A set encoder should give the same answer after permuting those members, unlike a sequence model.",
    "Deep Sets and sum decomposition": "Deep Sets uses a function of the form rho(sum(phi(x))) so each member is encoded before a permutation-invariant aggregation.",
    "Attention over set members": "Attention lets a set encoder weigh relationships between members instead of treating every member as equally informative.",
    "Set statistics and intruder robustness": "A useful set representation should retain the shared structure of its members and degrade predictably when unrelated intruders are added.",
    "Why SetConCA needs a set encoder": "If several activation views belong to one semantic item, the aggregation rule decides what evidence becomes shared supervision and what variation is discarded.",
    "What makes a positive pair?": "A positive pair is not automatically meaningful. It encodes the invariance you want the model to learn, so its construction is part of the hypothesis.",
    "InfoNCE and temperature": "InfoNCE raises the similarity of positives relative to negatives; temperature controls how sharply the loss concentrates on the hardest comparisons.",
    "Alignment and uniformity": "Contrastive learning needs positives to come together and the overall representation distribution to remain spread out enough to avoid collapse.",
    "False negatives and shortcut solutions": "A negative can secretly share the target concept with the anchor, and a model can exploit nuisance cues that distinguish views without learning the intended semantics.",
    "Contrastive coordination for sparse features": "For SetConCA, a coordination loss should encourage related views to use compatible sparse codes without making all features identical.",
    "The residual stream as a communication bus": "The residual stream is the running vector state that attention and MLP blocks read from and write updates into.",
    "Attention and MLP circuit hypotheses": "Circuit analysis proposes a specific path through attention heads, MLPs, and residual additions that contributes to a behaviour; the proposal needs intervention tests.",
    "Superposition and polysemanticity": "Superposition allows more features than dimensions by placing feature directions non-orthogonally. A neuron can then respond to several unrelated features.",
    "SAEs as overcomplete dictionaries": "An SAE offers a larger set of candidate directions and activates only a few at once, aiming to resolve features that were superposed in the original coordinates.",
    "From feature correlation to mechanism": "A feature that correlates with a behaviour is a candidate explanation. Necessity and sufficiency require targeted interventions and controls.",
    "Reconstruction, FVU, and loss recovery": "FVU measures how much activation variance reconstruction misses; loss recovery tests whether replacing activations preserves the model's next-token behaviour.",
    "Probes and control tasks": "A probe shows that information can be decoded. Control tasks test whether the probe learned an accidental lookup table rather than a useful organization of the representation.",
    "CKA, SVCCA, and representation similarity": "Similarity metrics compare geometry or subspaces across models and runs. They do not establish one-to-one correspondence between features.",
    "Stability across seeds and models": "A result that survives random seeds, model families, layers, and sampling changes is more credible than a single attractive run.",
    "Causal faithfulness and steering": "Faithfulness asks whether an explanation tracks the computation that causes behaviour. Steering tests effects of changing a component, but requires dosage and off-target controls.",
    "Feature splitting and granularity": "A broad feature can split into finer features as dictionary capacity grows. This changes the level of abstraction, not necessarily the quality of the representation.",
    "Feature absorption and missed distinctions": "A narrow or heavily constrained dictionary can use one feature for several related causes, hiding distinctions that matter for analysis or intervention.",
    "Non-canonical dictionaries": "Different training seeds can find different sparse dictionaries with similar reconstruction and sparsity, so an SAE basis should not be treated as the unique ground truth.",
    "Automated interpretability and metric validity": "Automated descriptions are useful measurements only if they are calibrated against controls, human checks, and causal tests rather than judged by plausibility alone.",
    "A rigorous SAE evaluation protocol": "A credible SAE evaluation reports fidelity, sparsity, interpretability, stability, and intervention outcomes, with seeds and matched baselines.",
    "SetConCA: the full objective": "SetConCA combines reconstruction, sparsity, and cross-view coordination. Each term needs a separate ablation because a combined loss can hide where a gain comes from.",
    "Designing multi-view activation sets": "A multi-view set should contain observations of the same intended concept under controlled variation, with a documented rule for positives, negatives, and intruders.",
    "A realistic toy experiment": "A good toy problem has known latent causes, partial views, nuisance variation, and a metric that can distinguish recovery of the intended factor from a shortcut.",
    "Hypotheses, baselines, and ablations": "A research hypothesis should predict a directional change on a named metric, against a matched baseline, and specify what result would count as failure.",
    "Writing the research claim without overclaiming": "Write only what the experiment measures: coordination can improve a chosen metric under stated conditions without proving that the learned features are the true concepts.",
}

PHASE_GUIDES = {
    0: (r"h_{l,t}=f_l(h_{l-1,1:T})", "Track one token through two contexts and compare its activation at the same layer. The changing vector is the object the later lessons will analyze.", "A diagram of activations makes the pipeline visible, but it does not identify a concept or a mechanism."),
    1: (r"\mathrm{Var}(w^\top x)=w^\top\Sigma w", "Draw a small cloud of points, rotate an axis through it, and compare the projection spread with the residual error.", "Geometric summaries depend on centering, normalization, and the metric. A clean plot can still merge causes."),
    2: (r"x=As+\epsilon", "Mix two non-Gaussian sources, then change the mixing matrix. Ask which assumptions make unmixing possible and which leave several answers equally valid.", "Latent recovery claims are conditional: remove an assumption and the same observations can support a different latent explanation."),
    3: (r"\mathcal L=\|x-\hat{x}\|_2^2+\lambda\|z\|_1", "Generate activations from a few sparse ground-truth factors, then compare an L1 code and a TopK code at similar reconstruction error.", "A sparse code can still be unstable, polysemantic, or aligned to a convenient decomposition rather than the intended factors."),
    4: (r"\max_{u,v}\;\mathrm{corr}(u^\top X,v^\top Y)", "Create two views with one shared factor and one private factor. Increase private signal and watch an alignment-only objective ignore it.", "Correlation identifies agreement, not necessarily cause. A shared nuisance can look just as attractive as a shared concept."),
    5: (r"f(X)=\rho(\sum_{x\in X}\phi(x))", "Make sets from the same latent class, permute them, then inject unrelated members. Compare mean pooling with a learned aggregation rule.", "Permutation invariance is necessary for sets but it does not guarantee robustness to bad members or preserve all relations."),
    6: (r"\mathcal L_{\mathrm{NCE}}=-\log\frac{e^{s(z,z^+)/\tau}}{\sum_j e^{s(z,z_j)/\tau}}", "Give each item two legitimate views and several near-duplicate negatives. Sweep temperature and inspect when the loss starts punishing semantically valid neighbours.", "A lower contrastive loss can come from a shortcut in the views, not from recovery of the intended invariant."),
    7: (r"x_{l+1}=x_l+\mathrm{Attn}_l(x_l)+\mathrm{MLP}_l(x_l)", "Choose a small behaviour, name a candidate feature path, then ablate or patch it while holding the prompt family fixed.", "A descriptive feature label is not a circuit. The explanation must survive causal intervention and negative controls."),
    8: (r"\mathrm{FVU}=\frac{\|X-\hat X\|_F^2}{\|X-\bar X\|_F^2}", "Run two methods across several seeds and plot fidelity, sparsity, similarity, and intervention effects separately instead of collapsing them into one score.", "No single metric measures interpretability. Every metric needs an explicit non-claim beside it."),
    9: (r"x\approx\sum_i z_i d_i", "Train dictionaries at two widths on the same synthetic factors and inspect when one factor merges, splits, or changes identity across seeds.", "A feature inventory is resolution-dependent. A label can be useful without being an atomic or canonical unit."),
    10: (r"\mathcal L=\mathcal L_{\mathrm{recon}}+\lambda_s\mathcal L_{\mathrm{sparse}}+\lambda_c\mathcal L_{\mathrm{set}}", "Sample known latent concepts, render several noisy partial views per concept, and compare a pointwise SAE with a set-coordinated variant under equal capacity and compute.", "The toy model tests a mechanism under controlled assumptions. It does not predict a gain on language-model activations until that experiment is run."),
}

PHASE_ANALOGIES = {
    1: "Imagine a sheet of graph paper laid over a cloud of points. Rotating the paper changes the coordinates, not the points themselves.",
    2: "Think of hearing several instruments through a wall. The sound at the wall is observable; the instruments are the proposed hidden causes.",
    3: "Think of an overcomplete dictionary as a large box of labelled tools. Sparsity says that only a few tools may be taken out for any one job.",
    4: "Two cameras can film the same event from different angles. What both cameras see is shared; their lighting, occlusion, and viewpoint are private.",
    5: "A bowl of fruit has members but no first apple. A good set representation should not change when you stir the bowl.",
    6: "Contrastive learning is a sorting game: place genuine variants of the same item close together without piling every item into one corner.",
    7: "Treat a transformer as a busy workshop with a shared workbench. Each component adds or reads a mark, but a mark is not an explanation until changing it changes the job's outcome.",
    8: "Evaluation is a medical panel, not a single thermometer. One number can be reassuring while another reveals the problem.",
    9: "A dictionary is like a map drawn at a chosen zoom level. Zooming in can split one region into many roads; zooming out can merge distinct places.",
    10: "A toy experiment is a wind tunnel: simplified enough to know the ground truth, but rich enough that the method can fail for the same kinds of reasons it might fail in practice.",
}

COMPARISONS = {
    0: ("What is being named?", "A coordinate", "A feature direction", "A human concept", "Keep the measurement separate from the interpretation."),
    1: ("Which property is preserved?", "Euclidean distance", "Angular direction", "Variance under projection", "Different geometric choices answer different questions."),
    2: ("What does the assumption buy?", "Correlation: a linear summary", "Independence: stronger separation", "Causal model: intervention predictions", "Do not upgrade one kind of evidence into another."),
    3: ("How is sparsity imposed?", "L1: soft magnitude penalty", "TopK: exact activity budget", "Dense AE: no sparse constraint", "Compare methods at matched fidelity and activity."),
    4: ("What information is rewarded?", "CCA: shared correlation", "Reconstruction: within-view fidelity", "Shared/private model: both", "Alignment alone can discard valuable private signal."),
    5: ("How are members combined?", "Mean pooling: equal weight", "Deep Sets: learned member map", "Attention: relational weighting", "Choose the simplest aggregator that passes the required robustness checks."),
    6: ("What prevents collapse?", "InfoNCE: negatives", "VICReg: variance and covariance terms", "Supervised contrastive: class positives", "The positive-pair definition is usually the highest-leverage choice."),
    7: ("What kind of claim is made?", "Activation correlation", "Feature description", "Causal circuit test", "Only the last tests whether the component contributes to the behaviour."),
    8: ("What does the metric measure?", "FVU: reconstruction", "CKA: geometry similarity", "Intervention: causal effect", "Report the metric's non-claim beside its result."),
    9: ("What changes with capacity or seed?", "Absorption: factors merge", "Splitting: factors divide", "Non-canonicality: bases differ", "None of these can be diagnosed from a single run."),
    10: ("What must be held fixed?", "Pointwise SAE: no set signal", "SetConCA: coordination term", "Ablation: remove one term", "The ablation identifies which added component caused a gain."),
}

COMPARISON_NAMES = {
    0: ("Neuron coordinate", "Feature", "Concept label"), 1: ("Distance", "Cosine", "Variance"),
    2: ("Correlation", "Independence", "Causal model"), 3: ("L1 SAE", "TopK SAE", "Dense AE"),
    4: ("CCA", "Reconstruction", "Shared/private model"), 5: ("Mean pooling", "Deep Sets", "Attention pooling"),
    6: ("InfoNCE", "VICReg", "Supervised contrastive"), 7: ("Correlation", "Feature label", "Circuit intervention"),
    8: ("FVU", "CKA", "Intervention"), 9: ("Absorption", "Splitting", "Non-canonicality"),
    10: ("Pointwise SAE", "SetConCA", "Term ablation"),
}

def topic_for(title: str, phase: int) -> tuple[str, str, str, str]:
    if title in TOPICS:
        return TOPICS[title]
    focus = LESSON_FOCUSES[title]
    equation, _, warning = PHASE_GUIDES[phase]
    return (
        focus,
        f"{PHASE_ANALOGIES[phase]} {focus}",
        equation,
        warning,
    )

def lesson(phase: int, index: int, title: str, previous: str | None, next_title: str | None, visual: str) -> dict:
    definition, intuition, equation, warning = topic_for(title, phase)
    phase_name = PHASES[phase][1]
    _, toy_description, phase_warning = PHASE_GUIDES[phase]
    comparison_question, pca, ica, cca, implication = COMPARISONS[phase]
    name_a, name_b, name_c = COMPARISON_NAMES[phase]
    lid = f"p{phase:02d}-l{index:02d}"
    return {
        "id": lid, "phase": phase_name, "phaseIndex": phase, "lessonIndex": index,
        "title": title, "estimatedMinutes": 25, "status": "complete",
        "claimLabels": ["Definition", "Mathematical Result", "Course Interpretation", "Hypothesis", "Warning"],
        "prerequisites": [previous] if previous else [],
        "learningObjectives": [f"Explain {title.lower()} in plain language", "Write down the objective and identify its assumptions", "Design one test that could falsify an over-strong interpretation"],
        "sections": {
            "whyThisLesson": {"text": f"{definition} This lesson gives you a concrete test for that claim before the course moves to the next abstraction."},
            "bridgeFrom": previous or "The course opening",
            "intuition": {"analogy": intuition, "analogyLimit": warning, "text": definition},
            "toyExample": {"description": toy_description, "steps": [{"action": "State the ground truth first", "result": f"Specify exactly what {title.lower()} should recover, preserve, or ignore.", "insight": "The intended factor must be known before a toy result can be judged."}, {"action": "Run the matched comparison", "result": "Use the same data, capacity, training budget, and evaluation examples for both methods.", "insight": "Otherwise a visible gain may be a resource difference in disguise."}, {"action": "Break one assumption", "result": "Vary the source correlation, noise, view quality, or sparsity and record the first failure.", "insight": "The boundary of success is usually more useful than the headline score."}]},
            "visual": {"id": visual, "question": f"Which assumption behind {title.lower()} changes the result most?", "description": "Move one control at a time. Treat the display as a toy model, then write down the real experiment it suggests."},
            "technical": {"text": f"{definition} In practice, write down the input unit, the operation applied to it, and the exact statistic used to score the result. Those are different things. A learned representation can be useful even when the interpretation attached to it turns out to be wrong."},
            "mathematics": [{"equation": equation, "symbols": {"x": "observed activation or input", "z": "latent code", "d_i": "dictionary direction", "lambda": "trade-off weight"}, "explanation": f"For this lesson, the expression makes the central trade-off explicit. {definition}", "whyNeeded": "It says precisely what the method is being rewarded for.", "ifRemoved": "You could not tell whether two implementations were solving the same problem.", "encourages": "A testable prediction about the chosen objective.", "doesNotGuarantee": phase_warning}],
            "methodComparison": [{"question": comparison_question, "methods": [{"name": name_a, "answer": pca}, {"name": name_b, "answer": ica}, {"name": name_c, "answer": cca}], "practicalImplication": implication}],
            "evidence": [{"claim": definition, "claimType": "definition", "sourceId": "course-synthesis", "section": "lesson framing", "verified": False, "note": "Course explanation. Use the research library's primary sources for paper-specific empirical claims."}],
            "failureModes": [{"name": "A score that answers the wrong question", "mechanism": "The objective rewards a proxy while the paper describes a stronger scientific property.", "symptom": "The headline metric rises, but seed stability, controls, or interventions disagree.", "diagnosticTest": "Add a matched negative control and one counterfactual intervention.", "mitigation": "Either narrow the claim or add the missing measurement.", "setconcaRelevance": "Report both the intended benefit and the most plausible shortcut for every SetConCA loss term."}],
            "setconcaConnection": {"relevance": f"{title} determines how SetConCA should represent, group, or evaluate activation views.", "whichPart": "The choice of sparse code, view set, coordination loss, or evaluation.", "whichDesignChoice": "Match the pointwise SAE and SetConCA on model, activation site, width, sparsity budget, and compute.", "whichFailure": "Mistaking stronger agreement for recovery of the intended concept.", "whichExperiment": "Compare fidelity, feature stability, selectivity, and controlled interventions; report each result separately.", "alternativeExplanation": "An apparent gain may come from extra context, effective capacity, or easier positives rather than set coordination."},
            "exercises": [{"type": "diagnose", "prompt": f"A paper claims that {title.lower()} improved interpretability. What one result would you ask for before accepting that claim?", "reveal": "Ask for the smallest missing control: a matched baseline, several seeds, a negative control, or an intervention that tests the claimed mechanism."}],
            "masteryQuestions": [{"type": "open", "prompt": f"Explain {title.lower()} to a colleague, then name one thing the method cannot establish by itself.", "rubric": ["Defines the object clearly", "Names the objective or assumption", "Separates evidence from interpretation", "Gives a valid limitation"]}],
            "nextLesson": {"id": f"p{phase:02d}-l{index+1:02d}" if next_title else None, "bridge": f"Next: {next_title}. The next idea reuses this lesson's representation and makes a new assumption explicit." if next_title else "This phase checkpoint now combines the ideas from the phase."},
            "researchWorksheet": {"fields": [{"key": "claim", "label": "Falsifiable claim", "prompt": "Write the smallest claim this lesson supports."}, {"key": "control", "label": "Control", "prompt": "What control would rule out a shortcut?"}]},
        },
    }

def main() -> None:
    lessons_root = OUT / "curriculum" / "lessons"
    lessons_root.mkdir(parents=True, exist_ok=True)
    phase_data, concepts, edges = [], [], []
    for phase, name, description, titles, visual in PHASES:
        metas = []
        for i, title in enumerate(titles, 1):
            lid = f"p{phase:02d}-l{i:02d}"
            prev = f"p{phase:02d}-l{i-1:02d}" if i > 1 else (f"p{phase-1:02d}-l05" if phase else None)
            nxt = titles[i] if i < len(titles) else None
            data = lesson(phase, i, title, prev, nxt, visual)
            safe_title = ''.join(ch if ch.isalnum() or ch in ' -_' else '' for ch in title.lower()).replace(' ', '-')
            path = lessons_root / f"phase-{phase:02d}" / f"{lid}-{safe_title}.json"
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
            metas.append({"id": lid, "title": title, "file": path.name, "status": "complete", "estimatedMinutes": 25})
            concepts.append({"id": lid, "title": title, "category": name, "oneSentenceDefinition": topic_for(title, phase)[0], "fullDefinition": topic_for(title, phase)[1], "prerequisites": data["prerequisites"], "lessonIds": [lid], "setconcaRelevance": data["sections"]["setconcaConnection"]["relevance"]})
            if prev: edges.append({"from": prev, "to": lid})
        phase_data.append({"id": phase, "title": f"Phase {phase} — {name}", "description": description, "lessons": metas, "checkpoint": f"Explain the phase's core objective, reproduce a toy comparison, and write its strongest limitation."})
    (OUT / "curriculum" / "phases.json").write_text(json.dumps(phase_data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    (OUT / "curriculum" / "concepts.json").write_text(json.dumps(concepts, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    (OUT / "curriculum" / "dependencies.json").write_text(json.dumps(edges, indent=2) + "\n", encoding="utf-8")
    glossary = [{"term": t, "oneSentence": d[0], "fullDefinition": d[1], "conceptId": f"p00-l0{i+1}", "lessonIds": [f"p00-l0{i+1}"], "inlineHighlight": i < 8} for i, (t, d) in enumerate(TOPICS.items())]
    glossary += [{"term": "FVU", "oneSentence": "Fraction of variance unexplained after reconstruction.", "fullDefinition": "FVU compares reconstruction error with the centered data variance; lower is better reconstruction, not proof of interpretability.", "conceptId": "p08-l01", "lessonIds": ["p08-l01"], "inlineHighlight": True}, {"term": "Identifiability", "oneSentence": "Whether the hidden object can be uniquely recovered under stated assumptions.", "fullDefinition": "A recovery problem is identifiable when alternative latent explanations cannot produce the same observations, up to declared symmetries.", "conceptId": "p02-l04", "lessonIds": ["p02-l04"], "inlineHighlight": True}]
    (OUT / "curriculum" / "glossary.json").write_text(json.dumps(glossary, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    papers_dir = OUT / "curriculum" / "papers"
    papers_dir.mkdir(parents=True, exist_ok=True)
    legacy = (OUT / "papers.js").read_text(encoding="utf-8")
    legacy = legacy.removeprefix("window.CURRICULUM_DATA = ").rstrip().removesuffix(";")
    old = json.loads(legacy)
    papers = []
    for level in old.get("levels", []):
        for paper in level.get("papers", []):
            papers.append({
                "id": paper.get("id"), "title": paper.get("title"), "authors": paper.get("authors"),
                "year": paper.get("year"), "venue": paper.get("venue", "Source library"),
                "status": paper.get("status", "source-library"), "file": paper.get("file"),
                "url": paper.get("url"), "concepts": [], "lessonIds": [], "tier": "background",
                "summary": paper.get("setconca") or paper.get("summary"),
            })
    (papers_dir / "metadata.json").write_text(json.dumps(papers, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

if __name__ == "__main__":
    main()
