"""Refine raw ICLR 2026 notes into a precise, tiered candidate list and emit
candidate_papers.md. Reads _raw_notes.json produced by fetch_iclr.py.

Precision strategy (matches only on author-chosen fields: title, keywords,
TLDR, primary_area -- NOT the abstract -- to keep signal high):
  Tier 1  = primary_area is interpretability/XAI, OR an unambiguous
            mech-interp / SAE / circuits keyword hit.
  Tier 2  = topical keyword hit within a relevant primary_area
            (representation learning, causal reasoning, safety/alignment),
            or a strong interp-adjacent keyword regardless of area.
Everything else is dropped from the candidate list (kept in raw cache).
"""
from __future__ import annotations
import json, re, pathlib, collections

OUT_DIR = pathlib.Path(__file__).resolve().parent.parent / "Conferences" / "ICLR" / "2026"
RAW = OUT_DIR / "_raw_notes.json"

IE_AREA = "interpretability and explainable ai"
REP_AREA = "unsupervised, self-supervised, semi-supervised, and supervised representation learning"
CAUSAL_AREA = "causal reasoning"
SAFETY_AREA = "alignment, fairness, safety, privacy, and societal considerations"
TIER2_AREAS = {REP_AREA, CAUSAL_AREA, SAFETY_AREA}

STRONG = [
    "sparse autoencoder", "sparse auto-encoder", "mechanistic interpret",
    "monosemantic", "polysemantic", "superposition", "dictionary learning",
    "activation patching", "path patching", "attribution patching",
    "steering vector", "activation steering", "representation steering",
    "transcoder", "crosscoder", "cross-coder", "refusal direction",
    "residual stream", "logit lens", "linear representation",
    "feature geometry", "circuit discovery", "transformer circuit",
    "induction head", "feature absorption", "feature splitting",
    "sparse dictionary", "sae feature", "interpretable feature",
    "sparse features", "sparse probing", "toy model of superposition",
]
# subset of STRONG that marks a paper as core mech-interp/SAE (for prioritisation)
CORE = [
    "sparse autoencoder", "sparse auto-encoder", "mechanistic interpret",
    "monosemantic", "polysemantic", "superposition", "dictionary learning",
    "activation patching", "path patching", "attribution patching",
    "steering vector", "activation steering", "transcoder", "crosscoder",
    "refusal direction", "linear representation", "circuit discovery",
    "transformer circuit", "induction head", "feature geometry",
    "feature absorption", "feature splitting", "sae",
]
STRONG_RE = re.compile(r"\bsaes?\b")
# strong interp keywords that qualify tier-2 regardless of area
MEDIUM_STRONG = [
    "concept bottleneck", "concept activation vector", "concept vector",
    "knowledge editing", "model editing", "machine unlearning",
    "steering", "probing classifier", "linear probe", "concept discovery",
    "concept erasure", "representation engineering", "activation addition",
]
MEDIUM = [
    "representation alignment", "representation similarity", "neural collapse",
    "disentangl", "self-supervised", "contrastive", "faithfulness",
    "probing", "prototype", "causal representation", "concept-based",
    "out-of-distribution detection", "ood detection", "explainab",
    "interpretab", "saliency", "attribution", "feature attribution",
    "representation geometry", "latent representation",
]

def blob(n):
    c = n["content"]
    parts = [c.get("title", {}).get("value", "")]
    parts += c.get("keywords", {}).get("value", []) or []
    parts.append(c.get("TLDR", {}).get("value", "") or "")
    return " \n ".join(parts).lower()

def status_of(venueid):
    return {"Conference": "accepted", "Rejected_Submission": "rejected",
            "Withdrawn_Submission": "withdrawn",
            "Desk_Rejected_Submission": "desk_rejected"}.get(venueid.split("/")[-1], venueid.split("/")[-1])

def hits(terms, text):
    return [t for t in terms if t in text]

def classify(n):
    c = n["content"]
    area = (c.get("primary_area", {}).get("value", "") or "").lower()
    b = blob(n)
    strong = hits(STRONG, b)
    if STRONG_RE.search(b):
        strong = strong + ["sae"]
    med_strong = hits(MEDIUM_STRONG, b)
    med = hits(MEDIUM, b)
    if area == IE_AREA or strong:
        return "tier-1", (strong or ["primary_area:interpretability"]) + med_strong
    if med_strong:
        return "tier-2", med_strong + med
    if med and area in TIER2_AREAS:
        return "tier-2", med
    return None, []

def main():
    raw = json.loads(RAW.read_text(encoding="utf-8"))
    recs = []
    for fid, n in raw.items():
        c = n["content"]
        venueid = c.get("venueid", {}).get("value", "")
        tier, kws = classify(n)
        if tier is None:
            continue
        recs.append({
            "forum": fid, "title": c.get("title", {}).get("value", ""),
            "authors": c.get("authors", {}).get("value", []),
            "status": status_of(venueid),
            "venue": c.get("venue", {}).get("value", ""),
            "primary_area": c.get("primary_area", {}).get("value", ""),
            "keywords": c.get("keywords", {}).get("value", []),
            "tldr": c.get("TLDR", {}).get("value", ""),
            "abstract": c.get("abstract", {}).get("value", ""),
            "tier": tier, "matched": sorted(set(kws)),
            "pdf": c.get("pdf", {}).get("value", ""),
            "url": f"https://openreview.net/forum?id={fid}",
            "number": n.get("number"),
        })

    order_s = {"accepted": 0, "rejected": 1, "withdrawn": 2, "desk_rejected": 3}
    recs.sort(key=lambda r: (r["tier"], order_s.get(r["status"], 9), r["title"].lower()))
    (OUT_DIR / "_cache_candidates.json").write_text(json.dumps(recs, indent=2, ensure_ascii=False), encoding="utf-8")

    # diagnostics
    print("total candidates:", len(recs))
    print("by tier:", dict(collections.Counter(r["tier"] for r in recs)))
    print("by status:", dict(collections.Counter(r["status"] for r in recs)))
    for t in ("tier-1", "tier-2"):
        print(f"{t} accepted:", sum(1 for r in recs if r["tier"] == t and r["status"] == "accepted"))

    # markdown
    md = build_md(recs)
    (OUT_DIR / "candidate_papers.md").write_text(md, encoding="utf-8")
    print("wrote candidate_papers.md")

    (OUT_DIR / "reading_queue.md").write_text(build_queue(recs), encoding="utf-8")
    print("wrote reading_queue.md")

def esc(s):
    return (s or "").replace("|", "\\|").replace("\n", " ").strip()

def build_md(recs):
    from datetime import date
    n_acc = sum(1 for r in recs if r["status"] == "accepted")
    lines = []
    lines.append("---")
    lines.append("conference: ICLR")
    lines.append("year: 2026")
    lines.append(f"last_updated: {date.today().isoformat()}")
    lines.append("source: OpenReview API v2 (/notes/search, group=ICLR.cc/2026/Conference)")
    lines.append("---\n")
    lines.append("# ICLR 2026 — Candidate Papers\n")
    lines.append("> [!note] Method")
    lines.append("> Candidates gathered via OpenReview fuzzy search over ~47 interpretability/representation-learning terms, deduped by forum id, then filtered on author-provided fields (title, keywords, TLDR, primary_area). Acceptance status derived from `venueid`. Fuzzy recall is broad but not exhaustive; treat omissions as possible, not confirmed.\n")
    lines.append(f"- Total candidates: **{len(recs)}**")
    lines.append(f"- Accepted: **{n_acc}** | Rejected: **{sum(1 for r in recs if r['status']=='rejected')}** | Withdrawn: **{sum(1 for r in recs if r['status']=='withdrawn')}** | Desk-rejected: **{sum(1 for r in recs if r['status']=='desk_rejected')}**")
    lines.append(f"- Tier-1: **{sum(1 for r in recs if r['tier']=='tier-1')}** | Tier-2: **{sum(1 for r in recs if r['tier']=='tier-2')}**\n")
    lines.append("Reading status legend: `todo` (not yet read), `reading`, `done`. All start as `todo`.\n")

    for tier in ("tier-1", "tier-2"):
        for status in ("accepted", "rejected", "withdrawn", "desk_rejected"):
            sub = [r for r in recs if r["tier"] == tier and r["status"] == status]
            if not sub:
                continue
            lines.append(f"\n## {tier.upper()} — {status} ({len(sub)})\n")
            lines.append("| # | Title | Primary area | Matched | Forum | Reading |")
            lines.append("|---|-------|--------------|---------|-------|---------|")
            for i, r in enumerate(sub, 1):
                title = esc(r["title"])
                link = f"[{title}]({r['url']})"
                area = esc(r["primary_area"]).replace("applications to ", "").replace(", and other modalities", "")
                matched = esc(", ".join(r["matched"][:4]))
                lines.append(f"| {i} | {link} | {area} | {matched} | `{r['forum']}` | todo |")
    lines.append("")
    return "\n".join(lines)

def is_core(r):
    b = (r["title"] + " " + " ".join(r["keywords"]) + " " + (r["tldr"] or "")).lower()
    if re.search(r"\bsaes?\b", b):
        return True
    return any(c in b for c in CORE if c != "sae")

def priority(r):
    oral = "Oral" in r["venue"] or "Spotlight" in r["venue"]
    if r["status"] == "accepted" and r["tier"] == "tier-1" and oral:
        return 0
    if r["status"] == "accepted" and r["tier"] == "tier-1" and is_core(r):
        return 1
    if r["status"] == "accepted" and r["tier"] == "tier-1":
        return 2
    if r["status"] == "accepted" and r["tier"] == "tier-2":
        return 3
    if r["status"] == "rejected" and r["tier"] == "tier-1":
        return 4
    return 5

def build_queue(recs):
    from datetime import date
    labels = {
        0: "P0 — Accepted, Tier-1, Oral (read first, full)",
        1: "P1 — Accepted, Tier-1, core mech-interp / SAE (full read)",
        2: "P2 — Accepted, Tier-1, other interpretability (substantial read)",
        3: "P3 — Accepted, Tier-2, strongly adjacent (targeted read)",
        4: "P4 — Rejected, Tier-1, public reviews (read for reviewer signal)",
    }
    buckets = collections.defaultdict(list)
    for r in recs:
        p = priority(r)
        if p <= 4:
            buckets[p].append(r)
    lines = ["---", "conference: ICLR", "year: 2026",
             f"last_updated: {date.today().isoformat()}", "---\n",
             "# ICLR 2026 — Reading Queue\n",
             "Prioritised from `candidate_papers.md`. Work top-down. Mark each `todo/reading/done`.\n"]
    for p in range(5):
        sub = buckets.get(p, [])
        if not sub:
            continue
        lines.append(f"\n## {labels[p]} ({len(sub)})\n")
        lines.append("| # | Title | Matched | Forum | Reading |")
        lines.append("|---|-------|---------|-------|---------|")
        for i, r in enumerate(sub, 1):
            lines.append(f"| {i} | [{esc(r['title'])}]({r['url']}) | {esc(', '.join(r['matched'][:3]))} | `{r['forum']}` | todo |")
    lines.append("")
    return "\n".join(lines)

if __name__ == "__main__":
    main()
