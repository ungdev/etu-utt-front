import styles from './Link.module.scss';
import { ReactNode } from 'react';
import ReactLink from 'next/link';
import { Url } from 'next/dist/shared/lib/router/router';

export default function Link({
  children,
  href,
  className = '',
}: {
  children?: ReactNode;
  href: Url;
  className?: string;
}) {
  return (
    <ReactLink href={href} className={`${styles.link} ${className}`}>
      {children}
    </ReactLink>
  );
}
