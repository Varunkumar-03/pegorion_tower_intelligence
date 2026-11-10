import { useQuery, useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query'

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

interface Tower {
  id: string
  property_id: string
  site_id_code: string
  site_name: string | null
  latitude: number | null
  longitude: number | null
  status: string
  created_at: string
}

interface Document {
  id: string
  filename: string
  file_size: number | null
  mime_type: string | null
  storage_path: string
  uploaded_by: string | null
  uploaded_at: string
  status: string
  document_type: string | null
}

export function useTowers() {
  return useQuery<Tower[], Error>({
    queryKey: ['towers'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/towers`)
      if (!response.ok) {
        throw new Error('Failed to fetch towers')
      }
      return response.json()
    },
  })
}

export function useTower(towerId: string | undefined) {
  return useQuery<Tower, Error>({
    queryKey: ['tower', towerId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/towers/${towerId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch tower')
      }
      return response.json()
    },
    enabled: !!towerId,
  })
}

export function useDocuments() {
  return useQuery<Document[], Error>({
    queryKey: ['documents'],
    queryFn: async () => {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/documents`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch documents')
      }
      return response.json()
    },
  })
}

type UploadDocumentResponse = { id: string; filename: string; status: string }
type ProcessDocumentResponse = { status: string; document_id: string; extracted_pages: number; total_characters: number }

export function useUploadDocument() {
  const queryClient = useQueryClient()

  const mutationFn = async (formData: FormData): Promise<UploadDocumentResponse> => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/documents/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
    if (!response.ok) {
      throw new Error('Failed to upload document')
    }
    return response.json()
  }

  return useMutation<UploadDocumentResponse, Error, FormData>({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })
}

export function useProcessDocument() {
  const queryClient = useQueryClient()

  const mutationFn = async (documentId: string): Promise<ProcessDocumentResponse> => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/documents/process/${documentId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      throw new Error('Failed to process document')
    }
    return response.json()
  }

  return useMutation<ProcessDocumentResponse, Error, string>({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })
}

export async function login(email: string, password: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: email, password }),
  })
  if (!response.ok) {
    throw new Error('Login failed')
  }
  const data = await response.json()
  localStorage.setItem('token', data.access_token)
  return data.access_token
}

export async function register(userData: { email: string, full_name: string, password: string }): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })
  if (!response.ok) {
    throw new Error('Registration failed')
  }
}

export function logout() {
  localStorage.removeItem('token')
}
