import styles from './WidgetLayout.module.scss';
import { ReactNode, useEffect, useRef } from 'react';

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
  const currentScale = useRef<number>(1);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (!childRef.current) return;
      const scale =
        Math.min(
          childRef.current.clientWidth / childRef.current.scrollWidth,
          (rootRef.current!.clientHeight - titleRef.current!.clientHeight - subtitleRef.current!.clientHeight - 55) /
            childRef.current.scrollHeight,
          1 / currentScale.current,
        ) * currentScale.current;
      childRef.current!.style.scale = `${scale}`;
    });
    resizeObserver.observe(rootRef.current!);
    return () => resizeObserver.disconnect();
  }, [childRef.current]);
  return (
    <div className={styles.widget} ref={rootRef}>
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
  );
}
