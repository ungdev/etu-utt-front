import { useEffect, useState } from 'react';
import { useAPI } from '@/api/api';
import { Comment } from '@/api/comment/comment.interface';

export function useUEComment(commentId: string): [Comment | null, (comment: Comment | null) => void] {
  const [comment, setComment] = useState<Comment | null>(null);
  const api = useAPI();
  useEffect(() => {
    api.get<Comment>(`/ue/comments/${commentId}`).on('success', (body) => setComment(body));
  }, []);
  return [comment, setComment];
}
