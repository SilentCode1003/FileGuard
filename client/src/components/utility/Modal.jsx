import { FaArrowLeft } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
const Modal = ({ isOpen, onClose, style, children }) => {
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
          <motion.div
            className={`${style} bg-white`}
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

export default Modal
