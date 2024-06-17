import { API } from '@/api/api';
import { Comment } from '@/api/comment/comment.interface';

export interface SendCommentRequestDto {
  body: string;
  isAnonymous: boolean;
  ueCode: string;
}

export default async function sendComment(api: API, ueCode: string, body: string, isAnonymous: boolean) {
  return api.post<SendCommentRequestDto, Comment>(`/ue/comments`, { body, isAnonymous, ueCode });
}
