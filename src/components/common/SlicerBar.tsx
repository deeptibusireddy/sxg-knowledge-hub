import type { SlicerState, DateRange, Severity } from '../../types';
import './SlicerBar.css';

const LOBS = ['all', 'Azure', 'Microsoft 365', 'Windows', 'Surface', 'Xbox', 'Intune'];
const DATE_RANGES: { value: DateRange; label: string }[] = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: 'all', label: 'All time' },
];
const SEVERITIES: Severity[] = ['all', 'High', 'Medium', 'Low'];

interface Props {
  state: SlicerState;
  onChange: (next: SlicerState) => void;
}

export function SlicerBar({ state, onChange }: Props) {
  return (
    <div className="slicer-bar surface">
      <div className="slicer-bar__group">
        <label className="slicer-bar__label" htmlFor="slicer-lob">Line of Business</label>
        <select
          id="slicer-lob"
          className="slicer-bar__select"
          value={state.lob}
          onChange={e => onChange({ ...state, lob: e.target.value })}
        >
          {LOBS.map(l => (
            <option key={l} value={l}>{l === 'all' ? 'All LOBs' : l}</option>
          ))}
        </select>
      </div>

      <div className="slicer-bar__divider" />

      <div className="slicer-bar__group">
        <label className="slicer-bar__label" htmlFor="slicer-date">Date Range</label>
        <select
          id="slicer-date"
          className="slicer-bar__select"
          value={state.dateRange}
          onChange={e => onChange({ ...state, dateRange: e.target.value as DateRange })}
        >
          {DATE_RANGES.map(d => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>
      </div>

      <div className="slicer-bar__divider" />

      <div className="slicer-bar__group">
        <label className="slicer-bar__label" htmlFor="slicer-severity">Severity</label>
        <select
          id="slicer-severity"
          className="slicer-bar__select"
          value={state.severity}
          onChange={e => onChange({ ...state, severity: e.target.value as Severity })}
        >
          {SEVERITIES.map(s => (
            <option key={s} value={s}>{s === 'all' ? 'All Severities' : s}</option>
          ))}
        </select>
      </div>

      <div className="slicer-bar__spacer" />
      <span className="slicer-bar__hint">Filters apply to all visuals</span>
    </div>
  );
}
