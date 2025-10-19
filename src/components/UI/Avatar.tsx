import { PropsWithoutRef } from 'react';
import styles from './Avatar.module.scss';
import { computeApiURL, useAPI } from '@/api/api';
import { PartialUploadResponse } from './LexicalPlugins/ImageDropPlugin';
import { useAppTranslation } from '@/lib/i18n';
import { IconEdit } from 'obra-icons-react';
import { ImageMedia } from './ImageMedia';

type AvatarProps = PropsWithoutRef<{
  localSrc?: string;
  name?: string;
  editable?: boolean;
  className?: string;
  isPublic?: boolean;
  onChange?: (mediaId: string) => void;
}>;

export default function Avatar({ localSrc, name, editable, className, onChange, isPublic }: AvatarProps) {
  const api = useAPI();
  const { t } = useAppTranslation();

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const uploadResponse = await api
      .post<
        FormData,
        PartialUploadResponse
      >(`/media/image?public=${!!isPublic}&preset=AVATAR`, formData, { isFile: true })
      .toPromise();
    if (uploadResponse?.id && onChange) onChange(uploadResponse.id);
  };

  return (
    <div className={[styles.avatar, className].filter((c) => c).join(' ')}>
      {editable && (
        <>
          <label className={styles.avatarEdit}>
            {t('common:ui.profilepicture.uplaod')}
            <input
              type="file"
              accept="image/webp,image/png,image/jpeg,image/avif,image/tiff"
              onChange={(event) => event.target.files && uploadFile(event.target.files[0])}
            />
          </label>
          <IconEdit />
        </>
      )}
      {name?.charAt(0) || '?'}
      {localSrc && <ImageMedia src={computeApiURL(localSrc)} displayWhileLoading={false} />}
    </div>
  );
}
