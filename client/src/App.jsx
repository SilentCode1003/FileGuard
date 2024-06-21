import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'

//Layouts
import MainLayout from './layouts/MainLayout'
import FullWidthLayout from './layouts/FullWidthLayout'

//Main Layout Contents
import DashBoard from './pages/DashBoard'
import Browse from './pages/Browse'
import AdvancedSearch from './pages/AdvancedSearch'

//Full Width Layout Contents
import Login from './pages/Login'
import NotFound from './pages/NotFound'

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<DashBoard />} />
          <Route path="/search" element={<AdvancedSearch />} />
          <Route path="/browse/*" element={<Browse />} />
        </Route>
        <Route path="/" element={<FullWidthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<NotFound />} />
        </Route>
      </>,
    ),
  )
  return <RouterProvider router={router} />
}
export default App
