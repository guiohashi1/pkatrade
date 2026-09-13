export type ApiError = {
  message: string;
  status?: number;
};

export type ApiResult<T> = {
  data: T;
  error: ApiError | null;
  /** De onde veio o payload (útil pra UI). */
  source: "api" | "mock" | "cache";
};

export function okResult<T>(
  data: T,
  source: ApiResult<T>["source"] = "api",
): ApiResult<T> {
  return { data, error: null, source };
}

export function errResult<T>(
  fallback: T,
  message: string,
  status?: number,
  source: ApiResult<T>["source"] = "api",
): ApiResult<T> {
  return { data: fallback, error: { message, status }, source };
}
