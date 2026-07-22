/**
 * SetConCA Mastery — Renderer
 * Renders all pages from curriculum data
 */

// ── Helpers ───────────────────────────────────────────────────────────────────
function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Apply glossary hover tooltips to HTML
function applyGlossaryHighlights(html, glossary) {
  if (!glossary) return html;
  // Replace known terms with tooltip spans
  glossary.forEach(term => {
    if (!term.inlineHighlight) return;
    const re = new RegExp(`\\b(${escapeRegex(term.term)})\\b`, 'g');
    html = html.replace(re,
      `<span class="gl-term" data-def="${esc(term.oneSentence)}" onclick="app.navigate('/glossary')" tabindex="0">$1</span>`
    );
  });
  return html;
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Claim type → badge class + label
const CLAIM_STYLES = {
  definition:          { cls: 'claim-definition',      label: '[Definition]' },
  mathematical_result: { cls: 'claim-mathematical',    label: '[Mathematical Result]' },
  paper_finding:       { cls: 'claim-paper-finding',   label: '[Paper Finding]' },
  course_interpretation:{ cls: 'claim-interpretation', label: '[Course Interpretation]' },
  hypothesis:          { cls: 'claim-hypothesis',      label: '[Hypothesis]' },
  warning:             { cls: 'claim-warning',         label: '[Warning]' },
  toy_example:         { cls: 'claim-toy-example',     label: '[Toy Example]' },
};

function claimBadge(type) {
  const style = CLAIM_STYLES[type] || CLAIM_STYLES.course_interpretation;
  return `<span class="claim-label ${style.cls}">${style.label}</span>`;
}

function sourceBadge(sourceId) {
  if (!sourceId) return '';
  return `<a href="#/paper/${sourceId}" onclick="app.navigate('/paper/${sourceId}')" style="font-size:0.75rem; color:var(--dim); font-family:var(--mono); text-decoration:none; border-bottom:1px dashed var(--dim)">[${sourceId}]</a>`;
}

// ── Section renderers ─────────────────────────────────────────────────────────

function renderDisclosure(id, title, icon, content, layerClass, sectionKey, lessonId, defaultOpen = false) {
  // Lessons are written as a continuous explanation. Panels remain collapsible
  // for reference, but they start open so the learner does not have to assemble
  // the argument by clicking through disconnected cards.
  const isOpen = true;
  return `
    <div class="disclosure ${layerClass}" style="margin-bottom:0.65rem">
      <button class="disclosure-header ${isOpen ? 'open' : ''}"
        data-section="${sectionKey || ''}"
        data-lesson="${lessonId || ''}"
        data-disc-key="${lessonId}-${sectionKey}"
        aria-expanded="${isOpen}"
      >
        <span>${icon} ${title}</span>
        <span class="disclosure-icon">▶</span>
      </button>
      <div class="disclosure-body" style="display:${isOpen ? 'block' : 'none'}">
        ${content}
      </div>
    </div>
  `;
}

function renderIntuitionSection(intuition, lessonId) {
  if (!intuition) return '';
  const content = `
    <div style="margin-bottom:0.85rem">
      <div class="badge badge-blue" style="margin-bottom:0.5rem">Analogy</div>
      <p class="intuition-analogy">${esc(intuition.analogy)}</p>
    </div>
    ${intuition.analogyLimit ? `
      <div class="callout warn" style="margin-top:0.65rem">
        <strong>Where this analogy breaks down:</strong> ${esc(intuition.analogyLimit)}
      </div>` : ''}
    ${intuition.text ? `<p style="margin-top:0.75rem">${esc(intuition.text)}</p>` : ''}
  `;
  return renderDisclosure(
    `int-${lessonId}`, 'Intuition — what is this, in plain language?', '💡',
    content, 'layer-intuition', 'intuition', lessonId, true
  );
}

function renderToyExampleSection(toyExample, lessonId) {
  if (!toyExample) return '';
  const stepsHtml = (toyExample.steps || []).map((step, i) => `
    <div class="math-step">
      <div class="math-step-num">${i + 1}</div>
      <div style="flex:1">
        <div style="font-weight:600; font-size:0.9rem; color:var(--green); margin-bottom:0.2rem">${esc(step.action)}</div>
        <div style="font-size:0.87rem; color:#cbd5e1; margin-bottom:0.2rem">${esc(step.result)}</div>
        ${step.insight ? `<div style="font-size:0.82rem; color:var(--yellow); font-style:italic">💡 ${esc(step.insight)}</div>` : ''}
      </div>
    </div>
  `).join('');
  const content = `
    <p style="margin-bottom:0.85rem; color:var(--muted)">${esc(toyExample.description)}</p>
    ${stepsHtml}
  `;
  return renderDisclosure(
    `toy-${lessonId}`, 'Concrete example — walk through it step by step', '🔢',
    content, 'layer-example', 'toyExample', lessonId
  );
}

function renderVisualSection(visual, lessonId) {
  if (!visual) return '';
  const content = `
    <div class="demo-question">${esc(visual.question)}</div>
    <div class="demo-container" style="margin:0">
      <div id="demoMount" data-visual="${esc(visual.id || '')}">
        <div style="height:260px; display:flex; align-items:center; justify-content:center; color:var(--dim)">Loading visualisation…</div>
      </div>
    </div>
    <p class="muted" style="margin-top:0.65rem; font-size:0.82rem">🎮 ${esc(visual.description)}</p>
  `;
  return renderDisclosure(
    `vis-${lessonId}`, 'Interactive visual — experiment with parameters', '🎮',
    content, 'layer-visual', 'visual', lessonId
  );
}

function renderTechnicalSection(technical, lessonId) {
  if (!technical) return '';
  const defsHtml = (technical.definitions || []).map(d => `
    <div style="display:flex; gap:0.75rem; padding:0.4rem 0; border-bottom:1px solid var(--border)">
      <span style="font-family:var(--mono); color:var(--blue); font-size:0.87rem; min-width:120px; flex-shrink:0">${esc(d.term)}</span>
      <span style="color:#cbd5e1; font-size:0.87rem">${esc(d.definition)}</span>
    </div>
  `).join('');
  const content = `
    ${technical.text ? `<p style="margin-bottom:0.85rem">${esc(technical.text)}</p>` : ''}
    ${defsHtml ? `<div style="margin-top:0.5rem">${defsHtml}</div>` : ''}
  `;
  return renderDisclosure(
    `tech-${lessonId}`, 'Technical foundations — precise definitions', '⚙️',
    content, 'layer-technical', 'technical', lessonId
  );
}

function renderMathSection(mathematics, lessonId) {
  if (!mathematics || mathematics.length === 0) return '';
  const equationsHtml = mathematics.map((eq, i) => `
    <div class="math-block" style="margin-bottom:1rem">
      <div class="math-label">${esc(eq.label)}</div>
      <div class="math-display">$$${eq.latex || ''}$$</div>

      ${eq.symbols && Object.keys(eq.symbols).length > 0 ? `
        <table class="math-symbol-table">
          <tbody>
            ${Object.entries(eq.symbols).map(([sym, def]) => `
              <tr>
                <td>$${sym}$</td>
                <td>${esc(def)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : ''}

      <div style="margin-top:0.85rem; display:flex; flex-direction:column; gap:0.5rem">
        ${eq.plainExplanation ? renderMathField('In plain language', eq.plainExplanation, '#cbd5e1') : ''}
        ${eq.whyNeeded ? renderMathField('Why this term is needed', eq.whyNeeded, 'var(--yellow)') : ''}
        ${eq.ifRemoved ? renderMathField('If this term were removed', eq.ifRemoved, 'var(--red)') : ''}
        ${eq.encourages ? renderMathField('What this equation encourages', eq.encourages, 'var(--green)') : ''}
        ${eq.doesNotGuarantee ? renderMathField('What it does NOT guarantee', eq.doesNotGuarantee, 'var(--muted)') : ''}
      </div>
    </div>
  `).join('');

  return renderDisclosure(
    `math-${lessonId}`, 'Mathematics — step by step, every symbol explained', '∑',
    equationsHtml, 'layer-math', 'mathematics', lessonId
  );
}

function renderMathField(label, text, color) {
  return `
    <div style="display:flex; gap:0.65rem; align-items:flex-start; font-size:0.87rem">
      <span style="font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; font-family:var(--mono); color:${color}; min-width:150px; padding-top:0.1rem; flex-shrink:0">${label}</span>
      <span style="color:#cbd5e1">${esc(text)}</span>
    </div>
  `;
}

function renderComparisonSection(methodComparison, lessonId) {
  if (!methodComparison || methodComparison.length === 0) return '';
  const tablesHtml = methodComparison.map(comp => `
    <div style="margin-bottom:1.1rem">
      <div style="font-weight:600; font-size:0.9rem; color:var(--text); margin-bottom:0.6rem">❓ ${esc(comp.question)}</div>
      <table class="comparison-table">
        <thead>
          <tr>
            <th>Method</th>
            <th>Answer</th>
          </tr>
        </thead>
        <tbody>
          ${(comp.methods || []).map(m => `
            <tr>
              <td style="font-family:var(--mono); color:var(--blue)">${esc(m.name)}</td>
              <td>${esc(m.answer)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      ${comp.practicalImplication ? `
        <div class="callout" style="margin-top:0.5rem">
          <strong>Practical implication:</strong> ${esc(comp.practicalImplication)}
        </div>
      ` : ''}
    </div>
  `).join('');
  return renderDisclosure(
    `comp-${lessonId}`, 'Compare nearby methods — why this one exists', '📊',
    tablesHtml, 'layer-evidence', 'comparison', lessonId
  );
}

function renderEvidenceSection(evidence, lessonId) {
  if (!evidence || evidence.length === 0) return '';
  const claimsHtml = evidence.map(ev => `
    <div class="source-block" style="margin-bottom:0.5rem">
      <div class="source-claim">
        ${claimBadge(ev.claimType)}
        ${esc(ev.claim)}
        ${sourceBadge(ev.sourceId)}
      </div>
      ${ev.paraphrase ? `<div style="font-size:0.82rem; color:var(--muted); margin-top:0.3rem; font-style:italic">${esc(ev.paraphrase)}</div>` : ''}
      ${ev.section ? `<div class="source-meta">§${esc(ev.section)}</div>` : ''}
    </div>
  `).join('');
  return renderDisclosure(
    `ev-${lessonId}`, 'What the evidence supports — and does not', '📋',
    claimsHtml, 'layer-evidence', 'evidence', lessonId
  );
}

function renderFailureSection(failureModes, lessonId) {
  if (!failureModes || failureModes.length === 0) return '';
  const failuresHtml = failureModes.map(f => `
    <div class="failure-block" style="margin-bottom:0.75rem">
      <div class="failure-name">⚠️ ${esc(f.name)}</div>
      ${f.mechanism ? `<div class="failure-row"><span class="failure-row-label" style="color:var(--red)">Mechanism</span><span style="color:#cbd5e1">${esc(f.mechanism)}</span></div>` : ''}
      ${f.symptom ? `<div class="failure-row"><span class="failure-row-label" style="color:var(--yellow)">Symptom</span><span style="color:#cbd5e1">${esc(f.symptom)}</span></div>` : ''}
      ${f.diagnosticTest ? `<div class="failure-row"><span class="failure-row-label" style="color:var(--blue)">Diagnostic test</span><span style="color:#cbd5e1">${esc(f.diagnosticTest)}</span></div>` : ''}
      ${f.mitigation ? `<div class="failure-row"><span class="failure-row-label" style="color:var(--green)">Possible mitigation</span><span style="color:#cbd5e1">${esc(f.mitigation)}</span></div>` : ''}
      ${f.setconcaRelevance ? `<div class="failure-row"><span class="failure-row-label" style="color:var(--purple)">SetConCA relevance</span><span style="color:#cbd5e1">${esc(f.setconcaRelevance)}</span></div>` : ''}
    </div>
  `).join('');
  return renderDisclosure(
    `fail-${lessonId}`, 'Failure modes — when this breaks down', '🔴',
    failuresHtml, 'layer-failure', 'failureModes', lessonId
  );
}

function renderSetConCASection(setconcaConnection, lessonId) {
  if (!setconcaConnection) return '';
  const fields = [
    { key: 'relevance', label: 'Why it matters for SetConCA' },
    { key: 'whichPart', label: 'Which part of SetConCA it affects' },
    { key: 'whichDesignChoice', label: 'Which design choice it informs' },
    { key: 'whichFailureExplained', label: 'Which failure it may explain' },
    { key: 'proposedExperiment', label: 'Experiment to test it' },
    { key: 'alternativeExplanation', label: 'Alternative explanation to rule out' },
  ];
  const fieldsHtml = fields.map(f => setconcaConnection[f.key] ? `
    <div class="setconca-row">
      <span class="setconca-row-label">${esc(f.label)}</span>
      <span style="color:#cbd5e1; font-size:0.87rem">${esc(setconcaConnection[f.key])}</span>
    </div>
  ` : '').join('');

  const content = `
    <div class="setconca-block" style="margin:0">
      <div class="setconca-title">🔬 SetConCA Research Connection</div>
      ${fieldsHtml}
    </div>
  `;
  return renderDisclosure(
    `sc-${lessonId}`, 'SetConCA connection — why this matters for your research', '🔬',
    content, 'layer-setconca', 'setconca', lessonId
  );
}

function renderExercisesSection(exercises, lessonId) {
  if (!exercises || exercises.length === 0) return '';
  const exercisesHtml = exercises.map((ex, i) => `
    <div class="exercise-block">
      <div class="exercise-type">${esc(ex.type === 'prediction' ? '🎯 Predict the outcome' : ex.type === 'construct' ? '🔧 Construct an example' : '🔍 Diagnose the failure')}</div>
      <p style="font-weight:600; margin-bottom:0.75rem">${esc(ex.prompt)}</p>
      <button
        class="btn-secondary"
        data-reveal-target="reveal-${lessonId}-${i}"
        data-lesson="${lessonId}"
        onclick="app.revealExercise('reveal-${lessonId}-${i}', '${lessonId}')"
      >
        Reveal answer
      </button>
      <div class="exercise-reveal" id="reveal-${lessonId}-${i}">
        ✓ ${esc(ex.reveal)}
      </div>
    </div>
  `).join('');
  return renderDisclosure(
    `ex-${lessonId}`, 'Active exercise — make a prediction before revealing', '🎯',
    exercisesHtml, 'layer-intuition', 'exercises', lessonId
  );
}

function renderMasterySection(masteryQuestions, lessonId) {
  if (!masteryQuestions || masteryQuestions.length === 0) return '';
  const questionsHtml = masteryQuestions.map((q, i) => `
    <div class="mastery-question" style="margin-bottom:0.85rem">
      <div style="margin-bottom:0.3rem">
        ${q.badVersion ? `<div class="callout bad" style="font-size:0.83rem; margin-bottom:0.5rem"><strong>Bad version (tests memorisation):</strong> ${esc(q.badVersion)}</div>` : ''}
        ${q.goodVersion ? `<div class="callout ok" style="font-size:0.83rem; margin-bottom:0.65rem"><strong>Better version (tests reasoning):</strong> ${esc(q.goodVersion || q.prompt)}</div>` : ''}
        <p style="font-weight:600">${esc(q.prompt)}</p>
      </div>
      <textarea
        class="mastery-textarea"
        placeholder="Write your answer here…"
        data-mastery-save
        data-lesson="${lessonId}"
        data-field="written"
        aria-label="Answer to mastery question"
      ></textarea>
      ${q.rubric && q.rubric.length > 0 ? `
        <details style="margin-top:0.5rem">
          <summary style="font-size:0.83rem; color:var(--muted); cursor:pointer">Show rubric</summary>
          <ul style="margin-top:0.4rem; padding-left:1.2rem">
            ${q.rubric.map(r => `<li style="font-size:0.85rem; color:var(--muted); margin:0.2rem 0">${esc(r)}</li>`).join('')}
          </ul>
        </details>
      ` : ''}
    </div>
  `).join('');

  const content = `
    ${questionsHtml}
    <div style="margin-top:0.5rem">
      <textarea
        class="mastery-textarea"
        placeholder="Research notes for this lesson (saved automatically)…"
        data-mastery-save
        data-lesson="${lessonId}"
        data-field="notes"
        aria-label="Research notes"
        style="min-height:60px; border-color:var(--border-purple)"
      ></textarea>
    </div>
  `;
  return renderDisclosure(
    `mq-${lessonId}`, 'Mastery check — test your understanding', '🧠',
    content, 'layer-setconca', 'masteryQuestion', lessonId
  );
}

function renderResearchWorksheet(worksheet, lessonId) {
  if (!worksheet) return '';
  const fields = [
    { key: 'claim', label: 'Research claim' },
    { key: 'requiredAssumptions', label: 'Required assumptions' },
    { key: 'evidenceProvided', label: 'Evidence provided' },
    { key: 'strongestAlternativeExplanation', label: 'Strongest alternative explanation' },
    { key: 'missingControl', label: 'Missing control' },
    { key: 'closestBaseline', label: 'Closest baseline' },
    { key: 'falsifyingResult', label: 'What result would falsify this?' },
    { key: 'setconcaImplication', label: 'SetConCA implication' },
    { key: 'proposedExperiment', label: 'Proposed experiment' },
  ];
  const content = `
    <div class="worksheet">
      <div class="worksheet-title">🔬 Research Mode Worksheet</div>
      ${fields.map(f => `
        <div class="worksheet-field">
          <div class="worksheet-label">${esc(f.label)}</div>
          <div style="font-size:0.82rem; color:var(--purple); margin-bottom:0.3rem; font-style:italic">${esc(worksheet[f.key] || '')}</div>
          <textarea
            class="worksheet-input"
            placeholder="Your notes…"
            data-worksheet-save
            data-worksheet-key="${lessonId}-${f.key}"
            rows="2"
            aria-label="${esc(f.label)}"
          ></textarea>
        </div>
      `).join('')}
    </div>
  `;
  return `<div class="research-mode-only" style="margin-top:1rem">${content}</div>`;
}

function renderMasteryGate(lessonData, state) {
  const id = lessonData.id;
  const prog = state?.lessons?.[id];
  const hasExercise = (lessonData.sections.exercises || []).length > 0;
  const hasQuiz = (lessonData.sections.masteryQuestions || []).length > 0;
  const isMastered = prog?.mastered;

  const checks = [
    { req: 'sections', required: 3, label: 'Read core sections (intuition, technical, mathematics)' },
    hasExercise && { req: 'exercise', label: 'Complete the active exercise' },
    hasQuiz && { req: 'quiz', label: 'Score ≥ 60% on mastery questions' },
    hasQuiz && { req: 'written', label: 'Write a reasoned explanation' },
  ].filter(Boolean);

  return `
    <div id="mastery-gate-${id}" class="mastery-gate" style="margin-top:1.5rem">
      <div class="mastery-gate-title">
        ${isMastered ? '✅ Lesson Mastered' : '📋 Mastery Requirements'}
      </div>
      <ul class="mastery-checklist" style="list-style:none; margin:0.5rem 0">
        ${checks.map(c => `
          <li data-mastery-check="${c.req}" ${c.required ? `data-required="${c.required}"` : ''}
              class="${prog && checkProgRequirement(prog, c) ? 'met' : ''}">
            ${esc(c.label)}
          </li>
        `).join('')}
      </ul>
      <div class="actions" style="margin-top:1rem">
        <button
          class="btn-${isMastered ? 'secondary' : 'secondary'}"
          id="mark-mastered-${id}"
          onclick="app.markLessonMastered('${id}')"
          ${isMastered ? '' : 'disabled'}
        >
          ${isMastered ? '✅ Mastered — review again' : 'Mark as mastered'}
        </button>
      </div>
    </div>
  `;
}

function checkProgRequirement(prog, check) {
  if (check.req === 'sections') return (prog.sectionsViewed?.size || 0) >= (check.required || 3);
  if (check.req === 'exercise') return prog.exerciseCompleted;
  if (check.req === 'quiz') return prog.quizScore >= 0.6;
  if (check.req === 'written') return prog.masteryQuestionAnswered;
  return false;
}

// ── Page renderers ────────────────────────────────────────────────────────────

export function createRenderer(stateRef, cache, ensureLesson, ensurePhases, ensurePapers, ensureGlossary, ensureConcepts, ensureDependencies, ensureLessonNarratives) {

  async function renderHome(phases, state) {
    if (!phases) return '<p class="muted">Loading…</p>';
    const prog = getProgress(state, phases);

    const phaseCards = phases.map(phase => {
      const phLessons = phase.lessons.filter(l => l.status !== 'stub');
      const phDone = phLessons.filter(l => state.lessons[l.id]?.mastered).length;
      const isComplete = phLessons.length > 0 && phDone === phLessons.length;

      return `
        <div class="phase-card ${isComplete ? 'done' : ''}"
             onclick="app.navigate('/phase/${phase.id}')"
             role="button" tabindex="0"
             onkeydown="if(event.key==='Enter')app.navigate('/phase/${phase.id}')">
          <div class="phase-num-badge ${isComplete ? 'done' : ''}">${phase.id}</div>
          <div style="flex:1">
            <div style="font-weight:700; font-size:0.97rem; margin-bottom:0.2rem">
              ${esc(phase.title)}
            </div>
            <div class="muted" style="font-size:0.83rem; margin-bottom:0.5rem">${esc(phase.description || '')}</div>
            <div class="phase-progress">
              <div style="display:flex; justify-content:space-between; font-size:0.72rem; color:var(--dim); margin-bottom:0.3rem">
                <span>${phDone}/${phLessons.length} lessons</span>
                <span>${phLessons.length > 0 ? Math.round(100*phDone/phLessons.length) : 0}%</span>
              </div>
              <div class="progress-bar" style="height:3px">
                <div class="progress-fill" style="width:${phLessons.length > 0 ? 100*phDone/phLessons.length : 0}%"></div>
              </div>
            </div>
          </div>
          <div style="color:var(--dim); font-size:1rem; align-self:center">→</div>
        </div>
      `;
    }).join('');

    return `
      <div style="margin-bottom:0.5rem">
        <span class="badge badge-blue">Research Apprenticeship</span>
        <span class="badge badge-dim" style="margin-left:0.35rem">11 Phases · ${prog.total} Lessons</span>
      </div>
      <h1 style="margin-bottom:0.5rem">SetConCA Mastery</h1>
      <p style="font-size:1.05rem; color:var(--muted); margin-bottom:1.5rem; max-width:640px">
        A concept-driven textbook that teaches representation learning, sparse autoencoders, and multi-view learning from first principles — and connects every idea to SetConCA research.
      </p>

      <div class="card" style="margin-bottom:1.5rem; border-color:var(--border-accent)">
        <h3 style="margin-bottom:0.5rem">How this works</h3>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.65rem">
          ${[
            ['💡', 'Intuition first', 'Every concept starts with a plain-language analogy before any mathematics.'],
            ['🔢', 'Concrete examples', 'You work through small numerical examples before seeing the general theory.'],
            ['🎮', 'Interactive visuals', 'Each concept has a unique visualisation you can manipulate in real time.'],
            ['∑', 'Math explained', 'Every equation has every symbol defined and every term\'s purpose explained.'],
            ['📋', 'Honest claims', 'Every statement is labelled: Definition / Finding / Hypothesis / Warning.'],
            ['🔬', 'SetConCA link', 'Every lesson connects explicitly to SetConCA research questions.'],
          ].map(([icon, title, text]) => `
            <div style="display:flex; gap:0.6rem; align-items:flex-start">
              <span style="font-size:1.1rem; flex-shrink:0">${icon}</span>
              <div>
                <div style="font-weight:700; font-size:0.88rem; color:var(--text); margin-bottom:0.15rem">${title}</div>
                <div style="font-size:0.82rem; color:var(--muted)">${esc(text)}</div>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="actions" style="margin-top:1rem">
          <button class="btn-primary" onclick="app.continueLearning()">Begin learning →</button>
          <button class="btn-ghost" onclick="app.navigate('/map')">🗺️ View concept map</button>
        </div>
      </div>

      <h2 style="margin-bottom:0.85rem">Course Roadmap</h2>
      ${phaseCards}

      <div style="display:flex; gap:0.75rem; margin-top:1.25rem; flex-wrap:wrap">
        <button class="btn-ghost" onclick="app.navigate('/library')">📚 Research Library</button>
        <button class="btn-ghost" onclick="app.navigate('/glossary')">📖 Glossary</button>
        <button class="btn-ghost" onclick="app.exportNotes()">↓ Export notes</button>
      </div>
    `;
  }

  async function renderPhase(phaseId, phases, state) {
    const phase = phases.find(p => p.id === phaseId);
    if (!phase) return '<p class="muted">Phase not found.</p>';

    const lessons = phase.lessons;
    const phLessons = lessons.filter(l => l.status !== 'stub');
    const phDone = phLessons.filter(l => state.lessons[l.id]?.mastered).length;

    const lessonItems = lessons.map((lesson, i) => {
      const isDone = state.lessons[lesson.id]?.mastered;
      const isStub = lesson.status === 'stub';
      const prereqsMet = (lesson.prerequisites || []).every(pid => state.lessons[pid]?.mastered);
      const isLocked = !prereqsMet && !isDone;

      return `
        <div class="lesson-item ${isDone ? 'done' : ''} ${isLocked ? 'locked' : ''} ${isStub ? 'stub' : ''}"
             onclick="${isLocked ? '' : `app.navigate('/lesson/${lesson.id}')`}"
             role="${isLocked ? 'listitem' : 'button'}"
             tabindex="${isLocked ? '-1' : '0'}"
             onkeydown="if(event.key==='Enter' && !${isLocked})app.navigate('/lesson/${lesson.id}')">
          <span>
            <span style="color:var(--dim); font-family:var(--mono); font-size:0.72rem; margin-right:0.4rem">${String(i+1).padStart(2,'0')}</span>
            <strong>${esc(lesson.title)}</strong>
            ${isStub ? '<span class="badge badge-yellow" style="margin-left:0.4rem">In progress</span>' : ''}
          </span>
          <span style="display:flex; align-items:center; gap:0.5rem; flex-shrink:0">
            ${isDone ? '<span style="color:var(--green)">✓</span>' : ''}
            ${isLocked ? '<span style="color:var(--dim); font-size:0.8rem">🔒</span>' : ''}
            <span class="muted" style="font-size:0.78rem">${lesson.estimatedMinutes || '?'} min</span>
          </span>
        </div>
      `;
    }).join('');

    return `
      <button class="btn-ghost" onclick="app.navigate('/home')" style="margin-bottom:1rem">← Course Roadmap</button>

      <div style="margin-bottom:0.5rem">
        <span class="badge badge-blue">Phase ${phase.id}</span>
        ${phDone === phLessons.length && phLessons.length > 0 ? '<span class="badge badge-green" style="margin-left:0.4rem">Complete ✓</span>' : ''}
      </div>
      <h1 style="margin-bottom:0.5rem">${esc(phase.title)}</h1>
      <p class="muted" style="margin-bottom:1.25rem">${esc(phase.description || '')}</p>

      ${(phase.teachingStory || []).length ? `
        <article class="card" style="margin-bottom:1.25rem">
          <div style="font-size:0.73rem; font-weight:700; text-transform:uppercase; letter-spacing:0.07em; color:var(--blue); margin-bottom:0.75rem; font-family:var(--mono)">Read this first: the story of the phase</div>
          ${(phase.teachingStory || []).map(paragraph => `<p style="margin:0 0 0.9rem; color:#d6deeb">${esc(paragraph)}</p>`).join('')}
        </article>
      ` : ''}

      ${phase.checkpoint ? `
        <div class="callout purple" style="margin-bottom:1.25rem">
          <strong>Phase checkpoint:</strong> ${esc(phase.checkpoint)}
        </div>
      ` : ''}

      <div style="margin-bottom:1.25rem">
        <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:var(--muted); margin-bottom:0.4rem">
          <span>${phDone}/${phLessons.length} lessons mastered</span>
          <span>${phLessons.length > 0 ? Math.round(100*phDone/phLessons.length) : 0}%</span>
        </div>
        <div class="progress-bar"><div class="progress-fill" style="width:${phLessons.length > 0 ? 100*phDone/phLessons.length : 0}%"></div></div>
      </div>

      <div role="list">${lessonItems}</div>

      <div class="actions">
        ${phaseId > 0 ? `<button class="btn-secondary" onclick="app.navigate('/phase/${phaseId - 1}')">← Phase ${phaseId - 1}</button>` : '<span></span>'}
        <button class="btn-primary" onclick="app.continueLearning()">Continue learning →</button>
      </div>
    `;
  }

  async function renderLesson(lessonData, phases, state) {
    const id = lessonData.id;
    const sections = lessonData.sections || {};
    const isStub = lessonData.status === 'stub';

    // Find phase title
    let phaseTitle = '';
    let phaseId = null;
    let phaseData = null;
    if (phases) {
      const phase = phases.find(p => p.lessons.some(l => l.id === id));
      if (phase) { phaseTitle = phase.title; phaseId = phase.id; phaseData = phase; }
    }
    const nextLesson = lessonData.bridgeToNext || sections.nextLesson;
    const previousLesson = phases?.flatMap(p => p.lessons).find(l => l.id === sections.bridgeFrom);
    const narratives = await ensureLessonNarratives();
    const narrative = narratives[lessonData.id];

    const stubBanner = isStub ? `
      <div class="stub-banner">
        ✦ <strong>This lesson is in progress.</strong> The structure is complete; full content will be added in the next revision. Core concepts and exercises are already included.
      </div>
    ` : '';

    // Bridge from previous lesson
    const bridgeFrom = sections.bridgeFrom ? `
      <div class="callout" style="margin-bottom:1.25rem; font-size:0.9rem">
        <strong>Building on:</strong> ${esc(previousLesson?.title || sections.bridgeFrom)}
      </div>
    ` : '';

    // Why this lesson
    const whyBlock = sections.whyThisLesson ? `
      <div class="callout ok" style="margin-bottom:1rem">
        <strong>Why this lesson:</strong> ${esc(sections.whyThisLesson.text || sections.whyThisLesson)}
      </div>
    ` : '';

    // Learning objectives
    const objBlock = (lessonData.learningObjectives || []).length > 0 ? `
      <div class="card-sm" style="margin-bottom:1rem">
        <div style="font-size:0.73rem; font-weight:700; text-transform:uppercase; letter-spacing:0.07em; color:var(--dim); margin-bottom:0.5rem; font-family:var(--mono)">By the end of this lesson, you will be able to</div>
        <ul style="list-style:none; display:flex; flex-direction:column; gap:0.3rem">
          ${(lessonData.learningObjectives || []).map(obj => `
            <li style="display:flex; gap:0.6rem; font-size:0.88rem; color:#cbd5e1">
              <span style="color:var(--blue); flex-shrink:0">➔</span>
              ${esc(obj)}
            </li>
          `).join('')}
        </ul>
      </div>
    ` : '';

    // All disclosure sections
    const disclosureSections = (narrative ? [
      renderVisualSection(sections.visual, id),
      renderMathSection(sections.mathematics, id),
      renderEvidenceSection(sections.evidence, id),
      renderFailureSection(sections.failureModes, id),
      renderExercisesSection(sections.exercises, id),
      renderMasterySection(sections.masteryQuestions, id),
      renderResearchWorksheet(sections.researchWorksheet, id),
    ] : [
      renderIntuitionSection(sections.intuition, id),
      renderToyExampleSection(sections.toyExample, id),
      renderVisualSection(sections.visual, id),
      renderTechnicalSection(sections.technical, id),
      renderMathSection(sections.mathematics, id),
      renderComparisonSection(sections.methodComparison, id),
      renderEvidenceSection(sections.evidence, id),
      renderFailureSection(sections.failureModes, id),
      renderSetConCASection(sections.setconcaConnection, id),
      renderExercisesSection(sections.exercises, id),
      renderMasterySection(sections.masteryQuestions, id),
      renderResearchWorksheet(sections.researchWorksheet, id),
    ]).filter(Boolean).join('');

    // Bridge to next
    const bridgeNext = nextLesson ? `
      <div class="callout purple" style="margin-top:1rem">
        <strong>Coming up:</strong> ${esc(nextLesson.text || nextLesson.bridge || '')}
        ${nextLesson.nextId || nextLesson.id ? `
          <div style="margin-top:0.5rem">
            <button class="btn-primary" onclick="app.navigate('/lesson/${nextLesson.nextId || nextLesson.id}')">
              Next: ${esc(nextLesson.nextTitle || 'Continue')} →
            </button>
          </div>
        ` : ''}
      </div>
    ` : '';

    const rawSources = (phaseData?.rawSources || []).length ? `
      <div class="card-sm" style="margin-bottom:1rem">
        <div style="font-size:0.73rem; font-weight:700; text-transform:uppercase; letter-spacing:0.07em; color:var(--dim); margin-bottom:0.5rem; font-family:var(--mono)">RAW paper grounding for this phase</div>
        <div style="display:flex; flex-wrap:wrap; gap:0.4rem">
          ${phaseData.rawSources.map(sourceId => `<button class="btn-ghost" style="padding:0.3rem 0.55rem; font-size:0.78rem" onclick="app.navigate('/paper/${sourceId}')">${esc(sourceId)}</button>`).join('')}
        </div>
        <p class="muted" style="font-size:0.78rem; margin-top:0.55rem">The lesson explains these sources in course language. Paper-level findings remain labelled and linked to their local PDFs.</p>
      </div>
    ` : '';

    const teacherExplanation = narrative ? `
      <article class="teacher-explanation card" style="margin:1.25rem 0">
        <div style="font-size:0.73rem; font-weight:700; text-transform:uppercase; letter-spacing:0.07em; color:var(--blue); margin-bottom:0.7rem; font-family:var(--mono)">The explanation</div>
        <p style="margin:0; color:#d6deeb; font-size:1rem; line-height:1.8">${esc(narrative.body)}</p>
        <p style="margin:0.9rem 0 0; color:var(--green); font-size:0.92rem"><strong>Why this comes next:</strong> ${esc(narrative.bridge)}</p>
      </article>
    ` : '';

    return `
      <button class="btn-ghost" onclick="app.navigate('/phase/${phaseId}')" style="margin-bottom:1rem">
        ← Phase ${phaseId}: ${esc(phaseTitle)}
      </button>

      ${stubBanner}

      <div style="margin-bottom:0.5rem; display:flex; flex-wrap:wrap; gap:0.35rem">
        <span class="badge badge-blue">Phase ${phaseId}</span>
        <span class="badge badge-dim">${lessonData.estimatedMinutes || '?'} min</span>
        ${state.lessons?.[id]?.mastered ? '<span class="badge badge-green">Mastered ✓</span>' : ''}
      </div>

      <h1 style="margin-bottom:0.6rem">${esc(lessonData.title)}</h1>

      ${narrative ? '' : whyBlock}
      ${bridgeFrom}
      ${narrative ? '' : objBlock}
      ${rawSources}
      ${teacherExplanation}

      <div style="margin-top:0.5rem">
        ${disclosureSections}
      </div>

      ${renderMasteryGate(lessonData, state)}
      ${bridgeNext}

      <div class="actions">
        <button class="btn-ghost" onclick="app.navigate('/phase/${phaseId}')">← Back to phase</button>
        ${nextLesson?.nextId || nextLesson?.id ? `
          <button class="btn-primary" onclick="app.navigate('/lesson/${nextLesson.nextId || nextLesson.id}')">
            Continue →
          </button>
        ` : `
          <button class="btn-primary" onclick="app.continueLearning()">Continue learning →</button>
        `}
      </div>
    `;
  }

  async function renderConceptMap(phases, state) {
    return `
      <h2 style="margin-bottom:0.5rem">Concept Dependency Map</h2>
      <p class="muted" style="margin-bottom:1rem">Click any node to open its lesson. Zoom and pan to explore connections.</p>
      <div class="concept-map-container" style="height:600px">
        <canvas id="conceptMapCanvas" data-visual="concept-map" style="width:100%; height:100%"></canvas>
        <div id="mapTooltip" class="map-tooltip"></div>
      </div>
      <div id="demoMount" data-visual="concept-map" style="display:none"></div>
    `;
  }

  async function renderLibrary(phases, state) {
    let papersData;
    try { papersData = await ensurePapers(); } catch { papersData = []; }

    const tierlabels = { 1: 'Directly relevant', 2: 'Strongly adjacent', 3: 'Strategically relevant', 4: 'Background' };
    const tiers = [1, 2, 3, 4];

    const libraryHtml = tiers.map(tier => {
      const tierPapers = papersData.filter(p => p.tier === tier);
      if (tierPapers.length === 0) return '';
      return `
        <h3 style="margin-top:1.5rem; margin-bottom:0.75rem">Tier ${tier} — ${tierlabels[tier]}</h3>
        ${tierPapers.map(paper => `
          <div class="lesson-item" style="margin-bottom:0.4rem; flex-direction:column; align-items:flex-start; gap:0.3rem"
               onclick="app.navigate('/paper/${paper.id}')" role="button" tabindex="0">
            <div style="display:flex; justify-content:space-between; width:100%; align-items:flex-start; gap:1rem">
              <strong>${esc(paper.title)}</strong>
              <span class="badge badge-dim" style="flex-shrink:0; white-space:nowrap">${esc(paper.year || '')}</span>
            </div>
            <div class="muted" style="font-size:0.82rem">${esc(paper.authors || '')} · ${esc(paper.venue || '')}</div>
            ${paper.concepts ? `<div style="margin-top:0.25rem; display:flex; flex-wrap:wrap; gap:0.3rem">${paper.concepts.map(c => `<span class="badge badge-blue" style="font-size:0.65rem">${esc(c)}</span>`).join('')}</div>` : ''}
          </div>
        `).join('')}
      `;
    }).join('');

    return `
      <h2 style="margin-bottom:0.5rem">Research Library</h2>
      <p class="muted" style="margin-bottom:1rem">Papers are supporting sources for concept lessons. Navigate through lessons to reach papers naturally — or browse here for reference.</p>
      <div class="search-bar">
        <input class="search-input" type="search" placeholder="Search papers…" oninput="filterLibrary(this.value)" id="librarySearch" />
      </div>
      <div id="libraryContent">${libraryHtml}</div>
    `;
  }

  async function renderGlossary(phases, state) {
    let glossaryData;
    try { glossaryData = await ensureGlossary(); } catch { glossaryData = []; }

    const grouped = {};
    glossaryData.forEach(term => {
      const letter = term.term[0].toUpperCase();
      if (!grouped[letter]) grouped[letter] = [];
      grouped[letter].push(term);
    });

    const glossaryHtml = Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([letter, terms]) => `
      <div style="margin-bottom:1rem">
        <div style="font-family:var(--heading); font-size:1.3rem; font-weight:800; color:var(--blue); margin-bottom:0.5rem; border-bottom:1px solid var(--border); padding-bottom:0.25rem">${letter}</div>
        ${terms.map(term => `
          <div class="glossary-term" onclick="this.classList.toggle('expanded')" role="button" tabindex="0">
            <div class="glossary-term-name">${esc(term.term)}</div>
            <div class="glossary-term-short">${esc(term.oneSentence)}</div>
            <div class="glossary-term-full">${esc(term.fullDefinition || term.oneSentence)}</div>
            ${term.conceptId ? `<div style="margin-top:0.4rem"><a href="#/concept/${term.conceptId}" onclick="event.stopPropagation(); app.navigate('/concept/${term.conceptId}')" style="font-size:0.8rem; color:var(--blue)">→ Open full concept page</a></div>` : ''}
          </div>
        `).join('')}
      </div>
    `).join('');

    return `
      <h2 style="margin-bottom:0.5rem">Glossary</h2>
      <p class="muted" style="margin-bottom:1rem">Click any term to expand its full definition. Terms highlighted in blue throughout lessons link here.</p>
      <div class="search-bar">
        <input class="search-input" type="search" placeholder="Search terms…" id="glossarySearch" oninput="filterGlossary(this.value)" />
      </div>
      <div id="glossaryContent">${glossaryHtml}</div>
    `;
  }

  async function renderSearch(phases, state) {
    return `
      <h2 style="margin-bottom:0.5rem">Search</h2>
      <div class="search-bar">
        <input class="search-input" type="search" placeholder="Search lessons, concepts, papers, terms…" id="globalSearch" oninput="runSearch(this.value)" autofocus />
      </div>
      <div id="searchResults" style="margin-top:1rem"></div>
      <script>
        async function runSearch(q) {
          const el = document.getElementById('searchResults');
          if (!q.trim()) { el.innerHTML = ''; return; }
          // Simple client-side search across phase/lesson titles
          const phases = app.getPhases();
          if (!phases) return;
          const results = [];
          phases.forEach(ph => {
            ph.lessons.forEach(l => {
              if (l.title.toLowerCase().includes(q.toLowerCase())) {
                results.push({ type: 'lesson', id: l.id, title: l.title, sub: 'Phase '+ph.id+': '+ph.title });
              }
            });
            if (ph.title.toLowerCase().includes(q.toLowerCase())) {
              results.push({ type: 'phase', id: ph.id, title: ph.title, sub: 'Phase' });
            }
          });
          el.innerHTML = results.length === 0
            ? '<p class="muted">No results found.</p>'
            : results.map(r => \`
                <div class="search-result" onclick="app.navigate('/\${r.type}/\${r.id}')">
                  <span class="search-result-type badge badge-dim">\${r.type}</span>
                  <div>
                    <div style="font-weight:600">\${r.title}</div>
                    <div class="muted" style="font-size:0.8rem">\${r.sub}</div>
                  </div>
                </div>
              \`).join('');
        }
      </script>
    `;
  }

  async function renderPaper(paperId, phases, state) {
    let papers;
    try { papers = await ensurePapers(); } catch { papers = []; }
    const paper = papers.find(p => p.id === paperId);
    if (!paper) return `<p class="muted">Paper "${esc(paperId)}" not found in library.</p>`;

    return `
      <button class="btn-ghost" onclick="app.navigate('/library')" style="margin-bottom:1rem">← Research Library</button>

      <div style="margin-bottom:0.5rem">
        <span class="badge badge-blue">Tier ${paper.tier}</span>
        <span class="badge badge-dim">${esc(paper.year || '')}</span>
        <span class="badge badge-dim">${esc(paper.venue || '')}</span>
        ${paper.status ? `<span class="badge badge-green">${esc(paper.status)}</span>` : ''}
      </div>

      <h1 style="margin-bottom:0.5rem; font-size:1.5rem">${esc(paper.title)}</h1>
      <p class="muted" style="margin-bottom:1rem">${esc(paper.authors || '')}</p>

      ${paper.file ? `<a href="RAW/${paper.file}" target="_blank" class="btn-secondary" style="display:inline-block; text-decoration:none; margin-bottom:1rem">📄 View PDF</a>` : ''}
      ${paper.url ? `<a href="${paper.url}" target="_blank" class="btn-ghost" style="display:inline-block; text-decoration:none; margin-bottom:1rem; margin-left:0.5rem">🔗 Paper page</a>` : ''}

      <div class="card">
        <h3>Main contribution</h3>
          <p>${esc(paper.contribution || paper.summary || 'Not yet documented.')}</p>
      </div>

      ${paper.concepts && paper.concepts.length > 0 ? `
        <div class="card">
          <h3>Concepts taught in lessons</h3>
          <div style="display:flex; flex-wrap:wrap; gap:0.4rem">${paper.concepts.map(c => `<span class="badge badge-blue">${esc(c)}</span>`).join('')}</div>
        </div>
      ` : ''}

      ${paper.lessonIds && paper.lessonIds.length > 0 ? `
        <div class="card">
          <h3>Lessons that cite this paper</h3>
          ${paper.lessonIds.map(lid => `<div class="lesson-item" onclick="app.navigate('/lesson/${lid}')">${esc(lid)}</div>`).join('')}
        </div>
      ` : ''}

      ${paper.assumptions ? `
        <div class="card">
          <h3>Key assumptions</h3>
          <p>${esc(paper.assumptions)}</p>
        </div>
      ` : ''}

      ${paper.limitations ? `
        <div class="card">
          <h3>Limitations</h3>
          <p>${esc(paper.limitations)}</p>
        </div>
      ` : ''}

      ${paper.setconcaRelevance ? `
        <div class="callout purple">
          <strong>SetConCA relevance:</strong> ${esc(paper.setconcaRelevance)}
        </div>
      ` : ''}
    `;
  }

  async function renderConcept(conceptId, phases, state) {
    let concepts;
    try { concepts = await ensureConcepts(); } catch { concepts = []; }
    const concept = concepts.find(c => c.id === conceptId);
    if (!concept) return `<p class="muted">Concept not found.</p>`;

    return `
      <button class="btn-ghost" onclick="app.navigate('/map')" style="margin-bottom:1rem">← Concept Map</button>

      <span class="badge badge-blue">${esc(concept.category || 'Concept')}</span>
      <h1 style="margin:0.5rem 0">${esc(concept.title)}</h1>
      <div class="callout" style="margin-bottom:1rem">${esc(concept.oneSentenceDefinition)}</div>

      ${concept.fullDefinition ? `<div class="card"><p>${esc(concept.fullDefinition)}</p></div>` : ''}

      ${concept.prerequisites && concept.prerequisites.length > 0 ? `
        <div class="card">
          <h3>Prerequisites</h3>
          <div style="display:flex; flex-wrap:wrap; gap:0.4rem">
            ${concept.prerequisites.map(pid => `
              <button class="btn-ghost" onclick="app.navigate('/concept/${pid}')">${esc(pid)}</button>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${concept.lessonIds && concept.lessonIds.length > 0 ? `
        <div class="card">
          <h3>Lessons covering this concept</h3>
          ${concept.lessonIds.map(lid => `<div class="lesson-item" onclick="app.navigate('/lesson/${lid}')">${esc(lid)}</div>`).join('')}
        </div>
      ` : ''}

      ${concept.setconcaRelevance ? `
        <div class="callout purple"><strong>SetConCA connection:</strong> ${esc(concept.setconcaRelevance)}</div>
      ` : ''}
    `;
  }

  function getProgress(state, phases) {
    if (!phases) return { done: 0, total: 0, pct: 0 };
    const allLessons = phases.flatMap(ph => ph.lessons.filter(l => l.status !== 'stub'));
    const total = allLessons.length;
    const done = allLessons.filter(l => state.lessons[l.id]?.mastered).length;
    return { done, total, pct: total > 0 ? Math.round(100*done/total) : 0 };
  }

  return {
    renderHome,
    renderPhase,
    renderLesson,
    renderConceptMap,
    renderLibrary,
    renderGlossary,
    renderSearch,
    renderPaper,
    renderConcept,
  };
}
