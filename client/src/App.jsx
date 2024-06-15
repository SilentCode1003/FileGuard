import { useState } from 'react'
import { apiClient } from './lib/api-client'

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await apiClient.post('/auth/login', { username, password })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Username
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label>
          Password
          <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}
export default App
