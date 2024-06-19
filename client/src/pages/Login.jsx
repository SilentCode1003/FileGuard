import { useNavigate, useLocation } from 'react-router-dom'

import { ToastContainer, toast, Slide } from 'react-toastify'

import Logo from '../assets/img/file-guard-logo.png'
import { useState } from 'react'
import { apiClient } from '../lib/api-client'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await apiClient.post('/auth/login', { username, password })
      setUsername('')
      setPassword('')
      if (res?.status === 200) {
        toast.success('Login successful')
        navigate(from, { replace: true })
        // console.log(res)
      }
    } catch (err) {
      if (!err?.response) {
        toast.error('No server Response')
      } else if (err.response?.status === 401) {
        toast.error('Unauthorized')
      }
    }
  }

  return (
    <>
      <div className="flex mx-auto h-screen justify-center text-gray-500/95 bg-polygon-image bg-no-repeat bg-cover">
        <div className="flex flex-wrap m-4 my-12 w-full max-h-screen overflow-y-auto rounded-xl bg-white shadow-xl lg:flex-row lg:max-w-[33.34%] sm:m-24">
          <div className="md:flex-1 w-full my-auto">
            <div className="flex flex-col text-center">
              <img src={Logo} alt="logo" className="w-60 mx-auto" />
              <h1 className="text-black text-5xl tracking-wide pt-12">FileGuard Solution</h1>
            </div>
            <div className="flex flex-col py-12 px-10 md:px-20">
              <span className="text-left text-md mb-2">Please login to your account</span>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col static w-full">
                  <label
                    htmlFor="username"
                    className="text-sky-400 text-md font-medium relative top-3 ml-[7px] px-[3px] bg-white w-fit"
                  >
                    Username:
                  </label>
                  <input
                    type="text"
                    placeholder="Write here..."
                    name="username"
                    className="border-sky-400 px-[10px] py-[11px] text-md bg-white border rounded-[5px] focus:outline-none placeholder:text-black/25"
                    autoComplete="off"
                    id="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="flex flex-col static w-full">
                  <label
                    htmlFor="input"
                    className="text-sky-400 text-md font-medium relative top-3 ml-[7px] px-[3px] bg-white w-fit"
                  >
                    Password:
                  </label>
                  <input
                    type="password"
                    placeholder="Write here..."
                    name="input"
                    className="border-sky-400 px-[10px] py-[11px] text-md bg-white border rounded-[5px] focus:outline-none placeholder:text-black/25"
                    id="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button className="relative border mt-6 cursor-pointer text-white  overflow-hidden h-10 w-full rounded-md bg-sky-700/95 p-2 flex justify-center items-center font-extrabold">
                  <p className="z-10 text-xl tracking-wider">Login</p>
                </button>
              </form>
              <span className="text-md mx-auto pt-12 text-red-600 cursor-pointer hover:underline text-lg">
                Forgot password?
              </span>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer transition={Slide} />
    </>
  )
}

export default Login
