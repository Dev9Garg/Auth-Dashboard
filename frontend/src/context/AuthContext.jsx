import { createContext, useContext, useEffect, useState } from 'react';
import {authUrl} from "../config/config.js"
import axios from "axios"

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const fetchProfile = () => {
    axios.get(`${authUrl}/users/profile`, {
      withCredentials: true
    })
    .then((res) => {
      setUser(res.data.data);
    })
    .catch((err) => {
      setUser(null);
    })
    .finally(() => {
      setLoading(false); 
    });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
