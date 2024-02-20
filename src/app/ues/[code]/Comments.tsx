import styles from './Comments.module.scss';

import useFetchComments from '@/api/comment/fetchComments';
import { TFunction, useAppTranslation } from '@/lib/i18n';
import Icons from '@/icons';
import EditableText from '@/components/EditableText';
import Button from '@/components/UI/Button';
import { useConnectedUser } from '@/module/user';
import { Comment } from '@/api/ue/ue.types';
import { useState } from 'react';
import { editComment } from '@/api/comment/editComment';

function CommentEditorFooter(comment: Comment, onUpdate: (text: string, anonymous: boolean) => void, t: TFunction) {
  return function CommentEditorFooter({ text, disable }: { text: string; disable: () => void }) {
    const [anonymous, setAnonymous] = useState<boolean>(comment.isAnonymous);
    return (
      <div className={styles.commentEditorFooter}>
        <div>Anonyme : <input type={"checkbox"} checked={anonymous} onChange={() => setAnonymous(!anonymous)} /></div>
        <Button
          className={styles.button}
          disabled={text === comment.body && anonymous === comment.isAnonymous}
          onClick={async () => {
            onUpdate(text, anonymous);
            disable();
          }}>
          {t('common:input.editableText.modify')}
        </Button>
      </div>
    );
  };
}

function CommentFooter(code: string, comment: Comment, t: TFunction) {
  return function CommentFooter() {
    return <p className={styles.commentFooter}>
      <a href={`/ues/${code}/comments/${comment.id}`}>
        {comment.answers.length === 0
          ? t('ues:detailed.comments.conversation.see.empty')
          : t('ues:detailed.comments.conversation.see', { responseCount: comment.answers.length.toString() })}
        <Icons.Caret />
      </a>
    </p>;
  };
}

export default function Comments({ code }: { code: string }) {
  const { t } = useAppTranslation();
  const [comments, setComments] = useFetchComments(code);
  const user = useConnectedUser()!;
  if (comments === null) {
    return '';
  }
  return (
    <div className={styles.comments}>
      {comments?.map((comment, i) => (
        <div key={comment.id} className={styles.comment}>
          <p className={styles.author}>
            {comment.isAnonymous
              ? t('ues:detailed.comments.author.anonymous')
              : `${comment.author.firstName} ${comment.author.lastName}`}
          </p>
          <p className={styles.date}>
            {comment.semester.code}
            {' - '}
            {t('ues:detailed.comments.writtenDate', { date: comment.createdAt.toLocaleDateString() })}
            {comment.updatedAt &&
              ` (${t('ues:detailed.comments.updatedAt', {
                date: comment.updatedAt.toLocaleDateString(),
              })})`}
          </p>
          <EditableText
            className={styles.body}
            textClassName={styles.text}
            text={comment.body}
            enabled={comment.author?.id === user.id}
            EditingFooter={CommentEditorFooter(comment, async (text, anonymous) => {
              const updatedComment = await editComment(comment.id, text, anonymous);
              if (!updatedComment) return;
              setComments([...comments.slice(0, i), updatedComment, ...comments.slice(i + 1)]);
            }, t)}
            NormalViewFooter={CommentFooter(code, comment, t)}
          />
        </div>
      ))}
    </div>
  );
}
