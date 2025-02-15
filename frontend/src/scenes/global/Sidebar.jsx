import { useState } from 'react';
import PropTypes from 'prop-types';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import {
  Home,
  User,
  ShoppingCart,
  Heart,
  MessageSquare,
  Bell,
  CreditCard,
  MapPin,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Package,
  Star,
  Receipt,
  Lock,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3BCEAC',
      light: '#4FD8B8',
      dark: '#2AA189',
    },
    background: {
      default: '#1A1B23',
      paper: '#1E1F28',
    },
    text: {
      primary: '#E0E0E0',
      secondary: '#A0A0A0',
    },
    error: {
      main: '#FF5757',
    },
    divider: 'rgba(255, 255, 255, 0.06)',
  },
});

const sidebarSections = [
  {
    title: 'Main',
    items: [{ title: 'Dashboard', icon: Home, path: '/dashboard' }],
  },
  {
    title: 'Products',
    items: [
      { title: 'All Products', icon: ShoppingCart, path: '/products' },    ],
  },
  {
    title: 'Orders & Purchases',
    items: [
      { title: 'My Orders', icon: Package, path: '/dashboard/orders' },
    ],
  },
  {
    title: 'Shopping & Wishlist',
    items: [
      { title: 'My Cart', icon: ShoppingCart, path: '/dashboard/cart' },
      { title: 'Wishlist', icon: Heart, path: '/dashboard/wishlist' },
    ],
  },
  {
    title: 'Reviews & Support',
    items: [
      { title: 'My Reviews', icon: Star, path: '/dashboard/reviews' },
      { title: 'Messages', icon: MessageSquare, path: '/dashboard/messages' },
    ],
  },
  
  
];

/**
 * SidebarItem now wraps the MenuItem with a Link to ensure navigation works.
 */
function SidebarItem({ icon: Icon, title, path, selected, setSelected, danger = false }) {
  const theme = useTheme();

  const itemColor =
    danger
      ? theme.palette.error.main
      : selected === title
      ? theme.palette.primary.main
      : theme.palette.text.secondary;

  return (
    <Link to={path} style={{ textDecoration: 'none', color: 'inherit' }}>
      <MenuItem
        active={selected === title}
        onClick={() => setSelected(title)}
        icon={
          <Icon
            size={18}
            color={itemColor}
          />
        }
        style={{
          color: itemColor,
          margin: '2px 0',
          borderRadius: '6px',
          backgroundColor: selected === title ? 'rgba(59, 206, 172, 0.08)' : 'transparent',
          transition: 'all 0.2s ease-in-out',
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontSize: '0.875rem',
            fontWeight: selected === title ? 500 : 400,
            color: itemColor,
          }}
        >
          {title}
        </Typography>
      </MenuItem>
    </Link>
  );
}

// Define propTypes for SidebarItem to satisfy eslint
SidebarItem.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  selected: PropTypes.string.isRequired,
  setSelected: PropTypes.func.isRequired,
  danger: PropTypes.bool,
};

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState('Dashboard');
  const theme = useTheme();
  const navigate = useNavigate();

  // Define logout in App so it’s available where it’s used.
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    toast.success('Logout successful!');
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Sidebar
          collapsed={isCollapsed}
          backgroundColor={theme.palette.background.paper}
          style={{
            border: `1px solid ${theme.palette.divider}`,
            height: '100vh',
          }}
          rootStyles={{
            '.ps-sidebar-container': {
              backgroundColor: theme.palette.background.paper,
            },
            '.ps-menu-button:hover': {
              backgroundColor: 'rgba(59, 206, 172, 0.04) !important',
            },
          }}
        >
          <Menu>
            {/* Minimal Header */}
            <Box
              sx={{
                padding: '20px 16px',
                borderBottom: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
                {/* Logo */}
                
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Box
                    component="img"
                    src="../../../public/Logo.png"
                    sx={{ width: '45%', height: '100%' , borderRadius: '95%' }}
                  />
                </Link>
              
              {/* Collapse Button */}
              <IconButton
                onClick={() => setIsCollapsed(!isCollapsed)}
                sx={{
                  color: theme.palette.text.secondary,
                  padding: '4px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  },
                }}
              >
                {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </IconButton>
            </Box>

            {/* Profile Section */}
            <Box
              sx={{
                padding: '20px 16px',
                borderBottom: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <Box
                  component="img"
                  src="../../../public/default.png"
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 8,
                    height: 8,
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: '50%',
                    border: `1.5px solid ${theme.palette.background.paper}`,
                  }}
                />
              </Box>
              {!isCollapsed && (
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 500,
                      color: theme.palette.text.primary,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    Ed Roh
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.text.secondary,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    VP Fancy Admin
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Navigation */}
            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                pt: 2,
                pb: 2,
              }}
            >
              {sidebarSections.map((section, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  {!isCollapsed && (
                    <Typography
                      variant="caption"
                      sx={{
                        px: 3,
                        py: 1,
                        color: theme.palette.text.secondary,
                        fontWeight: 500,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        fontSize: '0.6875rem',
                      }}
                    >
                      {section.title}
                    </Typography>
                  )}
                  {section.items.map((item) => (
                    <SidebarItem
                      key={item.title}
                      icon={item.icon}
                      title={item.title}
                      path={item.path}
                      selected={selected}
                      setSelected={setSelected}
                      danger={item.danger}
                    />
                  ))}
                </Box>
              ))}
            </Box>

            {/* Footer */}
            <Box
              sx={{
                borderTop: `1px solid ${theme.palette.divider}`,
                p: 2,
              }}
            >
              <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                <MenuItem
                  icon={<LogOut size={18} color={theme.palette.error.main} />}
                  onClick={logout}
                  rootStyles={{
                    borderRadius: '6px',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 87, 87, 0.04)',
                    },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.875rem',
                      color: theme.palette.error.main,
                      fontWeight: 500,
                    }}
                  >
                    Sign Out
                  </Typography>
                </MenuItem>
              </Link>
            </Box>
          </Menu>
        </Sidebar>
      </Box>
    </ThemeProvider>
  );
}

export default App;
