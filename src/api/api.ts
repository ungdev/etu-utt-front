import { apiUrl } from '@/utils/environment';
import { StatusCodes } from 'http-status-codes';

export enum ResponseError {
  'not_json',
  'timeout',
  'unknown',
}

export type APIResponse<ResponseType> =
  | {
      error: 'no_error';
      code: number;
      body: ResponseType;
    }
  | { error: ResponseError };

type RawResponseType<T> = {
  [K in keyof T]: T[K] extends object ? RawResponseType<T[K]> : T[K] extends Date ? string : T[K];
};

export function handleAPIResponse<T extends object, R>(
  response: APIResponse<T>,
  handlers: { [status: number]: (body: T) => R } & Partial<{ [status in ResponseError]: () => R }>,
): R | null {
  if (response.error === 'no_error') {
    if (handlers[response.code]) {
      return handlers[response.code](response.body);
    } else {
      console.error(`Unsupported response code : ${response.code}`);
      return null;
    }
  } else {
    if (handlers[response.error]) {
      return handlers[response.error]!();
    } else {
      console.error(`Unsupported error type : ${response.error}`);
      return null;
    }
  }
}

function formatResponse<T>(rawResponse: RawResponseType<T> | T): T {
  function internalFormatResponse<T extends object>(rawResponse: RawResponseType<T> | T): T {
    const response: Partial<T> = {};
    for (const [key, value] of Object.entries(rawResponse)) {
      if (Array.isArray(value)) {
        response[key] = value.map(internalFormatResponse) as T[keyof T];
      } else if (typeof value === 'object' && value !== null) {
        response[key] = internalFormatResponse(value as object) as T[keyof T];
      } else if (typeof value === 'string' && !isNaN(Date.parse(value))) {
        response[key] = new Date(value) as T[keyof T];
      } else {
        response[key] = value as T[keyof T];
      }
    }
    return response as T;
  }
  return internalFormatResponse({ value: rawResponse }).value as T;
}

// Send request to API and handle errors
async function requestAPI<RequestType, ResponseType>(
  method: string,
  route: string,
  body: RequestType | null = null,
  timeoutMillis = 10000,
): Promise<APIResponse<ResponseType>> {
  // Generate headers
  const token = getAuthorizationToken();
  const headers = new Headers();
  headers.append('Authorization', token ? `Bearer ${token}` : '');
  headers.append('Content-Type', 'application/json');

  // Add timeout to the request
  const abortController = new AbortController();
  const timeout = setTimeout(() => {
    abortController.abort();
  }, timeoutMillis);

  try {
    // Make the request
    const response = await fetch(
      `${apiUrl.slice(-1) === '/' ? apiUrl.slice(0, -1) : apiUrl}/${
        route.slice(0, 1) === '/' ? route.slice(1) : route
      }`,
      {
        method,
        headers,
        body: method === 'GET' || method === 'DELETE' ? undefined : JSON.stringify(body),
        cache: 'no-cache',
        signal: abortController.signal,
      },
    );

    if (response.status === StatusCodes.NO_CONTENT) {
      return { error: 'no_error', code: response.status, body: null as ResponseType };
    }
    if (!response.headers.get('content-type')?.includes('application/json')) return { error: ResponseError.not_json };
    const rawResponse: RawResponseType<ResponseType> = await response.json();

    return { error: 'no_error', code: response.status, body: formatResponse(rawResponse) };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Request timed out');
      return { error: ResponseError.timeout };
    }
    if (error.message.startsWith('Network Error') || error.code === 'ECONNABORTED') {
      console.error('Cannot connect to server');
    } else {
      console.error('An error occurred when making a request to the API');
    }

    return { error: ResponseError.unknown };
  } finally {
    // If the request hasn't timed out, cancel timeout
    if (!abortController.signal.aborted) clearTimeout(timeout);
  }
}

// Set the authorization header with the given token for next requests
const getAuthorizationToken = () => localStorage.getItem('etuutt-token');

// Access the API through different HTTP methods
export const API = {
  get: <ResponseType = never>(route: string) => requestAPI<never, ResponseType>('GET', route),

  post: <RequestType, ResponseType = never>(route: string, body = {} as RequestType) =>
    requestAPI<RequestType, ResponseType>('POST', route, body),

  put: <RequestType, ResponseType = never>(route: string, body = {} as RequestType) =>
    requestAPI<RequestType, ResponseType>('PUT', route, body),

  patch: <RequestType, ResponseType = never>(route: string, body = {} as RequestType) =>
    requestAPI<RequestType, ResponseType>('PATCH', route, body),

  delete: <ResponseType = never>(route: string) => requestAPI<never, ResponseType>('DELETE', route),
};
