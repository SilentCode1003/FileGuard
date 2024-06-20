import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../../lib/api-client'

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      return await apiClient.delete('/auth/logout')
    },
    onSuccess: () => {
      queryClient.removeQueries('user')
    },
  })
}
