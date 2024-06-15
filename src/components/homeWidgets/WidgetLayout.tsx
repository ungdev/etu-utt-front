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
  const resizableRef = useRef<HTMLDivElement>(null);
  const currentScale = useRef<number>(1);
  const observer = useMemo<ResizeObserver | undefined>(
    () =>
      isClientSide()
        ? new ResizeObserver(function () {
            if (!rootRef.current || !resizableRef.current) {
              return;
            }
            const scaleX = Math.min((rootRef.current.clientWidth - 20) / resizableRef.current.scrollWidth, 1);
            const scaleY = Math.min((rootRef.current.clientHeight - 30) / resizableRef.current.scrollHeight, 1);
            currentScale.current = Math.min(scaleX, scaleY);
            resizableRef.current.style.width = `${(rootRef.current.clientWidth - 20) / scaleY}px`;
            resizableRef.current.style.height = `${(rootRef.current.clientHeight - 30) / scaleX}px`;
            resizableRef.current.style.scale = `${currentScale.current}`;
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
      <div className={styles.resizable} ref={resizableRef}>
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
