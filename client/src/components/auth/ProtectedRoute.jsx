import { Navigate } from 'react-router-dom'
import { useUser } from '../../hooks/useUser'

function ProtectedRoute({ children }) {
  const { data: user, isLoading, isError } = useUser()

  if (isLoading) {
    return <div>Auth loading</div>
  }

  if (!user?.data.isLogged || isError) {
    return <Navigate to="/login" replace />
  }

  return children
}
export default ProtectedRoute
