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
import Navbar from "./components/navbar";
import NotFoundPage from "./components/NotFoundPage";
import About from "./components/pages/About";
import Artisans from "./components/pages/Artisans";
import Collections from "./components/pages/Collections";
import Discover from "./components/pages/Discover";
import Home from "./components/pages/Home";
import Cart from "./components/pages/Cart";
import Products from './components/pages/Product';
import { UserAuthProvider } from "./UserAuthContext";
import ProductDetail from "./components/pages/ProductDetail";
import Favorites from "./components/pages/Favorites";

/** Private Route Check */
function PrivateRoute({ children }) {
  const storedUser = localStorage.getItem("user");
  let user = null;
  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
  }

  return user && user.role === "artisan" ? children : <Navigate to="/login" />;
}

/** Layout for Dashboard with Sidebar */
function DashboardLayout({ children }) {
  return (
    <div className="app">
      <Sidebar />
      <main className="content">
        <TopBar />
        {children}
      </main>
    </div>
  );
}

/** Layout for Public Pages (Navbar Only) */
function NavbarLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-20">
        {children}
      </main>
    </>
  );
}


/** Main App Content */
function AppContent() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<SignUp />} />
      <Route path="/" element={<NavbarLayout><Home /></NavbarLayout>} />
      <Route path="/home" element={<NavbarLayout><Home /></NavbarLayout>} />
      <Route path="/about" element={<NavbarLayout><About /></NavbarLayout>} />
      <Route path="/shop" element={<NavbarLayout><Products /></NavbarLayout>} />
      <Route path="/collections" element={<NavbarLayout><Collections /></NavbarLayout>} />
      <Route path="/discover" element={<NavbarLayout><Discover /></NavbarLayout>} />
      <Route path="/artisans" element={<NavbarLayout><Artisans /></NavbarLayout>} />
      <Route path="/cart" element={<NavbarLayout><Cart /></NavbarLayout>} />
      <Route path="/favorites" element={<NavbarLayout><Favorites /></NavbarLayout>} />

      <Route path="/products/:id" element={<NavbarLayout><ProductDetail /></NavbarLayout>} />

      {/* Private Routes (Dashboard) */}
      <Route path="/dashboard" element={<PrivateRoute><DashboardLayout><Dashboard /></DashboardLayout></PrivateRoute>} />
      <Route path="/products" element={<PrivateRoute><DashboardLayout><ProductTable /></DashboardLayout></PrivateRoute>} />

      {/* Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

/** Main App */
function App() {
  const [theme, colorMode] = useMode();

  return (
    <UserAuthProvider >
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppContent />
          <Toaster />
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
    </UserAuthProvider>
  );
}

export default App;
