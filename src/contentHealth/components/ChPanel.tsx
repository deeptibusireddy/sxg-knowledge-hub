import { type ReactNode } from 'react';
import { Card, Caption1, Subtitle1 } from '@fluentui/react-components';

/**
 * Shared Fluent-styled wrapper for every Content Health panel.
 *
 * Replaces the per-panel `<section className="ch-panel">` + `<header>` + <h3>`
 * markup so all 22 panels share the same Card chrome and semantic typography.
 *
 * Internal panel content (tables, heatmaps, Recharts wrappers) is unchanged —
 * only the outer container + header is unified here.
 */
interface Props {
  title: string;
  subtitle?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function ChPanel({ title, subtitle, className, children }: Props) {
  return (
    <Card
      className={`ch-panel${className ? ` ${className}` : ''}`}
      appearance="filled"
    >
      <header className="ch-panel__header">
        <Subtitle1 as="h3" block className="ch-panel__title">
          {title}
        </Subtitle1>
        {subtitle && (
          <Caption1 as="p" block className="ch-panel__subtitle">
            {subtitle}
          </Caption1>
        )}
      </header>
      {children}
    </Card>
  );
}
