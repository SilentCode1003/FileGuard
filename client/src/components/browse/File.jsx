import React from 'react'
import { BsDownload } from 'react-icons/bs'
import { MdDriveFileRenameOutline } from 'react-icons/md'
import { MdViewInAr } from 'react-icons/md'

import Dropdown from '../utility/dropdown/Dropdown'
import DropdownItem from '../utility/dropdown/DropdownItem'
import FileIcon from '../utility/FileIcon'

const File = ({ file }) => {
  return (
    <div className="bg-slate-200/85 border border-slate-200/85 hover:bg-slate-100 hover:border-slate-100 rounded-md px-1 py-2 flex justify-center items-center gap-2 cursor-pointer">
      <div className="text-5xl basis-3/12 text-slate-600">
        <FileIcon extension={file.extension} />
      </div>
      <div className="text-sm truncate basis-7/12">{file.name}</div>
      <div className="flex basis-2/12 justify-center align-middle">
        <Dropdown>
          <DropdownItem Icon={MdViewInAr}>View File</DropdownItem>
          <DropdownItem Icon={BsDownload}>Download</DropdownItem>
          <DropdownItem Icon={MdDriveFileRenameOutline}>Rename</DropdownItem>
        </Dropdown>
      </div>
    </div>
  )
}

export default File
