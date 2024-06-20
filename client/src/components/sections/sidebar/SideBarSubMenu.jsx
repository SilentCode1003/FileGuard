import { useState } from 'react'
import { motion } from 'framer-motion'
import { IoIosArrowDown } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import Spinner from '../../utility/Spinner'
import FolderIcon from '../../utility/FolderIcon'
import { apiClient } from '../../../lib/api-client'

const SideBarSubMenu = ({ data, currentPath = '' }) => {
  const navigate = useNavigate()
  const [subMenuOpen, setSubMenuOpen] = useState(false)

  const validatedCurrentPath = currentPath.startsWith('/') ? currentPath.slice(1) : currentPath

  let fullPath = '/browse'
  if (validatedCurrentPath) {
    fullPath += `${validatedCurrentPath}`
  }
  fullPath += `/${data.name.replace(/\s+/g, '').toLowerCase()}`

  const handleToggle = (e) => {
    e.preventDefault()
    setSubMenuOpen((prev) => !prev)
    navigate(fullPath)
  }

  const folderPath = `${validatedCurrentPath}/${data.name.replace(/\s+/g, '').toLowerCase()}`
  const folderQuery = useQuery({
    queryKey: ['submenu', folderPath],
    queryFn: async () => {
      const queryParams = new URLSearchParams({ folderPath })
      const res = await apiClient.get('/folders?' + queryParams)
      return res.data.data
    },
  })

  if (folderQuery.isLoading)
    return (
      <div className="flex justify-center w-[16rem]">
        <Spinner size={50} />
      </div>
    )

  if (folderQuery.isError) {
    return folderQuery.refetch
  }

  const submenuData = folderQuery.data || []
  const hasSubMenus = submenuData.length > 0

  const path = submenuData.map((folder) => ({
    name: folder.folderName.replace(/([a-z])([A-Z])/g, '$1 $2'),
    id: folder.folderId,
  }))

  return (
    <>
      <li
        className={`link`}
        onClick={
          hasSubMenus
            ? handleToggle
            : (e) => {
                e.preventDefault()
                navigate(fullPath)
              }
        }
      >
        <FolderIcon isOpen={subMenuOpen} />
        <p className="flex-1 capitalize">{data.name}</p>
        {hasSubMenus && (
          <IoIosArrowDown className={`transform ${subMenuOpen && 'rotate-180'} duration-200 `} />
        )}
      </li>
      <motion.ul
        animate={{ height: subMenuOpen ? 'auto' : 0 }}
        transition={{ duration: 0 }}
        className="flex h-0 flex-col pl-3 text-[0.8rem] font-normal overflow-hidden "
      >
        {subMenuOpen &&
          path.map((menu) => (
            <SideBarSubMenu
              key={menu.id}
              data={menu}
              currentPath={`/${validatedCurrentPath}/${data.name.replace(/\s+/g, '').toLowerCase()}`}
            />
          ))}
      </motion.ul>
    </>
  )
}

export default SideBarSubMenu
