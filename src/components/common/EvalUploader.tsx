import { useRef, useState } from 'react';
import type { EvalDataset } from '../sections/EvalResultsSection';
import './EvalUploader.css';

interface Props {
  onData: (dataset: EvalDataset) => void;
}

export function EvalUploader({ onData }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setError(null);
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const dataset = parseCsv(e.target?.result as string, file.name);
        if (dataset.rows.length === 0) { setError('No data rows found in file.'); return; }
        onData(dataset);
      } catch (err) {
        setError('Failed to parse CSV: ' + (err instanceof Error ? err.message : 'unknown error'));
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="eval-uploader">
      <div
        className={`eval-uploader__drop ${dragging ? 'eval-uploader__drop--active' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
      >
        <span className="eval-uploader__icon">📂</span>
        <div className="eval-uploader__text">
          <span className="eval-uploader__label">Drop your eval CSV here or <strong>click to browse</strong></span>
          <span className="eval-uploader__sublabel">Expected columns: <code>date, question, accuracy, relevance, coherence, fluency, intent_resolution, hate_unfairness, sexual, violence, self_harm</code></span>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          style={{ display: 'none' }}
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
      </div>
      {error && <p className="eval-uploader__error">⚠ {error}</p>}
    </div>
  );
}

function parseCsv(csv: string, fileName: string): EvalDataset {
  const lines = csv.trim().split(/\r?\n/);
  if (lines.length < 2) throw new Error('File must have a header row and at least one data row.');

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));

  const rows = lines.slice(1)
    .filter(l => l.trim())
    .map(line => {
      // Handle quoted fields containing commas
      const vals = splitCsvLine(line);
      const row: Record<string, string | number | boolean> = {};
      headers.forEach((h, i) => {
        const raw = (vals[i] ?? '').trim().replace(/^"|"$/g, '');
        // Coerce booleans
        if (raw.toLowerCase() === 'true')  { row[h] = true;  return; }
        if (raw.toLowerCase() === 'false') { row[h] = false; return; }
        // Coerce numbers
        const num = Number(raw);
        row[h] = raw !== '' && !isNaN(num) ? num : raw;
      });
      return row;
    });

  const SAFETY = ['hate_unfairness','sexual','violence','self_harm'];

  // Separate safety cols from quality metric cols
  const safetycols = headers.filter(h => SAFETY.includes(h.toLowerCase()));
  const numericCols = headers.filter(h => {
    const isNumeric = rows.slice(0, 20).every(r => typeof r[h] === 'number' || r[h] === '')
      && rows.some(r => typeof r[h] === 'number');
    return isNumeric && !safetycols.includes(h);
  });

  // Try to find a date column (column whose values look like dates)
  const dateCol = headers.find(h =>
    rows.slice(0, 5).some(r => typeof r[h] === 'string' && /^\d{4}-\d{2}-\d{2}/.test(r[h] as string))
  ) ?? null;

  // Try to find a grouping column (low-cardinality string, e.g. LOB)
  const groupCol = headers.find(h => {
    const vals = rows.map(r => r[h]).filter(v => typeof v === 'string');
    const unique = new Set(vals);
    return unique.size >= 2 && unique.size <= 20 && unique.size < rows.length * 0.3;
  }) ?? null;

  return { fileName, rows: rows as import('../sections/EvalResultsSection').EvalRow[], headers, numericCols, safetycols, dateCol, groupCol };
}

function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let cur = '';
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') { inQuote = !inQuote; }
    else if (line[i] === ',' && !inQuote) { result.push(cur); cur = ''; }
    else { cur += line[i]; }
  }
  result.push(cur);
  return result;
}
