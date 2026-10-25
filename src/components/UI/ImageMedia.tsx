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

  const isWorld = !worldSrc.startsWith(buildApiUrl('/media/image/'));

  useEffect(() => {
    if (!isWorld) {
      let blobUrl: string;
      let cancelled = false;
      const req = api
        .getFile(worldSrc.slice(buildApiUrl('').length), { forceCache: true })
        .on('success', (blob) => !cancelled && setSrc((blobUrl = URL.createObjectURL(blob))));
      return () => {
        cancelled = true;
        if (blobUrl) URL.revokeObjectURL(blobUrl);
        else req.abort();
      };
    }
  }, [worldSrc]);

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
