'use client';

import styles from './style.module.scss';
import { useParams } from 'next/navigation';
import useUE from '@/api/ue/fetchUEs';
import { useAppSelector } from '@/lib/hooks';
import Comments from '@/app/ues/[code]/Comments';
import { useAppTranslation } from '@/lib/i18n';
import { useUERateCriteria } from '@/module/ueRateCriterion';
import { UERateCriterion } from '@/api/ueRate/ueRateCriterion.interface';
import Button from '@/components/UI/Button';
import useGetRate from '@/api/ueRate/getUERate';
import doUERate from '@/api/ueRate/doUERate';
import deleteUERate from '@/api/ueRate/deleteUERate';
import StarRating from '@/components/StarRating';
import TextArea from '@/components/UI/TextArea';
import { useEffect, useRef, useState } from 'react';
import sendComment from '@/api/comment/sendComment';
import { useAPI } from '@/api/api';
import { usePageSettings } from '@/module/pageSettings';
import useAnnals, { openAnnalInNewTab } from '@/api/annals/fetchAnnals';
import { UserType } from '@/module/user';
import useAnnalMetadata from '@/api/annals/fetchMetadata';
import { createAnnal } from '@/api/annals/createAnnal';
import { AnnalStatus, CommentStatus, computeExamStatus, getDisplayedExamStatus } from '@/api/annals/annal.interface';
import Clock from '@/icons/Clock';
import Tooltip from '@/components/UI/Tooltip';
import Trash from '@/icons/Trash';
import CircleWarning from '@/icons/CircleWarning';
import CircleCheck from '@/icons/CircleCheck';

function getIcon(status: AnnalStatus) {
  if (status === 'deleted') return <Trash />;
  if (status === 'processing') return <Clock />;
  if (status === 'unverified') return <CircleWarning />;
  return <CircleCheck />;
}

export default function UEDetailsPage() {
  usePageSettings({});
  const params = useParams<{ code: string }>();
  const { t } = useAppTranslation();
  const logged = useAppSelector((state) => state.session.logged);
  const type = useAppSelector((state) => state.user?.type);
  const userId = useAppSelector((state) => state.user?.id);
  const [ue, refreshUE] = useUE(params.code as string);
  const criteria = useUERateCriteria();
  const [myRates, setMyRates] = useGetRate(params.code);
  const [writtingComment, setWrittingComment] = useState<string>('');
  const [annals, , addAnnal] = useAnnals(params.code);
  const [annalTypes, annalSemesters] = useAnnalMetadata(params.code);
  const [annalType, setAnnalType] = useState<string>();
  const [annalSemester, setAnnalSemester] = useState<string>();
  const [fileRotation, setFileRotation] = useState<number>(0);
  const fileRef = useRef<File>();
  const api = useAPI();

  useEffect(() => {
    if (annalTypes?.length) setAnnalType(annalTypes[0].id);
    if (annalSemesters?.length) setAnnalSemester(annalSemesters[0]);
  }, [annalTypes, annalSemesters]);

  if (!ue || !criteria || (!myRates && logged)) {
    return false;
  }

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
      {(type === UserType.STUDENT || type === UserType.FORMER_STUDENT) && (
        <div className={styles.exams}>
          <h2>{t('ues:detailed.annals.title')}</h2>
          <div className={styles.list}>
            {annals?.length
              ? Object.entries(Object.groupBy(annals, (annal) => annal.semesterId)).map(([semester, annals]) => (
                  <div className={styles.semester} key={semester}>
                    <h3>{semester}</h3>
                    {annals?.map((annal) => {
                      const statusIcon = getDisplayedExamStatus(annal.status);
                      return (
                        <div
                          className={styles.entry}
                          key={annal.id}
                          data-status={computeExamStatus(annal.status).join(' ')}
                          onClick={(event) => {
                            if (annal.status & CommentStatus.PROCESSING) return;
                            event.preventDefault();
                            openAnnalInNewTab(api, annal.id);
                          }}>
                          <span className={styles.type}>
                            {annal.type.name}{' '}
                            {(statusIcon !== 'validated' || annal.sender.id === userId) && (
                              <Tooltip
                                content={t(`ues:detailed.annals.entry.status.${statusIcon}`)}
                                className={styles.status}>
                                {getIcon(statusIcon)}
                              </Tooltip>
                            )}
                          </span>
                          <span className={styles.author}>
                            {t('ues:detailed.annals.entry.author')} {annal.sender.firstName} {annal.sender.lastName}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ))
              : t('ues:detailed.annals.empty')}
          </div>
          <div>
            <h3>Envoyer une annale</h3>
            <select onChange={(event) => setAnnalType(event.target.value)} value={annalType}>
              {annalTypes &&
                annalTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
            </select>
            <select onChange={(event) => setAnnalSemester(event.target.value)} value={annalSemester}>
              {annalSemesters &&
                annalSemesters.map((semester) => (
                  <option key={semester} value={semester}>
                    {semester}
                  </option>
                ))}
            </select>
            <input type="file" onChange={(event) => (fileRef.current = event.target.files?.item(0) || undefined)} />
            <input
              type="number"
              value={fileRotation}
              onChange={(event) => setFileRotation(parseInt(event.target.value))}
            />
            <button
              onClick={async () => {
                if (!fileRef.current || !annalSemester || !annalType) return;
                const createdAnnal = await createAnnal(api, {
                  file: fileRef.current!,
                  semester: annalSemester,
                  typeId: annalType,
                  ueCode: params.code,
                  rotate: fileRotation,
                });
                if (createdAnnal) addAnnal(createdAnnal);
              }}
            />
          </div>
        </div>
      )}
      <div className={styles.thoughts}>
        <h2>Avis des étudiants</h2>
        <div className={styles.rates}>
          {Object.entries(ue.starVotes).map(([id, value]) => {
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
                        Supprimer mon avis
                      </Button>
                    )}
                  </>
                )}
              </div>
            );
          })}
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
    </div>
  );
}
