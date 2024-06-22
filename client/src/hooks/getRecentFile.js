import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'


export function fetchRecentFile() {
    return useQuery({
        queryFn: async () => {
        try {
            const res = await apiClient.get('/files')
            console.log('Files API Response:', res.data);
            return res.data.data;
        } catch (error) {
            throw new Error('Failed to fetch files data');
        }
        },
    });
}

