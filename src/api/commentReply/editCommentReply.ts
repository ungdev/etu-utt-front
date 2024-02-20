import { API, handleAPIResponse } from '@/api/api';
import { StatusCodes } from 'http-status-codes';
import { CommentReply } from '@/api/ue/ue.types';

export interface EditCommentReplyRequestDto {
  body: string;
}

export async function editCommentReply(replyId: string, body: string): Promise<CommentReply | null> {
  const res = await API.patch<EditCommentReplyRequestDto, CommentReply>(`/ue/comments/reply/${replyId}`, { body });
  return handleAPIResponse(res, {
    [StatusCodes.OK]: (body) => body,
  });
}
