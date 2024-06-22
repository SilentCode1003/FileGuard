import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  // getSortedRowModel,
} from '@tanstack/react-table'

export default function ScrollableTable({ data, columns }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <>
      <div className="overflow-auto max-h-100 shadow-xl">
        <table className="min-w-full bg-white border border-gray-200 text-center">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="sticky top-0 px-4 py-2 bg-sky-800/95 h-[45px] text-white"
              >
                {headerGroup.headers.map((header) => (
                  <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                    {header.isPlaceholder ? null : (
                      <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
