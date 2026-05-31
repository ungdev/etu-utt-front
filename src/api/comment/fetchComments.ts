import { useEffect, useState } from 'react';
import { Pagination } from '@/api/api.interface';
import { Comment } from '@/api/comment/comment.interface';
import { useAPI } from '@/api/api';

type AddComment = (comment: Comment) => void;
type UpdateComment = (index: number, comment: Comment) => void;

export default function useComments(code: string): [Comment[] | null, AddComment, UpdateComment] {
  const [comments, setComments] = useState<Comment[] | null>(null);
  const api = useAPI();
  useEffect(() => {
    api.get<Pagination<Comment>>(`/ue/comments?ueCode=${code}`).on('success', (body) => setComments(body.items));
  }, [code]);
  return [
    comments,
    (comment) =>
      setComments((prev) => {
        if (!prev) return [comment];
        let insertIndex = prev.findIndex(
          (prevComment) =>
            prevComment.upvotes < comment.upvotes ||
            (prevComment.upvotes === comment.upvotes && prevComment.createdAt < comment.createdAt),
        );
        if (insertIndex === -1) insertIndex = prev.length;
        return [...prev.slice(0, insertIndex), comment, ...prev.slice(insertIndex)];
      }),
    (index, comment) =>
      setComments((prev) => (prev ? [...prev.slice(0, index), comment, ...prev.slice(index + 1)] : null)),
  ];
}
