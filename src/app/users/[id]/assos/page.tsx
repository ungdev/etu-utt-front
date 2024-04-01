'use client';
import { useAssosOfUser } from '@/api/users/assosOfUser';
import { useParams } from 'next/navigation';

export default function AssociativePage() {
  const { id: userId } = useParams<{ id: string }>();
  const associations = useAssosOfUser(userId);
  return (
    <>
      <h1>Associations de l'utilisateur</h1>
      {associations.length
        ? associations.map((asso) => (
            <div key={asso.asso.name}>
              {asso.asso.name} <br />
              {asso.role}
            </div>
          ))
        : "Cet utilisateur n'est membre d'aucune association."}
    </>
  );
}
