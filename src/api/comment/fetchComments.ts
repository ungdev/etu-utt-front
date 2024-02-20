import { API, handleAPIResponse } from '@/api/api';
import { StatusCodes } from 'http-status-codes';
import { useEffect, useState } from 'react';
import { Pagination } from '@/api/api.interface';
import { Comment } from '@/api/comment/comment.interface';

export default function useFetchComments(code: string): [Comment[] | null, (comments: Comment[]) => void] {
  const [comments, setComments] = useState<Comment[] | null>(null);
  useEffect(() => {
    API.get<Pagination<Comment>>(`/ue/${code}/comments`).then((res) =>
      handleAPIResponse(res, {
        [StatusCodes.OK]: (body) => {
          setComments(body.items);
        },
      }),
    );
  }, []);
  return [comments, setComments];
}
