import './SectionHeader.css';

interface Props {
  title: string;
  subtitle?: string;
  id?: string;
}

export function SectionHeader({ title, subtitle, id }: Props) {
  return (
    <div className="section-header" id={id}>
      <div className="section-header__bar" />
      <div>
        <h2 className="section-header__title">{title}</h2>
        {subtitle && <p className="section-header__subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}
