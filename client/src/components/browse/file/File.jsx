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
import Spinner from '../../utility/Spinner'

const File = ({ file }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleViewFile = (e) => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
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
      <FileView isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="flex flex-col justify-between">
          <h2 className="mx-auto text-xl font-bold mb-4">{file.name}</h2>
          <div className="flex flex-col lg:flex-row gap-4 h-[42rem]">
            <div className="basis-full lg:basis-8/12 text-center border p-4 rounded">
              <p>{file.name}</p>
              <Spinner size={30} />
            </div>
            <div className="basis-full lg:basis-4/12 text-center border p-4 rounded">
              <p>{file.name}</p>
              <Spinner size={30} />
            </div>
          </div>
        </div>
      </FileView>
    </div>
  )
}

export default File
