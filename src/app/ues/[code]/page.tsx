'use client';

import styles from './style.module.scss';
import { useParams } from 'next/navigation';
import useFetchUE from '@/api/ue/fetchUEs';
import { useAppSelector } from '@/lib/hooks';
import Comments from '@/app/ues/[code]/Comments';
import { useAppTranslation } from '@/lib/i18n';
import { useUERateCriteria } from '@/module/ueRateCriterion';
import { UERateCriterion } from '@/api/ueRateCriterion/ueRateCriterion.interface';
import { CSSProperties } from 'react';
import Star from '@/icons/Star';

export default function UEDetailsPage() {
  const params = useParams();
  const { t } = useAppTranslation();
  const logged = useAppSelector((state) => state.session.logged);
  const ue = useFetchUE(params.code as string);
  const criteria = useUERateCriteria();
  if (!ue || !criteria) {
    return false;
  }
  console.log(ue.starVotes);
  return (
    <div className={styles.page}>
      <h1>{ue.code}</h1>
      <p>{ue.name}</p>
      <div className={styles.divider} />
      <div className={styles.info}>
        <div className={styles.generalInfo}>
          <h2>Informations générales</h2>
          <p>
            {t('ues:detailed.description')} : {ue.info.comment}
            <br />
            {t('ues:detailed.program')} : {ue.info.program}
            <br />
            {t('ues:detailed.objectives')} : {ue.info.objectives}
            <br />
            {t('ues:detailed.taughtIn')} : {ue.info.languages}
            <br />
            {t('ues:detailed.minors')} : {ue.info.minors}
            <br />
            {t('ues:detailed.credits')} :{' '}
            {ue.credits.map((credits) => `${credits.credits}${credits.category.code}`).join(', ')}
          </p>
        </div>
        <div className={styles.workTime}>
          <h2>{t('ues:detailed.workTime')}</h2>
          {ue.workTime ? (
            <>
              <p>CM : {ue.workTime.cm}</p>
              <p>TD : {ue.workTime.td}</p>
              <p>TP : {ue.workTime.tp}</p>
              <p>
                {t('ues:detailed.workTime.project')} : {ue.workTime.project}
              </p>
              <p>THE : {ue.workTime.the}</p>
            </>
          ) : (
            t('ues:detailed.noWorkingTimeInfo')
          )}
        </div>
        <div className={styles.takeUEInfo}>
          <h2>Information pour faire l'UE</h2>
          {t('ues:detailed.semester')} :{' '}
          {ue.openSemester.find((semester) => new Date(semester.start).getTime() > Date.now())?.code ??
            t('ues:detailed.semester.none')}{' '}
          <br />
          {t('ues:detailed.inscriptionCode')} : {ue.inscriptionCode} <br />
          {t('ues:detailed.branchOptions')} : {ue.branchOption.map((branchOption) => branchOption.code).toString()}{' '}
          <br />
          {t('ues:detailed.requirements')} :{' '}
          {ue.info.requirements.length === 0 ? t('ues:detailed.requirements.none') : ue.info.requirements.toString()}
        </div>
      </div>
      <div className={styles.thoughts}>
        <h2>Avis des autres étudiants</h2>
        <div className={styles.rates}>
          {Object.entries(ue.starVotes).map(([id, value]) => (
            <div key={id}>
              <h3>{criteria.find((criterion): criterion is UERateCriterion => criterion.id === id)?.name}</h3>
              <div className={styles.icons}>
                {new Array(5).fill(0).map((_, i) => (
                  <div style={{ '--filled': value < i ? 0 : value > i + 1 ? 1 : value - i } as CSSProperties} key={i}>
                    <Star />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {logged ? <Comments code={params.code as string} /> : t('ues:detailed.comments.loginRequired')}
      </div>
    </div>
  );
}
