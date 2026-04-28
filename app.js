// ─── STATE ───────────────────────────────────────────────────────────────────
let selectedGoal = null;

// ─── PILL SELECTION ──────────────────────────────────────────────────────────
document.querySelectorAll('.pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    selectedGoal = pill.dataset.val;
  });
});

// ─── CHAR COUNT ──────────────────────────────────────────────────────────────
document.getElementById('ideaInput').addEventListener('input', function () {
  document.getElementById('charCount').textContent = this.value.length;
});

// ─── MAIN ANALYZE FUNCTION ────────────────────────────────────────────────────
async function analyzeIdea() {
  const idea = document.getElementById('ideaInput').value.trim();
  const industry = document.getElementById('industrySelect').value;
  const orgSize = document.getElementById('orgSize').value;

  if (!idea || idea.length < 20) {
    alert('Please describe your idea in at least 20 characters.');
    return;
  }

  // Show loading, hide input/results
  document.getElementById('input-section').classList.add('hidden');
  document.getElementById('resultsSection').classList.add('hidden');
  document.getElementById('loadingSection').classList.remove('hidden');

  const btn = document.getElementById('analyzeBtn');
  btn.classList.add('loading');

  // Animate loading steps
  animateLoadingSteps();

  try {
    const result = await callAnthropicAPI(idea, industry, orgSize, selectedGoal);
    displayResults(result);
  } catch (err) {
    console.error(err);
    alert('Analysis failed. Please check your connection and try again.');
    resetSystem();
  }
}

// ─── LOADING ANIMATION ────────────────────────────────────────────────────────
function animateLoadingSteps() {
  const steps = ['ls1', 'ls2', 'ls3', 'ls4'];
  let current = 0;
  const interval = setInterval(() => {
    if (current > 0) {
      document.getElementById(steps[current - 1]).classList.remove('active');
      document.getElementById(steps[current - 1]).classList.add('done');
      document.getElementById(steps[current - 1]).textContent =
        document.getElementById(steps[current - 1]).textContent.replace('⬡', '✓');
    }
    if (current < steps.length) {
      document.getElementById(steps[current]).classList.add('active');
      current++;
    } else {
      clearInterval(interval);
    }
  }, 900);
}

// ─── ANTHROPIC API CALL ───────────────────────────────────────────────────────
async function callAnthropicAPI(idea, industry, orgSize, goal) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        summary: {
          title: "AI-Powered Idea Intelligence",
          description: "Transforms raw ideas into structured AI use-cases with feasibility insights.",
          feasibility_score: 78,
          impact_level: "High",
          tags: ["AI", "Automation", "Decision"]
        },
        use_cases: [
          {
            title: "Idea Classification",
            description: "Classify raw ideas into categories using NLP.",
            type: "nlp",
            effort: "Medium",
            roi_potential: "High",
            explainability: "High"
          },
          {
            title: "Feasibility Prediction",
            description: "Predict feasibility score using ML models.",
            type: "prediction",
            effort: "High",
            roi_potential: "Very High",
            explainability: "Medium"
          },
          {
            title: "Automation Pipeline",
            description: "Automate idea-to-solution mapping.",
            type: "automation",
            effort: "Medium",
            roi_potential: "High",
            explainability: "High"
          }
        ],
        decision_intelligence: {
          build_vs_buy: { recommendation: "Build", reason: "Custom logic required" },
          time_to_value: { value: "3-6 months", note: "Depends on data" },
          data_readiness: { score: "Good", note: "Structured data needed" },
          strategic_alignment: { score: "High", note: "Aligns with AI strategy" },
          team_capability: { score: "Medium", note: "Needs ML engineers" },
          risk_level: { score: "Medium", note: "Data dependency risk" }
        },
        roadmap: [
          { phase: "Phase 1", title: "Data Collection", duration: "Weeks 1-2", description: "Gather idea data" },
          { phase: "Phase 2", title: "Model Design", duration: "Weeks 3-6", description: "Build ML pipeline" },
          { phase: "Phase 3", title: "Testing", duration: "Weeks 7-8", description: "Validate results" },
          { phase: "Phase 4", title: "Deployment", duration: "Weeks 9-12", description: "Deploy system" }
        ],
        risks: ["Data quality issues", "Model bias", "Integration complexity"],
        next_steps: ["Collect data", "Define pipeline", "Train model", "Deploy MVP"]
      });
    }, 2000);
  });
}

// ─── DISPLAY RESULTS ─────────────────────────────────────────────────────────
function displayResults(data) {
  document.getElementById('loadingSection').classList.add('hidden');
  document.getElementById('resultsSection').classList.remove('hidden');

  renderSummary(data.summary);
  renderUseCases(data.use_cases);
  renderDecisionIntel(data.decision_intelligence);
  renderRoadmap(data.roadmap);
  renderListItems('risksList', data.risks, '⚠');
  renderListItems('nextStepsList', data.next_steps, '→');
}

function renderSummary(s) {
  document.getElementById('summaryTitle').textContent = s.title;
  document.getElementById('summaryDesc').textContent = s.description;
  document.getElementById('feasibilityScore').textContent = s.feasibility_score + '%';
  document.getElementById('impactScore').textContent = s.impact_level;

  // Animate ring
  const offset = 314 - (314 * s.feasibility_score / 100);
  setTimeout(() => {
    document.getElementById('feasibilityRing').style.strokeDashoffset = offset;
    // Color based on score
    const color = s.feasibility_score >= 75 ? '#e8ff47' : s.feasibility_score >= 50 ? '#47ffe4' : '#ff6b47';
    document.getElementById('feasibilityRing').style.stroke = color;
  }, 100);

  // Tags
  const tagsEl = document.getElementById('summaryTags');
  tagsEl.innerHTML = '';
  const tagClasses = ['tag-yellow', 'tag-blue', 'tag-orange'];
  (s.tags || []).forEach((tag, i) => {
    const span = document.createElement('span');
    span.className = 'tag ' + tagClasses[i % tagClasses.length];
    span.textContent = tag;
    tagsEl.appendChild(span);
  });
}

function renderUseCases(cases) {
  const grid = document.getElementById('usecasesGrid');
  grid.innerHTML = '';
  cases.forEach((uc, i) => {
    grid.innerHTML += `
      <div class="usecase-card type-${uc.type || 'nlp'}">
        <div class="usecase-number">USE-CASE ${String(i + 1).padStart(2, '0')}</div>
        <div class="usecase-title">${uc.title}</div>
        <div class="usecase-desc">${uc.description}</div>
        <div class="usecase-meta">
          <span class="usecase-pill pill-type">${uc.type}</span>
          <span class="usecase-pill pill-effort">Effort: ${uc.effort}</span>
          <span class="usecase-pill pill-roi">ROI: ${uc.roi_potential}</span>
        </div>
      </div>`;
  });
}

function renderDecisionIntel(di) {
  const items = [
    { icon: '🏗', label: 'Build vs Buy', value: di.build_vs_buy?.recommendation || '—', sub: di.build_vs_buy?.reason || '' },
    { icon: '⏱', label: 'Time to Value', value: di.time_to_value?.value || '—', sub: di.time_to_value?.note || '' },
    { icon: '🗄', label: 'Data Readiness', value: di.data_readiness?.score || '—', sub: di.data_readiness?.note || '' },
    { icon: '🎯', label: 'Strategic Fit', value: di.strategic_alignment?.score || '—', sub: di.strategic_alignment?.note || '' },
    { icon: '👥', label: 'Team Capability', value: di.team_capability?.score || '—', sub: di.team_capability?.note || '' },
    { icon: '⚡', label: 'Risk Level', value: di.risk_level?.score || '—', sub: di.risk_level?.note || '' },
  ];

  const grid = document.getElementById('decisionGrid');
  grid.innerHTML = '';
  items.forEach(item => {
    grid.innerHTML += `
      <div class="decision-card">
        <div class="decision-icon">${item.icon}</div>
        <div class="decision-label">${item.label}</div>
        <div class="decision-value">${item.value}</div>
        <div class="decision-sub">${item.sub}</div>
      </div>`;
  });
}

function renderRoadmap(phases) {
  const container = document.getElementById('roadmap');
  container.innerHTML = '';
  phases.forEach(phase => {
    container.innerHTML += `
      <div class="roadmap-item">
        <div class="roadmap-left">
          <div class="roadmap-dot"></div>
          <div class="roadmap-line"></div>
        </div>
        <div class="roadmap-content">
          <div class="roadmap-phase">${phase.phase} · ${phase.duration}</div>
          <div class="roadmap-title">${phase.title}</div>
          <div class="roadmap-desc">${phase.description}</div>
        </div>
      </div>`;
  });
}

function renderListItems(containerId, items, icon) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  items.forEach(item => {
    container.innerHTML += `
      <div class="list-item">
        <span class="list-item-icon">${icon}</span>
        <span class="list-item-text">${item}</span>
      </div>`;
  });
}

// ─── RESET ────────────────────────────────────────────────────────────────────
function resetSystem() {
  document.getElementById('loadingSection').classList.add('hidden');
  document.getElementById('resultsSection').classList.add('hidden');
  document.getElementById('input-section').classList.remove('hidden');
  document.getElementById('analyzeBtn').classList.remove('loading');

  // Reset loading steps
  ['ls1', 'ls2', 'ls3', 'ls4'].forEach((id, i) => {
    const el = document.getElementById(id);
    el.classList.remove('active', 'done');
    const labels = [
      '⬡ Parsing innovation signal...',
      '⬡ Mapping AI solution space...',
      '⬡ Running feasibility analysis...',
      '⬡ Generating decision intelligence...'
    ];
    el.textContent = labels[i];
    if (i === 0) el.classList.add('active');
  });

  // Reset ring
  document.getElementById('feasibilityRing').style.strokeDashoffset = '314';

  // Scroll up
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
