import { API } from '@/api/api';
import { Comment } from '@/api/comment/comment.interface';

export interface SendCommentRequestDto {
  body: string;
  isAnonymous: boolean;
}

export default async function sendComment(api: API, ueCode: string, body: string, isAnonymous: boolean) {
  return api.post<SendCommentRequestDto, Comment>(`/ue/${ueCode}/comments`, { body, isAnonymous });
}
