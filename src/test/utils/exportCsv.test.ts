import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportToCsv } from '../../utils/exportCsv';

describe('exportToCsv', () => {
  let anchorClickSpy: ReturnType<typeof vi.fn>;
  let createdAnchor: HTMLAnchorElement;
  let capturedBlob: Blob | null = null;

  beforeEach(() => {
    capturedBlob = null;
    anchorClickSpy = vi.fn();
    createdAnchor = document.createElement('a');
    vi.spyOn(createdAnchor, 'click').mockImplementation(anchorClickSpy);
    vi.spyOn(document, 'createElement').mockReturnValue(createdAnchor);
    vi.mocked(URL.createObjectURL).mockClear();
    vi.mocked(URL.createObjectURL).mockImplementation((blob) => {
      capturedBlob = blob as Blob;
      return 'blob:mock';
    });
    vi.mocked(URL.revokeObjectURL).mockClear();
  });

  interface Row {
    id: string;
    name: string;
    value: number;
  }

  const columns = [
    { key: 'id' as keyof Row, header: 'ID' },
    { key: 'name' as keyof Row, header: 'Name' },
    { key: 'value' as keyof Row, header: 'Value' },
  ];

  async function getCsvContent(): Promise<string> {
    return capturedBlob!.text();
  }

  it('creates a link element and triggers download', () => {
    exportToCsv('test.csv', columns, [{ id: 'r1', name: 'Alice', value: 42 }]);
    expect(anchorClickSpy).toHaveBeenCalledOnce();
    expect(createdAnchor.download).toBe('test.csv');
  });

  it('produces correct CSV header row from columns', async () => {
    exportToCsv('test.csv', columns, []);
    const csv = await getCsvContent();
    expect(csv).toMatch(/^ID,Name,Value/);
  });

  it('produces correct CSV data rows', async () => {
    exportToCsv('test.csv', columns, [{ id: 'r1', name: 'Alice', value: 42 }]);
    const csv = await getCsvContent();
    expect(csv).toContain('r1,Alice,42');
  });

  it('escapes commas in values', async () => {
    exportToCsv('test.csv', columns, [{ id: 'r1', name: 'Smith, John', value: 1 }]);
    const csv = await getCsvContent();
    expect(csv).toContain('"Smith, John"');
  });

  it('escapes quotes in values', async () => {
    exportToCsv('test.csv', columns, [{ id: 'r1', name: 'He said "hi"', value: 1 }]);
    const csv = await getCsvContent();
    expect(csv).toContain('"He said ""hi"""');
  });

  it('escapes newlines in values', async () => {
    exportToCsv('test.csv', columns, [{ id: 'r1', name: 'line1\nline2', value: 1 }]);
    const csv = await getCsvContent();
    expect(csv).toContain('"line1\nline2"');
  });

  it('handles array values by joining with ", "', async () => {
    interface ArrRow { id: string; tags: string[] }
    exportToCsv<ArrRow>('test.csv', [{ key: 'tags', header: 'Tags' }], [{ id: 'r1', tags: ['a', 'b', 'c'] }]);
    const csv = await getCsvContent();
    expect(csv).toContain('"a, b, c"');
  });

  it('handles empty rows array (header only)', async () => {
    exportToCsv('test.csv', columns, []);
    const csv = await getCsvContent();
    const lines = csv.split('\n');
    expect(lines).toHaveLength(1);
    expect(lines[0]).toBe('ID,Name,Value');
  });

  it('calls URL.createObjectURL and URL.revokeObjectURL', () => {
    exportToCsv('test.csv', columns, [{ id: 'r1', name: 'Alice', value: 1 }]);
    expect(URL.createObjectURL).toHaveBeenCalledOnce();
    expect(URL.revokeObjectURL).toHaveBeenCalledOnce();
  });
});
