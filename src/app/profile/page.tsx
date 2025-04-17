'use client';

// import { useConnectedUser } from '@/module/user';
import { setProfilePicture } from '@/api/profile/setProfilePicture';
import { useAPI } from '@/api/api';
import { useAppTranslation } from '@/lib/i18n';
import Page from '@/components/utilities/Page';

export default function ProfilePage() {
  // const user = useConnectedUser();
  const api = useAPI();
  const { t } = useAppTranslation();
  return (
    <Page>
      <h1>{t('users:profile.title')}</h1>
      <img src="/images/default-avatar.jpg" alt="Default avatar" />
      <input type="file" onChange={(e) => e.target.files && setProfilePicture(api, e.target.files[0])} />
    </Page>
  );
}
