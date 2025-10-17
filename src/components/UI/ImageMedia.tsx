import { computeApiURL, useAPI } from '@/api/api';
import { type MouseEventHandler, PropsWithoutRef, useEffect, useState } from 'react';

export type ImageMediaProps = PropsWithoutRef<{
  src: string;
  altText?: string;
  className?: string;
  width?: number | 'inherit';
  height?: number | 'inherit';
  onClick?: MouseEventHandler<HTMLImageElement>;
}>;

export function ImageMedia({ src: worldSrc, altText, className, width, height, onClick }: ImageMediaProps) {
  const [src, setSrc] = useState('');
  const api = useAPI();

  useEffect(() => {
    if (!worldSrc.startsWith(computeApiURL('/media/image/'))) {
      setSrc(worldSrc);
      return;
    }
    api
      .get(worldSrc.slice(computeApiURL('').length), { isFile: true })
      .toPromise()
      .then((blob) => setSrc(URL.createObjectURL(blob!)));
    return () => {
      if (src.startsWith('blob:')) URL.revokeObjectURL(src);
    };
  }, [worldSrc]);

  return (
    <img
      className={className}
      src={src}
      width={Number.isInteger(width) ? width : undefined}
      height={Number.isInteger(height) ? height : undefined}
      alt={altText}
      onClick={onClick}
      referrerPolicy="no-referrer"
    />
  );
}
