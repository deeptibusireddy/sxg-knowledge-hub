import type { SlicerState, DateRange, Audience } from '../../types';
import './SlicerBar.css';

const LOBS = ['all', 'SCIM', 'A&I', 'MW', 'DAS', 'Nebula'];
const LOB_TAGS = [
  'all', 'Identity & Access', 'Billing & Subscription', 'Compliance', 'Updates',
  'Power & Performance', 'Enforcement', 'Device Enrollment', 'Copilot Scenarios',
  'Drivers', 'App Protection', 'Family Safety', 'Firmware',
];
const AUDIENCES: Audience[] = ['all', 'Commercial', 'Consumer'];
const DATA_SOURCES = ['all', 'Evergreen', 'LMC', 'Wiki', 'CMSP', 'CMA'];
const BUSINESSES = ['all', 'Cloud Platform', 'Productivity', 'Devices', 'Gaming', 'Modern Support'];
const DATE_RANGES: { value: DateRange; label: string }[] = [
  { value: '7d',     label: 'Last 7 days' },
  { value: '30d',    label: 'Last 30 days' },
  { value: '90d',    label: 'Last 90 days' },
  { value: 'all',    label: 'All time' },
  { value: 'custom', label: 'Custom range...' },
];

interface Props {
  state: SlicerState;
  onChange: (next: SlicerState) => void;
}

function hasActiveFilters(s: SlicerState) {
  return s.lob !== 'all' || s.lobTag !== 'all' || s.audience !== 'all'
    || s.dataSource !== 'all' || s.business !== 'all'
    || s.dateRange !== '30d' || s.user !== '';
}

export function SlicerBar({ state, onChange }: Props) {
  const anyActive = hasActiveFilters(state);

  const clearAll = () => onChange({
    lob: 'all', dateRange: '30d', dateFrom: '', dateTo: '',
    lobTag: 'all', audience: 'all', dataSource: 'all',
    business: 'all', user: '',
  });

  return (
    <div className="slicer-bar surface">
      <div className="slicer-bar__row">

        <div className="slicer-bar__group">
          <label className="slicer-bar__label" htmlFor="slicer-lob">Line of Business</label>
          <select id="slicer-lob" className="slicer-bar__select" value={state.lob}
            onChange={e => onChange({ ...state, lob: e.target.value })}>
            {LOBS.map(l => <option key={l} value={l}>{l === 'all' ? 'All LOBs' : l}</option>)}
          </select>
        </div>

        <div className="slicer-bar__divider" />

        <div className="slicer-bar__group">
          <label className="slicer-bar__label" htmlFor="slicer-lob-tag">LOB Tag</label>
          <select id="slicer-lob-tag" className="slicer-bar__select" value={state.lobTag}
            onChange={e => onChange({ ...state, lobTag: e.target.value })}>
            {LOB_TAGS.map(t => <option key={t} value={t}>{t === 'all' ? 'All LOB Tags' : t}</option>)}
          </select>
        </div>

        <div className="slicer-bar__divider" />

        <div className="slicer-bar__group">
          <label className="slicer-bar__label" htmlFor="slicer-audience">Audience</label>
          <select id="slicer-audience" className="slicer-bar__select" value={state.audience}
            onChange={e => onChange({ ...state, audience: e.target.value as Audience })}>
            {AUDIENCES.map(a => <option key={a} value={a}>{a === 'all' ? 'All Audiences' : a}</option>)}
          </select>
        </div>

        <div className="slicer-bar__divider" />

        <div className="slicer-bar__group">
          <label className="slicer-bar__label" htmlFor="slicer-source">Data Source</label>
          <select id="slicer-source" className="slicer-bar__select" value={state.dataSource}
            onChange={e => onChange({ ...state, dataSource: e.target.value })}>
            {DATA_SOURCES.map(s => <option key={s} value={s}>{s === 'all' ? 'All Sources' : s}</option>)}
          </select>
        </div>

        <div className="slicer-bar__divider" />

        <div className="slicer-bar__group">
          <label className="slicer-bar__label" htmlFor="slicer-business">Business</label>
          <select id="slicer-business" className="slicer-bar__select" value={state.business}
            onChange={e => onChange({ ...state, business: e.target.value })}>
            {BUSINESSES.map(b => <option key={b} value={b}>{b === 'all' ? 'All Businesses' : b}</option>)}
          </select>
        </div>

        <div className="slicer-bar__divider" />

        <div className="slicer-bar__group">
          <label className="slicer-bar__label" htmlFor="slicer-date">Date Range</label>
          <select id="slicer-date" className="slicer-bar__select" value={state.dateRange}
            onChange={e => onChange({ ...state, dateRange: e.target.value as DateRange, dateFrom: '', dateTo: '' })}>
            {DATE_RANGES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </div>

        {state.dateRange === 'custom' && (
          <>
            <div className="slicer-bar__group">
              <label className="slicer-bar__label" htmlFor="slicer-from">From</label>
              <input id="slicer-from" type="date" className="slicer-bar__input slicer-bar__date-input"
                value={state.dateFrom} onChange={e => onChange({ ...state, dateFrom: e.target.value })} />
            </div>
            <div className="slicer-bar__group">
              <label className="slicer-bar__label" htmlFor="slicer-to">To</label>
              <input id="slicer-to" type="date" className="slicer-bar__input slicer-bar__date-input"
                value={state.dateTo} min={state.dateFrom} onChange={e => onChange({ ...state, dateTo: e.target.value })} />
            </div>
          </>
        )}

        <div className="slicer-bar__divider" />

        <div className="slicer-bar__group">
          <label className="slicer-bar__label" htmlFor="slicer-user">Owner / Reviewer</label>
          <input id="slicer-user" className="slicer-bar__input" placeholder="Filter by user..."
            value={state.user} onChange={e => onChange({ ...state, user: e.target.value })} />
        </div>

        <div className="slicer-bar__spacer" />

        {anyActive && (
          <button className="slicer-bar__clear-btn" onClick={clearAll}>
            &#x2715; Clear all
          </button>
        )}
      </div>
    </div>
  );
}