import { API, handleAPIResponse } from '@/api/api';
import { StatusCodes } from 'http-status-codes';
import { Profile } from '@/api/profile/profile.types';

export async function fetchProfile(): Promise<Profile | null> {
  const res = await API.get<Profile>('/profile');
  return handleAPIResponse(res, {
    [StatusCodes.OK]: (body) => body,
  });
}
