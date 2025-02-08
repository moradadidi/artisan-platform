import { createContext, useContext, useEffect, useState } from "react";

// Create the Context
const UserAuthContext = createContext({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
});

export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Load user and token from localStorage on app start
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }, []);

  // Login Function
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
  };

  // Logout Function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <UserAuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </UserAuthContext.Provider>
  );
};

// ✅ Custom Hook to use UserAuthContext
export const useUserAuth = () => useContext(UserAuthContext);

export default UserAuthContext;
