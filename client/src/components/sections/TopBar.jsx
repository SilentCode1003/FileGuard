// import { useState, useEffect } from 'react';
// import { FaSearch, FaRegUser } from 'react-icons/fa';
// import { TbDeviceImacSearch } from 'react-icons/tb';
// import { Menu, MenuButton, MenuItems, Transition } from '@headlessui/react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { SlLogout, SlSettings } from 'react-icons/sl';
// import { useLogout } from '../../api/auth/logout';
// import { useUser } from '../../hooks/useUser';
// import { useFileSearch } from '../../hooks/fileSearch';
// import { useFilePreview } from '../../hooks/filePreview';
// import Modal from '../utility/Modal';
// import Spinner from '../utility/Spinner';

// const TopBar = () => {
//   const { data: user } = useUser();
//   const fullName = user.data.user.userFullname;

//   const navigate = useNavigate();

//   const { mutateAsync: logout } = useLogout();

//   const handleLogout = async () => {
//     try {
//       await logout();
//       navigate('/login');
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const [inputValue, setInputValue] = useState('');
//   const [suggestions, setSuggestions] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedSuggestion, setSelectedSuggestion] = useState(null);

//   const { data: searchResults } = useFileSearch(inputValue);

//   useEffect(() => {
//     if (searchResults && searchResults.data && inputValue.trim() !== '') {
//       setSuggestions(searchResults.data);
//       setShowDropdown(true);
//     } else {
//       setShowDropdown(false);
//     }
//   }, [searchResults, inputValue]);

//   const handleInputChange = (e) => {
//     const value = e.target.value.trim();
//     setInputValue(value);
//   };

//   const handleSuggestionClick = (suggestion) => {
//     setSelectedSuggestion(suggestion);
//     setInputValue(suggestion.fileName);
//     setShowDropdown(false);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedSuggestion(null);
//   };

//   const { data: fileData, isLoading } = useFilePreview({
//     filename: selectedSuggestion?.fileName,
//     filePath: selectedSuggestion ? `${selectedSuggestion.filePath}` : '',
//   });

//   return (
//     <nav className="relative bg-white w-full h-[5rem] hidden md:block">
//       <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
//         <div className="flex h-20 items-center justify-between">
//           <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
//             <div className="relative md:block hidden">
//               <input
//                 type="text"
//                 id="top-bar-search"
//                 placeholder="Search"
//                 value={inputValue}
//                 onChange={handleInputChange}
//                 autoComplete='off'
//                 className="border border-gray-300 rounded-lg py-2 px-4 
//                   w-[30rem] h-[2.5rem] focus:outline-none
//                   focus:border-sky-300"
//               />
//               <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                 <FaSearch className="h-5 w-5 text-sky-600" />
//               </div>
//               {showDropdown && (
//                 <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
//                   {suggestions.length > 0 ? (
//                     suggestions.map((suggestion, index) => (
//                       <div
//                         key={index}
//                         className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
//                         onClick={() => handleSuggestionClick(suggestion)}
//                       >
//                         {suggestion.fileName}
//                       </div>
//                     ))
//                   ) : (
//                     <div className="py-2 px-4 text-gray-500">No suggestions found</div>
//                   )}
//                 </div>
//               )}
//             </div>

//             <NavLink to="/search">
//               <div>
//                 <h6 className="py-2 px-8 text-red-600 hover:scale-[1.1]">
//                   <TbDeviceImacSearch size={25} />
//                 </h6>
//               </div>
//             </NavLink>
//             <div className="md:ml-auto">
//               <div className="flex space-x-4">
//                 <Menu>
//                   <div className="my-auto text-lg">
//                     <p>Welcome! {fullName}</p>
//                   </div>
//                   <MenuButton className="inline-flex whitespace-nowrap items-center rounded-full p-2 text-lg hover:bg-gray-300">
//                     <FaRegUser size={25} />
//                   </MenuButton>
//                   <Transition
//                     enter="transition ease-out duration-75"
//                     enterFrom="opacity-0 scale-95"
//                     enterTo="opacity-100 scale-100"
//                     leave="transition ease-in duration-100"
//                     leaveFrom="opacity-100 scale-100"
//                     leaveTo="opacity-0 scale-95"
//                   >
//                     <MenuItems
//                       anchor="bottom start"
//                       className="w-[12rem] origin-top-right rounded border border-gray-300 bg-white p-1 mt-1 text-sm/6 text-gray-600 [--anchor-gap:var(--spacing-1)] focus:outline-none"
//                     >
//                       <NavLink
//                         to="#"
//                         className="group flex w-full items-center gap-2 rounded py-1.5 px-3 hover:bg-slate-200/85"
//                       >
//                         <div className="basis-2/12">
//                           <SlSettings className="size-4 text-black" />
//                         </div>
//                         <div className="basis-10/12">Settings</div>
//                       </NavLink>
//                       <NavLink
//                         to="#"
//                         className="group flex w-full items-center gap-2 rounded py-1.5 px-3 hover:bg-slate-200/85"
//                         onClick={handleLogout}
//                       >
//                         <div className="basis-2/12">
//                           <SlLogout className="size-4 text-black" />
//                         </div>
//                         <div className="basis-10/12">Logout</div>
//                       </NavLink>
//                     </MenuItems>
//                   </Transition>
//                 </Menu>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Modal isOpen={isModalOpen} onClose={closeModal}>
//         {selectedSuggestion && (
//           <div className="flex flex-col justify-between">
//             <h2 className="mx-auto text-xl font-bold mb-4">{selectedSuggestion.fileName}</h2>
//             <div className="flex flex-col lg:flex-row gap-4 h-[42rem]">
//               <div className="basis-full lg:basis-8/12 text-center border p-4 rounded">
//                 <p>{selectedSuggestion.fileName}</p>
//                 {isLoading ? (
//                   <Spinner size={30} />
//                 ) : (
//                   <embed
//                     src={`http://localhost:3000/files/preview/${selectedSuggestion.filePath}/${selectedSuggestion.fileName}`}
//                     className="w-full h-full"
//                   />
//                 )}
//               </div>
//               <div className="basis-full lg:basis-4/12 text-center border p-4 rounded">
//                 <p>{selectedSuggestion.fileName}</p>
//                 {isLoading ? (
//                   <Spinner size={30} />
//                 ) : (
//                   <embed
//                     src={`http://localhost:3000/files/preview/${selectedSuggestion.filePath}/${selectedSuggestion.fileName}`}
//                     className="w-full h-full"
//                   />
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </Modal>
//     </nav>
//   );
// };

// export default TopBar;


import { useState, useEffect } from 'react';
import { FaSearch, FaRegUser } from 'react-icons/fa';
import { TbDeviceImacSearch } from 'react-icons/tb';
import { Menu, MenuButton, MenuItems, Transition } from '@headlessui/react';
import { NavLink, useNavigate } from 'react-router-dom';
import { SlLogout, SlSettings } from 'react-icons/sl';
import { useLogout } from '../../api/auth/logout';
import { useUser } from '../../hooks/useUser';
import { useFileSearch } from '../../hooks/fileSearch';
import { useFilePreview } from '../../hooks/filePreview';
import Modal from '../utility/Modal';
import Spinner from '../utility/Spinner';
import sanitizeFilePath from '../browse/file/SanitizeFilePath ';


const TopBar = () => {
  const { data: user } = useUser();
  const fullName = user.data.user.userFullname;

  const navigate = useNavigate();

  const { mutateAsync: logout } = useLogout();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  };

  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  const { data: searchResults } = useFileSearch(inputValue);

  useEffect(() => {
    if (searchResults && searchResults.data && inputValue.trim() !== '') {
      setSuggestions(searchResults.data);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [searchResults, inputValue]);

  const handleInputChange = (e) => {
    const value = e.target.value.trim();
    setInputValue(value);
  };

  const handleSuggestionClick = (suggestion) => {
    setSelectedSuggestion(suggestion);
    setInputValue(suggestion.fileName);
    setShowDropdown(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSuggestion(null);
  };

  const { data: fileData, isLoading } = useFilePreview({
    filename: selectedSuggestion?.fileName,
    filePath: selectedSuggestion ? sanitizeFilePath(selectedSuggestion.filePath) : '',
  });


  return (
    <nav className="relative bg-white w-full h-[5rem] hidden md:block">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
            <div className="relative md:block hidden">
              <input
                type="text"
                id="top-bar-search"
                placeholder="Search"
                value={inputValue}
                onChange={handleInputChange}
                autoComplete='off'
                className="border border-gray-300 rounded-lg py-2 px-4 
                  w-[30rem] h-[2.5rem] focus:outline-none
                  focus:border-sky-300"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FaSearch className="h-5 w-5 text-sky-600" />
              </div>
              {showDropdown && (
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

            <NavLink to="/search">
              <div>
                <h6 className="py-2 px-8 text-red-600 hover:scale-[1.1]">
                  <TbDeviceImacSearch size={25} />
                </h6>
              </div>
            </NavLink>
            <div className="md:ml-auto">
              <div className="flex space-x-4">
                <Menu>
                  <div className="my-auto text-lg">
                    <p>Welcome! {fullName}</p>
                  </div>
                  <MenuButton className="inline-flex whitespace-nowrap items-center rounded-full p-2 text-lg hover:bg-gray-300">
                    <FaRegUser size={25} />
                  </MenuButton>
                  <Transition
                    enter="transition ease-out duration-75"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <MenuItems
                      anchor="bottom start"
                      className="w-[12rem] origin-top-right rounded border border-gray-300 bg-white p-1 mt-1 text-sm/6 text-gray-600 [--anchor-gap:var(--spacing-1)] focus:outline-none"
                    >
                      <NavLink
                        to="#"
                        className="group flex w-full items-center gap-2 rounded py-1.5 px-3 hover:bg-slate-200/85"
                      >
                        <div className="basis-2/12">
                          <SlSettings className="size-4 text-black" />
                        </div>
                        <div className="basis-10/12">Settings</div>
                      </NavLink>
                      <NavLink
                        to="#"
                        className="group flex w-full items-center gap-2 rounded py-1.5 px-3 hover:bg-slate-200/85"
                        onClick={handleLogout}
                      >
                        <div className="basis-2/12">
                          <SlLogout className="size-4 text-black" />
                        </div>
                        <div className="basis-10/12">Logout</div>
                      </NavLink>
                    </MenuItems>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {selectedSuggestion && (
          <div className="flex flex-col justify-between">
            <h2 className="mx-auto text-xl font-bold mb-4">{selectedSuggestion.fileName}</h2>
            <div className="flex flex-col lg:flex-row gap-4 h-[42rem]">
              <div className="basis-full lg:basis-8/12 text-center border p-4 rounded">
                <p>{selectedSuggestion.fileName}</p>
                {isLoading ? (
                  <Spinner size={30} />
                ) : (
                  <embed
                    src={`http://localhost:3000/files/preview/${sanitizeFilePath(selectedSuggestion.filePath)}/${selectedSuggestion.fileName}`}
                    type="application/pdf"
                    className="w-full h-full"
                  />
                )}
              </div>
              <div className="basis-full lg:basis-4/12 text-center border p-4 rounded">
                <p>{selectedSuggestion.fileName}</p>
                {isLoading ? (
                  <Spinner size={30} />
                ) : (
                  <embed
                    src={`http://localhost:3000/files/preview/${sanitizeFilePath(selectedSuggestion.filePath)}/${selectedSuggestion.fileName}`}
                    type="application/pdf"
                    className="w-full h-full"
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </nav>
  );
};

export default TopBar;





