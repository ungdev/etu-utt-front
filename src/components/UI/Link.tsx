import styles from './Link.module.scss';
import { ReactNode } from 'react';
import ReactLink from 'next/link';
import { Url } from 'next/dist/shared/lib/router/router';
import ExternalLink from '@/icons/ExternalLink';

export default function Link({
  children,
  href,
  className = '',
  noStyle = false,
  newTab = false,
  disabled = false,
}: {
  children?: ReactNode;
  href: Url;
  className?: string;
  noStyle?: boolean;
  newTab?: boolean;
  disabled?: boolean;
}) {
  return disabled ? (
    <div className={`${styles.link} ${className} ${noStyle ? styles.noStyle : ''}`}>
      <span>{children}</span>
    </div>
  ) : (
    <ReactLink
      href={href}
      className={`${styles.link} ${className} ${noStyle ? styles.noStyle : ''}`}
      target={newTab ? '_blank' : '_self'}
      rel={newTab ? 'noopener noreferrer' : undefined}>
      <span>{children}</span>
      {newTab ? <ExternalLink className={styles.icon} /> : <></>}
    </ReactLink>
  );
}
