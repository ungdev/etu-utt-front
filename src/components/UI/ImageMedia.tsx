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
    if (worldSrc.startsWith(buildApiUrl('/media/image/'))) {
      api
        .getFile(worldSrc.slice(buildApiUrl('').length), { forceCache: true })
        .on('success', (blob) => setSrc(URL.createObjectURL(blob!)))
        .toPromise()
        .then((blob) => blob && setSrc(URL.createObjectURL(blob)));
      return () => {
        if (src.startsWith('blob:')) URL.revokeObjectURL(src);
      };
    }
  }, [worldSrc]);

  const isWorld = !worldSrc.startsWith(buildApiUrl('/media/image/'));
  return (
    (src || displayWhileLoading || isWorld) && (
      <img
        className={className}
        src={isWorld ? src || undefined : worldSrc}
        width={Number.isInteger(width) ? width : undefined}
        height={Number.isInteger(height) ? height : undefined}
        alt={altText}
        onClick={onClick}
        referrerPolicy="no-referrer"
      />
    )
  );
}
