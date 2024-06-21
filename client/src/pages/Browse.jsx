import { NavLink, useParams } from 'react-router-dom'
import { useCallback, React, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useDropzone } from 'react-dropzone'
import { nanoid } from 'nanoid'
import { FaFolderOpen } from 'react-icons/fa6'
import { IoMdAdd } from 'react-icons/io'

//Components
import { fileToBase64, splitPath, mergeData } from '../utiliy/utility'
import File from '../components/browse/file/File'
import Folder from '../components/browse/Folder'
import Spinner from '../components/utility/Spinner'
import Modal from '../components/utility/Modal'
import CreateDepthFolder from '../components/utility/Create/Folder/CreateDepthFolder'

//Hooks
import { useGetFilePath, useGetPath } from '../hooks/useGetPath'

const uploadFiles = async (files) => {
  console.log('Uploading files:', files)
  return new Promise((resolve) => setTimeout(() => resolve(files), 1000))
}

const Browse = () => {
  const queryClient = useQueryClient()
  const params = useParams()
  const { '*': path } = params
  const breadcrumbs = splitPath(path)
  const refinedPath = `/${path.replace(/-/g, '').replace(/\s+/g, '')}`
  const fileQuery = useGetFilePath('browse-files', refinedPath)
  const folderQuery = useGetPath('browse-folder', refinedPath)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCreateFolder = (e) => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

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

  if (fileQuery.isLoading && folderQuery.isLoading)
    return (
      <div className="flex justify-center align-middle">
        <Spinner />
      </div>
    )

  if (fileQuery.isError && folderQuery.isError)
    return <div className="flex justify-center align-middle">Error Fetching Files</div>

  const display = mergeData(fileQuery.data, folderQuery.data)

  // console.log(display)
  return (
    <>
      <div className="px-2 lg:px-24">
        <div className="flex py-4 text-2xl">
          <div className="flex space-x-2">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.path} className="flex items-center">
                {index > 0 && <span className="mx-2 text-xl">&gt;</span>}
                <NavLink
                  to={`/browse/${crumb.path}`}
                  className="text-md p-2 rounded-md hover:bg-blue-100 capitalize"
                >
                  {crumb.name.replace(/-/g, ' ')}
                </NavLink>
              </div>
            ))}
          </div>
          <div className="ml-auto">
            <button
              className="flex space-x-2 border px-2 py-1 rounded-md hover:bg-blue-100"
              onClick={handleCreateFolder}
            >
              <IoMdAdd size={23} className="my-auto" />
              <span>Add Folder</span>
            </button>
          </div>
        </div>

        <div
          {...getRootProps()}
          className="w-full border-2 border-dashed border-gray-300 rounded justify-center items-center flex cursor-pointer mb-5 bg-gray-50/50 overflow-y-auto h-24"
        >
          <p className="text-gray-500">Drag & drop some files here, or click to select files</p>
          <input {...getInputProps()} />
        </div>
        <div className="max-h-[41rem] overflow-y-auto scrollbar-thin scrollbar-track-white scrollbar-thumb-slate-300">
          {display.length === 0 ? (
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
                {display.map((file) =>
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
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} style={'rounded-lg p-4'}>
        <CreateDepthFolder closeModal={handleCloseModal} />
      </Modal>
    </>
  )
}

export default Browse
