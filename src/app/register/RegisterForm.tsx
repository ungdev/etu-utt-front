'use client';

import { useState } from 'react';
import { useAppDispatch } from '@/lib/hooks';
import { register } from '@/module/session';

export default function RegisterForm() {
  const dispatch = useAppDispatch();
  const [lastname, setLastname] = useState('');
  const [firstname, setFirstname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  return (
    <div>
      <label>Nom</label>
      <input value={lastname} onChange={(v) => setLastname(v.target.value)} />
      <label>Prénom</label>
      <input value={firstname} onChange={(v) => setFirstname(v.target.value)} />
      <label>Nom d'utilisateur</label>
      <input value={username} onChange={(v) => setUsername(v.target.value)} />
      <label>Mot de passe</label>
      <input value={password} onChange={(v) => setPassword(v.target.value)} />
      <label>Confirmation du mot de passe</label>
      <input value={passwordConfirmation} onChange={(v) => setPasswordConfirmation(v.target.value)} />
      <button onClick={() => dispatch(register(lastname, firstname, username, password))}>Créer un compte</button>
    </div>
  );
}
