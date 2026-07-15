import Icons from '@/icons';
import styles from './FileUpload.module.scss';
import { MutableRefObject, useEffect, useState } from 'react';

export type FileType = 'image/png' | 'image/jpeg' | 'image/webp' | 'image/avif' | 'image/tiff' | 'application/pdf';
function isPicture(fileType: string | undefined) {
  const extensions = ['png', 'jpg', 'jpeg', 'webp', 'avif', 'tif', 'tiff'];
  return extensions.includes(fileType?.split('.')?.findLast(() => true) || '');
}

export default function FileUpload({
  onFileChange,
  fileRef,
  placeholder,
  fileTypes = [],
  className = '',
  disabled = false,
  supportsPictureRotation = false,
}: {
  onFileChange: (rotation: number) => void;
  fileRef: MutableRefObject<File | undefined>;
  placeholder: string;
  fileTypes?: FileType[];
  className?: string | string[];
  disabled?: boolean;
  supportsPictureRotation?: boolean;
}) {
  const [dataURL, setDataURL] = useState<string | undefined>();
  const [filename, setFilename] = useState<string | undefined>();
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    onFileChange(rotation);
  }, [rotation]);

  return (
    <div className={[styles.dropzone, className].flat().join(' ')}>
      {dataURL ? (
        <img
          className={styles.cover}
          src={dataURL}
          alt={filename ?? placeholder}
          style={{ transform: `rotate(${90 * rotation}deg)` }}
        />
      ) : (
        filename ?? placeholder
      )}
      <input
        type="file"
        accept={fileTypes.join()}
        disabled={disabled}
        onChange={(event) => {
          fileRef.current = event.target.files?.item(0) || undefined;
          setFilename(fileRef.current?.name);
          let url: string | undefined = undefined;
          if (fileRef.current && isPicture(fileRef.current.name)) {
            const reader = new FileReader();
            reader.readAsDataURL(fileRef.current);
            reader.onload = (event) => {
              if (typeof event.target?.result === 'string') url = event.target?.result;
              setDataURL(url);
              setRotation(0);
            };
          } else {
            setDataURL(url);
            setRotation(0);
          }
        }}
      />
      {dataURL && (
        <div className={styles.toolbar}>
          {supportsPictureRotation && (
            <div className={styles.action} onClick={() => setRotation((rotation + 1) % 4)}>
              <Icons.Rotate />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
