import { apiTimeout, apiUrl, apiVersion } from '@/utils/environment';
import { StatusCodes } from 'http-status-codes';

/**
 * The type of error that can be produced while making a request to the API.
 * Note that these errors are not errors that the API can return, but rather errors that can happen while making a request / interpreting the result.
 */
export enum ResponseError {
  'not_json',
  'timeout',
  'unknown',
}

/**
 * The raw response of the `internalRequestAPI` method.
 * It either failed with one of the status codes defined in `ResponseError`, or succeeded with a status code and a body (the status code can still be an error).
 */
type APIResponse<ResponseType> =
  | {
      code: number;
      body: ResponseType;
    }
  | Record<'error', ResponseError>;

/**
 * Dates do not exist in JSON, so the API does not return type Date, but instead string.
 * This type represents what the response should look like, except for Date being replaced by strings.
 */
type RawResponseType<T> = T extends Date
  ? string
  : T extends object
    ? {
        [K in keyof T]: T[K] extends object ? RawResponseType<T[K]> : T[K] extends Date ? string : T[K];
      }
    : T;

/**
 * The response handler is a class that allows you to handle the response of a request to the API.
 * It allows you to define what to do when the request is successful, when it returns an error (an API error), when it fails (a request error), or when it returns a specific status code or specific failure.
 *
 * @example
 * export const login = (login: string, password: string) =>
 *   (async (dispatch: AppDispatch) => {
 *     API.post<LoginRequestDto, LoginResponseDto>('/auth/signin', { login, password })
 *       .on(StatusCodes.OK, (body) => {
 *         dispatch(setToken(body.access_token));
 *         dispatch(fetchUser());
 *       })
 *       .on(StatusCodes.UNAUTHORIZED, (body) => console.error('Wrong credentials', body))
 *       .on(StatusCodes.BAD_REQUEST, (body) => console.error('Bad request', body))
 *       .on('error', () => console.error('An error occured'));
 *   }) as unknown as Action;
 *
 * @example
 * export default async function sendComment(ueCode: string, body: string, isAnonymous: boolean) {
 *   return API.post<SendCommentRequestDto, Comment>(`/ue/${ueCode}/comments`, { body, isAnonymous })
 *     .on(StatusCodes.OK, (data) => data)
 *     .toPromise();
 * }
 */
export class ResponseHandler<T, R = undefined> {
  private readonly handlers: { [status: number]: (body: T) => R | void } & Partial<{
    [status in ResponseError | 'success' | 'error' | 'failure']: status extends 'success'
      ? (body: T) => R | void
      : () => R | void;
  }> = {};
  private readonly promise: Promise<R | void>;

  constructor(rawResponse: Promise<APIResponse<T>>) {
    this.promise = rawResponse.then((response) => {
      if ('error' in response) {
        return this.handlers[response.error]
          ? this.handlers[response.error]!()
          : this.handlers.failure
            ? this.handlers.failure()
            : undefined;
      }
      if (response.code in this.handlers) {
        return this.handlers[response.code](response.body);
      }
      if (response.code < 400) {
        return 'success' in this.handlers ? this.handlers.success!(response.body) : undefined;
      }
      return 'error' in this.handlers ? this.handlers.error!() : undefined;
    });
  }

  on<E, P extends number | ResponseError | 'success' | 'error' | 'failure'>(
    statusCode: P,
    handler: P extends number | 'success' ? (body: T) => E | void : () => E | void,
  ): ResponseHandler<T, R | E> {
    this.handlers[statusCode] = handler as (body?: T) => R | void;
    return this;
  }

  async toPromise(): Promise<null | R> {
    return (await this.promise) ?? null;
  }
}

/**
 * Format the JSON response to replace strings that are dates by actual Date objects.
 * @param rawResponse The raw response from the API.
 */
function formatResponse<T>(rawResponse: RawResponseType<T>): T {
  if (typeof rawResponse === 'string' && !isNaN(Date.parse(rawResponse))) {
    return new Date(rawResponse) as T;
  } else if (Array.isArray(rawResponse)) {
    return rawResponse.map(formatResponse) as T;
  } else if (typeof rawResponse === 'object' && rawResponse !== null) {
    return Object.fromEntries(
      Object.entries(rawResponse).map(([key, value]) => [key, formatResponse(value as RawResponseType<typeof value>)]),
    ) as T;
  } else {
    return rawResponse as T;
  }
}

/**
 * Make a request to the API. This function is not meant to be used directly, but rather through the `requestAPI` function.
 * @param method The HTTP method to use.
 * @param route The route to call.
 * @param body The body of the request.
 * @param timeoutMillis The timeout of the request.
 * @param version The version of the API to use : v1, v2, ...
 */
async function internalRequestAPI<RequestType, ResponseType>(
  method: string,
  route: string,
  body: RequestType | null,
  timeoutMillis: number,
  version: string,
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
      `${apiUrl.slice(-1) === '/' ? apiUrl.slice(0, -1) : apiUrl}/${version}/${
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
      return { code: response.status, body: null as ResponseType };
    }
    if (!response.headers.get('content-type')?.includes('application/json')) return { error: ResponseError.not_json };

    try {
      const res: RawResponseType<ResponseType> = await response.json();
      return { code: response.status, body: formatResponse(res) as ResponseType };
    } catch (error) {
      // BROOO, who makes APIs that return headers with Content-Type: application/json without a json body :(
      // (Ok, in theory none, but it's better to be safe than sorry)
      return { error: ResponseError.not_json };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Request timed out');
      return { error: ResponseError.timeout };
    }
    if (error.message?.startsWith('Network Error') || error.code === 'ECONNABORTED') {
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

/**
 * Make a request to the API. Returns a response handler that allows you to handle the response of the request.
 * @param method The HTTP method to use.
 * @param route The route to call.
 * @param body The body of the request. Defaults to `null`.
 * @param timeoutMillis The timeout of the request, in milliseconds. Defaults to 10000 milliseconds (10 seconds).
 * @param version The version of the API to use : v1, v2, ... Defaults to the environment variable `NEXT_PUBLIC_API_VERSION`.
 */
function requestAPI<RequestType, ResponseType>(
  method: string,
  route: string,
  body: RequestType | null = null,
  { timeoutMillis = apiTimeout, version = apiVersion }: { timeoutMillis?: number; version?: string } = {},
): ResponseHandler<ResponseType> {
  return new ResponseHandler(internalRequestAPI(method, route, body, timeoutMillis, version));
}

// Set the authorization header with the given token for next requests
const getAuthorizationToken = () => localStorage.getItem('etuutt-token');

/**
 * A hook that returns a set of functions to make requests to the API.
 * This hook uses the page settings stored in Redux to set the default handlers.
 */
// TODO : wellll, implement that page settings thingy once it's merged.
export function useAPI() {
  return {
    get: <ResponseType = never>(route: string, options: { version?: string } = {}) =>
      applyDefaultHandler(requestAPI<never, ResponseType>('GET', route, null, options)),
    post: <RequestType, ResponseType = never>(
      route: string,
      body = {} as RequestType,
      options: { version?: string } = {},
    ) => applyDefaultHandler(requestAPI<RequestType, ResponseType>('POST', route, body, options)),
    put: <RequestType, ResponseType = never>(
      route: string,
      body = {} as RequestType,
      options: { version?: string } = {},
    ) => applyDefaultHandler(requestAPI<RequestType, ResponseType>('PUT', route, body, options)),
    patch: <RequestType, ResponseType = never>(
      route: string,
      body = {} as RequestType,
      options: { version?: string } = {},
    ) => applyDefaultHandler(requestAPI<RequestType, ResponseType>('PATCH', route, body, options)),
    delete: <ResponseType = never>(route: string, options: { version?: string } = {}) =>
      applyDefaultHandler(requestAPI<never, ResponseType>('DELETE', route, null, options)),
  };
}

export type API = ReturnType<typeof useAPI>;

/**
 * Apply the default handler to a response handler.
 * @param handler The response handler we need to apply the default handler to.
 */
function applyDefaultHandler<T>(handler: ResponseHandler<T>) {
  return handler
    .on('success', (body) => body)
    .on('failure', () => console.log('Failed to make request'))
    .on('error', () => console.log('Error !'));
}
