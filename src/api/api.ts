import { apiUrl } from '@/utils/environment';

enum ResponseError {
  'not_json',
  'timeout',
  'unknown',
}

type APIResponse<ResponseType extends object> =
  | {
      code: number;
      body: ResponseType;
    }
  | Record<'error', ResponseError>;

export function handleAPIResponse<T extends object>(
  response: APIResponse<T>,
  handlers: { [status: number]: (body: T) => void } & Partial<{ [status in ResponseError]: () => void }>,
) {
  if (!('error' in response)) {
    if (handlers[response.code]) {
      handlers[response.code](response.body);
    } else {
      console.error(`Unsupported response code : ${response.code}`);
    }
  } else {
    if (handlers[response.error]) {
      handlers[response.error]!();
    } else {
      console.error(`Unsupported error type : ${response.error}`);
    }
  }
}

// Send request to API and handle errors
async function requestAPI<RequestType extends object, ResponseType extends object>(
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

    if (!response.headers.get('content-type')?.includes('application/json')) return { error: ResponseError.not_json };

    const res: ResponseType = await response.json();
    replaceStringByDate(res);
    return { error: 'no_error', code: response.status, body: res as ResponseType };
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
  get: <ResponseType extends object>(route: string) => requestAPI<never, ResponseType>('GET', route),

  post: <RequestType extends object, ResponseType extends object>(route: string, body: RequestType) =>
    requestAPI<RequestType, ResponseType>('POST', route, body),

  put: <RequestType extends object, ResponseType extends object>(route: string, body: RequestType) =>
    requestAPI<RequestType, ResponseType>('PUT', route, body),

  patch: <RequestType extends object, ResponseType extends object>(route: string, body: RequestType) =>
    requestAPI<RequestType, ResponseType>('PATCH', route, body),

  delete: <ResponseType extends object>(route: string) => requestAPI<never, ResponseType>('DELETE', route),
};

function replaceStringByDate(obj: any) {
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object') replaceStringByDate(value);
    if (typeof value === 'string') {
      const timestamp = Date.parse(value);
      if (!isNaN(timestamp)) {
        obj[key] = new Date(timestamp);
      }
    }
  }
}
