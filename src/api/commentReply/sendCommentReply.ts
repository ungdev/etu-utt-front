import { API } from '@/api/api';
import { CommentReply } from '@/api/commentReply/commentReply.interface';

export interface SendReplyRequestDto {
  body: string;
}

export function sendCommentReply(api: API, commentId: string, body: string) {
  return api.post<SendReplyRequestDto, CommentReply>(`/ue/comments/${commentId}/reply`, { body });
}
