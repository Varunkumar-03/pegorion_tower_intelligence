/** Lease data hooks using TanStack Query */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../api/client'
import { Lease } from '../../types'

// Keys for caching
export const LEASE_KEYS = {
  all: ['leases'] as const,
  lists: () => [...LEASE_KEYS.all, 'lists'] as const,
  detail: (id: string) => [...LEASE_KEYS.all, id] as const,
  expiring: () => [...LEASE_KEYS.all, 'expiring'] as const,
}

// Fetch all leases
export function useLeases() {
  return useQuery({
    queryKey: LEASE_KEYS.lists(),
    queryFn: async (): Promise<Lease[]> => {
      const response = await apiClient.get('/leases')
      return response.data
    },
  })
}

// Fetch single lease
export function useLease(id: string) {
  return useQuery({
    queryKey: LEASE_KEYS.detail(id),
    queryFn: async (): Promise<Lease> => {
      const response = await apiClient.get(`/leases/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

// Fetch expiring leases
export function useExpiringLeases() {
  return useQuery({
    queryKey: LEASE_KEYS.expiring(),
    queryFn: async (): Promise<Lease[]> => {
      const response = await apiClient.get('/leases/search/expiring')
      return response.data
    },
  })
}

// Create lease mutation
export function useCreateLease() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (leaseData: Partial<Lease>) => {
      const response = await apiClient.post('/leases', leaseData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEASE_KEYS.lists() })
    },
  })
}

// Update lease mutation
export function useUpdateLease() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...leaseData }: Partial<Lease> & { id: string }) => {
      const response = await apiClient.put(`/leases/${id}`, leaseData)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: LEASE_KEYS.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: LEASE_KEYS.lists() })
    },
  })
}

// Delete lease mutation
export function useDeleteLease() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/leases/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEASE_KEYS.lists() })
    },
  })
}