import { createContext, useContext, useEffect, useState } from 'react';
import {authUrl} from "../config/config.js"
import axios from "axios"

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchProfile = () => {
    axios.get(`${authUrl}/users/profile`, {
      withCredentials: true
    })
    .then((res) => {
      setUser(res.data.data);
    })
    .catch((err) => {
      setUser(null)
    })
  };

  useEffect(() => {
    fetchProfile(); 
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
