import React from 'react'
import { LuFolderSearch } from 'react-icons/lu'
import ScrollableTable from '../components/utility/ScrollableTable'
import { useMemo } from 'react'
import mData from '../MOCK_DATA.json'
import { HiDotsHorizontal } from 'react-icons/hi'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { FaChevronDown } from 'react-icons/fa'
import { FaListUl } from 'react-icons/fa6'
import { fetchCompanies } from '../hooks/getCompanies'
import { fetchDepartments } from '../hooks/getDepartment'
import { useState, useEffect } from 'react';

import { RxDashboard } from 'react-icons/rx'

const AdvancedSearch = () => {
const data = useMemo(() => mData, [])
const [companies, setCompanies] = useState([]);
const [departments, setDepartments] = useState([]);
const [isCompaniesLoading, setIsCompaniesLoading] = useState(true);
const [isCompaniesError, setIsCompaniesError] = useState(false);
const [isLoading, setIsLoading] = useState(true);
const [isError, setIsError] = useState(false);

useEffect(() => {
  const fetchData = async () => {
    try {
      const companiesData = await fetchCompanies();
      setCompanies(companiesData);
      setIsCompaniesLoading(false);
    } catch (error) {
      setIsCompaniesError(true);
      setIsCompaniesLoading(false);
    }

    try {
      const departmentsData = await fetchDepartments();
      setDepartments(departmentsData);
      setIsLoading(false);
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
    }
  };

  fetchData();
}, []);

console.log(companies, 'companies');
console.log(departments, 'departments');

/** @type import('@tanstack/react-table').ColumnDef<any> */
const columns = [
  {
    header: 'File No.',
    accessorKey: 'id',
  },
  {
    header: 'File Name',
    accessorFn: (row) => `${row.first_name} ${row.last_name}`,
    accessorKey: 'file_name',
  },
  {
    header: 'Tags',
    accessorKey: 'tags',
  },
  {
    header: 'Edited',
    accessorKey: 'edited',
  },
  {
    header: 'Created',
    accessorKey: 'created',
  },
  // {
  //   header: "Date of Birth",
  //   accessorKey: "dob",
  //   footer: "Date of Birth",
  //   cell: (info) =>
  //     DateTime.fromISO(info.getValue()).toLocaleString(DateTime.DATE_MED),
  // },
  {
    header: 'Owner',
    accessorKey: 'owner',
    cell: (info) => (
      <img
        src={info.getValue()}
        alt="example"
        className="w-12 h-12 object-cover rounded-[50%] mx-auto"
      />
    ),
  },
  {
    header: '',
    accessorKey: 'edit',
    cell: () => <HiDotsHorizontal className="text-black" size={23} />, // Render the icon in the cell
  },
]
return (
  <>
    <div className="p-8">
      <h1 className="text-[32px] p-6 tracking-wide mt-[3%]">Advanced Search</h1>

      <div className="w-full shadow-lg p-10 rounded-[5px] bg-sky-50 mt-[2%] mb-[2%]">
        <div className="w-full shadow-lg p-8 rounded-[5px] mt-[3%] bg-white h-[330px]">
          <div className="relative md:block hidden mb-[2%]">
            <input
              type="text"
              id=""
              placeholder="Enter Keyword ..."
              className="border-[3px] border-gray-300 rounded-lg py-2 px-4 pl-10 w-[30rem] h-[2.5rem] focus:outline-none focus:border-sky-300 tracking-wider"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <LuFolderSearch className="h-5 w-5 text-sky-600" size={25} />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* row1 */}
            <div className="flex flex-wrap gap-4">
              <div className="flex">
                <Menu>
                  <MenuButton>
                    <div
                      className="border-[3px] border-gray-300 py-2 px-4 
                w-[30rem] h-[2.5rem] text-left rounded-[8px]"
                    >
                      Company Name
                      <span className="float-right ">
                        <FaChevronDown size={16} />
                      </span>
                    </div>
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
                      className="w-[15rem] origin-top-right border border-gray-300 bg-white py-4 px-4 mt-1 text-sm/6 text-black focus:outline-none rounded"
                    >
                      {isCompaniesLoading ? (
                        <MenuItem>
                          <span>Loading...</span>
                        </MenuItem>
                      ) : isCompaniesError ? (
                        <MenuItem>
                          <span>Error loading Companies</span>
                        </MenuItem>
                      ) : companies && companies.length > 0 ? (
                        companies.map((company) => (
                          <MenuItem key={company.compId}>
                            <a
                              className="block data-[focus]:bg-blue-100 rounded-[8px] p-2"
                              // href={`/companies/${company.compId}`}
                            >
                              {company.compName}
                            </a>
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem>
                          <span>No companies found</span>
                        </MenuItem>
                      )}
                    </MenuItems>
                  </Transition>
                </Menu>
              </div>

              <div className="flex">
                <Menu>
                  <MenuButton>
                    <div
                      className="border-[3px] border-gray-300 py-2 px-4 
                        w-[30rem] h-[2.5rem] text-left rounded-[8px]"
                    >
                      Department
                      <span className="float-right">
                        <FaChevronDown size={16} />
                      </span>
                    </div>
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
                      className="w-[15rem] origin-top-right border border-gray-300 bg-white py-4 px-4 mt-1 text-sm/6 text-black focus:outline-none rounded"
                    >
                      {isLoading ? (
                        <MenuItem>
                          <span>Loading...</span>
                        </MenuItem>
                      ) : isError ? (
                        <MenuItem>
                          <span>Error loading departments</span>
                        </MenuItem>
                      ) : (
                        departments.map((department) => (
                          <MenuItem key={department.deptId}>
                            <a
                              className="block data-[focus]:bg-blue-100 rounded-[8px] p-2"
                              // href={`/departments/${department.deptId}`}
                            >
                              {department.deptName}
                            </a>
                          </MenuItem>
                        ))
                      )}
                    </MenuItems>
                  </Transition>
                </Menu>
              </div>
            </div>

            {/* row2 */}
            <div className="flex flex-wrap gap-4">
              <div className="flex">
                <Menu>
                  <MenuButton>
                    <div
                      className="border-[3px] border-gray-300 py-2 px-4 
                      w-[30rem] h-[2.5rem] text-left rounded-[8px]"
                    >
                      File Type
                      <span className="float-right ">
                        <FaChevronDown size={16} />
                      </span>
                    </div>
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
                      className="w-[15rem] origin-top-right border border-gray-300 bg-white py-4 px-4 mt-1 text-sm/6 text-black focus:outline-none rounded"
                      >
                      <MenuItem>
                        <a
                          className="block data-[focus]:bg-blue-100 rounded-[8px] p-2"
                          href="/pdf"
                        >
                          PDF
                        </a>
                      </MenuItem>
                      <MenuItem>
                        <a
                          className="block data-[focus]:bg-blue-100 rounded-[8px] p-2"
                          href="/docx"
                        >
                          DOCX
                        </a>
                      </MenuItem>
                      <MenuItem>
                        <a
                          className="block data-[focus]:bg-blue-100 rounded-[8px] p-2"
                          href="/csv"
                        >
                          CSV
                        </a>
                      </MenuItem>
                      <MenuItem>
                        <a
                          className="block data-[focus]:bg-blue-100 rounded-[8px] p-2"
                          href="/jpeg"
                        >
                          JPEG
                        </a>
                      </MenuItem>
                      <MenuItem>
                        <a
                          className="block data-[focus]:bg-blue-100 rounded-[8px] p-2"
                          href="/png"
                        >
                          PNG
                        </a>
                      </MenuItem>
                      <MenuItem>
                        <a
                          className="block data-[focus]:bg-blue-100 rounded-[8px] p-2"
                          href="/xlsx"
                        >
                          XLSX
                        </a>
                      </MenuItem>
                      <MenuItem>
                        <a
                          className="block data-[focus]:bg-blue-100 rounded-[8px] p-2"
                          href="/pptx"
                        >
                          PPTX
                        </a>
                      </MenuItem>
                      <MenuItem>
                        <a
                          className="block data-[focus]:bg-blue-100 rounded-[8px] p-2"
                          href="/txt"
                        >
                          TXT
                        </a>
                      </MenuItem>
                      <MenuItem>
                        <a
                          className="block data-[focus]:bg-blue-100 rounded-[8px] p-2"
                          href="/html"
                        >
                          HTML
                        </a>
                      </MenuItem>
                      <MenuItem>
                        <a
                          className="block data-[focus]:bg-blue-100 rounded-[8px] p-2"
                          href="/jpg"
                        >
                          JPG
                        </a>
                      </MenuItem>
                      <MenuItem>
                        <a
                          className="block data-[focus]:bg-blue-100 rounded-[8px] p-2"
                          href="/gif"
                        >
                          GIF
                        </a>
                      </MenuItem>
                      <MenuItem>
                        <a
                          className="block data-[focus]:bg-blue-100 rounded-[8px] p-2"
                          href="/bmp"
                        >
                          BMP
                        </a>
                      </MenuItem>
                      {/* Add more menu items for other file types like MP3, MP4, etc. */}
                    </MenuItems>
                  </Transition>
                </Menu>
              </div>

              <div className="flex">
                <input
                  type="date"
                  className="border-[3px] border-gray-300 py-2 px-4 
                w-[30rem] h-[2.5rem] text-left rounded-[8px]"
                />
              </div>
            </div>

            {/* row3 */}

            <div className="flex">
              <Menu>
                <MenuButton>
                  <div
                    className="border-[3px] border-gray-300 py-2 px-4 
                w-[30rem] h-[2.5rem] text-left rounded-[8px]"
                  >
                    Document Type
                    <span className="float-right ">
                      <FaChevronDown size={16} />
                    </span>
                  </div>
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
                    className="w-[15rem] origin-top-right border border-gray-300 bg-white py-4 px-4 mt-1 text-sm/6 text-black focus:outline-none rounded"
                  >
                    <MenuItem>
                      <a
                        className="block data-[focus]:bg-blue-100 rounded-[8px] p-2"
                        href="/billing"
                      >
                        Billing
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a
                        className="block data-[focus]:bg-blue-100 rounded-[8px] p-2"
                        href="/contracts"
                      >
                        Contracts
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a
                        className="block data-[focus]:bg-blue-100 rounded-[8px] p-2"
                        href="/reports"
                      >
                        Reports
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a
                        className="block data-[focus]:bg-blue-100 rounded-[8px] p-2"
                        href="/invoices"
                      >
                        Invoices
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a
                        className="block data-[focus]:bg-blue-100 rounded-[8px] p-2"
                        href="/proposals"
                      >
                        Proposals
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a
                        className="block data-[focus]:bg-blue-100 rounded-[8px] p-2"
                        href="/agreements"
                      >
                        Agreements
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a
                        className="block data-[focus]:bg-blue-100 rounded-[8px] p-2"
                        href="/policies"
                      >
                        Policies
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a
                        className="block data-[focus]:bg-blue-100 rounded-[8px] p-2"
                        href="/guidelines"
                      >
                        Guidelines
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a
                        className="block data-[focus]:bg-blue-100 rounded-[8px] p-2"
                        href="/manuals"
                      >
                        Manuals
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a
                        className="block data-[focus]:bg-blue-100 rounded-[8px] p-2"
                        href="/procedures"
                      >
                        Procedures
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a
                        className="block data-[focus]:bg-blue-100 rounded-[8px] p-2"
                        href="/protocols"
                      >
                        Protocols
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a
                        className="block data-[focus]:bg-blue-100 rounded-[8px] p-2"
                        href="/standards"
                      >
                        Standards
                      </a>
                    </MenuItem>
                  </MenuItems>
                </Transition>
              </Menu>
            </div>
          </div>

          <button className="float-right w-[15rem] bg-sky-600 rounded-[8px] border-[3px] text-[20px] text-white border-sky-900 p-2 hover:bg-sky-900 hover:font-bold hover:scale-[1.1]">
            Search
          </button>
        </div>

        <div className="flex flex-wrap float-right m-6 gap-8">
          <div className="flex">
            <FaListUl size={23} />
          </div>
          <div className="flex">
            <RxDashboard size={23} />
          </div>
        </div>

        <div className="mt-[5%]">
          <ScrollableTable data={data} columns={columns} />
        </div>
      </div>

      <div className="p-8"></div>
    </div>
  </>
)
}

export default AdvancedSearch