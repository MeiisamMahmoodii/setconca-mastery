"""Merge all teaching content modules."""
from .level_primers import COURSE_INTRO, LEVEL_PRIMERS
from .papers_l1_l5 import PAPERS as P1
from .papers_l6_l10 import PAPERS as P2
from .dual_enrich import enrich_all

ALL_PAPERS = enrich_all({**P1, **P2})

__all__ = ["COURSE_INTRO", "LEVEL_PRIMERS", "ALL_PAPERS"]
