'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import styles from './style.module.scss';
import { useAsso } from '@/api/assos/fetchAsso.hook';
import Page from '@/components/utilities/Page';
import { useMembers } from '@/api/assos/fetchAssoMembers.hook';
import Icons from '@/icons';
import Link from '@/components/UI/Link';
import { useAppTranslation } from '@/lib/i18n';
import Button from '@/components/UI/Button';

export default function AssoDetailPage() {
  const params = useParams<{ assoId: string }>();
  const [asso] = useAsso(params.assoId);
  const [members] = useMembers(params.assoId);
  const [displayOldMembers, setDisplayOldMembers] = useState(false);
  const { t } = useAppTranslation();

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
                  ? `${asso?.phoneNumber}`
                      .replace(/^0/, '+33')
                      .replace(/(?!^\+)\D/g, '')
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
      {!!members.length && (
        <div className={styles.membersCard}>
          <h2>
            Membres
            <div>
              <Button onClick={() => setDisplayOldMembers(!displayOldMembers)} className={styles.toggleOldMembers}>
                {displayOldMembers ? t('assos:member.old.hide') : t('assos:member.old.display')}
              </Button>
            </div>
          </h2>
          {members.map((role) => (
            <div key={role.id} style={{ order: role.position }}>
              <h3>
                {role.isPresident ? (
                  <div className={styles.crown}>
                    <Icons.Crown />
                  </div>
                ) : (
                  ''
                )}
                {role.name}
              </h3>
              <div className={styles.members}>
                {role.members.map((member) => {
                  const isOld = member.endAt < new Date();
                  return (
                    (!isOld || displayOldMembers) && (
                      <Link key={member.id} noStyle href={`/users/${member.userid}`}>
                        <div className={styles.pictureContainer}>
                          <img />
                          <div>
                            <div>
                              {member.firstName} {member.lastName}
                            </div>
                            <div className={styles.temporal}>
                              {t(isOld ? 'assos:member.old.from' : 'assos:member.since')}
                              {member.startAt.toLocaleString(undefined, {
                                year: 'numeric',
                                month: 'long',
                              })}
                              {isOld && t('assos:member.old.to')}
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </Page>
  );
}
