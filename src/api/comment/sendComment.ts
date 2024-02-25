import { API, handleAPIResponse } from '@/api/api';
import { StatusCodes } from 'http-status-codes';
import { Comment } from '@/api/comment/comment.interface';

export interface SendCommentRequestDto {
  body: string;
  isAnonymous: boolean;
}

export default async function sendComment(ueCode: string, body: string, isAnonymous: boolean) {
  const res = await API.post<SendCommentRequestDto, Comment>(`/ue/${ueCode}/comments`, { body, isAnonymous });
  return handleAPIResponse(res, {
    [StatusCodes.OK]: (data) => data,
  });
}
