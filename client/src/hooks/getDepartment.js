import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'


// export function fetchDepartments() {
//     return useQuery({
//         queryFn: async () => {
//         try {
//             const res = await apiClient.get('/departments')
//             console.log('Departments API Response:', res.data);
//             return res.data.data;
//         } catch (error) {
//             throw new Error('Failed to fetch departments data');
//         }
//         },
//     });
// }



export async function fetchDepartments() {
    try {
      const res = await apiClient.get('/departments');
      console.log('Departments API Response:', res.data);
      return res.data.data;
    } catch (error) {
      console.error('Failed to fetch departments data:', error);
      throw new Error('Failed to fetch departments data');
    }
  }
