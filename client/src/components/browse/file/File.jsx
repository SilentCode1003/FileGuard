import React, { useState } from 'react'
import { BsDownload } from 'react-icons/bs'
import {
  MdDriveFileRenameOutline,
  MdOutlineDriveFileMove,
  MdViewInAr,
  MdDeleteOutline,
} from 'react-icons/md'
import Dropdown from '../../utility/dropdown/Dropdown'
import DropdownItem from '../../utility/dropdown/DropdownItem'
import FileIcon from '../../utility/FileIcon'
import FileView from './FileView'

const File = ({ file }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const handleViewFile = (e) => {
    e.preventDefault()
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const newData = {
    fileName: file.name,
    filePath: file.path,
    fileId: file.id,
  }

  return (
    <div className="bg-slate-200/85 border border-slate-200/85 hover:bg-slate-100 hover:border-slate-100 rounded-md px-1 py-2 flex justify-center items-center gap-2">
      <div className="text-5xl basis-3/12 text-slate-600">
        <FileIcon extension={file.extension} />
      </div>
      <div className="text-sm truncate basis-7/12">{file.name}</div>
      <div className="flex basis-2/12 justify-center align-middle">
        <Dropdown>
          <DropdownItem Icon={MdViewInAr} onClick={handleViewFile}>
            View File
          </DropdownItem>
          <DropdownItem Icon={MdOutlineDriveFileMove}>Move to</DropdownItem>
          <DropdownItem Icon={BsDownload}>Download</DropdownItem>
          <DropdownItem Icon={MdDriveFileRenameOutline}>Rename</DropdownItem>
          <DropdownItem Icon={MdDeleteOutline}>Delete</DropdownItem>
        </Dropdown>
      </div>
      {newData && <FileView isOpen={isModalOpen} onClose={handleCloseModal} data={newData} />}
    </div>
  )
}

export default File
