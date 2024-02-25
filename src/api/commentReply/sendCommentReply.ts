import { API, handleAPIResponse } from '@/api/api';
import { StatusCodes } from 'http-status-codes';
import { CommentReply } from '@/api/commentReply/commentReply.interface';

export interface SendReplyRequestDto {
  body: string;
}

export async function sendCommentReply(commentId: string, body: string): Promise<CommentReply | null> {
  const res = await API.post<SendReplyRequestDto, CommentReply>(`/ue/comments/${commentId}/reply`, { body });
  let reply: CommentReply | null = null;
  handleAPIResponse(res, {
    [StatusCodes.CREATED]: (body) => (reply = body),
  });
  return reply;
}
