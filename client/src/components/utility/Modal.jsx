import React from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { FiDownload } from 'react-icons/fi'
import { MdOutlineDriveFileRenameOutline, MdDeleteOutline } from 'react-icons/md'

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-[999]">
        <div className="absolute top-4 right-6 flex space-x-2">
          <button className="text-xl rounded-full hover:bg-slate-200 p-2 text-white hover:text-gray-800">
            <FiDownload size={26} />
          </button>
          <button className="text-xl rounded-full hover:bg-slate-200 p-2 text-white hover:text-gray-800">
            <MdOutlineDriveFileRenameOutline size={26} />
          </button>
          <button className="text-xl rounded-full hover:bg-slate-200 p-2 text-white hover:text-gray-800">
            <MdDeleteOutline size={26} />
          </button>
        </div>
        <div className="bg-white rounded-lg w-10/12 h-5/6 p-4">
          <div className="flex justify-start">
            <button onClick={onClose} className="text-xl rounded-full hover:bg-slate-200 p-2">
              <FaArrowLeft />
            </button>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </>
  )
}

export default Modal
