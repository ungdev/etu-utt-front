'use client';

import { useParams } from 'next/navigation';
import styles from './style.module.scss';
import { useAsso } from '@/api/assos/fetchAsso.hook';
import Page from '@/components/utilities/Page';
import { useMembers } from '@/api/assos/fetchAssoMembers.hook';
import Icons from '@/icons';
import Link from '@/components/UI/Link';

export default function AssoDetailPage() {
  const params = useParams<{ assoId: string }>();
  const [asso, setAsso] = useAsso(params.assoId);
  const [members, setMembers] = useMembers(params.assoId);

  return (
    <Page className={styles.page}>
      <div className={[styles.headerCard, !asso ? styles.glimmer : ''].filter((i) => i).join(' ')}>
        <img src={asso?.logo} alt={`Logo ${asso?.name}`} />
        <div className={styles.details}>
          <div>
            <h1>{asso?.name}</h1>
            <div>{asso?.description}</div>
          </div>
          <div className={styles.actionRow}>
            <Link href={asso?.website ? asso?.website.replace(/^(?:https?:\/\/)?/, 'https://') : '#'} noStyle newTab>
              <Icons.LinkExternal />
              <div>{asso?.website?.replace(/^https?:\/\/(?:www\.)?/, '')}</div>
            </Link>
            <Link href={asso?.mail ? asso?.mail.replace(/^(?:mailto:)?/, 'mailto:') : '#'} noStyle>
              <Icons.Mail />
              <div>{asso?.mail}</div>
            </Link>
            <Link
              href={
                asso?.phoneNumber
                  ? asso?.phoneNumber
                      .replace(/^0/, '+33')
                      .replace(/\D/g, '')
                      .replace(/^(?:tel:)?/, 'tel:')
                  : '#'
              }
              noStyle>
              <Icons.Phone />
              <div>{asso?.phoneNumber}</div>
            </Link>
          </div>
        </div>
      </div>
      {!!members.length && <h2>Membres</h2>}
    </Page>
  );
}
