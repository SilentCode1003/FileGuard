import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'


// export function fetchCompanies() {
//     return useQuery({
//         queryFn: async () => {
//         try {
//             const res = await apiClient.get('/companies');
//             console.log('Companies API Response:', res.data);
//             return res.data.data;
//         } catch (error) {
//             throw new Error('Failed to fetch companies data');
//         }
//         },
//     });
// }


export async function fetchCompanies() {
    try {
      const res = await apiClient.get('/companies');
      console.log('Companies API Response:', res.data);
      return res.data.data;
    } catch (error) {
      console.error('Failed to fetch companies data:', error);
      throw new Error('Failed to fetch companies data');
    }
  }