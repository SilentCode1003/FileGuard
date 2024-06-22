import ScrollableTable from '../components/utility/ScrollableTable';
import { useMemo, useState } from 'react';
import mData from '../MOCK_DATA.json';
import { useUser } from '../hooks/useUser';
import { fetchRecentFile } from '../hooks/getRecentFile';
import File from '../components/browse/file/File';
import FileIcon from '../components/utility/FileIcon';
import { HiDotsHorizontal } from 'react-icons/hi';

const DashBoard = () => {
  const { data: user } = useUser();
  const fullName = user.data.user.userFullname;

  const { data: recentFiles = [], isLoading, isError, error } = fetchRecentFile();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  const transformedData = recentFiles.map(file => ({
    fileName: file.fileName,
    fileType: file.fileName.split('.').pop(), // Extract file extension as fileType
    createdAt: file.createdAt
  }));

  const data = useMemo(() => (transformedData.length > 0 ? transformedData : mData), [transformedData]);

  /** @type import('@tanstack/react-table').ColumnDef<any> */
  const columns = [
    {
      header: 'File Name',
      accessorKey: 'fileName',
    },
    {
      header: 'File Type',
      accessorKey: 'fileType',
      cell: ({ row }) => {
        const file = row.original;
        return (
          <div className="flex items-center gap-2">
            <FileIcon extension={file.fileType} />
            <span>{file.fileType}</span>
          </div>
        );
      },
    },
    {
      header: 'Created',
      accessorKey: 'createdAt',
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
    },
    {
      header: '',
      accessorKey: 'edit',
      cell: ({ row }) => {
        const file = row.original;
        return (
          <div>
            <File file={file} extension={file.fileType}/>
          </div>
        );
      },
    },
    // {
    //   header: '',
    //   accessorKey: 'edit',
    //   cell: () => <HiDotsHorizontal className="text-black" size={23} />, // Render the icon in the cell
    // },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-[36px] p-6 tracking-wide mt-[3%]">
        Welcome back <span className="font-semibold">{fullName}</span>
      </h1>

      <h6 className="text-[20px] p-2 mt-[3%]">Recent Files</h6>
      <ScrollableTable data={data} columns={columns} />
    </div>
  );
};

export default DashBoard;


