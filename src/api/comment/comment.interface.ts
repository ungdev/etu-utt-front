import { CommentReply } from '@/api/commentReply/commentReply.interface';

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
  isAnonymous: boolean;
  body: string;
  answers: CommentReply[];
  upvotes: number;
  upvoted: boolean;
}