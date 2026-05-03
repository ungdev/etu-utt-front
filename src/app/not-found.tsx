'use client';

import Link from 'next/link';
import Page from '@/components/utilities/Page';
import { useAppTranslation } from '@/lib/i18n';
import styles from './not-found.module.scss';

export default function PageNotFound() {
  const { t } = useAppTranslation();
  return (
    <Page hasNavbar={false} noWrapperPadding={true} id="not-found-page" className={styles.page}>
      <div className={styles.card}>
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>{t('common:404')}</h1>
        <p className={styles.description}>{t('common:404.description')}</p>
        <Link href="/" className={styles.homeLink}>
          Retour à l'accueil
        </Link>
      </div>
    </Page>
  );
}
