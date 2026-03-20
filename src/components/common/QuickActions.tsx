import { useState } from 'react';
import './QuickActions.css';
import { CONFIG } from '../../config';

type ActionType = 'add' | 'remove' | 'feedback' | 'feature' | 'onboard' | 'bot';

interface ModalState {
  type: ActionType;
}

// ── Individual modals ────────────────────────────────────────────────────────

function ModalShell({ title, icon, onClose, children }: {
  title: string;
  icon: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="qa-overlay" role="dialog" aria-modal aria-label={title} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="qa-modal">
        <div className="qa-modal__header">
          <span className="qa-modal__icon">{icon}</span>
          <h2 className="qa-modal__title">{title}</h2>
          <button className="qa-modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="qa-modal__body">{children}</div>
      </div>
    </div>
  );
}

function AddContentModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    teamName: '',
    description: '',
    contacts: '',
    agentType: 'AAQ',
    fileName: '',
  });

  const isValid = form.teamName.trim() && form.description.trim() && form.contacts.trim() && form.fileName;

  if (submitted) return (
    <ModalShell title="Knowledge Agent Onboarding Request" icon="➕" onClose={onClose}>
      <div className="qa-modal__success">
        <span className="qa-modal__success-icon">✓</span>
        <p>Your onboarding request has been submitted. The KA team will review and reach out to your SxG contacts.</p>
        <button className="qa-btn qa-btn--primary" onClick={onClose}>Done</button>
      </div>
    </ModalShell>
  );

  return (
    <ModalShell title="Knowledge Agent Onboarding Request" icon="➕" onClose={onClose}>
      <p className="qa-modal__desc">
        Submit an onboarding request to the SxG Knowledge Agent. Complete the Excel template first, then attach it below.
      </p>

      <div className="qa-form">
        {/* Template download banner */}
        <div className="qa-form__banner">
          <span className="qa-form__banner-icon">📋</span>
          <div>
            <p className="qa-form__banner-title">Download the Onboarding Template first</p>
            <p className="qa-form__banner-sub">One row = one onboarding item · All required columns must be populated</p>
          </div>
          <a
            className="qa-btn qa-btn--primary qa-form__banner-link"
            href="https://aka.ms/Content_KA_Onboarding"
            target="_blank"
            rel="noreferrer"
          >Download ↗</a>
        </div>

        <label className="qa-form__label">Team / Project Name <span className="qa-form__req">*</span></label>
        <input
          className="qa-form__input"
          placeholder="e.g. Surface – Device Support"
          value={form.teamName}
          onChange={e => setForm(f => ({ ...f, teamName: e.target.value }))}
        />

        <label className="qa-form__label">Brief Description of Onboarding Request <span className="qa-form__req">*</span></label>
        <textarea
          className="qa-form__textarea"
          rows={3}
          placeholder="Team context and onboarding goals…"
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
        />

        <label className="qa-form__label">SxG Project Contacts — PM, Eng, POC <span className="qa-form__req">*</span></label>
        <input
          className="qa-form__input"
          placeholder="e.g. Jane Smith (PM), John Doe (Eng)"
          value={form.contacts}
          onChange={e => setForm(f => ({ ...f, contacts: e.target.value }))}
        />

        <label className="qa-form__label">Agent Type <span className="qa-form__req">*</span></label>
        <select
          className="qa-form__select"
          value={form.agentType}
          onChange={e => setForm(f => ({ ...f, agentType: e.target.value }))}
        >
          <option>AAQ</option>
          <option>KA</option>
        </select>

        <label className="qa-form__label">Attach Completed Excel File <span className="qa-form__req">*</span></label>
        <div className="qa-form__file-wrap">
          <label className="qa-form__file-label">
            <input
              type="file"
              accept=".xlsx,.xls"
              className="qa-form__file-input"
              onChange={e => setForm(f => ({ ...f, fileName: e.target.files?.[0]?.name ?? '' }))}
            />
            <span className="qa-btn">📎 Choose File</span>
            <span className="qa-form__file-name">{form.fileName || 'No file selected'}</span>
          </label>
        </div>
        <p className="qa-form__hint">Requests without a completed Excel will remain <strong>Blocked</strong>.</p>

        <div className="qa-form__footer">
          <button className="qa-btn qa-btn--primary" disabled={!isValid} onClick={() => setSubmitted(true)}>
            Submit Request
          </button>
          <button className="qa-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </ModalShell>
  );
}

function RemoveContentModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    teamName: '',
    agentType: 'AAQ',
    reason: '',
    articles: '',
    fileName: '',
    urgency: 'Normal',
  });

  const isValid = form.teamName.trim() && form.reason.trim() && (form.articles.trim() || form.fileName);

  if (submitted) return (
    <ModalShell title="Content Removal Request" icon="🗑️" onClose={onClose}>
      <div className="qa-modal__success">
        <span className="qa-modal__success-icon">✓</span>
        <p>Your removal request has been submitted. The KA team will review within 2 business days.</p>
        <button className="qa-btn qa-btn--primary" onClick={onClose}>Done</button>
      </div>
    </ModalShell>
  );

  return (
    <ModalShell title="Content Removal Request" icon="🗑️" onClose={onClose}>
      <p className="qa-modal__desc">
        Request that one or more articles be removed from the Knowledge Agent. Provide the article(s) below or upload a list.
      </p>
      <div className="qa-form">

        <label className="qa-form__label">Team / Project Name <span className="qa-form__req">*</span></label>
        <input
          className="qa-form__input"
          placeholder="e.g. Surface – Device Support"
          value={form.teamName}
          onChange={e => setForm(f => ({ ...f, teamName: e.target.value }))}
        />

        <label className="qa-form__label">Agent Type <span className="qa-form__req">*</span></label>
        <select
          className="qa-form__select"
          value={form.agentType}
          onChange={e => setForm(f => ({ ...f, agentType: e.target.value }))}
        >
          <option>AAQ</option>
          <option>KA</option>
        </select>

        <label className="qa-form__label">Urgency</label>
        <select
          className="qa-form__select"
          value={form.urgency}
          onChange={e => setForm(f => ({ ...f, urgency: e.target.value }))}
        >
          <option>Normal</option>
          <option>High – outdated / inaccurate</option>
          <option>Urgent – harmful or sensitive content</option>
        </select>

        <label className="qa-form__label">Reason for Removal <span className="qa-form__req">*</span></label>
        <textarea
          className="qa-form__textarea"
          rows={3}
          placeholder="Why should this content be removed?"
          value={form.reason}
          onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
        />

        <label className="qa-form__label">Article ID(s) / URL(s) <span className="qa-form__req">*</span></label>
        <textarea
          className="qa-form__textarea"
          rows={3}
          placeholder="Paste one article per line — ID, URL, or title"
          value={form.articles}
          onChange={e => setForm(f => ({ ...f, articles: e.target.value }))}
        />

        <div className="qa-form__divider"><span>or upload a list</span></div>

        <div className="qa-form__file-wrap">
          <label className="qa-form__file-label">
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              className="qa-form__file-input"
              onChange={e => setForm(f => ({ ...f, fileName: e.target.files?.[0]?.name ?? '' }))}
            />
            <span className="qa-btn">📎 Upload Article List</span>
            <span className="qa-form__file-name">{form.fileName || 'No file selected'}</span>
          </label>
        </div>
        <p className="qa-form__hint">Accepted formats: .xlsx, .xls, .csv — one article per row.</p>

        <div className="qa-form__footer">
          <button className="qa-btn qa-btn--danger" disabled={!isValid} onClick={() => setSubmitted(true)}>
            Submit Request
          </button>
          <button className="qa-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </ModalShell>
  );
}

const FEEDBACK_CATEGORIES = [
  'Content Quality',
  'Knowledge Gap',
  'Dashboard / UX',
  'Data Accuracy',
  'Article Feedback',
  'Other / General',
];

type FeedbackStatus = 'idle' | 'sending' | 'success' | 'error';

function FeedbackModal({ onClose }: { onClose: () => void }) {
  const [status, setStatus] = useState<FeedbackStatus>('idle');
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [form, setForm] = useState({
    category: FEEDBACK_CATEGORIES[0],
    subject: '',
    feedback: '',
    alias: '',
  });

  const isValid = form.feedback.trim() && form.subject.trim();

  async function submit() {
    if (!isValid) return;
    setStatus('sending');

    const payload = {
      category: form.category,
      subject: form.subject,
      feedback: form.feedback,
      rating: rating || null,
      alias: form.alias || 'Anonymous',
      submittedAt: new Date().toISOString(),
    };

    if (!CONFIG.FEEDBACK_FLOW_URL) {
      // No flow configured — open mailto as fallback
      const body = encodeURIComponent(
        `Category: ${payload.category}\nRating: ${payload.rating ?? 'N/A'}/5\nAlias: ${payload.alias}\n\n${payload.feedback}`
      );
      window.open(
        `mailto:${CONFIG.FEEDBACK_EMAIL}?subject=${encodeURIComponent(`[SxG Knowledge Hub Feedback] ${payload.subject}`)}&body=${body}`,
        '_blank'
      );
      setStatus('success');
      return;
    }

    try {
      await fetch(CONFIG.FEEDBACK_FLOW_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') return (
    <ModalShell title="Give Feedback" icon="💬" onClose={onClose}>
      <div className="qa-modal__success">
        <span className="qa-modal__success-icon">✓</span>
        <p>Thank you! Your feedback has been sent to the SxG Knowledge team.</p>
        <button className="qa-btn qa-btn--primary" onClick={onClose}>Done</button>
      </div>
    </ModalShell>
  );

  return (
    <ModalShell title="Give Feedback" icon="💬" onClose={onClose}>
      <p className="qa-modal__desc">
        Share feedback with the SxG Knowledge team — about content quality, gaps, the dashboard, or anything else.
      </p>
      <div className="qa-form">

        <label className="qa-form__label">Category <span className="qa-form__req">*</span></label>
        <select
          className="qa-form__select"
          value={form.category}
          onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
        >
          {FEEDBACK_CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>

        <label className="qa-form__label">Subject <span className="qa-form__req">*</span></label>
        <input
          className="qa-form__input"
          placeholder="Brief summary of your feedback"
          value={form.subject}
          onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
        />

        <label className="qa-form__label">Your Feedback <span className="qa-form__req">*</span></label>
        <textarea
          className="qa-form__textarea"
          rows={5}
          placeholder="What's working well? What could be better? Be as specific as you like…"
          value={form.feedback}
          onChange={e => setForm(f => ({ ...f, feedback: e.target.value }))}
        />

        <label className="qa-form__label">Overall Rating (optional)</label>
        <div className="qa-stars">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              type="button"
              className={`qa-star${n <= (hovered || rating) ? ' qa-star--active' : ''}`}
              onMouseEnter={() => setHovered(n)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(r => r === n ? 0 : n)}
              aria-label={`${n} star`}
            >★</button>
          ))}
        </div>

        <label className="qa-form__label">Your Name / Alias (optional)</label>
        <input
          className="qa-form__input"
          placeholder="Leave blank to submit anonymously"
          value={form.alias}
          onChange={e => setForm(f => ({ ...f, alias: e.target.value }))}
        />

        {status === 'error' && (
          <p className="qa-form__error">Something went wrong sending your feedback. Please try again.</p>
        )}

        <div className="qa-form__footer">
          <button
            className="qa-btn qa-btn--primary"
            disabled={!isValid || status === 'sending'}
            onClick={submit}
          >
            {status === 'sending' ? 'Sending…' : 'Send Feedback'}
          </button>
          <button className="qa-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </ModalShell>
  );
}

type FeatureStatus = 'idle' | 'sending' | 'success' | 'error';

function FeatureRequestModal({ onClose }: { onClose: () => void }) {
  const [status, setStatus] = useState<FeatureStatus>('idle');
  const [form, setForm] = useState({
    title: '',
    summary: '',
    krAccrual: '',
    valueProposition: '',
    experienceToday: '',
    useCase: '',
    targetTimeline: '',
    costing: '',
    whyNow: '',
    dreamState: '',
    dependencies: '',
    capabilitySource: '',
  });

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const isValid = form.title.trim() && form.summary.trim();

  async function submit() {
    if (!isValid) return;
    setStatus('sending');

    const payload = { ...form, submittedAt: new Date().toISOString() };

    if (!CONFIG.FEATURE_REQUEST_FLOW_URL) {
      const body = encodeURIComponent(
        Object.entries(form).map(([k, v]) => `${k}:\n${v}`).join('\n\n')
      );
      window.open(
        `mailto:${CONFIG.FEEDBACK_EMAIL}?subject=${encodeURIComponent(`[SxG Feature Request] ${form.title}`)}&body=${body}`,
        '_blank'
      );
      setStatus('success');
      return;
    }

    try {
      await fetch(CONFIG.FEATURE_REQUEST_FLOW_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') return (
    <ModalShell title="Feature Request" icon="🚀" onClose={onClose}>
      <div className="qa-modal__success">
        <span className="qa-modal__success-icon">✓</span>
        <p>Your feature request has been submitted. The SxG team will review it during sprint planning.</p>
        <button className="qa-btn qa-btn--primary" onClick={onClose}>Done</button>
      </div>
    </ModalShell>
  );

  return (
    <ModalShell title="Feature Request" icon="🚀" onClose={onClose}>
      <p className="qa-modal__desc">
        Submit a feature request to the SxG Knowledge team. Fields marked <span className="qa-form__req">*</span> are required — fill in as much as you can for the others.
      </p>
      <div className="qa-form">

        {/* ── The Ask ── */}
        <p className="qa-form__section">The Ask</p>

        <label className="qa-form__label">Title <span className="qa-form__req">*</span></label>
        <input className="qa-form__input" placeholder="Short name for the feature" value={form.title} onChange={set('title')} />

        <label className="qa-form__label">One-Sentence Description <span className="qa-form__req">*</span></label>
        <input className="qa-form__input" placeholder="Scope, work, and outcome in one sentence" value={form.summary} onChange={set('summary')} />

        {/* ── Value & Impact ── */}
        <p className="qa-form__section">Value &amp; Impact</p>

        <label className="qa-form__label">KR Accrual</label>
        <textarea className="qa-form__textarea" rows={3} placeholder="Which KR does this accrue toward? What is the estimated impact?" value={form.krAccrual} onChange={set('krAccrual')} />

        <label className="qa-form__label">Value Proposition</label>
        <textarea className="qa-form__textarea" rows={4} placeholder="How will success be measured? Who benefits? What is the ROI over the next 3 semesters?" value={form.valueProposition} onChange={set('valueProposition')} />

        <label className="qa-form__label">Why Now</label>
        <textarea className="qa-form__textarea" rows={3} placeholder="Risk of not doing? Is there a deadline or critical business need?" value={form.whyNow} onChange={set('whyNow')} />

        {/* ── Problem & Solution ── */}
        <p className="qa-form__section">Problem &amp; Solution</p>

        <label className="qa-form__label">Experience Today</label>
        <textarea className="qa-form__textarea" rows={3} placeholder="What is the problem statement or existing gap to address?" value={form.experienceToday} onChange={set('experienceToday')} />

        <label className="qa-form__label">Use Case</label>
        <textarea className="qa-form__textarea" rows={4} placeholder="As a (persona) I want (goal) so that I can (result). One persona per use case." value={form.useCase} onChange={set('useCase')} />

        <label className="qa-form__label">Dream State</label>
        <textarea className="qa-form__textarea" rows={3} placeholder="What is the desired outcome? Is this 1 semester, 1 year, or a 3–5 year vision?" value={form.dreamState} onChange={set('dreamState')} />

        {/* ── Planning ── */}
        <p className="qa-form__section">Planning</p>

        <label className="qa-form__label">Target Timeline</label>
        <input className="qa-form__input" placeholder="e.g. Q3 FY26 — are there hard compliance or business deadlines?" value={form.targetTimeline} onChange={set('targetTimeline')} />

        <label className="qa-form__label">Dependencies</label>
        <textarea className="qa-form__textarea" rows={2} placeholder="Other teams, scenarios, or features this depends on" value={form.dependencies} onChange={set('dependencies')} />

        <label className="qa-form__label">Costing</label>
        <textarea className="qa-form__textarea" rows={3} placeholder="Resourcing estimate (e.g. 2 engineers for 1 month). Any Azure spend or licensing costs?" value={form.costing} onChange={set('costing')} />

        {/* ── Stakeholders ── */}
        <p className="qa-form__section">Stakeholders</p>

        <label className="qa-form__label">Capability Ask Source</label>
        <textarea className="qa-form__textarea" rows={3} placeholder="Who is asking? Primary sponsor? Stakeholder priority level and commitment?" value={form.capabilitySource} onChange={set('capabilitySource')} />

        {status === 'error' && (
          <p className="qa-form__error">Something went wrong submitting your request. Please try again.</p>
        )}

        <div className="qa-form__footer">
          <button className="qa-btn qa-btn--primary" disabled={!isValid || status === 'sending'} onClick={submit}>
            {status === 'sending' ? 'Submitting…' : 'Submit Request'}
          </button>
          <button className="qa-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </ModalShell>
  );
}

type OnboardStatus = 'idle' | 'sending' | 'success' | 'error';

const CALLING_METHODS = [
  {
    value: 'v2',
    label: 'Execute CoPilot and Wait (V2)',
    description: 'Allows partners to initiate the CoPilot process and wait for completion before proceeding (Agent-to-Agent scenario).',
  },
  {
    value: 'mcp',
    label: 'SxG MCP Server',
    description: 'Partner intends to interact with the Knowledge Agent by invoking it directly from a declarative agent or via a direct Web API call.',
  },
];

function KAOnboardModal({ onClose }: { onClose: () => void }) {
  const [status, setStatus] = useState<OnboardStatus>('idle');
  const [form, setForm] = useState({
    teamName: '',
    callingMethod: 'v2',
    purpose: '',
    mcsOrgName: '',
    npaAccount: '',
    mcpAccessObtained: 'No',
    environment: 'Pre-Production',
    rps: '',
  });

  const set = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }));

  const selectedMethod = CALLING_METHODS.find(m => m.value === form.callingMethod);
  const isValid = form.teamName.trim() && form.purpose.trim();

  async function submit() {
    if (!isValid) return;
    setStatus('sending');
    const payload = { ...form, submittedAt: new Date().toISOString() };

    if (!CONFIG.ONBOARDING_FLOW_URL) {
      const lines = [
        `Team Name: ${form.teamName}`,
        `Calling Method: ${selectedMethod?.label}`,
        `Purpose: ${form.purpose}`,
        `MCS Org Name: ${form.mcsOrgName || 'N/A'}`,
        form.callingMethod === 'v2' ? `NPA Account: ${form.npaAccount || 'N/A'}` : `MCP Access Obtained: ${form.mcpAccessObtained}`,
        `Environment: ${form.environment}`,
        `Expected RPS: ${form.rps || 'N/A'}`,
      ];
      window.open(
        `mailto:${CONFIG.FEEDBACK_EMAIL}?subject=${encodeURIComponent(`[SxG KA Onboarding Request] ${form.teamName}`)}&body=${encodeURIComponent(lines.join('\n'))}`,
        '_blank'
      );
      setStatus('success');
      return;
    }

    try {
      await fetch(CONFIG.ONBOARDING_FLOW_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') return (
    <ModalShell title="Knowledge Agent Onboarding" icon="🌐" onClose={onClose}>
      <div className="qa-modal__success">
        <span className="qa-modal__success-icon">✓</span>
        <p>Your onboarding request has been submitted. The SxG team will follow up to discuss next steps.</p>
        <button className="qa-btn qa-btn--primary" onClick={onClose}>Done</button>
      </div>
    </ModalShell>
  );

  return (
    <ModalShell title="Knowledge Agent Onboarding" icon="🌐" onClose={onClose}>
      <p className="qa-modal__desc">
        For new partners only. Complete this form to request access to the SxG Knowledge Agent.
        Unsupported scenarios will be discussed and evaluated separately.
      </p>
      <div className="qa-form">

        <label className="qa-form__label">Team Name <span className="qa-form__req">*</span></label>
        <input className="qa-form__input" placeholder="e.g. Surface – Device Support" value={form.teamName} onChange={set('teamName')} />

        <label className="qa-form__label">Preferred Calling Method <span className="qa-form__req">*</span></label>
        <div className="qa-radio-group">
          {CALLING_METHODS.map(m => (
            <label key={m.value} className={`qa-radio-card${form.callingMethod === m.value ? ' qa-radio-card--selected' : ''}`}>
              <input
                type="radio"
                name="callingMethod"
                value={m.value}
                checked={form.callingMethod === m.value}
                onChange={set('callingMethod')}
                className="qa-radio-input"
              />
              <div>
                <p className="qa-radio-label">{m.label}</p>
                <p className="qa-radio-desc">{m.description}</p>
              </div>
            </label>
          ))}
        </div>

        <label className="qa-form__label">Purpose &amp; Where It Will Be Used <span className="qa-form__req">*</span></label>
        <textarea className="qa-form__textarea" rows={3} placeholder="Describe the purpose of calling the Knowledge Agent and where it will be integrated" value={form.purpose} onChange={set('purpose')} />

        <label className="qa-form__label">MCS Org Name</label>
        <input className="qa-form__input" placeholder="Your MCS org name" value={form.mcsOrgName} onChange={set('mcsOrgName')} />

        {form.callingMethod === 'v2' ? (
          <>
            <label className="qa-form__label">NPA Account</label>
            <input className="qa-form__input" placeholder="NPA account for Execute CoPilot and Wait (V2)" value={form.npaAccount} onChange={set('npaAccount')} />
          </>
        ) : (
          <>
            <label className="qa-form__label">MCP Access Obtained?</label>
            <select className="qa-form__select" value={form.mcpAccessObtained} onChange={set('mcpAccessObtained')}>
              <option>No</option>
              <option>Yes</option>
            </select>
          </>
        )}

        <label className="qa-form__label">Environment</label>
        <select className="qa-form__select" value={form.environment} onChange={set('environment')}>
          <option>Pre-Production</option>
          <option>Production</option>
        </select>

        <label className="qa-form__label">Expected Requests per Second (RPS)</label>
        <input className="qa-form__input" type="number" min={0} placeholder="e.g. 10" value={form.rps} onChange={set('rps')} />

        {status === 'error' && (
          <p className="qa-form__error">Something went wrong submitting your request. Please try again.</p>
        )}

        <div className="qa-form__footer">
          <button className="qa-btn qa-btn--primary" disabled={!isValid || status === 'sending'} onClick={submit}>
            {status === 'sending' ? 'Submitting…' : 'Submit Request'}
          </button>
          <button className="qa-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </ModalShell>
  );
}

function KnowledgeBotModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalShell title="Knowledge Bot" icon="🤖" onClose={onClose}>
      <div className="qa-bot-placeholder">
        <span className="qa-bot-placeholder__icon">🤖</span>
        <h3 className="qa-bot-placeholder__title">Coming Soon</h3>
        <p className="qa-bot-placeholder__desc">
          The Knowledge Bot will open a <strong>Microsoft Teams chat</strong> where you can ask self-serve questions about content health, knowledge gaps, blocked articles, and more — powered by the SxG Knowledge Agent.
        </p>
        <div className="qa-bot-placeholder__capabilities">
          <p className="qa-bot-placeholder__cap-title">What you'll be able to ask:</p>
          <ul className="qa-bot-placeholder__cap-list">
            <li>What articles are currently blocked and why?</li>
            <li>Which LOBs have the most content gaps?</li>
            <li>How do I request new content or report an issue?</li>
            <li>What's the quality score trend for my team?</li>
          </ul>
        </div>
        {CONFIG.TEAMS_BOT_URL ? (
          <a
            className="qa-btn qa-btn--primary qa-bot-placeholder__cta"
            href={CONFIG.TEAMS_BOT_URL}
            target="_blank"
            rel="noreferrer"
            onClick={onClose}
          >
            Open in Teams ↗
          </a>
        ) : (
          <p className="qa-bot-placeholder__soon">Teams integration in progress — check back soon.</p>
        )}
      </div>
    </ModalShell>
  );
}

// ── Main QuickActions bar ────────────────────────────────────────────────────

const ACTIONS = [
  { type: 'add' as ActionType,      icon: '➕', label: 'Content Ingestion Request', sub: 'Onboard new KA content',              color: 'green'  },
  { type: 'remove' as ActionType,   icon: '🗑️', label: 'Content Removal Request',   sub: 'Flag content for removal',             color: 'red'    },
  { type: 'feedback' as ActionType, icon: '💬', label: 'Give Feedback',             sub: 'Share dashboard feedback',             color: 'blue'   },
  { type: 'feature' as ActionType,  icon: '🚀', label: 'Feature Request',           sub: 'Suggest an enhancement',               color: 'purple' },
  { type: 'onboard' as ActionType,  icon: '🌐', label: 'New Partner Onboarding',    sub: 'Request KA access — new partners only', color: 'orange' },
  { type: 'bot' as ActionType,      icon: '🤖', label: 'Knowledge Bot',             sub: 'Self-serve Q&A',                       color: 'teal'   },
];

export function QuickActions() {
  const [open, setOpen] = useState<ModalState | null>(null);

  return (
    <>
      <div className="quick-actions">
        <div className="quick-actions__inner">
          {ACTIONS.map(a => (
            <button
              key={a.type}
              className={`quick-actions__btn quick-actions__btn--${a.color}`}
              onClick={() => setOpen({ type: a.type })}
            >
              <span className="quick-actions__icon">{a.icon}</span>
              <span className="quick-actions__label">{a.label}</span>
              <span className="quick-actions__sub">{a.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {open?.type === 'add'      && <AddContentModal     onClose={() => setOpen(null)} />}
      {open?.type === 'remove'   && <RemoveContentModal  onClose={() => setOpen(null)} />}
      {open?.type === 'feedback' && <FeedbackModal       onClose={() => setOpen(null)} />}
      {open?.type === 'feature'  && <FeatureRequestModal onClose={() => setOpen(null)} />}
      {open?.type === 'onboard'  && <KAOnboardModal      onClose={() => setOpen(null)} />}
      {open?.type === 'bot'      && <KnowledgeBotModal   onClose={() => setOpen(null)} />}
    </>
  );
}
