import { createContext, useContext, useEffect, useState } from "react";

// Create the Context
const UserAuthContext = createContext({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  updateProfilePicture: () => {},
});

export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Load user and token from sessionStorage on app start
  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem("user");
      const storedToken = sessionStorage.getItem("token");
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
    sessionStorage.setItem("user", JSON.stringify(userData));
    sessionStorage.setItem("token", authToken);
  };

  // Logout Function
  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    
  };

  // Update Profile Picture Function
  const updateProfilePicture = (newImageUrl) => {
    if (user) {
      const updatedUser = { ...user, profilePicture: newImageUrl };
      setUser(updatedUser);
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  return (
    <UserAuthContext.Provider value={{ user, token, login, logout, updateProfilePicture }}>
      {children}
    </UserAuthContext.Provider>
  );
};

// ✅ Custom Hook to use UserAuthContext
export const useUserAuth = () => useContext(UserAuthContext);

export default UserAuthContext;
