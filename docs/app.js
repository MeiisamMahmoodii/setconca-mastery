/**
 * SetConCA Mastery — Application State, Router, and Progress System
 * ES Module — imported by index.html
 */

import { createRenderer } from './renderer.js?v=20260723';
import { createVisualisations } from './visualisations.js';

// ── Constants ─────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'setconca-mastery-v2';
const SCHEMA_VERSION = 2;

// Spaced review intervals in milliseconds
const REVIEW_INTERVALS = [
  1 * 24 * 60 * 60 * 1000,   // 1 day
  7 * 24 * 60 * 60 * 1000,   // 7 days
  30 * 24 * 60 * 60 * 1000,  // 30 days
];

// ── Default state ─────────────────────────────────────────────────────────────
function defaultState() {
  return {
    schemaVersion: SCHEMA_VERSION,
    mode: 'learning',    // 'learning' | 'research'
    fontSize: 'md',
    currentLessonId: null,
    currentPhase: 0,
    lessons: {},
    glossaryExpanded: {},
    worksheets: {},
    disclosures: {},
    mapViewport: { x: 0, y: 0, scale: 1 },
  };
}

// ── State serialisation ───────────────────────────────────────────────────────
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || parsed.schemaVersion !== SCHEMA_VERSION) return defaultState();
    // Restore sets safely
    if (parsed.lessons && typeof parsed.lessons === 'object') {
      Object.values(parsed.lessons).forEach(l => {
        if (l && typeof l === 'object') {
          if (Array.isArray(l.sectionsViewed)) l.sectionsViewed = new Set(l.sectionsViewed);
          else if (!l.sectionsViewed) l.sectionsViewed = new Set();
        }
      });
    } else {
      parsed.lessons = {};
    }
    return parsed;
  } catch (e) {
    console.warn('Resetting state due to parse error:', e);
    return defaultState();
  }
}

function saveState(state) {
  try {
    // Serialise Sets to arrays for JSON
    const serialisable = JSON.parse(JSON.stringify(state, (key, value) => {
      if (value instanceof Set) return [...value];
      return value;
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialisable));
  } catch (e) {
    console.warn('Failed to save state:', e);
  }
}

// ── Curriculum cache ──────────────────────────────────────────────────────────
const cache = {
  phases: null,
  concepts: null,
  dependencies: null,
  papers: null,
  glossary: null,
  lessonNarratives: null,
  paperGuides: null,
  lessons: {},    // lessonId → lesson data
};

async function fetchJSON(path) {
  const resp = await fetch(path);
  if (!resp.ok) throw new Error(`Failed to fetch ${path}: ${resp.status}`);
  return resp.json();
}

async function ensurePhases() {
  if (!cache.phases) {
    cache.phases = await fetchJSON('./curriculum/phases.json');
  }
  return cache.phases;
}

async function ensureConcepts() {
  if (!cache.concepts) {
    cache.concepts = await fetchJSON('./curriculum/concepts.json');
  }
  return cache.concepts;
}

async function ensureDependencies() {
  if (!cache.dependencies) {
    cache.dependencies = await fetchJSON('./curriculum/dependencies.json');
  }
  return cache.dependencies;
}

async function ensurePapers() {
  if (!cache.papers) {
    cache.papers = await fetchJSON('./curriculum/papers/metadata.json');
  }
  return cache.papers;
}

async function ensureGlossary() {
  if (!cache.glossary) {
    cache.glossary = await fetchJSON('./curriculum/glossary.json');
  }
  return cache.glossary;
}

async function ensureLessonNarratives() {
  if (!cache.lessonNarratives) {
    cache.lessonNarratives = await fetchJSON('./curriculum/lesson-narratives.json');
  }
  return cache.lessonNarratives;
}

async function ensurePaperGuides() {
  if (!cache.paperGuides) {
    cache.paperGuides = await fetchJSON('./curriculum/paper-guides.json');
  }
  return cache.paperGuides;
}

async function ensureLesson(id) {
  if (!cache.lessons[id]) {
    // Parse phase and lesson from id like "p01-l05"
    const [phPart] = id.split('-');
    const phaseNum = parseInt(phPart.replace('p', ''));
    const phaseDir = `phase-${String(phaseNum).padStart(2, '0')}`;
    const phases = await ensurePhases();
    const phase = phases.find(p => p.id === phaseNum);
    const lessonMeta = phase?.lessons.find(l => l.id === id);
    if (!lessonMeta) throw new Error(`Unknown lesson: ${id}`);
    cache.lessons[id] = await fetchJSON(`./curriculum/lessons/${phaseDir}/${lessonMeta.file}`);
  }
  return cache.lessons[id];
}

// ── Progress helpers ──────────────────────────────────────────────────────────
function initLesson(state, id) {
  if (!state.lessons[id]) {
    state.lessons[id] = {
      sectionsViewed: new Set(),
      exerciseCompleted: false,
      quizScore: 0,
      quizAttempts: 0,
      masteryQuestionAnswered: false,
      writtenExplanation: '',
      confidenceBefore: 0,
      confidenceAfter: 0,
      startedAt: Date.now(),
      completedAt: null,
      mastered: false,
      nextReviewAt: null,
      reviewCount: 0,
      notes: '',
    };
  }
  return state.lessons[id];
}

function checkMastery(state, lessonData) {
  const prog = state.lessons[lessonData.id];
  if (!prog) return false;

  // Required sections
  const requiredSections = ['intuition', 'technical', 'mathematics', 'failureModes'];
  const allRequired = requiredSections.every(s =>
    prog.sectionsViewed.has(s) || !lessonData.sections[s]
  );

  // Exercise completed (if lesson has exercises)
  const hasExercise = (lessonData.sections.exercises || []).length > 0;
  const exerciseOk = !hasExercise || prog.exerciseCompleted;

  // Quiz score threshold (60% for mastery)
  const hasQuiz = (lessonData.sections.masteryQuestions || []).length > 0;
  const quizOk = !hasQuiz || prog.quizScore >= 0.6;

  return allRequired && exerciseOk && quizOk;
}

function markLessonMastered(state, lessonId) {
  const prog = state.lessons[lessonId];
  if (!prog) return;
  if (!prog.mastered) {
    prog.mastered = true;
    prog.completedAt = Date.now();
    prog.nextReviewAt = Date.now() + REVIEW_INTERVALS[0];
    prog.reviewCount = 0;
  }
}

function advanceReview(state, lessonId) {
  const prog = state.lessons[lessonId];
  if (!prog) return;
  const nextIdx = Math.min(prog.reviewCount, REVIEW_INTERVALS.length - 1);
  prog.reviewCount++;
  prog.nextReviewAt = Date.now() + REVIEW_INTERVALS[nextIdx];
}

function getReviewDue(state) {
  const now = Date.now();
  return Object.entries(state.lessons)
    .filter(([, p]) => p.mastered && p.nextReviewAt && p.nextReviewAt <= now)
    .map(([id]) => id);
}

function overallProgress(state, phases) {
  if (!phases) return { done: 0, total: 0, pct: 0, mastered: 0 };
  const allLessons = phases.flatMap(ph => ph.lessons.filter(l => l.status !== 'stub'));
  const total = allLessons.length;
  const done = allLessons.filter(l => state.lessons[l.id]?.mastered).length;
  return {
    done,
    total,
    pct: total > 0 ? Math.round(100 * done / total) : 0,
    mastered: done,
  };
}

function getNextLesson(state, phases) {
  if (!phases) return null;
  // Find first non-mastered, non-stub lesson whose prerequisites are all mastered
  for (const phase of phases) {
    for (const lesson of phase.lessons) {
      if (lesson.status === 'stub') continue;
      if (state.lessons[lesson.id]?.mastered) continue;
      const prereqsMet = (lesson.prerequisites || []).every(
        pid => state.lessons[pid]?.mastered
      );
      if (prereqsMet) return lesson;
    }
  }
  return null; // all done
}

// ── Router ────────────────────────────────────────────────────────────────────
function parseRoute(hash) {
  const h = hash.replace(/^#\/?/, '');
  if (!h || h === 'home') return { page: 'home' };
  const parts = h.split('/');
  const page = parts[0];
  const id = parts[1] || null;
  const sub = parts[2] || null;
  return { page, id, sub };
}

// ── Export progress ───────────────────────────────────────────────────────────
function exportProgress(state, phases) {
  const data = {
    exported: new Date().toISOString(),
    progress: state.lessons,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `setconca-progress-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportNotes(state, phases) {
  if (!phases) return;
  let md = '# SetConCA Mastery — Research Notes\n\n';
  for (const phase of phases) {
    md += `## Phase ${phase.id}: ${phase.title}\n\n`;
    for (const lesson of phase.lessons) {
      const prog = state.lessons[lesson.id];
      if (!prog?.notes) continue;
      md += `### ${lesson.title}\n\n${prog.notes}\n\n`;
    }
  }
  const blob = new Blob([md], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `setconca-notes-${Date.now()}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Sidebar rendering ─────────────────────────────────────────────────────────
function renderSidebar(state, phases, route) {
  if (!phases) return;

  // Progress
  const prog = overallProgress(state, phases);
  document.getElementById('progressFill').style.width = prog.pct + '%';
  document.getElementById('pctText').textContent = prog.pct + '%';
  document.getElementById('lessonsStats').textContent = `${prog.done}/${prog.total} lessons`;
  document.getElementById('masteredStats').textContent = `${prog.mastered} mastered`;

  // Continue button
  const next = getNextLesson(state, phases);
  const continueLabel = document.getElementById('continueLabel');
  if (next) {
    continueLabel.textContent = `"${next.title.length > 35 ? next.title.slice(0, 35) + '…' : next.title}"`;
  } else {
    continueLabel.textContent = 'All lessons complete! 🎉';
  }

  // Review badge
  const reviewDue = getReviewDue(state);
  const reviewBadge = document.getElementById('reviewBadge');
  if (reviewDue.length > 0) {
    reviewBadge.classList.remove('hidden');
    document.getElementById('reviewCount').textContent = reviewDue.length;
  } else {
    reviewBadge.classList.add('hidden');
  }

  // Mode buttons
  document.getElementById('modeLearn').classList.toggle('active', state.mode === 'learning');
  document.getElementById('modeResearch').classList.toggle('active', state.mode === 'research');

  // Phase nav
  const navEl = document.getElementById('phaseNav');
  navEl.innerHTML = phases.map(phase => {
    const phLessons = phase.lessons.filter(l => l.status !== 'stub');
    const phDone = phLessons.filter(l => state.lessons[l.id]?.mastered).length;
    const isActive = route.page === 'phase' && parseInt(route.id) === phase.id
      || route.page === 'lesson' && phase.lessons.some(l => l.id === route.id);
    const isDone = phLessons.length > 0 && phDone === phLessons.length;

    // Find current lesson in this phase
    const currentInPhase = route.page === 'lesson' && phase.lessons.some(l => l.id === route.id);

    return `
      <div class="nav-phase">
        <button
          class="nav-phase-header ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}"
          onclick="app.togglePhaseNav(${phase.id})"
          aria-expanded="${isActive || currentInPhase}"
          id="phase-nav-${phase.id}"
        >
          <span style="display:flex;align-items:center;gap:0.5rem">
            <span class="phase-dot ${isDone ? 'done' : isActive ? 'active' : ''}"></span>
            <span style="font-size:0.67rem;opacity:0.6;font-family:var(--mono)">P${phase.id}</span>
            <span>${phase.shortTitle || phase.title}</span>
          </span>
          <span style="font-size:0.7rem;opacity:0.55">${phDone}/${phLessons.length}</span>
        </button>
        <div class="nav-lesson-list ${isActive || currentInPhase ? 'open' : ''}" id="phase-lessons-${phase.id}">
          ${phase.lessons.map(lesson => {
            const lDone = state.lessons[lesson.id]?.mastered;
            const lActive = route.id === lesson.id;
            const isStub = lesson.status === 'stub';
            return `
              <button
                class="nav-lesson-btn ${lActive ? 'active' : ''} ${lDone ? 'done' : ''}"
                onclick="app.navigate('/lesson/${lesson.id}')"
                ${isStub ? 'style="opacity:0.45"' : ''}
                title="${lesson.title}${isStub ? ' [In Progress]' : ''}"
              >
                <span class="lesson-dot ${lDone ? 'done' : lActive ? 'active' : ''}"></span>
                <span>${lesson.title.length > 32 ? lesson.title.slice(0,32) + '…' : lesson.title}</span>
                ${isStub ? '<span style="font-size:0.6rem;color:var(--yellow)">✦</span>' : ''}
              </button>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }).join('');
}

// ── App factory ───────────────────────────────────────────────────────────────
export function createApp() {
  let state = loadState();
  let phases = null;
  const renderer = createRenderer(state, cache, ensureLesson, ensurePhases, ensurePapers, ensureGlossary, ensureConcepts, ensureDependencies, ensureLessonNarratives, ensurePaperGuides);
  const vis = createVisualisations();

  // Apply saved settings immediately
  document.documentElement.dataset.fontsize = state.fontSize || 'md';
  if (state.mode === 'research') document.body.classList.add('research-mode');

  function persist() {
    saveState(state);
    if (phases) renderSidebar(state, phases, parseRoute(location.hash));
  }

  async function init() {
    try {
      phases = await ensurePhases();
      renderSidebar(state, phases, parseRoute(location.hash));
      await handleRoute();
    } catch (err) {
      document.getElementById('main').innerHTML = `
        <div class="card" style="border-color:var(--border-bad)">
          <h3 style="color:var(--red)">⚠️ Loading Error</h3>
          <p class="muted">Could not load curriculum data: ${err.message}</p>
          <p class="muted" style="margin-top:0.5rem">If running locally, open via a local server (e.g. <code>python -m http.server</code>)</p>
        </div>
      `;
    }
  }

  async function handleRoute() {
    if (!phases) {
      try {
        phases = await ensurePhases();
      } catch (e) {
        console.warn('Waiting for phases in handleRoute:', e);
      }
    }
    const route = parseRoute(location.hash);
    if (phases) renderSidebar(state, phases, route);

    const main = document.getElementById('main');
    try {
      main.innerHTML = '<div style="padding:2rem;color:var(--muted)">Loading…</div>';

      let html = '';
      if (route.page === 'home' || route.page === 'phase' && !route.id) {
        html = await renderer.renderHome(phases, state);
      } else if (route.page === 'phase') {
        html = await renderer.renderPhase(parseInt(route.id), phases, state);
      } else if (route.page === 'lesson') {
        const lessonData = await ensureLesson(route.id);
        html = await renderer.renderLesson(lessonData, phases, state);
      } else if (route.page === 'map') {
        html = await renderer.renderConceptMap(phases, state);
      } else if (route.page === 'library') {
        html = await renderer.renderLibrary(phases, state);
      } else if (route.page === 'glossary') {
        html = await renderer.renderGlossary(phases, state);
      } else if (route.page === 'search') {
        html = await renderer.renderSearch(phases, state);
      } else if (route.page === 'paper') {
        html = await renderer.renderPaper(route.id, phases, state);
      } else if (route.page === 'concept') {
        html = await renderer.renderConcept(route.id, phases, state);
      } else {
        html = await renderer.renderHome(phases, state);
      }

      main.innerHTML = html;

      // Mount interactive visualisation if needed
      const demoMount = document.getElementById('demoMount');
      if (demoMount) {
        const visId = demoMount.dataset.visual;
        if (visId) vis.mount(visId, demoMount);
      }

      // Set up all interactive elements
      setupInteractivity(route);

    } catch (err) {
      console.error('Render error:', err);
      main.innerHTML = `
        <div class="card" style="border-color:var(--border-bad)">
          <h3 style="color:var(--red)">⚠️ Render Error</h3>
          <p class="muted">${err.message}</p>
        </div>
      `;
    }
  }

  function navigate(path) {
    const hash = '#' + path;
    if (location.hash !== hash) {
      history.pushState(null, '', hash);
      handleRoute();
    }
  }

  function setupInteractivity(route) {
    // Disclosure panels
    document.querySelectorAll('.disclosure-header').forEach(btn => {
      btn.addEventListener('click', () => {
        const body = btn.nextElementSibling;
        const isOpen = btn.classList.contains('open');
        btn.classList.toggle('open', !isOpen);
        body.style.display = isOpen ? 'none' : 'block';

        // Track section viewed for mastery
        const sectionKey = btn.dataset.section;
        const lessonId = btn.dataset.lesson;
        if (sectionKey && lessonId) {
          const prog = initLesson(state, lessonId);
          prog.sectionsViewed.add(sectionKey);
          persist();
          updateMasteryGate(lessonId);
        }
      });

      // Restore open state from saved disclosures
      const discKey = btn.dataset.discKey;
      if (discKey && state.disclosures[discKey]) {
        btn.classList.add('open');
        const body = btn.nextElementSibling;
        if (body) body.style.display = 'block';
      }
    });

    // Exercise reveal buttons
    document.querySelectorAll('[data-reveal-target]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.revealTarget);
        if (target) {
          target.classList.add('shown');
          btn.disabled = true;
          btn.textContent = '✓ Revealed';

          const lessonId = btn.dataset.lesson;
          if (lessonId) {
            const prog = initLesson(state, lessonId);
            prog.exerciseCompleted = true;
            persist();
            updateMasteryGate(lessonId);
          }
        }
      });
    });

    // Quiz options
    document.querySelectorAll('[data-quiz-opt]').forEach(btn => {
      btn.addEventListener('click', () => handleQuizAnswer(btn));
    });

    // Mastery text areas (autosave)
    document.querySelectorAll('[data-mastery-save]').forEach(ta => {
      ta.addEventListener('input', () => {
        const lessonId = ta.dataset.lesson;
        const fieldKey = ta.dataset.field;
        if (lessonId) {
          const prog = initLesson(state, lessonId);
          if (fieldKey === 'notes') prog.notes = ta.value;
          else if (fieldKey === 'written') {
            prog.writtenExplanation = ta.value;
            if (ta.value.trim().length > 30) {
              prog.masteryQuestionAnswered = true;
              updateMasteryGate(lessonId);
            }
          }
          persist();
        }
      });

      // Restore saved value
      const lessonId = ta.dataset.lesson;
      const fieldKey = ta.dataset.field;
      if (lessonId && state.lessons[lessonId]) {
        const prog = state.lessons[lessonId];
        if (fieldKey === 'notes') ta.value = prog.notes || '';
        else if (fieldKey === 'written') ta.value = prog.writtenExplanation || '';
      }
    });

    // Research worksheet fields
    document.querySelectorAll('[data-worksheet-save]').forEach(ta => {
      ta.addEventListener('input', () => {
        const key = ta.dataset.worksheetKey;
        if (key) {
          state.worksheets[key] = ta.value;
          persist();
        }
      });
      const key = ta.dataset.worksheetKey;
      if (key && state.worksheets[key]) ta.value = state.worksheets[key];
    });

    // Phase nav toggle buttons (already inline in sidebar HTML)
    // Concept map
    const mapCanvas = document.getElementById('conceptMapCanvas');
    if (mapCanvas) setupConceptMap(mapCanvas);
  }

  function handleQuizAnswer(btn) {
    const lessonId = btn.dataset.lesson;
    const qi = parseInt(btn.dataset.qi);
    const chosen = parseInt(btn.dataset.qi);
    const correct = parseInt(btn.dataset.correct);
    const isCorrect = parseInt(btn.dataset.chosen) === correct;

    const container = btn.closest('[data-quiz-container]');
    if (!container) return;

    container.querySelectorAll('[data-quiz-opt]').forEach((b, j) => {
      b.disabled = true;
      if (j === correct) b.classList.add('correct');
      else if (b === btn) b.classList.add('wrong');
    });

    const feedbackEl = document.getElementById(`quiz-feedback-${lessonId}-${qi}`);
    if (feedbackEl) {
      feedbackEl.classList.remove('hidden');
      feedbackEl.style.display = 'block';
    }

    if (lessonId) {
      const prog = initLesson(state, lessonId);
      prog.quizAttempts++;
      const correctCount = container.querySelectorAll('.correct').length;
      const totalQ = container.querySelectorAll('[data-quiz-container]').length;
      // Update score
      if (isCorrect) {
        prog.quizScore = Math.min(1, prog.quizScore + (1 / Math.max(totalQ, 1)));
      }
      persist();
      updateMasteryGate(lessonId);
    }
  }

  function updateMasteryGate(lessonId) {
    const gateEl = document.getElementById(`mastery-gate-${lessonId}`);
    if (!gateEl) return;

    const prog = state.lessons[lessonId];
    if (!prog) return;

    // Check each mastery requirement
    const checks = gateEl.querySelectorAll('[data-mastery-check]');
    checks.forEach(check => {
      const requirement = check.dataset.masteryCheck;
      let met = false;
      if (requirement === 'sections') {
        met = (prog.sectionsViewed?.size || 0) >= parseInt(check.dataset.required || 3);
      } else if (requirement === 'exercise') {
        met = prog.exerciseCompleted;
      } else if (requirement === 'quiz') {
        met = prog.quizScore >= 0.6;
      } else if (requirement === 'written') {
        met = prog.masteryQuestionAnswered;
      }
      check.classList.toggle('met', met);
    });

    // Check if fully mastered
    const allMet = [...checks].every(c => c.classList.contains('met'));
    const markBtn = document.getElementById(`mark-mastered-${lessonId}`);
    if (markBtn) {
      markBtn.disabled = !allMet;
      if (allMet && !prog.mastered) {
        markBtn.classList.remove('btn-secondary');
        markBtn.classList.add('btn-primary');
      }
    }
  }

  function setupConceptMap(canvas) {
    // Concept map setup is handled by visualisations.js
    vis.mount('concept-map', canvas.parentElement);
  }

  // ── Public API ──────────────────────────────────────────────────────────────
  const api = {
    continueLearning() {
      if (!phases) return;
      const next = getNextLesson(state, phases);
      if (next) navigate(`/lesson/${next.id}`);
      else navigate('/home');
    },

    navigate,

    handleRoute,

    setMode(mode) {
      state.mode = mode;
      document.body.classList.toggle('research-mode', mode === 'research');
      document.getElementById('modeLearn').classList.toggle('active', mode === 'learning');
      document.getElementById('modeResearch').classList.toggle('active', mode === 'research');
      document.getElementById('modeLearn').setAttribute('aria-pressed', mode === 'learning');
      document.getElementById('modeResearch').setAttribute('aria-pressed', mode === 'research');
      persist();
    },

    setFontSize(size) {
      state.fontSize = size;
      document.documentElement.dataset.fontsize = size;
      persist();
    },

    togglePhaseNav(phaseId) {
      const listEl = document.getElementById(`phase-lessons-${phaseId}`);
      const headerEl = document.getElementById(`phase-nav-${phaseId}`);
      if (listEl) {
        const isOpen = listEl.classList.contains('open');
        listEl.classList.toggle('open', !isOpen);
        if (headerEl) headerEl.setAttribute('aria-expanded', String(!isOpen));
      }
    },

    markLessonMastered(lessonId) {
      initLesson(state, lessonId);
      markLessonMastered(state, lessonId);
      persist();
      // Navigate to next
      const next = getNextLesson(state, phases);
      if (next) {
        setTimeout(() => navigate(`/lesson/${next.id}`), 300);
      }
    },

    markSectionViewed(lessonId, sectionKey) {
      initLesson(state, lessonId);
      state.lessons[lessonId].sectionsViewed.add(sectionKey);
      persist();
    },

    submitConfidence(lessonId, when, value) {
      initLesson(state, lessonId);
      if (when === 'before') state.lessons[lessonId].confidenceBefore = value;
      else state.lessons[lessonId].confidenceAfter = value;
      persist();
    },

    advanceReview(lessonId) {
      advanceReview(state, lessonId);
      persist();
    },

    exportProgress() { exportProgress(state, phases); },
    exportNotes() { exportNotes(state, phases); },

    resetProgress() {
      if (confirm('Clear all course progress? This cannot be undone.')) {
        state = defaultState();
        persist();
        handleRoute();
      }
    },

    // Called by renderer for inline interactions
    revealExercise(revealId, lessonId) {
      const el = document.getElementById(revealId);
      if (el) el.classList.add('shown');
      if (lessonId) {
        initLesson(state, lessonId);
        state.lessons[lessonId].exerciseCompleted = true;
        persist();
        updateMasteryGate(lessonId);
      }
    },

    // State accessor for renderer
    getState: () => state,
    getPhases: () => phases,

    init,
  };

  // Kickoff initialization on creation
  init();

  return api;
}

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
  if (window.app) window.app.init();
});
