import { buildApiUrl, useAPI } from '@/api/api';
import { type MouseEventHandler, PropsWithoutRef, useEffect, useState } from 'react';

export type ImageMediaProps = PropsWithoutRef<{
  src: string;
  altText?: string;
  className?: string;
  width?: number | 'inherit';
  height?: number | 'inherit';
  onClick?: MouseEventHandler<HTMLImageElement>;
  displayWhileLoading?: boolean;
}>;

export function ImageMedia({
  src: worldSrc,
  altText,
  className,
  width,
  height,
  onClick,
  displayWhileLoading = true,
}: ImageMediaProps) {
  const [src, setSrc] = useState('');
  const api = useAPI();

  useEffect(() => {
    if (!worldSrc.startsWith(buildApiUrl('/media/image/'))) {
      setSrc(worldSrc);
      return;
    }
    api
      .getFile(worldSrc.slice(buildApiUrl('').length), { forceCache: true })
      .on('success', (blob) => setSrc(URL.createObjectURL(blob!)))
      .toPromise()
      .then((blob) => setSrc(URL.createObjectURL(blob!)));
    return () => {
      if (src.startsWith('blob:')) URL.revokeObjectURL(src);
    };
  }, [worldSrc]);

  return (
    (src || displayWhileLoading) && (
      <img
        className={className}
        src={src || undefined}
        width={Number.isInteger(width) ? width : undefined}
        height={Number.isInteger(height) ? height : undefined}
        alt={altText}
        onClick={onClick}
        referrerPolicy="no-referrer"
      />
    )
  );
}
