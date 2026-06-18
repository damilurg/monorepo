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
  signal?: AbortSignal;
}

export async function httpGet<T>(
  url: string,
  options: Omit<RequestOptions, 'method' | 'body'> = {}
): Promise<T> {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ...options.headers,
    },
    signal: options.signal,
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
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(body),
    signal: options.signal,
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
