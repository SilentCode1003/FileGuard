// import { useQuery } from '@tanstack/react-query';
// import { apiClient } from '../lib/api-client';

// const sanitizeFilePath = (filePath) => {
//   return filePath.startsWith('root/') ? filePath.slice(5) : filePath;
// };

// export function useFilePreview({ filename, filePath }) {
//   const sanitizedFilePath = sanitizeFilePath(filePath);

//   return useQuery({
//     queryKey: [filename, sanitizedFilePath],
//     queryFn: async () => {
//       try {
//         const res = await apiClient.get(`/files/preview/${sanitizedFilePath}/${filename}`);
//         return res.data;
//       } catch (error) {
//         throw new Error('Failed to fetch preview results');
//       }
//     },
//   });
// }


import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';

const sanitizeFilePath = (filePath) => {
  return filePath.startsWith('root/') ? filePath.slice(5) : filePath;
};

export function useFilePreview({ filename, filePath }) {
  const sanitizedFilePath = sanitizeFilePath(filePath);

  return useQuery({
    queryKey: [filename, sanitizedFilePath],
    queryFn: async () => {
      try {
        const res = await apiClient.use(`/files/preview/${sanitizedFilePath}/${filename}`);
        return res.data;
      } catch (error) {
        throw new Error('Failed to fetch preview results');
      }
    },
  });
}

