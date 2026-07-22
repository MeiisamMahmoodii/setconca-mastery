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

def topic_for(title: str, phase: int) -> tuple[str, str, str, str]:
    if title in TOPICS:
        return TOPICS[title]
    phase_desc = PHASES[phase][2]
    return (
        f"{title} is a working tool for {phase_desc.lower()}",
        f"Think of {title.lower()} as a controlled way to ask one question of a representation. Keep the data, objective, and comparison visible so the result is interpretable.",
        r"\mathcal L=\mathcal L_{task}+\lambda\mathcal L_{regularizer}",
        "The method answers only the property its objective and evaluation measure; a good score cannot silently establish a stronger claim.",
    )

def lesson(phase: int, index: int, title: str, previous: str | None, next_title: str | None, visual: str) -> dict:
    definition, intuition, equation, warning = topic_for(title, phase)
    phase_name = PHASES[phase][1]
    lid = f"p{phase:02d}-l{index:02d}"
    return {
        "id": lid, "phase": phase_name, "phaseIndex": phase, "lessonIndex": index,
        "title": title, "estimatedMinutes": 25, "status": "complete",
        "claimLabels": ["Definition", "Mathematical Result", "Course Interpretation", "Hypothesis", "Warning"],
        "prerequisites": [previous] if previous else [],
        "learningObjectives": [f"Explain {title.lower()} in plain language", "Write down the objective and identify its assumptions", "Design one test that could falsify an over-strong interpretation"],
        "sections": {
            "whyThisLesson": {"text": f"This lesson exists because {title.lower()} is a prerequisite for making defensible claims in SetConCA. It is placed here after the previous idea so the notation has a job to do."},
            "bridgeFrom": previous or "The course opening",
            "intuition": {"analogy": intuition, "analogyLimit": warning, "text": definition},
            "toyExample": {"description": f"Use a small synthetic dataset to isolate {title.lower()} before adding model-scale complexity.", "steps": [{"action": "Choose the data-generating factors", "result": "Write down which variables should be shared, private, sparse, or irrelevant.", "insight": "If the intended structure is not specified first, an evaluation can reward a shortcut."}, {"action": "Apply the method", "result": "Record the representation, reconstruction, and the statistic used to judge it.", "insight": "The metric is part of the experiment, not a neutral afterthought."}, {"action": "Perturb one assumption", "result": "Change correlation, noise, view quality, or dictionary width and repeat.", "insight": "A method is understood by its boundary conditions."}]},
            "visual": {"id": visual, "question": f"What changes when you manipulate the main assumption behind {title.lower()}?", "description": "Adjust the control, observe the geometry, then state what the visual does and does not prove."},
            "technical": {"text": f"Technically, {title.lower()} is defined by the data interface, the learned or computed representation, and the evaluation statistic. Keep those three separate. The representation is an object; the interpretation is a claim about that object; the experiment is evidence for or against the claim."},
            "mathematics": [{"equation": equation, "symbols": {"x": "observed activation or input", "z": "latent code", "d_i": "dictionary direction", "lambda": "trade-off weight"}, "explanation": "The equation names the quantities being combined; it is not a proof that the latent variables have the intended meaning.", "whyNeeded": "It makes the optimization target explicit.", "ifRemoved": "Without the objective, comparisons become vague and irreproducible.", "encourages": "State assumptions and evaluate them directly.", "doesNotGuarantee": "Identifiability, interpretability, or causality."}],
            "methodComparison": [{"question": "What does it prioritise?", "pca": "Within-view variance", "ica": "Statistical independence", "cca": "Cross-view correlation", "implication": "Choose the method from the scientific question, not from the best-looking plot."}],
            "evidence": [{"claim": definition, "claimType": "definition", "sourceId": "course-synthesis", "section": "lesson framing", "verified": False, "note": "Course synthesis; verify against the linked primary papers before making a paper-level claim."}],
            "failureModes": [{"name": "Objective–claim mismatch", "mechanism": "The optimization statistic rewards a proxy rather than the property the researcher names.", "symptom": "The score improves while controls or interventions do not.", "diagnosticTest": "Add a negative control and a counterfactual intervention.", "mitigation": "Narrow the claim or add evidence that tests the missing property.", "setconcaRelevance": "Every SetConCA comparison should report the proxy and its ceiling."}],
            "setconcaConnection": {"relevance": f"{title} supplies one design decision for SetConCA.", "whichPart": "The representation, view construction, or evaluation protocol.", "whichDesignChoice": "Keep the baseline matched on data, capacity, and compute.", "whichFailure": "Confusing agreement with recovery of a true concept.", "whichExperiment": "Compare pointwise SAE and set-coordinated SAE on reconstruction, stability, selectivity, and intervention.", "alternativeExplanation": "Any gain may come from extra context, regularization, or capacity rather than set coordination."},
            "exercises": [{"type": "diagnose", "prompt": f"A paper reports a better score after adding {title.lower()}. What is the first alternative explanation you would test?", "reveal": "Hold model, data, training budget, and evaluation examples fixed; then add controls for capacity and shortcut information."}],
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
