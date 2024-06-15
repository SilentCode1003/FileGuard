import { useState } from 'react'
import { motion } from 'framer-motion'
import { IoIosArrowDown } from 'react-icons/io'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { FaFolder } from 'react-icons/fa'

import Folder from '../../utility/Folder'

const SideBarSubMenu = ({ data, currentPath = '' }) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [subMenuOpen, setSubMenuOpen] = useState(false) // State for current submenu
  const hasSubMenus = data.menus && data.menus.length > 0 // Check if submenu exists

  // Construct full path
  let fullPath = '/browse'
  if (currentPath) {
    fullPath += `/${currentPath}`
  }
  fullPath += `/${data.name.replace(/\s+/g, '').toLowerCase()}`

  const handleToggle = (e) => {
    e.preventDefault()
    setSubMenuOpen((prev) => !prev)
    navigate(fullPath)
  }

  return (
    <>
      <li
        className={`link ${pathname.includes(data.name) && 'text-teal-800 bg-green-100/45'}`}
        onClick={handleToggle}
      >
        {hasSubMenus && <Folder isOpen={subMenuOpen} />}
        <p className="flex-1 capitalize">{data.name}</p>
        {hasSubMenus && (
          <IoIosArrowDown className={`transform ${subMenuOpen && 'rotate-180'} duration-200 `} />
        )}
      </li>
      {hasSubMenus && (
        <motion.ul
          animate={{ height: subMenuOpen ? 'auto' : 0 }}
          className="flex h-0 flex-col pl-3 text-[0.8rem] font-normal overflow-hidden"
        >
          {subMenuOpen &&
            data.menus.map((menu) => (
              <div key={menu.name || menu}>
                {menu.menus ? (
                  <SideBarSubMenu
                    data={menu}
                    currentPath={`${currentPath}/${data.name.replace(/\s+/g, '').toLowerCase()}`}
                  />
                ) : (
                  <NavLink
                    to={`/browse/${currentPath ? `${currentPath}/` : ''}${data.name.replace(/\s+/g, '').toLowerCase()}/${menu.replace(/\s+/g, '').toLowerCase()}`}
                    className="link !bg-transparent capitalize"
                  >
                    <Folder />
                    {menu.name || menu}
                  </NavLink>
                )}
              </div>
            ))}
        </motion.ul>
      )}
    </>
  )
}

export default SideBarSubMenu
