import { API, handleAPIResponse } from '@/api/api';
import { StatusCodes } from 'http-status-codes';
import { Comment } from '@/api/comment/comment.interface';

export interface EditCommentRequestDto {
  body: string;
  isAnonymous: boolean;
}

export async function editComment(commentId: string, body: string, isAnonymous: boolean): Promise<Comment | null> {
  const res = await API.patch<EditCommentRequestDto, Comment>(`/ue/comments/${commentId}`, { body, isAnonymous });
  return handleAPIResponse(res, {
    [StatusCodes.OK]: (body) => body,
  });
}
