import { Menu, MenuButton, MenuItems, Transition, MenuItem } from '@headlessui/react'
import { FaEllipsisVertical } from 'react-icons/fa6'

const Dropdown = ({ children }) => {
  return (
    <>
      <Menu>
        <MenuButton className="flex rounded-full hover:bg-slate-300/85 w-8 h-8 justify-center">
          <FaEllipsisVertical size={20} className="my-auto" />
        </MenuButton>
        <Transition
          enter="transition ease-out duration-75"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <MenuItems
            anchor="bottom start"
            className="w-[15rem] origin-top-right border border-gray-300 bg-white py-1 mt-1 text-sm/6 text-black focus:outline-none rounded"
          >
            {children}
          </MenuItems>
        </Transition>
      </Menu>
    </>
  )
}

export default Dropdown
