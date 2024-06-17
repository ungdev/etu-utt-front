import { API } from '../api';
import { Annal } from './annal.interface';

export function deleteAnnal(api: API, annalId: string) {
  return api.delete<Annal>(`/ue/annals/${annalId}`);
}
