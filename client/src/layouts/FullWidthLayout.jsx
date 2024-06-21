import { Outlet } from 'react-router-dom'

const FullWidthLayout = () => {
  return (
    <>
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default FullWidthLayout
