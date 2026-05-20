'use client';

import Link from '@/components/UI/Link';
import Page from '@/components/utilities/Page';

export default function DeveloperPage() {
  return (
    <Page>
      <p>
        Ces liens pourraient vous être utile si vous êtes développeur : <br />
        <Link href={'developers/application'}>Vos applications</Link>
      </p>
    </Page>
  );
}
