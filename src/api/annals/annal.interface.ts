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
