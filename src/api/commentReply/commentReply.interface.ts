export interface CommentReply {
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
