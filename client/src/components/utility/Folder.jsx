import { FaFolder, FaFolderOpen } from 'react-icons/fa'

const Folder = ({ isOpen }) => {
  const Icon = isOpen ? FaFolderOpen : FaFolder
  return <Icon size={23} className="min-w-max text-yellow-400/90" />
}

export default Folder
