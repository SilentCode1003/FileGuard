import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileImage,
  FaFileAlt,
  FaFilePowerpoint,
} from 'react-icons/fa'

const FileIcon = ({ extension }) => {
  switch (extension) {
    case 'pdf':
      return <FaFilePdf className="text-red-500" />
    case 'docx':
      return <FaFileWord className="text-sky-700" />
    case 'xlsx':
      return <FaFileExcel className="text-green-600" />
    case 'pptx':
      return <FaFilePowerpoint className="text-red-500" />
    case 'png':
    case 'jpg':
    case 'jpeg':
      return <FaFileImage className="text-sky-400" />
    default:
      return <FaFileAlt />
  }
}

export default FileIcon
