import { useState, useEffect } from 'react'
import { FaSearch } from 'react-icons/fa'
import { useFileSearch } from '../../hooks/fileSearch'
import { useFilePreview } from '../../hooks/filePreview'
import FileView from '../browse/file/FileView'

import { sanitizeFilePath } from '../../utiliy/utility'

const Search = () => {
  const [searchValue, setSearchValue] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [displaySuggestions, setDisplaySuggestions] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: searchResults } = useFileSearch(searchValue)

  useEffect(() => {
    if (searchResults && searchResults.data && searchValue.trim() !== '') {
      setSuggestions(searchResults.data)
      setDisplaySuggestions(true)
    } else {
      setDisplaySuggestions(false)
    }
  }, [searchResults, searchValue])

  const handleSuggestionClick = (suggestion) => {
    setSelectedSuggestion(suggestion)
    setSearchValue(suggestion.fileName)
    setDisplaySuggestions(false)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedSuggestion(null)
  }

  const { data: isLoading } = useFilePreview({
    filename: selectedSuggestion?.fileName,
    filePath: selectedSuggestion ? sanitizeFilePath(selectedSuggestion.filePath) : '',
  })
  console.log(selectedSuggestion)
  return (
    <>
      <div className="relative md:block hidden">
        <input
          type="text"
          id="top-bar-search"
          placeholder="Search"
          onChange={(e) => setSearchValue(e.target.value.trim())}
          autoComplete="off"
          className="border border-gray-300 rounded-lg py-2 px-4 w-[30rem] h-[2.5rem] focus:outline-none focus:border-sky-300"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <FaSearch className="h-5 w-5 text-sky-600" />
        </div>
        {displaySuggestions && (
          <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
            {suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.fileName}
                </div>
              ))
            ) : (
              <div className="py-2 px-4 text-gray-500">No suggestions found</div>
            )}
          </div>
        )}
      </div>
      {selectedSuggestion && (
        <FileView
          isOpen={isModalOpen}
          onClose={closeModal}
          data={selectedSuggestion}
          isLoading={isLoading}
        />
      )}
    </>
  )
}

export default Search
