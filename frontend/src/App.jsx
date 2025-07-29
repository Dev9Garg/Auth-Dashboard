import './App.css'
import {Routes, Route} from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// import components 
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx"

// import pages
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Signup from "./pages/Signup.jsx";
import Login from './pages/Login.jsx';

import AdminDashboard from './pages/AdminDashboard';

// import from context
import {useAuth} from "./context/AuthContext.jsx"


function App() {

  const {user} = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/user/login"
        // element={!user ? <Login /> : (!user.isAdmin ? <Navigate to="/user/dashboard" /> : <Navigate to="/admin/dashboard" />)}
        element={!user ? <Login /> : <Dashboard />}
      />

      <Route
        path="/user/signup"
        // element={!user ? <Signup /> : (!user.isAdmin ? <Navigate to="/user/dashboard" /> : <Navigate to="/admin/dashboard" />)}
        element={!user ? <Signup /> : <Dashboard />}
      />

      <Route
        path="/user/dashboard"
        element={
          <PrivateRoute>
            {/* {user.isAdmin ? <Navigate to='/admin/dashboard' /> : <Dashboard />} */}
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route 
        path='/admin/dashboard'
        element={
          <PrivateRoute>
            {/* {!user.isAdmin ? <Navigate to='/user/dashboard' /> : <AdminDashboard />} */}
            <AdminDashboard />
          </PrivateRoute>
        }
      />

      </Routes>
      <Footer />
      <Toaster />
    </>
  )
}

export default App
