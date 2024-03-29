import { ReactNode, useEffect, useRef } from 'react';

export default function FocusableDiv({
  className = '',
  children,
  onFocusLost = () => {},
  autoFocus = false,
}: {
  className?: string;
  children?: ReactNode;
  onFocusLost?: () => void;
  autoFocus?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onFocusLostWrapper = useRef<() => void>(onFocusLost);
  onFocusLostWrapper.current = onFocusLost;
  const focused = useRef<boolean>(autoFocus);
  useEffect(() => {
    const clickListener = (event: MouseEvent): void => {
      if (!event?.target) return;
      const isFocus = ref.current!.contains(event.target as Node);
      if (isFocus !== focused.current) {
        focused.current = isFocus;
        if (!isFocus) {
          onFocusLostWrapper.current();
        }
      }
    };
    document.addEventListener('click', clickListener);
    return () => document.removeEventListener('click', clickListener);
  }, []);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
