import ScrollableTable from '../components/utility/ScrollableTable'
import { useMemo } from 'react'
import mData from '../MOCK_DATA.json'
import { HiDotsHorizontal } from 'react-icons/hi'

const DashBoard = () => {
  const data = useMemo(() => mData, [])

  /** @type import('@tanstack/react-table').ColumnDef<any> */
  const columns = [
    {
      header: 'File No.',
      accessorKey: 'id',
    },
    {
      header: 'File Name',
      // accessorFn: (row) => `${row.first_name} ${row.last_name}`,
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
    <div className="p-8">
      <h1 className="text-[36px] p-6 tracking-wide mt-[3%]">
        Welcome back <span className="font-semibold">@Username!</span>
      </h1>

      <h6 className="text-[20px] p-2 mt-[3%]">Recent Files</h6>
      <ScrollableTable data={data} columns={columns} />
    </div>
  )
}

export default DashBoard
