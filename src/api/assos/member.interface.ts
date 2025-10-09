export interface Member {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  startAt: Date;
  endAt: Date;
  permissions: string[];
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

export interface RoleCreateRequest {
  name: string;
}

export interface RoleUpdateRequest extends RoleCreateRequest {
  position: number;
}
