export interface Member {
  id: string;
  userid: string;
  firstName: string;
  lastName: string;
  startAt: Date;
  endAt: Date;
}

export interface Role {
  id: string;
  name: string;
  position: number;
  isPresident: boolean;
  members: Member[];
}

export interface RoleResponse {
  roles: Role[];
}
