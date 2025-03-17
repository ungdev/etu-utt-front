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
  external = false,
}: {
  children?: ReactNode;
  href: Url;
  className?: string;
  noStyle?: boolean;
  external?: boolean;
}) {
  return (
    <ReactLink
      href={href}
      className={`${styles.link} ${className} ${noStyle ? styles.noStyle : ''}`}
      target={external ? '_blank' : ''}>
      <span>{children}</span>
      {external ? <ExternalLink className={styles.icon} /> : <></>}
    </ReactLink>
  );
}
