import { API, handleAPIResponse, ResponseDto } from '@/api/api';
import { StatusCodes } from 'http-status-codes';
import { useEffect, useState } from 'react';

export interface Comment {
  id: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    studentId: number;
  };
  createdAt: Date;
  updatedAt: Date;
  semester: {
    code: string;
  };
  isAnonymous: string;
  body: string;
  answers: Array<{
    id: string;
    author: {
      id: string;
      firstName: string;
      lastName: string;
      studentId: string;
    };
    body: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
  upvotes: number;
  upvoted: boolean;
}

export interface FetchCommentsResponseDto extends ResponseDto {
  items: Comment[];
  itemCount: number;
  itemsPerPage: number;
}

export default function useFetchComments(code: string): Comment[] | null {
  const [comments, setComments] = useState<Comment[] | null>(null);
  useEffect(() => {
    API.get<FetchCommentsResponseDto>(`/ue/${code}/comments`).then((res) =>
      handleAPIResponse(res, {
        [StatusCodes.OK]: (body) => {
          setComments(body.items);
        },
      }),
    );
  }, []);
  return comments;
}
