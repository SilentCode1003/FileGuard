import { useMutation } from '@tanstack/react-query'
import { apiClient } from '../../lib/api-client'

export function useLogin() {
  return useMutation({
    mutationFn: async (credentials) => {
      const res = await apiClient.post('/auth/login', credentials)
      return res.data
    },
  })
}
