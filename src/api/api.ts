import { apiTimeout, apiUrl, apiVersion, etuuttWebApplicationId } from '@/utils/environment';
import { StatusCodes } from 'http-status-codes';
import { useNotFound } from '@/module/pageSettings';
import { toast } from 'react-toastify';
import { ApiError } from '@/api/api.interface';

export const computeApiURL = (path: string, version = apiVersion) =>
  `${apiUrl.slice(-1) === '/' ? apiUrl.slice(0, -1) : apiUrl}/${version}/${
    path.slice(0, 1) === '/' ? path.slice(1) : path
  }`;

/**
 * The type of error that can be produced while making a request to the API.
 * Note that these errors are not errors that the API can return, but rather errors that can happen while making a request / interpreting the result.
 */
export const enum ResponseFailureReason {
  not_json,
  timeout,
  aborted,
  unknown,
}

/**
 * The raw response of the `internalRequestAPI` method.
 * It either failed with one of the status codes defined in `ResponseError`, or succeeded with a status code and a body (the status code can still be an error).
 */
type APIResponse<ResponseType> =
  | {
      code: StatusCodes;
      body: ResponseType | ApiError;
    }
  | Record<'failureReason', ResponseFailureReason>;

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

type StatusCodesSuccess = (typeof StatusCodes)['OK' | 'CREATED' | 'ACCEPTED' | 'NO_CONTENT' | 'NOT_MODIFIED'];
type StatusCodesError = Exclude<StatusCodes, StatusCodesSuccess>;

function isStatusSuccess(code: StatusCodes): code is StatusCodesSuccess {
  return code < 400;
}

type HandlerNoParam<R> = VoidToUndefinedReturn<() => R>;
type HandlerBody<T, R> = VoidToUndefinedReturn<(body: T) => R>;
type HandlerError<R> = VoidToUndefinedReturn<(error?: string) => R>;
type HandlerCodeAndError<R> = VoidToUndefinedReturn<(errorCode?: number, error?: string) => R>;
type HandlerFailureReason<R> = VoidToUndefinedReturn<(failureReason?: ResponseFailureReason) => R>;

type ResponseHandlerExtendsType<T> = Partial<Record<'success' | StatusCodesSuccess, HandlerBody<T, any>>> &
  Partial<Record<'error', HandlerCodeAndError<any>>> &
  Partial<Record<StatusCodesError, HandlerError<any>>> &
  Partial<Record<'failure', HandlerFailureReason<any>>> &
  Partial<Record<ResponseFailureReason, HandlerNoParam<any>>> &
  Record<'fallback', HandlerNoParam<any>>;

type VoidToUndefinedReturn<T extends (...args: any) => any> =
  ReturnType<T> extends void ? (...args: Parameters<T>) => undefined : T;

export interface Abortable {
  abort(): void;
}

/**
 * The response handler is a class that allows you to handle the response of a request to the API.
 * It allows you to define what to do when the request is successful, when it returns an error (an API error), when it fails (a request error), or when it returns a specific status code or specific failure.
 *
 * @example
 * export const login = (login: string, password: string): AppThunk =>
 *   async (dispatch: AppDispatch) => {
 *     API.post<LoginRequestDto, LoginResponseDto>('/auth/signin', { login, password })
 *       .on(StatusCodes.OK, (body) => {
 *         dispatch(setToken(body.access_token));
 *         dispatch(fetchUser());
 *       })
 *       .on(StatusCodes.UNAUTHORIZED, (body) => console.error('Wrong credentials', body))
 *       .on(StatusCodes.BAD_REQUEST, (body) => console.error('Bad request', body))
 *       .on('error', () => console.error('An error occured'));
 *   };
 *
 * @example
 * export default async function sendComment(ueCode: string, body: string, isAnonymous: boolean) {
 *   return API.post<SendCommentRequestDto, Comment>(`/ue/${ueCode}/comments`, { body, isAnonymous })
 *     .on(StatusCodes.OK, (data) => data)
 *     .toPromise();
 * }
 */
export class ResponseHandler<T, R extends ResponseHandlerExtendsType<T> = { fallback: HandlerNoParam<undefined> }>
  implements Abortable
{
  private readonly handlers = { fallback: () => undefined } as R;
  private readonly promise: Promise<ReturnType<R[keyof R] extends (...args: any) => any ? R[keyof R] : never>>;

  constructor(
    rawResponse: Promise<APIResponse<T>>,
    private readonly abortController: AbortController,
  ) {
    this.promise = rawResponse.then((response) => {
      if ('failureReason' in response) {
        if (this.handlers[response.failureReason]) {
          return this.handlers[response.failureReason]!();
        } else if (this.handlers.failure) {
          return this.handlers.failure(response.failureReason);
        } else {
          return this.handlers.fallback();
        }
      } else if (isStatusSuccess(response.code)) {
        if (response.code in this.handlers) {
          return this.handlers[response.code]!(response.body as T);
        } else if (this.handlers.success) {
          return this.handlers.success(response.body as T);
        } else {
          return this.handlers.fallback();
        }
      } else {
        if (response.code in this.handlers) {
          return this.handlers[response.code]!((response.body as ApiError).error);
        } else if (this.handlers.error) {
          return this.handlers.error(response.code as StatusCodesError, (response.body as ApiError).error);
        } else {
          return this.handlers.fallback();
        }
      }
    });
  }

  /**
   * @param statusCode number: Status code returned by the API
   *                   success: Request returned a 200, 201, ...
   *                   error: The API returned an error
   *                   failure: An error occurred when making the request
   * @param handler Callback
   */
  on<S extends keyof ResponseHandlerExtendsType<T>, H extends Exclude<ResponseHandlerExtendsType<T>[S], undefined>>(
    statusCode: S,
    handler: H,
  ): ResponseHandler<
    T,
    {
      [K in S | keyof R]: K extends S
        ? VoidToUndefinedReturn<H> extends ResponseHandlerExtendsType<T>[K] // Typescript does not understand that VoidToUndefinedReturn<H> must match ResponseHandlerExtendsType<T>[K]
          ? VoidToUndefinedReturn<H>
          : never
        : R[K];
    }
  > {
    // @ts-expect-error TS2322 `handler` does not match generic `R` of `this`
    this.handlers[statusCode] = handler;
    return this as ResponseHandler<
      T,
      {
        [K in S | keyof R]: K extends S
          ? VoidToUndefinedReturn<H> extends ResponseHandlerExtendsType<T>[K]
            ? VoidToUndefinedReturn<H>
            : never
          : R[K];
      }
    >;
  }

  /**
   * Aborts the request that produces this reponse.
   * Fires ResponseError.timeout handler or falls back to failure handler.
   */
  abort() {
    this.abortController.abort(ResponseFailureReason.aborted);
  }

  async toPromise(): Promise<Awaited<ReturnType<R[keyof R] extends (...args: any) => any ? R[keyof R] : never>>> {
    return await this.promise;
  }
}

/**
 * Format the JSON response to replace strings that are dates by actual Date objects.
 * @param rawResponse The raw response from the API.
 */
function formatResponse<T>(rawResponse: RawResponseType<T>): T {
  if (typeof rawResponse === 'string' && rawResponse.search(/^\d{4}(?:-\d{2}){2}T(?:\d{2}:){2}\d{2}\.\d{3}Z$/) === 0) {
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
 * @param isFile If what we are sending/fetching is a file.
 * @param applicationId Id of the application making the request.
 * @param forceCache If true, the result of the request is cached. Otherwise, it won't.
 * @param abortController AbortController to add to the request.
 */
async function internalRequestAPI<RequestType>(
  method: 'GET',
  route: string,
  body: RequestType | null,
  timeoutMillis: number,
  version: string,
  isFile: true,
  applicationId: string,
  forceCache: boolean,
  abortController: AbortController,
): Promise<APIResponse<Blob>>;
async function internalRequestAPI<RequestType, ResponseType>(
  method: string,
  route: string,
  body: RequestType | null,
  timeoutMillis: number,
  version: string,
  isFile: boolean,
  applicationId: string,
  forceCache: boolean,
  abortController: AbortController,
): Promise<APIResponse<ResponseType>>;
async function internalRequestAPI<RequestType, ResponseType>(
  method: string,
  route: string,
  body: RequestType | null,
  timeoutMillis: number,
  version: string,
  isFile: boolean,
  applicationId: string,
  forceCache: boolean,
  abortController: AbortController,
): Promise<APIResponse<ResponseType | Blob>> {
  // Generate headers
  const headers = new Headers();
  headers.append('Authorization', authorizationToken ? `Bearer ${authorizationToken}` : '');
  headers.append('X-Application', applicationId);
  if (!isFile) headers.append('Content-Type', 'application/json');

  // Add timeout to the request
  const timeout = setTimeout(() => {
    abortController.abort();
  }, timeoutMillis);

  // if (route.includes('/media/image//media/image')) {
  console.log(route)
    console.log(new Error().stack);
  // }

  try {
    // Make the request
    const response = await fetch(computeApiURL(route, version), {
      method,
      headers,
      body: (method === 'GET' || method === 'DELETE' ? undefined : isFile ? body : JSON.stringify(body)) as
        | BodyInit
        | null
        | undefined,
      cache: forceCache ? 'force-cache' : 'no-cache',
      signal: abortController.signal,
    });

    if (response.status === StatusCodes.NO_CONTENT) {
      return { code: response.status, body: null as ResponseType };
    }
    if (isFile && method === 'GET') return { code: response.status, body: await response.blob() };
    if (!response.headers.get('content-type')?.includes('application/json'))
      return { failureReason: ResponseFailureReason.not_json };

    try {
      const res: RawResponseType<ResponseType> = await response.json();
      return { code: response.status, body: formatResponse(res) as ResponseType };
    } catch (error) {
      // BROOO, who makes APIs that return headers with Content-Type: application/json without a json body :(
      // (Ok, in theory none, but it's better to be safe than sorry)
      return { failureReason: ResponseFailureReason.not_json };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error === 'query-update') return { failureReason: ResponseFailureReason.aborted };
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Request timed out');
      return { failureReason: ResponseFailureReason.timeout };
    }
    if (error.message?.startsWith('Network Error') || error.code === 'ECONNABORTED') {
      console.error('Cannot connect to server');
    } else {
      console.error('An error occurred when making a request to the API');
    }

    if (abortController.signal.reason === ResponseFailureReason.aborted)
      return { failureReason: ResponseFailureReason.aborted };

    return { failureReason: ResponseFailureReason.unknown };
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
 * @param params * timeoutMillis: The timeout of the request, in milliseconds. Defaults to 10000 milliseconds (10 seconds).
 *               * version: The version of the API to use : v1, v2, ... Defaults to the environment variable `NEXT_PUBLIC_API_VERSION`.
 *               * isFile Set it to true if you are sending a file.
 *               * applicationId Set its value if you are not using the default application to make the request.
 */
function requestAPI<RequestType>(
  method: 'GET',
  route: string,
  body: RequestType | null,
  params: { timeoutMillis?: number; version?: string; isFile: true; applicationId?: string; forceCache?: boolean },
): ResponseHandler<Blob>;
function requestAPI<RequestType, ResponseType>(
  method: string,
  route: string,
  body: RequestType | null,
  params: { timeoutMillis?: number; version?: string; isFile?: boolean; applicationId?: string; forceCache?: boolean },
): ResponseHandler<ResponseType>;
function requestAPI<RequestType, ResponseType>(
  method: string,
  route: string,
  body: RequestType | null = null,
  {
    timeoutMillis = apiTimeout,
    version = apiVersion,
    isFile = false,
    applicationId = etuuttWebApplicationId,
    forceCache = false,
  }: { timeoutMillis?: number; version?: string; isFile?: boolean; applicationId?: string; forceCache?: boolean } = {},
): ResponseHandler<ResponseType> {
  const abortController = new AbortController();
  console.log(route)
  return new ResponseHandler(
    internalRequestAPI(method, route, body, timeoutMillis, version, isFile, applicationId, forceCache, abortController),
    abortController,
  );
}

// Set the authorization header with the given token for next requests
let authorizationToken: string = '';
export const setAuthorizationToken = (token: string) => {
  authorizationToken = token;
};

/**
 * A hook that returns a set of functions to make requests to the API.
 * This hook uses the page settings stored in Redux to set the default handlers.
 */
// TODO : wellll, implement that page settings thingy once it's merged.
export function useAPI(): API {
  const setNotFound = useNotFound();
  return {
    getFile: (route: string, options: { timeoutMillis?: number; version?: string; applicationId?: string } = {}) =>
      applyDefaultHandler(requestAPI<never, Blob>('GET', route, null, { ...options, isFile: true }), setNotFound),
    get: <ResponseType = never>(
      route: string,
      options: { timeoutMillis?: number; version?: string; forceCache?: boolean; applicationId?: string } = {},
    ) =>
      applyDefaultHandler(
        requestAPI<never, ResponseType>('GET', route, null, { ...options, isFile: false }),
        setNotFound,
      ),
    post: <RequestType, ResponseType = never>(
      route: string,
      body = {} as RequestType,
      options: { version?: string; isFile?: boolean; applicationId?: string } = {},
    ) => applyDefaultHandler(requestAPI<RequestType, ResponseType>('POST', route, body, options), setNotFound),
    put: <RequestType, ResponseType = never>(
      route: string,
      body = {} as RequestType,
      options: { version?: string; isFile?: boolean; applicationId?: string } = {},
    ) => applyDefaultHandler(requestAPI<RequestType, ResponseType>('PUT', route, body, options), setNotFound),
    patch: <RequestType, ResponseType = never>(
      route: string,
      body = {} as RequestType,
      options: { version?: string; isFile?: boolean } = {},
    ) => applyDefaultHandler(requestAPI<RequestType, ResponseType>('PATCH', route, body, options), setNotFound),
    delete: <ResponseType = never>(route: string, options: { version?: string } = {}) =>
      applyDefaultHandler(requestAPI<never, ResponseType>('DELETE', route, null, options), setNotFound),
  };
}

export interface API {
  getFile(
    route: string,
    options?: { timeoutMillis?: number; version?: string; applicationId?: string; forceCache?: boolean },
  ): DefaultResponseHandlerType<Blob>;
  get<ResponseType = never>(
    route: string,
    options?: { timeoutMillis?: number; version?: string; applicationId?: string; forceCache?: boolean },
  ): DefaultResponseHandlerType<ResponseType>;
  post<RequestType, ResponseType = never>(
    route: string,
    body?: RequestType,
    options?: { version?: string; isFile?: boolean; applicationId?: string },
  ): DefaultResponseHandlerType<ResponseType>;
  put<RequestType, ResponseType = never>(
    route: string,
    body?: RequestType,
    options?: { version?: string; isFile?: boolean },
  ): DefaultResponseHandlerType<ResponseType>;
  patch: <RequestType, ResponseType = never>(
    route: string,
    body?: RequestType,
    options?: { version?: string; isFile?: boolean },
  ) => DefaultResponseHandlerType<ResponseType>;
  delete<ResponseType = never>(route: string, options?: { version?: string }): DefaultResponseHandlerType<ResponseType>;
}

/**
 * Apply the default handler to a response handler.
 * @param handler The response handler we need to apply the default handler to.
 * @param setNotFound A function that can be called to set the current route as "not found".
 */
function applyDefaultHandler<T>(handler: ResponseHandler<T>, setNotFound: () => void): DefaultResponseHandlerType<T> {
  return handler
    .on('success', (body) => body)
    .on('failure', () => {
      toast.error('Could not connect to the API');
    })
    .on('error', () => {
      toast.error('Request resulted in an error');
    })
    .on(404, () => setNotFound());
}

type DefaultResponseHandlerType<T> = ResponseHandler<
  T,
  {
    fallback: HandlerNoParam<undefined>;
    success: HandlerBody<T, T>;
    failure: HandlerFailureReason<undefined>;
    error: HandlerCodeAndError<undefined>;
    404: HandlerError<undefined>;
  }
>;
