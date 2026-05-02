'use client';

import Page from '@/components/utilities/Page';
import { useAppTranslation } from '@/lib/i18n';

export default function PageNotFound() {
  const { t } = useAppTranslation();
  return (
    <Page>
      <h1>{t('common:404')}</h1>
    </Page>
  );
}
