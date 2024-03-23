import { API } from '@/api/api';

export default function upvoteComment(api: API, commentId: string) {
  return api
    .post(`ue/comments/${commentId}/upvote`)
    .on('success', () => true)
    .on('error', () => false)
    .on('failure', () => false);
}
