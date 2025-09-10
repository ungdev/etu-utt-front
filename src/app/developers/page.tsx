'use client';

import { usePageSettings } from '@/module/pageSettings';
import Link from '@/components/UI/Link';

export default function DeveloperPage() {
  usePageSettings({});
  return (
    <p>
      Ces liens pourraient vous être utile si vous êtes développeur : <br />
      <Link href={'developers/application'}>Vos applications</Link>
    </p>
  );
}
