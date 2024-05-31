import styles from './WidgetLayout.module.scss';
import { ReactNode, useEffect, useMemo, useRef } from 'react';
import { isClientSide } from '@/utils/environment';

export function WidgetLayout({
  title,
  subtitle,
  children = false,
  className = '',
}: {
  title: string;
  subtitle: string;
  children?: ReactNode;
  className?: string;
}) {
  const childRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const subrootRef = useRef<HTMLDivElement>(null);
  const currentScale = useRef<number>(1);
  const observer = useMemo<ResizeObserver | undefined>(
    () =>
      isClientSide()
        ? new ResizeObserver(function () {
            if (!rootRef.current || !subrootRef.current) {
              return;
            }
            const scaleX = (rootRef.current.clientWidth - 20) / subrootRef.current.scrollWidth;
            const scaleY = (rootRef.current.clientHeight - 30) / subrootRef.current.scrollHeight;
            console.log(scaleX, scaleY);
            currentScale.current = Math.min(scaleX, scaleY);
            subrootRef.current.style.width = `${(rootRef.current.clientWidth - 20) / scaleY}px`;
            subrootRef.current.style.height = `${(rootRef.current.clientHeight - 30) / scaleX}px`;
            subrootRef.current.style.scale = `${currentScale.current}`;
          })
        : undefined,
    [isClientSide()],
  );
  useEffect(() => {
    if (!rootRef.current || !observer) {
      return;
    }
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, [rootRef.current, observer]);
  return (
    <div className={styles.widget} ref={rootRef}>
      <div className={styles.inside} ref={subrootRef}>
        <h2 className={styles.title} ref={titleRef}>
          {title}
        </h2>
        <p className={styles.subtitle} ref={subtitleRef}>
          {subtitle}
        </p>
        <div className={styles.child} ref={childRef}>
          <div className={className}>{children}</div>
        </div>
      </div>
    </div>
  );
}
