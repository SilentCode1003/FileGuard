import { useParams } from 'react-router-dom'

const Browse = () => {
  const params = useParams()
  const { '*': path } = params

  return <div className="text-center text-3xl p-8">{`${path}`}</div>
}

export default Browse
