import { API } from '@/api/api';

export function unUpvoteComment(api: API, commentId: string) {
  return api
    .delete(`ue/comments/${commentId}/upvote`)
    .on('success', () => true)
    .on('error', () => false)
    .on('failure', () => false);
}
