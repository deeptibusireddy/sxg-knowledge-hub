import { useState } from 'react';
import './QuickActions.css';

type ActionType = 'add' | 'remove' | 'feedback' | 'feature' | 'bot';

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
  const [form, setForm] = useState({ title: '', lob: 'all', description: '', priority: 'Medium' });

  if (submitted) return (
    <ModalShell title="Request Content Addition" icon="➕" onClose={onClose}>
      <div className="qa-modal__success">
        <span className="qa-modal__success-icon">✓</span>
        <p>Your request has been submitted. The content team will review and follow up.</p>
        <button className="qa-btn qa-btn--primary" onClick={onClose}>Done</button>
      </div>
    </ModalShell>
  );

  return (
    <ModalShell title="Request Content Addition" icon="➕" onClose={onClose}>
      <p className="qa-modal__desc">Ask the content team to create or import new knowledge article content.</p>
      <div className="qa-form">
        <label className="qa-form__label">Content Title / Topic <span className="qa-form__req">*</span></label>
        <input className="qa-form__input" placeholder="e.g. Intune – Device Enrollment Troubleshooting" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />

        <label className="qa-form__label">Line of Business</label>
        <select className="qa-form__select" value={form.lob} onChange={e => setForm(f => ({ ...f, lob: e.target.value }))}>
          {['all', 'Azure', 'Microsoft 365', 'Windows', 'Surface', 'Xbox', 'Intune'].map(l => (
            <option key={l} value={l}>{l === 'all' ? 'All / Not sure' : l}</option>
          ))}
        </select>

        <label className="qa-form__label">Priority</label>
        <select className="qa-form__select" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
          {['High', 'Medium', 'Low'].map(p => <option key={p}>{p}</option>)}
        </select>

        <label className="qa-form__label">Description &amp; Business Justification <span className="qa-form__req">*</span></label>
        <textarea className="qa-form__textarea" rows={4} placeholder="Describe what content is needed and why it would be valuable..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />

        <div className="qa-form__footer">
          <button className="qa-btn qa-btn--primary" disabled={!form.title || !form.description} onClick={() => setSubmitted(true)}>Submit Request</button>
          <button className="qa-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </ModalShell>
  );
}

function RemoveContentModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ content: '', reason: '', urgency: 'Normal' });

  if (submitted) return (
    <ModalShell title="Request Content Removal" icon="🗑️" onClose={onClose}>
      <div className="qa-modal__success">
        <span className="qa-modal__success-icon">✓</span>
        <p>Removal request submitted. The content team will review within 2 business days.</p>
        <button className="qa-btn qa-btn--primary" onClick={onClose}>Done</button>
      </div>
    </ModalShell>
  );

  return (
    <ModalShell title="Request Content Removal" icon="🗑️" onClose={onClose}>
      <p className="qa-modal__desc">Request that an article or content item be removed or retired from the knowledge base.</p>
      <div className="qa-form">
        <label className="qa-form__label">Article Title or ID <span className="qa-form__req">*</span></label>
        <input className="qa-form__input" placeholder="e.g. KB0012345 or article title" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} />

        <label className="qa-form__label">Urgency</label>
        <select className="qa-form__select" value={form.urgency} onChange={e => setForm(f => ({ ...f, urgency: e.target.value }))}>
          {['Urgent – harmful content', 'High – outdated', 'Normal – cleanup'].map(u => <option key={u}>{u}</option>)}
        </select>

        <label className="qa-form__label">Reason for Removal <span className="qa-form__req">*</span></label>
        <textarea className="qa-form__textarea" rows={4} placeholder="Explain why this content should be removed..." value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} />

        <div className="qa-form__footer">
          <button className="qa-btn qa-btn--danger" disabled={!form.content || !form.reason} onClick={() => setSubmitted(true)}>Submit Request</button>
          <button className="qa-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </ModalShell>
  );
}

function FeedbackModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [text, setText] = useState('');

  if (submitted) return (
    <ModalShell title="General Feedback" icon="💬" onClose={onClose}>
      <div className="qa-modal__success">
        <span className="qa-modal__success-icon">✓</span>
        <p>Thank you for your feedback! It helps us improve the dashboard.</p>
        <button className="qa-btn qa-btn--primary" onClick={onClose}>Done</button>
      </div>
    </ModalShell>
  );

  return (
    <ModalShell title="General Feedback" icon="💬" onClose={onClose}>
      <p className="qa-modal__desc">Share your thoughts on the dashboard, data quality, or anything else.</p>
      <div className="qa-form">
        <label className="qa-form__label">Overall Rating</label>
        <div className="qa-stars">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              type="button"
              className={`qa-star${n <= (hovered || rating) ? ' qa-star--active' : ''}`}
              onMouseEnter={() => setHovered(n)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(n)}
              aria-label={`${n} star`}
            >★</button>
          ))}
        </div>

        <label className="qa-form__label">Your Feedback <span className="qa-form__req">*</span></label>
        <textarea className="qa-form__textarea" rows={5} placeholder="What's working well? What could be better?" value={text} onChange={e => setText(e.target.value)} />

        <div className="qa-form__footer">
          <button className="qa-btn qa-btn--primary" disabled={!text} onClick={() => setSubmitted(true)}>Send Feedback</button>
          <button className="qa-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </ModalShell>
  );
}

function FeatureRequestModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ title: '', useCase: '', impact: 'Medium' });

  if (submitted) return (
    <ModalShell title="Feature Request" icon="🚀" onClose={onClose}>
      <div className="qa-modal__success">
        <span className="qa-modal__success-icon">✓</span>
        <p>Feature request submitted! We review all requests during sprint planning.</p>
        <button className="qa-btn qa-btn--primary" onClick={onClose}>Done</button>
      </div>
    </ModalShell>
  );

  return (
    <ModalShell title="Feature Request" icon="🚀" onClose={onClose}>
      <p className="qa-modal__desc">Suggest a new feature or enhancement for the Knowledge Health Dashboard.</p>
      <div className="qa-form">
        <label className="qa-form__label">Feature Title <span className="qa-form__req">*</span></label>
        <input className="qa-form__input" placeholder="e.g. Email digest of weekly content gaps" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />

        <label className="qa-form__label">Expected Impact</label>
        <select className="qa-form__select" value={form.impact} onChange={e => setForm(f => ({ ...f, impact: e.target.value }))}>
          {['High', 'Medium', 'Low'].map(i => <option key={i}>{i}</option>)}
        </select>

        <label className="qa-form__label">Use Case &amp; Description <span className="qa-form__req">*</span></label>
        <textarea className="qa-form__textarea" rows={4} placeholder="Describe the problem this solves and how you'd use it..." value={form.useCase} onChange={e => setForm(f => ({ ...f, useCase: e.target.value }))} />

        <div className="qa-form__footer">
          <button className="qa-btn qa-btn--primary" disabled={!form.title || !form.useCase} onClick={() => setSubmitted(true)}>Submit Request</button>
          <button className="qa-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </ModalShell>
  );
}

const BOT_RESPONSES: Record<string, string> = {
  default: "I can help answer questions about the Knowledge Health Dashboard, content gaps, article performance, and more. Try asking something like: *What are the top blocked articles?* or *How do I request new content?*",
  blocked: "Currently there are **14 blocked articles** across all LOBs. The top reasons are missing owner approval (8) and flagged content policy terms (6). You can view the full list in the Tables section below.",
  gap: "The Content Intelligence Workspace identifies **23 content gaps** — high-value topics with no matching article. The top gaps are in Intune Device Enrollment and Azure Networking.",
  feedback: "Feedback is collected via thumbs up/down on articles in AaQ and Copilot Hub. Articles with a score below 60% are flagged for owner review.",
  content: "To request new content, close this chat and click the **➕ Request Content Addition** button. Your request goes directly to the content team.",
};

function getBotResponse(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes('block')) return BOT_RESPONSES.blocked;
  if (lower.includes('gap') || lower.includes('miss')) return BOT_RESPONSES.gap;
  if (lower.includes('feedback') || lower.includes('thumbs')) return BOT_RESPONSES.feedback;
  if (lower.includes('content') || lower.includes('add') || lower.includes('creat')) return BOT_RESPONSES.content;
  return BOT_RESPONSES.default;
}

interface ChatMessage { role: 'user' | 'bot'; text: string; }

function KnowledgeBotModal({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'bot', text: BOT_RESPONSES.default },
  ]);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(m => [...m, { role: 'user', text: userMsg }, { role: 'bot', text: getBotResponse(userMsg) }]);
  };

  return (
    <ModalShell title="Chat with Knowledge Bot" icon="🤖" onClose={onClose}>
      <p className="qa-modal__desc">Ask questions about content health, gaps, article performance, or how to use the dashboard.</p>
      <div className="qa-chat">
        <div className="qa-chat__messages">
          {messages.map((msg, i) => (
            <div key={i} className={`qa-chat__msg qa-chat__msg--${msg.role}`}>
              {msg.role === 'bot' && <span className="qa-chat__avatar">🤖</span>}
              <span className="qa-chat__bubble">{msg.text}</span>
            </div>
          ))}
        </div>
        <div className="qa-chat__input-row">
          <input
            className="qa-form__input qa-chat__input"
            placeholder="Ask the Knowledge Bot..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
          />
          <button className="qa-btn qa-btn--primary" onClick={send} disabled={!input.trim()}>Send</button>
        </div>
      </div>
    </ModalShell>
  );
}

// ── Main QuickActions bar ────────────────────────────────────────────────────

const ACTIONS = [
  { type: 'add' as ActionType,      icon: '➕', label: 'Request Content',   sub: 'Add a new article or topic', color: 'green' },
  { type: 'remove' as ActionType,   icon: '🗑️', label: 'Remove Content',    sub: 'Flag content for removal',   color: 'red' },
  { type: 'feedback' as ActionType, icon: '💬', label: 'Give Feedback',     sub: 'Share dashboard feedback',   color: 'blue' },
  { type: 'feature' as ActionType,  icon: '🚀', label: 'Feature Request',   sub: 'Suggest an enhancement',     color: 'purple' },
  { type: 'bot' as ActionType,      icon: '🤖', label: 'Knowledge Bot',     sub: 'Self-serve Q&A',            color: 'teal' },
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
      {open?.type === 'bot'      && <KnowledgeBotModal   onClose={() => setOpen(null)} />}
    </>
  );
}
