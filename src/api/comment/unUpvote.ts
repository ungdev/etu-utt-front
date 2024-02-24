import { API, handleAPIResponse } from '@/api/api';
import { StatusCodes } from 'http-status-codes';

export async function unUpvoteComment(commentId: string): Promise<boolean> {
  const res = await API.delete(`ue/comments/${commentId}/upvote`);
  return (
    handleAPIResponse(res, {
      [StatusCodes.NO_CONTENT]: () => true,
    }) ?? false
  );
}
