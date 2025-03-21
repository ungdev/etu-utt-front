'use client';

import { usePageLoaded, usePageSettings, useSearchParam } from '@/module/pageSettings';
import useApplication from '@/api/auth/applications/getApplication';
import { notFound, useRouter } from 'next/navigation';
import Button from '@/components/UI/Button';
import createApiKey from '@/api/auth/createApiKey';
import { useAPI } from '@/api/api';

export default function CreateExternalAccountPage() {
  usePageSettings({});
  //const loaded = usePageLoaded().internallyLoaded;
  const apiKeyRegistrationToken = useSearchParam('token');
  const applicationId = useSearchParam('application');
  const application = useApplication(applicationId);
  console.log("we're theeere: ", apiKeyRegistrationToken, applicationId, application);
  const api = useAPI();
  const router = useRouter();
  /*if (loaded && (!applicationId || !apiKeyRegistrationToken)) {
    console.log("not found 1", loaded, applicationId, apiKeyRegistrationToken);
    return notFound();
  }*/
  if (application === undefined) {
    return false;
  }
  if (application === null) {
    console.log("not found 2", application);
    return notFound();
  }
  return (
    <div>
      Créer une application pour {application.id} ({application.name}) ?
      <Button
        onClick={async () => {
          const redirectUrl = await createApiKey(api, applicationId, apiKeyRegistrationToken);
          if (!redirectUrl) {
            console.log('error !');
            return;
          }
          router.push(redirectUrl);
        }}>
        Oui
      </Button>
    </div>
  );
}
