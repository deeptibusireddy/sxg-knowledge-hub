import { Subtitle1, Title2 } from '@fluentui/react-components';
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
        <Title2 as="h2" className="section-header__title" block>
          {title}
        </Title2>
        {subtitle && (
          <Subtitle1 as="p" className="section-header__subtitle" block>
            {subtitle}
          </Subtitle1>
        )}
      </div>
    </div>
  );
}
