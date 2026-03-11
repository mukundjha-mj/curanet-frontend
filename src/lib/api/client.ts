import {
  API_BASE_URL,
  API_CREDENTIALS,
  formatApiConnectionError,
} from "@/lib/config"

export class ApiError extends Error {
  status: number
  data: unknown

  constructor(message: string, status: number, data: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.data = data
  }
}

function collectMessages(payload: unknown, sink: Set<string>): void {
  if (payload == null) {
    return
  }

  if (typeof payload === "string") {
    const value = payload.trim()
    if (value) {
      sink.add(value)
    }
    return
  }

  if (Array.isArray(payload)) {
    payload.forEach((item) => collectMessages(item, sink))
    return
  }

  if (typeof payload === "object") {
    const obj = payload as Record<string, unknown>

    if (typeof obj.message === "string") {
      collectMessages(obj.message, sink)
    }
    if (typeof obj.error === "string") {
      collectMessages(obj.error, sink)
    }
    if (obj.errors !== undefined) {
      collectMessages(obj.errors, sink)
    }
    if (typeof obj.debug === "string") {
      collectMessages(obj.debug, sink)
    }
    if (obj.data !== undefined) {
      collectMessages(obj.data, sink)
    }
  }
}

export function getApiErrorMessages(error: unknown, fallback = "Something went wrong"): string[] {
  const messages = new Set<string>()

  if (error instanceof ApiError) {
    collectMessages(error.data, messages)
    collectMessages(error.message, messages)
  } else if (error instanceof Error) {
    collectMessages(error.message, messages)
  } else {
    collectMessages(error, messages)
  }

  if (messages.size === 0) {
    return [fallback]
  }

  return Array.from(messages)
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  token?: string | null
  body?: unknown
  signal?: AbortSignal
}

function makeHeaders(token?: string | null): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? "GET",
      headers: makeHeaders(options.token),
      credentials: API_CREDENTIALS,
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: options.signal,
    })
  } catch (error) {
    throw new ApiError(
      formatApiConnectionError(API_BASE_URL),
      0,
      { originalError: error }
    )
  }

  const contentType = response.headers.get("content-type") ?? ""
  const payload = contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : null

  if (!response.ok) {
    const extractedMessages = getApiErrorMessages(payload, `Request failed with status ${response.status}`)
    const message = extractedMessages[0]

    throw new ApiError(message, response.status, payload)
  }

  return payload as T
}

export { API_BASE_URL }
