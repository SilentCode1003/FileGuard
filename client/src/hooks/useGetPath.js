import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'

export function useGetPath(key, folderPath) {
  return useQuery({
    queryKey: [key, folderPath],
    queryFn: async () => {
      const queryParams = new URLSearchParams({ folderPath })
      const res = await apiClient.get('/folders?' + queryParams)
      return res.data.data
    },
  })
}
