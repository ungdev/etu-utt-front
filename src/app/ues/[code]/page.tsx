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
import { UserType } from '@/module/user';

export default function UEDetailsPage() {
  usePageSettings({});
  const params = useParams<{ code: string }>();
  const { t } = useAppTranslation();
  const logged = useAppSelector((state) => state.session.logged);
  const type = useAppSelector((state) => state.user?.type);
  const [ue, refreshUE] = useUE(params.code as string);
  const [ueofIndex, setUeofIndex] = useState(0);
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

  const setUeof = (ueof: number | string) => {
    if (typeof ueof === 'number') setUeofIndex(ueof);
  };

  return (
    <div className={styles.page}>
      <div className={styles.tabs}>
        {ue.ueofs.map((ueof, index) => (
          <div className={styles.tab} data-active={index == ueofIndex} key={ueof.code} onClick={() => setUeof(index)}>
            {ueof.code}
          </div>
        ))}
      </div>
      <div className={styles.header}>
        <div>
          <h1>{ue.code}</h1>
          <p>{ue.ueofs[ueofIndex].name}</p>
        </div>
        <div className={styles.worktime}>
          {ue.ueofs[ueofIndex].workTime ? (
            <>
              {ue.ueofs[ueofIndex].workTime.cm ? (
                <div>
                  <div>
                    {ue.ueofs[ueofIndex].workTime.cm}
                    <span>{t('ues:detailed.worktime.hour')}</span>
                  </div>
                  <Tooltip content={t('ues:detailed.worktime.cm.tooltip')}>
                    <div>{t('ues:detailed.worktime.cm')}</div>
                  </Tooltip>
                </div>
              ) : (
                <></>
              )}
              {ue.ueofs[ueofIndex].workTime.td ? (
                <div>
                  <div>
                    {ue.ueofs[ueofIndex].workTime.td}
                    <span>{t('ues:detailed.worktime.hour')}</span>
                  </div>
                  <Tooltip content={t('ues:detailed.worktime.td.tooltip')}>
                    <div>{t('ues:detailed.worktime.td')}</div>
                  </Tooltip>
                </div>
              ) : (
                <></>
              )}
              {ue.ueofs[ueofIndex].workTime.tp ? (
                <div>
                  <div>
                    {ue.ueofs[ueofIndex].workTime.tp}
                    <span>{t('ues:detailed.worktime.hour')}</span>
                  </div>
                  <Tooltip content={t('ues:detailed.worktime.tp.tooltip')}>
                    <div>{t('ues:detailed.worktime.tp')}</div>
                  </Tooltip>
                </div>
              ) : (
                <></>
              )}
              {ue.ueofs[ueofIndex].workTime.the ? (
                <div>
                  <div>
                    {ue.ueofs[ueofIndex].workTime.the}
                    <span>{t('ues:detailed.worktime.hour')}</span>
                  </div>
                  <Tooltip content={t('ues:detailed.worktime.the.tooltip')}>
                    <div>{t('ues:detailed.worktime.the')}</div>
                  </Tooltip>
                </div>
              ) : (
                <></>
              )}
              {ue.ueofs[ueofIndex].workTime.internship ? (
                <div>
                  <div>
                    {ue.ueofs[ueofIndex].workTime.internship}
                    <span>{t('ues:detailed.worktime.hour')}</span>
                  </div>
                  <div>{t('ues:detailed.worktime.internship')}</div>
                </div>
              ) : (
                <></>
              )}
              {ue.ueofs[ueofIndex].workTime.project ? (
                <div>
                  <div>{Number(ue.ueofs[ueofIndex].workTime.project)}</div>
                  <div>{t('ues:detailed.worktime.project')}</div>
                </div>
              ) : (
                <></>
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
            <div>{t('ues:detailed.program')}</div>
            <div>{ue.ueofs[ueofIndex].info.program}</div>
            <div>{t('ues:detailed.objectives')}</div>
            <div>{ue.ueofs[ueofIndex].info.objectives}</div>
            <div>{t('ues:detailed.taughtIn')}</div>
            <div>{ue.ueofs[ueofIndex].info.language}</div>
            <div>{t('ues:detailed.minors')}</div>
            <div className={(!ue.ueofs[ueofIndex].info.minors.length && styles.empty) || ''}>
              {ue.ueofs[ueofIndex].info.minors.length
                ? ue.ueofs[ueofIndex].info.minors.join(', ')
                : t('ues:detailed.minors.none')}
            </div>
            <div>{t('ues:detailed.credits')}</div>
            <div>
              {Array.from(
                new Set(ue.ueofs[ueofIndex].credits.map((credits) => `${credits.credits} ${credits.category.code}`)),
              ).join(', ')}
            </div>
          </div>
          <div className={styles.takeUEInfo}>
            <h2>{t('ues:detailed.dfpdata')}</h2>
            <div className={styles.info}>
              <div>{t('ues:detailed.semester')}</div>
              <div>
                {ue.ueofs[ueofIndex].openSemester
                  .filter((semester) => new Date(semester.end).getTime() > Date.now())
                  .map((semester) => semester.code)
                  .join(', ') || t('ues:detailed.semester.none')}{' '}
              </div>
              <div>{t('ues:detailed.siepLink')}</div>
              <div>
                <Link
                  external={true}
                  href={`https://siep.utt.fr/faces/AccesDirectNonAuth.xhtml?ir=942854&io=${ue.ueofs[ueofIndex].siepId}`}>
                  {ue.ueofs[ueofIndex].code}
                </Link>
              </div>
              <div>{t('ues:detailed.inscriptionCode')}</div>
              <div className={ue.ueofs[ueofIndex].inscriptionCode ? '' : styles.empty}>
                {ue.ueofs[ueofIndex].inscriptionCode ? (
                  <Tooltip content={t('ues:detailed.inscriptionCode.copy')}>
                    <span
                      className={styles.clipboardCopy}
                      onClick={() => clipboardCopy(ue.ueofs[ueofIndex].inscriptionCode)}>
                      {ue.ueofs[ueofIndex].inscriptionCode}
                    </span>
                  </Tooltip>
                ) : (
                  t('ues:detailed.inscriptionCode.empty')
                )}
              </div>
              <div>{t('ues:detailed.branchOptions')}</div>
              <div>
                {ue.ueofs[ueofIndex].credits
                  .flatMap((credit) => credit.branchOptions.map((branchOption) => branchOption.code))
                  .join(', ')}
              </div>
              <div>{t('ues:detailed.requirements')}</div>
              <div>
                {ue.ueofs[ueofIndex].info.requirements.length === 0
                  ? t('ues:detailed.requirements.none')
                  : ue.ueofs[ueofIndex].info.requirements
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
          {logged && (type === UserType.STUDENT || type === UserType.FORMER_STUDENT) && (
            <div className={styles.thoughts}>
              <h2>{t('ues:detailed.rates.title')}</h2>
              <div className={[styles.rates, !criteria && styles.error].filter((c) => c).join(' ')}>
                {criteria && ue.starVotes
                  ? Object.entries(ue.starVotes).map(([id, value]) => {
                      const myRate = myRates?.find((rate) => rate.criterionId === id);
                      return (
                        <div key={id} className={styles.criterion}>
                          <h3>
                            {criteria.find((criterion): criterion is UERateCriterion => criterion.id === id)?.name}
                          </h3>
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
              {logged && (type === UserType.STUDENT || type === UserType.FORMER_STUDENT) ? (
                <>
                  <div className={styles.writeComment}>
                    {t('ues:detailed.comments.write')}
                    <TextArea value={writtingComment} onChange={setWrittingComment} />
                    <Button onClick={() => sendComment(api, ue.code, writtingComment, false)}>
                      {t('ues:detailed.comments.write.send')}
                    </Button>
                  </div>
                  <Comments code={params.code} />
                </>
              ) : (
                t('ues:detailed.comments.loginRequired')
              )}
            </div>
          )}
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
