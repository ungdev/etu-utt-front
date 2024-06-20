'use client';

import styles from './style.module.scss';
import { useParams } from 'next/navigation';
import useUE from '@/api/ue/fetchUEs';
import { useAppSelector } from '@/lib/hooks';
import Comments from '@/app/ues/[code]/Comments';
import { useAppTranslation } from '@/lib/i18n';
import { useUERateCriteria } from '@/module/constantData';
import { UERateCriterion } from '@/api/ueRate/ueRateCriterion.interface';
import Button from '@/components/UI/Button';
import useGetRate from '@/api/ueRate/getUERate';
import doUERate from '@/api/ueRate/doUERate';
import deleteUERate from '@/api/ueRate/deleteUERate';
import StarRating from '@/components/StarRating';
import TextArea from '@/components/UI/TextArea';
import { ReactNode, useState } from 'react';
import sendComment from '@/api/comment/sendComment';
import { useAPI } from '@/api/api';
import { usePageSettings } from '@/module/pageSettings';
import useAnnals from '@/api/annals/fetchAnnals';
import useAnnalMetadata from '@/api/annals/fetchMetadata';
import ExamList from '@/components/ues/ExamList';
import ExamSender from '@/components/ues/ExamSender';
import Tooltip from '@/components/UI/Tooltip';
import Link from '@/components/UI/Link';

export default function UEDetailsPage() {
  usePageSettings({});
  const params = useParams<{ code: string }>();
  const { t } = useAppTranslation();
  const logged = useAppSelector((state) => state.session.logged);
  const [ue, refreshUE] = useUE(params.code as string);
  const criteria = useUERateCriteria();
  const [myRates, setMyRates] = useGetRate(params.code);
  const [writtingComment, setWrittingComment] = useState<string>('');
  const [annals, , addAnnal] = useAnnals(params.code);
  const [annalTypes, annalSemesters] = useAnnalMetadata(params.code);
  const [isAnnalUploaderOpen, setAnnalUploaderOpen] = useState(false);
  const api = useAPI();

  if (!ue) return false;

  const onRate = async (criterionId: string, hasAlreadyRated: boolean, rate: number) => {
    const newRate = await doUERate(api, params.code, criterionId as string, rate).toPromise();
    if (!newRate) return;
    if (hasAlreadyRated) {
      setMyRates(
        myRates!.map((rate) =>
          rate.criterionId === criterionId ? { criterionId: criterionId as string, value: newRate.value } : rate,
        ),
      );
    } else {
      setMyRates([...myRates!, { criterionId: criterionId as string, value: newRate.value }]);
    }
    refreshUE();
  };

  const deleteRate = async (criterionId: string) => {
    if (!(await deleteUERate(api, params.code, criterionId as string).toPromise())) return;
    setMyRates(myRates!.filter((rate) => rate.criterionId !== criterionId));
    refreshUE();
  };

  const clipboardCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>{ue.code}</h1>
          <p>{ue.name}</p>
        </div>
        <div className={styles.worktime}>
          {ue.workTime ? (
            <>
              {ue.workTime.cm && (
                <div>
                  <div>
                    {ue.workTime.cm}
                    <span>{t('ues:detailed.worktime.hour')}</span>
                  </div>
                  <Tooltip content={t('ues:detailed.worktime.cm.tooltip')}>
                    <div>{t('ues:detailed.worktime.cm')}</div>
                  </Tooltip>
                </div>
              )}
              {ue.workTime.td && (
                <div>
                  <div>
                    {ue.workTime.td}
                    <span>{t('ues:detailed.worktime.hour')}</span>
                  </div>
                  <Tooltip content={t('ues:detailed.worktime.td.tooltip')}>
                    <div>{t('ues:detailed.worktime.td')}</div>
                  </Tooltip>
                </div>
              )}
              {ue.workTime.tp && (
                <div>
                  <div>
                    {ue.workTime.tp}
                    <span>{t('ues:detailed.worktime.hour')}</span>
                  </div>
                  <Tooltip content={t('ues:detailed.worktime.tp.tooltip')}>
                    <div>{t('ues:detailed.worktime.tp')}</div>
                  </Tooltip>
                </div>
              )}
              {ue.workTime.project && (
                <div>
                  <div>
                    {ue.workTime.project}
                    <span>{t('ues:detailed.worktime.hour')}</span>
                  </div>
                  <div>{t('ues:detailed.worktime.project')}</div>
                </div>
              )}
              {ue.workTime.the && (
                <div>
                  <div>
                    {ue.workTime.the}
                    <span>{t('ues:detailed.worktime.hour')}</span>
                  </div>
                  <Tooltip content={t('ues:detailed.worktime.the.tooltip')}>
                    <div>{t('ues:detailed.worktime.the')}</div>
                  </Tooltip>
                </div>
              )}
            </>
          ) : (
            t('ues:detailed.noWorkingTimeInfo')
          )}
        </div>
      </div>
      <div className={styles.divider} />
      {!isAnnalUploaderOpen ? (
        <>
          <div className={styles.info}>
            <div>{t('ues:detailed.description')}</div>
            <div>{ue.info.comment}</div>
            <div>{t('ues:detailed.program')}</div>
            <div>{ue.info.program}</div>
            <div>{t('ues:detailed.objectives')}</div>
            <div>{ue.info.objectives}</div>
            <div>{t('ues:detailed.taughtIn')}</div>
            <div>{ue.info.languages}</div>
            <div>{t('ues:detailed.minors')}</div>
            <div className={(!ue.info.minors && styles.empty) || ''}>
              {ue.info.minors || t('ues:detailed.minors.none')}
            </div>
            <div>{t('ues:detailed.credits')}</div>
            <div>{ue.credits.map((credits) => `${credits.credits}${credits.category.code}`).join(', ')}</div>
          </div>
          <div className={styles.takeUEInfo}>
            <h2>{t('ues:detailed.dfpdata')}</h2>
            <div className={styles.info}>
              <div>{t('ues:detailed.semester')}</div>
              <div>
                {ue.openSemester.find((semester) => new Date(semester.start).getTime() > Date.now())?.code ??
                  t('ues:detailed.semester.none')}{' '}
              </div>
              <div>{t('ues:detailed.inscriptionCode')}</div>
              <div>
                <Tooltip content={t('ues:detailed.inscriptionCode.copy')}>
                  <span className={styles.clipboardCopy} onClick={() => clipboardCopy(ue.inscriptionCode)}>
                    {ue.inscriptionCode}
                  </span>
                </Tooltip>
              </div>
              <div>{t('ues:detailed.branchOptions')}</div>
              <div>{ue.branchOption.map((branchOption) => branchOption.code).join(', ')}</div>
              <div>{t('ues:detailed.requirements')}</div>
              <div>
                {ue.info.requirements.length === 0
                  ? t('ues:detailed.requirements.none')
                  : ue.info.requirements
                      .map((req) => (
                        <Link key={req} href={`/ues/${req}`}>
                          {req}
                        </Link>
                      ))
                      .reduce((prev, curr) => (prev.length ? [...prev, ', ', curr] : [curr]), [] as ReactNode[])}
              </div>
            </div>
          </div>
          <ExamList
            annals={annals}
            setAnnalUploaderOpen={setAnnalUploaderOpen}
            annalSemesters={annalSemesters}
            annalTypes={annalTypes}
          />
          <div className={styles.thoughts}>
            <h2>{t('ues:detailed.rates.title')}</h2>
            <div className={[styles.rates, !criteria && styles.error].filter((c) => c).join(' ')}>
              {criteria
                ? Object.entries(ue.starVotes).map(([id, value]) => {
                    const myRate = myRates?.find((rate) => rate.criterionId === id);
                    return (
                      <div key={id} className={styles.criterion}>
                        <h3>{criteria.find((criterion): criterion is UERateCriterion => criterion.id === id)?.name}</h3>
                        <StarRating stars={5} value={value} />
                        {myRates && (
                          <>
                            <StarRating
                              stars={5}
                              value={myRate?.value ?? 0}
                              onClick={(rate) => onRate(id as string, !!myRate, rate)}
                            />
                            {myRate && (
                              <Button className={styles.deleteRate} onClick={() => deleteRate(id as string)}>
                                {t('ues:detailed.rates.delete')}
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })
                : t('ues:detailed.rates.error')}
            </div>
            {logged ? (
              <>
                <div className={styles.writeComment}>
                  {t('ues:detailed.comments.write')}
                  <TextArea value={writtingComment} onChange={setWrittingComment} />
                  <Button onClick={() => sendComment(api, ue.code, writtingComment, false)}>
                    {t('ues:detailed.comments.write.send')}
                  </Button>
                </div>
                <Comments code={params.code as string} />
              </>
            ) : (
              t('ues:detailed.comments.loginRequired')
            )}
          </div>
        </>
      ) : (
        <ExamSender
          ueCode={params.code}
          addAnnal={addAnnal}
          setAnnalUploaderOpen={setAnnalUploaderOpen}
          annalSemesters={annalSemesters}
          annalTypes={annalTypes}
        />
      )}
    </div>
  );
}
