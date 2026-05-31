'use client';
import { useAssosOfUser } from '@/api/users/assosOfUser';
import { useParams } from 'next/navigation';
import { useUser } from '@/api/users/getUser';
import { useAppTranslation } from '@/lib/i18n';
import Page from '@/components/utilities/Page';

export default function AssociativePage() {
  const { id: userId } = useParams<{ id: string }>();
  const associations = useAssosOfUser(userId);
  const user = useUser(userId);
  const { t } = useAppTranslation();
  if (!user) {
    return false;
  }
  return (
    <Page>
      <h1>{t('users:assos.title', { name: `${user?.firstName} ${user?.lastName}` })}</h1>
      {associations.length
        ? associations.map((asso) => (
            <div key={asso.asso.name}>
              {asso.asso.name} <br />
              {asso.role}
            </div>
          ))
        : t('users:assos.noAssos')}
    </Page>
  );
}
