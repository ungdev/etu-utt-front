import { useEffect, useState } from 'react';
import { API, handleAPIResponse } from '@/api/api';
import { StatusCodes } from 'http-status-codes';
import { Comment } from '@/api/comment/comment.interface';

export function useGetComment(commentId: string): [Comment | null, (comment: Comment | null) => void] {
  const [comment, setComment] = useState<Comment | null>(null);
  useEffect(() => {
    API.get<Comment>(`/ue/comments/${commentId}`).then((res) =>
      handleAPIResponse(res, {
        [StatusCodes.OK]: (body) => {
          setComment(body);
        },
      }),
    );
  }, []);
  return [comment, setComment];
}
