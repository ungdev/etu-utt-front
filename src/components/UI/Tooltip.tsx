import styles from './Tooltip.module.scss';
import { ReactNode } from 'react';

export type TooltipPosition = 'left' | 'above' | 'right' | 'below';

export default function Tooltip({
  children = false,
  className = '',
  content = '',
  position = 'right',
}: {
  className?: string | string[];
  content: string;
  children: ReactNode;
  position?: TooltipPosition;
}) {
  return (
    <div className={[styles.tooltipContainer, className].flat().join(' ')}>
      {children}
      <div className={[styles.tooltip, styles[position]].join(' ')}>{content}</div>
    </div>
  );
}
