import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  // Retrieve the user from localStorage
  const storedUser = localStorage.getItem("user");
  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
  }

  // Check if the user is logged in
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
