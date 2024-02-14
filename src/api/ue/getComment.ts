import { useEffect, useState } from 'react';
import { API, handleAPIResponse, ResponseDto } from '@/api/api';
import { StatusCodes } from 'http-status-codes';
import { Comment } from '@/api/ue/fetchComments';

export interface GetCommentResponseDto extends ResponseDto, Comment {}

export function useGetComment(commentId: string): [Comment | null, (comment: Comment | null) => void] {
  const [comment, setComment] = useState<Comment | null>(null);
  useEffect(() => {
    API.get<GetCommentResponseDto>(`/ue/comments/${commentId}`).then((res) =>
      handleAPIResponse(res, {
        [StatusCodes.OK]: (body) => {
          setComment(body);
        },
      }),
    );
  }, []);
  return [comment, setComment];
}
