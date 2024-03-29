import { useEffect, useState } from 'react';
import { Pagination } from '@/api/api.interface';
import { Comment } from '@/api/comment/comment.interface';
import { useAPI } from '@/api/api';

export default function useComments(code: string): [Comment[] | null, (index: number, comment: Comment) => void] {
  const [comments, setComments] = useState<Comment[] | null>(null);
  const api = useAPI();
  useEffect(() => {
    api.get<Pagination<Comment>>(`/ue/${code}/comments`).on('success', (body) => setComments(body.items));
  });
  return [
    comments,
    (index, comment) =>
      setComments((prev) => (prev ? [...prev.slice(0, index), comment, ...prev.slice(index + 1)] : null)),
  ];
}
