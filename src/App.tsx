import './App.css'
import { BrowserRouter as Router} from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/nav';
import AppRoutes from './routes/AppRoutes';



function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Navbar/>
          <AppRoutes/>
        </Router>
      </AuthProvider>
    </>
  )
}

export default App
