import { useCallback, React, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { useLocation } from 'react-router-dom'
import { ToastContainer, toast, Slide } from 'react-toastify'

import { fileToBase64, calculateDepth } from '../../../../utiliy/utility'
import { createFile } from '../../../../hooks/useCreateFile'

const CreateFile = () => {
  const { mutateAsync: create } = createFile()
  const url = useLocation().pathname
  const folderDepth = calculateDepth(url)
  const onDrop = useCallback(
    async (acceptedFiles) => {
      const newFilesPromises = acceptedFiles.map(async (file) => ({
        file: await fileToBase64(file),
        fileName: file.name,
        filePath: url.replace('/browse', ''),
        type: 'file',
        fileMimeType: file.type,
      }))

      const newFiles = await Promise.all(newFilesPromises)
      const newObject = {
        files: newFiles,
      }
      // console.log(newObject)
      if (folderDepth > 4) {
        try {
          await create(newObject)
        } catch (err) {
          // console.log(err)
          if (err?.response?.data?.message === 'File already exists!') {
            toast.error(err?.response?.data?.message, { theme: 'dark' })
          }
        }
      } else {
        toast.error('Cannot upload files in this folder!', { theme: 'dark' })
      }
    },
    [folderDepth, url],
  )

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <>
      <div
        {...getRootProps()}
        className="w-full border-2 border-dashed border-gray-300 rounded justify-center items-center flex cursor-pointer mb-5 bg-gray-50/50 overflow-y-auto h-24"
      >
        <p className="text-gray-500">Drag & drop some files here, or click to select files</p>
        <input {...getInputProps()} />
      </div>
      <ToastContainer transition={Slide} />
    </>
  )
}

export default CreateFile
