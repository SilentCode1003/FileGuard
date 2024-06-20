import { FaSearch } from 'react-icons/fa'
import { Menu, MenuButton, MenuItems, Transition } from '@headlessui/react'
import { NavLink, useNavigate } from 'react-router-dom'
import { FaRegUser } from 'react-icons/fa'
import { TbDeviceImacSearch } from "react-icons/tb";


import { SlLogout, SlSettings } from 'react-icons/sl'
import { useLogout } from '../../api/auth/logout'
import { useUser } from '../../hooks/useUser'

const TopBar = () => {
  const { data: user } = useUser()
  const fullName = user.data.user.userFullname

  const navigate = useNavigate()

  const { mutateAsync: logout } = useLogout()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <nav className="relative bg-white w-full h-[5rem] hidden md:block">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
            <div className="relative md:block hidden">
              <input
                type="text"
                id="top-bar-search"
                placeholder="Search"
                className="border border-gray-300 rounded-lg py-2 px-4 
                  w-[30rem] h-[2.5rem] focus:outline-none
                  focus:border-sky-300"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FaSearch className="h-5 w-5 text-sky-600" />
              </div>
            </div>

            <NavLink to="/search">
            <div>
              <h6 className='py-2 px-8 text-red-600 hover:scale-[1.1]'><TbDeviceImacSearch size={25} /></h6>
            </div>

            </NavLink>
            <div className="md:ml-auto">
              <div className="flex space-x-4">
                <Menu>
                  <div className="my-auto text-lg">
                    <p>Welcome! {fullName}</p>
                  </div>
                  <MenuButton className="inline-flex whitespace-nowrap items-center rounded-full p-2 text-lg hover:bg-gray-300">
                    <FaRegUser size={25} />
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
                      className="w-[12rem] origin-top-right rounded border border-gray-300 bg-white p-1 mt-1 text-sm/6 text-gray-600 [--anchor-gap:var(--spacing-1)] focus:outline-none"
                    >
                      <NavLink
                        to="#"
                        className="group flex w-full items-center gap-2 rounded py-1.5 px-3 hover:bg-slate-200/85"
                      >
                        <div className="basis-2/12">
                          <SlSettings className="size-4 text-black" />
                        </div>
                        <div className="basis-10/12">Settings</div>
                      </NavLink>
                      <NavLink
                        to="#"
                        className="group flex w-full items-center gap-2 rounded py-1.5 px-3 hover:bg-slate-200/85"
                        onClick={handleLogout}
                      >
                        <div className="basis-2/12">
                          <SlLogout className="size-4 text-black" />
                        </div>
                        <div className="basis-10/12">Logout</div>
                      </NavLink>
                    </MenuItems>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default TopBar
