import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import TopBar from "./scenes/global/TopBar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import LoginForm from "./components/Login";
import SignUp from "./components/signup";
import ProductTable from "./components/pages/products";
import { Navbar } from "./components/navbar";
import NotFoundPage from "./components/NotFoundPage";

function PrivateRoute({ children }) {
  // Retrieve the user from localStorage and parse it.
  const storedUser = localStorage.getItem("user");
  let user = null;
  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
  }

  // Check if user exists and if the role is "moderator"
  return user && user.role === "artisan" ? children : <Navigate to="/login" />;
}

function AppContent() {
  return (
    <main className="content">
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/nav" element={<Navbar />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <div className="app">
                <Sidebar />
                <main className="content">
                  <TopBar />
                  <Dashboard />
                </main>
              </div>
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <div className="app">
                <Sidebar />
                <main className="content">
                  <TopBar />
                  <Dashboard />
                </main>
              </div>
            </PrivateRoute>
          }
        />

        <Route
          path="/products"
          element={
            <PrivateRoute>
              <div className="app">
                <Sidebar />
                <main className="content">
                  <TopBar />
                  <ProductTable />
                </main>
              </div>
            </PrivateRoute>
          }
        />
  <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </main>
  );
}

function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppContent />
          <Toaster />
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
