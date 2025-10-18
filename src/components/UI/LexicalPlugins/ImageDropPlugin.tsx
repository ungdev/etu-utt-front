import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
  $addUpdateTag,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  createCommand,
  DRAGOVER_COMMAND,
  DROP_COMMAND,
  LexicalEditor,
  PASTE_COMMAND,
  SKIP_SELECTION_FOCUS_TAG,
} from 'lexical';
import { useEffect, useState } from 'react';
import { ImageNode } from './ImageNode';
import { INSERT_IMAGE_COMMAND } from './ImagePlugin';
import { API, computeApiURL, useAPI } from '@/api/api';
import { useAppTranslation } from '@/lib/i18n';
import styles from '../LexicalTextEditor.module.scss';

export const DRAGLEAVE_COMMAND = createCommand<DragEvent>('DRAGLEAVE_COMMAND');

export interface PartialUploadResponse {
  id: string;
  width: number;
  height: number;
}

export async function uploadFile(file: File, api: API, editor: LexicalEditor) {
  const formData = new FormData();
  formData.append('file', file);
  const uploadResponse = await api
    .post<FormData, PartialUploadResponse>(`/media/image?public=true`, formData, { isFile: true })
    .toPromise();
  editor.update(() => {
    $addUpdateTag(SKIP_SELECTION_FOCUS_TAG);
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
      src: computeApiURL(`/media/image/${uploadResponse!.id}.webp`),
      width: uploadResponse!.width,
      height: uploadResponse!.height,
    });
  });
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
    const file = getImagesFromFileList(event.dataTransfer!.files);
    if (file.length) {
      setIsHovered(false);
      event.preventDefault();
    }
    file.forEach((f) => uploadFile(f, api, editor));
    return !!file.length;
  }

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) throw new Error('ImagePlugin: ImageNode not registered on editor');

    const listener = (event: DragEvent) => editor.dispatchCommand(DRAGLEAVE_COMMAND, event);
    editor.getRootElement()?.addEventListener('dragleave', listener);
    return mergeRegister(
      editor.registerCommand(DRAGOVER_COMMAND, (event) => onDragOver(event), COMMAND_PRIORITY_LOW),
      editor.registerCommand(DRAGLEAVE_COMMAND, () => onDragLeave(), COMMAND_PRIORITY_HIGH),
      editor.registerCommand(DROP_COMMAND, (event) => onDrop(event, editor), COMMAND_PRIORITY_HIGH),
      editor.registerCommand(
        PASTE_COMMAND,
        (event) => {
          if (event instanceof ClipboardEvent) {
            const files = getImagesFromFileList(event.clipboardData!.files);
            if (files.length) event.preventDefault();
            files.forEach((file) => uploadFile(file, api, editor));
            return !!files.length;
          }
          return false;
        },
        COMMAND_PRIORITY_HIGH,
      ),
      () => editor.getRootElement()?.removeEventListener('dragleave', listener),
    );
  }, [editor]);

  return <div className={isHovered ? styles.dropZone : undefined}>{isHovered && t('common:rte.dnd.drop')}</div>;
}

function getImagesFromFileList(fileList: FileList) {
  const list = [] as File[];
  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i];
    if (file.type.startsWith('image/')) list.push(file);
  }
  return list;
}
