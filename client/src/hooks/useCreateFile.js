import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'

export function createFile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data) => {
      const res = await apiClient.post('/files', data)
      return res.data
    },
    onSuccess: async (data) => {
      await queryClient.setQueryData(['browse-files', data.data[0].filePath], (oldData) => {
        return [...oldData, data.data[0]]
      })
    },
  })
}
