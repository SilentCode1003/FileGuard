import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'

export function createCompanyFolder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data) => {
      // console.log(data)
      const res = await apiClient.post('/folders', data)
      return res.data
    },
    onSuccess: async (data) => {
      await queryClient.setQueryData(
        ['folders', data.data.folderPath.replace('root', '/')],
        (oldData) => {
          return [...oldData, data.data]
        },
      )
      // console.log(data.data.folderPath.replace('root', '/'))
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
      await queryClient.setQueryData(
        ['subfolder', data.data.folderPath.replace('root', '')],
        (oldData) => {
          return [...oldData, data.data]
        },
      )
      await queryClient.setQueryData(
        ['browse-folder', data.data.folderPath.replace('root', '')],
        (oldData) => {
          return [...oldData, data.data]
        },
      )
    },
  })
}
