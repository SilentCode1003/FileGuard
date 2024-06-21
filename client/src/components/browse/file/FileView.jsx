import React from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { FiDownload } from 'react-icons/fi'
import { MdOutlineDriveFileRenameOutline, MdDeleteOutline } from 'react-icons/md'
import { motion, AnimatePresence } from 'framer-motion'

const FileView = ({ isOpen, onClose, children }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-gray-900/70 bg-opacity-50 flex justify-center items-center z-[999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
        >
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
          <motion.div
            className="bg-white rounded-lg w-10/12 h-5/6 p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-start">
              <button onClick={onClose} className="text-xl rounded-full hover:bg-slate-200 p-2">
                <FaArrowLeft />
              </button>
            </div>
            <div>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default FileView
