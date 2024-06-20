import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'

export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await apiClient.get('/auth/me')
      return res.data
    },
    staleTime: Infinity,
    retry: false,
  })
}
