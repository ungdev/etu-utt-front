import { API } from '../api';
import { Annal } from './annal.interface';

export interface CreateAnnalDto {
  ueCode: string;
  semester: string;
  typeId: string;
}

export interface CreateAnnalOptions extends CreateAnnalDto {
  file: File;
  rotate: number;
}

export async function createAnnal(api: API, { ueCode, semester, typeId, rotate, file }: CreateAnnalOptions) {
  const annal = await api.post<CreateAnnalDto, Annal>('/ue/annals', { ueCode, semester, typeId }).toPromise();
  if (!annal) throw new Error();
  const formData = new FormData();
  formData.set('file', file);
  return api.put<FormData, Annal>(`/ue/annals/${annal.id}?rotate=${rotate}`, formData, { isFile: true }).toPromise();
}
