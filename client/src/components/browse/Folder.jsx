import React, { useState } from 'react'
import { useLocation, useNavigate, NavLink } from 'react-router-dom'
import { BsDownload } from 'react-icons/bs'
import { MdDriveFileRenameOutline } from 'react-icons/md'
import { FaEllipsisVertical } from 'react-icons/fa6'

import Dropdown from '../utility/dropdown/Dropdown'
import DropdownItem from '../utility/dropdown/DropdownItem'

const Folder = ({ folder }) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [selected, setSelected] = useState(false)
  const [clickTimeout, setClickTimeout] = useState(null)

  const handleClick = () => {
    if (clickTimeout) {
      clearTimeout(clickTimeout)
      setClickTimeout(null)
      navigateToPath()
    } else {
      setSelected(true)
      setClickTimeout(
        setTimeout(() => {
          setClickTimeout(null)
        }, 300),
      )
    }
  }

  const navigateToPath = () => {
    navigate(`${pathname}/${folder.name.toLowerCase()}`)
  }

  return (
    <div
      onClick={handleClick}
      className={`bg-slate-200/85 border border-slate-200/85 hover:bg-slate-100 hover:border-slate-100 rounded-md px-1 py-2 flex justify-center items-center gap-2 cursor-pointer`}
    >
      <div className="text-5xl basis-3/12">📁</div>
      <div className="text-sm truncate basis-7/12">{folder.name}</div>
      <div className="flex basis-2/12 justify-center align-middle">
        <Dropdown>
          <DropdownItem Icon={BsDownload}>Download</DropdownItem>
          <DropdownItem Icon={MdDriveFileRenameOutline}>Rename</DropdownItem>
        </Dropdown>
      </div>
    </div>
  )
}

export default Folder
