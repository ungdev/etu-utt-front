import { PropsWithoutRef, useState } from 'react';
import { Role, Member } from '@/api/assos/member.interface';
import { useAppTranslation } from '@/lib/i18n';
import styles from './AssoRole.module.scss';
import Icons from '@/icons';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Link from '../UI/Link';

export function AssoRole({
  role,
  editing = false,
  canEdit,
  hasPermission,
  hasMembersPermission,
  displayOldMembers,
  deleteAssoRole,
  updateAssoRole,
  createAssoMember,
  deleteAssoMember,
  updateAssoMember,
  setCurrentEditingRole,
}: PropsWithoutRef<{
  role: Role;
  editing?: boolean;
  canEdit: boolean;
  hasPermission: boolean;
  hasMembersPermission: boolean;
  displayOldMembers: boolean;
  deleteAssoRole: (id: string) => void;
  updateAssoRole: (id: string, data: Partial<{ name: string; position: number }>) => void;
  createAssoMember: (roleId: string) => void;
  deleteAssoMember: (id: string) => void;
  updateAssoMember: (member: Member, fromRoleId: string) => void;
  setCurrentEditingRole: (id: string | null) => void;
}>) {
  const [currentEditingRoleValue, setCurrentEditingRoleValue] = useState<string>(role.name);
  const { t } = useAppTranslation();

  return (
    <>
      <h3 className={styles.roleRoot}>
        {role.isPresident ? (
          <div className={styles.crown}>
            <Icons.Crown />
          </div>
        ) : (
          ''
        )}
        <div className={styles.actionRow}>
          {editing && canEdit ? (
            <Input value={currentEditingRoleValue} onChange={setCurrentEditingRoleValue} />
          ) : (
            <div>{role.name}</div>
          )}
          {canEdit && (
            <>
              <Button onClick={() => createAssoMember(role.id)} disabled={!hasMembersPermission}>
                <Icons.UserAdd />
              </Button>
              <Button onClick={() => deleteAssoRole(role.id)} disabled={!hasPermission || role.isPresident}>
                <Icons.Trash />
              </Button>
              <Button
                onClick={() => {
                  if (editing) {
                    updateAssoRole(role.id, { name: currentEditingRoleValue });
                    setCurrentEditingRole(null);
                  } else {
                    setCurrentEditingRole(role.id);
                    setCurrentEditingRoleValue(role.name);
                  }
                }}
                disabled={!hasPermission}>
                {editing ? <Icons.Confirm /> : <Icons.Edit />}
              </Button>
            </>
          )}
        </div>
      </h3>
      <div className={styles.members}>
        {role.members.map((member) => {
          const isOld = member.endAt < new Date();
          return (
            (!isOld || displayOldMembers || canEdit) && (
              <Link
                key={member.id}
                noStyle
                href={`/users/${member.userId}`}
                disabled={canEdit}
                className={isOld ? styles.oldMember : styles.member}>
                <div className={styles.pictureContainer}>
                  <img alt={member?.firstName.charAt(0) || '?'} />
                  <div>
                    <div>
                      {member.firstName} {member.lastName}
                    </div>
                    <div className={styles.temporal}>
                      {t(isOld ? 'assos:member.old.from' : 'assos:member.since')}
                      {member.startAt.toLocaleString(undefined, {
                        year: 'numeric',
                        month: 'long',
                      })}
                      {isOld && (
                        <>
                          {t('assos:member.old.to')}
                          {member.endAt.toLocaleString(undefined, {
                            year: 'numeric',
                            month: 'long',
                          })}
                        </>
                      )}
                    </div>
                  </div>
                  {!isOld && canEdit && (
                    <>
                      <Button onClick={() => updateAssoMember(member, role.id)} disabled={!hasMembersPermission}>
                        <Icons.Edit />
                      </Button>
                      <Button onClick={() => deleteAssoMember(member.id)} disabled={!hasMembersPermission}>
                        <Icons.UserRemove />
                      </Button>
                    </>
                  )}
                </div>
              </Link>
            )
          );
        })}
      </div>
    </>
  );
}
