import styles from './Comments.module.scss';

import useComments from '@/api/comment/fetchComments';
import { TFunction, useAppTranslation } from '@/lib/i18n';
import Icons from '@/icons';
import EditableText from '@/components/EditableText';
import Button from '@/components/UI/Button';
import { useConnectedUser } from '@/module/user';
import { Comment } from '@/api/comment/comment.interface';
import { useState } from 'react';
import { editComment } from '@/api/comment/editComment';
import StarRating from '@/components/StarRating';
import upvoteComment from '@/api/comment/upvote';
import { unUpvoteComment } from '@/api/comment/unUpvote';
import { useAPI } from '@/api/api';

function CommentEditorFooter(comment: Comment, onUpdate: (text: string, anonymous: boolean) => void, t: TFunction) {
  return function CommentEditorFooter({ text, disable }: { text: string; disable: () => void }) {
    const [anonymous, setAnonymous] = useState<boolean>(comment.isAnonymous);
    return (
      <div className={styles.commentEditorFooter}>
        <div>
          Anonyme : <input type={'checkbox'} checked={anonymous} onChange={() => setAnonymous(!anonymous)} />
        </div>
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

function CommentFooter(
  code: string,
  comment: Comment,
  isMyComment: boolean,
  t: TFunction,
  updateComment: (updatedComment: Comment) => void,
) {
  return function CommentFooter() {
    const api = useAPI();
    return (
      <div className={styles.commentFooter}>
        <div className={styles.upvotes}>
          <StarRating
            stars={1}
            value={comment.upvoted ? 1 : 0}
            onClick={
              isMyComment
                ? undefined
                : async () => {
                    // Upvote or un-upvote the comment. If it returns false, it means the request failed (for example, it was already upvoted / un-upvoted)
                    // If that's the case, we don't update the number of upvotes.
                    if (
                      (!comment.upvoted && !(await upvoteComment(api, comment.id).toPromise())) ||
                      (comment.upvoted && !(await unUpvoteComment(api, comment.id).toPromise()))
                    ) {
                      return;
                    }
                    updateComment({
                      ...comment,
                      upvotes: comment.upvotes + (comment.upvoted ? -1 : 1),
                      upvoted: !comment.upvoted,
                    });
                  }
            }
          />
          <p>{t('ues:detailed.comments.upvotes', { count: comment.upvotes.toString() })}</p>
        </div>
        <a className={styles.gotoConversation} href={`/ues/${code}/comments/${comment.id}`}>
          {comment.answers.length === 0
            ? t('ues:detailed.comments.conversation.see.empty')
            : t('ues:detailed.comments.conversation.see', { responseCount: comment.answers.length.toString() })}
          <Icons.Caret />
        </a>
      </div>
    );
  };
}

export default function Comments({ code }: { code: string }) {
  const { t } = useAppTranslation();
  const [comments, setComment] = useComments(code);
  const user = useConnectedUser()!;
  const api = useAPI();
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
            EditingFooter={CommentEditorFooter(
              comment,
              async (text, anonymous) => {
                const updatedComment = await editComment(api, comment.id, text, anonymous).toPromise();
                if (!updatedComment) return;
                setComment(i, updatedComment);
              },
              t,
            )}
            NormalViewFooter={CommentFooter(code, comment, comment.author?.id === user.id, t, (updatedComment) =>
              setComment(i, updatedComment),
            )}
          />
        </div>
      ))}
    </div>
  );
}
