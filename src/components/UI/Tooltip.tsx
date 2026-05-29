import cssStyle from './Tooltip.module.scss';
import { ReactNode } from 'react';
import { c } from '@/utils';

export const TooltipStyle = {
  TOP: cssStyle.top,
  BOTTOM: cssStyle.bottom,
  LEFT: cssStyle.left,
  RIGHT: cssStyle.right,
  SIZE_SMALL: cssStyle.sizeSmall,
  SIZE_MEDIUM: cssStyle.sizeMedium,
  SIZE_LARGE: cssStyle.sizeLarge,
  TEXT_CENTER: cssStyle.textCenter,
  DISABLED: cssStyle.disabled,
};

export default function Tooltip({
  children = false,
  className = '',
  content = '',
  styles = undefined,
}: {
  className?: string | string[];
  content: string;
  children: ReactNode;
  styles?: undefined | keyof typeof TooltipStyle | (keyof typeof TooltipStyle)[];
}) {
  return (
    <div className={[cssStyle.tooltipContainer, className].flat().join(' ')}>
      {children}
      <div
        className={c(
          cssStyle.tooltip,
          ...(Array.isArray(styles) ? styles.map((style) => TooltipStyle[style]) : [styles && TooltipStyle[styles]]),
        )}>
        {content}
      </div>
    </div>
  );
}
