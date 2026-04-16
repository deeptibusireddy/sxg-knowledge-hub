import '@testing-library/jest-dom';

// Mock URL.createObjectURL / revokeObjectURL (not in jsdom)
global.URL.createObjectURL = vi.fn(() => 'blob:mock');
global.URL.revokeObjectURL = vi.fn();

// Mock window.open
global.open = vi.fn();

// Mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({ ok: true, json: () => Promise.resolve({}) } as Response)
);

// Mock Recharts (SVG not supported in jsdom)
vi.mock('recharts', () => {
  const React = require('react');
  const passthrough = ({ children }: any) =>
    React.createElement('div', { 'data-testid': 'recharts-mock' }, children);
  return {
    ResponsiveContainer: ({ children }: any) =>
      React.createElement('div', { 'data-testid': 'responsive-container' }, children),
    BarChart: passthrough,
    Bar: passthrough,
    LineChart: passthrough,
    Line: passthrough,
    PieChart: passthrough,
    Pie: passthrough,
    Cell: passthrough,
    XAxis: () => null,
    YAxis: () => null,
    Tooltip: () => null,
    CartesianGrid: () => null,
    Legend: () => null,
    ReferenceLine: () => null,
    ReferenceDot: () => null,
    Area: passthrough,
    AreaChart: passthrough,
    ComposedChart: passthrough,
    RadarChart: passthrough,
    Radar: passthrough,
    PolarGrid: () => null,
    PolarAngleAxis: () => null,
    PolarRadiusAxis: () => null,
    ScatterChart: passthrough,
    Scatter: passthrough,
    ZAxis: () => null,
    Brush: () => null,
    ErrorBar: () => null,
    Label: () => null,
    LabelList: () => null,
    Customized: () => null,
  };
});
