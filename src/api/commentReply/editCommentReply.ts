import { API } from '@/api/api';
import { CommentReply } from '@/api/commentReply/commentReply.interface';

export interface EditCommentReplyRequestDto {
  body: string;
}

export function editCommentReply(api: API, replyId: string, body: string) {
  return api.patch<EditCommentReplyRequestDto, CommentReply>(`/ue/comments/reply/${replyId}`, { body });
}
