import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'

import SideBarSubMenu from './SideBarSubMenu'

import { IoIosArrowBack, IoMdMenu } from 'react-icons/io'
import { AiOutlineAppstore } from 'react-icons/ai'

import Logo from '../../../assets/img/file-guard-logo.png'

const SideBar = () => {
  let isTab = useMediaQuery({ maxWidth: 768 })
  const { pathname } = useLocation()

  const [isOpen, setIsOpen] = useState(isTab ? false : true)

  const sidebarAnimation = isTab
    ? {
        open: {
          x: 0,
          width: '16rem',
          transition: {
            damping: 40,
          },
        },
        closed: {
          width: 0,
        },
        transition: {
          x: -250,
          width: 0,
          transition: {
            damping: 40,
            delay: 0.15,
          },
        },
      }
    : {
        open: {
          width: '16rem',
          transition: {
            damping: 40,
          },
        },
        closed: {
          width: '4rem',
          transition: {
            damping: 40,
          },
        },
      }

  useEffect(() => {
    if (isTab) {
      setIsOpen(false)
    } else {
      setIsOpen(true)
    }
  }, [isTab])

  const companyOne = [
    {
      name: '5L Solutions',
      menus: [
        {
          name: 'Archives',
          menus: [
            {
              name: 'HR',
              menus: [
                {
                  name: 'Events',
                  menus: [
                    'Sports Fest',
                    'Anniversary',
                    {
                      name: 'Christmas Party',
                      menus: ['2021', '2022', '2023'],
                    },
                  ],
                },
                'Documents',
              ],
            },
            {
              name: 'Engineer',
              menus: ['Week 3', 'Week 4'],
            },
            {
              name: 'Legal',
              menus: ['Week 3', 'Week 4'],
            },
          ],
        },
      ],
    },
  ]

  const companyTwo = [
    {
      name: 'Cyber Power',
      menus: ['2023 Archives', '2024 Archives'],
    },
  ]
  return (
    <>
      <div
        onClick={() => setIsOpen(false)}
        className={`md:hidden fixed inset-0 max-h-screen z-[998] bg-black/50 ${
          isOpen ? 'block' : 'hidden'
        }`}
      ></div>
      <motion.div
        variants={sidebarAnimation}
        animate={isOpen ? 'open' : 'closed'}
        className="bg-white text-gray shadow-xl z-[999] w-[16rem] max-w-[16rem] h-screen overflow-hidden md:relative fixed"
      >
        <div className="flex items-center gap-2 font-medium border-b border-slate-300 mx-3">
          <img src={Logo} alt="Logo" width={125} className="mx-auto md:p-2" />
        </div>

        {/* Menu */}
        <div className="flex flex-col h-screen">
          <ul className="whitespace-pre px-2.5 text-[1rem] py-2 flex flex-col gap-1 font-medium overflow-x-hidden scrollbar-thin scrollbar-track-white scrollbar-thumb-slate-100 md:h-80% max-h-[80%]">
            <li>
              <NavLink to="/" className="link">
                <AiOutlineAppstore size={23} className="min-w-max" />
                Dashboard
              </NavLink>
            </li>

            {/* With Submenu */}
            {(isOpen || isTab) && (
              <div className="border-y py-4 border-slate-300">
                {companyOne.map((menu) => (
                  <div key={menu.name}>
                    <SideBarSubMenu data={menu} />
                  </div>
                ))}
                {companyTwo.map((menu) => (
                  <div key={menu.name}>
                    <SideBarSubMenu data={menu} />
                  </div>
                ))}
              </div>
            )}
          </ul>
        </div>

        {/* Button */}
        <motion.div
          animate={
            isOpen
              ? {
                  x: 0,
                  y: 0,
                  rotate: 0,
                }
              : {
                  x: -10,
                  y: -200,
                  rotate: 180,
                }
          }
          onClick={() => setIsOpen(!isOpen)}
          className="absolute w-fit h-fit z-50 right-2 bottom-4 cursor-pointer"
        >
          <IoIosArrowBack size={25} />
        </motion.div>
      </motion.div>
      <div className="m-3 md:hidden" onClick={() => setIsOpen(true)}>
        <IoMdMenu size={25} className="mt-4" />
      </div>
    </>
  )
}

export default SideBar
