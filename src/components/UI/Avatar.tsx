import { PropsWithoutRef } from 'react';
import styles from './Avatar.module.scss';
import { buildApiUrl, useAPI } from '@/api/api';
import { useAppTranslation } from '@/lib/i18n';
import { IconEdit } from 'obra-icons-react';
import { ImageMedia } from './ImageMedia';
import { c } from '@/utils';
import { uploadPublicImage } from '@/api/media/uploadImage';

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
    const uploadResponse = await uploadPublicImage(api, file, { public_: isPublic, preset: 'AVATAR' });
    if (uploadResponse?.id && onChange) onChange(uploadResponse.id);
  };

  return (
    <div className={c(styles.avatar, className)}>
      {editable && (
        <>
          <label className={styles.avatarEdit}>
            {t('common:ui.profilepicture.upload')}
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
      {localSrc && <ImageMedia src={buildApiUrl(localSrc)} displayWhileLoading={false} />}
    </div>
  );
}
