'use client';

import styles from './style.module.scss';
import Page from '@/components/utilities/Page';
import WidgetBoard from '@/components/homeWidgets/WidgetBoard';

export default function HomePage() {
  return (
    <Page needsLoading={true} className={styles.page}>
      <WidgetBoard />
    </Page>
  );
}
