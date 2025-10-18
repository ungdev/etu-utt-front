import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  createCommand,
  DRAGOVER_COMMAND,
  DROP_COMMAND,
  LexicalEditor,
} from 'lexical';
import { useEffect, useState } from 'react';
import { ImageNode } from './ImageNode';
import { INSERT_IMAGE_COMMAND } from './ImagePlugin';
import { computeApiURL, useAPI } from '@/api/api';
import styles from '../LexicalTextEditor.module.scss';
import { useAppTranslation } from '@/lib/i18n';

export const DRAGLEAVE_COMMAND = createCommand<DragEvent>('DRAGLEAVE_COMMAND');

interface PartialUploadResponse {
  id: string;
  width: number;
  height: number;
}

export function ImageDropPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isHovered, setIsHovered] = useState(false);
  const api = useAPI();
  const { t } = useAppTranslation();

  function onDragOver(event: DragEvent) {
    if (event.dataTransfer!.types.includes('Files')) {
      setIsHovered(true);
      event.preventDefault();
      return true;
    }
    return false;
  }

  function onDragLeave() {
    setIsHovered(false);
    return true;
  }

  function onDrop(event: DragEvent, editor: LexicalEditor) {
    const file = getImageFromDataTransfer(event.dataTransfer!);
    if (!file) return false;
    setIsHovered(false);
    event.preventDefault();
    uploadFile(file, editor);
    return true;
  }

  async function uploadFile(file: File, editor: LexicalEditor) {
    const formData = new FormData();
    formData.append('file', file);
    const uploadResponse = await api
      .post<FormData, PartialUploadResponse>(`/media/image?public=true`, formData, { isFile: true })
      .toPromise();
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
      src: computeApiURL(`/media/image/${uploadResponse!.id}.webp`),
      width: uploadResponse!.width,
      height: uploadResponse!.height,
    });
  }

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) throw new Error('ImagePlugin: ImageNode not registered on editor');

    const listener = (event: DragEvent) => editor.dispatchCommand(DRAGLEAVE_COMMAND, event);
    editor.getRootElement()?.addEventListener('dragleave', listener);
    return mergeRegister(
      editor.registerCommand(DRAGOVER_COMMAND, (event) => onDragOver(event), COMMAND_PRIORITY_LOW),
      editor.registerCommand(DRAGLEAVE_COMMAND, () => onDragLeave(), COMMAND_PRIORITY_HIGH),
      editor.registerCommand(DROP_COMMAND, (event) => onDrop(event, editor), COMMAND_PRIORITY_HIGH),
      () => editor.getRootElement()?.removeEventListener('dragleave', listener),
    );
  }, [editor]);

  return <div className={isHovered ? styles.dropZone : undefined}>{isHovered && t('common:rte.dnd.drop')}</div>;
}

function getImageFromDataTransfer(dataTransfer: DataTransfer) {
  const files = dataTransfer.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.type.startsWith('image/')) return file;
  }
  return null;
}
