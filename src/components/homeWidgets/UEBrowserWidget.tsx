import { useAppTranslation } from '@/lib/i18n';
import Input from '@/components/UI/Input';
import { useState } from 'react';
import { WidgetLayout } from '@/components/homeWidgets/WidgetLayout';
import { useRouter } from 'next/navigation';
import Icons from '@/icons';

export default function UEBrowserWidget() {
  const { t } = useAppTranslation();
  const router = useRouter();
  const [search, setSearch] = useState('');
  return (
    <WidgetLayout title={t('parking:ueBrowser.title')} subtitle={t('parking:ueBrowser.subtitle')}>
      <Input
        value={search}
        onChange={setSearch}
        Icon={Icons.User}
        placeholder={t('parking:ueBrowser.searchBar.placeholder')}
        onEnter={() => router.push(`/ues?q=${search}`)}
      />
    </WidgetLayout>
  );
}
