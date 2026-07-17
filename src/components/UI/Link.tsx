import styles from './Link.module.scss';
import { ReactNode } from 'react';
import ReactLink from 'next/link';
import { Url } from 'next/dist/shared/lib/router/router';
import { IconExternalLink } from 'obra-icons-react';

export default function Link({
  children,
  href,
  className = '',
  noStyle = false,
  external = false,
  disabled = false,
}: {
  children?: ReactNode;
  href: Url;
  className?: string;
  noStyle?: boolean;
  external?: boolean;
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
      target={external ? '_blank' : '_self'}
      rel={external ? 'noopener noreferrer' : undefined}>
      <span>{children}</span>
      {external ? <IconExternalLink className={styles.icon} /> : <></>}
    </ReactLink>
  );
}
