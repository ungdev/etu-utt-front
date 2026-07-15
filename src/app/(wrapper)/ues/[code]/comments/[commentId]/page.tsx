'use client';

import styles from '@/app/(wrapper)/ues/[code]/comments/[commentId]/style.module.scss';
import { useUEComment } from '@/api/comment/getComment';
import useUe from '@/api/ue/fetchUe';
import { TFunction, useAppTranslation } from '@/lib/i18n';
import TextArea from '@/components/UI/TextArea';
import Button from '@/components/UI/Button';
import { useState } from 'react';
import { useConnectedUser } from '@/module/session';
import EditableText from '@/components/EditableText';
import { editCommentReply } from '@/api/commentReply/editCommentReply';
import { useAPI } from '@/api/api';
import { sendCommentReply } from '@/api/commentReply/sendCommentReply';
import Link from '@/components/UI/Link';
import Page from '@/components/utilities/Page';
import { IconClock4Alt, IconComment, IconEnter, IconUser } from 'obra-icons-react';
import { useParams } from 'next/navigation';

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

export default function CommentDetailsPage() {
  const { t } = useAppTranslation();
  const params = useParams<{ code: string; commentId: string }>();
  const [comment, setComment] = useUEComment(params.commentId);
  const [ue] = useUe(params.code);
  const [answer, setAnswer] = useState('');
  const user = useConnectedUser();
  const api = useAPI();
  if (!comment || !ue || !user) {
    return;
  }
  return (
    <Page className={styles.page}>
      <h1>
        {comment.isAnonymous
          ? t('ues:detailed.comments.summary.anonymous', {
              ue: ue.code,
              semester: comment.semester.code,
              date: comment.createdAt.toLocaleDateString(),
            })
          : t('ues:detailed.comments.summary', {
              authorFirstName: comment.author.firstName,
              authorLastName: comment.author.lastName,
              ue: ue.code,
              semester: comment.semester.code,
              date: comment.createdAt.toLocaleDateString(),
            })}
      </h1>
      <div className={styles.meta}>
        {!comment.isAnonymous && (
          <div>
            <IconUser />
            <Link href={`/users/${comment.author.id}`} noStyle>
              {comment.author.firstName} {comment.author.lastName}
            </Link>
          </div>
        )}
        <div>
          <IconComment />
          {t('ues:detailed.comments.semester', { semester: comment.semester.code })}
        </div>
        <div>
          <IconClock4Alt />
          <div>
            <div>{t('ues:detailed.comments.writtenDate', { date: comment.createdAt.toLocaleDateString() })}</div>
            {comment.updatedAt && (
              <div>{t('ues:detailed.comments.updatedAt', { date: comment.updatedAt.toLocaleDateString() })}</div>
            )}
          </div>
        </div>
      </div>
      <p className={styles.body}>{comment.body}</p>
      <div className={styles.comments}>
        {comment.answers.map((answer, i) => (
          <div key={answer.id} className={styles.comment}>
            <div className={styles.sideIcon}>
              <IconEnter className={styles.answerIcon} />
            </div>
            <div>
              <p className={styles.author}>
                {answer.author ? (
                  <Link href={`/users/${answer.author.id}`} noStyle>
                    {answer.author.firstName} {answer.author.lastName}
                  </Link>
                ) : (
                  t('ues:detailed.comments.author.deleted')
                )}
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
                    const newAnswer = await editCommentReply(api, answer.id, body).toPromise();
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
          </div>
        ))}
      </div>
      <h2 className={styles.answerTitle}>{t('ues:detailed.comments.answers.title')}</h2>
      <TextArea
        className={styles.input}
        onChange={setAnswer}
        value={answer}
        placeholder={t('ues:detailed.comments.answers.placeholder')}
      />
      <div className={styles.buttonWrapper}>
        <Button
          className={styles.button}
          onClick={() =>
            sendCommentReply(api, params.commentId, answer).on('success', (newAnswer) => {
              setComment({ ...comment, answers: [...(comment?.answers ?? []), newAnswer] });
              setAnswer('');
            })
          }>
          {t('ues:detailed.comments.answers.send')}
        </Button>
      </div>
    </Page>
  );
}
