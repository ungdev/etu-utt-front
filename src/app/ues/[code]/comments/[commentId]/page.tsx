'use client';

import styles from '@/app/ues/[code]/comments/[commentId]/style.module.scss';
import { useParams } from 'next/navigation';
import { useUEComment } from '@/api/comment/getComment';
import useUE from '@/api/ue/fetchUEs';
import { TFunction, useAppTranslation } from '@/lib/i18n';
import TextArea from '@/components/UI/TextArea';
import Button from '@/components/UI/Button';
import { sendCommentReply } from '@/api/commentReply/sendCommentReply';
import { useState } from 'react';
import { useConnectedUser } from '@/module/user';
import EditableText from '@/components/EditableText';
import { editCommentReply } from '@/api/commentReply/editCommentReply';

function CommentEditorFooter(originalComment: string, onUpdate: (text: string) => void, t: TFunction) {
  return function CommentEditorFooter({ text, disable }: { text: string; disable: () => void }) {
    return (
      <Button
        className={styles.button}
        disabled={text === originalComment}
        onClick={async () => {
          onUpdate(text);
          disable();
        }}>
        {t('common:input.editableText.modify')}
      </Button>
    );
  };
}

export default function CommentDetails() {
  const { t } = useAppTranslation();
  const params = useParams<{ code: string; commentId: string }>();
  const [comment, setComment] = useUEComment(params.commentId);
  const [ue] = useUE(params.code);
  const [answer, setAnswer] = useState('');
  const user = useConnectedUser();
  if (!comment || !ue || !user) {
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
        {comment.answers.map((answer, i) => (
          <div key={answer.id} className={styles.comment}>
            <p className={styles.author}>
              {answer.author
                ? `${answer.author.firstName} ${answer.author.lastName}`
                : t('ues:detailed.comments.author.deleted')}
            </p>
            <p className={styles.date}>
              {t('ues:detailed.comments.writtenDate', { date: answer.createdAt.toLocaleDateString() })}
            </p>
            <EditableText
              className={styles.body}
              text={answer.body}
              EditingFooter={CommentEditorFooter(
                answer.body,
                async (body) => {
                  const newAnswer = await editCommentReply(answer.id, body);
                  if (!newAnswer) return false;
                  setComment({
                    ...comment,
                    answers: [...comment.answers.slice(0, i), newAnswer, ...comment.answers.slice(i + 1)],
                  });
                  return true;
                },
                t,
              )}
              enabled={answer.author.id === user.id}
            />
          </div>
        ))}
      </div>
      <h2 className={styles.answerTitle}>{t('ues:detailed.comments.answers.answerTitle')}</h2>
      <TextArea
        className={styles.input}
        onChange={setAnswer}
        value={answer}
        placeholder={t('ues:detailed.comments.answers.answerEntry')}
      />
      <div className={styles.buttonWrapper}>
        <Button
          className={styles.button}
          onClick={() =>
            sendCommentReply(params.commentId, answer).then((answer) => {
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
