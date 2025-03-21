'use client';

import useApplications from '@/api/auth/applications/fetchApplications';
import { usePageSettings } from '@/module/pageSettings';
import Trash from '@/icons/Trash';
import Input from '@/components/UI/Input';
import { useState } from 'react';
import Button from '@/components/UI/Button';
import createApplication from '@/api/auth/applications/createApplication';
import { useAPI } from '@/api/api';

export default function ApplicationsPage() {
  usePageSettings({});
  const applications = useApplications();
  const [newApplicationName, setNewApplicationName] = useState<string>('');
  const api = useAPI();

  if (!applications) {
    return false;
  }

  return (
    <div>
      <div>
        {applications.map((application) => (
          <div key={application.id}>
            {application.name} <Trash />
          </div>
        ))}
      </div>
      <div>
        <Input value={newApplicationName} onChange={setNewApplicationName} />
        <Button onClick={() => createApplication(api, newApplicationName)} />
      </div>
    </div>
  );
}
