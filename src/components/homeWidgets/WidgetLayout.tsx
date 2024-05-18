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
  const ref = useRef<HTMLDivElement>();
  useEffect(() => {
    if (!ref.current) return;
    if (title !== 'Trombinoscope') return;
    console.log(ref.current);
    //for (let i = 0; i < ref.current?.childElementCount; i++) {
    //  ref.current?.childNodes[i].scale = `${ref.current.clientWidth / ref.current.scrollWidth}`;
    //}
    // ref.current.style.scale = `${ref.current?.clientWidth / ref.current?.scrollWidth}`;
  }, [ref.current]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      const scaleX = ref.current!.clientWidth / ref.current!.scrollWidth;
      const scaleY = ref.current!.clientHeight / ref.current!.scrollHeight;
      if (scaleX < scaleY) {
        ref.current!.style.width = `${(scaleY / scaleX) * 100}%`;
        ref.current!.style.height = '';
      } else {
        ref.current!.style.height = `${(scaleX / scaleY) * 100}%`;
        ref.current!.style.width = '';
      }
      ref.current!.style.scale = `${Math.min(ref.current!.clientWidth / ref.current!.scrollWidth, ref.current!.clientHeight / ref.current!.scrollHeight)}`;
    });
    resizeObserver.observe(ref.current!);
    return () => resizeObserver.disconnect();
  }, []);
  return (
    <div className={styles.widget}>
      <div className={styles.resizableWrapper} ref={ref}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
        <div className={className}>{children}</div>
      </div>
    </div>
  );
}
