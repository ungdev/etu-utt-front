import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  DRAGEND_COMMAND,
  DRAGOVER_COMMAND,
  DROP_COMMAND,
  LexicalEditor,
} from 'lexical';
import { useEffect, useState } from 'react';
import { ImageNode } from './ImageNode';
import { INSERT_IMAGE_COMMAND } from './ImagePlugin';
import { computeApiURL, useAPI } from '@/api/api';

interface PartialUploadResponse {
  id: string;
  width: number;
  height: number;
}

export function ImageDropPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isHovered, setIsHovered] = useState(false);
  const api = useAPI();

  function onDragover(event: DragEvent) {
    const file = getImageFromDataTransfer(event.dataTransfer!);
    if (file) {
      setIsHovered(true);
      event.preventDefault();
    }
    return !!file;
  }

  function onDragEnd() {
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

    return mergeRegister(
      editor.registerCommand(DRAGOVER_COMMAND, (event) => onDragover(event), COMMAND_PRIORITY_LOW),
      editor.registerCommand(DRAGEND_COMMAND, () => onDragEnd(), COMMAND_PRIORITY_HIGH),
      editor.registerCommand(DROP_COMMAND, (event) => onDrop(event, editor), COMMAND_PRIORITY_HIGH),
    );
  }, [editor]);

  return <div className={isHovered ? 'dropZone' : undefined}></div>;
}

function getImageFromDataTransfer(dataTransfer: DataTransfer) {
  const files = dataTransfer.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.type.startsWith('image/')) return file;
  }
  return null;
}
