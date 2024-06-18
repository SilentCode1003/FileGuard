import { useParams } from 'react-router-dom'
import { useState, useCallback, useEffect } from 'react' // Added useEffect for initial data
import { useDropzone } from 'react-dropzone'
import { nanoid } from 'nanoid'
import File from '../components/browse/File'
import Folder from '../components/browse/Folder'

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
]

const Browse = () => {
  const params = useParams()
  const { '*': path } = params
  const [items, setItems] = useState([...initialFiles])

  const onDrop = useCallback(
    (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) => ({
        id: uuidv4(),
        name: file.name,
        type: 'file',
        file: file,
      }))
      setItems([...items, ...newFiles])
    },
    [items],
  )

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  useEffect(() => {
    setItems([...initialFiles])
  }, [])

  return (
    <div className="px-2 lg:px-24 pt-8">
      <div className="py-4 text-2xl">
        <p>{path}</p>
      </div>
      <div
        {...getRootProps()}
        className="w-full border-2 border-dashed border-gray-300 rounded justify-center items-center flex cursor-pointer mb-5 bg-gray-50/50 overflow-y-auto h-24"
      >
        <p className="text-gray-500">Drag & drop some files here, or click to select files</p>
        <input {...getInputProps()} />
      </div>
      <div className="max-h-[41rem] overflow-y-auto scrollbar-thin scrollbar-track-white scrollbar-thumb-slate-300">
        <div className="items-container grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4 w-full">
          {items.map((item) =>
            item.type === 'file' ? (
              <File key={item.id} file={item} />
            ) : (
              <Folder key={item.id} folder={item} />
            ),
          )}
        </div>
      </div>
    </div>
  )
}

export default Browse
