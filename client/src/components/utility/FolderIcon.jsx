import { FaFolder, FaFolderOpen } from 'react-icons/fa'

const FolderIcon = ({ isOpen, size = 23 }) => {
  const Icon = isOpen ? FaFolderOpen : FaFolder
  return <Icon size={size} className="min-w-max text-yellow-400/90" />
}

export default FolderIcon
