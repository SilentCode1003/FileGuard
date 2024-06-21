import { FcFolder, FcOpenedFolder } from 'react-icons/fc'

const FolderIcon = ({ isOpen, size = 25 }) => {
  const Icon = isOpen ? FcOpenedFolder : FcFolder
  return <Icon size={size} className="min-w-max" />
}

export default FolderIcon
