'use client';

import { useEffect, useRef, useState } from 'react';
import {
  IconAdd,
  IconCall,
  IconCheck,
  IconClose,
  IconEdit,
  IconEmail,
  IconExternalLink,
  IconEye,
  IconEyeOff,
} from 'obra-icons-react';
import { useParams } from 'next/navigation';
import styles from './style.module.scss';
import { useAsso } from '@/api/assos/fetchAsso.hook';
import Page from '@/components/utilities/Page';
import { useMembers } from '@/api/assos/fetchAssoMembers.hook';
import Icons from '@/icons';
import Link from '@/components/UI/Link';
import { useAppTranslation } from '@/lib/i18n';
import Button from '@/components/UI/Button';
import { useConnectedUser } from '@/module/session';
import { useAppSelector } from '@/lib/hooks';
import { deleteRole } from '@/api/assos/deleteRole';
import { useAPI } from '@/api/api';
import { VerticalSortDnd } from '@/components/UI/VerticalSortDnd';
import { updateRole } from '@/api/assos/updateRole';
import { Member } from '@/api/assos/member.interface';
import { createRole } from '@/api/assos/createRole';
import { addMember, deleteMember, updateMember } from '@/api/assos/manageMembers';
import { User } from '@/api/users/user.interface';
import { DataModalSchema, ModalStates, ModalForm, WindowOptions } from '@/components/UI/ModalForm';
import { AssoRole } from '@/components/assos/AssoRole';
import { c } from '@/utils';
import LexicalTextEditor, { $makeJson } from '@/components/UI/LexicalTextEditor';
import Input from '@/components/UI/Input';
import Avatar from '@/components/UI/Avatar';
import { AssoUpdateRequest } from '@/api/assos/asso.interface';
import { updateAsso } from '@/api/assos/updateAsso';

type CreateAssoRoleModalFields = { name: 'string' };
type DeleteAssoRoleModalFields = { confirmation: 'string' };
type CreateAssoMemberModalFields = { user: 'user'; roleId: 'string'; permissions: 'stringList'; endAt: 'date' };
type UpdateAssoMemberModalFields = { roleId: 'string'; permissions: 'stringList'; endAt: 'date' };
type AssoDetailModalFields =
  | CreateAssoRoleModalFields
  | DeleteAssoRoleModalFields
  | CreateAssoMemberModalFields
  | UpdateAssoMemberModalFields;

type CreateAssoRoleModalData = { id: 'create-role' };
type DeleteAssoRoleModalData = { id: 'delete-role'; roleId: string };
type CreateAssoMemberModalData = { id: 'create-member' };
type UpdateAssoMemberModalData = { id: 'update-member'; roleId: string; memberId: string };
type ExtraModalData =
  | CreateAssoRoleModalData
  | DeleteAssoRoleModalData
  | CreateAssoMemberModalData
  | UpdateAssoMemberModalData;

export default function AssoDetailPage() {
  const params = useParams<{ assoId: string }>();
  const user = useConnectedUser();
  const [asso, setAsso] = useAsso(params.assoId);
  const [members, setMembers] = useMembers(params.assoId);
  const [permissions, setPermissions] = useState(new Set<string>());
  const [displayOldMembers, setDisplayOldMembers] = useState(false);
  const [editInfosMode, setEditInfosMode] = useState(false);
  const [editMembersMode, setEditMembersMode] = useState(false);
  const [currentEditingRole, setCurrentEditingRole] = useState<string | null>(null);
  const { t } = useAppTranslation();
  const [modalForm, setModalForm] = useState<DataModalSchema<AssoDetailModalFields> | null>(null);
  const [modalFormWindow, setModalFormWindow] = useState<WindowOptions | null>(null);
  const [extraModalData, setExtraModalData] = useState<ExtraModalData | null>(null);
  const [assoEdit, setAssoEdit] = useState<AssoUpdateRequest>({});
  const stateRef = useRef<(state: string) => void>(() => {});

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
  }, [members, user]);

  useEffect(() => {
    if (asso?.description) stateRef.current?.(asso.description);
  }, [asso]);

  // Asso edition zone

  const toggleAssoInfoEdition = () => {
    if (!editInfosMode) {
      setAssoEdit({
        name: asso?.name,
        description: { fr: asso?.description },
        website: asso?.website,
        mail: asso?.mail,
        phoneNumber: asso?.phoneNumber,
        logo: asso?.logo,
      });
    } else {
      const updatePayload: AssoUpdateRequest = {};
      if (asso?.name !== assoEdit.name) updatePayload.name = assoEdit.name;
      if (
        asso?.description !== assoEdit.description?.fr &&
        $makeJson(asso?.description ?? '') !== assoEdit.description?.fr
      )
        updatePayload.description = assoEdit.description;
      if (asso?.website !== assoEdit.website) updatePayload.website = assoEdit.website;
      if (asso?.mail !== assoEdit.mail) updatePayload.mail = assoEdit.mail;
      if (asso?.phoneNumber !== assoEdit.phoneNumber) updatePayload.phoneNumber = assoEdit.phoneNumber;
      if (assoEdit.logo && asso?.logo !== `/image/media/${assoEdit.logo}.webp`) updatePayload.logo = assoEdit.logo;
      if (Object.keys(updatePayload).length > 0)
        updateAsso(api, asso!.id, updatePayload).then((asso) => asso && setAsso(asso));
      setAssoEdit({});
    }
    setEditInfosMode(!editInfosMode);
  };

  const updateAssoEdit = (update: AssoUpdateRequest) => {
    setAssoEdit({ ...assoEdit, ...update });
  };

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

  // Asso role & members zone

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
    if (newMembership) {
      setMembers(
        members.map((role) =>
          role.id === roleId
            ? {
                ...role,
                members: [
                  ...role.members,
                  { ...newMembership, firstName: user.firstName, lastName: user.lastName, permissions: permissions },
                ],
              }
            : role,
        ),
      );
    }
  };

  const updateAssoMember = async (
    id: string,
    data: Partial<{ endAt: Date; permissions: string[]; roleId: string }>,
    roleId: string,
  ) => {
    if (data.roleId === roleId) delete data.roleId; // the api will refuse to update if roleId is the same
    const updatedMembership = await updateMember(api, asso!.id, id, data).toPromise();
    setMembers((members) => {
      const affectedMembership = members
        .find((role) => role.id === roleId)
        ?.members.find((member) => member.id === updatedMembership?.id);
      if (affectedMembership && updatedMembership) {
        Object.assign(affectedMembership, updatedMembership);
        if (data.roleId && roleId !== data.roleId) {
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
    const deletedMembership = await deleteMember(api, asso!.id, id).toPromise();
    setMembers((members) => {
      const affectedRole = members.find((role) => role.id === deletedMembership?.roleId);
      const affectedMembership = affectedRole?.members.find((member) => member.id === deletedMembership?.id);
      if (affectedMembership) Object.assign(affectedMembership, deletedMembership);
      return [...members]; // force rerender
    });
  };

  /* Modal entrypoints */

  const openModalForMemberCreation = (roleId: string) => {
    setExtraModalData({ id: 'create-member' });
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
    setExtraModalData({ id: 'update-member', roleId, memberId: member.id });
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
    setExtraModalData({ id: 'delete-role', roleId });
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
    setExtraModalData({ id: 'create-role' });
    setModalFormWindow({
      title: t('assos:member.role.create.title'),
      submitText: t('assos:member.role.create.submit'),
    });
    setModalForm({
      name: {
        type: 'string',
        label: t('assos:member.role.create.label'),
        required: true,
      },
    });
  };

  const handlePopupSubmit = (genericData: ModalStates<AssoDetailModalFields>) => {
    if (extraModalData?.id === 'create-member') {
      const data = genericData as ModalStates<CreateAssoMemberModalFields>;
      createAssoMember(data.roleId, data.endAt, data.permissions, data.user);
    } else if (extraModalData?.id === 'update-member') {
      const data = genericData as ModalStates<UpdateAssoMemberModalFields>;
      updateAssoMember(extraModalData.memberId, data, extraModalData.roleId);
    } else if (extraModalData?.id === 'delete-role') {
      deleteAssoRole(extraModalData.roleId);
    } else if (extraModalData?.id === 'create-role') {
      const data = genericData as ModalStates<CreateAssoRoleModalFields>;
      createAssoRole(data.name);
    }
  };

  /* End of modal operations */

  return (
    <Page className={styles.page}>
      <div className={c(styles.headerCard, !asso && styles.glimmer)}>
        {permissions.has('manage_infos') && (
          <Button onClick={toggleAssoInfoEdition} className={styles.edit}>
            {editInfosMode ? <IconCheck /> : <IconEdit />}
            {editInfosMode ? t('assos:infos.edit.save') : t('assos:infos.edit')}
          </Button>
        )}
        <Avatar
          className={styles.logo}
          localSrc={assoEdit.logo ? `/media/image/${assoEdit.logo}.webp` : asso?.logo}
          name={asso?.name}
          editable={editInfosMode}
          isPublic={true}
          onChange={(mediaId) => updateAssoEdit({ logo: mediaId })}
        />
        <div className={styles.details}>
          <div>
            <h1>
              {editInfosMode ? (
                <Input value={assoEdit.name} onChange={(name) => updateAssoEdit({ name })} />
              ) : (
                asso?.name
              )}
            </h1>
            {asso ? (
              <LexicalTextEditor
                bundle="@etuutt/full"
                placeholder={t('assos:infos.edit.description.placeholder')}
                emptyText={t('assos:infos.description.empty')}
                initialState={$makeJson(asso.description)}
                onChange={(state) => updateAssoEdit({ description: { fr: state } })}
                setStateRef={stateRef}
                disabled={!editInfosMode}
              />
            ) : (
              <>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </>
            )}
          </div>
          <div className={styles.actionRow}>
            {editInfosMode ? (
              <>
                <Input
                  value={assoEdit.website}
                  icon={IconExternalLink}
                  onChange={(website) => updateAssoEdit({ website })}
                />
                <Input value={assoEdit.mail} icon={IconEmail} onChange={(mail) => updateAssoEdit({ mail })} />
                <Input
                  value={assoEdit.phoneNumber}
                  icon={IconCall}
                  onChange={(phoneNumber) => updateAssoEdit({ phoneNumber })}
                />
              </>
            ) : (
              <>
                <Link
                  href={asso?.website ? asso?.website.replace(/^(?:https?:\/\/)?/, 'https://') : '#'}
                  noStyle
                  newTab>
                  <IconExternalLink />
                  <div>{asso?.website?.replace(/^https?:\/\/(?:www\.)?/, '')}</div>
                </Link>
                <Link href={asso?.mail ? asso?.mail.replace(/^(?:mailto:)?/, 'mailto:') : '#'} noStyle>
                  <IconEmail />
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
                  <IconCall />
                  <div>{asso?.phoneNumber}</div>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      {!!members.length && (
        <div className={c(styles.membersCard, editMembersMode && styles.editMode)}>
          <h2>
            {t('assos:member.list.title')}
            <div className={styles.actionRow}>
              {permissions.has('manage_roles') && editMembersMode && (
                <Button onClick={openModalForRoleCreation} className={styles.toggleOldMembers}>
                  {t('assos:member.role.add')}
                </Button>
              )}
              {!!permissions.size && (
                <Button onClick={() => setEditMembersMode(!editMembersMode)} className={styles.toggleOldMembers}>
                  {editMembersMode ? <IconClose /> : <IconEdit />}
                  {editMembersMode ? t('assos:member.edit.stop') : t('assos:member.edit')}
                </Button>
              )}
              {!editMembersMode && (
                <Button onClick={() => setDisplayOldMembers(!displayOldMembers)} className={styles.toggleOldMembers}>
                  {displayOldMembers ? <IconEyeOff /> : <IconEye />}
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
              <AssoRole
                role={role}
                editing={currentEditingRole === role.id}
                hasEditRolesPermission={permissions.has('manage_roles')}
                hasEditMembersPermission={permissions.has('manage_members')}
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
      {modalForm && modalFormWindow && extraModalData && (
        <ModalForm<AssoDetailModalFields>
          onSubmit={handlePopupSubmit}
          onClose={() => {
            setModalForm(null);
            setModalFormWindow(null);
            setExtraModalData(null);
          }}
          window={modalFormWindow}
          fields={modalForm}
        />
      )}
    </Page>
  );
}
