import type { ContentHealthFilter } from '../types';
import type { LobArea } from '../../shared/contentHealth/types';

interface Props {
  value: ContentHealthFilter;
  onChange: (next: ContentHealthFilter) => void;
}

const LOBS: Array<LobArea | 'all'> = ['all', 'Azure', 'Microsoft 365', 'Windows', 'Surface', 'Xbox', 'Intune'];
const WINDOWS: Array<{ value: 30 | 90 | 365; label: string }> = [
  { value: 30, label: 'Last 30 days' },
  { value: 90, label: 'Last 90 days' },
  { value: 365, label: 'Last 12 months' },
];

export function ContentHealthSlicer({ value, onChange }: Props) {
  return (
    <div className="ch-slicer">
      <label className="ch-slicer__field">
        <span className="ch-slicer__label">LOB</span>
        <select
          value={value.lob}
          onChange={(e) => onChange({ ...value, lob: e.target.value as LobArea | 'all' })}
        >
          {LOBS.map((l) => (
            <option key={l} value={l}>{l === 'all' ? 'All LOBs' : l}</option>
          ))}
        </select>
      </label>
      <label className="ch-slicer__field">
        <span className="ch-slicer__label">Window</span>
        <select
          value={value.windowDays}
          onChange={(e) => onChange({ ...value, windowDays: Number(e.target.value) as 30 | 90 | 365 })}
        >
          {WINDOWS.map((w) => (
            <option key={w.value} value={w.value}>{w.label}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
