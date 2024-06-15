export const enum CommentStatus {
  UNVERIFIED = 0b000, // For typing only
  VALIDATED = 0b001,
  PROCESSING = 0b010,
  DELETED = 0b100,
}

export interface AnnalType {
  id: string;
  name: string;
}

export interface AnnalMetadata {
  types: AnnalType[];
  semesters: string[];
}

export interface Annal {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: CommentStatus;
  ue: {
    code: string;
  };
  semesterId: string;
  type: AnnalType;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export type AnnalStatus = 'unverified' | 'processing' | 'deleted' | 'validated';
export function computeExamStatus(status: CommentStatus) {
  const stat: AnnalStatus[] = [];
  if (!(status & CommentStatus.VALIDATED)) stat.push('unverified');
  if (status & CommentStatus.PROCESSING) stat.push('processing');
  if (status & CommentStatus.DELETED) stat.push('deleted');
  return stat;
}
export function getDisplayedExamStatus(status: CommentStatus): AnnalStatus {
  if (status & CommentStatus.DELETED) return 'deleted';
  if (status & CommentStatus.PROCESSING) return 'processing';
  if (status & CommentStatus.VALIDATED) return 'validated';
  return 'unverified';
}
