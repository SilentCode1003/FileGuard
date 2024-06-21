// import { useQuery } from '@tanstack/react-query'
// import { apiClient } from '../lib/api-client'

// export function useFileSearch(searchparameter) {
//   return useQuery({
//     queryKey: ['searchfile', searchparameter],
//     queryFn: async () => {
//       const params = new URLSearchParams({ searchparameter })
//       const res = await apiClient.get(`/files/search-files?${params}`)
//       return res.data
//     },
//   })
// }


import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'

export function useFileSearch(searchText) {
  return useQuery({
    queryKey: ['searchfile', searchText],
    queryFn: async () => {
      try {
        const res = await apiClient.get(`/files/search-files?searchText=${searchText}`)
        return res.data
      } catch (error) {
        throw new Error('Failed to fetch search results')
      }
    },
  })
}


  
