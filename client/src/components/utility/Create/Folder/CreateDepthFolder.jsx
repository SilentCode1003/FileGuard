import { useLocation } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { createDepthFolder } from '../../../../hooks/useCreateFolder'
import { calculateDepth } from '../../../../utiliy/utility'

const CreateDepthFolder = ({ closeModal }) => {
  const queryClient = useQueryClient()
  const { mutateAsync: create } = createDepthFolder()
  const [folderName, setFolderName] = useState('')
  const url = useLocation().pathname
  const folderDepth = calculateDepth(url)

  const queryKey = useMemo(() => {
    if (folderDepth === 1) {
      return ['folders', '/']
    } else {
      const parts = url.split('/')
      parts.pop()
      const newUrl = parts.join('/').replace('/browse', '')
      return ['folders', newUrl]
    }
  }, [folderDepth, url])
  // console.log('queryKey:', queryKey)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = {
      folderName: folderName,
      folderPath: `${decodeURI(url.replace('/browse/', ''))}`,
      folderDepth: folderDepth,
      // folderParentId: findFolderId(folderDepth, url),
    }

    try {
      await create(data)
    } catch (err) {
      if (err?.response?.status === 401) {
        console.log(err.response.data.message)
      }
    } finally {
      closeModal()
      setFolderName('')
    }
  }

  const findFolderId = (depth, url) => {
    const data = queryClient.getQueryData(queryKey) || []
    const folderNameToMatch =
      depth === 2
        ? url.replace('/browse', '').replace('/', '').toLowerCase()
        : url.split('/').slice(-1)[0].toLowerCase()
    const folder = data.find((row) => row.folderName.toLowerCase() === folderNameToMatch)
    // console.log('folder:', folder)
    return folder ? folder.folderId : ''
  }

  return (
    <div className="flex flex-col justify-between px-8 pt-2">
      <h2 className="text-2xl mb-4 justify-start">Add Folder</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="folder"
          placeholder="Enter Folder Name"
          className="border-2 border-gray-300 rounded py-2 px-4 focus:outline-none focus:border-blue-500 w-full"
          autoComplete="off"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          required
        />
        <div className="flex pt-6 space-x-2 justify-end text-xl">
          <button
            type="button"
            className="text-red-500 hover:bg-red-50 px-2 rounded-full"
            onClick={closeModal}
          >
            Close
          </button>
          <button type="submit" className="text-blue-500 px-2 hover:bg-blue-50 rounded-full">
            Create
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateDepthFolder
