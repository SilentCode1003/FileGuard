import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'

export function useGetPath(key, folderPath) {
  return useQuery({
    queryKey: [key, folderPath],
    queryFn: async () => {
      const queryParams = new URLSearchParams({ folderPath })
      const res = await apiClient.get('/folders?' + queryParams)
      // console.log(res)
      return res.data.data
    },
  })
}

export function useGetFilePath(key, filePath) {
  return useQuery({
    queryKey: [key, filePath],
    queryFn: async () => {
      const queryParams = new URLSearchParams({ filePath })
      const res = await apiClient.get('/files?' + queryParams)
      // console.log(res.data)
      return res.data.data
    },
  })
}
