import { NavLink, useParams } from 'react-router-dom'
import { useCallback, React } from 'react'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { useDropzone } from 'react-dropzone'
import { nanoid } from 'nanoid'
import { FaFolderOpen } from 'react-icons/fa6'

import File from '../components/browse/file/File'
import Folder from '../components/browse/Folder'
import Spinner from '../components/utility/Spinner'

const initialFiles = [
  { id: nanoid(), name: 'HR', type: 'folder' },
  { id: nanoid(), name: 'Engineer', type: 'folder' },
  { id: nanoid(), name: 'Legal', type: 'folder' },
  { id: nanoid(), name: 'Sample.pdf', type: 'file', extension: 'pdf' },
  { id: nanoid(), name: 'Report.docx', type: 'file', extension: 'docx' },
  { id: nanoid(), name: 'Fridays Boracay.pdf', type: 'file', extension: 'pdf' },
  { id: nanoid(), name: 'Fridays Puerto Galera.docx', type: 'file', extension: 'docx' },
  { id: nanoid(), name: '2024 Billing.xlsx', type: 'file', extension: 'xlsx' },
  { id: nanoid(), name: 'new office 2024.jpg', type: 'file', extension: 'jpg' },
  { id: nanoid(), name: 'db-test.sql', type: 'file', extension: 'sql' },
  { id: nanoid(), name: 'june-2024-meeting.pptx', type: 'file', extension: 'pptx' },
]

const uploadFiles = async (files) => {
  console.log('Uploading files:', files)
  return new Promise((resolve) => setTimeout(() => resolve(files), 1000))
}

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const base64String = reader.result.split(',')[1]
      console.log('Base64 string:', base64String)
      resolve(base64String)
    }
    reader.onerror = (error) => reject(error)
  })
}

export const generateBreadcrumbs = (path) => {
  const segments = path.split('/')
  return segments.map((segment, index) => {
    return {
      name: segment,
      path: segments.slice(0, index + 1).join('/'),
    }
  })
}

const Browse = () => {
  const queryClient = useQueryClient()
  const params = useParams()
  const { '*': path } = params

  const breadcrumbs = generateBreadcrumbs(path)

  const newFilesMutation = useMutation({
    mutationFn: uploadFiles,
    onSuccess: (newFiles) => {
      queryClient.setQueryData(['files'], (oldFiles) => [...oldFiles, ...newFiles])
    },
  })

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const newFilesPromises = acceptedFiles.map(async (file) => ({
        id: nanoid(),
        name: file.name,
        type: 'file',
        file: await fileToBase64(file),
        extension: file.name.split('.').pop(),
      }))

      const newFiles = await Promise.all(newFilesPromises)

      newFilesMutation.mutate(newFiles)
    },
    [newFilesMutation],
  )

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  const filesQuery = useQuery({
    queryKey: ['files'],
    queryFn: () => wait(1000).then(() => [...initialFiles]),
  })

  if (filesQuery.isLoading) {
    return (
      <div className="flex justify-center">
        <Spinner size={50} />
      </div>
    )
  }

  if (filesQuery.error) {
    console.log(filesQuery.error)
    return <div className="flex justify-center">Error</div>
  }

  return (
    <div className="px-2 lg:px-24">
      <div className="py-4 text-2xl flex space-x-2">
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.path}>
            {index > 0 && <span className="mr-2 text-xl">&gt;</span>}
            <NavLink
              to={`/browse/${crumb.path}`}
              className="text-md p-2 rounded-md hover:bg-slate-200 capitalize"
            >
              {crumb.name}
            </NavLink>
          </div>
        ))}
      </div>
      <div
        {...getRootProps()}
        className="w-full border-2 border-dashed border-gray-300 rounded justify-center items-center flex cursor-pointer mb-5 bg-gray-50/50 overflow-y-auto h-24"
      >
        <p className="text-gray-500">Drag & drop some files here, or click to select files</p>
        <input {...getInputProps()} />
      </div>
      <div className="max-h-[41rem] overflow-y-auto scrollbar-thin scrollbar-track-white scrollbar-thumb-slate-300">
        {filesQuery.data.length === 0 ? (
          <div className="flex justify-center">
            <div className="flex-col text-center">
              <FaFolderOpen size={100} className="text-slate-500 mx-auto my-10" />
              <p className="text-3xl text-slate-700">No Files in this Folder</p>
              <p className="text-xl p-10 text-slate-400">
                Upload files by dragging or selecting files above.
              </p>
            </div>
          </div>
        ) : (
          <div className="max-h-[41rem] overflow-y-auto scrollbar-thin scrollbar-track-white scrollbar-thumb-slate-300">
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4 w-full">
              {filesQuery.data.map((file) =>
                file.type === 'file' ? (
                  <File key={file.id} file={file} />
                ) : (
                  <Folder key={file.id} folder={file} />
                ),
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

//Test
function wait(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration))
}

export default Browse
