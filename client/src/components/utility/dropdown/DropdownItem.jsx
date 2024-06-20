import { NavLink } from 'react-router-dom'
import { MenuItem } from '@headlessui/react'

const DropdownItem = ({ route = '#', Icon, children, onClick }) => {
  return (
    <MenuItem className="hover:bg-slate-200">
      <NavLink
        to={route}
        className="group flex w-full items-center gap-2 py-1.5 px-3"
        onClick={onClick}
      >
        <div className="basis-2/12">
          <Icon className="size-4 text-black" />
        </div>
        <div className="basis-10/12">{children}</div>
      </NavLink>
    </MenuItem>
  )
}

export default DropdownItem
