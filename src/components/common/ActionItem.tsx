import type { ActionItem as ActionItemType } from '../../types';
import './ActionItem.css';

const PERSONA_COLORS: Record<string, string> = {
  'Content Manager': '#ca5010',
  'Support Engineer': '#0078d4',
  'LOB Leader': '#8764b8',
  'Program Leader': '#d83b01',
};

const PERSONA_INITIALS: Record<string, string> = {
  'Content Manager': 'CM',
  'Support Engineer': 'SE',
  'LOB Leader': 'LL',
  'Program Leader': 'PL',
};

interface Props {
  item: ActionItemType;
}

export function ActionItem({ item }: Props) {
  const { priority, persona, description } = item;

  const priorityDot = priority === 'High' ? '🔴' : priority === 'Medium' ? '🟡' : '🟢';
  const personaColor = PERSONA_COLORS[persona] ?? '#888';
  const personaInitials = PERSONA_INITIALS[persona] ?? '??';

  return (
    <div className={`action-item action-item--${priority.toLowerCase()}`}>
      <div className="action-item__header">
        <span className="action-item__priority">{priorityDot} {priority}</span>
        <span
          className="action-item__persona-badge"
          style={{ background: personaColor + '18', color: personaColor, border: `1px solid ${personaColor}40` }}
        >
          {personaInitials} {persona}
        </span>
      </div>
      <p className="action-item__desc">{description}</p>
    </div>
  );
}
