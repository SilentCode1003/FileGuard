import { NavLink } from 'react-router-dom'
import { FaTriangleExclamation } from 'react-icons/fa6'

const NotFound = () => {
  return (
    <section className="text-center flex flex-col justify-center items-center  h-[100vh]">
      <FaTriangleExclamation className="text-yellow-400 text-8xl mb-4" />
      <div className="flex">
        <h1 className="text-6xl font-bold mb-4">404 Not Found</h1>
      </div>

      <p className="text-xl mb-5">This page does not exist</p>
      <NavLink to="/">
        <button className="text-white bg-red-500 rounded-md px-3 py-2 mt-4">Go Back</button>
      </NavLink>
    </section>
  )
}

export default NotFound
