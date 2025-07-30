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
import AllUsers from './pages/AllUsers.jsx'
import BlacklistedEmails from './pages/BlacklsitedEmails';

import AdminDashboard from './pages/AdminDashboard';

// import from context
import {useAuth} from "./context/AuthContext.jsx"
import UpdateUserDetails from './pages/UpdateUserDetails';


function App() {

  const { user, loading } = useAuth();

  if (loading) {
    return <div className='flex justify-center items-center font-bold text-4xl'>Loading...</div>; 
  }

  return (
    <div
    className='bg-[url(/bg-image.jpg)] bg-no-repeat bg-cover bg-center min-h-screen bg-fixed'
    >
      <Navbar />
      <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/user/login"
        element={!user ? <Login /> : (!user.isAdmin ? <Navigate to="/user/dashboard" /> : <Navigate to="/admin/dashboard" />)}
      />

      <Route
        path="/user/signup"
        element={!user ? <Signup /> : (!user.isAdmin ? <Navigate to="/user/dashboard" /> : <Navigate to="/admin/dashboard" />)}
      />

      <Route
        path="/user/update-details"
        element={!user ? <Signup /> : (!user.isAdmin ? <UpdateUserDetails /> : <Navigate to="/admin/dashboard" />)}
      />

      <Route
        path="/user/dashboard"
        element={
          <PrivateRoute>
            {!user ? (
              <Navigate to="/user/login" />
            ) : user.isAdmin ? (
              <Navigate to="/admin/dashboard" />
            ) : (
              <Dashboard />
            )}
          </PrivateRoute>
        }
      />

      <Route 
        path="/admin/dashboard"
        element={
          <PrivateRoute>
            {!user ? (
              <Navigate to="/user/login" />
            ) : !user.isAdmin ? (
              <Navigate to="/user/dashboard" />
            ) : (
              <AdminDashboard />
            )}
          </PrivateRoute>
        }
      />

      <Route
        path='/admin/dashboard/all-Users'
        element={
          <PrivateRoute>
            {!user ? (
              <Navigate to="/user/login" />
            ) : !user.isAdmin ? (
              <Navigate to="/user/dashboard" />
            ) : (
              <AllUsers />
            )}
          </PrivateRoute>
        }
      />

      <Route
        path='/admin/dashboard/blacklisted-emails'
        element={
          <PrivateRoute>
            {!user ? (
              <Navigate to="/user/login" />
            ) : !user.isAdmin ? (
              <Navigate to="/user/dashboard" />
            ) : (
              <BlacklistedEmails />
            )}
          </PrivateRoute>
        }
      />

      </Routes>
      <Footer />
      <Toaster />
    </div>
  )
}

export default App
