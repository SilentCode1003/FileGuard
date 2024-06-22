import ScrollableTable from '../components/utility/ScrollableTable'
import { useMemo, useState } from 'react'
import mData from '../MOCK_DATA.json'
import { useUser } from '../hooks/useUser'
import { fetchRecentFile } from '../hooks/getRecentFile'
import FileIcon from '../components/utility/FileIcon'
import Dropdown from '../components/utility/dropdown/Dropdown'
import DropdownItem from '../components/utility/dropdown/DropdownItem'
import {
  MdDriveFileRenameOutline,
  MdOutlineDriveFileMove,
  MdViewInAr,
  MdDeleteOutline,
} from 'react-icons/md'
import { BsDownload } from 'react-icons/bs'
import FileView from '../components/browse/file/FileView'

const DashBoard = () => {
  const { data: user } = useUser()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const fullName = user.data.user.userFullname

  const { data: recentFiles = [], isLoading, isError, error } = fetchRecentFile()

  const handleViewFile = (data) => {
    setSelectedFile(data)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedFile(null)
  }

  const transformedData = recentFiles.map((file) => ({
    fileName: file.fileName,
    fileType: file.fileName.split('.').pop(),
    createdAt: file.createdAt,
    filePath: file.filePath,
  }))

  const data = useMemo(
    () => (transformedData.length > 0 ? transformedData : mData),
    [transformedData],
  )

  /** @type import('@tanstack/react-table').ColumnDef<any> */
  const columns = [
    {
      header: <span></span>,
      accessorKey: 'fileType',
      cell: ({ row }) => {
        const file = row.original
        return (
          <div className="flex justify-center items-center text-4xl">
            <FileIcon extension={file.fileType} />
          </div>
        )
      },
    },
    {
      header: <span className="flex">File Name</span>,
      accessorKey: 'fileName',
      cell: ({ row }) => {
        const file = row.original
        return <div className="flex">{file.fileName}</div>
      },
    },
    {
      header: <span className="flex">Date</span>,
      accessorKey: 'createdAt',
      cell: ({ row }) => (
        <span className="flex">{new Date(row.original.createdAt).toLocaleString()}</span>
      ),
    },
    {
      header: '',
      accessorKey: 'edit',
      cell: ({ row }) => (
        <Dropdown>
          <DropdownItem Icon={MdViewInAr} onClick={() => handleViewFile(row.original)}>
            View File
          </DropdownItem>
          <DropdownItem Icon={BsDownload}>Download</DropdownItem>
          <DropdownItem Icon={MdDriveFileRenameOutline}>Rename</DropdownItem>
          <DropdownItem Icon={MdDeleteOutline}>Delete</DropdownItem>
        </Dropdown>
      ),
    },
  ]

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error: {error.message}</div>
  }

  return (
    <>
      <div className="p-8">
        <h1 className="text-[36px] p-6 tracking-wide mt-[3%]">
          Welcome back <span className="font-semibold">{fullName}</span>
        </h1>

        <h6 className="text-[20px] p-2 mt-[3%]">Recent Files</h6>
        <ScrollableTable data={data} columns={columns} />
      </div>
      <div className="flex basis-2/12 justify-center align-middle"></div>
      <FileView isOpen={isModalOpen} onClose={handleCloseModal} data={selectedFile} />
    </>
  )
}

export default DashBoard
