import { AuthProvider } from './context/AuthContext'
import App from './App'
import { BrowserRouter as Router } from 'react-router-dom'

function AuthWrapper() {
  return (
    <Router>
    <AuthProvider>
        <App />
    </AuthProvider>
    </Router>
  )
}

export default AuthWrapper