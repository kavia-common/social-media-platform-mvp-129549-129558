import { useAuthStore } from '@/stores/auth'

// IMPORTANT: Configure VITE_API_BASE_URL in .env to point to the FastAPI backend base URL.
// If empty, requests will be made relative to the frontend origin, which will fail in split deployments.
const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) || ''

// Use a concrete Record<string, string> for headers to allow dynamic keys like Authorization
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const auth = useAuthStore()
  const baseHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  // Merge any provided headers into our record safely
  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((v, k) => {
        baseHeaders[k] = v
      })
    } else if (Array.isArray(options.headers)) {
      for (const [k, v] of options.headers) baseHeaders[k] = String(v)
    } else {
      for (const [k, v] of Object.entries(options.headers)) baseHeaders[k] = String(v)
    }
  }
  if (auth.token) {
    baseHeaders.Authorization = `Bearer ${auth.token}`
  }

  const url = API_BASE ? `${API_BASE}${path}` : path
  const res = await fetch(url, { ...options, headers: baseHeaders })

  if (!res.ok) {
    // Attempt to parse error body (JSON with {detail} or plain text)
    let msg = `Request failed: ${res.status}`
    try {
      const ct = res.headers.get('content-type') || ''
      if (ct.includes('application/json')) {
        const data: unknown = await res.json()
        if (data && typeof data === 'object' && 'detail' in data) {
          msg = String((data as { detail?: unknown }).detail ?? msg)
        }
      } else {
        const t = await res.text()
        if (t) msg = t
      }
    } catch {
      /* ignore body parse error */
    }
    throw new Error(msg)
  }

  // Some endpoints may return empty body
  const text = await res.text()
  if (!text) return {} as T
  try {
    return JSON.parse(text) as T
  } catch {
    // Non-JSON response; return empty as T to satisfy signature
    return {} as T
  }
}

export interface TokenResponse {
  access_token: string
  token_type?: string
}
export interface UserPublic {
  username: string
  is_admin?: boolean
}
export interface PostPublic {
  id: number
  author: string
  content: string
  image_url?: string | null
  created_at: string
  likes: number
  shares: number
  liked_by_me: boolean
  shared_by_me: boolean
}
export interface PostCreateRequest {
  content: string
  image_url?: string | null
}

// PUBLIC_INTERFACE
export async function apiRegister(username: string, password: string): Promise<UserPublic> {
  /** Register a new user */
  return request<UserPublic>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

// PUBLIC_INTERFACE
export async function apiLogin(username: string, password: string): Promise<TokenResponse> {
  /** Login and receive a token */
  return request<TokenResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

// PUBLIC_INTERFACE
export async function apiMe(): Promise<UserPublic> {
  /** Retrieve current user profile */
  return request<UserPublic>('/api/users/me', { method: 'GET' })
}

// PUBLIC_INTERFACE
export async function apiGetFeed(): Promise<PostPublic[]> {
  /** Get feed posts */
  return request<PostPublic[]>('/api/posts', { method: 'GET' })
}

// PUBLIC_INTERFACE
export async function apiCreatePost(payload: PostCreateRequest): Promise<PostPublic> {
  /** Create a new post for current user */
  return request<PostPublic>('/api/posts', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// PUBLIC_INTERFACE
export async function apiToggleLike(postId: number): Promise<PostPublic> {
  /** Toggle like for a post */
  return request<PostPublic>(`/api/posts/${postId}/like`, { method: 'POST' })
}

// PUBLIC_INTERFACE
export async function apiToggleShare(postId: number): Promise<PostPublic> {
  /** Toggle share for a post */
  return request<PostPublic>(`/api/posts/${postId}/share`, { method: 'POST' })
}
