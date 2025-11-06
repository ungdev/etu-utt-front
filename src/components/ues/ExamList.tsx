import {
  AnnalStatus,
  getDisplayedExamStatus,
  computeExamStatus,
  CommentStatus,
  Annal,
  AnnalType,
} from '@/api/annals/annal.interface';
import { openAnnalInNewTab } from '@/api/annals/fetchAnnals';
import { IconCircleCheck, IconCircleWarning, IconClock4Alt, IconDelete } from 'obra-icons-react';
import { UserType } from '@/module/user';
import Button from '../UI/Button';
import Tooltip from '../UI/Tooltip';
import styles from './ExamList.module.scss';
import { useAppSelector } from '@/lib/hooks';
import { useAppTranslation } from '@/lib/i18n';
import { useAPI } from '@/api/api';

function getIcon(status: AnnalStatus) {
  if (status === 'deleted') return <IconDelete />;
  if (status === 'processing') return <IconClock4Alt />;
  if (status === 'unverified') return <IconCircleWarning />;
  return <IconCircleCheck />;
}

export default function ExamList({
  annals,
  setAnnalUploaderOpen,
  annalTypes,
  annalSemesters,
}: {
  annals: Annal[] | null;
  setAnnalUploaderOpen: (opened: boolean) => void;
  annalTypes: AnnalType[] | null;
  annalSemesters: string[] | null;
}) {
  const type = useAppSelector((state) => state.user?.type);
  const userId = useAppSelector((state) => state.user?.id);
  const { t } = useAppTranslation();
  const api = useAPI();

  return (
    type === UserType.STUDENT && (
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
        <Button
          className={styles.sendButton}
          disabled={!annalTypes?.length || !annalSemesters?.length}
          onClick={() => setAnnalUploaderOpen(true)}>
          {t('ues:detailed.annals.send')}
        </Button>
      </div>
    )
  );
}
