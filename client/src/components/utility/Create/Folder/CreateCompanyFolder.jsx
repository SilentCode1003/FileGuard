import { createCompanyFolder } from '../../../../hooks/useCreateFolder'
import { useState } from 'react'

const CreateCompanyFolder = ({ closeModal }) => {
  const [folderName, setFolderName] = useState('')
  const { mutateAsync: create } = createCompanyFolder()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = {
      folderName: folderName,
      folderPath: `/`,
      folderDepth: 0,
    }

    try {
      await create(data)
    } catch (err) {
      if (!err?.response) {
      } else if (err.response?.status === 401) {
        console.log(err.response.data.message)
      }
    } finally {
      closeModal()
      setFolderName('')
    }
  }

  return (
    <div className="flex flex-col justify-between px-8 pt-2">
      <h2 className="text-2xl mb-4 justify-start">Create Company Folder</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="folder"
          placeholder="Enter Folder Name"
          className="border-2 border-gray-300 rounded py-2 px-4 focus:outline-none focus:border-blue-500 w-full"
          onChange={(e) => setFolderName(e.target.value)}
          autoComplete="off"
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

export default CreateCompanyFolder
