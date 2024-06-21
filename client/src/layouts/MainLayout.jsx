import ProtectedRoute from '../components/auth/ProtectedRoute'
import SideBar from '../components/sections/sidebar/SideBar'
import TopBar from '../components/sections/TopBar'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen md:flex-row">
        <SideBar />
        <main className="relative flex-1 flex-col w-full overflow-auto">
          <TopBar />
          <Outlet />
        </main>
      </div>
    </ProtectedRoute>
  )
}

export default MainLayout
