export interface Permissions {
  apiPermissions: ApiPermission[];
  userPermissions: UserPermissions[];
}

interface UserPermissions<SoftPermission extends boolean = boolean> {
  permission: UserPermission;
  isSoftPermission: SoftPermission;
  users: SoftPermission extends true ? string[] : null;
}

enum Permission {
  API_SEE_OPINIONS_UE = 'API_SEE_OPINIONS_UE',
  API_UPLOAD_ANNAL = 'API_UPLOAD_ANNAL',
  API_MODERATE_ANNAL = 'API_MODERATE_ANNAL',
  API_MODERATE_COMMENTS = 'API_MODERATE_COMMENTS',

  USER_SEE_DETAILS = 'USER_SEE_DETAILS',
  USER_UPDATE_DETAILS = 'USER_UPDATE_DETAILS',
}

type UserPermission = Permission & `USER_${string}`;
type ApiPermission = Permission & `API_${string}`;
