import { apiUrl } from '@/utils/environment';

export interface RequestDto {}
export interface ResponseDto {}

export type APIResponse<ResponseType extends ResponseDto> =
  | {
      error: 'no-error';
      code: number;
      body: ResponseType;
    }
  | { error: 'not-json' | 'timeout' | 'unknown' };

// Send request to API and handle errors
async function requestAPI<RequestType extends RequestDto, ResponseType extends ResponseDto>(
  method: string,
  route: string,
  body: RequestType | null = null,
): Promise<APIResponse<ResponseType>> {
  let didTimeOut = false;

  // if base url last char is a slash, remove it
  let baseURL = apiUrl();
  if (baseURL[baseURL.length] === '/') baseURL = baseURL.substring(0, baseURL.length - 1);

  // Generate headers
  const token = getAuthorizationToken();
  const headers = new Headers();
  headers.append('Authorization', token ? `Bearer ${token}` : '');
  headers.append('Content-Type', 'application/json');

  try {
    // Add manual timeout as not supported by fetch
    const timeout = setTimeout(() => {
      if (!didTimeOut) {
        didTimeOut = true;
        console.error('Timed out');
      }
    }, 10000);
    // Make the request
    const response = await fetch(baseURL + route, {
      method,
      headers,
      body: method === 'GET' || method === 'DELETE' ? undefined : JSON.stringify(body),
      cache: 'no-cache',
    });
    // The request has ended, we didn't time out
    clearTimeout(timeout);

    if (!response.headers.get('content-type')?.includes('application/json')) {
      return { error: 'not-json' };
    }
    return { error: 'no-error', code: response.status, body: (await response.json()) as ResponseType };
  } catch (
    /* eslint-disable @typescript-eslint/no-explicit-any */
    error: any
  ) {
    if (error.message.startsWith('Network Error') || error.code === 'ECONNABORTED') {
      console.error('Cannot connect to server');
    } else {
      console.error('An error occurred when making a request to the API');
    }

    if (didTimeOut) return { error: 'timeout' };
    return { error: 'unknown' };
  }
}

// Set the authorization header with the given token for next requests
const getAuthorizationToken = () => localStorage.getItem('etuutt-token');

// Access the API through different HTTP methods
export const API = {
  get: (route: string) => requestAPI('GET', route, {}),

  post: <RequestType extends RequestDto, ResponseType extends ResponseDto>(route: string, body: RequestType) =>
    requestAPI<RequestType, ResponseType>('POST', route, body),

  put: <RequestType extends RequestDto, ResponseType extends ResponseDto>(route: string, body: RequestType) =>
    requestAPI<RequestType, ResponseType>('PUT', route, body),

  patch: <RequestType extends RequestDto, ResponseType extends ResponseDto>(route: string, body: RequestType) =>
    requestAPI<RequestType, ResponseType>('PATCH', route, body),

  delete: (route: string) => requestAPI('DELETE', route, {}),
};
