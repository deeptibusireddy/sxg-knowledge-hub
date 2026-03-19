function escapeCsvValue(value: unknown): string {
  const str = Array.isArray(value) ? value.join(', ') : String(value ?? '');
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

export function exportToCsv<T extends object>(
  filename: string,
  columns: Array<{ key: keyof T; header: string }>,
  rows: T[],
) {
  const header = columns.map(c => escapeCsvValue(c.header)).join(',');
  const body = rows.map(row =>
    columns.map(c => escapeCsvValue(row[c.key])).join(',')
  );
  const csv = [header, ...body].join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
