import { useAppTranslation } from '@/lib/i18n';
import Input from '@/components/UI/Input';
import { useState } from 'react';
import { WidgetLayout } from '@/components/homeWidgets/WidgetLayout';
import Button from '@/components/UI/Button';
import { useRouter } from 'next/navigation';
import Icons from '@/icons';

export default function UEBrowserWidget() {
  const { t } = useAppTranslation();
  const router = useRouter();
  const [search, setSearch] = useState('');
  return (
    <WidgetLayout title={t('common:navbar.uesBrowser')} subtitle={"L'endroit parfait pour trouver la bonne personne"}>
      <Input
        value={search}
        onChange={setSearch}
        Icon={Icons.User}
        placeholder={'Rechercher dans le trombinoscope'}
        onEnter={() => router.push(`/ues?q=${search}`)}
      />
    </WidgetLayout>
  );
}
