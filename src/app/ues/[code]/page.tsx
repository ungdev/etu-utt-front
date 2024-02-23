'use client';

import styles from './style.module.scss';
import { useParams } from 'next/navigation';
import useFetchUE from '@/api/ue/fetchUEs';
import { useAppSelector } from '@/lib/hooks';
import Comments from '@/app/ues/[code]/Comments';
import { useAppTranslation } from '@/lib/i18n';
import { useUERateCriteria } from '@/module/ueRateCriterion';
import { UERateCriterion } from '@/api/ueRate/ueRateCriterion.interface';
import { CSSProperties } from 'react';
import Star from '@/icons/Star';
import Button from '@/components/UI/Button';
import useGetRate from '@/api/ueRate/getUERate';
import doUERate from '@/api/ueRate/doUERate';
import deleteUERate from '@/api/ueRate/deleteUERate';

export default function UEDetailsPage() {
  const params = useParams<{ code: string }>();
  const { t } = useAppTranslation();
  const logged = useAppSelector((state) => state.session.logged);
  const [ue, refreshUE] = useFetchUE(params.code as string);
  const criteria = useUERateCriteria();
  const [myRates, setMyRates] = useGetRate(params.code);
  if (!ue || !criteria || !myRates) {
    return false;
  }
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
        <h2>Avis des étudiants</h2>
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
              <div className={styles.myRate}>
                <div className={styles.icons}>
                  {new Array(5).fill(0).map((_, i) => {
                    const myRate = myRates.find((rate) => rate.criterionId === id);
                    return (
                      <div
                        style={{ '--filled': myRate ? (myRate.value > i ? 1 : 0) : 0 } as CSSProperties}
                        key={i}
                        onClick={async () => {
                          const newRate = await doUERate(params.code, id as string, i + 1);
                          if (!newRate) return;
                          if (myRate) {
                            setMyRates(
                              myRates.map((rate) =>
                                rate.criterionId === id ? { criterionId: id as string, value: newRate.value } : rate,
                              ),
                            );
                          } else {
                            setMyRates([...myRates, { criterionId: id as string, value: newRate.value }]);
                          }
                          refreshUE();
                        }}>
                        <Star />
                      </div>
                    );
                  })}
                </div>
                {myRates.some((rate) => rate.criterionId === id) && (
                  <Button
                    className={styles.deleteRate}
                    onClick={() => {
                      if (!deleteUERate(params.code, id as string)) return;
                      setMyRates(myRates.filter((rate) => rate.criterionId !== id));
                      refreshUE();
                    }}>
                    Supprimer mon avis
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        {/*<div className={styles.myRate}>
          <div className={styles.icons}>
            {new Array(5).fill(0).map((_, i) => (
              <div
                key={i}
                onMouseEnter={(e) => {
                  let star = e.target as HTMLElement;
                  do {
                    star.classList.add(styles.hover);
                    star = star.previousElementSibling as HTMLElement;
                  } while (star);
                }}>
                <Star />
              </div>
            ))}
          </div>
        </div>*/}
        {logged ? <Comments code={params.code as string} /> : t('ues:detailed.comments.loginRequired')}
      </div>
    </div>
  );
}
