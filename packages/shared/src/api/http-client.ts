/** Default timeout for all outbound HTTP requests (ms). Override per-call via `signal`. */
export const DEFAULT_TIMEOUT_MS = 8_000;

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  /** Pass an explicit signal to override the default timeout. */
  signal?: AbortSignal;
  /** Override the timeout in ms. Pass `0` to disable. Defaults to DEFAULT_TIMEOUT_MS. */
  timeoutMs?: number;
}

/** Create an AbortSignal that fires after `ms` milliseconds. */
export function timeoutSignal(ms: number): AbortSignal {
  return AbortSignal.timeout(ms);
}

export async function httpGet<T>(
  url: string,
  options: Omit<RequestOptions, 'method' | 'body'> = {}
): Promise<T> {
  const { signal, timeoutMs = DEFAULT_TIMEOUT_MS, headers } = options;
  const effectiveSignal = signal ?? (timeoutMs > 0 ? timeoutSignal(timeoutMs) : undefined);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ...headers,
    },
    signal: effectiveSignal,
  });

  if (!response.ok) {
    throw new ApiError(
      response.status,
      response.statusText,
      `HTTP ${response.status}: ${response.statusText} — ${url}`
    );
  }

  return response.json() as Promise<T>;
}

export async function httpPost<T>(
  url: string,
  body: unknown,
  options: Omit<RequestOptions, 'method' | 'body'> = {}
): Promise<T> {
  const { signal, timeoutMs = DEFAULT_TIMEOUT_MS, headers } = options;
  const effectiveSignal = signal ?? (timeoutMs > 0 ? timeoutSignal(timeoutMs) : undefined);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...headers,
    },
    body: JSON.stringify(body),
    signal: effectiveSignal,
  });

  if (!response.ok) {
    throw new ApiError(
      response.status,
      response.statusText,
      `HTTP ${response.status}: ${response.statusText} — ${url}`
    );
  }

  return response.json() as Promise<T>;
}

export function formatApiError(error: unknown): string {
  if (error instanceof ApiError) {
    return `Ошибка ${error.status}: ${error.statusText}`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Неизвестная ошибка';
}
