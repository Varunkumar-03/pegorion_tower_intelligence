// ponytail: native fetch replaces axios dependency, avoiding unnecessary package
import { API_BASE_URL, ERROR_MESSAGES } from '../config'

async function request(path: string, options: RequestInit = {}): Promise<{ data: any }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers })
    if (res.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token')
      window.location.href = '/login'
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED)
    }
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`)
    }
    const data = await res.json()
    return { data }
  } catch (error: any) {
    if (!navigator.onLine) {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR)
    }
    throw error
  }
}

const apiClient = {
  get: (url: string) => request(url),
  post: (url: string, body?: any) =>
    request(url, { method: 'POST', body: JSON.stringify(body) }),
  put: (url: string, body?: any) =>
    request(url, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (url: string) => request(url, { method: 'DELETE' }),
}

export default apiClient
