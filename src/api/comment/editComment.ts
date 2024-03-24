import { Comment } from '@/api/comment/comment.interface';
import { API } from '@/api/api';

export interface EditCommentRequestDto {
  body: string;
  isAnonymous: boolean;
}

export function editComment(api: API, commentId: string, body: string, isAnonymous: boolean) {
  return api.patch<EditCommentRequestDto, Comment>(`/ue/comments/${commentId}`, { body, isAnonymous });
}
