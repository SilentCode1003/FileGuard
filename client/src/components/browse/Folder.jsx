import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { FaEllipsisVertical } from 'react-icons/fa6'
const Folder = ({ folder }) => {
  const { pathname } = useLocation()

  return (
    <NavLink to={`${pathname}/${folder.name.toLowerCase()}`}>
      <div className="bg-slate-200/85 border border-slate-200/85 hover:bg-slate-100 hover:border-slate-100 rounded-md px-1 py-2 flex justify-center items-center gap-2 cursor-pointer">
        <div className="text-5xl basis-3/12">📁</div>
        <div className="text-sm truncate basis-7/12">{folder.name}</div>
        <div className="flex basis-2/12 justify-center align-middle">
          <div className="flex rounded-full hover:bg-slate-300/85 w-8 h-8 justify-center">
            <FaEllipsisVertical size={20} className="my-auto" />
          </div>
        </div>
      </div>
    </NavLink>
  )
}

export default Folder
