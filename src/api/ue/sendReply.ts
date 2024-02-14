import { API, handleAPIResponse, RequestDto, ResponseDto } from '@/api/api';
import { StatusCodes } from 'http-status-codes';

export interface SendReplyRequestDto extends RequestDto {
  body: string;
}

export interface SendReplyResponseDto extends ResponseDto {
  id: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    lastName: string;
    firstName: string;
    studentId: string;
  };
}

export async function sendReply(commentId: string, body: string): Promise<SendReplyResponseDto | null> {
  const res = await API.post<SendReplyRequestDto, SendReplyResponseDto>(`/ue/comments/${commentId}/reply`, { body });
  let reply: SendReplyResponseDto | null = null;
  handleAPIResponse(res, {
    [StatusCodes.CREATED]: (body) => (reply = body),
    [StatusCodes.CONFLICT]: (body) => console.error('User already exists', body),
    [StatusCodes.BAD_REQUEST]: (body) => console.error('Bad request', body),
  });
  return reply;
}
