'use client';
import { useParams } from 'next/navigation';
import { useUser } from '@/api/users/getUser';

function userData(data: string | number | undefined | null, label: string) {
  return (
    data && (
      <>
        <strong>{label} :</strong> {data} <br />
      </>
    )
  );
}

export default function UserPage() {
  const { id: userId } = useParams<{ id: string }>();
  const user = useUser(userId);
  if (!user) {
    return false;
  }
  return (
    <div>
      <h2>Informations générales sur l'utilisateur</h2>
      <div>
        {userData(user.nickname, 'Surnom')}
        {userData(user.sex, 'Sexe')}
        {userData(user.mailUTT, 'Email UTT')}
        {userData(user.facebook, 'Email personnel')}
        {userData(user.phone, 'Téléphone')}
        {userData(user.website, 'Site web')}
        {userData(user.passions, 'Passions')}
        {userData(user.birthday, 'Date de naissance')}
        {userData(user.branch, 'Filière')}
        {userData(user.semester, 'Semestre')}
        {userData(user.branchOption, 'Option')}
      </div>
    </div>
  );
}
