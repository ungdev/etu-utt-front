'use client';

import { usePageLoaded, useSearchParam } from '@/module/pageSettings';
import useApplication from '@/api/auth/applications/getApplication';
import { notFound, useRouter } from 'next/navigation';
import Button from '@/components/UI/Button';
import createApiKey from '@/api/auth/createApiKey';
import { useAPI } from '@/api/api';
import Page from '@/components/utilities/Page';

export default function CreateExternalAccountPage() {
  const loaded = usePageLoaded().internallyLoaded;
  const apiKeyRegistrationToken = useSearchParam('token');
  const applicationId = useSearchParam('application');
  const application = useApplication(applicationId);
  const api = useAPI();
  const router = useRouter();
  if (loaded && (!applicationId || !apiKeyRegistrationToken)) {
    return notFound();
  }
  if (application === undefined) {
    return false;
  }
  if (application === null) {
    return notFound();
  }
  return (
    <Page>
      Créer un droit d'accès pour l'application tierce {application.id} ({application.name}) ? Les opérations faites
      avec ce droit d'accès seront à votre nom. Vous pourrez gérer les informations auxquelles vous souhaiter donner
      l'accès dans vos paramètres à tout moment.
      <Button
        onClick={async () => {
          const redirectUrl = await createApiKey(api, applicationId!, apiKeyRegistrationToken!);
          if (!redirectUrl) {
            return;
          }
          router.push(redirectUrl);
        }}>
        Oui
      </Button>
    </Page>
  );
}
