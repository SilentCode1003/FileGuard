import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'

export function createCompanyFolder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data) => {
      const res = await apiClient.post('/folders', data)
      return res.data
    },
    onSuccess: async (data) => {
      await queryClient.setQueryData(['folders', data.data.folderPath], (oldData) => {
        return [...oldData, data.data]
      })
    },
  })
}

export function createDepthFolder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data) => {
      const res = await apiClient.post('/folders', data)
      return res.data
    },
    onSuccess: async (data) => {
      await queryClient.setQueryData(['folders', data.data.folderPath], (oldData) => {
        return [...oldData, data.data]
      })
      // await queryClient.invalidateQueries({
      //   queryKey: ['browse-folder'],
      // })
      // await queryClient.setQueryData(['browse-folder', data.data.folderPath], (oldData) => {
      //   return [...oldData, data.data]
      // })
    },
  })
}
