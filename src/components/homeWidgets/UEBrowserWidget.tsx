import style from './UEBrowserWidget.module.scss';
import { useAppTranslation } from '@/lib/i18n';
import Input from '@/components/UI/Input';
import { useState } from 'react';

export default function UEBrowserWidget() {
  const { t } = useAppTranslation();
  const [search, setSearch] = useState('');
  return (
    <div>
      <h2>{t('common:navbar.uesBrowser')}</h2>
      <Input value={search} onChange={setSearch} />
    </div>
  );
}
