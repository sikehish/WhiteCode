import { AuthProvider } from './context/AuthContext'
import App from './App'
import { BrowserRouter as Router } from 'react-router-dom'

function AuthWrapper() {
  return (
    <AuthProvider>
        <App />
    </AuthProvider>
  )
}

export default AuthWrapper