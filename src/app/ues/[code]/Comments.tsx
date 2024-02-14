import styles from './Comments.module.scss';

import useFetchComments from '@/api/ue/fetchComments';
import { useAppTranslation } from '@/lib/i18n';
import Icons from '@/icons';

export default function Comments({ code }: { code: string }) {
  const { t } = useAppTranslation();
  const comments = useFetchComments(code);
  if (comments === null) {
    return '';
  }
  return (
    <div className={styles.comments}>
      {comments?.map((comment) => (
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
          <p className={styles.body}>{comment.body}</p>
          <p className={styles.conversation}>
            <a href={`/ues/${code}/comments/${comment.id}`}>
              {comment.answers.length === 0
                ? t('ues:detailed.comments.conversation.see.empty')
                : t('ues:detailed.comments.conversation.see', { responseCount: comment.answers.length.toString() })}
              <Icons.Caret />
            </a>
          </p>
        </div>
      ))}
    </div>
  );
}
