import { PropsWithoutRef, useState } from 'react';
import { Role, Member } from '@/api/assos/member.interface';
import { useAppTranslation } from '@/lib/i18n';
import styles from './AssoRole.module.scss';
import Icons from '@/icons';
import Input from '../UI/Input';
import Link from '../UI/Link';
import DisableableButton from '../UI/DisableableButton';

/**
 * Sorts {@link Member asso members}.
 * Old members are sorted after current members.
 * Current members are sorted by start date (earliest last).
 * Old members are sorted by end date (most recent first).
 */
const userSorter = (a: Member, b: Member) => {
  const aSign = Math.sign(a.endAt.getTime() - Date.now()); // 1 if current, -1 if old (same goes for b below)
  const oldComparison = Math.sign(b.endAt.getTime() - Date.now()) - aSign; // equals to 0 if both are old or both are current. Otherwise, puts current members first (same behaviour as using `[10, 62, 42].sort()`)
  return (
    // Choose sorting criterion depending on whether the "a" member is old or current (the "b" member will be the same due to oldComparison check)
    // This is a standard comparison, as above. Check how to use {@link Array.sort https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort} if you're not familiar with it.
    oldComparison || (aSign > 0 ? a.startAt.getTime() - b.startAt.getTime() : b.endAt.getTime() - a.endAt.getTime())
  );
};

export function AssoRole({
  role,
  editing = false,
  canEdit,
  hasEditRolesPermission,
  hasEditMembersPermission,
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
  hasEditRolesPermission: boolean;
  hasEditMembersPermission: boolean;
  displayOldMembers: boolean;
  deleteAssoRole: (id: string) => void;
  updateAssoRole: (id: string, data: Partial<{ name: string; position: number }>) => void;
  createAssoMember: (roleId: string) => void;
  deleteAssoMember: (id: string) => void;
  updateAssoMember: (member: Member, fromRoleId: string) => void;
  setCurrentEditingRole: (id: string | null) => void;
}>) {
  const [currentEditingRoleName, setCurrentEditingRoleName] = useState<string>(role.name);
  const { t } = useAppTranslation();

  return (
    <>
      <h3 className={styles.roleRoot}>
        {role.isPresident && (
          <div className={styles.crown}>
            <Icons.Crown />
          </div>
        )}
        <div className={styles.actionRow}>
          {editing && canEdit ? (
            <Input value={currentEditingRoleName} onChange={setCurrentEditingRoleName} />
          ) : (
            <div>{role.name}</div>
          )}
          {canEdit && (
            <>
              <DisableableButton
                onClick={() => createAssoMember(role.id)}
                disabled={!hasEditMembersPermission}
                disabledTooltip={t('assos:no.permission.edit.member')}>
                <Icons.UserAdd />
              </DisableableButton>
              <DisableableButton
                onClick={() => deleteAssoRole(role.id)}
                disabled={!hasEditRolesPermission || role.isPresident}
                disabledTooltip={t('assos:no.permission.edit.member')}>
                <Icons.Trash />
              </DisableableButton>
              <DisableableButton
                onClick={() => {
                  if (editing) {
                    updateAssoRole(role.id, { name: currentEditingRoleName });
                    setCurrentEditingRole(null);
                  } else {
                    setCurrentEditingRole(role.id);
                    setCurrentEditingRoleName(role.name);
                  }
                }}
                disabled={!hasEditRolesPermission}
                disabledTooltip={t('assos:no.permission.edit.member')}>
                {editing ? <Icons.Confirm /> : <Icons.Edit />}
              </DisableableButton>
            </>
          )}
        </div>
      </h3>
      <div className={styles.members}>
        {role.members.sort(userSorter).map((member) => {
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
                      <DisableableButton
                        onClick={() => updateAssoMember(member, role.id)}
                        disabled={!hasEditMembersPermission}
                        disabledTooltip={t('assos:no.permission.edit.member')}>
                        <Icons.Edit />
                      </DisableableButton>
                      <DisableableButton
                        onClick={() => deleteAssoMember(member.id)}
                        disabled={!hasEditMembersPermission}
                        disabledTooltip={t('assos:no.permission.edit.member')}>
                        <Icons.UserRemove />
                      </DisableableButton>
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
