import { API } from '../api';

type Member = {
  id: string;
  userId: string;
  roleId: string;
  startAt: Date;
  endAt: Date;
};

type MemberCreateRequest = {
  roleId: string;
  userId: string;
  endAt: Date;
  permissions: string[];
};

type MemberUpdateRequest = Partial<Omit<MemberCreateRequest, 'userId'>>;

export function addMember(
  api: API,
  assoId: string,
  roleId: string,
  userId: string,
  endAt: Date,
  permissions: string[],
) {
  return api.post<MemberCreateRequest, Member>(`/assos/${assoId}/members`, {
    roleId,
    userId,
    endAt,
    permissions,
  });
}

export function updateMember(api: API, assoId: string, memberId: string, data: MemberUpdateRequest) {
  return api.patch<MemberUpdateRequest, Member>(`/assos/${assoId}/members/${memberId}`, data);
}

export function deleteMember(api: API, assoId: string, memberId: string) {
  return api.delete<Member>(`/assos/${assoId}/members/${memberId}`);
}
