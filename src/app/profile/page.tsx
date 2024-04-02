'use client';
import { usePageSettings } from '@/module/pageSettings';
import { useConnectedUser } from '@/module/user';
import { setProfilePicture } from '@/api/profile/setProfilePicture';
import { useAPI } from '@/api/api';

export default function ProfilePage() {
  usePageSettings({});
  const user = useConnectedUser();
  const api = useAPI();
  return (
    <div>
      <h1>Profile</h1>
      <img src="/images/default-avatar.jpg" alt="Default avatar" />
      <input type="file" onChange={(e) => e.target.files && setProfilePicture(api, e.target.files[0])} />
    </div>
  );
}
