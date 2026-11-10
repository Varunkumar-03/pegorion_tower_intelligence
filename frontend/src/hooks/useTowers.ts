/** Tower data hooks using TanStack Query */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../api/client'
import { Tower } from '../../types'

// Keys for caching
export const TOWER_KEYS = {
  all: ['towers'] as const,
  lists: () => [...TOWER_KEYS.all, 'lists'] as const,
  detail: (id: string) => [...TOWER_KEYS.all, id] as const,
}

// Fetch all towers
export function useTowers() {
  return useQuery({
    queryKey: TOWER_KEYS.lists(),
    queryFn: async (): Promise<Tower[]> => {
      const response = await apiClient.get('/towers')
      return response.data
    },
  })
}

// Fetch single tower
export function useTower(id: string) {
  return useQuery({
    queryKey: TOWER_KEYS.detail(id),
    queryFn: async (): Promise<Tower> => {
      const response = await apiClient.get(`/towers/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

// Create tower mutation
export function useCreateTower() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (towerData: Partial<Tower>) => {
      const response = await apiClient.post('/towers', towerData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TOWER_KEYS.lists() })
    },
  })
}

// Update tower mutation
export function useUpdateTower() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...towerData }: Partial<Tower> & { id: string }) => {
      const response = await apiClient.put(`/towers/${id}`, towerData)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TOWER_KEYS.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: TOWER_KEYS.lists() })
    },
  })
}

// Delete tower mutation
export function useDeleteTower() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/towers/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TOWER_KEYS.lists() })
    },
  })
}