import { API, handleAPIResponse } from '@/api/api';
import { StatusCodes } from 'http-status-codes';

export default async function upvoteComment(commentId: string): Promise<boolean> {
  const res = await API.post(`ue/comments/${commentId}/upvote`);
  return (
    handleAPIResponse(res, {
      [StatusCodes.NO_CONTENT]: () => true,
    }) ?? false
  );
}
