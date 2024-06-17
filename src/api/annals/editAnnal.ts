import { API } from '../api';
import { Annal } from './annal.interface';

export interface EditAnnalDto {
  semester?: string;
  typeId?: string;
}

export function editAnnal(api: API, annalId: string, options: EditAnnalDto) {
  return api.patch<EditAnnalDto, Annal>(`/ue/annals/${annalId}`, options);
}
