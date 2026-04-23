import { Dropdown, Field, Option } from '@fluentui/react-components';
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

const lobLabel = (l: LobArea | 'all') => (l === 'all' ? 'All LOBs' : l);

export function ContentHealthSlicer({ value, onChange }: Props) {
  return (
    <div className="ch-slicer">
      <Field label="LOB" className="ch-slicer__field">
        <Dropdown
          value={lobLabel(value.lob)}
          selectedOptions={[value.lob]}
          onOptionSelect={(_, data) => {
            const next = data.optionValue as LobArea | 'all' | undefined;
            if (next) onChange({ ...value, lob: next });
          }}
        >
          {LOBS.map((l) => (
            <Option key={l} value={l} text={lobLabel(l)}>
              {lobLabel(l)}
            </Option>
          ))}
        </Dropdown>
      </Field>
      <Field label="Window" className="ch-slicer__field">
        <Dropdown
          value={WINDOWS.find((w) => w.value === value.windowDays)?.label ?? ''}
          selectedOptions={[String(value.windowDays)]}
          onOptionSelect={(_, data) => {
            const next = data.optionValue;
            if (next) {
              onChange({ ...value, windowDays: Number(next) as 30 | 90 | 365 });
            }
          }}
        >
          {WINDOWS.map((w) => (
            <Option key={w.value} value={String(w.value)} text={w.label}>
              {w.label}
            </Option>
          ))}
        </Dropdown>
      </Field>
    </div>
  );
}
