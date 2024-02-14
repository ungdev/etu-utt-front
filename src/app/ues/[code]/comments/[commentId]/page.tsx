'use client';

import styles from '@/app/ues/[code]/comments/[commentId]/style.module.scss';
import { useParams } from 'next/navigation';
import { useGetComment } from '@/api/ue/getComment';
import useFetchUE from '@/api/ue/fetch';
import { useAppTranslation } from '@/lib/i18n';
import TextArea from '@/components/UI/TextArea';
import Button from '@/components/UI/Button';
import { sendReply } from '@/api/ue/sendReply';
import { useState } from 'react';

export default function CommentDetails() {
  const { t } = useAppTranslation();
  const params = useParams<{ code: string; commentId: string }>();
  const [comment, setComment] = useGetComment(params.commentId);
  const ue = useFetchUE(params.code);
  const [answer, setAnswer] = useState('');
  if (!comment || !ue) {
    return;
  }
  return (
    <div className={styles.page}>
      <h1>
        {comment.isAnonymous
          ? t('ues:detailed.comments.resume.anonymous', {
              ue: ue.code,
              semester: comment.semester.code,
              date: comment.createdAt.toLocaleDateString(),
            })
          : t('ues:detailed.comments.resume', {
              authorFirstName: comment.author.firstName,
              authorLastName: comment.author.lastName,
              ue: ue.code,
              semester: comment.semester.code,
              date: comment.createdAt.toLocaleDateString(),
            })}
      </h1>
      {comment.updatedAt && (
        <p className={styles.updateDate}>
          {t('ues:detailed.comments.updatedAt', { date: comment.updatedAt.toLocaleDateString() })}
        </p>
      )}
      <p className={styles.body}>{comment.body}</p>
      <div className={styles.comments}>
        {comment.answers.map((answer) => (
          <div key={answer.id} className={styles.comment}>
            <p className={styles.author}>
              {answer.author
                ? `${answer.author.firstName} ${answer.author.lastName}`
                : t('ues:detailed.comments.author.deleted')}
            </p>
            <p className={styles.date}>
              {t('ues:detailed.comments.writtenDate', { date: answer.createdAt.toLocaleDateString() })}
            </p>
            <p className={styles.body}>{answer.body}</p>
          </div>
        ))}
      </div>
      <h2 className={styles.answerTitle}>{t('ues:detailed.comments.answers.answerTitle')}</h2>
      <TextArea className={styles.input} onChange={setAnswer} value={answer} />
      <div className={styles.buttonWrapper}>
        <Button
          className={styles.button}
          onClick={() =>
            sendReply(params.commentId, answer).then((answer) => {
              if (answer === null) return;
              setAnswer('');
              setComment({ ...comment, answers: [...(comment?.answers ?? []), answer] });
            })
          }>
          {t('ues:detailed.comments.answers.answerButton')}
        </Button>
      </div>
    </div>
  );
}
