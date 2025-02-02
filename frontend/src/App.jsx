import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import TopBar from "./scenes/global/TopBar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import LoginForm from "./components/Login";
import SignUp from "./components/signup";
import { Navbar } from "./components/navbar";

function AppContent() {
  const location = useLocation();
  // Define routes that should not show the sidebar and header
  const authPaths = ["/login", "/register"];
  const isAuthPage = authPaths.includes(location.pathname);

  return isAuthPage ? (
    // For authentication pages, render only the routed component
    <main className="content">
      <Routes>
        <Route path="/login" element={<Navbar />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/nav" element={<Navbar />} />
        
      </Routes>
    </main>
  ) : (
    // For all other pages, include the sidebar and header
    <div className="app">
      <Sidebar />
      <main className="content">
        <TopBar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Other routes that need the sidebar and header can be added here */}
        </Routes>
      </main>
    </div>
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
