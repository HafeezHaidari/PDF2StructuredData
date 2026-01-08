import { BACKEND_URL } from "@/lib/config";
import type { ApiResponse } from "@/lib/types";

export class ApiError extends Error {
  status: number;
  traceId?: string;

  constructor(message: string, status: number, traceId?: string) {
    super(message);
    this.status = status;
    this.traceId = traceId;
  }
}

async function parseMaybeJson(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return response.json();
  }
  return response.text();
}

function unwrapApiResponse<T>(value: unknown): T {
  if (
    value &&
    typeof value === "object" &&
    "success" in value &&
    typeof (value as ApiResponse<T>).success === "boolean"
  ) {
    const apiValue = value as ApiResponse<T>;
    if (apiValue.success) {
      return apiValue.data as T;
    }

    throw new ApiError(apiValue.error ?? "Request failed", 400, apiValue.traceId);
  }

  return value as T;
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const url = `${BACKEND_URL}${path}`;

  const response = await fetch(url, {
    ...init,
    credentials: "include",
    headers: {
      ...(init?.headers ?? {}),
    },
  });

  const payload = await parseMaybeJson(response);

  if (!response.ok) {
    if (
      payload &&
      typeof payload === "object" &&
      "error" in payload &&
      typeof (payload as { error?: unknown }).error === "string"
    ) {
      throw new ApiError((payload as { error: string }).error, response.status);
    }

    throw new ApiError(
      typeof payload === "string" && payload.length > 0
        ? payload
        : `Request failed (${response.status})`,
      response.status,
    );
  }

  return unwrapApiResponse<T>(payload);
}

export async function apiJson<T>(
  path: string,
  body?: unknown,
  init?: RequestInit,
): Promise<T> {
  return apiFetch<T>(path, {
    method: body === undefined ? "GET" : "POST",
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export async function apiForm<T>(
  path: string,
  formData: FormData,
  init?: RequestInit,
): Promise<T> {
  return apiFetch<T>(path, {
    method: "POST",
    ...init,
    body: formData,
  });
}
