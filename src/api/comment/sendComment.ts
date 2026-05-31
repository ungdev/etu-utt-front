import { API } from '@/api/api';
import { Comment } from '@/api/comment/comment.interface';

export interface SendCommentRequestDto {
  ueCode: string;
  body: string;
  isAnonymous: boolean;
}

export function sendComment(api: API, ueCode: string, body: string, isAnonymous: boolean) {
  return api.post<SendCommentRequestDto, Comment>(`/ue/comments`, { ueCode, body, isAnonymous });
}
