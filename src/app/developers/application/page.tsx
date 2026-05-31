'use client';

import styles from './style.module.scss';
import { IconCopy } from 'obra-icons-react';
import useApplications from '@/api/auth/applications/fetchApplications';
import Trash from '@/icons/Trash';
import Input from '@/components/UI/Input';
import { useState } from 'react';
import Button from '@/components/UI/Button';
import createApplication from '@/api/auth/applications/createApplication';
import { useAPI } from '@/api/api';
import { updateApplicationToken } from '@/api/auth/applications/updateToken';
import Icons from '@/icons';
import { useConnectedUser } from '@/module/user';
import Page from '@/components/utilities/Page';

export default function ApplicationsPage() {
  const loggedIn = !!useConnectedUser();
  const [applications, setApplications] = useApplications();
  const [newApplicationName, setNewApplicationName] = useState<string>('');
  const [redirectUrl, setRedirectUrl] = useState<string>('');
  const api = useAPI();
  const [token, setToken] = useState<string | undefined | null>(undefined);

  if (!loggedIn || !applications) {
    return false;
  }

  const updateToken = async (applicationId: string) => {
    const newToken = await updateApplicationToken(api, applicationId);
    setToken(newToken);
  };

  return (
    <Page className={styles.applicationsPage}>
      <div className={styles.applicationsList}>
        {applications.map((application) => (
          <div key={application.id} className={styles.application}>
            <div>{application.id}</div>
            <div>{application.name}</div>
            <div>{application.redirectUrl}</div>
            <Button className={styles.generateToken} onClick={() => updateToken(application.id)}>
              Générer un nouveau token
            </Button>
            <Button className={styles.trash} disabled>
              <Trash className={styles.icon} />
            </Button>
          </div>
        ))}
      </div>
      <div>
        <h2>Créer une application</h2>
        <p>Nom :</p>
        <Input value={newApplicationName} onChange={setNewApplicationName} />
        <p>Url de redirection :</p>
        <Input value={redirectUrl} onChange={setRedirectUrl} />
        <Button
          onClick={async () => {
            const application = await createApplication(api, newApplicationName, redirectUrl);
            if (application) {
              setApplications((applications) => (applications ? [...applications, application] : [application]));
              setNewApplicationName('');
              setRedirectUrl('');
            }
          }}>
          Créer
        </Button>
      </div>
      {token && (
        <div className={styles.tokenPopupWrapper} onClick={(e) => e.target === e.currentTarget && setToken(null)}>
          <div className={styles.popupContent}>
            {token}
            <div className={styles.buttons}>
              <Button onClick={() => navigator.clipboard.writeText(token)}>
                <IconCopy />
              </Button>
              <Button onClick={() => setToken(null)}>Ok</Button>
            </div>
          </div>
        </div>
      )}
    </Page>
  );
}
