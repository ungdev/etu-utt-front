'use client';

import { PropsWithoutRef, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import styles from './style.module.scss';
import { useAsso } from '@/api/assos/fetchAsso.hook';
import Page from '@/components/utilities/Page';
import { useMembers } from '@/api/assos/fetchAssoMembers.hook';
import Icons from '@/icons';
import Link from '@/components/UI/Link';
import { useAppTranslation } from '@/lib/i18n';
import Button from '@/components/UI/Button';
import { useAppSelector } from '@/lib/hooks';
import { deleteRole } from '@/api/assos/deleteRole';
import { useAPI } from '@/api/api';
import { VerticalSortDnd } from '@/components/UI/VerticalSortDnd';
import { updateRole } from '@/api/assos/updateRole';
import Input from '@/components/UI/Input';
import { Member, Role } from '@/api/assos/member.interface';
import { createRole } from '@/api/assos/createRole';
import { addMember, deleteMember, updateMember } from '@/api/assos/manageMembers';
import { User } from '@/api/users/user.interface';
import { DataModalSchema, ModalCallbackType, ModalForm, WindowOptions } from '@/components/UI/ModalForm';

function RoleComponent({
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
      <h3>
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

type AssoDetailModalType =
  | { user: 'user'; roleId: 'string'; permissions: 'stringList'; endAt: 'date' }
  | {
      roleId: 'string';
      permissions: 'stringList';
      endAt: 'date';
    }
  | { confirmation: 'string' }
  | { roleId: 'string' };

export default function AssoDetailPage() {
  const params = useParams<{ assoId: string }>();
  const user = useAppSelector((state) => state.user);
  const [asso] = useAsso(params.assoId);
  const [members, setMembers] = useMembers(params.assoId);
  const [permissions, setPermissions] = useState(new Set<string>());
  const [displayOldMembers, setDisplayOldMembers] = useState(false);
  const [editMembersMode, setEditMembersMode] = useState(false);
  const [currentEditingRole, setCurrentEditingRole] = useState<string | null>(null);
  const { t } = useAppTranslation();

  const [modalForm, setModalForm] = useState<DataModalSchema<AssoDetailModalType> | null>(null);
  const [modalFormWindow, setModalFormWindow] = useState<WindowOptions | null>(null);
  const [extraModalData, setExtraModalData] = useState<Partial<{ roleId: string; memberId: string }>>({});

  const api = useAPI();

  useEffect(() => {
    const permissions = new Set(
      members
        .map((role) =>
          role.members.filter((member) => member.userId === user?.id).flatMap((member) => member.permissions),
        )
        .flat(),
    );
    setPermissions(permissions);
    console.log('Current user permissions:');
    console.log(permissions);
  }, [members, user]);

  const updateAssoRole = async (roleId: string, data: Partial<{ name: string; position: number }>) => {
    const role = members.find((r) => r.id === roleId);
    if (!role) return;
    const updatedRoles = await updateRole(
      api,
      asso!.id,
      roleId,
      data?.position ?? role.position,
      data?.name ?? role.name,
    );
    if (updatedRoles)
      setMembers(
        updatedRoles.map((role) => {
          const legacyRole = members.find((r) => r.id === role.id);
          return { ...role, members: legacyRole?.members ?? [] };
        }),
      );
  };

  const deleteAssoRole = async (roleId: string) => {
    const deletedRole = await deleteRole(api, asso!.id, roleId).toPromise();
    setMembers(members.filter((role) => role.id !== deletedRole?.id));
  };

  const createAssoRole = async (name: string) => {
    const createdRole = await createRole(api, asso!.id, name).toPromise();
    if (createdRole) setMembers([...members, { ...createdRole, members: [] }].sort((a, b) => a.position - b.position));
  };

  const createAssoMember = async (roleId: string, endAt: Date, permissions: string[], user: User) => {
    const newMembership = await addMember(api, asso!.id, roleId, user.id, endAt, permissions).toPromise();
    if (newMembership)
      setMembers((members) => {
        const role = members.find((r) => r.id === roleId);
        if (!role) return members;
        role.members.push({
          ...newMembership,
          firstName: user.firstName,
          lastName: user.lastName,
          permissions: permissions,
        });
        return [...members]; // force rerender
      });
  };

  const updateAssoMember = async (
    id: string,
    data: Partial<{ endAt: Date; permissions: string[]; roleId: string }>,
    roleId: string,
  ) => {
    const updatedMembership = await updateMember(api, asso.id, id, data).toPromise();
    setMembers((members) => {
      const affectedMembership = members
        .find((role) => role.id === roleId)
        ?.members.find((member) => member.id === updatedMembership?.id);
      if (affectedMembership && updatedMembership) {
        Object.assign(affectedMembership, updatedMembership);
        if (roleId !== data.roleId) {
          // Move member to another role
          const oldRole = members.find((role) => role.id === roleId);
          oldRole?.members.splice(oldRole.members.indexOf(affectedMembership!), 1);
          members.find((role) => role.id === data.roleId)?.members.push(affectedMembership!);
        }
      }
      return [...members]; // force rerender
    });
  };

  const deleteAssoMember = async (id: string) => {
    const deletedMembership = await deleteMember(api, asso.id, id).toPromise();
    setMembers((members) => {
      const affectedRole = members.find((role) => role.id === deletedMembership?.roleId);
      const affectedMembership = affectedRole?.members.find((member) => member.id === deletedMembership?.id);
      if (affectedMembership) Object.assign(affectedMembership, deletedMembership);
      return [...members]; // force rerender
    });
  };

  /* Modal entrypoints */

  const openModalForMemberCreation = (roleId: string) => {
    setModalFormWindow({ title: t('assos:member.add.title'), submitText: t('assos:member.add.submit') });
    setModalForm({
      user: { type: 'user', label: t('assos:member.add.label.user'), required: true },
      roleId: {
        type: 'string',
        label: t('assos:member.add.label.role'),
        options: members.map((role) => [role.name, role.id]),
        required: true,
        defaultValue: roleId,
      },
      permissions: {
        type: 'stringList',
        label: t('assos:member.add.label.permissions'),
        options: Array.from(permissions),
      },
      endAt: { type: 'date', label: t('assos:member.add.label.endAt'), required: true },
    });
  };

  const openModalForMemberUpdate = (member: Member, roleId: string) => {
    setExtraModalData({ roleId, memberId: member.id });
    setModalFormWindow({ title: t('assos:member.edit.title'), submitText: t('assos:member.edit.submit') });
    setModalForm({
      roleId: {
        type: 'string',
        label: t('assos:member.edit.label.role'),
        options: members.map((role) => [role.name, role.id]),
        required: true,
        defaultValue: roleId,
      },
      permissions: {
        type: 'stringList',
        label: t('assos:member.edit.label.permissions'),
        options: Array.from(permissions),
        defaultValue: member.permissions,
      },
      endAt: { type: 'date', label: t('assos:member.edit.label.endAt'), required: true, defaultValue: member.endAt },
    });
  };

  const openModalForRoleDeletion = (roleId: string) => {
    setExtraModalData({ roleId });
    setModalFormWindow({
      title: t('assos:member.role.delete.title'),
      submitText: t('assos:member.role.delete.submit'),
    });
    setModalForm({
      confirmation: {
        type: 'string',
        label: t('assos:member.role.delete.label'),
        options: [t('assos:member.role.delete.confirm')],
        required: true,
      },
    });
  };

  const openModalForRoleCreation = () => {
    setModalFormWindow({
      title: t('assos:member.role.create.title'),
      submitText: t('assos:member.role.create.submit'),
    });
    setModalForm({
      roleId: {
        type: 'string',
        label: t('assos:member.role.create.label'),
        required: true,
      },
    });
  };

  const handlePopupSubmit = (data: ModalCallbackType<AssoDetailModalType>) => {
    if ('user' in data && data.roleId && data.endAt && data.permissions) {
      createAssoMember(data.roleId, data.endAt, data.permissions, data.user);
    } else if ('permissions' in data && extraModalData.memberId && extraModalData.roleId && data.roleId && data.endAt) {
      updateAssoMember(
        extraModalData.memberId,
        { endAt: data.endAt, permissions: data.permissions, roleId: data.roleId },
        extraModalData.roleId,
      );
    } else if ('confirmation' in data && extraModalData.roleId) {
      deleteAssoRole(extraModalData.roleId);
    } else if ('roleId' in data) {
      createAssoRole(data.roleId);
    }
  };

  /* End of modal operations */

  return (
    <Page className={styles.page}>
      <div className={[styles.headerCard, !asso ? styles.glimmer : ''].filter((i) => i).join(' ')}>
        <img src={asso?.logo} alt={`Logo ${asso?.name}`} />
        <div className={styles.details}>
          <div>
            <h1>{asso?.name}</h1>
            <div>{asso?.description}</div>
          </div>
          <div className={styles.actionRow}>
            <Link href={asso?.website ? asso?.website.replace(/^(?:https?:\/\/)?/, 'https://') : '#'} noStyle newTab>
              <Icons.LinkExternal />
              <div>{asso?.website?.replace(/^https?:\/\/(?:www\.)?/, '')}</div>
            </Link>
            <Link href={asso?.mail ? asso?.mail.replace(/^(?:mailto:)?/, 'mailto:') : '#'} noStyle>
              <Icons.Mail />
              <div>{asso?.mail}</div>
            </Link>
            <Link
              href={
                asso?.phoneNumber
                  ? `${asso?.phoneNumber}`
                      .replace(/^0/, '+33')
                      .replace(/(?!^\+)\D/g, '')
                      .replace(/^(?:tel:)?/, 'tel:')
                  : '#'
              }
              noStyle>
              <Icons.Phone />
              <div>{asso?.phoneNumber}</div>
            </Link>
          </div>
        </div>
      </div>
      {!!members.length && (
        <div className={[styles.membersCard, editMembersMode ? styles.editMode : ''].filter((i) => i).join(' ')}>
          <h2>
            {t('assos:member.list.title')}
            <div className={styles.actionRow}>
              {permissions.has('manage_roles') && editMembersMode && (
                <Button onClick={openModalForRoleCreation} className={styles.toggleOldMembers}>
                  <Icons.Add />
                  {t('assos:member.role.add')}
                </Button>
              )}
              {!!permissions.size && (
                <Button onClick={() => setEditMembersMode(!editMembersMode)} className={styles.toggleOldMembers}>
                  {editMembersMode ? <Icons.Close /> : <Icons.Edit />}
                  {editMembersMode ? t('assos:member.edit.stop') : t('assos:member.edit')}
                </Button>
              )}
              {!editMembersMode && (
                <Button onClick={() => setDisplayOldMembers(!displayOldMembers)} className={styles.toggleOldMembers}>
                  {displayOldMembers ? <Icons.EyeOff /> : <Icons.EyeOn />}
                  {displayOldMembers ? t('assos:member.old.hide') : t('assos:member.old.display')}
                </Button>
              )}
            </div>
          </h2>
          <VerticalSortDnd
            items={members}
            setItems={setMembers}
            onItemMoved={(id, newIndex) => updateAssoRole(id, { position: newIndex })}
            inflater={({ item: role }) => (
              <RoleComponent
                role={role}
                editing={currentEditingRole === role.id}
                hasPermission={permissions.has('manage_roles')}
                hasMembersPermission={permissions.has('manage_members')}
                canEdit={editMembersMode}
                displayOldMembers={displayOldMembers}
                deleteAssoRole={openModalForRoleDeletion}
                updateAssoRole={updateAssoRole}
                createAssoMember={openModalForMemberCreation}
                deleteAssoMember={deleteAssoMember}
                updateAssoMember={openModalForMemberUpdate}
                setCurrentEditingRole={setCurrentEditingRole}
              />
            )}
            disabled={!editMembersMode || !permissions.has('manage_roles')}></VerticalSortDnd>
        </div>
      )}
      {modalForm && modalFormWindow && (
        <ModalForm<AssoDetailModalType>
          onSubmit={handlePopupSubmit}
          onClose={() => {
            setModalForm(null);
            setModalFormWindow(null);
          }}
          window={modalFormWindow}
          fields={modalForm}
        />
      )}
    </Page>
  );
}
